import {render, screen} from '../Utilities';
import { Front } from './Front';
import user from "@testing-library/user-event";



describe('Front page header', () => {
    it('Renders the app name', () => {
        render(<Front />);
        const textLogo = screen.getByRole('heading', {
            level: 1
        });
        expect(textLogo).toBeInTheDocument();
    });
    it('Renders all three logo components', () => {
        render(<Front />)
        const logoLeftBicep = screen.getByTestId('left bicep Front');
        const logoUtensils = screen.getByTestId('utensils Front');
        const logoRightBicep = screen.getByTestId('right bicep Front');
        
        expect(logoLeftBicep).toBeInTheDocument();
        expect(logoUtensils).toBeInTheDocument();
        expect(logoRightBicep).toBeInTheDocument();
    });
    test('The 3 logo components are in the same container and in the correct order', () => {
        render(<Front />);
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
        render(<Front />);
        const loginButton = screen.getByRole('link', {name: /login/i});
        expect(loginButton).toBeInTheDocument();
    });
    test('The login button navigates the user to the login page on click', async () => {
        render(<Front />);
        user.setup();
        const loginButton = screen.getByRole('link', {name: /login/i});
        await user.click(loginButton);
        expect(window.location.pathname).toBe('/login');

    });
    it('Renders the register button correctly', () => {
        render(<Front />);
        const registerButton = screen.getByRole('link', {name: /register/i});
        expect(registerButton).toBeInTheDocument();
    });
    test('The register button navigates the user to the register page on click', async () => {
        render(<Front />);
        user.setup();
        const registerButton = screen.getByRole('link', {name: /register/i});
        await user.click(registerButton);
        expect(window.location.pathname).toBe('/register');
    });
});