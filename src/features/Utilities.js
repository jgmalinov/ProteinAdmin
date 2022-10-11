import {Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend} from 'chart.js';


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);
const monthlyLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

let options, data;

export async function BarChartConfig(timeSeries, ref, email) {
    const url = process.env.REACT_APP_BACKEND_URL;
    let response;
    if (timeSeries === 'default' || timeSeries === 'daily') {
        response = await fetch(url + `get/chartdata/daily/?user=${email}`, {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
    };
    if (timeSeries === 'monthly') {
        response = await fetch(url + `get/chartdata/monthly/?user=${email}`, {headers: {'Content-Type': 'application/json'}, credentials: 'include'});
    };
    const responseJS = await response.json();
    const chartData = responseJS.data;
    const labels = chartData[0];
    const calories = chartData[1];
    const protein = chartData[2];

    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: 'top'
            },
            title: {
                display: true,
                text: `${timeSeries} breakdown`
            }
        }
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

    if (timeSeries === 'default') {
        return {options, data};
    };

    const chart = ref.current;
    chart.data.labels = labels;
    chart.data.datasets[0].data = calories;
    chart.data.datasets[1].data = protein;
    chart.update();
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
    console.log(maintenanceCalories, goalCalories);
    return {maintenanceCalories, goalCalories};
};