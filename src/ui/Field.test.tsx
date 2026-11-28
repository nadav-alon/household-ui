import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { declaration, read, typeDeclarations, typeRoleDeclarations } from '../testing/css.ts'
import { TextField } from './TextField.tsx'
import { Select } from './Select.tsx'
import { TextArea } from './TextArea.tsx'

const css = 'src/ui/Field.css'

describe('Field control', () => {
  it('is an outlined 56dp container, transparent, with 4dp corners', () => {
    expect(declaration(css, '.ui-field__control', 'min-height')).toBe('3.5rem')
    expect(declaration(css, '.ui-field__control', 'background')).toBe('transparent')
    expect(declaration(css, '.ui-field__control', 'border-radius')).toBe('var(--md-sys-shape-corner-extra-small)')
  })

  it('leaves the outline to the frame, whose border is outline at rest, primary when focused and error when invalid', () => {
    expect(declaration(css, '.ui-field__outline', 'border')).toBe('1px solid var(--md-sys-color-outline)')
    expect(declaration(css, '.ui-field__control:focus ~ .ui-field__outline', 'border-color')).toBe('var(--md-sys-color-primary)')
    expect(declaration(css, ".ui-field__control[aria-invalid='true'] ~ .ui-field__outline", 'border-color')).toBe('var(--md-sys-color-error)')
  })
})

describe.each([
  ['TextField', () => <TextField label="Name" />],
  ['TextArea', () => <TextArea label="Name" />],
  ['Select', () => <Select label="Name"><option>a</option></Select>],
])('%s floating label', (_name, ui) => {
  it('sits inside the container after its control, still naming it', () => {
    const { container } = render(ui())
    const control = screen.getByLabelText('Name')
    const label = container.querySelector('label')!
    expect(label.parentElement).toBe(control.parentElement)
    expect(control.nextElementSibling).toBe(label)
    expect(control).toHaveAccessibleName('Name')
  })

  it('has a hidden outline notch that adds no text of its own', () => {
    const { container } = render(ui())
    expect(container.querySelector('.ui-field__outline')).toHaveAttribute('aria-hidden', 'true')
    expect(screen.getAllByText('Name')).toHaveLength(1)
  })
})

describe('Field label', () => {
  it('rests in body-large and floats into the outline in body-small when focused or populated', () => {
    // `declaration` matches the selector as a suffix too and takes the last rule, so read the resting rule by its start of line.
    const rest = read(css).match(/^\.ui-field__label {([^}]*)}/m)![1]!
    const restType = Object.fromEntries(Object.keys(typeRoleDeclarations('body-large')).map((property) => [property, rest.match(new RegExp(`^\\s*${property}:\\s*([^;]+);`, 'm'))?.[1]]))
    expect(restType).toEqual(typeRoleDeclarations('body-large'))
    const floated = '.ui-field__control:is(:focus, :not(:placeholder-shown)) ~ .ui-field__label'
    expect(declaration(css, floated, 'top')).toBe('0')
    expect(typeDeclarations(css, floated)).toEqual(typeRoleDeclarations('body-small'))
  })

  it('has a placeholder to detect an empty control by, which stays hidden until focus', () => {
    render(<TextField label="Name" />)
    expect(screen.getByLabelText('Name')).toHaveAttribute('placeholder', ' ')
    expect(declaration(css, '.ui-field__control:not(:focus)::placeholder', 'color')).toBe('transparent')
  })

  it('sets the notch to the same type as the floated label, so the gap fits it', () => {
    expect(typeDeclarations(css, '.ui-field__notch')).toEqual(typeRoleDeclarations('body-small'))
  })

  it.each([
    ['TextField', <TextField label="Name" placeholder="" />],
    ['TextArea', <TextArea label="Name" placeholder="" />],
    ['TextField', <TextField label="Name" />],
    ['TextArea', <TextArea label="Name" />],
  ])('%s with no or an empty placeholder still has one, so :placeholder-shown tracks emptiness', (_name, ui) => {
    render(ui)
    expect(screen.getByLabelText('Name')).toHaveAttribute('placeholder', ' ')
  })

  it('keeps a caller placeholder', () => {
    render(<TextField label="Name" placeholder="e.g. Milk" />)
    expect(screen.getByLabelText('Name')).toHaveAttribute('placeholder', 'e.g. Milk')
  })
})
