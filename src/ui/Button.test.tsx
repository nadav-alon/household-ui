import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/preact'
import { Button } from './Button.tsx'
import { declaration, mediaBlock, outsideMediaBlock, read, repoRoot, tokenUsage, typeDeclarations, typeRoleDeclarations } from '../testing/css.ts'

const TEXT_DESTRUCTIVE = '.ui-button--text:is(.ui-button--destructive, .ui-dialog-actions__destructive *)'
const HIT_AREA = '.ui-button::after'
const HIT_AREA_DECLARATIONS = {
  content: "''",
  position: 'absolute',
  top: '50%',
  left: '50%',
  width: 'max(100%, 3rem)',
  height: 'max(100%, 3rem)',
  transform: 'translate(-50%, -50%)',
}
const escapeRegExp = (text: string) => text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

describe('Button', () => {
  it('renders a native button that does not submit by default', () => {
    render(<Button>Save</Button>)
    const button = screen.getByRole('button', { name: 'Save' })
    expect(button.tagName).toBe('BUTTON')
    expect(button).toHaveAttribute('type', 'button')
  })

  it('is filled unless told otherwise, and offers tonal and text', () => {
    const { rerender } = render(<Button>Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('ui-button', 'ui-button--filled')
    rerender(<Button variant="tonal">Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('ui-button--tonal')
    rerender(<Button variant="text">Save</Button>)
    expect(screen.getByRole('button')).toHaveClass('ui-button--text')
  })

  it('colours a destructive text Button from the error token, including on hover', () => {
    render(
      <Button variant="text" destructive>
        Delete
      </Button>,
    )
    expect(screen.getByRole('button')).toHaveClass('ui-button--text', 'ui-button--destructive')
    expect(declaration('src/ui/Button.css', TEXT_DESTRUCTIVE, 'color')).toBe('var(--md-sys-color-error)')
    expect(mediaBlock('src/ui/Button.css', '(hover: hover)')).toMatch(
      new RegExp(`${escapeRegExp(TEXT_DESTRUCTIVE)}:hover:not\\(:disabled\\)\\s*{[^}]*var\\(--md-sys-color-error\\)`),
    )
  })

  it('applies the destructive tone only to the text variant, never to filled or tonal', () => {
    const css = readFileSync('src/ui/Button.css', 'utf8')
    const selectors = [...css.matchAll(/([^{}]+){/g)].map((match) => match[1].trim())
    const destructive = selectors.filter((selector) => selector.includes('.ui-button--destructive'))
    expect(destructive.length).toBeGreaterThan(0)
    for (const selector of destructive) expect(selector).toContain(TEXT_DESTRUCTIVE)
  })

  it('keeps native click and disabled behaviour', () => {
    const onClick = vi.fn()
    const { rerender } = render(<Button onClick={onClick}>Save</Button>)
    fireEvent.click(screen.getByRole('button'))
    expect(onClick).toHaveBeenCalledOnce()
    rerender(<Button disabled onClick={onClick}>Save</Button>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('highlights only an enabled text Button on hover, and only where hover exists', () => {
    expect(mediaBlock('src/ui/Button.css', '(hover: hover)')).toMatch(
      /\.ui-button--text:hover:not\(:disabled\)\s*{[^}]*background: color-mix\(in srgb, var\(--md-sys-color-primary\) 8%, transparent\)/,
    )
    expect(outsideMediaBlock('src/ui/Button.css', '(hover: hover)')).not.toMatch(/:hover/)
  })

  it('is styled only from defined tokens', () => {
    const { used, undefinedTokens } = tokenUsage('src/ui/Button.css')
    expect(used.length).toBeGreaterThan(0)
    expect(undefinedTokens).toEqual([])
  })
})

describe('Button touch target', () => {
  it('keeps the container at 2.5rem tall', () => {
    expect(declaration('src/ui/Button.css', '.ui-button', 'min-height')).toBe('2.5rem')
  })

  it('extends the hit area to at least 3rem each way, centred on the container', () => {
    expect(declaration('src/ui/Button.css', '.ui-button', 'position')).toBe('relative')
    for (const [property, value] of Object.entries(HIT_AREA_DECLARATIONS)) {
      expect(declaration('src/ui/Button.css', HIT_AREA, property), property).toBe(value)
    }
  })

  it('paints nothing and takes no space: the hit area holds exactly its declarations', () => {
    const body = read('src/ui/Button.css').match(new RegExp(`${escapeRegExp(HIT_AREA)}\\s*{([^}]*)}`))?.[1] ?? ''
    const properties = [...body.matchAll(/(?:^|[;\s])([a-z-]+)\s*:/g)].map((m) => m[1])
    expect(properties.sort()).toEqual(Object.keys(HIT_AREA_DECLARATIONS).sort())
  })

  it('has no rule in any stylesheet under src reaching another ::after on a button', () => {
    const stylesheets = readdirSync(join(repoRoot, 'src'), { recursive: true, encoding: 'utf8' }).filter((path) => path.endsWith('.css'))
    for (const stylesheet of stylesheets) {
      const selectors = [...read(`src/${stylesheet}`).matchAll(/([^{}]*)\{/g)].map((m) => m[1]!.trim())
      const reaching = selectors.filter((selector) => /\.ui-button\b[^,]*::?after/.test(selector))
      expect(reaching, stylesheet).toEqual(stylesheet === 'ui/Button.css' ? [HIT_AREA] : [])
    }
  })
})

describe('Button label type', () => {
  it('is set in label-large', () => {
    expect(typeDeclarations('src/ui/Button.css', '.ui-button')).toEqual(typeRoleDeclarations('label-large'))
  })
})
