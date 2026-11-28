import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { CentredCard } from './CentredCard.tsx'
import { declaration, read, tokenUsage } from '../testing/css.ts'

describe('CentredCard', () => {
  it('shows the app name, the screen heading and its content, with no navigation', () => {
    render(
      <CentredCard appName="Recipes" title="Sign in">
        <p>Hello</p>
      </CentredCard>,
    )
    expect(screen.getByText('Recipes')).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 1, name: 'Sign in' })).toBeInTheDocument()
    expect(screen.getByText('Hello')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
  })

  it('is a single centred column with a width cap and no width breakpoints', () => {
    const css = read('src/ui/CentredCard.css')
    expect(css).toMatch(/flex-direction:\s*column/)
    expect(css).toMatch(/align-items:\s*center/)
    expect(css).toMatch(/max-width:/)
    expect(css).not.toMatch(/@media/)
  })

  it('is a filled card: surface-container-highest at level 0 with on-surface text', () => {
    const surface = (property: string) => declaration('src/ui/CentredCard.css', '.ui-centred-card__surface', property)
    expect(surface('background')).toBe('var(--md-sys-color-surface-container-highest)')
    expect(surface('box-shadow')).toBe('var(--md-sys-elevation-level0)')
    expect(surface('color')).toBe('var(--md-sys-color-on-surface)')
  })

  it('is styled only from defined tokens, which cover light and dark', () => {
    const { used, undefinedTokens } = tokenUsage('src/ui/CentredCard.css')
    expect(used.length).toBeGreaterThan(0)
    expect(undefinedTokens).toEqual([])
  })
})
