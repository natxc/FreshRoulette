import React from 'react';
import "./App.css";
import Header from './Header';
import ErrorBoundary from './ErrorBoundary';
import ScrollToTopButton from './ScrollToTopButton';

const About = () => {
    return (
        <ErrorBoundary>
            <Header />
            <h1 className="mt-5 text-center">What's The Deal Here?</h1>
            <div className="about-container">
                <ScrollToTopButton />

                <div className="about-content">
                    <p>
                        The idea for this project came about many years ago. It was the first time I had lived with a significant other.
                        We'd often joke over meals together, "I can't believe we have to decide on a meal and make it, 3 times a day, for the rest of
                        our lives." It's a daunting thought! The mental load, the planning, grocery shopping. Wanting to be healthy, and new or fun,
                        but not too difficult or take too long to make because we are busy.
                    </p>

                    <p>
                        Lucky for me, I married that same partner. Even luckier, she volunteers to do the grocery shopping, meal planning, and meal prepping
                        for us every week. She does a great job of making it healthy, tasty, and plenty of variety week to week. Not only does she do all of that,
                        but she also works full time. Oh, and is training for her second Ironman.
                    </p>

                    <p>
                        In true engineer fashion, I thought, "how can we solve this problem? How can we optimize or automate this process?" Sure, meal kits can be
                        a great option. The only downside is we want a lot more options, more flexibility, and fresher ingredients that we can choose ourselves.
                        Being able to improvise or swap out ingredients is nice also. Thus, this app was born!
                    </p>

                    <p>
                        While it was built for a specific purpose, it also fulfills another. My dream is to be a full-stack software engineer. I currently have 8 years of
                        experience working with data. I have become very technical from a data engineering and machine learning perspective. So it was not a problem whipping up
                        some Python scripts to extract and transform data. It didn't take too long to spin up a Postgres database and load that data either. The next phase was
                        design. Guess who has an undergrad in Marketing with a minor in Interactive Media? Yours truly.
                    </p>

                    <p>
                        <strong>Disclaimer:</strong> not intended to be copyrighted information or steal. And will data will be replaced with original data if requested. Also, a thank you to Kroger
                        API. Helped map ingredients to categories in a grocery store so my shopping list can be organized by aisle.
                    </p>

                    <p>
                        It was so fun putting each and every one of my skills together, learning new things, and building something that is so useful. Now, it is my favorite portfolio
                        showcase. I have no formal computer science degree, but please take this as a showcase of skills. And take my word that I work hard and always push myself to try
                        new things and never give up. Matter of fact - I am training alongside my wife for my first Ironman. During treadmill runs, I watch videos on data structures and algorithms,
                        and while pedaling away on the indoor trainer for hours - I code away to build my portfolio.
                    </p>

                    <p>
                        Anyway, I'll keep chugging along on this journey. Fueled by nutritious and delicious meals.
                    </p>

                    <p>
                        <strong>Added bonus:</strong> How would I market this?
                    </p>

                    <p>
                        I would add functionality to only use this service for a week. Like a trial run. The customer gets a taste (literally) of how easy and friendly the recipes are
                        and also an idea if they'll even like eating these recipes. Then I'll provide a nice parting gift. A coupon for x% off y number of meal-kit boxes. A nice try-before-you-buy
                        to add to the sales conversion funnel.

                        Additionally, I would add a feature for ratings and reviews. This way, companies can use this as a market research tool. They can gather sentiments on certain recipes or ingredients
                        and gain a new way to build a recommendation engine as well.
                    </p>

                    <img
                        src={"https://developer.kroger.com/assets/logos/integrated-blue-text.svg"}
                        alt="Kroger Logo"
                        className="about-image"
                    />

                </div>

                <footer className="container text-center">
                    <p>&copy; 2024</p>
                </footer>
            </div>
        </ErrorBoundary>
    );
};

export default About;