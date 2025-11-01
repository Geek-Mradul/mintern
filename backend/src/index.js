import express from 'express';
import cors from 'cors';
const app = express();
const port = process.env.PORT || 8000;
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.get('/', (req, res) => {
    res.send('Welcome to Mintern Backend!');
});
app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=index.js.map