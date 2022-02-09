const promiseMensagens = axios.get(
  `https://mock-api.driven.com.br/api/v4/uol/messages`
);

promiseMensagens.then(processarRespostaMensagem);

// Processa o Promise mensagens
function processarRespostaMensagem(resposta) {
  // console.log(`resposta: ${resposta}`);
  // console.log(`resposta.data: ${resposta.data}`);
  receberMensagens(resposta.data);
}

// Recebe e envia mensagens ao usuario
function receberMensagens(mensagens) {
  const chat = document.querySelector(`.chat`);
  console.log(`mensagens: ${mensagens}`);
  index = 0;
  setInterval(() => {
    switch (mensagens[index].type) {
      case `status`:
        chat.innerHTML += `
          <!-- Mensagem -->
          <div class="caixa-mensagem status">
            <div class="mensagem">
              <span class="hora">(${mensagens[index].time})</span>
              <strong class="usuario">${mensagens[index].from}</strong>
              <span class="texto">${mensagens[index].text}</span>
            </div>
          </div>`;
        chat.lastChild.scrollIntoView();
        index++;
        break;
      case `private_message`:
        chat.innerHTML += `
        <!-- Mensagem -->
        <div class="caixa-mensagem privada">
          <div class="mensagem">
            <span class="hora">(${mensagens[index].time})</span>
            <strong class="usuario">${mensagens[index].from} reservadamente para ${mensagens[index].to}:</strong> 
            <span class="texto">${mensagens[index].text}</span>
          </div>
        </div>`; //TODO Implementar funcao que so envia esta mensagem se usuario === .to
        chat.lastChild.scrollIntoView();
        index++;
        break;
      case `message`:
        chat.innerHTML += `
            <!-- Mensagem -->
            <div class="caixa-mensagem">
              <div class="mensagem">
                <span class="hora">(${mensagens[index].time})</span>
                <strong class="usuario">${mensagens[index].from} para ${mensagens[index].to}:</strong>
                <span class="texto">${mensagens[index].text}</span>
              </div>
            </div>`;
        chat.lastChild.scrollIntoView();
        index++;
        break;
    }
  }, 3000);
}

