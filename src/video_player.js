export default class VideoPlayer {

    constructor(uploadBtnId, videoInputId, videoPlayerId, mediaControlsId, togglePlayBtnId, videoPlayerDivId, pauseIconId, playIconId, currentTimeId, durationId, videoSubtitlesId, subtitlesBtnId, subtitlesInputId, user) {
        this.uploadBtn = document.getElementById(uploadBtnId);
        this.input = document.getElementById(videoInputId);
        this.video = document.getElementById(videoPlayerId);
        this.mediaControls = document.getElementById(mediaControlsId);
        this.togglePlayBtn = document.getElementById(togglePlayBtnId);
        this.playerDiv = document.getElementById(videoPlayerDivId);
        this.playIcon = document.getElementById(playIconId);
        this.pauseIcon = document.getElementById(pauseIconId);
        this.currentTime = document.getElementById(currentTimeId);
        this.duration = document.getElementById(durationId);
        this.subtitles = document.getElementById(videoSubtitlesId);
        this.subtitlesBtn = document.getElementById(subtitlesBtnId);
        this.subtitlesInput = document.getElementById(subtitlesInputId);
        this.user = user;
        this.mediaStream = null;

        this.isVideoPlaying = false;

        this.init();
    }

    init() {
        this.uploadBtn.addEventListener('click', () => this.handleUploadClick());
        this.input.addEventListener('change', (e) => this.handleFileChange(e));
        this.subtitlesInput.addEventListener('change', (e) => this.handleSubtitlesChange(e));
        this.playerDiv.addEventListener('mouseenter', (e) => this.handleMouseEnter(e));
        this.playerDiv.addEventListener('mouseleave', (e) => this.handleMouseLeave(e));
        this.togglePlayBtn.addEventListener('click', (e) => this.handleTogglePlayBtn(e));
        this.subtitlesBtn.addEventListener('click', (e) => this.handleSubtitlesBtnClick(e));
    }

    handleSubtitlesChange(e) {
        const file = this.subtitlesInput.files[0];
        console.log(`[DEBUG]: Arquivo de legendas recebido: "${file.name}"`)

        let type = file.name.substring(file.name.length - 4, file.name.length)
        const trackUrl = URL.createObjectURL(file);
        if (type === '.vtt') {
            this.subtitles.src = trackUrl;
        }
        else if (type === '.srt') {
            const reader = new FileReader();

            reader.onload = (e) => {
                const srtContent = e.target.result;

                const vttContent = srt2webvtt(srtContent);

                const vttBlob = new Blob([vttContent], { type: 'text/vtt' });

                const trackUrl = URL.createObjectURL(vttBlob);
                this.subtitles.src = trackUrl;
            };

            reader.readAsText(file);
        }
    }

    handleSubtitlesBtnClick(e) {
        e.preventDefault();
        this.subtitlesInput.click();
    }

    handleUploadClick() {
        this.input.click();
    }

    handleFileChange(e) {
        const file = this.input.files[0];
        console.log(`[DEBUG]: Arquivo recebido: "${file.name}"`);

        const media = URL.createObjectURL(file);
        this.startVideo(media, false, true);
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
        this.video.pause();
        this.isVideoPlaying = false;

        this.pauseIcon.classList.add('hidden');
        this.playIcon.classList.remove('hidden');
    }

    async play(e) {
        await this.video.play();
        this.isVideoPlaying = true;

        this.video.muted = false;
        this.playIcon.classList.add('hidden');
        this.pauseIcon.classList.remove('hidden');
        this.updateCurrentTime();
    }

    updateCurrentTime() {
        if (!this.isVideoPlaying) {
            return;
        }

        let currentTimeFormatted = VideoPlayer.formatTime(this.video.currentTime);
        this.currentTime.textContent = currentTimeFormatted;

        let timeout = (1.0 - (this.video.currentTime % 1)) * 1000;
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

    async startVideo(media, isMediaStream = false, isCallStarter = false) {
        document.querySelector('.videoPlayer').classList.remove('barulho');
        document.querySelector('.uploadBtn').classList.add('hidden');

        if (isMediaStream) {
            this.video.srcObject = media;
        }
        else {
            this.video.src = media;
        }
        
        this.video.style.display = "block";

        this.video.addEventListener('loadedmetadata', () => {
            let durationTime = VideoPlayer.formatTime(this.video.duration);
            this.duration.textContent = durationTime;
        });

        await this.play();

        this.mediaStream = this.video.captureStream();
        if (isCallStarter) {
            this.user.startCall(this.mediaStream);
        }
    }

}
