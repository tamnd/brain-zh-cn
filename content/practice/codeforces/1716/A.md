---
title: "CF 1716A - 2-3 步"
description: "我们站在数轴上的位置 0，我们想要到达目标坐标 n。 一分钟内，我们可以向任一方向移动 2 或 3 个单位。 任务是计算精确达到 n 所需的最小分钟数。"
date: "2026-06-09T19:51:20+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1716
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 133 (Rated for Div. 2)"
rating: 800
weight: 1716
solve_time_s: 130
verified: true
draft: false
---

[CF 1716A - 2-3 步](https://codeforces.com/problemset/problem/1716/A)

 **评分：** 800
 **标签：** 贪心，数学
 **求解时间：** 2m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们站在数轴上的位置 0，我们想要到达目标坐标`n`。 一分钟内，我们可以向任一方向移动 2 或 3 个单位。 任务是计算到达所需的最小分钟数`n`确切地。 输入包括`t`测试用例，每个给出一个整数`n`。 对于每个`n`，我们必须打印所需的最少步数。 

关键的限制是`n`可以大到$10^9$最多有$10^4$测试用例。 这排除了任何迭代位置或明确尝试每个移动序列的解决方案，因为这太慢了。 相反，我们需要一种在每个测试用例的恒定或对数时间内工作的方法。 

一个微妙的边缘情况是`n`很小，特别是`1`。 由于我们只能以 2 或 3 的增量移动，因此一次移动无法达到 1。 那么，最小移动次数为 2：要么向前 2 次，后退 1 次，要么向前 3 次，后退 2 次，结果恰好是 1。同样，所有不能被 2 或 3 整除的数字都必须小心处理。 一个天真的`n // 3`或者`n // 2`对于这些小偏移量，计算将会失败。 

## 方法

 蛮力方法是模拟每一个动作组合，直到我们达到`n`。 这是通过尝试所有 2 和 3 序列直到总和等于`n`。 这是正确的，因为最终，通过添加 2 和 3 的某种组合，可以得到任何整数。 然而，其复杂性是指数级的。 如果`n`是$10^9$，这将花费太长时间。 

关键的见解来自模运算。 Every number can be expressed as a combination of 2s and 3s because the greatest common divisor of 2 and 3 is 1. That guarantees reachability. To minimize the number of moves, we prefer the largest possible move, 3, first, and then fill the remainder with 2s.

 具体来说，对于给定的`n`，我们可以估计`n // 3`移动 3 步。如果余数为 0，我们就完成了。 如果余数为1，我们需要用两个2替换一个3，这样总步数就增加1。如果余数为2，我们只需再添加一个2步即可。 该逻辑适用于所有正整数，无论​​大小，并且每个测试用例以恒定的时间运行。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 最佳 | 每个测试用例 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取整数`n`。 目标是计算达到目标的最小移动次数`n`从 0 开始，使用大小为 2 或 3 的移动。 
2. 计算`q`作为`n // 3`和`r`作为`n % 3`。 这里`q`表示 3 单位移动的最大数量，并且`r`是我们还需要走的剩余距离。 
3.如果`r`是0，答案很简单`q`因为 3 单元精确地移动覆盖物`n`。 
4.如果`r`为 1，我们无法用单个 2 单位移动来覆盖它，因此我们减少 1 个 3 单位移动以创造空间，然后使用两个 2 单位移动来覆盖剩余距离。 This increases the move count by 1.
 5. 如果`r`是 2，我们可以用一个额外的 2 单位移动来覆盖它，所以总移动是`q + 1`。 

工作原理：每个整数都可以使用 2 和 3 的某种组合来访问。 通过首先最大化 3 个单位的移动，我们最小化总移动数。 根据剩余距离进行调整可确保以最佳方式覆盖剩余距离。 该公式保证我们永远不会低估移动次数，因为任何剩余的都可以通过添加 2 或用两个 2 替换 3 来纠正。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    q, r = divmod(n, 3)
    if r == 0:
        print(q)
    elif r == 1:
        if q >= 1:
            print(q + 1)  # replace one 3 with two 2s
        else:
            print(2)      # n=1 or n=1 scenario
    else:  # r == 2
        print(q + 1)
```这`divmod`功能分割`n`有效地转化为商和余数。 我们检查剩余部分并相应调整动作。 一个微妙之处就是处理很小`n`值（如 1），其中没有足够的 3 单位移动可交换，因此我们在这种情况下手动返回 2 个移动。 

## 工作示例

 ### 示例 1：n = 1

 | n | 问 | r | 计算移动 |
 | --- | --- | --- | --- |
 | 1 | 0 | 1 | 2 |

 解释：我们无法通过一次移动达到 1，因此我们需要两次移动：+2 然后 -1。 该算法通过以下方式处理这个问题`q < 1`分支。 

### 示例 2：n = 12

 | n | 问 | r | 计算移动 |
 | --- | --- | --- | --- |
 | 12 | 12 4 | 0 | 4 |

 解释：12可以用4个大小为3的棋子覆盖。没有余数，所以不需要额外的调整。 

### 示例 3：n = 4

 | n | 问 | r | 计算移动 |
 | --- | --- | --- | --- |
 | 4 | 1 | 1 | 2 |

 说明： 3 步的一步涵盖 3 个单位。 余数1的处理方法是用两个2替换3。 总步数：2。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(1) | 所有运算都是算术和条件运算。 |
 | 空间| O(1) | O(1) | 仅存储几个整数。 |

 给予$10^4$测试用例，这运行在$10^4$最多操作一次，完全在1秒的时间限制之内。 内存使用量极小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    t = int(input())
    for _ in range(t):
        n = int(input())
        q, r = divmod(n, 3)
        if r == 0:
            print(q)
        elif r == 1:
            if q >= 1:
                print(q + 1)
            else:
                print(2)
        else:
            print(q + 1)
    
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided samples
assert run("4\n1\n3\n4\n12\n") == "2\n1\n2\n4", "Sample 1"

# Custom cases
assert run("3\n2\n5\n7\n") == "1\n2\n3", "Small numbers"
assert run("2\n10\n1000000000\n") == "4\n333333334", "Large numbers"
assert run("1\n1\n") == "2", "Minimum input"
assert run("1\n2\n") == "1", "Minimum 2 reachable in one move"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 5 7 | 2 5 7 1 2 3 | 1 2 3 带余数的小数|
 | 10 1000000000 | 4 333333334 | 非常大数的正确性 |
 | 1 | 2 | 最小输入边缘情况 |
 | 2 | 1 | 一步可达到的最小输入 |

 ## 边缘情况

 对于`n = 1`，算法选择 2 步，正确处理单步不可能达到 1 的情况。 为了`n = 2`，它直接返回 1，表明小数字正确映射到最小移动。 为了`n = 4`，它用两个 2 单位移动替换单个 3 单位移动，从而产生最小移动计数。 这`divmod`余数调整方法保证了所有边缘情况的正确性$10^9$。 

这篇社论提出了一种具体、快速且可靠的方法来计算任何正整数的最小移动次数`n`仅使用算术，避免任何暴力搜索。
