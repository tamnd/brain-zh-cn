---
title: "CF 105811K - 费城艺术博物馆"
description: "我们得到一棵以房间 1 为根的博物馆房间树，其中房间 1 是入口。 Kuroni 和 Tfg 两个人从入口处开始，总是沿着同一条路径一起移动。 在任何非叶子房间，必须选择一个儿童房间作为下一个目的地。"
date: "2026-06-25T15:21:51+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105811
codeforces_index: "K"
codeforces_contest_name: "UT Open 2025"
rating: 0
weight: 105811
solve_time_s: 48
verified: true
draft: false
---

[CF 105811K - 费城艺术博物馆](https://codeforces.com/problemset/problem/105811/K)

 **评级：** -
 **标签：** -
 **求解时间：** 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵以房间 1 为根的博物馆房间树，其中房间 1 是入口。 Kuroni 和 Tfg 两个人从入口处开始，总是沿着同一条路径一起移动。 

在任何非叶子房间，必须选择一个儿童房间作为下一个目的地。 Kuroni 选择第一步，然后 Tfg 选择下一步，然后 Kuroni 再次选择，依此类推。 由于图表是一棵树，并且禁止重新访问房间，因此他们的旅程只是一条从根到叶的路径。 

每个房间可能被 Kuroni、Tfg、两者都喜欢，或者都不被喜欢。 玩家的分数是最终路径上出现的喜欢的房间的数量。 

当玩家做出决定时，他们会采取最佳行动。 他们首先最大化自己的最终得分。 如果几个选项给自己的分数相同，他们会选择给另一位玩家分数最大的那个。 

任务是确定两名选手的最终得分。 

该树最多包含$10^5$节点。 任何独立探索每条可能的根到叶路径的解决方案都会立即被排除，因为这种大小的树可以包含线性数量的叶和指数级的多个决策序列（就深度而言）。 我们需要一个线性或近线性的解决方案。 

一个微妙的点是，玩家并没有试图最小化其他玩家的分数。 他们的决胜规则实际上是在自己的分数确定后进行合作。 

考虑这个小例子：```
1
|
2
```如果两个玩家都喜欢房间 1 和房间 2，那么答案很简单`(2, 2)`。 根本没有选择，因此博弈论推理仍然必须正确地包括每个访问过的房间。 

另一个容易犯的错误是忘记抢七规则。```
    1
   / \
  2   3
```假设Kuroni无论选择房间2还是房间3，最终得分都是相同的。那么她必须选择给Tfg最终得分较大的孩子。 仅最大化当前玩家得分而忽略平局的解决方案可能会产生错误的路径。 

第三个陷阱是忘记分数来自所选路径上的所有房间，而不仅仅是当前移动中选择的房间。 局部有吸引力的子树可能会在以后导致更糟糕的子树。 

## 方法

 暴力解决方案会将问题视为完整的博弈树。 我们在每个房间中尝试每个孩子，递归地评估最终的游戏状态，并根据玩家的偏好顺序进行选择。 这是正确的，因为它完全遵循最佳游戏规则。 

问题是许多子游戏会重复。 假设我们到达某个房间$u$现在轮到库罗尼了。 从该点开始的结果仅取决于以$u$轮到谁了。 它不依赖于到达的路径$u$。 

这一观察结果将游戏变成了树动态规划问题。 

通过两条信息定义状态：```
(current node, whose turn chooses next)
```对于每个节点，我们计算两个答案。`dp0[u]`是从以 为根的子树中获得的一对最终分数`u`当轮到库罗尼选择下一个房间时。`dp1[u]`是轮到 Tfg 时的相似对。 

如果`u`是一片叶子，没有留下任何决定。 路径立即结束，因此结果只是空间的贡献`u`。 

对于内部节点，当前玩家选择一个子节点。 游戏的其余部分正是轮次切换后该子项中相应的 DP 状态。 

唯一剩下的细节是比较规则。 

当 Kuroni 选择时，她首先喜欢较大的 Kuroni 分数，然后是较大的 Tfg 分数。 

当Tfg选择时，她优先选择较大的Tfg分数，然后是较大的Kuroni分数。 

选择最好的孩子后，我们添加当前房间的贡献。 

每个节点处理一次，每条边检查一次，给出线性时间解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 树深度呈指数增长 | O(深度) | 太慢了 |
 | 树上的最优 DP | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 以节点 1 为树的根。 
2. 执行 DFS 遍历并获取后序，以便每个子项都在其父项之前得到处理。 
3. 对于叶子节点`u`， 放：```
dp0[u] = dp1[u] = (a[u], b[u])
```由于没有剩余移动，路径仅由`u`。 
4. 计算`dp0[u]`。 

检查每一个孩子`v`。 

比赛继续从`v`轮到 Tfg 了，所以候选人的结果是`dp1[v]`。 

选择以下结果中字典顺序最大的孩子：```
(Kuroni score, Tfg score)
```选择最好的孩子后，添加节点的贡献`u`。 
5. 计算`dp1[u]`。 

检查每一个孩子`v`。 

比赛继续从`v`轮到 Kuroni 了，所以候选结果是`dp0[v]`。 

选择以下结果中字典顺序最大的孩子：```
(Tfg score, Kuroni score)
```选择最好的孩子后，添加节点的贡献`u`。 
6.答案是`dp0[1]`，因为游戏从 1 号房间开始，Kuroni 做出第一个决定。 

### 为什么它有效

 对于任何节点，一旦我们知道轮到谁了，未来的游戏就只取决于该子树。 这给出了最佳的子结构。 

假设所有子项都已包含正确的 DP 值。 

如果轮到库罗尼，每一个合法的举动都对应于选择一个孩子。 得到的分数正是存储在该孩子的状态中的分数。 Kuroni 的规则规定，她会选择最大化自己得分的结果，而 Tfg 的得分仅用作决胜局。 根据该顺序选择最好的孩子完全符合游戏的定义。 

同样的论点也适用于 Tfg。 

由于叶子是正确的，并且每个父节点都是从已经正确的子节点计算出来的，因此子树大小的归纳证明每个 DP 状态都是正确的。 根本上的价值是游戏的最终结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

a = list(map(int, input().split()))
b = list(map(int, input().split()))

g = [[] for _ in range(n)]

for _ in range(n - 1):
    u, v = map(int, input().split())
    u -= 1
    v -= 1
    g[u].append(v)
    g[v].append(u)

parent = [-1] * n
order = [0]
parent[0] = 0

for u in order:
    for v in g[u]:
        if parent[v] == -1:
            parent[v] = u
            order.append(v)

dp0 = [(0, 0)] * n
dp1 = [(0, 0)] * n

for u in reversed(order):
    children = [v for v in g[u] if v != parent[u]]

    if not children:
        dp0[u] = (a[u], b[u])
        dp1[u] = (a[u], b[u])
        continue

    best_k = None
    for v in children:
        cand = dp1[v]
        if best_k is None or (cand[0], cand[1]) > (best_k[0], best_k[1]):
            best_k = cand

    dp0[u] = (best_k[0] + a[u], best_k[1] + b[u])

    best_t = None
    for v in children:
        cand = dp0[v]
        if best_t is None or (cand[1], cand[0]) > (best_t[1], best_t[0]):
            best_t = cand

    dp1[u] = (best_t[0] + a[u], best_t[1] + b[u])

ans = dp0[0]
print(ans[0], ans[1])
```第一个 DFS 构造父关系和遍历顺序。 颠倒该顺序会产生类似后序的处理顺序，其中每个子项都在其父项之前处理。 

两个DP数组存储对`(kuroni_score, tfg_score)`。 

为了`dp0`，我们直接比较儿童结果`(kuroni, tfg)`因为库罗尼的偏好顺序完全遵循字典顺序。 

为了`dp1`，我们比较为`(tfg, kuroni)`因为Tfg的分数才是首要目标。 

该实现使用迭代遍历而不是递归 DFS。 和$10^5$节点，递归深度可以超过Python的默认递归限制。 

## 工作示例

 ### 示例 1

 输入：```
5
0 1 1 0 1
0 0 1 1 1
1 2
1 3
2 4
2 5
```从叶子向上处理：

 | 节点| dp0 | dp1 |
 | --- | --- | --- |
 | 3 | (1,1) | (1,1) |
 | 4 | (0,1)| (0,1)|
 | 5 | (1,1) | (1,1) |
 | 2 | (2,1) | (2,1) |
 | 1 | (2,1) | (2,2) |

 在节点 2，两个回合都选择房间 5，因为`(1,1)`占主导地位`(0,1)`。 

在节点 1，Kuroni 比较子结果`(2,1)`和`(1,1)`，选择第一个。 最终的答案是：```
2 1
```这表明决策是基于完整的未来结果，而不是直接的房间价值。 

### 示例 2

 输入：```
3
0 1 1
0 0 1
1 2
1 3
```DP值：

 | 节点| dp0 | dp1 |
 | --- | --- | --- |
 | 2 | (1,0)| (1,0)|
 | 3 | (1,1) | (1,1) |
 | 1 | (1,1) | (1,1) |

 库罗尼比较`(1,0)`和`(1,1)`。 

她自己的比分打平，所以抢七选择`(1,1)`。 

最终答案：```
1 1
```此示例隔离了次要比较规则。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个节点和边都会被处理固定次数 |
 | 空间| O(n) | 邻接表、父数组、遍历顺序和DP数组|

 和$n \le 10^5$，线性时间很容易足够快。 内存使用也是线性的，并且完全符合典型的比赛限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    g = [[] for _ in range(n)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        g[v].append(u)

    parent = [-1] * n
    order = [0]
    parent[0] = 0

    for u in order:
        for v in g[u]:
            if parent[v] == -1:
                parent[v] = u
                order.append(v)

    dp0 = [(0, 0)] * n
    dp1 = [(0, 0)] * n

    for u in reversed(order):
        children = [v for v in g[u] if v != parent[u]]

        if not children:
            dp0[u] = (a[u], b[u])
            dp1[u] = (a[u], b[u])
            continue

        best_k = None
        for v in children:
            cand = dp1[v]
            if best_k is None or (cand[0], cand[1]) > (best_k[0], best_k[1]):
                best_k = cand

        dp0[u] = (best_k[0] + a[u], best_k[1] + b[u])

        best_t = None
        for v in children:
            cand = dp0[v]
            if best_t is None or (cand[1], cand[0]) > (best_t[1], best_t[0]):
                best_t = cand

        dp1[u] = (best_t[0] + a[u], best_t[1] + b[u])

    return f"{dp0[0][0]} {dp0[0][1]}\n"

# sample
assert run(
"""5
0 1 1 0 1
0 0 1 1 1
1 2
1 3
2 4
2 5
"""
) == "2 1\n"

# minimum size
assert run(
"""1
1
0
"""
) == "1 0\n"

# tie-break by other player's score
assert run(
"""3
0 1 1
0 0 1
1 2
1 3
"""
) == "1 1\n"

# chain
assert run(
"""4
1 0 1 0
0 1 0 1
1 2
2 3
3 4
"""
) == "2 2\n"

# all zero preferences
assert run(
"""3
0 0 0
0 0 0
1 2
1 3
"""
) == "0 0\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点树 |`1 0`| 没有任何动作的基本情况 |
 | 抢七局例子 |`1 1`| 次要比较规则 |
 | 链树|`2 2`| 无分支，强制路径 |
 | 全零 |`0 0`| 即使空着也能正确累积分数 |
 | 案例案例|`2 1`| 一般正确性 |

 ## 边缘情况

 考虑一棵仅由根组成的树：```
1
1
0
```根也是叶。 该算法立即分配：```
dp0[1] = dp1[1] = (1, 0)
```没有做出任何决定，答案是`(1, 0)`。 

现在考虑纯领带：```
3
0 1 1
0 0 1
1 2
1 3
```孩子的结果是`(1,0)`和`(1,1)`。 

Kuroni 在这两种情况下的主要得分均为 1。 该算法按字典顺序比较为`(Kuroni, Tfg)`并选择`(1,1)`。 这完全符合问题的抢七规则。 

最后，考虑一棵路径形树：```
4
1 0 1 0
0 1 0 1
1 2
2 3
3 4
```每个节点最多有一个子节点。 任何地方都不存在选择。 DP 只是从叶子向上累积空间贡献，产生`(2,2)`。 这证实了即使游戏方面消失并且路径被强制，算法也能正确运行。
