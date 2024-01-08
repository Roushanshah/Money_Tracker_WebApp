const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://127.0.0.1:27017/money_tracker', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a schema for expenses
const expenseSchema = new mongoose.Schema({
  description: String,
  amount: Number,
  date: { type: Date, default: Date.now }
});

const Expense = mongoose.model('Expense', expenseSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

// API endpoint to get all expenses
app.get('/api/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to add a new expense
app.post('/api/expenses', async (req, res) => {
  try {
    const { description, amount } = req.body;

    const newExpense = new Expense({ description, amount });
    await newExpense.save();

    res.json(newExpense);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

// API endpoint to delete an expense
app.delete('/api/expenses/:id', async (req, res) => {
    try {
      const expenseId = req.params.id;
      const deletedExpense = await Expense.findByIdAndDelete(expenseId);
  
      if (!deletedExpense) {
        return res.status(404).json({ error: 'Expense not found' });
      }
  
      res.json(deletedExpense);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
