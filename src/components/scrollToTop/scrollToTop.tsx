import styles from './scrollToTop.module.scss'
import { useEffect, useState } from 'react'
import icon from '../../images/arrow-up.svg'

export const ScrollToTop = () => {
  const [isHidden, setIsHidden] = useState(true)

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
    })
  }

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 500) {
        setIsHidden(false)
      } else {
        setIsHidden(true)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <button
      onClick={scrollToTop}
      className={`${styles.scrollToTop} ${isHidden ? 'visually-hidden' : ''}`}
      type="button"
    >
      <img
        className={styles.arrow}
        src={icon}
        alt="Arrow pointing top"
        width={0}
        height={0}
      />
    </button>
  )
}
