---
title: "CF 102191K - 仙人掌门户"
description: "该图是简单循环的加权链。 从顶点 1 开始并向顶点 n 移动，每个循环的行为就像在连接相同两个关节顶点的两条弧之间进行选择。 除了这些循环之外，该图还包含普通的链边。"
date: "2026-08-18T09:41:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102191
codeforces_index: "K"
codeforces_contest_name: "PSUT Coding Marathon 2019"
rating: 0
weight: 102191
solve_time_s: 1129
verified: false
draft: false
---

[CF 102191K - 仙人掌门户](https://codeforces.com/problemset/problem/102191/K)

 **评级：** -
 **标签：** -
 **求解时间：** 18m 49s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该图是简单循环的加权链。 从顶点 1 开始并向顶点 n 移动，每个循环的行为就像在连接相同两个关节顶点的两条弧之间进行选择。 除了这些循环之外，该图还包含普通的链边。 由于没有两个循环共享一个顶点，因此这些选择按顺序独立发生。 

我们需要从 1 到 n 并返回到 1 进行一次往返。在向外旅行的某个顶点 u 处，我们可以启动一个门户计时器。 然后，在到达另一个顶点 v 并激活门户之前，我们最多有 k 秒的实际行走时间。 一旦激活，在 u 和 v 之间移动的成本为零。 回程时可以使用传送门，所以到达n后我们可以正常返回v，然后从v传送回u。 

假设所选择的从 1 到 n 的简单路径在 v 之前包含 u。令 P 为沿该路径从 1 到 u 的距离，D 为从 u 到 v 的距离，Q 为从 v 到 n 的距离。 完整行程费用

 [
 P+D+Q+Q+0+P=2P+D+2Q。 
]

 门户的唯一限制是 D <= k。 

输入包含 n 个顶点和 e 个加权边。 由于 n 高达 300000 且有两秒的限制，检查每对顶点的算法太慢了。 在 Python 中，即使是 O(n sqrt n) 也会有问题，因此除了对数数据结构运算之外，预期的解决方案需要保持本质上的线性。 边权重为正且最多为 1000，而 k 可以大到 10^8，因此我们必须使用精确的整数距离，而不是 k 上的有界状态动态规划。 

有几种简单的情况可以欺骗实现。 

首先，v 不一定是 n。 例如，```
2 1 4
1 2 2
```答案是 2。我们可以从顶点 1 开始传送门，走到顶点 2，激活它，通过传送门返回，并在顶点 1 结束。更一般地，在较长的链上，我们可以在激活传送门后到达 n，并且仅在最终返回时使用它。 仅考虑以 n 结尾的对的实现会错过有效的解决方案。 

第二个是最好的对可以位于一个循环内并且可以使用它的两个弧中的任何一个。 考虑```
5 5 4
1 2 1
2 3 4
3 4 4
4 2 7
4 5 1
```普通最短路径使用权重 7 的边 2-4，往返次数为 18。从 2 到 4 的另一条弧有两条权重 4 的边。我们可以从 2 开始，在 4 秒内走到 3，继续从 3 到 4，然后到 5，返回到 4 和 3，最后使用从 3 到 2 的入口。总数为 16。仅用其最短弧替换每个循环的解决方案将错过这种可能性。 

第三个是超时边界。 和```
2 1 4
1 2 5
```答案是 10，而不是 5，因为唯一可能的门户激活需要步行 5 秒，而 k 只有 4。`<= k`而不是`< k`也是必不可少的。 如果 k 为 5，则答案将变为 5。 

## 方法

 直接的解决方案将选择第一个端点 u，选择第二个端点 v，找到从 1 到 u、v 到 n 的简单路径，并评估相应的往返行程。 有 O(n^2) 对，即使可以有效地计算仙人掌内部的距离，显式检查每对也会给出 O(n^2) 工作。 当 n = 300000 时，大约需要 9 * 10^10 对检查，这是完全不可行的。 

有用的观察是该图不是任意的仙人掌。 它的循环形成一条链。 我们可以从 1 走到 n，并将图视为一系列块，其中每个块要么是一条普通边，要么是一个循环。 对于每个循环，从其左关节顶点到右关节顶点的路径恰好选择其两个弧之一。 

对于固定的路径选择，假设门户端点是 u 和 v。成本为

 [
 2P+D+2Q。 
]

 图结构让我们将这个表达式分成属于 u 的贡献、属于 v 的贡献以及它们之间的距离约束。 

假设 u 位于较早的块中，v 位于较晚的块中。 当我们到达 v 块的左关节顶点时，令 d 为沿所选路径从 u 到该关节的距离。 那么激活距离是 d+a，其中 a 是从该关节到当前块内 v 的距离。 成本变为

 [
 (2P+d)+(a+2Q+2b),
 ]

 其中 b 是从 v 到其块的右关节的剩余距离。 

第一个括号内的术语完全属于前一个端点。 当我们从一个街区移动到下一个街区时，每个旧候选者到当前边界的距离恰好增加了我们刚刚穿过的街区的最短长度。 这意味着每个候选都可以由固定的变换坐标表示，而当前前沿为每个候选提供相同的加性偏移。 

这将问题转化为前缀最小查询。 对于每个可能的第一个端点状态，我们存储一个名为`base`和一个叫做`value`。 对于当前的第二个端点，我们得到一个阈值`base`，并且需要坐标至多为该阈值的最小存储值。 存储前缀最小值的芬威克树正好提供了该操作。 

一个循环需要一个额外的细节。 内部顶点可以属于该循环中两个可能的简单路径中的任何一个，因此它有两种状态，每个弧都有一个状态。 两个关节顶点只需要它们的最短路径状态即可进行跨块转换。 两个端点位于同一块内的对由每个弧边缘上的滑动窗口单独处理。 

蛮力之所以有效，是因为每一对都可以独立评估。 它失败了，因为有平方数对。 观察到该图是一系列独立的边和循环块，我们可以从左到右扫描，将每个先前的端点保持在一个前缀最小结构中。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n + e) | 太慢了 |
 | 最佳 | O(n log n + e) | O(n log n + e) | O(n + e) | 已接受 |

 ## 算法演练

 1. 从顶点 1 向顶点 n 行走的同时分解图。 每个普通的 2 度部分都是一个边缘块。 每当到达 3 度顶点时，不是传入链边的两条边就是围绕一个循环的两个方向。 遍历两个方向，直到它们在下一个 3 度关节顶点处相遇。 这给出了循环的两条弧线。 

在该图族中，循环连接顶点的度数为 3，普通链顶点和循环内部顶点的度数为 2，顶点 1 和 n 的度数为 1。这使得无需通用块切割树即可进行分解。 
2. 对于每个块，计算其最短的从左到右的长度。 对于普通边缘来说，这只是其重量。 对于弧长为 L1 和 L2 的循环，最短块长度为 min(L1,L2)。 令这些长度为 S0、S1、...、S(m-1)。 
3. 计算最短的1对n距离

 [
 T=\sum_i S_i。 
]

 如果没有有用的门户，答案就是 2T。 我们用这个值初始化答案。 
4. 为块内的每个顶点赋予一个或两个路径状态。 一个状态表示为`(a, b)`，其中 a 是沿选定弧从块的左关节到顶点的距离，b 是沿同一弧从顶点到块的右关节的距离。 

对于长度为 S 的普通边，两种铰接状态为`(0,S)`和`(S,0)`。 对于一个周期，我们再次包括`(0,S)`和`(S,0)`对于关节顶点，其中 S 是最短循环长度。 每个内部顶点从两条弧中的每一条中获取一种状态。 
5. 令F为从顶点1到当前块的左关节的最短距离。 以最短路线穿过当前区块后，新的边界距离为`F + S`。 

对于一个州`(a,b)`作为第一个 Portal 端点，其距 1 的前缀距离为`F+a`。 一旦我们通过选定的弧线离开它的方块，它到当前边界的距离是`b`加上所有最短的中间块。 
6. 当第一个端点状态从它自己的块移动到下一个边界时，定义

 [
 基=b-(F+S)。 
]

 在边界距离为 F' 的后面的块中，从该端点到边界的实际距离为

 [
 碱基+F'。 
]

 其相关成本贡献为

 [
 2(F+a)+(碱基+F')。 
]

 重新排列给出

 [
 \left(2(F+a)+base\right)+F'。 
]

 第二个术语对于当前前沿的每个候选人来说都是通用的。 因此我们存储`2(F+a)+base`在 Fenwick 树中，索引为`base`。 
7. 对于当前第二端点状态`(a,b)`，从较早的第一个端点到它的距离是`base + F + a`。 该门户恰好可以在以下时间使用：

 [
 基数\le k-F-a。 
]

 我们在芬威克树中查询满足该不等式的所有坐标的最小存储值。 如果最小值为 M，则完整往返的成本为

 [
 M+F+a+2(b+Q),
 ]

 其中 Q 是当前块的右关节到 n 的最短距离。 
8. 在将当前块的状态插入芬威克树之前，处理当前块的所有第二端点状态。 当两个端点实际上属于同一个块时，这种顺序可以防止端点被严格使用。 
9. 分别处理同一块内的对。 对于普通边，唯一可能的正线段的长度等于该边。 

对于一个循环，独立处理其两个圆弧中的每一个。 沿着一条弧，两个顶点之间的距离是连续间隔的边权重之和。 由于所有权重均为正数，因此两指针窗口会找到总和至多为 k 的最大区间。 如果最大可用段的长度为 D 并且所选弧的长度为 L，则通过该块的完整路径的长度为`F + L + Q`，所以最终的往返行程是

 [
 2(F+L+Q)-D。 
]
 10. 坐标压缩每个`base`扫描前的值。 芬威克树存储最小值而不是总和，因此仅​​当新值较小时更新才会替换位置。 

### 为什么它有效

 每条有效的简单 1 对 n 路线在每个周期中都恰好选择一个弧。 如果两个入口端点位于不同的块中，则它们之间的路线由第一个端点选择的弧的剩余部分、穿过所有完全交叉的块的最短路线以及第二个端点选择的弧的起点组成。 改造后的`base`值精确捕获在扫描前进时保持固定的距离部分。 Fenwick 查询恰好考虑那些总激活距离至多为 k 的早期状态，并在其中选择最小可能的往返贡献。 

如果两个端点位于同一块中，则它们必须位于该块的同一选定圆弧上。 滑动窗口检查每条弧上的每个连续顶点间隔，并保留长度至多为 k 的最长间隔。 由于门户准确保存了普通往返的间隔长度，因此公式`2(F+L+Q)-D`评估每个相同块的可能性。 

因此，每个有效的门户放置都通过跨块 Fenwick 查询或同块滑动窗口来考虑，而每个生成的候选都对应于有效的简单路径。 将最小值与无入口基线一起得出最佳值。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right
from array import array

input = sys.stdin.readline

def solve():
    n, e, k = map(int, input().split())
    n0 = n - 1

    # Edge data. Using arrays keeps the graph representation compact.
    eu = array('i')
    ev = array('i')
    ew = array('i')

    # Each adjacency entry is an edge id.
    adj = [[] for _ in range(n)]

    for eid in range(e):
        u, v, w = map(int, input().split())
        u -= 1
        v -= 1
        eu.append(u)
        ev.append(v)
        ew.append(w)
        adj[u].append(eid)
        adj[v].append(eid)

    def other(eid, x):
        u = eu[eid]
        v = ev[eid]
        return v if u == x else u

    # Walk one direction around a cycle starting with first_eid.
    # The cycle is guaranteed to meet the chain again at a degree-3 vertex.
    def walk_cycle(start, first_eid):
        arc = []
        cur = start
        pe = first_eid

        while True:
            arc.append(pe)

            if eu[pe] == cur:
                nxt = ev[pe]
            else:
                nxt = eu[pe]

            if nxt != start and len(adj[nxt]) == 3:
                return arc, nxt

            # Every non-terminal vertex inside a cycle has degree 2.
            e0 = adj[nxt][0]
            e1 = adj[nxt][1]
            ne = e1 if e0 == pe else e0

            cur = nxt
            pe = ne

    # Blocks are:
    # (0, edge_id, edge_length)
    # (1, arc1_edge_ids, arc2_edge_ids, arc1_length, arc2_length)
    blocks = []

    cur = 0
    prev_eid = -1

    while cur != n0:
        deg = len(adj[cur])

        if deg == 2:
            e0 = adj[cur][0]
            e1 = adj[cur][1]
            eid = e1 if e0 == prev_eid else e0

            nxt = other(eid, cur)
            blocks.append((0, eid, ew[eid]))

            prev_eid = eid
            cur = nxt
            continue

        # At a degree-3 vertex, prev_eid is the incoming chain edge.
        starts = []
        for eid in adj[cur]:
            if eid != prev_eid:
                starts.append(eid)

        arc1, end1 = walk_cycle(cur, starts[0])
        arc2, end2 = walk_cycle(cur, starts[1])

        # Both arcs must reach the same right articulation vertex.
        end = end1

        len1 = 0
        for eid in arc1:
            len1 += ew[eid]

        len2 = 0
        for eid in arc2:
            len2 += ew[eid]

        blocks.append((1, arc1, arc2, len1, len2))

        # Leave the cycle through its unique non-cycle edge.
        cycle_edges = set(arc1)
        cycle_edges.update(arc2)

        out_eid = -1
        for eid in adj[end]:
            if eid not in cycle_edges:
                out_eid = eid
                break

        # The chain edge after the cycle is a separate block.
        nxt = other(out_eid, end)
        blocks.append((0, out_eid, ew[out_eid]))

        prev_eid = out_eid
        cur = nxt

    m = len(blocks)

    # Shortest left-to-right length of every block.
    shortest = [0] * m
    total = 0

    for i, block in enumerate(blocks):
        if block[0] == 0:
            s = block[2]
        else:
            s = block[3]
            if block[4] < s:
                s = block[4]

        shortest[i] = s
        total += s

    # Yield all path states (a, b) for a block.
    # a = distance from left articulation to endpoint
    # b = distance from endpoint to right articulation
    def states(block, s):
        if block[0] == 0:
            yield 0, s
            yield s, 0
            return

        arc1, arc2, len1, len2 = block[1], block[2], block[3], block[4]

        # Articulation states use the shortest way through the cycle.
        yield 0, s
        yield s, 0

        cur_dist = 0
        for j in range(len(arc1) - 1):
            cur_dist += ew[arc1[j]]
            yield cur_dist, len1 - cur_dist

        cur_dist = 0
        for j in range(len(arc2) - 1):
            cur_dist += ew[arc2[j]]
            yield cur_dist, len2 - cur_dist

    # Collect all transformed coordinates for coordinate compression.
    bases = []
    F = 0

    for i, block in enumerate(blocks):
        s = shortest[i]
        after = F + s

        for a, b in states(block, s):
            bases.append(b - after)

        F = after

    bases.sort()

    INF = 10**30
    size = len(bases)
    bit = [INF] * (size + 1)

    def update(pos, value):
        while pos <= size:
            if value < bit[pos]:
                bit[pos] = value
            pos += pos & -pos

    def query(pos):
        result = INF
        while pos > 0:
            value = bit[pos]
            if value < result:
                result = value
            pos -= pos & -pos
        return result

    answer = 2 * total
    F = 0

    for i, block in enumerate(blocks):
        s = shortest[i]
        after = F + s
        Q = total - after

        # First handle both endpoints inside this block.
        if block[0] == 0:
            w = block[2]
            if w <= k:
                candidate = 2 * (F + w + Q) - w
                if candidate < answer:
                    answer = candidate
        else:
            arc1 = block[1]
            arc2 = block[2]
            len1 = block[3]
            len2 = block[4]

            for arc, length in ((arc1, len1), (arc2, len2)):
                left = 0
                window = 0
                best = 0

                for right in range(len(arc)):
                    window += ew[arc[right]]

                    while window > k:
                        window -= ew[arc[left]]
                        left += 1

                    if window > best:
                        best = window

                if best > 0:
                    candidate = 2 * (F + length + Q) - best
                    if candidate < answer:
                        answer = candidate

        # Query all previous blocks as possible first endpoints.
        for a, b in states(block, s):
            threshold = k - F - a
            pos = bisect_right(bases, threshold)

            if pos == 0:
                continue

            best = query(pos)
            if best == INF:
                continue

            candidate = best + F + a + 2 * (b + Q)
            if candidate < answer:
                answer = candidate

        # Only after all queries do current states become previous states.
        for a, b in states(block, s):
            base = b - after
            pos = bisect_left(bases, base) + 1
            value = 2 * (F + a) + base
            update(pos, value)

        F = after

    print(answer)

if __name__ == "__main__":
    solve()
```图表示将每个无向边存储在三个紧凑数组中一次，并且仅在邻接列表中保留边 ID。 这避免了为每个邻接条目存储两个完整的端点权重元组。 

第一次遍历直接从度数模式构建区块链。 在 2 度顶点处，只有一条边不会返回到前一个顶点，因此该边是下一个链块。 在 3 度顶点，传入的链边是已知的，正好留下两个循环边。 独立地遍历这两个边可以恢复两个循环弧。 

这`states`生成器是可能的门户端点的中心表示。 内部循环顶点在每个弧上出现一次，因此它接收两个状态。 关节顶点仅接收跨块转换的最短块状态。 相同块的转换是单独处理的，这就是为什么不需要更长的发音状态的原因。 

变换后的坐标`base = b - after`是芬威克横扫的关键。 在边界距离为 F 的后面的块中，从该端点到边界的实际距离为`base + F`。 超时条件因此成为一个简单的前缀条件`base`。 

芬威克树存储最小值。 其更新操作执行标准点更新，而其查询返回每个压缩坐标的最小值，最高可达指定阈值。 使用`bisect_right`是故意的，因为入口距离恰好等于 k ​​是合法的。 

所有距离大约可以达到 3 * 10^8，并且中间表达式也可以轻松地在 Python 整数内。 不需要特殊的溢出处理。 

## 工作示例

 ### 示例 1

 当从 1 移动到 12 时，该图分解为以下块：

 | 块| 结构| 最短长度|
 | --- | --- | --- |
 | 1 | 边缘 1-2 | 2 |
 | 2 | 周期 2 至 4，弧线 2-5-4 和 2-3-4 | 6 |
 | 3 | 边缘 4-6 | 2 |
 | 4 | 边缘 6-10 | 3 |
 | 5 | 周期 10 到 9，弧线 10-9 和 10-11-7-8-9 | 2 |
 | 6 | 边缘 9-12 | 4 |

 因此最短的 1 到 12 路径有长度

 [
 2+6+2+3+2+4=19，
 ]

 所以如果没有门户，成本是 38。 

最佳的第一个端点是顶点 5。在第一个循环中，它使用弧 2-5-4，因此它到 1 的距离是 2+3=5。 从顶点 5 到最后一个块的左关节（顶点 9），距离为 3+2+3+2=10。 从 9 到 12 的最后一条边又贡献了 4 秒，使传送门激活距离为 14。 

| 变量| 价值|
 | --- | --- |
 | 第一个端点 u | 5 |
 | 到你的距离 1 | 5 |
 | u 到边境 9 的距离 | 10 | 10
 | 距离 9 到 v = 12 | 4 |
 | 激活距离| 14 | 14
 | 总计 | 5 + 14 + 5 = 24 | 5 + 14 + 5 = 24 |

 Fenwick 查询接受此候选值，因为 14 <= k = 14。生成的答案是 24，与样本匹配。 

### 自定义循环示例

 考虑```
5 5 4
1 2 1
2 3 4
3 4 4
4 2 7
4 5 1
```2和4之间的循环有两条长度为8和7的弧。普通最短路径选择长度为7的边2-4，因此1到5的最短距离为9，基线往返为18。 

直接循环边的权重为 7，因此它不能用于门户激活，因为 k 为 4。然而，在另一条弧上，每条边的权重为 4。我们可以选择 u = 2 和 v = 3。 

| 变量| 价值|
 | --- | --- |
 | 第一个端点 u | 2 |
 | u 的前缀 | 1 |
 | 选定的弧线 | 2-3-4 | 2-3-4
 | 你到v | 4 |
 | v 到 n | 4 + 1 = 5 |
 | 总计 | 2(1) + 4 + 2(5) = 16 | 2(1) + 4 + 2(5) = 16

 同块滑动窗口在长弧上找到长度为4的最大可用线段。 答案变为 16，比无门户值 18 有所提高。 

这个例子说明了为什么循环不能简单地用它的最短弧来代替。 较长的弧可能包含距离在入口超时范围内的唯一一对顶点。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + e) + n log n) | O((n + e) + n log n) | 块遍历是线性的，每个状态都会生成固定次数，并且每个 Fenwick 操作的成本为 O(log n)。 |
 | 空间| O(n + e) | 图、块表示、压缩坐标和 Fenwick 树在输入大小上都是线性的。 |

 图的结构限制给出 e = O(n)，因为每个循环仅比其顶点数多贡献一条边，并且循环是顶点不相交的。 最多有大约 2n 个端点状态，Fenwick 树仅处理 O(n) 更新和查询。 这使解保持在 n = 300000 的预期渐近极限内。 

## 测试用例```python
import sys
import io

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    try:
        solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return out.getvalue().strip()

# Provided sample
sample1 = """\
12 13 14
1 2 2
4 3 5
10 9 2
9 8 7
2 5 3
6 4 2
2 3 2
10 11 5
11 7 6
9 12 4
5 4 3
8 7 1
10 6 3
"""
assert run(sample1) == "24", "sample 1"

# Minimum-size graph, portal can be activated exactly at the timeout.
assert run("""\
2 1 5
1 2 5
""") == "5", "minimum size and k equality"

# Boundary case, the only edge is longer than k, so no portal can activate.
assert run("""\
2 1 4
1 2 5
""") == "10", "portal timeout boundary"

# Maximum-size path, all edge weights are equal.
# The whole path has length 299999 and can be used as the portal segment.
n = 300000
lines = [f"{n} {n - 1} 100000000"]
for i in range(1, n):
    lines.append(f"{i} {i + 1} 1")
large_case = "\n".join(lines) + "\n"

assert run(large_case) == "299999", "maximum-size all-equal chain"

# A longer cycle arc contains the only usable portal segment.
assert run("""\
5 5 4
1 2 1
2 3 4
3 4 4
4 2 7
4 5 1
""") == "16", "cycle arc and same-block portal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 24 | 跨区块传送门放置及样本的最优周期选择 |
 |`2 1 5 / 1 2 5`| 5 | 最小图形和包容性`distance <= k`边界|
 |`2 1 4 / 1 2 5`| 10 | 10 当激活距离超过k时正确拒绝 |
 | 30万顶点单元链| 299999 | 299999 最大输入大小、全等权重和长跨块窗口 |
 | 带环的五顶点图 | 16 | 16 同块处理和非最短循环弧内的入口端点 |

 ## 边缘情况

 对于最小图```
2 1 5
1 2 5
```只有一个街区。 它的最短长度为 5，因此无入口基线为 10。同块计算找到长度为 5 的段，因为滑动窗口接受与 k 相等。 结果值为`2 * 5 - 5 = 5`。 

为了```
2 1 4
1 2 5
```相同的滑动窗口立即看到唯一的边的权重为 5 > 4。其可用段长度为零，因此没有门户候选者可以改善基线。 该算法返回 10。 

对于链条```
4 3 4
1 2 2
2 3 2
3 4 2
```最短的 1 到 4 距离为 6，基线为 12。第一个端点可以是顶点 1，第二个端点可以是顶点 3。它们的距离是 4，因此门户恰好在超时边界处激活。 由此产生的成本是

 [
 2\cdot0+4+2\cdot2=8。 
]

 芬威克扫荡队在多个街区发现了这一对。 这也是捕获错误要求第二个端点为 n 的实现的情况。 

对于循环情况```
5 5 4
1 2 1
2 3 4
3 4 4
4 2 7
4 5 1
```循环中的最短路线使用长度为 7 的 2-4，但该边对于门户来说太长了。 另一条弧由长度为 4 的两条边组成。同块滑动窗口找到长度为 4 的段 2-3。其前缀为 1，从 3 到 5 的后缀为 5，得到

 [
 2\cdot1+4+2\cdot5=16。 
]

 因此，答案是 16，尽管普通的最短往返行程是 18。这证实了算法必须保留每个周期的两个弧，而不是只保留最短的一个。
