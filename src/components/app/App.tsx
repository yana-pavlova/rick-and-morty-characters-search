import { useEffect, useState } from 'react'
import { SearchInput } from '../searchInput/SearchInput'
import { Card } from '../card/Card'
import { fetchCharactersByName, loadNextPage } from '../../api'
import { Character } from '../../types/types'
import { Link } from 'react-router-dom'
import { useDebounce } from '../../hooks/useDebounce'
import { Button } from '../button/Button'

export const App = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [characters, setCharacters] = useState<Character[]>([])
  const [numberOfCharacters, setNumberOfCharacters] = useState<number | null>(
    null
  )
  const [loadingIsFinished, setLoadingIsFinished] = useState<boolean | null>(
    null
  )

  const handleLoadMore = async () => {
    const newCharacters = await loadNextPage(setLoadingIsFinished)
    setCharacters((prev) => [...prev, ...newCharacters])
  }

  const debouncedFetch = useDebounce((term: string) => {
    fetchCharactersByName(term, setLoadingIsFinished).then((data) => {
      setCharacters(data?.characters ?? [])
      setNumberOfCharacters(data?.numberOfCharacters ?? null)
    })
  }, 500)

  useEffect(() => {
    if (searchTerm.length > 3) {
      debouncedFetch(searchTerm)
    } else {
      setCharacters([])
      setNumberOfCharacters(null)
      debouncedFetch.cancel()
    }
  }, [searchTerm])

  return (
    <>
      <SearchInput changeInput={setSearchTerm} />
      {characters.length > 0 && (
        <p className="results">Found characters: {numberOfCharacters}</p>
      )}
      {characters.length > 0 && (
        <div className="wrapper">
          <div className="cards-container">
            {characters.map((character) => (
              <Link
                key={character.id}
                to={character.url}
                target="_blank"
                className="shadowed-block"
              >
                <Card {...character} />
              </Link>
            ))}
          </div>
          {loadingIsFinished === false && (
            <Button onClick={handleLoadMore}>Download more</Button>
          )}
        </div>
      )}
    </>
  )
}
