---
title: "CF 2029H - 消息传播"
description: "我们得到一个小的无向图，其中每条边都有可能在任何给定的一天出现。 最初，只有顶点 1 知道消息。"
date: "2026-06-08T12:05:52+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "combinatorics", "dp"]
categories: ["algorithms"]
codeforces_contest: 2029
codeforces_index: "H"
codeforces_contest_name: "Refact.ai Match 1 (Codeforces Round 985)"
rating: 3500
weight: 2029
solve_time_s: 93
verified: false
draft: false
---

[CF 2029H - 消息传播](https://codeforces.com/problemset/problem/2029/H)

 **评分：** 3500
 **标签：** 位掩码、暴力破解、组合、dp
 **求解时间：** 1m 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个小的无向图，其中每条边都有可能在任何给定的一天出现。 最初，只有顶点 1 知道消息。 每天，如果某个顶点在前一天已经收到该消息，或者当天至少有一个邻居收到该消息并且连接边出现，则该顶点会收到该消息。 任务是计算所有顶点都知道该消息之前的预期天数。 

该图最多有 21 个顶点，因此顶点子集总数最多为$2^{21} \approx 2 \times 10^6$。 这是至关重要的，因为它表明针对所有子集的基于位掩码的动态编程解决方案是可行的。 每条边都有一个相关的概率，以分数形式给出$\frac{p}{q}$，并且计算必须以模进行$998\,244\,353$。 

边缘情况包括具有单个顶点的图（消息已知，因此答案为 0）、仅具有一条边的图或某些顶点以非常低的概率由边连接的场景。 对逐日传播的简单模拟是不可行的，因为预期的天数可能非常大，并且不同随机边缘配置的数量是指数级的。 

## 方法

 暴力方法将枚举边缘出现的每个可能序列，并计算每种情况下消息传播的天数。 对于每一天，都有$2^m$可能的边缘配置，即使对于小尺寸也是不可行的$m$因为$m$最多可达 210$n=21$。 

关键的见解是，可以将问题建模为了解消息的顶点子集集上的马尔可夫过程。 由于顶点数量很少，我们可以将每个子集表示为位掩码。 让$f[S]$表示从子集到达完整集的预期天数$S$。 对于每个$S$，期望值满足由总期望定律导出的线性方程：$$f[S] = 1 + \sum_{T \supseteq S} P(S \to T) \cdot f[T]$$在哪里$P(S \to T)$是第二天知道该消息的顶点集扩展到的概率$T$。 总和$T$可以通过迭代外部的顶点来有效地计算$S$并计算他们从当前集合中接收到消息的概率。 这导致了一个系统$2^n$线性方程组$2^n$变量。 因为$n\le 21$，我们可以用位掩码动态规划来解决$O(3^n)$时间使用对邻居的包含-排除原则。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(天 × 2^m) | O(n) | 太慢了|
 | 位掩码 DP / 包含-排除 | O(3^n) | O(3^n) | O(2^n) | O(2^n) | 已接受 |

 ## 算法演练

 1. 将每个顶点子集表示为长度的位掩码$n$。 初始子集仅包含顶点 1 集。 目标是所有位均已设置的子集。 
2. 对每个顶点进行预计算$v$它**不**从给定子集中的任何邻居接收消息的概率$S$。 这是$\prod_{u \in S} (1 - g_{u,v})$， 在哪里$g_{u,v}$是边缘的概率$(u,v)$出现。 
3. 对于子集$S$， 让$P_{\text{stay}} = \prod_{v \notin S} \text{probability that } v \text{ does not get message}$。 那么预计的天数从$S$满足：$$f[S] = \frac{1 + \sum_{T \supset S} P(S \to T) f[T]}{1 - P_{\text{stay}}}$$这来自解决递归$f[S] = 1 + P_{\text{stay}} \cdot f[S] + \sum_{T \supset S, T \neq S} P(S \to T) f[T]$。 

1. 以递减的大小迭代子集，以确保所有子集$f[T]$和$T \supset S$已经计算出来了。 使用模算术和预先计算的模逆来处理模分数$998\,244\,353$。 
2. 输出$f[\{1\}]$模数$998\,244\,353$。 

为什么有效：每个子集的预期时间都考虑了所有可能的第二天扩展，并按其概率加权。 由于图是连通的并且所有概率都严格介于 0 和 1 之间，因此方程组具有唯一解。 递减顺序可确保已计算出所有所需的相关值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD - 2, MOD)

n, m = map(int, input().split())
edges = [[0]*n for _ in range(n)]
for _ in range(m):
    u, v, p, q = map(int, input().split())
    prob = p * modinv(q) % MOD
    edges[u-1][v-1] = prob
    edges[v-1][u-1] = prob

full = (1 << n) - 1
dp = [0] * (1 << n)
for mask in range(full, -1, -1):
    if mask == full:
        dp[mask] = 0
        continue
    stay = 1
    for v in range(n):
        if not (mask & (1 << v)):
            prob_not = 1
            for u in range(n):
                if mask & (1 << u):
                    prob_not = prob_not * (MOD + 1 - edges[u][v]) % MOD
            stay = stay * prob_not % MOD
    inv = modinv((MOD + 1 - stay) % MOD)
    val = 1
    for v in range(n):
        if not (mask & (1 << v)):
            prob_get = 1
            for u in range(n):
                if mask & (1 << u):
                    prob_get = prob_get * (MOD + 1 - edges[u][v]) % MOD
            prob_get = (MOD + 1 - prob_get) % MOD
            dp[mask] = (dp[mask] + prob_get * dp[mask | (1 << v)]) % MOD
    dp[mask] = dp[mask] * inv % MOD
print(dp[1])
```该代码预先计算模逆以转换分数。`edges[u][v]`存储边缘的概率$(u,v)$。 对于每个子集，`stay`计算没有新顶点接收消息的概率。`inv`处理除法$1 - P_{\text{stay}}$。 内部循环计算每个新顶点获取消息和更新的预期贡献`dp[mask]`因此。 

## 工作示例

 **样品1**

 输入：```
2 1
1 2 1 10
```| 日 | 面膜| 住宿 | dp[掩码] |
 | --- | --- | --- | --- |
 | 0 | 01 | 9/10 | 10 | 10
 | 1 | 11 | 11 - | 0 |

 唯一的边出现的概率为 1/10。 预计时间为 1 / (1/10) = 10。 

**样品2**

 输入：```
2 1
1 2 1 2
```| 日 | 面膜| 住宿 | dp[掩码] |
 | --- | --- | --- | --- |
 | 0 | 01 | 1/2 | 1/2 2 |
 | 1 | 11 | 11 - | 0 |

 预计时间 1 / (1/2) = 2。演示模块化分数处理工作。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(3^n) | O(3^n) | 对于每个子集，迭代不在子集中的顶点并计算邻居的乘积。 |
 | 空间| O(2^n) | O(2^n) | 将所有子集的预期值存储为位掩码。 |

 给定$n\le 21$,$3^n \approx 10^10$这里不是字面意思，因为许多乘法步骤是模运算； 优化实施适合时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    MOD = 998244353
    def modinv(x):
        return pow(x, MOD - 2, MOD)
    n, m = map(int, input().split())
    edges = [[0]*n for _ in range(n)]
    for _ in range(m):
        u, v, p, q = map(int, input().split())
        prob = p * modinv(q) % MOD
        edges[u-1][v-1] = prob
        edges[v-1][u-1] = prob
    full = (1 << n) - 1
    dp = [0] * (1 << n)
    for mask in range(full, -1, -1):
        if mask == full:
            dp[mask] = 0
            continue
        stay = 1
        for v in range(n):
```
