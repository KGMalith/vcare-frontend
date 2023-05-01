import React, { useEffect, useState, useRef } from 'react'
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';

const Appointment = () => {
    const [appointmentDetails,setAppointmentDetails] = useState({})

    const cancelAppointment = () =>{

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
                                        <Badge value={appointmentDetails?.status == 0 ? 'Pending' : appointmentDetails?.status == 10 ? 'Paid' : appointmentDetails?.status == 20 ? 'Bill Finalized' : appointmentDetails?.status == -10 && 'Cancelled'} severity={appointmentDetails?.status == 0 ? 'warning' : appointmentDetails?.status == 10 ? 'success' : appointmentDetails?.status == 20 ? 'info' : appointmentDetails?.status == -10 && 'danger'}></Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-6 py-5 surface-ground'>
                    <div className='surface-card p-4 shadow-2 border-round'>
                        <div className='font-medium text-3xl text-900 mb-3'>
                            Appointment Details
                            <Button icon="pi pi-times" label="Cancel Appointment" className='p-button-outlined p-button-danger' style={{ float: 'right' }} onClick={() => cancelAppointment()} />
                        </div>
                        <div className='text-500 mb-5'>All details related to appointment are down below</div>
                        <ul className='list-none p-0 m-0 border-top-1 border-300'>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Appointment Code</div>
                                <div className='text-900 w-full md:w-9'>BILL-001</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                <div className='text-500 w-full md:w-3 font-medium'>Appointment Date</div>
                                <div className='text-900 w-full md:w-9'>100</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Start Time</div>
                                <div className='text-900 w-full md:w-9'>20</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                <div className='text-500 w-full md:w-3 font-medium'>End Time</div>
                                <div className='text-900 w-full md:w-9'>100</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Patient</div>
                                <div className='text-900 w-full md:w-9'>100</div>
                            </li>
                            <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                <div className='text-500 w-full md:w-3 font-medium'>Doctor</div>
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

export default Appointment