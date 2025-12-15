class FrontPage {
    
    constructor(idInputId, createBtnId, joinBtnId, errorMessageId) {
        this.idInput = document.getElementById(idInputId);
        this.createBtn = document.getElementById(createBtnId);
        this.joinBtn = document.getElementById(joinBtnId);
        this.errorMessage = document.getElementById(errorMessageId)

        this.init();
    }

    init() {
        this.createBtn.addEventListener('click', (e) => this.handleCreateButton(e));
        this.joinBtn.addEventListener('click', (e) => this.handleJoinButton(e));
    }

    handleCreateButton(e) {
        e.preventDefault();

        localStorage.setItem('isHost', 'true');
        window.location.href = './room.html';
    }

    handleJoinButton(e) {
        e.preventDefault();
        if (this.idInput.value === '') {
            this.errorMessage.classList.remove('hidden');
            return;
        }

        localStorage.setItem('peerId', this.idInput.value)
        window.location.href = './room.html'
    }

}

const frontPage = new FrontPage('roomId', 'createRoomBtn', 'joinRoomBtn', 'errorMessage')