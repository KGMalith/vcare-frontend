import React, { useEffect, useState, useRef } from 'react';
import { DataTable } from 'primereact/datatable';
import { FilterMatchMode} from 'primereact/api';
import { Column } from 'primereact/column';
import { Menu } from 'primereact/menu';
import { InputText } from 'primereact/inputtext';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { useRouter } from 'next/router';

const Bills = () => {
  const [bills, setBills] = useState([
    {
      id: 1,
      bill_code: 'test',
      gross_total: 20,
      discount: 5,
      received_amount:100,
      grand_total:100,
      status:10,
      payment_type:null,
      patient_admission:null,
      patient_appointment:1,
    },
    {
      id: 2,
      bill_code: 'test1',
      gross_total: 10,
      discount: 1,
      received_amount:100,
      grand_total:100,
      status:0,
      payment_type:1,
      patient_admission:1,
      patient_appointment:null,
    },
  ]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [isRoleTableLoading, setRoleTableLoading] = useState(false);
  const [globalFilterValue, setGlobalFilterValue] = useState('');
  const menu = useRef(null);
  const router = useRouter();

  const [filters, setFilters] = useState({
    'global': { value: null, matchMode: FilterMatchMode.CONTAINS },
  });

  const renderBillTableHeader = () => {
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

  //Bill Table gross total column
  const grossTotalItemTemplate = (rowData) => {
    return (
      <>
        <span>{rowData.gross_total?(rowData.gross_total).toFixed(2):null}</span>
      </>
    )
  }

  //Bill Table discount column
  const discountItemTemplate = (rowData) => {
    return (
      <>
        <span>{rowData.discount?(rowData.discount).toFixed(2):null}</span>
      </>
    )
  }

  //Bill Table received_amount column
  const receivedAmountItemTemplate = (rowData) => {
    return (
      <>
        <span>{rowData.received_amount?(rowData.received_amount).toFixed(2):null}</span>
      </>
    )
  }

  //Bill Table grand_total column
  const grandTotalItemTemplate = (rowData) => {
    return (
      <>
        <span>{rowData.grand_total?(rowData.grand_total).toFixed(2):null}</span>
      </>
    )
  }

  //Bill Table payment_type column
  const paymentTypeItemTemplate = (rowData) => {
    return (
      <>
        <span>{(rowData.payment_type && rowData.payment_type == 0)? 'Cash':rowData.payment_type && rowData.payment_type == 1?'Card':null}</span>
      </>
    )
  }

  //Bill Table billing type column
  const billingTypeItemTemplate = (rowData) => {
    return (
      <>
        <span>{rowData.patient_admission? 'Admission':rowData.patient_appointment?'Appointment':null}</span>
      </>
    )
  }

  //Bill Table status column
  const statusItemTemplate = (rowData) => {
    return (
      <>
        <Badge value={rowData.status == 0 ? 'Pending' : rowData.status == 10? 'Paid':rowData.status == 20? 'Bill Finalized':rowData.status == -10 && 'Cancelled'} severity={rowData.status == 0 ? 'warning' : rowData.status == 10? 'success':rowData.status == 20? 'info':rowData.status == -10 && 'danger'}></Badge>
      </>
    )
  }

  //Bill Table Action
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
      items: [
        {
          label: 'View',
          icon: 'pi pi-eye',
          command: () => {
            router.push('/app/bills/'+selectedRowData.id)
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


  const billTablecolumns = [
    { field: 'bill_code', header: 'Code', sortable: true, style: { minWidth: '8rem' } },
    { field: 'gross_total', header: 'Gross Total', sortable: true, body: grossTotalItemTemplate, style: { minWidth: '8rem' } },
    { field: 'discount', header: 'Discount', sortable: false, body: discountItemTemplate, style: { minWidth: '8rem' } },
    { field: 'received_amount', header: 'Received Amount', sortable: false, body: receivedAmountItemTemplate, style: { minWidth: '8rem' } },
    { field: 'grand_total', header: 'Grand Total', sortable: false, body: grandTotalItemTemplate, style: { minWidth: '8rem' } },
    { field: 'payment_type', header: 'Payment Type', sortable: false, body: paymentTypeItemTemplate, style: { minWidth: '8rem' } },
    { field: 'patient_admission', header: 'Billing Type', sortable: false, body: billingTypeItemTemplate, style: { minWidth: '10rem' } },
    { field: 'status', header: 'Status', sortable: false, body: statusItemTemplate, style: { minWidth: '8rem' } },
    { field: 'action', header: '', sortable: false, headerStyle: { width: '10%', minWidth: '8rem' }, bodyStyle: { textAlign: 'center' }, body: actionButtonTemplate }
  ];

  const billTableDynamicColumns = billTablecolumns.map((col, i) => {
    return <Column key={col.field} field={col.field} header={col.header} sortable={col.sortable} headerStyle={col.headerStyle} bodyStyle={col.bodyStyle} style={col.style} body={col.body} />;
  });

  return (
    <>
      <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
        <div className='border-bottom-1 surface-border'>
          <h2 className='mt-0 mb-2 text-900 font-bold text-4xl'>
            Bills
          </h2>
          <p className='mt-0 mb-5 text-700 font-normal text-base'>You can easily manage your hospital bills in this page</p>
        </div>
        <div className='flex flex-wrap gap-6 py-6 justify-content-between surface-border'>
          <div className='flex-shrink-0 w-12'>
            <h3 className='mb-4 mt-0 text-900 font-medium text-xl'>
              Bills
            </h3>
            <p className='mb-4 mt-0 text-700 font-normal text-base'>Manage hospital bills in your system</p>
          </div>
          <div className='w-12'>
            <DataTable value={bills} scrollable scrollHeight="400px" responsiveLayout="scroll" paginator paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
              currentPageReportTemplate="Showing {first} to {last} of {totalRecords}" rows={10} rowsPerPageOptions={[10, 20, 50]} removableSort loading={isRoleTableLoading} filters={filters} header={renderBillTableHeader}>
              {billTableDynamicColumns}
            </DataTable>
          </div>
        </div>
      </div>
    </>
  )
}

export default Bills