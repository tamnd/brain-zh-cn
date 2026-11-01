---
title: "CF 163B - 旅鼠"
description: "我们被要求从一组 n 只旅鼠中选择 k 个旅鼠，并将它们分配到 k 个高度不断增加的壁架，以便较重的旅鼠占据更高的壁架，同时最小化所有选定的旅鼠到达指定壁架所需的时间 t。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search"]
categories: ["algorithms"]
codeforces_contest: 163
codeforces_index: "B"
codeforces_contest_name: "VK Cup 2012 Round 2"
rating: 2000
weight: 163
solve_time_s: 95
verified: false
draft: false
---

[CF 163B - 旅鼠](https://codeforces.com/problemset/problem/163/B)

 **评级：** 2000
 **标签：** 二分查找
 **求解时间：** 1m 35s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求从一组 _n_ 中选择 _k_ 只旅鼠，并将它们分配到 _k_ 个高度不断增加的壁架上，以便较重的旅鼠占据更高的壁架，同时最小化所有选定旅鼠到达指定壁架所需的时间 _t_。 每只旅鼠都有一个重量 _m_ 和一个攀爬速度 _v_，旅鼠到达高度 _i·h_ 的壁架的时间计算为上限$(i·h)/v$。 输出是所选旅鼠的索引，按从最低到最高的顺序排列。 

限制因素很大。 当 _n_ 达到 10^5 时，任何考虑旅鼠所有子集或尝试单独模拟所有可能分配的解决方案都太慢。 我们需要一个运行时间大约为 O(n log n) 或 O(n log max_time) 的算法，其中 max_time 与二分搜索空间相关。 高达 10^4 的高度以及高达 10^9 的速度和权重意味着必须小心处理整数运算，尤其是除法和上限计算。 

边缘情况包括多个旅鼠具有相同重量但速度不同的情况。 如果一些旅鼠无法在最短可行时间内到达指定的壁架，那么选择_k_个最重的旅鼠的天真贪婪方法可能会失败。 另一个微妙的情况是，当许多旅鼠相对于其高度而言非常快或非常慢时，这可能会影响可实现的最小_t_。 

## 方法

 蛮力方法将尝试所有大小为 _k_ 的子集，按重量对它们进行排序，并计算每个旅鼠爬上指定壁架的时间。 这在原则上是正确的，但在计算上是不可能的：子集的数量是$C(n, k)$，对于 n=10^5 和 k=5 来说是天文数字。 检查所有作业的时间将呈指数级增长。 

关键的见解是最小时间 _t_ 可以使用二分搜索来确定。 我们可以检查，对于候选_t_，是否存在可以按顺序到达壁架的_k_个旅鼠的选择，其中第i个壁架需要时间$\ge i·h / v$。 这将问题从组合选择转变为可行性检查。 按重量对旅鼠进行排序使我们能够将最低的可用重量分配给最低的壁架，从而确保重量约束不减少。 在可行性检查期间，我们选择最快的 _k_ 只旅鼠，它们可以到达候选 _t_ 中各自的壁架。 

这种方法将解简化为 O(n log n log T)，其中 T 是可能的爬升时间范围。 随着时间的推移，外部二分搜索缩小了可实现的最小_t_范围，并且每次可行性检查都涉及一次通过排序旅鼠，保留优先级队列或最快候选列表。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(C(n, k) * k) | O(C(n, k) * k) | O(k) | 太慢了 |
 | 二分查找+贪心选择 | O(n log n log(max_time)) | O(n log n log(max_time)) | O(n) | 已接受 |

 ## 算法演练

 1. 读取输入值：旅鼠数量 _n_、壁架数量 _k_、高度增量 _h_、旅鼠重量 _m_ 和速度 _v_。 
2. 将每个旅鼠的体重、速度和原始索引配对成一个元组`(weight, speed, index)`。 
3. 按重量非降序对旅鼠进行排序。 这确保将第一个选定的旅鼠分配给最低的壁架将满足重量排序约束。 
4. 初始化时间 _t_ 的二分搜索范围。 下限为 0，上限可以是任意大的数，例如，$10^{18}$，这安全地高于任何旅鼠可能需要的最大爬升时间。 
5. 对候选时间 _t_ 实施可行性检查。 迭代已排序的旅鼠，维护可以到达下一个所需壁架的旅鼠列表：对于壁架 i，旅鼠必须具有$v \ge i·h / t$。 当旅鼠符合条件时，将其添加到可能的候选者列表中。 一旦收集到 _k_ 只旅鼠，分配就可行。 
6.应用二分搜索：如果当前_t_可行，则减小上限以搜索更小的_t_； 否则，增加下限。 
7. 找到最小可行 _t_ 后，通过从排序列表中挑选前 _k_ 个合格旅鼠来重构分配，同时尊重壁架和权重的顺序。 
8. 按照从最低壁架到最高壁架的顺序输出所选旅鼠的原始索引。 

为什么有效：按重量排序可以保证我们始终可以将选定的旅鼠分配到壁架上，而不会违反重量限制。 二分搜索确保我们最小化 _t_，并检查每个候选者的可行性，保证所有选定的旅鼠都能在这段时间内到达指定的壁架。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def lemmings_jump():
    n, k, h = map(int, input().split())
    m = list(map(int, input().split()))
    v = list(map(int, input().split()))
    
    lemmings = sorted([(m[i], v[i], i + 1) for i in range(n)])  # (weight, speed, index)
    
    left, right = 0, 10**18
    result_indices = []

    def feasible(t):
        count = 0
        selected = []
        for weight, speed, idx in lemmings:
            required_time = (count + 1) * h
            if speed * t >= required_time:
                selected.append(idx)
                count += 1
                if count == k:
                    break
        if count == k:
            nonlocal result_indices
            result_indices = selected
            return True
        return False

    while left < right:
        mid = (left + right) // 2
        if feasible(mid):
            right = mid
        else:
            left = mid + 1

    feasible(left)
    print(' '.join(map(str, result_indices)))

lemmings_jump()
```该解决方案首先将旅鼠与其重量、速度和原始指数配对。 按重量排序可确保按顺序选择旅鼠满足重量排序要求。 二分搜索通过重复检查候选时间是否允许可行的分配来有效地找到最小时间。 可行性检查将速度乘以时间，并将其与所需高度进行比较，以避免浮点错误。 

## 工作示例

 ### 输入示例 1```
5 3 2
1 2 3 2 1
1 2 1 2 10
```| 计数| 重量 | 速度| idx | 必填| 速度*t >= 必需 | 已选择 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 1 | 1 | 2 | 没有| []|
 | 0 | 1 | 10 | 10 5 | 2 | 是的 | [5]|
 | 1 | 2 | 2 | 2 | 4 | 是的 | [5,2]|
 | 2 | 2 | 2 | 4 | 6 | 是的 | [5,2,4]|

 这表明按照重量递增的顺序选择旅鼠，同时确保最快的候选者能够到达其壁架。 

### 输入示例 2```
4 2 3
5 1 2 4
1 10 2 3
```| 计数| 重量 | 速度| idx | 必填| 速度*t >= 必需 | 已选择 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 1 | 10 | 10 2 | 3 | 是的 | [2] |
 | 1 | 2 | 2 | 3 | 6 | 是的 | [2,3]|

 表明为较低的壁架选择最快的旅鼠可以最大限度地减少总时间。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n log T) | O(n log n log T) | 排序需要 O(n log n)。 二分搜索执行 O(log T) 次迭代，每次进行 O(n) 的线性可行性检查。 |
 | 空间| O(n) | 存储旅鼠元组和选择列表需要 O(n) 空间。 |

 时间复杂度符合约束条件，因为 n ≤ 10^5 且 T ≤ 10^18。 每次迭代在 n 中都是线性的，二分搜索的对数因子使总操作量保持在 10^7 以下。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    lemmings_jump()
    return output.getvalue().strip()

# Provided sample
assert run("5 3 2\n1 2 3 2 1\n1 2 1 2 10\n") in ["5 2 4", "1 2 4"], "sample 1"

# Custom cases
assert run("1 1 1\n10\n1\n") == "1", "single lemming"
assert run("3
```
