// src/lib/todos.ts
// Data access layer — all Todo CRUD operations.

import { v4 as uuidv4 } from "uuid";
import { getDb, initDb } from "./db";
import type { Todo, CreateTodoInput, UpdateTodoInput } from "@/types/todo";

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await initDb();
    initialized = true;
  }
}

export async function getAllTodos(): Promise<Todo[]> {
  await ensureInit();
  const db = getDb();
  const result = await db.execute(
    "SELECT * FROM todos ORDER BY created_at DESC"
  );
  return result.rows.map(rowToTodo);
}

export async function getTodoById(id: string): Promise<Todo | null> {
  await ensureInit();
  const db = getDb();
  const result = await db.execute({
    sql: "SELECT * FROM todos WHERE id = ?",
    args: [id],
  });
  if (result.rows.length === 0) return null;
  return rowToTodo(result.rows[0]);
}

export async function createTodo(input: CreateTodoInput): Promise<Todo> {
  await ensureInit();
  const db = getDb();
  const now = new Date().toISOString();
  const id = uuidv4();
  const todo: Todo = {
    id,
    title: input.title,
    description: input.description ?? null,
    due_date: input.due_date ?? null,
    completed: false,
    priority: input.priority ?? "medium",
    tags: JSON.stringify(input.tags ?? []),
    list_id: input.list_id ?? null,
    created_at: now,
    updated_at: now,
  };

  await db.execute({
    sql: `INSERT INTO todos (id, title, description, due_date, completed, priority, tags, list_id, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      todo.id,
      todo.title,
      todo.description,
      todo.due_date,
      todo.completed ? 1 : 0,
      todo.priority,
      todo.tags,
      todo.list_id,
      todo.created_at,
      todo.updated_at,
    ],
  });

  return todo;
}

export async function updateTodo(
  id: string,
  input: UpdateTodoInput
): Promise<Todo | null> {
  await ensureInit();
  const existing = await getTodoById(id);
  if (!existing) return null;

  const db = getDb();
  const now = new Date().toISOString();

  const updated: Todo = {
    ...existing,
    title: input.title ?? existing.title,
    description:
      input.description !== undefined ? input.description : existing.description,
    due_date: input.due_date !== undefined ? input.due_date : existing.due_date,
    completed: input.completed !== undefined ? input.completed : existing.completed,
    priority: input.priority ?? existing.priority,
    tags:
      input.tags !== undefined
        ? JSON.stringify(input.tags)
        : existing.tags,
    list_id:
      input.list_id !== undefined ? input.list_id : existing.list_id,
    updated_at: now,
  };

  await db.execute({
    sql: `UPDATE todos SET title=?, description=?, due_date=?, completed=?, priority=?, tags=?, list_id=?, updated_at=?
          WHERE id=?`,
    args: [
      updated.title,
      updated.description,
      updated.due_date,
      updated.completed ? 1 : 0,
      updated.priority,
      updated.tags,
      updated.list_id,
      updated.updated_at,
      id,
    ],
  });

  return updated;
}

export async function deleteTodo(id: string): Promise<boolean> {
  await ensureInit();
  const db = getDb();
  const result = await db.execute({
    sql: "DELETE FROM todos WHERE id = ?",
    args: [id],
  });
  return (result.rowsAffected ?? 0) > 0;
}

export async function toggleTodo(id: string): Promise<Todo | null> {
  const todo = await getTodoById(id);
  if (!todo) return null;
  return updateTodo(id, { completed: !todo.completed });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function rowToTodo(row: any): Todo {
  return {
    id: String(row.id),
    title: String(row.title),
    description: row.description != null ? String(row.description) : null,
    due_date: row.due_date != null ? String(row.due_date) : null,
    completed: row.completed === 1 || row.completed === true,
    priority: (row.priority as Todo["priority"]) ?? "medium",
    tags: String(row.tags ?? "[]"),
    list_id: row.list_id != null ? String(row.list_id) : null,
    created_at: String(row.created_at),
    updated_at: String(row.updated_at),
  };
}
