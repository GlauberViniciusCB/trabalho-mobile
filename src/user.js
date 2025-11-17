import Peer from 'peerjs'

export default class User {

    constructor() {
        this.peer = new Peer();
        this.conn = null;
        this.id = "";
        this.is_connected = false;
        this.is_peer_created = false;

        this.peer.on('open', (_id) => {
            this.id = _id;
            this.is_peer_created = true;
            console.log(`Peer criado com ID: ${_id}`);
        });

        this.peer.on('connection', (_conn) => {
            this.conn = _conn;
            this.initConnection();
        })
        this.messages = [];


        this.chatMessages = document.querySelector('.chatMensagens');
    }

    connect(destId) {
        if (!this.is_peer_created) {
            console.error("Tentativa de conexão antes do peer ser criado");
            return;
        }

        this.conn = this.peer.connect(destId);
        this.conn.on('open', () => {
            this.initConnection();
        });
    }

    initConnection() {
        this.is_connected = true;
        this.conn.on('data', (data) => {
            this.receiveDataCallback(data);
        });

        console.log(`Conexão estabelecida com ID: ${this.conn.peer}`);
    }

    receiveDataCallback(data) {
        this.addMessage(this.conn.peer, data);
        console.log(`Mensagem recebida: ${data}`);
    }

    sendMessage(message) {
        if (!this.is_connected) {
            console.error("Tentativa de enviar mensagem antes de fazer conexão.");
            return;
        }
        this.conn.send(message);
        this.addMessage(this.id, message)
        console.log(`Mensagem enviada: ${message}`);
    }

    addMessage(sender, message) {
        this.messages.push({
            'sender': sender,
            'message': message
        });

        const msgDiv = document.createElement("div");
        msgDiv.className = sender === this.id ? "mensagem user-mesagem" : "mensagem botMen";

        const contentDiv = document.createElement("div");
        contentDiv.className = "conteudoMensagem";
        contentDiv.textContent = message;

        msgDiv.appendChild(contentDiv);
        this.chatMessages.appendChild(msgDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }

    renderAllMessages() {
        this.chatMessages.innerHTML = "";

        for (const messageData of this.messages) {
            const sender = messageData.sender;
            const message = messageData.message;

            const msgDiv = document.createElement("div");
            msgDiv.className = sender === this.id ? "mensagem user-mesagem" : "mensagem botMen";

            const contentDiv = document.createElement("div");
            contentDiv.className = "conteudoMensagem";
            contentDiv.textContent = message;

            msgDiv.appendChild(contentDiv);
            this.chatMessages.appendChild(msgDiv);
        }

        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}