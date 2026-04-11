// src/types/todo.ts
export type Priority = "low" | "medium" | "high";

export interface Todo {
  id: string;
  title: string;
  description: string | null;
  due_date: string | null;
  completed: boolean;
  priority: Priority;
  tags: string; // JSON array string e.g. '["work","urgent"]'
  list_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateTodoInput {
  title: string;
  description?: string;
  due_date?: string;
  priority?: Priority;
  tags?: string[];
  list_id?: string;
}

export interface UpdateTodoInput {
  title?: string;
  description?: string;
  due_date?: string | null;
  completed?: boolean;
  priority?: Priority;
  tags?: string[];
  list_id?: string | null;
}
