import Peer from 'peerjs'

export default class User {

    constructor() {
        this.peer = new Peer();
        this.conn = null;
        this.id = "";
        this.peerId = "";
        this.isConnected = false;
        this.isPeerCreated = false;
        this.call = null;
        this.isOnCall = false;

        this.peer.on('open', (_id) => {
            this.id = _id;
            this.isPeerCreated = true;
            console.log(`Peer criado com ID: ${_id}`);
        });

        this.peer.on('connection', (_conn) => {
            this.conn = _conn;
            this.initConnection();
        });

        this.peer.on('call', (call) => {
            this.call = call;
            this.receiveCall();
        });

        this.peer.on('error', (error) => {
            console.error(`PeerJS Error: ${error}`);
        });

        this.messages = [];


        this.chatMessages = document.querySelector('.chatMensagens');
    }

    // Conecta a uma outra pessoa
    connect(destId) {
        if (!this.isPeerCreated) {
            console.error("Tentativa de conexão antes do peer ser criado");
            return;
        }

        this.conn = this.peer.connect(destId);
        this.conn.on('open', () => {
            this.initConnection();
        });
    }

    initConnection() {
        this.isConnected = true;
        this.conn.on('data', (data) => {
            this.receiveDataCallback(data);
        });

        this.peerId = this.conn.peer;
        console.log(`Conexão estabelecida com ID: ${this.conn.peer}`);
    }

    // Callback para recepção de dados
    receiveDataCallback(data) {
        console.log(`Mensagem recebida: ${JSON.stringify(data)}`);

        // Mensagem de texto no chat
        if (data['type'] === 'message') {
            this.addMessage(this.conn.peer, data['data']);
        }
        // Informação da duração do vídeo sendo exibido
        else if (data['type'] === 'video-duration') {
            this.onSetDuration?.(data['data']);
        }
    }

    /*
    Comunica com pessoa conectada
        type: tipo de dado sendo enviado(ex.: 'message', 'video-duration')
        data: dado enviado
    */
    sendData(type, data) {
        if (!this.isConnected) {
            console.error("Tentativa de enviar dados antes de fazer conexão.");
            return;
        }

        this.conn.send({
            'type': type,
            'data': data
        });
    }

    // Envia mensagem no chat para a pessoa conectada
    sendMessage(message) {
        if (!this.isConnected) {
            console.error("Tentativa de enviar mensagem antes de fazer conexão.");
            return;
        }

        this.sendData('message', message);
        this.addMessage(this.id, message)
        console.log(`Mensagem enviada: ${message}`);
    }

    /*
    Adiciona nova mensagem de texto no chat
        sender: ID do remetente
        message: conteúdo da mensagem
    */
    addMessage(sender, message) {
        this.messages.push({
            'sender': sender,
            'message': message
        });

        const msgDiv = document.createElement("div");
        msgDiv.className = sender === this.id ? "mensagem user-mesagem" : "mensagem botMen";

        const contentDiv = document.createElement("div");
        contentDiv.className = "conteudoMensagem";

        if (message.startsWith('/gif')) {
            let url = message.split(' ')[1];
            let img = document.createElement('img');
            img.src = url;
            contentDiv.appendChild(img);
        }
        else {
            contentDiv.textContent = message;
        }

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

    /* 
    Inicia uma chamada com a pessoa conectada para a transmissão do vídeo
        mediaStream: objeto MediaStream que vai ser transmitido
    */
    startCall(mediaStream) {
        if (!this.isConnected) {
            console.error("Tentativa de ligação antes de fazer conexão.");
            return;
        }

        this.call = this.peer.call(this.peerId, mediaStream);
        this.isOnCall = true;

        this.call.on('error', (error) => {
            console.error(`PeerJS Error: ${error}`);
        });

        console.log("[DEBUG]: Chamada feita.")
    }

    receiveStreamCallback(stream) {
        this.onStream?.(stream);
    }

    receiveCall() {
        console.log("[DEBUG}: Chamada recebida.")

        this.call.answer(new MediaStream());

        this.isOnCall = true;
        this.call.on('stream', (stream) => {
            this.receiveStreamCallback(stream);
        });

        this.call.on('error', (error) => {
            console.error(`PeerJS Error: ${error}`);
        });
    }
}