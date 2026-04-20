'use client'

import { useState, useTransition } from 'react'
import { deleteNote, toggleTodo, updateNote } from '@/app/actions'
import type { Note } from '@/lib/types'

function formatDate(d: Date) {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

export default function NoteCard({ note }: { note: Note }) {
  const [editing, setEditing] = useState(false)
  const [editValue, setEditValue] = useState(note.content)
  const [pending, startTransition] = useTransition()

  function handleDelete() {
    startTransition(() => deleteNote(note.id))
  }

  function handleToggle() {
    startTransition(() => toggleTodo(note.id, !note.done))
  }

  function handleSaveEdit() {
    startTransition(async () => {
      await updateNote(note.id, editValue)
      setEditing(false)
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handleSaveEdit()
    if (e.key === 'Escape') { setEditing(false); setEditValue(note.content) }
  }

  return (
    <div className={`group relative border border-zinc-100 dark:border-zinc-800 rounded-lg px-4 py-3 transition-opacity ${pending ? 'opacity-40' : ''}`}>
      <div className="flex items-start gap-3">
        {note.type === 'todo' && (
          <button
            onClick={handleToggle}
            className="mt-0.5 flex-shrink-0 w-4 h-4 rounded border border-zinc-300 dark:border-zinc-600 flex items-center justify-center hover:border-zinc-500 transition-colors"
          >
            {note.done && (
              <svg className="w-2.5 h-2.5 text-zinc-600 dark:text-zinc-300" viewBox="0 0 10 10" fill="none">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            )}
          </button>
        )}

        <div className="flex-1 min-w-0">
          {editing ? (
            <textarea
              autoFocus
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={handleSaveEdit}
              rows={3}
              className="w-full resize-none bg-transparent text-sm focus:outline-none"
            />
          ) : (
            <p
              onClick={() => setEditing(true)}
              className={`text-sm whitespace-pre-wrap cursor-text leading-relaxed ${
                note.done ? 'line-through text-zinc-400' : ''
              }`}
            >
              {note.content}
            </p>
          )}
          <p className="text-[11px] text-zinc-400 mt-1">{formatDate(note.createdAt)}</p>
        </div>

        <button
          onClick={handleDelete}
          className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-zinc-400 hover:text-red-500 transition-all text-lg leading-none mt-0.5"
        >
          ×
        </button>
      </div>
    </div>
  )
}
