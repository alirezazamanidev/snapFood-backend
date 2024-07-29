export function isBoolean(value: any) {
  return ['true', false, 'false', true].includes(value);
}

export function toBoolean(value: any) {
  return [true, 'true'].includes(value)
    ? true
    : ['false', false].includes(value)
      ? false
      : value;
}
