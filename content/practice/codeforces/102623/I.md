---
title: "CF 102623I - 不朽之树"
description: "我们需要对满足两种限制的顶点 1..n 上的标记树进行计数。 某些顶点对被迫通过边连接。 其他限制限制特定顶点从上方或下方的最终度数。"
date: "2026-08-04T17:12:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102623
codeforces_index: "I"
codeforces_contest_name: "2020 Lenovo Cup USST Campus Online Invitational Contest"
rating: 0
weight: 102623
solve_time_s: 82
verified: true
draft: false
---

[CF 102623I - 不朽之树](https://codeforces.com/problemset/problem/102623/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要计算顶点上标记的树`1..n`满足两种限制。 某些顶点对被迫通过边连接。 其他限制限制特定顶点从上方或下方的最终度数。 

答案不是要求我们建造一棵树。 我们需要计算代表有效树的每个可能的邻接矩阵，模`998244353`。 

小值`n <= 60`排除任何枚举树或边的方法。 标记树的数量为`n^(n-2)`根据凯莱公式，这对于`n = 60`。 我们需要一个多项式解。 

关键的观察结果是，在每个有效情况下，强制边缘都会形成森林。 如果它们包含一个循环，则没有一棵树可以包含所有它们。 在承包了这个森林的每个连接组件之后，剩下的选择只是将这些组件连接成一棵树。 

一个微妙的一点是，度数限制适用于原始顶点，而不是收缩的组件。 顶点已经具有由强制边贡献的一定程度，并且只有其剩余程度可以由组件之间的边提供。 

## 方法

 强力解决方案可以使用 Prüfer 序列生成所有标记树。 一棵树对应一个长度的序列`n-2`，因此我们可以枚举每个序列，重建树，并检查所有约束。 这是正确的，因为每个带标签的树都只出现一次。 然而，有`n^(n-2)`序列，即使对于中等程度的人来说也是不可能的`n`。 

有用的结构来自收缩强制边。 假设强制森林有`c`连接的组件。 任何有效的最终树都是通过精确相加获得的`c-1`这些组件之间的边缘。 收缩后，每对组件都可以连接，并且在组件内选择一个端点会影响该端点的度数。 

对于一个组件`C`， 让```
S_C = sum(x_v)
```在所有顶点上`v`在里面。 加权凯莱公式表示，树在收缩分量上的生成函数为```
(S_1 + S_2 + ... + S_c)^(c-2) * S_1 * S_2 * ... * S_c
```其中的指数`x_v`表示有多少条新边离开顶点`v`。 

剩下的任务是仅提取约束允许的度数。 因为`n`只有 60，对可能的总外部度进行动态规划就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力普吕弗枚举| O(n^(n-2) * n) | O(n^(n-2) * n) | O(n) | 太慢了|
 | 承包林+发电函数DP | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 使用DSU检查强制边是否形成森林。 如果一条边连接两个已连接的顶点，则答案为零，因为每棵树都是非循环的。 
2. 对于每个顶点，计算其在强制森林内的度数。 这是最终学位已经确定的部分。 
3. 将每个度数约束转换为入射到顶点的附加边数的范围。 如果顶点已经具有强制度数`d`，那么它的额外度数必须满足：```
lower - d <= extra_degree <= upper - d
```4. 将强制森林承包为组件。 如果只有一个分量，则最终树的所有边都已固定，因此如果所有度数约束都匹配，则答案为 1。 
5. 对于每个组件，计算一个多项式，描述其顶点可以通过多少种方式接收给定的外部边总数。 对于可以接收的顶点`t`外部边缘，其贡献为：```
x^t / t!
```将这些多项式在组件内相乘即可得到组件多项式。 
6. 组合所有组件。 一个组件在收缩树中必须至少有一个出边，因此它的总外部度为`g >= 1`。 凯莱公式贡献：```
(c-2)! * g
```用于选择组件贡献。 
7. 将背包放在组件上，使总外度等于`2(c-1)`，因为一棵树`c`签约节点有`c-1`边，并且每个这样的边贡献两个度数。 

### 为什么它有效

 强制边定义了一个固定森林。 每个有效的树都唯一对应于收缩组件之间的树以及其中原始顶点是新边的端点的选择。 

生成函数精确地对这些端点选择进行编码。 单项式的系数给出了在顶点之间分配外部度数的方法数。 凯莱公式给出了将组件与这些组件度连接起来的方式数量。 由于 DP 对所有可能的有效度分配求和，因此每棵有效树都被计数一次，并且排除无效树。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve():
    n, m, k = map(int, input().split())

    parent = list(range(n))
    size = [1] * n

    def find(x):
        while parent[x] != x:
            parent[x] = parent[parent[x]]
            x = parent[x]
        return x

    def union(a, b):
        a = find(a)
        b = find(b)
        if a == b:
            return False
        if size[a] < size[b]:
            a, b = b, a
        parent[b] = a
        size[a] += size[b]
        return True

    forced_deg = [0] * n

    ok = True
    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        forced_deg[a] += 1
        forced_deg[b] += 1
        if not union(a, b):
            ok = False

    low = [1] * n
    high = [n - 1] * n

    for _ in range(k):
        op, x, d = map(int, input().split())
        x -= 1
        if op == 0:
            low[x] = max(low[x], d)
        else:
            high[x] = min(high[x], d)

    if not ok:
        print(0)
        return

    for i in range(n):
        low[i] -= forced_deg[i]
        high[i] -= forced_deg[i]
        if high[i] < 0:
            print(0)
            return
        low[i] = max(low[i], 0)

    roots = {}
    comp_id = []
    for i in range(n):
        r = find(i)
        if r not in roots:
            roots[r] = len(roots)
        comp_id.append(roots[r])

    c = len(roots)

    if c == 1:
        ans = 1
        for i in range(n):
            if not (low[i] <= 0 <= high[i]):
                ans = 0
        print(ans)
        return

    fact = [1] * (n + 5)
    invfact = [1] * (n + 5)
    for i in range(1, n + 5):
        fact[i] = fact[i-1] * i % MOD
    invfact[-1] = pow(fact[-1], MOD - 2, MOD)
    for i in range(n + 4, 0, -1):
        invfact[i-1] = invfact[i] * i % MOD

    comps = [[] for _ in range(c)]
    for i in range(n):
        comps[comp_id[i]].append(i)

    polys = []

    for comp in comps:
        poly = [1]
        for v in comp:
            nxt = [0] * (len(poly) + n)
            for i, a in enumerate(poly):
                if a:
                    for d in range(low[v], high[v] + 1):
                        nxt[i + d] = (nxt[i + d] + a * invfact[d]) % MOD
            poly = nxt

        val = [0] * len(poly)
        for i in range(1, len(poly)):
            val[i] = poly[i] * i % MOD
        polys.append(val)

    dp = [0] * (2 * c)
    dp[0] = 1

    for poly in polys:
        ndp = [0] * (2 * c)
        for i in range(len(dp)):
            if dp[i]:
                for j in range(1, len(poly)):
                    if i + j < len(ndp):
                        ndp[i + j] = (ndp[i + j] + dp[i] * poly[j]) % MOD
        dp = ndp

    ans = dp[2 * c - 2] * fact[c - 2] % MOD
    print(ans)

if __name__ == "__main__":
    solve()
```DSU 部分处理强制林。 同一组件内的重复连接立即证明是不可能的，因为树不能包含循环。 

度数变换是最容易出错的部分。 这些限制描述了最终的度数，但生成函数仅计算新添加的边。 减去已经固定的森林度，将问题精确地转化为多项式所表示的量。 

阶乘逆数的出现是因为多项式展开的系数包含除以所选指数的阶乘的结果。 随后乘以分量度即可恢复收缩树的凯莱贡献。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^3) | O(n^3) | 多项式合并占主导地位，最多 60 个顶点，度数范围 60 |
 | 空间| O(n^2) | O(n^2) | DP 数组仅存储度分布 |

 最大度范围很小，因为每棵树只有`n-1`边缘。 和`n = 60`，立方界很容易在极限之内。
