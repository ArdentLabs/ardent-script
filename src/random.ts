/**
 * Simple wrapper around Math.random that can be mocked during jest testing.
 * Avoid mocking globals. Mock this module instead.
 * https://github.com/babel/babel/issues/5426#issuecomment-284839994
 */

export const random = (): number => Math.random()

/** Only exists so that the mock module can implement this for consistency during tests */
export const reset = (): void => {
  // noop
}
