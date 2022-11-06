import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export function Front (args) {
    const [intervalSet, setIntervalSet] = useState(false);

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

    return (
        <div id="front">
            <div id="frontHeader">
                <h1>Protein Admin</h1>

                <div className='logo'>
                    <i>&#128170;</i>
                    <i className='fa-solid fa-utensils'></i>
                    <div className="secondBicep">
                        <i>&#128170;</i>
                    </div>
                </div>

                <div id="frontUI">
                    <Link to='/login'>LOGIN</Link> | <Link to='/register'>REGISTER</Link>
                </div>
            </div>

            <div id="frontBody">
                <h2>Fitness nutrition-tracking web app</h2>
                <h3>With Protein Admin, keeping track of your nutritional goals is no longer an undue chore!</h3>
                <ul>
                    <li>Streamlined, yet comprehensive data</li>
                    <li>Easy to navigate</li>
                    <li>Tracks calories and protein exclusively, including straightforward analytics on how you are doing</li>
                    <li>Visual queues on meeting your daily targets</li>
                    <li>Responsive design - use seamlessly from your pc, mobile phone or tablet</li>
                </ul>
            </div>

            <div id="iconsBottom">
                <div id="iconsLeft1"><i class="fa-solid fa-egg"></i></div>
                <div id="iconsLeft2"><i class="fa-solid fa-fish"></i></div>
                <div id="iconsLeft3"><i class="fa-solid fa-cheese"></i></div>
                <div id="iconsRight1"><i class="fa-solid fa-mug-saucer"></i></div>
                <div id="iconsRight2"><i class="fa-solid fa-pizza-slice"></i></div>
                <div id="iconsRight3"><i class="fa-solid fa-drumstick-bite"></i></div>
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