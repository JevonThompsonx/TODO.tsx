// tests/unit/todos.test.ts
// Unit tests for the todos data-access layer.
// Uses an in-memory SQLite DB to avoid touching the filesystem.

import { describe, it, expect, beforeEach, vi } from "vitest";
import { createClient } from "@libsql/client";

// Each test gets its own fresh in-memory client
let _testClient: ReturnType<typeof createClient>;

vi.mock("@/lib/db", () => ({
  getDb: () => _testClient,
  initDb: async () => {
    await _testClient.execute(`DROP TABLE IF EXISTS todos`);
    await _testClient.execute(`
      CREATE TABLE IF NOT EXISTS todos (
        id TEXT PRIMARY KEY, title TEXT NOT NULL, description TEXT,
        due_date TEXT, completed INTEGER NOT NULL DEFAULT 0,
        priority TEXT NOT NULL DEFAULT 'medium', tags TEXT NOT NULL DEFAULT '[]',
        list_id TEXT, created_at TEXT NOT NULL, updated_at TEXT NOT NULL
      )
    `);
  },
}));

let todos: typeof import("@/lib/todos");

beforeEach(async () => {
  _testClient = createClient({ url: "file::memory:" });
  vi.resetModules();
  todos = await import("@/lib/todos");
});

describe("createTodo", () => {
  it("creates a todo with required fields", async () => {
    const todo = await todos.createTodo({ title: "Buy milk" });
    expect(todo.id).toBeTruthy();
    expect(todo.title).toBe("Buy milk");
    expect(todo.completed).toBe(false);
    expect(todo.priority).toBe("medium");
    expect(todo.tags).toBe("[]");
  });

  it("creates a todo with all optional fields", async () => {
    const todo = await todos.createTodo({
      title: "Exercise",
      description: "30 min run",
      due_date: "2026-12-31",
      priority: "high",
      tags: ["health", "daily"],
    });
    expect(todo.description).toBe("30 min run");
    expect(todo.due_date).toBe("2026-12-31");
    expect(todo.priority).toBe("high");
    expect(JSON.parse(todo.tags)).toEqual(["health", "daily"]);
  });
});

describe("getAllTodos", () => {
  it("returns empty array when no todos", async () => {
    const result = await todos.getAllTodos();
    expect(result).toEqual([]);
  });

  it("returns all created todos", async () => {
    await todos.createTodo({ title: "First" });
    await todos.createTodo({ title: "Second" });
    const result = await todos.getAllTodos();
    expect(result).toHaveLength(2);
    const titles = result.map((t) => t.title);
    expect(titles).toContain("First");
    expect(titles).toContain("Second");
  });
});

describe("getTodoById", () => {
  it("returns null for non-existent id", async () => {
    const result = await todos.getTodoById("does-not-exist");
    expect(result).toBeNull();
  });

  it("returns the correct todo by id", async () => {
    const created = await todos.createTodo({ title: "Find me" });
    const found = await todos.getTodoById(created.id);
    expect(found).not.toBeNull();
    expect(found!.title).toBe("Find me");
  });
});

describe("updateTodo", () => {
  it("returns null for non-existent id", async () => {
    const result = await todos.updateTodo("bad-id", { title: "X" });
    expect(result).toBeNull();
  });

  it("updates title and description", async () => {
    const created = await todos.createTodo({ title: "Old title" });
    const updated = await todos.updateTodo(created.id, {
      title: "New title",
      description: "Added desc",
    });
    expect(updated!.title).toBe("New title");
    expect(updated!.description).toBe("Added desc");
  });

  it("updates completed status", async () => {
    const created = await todos.createTodo({ title: "Task" });
    expect(created.completed).toBe(false);
    const updated = await todos.updateTodo(created.id, { completed: true });
    expect(updated!.completed).toBe(true);
  });
});

describe("deleteTodo", () => {
  it("returns false for non-existent id", async () => {
    const result = await todos.deleteTodo("bad-id");
    expect(result).toBe(false);
  });

  it("deletes an existing todo", async () => {
    const created = await todos.createTodo({ title: "Delete me" });
    const deleted = await todos.deleteTodo(created.id);
    expect(deleted).toBe(true);
    const found = await todos.getTodoById(created.id);
    expect(found).toBeNull();
  });
});

describe("toggleTodo", () => {
  it("toggles completed from false to true", async () => {
    const created = await todos.createTodo({ title: "Toggle me" });
    const toggled = await todos.toggleTodo(created.id);
    expect(toggled!.completed).toBe(true);
  });

  it("toggles completed back to false", async () => {
    const created = await todos.createTodo({ title: "Toggle back" });
    await todos.toggleTodo(created.id);
    const toggled = await todos.toggleTodo(created.id);
    expect(toggled!.completed).toBe(false);
  });
});
