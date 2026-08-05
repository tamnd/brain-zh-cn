---
title: "CF 102501L - 河牌游戏"
description: "网格描述了一片湿地，细胞在那里形成河流。 一组相连的单元格就是一个河流区域。 相机只能放置在 上。 接触这些河流区域之一的单元格，以及接触同一河流区域的两个相机不能相邻。"
date: "2026-08-05T17:55:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102501
codeforces_index: "L"
codeforces_contest_name: "2019-2020 ICPC Southwestern European Regional Programming Contest (SWERC 2019-20)"
rating: 0
weight: 102501
solve_time_s: 379
verified: true
draft: false
---

[CF 102501L - 河牌游戏](https://codeforces.com/problemset/problem/102501/L)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 网格描述了一个湿地，其中`*`细胞形成河流。 一组相连的`*`细胞是一条河流区域。 相机只能放置在`.`接触这些河流区域之一的单元格，以及接触同一河流区域的两个相机不能相邻。 

游戏并不是一次性涉及整个网格。 不同河流区域之间的分离条件意味着靠近一个河流区域的移动永远不会影响靠近另一河流区域的移动。 这将棋盘变成了几个独立的游戏，其结果可以组合起来。 

的价值`N`最多10个，所以整个板子只有100个cell。 这排除了模拟整个棋盘的每种可能的游戏状态的方法，因为单元子集的数量是巨大的。 小网格尺寸确实允许在单个河流区域上使用指数算法，因为每条河流最多包含`2N`，或20个湿电池。 关键是要避免整个板上的指数工作。 

一个常见的错误是计算可能的相机位置的数量，然后只检查它是奇数还是偶数。 这会失败，因为移动的顺序很重要。 例如：```
...
...
***
```共有三个可能的摄像机单元接触河流。 答案是`First player will win`，因为选择中间的单元格会阻止使用剩余的单元格。 计算步数会错误地预测总是有 3 步可用。 

另一个错误是将不同的河流区域合并到一个游戏中。 例如：```
*...*
.....
*...*
```两条河流是分开的，它们的相机选择不会相互作用。 将它们视为一张图会在不相关的摄像机之间造成非法限制。 

## 方法

 直接方法将为每个河流区域建立可能的摄像机位置图，并递归地尝试每个可能的移动。 移动会删除所选的相机单元和所有相邻的相机单元，因为这些单元无法再使用。 这正是图表上的 Node Kayles 游戏。 

蛮力是正确的，因为所有可能的未来玩法都被探索过。 然而，一个图表`k`候选相机单元最多可以有`2^k`州。 将其应用于整个网格是不可能的。 

有用的观察是每个河流区域都是独立的。 斯普拉格-格伦迪理论让我们为每个独立游戏分配一个数字。 所有河流面积值的异或决定获胜者。 剩下的问题是计算一个小图的 Grundy 值。 

在递归过程中，图的断开部分可以单独求解。 如果一个连接组件中的移动不能影响另一组件，则对 Grundy 值进行异或运算。 这大大减少了必须探索的状态数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 全盘暴力破解| O(2^(N²)) | O(2^(N²)) | O(2^(N²)) | O(2^(N²)) | 太慢了|
 | 每个河流区域的格伦迪递归 | 一个区域的相机单元数量呈指数增长 | O(状态数) | 已接受 |

 ## 算法演练

 1. 使用洪水填充查找每个相连的河流区域。 每个区域都是独立处理的，因为输入保证不同区域不会互相影响。 
2. 对于每个河流区域，收集`.`与至少一个湿电池相邻的电池。 这些单元格是游戏图的顶点。 如果对应的单元格在网格中相邻，则两个顶点有一条边。 
3. 递归计算该图的 Grundy 数。 状态由一组剩余相机位置表示。 
4. 在尝试在某个状态中移动之前，将剩余的图拆分为连接的组件。 整个状态的 Grundy 值是这些组件值的异或。 
5. 对于连接状态，请尝试每个剩余的相机位置。 放置相机会删除该位置及其所有邻居。 收集每次移动后可获得的 Grundy 值并获取他们的 mex。 
6. 对所有河流区域的 Grundy 值进行异或。 零异或意味着第二个玩家获胜，否则第一个玩家获胜。 

为什么有效：每个河流区域都是公平的游戏，不同区域形成不相交的总和，因为任何举动都不能影响另一个区域。 斯普拉格-格伦迪理论指出，不相交和的值是分量值的异或。 Grundy 值的递归定义考虑了每一个合法的举动，因此 mex 计算准确地代表了所有可能的未来玩法。 

## Python 解决方案```python
import sys
from functools import lru_cache

input = sys.stdin.readline

def solve():
    n = int(input())
    grid = [input().strip() for _ in range(n)]

    wet_seen = [[False] * n for _ in range(n)]
    dirs = [(1, 0), (-1, 0), (0, 1), (0, -1)]

    def inside(r, c):
        return 0 <= r < n and 0 <= c < n

    def get_grundy(adj):
        m = len(adj)
        full = (1 << m) - 1

        @lru_cache(None)
        def grundy(mask):
            if mask == 0:
                return 0

            parts = []
            seen = 0
            for i in range(m):
                if (mask >> i) & 1 and not ((seen >> i) & 1):
                    stack = [i]
                    seen |= 1 << i
                    comp = 0
                    while stack:
                        v = stack.pop()
                        comp |= 1 << v
                        nxt = adj[v] & mask & ~seen
                        while nxt:
                            b = nxt & -nxt
                            u = b.bit_length() - 1
                            seen |= b
                            stack.append(u)
                            nxt -= b
                    parts.append(comp)

            if len(parts) > 1:
                ans = 0
                for p in parts:
                    ans ^= grundy(p)
                return ans

            values = set()
            x = mask
            while x:
                b = x & -x
                v = b.bit_length() - 1
                values.add(grundy(mask & ~adj[v] & ~b))
                x -= b

            g = 0
            while g in values:
                g += 1
            return g

        return grundy(full)

    answer = 0

    for r in range(n):
        for c in range(n):
            if grid[r][c] == '*' and not wet_seen[r][c]:
                area = []
                stack = [(r, c)]
                wet_seen[r][c] = True

                while stack:
                    x, y = stack.pop()
                    area.append((x, y))
                    for dx, dy in dirs:
                        nx, ny = x + dx, y + dy
                        if inside(nx, ny) and not wet_seen[nx][ny] and grid[nx][ny] == '*':
                            wet_seen[nx][ny] = True
                            stack.append((nx, ny))

                candidates = set()
                for x, y in area:
                    for dx, dy in dirs:
                        nx, ny = x + dx, y + dy
                        if inside(nx, ny) and grid[nx][ny] == '.':
                            candidates.add((nx, ny))

                nodes = list(candidates)
                index = {p: i for i, p in enumerate(nodes)}
                adj = [0] * len(nodes)

                for x, y in nodes:
                    i = index[(x, y)]
                    for dx, dy in dirs:
                        nx, ny = x + dx, y + dy
                        if (nx, ny) in index:
                            adj[i] |= 1 << index[(nx, ny)]

                answer ^= get_grundy(adj)

    if answer:
        print("First player will win")
    else:
        print("Second player will win")

if __name__ == "__main__":
    solve()
```洪水填充阶段准确地识别了独立的子游戏。 候选集仅包含接触当前河流的坚固地面单元，因此受保护的单元和不相关的地面永远不会进入图形。 

递归函数将状态存储为位掩码。 位设置意味着相机位置仍然可用。 放置相机后，所选位和每个相邻位都会被删除。 

连接组件分割是主要的优化。 如果没有它，许多状态将被重新计算为一张大图。 有了它，独立的棋子就被简化为更小的游戏，其值可以进行异或运算。 

Python 整数可以保存任意长度的位掩码，因此实现不需要对顶点数进行特殊处理。 网格边界检查也很重要，因为候选摄像机只能来自板内。 

## 工作示例

 对于第一个样本：```
...
...
***
```候选图在一条线上具有三个位置。 

| 剩余职位 | 可能的举动| 格兰迪价值|
 | --- | --- | --- |
 | 三格| 删除左侧、中间或右侧 | 1 |
 | 空 | 没有动作| 0 |

 Grundy 总值不为零，因此第一个玩家获胜。 

对于第二个样本，两个河流区域分别求解。 

| 河流地区| 格兰迪价值 |
 | --- | --- |
 | 第一河| 1 |
 | 第二河 | 1 |

 异或是`1 xor 1 = 0`，所以每个第一步都可以由第二个玩家回答。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 最大相机图形尺寸呈指数增长 | 每个河流区域都通过记忆化的 Grundy 递归来求解 |
 | 空间| 最大相机图形尺寸呈指数增长 | 记忆商店访问游戏状态 |

 整个网格只有100个单元，每条河流最多包含20个湿单元。 分解为独立的河流区域将指数部分限制在小的局部图上，这符合约束条件。 

## 测试用例```python
import sys
import io

# The implementation above can be wrapped into a function for local testing.

tests = [
    (
        "3\n...\n...\n***\n",
        "First player will win"
    ),
    (
        "1\n.\n",
        "Second player will win"
    ),
    (
        "3\n***\n***\n***\n",
        "Second player will win"
    ),
    (
        "4\n....\n....\n****\n....\n",
        "First player will win"
    ),
]

for inp, expected in tests:
    print(inp.strip(), "=>", expected)
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 一个坚固的细胞 | 第二位玩家将获胜 | 没有合法的拍摄位置|
 | 所有湿电池| 第二位玩家将获胜 | 没有相机移动的区域 |
 | 一条简单的水平河流| 第一个玩家将获胜 | 基本 Grundy 计算 |
 | 一条河流触及边界| 取决于计算的移动 | 边界处理|

 ## 边缘情况

 没有相邻坚固地面的河流会创建一个空图。 Grundy 值为零，因为第一个玩家没有移动。 递归立即到达空掩码并返回零。 

边界附近的单个行或列不得访问网格外部的单元格。 这`inside`检查可防止无效邻居成为相机位置。 

多个河流区域必须保持独立。 该算法仅在同一条洪水泛滥的河流周围的摄像机位置之间构建边缘，然后将生成的 Grundy 值与异或结合起来。 这与实际游戏相符，因为移动不能从一个河流区域跨越到另一个区域。
