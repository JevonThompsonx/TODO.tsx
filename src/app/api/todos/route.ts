// src/app/api/todos/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getAllTodos, createTodo } from "@/lib/todos";
import { validateCreateTodo } from "@/lib/validate";

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
    const body = await req.json().catch(() => null);
    const { data, errors } = validateCreateTodo(body);

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const todo = await createTodo(data!);
    return NextResponse.json({ todo }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/todos]", err);
    return NextResponse.json({ error: "Failed to create todo" }, { status: 500 });
  }
}
