---
title: "CF 168A - 向导和演示"
description: "该城市有 n 个真正的居民。 其中，正好x个是巫师，所有这些巫师都会参加演示。 其他人不会参加。 政府以实际城市人口的百分比来衡量出勤率，即使巫师们创造了克隆人，这个比例仍然保持不变。"
date: "2026-06-02T08:31:30+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 168
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 114 (Div. 2)"
rating: 900
weight: 168
solve_time_s: 121
verified: true
draft: false
---

[CF 168A - 向导和演示](https://codeforces.com/problemset/problem/168/A)

 **评分：** 900
 **标签：** 实现、数学
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该市有`n`真正的居民。 其中，正是`x`是巫师，所有这些巫师都会参加演示。 其他人不会参加。 

政府将出勤率衡量为实际城市人口的百分比，该百分比仍然`n`即使巫师创造了克隆体。 克隆算作与会者，但不会增加百分比计算中使用的人口规模。 

我们必须找到最少数量的克隆，使得总出席人数为`x + clones`，至少是`y%`的`n`。 

限制很小。 每个值最多是`10^4`，因此即使是简单的模拟也能在时间限制内顺利运行。 尽管如此，这个问题仍然有一个直接的数学解决方案，可以在恒定时间内计算出答案。 

主要的微妙之处在于出席人数是整数。 如果所需的百分比对应于非整数的与会者人数，我们必须四舍五入。 

考虑`n = 10`,`x = 1`,`y = 14`。 

十个人中有百分之十四是`1.4`。 由于出勤率必须是整数，因此至少`2`需要参加者。 一名巫师已经参加，因此需要一名克隆人。 

一个常见的错误是计算`(n * y) // 100`，向下舍入。 这里给出了`1`，错误地建议不需要克隆。 

当现有向导已经满足要求时，会出现另一种边缘情况。 

例如：```
10 10 100
```所需出席人数为`10`，所有十位巫师都已参加。 正确答案是`0`。 总是计算的粗心实现`required - x`在其他情况下，如果不取最大值为零可能会产生否定答案。 

该语句还允许大于 100 的百分比。 

例如：```
10 10 150
```所需出席人数为`15`，尽管这座城市只有 10 名居民。 由于允许克隆，所以答案是`5`。 任何假设百分比永远不会超过 100 的解决方案都会失败。 

## 方法

 一种简单的方法是尝试从零开始克隆计数。 对于每个候选值`c`，检查是否`x + c`参加者人数至少足以达到`y%`的城市人口。 第一个有效`c`就是答案。 

这是有效的，因为克隆计数是按递增顺序检查的，因此第一个成功的值是最小的。 在给定的约束下，答案永远不会超过粗略的`10^4`，甚至使这种暴力模拟也足够快。 

问题变得更简单的原因是，要求可以直接表示为最低出席人数。 

我们需要：$$x + c \ge \frac{n \cdot y}{100}$$由于出勤率必须是整数，因此真正的要求是：$$x + c \ge \left\lceil \frac{n \cdot y}{100} \right\rceil$$让$$required = \left\lceil \frac{n \cdot y}{100} \right\rceil$$那么最小克隆数就是：$$required - x$$除非该值为负数，在这种情况下答案为零。 

唯一剩下的任务是计算整数除法的上限。 标准公式是：$$\left\lceil \frac{a}{b} \right\rceil = \frac{a+b-1}{b}$$使用整数除法。 

所以：```
required = (n * y + 99) // 100
answer = max(0, required - x)
```| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O（答案）| O(1) | O(1) | 已接受 |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读`n`,`x`， 和`y`。 
2. 计算满足百分比要求所需的最低出席人数：$$required = \left\lceil \frac{n \cdot y}{100} \right\rceil$$由于所有值都是整数，因此使用：```
required = (n * y + 99) // 100
```3. 计算除现有参与者之外还需要多少额外参与者`x`巫师：```
required - x
```4. 如果该值为负，则不需要克隆。 返回：```
max(0, required - x)
```### 为什么它有效

 政府只关心相对于固定人口规模的最终与会者人数`n`。 最小有效出席人数正是上限`n * y / 100`，因为出勤率必须是整数。 

任何出席人数小于`required`不符合百分比条件，而任何出勤率至少`required`成功了。 自从`x`巫师们已经参加了，克隆体的最小数量恰好是之间的差距`required`和`x`，当不存在赤字时使用零。 这直接产生唯一的最小答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, x, y = map(int, input().split())

required = (n * y + 99) // 100
print(max(0, required - x))
```第一行读取三个输入值。 

关键计算是：```
required = (n * y + 99) // 100
```这将执行上限除以 100。例如，如果`n * y = 140`， 然后：```
(140 + 99) // 100 = 239 // 100 = 2
```哪个正确计算`ceil(1.4)`。 

最终的答案是：```
max(0, required - x)
```这可以处理这两种情况。 如果需要更多参与者，则差值给出所需的克隆数量。 如果现有向导已经满足目标，则结果变为负值并被零替换。 

不存在溢出问题，因为`n * y ≤ 10^8`，这可以通过 Python 整数轻松处理。 

## 工作示例

 ### 示例 1

 输入：```
10 1 14
```| 变量| 价值|
 | --- | --- |
 | n | 10 | 10
 | x| 1 |
 | y | 14 | 14
 | n × y | 140 | 140
 | 必填| (140 + 99) // 100 = 2 |
 | 必填 - x | 1 |
 | 答案| 1 |

 所需出席人数为 2 人，因为 10 的 14% 等于 1.4，并且必须四舍五入。 一名巫师已经参加，因此需要一名克隆人。 

### 示例 2

 输入：```
10 10 100
```| 变量| 价值|
 | --- | --- |
 | n | 10 | 10
 | x| 10 | 10
 | y | 100 | 100
 | n × y | 1000 | 1000
 | 必填| (1000 + 99) // 100 = 10 |
 | 必填 - x | 0 |
 | 答案| 0 |

 所有十名巫师都已出席，完全符合出席要求。 不需要克隆。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅执行少量算术运算 |
 | 空间| O(1) | O(1) | 没有使用额外的数据结构 |

 无论输入值如何，该算法都使用恒定时间和恒定内存。 这远远低于限制，并且很容易符合允许的资源。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    n, x, y = map(int, input().split())
    required = (n * y + 99) // 100
    print(max(0, required - x))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    global input
    input = sys.stdin.readline

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("10 1 14\n") == "1\n", "sample 1"

# equivalent to the statement's second example
assert run("10 10 100\n") == "0\n", "sample 2"

# minimum-size input
assert run("1 1 1\n") == "0\n", "minimum values"

# off-by-one ceiling case
assert run("10 1 11\n") == "1\n", "11% of 10 requires 2 attendees"

# percentage above 100
assert run("10 10 150\n") == "5\n", "clones beyond population"

# maximum values
assert run("10000 10000 10000\n") == "990000\n", "largest inputs"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1`|`0`| 最小的合法投入|
 |`10 1 11`|`1`| 正确的天花板倒角 |
 |`10 10 150`|`5`| 百分比大于 100 |
 |`10000 10000 10000`|`990000`| 最大的值和大的答案 |

 ## 边缘情况

 考虑：```
10 1 14
```该算法计算：```
required = (10 * 14 + 99) // 100
         = 239 // 100
         = 2
```答案变成：```
max(0, 2 - 1) = 1
```这可以正确处理非整数百分比。 楼层划分方法错误地只需要一名与会者。 

现在考虑：```
10 10 100
```我们得到：```
required = 10
answer = max(0, 10 - 10) = 0
```现有向导已满足要求，因此不会创建克隆。 

最后，考虑：```
10 10 150
```计算得出：```
required = (1500 + 99) // 100
         = 15
answer = max(0, 15 - 10)
         = 5
```该算法并不假设该百分比最多为 100。它正确地确定需要另外 5 个克隆才能达到 15 名参加者。
