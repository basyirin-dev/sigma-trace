import { useNavigate } from 'react-router-dom'
import { Button } from '../shared/Button'
import styles from './NotFound.module.css'

export function NotFound() {
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      <div className={styles.card}>
        <div className={styles.code}>404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.message}>
          The page you're looking for doesn't exist in this sector of Veritas.
        </p>
        <Button onClick={() => navigate('/', { replace: true })}>
          Return to Title
        </Button>
      </div>
    </div>
  )
}
