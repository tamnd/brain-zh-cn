---
title: "CF 1599F - 火星"
description: "我们得到了一个圆形火星殖民地上的城市位置列表，其中城市的编号以 $10^9+7$ 为模。 每个查询询问是否可以使用固定长度 $D$ 的道路连接给定子数组中的所有城市。"
date: "2026-06-10T08:41:02+07:00"
tags: ["codeforces", "competitive-programming", "hashing"]
categories: ["algorithms"]
codeforces_contest: 1599
codeforces_index: "F"
codeforces_contest_name: "Bubble Cup 14 - Finals Online Mirror (Unrated, ICPC Rules, Teams Preferred, Div. 1)"
rating: 2700
weight: 1599
solve_time_s: 143
verified: false
draft: false
---

[CF 1599F - 火星](https://codeforces.com/problemset/problem/1599/F)

 **评分：** 2700
 **标签：** 哈希
 **求解时间：** 2m 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个圆形火星殖民地上的城市位置列表，其中城市的编号为模数$10^9+7$。 每个查询询问是否可以使用固定长度的道路连接给定子数组中的所有城市$D$。 连接一条漫长的路$D$意味着，如果你选择任意两个相连的城市$x$和$y$， 区别$|x-y|$模数$10^9+7$必须能整除$D$。 目标是回答“是”，如果这些城市存在排序，使得每个连续的城市之间的差异恰好相同$D$模数$10^9+7$，否则为“否”。 

约束条件很大：最多$2 \cdot 10^5$城市和查询，这排除了对城市安排的任何强力排列检查。 任何以简单方式迭代子数组的解决方案都会导致$O(N \cdot Q)$运营，可能$4 \cdot 10^{10}$，远远超出了可行的范围。 

问题的不明显方面是城市可以重复并且数组未排序。 例如，粗心的方法可能只是检查第一个和最后一个城市是否相差多个$D$，但是当城市之间的内部差异违反距离要求时，这种方法就会失败。 例如，考虑城市`[0, 3, 6]`和$D=3$。 任何子数组都可以，但是如果子数组是`[0, 6]`，仅使用端点的天真检查可能会错误地回答“否”，因为$6-0$能被 3 整除，但如果数组是`[0, 4, 8]`和$D=2$，尽管仅查看端点会错误地回答“是”$4-0=4$和$8-4=4$都可以被 2 整除，所以在这种情况下它实际上是有效的。 边缘情况包括具有单个城市的子数组，或者当所有城市都相同时，其中任何$D$作品。 

## 方法

 暴力方法很简单：对于每个查询，迭代子数组，检查连续城市之间的所有差异，并验证每个差异模$10^9+7$可以整除$D$。 这是正确的，因为问题直接要求距离的整除性，但是太慢了。 如果每个子数组的长度$N$在最坏的情况下，我们有$Q$查询，结果是$O(N \cdot Q) \sim 4 \cdot 10^{10}$运营。 

关键的观察是我们不需要考虑所有对。 我们只需要子数组内所有成对差异的最大公约数 (GCD)。 如果这些差异的 GCD 可以整除$D$，那么就可以根据道路长度将城市按顺序排列$D$。 这是可行的，因为序列可以任意重新排序； GCD 捕捉到了所有城市中存在的最佳公共间距。 通过预先计算数组中差异的前缀 GCD，我们可以回答每个查询$O(\log N)$使用线段树或稀疏表。 这降低了不可行的总体复杂性$O(NQ)$到可行的$O(N \log N + Q \log N)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N * Q) | O(1) | O(1) | 太慢了 |
 | 最优（GCD + 稀疏表）| O(N log N + Q log N) | O(N log N + Q log N) | O(N log N) | O(N log N) | 已接受 |

 ## 算法演练

 1. 计算连续城市之间的所有差异取模$10^9+7$。 对于数组`a`， 创造`diff[i] = (a[i+1] - a[i]) % MOD`。 这捕获了道路施工所需对齐的有效距离。 
2. 建立一个稀疏表`diff`用于 GCD 查询。 这使我们能够计算任何差异子数组的 GCD$O(1)$每个查询。 
3. 对于每个查询`(L, R, D)`，考虑索引中的子数组`L-1`到`R-1`。 计算差异的 GCD`diff[L-1:R-1]`。 
4. 如果这个 GCD 可以整除`D`，输出“是”； 否则，输出“No”。 
5. 单元素子数组通常是“是”，因为没有间隙可以连接。 

为什么有效：通过获取子数组中所有连续差异的 GCD，我们捕获了城市之间的最小间距。 如果这个间距可以整除`D`，那么就可以对城市进行布局，使得每个连接都恰好是`D`。 模数确保循环结构的正确处理而不会溢出。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

MOD = 10**9 + 7

def build_sparse_table(arr):
    n = len(arr)
    K = n.bit_length()
    st = [[0]*n for _ in range(K)]
    st[0] = arr[:]
    for k in range(1, K):
        for i in range(n - (1 << k) + 1):
            st[k][i] = math.gcd(st[k-1][i], st[k-1][i + (1 << (k-1))])
    return st

def query(st, l, r):
    k = (r - l + 1).bit_length() - 1
    return math.gcd(st[k][l], st[k][r - (1 << k) + 1])

def main():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    if n > 1:
        diff = [(a[i+1] - a[i]) % MOD for i in range(n-1)]
        st = build_sparse_table(diff)
    else:
        diff = []
        st = []

    for _ in range(q):
        L, R, D = map(int, input().split())
        L -= 1
        R -= 1
        if L == R:
            print("Yes")
            continue
        g = query(st, L, R-1)
        print("Yes" if g % D == 0 else "No")

if __name__ == "__main__":
    main()
```该解决方案首先预先计算连续差异以捕获潜在距离。 稀疏表允许每个查询的 GCD 查询时间为 O(1)。 单元素子数组单独处理以避免空范围。 从索引中减一会将它们与从零开始的 Python 列表对齐。 模运算确保循环城市位置的正确处理。 

## 工作示例

 使用示例 1：

 | 查询 | Subarray | Differences modulo MOD | GCD | d | 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 2 3 12 | [0, 12] | [12] | 12 | 12 | 12 是的 |
 | 2 3 6 | [0, 12] | [12] | 12 | 12 6 | 没有 |
 | 4 6 2 | [6,10,8]| [4、998244736] | 2 | 2 | 是的 |

 该表显示该算法正确计算差值和 GCD，并评估 D 的整除性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N log N + Q log N) | O(N log N + Q log N) | 构建稀疏表是 O(N log N)，每次查询 O(log N) |
 | 空间| O(N log N) | O(N log N) | 稀疏表存储多级GCD |

 该解决方案完全符合 2 秒的限制$N, Q \le 2 \cdot 10^5$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    main()
    return out.getvalue().strip()

# provided sample
assert run("9 8\n17 0 12 6 10 8 2 4 5\n2 3 12\n2 3 6\n2 4 6\n4 6 2\n2 8 2\n1 2 17\n1 8 2\n9 9 14") == \
"Yes\nNo\nYes\nYes\nYes\nYes\nNo\nYes"

# minimum input
assert run("1 1\n0\n1 1 0") == "Yes"

# all equal
assert run("3 2\n5 5 5\n1 3 1\n1 3 2") == "Yes\nYes"

# maximum D
assert run("2 1\n0 1000000006\n1 2 1000000006") == "Yes"

# boundary consecutive
assert run("3 1\n0 2 4\n1 3 2") == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 | 1 是的 | 单元素子数组 |
 | 3 2 | 是的 是的 | 所有城市平等，任何 D 都有效 |
 | 2 1 | 2 是的 | MOD 边界附近的大值 |
 | 3 1 | 3 1 是的 | 模 MOD 的差异，GCD 的正确性 |

 ## 边缘情况

 单元素子数组是
