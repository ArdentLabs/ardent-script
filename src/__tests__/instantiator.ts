import { instantiate } from '../instantiator'
import { reset } from '../random'

jest.mock('../random')

describe('problem instantiator', () => {
  beforeEach(reset)

  it('can generate simple arithmetic problems', () => {
    expect(
      instantiate({
        variables: [
          { name: 'a', type: 'RANDOMINT', min: 5, max: 12 },
          { name: 'b', type: 'RANDOMINT', min: 2, max: 24 },
        ],
        questionTemplate: '{a} + {b}',
        solutionType: 'EVALUATE',
        solutionTemplate: '{a} + {b}',
      })
    ).toEqual({
      variables: {
        a: '7',
        b: '4',
      },
      questionText: '7 + 4',
      solutionExpression: '7 + 4',
      solutionValue: 11,
    })

    const fpProblem = instantiate({
      variables: [
        { type: 'RANDOMFLOAT', min: -5, max: 0 },
        { type: 'RANDOMFLOAT', min: 3, max: 11, numDigits: 1 },
      ],
      questionTemplate: '{1} * {2}',
      solutionType: 'EVALUATE',
      solutionTemplate: '{1} * {2}',
    })

    expect(fpProblem).toMatchObject({
      variables: {
        '1': '-3',
        '2': '3.8',
      },
      questionText: '-3 * 3.8',
      solutionExpression: '-3 * 3.8',
    })
    expect(fpProblem.solutionValue).toBeCloseTo(-11.4)
  })

  it('can generate worded questions', () => {
    expect(
      instantiate({
        variables: [
          { name: 'apples', type: 'RANDOMINT', min: 3, max: 11 },
          { name: 'unitcost', type: 'RANDOMINT', min: 4, max: 7 },
          {
            name: 'totalcost',
            type: 'EVALUATE',
            expression: '{apples} * {unitcost}',
          },
        ],
        questionTemplate:
          'Apples cost ${unitcost} each. If Jack spent ${totalcost} on apples, how many did he buy?',
        solutionType: 'EVALUATE',
        solutionTemplate: '{apples}',
      })
    ).toEqual({
      variables: {
        apples: '5',
        unitcost: '4',
        totalcost: '20',
      },
      questionText:
        'Apples cost $4 each. If Jack spent $20 on apples, how many did he buy?',
      solutionExpression: '5',
      solutionValue: 5,
    })
  })

  it('can concatnate values to achieve specific patterns', () => {
    expect(
      instantiate({
        variables: [
          { name: 'ones', type: 'RANDOMINT', min: 5, max: 10 },
          { name: 'tens', type: 'RANDOMINT', min: 3, max: 16 },
          { name: 'add', type: 'RANDOMINT', min: 7, max: 10 },
        ],
        questionTemplate: '{tens}{ones} + {add}',
        solutionType: 'EVALUATE',
        solutionTemplate: '{tens}{ones} + {add}',
      })
    ).toEqual({
      variables: {
        ones: '6',
        tens: '4',
        add: '8',
      },
      questionText: '46 + 8',
      solutionExpression: '46 + 8',
      solutionValue: 54,
    })
  })

  it('can simplify expressions', () => {
    expect(
      instantiate({
        variables: [
          { name: 'first', type: 'RANDOMINT', min: 3, max: 14 },
          { name: 'second', type: 'RANDOMINT', min: 3, max: 14 },
        ],
        questionTemplate: '{first} * x + {second} * x',
        solutionType: 'SIMPLIFY',
        solutionTemplate: '{first} * x + {second} * x',
      })
    ).toEqual({
      variables: {
        first: '6',
        second: '4',
      },
      questionText: '6 * x + 4 * x',
      solutionExpression: '6 * x + 4 * x',
      solutionValue: '10 * x',
    })
  })
})
