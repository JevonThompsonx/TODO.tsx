// tests/unit/todos-page.test.tsx
// Regression test for the todos route.
//
// CI was failing because `src/app/todos/page.tsx` invoked an async fetch
// synchronously inside `useEffect` (which calls setState in the effect body),
// tripping the react-hooks/set-state-in-effect lint rule. The fix fires the
// request from inside the effect and only updates state from the resolved
// promise callback. This test guards that the on-mount fetch still works and
// that no synchronous setState-in-effect regresses the page behavior.

import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import TodosPage from '@/app/todos/page';
import type { Todo } from '@/types/todo';

function makeTodo(overrides: Partial<Todo> = {}): Todo {
  return {
    id: '1',
    title: 'Buy milk',
    description: null,
    due_date: null,
    completed: false,
    priority: 'medium',
    tags: '[]',
    list_id: null,
    created_at: '',
    updated_at: '',
    ...overrides
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('TodosPage on-mount fetch', () => {
  it('fetches the todo list from /api/todos on mount and renders it', async () => {
    const fetchMock = vi.fn(async () => ({
      ok: true,
      json: async () => ({ todos: [makeTodo()] })
    }));
    vi.stubGlobal('fetch', fetchMock);

    render(<TodosPage />);

    await waitFor(() => expect(screen.getByText('Buy milk')).toBeInTheDocument());
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith('/api/todos');
  });

  it('shows an error alert when the fetch fails', async () => {
    const fetchMock = vi.fn(async () => {
      throw new Error('network down');
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<TodosPage />);

    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent(/Could not load todos/);
  });
});
