function showCard() {
    document.getElementById('cartao').style.display = 'flex'; // Exibe e centraliza o quadro
}

function hideCard() {
    document.getElementById('cartao').style.display = 'none'; // Esconde o quadro de criação
}


let flashcards = [];
let currentCardIndex = 0;
let cronometroInterval;
let startTime, endTime;

function showCard() {
    document.getElementById('cartao').style.display = 'flex';
}

function hideCard() {
    document.getElementById('cartao').style.display = 'none';
}

function salvarCard() {
    const pergunta = document.getElementById('ques').value;
    const resposta = document.getElementById('res').value;

    if (pergunta === '' || resposta === '') {
        document.getElementById('erro').style.display = 'block';
        return;
    }

    document.getElementById('erro').style.display = 'none';

    let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    
    flashcards.push({ 
        pergunta, 
        resposta, 
        acertou: null, 
        acertos: 0, 
        erros: 0 
    });

    localStorage.setItem('flashcards', JSON.stringify(flashcards));

    document.getElementById('ques').value = '';
    document.getElementById('res').value = '';

    hideCard();
    mostrarFlashcards();
}

function mostrarFlashcards() {
    flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    const container = document.querySelector('.flashcards');
    container.innerHTML = '';

    flashcards.forEach((card, index) => {
        const cardElement = document.createElement('div');
        cardElement.classList.add('flashcard');
        
        // Calcular porcentagem de acertos e erros
        const totalRespostas = card.acertos + card.erros;
        let acertosPercent = totalRespostas ? (card.acertos / totalRespostas * 100).toFixed(2) : 0;
        let errosPercent = totalRespostas ? (card.erros / totalRespostas * 100).toFixed(2) : 0;
        
        cardElement.innerHTML = 
            `<p><strong>Pergunta:</strong> ${card.pergunta}</p>
             <p><strong>Resposta:</strong> ${card.resposta}</p>
             <div class="stats">
                 <p>Acertos: ${acertosPercent}%</p>
                 <p>Erros: ${errosPercent}%</p>
             </div>
             <button onclick="marcarResultado(${index}, true)">Acertou</button>
             <button onclick="marcarResultado(${index}, false)">Errou</button>`;
        container.appendChild(cardElement);
    });

    document.getElementById('botao-iniciar').style.display = 'inline-block';
}

function marcarResultado(index, acertou) {
    flashcards[index].acertos += acertou ? 1 : 0;
    flashcards[index].erros += !acertou ? 1 : 0;
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    currentCardIndex++;
    mostrarCartaoAtual();
}

function excluirCard() {
    let flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];
    flashcards.pop();
    localStorage.setItem('flashcards', JSON.stringify(flashcards));
    mostrarFlashcards();
}

let isFirstGame = true;

function iniciarJogo() {
    flashcards = JSON.parse(localStorage.getItem('flashcards')) || [];

    if (flashcards.length === 0) {
        alert("Nenhum cartão disponível!");
        return;
    }

    if (isFirstGame) {
        flashcards = flashcards.sort(() => Math.random() - 0.5);
        isFirstGame = false;
    } else {
        flashcards.sort((a, b) => b.erros - a.erros || a.acertos - b.acertos);
    }

    currentCardIndex = 0;
    document.getElementById('botao-iniciar').style.display = 'none';
    iniciarCronometro();
    mostrarCartaoAtual();
}

function iniciarCronometro() {
    clearInterval(cronometroInterval);
    startTime = new Date();
    cronometroInterval = setInterval(atualizarCronometro, 1000);
}

function atualizarCronometro() {
    const now = new Date();
    const diff = Math.floor((now - startTime) / 1000);
    const minutos = String(Math.floor(diff / 60)).padStart(2, '0');
    const segundos = String(diff % 60).padStart(2, '0');
    document.getElementById('tempo').textContent = `${minutos}:${segundos}`;

}

function pararCronometro() {
    clearInterval(cronometroInterval);
}

function mostrarCartaoAtual() {
    const container = document.querySelector('.flashcards');
    container.innerHTML = '';

    if (currentCardIndex >= flashcards.length) {
        finalizarJogo();
        return;
    }

    const card = flashcards[currentCardIndex];
    const cardElement = document.createElement('div');
    cardElement.classList.add('flashcard');

    const totalRespostas = card.acertos + card.erros;
    let acertosPercent = totalRespostas ? (card.acertos / totalRespostas * 100).toFixed(2) : 0;
    let errosPercent = totalRespostas ? (card.erros / totalRespostas * 100).toFixed(2) : 0;

    cardElement.innerHTML = `
        <p><strong>Pergunta:</strong> ${card.pergunta}</p>
        <div id="resposta-${currentCardIndex}" style="display:none;">
            <p><strong>Resposta:</strong> ${card.resposta}</p>
            <button onclick="marcarResultado(${currentCardIndex}, true)">Acertou</button>
            <button onclick="marcarResultado(${currentCardIndex}, false)">Errou</button>
        </div>
        <button class="btn-ver-resposta" onclick="mostrarResposta(${currentCardIndex})">Ver Resposta</button>
        <div class="stats">
            <p>Acertos: ${acertosPercent}%</p>
            <p>Erros: ${errosPercent}%</p>
        </div>`;

    container.appendChild(cardElement);
}

function mostrarResposta(index) {
    document.getElementById(`resposta-${index}`).style.display = 'block';

}

function finalizarJogo() {
    pararCronometro();
    endTime = new Date();
    const totalTime = Math.round((endTime - startTime) / 1000);
    const minutos = String(Math.floor(totalTime / 60)).padStart(2, '0');
    const segundos = String(totalTime % 60).padStart(2, '0');

    document.getElementById('tempo').style.display = 'none'; // Esconder o cronômetro após finalizar o jogo
    document.getElementById('botao-iniciar').style.display = 'none'; // Esconder o botão "Iniciar"

    document.querySelector('.flashcards').innerHTML = 
        `<div class="resultado-jogo">
            <h2>Você completou o jogo!</h2>
            <p>Tempo total: ${minutos}:${segundos}</p>
            <div class="botao-centralizado">
                <button onclick="voltarPaginaInicial()">Voltar</button>
                <button onclick="reiniciarJogo()">Reiniciar</button>
            </div>
        </div>`;
}

function voltarPaginaInicial() {
    // Função que recarrega a página para voltar à tela inicial
    window.location.reload();  // Recarrega a página, simulando um "voltar" para a tela inicial
}

function reiniciarJogo() {
    isFirstGame = false;
    document.getElementById('tempo').style.display = 'block'; // Reexibe o temporizador ao reiniciar
    iniciarJogo();  // Reinicia o jogo e o cronômetro
}

window.onload = mostrarFlashcards;