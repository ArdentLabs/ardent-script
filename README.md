# ArdentScript

## Overview

`ArdentScript` is a simple problem generator system, designed to be simple but versatile.

For some quick examples of what this is capable of, check out `src/__tests__/interpolation.ts`.

## Concepts

### Variables

A variable is a "template" for generating a value.

Please check the typescript typings in `src/generator.ts` for the most up-to-date information on how variables should be structured and what kind of variable definitions are available.

As of 2020-09-14, the following variables types are available:

- `RANDOMINT`: A random integer in the specified `range`.
  Optionally, specify whether minimum/maximum values are included using `inclusive`.

- `RANDOMFLOAT`: A random floating point number in [`min`, `max`). If `numDigits` is specified, the result will be rounded to that many digits after the decimal point.

  - It is generally recommended to set such a value as to avoid floating point rounding issues.

- `EVALUATE`: Evaluate `expression` using the other variables.
  - This variable must come **after** all the variables it depends on.

- `SHUFFLEJOIN`: Given a list of `operands`, shuffle them, instantiate them using the existing variables, and then join the operands together using the specified `operator`.
  - Note that `operator` and `operand` do not have to be valid operators and operands. The string processing works regardless.

A variable may optionally specify a `name` to improve readability. By default, numbers are named using their order - the first variable would be named `1`, the second would be named `2`, and so on.

### Templates and Substitutions

A `template` is exactly what it sounds like - a template for generating something.

To specify part of the template that would be replaced by the value of a variable, use curly braces `{}`.

For example, `'{x} + 1'`, with `x = '12'`, would be instantiated to `'12 + 1'`.

Any string is applicable. Using the example above, if `x = '3 + 8'`, the resulting string would be `'3 + 8 + 1'`. If `x = 'foobar'`, the resulting string would be `'foobar + 1'`.

To insert an actual curly brace into the text, use double-curly braces `{{` and `}}`.

### Evaluation

Internally, `ArdentScript` uses `mathjs` to evaluate and simplify expressions.

The overall flow of instantiating a problem is

1. The variables are instantiated into concrete values.
2. The question and solution templates are instantiated using the values generated from step 1.
3. Depending on the solution type, `mathjs` operates on the solution expression from step 2.

Go to https://mathjs.org/ and use the demo panel to examine what kinds of expressions and functions are usable by `mathjs`.

Some common expressions are:

- `pi`, `e` - constants
- `sqrt()` - square root
- `abs()` - absolute value
- `sin()`, `cos()`, etc. - common trig operators (in radians)
- `atan2()` - two-argument atan

## Remarks

At its core, `ArdentScript` is mostly a string processing library. Although the results often have meanings attached to them, ultimately, use those results however you want!
