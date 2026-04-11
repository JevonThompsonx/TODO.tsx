"use client";
// src/components/TodoItem.tsx
import { useState } from "react";
import type { Todo, Priority } from "@/types/todo";

const PRIORITY_STYLES: Record<Priority, string> = {
  low: "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300",
  medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
  high: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onUpdate: (id: string, updates: Partial<Pick<Todo, "title" | "description" | "due_date" | "priority">>) => Promise<void>;
}

export default function TodoItem({
  todo,
  onToggle,
  onDelete,
  onUpdate,
}: TodoItemProps) {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDesc, setEditDesc] = useState(todo.description ?? "");
  const [editDue, setEditDue] = useState(todo.due_date ?? "");
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const [busy, setBusy] = useState(false);

  const tags: string[] = (() => {
    try {
      return JSON.parse(todo.tags);
    } catch {
      return [];
    }
  })();

  async function handleToggle() {
    setBusy(true);
    await onToggle(todo.id);
    setBusy(false);
  }

  async function handleDelete() {
    if (!confirm("Delete this todo?")) return;
    setBusy(true);
    await onDelete(todo.id);
    setBusy(false);
  }

  async function handleSave() {
    if (!editTitle.trim()) return;
    setBusy(true);
    await onUpdate(todo.id, {
      title: editTitle.trim(),
      description: editDesc.trim() || undefined,
      due_date: editDue || undefined,
      priority: editPriority,
    });
    setEditing(false);
    setBusy(false);
  }

  const isOverdue =
    todo.due_date &&
    !todo.completed &&
    new Date(todo.due_date) < new Date(new Date().toDateString());

  return (
    <li
      className={`group bg-white dark:bg-gray-800 rounded-xl shadow-sm border transition-all ${
        todo.completed
          ? "border-gray-200 dark:border-gray-700 opacity-60"
          : isOverdue
          ? "border-red-300 dark:border-red-700"
          : "border-gray-200 dark:border-gray-700"
      }`}
      aria-label={`Todo: ${todo.title}`}
    >
      {editing ? (
        <div className="p-4 space-y-3">
          <input
            type="text"
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Edit title"
          />
          <textarea
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            rows={2}
            placeholder="Description..."
            className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            aria-label="Edit description"
          />
          <div className="flex gap-3">
            <input
              type="date"
              value={editDue}
              onChange={(e) => setEditDue(e.target.value)}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Edit due date"
            />
            <select
              value={editPriority}
              onChange={(e) => setEditPriority(e.target.value as Priority)}
              className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label="Edit priority"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={busy}
              className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              Save
            </button>
            <button
              onClick={() => setEditing(false)}
              className="px-4 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-start gap-3 p-4">
          <button
            onClick={handleToggle}
            disabled={busy}
            aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
            className={`mt-0.5 flex-shrink-0 w-5 h-5 rounded-full border-2 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
              todo.completed
                ? "bg-indigo-500 border-indigo-500"
                : "border-gray-400 hover:border-indigo-400"
            }`}
          >
            {todo.completed && (
              <svg viewBox="0 0 20 20" fill="white" className="w-full h-full p-0.5">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414L8.414 15l-5.121-5.121a1 1 0 111.414-1.414L8.414 12.172l7.879-7.879a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            )}
          </button>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className={`text-sm font-medium ${
                  todo.completed
                    ? "line-through text-gray-400"
                    : "text-gray-800 dark:text-gray-100"
                }`}
              >
                {todo.title}
              </span>
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${PRIORITY_STYLES[todo.priority]}`}
              >
                {todo.priority}
              </span>
              {isOverdue && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300 font-medium">
                  overdue
                </span>
              )}
            </div>

            {todo.description && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                {todo.description}
              </p>
            )}

            <div className="mt-1.5 flex items-center gap-3 flex-wrap">
              {todo.due_date && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  Due {new Date(todo.due_date + "T00:00:00").toLocaleDateString()}
                </span>
              )}
              {tags.length > 0 && (
                <div className="flex gap-1 flex-wrap">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 px-1.5 py-0.5 rounded"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex-shrink-0 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={() => setEditing(true)}
              aria-label="Edit todo"
              className="p-1.5 rounded-lg text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </button>
            <button
              onClick={handleDelete}
              disabled={busy}
              aria-label="Delete todo"
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </li>
  );
}
