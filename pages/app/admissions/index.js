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
import { getRequest, postRequest } from '../../../utils/axios';
import { apiPaths } from '../../../utils/api-paths';
import { CONSTANTS } from '../../../utils/constants';
import moment from 'moment';
import 'moment-timezone';

const Admissions = () => {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [doctorsList, setDoctorsList] = useState([]);
  const [isAdmissionTableLoading, setAdmissionTableLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showAddAdmission, setShowAddAdmission] = useState(false);
  const [showEditAdmission, setShowEditAdmission] = useState(false);
  const [isAddAdmissionLoading, setAddAdmissionLoading] = useState(false);
  const [isEditAdmissionLoading, setEditAdmissionLoading] = useState(false);
  const [timeZone, setTimezone] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const formRef = useRef();
  const editFormRef = useRef();
  const menu = useRef(null);
  const router = useRouter();

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const schema = yup.object({
    patient_id: yup.object().required('Required'),
    admit_date: yup.string().required('Required'),
    doctors: yup.array(yup.object().required('Required')),
    room_id: yup.object().required('Required'),
  });

  const editSchema = yup.object({
    doctors: yup.array(yup.object().required('Required')),
    room_id: yup.object().required('Required'),
  });

  const items = [
    {
      label: 'Options',
      items:
        userRole != CONSTANTS.patient_role_id ?
          [
            {
              label: 'View',
              icon: 'pi pi-eye',
              command: () => {
                router.push('/app/admissions/' + selectedRowData.id)
              }
            },
            {
              label: 'Update',
              icon: 'pi pi-refresh',
              command: () => {
                setShowEditAdmission(true);
              }
            },
          ]
          :
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
        <span>{moment(rowData?.admit_date)?.tz(timeZone)?.format('YYYY-MM-DD hh:mm:ss A')}</span>
      </>
    )
  }

  //Admission Table discharge date column
  const dischargeDateItemTemplate = (rowData) => {
    return (
      <>
        {rowData?.discharge_date &&
          <span>{moment(rowData?.discharge_date)?.tz(timeZone)?.format('YYYY-MM-DD hh:mm:ss A')}</span>
        }
      </>
    )
  }

  //Admission Table hospital room column
  const roomItemTemplate = (rowData) => {
    return (
      <>
        <span><a href={`/app/rooms/${rowData?.hospital_room?.id}`}>{rowData?.hospital_room?.room_number}</a></span>
      </>
    )
  }

  //Admission Table patient column
  const patientItemTemplate = (rowData) => {
    return (
      <>
        <>
          <div className='flex flex-row align-items-center'>
            {rowData.patient_id.image ?
              <Avatar image={rowData.patient_id.image} className="mr-2" size="large" shape="circle" />
              :
              <Avatar icon="pi pi-user" className="mr-2" size="large" shape="circle" />
            }
            <span><a href={`/app/patients/${rowData.patient_id.id}`}>{rowData.patient_id.patient_code + ' - ' + rowData.patient_id.first_name + ' ' + rowData.patient_id.last_name}</a></span>
          </div>
        </>
      </>
    )
  }

  //Admission Table status column
  const admissionTablestatusColumnTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.status == CONSTANTS.admission_active ? 'Active' : 'Discharged'} severity={rowData.status == CONSTANTS.admission_active ? 'success' : 'warning'}></Badge>
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
    { field: 'admit_date', header: 'Admit Date', sortable: true, body: admitDateItemTemplate, style: { minWidth: '15rem' } },
    { field: 'discharge_date', header: 'Discharge Date', sortable: false, body: dischargeDateItemTemplate, style: { minWidth: '15rem' } },
    { field: 'hospital_room', header: 'Room', sortable: false, body: roomItemTemplate, style: { minWidth: '10rem' } },
    { field: 'patient_id', header: 'Patient', sortable: false, body: patientItemTemplate, style: { minWidth: '25rem' } },
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

  const renderEditHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Edit Admission</h1>
        <span className='text-600 text-base font-normal'>Update admission on behalf of patient</span>
      </div>
    );
  }

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddAdmission(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} loading={isAddAdmissionLoading} />
      </div>
    );
  }

  const renderEditFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowEditAdmission(false)} className="p-button-text" />
        <Button label="Update" icon="pi pi-check" autoFocus type='button' onClick={handleSubmitEdit} loading={isEditAdmissionLoading} />
      </div>
    );
  }

  const handleSubmitEdit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const onSubmitAdmission = async(values) => {
    setAddAdmissionLoading(true)
    let doctorsId = values.doctors.map((value)=>{return value.id});
    let respond = await postRequest(apiPaths.ADD_ADMISSION,{...values,room_id:values.room_id.id,patient_id:values.patient_id.id,doctors:doctorsId});
    if (respond.status) {
      setShowAddAdmission(false);
      getAllAdmissions();
    }
    setAddAdmissionLoading(false)
  }

  const onSubmitEditAdmission = async(values) => {
    setEditAdmissionLoading(true)
    let doctorsId = values.doctors.map((value)=>{return value.id});
    let respond = await postRequest(apiPaths.UPDATE_ADMISSION,{room_id:values.room_id.id,doctors:doctorsId,id:selectedRowData?.id});
    if (respond.status) {
      setShowEditAdmission(false);
      getAllAdmissions();
    }
    setEditAdmissionLoading(false)
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

  const selectedRoomTemplate = (option, props) => {
    if (option) {
      return (
        <div className='flex-row align-items-center'>
          <span>{option.room_number}&nbsp;&nbsp;<Badge value={option.room_status == CONSTANTS.hospital_room_cleaning? 'Cleaning':option.room_status == CONSTANTS.hospital_room_available ? 'Active' :option.room_status == CONSTANTS.hospital_room_taken? 'Taken':option.room_status == CONSTANTS.hospital_room_waiting_for_cleaning?'Waiting For Cleaning':option.room_status == CONSTANTS.hospital_room_closed_for_maintenance && 'Closed For Maintenance' } severity={option.room_status == CONSTANTS.hospital_room_cleaning? 'primary':option.room_status == CONSTANTS.hospital_room_available ? 'success' :option.room_status == CONSTANTS.hospital_room_taken? 'info':option.room_status == CONSTANTS.hospital_room_waiting_for_cleaning?'warning':option.room_status == CONSTANTS.hospital_room_closed_for_maintenance && 'danger'}></Badge></span>
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
        <span>{option.patient_code + ' - ' + option.first_name + ' ' + option.last_name}</span>
      </div>
    );
  }

  const roomOptionTemplate = (option) => {
    return (
      <div className='flex-row align-items-center'>
       <span>{option.room_number}&nbsp;&nbsp;<Badge value={option.room_status == CONSTANTS.hospital_room_cleaning? 'Cleaning':option.room_status == CONSTANTS.hospital_room_available ? 'Active' :option.room_status == CONSTANTS.hospital_room_taken? 'Taken':option.room_status == CONSTANTS.hospital_room_waiting_for_cleaning?'Waiting For Cleaning':option.room_status == CONSTANTS.hospital_room_closed_for_maintenance && 'Closed For Maintenance' } severity={option.room_status == CONSTANTS.hospital_room_cleaning? 'primary':option.room_status == CONSTANTS.hospital_room_available ? 'success' :option.room_status == CONSTANTS.hospital_room_taken? 'info':option.room_status == CONSTANTS.hospital_room_waiting_for_cleaning?'warning':option.room_status == CONSTANTS.hospital_room_closed_for_maintenance && 'danger'}></Badge></span>
      </div>
    );
  }

  const doctorTemplate = (option) => {
    return (
      <div className="country-item">
        <span className='font-bold text-lg'>
          <i className="pi pi-unlock mr-2" />
          {option.doctor_code}
        </span>
        <p className='font-normal text-400'>{option.first_name + ' ' + option.last_name}</p>
      </div>
    );
  }

  const getAllAdmissions = async () => {
    setAdmissionTableLoading(true)
    let respond = await getRequest(apiPaths.GET_ALL_ADMISSIONS);
    if (respond.status) {
      setAdmissions(respond.data);
    }
    setAdmissionTableLoading(false)
  }

  const getAllAdmissionsPatient = async () => {
    setAdmissionTableLoading(true)
    let respond = await getRequest(apiPaths.GET_ALL_ADMISSIONS_PATIENT);
    if (respond.status) {
      setAdmissions(respond.data);
    }
    setAdmissionTableLoading(false)
  }

  useEffect(() => {
    const getDoctors = async () => {
      let respond = await getRequest(apiPaths.GET_ALL_DOCTORS);
      if (respond.status) {
        setDoctorsList(respond.data);
      }
    }
    const getPatients = async () => {
      let respond = await getRequest(apiPaths.GET_ALL_PATIENTS);
      if (respond.status) {
        setPatients(respond.data);
      }
    }
    const getRooms = async () => {
      let respond = await getRequest(apiPaths.GET_ALL_ROOMS);
      if (respond.status) {
        setRooms(respond.data);
      }
    }

    let timeZone = localStorage.getItem('timezone');
    if (timeZone) {
      setTimezone(timeZone);
    }

    let userRole = localStorage.getItem('user_role');
    if (userRole) {
      setUserRole(userRole);
    }

    if (localStorage.getItem('user_role') != CONSTANTS.patient_role_id) {
      getDoctors();
      getPatients();
      getRooms();
      getAllAdmissions();
    } else {
      getAllAdmissionsPatient();
    }
  }, [])



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
            {userRole != CONSTANTS.patient_role_id &&
              <Button label="Create Admission" className='w-auto' onClick={() => setShowAddAdmission(true)} />
            }
          </div>
          <div className='col-12'>
            <DataTable value={admissions} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isAdmissionTableLoading} filters={filters} header={renderAdmissionsTableHeader}>
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
            room_id: null,
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
                <label htmlFor="room_id" className="block text-900 font-medium mb-2">Room</label>
                <Dropdown id="room_id" value={values.room_id} name='room_id' className={submitCount > 0 && errors.room_id ? 'p-invalid w-full' : 'w-full'} options={rooms} onChange={handleChange} filter showClear optionLabel="full_name" filterBy="full_name" placeholder="Select a Room"
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

      {/* Edit Admission Modal */}
      <Dialog header={renderEditHeader} visible={showEditAdmission} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderEditFooter} onHide={() => setShowEditAdmission(false)}>
        <Formik
          innerRef={editFormRef}
          validationSchema={editSchema}
          onSubmit={(values) => onSubmitEditAdmission(values)}
          initialValues={{
            doctors: selectedRowData?.doctors,
            room_id: selectedRowData?.hospital_room,
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
                <label htmlFor="room_id" className="block text-900 font-medium mb-2">Room</label>
                <Dropdown id="room_id" value={values.room_id} name='room_id' className={submitCount > 0 && errors.room_id ? 'p-invalid w-full' : 'w-full'} options={rooms} onChange={handleChange} filter showClear optionLabel="full_name" filterBy="full_name" placeholder="Select a Room"
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