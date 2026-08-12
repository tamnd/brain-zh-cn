---
title: "CF 102367D - 交付"
description: "仓库和道路形成一棵树，因此任意两个仓库之间只有一条路线。 一辆卡车的电池容量为 T，每当 Sam 停下来时它就可以充电。"
date: "2026-08-12T23:36:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102367
codeforces_index: "D"
codeforces_contest_name: "Fall 2019 ICPC-style Waterloo Local Contest"
rating: 0
weight: 102367
solve_time_s: 546
verified: true
draft: false
---

[CF 102367D - 交付](https://codeforces.com/problemset/problem/102367/D)

 **评级：** -
 **标签：** -
 **求解时间：** 9m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 仓库和道路形成一棵树，因此任意两个仓库之间只有一条路线。 卡车有电池容量`T`，只要 Sam 停止，它就可以充电。 路线上的每个仓库都是强制停车点，而路中间的停车点是可选充电站。 

考虑一条路的长度`D`。 电池充满电时，卡车最多可以行驶`T`距离需要再次充电的公里数。 因此，穿越这条路需要`ceil(D / T)`旅行环节。 第一段从前一个仓库开始，每增加一段就需要一个中间站。 由于每个仓库都已经算作一站，所以这条路的贡献可以整齐地折入公式中`1 + ceil(D / T)`对于整个路径，额外的`1`占路线的第一个仓库。 

对于包含具有长度的边的路径`D1, D2, ..., Dk`，因此答案是`1 + sum(ceil(Di / T))`。 

树本身有高达`100000`顶点和查询的数量级相同。 边长和电池容量都最多`20000`。 查询无法遍历其整个树路径，因为单个路径可以包含`99999`边缘并这样做`100000`查询给出了几乎`10^10`边缘访问。 即使是普通的`O(log N)`树查询本身是不够的，因为边缘成本取决于查询的`T`。 

的小界限为`20000`边长是结构的后半部分。 功能`ceil(D / T)`仅取决于边长`D`，所以对于一个固定的`T`它变成静态边权重。 该解决方案将这种观察与边长度上的持久线段树结合起来。 

有几种边界情况很容易处理不当。 如果边长可以被整除`T`，它正好需要`D/T`旅行段，不`D/T + 1`。 例如，```
2 1
1 2 10
1 2 5
```有答案`3`，因为需要两个仓库站点加一个充电站。 一个公式使用`floor(D/T)`因为充电间隔的数量将减少 1。 

如果一条边的长度最多`T`，不需要中间充电停止。 例如，```
2 1
1 2 5
1 2 10
```有答案`2`。 卡车到达仓库 2 时并未中途停车，因此仅仅因为存在边缘而计算一个充电站是不正确的。 

即使电池不需要充电，一条路线也可以包含许多强制仓库停靠点。 例如，```
3 1
1 2 1
2 3 1
1 3 10
```有答案`3`，因为 Sam 必须在仓库 1、2 和 3 停下来。仅计算充电站将错误地产生零或一。 

最后，一条很长的路也不是不可能的。 山姆可以在道路上的任意地点停车、充电并继续前进。 例如，```
2 1
1 2 20
1 2 5
```有答案`5`：四个行程段需要三个中间充电站，再加上两个仓库站。 拒绝长于的边的实现`T`会解决一个不同的问题。 

## 方法

 直接的解决方案是找到之间的唯一路径`S`和`F`，检查该路径上的每条边，然后添加`ceil(D/T)`，最后为第一个仓库添加一个。 这是正确的，因为每条边都可以独立考虑。 卡车可以在进入下一个边缘之前在一个边缘的末端充电，因此一个边缘上的最佳充电站数量不会与其他边缘相互作用。 

问题是路径长度。 一棵树可以是一串链`100000`顶点，因此一个查询可以检查`99999`边缘。 和`100000`这样的查询，最坏的情况大致是`10^10`边缘操作，远远超出了时间限制。 

第一个有用的观察是对于固定的电池容量`T`，每条边都接收静态权重`ceil(D/T)`。 一旦这些权重被固定，正常的根前缀和加上 LCA 在找到 LCA 后会在恒定时间内回答路径和。 

困难在于`T`查询之间的变化。 只有`20000`的可能值`T`，但是为每个可能的情况构建一个完整的根前缀数组`T`需要大约`2 * 10^9`存储的值太多了。 

第二个观察结果是边长本身也受`20000`。 对于大型`T`，函数`ceil(D/T)`只改变很少的次数`D`范围从`1`到`20000`。 例如，如果`T = 200`，可能的值只有`1, 2, ..., 100`。 我们可以将路径的边长表示为频率分布，并对这些恒定范围求和，而不是检查每条边。 

持久线段树准确地给出了所需的路径频率分布。 原始树以顶点 1 为根，并将每个非根顶点与将其连接到其父节点的边的长度相关联。 对于每个顶点`v`，构建一个持久的线段树版本，其中包含从根到`v`。 路径上的多组边长`u`到`v`然后从版本中获得`u`,`v`，以及他们的 LCA：`root[u] + root[v] - 2 * root[lca(u,v)]`。 

在持久化线段树中，无论何时，都可以立即处理整个值区间`ceil(D/T)`在整个时间间隔内是恒定的。 对于大型`T`，仅存在少量这样的区间。 

对于小`T`，相反的策略更好。 我们预先计算每个小数的根前缀和`T`出现在查询中。 阈值为`200`最多给出`200 * 100000 = 20 million`前缀值，当存储为 32 位整数时很适合。 小查询`T`那么只需要一个 LCA 和三个数组访问。 

这是标准的平方根式权衡。 小容量的预计算成本较低，而大容量的不同商范围很少，并且从持久结构评估成本较低。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(NQ)`|`O(N)`| 太慢了|
 | 最佳 |`O(NB + Q(D/B)log D + Nlog N)`|`O(NB + Nlog D + Nlog N)`| 已接受 |

 这里`D <= 20000`是最大边长，`B`是实现所使用的小容量阈值，`200`在代码中。 

## 算法演练

 1.以顶点为仓库树的根`1`。 对于每个顶点，存储其父顶点、深度及其父边的长度。 父边与子边相关联，因此根到顶点路径只包含每条边一次。 
2. 为父母搭建二元升降台。 这让我们发现`lca(S,F)`在`O(log N)`，它标识两个根路径的公共部分。 
3. 在进行与容量相关的预处理之前读取所有查询。 计算哪些小值`T`实际发生。 没有理由为没有查询使用的容量构建前缀数组。 
4. 对于每一个使用过的`T <= B`，构造一个根前缀数组。 对于一个顶点`v`与父母`p`， 放`pref[v] = pref[p] + ceil(edge[v] / T)`。 

然后，具有此容量的查询将由以下方式回答`pref[S] + pref[F] - 2 * pref[LCA] + 1`。 
5. 为每个顶点构建持久线段树版本。 版本`v`是从版本中获取的`parent[v]`通过插入一个值，边缘的长度`parent[v]`到`v`。 持久性意味着旧版本保持不变。 
6. 对于一个查询，其`T`大于`B`，首先求其LCA及其路径边数。 如果`T`至少是整棵树的最大边长，每条边都有贡献`1`，所以答案就是路径边数加上`1`。 
7. 否则，计算总和`ceil(D/T)`使用三个持久版本的路径。 在表示线段树节点`[lo, hi]`，计算值`ceil(D/T)`在两个端点。 如果它们相等，则整个段中的每条边长度都具有相同的贡献，因此将该贡献乘以节点表示的路径边的数量并停止下降。 
8. 如果段内的贡献不同，则下降到其两个子段。 将两个端点版本的计数相加，并减去 LCA 版本两次，从而准确给出所请求路径上该子段的边长度频率。 
9. 添加`1`计算出路径边缘贡献后。 这是最初的仓库停靠点。 每个其他仓库停靠点都已隐式表示为`ceil(D/T)`前边的贡献。 

### 为什么它有效

 对于每条路的长度`D`， 确切地`ceil(D/T)`电池大小的旅行段是必要的。 连续路段之间必须有充电站，而路线末端和道路之间的仓库是强制停车点。 穿过一条小路与`k`边，总数正好是`1 + sum ceil(D/T)`。 

对于小`T`，根前缀数组精确地存储每个根路径上的边贡献，因此标准树路径减法给出了精确的总和。 

对于大型`T`，持久线段树版本准确地表示每个根路径上的边长度的多重集。 将两个端点的版本相加并两次减去 LCA 版本即可准确给出所请求路径上的边的多重集。 其上的每个段`ceil(D/T)`是常数可以用其频率乘以该常数来代替。 因此，仅在值发生变化的地方进行降序计算相同的总和，而无需检查各个路径边缘。 

在这两种情况下，不变的是所请求的树路径上的每条边都准确地贡献`ceil(D/T)`一次，并且该路径之外的任何边缘都不会做出任何贡献。 决赛`+1`记入第一个仓库，完成所需的止损计数。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MAX_D = 20000
B = 200

def solve():
    n, q = map(int, input().split())

    head = array('i', [-1]) * n
    to = array('i')
    nxt = array('i')
    ew = array('i')

    def add_edge(u, v, w):
        idx = len(to)
        to.append(v)
        ew.append(w)
        nxt.append(head[u])
        head[u] = idx

    max_edge = 0

    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        u -= 1
        v -= 1
        add_edge(u, v, w)
        add_edge(v, u, w)
        if w > max_edge:
            max_edge = w

    queries = []
    used_small = set()

    for _ in range(q):
        s, f, t = map(int, input().split())
        s -= 1
        f -= 1
        queries.append((s, f, t))
        if t <= B and t < max_edge:
            used_small.add(t)

    parent = array('i', [-1]) * n
    depth = array('i', [0]) * n
    parent_edge = array('i', [0]) * n
    order = array('i')
    order.append(0)
    parent[0] = 0

    idx = 0
    while idx < len(order):
        u = order[idx]
        idx += 1

        e = head[u]
        while e != -1:
            v = to[e]
            if v != parent[u]:
                parent[v] = u
                depth[v] = depth[u] + 1
                parent_edge[v] = ew[e]
                order.append(v)
            e = nxt[e]

    LOG = max(1, n.bit_length())
    up = [parent]

    for _ in range(1, LOG):
        prev = up[-1]
        cur = array('i', [0]) * n
        for v in range(n):
            cur[v] = prev[prev[v]]
        up.append(cur)

    def lca(a, b):
        if depth[a] < depth[b]:
            a, b = b, a

        diff = depth[a] - depth[b]
        bit = 0
        while diff:
            if diff & 1:
                a = up[bit][a]
            diff >>= 1
            bit += 1

        if a == b:
            return a

        for k in range(LOG - 1, -1, -1):
            ua = up[k][a]
            ub = up[k][b]
            if ua != ub:
                a = ua
                b = ub

        return parent[a]

    prefixes = {}

    for t in used_small:
        pref = array('i', [0]) * n
        for pos in range(1, n):
            v = order[pos]
            p = parent[v]
            pref[v] = pref[p] + (parent_edge[v] + t - 1) // t
        prefixes[t] = pref

    left = array('i', [0])
    right = array('i', [0])
    cnt = array('i', [0])
    roots = array('i', [0]) * n

    if max_edge > 0:
        for pos in range(1, n):
            v = order[pos]
            old_root = roots[parent[v]]
            value = parent_edge[v]

            new_root = len(cnt)
            left.append(left[old_root])
            right.append(right[old_root])
            cnt.append(cnt[old_root] + 1)

            cur_new = new_root
            cur_old = old_root
            lo = 1
            hi = max_edge

            while lo < hi:
                mid = (lo + hi) >> 1

                if value <= mid:
                    old_child = left[cur_old]
                    new_child = len(cnt)

                    left.append(left[old_child])
                    right.append(right[old_child])
                    cnt.append(cnt[old_child] + 1)

                    left[cur_new] = new_child
                    cur_new = new_child
                    cur_old = old_child
                    hi = mid
                else:
                    old_child = right[cur_old]
                    new_child = len(cnt)

                    left.append(left[old_child])
                    right.append(right[old_child])
                    cnt.append(cnt[old_child] + 1)

                    right[cur_new] = new_child
                    cur_new = new_child
                    cur_old = old_child
                    lo = mid + 1

            roots[v] = new_root

    sys.setrecursionlimit(1_000_000)

    def persistent_sum(ra, rb, rc, t):
        def dfs(a, b, c, lo, hi):
            total = cnt[a] + cnt[b] - 2 * cnt[c]
            if total == 0:
                return 0

            qlo = (lo + t - 1) // t
            qhi = (hi + t - 1) // t

            if qlo == qhi:
                return total * qlo

            mid = (lo + hi) >> 1
            ans = dfs(left[a], left[b], left[c], lo, mid)
            ans += dfs(right[a], right[b], right[c], mid + 1, hi)
            return ans

        return dfs(ra, rb, rc, 1, max_edge)

    out = []

    for s, f, t in queries:
        w = lca(s, f)
        edge_count = depth[s] + depth[f] - 2 * depth[w]

        if t >= max_edge:
            out.append(str(edge_count + 1))
            continue

        pref = prefixes.get(t)
        if pref is not None:
            value = pref[s] + pref[f] - 2 * pref[w] + 1
            out.append(str(value))
            continue

        value = persistent_sum(roots[s], roots[f], roots[w], t)
        out.append(str(value + 1))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```邻接结构使用紧凑的整数数组而不是 Python 元组列表。 这很重要，因为持久段树和小容量前缀数组是主要的内存消耗者，而内存限制仅为 256 MB。 

初始树遍历产生`parent`,`depth`,`parent_edge`，以及每个父项出现在其子项之前的顺序。 该顺序使得持久版本和容量特定的前缀和都可以轻松构建，而无需通过原始树进行递归。 

二进制提升表仅用于 LCA 查询。 LCA 是正确的减法点，因为根到`S`和根到-`F`路径包含公共根到 LCA 部分两次。 

对于小容量，`ceil(D/T)`计算为`(D + T - 1) // T`。 前缀值适合有符号 32 位整数，因为最大可能路径包含的数量小于`100000`边，每个贡献最多`20000`。 

持久线段树存储计数而不是边长度之和。 计数就足够了，因为查询需要频率加权和`ceil(D/T)`。 在商恒定的段中，只有边的数量很重要。 

持久更新是迭代写入的，因为它创建了大约`O(N log 20000)`节点。 避免每个级别都调用 Python 函数使得预处理成本大大降低。 

查询例程使用关系`count_path = count_S + count_F - 2 * count_LCA`。 路径计数为零的节点将被立即丢弃。 如果商在其值范围的两端相等，则整个范围都有一个贡献，递归可以在此停止。 

条件`t >= max_edge`在任一预处理方法之前处理。 然后可以穿越每条道路，无需中间充电站，因此答案很简单，就是边的数量加上一个仓库站。 

## 工作示例

 ### 示例 1

 考虑来自仓库的第一个查询`3`到仓库`7`, 有容量`T = 2`。 它的路径是`3 -> 2 -> 4 -> 7`有边长`2, 3, 6`。 

| 边缘 | 长度|`ceil(D/T)`| 运行边和 |
 | ---| ---| ---| ---|
 |`3 -> 2`| 2 | 1 | 1 |
 |`2 -> 4`| 3 | 2 | 3 |
 |`4 -> 7`| 6 | 3 | 6 |
 | 初始仓库 | | |`6 + 1 = 7`|

 输出是`7`。 

对于第二个查询，来自`2`到`6`和`T = 1`，路径由长度的边组成`3`和`5`。 

| 边缘 | 长度|`ceil(D/T)`| 运行边和 |
 | ---| ---| ---| ---|
 |`2 -> 4`| 3 | 3 | 3 |
 |`4 -> 6`| 5 | 5 | 8 |
 | 初始仓库 | | |`8 + 1 = 9`|

 输出是`9`。 

其余查询产生相同的计算。 

| 查询 | 路径边长 |`T`| 总和`ceil(D/T)`| 回答 |
 | ---| ---| ---| ---| ---|
 |`3 -> 7`|`2, 3, 6`| 2 | 6 | 7 |
 |`2 -> 6`|`3, 5`| 1 | 8 | 9 |
 |`5 -> 7`|`4, 6`| 3 | 4 | 5 |
 |`1 -> 4`|`1, 3`| 1 | 4 | 5 |
 |`3 -> 7`|`2, 3, 6`| 1 | 11 | 11 12 | 12

 该示例既练习了精确的可分性，也练习了需要多个充电站的道路。 

### 示例 2

 路径是一条具有边长的链`5, 10, 20`。 

为了`T = 20`，每条边都需要一个行程段。 

| 边缘 | 长度|`ceil(D/T)`| 运行边和 |
 | ---| ---| ---| ---|
 |`1 -> 2`| 5 | 1 | 1 |
 |`2 -> 3`| 10 | 10 1 | 2 |
 |`3 -> 4`| 20 | 1 | 3 |
 | 初始仓库 | | |`3 + 1 = 4`|

 为了`T = 10`，最后一条边需要两段。 

| 边缘 | 长度|`ceil(D/T)`| 运行边和 |
 | ---| ---| ---| ---|
 |`1 -> 2`| 5 | 1 | 1 |
 |`2 -> 3`| 10 | 10 1 | 2 |
 |`3 -> 4`| 20 | 2 | 4 |
 | 初始仓库 | | |`4 + 1 = 5`|

 为了`T = 5`，这三个贡献是`1, 2, 4`, 给予`8`。 

|`T`| 边缘贡献总和| 最终答案|
 | ---| ---| ---|
 | 20 | 3 | 4 |
 | 10 | 10 4 | 5 |
 | 5 | 7 | 8 |

 该示例演示了精确的边界`D = T`和`D = 2T`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(NB + NlogD + NlogN + Q(D/B)logD)`| 小容量使用`O(N)`预处理每个，而大容量仅访问商变化范围 |
 | 空间|`O(NB + NlogD + NlogN)`| 小容量前缀、持久段树版本和二进制提升表主宰内存 |

 和`B = 200`和`D <= 20000`，小容量预处理最多存储约2000万个32位整数。 持久化线段树大致需要`N log D`节点，并且LCA表需要`N log N`整数。 所有这些结构都使用紧凑整数数组而不是 Python 对象来存储。 

大容量的关键界限是`ceil(D/T)`只能拿`O(D/T)`独特的价值观。 自从`T > B`，这最多是关于`D/B`，这最多是`100`对于所选的阈值。 持久树处理这些范围而不扫描原始路径。 

## 测试用例

 以下测试假设`solve()`上述解决方案中的功能可用。```python
import sys
import io

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input
    try:
        sys.stdin = io.StringIO(inp)
        input = sys.stdin.readline
        from contextlib import redirect_stdout
        out = io.StringIO()
        with redirect_stdout(out):
            solve()
        return out.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        input = old_input

sample1 = """\
7 5
1 2 1
2 3 2
2 4 3
4 5 4
4 6 5
4 7 6
3 7 2
2 6 1
5 7 3
1 4 1
3 7 1
"""

sample2 = """\
4 3
1 2 5
2 3 10
3 4 20
1 4 20
1 4 10
1 4 5
"""

assert run(sample1) == "7\n9\n5\n5\n12", "sample 1"
assert run(sample2) == "4\n5\n8", "sample 2"

minimum_case = """\
2 1
1 2 1
1 2 1
"""
assert run(minimum_case) == "2", "minimum-size case"

exact_boundary = """\
3 4
1 2 10
2 3 20
1 3 10
1 3 20
1 3 5
1 3 10
"""
assert run(exact_boundary) == "4\n3\n6\n4", "exact divisibility boundaries"

equal_edges = """\
5 4
1 2 10
2 3 10
3 4 10
4 5 10
1 5 10
1 5 5
1 5 20
2 4 10
"""
assert run(equal_edges) == "5\n9\n5\n3", "all equal edge lengths"

large_chain = "100000 100000\n"
large_chain += "".join(f"{i} {i + 1} 1\n" for i in range(1, 100000))
large_chain += "".join(f"1 100000 {t}\n" for t in range(1, 100001))

large_output = run(large_chain).splitlines()
assert len(large_output) == 100000, "maximum-size case"
assert large_output[0] == "100000", "maximum-size T=1"
assert large_output[-1] == "100000", "maximum-size large T"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1`，一条边的长度`1`,`T = 1`|`2`| 最小树木且无充电站 |
 | 具有长度的三顶点路径`10, 20`|`4`,`3`,`6`,`4`| 电池容量的精确倍数|
 | 四个边长相等`10`|`5`,`9`,`5`,`3`| 重复相等的边缘值和多个容量 |
 | 链条与`100000`顶点和`100000`查询 |`100000`对于每个查询 | 最大树大小、大查询数和极限容量 |

 ## 边缘情况

 第一个边缘情况是长度恰好等于电池容量的边缘。 考虑```
2 1
1 2 10
1 2 10
```该路径有一条边，并且`ceil(10/10) = 1`，所以答案是`1 + 1 = 2`。 算法输入`t >= max_edge`情况并返回路径的一条边加一。 没有中间充电停止。 

第二个边缘情况是比容量稍长的边缘。 考虑```
2 1
1 2 11
1 2 10
```边缘需求`ceil(11/10) = 2`旅行环节。 中间需要一个充电站，所以答案是`3`。 持久或前缀计算将边缘贡献记录为`2`，以及最后的`+1`给出`3`。 

第三种边缘情况是包含多个强制仓库但不收费的路线。 考虑```
3 1
1 2 5
2 3 5
1 3 10
```两边都有`ceil(5/10) = 1`。 他们的贡献是`2`，以及初始的`+1`给出`3`。 中间仓库被算在内，因为它是第一条边的端点，也是第二条边的起点。 

第四个边缘情况是一条比电池长得多的路。 考虑```
2 1
1 2 20
1 2 5
```单边贡献`ceil(20/5) = 4`，所以答案是`5`。 该算法永远不会声明道路不可达。 它仅计算四个行程段所隐含的三个中间充电站。 

第五个边缘情况是容量超过树中每条道路的查询。 如果最大的路有长度`20`和`T = 21`，每条路都只贡献一条。 持久化树是不必要的，直接结果`number_of_edges_on_path + 1`是准确的。 此快捷方式还避免了在答案与实际边长度无关的查询上浪费时间。
