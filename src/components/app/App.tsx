import { useEffect, useState } from 'react'
import { SearchInput } from '../searchInput/SearchInput'
import { Card } from '../card/Card'
import { apiController } from '../../api'
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
  const [noResultsFound, setNoResultsFound] = useState<boolean | null>(null)

  const debouncedSetSearchTerm = useDebounce((value: string) => {
    setSearchTerm(value)
  }, 300)

  const handleLoadMore = async () => {
    const newCharacters = await apiController.fetchCharacters()
    setCharacters((prev) => [...prev, ...newCharacters.results])
  }

  useEffect(() => {
    apiController.setLoadingHandler(setLoadingIsFinished)
  }, [])

  useEffect(() => {
    if (characters.length === 0 && searchTerm.length > 3)
      setNoResultsFound(true)
    else setNoResultsFound(false)
  }, [characters, searchTerm])

  useEffect(() => {
    if (searchTerm.length > 3) {
      apiController.fetchCharacters({ name: searchTerm }).then((data) => {
        setCharacters(data.results)
        setNumberOfCharacters(data.info.count)
      })
    } else {
      setCharacters([])
      setNumberOfCharacters(null)
    }
  }, [searchTerm])

  return (
    <>
      <SearchInput changeInput={debouncedSetSearchTerm} />
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
      {noResultsFound && <p className="results">No results found</p>}
    </>
  )
}
