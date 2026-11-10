---
title: "CF 2110B - 带支架向下"
description: "给定一个表示平衡括号序列的字符串，我们需要决定是否可以恰好删除一个左括号和一个右括号，以便生成的字符串不再平衡。"
date: "2026-06-08T04:34:36+07:00"
tags: ["codeforces", "competitive-programming", "strings"]
categories: ["algorithms"]
codeforces_contest: 2110
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1026 (Div. 2)"
rating: 900
weight: 2110
solve_time_s: 68
verified: true
draft: false
---

[CF 2110B - 带括号](https://codeforces.com/problemset/problem/2110/B)

 **评分：** 900
 **标签：** 字符串
 **求解时间：** 1m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个表示平衡括号序列的字符串，我们需要决定是否可以恰好删除一个左括号和一个右括号，以便生成的字符串不再平衡。 平衡序列遵循通常的规则：每个左括号都有一个匹配的右括号，并且括号正确嵌套。 

输入由多个测试用例组成，并且保证每个字符串是平衡的。 每个字符串的长度最多可达 200,000，并且所有测试用例中的所有字符串的总和也不超过 200,000。 这意味着我们必须在相对于字符串长度的大致线性时间内解决每个测试用例，因为二次或三次算法太慢。 

最小可能的平衡序列是“()”和“((...))”，这使我们能够深入了解边缘情况。 例如，像“()”这样的序列不能通过删除一个左括号和一个右括号来破坏：删除两者会留下空字符串，但它仍然是平衡的。 类似地，没有连接单独的平衡块的完美嵌套的序列，如“(())”，也不能通过删除每种类型的括号之一来破坏。 另一方面，由连接的平衡子序列组成的序列，如“(())()()”，可以通过删除相邻块的最后一个左括号和第一个右括号来破坏。 

当序列是单个嵌套块（例如“(())”）时，会出现不明显的边缘情况，其中从不同位置删除一个左括号和一个右括号不会造成不平衡。 天真地尝试随机删除可能表明它可以被破坏，但仔细检查表明它不能被破坏。 

## 方法

 暴力方法会考虑每一对的一个左括号和一个右括号，将它们删除，并检查所得的字符串是否平衡。 检查平衡需要扫描字符串并维护净开放括号的计数器。 这种方法是正确的，但是对于长度的字符串$n$，这将涉及到$O(n^3)$最坏情况下的操作：$O(n^2)$对和$O(n)$来验证余额。 和$n$up to 200,000, this is infeasible.

 The key observation is that a balanced sequence can only resist being broken if it is a perfectly nested single block without concatenation. If the first half of the sequence is all openings and the second half all closings, removing one opening from the start and one closing from the end still leaves a balanced sequence. This structure is equivalent to a string of the form "((...))" with no concatenation. Any other balanced sequence has at least two "blocks" that are adjacent; removing the last opening of the first block and the first closing of the next block creates an imbalance, so it can be broken.

 Thus, the problem reduces to checking whether the sequence is a perfectly nested block. If it is, output "NO"; otherwise, output "YES".

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 太慢了|
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. For each test case, read the string$s$。 保证字符串平衡，因此左括号的数量等于右括号的数量。 
2. 计算从字符串开头到第一个右括号的连续左括号的数量。 打电话给这个`prefix_open`。 
3. 计算从字符串末尾到第一个左括号的连续右括号的数量。 打电话给这个`suffix_close`。 
4. 比较`prefix_open + suffix_close`到字符串的总长度。 如果它们等于字符串长度，则意味着所有左括号都在开头，所有右括号都在结尾。 这是一个单一的嵌套块。 
5. 如果是单个嵌套块，则输出“NO”，因为在任何位置删除一个左括号和一个右括号仍会留下平衡序列。 否则，输出“YES”，因为至少有一种方法可以从两个相邻块中删除括号并打破平衡。 

为什么它有效：这里的不变性是，不是单个嵌套块的平衡序列至少包含两个块之间的一个边界。 从一个块的末尾删除一个括号并从下一个块的开头删除一个括号总是会产生一个不匹配的括号，从而打破平衡。 相反，单个嵌套块不能仅用每种类型的括号中的一个来破坏。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    t = int(input())
    for _ in range(t):
        s = input().strip()
        n = len(s)
        prefix_open = 0
        while prefix_open < n and s[prefix_open] == '(':
            prefix_open += 1
        suffix_close = 0
        while suffix_close < n and s[n - 1 - suffix_close] == ')':
            suffix_close += 1
        if prefix_open + suffix_close == n:
            print("NO")
        else:
            print("YES")

if __name__ == "__main__":
    main()
```第一个循环计算初始连续左括号的数量。 第二个循环计算尾随的连续右括号。 将它们的总和与总长度进行比较直接检查单个嵌套块结构。 边缘情况，如“()”或“((()))”，可以正确处理，因为在这些情况下`prefix_open + suffix_close`等于字符串的长度，产生正确的“NO”。 

## 工作示例

 输入示例 1：`"(())"`| 我| 前缀_打开 | 后缀_关闭 | 前缀_打开 + 后缀_关闭 | 输出|
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 2 | 4 | 否 |

 跟踪显示所有开口都在开始处，所有闭合都在结束处，形成一个块。 移除其中一个并不会破坏平衡。 

输入示例 2：`"(())()()"`| 我| 前缀_打开 | 后缀_关闭 | 前缀_打开 + 后缀_关闭 | 输出|
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 2 | 4 | 是的 |

 这里，字符串不是单个块。 有两个平衡子序列的串联。 从第二个块中删除一个开始并从第一个块中删除一个结束会破坏序列，因此输出为“YES”。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个测试用例需要两次线性扫描来计算前缀和后缀括号。 |
 | 空间| O(1) | O(1) | 仅需要整数计数器。 没有与 n 成比例的额外存储。 |

 鉴于所有字符串长度的总和不超过 200,000，该算法可以在 1 秒内轻松运行，并且使用的内存可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    main()
    return out.getvalue().strip()

# provided samples
assert run("4\n(())\n(())()()\n()\n(())(())\n") == "NO\nYES\nNO\nYES", "sample 1"

# minimum-size input, cannot break
assert run("1\n()\n") == "NO", "minimum size"

# maximum-size nested block, cannot break
assert run(f"1\n{'(' * 100000 + ')' * 100000}\n") == "NO", "max size nested block"

# two concatenated blocks, can break
assert run(f"1\n{'(' * 50000 + ')' * 50000 + '(' * 50000 + ')' * 50000}\n") == "YES", "max size concatenated"

# single pair with surrounding blocks, can break
assert run("1\n()()()\n") == "YES", "multiple small blocks"

# alternating brackets, can break
assert run("1\n()()()()\n") == "YES", "alternating blocks"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | “()”| 否 | 最小长度序列 |
 | 100000 '(' + 100000 ')' | 否 | 最大尺寸单块 |
 | 50000 '(' + 50000 ')' + 50000 '(' + 50000 ')' | 是的 | 最大尺寸的串联块 |
 | “()()()” | 是的 | 多个小块 |
 | “()()()()”| 是的 | 交替括号，易碎|

 ## 边缘情况

 对于“()”，算法计数`prefix_open = 1`和`suffix_close = 1`。 它们的和等于 2，即字符串的长度，因此它正确输出“NO”。 对于大型嵌套块，例如 100,000 个“(”后跟 100,000 个“)”，计数器会正确检测到单个嵌套块并返回“NO”。 对于连接块，如“(())()()”，前缀和后缀之和小于总长度，触发“YES”，表明算法正确处理块之间的边界。
