const socket = io();

//#region DOM Elements
let submitVideoBtn = document.getElementById('submitVideoBtn');
let uploadAndConversionStatus = document.getElementById('uploadAndConversionStatus');
let formVideoFile = document.getElementById('formVideoFile');
let videoUploadForm = document.getElementById('videoUploadForm');
//#endregion

//#region Functions
let uploadVideo = async () => {
    let formData = new FormData(videoUploadForm);
    const options = {
        method: 'POST',
        body: formData
    };

    const data = await fetch('/convertVideo', options);
    console.log(data);
    if (data.status == 200) {
        window.location.replace(data.url);
    } else {
        alert(await data.text());
    }
    // // The content-disposition header gets set by the express.js res.download() function. It is the filename.
    // let fileName = data.headers.get('Content-Disposition');
    // // Split from the header to just get the name wrapped in quotes
    // fileName = fileName.split('=')[1];
    // // Get just the name outside of quotes
    // fileName = fileName.split('"')[1];
    // const videoBlob = await data;
    // const videoFile = new File([videoBlob], fileName, { type: 'video/mp4'});

    // // Create an ObjUrl and a link to use to perform an automatic download of the video.
    // let objUrl = window.URL.createObjectURL(videoFile);
    // let link = document.createElement('a');
    // link.href = objUrl;
    // link.download = videoFile.name;
    // link.click();

}
//#endregion

//#region Socket.io messages
socket.on('uploadAndConversionStatus', (serverData) => {
    uploadAndConversionStatus.innerText = `${uploadAndConversionStatus.innerText}\n${serverData.msg}`
    uploadAndConversionStatus.scrollTop = uploadAndConversionStatus.scrollHeight;
})
//#endregion

//#region Event Listener
videoUploadForm.addEventListener('submit', function(e) {
    submitVideoBtn.disabled = true;
})

formVideoFile.addEventListener('input', function(e) {
    if (this.value.length > 0) {
        submitVideoBtn.disabled = false;
    } else {
        submitVideoBtn.disabled = true;
    }
})

submitVideoBtn.addEventListener('click', function(e) {
    e.preventDefault();

    uploadVideo();
})
//#endregion