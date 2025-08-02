// Global utility functions for converting between camelCase and snake_case

export const toCamelCase = (str: string): string => {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
};

export const toSnakeCase = (str: string): string => {
  return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
};

export const convertKeysToCamelCase = <T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const converted: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    const camelKey = toCamelCase(key);
    const value = obj[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      converted[camelKey] = convertKeysToCamelCase(
        value as Record<string, unknown>,
      );
    } else {
      converted[camelKey] = value;
    }
  });

  return converted;
};

export const convertKeysToSnakeCase = <T extends Record<string, unknown>>(
  obj: T,
): Record<string, unknown> => {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    return obj;
  }

  const converted: Record<string, unknown> = {};

  Object.keys(obj).forEach((key) => {
    const snakeKey = toSnakeCase(key);
    const value = obj[key];

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      converted[snakeKey] = convertKeysToSnakeCase(
        value as Record<string, unknown>,
      );
    } else {
      converted[snakeKey] = value;
    }
  });

  return converted;
};
