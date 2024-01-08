document.addEventListener('DOMContentLoaded', function () {
    const expenseForm = document.getElementById('expenseForm');
    const expensesList = document.getElementById('expensesList');
    const totalAmount = document.getElementById('total-amount');

    let total_Amount = 0;
  
    expenseForm.addEventListener('submit', function (event) {
      event.preventDefault();
  
      const description = document.getElementById('description').value;
      const amount = parseFloat(document.getElementById('amount').value);
  
      if (description && !isNaN(amount)) {
        addExpense(description, amount);
        expenseForm.reset();
      } else {
        alert('Please fill in both description and amount.');
      }
    });
  
    async function addExpense(description, amount) {
      try {
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ description, amount }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to add expense');
        }
  
        const newExpense = await response.json();

        displayExpense(newExpense);
      } catch (error) {
        console.error(error);
      }
    }
  
    async function loadExpenses() {
      try {
        const response = await fetch('/api/expenses');
        if (!response.ok) {
          throw new Error('Failed to fetch expenses');
        }
  
        const expenses = await response.json();
        expenses.forEach(displayExpense);
      } catch (error) {
        console.error(error);
      }
    }

    async function deleteExpense(event) { 
        if (event.target.classList.contains('delete-btn')) {
            const expenseId = event.target.getAttribute('data-id');
      
            try {
              const response = await fetch(`/api/expenses/${expenseId}`, {
                method: 'DELETE',
              });
      
              if (!response.ok) {
                throw new Error('Failed to delete expense');
              }
      
              // Remove the expense from the client-side display
              event.target.parentElement.remove();

              const deletedExpenseAmount = parseFloat(event.target.previousElementSibling.textContent);

              total_Amount -= deletedExpenseAmount;
              totalAmount.textContent = total_Amount.toFixed(2);
            } catch (error) {
              console.error(error);
            }
          }
    } 
  
    function displayExpense(expense) {
      const expenseItem = document.createElement('tr');
  
      const date = new Date(expense.date).toLocaleDateString();
      expenseItem.innerHTML = `
        <td>${expense.description}</td>
        <td>${expense.amount}</td>
        <td>${date}</td>
        <td class="delete-btn" data-id="${expense._id}">Delete</td>
      `;
  
      expensesList.appendChild(expenseItem);

      total_Amount += expense.amount;
      totalAmount.textContent = total_Amount.toFixed(2);
    }

    expensesList.addEventListener("click", deleteExpense); 
  
    loadExpenses();
  });
  