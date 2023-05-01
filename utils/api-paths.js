export const apiPaths = {
    //patient
    PATIENT_SIGNIN: '/api/v1/patient/sign-in',
    PATIENT_SIGNUP: '/api/v1/patient/sign-up',
    VERIFY_PATIENT_EMAIL: '/api/v1/patient/validate-token',
    PATIENT_FORGOT_PASSWORD: '/api/v1/patient/forgot-password',
    PATIENT_RESET_PASSWORD: '/api/v1/patient/reset-password',

    //doctor
    DOCTOR_SIGNIN: '/api/v1/doctor/sign-in',
    DOCTOR_SIGNUP: '/api/v1/doctor/sign-up',
    VERIFY_DOCTOR_EMAIL: '/api/v1/doctor/validate-token',
    DOCTOR_FORGOT_PASSWORD: '/api/v1/doctor/forgot-password',
    DOCTOR_RESET_PASSWORD: '/api/v1/doctor/reset-password',

    //user
    USER_SIGNIN: '/api/v1/users/sigin-in',

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
};