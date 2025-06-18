import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*"
  }
});

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Sert le front buildé (chemin corrigé)
app.use(express.static(path.join(__dirname, "../client/dist")));

// Fallback SPA
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/dist/index.html"));
});

const characters = [];

const generateRandomPosition = () => {
  return [Math.random() * 3, 0, Math.random() * 3];
}

const generateRandomHexColor = () => {
  return "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0");
}

io.on("connection", (socket) => {
  console.log("a user connected");
  const pseudo = socket.handshake.query.pseudo || '';
  characters.push({
    id: socket.id,
    position: generateRandomPosition(),
    keysPressed: {},
    hairColor: generateRandomHexColor(),
    topColor: generateRandomHexColor(),
    bottomColor: generateRandomHexColor(),
    pseudo
  });
  socket.emit("hello");
  io.emit("characters", characters);
  console.log('Characters actuels:', characters);

  socket.on("disconnect", () => {
    console.log("a user disconnected");
    const idx = characters.findIndex((character) => character.id === socket.id);
    if (idx !== -1) {
      characters.splice(idx, 1);
    }
    io.emit("characters", characters);
    console.log('Characters actuels:', characters);
  });

  // Gestion des mouvements avec position et touches pressées
  socket.on("move", (data) => {
    const idx = characters.findIndex((character) => character.id === socket.id);
    if (idx !== -1) {
      characters[idx].position = data.position;
      characters[idx].keysPressed = data.keysPressed;
      // Broadcast à tous les autres clients (pas à l'expéditeur)
      socket.broadcast.emit("characters", characters);
    }
  });
});

const PORT = process.env.PORT || 8080;
httpServer.listen(PORT, () => {
  console.log("Serveur lancé sur le port", PORT);
});
