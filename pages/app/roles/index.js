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

const Roles = () => {
  const [roles, setRoles] = useState([
    {
      id: 1,
      role_name: 'test',
      role_desc: 'teasahs jaskjak',
      user_count: 5
    },
    {
      id: 2,
      role_name: 'test1',
      role_desc: 'teasahs jaskjakfffffakljkcjacjl',
      user_count: 1
    },
    {
      id: 3,
      role_name: 'test2',
      role_desc: 'teasahs jaskjaksad',
      user_count: 2
    },
    {
      id: 4,
      role_name: 'test',
      role_desc: 'teasahs jaskjak',
      user_count: 5
    },
    {
      id: 5,
      role_name: 'test1',
      role_desc: 'teasahs jaskjakfffffakljkcjacjl',
      user_count: 1
    },
    {
      id: 6,
      role_name: 'test2',
      role_desc: 'teasahs jaskjaksad',
      user_count: 2
    },
    {
      id: 7,
      role_name: 'test',
      role_desc: 'teasahs jaskjak',
      user_count: 5
    },
    {
      id: 8,
      role_name: 'test1',
      role_desc: 'teasahs jaskjakfffffakljkcjacjl',
      user_count: 1
    },
    {
      id: 9,
      role_name: 'test2',
      role_desc: 'teasahs jaskjaksad',
      user_count: 2
    },
    {
      id: 10,
      role_name: 'test',
      role_desc: 'teasahs jaskjak',
      user_count: 5
    },
    {
      id: 11,
      role_name: 'test1',
      role_desc: 'teasahs jaskjakfffffakljkcjacjl',
      user_count: 1
    },
    {
      id: 12,
      role_name: 'test2',
      role_desc: 'teasahs jaskjaksad',
      user_count: 2
    }
  ]);
  const [permissions, setPermissions] = useState([
    {
      permission_name: 'test',
      permission_category: 'category 1',
      permission_desc: 'sajslacj jalssasjcla alsjlkcjlac',
      role_id: 1,
      is_active: 1
    },
    {
      permission_name: 'test1',
      permission_category: 'category 1',
      permission_desc: 'sajslacj jalssasjcla alsjlkcjlac',
      role_id: 1,
      is_active: 1
    },
    {
      permission_name: 'test',
      permission_category: 'category 2',
      permission_desc: 'sajslacj jalssasjcla alsjlkcjlac',
      role_id: 1,
      is_active: 1
    },
    {
      permission_name: 'test2',
      permission_category: 'category 2',
      permission_desc: 'sajslacj jalssasjcla alsjlkcjlac',
      role_id: 1,
      is_active: 1
    },
    {
      permission_name: 'test3',
      permission_category: 'category 2',
      permission_desc: 'sajslacj jalssasjcla alsjlkcjlac',
      role_id: 1,
      is_active: 1
    },
  ])
  const [permissionList, setPermissionList] = useState([
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
  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });
  const [showAddRole, setShowAddRole] = useState(false);
  const [showRolePermissions, setShowRolePermissions] = useState(false);
  const [isRoleTableLoading, setRoleTableLoading] = useState(false);
  const [isRolePermissionTableloading, setRolePermissionTableloading] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const menu = useRef(null);
  const formRef = useRef();

  const schema = yup.object({
    role_name: yup.string().required('Required'),
    role_desc: yup.string().required('Required'),
    permissions: yup.array().required('Required')
  });

  //Role Table Action
  const actionButtonTemplate = (rowData) => {
    return (
      <>
        <Menu model={items} popup ref={menu} id="popup_menu" />
        <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
      </>
    )
  }

  //Role Permission Table Action
  const actionSwitchButtonTemplate = (rowData) => {
    return (
      <>
        <InputSwitch checked={rowData.is_active == 1 ? true : false} onChange={(e) => updateRolesPermissionStatus(e.value, rowData)} />
      </>
    )
  }

  //Role Permission Table status column
  const statusColumnTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.is_active == 1 ? 'Active' : 'Inactive'} severity={rowData.is_active == 1 ? 'success' : 'danger'}></Badge>
      </>
    )
  }

  const updateRolesPermissionStatus = async (state, rowData) => {
    console.log(state)
    console.log(rowData)
  }

  const onSubmitRoles = async (values) => {
    console.log(values)
  }

  const roleTablecolumns = [
    { field: 'role_name', header: 'Name', sortable: true },
    { field: 'role_desc', header: 'Description', sortable: false },
    { field: 'user_count', header: 'Users', sortable: false },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const rolePermissionTableColumns = [
    { field: 'permission_name', header: 'Name', sortable: true },
    { field: 'permission_category', header: 'Users', sortable: true },
    { field: 'permission_desc', header: 'Description', sortable: false },
    { field: 'is_active', header: 'Status', sortable: true, bodyStyle: { textAlign: 'center' }, body: statusColumnTemplate },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionSwitchButtonTemplate }
  ];

  const items = [
    {
      label: 'Options',
      items: [
        {
          label: 'View Permissions',
          icon: 'pi pi-eye',
          command: () => {
            console.log(' val=====', selectedRowData)
            setShowRolePermissions(true)
            // toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
          }
        },
        {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => {
            // toast.current.show({ severity: 'success', summary: 'Updated', detail: 'Data Updated', life: 3000 });
          }
        },
        {
          label: 'Delete',
          icon: 'pi pi-trash',
          command: () => {
            // toast.current.show({ severity: 'warn', summary: 'Delete', detail: 'Data Deleted', life: 3000 });
          }
        }
      ]
    },
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
        <Button label="Create" icon="pi pi-check" autoFocus onClick={handleSubmit} />
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

  const renderRolePermissionHeader = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Role Permissions</h1>
        <span className='text-600 text-base font-normal'>Active/Inactive Role permissions</span>
      </div>
    );
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const permissionTemplate = (option) => {
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

  return (
    <>
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
            <Button label="Add a role" className='w-auto' onClick={() => setShowAddRole(true)} />
          </div>
          <div className='flex-auto'>
            <DataTable value={roles} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" emptyMessage="No roles found." rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isRoleTableLoading}>
              {roleTableDynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>

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

export default Roles