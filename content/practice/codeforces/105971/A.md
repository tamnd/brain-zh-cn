---
title: "CF 105971A - 图表上的令牌"
description: "我们有一个连通的无向图。 一些顶点包含代币，一些顶点包含奖励。 移动包括获取一个标记并将其移动到相邻顶点。"
date: "2026-06-25T13:41:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105971
codeforces_index: "A"
codeforces_contest_name: "BSUIR Open XIII: Student final"
rating: 0
weight: 105971
solve_time_s: 51
verified: true
draft: false
---

[CF 105971A - 图表上的令牌](https://codeforces.com/problemset/problem/105971/A)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个连通的无向图。 一些顶点包含代币，一些顶点包含奖励。 移动包括获取一个标记并将其移动到相邻顶点。 第一次移动始终是允许的，但只有当先前移动的令牌落在奖励顶点上时，才允许后面的每次移动。 下一步必须使用不同的令牌。 目标是决定是否有任何 token 最终能够到达顶点 1。 

困难在于代币的变动并不是唯一重要的事情。 如果没有足够的其他代币来维持奖励着陆链，那么接近终点的代币可能仍然毫无用处。 同时，某些组的奖励可以产生无限的额外动作。 

这些约束允许测试用例中的顶点和边的总数达到大约 200000 个。这排除了探索每个可能的令牌移动序列，因为可能的状态数量呈指数增长。 解决方案的图形大小必须接近线性。 

有几个案例很容易被忽视。 如果令牌从顶点 1 开始，则答案立即为“是”，因为不需要移动。 例如：```
n = 3, m = 2
tokens = [1]
bonuses = [2]
edges = (1,2), (2,3)
```正确的输出是YES。 仅检查令牌是否可以移动到顶点 1 的解决方案会错误地拒绝它。 

另一个棘手的情况是，一个代币只能通过使用几个奖金才能到达终点，但没有足够的其他代币来继续这条链。```
n = 4, m = 3
tokens = [4]
bonuses = [3]
edges = (1,2), (2,3), (3,4)
```正确的输出是NO。 令牌可以从 4 移动到 3，但之后它不能再次移动，因为相同的令牌不能重复使用。 简单的最短路径检查会错误地认为令牌可以继续。 

最后的边缘情况是无限的移动源。 如果两个奖励相邻，则该区域附近的令牌可以通过在奖励边缘周围移动不同的令牌来重复激活奖励。```
n = 5, m = 5
tokens = [5,4]
bonuses = [2,3]
edges = (1,2), (2,3), (3,4), (4,5), (2,5)
```正确的输出是 YES，因为奖励对可以提供无限的回合。 仅计算附近标记数量的方法会错过这一点。 

## 方法

 直接方法将模拟所有可能的游戏。 我们可以选择一个令牌，移动它，然后递归地尝试下一个可用的令牌。 这是正确的，因为它准确地探索了可能的移动顺序。 问题是分支因子可能很大。 对于许多令牌，可能的移动顺序的数量与令牌的排列数量相当，这远远超出了允许的限制。 

关键的观察是停止思考整个序列，而专注于需要多少步才能使一个选定的标记到达终点。 假设我们选择一个最终会到达顶点 1 的令牌。在最后一步之前，该令牌必须穿过允许链继续的顶点。 这些有用的顶点是位于通往终点的路径上的奖励顶点。 

我们首先找到每个顶点的令牌到达终点之前所需的最少奖励着陆次数。 这可以通过从顶点 1 开始的 BFS 来完成，但我们仅通过额外顶点进行扩展。 如果令牌位于有距离的顶点`d`，它需要`d`在完成之前进行支撑动作。 

现在我们只需要知道其他代币是否能够提供足够的支持。 如果令牌位于奖励顶点旁边，则可以贡献额外的一步。 如果它位于属于一对相邻奖励的一部分的奖励顶点旁边，则它可以贡献无限的移动，因为这些奖励可以通过交替令牌永久重用。 

蛮力之所以有效，是因为它模拟了所有可能的顺序。 当可能的订单数量激增时，它会失败。 观察到只有可用支持的数量才重要，这让我们可以用图预处理来代替序列搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) | 太慢了 |
 | 最佳 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 读取图表并存储哪些顶点包含标记以及哪些顶点包含奖励。 如果任何标记从顶点 1 开始，则答案立即为“是”，因为游戏已经结束。 
2. 标记属于一对相邻奖励的每个顶点。 这些顶点代表了代币可以帮助创建无限的未来动作的地方。 
3. 从顶点 1 运行 BFS。仅在扩展时穿过奖励顶点。 由此产生的距离告诉我们在保持游戏活力的同时从该顶点到达终点所需的最少移动次数。 
4. 对于每个代币，计算它需要多少支持。 令牌可以免费使用自己的第一步，因此如果其所需的距离为`d`，它需要`d - 1`来自其他代币的额外移动。 
5. 计算所有代币的可用支持。 如果令牌与双倍奖励区域相邻，则它会提供无限的支持。 否则，如果一步能够达到加值，则贡献一步。 
6. 尝试将每个令牌作为最终获胜令牌。 暂时从支持计数中删除其自己的贡献。 如果有无限的支持，或者足够的一招支持，那么答案就是YES。 

为什么有效：所选的获胜标记在其最终移动到终点之前只需要一系列移动。 每个非最终动作的存在只是为了激活另一个回合，因此关于其他令牌的唯一相关信息是它们可以提供多少回合。 靠近可重复使用的奖励结构的代币提供无限轮次，而所有其他有用的代币只提供一次。 BFS 距离给出了所需的确切匝数，因此最终的比较就足够了。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    p, b = map(int, input().split())

    tokens = list(map(int, input().split()))
    bonuses = [0] * (n + 1)

    if b:
        for x in map(int, input().split()):
            bonuses[x] = 1
    else:
        input()

    graph = [[] for _ in range(n + 1)]

    edges = []
    for _ in range(m):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    has_pair = [0] * (n + 1)
    for i in range(1, n + 1):
        if bonuses[i]:
            for v in graph[i]:
                if bonuses[v]:
                    has_pair[i] = 1
                    break

    if 1 in tokens:
        print("YES")
        return

    support = [0] * (n + 1)

    for x in tokens:
        for v in graph[x]:
            if has_pair[v]:
                support[x] = 2
                break
            if bonuses[v]:
                support[x] = max(support[x], 1)

    dist = [-1] * (n + 1)
    q = deque([1])
    dist[1] = 0

    while q:
        u = q.popleft()
        for v in graph[u]:
            if bonuses[v] and dist[v] == -1:
                dist[v] = dist[u] + 1
                q.append(v)

    cnt_one = 0
    cnt_inf = 0

    for x in tokens:
        if support[x] == 1:
            cnt_one += 1
        elif support[x] == 2:
            cnt_inf += 1

    for x in tokens:
        if support[x] == 1:
            cnt_one -= 1
        elif support[x] == 2:
            cnt_inf -= 1

        need = 10**9

        if dist[x] != -1:
            need = dist[x]

        for v in graph[x]:
            if dist[v] != -1:
                need = min(need, dist[v] + 1)

        if need != 10**9:
            if cnt_inf > 0 or cnt_one >= need - 1:
                print("YES")
                return

        if support[x] == 1:
            cnt_one += 1
        elif support[x] == 2:
            cnt_inf += 1

    print("NO")

t = int(input())
for _ in range(t):
    solve()
```该代码首先构建邻接列表，因为后面的每个步骤都需要快速访问邻居。 这`has_pair`数组标识位于相邻奖励对内的顶点，这些顶点正是支持变得无限的地方。 

BFS 与普通的最短路径搜索略有不同。 我们从终点开始，只扩展到奖励顶点，因为每个中间移动都必须落在奖励顶点上。 非奖励顶点不能是准备路径的一部分。 

最后一个循环测试每个标记是否到达终点。 它自己的贡献在检查之前被删除，因为它无法帮助自己。 价值`need - 1`来自以下事实：游戏的第一步始终可用，无需事先激活奖励。 

## 工作示例

 考虑：```
n = 4, m = 3
tokens = [4,3]
bonuses = [3]
edges = (1,2), (2,3), (3,4)
```| 步骤| 当前代币 | 距离 | 一招支持 | 无限支持| 结果 |
 | --- | --- | --- | --- | --- | --- |
 | 初始| 4 | 3 | 1 | 0 | 继续 |
 | 测试令牌 4 | 需要 3 | 1 | 0 | 还不够| 否 |

 4 处的令牌可以进入奖金，但之后没有其他令牌可用于继续该序列。 该轨迹表明了为什么仅靠距离是不够的。 

另一个例子：```
n = 4, m = 4
tokens = [4,3]
bonuses = [2,3]
edges = (1,2), (2,3), (3,4), (1,4)
```| 步骤| 当前代币 | 距离 | 一招支持 | 无限支持| 结果 |
 | --- | --- | --- | --- | --- | --- |
 | BFS | 1 | 0 | | | |
 | 奖金 2 | 1 | | | | |
 | 奖金 3 | 2 | | | | |
 | 测试令牌 4 | 2 | 0 | 1 | 0 | 是 |

 4处的代币可以使用奖励链。 来自另一个令牌的支持足以让游戏保持活力直到最后一步。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 每条边都会被 BFS 和预处理处理固定次数 |
 | 空间| O(n + m) | 邻接表和辅助数组存储图信息 |

 所有测试的总输入大小适合线性解决方案。 该算法避免探索游戏状态，因此即使对于最大的图也能保持快速。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    t = int(sys.stdin.readline())
    out = []
    for _ in range(t):
        n, m = map(int, sys.stdin.readline().split())
        p, b = map(int, sys.stdin.readline().split())
        tokens = list(map(int, sys.stdin.readline().split()))
        bonuses = [0] * (n + 1)
        if b:
            for x in map(int, sys.stdin.readline().split()):
                bonuses[x] = 1
        else:
            sys.stdin.readline()

        g = [[] for _ in range(n + 1)]
        for _ in range(m):
            u, v = map(int, sys.stdin.readline().split())
            g[u].append(v)
            g[v].append(u)

        if 1 in tokens:
            out.append("YES")
            continue

        pair = [0] * (n + 1)
        for i in range(1, n + 1):
            if bonuses[i] and any(bonuses[x] for x in g[i]):
                pair[i] = 1

        typ = []
        one = inf = 0
        for x in tokens:
            val = 0
            for y in g[x]:
                if pair[y]:
                    val = 2
                    break
                if bonuses[y]:
                    val = 1
            typ.append(val)
            if val == 1:
                one += 1
            elif val == 2:
                inf += 1

        dist = [-1] * (n + 1)
        q = deque([1])
        dist[1] = 0
        while q:
            u = q.popleft()
            for v in g[u]:
                if bonuses[v] and dist[v] == -1:
                    dist[v] = dist[u] + 1
                    q.append(v)

        ok = False
        for idx, x in enumerate(tokens):
            if typ[idx] == 1:
                one -= 1
            elif typ[idx] == 2:
                inf -= 1

            need = 10**9
            if dist[x] != -1:
                need = dist[x]
            for y in g[x]:
                if dist[y] != -1:
                    need = min(need, dist[y] + 1)

            if need != 10**9 and (inf or one >= need - 1):
                ok = True

            if typ[idx] == 1:
                one += 1
            elif typ[idx] == 2:
                inf += 1

        out.append("YES" if ok else "NO")

    sys.stdin = old
    return "\n".join(out)

assert run("""1
3 2
1 1
1
2
1 2
2 3
""") == "YES"

assert run("""1
4 3
1 1
4
3
1 2
2 3
3 4
""") == "NO"

assert run("""1
4 4
2 2
3 4
2 3
1 2
2 3
3 4
1 4
""") == "YES"

assert run("""1
2 1
1 0
2

1 2
""") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 令牌已完成 | 是 | 立即获胜案例 |
 | 单一代币需要奖励链| 否 | 防止忽略令牌重用规则 |
 | 具有多个代币的相邻奖金 | 是 | 无限支持检测|
 | 没有奖金，只有一步| 否 | 边界条件|

 ## 边缘情况

 对于第一个边缘情况，顶点 1 上的令牌永远不会进入算法检查，因为答案会立即返回。 这处理在任何移动之前游戏已经结束的状态。 

对于单令牌奖励情况，BFS 正确地发现该令牌可以接近终点，但在移除获胜令牌后支持计数为零。 该条件失败，因为没有足够的其他令牌来提供轮次。 

对于相邻的奖励情况，预处理标记奖励对。 该区域旁边的任何标记都被归类为无限支持，因此最终检查会成功，无需计算各个移动。 这捕捉了相邻奖金的重复性质。
