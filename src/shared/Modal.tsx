import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { Button } from './Button'
import styles from './Modal.module.css'

interface ModalProps {
  title: string
  children: ReactNode
  isOpen: boolean
  onClose: () => void
  variant?: 'default' | 'lightbox' | 'confirm'
  confirmLabel?: string
  cancelLabel?: string
  onConfirm?: () => void
  className?: string
}

export function Modal({
  title,
  children,
  isOpen,
  onClose,
  variant = 'default',
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  className,
}: ModalProps) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    if (isOpen) {
      closeRef.current?.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) return
    const modal = modalRef.current
    if (!modal) return
    const focusable = modal.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    function trap(e: KeyboardEvent) {
      if (e.key !== 'Tab') return
      if (e.shiftKey) {
        if (document.activeElement === first) {
          e.preventDefault()
          last?.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          first?.focus()
        }
      }
    }
    window.addEventListener('keydown', trap)
    return () => window.removeEventListener('keydown', trap)
  }, [isOpen])

  if (!isOpen) return null

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && variant !== 'confirm') {
      onClose()
    }
  }

  const modal = (
    <div className={styles.backdrop} onClick={handleBackdropClick} role="dialog" aria-modal="true" aria-label={title}>
      <div ref={modalRef} className={`${styles.modal} ${className ?? ''}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            ref={closeRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className={styles.content}>{children}</div>
        {variant === 'confirm' && (
          <div className={styles.actions}>
            <Button variant="secondary" onClick={onClose}>
              {cancelLabel}
            </Button>
            <Button variant="danger" onClick={onConfirm}>
              {confirmLabel}
            </Button>
          </div>
        )}
      </div>
    </div>
  )

  if (variant === 'lightbox') {
    if (!isOpen) return null
    return createPortal(
      <div className={`${styles.backdrop} ${styles.lightbox}`} onClick={handleBackdropClick}>
        <div className={`${styles.modal} ${className ?? ''}`}>
          <button
            ref={closeRef}
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
          <div className={styles.content}>{children}</div>
        </div>
      </div>,
      document.body,
    )
  }

  return createPortal(modal, document.body)
}
