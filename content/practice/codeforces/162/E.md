---
title: "CF 162E - HQ9+"
description: "问题询问用笑话语言 HQ9+ 编写的程序是否会产生任何输出。 该程序是一个包含 1 到 100 个可打印 ASCII 字符的字符串。 只有四个指令重要：“H”、“Q”、“9”和“+”。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 162
codeforces_index: "E"
codeforces_contest_name: "VK Cup 2012 Wild-card Round 1"
rating: 1800
weight: 162
solve_time_s: 69
verified: true
draft: false
---

[CF 162E - HQ9+](https://codeforces.com/problemset/problem/162/E)

 **评分：** 1800
 **标签：** *特别
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 问题询问用笑话语言 HQ9+ 编写的程序是否会产生任何输出。 该程序是一个包含 1 到 100 个可打印 ASCII 字符的字符串。 只有四个指令很重要：“H”、“Q”、“9”和“+”。 “+”指令操作内部累加器，但不产生任何输出，因此在解决此问题时可以忽略它。 所有其他字符，包括小写字母和标点符号，也将被忽略。 任务是检测程序是否至少包含“H”、“Q”或“9”之一，在这种情况下运行程序将产生输出。 

限制很小，最大输入长度为 100 个字符。 这意味着我们可以对字符串进行简单的线性扫描，并且无需进行超出 O(n) 的优化。 非明显的边缘情况包括仅包含忽略字符的字符串或大小写混合的字符串。 例如，一个程序`"hello"`仅包含小写字母，这些字母被忽略，因此正确的输出是“NO”。 反过来，`"H"`produces output, so the answer is "YES". 粗心的方法可能会检查是否出现“h”而不是“H”，从而给出错误的答案。 

## 方法

 暴力方法很简单：迭代字符串的每个字符并检查它是否匹配“H”、“Q”或“9”。 If any match is found, immediately output "YES"; otherwise, output "NO" at the end. 这是可行的，因为该问题只需要检测产生输出的单个指令，并且可以独立检查每个字符。 考虑到最大长度为 100，该方法最多需要 100 次比较，这在计算成本方面可以忽略不计。 

在这种情况下，最佳方法实际上与暴力方法相同。 关键的见解是认识到我们根本不需要模拟程序或处理累加器。 该问题简化为一组三个字符的成员资格测试。 使用集合进行比较使代码简洁明了，并且一次通过字符串就保证了正确性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) | O(1) | O(1) | 已接受 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取代表 HQ9+ 程序的输入字符串。 
2. Initialize a set containing the characters`'H'`,`'Q'`， 和`'9'`。 该集合代表产生输出的指令。 
3. 迭代输入字符串中的每个字符。 对于每个字符，检查它是否是输出生成指令集的成员。 
4. 如果在集合中找到任何字符，则立即打印“YES”并终止算法。 这确保我们不会浪费时间不必要地扫描字符串的其余部分。 
5. 如果循环完成后没有在集合中找到任何字符，则打印“NO”。 此时，我们知道该程序不会产生任何输出。 

为什么它有效：不变的是程序产生输出当且仅当它至少包含“H”、“Q”或“9”之一。 通过扫描一次字符串并检查集合中的成员资格，我们保证将检测到任何产生输出的指令，并且我们永远不会对被忽略的字符产生误报。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

program = input().strip()
output_instructions = {'H', 'Q', '9'}

for char in program:
    if char in output_instructions:
        print("YES")
        break
else:
    print("NO")
```该解决方案从标准输入读取程序并删除尾随换行符`strip()`。 套装`output_instructions`允许对每个角色进行恒定时间的成员资格检查。 这`for-else`结构确保仅当循环完成但未找到匹配项时才打印“NO”。 使用一组而不是多个`or`条件使代码可扩展且易于阅读。 

## 工作示例

 样本1：

 输入：`"Hello!"`| 步骤| 字符| 集合中的字符？ | 行动|
 | ---| ---| ---| ---|
 | 1 | 'H'| 是的 | 打印是，停止 |
 | 2 | 'e' | - | - |

 该算法立即检测到“H”并输出“YES”。 不检查后续字符，表明提前终止。 

样本2：

 输入：`"hello"`| 步骤| 字符| 集合中的字符？ | 行动|
 | ---| ---| ---| ---|
 | 1 | 'h'| 没有 | 继续 |
 | 2 | 'e' | 没有 | 继续 |
 | 3 | 'l'| 没有 | 继续 |
 | 4 | 'l'| 没有 | 继续 |
 | 5 | 'o'| 没有 | 继续 |

 没有字符与“H”、“Q”或“9”匹配，因此循环完成并且算法打印“NO”。 这证实了小写字母被忽略。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | We scan each character once and perform a constant-time set membership check. |
 | 空间| O(1) | O(1) | 该指令集具有三个元素的固定大小，与输入大小无关。 |

 Given that n ≤ 100, the solution performs at most 100 operations and uses minimal memory, well within the limits.

 ## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as io_module
    out = io_module.StringIO()
    with redirect_stdout(out):
        program = input().strip()
        output_instructions = {'H', 'Q', '9'}
        for char in program:
            if char in output_instructions:
                print("YES")
                break
        else:
            print("NO")
    return out.getvalue().strip()

# provided samples
assert run("Hello!\n") == "YES", "sample 1"
assert run("hello\n") == "NO", "sample 2"

# custom cases
assert run("H\n") == "YES", "single instruction H"
assert run("+++\n") == "NO", "only non-output instructions"
assert run("9abc\n") == "YES", "9 instruction at start"
assert run("abcdQ\n") == "YES", "Q instruction at end"
assert run("!@#$\n") == "NO", "symbols only, no instructions"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | “H”| 是 | 单输出指令|
 | “+++” | 否 | 仅累加器增量不产生输出 |
 | “9abc”| 是 | 字符串开头的输出指令 |
 | “abcdQ”| 是 | 字符串末尾的输出指令 |
 | “！@#$” | 否 | 正确忽略非指令符号 |

 ## 边缘情况

 A string containing only lowercase letters or symbols such as`"hello!"`正确地产生“NO”。 该算法单独检查每个字符，并且仅对大写“H”、“Q”或数字“9”触发“YES”。 像这样的程序`"H9+Q"`遇到“H”时立即产生“YES”，表明提前终止有效。 A single-character program`"+"`产生“NO”，因为“+”不生成输出。 这些边缘情况的处理证实了该解决方案的稳健性并符合问题要求。
