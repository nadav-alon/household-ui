import { afterEach, describe, expect, it, vi } from 'vitest'
import { act, cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { tokenUsage, typeDeclarations, typeRoleDeclarations } from '../testing/css.ts'
import { SnackbarHost, resetSnackbar, showSnackbar } from './Snackbar.tsx'

afterEach(() => {
  resetSnackbar()
  cleanup()
  vi.useRealTimers()
})

describe('Snackbar', () => {
  it('shows a message from any screen in a status region', () => {
    render(<SnackbarHost />)
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    act(() => showSnackbar({ text: 'Deleted Bandages' }))
    expect(screen.getByRole('status')).toHaveTextContent('Deleted Bandages')
  })

  it('shows no button without an action', () => {
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Saved' }))
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('runs its action and disappears when the action is pressed', () => {
    const onAction = vi.fn()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Deleted Bandages', action: { label: 'Undo', onAction } }))
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    expect(onAction).toHaveBeenCalledOnce()
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('never calls onDismiss when the action is pressed', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Deleted Bandages', action: { label: 'Undo', onAction: () => {} }, onDismiss }))
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(onDismiss).not.toHaveBeenCalled()
  })

  it('disappears after about 6 seconds', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Saved' }))
    act(() => {
      vi.advanceTimersByTime(5900)
    })
    expect(screen.getByRole('status')).toHaveTextContent('Saved')
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('calls onDismiss once when the message times out', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Saved', onDismiss }))
    act(() => {
      vi.advanceTimersByTime(5900)
    })
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(200)
    })
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('calls onDismiss only after the hold is released and the fresh time has passed', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Saved', onDismiss }))
    const status = screen.getByRole('status')
    fireEvent.pointerEnter(status)
    act(() => {
      vi.advanceTimersByTime(7000)
    })
    expect(onDismiss).not.toHaveBeenCalled()
    fireEvent.pointerLeave(status)
    act(() => {
      vi.advanceTimersByTime(5900)
    })
    expect(onDismiss).not.toHaveBeenCalled()
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('still times out a message shown from inside the replaced message onDismiss', () => {
    vi.useFakeTimers()
    const onDismissC = vi.fn()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'A', onDismiss: () => showSnackbar({ text: 'C', onDismiss: onDismissC }) }))
    act(() => showSnackbar({ text: 'B' }))
    expect(screen.getByRole('status')).toHaveTextContent('C')
    act(() => {
      vi.advanceTimersByTime(6100)
    })
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
    expect(onDismissC).toHaveBeenCalledOnce()
  })

  it('times out the replacing message even if onDismiss throws', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() =>
      showSnackbar({
        text: 'A',
        onDismiss: () => {
          throw new Error('boom')
        },
      }),
    )
    expect(() => act(() => showSnackbar({ text: 'B' }))).toThrow('boom')
    act(() => {
      vi.advanceTimersByTime(6100)
    })
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('calls onDismiss once when the message is replaced by another, even while held', () => {
    vi.useFakeTimers()
    const onDismiss = vi.fn()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'First', onDismiss }))
    fireEvent.pointerEnter(screen.getByRole('status'))
    act(() => showSnackbar({ text: 'Second' }))
    expect(onDismiss).toHaveBeenCalledOnce()
    act(() => resetSnackbar())
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('calls onDismiss once when the snackbar is cleared with resetSnackbar, the only non-timeout dismissal', () => {
    const onDismiss = vi.fn()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Saved', onDismiss }))
    act(() => resetSnackbar())
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('replaces the current message with a second one, which gets its own full time', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'First', action: { label: 'Undo', onAction: () => {} } }))
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    act(() => showSnackbar({ text: 'Second' }))
    expect(screen.getByRole('status')).toHaveTextContent('Second')
    expect(screen.getByRole('status')).not.toHaveTextContent('First')
    expect(screen.queryByRole('button')).toBeNull()
    act(() => {
      vi.advanceTimersByTime(4000)
    })
    expect(screen.getByRole('status')).toHaveTextContent('Second')
    act(() => {
      vi.advanceTimersByTime(2100)
    })
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('stays up while the pointer is over it, then gets a fresh full time once the pointer leaves', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Saved' }))
    const status = screen.getByRole('status')
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    fireEvent.pointerEnter(status)
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(status).toHaveTextContent('Saved')
    fireEvent.pointerLeave(status)
    act(() => {
      vi.advanceTimersByTime(5900)
    })
    expect(status).toHaveTextContent('Saved')
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(status).toBeEmptyDOMElement()
  })

  it('stays up while focus is inside it, then gets a fresh full time once focus leaves', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Deleted Bandages', action: { label: 'Undo', onAction: () => {} } }))
    const status = screen.getByRole('status')
    const undo = screen.getByRole('button', { name: 'Undo' })
    act(() => {
      vi.advanceTimersByTime(5000)
    })
    act(() => undo.focus())
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(status).toHaveTextContent('Deleted Bandages')
    act(() => undo.blur())
    act(() => {
      vi.advanceTimersByTime(5900)
    })
    expect(status).toHaveTextContent('Deleted Bandages')
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(status).toBeEmptyDOMElement()
  })

  it('stays up until both the pointer and focus have left', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Deleted Bandages', action: { label: 'Undo', onAction: () => {} } }))
    const status = screen.getByRole('status')
    const undo = screen.getByRole('button', { name: 'Undo' })
    fireEvent.pointerEnter(status)
    act(() => undo.focus())
    act(() => undo.blur())
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(status).toHaveTextContent('Deleted Bandages')
    fireEvent.pointerLeave(status)
    act(() => {
      vi.advanceTimersByTime(6100)
    })
    expect(status).toBeEmptyDOMElement()
  })

  it('replaces a held message at once, and the replacement gets a fresh full time once the pointer leaves', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'First' }))
    const status = screen.getByRole('status')
    fireEvent.pointerEnter(status)
    act(() => showSnackbar({ text: 'Second' }))
    expect(status).toHaveTextContent('Second')
    act(() => {
      vi.advanceTimersByTime(60000)
    })
    expect(status).toHaveTextContent('Second')
    fireEvent.pointerLeave(status)
    act(() => {
      vi.advanceTimersByTime(5900)
    })
    expect(status).toHaveTextContent('Second')
    act(() => {
      vi.advanceTimersByTime(200)
    })
    expect(status).toBeEmptyDOMElement()
  })

  it('does not carry a hold over to the next message once Undo is pressed', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Deleted Bandages', action: { label: 'Undo', onAction: () => {} } }))
    const status = screen.getByRole('status')
    fireEvent.pointerEnter(status)
    fireEvent.click(screen.getByRole('button', { name: 'Undo' }))
    act(() => showSnackbar({ text: 'Saved' }))
    act(() => {
      vi.advanceTimersByTime(6100)
    })
    expect(status).toBeEmptyDOMElement()
  })

  it('does not carry a hold over to the next message once the held one is gone', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'First' }))
    const status = screen.getByRole('status')
    fireEvent.pointerEnter(status)
    act(() => resetSnackbar())
    act(() => showSnackbar({ text: 'Second' }))
    act(() => {
      vi.advanceTimersByTime(6100)
    })
    expect(status).toBeEmptyDOMElement()
  })

  it('lets go of focus when the focused button is replaced by a message without one', () => {
    vi.useFakeTimers()
    render(<SnackbarHost />)
    act(() => showSnackbar({ text: 'Deleted Bandages', action: { label: 'Undo', onAction: () => {} } }))
    act(() => screen.getByRole('button', { name: 'Undo' }).focus())
    act(() => showSnackbar({ text: 'Saved' }))
    expect(document.activeElement).toBe(document.body)
    act(() => {
      vi.advanceTimersByTime(6100)
    })
    expect(screen.getByRole('status')).toBeEmptyDOMElement()
  })

  it('is styled only from defined tokens', () => {
    const { used, undefinedTokens } = tokenUsage('src/ui/Snackbar.css')
    expect(used.length).toBeGreaterThan(0)
    expect(undefinedTokens).toEqual([])
  })
})

describe('Snackbar text type', () => {
  it('is set in body-medium', () => {
    expect(typeDeclarations('src/ui/Snackbar.css', '.ui-snackbar__text')).toEqual(typeRoleDeclarations('body-medium'))
  })
})
