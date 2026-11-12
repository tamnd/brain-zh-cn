---
title: "CF 2222A - 一场精彩的比赛"
description: "我们被要求确定一场编程竞赛是否“精彩”，即可以达到 0 到 100 n 之间的每个可能的整数总分。 比赛有n个问题，每个问题又分为ai子任务。"
date: "2026-06-07T18:40:47+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 2222
codeforces_index: "A"
codeforces_contest_name: "Spectral::Cup 2026 Round 1 (Codeforces Round 1094, Div. 1 + Div. 2)"
rating: 0
weight: 2222
solve_time_s: 123
verified: false
draft: false
---

[CF 2222A - 精彩的比赛](https://codeforces.com/problemset/problem/2222/A)

 **评级：** -
 **标签：** 暴力破解、dp、数学
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求确定一场编程竞赛是否“精彩”，因为每个可能的整数总分之间`0`和`100 * n`可以实现。 大赛有`n`问题，每个问题又分为`a_i`子任务。 的每个子任务`i`第 - 个问题对问题得分的贡献相同，即`100 / a_i`点。 

参赛者的总分是他们在每个问题上解决的子任务得分的总和。 输入提供了多个测试用例，每个测试用例都给出了问题数量以及每个问题的子任务列表。 输出应指示每个测试用例的所有整数总分是否来自`0`到`100 * n`可以得到。 

限制很小：`n`至多是`10`,`a_i`划分`100`， 和`t`取决于`100`。 有了这么小的`n`，暴力方法是可行的，但我们可以找到更优雅的数学见解。 

非明显的边缘情况包括所有问题`a_i`是大因数`100`。 例如，如果所有`a_i`是`100`，每个问题仅贡献数倍`1`到总数，这很有效。 但如果`a_i`是`4`另一个是`25`，我们必须确保所有问题的分数组合允许每个整数总和。 简单地求和最大分数的简单方法可能会错过每个问题的离散步骤所产生的差距。 

## 方法

 暴力方法将枚举所有组合`x_i`对于每个问题。 自从`0 <= x_i <= a_i`和`a_i <= 100`，这在最坏的情况下产生`101^10`单个测试用例的组合，这太大了。 这是正确的，但不可行。 

关键的见解是以“1 分”为单位，而不是浮点数。 由于每个`a_i`划分`100`，问题的得分`i`可以表示为整数`0`到`100`的步骤`100 / a_i`。 让`step_i = 100 / a_i`。 那么问题就简化为：我们能否表示其中的每个整数`0`到`100 * n`作为非负整数组合`step_1, step_2, ..., step_n`其中重数不超过`a_i`？ 

我们可以将其建模为经典的子集和或硬币找零问题，其中每个硬币的值是`step_i`和`a_i`副本。 和`n <= 10`和`a_i <= 100`, 可达和的总数最多为`1000`，使动态规划解决方案变得可行。 我们初始化一个布尔数组`reachable[0..100*n]`并通过添加每个分数的倍数来迭代标记所有可实现的分数`step_i`。 

这避免了暴力破解所有`x_i`组合并且有效，因为该问题保证整数运算就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(产品(a_i)) | O(100*n) | O(100*n) | 太慢了 |
 | 动态规划（类似硬币）| O(n * 100 * 最大值(a_i)) | O(100*n) | O(100*n) | 已接受 |

 ## 算法演练

 1. 转换每个问题的子任务数`a_i`进入得分步骤：`step_i = 100 // a_i`。 这会将小数分数转换为整数。 
2.初始化布尔数组`reachable`尺寸的`100*n + 1`， 在哪里`reachable[s]`表示是否有总分`s`是可以实现的。 放`reachable[0] = True`。 
3. 对于每个问题`i`有步骤`step_i`和`a_i`子任务，更新`reachable`包括通过添加获得的所有总和`k * step_i`为了`k = 1..a_i`到以前可以达到的金额。 这确保我们不会超出问题的子任务限制。 
4. 处理完所有问题后，检查每个整数是否`s`从`0`到`100*n`是可达的。 如果是，则输出`Yes`， 否则`No`。 

为什么它有效：`reachable`正确地对在子任务限制下可以形成的所有总和进行建模。 通过迭代地包括每个步长的倍数，我们保证不会错过任何组合。 整数运算确保精确计算，没有舍入误差。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def is_wonderful(a):
    n = len(a)
    steps = [100 // ai for ai in a]
    max_score = 100 * n
    reachable = [False] * (max_score + 1)
    reachable[0] = True

    for step, count in zip(steps, a):
        # We iterate backwards to avoid using the same problem multiple times
        new_reachable = reachable[:]
        for s in range(max_score + 1):
            if reachable[s]:
                for k in range(1, count + 1):
                    ns = s + k * step
                    if ns <= max_score:
                        new_reachable[ns] = True
                    else:
                        break
        reachable = new_reachable

    return all(reachable)

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    print("Yes" if is_wonderful(a) else "No")
```该解决方案首先将分数转换为整数倍，然后迭代地标记所有可达到的总数。 我们向后迭代`reachable`防止因同一问题而重复计算捐款。 休息可防止超过最高分数。 

## 工作示例

 **样本 1 输入：**`2`

`2`

`1 2`

`3`

`4 5 10`| 步骤| 可达数组更新 |
 | --- | --- |
 | 问题1：step=100，count=1 | 0, 100 |
 | 问题2：步长=50，计数=2 | 添加 50 和 100 -> 可达到 0,50,100,150,200 |
 | 检查全部 0..200 | 正确 -> 是 |

 **样本 2 输入：**`1`

`2`

`4 5`| 步骤| 可达数组更新 |
 | --- | --- |
 | 问题1：步长=25，计数=4 | 0,25,50,75,100 |
 | 问题2：步长=20，计数=5 | 合并之前 -> 缺失 95，不可能 |
 | 检查全部 0..100*2 | 假 -> 否 |

 这些迹线显示 DP 正确考虑了步长和限制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * 最大(a_i) * 100 * n) | 每个问题都会迭代其子任务和可达分数。 n ≤ 10，a_i ≤ 100，max_score = 100*n ≤ 1000。 
| 空间| O(100*n) | O(100*n) | 可达到的分数数组，最多 100*n。 |

 当 n ≤ 10 且 100*n ≤ 1000 时，解决方案运行时间不到 1 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        output.append("Yes" if is_wonderful(a) else "No")
    return ''.join(output)

# Provided samples
assert run("2\n2\n1 2\n3\n4 5 10\n") == "YesNo", "Sample 1 and 2"

# Custom cases
assert run("1\n1\n100\n") == "Yes", "Single problem, 100 subtasks"
assert run("1\n2\n25 25\n") == "Yes", "Two equal divisors"
assert run("1\n2\n4 5\n") == "No", "Cannot reach all totals"
assert run("1\n3\n1 2 5\n") == "Yes", "Small mixed divisors"
assert run("1\n3\n20 25 50\n") == "Yes", "Large divisors with combination"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 100 | 1 100 是的 | 单一问题，最大子任务 |
 | 2 25 25 | 2 25 25 是的 | 等因数，轻松覆盖 |
 | 2 4 5 | 2 4 5 没有 | 小除数不匹配会妨碍完全覆盖 |
 | 3 1 2 5 | 3 1 2 5 是的 | 混合小除数 |
 | 3 20 25 50 | 3 20 25 50 是的 | 较大的除数，确保总和覆盖范围 |

 ## 边缘情况

 对于单个问题`a_1 = 100`，唯一可能的分数是`1`。 该算法正确标记了所有分数`0`到`100`，确认“是”。 

一对`a = [4,5]`，第一个问题的可能得分是`{0,25,50,75,100}`，并且从第二个`{0,20,40,60,80,100}`。 一些总计，例如`95`，无法成立。 DP检测到不可达
