import { Preferences } from "@capacitor/preferences";

class FrontPage {
    
    constructor(idInputId, createBtnId, joinBtnId, errorMessageId) {
        this.idInput = document.getElementById(idInputId);
        this.createBtn = document.getElementById(createBtnId);
        this.joinBtn = document.getElementById(joinBtnId);
        this.errorMessage = document.getElementById(errorMessageId)

        this.init();
    }

    init() {
        Preferences.clear

        this.createBtn.addEventListener('click', (e) => this.handleCreateButton(e));
        this.joinBtn.addEventListener('click', (e) => this.handleJoinButton(e));
    }

    async handleCreateButton(e) {
        e.preventDefault();

        await Preferences.set({
            key: 'isHost',
            value: 'true'
        });
        window.location.href = './room.html';
    }

    async handleJoinButton(e) {
        e.preventDefault();
        if (this.idInput.value === '') {
            this.errorMessage.classList.remove('hidden');
            return;
        }

        await Preferences.set({
            key: 'peerId',
            value: this.idInput.value
        });
        window.location.href = './room.html'
    }

}

document.addEventListener('DOMContentLoaded', async () => {
    await Preferences.remove({ key: 'isHost' });
    await Preferences.remove({ key: 'peerId' });
});

const frontPage = new FrontPage('roomId', 'createRoomBtn', 'joinRoomBtn', 'errorMessage')