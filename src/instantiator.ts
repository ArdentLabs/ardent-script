/**
 * Responsible for instantiating the overall problem, including the variables, the template strings, and the solution.
 */

import { evaluate, simplify } from 'mathjs'
import { VariableTemplate, generateVariables } from './generator'
import { interpolate } from './interpolation'

interface ProblemTemplateBase {
  variables: VariableTemplate[]
  questionTemplate: string
}

export type ProblemTemplate = ProblemTemplateBase &
  (
    | {
        solutionType: 'EVALUATE'
        solutionTemplate: string
      }
    | {
        solutionType: 'SIMPLIFY'
        solutionTemplate: string
      }
  )

export interface ProblemInstance {
  /** The instantiated variables */
  variables: Record<string, string>
  /** The generated question text */
  questionText: string
  /** The expression that is used to evaluate the solution */
  solutionExpression: string
  /** The solution */
  solutionValue: string | number
}

const getSolution = (
  template: ProblemTemplate,
  variables: Record<string, string>
): Pick<ProblemInstance, 'solutionExpression' | 'solutionValue'> => {
  switch (template.solutionType) {
    case 'EVALUATE': {
      const solutionExpression = interpolate(
        template.solutionTemplate,
        variables
      )
      return {
        solutionExpression,
        solutionValue: evaluate(solutionExpression),
      }
    }
    case 'SIMPLIFY': {
      const solutionExpression = interpolate(
        template.solutionTemplate,
        variables
      )
      return {
        solutionExpression,
        solutionValue: simplify(solutionExpression).toString(),
      }
    }
  }
}

export const instantiate = (template: ProblemTemplate): ProblemInstance => {
  const variables = generateVariables(template.variables)

  const questionText = interpolate(template.questionTemplate, variables)

  const solutionData = getSolution(template, variables)

  return {
    variables,
    questionText,
    ...solutionData,
  }
}
