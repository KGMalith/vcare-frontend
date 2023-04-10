import React from 'react';
import { ProgressSpinner } from 'primereact/progressspinner';

function Loader() {
    return (
        <div>
            <div className="flex flex-column align-items-center justify-content-center surface-section px-4 py-8 md:px-6 lg:px-8 min-h-screen min-w-screen overflow-hidden">
                <div className='flex flex-column lg:flex-row justify-content-center align-items-center gap-7'>
                    <ProgressSpinner />
                </div>
            </div>
        </div>
    )
}

export default Loader;