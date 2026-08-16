"use client";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { register } from '../(main)/utils/AuthApi'
import { useRouter } from "next/navigation"
import * as Yup from "yup";
import { failureLoader, successLoader } from "../(main)/utils/utils";

interface RegisterFormValues{
    name:string;
    email:string;
    mobile:string;
    password:string;
    address:string;
}


const Register=()=>{
    const router=useRouter();
    const intitalValues:RegisterFormValues={
        name:"",
        email:"",
        mobile:"",
        password:"",
        address:""
    }
    const validationSchema=Yup.object({
        name:Yup.string().required("Name is required"),
        email:Yup.string().email().required("Enter the mail"),
        mobile:Yup.string().matches(/^[0-9]{10}$/).required("Enter the mobile number"),
        password:Yup.string().min(3).max(10).required("Enter the password"),
        address:Yup.string().required("enter the address")
    })
    const handleSubmit=async(values:RegisterFormValues,{resetForm}:FormikHelpers<RegisterFormValues>)=>{
            try {
                const response=await register (values)
                console.log("register response",response);
                if(response.success){
                    successLoader(response.message);
                    resetForm();
                    router.push('/login');
                }
                else{
                    failureLoader(response.message||"register failed")
                }
            } catch (error:any) {
                failureLoader(error.message);
            }
    }
    return(
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] px-4 py-10">
      <div className="w-full max-w-[800px] flex flex-col md:flex-row shadow-lg overflow-hidden">
        <div className="bg-[#6366f1] text-white p-8 md:w-[340px] flex flex-col justify-between min-h-[420px]">
          <div>
            <h2 className="text-3xl font-medium mb-4">Looks like you&apos;re new here!</h2>
            <p className="text-[#c7d2fe] text-lg leading-7">
              Sign up with your mobile number to get started
            </p>
          </div>
          <p className="italic font-extrabold text-2xl mt-10">Grabbuy</p>
        </div>
        <div className="flex-1 bg-white p-8 md:p-10">
    <Formik
    initialValues={intitalValues}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}>
        <Form className="space-y-5">
            <div>
                <Field type="text" name="name" placeholder="Enter Name" className="fk-input" />
                <ErrorMessage name="name" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
                <Field type="email" name="email" placeholder="Enter Email" className="fk-input" />
                <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
            </div>
            <div>
                <Field type="number" name="mobile" placeholder="Enter Mobile number" className="fk-input"/>
                <ErrorMessage name="mobile" component="div" className="text-red-500 text-sm mt-1"/>
            </div>
            <div>
                <Field type="password" name="password" placeholder="Enter Password" className="fk-input"/>
                <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1"/>
            </div>
            <div>
                <Field type="text" name="address" placeholder="Enter Address" className="fk-input"/>
                <ErrorMessage name="address" component="div" className="text-red-500 text-sm mt-1"/>
            </div>
            <p className="text-xs text-[#64748b]">
              By continuing, you agree to Grabbuy&apos;s Terms of Use and Privacy Policy.
            </p>
            <button className="fk-orange-btn w-full py-3 text-sm" type="submit">Register</button>
            <button className="w-full bg-white text-[#6366f1] py-3 text-sm font-medium shadow-[0_2px_4px_0_rgba(0,0,0,.2)]"  type="button"  onClick={()=>router.push("/login")}>Existing User? Log in</button>
        </Form>

    </Formik>
        </div>
      </div>
    </div>
    )
}
export default Register;
