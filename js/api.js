const promiseMensagens = axios.get(
  `https://mock-api.driven.com.br/api/v4/uol/messages`
);
let nomeUsuario = prompt(`Insira seu nome de exibicao`);
let promiseNomeUsuario = axios.post(
  `https://mock-api.driven.com.br/api/v4/uol/participants `,
  { name: nomeUsuario }
);

promiseNomeUsuario.catch(checaNome);

promiseMensagens.then(processarRespostaMensagem);

// Processa o Promise mensagens
function processarRespostaMensagem(resposta) {
  receberMensagens(resposta.data);
}

function teste(resposta) {
  console.log(resposta.status);
}

// Solicita um novo nome de usuario caso ja esteja em uso
function checaNome() {
  nomeUsuario = prompt(`Nome ja utilizado, tente outro`);
  promiseNomeUsuario = axios.post(
    `https://mock-api.driven.com.br/api/v4/uol/participants `,
    { name: nomeUsuario }
  );
  promiseNomeUsuario.catch(checaNome);
}

// Recebe e envia mensagens ao usuario
function receberMensagens(mensagens) {
  const chat = document.querySelector(`.chat`);
  for (let index = 0; index < mensagens.length; index++) {
    //TODO mandar todas as msgs (codigo comentado abaixo)
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
  }
  setInterval(() => {
    promiseNovasMensagens = axios.get(
      `https://mock-api.driven.com.br/api/v4/uol/messages`
    );
    promiseNovasMensagens.then((resposta) => {
      let novasMensagens = resposta.data;
      for (let i = 0; i < mensagens.length; i++) {
        for (let j = 0; j < novasMensagens.length; j++) {
          if (novasMensagens[j] === mensagens[i]) {
            novasMensagens.splice(j, 1);
          }
        }
      }
      mensagens = mensagens.concat(novasMensagens);
      for (let index = 0; index < novasMensagens.length; index++) {
        switch (novasMensagens[index].type) {
          case `status`:
            chat.innerHTML += `
                <!-- Mensagem -->
                <div class="caixa-mensagem status">
                  <div class="mensagem">
                    <span class="hora">(${novasMensagens[index].time})</span>
                    <strong class="usuario">${novasMensagens[index].from}</strong>
                    <span class="texto">${novasMensagens[index].text}</span>
                  </div>
                </div>`;
            chat.lastChild.scrollIntoView();
            
            break;
          case `private_message`:
            chat.innerHTML += `
              <!-- Mensagem -->
              <div class="caixa-mensagem privada">
                <div class="mensagem">
                  <span class="hora">(${novasMensagens[index].time})</span>
                  <strong class="usuario">${novasMensagens[index].from} reservadamente para ${mensagens[index].to}:</strong> 
                  <span class="texto">${novasMensagens[index].text}</span>
                </div>
              </div>`; //TODO Implementar funcao que so envia esta mensagem se usuario === .to
            chat.lastChild.scrollIntoView();
            
            break;
          case `message`:
            chat.innerHTML += `
                  <!-- Mensagem -->
                  <div class="caixa-mensagem">
                    <div class="mensagem">
                      <span class="hora">(${novasMensagens[index].time})</span>
                      <strong class="usuario">${novasMensagens[index].from} para ${mensagens[index].to}:</strong>
                      <span class="texto">${novasMensagens[index].text}</span>
                    </div>
                  </div>`;
            chat.lastChild.scrollIntoView();
            
            break;
        }
      }
    });
  }, 3000);
}

function Mensagem(from, to, text, type) {
  this.from = from;
  this.to = to;
  this.text = text;
  this.type = type;
}

//TODO Entrada na sala
//TODO Envio de mensagem

// criar um array -> salvar as msg nesse array -> 3s -> buscar novo array2 -> comparar array com array2
// -> imprimir o que sobrar no array2 -> adicionar o que sobrar do array2 no array

/*
 */
