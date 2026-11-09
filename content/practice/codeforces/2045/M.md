---
title: "CF 2045M - 镜子迷宫"
description: "将激光束视为沿着细胞之间的网格线移动。 每当光束通过一侧进入单元格时，该单元格的内容就决定了它从哪一侧离开。 空单元格不会改变方向。"
date: "2026-06-08T09:20:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dfs-and-similar", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2045
codeforces_index: "M"
codeforces_contest_name: "2024-2025 ICPC Asia Jakarta Regional Contest (Unrated, Online Mirror, ICPC Rules, Teams Preferred)"
rating: 1800
weight: 2045
solve_time_s: 94
verified: true
draft: false
---

[CF 2045M - 镜子迷宫](https://codeforces.com/problemset/problem/2045/M)

 **评分：** 1800
 **标签：** 暴力破解、dfs 和类似、图表、实现
 **求解时间：** 1m 34s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将激光束视为沿着细胞之间的网格线移动。 每当光束通过一侧进入单元格时，该单元格的内容就决定了它从哪一侧离开。 

空单元格不会改变方向。 一个`/`镜子以一种方式将光束旋转 90 度，并且`\`镜子以另一种方式将其旋转 90 度。 

将激光器放置在网格外部的一个边界开口上。 进入网格后，光束遵循确定的路径，直到最终再次离开网格。 

我们必须找到每个边界开口，其光束至少撞击网格中的每个镜像单元一次。 

网格尺寸最大为200×200。只有`2(R + C)`可能的激光位置，最多 800 个。可以从每个边界进行直接模拟，但我们必须注意每次模拟需要完成多少工作。 

微妙的部分是理解“击中每面镜子”的含义。 每当光束进入该单元并在镜子上反射时，镜子就会被击中。 我们不在乎它被击中多少次。 

一个常见的错误是独立地从每个边界进行模拟并计算访问过的镜像。 这是可行的，但它忽略了迷宫更强大的结构特性。 

另一个容易犯的错误是假设不同的入口产生不相关的路径。 事实上，每个光束路径都是完全由网格确定的固定图的一部分。 一旦构建了该图表，几乎可以立即提取所有答案。 

考虑这个小例子：```
1 1
/
```唯一的镜子被所有四个可能的入口接触，因此答案包含所有四个边界位置。 

仅跟踪单元而不跟踪波束状态的解决方案可能会失败，因为从不同方向进入同一单元可能会导致不同的延续。 

## 方法

 蛮力的想法很简单。 对于每个边界入口，模拟光束直到它离开网格。 在模拟过程中，标记每个触摸过的镜子。 如果所有镜子都被触摸，记录该入口。 

最多一个光束可以访问`O(RC)`状态，因为状态是由单元格和方向决定的。 有`O(R + C)`入口。 总复杂度变为`O((R + C)RC)`。 

和`R = C = 200`，这大约是```
800 × 40000 = 32,000,000
```状态转换。 

这并不是大得离谱，但有一个更清晰的观察结果。 

光束的运动是完全确定的。 每个单元的每一侧都恰好连接到另一侧。 这意味着整个迷宫实际上是连接路径组件的集合。 

我们可以一次构建这些组件，而不是单独跟踪每个激光。 

将每个单元边表示为一个节点。 

在单元格内部，内容决定了哪一侧相连：

 对于空单元格：```
N <-> S
W <-> E
```为了`/`：```
N <-> W
S <-> E
```为了`\`：```
N <-> E
S <-> W
```相邻的单元格也通过它们的共同边界连接。 

添加所有连接后，每个节点都属于某个 DSU 组件。 

现在考虑镜像单元。 

当光束的路径进入穿过镜子的两个分量分支之一时，光束击中该镜子。 对于每个组件，我们可以计算出该组件可到达的镜像数量。 

如果边界开口属于可以到达所有镜子的组件，则该开口是有效答案。 

这将整个问题简化为一个 DSU 构造加上一次计数过程。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O((R+C)RC) | O((R+C)RC) | O(RC) | 概念上太慢，没有必要 |
 | 最佳 | O(RC α(RC)) | O(RC) | 已接受 |

 ## 算法演练

 1. 为每个单元的每一侧创建一个 DSU 节点。 
2. 根据单元内容连接单元两侧。 

对于空单元格，将北与南连接，将西与东连接。 

对于一个`/`镜子，连接北与西，南与东。 

对于一个`\`镜子，连接东西南北。 
3. 使用两个相邻小区自动共享同一边界节点的编号方案。 

该模型可以模拟跨单元格边界的移动，而无需稍后添加额外的边缘。 
4. 执行所有并集后，每个 DSU 分量代表一个最大光束轨迹分量。 
5.让`tot`是镜子的总数。 
6. 对于每个镜像单元，确定对应于该镜像两侧的两个 DSU 组件。 

为了`/`，镜子分开`(N,W)`从`(S,E)`。 

为了`\`，镜子分开`(N,E)`从`(S,W)`。 

属于任何一侧的光束都可以击中该镜子。 
7. 对于每个镜像，向两个相关的 DSU 组件添加一个计数。 

如果两边属于同一个组件，则只添加一次。 
8. 对于每个边界开口，找到其 DSU 组件。 
9. 如果该组件的计数等于`tot`，那么每个镜子都可以从该入口到达，因此记录相应的答案字符串。 

### 为什么它有效

 DSU 组件表示由确定性移动规则连接的所有光束状态。 

对于特定的镜子，只有当光束属于接触该镜子的两个轨迹分量之一时，光束才能击中它。 在计数步骤中，我们准确地为这些组件注册该镜像。 

处理完所有镜子后，`cnt[component]`等于该组件内任何光束状态可以击中的不同镜子的数量。 

边界入口恰好属于一个组件。 它的光束可以击中每个镜子，前提是该组件与每个镜子相关联。 正是这个条件```
cnt[component] = total number of mirrors.
```所以每个报告的入口都是有效的，并且每个有效的入口都被报告。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

R, C = map(int, input().split())
grid = [input().strip() for _ in range(R)]

MAXN = 100000

parent = list(range(MAXN))
cnt = [0] * MAXN

def find(x):
    while parent[x] != x:
        parent[x] = parent[parent[x]]
        x = parent[x]
    return x

def union(a, b):
    ra = find(a)
    rb = find(b)
    if ra != rb:
        parent[ra] = rb

# directions:
# 1 = N, 2 = S, 3 = W, 4 = E
def node(i, j, d):
    if d == 1:
        return (i - 1) * C + j
    if d == 2:
        return i * C + j
    return (R + 1) * C + (i - 1) * (C + 1) + j + (1 if d == 4 else 0)

for i in range(1, R + 1):
    for j in range(1, C + 1):
        ch = grid[i - 1][j - 1]

        if ch == '.':
            union(node(i, j, 1), node(i, j, 2))
            union(node(i, j, 3), node(i, j, 4))
        elif ch == '/':
            union(node(i, j, 1), node(i, j, 3))
            union(node(i, j, 2), node(i, j, 4))
        else:  # '\'
            union(node(i, j, 1), node(i, j, 4))
            union(node(i, j, 2), node(i, j, 3))

total_mirrors = 0

for i in range(1, R + 1):
    for j in range(1, C + 1):
        ch = grid[i - 1][j - 1]

        if ch == '.':
            continue

        total_mirrors += 1

        if ch == '/':
            a = find(node(i, j, 1))
            b = find(node(i, j, 2))
        else:
            a = find(node(i, j, 1))
            b = find(node(i, j, 3))

        cnt[a] += 1
        if a != b:
            cnt[b] += 1

ans = []

for r in range(1, R + 1):
    if cnt[find(node(r, 1, 3))] == total_mirrors:
        ans.append(f"W{r}")

for r in range(1, R + 1):
    if cnt[find(node(r, C, 4))] == total_mirrors:
        ans.append(f"E{r}")

for c in range(1, C + 1):
    if cnt[find(node(1, c, 1))] == total_mirrors:
        ans.append(f"N{c}")

for c in range(1, C + 1):
    if cnt[find(node(R, c, 2))] == total_mirrors:
        ans.append(f"S{c}")

print(len(ans))
if ans:
    print(*ans)
```编号函数是关键的实现细节。 该编号方案不是为每个小区侧创建单独的节点，然后显式连接相邻小区，而是为共享边界的两侧分配相同的 ID。 它会自动模拟相邻细胞之间的运动。 

计数阶段也很微妙。 镜子贡献两个轨迹分量。 如果双方碰巧属于同一个 DSU 组件，则我们必须对该组件只计算一次镜像。 

边界开口直接对应于外边界段。 最后的四个循环只是测试这些边界节点。 

## 工作示例

 ### 示例 1```
1 1
/
```有一面镜子。 

| 镜子| 组件 A | 组件 B |
 | --- | --- | --- |
 | (1,1) '/' | 西北侧 | S/E 侧 |

 两个组件都接收计数`1`。 

| 入口| 组件数量 | 有效 |
 | --- | --- | --- |
 | N1 | 1 | 是的 |
 | S1 | 1 | 是的 |
 | W1 | 1 | 是的 |
 | E1 | 1 | 是的 |

 输出：```
4
N1 S1 W1 E1
```这表明可以从多个独立的边界入口到达单个镜子。 

### 示例 2```
2 2
..
./
```镜子总数 = 1。 

DSU 构建后，一些边界开口属于永远不会到达镜像的组件。 它们的组件数量仍然为零。 

| 入口| 组件数量 | 有效 |
 | --- | --- | --- |
 | N1 | 0 | 没有 |
 | 氮气 | 1 | 是的 |
 | W2 | 1 | 是的 |
 | S1 | 0 | 没有 |

 仅接受其组件看到镜子的入口。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(RC α(RC)) | 每个联合/查找操作几乎是恒定的 |
 | 空间| O(RC) | DSU 节点和镜像数量 |

 该网格最多包含 40,000 个单元格。 DSU节点的数量与网格边界的数量成正比，也与`O(RC)`。 这很容易满足 1 秒时间限制和内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    # paste solution into a solve() function and call it
    pass

# sample 1
# output order is not unique, so real judging should compare sets

# single mirror
inp = """\
1 1
/
"""

# every entrance hits the only mirror
# expected count = 4

# minimum size with backslash mirror
inp2 = """\
1 1
\\
"""

# all entrances valid again

# mirror isolated from some boundaries
inp3 = """\
2 2
..
./
"""

# no mirrors except one corner mirror

# large empty grid except one mirror
inp4 = "200 200\n" + ("." * 199 + "/\n") + ("." * 200 + "\n") * 199
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1×1`和`/`| 4 个回答 | 最小网格|
 |`1×1`和`\`| 4 个回答 | 镜面方向处理|
 | 单角镜| 部分入口| 边界测绘 |
 |`200×200`网格| 很快就完成了 | 最大约束|

 ## 边缘情况

 考虑```
1 1
/
```镜子的两侧属于不同的DSU组件。 该算法递增两个分量计数器。 每个边界开口都属于这两个组件之一，因此所有四个入口都会报告。 

考虑```
1 1
\
```镜像分区发生变化，但计数逻辑相同。 该算法不依赖于几何模拟，仅依赖于组件结构，因此两个镜像方向得到统一处理。 

考虑```
2 2
..
./
```几个边界开口属于从不接触镜子的组件。 它们的元件计数保持为零，而接触镜子的元件计数为一。 针对镜像总数的最终相等测试会自动将它们过滤掉。 

最微妙的情况是镜子的两侧都属于同一个 DSU 组件。 实施检查`if a != b`在添加第二个计数之前。 如果没有这个条件，镜子将被计算两次，并且一些有效的入口将被拒绝。
