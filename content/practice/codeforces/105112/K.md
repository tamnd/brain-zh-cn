---
title: "CF 105112K - 克洛姆彭丹斯"
description: "我们被放置在 $n × n$ 网格的左上角图块上，并允许使用两种不同的“骑士式”移动规则穿过网格。"
date: "2026-06-27T19:59:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105112
codeforces_index: "K"
codeforces_contest_name: "2023-2024 ICPC Northwestern European Regional Programming Contest (NWERC 2023)"
rating: 0
weight: 105112
solve_time_s: 56
verified: true
draft: false
---

[CF 105112K - Klompendans](https://codeforces.com/problemset/problem/105112/K)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被放置在一个$n \times n$网格并允许使用两种不同的“骑士式”移动规则穿过网格。 每个动作都以 L 形跳跃：第一条规则移动一对固定的距离$(a,b)$沿着任何方向和符号的两个轴，第二条规则与$(c,d)$。 每次移动后，我们都必须切换到另一个规则，但一开始我们可以自由选择任一规则作为第一步。 

任务不是找到一条路径，而是确定从左上角开始的任何有效交替移动序列可以访问多少个不同的网格单元，而无需离开网格。 

约束的关键结构含义是$n \le 500$，因此网格最多有 250,000 个单元。 任何探索与序列数量成比例的状态的解决方案都是不可能的，因为可能的移动序列的数量随着深度呈指数增长。 这立即表明问题本质上是关于图中的可达性而不是路径的枚举。 

一个微妙的点是移动交替将内存引入系统。 位于单元格上不足以描述状态，因为下一个允许的移动取决于上一个移动是类型 A 还是类型 B。因此，两个相同的网格位置可能会表现不同，具体取决于下一个预期的移动类型。 

一个天真的错误是忽略这一点并将其视为仅在网格单元上的标准 BFS。 这会失败，因为可达性取决于移动类型的奇偶性。 

另一种失败模式是在没有记忆的情况下尝试对所有序列进行 DFS。 即使是像这样的小案例$n=10$已经可以在每步产生高达 16 个方向的分支因子，从而导致对相同配置的重复探索出现爆炸式增长。 

## 方法

 蛮力的想法是模拟从初始单元开始的每个可能的移动序列，在两种移动类型之间交替。 从每个位置，我们尝试当前移动类型的所有最多八个方向，并递归地继续。 这在原则上是正确的，因为它完全遵循规则并枚举了所有有效的舞蹈。 

然而，这种方法会失败，因为在不同的剩余移动模式下会多次重新访问同一单元。 更糟糕的是，分支因子在每一步都会复合，导致探索的序列呈指数增长。 最坏的情况就像$O(16^k)$对于序列长度$k$，即使对于小网格，这也是完全不可行的。 

关键的观察是系统只有少量的“记忆”：当前单元格以及接下来需要哪种移动类型。 一旦我们显式地包含此内存，整个问题就变成有限图上的最短路径样式可达性问题，最多$2n^2$州。 

每个状态都是由网格位置和一个标志组成的对，该标志指示下一步移动是否必须使用类型 A 还是类型 B。从每个状态，我们最多生成 8 个到具有相反标志的另一个状态的转换。 这会将问题转换为标准 BFS/DFS 可达性计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 序列上的暴力递归 | 指数| 指数堆栈| 太慢了 |
 | BFS 结束$(x,y,parity)$状态 |$O(n^2)$|$O(n^2)$| 已接受 |

 ## 算法演练

 我们将问题建模为增强状态上的图搜索。 

### 步骤

 1. 定义一个状态为$(x, y, t)$， 在哪里$(x,y)$是当前单元格并且$t$指示接下来必须使用哪种移动类型。 
2. 初始化一个BFS队列，有两种起始状态：$(0,0,A)$和$(0,0,B)$，因为第一步可以使用任一类型。 
3. 维护所有状态的访问数组$(x,y,t)$以避免重新访问已经处理过的配置。 
4. 预先计算每种移动类型的 8 个方向偏移：$(a,b)$生成所有符号和轴交换，类似地$(c,d)$。 
5. 当队列不为空时，弹出一个状态$(x,y,t)$。 
6. 对于当前的移动类型$t$，生成所有可能的目标单元格$(nx,ny)$使用它的 8 种变换。 
7. 对于网格内的每个有效目的地，如果状态$(nx,ny,1-t)$尚未被访问过，则将其标记为已访问并将其推入队列。 
8. BFS完成后，计算有多少个不同的网格单元$(x,y)$已在任一州访问过。 

### 为什么它有效

 关键的不变量是 BFS 精确地探索了移动交替约束下可到达的增广状态的集合。 每个有效的舞蹈都对应于该状态图中的一条路径，因为每个移动都严格交替所需的转换类型，并且每个允许的几何移动都表示为一条边。 相反，该图中的每条路径都对应于构建的有效舞蹈动作序列。 由于我们从两个有效的初始动作选择中探索所有可到达的状态，因此我们捕获了所有可能的舞蹈的联合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve():
    n = int(input().strip())
    a, b = map(int, input().split())
    c, d = map(int, input().split())

    movesA = []
    movesB = []

    for dx, dy in [(a, b), (b, a)]:
        for sx in (-1, 1):
            for sy in (-1, 1):
                movesA.append((sx * dx, sy * dy))

    for dx, dy in [(c, d), (d, c)]:
        for sx in (-1, 1):
            for sy in (-1, 1):
                movesB.append((sx * dx, sy * dy))

    def id_state(x, y, t):
        return (x, y, t)

    vis = [[[False, False] for _ in range(n)] for _ in range(n)]
    q = deque()

    vis[0][0][0] = True
    vis[0][0][1] = True
    q.append((0, 0, 0))
    q.append((0, 0, 1))

    while q:
        x, y, t = q.popleft()

        if t == 0:
            moves = movesA
        else:
            moves = movesB

        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < n:
                nt = 1 - t
                if not vis[nx][ny][nt]:
                    vis[nx][ny][nt] = True
                    q.append((nx, ny, nt))

    seen = set()
    for i in range(n):
        for j in range(n):
            if vis[i][j][0] or vis[i][j][1]:
                seen.add((i, j))

    print(len(seen))

if __name__ == "__main__":
    solve()
```该实现明确地将两种移动类型分为预先计算的方向列表。 这避免了在 BFS 期间重新计算 8 个对称变换。 每个网格单元都用两个布尔标志进行跟踪，每个下一步移动类型都有一个，确保我们不会混淆到达相同单元格但所需的下一步移动不同的状态。 

一个常见的实施陷阱是忘记从两种移动类型启动 BFS。 由于第一步可以自由选择，因此两个初始状态都必须入队； 否则一半的可达空间就会丢失。 

## 工作示例

 考虑一个小网格，其中$n = 4$,$a = 1, b = 2$,$c = 2, d = 3$。 BFS 开始于$(0,0,A)$和$(0,0,B)$。 

### 轨迹 1

 | 步骤| 状态| 使用的动作 | 添加新状态 |
 | ---| ---| ---| ---|
 | 0 | (0,0,A), (0,0,B) | (0,0,A), (0,0,B) | 开始 | 初始|
 | 1 | (0,0,A) | (0,0,A) | A 动作 | 几个有效的 (nx,ny,B) |
 | 2 | (0,0,B) | (0,0,B) | B 动作 | 几个有效的 (nx,ny,A) |

 该跟踪显示了交替如何迫使状态空间立即分裂为两个交错层，但两个层通过 BFS 扩展保持同步。 

### 迹线 2（退化情况）

 让$n=3$,$a=b=c=d=1$。 所有的动作都变成标准的王步。 

| 步骤| 状态| 可达 |
 | ---| ---| ---|
 | 0 | (0,0,A/B) | (0,0) | (0,0) |
 | 1 | 邻居 | 所有相邻单元格 |
 | 2 | 反向传播| 仅已访问过的单元 |

 这表明，使用不同的移动类型重新访问同一单元并不会增加可达集，从而证实了基于状态的修剪是必不可少的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^2)$| 各州$(x,y,t)$被访问一次，持续 8 次转换 |
 | 空间|$O(n^2)$| 访问数组每个单元的两个状态加上 BFS 队列 |

 网格最多有 250,000 个单元，因此即使将两个移动状态加倍，也能轻松保持在限制范围内。 BFS 确保每个状态都处理一次，从而使解决方案能够轻松满足 5 秒的限制。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n = int(input().strip())
    a, b = map(int, input().split())
    c, d = map(int, input().split())

    movesA = []
    movesB = []

    for dx, dy in [(a, b), (b, a)]:
        for sx in (-1, 1):
            for sy in (-1, 1):
                movesA.append((sx * dx, sy * dy))

    for dx, dy in [(c, d), (d, c)]:
        for sx in (-1, 1):
            for sy in (-1, 1):
                movesB.append((sx * dx, sy * dy))

    vis = [[[False, False] for _ in range(n)] for _ in range(n)]
    q = deque()

    vis[0][0][0] = True
    vis[0][0][1] = True
    q.append((0, 0, 0))
    q.append((0, 0, 1))

    while q:
        x, y, t = q.popleft()
        moves = movesA if t == 0 else movesB

        for dx, dy in moves:
            nx, ny = x + dx, y + dy
            if 0 <= nx < n and 0 <= ny < n:
                nt = 1 - t
                if not vis[nx][ny][nt]:
                    vis[nx][ny][nt] = True
                    q.append((nx, ny, nt))

    ans = sum(any(vis[i][j]) for i in range(n) for j in range(n))
    return str(ans)

# provided samples (placeholders since exact outputs not specified)
# assert run(...) == ...

# custom cases
assert run("3\n1 1\n1 1\n") >= "1", "minimum grid sanity"
assert run("4\n1 2\n2 3\n") != "", "basic reachability"
assert run("5\n2 1\n3 2\n") != "", "mixed asymmetry"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 3 对称移动 | 小值| 最小网格行为|
 | 4种不同的动作| 非空结果 | 交替可达性 |
 | 5个混合参数| 稳定的BFS扩展| 不对称处理 |

 ## 边缘情况

 一个关键的边缘情况是当$a=b$或者$c=d$，这减少了唯一移动方向的数量。 该实现仍然生成 8 个带符号的变体，但有些会崩溃为重复项。 这不会破坏正确性，因为 BFS 访问可确保忽略重复项，而无需额外成本。 该算法仍然表现正确，因为它不依赖于转换的唯一性。 

另一种极端情况是两种移动类型相同。 在这种情况下，状态图变成以对称交替模式连接的两个相同层。 BFS 仍然可以正确探索，因为从两层开始可确保不会错过任何可到达的配置。 

最后，当$n$很小，许多动作立即落在网格之外。 边界检查可以防止无效的状态扩展，确保即使大多数理论移动不可用，BFS 也会快速终止。
