const form = document.getElementById("form");
let transacoesMock = JSON.parse(localStorage.getItem("transacoes")) || [];

function listarTransacoes(event, filtro) {
  event?.preventDefault();
  const ul = document.getElementById("lista-transacoes");
  transacoesMock = JSON.parse(localStorage.getItem("transacoes")) || [];

  ul.innerHTML = "";

  let listaFiltrada = transacoesMock.filter((element) => {
    if (filtro === "receitas") {
      return element.valor > 0;
    } else if (filtro === "despesas") {
      return element.valor < 0;
    } else {
      return true;
    }
  });

  listaFiltrada.forEach((transacao, index) => {
    criarLi(transacao);
  });

  mostrarSaldoReceita();
  mostrarSaldoDespesa();
  calculaSaldoTotal();
}

function criarLi(transacao) {
  const li = document.createElement("li");
  const classe = transacao.valor > 0 ? "ganho" : "gasto";
  const btnExcluir = document.createElement("button");
  btnExcluir.textContent = "X";
  btnExcluir.classList.add("btn-delete");
  btnExcluir.onclick = () => removerTarefa(transacao.id);
  ul = document.getElementById("lista-transacoes");

  li.classList.add(classe);
  li.innerHTML = `${transacao.nome} - R$ ${transacao.valor.toFixed(2)}`;
  li.appendChild(btnExcluir);
  ul.appendChild(li);
}

function calculaReceita() {
  let receita = transacoesMock;

  receita = receita
    .filter((element) => element.valor > 0)
    .reduce((acc, transacao) => {
      return acc + transacao.valor;
    }, 0);
  return receita;
}

function mostrarSaldoReceita() {
  receita = calculaReceita();
  if (receita > 0) {
    document.getElementById("receitas").textContent = `R$ ${receita.toFixed(2)}`;
  }
}

function calculaDespesas() {
  let despesas = transacoesMock;

  despesas = despesas
    .filter((element) => element.valor < 0)
    .reduce((acc, transacao) => {
      return acc + transacao.valor;
    }, 0);
  return despesas;
}

function mostrarSaldoDespesa() {
  despesas = calculaDespesas();
  if (despesas < 0) {
    document.getElementById("despesas").textContent = `R$ ${despesas.toFixed(2)}`;
  }
}

function calculaSaldoTotal() {
  let saldoTotal = 0;
  saldoTotal = calculaReceita() + calculaDespesas();

  document.getElementById("saldo").textContent = `R$ ${saldoTotal.toFixed(2)}`;
  return saldoTotal;
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

  document.getElementById("nome").value = "";
  document.getElementById("valor").value = "";
};

// remover
function removerTarefa(id) {
  // console.log(id);
  let listaAtualizada = transacoesMock.filter((element) => element.id !== id);
  localStorage.setItem("transacoes", JSON.stringify(listaAtualizada));

  listarTransacoes();
}

listarTransacoes();
