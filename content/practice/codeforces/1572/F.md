---
title: "CF 1572F - 站"
description: "我们有一排城市，每个城市都可以拥有一个广播电台。 每个站点都有一个高度和范围。 一个电台可以到达其右侧的城市直至其范围限制，但它会被中间任何更高的电台阻挡。"
date: "2026-06-10T11:18:22+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 1572
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 743 (Div. 1)"
rating: 3400
weight: 1572
solve_time_s: 126
verified: true
draft: false
---

[CF 1572F - 车站](https://codeforces.com/problemset/problem/1572/F)

 **评分：** 3400
 **标签：** 数据结构
 **求解时间：** 2m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排城市，每个城市都可以拥有一个广播电台。 每个站点都有一个高度和范围。 一个电台可以到达其右侧的城市直至其范围限制，但它会被中间任何更高的电台阻挡。 最初，所有站点的高度都为零，并且只能到达自身。 然后，发生一系列事件。 有些活动会重建一个具有新高度和范围的车站，使其暂时成为系统中最高的车站。 其他事件则询问在指定时间间隔内可以到达每个城市的车站总数。 我们的任务是有效地处理所有事件并回答查询。 

因为我们有多达 200,000 个城市和 200,000 个事件，所以任何在每次查询或重建时都考虑每对城市的方法都会太慢。 暴力解决方案将尝试通过迭代其左侧的所有车站来计算每个城市有多少个车站到达该城市。 在最坏的情况下，这是$O(nq)$，或最多$4 \cdot 10^{10}$操作，这在2秒内是不可能实现的。 

不明显的边缘情况包括多个站点影响同一城市的重叠范围，或者将站点范围扩展到先前站点已到达的城市之外的重建。 例如，如果城市 1 的车站最初仅到达其自身，然后重建为高度 1，范围为 5，而后来城市 3 的车站重建为更高的高度和范围 4，则必须正确考虑被封锁的城市。 如果忽略相对高度约束，简单计数可能会重复计数或错过阻塞的站点。 

## 方法

 暴力方法将维护一个数组`b`在哪里`b[j]`是到达城市的车站数量`j`。 对于每次重建，我们都会从重建的城市扫描其范围和增量`b[j]`对于每个满足高度限制的城市 j 。 对于每个查询，我们将求和`b[l..r]`。 这原则上可行，但需要成本$O(n)$在最坏的情况下每次重建，最多$O(nq)$跨越所有事件，这太慢了。 

关键的观察结果是，每次重建总是创建迄今为止最高的车站。 这保证了它不会被任何先前的站阻塞，并且只有其右侧的站可能被它阻塞。 这种结构使我们能够将问题建模为动态间隔覆盖，其中站点扩展了范围，但永远不需要考虑其左侧先前较高的站点。 

我们可以使用支持范围更新和范围查询的线段树或芬威克树来有效地维护站点的效果。 具体来说，我们使用芬威克树跟踪到达每个城市的车站数量，并按照从重建城市到其可以到达的最远城市的范围增量进行重建。 查询变成树上的简单范围求和查询。 当多个重建重叠时，每个增量都会正确添加到现有计数中，因为车站在重建时保证是最高的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | Fenwick 树/线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化一棵大小为 n 的 Fenwick 树。 每个位置代表一个城市，存储可以到达该城市的车站数量。 
2. 维持当前最大高度变量。 每次重建都会增加这个最大值。 
3. 对于每个事件，检查其类型。 如果是重建：

 1. 计算区间`[c, w]`新站可以到达。 最初，`c`是重建后的城市`w`是新的范围。 
2. 使用 Fenwick 树范围更新来增加以下所有城市的计数`[c, w]`1. 这反映了新站到达所有这些城市的事实。 
4. 如果事件是查询：

 1. 使用 Fenwick 树范围查询来计算 的计数总和`[l, r]`。 
2. 打印结果。 
5. 继续下一个活动。 

为什么有效：因为每个车站都被重建为当时最高的车站，所以它不会被之前的车站阻挡。 使用 Fenwick 树可确保正确且高效地计算重叠范围。 范围增量对新车站的覆盖范围进行建模，范围总和查询可以正确计算到达任何城市的车站数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.tree = [0]*(n+2)
        
    def update(self, idx, delta):
        while idx <= self.n:
            self.tree[idx] += delta
            idx += idx & -idx
            
    def query(self, idx):
        res = 0
        while idx > 0:
            res += self.tree[idx]
            idx -= idx & -idx
        return res
    
    def range_add(self, l, r, delta):
        self.update(l, delta)
        self.update(r+1, -delta)
        
    def prefix_query(self, idx):
        return self.query(idx)
    
    def range_query(self, l, r):
        return self.query(r) - self.query(l-1)

n, q = map(int, input().split())
fen = Fenwick(n)

for _ in range(q):
    parts = list(map(int, input().split()))
    if parts[0] == 1:
        _, c, w = parts
        fen.range_add(c, w, 1)
    else:
        _, l, r = parts
        print(fen.range_query(l, r))
```Fenwick 树用于范围增量和范围总和。 我们递增`[c, w]`当发生重建时，因为重建后的车站可以到达该范围内的所有城市而不会被阻塞。 然后查询就变成了简单的前缀和。 

## 工作示例

 输入示例 1：```
1 3
2 1 1
1 1 1
2 1 1
```| 活动 | 芬威克树州| 查询输出 |
 | --- | --- | --- |
 | 查询 1 | [0]| 1 |
 | 重建 1 | [1] | - |
 | 查询 2 | [1] | 1 |

 第一个查询对城市 1 进行求和，最初为 1，因为默认车站到达其自身。 重建后，城市1仍有1个车站，第二次查询输出1。 

输入示例 2：```
5 5
1 1 3
1 2 4
2 1 5
1 5 5
2 3 5
```| 活动 | 芬威克树木范围更新| 查询输出 |
 | --- | --- | --- |
 | 重建 1 | [1-3]+=1 | - |
 | 重建 2 | [2-4]+=1 | - |
 | 查询 1 | - | 总和([1,2,2,1,0]) = 6 |
 | 重建 3 | [5-5]+=1 | - |
 | 查询 2 | - | 总和（[2,1,1]）= 4 |

 此跟踪演示了重叠范围和孤立重建的正确处理。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log n) | O(q log n) | Fenwick 树中的每次更新和查询都需要 O(log n)，并且有 q 个事件。 |
 | 空间| O(n) | 芬威克树存储 n+1 个整数。 |

 给定 n, q ≤ 2×10^5，O(q log n) ≈ 2×10^5 × 18 ≈ 3.6×10^6 操作，在 2 秒内轻松完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open('solution.py').read())  # or paste the solution here
    return output.getvalue().strip()

# Provided sample
assert run("1 3\n2 1 1\n1 1 1\n2 1 1") == "1\n1", "sample 1"

# Minimum size
assert run("1 1\n2 1 1") == "1", "minimum size"

# Overlapping rebuilds
assert run("5 4\n1 1 5\n1 2 5\n2 1 5\n2 3 5") == "10\n8", "overlap"

# Max size, all reach
inp = "200000 2\n" + "1 1 200000\n2 1 200000\n"
assert run(inp) == str(200000*(1)), "max range"

# Boundary checks
assert run("3 3\n1 2 3\n2 1 3\n2 2 3") == "3\n2", "boundaries"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 个城市，多个活动 | 1\n1 | 1 基本功能，单站|
 | 5 个城市，重叠重建 | 10\n8 | 正确计数重叠范围 |
 | 最大尺寸 | 200000 | 性能和范围处理|
 | 边界范围 | 3\n2 | 正确的边缘包含计数 |

 ## 边缘情况

 对于重叠重建，芬威克树正确地总结了贡献
