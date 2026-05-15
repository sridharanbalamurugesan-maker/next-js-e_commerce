"use client";
import { ErrorMessage, Field, Form, Formik, FormikHelpers } from "formik";
import { register } from '../(main)/utils/AuthApi'
import { useRouter } from "next/navigation"
import * as Yup from "yup";
import { failureLoader, successLoader } from "../(main)/utils/utils";
import '../register.css';

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
    <div>
    <h2>Register Page</h2>
    <Formik
    initialValues={intitalValues}
    validationSchema={validationSchema}
    onSubmit={handleSubmit}>
        <Form className="Register_Page">
            <div className="form-group">
                <label>Name</label>
                <Field type="text" name="name" placeholder="Enter the name" />
                <ErrorMessage name="name" component="div" className="error" />
            </div>
            <div className="form-group">
                <label>Email</label>
                <Field type="email" name="email" placeholder="Enter the mail" />
                <ErrorMessage name="email" component="div" className="error" />
            </div>
            <div className="form-group">
                <label>mobile</label>
                <Field type="number" name="mobile" placeholder="Enter the mobile number"/>
                <ErrorMessage name="mobile" component="div" className="error"/>
            </div>
            <div className="form-group">
                <label>password</label>
                <Field type="password" name="password" placeholder="Enter the password"/>
                <ErrorMessage name="password" component="div" className="error"/>
            </div>
            <div className="form-group">
                <label>address</label>
                <Field type="text" name="address" placeholder="Enter the password"/>
                <ErrorMessage name="address" component="div" className="error"/>
            </div>
            <div>
                <button className="secondary-btn" type="submit">Register</button>
            </div>
            <div>
                <button className="secondary-btn"  type="button"  onClick={()=>router.push("/login")}>login</button>
            </div>
        </Form>

    </Formik>
    </div>
    )
}
export default Register;