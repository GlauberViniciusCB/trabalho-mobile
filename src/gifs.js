export default class GifWindow {

    constructor(config) {
        this.gifWindow = document.getElementById(config['gifWindowId']);
        this.gifBtn = document.getElementById(config['gifBtnId']);
        this.gifSearchInput = document.getElementById(config['gifSearchId']);
        this.gifBoard = document.getElementById(config['gifBoardId']);
        this.gifInput = document.getElementById(config['gifInputId']);

        this.TENOR_API_KEY = '';
        this.TENOR_BASE_URL = `https://tenor.googleapis.com/v2/search?q=`;
        this.DEFAULT_GIFS_LIMIT = 6;

        this.isOpen = false;
        this.gifs = null;

        this.init();
    }
    
    init() {
        gifBtn.addEventListener('click', (e) => this.handleGifBtnClick(e));
        this.gifInput.addEventListener('keydown', (e) => this.handleInputKeyPress(e));
    }
    
    handleInputKeyPress(event) {
        if (event.key === "Enter") {
            this.handleInputSubmit();
        }
    }

    handleInputSubmit() {
        this.loadGifs(this.gifInput.value)
    }

    handleGifBtnClick(e) {
        e.preventDefault();
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            this.gifWindow.classList.remove('hidden');
            this.loadGifs();
        }
        else {
            this.gifWindow.classList.add('hidden');
        }
    }

    handleGifSelect(id) {
        this.onGifSelect?.(id);
        
        this.isOpen = false;
        this.gifWindow.classList.add('hidden');
    }

    async loadGifs(searchTerm = 'hello', limit = this.DEFAULT_GIFS_LIMIT) {
        await this.getGifs(searchTerm, limit);

        this.gifBoard.innerHTML = '';
        for (let gif of this.gifs) {
            let img = document.createElement('img');
            img.src = gif['media_formats']['tinygif']['url'];
            img.addEventListener('click', (e) => this.handleGifSelect(gif['id']));
            this.gifBoard.appendChild(img);
        }
    }

    async getGifs(searchTerm = 'hello', limit = this.DEFAULT_GIFS_LIMIT) {
        let url = this.getTenorUrl(searchTerm, limit);

        const response = await fetch(url);
        const data = await response.json();

        this.gifs = data.results;
    }

    getTenorUrl(searchTerm, limit) {
        // https://tenor.googleapis.com/v2/search?q={SEARCH_TERM}&key=${API_KEY}&limit=${LIMIT}"
        return `${this.TENOR_BASE_URL}${searchTerm}&key=${this.TENOR_API_KEY}&limit=${limit}`
    }
}