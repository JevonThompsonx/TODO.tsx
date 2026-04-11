"use client";
// src/app/todos/page.tsx
import { useState, useEffect, useCallback } from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import type { Todo, CreateTodoInput } from "@/types/todo";

type Filter = "all" | "active" | "completed";

export default function TodosPage() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<Filter>("all");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setTodos(data.todos);
    } catch {
      setError("Could not load todos. Is the server running?");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  async function handleCreate(input: CreateTodoInput) {
    setCreating(true);
    try {
      const res = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) throw new Error("Failed to create");
      const data = await res.json();
      setTodos((prev) => [data.todo, ...prev]);
    } catch {
      setError("Failed to add todo.");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggle(id: string) {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed: !todo.completed }),
      });
      if (!res.ok) throw new Error("Failed to toggle");
      const data = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
    } catch {
      setError("Failed to update todo.");
    }
  }

  async function handleDelete(id: string) {
    try {
      const res = await fetch(`/api/todos/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete todo.");
    }
  }

  async function handleUpdate(
    id: string,
    updates: Partial<Pick<Todo, "title" | "description" | "due_date" | "priority">>
  ) {
    try {
      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (!res.ok) throw new Error("Failed to update");
      const data = await res.json();
      setTodos((prev) => prev.map((t) => (t.id === id ? data.todo : t)));
    } catch {
      setError("Failed to update todo.");
    }
  }

  const counts = {
    all: todos.length,
    active: todos.filter((t) => !t.completed).length,
    completed: todos.filter((t) => t.completed).length,
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 px-4 py-10">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            My Todos
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {counts.active} remaining · {counts.completed} done
          </p>
        </div>

        {error && (
          <div
            role="alert"
            className="rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 px-4 py-3 text-sm text-red-700 dark:text-red-300 flex justify-between items-center"
          >
            {error}
            <button
              onClick={() => setError("")}
              aria-label="Dismiss error"
              className="ml-4 text-red-400 hover:text-red-600"
            >
              ✕
            </button>
          </div>
        )}

        {/* Create form */}
        <TodoForm onSubmit={handleCreate} loading={creating} />

        {/* Filter tabs */}
        <div
          className="flex gap-1 bg-white dark:bg-gray-800 rounded-xl p-1 shadow-sm"
          role="tablist"
          aria-label="Filter todos"
        >
          {(["all", "active", "completed"] as Filter[]).map((f) => (
            <button
              key={f}
              role="tab"
              aria-selected={filter === f}
              onClick={() => setFilter(f)}
              className={`flex-1 py-1.5 rounded-lg text-sm font-medium capitalize transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                filter === f
                  ? "bg-indigo-600 text-white shadow"
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
              }`}
            >
              {f}{" "}
              <span className="text-xs opacity-75">({counts[f]})</span>
            </button>
          ))}
        </div>

        {/* Todo list */}
        {loading ? (
          <div className="text-center py-16 text-gray-400" aria-live="polite">
            Loading todos...
          </div>
        ) : (
          <TodoList
            todos={todos}
            filter={filter}
            onToggle={handleToggle}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        )}
      </div>
    </main>
  );
}
