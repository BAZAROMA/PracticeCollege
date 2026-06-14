import { useState, useEffect } from 'react'
import './App.css'

const API = 'http://localhost:3000/tasks'

function App() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    fetch(API)
      .then(res => res.json())
      .then(data => setTasks(data))
  }, [])

  const addTask = async () => {
    if (!title) return
    const res = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description })
    })
    const newTask = await res.json()
    setTasks([...tasks, newTask])
    setTitle('')
    setDescription('')
  }

  const deleteTask = async (id) => {
    await fetch(`${API}/${id}`, { method: 'DELETE' })
    setTasks(tasks.filter(task => task.id !== id))
  }

  const changeStatus = async (id, newStatus) => {
    await fetch(`${API}/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus })
    })
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, status: newStatus } : task
    ))
  }

  return (
    <div className="container">
      <h1>Task <span>Manager</span></h1>

      <div className="form">
        <input
          placeholder="Название задачи"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Описание"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <button className="btn-create" onClick={addTask}>+ Создать</button>
      </div>

      <table>
        <thead>
          <tr>
            <th>Название</th>
            <th>Описание</th>
            <th>Статус</th>
            <th>Дата создания</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {tasks.length === 0 ? (
            <tr>
              <td colSpan="5" className="empty">Задач пока нет</td>
            </tr>
          ) : (
            tasks.map(task => (
              <tr key={task.id}>
                <td>{task.title}</td>
                <td>{task.description}</td>
                <td>
                  <select
                    value={task.status}
                    onChange={(e) => changeStatus(task.id, e.target.value)}
                  >
                    <option value="new">Новая</option>
                    <option value="in_progress">В работе</option>
                    <option value="done">Готово</option>
                  </select>
                </td>
                <td>{task.created_at ? new Date(task.created_at).toLocaleDateString('ru-RU') : '—'}</td>
                <td>
                  <button className="btn-delete" onClick={() => deleteTask(task.id)}>Удалить</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}

export default App