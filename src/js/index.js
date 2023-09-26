const socket = io();

//#region Socket.io messages
socket.on('uploadAndConversionStatus', (msg) => {
    console.log(msg);
})
//#endregion