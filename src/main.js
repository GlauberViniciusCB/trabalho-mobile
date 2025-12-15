import './style.css'
import User from './user.js'
import VideoPlayer from './video_player.js';
import CreatedRoomPopup from './created_room_popup.js';

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

const videoPlayer = new VideoPlayer(
    {
        uploadBtnId: 'uploadBtn',
        videoInputId: 'videoInput',
        videoPlayerId: 'videoPlayer',
        mediaControlsId: 'mediaControls',
        togglePlayBtnId: 'togglePlayBtn',
        videoPlayerDivId: 'videoPlayerDiv',
        pauseIconId: 'pauseIcon',
        playIconId: 'playIcon',
        currentTimeId: 'currentTime',
        durationId: 'duration',
        videoSubtitlesId: 'videoSubtitles',
        subtitlesBtnId: 'subtitlesBtn',
        subtitlesInputId: 'subtitlesInput',
        toggleSoundBtnId: 'toggleSoundBtn',
        soundOnId: 'soundOnIcon',
        soundOffId: 'soundOffIcon'
    },
    user
);

const createdRoomPopup = new CreatedRoomPopup(
    {
        popUpId: 'createdRoomPopup',
        overlayId: 'overlay',
        idAreaId: 'roomId',
        copyBtnId: 'copyBtn',
        closeBtnId: 'closeBtn',
    }
)

user.onStream = (stream) => {
    videoPlayer.startVideo(stream, true, false);
}
user.onSetDuration = (_duration) => {
    videoPlayer.setVideoDuration(_duration);
}