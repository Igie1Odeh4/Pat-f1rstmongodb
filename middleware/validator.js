const Joi = require('joi');

const todoSchema = Joi.object({
  task: Joi.string().min(3).required(),
  completed: Joi.boolean()
});

const todoUpdateSchema = Joi.object({
  task: Joi.string().min(3),
  completed: Joi.boolean()
});

const validateTodo = (req, res, next) => {
  const { error } = todoSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
};

const validateTodoUpdate = (req, res, next) => {
  const { error } =
    todoUpdateSchema.validate(req.body);

  if (error) {
    return res.status(400).json({
      error: error.details[0].message
    });
  }

  next();
};

module.exports = {
  validateTodo,
  validateTodoUpdate
};