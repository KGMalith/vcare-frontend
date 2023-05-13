import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputSwitch } from 'primereact/inputswitch';
import { Avatar } from 'primereact/avatar';
import { InputMask } from 'primereact/inputmask';
import { FilterMatchMode } from 'primereact/api';
import { InputTextarea } from 'primereact/inputtextarea';
import { Calendar } from 'primereact/calendar';
import { Dropdown } from 'primereact/dropdown';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getRequest, postRequest } from '../../../utils/axios';
import { apiPaths } from '../../../utils/api-paths';
import moment from 'moment';
import 'moment-timezone';
import { CONSTANTS } from '../../../utils/constants';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { withAuth } from '../../../utils/withAuth';

const Employees = () => {

  const [employees, setEmployees] = useState([]);

  const [members, setMembers] = useState([]);

  const [isEmployeesTableLoading, setEmployeesTableLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [isAddEmployeeLoading, setAddEmployeeLoading] = useState(false);
  const [isEditEmployeeLoading, setEditEmployeeLoading] = useState(false);
  const [timezone, setTimezone] = useState(null);
  const formRef = useRef();
  const editFormRef = useRef();
  const menu = useRef(null);
  const router = useRouter();

  const schema = yup.object({
    is_user_account_exists: yup.boolean().required('Required'),
    user_id: yup.object().test('checkAccountExists', 'Required', function (value) {
      if (this.parent.is_user_account_exists) {
        if (value) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    }),
    first_name: yup.string().required('Required'),
    last_name: yup.string().required('Required'),
    email: yup.string().email('Invalid Email').required('Required'),
    nic: yup.string().required('Required'),
    hired_date: yup.string().required('Required'),
    end_date: yup.string().nullable(),
    birthday: yup.string().required('Required'),
    personal_mobile: yup.string().nullable(),
    bank: yup.string().nullable(),
    bank_branch: yup.string().nullable(),
    bank_account_no: yup.string().nullable(),
    bank_account_name: yup.string().nullable(),
    home_address: yup.string().required('Required'),
    employment_type: yup.string().required('Required'),
    designation: yup.string().required('Required'),
  });

  const employment_types = [
    { label: 'Full-Time', value: 'Full-Time' },
    { label: 'Part-Time', value: 'Part-Time' },
    { label: 'Contract', value: 'Contract' }
  ];

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });


  //Employees Table Full Name
  const userNameItemTemplate = (rowData) => {
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

  //Employees Table Action
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
              router.push('/app/employees/' + selectedRowData.id)
            }
          },
          {
            label: 'Update',
            icon: 'pi pi-refresh',
            command: () => {
              setShowEditEmployee(true);
            }
          },
          {
            label: 'Delete',
            icon: 'pi pi-trash',
            command: () => {
              confirmDialog({
                message: 'Do you want to delete this employee?',
                header: 'Employee Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept: deleteEmployee,
              });
            }
          }
        ]
    },
  ];

  const employeesTablecolumns = [
    { field: 'emp_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
    { field: 'full_name', header: 'Name', sortable: true, body: userNameItemTemplate, style: { minWidth: '20rem' } },
    { field: 'email', header: 'Email', sortable: false, style: { minWidth: '25rem' } },
    { field: 'personal_mobile', header: 'Mobile', sortable: false, style: { minWidth: '10rem' } },
    { field: 'designation', header: 'Designation', sortable: false, style: { minWidth: '8rem' } },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const renderEmployeesTableHeader = () => {
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

  const employeesTableDynamicColumns = employeesTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
  });

  const renderHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Employee</h1>
        <span className='text-600 text-base font-normal'>Create employee profile</span>
      </div>
    );
  }

  const renderEditHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Edit Employee</h1>
        <span className='text-600 text-base font-normal'>Update employee profile</span>
      </div>
    );
  }

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddEmployee(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} loading={isAddEmployeeLoading} />
      </div>
    );
  }

  const renderEditFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowEditEmployee(false)} className="p-button-text" />
        <Button label="Update" icon="pi pi-check" autoFocus type='button' onClick={handleEditSubmit} loading={isEditEmployeeLoading} />
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

  const onSubmitEmployee = async (values) => {
    setAddEmployeeLoading(true);
    let respond = await postRequest(apiPaths.CREATE_EMPLOYEE, {
      ...values,
      user_id: values.user_id.id
    });
    if (respond.status) {
      setShowAddEmployee(false);
      getAllEmployees();
    }
    setAddEmployeeLoading(false);
  }

  const onSubmitEditEmployee = async (values) => {
    setEditEmployeeLoading(true);
    let respond = await postRequest(apiPaths.UPDATE_EMPLOYEE, {
      ...values,
      user_id: values.user_id.id,
      id: selectedRowData?.id
    });
    if (respond.status) {
      setShowEditEmployee(false);
      getAllEmployees();
    }
    setEditEmployeeLoading(false);
  }

  const memberOptionTemplate = (option) => {
    return (
      <div className='flex-row align-items-center'>
        {option.image ?
          <Avatar image={option.image} className="mr-2" shape="circle" />
          :
          <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
        }
        <span>{option.user_code + ' - ' + option.first_name + ' ' + option.last_name}</span>
      </div>
    );
  }

  const selectedMemberTemplate = (option, props) => {
    if (option) {
      return (
        <div className='flex-row align-items-center'>
          {option.image ?
            <Avatar image={option.image} className="mr-2" shape="circle" />
            :
            <Avatar icon="pi pi-user" className="mr-2" shape="circle" />
          }
          <span>{option.user_code + ' - ' + option.first_name + ' ' + option.last_name}</span>
        </div>
      );
    }

    return (
      <span>
        {props.placeholder}
      </span>
    );
  }

  useEffect(() => {
    const getAllMembers = async () => {
      let respond = await getRequest(apiPaths.GET_ALL_MEMBERS);
      if (respond.status) {
        setMembers(respond.data);
      }
    }

    let timeZone = localStorage.getItem('timezone');
    if (timeZone) {
      setTimezone(timeZone);
    }

    getAllEmployees();
    getAllMembers();
  }, [])

  const getAllEmployees = async () => {
    setEmployeesTableLoading(true);
    let respond = await getRequest(apiPaths.GET_ALL_EMPLOYEES);
    if (respond.status) {
      setEmployees(respond.data);
    }
    setEmployeesTableLoading(false);
  }

  const deleteEmployee = async () => {
    setEmployeesTableLoading(true);
    let respond = await postRequest(apiPaths.DELETE_EMPLOYEE, { id: selectedRowData?.id });
    if (respond.status) {
      getAllEmployees();
    }
  }



  return (
    <>
      <ConfirmDialog />
      <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
        <div className='border-bottom-1 surface-border'>
          <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
            Employees
          </h2>
          <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your employees in this page</p>
        </div>
        <div className='grid py-6 surface-border'>
          <div className='col-12 lg:col-3'>
            <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
              Employees
            </h3>
            <p className='mb-4 mt-0 text-700 font-normal text-base'>Add/Edit Employees in your organization</p>
            <Button label="Add a employee" className='w-auto' onClick={() => setShowAddEmployee(true)} />
          </div>
          <div className='col-12 lg:col-9'>
            <DataTable value={employees} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isEmployeesTableLoading} filters={filters} header={renderEmployeesTableHeader}>
              {employeesTableDynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>

      {/* Add Employee Modal */}
      <Dialog header={renderHeader} visible={showAddEmployee} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddEmployee(false)}>
        <Formik
          innerRef={formRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitEmployee(values)}
          initialValues={{
            user_id: '',
            is_user_account_exists: false,
            first_name: '',
            last_name: '',
            email: '',
            nic: '',
            hired_date: '',
            end_date: '',
            birthday: '',
            personal_mobile: '',
            bank: '',
            bank_branch: '',
            bank_account_no: '',
            bank_account_name: '',
            home_address: '',
            employment_type: '',
            designation: ''
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
                  <i className="pi pi-id-card" />
                  <InputText id="nic" value={values.nic} name='nic' type="text" placeholder="NIC" className={submitCount > 0 && errors.nic ? 'p-invalid w-full' : 'w-full'} aria-describedby="nic_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.nic &&
                  <small id="nic_error" className="p-error">
                    {errors.nic}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="hired_date" className="block text-900 font-medium mb-2">Hired Date</label>
                <Calendar id="hired_date" name='hired_date' value={values.hired_date} className={submitCount > 0 && errors.hired_date ? 'p-invalid w-full' : 'w-full'} aria-describedby="hired_date_error" onChange={handleChange} dateFormat="yy-mm-dd" />
                {submitCount > 0 && errors.hired_date &&
                  <small id="hired_date_error" className="p-error">
                    {errors.hired_date}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="end_date" className="block text-900 font-medium mb-2">End Date</label>
                <Calendar id="end_date" name='end_date' value={values.end_date} className={submitCount > 0 && errors.end_date ? 'p-invalid w-full' : 'w-full'} aria-describedby="end_date_error" onChange={handleChange} dateFormat="yy-mm-dd" />
                {submitCount > 0 && errors.end_date &&
                  <small id="end_date_error" className="p-error">
                    {errors.end_date}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="birthday" className="block text-900 font-medium mb-2">Birthday</label>
                <Calendar id="birthday" name='birthday' value={values.birthday} className={submitCount > 0 && errors.birthday ? 'p-invalid w-full' : 'w-full'} aria-describedby="birthday_error" onChange={handleChange} dateFormat="yy-mm-dd" />
                {submitCount > 0 && errors.birthday &&
                  <small id="birthday_error" className="p-error">
                    {errors.birthday}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="personal_mobile" className="block text-900 font-medium mb-2">Mobile</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-mobile" />
                  <InputMask id="personal_mobile" mask="(999) 999-9999" value={values.personal_mobile} name='personal_mobile' placeholder="(999) 999-9999" className={submitCount > 0 && errors.personal_mobile ? 'p-invalid w-full' : 'w-full'} aria-describedby="personal_mobile_error" onChange={handleChange}></InputMask>
                </div>
                {submitCount > 0 && errors.personal_mobile &&
                  <small id="personal_mobile_error" className="p-error">
                    {errors.personal_mobile}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="bank" className="block text-900 font-medium mb-2">Bank</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-building" />
                  <InputText id="bank" value={values.bank} name='bank' type="text" placeholder="Bank" className={submitCount > 0 && errors.bank ? 'p-invalid w-full' : 'w-full'} aria-describedby="bank_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.bank &&
                  <small id="bank_error" className="p-error">
                    {errors.bank}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="bank_branch" className="block text-900 font-medium mb-2">Bank Branch</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-building" />
                  <InputText id="bank_branch" value={values.bank_branch} name='bank_branch' type="text" placeholder="Bank Branch" className={submitCount > 0 && errors.bank_branch ? 'p-invalid w-full' : 'w-full'} aria-describedby="bank_branch_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.bank_branch &&
                  <small id="bank_branch_error" className="p-error">
                    {errors.bank_branch}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="bank_account_no" className="block text-900 font-medium mb-2">Bank Account No</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-wallet" />
                  <InputText id="bank_account_no" value={values.bank_account_no} name='bank_account_no' type="text" placeholder="Bank Account No" className={submitCount > 0 && errors.bank_account_no ? 'p-invalid w-full' : 'w-full'} aria-describedby="bank_account_no_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.bank_account_no &&
                  <small id="bank_account_no_error" className="p-error">
                    {errors.bank_account_no}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="bank_account_name" className="block text-900 font-medium mb-2">Bank Account Name</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-wallet" />
                  <InputText id="bank_account_name" value={values.bank_account_name} name='bank_account_name' type="text" placeholder="Bank Account Name" className={submitCount > 0 && errors.bank_account_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="bank_account_name_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.bank_account_name &&
                  <small id="bank_account_name_error" className="p-error">
                    {errors.bank_account_name}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="home_address" className="block text-900 font-medium mb-2">Home Address</label>
                <InputTextarea id="home_address" value={values.home_address} name='home_address' placeholder="Home Address" className={submitCount > 0 && errors.home_address ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="home_address_error" />
                {submitCount > 0 && errors.home_address &&
                  <small id="home_address_error" className="p-error">
                    {errors.home_address}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="employment_type" className="block text-900 font-medium mb-2">Employment Type</label>
                <Dropdown id="employment_type" value={values.employment_type} name='employment_type' className={submitCount > 0 && errors.employment_type ? 'p-invalid w-full' : 'w-full'} options={employment_types} onChange={handleChange} aria-describedby="employment_type_error" placeholder="Select a Employment Type" />
                {submitCount > 0 && errors.employment_type &&
                  <small id="employment_type_error" className="p-error">
                    {errors.employment_type}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="designation" className="block text-900 font-medium mb-2">Designation</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-briefcase" />
                  <InputText id="designation" value={values.designation} name='designation' type="text" placeholder="Designation" className={submitCount > 0 && errors.designation ? 'p-invalid w-full' : 'w-full'} aria-describedby="designation_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.designation &&
                  <small id="designation_error" className="p-error">
                    {errors.designation}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="is_user_account_exists" className="block text-900 font-medium mb-2">Is Member Account Exists?</label>
                <InputSwitch checked={values.is_user_account_exists} name='is_user_account_exists' className={submitCount > 0 && errors.is_user_account_exists && 'p-invalid'} aria-describedby="is_user_account_exists_error" onChange={handleChange} />
                {submitCount > 0 && errors.is_user_account_exists &&
                  <small id="is_user_account_exists_error" className="p-error">
                    {errors.is_user_account_exists}
                  </small>
                }
              </div>
              {values.is_user_account_exists == true &&
                <div className="mt-3">
                  <label htmlFor="user_id" className="block text-900 font-medium mb-2">Member</label>
                  <Dropdown id="user_id" value={values.user_id} name='user_id' className={submitCount > 0 && errors.user_id ? 'p-invalid w-full' : 'w-full'} options={members} onChange={handleChange} filter showClear optionLabel="full_name" filterBy="full_name" placeholder="Select a Member"
                    valueTemplate={selectedMemberTemplate} itemTemplate={memberOptionTemplate} aria-describedby="user_id_error" />
                  {submitCount > 0 && errors.user_id &&
                    <small id="user_id_error" className="p-error">
                      {errors.user_id}
                    </small>
                  }
                </div>
              }
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Edit Employee Modal */}
      <Dialog header={renderEditHeader} visible={showEditEmployee} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderEditFooter} onHide={() => setShowEditEmployee(false)}>
        <Formik
          innerRef={editFormRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitEditEmployee(values)}
          initialValues={{
            user_id: selectedRowData?.user_id,
            is_user_account_exists: selectedRowData?.is_user_account_exists == CONSTANTS.user_account_available ? true : false,
            first_name: selectedRowData?.first_name,
            last_name: selectedRowData?.last_name,
            email: selectedRowData?.email,
            nic: selectedRowData?.nic,
            hired_date: moment(selectedRowData?.hired_date)?.tz(timezone)?.toDate(),
            end_date: moment(selectedRowData?.end_date)?.tz(timezone)?.toDate(),
            birthday: moment(selectedRowData?.birthday)?.tz(timezone)?.toDate(),
            personal_mobile: selectedRowData?.personal_mobile,
            bank: selectedRowData?.bank,
            bank_branch: selectedRowData?.bank_branch,
            bank_account_no: selectedRowData?.bank_account_no,
            bank_account_name: selectedRowData?.bank_account_name,
            home_address: selectedRowData?.home_address,
            employment_type: selectedRowData?.employment_type,
            designation: selectedRowData?.designation
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
                  <i className="pi pi-id-card" />
                  <InputText id="nic" value={values.nic} name='nic' type="text" placeholder="NIC" className={submitCount > 0 && errors.nic ? 'p-invalid w-full' : 'w-full'} aria-describedby="nic_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.nic &&
                  <small id="nic_error" className="p-error">
                    {errors.nic}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="hired_date" className="block text-900 font-medium mb-2">Hired Date</label>
                <Calendar id="hired_date" name='hired_date' value={values.hired_date} className={submitCount > 0 && errors.hired_date ? 'p-invalid w-full' : 'w-full'} aria-describedby="hired_date_error" onChange={handleChange} dateFormat="yy-mm-dd" />
                {submitCount > 0 && errors.hired_date &&
                  <small id="hired_date_error" className="p-error">
                    {errors.hired_date}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="end_date" className="block text-900 font-medium mb-2">End Date</label>
                <Calendar id="end_date" name='end_date' value={values.end_date} className={submitCount > 0 && errors.end_date ? 'p-invalid w-full' : 'w-full'} aria-describedby="end_date_error" onChange={handleChange} dateFormat="yy-mm-dd" />
                {submitCount > 0 && errors.end_date &&
                  <small id="end_date_error" className="p-error">
                    {errors.end_date}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="birthday" className="block text-900 font-medium mb-2">Birthday</label>
                <Calendar id="birthday" name='birthday' value={values.birthday} className={submitCount > 0 && errors.birthday ? 'p-invalid w-full' : 'w-full'} aria-describedby="birthday_error" onChange={handleChange} dateFormat="yy-mm-dd" />
                {submitCount > 0 && errors.birthday &&
                  <small id="birthday_error" className="p-error">
                    {errors.birthday}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="personal_mobile" className="block text-900 font-medium mb-2">Mobile</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-mobile" />
                  <InputMask id="personal_mobile" mask="(999) 999-9999" value={values.personal_mobile} name='personal_mobile' placeholder="(999) 999-9999" className={submitCount > 0 && errors.personal_mobile ? 'p-invalid w-full' : 'w-full'} aria-describedby="personal_mobile_error" onChange={handleChange}></InputMask>
                </div>
                {submitCount > 0 && errors.personal_mobile &&
                  <small id="personal_mobile_error" className="p-error">
                    {errors.personal_mobile}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="bank" className="block text-900 font-medium mb-2">Bank</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-building" />
                  <InputText id="bank" value={values.bank} name='bank' type="text" placeholder="Bank" className={submitCount > 0 && errors.bank ? 'p-invalid w-full' : 'w-full'} aria-describedby="bank_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.bank &&
                  <small id="bank_error" className="p-error">
                    {errors.bank}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="bank_branch" className="block text-900 font-medium mb-2">Bank Branch</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-building" />
                  <InputText id="bank_branch" value={values.bank_branch} name='bank_branch' type="text" placeholder="Bank Branch" className={submitCount > 0 && errors.bank_branch ? 'p-invalid w-full' : 'w-full'} aria-describedby="bank_branch_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.bank_branch &&
                  <small id="bank_branch_error" className="p-error">
                    {errors.bank_branch}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="bank_account_no" className="block text-900 font-medium mb-2">Bank Account No</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-wallet" />
                  <InputText id="bank_account_no" value={values.bank_account_no} name='bank_account_no' type="text" placeholder="Bank Account No" className={submitCount > 0 && errors.bank_account_no ? 'p-invalid w-full' : 'w-full'} aria-describedby="bank_account_no_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.bank_account_no &&
                  <small id="bank_account_no_error" className="p-error">
                    {errors.bank_account_no}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="bank_account_name" className="block text-900 font-medium mb-2">Bank Account Name</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-wallet" />
                  <InputText id="bank_account_name" value={values.bank_account_name} name='bank_account_name' type="text" placeholder="Bank Account Name" className={submitCount > 0 && errors.bank_account_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="bank_account_name_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.bank_account_name &&
                  <small id="bank_account_name_error" className="p-error">
                    {errors.bank_account_name}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="home_address" className="block text-900 font-medium mb-2">Home Address</label>
                <InputTextarea id="home_address" value={values.home_address} name='home_address' placeholder="Home Address" className={submitCount > 0 && errors.home_address ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="home_address_error" />
                {submitCount > 0 && errors.home_address &&
                  <small id="home_address_error" className="p-error">
                    {errors.home_address}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="employment_type" className="block text-900 font-medium mb-2">Employment Type</label>
                <Dropdown id="employment_type" value={values.employment_type} name='employment_type' className={submitCount > 0 && errors.employment_type ? 'p-invalid w-full' : 'w-full'} options={employment_types} onChange={handleChange} aria-describedby="employment_type_error" placeholder="Select a Employment Type" />
                {submitCount > 0 && errors.employment_type &&
                  <small id="employment_type_error" className="p-error">
                    {errors.employment_type}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="designation" className="block text-900 font-medium mb-2">Designation</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-briefcase" />
                  <InputText id="designation" value={values.designation} name='designation' type="text" placeholder="Designation" className={submitCount > 0 && errors.designation ? 'p-invalid w-full' : 'w-full'} aria-describedby="designation_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.designation &&
                  <small id="designation_error" className="p-error">
                    {errors.designation}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="is_user_account_exists" className="block text-900 font-medium mb-2">Is Member Account Exists?</label>
                <InputSwitch checked={values.is_user_account_exists} name='is_user_account_exists' className={submitCount > 0 && errors.is_user_account_exists && 'p-invalid'} aria-describedby="is_user_account_exists_error" onChange={handleChange} />
                {submitCount > 0 && errors.is_user_account_exists &&
                  <small id="is_user_account_exists_error" className="p-error">
                    {errors.is_user_account_exists}
                  </small>
                }
              </div>
              {values.is_user_account_exists == true &&
                <div className="mt-3">
                  <label htmlFor="user_id" className="block text-900 font-medium mb-2">Member</label>
                  <Dropdown id="user_id" value={values.user_id} name='user_id' className={submitCount > 0 && errors.user_id ? 'p-invalid w-full' : 'w-full'} options={members} onChange={handleChange} filter showClear optionLabel="full_name" filterBy="full_name" placeholder="Select a Member"
                    valueTemplate={selectedMemberTemplate} itemTemplate={memberOptionTemplate} aria-describedby="user_id_error" />
                  {submitCount > 0 && errors.user_id &&
                    <small id="user_id_error" className="p-error">
                      {errors.user_id}
                    </small>
                  }
                </div>
              }
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  )
}

export default withAuth(Employees)