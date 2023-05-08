import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/router';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dropdown } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { Calendar } from 'primereact/calendar';
import { Avatar } from 'primereact/avatar';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getRequest, postRequest } from '../../../utils/axios';
import { apiPaths } from '../../../utils/api-paths';
import moment from 'moment';
import 'moment-timezone';
import { CONSTANTS } from '../../../utils/constants';

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);

  const items = [
    {
      label: 'Options',
      items:
        [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => {
              router.push('/app/appointments/' + selectedRowData.id)
            }
          },
        ]
    },
  ];

  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [isAppointmentTableLoading, setAppointmentTableLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showAddAppointment, setShowAddAppointment] = useState(false);
  const [isAddAppointmentLoading, setAddAppointmentLoading] = useState(false);
  const [timeZone, setTimezone] = useState(null);
  const formRef = useRef();
  const menu = useRef(null);
  const router = useRouter();

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const schema = yup.object({
    patient_id: yup.object().required('Required'),
    doctor_id: yup.object().required('Required'),
    appointment_date: yup.string().required('Required'),
  });

  const renderAppointmentsTableHeader = () => {
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

  //Appointment Table admit date column
  const appointmentStartDateItemTemplate = (rowData) => {
    return (
      <>
        <span>{moment(rowData?.appointment_start_date)?.tz(timeZone)?.format('YYYY-MM-DD hh:mm:ss A')}</span>
      </>
    )
  }

  //Appointment Table discharge date column
  const appointmentEndDateItemTemplate = (rowData) => {
    return (
      <>
        <span>{moment(rowData?.appointment_end_date)?.tz(timeZone)?.format('YYYY-MM-DD hh:mm:ss A')}</span>
      </>
    )
  }

  //Appointment Table discharge date column
  const appointmentTablePatientColumnTemplate = (rowData) => {
    return (
      <>
        <div className='flex flex-row align-items-center'>
          {rowData.patient_id.image ?
            <Avatar image={rowData.patient_id.image} className="mr-2" size="large" shape="circle" />
            :
            <Avatar icon="pi pi-user" className="mr-2" size="large" shape="circle" />
          }
          <span>{rowData.patient_id.patient_code+' - '+rowData.patient_id.first_name+' '+rowData.patient_id.last_name}</span>
        </div>
      </>
    )
  }

  //Appointment Table status column
  const appointmentTablestatusColumnTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.status == CONSTANTS.appointment_active ? 'Active' : 'Cancelled'} severity={rowData.status == CONSTANTS.appointment_active ? 'success' : 'danger'}></Badge>
      </>
    )
  }

  //Appointment Table Action
  const actionButtonTemplate = (rowData) => {
    return (
      <>
        <Menu model={items} popup ref={menu} id="popup_menu" />
        <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
      </>
    )
  }

  const appointmentsTablecolumns = [
    { field: 'appointment_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
    { field: 'appointment_start_date', header: 'Start Time', sortable: true, body: appointmentStartDateItemTemplate, style: { minWidth: '18rem' } },
    { field: 'appointment_end_date', header: 'End Time', sortable: false, body: appointmentEndDateItemTemplate, style: { minWidth: '18rem' } },
    { field: 'patient_id', header: 'Patient', sortable: false, body: appointmentTablePatientColumnTemplate, style: { minWidth: '25rem' } },
    { field: 'status', header: 'Status', sortable: false, body: appointmentTablestatusColumnTemplate, style: { minWidth: '10rem' } },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const appointmentsTableDynamicColumns = appointmentsTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
  });

  const patientOptionTemplate = (option) => {
    return (
      <div className='flex-row align-items-center'>
        {option.image ?
          <Avatar image={option.image} className="mr-2" shape="circle" />
          :
          <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
        }
        <span>{option.patient_code + ' - ' + option.first_name + ' ' + option.last_name}</span>
      </div>
    );
  }

  const doctorOptionTemplate = (option) => {
    return (
      <div className='flex-row align-items-center'>
        {option.image ?
          <Avatar image={option.image} className="mr-2" shape="circle" />
          :
          <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
        }
        <span>{option.doctor_code + ' - ' + option.first_name + ' ' + option.last_name}</span>
      </div>
    );
  }

  const selectedPatientTemplate = (option, props) => {
    if (option) {
      return (
        <div className='flex-row align-items-center'>
          {option.image ?
            <Avatar image={option.image} className="mr-2" shape="circle" />
            :
            <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
          }
          <span>{option.patient_code + ' - ' + option.first_name + ' ' + option.last_name}</span>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
  }

  const selectedDoctorTemplate = (option, props) => {
    if (option) {
      return (
        <div className='flex-row align-items-center'>
          {option.image ?
            <Avatar image={option.image} className="mr-2" shape="circle" />
            :
            <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
          }
          <span>{option.doctor_code + ' - ' + option.first_name + ' ' + option.last_name}</span>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
  }

  const renderHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Appointment</h1>
        <span className='text-600 text-base font-normal'>Create appointment on behalf of patient</span>
      </div>
    );
  }

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddAppointment(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} loading={isAddAppointmentLoading} />
      </div>
    );
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const onSubmitAppointment = async (values) => {
    setAddAppointmentLoading(true)
    let respond = await postRequest(apiPaths.ADD_APPOINTMENT, { ...values, doctor_id: values.doctor_id.id, patient_id: values.patient_id.id });
    if (respond.status) {
      setShowAddAppointment(false);
      getAllData();
    }
    setAddAppointmentLoading(false)
  }

  const getAllData = async () => {
    setAppointmentTableLoading(true)
    let respond = await getRequest(apiPaths.GET_ALL_APPOINTMENTS);
    if (respond.status) {
      setAppointments(respond.data);
    }
    setAppointmentTableLoading(false)
  }

  useEffect(() => {
    const getDoctors = async () => {
      let respond = await getRequest(apiPaths.GET_ALL_DOCTORS);
      if (respond.status) {
        setDoctors(respond.data);
      }
    }
    const getPatients = async () => {
      let respond = await getRequest(apiPaths.GET_ALL_PATIENTS);
      if (respond.status) {
        setPatients(respond.data);
      }
    }

    let timeZone = localStorage.getItem('timezone');
    if (timeZone) {
      setTimezone(timeZone);
    }

    getAllData();
    getDoctors();
    getPatients();
  }, [])


  return (
    <>
      <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
        <div className='border-bottom-1 surface-border'>
          <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
            Appointments
          </h2>
          <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your appointments in this page</p>
        </div>
        <div className='grid py-6 surface-border'>
          <div className='col-12'>
            <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
              Appointments
            </h3>
            <p className='mb-4 mt-0 text-700 font-normal text-base'>View all appointments in your organization</p>
            <Button label="Create Appointment" className='w-auto' onClick={() => setShowAddAppointment(true)} />
          </div>
          <div className='col-12'>
            <DataTable value={appointments} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isAppointmentTableLoading} filters={filters} header={renderAppointmentsTableHeader}>
              {appointmentsTableDynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>

      {/* Add Appointment Modal */}
      <Dialog header={renderHeader} visible={showAddAppointment} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddAppointment(false)}>
        <Formik
          innerRef={formRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitAppointment(values)}
          initialValues={{
            appointment_date: null,
            patient_id: null,
            doctor_id: null,
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
                <label htmlFor="appointment_date" className="block text-900 font-medium mb-2">Appointment Date</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-briefcase" />
                  <Calendar id="appointment_date" value={values.appointment_date} name='appointment_date' className={submitCount > 0 && errors.appointment_date ? 'p-invalid w-full' : 'w-full'} aria-describedby="appointment_date_error" onChange={handleChange} showTime showSeconds hourFormat="12" dateFormat="yy-mm-dd" />
                </div>
                {submitCount > 0 && errors.appointment_date &&
                  <small id="appointment_date_error" className="p-error">
                    {errors.appointment_date}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="patient_id" className="block text-900 font-medium mb-2">Patient</label>
                <Dropdown id="patient_id" value={values.patient_id} name='patient_id' className={submitCount > 0 && errors.patient_id ? 'p-invalid w-full' : 'w-full'} options={patients} onChange={handleChange} filter showClear optionLabel="full_name" filterBy="full_name" placeholder="Select a Patient"
                  valueTemplate={selectedPatientTemplate} itemTemplate={patientOptionTemplate} aria-describedby="patient_id_error" />
                {submitCount > 0 && errors.patient_id &&
                  <small id="patient_id_error" className="p-error">
                    {errors.patient_id}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="doctor_id" className="block text-900 font-medium mb-2">Doctor</label>
                <Dropdown id="doctor_id" value={values.doctor_id} name='doctor_id' className={submitCount > 0 && errors.doctor_id ? 'p-invalid w-full' : 'w-full'} options={doctors} onChange={handleChange} filter showClear optionLabel="full_name" filterBy="full_name" placeholder="Select a Doctor"
                  valueTemplate={selectedDoctorTemplate} itemTemplate={doctorOptionTemplate} aria-describedby="doctor_id_error" />
                {submitCount > 0 && errors.doctor_id &&
                  <small id="doctor_id_error" className="p-error">
                    {errors.doctor_id}
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

export default Appointments