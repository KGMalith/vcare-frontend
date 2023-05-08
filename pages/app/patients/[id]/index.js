import React, { useEffect, useState, useRef } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Tooltip } from 'primereact/tooltip';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { FilterMatchMode } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Formik } from 'formik';
import * as yup from 'yup';

const Patient = () => {
    const [activeIndex, setactiveIndex] = useState(0);
    const [showUploadDocument, setShowUploadDocument] = useState(false);
    const [showCreateEmegencyContact, setShowCreateEmegencyContact] = useState(false);
    const [totalSize, setTotalSize] = useState(0);
    const formRef = useRef();
    const emergencyContactformRef = useRef();
    const fileUploadRef = useRef(null);
    const items = [
        { label: 'Profile', icon: 'pi pi-fw pi-user' },
        { label: 'Documents', icon: 'pi pi-fw pi-file' },
        { label: 'Contacts', icon: 'pi pi-fw pi-phone' },
        { label: 'Admissions', icon: 'pi pi-fw pi-file' },
        { label: 'Appointments', icon: 'pi pi-fw pi-file' },
    ];
    const [admissions, setAdmissions] = useState([
        {
            id: 1,
            doctor_code: 'test',
            full_name: 'teasahs jaskjak',
            email: 'test@gmail.com',
            image: '',
            mobile: '13378271',
        },
        {
            id: 2,
            doctor_code: 'tes2',
            full_name: 'teasahs jaskjak',
            email: 'test2@gmail.com',
            image: '',
            mobile: '0192192912',
        },
    ]);
    const [appointments, setAppointments] = useState([
        {
            id: 1,
            doctor_code: 'test',
            full_name: 'teasahs jaskjak',
            email: 'test@gmail.com',
            image: '',
            mobile: '13378271',
        },
        {
            id: 2,
            doctor_code: 'tes2',
            full_name: 'teasahs jaskjak',
            email: 'test2@gmail.com',
            image: '',
            mobile: '0192192912',
        },
    ]);
    const [isAdmissionTableLoading, setAdmissionTableLoading] = useState(false);
    const [isAppointmentTableLoading, setAppointmentTableLoading] = useState(false);
    const [globalFilterAdmissionTableValue, setGlobalFilterAdmissionTableValue] = useState('');
    const [globalFilterAppointmentTableValue, setGlobalFilterAppointmentTableValue] = useState('');

    const [filtersAdmissionTable, setFiltersAdmissionTable] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });
    const [filtersAppointmentTable, setFiltersAppointmentTable] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const emegencyContactSchema = yup.object({
        name: yup.string().required('Required'),
        mobile: yup.string().required('Required'),
        relationship: yup.string().required('Required'),
    });

    const addDocumentHeaderRender = () => {
        return (
            <div className='flex flex-column gap-2'>
                <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Document</h1>
                <span className='text-600 text-base font-normal'>Upload employee specific documents</span>
            </div>
        );
    }

    const addEmegencyContactHeaderRender = () => {
        return (
            <div className='flex flex-column gap-2'>
                <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Emegency Contact</h1>
                <span className='text-600 text-base font-normal'>Add employee emegency contact details</span>
            </div>
        );
    }

    const addDocumentFooterRender = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setShowUploadDocument(false)} className="p-button-text" />
                <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} />
            </div>
        );
    }

    const addEmegencyContactFooterRender = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setShowCreateEmegencyContact(false)} className="p-button-text" />
                <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmitEmegencyContact} />
            </div>
        );
    }

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach(file => {
            _totalSize += (file.size || 0);
        });
        console.log('======== on upload =========', e);

        setTotalSize(_totalSize);
        // toast.current.show({severity: 'info', summary: 'Success', detail: 'File Uploaded'});
    }

    const onTemplateSelect = (e) => {
        let _totalSize = totalSize;
        console.log('========e=========', e)
        Array.from(e.files).forEach(file => {
            _totalSize += file.size;
        });

        setTotalSize(_totalSize);
    }

    const onTemplateClear = () => {
        setTotalSize(0);
    }

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const handleSubmitEmegencyContact = () => {
        if (emergencyContactformRef.current) {
            emergencyContactformRef.current.handleSubmit();
        }
    };

    const onSubmitDocument = async (values) => {
        console.log(values)
    }

    const onSubmitEmegencyContact = async (values) => {
        console.log(values)
    }

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 1 MB`} style={{ width: '300px', height: '20px', marginLeft: 'auto' }}></ProgressBar>
            </div>
        );
    }

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{ width: '40%' }}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{ 'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ 'fontSize': '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">Drag and Drop Image Here</span>
            </div>
        )
    }

    const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };


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

    //Admission Table patient column
    const patientItemTemplate = (rowData) => {
        return (
            <>
                <span>{`${rowData.patient_code} - ${rowData.first_name} ${rowData.last_name}`}</span>
            </>
        )
    }

    //Admission Table admit date column
    const admitDateItemTemplate = (rowData) => {
        return (
            <>
                <span></span>
            </>
        )
    }

    //Admission Table discharge date column
    const dischargeDateItemTemplate = (rowData) => {
        return (
            <>
                <span></span>
            </>
        )
    }

    //Admission Table patient date column
    const admissionTablePatientColumnTemplate = (rowData) => {
        return (
            <>
                <span></span>
            </>
        )
    }

    //Admission Table room column
    const admissionTableRoomColumnTemplate = (rowData) => {
        return (
            <>
                <span></span>
            </>
        )
    }

    //Admission Table status column
    const admissionTablestatusColumnTemplate = (rowData) => {
        return (
            <>
                <Badge value={rowData.status == 1 ? 'Admited' : 'Discharged'} severity={rowData.status == 1 ? 'success' : 'warning'}></Badge>
            </>
        )
    }


    //Appointment Table admit date column
    const appointmentStartDateItemTemplate = (rowData) => {
        return (
            <>
                <span></span>
            </>
        )
    }

    //Appointment Table discharge date column
    const appointmentEndDateItemTemplate = (rowData) => {
        return (
            <>
                <span></span>
            </>
        )
    }

    //Appointment Table discharge date column
    const appointmentTablePatientColumnTemplate = (rowData) => {
        return (
            <>
                <span></span>
            </>
        )
    }

    //Appointment Table status column
    const appointmentTablestatusColumnTemplate = (rowData) => {
        return (
            <>
                <Badge value={rowData.status == 1 ? 'Active' : 'Cancelled'} severity={rowData.status == 1 ? 'success' : 'warning'}></Badge>
            </>
        )
    }

    const admissionTablecolumns = [
        { field: 'admission_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
        { field: 'patient_code', header: 'Patient Name', sortable: true, body: patientItemTemplate, style: { minWidth: '14rem' } },
        { field: 'admit_date', header: 'Admit Date', sortable: false, body: admitDateItemTemplate, style: { minWidth: '10rem' } },
        { field: 'discharge_date', header: 'Discharge Date', sortable: false, body: dischargeDateItemTemplate, style: { minWidth: '10rem' } },
        { field: 'hospital_room', header: 'Mobile', sortable: false, body: admissionTableRoomColumnTemplate, style: { minWidth: '10rem' } },
        { field: 'patient_id', header: 'Patient', sortable: false, body: admissionTablePatientColumnTemplate, style: { minWidth: '10rem' } },
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

    return (
        <>
            <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

            <div className='surface-section surface-card shadow-2 border-round flex-auto xl:ml-5'>
                <div className='surface-section px-5 pt-5'>
                    <TabMenu model={items} onTabChange={(e) => setactiveIndex(e.index)} activeIndex={activeIndex} />
                </div>
                <div className='surface-section px-5 py-5'>
                    <div className='flex align-items-start flex-column lg:flex-row lg:justify-content-between'>
                        <div className='flex align-items-start flex-column md:flex-row'>
                            <div className='relative'>
                                <img src='/images/dummy.png' className='mr-5 mb-3 lg:mb-0 border-circle bg-contain bg-no-repeat bg-center' style={{ width: '90px', height: '90px' }} />
                                <Button icon="pi pi-pencil" className="p-button-rounded bottom-0 absolute h-2rem w-2rem" style={{ right: 25 }} />
                            </div>
                            <div>
                                <span className='text-900 font-medium text-3xl'>Kathryn Murphy</span>
                                <div className='flex align-items-center flex-wrap text-sm'>
                                    <div className='mr-5 mt-3'>
                                        <span className='font-semibold text-500'>
                                            <i className='pi pi-id-card mr-1'></i>
                                            Patient Code
                                        </span>
                                        <div className='text-700 mt-2 font-bold'>test</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-6 py-5 surface-ground'>
                    {activeIndex == 0 ?
                        <div className='surface-card p-4 shadow-2 border-round'>
                            <div className='font-medium text-3xl text-900 mb-3'>Patient Profile</div>
                            <div className='text-500 mb-5'>All details related to patient are down below</div>
                            <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>EMP Code</div>
                                    <div className='text-900 w-full md:w-9'>EMP-001</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>First Name</div>
                                    <div className='text-900 w-full md:w-9'>Kathryn</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Last Name</div>
                                    <div className='text-900 w-full md:w-9'>Murphy</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Email</div>
                                    <div className='text-900 w-full md:w-9'>KathrynMurphy@gmail.com</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>NIC</div>
                                    <div className='text-900 w-full md:w-9'>67335546V</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Birthday</div>
                                    <div className='text-900 w-full md:w-9'>1967-07-20</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Mobile</div>
                                    <div className='text-900 w-full md:w-9'>07766316716</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Hire Date</div>
                                    <div className='text-900 w-full md:w-9'>2020-07-20</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>End Date</div>
                                    <div className='text-900 w-full md:w-9'></div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Employment Type</div>
                                    <div className='text-900 w-full md:w-9'>Full-Time</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Designation</div>
                                    <div className='text-900 w-full md:w-9'>Nurse</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Is Member Account Linked?</div>
                                    <div className='text-900 w-full md:w-9'>
                                        <Badge value="Yes" severity="success"></Badge>
                                        {/* <Badge value="No" severity="warning"></Badge> */}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        : activeIndex == 1 ?
                            <div className='surface-card p-4 shadow-2 border-round'>
                                <div className='font-medium text-3xl text-900 mb-3'>
                                    Patient Documents
                                    <Button icon="pi pi-upload" label="Add Document" style={{ float: 'right' }} onClick={() => setShowUploadDocument(true)} />
                                </div>
                                <div className='text-500 mb-5'>All documents related to patient are down below</div>
                                <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground gap-3 md:gap-0'>
                                        <div className='text-500 w-full md:w-3 font-medium'>EMP Code</div>
                                        <div className='text-900 w-full md:w-5'>EMP-001</div>
                                        <div className='text-900 w-full md:w-4 flex gap-3 justify-content-end'>
                                            <Button icon="pi pi-download" label="Download" className='p-button-outlined' />
                                            <Button icon="pi pi-trash" label="Delete" className='p-button-outlined p-button-danger' />
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            : activeIndex == 2 ?
                                <div className='surface-card p-4 shadow-2 border-round'>
                                    <div className='font-medium text-3xl text-900 mb-3'>
                                        Patient Emergency Contact
                                        <Button icon="pi pi-phone" label="Add Emergency Contact" style={{ float: 'right' }} onClick={() => setShowCreateEmegencyContact(true)} />
                                    </div>
                                    <div className='text-500 mb-5'>All emergency contacts related to patient are down below</div>
                                    <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                        <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground gap-3 md:gap-0'>
                                            <div className='text-500 font-semibold w-full md:w-3'>Father</div>
                                            <div className=' w-full md:w-7'>
                                                <p className='text-900 mb-0'>Agjask kals</p>
                                                <p className='text-500'>0766788776</p>
                                            </div>
                                            <div className='text-900 w-full md:w-2 flex gap-3 justify-content-end'>
                                                <Button icon="pi pi-trash" label="Delete" className='p-button-outlined p-button-danger' />
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                                : activeIndex == 3 ?
                                    <div className='surface-card p-4 shadow-2 border-round'>
                                        <div className='font-medium text-3xl text-900 mb-3'>
                                            Admissions
                                        </div>
                                        <div className='text-500 mb-5'>All admissions related details are down below</div>
                                        <DataTable value={admissions} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isAdmissionTableLoading} filters={filtersAdmissionTable} header={renderAdmissionTableHeader}>
                                            {admissionTableDynamicColumns}
                                        </DataTable>
                                    </div>
                                    : activeIndex == 4 &&
                                    <div className='surface-card p-4 shadow-2 border-round'>
                                        <div className='font-medium text-3xl text-900 mb-3'>
                                            Appointments
                                        </div>
                                        <div className='text-500 mb-5'>All appointments related details are down below</div>
                                        <DataTable value={appointments} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isAppointmentTableLoading} filters={filtersAppointmentTable} header={renderAppointmentTableHeader}>
                                            {appointmentTableDynamicColumns}
                                        </DataTable>
                                    </div>
                    }
                </div>
            </div>

            {/* Add document modal */}
            <Dialog header={addDocumentHeaderRender} visible={showUploadDocument} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={addDocumentFooterRender} onHide={() => setShowUploadDocument(false)}>
                <Formik
                    innerRef={formRef}
                    // validationSchema={schema}
                    onSubmit={(values) => onSubmitDocument(values)}
                    initialValues={{
                        document_name: '',
                        document_desc: '',
                        document_URL: '',
                    }}>
                    {({
                        errors,
                        handleChange,
                        setFieldValue,
                        handleSubmit,
                        submitCount,
                        values
                    }) => (
                        <form noValidate>
                            <div>
                                <label htmlFor="document_name" className="block text-900 font-medium mb-2">Document Name</label>
                                <div className="p-input-icon-left w-full">
                                    <i className="pi pi-file" />
                                    <InputText id="document_name" value={values.document_name} name='document_name' type="text" placeholder="Document Name" className={submitCount > 0 && errors.document_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="document_name_error" onChange={handleChange} />
                                </div>
                                {submitCount > 0 && errors.document_name &&
                                    <small id="document_name_error" className="p-error">
                                        {errors.document_name}
                                    </small>
                                }
                            </div>
                            <div className="mt-3">
                                <label htmlFor="document_desc" className="block text-900 font-medium mb-2">Document Description</label>
                                <InputTextarea id="document_desc" value={values.document_desc} name='document_desc' placeholder="Document Description" className={submitCount > 0 && errors.document_desc ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="document_desc_error" />
                                {submitCount > 0 && errors.document_desc &&
                                    <small id="document_desc_error" className="p-error">
                                        {errors.document_desc}
                                    </small>
                                }
                            </div>
                            <div className='mt-3'>
                                <FileUpload ref={fileUploadRef} name="files" url="" accept="application/pdf" maxFileSize={1000000}
                                    onUpload={onTemplateUpload} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                                    headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                            </div>
                        </form>
                    )}
                </Formik>
            </Dialog>

            {/* Add Emegency contact modal */}
            <Dialog header={addEmegencyContactHeaderRender} visible={showCreateEmegencyContact} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={addEmegencyContactFooterRender} onHide={() => setShowCreateEmegencyContact(false)}>
                <Formik
                    innerRef={emergencyContactformRef}
                    validationSchema={emegencyContactSchema}
                    onSubmit={(values) => onSubmitEmegencyContact(values)}
                    initialValues={{
                        name: '',
                        mobile: '',
                        relationship: '',
                    }}>
                    {({
                        errors,
                        handleChange,
                        setFieldValue,
                        handleSubmit,
                        submitCount,
                        values
                    }) => (
                        <form noValidate>
                            <div>
                                <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
                                <div className="p-input-icon-left w-full">
                                    <i className="pi pi-user" />
                                    <InputText id="name" value={values.name} name='name' type="text" placeholder="Name" className={submitCount > 0 && errors.name ? 'p-invalid w-full' : 'w-full'} aria-describedby="name_error" onChange={handleChange} />
                                </div>
                                {submitCount > 0 && errors.name &&
                                    <small id="name_error" className="p-error">
                                        {errors.name}
                                    </small>
                                }
                            </div>
                            <div className="mt-3">
                                <label htmlFor="mobile" className="block text-900 font-medium mb-2">Mobile</label>
                                <div className="p-input-icon-left w-full">
                                    <i className="pi pi-mobile" />
                                    <InputMask id="mobile" mask="(999) 999-9999" value={values.mobile} name='mobile' placeholder="(999) 999-9999" className={submitCount > 0 && errors.mobile ? 'p-invalid w-full' : 'w-full'} aria-describedby="mobile_error" onChange={handleChange}></InputMask>
                                </div>
                                {submitCount > 0 && errors.mobile &&
                                    <small id="mobile_error" className="p-error">
                                        {errors.mobile}
                                    </small>
                                }
                            </div>
                            <div className="mt-3">
                                <label htmlFor="relationship" className="block text-900 font-medium mb-2">Relationship</label>
                                <div className="p-input-icon-left w-full">
                                    <i className="pi pi-link" />
                                    <InputText id="relationship" value={values.relationship} name='relationship' type="text" placeholder="Relationship" className={submitCount > 0 && errors.relationship ? 'p-invalid w-full' : 'w-full'} aria-describedby="relationship_error" onChange={handleChange} />
                                </div>
                                {submitCount > 0 && errors.relationship &&
                                    <small id="relationship_error" className="p-error">
                                        {errors.relationship}
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

export default Patient