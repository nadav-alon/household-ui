import { afterEach, describe, expect, it } from 'vitest'
import { cleanup, render, screen } from '@testing-library/preact'
import { read, tokenUsage } from '../testing/css.ts'
import { AlertBanner } from './AlertBanner.tsx'

afterEach(cleanup)

describe('AlertBanner', () => {
  it('renders its message in an alert', () => {
    render(<AlertBanner message="2 urgent Items" />)
    expect(screen.getByRole('alert')).toHaveTextContent('2 urgent Items')
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('is styled only from defined colour-role tokens, with no hard-coded colour', () => {
    const { used, undefinedTokens } = tokenUsage('src/ui/AlertBanner.css')
    expect(read('src/ui/AlertBanner.css')).not.toMatch(/#[0-9a-f]{3,8}\b|rgb|hsl/i)
    expect(used).toEqual(
      expect.arrayContaining(['--md-sys-color-error-container', '--md-sys-color-on-error-container']),
    )
    expect(undefinedTokens).toEqual([])
  })
})
