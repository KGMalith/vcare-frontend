import React, { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { FilterMatchMode } from 'primereact/api';
import { useRouter } from 'next/router';
import { Avatar } from 'primereact/avatar';

const Patients = () => {
    const [patients, setPatients] = useState([
        {
            id: 1,
            emp_code: 'test',
            full_name: 'teasahs jaskjak',
            email: 'test@gmail.com',
            image: '',
            personal_mobile: '13378271',
            designation: 'Manager'
        },
        {
            id: 2,
            emp_code: 'tes2',
            full_name: 'teasahs jaskjak',
            email: 'test2@gmail.com',
            image: '',
            personal_mobile: '0192192912',
            designation: 'Nurse'
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
                  router.push('/app/patients/'+selectedRowData.id)
                }
              },
            ]
        },
      ];
    
    const [isPatientsTableLoading, setPatientsTableLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);
    const menu = useRef(null);
    const router = useRouter();

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const renderPatientsTableHeader = () => {
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

    //Patient Table Full Name
    const patientNameItemTemplate = (rowData) => {
        return (
            <div className='flex flex-row align-items-center'>
                {rowData.image ?
                    <Avatar image={rowData.image} className="mr-2" size="large" shape="circle" />
                    :
                    <Avatar icon="pi pi-user" className="mr-2" size="large" shape="circle" />
                }
                <span>{rowData.full_name}</span>
            </div>
        );
    }

    //Patient Table Action
    const actionButtonTemplate = (rowData) => {
        return (
            <>
                <Menu model={items} popup ref={menu} id="popup_menu" />
                <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
            </>
        )
    }

    const patientsTablecolumns = [
        { field: 'patient_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
        { field: 'full_name', header: 'Name', sortable: true, body: patientNameItemTemplate, style: { minWidth: '14rem' } },
        { field: 'email', header: 'Email', sortable: false, style: { minWidth: '14rem' } },
        { field: 'mobile', header: 'Mobile', sortable: false, style: { minWidth: '10rem' } },
        { field: 'nic', header: 'NIC', sortable: false, style: { minWidth: '8rem' } },
        { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
    ];

    const patientsTableDynamicColumns = patientsTablecolumns.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
    });



    return (
        <>
            <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
                <div className='border-bottom-1 surface-border'>
                    <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
                        Patients
                    </h2>
                    <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your patients in this page</p>
                </div>
                <div className='grid py-6 surface-border'>
                    <div className='col-12'>
                        <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
                            Patients
                        </h3>
                        <p className='mb-4 mt-0 text-700 font-normal text-base'>Manage Patients in your organization</p>
                    </div>
                    <div className='col-12'>
                        <DataTable value={patients} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isPatientsTableLoading} filters={filters} header={renderPatientsTableHeader}>
                            {patientsTableDynamicColumns}
                        </DataTable>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Patients