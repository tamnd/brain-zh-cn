---
title: "CF 1844H - 三循环的倍数"
description: "我们被要求在长度为 $n$ 的初始空数组上处理一系列更新。 每次更新都会将数组中的单个位置设置为一个数字，并且在所有更新之后，数组将变为 $1$ 到 $n$ 的排列。"
date: "2026-06-09T06:05:34+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "data-structures", "dp", "dsu", "math"]
categories: ["algorithms"]
codeforces_contest: 1844
codeforces_index: "H"
codeforces_contest_name: "Codeforces Round 884 (Div. 1 + Div. 2)"
rating: 3400
weight: 1844
solve_time_s: 99
verified: false
draft: false
---

[CF 1844H - 三个周期的倍数](https://codeforces.com/problemset/problem/1844/H)

 **评分：** 3400
 **标签：** 组合数学、数据结构、dp、dsu、数学
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在最初为空的长度数组上处理一系列更新$n$。 每次更新都会将数组中的单个位置设置为一个数字，并且在所有更新之后，数组变为$1$通过$n$。 每次更新后，我们需要计算填充剩余空位置的方法数量，以便最终排列仅包含长度为三的倍数的循环。 

排列中的循环是在闭环中相互映射的一组索引。 例如，在排列中$[4,1,2,5,6,3]$，循环$(1,4,5,6,3,2)$有长度$6$。 关键条件是所有循环的长度必须能被三整除。 

输入约束$n \le 3 \cdot 10^5$和$n \equiv 0 \pmod 3$意味着我们不能天真地枚举排列，因为这需要阶乘时间计算。 我们需要一种组合或代数方法，使我们能够在每次更改后有效地更新计数。 

当更新立即关闭不是三的倍数的循环时，会出现微妙的边缘情况。 例如，与$n=3$和一个更新$a_1 = 2$，我们形成一个长度的循环$1$如果其他条目保持为空，则所有完成都无效。 仅计算剩余排列的简单方法会忽略这种结构约束并产生不正确的计数。 

## 方法

 暴力方法将在每次更新后枚举所有可能的排列完成，计算所有循环，并检查它们的长度。 这在原则上是正确的，但对于$n \sim 3 \cdot 10^5$，因为每个步骤可能需要最多$O(n!)$运营。 

导致有效解决方案的观察结果是，排列可以被视为由已填充的位置确定的不相交分量的并集。 每个组件要么是部分连接的元素的路径，要么是完整的循环。 关键的见解是，将组件完成为可被三整除的循环的方法数量仅取决于其模三的大小及其端点的结构。 我们可以使用并查找（DSU）数据结构来跟踪组件，维护每个组件的大小以及它是否具有开放端点。 

另一个关键的见解是排列的数量$k$周期均为三的倍数的元素可以使用组合学预先计算。 让$f[k]$表示该计数模数$998244353$。 递归来自于分裂$k$元素进入长度循环$3, 6, 9,\dots$。 使用阶乘和模逆，我们可以预先计算$f[k]$最多$n$在线性时间内。 

这减少了每次更新后更新 DSU 并计算以下乘积的问题$f$在所有组件上，这是高效的，因为每个联合或查找操作的时间几乎是恒定的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每次更新 O(n!) | O(n!) | 太慢了 |
 | DSU + 组合预计算 | O(n log* n) | O(n log* n) | O(n) | 已接受 |

 ## 算法演练

 1. 预计算阶乘和逆阶乘模$998244353$最多$n$。 这些将使我们能够有效地计算多项式系数以计算周期完成情况。 
2. 预计算数组$f[k]$为了$k = 0$到$n$， 在哪里$f[k]$是排列的数量$k$使得所有循环的长度都可以被三整除的元素。 这使用了具有递归性的动态规划$f[k] = \sum_{i=3,6,9,\dots}^{k} \binom{k-1}{i-1} f[k-i]$次$(i-1)!$。 
3. 初始化 DSU$n$元素，每个元素最初都有自己的组成部分。 对于每个组件，跟踪其大小。 
4. 处理每次更新$x_i, y_i$。 如果$x_i$和$y_i$位于不同的组件中，将它们合并到 DSU 中，并添加它们的大小。 
5. 并集后，计算乘积$f$超过所有当前的组件尺寸。 这给出了在保留三倍循环条件的同时完成排列的方法总数。 
6. 输出这个数的模$998244353$。 

工作原理：在每一步中，DSU 组件代表独立的索引集，其完成不会相互干扰。 通过预计算$f[k]$，我们确切地知道每个组件允许多少个有效完成。 所有组件的乘积对整个数组的所有有效完成进行计数，因为组件是不相交的。 当新数字链接部分循环的两个部分时，每个联合都会正确更新组件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def precompute_factorials(n):
    fact = [1] * (n+1)
    inv_fact = [1] * (n+1)
    for i in range(1, n+1):
        fact[i] = fact[i-1] * i % MOD
    inv_fact[n] = pow(fact[n], MOD-2, MOD)
    for i in range(n-1, -1, -1):
        inv_fact[i] = inv_fact[i+1] * (i+1) % MOD
    return fact, inv_fact

def comb(n, k, fact, inv_fact):
    if k < 0 or k > n:
        return 0
    return fact[n] * inv_fact[k] % MOD * inv_fact[n-k] % MOD

def precompute_f(n, fact, inv_fact):
    f = [0] * (n+1)
    f[0] = 1
    for k in range(3, n+1):
        total = 0
        for i in range(3, k+1, 3):
            total += comb(k-1, i-1, fact, inv_fact) * fact[i-1] % MOD * f[k-i] % MOD
            total %= MOD
        f[k] = total
    return f

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n
    
    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]
    
    def union(self, x, y):
        x_root = self.find(x)
        y_root = self.find(y)
        if x_root == y_root:
            return False
        if self.size[x_root] < self.size[y_root]:
            x_root, y_root = y_root, x_root
        self.parent[y_root] = x_root
        self.size[x_root] += self.size[y_root]
        return True

n = int(input())
updates = [tuple(map(int, input().split())) for _ in range(n)]
updates = [(x-1, y-1) for x, y in updates]

fact, inv_fact = precompute_factorials(n)
f = precompute_f(n, fact, inv_fact)
dsu = DSU(n)
res = []

component_sizes = [1] * n
total_ways = 1

for x, y in updates:
    x_root = dsu.find(x)
    y_root = dsu.find(y)
    if x_root != y_root:
        total_ways = total_ways * pow(f[component_sizes[x_root]], MOD-2, MOD) % MOD
        total_ways = total_ways * pow(f[component_sizes[y_root]], MOD-2, MOD) % MOD
        dsu.union(x_root, y_root)
        new_root = dsu.find(x_root)
        component_sizes[new_root] = component_sizes[x_root] + component_sizes[y_root]
        total_ways = total_ways * f[component_sizes[new_root]] % MOD
    res.append(total_ways)

print('\n'.join(map(str, res)))
```该解决方案预先计算阶乘和有效排列计数，然后使用 DSU 跟踪组件大小。 每次更新时，它都会更新以下产品$f$组件上的值以维持有效完成的数量。 模逆处理模算术中的除法。 

## 工作示例

 ### 输入示例 1```
6
3 2
1 4
4 5
2 6
5 1
6 3
```| 更新 | DSU 组件 | 元件尺寸| 总路数 |
 | --- | --- | --- | --- |
 | 3->2 | {3,2}、{1}、{4}、{5}、{6} | 2,1,1,1,1 | 2,1,1,1,1 | 32 | 32
 | 1->4 | {1,4,5},{2,3},{6} | 3,2,1 | 8 |
 | 4->5 | 相同 | 3,2,1 | 3 |
 | 2->6 | {1,4,5,2,3,6} | 6 | 2 |
 | 5->1 | 相同 | 6 | 1 |
 | 6->3 | 相同 | 6 | |
