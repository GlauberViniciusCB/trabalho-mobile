export default class RoomController {

    constructor(config, user) {
        this.toggleBtn = document.getElementById(config["chatToggleBtnId"]);
        this.container = document.getElementById(config["containerChatId"]);
        this.sendBtn = document.getElementById(config['enviarMensagemId']);
        this.inputMsg = document.getElementById(config['mensagemInputId']);

        this.user = user;
        
        this.init()
    }

    init() {
        this.toggleBtn.addEventListener("click", () => {
            this.handleChatToggle()
        });

        this.sendBtn.addEventListener('click', (e) => {
            this.handleSendMessage(e);
        });

        window.addEventListener("resize", this.updateOrientation.bind(this));
        this.updateOrientation();
    }

    handleSendMessage(e) {
        e.preventDefault();

        let message = this.inputMsg.value;
        this.inputMsg.value = '';

        if (message === '') {
            return;
        }

        if (!this.user.isConnected) {
            if (message.startsWith('/connect')) {
                this.user.connect(message.split(' ')[1]);
            }
            return;
        }

        this.user.sendMessage(message);
    }

    handleChatToggle() {
        const hidden = this.container.classList.toggle("chat-hidden");
        this.container.classList.toggle("chat-visible", !hidden);

        // this.toggleBtn.textContent = hidden ? "▶" : "◀";
    }

    updateOrientation() {
        if (window.matchMedia("(orientation: landscape)").matches) {
            this.toggleBtn.classList.remove("hidden");
            this.container.classList.add("chat-visible");
            this.container.classList.remove("chat-hidden");
            // this.toggleBtn.textContent = "◀";
        }
        else {
            this.toggleBtn.classList.add("hidden");
            this.container.classList.remove("chat-hidden", "chat-visible");
        }
    }

}