"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { resetPassword, validateToken } from "../../(main)/utils/resetPasswordApi";
import { failureLoader, successLoader } from "../../(main)/utils/utils";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

interface ResetPasswordForm {
  password: string;
  confirmPassword: string;
}

export default function ResetPassword() {
  const { token } = useParams();
  const router = useRouter();
  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const response = await validateToken(token);

    if (!response.success) {
      failureLoader(response.message);

      setTimeout(() => {
        router.push("/login");
      }, 1500);

      return;
    }

    setIsValid(true);
  };

  const initialValues: ResetPasswordForm = {
    password: "",
    confirmPassword: "",
  };

  const validationSchema = Yup.object({
    password: Yup.string()
      .min(4, "Password must be at least 4 characters")
      .max(15, "Password must not exceed 15 characters")
      .required("Password is required"),

    confirmPassword: Yup.string()
      .oneOf(
        [Yup.ref("password")],
        "Passwords do not match"
      )
      .required("Confirm Password is required"),
  });

  const handleSubmit = async (
    values: ResetPasswordForm,
    { resetForm }: any
  ) => {
    const response = await resetPassword(
      token,
      values.password
    );

    if (response?.success) {
      successLoader("Password reset successfully");

      resetForm();

      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      failureLoader(response.message);
    }
  };

  if (!isValid) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <h2 className="text-lg font-semibold">
          Checking reset link...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="w-full max-w-md bg-white p-8 rounded-xl shadow-lg">
          <h2 className="text-2xl font-bold text-center mb-6">
            Reset Password
          </h2>

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

          <div className="mb-6">
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
            Reset Password
          </button>
        </Form>
      </Formik>
    </div>
  );
}