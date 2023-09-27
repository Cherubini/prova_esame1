import { Person } from "./person"
import { Formats } from "./format"

export interface Book {
  id: number
  title: string
  authors: Person[]
  translators: any[]
  subjects: string[]
  bookshelves: any[]
  languages: string[]
  copyright: boolean
  media_type: string
  formats: Formats
  download_count: number
}
