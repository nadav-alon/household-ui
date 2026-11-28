import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/preact'
import { SegmentedButton } from './SegmentedButton.tsx'
import { declaration, tokenUsage, typeDeclarations, typeRoleDeclarations } from '../testing/css.ts'

const options = [
  { value: 'enough', label: 'Enough' },
  { value: 'low', label: 'Running low' },
  { value: 'out', label: 'Out' },
]

describe('SegmentedButton', () => {
  it('renders a native button per option inside a named group', () => {
    render(<SegmentedButton label="State" options={options} value="low" onChange={() => {}} />)
    expect(screen.getByRole('group', { name: 'State' })).toBeInTheDocument()
    const buttons = screen.getAllByRole('button')
    expect(buttons.map((b) => b.tagName)).toEqual(['BUTTON', 'BUTTON', 'BUTTON'])
    expect(buttons.every((b) => b.getAttribute('type') === 'button')).toBe(true)
  })

  it('exposes aria-pressed on every option, true only for the selected one', () => {
    render(<SegmentedButton label="State" options={options} value="low" onChange={() => {}} />)
    expect(screen.getByRole('button', { name: 'Enough' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByRole('button', { name: 'Running low' })).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByRole('button', { name: 'Out' })).toHaveAttribute('aria-pressed', 'false')
  })

  it('reports the clicked option', () => {
    const onChange = vi.fn()
    render(<SegmentedButton label="State" options={options} value="low" onChange={onChange} />)
    fireEvent.click(screen.getByRole('button', { name: 'Out' }))
    expect(onChange).toHaveBeenCalledWith('out')
  })

  it('is styled only from defined tokens', () => {
    const { used, undefinedTokens } = tokenUsage('src/ui/SegmentedButton.css')
    expect(used.length).toBeGreaterThan(0)
    expect(undefinedTokens).toEqual([])
  })
})

describe('SegmentedButton label type', () => {
  it('is set in label-large', () => {
    expect(typeDeclarations('src/ui/SegmentedButton.css', '.ui-segmented__option')).toEqual(typeRoleDeclarations('label-large'))
  })
})

describe('SegmentedButton size', () => {
  const stylesheet = 'src/ui/SegmentedButton.css'
  const option = '.ui-segmented__option'

  it('is a 2.5rem container', () => {
    expect(declaration(stylesheet, option, 'min-height')).toBe('2.5rem')
  })

  it('extends the hit area to at least 3rem tall, centred, without changing layout', () => {
    const hitArea = `${option}::after`
    expect(declaration(stylesheet, option, 'position')).toBe('relative')
    expect(declaration(stylesheet, hitArea, 'content')).toBe("''")
    expect(declaration(stylesheet, hitArea, 'position')).toBe('absolute')
    expect(declaration(stylesheet, hitArea, 'top')).toBe('50%')
    expect(declaration(stylesheet, hitArea, 'left')).toBe('0')
    expect(declaration(stylesheet, hitArea, 'width')).toBe('100%')
    expect(declaration(stylesheet, hitArea, 'height')).toBe('max(100%, 3rem)')
    expect(declaration(stylesheet, hitArea, 'transform')).toBe('translateY(-50%)')
  })
})

describe('SegmentedButton check icon', () => {
  it('shows a hidden leading check on the selected segment only', () => {
    render(<SegmentedButton label="State" options={options} value="low" onChange={() => {}} />)
    const selected = screen.getByRole('button', { name: 'Running low', pressed: true })
    const icon = selected.querySelector('svg')
    expect(icon).toHaveAttribute('aria-hidden', 'true')
    expect(icon).toHaveAttribute('width', '1.125rem')
    expect(icon).toHaveAttribute('height', '1.125rem')
    expect(selected.firstElementChild).toBe(icon)
    expect(screen.getByRole('button', { name: 'Enough' }).querySelector('svg')).toBeNull()
    expect(screen.getByRole('button', { name: 'Out' }).querySelector('svg')).toBeNull()
  })

  it('centres the icon beside the label with a 8dp gap', () => {
    const option = '.ui-segmented__option'
    expect(declaration('src/ui/SegmentedButton.css', option, 'display')).toBe('inline-flex')
    expect(declaration('src/ui/SegmentedButton.css', option, 'align-items')).toBe('center')
    expect(declaration('src/ui/SegmentedButton.css', option, 'justify-content')).toBe('center')
    expect(declaration('src/ui/SegmentedButton.css', option, 'gap')).toBe('var(--md-sys-spacing-2)')
  })
})
