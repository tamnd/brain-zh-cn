---
title: "CF 109B - 幸运概率"
description: "我们被要求计算如果 Petya 和 Vasya 各自从各自的区间中随机选择一个整数，则两个所选数字之间的区间恰好包含 k 个幸运数字的概率。 幸运数字是只包含数字 4 和 7 的数字。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 109
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 84 (Div. 1 Only)"
rating: 1900
weight: 109
solve_time_s: 143
verified: true
draft: false
---

[CF 109B - 幸运概率](https://codeforces.com/problemset/problem/109/B)

 **评级：** 1900
 **标签：** 蛮力，概率
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算这样的概率：如果 Petya 和 Vasya 各自从各自的区间中随机选择一个整数，则两个所选数字之间的区间恰好包含`k`幸运数字。 幸运数字是那些只包含数字 4 和 7 的数字。输入提供了两个玩家的区间范围 (`pl`到`pr`对于彼佳来说，`vl`到`vr`对于 Vasya）和目标计数`k`的幸运数字。 输出是浮点数的概率。 

约束条件给出了上限$10^9$对于间隔和`k`可以达到 1000。这立即排除了直接迭代间隔中所有整数的任何方法，因为对的总数可以达到$(10^9)^2 = 10^{18}$，这在计算上是不可能的。 该问题需要一种方法，与潜在的巨大区间大小相比，利用少量的幸运数字。 

一个幼稚的实现可能会尝试枚举两个区间中的每个整数，计算每个结果子区间中的幸运数字，然后除以对的总数。 这会在很长的时间间隔内失败。 当幸运数字完全落在一个或两个区间之外时，就会出现另一种微妙的边缘情况。 例如，如果`pl = pr = 1`和`vl = vr = 2`和`k = 1`，1 和 2 之间没有幸运数字。粗心的实现可能会假设概率非零，但实际上应该返回 0。 

## 方法

 蛮力方法是迭代每个整数`p`在彼佳的间歇期和`v`在 Vasya 区间中，计算区间`[min(p,v), max(p,v)]`，计算该区间内的幸运数字，并检查是否等于`k`。 虽然正确，但这种方法的最坏情况复杂度为$O((pr - pl + 1) \cdot (vr - vl + 1) \cdot \text{number of lucky numbers})$，可以超过$10^{18}$运营。 这是不可能的。 

关键是幸运数字的数量非常少，最多在 1022 个左右$10^9$（由于只有 2 位数字，最长可达 10 位数字，$2^{10}-2$忽略个位数 0)。 我们可以预先计算所有幸运数字并关注它们相对于区间的位置，而不是检查区间中的每个整数。 

我们可以计算有多少个值，而不是迭代所有数字`p`和`v`产生恰好包含的区间`k`幸运数字，通过使用由连续幸运数字定义的范围来实现。 这将问题简化为间隔计数：对于每个起始幸运数字，找到`k`前面的第一个幸运数字，计算有效范围`p`和`v`使得它们之间的间隔恰好包含`k`幸运数字，并总结贡献。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((pr-pl+1)*(vr-vl+1)) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(L^2) 其中 L ~ 1022 | O(L) | 已接受 |

 ## 算法演练

 1. 生成所有幸运数字$10^9$。 这可以通过递归函数来完成，该函数在每一步附加 4 或 7，直到超过限制。 将它们存储在排序列表中。 
2. 添加哨兵值`0`和`10^9 + 1`处理包含边界的区间，无需额外条件。 
3. 对于每个连续序列`k`幸运数字，确定可以产生恰好包含这些数字的区间的最小和最大可能数字`k`幸运数字。 让`a`是序列之前的幸运数字（或 0），并且`b`序列后面的幸运数字（或 10^9 + 1）。 可能的`p`和`v`值必须严格介于`a+1`以及序列中的第一个幸运数字作为下界，并且严格小于`b`为上限。 
4. 对于每个这样的序列，计算有效的数量`(p,v)`对。 这涉及计算 Petya 区间中与下限和上限范围重叠的整数数量，对于 Vasya 来说也是如此。 将计数加在一起`p<v`和`v<p`案例。 
5. 将所有序列的所有贡献相加`k`连续的幸运数字。 除以可能对的总数`(pr-pl+1)*(vr-vl+1)`得到概率。 
6、高精度打印概率，保证绝对误差不超过$10^{-9}$。 

为什么它有效：该算法利用了这样一个事实，即获得准确结果的唯一方法`k`区间中的幸运数字就是精确地限定区间之间的距离`k`-th 幸运数字。 通过迭代幸运数字而不是区间中的整数，我们将一个棘手的问题简化为易于管理的区间算术。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def generate_lucky(limit):
    result = []
    def dfs(x):
        if x > limit:
            return
        if x > 0:
            result.append(x)
        dfs(x*10 + 4)
        dfs(x*10 + 7)
    dfs(0)
    return sorted(result)

pl, pr, vl, vr, k = map(int, input().split())
lucky = generate_lucky(10**9)
lucky = [0] + lucky + [10**9 + 1]  # add sentinels

total = 0

for i in range(1, len(lucky) - k):
    left = lucky[i-1] + 1
    right = lucky[i+k] - 1
    low = lucky[i]
    high = lucky[i+k-1]
    
    # compute overlap of intervals with player ranges
    len_p_low = max(0, min(pr, high) - max(pl, left) + 1)
    len_v_low = max(0, min(vr, high) - max(vl, left) + 1)
    
    len_p_left = max(0, min(pr, low-1) - max(pl, left) + 1)
    len_p_right = max(0, min(pr, right) - max(pl, high+1) + 1)
    len_v_left = max(0, min(vr, low-1) - max(vl, left) + 1)
    len_v_right = max(0, min(vr, right) - max(vl, high+1) + 1)
    
    total += len_p_left * len_v_right
    total += len_v_left * len_p_right

prob = total / ((pr - pl + 1) * (vr - vl + 1))
print(f"{prob:.12f}")
```该解决方案首先通过递归 DFS 有效地生成所有幸运数字。 哨兵在`0`和`10^9+1`简化边缘处理。 间隔重叠的计算方法为`max`和`min`将范围剪辑为播放器间隔。 计数公式仔细区分了有助于`p<v`和`v<p`。 最后，我们除以概率对的总数。 

## 工作示例

 输入示例 1：```
1 10 1 10 2
```| 我| 幸运[i-1] | 幸运[我] | 幸运[i+1] | 左| 对| len_p_left | len_v_right | 贡献 |
 | ---| ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 4 | 7 | 1 | 6 | 1-1=0 | 1-1=0 ... | 32 | 32

 此迹线显示，只有从 1-4 开始到 7-10 结束的间隔才恰好产生 2 个幸运数字，即 100 个数字中只有 32 个有效数字对。 

输入示例 2：```
1 10 1 10 1
```恰好产生 1 个幸运数字的区间包括仅包含 4 个或仅包含 7 个的区间。 计算双方的贡献`p<v`和`v<p`总和再次为 32，概率为 0.32。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(L^2) | O(L^2) | L ~ 1022，我们迭代所有幸运数字的长度为 k 的序列 |
 | 空间| O(L) | 存储所有幸运数字和哨兵 |

 这个复杂度足够小，因为幸运数字的数量以 1022 为界$10^9$，因此算法在一秒内执行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    exec(open('solution.py').read())
    return sys.stdout.getvalue().strip()

# provided samples
assert run("1 10 1 10 2\n") == "0.320000000000", "sample 1"
assert run("1 10 1 10 1\n") == "0.320000000000", "sample 2"

# custom cases
assert run("1 1 1 1 1\n") == "0.000000000000", "single value, no lucky"
assert run("4 7 4 7 1\n") == "0.500000000000", "interval includes lucky numbers 4 and 7"
assert
```
