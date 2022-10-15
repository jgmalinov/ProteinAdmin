import {Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import TrendlineLinearPlugin from 'chartjs-plugin-trendline';
import { Bar, Chart } from 'react-chartjs-2';
import regression from 'regression';
import {abs, std} from 'mathjs';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, annotationPlugin, TrendlineLinearPlugin);

const monthlyLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

let options, data;

export async function BarChartConfig(timeSeries, ref, email, goalCalories, goalProtein) {
    const url = process.env.REACT_APP_BACKEND_URL;
    let response;
    if (timeSeries === 'default' || timeSeries === 'daily') {
        response = await fetch(url + `get/chartdata/daily/?user=${email}`, {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
    };
    if (timeSeries === 'monthly') {
        response = await fetch(url + `get/chartdata/monthly/?user=${email}`, {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
    };
    const responseJS = await response.json();
    const chartData = responseJS.chartData;
    let labels = chartData.labels;
    const calories = chartData.calories;
    const protein = chartData.protein;
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
                        xValue: 1,
                        yValue: goalCalories + 0.05 * goalCalories,
                        content: `${goalCalories} kcal threshold`,
                        backgroundColor: 'rgba(245,245,245, 0.75)',
                        font: {size: 9}
                    }
                }
            },
            autocolors: false,
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `${timeSeries} breakdown`
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
        xValue: 1,
        yValue: goalProtein + 0.05 * goalProtein,
        content: `${goalProtein} g/protein threshold`,
        backgroundColor: 'rgba(245,245,245, 0.75)',
        font: {size: 9}
    }


    const dataCalories = {
        labels,
        datasets: [
            {
                label: 'Calories',
                data: calories,
                backgroundColor: 'blue',
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
                backgroundColor: 'green',
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
        if (oldCalorieChart) {
            oldCalorieChart.destroy();
        };
        if (oldProteinChart) {
            oldProteinChart.destroy();
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
    const sliceRanges = labels.length === 12 ? [{start: 0, end: 3}, {start: 3, end: 6}, {start: 6, end: 9}, {start: 9}] : [{start: 0, end: 8}, {start: 8, end: 16}, {start: 16, end: 24}, {start: 24}] 
    const segregatedCalories = {first: {calories: calories.slice(sliceRanges[0].start, sliceRanges[0].end), stat: std(calories.slice(sliceRanges[0].start, sliceRanges[0].end))}, second: {calories: calories.slice(sliceRanges[1].start, sliceRanges[1].end), stat: std(calories.slice(sliceRanges[1].start, sliceRanges[1].end))}, third: {calories: calories.slice(sliceRanges[2].start, sliceRanges[2].end), stat: std(calories.slice(sliceRanges[2].start, sliceRanges[2].end))}, fourth: {calories: calories.slice(sliceRanges[3].start), stat: std(calories.slice(sliceRanges[3].start))}};
    const segregatedProtein = {first: {protein: protein.slice(sliceRanges[0].start, sliceRanges[0].end), stat: std(protein.slice(sliceRanges[0].start, sliceRanges[0].end))}, second: {protein: protein.slice(sliceRanges[1].start, sliceRanges[1].end), stat: std(protein.slice(sliceRanges[1].start, sliceRanges[1].end))}, third: {protein: protein.slice(sliceRanges[2].start, sliceRanges[2].end), stat: std(protein.slice(sliceRanges[2].start, sliceRanges[2].end))}, fourth: {protein: protein.slice(sliceRanges[3].start), stat: std(protein.slice(sliceRanges[3].start))}};
    const deviationFromGoalCalories = [], deviationFromGoalProtein = [];
    let stdCaloriesOverall, stdProteinOverall, meanProteinOverall, stdChangeCalories, meanChangeProtein, absTrendCalories, absTrendProtein, caloriesLeftNow, proteinLeftNow; 
    
    const currentDateIndex = labels.indexOf(currentDate);
    const xAxis = [];
    for (let i=1; i <= labels.length; i++) {
        xAxis.push(i);
    };
    let regressionCaloriesData = [];
    let regressionProteinData = [];
    for (let i=0; i < xAxis.length; i++) {
        regressionCaloriesData.push([xAxis[i], calories[i]]);
        regressionProteinData.push([xAxis[i], protein[i]]);

        deviationFromGoalCalories.push(abs(calories[i] - goalCalories));
        deviationFromGoalProtein.push(abs(protein[i] - goalProtein));
    };

    const regressionCalories = regression.linear(regressionCaloriesData);
    const slopeCalories = regressionCalories.equation[0];
    const regressionProtein = regression.linear(regressionProteinData);
    const slopeProtein = regressionProtein.equation[0];

    stdCaloriesOverall = (deviationFromGoalCalories.reduce((a, b) => a + b) / deviationFromGoalCalories.length).toFixed(2);
    stdProteinOverall = (deviationFromGoalProtein.reduce((a, b) => a + b) / deviationFromGoalProtein.length).toFixed(2);
    meanProteinOverall = (protein.reduce((a, b) => a + b)) / protein.length;

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


    absTrendCalories = slopeCalories > 0 ? 'positive' : slopeCalories === 0 ? 'none' : 'negative';
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

    caloriesLeftNow = goalCalories - calories[currentDateIndex];
    proteinLeftNow = goalProtein - protein[currentDateIndex];
    console.log(segregatedCalories, segregatedProtein);
    console.log(caloriesLeftNow, proteinLeftNow);

    return (segregatedCalories, absTrendCalories, stdCaloriesOverall, caloriesLeftNow,  segregatedProtein, absTrendProtein, meanProteinOverall, proteinLeftNow);
     
    
};

/* mean absolute deviation */