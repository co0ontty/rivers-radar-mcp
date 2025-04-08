import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAgentList,getOrgList, deleteGroup,addGroup,deleteWebsiteMonitor,addWebsiteMonitor,getGroupDetailList, getSpaceDetail, changeWebsiteMonitorStatus } from "./radar/api.js";

function getEnv() {
  const orgToken = process.env.RIVERS_ORG_TOKEN || "";
  const orgName = process.env.RIVERS_ORG_NAME || "未命名空间";
  if (orgToken == "") {
    throw new Error("RIVERS_ORG_TOKEN is required.");
  }
  return {"orgToken":orgToken, "orgName":orgName};
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "百川网站安全监测",
    version: "0.1.4",
  });

  // 系统配置信息查看
  server.tool(
    "系统配置信息查看",
    "查看百川网站安全监测应用的系统配置信息,如ID、授权、余额、套餐状态、系统设置等,这些信息可用于其他工具的输入参数。其中金额单位是分，货币是人民币。", 
    async () => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      } 
      const space_info = await getSpaceDetail(org_info.orgToken);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(space_info, null, 2),
          },
        ],
      };
    }
  )

  // 分组列表获取
  server.tool(
    "分组列表获取",
    "获取长亭百川网站安全监测应用中的网站分组列表目录树。执行此工具将返回所有可用的分组ID，这些ID可用于其他工具的输入参数。请先执行此工具以获取有效的分组ID。",
    async () => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }

      const group_tree_detail = {} as Record<string, any>;
      group_tree_detail[org_info.orgName] = await getOrgList(org_info.orgToken);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(group_tree_detail, null, 2),
          },
        ],
      };
    },
  );

  // 网站列表数据查看
  server.tool(
    "网站列表数据查看",
    "获取长亭百川网站安全监测应用中指定分组下的网站详情列表及状态的缩略信息。注意：使用此工具前，请先执行'分组列表获取'工具以获取有效的分组ID。父节点 ID 查询的数据包含子节点的信息，无需重复执行子节点查询。",
    {
        group_id: z.string().describe("分组ID - 需要从'分组列表获取'工具的返回结果中获取"),
    },
    async ({group_id}) => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }
      
      // 参数校验
      if (!group_id) {
        throw new Error("分组ID不能为空，请先执行'分组列表获取'工具获取有效的分组ID");
      }

      const detail_info = {} as Record<string, any>;
      detail_info[org_info.orgName] = await getGroupDetailList(group_id.toString(), org_info.orgToken);
        
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(detail_info, null, 2),
          },
        ],
      }
    }
  )

  // 暂停监控
  server.tool(
    "网站监控暂停",
    "暂停长亭百川网站安全监测应用中指定网站的监控。执行此工具将暂停指定网站的监控，但不会删除网站数据。",
    {
      website_uuids: z.array(z.string()).describe("网站UUID列表 - 需要从'网站列表数据查看'工具的返回结果中获取"),
    },  
    async ({website_uuids}) => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }
      const res = await changeWebsiteMonitorStatus(website_uuids, org_info.orgToken,false);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }
  );

  // 恢复监控
  server.tool(
    "网站监控恢复",
    "恢复长亭百川网站安全监测应用中指定的已暂停网站的监控。执行此工具将恢复指定网站的监控",
    {
      website_uuids: z.array(z.string()).describe("网站UUID列表 - 需要从'网站列表数据查看'工具的返回结果中获取"),
    },  
    async ({website_uuids}) => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }
      const res = await changeWebsiteMonitorStatus(website_uuids, org_info.orgToken,true);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res, null, 2),
          },
        ],
      };
    }
  );

  // 获取 agent 列表
  server.tool(
    "获取 agent 列表",
    "获取长亭百川网站安全监测应用中可用的 agent 列表。执行此工具将返回所有可用的 agent 信息，包括 agent 的 UUID 和名称。",
    {},
    async () => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }
      const res = await getAgentList(org_info.orgToken);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res, null, 2),
          },
        ],
      }
    } 
  )
  // 添加监控
  server.tool(
    "添加监控",
    "添加长亭百川网站安全监测应用中指定的网站到指定的分组中。执行此工具将添加指定网站到指定分组中",
    {
      website_url: z.string().describe("网站URL - 格式：URL_ADDRESS.com"),
      health_check_url: z.string().describe("健康检查URL - 格式：URL_ADDRESS.com"),
      group_id: z.string().describe("分组ID - 需要从'分组列表获取'工具的返回结果中获取"),
      agent_uuid: z.string().describe("agent UUID - 需要从'获取 agent 列表'工具的返回结果中获取"),
    }, 
    async ({website_url, health_check_url, group_id,agent_uuid}) => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }
      if (!website_url || !health_check_url || !group_id || !agent_uuid) {
        throw new Error("参数不能为空");
      }
      const res = await addWebsiteMonitor(website_url, health_check_url, agent_uuid, parseInt(group_id), org_info.orgToken);
      return {
        content: [
          {
            type: "text", 
            text: JSON.stringify(res, null, 2),
          } 
        ]  
      }
    }
  )

  // 删除监控
  server.tool(
    "删除监控",
    "删除长亭百川网站安全监测应用中指定的一个网站。执行此工具将删除指定网站的监控", 
    {
      website_uuid:z.string().describe("网站UUID - 需要从'网站列表数据查看'工具的返回结果中获取"), 
    },
    async ({website_uuid}) => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }
      if (!website_uuid) {
        throw new Error("参数不能为空");
      }
      const res = await deleteWebsiteMonitor(website_uuid, org_info.orgToken);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res, null, 2),
          },
        ],  
      } 
    }
  )

  // 添加分组
  server.tool(
    "添加分组",
    "添加长亭百川网站安全监测应用中指定的分组。执行此工具将添加指定分组。添加后要重新执行'分组列表获取'工具以获取最新的分组ID",
    {
      group_name: z.string().describe("分组名称 - 格式：分组名称"),
      parent_id: z.string().describe("父分组ID - 需要从'分组列表获取'工具的返回结果中获取"),
    } ,
    async ({group_name, parent_id}) => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }
      if (!group_name || !parent_id) {
        throw new Error("参数不能为空");
      } 
      const res = await addGroup(group_name, parseInt(parent_id), org_info.orgToken);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res, null, 2),
          },
        ],
      }
    }
  )
  // 删除分组
  server.tool(
    "删除分组",
    "删除长亭百川网站安全监测应用中指定的分组。执行此工具将删除指定分组",
    {
      group_id: z.string().describe("分组ID - 需要从'分组列表获取'工具的返回结果中获取"),
    },
    async ({group_id}) => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      } 
      if (!group_id) {
        throw new Error("参数不能为空"); 
      }
      const res = await deleteGroup(parseInt(group_id), org_info.orgToken);
      return {
        content: [
          {
            type: "text",
            text: JSON.stringify(res, null, 2),
          },
        ],
      }
    } 
  )
  return server;
}
