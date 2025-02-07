import { fetchedData } from './types/types'
import { formatCharacterData } from './utils'
import { DEFAULT_FETCHED_DATA } from './constants'

export const apiController = {
  nextUrl: null as string | null,
  setLoading: null as ((value: boolean | null) => void) | null,

  setLoadingHandler(setLoadingFn: (value: boolean | null) => void) {
    this.setLoading = setLoadingFn
  },
  updateState(nextUrl: string | null) {
    this.setNextUrl(nextUrl)
    this.updateLoading(nextUrl === null)
  },
  updateLoading(value: boolean | null) {
    if (this.setLoading) {
      this.setLoading(value)
    }
  },
  setNextUrl(url: string | null) {
    this.nextUrl = url
  },
  getNextUrl() {
    return this.nextUrl
  },
  async fetchCharacters({
    name,
  }: { name?: string } = {}): Promise<fetchedData> {
    try {
      const url = name
        ? `https://rickandmortyapi.com/api/character/?name=${name}`
        : apiController.getNextUrl()!

      const data = await fetchData<fetchedData>(url, DEFAULT_FETCHED_DATA)

      apiController.updateState(data.info?.next || null)

      return {
        ...data,
        results: formatCharacterData(data.results),
      }
    } catch (error) {
      console.error(`Error in fetchCharacters: ${error}`)
      return DEFAULT_FETCHED_DATA
    }
  },
}

const fetchData = async <T>(url: string, defaultValue: T): Promise<T> => {
  try {
    const response = await fetch(url)
    if (!response.ok) return defaultValue
    return await response.json()
  } catch (error) {
    console.error(`Error fetching data: ${error}`)
    return defaultValue
  }
}
