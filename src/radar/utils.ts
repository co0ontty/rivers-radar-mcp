export function getAlertInfoById(alert_id: any): {
    description: string;
    steps: string[];
    suggestions: string[];
} {
    const alertMap: Record<string, {
        text: string;
        steps: string[];
        suggestions: string[];
    }> = {
        '1': {
            text: "网页无法访问",
            steps: [
                "1. 访问告警网站，判断是否真正无法访问",
                "2. 使用阿里云网站拨测工具查看各运营商访问情况",
                "3. 检查防火墙，是否拦截网站监测健康检查节点"
            ],
            suggestions: [
                "1. 恢复网站服务",
                "2. 排查网站无法访问原因，进行解决",
                "3. 放行网站监测健康检查节点",
                "4. 优化网站性能，添加必要的加速服务，如：CDN、页面缓存"
            ]
        },
        '2': {
            text: "网页响应过慢",
            steps: [],
            suggestions: []
        },
        '3': {
            text: "发现敏感内容",
            steps: [
                "1. 直接访问页面，查看网页是否包含敏感内容",
                "2. 通过手机访问，查看网页是否包含敏感内容",
                "3. 修改 UA ，添加 apple iphone ipad android mobile baidu google sogou soso 360 ，查看网页是否包含敏感内容"
            ],
            suggestions: [
                "1. 判定敏感内容来源，清除对应的内容",
                "2. 检查网站引用的的第三方资源，是否存在敏感内容"
            ]
        },
        '4': {
            text: "网页被篡改",
            steps: [
                "1. 查看告警内容，判定是否为预期内修改"
            ],
            suggestions: [
                "1. 动态页面不建议开启篡改监控，恶意篡改可通过内容监控能力进行覆盖",
                "2. 对服务器进行漏洞监测，找到入侵途径进行修复",
                "3. 必要时使用网页防篡改应用对网站内容进行防护"
            ]
        },
        '5': {
            text: "证书即将到期",
            steps: [],
            suggestions: []
        },
        '6': {
            text: "证书不合法",
            steps: [],
            suggestions: []
        },
        '7': {
            text: "恶意链接",
            steps: [
                "1. 第三方威胁情报检索恶意链接信息",
                "2. 不掌握风险控制能力时不建议直接访问"
            ],
            suggestions: [
                "1. 立即清除网页恶意链接",
                "2. 发现并修补网站相关的各种应用及系统的安全漏洞"
            ]
        },
        '8': {
            text: "周报",
            steps: [],
            suggestions: []
        },
        '9': {
            text: "DNS 解析被篡改",
            steps: [],
            suggestions: []
        },
        '10': {
            text: "发现挂马",
            steps: [
                "1. 第三方威胁情报检索恶意链接信息",
                "2. 不掌握风险控制能力时不建议直接访问"
            ],
            suggestions: [
                "1. 立即清除指向挂马源的恶意代码，并恢复被挂马页面，防止挂马事件扩散对网站浏览者造成危害",
                "2. 发现并修补网站相关的各种应用及系统的安全漏洞",
                "3. 采用针对Web应用的防护手段"
            ]
        },
        '11': {
            text: "网页恢复访问",
            steps: [],
            suggestions: []
        },
        '12': {
            text: "发现漏洞",
            steps: [],
            suggestions: []
        }
    };
    // 如果 alert_id 是数字类型，转换为字符串
    if (typeof alert_id === 'number') {
        alert_id = alert_id.toString();
    }
    const alertInfo = alertMap[alert_id] || {
        text: "",
        steps: [],
        suggestions: []
    };

    return {
        description: alertInfo.text,
        steps: alertInfo.steps,
        suggestions: alertInfo.suggestions
    };
}