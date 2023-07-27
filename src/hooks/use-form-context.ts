import React, { useContext } from "react"
import { FormContext } from "../form"

export const useFormData = () => {
  const context = useContext(FormContext);
  if (!context) {
    // throw new Error("useFormContext must be used within a FormProvider");
  }
  return context;
};