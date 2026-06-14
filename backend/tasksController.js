const pool = require('../db/pool');

const VALID_STATUSES = ['new', 'in_progress', 'done'];

// GET
const getAll = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM tasks ORDER BY created_at DESC'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('getAll error:', err.message);
    res.status(500).json({ error: 'Ошибка получения задач' });
  }
};

// POST
const create = async (req, res) => {
  const { title, description } = req.body;

  if (!title || title.trim() === '') {
    return res.status(400).json({ error: 'Поле title обязательно' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO tasks (title, description, status)
       VALUES ($1, $2, 'new')
       RETURNING *`,
      [title.trim(), description?.trim() || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('create error:', err.message);
    res.status(500).json({ error: 'Ошибка создания задачи' });
  }
};

// PUT tasks BY id
const updateStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status || !VALID_STATUSES.includes(status)) {
    return res.status(400).json({
      error: `Допустимые статусы: ${VALID_STATUSES.join(', ')}`,
    });
  }

  try {
    const result = await pool.query(
      'UPDATE tasks SET status = $1 WHERE id = $2 RETURNING *',
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error('updateStatus error:', err.message);
    res.status(500).json({ error: 'Ошибка обновления задачи' });
  }
};

// DELETE tasks BY id
const remove = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'DELETE FROM tasks WHERE id = $1 RETURNING id',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Задача не найдена' });
    }

    res.json({ message: `Задача #${id} удалена` });
  } catch (err) {
    console.error('remove error:', err.message);
    res.status(500).json({ error: 'Ошибка удаления задачи' });
  }
};

module.exports = { getAll, create, updateStatus, remove };
