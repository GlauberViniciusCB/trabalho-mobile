import { Preferences } from '@capacitor/preferences';
import GifWindow from './gifs.js';
import './style.css'
import User from './user.js'
import VideoPlayer from './video_player.js';
import CreatedRoomPopup from './created_room_popup.js';
import Settings from './settings.js';
import RoomController from './room_controller.js';


const user = new User();

const roomController = new RoomController({
    "chatToggleBtnId": "chatToggleBtn",
    "containerChatId": "containerChat",
    'enviarMensagemId': 'enviarMensagem',
    'mensagemInputId': 'mensagemInput'
}, user);

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
        soundOffId: 'soundOffIcon',
        seekBarId: 'seekbar',
    },
    user
);

const settings = new Settings(
    {
        containerId: 'settings-container',
        chatContainerId: 'containerChat',
        settingsBtnId: 'settingsBtn',
        applyBtnId: 'applyBtn',
        backBtn: 'backBtn',

        captionSizeId: 'captionSize',
        captionColorId: 'captionColor',
        captionBgId: 'captionBg',
        captionOpacityId: 'captionOpacity',
        captionDelayId: 'captionDelay'
    },
    videoPlayer
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
        let { value: peerId } = await Preferences.get({
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

user.onVideoPause = () => {
    videoPlayer.pause();
}

user.onVideoPlay = () => {
    videoPlayer.play();
}

user.onVideoSeek = (time) => {

    videoPlayer.applyRemoteSeek(time);
}
