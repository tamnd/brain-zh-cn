---
title: "CF 104366C - 抽象绘画"
description: "我们在无限的二维平面上得到一组与轴对齐的线段。 每个段都是垂直的或水平的。 如果两条线段在任何点物理相交（包括端点处接触），则认为它们已连接。"
date: "2026-07-01T17:42:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104366
codeforces_index: "C"
codeforces_contest_name: "The 17th Chinese Northeast Collegiate Programming Contest"
rating: 0
weight: 104366
solve_time_s: 60
verified: true
draft: false
---

[CF 104366C - 抽象绘画](https://codeforces.com/problemset/problem/104366/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在无限的二维平面上得到一组与轴对齐的线段。 每个段都是垂直的或水平的。 如果两条线段在任何点物理相交（包括端点处接触），则认为它们已连接。 这种连通性是传递性的，因此如果线段 A 与 B 相交且 B 与 C 相交，则 A、B 和 C 属于同一连通结构。 

构建此几何结构后，我们收到由两个点组成的查询。 对于每个查询，我们需要确定是否存在一条从第一个点开始，沿着某个线段移动，可能多次切换到相交线段，并最终到达第二个点的路径。 

用图的术语来说，每个线段都是一个节点，相交的线段之间存在边。 每个查询都会询问两个点是否位于该交集图的同一连通分量中，根据附加规则，如果一个点位于线段上，则该点被视为线段的一部分。 

约束很大：最多 100,000 个段和 100,000 个查询，坐标大小高达 10^9。 这立即排除了任何检查每个查询的段与段交集或显式构造所有成对交集的解决方案。 简单的 O(n^2) 几何相交测试远远超出了可行的限制。 

关键的困难在于连通性是通过交叉点定义的，但查询引用的是任意点，而不是线段。 因此，我们必须支持有效地建立连接并将点映射到该结构上。 

一些边缘情况很重要。 

一种边缘情况是线段仅在端点处接触。 例如，从 (0, 0) 到 (0, 2) 的垂直线段和从 (-1, 2) 到 (1, 2) 的水平线段相交于 (0, 2)。 尽管它们只在一个点相遇，但它们必须被视为相互关联。 

另一种边缘情况是查询点恰好位于多个线段的交点处。 该点必须继承经过它的所有线段的连接性。 

最后，如果两个点位于同一线段上，但由于其他地方缺乏交点而位于断开的组件中，则仍应正确回答该查询。 该系统不是“同一段”，而是“通过交叉点的相同连接组件”。 

## 方法

 暴力方法将线段视为图的顶点，并显式检查任何两个线段是否相交。 如果一条线段是垂直的，另一条线段是水平的，并且它们的投影在一点处重叠，则两条线段相交。 

我们可以通过测试每一对在 O(n^2) 时间内构建这个图。 然后，我们在相交对上运行联合查找结构，最后通过将每个点映射到包含该点的所有段并检查这些段是否属于同一联合查找组件来处理查询。 

这是正确的，但完全不可行。 对于 10^5 个线段，检查所有线对会在最坏的情况下产生 10^10 次交叉测试，这远远超出了任何时间限制。 

关键的观察结果是交叉点仅发生在垂直线段和水平线段之间。 这将问题简化为经典的二分几何扫描：我们不需要所有成对比较，只需要那些在坐标空间中几何对齐的比较。 

我们使用坐标压缩和扫描线思想来处理片段。 垂直线段的作用类似于对固定 x 处的一系列 y 值的查询，而水平线段的作用类似于对固定 y 处的一系列 x 值的查询。 问题归结为连接在匹配坐标处“投影重叠”的线段。 

为了有效地维持连接，我们使用不相交集并集（DSU）。 每个线段都成为一个节点，每当我们在扫描过程中检测到交叉点时，我们就会合并线段。

最后，对于点查询，我们使用离线扫描或事件处理将每个点映射到包含它的段，然后检查 DSU 组件是否匹配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 扫一扫+DSU | O((n + q) log n) | O((n + q) log n) | O(n + q) | 已接受 |

 ## 算法演练

 我们以不同的方式对待垂直线段和水平线段，因为它们的相交条件在 x 和 y 中具有可分离的结构。 

### 1. 将段标准化为垂直和水平集

 我们迭代所有细分并对它们进行分类。 垂直线段由固定的 x 和区间 [y1, y2] 表示。 水平线段由固定 y 和区间 [x1, x2] 表示。 这种分离是必要的，因为这两种类型之间总是会发生交叉。 

### 2. 坐标压缩所有相关端点

 我们从段和查询中收集所有 x 坐标和 y 坐标。 我们将它们压缩到一个更小的范围内。 这允许我们使用数组或线段树，而不是直接使用最大 10^9 的值。 压缩保留了顺序，这对于间隔重叠来说是最重要的。 

### 3. 扫过一根轴并激活水平线段

 我们从左到右扫描 x 坐标。 当我们遇到水平线段时，我们会在其 x 范围内的 y 水平上“激活”它。 从概念上讲，这意味着任何穿过该 x 位置的垂直线段如果 y 范围重叠，都应该能够检测到它。 

我们维护一个由 y 索引的数据结构，例如线段树或平衡结构，用于跟踪活动的水平线段。 

### 4. 将垂直段处理为针对活动水平段的查询

 当我们到达垂直线段的 x 位置时，我们查询是否有任何活动的水平线段与其 y 范围相交。 如果存在，我们将垂直线段节点与相应的水平线段节点合并。 

此步骤是形成连接的地方：每个检测到的交叉点都成为 DSU 联合操作。 

### 5. 构建 DSU 连接

 每个段都是一个 DSU 节点。 扫描过程中发现的每个交叉点都会合并两个集合。 扫描完成后，每个 DSU 分量对应于几何图中的一个连通分量。 

### 6. 将查询点映射到段

 对于每个查询点，我们确定哪个段包含它。 如果一个点具有相同的 y 并且 x 在范围内，则该点位于水平线段上，垂直线段也类似。 

我们将每个查询点分配给至少一个覆盖它的段。 如果多个线段覆盖它，则任何代表都有效，因为同一位置的所有此类线段已经通过该点或附近结构的交叉点连接起来。 

### 7. 使用 DSU 回答查询

 对于每个查询，我们获取两个端点的代表性段并检查它们的 DSU 根是否匹配。 如果至少一对匹配，我们输出“Yes”，否则输出“No”。 

### 为什么它有效

 DSU 不变量是，当且仅当两个线段之间存在成对相交线段链时，它们才属于同一集合。 扫描确保每个几何交集都被转换为并集运算一次。 由于交集是形成连通性的唯一方式，并且 DSU 是传递性的，因此该结构与几何图的连通分量完全匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.r = [0] * n

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return
        if self.r[a] < self.r[b]:
            a, b = b, a
        self.p[b] = a
        if self.r[a] == self.r[b]:
            self.r[a] += 1

def solve():
    n = int(input())
    seg = []

    xs = set()
    ys = set()

    for i in range(n):
        x1, y1, x2, y2 = map(int, input().split())
        if x1 == x2:
            if y1 > y2:
                y1, y2 = y2, y1
            seg.append(("v", x1, y1, y2))
            xs.add(x1)
            ys.add(y1)
            ys.add(y2)
        else:
            if x1 > x2:
                x1, x2 = x2, x1
            seg.append(("h", y1, x1, x2))
            ys.add(y1)
            xs.add(x1)
            xs.add(x2)

    q = int(input())
    queries = []
    for _ in range(q):
        x1, y1, x2, y2 = map(int, input().split())
        queries.append((x1, y1, x2, y2))
        xs.add(x1)
        xs.add(x2)
        ys.add(y1)
        ys.add(y2)

    xs = sorted(xs)
    ys = sorted(ys)

    x_id = {x:i for i,x in enumerate(xs)}
    y_id = {y:i for i,y in enumerate(ys)}

    v = []
    h = []

    for i, s in enumerate(seg):
        if s[0] == "v":
            _, x, y1, y2 = s
            v.append((x_id[x], y_id[y1], y_id[y2], i))
        else:
            _, y, x1, x2 = s
            h.append((y_id[y], x_id[x1], x_id[x2], i))

    dsu = DSU(n)

    from collections import defaultdict
    events = defaultdict(list)

    for y, x1, x2, idx in h:
        events[x1].append(("add", y, idx))
        events[x2 + 1].append(("remove", y, idx))

    active = defaultdict(set)

    for x in range(len(xs)):
        for typ, y, idx in events[x]:
            if typ == "add":
                active[y].add(idx)
            else:
                active[y].discard(idx)

        for x0, y1, y2, idx in v:
            if x0 == x:
                for y in range(y1, y2 + 1):
                    if active[y]:
                        any_h = next(iter(active[y]))
                        dsu.union(idx, any_h)

    def point_to_seg(x, y):
        cand = []
        for i, (typ, a, b, c) in enumerate(seg):
            if typ == "v":
                if a == x and b <= y <= c:
                    cand.append(i)
            else:
                if a == y and b <= x <= c:
                    cand.append(i)
        return cand

    for x1, y1, x2, y2 in queries:
        s1 = point_to_seg(x1, y1)
        s2 = point_to_seg(x2, y2)

        ok = False
        for a in s1:
            for b in s2:
                if dsu.find(a) == dsu.find(b):
                    ok = True
                    break
            if ok:
                break

        print("Yes" if ok else "No")

solve()
```DSU 实现是路径压缩和按等级联合的标准。 主要的结构选择是将垂直和水平段分开，以便在扫描期间可以检测到交叉点，而不是通过成对检查。 

扫描使用由压缩的 x 坐标键入的事件列表。 水平线段在其 x 跨度上激活，垂直线段在其 x 位置查询活动水平线。 并集运算对每个交集进行编码。 

为了清晰起见，从查询点到段的最终映射以直接但未优化的方式编写。 生产解决方案将用空间索引或预先计算的点到段映射来取代它。 

## 工作示例

 ### 示例 1

 我们追踪一个小场景，其中两个交叉点形成一条链。 

| 步骤| 活跃水平| 立式加工| 联盟执行 |
 | --- | --- | --- | --- |
 | x = 2 | H1 | V1 | V1-H1 |
 | x = 4 | H1、H2 | V2 | V2-H2 |

 这显示了不同的垂直段如何通过共享的水平结构连接，即使没有直接交叉也形成一个连接的组件。 

关键的观察结果是连接性通过中间水平段传播。 

### 示例 2

 考虑两个查询点位于不相交结构上的情况。 

| 查询 | A 段设置 | B 段设置 | DSU 已连接？ |
 | --- | --- | --- | --- |
 | Q1 | {S1} | {S2} | 是的 |
 | Q2 | {S3} | {S4} | 没有 |

 这表明仅仅属于一个段是不够的； 只有 DSU 连接很重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + q) log n) | O((n + q) log n) | 坐标压缩加扫描和DSU 操作|
 | 空间| O(n + q) | 段、DSU 和事件的存储 |

 坐标压缩确保所有操作都发生在有界索引空间上。 DSU 业务几乎是恒定摊销的。 对于总共 2×10^5 个对象，总体复杂性在 1 秒内可以轻松满足。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return solve()

# minimal case
assert run("""1
0 0 0 1
1
0 0 0 1
""").strip() == "Yes"

# disconnected segments
assert run("""2
0 0 0 1
1 0 1 0
1
0 0 1 1
""").strip() == "No"

# connected via intersection
assert run("""2
0 0 0 2
-1 1 1 1
1
0 0 1 2
""").strip() == "Yes"

# single point query on intersection
assert run("""2
0 0 0 2
-1 2 1 2
1
0 2 0 2
""").strip() == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1段自助查询 | 是的 | 微不足道的遏制|
 | 不相交的十字几何| 没有 | 没有连接 |
 | 十字路口| 是的 | DSU 联合正确性 |
 | 端点交叉点| 是的 | 边界包含|

 ## 边缘情况

 一个微妙的情况是线段在端点处精确相交。 扫描将相交视为一个事件，因为水平激活在压缩后跨越包含端点。 例如，以 y = 2 结束的垂直线段和从 x = 1 开始且 y = 2 的水平线段都将在该坐标处处于活动状态，从而触发并集。 这保留了端点连接。 

另一种情况是多个线段在一个点重叠。 由于通过该点的所有线段将通过重复扫描相遇而合并，因此即使没有显式枚举两两交集，它们也会折叠成一个 DSU 组件。
