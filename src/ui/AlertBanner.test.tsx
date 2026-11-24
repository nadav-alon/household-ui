import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen } from '@testing-library/preact'
import { read, tokenUsage } from '../testing/css.ts'
import { AlertBanner } from './AlertBanner.tsx'

afterEach(cleanup)

describe('AlertBanner', () => {
  it('renders its message in an alert', () => {
    render(<AlertBanner message="2 urgent Items" />)
    expect(screen.getByRole('alert')).toHaveTextContent('2 urgent Items')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('runs its action when the action button is pressed', () => {
    const onAction = vi.fn()
    render(<AlertBanner message="2 urgent Items" action={{ label: 'Review', onAction }} />)
    fireEvent.click(screen.getByRole('button', { name: 'Review' }))
    expect(onAction).toHaveBeenCalledOnce()
  })

  it('renders a link action as a native anchor with its href, inside the alert', () => {
    render(<AlertBanner message="Save held" action={{ label: 'Back to the editor', href: '/recipes/1/edit' }} />)
    const link = screen.getByRole('link', { name: 'Back to the editor' })
    expect(link.tagName).toBe('A')
    expect(link).toHaveAttribute('href', '/recipes/1/edit')
    expect(link).toHaveClass('ui-button', 'ui-button--text')
    expect(screen.getByRole('alert')).toContainElement(link)
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('shows a dismiss button only when given onDismiss, and calls it when pressed', () => {
    const onDismiss = vi.fn()
    const { rerender } = render(<AlertBanner message="2 urgent Items" />)
    expect(screen.queryByRole('button', { name: 'Dismiss' })).toBeNull()
    rerender(<AlertBanner message="2 urgent Items" onDismiss={onDismiss} />)
    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(onDismiss).toHaveBeenCalledOnce()
  })

  it('is urgent by default and takes the advisory look on request, announced as an alert either way', () => {
    const { rerender } = render(<AlertBanner message="1 urgent Item" />)
    expect(screen.getByRole('alert')).toHaveClass('ui-alert-banner--urgent')
    rerender(<AlertBanner message="1 Item to buy soon" tone="advisory" />)
    expect(screen.getByRole('alert')).toHaveClass('ui-alert-banner--advisory')
  })

  it('is styled only from defined colour-role tokens, with no hard-coded colour', () => {
    const { used, undefinedTokens } = tokenUsage('src/ui/AlertBanner.css')
    expect(read('src/ui/AlertBanner.css')).not.toMatch(/#[0-9a-f]{3,8}\b|rgba?\(|hsla?\(/i)
    expect(used).toEqual(
      expect.arrayContaining([
        '--md-sys-color-error-container',
        '--md-sys-color-on-error-container',
        '--md-sys-color-secondary-container',
        '--md-sys-color-on-secondary-container',
      ]),
    )
    expect(undefinedTokens).toEqual([])
  })
})
