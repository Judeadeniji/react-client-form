import React, { ReactNode, createContext, useContext, useRef } from "react";
import type { Resolve, AvailableMethods } from "./utils";
import { submitForm } from "./utils";

interface Props {
  action: Resolve;
  method: AvailableMethods;
  _key: any;
  className: string;
  children: ReactNode;
  type?: string;
  onSubmit?: Function;
}

export const FormContext = createContext(null)

export function useFormProvider() {
  return FormContext.Provider
}

export function formState(fields: object) {
  return fields;
}


export function Form({ action, method, children, _key, className, type, onSubmit, ...rest }: Props): JSX.Element {
  return (
    <form {...{ className, key: _key, ...rest }} onSubmit={(ev: any): void => {
      ev.preventDefault();
      onSubmit && onSubmit(ev);
      submitForm(ev.target, method, action, type);
    }}>
      {children}
    </form>
  )
}