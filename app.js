// app.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(cors());

let currentGame = {};

// Genera un nuevo resultado de juego
const generateGameResult = () => {
    const result = Math.floor(Math.random() * 3);
    if (result === 0) return 'A'; // Equipo A gana
    if (result === 1) return 'B'; // Equipo B gana
    return 'Draw'; // Empate
};

// Endpoint para iniciar una nueva ronda de juego
app.post('/new-game', (req, res) => {
    const result = generateGameResult();
    currentGame = { result };
    res.json({ message: 'New game started', result: 'pending' });
});

// Endpoint para realizar una apuesta
app.post('/bet', (req, res) => {
    const { userBet } = req.body;
    if (!userBet || !['A', 'B', 'Draw'].includes(userBet)) {
        return res.status(400).json({ message: 'Invalid bet. Choose A, B, or Draw.' });
    }

    const gameResult = currentGame.result;
    const isWin = userBet === gameResult;
    res.json({
        message: isWin ? 'You won!' : 'You lost!',
        result: gameResult,
        userBet,
        win: isWin
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
