interface Common{
    ellipsis:any;
}

export const CommonFun:Common = {
    ellipsis : (value: any, beforeCount = 4, afterCount = 4) => {
        return (
            value.substr(0, beforeCount) +
            "..." +
            value.substr(value.length - afterCount)
        );
    }
}