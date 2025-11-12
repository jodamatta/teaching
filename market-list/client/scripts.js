

/*
  --------------------------------------------------------------------------------------
  Função para obter a lista existente do servidor via requisição GET
  --------------------------------------------------------------------------------------
*/
const getList = async () => {
  const url = (window.API_BASE || 'http://127.0.0.1:5000') + '/produtos';
  fetch(url, { method: 'get' })
    .then(r => r.json())
    .then(data => {
      data.produtos.forEach(item =>
        insertList(item.id, item.nome, item.quantidade, item.valor)
      );
    })
    .catch(() => alert('Falha ao carregar a lista.'));
};

/*
  --------------------------------------------------------------------------------------
  Chamada da função para carregamento inicial dos dados
  --------------------------------------------------------------------------------------
*/
getList()


/*
  --------------------------------------------------------------------------------------
  Função para colocar um item na lista do servidor via requisição POST
  --------------------------------------------------------------------------------------
*/
const postItem = async (inputProduct, inputQuantity, inputPrice) => {
  const formData = new FormData();
  formData.append('nome', inputProduct);
  formData.append('quantidade', inputQuantity);
  formData.append('valor', inputPrice);

  let url = 'http://127.0.0.1:5000/produto';
  return fetch(url, { method: 'post', body: formData })
    .then((response) => response.json());
};


// Criar config.py


/*
  --------------------------------------------------------------------------------------
  Função para criar um botão close para cada item da lista
  --------------------------------------------------------------------------------------
*/
const insertButton = (parent) => {
  let span = document.createElement("span");
  let txt = document.createTextNode("\u00D7");
  span.className = "close";
  span.appendChild(txt);
  parent.appendChild(span);
}


/*
  --------------------------------------------------------------------------------------
  Função para remover um item da lista de acordo com o click no botão close
  --------------------------------------------------------------------------------------
*/
const removeElement = () => {
  let close = document.getElementsByClassName("close");
  // var table = document.getElementById('myTable');
  let i;
  for (i = 0; i < close.length; i++) {
    close[i].onclick = function () {
      let div = this.parentElement.parentElement;
      const nomeItem = div.getElementsByTagName('td')[0].innerHTML
      if (confirm("Você tem certeza?")) {
        div.remove()
        deleteItem(nomeItem)
        alert("Removido!")
      }
    }
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para deletar um item da lista do servidor via requisição DELETE
  --------------------------------------------------------------------------------------
*/
const deleteItem = (item) => {
  console.log(item)
  let url = 'http://127.0.0.1:5000/produto?nome=' + item;
  fetch(url, {
    method: 'delete'
  })
    .then((response) => response.json())
    .catch((error) => {
      console.error('Error:', error);
    });
}

/*
  --------------------------------------------------------------------------------------
  Função para adicionar um novo item com nome, quantidade e valor 
  --------------------------------------------------------------------------------------
*/
const newItem = async () => {
  let inputProduct = document.getElementById("newInput").value;
  let inputQuantity = document.getElementById("newQuantity").value;
  let inputPrice = document.getElementById("newPrice").value;

  if (inputProduct === '') {
    alert("Escreva o nome de um item!");
  } else if (isNaN(inputQuantity) || isNaN(inputPrice)) {
    alert("Quantidade e valor precisam ser números!");
  } else {
    const created = await postItem(inputProduct, inputQuantity, inputPrice);
    insertList(created.id, created.nome, created.quantidade, created.valor);
    alert("Item adicionado!");
  }
}

/*
  --------------------------------------------------------------------------------------
  Função para inserir items na lista apresentada
  --------------------------------------------------------------------------------------
*/
const insertList = (id, nameProduct, quantity, price) => {
  var item = [nameProduct, quantity, price]
  var table = document.getElementById('myTable');
  var row = table.insertRow();

  for (var i = 0; i < item.length; i++) {
    var cel = row.insertCell(i);
    cel.textContent = item[i];
  }
  insertEditButton(row.insertCell(-1), id);
  insertButton(row.insertCell(-1))
  document.getElementById("newInput").value = "";
  document.getElementById("newQuantity").value = "";
  document.getElementById("newPrice").value = "";

  removeElement()
}

const updatePrice = async (id, novoValor) => {
  const url = (window.API_BASE || 'http://127.0.0.1:5000') + `/produto/preco?id=${id}`;
  const r = await fetch(url, {
    method: 'put',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ valor: Number(novoValor) })
  });
  if (!r.ok) {
    const body = await r.json().catch(() => ({}));
    throw new Error(body.mesage || 'Falha ao atualizar preço');
  }
  return r.json();
};

const insertEditButton = (parentCell, productId) => {
  const btn = document.createElement("button");
  btn.className = "edit";
  btn.textContent = "Editar";
  btn.onclick = async function () {
    const row = parentCell.parentElement;
    const priceCell = row.getElementsByTagName('td')[2];
    const current = priceCell.textContent;
    const input = prompt("Novo preço:", current);
    const id = productId ?? row.dataset.id;
    if (input === null) return;
    if (isNaN(input) || Number(input) < 0) {
      alert("O preço precisa ser um número >= 0!");
      return;
    }
    try {
      const updated = await fetch(`${API_BASE}/produto/preco?id=${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ valor: Number(input) })
      });
      priceCell.textContent = Number(updated.valor ?? input).toFixed(2);
      alert("Preço atualizado!");
    } catch (e) {
      alert(e.message);
    }
  };
  parentCell.appendChild(btn);
};

