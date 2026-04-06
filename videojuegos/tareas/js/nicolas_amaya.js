/*
 * Functions to determine the next day after a given date
 *
 * Nicolas Amaya
 * 2026-04-06
 */

/**  @type function(string) */
export function firstNonRepeating(str) {
  if (!str) return;
  const cache = {};
  for (const char of str.split("")) {
    if (cache[char]) {
      cache[char] = cache[char] + 1;
      continue;
    }
    cache[char] = 1;
  }
  for (const [char, count] of Object.entries(cache)) {
    if (count === 1) return char;
  }
}
/** @type function(number[]) */
export function bubbleSort(arr) {
  if (!arr || arr.length <= 1) return arr;
  for (let i = 0; i < arr.length; i++) {
    for (let j = 0; j < arr.length - i - 1; j++) {
      if (arr[j + 1] < arr[j]) {
        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
      }
    }
  }
  return arr;
}
/** @type function(number[]) */
export function invertArray(arr) {
  if (!arr || arr.length <= 1) return [...arr];
  const revertArr = [];
  for (let i = arr.length - 1; i >= 0; i--) {
    revertArr.push(arr[i]);
  }
  return revertArr;
}
/** @type function(number[]) */
export function invertArrayInplace(arr) {
  if (!arr || arr.length <= 1) return arr;
  let left = 0,
    right = arr.length - 1;
  while (left < right) {
    [arr[left], arr[right]] = [arr[right], arr[left]];
    (left++, right--);
  }
  return arr;
}
/** @type function(string) */
export function capitalize(str) {
  return str
    ? str
        .split(" ")
        .map((v) => (v[0] ? v[0].toUpperCase() : " ") + v.slice(1))
        .join(" ")
    : "";
}
export function mcd(a, b) {
  while (b) {
    [a, b] = [b, a % b];
  }
  return a;
}
/** @type function(string) */
export function hackerSpeak(word) {
  const special_char = {
    a: "4",
    e: "3",
    i: "1",
    o: "0",
    s: "5",
  };
  let result = "";
  for (const char of word.toLowerCase()) {
    result += special_char[char] ?? word[result.length];
  }
  return result;
}
/** @param {number} num */
export function factorize(num) {
  if (num === 0) return [];
  const result = [1];
  for (let i = 2; i <= num; i++) {
    if (num % i === 0) result.push(i);
  }
  return result;
}
/** @param {number[]} arr */
export function deduplicate(arr) {
  // easy way
  return Array.from(new Set(arr));
  // O(n^2)
  return arr.reduce(
    (arr, item) => (arr.includes(item) ? arr : [...arr, item]),
    [],
  );
}

/** @param {string[]} arr */
export function findShortestString(arr) {
  if (!arr || arr.length === 0) return 0;
  return arr.reduce(
    (curr, str) => (str.length < curr ? str.length : curr),
    Infinity,
  );
}

/**
 * @param {string} str
 * @returns {boolean}
 */
export function isPalindrome(str) {
  // sliding window
  if (!str) return true;
  let left = 0,
    right = str.length - 1;
  while (left < right) {
    if (str[left] !== str[right]) return false;
    (left++, right--);
  }
  return true;
  // easy way
  return str === str.split("").toReversed().join("");
}
/** @param {string[]} arr*/
export function sortStrings(arr) {
  if (arr.length <= 1) return arr;
  const pivot = arr[0];
  const left = [],
    right = [];
  arr
    .slice(1)
    .forEach((v) =>
      v.localeCompare(pivot) < 0 ? left.push(v) : right.push(v),
    );
  return [...sortStrings(left), pivot, ...sortStrings(right)];
}

/** @param {number[]} nums */
export function stats(nums) {
  if (!nums || nums.length <= 0) return [0, 0];
  const promedio = nums.reduce((prev, curr) => (prev += curr), 0) / nums.length;
  const frecuencias = nums.reduce((obj, current) => {
    obj[current] = (obj[current] ?? 0) + 1;
    return obj;
  }, {});
  const moda = Object.entries(frecuencias).reduce(
    (curr, [key, val]) => {
      if (curr.val < val) return { key, val };
      return curr;
    },
    {
      key: -Infinity,
      val: 0,
    },
  );
  return [promedio, Number(moda.key)];
}
/** @param {string[]} strs */
export function popularString(strs) {
  if (!strs || strs.length <= 0) return "";
  const frecuencias = strs.reduce((obj, current) => {
    obj[current] = (obj[current] ?? 0) + 1;
    return obj;
  }, {});
  const moda = Object.entries(frecuencias).reduce(
    (curr, [key, val]) => {
      if (curr.val < val) return { key, val };
      return curr;
    },
    {
      key: -Infinity,
      val: 0,
    },
  );
  return moda.key;
}
/** @param {number} num */
export function isPowerOf2(num) {
  if (num === 1) return true;
  while (num % 2 === 0) {
    if (num === 2) return true;
    num /= 2;
  }
  return false;
}
/**@param {number[]} nums*/
export function sortDescending(nums) {
  if (nums.length <= 1) return nums;
  const pivot = nums[0];
  const big = [],
    small = [];
  nums.slice(1).forEach((v) => (pivot > v ? small.push(v) : big.push(v)));
  return [...sortDescending(big), pivot, ...sortDescending(small)];
}
