
const numericTester = /^[1-9][0-9]*$/;
/**
 * Test if the function parameter starts with digit `[1-9]` followed by any number of `[0-9]` digits
 * @param  value the string to test
 */
export const isNumeric = (value: string): boolean => {
    return numericTester.test(value);
}

/**
 * Generate a random token in the `"rndPart|millis|baseValue"` format, where `rndPart` is a random number [0,100000], 
 * `millis` the current time in milliseconds and `baseValue` a user-provided value.
 * @param baseValue value to append to the randomly generated string
 */
export const randomToken = (baseValue?: string): string => `${Math.round(Math.random() * 100000)}|${Date.now()}|${baseValue ?? ""}`;