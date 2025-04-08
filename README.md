# 百川网站安全监测 - MCP Tools
<p align="center">
  <img src="https://rivers-collie.oss-accelerate.aliyuncs.com/cyber-wiki-prod/image/3dd6334ecacdbc21b48333d6cde5ef3f.png" width="400" />
</p>

<h4 align="center">
  一款专门为有站点检测需求的用户打造的监测工具，能够有效地监测用户配置的站点可用性、SSL证书合法性、过期时间以及网站路径扫描等功能。  
A monitoring tool specifically designed for users with site detection needs, capable of effectively monitoring site availability, SSL certificate validity, expiration times, and website path scanning functionality for user-configured sites.
</h4>

<p align="center">
  <a target="_blank" href="https://ly.safepoint.cloud/7djz7Nf">🏠 产品介绍 、Product Introduction</a> 
</p>

## 项目介绍 / Project Introduction

百川网站安全监测系统  
基于大模型，提供通过 MCP Tools 对长亭百川云-网站安全监测的数据进行查询、分析和操作的功能。  

Rivers Radar MCP  
Based on large language models, provides data querying, analysis and operation capabilities for Chaitin Rivers Cloud - Website Security Monitoring through MCP Tools.  

## 核心能力 / Core Capabilities

• 系统配置信息查看 - 查看ID、授权、余额、套餐状态等系统信息  
• 网站资产分组查询 - 获取网站分组列表目录树及分组详情  
• 网站监控状态管理 - 暂停/恢复/添加/删除网站监控  
• Agent管理 - 获取可用Agent列表  

• System Configuration: View system info including ID, authorization, balance, plan status  
• Website Asset Groups: Query website grouping tree and group details  
• Monitoring Management: Pause/resume/add/remove website monitoring  
• Agent Management: Get available agent list  

## 快速开始 / Quick Start
```json
{
    "mcpServers": {
        "长亭百川云网站安全监测": {
        "isActive": true,
        "name": "长亭百川云网站安全监测",
        "description": "",
        "command": "npx",
        "args": [
            "-y",
            "rivers-radar-mcp"
        ],
        "env": {
            "RIVERS_ORG_TOKEN": ""
        }
        }
    }
}
```

## 许可证 / License
MIT