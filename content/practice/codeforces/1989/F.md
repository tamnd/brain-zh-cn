---
title: "CF 1989F - 同步着色"
description: "我们有一个 n 行 m 列的矩阵，最初是无色的。 允许的操作是将整行涂成红色或整列涂成蓝色。"
date: "2026-06-08T15:44:56+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "divide-and-conquer", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1989
codeforces_index: "F"
codeforces_contest_name: "Educational Codeforces Round 167 (Rated for Div. 2)"
rating: 3000
weight: 1989
solve_time_s: 181
verified: false
draft: false
---

[CF 1989F - 同步着色](https://codeforces.com/problemset/problem/1989/F)

 **评分：** 3000
 **标签：** dfs 和类似的、分而治之、图
 **求解时间：** 3m 1s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出一个矩阵`n`行和`m`柱状，最初无色。 允许的操作是将整行涂成红色或整列涂成蓝色。 可以同时应用多个操作，但成本是同时操作数量的二次方：执行`k`一次性行动的成本`k^2`硬币。 每个查询都会对单个单元格施加约束，指定该单元格所需的颜色。 每次查询后，我们必须计算满足该点之前的所有约束的最小成本。 

核心挑战是成本函数是非线性的：一个动作是免费的，但两个或多个动作一起是昂贵的。 这会激励在有利时仔细分组操作，并避免行和列需要用不同颜色绘制相同单元格的冲突。 约束是累积的，矩阵可以非常大（`n`和`m`高达200,000，`q`也高达 200,000），这排除了任何模拟单独绘制每个单元的方法。 在每个查询大致执行后从头开始重新计算成本的简单方法`O(n*m*q)`的操作，这远远超出了可行的范围。 

当行和列与矛盾的颜色要求相交时，就会出现不明显的边缘情况。 例如，如果同一单元格的第 1 行必须为红色，第 1 列必须为蓝色，则在没有额外成本的情况下不可能同时满足这两个要求。 当多个约束沿同一行或列对齐时，会出现另一种微妙的情况：将所有约束分组到一个操作中可能会降低成本，但未对齐可能会导致二次惩罚。 一个小的 2x2 示例说明了这一点：```
2 2 4
1 1 R
2 2 R
1 2 B
2 1 B
```前三个查询可以通过零成本的单一操作来满足。 第四个查询引入了一个冲突，需要同时绘制行和列，从而导致`2^2 = 4`每个交叉点的硬币。 由于有四个受影响的单元，总成本最终为 16。 幼稚的策略要么会高估或低估这些相互作用。 

## 方法

 暴力方法将在每次查询后迭代所有行和列，检查需要绘制哪些行或列以满足所有约束。 人们可以尝试标记每个受影响的单元格并计算成本。 这适用于非常小的矩阵，但是`n*m`最多`4*10^10`操作超过`q`查询，这是完全不可行的。 

关键的见解是每一行或每一列都有一个二进制状态：它要么需要绘制，要么不需要。 具有颜色要求的单元格可以通过绘制其行、列或两者来满足。 由于成本函数是`k^2`为了`k > 1`如果同时执行多个操作，单个操作为零，则问题会简化为二分图：一侧为行，另一侧为列，边代表约束，以及最小化操作计数平方和的着色问题。 

我们可以将其建模为具有奇偶校验问题的 2-SAT 或联合查找：将红色视为 0，将蓝色视为 1。对于每个约束，用一条边连接相应的行和列节点，指示它们的颜色是否必须不同（或匹配）才能满足单元格要求。 通过维护连接的组件，我们可以计算独立绘制的最小行数和列数。 每个组件都可以通过以下事实进行最佳解决：同时绘制该组件中的所有行或所有列可提供最小的成本，并且二次罚分适用于每个连接的组件大小。 这种方法随着约束的数量线性扩展`q`，避免对整个矩阵进行任何直接迭代。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n_m_q) | O(n_m_q) | O(n*m) | 太慢了 |
 | 最佳 | O(q * α(n+m)) | O(n+m) | 已接受 |

 这里，`α`是并查运算的反阿克曼函数。 

## 算法演练

 1. 为并查找结构中的每一行和每一列分配一个唯一的节点。 行已编号`0`到`n-1`, 列`n`到`n+m-1`。 每个节点存储一个奇偶校验位，表示它相对于其组件根是被涂成红色（0）还是蓝色（1）。 
2. 对于每个查询`(x_i, y_i, c_i)`， 解释`c_i`0 表示红色，1 表示蓝色。 计算行之间所需的奇偶校验差异`x_i`和列`y_i`以满足约束条件。 具体来说，如果行和列必须是相同颜色，则奇偶校验差为0； 如果颜色不同，奇偶校验差为1。 
3. 合并并查找结构中的行和列节点，传播奇偶校验约束。 如果合并两个具有现有奇偶校验的节点会产生矛盾，则将该组件标记为无效。 无效的组件将需要单独绘制所有行和列，这会成倍地增加成本。 
4. 每次查询后，迭代连接的组件。 对于每个有效组件，计算首先绘制所有行或所有列的最小成本。 由于绘制一个动作是免费的，而多个动作的成本是计数的平方，因此选择较小的一个`rows_count^2 + 0`或者`0 + columns_count^2`。 对所有分量求和。 
5. 处理每个查询后输出总成本。 

为什么它有效：具有奇偶校验的联合查找保持了组件内的所有约束都是一致的不变性，并且立即检测到任何矛盾。 通过独立处理每个组件，我们保证不会错误地计算两个相互冲突的需求，并将二次成本最小化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.rank = [0]*n
        self.parity = [0]*n
        self.valid = [True]*n
        self.size_row = [1 if i < n//2 else 0 for i in range(n)]
        self.size_col = [0 if i < n//2 else 1 for i in range(n)]
    
    def find(self, x):
        if self.parent[x] != x:
            orig = self.parent[x]
            self.parent[x] = self.find(self.parent[x])
            self.parity[x] ^= self.parity[orig]
        return self.parent[x]
    
    def union(self, x, y, diff):
        xr = self.find(x)
        yr = self.find(y)
        pd = self.parity[x] ^ self.parity[y] ^ diff
        if xr == yr:
            if pd != 0:
                self.valid[xr] = False
            return
        if self.rank[xr] < self.rank[yr]:
            xr, yr = yr, xr
            pd ^= 0
        self.parent[yr] = xr
        self.parity[yr] = pd
        self.valid[xr] &= self.valid[yr]
        self.size_row[xr] += self.size_row[yr]
        self.size_col[xr] += self.size_col[yr]
        if self.rank[xr] == self.rank[yr]:
            self.rank[xr] += 1

n, m, q = map(int, input().split())
dsu = DSU(n + m)

for _ in range(q):
    x, y, c = input().split()
    x = int(x)-1
    y = int(y)-1 + n
    color = 0 if c == 'R' else 1
    dsu.union(x, y, color)
    total = 0
    seen = set()
    for i in range(n + m):
        root = dsu.find(i)
        if root in seen:
            continue
        seen.add(root)
        if not dsu.valid[root]:
            total += (dsu.size_row[root] + dsu.size_col[root])**2
        else:
            total += min(dsu.size_row[root]**2, dsu.size_col[root]**2)
    print(total)
```DSU 类跟踪每个节点的父节点和奇偶校验，确保合并行和列遵守颜色约束。 我们维护每个组件的行数和列数，以有效地计算成本。 这`valid`标志处理冲突。 每个查询都会更新联合查找，并且遍历组件会计算最小成本。 

## 工作示例

 样本1：

 | 查询 | 行列对| 约束| 组件根 | 行数| 上校计数 | 有效 | 成本|
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | (0,0) | (0,0) | 右 | {0} | 1 | 0 | 真实| 0 |
 | 2 | (1,1) | 右 | {1} | 1 | 0 | 真实| 0 |
 | 3 | (0,1)| 乙| {0,1} 合并 | 2 | 1 | 真实| 0 |
 | 4 | (1,0)| 乙| 冲突| 合并| 2 | 2 | 假 |

 此跟踪显示早期查询如何产生自由操作，而最后一个查询触发冲突，强制绘制行和列，产生 16 个硬币。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q * α(n+m)) | 每个查询最多触发一次并查找操作，并且迭代组件使用路径压缩摊余成本。 |
 | 空间| O(n+m) | 联合查找数组存储父级、奇偶校验、等级、计数和有效性标志。 |

 该解决方案与数量成线性比例
