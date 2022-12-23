
let btnPause = document.getElementById("pausa")
let btnPlay = document.getElementById("play")
let formulario = document.getElementById("video")
let video = []

document.getElementById("eject").addEventListener('click', (e) => {


    navigator.mediaDevices.getDisplayMedia({
        video: {
            mediaSource: 'screen',
        },
        audio: false,
    })
        .then(async (e) => {

            let audio = await navigator.mediaDevices.getUserMedia({
                audio: true, video: false
            })

            console.log(e)
            console.log(audio)
            let combine = new MediaStream([...e.getTracks(), ...audio.getTracks()],{
                videoBitsPerSecond: 2500000,
                audioBitsPerSecond: 16000,
            })

            let mediaRecorder = new MediaRecorder(combine,{
                videoBitsPerSecond: 2500000,
                audioBitsPerSecond: 16000,
            })


            //EVENTO PARA DARLE PLAY
            btnPlay.addEventListener('click', (e) => {
                e.target.value == "play" ? mediaRecorder.start() : mediaRecorder.stop()
            })

            btnPause.addEventListener('click', () => {
                mediaRecorder.pause()
            })


            mediaRecorder.onstart = () => {
                video = []
                console.log("Empezo")
                btnPlay.value = "stop"
                btnPlay.textContent = "STOP"
                document.querySelector('#grabando').classList.add('rec')

            }

            mediaRecorder.onresume = () => {
                console.log('Resumido')
                document.querySelector('#grabando').classList.add('rec')
            }

            mediaRecorder.ondataavailable = function (e) {
                console.log(e)
                video.push(e.data)
            }

            mediaRecorder.onpause = () => {
                console.log('Pausado')
                document.querySelector('#grabando').classList.remove('rec')
            }

            mediaRecorder.onstop = function (e) {
                alert("Fin de la grabacion")
                console.log(video, 'video')
                let blob = new Blob(video, { type: "video/webm;codecs=vp9" })
                download(blob)
                //guardarArchivo(blob)

                btnPlay.value = "play"
                btnPlay.textContent = "PLAY"
                document.querySelector('#grabando').classList.remove('rec')
            }


        })
        .catch(err => console.log(err))
}

)


async function download(data) {

    const file = new File([data], `asd.webm`, {
        type: 'video/webm;codecs=vp9',
        lastModified: Date.now(),
        prueba: 'prueba'
    })


    let link = document.createElement('a')
    link.id = "vidiolink"
    link.href = window.URL.createObjectURL(file)
    link.textContent = "Descargar"
    link.setAttribute("download", "video_recorded.mp4")

    let video = document.createElement('video')
    video.id = "vidio"
    video.src = window.URL.createObjectURL(file)
    video.controls = true
    video.style.width = '100%'    

    formulario.appendChild(video)
    formulario.appendChild(link)

    const formData = new FormData()
    formData.append('video', file)


}

