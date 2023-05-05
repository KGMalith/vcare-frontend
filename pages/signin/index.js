import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Image from 'next/image';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from "next/router";
import { postRequest } from '../../utils/axios';
import { apiPaths } from '../../utils/api-paths';

const UserLogin = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const schema = yup.object({
        email: yup.string().email('Invalid Email').required('Required'),
        password: yup.string().required('Required')
    });

    const onSubmit = async (values) => {
        setLoading(true);
        let respond = await postRequest(apiPaths.USER_SIGNIN,values);
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
                        <div className="text-900 text-3xl font-medium mb-3">User Signin</div>
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

                                    <Button label="Sign In" type='submit' icon="pi pi-user" className="w-full mt-3" loading={loading}/>
                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </div>
        </div>
    )
}

UserLogin.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
}

export default UserLogin