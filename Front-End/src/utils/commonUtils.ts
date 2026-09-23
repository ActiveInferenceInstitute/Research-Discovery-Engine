/**
 * Common Utility Functions
 * 
 * This module contains frequently used utility functions that provide
 * common functionality across the Discovery Engine application.
 */

/**
 * Generates a unique identifier string
 * @param prefix - Optional prefix for the ID
 * @returns Unique identifier string
 * @example
 * const id = generateId('node'); // Returns: 'node_1234567890_abc123'
 */
export const generateId = (prefix?: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  return prefix ? `${prefix}_${timestamp}_${random}` : `${timestamp}_${random}`;
};

/**
 * Debounces a function call, delaying execution until after specified delay
 * @param func - Function to debounce
 * @param delay - Delay in milliseconds
 * @returns Debounced function
 * @example
 * const debouncedSearch = debounce(handleSearch, 300);
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

/**
 * Throttles a function call, limiting execution to once per specified interval
 * @param func - Function to throttle
 * @param interval - Interval in milliseconds
 * @returns Throttled function
 * @example
 * const throttledScroll = throttle(handleScroll, 100);
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  interval: number
): ((...args: Parameters<T>) => void) => {
  let lastCall = 0;
  
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (now - lastCall >= interval) {
      lastCall = now;
      func(...args);
    }
  };
};

/**
 * Deep clones an object or array
 * @param obj - Object to clone
 * @returns Deep clone of the object
 * @example
 * const cloned = deepClone(originalObject);
 */
export const deepClone = <T>(obj: T): T => {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  
  if (obj instanceof Date) {
    return new Date(obj.getTime()) as T;
  }
  
  if (obj instanceof Array) {
    return obj.map(item => deepClone(item)) as T;
  }
  
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  
  return obj;
};

/**
 * Safely gets a nested property from an object using dot notation
 * @param obj - Object to get property from
 * @param path - Dot notation path (e.g., 'user.profile.name')
 * @param defaultValue - Default value if property doesn't exist
 * @returns Property value or default value
 * @example
 * const name = getNestedProperty(user, 'profile.name', 'Unknown');
 */
export const getNestedProperty = <T = any>(
  obj: any,
  path: string,
  defaultValue?: T
): T => {
  const keys = path.split('.');
  let current = obj;
  
  for (const key of keys) {
    if (current === null || current === undefined || !(key in current)) {
      return defaultValue as T;
    }
    current = current[key];
  }
  
  return current as T;
};

/**
 * Safely sets a nested property in an object using dot notation
 * @param obj - Object to set property in
 * @param path - Dot notation path (e.g., 'user.profile.name')
 * @param value - Value to set
 * @example
 * setNestedProperty(user, 'profile.name', 'John Doe');
 */
export const setNestedProperty = (obj: any, path: string, value: any): void => {
  const keys = path.split('.');
  const lastKey = keys.pop();
  
  if (!lastKey) return;
  
  let current = obj;
  for (const key of keys) {
    if (!(key in current) || typeof current[key] !== 'object') {
      current[key] = {};
    }
    current = current[key];
  }
  
  current[lastKey] = value;
};

/**
 * Formats a timestamp into a human-readable string
 * @param timestamp - Timestamp in milliseconds
 * @param options - Formatting options
 * @returns Formatted date string
 * @example
 * const formatted = formatTimestamp(Date.now()); // '2023-12-07 14:30:45'
 */
export const formatTimestamp = (
  timestamp: number,
  options: {
    includeTime?: boolean;
    includeSeconds?: boolean;
    locale?: string;
  } = {}
): string => {
  const {
    includeTime = true,
    includeSeconds = true,
    locale = 'en-US'
  } = options;
  
  const date = new Date(timestamp);
  
  if (!includeTime) {
    return date.toLocaleDateString(locale);
  }
  
  const timeOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    ...(includeSeconds && { second: '2-digit' })
  };
  
  return date.toLocaleString(locale, timeOptions);
};

/**
 * Truncates text to a specified length with ellipsis
 * @param text - Text to truncate
 * @param maxLength - Maximum length before truncation
 * @param suffix - Suffix to append (default: '...')
 * @returns Truncated text
 * @example
 * const short = truncateText('This is a long text', 10); // 'This is a...'
 */
export const truncateText = (
  text: string,
  maxLength: number,
  suffix = '...'
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

/**
 * Capitalizes the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 * @example
 * const capitalized = capitalize('hello world'); // 'Hello world'
 */
export const capitalize = (str: string): string => {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Converts a string to title case
 * @param str - String to convert
 * @returns Title case string
 * @example
 * const title = toTitleCase('hello world'); // 'Hello World'
 */
export const toTitleCase = (str: string): string => {
  return str.replace(/\w\S*/g, (txt) => 
    txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
  );
};

/**
 * Checks if a value is empty (null, undefined, empty string, empty array, empty object)
 * @param value - Value to check
 * @returns True if value is empty
 * @example
 * const empty = isEmpty(''); // true
 * const notEmpty = isEmpty('hello'); // false
 */
export const isEmpty = (value: any): boolean => {
  if (value === null || value === undefined) return true;
  if (typeof value === 'string') return value.trim().length === 0;
  if (Array.isArray(value)) return value.length === 0;
  if (typeof value === 'object') return Object.keys(value).length === 0;
  return false;
};

/**
 * Removes duplicate items from an array
 * @param array - Array to deduplicate
 * @param keyFn - Optional function to extract comparison key
 * @returns Array without duplicates
 * @example
 * const unique = removeDuplicates([1, 2, 2, 3]); // [1, 2, 3]
 * const uniqueObjects = removeDuplicates(objects, obj => obj.id);
 */
export const removeDuplicates = <T>(
  array: T[],
  keyFn?: (item: T) => any
): T[] => {
  if (!keyFn) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const key = keyFn(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

/**
 * Groups array items by a specified key
 * @param array - Array to group
 * @param keyFn - Function to extract grouping key
 * @returns Object with grouped items
 * @example
 * const grouped = groupBy(users, user => user.role);
 */
export const groupBy = <T, K extends string | number | symbol>(
  array: T[],
  keyFn: (item: T) => K
): Record<K, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyFn(item);
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(item);
    return groups;
  }, {} as Record<K, T[]>);
};

/**
 * Sorts an array by multiple criteria
 * @param array - Array to sort
 * @param sortCriteria - Array of sort criteria
 * @returns Sorted array
 * @example
 * const sorted = sortBy(users, [
 *   { key: 'lastName', direction: 'asc' },
 *   { key: 'firstName', direction: 'asc' }
 * ]);
 */
export const sortBy = <T>(
  array: T[],
  sortCriteria: Array<{
    key: keyof T | ((item: T) => any);
    direction: 'asc' | 'desc';
  }>
): T[] => {
  return [...array].sort((a, b) => {
    for (const criterion of sortCriteria) {
      const { key, direction } = criterion;
      
      const aValue = typeof key === 'function' ? key(a) : a[key];
      const bValue = typeof key === 'function' ? key(b) : b[key];
      
      if (aValue < bValue) return direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Creates a download link for data
 * @param data - Data to download
 * @param filename - Name of the file
 * @param mimeType - MIME type of the file
 * @example
 * downloadData(JSON.stringify(data), 'data.json', 'application/json');
 */
export const downloadData = (
  data: string,
  filename: string,
  mimeType = 'text/plain'
): void => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  window.URL.revokeObjectURL(url);
};

/**
 * Validates an email address
 * @param email - Email to validate
 * @returns True if email is valid
 * @example
 * const valid = isValidEmail('user@example.com'); // true
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generates a random color in hexadecimal format
 * @returns Random hex color
 * @example
 * const color = getRandomColor(); // '#a3b5c7'
 */
export const getRandomColor = (): string => {
  return '#' + Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0');
};

/**
 * Converts bytes to human-readable format
 * @param bytes - Number of bytes
 * @param decimals - Number of decimal places
 * @returns Formatted string
 * @example
 * const size = formatBytes(1024); // '1 KB'
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}; 