let values = [0.3, 0.1, 0.4, 0.1, 0.5, 0.9, 0.2, 0.6]

export const random = jest.fn((): number => {
  const value = values.shift() as number
  values.push(value)
  return value
})

export const reset = (): void => {
  values = [0.3, 0.1, 0.4, 0.1, 0.5, 0.9, 0.2, 0.6]
  random.mockClear()
}
