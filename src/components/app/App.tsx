import { useEffect, useState } from 'react'
import { SearchInput } from '../searchInput/SearchInput'
import { Card } from '../card/Card'
import { apiController } from '../../api'
import { Character } from '../../types/types'
import { Link } from 'react-router-dom'
import { useDebounce } from '../../hooks/useDebounce'
import { Button } from '../button/Button'

export const App = () => {
  const [searchResults, setSearchResults] = useState<{
    characters: Character[]
    numberOfCharacters: number | null
    noResultsFound: boolean
  }>({
    characters: [],
    numberOfCharacters: null,
    noResultsFound: false,
  })
  const [searchTerm, setSearchTerm] = useState('')
  const [loadingIsFinished, setLoadingIsFinished] = useState<boolean | null>(
    null
  )

  const debouncedSetSearchTerm = useDebounce((value: string) => {
    setSearchTerm(value)
  }, 300)

  const handleLoadMore = async () => {
    const newCharacters = await apiController.fetchCharacters()
    setSearchResults((prev) => ({
      ...prev,
      characters: [...prev.characters, ...newCharacters.results],
    }))
  }

  useEffect(() => {
    apiController.setLoadingHandler(setLoadingIsFinished)
  }, [])

  useEffect(() => {
    if (searchTerm.length > 3) {
      apiController.fetchCharacters({ name: searchTerm }).then((data) => {
        setSearchResults({
          characters: data.results,
          numberOfCharacters: data.info.count,
          noResultsFound: data.results.length === 0,
        })
      })
    } else {
      setSearchResults({
        characters: [],
        numberOfCharacters: null,
        noResultsFound: false,
      })
    }
  }, [searchTerm])

  return (
    <>
      <SearchInput changeInput={debouncedSetSearchTerm} />
      {searchResults.characters.length > 0 && (
        <p className="results">
          Found characters: {searchResults.numberOfCharacters}
        </p>
      )}
      {searchResults.characters.length > 0 && (
        <div className="wrapper">
          <div className="cards-container">
            {searchResults.characters.map((character) => (
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
      {searchResults.noResultsFound && (
        <p className="results">No results found</p>
      )}
    </>
  )
}
