const socket = io();

//#region DOM Elements
let submitVideoBtn = document.getElementById('submitVideoBtn');
let uploadAndConversionStatus = document.getElementById('uploadAndConversionStatus');
let formVideoFile = document.getElementById('formVideoFile');
let videoUploadForm = document.getElementById('videoUploadForm');
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
//#endregion