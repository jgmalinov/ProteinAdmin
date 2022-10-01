export function pizzaEatingAnimation() {
    const sliceIds = ['slice1', 'slice2', 'slice3', 'slice4', 'slice5', 'slice6'];
    const playFunctions = []
    for (let i=0; i < sliceIds.length; i++) {
        const pizzaSlice = document.getElementById(sliceIds[i]);
        const keyframes = new KeyframeEffect(
            pizzaSlice,
            [{transform: 'scale(1)'}, {transform: 'scale(0.1)'}, {transform: 'scale(1)'}],
            {duration: 1000, iterations: 5}
        );
        const animation = new Animation(keyframes, document.timeline);
        function play() {
            animation.play();
        }
        playFunctions.push(play);
    };
    
    for (let i=0; i < playFunctions.length; i++) {
        const playFunction = playFunctions[i];
        playFunction();
    }
};