import React, { useEffect, useState } from 'react';
import {withAuth} from '../../../utils/withAuth';
import { getRequest } from '../../../utils/axios';
import { apiPaths } from '../../../utils/api-paths';


const Dashboard = () => {
    const [data, setData] = useState(null);
   
    useEffect(() => {
        const getAllData = async () => {
            let respond = await getRequest(apiPaths.GET_DASHBOARD_DATA);
            if (respond.status) {
                setData(respond.data);
            }
          }

          getAllData();
    }, [])
    

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Patients</span>
                            <div className="text-900 font-medium text-xl">{data?.patientCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-users text-blue-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Doctors</span>
                            <div className="text-900 font-medium text-xl">{data?.doctorsCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-orange-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-user text-orange-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Admissions</span>
                            <div className="text-900 font-medium text-xl">{data?.admissionsCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-cyan-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file-o text-cyan-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Appointments</span>
                            <div className="text-900 font-medium text-xl">{data?.appointmentCount}</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-purple-100 border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                            <i className="pi pi-file-o text-purple-500 text-xl" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default withAuth(Dashboard);
