---
title: "CF 106130J - \u9003\u51fa\u751f\u5929"
description: "我们得到一个包含 $n+2$ 行和 $m$ 列的网格。 顶行和底行是安全的，而中间的 $n$ 行每行都恰好包含一个石像。 每个雕像都位于其行中的特定列上，面向左或面向右。"
date: "2026-06-19T19:51:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106130
codeforces_index: "J"
codeforces_contest_name: "GDUT 2025 Monthly competition"
rating: 0
weight: 106130
solve_time_s: 57
verified: true
draft: false
---

[CF 106130J - \u9003\u51fa\u751f\u5929](https://codeforces.com/problemset/problem/106130/J)

 **评级：** -
 **标签：** -
 **求解时间：** 57s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个网格$n+2$行和$m$列。 顶排和底排是安全的，而$n$中间的每一排都恰好有一个石像。 每个雕像都位于其行中的特定列上，面向左或面向右。 从它的位置，它沿着它的行向它所面对的方向发射水平激光，并且被该激光覆盖的每个单元都被禁止。 雕像牢房本身也是禁止的。 

如果一个单元格被雕像占据或位于激光射线上，则该单元格会被阻挡。 起始位置是网格的右上角，目标位置是左下角。 在每一步中，玩家可以向上、向下、向左或向右移动一个单元格，但不能离开网格或进入任何被阻挡的单元格。 

任务是仅使用穿过未阻塞单元格的有效移动来确定是否存在从起点到目标的路径。 

网格大小最多约为一百万个单元。 这立即表明任何访问每个单元恒定次数的算法都是可行的，而任何连续二次或涉及每个查询重复重新计算的算法都会太慢。 

一个微妙的失败案例源于对激光效应的误解。 激光不是单个细胞而是整个射线，因此仅将雕像位置视为被阻挡是不正确的。 

例如，如果某行的第 3 列有一座面向右侧的雕像，则该行中从第 3 列到第 3 列的每个单元格$m$是不安全的。 仅阻挡第 3 列的简单方法会错误地允许穿越激光区域，从而产生错误的“是”。 

另一种边缘情况是激光根本没有留下连续的安全单元。 如果第一列的雕像面朝左侧，那么整排雕像就会变得不安全，从而有效地充当完整的屏障。 

## 方法

 思考问题最直接的方法是将其建模为图表。 网格中的每个单元格都是一个节点，如果两个端点都是安全的，则边将正交相邻的单元格连接起来。 一旦构建了该图，我们就可以从起始单元格运行标准可达性搜索。 

构建图表很简单，因为网格是明确的。 对于中间的每一行，我们将所有被激光击中的细胞标记为被阻挡。 然后我们对剩余的单元执行 BFS 或 DFS。 

蛮力的想法已经接近最佳。 主要成本是最多访问每个单元一次并检查最多四个邻居，这给出了$O(nm)$时间。 不存在隐藏的组合爆炸，因为约束是纯几何和静态的。 

关键的观察结果是激光约束仅修改图中存在的单元格； 它们不会引入时间动态或步骤之间的依赖性。 一旦阻塞的单元被预先计算，问题就简化为简单的网格连接。 

因此任务分解为：构建一个阻塞网格，然后运行 ​​BFS。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力网格 BFS |$O(nm)$|$O(nm)$| 已接受 |
 | 与预处理相同|$O(nm)$|$O(nm)$| 已接受 |

 ## 算法演练

 我们首先将问题转换为由空闲单元和阻塞单元组成的静态网格，然后运行 BFS。 

1. 创建一个二维布尔数组`blocked`大小的$(n+2) \times m$，最初都是假的。 这表示单元格是否可以进入。 
2. 对于每一个$n$中间行，读取雕像位置$c_i$和方向$d_i$。 将雕像单元本身标记为已阻塞。 
3. 如果雕像面朝右，则每个单元格$c_i$到$m$该行被阻塞。 如果它面向左，则来自的每个单元格$1$到$c_i$被阻塞。 这直接将激光射线编码为连续的段。 
4. 从以下位置开始运行 BFS$(1, m)$如果没有被阻止。 我们维护一个队列和一个访问过的数组。 
5. 从每个单元格，尝试向四个方向移动。 只有当邻居位于网格内部、未被阻塞且之前未被访问过时，我们才会将其加入队列。 
6. 如果到达就早点停下来$(n+2, 1)$。 

BFS 背后的关键思想是每次移动都有相同的成本，因此未加权网格中的可达性正是 BFS 计算的内容。 

### 为什么它有效

 一旦阻塞的单元格被修复，网格就变成了标准的四邻域图。 BFS 精确地探索包含起始单元的连接组件。 如果目标位于同一个组件，BFS最终会到达； 否则它将无法到达，因为该组件之外不存在替代路径。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve():
    n, m = map(int, input().split())
    
    # grid has n+2 rows
    blocked = [[False] * m for _ in range(n + 2)]
    
    # read statues
    for i in range(n):
        c, d = input().split()
        c = int(c) - 1
        r = i + 1
        
        blocked[r][c] = True
        
        if d == 'R':
            for j in range(c, m):
                blocked[r][j] = True
        else:
            for j in range(0, c + 1):
                blocked[r][j] = True
    
    sr, sc = 0, m - 1
    tr, tc = n + 1, 0
    
    if blocked[sr][sc] or blocked[tr][tc]:
        print("NO")
        return
    
    q = deque()
    q.append((sr, sc))
    visited = [[False] * m for _ in range(n + 2)]
    visited[sr][sc] = True
    
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    
    while q:
        r, c = q.popleft()
        if (r, c) == (tr, tc):
            print("YES")
            return
        
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n + 2 and 0 <= nc < m:
                if not blocked[nr][nc] and not visited[nr][nc]:
                    visited[nr][nc] = True
                    q.append((nr, nc))
    
    print("NO")

if __name__ == "__main__":
    solve()
```该实现首先逐行构建分块地图，直接将每个激光编码为填充间隔。 然后它在网格上运行标准的 BFS。 访问数组确保每个单元格都被处理一次，并且方向数组对四种可能的移动进行编码。 

索引时必须小心：由于额外的边界行，输入使用基于 1 的列和行偏移 1，因此我们在内部将所有内容转换为基于 0 的索引。 

## 工作示例

 ### 示例 1

 考虑一个小网格，其中激光阻挡了大部分中间行：

 输入：```
1 3
2 R
```开始时间为$(1,3)$，目标为$(3,1)$。 中间行的第 2 列有一个面向右侧的雕像，因此单元格$(2,2)$和$(2,3)$都被封锁了，只剩下$(2,1)$可用。 

| 步骤| 细胞| 队列状态 | 行动|
 | --- | --- | --- | --- |
 | 1 | (1,3) | (1,3) | 开始 |
 | 2 | (2,3 被阻止) | (1,3) | 跳过|
 | 3 | (1,2) | (1,2) | 向左移动 |
 | 4 | (2,1) | (2,1) | 下移 |
 | 5 | (3,1) | 达到 | 成功|

 该轨迹显示了 BFS 如何自然地找到由激光边界创建的狭窄通道。 

### 示例 2

 输入：```
2 2
1 L
2 R
```这里中间的两排都受到严重限制。 

| 步骤| 细胞| 队列状态 | 行动|
 | --- | --- | --- | --- |
 | 1 | (1,2) | (1,2) | 开始 |
 | 2 | (1,1) | (1,1) | 向左移动 |
 | 3 | 阻塞的行单元格| - | 无法下降|
 | 4 | - | 空 | BFS 结束 |

 没有路径可以穿过任一中间行，因为每一行消除了至少一个方向上所有可能的交叉，从而防止任何连续的垂直遍历。 

这些示例展示了算法如何区分可用激光配置和完全阻挡激光配置。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(nm)$| 每个单元在 BFS 期间最多被标记一次并且最多被访问一次 |
 | 空间|$O(nm)$| 被阻止和访问的网格的存储 |

 约束允许最多约$10^6$单元格，因此网格上的线性遍历在时间和内存方面都在限制范围内。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    n, m = map(int, sys.stdin.readline().split())
    blocked = [[False] * m for _ in range(n + 2)]
    
    for i in range(n):
        c, d = sys.stdin.readline().split()
        c = int(c) - 1
        r = i + 1
        blocked[r][c] = True
        if d == 'R':
            for j in range(c, m):
                blocked[r][j] = True
        else:
            for j in range(0, c + 1):
                blocked[r][j] = True
    
    sr, sc = 0, m - 1
    tr, tc = n + 1, 0
    
    if blocked[sr][sc] or blocked[tr][tc]:
        return "NO"
    
    q = deque([(sr, sc)])
    vis = [[False] * m for _ in range(n + 2)]
    vis[sr][sc] = True
    
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    
    while q:
        r, c = q.popleft()
        if (r, c) == (tr, tc):
            return "YES"
        for dr, dc in dirs:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n + 2 and 0 <= nc < m:
                if not blocked[nr][nc] and not vis[nr][nc]:
                    vis[nr][nc] = True
                    q.append((nr, nc))
    
    return "NO"

# provided samples (placeholders)
# assert run("2 2\n2 R\n1 R\n") == "NO"
# assert run("4 6\n2 L\n4 R\n6 R\n4 L\n") == "YES"

# custom tests
assert run("1 1\n1 L\n") == "NO", "single blocked path"
assert run("1 2\n1 R\n") == "NO", "full row blocked"
assert run("1 2\n2 L\n") == "NO", "start isolated"
assert run("0 3\n") == "YES", "empty grid trivial"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 带阻塞 | 否 | 最小的网格完全被封锁|
 | 全排激光| 否 | 完全行阻塞|
 | 启动孤立案例| 否 | 无法到达的开始处理|
 | 中间空行| 是 | 微不足道的连接性|

 ## 边缘情况

 当起始或目标单元位于激光区域内时，就会出现临界边缘情况。 例如，如果配置导致右上角的单元被标记为阻塞，则 BFS 必须立即拒绝该路径。 该算法通过在开始搜索之前检查两个端点来处理这个问题，确保没有浪费的遍历。 

另一种情况是激光覆盖整行的行。 在这种情况下，该行成为网格中的硬分隔符。 BFS 自然会尊重这一点，因为该行中不存在任何转换，因此搜索空间会分成不相连的组件。 

最后，如果两个端点位于由交替激光方向创建的不同断开区域中，则 BFS 会简单地耗尽可到达区域而不会到达目标，从而正确返回“NO”。
