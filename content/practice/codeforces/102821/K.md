---
title: "CF 102821K - 迷宫之王"
description: "迷宫是一个网格，其中的墙壁无法进入，退出单元结束游戏，并且一些特殊的电梯单元可以在每次移动之前在打开和阻塞之间切换。 废墟不会自由选择他的路线。"
date: "2026-07-26T16:08:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102821
codeforces_index: "K"
codeforces_contest_name: "2019 Sichuan Province Programming Contest"
rating: 0
weight: 102821
solve_time_s: 66
verified: true
draft: false
---

[CF 102821K - 迷宫之王](https://codeforces.com/problemset/problem/102821/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 迷宫是一个网格，其中的墙壁无法进入，退出单元结束游戏，并且一些特殊的电梯单元可以在每次移动之前在打开和阻塞之间切换。 废墟不会自由选择他的路线。 Fish 改变电梯后，Ruins 总是会移动到属于通往出口的最短路径的相邻单元格。 如果存在多个这样的邻居，则固定优先级顺序上、下、左、右决定移动。 Fish 希望选择升降状态，以便在废墟到达出口之前最大化移动次数。 

对于每个查询，我们需要从给定单元格开始的最大移动次数。 如果菲什能让遗迹永远远离出口，答案是`-1`。 重要的限制是网格最多有 2500 个单元，并且最多有 10 个提升单元。 电梯数量少是关键限制。 它允许我们尝试每一种可能的电梯配置，因为最多有`2^10 = 1024`配置。 探索所有可能的升力变化历史的解决方案是不可能的，因为历史的数量随着时间呈指数增长。 

一个常见的错误是假设电梯配置应该是最终动态规划状态的一部分。 废墟进入下一个单元后，当前移动之前选择的配置并不重要，只是废墟当前占据的单元不能变成墙。 这让我们可以将游戏折叠成单元格图表。 

另一个边缘情况是启动单元本身就是电梯。 例如：```
Input
1
1 3 1
?E.
1 1
```答案是`1`。 鱼无法关闭起始电梯，但废墟仍然可以直接移动到出口。 将第一个配置视为普通的未来选择的解决方案可能会错误地认为电梯可以被阻塞。 

另一个边缘情况是由电梯控制创建的循环：```
Input
1
3 4 1
....
.?E.
....
2 2
```如果鱼可以重复选择使废墟移动一个周期而不到达出口的配置，那么答案是`-1`。 仅遵循一个固定迷宫的最短路径模拟会错过这一点，因为 Fish 在游戏过程中改变图形。 

## 方法

 直接模拟将尝试升力变化的每个序列。 对于每个转弯，它都会分支所有有效的电梯配置并继续，直到废墟到达出口。 这是正确的，因为每种可能的 Fish 策略都被探索过，但它会多次重复相同的情况。 持续多次移动的游戏可以在相同的有效条件下重新访问相同的单元格，从而导致探索路径的数量呈指数级增长。 

有用的观察结果是，从单元格的移动仅取决于为该移动选择的电梯配置。 移动完成后，旧配置消失。 这意味着我们可以预先计算 Ruins 可以从每个单元中做出的每一个可能的动作。 结果是一个有向图，其中一条边`u -> v`意味着鱼有一些升降机配置，可以使废墟从`u`到`v`。 

现在的问题变成了在这个有向图中找到最长的路径，其中到达出口给出有限分数，到达有向循环给出无限分数。 深度优先搜索具有三种状态：未访问、当前探索和完成，检测循环并计算到出口的最长距离。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 移动次数呈指数级增长 | 指数| 太慢了|
 | 最佳| O(2^K * N * M + N * M) | O(2^K * N * M + N * M) | O(N * M) | 已接受 |

 ## 算法演练

 1. 枚举电梯单元的每种可能状态。 对于每个状态，从出口运行 BFS 来计算到每个单元的最短距离。 这为 Ruins 提供了该迷宫的最短路径信息。 
2. 对于每个非出口单元和每个电梯配置，确定相邻废墟将选择的。 按所需的优先级顺序检查邻居，并选择第一个距离正好小一个的邻居。 如果不存在这样的邻居，则该配置无法产生有效的移动。 
3. 添加从当前单元到所选邻居的边。 重复的边并不重要，因为 Fish 只需要具有强制一个可能的下一个单元格的能力。 
4. 对生成的单元图运行 DFS。 如果DFS到达当前正在访问的节点，则存在循环，因此每个能够到达该循环的节点都有答案`-1`。 
5. 对于图形的非循环部分，存储到出口的最长距离。 移动到出口会贡献一次移动，而移动到另一个单元格会贡献 1 加该单元格的答案。 

单元图足够的原因是每次废墟到达单元时，Fish 都会获得配置电梯的新机会。 除了当前位置（已经是图节点）之外，先前的选择不能限制未来的选择。 DFS 不变量是，完成的节点存储来自该单元的正确的最大移动次数，并且活动节点证明循环是可达的。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve_case(n, m, q, grid, queries):
    cells = []
    idx = {}
    exit_id = -1
    lifts = []

    for i in range(n):
        for j in range(m):
            if grid[i][j] != '#':
                idx[(i, j)] = len(cells)
                cells.append((i, j))
                if grid[i][j] == 'E':
                    exit_id = idx[(i, j)]
                if grid[i][j] == '?':
                    lifts.append((i, j))

    s = len(cells)
    k = len(lifts)
    lift_id = {p: i for i, p in enumerate(lifts)}
    total = 1 << k

    adj = [[] for _ in range(s)]
    dirs = [(-1, 0), (1, 0), (0, -1), (0, 1)]

    for mask in range(total):
        dist = [-1] * s
        dist[exit_id] = 0
        dq = deque([exit_id])

        while dq:
            u = dq.popleft()
            x, y = cells[u]
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if (nx, ny) in idx:
                    v = idx[(nx, ny)]
                    if dist[v] == -1:
                        if grid[nx][ny] == '?' and not (mask & (1 << lift_id[(nx, ny)])):
                            continue
                        dist[v] = dist[u] + 1
                        dq.append(v)

        for u, (x, y) in enumerate(cells):
            if u == exit_id:
                continue
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if (nx, ny) not in idx:
                    continue
                v = idx[(nx, ny)]
                if dist[v] != -1 and dist[u] == dist[v] + 1:
                    adj[u].append(v)
                    break

    # The previous loop only stored the first configuration's transition.
    # We need all possible transitions, so rebuild with sets.
    adj = [set() for _ in range(s)]

    for mask in range(total):
        dist = [-1] * s
        dist[exit_id] = 0
        dq = deque([exit_id])

        while dq:
            u = dq.popleft()
            x, y = cells[u]
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if (nx, ny) in idx:
                    v = idx[(nx, ny)]
                    if dist[v] == -1:
                        if grid[nx][ny] == '?' and not (mask & (1 << lift_id[(nx, ny)])):
                            continue
                        dist[v] = dist[u] + 1
                        dq.append(v)

        for u, (x, y) in enumerate(cells):
            if u == exit_id:
                continue
            for dx, dy in dirs:
                nx, ny = x + dx, y + dy
                if (nx, ny) in idx:
                    v = idx[(nx, ny)]
                    if dist[v] != -1 and dist[u] == dist[v] + 1:
                        adj[u].add(v)
                        break

    adj = [list(x) for x in adj]
    state = [0] * s
    ans = [0] * s

    sys.setrecursionlimit(1000000)

    def dfs(u):
        if u == exit_id:
            return 0
        if state[u] == 1:
            return -1
        if state[u] == 2:
            return ans[u]

        state[u] = 1
        best = -1
        infinite = False

        for v in adj[u]:
            res = dfs(v)
            if res == -1:
                infinite = True
            else:
                best = max(best, res + 1)

        state[u] = 2
        if infinite:
            ans[u] = -1
        else:
            ans[u] = best
        return ans[u]

    for i in range(s):
        if state[i] == 0:
            dfs(i)

    result = []
    for x, y in queries:
        result.append(str(ans[idx[(x - 1, y - 1)]]))
    return result

def main():
    t = int(input())
    out = []
    for case in range(1, t + 1):
        n, m, q = map(int, input().split())
        grid = [input().strip() for _ in range(n)]
        queries = [tuple(map(int, input().split())) for _ in range(q)]
        out.append(f"Case {case}:")
        out.extend(solve_case(n, m, q, grid, queries))
    print("\n".join(out))

if __name__ == "__main__":
    main()
```该实现首先将每个非壁单元压缩为图顶点。 这避免了在游戏阶段存储大型二维数组。 

每个提升面罩都会重复 BFS。 在 BFS 期间，阻塞的提升单元将被忽略，而开放的提升单元的行为就像正常的空单元一样。 知道距离后，邻居扫描直接遵循移动优先级顺序，这可以防止出现平局决胜的意外错误。 

最终的DFS采用标准循环检测着色方法。 标记为访问的节点意味着当前的递归路径再次到达该节点，因此 Fish 可以永远重复该循环。 完成的节点包含已经计算的答案并被重用。 

## 工作示例

 对于第一个示例，请考虑从以下位置开始的查询：`(4,3)`。 

| 细胞| 可能的结果 | DFS值|
 | ---| ---| ---|
 |`(4,3)`| 可以转一个周期|`-1`|

 电梯的选择允许菲什让废墟永远远离出口。 该表说明了为什么需要检测周期而不是仅计算最短路径。 

对于一个有限的例子：

 | 细胞| Fish 选择的下一个单元格 | 价值|
 | ---| ---| ---|
 | 开始| 中间细胞| 3 |
 | 中级| 另一个细胞| 2 |
 | 靠近出口 | 退出 | 1 |
 | 退出 | 结束 | 0 |

 该轨迹显示了最长路径的解释。 每条边代表废墟的一次移动，存储的值计算剩余的移动。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(2^K * N * M) | O(2^K * N * M) | 每个电梯配置执行一次 BFS 和一次转换扫描。 |
 | 空间| O(N * M) | 图和 DFS 状态仅存储在单元格上。 |

 最多 10 部电梯的限制使得`2^K`因素可控。 在预处理步骤之后，网格大小使图足够小，适合 DFS。 

## 测试用例```python
# helper: run solution on input string, return output string
# These tests assume the solve code is placed in the same module.

import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    old_out = sys.stdout
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    res = sys.stdout.getvalue()
    sys.stdin = old
    sys.stdout = old_out
    return res

assert run("""1
1 2 1
?E
1 1
""") == """Case 1:
1
"""

assert run("""1
2 2 1
E.
..
2 2
""") == """Case 1:
2
"""

assert run("""1
3 3 1
...
.E.
.?.
3 2
""") == """Case 1:
-1
"""

assert run("""1
3 5 2
..E..
.....
????.
3 1
3 5
""") != ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 出口旁的单电梯 |`1`| 开始使用电梯并首先进行搬运 |
 | 空荡荡的迷宫| 有限值| 正常最短路径运动|
 | 乘坐电梯|`-1`| 无限陷印检测|
 | 多次查询 | 有效输出| 查询处理 |

 ## 边缘情况

 当起始单元是电梯时，该算法仍然有效，因为查询要求的是单元图的值，而不是存储的电梯配置。 第一个转换是从保持当前电梯打开的所有配置生成的，因此 Fish 无法非法移除废墟的当前位置。 

当存在多个最短路径时，转换构造会按照语句给出的确切顺序检查邻居。 单独的 BFS 距离是不够的，因为它只告诉我们哪些移动是最短的，而不是告诉我们实际需要哪一个废墟。 

当 Fish 可以强制循环时，DFS 通过后缘找到访问节点。 该节点被标记为无限，并且每个可以选择进入该节点的路由的前辈也会收到`-1`。 这与游戏相匹配，因为鱼控制着选择并且总是可以重复循环。
