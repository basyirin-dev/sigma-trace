import { useState, useRef, useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import styles from './Tooltip.module.css'

export type Position = 'top' | 'right' | 'bottom' | 'left'

interface TooltipProps {
  content: string
  children: ReactNode
  position?: Position
  delay?: number
  className?: string
}

export function Tooltip({ content, children, position = 'top', delay = 300, className }: TooltipProps) {
  const [visible, setVisible] = useState(false)
  const [effectivePosition, setEffectivePosition] = useState(position)
  const wrapperRef = useRef<HTMLSpanElement>(null)
  const tooltipRef = useRef<HTMLDivElement>(null)
  const timerRef = useRef<number | undefined>(undefined)

  const show = () => {
    window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => setVisible(true), delay)
  }

  const hide = () => {
    window.clearTimeout(timerRef.current)
    setVisible(false)
  }

  useEffect(() => {
    if (!visible || !wrapperRef.current || !tooltipRef.current) return

    const wrapper = wrapperRef.current
    const tooltip = tooltipRef.current
    const wrapperRect = wrapper.getBoundingClientRect()
    const tooltipRect = tooltip.getBoundingClientRect()

    let pos = position
    const pad = 8

    if (pos === 'top' && wrapperRect.top - tooltipRect.height < pad) {
      pos = 'bottom'
    } else if (pos === 'bottom' && wrapperRect.bottom + tooltipRect.height > window.innerHeight - pad) {
      pos = 'top'
    } else if (pos === 'left' && wrapperRect.left - tooltipRect.width < pad) {
      pos = 'right'
    } else if (pos === 'right' && wrapperRect.right + tooltipRect.width > window.innerWidth - pad) {
      pos = 'left'
    }

    if (pos !== effectivePosition) {
      setEffectivePosition(pos)
    }

    let top = 0
    let left = 0

    switch (pos) {
      case 'top':
        top = wrapperRect.top - tooltipRect.height - pad
        left = wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2
        break
      case 'bottom':
        top = wrapperRect.bottom + pad
        left = wrapperRect.left + wrapperRect.width / 2 - tooltipRect.width / 2
        break
      case 'left':
        top = wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2
        left = wrapperRect.left - tooltipRect.width - pad
        break
      case 'right':
        top = wrapperRect.top + wrapperRect.height / 2 - tooltipRect.height / 2
        left = wrapperRect.right + pad
        break
    }

    tooltip.style.top = `${top}px`
    tooltip.style.left = `${left}px`
    tooltip.dataset.position = pos
  }, [visible, position, effectivePosition])

  return (
    <span
      ref={wrapperRef}
      className={`${styles.wrapper} ${className ?? ''}`}
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      {children}
      {visible &&
        createPortal(
          <div ref={tooltipRef} className={`${styles.tooltip} ${styles[effectivePosition] ?? ''}`}>
            <div className={styles.arrow} />
            {content}
          </div>,
          document.body,
        )}
    </span>
  )
}
