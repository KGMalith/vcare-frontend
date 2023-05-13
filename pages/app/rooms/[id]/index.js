import React, { useEffect, useState, useRef } from 'react';
import { Badge } from 'primereact/badge';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { postRequest } from '../../../../utils/axios';
import { apiPaths } from '../../../../utils/api-paths';
import { useRouter } from 'next/router';
import { ProgressSpinner } from 'primereact/progressspinner';
import { CONSTANTS } from '../../../../utils/constants';
import moment from 'moment';
import 'moment-timezone';
import { withAuth } from '../../../../utils/withAuth';

function ViewRoom() {

  const [admissions, setAdmissions] = useState([]);
  const [roomData, setRoomData] = useState(null);
  const [isdataLoading, setDataLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [timeZone,setTimezone] = useState(null);
  const router = useRouter();

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const redirectPage = (url) =>{
    router.push(url);
  }

  //Admission Table patient column
  const patientItemTemplate = (rowData) => {
    return (
      <>
        <span className='text-primary-500 cursor-pointer' onClick={()=>redirectPage(`/app/patients/${rowData.id}`)}>{`${rowData.patient_code} - ${rowData.first_name} ${rowData.last_name}`}</span>
      </>
    )
  }

  //Admission Table admit date column
  const admitDateItemTemplate = (rowData) => {
    return (
      <>
        <span>{moment(rowData?.admit_date)?.tz(timeZone)?.format('YYYY-MM-DD HH:mm:ss A')}</span>
      </>
    )
  }

  //Admission Table discharge date column
  const dischargeDateItemTemplate = (rowData) => {
    return (
      <>
        {rowData?.discharge_date &&
          <span>{moment(rowData?.discharge_date)?.tz(timeZone)?.format('YYYY-MM-DD HH:mm:ss A')}</span>
        }
      </>
    )
  }

  //Room Table status column
  const statusColumnTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.status == 1 ? 'Admited' : 'Discharged'} severity={rowData.status == 1 ? 'success' : 'warning'}></Badge>
      </>
    )
  }


  const admissionTablecolumns = [
    { field: 'admission_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
    { field: 'patient_code', header: 'Patient Name', sortable: true, body: patientItemTemplate, style: { minWidth: '20rem' } },
    { field: 'admit_date', header: 'Admit Date', sortable: false, body: admitDateItemTemplate, style: { minWidth: '18rem' } },
    { field: 'discharge_date', header: 'Discharge Date', sortable: false, body: dischargeDateItemTemplate, style: { minWidth: '18rem' } },
    { field: 'status', header: 'Status', sortable: false, body: statusColumnTemplate, style: { minWidth: '8rem' } },
  ];

  const admissionTableDynamicColumns = admissionTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
  });

  const renderAdmissionTableHeader = () => {
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

  useEffect(() => {
    const getAllDetails = async () => {
      if (router?.query?.id) {
        setDataLoading(true);
        let respond = await postRequest(apiPaths.GET_ROOM_DETAILS, { id: router?.query?.id });
        if (respond.status) {
          setRoomData(respond.data.room);
          setAdmissions(respond.data.admissions);
        }
        setDataLoading(false);
      }
    }

    let timeZone = localStorage.getItem('timezone');
    if (timeZone) {
      setTimezone(timeZone);
    }

    getAllDetails();
  }, [router?.query?.id])


  return (
    <>
      {isdataLoading ?
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
                  <span className='text-900 font-medium text-3xl'>{roomData?.room_number}</span>
                  <div className='flex align-items-center flex-wrap text-sm'>
                    <div className='mr-5 mt-3'>
                      <span className='font-semibold text-500'>
                        <i className='pi pi-money-bill mr-1'></i>
                        Amount
                      </span>
                      <div className='text-700 mt-2 font-bold'>{(roomData?.room_charge)?.toFixed(2)}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className='px-6 py-5 surface-ground'>
            <div className='surface-card p-4 shadow-2 border-round'>
              <div className='font-medium text-3xl text-900 mb-3'>Room Profile</div>
              <div className='text-500 mb-5'>All details related to room are down below</div>
              <ul className='list-none p-0 m-0 border-top-1 border-300'>
                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                  <div className='text-500 w-full md:w-3 font-medium'>Room Number</div>
                  <div className='text-900 w-full md:w-9'>{roomData?.room_number}</div>
                </li>
                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                  <div className='text-500 w-full md:w-3 font-medium'>Description</div>
                  <div className='text-900 w-full md:w-9'>{roomData?.room_desc}</div>
                </li>
                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                  <div className='text-500 w-full md:w-3 font-medium'>Amount</div>
                  <div className='text-900 w-full md:w-9'>{(roomData?.room_charge)?.toFixed(2)}</div>
                </li>
                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                  <div className='text-500 w-full md:w-3 font-medium'>Room Status</div>
                  <div className='text-900 w-full md:w-9'>
                  <Badge value={roomData?.room_status == CONSTANTS.hospital_room_cleaning? 'Cleaning':roomData?.room_status == CONSTANTS.hospital_room_available ? 'Active' :roomData?.room_status == CONSTANTS.hospital_room_taken? 'Taken':roomData?.room_status == CONSTANTS.hospital_room_waiting_for_cleaning?'Waiting For Cleaning':roomData?.room_status == CONSTANTS.hospital_room_closed_for_maintenance && 'Closed For Maintenance' } severity={roomData?.room_status == CONSTANTS.hospital_room_cleaning? 'primary':roomData?.room_status == CONSTANTS.hospital_room_available ? 'success' :roomData?.room_status == CONSTANTS.hospital_room_taken? 'info':roomData?.room_status == CONSTANTS.hospital_room_waiting_for_cleaning?'warning':roomData?.room_status == CONSTANTS.hospital_room_closed_for_maintenance && 'danger'}></Badge>
                  </div>
                </li>
                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                  <div className='text-500 w-full md:w-3 font-medium'>
                    Admissions
                  </div>
                  <div className='text-900 w-full md:w-9'>
                    <DataTable value={admissions} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                      currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isdataLoading} filters={filters} header={renderAdmissionTableHeader}>
                      {admissionTableDynamicColumns}
                    </DataTable>
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

export default withAuth(ViewRoom)