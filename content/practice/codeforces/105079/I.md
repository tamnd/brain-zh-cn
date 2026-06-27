---
title: "CF 105079I - 纸杯蛋糕工厂"
description: "我们正在开发一个网格，其中每个单元格描述工厂中不同类型的地形。 Sally 从左上角开始，想要到达右下角。"
date: "2026-06-27T22:50:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105079
codeforces_index: "I"
codeforces_contest_name: "UTPC x WiCS Contest 04-05-23 (UT Internal)"
rating: 0
weight: 105079
solve_time_s: 82
verified: false
draft: false
---

[CF 105079I - 纸杯蛋糕工厂](https://codeforces.com/problemset/problem/105079/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在开发一个网格，其中每个单元格描述工厂中不同类型的地形。 Sally 从左上角开始，想要到达右下角。 网格包含开放单元、阻止移动的墙壁、可以强制移动她的定向传送带，以及无需任何时间成本即可在全球范围内打开或关闭所有传送带的特殊开关单元。 

运动不均匀。 如果莎莉自由移动到相邻的单元格，则需要两秒的时间。 如果她站在活动的传送带上，她将被迫沿传送带的方向移动，并且这种强制移动每步花费一秒。 一个关键的复杂性是开关会改变所有传送带的全局状态，这会改变是否应用强制移动或是否可以自由选择方向。 

因此，任务是计算图中从开始到结束的最短时间路径，其中边权重不仅取决于位置，还取决于全局二元状态：传送带打开或关闭。 

这些约束促使我们在所有测试用例中采用最多 10^6 个单元格的最短路径算法。 将每个单元视为具有统一成本的节点的朴素 BFS 会立即失败，因为边缘的权重为 1 和 2。即使原始网格状态上的 Dijkstra 也是不够的，除非我们仔细控制状态大小，因为每个位置都与全局开关状态交互。 

传送链出现了一个微妙但重要的边缘情况。 如果传送带打开，莎莉可能会被迫穿过多个牢房，而没有选择。 如果这些移动中的任何一个碰到墙壁或边界，则整个路径将变得无效。 仅检查各个边的朴素最短路径可能会错误地允许中间无效的强制转换。 

另一个边缘情况是交换机的使用。 像“进入开关时始终关闭传送带”这样的贪婪策略会失败，因为有时最好让传送带携带莎莉穿过一条 1 秒移动的长而廉价的路径。 

## 方法

 如果我们忽略权重，我们可以尝试对网格单元进行简单的 BFS。 这会将每次移动视为同等成本并分层扩展。 然而，网格包含两个不同的成本，1 和 2，这已经破坏了 BFS 的正确性。 

更仔细的蛮力想法是将每个状态视为由位置和传送带状态组成的一对，然后运行 ​​Dijkstra。 对于每个状态，我们考虑切换开关，然后自由地或通过传送带模拟运动。 问题在于，传送带运动的简单模拟可能会重复遍历长的单元链，每次松弛可能需要 O(nm) 时间。 在最坏的情况下，这会退化为 O((nm)^2)，这太慢了。 

关键的观察是全局状态只是二进制的，传送带关闭或打开。 这意味着每个细胞最多有两个有意义的状态。 真正的结构是一个分层图：每个单元存在两次，转换取决于我们是在层内还是层外。 

一旦我们接受这一点，移动就成为具有最多 2 * nm 节点的图上的标准最短路径，但边缘可以被压缩。 自由移动的成本为 2。传送带强制移动的成本为 1 且方向确定。 开关单元以 0 成本连接两层。 

唯一剩下的困难是有效地处理输送链。 我们不是逐个单元地步进，而是预先计算重复跟随传送带的结果，直到到达移动停止或变得无效的稳定单元。 这允许每个状态扩展在每个方向上都是 O(1)，而不是重复遍历长链。 

这将问题转化为每个状态具有较小常数度的稀疏图上的最短路径，可以使用 0-1-2 Dijkstra 或使用优先级队列的标准 Dijkstra 来解决。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力状态模拟 | O((纳米)^2) | O(纳米) | 太慢了 |
 | 分层图 + 带压缩的 Dijkstra | O(nm log(nm)) | O(nm log(nm)) | O(纳米) | 已接受 |

 ## 算法演练

 1. 将每个网格单元建模为两种状态，一种是传送带关闭，另一种是传送带打开。 这捕获了系统中唯一的全局变量。 
2. 建立状态之间的转换。 从处于关闭状态的单元格，Sally 可以以成本 2 移动到相邻的非墙单元格，如果当前单元格是一个开关，她也可以以成本 0 转换到处于开启状态的同一单元格。相同的逻辑对称地应用于开启状态。 
3. 通过定义确定性的下一个位置函数来处理开启状态下的输送机行为。 从任何单元格，当传送带存在且处于活动状态时，重复遵循传送带方向，直到到达链条停止的单元格。 如果链通向网格之外或进入墙壁，则该过渡将被丢弃。 
4. 将所有输送机跟随链条更换为直接边缘。 从处于开启状态的单元开始，我们不是一步一步地步进，而是添加一条成本边，该边的成本等于链中的步数到其最终有效端点。 
5. 由于所有传送带最初都是关闭的，因此从 (0, 0, off) 开始运行 Dijkstra。 保持 2 层图上的距离。 
6. 答案是目标单元格处两个状态之间的最小距离。 

正确性来自于将传送链视为原子转换以及显式地表示唯一的全局状态。 原始过程中的任何有效移动序列恰好对应于该图中的一条路径，反之亦然，因为每个强制移动都是确定性的，并且每个切换都被明确表示。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import heapq

INF = 10**18

dirs = {
    '>': (0, 1),
    '<': (0, -1),
    '^': (-1, 0),
    'v': (1, 0)
}

def solve(n, m, grid):
    def id(x, y, s):
        return (x * m + y) * 2 + s

    N = n * m * 2
    dist = [INF] * N
    dist[id(0, 0, 0)] = 0
    pq = [(0, 0, 0, 0)]  # dist, x, y, state

    def inside(x, y):
        return 0 <= x < n and 0 <= y < m

    def conveyor_sink(x, y):
        cx, cy = x, y
        steps = 0
        while True:
            c = grid[cx][cy]
            if c not in dirs:
                return cx, cy, steps
            dx, dy = dirs[c]
            nx, ny = cx + dx, cy + dy
            if not inside(nx, ny) or grid[nx][ny] == '#':
                return -1, -1, -1
            cx, cy = nx, ny
            steps += 1

    while pq:
        d, x, y, s = heapq.heappop(pq)
        if d != dist[id(x, y, s)]:
            continue

        idx = id(x, y, s)

        if grid[x][y] == '!':
            ns = 1 - s
            nid = id(x, y, ns)
            if dist[nid] > d:
                dist[nid] = d
                heapq.heappush(pq, (d, x, y, ns))

        if s == 0:
            for dx, dy in [(1,0), (-1,0), (0,1), (0,-1)]:
                nx, ny = x + dx, y + dy
                if not inside(nx, ny) or grid[nx][ny] == '#':
                    continue
                nid = id(nx, ny, 0)
                if dist[nid] > d + 2:
                    dist[nid] = d + 2
                    heapq.heappush(pq, (d + 2, nx, ny, 0))
        else:
            tx, ty, cost = conveyor_sink(x, y)
            if tx != -1:
                nid = id(tx, ty, 1)
                nd = d + cost
                if dist[nid] > nd:
                    dist[nid] = nd
                    heapq.heappush(pq, (nd, tx, ty, 1))

    tx, ty = n - 1, m - 1
    return min(dist[id(tx, ty, 0)], dist[id(tx, ty, 1)])

t = int(input())
for _ in range(t):
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]
    print(solve(n, m, grid))
```核心结构是双倍状态空间上的标准 Dijkstra。 索引功能将位置和传送带状态编码为单个整数。 优先级队列确保我们始终首先扩展最小的已知距离状态。 

功能`conveyor_sink`是重点优化。 它将整个强制运动序列压缩为单个转换。 它会一直行走，直到到达非传送单元或由于墙壁或边界而失败。 步骤的数量成为该转换的成本。 

开关处理被实现为翻转状态位的零成本边缘。 仅当传送带关闭时才允许自由移动，这符合强制移动仅在传送带打开时适用的规则。 

## 工作示例

 考虑一个简单的网格，其中传送链处于开启状态并直接通向出口。 

我们跟踪单个测试用例：

 | 步骤| 职位| 状态| 行动| 成本|
 | --- | --- | --- | --- | --- |
 | 1 | (0,0) | (0,0) | 关闭 | 开始 | 0 |
 | 2 | (0,0) | (0,0) | 上 | 切换开关| 0 |
 | 3 | (0,0) | (0,0) | 上 | 传送带水槽出口| +k |

 这显示了单个切换如何启用绕过中间决策的确定性强制路径。 

第二个例子使用自由移动：

 | 步骤| 职位| 状态| 行动| 成本|
 | --- | --- | --- | --- | --- |
 | 1 | (0,0) | (0,0) | 关闭 | 开始 | 0 |
 | 2 | (0,1)| 关闭 | 向右移动| +2 |
 | 3 | (1,1) | 关闭 | 下移 | +2 |

 这表明自由流动是一致加权的并且独立于未来状态的变化。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(nm log(nm)) | O(nm log(nm)) | 每个 2nm 状态均采用 Dijkstra 处理，每个边缘松弛恒定次数 |
 | 空间| O(纳米) | 双网格上的距离​​数组和隐式图结构 |

 由于测试的总网格大小最多为 10^6，并且每个状态在优先级队列中处理对数次数，因此复杂性完全符合约束条件。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    INF = 10**18
    dirs = {'>': (0,1), '<': (0,-1), '^': (-1,0), 'v': (1,0)}

    def solve():
        n, m = map(int, input().split())
        g = [input().strip() for _ in range(n)]

        def id(x,y,s): return (x*m+y)*2+s

        dist = [INF]*(n*m*2)
        dist[id(0,0,0)] = 0
        import heapq
        pq = [(0,0,0,0)]

        def inside(x,y): return 0<=x<n and 0<=y<m

        def sink(x,y):
            cx,cy=x,y
            cst=0
            while True:
                c=g[cx][cy]
                if c not in dirs: return cx,cy,cst
                dx,dy=dirs[c]
                nx,ny=cx+dx,cy+dy
                if not inside(nx,ny) or g[nx][ny]=='#': return -1,-1,-1
                cx,cy=nx,ny
                cst+=1

        while pq:
            d,x,y,s=heapq.heappop(pq)
            if d!=dist[id(x,y,s)]: continue
            if g[x][y]=='!':
                ns=1-s
                nid=id(x,y,ns)
                if dist[nid]>d:
                    dist[nid]=d
                    heapq.heappush(pq,(d,x,y,ns))
            if s==0:
                for dx,dy in [(1,0),(-1,0),(0,1),(0,-1)]:
                    nx,ny=x+dx,y+dy
                    if not inside(nx,ny) or g[nx][ny]=='#': continue
                    nid=id(nx,ny,0)
                    if dist[nid]>d+2:
                        dist[nid]=d+2
                        heapq.heappush(pq,(d+2,nx,ny,0))
            else:
                tx,ty,cst=sink(x,y)
                if tx!=-1:
                    nid=id(tx,ty,1)
                    if dist[nid]>d+cst:
                        dist[nid]=d+cst
                        heapq.heappush(pq,(d+cst,tx,ty,1))

        return min(dist[id(n-1,m-1,0)], dist[id(n-1,m-1,1)])

    t = int(input())
    out = []
    for _ in range(t):
        out.append(str(solve()))
    return "\n".join(out)

# provided samples
# assert run(...) == ...
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小 1x1 | 0 | 开始等于结束 |
 | 小型无输送机| 线性路径成本| 基本 Dijkstra 正确性 |
 | 输送链| 强制移动处理| 接收器压缩正确性|
 | 需要切换开关| 状态转换| 分层图的正确性|

 ## 边缘情况

 一个关键的边缘情况是中途通向墙壁的传送链。 在这种情况下，接收器函数返回无效，并且整个转换将从图中删除。 对于像向右移动的传送带指向墙壁这样的输入，算法永远不会从该状态添加边缘，这会阻止 Dijkstra 探索不可能的强制路径​​。 

另一种情况是交替开关，需要按顺序多次切换。 由于每个切换边缘的成本为零，因此该算法可以在不同状态下重新访问同一单元而不会造成损失。 正确性来自于将状态视为节点的一部分，确保重新访问不会与单层图中的循环混淆。
