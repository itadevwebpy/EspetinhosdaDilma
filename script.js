let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

// Função para adicionar itens ao carrinho
document.querySelectorAll('.adicionar-carrinho').forEach((botao) => {
    botao.addEventListener('click', () => {
        const itemElement = botao.closest('.item');
        const item = itemElement.querySelector('span').innerText;
        const valor = itemElement.querySelector('.valorecarrinho span').innerText;
        const categoria = itemElement.getAttribute('data-categoria');
        const id = itemElement.getAttribute('data-id');

        // Adiciona o item ao carrinho
        carrinho.push({ id, item, valor, categoria });
        atualizarCarrinho();
        salvarCarrinhoNoLocalStorage();
    });
});

// Atualiza o carrinho
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    const contadorCarrinho = document.getElementById('contador-carrinho');
    const totalFooter = document.getElementById('total-footer');
    const totalPedido = document.getElementById('total-pedido');

    if (listaCarrinho) listaCarrinho.innerHTML = '';
    if (contadorCarrinho) contadorCarrinho.innerText = carrinho.length;

    let total = 0;

    carrinho.forEach((produto, index) => {
        if (listaCarrinho) {
            const li = document.createElement('li');
            li.innerHTML = `
                ${produto.item} - ${produto.valor}
                <button onclick="removerItem(${index})"><i class="bi bi-trash"></i></button>
            `;
            listaCarrinho.appendChild(li);
        }

        total += parseFloat(produto.valor.replace('R$ ', '').replace(',', '.'));
    });

    // Verifica se é entrega e adiciona taxa
    const tipoEntrega = document.querySelector('input[name="tipo-entrega"]:checked');
    if (tipoEntrega && tipoEntrega.value === 'entrega') {
        total += 5;
    }

    if (totalFooter) totalFooter.innerText = `Total: R$ ${total.toFixed(2)}`;
    if (totalPedido) totalPedido.innerText = `Total: R$ ${total.toFixed(2)}`;
}

// Remove item do carrinho
function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
    salvarCarrinhoNoLocalStorage();
}

// Salva o carrinho no localStorage
function salvarCarrinhoNoLocalStorage() {
    localStorage.setItem('carrinho', JSON.stringify(carrinho));
}

// Mostra/oculta campo de endereço e observação
document.querySelectorAll('input[name="tipo-entrega"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        const enderecoEntrega = document.getElementById('endereco-entrega');
        const observacao = document.getElementById('observacao');
        if (enderecoEntrega) enderecoEntrega.style.display = radio.value === 'entrega' ? 'block' : 'none';
        if (observacao) observacao.style.display = radio.value === 'entrega' ? 'block' : 'none';
        atualizarCarrinho();
    });
});

// Mostra/oculta campo de troco
document.querySelectorAll('input[name="forma-pagamento"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        const troco = document.getElementById('troco');
        if (troco) troco.style.display = radio.value === 'dinheiro' ? 'block' : 'none';
    });
});

// Enviar pedido pelo WhatsApp
document.getElementById('enviar-whatsapp')?.addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Adicione itens ao carrinho antes de enviar!');
    } else {
        let mensagem = 'Olá, gostaria de pedir:\n\n';

        // Lista de itens
        carrinho.forEach(produto => {
            mensagem += `- ${produto.item} - ${produto.valor}\n`;
        });

        // Tipo de entrega
        const tipoEntrega = document.querySelector('input[name="tipo-entrega"]:checked');
        if (tipoEntrega.value === 'entrega') {
            const endereco = document.getElementById('endereco').value;
            if (!endereco) {
                alert('Por favor, insira o endereço de entrega.');
                return;
            }
            mensagem += `\n*Tipo de entrega:* Entrega (+ R$ 5,00)\n`;
            mensagem += `*Endereço:* ${endereco}\n`;
        } else {
            mensagem += `\n*Tipo de entrega:* Retirada\n`;
        }

        // Observação
        const observacao = document.getElementById('observacao-texto').value;
        if (observacao) {
            mensagem += `\n*Observação:* ${observacao}\n`;
        }

        // Forma de pagamento e troco
        const formaPagamento = document.querySelector('input[name="forma-pagamento"]:checked');
        mensagem += `\n*Forma de pagamento:* ${formaPagamento.value.toUpperCase()}\n`;
        if (formaPagamento.value === 'dinheiro') {
            const troco = document.getElementById('valor-troco').value;
            if (troco) {
                mensagem += `*Troco para quanto?* R$ ${troco}\n`;
            }
        }

        // Total
        const total = carrinho.reduce((acc, produto) => acc + parseFloat(produto.valor.replace('R$ ', '').replace(',', '.')), 0) + (tipoEntrega.value === 'entrega' ? 5 : 0);
        mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

        // Envia a mensagem pelo WhatsApp
        const url = `https://wa.me/559992153859?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }
});

// Carrega o carrinho ao abrir a página
window.addEventListener('load', () => {
    atualizarCarrinho();
});
