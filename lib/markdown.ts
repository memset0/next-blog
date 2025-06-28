/**
 * Markdown 渲染模块
 *
 * 本模块负责处理 Markdown 内容的解析和渲染，
 * 包括各种自定义插件的集成和配置。
 */

import { remark } from "remark";
import remarkHtml from "remark-html";

import remarkMark from "@/lib/remark-plugins/mark";

/**
 * Markdown 渲染器配置选项
 */
export interface MarkdownRenderOptions {
  /** 是否启用高亮语法插件 */
  enableHighlight?: boolean;
  /** 其他扩展选项 */
  [key: string]: any;
}

/**
 * 默认的 Markdown 渲染器配置
 */
const DEFAULT_OPTIONS: MarkdownRenderOptions = {
  enableHighlight: true,
};

/**
 * 创建配置好的 remark 处理器
 *
 * @param options - 渲染器配置选项
 * @returns 配置好的 remark 处理器
 */
function createMarkdownProcessor(options: MarkdownRenderOptions = {}) {
  const config = { ...DEFAULT_OPTIONS, ...options };

  // 创建基础处理器，使用 any 类型避免复杂的类型推断问题
  let processor: any = remark();

  // 添加高亮语法插件（必须在 HTML 转换之前）
  if (config.enableHighlight) {
    processor = processor.use(remarkMark);
  }

  // 添加 HTML 转换插件（必须是最后一个）
  processor = processor.use(remarkHtml, {
    sanitize: false, // 允许自定义 HTML 标签
  });

  return processor;
}

/**
 * 将 Markdown 内容渲染为 HTML
 *
 * @param content - Markdown 内容字符串
 * @param options - 渲染器配置选项
 * @returns Promise<string> - 渲染后的 HTML 字符串
 */
export async function renderMarkdown(
  content: string,
  options?: MarkdownRenderOptions
): Promise<string> {
  // 处理空内容
  if (!content || content.trim() === "") {
    return "";
  }

  try {
    const processor = createMarkdownProcessor(options);

    // 使用 process 方法进行异步处理
    const vfile = await processor.process(content);
    const result = String(vfile);

    return result;
  } catch (error) {
    console.error("Markdown 渲染失败:", error);
    console.error("错误详情:", {
      message: error instanceof Error ? error.message : "未知错误",
      stack: error instanceof Error ? error.stack : undefined,
      content: content.substring(0, 100) + "...", // 只记录前100个字符
    });

    // 重新抛出错误，而不是返回原始内容
    throw new Error(`Markdown 渲染失败: ${error instanceof Error ? error.message : "未知错误"}`);
  }
}

/**
 * 同步版本的 Markdown 渲染器（仅用于简单场景）
 * 注意：此方法不支持异步插件
 *
 * @param content - Markdown 内容字符串
 * @param options - 渲染器配置选项
 * @returns 渲染后的 HTML 字符串
 */
export function renderMarkdownSync(content: string, options?: MarkdownRenderOptions): string {
  // 处理空内容
  if (!content || content.trim() === "") {
    return "";
  }

  try {
    const processor = createMarkdownProcessor(options);
    const vfile = processor.processSync(content);
    return String(vfile);
  } catch (error) {
    console.error("Markdown 同步渲染失败:", error);
    throw new Error(
      `Markdown 同步渲染失败: ${error instanceof Error ? error.message : "未知错误"}`
    );
  }
}

/**
 * 预设的渲染器配置
 */
export const MarkdownPresets = {
  /** 标准博客文章渲染器（包含所有插件） */
  blog: {
    enableHighlight: true,
  },

  /** 简单渲染器（仅基本功能） */
  simple: {
    enableHighlight: false,
  },

  /** 描述文本渲染器（适用于文章摘要等） */
  description: {
    enableHighlight: false,
  },
} as const;

/**
 * 使用预设配置渲染 Markdown
 *
 * @param content - Markdown 内容字符串
 * @param preset - 预设配置名称
 * @returns Promise<string> - 渲染后的 HTML 字符串
 */
export async function renderWithPreset(
  content: string,
  preset: keyof typeof MarkdownPresets
): Promise<string> {
  return renderMarkdown(content, MarkdownPresets[preset]);
}
