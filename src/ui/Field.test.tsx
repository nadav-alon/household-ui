import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/preact'
import { declaration } from '../testing/css.ts'
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

  it('is outlined at rest, primary when focused and error when invalid', () => {
    expect(declaration(css, '.ui-field__control', 'border')).toBe('1px solid var(--md-sys-color-outline)')
    expect(declaration(css, '.ui-field__control:focus', 'border-color')).toBe('var(--md-sys-color-primary)')
    expect(declaration(css, ".ui-field__control[aria-invalid='true']", 'border-color')).toBe('var(--md-sys-color-error)')
  })
})
