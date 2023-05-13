import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button } from 'primereact/button';
import { Formik } from 'formik';
import { InputText } from 'primereact/inputtext';
import Image from 'next/image';
import * as yup from 'yup';
import Loader from '../../../components/loader';
import { postRequest } from '../../../utils/axios';
import { apiPaths } from '../../../utils/api-paths';

const Invitation = () => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(true);
    const [isFormLoading, setFormLoading] = useState(false);
    const [respondView, setRespondView] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const schema = yup.object({
        password: yup.string().required('Required'),
        re_password: yup.string()
            .oneOf([yup.ref('password'), null], 'Passwords must match')
    })

    const redirect = () => {
        router.push("/");
    }

    const setupPassword = async (values) => {
        if(router.query.code){
            setFormLoading(true);
            let obj = {
                token:router.query.code,
                password:values.password
            }
            let respond = await postRequest(apiPaths.PATIENT_SETUP_PASSWORD, obj);
            if (respond.status) {
                setRespondView(2);
            }else{
                setRespondView(3);
                setErrorMessage(respond.message); 
            }
            setFormLoading(false);
        }
    }

    useEffect(() => {
        const validateToken = async () => {
            if (router.query.code) {
                //reset values
                setRespondView(null);
                setErrorMessage(null);

                let values = {
                    token: router.query.code
                };
                let respond = await postRequest(apiPaths.VERIFY_PATIENT_TOKEN, values);
                if (respond.status) {
                    setRespondView(1);
                } else {
                    setRespondView(3);
                    setErrorMessage(respond.message);
                }
                setLoading(false);
            }

        }
        validateToken();
    }, [router])

    return (
        <>
            {isLoading ?
                <Loader />
                :
                <>
                    {respondView && respondView == 1 ?
                        <div className="flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
                            <div className="surface-card p-4 shadow-2 border-round w-full lg:w-4">
                                <div className="text-center mb-5">
                                    <Image src="/logo.png" alt="vcare" width={120} height={50} className="mb-3" />
                                    <div className="text-900 text-3xl font-medium mb-3">Setup Patient Password</div>
                                </div>
                                <div>
                                    <Formik
                                        validationSchema={schema}
                                        onSubmit={(values) => setupPassword(values)}
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
                                                <Button label="Setup Password" type='submit' icon="pi pi-lock" className="w-full mt-3" loading={isFormLoading} />
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                            </div>
                        </div>
                        : respondView && respondView == 2 ?
                            <div className="flex flex-column align-items-center justify-content-center surface-section px-4 py-8 md:px-6 lg:px-8 min-h-screen min-w-screen overflow-hidden">
                                <div className='flex flex-column lg:flex-row justify-content-center align-items-center gap-7'>
                                    <div className='text-center lg:text-right'>
                                        <div className='mt-6 mb-3 font-bold text-6xl text-900'>Success!</div>
                                        <p className='text-700 text-3xl mt-0 mb-6'>Password setup successfully.</p>
                                        <Button label="Go back to login" type='button' className="p-button p-component p-button-outlined" onClick={redirect} />
                                    </div>
                                    <img src='/images/password-changed.png' className='w-full md:w-28rem' alt='image' />
                                </div>
                            </div>
                            :
                            <div className="flex flex-column align-items-center justify-content-center surface-section px-4 py-8 md:px-6 lg:px-8 min-h-screen min-w-screen overflow-hidden">
                                <div className='flex flex-column lg:flex-row justify-content-center align-items-center gap-7'>
                                    <div className='text-center lg:text-right'>
                                        <div className='mt-6 mb-3 font-bold text-6xl text-900'>Error!</div>
                                        <p className='text-700 text-3xl mt-0 mb-6'>{errorMessage}</p>
                                        <Button label="Go back to login" type='button' className="p-button p-component p-button-outlined" onClick={redirect} />
                                    </div>
                                    <img src='/images/error.png' className='w-full md:w-28rem' alt='image' />
                                </div>
                            </div>
                    }
                </>

            }
        </>
    )
}

Invitation.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
}

export default Invitation