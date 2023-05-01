import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Formik } from 'formik';
import * as yup from 'yup';
import { Dropdown } from 'primereact/dropdown';
import { Skeleton } from 'primereact/skeleton';
import moment from 'moment';
import 'moment-timezone';

function Settings() {
    const [activeTab, setActiveTab] = useState(1);
    const [isupdateProfileLoading, setupdateProfileLoading] = useState(false);
    const [isupdateTimezoneLoading, setupdateTimezoneLoading] = useState(false);
    const [isProfileImageLoading, setProfileImageLoading] = useState(false);
    const [isPageLoading, setPageLoading] = useState(false);
    const [userRole, setUserRole] = useState(null);
    const [timeZoneList,setTimeZoneList] = useState([]);

    const schema = yup.object({
        first_name: yup.string().required('Required'),
        last_name: yup.string().required('Required'),
        email: (userRole == 2 || userRole == 3) ? yup.string().email('Invalid Email').required('Required') : yup.string().email('Invalid Email').nullable(),
        nic: yup.string().nullable(),
        mobile: yup.string().nullable(),
    });

    const schema2 = yup.object({
        timezone: yup.string().required('Required'),
    });


    const onSubmitPersonalInformation = async (values) => {
        // setLoading(true);
        // let respond = await postRequest(apiPaths.PATIENT_SIGNUP,values);
        // if(respond.status){
        //     router.push("/signup-complete");
        // }
        // setLoading(false);
    }

    const onSubmitSettings = async (values) => {
       console.log(values)
    }

    useEffect(() => {
        const userRoleFromLocalStorage = localStorage.getItem('user_role');
        if (userRoleFromLocalStorage) {
            setUserRole(userRoleFromLocalStorage);
        }

        var timeZones = moment.tz.names();
        let array = [];
        if(timeZones.length > 0){
            timeZones.map((item)=>{
                array.push({
                    label:item,
                    value:item
                });
            });
            setTimeZoneList(array);
        }
    }, []);

    return (
        <>
            <div className='surface-section surface-card p-5 shadow-2 border-round flex-auto xl:ml-5'>
                <div className='p-fluid flex flex-column lg:flex-row'>
                    <ul className='list-none m-0 p-0 flex flex-row lg:flex-column justify-content-between lg:justify-content-start mb-5 lg:mb-0'>
                        <li className='mb-6'>
                            <div className='flex flex-column justify-content-center align-items-center'>
                                <img src='/images/dummy.png' className='h-10rem w-10rem border-circle bg-contain bg-no-repeat bg-center' />
                                <button className='p-button p-component p-button-rounded -mt-4 p-button-icon-only ml-8'>
                                    <span className='p-button-icon p-c pi pi-pencil'></span>
                                    <span className='p-button-label p-c'></span>
                                    <span role="presentation" className="p-ink" style={{ height: '48px', width: '48px', top: '22.5px', left: '18px' }}></span>
                                </button>
                                <span className='text-2xl text-color font-bold mt-3'>Dolores Bianca</span>
                                <span className='text-base text-color-secondary font-medium'>dolores@yoda.com</span>
                            </div>
                        </li>
                        <li className='mb-3'>
                            <a className={activeTab == 1 ? 'lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors surface-200' : 'lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors'} onClick={() => setActiveTab(1)}>
                                <i className={activeTab == 1 ? 'pi pi-user md:mr-2 text-700' : 'pi pi-user md:mr-2 text-600'}></i>
                                <span className={activeTab == 1 ? 'font-medium hidden md:block text-800' : 'font-medium hidden md:block text-700'}>Personal Information</span>
                                <span role="presentation" className="p-ink" style={{ height: '240px', width: '240px', top: '37px', left: '145px' }}></span>
                            </a>
                        </li>
                        <li>
                            <a className={activeTab == 2 ? 'lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors surface-200' : 'lg:w-15rem flex align-items-center cursor-pointer p-3 border-round hover:surface-200 transition-duration-150 transition-colors'} onClick={() => setActiveTab(2)}>
                                <i className={activeTab == 2 ? 'pi pi-cog md:mr-2 text-700' : 'pi pi-cog md:mr-2 text-600'}></i>
                                <span className={activeTab == 2 ? 'font-medium hidden md:block text-800' : 'font-medium hidden md:block text-700'}>Settings</span>
                                <span role="presentation" className="p-ink" style={{ height: '240px', width: '240px', top: '37px', left: '145px' }}></span>
                            </a>
                        </li>
                    </ul>
                    <div className='flex-auto xl:ml-5 lg:border-left-1 border-gray-300 pl-5'>
                        {activeTab == 1 ?
                            <>
                                <div className='text-900 font-semibold text-3xl mt-3'>
                                    Personal Information
                                </div>
                                <div className="p-divider p-component p-divider-horizontal p-divider-solid p-divider-left" role="separator"></div>
                                <div className='flex gap-5 flex-column'>
                                    <Formik
                                        validationSchema={schema}
                                        onSubmit={(values) => onSubmitPersonalInformation(values)}
                                        initialValues={{
                                            first_name:'',
                                            last_name:'',
                                            email:'',
                                            nic:'',
                                            mobile:''
                                        }}>
                                        {({
                                            errors,
                                            handleChange,
                                            handleSubmit,
                                            submitCount,
                                            values
                                        }) => (
                                            <form noValidate onSubmit={handleSubmit}>
                                                <label htmlFor="first_name" className="block text-900 font-medium mb-2">First Name</label>
                                                <InputText id="first_name" value={values.first_name} name='first_name' type="text" placeholder="First Name" className={submitCount > 0 && errors.first_name ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="first_name_error" onChange={handleChange} />
                                                {submitCount > 0 && errors.first_name &&
                                                    <small id="first_name_error" className="p-error">
                                                        {errors.first_name}
                                                    </small>
                                                }

                                                <label htmlFor="last_name" className="block text-900 font-medium mb-2 mt-3">Last Name</label>
                                                <InputText id="last_name" value={values.last_name} name='last_name' type="text" placeholder="Last Name" className={submitCount > 0 && errors.last_name ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="last_name_error" onChange={handleChange} />
                                                {submitCount > 0 && errors.last_name &&
                                                    <small id="last_name_error" className="p-error">
                                                        {errors.last_name}
                                                    </small>
                                                }

                                                {userRole == 2 || userRole == 3 &&
                                                    <>
                                                        <label htmlFor="email" className="block text-900 font-medium mb-2 mt-3">Email</label>
                                                        <InputText id="email" value={values.email} name='email' type="text" placeholder="Email address" className={submitCount > 0 && errors.email ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="email_error" onChange={handleChange} />
                                                        {submitCount > 0 && errors.email &&
                                                            <small id="email_error" className="p-error">
                                                                {errors.email}
                                                            </small>
                                                        }

                                                        <label htmlFor="nic" className="block text-900 font-medium mb-2 mt-3">NIC</label>
                                                        <InputText id="nic" value={values.nic} name='nic' type="text" placeholder="NIC" className={submitCount > 0 && errors.nic ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="nic_error" onChange={handleChange} />
                                                        {submitCount > 0 && errors.nic &&
                                                            <small id="nic_error" className="p-error">
                                                                {errors.nic}
                                                            </small>
                                                        }

                                                        <label htmlFor="mobile" className="block text-900 font-medium mb-2 mt-3">Mobile</label>
                                                        <InputText id="mobile" value={values.mobile} name='mobile' type="text" placeholder="Mobile" className={submitCount > 0 && errors.mobile ? 'p-invalid w-full mb-1' : 'w-full mb-1'} aria-describedby="mobile_error" onChange={handleChange} />
                                                        {submitCount > 0 && errors.mobile &&
                                                            <small id="mobile_error" className="p-error">
                                                                {errors.mobile}
                                                            </small>
                                                        }
                                                    </>
                                                }
                                                <Button label="Update Profile" type='submit' className="mt-3" loading={isupdateProfileLoading} />
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                            </>
                            :
                            <>
                                <div className='text-900 font-semibold text-3xl mt-3'>
                                    Settings
                                </div>
                                <div className="p-divider p-component p-divider-horizontal p-divider-solid p-divider-left" role="separator"></div>
                                <div className='flex gap-5 flex-column'>
                                    <Formik
                                        validationSchema={schema2}
                                        onSubmit={(values) => onSubmitSettings(values)}
                                        initialValues={{
                                            timezone:''
                                        }}>
                                        {({
                                            errors,
                                            handleChange,
                                            handleSubmit,
                                            submitCount,
                                            values
                                        }) => (
                                            <form noValidate onSubmit={handleSubmit}>
                                                <label htmlFor="timezone" className="block text-900 font-medium mb-2">Timezone</label>
                                                <Dropdown 
                                                    name='timezone' 
                                                    options={timeZoneList} 
                                                    value={values.timezone}
                                                    onChange={handleChange}  
                                                    filter 
                                                    showClear 
                                                    placeholder="Select a Timezone" 
                                                    aria-describedby="timezone_error" 
                                                    className={submitCount > 0 && errors.timezone ? 'p-invalid w-full mb-1' : 'w-full mb-1'}
                                                />
                                                {submitCount > 0 && errors.timezone &&
                                                    <small id="timezone_error" className="p-error">
                                                        {errors.timezone}
                                                    </small>
                                                }
                                                <Button label="Update Timezone" type='submit' className="mt-3" loading={isupdateTimezoneLoading} />
                                            </form>
                                        )}
                                    </Formik>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default Settings