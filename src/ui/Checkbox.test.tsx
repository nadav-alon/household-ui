import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/preact'
import { Checkbox } from './Checkbox.tsx'

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
