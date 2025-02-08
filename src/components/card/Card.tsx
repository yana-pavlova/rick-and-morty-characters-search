import styles from './Card.module.scss'

interface CardProps {
  name: string
  species: string
  status: string
  created: string
}

export const Card = ({ name, species, status, created }: CardProps) => {
  return (
    <>
      <h3 className={styles.title}>
        {name} - {species}
      </h3>
      <p className={styles.status}>
        Status:{' '}
        <span className={`${styles[status.toLowerCase()]}`}>{status}</span>
      </p>
      <p className={styles.created}>Created: {created}</p>
    </>
  )
}
