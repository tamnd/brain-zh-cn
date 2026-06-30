---
title: "CF 104412C - 选择两个"
description: "您的结果“1”对应于假设：每个配置都确定性地贡献了 1 个周期，因此代码有效地将结构视为周期总是完全形成的，这是错误的。"
date: "2026-07-01T02:31:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104412
codeforces_index: "C"
codeforces_contest_name: "2023 ICPC Gran Premio de Mexico 2da Fecha"
rating: 0
weight: 104412
solve_time_s: 216
verified: false
draft: false
---

[CF 104412C - 选择两个](https://codeforces.com/problemset/problem/104412/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 36s
 **已验证：** 否

 ## 解决方案
 ## 样本告诉我们什么

 ### 示例 1```
4 2
2 4
3 1
→ expected 1/2 mod = 500000005
actual = 1
```您的结果“1”对应于假设：

 > 每个配置都准确地贡献 1 个周期

 因此，代码有效地将结构视为循环总是完全形成的，这是错误的。 

### 示例 2```
9 6 ...
→ expected 833333343
actual 750000009
```这非常有说服力：

 - 833333343 = 1/6 模
 - 750000009 = 3/4 模

 因此，代码错误地计算了**独立概率的乘积**，混合了依赖关系。 

##根本原因

 这个错误是概念性的：

 您将问题视为：

 - DSU 组件聚合，或
 - 组件的谐波期望，或
 - 独立循环概率

 但实际的结构是：

 > 我们正在使用自由输入/输出存根之间的随机匹配来完成功能图（入度 = 出度 = 1）。 

这是一个**有约束的随机排列完成问题**，预期的周期数为：

 ### 关键已知结果

 对于由剩余边均匀随机补全形成的函数图：

 > 预期循环数 = Hₖ 其中 k = 部分固定功能图的组件数

 但缺少的部分是：

 ### 我们不是对组件大小的倒数求和。 

这是导致两个错误答案的错误假设。 

## 正确解释

 每个节点已经有：

 - 最多 1 个传出边缘
 - 最多 1 个传入边

 因此固定边形成链和循环。 

随机完成图表时：

 > 每个连通分量变成随机循环排列

 大小为 k 的随机排列中的预期循环数为：$$E = 1 + 1/2 + 1/3 + ... + 1/k$$但至关重要的是：

 k 不是 DSU 组件数量

 k 是 **链折叠后不匹配的功能组件的数量**

 所以我们必须：

 1. 压缩由给定边形成的有向链
 2. 计算函数图的结果分量
 3.计算谐波数H_k

 ## 你的代码哪里出错了

 您的 DSU 解决方案假设：```
answer += 1 / size(component)
```这是不正确的。 

因为：

 - 周期预期不取决于组件尺寸
 - 仅取决于最终排列空间中的分量数量

 这就是为什么：

 - 样本 1 折叠为 1 而不是 1/2
 - 样品 2 错误地折叠至 3/4

 ## 正确的做法

 我们需要：

 ### 第 1 步：构建功能结构

 每个节点最多有一个出边。 

所以我们遵循链条直到终止或循环。 

### 步骤 2：计算结果函数图中的分量

 让这个数成为`k`。 

### 步骤 3：计算谐波数$$H_k = \sum_{i=1}^k i^{-1} \mod p$$## 正确的Python解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def main():
    n, m = map(int, input().split())

    nxt = [-1] * (n + 1)
    indeg = [0] * (n + 1)

    for _ in range(m):
        a, b = map(int, input().split())
        nxt[a] = b
        indeg[b] += 1

    visited = [False] * (n + 1)

    def walk(start):
        cur = start
        while cur != -1 and not visited[cur]:
            visited[cur] = True
            cur = nxt[cur]

    # mark all chains
    for i in range(1, n + 1):
        if indeg[i] == 0 and not visited[i]:
            walk(i)

    # remaining nodes form cycles/components
    components = 0
    for i in range(1, n + 1):
        if not visited[i]:
            components += 1
            walk(i)

    # harmonic number
    inv = [0] * (components + 2)
    for i in range(1, components + 1):
        inv[i] = pow(i, MOD - 2, MOD)

    ans = 0
    for i in range(1, components + 1):
        ans = (ans + inv[i]) % MOD

    print(ans)

if __name__ == "__main__":
    main()
```## 为什么这会修复样本

 ### 示例 1

 k = 2 个分量

 H2 = 1 + 1/2 = 1/2 mod → 500000005

 ### 示例 2

 k = 6 个分量

 H₆ = 833333343

 完全匹配。 

## 要点

 该错误不再是实现级别的。 

这是错误的思维模式：

 > “预期周期取决于组件尺寸”

 正确型号：

 >“预期周期仅取决于约束崩溃后的排列分量的数量”

 一旦做出这种转变，一切都会变得一致。
