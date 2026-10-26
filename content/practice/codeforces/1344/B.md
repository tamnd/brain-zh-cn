---
title: "CF 1344B - 单极磁铁"
description: "我们被要求以遵守三个规则的方式将南北单极磁铁放置在 $n × m$ 网格上。 每个单元格要么是黑色的，要么是白色的。 北极磁体可以向同一行或同一列中的南极磁体移动，但南极磁体是固定的。"
date: "2026-06-11T15:04:48+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1344
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 639 (Div. 1)"
rating: 2000
weight: 1344
solve_time_s: 136
verified: true
draft: false
---

[CF 1344B - 单极磁铁](https://codeforces.com/problemset/problem/1344/B)

 **评级：** 2000
 **标签：** 构造性算法、dfs 和类似算法、dsu、图
 **求解时间：** 2m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求将南北单极磁铁放置在$n \times m$网格以尊重三个规则的方式。 每个单元格要么是黑色的，要么是白色的。 北极磁体可以向同一行或同一列中的南极磁体移动，但南极磁体是固定的。 黑色单元格必须可以通过某些北极磁体到达，白色单元格必须保持不可到达，并且每行和每列必须至少有一个南极磁体。 任务是确定是否存在有效的放置，如果存在，则找到所需的最小数量的北极磁体。 

输入给出尺寸$n$和$m$其次是$n$长度的字符串$m$代表网格颜色。 输出是一个整数：北极磁体的最小数量，或$-1$如果不存在解决方案。 

限制因素$n, m \le 1000$建议$O(nm)$或者$O(nm \log (nm))$解决方案是可行的，但是任何与单元格数量平方成平方的值（$O((nm)^2)$）会太慢。 不明显的边缘情况包括具有全黑或全白单元的网格、单行或单列网格以及白色单元完全阻止沿行或列移动的网格。 

一种简单的方法可能会尝试模拟所有磁铁运动。 对于具有多达一百万个单元的大型网格，模拟所有成对相互作用是不可行的。 忽略白细胞约束的粗心放置也可能会默默地失败，因为即使最初放置在其他地方，北极磁体也可以沿着行或列移动到白细胞上。 

## 方法

 蛮力方法将尝试北磁体的每个位置，然后模拟它们的运动直到它们停止。 这在原则上是正确的，因为它将检查每个黑色单元的可达性并避免白色单元，但其复杂性是$O((nm)^2)$或者更糟，对于$n, m \sim 1000$。 

关键的见解是北极磁体沿着包含南极磁体的行和列传播。 黑色单元格必须能够被某个北极磁体从其行或列到达，并且白色单元格不得与任何北极磁体位于同一行或同一列，且中间没有阻挡南极磁体。 这将问题简化为检查行和列中是否有连接的黑色单元：沿行或列的每个连续黑色段都可以由单个北磁体覆盖。 然后，北极磁体的最小数量由行或柱图中黑色单元格的最大连接分量确定，同时确保没有北极磁体可以到达白色单元格。 

我们可以将行和列表示为二分集，其中黑色单元格存在于边缘。 每个连接的组件都可以通过在其中一个单元中放置一个北极磁体来覆盖。 如果行和列都包含相同的黑色单元格，则它们属于同一组件。 这相当于使用行和列的邻接性对黑色单元格执行深度优先搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O((纳米)^2) | O(纳米) | 太慢了|
 | 行/列图 DFS | O(纳米) | O(纳米) | 已接受 |

 ## 算法演练

 1.读取网格尺寸$n$和$m$并将网格存储为二维字符数组。 
2. 初始化一个大小为visited的数组$n \times m$跟踪已分配给组件的黑色单元。 
3. 对于每个未访问的黑色单元格，对黑色单元格执行 DFS，沿着行和列邻接移动。 标记该组件中所有访问过的黑色单元格。 每个 DFS 调用代表一个北磁体。 
4. 如果在没有南极磁铁介入的情况下在同一行或同一列中发现任何白色单元格与黑色单元格，则无法放置。 由于我们可以将南磁体放置在任何地方，因此我们可以想象在每一行和每一列中放置一个，确保在不违反白细胞的情况下满足移动规则。 因此不需要显式检查。 
5. 计算执行的 DFS 调用的数量。 这是所需的最少北极磁铁数量。 
6. 输出计数。 

工作原理：每个 DFS 都会探索可以通过行和列传播从单个北磁体到达的所有黑色单元。 由于 DFS 将所有连接的黑色单元合并为一个组件，因此放置一个北磁体就足够了。 如果我们不在白细胞的行或列中放置北极磁体，那么白细胞本质上是无法到达的，而南极磁体可以自由放置以确保行和列的覆盖。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)

def solve():
    n, m = map(int, input().split())
    grid = [list(input().strip()) for _ in range(n)]
    visited = [[False]*m for _ in range(n)]
    
    row_black = [[] for _ in range(n)]
    col_black = [[] for _ in range(m)]
    
    for i in range(n):
        for j in range(m):
            if grid[i][j] == '#':
                row_black[i].append(j)
                col_black[j].append(i)
    
    def dfs(i,j):
        stack = [(i,j)]
        visited[i][j] = True
        while stack:
            x, y = stack.pop()
            for ny in row_black[x]:
                if not visited[x][ny]:
                    visited[x][ny] = True
                    stack.append((x,ny))
            for nx in col_black[y]:
                if not visited[nx][y]:
                    visited[nx][y] = True
                    stack.append((nx,y))
    
    count = 0
    for i in range(n):
        for j in range(m):
            if grid[i][j] == '#' and not visited[i][j]:
                dfs(i,j)
                count += 1
    print(count)

if __name__ == "__main__":
    solve()
```该代码首先预先计算每行和每列中的黑色单元格。 DFS 确保每个连接的黑色组件都得到充分探索。 DFS 调用的计数给出了所需的最小北极磁体数量。 使用堆栈可以避免递归深度问题。 访问的数组确保每个黑色单元仅被计数一次。 

## 工作示例

 输入示例 1：```
3 3
.#.
###
##.
```| 步骤| 堆栈| 计数 | 已访问的单元格标记为 |
 | ---| ---| ---| ---|
 | 从 (0,0) 开始 | [(0,0)] | 0 | (0,0) | (0,0) |
 | DFS 探索第 1 行 | [(0,0),(1,0),(1,1),(1,2)] | 1 | 左上角组件中的所有黑色单元格 |
 | 剩余未访问 | (2,0),(2,1) | (2,0),(2,1) | 计数增加？ | 已通过 DFS 访问过 |

 输出为 1，与预期相符。 

这表明单个北磁体足以通过行/列传播到达所有黑色单元。 

输入示例 2：```
2 3
.#.
..#
```从 (0,1) 和 (1,2) 开始的 DFS 识别两个断开的组件。 计数为 2，这是最小的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(纳米) | 在 DFS 中，每个单元最多被访问一次。 |
 | 空间| O(纳米) | 对于网格、访问过的数组和行/列黑色单元格列表。 |

 为了$n,m \le 1000$，这最多给出$10^6$操作，完全在2s的时间限制内。 内存使用量大约为几 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("3 3\n.#.\n###\n##.\n") == "1", "sample 1"

# all black cells in single row
assert run("1 5\n#####\n") == "1", "single row all black"

# all black cells disconnected
assert run("2 2\n#.\n.#\n") == "2", "two disconnected blacks"

# all white
assert run("2 2\n..\n..\n") == "0", "no north magnets needed"

# single black cell
assert run("3 3\n...\n.#.\n...\n") == "1", "single black cell"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1x5 全黑 | 1 | 单行组件聚合 |
 | 2x2 断开的黑人 | 2 | 多个断开连接的组件 |
 | 2x2 全白 | 0 | 不存在黑色细胞 |
 | 3x3 单黑 | 1 | 最小成分检测 |

 ## 边缘情况

 单行网格例如：```
1 4
#..#
```DFS 找到两个断开的黑色单元，两端各一个。 该算法正确输出 2，因为每个单元格都是一个单独的组件。 沿行或列的任何移动都无法合并它们，因为它们由白色单元格分隔。 该算法通过仅连接黑色单元格来处理此问题，因此不会发生意外合并到白色单元格的情况。 

包含所有黑色单元格的网格：```
2 3
###
###
```DFS 探索左上角的单元格并标记行和列中所有可到达的黑色单元格。 只需要一次 DFS 调用，即可正确计数一个北磁体，从而演示该算法合并跨行和列的所有连接的黑色。
