import 'dotenv/config';
import express from 'express';
import { router } from './routes';
import { Server } from 'socket.io';
import http from 'http';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

const serverHttp = http.createServer(app);

const io = new Server(serverHttp, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log(`SocketIO: user connected. SocketID ${socket.id}`);
});

app.use(router);

app.get('/github', (req, res) => {
  res.redirect(
    `https://github.com/login/oauth/authorize?client_id=${process.env.GITHUB_CLIENT_ID}`,
  );
});

app.get('/signin/callback', (req, res) => {
  const { code } = req.query;
  return res.json(code);
});

export { serverHttp, io };
