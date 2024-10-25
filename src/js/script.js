// Função que cria item no Board
document.getElementById("addItemBtn").addEventListener("click", function () {
    const item = document.createElement('div');
    item.classList.add('item');

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.placeholder = 'Qtd';
    qtyInput.required = true;
    qtyInput.style.width = '10%';

    // Substituindo o campo de descrição por um select com opções predefinidas
    const descSelect = document.createElement('select');
    descSelect.required = true;
    descSelect.style.width = '70%';

    // Tipos de Peças
    const options = [
        { label: "Serviço A", value: 100.00 },
        { label: "Serviço B", value: 200.00 },
        { label: "Serviço C", value: 300.00 },
    ];

    options.forEach(opt => {
        const optionElement = document.createElement('option');
        optionElement.value = opt.value;
        optionElement.text = opt.label;
        descSelect.appendChild(optionElement);
    });

    // Exibir o preço automaticamente baseado na opção selecionada
    const priceDisplay = document.createElement('input');
    priceDisplay.type = 'text';
    priceDisplay.placeholder = 'un';
    priceDisplay.readOnly = true;
    priceDisplay.style.width = '15%';
    priceDisplay.value = `R$ ${descSelect.value}`; // Valor inicial


    // Responsividade
    if (window.innerWidth <= 768) {
        descSelect.style.width = '60%';
        qtyInput.style.width = '15%';
        priceDisplay.value = descSelect.value;
    }
    // Atualizar o valor do preço baseado na seleção do usuário
    descSelect.addEventListener('change', function () {
        priceDisplay.value = `R$ ${descSelect.value}`;
        if (window.innerWidth <= 768) {
            priceDisplay.value = descSelect.value;
        }
    });

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('removeBtn');
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', function () {
        item.remove();
    });

    item.appendChild(qtyInput);
    item.appendChild(descSelect);
    item.appendChild(priceDisplay);
    item.appendChild(removeBtn);

    document.getElementById('board').appendChild(item);
});

// Função principal do formulario
document.getElementById("orcamentoForm").addEventListener("submit", function(event) {
    event.preventDefault();

    // Pegando os inputs
    const nome = document.getElementById("nome").value;
    const data = document.getElementById("data").value;
    const [ano, mes, dia] = data.split('-');
    const datebr = `${dia}/${mes}/${ano}`;

    let valorTotalItens = 0; // Variável para somar o total do orçamento

    // Pegando valores do input do board
    const items = [];
    document.querySelectorAll("#board .item").forEach(function (itemDiv) {
        const qty = itemDiv.querySelector("input[type='number']").value;
        const desc = itemDiv.querySelector("select").selectedOptions[0].text;
        const price = itemDiv.querySelector("select").value;
        const totalItem = qty * price;
        items.push({ qty, desc, price, total: totalItem });
        valorTotalItens += totalItem; // Somando o total de cada item
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Criando o template padrão
    const img = new Image();
    img.src = "/src/img/template.jpg";

    // Desenhando em cima do template
    img.onload = function () {
      doc.addImage(img, 'JPG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

      doc.setFont("Helvetica");
      doc.setFontSize(14);

      // Adicionando os dados do cliente
      doc.text(125, 90, nome);
      doc.setTextColor(255, 255, 255);
      doc.text(25, 56, datebr);

    let ypos = 125;
       // Posição Y inicial para os itens
      items.forEach(item => {
        doc.setTextColor(0, 0, 0);
        doc.text(13, ypos, item.qty.toString());
        doc.text(35, ypos, item.desc);
        doc.text(160, ypos, item.price.toString());
        doc.text(180, ypos, item.total.toFixed(2));
        ypos += 10;
      });

      // Adicionando o valor total de todos os itens do orçamento
      doc.setTextColor(255, 255, 255);
      doc.text(165, 217, valorTotalItens.toFixed(2)); // Exibindo o total do orçamento

      doc.save(`Orcamento_${nome}.pdf`);
    };
});