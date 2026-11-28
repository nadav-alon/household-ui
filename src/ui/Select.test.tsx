import { describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/preact'
import { Select } from './Select.tsx'
import { declaration } from '../testing/css.ts'
import { TextField } from './TextField.tsx'

describe('Select', () => {
  it('renders a native select labelled by its label, with native options', () => {
    render(
      <Select label="Shop">
        <option value="pharmacy">Pharmacy</option>
        <option value="grocery">Grocery</option>
      </Select>,
    )
    const select = screen.getByLabelText('Shop')
    expect(select.tagName).toBe('SELECT')
    expect(screen.getAllByRole('option')).toHaveLength(2)
  })

  it('shows an error as an alert that describes the select and marks it invalid', () => {
    render(
      <Select label="Shop" error="Choose a Shop.">
        <option value="pharmacy">Pharmacy</option>
      </Select>,
    )
    const select = screen.getByLabelText('Shop')
    expect(select).toBeInvalid()
    expect(select).toHaveAccessibleDescription('Choose a Shop.')
    expect(screen.getByRole('alert')).toHaveTextContent('Choose a Shop.')
  })

  it('passes native attributes and change events through', () => {
    let seen = ''
    render(
      <Select label="Shop" required onChange={(e) => (seen = e.currentTarget.value)}>
        <option value="pharmacy">Pharmacy</option>
        <option value="grocery">Grocery</option>
      </Select>,
    )
    const select = screen.getByLabelText('Shop')
    expect(select).toBeRequired()
    fireEvent.change(select, { target: { value: 'grocery' } })
    expect(seen).toBe('grocery')
  })
})

describe('Select arrow', () => {
  it('shows a decorative trailing dropdown icon that ignores pointer events, in place of the native arrow', () => {
    const { container } = render(
      <Select label="Shop">
        <option value="pharmacy">Pharmacy</option>
      </Select>,
    )
    const icon = container.querySelector('.ui-field__trailing-icon')!
    expect(icon.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
    expect(declaration('src/ui/Field.css', '.ui-field__trailing-icon', 'pointer-events')).toBe('none')
    expect(declaration('src/ui/Field.css', '.ui-field__trailing-icon', 'color')).toBe('var(--md-sys-color-on-surface-variant)')
    expect(declaration('src/ui/Field.css', '.ui-field__trailing-icon', 'width')).toBe('1.5rem')
    expect(declaration('src/ui/Field.css', 'select.ui-field__control', 'appearance')).toBe('none')
  })

  it('has no icon on a text field', () => {
    const { container } = render(<TextField label="Name" />)
    expect(container.querySelector('.ui-field__trailing-icon')).toBeNull()
  })
})
