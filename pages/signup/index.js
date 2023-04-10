import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Image from 'next/image';
import { Formik } from 'formik';
import * as yup from 'yup';
import {postRequest} from '../../utils/axios';
import { useRouter } from "next/router";
import { apiPaths } from '../../utils/api-paths';


const PatientRegister = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const schema = yup.object({
        first_name: yup.string().required('Required'),
        last_name: yup.string().required('Required'),
        nic: yup.string().required('Required'),
        email: yup.string().email('Invalid Email').required('Required'),
        password: yup.string().required('Required')
    });

    const onSubmit = async (values) => {
        setLoading(true);
        let respond = await postRequest(apiPaths.PATIENT_SIGNUP,values);
        if(respond.status){
            router.push("/signup-complete");
        }
        setLoading(false);
    }


    return (
        <div>
            <div className="flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                    <div className="text-center mb-5">
                        <Image src="/logo.png" alt="vcare" width={120} height={50} className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">Welcome</div>
                        <span className="text-600 font-medium line-height-3">Already have an account?</span>
                        <a href="/" className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Signin</a>
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
                                    <label htmlFor="first_name" className="block text-900 font-medium mb-2">First Name</label>
                                    <InputText id="first_name" name='first_name' type="text" placeholder="First Name" className={submitCount > 0 && errors.first_name ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="first_name_error" onChange={handleChange} />
                                    {submitCount > 0 && errors.first_name &&
                                        <small id="first_name_error" className="p-error">
                                            {errors.first_name}
                                        </small>
                                    }


                                    <label htmlFor="last_name" className="block text-900 font-medium mb-2 mt-3">Last Name</label>
                                    <InputText id="last_name" name='last_name' type="text" placeholder="Last Name" className={submitCount > 0 && errors.last_name ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="last_name_error" onChange={handleChange} />
                                    {submitCount > 0 && errors.last_name &&
                                        <small id="last_name_error" className="p-error">
                                            {errors.last_name}
                                        </small>
                                    }


                                    <label htmlFor="nic" className="block text-900 font-medium mb-2 mt-3">NIC</label>
                                    <InputText id="nic" name='nic' type="text" placeholder="NIC" className={submitCount > 0 && errors.nic ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="nic_error" onChange={handleChange} />
                                    {submitCount > 0 && errors.nic &&
                                        <small id="nic_error" className="p-error">
                                            {errors.email && errors.email}
                                        </small>
                                    }


                                    <label htmlFor="email" className="block text-900 font-medium mb-2 mt-3">Email</label>
                                    <InputText id="email" name='email' type="text" placeholder="Email address" className={submitCount > 0 && errors.email ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="email_error" onChange={handleChange} />
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

                                    <Button label="Sign Up" type='submit' icon="pi pi-user" className="w-full mt-3" loading={loading} />
                                </form>
                            )}
                        </Formik>
                        <div className="flex align-items-center justify-content-center mt-2">
                            <a href="/signup-doctor" className="font-medium no-underline text-blue-500 cursor-pointer">Signup as a doctor</a>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}

PatientRegister.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
}

export default PatientRegister