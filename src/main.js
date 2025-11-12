import './style.css'
import Peer from 'peerjs'

class User {

	constructor() {
		this.peer = new Peer();
		this.conn = null;
		this.id = "";
		this.is_connected = false;
		this.is_peer_created = false;

		this.peer.on('open', function(_id) {
			this.id = _id;
			this.is_peer_created = true;
			console.log(`Peer criado com ID: ${this.id}`);
		})
	}

	connect(destId) {
		if (!this.is_peer_created) {
			console.error("Tentativa de conexão antes do peer ser criado");
			return;
		}

		this.conn = this.peer.connect(destId);
		this.conn.on('open', () => {
			this.is_connected = true;

			this.conn.on('data', (data) => {
				this.receiveDataCallback(data);
			});

			console.log(`Conexão estabelecida com ID: ${destId}`);
		});
	}

	receiveDataCallback(data) {
		// TODO: tratar recebimento de mensagens/dados
		console.log(`Mensagem recebida: ${data}`);
	}

	sendMessage(msg) {
		if (!this.is_connected) {
			console.error("Tentativa de enviar mensagem antes de fazer conexão.");
			return;
		}
		this.conn.send(msg);
	}

}