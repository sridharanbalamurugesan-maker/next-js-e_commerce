"use client";

import { useRouter } from "next/navigation";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { logedinUserResetPassword } from "../utils/resetPasswordApi";
import { failureLoader, successLoader } from "../utils/utils";

interface ResetPassword {
  oldPassword: string;
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const router = useRouter();

  const initialValues: ResetPassword = {
    oldPassword: "",
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string()
      .min(4, "Old password must be at least 4 characters")
      .max(15, "Old password must not exceed 15 characters")
      .required("Enter old password"),

    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(15, "Password must not exceed 15 characters")
      .notOneOf(
      [Yup.ref("oldPassword")],
     "New password must be different from old password"
      )
      .required("Enter new password"),

    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password")],
        "Passwords do not match"
      )
      .required("Confirm password is required"),
  });

  const handleSubmit = async (values: ResetPassword,{ resetForm }:any) => {
    const response = await logedinUserResetPassword(values);

    if (response?.success) {
      successLoader(response.message);
      resetForm();
    } else {
      failureLoader(response?.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Change Password
          </h2>

          <div className="mb-4">
            <Field
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
            <ErrorMessage
              name="oldPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="mb-4">
            <Field
              type="password"
              name="password"
              placeholder="New Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
            <ErrorMessage
              name="password"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="mb-4">
            <Field
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              className="w-full border border-gray-300 rounded-lg px-4 py-3"
            />
            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary w-full"
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={() => router.push("/home")}
            className="btn btn-outline w-full mt-3"
          >
            Home
          </button>
        </Form>
      </Formik>
    </div>
  );
}