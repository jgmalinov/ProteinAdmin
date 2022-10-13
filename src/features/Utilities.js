import {Chart as ChartJS, CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend} from 'chart.js';
import annotationPlugin from 'chartjs-plugin-annotation';
import { Bar, Chart } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, BarController, Title, Tooltip, Legend, annotationPlugin);
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
    const options = {
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
                        yValue: goalCalories - 0.05 * goalCalories,
                        content: `${goalCalories} kcal threshold`,
                        backgroundColor: 'rgba(245,245,245, 0.75)',
                        font: {size: 9}
                    },
                    line2: {
                        type: 'line',
                        yMin: goalProtein,
                        yMax: goalProtein,
                        borderColor: 'green',
                        borderWidth: 1
                    },
                    label2: {
                        type: 'label',
                        xValue: 1,
                        yValue: goalProtein + 0.05 * goalCalories,
                        content: `${goalProtein} g/protein threshold`,
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

    const data = {
        labels,
        datasets: [
            {
                label: 'Calories',
                data: calories,
                backgroundColor: 'blue'
            },
            {
                label: 'Protein',
                data: protein,
                backgroundColor: 'green'
            }
        ]
    };

    return {data, options, labels, calories, protein};
};

export function createBarChart(timeSeries, barChartData) {
    let chart;
    const data = {...barChartData.data};
    const options = {...barChartData.options};
    const labels = [...barChartData.labels];
    const protein = [...barChartData.protein];
    const calories = [...barChartData.calories];
    
    if (timeSeries === 'default') {
        const ctx = document.getElementById('myChart').getContext('2d');
        const oldChart = ChartJS.getChart('myChart'); 
        if (oldChart) {
            oldChart.destroy();
        }; 
        chart = new ChartJS(ctx, {
            type: 'bar',
            data,
            options
        })
    } else {
        chart = ChartJS.getChart('myChart');
        chart.data.labels = labels;
        chart.options = options;
        chart.data.datasets[0].data = calories;
        chart.data.datasets[1].data = protein;
        chart.update();
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