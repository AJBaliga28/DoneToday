// /controllers/todoController.js
const Todo = require("../models/Todo");

// Get all todos for the authenticated user
exports.getTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new todo
exports.createTodo = async (req, res) => {
  const { title, content } = req.body;

  try {
    const newTodo = new Todo({
      title,
      content,
      user: req.user.id,
    });

    const todo = await newTodo.save();
    res.json(todo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a todo
exports.updateTodo = async (req, res) => {
  const { title, content, status } = req.body;

  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo || todo.user.toString() !== req.user.id) {
      return res.status(404).json({ message: "Todo not found" });
    }

    todo.title = title || todo.title;
    todo.content = content || todo.content;
    todo.status = status || todo.status;

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a todo
exports.deleteTodo = async (req, res) => {
  try {
    console.log(
      "Request to delete Todo ID:",
      req.params.id,
      "by User ID:",
      req.user.id
    );

    const todo = await Todo.findById(req.params.id);
    console.log("Fetched Todo:", todo);

    // Check if the todo exists and belongs to the authenticated user
    if (!todo || todo.user.toString() !== req.user.id) {
      console.log("Todo not found or User mismatch.");
      return res.status(404).json({ message: "Todo not found" });
    }

    // Replace the deprecated .remove() with .deleteOne() method
    await todo.deleteOne();
    console.log("Todo deleted successfully.");
    res.json({ message: "Todo removed" });
  } catch (error) {
    console.error("Error deleting Todo:", error);
    res.status(500).json({ message: "Server error" });
  }
};
