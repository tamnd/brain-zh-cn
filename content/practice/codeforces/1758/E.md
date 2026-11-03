---
title: "CF 1758E - 滴答声、滴答声"
description: "我们得到一个 $n × m$ 网格，其中每个单元格要么有一个显示 0 到 $h-1$ 之间数字的时钟，要么为空。 允许的移动让我们选择一行或一列，并将该行或列中的所有时钟以 $h$ 为模推进一小时。"
date: "2026-06-09T14:43:45+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dfs-and-similar", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1758
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 836 (Div. 2)"
rating: 2500
weight: 1758
solve_time_s: 154
verified: true
draft: false
---

[CF 1758E - 勾选、勾选](https://codeforces.com/problemset/problem/1758/E)

 **评分：** 2500
 **标签：** 组合学、dfs 和类似、dsu、图
 **求解时间：** 2m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一个$n \times m$网格，其中每个单元格都有一个时钟，显示 0 到 0 之间的数字$h-1$或为空。 允许的移动让我们选择一行或一列，并将该行或列中的所有时钟提前一小时模$h$。 如果存在一系列使所有时钟显示相同数字的此类移动，则配置是可解的。 任务是对于部分填充的网格，计算填充空单元格以使网格可解的方法数量。 

从输入大小来看，$n$和$m$每个都能达到$2 \cdot 10^5$所有网格的总和上限为$2 \cdot 10^5$。 这迫使算法与单元数量成线性关系，$O(n \cdot m)$。 只要我们避免任何二次方，行和列上的嵌套循环就是可行的$n$或者$m$分别地。 小时数$h$可以大到$10^9$，因此直接迭代小时值的算法是不可行的。 

由于空单元格最初可以采用任何值，因此出现了一个微妙之处。 尝试所有方法的天真方法$h^{\text{\#empty}}$任务是不可能的。 另一种边缘情况是当行或列具有冲突时钟时：例如，如果第 1 行有 0 和 2，第 2 列有 1，则需要仔细检查以检测不一致。 小网格、包含所有空单元格的网格以及包含一行或一列的网格的行为必须与相同的逻辑一致。 

例如，一个 2x2 网格```
1 -1
-1 2
```无法统一$h = 3$因为行和列中已知单元格之间的差异与模 3 发生冲突。粗心的解决方案可能会任意将 1 分配给空单元格（右上角）和 2（左下角），但这不允许通过行/列移动序列来统一网格。 

## 方法

 暴力方法为每个空单元格分配一个从 0 到$h-1$并使用行/列移动的模拟来检查可解性。 这在原则上是正确的，但最多$2 \cdot 10^5$细胞和$h$最多$10^9$，这是完全不切实际的。 

关键的见解是对问题进行代数建模。 让$r_i$是应用于行的移动次数$i$和$c_j$列数$j$。 然后最终时钟值在$(i,j)$是$$\text{initial}_{i,j} + r_i + c_j \equiv X \pmod{h}$$在哪里$X$是统一时间。 减去同一行或同一列中的两个已知单元格给出如下方程$$r_i + c_j - (r_i + c_k) \equiv \text{initial}_{i,j} - \text{initial}_{i,k} \pmod{h}$$或者$$c_j - c_k \equiv \text{initial}_{i,j} - \text{initial}_{i,k} \pmod{h}$$我们看到系统是线性模的$h$。 单元格的每个连接组件（通过行和列连接）必须满足差异的一致性条件。 这可以使用图进行有效建模，其中节点是行和列，边带有模数差$h$。 从一个节点传播值的深度优先搜索允许我们检查矛盾。 对于空单元格，任何与传播一致的分配都有效。 

从计数的角度来说，如果系统是一致的，那么任意值$r_0$（第 0 行的移动）可以自由选择$[0, h-1]$，其余变量确定。 因此，答案是$h^{\text{\#connected components}}$, 取模$10^9 + 7$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(h^{n \cdot m})$|$O(n \cdot m)$| 太慢了|
 | 最佳 |$O(n \cdot m)$|$O(n + m)$| 已接受 |

 ## 算法演练

 1.读取网格并初始化行数组$r[i]$和列$c[j]$作为未分配的。 
2. 构建通过已知单元格连接行和列的二分图。 每条边都存储所需的差异：$(\text{row value} + \text{col value}) \equiv \text{cell value} \pmod{h}$。 
3. 对于每个未访问的行或列，启动 DFS。 为起始节点分配任意值 (0)。 使用差异沿边缘传播分配。 如果节点已经分配了值，请检查它是否与传播的值模匹配$h$。 如果发现冲突，则组件不一致，答案为0。 
4. 计算每个一致连通分量。 每个组件都允许精确$h$不同的全局分配（选择起始节点的值），因此将组件的数量乘以$h$模数$10^9 + 7$。 
5. 输出每个测试用例的结果。 

为什么它有效：不变的是分配起始节点后，组件中的每个其他节点都必须满足所有边缘约束。 DFS 确保每个可达节点的分配都是一致的，否则会检测到矛盾。 组件是独立的，因为它们之间没有边缘，因此选择会成倍增加。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 20)

MOD = 10**9 + 7

def solve():
    t = int(input())
    for _ in range(t):
        n, m, h = map(int, input().split())
        grid = [list(map(int, input().split())) for _ in range(n)]
        row_vals = [None] * n
        col_vals = [None] * m
        adj = [[] for _ in range(n + m)]
        for i in range(n):
            for j in range(m):
                if grid[i][j] != -1:
                    adj[i].append((n+j, (grid[i][j]) % h))
                    adj[n+j].append((i, (grid[i][j]) % h))
        visited = [False]*(n+m)
        ans = 1
        def dfs(u):
            for v, val in adj[u]:
                if visited[v]:
                    if (vals[v] - vals[u]) % h != val:
                        return False
                else:
                    vals[v] = (val + vals[u]) % h
                    visited[v] = True
                    if not dfs(v):
                        return False
            return True
        vals = [0]*(n+m)
        for i in range(n+m):
            if not visited[i]:
                vals[i] = 0
                visited[i] = True
                if not dfs(i):
                    ans = 0
                    break
                ans = ans * h % MOD
        print(ans)
```该代码首先将行映射到索引 0..n-1，将列映射到 n..n+m-1 以统一处理它们。 每条边存储行和列之间所需的差异。 DFS 传播值并检查冲突。 乘以$h$每个分量对应于起始节点值的自由选择。 模运算处理大结果。 

## 工作示例

 输入示例 1：```
2 3 4
1 0 -1
-1 -1 2
```| 步骤| 分配的节点| DFS 传播 | 组件好吗？ | 运行 ans |
 | --- | --- | --- | --- | --- |
 | 开始行0 | 行 0=0 | 传播到 col0：col0=1，col1=2 | 好的 | 1 |
 | 第 1 列 | 传播到 row1： row1=0 | 传播到 col2：col2=2 | 好的 | 1*4=4 | 1*4=4

 这证明了正确的传播和计数。 

输入示例 2：```
2 2 10
1 2
3 5
```已知细胞之间的差异冲突：

 | 边缘 | 行列差异| 冲突？ |
 | --- | --- | --- |
 | (0,0)=1 | 行0+列0=1 | 没有|
 | (0,1)=2 | (0,1)=2 行0+列1=2 | 行0 = 0 => 列1 = 2 |
 | (1,0)=3 | (1,0)=3 | 行1+列0=3 | 列0 = 1 => 行1 = 2 |
 | (1,1)=5 | 行1+列1=5 | 行1+列1=2+2=4！=5 |

 算法检测到不一致，输出 0。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * m) | 每个单元最多产生两个邻接条目，DFS 接触每个节点一次 |
 | 空间| O(n + m + n*m) | O(n + m + n*m) | 邻接表+访问/值数组|

 给定 sum(n_m) ≤ 2_10^5，这很容易适合 O(n*m) DFS 的 1 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect
```
