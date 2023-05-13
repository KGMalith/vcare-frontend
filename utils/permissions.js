export const hasPermission = (permission) => {
    if (typeof window !== 'undefined') {
        const permissions = localStorage.getItem("permissions");
        const permissions_array = permissions && permissions.split(',');
        const index = permissions_array && permissions_array.findIndex((item)=>item == permission);
        if(index == -1){
            return false
        }else{
            return true
        }
    }
};