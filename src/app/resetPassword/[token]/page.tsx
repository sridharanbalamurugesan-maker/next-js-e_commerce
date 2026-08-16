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
      <div className="flex justify-center items-center min-h-screen bg-[#f8fafc]">
        <h2 className="text-lg font-medium text-[#64748b]">
          Checking reset link...
        </h2>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f8fafc] px-4">
      <div className="w-full max-w-[800px] flex flex-col md:flex-row shadow-lg overflow-hidden">
        <div className="bg-[#6366f1] text-white p-8 md:w-[340px] flex flex-col justify-between min-h-[360px]">
          <div>
            <h2 className="text-3xl font-medium mb-4">Reset Password</h2>
            <p className="text-[#c7d2fe] text-lg leading-7">
              Set a new password for your Grabbuy account
            </p>
          </div>
          <p className="italic font-extrabold text-2xl mt-10">Grabbuy</p>
        </div>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        <Form className="flex-1 bg-white p-8 md:p-10">

          <div className="mb-4">
            <Field
              type="password"
              name="password"
              placeholder="New Password"
              className="fk-input"
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
              className="fk-input"
            />

            <ErrorMessage
              name="confirmPassword"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <button
            type="submit"
            className="fk-orange-btn w-full py-3 text-sm"
          >
            Reset Password
          </button>
        </Form>
      </Formik>
      </div>
    </div>
  );
}
