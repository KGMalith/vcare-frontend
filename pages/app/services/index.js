import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputNumber } from 'primereact/inputnumber';
import { Badge } from 'primereact/badge';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { FilterMatchMode } from 'primereact/api';
import { Formik } from 'formik';
import * as yup from 'yup';
import { apiPaths } from '../../../utils/api-paths';
import { getRequest, postRequest } from '../../../utils/axios';
import { CONSTANTS } from '../../../utils/constants';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { useRouter } from 'next/router';


const Services = () => {
  const [services, setServices] = useState([]);
  const [showAddService, setShowAddService] = useState(false);
  const [showEditService, setShowEditService] = useState(false);
  const [isServicesTableLoading, setServicesTableLoading] = useState(false);
  const [addServiceLoading, setAddServiceLoading] = useState(false);
  const [editServiceLoading, setEditServiceLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const formRef = useRef();
  const editFormRef = useRef();
  const menu = useRef(null);
  const router = useRouter();

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const schema = yup.object({
    service_name: yup.string().required('Required'),
    service_desc: yup.string().required('Required'),
    service_charge: yup.number().typeError('Amount must be a number').required('Required'),
    is_apply_to_every_appointment: yup.boolean().required('Required'),
    is_apply_to_every_admission: yup.boolean().required('Required'),
  });

  const items = [
    {
      label: 'Options',
      items: selectedRowData?.status == CONSTANTS.hospital_service_active ?
        [
          {
            label: 'View',
            icon: 'pi pi-eye',
            command: () => {
              router.push('/app/services/'+selectedRowData.id)
            }
          },
          {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
              setShowEditService(true);
            }
          },
          {
            label: 'Deactivate',
            icon: 'pi pi-times',
            command: () => {
              confirmDialog({
                message: 'Do you want to deactivate this service?',
                header: 'Service Deactivate Confirmation',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept: deactivateService,
              });
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
              confirmDialog({
                message: 'Do you want to delete this service?',
                header: 'Service Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept: deleteService,
              });
            }
          }
        ]
        : selectedRowData?.status == CONSTANTS.hospital_service_inactive ?
          [
            {
              label: 'View',
              icon: 'pi pi-eye',
              command: () => {
                router.push('/app/services/'+selectedRowData.id)
              }
            },
            {
              label: 'Update',
              icon: 'pi pi-refresh',
              command: () => {
                setShowEditService(true);
              }
            },
            {
              label: 'Activate',
              icon: 'pi pi-check',
              command: () => {
                confirmDialog({
                  message: 'Do you want to activate this service?',
                  header: 'Service Activation Confirmation',
                  icon: 'pi pi-info-circle',
                  acceptClassName: 'p-button-primary',
                  accept: activateService,
                });
              }
            },
            {
              label: 'Delete',
              icon: 'pi pi-trash',
              command: () => {
                confirmDialog({
                  message: 'Do you want to delete this service?',
                  header: 'Service Delete Confirmation',
                  icon: 'pi pi-info-circle',
                  acceptClassName: 'p-button-danger',
                  accept: deleteService,
                });
              }
            }
          ]
          :
          [
            {
              label: 'View',
              icon: 'pi pi-eye',
              command: () => {
                router.push('/app/services/'+selectedRowData.id)
              }
            },
            {
              label: 'Update',
              icon: 'pi pi-refresh',
              command: () => {
                setShowEditService(true);
              }
            },
            {
              label: 'Delete',
              icon: 'pi pi-trash',
              command: () => {
                confirmDialog({
                  message: 'Do you want to delete this service?',
                  header: 'Service Delete Confirmation',
                  icon: 'pi pi-info-circle',
                  acceptClassName: 'p-button-danger',
                  accept: deleteService,
                });
              }
            }
          ]
    },
  ];

  const renderServiceTableHeader = () => {
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

  //Service Table apply to appointment column
  const applyToAppointmentItemTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.is_apply_to_every_appointment == CONSTANTS.is_apply_to_every_appointment_true ? 'Yes' : 'No'} severity={rowData.is_apply_to_every_appointment == CONSTANTS.is_apply_to_every_appointment_true ? 'success' : 'warning'}></Badge>
      </>
    )
  }

  //Service Table apply to admission column
  const applyToAdmissionItemTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.is_apply_to_every_admission == CONSTANTS.is_apply_to_every_admission_true ? 'Yes' : 'No'} severity={rowData.is_apply_to_every_admission == CONSTANTS.is_apply_to_every_admission_true ? 'success' : 'warning'}></Badge>
      </>
    )
  }

  //Service Table status column
  const statusItemTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.status == CONSTANTS.hospital_service_active ? 'Active' : rowData.status == CONSTANTS.hospital_service_inactive && 'Inactive'} severity={rowData.status == CONSTANTS.hospital_service_active ? 'success' : rowData.status == CONSTANTS.hospital_service_inactive && 'danger'}></Badge>
      </>
    )
  }

  //Members Table Action
  const actionButtonTemplate = (rowData) => {
    return (
      <>
        <Menu model={items} popup ref={menu} id="popup_menu" />
        <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
      </>
    )
  }

  const membersTablecolumns = [
    { field: 'service_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
    { field: 'service_name', header: 'Name', sortable: true, style: { minWidth: '14rem' } },
    { field: 'service_charge', header: 'Amount', sortable: false, style: { minWidth: '8rem' } },
    { field: 'is_apply_to_every_appointment', header: 'Is Apply To Every Appointment', sortable: false, body: applyToAppointmentItemTemplate, style: { minWidth: '8rem' } },
    { field: 'is_apply_to_every_admission', header: 'Is Apply To Every Admission', sortable: false, body: applyToAdmissionItemTemplate, style: { minWidth: '8rem' } },
    { field: 'status', header: 'Status', sortable: false, body: statusItemTemplate, style: { minWidth: '8rem' } },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const servicesTableDynamicColumns = membersTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
  });

  const renderHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Service</h1>
        <span className='text-600 text-base font-normal'>Create hospital billing service</span>
      </div>
    );
  }

  const renderEditHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Edit Service</h1>
        <span className='text-600 text-base font-normal'>Update hospital billing service</span>
      </div>
    );
  }

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddService(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} loading={addServiceLoading} />
      </div>
    );
  }

  const renderEditFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowEditService(false)} className="p-button-text" />
        <Button label="Update" icon="pi pi-check" autoFocus type='button' onClick={editHandleSubmit} loading={editServiceLoading} />
      </div>
    );
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const editHandleSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit();
    }
  };

  const onSubmitService = async (values) => {
    setAddServiceLoading(true);
    let respond = await postRequest(apiPaths.CREATE_SERVICE, { ...values, is_apply_to_every_appointment: values.is_apply_to_every_appointment ? CONSTANTS.is_apply_to_every_appointment_true : CONSTANTS.is_apply_to_every_appointment_false, is_apply_to_every_admission: values.is_apply_to_every_admission ? CONSTANTS.is_apply_to_every_admission_true : CONSTANTS.is_apply_to_every_admission_false });
    if (respond.status) {
      setShowAddService(false);
      getAllServices();
    }
    setAddServiceLoading(false);
  }

  const onSubmitEditService = async (values) => {
    setEditServiceLoading(true);
    let respond = await postRequest(apiPaths.UPDATE_SERVICE, { ...values, is_apply_to_every_appointment: values.is_apply_to_every_appointment ? CONSTANTS.is_apply_to_every_appointment_true : CONSTANTS.is_apply_to_every_appointment_false, is_apply_to_every_admission: values.is_apply_to_every_admission ? CONSTANTS.is_apply_to_every_admission_true : CONSTANTS.is_apply_to_every_admission_false, id: selectedRowData?.id });
    if (respond.status) {
      setShowEditService(false);
      getAllServices();
    }
    setEditServiceLoading(false);
  }

  useEffect(() => {
    getAllServices();
  }, [])

  const getAllServices = async () => {
    setServicesTableLoading(true);
    let respond = await getRequest(apiPaths.GET_ALL_SERVICES);
    if (respond.status) {
      setServices(respond.data);
    }
    setServicesTableLoading(false);
  }

  const activateService = async () => {
    setServicesTableLoading(true);
    let respond = await postRequest(apiPaths.CHANGE_SERVICE_STATUS, { id: selectedRowData?.id, status: CONSTANTS.hospital_service_active });
    if (respond.status) {
      setShowAddService(false);
      getAllServices();
    }
  }

  const deactivateService = async () => {
    setServicesTableLoading(true);
    let respond = await postRequest(apiPaths.CHANGE_SERVICE_STATUS, { id: selectedRowData?.id, status: CONSTANTS.hospital_service_inactive });
    if (respond.status) {
      setShowAddService(false);
      getAllServices();
    }
  }

  const deleteService = async () => {
    setServicesTableLoading(true);
    let respond = await postRequest(apiPaths.DELETE_SERVICE, { id: selectedRowData?.id });
    if (respond.status) {
      setShowAddService(false);
      getAllServices();
    }
  }


  return (
    <>
      <ConfirmDialog />
      <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
        <div className='border-bottom-1 surface-border'>
          <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
            Charging Services
          </h2>
          <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your hospital charging services in this page</p>
        </div>
        <div className='grid py-6 surface-border'>
          <div className='col-12 lg:col-3'>
            <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
              Services
            </h3>
            <p className='mb-4 mt-0 text-700 font-normal text-base'>Add/Edit hospital bill services in your system</p>
            <Button label="Add a service" className='w-auto' onClick={() => setShowAddService(true)} />
          </div>
          <div className='col-12 lg:col-9'>
            <DataTable value={services} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isServicesTableLoading} filters={filters} header={renderServiceTableHeader}>
              {servicesTableDynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>

      {/* Add Service Modal */}
      <Dialog header={renderHeader} visible={showAddService} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddService(false)}>
        <Formik
          innerRef={formRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitService(values)}
          initialValues={{
            service_name: '',
            service_desc: '',
            service_charge: '',
            is_apply_to_every_appointment: false,
            is_apply_to_every_admission: false
          }}>
          {({
            errors,
            handleChange,
            handleSubmit,
            submitCount,
            values
          }) => (
            <form noValidate>
              <div>
                <label htmlFor="service_name" className="block text-900 font-medium mb-2">Name</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-chart-line" />
                  <InputText id="service_name" value={values.service_name} name='service_name' type="text" placeholder="Role Name" className={submitCount > 0 && errors.service_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="service_name_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.service_name &&
                  <small id="service_name_error" className="p-error">
                    {errors.service_name}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="service_desc" className="block text-900 font-medium mb-2">Description</label>
                <InputTextarea id="service_desc" value={values.service_desc} name='service_desc' placeholder="Role Description" className={submitCount > 0 && errors.service_desc ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="service_desc_error" />
                {submitCount > 0 && errors.service_desc &&
                  <small id="service_desc_error" className="p-error">
                    {errors.service_desc}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="service_charge" className="block text-900 font-medium mb-2">Amount</label>
                <div className="p-input-icon-left w-full">
                  <InputNumber id="service_charge" inputId="locale-user" value={values.service_charge} name='service_charge' className={submitCount > 0 && errors.service_charge ? 'p-invalid w-full' : 'w-full'} aria-describedby="service_charge_error" onValueChange={handleChange} mode="decimal" minFractionDigits={2} />
                </div>
                {submitCount > 0 && errors.service_charge &&
                  <small id="service_charge_error" className="p-error">
                    {errors.service_charge}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="is_apply_to_every_appointment" className="block text-900 font-medium mb-2">Is Apply To Every Appointment?</label>
                <InputSwitch checked={values.is_apply_to_every_appointment} name='is_apply_to_every_appointment' className={submitCount > 0 && errors.is_apply_to_every_appointment && 'p-invalid'} aria-describedby="is_apply_to_every_appointment_error" onChange={handleChange} />
                {submitCount > 0 && errors.is_apply_to_every_appointment &&
                  <small id="is_apply_to_every_appointment_error" className="p-error">
                    {errors.is_apply_to_every_appointment}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="is_apply_to_every_admission" className="block text-900 font-medium mb-2">Is Apply To Every Admission?</label>
                <InputSwitch checked={values.is_apply_to_every_admission} name='is_apply_to_every_admission' className={submitCount > 0 && errors.is_apply_to_every_admission && 'p-invalid'} aria-describedby="is_apply_to_every_admission_error" onChange={handleChange} />
                {submitCount > 0 && errors.is_apply_to_every_admission &&
                  <small id="is_apply_to_every_admission_error" className="p-error">
                    {errors.is_apply_to_every_admission}
                  </small>
                }
              </div>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Edit Service Modal */}
      <Dialog header={renderEditHeader} visible={showEditService} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderEditFooter} onHide={() => setShowEditService(false)}>
        <Formik
          innerRef={editFormRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitEditService(values)}
          initialValues={{
            service_name: selectedRowData?.service_name,
            service_desc: selectedRowData?.service_desc,
            service_charge: selectedRowData?.service_charge,
            is_apply_to_every_appointment: selectedRowData?.is_apply_to_every_appointment == CONSTANTS.is_apply_to_every_appointment_true ? true : false,
            is_apply_to_every_admission: selectedRowData?.is_apply_to_every_admission == CONSTANTS.is_apply_to_every_admission_true ? true : false
          }}>
          {({
            errors,
            handleChange,
            handleSubmit,
            submitCount,
            values
          }) => (
            <form noValidate>
              <div>
                <label htmlFor="service_name" className="block text-900 font-medium mb-2">Name</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-chart-line" />
                  <InputText id="service_name" value={values.service_name} name='service_name' type="text" placeholder="Role Name" className={submitCount > 0 && errors.service_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="service_name_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.service_name &&
                  <small id="service_name_error" className="p-error">
                    {errors.service_name}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="service_desc" className="block text-900 font-medium mb-2">Description</label>
                <InputTextarea id="service_desc" value={values.service_desc} name='service_desc' placeholder="Role Description" className={submitCount > 0 && errors.service_desc ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="service_desc_error" />
                {submitCount > 0 && errors.service_desc &&
                  <small id="service_desc_error" className="p-error">
                    {errors.service_desc}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="service_charge" className="block text-900 font-medium mb-2">Amount</label>
                <div className="p-input-icon-left w-full">
                  <InputNumber id="service_charge" inputId="locale-user" value={values.service_charge} name='service_charge' className={submitCount > 0 && errors.service_charge ? 'p-invalid w-full' : 'w-full'} aria-describedby="service_charge_error" onValueChange={handleChange} mode="decimal" minFractionDigits={2} />
                </div>
                {submitCount > 0 && errors.service_charge &&
                  <small id="service_charge_error" className="p-error">
                    {errors.service_charge}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="is_apply_to_every_appointment" className="block text-900 font-medium mb-2">Is Apply To Every Appointment?</label>
                <InputSwitch checked={values.is_apply_to_every_appointment} name='is_apply_to_every_appointment' className={submitCount > 0 && errors.is_apply_to_every_appointment && 'p-invalid'} aria-describedby="is_apply_to_every_appointment_error" onChange={handleChange} />
                {submitCount > 0 && errors.is_apply_to_every_appointment &&
                  <small id="is_apply_to_every_appointment_error" className="p-error">
                    {errors.is_apply_to_every_appointment}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="is_apply_to_every_admission" className="block text-900 font-medium mb-2">Is Apply To Every Admission?</label>
                <InputSwitch checked={values.is_apply_to_every_admission} name='is_apply_to_every_admission' className={submitCount > 0 && errors.is_apply_to_every_admission && 'p-invalid'} aria-describedby="is_apply_to_every_admission_error" onChange={handleChange} />
                {submitCount > 0 && errors.is_apply_to_every_admission &&
                  <small id="is_apply_to_every_admission_error" className="p-error">
                    {errors.is_apply_to_every_admission}
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

export default Services