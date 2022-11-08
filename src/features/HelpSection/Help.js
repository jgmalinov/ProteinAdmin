import { Link } from "react-router-dom"

export function Help() {
    return (
        <div id="help">
            <div id="helpHeader">
                <div style={{'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center'}}>
                    <Link to='/dashboard'><i class="fa-solid fa-backward-step"></i></Link>
                    <h1 className="textLogo">Protein Admin</h1>
                </div>


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
                        <p>This is where most of the magic actually happens. A single click on the rectangular <i class="fa-solid fa-magnifying-glass"></i> icon located in the middle of the dashboard's
                            header will reveal it to be search bar itself as it expands to its working state. Here, you will be presented with two
                            alternatives for entering your nutritional data. For one, you can directly start typing into the search bar which will look into our ever-expanding
                            database for available food entries that you can select and automatically have their nutritional value (calories and protein exclusively) added to your 'cart'.
                            The database will be filtered in accordance with the text you enter, but you can also click on the <i class="fa-solid fa-filter"></i> icon on the top-right to expand a couple of select fields underneath the search bar
                            which allow you to sieve through the data by category and subcategory (e.g meat - chicken).
                            Alternatively, you can double-click the <i class="fa-solid fa-magnifying-glass"></i> to change to manual mode (<i class="fa-regular fa-keyboard"></i>), where you can enter the calories and protein per 100g yourself. In both modes, you will have to
                            enter the amount of food (in grams) as well. Once you click <i class="fa-brands fa-golang"></i>, the app will calculate the calories and protein for you and save them to your cart.
                            At any time, you can click on <i class="fa-solid fa-caret-down"></i> to expand the cart itself, where you can review the items you have added and remove any if you deem necessary.
                            Once you have completed all of the intended data inputs, selecting 'CONFIRM' will send your meal/s to your daily menu.
                        </p>
                    </li>
                    <li><h4>The Daily Menu</h4>
                        <p>
                            The daily menu table can be revealed by selecting <i class="fa-solid fa-utensils"></i> on the top-right end of the dashboard. It represents a table that displays all of the data
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
                                <li><strong>Average (daily/monthly) calorie/protein intake.</strong> The mean calorie/protein intake per day for the last 30 days or per month for the last 12 months, depending on whether you have selecting the daily or monthly dashboard view (elaborated upon later in the manual)</li>
                                <li><strong>Average daily/monthly deviation from calorie/protein goal.</strong> This is how many kcal/grams of protein away from your daily/monthly goal you are, on average, for the last 30 days/12 months</li>
                                <li><strong>Average weekly % change in protein/calorie intake.</strong> For this metric, each period (30 days or 12 months) is divided into quarters. An average deviation from the target calories/protein is taken for each quarter. The changes in this deviation from quarter to quarter are taken in percentages and an average of those percentage is finally taken to arrive at the final value. 
                                In a sense, this is a numeric representation of the intake trend, which tells you, on average, whether you are approaching or deviating from your target during the observed period of time.</li>
                                <li><strong>Protein/calories until today's target met.</strong> This one pertains only to the daily dashboard view and is rather straightforward. It tells you how much calories/protein you have left to consume until you meet your daily targets.</li>
                            </ul>  
                        </p>
                    </li>

                    <li><h4>The charts</h4>
                        <p>There are two bar charts on-screen at all times, one dedicated to calories and the other to protein, with the time periods laid out along the x-axis and the calories/protein values mapped on the y-axis. Underneath the charts,
                            there are the options to choose between a daily or a monthly distribution. The dashboard defaults to the daily variant, wherein the charts adjust to show the user's nutritional data for the last 30 days, while switching over to 
                            'monthly' will result in the charts showcasing a segregation of the last 12 months instead. The flashcards above also respond to a change in the view mode.
                        </p>                
                    </li>

                    <li><h4>The Sidebar</h4>
                        <p>Finally, clicking on the rightmost icon with the three horizontal bars will reveal the sidebar, where you can access the options to edit your profile,
                            contribute to the database if you have admin rights, or log out of your profile.
                        </p>
                    </li>
                </ul>
            </div>
        </div>
    )
}