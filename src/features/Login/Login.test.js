import { render, screen } from '../Utilities';
import { Login } from './Login';

describe('Login page', () => {
    it('Renders the login form', () => {
        render(<Login />)
    })
})