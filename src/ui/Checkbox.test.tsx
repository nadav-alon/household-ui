import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/preact'
import { Checkbox } from './Checkbox.tsx'
import { declaration, mediaBlock, outsideMediaBlock, read, tokenUsage, typeDeclarations, typeRoleDeclarations } from '../testing/css.ts'

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

describe('Checkbox state layer and hit area', () => {
  const layer = '.ui-checkbox__layer'
  const onSurface8 = 'color-mix(in srgb, var(--md-sys-color-on-surface) 8%, transparent)'
  const primary8 = 'color-mix(in srgb, var(--md-sys-color-primary) 8%, transparent)'

  it('has a 2.5rem round layer that is clear until hovered or focused', () => {
    expect(declaration(stylesheet, layer, 'width')).toBe('2.5rem')
    expect(declaration(stylesheet, layer, 'height')).toBe('2.5rem')
    expect(declaration(stylesheet, layer, 'border-radius')).toBe('var(--md-sys-shape-corner-full)')
    expect(read(stylesheet)).toMatch(/^\.ui-checkbox__layer {[^}]*background: transparent;/m)
  })

  it('shows on-surface at 8% on focus-visible, primary when checked', () => {
    const focused = '.ui-checkbox__input:focus-visible ~ .ui-checkbox__layer'
    expect(declaration(stylesheet, focused, 'background')).toBe(onSurface8)
    expect(declaration(stylesheet, '.ui-checkbox__input:checked:focus-visible ~ .ui-checkbox__layer', 'background')).toBe(primary8)
  })

  it('shows on hover only inside (hover: hover)', () => {
    expect(outsideMediaBlock(stylesheet, '(hover: hover)')).not.toMatch(/:hover/)
    const hover = mediaBlock(stylesheet, '(hover: hover)')
    expect(hover).toContain(`.ui-checkbox__input:hover ~ .ui-checkbox__layer {\n    background: ${onSurface8};`)
    expect(hover).toContain(`.ui-checkbox__input:checked:hover ~ .ui-checkbox__layer {\n    background: ${primary8};`)
  })

  it('makes the native input a hit area of at least 3rem', () => {
    expect(declaration(stylesheet, '.ui-checkbox__control', 'width')).toBe('3rem')
    expect(declaration(stylesheet, '.ui-checkbox__control', 'height')).toBe('3rem')
    expect(declaration(stylesheet, '.ui-checkbox__input', 'inset')).toBe('0')
    expect(declaration(stylesheet, '.ui-checkbox__input', 'width')).toBe('100%')
    expect(declaration(stylesheet, '.ui-checkbox__input', 'height')).toBe('100%')
  })
})

describe('Checkbox label', () => {
  it('toggles the box when the label is tapped', () => {
    render(<Checkbox label="Sort by aisle" />)
    const box = screen.getByRole('checkbox', { name: 'Sort by aisle' })

    fireEvent.click(screen.getByText('Sort by aisle'))

    expect(box).toBeChecked()
  })

  it('is a row at least 3rem tall, with its text in body-large', () => {
    expect(declaration(stylesheet, '.ui-checkbox', 'min-height')).toBe('3rem')
    expect(declaration(stylesheet, '.ui-checkbox', 'box-sizing')).toBe('border-box')
    expect(typeDeclarations(stylesheet, '.ui-checkbox__label')).toEqual(typeRoleDeclarations('body-large'))
  })

  it('renders no label element without a label, so it can sit inside one', () => {
    const { container } = render(<Checkbox aria-label="Assumed" />)
    expect(container.querySelector('label')).toBeNull()
  })
})
