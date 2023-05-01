import getConfig from 'next/config';
import React, { useContext } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const model = [
        {
            label: 'Home',
            items: [{ label: 'Dashboard', icon: 'pi pi-compass', to: '/app/dashboard' }]
        },
        {
            label: 'Services',
            items: [
                { label: 'Admissions', icon: 'pi pi-file', to: '/app/admissions' },
                { label: 'Appointments', icon: 'pi pi-file', to: '/app/appointments' },
                { label: 'Rooms', icon: 'pi pi-fw pi-home', to: '/app/rooms' },
            ]
        },
        {
            label: 'Billing & Charges',
            items: [
                { label: 'Bill', icon: 'pi pi-money-bill', to: '/app/bills' },
                { label: 'Charging Services', icon: 'pi pi-chart-line', to: '/app/services' },
            ]
        },
        {
            label: 'Members & Roles',
            items: [
                { label: 'Patients', icon: 'pi pi-users', to: '/app/patients' },
                { label: 'Doctors', icon: 'pi pi-users', to: '/app/doctors' },
                { label: 'Employees', icon: 'pi pi-users', to: '/app/employees' },
                { label: 'Members', icon: 'pi pi-users', to: '/app/members' },
                { label: 'Roles', icon: 'pi pi-unlock', to: '/app/roles' },
            ]
        },
    ];

    return (
        <MenuProvider>
            <ul className="layout-menu">
                {model.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
