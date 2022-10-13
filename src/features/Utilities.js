import {Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import TrendlineLinearPlugin from 'chartjs-plugin-trendline';
import { Bar, Chart } from 'react-chartjs-2';

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

    labels = labels.map(label => label.slice(0, 10));
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
    const currentDate = new Date();
    const day = currentDate.getDate().toString();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString();
    const currentDateStr = `${year}-${month}-${day}`;
    if (timeSeries === 'default' || timeSeries === 'daily') {
        const currentDateIndex = labels.indexOf(currentDateStr);
        console.log(currentDateIndex);
        calculateTrend(labels.slice(0, currentDateIndex + 1), calories.slice(0, currentDateIndex + 1), protein.slice(0, currentDateIndex + 1));
    }
};

function calculateTrend(labels, calories, protein) {
    const xAxis = [];
    for (let i=1; i <= labels.length; i++) {
        xAxis.push(i);
    };
    const sumX = xAxis.reduce((a, b) => a + b);
    const sumYCal = calories.reduce((a, b) => a + b);
    const sumYProt = protein.reduce((a, b) => a + b);
    console.log(sumYCal);
}