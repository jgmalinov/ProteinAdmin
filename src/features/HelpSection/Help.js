export function Help() {
    return (
        <div id="help">
            <div id="helpHeader">
                <h1 className="textLogo">Protein Admin</h1>

                <div className='logo'>
                    <i>&#128170;</i>
                    <i className='fa-solid fa-utensils'></i>
                    <div className="secondBicep">
                        <i>&#128170;</i>
                    </div>
                </div>
            </div>

            <div id="helpBody">
                <h2>Application manual</h2>
                <h3>This section is dedicated to familiarizing you with the app's functionality and helping interpret the various data 
                    points there are so that you can make the most of what it has to offer. 
                </h3>
                <ul>
                    <li><h4>The Search Bar</h4>
                        <p>This is where most of the magic actually happens. A single click on the rectangular icon located in the middle of the dashboard's
                            header will reveal that this is in fact the search bar itself as it expands to its working regime. Here, you will be presented with two
                            alternatives for entering your nutritional data. For one, you can directly start typing into the search bar which will look up our ever-expanding
                            database for readily available foods entries that you can select and automatically have their nutritional value (calories and protein only) added to your 'cart'.
                            The database will be filtered by the text you enter, but you can also click on the 'filter' icon on the top-right to expand a couple of select fields underneath the search bar
                            which allow you to sieve through the data by category and subcategory (e.g meat - chicken).
                            Alternatively, you can double-click the magnifying glass to change to manual mode, where you can enter the calories and protein per 100g yourself. In both modes, you will have to
                            enter the amount of food (in grams) as well. Once you click 'Go', the app will calculate the calories and protein for you and save them to your cart.
                            At any time, you can click on the downward-facing icon to expand the cart itself, where you can review the items you have added and remove any if you deem necessary.
                            Once you have completed all of the intended data inputs, selecting 'confirm' will send your meal/s to your daily menu.
                        </p>
                    </li>
                    <li><h4>The Daily Menu</h4>
                        <p>
                            The daily menu table can be revealed by selecting the fork-and-knife icon on the top-right end of the dashboard. It represents a table that displays all of the data
                            that you have submitted throughout the day. You have another opportunity here to remove incorrect entries by clicking on the red 'X' on the far-end of each row. 
                            Once you are comfortable with the data at hand, you can select 'COMMIT' to have that data permanently added to your profile data, which will immediately reflect on the
                            dashboard charts and Flashcards. Committed entries cannot be changed going forward and their status as such will be indicated by the respective row being greyed out in the Daily Menu table.    
                        </p>
                    </li>

                    <li><h4>The Flashcards</h4>
                        <p>There are four cards on the dashboard, positioned directly under the header where the search bar is. The two on the left-hand side display your personal data and your fitness goal and 
                            corresponding calorie and protein intake recommendations based on that data and calculated via the Mifflin St Jeor method. These are non-interactive.
                            On the right-hand side are the two Flashcards. Their front sides present a simplified view that inform you how many calories/protein you have consumed today against their respective targets/daily goals.
                            Upon clicking on each of those cards, they will flip, providing a more comprehensive analysis on the back of the cards. The following is an explanation of the various data points: 
                            <ul>
                                <li><strong>Calorie/Protein intake trend.</strong> This lets you know if you are getting further away from your calorie goal or sticking to it more strictly / whether you are falling short of protein goal or achieving/exceeding it</li>
                                <li><strong>Average (daily/monthly) calorie/protein intake.</strong>The mean calorie/protein intake per day for the last 30 days or per month for the last 12 months, depending on whether you have selecting the daily or monthly dashboard view (elaborated upon later in the manual)</li>
                                <li><strong>Average daily/monthly deviation from calorie/protein goal</strong>This is how many kcal/grams of protein away from your daily/monthly goal you are, on average, for the last 30 days/12 months</li>
                                <li><strong>Average weekly % change in protein/calorie intake</strong>For this metric, each period (30 days or 12 months) is divided into quarters. An average deviation from the target calories/protein is taken for each quarter. The changes in this deviation from quarter to quarter are taken in percentages and an average of those percentage is finally taken to arrive at the final value. 
                                In a sense, this is a numeric representation of the intake trend, which tells you, on average, whether you are approaching or deviating from your target during the observed period of time.</li>
                                <li><strong>Protein/calories met until today's target met</strong>This one pertains only to the daily dashboard view and is rather straightforward. It tells you how much calories/protein you have left to consume until you meet your daily targets.</li>
                            </ul>  
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    )
}