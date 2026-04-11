// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllTodos, createTodo } from "@/lib/todos";
import type { CreateTodoInput } from "@/types/todo";

export async function GET() {
  try {
    const todos = await getAllTodos();
    return NextResponse.json({ todos });
  } catch (err) {
    console.error("[GET /api/todos]", err);
    return NextResponse.json({ error: "Failed to fetch todos" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, due_date, priority, tags, list_id } =
      body as CreateTodoInput;

    if (!title || typeof title !== "string" || title.trim() === "") {
      return NextResponse.json({ error: "title is required" }, { status: 400 });
    }

    const todo = await createTodo({
      title: title.trim(),
      description,
      due_date,
      priority,
      tags,
      list_id,
    });

    return NextResponse.json({ todo }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/todos]", err);
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
