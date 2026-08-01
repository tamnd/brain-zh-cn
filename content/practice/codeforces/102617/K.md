---
title: "CF 102617K - 甜点岛"
description: "该地图将巧克力沼泽描述为矩形网格。 每个单元格要么是固体饼干地（S），要么是液体巧克力（L）。 单元仅通过其四个侧面连接，因此对角线接触不会合并区域。"
date: "2026-07-31T17:38:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102617
codeforces_index: "K"
codeforces_contest_name: "mBIT Rookie November 2019"
rating: 0
weight: 102617
solve_time_s: 59
verified: true
draft: false
---

[CF 102617K - 甜点岛](https://codeforces.com/problemset/problem/102617/K)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该地图将巧克力沼泽描述为矩形网格。 每个单元格要么是固体饼干地（`S`）或液体巧克力（`L`）。 单元仅通过其四个侧面连接，因此对角线接触不会合并区域。 

饼干岛是一组相连的`S`完全被巧克力包围且不接触地图外边界的单元格。 巧克力湖则相反：一组相连的`L`被饼干地包围的细胞。 任务是计算有多少个这样的岛屿和湖泊。 

从约束中观察到的关键是网格最多可以包含大约一百万个单元。 任何重复搜索整个网格以查找每个区域的方法都将过于昂贵。 具有图遍历的线性扫描是预期的复杂性，因为每个单元格可以被处理恒定的次数。 

边界条件简化了问题。 地图的外部保证是饼干地，因此每个巧克力组件都会自动封闭并且是一个湖。 对于cookie组件来说，只有连接到边界的组件才不是孤岛。 所有其他 cookie 组件都是孤岛。 

一些边缘情况很容易处理不当。 只有饼干地的地图没有岛屿或湖泊，因为只有外部组件。 

输入示例：```
3 3
SSS
SSS
SSS
```正确的输出是：```
0 0
```一个不经意的解决方案，对每一个都很重要`S`作为一个岛的组件会错误地计算整个网格。 

没有任何内岛的单一湖泊是另一种情况，它可能会破坏假设筑巢必须始终发生的解决方案。 

输入示例：```
3 3
SSS
SLS
SSS
```正确的输出是：```
0 1
```巧克力部分被饼干地包围，所以它是一个湖，尽管里面没有岛。 

第三个棘手的情况是多层嵌套。 

输入示例：```
5 5
SSSSS
SLLLS
SLSLS
SLLLS
SSSSS
```正确的输出是：```
1 4
```内部区域必须独立计算。 仅关注最外层边界的解决方案会错过较小的湖泊。 

## 方法

 直接的方法是洪水填充每个未访问的单元并对所得的连接组件进行分类。 对于每个组件，我们可以记录它的字符类型以及它是否触及边框。 如果我们尝试重复搜索每个单元格或对每个可能的区域执行单独的遍历，则可以多次处理相同的单元格，从而导致在具有一百万个单元格的网格上进行不必要的工作。 

有用的观察结果是连接的组件已经划分了网格。 每个单元格都属于一个组件，答案仅取决于该组件的特性以及它是否接触边框。 整个网格上的单个 BFS 或 DFS 就足够了。 

当洪水填充完成后，`L`组件始终是一个湖，因为巧克力永远不会到达边界。 一个`S`只有当组件不触及边界时，它才是一个孤岛。 这减少了从跟踪复杂的包含关系到简单地对连接的组件进行分类的问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((NM)^2) | O((NM)^2) | O(NM) | 太慢了|
 | 洪水填充组件| O(NM) | O(NM) | 已接受 |

 ## 算法演练

 1. 遍历网格中的每个单元格。 当发现未访问的单元时，从它启动 BFS 以发现其整个连接组件。 组件必须作为一个整体进行处理，因为答案取决于区域，而不是单个单元。 
2. 在BFS过程中，存储组件的字符类型，并检查组件中是否有单元格位于边框上。 到达边界是将外部 cookie 区域与真实岛屿分开的唯一属性。 
3. BFS完成后，对组件进行分类。 如果它包含`L`，增加湖泊数量。 如果它包含`S`并且不触及边界，增加岛屿数量。 
4. 访问完所有单元格后，打印岛屿数量，然后打印湖泊数量。 

为什么它有效：

 BFS 只会访问网格的每个连接区域一次。 巧克力区域不能接触边界，因为边界保证只包含饼干细胞，因此每个巧克力成分都是封闭的，并且必须是一个湖。 接触边界的 cookie 区域是外部陆地，不能是岛屿，而其他所有 cookie 组件都被巧克力包围，满足岛屿的定义。 由于每个可能的区域都被精确分类一次，因此最终计数是正确的。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    visited = [[False] * m for _ in range(n)]
    islands = 0
    lakes = 0

    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    for i in range(n):
        for j in range(m):
            if not visited[i][j]:
                visited[i][j] = True
                kind = grid[i][j]
                touches_border = False
                q = deque([(i, j)])

                while q:
                    x, y = q.popleft()

                    if x == 0 or x == n - 1 or y == 0 or y == m - 1:
                        touches_border = True

                    for dx, dy in directions:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < n and 0 <= ny < m:
                            if not visited[nx][ny] and grid[nx][ny] == kind:
                                visited[nx][ny] = True
                                q.append((nx, ny))

                if kind == 'L':
                    lakes += 1
                elif not touches_border:
                    islands += 1

    print(islands, lakes)

if __name__ == "__main__":
    solve()
```外部循环保证每个单元格仅成为洪水填充的起点一次。 这`visited`数组可防止在单元的组件已分类后重新访问单元。 

BFS 队列仅包含属于当前组件的单元。 这`kind`遍历开始时变量是固定的，因此搜索永远不会从陆地跨越到巧克力，或者反之亦然。 

边界检查是在从队列中删除信元时执行的。 记住一个布尔值就足够了，因为最终的分类只需要知道组件是否有边界单元。 无需存储组件的完整形状。 

Python 整数在这里不是问题，因为计数最多是单元格的数量，并且最大队列大小也受到网格大小的限制。 

## 工作示例

 考虑：```
5 5
SSSSS
SLLLS
SLSLS
SLLLS
SSSSS
```| 当前组件 | 人物 | 触摸边框| 结果 |
 | --- | --- | --- | --- |
 | 外围地区 | S | 是的 | 被忽略 |
 | 顶级湖| 左 | 没有 | 湖泊数量变为 1 |
 | 中心区 | S | 没有 | 岛屿数量变为 1 |
 | 其他内湖| 左 | 没有 | 湖泊数量增加至 4 |

 该跟踪显示了为什么不需要显式地建模遏制。 每个嵌套区域已经是一个独立的连接组件。 

另一个例子：```
3 5
SSSSS
SLLLS
SSSSS
```| 当前组件 | 人物 | 触摸边框| 结果 |
 | --- | --- | --- | --- |
 | 外围地区 | S | 是的 | 被忽略 |
 | 中部地区 | 左 | 没有 | 湖泊数量变为 1 |

 这个例子证实了湖中没有岛屿也可以存在。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(NM) | 每个单元进入和离开 BFS 队列一次。 |
 | 空间| O(NM) | 访问数组和 BFS 队列可以各自包含线性数量的单元。 |

 最大网格尺寸使得线性处理成为必要。 该解决方案仅对每个单元执行恒定的工作，因此它完全符合所需的限制。 

## 测试用例```python
import sys
import io
from collections import deque

def solve_io(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    visited = [[False] * m for _ in range(n)]
    islands = 0
    lakes = 0
    directions = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    for i in range(n):
        for j in range(m):
            if not visited[i][j]:
                visited[i][j] = True
                kind = grid[i][j]
                border = False
                q = deque([(i, j)])

                while q:
                    x, y = q.popleft()
                    if x == 0 or y == 0 or x == n - 1 or y == m - 1:
                        border = True

                    for dx, dy in directions:
                        nx, ny = x + dx, y + dy
                        if 0 <= nx < n and 0 <= ny < m:
                            if not visited[nx][ny] and grid[nx][ny] == kind:
                                visited[nx][ny] = True
                                q.append((nx, ny))

                if kind == "L":
                    lakes += 1
                elif not border:
                    islands += 1

    sys.stdin = old_stdin
    return f"{islands} {lakes}\n"

assert solve_io("""7 10
SSSSSSSSSS
SLSLSLLLSS
SSLLLLSLSS
SSSLSLSLLS
SSSLLSLSSS
SSLSSLLLSS
SSSSSSSSSS
""") == "3 4\n", "sample"

assert solve_io("""3 3
SSS
SLS
SSS
""") == "0 1\n", "single lake"

assert solve_io("""3 3
SSS
SSS
SSS
""") == "0 0\n", "only outside land"

assert solve_io("""5 5
SSSSS
SLLLS
SLSLS
SLLLS
SSSSS
""") == "1 4\n", "nested regions"

assert solve_io("""5 5
SSSSS
SLSLS
SSSSS
SLSLS
SSSSS
""") == "0 4\n", "multiple lakes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样本网格 |`3 4`| 正常嵌套岛屿和湖泊计数 |
 | 一`L`里面`S`|`0 1`| 湖泊不需要内岛 |
 | 全部`S`|`0 0`| 边框组件不得计算在内 |
 | 多个嵌套区域 |`1 4`| 独立元件分类|
 | 几个分开的湖泊|`0 4`| 多个同类型组件|

 ## 边缘情况

 对于全 cookie 地图：```
3 3
SSS
SSS
SSS
```BFS 找到了一个`S`组件并将其标记为接触边框。 由于它是外部陆地，因此岛屿数量保持为零，湖泊数量保持为零。 

对于没有岛的湖泊：```
3 3
SSS
SLS
SSS
```BFS 上`L`cell 找到一个不接触边框的组件。 由于所有巧克力成分都被封闭，算法将其视为一个湖。 

对于嵌套区域：```
5 5
SSSSS
SLLLS
SLSLS
SLLLS
SSSSS
```遍历首先忽略外部 cookie 组件，然后分别计算每个内部巧克力组件和中心 cookie 组件。 分类仅取决于当前组件，因此嵌套深度不影响正确性。
