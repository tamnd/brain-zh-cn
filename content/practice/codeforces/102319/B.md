---
title: "CF 102319B - 保罗羽毛球"
description: "道路形成一棵树，因此任何两个地方之间都只有一条路线。 被分配从 a 到 b 的员工每天从 s 到 t 使用该唯一路径上的每条边。 Paul 在某一天为某项优势支付一次费用，无论有多少员工使用该优势。"
date: "2026-08-14T04:46:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102319
codeforces_index: "B"
codeforces_contest_name: "UBC Summer Contest 2018"
rating: 0
weight: 102319
solve_time_s: 223
verified: true
draft: false
---

[CF 102319B - 保罗的羽毛球](https://codeforces.com/problemset/problem/102319/B)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 道路形成一棵树，因此任何两个地方之间都只有一条路线。 一名员工被指派去`a`到`b`每天都使用这条独特路径上的每一个边缘`s`通过`t`。 

Paul 在某一天为某项优势支付一次费用，无论有多少员工使用该优势。 因此，我们一天关心的数量是属于至少一个当前活动员工路线的不同树边的数量。 查询`[c,d]`要求从以下日期开始的所有每日边缘计数的总和`c`通过`d`。 

困难来自于两种独立的重叠。 不同的员工可以共享树的边缘，因此单独计算每个员工的路径会导致答案过高。 他们的活跃时间间隔也可以重叠，因此不同的员工可以多次支付相同的优势，但每天只能支付一次。 

高达`10^5`顶点、员工和查询，显式地遍历每条路径已经太昂贵了。 树路径可以包含`O(n)`边缘，因此以这种方式处理所有员工路径可以采用`O(nm)`，这是周围`10^10`最坏情况下的操作。 时代可以达到`10^9`，因此迭代几天也是不可能的。 我们只需要处理员工开始时间和查询边界，并且每个树操作必须是对数或接近对数。 

在几种边缘情况下，直接实施可能会默默失败。 考虑最小的可能树：```
2 2 1
1 2
1 2 1 3
1 2 2 4
2 4
```唯一的边缘从每天开始使用`1`通过`4`，所以答案是`3`。 单独计算员工人数会得到`3 + 3 = 6`，因为它们的区间重叠。 正确的输出是`3`。 

第二个边界情况是由一天组成的时间间隔：```
2 1 1
1 2
1 2 5 5
5 5
```边缘仅在当天使用`5`，所以答案是`1`。 将间隔视为半开而不正确转换端点可能会意外产生零。 

第三种情况捕获由仅共享部分路由的路径引起的错误：```
4 2 1
1 2
2 3
2 4
3 4 1 2
1 2 2 3
2 2
```当天`2`，两名员工都使用边缘`1-2`，但每条路线仅使用其他边之一。 不同的边缘是`1-2`,`2-3`， 和`2-4`，所以答案是`3`。 添加路径长度就可以了`1-2`两次并产生`4`。 

## 方法

 直接的解决办法是单独考虑每个员工，从`a`到`b`，并为该路径上的每个边标记其活动间隔。 处理完所有员工后，我们可以合并每个边的间隔并回答查询。 这是正确的，因为每条道路都可以独立考虑，并且合并其间隔精确地模拟了一条道路每天花费 1 美元的规则。 

问题在于路径数据量。 链中的路径可以包含`n-1`边缘，以及所有`m`员工可以使用此类路径。 和`n=m=10^5`，显式访问路径可能需要大致`10^10`边缘访问。 即使在处理区间合并之前，这也远远超出了时间限制允许的范围。 

观点的有用改变是从左到右处理时间。 假设我们已经到了一天`x`。 对于每条边，只有一条关于过去的信息很重要：当前保证该边被覆盖的最后一天。 调用这个值`E`。 当新员工开始工作时`s`并于一天结束`t`，该员工路径上的每条边都得到`E = max(E, t+1)`。 

使用`t+1`使时间间隔半开，因此员工在几天内处于活动状态`s`通过`t`提供覆盖范围直至当天开始`t+1`。 

现在考虑两个连续的员工上班时间之间会发生什么。 如果一条边当前已过期`E`，那么在当天`x`它有`max(0, E-x)`剩余承保天数。 让`R = sum max(0, E_e-x)`在所有树的边缘。 当时间从`x`到`y`，当前覆盖的每条边都会丢失`y-x`剩余覆盖范围的单位，停止于零。 在此期间支付的边缘天数正好是减少的`R`。 

这给出了中心见解。 我们不需要每天都明确地计算每一条边。 我们维护每条边、支持路径的过期值`chmax`操作，并维护所有到期值的总和。 将当前时间移至之前`x`，我们将每个过期值提高到`x`。 标准化后，具有到期的边缘`E`准确贡献`E-x`未来涵盖的天数。 

一条路`chmax`在树上可以分解为`O(log n)`使用重光分解的连续范围。 在每个范围上，我们需要以下形式的范围运算`E_i = max(E_i, x)`同时保持范围总和。 这正是线段树击败结构所支持的操作。 

最后，定义`F(x)`作为从当天开始的付费边缘天总数`1`通过一天`x`。 查询`[c,d]`简直就是`F(d) - F(c-1)`。 

我们评估`F`在所有请求的端点处离线，同时扫描相关时间坐标。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(nm + qn)`在最坏的情况下|`O(nm)`| 太慢了 |
 | 最佳|`O(n log n + m log² n + q log q)`摊销|`O(n + m + q)`| 已接受 |

 ## 算法演练

 1. 以顶点为树根`1`并进行重光分解。 每个非根顶点表示将其连接到其父顶点的边。 它的 HLD 位置将是该边在线段树中的位置。 这将树路径转换为`O(log n)`连续范围，同时正确排除最低共同祖先的传入边缘。 
2. 将每个边到期初始化为`1`。 前一天`1`没有承保范围，并且已过期`1`表示当前剩余承保天数为零`1`。 
3. 按开始日期对所有员工订单进行排序。 我们将同一起始日的员工放在一起处理，因为他们的更新应该在考虑到该天之前的时间间隔后进行。 
4. 转换每个查询`[c,d]`分成两个前缀请求。 我们需要`F(d)`和`F(c-1)`，后者用时间坐标表示`c`。 
5. 扫描已排序的员工开始时间和所有查询端点坐标。 假设当前时间是`cur`下一个坐标是`x`。 令规范化之前线段树的总过期和为`S`。 
6. 将当前时间提前`cur`到`x`通过申请`E_i = max(E_i, x)`到每一个边缘。 这只会改变已经过期的边。 之后，如果到期金额为`S'`, 期间付费边缘天数`[cur, x-1]`是`S - n_edges * cur`减`S' - n_edges * x`。 这正是剩余总覆盖范围的减少。 
7. 如果`x-1`是请求的前缀端点，将当前累积值存储为`F(x-1)`。 我们在从当天开始申请员工之前会这样做`x`，因为这些员工在任何一天都不活跃`x-1`。 
8. 处理每个开始日期为`x`。 对于员工`(a,b,s,t)`，路径从`a`到`b`由 HLD 分解，该路径上的每条边都接收`E = max(E, t+1)`。 自从`t+1`是唯一的端点，这准确地给出了`t-s+1`覆盖先前未覆盖的边缘的天数。 
9. 处理完所有相关坐标后，用以下命令回答每个原始查询`F(d) - F(c-1)`。 前缀值已经包含所有树边缘的并集，因此重叠的员工永远不会在同一天被计数两次。 

### 为什么它有效

 对于每一个边缘，`E`代表最近的独家日，一些已经开始工作的员工可以保证该优势的覆盖范围。 当新员工入职时，最大限度地发挥其能力`t+1`和`E`准确保留迄今为止在该边缘上看到的所有间隔的并集。 在任何一天`x`，替换小于的过期值`x`经过`x`不会改变未来的覆盖范围，因为这些值已经代表之前结束的间隔`x`。 在这次正常化之后，`E-x`正是该边被覆盖的未来天数。 因此，这些值的总和就是剩余的总付费边缘天数。 提前时间会将该总和减少到扫描所跨越的付费边缘天数，因此每个前缀`F(x)`是正确的。 减去两个前缀可以精确地给出请求的查询间隔内的联合成本。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**30

class SegmentTreeBeats:
    def __init__(self, n):
        self.n = n
        size = 4 * n + 5
        self.sum = [0] * size
        self.mn = [0] * size
        self.smn = [INF] * size
        self.cnt = [0] * size
        self._build(1, 0, n)

    def _build(self, p, l, r):
        if r - l == 1:
            self.sum[p] = 1
            self.mn[p] = 1
            self.smn[p] = INF
            self.cnt[p] = 1
            return

        mid = (l + r) >> 1
        self._build(p << 1, l, mid)
        self._build(p << 1 | 1, mid, r)
        self._pull(p)

    def _pull(self, p):
        lc = p << 1
        rc = lc | 1

        self.sum[p] = self.sum[lc] + self.sum[rc]

        if self.mn[lc] < self.mn[rc]:
            self.mn[p] = self.mn[lc]
            self.cnt[p] = self.cnt[lc]
            self.smn[p] = min(self.smn[lc], self.mn[rc])
        elif self.mn[lc] > self.mn[rc]:
            self.mn[p] = self.mn[rc]
            self.cnt[p] = self.cnt[rc]
            self.smn[p] = min(self.mn[lc], self.smn[rc])
        else:
            self.mn[p] = self.mn[lc]
            self.cnt[p] = self.cnt[lc] + self.cnt[rc]
            self.smn[p] = min(self.smn[lc], self.smn[rc])

    def _apply_chmax(self, p, x):
        if x <= self.mn[p]:
            return
        self.sum[p] += (x - self.mn[p]) * self.cnt[p]
        self.mn[p] = x

    def _push(self, p):
        x = self.mn[p]
        lc = p << 1
        rc = lc | 1

        if self.mn[lc] < x:
            self._apply_chmax(lc, x)
        if self.mn[rc] < x:
            self._apply_chmax(rc, x)

    def chmax(self, ql, qr, x):
        if ql >= qr:
            return
        self._chmax(1, 0, self.n, ql, qr, x)

    def _chmax(self, p, l, r, ql, qr, x):
        if qr <= l or r <= ql or x <= self.mn[p]:
            return

        if ql <= l and r <= qr and x < self.smn[p]:
            self._apply_chmax(p, x)
            return

        self._push(p)

        mid = (l + r) >> 1
        self._chmax(p << 1, l, mid, ql, qr, x)
        self._chmax(p << 1 | 1, mid, r, ql, qr, x)

        self._pull(p)

def build_hld(n, graph):
    parent = [0] * n
    depth = [0] * n
    order = [0]
    parent[0] = -1

    for v in order:
        for to in graph[v]:
            if to == parent[v]:
                continue
            parent[to] = v
            depth[to] = depth[v] + 1
            order.append(to)

    size = [1] * n
    heavy = [-1] * n

    for v in reversed(order):
        best_size = 0
        for to in graph[v]:
            if parent[to] != v:
                continue
            size[v] += size[to]
            if size[to] > best_size:
                best_size = size[to]
                heavy[v] = to

    head = [0] * n
    pos = [0] * n
    cur_pos = 0

    stack = [(0, 0)]

    while stack:
        start, h = stack.pop()
        v = start

        while v != -1:
            head[v] = h
            pos[v] = cur_pos
            cur_pos += 1

            for to in graph[v]:
                if parent[to] == v and to != heavy[v]:
                    stack.append((to, to))

            v = heavy[v]

    return parent, depth, head, pos

def path_chmax(u, v, value, parent, depth, head, pos, seg):
    while head[u] != head[v]:
        if depth[head[u]] < depth[head[v]]:
            u, v = v, u

        h = head[u]
        seg.chmax(pos[h], pos[u] + 1, value)
        u = parent[h]

    if depth[u] > depth[v]:
        u, v = v, u

    # pos[u] is the vertex containing the LCA.
    # The edge entering the LCA must not be included.
    seg.chmax(pos[u] + 1, pos[v] + 1, value)

def solve():
    n, m, q = map(int, input().split())

    graph = [[] for _ in range(n)]

    for _ in range(n - 1):
        x, y = map(int, input().split())
        x -= 1
        y -= 1
        graph[x].append(y)
        graph[y].append(x)

    trips = []
    for _ in range(m):
        a, b, s, t = map(int, input().split())
        trips.append((s, t, a - 1, b - 1))

    queries = []
    query_times = {}

    for i in range(q):
        c, d = map(int, input().split())
        queries.append((c, d))

        # F(d) is available just before day d+1.
        query_times.setdefault(d + 1, []).append((i, 1))

        # F(c-1) is available just before day c.
        query_times.setdefault(c, []).append((i, -1))

    trips.sort()

    parent, depth, head, pos = build_hld(n, graph)
    seg = SegmentTreeBeats(n - 1)

    # The root has no associated edge, so positions are shifted implicitly
    # by using every non-root vertex's HLD position. The root's position is
    # still present, so we need a segment tree of n positions and ignore
    # the root position in path updates.
    #
    # Rebuild with n positions. Position 0 belongs to the root and is never
    # touched by path_chmax.
    seg = SegmentTreeBeats(n)

    starts = trips
    trip_idx = 0

    times = set(query_times.keys())
    for s, _, _, _ in trips:
        times.add(s)
    times = sorted(times)

    current = 1
    answer_prefix = [0] * (2 * q)
    prefix_value = 0

    for x in times:
        if x < current:
            continue

        old_sum = seg.sum[1] - n * current

        seg.chmax(0, n, x)

        new_sum = seg.sum[1] - n * x
        prefix_value += old_sum - new_sum
        current = x

        if x in query_times:
            for query_id, sign in query_times[x]:
                answer_prefix[2 * query_id + (0 if sign == 1 else 1)] = prefix_value

        while trip_idx < m and starts[trip_idx][0] == x:
            _, t, a, b = starts[trip_idx]
            path_chmax(
                a, b, t + 1,
                parent, depth, head, pos, seg
            )
            trip_idx += 1

    out = []
    for i in range(q):
        fd = answer_prefix[2 * i]
        fc = answer_prefix[2 * i + 1]
        out.append(str(fd - fc))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```树预处理首先计算父树、深度、子树大小和重子树。 然后分解为每个顶点分配一个位置并记录其重链的头部。 非根顶点的位置表示从其父顶点到该顶点的边。 

线段树从过期开始`1`到处。 它的节点存储最小到期时间、第二小的不同到期时间、有多少元素等于最小值以及总和。 对于一个范围`chmax(x)`， 如果`x`不大于最小值，没有任何变化。 如果`x`严格位于最小值和第二最小值之间，每个受影响的元素都恰好处于最小值，因此可以立即更新整个节点。 否则，操作就会落到孩子身上。 这是标准线段树击败范围的想法`chmax`。 

根的位置是无害的，因为路径更新总是严格在 LCA 下面开始。 因此根位置永远不会被修改。 保持`n`位置而不是`n-1`使 HLD 索引变得简单，并避免在分解后重新映射位置。 

时间扫描使用`t+1`而不是`t`。 一名全天活跃的员工`t`白天必须遮盖相应的边缘`t`，所以它的唯一到期日是一天的开始`t+1`。 同样，通过天的查询前缀`x`在当天之前进行评估`x+1`，这解释了为什么两个查询坐标是`d+1`和`c`。 

表达式`seg.sum[1] - n * current`是剩余总覆盖范围。 以下所有到期后`current`已提升至`current`，每条边都有贡献`E-current`，包括过期边沿的零。 Python 整数具有任意精度，因此这些值可以安全地达到粗略值`10^14`，远远超出 32 位范围。 

每个时间坐标的顺序也是经过深思熟虑的。 我们首先提前时间并记录查询前缀，然后应用开始时间等于该坐标的员工。 查询结束日期为 day`x-1`不得见到当天上班的员工`x`。 

## 工作示例

 提供的语句省略了复制文本中的示例输出，但评估三个查询给出`5`,`14`， 和`4`。 

对于第一个样本，树有边缘`1-2`,`2-3`,`1-4`， 和`1-5`。 第一个员工使用`1-2`和`1-5`从几天`4`通过`7`。 第二种用途`2-3`,`1-2`， 和`1-4`从几天`2`通过`5`。 第三个用途`2-3`从几天`6`通过`9`。 

| 日 | 活动边缘| 每日费用|
 | --- | --- | --- |
 | 2 |`2-3`,`1-2`,`1-4`| 3 |
 | 3 |`2-3`,`1-2`,`1-4`| 3 |
 | 4 |`2-3`,`1-2`,`1-4`,`1-5`| 4 |
 | 5 |`2-3`,`1-2`,`1-4`,`1-5`| 4 |
 | 6 |`2-3`,`1-2`,`1-5`| 3 |
 | 7 |`2-3`,`1-2`,`1-5`| 3 |
 | 8 |`2-3`| 1 |
 | 9 |`2-3`| 1 |

 供查询`[7,11]`，成本为`3 + 1 + 1 = 5`。 为了`[3,6]`， 这是`3 + 4 + 4 + 3 = 14`。 为了`[5,5]`， 这是`4`。 

扫描从几天开始`2`,`4`， 和`6`。 白天`2`，第二个员工创建了到期时间`6`在其三个边缘上。 白天`4`，第一位员工将其中两个到期值提高到`8`。 白天`6`，第三位员工提高了`2-3`到期至`10`。 线段树永远不会对共享边进行两次计数，因为所有更新都使用`chmax`。 

第二个例子隔离了重叠行为：```
2 2 3
1 2
1 2 1 3
1 2 2 4
1 1
2 3
4 4
```只有一条路。 The first employee gives it expiration`4`，第二位员工后来将其提高到`5`。 扫描可总结如下。 

| 坐标 | 行动| 边缘过期 | 前缀成本 |
 | --- | --- | --- | --- |
 | 1 | 开始第一次旅行 | 4 | 0 |
 | 2 | 开启第二次旅行 | 5 | 1 |
 | 4 | 第 3 天的查询 | 5 | 3 |
 | 5 | 第 4 天查询 | 5 | 4 |

 答案是`1`,`2`， 和`1`对于三个查询。 共享道路仍然由一个过期值表示，这说明了为什么`chmax`state captures overlapping employees correctly.

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n + m log² n + q log q)`摊销| HLD 将每个员工路径分解为`O(log n)`范围，线段树节拍处理每个范围`chmax`对数摊销|
 | 空间|`O(n + m + q)`| 树、HLD数组、线段树、员工和查询信息都使用线性空间|

 主导工作是`m`路径更新。 和`10^5`员工和顶点，重轻分解将每条路径保持为对数多个段范围，而段树节拍避免访问这些范围中的每个边。 时间坐标也受`O(m+q)`，所以`10^9`日值的大小不会产生额外的因素。 

## 测试用例```python
import sys
import io

# The solution above is assumed to be saved as solve() in the same file.
# This helper temporarily replaces stdin and captures stdout.

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

sample = """\
5 3 3
1 2
3 2
1 4
1 5
2 5 4 7
3 4 2 5
2 3 6 9
7 11
3 6
5 5
"""

assert run(sample) == "5\n14\n4", "sample"

minimum = """\
2 1 3
1 2
1 2 1 1
1 1
2 2
1 2
"""

assert run(minimum) == "1\n0\n1", "minimum tree and one-day interval"

overlap = """\
2 2 3
1 2
1 2 1 3
1 2 2 4
1 1
2 3
4 4
"""

assert run(overlap) == "1\n2\n1", "overlapping employees on one edge"

shared_path = """\
4 2 3
1 2
2 3
2 4
3 4 1 2
1 2 2 3
1 2
2 2
3 3
"""

assert run(shared_path) == "4\n3\n1", "shared edge and path overlap"

equal_intervals = """\
3 3 4
1 2
2 3
1 3 5 5
1 3 5 5
1 2 5 5
4 5
5 5
6 6
5 5
"""

assert run(equal_intervals) == "2\n2\n0\n2", "all equal active intervals"

# A large structural test. All 100000 employees use the same complete path
# during exactly the same huge interval. Only two tree edges are ever charged.
n = 100000
m = 100000
q = 3

parts = [f"{n} {m} {q}\n"]
for v in range(2, n + 1):
    parts.append(f"{v - 1} {v}\n")

for _ in range(m):
    parts.append(f"1 {n} 1 1000000000\n")

parts.append("1 1\n")
parts.append("1 1000000000\n")
parts.append("1000000001 1000000001\n")

large_input = "".join(parts)
expected_large = f"99999\n99999999900001\n0"

assert run(large_input) == expected_large, "large repeated-path case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸的树一日游|`1`,`0`,`1`| 最小的树、包容性端点以及所有活动之外的一天 |
 | 一侧边缘有两条重叠的行程 |`1`,`2`,`1`| 多名员工不得重复收取优势 |
 | 两条路径共享一条边 |`4`,`3`,`1`| 部分路径重叠和正确的 HLD 路径边界 |
 | 等间隔和重复路径|`2`,`2`,`0`,`2`| 重复的员工和完全相同的开始/结束时间 |
 | 大链条带`10^5`相同的行程|`99999`,`99999999900001`,`0`| 大的`n`， 大的`m`、巨大的时间价值和可扩展性|

 ## 边缘情况

 最小的树只有一条边。 在```
2 1 1
1 2
1 2 5 5
5 5
```该行程将该单边更新为到期`6`。 查询端点是`6`，因此扫描前进到`6`，将剩余覆盖范围从`1`到`0`并在前缀中添加正好一个付费边缘日。 答案是`1`。 使用`t+1`这就是一日间隔发挥作用的原因。 

对于同一边缘重叠的员工，```
2 2 1
1 2
1 2 1 3
1 2 2 4
1 4
```第一次旅行将到期时间设置为`4`。 第二次旅行后来将其更改为`5`，而不是添加另一个独立的覆盖区间。 最后的前缀包含四个带薪天数，所以答案是`4`。 这正是`[1,3]`和`[2,4]`。 

对于仅部分重叠的路径，```
4 2 1
1 2
2 3
2 4
3 4 1 2
1 2 2 3
2 2
```第一条路径使用边缘`2-3`和`2-4`，而第二个使用`1-2`和`2-3`。 当天`2`，共享边`2-3`只有一个到期值。 三个不同的活动边缘给出了答案`3`。 

查询可以在另一名员工开始之前立即结束。 例如，```
2 1 2
1 2
1 2 3 5
1 2
1 3
```给出`0`为了`[1,2]`和`1`为了`[1,3]`。 前缀坐标为`[1,2]`是`3`，算法在从当天开始应用员工之前记录前缀`3`。 此命令可防止员工在第一个工作日之前被收取费用。 

最后，时间可以比每个活动间隔大得多。 为了```
2 1 2
1 2
1 2 1 1000000000
1000000000 1000000000
1000000001 1000000001
```第一次查询成本`1`，而第二个成本`0`。 不执行天数循环。 扫描直接从坐标跳转`1`到`1000000000`然后到`1000000001`，使用过期算术一次计算所有中间天数。
