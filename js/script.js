let nomeUsuario = prompt(`Insira seu nome de exibicao`);
let remetente = `Todos`;
let visibilidadeType = `message`;

let promiseMensagens = axios.get(
  `https://mock-api.driven.com.br/api/v4/uol/messages`
);
let promiseNomeUsuario = axios.post(
  `https://mock-api.driven.com.br/api/v4/uol/participants `,
  { name: nomeUsuario }
);
let promiseParticipantes = axios.get(
  `https://mock-api.driven.com.br/api/v4/uol/participants`
);

promiseParticipantes.then(carregaListaDeParticipantes);
promiseNomeUsuario.then(verificaPresenca).catch(checaNome);
promiseMensagens.then((resposta) => {
  receberMensagens(resposta.data);
});

// Atualiza a lista de participantes no sidebar
setInterval(() => {
  promiseParticipantes = axios.get(
    `https://mock-api.driven.com.br/api/v4/uol/participants`
  );
  promiseParticipantes.then(carregaListaDeParticipantes);
}, 10000);

function Mensagem(from, to, text, type) {
  this.from = from;
  this.to = to;
  this.text = text;
  this.type = type;
}

// Envia pro servidor que o usuario esta presente
function verificaPresenca() {
  setInterval(() => {
    axios.post(`https://mock-api.driven.com.br/api/v4/uol/status`, {
      name: nomeUsuario,
    });
  }, 4000);
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
  for (let index = 0; index < mensagens.length; index++) {
    displayMensagem(mensagens[index]);
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
      for (let index = i; index < novasMensagens.length; index++) {
        // faz o display das mensagens novas
        displayMensagem(novasMensagens[index]);
      }
    });
  }, 3000);
}

// Carrega a lista de participantes no sidebar
function carregaListaDeParticipantes(resposta) {
  let section = document.querySelector(`#membros`); // elemento que contem os participantes
  let listaParticipantesServer = resposta.data; // lista de participantes

  let elementoSelecionado = document
    .querySelector(`.selecionado`)
    .getAttribute(`data-name`); // Busca o primeiro elemento selecionado

  section.innerHTML = ``;
  for (index = 0; index < listaParticipantesServer.length; index++) {
    if (listaParticipantesServer[index].name != nomeUsuario) {
      section.innerHTML += `
        <div class="opcao" data-identifier="participant" data-name="${listaParticipantesServer[index].name}" onclick="selecionarRemetente(this)">
            <ion-icon name="person-circle"></ion-icon>
            <div class="name">
              <span>${listaParticipantesServer[index].name}</span>
              <ion-icon class="check" name="checkmark"></ion-icon>
            </div>
        </div>
              `;
    }
  }
  let elementoSelecionadoDepois = document.querySelector(
    `[data-name="${elementoSelecionado}"]`
  );

  if (elementoSelecionadoDepois != null) {
    // Se a pessoa selecionada ainda estiver online remarca-la como selecionada
    elementoSelecionadoDepois.classList.add(`selecionado`);
    elementoSelecionadoDepois
      .querySelector(`.name ion-icon`)
      .classList.add(`block`);
  } else {
    // Se a pessoa selecionada nao estiver online selecionar Todos
    document.querySelector(`[data-name="Todos"]`).classList.add(`selecionado`);
    document
      .querySelector(`[data-name="Todos"] .name .check`)
      .classList.add(`block`);
    remetente = `Todos`;
  }
}

// Faz display da mensagem
function displayMensagem(mensagemObj) {
  const chat = document.querySelector(`.chat`);
  switch (mensagemObj.type) {
    case `status`:
      chat.innerHTML += `
          <!-- Mensagem -->
          <div class="caixa-mensagem status" data-identifier="message">
            <div class="mensagem">
              <span class="hora">(${mensagemObj.time})</span>
              <strong class="usuario">${mensagemObj.from}</strong>
              <span class="texto">${mensagemObj.text}</span>
            </div>
          </div>`;
      chat.lastChild.scrollIntoView();

      break;
    case `private_message`:
      if (nomeUsuario === mensagemObj.to || nomeUsuario === mensagemObj.from) {
        // Faz o display da mensagem privada apenas para quem enviou e o rementente marcado
        chat.innerHTML += `
        <!-- Mensagem -->
        <div class="caixa-mensagem privada" data-identifier="message">
          <div class="mensagem">
            <span class="hora">(${mensagemObj.time})</span>
            <strong class="usuario">${mensagemObj.from} reservadamente para ${mensagemObj.to}:</strong> 
            <span class="texto">${mensagemObj.text}</span>
          </div>
        </div>`;
        chat.lastChild.scrollIntoView();
      }

      break;
    case `message`:
      chat.innerHTML += `
            <!-- Mensagem -->
            <div class="caixa-mensagem" data-identifier="message">
              <div class="mensagem">
                <span class="hora">(${mensagemObj.time})</span>
                <strong class="usuario">${mensagemObj.from} para ${mensagemObj.to}:</strong>
                <span class="texto">${mensagemObj.text}</span>
              </div>
            </div>`;
      chat.lastChild.scrollIntoView();

      break;
  }
}

// Envia a mensagem pro servidor e faz o display na tela do usuario
function enviarMensagem() {
  if (visibilidadeType === `private_message` && remetente === `Todos`) {
    // impossibilita de enviar mensagem privada para Todos
    selecionarVisibilidade(document.querySelector(`[data-name="message"]`));
  }
  let mensagemTexto = document.querySelector(`textarea`).value;
  let mensagem = new Mensagem(
    nomeUsuario,
    remetente,
    mensagemTexto,
    visibilidadeType
  );
  axios.post(`https://mock-api.driven.com.br/api/v4/uol/messages`, mensagem);
  document.querySelector(`textarea`).value = ``;
}

function abrirSideBar() {
  let sideBar = document.querySelector(".side-bar");
  let fecharSideBar = document.querySelector(".fechar-side-bar");
  sideBar.style.width = `259px`;
  fecharSideBar.classList.add(`cor`);
}

function fecharSideBar() {
  let sideBar = document.querySelector(".side-bar");
  let fecharSideBar = document.querySelector(".fechar-side-bar");
  sideBar.style.width = 0;
  fecharSideBar.classList.remove(`cor`);
}

function selecionarRemetente(elemento) {
  let elementoSelecionado = document.querySelector(`.selecionado`);
  if (elementoSelecionado != undefined) {
    elementoSelecionado.classList.remove(`selecionado`);
    elementoSelecionado
      .querySelector(`.name ion-icon`)
      .classList.remove(`block`);
  }
  elemento.classList.add(`selecionado`);
  elemento.querySelector(`.name ion-icon`).classList.add(`block`);
  remetente = elemento.getAttribute(`data-name`);
}

function selecionarVisibilidade(elemento) {
  let elementoSelecionado = document.querySelector(
    `#visibilidade .selecionado`
  );
  elementoSelecionado.classList.remove(`selecionado`);
  elementoSelecionado.querySelector(`.name ion-icon`).classList.remove(`block`);

  elemento.classList.add(`selecionado`);
  elemento.querySelector(`.name ion-icon`).classList.add(`block`);
  visibilidadeType = elemento.getAttribute(`data-name`);
  console.log("ESSE" + visibilidadeType);
}
