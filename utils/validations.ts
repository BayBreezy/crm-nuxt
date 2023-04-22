import { object, string } from "yup";

export const AuthSchema = object({
  email: string().email("Invalid email").required("Email is required"),
  password: string()
    .required("Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export const ContactSchema = object({
  firstName: string().required("First name is required"),
  lastName: string().required("Last name is required"),
  email: string().email("Invalid email").required("Email is required"),
  phone: string().nullable(),
  company: string().nullable(),
  position: string().nullable(),
  address: string().nullable(),
  department: string().nullable(),
});

export const NoteSchema = object({
  content: string()
    .required("Note content is required")
    .min(6, "Note must be at least 6 characters"),
});
