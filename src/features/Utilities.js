import {Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import TrendlineLinearPlugin from 'chartjs-plugin-trendline';
import { Bar, Chart } from 'react-chartjs-2';
import regression from 'regression';
import {abs, std} from 'mathjs';
import e from 'cors';
import { store } from '../app/store';
import { Provider } from 'react-redux';
import {unstable_HistoryRouter as Router, Routes, Route} from 'react-router-dom';
import { render } from '@testing-library/react';
import App from '../App';

function customRender(path, history, options) {
    render(
        <Provider store={store}>
            <Router history={history}>
                <App />
            </Router>
        </Provider>,
        {...options});
};


ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, annotationPlugin, TrendlineLinearPlugin);

const monthlyLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

let options, data;

export async function BarChartConfig(timeSeries, ref, email, goalCalories, goalProtein) {
    const url = process.env.REACT_APP_BACKEND_URL;
    let response, labels, calories, protein;
    if (timeSeries === 'default' || timeSeries === 'daily') {
        response = await fetch(url + `get/chartdata/daily/?user=${email}`, {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
    };
    if (timeSeries === 'monthly') {
        response = await fetch(url + `get/chartdata/monthly/?user=${email}`, {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
    };
    const responseJS = await response.json();
    const chartData = responseJS.chartData;
    const chartType = responseJS.chartType;
    if ( chartType === 'monthly') {
        labels = chartData.labels.slice(0, chartData.labels.length - 1);
        calories = (chartData.calories.map((calorie) => calorie === null ? 0 : calorie)).slice(0, chartData.calories.length - 1);
        protein = (chartData.protein.map((protein) => protein === null ? 0 : protein)).slice(0, chartData.protein.length - 1);
    } else {
        labels = chartData.labels.slice(1);
        calories = (chartData.calories.map((calorie) => calorie === null ? 0 : calorie)).slice(1);
        protein = (chartData.protein.map((protein) => protein === null ? 0 : protein)).slice(1);   
    };

    labels = labels.map(label => new Date(label).toDateString());
    /* labels = labels.map(label => label.slice(0, 10)); */
    const optionsCalories = {
        responsive: true,
        responsiveAnimationDuration: 1000,
        maintainAspectRatio: false,
        plugins: {
            annotation: {
                annotations: {
                    line1: {
                        type: 'line',
                        yMin: goalCalories,
                        yMax: goalCalories,
                        borderColor: 'blue',
                        borderWidth: 1
                    },
                    label1: {
                        type: 'label',
                        xValue: 3,
                        yValue: goalCalories - 0.16 * goalCalories,
                        content: `${Number(goalCalories).toFixed(1)} kcal threshold`,
                        backgroundColor: 'rgba(245,245,245, 0.4)',
                        font: {size: 12}
                    }
                }
            },
            autocolors: false,
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: (timeSeries === 'default' || timeSeries === 'daily') ? `Daily Breakdown` : 'Monthly Breakdown'
            },
        },
    };

    let optionsProtein = JSON.parse((JSON.stringify(optionsCalories))); 
    optionsProtein.plugins.annotation.annotations.line1 = {
        type: 'line',
        yMin: goalProtein,
        yMax: goalProtein,
        borderColor: 'green',
        borderWidth: 1
    };
    optionsProtein.plugins.annotation.annotations.label1 = {
        type: 'label',
        xValue: 3,
        yValue: goalProtein + 0.25 * goalProtein,
        content: `${Number(goalProtein).toFixed(1)} g/protein threshold`,
        backgroundColor: 'rgba(245,245,245, 0.4)',
        font: {size: 12}
    }


    const dataCalories = {
        labels,
        datasets: [
            {
                label: 'Calories',
                data: calories,
                backgroundColor: 'rgb(150, 180, 216)',
                trendlineLinear: {
                    colorMin: "black",
                    colorMax: "black",
                    lineStyle: "dotted",
                    width: 2, 
                },
            },
        ]
    };

    const dataProtein = {
        labels,
        datasets: [
            {
                label: 'Protein',
                data: protein,
                backgroundColor: 'rgb(220, 220, 176)',
                trendlineLinear: {
                    colorMin: "black",
                    colorMax: "black",
                    lineStyle: "dotted",
                    width: 2, 
                },
            }
        ]
    };

    return {dataCalories, dataProtein, optionsCalories, optionsProtein, labels, calories, protein};
};

export function createBarChart(timeSeries, barChartData) {
    let chart1;
    let chart2;
    const dataCalories = {...barChartData.dataCalories};
    const dataProtein = {...barChartData.dataProtein};
    const optionsCalories = {...barChartData.optionsCalories};
    const optionsProtein = {...barChartData.optionsProtein};
    const labels = [...barChartData.labels];
    const protein = [...barChartData.protein];
    const calories = [...barChartData.calories];
    
    if (timeSeries === 'default') {
        const ctxCalories = document.getElementById('CalorieChart').getContext('2d');
        const ctxProtein = document.getElementById('ProteinChart').getContext('2d');
        const oldCalorieChart = ChartJS.getChart('CalorieChart');
        const oldProteinChart = ChartJS.getChart('ProteinChart'); 

        if (oldCalorieChart && oldProteinChart) {
            return
        };

        chart1 = new ChartJS(ctxCalories, {
            type: 'bar',
            data: dataCalories,
            options: optionsCalories
        });
        chart2 = new ChartJS(ctxProtein, {
            type: 'bar',
            data: dataProtein,
            options: optionsProtein
        }); 

    } else {
        chart1 = ChartJS.getChart('CalorieChart');
        chart1.data.labels = labels;
        chart1.options = optionsCalories;
        chart1.data.datasets[0].data = calories;
        chart1.update();

        chart2 = ChartJS.getChart('ProteinChart');
        chart2.data.labels = labels;
        chart2.options = optionsProtein;
        chart2.data.datasets[0].data = protein;
        chart2.update();
    }
};

    

const activityFactors = {
    BMR: 1,
    Sedentary: 1.2,
    Light: 1.375,
    Moderate: 1.465,
    Active: 1.55,
    'Very Active': 1.725,
    'Extra Active': 1.9
};

export function getAge(dob) {
    const ageInDays = (Date.now() - Date.parse(dob)) / (1000 * 60 * 60 * 24);
    const age = Math.floor(ageInDays / 365); 
    return age
};

export function getProtein(weight) {
    return (weight * 1.7).toFixed(2);
}

export function getCalories(goal, weight, height, age, gender, activityLevel) {
    const genderAdjustment = gender === 'male' ? 5 : -161;
    const maintenanceCalories = (((10 * weight) + (6.25 * height) - (5 * age) + genderAdjustment) * activityFactors[activityLevel]).toFixed(2);
    const goalCaloriesNotFixed = goal === 'gain' ? maintenanceCalories + 300 : goal === 'maintain' ? maintenanceCalories : maintenanceCalories - 300;
    const goalCalories = Number(goalCaloriesNotFixed).toFixed(2);
    return {maintenanceCalories, goalCalories};
};

export function calculateCurrentStatus(labels, calories, protein, timeSeries, goalCalories, goalProtein) {
    const currentDate = new Date().toDateString();
    const labelRemainder = labels.length % 4
    const labelsInAQuarter = (labels.length - labelRemainder) / 4;
    let currentQuarterIndex = 0;
    let currentQuarterCount = [];
    let sliceRanges = [{start: 0, end: 0}, {start: 0, end: 0}, {start: 0, end: 0}, {start: 0}];

    for (let i = 0; i <= labels.length; i++) {
        if (currentQuarterIndex !== 3) {
            if (currentQuarterCount.length === 0) {
                sliceRanges[currentQuarterIndex].start = i;
                currentQuarterCount.push('+');
            } else if (currentQuarterCount.length === (labelsInAQuarter)){
                sliceRanges[currentQuarterIndex].end = i;
                currentQuarterIndex += 1;
                sliceRanges[currentQuarterIndex].start = i;
                currentQuarterCount = ['+'];
            } else {
                currentQuarterCount.push('+');
            }
        } else {
            sliceRanges[currentQuarterIndex].start = i;
            break;
        }  
    };

    const segregatedCalories = {first: {calories: calories.slice(sliceRanges[0].start, sliceRanges[0].end), stat: std(calories.slice(sliceRanges[0].start, sliceRanges[0].end))}, 
                                second: {calories: calories.slice(sliceRanges[1].start, sliceRanges[1].end), stat: std(calories.slice(sliceRanges[1].start, sliceRanges[1].end))}, 
                                third: {calories: calories.slice(sliceRanges[2].start, sliceRanges[2].end), stat: std(calories.slice(sliceRanges[2].start, sliceRanges[2].end))}, 
                                fourth: {calories: calories.slice(sliceRanges[3].start), stat: std(calories.slice(sliceRanges[3].start))}};

    const segregatedProtein = {first: {protein: protein.slice(sliceRanges[0].start, sliceRanges[0].end), stat: std(protein.slice(sliceRanges[0].start, sliceRanges[0].end))}, 
                               second: {protein: protein.slice(sliceRanges[1].start, sliceRanges[1].end), stat: std(protein.slice(sliceRanges[1].start, sliceRanges[1].end))}, 
                               third: {protein: protein.slice(sliceRanges[2].start, sliceRanges[2].end), stat: std(protein.slice(sliceRanges[2].start, sliceRanges[2].end))}, 
                               fourth: {protein: protein.slice(sliceRanges[3].start), stat: std(protein.slice(sliceRanges[3].start))}};

    const deviationFromGoalCalories = [], deviationFromGoalProtein = [];
    let stdCaloriesOverall, stdProteinOverall, meanCaloriesOverall, meanProteinOverall, stdChangeCalories, meanChangeProtein, absTrendCalories, absTrendProtein, caloriesLeftNow, proteinLeftNow; 
    
    const currentDateIndex = labels.indexOf(currentDate);
    const xAxis = [];
    for (let i=1; i <= labels.length; i++) {
        xAxis.push(i);
    };
    let regressionCaloriesData = [];
    let regressionProteinData = [];
    for (let i=0; i < xAxis.length; i++) {
        deviationFromGoalCalories.push(abs(calories[i] - goalCalories));
        deviationFromGoalProtein.push(abs(protein[i] - goalProtein));

        regressionCaloriesData.push([xAxis[i], deviationFromGoalCalories[i]]);
        regressionProteinData.push([xAxis[i], protein[i]]);


    };

    const regressionCalories = regression.linear(regressionCaloriesData);
    const slopeCalories = regressionCalories.equation[0];
    const regressionProtein = regression.linear(regressionProteinData);
    const slopeProtein = regressionProtein.equation[0];

    stdCaloriesOverall = (deviationFromGoalCalories.reduce((a, b) => a + b) / deviationFromGoalCalories.length).toFixed(2);
    meanCaloriesOverall = (calories.reduce((a, b) => a + b) / calories.length).toFixed(2);
    stdProteinOverall = (deviationFromGoalProtein.reduce((a, b) => a + b) / deviationFromGoalProtein.length).toFixed(2);
    meanProteinOverall = ((protein.reduce((a, b) => a + b)) / protein.length).toFixed(2);

    const calorieStats = [], proteinStats = [];

    for (let quarter in segregatedCalories) {
        let quarterCaloriesDeviations = segregatedCalories[quarter].calories.map((calorie) => abs(calorie - goalCalories));
        const stdQuarterCalories = (quarterCaloriesDeviations.reduce((a, b) => a + b) / quarterCaloriesDeviations.length).toFixed(2);
        segregatedCalories[quarter].stat = stdQuarterCalories;
        calorieStats.push(segregatedCalories[quarter].stat);

        const meanQuarterProtein = ((segregatedProtein[quarter].protein.reduce((a, b) => a + b)) / segregatedProtein[quarter].protein.length).toFixed(2);
        segregatedProtein[quarter].stat = meanQuarterProtein;
        proteinStats.push(segregatedProtein[quarter].stat);
    };


    absTrendCalories = slopeCalories < 0 ? 'positive' : slopeCalories === 0 ? 'none' : 'negative';
    absTrendProtein = slopeProtein > 0 ? 'positive' : slopeProtein === 0 ? 'none' : 'negative';

    
    for (let i=0; i < calorieStats.length; i++) {
        let indexToKeyMapping = {0: 'first', 1: 'second', 2: 'third', 3: 'fourth'}
        const calorieStat = calorieStats[i];
        const proteinStat = proteinStats[i];
        if (i > 0) {
            const previousCalorieStat = calorieStats[i - 1];
            const percentageChangeCalorieStat = ((calorieStat / previousCalorieStat) - 1) * 100 * -1;
            segregatedCalories[indexToKeyMapping[i]].percentageChange = percentageChangeCalorieStat;

            const previousProteinStat = proteinStats[i - 1];
            const percentageChangeProteinStat = ((proteinStat / previousProteinStat) - 1) * 100;
            segregatedProtein[indexToKeyMapping[i]].percentageChange = percentageChangeProteinStat;
        } else {
            segregatedCalories[indexToKeyMapping[i]].percentageChange = 'baseline';
            segregatedProtein[indexToKeyMapping[i]].percentageChange = 'baseline';
        };
    };

    caloriesLeftNow = currentDateIndex !== -1 ? goalCalories - calories[currentDateIndex] : 0;
    proteinLeftNow = currentDateIndex !== -1 ? goalProtein - protein[currentDateIndex] : 0;

    stdChangeCalories = ((segregatedCalories.second.percentageChange + segregatedCalories.third.percentageChange + segregatedCalories.fourth.percentageChange) / 3).toFixed(2);
    meanChangeProtein = ((segregatedProtein.second.percentageChange + segregatedProtein.third.percentageChange + segregatedProtein.fourth.percentageChange) / 3).toFixed(2);

    return {segregatedCalories, absTrendCalories, stdCaloriesOverall, stdChangeCalories, caloriesLeftNow, meanCaloriesOverall, stdProteinOverall,  segregatedProtein, absTrendProtein, meanProteinOverall, meanChangeProtein, proteinLeftNow};
     
    
};

/* mean absolute deviation */



export function removeElement(parentElement) {
    setTimeout(() => {
        parentElement.removeChild(parentElement.lastChild);
    }, 5000)
};

export function expandSearchBar(inputMethod) {
    const autocompleteContainer = document.getElementById('autocompleteContainer');
    const autocompleteSubmitButton = document.getElementById('autocompleteSubmitButton');
    const autocompleteModifyButton = document.getElementById('autocompleteModifyButton');
    const autocompleteCartButton = document.getElementById('autocompleteCartButton');
    const autocompleteCartContainer = document.getElementById('autocompleteCartContainer');
    const currentBatchContainer = document.getElementById('currentBatchContainer');
    
    if (currentBatchContainer.style.height === '120px') {
        expandCurrentBatch();
     }

    if (autocompleteContainer.style.width === '2rem') {
        autocompleteContainer.style.width = '100%';
        autocompleteCartButton.disabled = false;
        autocompleteCartContainer.style.width = '85px';
        
        if (inputMethod === 'search') {
            const autocompleteSearchBar = document.getElementById('autocompleteSearchBar');
            const autocompleteWeightBar = document.getElementById('autocompleteWeightBar');
            autocompleteSearchBar.style.width = '70%';
            autocompleteWeightBar.style.width = '20%';
            autocompleteWeightBar.style.border = 'solid 1.5px black';
            autocompleteWeightBar.style.borderRadius = '5px';
        } else {
            const batchInputs = document.getElementsByClassName('batchInputs');
            for (let i=0; i < batchInputs.length; i++) {
                batchInputs[i].style.width = '25%'
                batchInputs[i].style.borderRight = '1px solid black';
            }
        };
    
    } else {
        autocompleteContainer.style.width = '2rem';
        autocompleteCartButton.disabled = true;
        autocompleteCartContainer.style.width = '0px';

        if (inputMethod === 'search') {
            const autocompleteSearchBar = document.getElementById('autocompleteSearchBar');
            const autocompleteWeightBar = document.getElementById('autocompleteWeightBar');
            autocompleteSearchBar.style.width = '0px';
            autocompleteWeightBar.style.width = '0px';
            autocompleteWeightBar.style.border = 'none';
            autocompleteWeightBar.style.borderRadius = '0px';
        } else {
            const batchInputs = document.getElementsByClassName('batchInputs');
            for (let i=0; i < batchInputs.length; i++) {
                batchInputs[i].style.width = '0px';
                batchInputs[i].style.borderRight = 'none';
            }
        }
    };
};

export function expandCurrentBatch(e) {
    const currentBatch = document.getElementById('currentBatchContainer');
    const searchBarContainer = document.getElementById('searchBarContainer');
    const backgroundImage = document.querySelector('#dashboard', ':before');
    if (currentBatch.style.height === '0px') {
        currentBatch.style.height = '120px';
        searchBarContainer.style.border = '1px solid black';
        searchBarContainer.style.borderRadius = '3px';
        searchBarContainer.style.marginTop = '12px';
        backgroundImage.style.height = '120%';
    } else {
        currentBatch.style.height = '0px';
        searchBarContainer.style.border = 'none';
        searchBarContainer.style.borderRadius = '0px';
        searchBarContainer.style.marginTop = '6px';
        backgroundImage.style.height = '110%';
    }
};

export * from '@testing-library/react';
export {customRender as render};