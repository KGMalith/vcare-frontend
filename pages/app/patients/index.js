import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { useRouter } from 'next/router';
import { Avatar } from 'primereact/avatar';
import { getRequest, postRequest } from '../../../utils/axios';
import { apiPaths } from '../../../utils/api-paths';
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import * as yup from 'yup';
import { withAuth } from '../../../utils/withAuth';

const Patients = () => {
    const [patients, setPatients] = useState([]);
    const items = [
        {
            label: 'Options',
            items:
                [
                    {
                        label: 'View',
                        icon: 'pi pi-eye',
                        command: () => {
                            router.push('/app/patients/' + selectedRowData.id)
                        }
                    },
                ]
        },
    ];

    const [isPatientsTableLoading, setPatientsTableLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);
    const [showAddPatient, setShowAddPatient] = useState(false);
    const [addPatientLoading, setAddPatientLoading] = useState(false);
    const formRef = useRef();
    const menu = useRef(null);
    const router = useRouter();

    const schema = yup.object({
        first_name: yup.string().required('Required'),
        last_name: yup.string().required('Required'),
        email: yup.string().email('Invalid Email').required('Required'),
        nic: yup.string().required('Required')
    });

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const renderPatientsTableHeader = () => {
        return (
            <div className="flex justify-content-end align-items-center">
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
                </span>
            </div>
        )
    }

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };
        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    }

    //Patient Table Full Name
    const patientNameItemTemplate = (rowData) => {
        return (
            <div className='flex flex-row align-items-center'>
                {rowData.image ?
                    <Avatar image={rowData.image} className="mr-2" size="large" shape="circle" />
                    :
                    <Avatar icon="pi pi-user" className="mr-2" size="large" shape="circle" />
                }
                <span>{`${rowData.first_name} ${rowData.last_name}`}</span>
            </div>
        );
    }

    //Patient Table Action
    const actionButtonTemplate = (rowData) => {
        return (
            <>
                <Menu model={items} popup ref={menu} id="popup_menu" />
                <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
            </>
        )
    }

    const patientsTablecolumns = [
        { field: 'patient_code', header: 'Code', sortable: true, style: { minWidth: '12rem' } },
        { field: 'full_name', header: 'Name', sortable: true, body: patientNameItemTemplate, style: { minWidth: '20rem' } },
        { field: 'email', header: 'Email', sortable: false, style: { minWidth: '28rem' } },
        { field: 'mobile', header: 'Mobile', sortable: false, style: { minWidth: '10rem' } },
        { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
    ];

    const patientsTableDynamicColumns = patientsTablecolumns.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
    });

    const renderHeader = () => {
        return (
            <div className='flex flex-column gap-2'>
                <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Patient</h1>
                <span className='text-600 text-base font-normal'>Create patient</span>
            </div>
        );
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddPatient(false)} className="p-button-text" />
                <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} loading={addPatientLoading} />
            </div>
        );
    }

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const onSubmitPatient = async (values) => {
        setAddPatientLoading(true);
        let respond = await postRequest(apiPaths.ADD_PATIENT, values);
        if (respond.status) {
            getAllPatients();
            setShowAddPatient(false);
        }
        setAddPatientLoading(false);
    }

    const getAllPatients = async () => {
        setPatientsTableLoading(true)
        let respond = await getRequest(apiPaths.GET_ALL_PATIENTS);
        if (respond.status) {
            setPatients(respond.data);
        }
        setPatientsTableLoading(false)
    }

    useEffect(() => {
        getAllPatients();
    }, [])

    return (
        <>
            <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
                <div className='border-bottom-1 surface-border'>
                    <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
                        Patients
                    </h2>
                    <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your patients in this page</p>
                </div>
                <div className='grid py-6 surface-border'>
                    <div className='col-12'>
                        <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
                            Patients
                        </h3>
                        <p className='mb-4 mt-0 text-700 font-normal text-base'>Manage Patients in your organization</p>
                        <Button label="Add a patient" className='w-auto' onClick={() => setShowAddPatient(true)} />
                    </div>
                    <div className='col-12'>
                        <DataTable value={patients} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isPatientsTableLoading} filters={filters} header={renderPatientsTableHeader}>
                            {patientsTableDynamicColumns}
                        </DataTable>
                    </div>
                </div>
            </div>

            {/* Add Patient Modal */}
            <Dialog header={renderHeader} visible={showAddPatient} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddPatient(false)}>
                <Formik
                    innerRef={formRef}
                    validationSchema={schema}
                    onSubmit={(values) => onSubmitPatient(values)}
                    initialValues={{
                        first_name: '',
                        last_name: '',
                        email: '',
                        nic:''
                    }}>
                    {({
                        errors,
                        handleChange,
                        submitCount,
                        values
                    }) => (
                        <form noValidate>
                            <div>
                                <label htmlFor="first_name" className="block text-900 font-medium mb-2">First Name</label>
                                <div className="p-input-icon-left w-full">
                                    <i className="pi pi-user" />
                                    <InputText id="first_name" value={values.first_name} name='first_name' type="text" placeholder="First Name" className={submitCount > 0 && errors.first_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="first_name_error" onChange={handleChange} />
                                </div>
                                {submitCount > 0 && errors.first_name &&
                                    <small id="first_name_error" className="p-error">
                                        {errors.first_name}
                                    </small>
                                }
                            </div>
                            <div className="mt-3">
                                <label htmlFor="last_name" className="block text-900 font-medium mb-2">Last Name</label>
                                <div className="p-input-icon-left w-full">
                                    <i className="pi pi-user" />
                                    <InputText id="last_name" value={values.last_name} name='last_name' type="text" placeholder="Last Name" className={submitCount > 0 && errors.last_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="last_name_error" onChange={handleChange} />
                                </div>
                                {submitCount > 0 && errors.last_name &&
                                    <small id="last_name_error" className="p-error">
                                        {errors.last_name}
                                    </small>
                                }
                            </div>
                            <div className="mt-3">
                                <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
                                <div className="p-input-icon-left w-full">
                                    <i className="pi pi-envelope" />
                                    <InputText id="email" value={values.email} name='email' type="text" placeholder="Email" className={submitCount > 0 && errors.email ? 'p-invalid w-full' : 'w-full'} aria-describedby="email_error" onChange={handleChange} />
                                </div>
                                {submitCount > 0 && errors.email &&
                                    <small id="email_error" className="p-error">
                                        {errors.email}
                                    </small>
                                }
                            </div>
                            <div className="mt-3">
                                <label htmlFor="nic" className="block text-900 font-medium mb-2">NIC</label>
                                <div className="p-input-icon-left w-full">
                                    <i className="pi pi-user" />
                                    <InputText id="nic" value={values.nic} name='nic' type="text" placeholder="NIC" className={submitCount > 0 && errors.nic ? 'p-invalid w-full' : 'w-full'} aria-describedby="nic_error" onChange={handleChange} />
                                </div>
                                {submitCount > 0 && errors.nic &&
                                    <small id="nic_error" className="p-error">
                                        {errors.nic}
                                    </small>
                                }
                            </div>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </>
    )
}

export default withAuth(Patients)