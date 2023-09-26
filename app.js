// Spin up dotenv
require('dotenv').config()

//#region Node modules
const path = require('path');
const fs = require('fs/promises');
const { spawn } = require('child_process');
const { createServer } = require('node:http');
//#endregion

//#region Multer
const multer = require('multer');
const upload = multer({dest: './uploads'});
//#endregion

//#region Socket.io
const { Server } = require('socket.io');
//#endregion

const handBrakeCliProgramLocation = path.join(__dirname, 'lib');
const staticPath = path.join(__dirname, 'src');

const express = require('express');
const app = express();
const server = createServer(app);
const io = new Server(server);
let webSocket = null;
const port = process.env.PORT

//#region Express App Configuration
app.set('views', path.join(__dirname, 'src', 'views'));
app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(staticPath))
//#endregion

io.on('connection', (socket) => {
    webSocket = socket;
    console.log("Connected to the server")
})

app.get('/', (req, res) => {
    res.render("index");
})

app.post('/convertVideo', upload.single('video'), (req, res, next) => {
    const file = req.file;
    webSocket.emit('uploadAndConversionStatus', {
        msg: 'Test'
    })
})

if (process.env.ENVIRONMENT === "DEV") {
    server.listen(port, () => {
        console.log(`Application is in development mode and listening on port ${port}`);
    })
}
else if (process.env.ENVIRONMENT === "PROD") {
    server.listen(port, () => {
        console.log(`Application is live and listening on port ${port}`);
    })
} else {
    throw new Error("No port configured in the .env file.")
}