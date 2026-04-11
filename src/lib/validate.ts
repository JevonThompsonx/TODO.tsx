// src/lib/validate.ts
// Input validation helpers for Todo API routes.
// Returns typed error messages; callers decide HTTP response codes.

import type { CreateTodoInput, UpdateTodoInput, Priority } from "@/types/todo";

const VALID_PRIORITIES: Priority[] = ["low", "medium", "high"];
const MAX_TITLE_LENGTH = 500;
const MAX_DESCRIPTION_LENGTH = 5000;
const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 100;
const MAX_LIST_ID_LENGTH = 128;

export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult<T> {
  data: T | null;
  errors: ValidationError[];
}

/** Validate and sanitize a CreateTodoInput from raw request body. */
export function validateCreateTodo(
  body: unknown
): ValidationResult<CreateTodoInput> {
  const errors: ValidationError[] = [];

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {
      data: null,
      errors: [{ field: "body", message: "Request body must be a JSON object" }],
    };
  }

  const raw = body as Record<string, unknown>;

  // title — required
  if (raw.title === undefined || raw.title === null) {
    errors.push({ field: "title", message: "title is required" });
  } else if (typeof raw.title !== "string") {
    errors.push({ field: "title", message: "title must be a string" });
  } else if (raw.title.trim() === "") {
    errors.push({ field: "title", message: "title must not be empty" });
  } else if (raw.title.trim().length > MAX_TITLE_LENGTH) {
    errors.push({
      field: "title",
      message: `title must be at most ${MAX_TITLE_LENGTH} characters`,
    });
  }

  // description — optional string
  if (raw.description !== undefined && raw.description !== null) {
    if (typeof raw.description !== "string") {
      errors.push({ field: "description", message: "description must be a string" });
    } else if (raw.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push({
        field: "description",
        message: `description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
      });
    }
  }

  // due_date — optional ISO 8601 date string
  if (raw.due_date !== undefined && raw.due_date !== null) {
    if (typeof raw.due_date !== "string") {
      errors.push({ field: "due_date", message: "due_date must be a string" });
    } else if (!isValidDate(raw.due_date)) {
      errors.push({
        field: "due_date",
        message: "due_date must be a valid ISO 8601 date (YYYY-MM-DD or full ISO string)",
      });
    }
  }

  // priority — optional enum
  if (raw.priority !== undefined && raw.priority !== null) {
    if (!VALID_PRIORITIES.includes(raw.priority as Priority)) {
      errors.push({
        field: "priority",
        message: `priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
      });
    }
  }

  // tags — optional array of strings
  if (raw.tags !== undefined && raw.tags !== null) {
    if (!Array.isArray(raw.tags)) {
      errors.push({ field: "tags", message: "tags must be an array" });
    } else {
      if (raw.tags.length > MAX_TAGS) {
        errors.push({
          field: "tags",
          message: `tags must have at most ${MAX_TAGS} items`,
        });
      }
      (raw.tags as unknown[]).forEach((tag, i) => {
        if (typeof tag !== "string") {
          errors.push({ field: `tags[${i}]`, message: "each tag must be a string" });
        } else if (tag.trim() === "") {
          errors.push({ field: `tags[${i}]`, message: "tags must not be empty strings" });
        } else if (tag.length > MAX_TAG_LENGTH) {
          errors.push({
            field: `tags[${i}]`,
            message: `each tag must be at most ${MAX_TAG_LENGTH} characters`,
          });
        }
      });
    }
  }

  // list_id — optional string
  if (raw.list_id !== undefined && raw.list_id !== null) {
    if (typeof raw.list_id !== "string") {
      errors.push({ field: "list_id", message: "list_id must be a string" });
    } else if (raw.list_id.length > MAX_LIST_ID_LENGTH) {
      errors.push({
        field: "list_id",
        message: `list_id must be at most ${MAX_LIST_ID_LENGTH} characters`,
      });
    }
  }

  if (errors.length > 0) return { data: null, errors };

  return {
    data: {
      title: (raw.title as string).trim(),
      description: raw.description !== undefined && raw.description !== null
        ? (raw.description as string)
        : undefined,
      due_date: raw.due_date !== undefined && raw.due_date !== null
        ? (raw.due_date as string)
        : undefined,
      priority: raw.priority !== undefined && raw.priority !== null
        ? (raw.priority as Priority)
        : undefined,
      tags: raw.tags !== undefined && raw.tags !== null
        ? (raw.tags as string[])
        : undefined,
      list_id: raw.list_id !== undefined && raw.list_id !== null
        ? (raw.list_id as string)
        : undefined,
    },
    errors: [],
  };
}

/** Validate and sanitize an UpdateTodoInput from raw request body. */
export function validateUpdateTodo(
  body: unknown
): ValidationResult<UpdateTodoInput> {
  const errors: ValidationError[] = [];

  if (typeof body !== "object" || body === null || Array.isArray(body)) {
    return {
      data: null,
      errors: [{ field: "body", message: "Request body must be a JSON object" }],
    };
  }

  const raw = body as Record<string, unknown>;

  // title — optional but if present must be non-empty string
  if (raw.title !== undefined) {
    if (typeof raw.title !== "string") {
      errors.push({ field: "title", message: "title must be a string" });
    } else if (raw.title.trim() === "") {
      errors.push({ field: "title", message: "title must not be empty" });
    } else if (raw.title.trim().length > MAX_TITLE_LENGTH) {
      errors.push({
        field: "title",
        message: `title must be at most ${MAX_TITLE_LENGTH} characters`,
      });
    }
  }

  // description — optional (null allowed to clear it)
  if (raw.description !== undefined && raw.description !== null) {
    if (typeof raw.description !== "string") {
      errors.push({ field: "description", message: "description must be a string" });
    } else if (raw.description.length > MAX_DESCRIPTION_LENGTH) {
      errors.push({
        field: "description",
        message: `description must be at most ${MAX_DESCRIPTION_LENGTH} characters`,
      });
    }
  }

  // due_date — optional (null allowed to clear it)
  if (raw.due_date !== undefined && raw.due_date !== null) {
    if (typeof raw.due_date !== "string") {
      errors.push({ field: "due_date", message: "due_date must be a string" });
    } else if (!isValidDate(raw.due_date)) {
      errors.push({
        field: "due_date",
        message: "due_date must be a valid ISO 8601 date",
      });
    }
  }

  // completed — optional boolean
  if (raw.completed !== undefined) {
    if (typeof raw.completed !== "boolean") {
      errors.push({ field: "completed", message: "completed must be a boolean" });
    }
  }

  // priority — optional enum
  if (raw.priority !== undefined && raw.priority !== null) {
    if (!VALID_PRIORITIES.includes(raw.priority as Priority)) {
      errors.push({
        field: "priority",
        message: `priority must be one of: ${VALID_PRIORITIES.join(", ")}`,
      });
    }
  }

  // tags — optional array of strings
  if (raw.tags !== undefined && raw.tags !== null) {
    if (!Array.isArray(raw.tags)) {
      errors.push({ field: "tags", message: "tags must be an array" });
    } else {
      if (raw.tags.length > MAX_TAGS) {
        errors.push({
          field: "tags",
          message: `tags must have at most ${MAX_TAGS} items`,
        });
      }
      (raw.tags as unknown[]).forEach((tag, i) => {
        if (typeof tag !== "string") {
          errors.push({ field: `tags[${i}]`, message: "each tag must be a string" });
        } else if (tag.trim() === "") {
          errors.push({ field: `tags[${i}]`, message: "tags must not be empty strings" });
        } else if (tag.length > MAX_TAG_LENGTH) {
          errors.push({
            field: `tags[${i}]`,
            message: `each tag must be at most ${MAX_TAG_LENGTH} characters`,
          });
        }
      });
    }
  }

  // list_id — optional (null allowed to clear it)
  if (raw.list_id !== undefined && raw.list_id !== null) {
    if (typeof raw.list_id !== "string") {
      errors.push({ field: "list_id", message: "list_id must be a string" });
    } else if (raw.list_id.length > MAX_LIST_ID_LENGTH) {
      errors.push({
        field: "list_id",
        message: `list_id must be at most ${MAX_LIST_ID_LENGTH} characters`,
      });
    }
  }

  if (errors.length > 0) return { data: null, errors };

  const data: UpdateTodoInput = {};
  if (raw.title !== undefined) data.title = (raw.title as string).trim();
  if (raw.description !== undefined) data.description = raw.description as string | undefined;
  if (raw.due_date !== undefined) data.due_date = raw.due_date as string | null | undefined;
  if (raw.completed !== undefined) data.completed = raw.completed as boolean;
  if (raw.priority !== undefined) data.priority = raw.priority as Priority | undefined;
  if (raw.tags !== undefined) data.tags = raw.tags as string[] | undefined;
  if (raw.list_id !== undefined) data.list_id = raw.list_id as string | null | undefined;

  return { data, errors: [] };
}

/** Accepts YYYY-MM-DD or any string parseable by Date that produces a valid date. */
function isValidDate(value: string): boolean {
  // Allow ISO date (YYYY-MM-DD) and ISO datetime strings
  const isoDateRe = /^\d{4}-\d{2}-\d{2}(T[\d:.Z+-]+)?$/;
  if (!isoDateRe.test(value)) return false;
  const d = new Date(value);
  return !isNaN(d.getTime());
}
