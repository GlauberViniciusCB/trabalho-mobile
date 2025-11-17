import './style.css'
import User from './user.js'

const user = new User();

const sendBtn = document.getElementById('enviarMensagem');
const inputMsg = document.getElementById('mensagemInput');

sendBtn.addEventListener('click', (e) => {
    e.preventDefault();

    let message = inputMsg.value;
    inputMsg.value = '';

    if (message === '') {
        return;
    }

    if (!user.is_connected) {
        if (message.startsWith('/connect')) {
            user.connect(message.split(' ')[1]);
        }
        return;
    }

    user.sendMessage(message);
});


