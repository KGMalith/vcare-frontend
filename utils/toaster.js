import { toast } from "react-toastify";

const toaster = (type, message) => {
    if (type == "success") toast.success(message);
    else if (type == "error") toast.error(message);
    else if (type == "warning") toast.warning(message);
};
export default toaster;
