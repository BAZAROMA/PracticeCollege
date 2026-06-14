require('dotenv').config();
const express = require('express');
const cors    = require('cors');
const tasks   = require('./tasksController');

const app  = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.get   ('/tasks',      tasks.getAll);
app.post  ('/tasks',      tasks.create);
app.put   ('/tasks/:id',  tasks.updateStatus);
app.delete('/tasks/:id',  tasks.remove);

app.use((req, res) => {
  res.status(404).json({ error: 'Маршрут не найден' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

app.listen(PORT, () => {
  console.log(`Сервер запущен: http://localhost:${PORT}`);
});