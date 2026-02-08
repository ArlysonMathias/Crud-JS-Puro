const transacoesMock = JSON.parse(localStorage.getItem("transacoes")) || [];

const form = document.getElementById("form");

function listarTransacoes(event) {
  event?.preventDefault();
  const ul = document.getElementById("lista-transacoes");

  ul.innerHTML = "";
  transacoesMock.forEach((transacao, index) => {
    const li = document.createElement("li");
    const classe = transacao.valor > 0 ? "ganho" : "gasto";
    const bntExcluir = document.createElement("button");
    bntExcluir.textContent = "X";
    bntExcluir.classList.add("btn-delete");
    bntExcluir.onclick = () => removerTarefa(transacao.id);

    li.textContent = `${transacao.nome} - R$ ${transacao.valor.toFixed(2)}`;
    li.classList.add(classe);
    li.appendChild(bntExcluir);

    ul.appendChild(li);
  });

  calculaReceita();
  calculaDespesas();
  calculaSaldoTotal();
}

function calculaReceita() {
  let receita = 0;

  transacoesMock.forEach((transacao) => {
    if (transacao.valor > 0) {
      receita += transacao.valor;
    }
  });

  if (receita > 0) {
    document.getElementById("receitas").textContent = `R$ ${receita.toFixed(2)}`;
  }
  return receita;
}

function calculaDespesas() {
  let despesas = 0;

  transacoesMock.forEach((transacao) => {
    if (transacao.valor < 0) {
      despesas += transacao.valor;
    }
  });

  if (despesas < 0) {
    document.getElementById("despesas").textContent = `R$ ${despesas.toFixed(2)}`;
  }
  return despesas;
}

function calculaSaldoTotal() {
  let saldoTotal = 0;
  saldoTotal = calculaReceita() + calculaDespesas();

  document.getElementById("saldo").textContent = `R$ ${saldoTotal.toFixed(2)}`;
  return saldoTotal;
}

function filtroReceitas(event) {
  event.preventDefault();
  const ul = document.getElementById("lista-transacoes");

  ul.innerHTML = "";
  transacoesMock.forEach((transacao, index) => {
    const classe = "ganho";
    if (transacao.valor > 0) {
      const li = document.createElement("li");
      li.textContent = `${transacao.nome} - R$ ${transacao.valor.toFixed(2)}`;
      li.classList.add(classe);

      ul.appendChild(li);
    }
  });
}

function filtroDespesas(event) {
  event.preventDefault();
  const ul = document.getElementById("lista-transacoes");
  ul.innerHTML = "";

  transacoesMock.forEach((transacao, index) => {
    const classe = "gasto";
    if (transacao.valor < 0) {
      const li = document.createElement("li");
      li.textContent = `${transacao.nome} - R$ ${transacao.valor.toFixed(2)}`;
      li.classList.add(classe);
      ul.appendChild(li);
    }
  });
}

//Adicionar
form.onsubmit = function (event) {
  event.preventDefault();

  const formData = new FormData(form);
  const nome = formData.get("nome").trim();
  const valor = formData.get("valor").replaceAll(",", ".");

  if (nome === "") {
    return;
  }

  const valorFormated = parseFloat(valor);
  transacoesMock.push({
    id: Date.now(),
    nome,
    valor: valorFormated
  });
  localStorage.setItem("transacoes", JSON.stringify(transacoesMock));
  listarTransacoes();
};

// remover
function removerTarefa(id) {
  console.log(id);
  // event.preventDefault();
  transacoesMock.forEach((transacao, index) => {
    if (transacao.id === id) {
      transacoesMock.splice(index, 1);
    }
  });
  listarTransacoes();
}

listarTransacoes();
