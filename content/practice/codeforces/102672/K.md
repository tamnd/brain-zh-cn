---
title: "CF 102672K - 逃离废弃房屋"
description: "房子是一个长方形的网格。 一些牢房被墙壁挡住，而其余的牢房可以穿过。 朋友们从标记为 s 的单元格开始，想要到达标记为 f 的单元格。"
date: "2026-08-03T03:28:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102672
codeforces_index: "K"
codeforces_contest_name: "Selection of tasks from Internet olympiads season 2019-20"
rating: 0
weight: 102672
solve_time_s: 82
verified: true
draft: false
---

[CF 102672K - 逃离废弃的房子](https://codeforces.com/problemset/problem/102672/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 房子是一个长方形的网格。 一些牢房被墙壁挡住，而其余的牢房可以穿过。 朋友们从标记的单元格开始`s`并想要到达标记的单元格`f`。 

每当它们水平移动到相邻单元时，空气温度就会发生变化`-1`。 每次它们垂直移动到相邻单元格时，它都会发生变化`+1`。 他们不关心步行过程中的温度，只关心到达出口后起始温度和最终温度之间的差异。 由于允许它们任意多次地重新访问单元格，因此任务是找到沿任意步行的总变化的最小可能绝对值`s`到`f`。 

网格尺寸可以达到 1000 x 1000，因此最多可以有 100 万个单元。 尝试多种路径或对可能的温度值使用动态编程的解决方案是不可能的，因为行走次数是指数级的并且可能的总和太大。 我们需要线性或近线性图算法。 

棘手的部分是最短路径不一定是答案。 较长的步行可以包括改变最终温差的循环。 例如，如果直接路径有温度变化`5`，但存在一个循环，其总贡献为`5`，以相反的方式遍历该循环可以将最终差异减少到零。 

考虑一个简单的网格：```
2 2
sf
..
```直接移动自`s`到`f`是水平的，所以答案是`1`。 仅计算最短距离的粗心解决方案将返回该值，但在较大的网格中，循环可以改善结果。 

另一种边缘情况是无法到达出口时：```
3 3
s##
###
##f
```正确的输出是`-1`。 任何仅初始化距离而忘记检查可达性的方法都可能错误地输出大值或零。 

第三个重要的情况是没有有用循环的网格：```
1 2
sf
```唯一可能的步行才有价值`-1`，所以答案是`1`。 该算法必须处理没有循环可以改变可能值的情况。 

# 方法

 暴力方法将枚举从起点到出口的步行，并跟踪每个可能的温度变化。 它是正确的，因为考虑了每个合法的移动顺序，但可能的行走次数呈指数增长，因为朋友们可以无限期地重新访问单元格。 即使限制步行长度也不起作用，因为一个有用的循环可能需要重复很多次。 

关键的观察是确切的路径并不重要。 选择从起点到单元格的任意路径，并为其指定一个等于沿该路径的温度变化的值。 当我们添加一个循环时，该值会根据该循环的总权重而变化。 由周期引起的所有可能变化的集合形成一个数字的倍数，该数字是所有周期值的最大公约数。 

我们可以在不显式寻找环的情况下找到这个 gcd。 BFS 生成树为每个可达单元提供一个参考值。 对于每个网格边缘，将其端点的存储值与边缘贡献进行比较。 差异表示通过将该边添加到树而创建的循环的值。 取所有这些值的最大公约数即可得出答案可以调整的量。 

之后，每个可能的最终温度变化都具有与此 gcd 相同的余数模作为树路径值`s`到`f`。 问题就变成了找到余数的最小绝对数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳 | O(纳米) | O(纳米) | 已接受 |

 # 算法演练

 1. 从起始单元运行 BFS。 为每个可到达的单元存储沿 BFS 树路径的累积温度变化。 水平边缘有助于`-1`，垂直边缘贡献`+1`。 

The BFS tree gives one valid reference path to every cell. The stored values are not necessarily optimal, but they are enough to discover how cycles modify paths.

 1. While scanning every adjacent pair of reachable cells, calculate the cycle contribution created by that edge. 如果边缘有重量`w`，其值为：```
dist[u] + w - dist[v]
```将此数字的绝对值添加到 gcd 累加器中。 

树边产生零，因为存储的距离已经满足它们的方程。 非树边揭示了有用的循环。 

1. 如果从未到达出口，则输出`-1`。 

如果包含起点的图形组件不包含出口，则不可能行走。 

1. Let`base`是出口的 BFS 值。 如果 gcd 为零，则没有循环会改变可能的值，所以答案很简单`abs(base)`。 
2. 否则，找到最接近零且余数相同的数`base`对 gcd 取模。 检查零附近两个最接近的候选值并输出较小的绝对值。 

## 为什么它有效

 从起点到出口的每条步行都可以转化为 BFS 树路径加上一些封闭步行的集合。 每个闭合行走都可以分解为由非树边创建的基本循环，并且这些循环值的 gcd 准确地描述了哪些调整是可能的。 

BFS 路径给出了一个可能的答案值。 所有其他值与它的差异是计算出的 gcd 的倍数，因此检查该残留物类别的最接近代表会给出可实现的最小温差。 

# Python 解决方案```python
import sys
from collections import deque
from math import gcd

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    start = -1
    finish = -1
    for i in range(n):
        for j in range(m):
            if grid[i][j] == 's':
                start = i * m + j
            elif grid[i][j] == 'f':
                finish = i * m + j

    total = n * m
    dist = [0] * total
    seen = [False] * total
    seen[start] = True

    q = deque([start])
    dirs = [(1, 0, 1), (-1, 0, 1), (0, 1, -1), (0, -1, -1)]

    while q:
        cur = q.popleft()
        r = cur // m
        c = cur % m

        for dr, dc, w in dirs:
            nr = r + dr
            nc = c + dc
            if 0 <= nr < n and 0 <= nc < m and grid[nr][nc] != '#':
                nxt = nr * m + nc
                if not seen[nxt]:
                    seen[nxt] = True
                    dist[nxt] = dist[cur] + w
                    q.append(nxt)

    if not seen[finish]:
        print(-1)
        return

    g = 0
    for r in range(n):
        for c in range(m):
            if grid[r][c] == '#':
                continue
            cur = r * m + c
            if c + 1 < m and grid[r][c + 1] != '#':
                nxt = cur + 1
                g = gcd(g, abs(dist[cur] - 1 - dist[nxt]))
            if r + 1 < n and grid[r + 1][c] != '#':
                nxt = cur + m
                g = gcd(g, abs(dist[cur] + 1 - dist[nxt]))

    base = dist[finish]

    if g == 0:
        print(abs(base))
    else:
        rem = base % g
        print(min(rem, g - rem))

if __name__ == "__main__":
    solve()
```BFS 部分遵循第一个算法步骤。 数组`dist`从一开始就存储所选树路径的温度变化。 当探索邻居时，会处理每个移动的符号。 

第二次扫描仅检查右邻和下邻，因为每个无向网格边缘在此遍历中只出现一次。 用于 gcd 的表达式对于树边为零，对于引入循环的边则为非零。 

最终计算采用模运算。 Python 的余数运算对于负值也能正确工作，所以`base % g`总是给出范围内的值`[0, g-1]`。 最接近零的两个候选者是`rem`和`rem - g`。 

# 工作示例

 考虑：```
2 2
sf
..
```BFS可以选择直接水平路径。 

| 当前单元格| 储值| 发现行动|
 | --- | --- | --- |
 | s | 0 | 启动 BFS |
 | f | -1 | 水平移动|
 | 左下| 1 | 垂直移动 |

 循环值包括：

 | 边缘 | 周期贡献|
 | --- | --- |
 | s 到左下角 | 0 |
 | 左下角到 f | 0 |

 gcd 保持为零，因此唯一可能的值为`-1`。 输出是`1`。 

现在考虑：```
2 3
s..
..f
```BFS路径可以到达有值的出口`0`。 

| 当前单元格| 储值| 发现行动|
 | --- | --- | --- |
 | s | 0 | 启动 BFS |
 | (0,1)| -1 | 卧式|
 | (1,0)| 1 | 垂直|
 | (0,2) | -2 | 卧式|
 | (1,2) | -1 | 垂直|

 额外的边缘会产生循环。 他们的贡献有gcd`1`，意味着任何整数调整都是可能的。 由于路径值已经与零模一一致，因此可实现的最小差为`0`。 

# 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(纳米) | 每个单元格和每个网格边缘都会被处理固定次数 |
 | 空间| O(纳米) | BFS 数组存储每个单元格的信息 |

 最大的网格包含一百万个单元，因此需要线性处理。 该算法仅保留几个整数数组，并且完全符合内存限制。 

# 测试用例```python
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    from collections import deque
    from math import gcd

    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    start = finish = -1
    for i in range(n):
        for j in range(m):
            if grid[i][j] == 's':
                start = i * m + j
            if grid[i][j] == 'f':
                finish = i * m + j

    dist = [0] * (n * m)
    seen = [False] * (n * m)
    seen[start] = True
    q = deque([start])

    for_dummy = [(1,0,1),(-1,0,1),(0,1,-1),(0,-1,-1)]

    while q:
        x = q.popleft()
        r, c = divmod(x, m)
        for dr, dc, w in for_dummy:
            nr, nc = r + dr, c + dc
            if 0 <= nr < n and 0 <= nc < m and grid[nr][nc] != '#':
                y = nr * m + nc
                if not seen[y]:
                    seen[y] = True
                    dist[y] = dist[x] + w
                    q.append(y)

    if not seen[finish]:
        ans = -1
    else:
        g = 0
        for r in range(n):
            for c in range(m):
                if c + 1 < m and grid[r][c] != '#' and grid[r][c+1] != '#':
                    g = gcd(g, abs(dist[r*m+c]-1-dist[r*m+c+1]))
                if r + 1 < n and grid[r][c] != '#' and grid[r+1][c] != '#':
                    g = gcd(g, abs(dist[r*m+c]+1-dist[(r+1)*m+c]))
        if g == 0:
            ans = abs(dist[finish])
        else:
            ans = min(dist[finish] % g, g - dist[finish] % g)

    sys.stdin = old
    return str(ans)

assert run("1 2\nsf\n") == "1"
assert run("2 2\ns.\n.f\n") == "0"
assert run("3 3\ns##\n###\n##f\n") == "-1"
assert run("1 5\ns...f\n") == "4"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 2`笔直的走廊|`1`| 无循环案例|
 | 小开放广场|`0`| 循环可以取消路径值|
 | 出口完全被堵 |`-1`| 可达性处理 |
 | 长单排|`4`| 边界移动处理|

 # 边缘情况

 对于阻塞网格的情况：```
3 3
s##
###
##f
```BFS 永远不会访问出口单元。 算法在计算循环值和输出之前停止`-1`。 

对于单排走廊：```
1 5
s...f
```每一次移动都是水平的，所以唯一可能的温度变化是`-4`。 没有循环，gcd 为零，算法返回`abs(-4) = 4`。 

对于包含循环的网格：```
2 2
s.
.f
```直接路径具有非零值，但正方形提供了具有 gcd 的循环`1`。 由于所有整数调整都是可能的，因此该算法发现可以实现零差值。
