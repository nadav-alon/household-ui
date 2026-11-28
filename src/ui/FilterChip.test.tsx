import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/preact'
import { FilterChip } from './FilterChip.tsx'
import { declaration, tokenUsage, typeDeclarations, typeRoleDeclarations } from '../testing/css.ts'

const stylesheet = 'src/ui/FilterChip.css'

describe('FilterChip', () => {
  it('is a button pressed only while selected', () => {
    const { rerender } = render(<FilterChip label="Pharmacy" selected={false} onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Pharmacy', pressed: false })).toBeInTheDocument()

    rerender(<FilterChip label="Pharmacy" selected onToggle={() => {}} />)
    expect(screen.getByRole('button', { name: 'Pharmacy', pressed: true })).toBeInTheDocument()
  })

  it('calls onToggle when pressed', () => {
    const onToggle = vi.fn()
    render(<FilterChip label="Pharmacy" selected={false} onToggle={onToggle} />)

    fireEvent.click(screen.getByRole('button', { name: 'Pharmacy' }))

    expect(onToggle).toHaveBeenCalledOnce()
  })

  it('is styled only from defined tokens', () => {
    const { used, undefinedTokens } = tokenUsage(stylesheet)
    expect(used.length).toBeGreaterThan(0)
    expect(undefinedTokens).toEqual([])
  })
})

describe('FilterChip label type', () => {
  it('is set in label-large', () => {
    expect(typeDeclarations(stylesheet, '.ui-filter-chip')).toEqual(typeRoleDeclarations('label-large'))
  })
})


  it('is a 2rem container with the small corner', () => {
    expect(declaration(stylesheet, '.ui-filter-chip', 'box-sizing')).toBe('border-box')
    expect(declaration(stylesheet, '.ui-filter-chip', 'height')).toBe('2rem')
    expect(declaration(stylesheet, '.ui-filter-chip', 'min-height')).toBeUndefined()
    expect(declaration(stylesheet, '.ui-filter-chip', 'border-radius')).toBe('var(--md-sys-shape-corner-small)')
  })

  it('extends the hit area to at least 3rem tall, centred, without changing layout', () => {
    const hitArea = '.ui-filter-chip::after'
    expect(declaration(stylesheet, '.ui-filter-chip', 'position')).toBe('relative')
    expect(declaration(stylesheet, hitArea, 'content')).toBe("''")
    expect(declaration(stylesheet, hitArea, 'position')).toBe('absolute')
    expect(declaration(stylesheet, hitArea, 'top')).toBe('50%')
    expect(declaration(stylesheet, hitArea, 'left')).toBe('0')
    expect(declaration(stylesheet, hitArea, 'width')).toBe('100%')
    expect(declaration(stylesheet, hitArea, 'height')).toBe('max(100%, 3rem)')
    expect(declaration(stylesheet, hitArea, 'transform')).toBe('translateY(-50%)')
  })
})

describe('FilterChip check icon', () => {
  it('shows a hidden leading check only while selected', () => {
    const { container, rerender } = render(<FilterChip label="Pharmacy" selected={false} onToggle={() => {}} />)
    expect(container.querySelector('svg')).toBeNull()

    rerender(<FilterChip label="Pharmacy" selected onToggle={() => {}} />)
    const button = screen.getByRole('button', { name: 'Pharmacy', pressed: true })
    const icon = button.querySelector('svg')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveAttribute('width', '1.125rem')
    expect(icon).toHaveAttribute('height', '1.125rem')
    expect(button.firstElementChild).toBe(icon)
  })
  it('pads 8dp before the icon, 16dp without it, 16dp trailing', () => {

    expect(declaration(stylesheet, '.ui-filter-chip', 'padding-inline')).toBe('var(--md-sys-spacing-4)')
    expect(declaration(stylesheet, ".ui-filter-chip[aria-pressed='true']", 'padding-inline-start')).toBe('var(--md-sys-spacing-2)')
    expect(declaration(stylesheet, ".ui-filter-chip[aria-pressed='true']", 'padding-inline-end')).toBeUndefined()
    expect(declaration(stylesheet, ".ui-filter-chip[aria-pressed='true']", 'padding-inline')).toBeUndefined()
    expect(declaration(stylesheet, ".ui-filter-chip[aria-pressed='true']", 'gap')).toBe('var(--md-sys-spacing-2)')
  })
})
