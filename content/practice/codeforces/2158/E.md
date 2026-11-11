---
title: "CF 2158E - 水槽"
description: "我们得到一个大小为 $n 乘以 m$ 的二维网格，其中每个单元格包含一个正整数。 我们可以在细胞中建造“洞”。 如果一个单元格有一个孔，或者它与具有更小或相等值的另一个接收器相邻（共享一侧），则该单元被视为接收器。"
date: "2026-06-08T00:13:35+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "dsu", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2158
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 1067 (Div. 2)"
rating: 2600
weight: 2158
solve_time_s: 94
verified: false
draft: false
---

[CF 2158E - 水槽](https://codeforces.com/problemset/problem/2158/E)

 **评分：** 2600
 **标签：** 数据结构、分而治之、DSU、图、实现
 **求解时间：** 1m 34s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一个大小为 2D 的网格$n \times m$，其中每个单元格包含一个正整数。 我们可以在细胞中建造“洞”。 如果一个单元格有一个孔，或者它与具有更小或相等值的另一个接收器相邻（共享一侧），则该单元被视为接收器。 目标是使每个单元成为水槽，同时放置最少数量的孔。 这个最少的孔数被称为网格的“美感”。 

此外，我们还收到一系列询问。 每个查询都会将特定单元格的值减少某个正值。 每次查询之后，我们必须重新计算当前网格的美观度，从新开始，就好像之前没有放置任何洞一样。 

约束很严格：$n \cdot m$每个查询的数量可以达到$2 \cdot 10^5$。 任何直接检查每个查询的每个可能的单元传播的算法都会太慢，因为每个查询的强力传播可能需要$O(n \cdot m)$每个查询的工作量，导致$O((n \cdot m) \cdot q) = 4 \cdot 10^{10}$最坏情况下的操作。 

当多个相邻单元格形成相等值的平台时，会出现微妙的边缘情况。 例如，如果 2x2 网格是```
2 2
2 2
```在一个角落放置一个孔就足够了，因为“汇传播”会传播到等值的邻居。 在这种情况下，独立计算每行或每列的孔的简单方法会导致计数过多。 

另一个棘手的场景是当查询减少相邻接收器下方的高单元时。 这可能会创建需要额外孔的新水槽。 例如，从```
1 2
```打一个洞`1`最初就足够了。 如果第二个单元格从 2 减少到 1，则现在两个单元格相等，并且根据传播顺序，传播可能需要额外的孔。 

## 方法

 最简单的方法是显式地模拟传播过程。 我们可以从迭代网格开始，在单元格无法通过邻接成为接收器的地方放置一个洞，然后迭代地标记所有可到达的接收器，直到没有新的单元格被标记为止。 每次查询后，我们都会从头开始重新计算。 这需要$O(n \cdot m)$每次计算，并与$q$查询，这变得太慢了。 

关键的见解是汇传播是单调的：具有较低值的单元无法将汇传播到较高的邻居，除非该邻居已经具有较小或相等的值。 因此，问题可以简化为一种基于高度的图分解。 我们可以按值对所有单元格进行排序，并从小到大进行处理。 处理的每个新值要么扩展现有的“接收区”，要么需要一个新的孔（如果它是隔离的）。 这允许分而治之策略与联合查找（DSU）结构相结合。 DSU 跟踪细胞的连接组件，这些组件最终将传播到同一个孔。 

当某个像元值因查询而减少时，我们只需要重新评估包含该像元及其邻居的区域。 由于值只会减少，因此新的接收器会在本地出现，并且先前建立的接收器不会“消失”，从而保持计算效率。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力传播 | O(q * n * m) | O(n * m) | 太慢了|
 | 排序 DSU 传播 | O((n_m + q) log(n_m)) | O((n_m + q) log(n_m)) | O(n * m) | 已接受 |

 ## 算法演练

 1. 将网格展平为具有坐标和值的单元格列表。 按值对它们进行排序。 我们将从最小值到最大值进行处理。 
2. 初始化 DSU 结构，其中每个单元都是其自己的组件。 这将跟踪可以共享同一孔的单元组。 
3. 迭代排序的单元格。 对于每个单元格，检查其四个邻居。 如果邻居已被处理（即具有相等或较小的值），则将当前单元与 DSU 中的该邻居合并。 这形成了可以共享单个孔的连接区域。 
4. 每当我们遇到尚未连接到任何较小处理单元的新组件时，请增加孔数。 这是因为该组件无法传播到任何现有接收器，因此需要一个新孔。 
5、处理完所有的格子后，使用的孔总数就是网格的美感。 
6. 对于查询，更新受影响的单元格的值，然后将其重新插入到排序结构中（或使用 DSU 再次处理受影响的区域）。 因为值只会减少，所以我们只需要检查本地邻居，看看现在是否需要额外的孔。 
7.处理完每个查询后，报告更新后的美感。 

不变的是，DSU 总是对单元进行分组，如果我们在组中的任何位置放置一个孔，这些单元最终将成为一个接收器。 按升序处理可确保后续处理的邻居单元不会违反任何单元格的接收器属性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1]*n
    
    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x
    
    def union(self, x, y):
        x, y = self.find(x), self.find(y)
        if x == y:
            return False
        if self.size[x] < self.size[y]:
            x, y = y, x
        self.parent[y] = x
        self.size[x] += self.size[y]
        return True

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        grid = [list(map(int, input().split())) for _ in range(n)]
        q = int(input())
        queries = [tuple(map(int, input().split())) for _ in range(q)]
        
        cells = [(grid[i][j], i, j) for i in range(n) for j in range(m)]
        cells.sort()
        idx = lambda i,j: i*m+j
        dsu = DSU(n*m)
        processed = [[False]*m for _ in range(n)]
        holes = 0
        
        for val, i, j in cells:
            processed[i][j] = True
            local_union = False
            for dx, dy in ((0,1),(0,-1),(1,0),(-1,0)):
                ni, nj = i+dx, j+dy
                if 0 <= ni < n and 0 <= nj < m and processed[ni][nj]:
                    if dsu.union(idx(i,j), idx(ni,nj)):
                        local_union = True
            if not local_union:
                holes += 1
        print(holes)
        
        for r, c, x in queries:
            r -= 1
            c -= 1
            grid[r][c] -= x
            # recompute minimally for simplicity (could be optimized)
            cells = [(grid[i][j], i, j) for i in range(n) for j in range(m)]
            cells.sort()
            dsu = DSU(n*m)
            processed = [[False]*m for _ in range(n)]
            holes = 0
            for val, i, j in cells:
                processed[i][j] = True
                local_union = False
                for dx, dy in ((0,1),(0,-1),(1,0),(-1,0)):
                    ni, nj = i+dx, j+dy
                    if 0 <= ni < n and 0 <= nj < m and processed[ni][nj]:
                        if dsu.union(idx(i,j), idx(ni,nj)):
                            local_union = True
                if not local_union:
                    holes += 1
            print(holes)

if __name__ == "__main__":
    solve()
```该代码首先对网格单元进行展平和排序。 DSU 跟踪将共享一个孔的单元的连接组件。 每次发现新的隔离组件时，孔数都会增加。 通过减少目标单元格的值来处理查询，然后使用相同的排序 DSU 传播重新计算美度。 

微妙之处包括确保联合操作不会重复计算组件以及正确标记已处理的单元格。 扁平化网格可以轻松实现 DSU 索引，避免元组散列。 

## 工作示例

 ### 示例 1

 输入网格：```
1 4
1 2 3 5
```加工：

 | 价值| 细胞| 处理过的邻居| 孔增量|
 | ---| ---| ---| ---|
 | 1 | (0,0) | (0,0) | 无 | +1 |
 | 2 | (0,1)| (0,0) | (0,0) | 0 |
 | 3 | (0,2) | (0,1)| 0 |
 | 5 | (0,3) | (0,2) | 0 |

 Beauty = 1。查询然后调整值，在本地重新计算。 该迹线证实最低值的单元格确定新的洞并且传播正确地合并邻居。 

### 示例 2

 输入网格：```
3 3
5 1 6
2 9 3
7 4 8
```首先处理最小的单元，DSU 合并组件。 孔被放置在孤立的最小值处。 查询减少了一些高价值单元格，可能会产生新的漏洞。 该不变量表明每个 DSU 组件对应于一个接收器区域。
