const promiseMensagens = axios.get(
  `https://mock-api.driven.com.br/api/v4/uol/messages`
);
promiseMensagens.then(processarResposta);

// Processa o Promise mensagens
function processarResposta(resposta) {
  // console.log(`resposta: ${resposta}`);
  // console.log(`resposta.data: ${resposta.data}`);
  receberMensagens(resposta.data);
}

// Recebe mensagens
function receberMensagens(mensagens) {
  const chat = document.querySelector(`.chat`);
  console.log(`mensagens: ${mensagens}`);
  index = 0;
  setInterval(() => {
    chat.innerHTML += `
            <!-- Mensagem -->
            <div class="caixa-mensagem">
              <div class="mensagem">
                <span class="hora">(${mensagens[index].time})</span>
                <strong class="usuario">${mensagens[index].from}:</strong>
                <span class="texto">${mensagens[index].text}</span>
              </div>
            </div>`;
    chat.lastChild.scrollIntoView();
    index++;
  }, 3000);
}

