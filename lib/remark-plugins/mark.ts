/**
 * Remark 高亮插件
 *
 * 支持 ==文本== 语法的高亮功能
 * 使用简单的 AST 处理方式，不依赖额外包
 */

import type { Root, Text, Node } from "mdast";

/**
 * 高亮节点类型定义
 */
interface MarkNode extends Node {
  type: "mark";
  children: Array<Text>;
  data?: {
    hName: string;
    hProperties: {
      className: string;
    };
  };
}

/**
 * 解析高亮语法的正则表达式
 * 匹配成对的 == 标记
 */
const MARK_REGEX = /==(.*?)==/g;

/**
 * 处理文本节点中的高亮语法
 */
function processMarkSyntax(text: string): Array<Text | MarkNode> {
  const result: Array<Text | MarkNode> = [];
  let lastIndex = 0;

  // 重置正则表达式的 lastIndex
  MARK_REGEX.lastIndex = 0;

  let match;
  while ((match = MARK_REGEX.exec(text)) !== null) {
    const [fullMatch, content] = match;
    const matchStart = match.index!;
    const matchEnd = matchStart + fullMatch.length;

    // 添加高亮标记前的普通文本
    if (matchStart > lastIndex) {
      const beforeText = text.slice(lastIndex, matchStart);
      if (beforeText) {
        result.push({
          type: "text",
          value: beforeText,
        });
      }
    }

    // 添加高亮节点
    const markNode: MarkNode = {
      type: "mark",
      children: [
        {
          type: "text",
          value: content,
        },
      ],
      data: {
        hName: "mark",
        hProperties: {
          className: "m-mark",
        },
      },
    };

    result.push(markNode);
    lastIndex = matchEnd;
  }

  // 添加剩余的普通文本
  if (lastIndex < text.length) {
    const remainingText = text.slice(lastIndex);
    if (remainingText) {
      result.push({
        type: "text",
        value: remainingText,
      });
    }
  }

  // 如果没有找到任何高亮标记，返回原始文本节点
  if (result.length === 0) {
    return [
      {
        type: "text",
        value: text,
      },
    ];
  }

  return result;
}

/**
 * 递归处理 AST 节点
 */
function processNode(node: any): void {
  if (!node) return;

  // 处理文本节点
  if (node.type === "text" && typeof node.value === "string") {
    // 这个函数会被用于 visit 中，所以我们不在这里直接修改
    return;
  }

  // 递归处理子节点
  if (node.children && Array.isArray(node.children)) {
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];

      // 处理文本节点中的高亮语法
      if (child.type === "text" && typeof child.value === "string" && child.value.includes("==")) {
        const processed = processMarkSyntax(child.value);

        // 如果处理后只有一个节点且是原始文本，不需要替换
        if (
          processed.length === 1 &&
          processed[0].type === "text" &&
          processed[0].value === child.value
        ) {
          continue;
        }

        // 替换原始文本节点
        node.children.splice(i, 1, ...processed);
        i += processed.length - 1; // 调整索引
      } else {
        // 递归处理子节点
        processNode(child);
      }
    }
  }
}

/**
 * Remark 高亮插件主函数
 */
function remarkMark() {
  return function transformer(tree: Root) {
    processNode(tree);
  };
}

export default remarkMark;
