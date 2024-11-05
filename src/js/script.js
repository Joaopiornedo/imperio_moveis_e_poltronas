// Função que cria item no Board
document.getElementById("addItemBtn").addEventListener("click", function () {
    const item = document.createElement('div');
    item.classList.add('item');

    const qtyInput = document.createElement('input');
    qtyInput.type = 'number';
    qtyInput.placeholder = 'Qtd';
    qtyInput.required = true;
    qtyInput.style.width = '10%';
    qtyInput.step = '0.01';

    // Substituindo o campo de descrição por um select com opções predefinidas
    const descSelect = document.createElement('select');
    descSelect.required = true;
    descSelect.style.width = '70%';

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
        optionElement.value = opt.value;
        optionElement.text = opt.label;
        descSelect.appendChild(optionElement);
    });

    // Exibir o preço automaticamente baseado na opção selecionada
    const priceDisplay = document.createElement('input');
    priceDisplay.type = 'number';
    priceDisplay.placeholder = 'uni';
    priceDisplay.required = true;
    priceDisplay.style.width = '15%';
    priceDisplay.setAttribute('id', 'un')
    priceDisplay.step = '0.01';
    

    // Responsividade
    if (window.innerWidth <= 768) {
        descSelect.style.width = '60%';
        qtyInput.style.width = '15%';
        priceDisplay.value = descSelect.value;
    }



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
document.getElementById("orcamentoForm").addEventListener("submit", function (event) {
    event.preventDefault();

    // Pegando os inputs
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const data = document.getElementById("data").value;
    const tcond = document.getElementById("tcond").value;
    const fpag = document.getElementById("fpag").value;

    const [ano, mes, dia] = data.split('-');
    const datebr = `${dia}/${mes}/${ano}`;

    let valorTotalItens = 0; // Variável para somar o total do orçamento

    // Pegando valores do input do board
    const items = [];
    document.querySelectorAll("#board .item").forEach(function (itemDiv) {
        const qty = parseFloat(itemDiv.querySelector("input[type='number']").value);
        const desc = itemDiv.querySelector("select").selectedOptions[0].text;
        const price = parseFloat(itemDiv.querySelector("input[id='un']").value);
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
        doc.text(125, 100, telefone);
        

        // Define a largura máxima (em pontos) para o texto no PDF
        const larguraMaxima = 70; // ajuste conforme necessário

        // Divide o texto em várias linhas com base na largura máxima
        const linhasTexto = doc.splitTextToSize(tcond, larguraMaxima);
        
        // Define a posição inicial
        let yPos = 242; // ajuste a posição y conforme necessário

        // Desenha cada linha do texto no PDF
        linhasTexto.forEach(linha => {
            doc.text(135, yPos, linha); // ajuste x e y conforme necessário
            yPos += 7; // move para a linha de baixo, ajuste conforme a altura da linha desejada
        });
        /////////////////////////////
        const larguraMax = 70;
        const linhasTexto2 = doc.splitTextToSize(fpag, larguraMax);
        let yPos2 = 272;
        linhasTexto2.forEach(linha => {
            doc.text(135, yPos2, linha); // ajuste x e y conforme necessário
            yPos2 += 7; // move para a linha de baixo, ajuste conforme a altura da linha desejada
        });



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