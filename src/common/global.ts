export class LocalstorageService {
    constructor() { }
    //设置缓存
    setItem(params: any) {
        let obj = {
            name: '',
            value: '',
            expires: 2 * 60 * 60 * 1000,
            startTime: new Date().getTime(), //记录何时将值存入缓存，毫秒级
        };
        let options = new StorageOptions();
        //将obj和传进来的params合并
        Object.assign(options, obj, params);
        if (options.expires) {
            //如果options.expires设置了的话
            //以options.name为key，options为值放进去
            sessionStorage.setItem(options.name, JSON.stringify(options));
        } else {
            //如果options.expires没有设置，就判断一下value的类型
            let type = Object.prototype.toString.call(options.value);
            //如果value是对象或者数组对象的类型，就先用JSON.stringify转一下，再存进去
            if (Object.prototype.toString.call(options.value) == '[object Object]') {
                options.value = JSON.stringify(options.value);
            }
            if (Object.prototype.toString.call(options.value) == '[object Array]') {
                options.value = JSON.stringify(options.value);
            }
            sessionStorage.setItem(options.name, options.value);
        }
    }
    //拿到缓存
    getItem(name: string) {
        let result = sessionStorage.getItem(name);
        if (result != null) {
            let jsonResult = JSON.parse(result);
            let value = jsonResult?.value;
            let timespan =
                new Date().getTime() - jsonResult?.expires - jsonResult?.startTime;
            if (timespan > -1) {
                sessionStorage.clear();
                // this.removeItem(name);
                return null;
            }
            return value;
        }
    }
    //移出缓存
    removeItem(name: string) {
        sessionStorage.removeItem(name);
    }
    //移出全部缓存
    clear() {
        sessionStorage.clear();
    }
}

export class StorageOptions {
    'name': string;
    'value': string;
    'expires': number;
    'startTime': number;
}
