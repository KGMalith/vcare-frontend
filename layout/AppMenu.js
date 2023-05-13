import getConfig from 'next/config';
import React, { useContext, useEffect, useState } from 'react';
import AppMenuitem from './AppMenuitem';
import { LayoutContext } from './context/layoutcontext';
import { MenuProvider } from './context/menucontext';
import Link from 'next/link';
import {hasPermission} from '../utils/permissions';

const AppMenu = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const [sideNavItems, setSideNavItems] = useState([]);

    useEffect(() => {
        let sideNav = [];
        sideNav.push(
            {
                label: 'Home',
                items: [{ label: 'Dashboard', icon: 'pi pi-compass', to: '/app/dashboard' }]
            }
        );

        if (hasPermission(18) || hasPermission(52) || hasPermission(56)) {
            let services = {
                label: 'Services',
                items: []
            }
            if (hasPermission(56)) {
                services.items.push({ label: 'Admissions', icon: 'pi pi-file', to: '/app/admissions' });
            }
            if (hasPermission(52)) {
                services.items.push({ label: 'Appointments', icon: 'pi pi-file', to: '/app/appointments' });
            }
            if (hasPermission(18)) {
                services.items.push({ label: 'Rooms', icon: 'pi pi-fw pi-home', to: '/app/rooms' });
            }
            sideNav.push(services);
        }

        if (hasPermission(48) || hasPermission(12)) {
            let billing = {
                label: 'Billing & Charges',
                items: []
            }
            if (hasPermission(48)) {
                billing.items.push({ label: 'Bill', icon: 'pi pi-money-bill', to: '/app/bills' });
            } 
            if (hasPermission(12)) {
                billing.items.push({ label: 'Charging Services', icon: 'pi pi-chart-line', to: '/app/services' });
            }
            sideNav.push(billing);
        }

        if (hasPermission(32) || hasPermission(43) || hasPermission(36) || hasPermission(2) ||  hasPermission(24)) {
            let memberRoles = {
                label: 'Members & Roles',
                items: []
            }
            if (hasPermission(32)) {
                memberRoles.items.push({ label: 'Patients', icon: 'pi pi-users', to: '/app/patients' });
            }
            if (hasPermission(43)) {
                memberRoles.items.push({ label: 'Doctors', icon: 'pi pi-users', to: '/app/doctors' });
            }
            if (hasPermission(36)) {
                memberRoles.items.push({ label: 'Employees', icon: 'pi pi-users', to: '/app/employees' });
            }
            if (hasPermission(2)) {
                memberRoles.items.push({ label: 'Members', icon: 'pi pi-users', to: '/app/members' });
            }
            if (hasPermission(24)) {
                memberRoles.items.push({ label: 'Roles', icon: 'pi pi-unlock', to: '/app/roles' });
            }

            sideNav.push(memberRoles);
        }

        setSideNavItems(sideNav);
    }, [])


    return (
        <MenuProvider>
            <ul className="layout-menu">
                {sideNavItems.map((item, i) => {
                    return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                })}
            </ul>
        </MenuProvider>
    );
};

export default AppMenu;
