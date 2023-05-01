import React, { useEffect, useState, useRef } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { ListBox } from 'primereact/listbox';
import { Formik } from 'formik';
import * as yup from 'yup';

const Bill = () => {
    const [billDetails, setBillDetails] = useState({});
    const [activeIndex, setactiveIndex] = useState(0)
    const [showAddService, setShowAddService] = useState(false);
    const items = [
        { label: 'Details', icon: 'pi pi-fw pi-file' },
        { label: 'Services', icon: 'pi pi-chart-line' },
    ];
    const [serviceList, setServiceList] = useState([
        { service_code: 'Australia', service_name:'shajshx', id: 'AU', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'Brazil', service_name:'shajshx', id: 'BR', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'China', service_name:'shajshx', id: 'CN', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'Egypt', service_name:'shajshx', id: 'EG', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'France', service_name:'shajshx', id: 'FR', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'Germany', service_name:'shajshx', id: 'DE', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'India', service_name:'shajshx', id: 'IN', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'Japan', service_name:'shajshx', id: 'JP', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'Spain', service_name:'shajshx', id: 'ES', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 },
        { service_code: 'United States', service_name:'shajshx', id: 'US', service_desc: 'sasasjkacjsakjckc jaksjka jaksjaksjacksjc kasjks', service_charge: 100 }
    ]);
    const formRef = useRef();

    const renderHeader = () => {
        return (
            <div className='flex flex-column gap-2'>
                <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Billing Service</h1>
                <span className='text-600 text-base font-normal'>Add billing service for current bill</span>
            </div>
        );
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddService(false)} className="p-button-text" />
                <Button label="Create" icon="pi pi-check" autoFocus onClick={handleSubmit} />
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
                    {option.service_code} - {option.service_name}&nbsp;&nbsp;{(option.service_charge).toFixed(2)}
                </span>
                <p className='font-normal text-400'>{option.service_desc}</p>
            </div>
        );
    }

    return (
        <>
            <div className='surface-section surface-card shadow-2 border-round flex-auto xl:ml-5'>
                <div className='surface-section px-5 pt-5'>
                    <TabMenu model={items} onTabChange={(e) => setactiveIndex(e.index)} activeIndex={activeIndex} />
                </div>
                <div className='surface-section px-5 py-5'>
                    <div className='flex align-items-start flex-column lg:flex-row lg:justify-content-between'>
                        <div className='flex align-items-start flex-column md:flex-row'>
                            <div>
                                <span className='text-900 font-medium text-3xl'>B-0001</span>
                                <div className='flex align-items-center flex-wrap text-sm'>
                                    <div className='mr-5 mt-3'>
                                        <span className='font-semibold text-500'>
                                            <i className='pi pi-history mr-1'></i>
                                            Status
                                        </span>
                                        <Badge value={billDetails?.status == 0 ? 'Pending' : billDetails?.status == 10 ? 'Paid' : billDetails?.status == 20 ? 'Bill Finalized' : billDetails?.status == -10 && 'Cancelled'} severity={billDetails?.status == 0 ? 'warning' : billDetails?.status == 10 ? 'success' : billDetails?.status == 20 ? 'info' : billDetails?.status == -10 && 'danger'}></Badge>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='px-6 py-5 surface-ground'>
                    {activeIndex == 0 ?
                        <div className='surface-card p-4 shadow-2 border-round'>
                            <div className='font-medium text-3xl text-900 mb-3'>Bill Details</div>
                            <div className='text-500 mb-5'>All details related to bill are down below</div>
                            <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Bill Code</div>
                                    <div className='text-900 w-full md:w-9'>BILL-001</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Gross Total</div>
                                    <div className='text-900 w-full md:w-9'>100</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Discount</div>
                                    <div className='text-900 w-full md:w-9'>20</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Received Amount</div>
                                    <div className='text-900 w-full md:w-9'>100</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Grand Total</div>
                                    <div className='text-900 w-full md:w-9'>100</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Payment Type</div>
                                    <div className='text-900 w-full md:w-9'>Cash</div>
                                </li>
                                <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                    <div className='text-500 w-full md:w-3 font-medium'>Status</div>
                                    <div className='text-900 w-full md:w-9'>
                                        <Badge value="Yes" severity="success"></Badge>
                                        {/* <Badge value="No" severity="warning"></Badge> */}
                                    </div>
                                </li>
                            </ul>
                        </div>
                        : activeIndex == 1 &&
                        <div className='surface-card p-4 shadow-2 border-round'>
                            <div className='font-medium text-3xl text-900 mb-3'>
                                Billing Services
                                <Button icon="pi pi-chart-line" label="Add Billing Service" style={{ float: 'right' }} onClick={() => setShowAddService(true)} />
                            </div>
                            <div className='text-500 mb-5'>All linkied billing services related to this bill are down below</div>
                            <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground gap-3 md:gap-0'>
                                    <div className='text-500 font-semibold w-full md:w-3'>
                                        SER-001 : teting
                                    </div>
                                    <div className=' w-full md:w-5'>
                                        <p className='text-900 mb-0'>Agjask kals</p>
                                    </div>
                                    <div className=' w-full md:w-2'>
                                        <p className='text-900 mb-0'>2000.00</p>
                                    </div>
                                    <div className='text-900 w-full md:w-2 flex gap-3 justify-content-end'>
                                        <Button icon="pi pi-trash" label="Delete" className='p-button-outlined p-button-danger' />
                                    </div>
                                </li>
                            </ul>
                        </div>
                    }
                </div>
            </div>

            {/* Add Services Modal */}
            <Dialog header={renderHeader} visible={showAddService} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddService(false)}>
                <Formik
                    innerRef={formRef}
                    // validationSchema={schema}
                    onSubmit={(values) => onSubmitRoles(values)}
                    initialValues={{
                        service_id: '',
                    }}>
                    {({
                        errors,
                        handleChange,
                        handleSubmit,
                        setFieldValue,
                        submitCount,
                        values
                    }) => (
                        <form noValidate>
                            <div>
                                <label htmlFor="service_id" className="block text-900 font-medium mb-2">Service</label>
                                <ListBox value={values.service_id} options={serviceList} name='service_id' onChange={(e)=>setFieldValue('service_id',e.value.id)} filter
                                    itemTemplate={permissionTemplate} listStyle={{ maxHeight: '250px' }} className={submitCount > 0 && errors.service_id ? 'p-invalid w-full' : 'w-full'} aria-describedby="service_id_error" />
                                {submitCount > 0 && errors.service_id &&
                                    <small id="service_id_error" className="p-error">
                                        {errors.service_id}
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

export default Bill