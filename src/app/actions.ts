'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { NoteType } from '@/lib/types'

export async function createNote(content: string, type: NoteType) {
  if (!content.trim()) return
  const supabase = await createClient()
  await supabase.from('notes').insert({ content: content.trim(), type, done: false })
  revalidatePath('/')
}

export async function deleteNote(id: string) {
  const supabase = await createClient()
  await supabase.from('notes').delete().eq('id', id)
  revalidatePath('/')
}

export async function toggleTodo(id: string, done: boolean) {
  const supabase = await createClient()
  await supabase.from('notes').update({ done }).eq('id', id)
  revalidatePath('/')
}

export async function updateNote(id: string, content: string) {
  if (!content.trim()) return
  const supabase = await createClient()
  await supabase
    .from('notes')
    .update({ content: content.trim(), updated_at: new Date().toISOString() })
    .eq('id', id)
  revalidatePath('/')
}
