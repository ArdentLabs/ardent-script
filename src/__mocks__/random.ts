let values = [0.3, 0.1, 0.4, 0.1, 0.5, 0.9, 0.2, 0.6]

export const random = (): number => values.shift() as number

export const reset = (): void => {
  values = [0.3, 0.1, 0.4, 0.1, 0.5, 0.9, 0.2, 0.6]
}
