
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

//TODO criar funcoes para selecionar remetente e visibilidade