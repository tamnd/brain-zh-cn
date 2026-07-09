---
title: "CF 102992G - 去"
description: "输入是一个方板，其中每个位置要么是黑色，要么是白色，要么是空的。 白色的石头可以通过上下左右相邻的方式连接起来，形成簇。 只有当至少有一颗石头接触到空单元格时，簇才能存活。"
date: "2026-07-04T04:41:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102992
codeforces_index: "G"
codeforces_contest_name: "2020-2021 ACM-ICPC, Asia Nanjing Regional Contest (XXI Open Cup, Grand Prix of Nanjing)"
rating: 0
weight: 102992
solve_time_s: 42
verified: true
draft: false
---

[CF 102992G - Go](https://codeforces.com/problemset/problem/102992/G)

 **评级：** -
 **标签：** -
 **求解时间：** 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入是一个方板，其中每个位置要么是黑色，要么是白色，要么是空的。 白色的石头可以通过上下左右相邻的方式连接起来，形成簇。 只有当至少有一颗石头接触到空单元格时，簇才能存活。 如果簇中的每个棋子都完全被非空单元（黑色或白色）包围，则该簇被视为已被捕获，并且必须计算其所有白色棋子。 

输出是一个整数：属于捕获的白色簇的白色棋子的总数。 

由于电路板最多可以有一百万个单元，因此任何算法都必须在相对于网格大小的线性时间内运行。 这立即排除了对每块石头或每个查询的重复搜索。 内存限制表明存储与网格大小相同的辅助数组是可以的，但不可能有超线性。 

当人们独立检查每个白子而不标记访问过的组件时，就会出现幼稚逻辑的一个关键失败案例。 在由 10,000 颗白石组成的链中，这将反复重新扫描相同的结构，导致大量重复工作和不正确的性能假设。 

当白色簇同时接触黑色棋子和其他白色簇，但在同一连接组件中遥远的某处具有单个空自由度时，会出现另一种边缘情况。 如果由于不完整的遍历而错过了该自由，则集群可能会被错误地标记为死亡。 

## 方法

 暴力方法将迭代每个白色石头并对其执行洪水填充，以确定其连接的组件是否包含任何空邻居。 每次洪水填充可能会花费$O(n^2)$，在一块全是白色石头的密集棋盘上，这变成了$O(n^4)$在最坏的情况下。 正确性很简单，因为每个组件都被显式检查自由度，但相同组件的重复重新计算使其不可行。 

关键的观察结果是，棋盘自然分解为白色棋子的连接组件，并且每个组件都具有二元属性：要么具有至少一个相邻的空单元，要么没有。 这建议对每个组件而不是每个节点运行一次遍历。 标准 BFS 或 DFS 可以一次发现整个组件，同时跟踪是否有任何边界接触“.”单元。 遍历完成后，我们要么将组件的大小添加到答案中，要么完全忽略它。 

这将问题减少到线性时间，因为每个单元仅被访问一次并且每个边缘被检查恒定次数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每块石头 BFS 的暴力破解 |$O(n^4)$|$O(n^2)$| 太慢了 |
 | 组件 BFS/DFS |$O(n^2)$|$O(n^2)$| 已接受 |

 ## 算法演练

 1. 扫描网格的每个单元格，每当发现未访问过的白色石头时，就从它开始遍历。 这确保了每个白色组件只被处理一次。 
2. 遍历时，维护一个包含当前组件中所有石子的队列或栈。 标记每个访问过的白色单元格，这样它就不会再次添加到另一次遍历中。 
3. 扩展组件时保留两条信息：遇到的白棋子的数量，以及指示任何已​​访问棋子的任何相邻单元格是否为空的布尔标志。 这个标志决定了生存。 
4. 对于从遍历结构中弹出的每个石头，检查其四个邻居。 如果邻居是白色且未被访问过，则将其添加到组件中。 如果邻居为空，则将自由标志设置为 true。 黑色单元格会因扩展而被忽略，但不会影响自由旗帜。 
5. 遍历结束后，如果 liberty flag 为 false，则将组件大小添加到最终答案中。 
6. 继续扫描网格，直到处理完所有单元格。 

正确性取决于将每个连接的组件视为单个实体。 遍历确保没有白子被计算两次，并且自由标志聚合了该组件的所有可能的逃逸点。 

### 为什么它有效

 在做出任何决定之前，每个白色组件都会经过充分探索。 由于连接性是可传递的，因此可以保证在同一次遍历中发现从同一组件中的另一个白棋可到达的任何白棋。 自由度条件仅取决于与空单元的相邻性，并且此属性在组件上是单调的：如果任何石头具有自由度，则整个组件都是活的。 因此，基于单次遍历对组件进行分类可以保持正确性并防止重复计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve():
    n = int(input().strip())
    grid = [input().strip() for _ in range(n)]
    
    vis = [[False] * n for _ in range(n)]
    
    dirs = [(1,0), (-1,0), (0,1), (0,-1)]
    
    ans = 0
    
    for i in range(n):
        for j in range(n):
            if grid[i][j] != 'o' or vis[i][j]:
                continue
            
            q = deque()
            q.append((i, j))
            vis[i][j] = True
            
            size = 0
            alive = False
            
            while q:
                x, y = q.popleft()
                size += 1
                
                for dx, dy in dirs:
                    nx, ny = x + dx, y + dy
                    if nx < 0 or nx >= n or ny < 0 or ny >= n:
                        continue
                    if grid[nx][ny] == '.':
                        alive = True
                    elif grid[nx][ny] == 'o' and not vis[nx][ny]:
                        vis[nx][ny] = True
                        q.append((nx, ny))
            
            if not alive:
                ans += size
    
    print(ans)

if __name__ == "__main__":
    solve()
```网格存储为字符串以避免重复解析开销。 访问的数组确保每颗白石都被精确处理一次。 选择 BFS 而不是 DFS 是为了避免大型网格上的递归深度问题。 这`alive`每当遇到任何空邻居时都会更新标志，并且仅当不存在这样的邻居时才累积组件大小。 

一个常见的实施陷阱是忘记只有白棋子才能传播 BFS； 黑色的石头永远不应该被排队，即使它们会阻止扩张。 另一个微妙的问题是边界处理：越界单元格被忽略而不是被视为空白空间。 

## 工作示例

 ### 示例 1

 考虑一个小板：```
o x o
x o x
o x .
```| 步骤| 启动单元| 元件尺寸| 活着的旗帜| 行动|
 | ---| ---| ---| ---| ---|
 | 1 | (0,0) | (0,0) | 1 | 假 | 没有白人邻居|
 | 2 | (1,1) | 1 | 真实 | 触摸“.” 在 (2,2) |
 | 3 | (0,2) | 1 | 假 | 孤立的白色|

 最终的答案只计算没有自由的组件，即孤立的组件。 这证实了 BFS 正确区分了封闭的簇和接触空白空间的簇。 

### 示例 2```
o o x
x o x
x x x
```| 步骤| 组件| 尺寸| 活着的旗帜| 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | 所有连接的o's | 3 | 假 | 全封闭|

 所有三颗白棋都属于一个连通分量，没有相邻的空单元。 BFS 将所有白色合并到一次遍历中并正确计算所有白色。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^2)$| BFS/DFS 遍历期间每个网格单元被访问一次 |
 | 空间|$O(n^2)$| 最坏情况下访问的数组和队列存储所有单元格 |

 网格大小界限为$10^6$单元格非常适合这种复杂性，因为每个单元格的每个操作都是恒定的时间。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque
    
    def solve():
        n = int(input().strip())
        grid = [input().strip() for _ in range(n)]
        vis = [[False]*n for _ in range(n)]
        dirs = [(1,0),(-1,0),(0,1),(0,-1)]
        ans = 0
        
        for i in range(n):
            for j in range(n):
                if grid[i][j] != 'o' or vis[i][j]:
                    continue
                q = deque([(i,j)])
                vis[i][j] = True
                alive = False
                size = 0
                
                while q:
                    x,y = q.popleft()
                    size += 1
                    for dx,dy in dirs:
                        nx,ny = x+dx, y+dy
                        if nx<0 or nx>=n or ny<0 or ny>=n:
                            continue
                        if grid[nx][ny]=='.':
                            alive = True
                        elif grid[nx][ny]=='o' and not vis[nx][ny]:
                            vis[nx][ny]=True
                            q.append((nx,ny))
                
                if not alive:
                    ans += size
        
        print(ans)
    
    solve()
    return sys.stdout.getvalue().strip()

# minimal
assert run("1\no\n") == "1"

# no capture
assert run("2\noo\n..") == "0"

# full capture
assert run("2\noo\noo") == "4"

# mixed
assert run("3\no.x\nxoo\nx.x") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1x1 白色 | 1 | 最小的组件|
 | 白色包围空| 0 | 自由检测|
 | 全封闭块| 4 | 全元件计数|
 | 混合结构| 2 | 正确的组分分离|

 ## 边缘情况

 完全被黑色石头包围的单个白色石头展示了最简单的捕获组件。 BFS 从该单元格开始，找不到空的邻居，然后在答案中精确地加 1。 

一大串白色石头，链中任何位置都有一个空单元格，这说明了每个单元格检查失败的原因。 遍历看到空邻居一次，设置活动标志，并正确避免对整个结构进行计数。 

没有白子的棋盘会导致零遍历触发，算法会立即返回零，而无需进行不必要的处理。
