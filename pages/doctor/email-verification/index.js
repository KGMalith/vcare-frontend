import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import { Button } from 'primereact/button';
import Loader from '../../../components/loader';
import { postRequest } from '../../../utils/axios';
import { apiPaths } from '../../../utils/api-paths';

const DoctorEmailVerification = () => {
    const router = useRouter();
    const [isLoading, setLoading] = useState(true);
    const [respondView, setRespondView] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    const onSubmit = () => {
        router.push("/");
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
                let respond = await postRequest(apiPaths.VERIFY_DOCTOR_EMAIL, values);
                if (respond.status) {
                    setRespondView(1);
                } else {
                    setRespondView(2);
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
                        <div className="flex flex-column align-items-center justify-content-center surface-section px-4 py-8 md:px-6 lg:px-8 min-h-screen min-w-screen overflow-hidden">
                            <div className='flex flex-column lg:flex-row justify-content-center align-items-center gap-7'>
                                <div className='text-center lg:text-right'>
                                    <div className='mt-6 mb-3 font-bold text-6xl text-900'>Success!</div>
                                    <p className='text-700 text-3xl mt-0 mb-6'>You have verified your email successfully.</p>
                                    <Button label="Go back to login" type='button' className="p-button p-component p-button-outlined" onClick={onSubmit} />
                                </div>
                                <img src='/images/email_confirmed.png' className='w-full md:w-28rem' alt='image' />
                            </div>
                        </div>
                        :
                        <div className="flex flex-column align-items-center justify-content-center surface-section px-4 py-8 md:px-6 lg:px-8 min-h-screen min-w-screen overflow-hidden">
                            <div className='flex flex-column lg:flex-row justify-content-center align-items-center gap-7'>
                                <div className='text-center lg:text-right'>
                                    <div className='mt-6 mb-3 font-bold text-6xl text-900'>Error!</div>
                                    <p className='text-700 text-3xl mt-0 mb-6'>{errorMessage}</p>
                                    <Button label="Go back to login" type='button' className="p-button p-component p-button-outlined" onClick={onSubmit} />
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


DoctorEmailVerification.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
}

export default DoctorEmailVerification