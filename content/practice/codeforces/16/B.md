---
title: "CF 16B - 防盗器和火柴"
description: "我们有一个窃贼，他可以携带恰好 n 个火柴盒。 仓库里有m个集装箱。 每个容器 i 都有 a_i 个火柴盒，并且该容器中的每个火柴盒都包含 b_i 个火柴盒。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 16
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 16 (Div. 2 Only)"
rating: 900
weight: 16
solve_time_s: 73
verified: true
draft: false
---
[CF 16B - 防盗和火柴](https://codeforces.com/problemset/problem/16/B)

 **评分：** 900
 **标签：** 贪婪、实现、排序
 **求解时间：** 1m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个可以精确携带的窃贼`n`火柴盒。 仓库里有`m`容器。 每个集装箱`i`有`a_i`火柴盒，并且该容器中的每个火柴盒都包含`b_i`匹配。 目标是达到`n`火柴盒，使匹配总数最大化。 

输入是两个整数`n`和`m`其次是`m`对`(a_i, b_i)`。 输出是一个整数：与窃贼可以拿走的最大总数相匹配。 

这些限制很能说明问题。`n`可以大到 2·10^8。 这对于迭代单个火柴盒来说是巨大的，因此任何单独检查每个火柴盒的解决方案都会太慢。`m`最多20个，所以容器数量很少。 这暗示对容器进行排序或贪婪选择是可行的。`a_i`可能很大，因此容器中的火柴盒数量可能超过`n`。`b_i`很小，为 1 到 10，因此每个框的匹配很容易用常规整数处理。 

需要注意的边缘情况包括火柴盒数量超出窃贼携带能力的容器。 例如，如果`n = 5`一个容器有`a_i = 10`盒子与`b_i = 3`火柴，窃贼只能拿走其中的 5 根。 一个粗心的实现增加了所有`10*3 = 30`匹配就会出错。 另一个边缘情况是当`n`大于所有容器中火柴盒的总数。 在这种情况下，窃贼应该拿走所有东西。 

## 方法

 蛮力方法将迭代容器中火柴盒的每种可能组合，对总匹配进行求和并挑选最佳的。 和`m`最多20个，每个容器最多有10^8个火柴盒，组合数量是天文数字。 即使我们只将容器视为整体单元，子集的数量也是`2^m = 2^20 ≈ 1 million`，这对于子集和是可行的，但在这里是不必要的。 深入到单个火柴盒显然是不可能的，因为`n`可以是2·10^8。 

关键的观察是这个问题是贪婪的：为了最大化火柴的数量，窃贼应该首先拿走最大的火柴盒`b_i`（每盒火柴）。 容器的顺序无关紧要，除了`b_i`。 一旦容器按以下方式排序`b_i`下降时，窃贼从第一个集装箱中取出尽可能多的盒子，然后是下一个，直到背包装满。 这是有效的，因为每个火柴盒都是不可分割的，并且匹配较多的盒子总是比匹配较少的盒子更好。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^m * m) | O(2^m * m) | O(米) | 太慢了 |
 | 贪心/排序依据`b_i`| O(m log m) | O(米) | 已接受 |

 ## 算法演练

 1. 阅读`n`（容量）和`m`（集装箱数量）。 初始化`total_matches = 0`。 
2. 读取每个容器的`(a_i, b_i)`并存储为元组列表。 
3. 按降序对容器列表进行排序`b_i`。 排序确保我们始终首先考虑最有价值的盒子。 
4. 遍历已排序的容器：

 a. 让`take = min(a_i, n)`。 这是我们在不超过容量的情况下可以从该集装箱中取出的箱子数量。 

b. 添加`take * b_i`到`total_matches`。 

c. 减少`n`经过`take`。 如果`n`变为0，由于背包已满而中断循环。 
5. 打印`total_matches`。 

为什么有效：在每一步中，我们都会首先获取每盒匹配度最高的可用火柴盒。 由于火柴盒是不可分割的，因此将高价值的火柴盒留给低价值的火柴盒没有任何优势。 贪婪的选择是安全的，并且通过迭代直到`n`盒子被拿走，我们保证匹配总数最大化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m = map(int, input().split())
containers = []

for _ in range(m):
    a, b = map(int, input().split())
    containers.append((b, a))  # store as (matches per box, number of boxes)

# Sort by matches per box descending
containers.sort(reverse=True)

total_matches = 0
for b, a in containers:
    if n == 0:
        break
    take = min(a, n)
    total_matches += take * b
    n -= take

print(total_matches)
```我们储存`(b, a)`而不是`(a, b)`因为排序更容易`b`下降。 在迭代过程中，`take = min(a, n)`确保我们永远不会超出容量。 如果背包已满，则循环提前终止。 这些细节可以防止差一或溢出问题。 

## 工作示例

 样本1：

 输入：```
7 3
5 10
2 5
3 6
```逐步跟踪：

 | 容器（b，a）| 之前 | 采取| | 之后的总匹配数 n 之后 |
 | --- | --- | --- | --- | --- |
 | (10, 5) | (10, 5) | 7 | 5 | 50 | 50 2 |
 | (6, 3) | 2 | 2 | 50 + 12 = 62 | 0 |
 | (5, 2) | 0 | 0 | 62 | 62 0 |

 说明：第一个容器最丰富，拿5盒。 下一个集装箱，剩余容量仅可容纳 2 个箱子。 总比赛数 = 62。 

另一个测试用例：

 输入：```
10 2
3 10
5 20
```| 容器（b，a）| 之前 | 采取| | 之后的总匹配数 n 之后 |
 | --- | --- | --- | --- | --- |
 | (20, 5) | 10 | 10 5 | 100 | 100 5 |
 | (10, 3) | 5 | 3 | 100 + 30 = 130 | 2 |

 剩余容量 (2) 比任何剩余的盒子都多，所以我们停下来。 总匹配数 = 130。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log m) | 排序`m`集装箱占主导地位； 迭代次数为 O(m) |
 | 空间| O(米) | 存储容器列表 |

 给定`m ≤ 20`，排序很简单，并且该算法很容易满足 0 秒时间限制和 64 MB 内存限制。 处理`n`最多 2·10^8 有效，因为我们从不迭代每个火柴盒，而仅迭代每个容器。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline
    n, m = map(int, input().split())
    containers = []
    for _ in range(m):
        a, b = map(int, input().split())
        containers.append((b, a))
    containers.sort(reverse=True)
    total_matches = 0
    for b, a in containers:
        if n == 0:
            break
        take = min(a, n)
        total_matches += take * b
        n -= take
    return str(total_matches)

# Provided sample
assert run("7 3\n5 10\n2 5\n3 6\n") == "62", "sample 1"

# Minimum input
assert run("1 1\n1 1\n") == "1", "minimum input"

# Large n, all containers smaller
assert run("10 2\n3 5\n2 10\n") == "35", "capacity larger than total boxes"

# All boxes same b
assert run("5 2\n3 7\n4 7\n") == "35", "all boxes same value"

# Single rich container exceeds n
assert run("4 1\n10 100\n") == "400", "single container larger than capacity"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1\n1 1 | 1 1\n1 1 | 1 | 最小输入边缘情况 |
 | 10 2\n3 5\n2 10 | 35 | 35 容量大于总箱数|
 | 5 2\n3 7\n4 7 | 35 | 35 所有盒子均等值 |
 | 4 1\n10 100 | 1 400 | 集装箱大于容量，只取n箱 |

 ## 边缘情况

 最富有的容器的盒子数量多于`n`:```
n = 4, m = 1
10 100
```

`take = min(10, 4) = 4`,`total_matches = 4*100 = 400`。 正确，没有过度计算。 

盒子总数 < n 的情况：```
n = 10, m = 2
3 5
2
```
