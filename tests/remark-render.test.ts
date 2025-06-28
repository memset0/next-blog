/**
 * Remark 渲染功能测试
 */

import { renderMarkdown } from "@/lib/markdown";
import { expect, describe, test } from "vitest";

// 自定义断言函数
function assertContains(str: string, substring: string, message: string) {
  expect(str, message).toContain(substring);
}

function assertNotContains(str: string, substring: string, message: string) {
  expect(str, message).not.toContain(substring);
}

describe("Markdown 渲染测试", () => {
  test("基本 Markdown 渲染测试", async () => {
    console.log("\n=== 基本 Markdown 渲染测试 ===");

    const input = `# 一级标题

## 二级标题

这是一段**粗体**文字和*斜体*文字。

- 列表项1
- 列表项2

这是一个[链接](https://example.com)。`;

    const result = await renderMarkdown(input, { enableHighlight: false });

    console.log("输入:", input);
    console.log("输出:", result);

    // 验证基本 HTML 结构
    assertContains(result, "<h1>", "包含一级标题");
    assertContains(result, "<h2>", "包含二级标题");
    assertContains(result, "<strong>", "包含粗体");
    assertContains(result, "<em>", "包含斜体");
    assertContains(result, "<ul>", "包含列表");
    assertContains(result, "<li>", "包含列表项");
    assertContains(result, "<a href", "包含链接");

    // 验证内容正确性
    assertContains(result, "一级标题", "包含标题内容");
    assertContains(result, "粗体", "包含粗体内容");
    assertContains(result, "斜体", "包含斜体内容");

    console.log("基本 Markdown 测试通过! ✅");
  });

  test("高亮语法渲染测试", async () => {
    console.log("\n=== 高亮语法渲染测试 ===");

    const input = "这是 ==高亮文字== 的测试。";
    const result = await renderMarkdown(input, { enableHighlight: true });

    console.log("输入:", input);
    console.log("输出:", result);

    // 验证高亮语法是否正确渲染
    assertContains(result, '<mark class="m-mark">', "包含高亮标签");
    assertContains(result, "高亮文字", "包含高亮内容");
    assertContains(result, "</mark>", "包含高亮结束标签");

    console.log("高亮语法测试通过! ✅");
  });

  test("多个高亮语法测试", async () => {
    console.log("\n=== 多个高亮语法测试 ===");

    const input = "这段话包含 ==第一个高亮== 和 ==第二个高亮== 的内容。";
    const result = await renderMarkdown(input, { enableHighlight: true });

    console.log("输入:", input);
    console.log("输出:", result);

    // 验证两个高亮都被正确渲染
    const markMatches = result.match(/<mark class="m-mark">/g);
    expect(markMatches?.length).toBe(2);

    assertContains(result, "第一个高亮", "包含第一个高亮内容");
    assertContains(result, "第二个高亮", "包含第二个高亮内容");

    console.log("多个高亮语法测试通过! ✅");
  });

  test("混合语法测试", async () => {
    console.log("\n=== 混合语法测试 ===");

    const input = `# 标题

这是一段包含 ==高亮文字== 的**粗体**内容。

- 普通列表项
- ==高亮的列表项==

> 这是一个包含 ==高亮内容== 的引用块。`;

    const result = await renderMarkdown(input, { enableHighlight: true });

    console.log("输入:", input);
    console.log("输出:", result);

    // 验证 Markdown 基本语法
    assertContains(result, "<h1>", "包含标题");
    assertContains(result, "<strong>", "包含粗体");
    assertContains(result, "<ul>", "包含列表");
    assertContains(result, "<blockquote>", "包含引用");

    // 验证高亮语法
    assertContains(result, '<mark class="m-mark">', "包含高亮标签");
    assertContains(result, "高亮文字", "包含高亮内容1");
    assertContains(result, "高亮的列表项", "包含高亮内容2");
    assertContains(result, "高亮内容", "包含高亮内容3");

    console.log("混合语法测试通过! ✅");
  });

  test("禁用高亮插件测试", async () => {
    console.log("\n=== 禁用高亮插件测试 ===");

    const input = "这是 ==不应该高亮== 的文字。";
    const result = await renderMarkdown(input, { enableHighlight: false });

    console.log("输入:", input);
    console.log("输出:", result);

    // 验证高亮语法没有被处理
    assertNotContains(result, '<mark class="m-mark">', "不应包含高亮标签");
    assertContains(result, "==不应该高亮==", "应保留原始高亮标记");

    console.log("禁用高亮插件测试通过! ✅");
  });

  test("边界情况测试", async () => {
    console.log("\n=== 边界情况测试 ===");

    // 空字符串
    let result = await renderMarkdown("", { enableHighlight: true });
    console.log("空字符串输出:", result);
    expect(result).toBe("");

    // 不配对的高亮标记
    result = await renderMarkdown("这是 ==不配对的高亮", { enableHighlight: true });
    console.log("不配对高亮输出:", result);
    assertContains(result, "==不配对的高亮", "不配对标记应保留原样");

    console.log("边界情况测试通过! ✅");
  });
});
