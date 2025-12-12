import './style.css'
import User from './user.js'
import VideoPlayer from './video_player.js';

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

    if (!user.isConnected) {
        if (message.startsWith('/connect')) {
            user.connect(message.split(' ')[1]);
        }
        return;
    }

    user.sendMessage(message);
});

const videoPlayer = new VideoPlayer('uploadBtn', 'videoInput', 'videoPlayer', 'mediaControls', 'togglePlayBtn', 'videoPlayerDiv', 'pauseIcon', 'playIcon', 'currentTime', 'duration', 'videoSubtitles', 'subtitlesBtn', 'subtitlesInput', user);
user.onStream = (stream) => {
    videoPlayer.startVideo(stream, true, false);
}
user.onSetDuration = (_duration) => {
    videoPlayer.setVideoDuration(_duration);
}