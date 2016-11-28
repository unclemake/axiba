define("components/ajax/index.js",function(require, exports, module) {
"use strict";

var __awaiter = undefined && undefined.__awaiter || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) {
            try {
                step(generator.next(value));
            } catch (e) {
                reject(e);
            }
        }
        function rejected(value) {
            try {
                step(generator.throw(value));
            } catch (e) {
                reject(e);
            }
        }
        function step(result) {
            result.done ? resolve(result.value) : new P(function (resolve) {
                resolve(result.value);
            }).then(fulfilled, rejected);
        }
        step((generator = generator.apply(thisArg, _arguments)).next());
    });
};
var superagent = require('superagent');
var index_1 = require('../notification/index');
var config_1 = require('../global/config');
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
var ajaxRecordArray = [];
/**
 *  ajaxType3 延迟时间
 */
var stTime = 400;
/**
 * ajaxType 函数集合
 * 0. 同url同参数同类型 上一个完成时过 400ms 才能请求下一个
 * 1. 缓存请求返回值
 * 2. 延迟提交 400ms 同一时间400ms内的相同请求 只会请求最后一个请求
 */
var typeFunctionArray = [
// 同url同参数同类型 上一个完成时过 400ms 才能请求下一个
function (url, data, type, ajaxType, ajaxRecord) {
    var ajaxRecordGet = ajaxRecordArray.find(function (value) {
        return value != ajaxRecord && value.url === url && value.data === data && value.ajaxType === ajaxType && ajaxRecord.time.getTime() - value.time.getTime() < 400;
    });
    if (ajaxRecordGet) {
        ajaxRecordArray = ajaxRecordArray.filter(function (value) {
            return value != ajaxRecord;
        });
        //不返回
        return new Promise(function () {});
    }
},
//缓存请求返回值
function (url, data, type, ajaxType, ajaxRecord) {
    return new Promise(function (reslove, reject) {
        /**
         *
         *
         * @param {any} value
         * @returns
         */
        var ajaxRecordGet = ajaxRecordArray.find(function (value) {
            return value != ajaxRecord && value.url === url && value.data === data && value.ajaxType === ajaxType;
        });
        if (ajaxRecordGet) {
            ajaxRecordArray = ajaxRecordArray.filter(function (value) {
                return value != ajaxRecord;
            });
            if (ajaxRecordGet.responseDate) {
                return reslove(ajaxRecordGet.responseDate);
            } else {
                ajaxRecordGet.response.on('end', function () {
                    reslove(ajaxRecordGet.responseDate);
                });
            }
        }
        reslove();
    });
},
//延迟提交 400ms 同一时间400ms内的相同请求 只会请求最后一个请求
function (url, data, type, ajaxType, ajaxRecord) {
    return new Promise(function (reslove, reject) {
        var ajaxRecordGet = ajaxRecordArray.find(function (value) {
            return value != ajaxRecord && value.url === url && value.data === data && value.ajaxType === ajaxType && ajaxRecord.time.getTime() - value.time.getTime() < 400;
        });
        if (ajaxRecordGet) {
            clearTimeout(ajaxRecordGet.setTimeout);
        }
        ajaxRecord.setTimeout = setTimeout(function () {
            reslove();
        }, stTime);
    });
}];
exports.ajax = function (url, data) {
    var type = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var ajaxType = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'get';
    return __awaiter(undefined, void 0, void 0, regeneratorRuntime.mark(function _callee() {
        var ajaxRequest, ajaxRecord, typeFunctionValue, promiseFunction;
        return regeneratorRuntime.wrap(function _callee$(_context) {
            while (1) {
                switch (_context.prev = _context.next) {
                    case 0:
                        //统一添加请求路径
                        if (url.indexOf('http') != 0) {
                            url = config_1.ajax.requestUrl + url;
                        }
                        ajaxRequest = void 0;
                        ajaxRecord = {
                            url: url,
                            time: new Date(),
                            data: data,
                            type: type,
                            ajaxType: ajaxType
                        };
                        //创建请求

                        _context.t0 = ajaxType;
                        _context.next = _context.t0 === 'delete' ? 6 : _context.t0 === 'put' ? 8 : _context.t0 === 'get' ? 10 : _context.t0 === 'post' ? 12 : 14;
                        break;

                    case 6:
                        ajaxRequest = superagent.delete(url);
                        return _context.abrupt('break', 14);

                    case 8:
                        ajaxRequest = superagent.put(url);
                        return _context.abrupt('break', 14);

                    case 10:
                        ajaxRequest = superagent.get(url);
                        return _context.abrupt('break', 14);

                    case 12:
                        ajaxRequest = superagent.post(url);
                        return _context.abrupt('break', 14);

                    case 14:
                        //创建请求数据
                        if (data) {
                            ajaxRequest = ajaxRequest.send(data);
                        }
                        //添加请求记录 反向添加
                        ajaxRecordArray.unshift(ajaxRecord);
                        _context.next = 18;
                        return typeFunctionArray[type](url, data, type, ajaxType, ajaxRecord);

                    case 18:
                        typeFunctionValue = _context.sent;

                        if (!typeFunctionValue) {
                            _context.next = 21;
                            break;
                        }

                        return _context.abrupt('return', typeFunctionValue);

                    case 21:
                        promiseFunction = function promiseFunction(reslove, reject) {
                            //发送请求
                            ajaxRequest.end(function (error, res) {
                                ajaxRecord.response = res;
                                if (error) {
                                    index_1.error({
                                        message: '\u8BF7\u6C42\u9519\u8BEF!',
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
                            });
                        };

                        return _context.abrupt('return', new Promise(promiseFunction));

                    case 23:
                    case 'end':
                        return _context.stop();
                }
            }
        }, _callee, this);
    }));
};
});
//# sourceMappingURL=index.js.map
