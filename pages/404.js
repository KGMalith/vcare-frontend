import React from 'react';
import { Button } from 'primereact/button';
import { useRouter } from "next/router";


const Custom404 = () => {
    const router = useRouter();

    const onSubmit = () => {
        router.push("/");
    }


    return (
        <div>
            <div className="flex flex-column align-items-center justify-content-center surface-section px-4 py-8 md:px-6 lg:px-8 min-h-screen min-w-screen overflow-hidden">
                <div className='flex flex-column lg:flex-row justify-content-center align-items-center gap-7'>
                    <div className='text-center lg:text-right'>
                        <div className='mt-6 mb-3 font-bold text-6xl text-900'>Ooops!</div>
                        <p className='text-700 text-3xl mt-0 mb-6'>Page Not Found</p>
                        <Button label="Go back to login" type='button' className="p-button p-component p-button-outlined" onClick={onSubmit} />
                    </div>
                    <img src='/images/404.png' className='w-full md:w-28rem' alt='image' />
                </div>
            </div>
        </div >
    )
}

Custom404.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
        </React.Fragment>
    );
}

export default Custom404