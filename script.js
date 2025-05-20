// Calculadora de Orçamento Pessoal
// Desenvolvido por: [Seu Nome]
// Data: [Data atual]
// GitHub: [Seu GitHub]

// ========== VARIÁVEIS GLOBAIS ==========

// Array para armazenar as transações
let transactions = []

// ========== SELETORES DOM ==========

// Formulário e campos
const form = document.getElementById("transaction-form")
const nameInput = document.getElementById("name")
const amountInput = document.getElementById("amount")
const categorySelect = document.getElementById("category")
const typeInput = document.getElementById("type")
const incomeBtn = document.getElementById("income-btn")
const expenseBtn = document.getElementById("expense-btn")

// Tabela de transações
const transactionsTable = document.getElementById("transactions-table")
const transactionsBody = document.getElementById("transactions-body")
const noTransactionsMessage = document.getElementById("no-transactions")

// Resumo financeiro
const totalIncomeElement = document.getElementById("total-income")
const totalExpenseElement = document.getElementById("total-expense")
const balanceElement = document.getElementById("balance")

// ========== FUNÇÕES AUXILIARES ==========

/**
 * Formata um valor numérico para o formato de moeda brasileira
 * @param {number} value - Valor a ser formatado
 * @returns {string} - Valor formatado como moeda (ex: R$ 1.234,56)
 */
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

/**
 * Gera um ID único para cada transação
 * @returns {string} - ID único
 */
function generateId() {
  return Math.random().toString(36).substring(2, 9)
}

// ========== MANIPULAÇÃO DE TRANSAÇÕES ==========

/**
 * Adiciona uma nova transação ao array e atualiza a interface
 * @param {Object} transaction - Objeto contendo os dados da transação
 */
function addTransaction(transaction) {
  // Adiciona a transação ao array
  transactions.push(transaction)

  // Atualiza a interface
  updateTransactionsList()
  updateSummary()

  // Limpa o formulário
  form.reset()

  // Redefine o tipo para despesa (padrão)
  typeInput.value = "expense"
  incomeBtn.classList.remove("active")
  expenseBtn.classList.add("active")

  // Salva as transações no localStorage
  saveTransactions()
}

/**
 * Remove uma transação pelo ID
 * @param {string} id - ID da transação a ser removida
 */
function removeTransaction(id) {
  // Filtra o array removendo a transação com o ID especificado
  transactions = transactions.filter((transaction) => transaction.id !== id)

  // Atualiza a interface
  updateTransactionsList()
  updateSummary()

  // Salva as transações no localStorage
  saveTransactions()
}

/**
 * Salva as transações no localStorage para persistência dos dados
 */
function saveTransactions() {
  localStorage.setItem("transactions", JSON.stringify(transactions))
}

/**
 * Carrega as transações do localStorage
 */
function loadTransactions() {
  const savedTransactions = localStorage.getItem("transactions")
  if (savedTransactions) {
    transactions = JSON.parse(savedTransactions)
  } else {
    // Se não houver transações salvas, carrega dados de exemplo
    transactions = [
      {
        id: generateId(),
        name: "Salário",
        amount: 3500,
        type: "income",
        category: "Trabalho",
      },
      {
        id: generateId(),
        name: "Aluguel",
        amount: 1200,
        type: "expense",
        category: "Moradia",
      },
      {
        id: generateId(),
        name: "Supermercado",
        amount: 450,
        type: "expense",
        category: "Alimentação",
      },
      {
        id: generateId(),
        name: "Freelance",
        amount: 800,
        type: "income",
        category: "Trabalho",
      },
      {
        id: generateId(),
        name: "Cinema",
        amount: 60,
        type: "expense",
        category: "Lazer",
      },
    ]
    saveTransactions()
  }
}

// ========== ATUALIZAÇÃO DA INTERFACE ==========

/**
 * Atualiza a lista de transações na interface
 */
function updateTransactionsList() {
  // Limpa o conteúdo atual da tabela
  transactionsBody.innerHTML = ""

  // Verifica se há transações para exibir
  if (transactions.length === 0) {
    // Se não houver transações, mostra a mensagem e esconde a tabela
    noTransactionsMessage.style.display = "block"
    transactionsTable.style.display = "none"
    return
  }

  // Se houver transações, esconde a mensagem e mostra a tabela
  noTransactionsMessage.style.display = "none"
  transactionsTable.style.display = "table"

  // Adiciona cada transação à tabela
  transactions.forEach((transaction) => {
    const row = document.createElement("tr")

    // Cria as células da tabela
    row.innerHTML = `
      <td>${transaction.name}</td>
      <td class="${transaction.type === "income" ? "income-value" : "expense-value"}">
        ${transaction.type === "income" ? "+" : "-"} ${formatCurrency(transaction.amount)}
      </td>
      <td class="hide-mobile">
        <span class="category-badge">${transaction.category}</span>
      </td>
      <td>
        <button class="btn-remove" data-id="${transaction.id}">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `

    // Adiciona a linha à tabela
    transactionsBody.appendChild(row)
  })

  // Adiciona eventos aos botões de remover
  document.querySelectorAll(".btn-remove").forEach((button) => {
    button.addEventListener("click", (e) => {
      const id = e.currentTarget.getAttribute("data-id")
      removeTransaction(id)
    })
  })
}

/**
 * Atualiza o resumo financeiro na interface
 */
function updateSummary() {
  // Calcula o total de receitas
  const totalIncome = transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((total, transaction) => total + transaction.amount, 0)

  // Calcula o total de despesas
  const totalExpense = transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((total, transaction) => total + transaction.amount, 0)

  // Calcula o saldo (receitas - despesas)
  const balance = totalIncome - totalExpense

  // Atualiza os elementos na interface
  totalIncomeElement.textContent = formatCurrency(totalIncome)
  totalExpenseElement.textContent = formatCurrency(totalExpense)
  balanceElement.textContent = formatCurrency(balance)

  // Adiciona ou remove a classe 'negative' do saldo com base no valor
  if (balance < 0) {
    balanceElement.classList.add("negative")
  } else {
    balanceElement.classList.remove("negative")
  }
}

// ========== EVENTOS ==========

// Inicializa a aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Carrega as transações salvas
  loadTransactions()

  // Atualiza a interface
  updateTransactionsList()
  updateSummary()

  // Configura os eventos dos botões de tipo
  incomeBtn.addEventListener("click", () => {
    typeInput.value = "income"
    incomeBtn.classList.add("active")
    expenseBtn.classList.remove("active")
  })

  expenseBtn.addEventListener("click", () => {
    typeInput.value = "expense"
    expenseBtn.classList.add("active")
    incomeBtn.classList.remove("active")
  })

  // Configura o evento de envio do formulário
  form.addEventListener("submit", (e) => {
    e.preventDefault()

    // Obtém os valores do formulário
    const name = nameInput.value.trim()
    const amount = Number.parseFloat(amountInput.value)
    const type = typeInput.value
    const category = categorySelect.value

    // Valida os dados
    if (name === "" || isNaN(amount) || amount <= 0 || category === "") {
      alert("Por favor, preencha todos os campos corretamente.")
      return
    }

    // Cria o objeto da transação
    const transaction = {
      id: generateId(),
      name,
      amount,
      type,
      category,
    }

    // Adiciona a transação
    addTransaction(transaction)
  })
})
