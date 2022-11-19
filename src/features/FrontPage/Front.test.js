import {render, screen} from '../Utilities';
import { Front } from './Front';
import { Login } from '../Login/Login';
import user from "@testing-library/user-event";
import { createMemoryHistory } from 'history';

let history;

beforeEach(async () => {
    history = createMemoryHistory();
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
        render('/', history);
        user.setup();
        const loginButton = screen.getByRole('link', {name: /login/i});
        console.log(history.location.pathname);
        console.log(window.location.pathname);
        await user.click(loginButton);
        console.log(history.location.pathname);
        console.log(window.location.pathname);
        console.log(history);
        expect(history.location.pathname).toBe('/login');

    });
    it('Renders the register button correctly', () => {
        render('/', history);
        const registerButton = screen.getByRole('link', {name: /register/i});
        expect(registerButton).toBeInTheDocument();
    });
    test('The register button navigates the user to the register page on click', async () => {
        render('/', history);
        user.setup();
        const registerButton = screen.getByRole('link', {name: /register/i});
        await user.click(registerButton);
        expect(history.location.pathname).toBe('/register');
    });
});

describe('Front page body', () => {
    it('Renders the h2 heading correctly', () => {
        let history = createMemoryHistory();
        console.log(history.location.pathname);
        render('/', history);
        const h2Heading = screen.getByRole('heading', {
            level: 2
        });
        const h2HeadingText = h2Heading.innerHTML;

        expect(h2Heading).toBeInTheDocument();
        expect(h2HeadingText).toBe('Streamlined Nutrition Tracker');
    });
})