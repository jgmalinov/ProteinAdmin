import { render, screen } from '../Utilities';
import { Login } from './Login';
import { createMemoryHistory } from "history"

let history;
beforeEach(() => {
    history = createMemoryHistory()
})

describe('Login page', () => {
    it('Renders the login form', () => {
        render('/login', history)
    })
})