const promiseMensagens = axios.get(
  `https://mock-api.driven.com.br/api/v4/uol/messages`
);
let nomeUsuario = prompt(`Insira seu nome de exibicao`);
let promiseNomeUsuario = axios.post(
  `https://mock-api.driven.com.br/api/v4/uol/participants `,
  { name: nomeUsuario }
);

promiseNomeUsuario.catch(checaNome);
promiseNomeUsuario.then(verificaPresenca);

promiseMensagens.then(processarRespostaMensagem);

// Processa o Promise mensagens
function processarRespostaMensagem(resposta) {
  receberMensagens(resposta.data);
}

// Envia pro servidor que o usuario esta presente
function verificaPresenca() {
    setInterval(() => {
        let promisePresenca = axios.post(`https://mock-api.driven.com.br/api/v4/uol/status`, {name: nomeUsuario})
    }, 5000);
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
      let i = novasMensagens.length;
      while (mensagens[mensagens.length - 1].time != novasMensagens[i - 1].time) {
          console.log(i);
        console.log(`entrou while`);
        i--;
      } // verifica o index da ultima mensagem recebida pelo usuario

      console.log(`saiu while`);
      mensagens = novasMensagens;
      for (let index = i; index < novasMensagens.length; index++) { // faz o display das mensagens novas
        console.log(`entrou for do switch`);
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

//TODO Envio de mensagem
function Mensagem(from, to, text, type) {  
  this.from = from;
  this.to = to;
  this.text = text;
  this.type = type;
}

