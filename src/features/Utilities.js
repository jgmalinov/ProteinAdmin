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
    return weight * 1.7;
}

export function getCalories(goal, weight, height, age, gender, activityLevel) {
    const genderAdjustment = gender === 'male' ? 5 : -161;
    const maintenanceCalories = ((10 * weight) + (6.25 * height) - (5 * age) + genderAdjustment) * activityFactors[activityLevel];
    const goalCalories = goal === 'gain' ? maintenanceCalories + 300 : maintenanceCalories - 300;
    console.log(maintenanceCalories, goalCalories);
    return {maintenanceCalories, goalCalories};
};