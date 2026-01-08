export default class Settings {
    constructor(config, videoPlayer) {
        this.container = document.getElementById(config['containerId']);
        this.chatContainer = document.getElementById(config['chatContainerId']);
        this.settingsBtn = document.getElementById(config['settingsBtnId']);
        this.applyBtn = document.getElementById(config['applyBtnId']);
        this.backBtn = document.getElementById(config['backBtn']);

        this.captionSize = document.getElementById(config['captionSizeId']);
        this.captionColor = document.getElementById(config['captionColorId']);
        this.captionBg = document.getElementById(config['captionBgId']);
        this.captionOpacity = document.getElementById(config['captionOpacityId']);
        this.captionDelay = document.getElementById(config['captionDelayId']);

        this.videoPlayer = videoPlayer;

        this.styleEl = document.createElement('style');
        document.head.appendChild(this.styleEl);

        this.init();
    }

    init() {
        if (this.settingsBtn) {
            this.settingsBtn.addEventListener('click', () => {
                this.open();
            });
        }

        if (this.backBtn) {
            this.backBtn.addEventListener('click', () => {
                this.close();
            });
        }

        if (this.applyBtn) {
            this.applyBtn.addEventListener('click', () => {
                this.apply();
            });
        }
    }

    getValues() {
        return {
            captionSize: Number(this.captionSize.value),
            captionColor: this.captionColor.value,
            captionBg: this.captionBg.value,
            captionOpacity: Number(this.captionOpacity.value),
            captionDelay: Number(this.captionDelay.value)
        };
    }

    apply() {
        const size = this.captionSize.value;
        const color = this.captionColor.value;
        const bg = this.captionBg.value;
        const opacity = this.captionOpacity.value / 100;
        const delay = Number(this.captionDelay.value);

        const bgRGBA = Settings.hexToRgba(bg, opacity);

        this.styleEl.textContent = `
            video::cue {
                font-size: ${size}px;
                color: ${color};
                background: ${bgRGBA};
            }
        `;

        this.videoPlayer.setSubtitlesDelay(delay);

        this.close();
    }

    static hexToRgba(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    open() {
        this.chatContainer.classList.add('hidden');
        this.container.classList.remove('hidden');
    }

    close() {
        this.container.classList.add('hidden');
        this.chatContainer.classList.remove('hidden');
    }
}
