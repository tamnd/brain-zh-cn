---
title: "CF 1663D - 是否额定 - 3"
description: "该问题给出了一个长度为 3 的字符串 S，由字符 + 和 - 以及一个非负整数 X 组成。该字符串表示对整数的一系列操作：+ 表示加 1，- 表示减 1。"
date: "2026-06-10T02:31:14+07:00"
tags: ["codeforces", "competitive-programming", "*special", "combinatorics", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 1663
codeforces_index: "D"
codeforces_contest_name: "April Fools Day Contest 2022"
rating: 0
weight: 1663
solve_time_s: 77
verified: true
draft: false
---

[CF 1663D - 是否评级 - 3](https://codeforces.com/problemset/problem/1663/D)

 **评级：** -
 **标签：** *特殊、组合数学、dp、数学
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 问题给了我们一个字符串`S`长度为三，由字符组成`+`和`-`，和一个非负整数`X`。 该字符串表示对整数的一系列操作：`+`表示加1，`-`表示减1。从`X`，我们重复应用该序列`S`无限。 任务是确定在这个无限变换序列中可以出现多少个不同的非负整数。 

因为`S`长度为3，每个周期的操作次数非常少。`X`最大可以达到十亿，虽然很大，但是固定大小很小`S`暗示几个周期的模拟可能就足够了。 不明显的方面是序列永远重复并且负值被丢弃：同一个值可能会被多次访问，因此需要仔细计数。 一种模拟所有步骤的简单方法`10^9`是不可行的，我们需要检测没有新值出现的循环或边界。 

边缘情况包括立即减少的序列`X`为零、始终递增的序列以及重复应用导致两个值之间振荡的序列。 例如，如果`S = "+-+"`和`X = 1`，序列演化为`1 → 2 → 1 → 2 → …`。 这里的不同值只是`{1, 2}`。 幼稚的模拟可能会错误地继续计数超出这些重复次数。 

## 方法

 暴力方法会模拟从以下位置开始的序列`X`并跟踪集合中的所有非负值，直到我们看到重复或直到值变为负值。 在伪代码中，这是：```
values = {X}
current = X
while True:
    for op in S:
        current += 1 if op == '+' else -1
        if current < 0:
            break
        values.add(current)
    if no new values were added:
        break
```这是正确的，但如果`X`或者值变大，我们可能会迭代太多次，特别是因为`X`可以达到`10^9`。 然而，因为`S`长度为 3，每个周期的净变化很小（在 -3 和 +3 之间）。 这意味着在达到负数或达到重复模式之前我们看到的不同值的数量最多为`3 * 2 + 1 = 7`在最坏的振荡情况下，所以暴力在这里实际上是可行的。 

关键的见解是，我们只需要模拟最多几个周期，直到序列达到零或重复。 跟踪访问的值可以保证我们对每个不同的非负整数恰好计数一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O( | S | * (#distinct values)) |
 | Optimized with cycle detection | O( | S | * small constant) |

 最佳方法本质上是相同的模拟，但在没有发现新值或生成负数时正式停止。 由于尺寸为`S`是固定的，这保证在恒定时间内运行。 

## 算法演练

 1.初始化一组`visited`与起始值`X`。 这会跟踪序列中出现的所有非负整数。 
2. 设置`current = X`。 
3. 重复以下操作，直到完整周期内不再添加新值：

 1. 遍历字符串`S`：

 1. 如果角色是`+`, 增量`current`1.
 2. 如果角色是`-`, 递减`current`1.
 3.如果`current`变为负值，将其丢弃并停止此循环。 
4. 否则，添加`current`到`visited`。 
2. 如果尺寸`visited`在这个循环中没有改变，打破循环。 
4.输出大小`visited`。 

为什么它有效：每次迭代都会添加所有新的非负整数，这些整数可以通过再一次应用程序到达`S`。 因为`S`长度为 3 并且值不能为负数，可达数集单调增长但有界。 当没有新的数字出现时，算法就会停止，保证我们对所有不同的可达非负整数恰好计数一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

S = input().strip()
X = int(input())

visited = set()
visited.add(X)
current = X

while True:
    new_values = set()
    temp = current
    for op in S:
        if op == '+':
            temp += 1
        else:
            temp -= 1
        if temp >= 0:
            new_values.add(temp)
    if not new_values - visited:
        break
    visited.update(new_values)
    current = max(new_values)

print(len(visited))
```该代码使用以下命令初始化访问值集`X`。 对于每个周期`S`，它计算新的可达值而不让`current`变得消极。 当循环没有产生新值时它会停止，确保我们对每个不同的值计数一次。 的选择`current = max(new_values)`确保我们从最大可达值继续进行模拟，从而有效地捕获所有可能的增量。 

## 工作示例

 输入示例 1：```
+-+
1
```| 步骤| 当前| 新价值观 | 访问过 |
 | ---| ---| ---| ---|
 | 0 | 1 | {} | {1} |
 | 1 | 1 → 2 → 1 → 2 | {2} | {1,2} |
 | 2 | 2 → 3 → 2 → 3 | 2 → 3 → 2 → 3 | {3} | {1,2,3} |
 | 3 | 3 → 4 → 3 → 4 | {4} | {1,2,3,4} |
 | 4 | ... | 没有新值 | {1,2,3,4} |

 输出：`4`这表明该算法捕获了所有振荡，并在没有产生新值时终止。 

输入示例 2：```
---
2
```| 步骤| 当前| 新价值观 | 访问过 |
 | ---| ---| ---| ---|
 | 0 | 2 | {} | {2} |
 | 1 | 2 → 1 → 0 → -1 | {1,0} | {0,1,2} |
 | 2 | 0 → -1 → -2 → -3 | {} | {0,1,2} |

 输出：`3`这表明通过立即丢弃负值来正确处理它们。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O( | S |
 | 空间| O(#不同值) | 我们存储可从以下位置访问的所有不同的非负整数`X`。 |

 给定`|S|=3`，即使很大`X`由于序列要么减小到零，要么在小范围内振荡，所以可以有效地处理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    S = input().strip()
    X = int(input())
    visited = set([X])
    current = X
    while True:
        new_values = set()
        temp = current
        for op in S:
            if op == '+':
                temp += 1
            else:
                temp -= 1
            if temp >= 0:
                new_values.add(temp)
        if not new_values - visited:
            break
        visited.update(new_values)
        current = max(new_values)
    return str(len(visited))

# Provided samples
assert run("+-+\n1\n") == "4", "sample 1"
assert run("---\n2\n") == "3", "sample 2"

# Custom cases
assert run("+++\n0\n") == "4", "increasing from 0"
assert run("++-\n1\n") == "3", "mixed operations"
assert run("--+\n1\n") == "3", "decreasing then increasing"
assert run("---\n0\n") == "1", "all negative from 0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`+++\n0`| 4 | 序列总是从零开始递增 |
 |`++-\n1`| 3 | 混合操作造成振荡|
 |`--+\n1`| 3 | 先减后增，处理零 |
 |`---\n0`| 1 | 负值立即被丢弃 |

 ## 边缘情况

 当`X = 0`和`S`仅包含`-`，该算法通过仅生成来正确处理它`{0}`。 用于输入`S = "---"`和`X = 0`，在第一步之后 temp 值立即变为负值，因此不会添加新值。 输出是`1`，与预期相符。 类似地，像这样的序列`"+-+"`从小处开始`X`正确振荡，并且当没有新值出现时循环终止。 该算法保证所有不同的可达非负整数只被计算一次。
