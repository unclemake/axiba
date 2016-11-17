define("components/ajax/index.js",function(require, exports, module) {"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator.throw(value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
const superagent = require('superagent');
const index_1 = require('../notification/index');
const config_1 = require('../global/config');
/**
 * get 请求
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
function get(url, data, type) {
    return exports.ajax(url, data, type, 'get');
}
exports.get = get;
/**
 * post 请求
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
function post(url, data, type) {
    return exports.ajax(url, data, type, 'post');
}
exports.post = post;
/**
 * put 请求
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
function put(url, data, type) {
    return exports.ajax(url, data, type, 'put');
}
exports.put = put;
/**
 * del 请求
 *
 * @export
 * @param {string} url
 * @param {{ [key: string]: any }} [data]
 * @param {number} [type]
 * @returns
 */
function del(url, data, type) {
    return exports.ajax(url, data, type, 'delete');
}
exports.del = del;
/**
 * ajax 记录
 */
let ajaxRecordArray = [];
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
let typeFunctionArray = [
    // 同url同参数同类型 上一个完成时过 400ms 才能请求下一个
        (url, data, type, ajaxType, ajaxRecord) => {
        let ajaxRecordGet = ajaxRecordArray.find(value => {
            return value != ajaxRecord &&
                value.url === url &&
                value.data === data &&
                value.ajaxType === ajaxType &&
                ajaxRecord.time.getTime() - value.time.getTime() < 400;
        });
        if (ajaxRecordGet) {
            ajaxRecordArray = ajaxRecordArray.filter(value => value != ajaxRecord);
            //不返回
            return new Promise(() => { });
        }
    },
    //缓存请求返回值
        (url, data, type, ajaxType, ajaxRecord) => {
        return new Promise((reslove, reject) => {
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
                    value.ajaxType === ajaxType;
            });
            if (ajaxRecordGet) {
                ajaxRecordArray = ajaxRecordArray.filter(value => value != ajaxRecord);
                if (ajaxRecordGet.responseDate) {
                    return reslove(ajaxRecordGet.responseDate);
                }
                else {
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
        return new Promise((reslove, reject) => {
            let ajaxRecordGet = ajaxRecordArray.find(value => {
                return value != ajaxRecord &&
                    value.url === url &&
                    value.data === data &&
                    value.ajaxType === ajaxType &&
                    ajaxRecord.time.getTime() - value.time.getTime() < 400;
            });
            if (ajaxRecordGet) {
                clearTimeout(ajaxRecordGet.setTimeout);
            }
            ajaxRecord.setTimeout = setTimeout(function () {
                reslove();
            }, stTime);
        });
    }
];
exports.ajax = (url, data, type = 0, ajaxType = 'get') => __awaiter(this, void 0, void 0, function* () {
    //统一添加请求路径
    if (url.indexOf('http') != 0) {
        url = config_1.ajax.requestUrl + url;
    }
    let ajaxRequest;
    let ajaxRecord = {
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
    let typeFunctionValue = yield typeFunctionArray[type](url, data, type, ajaxType, ajaxRecord);
    if (typeFunctionValue) {
        return typeFunctionValue;
    }
    let promiseFunction = (reslove, reject) => {
        //发送请求
        ajaxRequest.end((error, res) => {
            ajaxRecord.response = res;
            if (error) {
                index_1.error({
                    message: `请求错误!`,
                    description: 'status:${res.status}'
                });
                reject(ajaxRecord.responseDate);
            }
            else {
                try {
                    ajaxRecord.responseDate = JSON.parse(res.text);
                }
                catch (error) {
                    ajaxRecord.responseDate = {
                        status: 0,
                        data: res.text,
                        message: ''
                    };
                }
                reslove(ajaxRecord.responseDate);
            }
        });
    };
    return new Promise(promiseFunction);
});
});
//# sourceMappingURL=index.js.map
