class VideoPlayer {
    
    constructor(uploadBtnId, videoInputId, videoPlayerId) {
        this.uploadBtn = document.getElementById(uploadBtnId);
        this.videoInput = document.getElementById(videoInputId);
        this.videoPlayer = document.getElementById(videoPlayerId);

        this.init();
    }

    init() {
        this.uploadBtn.addEventListener('click', () => this.handleUploadClick());
        this.videoInput.addEventListener('change', (e) => this.handleFileChange(e));
    }

    handleUploadClick() {
        this.videoInput.click();
    }

    handleFileChange(e) {
        const file = this.videoInput.files[0];
        console.log(`[DEBUG]: Arquivo recebido: "${file.name}"`);

        const media = URL.createObjectURL(file);
        this.playVideo(media);
    }

    playVideo(media) {
        document.querySelector('.videoPlayer').classList.remove('barulho');
        document.querySelector('.uploadBtn').classList.add('hidden');

        this.videoPlayer.src = media;
        this.videoPlayer.style.display = "block";
        this.videoPlayer.play();
    }
}

const videoPlayer = new VideoPlayer('uploadBtn', 'videoInput', 'videoPlayer');
