import { rest } from "msw";

export const handlers = [
    rest.get('http://localhost:4000/', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({}))
    }),

    rest.get('http://localhost:4000/login/status', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({status: 'Authenticated', user: {}}));
    }),

    rest.post('http://localhost:4000/register', (req, res, ctx) => {
        return res(ctx.status(200), ctx.json({message: 'Successfully registered!'}));
    })
];