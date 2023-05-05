import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Image from 'next/image';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from "next/router";
import { apiPaths } from '../utils/api-paths';
import { postRequest } from '../utils/axios';

const PatientLogin = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const schema = yup.object({
        email: yup.string().email('Invalid Email').required('Required'),
        password: yup.string().required('Required')
    });

    const onSubmit = async (values) => {
        setLoading(true);
        let respond = await postRequest(apiPaths.PATIENT_SIGNIN,values);
        if(respond.status){
            localStorage.setItem('token',respond.data.token);
            localStorage.setItem('user_email',respond.data.user_email);
            localStorage.setItem('user_name',respond.data.user_name);
            localStorage.setItem('user_role',respond.data.user_role);
            localStorage.setItem('permissions',respond.data.permissions);
            localStorage.setItem('timezone',respond.data.timezone);
            router.push("/app/dashboard");
        }
        setLoading(false);
    }

    return (
        <div>
            <div className="flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                    <div className="text-center mb-5">
                        <Image src="/logo.png" alt="vcare" width={120} height={50} className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">Welcome Back</div>
                        <span className="text-600 font-medium line-height-3">Don't have an account?</span>
                        <a href="/signup" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer"> Create today!</a>
                    </div>

                    <div>
                        <Formik
                            validationSchema={schema}
                            onSubmit={(values) => onSubmit(values)}
                            initialValues={{}}>
                            {({
                                errors,
                                handleChange,
                                handleSubmit,
                                submitCount
                            }) => (
                                <form noValidate onSubmit={handleSubmit}>
                                    <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                                    <InputText id="email" type="text" placeholder="Email address" className={submitCount > 0 && errors.email ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="email_error" onChange={handleChange} />
                                    {submitCount > 0 && errors.email &&
                                        <small id="email_error" className="p-error">
                                            {errors.email}
                                        </small>
                                    }

                                    <label htmlFor="password" className="block text-900 font-medium mb-2 mt-3">Password</label>
                                    <InputText type="password" name='password' placeholder="Password" className={submitCount > 0 && errors.password ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="password_error" onChange={handleChange} />
                                    {submitCount > 0 && errors.password &&
                                        <small id="password_error" className="p-error">
                                            {errors.password}
                                        </small>
                                    }

                                    <div className="flex align-items-center justify-content-end mb-6">
                                        <a href="/patient/forgot-password" className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
                                    </div>

                                    <Button label="Sign In" type='submit' icon="pi pi-user" className="w-full" loading={loading}/>
                                </form>
                            )}
                        </Formik>
                        <div className="flex align-items-center justify-content-center mt-2">
                            <a href="/signin-doctor" className="font-medium no-underline text-blue-500 cursor-pointer">Signin as a doctor</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

PatientLogin.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
}

export default PatientLogin