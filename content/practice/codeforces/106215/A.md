---
title: "CF 106215A - 不幸的巧合"
description: "我们有 n 个单词。 对于每个单词，我们必须检查它是否恰好是字符串“WY”。 如果某个单词恰好是“WY”，我们会在输出中将其替换为“Whitney Young”。 其他所有单词必须按原样打印。 输入由一个整数 n 和后面的 n 个字符串组成。"
date: "2026-06-25T06:50:05+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106215
codeforces_index: "A"
codeforces_contest_name: "2025-2026 Whitney Young Practice Contest 1"
rating: 0
weight: 106215
solve_time_s: 40
verified: true
draft: false
---

[CF 106215A - 一个不幸的巧合](https://codeforces.com/problemset/problem/106215/A)

 **评级：** -
 **标签：** -
 **求解时间：** 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被给予`n`字。 对于每个单词，我们必须检查它是否正是字符串`"WY"`。 

如果一个词恰好是`"WY"`，我们将其替换为`"Whitney Young"`在输出中。 其他所有单词必须按原样打印。 

输入由一个整数组成`n`， 其次是`n`字符串。 每个字符串仅包含大写和小写英文字母。 输出完全包含`n`行，每个输入单词一个结果。 

限制非常小。 最多有 2025 个单词，每个单词的长度最多为 67。即使是检查每个单词的每个字符的最直接的解决方案也只执行几十万次操作。 任何线性扫描都很容易足够快。 

错误的主要原因是误解了什么才算匹配。 

考虑输入：```
3
WY
wy
WYOMING
```正确的输出是：```
Whitney Young
wy
WYOMING
```仅替换第一个单词。 比较区分大小写，因此`"wy"`不匹配。 还，`"WYOMING"`包含`"WY"`作为前缀，但整个单词不等于`"WY"`。 

另一个容易犯的错误是尝试子字符串替换。 例如：```
2
AWYB
WY
```正确的输出是：```
AWYB
Whitney Young
```只有完整单词的平等才重要。 

## 方法

 最直接的解决办法就是逐个处理单词。 

对于每个单词，将其与`"WY"`。 

如果相等，则打印`"Whitney Young"`。 否则，打印原始单词。 

强力解释可能会手动检查每个字符。 由于每个单词最多 67 个字符长，因此仍然可以在限制内轻松运行。 总工作量与输入字符总数成正比。 

关键的观察结果是该任务并不要求在字符串内进行模式匹配。 它只询问一个单词是否完全等于一个特定值。 现代语言已经提供了字符串相等操作，使得解决方案变得几乎微不足道。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解逐个字符比较 | O(总输入长度) | O(1) | O(1) | 已接受 |
 | 直接字符串相等性检查 | O(总输入长度) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取整数`n`。 
2. 重复`n`次数：

 读下一个单词。 
3.如果这个词恰好是`"WY"`， 打印`"Whitney Young"`。 
4. 否则，原样打印该单词。 

### 为什么它有效

 对于每个输入单词，该问题精确定义了一个触发替换的条件：该单词必须等于`"WY"`。 

该算法精确地检查该条件。 当条件为真时，它输出所需的替换文本。 当条件为假时，它输出原始单词。 由于每个单词都是根据问题定义独立处理的，因此生成的输出始终是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

for _ in range(n):
    s = input().strip()
    if s == "WY":
        print("Whitney Young")
    else:
        print(s)
```程序首先读取单词数。 

随后的每一行都会被读取并删除其尾随换行符。 比较`s == "WY"`执行精确、区分大小写的相等检查。 

当比较成功时，将打印所需的替换文本。 否则，原始单词将按原样打印。 

使用`strip()`很重要，因为输入行包含尾随换行符。 在不删除它的情况下，与`"WY"`会失败的。 

不需要额外的数据结构，因为每个字在读取后可以立即处理。 

## 工作示例

 ### 示例 1

 输入：```
9
I
miss
WY
Math
Team
and
WY
Coding
Club
```追踪：

 | 词| 等于“WY”？ | 输出|
 | --- | --- | --- |
 | 我| 没有 | 我|
 | 小姐| 没有 | 小姐|
 | 怀俄明 | 是的 | 惠特尼·杨 |
 | 数学 | 没有 | 数学 |
 | 团队| 没有 | 团队|
 | 和| 没有 | 和 |
 | 怀俄明 | 是的 | 惠特尼·杨 |
 | 编码 | 没有 | 编码 |
 | 俱乐部| 没有 | 俱乐部|

 输出：```
I
miss
Whitney Young
Math
Team
and
Whitney Young
Coding
Club
```这个例子表明，每次出现确切的单词`"WY"`被独立替换。 

### 示例 2

 输入：```
4
WY
wy
WYOMING
WY
```追踪：

 | 词| 等于“WY”？ | 输出|
 | --- | --- | --- |
 | 怀俄明 | 是的 | 惠特尼·杨 |
 | 怀 | 没有 | 怀 |
 | 怀俄明州 | 没有 | 怀俄明州 |
 | 怀俄明 | 是的 | 惠特尼·杨 |

 输出：```
Whitney Young
wy
WYOMING
Whitney Young
```这证明了区分大小写和整个单词必须匹配的要求。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(总输入长度) | 每个单词读一次并比较一次 |
 | 空间| O(1) | O(1) | 一次仅存储一个单词 |

 总输入大小很小，因此该解决方案可以在限制内轻松运行。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    n = int(input())
    for _ in range(n):
        s = input().strip()
        if s == "WY":
            print("Whitney Young")
        else:
            print(s)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run(
"""9
I
miss
WY
Math
Team
and
WY
Coding
Club
"""
) == (
"""I
miss
Whitney Young
Math
Team
and
Whitney Young
Coding
Club
"""
)

# minimum size
assert run(
"""1
WY
"""
) == (
"""Whitney Young
"""
)

# no replacements
assert run(
"""3
abc
DEF
Wy
"""
) == (
"""abc
DEF
Wy
"""
)

# all replacements
assert run(
"""4
WY
WY
WY
WY
"""
) == (
"""Whitney Young
Whitney Young
Whitney Young
Whitney Young
"""
)

# substring but not exact match
assert run(
"""3
AWYB
WYOMING
WY
"""
) == (
"""AWYB
WYOMING
Whitney Young
"""
)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单字`WY`|`Whitney Young`| 最小输入尺寸|
 | 没有一个词等于`WY`| 原话| 无意外更换|
 | 所有词都平等`WY`| 全部更换| 重复更换|
 |`AWYB`,`WYOMING`,`WY`| 仅最后更换 | 完全相等，而不是子串匹配 |

 ## 边缘情况

 考虑：```
1
wy
```算法比较`"wy"`和`"WY"`。 由于字符串比较区分大小写，因此它们是不同的。 输出仍然是：```
wy
```这可以正确处理大小写差异。 

考虑：```
1
WYOMING
```该算法检查整个字符串是否等于`"WY"`。 事实并非如此，所以输出是：```
WYOMING
```这避免了替换仅包含的单词的常见错误`"WY"`作为子串。 

考虑：```
3
WY
WY
WY
```每个单词都是独立处理的。 每次比较都会成功，产生：```
Whitney Young
Whitney Young
Whitney Young
```该算法在第一次替换后不会停止，并且可以正确处理多次出现的情况。
