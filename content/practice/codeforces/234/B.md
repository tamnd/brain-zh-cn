---
title: "CF 234B - 阅读"
description: "我们被要求帮助 Vasya 选择在火车上阅读教科书的最佳时间。 火车行程持续 n 小时，每个小时都有一个介于 0 到 100 之间的给定亮度。Vasya 想要恰好阅读 k 小时。"
date: "2026-06-04T10:06:45+07:00"
tags: ["codeforces", "competitive-programming", "sortings"]
categories: ["algorithms"]
codeforces_contest: 234
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 145 (Div. 2, ACM-ICPC Rules)"
rating: 1000
weight: 234
solve_time_s: 104
verified: true
draft: false
---

[CF 234B - 阅读](https://codeforces.com/problemset/problem/234/B)

 **评分：** 1000
 **标签：** 排序
 **求解时间：** 1m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求帮助 Vasya 选择在火车上阅读教科书的最佳时间。 火车行程持续 _n_ 小时，每个小时都有 0 到 100 之间的给定亮度。Vasya 想要阅读恰好 _k_ 小时。 他的目标是选择 _k_ 小时，使所选时间中最暗的时间尽可能明亮。 换句话说，如果他在光照强度为 20、30 和 40 的时间内阅读，则应在所有可能的 _k_ 小时组中最大化其中的最小值 20。 

输入给出了小时数 _n_、阅读小时数 _k_ 以及所有小时的光照水平。 输出应首先报告可达到的最大最低光照水平，然后是 Vasya 应选择的小时指数。 可以存在多个最优解。 

约束条件适中：_n_ 最多可达 1000。这意味着$O(n \log n)$或者$O(n^2)$方法是可行的，但是任何像指数这样的方法$O(n^k)$会太慢。 由于光照水平在 0 到 100 之间，我们可以利用这个小范围，但更简单的方法是关注小时选择而不是值频率。 

边缘情况包括所有时间都有相同的光线、阅读小时数 _k_ 等于 _n_ 或最大和最小光线值相等时。 粗心的方法可能会尝试选择连续的时间或无法处理正确的索引，从而导致错误的答案。 

## 方法

 一种天真的方法会考虑 _n_ 中 _k_ 小时的每一种组合，计算每种组合的最小光照，并选择具有最高最小值的一个。 这是正确的但不可行：组合的数量是$\binom{n}{k}$，其增长速度非常快（对于 _n_ = 1000 和 _k_ = 500，它是一个天文数字）。 

关键的见解是我们不需要检查所有组合。 由于我们只关心最大化所选时间中的最小光照，因此最佳集必须包括_k_个最亮的时间。 通过按光照水平对时间进行排序并选择 _k_ 个最大的，我们保证了尽可能大的最小值。 这些选定时间中的最小光只是选定子集中的最小值，这将是$k$- 整个数组中最大的。 选择这些时间后，我们输出它们的原始指数。 

这种方法将问题简化为排序和选择任务。 排序需要$O(n \log n)$时间，选择前 _k_ 并检索索引需要$O(n)$。 这对于给定的约束是有效的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n 选择 k × k) | O(k) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取输入值：_n_ 和 _k_，然后读取亮度级别列表。 
2. 将每个灯光级别与其原始的从 1 开始的索引配对。 这会在排序后保留小时位置。 
3. 按亮度级别的降序对配对列表进行排序。 这可确保前 _k_ 个元素是光照水平最高的时间。 
4. 从排序列表中取出前 _k_ 对。 这些是阅读的最佳时间。 
5. 提取所选时间中的最小光照水平，这是前_k_子集中的最后一个元素，因为列表是按降序排序的。 
6. 从对中收集所选小时的索引并以任意顺序输出它们。 

工作原理：按光照对时间进行排序可以保证任何包含较小光照水平的集合都不会产生更好的最小值。 通过取前_k_个值，我们确保该子集中的最小值尽可能大。 通过将索引与光照水平一起存储来保存索引。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, k = map(int, input().split())
lights = list(map(int, input().split()))

# Pair light levels with their original indices
hours = [(lights[i], i+1) for i in range(n)]

# Sort descending by light level
hours.sort(reverse=True, key=lambda x: x[0])

# Take top k hours
selected = hours[:k]

# Minimum light among chosen hours
min_light = min(l[0] for l in selected)

# Extract indices
indices = [l[1] for l in selected]

print(min_light)
print(" ".join(map(str, indices)))
```该解决方案读取数据，将光照水平与小时索引配对以保留位置，按光照降序对这些对进行排序，并选择前_k_。 使用Python的内置提取最小的光`min`，尽管它也可能是排序后的 top _k_ 列表的最后一个元素。 索引以任意顺序打印。 

## 工作示例

 样本1：

 输入：`5 3\n20 10 30 40 10`| 步骤| 小时（已排序）| 已选择 | 最小光 | 指数|
 | --- | --- | --- | --- | --- |
 | 初始| [(20,1),(10,2),(30,3),(40,4),(10,5)] | - | - | - |
 | 排序后 | [(40,4),(30,3),(20,1),(10,2),(10,5)] | [(40,4),(30,3),(20,1)] | 20 | [4,3,1]|

 输出：```
20
4 3 1
```这确认了选择小时 4、3、1，最小光照为 20。 

定制案例2：

 输入：`4 4\n50 50 50 50`| 步骤| 小时（已排序）| 已选择 | 最小光 | 指数|
 | --- | --- | --- | --- | --- |
 | 初始| [(50,1),(50,2),(50,3),(50,4)] | - | - | - |
 | 排序后 | [(50,1),(50,2),(50,3),(50,4)] | 全部 | 50 | 50 [1,2,3,4] |

 输出：```
50
1 2 3 4
```所有时间都同样明亮，因此大小 _k_ 的任何子集都会给出相同的最小值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 对列表进行排序主导运行时 |
 | 空间| O(n) | 存储成对的光照水平和指数 |

 假设 n ≤ 1000，这非常适合 1 秒的时间限制和 256 MB 的内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, k = map(int, input().split())
    lights = list(map(int, input().split()))
    hours = [(lights[i], i+1) for i in range(n)]
    hours.sort(reverse=True, key=lambda x: x[0])
    selected = hours[:k]
    min_light = min(l[0] for l in selected)
    indices = [l[1] for l in selected]
    return f"{min_light}\n{' '.join(map(str, indices))}"

# Provided sample
assert run("5 3\n20 10 30 40 10\n") == "20\n4 3 1"

# Minimum-size input
assert run("1 1\n0\n") == "0\n1"

# Maximum-size input (all 100)
assert run("1000 1000\n" + " ".join(["100"]*1000) + "\n") == "100\n" + " ".join(str(i) for i in range(1,1001))

# All-equal values, k<n
assert run("5 2\n10 10 10 10 10\n") == "10\n1 2"

# Mixed values, k<n
assert run("6 3\n5 1 9 2 8 3\n") == "5\n3 5 1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1\n0`|`0\n1`| 处理最小的输入 |
 |`1000 1000\n100...`|`100\n1..1000`| 处理最大尺寸输入 |
 |`5 2\n10 10 10 10 10`|`10\n1 2`| 所有值都相等，k<n |
 |`6 3\n5 1 9 2 8 3`|`5\n3 5 1`| 一般混合值，非连续 |

 ## 边缘情况

 当 _k_ 等于 _n_ 时，算法自然会选择所有时间。 用于输入`4 4\n50 50 50 50`，算法对小时进行排序，但前 _k_ 包括每个小时。 最小光照为50，指数`[1,2,3,4]`正确返回。 不会发生相差一错误，因为索引从一开始就存储为从 1 开始。 

当所有光照水平相同时，大小_k_的任何子集都是有效的。 该算法仍然选择排序后的前_k_个小时，根据问题陈述这是可以接受的。 用于输入`5 3\n10 10 10 10 10`，算法输出`[1,2,
