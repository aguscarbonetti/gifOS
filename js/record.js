const apiKey = "FI8z8d66ASGjHEw0iOYzSD9tUTmOwrrH";
const recording = document.getElementById("start-recording");
const captureWindow = document.getElementById("record-gifs");
const contentCapturedGIF = document.getElementById("content-created");
const captureButton = document.getElementById("capture-button");
const readyButton = document.getElementById("ready-button");
const windowUploading = document.getElementById("window-uploading");
const sectionMyGifs = document.getElementById("mis-gifos-section");
const repeatGif = document.getElementById("repeat-gif");
const createWindow = document.getElementById("create-gifs")

let myblob = null;

document.addEventListener('DOMContentLoaded', function(){
    showCreatedGifs();
});

recording.addEventListener('click', async () =>{
    const constraints = {
        audio: false,
        video: {max: 480}
    }
    await getMedia(constraints);
    createWindow.classList.add("hidden");
    captureWindow.classList.remove("hidden");
    sectionMyGifs.classList.add("hidden");
})

async function getMedia(constraints) {
    let stream = null;
    try {
      stream = await navigator.mediaDevices.getUserMedia(constraints)
      .then(async function(stream){
            const videoPlayer = document.getElementById('video-space');
            videoPlayer.srcObject = stream;
            videoPlayer.play();
            let recorder = new GifRecorder(stream, {
            type: 'gif',
            frameRate: 1,
            quality: 10,
            width: 360,
            hidden: 240,
            });

            //empezar grabación
            const captureGIF = document.getElementById("capture-recording");
            captureGIF.addEventListener("click", ()=>{
            recorder.record();
            captureButton.classList.add("hidden");
            readyButton.classList.remove("hidden");
            document.getElementById('record-title').innerHTML = "Capturando Tu Gifo";
            });  

            //pausar grabación
            const stopRecording = document.getElementById("recording-ready");
            stopRecording.addEventListener("click", () =>{
            videoPlayer.pause();
            stream.stop();
            recorder.stop(function(blob){
                myblob = blob;
                const showCaptureGIF = document.getElementById("created-gif");
                captureWindow.classList.add("hidden");
                contentCapturedGIF.classList.remove("hidden");
                showCaptureGIF.src = URL.createObjectURL(blob);
                });
            })  
            // //repetir video
            repeatGif.addEventListener("click", ()=>{
                location.reload();
            })
            //upload gif
            const uploadGif = document.getElementById("upload-gif");
            uploadGif.addEventListener("click", () =>{
                contentCapturedGIF.classList.add("hidden")
                windowUploading.classList.remove("hidden");
                if (myblob !== null) {
                    let form = new FormData();
                    form.append('file', myblob, "mygif.gif");
                    fetch(`https://upload.giphy.com/v1/gifs?api_key=${apiKey}`, {method: "POST", body: form})
                    .then(response => response.json())
                    .then(response =>{
                        console.log(response);
                        let myGifs;
                        let newID = response.data.id;
                        if (localStorage.getItem("misGifos") === null) {
                            myGifs = [newID];
                            localStorage.setItem(
                            "misGifos",
                            JSON.stringify(myGifs)
                            );
                        }else{
                            myGifs = JSON.parse(localStorage.getItem("misGifos"));
                            myGifs.push(newID);
                            localStorage.setItem(
                                "misGifos",
                                JSON.stringify(myGifs)
                            );

                        }
                        const finalGifShowed = document.getElementById("show-final-gif");
                        finalGifShowed.src = `https://media2.giphy.com/media/${response.data.id}/200_d.gif`;
                        windowUploading.classList.add("hidden");
                        document.getElementById("window-ended").classList.remove("hidden");
                        sectionMyGifs.classList.remove("hidden");

                        //copy to clipboard
                        
                        document.getElementById("copy-clipboard").addEventListener("click", () => {
                            let i = document.createElement("input");
                            document.body.appendChild(i);
                            i.value = finalGifShowed.src;
                            i.select();
                            document.execCommand("copy");
                            document.body.removeChild(i);
                            alert("El link ha sido copiado al portapapeles");
                          });

                        //download gif

                        document.getElementById("download-gif").addEventListener("click", () => {
                            invokeSaveAsDialog(myblob,'miGif.gif');
                          });    

                        showCreatedGifs();

                        document.getElementById("back-to-start").addEventListener("click", ()=>{
                            location.reload();

                        });

                        
                    })
                }
            })
  
        })
    }catch(error){
        console.log(error);
    }
}

//mostrar gifs creados

async function showCreatedGifs() {
    const contenedor = document.getElementById("cont-my-gifs");

    if (localStorage.getItem("misGifos") === null) {
        return;
    }
    while (contenedor.lastElementChild) {
        contenedor.removeChild(contenedor.lastElementChild);
      };
    try{
        let savedGifs = JSON.parse(localStorage.getItem("misGifos"));
        savedGifs.forEach(gifId =>{
            let urlID = `https://api.giphy.com/v1/gifs/${gifId}?api_key=${apiKey}`;
            const data = fetch(urlID) 
            .then(response => response.json())
            .then(data =>{
                console.log(data);
                const internContainer = document.createElement('div');
                internContainer.classList.add('my-gifs-container');
                const gif = document.createElement('img');
                gif.src = data.data.images.fixed_height_downsampled.url;
                contenedor.appendChild(internContainer);
                internContainer.appendChild(gif);
            })
        })
      }
    catch(error) {
        console.log(error)
    }
}











