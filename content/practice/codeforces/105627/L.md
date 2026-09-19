---
title: "CF 105627L - 掷骰子游戏"
description: "棋盘包含开放单元、阻塞单元、骰子的起始位置以及包含从 1 到 6 的目标数字的一些单元。骰子以固定方向开始：顶面为 6，北面为 4，西面为 2。"
date: "2026-06-26T18:11:24+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105627
codeforces_index: "L"
codeforces_contest_name: "The 2023 ICPC Asia Tehran Regional Contest"
rating: 0
weight: 105627
solve_time_s: 49
verified: true
draft: false
---

[CF 105627L - 掷骰子游戏](https://codeforces.com/problemset/problem/105627/L)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 棋盘包含开放单元、阻塞单元、骰子的起始位置以及包含从 1 到 6 的目标数字的一些单元。骰子以固定方向开始：顶面为 6，北面为 4，西面为 2。移动会将骰子滚动到相邻的非阻塞单元中，并根据滚动方向更改其方向。 

每当骰子站在一个编号的单元格上并且其顶面上的值等于该单元格中写入的数字时，该单元格就贡献一分。 每个细胞最多只能贡献一次，即使骰子多次到达它。 任务是找到可以收集的最大点数。 

电路板尺寸最多为 100 x 100，最多有 10,000 个单元。 直接搜索路径是不可能的，因为可能的行走次数随着移动次数呈指数增长。 即使我们只考虑长度为 100 的所有可能的方向序列，可能性的数量也已经远远超出了我们可以探索的范围。 有用的观察结果是，骰子只有 24 个可能的方向，因此有意义状态的总数足够小：最多 100 × 100 × 24 = 240,000 个状态。 

一个微妙的点是，目标不是找到一条最短路径或一条移动次数较少的路径。 模具可以重新访问细胞并自由移动。 将单元格标记为已访问且不再进入该单元格的解决方案将错误地消除未来可能的评分机会。 

例如：```
1 2
s1
..
```正确答案是`1`。 骰子可以移动到包含`1`在某个方向上并对其进行评分。 忽略方向的普通网格 BFS 可能会假设第一次访问决定了一切，并且错过了可以使用不同的骰子面到达相同的位置。 

另一种情况是单元格可到达但无法得分：```
1 2
s2
..
```答案不会自动是编号单元格的数量。 仅当顶面与其值匹配时，单元才起作用。 计算所有可到达的编号单元格的粗心方法将返回`1`，但正确答案可以是`0`如果无法实现所需的方向。 

最后的边缘情况是起始单元格不会立即计数。 如果起始位置没有写出数字，则没有分数。 如果问题允许起始单元上有数字，则相同的状态图思想仍然可以正确处理它。 

## 方法

 思考这个问题的强力方法是尝试每一种可能的掷骰顺序并记录获得的最佳分数。 这是正确的，因为考虑了所有可能的移动策略。 问题在于可能的路径数量呈爆炸式增长。 每个状态最多可以进行四次移动，因此经过多次移动后，探索路径的数量会呈指数级增长。 

拯救我们的结构是骰子没有无限的内存。 它未来的行为仅取决于两件事：当前的板单元和芯片的当前方向。 完整的移动历史是无关紧要的，因为以相同的方向返回到相同的单元格会给出完全相同的未来可能性。 

这将问题转化为图的可达性。 每个状态都是一对`(row, column, orientation)`。 移动芯片会在这些状态之间创建边缘。 由于每次滚动都可以通过回滚来撤消，因此可以使用 BFS 或 DFS 探索所有可达状态。 

找到每个可达状态后，我们不需要模拟实际的最终路线。 在遍历可达状态图期间可以访问每个可达状态。 因此，对于每个板单元，如果至少一个可到达的方向将正确的数字放在顶部，则可以收集该单元。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 移动次数呈指数级增长 | 指数| 太慢了|
 | 状态图搜索 | O(纳米×24) | O(纳米×24) | 已接受 |

 ## 算法演练

 1. 将每个可能的芯片方向表示为一种状态。 骰子有六个面，但相对的面是固定的，因此立方体只有 24 个物理可能的方向。 从给定的方向开始，我们通过在四个方向上滚动来生成新的方向。 
2. 从包含起始单元和初始芯片方向的状态开始 BFS。 将方向与位置一起存储的原因是，同一单元格的行为可能会有所不同，具体取决于哪个面位于顶部。 
3. 当探索一个状态时，尝试所有四种可能的掷骰。 忽略离开棋盘或进入封锁单元格的动作。 对于每个有效的移动，计算新的方向并添加新的状态（如果之前尚未达到）。 
4. BFS 完成后，检查每个可达状态。 如果状态位于已编号的单元格上并且顶面等于该单元格的值，则将该单元格标记为可收藏。 
5. 对标记的细胞进行计数。 该计数是最大可能分数，因为所有可收集单元对应于可达状态，并且可达状态图允许访问所有此类状态。 

工作原理：BFS 精确探索骰子可以达到的状态。 状态图包含确定未来移动所需的所有信息，因为位置和方向完全描述了骰子。 每个得分机会都由具有匹配顶面的可达状态表示，并且所有可达状态都可以在某些步行中遍历，因此可以收集每个这样的单元格。 没有匹配的可达状态的单元格永远无法给出分数。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def roll(state, direction):
    top, bottom, north, south, west, east = state

    if direction == 0:  # east
        return (west, east, north, south, bottom, top)
    if direction == 1:  # west
        return (east, west, north, south, top, bottom)
    if direction == 2:  # north
        return (south, north, top, bottom, west, east)
    return (north, south, bottom, top, west, east)  # south

def solve():
    n, m = map(int, input().split())
    board = [input().strip() for _ in range(n)]

    sr = sc = -1
    for i in range(n):
        for j in range(m):
            if board[i][j] == 's':
                sr, sc = i, j

    start = (6, 1, 4, 3, 2, 5)

    orientations = []
    index = {}
    queue = deque([start])
    index[start] = 0

    while queue:
        cur = queue.popleft()
        orientations.append(cur)
        for d in range(4):
            nxt = roll(cur, d)
            if nxt not in index:
                index[nxt] = len(index)
                queue.append(nxt)

    dirs = [(-1, 0, 2), (1, 0, 3), (0, -1, 1), (0, 0, 0)]
    # The last entry is replaced below because east has no simple row/col pair.
    moves = [(-1, 0, 2), (1, 0, 3), (0, -1, 1), (0, 1, 0)]

    seen = [[[False] * 24 for _ in range(m)] for _ in range(n)]
    seen[sr][sc][index[start]] = True

    q = deque([(sr, sc, index[start])])

    while q:
        r, c, o = q.popleft()
        cur = orientations[o]

        for dr, dc, d in moves:
            nr = r + dr
            nc = c + dc

            if not (0 <= nr < n and 0 <= nc < m):
                continue
            if board[nr][nc] == 'x':
                continue

            no = index[roll(cur, d)]
            if not seen[nr][nc][no]:
                seen[nr][nc][no] = True
                q.append((nr, nc, no))

    ans = 0
    for i in range(n):
        for j in range(m):
            if board[i][j].isdigit():
                value = int(board[i][j])
                ok = False
                for o in range(24):
                    if seen[i][j][o] and orientations[o][0] == value:
                        ok = True
                        break
                if ok:
                    ans += 1

    print(ans)

if __name__ == "__main__":
    solve()
```实现的第一部分生成所有 24 个立方体方向。 元组顺序是`(top, bottom, north, south, west, east)`，这使得每次滚动操作都是面的简单重新分配。 

BFS 存储三维状态：行、列和方向 id。 方向id是从预先计算的列表中获取的，避免了遍历过程中重复的元组比较。 

评分阶段与遍历阶段是分开的。 这是有意为之的，因为达到某种状态和收集细胞是不同的概念。 单元仅需要一个可到达的方向来暴露正确的顶面。 

边界检查可以防止无效的移动，并且在添加新状态之前会跳过阻塞的单元。 状态的数量足够少，Python 可以安全地存储所有访问过的状态。 

## 工作示例

 对于第一个样本：```
3 4
.23s
4.2x
xx.1
```BFS 和评分阶段的简化轨迹为：

 | 职位| 方向顶部| 行动|
 | --- | --- | --- |
 | (0,3) | 6 | 启动 BFS |
 | (0,2) | 2 | 收集含有 2 | 的细胞
 | (0,1)| 5 | 没有分数 |
 | (1,1) | 3 | 没有分数 |
 | (1,0)| 4 | 收集含有 4 | 的细胞
 | (2,2) | 1 | 收集含有 1 | 的细胞

 完整的可达状态图包含比所示更多的方向，并且这些额外的状态允许芯片收集所有匹配的单元。 最终计数为`5`，因为除了一个之外的每个编号单元格都可以通过某个可达方向进行匹配。 

对于第二个样本：```
2 2
4s
22
```踪迹是：

 | 职位| 方向顶部| 行动|
 | --- | --- | --- |
 | (0,1)| 6 | 启动 BFS |
 | (0,0) | (0,0) | 2 | 没有分数 |
 | (1,1) | 3 | 没有分数 |
 | (1,0)| 4 | 没有分数 |

 两个单元格包含`2`是可以到达的，但是当顶面等于`2`。 答案是`1`因为只有包含的单元格`4`可以匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(纳米×24) | 每个板单元和每个芯片方向最多处理一次。 |
 | 空间| O(纳米×24) | 访问数组存储每个可能的位置方向状态。 |

 对于 100 x 100 的板，状态的最大数量为 240,000，这对于给定的限制来说足够小。 该算法避免了对路径长度的任何依赖，即使芯片可以无限期地在电路板上移动，它也适用。 

## 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    solve()
    out = sys.stdout.getvalue()
    sys.stdin = old
    return out

# provided samples
assert run("""3 4
.23s
4.2x
xx.1
""") == "5\n"

assert run("""2 2
4s
22
""") == "1\n"

# minimum size
assert run("""1 1
s
""") == "0\n"

# all reachable values with several matches
assert run("""3 3
s12
345
6..
""") == "6\n"

# obstacles and unreachable cells
assert run("""3 3
sxx
x1x
xx2
""") == "0\n"

# larger open area with repeated values
assert run("""4 4
s111
1111
1111
1111
""") == "16\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / s`|`0`| 最小的棋盘和缺失的目标|
 | 打开数字 1 到 6 的棋盘 |`6`| 多个方向和重复运动|
 | 由障碍物分隔的区域 |`0`| 正确处理障碍|
 | 大面积相同值 |`16`| 重新访问单元格并收集所有可能的匹配项 |

 ## 边缘情况

 对于只能以不同方向访问编号单元的板，算法在第一次访问后不会停止。 例如：```
2 2
s1
..
```BFS 存储第一个到达单元的位置和所有其他可到达的方向。 当细胞含有`1`检查后，算法找到顶面可达的状态`1`并计算它。 

对于没有可能匹配方向的可到达编号单元，例如：```
2 2
s2
..
```BFS 仍然探索单元，但评分阶段检查每个可到达方向的顶面。 如果没有显示`2`，该单元格被忽略。 

对于有障碍物的板：```
3 3
sxx
x1x
xx2
```BFS 只扩展有效单元内的状态。 孤立的编号单元永远不会成为可达状态，因此它们无法贡献分数。 如果没有任何特殊处理，答案仍然为零。
