
function abrirSideBar() {
    let sideBar = document.querySelector('.side-bar');
    let fecharSideBar = document.querySelector('.fechar-side-bar');
    sideBar.style.width = `259px`;
    fecharSideBar.classList.add(`cor`);
}

function fecharSideBar() {
    let sideBar = document.querySelector('.side-bar');
    let fecharSideBar = document.querySelector('.fechar-side-bar');
    sideBar.style.width = 0;
    fecharSideBar.classList.remove(`cor`);
}

function selecionarRemetente(elemento) {
    let elementoJaSelecionado = document.querySelector(`.selecionado`);
    if(elementoJaSelecionado != undefined) {
        elementoJaSelecionado.classList.remove(`selecionado`);
        elementoJaSelecionado.querySelector(`.name ion-icon`).classList.remove(`block`);
    }
    elemento.classList.add(`selecionado`);
    elemento.querySelector(`.name ion-icon`).classList.add(`block`);
    remetente = elemento.getAttribute(`data-name`);
} 

//TODO criar funcoes para selecionar remetente e visibilidade