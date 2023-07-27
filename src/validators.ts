import type { ValidatorFn } from "./hooks/use-validator"

export const isRequired: ValidatorFn = () => (field) => (!field.touched ? 'This field is required' : undefined);

export const minLength = (minLength: number): ValidatorFn => (field) => field.value.length < minLength ? `Must be at least ${minLength} characters long` : undefined;

export const maxLength = (maxLength: number): ValidatorFn => ({ value }) =>
  value.length > maxLength ? `Must be at most ${maxLength} characters long` : undefined;

export const isEmail: ValidatorFn = () => ({ value }) =>
  !/^\S+@\S+\.\S+$/.test(value) ? 'Invalid email format' : undefined;

export const isNumber: ValidatorFn = ({ value }) => (isNaN(Number(value)) ? 'Must be a number' : undefined);

export const inRange = (min: number, max: number): ValidatorFn => ({ value }) => {
  const numValue = Number(value);
  return isNaN(numValue) || numValue < min || numValue > max
    ? `Must be a number between ${min} and ${max}`
    : undefined;
};
