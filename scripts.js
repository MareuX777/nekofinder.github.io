// Caro DEVedor, se funciona, não mexa.


const botao = document.getElementById('buscarBtn');
const loading = document.getElementById('loading');
const galeria = document.getElementById('galeria');
const modal = document.getElementById('modal');
const modalImg = document.getElementById('modalImg');
const fechar = document.querySelector('.fechar');
const btnBaixar = document.getElementById('btnBaixar');
const btnCopiarLink = document.getElementById('btnCopiarLink')
let urlAtual = '';
botao.addEventListener('click', buscarNekos);
fechar.addEventListener('click', fecharModal);
btnBaixar.addEventListener('click', baixarImagem);
btnCopiarLink.addEventListener('click', copiarLink);

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        fecharModal();
    }
    if (e.target === menuCompartilhar) {
        menuCompartilhar.style.display = 'none';
    }
});

async function buscarNekos() {
    loading.style.display = 'block';
    galeria.innerHTML = '';
    botao.disabled = true;

    try {
        for(let i = 1; i <= 20; i++) {
            const resposta = await axios.get('https://nekos.best/api/v2/neko');
            const neko = resposta.data.results[0];
            criarCard(neko, i);
        }
    } catch(erro) {
        console.error('Erro:', erro.message);
        galeria.innerHTML = '<p style="color: red;">Erro ao carregar nekos!</p>';
    } finally {
        loading.style.display = 'none';
        botao.disabled = false;
    }
}

function criarCard(neko, numero) {
    const card = document.createElement('div');
    card.className = 'neko-card';
    
    card.innerHTML = `
        <img src="${neko.url}" alt="Neko ${numero}" style="cursor: pointer;">
        <div class="neko-info">
            <p>Neko #${numero}</p>
        </div>
    `;
    
    const img = card.querySelector('img');
    img.addEventListener('click', () => abrirModal(neko.url));
    
    galeria.appendChild(card);
}

function abrirModal(url) {
    urlAtual = url;
    modalImg.src = url;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    carregarInfoImagem(url);
}

async function carregarInfoImagem(url) {
    try {
        const response = await fetch(url);
        const blob = await response.blob();
        
        const tamanhoKB = (blob.size / 1024).toFixed(2);
        
        const tipo = blob.type.split('/')[1] || 'desconhecido';
        
        const dataAtual = new Date().toLocaleDateString('pt-BR');
        
        const img = new Image();
        img.onload = function() {
            document.getElementById('infoDimensoes').textContent = `${this.width}x${this.height}px`;
        };
        img.src = url;
        
        document.getElementById('infoTamanho').textContent = `${tamanhoKB} KB`;
        document.getElementById('infoFormato').textContent = tipo.toUpperCase();
        
    } catch(erro) {
        console.error('Erro ao carregar info:', erro);
        document.getElementById('infoTamanho').textContent = 'Erro';
    }
}

function fecharModal() {
    modal.style.display = 'none';
    menuCompartilhar.style.display = 'none';
    document.body.style.overflow = 'auto';
}

async function baixarImagem() {
    try {
        const response = await fetch(urlAtual);
        const blob = await response.blob();
        
        const blobUrl = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = blobUrl;
        link.download = `neko-${Date.now()}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(blobUrl);
        
        mostrarNotificacao('Imagem baixada com sucesso!');
    } catch(erro) {
        console.error('Erro ao baixar:', erro);
        mostrarNotificacao('Erro ao baixar a imagem');
    }
}

function copiarLink() {
    navigator.clipboard.writeText(urlAtual).then(() => {
        mostrarNotificacao('Link copiado!');
    }).catch(() => {
        mostrarNotificacao('Erro ao copiar link');
    });
}

function mostrarNotificacao(mensagem) {
    const notif = document.createElement('div');
    notif.className = 'notificacao';
    notif.textContent = mensagem;
    document.body.appendChild(notif);

    setTimeout(() => {
        notif.remove();
    }, 3000);
}