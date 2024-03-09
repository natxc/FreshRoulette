from bs4 import BeautifulSoup
import requests
import pandas as pd
import numpy as np
from fractions import Fraction
import os
import time
import uuid
import webbrowser

'''
Scrapes to grab recipes including: 
instructions, images, ingredients, nutrional facts, time, difficulty, etc.

Requests an input of a category and a number of recipes.

Outputs an html file of random recipes so there is a nice visual of the recipe 
and a shopping list that combines all the ingredients across recipes.

'''

# Existing recipe file
FILE_PATH = './recipes.pkl'

def get_soup(url):
    response = requests.get(url) # , verify = False)
    return BeautifulSoup(response.content, 'lxml', from_encoding = 'utf8')

def get_base_categories():
    url = 'https://www.hellofresh.com'
    soup = get_soup(url + '/recipes/')
    div_tags = soup.findAll('div', attrs = {'class': 'web-bmezv0'})[3:9] # Ignore the first few tags as they are empty & the last one because it's a catch-all
    category = [recipe.text for div in div_tags for recipe in div.findAll('h2', attrs = {'data-test-id': 'recipe-slider-title'})]
    link = [url + div.a['href'] for div in div_tags] 
    return pd.DataFrame({'Category': category, 'Link': link})

# TODO: Optimize this function
def format_ingredients(ingredient_tags):
    ingredients = []
    rec_ing = []
    for index, element in enumerate(ingredient_tags): # Choose recipe in index
            if any('serving 4' in s for s in ingredient_tags): # These are already set for 4
                if index % 2 == 0:
                    quantity = element
                else:
                    ingredient = element
            else:
                if index % 2 == 0:
                    quantity = element.split(' ')[0]
                # Multipy to accomodate 4 servings
                    try:
                        if element == 'unit':
                            quantity = 'unit'
                        elif element == 'box':
                            quantity = 'box'
                        elif element == '':
                            quantity = ''
                        elif quantity == '½':
                            quantity = '1 ' + str(element.split(' ')[1:][0])
                        elif quantity ==  '¼':
                            quantity = '0.5 ' + str(element.split(' ')[1:][0])
                        elif quantity ==  '¾':
                            quantity = '1.5 ' + str(element.split(' ')[1:][0])
                        else:
                            quantity = str(int(float(quantity))*2) + ' ' + str(element.split(' ')[1:][0])
                    except:
                        if index % 2 == 0:
                            quantity = element
                        else:
                            ingredient = element
                else:
                    ingredient = element
            try:
                rec_ing.append(quantity + ' ' + ingredient)
            except:
                pass
    ingredients.append(rec_ing[1::2])
    return ingredients[0]

def get_recipe_info(recipe_url):
    recipe_soup = get_soup(recipe_url)

    # Nutrition information
    nutrition_values = [x.text for div in recipe_soup.findAll('div', attrs = {'data-test-id': 'items-per-serving'}) for x in div.findAll('span')]
    nutrition = nutrition_values[4:-2]  # Ignores: energy, calories, and sodium

    # Total time and Cooking Difficulty
    total_time = [x.text for div in recipe_soup.findAll('div', attrs = {'class': 'sc-a6821923-0 kuiNX'}) for x in div.findAll('span')]
    time, difficulty = (total_time[1], total_time[-1]) if len(total_time) == 4 else (total_time[2], total_time[-1]) # Sometimes the text is repeated

    # Instructions
    instructions_container = recipe_soup.findAll('div', {'data-test-id': 'instructions'})
    instructions = [step.text for subdiv in instructions_container for step in subdiv.findAll('p')]
    
    # Ingredients
    ingredient_tags = [x.text for div in recipe_soup.findAll('div', attrs = {'data-test-id': 'ingredients-list'}) for x in div.findAll('p') if '(Contains' not in x.text] # Skip the allergy portions
    recipe_ingredient = format_ingredients(ingredient_tags)   
    
    # PDF links
    pdf_links = [x.get('href', 'None') for x in recipe_soup.findAll('a', attrs = {'data-test-id': 'recipe-pdf'})] # Some might not have a PDF

    return nutrition, time, difficulty, instructions, recipe_ingredient, pdf_links

def combine_ingredients_as_df(dataframe):
    all_ingredients = []

    for ingredients_list in dataframe['Ingredients']:
        all_ingredients.extend(ingredients_list)

    # Convert ingredient list to lowercase to ensure case-insensitivity
    all_ingredients = [ingredient.lower() for ingredient in all_ingredients]

    # Create a df with ingredients and quantities
    combined_df = pd.DataFrame({'Ingredient': all_ingredients})
    
    # Extract quantity and ingredient using regex
    combined_df[['Quantity', 'Ingredient']] = combined_df['Ingredient'].str.extract(r'([\d.]+)?\s*(\S.*)')

    # Convert quantity to numeric, handle non-numeric entries as NaN
    combined_df['Quantity'] = pd.to_numeric(combined_df['Quantity'], errors = 'coerce')

    # Fill NaN values with 1 (for entries without explicit quantity)
    combined_df['Quantity'].fillna(1, inplace = True)

    # Define a function to handle ingredient strings
    def process_ingredient(x):
        try:
            return eval(x) if pd.notnull(x) else 1
        except (SyntaxError, NameError):
            return 1

    # Multiply quantity by the corresponding value
    combined_df['Quantity'] = combined_df['Quantity'] * combined_df['Ingredient'].map(process_ingredient)

    # Group by ingredient and sum the quantities
    combined_df = combined_df.groupby('Ingredient')['Quantity'].sum().reset_index()
    
    # TODO: somehow sort them by how they appear at the grocery store?? with external API?
    # TODO: convert into quantities that make more sense for shopping (i.e. not gonna buy 20 tablespoons of flour)

    return combined_df[['Quantity', 'Ingredient']]

def printProgressBar (iteration, total, prefix = '', suffix = '', decimals = 1, length = 100, fill = '█', printEnd = '\r'):
    percent = ('{0:.' + str(decimals) + 'f}').format(100 * (iteration / float(total)))
    filledLength = int(length * iteration // total)
    bar = fill * filledLength + '-' * (length - filledLength)
    print(f'\r{prefix} |{bar}| {percent}% {suffix}', end = printEnd)
    if iteration == total: 
        print()

def make_recipe_pickl():
    base_categories = get_base_categories()

    recipe_data = []
    recipe_titles = []
    recipe_links = []
    recipe_images = []

    printProgressBar(0, 1, prefix = 'Progress:', suffix = 'Complete', length = 50)
    for i, category_row in base_categories.iterrows():
        urls = category_row['Link'] + '?page=100'  # A reasonable cap. Some have more, some have less.

        # Loop through recipes
        soup = get_soup(urls)
        section = soup.findAll('div', attrs = {'data-test-id': 'search-result-section'})

        for div in section:
            for rec in div.findAll('div', attrs = {'data-test-id': 'recipe-image-card-description'}):
                recipe_titles.append(rec.text)
            for x in div.findAll('a'):
                if '?page=' not in x['href']: # Sometimes there will be a load more button
                    recipe_links.append(x['href'])
            for img in div.findAll('img'):
                recipe_images.append(img['src'])

            # Get recipe information
            for index, recipe_url in enumerate(recipe_links):
                nutrition, time, difficulty, instructions, recipe_ingredient, pdf_links = get_recipe_info(recipe_url)
                recipe_data.append({
                    'Recipe': recipe_titles[index],
                    'Meal_Category': category_row['Category'],
                    'Link': recipe_url,
                    'Images': recipe_images[index],
                    'Total_Time': time,
                    'Cooking_Difficulty': difficulty,
                    'Instructions': [f'Step {i + 1}: {step}' for i, step in enumerate(instructions)], # Add 'Step: x' to the instructions
                    'Nutrition_List': nutrition,
                    'Ingredients': recipe_ingredient,
                    'PDF': pdf_links[0] if pdf_links else None
                })
        printProgressBar(i + 1, 10, prefix = 'Progress:', suffix = 'Complete', length = 50)
        
    # Create final df and perform some quick tweaks
    final_df = pd.DataFrame(recipe_data).drop_duplicates(subset = ['Recipe', 'Link']).reset_index(drop = True)
    
    # Add a UUID for future steps
    final_df['UUID'] = [str(uuid.uuid4()) for _ in range(len(final_df))]

    final_df.to_pickle(FILE_PATH)
    
    return final_df
    
def main():
    # Use existing file or loop through the categories to get recipe info
    if os.path.exists(FILE_PATH):
        final_df = pd.read_pickle(FILE_PATH)
    else:
        final_df = make_recipe_pickl()
    
    # Print outs and gathering inputs
    print('''
██     ██ ███████ ██       ██████  ██████  ███    ███ ███████     ████████  ██████           
██     ██ ██      ██      ██      ██    ██ ████  ████ ██             ██    ██    ██          
██  █  ██ █████   ██      ██      ██    ██ ██ ████ ██ █████          ██    ██    ██          
██ ███ ██ ██      ██      ██      ██    ██ ██  ██  ██ ██             ██    ██    ██          
 ███ ███  ███████ ███████  ██████  ██████  ██      ██ ███████        ██     ██████  ██ ██ ██ 
''')
    time.sleep(1)
    print('''
 _____  ____     ___  _____ __ __  ____   ___   __ __  _        ___ ______  ______    ___ 
|     ||    \   /  _]/ ___/|  |  ||    \ /   \ |  |  || |      /  _]      ||      |  /  _]
|   __||  D  ) /  [_(   \_ |  |  ||  D  )     ||  |  || |     /  [_|      ||      | /  [_ 
|  |_  |    / |    _]\__  ||  _  ||    /|  O  ||  |  || |___ |    _]_|  |_||_|  |_||    _]
|   _] |    \ |   [_ /  \ ||  |  ||    \|     ||  :  ||     ||   [_  |  |    |  |  |   [_ 
|  |   |  .  \|     |\    ||  |  ||  .  \     ||     ||     ||     | |  |    |  |  |     |
|__|   |__|\_||_____| \___||__|__||__|\_|\___/  \__,_||_____||_____| |__|    |__|  |_____|                                                                                                                                              
''')
    
    print('\nAvailable Categories:')
    categories = final_df['Meal_Category'].unique()

    for i, category in enumerate(categories, 1):
        print(f'{i}. {category}')
    
    while True:
        category_choice = int(input('\n\nEnter the number of the category you want: '))
        if 1 <= category_choice <= 6:
            selected_category = categories[category_choice - 1]
            break
        else:
            print('\nInvalid input. Please enter a number between 1-6.')

    filtered_data = final_df[final_df['Meal_Category'] == selected_category]

    while True:
        num_recipes = int(input('\nHow many recipes do you want: '))
        if num_recipes <= len(filtered_data):
            selected_recipes = filtered_data.sample(n = num_recipes, random_state = 1)
            break
        else:
            print('\nInvalid input. Please enter a lower number.')

    result_df = combine_ingredients_as_df(selected_recipes)

    # Apply formatting and convert df to HTML
    selected_recipes[['Instructions', 'Ingredients']] = selected_recipes[['Instructions', 'Ingredients']].applymap(lambda x: [s.replace('\n', ' ') for s in x])
    # TODO: find better encoder/decoder
    selected_recipes[['Instructions', 'Ingredients']] = selected_recipes[['Instructions', 'Ingredients']].applymap(lambda x: [s.encode('utf8').decode('ascii', 'ignore') for s in x])

    def format_link(link):
        return f'<a href = "{link}" target = "_blank">{link}</a>'

    def format_image(link):
        return f'<img src = "{link}" alt = "Image" style = "width:200px";>'
    
    def replace_comma_with_colon(lst):
        result = [lst[i] + ': ' + lst[i + 1] if i % 2 == 0 else lst[i] for i in range(0, len(lst), 2)]
        return result

    selected_recipes['PDF'] = selected_recipes['PDF'].apply(format_link)
    selected_recipes['Link'] = selected_recipes['Link'].apply(format_link)
    selected_recipes['Images'] = selected_recipes['Images'].apply(format_image)
    
    selected_recipes['Nutrition_List'] = selected_recipes['Nutrition_List'].apply(replace_comma_with_colon)
    
    selected_recipes['Instructions'] = selected_recipes['Instructions'].apply(lambda items: '<ul><li>' + '</li><li>'.join(items) + '</li></ul>')
    selected_recipes['Ingredients'] = selected_recipes['Ingredients'].apply(lambda items: '<ul><li>' + '</li><li>'.join(items) + '</li></ul>')
    selected_recipes['Nutrition_List'] = selected_recipes['Nutrition_List'].apply(lambda items: '<ul><li>' + '</li><li>'.join(items) + '</li></ul>')

    selected_recipes = selected_recipes[['Recipe', 'Images', 'Total_Time', 'Cooking_Difficulty', 'PDF', 'Nutrition_List', 'Ingredients', 'Instructions']]
    recipe_df = selected_recipes.to_html(escape = False, classes = 'custom-table', index = False)  # escape = False to render HTML in DataFrame
    
    # TODO: import widgets to add checkboxes to items?
    grocery_df = result_df.to_html(classes = 'custom-table', index = False)
    
    combined_html = f'''
        <html lang = 'en'>
        <head>
            <meta charset = 'UTF-8'>
            <meta name = 'viewport' content = 'width = device-width, initial-scale = 1.0'>
            <title>This Week's Mealprep</title>
            <style>
                body {{
                    font-family: 'Arial', sans-serif;
                    margin: 20px;
                    background-color: #f5f5f5;
                }}

                h2 {{
                    color: #333;
                    border-bottom: 2px solid #ddd;
                    padding-bottom: 5px;
                }}

                .table-container {{
                    overflow-x: auto;
                    margin-top: 20px;
                }}

                .custom-table {{
                    border-collapse: collapse;
                    width: 100%;
                    overflow-y: auto;
                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                    background-color: #fff;
                    border-radius: 8px;
                    margin-bottom: 20px;
                }}

                .custom-table th,
                .custom-table td {{
                    border: 1px solid #ddd;
                    text-align: left;
                    padding: 12px;
                    white-space: nowrap;
                }}

                .custom-table th {{
                    background-color: #f2f2f2;
                }}

                .custom-table th:first-child,
                .custom-table td:first-child {{
                    min-width: 150px;
                }}

                .custom-table th:nth-child(2),
                .custom-table td:nth-child(2) {{
                    min-width: 200px;
                }}

                .list-items {{
                    list-style: none;
                    padding: 0;
                    margin: 0;
                }}

                .list-items li {{
                    margin-bottom: 5px;
                }}

                @media (max-width: 768px) {{
                    .custom-table th,
                    .custom-table td {{
                        font-size: 14px;
                    }}
                }}
            </style>
        </head>
        <body>
            <h2>Recipe Information</h2>
            <div class = 'table-container'>
                {recipe_df}
            </div>
            <h2>Grocery List</h2>
            <div class = 'table-container'>
                {grocery_df}
            </div>
        </body>
        </html>
    '''

    with open('index.html', 'w') as file:
        file.write(combined_html)

    print('\nYour recipes have been saved to your desktop, along with a shopping list of all the combined ingredients. Bon appétit!')
    
    file.close()
 
    filename = 'file:///' + os.getcwd() + '/index.html'
    webbrowser.open_new_tab(filename)

if __name__ == '__main__':
    main()