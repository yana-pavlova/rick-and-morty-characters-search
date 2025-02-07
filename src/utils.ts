import { Character } from './types/types'

export function formatDate(isoString: string): string {
  const date = new Date(isoString)
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}.${month}.${year}`
}

export function formatCharacterData(characters: Character[]) {
  return characters.map(({ created, name, species, status, id, url }) => ({
    created: formatDate(created),
    name,
    species,
    status,
    id,
    url,
  }))
}
