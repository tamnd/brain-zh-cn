---
title: "CF 105079H - 包装纸杯蛋糕"
description: "我们正在 $N × M$ 网格上模拟一个动态过程，该网格开始为空，然后逐渐填充到一个单元格中。 每个传入操作都会将三种口味之一的纸杯蛋糕放入特定的空单元格中。"
date: "2026-06-27T22:50:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105079
codeforces_index: "H"
codeforces_contest_name: "UTPC x WiCS Contest 04-05-23 (UT Internal)"
rating: 0
weight: 105079
solve_time_s: 88
verified: false
draft: false
---

[CF 105079H - 包装纸杯蛋糕](https://codeforces.com/problemset/problem/105079/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 28s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在模拟一个动态过程$N \times M$网格开始是空的，然后逐渐被逐个单元填充。 每个传入操作都会将三种口味之一的纸杯蛋糕放入特定的空单元格中。 每次放置后，我们必须报告所有当前放置的纸杯蛋糕中存在多少个连接组件，其中连接是正交定义的：如果单元共享一侧，则它们是连接的，并且区域是相同口味的最大连接集。 

关键是各地区对风味敏感。 仅当两个相邻单元包含相同风味并通过一系列相同风味邻接链连接时，它们才会对同一区域做出贡献。 这意味着每种颜色都会产生自己的演变图，但我们需要提供所有颜色组合中连接组件的总数。 

限制因素$N, M \le 300$意味着最多 90,000 个插入。 每次插入后从头开始重新计算连接组件的解决方案将需要每步多达 90,000 个单元的洪水填充或 DFS，从而导致大约$O((NM)^2)$，这远远超出了可行的限度。 即使每次更新只有一个 DFS 也已经处于临界状态； 做它$NM$时代使它变得不可能。 

操作是在线的，因此我们必须动态地保持连接。 

一些微妙的情况很重要。 

首先，插入到没有被占用邻居的单元格中会创建一个新区域，因此计数会增加 1。 

其次，在一个或多个相同颜色的单元格旁边插入可以合并区域。 例如，如果一个新单元连接两个先前独立的草莓区域，则区域总数会减少 1 个，而不是 2 个，因为这些区域变成了 1 个。 

第三，不同颜色的相邻关系根本不相互作用； 蓝色邻居不会影响草莓连接。 

一个说明合并的小例子：

 输入网格更新（概念性）：

 步骤1：将S放置在(1,1)→1区域

 步骤2：将S放置在(1,2)→静止1区域

 步骤3：将S放置在(2,1)→静止1区域

 步骤4：将S放置在(2,2)→静止1区域

 现在考虑不同的顺序：

 步骤 1：S 位于 (1,1) → 1

 步骤 2：S 位于 (1,3) → 2

 步骤 3：S at (1,2) → 合并两个区域 → 1

 一种仅检查“是否触及相同颜色”而不考虑这些邻居是否已经属于不同组件的简单方法会导致计数过高。 

因此，该问题是仅具有插入的网格上的经典动态连接维护问题。 

## 方法

 强力方法维护整个网格，并在每次插入后使用 DFS 或 BFS 重新计算连接的组件。 每次之后$NM$更新时，我们将扫描所有单元格并淹没每个未访问的占用单元格。 每个洪水填充最多访问每个单元一次，因此一次重新计算成本$O(NM)$。 重复此操作$NM$操作给出$O((NM)^2)$，这大约是$8 \times 10^9$在最坏的情况下访问时$N=M=300$。 这太慢了。 

关键的观察结果是连接性仅在插入的单元格处发生局部变化。 每个新细胞只能与最多四个邻居相互作用。 如果我们能够快速确定这些邻居是否属于同一组件或不同组件，我们就可以在每次操作的恒定或接近恒定的时间内更新区域的数量。 

这正是图上的动态连接问题，其中边仅随着时间的推移而添加。 每个单元格都是一个节点，相同风格的相邻单元格之间存在边。 我们需要在边缘插入下维护连接的组件。 

不相交集并集 (DSU)，也称为并查集，非常适合于此。 每次放置一个单元格时，我们都会创建一个新节点（最初是它自己的组件）。 然后我们尝试将其与其已占用的相同风格的邻居结合起来。 如果两个节点已位于同一集合中，则不会发生任何更改。 如果它们位于不同的集合中，合并会将区域数量减少 1。 

微妙但关键的一点是多个邻居可能属于同一个组件。 我们必须避免对同一区域进行多次减去。 DSU 自然会处理此问题，因为同一集合内的重复并集将被忽略。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解（每一步重新计算 DFS）|$O((NM)^2)$|$O(NM)$| 太慢了 |
 | DSU 增量合并 |$O(NM \cdot \alpha(NM))$|$O(NM)$| 已接受 |

 ## 算法演练

 我们将每个网格单元视为由唯一整数索引的节点$id = i \cdot M + j$。 

1. 为所有初始化一个DSU结构$N \times M$可能的节点。 维护一个占用数组最初全为 false。 还维护一个运行变量`regions = 0`。 
2. 为每个传入操作放置风味$f$在细胞处$(i, j)$，将单元格标记为已占用并设置`regions += 1`。 这反映了一个新的孤立地区诞生的事实。 
3. 对于 的四个邻居中的每一个$(i, j)$，检查邻居是否在网格内并且已经被占用。 
4. 如果邻居已被占用并且具有相同的风格，则尝试将当前单元与 DSU 中的邻居合并。 如果联合成功（意味着它们之前位于不同的组件中），则递减`regions`1. 这捕获了两个先前独立区域的合并。 
5、输出`regions`处理完当前操作后。 

步骤 4 背后的微妙推理是，DSU 不会直接告诉我们两个单元是否属于不同区域，除非我们比较它们的根。 成功的联合意味着两个组件正在合并，从而将总数减少一。 

### 为什么它有效

 不变量是，处理完每个操作后，同色占用单元的每个连通分量完全对应于一个 DSU 集，并且`regions`等于此类集合的数量。 最初两者都为零。 每次插入都会添加一个单例集，增加`regions`一个。 每次我们通过有效邻接合并两个不同的集合时，我们都会将两个先前独立的区域恰好合并为一个，从而将计数减一。 没有其他操作会改变连接。 由于 DSU 永远不会错误地合并已连接的节点，因此计数与连接组件的真实数量保持一致。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        ra, rb = self.find(a), self.find(b)
        if ra == rb:
            return False
        if self.size[ra] < self.size[rb]:
            ra, rb = rb, ra
        self.parent[rb] = ra
        self.size[ra] += self.size[rb]
        return True

def solve():
    N, M = map(int, input().split())
    total = N * M

    dsu = DSU(total)
    occupied = [False] * total
    color = [''] * total

    regions = 0

    def id_of(i, j):
        return i * M + j

    for _ in range(N * M):
        i, j, f = input().split()
        i = int(i) - 1
        j = int(j) - 1
        idx = id_of(i, j)

        occupied[idx] = True
        color[idx] = f

        regions += 1

        for di, dj in ((1, 0), (-1, 0), (0, 1), (0, -1)):
            ni, nj = i + di, j + dj
            if 0 <= ni < N and 0 <= nj < M:
                nidx = id_of(ni, nj)
                if occupied[nidx] and color[nidx] == f:
                    if dsu.union(idx, nidx):
                        regions -= 1

        print(regions)

if __name__ == "__main__":
    solve()
```DSU 通过路径压缩将单元之间的连接保持为父指针林。 这`union`函数返回一个布尔值，指示合并是否实际发生，这对于正确更新区域计数至关重要。 

我们还将每个单元格的风味存储在一个数组中，因此我们只合并相同颜色的邻居。 如果没有此检查，不同的风格将错误地合并到单个区域中，从而违反定义。 

网格到索引的映射确保我们可以将 2D 网格视为平面 DSU 结构。 

## 工作示例

 ### 示例 1

 考虑一个 2 x 2 网格，所有位置都是草莓 S：

 | 步骤| 细胞| 行动| 联盟合并| 地区 |
 | --- | --- | --- | --- | --- |
 | 1 | (1,1) S | 新组件 | 0 | 1 |
 | 2 | (1,2) S | 与左 | 合并 1 合并 | 1 |
 | 3 | (2,1) S | 与向上合并 | 1 合并 | 1 |
 | 4 | (2,2) S | 合并两个邻居，但只有一个新的合并很重要 | 1 合并 | 1 |

 关键的观察结果是最后一个插入涉及两个邻居，但这些邻居已经属于同一 DSU 集，因此只有一个并集成功。 

这证实了 DSU 可以防止重复计算合并。 

### 示例 2

 混合颜色的序列：

 | 步骤| 细胞| 风味 | 邻里互动| 地区 |
 | --- | --- | --- | --- | --- |
 | 1 | (1,1) | S | 无 | 1 |
 | 2 | (1,3) | 普 | 无 | 2 |
 | 3 | (1,2) | S | 仅与 (1,1) 合并 | 2 |
 | 4 | (2,3) | 普 | 仅与 (1,3) 合并 | 2 |
 | 5 | (2,2) | 乙| 无 | 3 |
 | 6 | (2,1) | 乙| 与 (2,2) | 新合并 3 |

 这表明颜色分离是严格执行的，并且联合只发生在相同的口味中。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(NM \cdot \alpha(NM))$| 每个单元都被处理一次，并且由于路径压缩，每个并/查找几乎是恒定的 |
 | 空间|$O(NM)$| DSU 阵列和网格元数据为每个单元存储一个条目 |

 操作总数最多为 90,000 次，每次操作最多涉及 4 次 DSU 检查。 这完全符合时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    from math import prod

    # inline solution for testing
    class DSU:
        def __init__(self, n):
            self.p = list(range(n))
            self.s = [1]*n
        def f(self,x):
            while self.p[x]!=x:
                self.p[x]=self.p[self.p[x]]
                x=self.p[x]
            return x
        def u(self,a,b):
            a,b=self.f(a),self.f(b)
            if a==b:
                return False
            if self.s[a]<self.s[b]:
                a,b=b,a
            self.p[b]=a
            self.s[a]+=self.s[b]
            return True

    N,M=map(int,input().split())
    dsu=DSU(N*M)
    occ=[False]*(N*M)
    col=['']*(N*M)
    def idd(i,j): return i*M+j

    res=[]
    regions=0
    for _ in range(N*M):
        i,j,f=input().split()
        i=int(i)-1;j=int(j)-1
        idx=idd(i,j)
        occ[idx]=True
        col[idx]=f
        regions+=1
        for di,dj in ((1,0),(-1,0),(0,1),(0,-1)):
            ni,nj=i+di,j+dj
            if 0<=ni<N and 0<=nj<M:
                nidx=idd(ni,nj)
                if occ[nidx] and col[nidx]==f:
                    if dsu.u(idx,nidx):
                        regions-=1
        res.append(str(regions))
    return "\n".join(res)

# provided samples
assert run("""2 2
1 1 P
1 2 P
2 2 P
2 1 P
""") == "1\n1\n1\n1"

# custom cases
assert run("""1 1
1 1 S
""") == "1", "single cell"

assert run("""1 3
1 1 S
1 3 S
1 2 S
""") == "1\n2\n1", "merge two components"

assert run("""2 2
1 1 S
1 2 P
2 1 P
2 2 S
""") == "1\n2\n3\n4", "all different colors"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1x1 单 | 1 | 基本情况|
 | 行合并| 1 2 1 | 1 2 1 DSU 合并行为 |
 | 棋盘| 增加组件| 颜色隔离|

 ## 边缘情况

 当新单元接触已通过其他路径连接的多个邻居时，就会出现临界边缘情况。 例如，放置与两个相同颜色的邻居相邻的单元格，但这些邻居已位于同一 DSU 集中。 DSU 可防止双重递减，因为只有一个联合成功。 输入：```
2 2
1 1 S
1 2 S
2 1 S
2 2 S
```处理(2,2)时，它触及三个S邻居，但只发生一次DSU合并，因为所有邻居共享相同的根。 该算法正确地保持区域计数不变。 

这证实了该方法可以安全地处理冗余邻接，而不会过度计数合并。
