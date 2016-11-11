import * as superagent from 'superagent';
import { error as errorMsg } from '../notification/index';
import { ajax as config } from '../global/config';

/**
 * get 请求
 * 
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
export function get(url: string, data?: { [key: string]: any }, type?: number) {
    return ajax(url, data, type, 'get');
}

/**
 * post 请求
 * 
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
export function post(url: string, data?: { [key: string]: any }, type?: number) {
    return ajax(url, data, type, 'post');
}

/**
 * put 请求
 * 
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
export function put(url: string, data?: { [key: string]: any }, type?: number) {
    return ajax(url, data, type, 'put');
}

/**
 * del 请求
 * 
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
export function del(url: string, data?: { [key: string]: any }, type?: number) {
    return ajax(url, data, type, 'delete');
}

/**
 * ajax 记录
 */
let ajaxRecordArray: Array<AjaxRecord> = []
/**
 * ajax 记录类型
 * 
 * @interface AjaxRecord
 */
interface AjaxRecord {
    /**
     * 请求连接
     * 
     * @type {string}
     * @memberOf AjaxRecord
     */
    url: string,
    /**
     * 请求的时间
     * 
     * @type {Date}
     * @memberOf AjaxRecord
     */
    time: Date,
    /**
     * 请求的类型 get post...
     * 
     * @type {number}
     * @memberOf AjaxRecord
     */
    type: number,
    /**
     * 请求数据
     * 
     * @type {{ [key: string]: any }}
     * @memberOf AjaxRecord
     */
    data: { [key: string]: any },
    /**
     * 请求发送类型
     * 
     * @type {string}
     * @memberOf AjaxRecord
     */
    ajaxType: string,
    /**
     * 请求延时触发存储
     * 
     * @type {*}
     * @memberOf AjaxRecord
     */
    setTimeout?: any,
    /**
     * 返回值json数组
     * 
     * @type {AjaxData}
     * @memberOf AjaxRecord
     */
    responseDate?: AjaxData,
    /**
     * 返回的superagent.Response
     * 
     * @type {superagent.Response}
     * @memberOf AjaxRecord
     */
    response?: superagent.Response
}

/**
 * ajax请求返回值
 * 
 * @interface AjaxData
 */
interface AjaxData {
    /**
     * status
     * 
     * @type {number}
     * @memberOf AjaxData
     */
    status: number,
    /**
     * 返回值
     * 
     * @type {(string | { [key: string]: string })}
     * @memberOf AjaxData
     */
    data: string | { [key: string]: string },
    /**
     * status描述
     * 
     * @type {string}
     * @memberOf AjaxData
     */
    message: string
}


/**
 * ajax 函数 类型
 * 
 * @interface AjaxFunction
 */
interface AjaxFunction {
    (url: string, data?: { [key: string]: any }, type?: number, ajaxType?: string): Promise<AjaxData | never>
}


/**
 * ajax 函数 类型
 * 
 * @interface TypeFunction
 */
interface TypeFunction {
    (url: string, data?: { [key: string]: any }, type?: number, ajaxType?: string, ajaxRecord?: AjaxRecord): Promise<AjaxData | never>
}


/**
 *  ajaxType3 延迟时间
 */
let stTime = 400;

/**
 * ajaxType 函数集合
 * 0. 同url同参数同类型 上一个完成时过 400ms 才能请求下一个
 * 1. 缓存请求返回值
 * 2. 延迟提交 400ms 同一时间400ms内的相同请求 只会请求最后一个请求
 */
let typeFunctionArray: Array<TypeFunction> = [
    // 同url同参数同类型 上一个完成时过 400ms 才能请求下一个
    (url, data, type, ajaxType, ajaxRecord) => {
        let ajaxRecordGet = ajaxRecordArray.find(value => {
            return value != ajaxRecord &&
                value.url === url &&
                value.data === data &&
                value.ajaxType === ajaxType &&
                ajaxRecord.time.getTime() - value.time.getTime() < 400
        });

        if (ajaxRecordGet) {
            ajaxRecordArray = ajaxRecordArray.filter(value => value != ajaxRecord);
            //不返回
            return new Promise<AjaxData>(() => { });
        }
    },
    //缓存请求返回值
    (url, data, type, ajaxType, ajaxRecord) => {
        return new Promise<AjaxData>((reslove, reject) => {
            /**
             * 
             * 
             * @param {any} value
             * @returns
             */
            var ajaxRecordGet = ajaxRecordArray.find(value => {
                return value != ajaxRecord &&
                    value.url === url &&
                    value.data === data &&
                    value.ajaxType === ajaxType
            });
            if (ajaxRecordGet) {
                ajaxRecordArray = ajaxRecordArray.filter(value => value != ajaxRecord);
                if (ajaxRecordGet.responseDate) {
                    return reslove(ajaxRecordGet.responseDate);
                } else {
                    ajaxRecordGet.response.on('end', () => {
                        reslove(ajaxRecordGet.responseDate);
                    });
                }
            }
            reslove();
        });
    },
    //延迟提交 400ms 同一时间400ms内的相同请求 只会请求最后一个请求
    (url, data, type, ajaxType, ajaxRecord) => {
        return new Promise<AjaxData>((reslove, reject) => {
            let ajaxRecordGet = ajaxRecordArray.find(value => {
                return value != ajaxRecord &&
                    value.url === url &&
                    value.data === data &&
                    value.ajaxType === ajaxType &&
                    ajaxRecord.time.getTime() - value.time.getTime() < 400
            });
            if (ajaxRecordGet) {
                clearTimeout(ajaxRecordGet.setTimeout);
            }
            ajaxRecord.setTimeout = setTimeout(function () {
                reslove();
            }, stTime);

        });
    }
]



export let ajax: AjaxFunction = async (url, data, type = 0, ajaxType = 'get') => {

    //统一添加请求路径
    if (url.indexOf('http') != 0) {
        url = config.requestUrl + url;
    }


    let ajaxRequest: superagent.SuperAgentRequest;
    let ajaxRecord: AjaxRecord = {
        url,
        time: new Date(),
        data,
        type,
        ajaxType
    };

    //创建请求
    switch (ajaxType) {
        case 'delete':
            ajaxRequest = superagent.delete(url);
            break;
        case 'put':
            ajaxRequest = superagent.put(url);
            break;
        case 'get':
            ajaxRequest = superagent.get(url);
            break;
        case 'post':
            ajaxRequest = superagent.post(url);
            break;
    }

    //创建请求数据
    if (data) {
        ajaxRequest = ajaxRequest.send(data);
    }

    //添加请求记录 反向添加
    ajaxRecordArray.unshift(ajaxRecord);
    let typeFunctionValue = await typeFunctionArray[type](url, data, type, ajaxType, ajaxRecord);
    if (typeFunctionValue) {
        return typeFunctionValue;
    }

    let promiseFunction = (reslove, reject) => {
        //发送请求
        ajaxRequest.end((error, res) => {
            ajaxRecord.response = res;
            if (error) {
                errorMsg({
                    message: `请求错误!`,
                    description: 'status:${res.status}'
                });
                reject(ajaxRecord.responseDate);
            } else {
                try {
                    ajaxRecord.responseDate = JSON.parse(res.text);
                } catch (error) {
                    ajaxRecord.responseDate = {
                        status: 0,
                        data: res.text,
                        message: ''
                    };
                }
                reslove(ajaxRecord.responseDate);
            }
        })
    }


    return new Promise<AjaxData>(promiseFunction);
}

