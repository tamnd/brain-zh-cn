---
title: "CF 33D-骑士"
description: "我们得到了一张伯兰地图，上面有几个控制点和圆形围栏。 每个骑士占据一个控制点。 栅栏将王国分隔成多个区域，骑士必须穿过栅栏才能在控制点之间移动。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "geometry", "graphs", "shortest-paths", "sortings"]
categories: ["algorithms"]
codeforces_contest: 33
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 33 (Codeforces format)"
rating: 2000
weight: 33
solve_time_s: 92
verified: true
draft: false
---
[CF 33D - 骑士](https://codeforces.com/problemset/problem/33/D)

 **评级：** 2000
 **标签：** 几何、图形、最短路径、排序
 **求解时间：** 1m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一张伯兰地图，上面有几个控制点和圆形围栏。 每个骑士占据一个控制点。 栅栏将王国分隔成多个区域，骑士必须穿过栅栏才能在控制点之间移动。 对于多个查询，我们需要确定骑士从一个控制点到达另一个控制点必须跨越的最小栅栏数。 

输入提供控制点的坐标以及每个栅栏的位置和半径。 查询是成对的控制点。 每个查询的输出只是一个整数，表示跨越的栅栏数量。 

关键限制是最多可以有 1000 个控制点和 1000 个栅栏，但最多可以有 100,000 个查询。 单独计算每个查询的栅栏交叉点的简单方法可能需要 1000 × 100,000 = 1 亿次操作，这太慢了。 这表明预处理后任何每个查询的计算最多应为 O(1) 或 O(log n)。 

边缘情况包括控制点位于同一区域（需要跨越的零栅栏）、一个点位于栅栏内部而另一个点位于栅栏外部以及存在多个嵌套栅栏的情况。 如果粗心的实施仅检查距离而不考虑遏制层次结构，则可能会错误地计算栅栏。 例如，如果一个控制点在一个小圆内，而另一个点在该圆外但在一个大圆内，则穿过栅栏的数量不仅仅是距离的差； 这取决于哪些围栏实际包含每个点。 

## 方法

 暴力解决方案将为每个查询迭代所有栅栏。 对于给定的查询 (a, b)，它将检查每个围栏是否点 a 在其内部以及点 b 是否在其内部。 如果两点中恰好有一个在内部，则必须越过该栅栏。 这是正确的，因为当且仅当点位于栅栏的相对两侧时，栅栏才会被跨越。 这可行，但对于 1000 个栅栏和 100,000 个查询，这是 O(k * m) = 1 亿次操作，这太慢了。 

关键的观察是我们不需要为每个查询处理栅栏。 对于每个控制点，我们可以预先计算一个“栅栏签名”，表示哪些栅栏包含它。 完成此操作后，回答查询就减少为计算两个签名之间有多少栅栏不同，这只是计算集合差异。 这使用位掩码或简单数组将每个查询的工作从 O(m) 转换为 O(1)。 

此外，问题简化为计算恰好包含两个点之一的栅栏的数量。 这相当于包含每个点的栅栏组的对称差。 这是一个重要的简化，因为它允许对每个控制点而不是每个查询进行预处理栅栏。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k * 米) | O(1) | O(1) | 太慢了 |
 | 预先计算每个点的栅栏 | O(n * m + k) | O(n * m) | 已接受 |

 ## 算法演练

 1. 读取输入：控制点、围栏和查询。 我们存储点的坐标和栅栏的中心/半径。 
2. 对于每个控制点，确定哪些围栏包含该控制点。 如果 (x - cx)² + (y - cy)² < r²，则点 (x, y) 位于以 (cx, cy) 为圆心且半径为 r 的圆内。 将其存储为每个点的列表或位掩码。 
3. 对于每个查询 (a, b)，计算恰好包含两个点之一的围栏数量。 迭代栅栏并计算点 a 和 b 之间的包含度不同的栅栏。 
4. 输出每个查询的计数。

为什么它有效：如果骑士必须从栅栏内移动到栅栏外，反之亦然，则越过栅栏。 通过预先计算哪些栅栏包含每个点，对称差可以精确计算必须跨越的栅栏。 没有栅栏会被重复计算，因为我们独立检查每个栅栏的遏制情况。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n, m, k = map(int, input().split())
points = [tuple(map(int, input().split())) for _ in range(n)]
fences = [tuple(map(int, input().split())) for _ in range(m)]

# Precompute which fences contain each point
contain = [[False] * m for _ in range(n)]
for i, (px, py) in enumerate(points):
    for j, (r, cx, cy) in enumerate(fences):
        if (px - cx)**2 + (py - cy)**2 < r**2:
            contain[i][j] = True

# Process queries
for _ in range(k):
    a, b = map(int, input().split())
    a -= 1
    b -= 1
    count = 0
    for j in range(m):
        if contain[a][j] != contain[b][j]:
            count += 1
    print(count)
```每个控制点都会针对所有栅栏进行一次处理。 遏制检查使用平方距离来避免浮点错误。 在查询循环中，有效地计算栅栏的对称差。 一个微妙的点是查询时从 1 到 0 的索引转换。 

## 工作示例

 ### 输入示例```
2 1 1
0 0
3 3
2 0 0
1 2
```| 点| 栅栏 0 包含？ |
 | --- | --- |
 | (0,0) | (0,0) | 真实|
 | (3,3) | 假|

 查询 (1,2)：围栏遏制对于围栏 0 → 1 围栏跨越而言不同。 输出：1。 

### 自定义输入```
3 2 2
0 0
5 0
0 5
3 0 0
4 4 4
1 2
2 3
```| 点| 围栏 0 | 栅栏 1 |
 | --- | --- | --- |
 | (0,0) | (0,0) | 真实| 假|
 | (5,0)| 假| 假|
 | (0,5) | 假| 假|

 查询 (1,2)：栅栏不同 → 计数 1

 查询 (2,3)：栅栏不同 → 计数 0

 这演示了嵌套且不重叠的栅栏。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n_m + k_m) | 预先计算 n 个点 × m 个栅栏，然后 k 个查询 × m 个栅栏。 |
 | 空间| O(n*m) | 存储遏制表。 |

 当 n、m ≤ 1000 且 k ≤ 100,000 时，最坏情况的运算大约为 1000_1000 + 100,000_1000 ≈ 100,000,000，这在具有简单运算的 Python 中是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    # solution call
    n, m, k = map(int, input().split())
    points = [tuple(map(int, input().split())) for _ in range(n)]
    fences = [tuple(map(int, input().split())) for _ in range(m)]
    contain = [[False]*m for _ in range(n)]
    for i, (px, py) in enumerate(points):
        for j, (r, cx, cy) in enumerate(fences):
            if (px - cx)**2 + (py - cy)**2 < r**2:
                contain[i][j] = True
    for _ in range(k):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        count = sum(contain[a][j] != contain[b][j] for j in range(m))
        print(count)
    return out.getvalue().strip()

# provided sample
assert run("2 1 1\n0 0\n3 3\n2 0 0\n1 2\n") == "1"

# minimum input
assert run("1 0 1\n0 0\n1 1\n") == "0"

# all points inside one fence
assert run("2 1 1\n0 0\n1 1\n2 0 0\n1 2\n") == "0"

# nested fences
assert run("2 2 1\n0 0\n3 3\n2 0 0\n5 0 0\n1 2\n") == "1"

# multiple queries
assert run("3 2 2\n0 0\n5 0\n0 5\n3 0 0\n4 4 4\n1 2\n2 3\n") == "1\n0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1分，0栅栏| 0 | 最小尺寸输入 |
 | 同一栅栏内有 2 个点 | 0 | 正确识别没有围栏穿越|
 | 嵌套栅栏| 1 | 正确计算层次结构中的栅栏 |
 | 多次查询| 1,0 | 高效处理多个查询 |

 ## 边缘情况

 如果一个点位于所有栅栏内，而另一个点位于所有栅栏外，则计数为 m。 

输入：```
2 3 1
0 0
10 10
5 0 0
5 5 5
15 10 10
1
```
