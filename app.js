const express = require('express');
const cors = require('cors');
require('dotenv').config();

const connectDB = require('./database/db');
const { validateTodo, validateTodoUpdate } = require('./middleware/validator');
const errorHandler = require('./middleware/errorHandler');
const logRequest = require('./middleware/logger');
const TodoModel = require('./todomodels/todo.model');

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(cors());
app.use(logRequest);


// GET All Todos
app.get('/todos', async (req, res, next) => {
  try {
    const todos = await TodoModel.find();
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});


// GET Active Todos
app.get('/todos/active', async (req, res, next) => {
  try {
    const todos = await TodoModel.find({ completed: false });
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});


// GET Completed Todos
app.get('/todos/completed', async (req, res, next) => {
  try {
    const todos = await TodoModel.find({ completed: true });
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
});


// GET One Todo
app.get('/todos/:id', async (req, res, next) => {
  try {

    const todo = await TodoModel.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({
        message: 'Todo not found'
      });
    }

    res.status(200).json(todo);

  } catch (err) {
    next(err);
  }
});


// POST Create Todo
app.post(
  '/todos',
  validateTodo,
  async (req, res, next) => {

    try {

      const newTodo = await TodoModel.create(req.body);

      res.status(201).json(newTodo);

    } catch (err) {
      next(err);
    }

  }
);


// PATCH Update Todo
app.patch(
  '/todos/:id',
  validateTodoUpdate,
  async (req, res, next) => {

    try {

      const updatedTodo =
        await TodoModel.findByIdAndUpdate(
          req.params.id,
          req.body,
          { new: true }
        );

      if (!updatedTodo) {
        return res.status(404).json({
          message: 'Todo not found'
        });
      }

      res.status(200).json(updatedTodo);

    } catch (err) {
      next(err);
    }

  }
);


// DELETE Todo
app.delete('/todos/:id', async (req, res, next) => {

  try {

    const deletedTodo =
      await TodoModel.findByIdAndDelete(req.params.id);

    if (!deletedTodo) {
      return res.status(404).json({
        message: 'Todo not found'
      });
    }

    res.status(204).send();

  } catch (err) {
    next(err);
  }

});


// Error Handler (only once!)
app.use(errorHandler);
app.use(errorHandler); app.use((err, req, res, next) => { console.error(err.stack); res.status(err.status || 500).json({ message: err.message || 'Internal Server Error' }); });      

// Start Server
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);  
