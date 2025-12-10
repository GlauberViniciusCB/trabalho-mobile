class VideoPlayer {

    constructor(uploadBtnId, videoInputId, videoPlayerId, mediaControlsId, togglePlayBtnId, videoPlayerDivId, pauseIconId, playIconId, currentTimeId, durationId) {
        this.uploadBtn = document.getElementById(uploadBtnId);
        this.input = document.getElementById(videoInputId);
        this.player = document.getElementById(videoPlayerId);
        this.mediaControls = document.getElementById(mediaControlsId);
        this.togglePlayBtn = document.getElementById(togglePlayBtnId);
        this.playerDiv = document.getElementById(videoPlayerDivId);
        this.playIcon = document.getElementById(playIconId);
        this.pauseIcon = document.getElementById(pauseIconId);
        this.currentTime = document.getElementById(currentTimeId);
        this.duration = document.getElementById(durationId);

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
        this.updateCurrentTime();
    }

    updateCurrentTime() {
        if (!this.isVideoPlaying) {
            return;
        }

        let currentTimeFormatted = VideoPlayer.formatTime(this.player.currentTime);
        this.currentTime.textContent = currentTimeFormatted;

        let timeout = (1.0 - (this.player.currentTime % 1)) * 1000;
        setTimeout(() => {
            this.updateCurrentTime();
        }, timeout);
    }

    static formatTime(seconds) {
        const totalSeconds = Math.floor(seconds);
        const hours = Math.floor(totalSeconds / 3600);
        const minutes = Math.floor((totalSeconds % 3600) / 60);
        const secs = totalSeconds % 60;

        let formattedTime = hours == 0 ? '' : String(hours).padStart(2, '0') + ':';
        return formattedTime +
            String(minutes).padStart(2, '0') + ':' +
            String(secs).padStart(2, '0');
    }

    startVideo(media) {
        document.querySelector('.videoPlayer').classList.remove('barulho');
        document.querySelector('.uploadBtn').classList.add('hidden');

        this.player.src = media;
        this.player.style.display = "block";

        this.player.addEventListener('loadedmetadata', () => {
            let durationTime = VideoPlayer.formatTime(this.player.duration);
            this.duration.textContent = durationTime;
        });

        this.play();
    }
}

const videoPlayer = new VideoPlayer('uploadBtn', 'videoInput', 'videoPlayer', 'mediaControls', 'togglePlayBtn', 'videoPlayerDiv', 'pauseIcon', 'playIcon', 'currentTime', 'duration');
