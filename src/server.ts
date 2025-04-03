import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getOrgList, getGroupDetailList, getSpaceDetail } from "./radar/api.js";

function getEnv() {
  const orgToken = process.env.RIVERS_ORG_TOKENS || "";
  const orgName = process.env.RIVERS_ORG_NAMES || "未命名空间";
  
  return {"orgToken":orgToken, "orgName":orgName};
}

export function createServer(): McpServer {
  const server = new McpServer({
    name: "百川网站安全监测",
    version: "0.1.0",
  });

  server.tool(
    "系统配置信息查看",
    "查看百川网站安全监测应用的系统配置信息,如ID、授权、余额、套餐状态、系统设置等,这些信息可用于其他工具的输入参数。", 
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

  server.tool(
    "网站列表查看",
    "获取长亭百川网站安全监测应用中指定分组下的网站详情列表及状态的缩略信息。注意：使用此工具前，请先执行'分组列表获取'工具以获取有效的分组ID。父节点 ID 查询的数据包含子节点的信息，无需重复执行子节点查询。",
    {
      params: z.object({
        group_id: z.string().describe("分组ID - 需要从'分组列表获取'工具的返回结果中获取"),
      }),
    },
    async ({params}) => {
      const org_info = getEnv();
      if (!org_info) {
        throw new Error("rivers token is required.");
      }
      const detail_info = {} as Record<string, any>;
      detail_info[org_info.orgName] = await getGroupDetailList(params.group_id, org_info.orgToken);
        
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
  return server;
}
