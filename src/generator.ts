/**
 * Responsible for generating concrete values from template variables.
 */

type VariableTemplate = {
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
    }
  | {
      type: 'VARIABLE'
      symbol: string
    }
)

const generateValue = (template: VariableTemplate): string => {
  switch (template.type) {
    case 'RANDOMFLOAT':
      return `${template.min + Math.random() * (template.max - template.min)}`
    case 'RANDOMINT':
      return `${
        template.min + Math.floor(Math.random() * (template.max - template.min))
      }`
    case 'VARIABLE':
      return template.symbol
  }
}

export const generateValues = (
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
