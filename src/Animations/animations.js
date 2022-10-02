export function pizzaEatingAnimation() {
    const sliceIds = ['slice1', 'slice2', 'slice3', 'slice4', 'slice5', 'slice6'];
    const playFunctions = [];
    let delay = 500;
    let angle = 0;
    let duration = 3000;
    const transformOrigin = 'transform-origin: bottom left';

    for (let i=0; i < sliceIds.length; i++) {
        let transform = `translate(0%, 100%) rotate(${angle}deg) skew(6.5deg, 6.5deg)`; 
        const pizzaSlice = document.getElementById(sliceIds[i]);
        const keyframes = new KeyframeEffect(
            pizzaSlice,
            [{transform: transform , 'transform-origin': transformOrigin, opacity: '1'}, {transform: transform, 'transform-origin': transformOrigin, opacity: '0'}],
            {duration: duration, iterations: 1, delay: delay, easing: "cubic-bezier(0, 0, 0, 6)"}
        );
        const animation = new Animation(keyframes, document.timeline);
        animation.onfinish = () => {console.log(`Ending at: ${Date.now()}`)};
        function play() {
            animation.play();
            console.log(`Playing at: ${Date.now()}`);
        }
        playFunctions.push({play});
        angle += 60;
        delay += 500;
        duration -= 500;
    };
    
    function animationFrames() {
        for (let i=0; i < playFunctions.length; i++) {
            if (!playFunctions[0].timestamp) {
                playFunctions[0].timestamp = Date.now();
                playFunctions[0].first = true;
            };
        }
        if (((Date.now() - playFunctions[0].timestamp) >= 3550) || playFunctions[0].first) {
            playFunctions[0].timestamp = Date.now();
            for (let i=0; i < playFunctions.length; i++) {
                playFunctions[i].play();
                /* console.log(`playin ${i}`); */
            };
            if (playFunctions[0].first) {
                playFunctions[0].first = false;
            }
        };
        window.requestAnimationFrame(animationFrames);
    };      
    
    window.requestAnimationFrame(animationFrames);
};