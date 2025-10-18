import express from 'express';
const { Request, Response } = express;

const app = express();
app.use(express.json());

// req.params example
app.get('/user/:id', (req: Request, res: Response) => {
    res.send(`User ID: ${req.params.id}`);
});

// req.query example
app.get('/search', (req: Request, res: Response) => {
    const { keyword, limit } = req.query;
    res.send(`Keyword: ${keyword}, limit: ${limit}`);
});

// req.body example
app.post('/login', (req: Request, res: Response) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === '1234') {
        res.send('Login successful!');
    } else {
        res.status(401).send('Invalid credentials');
    }
});

app.listen(3000, () => console.log('🚀 Server running on http://localhost:3000'));
