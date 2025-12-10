class VideoPlayer {

    constructor(uploadBtnId, videoInputId, videoPlayerId, mediaControlsId, togglePlayBtnId, videoPlayerDivId, pauseIconId, playIconId) {
        this.uploadBtn = document.getElementById(uploadBtnId);
        this.input = document.getElementById(videoInputId);
        this.player = document.getElementById(videoPlayerId);
        this.mediaControls = document.getElementById(mediaControlsId);
        this.togglePlayBtn = document.getElementById(togglePlayBtnId);
        this.playerDiv = document.getElementById(videoPlayerDivId);
        this.playIcon = document.getElementById(playIconId);
        this.pauseIcon = document.getElementById(pauseIconId);

        this.isVideoPlaying = false;

        this.init();
    }

    init() {
        this.uploadBtn.addEventListener('click', () => this.handleUploadClick());
        this.input.addEventListener('change', (e) => this.handleFileChange(e));
        this.playerDiv.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
        this.playerDiv.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        this.togglePlayBtn.addEventListener('click', (e) => this.handleTogglePlayBtn(e));
    }

    handleUploadClick() {
        this.input.click();
    }

    handleFileChange(e) {
        const file = this.input.files[0];
        console.log(`[DEBUG]: Arquivo recebido: "${file.name}"`);

        const media = URL.createObjectURL(file);
        this.startVideo(media);
    }

    handleMouseEnter(e) {
        if (this.isVideoPlaying) {
            this.mediaControls.classList.remove('hidden');
        }
    }

    handleMouseLeave(e) {
        if (this.isVideoPlaying) {
            this.mediaControls.classList.add('hidden');
        }
    }

    handleTogglePlayBtn(e) {
        e.preventDefault();
        if (this.isVideoPlaying) {
            this.pause();
        }
        else {
            this.play();
        }
    }

    pause(e) {
        this.player.pause();
        this.isVideoPlaying = false;

        this.pauseIcon.classList.add('hidden');
        this.playIcon.classList.remove('hidden');
    }

    play(e) {
        this.player.play();
        this.isVideoPlaying = true;

        this.playIcon.classList.add('hidden');
        this.pauseIcon.classList.remove('hidden');
    }

    startVideo(media) {
        document.querySelector('.videoPlayer').classList.remove('barulho');
        document.querySelector('.uploadBtn').classList.add('hidden');

        this.player.src = media;
        this.player.style.display = "block";
        this.play();
    }
}

const videoPlayer = new VideoPlayer('uploadBtn', 'videoInput', 'videoPlayer', 'mediaControls', 'togglePlayBtn', 'videoPlayerDiv', 'pauseIcon', 'playIcon');
