export type Character = {
  id: number
  created: string
  name: string
  species: string
  status: string
  url: string
}

export type fetchedData = {
  results: Character[]
  info: { next: string | null; count: number }
}
