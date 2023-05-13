import React, { useEffect, useState, useRef } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Badge } from 'primereact/badge';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { useRouter } from 'next/router';
import { FilterMatchMode } from 'primereact/api';
import { ProgressSpinner } from 'primereact/progressspinner';
import { postRequest } from '../../../../utils/axios';
import { apiPaths } from '../../../../utils/api-paths';
import moment from 'moment';
import 'moment-timezone';
import { CONSTANTS } from '../../../../utils/constants';
import { withAuth } from '../../../../utils/withAuth';

const Doctor = () => {
    const [activeIndex, setactiveIndex] = useState(0)
    const items = [
        { label: 'Profile', icon: 'pi pi-fw pi-user' },
        { label: 'Admissions', icon: 'pi pi-fw pi-file' },
        { label: 'Appointments', icon: 'pi pi-fw pi-file' },
    ];
    const [doctorDetails, setDoctorDetails] = useState(null);
    const [admissions, setAdmissions] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [isPageLoading, setPageLoading] = useState(false);
    const [globalFilterAdmissionTableValue, setGlobalFilterAdmissionTableValue] = useState('');
    const [globalFilterAppointmentTableValue, setGlobalFilterAppointmentTableValue] = useState('');
    const [timezone, setTimezone] = useState(null);
    const router = useRouter();

    const [filtersAdmissionTable, setFiltersAdmissionTable] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [filtersAppointmentTable, setFiltersAppointmentTable] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const redirectPage = (value) => {
        router.push(value);
    };

    const renderAdmissionTableHeader = () => {
        return (
            <div className="flex justify-content-end align-items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterAdmissionTableValue} onChange={onAdmissionTableGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        )
    }

    const renderAppointmentTableHeader = () => {
        return (
            <div className="flex justify-content-end align-items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterAppointmentTableValue} onChange={onAppointmentTableGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        )
    }

    const onAdmissionTableGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filtersAdmissionTable };
        _filters['global'].value = value;

        setFiltersAdmissionTable(_filters);
        setGlobalFilterAdmissionTableValue(value);
    }

    const onAppointmentTableGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filtersAppointmentTable };
        _filters['global'].value = value;

        setFiltersAppointmentTable(_filters);
        setGlobalFilterAppointmentTableValue(value);
    }

    //Admission Table code column
    const codeItemTemplate = (rowData) => {
        return (
            <>
                <span className='text-primary-500 cursor-pointer' onClick={() => redirectPage(`/app/admissions/${rowData?.admission_id?.id}`)}>{`${rowData?.admission_id?.admission_code}`}</span>
            </>
        )
    }

    //Admission Table patient column
    const patientItemTemplate = (rowData) => {
        return (
            <>
                <span className='text-primary-500 cursor-pointer' onClick={() => redirectPage(`/app/patients/${rowData?.patient?.id}`)}>{`${rowData?.patient?.patient_code} - ${rowData?.patient?.first_name} ${rowData?.patient?.last_name}`}</span>
            </>
        )
    }

    //Admission Table admit date column
    const admitDateItemTemplate = (rowData) => {
        return (
            <>
                <span>{moment(rowData?.admission_id?.admit_date).tz(timezone).format('YYYY-MM-DD hh:mm:ss A')}</span>
            </>
        )
    }

    //Admission Table discharge date column
    const dischargeDateItemTemplate = (rowData) => {
        return (
            <>
                {rowData?.admission_id?.discharge_date &&
                    <span>{moment(rowData?.admission_id?.discharge_date).tz(timezone).format('YYYY-MM-DD hh:mm:ss A')}</span>
                }
            </>
        )
    }

    //Admission Table status column
    const admissionTablestatusColumnTemplate = (rowData) => {
        return (
            <>
                <Badge value={rowData.status == CONSTANTS.admission_active ? 'Admited' : 'Discharged'} severity={rowData.status == CONSTANTS.admission_active ? 'success' : 'warning'}></Badge>
            </>
        )
    }


    //Appointment Table admit date column
    const appointmentStartDateItemTemplate = (rowData) => {
        return (
            <>
                <span>{moment(rowData?.appointment_start_date).tz(timezone).format('YYYY-MM-DD hh:mm:ss A')}</span>
            </>
        )
    }

    //Appointment Table discharge date column
    const appointmentEndDateItemTemplate = (rowData) => {
        return (
            <>
                <span>{moment(rowData?.appointment_end_date).tz(timezone).format('YYYY-MM-DD hh:mm:ss A')}</span>
            </>
        )
    }

    //Appointment Table discharge date column
    const appointmentTablePatientColumnTemplate = (rowData) => {
        return (
            <>
                 <span className='text-primary-500 cursor-pointer' onClick={() => redirectPage(`/app/patients/${rowData?.patient_id?.id}`)}>{`${rowData?.patient_id?.patient_code} - ${rowData?.patient_id?.first_name} ${rowData?.patient_id?.last_name}`}</span>
            </>
        )
    }

    //Appointment Table status column
    const appointmentTablestatusColumnTemplate = (rowData) => {
        return (
            <>
                <Badge value={rowData.status == CONSTANTS.appointment_active ? 'Active' : 'Cancelled'} severity={rowData.status == CONSTANTS.appointment_active ? 'success' : 'warning'}></Badge>
            </>
        )
    }

    const admissionTablecolumns = [
        { field: 'admission_code', header: 'Code', sortable: true, body: codeItemTemplate, style: { minWidth: '8rem' } },
        { field: 'patient_id', header: 'Patient Name', sortable: true, body: patientItemTemplate, style: { minWidth: '14rem' } },
        { field: 'admit_date', header: 'Admit Date', sortable: false, body: admitDateItemTemplate, style: { minWidth: '10rem' } },
        { field: 'discharge_date', header: 'Discharge Date', sortable: false, body: dischargeDateItemTemplate, style: { minWidth: '10rem' } },
        { field: 'status', header: 'Status', sortable: false, body: admissionTablestatusColumnTemplate, style: { minWidth: '8rem' } },
    ];

    const appointmentTablecolumns = [
        { field: 'appointment_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
        { field: 'appointment_start_date', header: 'Start Time', sortable: true, body: appointmentStartDateItemTemplate, style: { minWidth: '14rem' } },
        { field: 'appointment_end_date', header: 'End Time', sortable: false, body: appointmentEndDateItemTemplate, style: { minWidth: '14rem' } },
        { field: 'patient_id', header: 'Patient', sortable: false, body: appointmentTablePatientColumnTemplate, style: { minWidth: '10rem' } },
        { field: 'status', header: 'Status', sortable: false, body: appointmentTablestatusColumnTemplate, style: { minWidth: '10rem' } },
    ];


    const admissionTableDynamicColumns = admissionTablecolumns.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
    });

    const appointmentTableDynamicColumns = appointmentTablecolumns.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
    });

    useEffect(() => {

        let timeZone = localStorage.getItem('timezone');
        if (timeZone) {
            setTimezone(timeZone);
        }

        const getDoctorDetails = async () => {
            if (router?.query?.id) {
                setPageLoading(true);
                let respond = await postRequest(apiPaths.GET_PROFILE, { id: router?.query?.id });
                if (respond.status) {
                    setDoctorDetails(respond.data.doctor);
                    setAdmissions(respond.data.admissions)
                    setAppointments(respond.data.appointments)
                }
                setPageLoading(false)
            }
        }

        getDoctorDetails();

    }, [router?.query?.id])


    return (
        <>
            {isPageLoading ?
                <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
                    <div className='flex align-items-center justify-content-center min-h-screen'>
                        <ProgressSpinner />
                    </div>
                </div>
                :
                <div className='surface-section surface-card shadow-2 border-round flex-auto xl:ml-5'>
                    <div className='surface-section px-5 pt-5'>
                        <TabMenu model={items} onTabChange={(e) => setactiveIndex(e.index)} activeIndex={activeIndex} />
                    </div>
                    <div className='surface-section px-5 py-5'>
                        <div className='flex align-items-start flex-column lg:flex-row lg:justify-content-between'>
                            <div className='flex align-items-start flex-column md:flex-row'>
                                <div className='relative'>
                                    <img src={doctorDetails?.image ? doctorDetails?.image : '/images/dummy.png'} className='mr-5 mb-3 lg:mb-0 border-circle bg-contain bg-no-repeat bg-center' style={{ width: '90px', height: '90px' }} />
                                </div>
                                <div>
                                    <span className='text-900 font-medium text-3xl'>{`${doctorDetails?.first_name} ${doctorDetails?.last_name}`}</span>
                                    <div className='flex align-items-center flex-wrap text-sm'>
                                        <div className='mr-5 mt-3'>
                                            <span className='font-semibold text-500'>
                                                <i className='pi pi-id-card mr-1'></i>
                                                DOC Code
                                            </span>
                                            <div className='text-700 mt-2 font-bold'>{doctorDetails?.doctor_code}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='px-6 py-5 surface-ground'>
                        {activeIndex == 0 ?
                            <div className='surface-card p-4 shadow-2 border-round'>
                                <div className='font-medium text-3xl text-900 mb-3'>Doctor Profile</div>
                                <div className='text-500 mb-5'>All details related to doctor are down below</div>
                                <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                        <div className='text-500 w-full md:w-3 font-medium'>DOC Code</div>
                                        <div className='text-900 w-full md:w-9'>{doctorDetails?.doctor_code}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                        <div className='text-500 w-full md:w-3 font-medium'>First Name</div>
                                        <div className='text-900 w-full md:w-9'>{doctorDetails?.first_name}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Last Name</div>
                                        <div className='text-900 w-full md:w-9'>{doctorDetails?.last_name}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Email</div>
                                        <div className='text-900 w-full md:w-9'>{doctorDetails?.email}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                        <div className='text-500 w-full md:w-3 font-medium'>NIC</div>
                                        <div className='text-900 w-full md:w-9'>{doctorDetails?.nic}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Mobile</div>
                                        <div className='text-900 w-full md:w-9'>{doctorDetails?.mobile}</div>
                                    </li>
                                </ul>
                            </div>
                            : activeIndex == 1 ?
                                <div className='surface-card p-4 shadow-2 border-round'>
                                    <div className='font-medium text-3xl text-900 mb-3'>
                                        Admissions
                                    </div>
                                    <div className='text-500 mb-5'>All admissions related details are down below</div>
                                    <DataTable value={admissions} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort filters={filtersAdmissionTable} header={renderAdmissionTableHeader}>
                                        {admissionTableDynamicColumns}
                                    </DataTable>
                                </div>
                                : activeIndex == 2 &&
                                <div className='surface-card p-4 shadow-2 border-round'>
                                    <div className='font-medium text-3xl text-900 mb-3'>
                                        Appointments
                                    </div>
                                    <div className='text-500 mb-5'>All appointments related details are down below</div>
                                    <DataTable value={appointments} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort filters={filtersAppointmentTable} header={renderAppointmentTableHeader}>
                                        {appointmentTableDynamicColumns}
                                    </DataTable>
                                </div>
                        }
                    </div>
                </div>
            }
        </>
    )
}

export default withAuth(Doctor)