class CommonFunction {
    // lấy tên role từ id
    static getRoleName = (id) => {
        switch (id) {
            case 1:
                return "Admin";
            case 2:
                return "Manager";
            case 3:
                return "Staff";
            default:
                return "Unknown";
        }
    }
}

export default CommonFunction;