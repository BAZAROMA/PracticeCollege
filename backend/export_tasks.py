
import csv
import os
import argparse
from datetime import datetime

try:
    import psycopg2
except ImportError:
    raise SystemExit("psycopg2: pip install psycopg2-binary")

try:
    from dotenv import load_dotenv
    load_dotenv(dotenv_path=os.path.join(os.path.dirname(__file__), '../backend/.env'))
except ImportError:
    pass


def get_db_config():
    return {
        "host":     os.getenv("DB_HOST",     "localhost"),
        "port":     int(os.getenv("DB_PORT", 5432)),
        "dbname":   os.getenv("DB_NAME",     "task_manager"),
        "user":     os.getenv("DB_USER",     "postgres"),
        "password": os.getenv("DB_PASSWORD", ""),
    }


def fetch_tasks(conn):
    with conn.cursor() as cur:
        cur.execute("SELECT id, title, description, status, created_at FROM tasks ORDER BY id")
        columns = [desc[0] for desc in cur.description]
        return [dict(zip(columns, row)) for row in cur.fetchall()]


def export_to_csv(tasks, output_path):
    if not tasks:
        print("Задачи не найдены.")
        return

    with open(output_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=["id", "title", "description", "status", "created_at"])
        writer.writeheader()
        writer.writerows(tasks)

    print(f"Экспортировано {len(tasks)} задач {output_path}")


def main():
    parser = argparse.ArgumentParser(description="Экспорт задач из PostgreSQL в CSV")
    parser.add_argument(
        "--output", "-o",
        default=f"tasks_export_{datetime.now().strftime('%Y%m%d_%H%M%S')}.csv",
        help="Путь к выходному CSV-файлу",
    )
    args = parser.parse_args()

    config = get_db_config()
    print(f"Подключение: {config['user']}@{config['host']}:{config['port']}/{config['dbname']}")

    try:
        conn = psycopg2.connect(**config)
    except psycopg2.OperationalError as e:
        raise SystemExit(f"Не удалось подключиться к БД: {e}")

    try:
        tasks = fetch_tasks(conn)
        print(f"Найдено задач: {len(tasks)}")
        export_to_csv(tasks, args.output)
    finally:
        conn.close()


if __name__ == "__main__":
    main()
