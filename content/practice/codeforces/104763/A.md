---
title: "CF 104763A - 水母艺术"
description: "输入是单个整数 N，它确定水母文本绘图的大小。 该图有两个不同的部分。 正文占据前 N 行。 每个正文行恰好包含 2N - 1 个连续的“J”字符。"
date: "2026-06-28T21:49:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104763
codeforces_index: "A"
codeforces_contest_name: "UTPC Contest 11-03-23 Div. 2 (Beginner)"
rating: 0
weight: 104763
solve_time_s: 135
verified: true
draft: false
---

[CF 104763A - 水母艺术](https://codeforces.com/problemset/problem/104763/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入是单个整数`N`，它决定了水母文本绘图的大小。 

该图有两个不同的部分。 身体占据第一位`N`行。 每个正文行都包含准确的`2N - 1`连续的`'J'`人物。 身体下面有触手，也占据着`N`行。 每排触手恰好包含`N` `'S'`字符由单个空格分隔，因此该行具有以下形式`"S S S ... S"`。 

限制非常小。 即使在最大值`N = 100`，输出仅包含`2N = 200`行，每行最多`199`字符长。 打印的字符总数仅为两万左右，因此所需字符串的任何直接构造都可以轻松满足时间和内存限制。 

主要困难是完全按照指定格式化输出。 车身宽度必须是`2N - 1`， 不是`2N`，并且触手必须仅在相邻的触手之间包含空间`'S'`角色，永远不会在最后一个角色之后。 

一个容易出现的错误出现在以下情况：`N = 1`。 

输入：```
1
```正确的输出是```
J
S
```一种粗心的实现，总是在触手之间插入空格，而不考虑只有一个触手可能会意外打印`"S "`带有尾随空格。 

另一个常见的格式错误是错误地计算正文宽度。 

输入：```
2
```正确的输出是```
JJJ
JJJ
S S
S S
```印刷`2N = 4` `'J'`字符而不是`2N - 1 = 3`产生不正确的身体。 

最后一个格式化陷阱是在最后一个触手后面留下一个尾部空格。 

输入：```
3
```正确的触手排是```
S S S
```印刷```
S S S
```看起来与人类读者相似，但与所需的输出不完全匹配。 

## 方法

 最直接的方法是准确地构造每个输出行，并打印它。 对于正文，我们创建一个字符串，其中包含`2N - 1` `'J'`字符并打印它`N`次。 对于触手，我们通过连接创建一根绳子`N`的副本`"S"`用单个空格并打印出来`N`次。 

由于问题本身只要求我们生成图片，所以这种直接构造已经是最优的了。 即使在最坏的情况下，我们也只能生成大约两万个字符，这对于现代硬件来说是微不足道的。 

没有隐藏的优化或高级算法。 关键的观察是身体的每一排都是相同的，触手的每一排都是相同的。 我们可以构造每个不同的行一次并重用它，而不是逐个字符地重复重建相同的字符串。 这使实现变得简单，同时避免了不必要的工作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N²) | O(1) | O(1) | 已接受 |
 | 最佳 | O(N²) | O(N) | 已接受 |

 复杂性取决于必须打印的字符数，因此没有算法可以渐近地做得比输出大小更好。 

## 算法演练

 1.读取整数`N`。 
2. 将正文行构造为`'J' * (2 * N - 1)`。 这将为每个主体行精确地生成所需的宽度。 
3. 准确打印正文行`N`次。 由于每个正文行都是相同的，因此重复使用相同的字符串就足够了。 
4. 使用构建触手行`' '.join(['S'] * N)`。 连接空格会自动在相邻触手之间放置一个空格，并避免尾随空格。 
5. 准确打印触手行`N`次。 每排触手的外观都相同，因此可以重复使用同一条绳子。 

### 为什么它有效

 所需的图片由两个矩形部分组成。 每个正文行必须相同，包含完全相同的内容`2N - 1`连续的`'J'`人物。 每个触手行也必须相同，包含`N` `'S'`由单个空格分隔的字符。 该算法为每个部分构建一个正确的代表，并将每个代表打印所需的次数。 由于每个生成的行都与规范完全匹配，因此完整的绘图是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

body = "J" * (2 * n - 1)
tentacles = " ".join(["S"] * n)

for _ in range(n):
    print(body)

for _ in range(n):
    print(tentacles)
```程序首先读取单个输入值。 

第一个构造的字符串是正文行。 将字符串乘以`2 * n - 1`产生精确的所需宽度。 计算一次可以避免重复重建同一行。 

触手行是用以下命令创建的`" ".join(["S"] * n)`。 这比手动附加空格更安全，因为`join`保证相邻的之间恰好有一个空格`'S'`字符且行尾没有尾随空格。 

这两个环直接对应于绘图的两个部分。 第一个循环打印身体行，第二个循环打印触手行。 由于问题仅包含一个测试用例，因此不需要额外的外循环。 

## 工作示例

 ### 示例 1

 输入：```
3
```| 步骤|`N`| 构造行| 产出 |
 | --- | --- | --- | --- |
 | 读取输入| 3 | - | - |
 | 塑造身材| 3 |`JJJJJ`| - |
 | 打印正文 | 3 |`JJJJJ`| 3 身体排 |
 | 构建触角| 3 |`S S S`| - |
 | 打印触角| 3 |`S S S`| 3 排触手 |

 车身宽度为`2 × 3 - 1 = 5`，生产`JJJJJ`。 触手排包含三个`'S'`由单个空格分隔的字符。 每个打印行都符合所需的格式。 

### 示例 2

 输入：```
6
```| 步骤|`N`| 构造行| 产出 |
 | --- | --- | --- | --- |
 | 读取输入| 6 | - | - |
 | 塑造身材| 6 |`JJJJJJJJJJJ`| - |
 | 打印正文 | 6 |`JJJJJJJJJJJ`| 6 排车身 |
 | 构建触角| 6 |`S S S S S S`| - |
 | 打印触角| 6 |`S S S S S S`| 6 排触手 |

 此示例确认可以重用相同的预先计算的字符串，无论其值如何`N`。 车身宽度变为`11`，每个触手行包含六个具有正确间距的触手。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N²) | 打印每个字符占据了运行时间。 |
 | 空间| O(N) | 两个输出字符串的长度成正比`N`被存储。 |

 自从`N`至多是`100`，总输出尺寸非常小。 该算法很容易满足一秒的时间限制和可用内存。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    body = "J" * (2 * n - 1)
    tentacles = " ".join(["S"] * n)

    for _ in range(n):
        print(body)
    for _ in range(n):
        print(tentacles)

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

# provided samples
assert run("3\n") == (
    "JJJJJ\n"
    "JJJJJ\n"
    "JJJJJ\n"
    "S S S\n"
    "S S S\n"
    "S S S\n"
), "sample 1"

assert run("6\n") == (
    "JJJJJJJJJJJ\n"
    "JJJJJJJJJJJ\n"
    "JJJJJJJJJJJ\n"
    "JJJJJJJJJJJ\n"
    "JJJJJJJJJJJ\n"
    "JJJJJJJJJJJ\n"
    "S S S S S S\n"
    "S S S S S S\n"
    "S S S S S S\n"
    "S S S S S S\n"
    "S S S S S S\n"
    "S S S S S S\n"
), "sample 2"

# custom cases
assert run("1\n") == (
    "J\n"
    "S\n"
), "minimum size"

assert run("2\n") == (
    "JJJ\n"
    "JJJ\n"
    "S S\n"
    "S S\n"
), "small even size"

out = run("100\n")
lines = out.strip().split("\n")
assert len(lines) == 200, "correct number of rows"
assert all(line == "J" * 199 for line in lines[:100]), "body width"
assert all(line == " ".join(["S"] * 100) for line in lines[100:]), "tentacles"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1`| 一`J`行和一`S`行| 最小输入尺寸|
 |`2`| 车身宽度`3`和两排触手| 正确计算`2N - 1`|
 |`100`| 200 行格式正确 | 最大约束和输出大小 |
 |`3`|`S S S`没有尾随空格 | 触手之间的正确间距 |

 ## 边缘情况

 当`N = 1`，该算法将正文行计算为`"J" * 1`，产生一个单一的`'J'`。 触手行是通过连接一个元素列表来创建的，这自然会产生`"S"`没有额外的空格。 

输入：```
1
```执行构建`body = "J"`和`tentacles = "S"`，然后分别打印一次。 

输出：```
J
S
```什么时候`N = 2`，体宽计算变为`2 × 2 - 1 = 3`。 算法构造`"JJJ"`而不是`"JJJJ"`，避免了最常见的一错再错。 

输入：```
2
```执行构建`body = "JJJ"`和`tentacles = "S S"`。 

输出：```
JJJ
JJJ
S S
S S
```为了`N = 3`，触手行是使用生成的`join`，因此空间仅出现在相邻触手之间。 

输入：```
3
```该算法计算`tentacles = "S S S"`并打印三遍。 不添加尾随空格，与所需的输出完全匹配。
