import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/preact'
import { Checkbox } from './Checkbox.tsx'
import { declaration, tokenUsage } from '../testing/css.ts'

describe('Checkbox', () => {
  it('is a native checkbox named by its label', () => {
    render(<Checkbox label="Sort by aisle" />)
    expect(screen.getByRole('checkbox', { name: 'Sort by aisle' })).toBeInTheDocument()
  })

  it('is named by its aria-label when it has no label', () => {
    render(<Checkbox aria-label="Assumed" />)
    expect(screen.getByRole('checkbox', { name: 'Assumed' })).toBeInTheDocument()
  })

  it('toggles and reports the change through onChange', () => {
    const onChange = vi.fn()
    render(<Checkbox aria-label="Assumed" onChange={onChange} />)
    const box = screen.getByRole('checkbox', { name: 'Assumed' })

    fireEvent.click(box)

    expect(box).toBeChecked()
    expect(onChange).toHaveBeenCalledOnce()
  })

  it('passes checked and other input props through', () => {
    render(<Checkbox aria-label="Assumed" checked disabled name="assumed" />)
    const box = screen.getByRole('checkbox', { name: 'Assumed' })
    expect(box).toBeChecked()
    expect(box).toBeDisabled()
    expect(box).toHaveAttribute('name', 'assumed')
  })
})

const stylesheet = 'src/ui/Checkbox.css'
const box = '.ui-checkbox__box'
const checkedBox = '.ui-checkbox__input:checked ~ .ui-checkbox__box'

describe('Checkbox box', () => {
  it('is 1.125rem with an on-surface-variant border while unselected', () => {
    expect(declaration(stylesheet, box, 'width')).toBe('1.125rem')
    expect(declaration(stylesheet, box, 'height')).toBe('1.125rem')
    expect(declaration(stylesheet, box, 'border')).toBe('2px solid var(--md-sys-color-on-surface-variant)')
  })

  it('is a primary fill with an on-primary check once selected', () => {
    expect(declaration(stylesheet, checkedBox, 'background')).toBe('var(--md-sys-color-primary)')
    expect(declaration(stylesheet, checkedBox, 'border-color')).toBe('var(--md-sys-color-primary)')
    expect(declaration(stylesheet, `${checkedBox}::after`, 'border')).toMatch(/var\(--md-sys-color-on-primary\)/)
  })

  it('is styled only from defined tokens', () => {
    const { used, undefinedTokens } = tokenUsage(stylesheet)
    expect(used.length).toBeGreaterThan(0)
    expect(undefinedTokens).toEqual([])
  })
})
