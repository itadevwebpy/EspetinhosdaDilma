let carrinho = [];

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
    });
});

// Atualiza o carrinho
function atualizarCarrinho() {
    const listaCarrinho = document.getElementById('lista-carrinho');
    listaCarrinho.innerHTML = '';
    let total = 0;

    carrinho.forEach((produto, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${produto.item} - ${produto.valor}
            <button onclick="removerItem(${index})"><i class="bi bi-trash"></i></button>
        `;
        listaCarrinho.appendChild(li);

        total += parseFloat(produto.valor.replace('R$ ', '').replace(',', '.'));
    });

    // Verifica se é entrega e adiciona taxa
    const tipoEntrega = document.querySelector('input[name="tipo-entrega"]:checked').value;
    if (tipoEntrega === 'entrega') {
        total += 5;
    }

    document.getElementById('total-pedido').innerText = `Total: R$ ${total.toFixed(2)}`;
}

// Remove item do carrinho
function removerItem(index) {
    carrinho.splice(index, 1);
    atualizarCarrinho();
}

// Mostra/oculta campo de endereço e observação
document.querySelectorAll('input[name="tipo-entrega"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        const enderecoEntrega = document.getElementById('endereco-entrega');
        const observacao = document.getElementById('observacao');
        enderecoEntrega.style.display = radio.value === 'entrega' ? 'block' : 'none';
        observacao.style.display = radio.value === 'entrega' ? 'block' : 'none';
        atualizarCarrinho();
    });
});

// Mostra/oculta campo de troco
document.querySelectorAll('input[name="forma-pagamento"]').forEach((radio) => {
    radio.addEventListener('change', () => {
        const troco = document.getElementById('troco');
        troco.style.display = radio.value === 'dinheiro' ? 'block' : 'none';
    });
});

// Finalizar pedido
document.getElementById('finalizar-pedido').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Adicione itens ao carrinho antes de finalizar!');
    } else {
        alert('Pedido finalizado com sucesso!');
        carrinho = [];
        atualizarCarrinho();
    }
});

// Enviar pedido pelo WhatsApp
document.getElementById('enviar-whatsapp').addEventListener('click', () => {
    if (carrinho.length === 0) {
        alert('Adicione itens ao carrinho antes de enviar!');
    } else {
        let mensagem = 'Olá, gostaria de pedir:\n\n';

        // Lista de itens
        carrinho.forEach(produto => {
            mensagem += `- ${produto.item} - ${produto.valor}\n`;
        });

        // Tipo de entrega
        const tipoEntrega = document.querySelector('input[name="tipo-entrega"]:checked').value;
        if (tipoEntrega === 'entrega') {
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
        const formaPagamento = document.querySelector('input[name="forma-pagamento"]:checked').value;
        mensagem += `\n*Forma de pagamento:* ${formaPagamento.toUpperCase()}\n`;
        if (formaPagamento === 'dinheiro') {
            const troco = document.getElementById('valor-troco').value;
            if (troco) {
                mensagem += `*Troco para quanto?* R$ ${troco}\n`;
            }
        }

        // Total
        const total = carrinho.reduce((acc, produto) => acc + parseFloat(produto.valor.replace('R$ ', '').replace(',', '.')), 0) + (tipoEntrega === 'entrega' ? 5 : 0);
        mensagem += `\n*Total: R$ ${total.toFixed(2)}*`;

        // Envia a mensagem pelo WhatsApp
        const url = `https://wa.me/559992153859?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }
});