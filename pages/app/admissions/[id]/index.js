import React, { useEffect, useState, useRef } from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';

const Admission = () => {
    const [admissionDetails,setAdmissionDetails] = useState({})

    const dischargeAdmission = () =>{

    }

    return (
        <>
            <div className='surface-section surface-card shadow-2 border-round flex-auto xl:ml-5'>
                <div className='surface-section px-5 py-5'>
                    <div className='flex align-items-start flex-column lg:flex-row lg:justify-content-between'>
                        <div className='flex align-items-start flex-column md:flex-row'>
                            <div>
                                <span className='text-900 font-medium text-3xl'>B-0001</span>
                                <div className='flex align-items-center flex-wrap text-sm'>
                                    <div className='mr-5 mt-3'>
                                        <span className='font-semibold text-500'>
                                            <i className='pi pi-history mr-1'></i>
                                            Status
                                        </span>
                                        <Badge value={admissionDetails?.status == 0 ? 'Pending' : admissionDetails?.status == 10 ? 'Paid' : admissionDetails?.status == 20 ? 'Bill Finalized' : admissionDetails?.status == -10 && 'Cancelled'} severity={admissionDetails?.status == 0 ? 'warning' : admissionDetails?.status == 10 ? 'success' : admissionDetails?.status == 20 ? 'info' : admissionDetails?.status == -10 && 'danger'}></Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-6 py-5 surface-ground'>
                    <div className='surface-card p-4 shadow-2 border-round'>
                        <div className='font-medium text-3xl text-900 mb-3'>
                            Admission Details
                            <Button icon="pi pi-times" label="Discharge" className='p-button-outlined p-button-danger' style={{ float: 'right' }} onClick={() => dischargeAdmission()} />
                        </div>
                        <div className='text-500 mb-5'>All details related to admission are down below</div>
                        <ul className='list-none p-0 m-0 border-top-1 border-300'>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Admission Code</div>
                                <div className='text-900 w-full md:w-9'>BILL-001</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                <div className='text-500 w-full md:w-3 font-medium'>Admit Date</div>
                                <div className='text-900 w-full md:w-9'>100</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Discharge Date</div>
                                <div className='text-900 w-full md:w-9'>20</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                <div className='text-500 w-full md:w-3 font-medium'>Hospital Room</div>
                                <div className='text-900 w-full md:w-9'>100</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Patient</div>
                                <div className='text-900 w-full md:w-9'>100</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Doctors</div>
                                <div className='text-900 w-full md:w-9'>Cash</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Bill</div>
                                <div className='text-900 w-full md:w-9'>Cash</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                <div className='text-500 w-full md:w-3 font-medium'>Status</div>
                                <div className='text-900 w-full md:w-9'>
                                    <Badge value="Yes" severity="success"></Badge>
                                    {/* <Badge value="No" severity="warning"></Badge> */}
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Admission