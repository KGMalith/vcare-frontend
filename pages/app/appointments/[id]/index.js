import React, { useEffect, useState } from 'react'
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { postRequest } from '../../../../utils/axios';
import { apiPaths } from '../../../../utils/api-paths';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CONSTANTS } from '../../../../utils/constants';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import moment from 'moment';
import 'moment-timezone';
import { withAuth } from '../../../../utils/withAuth';
import { hasPermission } from '../../../../utils/permissions';

const Appointment = () => {
    const [appointmentDetails, setAppointmentDetails] = useState({});
    const [isPageLoading, setPageLoading] = useState(false);
    const [isCancelLoading, setCancelLoading] = useState(false);
    const [timezone, setTimezone] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const router = useRouter();

    const cancelConfirmation = () => {
        confirmDialog({
            message: 'Do you want to cancel this appointment?',
            header: 'Appointment Cancel Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: userRole != CONSTANTS.patient_role_id ? () => cancelAppointment() : () => cancelAppointmentPatient(),
        });
    }

    const cancelAppointment = async () => {
        setCancelLoading(true);
        let respond = await postRequest(apiPaths.CANCEL_APPOINTMENT, { id: router?.query?.id });
        if (respond.status) {
            loadAllData();
        }
        setCancelLoading(false);
    }

    const cancelAppointmentPatient = async () => {
        setCancelLoading(true);
        let respond = await postRequest(apiPaths.CANCEL_APPOINTMENT_PATIENT, { id: router?.query?.id });
        if (respond.status) {
            loadAllData();
        }
        setCancelLoading(false);
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
            let respond = await postRequest(apiPaths.GET_APPOINTMENT_DETAILS, { id: router?.query?.id });
            if (respond.status) {
                setAppointmentDetails(respond.data);
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
                <>
                    {hasPermission(53) &&
                        <div className='surface-section surface-card shadow-2 border-round flex-auto xl:ml-5'>
                            <div className='surface-section px-5 py-5'>
                                <div className='flex align-items-start flex-column lg:flex-row lg:justify-content-between'>
                                    <div className='flex align-items-start flex-column md:flex-row'>
                                        <div>
                                            <span className='text-900 font-medium text-3xl'>{appointmentDetails?.appointment_code}</span>
                                            <div className='flex align-items-center flex-wrap text-sm'>
                                                <div className='mr-5 mt-3'>
                                                    <span className='font-semibold text-500'>
                                                        <i className='pi pi-history mr-1'></i>
                                                        Status
                                                    </span>
                                                    <div className='mt-2'>
                                                        <Badge value={appointmentDetails?.status == CONSTANTS.appointment_active ? 'Active' : appointmentDetails?.status == CONSTANTS.appointment_cancel && 'Cancelled'} severity={appointmentDetails?.status == CONSTANTS.appointment_active ? 'success' : appointmentDetails?.status == CONSTANTS.appointment_cancel && 'danger'}></Badge>
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
                                        Appointment Details
                                        {appointmentDetails?.status == CONSTANTS.appointment_active &&
                                            <Button icon="pi pi-times" label="Cancel Appointment" className='p-button-outlined p-button-danger' style={{ float: 'right' }} onClick={() => cancelConfirmation()} loading={isCancelLoading} />
                                        }
                                    </div>
                                    <div className='text-500 mb-5'>All details related to appointment are down below</div>
                                    <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                        <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                            <div className='text-500 w-full md:w-4 font-medium'>Appointment Code</div>
                                            <div className='text-900 w-full md:w-8'>{appointmentDetails?.appointment_code}</div>
                                        </li>
                                        <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                            <div className='text-500 w-full md:w-4 font-medium'>Appointment Start Date And Time</div>
                                            <div className='text-900 w-full md:w-8'>{moment(appointmentDetails?.appointment_start_date)?.tz(timezone)?.format('YYYY-MM-DD hh:mm:ss A')}</div>
                                        </li>
                                        <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                            <div className='text-500 w-full md:w-4 font-medium'>Appointment End Date And Time</div>
                                            <div className='text-900 w-full md:w-8'>{moment(appointmentDetails?.appointment_end_date)?.tz(timezone)?.format('YYYY-MM-DD hh:mm:ss A')}</div>
                                        </li>
                                        <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                            <div className='text-500 w-full md:w-4 font-medium'>Patient</div>
                                            <div className='text-primary-500 w-full md:w-8 cursor-pointer' onClick={() => redirectPage(`/app/patients/${appointmentDetails?.patient_id?.id}`)}>{appointmentDetails?.patient_id?.patient_code + " - " + appointmentDetails?.patient_id?.first_name + ' ' + appointmentDetails?.patient_id?.last_name}</div>
                                        </li>
                                        <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                            <div className='text-500 w-full md:w-4 font-medium'>Doctor</div>
                                            <div className='text-primary-500 w-full md:w-8 cursor-pointer' onClick={() => redirectPage(`/app/doctors/${appointmentDetails?.doctor_id?.id}`)}>{appointmentDetails?.doctor_id?.doctor_code + " - " + appointmentDetails?.doctor_id?.first_name + ' ' + appointmentDetails?.doctor_id?.last_name}</div>
                                        </li>
                                        <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                            <div className='text-500 w-full md:w-4 font-medium'>Bill</div>
                                            <div className='text-primary-500 w-full md:w-8 cursor-pointer' onClick={() => redirectPage(`/app/bills/${appointmentDetails?.bill?.id}`)}>{appointmentDetails?.bill?.bill_code}</div>
                                        </li>
                                        <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                            <div className='text-500 w-full md:w-4 font-medium'>Status</div>
                                            <div className='text-900 w-full md:w-8'>
                                                <Badge value={appointmentDetails?.status == CONSTANTS.appointment_active ? 'Active' : appointmentDetails?.status == CONSTANTS.appointment_cancel && 'Cancelled'} severity={appointmentDetails?.status == CONSTANTS.appointment_active ? 'success' : appointmentDetails?.status == CONSTANTS.appointment_cancel && 'danger'}></Badge>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    }
                </>
            }
        </>
    )
}

export default withAuth(Appointment)