export const apiPaths = {
    //patient
    PATIENT_SIGNIN: '/api/v1/patient/sign-in',
    PATIENT_SIGNUP: '/api/v1/patient/sign-up',
    VERIFY_PATIENT_EMAIL: '/api/v1/patient/validate-token',
    PATIENT_FORGOT_PASSWORD: '/api/v1/patient/forgot-password',
    PATIENT_RESET_PASSWORD: '/api/v1/patient/reset-password',
    GET_PATIENT_PROFILE: '/api/v1/patient/get-profile-details',
    UPDATE_PATIENT_PROFILE:'/api/v1/patient/update-profile',
    GET_ALL_PATIENTS: '/api/v1/patient/get-all-patients',

    //doctor
    DOCTOR_SIGNIN: '/api/v1/doctor/sign-in',
    DOCTOR_SIGNUP: '/api/v1/doctor/sign-up',
    VERIFY_DOCTOR_EMAIL: '/api/v1/doctor/validate-token',
    DOCTOR_FORGOT_PASSWORD: '/api/v1/doctor/forgot-password',
    DOCTOR_RESET_PASSWORD: '/api/v1/doctor/reset-password',
    GET_DOCTOR_PROFILE: '/api/v1/doctor/get-profile-details',
    UPDATE_DOCTOR_PROFILE: '/api/v1/doctor/update-profile',
    GET_ALL_DOCTORS: '/api/v1/doctor/get-all-doctors',

    //user
    USER_SIGNIN: '/api/v1/users/sign-in',
    GET_ALL_MEMBERS: '/api/v1/users/get-users',
    CREATE_MEMBER: '/api/v1/users/add-user',
    UPDATE_MEMBER: '/api/v1/users/update-user',
    VERIFY_USER_TOKEN: '/api/v1/users/validate-token',
    USER_SETUP_PASSWORD: '/api/v1/users/setup-password',
    UPDATE_USER_STATUS: '/api/v1/users/update-user-status',
    GET_USER_PROFILE: '/api/v1/users/get-profile-details',
    UPDATE_PROFILE: '/api/v1/users/update-profile',

    //roles
    GET_ALL_ROLES: '/api/v1/roles/get-roles',
    CREATE_ROLE: '/api/v1/roles/create-role',
    GET_ROLE_PERMISSIONS: '/api/v1/roles/get-role-permissions',
    UPDATE_ROLE_PERMISSION: '/api/v1/roles/update-role-permissions',
    DELETE_ROLE: '/api/v1/roles/delete-role',
    UPDATE_ROLE: '/api/v1/roles/edit-role',
    GET_ROLE: '/api/v1/roles/get-role',

    //permissions
    GET_ALL_PERMISSIONS: '/api/v1/permissions/get-permissions',

    //settings
    UPDATE_TIMEZONE: '/api/v1/settings/update-timezone',

    //services
    GET_ALL_SERVICES: '/api/v1/services/get-all-services',
    CREATE_SERVICE: '/api/v1/services/create-service',
    UPDATE_SERVICE: '/api/v1/services/edit-service',
    CHANGE_SERVICE_STATUS: '/api/v1/services/update-service-status',
    DELETE_SERVICE: '/api/v1/services/delete-service',
    GET_SERVICE: '/api/v1/services/get-service-details',

    //employee
    GET_ALL_EMPLOYEES: '/api/v1/employee/get-all-employees',
    CREATE_EMPLOYEE: '/api/v1/employee/create-employee',
    UPDATE_EMPLOYEE: '/api/v1/employee/edit-employee',
    DELETE_EMPLOYEE: '/api/v1/employee/delete-employee',
    GET_EMPLOYEE: '/api/v1/employee/get-employee',
    ADD_EMPLOYEE_EMERGENCY_CONTACT: '/api/v1/employee/contact/add-contact',
    DELETE_EMPLOYEE_EMERGENCY_CONTACT: '/api/v1/employee/contact/delete-contact',
    EMPLOYEE_UPLOAD_DOCUMENT: '/api/v1/employee/documents/upload-document',
    EMPLOYEE_UPLOAD_IMAGE: '/api/v1/employee/upload-employee-images',
    ADD_EMPLOYEE_DOCUMENTS: '/api/v1/employee/documents/create-document',
    DELETE_EMPLOYEE_DOCUMENT: '/api/v1/employee/documents/delete-document',
    UPDATE_EMPLOYEE_IMAGE: '/api/v1/employee/set-employee-image',

    //rooms
    GET_ALL_ROOMS: '/api/v1/rooms/get-all-rooms',
    CREATE_ROOM: '/api/v1/rooms/create-room',
    UPDATE_ROOM: '/api/v1/rooms/edit-room',
    UPDATE_ROOM_STATUS: '/api/v1/rooms/update-room-status',
    DELETE_ROOM: '/api/v1/rooms/delete-room',
    GET_ROOM_DETAILS: '/api/v1/rooms/get-room-details',

    //apoointments
    ADD_APPOINTMENT: '/api/v1/appointments/add-appointment',
    GET_ALL_APPOINTMENTS: '/api/v1/appointments/get-all-appointments',
    GET_APPOINTMENT_DETAILS: '/api/v1/appointments/get-appointment-details',
    CANCEL_APPOINTMENT: '/api/v1/appointments/cancel-appointment',
    GET_ALL_PATIENT_APPOINTMENTS: '/api/v1/appointments/get-all-appointments-patient',
    CREATE_APPOINTMENT_PATIENT: '/api/v1/appointments/create-appointment',
    CANCEL_APPOINTMENT_PATIENT: '/api/v1/appointments/cancel-appointment-patient',

    //admissions
    ADD_ADMISSION: '/api/v1/admissions/add-admission',
    GET_ALL_ADMISSIONS: '/api/v1/admissions/get-all-admissions',
    GET_ALL_ADMISSIONS_PATIENT: '/api/v1/admissions/get-all-admissions-patient',
    GET_ADMISSION_DETAILS: '/api/v1/admissions/get-admission-details',
    DISCHARGE_PATIENT: '/api/v1/admissions/discharge-patient',
    UPDATE_ADMISSION: '/api/v1/admissions/update-admission',

};