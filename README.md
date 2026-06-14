# AI Task Manager

Веб-приложение для управления задачами. 
React + Node.js + PostgreSQL.

## Структура проекта

```
├── backend/
│   ├── index.js                 # Express + маршруты + обработка ошибок
│   ├── pool.js                  # Подключение к PostgreSQL
│   ├── tasksController.js       # CRUD-логика
│   ├── .env                     # Переменные окружения
│   └── export_tasks.py          # Экспорт задач в CSV
└── frontend/
    ├── index.html
    └── src/
        ├── main.jsx             # Точка входа React
        ├── App.jsx              # Главный компонент
        ├── App.css              # Стили компонента
        ├── index.css            # Глобальные стили
```

---

## Установка ПО

Перед запуском установить:

- [Node.js](https://nodejs.org/)
- [PostgreSQL](https://www.postgresql.org/download/)
- [Python](https://www.python.org/downloads/) 
- [Git](https://git-scm.com/)

---

## Запуск проекта

### 1. База данных

psql -U postgres -c "CREATE DATABASE task_manager;"
psql -U postgres -d task_manager -f database/init.sql

### 2. Backend

`.env`

```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=task_manager
DB_USER=postgres
DB_PASSWORD=

PORT=3000

```
npm install
node index.js
```

### 3. Frontend

```
/frontend
npm install
npm run dev
```

Порт :5173

---

## API

| Метод    | URL           | Тело запроса             | Описание          |
|----------|---------------|--------------------------|-------------------|
| `GET`    | `/tasks`      | —                        | Список задач      |
| `POST`   | `/tasks`      | `{ title, description }` | Создать задачу    |
| `PUT`    | `/tasks/:id`  | `{ status }`             | Изменить статус   |
| `DELETE` | `/tasks/:id`  | —                        | Удалить задачу    |

Допустимые статусы: `new`, `in_progress`, `done`

---

## Python — экспорт в CSV

python export_tasks.py

