const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const fs2 = require('fs');

//#region DB Models
const Videos = require('../models/Video');
//#endregion

router.get('/videos/:videoName', async (req, res) => {
    let videoName = req.params.videoName;
    try {
        const queryResult = await Videos.findAll({
            where: {
                name: videoName
            }
        })
    
        if (queryResult.length > 0) {
            //TODO: Below is my code that did work for the JSON but not for the video.
            const videoFileHandle = await fs.open(path.join('src', 'convertedVideos', `${queryResult[0].dataValues.name}.mp4`));
            const videoFileBuffer = await videoFileHandle.read();
            res.send({
                video: queryResult[0].dataValues,
                emptyLibrary: false,
                msg: "Video found.",
                videoFile: videoFileBuffer.buffer
            })
        } else {
            res.send({video: null, emptyLibrary: true, msg: "No video found."})
        }
    } catch (error) {
        console.log(error);
        res.status(400).send({ error, msg: error.message });
    }
})


module.exports = router;