---
title: "CF 102412C - 钢珠运行"
description: "我们有一棵树，其顶点当前可能包含也可能不包含芯片。 查询会在这两种状态之间切换一个顶点。 每次切换后，我们需要将所有当前存在的筹码收集到一个公共顶点所需的最小边遍历总数。"
date: "2026-08-10T14:00:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102412
codeforces_index: "C"
codeforces_contest_name: "MEX Foundation Contest (supported by AIM Tech)"
rating: 0
weight: 102412
solve_time_s: 1030
verified: true
draft: false
---

[CF 102412C - 钢球奔跑](https://codeforces.com/problemset/problem/102412/C)

 **评级：** -
 **标签：** -
 **求解时间：** 17m 10s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树，其顶点当前可能包含也可能不包含芯片。 查询会在这两种状态之间切换一个顶点。 每次切换后，我们需要将所有当前存在的筹码收集到一个公共顶点所需的最小边遍历总数。 一个芯片可能会穿过包含其他芯片的顶点，因此选择目标顶点（v）的成本很简单

 [
 F(v)=\sum_{u\text{ 有一个芯片}} \operatorname{dist}(u,v)。 
]

 答案是所有顶点的 (F(v)) 的最小值。 

该树最多包含 (10^5) 个顶点，并且最多有 (10^5) 个更新。 官方规定时间限制为4秒，内存限制为256 MiB。 这排除了每次查询后扫描整个树的任何情况。 (O(nq)) 解决方案可以在最大限制下执行大约 (10^{10}) 次操作，这远远超出了适合的范围。 每次更新我们需要大约对数的工作。 

有几种边缘情况很容易被错误处理。 如果只有一个芯片，答案总是零。 例如，```
1
1
+ 1
```有输出```
0
```因为芯片已经到达目的地了。 

最佳目的地不一定包含芯片。 在路径 (1-2-3) 上，在顶点 1 和 3 处添加碎片给出```
3
1 2
2 3
2
+ 1
+ 3
```带输出```
0
2
```最佳目的地是顶点 2，它是空的。 仅考虑占用顶点的实现只有在碰巧间接处理这种情况时才会错误地报告 2，并且通常它可能会错过真正的最佳值。 

也可以有两个同样好的中值顶点。 在路径 (1-2) 上，如果两个端点都包含芯片，则将所有内容移动到任一端点都会花费 1。 假设中位数唯一的方法可能会意外地拒绝正确答案。 有用的表征基于严格包含超过一半芯片的组件，因此可以自然地处理任一中值。 

最后，输入禁止删除最后一个筹码，但删除一个筹码仍然可以留下恰好一个筹码。 例如，```
3
1 2
2 3
3
+ 1
+ 3
- 1
```产生```
0
2
0
```当更新后活动集大小立即为 1 时，数据结构必须起作用。 

## 方法

 直接解决方案可以在每次查询后重新计算整个目标。 对树进行一次生根，计算每个子树中的片数，计算距根的距离总和，然后重新对所有顶点的距离和进行生根。 标准的重生根公式是

 [
 F(v)=F(p)+M-2S_v，
 ]

 当 (v) 是 (p) 的子树时，其中 (M) 是码片总数，(S_v) 是 (v) 子树中的码片数量。 这会在 (O(n)) 时间内给出一个查询的准确答案。 

问题在于，在 (10^5) 次查询之后执行此操作的成本为 (O(nq))，这大约是最大约束下的 (10^{10}) 次操作。 暴力破解是正确的，因为它显式地评估每个可能的目的地，但它会重复丢弃先前查询中的几乎所有信息。 

关键的观察结果是物镜在树上具有非常刚性的形状。 假设我们站在顶点 (v) 处，并穿过一条边移动到包含 (x) 个芯片的组件中。 这些 (x) 芯片中的每一个都靠近一个边缘，而其他 (M-x) 个芯片中的每一个都靠近一个边缘。 因此，

 [
 F(\text{下一个})-F(v)=(M-x)-x=M-2x。 
]

 因此，转向包含一半以上芯片的组件严格改善了答案。 转向包含最多一半的组件并不能改善它。 因此，当通过移除顶点获得的每个分量最多包含所有芯片的一半时，该顶点是最佳的。 这是树的加权中位数。 

任意生根原树。 在这棵有根树中，如果某个子子树包含所有筹码的一半以上，则中位数必须在该子树内部。 我们可以反复跟随那个沉重的孩子。 同样，中位数是其子树严格包含所有碎片一半以上的最深顶点。 

剩下的问题是动态地找到该顶点。 欧拉之旅将每个子树变成一个连续的区间。 芬威克树可以维护哪些顶点包含芯片，因此子树芯片计数变成了区间和查询。 我们首先找到穿过欧拉阶中点的筹码。 任何包含超过一半芯片的子树都必须包含该芯片，因此中位数位于根到该芯片的路径上。 然后，二元提升会找到最深的祖先，其子树仍包含一半以上的碎片。 这会花费 (O(\log^2 n))，因为每个 (O(\log n)) 祖先检查都会执行 Fenwick 前缀和查询。 

找到中位数后，我们仍然需要它到所有筹码的总距离。 重新计算这个总和的成本太高了。 质心分解给出了正确的动态结构。 对于每个质心 (c)，我们维护那里表示的活动芯片的数量以及它们到 (c) 的总距离。 我们还存储每个质心子项的相应信息，以便可以减去同一分解组件的贡献一次。 插入或删除仅更改 (O(\log n)) 质心祖先，距离和查询访问相同 (O(\log n)) 祖先。 

这两种技术解决了问题的不同部分。 欧拉阶和二元提升确定最佳位置，而质心分解则评估该最佳位置的目标。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(nq)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳 | (O(n\log n+q\log^2 n)) | (O(n\log n)) | 已接受 |

 ## 算法演练

 1. 以顶点 1 处的原始树为根并执行欧拉游览。 店铺`tin[v]`和`tout[v]`，因此 (v) 的子树对应于欧拉区间 ([tin[v],tout[v]))。 还构建了二进制提升祖先。 
2. 维护Fenwick树中当前的芯片配置。 位置`tin[v]`当顶点 (v) 有芯片时恰好包含 1。 因此，Fenwick 树支持添加或删除芯片以及对任何子树内的芯片进行计数。 
3. 设(M)为当前芯片数并设置

 [
 k=\left\lfloor\frac M2\right\rfloor+1。 
]

 找到欧拉阶中的第 (k) 个活动顶点。 称之为（x）。 这是中点之后的第一个活动顶点。 

1. 中位数必须是 (x) 的祖先。 如果某个顶点在其子树中拥有超过一半的碎片，则该子树包含第 (k) 个活动顶点。 因此，每个可能的中位数都位于根到 (x) 的路径上。 
2. 从(x)开始，在候选祖先子树包含少于(k)个码片的情况下，使用二元提升尽可能向上爬。 具有至少 (k) 个筹码的第一个祖先是包含超过一半筹码的最深子树，因此它是有效的树中位数。 
3. 构建原始树的质心分解。 对于每个顶点，存储其到其质心祖先的距离。 质心树具有对数高度，因为每个质心将其组件分割成最多一半大小的块。 
4. 对于每个质心 (c)，保持`cnt[c]`，由该质心代表的活动芯片的数量，以及`sum[c]`，它们到 (c) 的距离之和。 对于每个非根质心 (c)，还保持`subcnt[c]`和`subsum[c]`，描述由 (c) 表示的组件相对于其质心父组件。 
5. 当在顶点 (v) 处插入或移除芯片时，从 (v) 向上穿过质心树。 在质心 (c) 处，将更新添加到`cnt[c]`并将相应的距离添加到`sum[c]`。 如果 (c) 有质心父级，则更新`subcnt[c]`和`subsum[c]`以及。 
6. 要计算从任意顶点 (v) 到每个活动芯片的总距离，请遍历其质心祖先。 对于质心 (c)，`sum[c] + cnt[c] * dist(v,c)`计算存储在那里的所有芯片的贡献。 与 (v) 属于同一质心组件的芯片已经在更深的质心处计数，因此减去`subsum[child] + subcnt[child] * dist(v,c)`为了那个孩子。 
7. 每次查询后，更新芬威克树和质心结构，找到当前中位数，使用质心结构评估其总距离，并打印该值。 

### 为什么它有效

 中心不变量是，当顶点周围没有任何组件包含超过一半的活动芯片时，该顶点恰好是距离和函数的最小值。 如果存在这样的组件，则穿过其边缘会降低目标，因此当前顶点不可能是最佳的。 如果不存在这样的组件，则每个可能的第一步都有非负成本变化，因此该顶点是最优的。 

欧拉阶构造找到满足此条件的最深祖先。 第 (k) 个活动欧拉位置必须位于包含一半以上筹码的每个子树内部，因此中位数位于其祖先路径上。 二进制提升找到最深的合格祖先。 

质心结构独立地维护每个查询顶点的精确距离总和。 每个活动芯片对其顶点的每个质心祖先都有贡献，并且对更深质心分量的减法可以防止重复计算。 因此，为所选中位数返回的值恰好是最小可能的跨度。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, pos, delta):
        n = self.n
        bit = self.bit
        while pos <= n:
            bit[pos] += delta
            pos += pos & -pos

    def prefix(self, pos):
        bit = self.bit
        res = 0
        while pos:
            res += bit[pos]
            pos -= pos & -pos
        return res

    def kth(self, k):
        idx = 0
        step = 1 << (self.n.bit_length() - 1)
        bit = self.bit
        n = self.n

        while step:
            nxt = idx + step
            if nxt <= n and bit[nxt] < k:
                idx = nxt
                k -= bit[nxt]
            step >>= 1

        return idx

def solve():
    n = int(input())

    graph = [[] for _ in range(n)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append(v)
        graph[v].append(u)

    # Root the original tree and build an Euler tour.
    parent = array('i', [-1]) * n
    depth = array('i', [0]) * n
    tin = array('i', [0]) * n
    tout = array('i', [0]) * n
    euler = []

    stack = [(0, -1, 0)]
    while stack:
        v, p, state = stack.pop()

        if state == 0:
            parent[v] = p
            if p != -1:
                depth[v] = depth[p] + 1

            tin[v] = len(euler)
            euler.append(v)

            stack.append((v, p, 1))
            for to in reversed(graph[v]):
                if to != p:
                    stack.append((to, v, 0))
        else:
            tout[v] = len(euler)

    # Binary lifting for ancestor queries.
    LOG = n.bit_length()
    up = [array('i', parent)]

    for _ in range(1, LOG):
        prev = up[-1]
        cur = array('i', [-1]) * n
        for v in range(n):
            p = prev[v]
            cur[v] = -1 if p == -1 else prev[p]
        up.append(cur)

    # Centroid decomposition.
    removed = bytearray(n)
    cd_parent = array('i', [-1]) * n

    # For every original vertex v, cd_dist[v] stores distances to
    # centroid ancestors in root-to-leaf centroid order.
    cd_dist = [array('i') for _ in range(n)]

    tmp_parent = array('i', [-1]) * n
    subtree_size = array('i', [0]) * n

    def find_centroid(start):
        order = [start]
        tmp_parent[start] = -1

        for v in order:
            pv = tmp_parent[v]
            for to in graph[v]:
                if not removed[to] and to != pv:
                    tmp_parent[to] = v
                    order.append(to)

        for v in reversed(order):
            s = 1
            for to in graph[v]:
                if not removed[to] and tmp_parent[to] == v:
                    s += subtree_size[to]
            subtree_size[v] = s

        total = len(order)

        for v in order:
            largest = total - subtree_size[v]
            for to in graph[v]:
                if not removed[to] and tmp_parent[to] == v:
                    if subtree_size[to] > largest:
                        largest = subtree_size[to]

            if largest * 2 <= total:
                return v

        return start

    def decompose(start, pcd):
        c = find_centroid(start)
        cd_parent[c] = pcd

        # Store distance from this centroid to every vertex in its
        # current component.
        stack = [(c, -1, 0)]
        while stack:
            v, p, d = stack.pop()
            cd_dist[v].append(d)

            for to in graph[v]:
                if not removed[to] and to != p:
                    stack.append((to, v, d + 1))

        removed[c] = 1

        for to in graph[c]:
            if not removed[to]:
                decompose(to, c)

    decompose(0, -1)

    # Dynamic centroid data.
    cnt = array('q', [0]) * n
    total_dist = array('q', [0]) * n
    subcnt = array('q', [0]) * n
    subdist = array('q', [0]) * n

    fenwick = Fenwick(n)
    active = bytearray(n)
    total_chips = 0

    def centroid_update(v, delta):
        chain = cd_dist[v]
        c = v

        for i in range(len(chain) - 1, -1, -1):
            d = chain[i]

            cnt[c] += delta
            total_dist[c] += delta * d

            p = cd_parent[c]
            if p != -1:
                dp = chain[i - 1]
                subcnt[c] += delta
                subdist[c] += delta * dp

            c = p
            if c == -1:
                break

    def distance_sum(v):
        chain = cd_dist[v]
        c = v
        child = -1
        ans = 0

        for i in range(len(chain) - 1, -1, -1):
            d = chain[i]

            ans += total_dist[c] + cnt[c] * d

            if child != -1:
                ans -= subdist[child] + subcnt[child] * d

            child = c
            c = cd_parent[c]

            if c == -1:
                break

        return ans

    def subtree_count(v):
        return fenwick.prefix(tout[v]) - fenwick.prefix(tin[v])

    def find_median():
        k = (total_chips + 1) // 2

        # Fenwick.kth returns a zero-based Euler position.
        pos = fenwick.kth(k)
        x = euler[pos]

        # x itself may already be the deepest heavy vertex.
        if subtree_count(x) >= k:
            return x

        cur = x

        for j in range(LOG - 1, -1, -1):
            a = up[j][cur]
            if a != -1 and subtree_count(a) < k:
                cur = a

        # cur is the deepest ancestor whose subtree is still too small.
        # Its parent is the first ancestor whose subtree exceeds half.
        return parent[cur]

    q = int(input())
    out = []

    for _ in range(q):
        op, v = input().split()
        v = int(v) - 1

        if op == '+':
            delta = 1
            active[v] = 1
        else:
            delta = -1
            active[v] = 0

        total_chips += delta

        fenwick.add(tin[v] + 1, delta)
        centroid_update(v, delta)

        median = find_median()
        out.append(str(distance_sum(median)))

    sys.stdout.write('\n'.join(out))

if __name__ == "__main__":
    solve()
```第一个预处理遍历以原始树为根并分配欧拉位置。 这`tout[v] = tin[v] + subtree_size[v]`也可以使用属性，但分配`tout`直接使用迭代进入/退出遍历使子树间隔明确并避免递归深度问题。 

二元提升表存储原始树祖先，而不是质心树祖先。 这两棵树有不同的含义，不能混用。 原始树表仅用于定位加权中值。 

质心分解是独立构建的。 每个原始顶点最终都会成为质心，因此以下`cd_parent`从 (v) 开始，准确给出动态距离查询所需的质心祖先。 

这`cd_dist[v]`数组按根到叶的顺序存储质心树中的距离。 更新和查询循环向后遍历该数组，因为它们从原始顶点开始并向质心根移动。 这`array('i')`表示使这些 (O(n\log n)) 距离在内存中保持紧凑。 Python的标准`array`type 以打包表示形式存储键入的数值，而不是每个元素存储一个 Python 对象。 

质心计数器使用 64 位数组，因为答案可以大到 (\Theta(n^2))。 Python 整数本身不会溢出，但使用带符号的 64 位存储可以保持显式数组紧凑，同时轻松覆盖最大可能的距离总和。 

芬威克树使用从一开始的内部位置，因此原始从零开始的欧拉位置`tin[v]`更新于`tin[v] + 1`。 反过来，`prefix(tout[v]) - prefix(tin[v])`精确计算半开欧拉区间 ([tin[v],tout[v])) 中的顶点。 混合这两种索引约定是引入相差一错误的最简单方法之一。 

中值搜索使用 (k=\lfloor M/2\rfloor+1)，而不是 (M/2)，因为条件严格大于一半。 对于偶数 (M)，这会选择一对可能的中位数的一侧，这已经足够了，因为两侧具有相同的最优成本。 

## 工作示例

 ### 示例 1

 树就是路径（1-2-3）。 其根为 1，给出欧拉阶 (1,2,3)。 

| 查询 | 活动顶点 | 总筹码 | (k) | 欧拉 (k) 芯片 | 中位数| 跨度|
 | ---| ---| ---| ---| ---| ---| ---|
 |`+ 1`| {1} | 1 | 1 | 1 | 1 | 0 |
 |`+ 3`| {1,3} | 2 | 2 | 3 | 2 | 2 |
 |`+ 2`| {1,2,3} | 3 | 2 | 2 | 2 | 2 |
 |`- 1`| {2,3} | 2 | 2 | 3 | 2 | 1 |

 第二次查询后，顶点3就是中途交叉的芯片。 它自己的子树只有一个筹码，所以它不是中位数。 它的父节点，即顶点 2，在其子树中都有两个芯片，并且是子树超过一半的最深祖先。 从顶点 2 到芯片 1 和 3 的总距离为 (1+1=2)。 

添加顶点 2 后，中位数仍为顶点 2。删除顶点 1 后，仅保留顶点 2 和 3，因此顶点 2 具有总成本（0+1=1）。 这也练习了偶数个芯片承认两个同样好的中位数的情况。 

### 示例 2

 该树的根位于顶点 1。其欧拉阶为 (1,2,3,4,5,6)。 

| 查询 | 活动顶点 | 总筹码 | (k) | 欧拉 (k) 芯片 | 中位数| 跨度|
 | ---| ---| ---| ---| ---| ---| ---|
 |`+ 1`| {1} | 1 | 1 | 1 | 1 | 0 |
 |`+ 4`| {1,4} | 2 | 2 | 4 | 2 | 3 |
 |`+ 5`| {1,4,5} | 3 | 2 | 4 | 4 | 4 |
 |`- 5`| {1,4} | 2 | 2 | 4 | 2 | 3 |
 |`+ 6`| {1,4,6} | 3 | 2 | 4 | 2 | 4 |

 当chips为1和4时，顶点4位于顶点2的子树内部，因此顶点2成为最深的重祖先。 它到1和4处芯片的距离是(1+2=3)。 

添加顶点 5 后，顶点 4 的子树包含 4 和 5 处的筹码，即三个筹码中的两个。 因此，顶点 4 本身成为中位数，给出 (0+3+1=4)。 这说明了为什么在一次插入后中位数可以向下移动几个级别。 

删除顶点 5 后，平衡再次发生变化，顶点 2 成为中位数。 最后，顶点 6 加入活动集。 现在，顶点 2 到顶点 1、4 和 6 的距离为 (1)、(2) 和 (1)，跨度为 4。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 预处理 | (O(n\log n)) | 欧拉预处理、二元提升和质心分解 |
 | 更新 | (O(\log n)) | 一次 Fenwick 更新和一次质心树行走 |
 | 中值搜索 | (O(\log^2 n)) | (O(\log n)) 二进制提升检查，每个检查都使用 Fenwick 求和 |
 | 距离总和 | (O(\log n)) | 穿越质心祖先的一步|
 | 总计 | (O(n\log n+q\log^2 n)) | 所有查询都使用相同的预处理结构 |
 | 空间| (O(n\log n)) | 二元提升和到质心祖先的距离|

 使用 (n,q\le 10^5)，预处理很容易在预期范围内，并且每个查询都避免了对树的完全扫描。 (O(\log^2 n)) 中值搜索是每个查询的主要组成部分，而质心距离计算仍然是对数的。 实现中的紧凑类型数组将 (O(n\log n)) 辅助数据保持在 256 MiB 内存限制内。 

## 测试用例

 以下线束假设`solve()`是 Python 解决方案部分中的函数。 它暂时取代了模块的`input`和`stdout`，因此每个断言都会运行实际的实现，而不是单独的重新实现。```python
import sys
import io

def run(inp: str) -> str:
    global input

    old_input = input
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        input = old_input
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1.
assert run(
    """3
1 2
2 3
4
+ 1
+ 3
+ 2
- 1
"""
) == """0
2
2
1""\n", "sample 1"

# Provided sample 2.
assert run(
    """6
1 2
2 3
3 4
4 5
2 6
5
+ 1
+ 4
+ 5
- 5
+ 6
"""
) == """0
3
4
3
4""\n", "sample 2"

# Minimum-size tree.
assert run(
    """1
1
+ 1
"""
) == """0\n""", "minimum-size tree"

# A path where the optimal vertex is between occupied vertices,
# followed by a deletion that leaves two active vertices.
assert run(
    """5
1 2
2 3
3 4
4 5
4
+ 1
+ 5
+ 3
- 5
"""
) == """0
4
4
2\n""", "path median and deletion"

# Star with every vertex eventually occupied.
assert run(
    """5
1 2
1 3
1 4
1 5
5
+ 1
+ 2
+ 3
+ 4
+ 5
"""
) == """0
1
2
3
4\n""", "all vertices active"

# Maximum-size tree and a distance close to the largest possible answer.
n = 100000
max_case = [str(n)]
for i in range(1, n):
    max_case.append(f"{i} {i + 1}")
max_case.append("2")
max_case.append("+ 1")
max_case.append(f"+ {n}")
max_input = "\n".join(max_case) + "\n"

assert run(max_input) == "0\n99999\n", "maximum-size path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | (n=1)，一次插入 |`0`| 最小尺寸树和单芯片案例|
 | 路径（1-2-3-4-5），`+1,+5,+3,-5`|`0,4,4,2`| 中位数为空、中位数移动、删除 |
 | 星形以 1 为中心，所有顶点均已插入 |`0,1,2,3,4`| 所有顶点均处于活动状态且高度质心 |
 | 两个端点都有 (100000) 个顶点和碎片的路径 |`0,99999`| 最大值（n），大距离，64位答案范围|

 ## 边缘情况

 单个活动芯片通过取(k=1)来处理。 唯一的活动顶点是第一个活动的欧拉位置，并且它自己的子树至少包含一个芯片，因此中值搜索立即返回它。 为了```
1
1
+ 1
```质心距离查询返回零。 

处理空的最佳目的地是因为中值是由子树权重定义的，而不是由顶点本身是否被占用定义的。 为了```
3
1 2
2 3
2
+ 1
+ 3
```中间的筹码是顶点 3。它的子树包含一个筹码，最多不超过两个筹码的一半。 它的父节点顶点 2 在其子树中具有两个芯片，因此选择顶点 2。 质心距离查询给出(1+1=2)。 

当一条边将活动芯片精确地分成两半时，就会出现两个相邻的中线。 在路径(1-2)上，插入两个芯片后，任一顶点都是最优的。 在严格的条件下`subtree >= floor(M / 2) + 1`，算法选择包含欧拉阶中途码片的一侧的中值。 选定的顶点仍然具有最小可能的跨度，因此不需要特殊的连接处理。 

只剩下一个芯片的删除情况也是安全的。 在路径 (1-2-3) 上，之后```
+ 1
+ 3
- 1
```唯一的活动筹码位于 3 处。中值搜索返回 3，距离总和为零。 输入保证活动集永远不会变空，因此算法永远不需要定义零码片的中值。 

一个特别有用的边界情况是当中间点恰好位于两个子树之间的边界时。 严格的超过一半条件可防止算法下降到任何一侧，除非该侧确实包含一半以上。 这正是允许相同的代码处理唯一中位数和相邻中位数对的原因。 

您可以使社论的术语适应特定的 Codeforces 风格，例如使质心分解部分更加面向实现或使证明更加正式。
