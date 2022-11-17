import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Front (args) {
    const [intervalSet, setIntervalSet] = useState(false);
    const [featureIndices, setFeatureIndices] = useState({first: 0, second: 1});
    const features = ['Streamlined, yet comprehensive data', 'Easy to navigate', 'Tracks calories and protein exclusively, including straightforward analytics on how you are doing', 
                      'Visual queues on meeting your daily targets', 'Responsive design - use seamlessly from your pc, mobile phone or tablet'];

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
    
            setIntervalSet(true);

        };
    }, []);

    function nextIndices() {
        const firstIndex = (featureIndices.first + 1) > features.length ? 0 : featureIndices.first + 1;
        const secondIndex = (featureIndices.second + 1) > features.length ? 0 : featureIndices.second + 1;
        setFeatureIndices({first: firstIndex, second: secondIndex}); 
    }

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
                <ul id="featuresUL">
                    <li id="firstIndex">{features[featureIndices.first]}</li>
                    <li id="secondIndex">{features[featureIndices.second]}</li>
                </ul>
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