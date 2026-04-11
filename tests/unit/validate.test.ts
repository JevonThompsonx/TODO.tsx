// tests/unit/validate.test.ts
// Unit tests for src/lib/validate.ts

import { describe, it, expect } from "vitest";
import { validateCreateTodo, validateUpdateTodo } from "@/lib/validate";

// ─── validateCreateTodo ───────────────────────────────────────────────────────

describe("validateCreateTodo", () => {
  describe("valid inputs", () => {
    it("accepts a minimal valid input with only title", () => {
      const result = validateCreateTodo({ title: "Buy milk" });
      expect(result.errors).toHaveLength(0);
      expect(result.data).not.toBeNull();
      expect(result.data!.title).toBe("Buy milk");
    });

    it("trims whitespace from title", () => {
      const result = validateCreateTodo({ title: "  Buy milk  " });
      expect(result.errors).toHaveLength(0);
      expect(result.data!.title).toBe("Buy milk");
    });

    it("accepts all optional fields", () => {
      const result = validateCreateTodo({
        title: "Exercise",
        description: "30 min run",
        due_date: "2026-12-31",
        priority: "high",
        tags: ["health", "daily"],
        list_id: "list-abc",
      });
      expect(result.errors).toHaveLength(0);
      expect(result.data!.description).toBe("30 min run");
      expect(result.data!.due_date).toBe("2026-12-31");
      expect(result.data!.priority).toBe("high");
      expect(result.data!.tags).toEqual(["health", "daily"]);
      expect(result.data!.list_id).toBe("list-abc");
    });

    it("accepts ISO datetime string for due_date", () => {
      const result = validateCreateTodo({
        title: "Meeting",
        due_date: "2026-06-15T10:00:00Z",
      });
      expect(result.errors).toHaveLength(0);
    });

    it("accepts all valid priority values", () => {
      for (const priority of ["low", "medium", "high"] as const) {
        const result = validateCreateTodo({ title: "Task", priority });
        expect(result.errors).toHaveLength(0);
        expect(result.data!.priority).toBe(priority);
      }
    });
  });

  describe("invalid inputs — title", () => {
    it("rejects null body", () => {
      const result = validateCreateTodo(null);
      expect(result.errors).toHaveLength(1);
      expect(result.errors[0].field).toBe("body");
      expect(result.data).toBeNull();
    });

    it("rejects array body", () => {
      const result = validateCreateTodo([{ title: "x" }]);
      expect(result.errors[0].field).toBe("body");
    });

    it("rejects missing title", () => {
      const result = validateCreateTodo({ description: "no title" });
      expect(result.errors.some((e) => e.field === "title")).toBe(true);
    });

    it("rejects empty string title", () => {
      const result = validateCreateTodo({ title: "   " });
      expect(result.errors.some((e) => e.field === "title")).toBe(true);
    });

    it("rejects title that exceeds max length", () => {
      const result = validateCreateTodo({ title: "x".repeat(501) });
      expect(result.errors.some((e) => e.field === "title")).toBe(true);
    });

    it("rejects non-string title", () => {
      const result = validateCreateTodo({ title: 123 });
      expect(result.errors.some((e) => e.field === "title")).toBe(true);
    });
  });

  describe("invalid inputs — optional fields", () => {
    it("rejects invalid priority", () => {
      const result = validateCreateTodo({ title: "Task", priority: "critical" });
      expect(result.errors.some((e) => e.field === "priority")).toBe(true);
    });

    it("rejects non-array tags", () => {
      const result = validateCreateTodo({ title: "Task", tags: "work" });
      expect(result.errors.some((e) => e.field === "tags")).toBe(true);
    });

    it("rejects tags with non-string items", () => {
      const result = validateCreateTodo({ title: "Task", tags: [1, 2] });
      expect(result.errors.some((e) => e.field.startsWith("tags["))).toBe(true);
    });

    it("rejects empty string tags", () => {
      const result = validateCreateTodo({ title: "Task", tags: [""] });
      expect(result.errors.some((e) => e.field.startsWith("tags["))).toBe(true);
    });

    it("rejects invalid due_date format", () => {
      const result = validateCreateTodo({ title: "Task", due_date: "not-a-date" });
      expect(result.errors.some((e) => e.field === "due_date")).toBe(true);
    });

    it("rejects non-string description", () => {
      const result = validateCreateTodo({ title: "Task", description: 42 });
      expect(result.errors.some((e) => e.field === "description")).toBe(true);
    });

    it("rejects description that exceeds max length", () => {
      const result = validateCreateTodo({ title: "Task", description: "x".repeat(5001) });
      expect(result.errors.some((e) => e.field === "description")).toBe(true);
    });
  });
});

// ─── validateUpdateTodo ───────────────────────────────────────────────────────

describe("validateUpdateTodo", () => {
  describe("valid inputs", () => {
    it("accepts an empty update body (no-op)", () => {
      const result = validateUpdateTodo({});
      expect(result.errors).toHaveLength(0);
      expect(result.data).toEqual({});
    });

    it("accepts partial update with title only", () => {
      const result = validateUpdateTodo({ title: "Updated title" });
      expect(result.errors).toHaveLength(0);
      expect(result.data!.title).toBe("Updated title");
    });

    it("trims whitespace from title on update", () => {
      const result = validateUpdateTodo({ title: "  Trimmed  " });
      expect(result.data!.title).toBe("Trimmed");
    });

    it("accepts completed boolean toggle", () => {
      const result = validateUpdateTodo({ completed: true });
      expect(result.errors).toHaveLength(0);
      expect(result.data!.completed).toBe(true);
    });

    it("accepts null due_date to clear it", () => {
      const result = validateUpdateTodo({ due_date: null });
      expect(result.errors).toHaveLength(0);
    });

    it("accepts null list_id to clear it", () => {
      const result = validateUpdateTodo({ list_id: null });
      expect(result.errors).toHaveLength(0);
    });
  });

  describe("invalid inputs", () => {
    it("rejects null body", () => {
      const result = validateUpdateTodo(null);
      expect(result.errors[0].field).toBe("body");
    });

    it("rejects empty title string", () => {
      const result = validateUpdateTodo({ title: "" });
      expect(result.errors.some((e) => e.field === "title")).toBe(true);
    });

    it("rejects invalid completed type", () => {
      const result = validateUpdateTodo({ completed: "yes" });
      expect(result.errors.some((e) => e.field === "completed")).toBe(true);
    });

    it("rejects invalid priority value", () => {
      const result = validateUpdateTodo({ priority: "urgent" });
      expect(result.errors.some((e) => e.field === "priority")).toBe(true);
    });

    it("rejects invalid due_date string", () => {
      const result = validateUpdateTodo({ due_date: "tomorrow" });
      expect(result.errors.some((e) => e.field === "due_date")).toBe(true);
    });

    it("returns data: null when there are errors", () => {
      const result = validateUpdateTodo({ title: "" });
      expect(result.data).toBeNull();
    });
  });
});
