import {render, screen, waitFor, cleanup, fireEvent} from '../Utilities';
import { Front } from './Front';
import { Login } from '../Login/Login';
import userEvent from "@testing-library/user-event";
import { createMemoryHistory } from 'history';

let history;
jest.setTimeout(30000);

beforeEach(async () => {
    history = createMemoryHistory();
});

afterEach(() => {
    const highestId = window.setInterval(() => {
        for (let i = highestId; i >= 0; i--) {
          window.clearInterval(i);
        }
      }, 0);
});


describe('Front page header', () => {
    it('Renders the app name', () => {
        render('/', history);
        const textLogo = screen.getByRole('heading', {
            level: 1
        });
        expect(textLogo).toBeInTheDocument();
    });
    it('Renders all three logo components', () => {
        render('/', history);
        const logoLeftBicep = screen.getByTestId('left bicep Front');
        const logoUtensils = screen.getByTestId('utensils Front');
        const logoRightBicep = screen.getByTestId('right bicep Front');
        
        expect(logoLeftBicep).toBeInTheDocument();
        expect(logoUtensils).toBeInTheDocument();
        expect(logoRightBicep).toBeInTheDocument();
    });
    test('The 3 logo components are in the same container and in the correct order', () => {
        render('/', history);
        const logoLeftBicep = screen.getByTestId('left bicep Front');
        const logoUtensils = screen.getByTestId('utensils Front');
        const logoRightBicep = screen.getByTestId('right bicep Front');
        const logoContainer = screen.getByTestId('logo Front');


        expect(logoContainer.childElementCount).toBe(3);
        expect(logoContainer.firstChild).toBe(logoLeftBicep);
        expect(logoContainer.lastChild).toBe(logoRightBicep);
        expect(logoContainer.childNodes).toContain(logoUtensils);
    });
    it('Renders the login button correctly', () => {
        render('/', history);
        const loginButton = screen.getByRole('link', {name: /login/i});
        expect(loginButton).toBeInTheDocument();
    });
    test('The login button navigates the user to the login page on click', async () => {
        const user = userEvent.setup();
        render('/', history);
        const loginButton = screen.getByRole('link', {name: /login/i});
        await user.click(loginButton);
        expect(history.location.pathname).toBe('/login');

    });
    it('Renders the register button correctly', () => {
        render('/', history);
        const registerButton = screen.getByRole('link', {name: /register/i});
        expect(registerButton).toBeInTheDocument();
    });
    test('The register button navigates the user to the register page on click', async () => {
        const user = userEvent.setup();
        render('/', history);
        const registerButton = screen.getByRole('link', {name: /register/i});
        await user.click(registerButton);
        expect(history.location.pathname).toBe('/register');
    });
}); 

describe('Front page body', () => {
    it('Renders the h2 heading correctly', () => {
        render('/', history);
        const h2Heading = screen.getByRole('heading', {
            level: 2
        });
        const h2HeadingText = h2Heading.innerHTML;

        expect(h2Heading).toBeInTheDocument();
        expect(h2HeadingText).toBe('Streamlined Nutrition Tracker');
    });
    it('Renders the h3 heading correctly', () => {
        render('/', history);
        const h3Heading = screen.getByRole('heading', {
            level: 3
        });
        const h3HeadingText = h3Heading.innerHTML;

        expect(h3HeadingText).toBe('With Protein Admin, tracking your nutritional goals daily is no longer impractical!');
    });
    it('Renders the Ul container properly', () => {
        render('/', history);
        const UlContainer = screen.getByTestId('frontUlContainer');
        
        expect(UlContainer).toBeInTheDocument();
    });
    it('Renders the Ul container buttons correctly', () => {
        render('/', history);
        const buttonNext = screen.getByPlaceholderText('buttonNext');
        const buttonPrevious = screen.getByPlaceholderText('buttonPrevious');

        expect(buttonNext).toBeInTheDocument();
        expect(buttonPrevious).toBeInTheDocument();
    });
    it('Renders the list of features correctly', () => {
        render('/', history);
        const Ul = screen.getByRole('list');
        expect(Ul).toBeInTheDocument();
    });
    test('The list contains the two initial features upon render', () => {
        render('/', history);
        const Ul = screen.getByRole('list');
        const listItems = Ul.childNodes;
        const firstFeature = listItems[0], secondFeature = listItems[1];

        expect(firstFeature.innerHTML).toBe('Streamlined, yet comprehensive data');
        expect(secondFeature.innerHTML).toBe('Easy to navigate');
    });
    test('The list items change automatically every 3 seconds', async () => {
        render('/', history);

        let Ul = screen.getByRole('list');
        let listItems = Ul.childNodes;
        let firstFeature = listItems[0], secondFeature = listItems[1];
        let firstFeatureValue = firstFeature.innerHTML;
        let secondFeatureValue = secondFeature.innerHTML;

        
        await waitFor(() => {
            expect(secondFeature.innerHTML).toBe('Responsive design - use seamlessly from your pc, mobile phone or tablet');
        }, {timeout: 3000});
        expect(firstFeature.innerHTML).toBe('Streamlined, yet comprehensive data'); 
        
        
        await waitFor(() => {
            expect(firstFeature.innerHTML).toBe('Visual queues on meeting your daily targets');
        }, {timeout: 3000});
        expect(secondFeature.innerHTML).toBe('Responsive design - use seamlessly from your pc, mobile phone or tablet')
    });
    test('Clicking on the left side arrow button takes the slideshow a step back', async () => {
        const user = userEvent.setup();
        render('/', history);
        expect.assertions(2);
        const buttonPrevious = screen.getByPlaceholderText('buttonPrevious');
        const Ul = screen.getByRole('list');
        const listItems = Ul.childNodes;
        let firstFeature = listItems[0], secondFeature = listItems[1];

        await user.click(buttonPrevious);

        expect(firstFeature.innerHTML).toBe('Streamlined, yet comprehensive data');
        expect(secondFeature.innerHTML).toBe('Responsive design - use seamlessly from your pc, mobile phone or tablet');
    }); 
    
    test('Clicking on the right side arrow button takes the slideshow a step forward', async () => {
        debugger;
        const user = userEvent.setup();
        render('/', history);

        const Ul = screen.getByRole('list');
        const listItems = Ul.childNodes;
        let firstFeature = listItems[0], secondFeature = listItems[1];
        const buttonNext = screen.getByPlaceholderText('buttonNext');
        
        await user.click(buttonNext);

        await new Promise((r) => setTimeout(r, 1000));

        expect(firstFeature.innerHTML).toBe('Streamlined, yet comprehensive data'); 
        expect(secondFeature.innerHTML).toBe('Easy to navigate');

        await user.click(buttonNext);

        console.log(firstFeature.innerHTML);
        expect(firstFeature.innerHTML).toBe('Tracks calories and protein exclusively, including straightforward analytics on how you are doing');
        expect(secondFeature.innerHTML).toBe('Easy to navigate');
    });
}); 
