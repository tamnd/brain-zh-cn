---
title: "CF 195C - 尝试并捕捉"
description: "我们得到了一种小型语言的源代码，它只包含三种语句：try、catch(type, message) 和一个 throw(type)。 每个 try 都与后面的 catch 配对，形成一个 try-catch 块。"
date: "2026-06-05T00:36:58+07:00"
tags: ["codeforces", "competitive-programming", "expression-parsing", "implementation"]
categories: ["algorithms"]
codeforces_contest: 195
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 123 (Div. 2)"
rating: 1800
weight: 195
solve_time_s: 143
verified: true
draft: false
---

[CF 195C - 尝试并捕捉](https://codeforces.com/problemset/problem/195/C)

 **评分：** 1800
 **标签：** 表达式解析、实现
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一种微型语言的源代码，它只包含三种语句：`try`,`catch(type, message)`，并且恰好有一个`throw(type)`。 

每个`try`与稍后配对`catch`，形成一个 try-catch 块。 输入在语法上保证是正确的，因此这些块被正确嵌套。 

当抛出异常时，我们必须确定哪个 catch 块处理它。 如果满足三个条件，则 catch 块可以处理异常：

 1.其对应的`try`出现在之前`throw`。 
2.它的`catch`出现在`throw`。 
3. 其异常类型与抛出的类型匹配。 

在所有这些块中，该语言选择一个其`catch`语句最早出现在抛出之后。 我们必须打印该 catch 块的消息。 如果没有块匹配，我们打印：```
Unhandled Exception
```该程序最多包含$10^5$线。 这立即排除了任何重复扫描程序大部分内容的解决方案。 二次算法大约需要$10^{10}$最坏情况下的操作，远远超出了极限。 我们需要一个线性或近线性的解决方案。 

解析本身也是挑战的一部分。 行可以在关键字、括号、逗号和引号周围包含任意空格。 依赖精确格式的解决方案将会失败。 

一个微妙的点是，所选的处理程序不一定是最里面的周围`try`。 语言选择匹配的块，其`catch`首先发生在抛出之后。 

考虑：```
try
    try
        throw(AE)
    catch(BE,"x")
catch(AE,"y")
```内部块包围抛出，但其异常类型不匹配。 正确的输出是：```
y
```另一个容易犯的错误是只在到达投掷点时仍然“打开”的块中进行搜索。 语言的定义取决于相对位置`try`,`throw`， 和`catch`，而不是模拟执行。 

例如：```
try
    throw(AE)
catch(AE,"first")
try
catch(AE,"second")
```正确的输出是：```
first
```因为选择了 throw 后的第一个匹配的 catch。 

当没有处理程序匹配时，会出现第三种边缘情况：```
try
    throw(AE)
catch(BE,"wrong")
```输出必须是：```
Unhandled Exception
```即使 throw 位于 try-catch 块内。 

## 方法

 暴力解决方案将首先重建所有 try-catch 块。 然后，在找到 throw 后，它可以检查每个块并检查是否：

 - 该块的`try`在投掷之前，
 - 该块的`catch`是在投掷之后，
 - 异常类型匹配。 

在所有的排位赛区块中，我们会选择接球位置最小的一个。 

这种方法是正确的，因为它直接实现了规范。 如果有$m$块，工作是$O(m)$，这已经可以接受了。 真正的困难是在解析时有效地重建块。 

不太仔细的实现可能会重复搜索匹配的捕获或重复遍历嵌套结构，从而导致$O(n^2)$深度嵌套输入的行为。 

关键的观察结果是程序结构是完美嵌套的。 每一个`catch`关闭最近的未匹配的`try`。 这正是堆栈的行为。 

当扫描一次程序时，我们可以推送每个程序的行号`try`。 当一个`catch`出现后，它会关闭最上面的`try`，使我们能够立即构建一个完整的块。 

收集所有块并定位单次抛出后，确定答案就变成了对块的简单线性扫描。 

整个解决方案以线性时间运行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 反复搜索的暴力破解 | O(n²) | O(n) | 太慢了 |
 | 基于堆栈的解析+一次扫描| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有程序行。 
2. 对于每一行，删除前导和尾随空格。 
3. 检测该行包含哪个语句。 
4. 当`try`找到后，将其行索引压入堆栈。 

最新的未匹配`try`一定是下一个关闭的。 
5. 当`catch(type,message)`找到后，出栈。 

弹出的位置就是匹配的`try`对于这个捕获。 存储包含以下内容的记录：

 - 尝试位置
 - 捕捉位置
 - 异常类型
 - 消息
 6. 当`throw(type)`找到，存储：

 - 投掷位置
 - 抛出的异常类型
 7. 解析整个程序后，检查每个记录的块。 
8. 如果满足以下条件，块可以处理异常：

 -`try_position < throw_position`-`catch_position > throw_position`-`block_type == thrown_type`9. 在所有匹配块中，选择捕获位置最小的一个。 
10. 打印其消息。 
11. 如果没有块符合条件，则打印：```
Unhandled Exception
```### 为什么它有效

 堆栈重建是正确的，因为该语句保证每个`catch`关闭最近打开的不匹配的`try`。 这正是标准的括号匹配属性。 

因此，每个记录块都包含正确的位置对。 一个区块在其符合条件时才符合资格`try`在投掷之前及其`catch`位于 throw 之后，与语言定义匹配。 在符合条件的块中，选择最小的catch位置实现了抛出后最早的catch被激活的规则。 由于每个可能的块都被检查一次，因此算法不会错过正确的处理程序。 

## Python 解决方案```python
import sys
import re

input = sys.stdin.readline

def solve():
    n = int(input())

    stack = []
    blocks = []

    throw_pos = -1
    throw_type = ""

    catch_re = re.compile(
        r'catch\s*\(\s*([A-Za-z]+)\s*,\s*"([^"]+)"\s*\)'
    )
    throw_re = re.compile(
        r'throw\s*\(\s*([A-Za-z]+)\s*\)'
    )

    for i in range(n):
        line = input().strip()

        if not line:
            continue

        if line.startswith("try"):
            stack.append(i)

        elif line.startswith("throw"):
            m = throw_re.match(line)
            throw_type = m.group(1)
            throw_pos = i

        elif line.startswith("catch"):
            m = catch_re.match(line)
            exc_type = m.group(1)
            message = m.group(2)

            try_pos = stack.pop()
            blocks.append((try_pos, i, exc_type, message))

    answer = None
    best_catch_pos = n + 1

    for try_pos, catch_pos, exc_type, message in blocks:
        if (
            try_pos < throw_pos < catch_pos
            and exc_type == throw_type
        ):
            if catch_pos < best_catch_pos:
                best_catch_pos = catch_pos
                answer = message

    if answer is None:
        print("Unhandled Exception")
    else:
        print(answer)

solve()
```代码的第一部分在重建 try-catch 块的同时解析程序。 堆栈存储无与伦比`try`职位。 每当一个`catch`出现时，栈顶是唯一有效的匹配`try`，所以我们立即创建一个完整的块记录。 

正则表达式处理任意间距。 这避免了由输入引起的许多解析错误，例如：```
catch ( AE , "msg" )
```或者```
throw( AE )
```第二阶段根据抛出的异常评估每个块。 条件```
try_pos < throw_pos < catch_pos
```完全符合语句的要求，即抛出位于块内。 

最终的决胜局使用最小的 catch 位置，因为该语言选择在 throw 之后首先出现的匹配 catch。 

## 工作示例

 ### 示例 1

 输入：```
try
    try
        throw(AE)
    catch(BE,"BE in line 3")

    try
    catch(AE,"AE in line 5")
catch(AE,"AE somewhere")
```| 活动 | 事件后堆栈 | 记录块|
 | --- | --- | --- |
 | 尝试 0 | [0]| - |
 | 尝试 1 | [0,1]| - |
 | 投掷 (AE) 为 2 | [0,1]| - |
 | 在 3 处捕获 (BE) | [0]| (1,3,BE) |
 | 尝试 5 | [0,5]| 上一页 |
 | 在 6 处捕获 (AE) | [0]| (5,6,AE) |
 | 在 7 处捕获 (AE) | []| (0,7,AE) |

 检查块：

 | 块| 包含投掷？ | 类型匹配？ | 有资格的？ |
 | --- | --- | --- | --- |
 | (1,3,BE) | 是的 | 没有 | 没有 |
 | (5,6,AE) | 没有 | 是的 | 没有 |
 | (0,7,AE) | 是的 | 是的 | 是的 |

 选定的消息是：```
AE somewhere
```此示例表明匹配类型是不够的。 throw 也必须位于相应的 try 和 catch 之间。 

### 示例 2```
try
    try
        throw(AE)
    catch(AE,"inner")
catch(AE,"outer")
```| 块| 尝试位置 | 接球位置| 类型 |
 | --- | --- | --- | --- |
 | 内| 1 | 3 | AE |
 | 外 | 0 | 4 | AE |

 两个块都包含 throw 并且两种类型都匹配。 

| 块| 接球位置|
 | --- | --- |
 | 内| 3 |
 | 外 | 4 |

 最早捕获的是位置 3，所以答案是：```
inner
```这演示了打破平局的规则。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 一次解析，一次块传递 |
 | 空间| O(n) | 堆栈和存储的块信息|

 至多有$10^5$线，线性处理很容易足够快。 内存使用量也是线性的并且完全符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
import re

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())

    stack = []
    blocks = []

    throw_pos = -1
    throw_type = ""

    catch_re = re.compile(
        r'catch\s*\(\s*([A-Za-z]+)\s*,\s*"([^"]+)"\s*\)'
    )
    throw_re = re.compile(
        r'throw\s*\(\s*([A-Za-z]+)\s*\)'
    )

    for i in range(n):
        line = input().strip()

        if not line:
            continue

        if line.startswith("try"):
            stack.append(i)

        elif line.startswith("throw"):
            m = throw_re.match(line)
            throw_type = m.group(1)
            throw_pos = i

        elif line.startswith("catch"):
            m = catch_re.match(line)
            exc_type = m.group(1)
            message = m.group(2)

            blocks.append((stack.pop(), i, exc_type, message))

    ans = None
    best = n + 1

    for l, r, typ, msg in blocks:
        if l < throw_pos < r and typ == throw_type:
            if r < best:
                best = r
                ans = msg

    return (ans if ans is not None else "Unhandled Exception") + "\n"

# provided sample
assert run(
"""8
try
    try
        throw ( AE )
    catch ( BE, "BE in line 3" )

    try
    catch(AE, "AE in line 5")
catch(AE,"AE somewhere")
"""
) == "AE somewhere\n"

# minimum size
assert run(
"""3
try
throw(AE)
catch(AE,"ok")
"""
) == "ok\n"

# no matching handler
assert run(
"""3
try
throw(AE)
catch(BE,"x")
"""
) == "Unhandled Exception\n"

# earliest catch wins
assert run(
"""5
try
try
throw(AE)
catch(AE,"inner")
catch(AE,"outer")
"""
) == "inner\n"

# spaces everywhere
assert run(
"""3
try
 throw (  ABC  )
 catch ( ABC , "works" )
"""
) == "works\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 抛出单次 try-catch |`ok`| 最小有效实例 |
 | | 异常类型不匹配`Unhandled Exception`| 未找到处理程序 |
 | 嵌套匹配处理程序 |`inner`| 最早的渔获选择|
 | 大量空白变化 |`works`| 强大的解析 |
 | 官方样品|`AE somewhere`| 规格齐全|

 ## 边缘情况

 ### 匹配外块，不匹配内块

 输入：```
3
try
throw(AE)
catch(BE,"x")
```唯一的块包含 throw，但其类型是`BE`而抛出的类型是`AE`。 

该算法记录一个块：

 | 尝试| 抓住| 类型 |
 | --- | --- | --- |
 | 0 | 2 | 是 |

 类型比较失败，因此没有选择候选者，输出变为：```
Unhandled Exception
```### 多个匹配的处理程序

 输入：```
5
try
try
throw(AE)
catch(AE,"inner")
catch(AE,"outer")
```记录的块：

 | 尝试| 抓住| 类型 |
 | --- | --- | --- |
 | 1 | 3 | AE |
 | 0 | 4 | AE |

 两者都包含 throw 并且都匹配类型。 算法选择较小的捕获位置，即`3`，生产：```
inner
```### 处理程序在 throw 之后，但 try 在 throw 之后开始

 输入：```
5
throw(AE)
try
catch(AE,"later")
try
catch(AE,"another")
```两个块都不满足：```
try_position < throw_position
```所以两者都无法处理异常。 

该算法拒绝块和打印：```
Unhandled Exception
```与语言定义相匹配。
