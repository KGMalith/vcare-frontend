import React, { useEffect, useState } from 'react';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import moment from 'moment';
import 'moment-timezone';
import { postRequest } from '../../../../utils/axios';
import { apiPaths } from '../../../../utils/api-paths';
import { CONSTANTS } from '../../../../utils/constants';

const Admission = () => {
    const [admissionDetails, setAdmissionDetails] = useState({});
    const [isPageLoading, setPageLoading] = useState(false);
    const [isDischargeLoading, setDischargeLoading] = useState(false);
    const [timezone, setTimezone] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    
    const dischargeConfirmation = () => {
        confirmDialog({
            message: 'Do you want to discharge this admission?',
            header: 'Admission Discharge Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept:() => dischargeAdmission(),
        });
    }
    
    const dischargeAdmission = async() => {
        setDischargeLoading(true);
        let respond = await postRequest(apiPaths.DISCHARGE_PATIENT, { id: router?.query?.id });
        if (respond.status) {
            loadAllData();
        }
        setDischargeLoading(false);
    }

    useEffect(() => {
        let timeZone = localStorage.getItem('timezone');
        if (timeZone) {
            setTimezone(timeZone);
        }

        let userRole = localStorage.getItem('user_role');
        if (userRole) {
            setUserRole(userRole);
        }
        loadAllData();
    }, [router?.query?.id])

    const loadAllData = async () => {
        if (router?.query?.id) {
            setPageLoading(true);
            let respond = await postRequest(apiPaths.GET_ADMISSION_DETAILS, { id: router?.query?.id });
            if (respond.status) {
                setAdmissionDetails(respond.data);
            }
            setPageLoading(false);
        }
    }

    const redirectPage = (value) => {
        router.push(value)
    }

    return (
        <>
            <ConfirmDialog />
            {isPageLoading ?
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
                                <div>
                                    <span className='text-900 font-medium text-3xl'>{admissionDetails?.admission_code}</span>
                                    <div className='flex align-items-center flex-wrap text-sm'>
                                        <div className='mr-5 mt-3'>
                                            <span className='font-semibold text-500'>
                                                <i className='pi pi-history mr-1'></i>
                                                Status
                                            </span>
                                            <div className='mt-2'>
                                                <Badge value={admissionDetails?.status == CONSTANTS.admission_active ? 'Active' : admissionDetails?.status == CONSTANTS.patient_discharged && 'Patient Discharged'} severity={admissionDetails?.status == CONSTANTS.admission_active ? 'success' : admissionDetails?.status == CONSTANTS.patient_discharged && 'warning'}></Badge>
                                            </div>
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
                                {userRole != CONSTANTS.patient_role_id && admissionDetails?.status == CONSTANTS.admission_active &&
                                    <Button icon="pi pi-times" label="Discharge" className='p-button-outlined p-button-danger' style={{ float: 'right' }} onClick={() => dischargeConfirmation()} loading={isDischargeLoading}/>
                                }

                            </div>
                            <div className='text-500 mb-5'>All details related to admission are down below</div>
                            <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Admission Code</div>
                                    <div className='text-900 w-full md:w-9'>{admissionDetails?.admission_code}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Admit Date</div>
                                    <div className='text-900 w-full md:w-9'>{moment(admissionDetails?.admit_date)?.tz(timezone)?.format('YYYY-MM-DD hh:mm:ss A')}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Discharge Date</div>
                                    <div className='text-900 w-full md:w-9'>{admissionDetails?.discharge_date && moment(admissionDetails?.discharge_date)?.tz(timezone)?.format('YYYY-MM-DD hh:mm:ss A')}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Hospital Room</div>
                                    <div className='text-primary-500 w-full md:w-9 cursor-pointer' onClick={() => redirectPage(`/app/rooms/${admissionDetails?.hospital_room?.id}`)}>{admissionDetails?.hospital_room?.room_number}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Patient</div>
                                    <div className='text-primary-500 w-full md:w-9 cursor-pointer' onClick={() => redirectPage(`/app/patients/${admissionDetails?.patient_id?.id}`)}>{admissionDetails?.patient_id?.patient_code + ' - ' + admissionDetails?.patient_id?.first_name + ' ' + admissionDetails?.patient_id?.last_name}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Doctors</div>
                                    <div className='text-primary-500 w-full md:w-9'>
                                        <ul>
                                            {admissionDetails?.doctors?.map((values, index) => (
                                                <li className='cursor-pointer' key={index} onClick={() => redirectPage(`/app/doctors/${values?.id}`)}>{values?.doctor_code+' - '+values?.first_name+' '+values?.last_name}</li>
                                            ))
                                            }
                                        </ul>
                                    </div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Bill</div>
                                    <div className='text-primary-500 w-full md:w-9 cursor-pointer' onClick={() => redirectPage(`/app/patients/${admissionDetails?.bill?.id}`)}>{admissionDetails?.bill?.bill_code}</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Status</div>
                                    <div className='text-900 w-full md:w-9'>
                                        <Badge value={admissionDetails?.status == CONSTANTS.admission_active ? 'Active' : admissionDetails?.status == CONSTANTS.patient_discharged && 'Patient Discharged'} severity={admissionDetails?.status == CONSTANTS.admission_active ? 'success' : admissionDetails?.status == CONSTANTS.patient_discharged && 'warning'}></Badge>
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

export default Admission