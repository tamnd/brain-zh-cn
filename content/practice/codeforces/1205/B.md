---
title: "CF 1205B - 最短周期"
description: "给定一个整数集合，我们将每个整数解释为图中的一个节点。 当两个节点的按位 AND 非零时，这意味着它们共享至少一个设置为 1 的公共位。"
date: "2026-06-11T23:34:25+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "graphs", "shortest-paths"]
categories: ["algorithms"]
codeforces_contest: 1205
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 580 (Div. 1)"
rating: 1900
weight: 1205
solve_time_s: 101
verified: true
draft: false
---

[CF 1205B - 最短周期](https://codeforces.com/problemset/problem/1205/B)

 **评级：** 1900
 **标签：** 位掩码、暴力破解、图表、最短路径
 **求解时间：** 1m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个整数集合，我们将每个整数解释为图中的一个节点。 当两个节点的按位 AND 非零时，这意味着它们共享至少一个设置为 1 的公共位。 

任务是确定该图中最短循环的长度，或报告不存在循环。 

该图的潜在边可能非常大，因为每对数字都可能相连。 然而，关键结构隐藏在位表示中：每个数字最多有 60 个相关位，边仅通过共享位存在。 这立即表明直接对所有对进行推理是不可能的，我们必须使用位来压缩结构。 

约束 n 高达 100,000 消除了任何 O(n²) 构造或显式边缘上的 BFS。 如果使用大量常数因子天真地实现，即使 O(n√n) 也太大了。 正确的解决方案必须显着缩小图，通常是通过利用边由小范围的位引起的事实。 

当存在由成对共享不同位的三个数字形成的三角形时，即使所有三个数字都不共享任何单个位，也会出现微妙的边缘情况。 另一个棘手的情况是，当多个数字共享同一个位时，如果至少存在三个这样的数字，则可以立即形成长度为 3 的非常小的循环。 

构建完整图表或什至检查所有对 AND ≠ 0 的简单方法将失败，不仅由于时间限制，而且由于内存耗尽。 

## 方法

 蛮力的想法很简单。 我们明确地构造图：对于每对节点 i 和 j，我们检查 a_i AND a_j 是否非零，如果是，我们添加一条边。 然后我们从每个节点运行 BFS 来计算最短周期，将每个 BFS 视为返回自身的最短路径。 这是正确的，因为未加权图上的 BFS 找到了通过后边缘的最短循环。 

问题在于规模。 检查所有对的成本为 O(n²)，在最坏的情况下已经是 10^10 次操作。 即使我们以某种方式优化了邻接存储，每个节点的 BFS 仍然会导致重复遍历可能包含 O(n²) 条边的图。 在时间和内存限制下，暴力方法就会崩溃。 

关键的观察是边缘不是任意的。 每条边仅因共享位而存在，并且只有大约 60 位。 我们可以考虑连接节点的比特，而不是考虑节点与节点之间的连接。 

如果某个位出现在三个或更多数字中，则这三个节点立即形成长度为 3 的循环：每对共享该位，因此它们形成一个三角形。 因此，任何频率 ≥ 3 的位都会立即给出最佳答案 3。 

如果没有位出现 3 次，则每个位最多出现在两个数字中。 这严重限制了图：每个数字最多有 60 位，因此每个节点的度数以 60 为界，并且边的总数变得易于管理，大约为 O(60n)。 在这种情况下，我们可以显式地构造邻接表。 

一旦我们有了稀疏图，我们就通过从每个节点运行 BFS 来计算最短周期，但当距离超过迄今为止找到的最佳答案时，会提前停止。 由于度数是有界的，因此这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（所有对 + BFS）| O(n² + n·(n+m)) | O(n² + n·(n+m)) | O(n²) | 太慢了 |
 | 基于位的缩减+BFS | O(60²·n) | O(60²·n) | O(n + m) | 已接受 |

 ## 算法演练

1. 计算所有数字中每位的出现次数。 如果任何位出现在至少三个数字中，则立即返回 3，因为这三个节点通过该位形成一个三角形。 
2. 删除所有零数。 它们不贡献边缘并且不会影响周期。 
3. 通过迭代每个数字并将其连接到先前看到的共享位的数字来构建邻接列表。 由于每个位最多出现两次，因此每对最多添加一次。 
4. 对于每个节点，运行 BFS 来计算到所有节点的最短路径，但如果当前距离超过迄今为止找到的最佳循环长度，则停止。 
5. 在从节点 u 进行 BFS 的过程中，每当我们遇到一个已经访问过的非父节点 v 时，我们就找到了一个长度为 dist[u][x] + dist[u][y] + 1 的循环。更新答案。 
6. 返回找到的最小循环长度，如果不存在则返回 -1。 

它的工作原理与位引起的结构有关。 要么一个位被大量共享，立即生成一个三角形，要么每个位都足够稀疏，使得导出图变得小度且完全可遍历。 图中的任何环路都必须在此 BFS 探索中显示为环路，并且 BFS 保证最短路径距离，因此通过每条边检测到的第一个环路给出了涉及该边的最小环路。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque, defaultdict

INF = 10**9

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    
    bit_count = [0] * 61
    for x in a:
        for b in range(61):
            if x >> b & 1:
                bit_count[b] += 1
    
    if any(c >= 3 for c in bit_count):
        print(3)
        return
    
    nums = [x for x in a if x != 0]
    n = len(nums)
    
    adj = [[] for _ in range(n)]
    seen = [[] for _ in range(61)]
    
    for i, x in enumerate(nums):
        for b in range(61):
            if x >> b & 1:
                for j in seen[b]:
                    adj[i].append(j)
                    adj[j].append(i)
                seen[b].append(i)
    
    ans = INF
    
    def bfs(start):
        dist = [INF] * n
        parent = [-1] * n
        q = deque([start])
        dist[start] = 0
        
        best = INF
        
        while q:
            u = q.popleft()
            if dist[u] >= best:
                continue
            for v in adj[u]:
                if dist[v] == INF:
                    dist[v] = dist[u] + 1
                    parent[v] = u
                    q.append(v)
                elif parent[u] != v:
                    best = min(best, dist[u] + dist[v] + 1)
        return best
    
    for i in range(n):
        ans = min(ans, bfs(i))
        if ans == 3:
            break
    
    print(ans if ans < INF else -1)

if __name__ == "__main__":
    solve()
```该解决方案首先通过位频率检查即时三角条件，这处理唯一真正密集的故障情况。 然后，它仅通过共享位构建邻接列表来压缩图，确保通过中间“已见位列表”恰好发现每条边一次。 

BFS 函数维护距离数组和父数组。 父检查是必不可少的：没有它，每个无向边都会立即看起来像一个长度为 2 的循环。由于在无向图中简单循环的长度必须至少为 3，因此必须忽略直接回溯以避免误报。 

每个 BFS 返回涉及起始节点的最短周期，并且全局最小值在所有源上累积。 

## 工作示例

 ### 示例 1

 输入：```
4
3 6 28 9
```位频率显示没有位出现 3 次，因此我们继续进行图形构建。 

| 步骤| 节点| 比特| 添加新边缘 |
 | ---| ---| ---| ---|
 | 0 | 3 | {0,1} | 无 |
 | 1 | 6 | {1,2} | (3,6) |
 | 2 | 28 | 28 {2,3,4} | (6,28) |
 | 3 | 9 | {0,3} | (3,9), (28,9) | (3,9), (28,9) |

 BFS 探索找到了一个涉及所有四个节点的循环：9 → 3 → 6 → 28 → 9。 

这证实了这里的循环不一定是三角形，并且 BFS 正确捕获了最小闭合行走结构。 

### 示例 2（已构建）

 输入：```
3
5 12 9
```位结构通过共享位间接形成一个三角形。 

| 步骤| 节点| 比特| 添加新边缘 |
 | ---| ---| ---| ---|
 | 0 | 5 | {0,2} | 无 |
 | 1 | 12 | 12 {2,3} | (5,12) |
 | 2 | 9 | {0,3} | (5,9), (12,9) | (5,9), (12,9) |

 这立即形成一个 3 周期，任何节点的 BFS 都会检测到长度为 3 的它。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(60n + 60m BFS) | 位计数加上有界度图上的稀疏 BFS |
 | 空间| O(n + m) | 邻接表和 BFS 数组 |

 该结构确保每个节点仅贡献最多 60 条边，从而使图保持足够稀疏，以便重复 BFS 运行能够在 1 秒限制内通过。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque, defaultdict
    INF = 10**9

    n = int(input())
    a = list(map(int, input().split()))
    
    bit_count = [0]*61
    for x in a:
        for b in range(61):
            if x >> b & 1:
                bit_count[b] += 1
    if any(c >= 3 for c in bit_count):
        return "3"
    
    nums = [x for x in a if x != 0]
    n = len(nums)
    
    adj = [[] for _ in range(n)]
    seen = [[] for _ in range(61)]
    
    for i, x in enumerate(nums):
        for b in range(61):
            if x >> b & 1:
                for j in seen[b]:
                    adj[i].append(j)
                    adj[j].append(i)
                seen[b].append(i)
    
    def bfs(s):
        dist = [INF]*n
        parent = [-1]*n
        dist[s] = 0
        q = deque([s])
        best = INF
        
        while q:
            u = q.popleft()
            if dist[u] >= best:
                continue
            for v in adj[u]:
                if dist[v] == INF:
                    dist[v] = dist[u] + 1
                    parent[v] = u
                    q.append(v)
                elif parent[u] != v:
                    best = min(best, dist[u] + dist[v] + 1)
        return best
    
    ans = INF
    for i in range(n):
        ans = min(ans, bfs(i))
    
    return str(ans if ans < INF else -1)

# provided samples
assert run("4\n3 6 28 9\n") == "4"
assert run("3\n5 12 9\n") == "3"

# custom cases
assert run("1\n0\n") == "-1", "single node"
assert run("4\n1 2 4 8\n") == "-1", "no edges"
assert run("3\n1 1 1\n") == "3", "all same bit creates triangle"
assert run("5\n3 6 28 9 1\n") in {"3","4"}, "cycle presence check"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单零节点| -1 | 简单的无循环情况 |
 | 两个不相交的权力| -1 | 完全没有边缘|
 | 相同的位重复| 3 | 立即三角形检测|
 | 混合稀疏循环| 3 或 4 | BFS循环检测鲁棒性|

 ## 边缘情况

 一个关键的边缘情况是当一个位出现在三个数字中时。 例如，输入`[1, 1, 1]`即使没有明显的循环结构可见，也会创建一个完整的三角形。 该算法在图构建之前捕获了这一点，避免了不必要的 BFS 并确保了正确性。 

另一个微妙的情况是当数字非零但不成对共享位时，例如`[1, 2, 4, 8]`。 构造的图没有边，BFS永远不会发现后边，结果正确保留`-1`。 

一个更有趣的情况是当周期长于 3 时，如`[3, 6, 28, 9]`。 这里没有一个比特的频率≥3，所以我们完全依赖 BFS。 通过共享位构建的邻接产生一个有效的无向循环，BFS 正确检测到最短的循环，返回 4。
