import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode } from 'primereact/api';
import { Menu } from 'primereact/menu';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { Formik } from 'formik';
import * as yup from 'yup';
import {getRequest,postRequest} from '../../../utils/axios';
import {apiPaths} from '../../../utils/api-paths';
import { CONSTANTS } from '../../../utils/constants';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';

const Rooms = () => {
  const [rooms, setRooms] = useState([]);

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const [isRoomTableLoading, setRoomTableLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [showEditRoom, setShowEditRoom] = useState(false);
  const [isAddRoomLoading, setAddRoomLoading] = useState(false);
  const [isEditRoomLoading, setEditRoomLoading] = useState(false);
  const [isDeleteRoomLoading, setDeleteRoomLoading] = useState(false);
  const formRef = useRef();
  const editFormRef = useRef();
  const menu = useRef(null);
  const router = useRouter();

  const schema = yup.object({
    room_number: yup.string().required('Required'),
    room_desc: yup.string().required('Required'),
    room_charge: yup.number().required('Required')
  });

  //Room Table status column
  const statusColumnTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.room_status == CONSTANTS.hospital_room_cleaning? 'Cleaning':rowData.room_status == CONSTANTS.hospital_room_available ? 'Active' :rowData.room_status == CONSTANTS.hospital_room_taken? 'Taken':rowData.room_status == CONSTANTS.hospital_room_waiting_for_cleaning?'Waiting For Cleaning':rowData.room_status == CONSTANTS.hospital_room_closed_for_maintenance && 'Closed For Maintenance' } severity={rowData.room_status == CONSTANTS.hospital_room_cleaning? 'primary':rowData.room_status == CONSTANTS.hospital_room_available ? 'success' :rowData.room_status == CONSTANTS.hospital_room_taken? 'info':rowData.room_status == CONSTANTS.hospital_room_waiting_for_cleaning?'warning':rowData.room_status == CONSTANTS.hospital_room_closed_for_maintenance && 'danger'}></Badge>
      </>
    )
  }

  //Room Table Action
  const actionButtonTemplate = (rowData) => {
    return (
      <>
        <Menu model={items} popup ref={menu} id="popup_menu" />
        <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
      </>
    )
  }

  const items = [
    {
      label: 'Options',
      items:
        [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => {
              router.push('/app/rooms/'+selectedRowData.id)
            }
          },
          {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
              setShowEditRoom(true);
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
              confirmDialog({
                message: 'Do you want to delete this room?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept:onSubmitDeleteRooms,
              });
            }
          }
        ]
    },
  ];

  const roomTablecolumns = [
    { field: 'room_number', header: 'Room No', sortable: true, style: { minWidth: '8rem' } },
    { field: 'room_desc', header: 'Description', sortable: false, style: { minWidth: '20rem' } },
    { field: 'room_charge', header: 'Amount', sortable: false, style: { minWidth: '10rem' } },
    { field: 'room_status', header: 'Status', sortable: false,body: statusColumnTemplate, style: { minWidth: '14rem' } },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const roomTableDynamicColumns = roomTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
  });

  const renderRoomTableHeader = () => {
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

  const renderHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Room</h1>
        <span className='text-600 text-base font-normal'>Create room for your organization</span>
      </div>
    );
  }

  const renderEditHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Edit Room</h1>
        <span className='text-600 text-base font-normal'>Update room for your organization</span>
      </div>
    );
  }

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddRoom(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus onClick={handleSubmit} loading={isAddRoomLoading}/>
      </div>
    );
  }

  const renderEditFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowEditRoom(false)} className="p-button-text" />
        <Button label="Update" icon="pi pi-check" autoFocus onClick={handleEditSubmit} loading={isEditRoomLoading}/>
      </div>
    );
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const handleEditSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit();
    }
  };

  const onSubmitRooms = async (values) => {
    setAddRoomLoading(true);
    let respond = await postRequest(apiPaths.CREATE_ROOM,values);
    if (respond.status) {
      setShowAddRoom(false);
      getAllRooms();
    }
    setAddRoomLoading(false);
  }

  const onSubmitEditRooms = async (values) => {
    setEditRoomLoading(true);
    let respond = await postRequest(apiPaths.UPDATE_ROOM,{...values,id:selectedRowData?.id});
    if (respond.status) {
      setShowEditRoom(false);
      getAllRooms();
    }
    setEditRoomLoading(false);
  }

  const onSubmitDeleteRooms = async (values) => {
    setRoomTableLoading(true);
    let respond = await postRequest(apiPaths.DELETE_ROOM,{id:selectedRowData?.id});
    if (respond.status) {
      getAllRooms();
    }
    setRoomTableLoading(false);
  }


  useEffect(() => {
    getAllRooms();
  }, [])

  const getAllRooms = async() =>{
    setRoomTableLoading(true);
    let respond = await getRequest(apiPaths.GET_ALL_ROOMS);
    if (respond.status) {
      setRooms(respond.data);
    }
    setRoomTableLoading(false);
  }
  

  return (
    <>
     <ConfirmDialog />
      <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
        <div className='border-bottom-1 surface-border'>
          <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
            Rooms
          </h2>
          <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your hospital rooms in this page</p>
        </div>
        <div className='grid py-6 surface-border'>
          <div className='col-12 lg:col-3'>
            <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
              Rooms
            </h3>
            <p className='mb-4 mt-0 text-700 font-normal text-base'>Add/Edit Hospital rooms in your organization</p>
            <Button label="Add a room" className='w-auto' onClick={() => setShowAddRoom(true)} />
          </div>
          <div className='col-12 lg:col-9'>
            <DataTable value={rooms} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" emptyMessage="No roles found." rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isRoomTableLoading} filters={filters} header={renderRoomTableHeader}>
              {roomTableDynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>

      {/* Add Room Modal */}
      <Dialog header={renderHeader} visible={showAddRoom} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddRoom(false)}>
        <Formik
          innerRef={formRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitRooms(values)}
          initialValues={{
            room_number: '',
            room_desc: '',
            room_charge: '',
          }}>
          {({
            errors,
            handleChange,
            handleSubmit,
            submitCount,
            values
          }) => (
            <form noValidate>
              <label htmlFor="room_number" className="block text-900 font-medium mb-2">Room Number</label>
              <div className="p-input-icon-left w-full">
                <i className="pi pi-sort-numeric-down" />
                <InputText id="room_number" value={values.room_number} name='room_number' type="text" placeholder="Room Number" className={submitCount > 0 && errors.room_number ? 'p-invalid w-full' : 'w-full'} aria-describedby="room_number_error" onChange={handleChange} />
              </div>
              {submitCount > 0 && errors.room_number &&
                <small id="room_number_error" className="p-error">
                  {errors.room_number}
                </small>
              }
              <div className="mt-3">
                <label htmlFor="room_desc" className="block text-900 font-medium mb-2">Room Description</label>
                <InputTextarea id="room_desc" value={values.room_desc} name='room_desc' placeholder="Room Description" className={submitCount > 0 && errors.room_desc ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="room_desc_error" />
                {submitCount > 0 && errors.room_desc &&
                  <small id="room_desc_error" className="p-error">
                    {errors.room_desc}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="room_charge" className="block text-900 font-medium mb-2">Amount</label>
                <div className="p-input-icon-left w-full">
                  <InputNumber id="room_charge" inputId="locale-user" value={values.room_charge} name='room_charge' className={submitCount > 0 && errors.room_charge ? 'p-invalid w-full' : 'w-full'} aria-describedby="room_charge_error" onValueChange={handleChange} mode="decimal" minFractionDigits={2} />
                </div>
                {submitCount > 0 && errors.room_charge &&
                  <small id="room_charge_error" className="p-error">
                    {errors.room_charge}
                  </small>
                }
              </div>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Edit Room Modal */}
      <Dialog header={renderEditHeader} visible={showEditRoom} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderEditFooter} onHide={() => setShowEditRoom(false)}>
        <Formik
          innerRef={editFormRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitEditRooms(values)}
          initialValues={{
            room_number: selectedRowData?.room_number,
            room_desc: selectedRowData?.room_desc,
            room_charge: selectedRowData?.room_charge,
          }}>
          {({
            errors,
            handleChange,
            handleSubmit,
            submitCount,
            values
          }) => (
            <form noValidate>
              <label htmlFor="room_number" className="block text-900 font-medium mb-2">Room Number</label>
              <div className="p-input-icon-left w-full">
                <i className="pi pi-sort-numeric-down" />
                <InputText id="room_number" value={values.room_number} name='room_number' type="text" placeholder="Room Number" className={submitCount > 0 && errors.room_number ? 'p-invalid w-full' : 'w-full'} aria-describedby="room_number_error" onChange={handleChange} />
              </div>
              {submitCount > 0 && errors.room_number &&
                <small id="room_number_error" className="p-error">
                  {errors.room_number}
                </small>
              }
              <div className="mt-3">
                <label htmlFor="room_desc" className="block text-900 font-medium mb-2">Room Description</label>
                <InputTextarea id="room_desc" value={values.room_desc} name='room_desc' placeholder="Room Description" className={submitCount > 0 && errors.room_desc ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="room_desc_error" />
                {submitCount > 0 && errors.room_desc &&
                  <small id="room_desc_error" className="p-error">
                    {errors.room_desc}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="room_charge" className="block text-900 font-medium mb-2">Amount</label>
                <div className="p-input-icon-left w-full">
                  <InputNumber id="room_charge" inputId="locale-user" value={values.room_charge} name='room_charge' className={submitCount > 0 && errors.room_charge ? 'p-invalid w-full' : 'w-full'} aria-describedby="room_charge_error" onValueChange={handleChange} mode="decimal" minFractionDigits={2} />
                </div>
                {submitCount > 0 && errors.room_charge &&
                  <small id="room_charge_error" className="p-error">
                    {errors.room_charge}
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

export default Rooms