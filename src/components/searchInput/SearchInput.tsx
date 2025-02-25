import React, { useLayoutEffect } from 'react'
import styles from './SearchInput.module.scss'

interface SearchInputProps {
  changeInput: (value: string) => void
}

export const SearchInput = ({ changeInput }: SearchInputProps) => {
  const ref = React.useRef<HTMLInputElement>(null)

  useLayoutEffect(() => {
    if (ref.current) ref.current.focus()
  }, [])

  const handleChange = (value: string) => {
    changeInput(value.trim())
  }

  return (
    <div className={`${styles.container} shadowed-block`}>
      <form onSubmit={(e) => e.preventDefault()}>
        <input
          ref={ref}
          className={styles.input}
          placeholder="Search characters..."
          type="text"
          onChange={(e) => handleChange(e.target.value)}
        />
      </form>
    </div>
  )
}
