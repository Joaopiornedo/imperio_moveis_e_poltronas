// Função que cria item no Board com lista predefinida
document.getElementById("addItemBtnPredef").addEventListener("click", function () {
    const item = document.createElement('div');
    item.classList.add('item');

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.placeholder = 'Qtd';
    qtyInput.required = true;
    qtyInput.style.width = '25%';
    qtyInput.step = '0.01';
    qtyInput.setAttribute('id', 'qty');

    // Substituindo o campo de descrição por um select com opções predefinidas
    const descSelect = document.createElement('select');
    descSelect.required = true;
    descSelect.style.width = '50%';

    // Tipos de Peças
    const options = [
        { "label": "Aranha" },
        { "label": "Braço mod. Corsa" },
        { "label": "Braço mod. Digitador com regulagem" },
        { "label": "Flange diretor com relax" },
        { "label": "Flange mult regulagem" },
        { "label": "Flange secretaria" },
        { "label": "Madeira assento executivo" },
        { "label": "Madeira assento presidente" },
        { "label": "Madeira assento secretaria" },
        { "label": "Madeira assento diretor" },
        { "label": "Madeira encosto executivo alta" },
        { "label": "Madeira encosto executivo baixa" },
        { "label": "Madeira encosto diretor" },
        { "label": "Madeira encosto presidente" },
        { "label": "Madeira encosto secretaria" },
        { "label": "Pistão" },
        { "label": "Rodízio em polipropileno" },
        { "label": "Rodízio em silicone p.u" },
        { "label": "Troca tecido diretor" },
        { "label": "Troca tecido executiva" },
        { "label": "Troca tecido presidente" },
        { "label": "Troca tecido secretaria" }
    ];

    options.forEach(opt => {
        const optionElement = document.createElement('option');
        optionElement.value = opt.label;
        optionElement.text = opt.label;
        descSelect.appendChild(optionElement);
    });

    // Exibir o preço automaticamente baseado na opção selecionada
    const priceDisplay = document.createElement('input');
    priceDisplay.type = 'number';
    priceDisplay.placeholder = 'UNI';
    priceDisplay.required = true;
    priceDisplay.style.width = '25%';
    priceDisplay.step = '0.01';
    priceDisplay.setAttribute('id', 'price');

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

// Função que cria item manualmente (campo vazio para preenchimento)
document.getElementById("addItemBtnManual").addEventListener("click", function () {
    const item = document.createElement('div');
    item.classList.add('item');

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.placeholder = 'Qtd';
    qtyInput.required = true;
    qtyInput.style.width = '25%';
    qtyInput.step = '0.01';
    qtyInput.setAttribute('id', 'qty');

    // Campo de descrição manual
    const descInput = document.createElement('input');
    descInput.type = 'text';
    descInput.placeholder = 'Descrição do item';
    descInput.required = true;
    descInput.style.width = '50%';

    // Campo de preço manual
    const priceInput = document.createElement('input');
    priceInput.type = 'number';
    priceInput.placeholder = 'UNI';
    priceInput.required = true;
    priceInput.style.width = '25%';
    priceInput.step = '0.01';
    priceInput.setAttribute('id', 'price');

    const removeBtn = document.createElement('button');
    removeBtn.classList.add('removeBtn');
    removeBtn.textContent = 'x';
    removeBtn.addEventListener('click', function () {
        item.remove();
    });

    item.appendChild(qtyInput);
    item.appendChild(descInput);
    item.appendChild(priceInput);
    item.appendChild(removeBtn);

    document.getElementById('board').appendChild(item);
});

// Função principal do formulário para gerar o PDF
document.getElementById("orcamentoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Pegando os dados do formulário
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const data = document.getElementById("data").value;
    const tcond = document.getElementById("tcond").value;
    const fpag = document.getElementById("fpag").value;

    // Formatando a data
    const [ano, mes, dia] = data.split('-');
    const datebr = `${dia}/${mes}/${ano}`;

    let valorTotalItens = 0; // Variável para somar o total do orçamento

    const items = [];
    // Pegando os itens do board
    document.querySelectorAll("#board .item").forEach(function (itemDiv) {
        const qty = parseFloat(itemDiv.querySelector("input[id='qty']").value);
        const desc = itemDiv.querySelector("select, input[type='text']").value;
        const price = parseFloat(itemDiv.querySelector("input[id='price']").value);
        const totalItem = qty * price;
        items.push({ qty, desc, price, total: totalItem });
        valorTotalItens += totalItem; // Somando o total de cada item
    });

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Criando o template padrão
    const img = new Image();
    img.src = "/src/img/template.jpg";

    // Template de continuação
    const imgContinuation = new Image();
    imgContinuation.src = "/src/img/continue.jpg";

    // Desenhando em cima do template
    img.onload = function () {
        doc.addImage(img, 'JPG', 0, 0, doc.internal.pageSize.width, doc.internal.pageSize.height);

        doc.setFont("Helvetica");
        doc.setFontSize(14);

        // Adicionando os dados do cliente
        doc.text(125, 90, nome);
        doc.text(125, 100, telefone);

        // Adicionando os termos e condições
        const larguraMaxima = 70;
        const linhasTexto = doc.splitTextToSize(tcond, larguraMaxima);
        let yPos = 240;
        linhasTexto.forEach(linha => {
            doc.text(30, yPos, linha);
            yPos += 7;
        });

        // Adicionando a forma de pagamento
        const linhasTexto2 = doc.splitTextToSize(fpag, larguraMaxima);
        let yPos2 = 268;
        linhasTexto2.forEach(linha => {
            doc.text(30, yPos2, linha);
            yPos2 += 7;
        });

        // Adicionando a data
        doc.setTextColor(255, 255, 255);
        doc.text(25, 56, datebr);

        let ypos = 125;
        let linhasPorPagina = 10; // Número máximo de linhas por página
        let linhaAtual = 0;

        // Adicionando os itens
        items.forEach((item, index) => {
            if (linhaAtual === linhasPorPagina) {
                // Criar uma nova página com o template de continuação
                doc.addPage();
                doc.addImage(
                imgContinuation,
                "JPG",
                0,
                0,
                doc.internal.pageSize.width,
                doc.internal.pageSize.height
                );
                
                ypos = 60; // Reinicia a posição Y na nova página
                linhaAtual = 0; // Reinicia a contagem de linhas
            }

            doc.setTextColor(0, 0, 0);
            doc.text(13, ypos, item.qty.toString());
            doc.text(35, ypos, item.desc);
            doc.text(160, ypos, item.price.toFixed(2));
            doc.text(180, ypos, item.total.toFixed(2));
            ypos += 10;
            linhaAtual++;
        });


        //Pegando numero de paginas
        const paginas = doc.getNumberOfPages();
        if (paginas > 1) {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(20);
          doc.text(140, 285, "TOTAL: R$" + valorTotalItens.toString());
        } else {
          doc.setTextColor(0, 0, 0);
          doc.setFontSize(20);
          doc.text(140, 230, "TOTAL: R$" + valorTotalItens.toString());
        }

        // Salvando o PDF
        doc.save(`Orçamento_${nome}.pdf`);
    };
});
