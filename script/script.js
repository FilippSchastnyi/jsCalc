class Calc {
    constructor(nodeElement) {
        this.$container = nodeElement
        this.$totalBalance = nodeElement.querySelector(".js-balance")
        this.$totalMoneyIncome = nodeElement.querySelector(".js-money-income")
        this.$totalMoneyExpress = nodeElement.querySelector(".js-money-express")
        this.$historyList = nodeElement.querySelector(".js-history-list")
        this.$form = nodeElement.querySelector(".js-form")
        this.$operationName = nodeElement.querySelector(".js-field-name")
        this.$operationAmount = nodeElement.querySelector(".js-field-amount")


        this.dbOperation = JSON.parse(localStorage.getItem('calc')) || []

        this.renderOperation = this.renderOperation.bind(this)
        this.addOperation = this.addOperation.bind(this)
        this.deleteOperation = this.deleteOperation.bind(this)
        this.generateId = this.generateId.bind(this)
        this.init()
    }

    generateId() {
        return Math.round(Math.random() * 1e8).toString(16)
    }

    deleteOperation(event) {
        const target = event.target
        if (target.classList.contains('history_delete')) {
            this.dbOperation = this.dbOperation
                .filter(item => item.id !== target.dataset.id)
        }
        this.init()
    }

    renderOperation(operation) {
        const className = operation.amount < 0
            ? 'history__item-minus'
            : 'history__item-plus'

        const listItem = document.createElement('li')
        listItem.classList.add("history__item")
        listItem.classList.add(className)
        listItem.innerHTML = `${operation.description}
                              <span class="history__money">${operation.amount} ₽</span>
                             <button class="history_delete" data-id="${operation.id}">x</button>`
        this.$historyList.append(listItem)
    }

    updateBalance() {
        const resultIncome = this.dbOperation
            .filter(item => item.amount > 0)
            .reduce((result, item) => result + item.amount, 0);

        const resultExpenses = this.dbOperation
            .filter(item => item.amount < 0)
            .reduce((result, item) => result + item.amount, 0);

        this.$totalMoneyIncome.textContent = resultIncome + " ₽"
        this.$totalMoneyExpress.textContent = resultExpenses + " ₽"
        this.$totalBalance.textContent = (resultIncome + resultExpenses) + " ₽"
    }

    addOperation(event) {
        event.preventDefault()
        const nameValue = this.$operationName.value,
            amountValue = this.$operationAmount.value

        this.$operationName.style.borderColor = ''
        this.$operationAmount.style.borderColor = ''

        if (nameValue && amountValue) {
            const operation = {
                id: this.generateId(),
                description: nameValue,
                amount: +amountValue
            }

            this.dbOperation.push(operation)
            this.init()

        } else {
            if (!nameValue) this.$operationName.style.borderColor = 'red'
            if (!amountValue) this.$operationAmount.style.borderColor = 'red'

        }
        this.$operationName.value = ""
        this.$operationAmount.value = ""
    }

    init() {
        this.$historyList.innerText = ""
        this.dbOperation.forEach(this.renderOperation)
        this.updateBalance()
        localStorage.setItem('calc', JSON.stringify(this.dbOperation))

        this.$form.addEventListener('submit', this.addOperation)
        this.$historyList.addEventListener('click', this.deleteOperation)

    }
}


document.addEventListener("DOMContentLoaded", () => {
    const calc = document.querySelector(".js-container")
    new Calc(calc)
})