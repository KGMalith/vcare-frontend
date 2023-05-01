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
import { ListBox } from 'primereact/listbox';
import { Formik } from 'formik';
import * as yup from 'yup';

const Admissions = () => {
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

  const items = [
    {
      label: 'Options',
      items:
        [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => {
              router.push('/app/admissions/' + selectedRowData.id)
            }
          },
        ]
    },
  ];

  const [members, setMembers] = useState([
    {
      id: 1,
      user_code: 'test',
      full_name: 'teasahs jaskjak',
      image: '',
    },
    {
      id: 2,
      user_code: 'test2',
      full_name: 'teasahs jaskjak',
      image: '',
    },
  ]);

  const [doctorsList, setDoctorsList] = useState([
    { label: 'Australia', value: 'AU', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'Brazil', value: 'BR', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'China', value: 'CN', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'Egypt', value: 'EG', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'France', value: 'FR', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'Germany', value: 'DE', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'India', value: 'IN', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'Japan', value: 'JP', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'Spain', value: 'ES', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' },
    { label: 'United States', value: 'US', desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks' }
  ]);

  const [isAdmissionTableLoading, setAdmissionTableLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showAddAdmission, setShowAddAdmission] = useState(false);
  const formRef = useRef();
  const menu = useRef(null);
  const router = useRouter();

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const schema = yup.object({
    patient_id: yup.number().required('Required'),
    admit_date: yup.string().required('Required'),
    doctors: yup.array(yup.number().required('Required')),
    room_id: yup.number().required('Required'),
  });

  const renderAdmissionsTableHeader = () => {
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

  //Admission Table hospital room column
  const roomItemTemplate = (rowData) => {
    return (
      <>
        <span></span>
      </>
    )
  }

  //Admission Table patient column
  const patientItemTemplate = (rowData) => {
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
        <Badge value={rowData.status == 1 ? 'Active' : 'Cancelled'} severity={rowData.status == 1 ? 'success' : 'warning'}></Badge>
      </>
    )
  }

  //Admission Table Action
  const actionButtonTemplate = (rowData) => {
    return (
      <>
        <Menu model={items} popup ref={menu} id="popup_menu" />
        <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
      </>
    )
  }


  const admissionsTablecolumns = [
    { field: 'admission_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
    { field: 'admit_date', header: 'Admit Date', sortable: true, body: admitDateItemTemplate, style: { minWidth: '14rem' } },
    { field: 'discharge_date', header: 'Discharge Date', sortable: false, body: dischargeDateItemTemplate, style: { minWidth: '14rem' } },
    { field: 'hospital_room', header: 'Room', sortable: false, body: roomItemTemplate, style: { minWidth: '10rem' } },
    { field: 'patient_id', header: 'Patient', sortable: false, body: patientItemTemplate, style: { minWidth: '10rem' } },
    { field: 'status', header: 'Status', sortable: false, body: admissionTablestatusColumnTemplate, style: { minWidth: '10rem' } },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const admissionsTableDynamicColumns = admissionsTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
  });

  const renderHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Admission</h1>
        <span className='text-600 text-base font-normal'>Create admission on behalf of patient</span>
      </div>
    );
  }

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddAdmission(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} />
      </div>
    );
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const onSubmitAdmission = (values) =>{

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
          <span>{option.user_code + ' - ' + option.full_name}</span>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
  }

  const selectedRoomTemplate = (option, props) => {
    if (option) {
      return (
        <div className='flex-row align-items-center'>
          <span>{option.user_code + ' - ' + option.full_name}</span>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
  }

  const patientOptionTemplate = (option) => {
    return (
      <div className='flex-row align-items-center'>
        {option.image ?
          <Avatar image={option.image} className="mr-2" shape="circle" />
          :
          <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
        }
        <span>{option.user_code + ' - ' + option.full_name}</span>
      </div>
    );
  }

  const roomOptionTemplate = (option) => {
    return (
      <div className='flex-row align-items-center'>
        <span>{option.user_code + ' - ' + option.full_name}</span>
      </div>
    );
  }

  const doctorTemplate = (option) => {
    return (
      <div className="country-item">
        <span className='font-bold text-lg'>
          <i className="pi pi-unlock mr-2" />
          {option.label}
        </span>
        <p className='font-normal text-400'>{option.desc}</p>
      </div>
    );
  }



  return (
    <>
      <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
        <div className='border-bottom-1 surface-border'>
          <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
            Admissions
          </h2>
          <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your admissions in this page</p>
        </div>
        <div className='grid py-6 surface-border'>
          <div className='col-12'>
            <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
              Admissions
            </h3>
            <p className='mb-4 mt-0 text-700 font-normal text-base'>Add/Edit all admissions in your organization</p>
            <Button label="Create Admission" className='w-auto' onClick={() => setShowAddAdmission(true)} />
          </div>
          <div className='col-12'>
            <DataTable value={admissions} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" emptyMessage="No roles found." rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isAdmissionTableLoading} filters={filters} header={renderAdmissionsTableHeader}>
              {admissionsTableDynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>

      {/* Add Admission Modal */}
      <Dialog header={renderHeader} visible={showAddAdmission} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddAdmission(false)}>
        <Formik
          innerRef={formRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitAdmission(values)}
          initialValues={{
            patient_id: null,
            admit_date: null,
            doctors: [],
            room_id:null,
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
                <label htmlFor="admit_date" className="block text-900 font-medium mb-2">Admit Date</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-briefcase" />
                  <Calendar id="admit_date" value={values.admit_date} name='admit_date' className={submitCount > 0 && errors.admit_date ? 'p-invalid w-full' : 'w-full'} aria-describedby="admit_date_error" onChange={handleChange} showTime showSeconds hourFormat="12" />
                </div>
                {submitCount > 0 && errors.admit_date &&
                  <small id="admit_date_error" className="p-error">
                    {errors.admit_date}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="patient_id" className="block text-900 font-medium mb-2">Member</label>
                <Dropdown id="patient_id" value={values.patient_id} name='patient_id' className={submitCount > 0 && errors.patient_id ? 'p-invalid w-full' : 'w-full'} options={members} onChange={handleChange} filter showClear optionLabel="full_name" filterBy="full_name" placeholder="Select a Patient"
                  valueTemplate={selectedPatientTemplate} itemTemplate={patientOptionTemplate} aria-describedby="patient_id_error" />
                {submitCount > 0 && errors.patient_id &&
                  <small id="patient_id_error" className="p-error">
                    {errors.patient_id}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="room_id" className="block text-900 font-medium mb-2">Room</label>
                <Dropdown id="room_id" value={values.room_id} name='room_id' className={submitCount > 0 && errors.room_id ? 'p-invalid w-full' : 'w-full'} options={members} onChange={handleChange} filter showClear optionLabel="full_name" filterBy="full_name" placeholder="Select a Room"
                  valueTemplate={selectedRoomTemplate} itemTemplate={roomOptionTemplate} aria-describedby="room_id_error" />
                {submitCount > 0 && errors.room_id &&
                  <small id="room_id_error" className="p-error">
                    {errors.room_id}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="doctors" className="block text-900 font-medium mb-2">Doctors</label>
                <ListBox value={values.doctors} options={doctorsList} name='doctors' onChange={handleChange} multiple filter
                  itemTemplate={doctorTemplate} listStyle={{ maxHeight: '250px' }} className={submitCount > 0 && errors.doctors ? 'p-invalid w-full' : 'w-full'} aria-describedby="doctors_error" />
                {submitCount > 0 && errors.doctors &&
                  <small id="doctors_error" className="p-error">
                    {errors.doctors}
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

export default Admissions;