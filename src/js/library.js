//#region Elements
let downloadVideoButton = document.getElementById("downloadVideoButton");
let deleteVideoButton = document.getElementById('deleteVideoButton');
//#endregion

document.addEventListener('click', async function(e) {
    if (e.target.id === 'deleteVideoButton') {
        const videoId = e.target.getAttribute('data-id');
        
        const result = await fetch(`/library/${videoId}`, {
            method: 'DELETE'
        })

        const data = await result.json();

        if (confirm(data.msg)) {
            window.location.reload();
        }
    }
})
