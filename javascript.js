let transactions = [];
let type = null;

// Ativação dos botões de tipo
document.querySelectorAll(".type-btn").forEach(btn => {
  btn.addEventListener("click", function () {
    document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    type = btn.dataset.type; // 'income' ou 'expense'
  });
});

document.querySelector("#add-btn").addEventListener("click", function () {
  const description = document.querySelector("#description").value.trim();
  const amount = parseFloat(document.querySelector("#amount").value);

  if (!description || isNaN(amount)) {
    alert("Preencha a descrição e o valor corretamente.");
    return;
  }

  if (!type) {
    alert("Selecione se é uma receita ou despesa.");
    return;
  }

  const transaction = {
    description,
    amount,
    type
  };

  transactions.push(transaction);
  renderTransactions();
  updateBalance();

  // Limpar campos
  document.querySelector("#description").value = "";
  document.querySelector("#amount").value = "";
  document.querySelectorAll(".type-btn").forEach(b => b.classList.remove("active"));
  type = null;
});

function renderTransactions() {
  const tbody = document.querySelector("#transactions-body");
  tbody.innerHTML = "";

  transactions.forEach(tx => {
    const row = document.createElement("tr");

    const descTd = document.createElement("td");
    descTd.textContent = tx.description;

    const amountTd = document.createElement("td");
    amountTd.textContent = R$ ${tx.amount.toFixed(2).replace(".", ",")};

    const typeTd = document.createElement("td");
    typeTd.textContent = tx.type === "income" ? "Receita" : "Despesa";

    row.appendChild(descTd);
    row.appendChild(amountTd);
    row.appendChild(typeTd);

    tbody.appendChild(row);
  });
}

function updateBalance() {
  const balance = transactions.reduce((total, tx) => {
    return tx.type === "income" ? total + tx.amount : total - tx.amount;
  }, 0);

  document.querySelector("#balance").textContent = R$ ${balance.toFixed(2).replace(".", ",")};
}
