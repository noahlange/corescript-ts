/**
 * This is not a class, but contains some methods that will be added to the
 * standard Javascript objects.
 *
 * This should be deprecated ASAP. - NL
 */

declare interface Number {
  clamp(min: number, b: number): number;
  mod(n: number): number;
  padZero(n: number): string;
}

declare interface String {
  padZero(n: number): string;
  format(...args: any[]): string;
  contains(n: string): boolean;
}

declare interface Array<T> {
  contains(n: T): boolean;
  equals(n: T[]): boolean;
  clone(): T[];
}

interface Math {
  randomInt(number: number): number;
}

/**
 * Returns a number whose value is limited to the given range.
 *
 * @method Number.prototype.clamp
 * @param {Number} min The lower boundary
 * @param {Number} max The upper boundary
 * @return {Number} A number in the range (min, max)
 */
Number.prototype.clamp = function(min, max) {
  return Math.min(Math.max(this, min), max);
};

/**
 * Returns a modulo value which is always positive.
 *
 * @method Number.prototype.mod
 * @param {Number} n The divisor
 * @return {Number} A modulo value
 */
Number.prototype.mod = function(n: number): number {
  return (this % n + n) % n;
};

/**
 * Replaces %1, %2 and so on in the string to the arguments.
 *
 * @method String.prototype.format
 * @param {Any} ...args The objects to format
 * @return {String} A formatted string
 */
String.prototype.format = function(): string {
  return this.replace(/%([0-9]+)/g, (s: any, n: string) => {
    return arguments[Number(n) - 1];
  });
};

/**
 * Makes a number string with leading zeros.
 *
 * @method String.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
String.prototype.padZero = function(length: number): string {
  while (s.length < length) {
    this.s = '0' + this.s;
  }
  return this.s;
};

/**
 * Makes a number string with leading zeros.
 *
 * @method Number.prototype.padZero
 * @param {Number} length The length of the output string
 * @return {String} A string with leading zeros
 */
Number.prototype.padZero = function(length: number): string {
  return String(this).padZero(length);
};

Object.defineProperties(Array.prototype, {
  /**
   * Checks whether the two arrays are same.
   */
  equals: {
    enumerable: false,
    value(
      /** The array to compare to */
      array: any[]
    ) {
      if (!array || this.length !== array.length) {
        return false;
      }
      for (let i = 0; i < this.length; i++) {
        if (this[i] instanceof Array && array[i] instanceof Array) {
          if (!this[i].equals(array[i])) {
            return false;
          }
        } else if (this[i] !== array[i]) {
          return false;
        }
      }
      return true;
    }
  },
  /**
   * Makes a shallow copy of the array.
   */
  clone: {
    enumerable: false,
    value() {
      return this.slice(0);
    }
  },
  /**
   * Checks whether the array contains a given element.
   */
  contains: {
    enumerable: false,
    value(
      /** The element to search for */
      element: any
    ) {
      return this.indexOf(element) >= 0;
    }
  }
});

/**
 * Checks whether the string contains a given string.
 */
String.prototype.contains = (
  /** The string to search for */
  str: string
): boolean => {
  return this.indexOf(str) >= 0;
};

/**
 * Generates a random integer in the range (0, max - 1).
 */
Math.randomInt = (
  /** The upper boundary (excluded) */
  max: number
): number => {
  return Math.floor(max * Math.random());
};
