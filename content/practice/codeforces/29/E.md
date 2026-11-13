---
title: "CF 29E - 争吵"
description: "我们被要求路线两个人，鲍勃和亚历克斯，穿过一个城镇，该城镇表示为一个无向图，有 n 个十字路口和 m 条道路。 Bob 从节点 1 开始，想要到达节点 n，而 Alex 从节点 n 开始，想要到达节点 1。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 29
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 29 (Div. 2, Codeforces format)"
rating: 2400
weight: 29
solve_time_s: 76
verified: false
draft: false
---
[CF 29E - 争吵](https://codeforces.com/problemset/problem/29/E)

 **评分：** 2400
 **标签：** 图，最短路径
 **求解时间：** 1m 16s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求引导两个人，鲍勃和亚历克斯，穿过一个用无向图表示的城镇，其中`n`十字路口和`m`道路。 Bob 从节点 1 开始并想要到达节点`n`，而 Alex 从节点开始`n`并想要到达节点 1。两者必须同时沿着相连的道路序列行驶，以相同的速度移动，并且它们不能同时占据同一个十字路口。 他们可能会在路中间交叉，但永远不会在一个节点相遇。 任务是找到两者长度相等的最短可能路径，以满足这个条件。 

输入是表示图形的简单整数，但关键的挑战是交互约束：需要仔细考虑可能重叠的两条最短路径，以确保两个旅行者永远不会同时在同一节点相遇。 如果不存在有效的对，我们返回`-1`。 否则，我们必须生成任何有效的最短路线。 

问题范围是中等的：`n`最多 500 个并且`m`最多 10,000 个。 这使得算法在时间上达到大约 O(n^3) 或在空间上达到大约 O(n^2)。 未加权图上的简单 BFS 运行时间为 O(n + m) 并且是可以接受的，但枚举所有路径排列的方法是不可行的。 边缘情况包括只有一条道路（平凡路径）的小图、断开连接的图（无路径）或最短路径必然重叠的情况，从而阻止有效的解决方案。 

例如，考虑`n = 3`, 道路`1-2`和`2-3`。 从 1→3 和 3→1 的两条最短路径都经过 2。没有办法安排同时移动而不在节点 2 相遇，所以答案应该是`-1`。 仅计算距离并选择最短路径的简单解决方案会错误地返回在节点处发生冲突的路径。 

## 方法

 蛮力的想法是枚举所有长度的路径`k`Bob 从 1 到 n，Alex 从 n 到 1，然后模拟沿所有对的同时移动以检查节点冲突。 原则上这是可行的，因为它最终会找到有效的最短路径对（如果存在）。 然而，它的速度慢得令人绝望：即使对于普通的图，路径的数量也会呈指数级增长。 最坏情况的复杂度大约为 O(2^n)，只是枚举路径，这远远超出了 n = 500 的可行范围。 

产生最佳解决方案的洞察力来自于将其视为具有附加“冲突避免”约束的最短路径问题。 我们可以使用来自每个起始节点的两次独立的 BFS 遍历来建模该问题，并存储到所有节点的距离。 让`d1[v]`是从 1 到 v 的距离并且`d2[v]`从 n 到 v 的距离。关键的观察是长度为 的有效同步路径`L`存在如果在每一步`t`沿着路径，Bob 位于一个节点`u`亚历克斯在一个节点`v`使得`u != v`或者它们沿着相同的边缘朝相反的方向移动。 我们可以将其表述为 Bob 和 Alex 位置的乘积图上的最短路径问题，避免它们发生冲突的状态。 由于原始图较小，因此在大小为 n×n 的乘积图上进行 BFS 是可行的。 这将问题从指数路径枚举简化为多项式时间探索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（枚举路径）| O(2^n) | O(2^n) | O(2^n) | O(2^n) | 太慢了 |
 | 产品图上的 BFS | O(n^2 + n*m) | O(n^2 + n*m) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 读取输入图并构造邻接表。 这是标准的，可确保 BFS 高效运行。 
2.从节点1运行BFS进行计算`dist1[v]`对于所有节点`v`。`dist1[v]`是要到达的最小边数`v`从 1.
 3.从节点n运行BFS进行计算`distn[v]`对于所有节点`v`。 
4. 在状态上初始化 BFS`(b, a)`代表节点上的 Bob`b`和亚历克斯在节点`a`。 开始状态是`(1, n)`最终状态是`(n, 1)`。 
5. 对于每个州`(b, a)`在 BFS 期间，考虑所有移动：Bob 移动到`b`亚历克斯搬到了邻居`a`。 只推`(b', a')`到 BFS 队列，如果`b' != a'`。 沿着同一条边向相反方向移动是允许的，因为它不构成节点冲突。 
6. 跟踪二维数组中每个状态的距离`dist[b][a]`并存储父状态以进行路径重建。 
7. BFS终止时`(n, 1)`已达到。 如果不可达，则输出`-1`。 
8. 通过回溯重建 Bob 和 Alex 的路径`(n, 1)`使用父指针。 两条路径的长度相同。 

**为什么有效**：产品图上的 BFS 按递增步骤的顺序探索所有有效的同步运动。 通过强制执行`b' != a'`在每一步中，我们都防止同时占用同一节点。 BFS保证我们第一次到达`(n, 1)`它是沿着最短的移动顺序。 父指针提供同步路径的有效重建。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

n, m = map(int, input().split())
adj = [[] for _ in range(n + 1)]
for _ in range(m):
    u, v = map(int, input().split())
    adj[u].append(v)
    adj[v].append(u)

dist = [[-1] * (n + 1) for _ in range(n + 1)]
parent = [[None] * (n + 1) for _ in range(n + 1)]

queue = deque()
queue.append((1, n))
dist[1][n] = 0

while queue:
    b, a = queue.popleft()
    if (b, a) == (n, 1):
        break
    for nb in adj[b]:
        for na in adj[a]:
            if nb != na and dist[nb][na] == -1:
                dist[nb][na] = dist[b][a] + 1
                parent[nb][na] = (b, a)
                queue.append((nb, na))

if dist[n][1] == -1:
    print(-1)
    sys.exit()

# reconstruct paths
bpath, apath = [], []
b, a = n, 1
while (b, a) != (1, n):
    bpath.append(b)
    apath.append(a)
    b, a = parent[b][a]
bpath.append(1)
apath.append(n)
bpath.reverse()
apath.reverse()

print(len(bpath) - 1)
print(' '.join(map(str, bpath)))
print(' '.join(map(str, apath)))
```邻接表捕获未加权图。 产品图上的 BFS 确保我们探索所有同时移动，同时强制避免节点冲突。 父指针允许路径重建，并且 BFS 保证最短同步路径。 微妙之处在于检查`nb != na`在邻居探索期间防止碰撞。 

## 工作示例

 ### 示例 1

 输入：```
2 1
1 2
```| 步骤| 队列| 当前状态 | 新州 |
 | ---| ---| ---| ---|
 | 0 | (1,2) | (1,2) | (2,1) |
 | 1 | (2,1) | (2,1) | - |

 重建路径：Bob 1→2，Alex 2→1。 长度 = 1。表明最小单边路径有效。 

### 定制样品

 输入：```
3 2
1 2
2 3
```BFS探索`(1,3)`→`(2,2)`但无法移动到`(3,1)`无碰撞。 不存在有效路径，输出`-1`。 这证实了中间节点的同时占用被正确阻止。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2 + n*m) | O(n^2 + n*m) | BFS 探索多达 n×n 状态； 每个都有最多 m 个边的邻接检查 |
 | 空间| O(n^2) | O(n^2) |`dist`和`parent`数组为 n×n |

 和`n ≤ 500`和`m ≤ 10,000`，n^2 = 250,000 且 n*m ≤ 5,000,000。 两者都可以轻松地在 1 秒和 256 MB 内完成。 

## 测试用例```python
import io, sys

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    old_stdout = sys.stdout
    sys.stdout = io.StringIO()
    exec(open("solution.py").read())
    out = sys.stdout.getvalue()
    sys.stdout = old_stdout
    return out.strip()

# Provided sample
assert run("2 1\n1 2\n") == "1\n1 2\n2 1", "sample 1"

# Minimal case with no valid path
assert run("3 2\n1 2\n2 3\n") == "-1", "collision
```
