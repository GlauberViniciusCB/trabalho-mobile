import { Clipboard } from "@capacitor/clipboard";

export default class CreatedRoomPopup {

    constructor(config) {
        this.popUp = document.getElementById(config['popUpId']);
        this.overlay = document.getElementById(config['overlayId']);
        this.idArea = document.getElementById(config['idAreaId']);
        this.copyBtn = document.getElementById(config['copyBtnId']);
        this.closeBtn = document.getElementById(config['closeBtnId']);

        this.init();
    }

    init() {
        this.closeBtn.addEventListener('click', (e) => this.handleCloseBtn(e));
        this.copyBtn.addEventListener('click', (e) => this.handleCopyBtn(e));

        //this.idArea.textContent = this.getId();
    }

    // STUB
    getId() {
        return '';
    }

    copyId() {
        Clipboard.write({
            string: this.idArea.textContent
        });
    }

    handleCopyBtn(event) {
        event.preventDefault();

        this.copyId();
    }

    handleCloseBtn(event) {
        event.preventDefault();

        this.popUp.classList.add('hidden');
        this.overlay.classList.add('hidden');
    }

}