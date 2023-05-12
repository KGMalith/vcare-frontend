import React, { useEffect, useState, useRef } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Badge } from 'primereact/badge';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { Dropdown } from 'primereact/dropdown';
import { ListBox } from 'primereact/listbox';
import { useRouter } from 'next/router';
import { Formik } from 'formik';
import * as yup from 'yup';
import { getRequest, postRequest } from '../../../../utils/axios';
import { apiPaths } from '../../../../utils/api-paths';
import { ProgressSpinner } from 'primereact/progressspinner';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import { CONSTANTS } from '../../../../utils/constants';
import { InputNumber } from 'primereact/inputnumber';
import { RadioButton } from 'primereact/radiobutton';

const Bill = () => {
    const [billDetails, setBillDetails] = useState({});
    const [isPageLoading, setPageLoading] = useState(false);
    const [activeIndex, setactiveIndex] = useState(0)
    const items = [
        { label: 'Details', icon: 'pi pi-fw pi-file' },
        { label: 'Services', icon: 'pi pi-chart-line' },
    ];
    const payment_types = [
        { label: 'Cash', value: CONSTANTS.cash_payment },
        { label: 'Card', value: CONSTANTS.card_payment },
    ];
    const [serviceList, setServiceList] = useState([]);
    const [showAddService, setShowAddService] = useState(false);
    const [showPaymentMethod, setShowPaymentMethod] = useState(false);
    const [showFinalizeBill, setShowFinalizedBill] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [isFinalizingBillLoading, setFinalizingBillLoading] = useState(false);
    const [isPaymentLoading, setPaymentLoading] = useState(false);
    const [isAddServiceLoading, setAddServiceLoading] = useState(false);
    const [isDeleteServiceLoading, setDeleteServiceLoading] = useState(false);
    const formRef = useRef();
    const paymentFormRef = useRef();
    const billFormRef = useRef();
    const router = useRouter();

    const schema = yup.object({
        service_id: yup.object().required('Required'),
    });

    const paymentSchema = yup.object({
        payment_type: yup.number().required('Required'),
    });

    const finalizeBillSchema = yup.object({
        // discount: yup.number().required('Required'),
        discount: yup.number().test('checkAmount', 'Precentage Value should between 0 - 100', function (value) {
            if (this.parent.discount_type == 'Precentage') {
                if (value > 100 || value < 0) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }).typeError('Required').required('Required'),
        discount_type: yup.string().required('Required'),
    });

    const renderHeader = () => {
        return (
            <div className='flex flex-column gap-2'>
                <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Billing Service</h1>
                <span className='text-600 text-base font-normal'>Add billing service for current bill</span>
            </div>
        );
    }

    const renderPaymentHeader = () => {
        return (
            <div className='flex flex-column gap-2'>
                <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Select Payment Type</h1>
                <span className='text-600 text-base font-normal'>Select current bill payment method</span>
            </div>
        );
    }

    const renderFinalizeBillHeader = () => {
        return (
            <div className='flex flex-column gap-2'>
                <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Finalize Bill</h1>
                <span className='text-600 text-base font-normal'>Provide discount for bill</span>
            </div>
        );
    }

    const renderFooter = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setShowAddService(false)} className="p-button-text" />
                <Button label="Create" icon="pi pi-check" autoFocus onClick={handleSubmit} loading={isAddServiceLoading} />
            </div>
        );
    }

    const renderPaymentFooter = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setShowPaymentMethod(false)} className="p-button-text" />
                <Button label="Pay" icon="pi pi-check" autoFocus onClick={handlePaymentSubmit} />
            </div>
        );
    }

    const renderFinalizeBillFooter = () => {
        return (
            <div>
                <Button label="Cancel" icon="pi pi-times" onClick={() => setShowFinalizedBill(false)} className="p-button-text" />
                <Button label="Finalize Bill" type='submit' icon="pi pi-check" autoFocus onClick={handleFinalizeBillSubmit} />
            </div>
        );
    }

    const handleSubmit = () => {
        if (formRef.current) {
            formRef.current.handleSubmit();
        }
    };

    const handlePaymentSubmit = () => {
        if (paymentFormRef.current) {
            paymentFormRef.current.handleSubmit();
        }
    };

    const handleFinalizeBillSubmit = () => {
        if (billFormRef.current) {
            billFormRef.current.handleSubmit();
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

    const onSubmitPaymentTypes = (values) => {
        payBillConfirm(values.payment_type);
        setShowPaymentMethod(false);
    }

    const onSubmitFinalizeBill = (values) => {
        finalizingBillConfirm(values);
        setShowFinalizedBill(false);
    }

    const finalizingBillConfirm = (values) => {
        confirmDialog({
            message: 'Do you want to finalize this bill?',
            header: 'Bill Finalize Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-primary',
            accept: () => finalizeBill(values),
        });
    }

    const payBillConfirm = (value) => {
        confirmDialog({
            message: 'Do you want to pay this?',
            header: 'Bill Payment Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-primary',
            accept: () => payBill(value),
        });
    }

    const deleteServiceConfirm = (value) => {
        confirmDialog({
            message: 'Do you want to delete this bill service?',
            header: 'Bill Service Delete Confirmation',
            icon: 'pi pi-info-circle',
            acceptClassName: 'p-button-danger',
            accept: () => deleteBillService(value),
        });
    }

    const finalizeBill = async (values) => {
        setFinalizingBillLoading(true);
        let respond = await postRequest(apiPaths.FINALIZE_BILL, { id: router?.query?.id, discount: values.discount, type: values.discount_type });
        if (respond.status) {
            loadAllData();
        }
        setFinalizingBillLoading(false);
    }

    const payBill = async (value) => {
        setPaymentLoading(true);
        let respond = await postRequest(apiPaths.PAY_BILL, { id: router?.query?.id, payment_type: value });
        if (respond.status) {
            loadAllData();
        }
        setPaymentLoading(false);
    }

    const deleteBillService = async (value) => {
        setDeleteServiceLoading(true);
        let respond = await postRequest(apiPaths.DELETE_BILL_SERVICES, { bill_id: router?.query?.id, service_id: value });
        if (respond.status) {
            loadAllData();
        }
        setDeleteServiceLoading(false);
    }


    const onSubmitService = async (value) => {
        setAddServiceLoading(true);
        let respond = await postRequest(apiPaths.ADD_BILL_SERVICES, { bill_id: router?.query?.id, service_id: value.service_id.id });
        if (respond.status) {
            setShowAddService(false);
            loadAllData();
        }
        setAddServiceLoading(false);
    }

    const redirectPage = (value) => {
        router.push(value)
    }

    const loadAllData = async () => {
        if (router?.query?.id) {
            setPageLoading(true);
            let respond = await postRequest(apiPaths.VIEW_BILL, { id: router?.query?.id });
            if (respond.status) {
                setBillDetails(respond.data);
            }
            setPageLoading(false);
        }
    }

    useEffect(() => {
        let userRole = localStorage.getItem('user_role');
        if (userRole) {
            setUserRole(userRole);
        }
        const getServiceList = async () => {
            let respond = await getRequest(apiPaths.GET_ALL_SERVICES);
            if (respond.status) {
                setServiceList(respond.data);
            }
        }

        loadAllData();
        getServiceList();
    }, [router?.query?.id])

    return (
        <>
            <ConfirmDialog />
            {isPageLoading ?
                <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
                    <div className='flex align-items-center justify-content-center min-h-screen'>
                        <ProgressSpinner />
                    </div>
                </div>
                :
                <div className='surface-section surface-card shadow-2 border-round flex-auto xl:ml-5'>
                    <div className='surface-section px-5 pt-5'>
                        <TabMenu model={items} onTabChange={(e) => setactiveIndex(e.index)} activeIndex={activeIndex} />
                    </div>
                    <div className='surface-section px-5 py-5'>
                        <div className='flex align-items-start flex-column lg:flex-row lg:justify-content-between'>
                            <div className='flex align-items-start flex-column md:flex-row'>
                                <div>
                                    <span className='text-900 font-medium text-3xl'>{billDetails?.bill?.bill_code}</span>
                                    <div className='flex align-items-center flex-wrap text-sm'>
                                        <div className='mr-5 mt-3'>
                                            <span className='font-semibold text-500'>
                                                <i className='pi pi-history mr-1'></i>
                                                Status
                                            </span>
                                            <div className='mt-2'>
                                                <Badge value={billDetails?.bill?.status == CONSTANTS.hospital_bill_pending ? 'Pending' : billDetails?.bill?.status == CONSTANTS.hospital_bill_paid ? 'Paid' : billDetails?.bill?.status == CONSTANTS.hospital_bill_finalized ? 'Bill Finalized' : billDetails?.bill?.status == CONSTANTS.hospital_bill_cancelled && 'Cancelled'} severity={billDetails?.bill?.status == CONSTANTS.hospital_bill_pending ? 'warning' : billDetails?.bill?.status == CONSTANTS.hospital_bill_paid ? 'success' : billDetails?.bill?.status == CONSTANTS.hospital_bill_finalized ? 'info' : billDetails?.bill?.status == CONSTANTS.hospital_bill_cancelled && 'danger'}></Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='px-6 py-5 surface-ground'>
                        {activeIndex == 0 ?
                            <div className='surface-card p-4 shadow-2 border-round'>
                                <div className='font-medium text-3xl text-900 mb-3'>
                                    Bill Details
                                    {userRole != CONSTANTS.patient_role_id &&
                                        <div className='flex flex-row flex-nowrap gap-3 justify-content-end'>
                                            {billDetails?.bill?.status == CONSTANTS.hospital_bill_pending &&
                                                <Button icon="pi pi-flag-fill" className='p-button-outlined' label="Finalize Bill" loading={isFinalizingBillLoading} onClick={() => setShowFinalizedBill(true)} />
                                            }
                                            {billDetails?.bill?.status == CONSTANTS.hospital_bill_finalized &&
                                                <Button icon="pi pi-money-bill" label="Pay Bill" onClick={() => setShowPaymentMethod(true)} loading={isPaymentLoading} />
                                            }
                                        </div>
                                    }
                                </div>
                                <div className='text-500 mb-5'>All details related to bill are down below</div>
                                <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Bill Code</div>
                                        <div className='text-900 w-full md:w-9'>{billDetails?.bill?.bill_code}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Gross Total</div>
                                        <div className='text-900 w-full md:w-9'>{(billDetails?.bill?.gross_total)?.toFixed(2)}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Discount</div>
                                        <div className='text-900 w-full md:w-9'>{(billDetails?.bill?.discount)?.toFixed(2)}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Received Amount</div>
                                        <div className='text-900 w-full md:w-9'>{(billDetails?.bill?.received_amount)?.toFixed(2)}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Grand Total</div>
                                        <div className='text-900 w-full md:w-9'>{(billDetails?.bill?.grand_total)?.toFixed(2)}</div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Payment Type</div>
                                        <div className='text-900 w-full md:w-9'> <span>{(billDetails?.bill?.payment_type && billDetails?.bill?.payment_type == CONSTANTS.cash_payment) ? 'Cash' : billDetails?.bill?.payment_type && billDetails?.bill?.payment_type == CONSTANTS.card_payment ? 'Card' : null}</span></div>
                                    </li>
                                    <li className='flex align-items-center py-3 px-2 flex-wrap'>
                                        <div className='text-500 w-full md:w-3 font-medium'>Status</div>
                                        <div className='text-900 w-full md:w-9'>
                                            <Badge value={billDetails?.bill?.status == CONSTANTS.hospital_bill_pending ? 'Pending' : billDetails?.bill?.status == CONSTANTS.hospital_bill_paid ? 'Paid' : billDetails?.bill?.status == CONSTANTS.hospital_bill_finalized ? 'Bill Finalized' : billDetails?.bill?.status == CONSTANTS.hospital_bill_cancelled && 'Cancelled'} severity={billDetails?.bill?.status == CONSTANTS.hospital_bill_pending ? 'warning' : billDetails?.bill?.status == CONSTANTS.hospital_bill_paid ? 'success' : billDetails?.bill?.status == CONSTANTS.hospital_bill_finalized ? 'info' : billDetails?.bill?.status == CONSTANTS.hospital_bill_cancelled && 'danger'}></Badge>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            : activeIndex == 1 &&
                            <div className='surface-card p-4 shadow-2 border-round'>
                                <div className='font-medium text-3xl text-900 mb-3'>
                                    Billing Services
                                    {billDetails?.bill?.status == CONSTANTS.hospital_bill_pending &&
                                        <Button icon="pi pi-chart-line" label="Add Billing Service" style={{ float: 'right' }} onClick={() => setShowAddService(true)} />
                                    }
                                </div>
                                <div className='text-500 mb-5'>All linkied billing services related to this bill are down below</div>
                                <ul className='list-none p-0 m-0 border-top-1 border-300'>
                                    {billDetails?.services?.map((values, index) => (
                                        <li className={index % 2 == 0 ? 'flex align-items-center py-3 px-2 flex-wrap surface-ground gap-3 md:gap-0' : 'flex align-items-center py-3 px-2 flex-wrap gap-3 md:gap-0'}>
                                            <div className='text-500 font-semibold w-full md:w-3'>
                                                {values.service_code && values.service_name && values.service_code + ' : ' + values.service_name}
                                            </div>
                                            <div className=' w-full md:w-5'>
                                                <p className='text-900 mb-0'>{values?.service_desc}</p>
                                            </div>
                                            <div className=' w-full md:w-2'>
                                                <p className='text-900 mb-0'>{(values?.service_charge).toFixed(2)}</p>
                                            </div>
                                            <div className='text-900 w-full md:w-2 flex gap-3 justify-content-end'>
                                                {billDetails?.bill?.status == CONSTANTS.hospital_bill_pending &&
                                                    <Button icon="pi pi-trash" label="Delete" className='p-button-outlined p-button-danger' onClick={() => deleteServiceConfirm(values?.id)} loading={isDeleteServiceLoading} />
                                                }
                                            </div>
                                        </li>
                                    ))
                                    }
                                </ul>
                            </div>
                        }
                    </div>
                </div>
            }

            {/* Add Services Modal */}
            <Dialog header={renderHeader} visible={showAddService} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFooter} onHide={() => setShowAddService(false)}>
                <Formik
                    innerRef={formRef}
                    validationSchema={schema}
                    onSubmit={(values) => onSubmitService(values)}
                    initialValues={{
                        service_id: '',
                    }}>
                    {({
                        errors,
                        handleChange,
                        submitCount,
                        values
                    }) => (
                        <form noValidate>
                            <div>
                                <label htmlFor="service_id" className="block text-900 font-medium mb-2">Service</label>
                                <ListBox value={values.service_id} options={serviceList} name='service_id' onChange={handleChange} filter
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

            {/* Select Payment Type Modal */}
            <Dialog header={renderPaymentHeader} visible={showPaymentMethod} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderPaymentFooter} onHide={() => setShowPaymentMethod(false)}>
                <Formik
                    innerRef={paymentFormRef}
                    validationSchema={paymentSchema}
                    onSubmit={(values) => onSubmitPaymentTypes(values)}
                    initialValues={{
                        payment_type: '',
                    }}>
                    {({
                        errors,
                        handleChange,
                        submitCount,
                        values
                    }) => (
                        <form noValidate>
                            <div>
                                <label htmlFor="payment_type" className="block text-900 font-medium mb-2">Payment Type</label>
                                <Dropdown id="payment_type" value={values.payment_type} name='payment_type' className={submitCount > 0 && errors.payment_type ? 'p-invalid w-full' : 'w-full'} options={payment_types} onChange={handleChange} aria-describedby="payment_type_error" placeholder="Select a Payment Method" />
                                {submitCount > 0 && errors.payment_type &&
                                    <small id="payment_type_error" className="p-error">
                                        {errors.payment_type}
                                    </small>
                                }
                            </div>
                        </form>
                    )}
                </Formik>
            </Dialog>

            {/* Finalize Bill Modal */}
            <Dialog header={renderFinalizeBillHeader} visible={showFinalizeBill} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={renderFinalizeBillFooter} onHide={() => setShowFinalizedBill(false)}>
                <Formik
                    innerRef={billFormRef}
                    validationSchema={finalizeBillSchema}
                    onSubmit={(values) => onSubmitFinalizeBill(values)}
                    initialValues={{
                        discount: '',
                        discount_type: 'Amount'
                    }}>
                    {({
                        errors,
                        handleChange,
                        submitCount,
                        values
                    }) => (
                        <form noValidate>
                            <div>
                                <label htmlFor="discount" className="block text-900 font-medium mb-2">Discount</label>
                                <InputNumber id="discount" value={values.discount} name='discount' className={submitCount > 0 && errors.discount ? 'p-invalid w-full' : 'w-full'} onValueChange={handleChange} aria-describedby="discount_error" placeholder="Discount" mode="decimal" minFractionDigits={2} maxFractionDigits={2} />
                                {submitCount > 0 && errors.discount &&
                                    <small id="discount_error" className="p-error">
                                        {errors.discount}
                                    </small>
                                }
                            </div>
                            <div className='mt-3'>
                                <label htmlFor="discount_type" className="block text-900 font-medium mb-2">Discount Type</label>
                                <div className="field-radiobutton">
                                    <RadioButton inputId="discount_type1" name="discount_type" value="Amount" onChange={handleChange} checked={values.discount_type == 'Amount'} />
                                    <label htmlFor="discount_type1">Amount</label>
                                </div>
                                <div className="field-radiobutton">
                                    <RadioButton inputId="discount_type2" name="discount_type" value="Precentage" onChange={handleChange} checked={values.discount_type == 'Precentage'} />
                                    <label htmlFor="discount_type2">Precentage</label>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>
            </Dialog>
        </>
    )
}

export default Bill