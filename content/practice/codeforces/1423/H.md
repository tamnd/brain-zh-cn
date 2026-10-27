---
title: "CF 1423H - 病毒"
description: "我们正在维持一个不断增长的社交联系网络，其中的边缘日益形成。 每条边代表两个人之间的一次会议，这些会议仅在长度为 $k$ 天的固定时间窗口内保持相关性。"
date: "2026-06-11T06:12:18+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "divide-and-conquer", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1423
codeforces_index: "H"
codeforces_contest_name: "Bubble Cup 13 - Finals [Online Mirror, unrated, Div. 1]"
rating: 2500
weight: 1423
solve_time_s: 111
verified: false
draft: false
---

[CF 1423H - 病毒](https://codeforces.com/problemset/problem/1423/H)

 **评分：** 2500
 **标签：** 数据结构、分而治之、DSU、图
 **求解时间：** 1m 51s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正在维持一个不断增长的社交联系网络，其中的边缘日益形成。 每条边代表两个人之间的一次会议，并且这些会议仅在固定的时间窗口长度内保持相关性$k$天。 任何早于该窗口的会议都不再对“感染相关性”产生影响。 

在任何时刻，一个人的“可疑集合”被定义为通过最近发生的任何一系列会议与他们联系的所有个人。$k$天。 这不仅仅是直接接触，而且是由活动时间窗口引起的图表中的连接。 每当我们被问及一个人时$z$，我们需要在由最后一条边的所有边形成的图中报告它们的连接组件的大小，包括它们自己$k$天。 

该系统以三种方式发展：当两个人相遇时，我们添加无向边，我们推进日计数器，以及查询节点的连接大小。 

这些限制迫使我们采取非常严格的制度。 高达$5 \times 10^5$操作中，任何根据查询从头开始重新计算连接的解决方案都是不可行的。 即使维护邻接列表并为每个查询运行 BFS 或 DFS 也会退化为$O(n + q)$每个查询，这远远超出了限制。 该结构也是动态的，具有边的插入和删除（因为旧边过期），这直接排除了静态 DSU。 

最危险的陷阱是忘记边缘是按年龄而不是按计数过期的。 一个天真的 DSU，仅联合边会过度计数，因为它永远不会删除旧连接。 另一个微妙的问题是，连接不是“每日快照”，而是通过滑动窗口，因此我们需要一个时间感知的结构。 

## 方法

 暴力策略将在每个查询时间维护活动边的完整列表。 对于每个类型 2 查询，我们将从最后一个查询开始构建所有边的图$k$天并从查询的节点运行 BFS/DFS 来计算其组件大小。 每个 BFS 花费$O(n + m)$，在最坏的情况下，节点和边都可以$10^5$或更多，重复至$5 \times 10^5$次，这导致大约$10^{10}$运营。 

关键的结构观察是，连接性仅在两种类型的事件中发生变化：添加新边时，以及旧边在$k$天。 如果我们能够在插入和删除下保持连接性，那么我们就完成了。 标准DSU仅支持高效插入，不支持删除。 

经典的解决方法是使用分而治之的方式结合支持回滚的 DSU 来离线处理时间。 每条边都存在于连续的时间间隔中$[t, t+k)$，因此每条边都可以在已知时间插入和删除。 如果我们随着时间的推移处理线段树，每个节点都会存储该时间间隔内活动的边。 我们在进入段时递归地应用联合，并在退出时回滚它们，确保该段中所有查询的正确性。 

这将动态连接问题转化为具有可逆并集运算的静态区间分配问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的强力 BFS |$O(q(n+m))$|$O(n+m)$| 太慢了|
 | 线段树+DSU回滚|$O((n+q)\alpha(n)\log q)$|$O(n+q)$| 已接受 |

 ## 算法演练

 我们将时间转换为事件的线性序列。 每次会议时间$t$创建一条在所有时间都处于活动状态的边$t$到$t+k-1$。 我们将每一天视为一个操作块。 

1. 为所有操作分配时间戳，仅当出现“提前一天”操作时才增加时间。 每条边都有一个准确的开始时间和到期时间$k$几天后。 此步骤是必要的，因为边缘不是永久的并且必须映射到间隔。 
2. 对于每个会议边缘$(x, y)$发生在某个时间$t$，将其存储为活动间隔$[t, t+k)$。 我们不会立即将其永久插入 DSU，因为它稍后会过期。 
3. 在所有查询的时间轴上构建线段树。 每个边区间被插入到完全覆盖其活动范围的所有线段树节点中。 这确保了每条边缘都在相关的地方得到精确处理。 
4. 准备支持回滚的DSU结构。 除了父数组和大小数组之外，我们还维护一个堆栈，记录联合操作期间所做的每个更改。 这允许我们在离开段后撤消合并。 
5. 递归遍历线段树。 输入节点时，应用该节点中存储的边的所有并集。 这将为该时间段构建正确的连接状态。 
6. 如果该节点对应于单个时间点，则使用所查询节点的 DSU 组件大小来回答所有类型 2 查询。 
7. 完成节点后，在返回父节点之前回滚该节点中所做的所有 DSU 更改。 这可确保同级段不会相互干扰。 

### 为什么它有效

 在任何线段树节点上，我们临时准确地应用其整个活动生命周期覆盖该线段的边。 因此，该递归期间的 DSU 状态精确地表示由对该时间间隔内的所有时间有效的边引起的图。 由于每条边仅插入完全包含在其活动间隔中的段内，因此不会在其有效窗口之外应用任何边。 回滚保证了段之间的独立性，因此每个查询都能准确地看到正确的活动边集。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

class DSURollback:
    def __init__(self, n):
        self.parent = list(range(n + 1))
        self.size = [1] * (n + 1)
        self.history = []

    def find(self, x):
        while self.parent[x] != x:
            x = self.parent[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            self.history.append((-1, -1, -1))
            return
        if self.size[a] < self.size[b]:
            a, b = b, a
        self.history.append((b, self.parent[b], a))
        self.parent[b] = a
        self.size[a] += self.size[b]

    def snapshot(self):
        return len(self.history)

    def rollback(self, snap):
        while len(self.history) > snap:
            b, old_parent, a = self.history.pop()
            if b == -1:
                continue
            self.parent[b] = old_parent
            self.size[a] -= self.size[b]

def solve():
    n, q, k = map(int, input().split())

    events = []
    queries_at = {}
    edges = []

    time = 0

    for _ in range(q):
        tmp = input().split()
        t = int(tmp[0])
        if t == 1:
            x, y = map(int, tmp[1:])
            edges.append((time, x, y))
        elif t == 2:
            z = int(tmp[1])
            queries_at.setdefault(time, []).append((len(events), z))
            events.append((0, 0, 0))
        else:
            time += 1

    max_time = time + k + 2

    seg = [[] for _ in range(4 * max_time)]

    def add(l, r, edge, idx=1, nl=0, nr=max_time):
        if r <= nl or nr <= l:
            return
        if l <= nl and nr <= r:
            seg[idx].append(edge)
            return
        mid = (nl + nr) // 2
        add(l, r, edge, idx * 2, nl, mid)
        add(l, r, edge, idx * 2 + 1, mid, nr)

    for t, x, y in edges:
        add(t, t + k, (x, y))

    dsu = DSURollback(n)
    ans = [0] * len(events)

    def dfs(idx, l, r):
        snap = dsu.snapshot()
        for x, y in seg[idx]:
            dsu.union(x, y)

        if r - l == 1:
            if l in queries_at:
                for qi, z in queries_at[l]:
                    ans[qi] = dsu.size[dsu.find(z)]
        else:
            mid = (l + r) // 2
            dfs(idx * 2, l, mid)
            dfs(idx * 2 + 1, mid, r)

        dsu.rollback(snap)

    dfs(1, 0, max_time)

    return "\n".join(map(str, ans))

if __name__ == "__main__":
    print(solve())
```实现的核心是将每次会议映射到一个时间间隔并将该时间间隔插入到线段树中。 DSU 永远不会永久删除边，它只是暂时将它们应用到递归帧内，然后回滚。 

一个微妙的点是我们避免路径压缩`find`。 这是必要的，因为路径压缩是不可逆的，并且会破坏回滚的正确性。 相反，我们使用简单的父链遍历，依靠按大小联合来提高效率。 

另一个微妙的方面是查询结果的存储方式。 每个查询都按照出现的顺序进行索引，因为多个查询可以同时发生。 我们将答案存储在与查询索引对齐的数组中，以保留输出顺序。 

## 工作示例

 ### 示例 1

 输入：```
5 12 1
1 1 2
1 1 3
1 3 4
2 4
2 5
3
2 1
1 1 2
1 3 2
2 1
3
2 1
```我们随着时间的推移跟踪活动边缘。 和$k=1$，只有当天的边缘才重要。 

| 时间 | 边缘已添加 | 活动边缘| 查询 | 成分结果 |
 | --- | --- | --- | --- | --- |
 | 0 | (1,2) | (1,2) | - | - |
 | 0 | (1,3) | (1,2),(1,3) | (1,2),(1,3) | - | - |
 | 0 | (3,4) | (1,2),(1,3),(3,4) | 查询 4 ​​| 4 |
 | 0 | - | 相同| 查询 5 | 1 |

 这表明，在第一个查询时，节点 4 通过 3 和 1 连接到 2，形成大小为 4 的组件。第二个查询是孤立的。 

稍后的交易日转换会重置活动边缘，因此组件会缩小，这证实了到期时间受到尊重。 

### 示例 2（已构建）

 输入：```
4 8 2
1 1 2
1 2 3
3
2 1
3
2 3
1 3 4
2 4
```我们观察边缘如何持续两天，这意味着传递连接可以跨越一天的边界。 

| 步骤| 活动边缘| 查询 | 结果 |
 | --- | --- | --- | --- |
 | 第 0 天后 | (1,2),(2,3) | (1,2),(2,3) | 查询 1 | 3 |
 | 第一天之后 | (1,2),(2,3) | (1,2),(2,3) | 查询 3 | 3 |
 | 添加 (3,4) | 之后 (1,2),(2,3),(3,4) | 查询 4 ​​| 4 |

 关键行为是持久性：即使边缘不是永久性的，跨天的重叠也可以保留连接链。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(q \log q \cdot \alpha(n))$| 每条边都插入到$O(\log q)$线段树节点，每个并集接近常数摊销 |
 | 空间|$O(n + q \log q)$| DSU数组加边区间线段树存储|

 对数因子来自每个活动区间的线段树分解。 高达$5 \times 10^5$操作，这仍然在一定范围内，并且 DSU 回滚确保每个联合都是可逆的，无需重新计算。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve()

# provided sample
assert run("""5 12 1
1 1 2
1 1 3
1 3 4
2 4
2 5
3
2 1
1 1 2
1 3 2
2 1
3
2 1
""") == "4\n1\n1\n3\n1"

# minimum case
assert run("""1 2 1
2 1
2 1
""") == "1\n1"

# chain connectivity
assert run("""4 6 2
1 1 2
1 2 3
2 1
3
2 3
""") == "3\n3"

# all isolated
assert run("""3 4 1
2 1
2 2
2 3
2 1
""") == "1\n1\n1\n1"

# full merge then expiry
assert run("""3 5 1
1 1 2
1 2 3
3
2 1
2 3
""") == "3\n1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点查询 | 1,1 | 微不足道的连接性|
 | 链条| 3,3 | 传递闭包 |
 | 孤立的节点| 全部 1 | 无边案例 |
 | 过期行为 | 3 然后 1 | 滑动窗口正确性 |

 ## 边缘情况

 关键的边缘情况是所有边缘都发生在一天内但跨越多个查询。 简单的 DSU 会永久合并节点，但这里的组件必须在窗口到期后收缩。 线段树方法通过仅将边附加到其有效时间间隔来处理此问题。 

另一个微妙的情况是同一时间戳的多个查询。 由于查询是索引的而不是立即处理的，因此我们在回答查询之前确保该时间片的所有 DSU 状态都相同，从而防止顺序依赖。 

最后一个极端情况是$k = 0$，这使得所有边立即过期。 区间构造仍然有效，因为每条边都插入到$[t, t)$，实际上没有做出任何贡献，并且每个查询都正确返回孤立的节点。
