import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Front (args) {
    const [intervalSet, setIntervalSet] = useState(false);
    const [featureIndices, setFeatureIndices] = useState({first: 0, second: 1});
    const features = ['Streamlined, yet comprehensive data', 'Easy to navigate', 'Tracks calories and protein exclusively, including straightforward analytics on how you are doing', 
                      'Visual queues on meeting your daily targets', 'Responsive design - use seamlessly from your pc, mobile phone or tablet'];
    let animationRunning = false;

    useEffect(() => {
        if (!intervalSet) {
            setInterval(() => {
                const foodIcons = [
                    "fa-solid fa-egg",
                    "fa-solid fa-fish",
                    "fa-solid fa-cheese",
                    "fa-solid fa-mug-saucer",
                    "fa-solid fa-pizza-slice",
                    "fa-solid fa-drumstick-bite",
                ];

                const iconsBottom = document.getElementById('iconsBottom');
                const icons = iconsBottom.childNodes;
                let timeout = 0;
                
                const referenceClassName = icons[0].firstChild.className;
                let newRandomIndex = Math.floor(Math.random() * 6);

                while (referenceClassName === foodIcons[newRandomIndex]) {
                    newRandomIndex = Math.floor(Math.random() * 6);
                };

                for (let i=0; i < icons.length; i++) {
                    setTimeout(() => {
                        const oldIcon = icons[i].lastChild;
                        const newIcon = document.createElement('i');
                        newIcon.className = foodIcons[newRandomIndex];
                        icons[i].replaceChild(newIcon, oldIcon);
                 
                    }, timeout);
                    timeout += 500;
                };

            }, 3000);

            setInterval(() => {
                const goLeftButton = document.getElementsByClassName('fa-square-caret-left')[0];
                goLeftButton.click();
            }, 3000);
    
            setIntervalSet(true);

        };
    }, []);

    function nextIndex(visibleFeature, hiddenFeature, nextOrPrevious) {
         const visibleFeatureText = visibleFeature.innerHTML;
         const indexOfVisibleFeature = features.indexOf(visibleFeatureText);
         let indexOfNextFeature = nextOrPrevious === 'next' ? indexOfVisibleFeature + 1 : indexOfVisibleFeature - 1;
         indexOfNextFeature = indexOfNextFeature > features.length - 1 ? 0 : (indexOfNextFeature < 0 ? features.length - 1 : indexOfNextFeature);
         hiddenFeature.innerHTML = features[indexOfNextFeature];
    };

    async function nextFeature(e) {
        if (animationRunning) {
            return;
        };
        
        const firstIndex = document.getElementById('firstIndex');
        const secondIndex = document.getElementById('secondIndex');
        let visibleFeature, hiddenFeature;

        if (firstIndex.style.transform === 'translate(0%, 0%)') {
            visibleFeature = firstIndex;
            hiddenFeature = secondIndex;
        } else if (secondIndex.style.transform === 'translate(0%, 0%)') {
            visibleFeature = secondIndex;
            hiddenFeature = firstIndex;
        };

        await new Promise((resolve) => {
            if (e.target.classList[1] === 'fa-square-caret-left') {
                hiddenFeature.style.transform = 'translate(700%, 0%)';
                nextIndex(visibleFeature, hiddenFeature, 'previous');
            } else {
                nextIndex(visibleFeature, hiddenFeature, 'next');
            };

            setTimeout(() => {
                resolve('done');
            }, 190);
        });
        
        if (e.target.classList[1] === 'fa-square-caret-left') {
            visibleFeature.style.transform = 'translate(-600%, 0%)';
        } else {
            visibleFeature.style.transform = 'translate(700%, 0%)';
        };
        hiddenFeature.style.transform = 'translate(0%, 0%)';
        hiddenFeature.style.opacity = 1;

        await new Promise((resolve) => {
            visibleFeature.style.opacity = 0;
            animationRunning = true;
            setTimeout(() => {
                resolve('done2');
            }, 730)
        });
        visibleFeature.style.transform = 'translate(-600%, 0%)';
        animationRunning = false;
    };

    return (
        <div id="front">
            <div id="frontHeader">
                <h1 className="textLogo">Protein Admin</h1>

                <div className='logo' data-testid='logo Front'>
                    <i data-testid='left bicep Front'>&#128170;</i>
                    <i className='fa-solid fa-utensils' data-testid='utensils Front'></i>
                    <div className="secondBicep" data-testid="right bicep Front">
                        <i>&#128170;</i>
                    </div>
                </div>

                <div id="frontUI">
                    <Link to='/login'>LOGIN</Link> | <Link to='/register'>REGISTER</Link>
                </div>
            </div>

            <div id="frontBody">
                <h2>Streamlined Nutrition Tracker</h2>
                <h3>With Protein Admin, tracking your nutritional goals daily is no longer impractical!</h3>
                <div id="frontUlContainer">
                    <i class="fa-solid fa-square-caret-left" onClick={nextFeature}></i>
                    <ul id="featuresUL">
                        <li id="firstIndex" style={{'transform': 'translate(0%, 0%)'}}>{features[featureIndices.first]}</li>
                        <li id="secondIndex">{features[featureIndices.second]}</li>
                    </ul>
                    <i class="fa-solid fa-square-caret-right" onClick={nextFeature}></i>
                </div>
            </div>

            <div id="iconsBottom">
                <div id="iconsLeft1"><i className="fa-solid fa-egg"></i></div>
                <div id="iconsLeft2"><i className="fa-solid fa-fish"></i></div>
                <div id="iconsLeft3"><i className="fa-solid fa-cheese"></i></div>
                <div id="iconsRight1"><i className="fa-solid fa-mug-saucer"></i></div>
                <div id="iconsRight2"><i className="fa-solid fa-pizza-slice"></i></div>
                <div id="iconsRight3"><i className="fa-solid fa-drumstick-bite"></i></div>
            </div>

            <Link id="startButton" to='/login'><button >CLICK HERE TO GET STARTED!</button></Link>
        </div>
    )
} 

/* 
<section id="logo">
<i className="fa-solid fa-pizza-slice" id="slice1"></i>
<i className="fa-solid fa-pizza-slice" id="slice2"></i>
<i className="fa-solid fa-pizza-slice" id="slice3"></i>
<i className="fa-solid fa-pizza-slice" id="slice4"></i>
<i className="fa-solid fa-pizza-slice" id="slice5"></i>
<i className="fa-solid fa-pizza-slice" id="slice6"></i>
</section>
*/