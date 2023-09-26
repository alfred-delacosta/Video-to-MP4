const socket = io();

//#region Socket.io messages
socket.on('uploadAndConversionStatus', (serverData) => {
    console.log(serverData.msg);
})
//#endregion

//#region DOM Elements
let submitVideoBtn = document.getElementById('submitVideoBtn');
let uploadAndConversionStatus = document.getElementById('uploadAndConversionStatus');
let formVideoFile = document.getElementById('formVideoFile');
let videoUploadForm = document.getElementById('videoUploadForm');
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
//#endregion