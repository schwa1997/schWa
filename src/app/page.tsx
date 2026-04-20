import { createClient } from '@/lib/supabase/server'
import QuickCapture from './components/QuickCapture'
import NoteCard from './components/NoteCard'
import type { Note } from '@/lib/types'

export default async function Page() {
  const supabase = await createClient()
  const { data: notes } = await supabase
    .from('notes')
    .select('*')
    .order('created_at', { ascending: false })

  const todos = (notes as Note[] | null)?.filter((n) => n.type === 'todo') ?? []
  const texts = (notes as Note[] | null)?.filter((n) => n.type === 'note') ?? []

  return (
    <main className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-xl font-semibold tracking-tight mb-8">schWa</h1>

      <QuickCapture />

      {todos.length > 0 && (
        <section className="mb-8">
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Todos</h2>
          <div className="flex flex-col gap-2">
            {todos.map((note) => <NoteCard key={note.id} note={note} />)}
          </div>
        </section>
      )}

      {texts.length > 0 && (
        <section>
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-3">Notes</h2>
          <div className="flex flex-col gap-2">
            {texts.map((note) => <NoteCard key={note.id} note={note} />)}
          </div>
        </section>
      )}

      {todos.length === 0 && texts.length === 0 && (
        <p className="text-sm text-zinc-400 text-center py-12">Nothing here yet. Start writing.</p>
      )}
    </main>
  )
}
