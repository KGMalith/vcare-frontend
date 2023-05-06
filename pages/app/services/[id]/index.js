import React, { useEffect, useState } from 'react';
import { Badge } from 'primereact/badge';
import { useRouter } from 'next/router';
import { postRequest } from '../../../../utils/axios';
import { apiPaths } from '../../../../utils/api-paths';
import { CONSTANTS } from '../../../../utils/constants';
import { ProgressSpinner } from 'primereact/progressspinner';

function ViewService() {
    const [service, setService] = useState(null);
    const [isLoading, setLoading] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const getAllServiceDetails = async () => {
            if (router && router.query && router.query.id) {
                setLoading(true);
                let respond = await postRequest(apiPaths.GET_SERVICE, { id: parseInt(router.query.id) });
                if (respond.status) {
                    setService(respond.data);
                }
                setLoading(false);
            }
        }
        getAllServiceDetails();
    }, [router?.query?.id])


    return (
        <>
            {isLoading ?
                <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
                    <div className='flex align-items-center justify-content-center min-h-screen'>
                        <ProgressSpinner />
                    </div>
                </div>
                :
                <div className='surface-section surface-card shadow-2 border-round flex-auto xl:ml-5'>
                    <div className='surface-section px-5 py-5'>
                        <div className='flex align-items-start flex-column lg:flex-row lg:justify-content-between'>
                            <div className='flex align-items-start flex-column md:flex-row'>
                                <div className='relative'>
                                    <img src='/images/image-placeholder.jpeg' className='mr-5 mb-3 lg:mb-0 bg-contain bg-no-repeat bg-center' style={{ width: '90px', height: '90px' }} />
                                </div>
                                <div>
                                    <span className='text-900 font-medium text-3xl'>{service?.service_name}</span>
                                    <div className='flex align-items-center flex-wrap text-sm'>
                                        <div className='mr-5 mt-3'>
                                            <span className='font-semibold text-500'>
                                                <i className='pi pi-money-bill mr-1'></i>
                                                Amount
                                            </span>
                                            <div className='text-700 mt-2 font-bold'>{(service?.service_charge)?.toFixed(2)}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='px-6 py-5 surface-ground'>
                        <div className='surface-card p-4 shadow-2 border-round'>
                            <div className='font-medium text-3xl text-900 mb-3'>Service Profile</div>
                            <div className='text-500 mb-5'>All details related to service are down below</div>
                            <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Service Number</div>
                                    <div className='text-900 w-full md:w-9'>{service?.service_code}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Service Name</div>
                                    <div className='text-900 w-full md:w-9'>{service?.service_name}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Description</div>
                                    <div className='text-900 w-full md:w-9'>{service?.service_desc}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Amount</div>
                                    <div className='text-900 w-full md:w-9'>{(service?.service_charge)?.toFixed(2)}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Is Apply To Every Appointment</div>
                                    <div className='text-900 w-full md:w-9'>
                                        <Badge value={service?.is_apply_to_every_appointment == CONSTANTS.is_apply_to_every_appointment_true ? 'Yes' : 'No'} severity={service?.is_apply_to_every_appointment == CONSTANTS.is_apply_to_every_appointment_true ? 'success' : 'warning'}></Badge>
                                    </div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Is Apply To Every Admission</div>
                                    <div className='text-900 w-full md:w-9'>
                                        <Badge value={service?.is_apply_to_every_admission == CONSTANTS.is_apply_to_every_admission_true ? 'Yes' : 'No'} severity={service?.is_apply_to_every_admission == CONSTANTS.is_apply_to_every_admission_true ? 'success' : 'warning'}></Badge>
                                    </div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Service Status</div>
                                    <div className='text-900 w-full md:w-9'>
                                        <Badge value={service?.status == CONSTANTS.hospital_service_active ? 'Active' : service?.status == CONSTANTS.hospital_service_inactive && 'Inactive'} severity={service?.status == CONSTANTS.hospital_service_active ? 'success' : service?.status == CONSTANTS.hospital_service_inactive && 'danger'}></Badge>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default ViewService