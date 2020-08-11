/**
 * Responsible for generating concrete values from template variables.
 */

import { evaluate } from 'mathjs'
import { interpolate } from './interpolation'

export type VariableTemplate = {
  name?: string
} & (
  | {
      type: 'RANDOMINT'
      min: number
      max: number
    }
  | {
      type: 'RANDOMFLOAT'
      min: number
      max: number
      numDigits?: number
    }
  | {
      type: 'EVALUATE'
      expression: string
      variables: VariableTemplate[]
    }
)

const generateValue = (template: VariableTemplate): string => {
  switch (template.type) {
    case 'RANDOMFLOAT': {
      const value = template.min + Math.random() * (template.max - template.min)
      if (template.numDigits != null) {
        return value.toFixed(template.numDigits)
      } else {
        return value.toString()
      }
    }
    case 'RANDOMINT': {
      return `${
        template.min + Math.floor(Math.random() * (template.max - template.min))
      }`
    }
    case 'EVALUATE': {
      const expression = interpolate(
        template.expression,
        generateVariables(template.variables)
      )
      return `${evaluate(expression)}`
    }
  }
}

export const generateVariables = (
  templates: VariableTemplate[]
): Record<string, string> => {
  const values: Record<string, string> = {}

  for (let i = 0; i < templates.length; i++) {
    const template = templates[i]
    const name = template.name ?? `${i + 1}`

    if (name in values) {
      throw new Error(`Duplicate variable "${name}"`)
    }

    values[name] = generateValue(template)
  }

  return values
}
