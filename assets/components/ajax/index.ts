import * as superagent from 'superagent';
import { error as errorMsg } from '../Notification/index';

// 添加后端访问路径等处理
export function get(url: string, data?: { [key: string]: any }, type?: number) {
    return ajax(url, data, type, 'get');
}

export function post(url: string, data?: { [key: string]: any }, type?: number) {
    return ajax(url, data, type, 'post');
}

export function put(url: string, data?: { [key: string]: any }, type?: number) {
    return ajax(url, data, type, 'put');
}

export function del(url: string, data?: { [key: string]: any }, type?: number) {
    return ajax(url, data, type, 'delete');
}

let ajaxRecordArray: Array<AjaxRecord> = []

interface AjaxRecord {
    url: string,
    time: Date,
    type: number,
    data: { [key: string]: any },
    ajaxType: string,
    responseDate?: AjaxData,
    response?: superagent.Response
}

interface AjaxData {
    status: number,
    data: string | { [key: string]: string },
    message: string
}


interface ajaxFunction {
    (url: string, data?: { [key: string]: any }, type?: number, ajaxType?: string): Promise<AjaxData | never>
}


let typeFunctionArray: Array<ajaxFunction> = [
    //同url同参数同类型 上一个完成时过 100ms 才能请求下一个
    (url, data, type, ajaxType) => {
        let ajaxRecord = ajaxRecordArray.find(value => {
            console.log(new Date().getTime() - value.time.getTime());
            return value.url === url &&
                value.data === data &&
                value.ajaxType === ajaxType &&
                !!value.response &&
                new Date().getTime() - value.time.getTime() < 100
        });

        if (ajaxRecord) {
            //不返回
            return new Promise<AjaxData>(() => { });
        }
    },
    //缓存
    (url, data, type, ajaxType) => {
        return new Promise<AjaxData>((reslove, reject) => {
            var ajaxRecord = ajaxRecordArray.find(value => {
                return value.url === url &&
                    value.data === data &&
                    value.ajaxType === ajaxType
            });
            if (ajaxRecord) {
                if (ajaxRecord.responseDate) {
                    return ajaxRecord.responseDate;
                } else {
                    ajaxRecord.response.on('end', () => {
                        reslove(ajaxRecord.responseDate);
                    });
                }
            }
        });
    }
]


export let ajax: ajaxFunction = async (url, data, type = 0, ajaxType = 'get') => {
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

    let typeFunctionValue = typeFunctionArray[type](url, data, type, ajaxType);
    if (typeFunctionValue) {
        return typeFunctionValue;
    }
    //添加请求记录
    ajaxRecordArray.unshift(ajaxRecord);

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

