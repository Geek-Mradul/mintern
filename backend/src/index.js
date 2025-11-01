/*
 * Mintern
 * Copyright (C) 2025  Mradul Purohit
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
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