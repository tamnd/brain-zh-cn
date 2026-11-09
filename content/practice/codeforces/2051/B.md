---
title: "CF 2051B - 旅程"
description: "Monocarp 正在进行多天的徒步旅行，并且每天都有重复的距离模式：他第一天步行 1 公里，第二天步行 2 公里，第三天步行 3 公里，然后无限期地重复这个循环。"
date: "2026-06-08T08:39:49+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "math"]
categories: ["algorithms"]
codeforces_contest: 2051
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 995 (Div. 3)"
rating: 800
weight: 2051
solve_time_s: 91
verified: true
draft: false
---

[CF 2051B - 旅程](https://codeforces.com/problemset/problem/2051/B)

 **评分：** 800
 **标签：** 二分查找，数学
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Monocarp 正在进行多天的徒步旅行，并且每天都有重复的距离模式：他步行`a`第一天的公里数，`b`第二个，`c`第三个，然后无限期地重复这个循环。 给定目标总距离`n`，我们被要求确定 Monocarp 达到或超过的确切日期`n`累计公里数。 每个测试用例给出四个整数：目标距离`n`以及三天周期的距离`a`,`b`,`c`。 输出只是 Monocarp 完成旅程的天数。 

该约束允许最多 10,000 个测试用例，每个测试用例都包含`n`最多 10 亿次，每日距离最多 100 万次。 这意味着每天一一模拟的简单方法可能会对单个测试用例执行多达 10 亿次操作，这太慢了。 任何方法都必须考虑重复模式和非常大的潜力`n`无需逐一迭代每一天。 

当旅程在第一个周期内完成时，特别是在第一天本身，就会出现边缘情况。 例如，如果`n = 6`和第一天的距离`a = 6`，Monocarp 立即完成。 另一个边缘情况是当`n`非常大，在最后的部分循环有助于达到之前强制许多完整的循环`n`。 粗心的实现可能会尝试逐日迭代，并在部分周期结束时超时或错误地处理逐一计数。 

## 方法

 暴力解决方案将逐日模拟旅程，保持运行总距离，并在总距离达到或超过时停止`n`。 虽然这是正确的，但最坏的情况发生在`n = 10^9`并且每天的距离很小（例如，`a = b = c = 1`）。 该算法大约需要 10 亿次迭代，这在 1 秒内是不可能的。 

关键的观察结果是这些距离以三天为一个周期重复。 一个完整周期的总和是`cycle_sum = a + b + c`。 如果我们可以计算出需要多少个完整的周期才能达到`n`，我们可以以三天的倍数跳跃，而不是逐日迭代。 完成完整周期后，我们最多只需要再检查三天即可达到`n`。 这将问题从潜在的数十亿次迭代减少到每个测试用例最多几个简单的算术运算。 

蛮力方法在概念上很简单，但速度很慢，而优化方法则利用序列的周期性来显着减少计算量。 我们可以将简单的数学与最后部分循环的条件检查结合起来。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n) | O(1) | O(1) | 对于大 n 来说太慢 |
 | 循环跳跃| 每个测试用例 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取输入值`n`,`a`,`b`,`c`对于单个测试用例。 这些代表目标距离和三天步行距离。 
2. 计算一个完整的三天周期的总和：`cycle_sum = a + b + c`。 这代表 Monocarp 在三天内行走的总距离。 
3. 计算在超过之前可以容纳的完整三天周期的数量`n`：`full_cycles = (n - 1) // cycle_sum`。 这`-1`如果确切的总数落在周期边界上，则确保我们正确地计算最后一天。 乘`full_cycles`乘 3 得到`days = full_cycles * 3`。 这是所有完整周期后的天数。 
4. 计算完整循环后的累积距离：`distance_so_far = full_cycles * cycle_sum`。 
5. 在周期的接下来几天（最多三天：`a`,`b`,`c`)，将每天的距离添加到`distance_so_far`。 每次添加后，检查是否`distance_so_far >= n`。 满足这个条件的第一天就是答案。 增量`days`每增加一天。 
6. 输出`days`当 Monocarp 至少达到的那一天`n`公里。 

为什么有效：通过利用步行距离的周期性，我们可以跳过整个三天的周期，而无需单独进行逐日模拟。 部分周期很小，只有三天，因此迭代可以忽略不计。 不变量是在考虑完整周期后，`distance_so_far`总是小于`n`，以及下一个部分周期中将总数推高的第一天`n`保证是正确的完成日期。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, a, b, c = map(int, input().split())
    cycle_sum = a + b + c
    
    # number of full cycles
    full_cycles = (n - 1) // cycle_sum
    days = full_cycles * 3
    distance_so_far = full_cycles * cycle_sum
    
    for d in [a, b, c]:
        if distance_so_far >= n:
            break
        distance_so_far += d
        days += 1
    
    print(days)
```代码首先读取测试用例的数量。 对于每个测试用例，它计算三天周期的总和以及要跳跃的完整周期数。 然后，它会添加下一个部分周期的天数，并在每次添加后检查总距离是否达到`n`。 迭代结束`[a, b, c]`确保我们永远不会超过三项额外检查。 

## 工作示例

 **示例1：**`n = 12, a = 1, b = 5, c = 3`| 步骤| 天| 距离_so_far | 行动|
 | --- | --- | --- | --- |
 | 完整周期 | 1*3=3 | 1*3=3 9 | 9 公里完整循环 1 次后 |
 | 第 4 天 | 4 | 9+1=10 | 9+1=10 检查距离 < n |
 | 第 5 天 | 5 | 10+5=15 | 10+5=15 距离 >= n → 停止 |

 该算法返回 5，与预期结果匹配。 

**示例2：**`n = 6, a = 6, b = 7, c = 4`| 步骤| 天| 距离_so_far | 行动|
 | --- | --- | --- | --- |
 | 完整周期 | 0 | 0 | (n-1)//cycle_sum = 0 |
 | 第一天 | 1 | 0+6=6 | 距离 >= n → 停止 |

 该算法返回 1，对于单日完成情况是正确的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(1) | 仅算术和最多三天的额外检查 |
 | 空间| O(1) | O(1) | 没有额外的结构，只有整数 |

 由于测试用例多达 10,000 个，总操作量仍然非常小，完全在 1 秒的限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n, a, b, c = map(int, input().split())
        cycle_sum = a + b + c
        full_cycles = (n - 1) // cycle_sum
        days = full_cycles * 3
        distance_so_far = full_cycles * cycle_sum
        for d in [a, b, c]:
            if distance_so_far >= n:
                break
            distance_so_far += d
            days += 1
        output.append(str(days))
    return "\n".join(output)

# Provided samples
assert run("4\n12 1 5 3\n6 6 7 4\n16 3 4 1\n1000000000 1 1 1\n") == "5\n1\n6\n1000000000", "sample tests"

# Custom tests
assert run("1\n1 1 1 1\n") == "1", "minimum n"
assert run("1\n3 1 1 1\n") == "3", "exact 1 cycle"
assert run("1\n10 2 2 2\n") == "5", "partial cycle after full cycles"
assert run("1\n7 3 2 2\n") == "3", "finishes within first cycle"
assert run("1\n1000000 1000000 1000000 1000000\n") == "1", "large single step"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 1 1 | 1 1 1 1 1 | 第一天最少完成 n 项 |
 | 3 1 1 1 | 3 1 1 1 3 | 第一个周期结束时准确完成 |
 | 10 2 2 2 | 10 2 2 2 5 | 完整循环后的部分循环 |
 | 7 3 2 2 | 7 3 2 2 3 | 在第一个周期内完成 |
 | 1000000 1000000 1000000 1000000 | 1 | 大值即刻完结|

 ## 边缘情况

 当`n`比第一天要小，比如`n=1`和`a=1, b=1, c=1`,`full_cycles = 0`，以及第一次迭代`[a, b, c]`立即满足 `distance_so_far
