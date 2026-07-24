import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { SettingsPanel } from './SettingsPanel'
import { useAudioStore } from './stores'

function renderWithRouter(el: React.ReactElement) {
  return render(<MemoryRouter>{el}</MemoryRouter>)
}

describe('SettingsPanel', () => {
  it('renders when isOpen', () => {
    renderWithRouter(<SettingsPanel isOpen onClose={vi.fn()} />)
    expect(screen.getByTestId('settings-panel')).toBeInTheDocument()
  })

  it('shows music volume slider', () => {
    renderWithRouter(<SettingsPanel isOpen onClose={vi.fn()} />)
    expect(screen.getByTestId('music-slider')).toBeInTheDocument()
  })

  it('shows sfx volume slider', () => {
    renderWithRouter(<SettingsPanel isOpen onClose={vi.fn()} />)
    expect(screen.getByTestId('sfx-slider')).toBeInTheDocument()
  })

  it('music slider updates store', () => {
    renderWithRouter(<SettingsPanel isOpen onClose={vi.fn()} />)
    const slider = screen.getByTestId('music-slider') as HTMLInputElement
    fireEvent.change(slider, { target: { value: '50' } })
    expect(useAudioStore.getState().musicVolume).toBe(0.5)
  })

  it('mute checkbox toggles store', async () => {
    renderWithRouter(<SettingsPanel isOpen onClose={vi.fn()} />)
    useAudioStore.getState().toggleMute()
    useAudioStore.getState().toggleMute()
    const checkbox = screen.getByTestId('mute-checkbox')
    await userEvent.click(checkbox)
    expect(useAudioStore.getState().muted).toBe(true)
  })

  it('FPS checkbox exists', () => {
    renderWithRouter(<SettingsPanel isOpen onClose={vi.fn()} />)
    expect(screen.getByTestId('fps-checkbox')).toBeInTheDocument()
  })

  it('fullscreen button exists', () => {
    renderWithRouter(<SettingsPanel isOpen onClose={vi.fn()} />)
    expect(screen.getByTestId('fullscreen-btn')).toBeInTheDocument()
  })

  it('reset button exists', () => {
    renderWithRouter(<SettingsPanel isOpen onClose={vi.fn()} />)
    expect(screen.getByTestId('reset-btn')).toBeInTheDocument()
  })
})
