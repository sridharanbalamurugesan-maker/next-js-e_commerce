"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";

import { login } from "../(main)/utils/AuthApi";
import {
  failureLoader,
  setLoginData,
  successLoader,
} from "../(main)/utils/utils";

interface LoginFormValues {
  email: string;
  password: string;
}
const Login = () => {

  const router = useRouter();

  const initialValues: LoginFormValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string().email("Invalid email").required("Enter the email"),
    password: Yup.string().required("Enter the password"),
  });

  const handleSubmit = async (values: LoginFormValues) => {

    try {
      const response = await login(values);
      console.log("login response", response);
      localStorage.setItem("token", response.token);
     if (response.success === true) {
        successLoader(response.message);
        setLoginData(response.data);
        router.push("/home");
      } else {
        failureLoader(response.message || "Login failed");
      }
    } catch (error: any) {
      failureLoader(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">

     <h2 className="text-3xl font-bold text-center mb-8"> Login Page </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>
            
          <Form className="space-y-5">

         <div>
              <label className="block mb-2 font-medium">
                Email
              </label>

             <Field type="email" name="email" placeholder="Enter the email"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
             />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
              <label className="block mb-2 font-medium">
                Password
              </label>

              <Field type="password" name="password" placeholder="Enter the password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-blue-500"
              />

              <ErrorMessage name="password" component="div"
                className="text-red-500 text-sm mt-1"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-300"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full border border-blue-600 text-blue-600 py-3 rounded-lg hover:bg-blue-50 transition duration-300"
            >
              Register
            </button>

          </Form>

        </Formik>

      </div>

    </div>
  );
};

export default Login;