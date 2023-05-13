import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { ListBox } from 'primereact/listbox';
import { InputSwitch } from 'primereact/inputswitch';
import { Badge } from 'primereact/badge';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { Formik } from 'formik';
import * as yup from 'yup';
import { apiPaths } from '../../../utils/api-paths';
import { getRequest, postRequest } from '../../../utils/axios';
import toaster from '../../../utils/toaster';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { CONSTANTS } from '../../../utils/constants';
import { withAuth } from '../../../utils/withAuth';
import { hasPermission } from '../../../utils/permissions';

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [permissions, setPermissions] = useState([]);
  const [permissionList, setPermissionList] = useState([]);
  const [showAddRole, setShowAddRole] = useState(false);
  const [showEditRole, setShowEditRole] = useState(false);
  const [showRolePermissions, setShowRolePermissions] = useState(false);
  const [isRoleTableLoading, setRoleTableLoading] = useState(false);
  const [isRolePermissionTableloading, setRolePermissionTableloading] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const [isAddRoleLoading, setAddRoleLoading] = useState(false);
  const [isEditRoleLoading, setEditRoleLoading] = useState(false);
  const [editRole, setEditRole] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const menu = useRef(null);
  const formRef = useRef();
  const editFormRef = useRef();

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const schema = yup.object({
    role_name: yup.string().required('Required'),
    role_desc: yup.string().required('Required'),
    permissions: yup.array().required('Required')
  });

  const getAllRoles = async () => {
    setRoleTableLoading(true);
    let respond = await postRequest(apiPaths.GET_ALL_ROLES, { user_count: true });
    if (respond.status) {
      setRoles(respond.data);
    }
    setRoleTableLoading(false);
  }


  //Role Table Action
  const actionButtonTemplate = (rowData) => {
    return (
      <>
        <Menu model={menuItems} popup ref={menu} id="popup_menu" />
        <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
      </>
    )
  }

  //Role Permission Table Action
  const actionSwitchButtonTemplate = (rowData) => {
    return (
      <>
        {selectedRowData?.id != CONSTANTS.admin_role_id && selectedRowData?.id != CONSTANTS.patient_role_id && selectedRowData?.id != CONSTANTS.patient_role_id && hasPermission(26) &&
          <InputSwitch checked={rowData.is_active == CONSTANTS.role_permission_active ? true : false} onChange={(e) => updateRolesPermissionStatus(e.value, rowData)} />
        }
      </>
    )
  }

  //Role Permission Table status column
  const statusColumnTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.is_active == CONSTANTS.role_permission_active ? 'Active' : 'Inactive'} severity={rowData.is_active == CONSTANTS.role_permission_active ? 'success' : 'danger'}></Badge>
      </>
    )
  }

  const updateRolesPermissionStatus = async (state, rowData) => {
    setRoleTableLoading(true);
    let respond = await postRequest(apiPaths.UPDATE_ROLE_PERMISSION, { role_id: rowData.role_id, permission_id: rowData.permission_id, status: state });
    if (respond.status) {
      getAllRolePermissions();
    }
    setRoleTableLoading(false);
  }

  const accept = async () => {
    setRoleTableLoading(true);
    let respond = await postRequest(apiPaths.DELETE_ROLE, { id: selectedRowData?.id });
    if (respond.status) {
      getAllRoles();
    }
    setRoleTableLoading(false);
  }

  const roleTablecolumns = [
    { field: 'role_name', header: 'Name', sortable: true },
    { field: 'role_desc', header: 'Description', sortable: false },
    { field: 'user_count', header: 'Users', sortable: false },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const rolePermissionTableColumns = [
    { field: 'permission_name', header: 'Name', sortable: true },
    { field: 'permission_category', header: 'Category', sortable: true },
    { field: 'permission_desc', header: 'Description', sortable: false },
    { field: 'is_active', header: 'Status', sortable: true, bodyStyle: { textAlign: 'center' }, body: statusColumnTemplate },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionSwitchButtonTemplate }
  ];

  const roleTableDynamicColumns = roleTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} body={col.body} />;
  });

  const rolePermissionTableDynamicColumns = rolePermissionTableColumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} body={col.body} />;
  });

  const renderFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddRole(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus onClick={handleSubmit} loading={isAddRoleLoading} />
      </div>
    );
  }

  const renderEditFooter = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => closeEditModal()} className="p-button-text" />
        <Button label="Update" icon="pi pi-check" autoFocus onClick={handleEditFormSubmit} loading={isEditRoleLoading} />
      </div>
    );
  }

  const renderHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Role</h1>
        <span className='text-600 text-base font-normal'>Create roles for users</span>
      </div>
    );
  }

  const renderEditHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Edit Role</h1>
        <span className='text-600 text-base font-normal'>Update roles for users</span>
      </div>
    );
  }

  const renderRolePermissionHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Role Permissions</h1>
        <span className='text-600 text-base font-normal'>Active/Inactive Role permissions</span>
      </div>
    );
  }


  const permissionTemplate = (option) => {
    return (
      <div className="country-item">
        <span className='font-bold text-lg'>
          <i className="pi pi-unlock mr-2" />
          {option.permission_name} <span className='font-bold text-600'>({option.permission_category})</span>
        </span>
        <p className='font-normal text-400'>{option.permission_desc}</p>
      </div>
    );
  }

  const renderRolePermissionTableHeader = () => {
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

  const getAllRolePermissions = async () => {
    setRolePermissionTableloading(true);
    let respond = await postRequest(apiPaths.GET_ROLE_PERMISSIONS, { id: selectedRowData?.id });
    if (respond.status) {
      setPermissions(respond.data);
      setShowRolePermissions(true);
    }
    setRolePermissionTableloading(false);
  }

  //Add Roles Functions

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const onSubmitRoles = async (values) => {
    //construct permission array
    let permissions = [];
    values?.permissions.map((obj) => {
      permissions.push(obj.id);
    });
    //value object
    let passingObj = { ...values, permissions }

    setAddRoleLoading(true);
    let respond = await postRequest(apiPaths.CREATE_ROLE, passingObj);
    if (respond.status) {
      setShowAddRole(false);
      getAllRoles();
    }
    setAddRoleLoading(false);
  }

  //Edit Role Functions

  const handleEditFormSubmit = () => {
    if (editFormRef.current) {
      editFormRef.current.handleSubmit();
    }
  };

  const onSubmitEditRoles = async (values) => {
    //construct permission array
    let permissions = [];
    values?.permissions.map((obj) => {
      permissions.push(obj.id);
    });
    //value object
    let passingObj = { ...values, permissions, id: editRole?.id }

    setEditRoleLoading(true);
    let respond = await postRequest(apiPaths.UPDATE_ROLE, passingObj);
    if (respond.status) {
      closeEditModal();
      getAllRoles();
    }
    setEditRoleLoading(false);
  }

  const openEditModal = async () => {
    let respond = await postRequest(apiPaths.GET_ROLE, { id: selectedRowData?.id });
    if (respond.status) {
      setEditRole(respond.data);
      setShowEditRole(true);
    }
  }

  const closeEditModal = () => {
    setEditRole({});
    setShowEditRole(false)
  }

  useEffect(() => {
    const getAllPermissions = async () => {
      let respond = await getRequest(apiPaths.GET_ALL_PERMISSIONS);
      if (respond.status) {
        setPermissionList(respond.data);
      }
    }
    getAllRoles();
    getAllPermissions();
  }, [])

  useEffect(() => {
    //set menu items
    const items = [
      {
        label: 'Options',
        items: []
      }
    ]

    if (hasPermission(25)) {
      items[0].items.push({
        label: 'View Permissions',
        icon: 'pi pi-eye',
        command: () => {
          getAllRolePermissions();
        }
      })
    }

    if (hasPermission(23)) {
      items[0].items.push({
        label: 'Update',
        icon: 'pi pi-refresh',
        command: () => {
          if (selectedRowData?.id == CONSTANTS.admin_role_id || selectedRowData?.id == CONSTANTS.patient_role_id || selectedRowData?.id == CONSTANTS.doctor_role_id) {
            toaster("warning", `You cannot update ${selectedRowData.role_name} role`);
          } else {
            openEditModal();
          }
        }
      })
    }

    if(hasPermission(22)){
      items[0].items.push({
        label: 'Delete',
        icon: 'pi pi-trash',
        command: () => {
          if (selectedRowData?.id == CONSTANTS.admin_role_id || selectedRowData?.id == CONSTANTS.patient_role_id || selectedRowData?.id == CONSTANTS.doctor_role_id) {
            toaster("warning", `You cannot delete ${selectedRowData.role_name} role`);
          } else {
            confirmDialog({
              message: 'Do you want to delete this record?',
              header: 'Delete Confirmation',
              icon: 'pi pi-info-circle',
              acceptClassName: 'p-button-danger',
              accept,
            });
          }
        }
      })
    }

    setMenuItems(items);
  }, [selectedRowData])
  

  return (
    <>
      <ConfirmDialog />
      {hasPermission(24) &&
        <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
          <div className='border-bottom-1 surface-border'>
            <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
              Roles
            </h2>
            <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your roles in this page</p>
          </div>
          <div className='flex flex-wrap gap-6 py-6 justify-content-between surface-border'>
            <div className='flex-shrink-0 w-15rem'>
              <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
                Roles
              </h3>
              <p className='mb-4 mt-0 text-700 font-normal text-base'>Add/Edit Roles in your system</p>
              {hasPermission(21) &&
                <Button label="Add a role" className='w-auto' onClick={() => setShowAddRole(true)} />
              }
            </div>
            <div className='flex-auto'>
              <DataTable value={roles} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isRoleTableLoading}>
                {roleTableDynamicColumns}
              </DataTable>
            </div>
          </div>
        </div>
      }

      {/* Add Role Modal */}
      <Dialog header={renderHeader} visible={showAddRole} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddRole(false)}>
        <Formik
          innerRef={formRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitRoles(values)}
          initialValues={{
            role_name: '',
            role_desc: '',
            permissions: [],
          }}>
          {({
            errors,
            handleChange,
            handleSubmit,
            submitCount,
            values
          }) => (
            <form noValidate>
              <label htmlFor="role_name" className="block text-900 font-medium mb-2">Role Name</label>
              <div className="p-input-icon-left w-full">
                <i className="pi pi-lock" />
                <InputText id="role_name" value={values.role_name} name='role_name' type="text" placeholder="Role Name" className={submitCount > 0 && errors.role_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="role_name_error" onChange={handleChange} />
              </div>
              {submitCount > 0 && errors.role_name &&
                <small id="role_name_error" className="p-error">
                  {errors.role_name}
                </small>
              }
              <div className="mt-3">
                <label htmlFor="role_desc" className="block text-900 font-medium mb-2">Role Description</label>
                <InputTextarea id="role_desc" value={values.role_desc} name='role_desc' placeholder="Role Description" className={submitCount > 0 && errors.role_desc ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="role_desc_error" />
                {submitCount > 0 && errors.role_desc &&
                  <small id="role_desc_error" className="p-error">
                    {errors.role_desc}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="permissions" className="block text-900 font-medium mb-2">Role Permissions</label>
                <ListBox value={values.permissions} options={permissionList} name='permissions' onChange={handleChange} multiple filter
                  itemTemplate={permissionTemplate} listStyle={{ maxHeight: '250px' }} className={submitCount > 0 && errors.permissions ? 'p-invalid w-full' : 'w-full'} aria-describedby="permissions_error" />
                {submitCount > 0 && errors.permissions &&
                  <small id="permissions_error" className="p-error">
                    {errors.permissions}
                  </small>
                }
              </div>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Edit Role Modal */}
      <Dialog header={renderEditHeader} visible={showEditRole} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderEditFooter} onHide={() => closeEditModal()}>
        <Formik
          innerRef={editFormRef}
          validationSchema={schema}
          onSubmit={(values) => onSubmitEditRoles(values)}
          initialValues={{
            role_name: editRole?.role_name,
            role_desc: editRole?.role_desc,
            permissions: editRole?.permissions,
          }}>
          {({
            errors,
            handleChange,
            handleSubmit,
            submitCount,
            values
          }) => (
            <form noValidate>
              <label htmlFor="role_name" className="block text-900 font-medium mb-2">Role Name</label>
              <div className="p-input-icon-left w-full">
                <i className="pi pi-lock" />
                <InputText id="role_name" value={values.role_name} name='role_name' type="text" placeholder="Role Name" className={submitCount > 0 && errors.role_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="role_name_error" onChange={handleChange} />
              </div>
              {submitCount > 0 && errors.role_name &&
                <small id="role_name_error" className="p-error">
                  {errors.role_name}
                </small>
              }
              <div className="mt-3">
                <label htmlFor="role_desc" className="block text-900 font-medium mb-2">Role Description</label>
                <InputTextarea id="role_desc" value={values.role_desc} name='role_desc' placeholder="Role Description" className={submitCount > 0 && errors.role_desc ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="role_desc_error" />
                {submitCount > 0 && errors.role_desc &&
                  <small id="role_desc_error" className="p-error">
                    {errors.role_desc}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="permissions" className="block text-900 font-medium mb-2">Role Permissions</label>
                <ListBox value={values.permissions} options={permissionList} name='permissions' onChange={handleChange} multiple filter
                  itemTemplate={permissionTemplate} listStyle={{ maxHeight: '250px' }} className={submitCount > 0 && errors.permissions ? 'p-invalid w-full' : 'w-full'} aria-describedby="permissions_error" />
                {submitCount > 0 && errors.permissions &&
                  <small id="permissions_error" className="p-error">
                    {errors.permissions}
                  </small>
                }
              </div>
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Edit Role Permissions Modal */}
      <Dialog header={renderRolePermissionHeader} visible={showRolePermissions} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} onHide={() => setShowRolePermissions(false)}>
        <DataTable value={permissions} paginator className="p-datatable-customers" header={renderRolePermissionTableHeader} rows={10}
          paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown" rowsPerPageOptions={[10, 25, 50]}
          dataKey="id" filters={filters} rowHover filterDisplay="menu" loading={isRolePermissionTableloading} responsiveLayout="scroll"
          globalFilterFields={['permission_name', 'permission_category']} emptyMessage="No role permissions found."
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries">
          {rolePermissionTableDynamicColumns}
        </DataTable>
      </Dialog>
    </>
  )
}

export default withAuth(Roles)