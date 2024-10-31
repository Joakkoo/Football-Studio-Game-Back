// api/index.js
const express = require('express');
const cors = require('cors');
const app = express();

app.use(express.json());
app.use(cors({ origin: '' })); // Cambia por la URL real de tu frontend

let currentGame = {};

// Función para generar una carta aleatoria entre 2 y 14
const drawCard = () => Math.floor(Math.random() * 13) + 2;

// Determina el ganador según las cartas
const determineWinner = (cardA, cardB) => {
    if (cardA > cardB) return 'A'; // Equipo A gana
    if (cardB > cardA) return 'B'; // Equipo B gana
    return 'Draw'; // Empate
};

// Endpoint para iniciar una nueva ronda con cartas
app.post('/new-game', (req, res) => {
    const cardA = drawCard();
    const cardB = drawCard();
    const result = determineWinner(cardA, cardB);
    currentGame = { cardA, cardB, result };
    res.json({ message: 'Nuevo juego ha comenzado', cardA, cardB, result: 'pending' });
});

// Endpoint para realizar una apuesta
app.post('/bet', (req, res) => {
    const { userBet } = req.body;
    if (!userBet || !['A', 'B', 'Draw'].includes(userBet)) {
        return res.status(400).json({ message: 'Invalid bet. Choose A, B, or Draw.' });
    }

    const { cardA, cardB, result } = currentGame;
    const isWin = userBet === result;
    res.json({
        message: isWin ? 'Ha ganado 😁' : 'Ha perdido 😞',
        result,
        userBet,
        cardA,
        cardB,
        win: isWin
    });
});

// Cambia app.listen para usar el puerto asignado por Render
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
