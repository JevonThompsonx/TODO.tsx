// src/app/api/todos/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getTodoById, updateTodo, deleteTodo } from "@/lib/todos";
import { validateUpdateTodo } from "@/lib/validate";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const todo = await getTodoById(id);
    if (!todo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ todo });
  } catch (err) {
    console.error(`[GET /api/todos/${id}]`, err);
    return NextResponse.json({ error: "Failed to fetch todo" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const body = await req.json().catch(() => null);
    const { data, errors } = validateUpdateTodo(body);

    if (errors.length > 0) {
      return NextResponse.json({ errors }, { status: 400 });
    }

    const todo = await updateTodo(id, data!);
    if (!todo) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ todo });
  } catch (err) {
    console.error(`[PATCH /api/todos/${id}]`, err);
    return NextResponse.json({ error: "Failed to update todo" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    const deleted = await deleteTodo(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(`[DELETE /api/todos/${id}]`, err);
    return NextResponse.json({ error: "Failed to delete todo" }, { status: 500 });
  }
}
