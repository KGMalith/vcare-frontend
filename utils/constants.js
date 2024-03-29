export const CONSTANTS = {
    user_pending: 0,
    user_active: 1,
    user_deactivated: -10,
    user_signup_complete: 1,
    user_signup_incomplete: 0,
    user_password_reset_request_active: 1,
    user_password_reset_request_inactive: 0,
    user_invitation_sent: 1,
    user_invitation_not_sent: 0,
    user_account_available: 1,
    user_account_not_available: 0,

    hospital_service_active: 1,
    hospital_service_inactive: 0,
    is_apply_to_every_admission_true: 1,
    is_apply_to_every_admission_false: 0,
    is_apply_to_every_appointment_true: 1,
    is_apply_to_every_appointment_false: 0,

    role_permission_active: 1,
    role_permission_deactive: 0,
    admin_role_id: 1,
    patient_role_id: 2,
    doctor_role_id: 3,

    hospital_room_available: 1,
    hospital_room_taken: 10,
    hospital_room_cleaning: 0,
    hospital_room_closed_for_maintenance: -10,
    hospital_room_waiting_for_cleaning: 20,

    appointment_active: 1,
    appointment_cancel: 0,

    admission_active: 1,
    patient_discharged: 0,

    hospital_bill_pending: 0,
    hospital_bill_paid: 10,
    hospital_bill_cancelled: -10,
    hospital_bill_finalized: 20,

    cash_payment: 0,
    card_payment: 1,

    patient_invitation_sent: 1,
    patient_invitation_not_sent: 0,
    patient_signup_complete: 1,
    patient_signup_incomplete: 0,

};