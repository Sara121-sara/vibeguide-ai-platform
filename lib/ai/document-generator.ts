import OpenAI from 'openai';

const openai = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
  defaultHeaders: {
    "HTTP-Referer": process.env.NEXT_PUBLIC_SITE_URL,
    "X-Title": "VibeGuide",
  },
});

export async function generateQuestions(projectDescription: string): Promise<string[]> {
  try {
    const completion = await openai.chat.completions.create({
      model: "anthropic/claude-sonnet-4",
      messages: [
        {
          role: "user",
          content: `作为一个专业的产品经理，请根据以下项目描述生成3-5个具体的问题，帮助深入了解项目需求：

项目描述：
${projectDescription}

请生成的问题要具体、有针对性，能够帮助完善项目需求。每个问题单独一行，不要编号。`
        }
      ],
      temperature: 0.7,
      max_tokens: 800
    });

    const response = completion.choices[0].message.content || '';
    return response.split('\n').filter(q => q.trim().length > 0);
  } catch (error) {
    console.error('生成问题失败:', error);
    throw new Error('AI服务暂时不可用，请稍后重试');
  }
}

export async function generateDocuments(projectDescription: string, requirements: string) {
  const documents = {};
  
  const documentTypes = [
    {
      key: 'userJourney',
      name: '用户旅程地图',
      prompt: `基于以下信息，生成详细的用户旅程地图文档：

项目描述：${projectDescription}

需求分析：${requirements}

请生成一个完整的用户旅程地图，包括：
1. 用户画像分析
2. 用户需求和痛点
3. 用户旅程各个阶段
4. 触点分析
5. 改进建议

使用Markdown格式，结构清晰，内容专业。`
    },
    {
      key: 'prd',
      name: '产品需求PRD',
      prompt: `基于以下信息，生成详细的产品需求文档（PRD）：

项目描述：${projectDescription}

需求分析：${requirements}

请生成一个完整的PRD文档，包括：
1. 产品概述
2. 目标用户
3. 功能需求
4. 非功能需求
5. 用户故事
6. 验收标准
7. 优先级排序

使用Markdown格式，结构清晰，内容专业。`
    },
    {
      key: 'frontend',
      name: '前端设计文档',
      prompt: `基于以下信息，生成详细的前端设计文档：

项目描述：${projectDescription}

需求分析：${requirements}

请生成一个完整的前端设计文档，包括：
1. 技术栈选择
2. 项目结构
3. 组件设计
4. 状态管理
5. 路由设计
6. UI/UX设计原则
7. 响应式设计
8. 性能优化

使用Markdown格式，结构清晰，内容专业。`
    },
    {
      key: 'backend',
      name: '后端设计文档',
      prompt: `基于以下信息，生成详细的后端设计文档：

项目描述：${projectDescription}

需求分析：${requirements}

请生成一个完整的后端设计文档，包括：
1. 技术架构
2. API设计
3. 数据流设计
4. 安全设计
5. 性能优化
6. 部署方案
7. 监控和日志
8. 扩展性考虑

使用Markdown格式，结构清晰，内容专业。`
    },
    {
      key: 'database',
      name: '数据库设计',
      prompt: `基于以下信息，生成详细的数据库设计文档：

项目描述：${projectDescription}

需求分析：${requirements}

请生成一个完整的数据库设计文档，包括：
1. 数据库选型
2. 数据模型设计
3. 表结构设计
4. 索引设计
5. 关系设计
6. 数据迁移策略
7. 备份和恢复
8. 性能优化

使用Markdown格式，结构清晰，内容专业。`
    }
  ];

  // 批量生成文档
  const promises = documentTypes.map(async (docType) => {
    try {
      const completion = await openai.chat.completions.create({
        model: "anthropic/claude-sonnet-4",
        messages: [
          {
            role: "user",
            content: docType.prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 1500
      });

      return {
        key: docType.key,
        content: completion.choices[0].message.content || `# ${docType.name}\n\n生成失败，请重试。`
      };
    } catch (error: unknown) {
      console.error(`生成${docType.name}失败:`, error);
      
      // 检查是否是402错误（点数不足）
      if (error && typeof error === 'object' && 'status' in error && error.status === 402) {
        throw new Error('OPENROUTER_CREDITS_INSUFFICIENT');
      }
      
      return {
        key: docType.key,
        content: `# ${docType.name}\n\n生成失败，请重试。\n\n错误信息：${error}`
      };
    }
  });

  const results = await Promise.all(promises);
  
  results.forEach(result => {
    documents[result.key] = result.content;
  });

  return documents;
}