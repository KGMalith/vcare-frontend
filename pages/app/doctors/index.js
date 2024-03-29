import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Menu } from 'primereact/menu';
import { useRouter } from 'next/router';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { Avatar } from 'primereact/avatar';
import { getRequest } from '../../../utils/axios';
import { apiPaths } from '../../../utils/api-paths';
import { withAuth } from '../../../utils/withAuth';
import { hasPermission } from '../../../utils/permissions';

const Doctors = () => {
    const [doctors, setDoctors] = useState([]);

    const items = [
        {
            label: 'Options',
            items:
                [
                    {
                        label: 'View',
                        icon: 'pi pi-eye',
                        command: () => {
                            router.push('/app/doctors/' + selectedRowData?.id)
                        }
                    },
                ]
        },
    ];

    const [isDoctorsTableLoading, setDoctorsTableLoading] = useState(false);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [selectedRowData, setSelectedRowData] = useState(null);
    const menu = useRef(null);
    const router = useRouter();

    const [filters, setFilters] = useState({
        'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
    });

    const renderDoctorsTableHeader = () => {
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

    //Doctors Table Full Name
    const doctorNameItemTemplate = (rowData) => {
        return (
            <div className='flex flex-row align-items-center'>
                {rowData.image ?
                    <Avatar image={rowData.image} className="mr-2" size="large" shape="circle" />
                    :
                    <Avatar icon="pi pi-user" className="mr-2" size="large" shape="circle" />
                }
                <span>{rowData.first_name + ' ' + rowData.last_name}</span>
            </div>
        );
    }

    //Doctor Table Action
    const actionButtonTemplate = (rowData) => {
        return (
            <>
                <Menu model={items} popup ref={menu} id="popup_menu" />
                <Button icon="pi pi-ellipsis-v" className='p-button-secondary p-button-text' onClick={(event) => { menu.current.toggle(event); setSelectedRowData(rowData) }} aria-controls="popup_menu" aria-haspopup />
            </>
        )
    }

    const doctorsTablecolumns = [
        { field: 'doctor_code', header: 'Code', sortable: true, style: { minWidth: '12rem' } },
        { field: 'full_name', header: 'Name', sortable: true, body: doctorNameItemTemplate, style: { minWidth: '20rem' } },
        { field: 'email', header: 'Email', sortable: false, style: { minWidth: '25rem' } },
        { field: 'mobile', header: 'Mobile', sortable: false, style: { minWidth: '10rem' } },
        { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
    ];

    const doctorsTableDynamicColumns = doctorsTablecolumns.map((col, i) => {
        return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
    });

    useEffect(() => {

        const getAllDoctors = async () => {
            setDoctorsTableLoading(true)
            let respond = await getRequest(apiPaths.GET_ALL_DOCTORS);
            if (respond.status) {
                setDoctors(respond.data);
            }
            setDoctorsTableLoading(false)
        }

        getAllDoctors();

    }, [])

    return (
        <>
            {hasPermission(43) &&
                <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
                    <div className='border-bottom-1 surface-border'>
                        <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
                            Doctors
                        </h2>
                        <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your doctors in this page</p>
                    </div>
                    <div className='grid py-6 surface-border'>
                        <div className='col-12'>
                            <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
                                Doctors
                            </h3>
                            <p className='mb-4 mt-0 text-700 font-normal text-base'>View all doctors in your organization</p>
                        </div>
                        <div className='col-12'>
                            <DataTable value={doctors} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isDoctorsTableLoading} filters={filters} header={renderDoctorsTableHeader}>
                                {doctorsTableDynamicColumns}
                            </DataTable>
                        </div>
                    </div>
                </div>
            }
        </>
    )
}

export default withAuth(Doctors)