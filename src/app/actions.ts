'use server'

import { revalidatePath } from 'next/cache'
import { eq } from 'drizzle-orm'
import { db } from '@/lib/db'
import { notes } from '@/lib/db/schema'
import type { NoteType } from '@/lib/types'

export async function createNote(content: string, type: NoteType) {
  if (!content.trim()) return
  await db.insert(notes).values({ content: content.trim(), type })
  revalidatePath('/')
}

export async function deleteNote(id: string) {
  await db.delete(notes).where(eq(notes.id, id))
  revalidatePath('/')
}

export async function toggleTodo(id: string, done: boolean) {
  await db.update(notes).set({ done }).where(eq(notes.id, id))
  revalidatePath('/')
}

export async function updateNote(id: string, content: string) {
  if (!content.trim()) return
  await db
    .update(notes)
    .set({ content: content.trim(), updatedAt: new Date() })
    .where(eq(notes.id, id))
  revalidatePath('/')
}
