/* Flipping Card Styles */
.featured - recipe - card {
    width: 400px;
    height: 500px;
    perspective: 1000px;
    cursor: pointer;
    margin: 20px auto;
}

.featured - recipe - inner {
    width: 100 %;
    height: 100 %;
    position: relative;
    transition: transform 0.6s;
    transform - style: preserve - 3d;
}

.featured - recipe - card.flipped.featured - recipe - inner {
    transform: rotateY(180deg);
}

/* Front and Back */
.featured - recipe - front,
.featured - recipe - back {
    width: 100 %;
    height: 100 %;
    position: absolute;
    backface - visibility: hidden;
    border - radius: 10px;
    box - shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
    background - color: #fff;
    display: flex;
    flex - direction: column;
    align - items: center;
}

.featured - recipe - front {
    overflow: hidden;
}

/* Back Side - Nutrition */
.featured - recipe - back {
    background: #fafafa;
    text - align: center;
    padding: 20px;
    transform: rotateY(180deg);
}

/* Nutrition Facts */
.performance - facts {
    border: 1px solid black;
    padding: 10px;
    width: 90 %;
    text - align: left;
}

.performance - facts__title {
    font - weight: bold;
    font - size: 1.5rem;
}

.performance - facts__table {
    width: 100 %;
    border - collapse: collapse;
}

.performance - facts__table th,
.performance - facts__table td {
    padding: 5px;
    border - top: 1px solid black;
}

.thick - row th,
.thick - row td {
    border - top: 5px solid black;
}

.flip - instruction {
    font - size: 0.8rem;
    color: #777;
}

/* Image with Overlay */
.featured - recipe - image - container {
    position: relative;
    width: 100 %;
    height: 200px;
}

.featured - recipe - image {
    width: 100 %;
    height: 100 %;
    object - fit: cover;
}

.featured - recipe - overlay {
    position: absolute;
    top: 0;
    width: 100 %;
    background: rgba(0, 0, 0, 0.5);
    color: #fff;
    padding: 10px;
    text - align: center;
    font - size: 1.2rem;
    font - weight: bold;
}

/* Tooltip for Ingredients */
.ingredients - tooltip {
    position: relative;
    display: inline - block;
    cursor: pointer;
}

.ingredients - tooltip.tooltip - text {
    visibility: hidden;
    width: 200px;
    background - color: rgba(0, 0, 0, 0.8);
    color: #fff;
    text - align: left;
    padding: 10px;
    border - radius: 5px;
    position: absolute;
    top: 25px;
    left: 50 %;
    transform: translateX(-50 %);
    z - index: 1;
    font - size: 0.85rem;
}

.ingredients - tooltip: hover.tooltip - text {
    visibility: visible;
}

/* Button */
.view - recipe - button {
    background - color: #ff5c5c;
    color: #fff;
    border: none;
    border - radius: 5px;
    padding: 10px 20px;
    font - size: 1rem;
    cursor: pointer;
    text - decoration: none;
}

.view - recipe - button:hover {
    background - color: #e54b4b;
}
