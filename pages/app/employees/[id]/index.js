import React, { useEffect, useState, useRef } from 'react';
import { TabMenu } from 'primereact/tabmenu';
import { Button } from 'primereact/button';
import { Badge } from 'primereact/badge';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputMask } from 'primereact/inputmask';
import { FileUpload } from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tooltip } from 'primereact/tooltip';
import { Tag } from 'primereact/tag';
import { Formik } from 'formik';
import * as yup from 'yup';
import { postRequest } from '../../../../utils/axios';
import { apiPaths } from '../../../../utils/api-paths';
import { useRouter } from 'next/router';
import { ProgressSpinner } from 'primereact/progressspinner';
import moment from 'moment';
import 'moment-timezone';
import { CONSTANTS } from '../../../../utils/constants';
import { ConfirmDialog, confirmDialog } from 'primereact/confirmdialog';
import toaster from '../../../../utils/toaster';
import { withAuth } from '../../../../utils/withAuth';

const Employee = () => {
  const [activeIndex, setactiveIndex] = useState(0)
  const [showUploadDocument, setShowUploadDocument] = useState(false);
  const [showCreateEmegencyContact, setShowCreateEmegencyContact] = useState(false);
  const [totalSize, setTotalSize] = useState(0);
  const [isEmployeeLoading, setEmployeeLoading] = useState(false);
  const [addEmergencyContactLoading, setAddEmergencyContactLoading] = useState(false);
  const [deleteEmergencyContactLoading, setDeleteEmergencyContactLoading] = useState(false);
  const [addDocumentLoading, setAddDocumentLoading] = useState(false);
  const [deleteDocumentLoading, setDeleteDocumentLoading] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [timezone, setTimezone] = useState(null);
  const [isFileUploaded, setFileUploaded] = useState(false);
  const [isImageUploading, setImageUploading] = useState(false);
  const router = useRouter();
  const formRef = useRef();
  const emergencyContactformRef = useRef();
  const fileUploadRef = useRef(null);
  const items = [
    { label: 'Profile', icon: 'pi pi-fw pi-user' },
    { label: 'Documents', icon: 'pi pi-fw pi-file' },
    { label: 'Contacts', icon: 'pi pi-fw pi-phone' },
  ];
  const emegencyContactSchema = yup.object({
    name: yup.string().required('Required'),
    mobile: yup.string().required('Required'),
    relationship: yup.string().required('Required'),
  });
  const uploadSchema = yup.object({
    document_name: yup.string().required('Required'),
    document_desc: yup.string().required('Required'),
    document_URL: yup.string().required('Required'),
  });

  const addDocumentHeaderRender = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Document</h1>
        <span className='text-600 text-base font-normal'>Upload employee specific documents</span>
      </div>
    );
  }

  const addEmegencyContactHeaderRender = () => {
    return (
      <div className='flex flex-column gap-2'>
        <h1 className='m-0 text-900 font-semibold text-xl line-height-3'>Add Emegency Contact</h1>
        <span className='text-600 text-base font-normal'>Add employee emegency contact details</span>
      </div>
    );
  }

  const addDocumentFooterRender = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowUploadDocument(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmit} loading={addDocumentLoading} />
      </div>
    );
  }

  const addEmegencyContactFooterRender = () => {
    return (
      <div>
        <Button label="Cancel" icon="pi pi-times" onClick={() => setShowCreateEmegencyContact(false)} className="p-button-text" />
        <Button label="Create" icon="pi pi-check" autoFocus type='button' onClick={handleSubmitEmegencyContact} loading={addEmergencyContactLoading} />
      </div>
    );
  }

  const handleSubmit = () => {
    if (formRef.current) {
      formRef.current.handleSubmit();
    }
  };

  const handleSubmitEmegencyContact = () => {
    if (emergencyContactformRef.current) {
      emergencyContactformRef.current.handleSubmit();
    }
  };

  const onSubmitDocument = async (values) => {
    setAddDocumentLoading(true);
    let respond = await postRequest(apiPaths.ADD_EMPLOYEE_DOCUMENTS, { ...values, emp_id: parseInt(router?.query?.id) });
    if (respond.status) {
      setShowUploadDocument(false);
      getAllEmployeeDetails(router?.query?.id);
    }
    setAddDocumentLoading(false);
  }

  const onSubmitEmegencyContact = async (values) => {
    setAddEmergencyContactLoading(true);
    let respond = await postRequest(apiPaths.ADD_EMPLOYEE_EMERGENCY_CONTACT, { ...values, emp_id: parseInt(router?.query?.id) });
    if (respond.status) {
      getAllEmployeeDetails(router?.query?.id);
      setShowCreateEmegencyContact(false);
    }
    setAddEmergencyContactLoading(false);
  }

  const onTemplateUpload = (e, setFieldValue) => {
    setFileUploaded(true)
    let response = JSON.parse(e.xhr.response);
    setFieldValue('document_URL', response.fileinfo[0].fd)
    let _totalSize = 0;
    e.files.forEach(file => {
      _totalSize += (file.size || 0);
    });
    setTotalSize(_totalSize);
    toaster("success", 'File Uploaded');
  }

  const onTemplateSelect = (e) => {
    let _totalSize = totalSize;
    Array.from(e.files).forEach(file => {
      _totalSize += file.size;
    });

    setTotalSize(_totalSize);
  }

  const onTemplateClear = () => {
    setTotalSize(0);
  }

  const onTemplateRemove = (file, callback) => {
    setTotalSize(totalSize - file.size);
    callback();
  }

  const headerTemplate = (options) => {
    const { className, chooseButton, uploadButton, cancelButton } = options;
    const value = totalSize / 10000;
    const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

    return (
      <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
        {chooseButton}
        {uploadButton}
        {cancelButton}
        <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 1 MB`} style={{ width: '300px', height: '20px', marginLeft: 'auto' }}></ProgressBar>
      </div>
    );
  }

  const itemTemplate = (file, props) => {
    return (
      <div className="flex align-items-center flex-wrap">
        <div className="flex align-items-center" style={{ width: '40%' }}>
          <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
          <span className="flex flex-column text-left ml-3">
            {file.name}
            <small>{new Date().toLocaleDateString()}</small>
          </span>
        </div>
        <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
        <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
      </div>
    )
  }

  const emptyTemplate = () => {
    return (
      <div className="flex align-items-center flex-column">
        <i className="pi pi-image mt-3 p-5" style={{ 'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
        <span style={{ 'fontSize': '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">Drag and Drop Image Here</span>
      </div>
    )
  }

  const chooseOptions = { icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
  const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined' };
  const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined' };

  useEffect(() => {
    let timeZone = localStorage.getItem('timezone');
    if (timeZone) {
      setTimezone(timeZone);
    }
    getAllEmployeeDetails(router?.query?.id);
  }, [router?.query?.id])

  const getAllEmployeeDetails = async (userId) => {
    if (userId) {
      setEmployeeLoading(true);
      let respond = await postRequest(apiPaths.GET_EMPLOYEE, { id: userId });
      if (respond.status) {
        setEmployee(respond.data);
      }
      setEmployeeLoading(false);
    }
  }

  const deleteContact = (id) => {
    confirmDialog({
      message: 'Do you want to delete this contact?',
      header: 'Emergency Contact Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => deleteEmergencyContact(id),
    });
  }

  const deleteDocument = (id) => {
    confirmDialog({
      message: 'Do you want to delete this document?',
      header: 'Document Delete Confirmation',
      icon: 'pi pi-info-circle',
      acceptClassName: 'p-button-danger',
      accept: () => deleteEmployeeDocument(id),
    });
  }

  const deleteEmployeeDocument = async (id) => {
    setDeleteDocumentLoading(true);
    let respond = await postRequest(apiPaths.DELETE_EMPLOYEE_DOCUMENT, { id: id });
    if (respond.status) {
      getAllEmployeeDetails(router?.query?.id);
    }
    setDeleteDocumentLoading(false);
  }

  const deleteEmergencyContact = async (id) => {
    setDeleteEmergencyContactLoading(true);
    let respond = await postRequest(apiPaths.DELETE_EMPLOYEE_EMERGENCY_CONTACT, { id: id });
    if (respond.status) {
      getAllEmployeeDetails(router?.query?.id);
    }
    setDeleteEmergencyContactLoading(false);
  }

  const setHeaders = (event) => {
    event.xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("token"));
  }

  const onEmployeeImageUpload = async(e) =>{
    setImageUploading(true);
    let response = JSON.parse(e.xhr.response);
    let respond = await postRequest(apiPaths.UPDATE_EMPLOYEE_IMAGE, { id: router?.query?.id, image_fd:response.fileinfo[0].fd });
    if (respond.status) {
      getAllEmployeeDetails(router?.query?.id);
    }
    setImageUploading(false);
  }


  return (
    <>
      <ConfirmDialog />
      <Tooltip target=".custom-choose-btn" content="Choose" position="bottom" />
      <Tooltip target=".custom-upload-btn" content="Upload" position="bottom" />
      <Tooltip target=".custom-cancel-btn" content="Clear" position="bottom" />

      {isEmployeeLoading ?
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
                <div className='relative'>
                  <img src={employee?.image? employee?.image :'/images/dummy.png'} className='mr-5 mb-3 lg:mb-0 border-circle bg-contain bg-no-repeat bg-center' style={{ width: '90px', height: '90px' }} />
                </div>
                <div>
                  <span className='text-900 font-medium text-3xl'>{`${employee?.first_name} ${employee?.last_name}`}</span>
                  <div className='flex align-items-center flex-wrap text-sm'>
                    <div className='mr-5 mt-3'>
                      <span className='font-semibold text-500'>
                        <i className='pi pi-id-card mr-1'></i>
                        EMP Code
                      </span>
                      <div className='text-700 mt-2 font-bold'>{employee?.emp_code}</div>
                    </div>
                    <div className='mr-5 mt-3'>
                      <span className='font-semibold text-500'>
                        <i className='pi pi-sliders-h mr-1'></i>
                        Employment Type
                      </span>
                      <div className='text-700 mt-2 font-bold'>{employee?.employment_type}</div>
                    </div>
                    <div className='mr-5 mt-3'>
                      <span className='font-semibold text-500'>
                        <i className='pi pi-briefcase mr-1'></i>
                        Designation
                      </span>
                      <div className='text-700 mt-2 font-bold'>{employee?.designation}</div>
                    </div>
                  </div>
                  <FileUpload disabled={isImageUploading} mode="basic" name="files" url={process.env.NEXT_PUBLIC_API_BASE_URL + apiPaths.EMPLOYEE_UPLOAD_IMAGE} accept="image/*" maxFileSize={1000000} onUpload={onEmployeeImageUpload} onBeforeSend={setHeaders} auto chooseLabel="Upload Image" className='mt-4'/>
                </div>
              </div>
            </div>
          </div>
          <div className='px-6 py-5 surface-ground'>
            {activeIndex == 0 ?
              <div className='surface-card p-4 shadow-2 border-round'>
                <div className='font-medium text-3xl text-900 mb-3'>Employee Profile</div>
                <div className='text-500 mb-5'>All details related to employee are down below</div>
                <ul className='list-none p-0 m-0 border-top-1 border-300'>
                  <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                    <div className='text-500 w-full md:w-3 font-medium'>EMP Code</div>
                    <div className='text-900 w-full md:w-9'>{employee?.emp_code}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap'>
                    <div className='text-500 w-full md:w-3 font-medium'>First Name</div>
                    <div className='text-900 w-full md:w-9'>{employee?.first_name}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                    <div className='text-500 w-full md:w-3 font-medium'>Last Name</div>
                    <div className='text-900 w-full md:w-9'>{employee?.last_name}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap'>
                    <div className='text-500 w-full md:w-3 font-medium'>Email</div>
                    <div className='text-900 w-full md:w-9'>{employee?.email}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                    <div className='text-500 w-full md:w-3 font-medium'>NIC</div>
                    <div className='text-900 w-full md:w-9'>{employee?.nic}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap'>
                    <div className='text-500 w-full md:w-3 font-medium'>Birthday</div>
                    <div className='text-900 w-full md:w-9'>{moment(employee?.birthday)?.tz(timezone)?.format('YYYY-MM-DD')}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                    <div className='text-500 w-full md:w-3 font-medium'>Mobile</div>
                    <div className='text-900 w-full md:w-9'>{employee?.personal_mobile}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap'>
                    <div className='text-500 w-full md:w-3 font-medium'>Hire Date</div>
                    <div className='text-900 w-full md:w-9'>{moment(employee?.hired_date)?.tz(timezone)?.format('YYYY-MM-DD')}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                    <div className='text-500 w-full md:w-3 font-medium'>End Date</div>
                    <div className='text-900 w-full md:w-9'>{moment(employee?.end_date)?.tz(timezone)?.format('YYYY-MM-DD')}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap'>
                    <div className='text-500 w-full md:w-3 font-medium'>Employment Type</div>
                    <div className='text-900 w-full md:w-9'>{employee?.employment_type}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                    <div className='text-500 w-full md:w-3 font-medium'>Designation</div>
                    <div className='text-900 w-full md:w-9'>{employee?.designation}</div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap'>
                    <div className='text-500 w-full md:w-3 font-medium'>Is Member Account Linked?</div>
                    <div className='text-900 w-full md:w-9'>
                      <Badge value={employee?.is_user_account_exists == CONSTANTS.user_account_available ? 'Yes' : 'No'} severity={employee?.is_user_account_exists == CONSTANTS.user_account_available ? 'success' : 'warning'}></Badge>
                    </div>
                  </li>
                  <li className='flex align-items-center py-3 px-2 flex-wrap surface-ground'>
                    <div className='text-500 w-full md:w-3 font-medium'>
                      Bank Details
                    </div>
                    <div className='text-900 w-full md:w-9'>
                      <div className='grid mt-0 mr-0'>
                        <div className='col-12 md:col-4'>
                          <div className='p-3 border-1 surface-border border-round surface-card'>
                            <div className='text-900 mb-2'>
                              <i className='pi pi-wallet mr-2'></i>
                              <span className='font-medium'>Bank</span>
                            </div>
                            <div className='text-700'>{employee?.bank}</div>
                          </div>
                        </div>
                        <div className='col-12 md:col-4'>
                          <div className='p-3 border-1 surface-border border-round surface-card'>
                            <div className='text-900 mb-2'>
                              <i className='pi pi-wallet mr-2'></i>
                              <span className='font-medium'>Branch</span>
                            </div>
                            <div className='text-700'>{employee?.bank_branch}</div>
                          </div>
                        </div>
                        <div className='col-12 md:col-4'>
                          <div className='p-3 border-1 surface-border border-round surface-card'>
                            <div className='text-900 mb-2'>
                              <i className='pi pi-wallet mr-2'></i>
                              <span className='font-medium'>Account Name</span>
                            </div>
                            <div className='text-700'>{employee?.bank_account_name}</div>
                          </div>
                        </div>
                        <div className='col-12 md:col-4'>
                          <div className='p-3 border-1 surface-border border-round surface-card'>
                            <div className='text-900 mb-2'>
                              <i className='pi pi-wallet mr-2'></i>
                              <span className='font-medium'>Account Number</span>
                            </div>
                            <div className='text-700'>{employee?.bank_account_no}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
              : activeIndex == 1 ?
                <div className='surface-card p-4 shadow-2 border-round'>
                  <div className='font-medium text-3xl text-900 mb-3'>
                    Employee Documents
                    <Button icon="pi pi-upload" label="Add Document" style={{ float: 'right' }} onClick={() => { setShowUploadDocument(true); setFileUploaded(false) }} />
                  </div>
                  <div className='text-500 mb-5'>All documents related to employee are down below</div>
                  <ul className='list-none p-0 m-0 border-top-1 border-300'>
                    {employee && employee.documents && employee.documents.length > 0 &&
                      <>
                        {employee?.documents.map((item, index) => (
                          <li className={(index % 2 == 0) ?'flex align-items-center py-3 px-2 flex-wrap surface-ground gap-3 md:gap-0':'flex align-items-center py-3 px-2 flex-wrap gap-3 md:gap-0'}>
                            <div className='text-500 w-full md:w-3 font-medium'>{`${item?.document_code} ${item?.document_name}`}</div>
                            <div className='text-900 w-full md:w-5'>{item?.document_desc}</div>
                            <div className='text-900 w-full md:w-4 flex gap-3 justify-content-end'>
                              <Button icon="pi pi-download" label="Download" className='p-button-outlined' onClick={()=>window.open(item?.url)}/>
                              <Button icon="pi pi-trash" label="Delete" className='p-button-outlined p-button-danger' loading={deleteDocumentLoading} onClick={()=>deleteDocument(item?.id)}/>
                            </div>
                          </li>
                        ))
                        }
                      </>
                    }
                  </ul>
                </div>
                : activeIndex == 2 &&
                <div className='surface-card p-4 shadow-2 border-round'>
                  <div className='font-medium text-3xl text-900 mb-3'>
                    Employee Emergency Contact
                    <Button icon="pi pi-phone" label="Add Emergency Contact" style={{ float: 'right' }} onClick={() => setShowCreateEmegencyContact(true)} />
                  </div>
                  <div className='text-500 mb-5'>All emergency contacts related to employee are down below</div>
                  <ul className='list-none p-0 m-0 border-top-1 border-300'>
                    {employee && employee.contacts && employee.contacts.length > 0 &&
                      <>
                        {employee?.contacts.map((item, index) => (
                          <li className={(index % 2 == 0) ? `flex align-items-center py-3 px-2 flex-wrap surface-ground gap-3 md:gap-0` : `flex align-items-center py-3 px-2 flex-wrap gap-3 md:gap-0`} key={index}>
                            <div className='text-500 font-semibold w-full md:w-3'>{item?.relationship}</div>
                            <div className=' w-full md:w-7'>
                              <p className='text-900 mb-0'>{item?.name}</p>
                              <p className='text-500'>{item?.mobile}</p>
                            </div>
                            <div className='text-900 w-full md:w-2 flex gap-3 justify-content-end'>
                              <Button icon="pi pi-trash" label="Delete" className='p-button-outlined p-button-danger' onClick={() => deleteContact(item?.id)} loading={deleteEmergencyContactLoading} />
                            </div>
                          </li>
                        ))

                        }
                      </>
                    }
                  </ul>
                </div>
            }
          </div>
        </div>
      }


      {/* Add document modal */}
      <Dialog header={addDocumentHeaderRender} visible={showUploadDocument} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={addDocumentFooterRender} onHide={() => setShowUploadDocument(false)}>
        <Formik
          innerRef={formRef}
          validationSchema={uploadSchema}
          onSubmit={(values) => onSubmitDocument(values)}
          initialValues={{
            document_name: '',
            document_desc: '',
            document_URL: '',
          }}>
          {({
            errors,
            handleChange,
            setFieldValue,
            submitCount,
            values
          }) => (
            <form noValidate>
              <div>
                <label htmlFor="document_name" className="block text-900 font-medium mb-2">Document Name</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-file" />
                  <InputText id="document_name" value={values.document_name} name='document_name' type="text" placeholder="Document Name" className={submitCount > 0 && errors.document_name ? 'p-invalid w-full' : 'w-full'} aria-describedby="document_name_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.document_name &&
                  <small id="document_name_error" className="p-error">
                    {errors.document_name}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="document_desc" className="block text-900 font-medium mb-2">Document Description</label>
                <InputTextarea id="document_desc" value={values.document_desc} name='document_desc' placeholder="Document Description" className={submitCount > 0 && errors.document_desc ? 'p-invalid w-full' : 'w-full'} onChange={handleChange} rows={5} cols={30} autoResize aria-describedby="document_desc_error" />
                {submitCount > 0 && errors.document_desc &&
                  <small id="document_desc_error" className="p-error">
                    {errors.document_desc}
                  </small>
                }
              </div>
              {!isFileUploaded &&
                <div className='mt-3'>
                  <FileUpload ref={fileUploadRef} name="files" url={process.env.NEXT_PUBLIC_API_BASE_URL + apiPaths.EMPLOYEE_UPLOAD_DOCUMENT} accept="application/pdf" maxFileSize={1000000}
                    onUpload={(e) => onTemplateUpload(e, setFieldValue)} onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                    headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate} onBeforeSend={setHeaders}
                    chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
                </div>
              }
            </form>
          )}
        </Formik>
      </Dialog>

      {/* Add Emegency contact modal */}
      <Dialog header={addEmegencyContactHeaderRender} visible={showCreateEmegencyContact} breakpoints={{ '960px': '75vw' }} style={{ width: '50vw' }} footer={addEmegencyContactFooterRender} onHide={() => setShowCreateEmegencyContact(false)}>
        <Formik
          innerRef={emergencyContactformRef}
          validationSchema={emegencyContactSchema}
          onSubmit={(values) => onSubmitEmegencyContact(values)}
          initialValues={{
            name: '',
            mobile: '',
            relationship: '',
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
                <label htmlFor="name" className="block text-900 font-medium mb-2">Name</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-user" />
                  <InputText id="name" value={values.name} name='name' type="text" placeholder="Name" className={submitCount > 0 && errors.name ? 'p-invalid w-full' : 'w-full'} aria-describedby="name_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.name &&
                  <small id="name_error" className="p-error">
                    {errors.name}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="mobile" className="block text-900 font-medium mb-2">Mobile</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-mobile" />
                  <InputMask id="mobile" mask="(999) 999-9999" value={values.mobile} name='mobile' placeholder="(999) 999-9999" className={submitCount > 0 && errors.mobile ? 'p-invalid w-full' : 'w-full'} aria-describedby="mobile_error" onChange={handleChange}></InputMask>
                </div>
                {submitCount > 0 && errors.mobile &&
                  <small id="mobile_error" className="p-error">
                    {errors.mobile}
                  </small>
                }
              </div>
              <div className="mt-3">
                <label htmlFor="relationship" className="block text-900 font-medium mb-2">Relationship</label>
                <div className="p-input-icon-left w-full">
                  <i className="pi pi-link" />
                  <InputText id="relationship" value={values.relationship} name='relationship' type="text" placeholder="Relationship" className={submitCount > 0 && errors.relationship ? 'p-invalid w-full' : 'w-full'} aria-describedby="relationship_error" onChange={handleChange} />
                </div>
                {submitCount > 0 && errors.relationship &&
                  <small id="relationship_error" className="p-error">
                    {errors.relationship}
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

export default withAuth(Employee)