---
title: "CF 45A - Codecraft III"
description: "我们以字符串形式给出当前月份和表示多少个月后将发布新游戏的整数 k。 任务是确定日历中向前恰好 k 个月后的月份。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 45
codeforces_index: "A"
codeforces_contest_name: "School Team Contest 3 (Winter Computer School 2010/11)"
rating: 900
weight: 45
solve_time_s: 74
verified: true
draft: false
---
[CF 45A - Codecraft III](https://codeforces.com/problemset/problem/45/A)

 **评分：** 900
 **标签：** 实施
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们以字符串和整数的形式给出当前月份`k`代表几个月后将发布新游戏。 任务是准确确定推进后的月份`k`日历中向前几个月。 

日历是循环的。 十二月过后又是一月。 因此，问题实际上是在 12 个月名称的固定循环序列中前进。 

限制非常小。 的价值`k`最多100个，只有12个月。 任何合理的实施都会立即运行。 即使是一次前进一个月的模拟也最多执行 100 次操作，这对于 2 秒的时间限制来说是微不足道的。 

主要困难不是性能，而是正确处理日历的循环性质。 

一个常见的错误是忘记在 12 月之后结束。 考虑这个输入：```
December
1
```正确的输出是：```
January
```如果不小心实现，只是简单地移动到下一个索引而不进行模块化运算，就会出界。 

另一个微妙的情况出现时`k = 0`。 例如：```
March
0
```正确的输出是：```
March
```如果有人在处理之前总是至少前进一次`k`，他们会错误地打印 April。 

当发生第三种边缘情况时`k`大于12。例如：```
January
25
```正确的输出是：```
February
```由于日历每 12 个月重复一次，因此前进 25 个月相当于前进 1 个月。 重复前进而不按模减少的实现在这里仍然有效，因为约束很小，但直接索引解决方案必须正确应用模。 

## 方法

 最直接的解决办法就是模拟时间逐月流逝。 我们将所有月份名称按顺序存储在数组中，找到当前月份，然后继续前进`k`次。 每当我们超过十二月时，我们就会回到一月。 

这种强力方法是正确的，因为每个操作都准确地反映了日历的工作方式。 从当前月份开始，反复移动到下个月，最终得出正确答案。 

运行时间是`O(k)`。 和`k ≤ 100`，这是完全可以接受的。 最坏的情况下，我们只执行 100 次转换。 

改进解决方案的观察结果是日历每 12 个月重复一次。 前进 12 个月将返回同一个月。 由于这种周期性结构，我们根本不需要模拟。 

如果当前月份有索引`i`，那么答案很简单：```
(i + k) % 12
```这将问题转换为循环数组索引。 模运算会自动处理从 12 月回绕到 1 月的情况。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k) | O(1) | O(1) | 已接受 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将所有十二个月按日历顺序存储在数组中。 
2.读取当前月份和整数`k`。 
3. 在数组中查找当前月份的索引。 

该索引以数字形式表示月份`0`到`11`。 
4. 使用以下方法计算目标索引`(current_index + k) % 12`。 

当我们过去 12 月时，模运算正确地包裹了位置。 
5. 输出存储在计算索引处的月份。 

### 为什么它有效

 月份形成一个长度为 12 的循环。前进一个月相当于在数组中前进一步。 前进通过`k`月份对应于搬家`k`向前迈出一步。 

模运算保留循环结构中的正确位置。 任何超出索引 11 的运动都会像日历一样返回到开头。 因为这，`(current_index + k) % 12`始终与正确的未来月份匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# solution

months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
]

current = input().strip()
k = int(input())

current_index = months.index(current)
answer_index = (current_index + k) % 12

print(months[answer_index])
```数组`months`明确定义日历顺序。 这为我们提供了月份名称和索引之间的直接映射。 

致电给`months.index(current)`找到起始位置。 由于只有 12 个条目，因此该查找实际上是恒定时间。 

表达式`(current_index + k) % 12`是实施的关键部分。 没有`% 12`，大于 11 的索引将无效。 模数将大索引转换回有效范围，同时保留正确的循环位置。 

使用`input().strip()`很重要，因为月份名称来自标准输入，并且可能包含尾随换行符。 如果不去除空格，查找就会失败。 

## 工作示例

 ### 示例 1

 输入：```
November
3
```| 步骤| 价值|
 | --- | --- |
 | 当前月份 | 十一月 |
 | 当前指数| 10 | 10
 | k | 3 |
 | 计算索引 | (10 + 3) % 12 = 1 |
 | 回答 | 二月|

 该迹线清楚地显示了环绕行为。 11 月后的三个月移动经过 12 月并返回到数组的开头。 

### 示例 2

 输入：```
January
25
```| 步骤| 价值|
 | --- | --- |
 | 当前月份 | 一月 |
 | 当前指数| 0 |
 | k | 25 | 25
 | 计算索引 | (0 + 25) % 12 = 1 |
 | 回答 | 二月|

 此示例表明模运算可以正确处理大于 12 的值。前进 25 个月相当于前进 1 个月。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 数组大小固定为12，因此所有操作都是常数时间 |
 | 空间| O(1) | O(1) | 仅存储固定大小的月份名称数组 |

 该解决方案很容易满足限制。 该程序仅执行少量算术运算并存储恒定量的数据。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ]

    current = input().strip()
    k = int(input())

    current_index = months.index(current)
    answer_index = (current_index + k) % 12

    print(months[answer_index])

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output.strip()

# provided sample
assert run("November\n3\n") == "February", "sample 1"

# custom cases
assert run("March\n0\n") == "March", "k = 0"
assert run("December\n1\n") == "January", "year wrap"
assert run("January\n12\n") == "January", "full cycle"
assert run("January\n25\n") == "February", "large k with modulo"
assert run("August\n100\n") == "December", "maximum-style large movement"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`March 0`|`March`| 没有动静|
 |`December 1`|`January`| 12 月后的总结 |
 |`January 12`|`January`| 全日历周期|
 |`January 25`|`February`| 正确的模行为 |
 |`August 100`|`December`| 大运动值 |

 ## 边缘情况

 考虑输入：```
December
1
```该算法发现`December`在索引处`11`。 然后它计算：```
(11 + 1) % 12 = 0
```指数`0`对应于`January`，它与正确的日历转换相匹配。 

现在考虑：```
March
0
```的索引为`March`是`2`。 计算变为：```
(2 + 0) % 12 = 2
```结果保持不变`March`。 该算法正确处理没有经过几个月的情况。 

最后，考虑：```
January
25
```的索引为`January`是`0`。 计算变为：```
(0 + 25) % 12 = 1
```指数`1`对应于`February`。 由于日历每 12 个月重复一次，前进 25 个月相当于前进 1 个月，算法通过模运算自动捕获这一点。
