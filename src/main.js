import './style.css'
import User from './user.js'

const user = new User();

const sendBtn = document.getElementById('enviarMensagem');
const inputMsg = document.getElementById('mensagemInput');

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let message = inputMsg.value;
    inputMsg.value = '';

    if (message === '') {
        return;
    }

    if (!user.is_connected) {
        if (message.startsWith('/connect')) {
            user.connect(message.split(' ')[1]);
        }
        return;
    }

    user.sendMessage(message);
});

const uploadBtn = document.getElementById('uploadBtn');
const videoInput = document.getElementById('videoInput');
const videoPlayer = document.getElementById('videoPlayer');

uploadBtn.addEventListener('click', (e) => {
    videoInput.click()
});
videoInput.addEventListener('change', (e) => {
    const file = videoInput.files[0];
    console.log(`[DEBUG]: Arquivo recebido: "${file.name}"`);

    let media = URL.createObjectURL(file);
    playVideo(media);
});

function playVideo(media) {
    document.querySelector('.videoPlayer').classList.remove('barulho');
    document.querySelector('.uploadBtn').classList.add('hidden');

    videoPlayer.src = media;
    videoPlayer.style.display = "block";
    videoPlayer.play();
}