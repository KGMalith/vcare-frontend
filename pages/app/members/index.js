import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { ListBox } from 'primereact/listbox';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';
import { FilterMatchMode } from 'primereact/api';
import { Formik } from 'formik';
import * as yup from 'yup';
import { apiPaths } from '../../../utils/api-paths';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { getRequest, postRequest } from '../../../utils/axios';
import { CONSTANTS } from '../../../utils/constants';

const Members = () => {
  const [members, setMembers] = useState([]);
  const [roleList, setRoleList] = useState([]);
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState(false);
  const [isMembersTableLoading, setMembersTableLoading] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [addMemberLoading, setAddMemberLoading] = useState(false);
  const [editMemberLoading, setEditMemberLoading] = useState(false);
  const formRef = useRef();
  const editFormRef = useRef();
  const menu = useRef(null);

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const schema = yup.object({
    first_name: yup.string().required('Required'),
    last_name: yup.string().required('Required'),
    email: yup.string().email('Invalid Email').required('Required'),
    role_id: yup.object().required('Required'),
  });

  //Members Table Full Name
  const userNameItemTemplate = (rowData) => {
    return (
      <div className='flex flex-row align-items-center'>
        {rowData.image ?
          <Avatar image={rowData.image} className="mr-2" size="large" shape="circle" />
          :
          <Avatar icon="pi pi-user" className="mr-2" size="large" shape="circle" />
        }
        <span className="image-text">{rowData.first_name} {rowData.last_name}</span>
      </div>
    );
  }

  //Members Table Role Name
  const roleNameItemTemplate = (rowData) => {
    return (
      <div className='flex flex-row align-items-center'>
        <span className="image-text">{rowData.role_id.role_name}</span>
      </div>
    );
  }

  //Members Table signup completed column
  const signupCompleteItemTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.is_signup_completed == 1 ? 'Completed' : 'Pending'} severity={rowData.is_signup_completed == 1 ? 'success' : 'warning'}></Badge>
      </>
    )
  }

  //Members Table invitation sent column
  const invitationSentItemTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.is_invitation_sent == 1 ? 'Sent' : 'Not Sent'} severity={rowData.is_invitation_sent == 1 ? 'success' : 'warning'}></Badge>
      </>
    )
  }

  //Members Table status column
  const statusItemTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.status == 0 ? 'Pending' : rowData.status == 1 ? 'Active' : rowData.status == -10 && 'Inactive'} severity={rowData.status == 0 ? 'warning' : rowData.status == 1 ? 'success' : rowData.status == -10 && 'danger'}></Badge>
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
    { field: 'user_code', header: 'Code', sortable: true, style: { minWidth: '10rem' } },
    { field: 'full_name', header: 'Name', sortable: true, body: userNameItemTemplate, style: { minWidth: '18rem' } },
    { field: 'email', header: 'Email', sortable: false, style: { minWidth: '20rem' } },
    { field: 'role_name', header: 'Role', sortable: false, style: { minWidth: '12rem' }, body: roleNameItemTemplate, },
    { field: 'is_signup_completed', header: 'Signup Status', sortable: false, body: signupCompleteItemTemplate, style: { minWidth: '8rem' } },
    { field: 'is_invitation_sent', header: 'Invitation Status', sortable: false, body: invitationSentItemTemplate, style: { minWidth: '8rem' } },
    { field: 'status', header: 'Status', sortable: false, body: statusItemTemplate, style: { minWidth: '8rem' } },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const items = [
    {
      label: 'Options',
      items: selectedRowData?.status == 1 ?
        [
          {
            label: 'Update User',
            icon: 'pi pi-user-edit',
            command: () => {
              setShowEditMember(true);
            }
          },
          {
            label: 'Deactivate User',
            icon: 'pi pi-user-minus',
            command: () => {
              confirmDialog({
                message: 'Do you want to deactivate this member?',
                header: 'User Deactivate Confirmation',
                icon: 'pi pi-info-circle',
                acceptClassName: 'p-button-danger',
                accept: deactivateUser,
              });
            }
          }
        ]
        : selectedRowData?.status == -10 ?
          [
            {
              label: 'Update User',
              icon: 'pi pi-user-edit',
              command: () => {
                setShowEditMember(true);
              }
            },
            {
              label: 'Activate User',
              icon: 'pi pi-user-plus',
              command: () => {
                confirmDialog({
                  message: 'Do you want to activate this member?',
                  header: 'User Activation Confirmation',
                  icon: 'pi pi-info-circle',
                  acceptClassName: 'p-button-primary',
                  accept: activateUser,
                });
              }
            },
          ]
          :
          [
            {
              label: 'Update User',
              icon: 'pi pi-user-edit',
              command: () => {
                setShowEditMember(true);
              }
            },
          ]
    },
  ];

  const membersTableDynamicColumns = membersTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
  });

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddMember(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} loading={addMemberLoading} />
      </div>
    );
  }

  const renderEditFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowEditMember(false)} className="p-button-text" />
        <Button label="Update" icon="pi pi-check" autoFocus type='button' onClick={editMemberHandleSubmit} loading={editMemberLoading} />
      </div>
    );
  }

  const renderHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Member</h1>
        <span className='text-600 text-base font-normal'>Create system user</span>
      </div>
    );
  }

  const renderEditHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Edit Member</h1>
        <span className='text-600 text-base font-normal'>Update system user</span>
      </div>
    );
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const editMemberHandleSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit();
    }
  };

  const onSubmitMember = async (values) => {
    //value object
    let passingObj = { ...values, role_id: values.role_id.id }

    setAddMemberLoading(true);
    let respond = await postRequest(apiPaths.CREATE_MEMBER, passingObj);
    if (respond.status) {
      getAllMembers();
      setShowAddMember(false);
    }
    setAddMemberLoading(false);
  }

  const onSubmitEditMember = async (values) => {
    //value object
    let passingObj = { ...values, role_id: values.role_id.id,id:selectedRowData?.id }

    setEditMemberLoading(true);
    let respond = await postRequest(apiPaths.UPDATE_MEMBER, passingObj);
    if (respond.status) {
      getAllMembers();
      setShowEditMember(false);
    }
    setEditMemberLoading(false);
  }

  const activateUser = async () => {
    setMembersTableLoading(true);
    let respond = await postRequest(apiPaths.UPDATE_USER_STATUS, { user_id: selectedRowData.id, status: CONSTANTS.user_active });
    if (respond.status) {
      getAllMembers();
    }
    setMembersTableLoading(false);
  }

  const deactivateUser = async () => {
    setMembersTableLoading(true);
    let respond = await postRequest(apiPaths.UPDATE_USER_STATUS, {user_id:selectedRowData.id,status:CONSTANTS.user_deactivated});
    if (respond.status) {
      getAllMembers();
    }
    setMembersTableLoading(false);
  }

  const roleTemplate = (option) => {
    return (
      <div className="country-item">
        <span className='font-bold text-lg'>
          <i className="pi pi-unlock mr-2" />
          {option.role_name}
        </span>
        <p className='font-normal text-400'>{option.role_desc}</p>
      </div>
    );
  }

  const onGlobalFilterChange = (e) => {
    const value = e.target.value;
    let _filters = { ...filters };
    _filters['global'].value = value;

    setFilters(_filters);
    setGlobalFilterValue(value);
  }

  const renderMemberTableHeader = () => {
    return (
      <div className="flex justify-content-end align-items-center">
        <span className="p-input-icon-left">
          <i className="pi pi-search" />
          <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Keyword Search" />
        </span>
      </div>
    )
  }

  useEffect(() => {
    const getAllRoles = async () => {
      let respond = await postRequest(apiPaths.GET_ALL_ROLES,{user_count:false});
      if (respond.status) {
        let index1 = (respond.data).findIndex((obj) => obj.id == 2);
        (respond.data).splice(index1, 1);
        let index2 = (respond.data).findIndex((obj) => obj.id == 3);
        (respond.data).splice(index2, 1);
        setRoleList(respond.data);
      }
    }
    getAllRoles();
    getAllMembers();
  }, [])

  const getAllMembers = async () => {
    setMembersTableLoading(true);
    let respond = await getRequest(apiPaths.GET_ALL_MEMBERS);
    if (respond.status) {
      setMembers(respond.data);
    }
    setMembersTableLoading(false);
  }


  return (
    <>
      <ConfirmDialog />
      <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
        <div className='border-bottom-1 surface-border'>
          <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
            Members
          </h2>
          <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your members in this page</p>
        </div>
        <div className='grid py-6 surface-border'>
          <div className='col-12 lg:col-3'>
            <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
              Members
            </h3>
            <p className='mb-4 mt-0 text-700 font-normal text-base'>Add/Edit Members in your system</p>
            <Button label="Add a member" className='w-auto' onClick={() => setShowAddMember(true)} />
          </div>
          <div className='col-12 lg:col-9'>
            <DataTable value={members} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" emptyMessage="No roles found." rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isMembersTableLoading} filters={filters} header={renderMemberTableHeader}>
              {membersTableDynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>

      {/* Add Members Modal */}
      <Dialog header={renderHeader} visible={showAddMember} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddMember(false)}>
        <Formik
          innerRef={formRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitMember(values)}
          initialValues={{
            first_name: '',
            last_name: '',
            email: '',
            role_id: '',
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
                <label htmlFor="role_id" className="block text-900 font-medium mb-2">Role</label>
                <ListBox value={values.role_id} options={roleList} name='role_id' onChange={handleChange} filter
                  itemTemplate={roleTemplate} listStyle={{ maxHeight: '250px' }} className={submitCount > 0 && errors.role_id ? 'p-invalid w-full' : 'w-full'} aria-describedby="role_error" />
                {submitCount > 0 && errors.role_id &&
                  <small id="role_error" className="p-error">
                    {errors.role_id}
                  </small>
                }
              </div>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Edit Members Modal */}
      <Dialog header={renderEditHeader} visible={showEditMember} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderEditFooter} onHide={() => setShowEditMember(false)}>
        <Formik
          innerRef={editFormRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitEditMember(values)}
          initialValues={{
            first_name: selectedRowData?.first_name,
            last_name: selectedRowData?.last_name,
            email: selectedRowData?.email,
            role_id: selectedRowData?.role_id,
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
                <label htmlFor="role_id" className="block text-900 font-medium mb-2">Role</label>
                <ListBox value={values.role_id} options={roleList} name='role_id' onChange={handleChange} filter
                  itemTemplate={roleTemplate} listStyle={{ maxHeight: '250px' }} className={submitCount > 0 && errors.role_id ? 'p-invalid w-full' : 'w-full'} aria-describedby="role_error" />
                {submitCount > 0 && errors.role_id &&
                  <small id="role_error" className="p-error">
                    {errors.role_id}
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

export default Members