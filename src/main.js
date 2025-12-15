import { Preferences } from '@capacitor/preferences';
import GifWindow from './gifs.js';
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

const gifWindow = new GifWindow(
    {
        gifWindowId: 'gifWindow',
        gifBtnId: 'gifBtn',
        gifSearchId: 'gifSearch',
        gifBoardId: 'gifBoard',
        gifInputId: 'gifInput'
    }
);

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

async function handlePeerCreated() {
    let { value: isHost } = await Preferences.get({
        key: 'isHost'
    })
    if (isHost === 'true') {
        const createdRoomPopup = new CreatedRoomPopup(
            {
                popUpId: 'createdRoomPopup',
                overlayId: 'overlay',
                idAreaId: 'roomId',
                copyBtnId: 'copyBtn',
                closeBtnId: 'closeBtn',
            },
            user.id
        );
    }
    else {
        let {value: peerId} = await Preferences.get({
            key: 'peerId'
        });
        user.connect(peerId);
    }
}

user.onPeerCreated = () => {
    handlePeerCreated()
};

gifWindow.onGifSelect = (id) => {
    let url = gifWindow.gifs.find(obj => obj['id'] === id)['media_formats']['gif']['url'];
    if (url) {
        user.sendMessage(`/gif ${url}`);
    }
}

user.onStream = (stream) => {
    videoPlayer.startVideo(stream, true, false);
}
user.onSetDuration = (_duration) => {
    videoPlayer.setVideoDuration(_duration);
}