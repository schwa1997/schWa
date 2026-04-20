export type NoteType = 'note' | 'todo'

export interface Note {
  id: string
  type: NoteType
  content: string
  done: boolean
  created_at: string
  updated_at: string
}
