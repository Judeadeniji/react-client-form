import { useReducer } from 'react';

export type ValidatorFn = (value: string) => string | undefined;

interface ValidationErrors {
  [key: string]: string | undefined;
}

interface Validators {
  [key: string]: ValidatorFn[];
}

interface FieldState {
  value: string;
  touched: boolean;
  error: string | undefined;
}

interface FormState {
  fields: {
    [key: string]: FieldState;
  };
  validators: Validators;
  pristine: boolean;
}

type FormAction =
  | { type: 'SET_VALUE'; field: string; value: string }
  | { type: 'SET_TOUCHED'; field: string }
  | { type: 'SET_ERROR'; field: string; error: string | undefined }
  | { type: 'RESET_FORM'; initialState: ValidationErrors };

function formReducer(state: FormState, action: FormAction): FormState {
  switch (action.type) {
    case 'SET_VALUE':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            value: action.value,
          },
        },
        pristine: false,
      };
    case 'SET_TOUCHED':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            touched: true,
          },
        },
      };
    case 'SET_ERROR':
      return {
        ...state,
        fields: {
          ...state.fields,
          [action.field]: {
            ...state.fields[action.field],
            error: action.error,
          },
        },
      };
    case 'RESET_FORM':
      const resetFields: { [key: string]: FieldState } = {};
      for (const field in action.initialState) {
        resetFields[field] = {
          value: action.initialState[field] || '',
          touched: false,
          error: undefined,
        };
      }
      return {
        fields: resetFields,
        validators: state.validators,// never reset the validators
        pristine: true,
      };
    default:
      return state;
  }
}

export function useValidator(initialState: ValidationErrors, _validators: Validators) {
  const [formState, dispatch] = useReducer(formReducer, {
    fields: Object.keys(initialState).reduce((acc, field) => {
      acc[field] = {
        value: initialState[field] || '',
        touched: false,
        error: undefined,
      };
      return acc;
    }, {} as { [key: string]: FieldState }),
    validators: _validators,
    pristine: true,
  });

  const validateField = (fieldName: string) => {
    const fieldValidators = formState.validators[fieldName];
    const errors: string[] = [];

    if (fieldValidators && fieldValidators.length) {
      for (const validatorFn of fieldValidators) {
        const error = validatorFn(formState.fields[fieldName] || {});
        if (error) {
          errors.push(error);
          break; // Stop validation on the first error found
        }
      }
    }

    dispatch({ type: 'SET_ERROR', field: fieldName, error: errors.length ? errors[0] : undefined });
  };

  const handleInputChange = (fieldName: string, value: string) => {
    dispatch({ type: 'SET_VALUE', field: fieldName, value });
    dispatch({ type: 'SET_TOUCHED', field: fieldName });
    validateField(fieldName);
  };

  const getFieldState = (fieldName: string) => {
    return formState.fields[fieldName];
  };

  const getErrorMessage = (fieldName: string) => {
    return formState.fields[fieldName].error;
  };

  const isFieldTouched = (fieldName: string) => {
    return formState.fields[fieldName]?.touched;
  };

  const isFieldValid = (fieldName: string) => {
    return !formState.fields[fieldName]?.error;
  };

  const isFormValid = () => {
    return Object.values(formState.fields).every((field: FieldState) => !field.error);
  };

  const addValidator = (fieldName: string, validator: ValidatorFn) => {
    if (!formState.validators[fieldName]) {
      formState.validators[fieldName] = [];
    }
    formState.validators[fieldName].push(validator);
    validateField(fieldName);
  };

  const resetForm = () => {
    dispatch({ type: 'RESET_FORM', initialState });
  };

  return {
    formState: formState.fields,
    handleInputChange,
    getErrorMessage,
    addValidator,
    fieldState: (fieldName) => ({
      state: getFieldState(fieldName),
      value: getFieldState(fieldName)?.value || '',
      valid: isFieldValid(fieldName),
      touched: isFieldTouched(fieldName),
    }),
    isFormValid,
    resetForm,
  };
}
