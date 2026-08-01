---
title: "CF 102599B - \u041b\u0438\u043f\u0435\u0446\u043a\u043e\u0435\u043c\u0435\u0442\u0440\u043e"
description: "我们得到了一张带有 N 个车站的地铁地图。 每个站最多可以指定一个与其连接的其他站。 如果p[i]不为-1，则站i和站p[i]之间存在无向隧道。"
date: "2026-07-31T16:38:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102599
codeforces_index: "B"
codeforces_contest_name: "The fifth Lipetsk collegiate programming contest. Finals. 8-11 form"
rating: 0
weight: 102599
solve_time_s: 122
verified: true
draft: false
---

[CF 102599B - \u041b\u0438\u043f\u0435\u0446\u043a\u043e\u0435\u043c\u0435\u0442\u0440\u043e](https://codeforces.com/problemset/problem/102599/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一张地铁地图`N`站。 每个站最多可以指定一个与其连接的其他站。 如果`p[i]`不是`-1`，车站之间有一条无向隧道`i`和站`p[i]`。 任务是确定是否存在一条仅通过隧道且仅访问每个站点一次的路线。 如果存在这样的路线，我们必须输出站序。 

该图具有特殊的结构。 每个站点最多贡献一条边，因此隧道总数最多为`N`。 一般的哈密顿路径问题很困难，但是最多有一个图`N`Edges 是一棵树或由带有一条额外边的树组成的图。 这种限制使得线性解决方案成为可能。 

和`N`最多`2 * 10^5`，任何尝试不同起点、排列或指数回溯的解决方案都是不可能的。 我们需要一个接近的算法`O(N)`，因为在时间限制内只有几百万次操作。 

危险的情况不仅仅是断开的图。 连接的图可能仍然会失败，因为如果不重新访问站点就无法遍历分支树。 例如：```
4
2 1 1 -1
```该图是`3-1-2`带有额外的叶子`4`附于`1`。 访问所有车站的路线需要进入车站`1`三次，这是不可能的。 正确答案是：```
NO
```另一个棘手的情况是具有多个分支的循环。 单独的循环有效，但是一旦附加了太多分支，哈密顿路径中就没有足够的自由端。 

## 方法

 暴力方法会尝试逐站构建路线，选择每个可能的下一个站点。 这是正确的，因为它枚举了所有可能的哈密顿路径，但可能性的数量呈阶乘增长。 即使只有几十个顶点的图也使这种方法无法使用。 

有用的观察结果是该图极其稀疏。 最多有一个连通图`N`边是树或单环图。 仅当树本身是简单路径时，树中的哈密顿路径才是可能的。 在单环图中，循环提供了灵活性，但附加的树也必须是简单路径，并且只能有足够的分支用于路线端点。 

解决方案是对图进行分类，提取环（如果存在），然后构造哈密顿路径的唯一可能形状。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(N!) | O(N) | 太慢了 |
 | 最佳 | O(N) | O(N) | 已接受 |

 ## 算法演练

 1. 根据给定的连接构建无向图并计算边数。 首先检查所有站点是否属于一个连接的组件，因为单个路径无法跨越断开的部分。 
2.如果图表有`N - 1`边缘，它是一棵树。 仅当每个顶点的度数最多为 2 时，树才具有哈密顿路径。 在这种情况下，从一片叶子开始，每次沿着唯一未使用的边缘行走。 
3.如果图表有`N`边，通过反复删除叶子来找到循环。 此过程后留下的顶点形成唯一的循环。 
4. 对于每个循环顶点，检查悬挂在其上的树木。 每个悬挂部分本身必须是一条路径。 存储从叶子到循环的路径。 
5. 如果没有悬挂路径，循环本身就是答案。 
6. 如果恰好存在一条悬挂路径，则从其叶子开始，到达环路顶点，然后继续绕环路。 
7. 如果有两条悬挂路径，则它们必须连接到相邻的循环顶点。 从一片叶子开始，穿过第一个分支，绕过循环而不使用这两个循环顶点之间的边，最后穿过第二个分支。 
8. 任何其他结构都不能包含哈密顿路径。 

构造背后的不变性是最终路线的每个内部站点必须恰好有两个使用的入射边，而两个端点可能只有一个。 该算法拒绝需要从三个不同方向访问站的每个结构。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n = int(input())
    p = list(map(int, input().split()))

    if n == 1:
        print("YES")
        print(1)
        return

    g = [[] for _ in range(n)]
    edges = 0

    for i, x in enumerate(p):
        if x != -1:
            x -= 1
            g[i].append(x)
            g[x].append(i)
            edges += 1

    seen = [False] * n
    stack = [0]
    seen[0] = True
    while stack:
        v = stack.pop()
        for u in g[v]:
            if not seen[u]:
                seen[u] = True
                stack.append(u)

    if not all(seen):
        print("NO")
        return

    def tree_path():
        for i in range(n):
            if len(g[i]) <= 1:
                start = i
                break
        ans = []
        prev = -1
        cur = start
        while cur != -1:
            ans.append(cur)
            nxt = -1
            for u in g[cur]:
                if u != prev:
                    nxt = u
                    break
            prev, cur = cur, nxt
        return ans

    if edges == n - 1:
        if max(map(len, g)) > 2:
            print("NO")
        else:
            print("YES")
            print(*[x + 1 for x in tree_path()])
        return

    if edges != n:
        print("NO")
        return

    deg = [len(x) for x in g]
    q = deque(i for i in range(n) if deg[i] == 1)
    removed = [False] * n

    while q:
        v = q.popleft()
        removed[v] = True
        for u in g[v]:
            if not removed[u]:
                deg[u] -= 1
                if deg[u] == 1:
                    q.append(u)

    cycle = [i for i in range(n) if not removed[i]]
    cycle_set = set(cycle)

    order = []
    start = cycle[0]
    prev = -1
    cur = start
    while True:
        order.append(cur)
        nxt = -1
        for u in g[cur]:
            if u != prev and u in cycle_set:
                nxt = u
                break
        prev, cur = cur, nxt
        if cur == start:
            break

    def get_branch(c, nxt):
        res = [c]
        prev = c
        cur = nxt
        while True:
            res.append(cur)
            candidates = [u for u in g[cur] if u != prev and u not in cycle_set]
            if len(candidates) > 1:
                return None
            if not candidates:
                break
            prev, cur = cur, candidates[0]
        return res[::-1]

    branches = {}
    bad = False
    for c in cycle:
        arr = []
        for u in g[c]:
            if u not in cycle_set:
                b = get_branch(c, u)
                if b is None:
                    bad = True
                else:
                    arr.append(b)
        if len(arr) > 1:
            bad = True
        if arr:
            branches[c] = arr[0]

    if bad or len(branches) > 2:
        print("NO")
        return

    def rotate_after(x):
        k = order.index(x)
        return order[k + 1:] + order[:k]

    if not branches:
        ans = order
    elif len(branches) == 1:
        c, b = next(iter(branches.items()))
        ans = b + rotate_after(c)
    else:
        c1, c2 = list(branches.keys())
        if c2 not in g[c1]:
            print("NO")
            return
        i = order.index(c1)
        if order[(i + 1) % len(order)] == c2:
            middle = order[i + 2:] + order[:i + 1]
        else:
            middle = order[i - 1:i - len(order):-1]
        ans = branches[c1] + middle + branches[c2][::-1][1:]

    if len(ans) != n:
        print("NO")
    else:
        print("YES")
        print(*[x + 1 for x in ans])

if __name__ == "__main__":
    solve()
```该实现首先区分了三种结构情况：断开图、树和单环图。 使用叶子移除过程是因为重复删除一阶顶点会移除从循环中悬挂的每棵树，并准确地留下循环顶点。 

分支验证是微妙的部分。 分支只能是链。 如果非循环顶点有两个未使用的子节点，则路径需要分割，这对于单个路径来说是不可能的。 

该构造永远不会重新访问站点，因为每个部分都只附加一次：首先是一个可能的分支，然后是循环的一部分，然后是可能的第二个分支。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N) | 每个顶点和边都会被处理固定次数 |
 | 空间| O(N) | 邻接表、队列和辅助数组存储图 |

 线性复杂度要求为`N = 2 * 10^5`。 该算法仅执行图遍历和局部检查，因此它很容易满足限制。
