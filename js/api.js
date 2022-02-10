const promiseMensagens = axios.get(
  `https://mock-api.driven.com.br/api/v4/uol/messages`
);
let nomeUsuario = prompt(`Insira seu nome de exibicao`);
let promiseNomeUsuario = axios.post(
  `https://mock-api.driven.com.br/api/v4/uol/participants `,
  { name: nomeUsuario }
);
let promiseParticipantes = axios.get(
  `https://mock-api.driven.com.br/api/v4/uol/participants`
);
promiseParticipantes.then(carregaListaDeParticipantes);
promiseNomeUsuario.catch(checaNome);
promiseNomeUsuario.then(verificaPresenca);

promiseMensagens.then(processarRespostaMensagem);

// Atualiza a lista de participantes no sidebar
setInterval(() => {
  let promiseParticipantes = axios.get(
    `https://mock-api.driven.com.br/api/v4/uol/participants`
  );
  promiseParticipantes.then(carregaListaDeParticipantes);
}, 10000);

// Processa o Promise mensagens
function processarRespostaMensagem(resposta) {
  receberMensagens(resposta.data);
}

function processaRespostaLista(resposta) {
  carregaListaDeParticipantes(resposta.data);
}

// Envia pro servidor que o usuario esta presente
function verificaPresenca() {
  setInterval(() => {
    axios.post(`https://mock-api.driven.com.br/api/v4/uol/status`, {
      name: nomeUsuario,
    });
  }, 5000);
}

// Solicita um novo nome de usuario caso ja esteja em uso
function checaNome() {
  nomeUsuario = prompt(`Este nome ja esta em uso. Por favor escolha outro`);
  promiseNomeUsuario = axios.post(
    `https://mock-api.driven.com.br/api/v4/uol/participants `,
    { name: nomeUsuario }
  );
  promiseNomeUsuario.catch(checaNome);
}

// Recebe as mensagens disponiveis no servidor
function receberMensagens(mensagens) {
  const chat = document.querySelector(`.chat`);
  for (let index = 0; index < mensagens.length; index++) { //TODO Refatorar em uma so funcao *
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

  // Recebe as mensagens novas do Servidor 
  setInterval(() => {
    promiseNovasMensagens = axios.get(
      `https://mock-api.driven.com.br/api/v4/uol/messages`
    );
    promiseNovasMensagens.then((resposta) => {
      let novasMensagens = resposta.data;
      let i = novasMensagens.length;
      while (
        mensagens[mensagens.length - 1].time != novasMensagens[i - 1].time
      ) {
        i--;
      } // verifica o index da ultima mensagem recebida pelo usuario
      mensagens = novasMensagens;
      for (let index = i; index < novasMensagens.length; index++) { //TODO Refatorar em uma so funcao *
        // faz o display das mensagens novas
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

// Carrega a lista de participantes no sidebar
function carregaListaDeParticipantes(resposta) {
  let section = document.querySelector(`#membros`); // elemento que contem os participantes
  let listaParticipantesServer = resposta.data; // lista de participantes
  section.innerHTML = ``;
  for (index = 0; index < listaParticipantesServer.length; index++) {
      if(listaParticipantesServer[index].name != nomeUsuario) {
        section.innerHTML += `
        <div id="${listaParticipantesServer[index].name}" class="opcao">
            <ion-icon name="person-circle"></ion-icon>
            <span>${listaParticipantesServer[index].name}</span>
        </div>
              `;
      }
    
  }
}

/*
let mensagemTexto = document.querySelector(`input`).value;
let mensagem = new Mensagem(nomeUsuario, #, mensagemTexto, #);
const promiseMensagem = axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, )
*/
//! Implementar depois que setar o .type e .to (2) 

// Lista de membros no sidebar dinamica (1)
//TODO Selecao de remetente e visibilidade (2) -> lembrar que se selecionar remetente e ele sair, resetar para 'todos'
//TODO Envio de mensagem (2)
function Mensagem(from, to, text, type) {
  this.from = from;
  this.to = to;
  this.text = text;
  this.type = type;
}


