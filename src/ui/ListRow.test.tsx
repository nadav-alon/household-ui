import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/preact'
import { ListRow } from './ListRow.tsx'
import { Checkbox } from './Checkbox.tsx'
import { compactViewportQuery } from './breakpoints.ts'
import { declaration, mediaBlock, outsideMediaBlock, read, tokenUsage, typeDeclarations, typeRoleDeclarations } from '../testing/css.ts'

const stylesheet = 'src/ui/ListRow.css'
const narrowBlock = () => mediaBlock(stylesheet, compactViewportQuery)
const outsideNarrowBlock = () => outsideMediaBlock(stylesheet, compactViewportQuery)
const hoverBlock = () => mediaBlock(stylesheet, '(hover: hover)')
const outsideHoverBlock = () => outsideMediaBlock(stylesheet, '(hover: hover)')
const hoverStateLayerDeclaration = 'background: color-mix\\(in srgb, var\\(--md-sys-color-on-surface\\) 8%, transparent\\)'

describe('ListRow', () => {
  it('renders a native list item with headline and supporting text', () => {
    render(
      <ul>
        <ListRow headline="Milk" supporting="Grocery" />
      </ul>,
    )
    const row = screen.getByRole('listitem')
    expect(row).toHaveTextContent('Milk')
    expect(row).toHaveTextContent('Grocery')
  })

  it('marks a muted row for a visual set-back', () => {
    render(
      <ul>
        <ListRow headline="Milk" muted />
        <ListRow headline="Eggs" />
      </ul>,
    )
    const [milk, eggs] = screen.getAllByRole('listitem')
    expect(milk).toHaveClass('ui-list-row--muted')
    expect(eggs).not.toHaveClass('ui-list-row--muted')
  })

  it('omits supporting text and trailing slot when not given', () => {
    const { container } = render(
      <ul>
        <ListRow headline="Milk" />
      </ul>,
    )
    expect(container.querySelector('.ui-list-row__supporting')).toBeNull()
    expect(container.querySelector('.ui-list-row__trailing')).toBeNull()
  })

  it('renders the trailing slot after the text', () => {
    render(
      <ul>
        <ListRow headline="Milk" trailing={<button type="button">Out</button>} />
      </ul>,
    )
    expect(screen.getByRole('listitem')).toContainElement(screen.getByRole('button', { name: 'Out' }))
  })

  it('makes the whole row the label of its control', () => {
    render(
      <ul>
        <ListRow headline="Milk" supporting="running low" control={<input type="checkbox" />} />
      </ul>,
    )
    expect(screen.getByRole('checkbox', { name: /Milk\s*running low/ })).toBeInTheDocument()
    expect(screen.getByText('Milk').closest('label')).toContainElement(screen.getByRole('checkbox'))
  })

  it('calls onActivate when the text is tapped, and not when the trailing control is', () => {
    const onActivate = vi.fn()
    render(
      <ul>
        <ListRow headline="Milk" supporting="Grocery" onActivate={onActivate} trailing={<button type="button">Out</button>} />
      </ul>,
    )
    fireEvent.click(screen.getByRole('button', { name: 'Out' }))
    expect(onActivate).not.toHaveBeenCalled()
    fireEvent.click(screen.getByRole('button', { name: 'Milk Grocery' }))
    expect(onActivate).toHaveBeenCalledOnce()
  })

  it('has no button for the text without onActivate', () => {
    render(
      <ul>
        <ListRow headline="Milk" />
      </ul>,
    )
    expect(screen.queryByRole('button')).toBeNull()
  })

  it('stacks the trailing slot under the text below 600px when asked to', () => {
    render(
      <ul>
        <ListRow headline="Milk" stackTrailing trailing={<button type="button">Out</button>} />
      </ul>,
    )
    expect(screen.getByRole('listitem')).toHaveClass('ui-list-row--stack-trailing')
    expect(narrowBlock()).toMatch(/\.ui-list-row--stack-trailing\s*{[^}]*flex-wrap: wrap/)
    expect(narrowBlock()).toMatch(/\.ui-list-row--stack-trailing \.ui-list-row__text\s*{[^}]*flex-basis: 100%/)
    expect(outsideNarrowBlock()).not.toMatch(/stack-trailing/)
  })

  it('leaves a stacked row\'s segmented options at their own height', () => {
    expect(read('src/ui/ListRow.css')).not.toMatch(/ui-segmented__option/)
  })

  it('highlights a Settings row link on hover with an 8% on-surface state layer', () => {
    expect(hoverBlock()).toMatch(new RegExp(`\\.ui-list-row__link:hover[^{]*{[^}]*${hoverStateLayerDeclaration}`))
  })

  it('highlights the label of a row with a control on hover', () => {
    expect(hoverBlock()).toMatch(new RegExp(`\\.ui-list-row__label:hover[^{]*{[^}]*${hoverStateLayerDeclaration}`))
  })

  it('highlights only the clickable text area of an activatable row on hover', () => {
    expect(hoverBlock()).toMatch(new RegExp(`\\.ui-list-row__activate:hover[^{]*{[^}]*${hoverStateLayerDeclaration}`))
  })

  it('stretches the activatable text over the row\'s full height', () => {
    const rule = read(stylesheet).match(/\.ui-list-row__activate\s*{([^}]*)}/)?.[1] ?? ''
    expect(rule).toMatch(/align-self: stretch/)
    expect(rule).toMatch(/justify-content: center/)
    expect(rule).toMatch(/margin: calc\(-1 \* var\(--md-sys-spacing-2\)\) 0/)
    expect(rule).toMatch(/padding: var\(--md-sys-spacing-2\) 0/)
  })

  describe('height', () => {
    // The label and the link share one rule; it is matched whole, so the order of the two-line rule does not change the result.
    const sharedBoxRule = /\.ui-list-row__label,\s*\.ui-list-row__link\s*{[^}]*min-height: 3\.5rem[^}]*}/

    it('is 3.5rem for one line in every kind of row, with padding inside the box', () => {
      expect(declaration(stylesheet, '.ui-list-row', 'min-height')).toBe('3.5rem')
      expect(declaration(stylesheet, '.ui-list-row', 'box-sizing')).toBe('border-box')
      expect(read(stylesheet).match(sharedBoxRule)?.[0]).toMatch(/box-sizing: border-box/)
      expect(declaration(stylesheet, '.ui-list-row__activate', 'box-sizing')).toBe('border-box')
    })

    it('is 4.5rem for a row with supporting text', () => {
      render(
        <ul>
          <ListRow headline="Milk" supporting="Grocery" />
          <ListRow headline="Eggs" />
          <ListRow headline="Bread" supporting="Bakery" href="/bread" onFollow={() => {}} />
          <ListRow headline="Rice" supporting="Pantry" control={<input type="checkbox" />} />
          <ListRow headline="Tea" supporting="Drinks" onActivate={() => {}} />
        </ul>,
      )
      const [milk, eggs, ...twoLine] = screen.getAllByRole('listitem')
      expect(milk).toHaveClass('ui-list-row--two-line')
      expect(eggs).not.toHaveClass('ui-list-row--two-line')
      for (const row of twoLine) expect(row).toHaveClass('ui-list-row--two-line')
      expect(read(stylesheet)).toMatch(
        /\.ui-list-row\.ui-list-row--two-line,\s*\.ui-list-row--two-line \.ui-list-row__label,\s*\.ui-list-row--two-line \.ui-list-row__link\s*{[^}]*min-height: 4\.5rem/,
      )
    })
  })

  it('paints nothing of its own, so it takes its container\'s colour', () => {
    expect(declaration(stylesheet, '.ui-list-row', 'background')).toBe('transparent')
  })

  it('sets a muted headline in on-surface-variant, never italic', () => {
    const selector = '.ui-list-row--muted .ui-list-row__headline'
    expect(declaration(stylesheet, selector, 'color')).toBe('var(--md-sys-color-on-surface-variant)')
    expect(declaration(stylesheet, selector, 'font-style')).toBeUndefined()
    expect(read(stylesheet)).not.toMatch(/italic/)
  })

  it('renders an SVG placed directly in the trailing slot 1.5rem square, as a block', () => {
    const svg = '.ui-list-row__trailing > svg'
    expect(declaration(stylesheet, svg, 'display')).toBe('block')
    expect(declaration(stylesheet, svg, 'width')).toBe('1.5rem')
    expect(declaration(stylesheet, svg, 'height')).toBe('1.5rem')
  })

  it('centres the trailing slot vertically in every kind of row', () => {
    expect(declaration(stylesheet, '.ui-list-row', 'align-items')).toBe('center')
    expect(declaration(stylesheet, '.ui-list-row__link', 'align-items')).toBe('center')
  })

  it('applies no hover highlight outside the hover-capable media query, nor to a plain row', () => {
    expect(outsideHoverBlock()).not.toMatch(/:hover/)
    const hovered = [...hoverBlock().matchAll(/([^{}]+){/g)].flatMap((m) => m[1].split(',').map((selector) => selector.trim()))
    expect(hovered.toSorted()).toEqual(['.ui-list-row__activate:hover', '.ui-list-row__label:hover', '.ui-list-row__link:hover'])
  })

  it('is styled only from defined tokens', () => {
    const { used, undefinedTokens } = tokenUsage('src/ui/ListRow.css')
    expect(used.length).toBeGreaterThan(0)
    expect(undefinedTokens).toEqual([])
  })

  it('leaves checkbox styling to Checkbox', () => {
    expect(read(stylesheet)).not.toMatch(/checkbox/)
    expect(declaration(stylesheet, '.ui-list-row__link', 'min-height')).toBe('3.5rem')
  })

  it('toggles a Checkbox given as its control from a tap anywhere on the row', () => {
    render(
      <ul>
        <ListRow headline="Milk" supporting="running low" control={<Checkbox />} />
      </ul>,
    )
    const box = screen.getByRole('checkbox', { name: /Milk\s*running low/ })

    fireEvent.click(screen.getByText('running low'))
    expect(box).toBeChecked()

    fireEvent.click(screen.getByText('Milk'))
    expect(box).not.toBeChecked()
  })
})

describe('ListRow headline type', () => {
  it('is set in body-large', () => {
    expect(typeDeclarations('src/ui/ListRow.css', '.ui-list-row__headline')).toEqual(typeRoleDeclarations('body-large'))
  })
})

describe('ListRow supporting type', () => {
  it('is set in body-medium', () => {
    expect(typeDeclarations('src/ui/ListRow.css', '.ui-list-row__supporting')).toEqual(typeRoleDeclarations('body-medium'))
  })
})
