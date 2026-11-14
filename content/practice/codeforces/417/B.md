---
title: "CF 417B - 崩溃"
description: "我们收到了一份编程竞赛参与者提交的作品列表。 每个提交都由两个数字描述：x，它计算该参与者在此之前已经提交的唯一解决方案的数量；k，参与者的 ID。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 417
codeforces_index: "B"
codeforces_contest_name: "RCC 2014 Warmup (Div. 2)"
rating: 1400
weight: 417
solve_time_s: 89
verified: true
draft: false
---

[CF 417B - 崩溃](https://codeforces.com/problemset/problem/417/B)

 **评分：** 1400
 **标签：** 实施
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收到了一份编程竞赛参与者提交的作品列表。 每次提交都由两个数字描述：_x_，用于计算该参与者在此之前已提交的唯一解决方案的数量；_k_，即参与者的 ID。 同一参与者的提交内容必须按时间顺序出现：如果提交内容显示 _x = 2_，则列表中较早某处一定有同一参与者之前提交的且 _x = 1_ 的提交内容。 任务是验证恢复的列表是否遵循每个参与者的时间顺序。 

限制表明最多可以有 100,000 个提交，每个参与者 ID 和解决方案编号也最多可以达到 100,000 个。 这意味着扫描每个新提交的所有先前提交的二次算法会太慢。 我们需要一个与提交数量线性或接近线性扩展的解决方案。 边缘情况包括多个参与者交错提交、_x_ 值存在差距的参与者以及单个提交的最小情况。 例如，如下列表：```
3
0 1
2 1
1 1
```必须输出“NO”，因为第二次提交声明参与者 1 的 _x = 2_ 没有前面的 _x = 1_，即使 _x = 1_ 之后出现。 

## 方法

 一种简单的方法是为每个参与者维护所有先前提交的列表，并且对于每个新提交，向后扫描以确保所有较小的 _x_ 值都出现。 这是正确的，但在最坏的情况下，每次提交都可能需要扫描几乎所有先前的提交，从而产生 O(n²) 时间复杂度。 当 n 达到 10^5 时，这种方法是不切实际的。 

关键的观察是，对于每个参与者，我们只需要知道迄今为止出现的最大 _x_ 。 如果参与者 _k_ 的新提交的 _x_ 大于 _k_ 的当前最大值加 1，则该列表无效。 如果 _x_ 等于当前最大值或当前最大值加 1，则一致。 因此，我们可以将每个参与者的当前最大值_x_存储在字典中。 这将每次提交的检查减少到 O(1)，从而产生总体 O(n) 解决方案。 这个想法是，时间顺序只需要跟踪每个参与者最新提交的索引； 我们永远不需要提交的完整列表。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化一个空字典，将参与者 ID 映射到迄今为止看到的最大 _x_。 这捕获了每个参与者最近按时间顺序提交的内容。 
2. 迭代列表中的每个提交。 对于每次提交，请读取参与者 ID _k_ 和解决方案编号 _x_。 
3. 检查字典中参与者当前的最大值。 如果参与者之前没有提交过内容，则将最大值视为 -1。 
4. 如果新的_x_大于当前最大值加1，则立即输出“NO”并停止。 这意味着存在跳过的提交编号并且时间顺序被破坏。 
5. 否则，将参与者的最大值_x_更新为当前值和_x_的最大值。 这可以处理具有相同 _x_ 的重复提交，而不会破坏顺序。 
6. 如果循环完成而未检测到违规，则输出“YES”。 

维护的不变量是，对于每个参与者，字典始终存储序列中截至该点看到的最大 _x_ 。 如果任何提交违反了规则 _x ≤ current_max + 1_，则时间顺序肯定会被打破。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
latest = {}

valid = True
for _ in range(n):
    x, k = map(int, input().split())
    current_max = latest.get(k, -1)
    if x > current_max + 1:
        valid = False
        break
    latest[k] = max(current_max, x)

print("YES" if valid else "NO")
```字典`latest`跟踪每个参与者的最大提交索引。 使用`get(k, -1)`允许我们处理尚未提交任何解决方案的参与者。 这`max`确保使用相同的 _x_ 重复提交不会减少存储的最大值。 提前终止违规行为可以避免不必要的工作。 

## 工作示例

 跟踪示例输入：```
2
0 1
1 1
```| 步骤| x| k | 当前最大| 检查 | 最新[k] | 有效 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 1 | -1 | 0 ≤ -1+1 | 0 | 真实|
 | 2 | 1 | 1 | 0 | 1 ≤ 0+1 | 1 | 真实|

 该算法确认时间顺序并打印“YES”。 

跟踪失败案例：```
3
0 1
2 1
1 1
```| 步骤| x| k | 当前最大| 检查 | 最新[k] | 有效 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 1 | -1 | 0 ≤ 0 | 0 | 真实|
 | 2 | 2 | 1 | 0 | 2≤0+1？ | - | 假|

 算法在第 2 步停止，打印“NO”，正确捕获跳过的提交。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个提交都会处理一次，字典访问的时间复杂度为 O(1)。 |
 | 空间| O(n) | 字典为每个参与者存储一个条目，最多 n 个参与者。 |

 当 n 高达 100,000 时，该算法在典型的 1 秒时间限制内表现良好。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    latest = {}
    valid = True
    for _ in range(n):
        x, k = map(int, input().split())
        current_max = latest.get(k, -1)
        if x > current_max + 1:
            valid = False
            break
        latest[k] = max(current_max, x)
    return "YES" if valid else "NO"

# Provided sample
assert run("2\n0 1\n1 1\n") == "YES", "sample 1"

# Edge: single submission
assert run("1\n0 1\n") == "YES", "single submission"

# Skipped submission
assert run("3\n0 1\n2 1\n1 1\n") == "NO", "skipped submission"

# Multiple participants
assert run("4\n0 1\n0 2\n1 1\n1 2\n") == "YES", "multiple participants"

# Interleaved violation
assert run("4\n0 1\n1 2\n2 1\n1 2\n") == "NO", "interleaved violation"

# Large x repeated
assert run("3\n0 1\n0 1\n1 1\n") == "YES", "repeated same x allowed"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n0 1`| 是 | 最小输入案例|
 |`3\n0 1\n2 1\n1 1`| 否 | 提交编号已跳过 |
 |`4\n0 1\n0 2\n1 1\n1 2`| 是 | 多个参与者保持独立的序列 |
 |`4\n0 1\n1 2\n2 1\n1 2`| 否 | 交错提交可能会破坏顺序 |
 |`3\n0 1\n0 1\n1 1`| 是 | 允许重复提交相同的 x |

 ## 边缘情况

 对于跳过提交的情况`3\n0 1\n2 1\n1 1\n`，算法集`latest[1]`第一次提交后为0。 在 x=2 的第二次提交中，检查`2 > 0+1`失败，立即返回“NO”，而无需查看最后一行。 这演示了对无序序列的正确处理。 对于重复的 x 值，例如`0 1`两次，`latest[1]`保持 0，允许下一次提交 x=1，与当前最大值匹配，确认重复的解决方案是可以接受的。
