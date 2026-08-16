"use client";

import { ErrorMessage, Field, Form, Formik } from "formik";
import { useRouter } from "next/navigation";
import * as Yup from "yup";
import { login } from "../(main)/utils/AuthApi";
import {failureLoader,setLoginData,successLoader} from "../(main)/utils/utils";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useState } from "react";

interface LoginFormValues {
  email: string;
  password: string;
}
const Login = () => {

  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

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
  const ForgotPassword=()=>{
      router.push('/forgotPassword');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-10">

      <div className="w-full max-w-[800px] flex flex-col md:flex-row shadow-lg overflow-hidden">

        <div className="bg-[#6366f1] text-white p-8 md:w-[340px] flex flex-col justify-between min-h-[420px]">
          <div>
            <h2 className="text-3xl font-medium mb-4">Login</h2>
            <p className="text-[#c7d2fe] text-lg leading-7">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>
          <p className="italic font-extrabold text-2xl mt-10">Grabbuy</p>
        </div>

        <div className="flex-1 bg-white p-8 md:p-10">

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}>

          <Form className="space-y-6">

         <div>
             <Field type="email" name="email" placeholder="Enter Email / Mobile number"
                className="fk-input"
             />
              <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
             <div className="relative">
                <Field type={showPassword ? "text" : "password"}name="password" placeholder="Enter Password"
                className="fk-input pr-10"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-[#6366f1] text-sm font-medium"
                >
                {showPassword ? (<FaEyeSlash size={18}/>) : (<FaEye size={18}/>)}
                </button>
            </div>

            <ErrorMessage name="password" component="div"className="text-red-500 text-sm mt-1"/>
            </div>
            <p className="text-xs text-[#64748b]">
              By continuing, you agree to Grabbuy&apos;s Terms of Use and Privacy Policy.
            </p>
            <button
              type="submit"
              className="fk-orange-btn w-full py-3 text-sm"
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => router.push("/register")}
              className="w-full bg-white text-[#6366f1] py-3 text-sm font-medium shadow-[0_2px_4px_0_rgba(0,0,0,.2)]"
            >
              New to Grabbuy? Create an account
            </button>

          </Form>

        </Formik>
                <div className="text-right mt-4">
                <h4 className="text-[#6366f1] text-sm cursor-pointer font-medium" onClick={ForgotPassword}>
                    Forgot password?
                </h4>
                </div>

      </div>

      </div>

    </div>
  );
};

export default Login;
