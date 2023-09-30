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
const upload = multer({dest: './uploads', preservePath: true});
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
})

app.get('/', (req, res) => {
    res.render("index");
})

app.post('/convertVideo', upload.single('video'), async (req, res, next) => {
    let handbrakeFileName = "";
    const file = req.file;
    // Rename the file and add the video type
    await fs.rename(path.join(__dirname, file.path), path.join(__dirname, 'uploads', `${file.originalname}`));
    const videoName = file.originalname.split('.mp4')[0].trim();

    try {
        let dirs = await fs.opendir(handBrakeCliProgramLocation);
        for await (const dirFile of dirs) {
            if (dirFile.name.toLocaleLowerCase().includes('handbrakecli')) {
                handbrakeFileName = dirFile.name;
            }
        }

        const handbrakeFilePath = path.join(__dirname, 'lib', handbrakeFileName);
        const convertedFileName = `${videoName}.mp4`;
        const inputFilePath = `${path.join('.', file.originalname)}`
        const outputFilePath = `${path.join('..', 'src', 'convertedVideos', convertedFileName)}`;

        const handbrakeCliCmd = spawn(handbrakeFilePath, ['-i', inputFilePath, '-o', outputFilePath], { cwd: path.join(__dirname, 'uploads')});

        //#region spawn listeners
        handbrakeCliCmd.stdout.on('data', (data) => {
            console.log(`stdout: ${data}`);
            webSocket.emit('uploadAndConversionStatus', {
                msg: `${data}`
            })
        })

        handbrakeCliCmd.stderr.on('data', (data) => {
            console.log(`stderr: ${data}`);
            webSocket.emit('uploadAndConversionStatus', {
                msg: `${data}`
            })
          });

        handbrakeCliCmd.on('exit', async (code) => {
            console.log(`exit: ${code}`);

            if (code === 0) {
                webSocket.emit('uploadAndConversionStatus', {
                    msg: `${code}`
                })

                // Delete from the uploads folder
                await fs.rm(`${path.join(__dirname, 'uploads', file.originalname)}`);
    
                // res.sendFile(convertedFileName, options)
                // res.download(path.join(__dirname, 'src', 'convertedVideos', convertedFileName), convertedFileName)
                res.redirect(`/videos/${convertedFileName}`);
            } else {
                await fs.rm(`${path.join(__dirname, 'uploads', file.originalname)}`);
                res.status(400).send({ code, error: "There was an error with the conversion."})
            }
        })
        //#endregion
    } catch (error) {
        console.log("In the error");
        console.log(error);
        res.status(400).send(error.msg)
    }
})

app.get('/videos/:videoName', async (req, res) => {
    let videoName = req.params.videoName;
    let videoLocation = path.join(__dirname, 'src', 'convertedVideos');

    try {
        const dir = await fs.opendir(videoLocation);
        for await (const entry of dir) {
            if (entry.name === videoName) {
                const relativePath = entry.path.split("src")[1];
                console.log(relativePath);
                entry.path = relativePath;
                console.log(entry);
                res.render('video', {video: entry})
                return;
            }
        }
        res.status(404).send('No video found!')
    } catch (error) {
        console.log(error);
        res.status(400).send(error);
    }
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