import axios, { AxiosRequestConfig } from 'axios';
import { getAlertInfoById } from './utils.js';
import { get } from 'http';

interface ApiConfig {
    baseURL?: string;
    token?: string;
}

interface RequestParams {
    [key: string]: string | number;
}

/**
 * 通用 API 请求函数
 * @param method - 请求方法 ('GET' | 'POST')
 * @param endpoint - API 端点
 * @param token - API Token
 * @param params - 请求参数
 * @param config - API 配置
 * @returns Promise<any>
 */
export async function makeApiRequest(
    method: 'GET' | 'POST',
    endpoint: string,
    token: string,
    params: RequestParams = {},
): Promise<any> {
    const axiosConfig: AxiosRequestConfig = {
        method,
        baseURL: endpoint,
        headers: {
            'X-CA-Token': token,
            'Content-Type': 'application/json',
        },
    };

    if (method === 'GET') {
        axiosConfig.params = params;
    } else {
        axiosConfig.data = params;
    }

    try {
        const response = await axios({
            url: endpoint,
            ...axiosConfig,
        });
        return response.data;
    } catch (error) {
        console.error('API 请求失败:', error);
        throw error;
    }
}

// 使用示例:
// const response = await makeApiRequest('GET', '/message', {
//   start_ts: 1740412800,
//   webhook_id: 'crbd1emmgles73ek7vcg',
//   page: 1
// });

// const res = await makeApiRequest("GET","https://radar.rivers.chaitin.cn/api/asset/v1/group/tree",api_token,{});
// const group_id = res.data[0].id;
// const detailInfoList = await makeApiRequest("GET","https://radar.rivers.chaitin.cn/api/asset/v1/website/list?group_id="+group_id,api_token,{});
// org_list.push(detailInfoList.data);

// 分组列表获取
export async function getOrgList(token: string): Promise<any> {
    const res = await makeApiRequest('GET', 'https://radar.rivers.chaitin.cn/api/asset/v1/group/tree', token, {});
    // 递归删除所有层级中的 website_uuids
    function removeWebsiteUuids(items: any[]) {
        for (const item of items) {
            delete item.website_uuids;
            if (item.child == null) {
                delete item.child;
            }
            if (item.child && Array.isArray(item.child) && item.child.length > 0) {
                removeWebsiteUuids(item.child);
            }
        }
    }
    removeWebsiteUuids(res.data);
    return res.data;
}

// 网站列表数据查看
export async function getGroupDetailList(group_id: string, token: string): Promise<any> {
    const detailInfoList = await makeApiRequest("GET", "https://radar.rivers.chaitin.cn/api/asset/v1/website/list?group_id=" + group_id, token, {});
    for (let i = 0; i < detailInfoList.data.length; i++) {
        if (detailInfoList.data[i].status.length > 0) {
            const new_alert_list = [];
            for (let j = 0; j < detailInfoList.data[i].status.length; j++) {
                const alert_id = detailInfoList.data[i].status[j];
                new_alert_list.push(getAlertInfoById(alert_id));
            }
            detailInfoList.data[i].status = new_alert_list;
        }
    }
    return detailInfoList.data;
}

// 系统配置详情获取, ID、授权、余额、套餐状态、系统设置等
export async function getSpaceDetail(token: string): Promise<any> {
    const detailInfoList = await makeApiRequest("GET", "https://radar.rivers.chaitin.cn/api/user/v1/info", token, {});
    return detailInfoList.data;
}