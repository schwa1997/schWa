'use client'

import { useState, useTransition, useRef } from 'react'
import { createNote } from '@/app/actions'
import type { NoteType } from '@/lib/types'

export default function QuickCapture() {
  const [type, setType] = useState<NoteType>('note')
  const [pending, startTransition] = useTransition()
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const content = textareaRef.current?.value ?? ''
    if (!content.trim()) return
    startTransition(async () => {
      await createNote(content, type)
      if (textareaRef.current) textareaRef.current.value = ''
    })
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.currentTarget.form?.requestSubmit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <textarea
        ref={textareaRef}
        onKeyDown={handleKeyDown}
        placeholder={type === 'todo' ? 'New todo... (⌘Enter to save)' : 'Capture a thought... (⌘Enter to save)'}
        rows={3}
        className="w-full resize-none bg-transparent border border-zinc-200 dark:border-zinc-700 rounded-lg px-4 py-3 text-sm placeholder:text-zinc-400 focus:outline-none focus:border-zinc-400 dark:focus:border-zinc-500 transition-colors"
        autoFocus
      />
      <div className="flex items-center gap-3 mt-2">
        <div className="flex gap-1 p-1 bg-zinc-100 dark:bg-zinc-800 rounded-md">
          {(['note', 'todo'] as NoteType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`px-3 py-1 text-xs rounded transition-colors ${
                type === t
                  ? 'bg-white dark:bg-zinc-700 shadow-sm font-medium'
                  : 'text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
        <button
          type="submit"
          disabled={pending}
          className="ml-auto px-4 py-1.5 text-xs bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 rounded-md hover:opacity-80 disabled:opacity-40 transition-opacity font-medium"
        >
          {pending ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}
