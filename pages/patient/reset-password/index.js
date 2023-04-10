import React, { useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import Image from 'next/image';
import { Formik } from 'formik';
import * as yup from 'yup';
import { useRouter } from "next/router";
import { apiPaths } from '../../../utils/api-paths';
import { postRequest } from '../../../utils/axios';


const PatientResetPassword = () => {
    const [loading, setLoading] = useState(false);
    const [isPasswordReset, setPasswordReset] = useState(false);
    const router = useRouter();

    const schema = yup.object({
        password: yup.string().required('Required'),
        re_password:yup.string()
        .oneOf([yup.ref('password'), null], 'Passwords must match')
    })

    const onSubmit = async (values) => {
        if(router.query.code){
            setLoading(true);
            let obj = {
                token:router.query.code,
                password:values.password
            }
            let respond = await postRequest(apiPaths.PATIENT_RESET_PASSWORD, obj);
            if (respond.status) {
                setPasswordReset(true);
            }
            setLoading(false);
        }
    }

    const redirect = () => {
        router.push("/");
    }


    return (
        <>
            {!isPasswordReset ?
                <div className="flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
                    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                        <div className="text-center mb-5">
                            <Image src="/logo.png" alt="vcare" width={120} height={50} className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Reset Password</div>
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

                                        <label htmlFor="password" className="block text-900 font-medium mb-2 mt-3">Password</label>
                                        <InputText id="password" name='password' type="password" placeholder="Password" className={submitCount > 0 && errors.password ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="password_error" onChange={handleChange} />
                                        {submitCount > 0 && errors.password &&
                                            <small id="password_error" className="p-error">
                                                {errors.password}
                                            </small>
                                        }
                                        <label htmlFor="re_password" className="block text-900 font-medium mb-2 mt-3">Re-Password</label>
                                        <InputText id="re_password" name='re_password' type="password" placeholder="Re-Password" className={submitCount > 0 && errors.re_password ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="re_password_error" onChange={handleChange} />
                                        {submitCount > 0 && errors.re_password &&
                                            <small id="re_password_error" className="p-error">
                                                {errors.re_password}
                                            </small>
                                        }
                                        <Button label="Reset Password" type='submit' icon="pi pi-lock" className="w-full mt-3" loading={loading} />
                                    </form>
                                )}
                            </Formik>
                        </div>
                    </div>
                </div>
                :
                <div className="flex flex-column align-items-center justify-content-center surface-section px-4 py-8 md:px-6 lg:px-8 min-h-screen min-w-screen overflow-hidden">
                    <div className='flex flex-column lg:flex-row justify-content-center align-items-center gap-7'>
                        <div className='text-center lg:text-right'>
                            <div className='mt-6 mb-3 font-bold text-6xl text-900'>Success!</div>
                            <p className='text-700 text-3xl mt-0 mb-6'>Password reset successfully.</p>
                            <Button label="Go back to login" type='button' className="p-button p-component p-button-outlined" onClick={redirect} />
                        </div>
                        <img src='/images/password-changed.png' className='w-full md:w-28rem' alt='image' />
                    </div>
                </div>

            }

        </ >
    )
}

PatientResetPassword.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
}

export default PatientResetPassword