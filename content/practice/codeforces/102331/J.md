---
title: "CF 102331J - Jiry 匹配"
description: "我们有一棵有 (n) 个顶点的加权树。 匹配是一组边，使得没有两个选定的边共享端点。 对于每个 (k=1,2,ldots,n-1)，我们需要恰好包含 (k) 条边的所有匹配中边权重的最大可能总和。"
date: "2026-08-13T03:51:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "J"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 450
verified: true
draft: false
---

[CF 102331J - Jiry 匹配](https://codeforces.com/problemset/problem/102331/J)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有 (n) 个顶点的加权树。 匹配是一组边，使得没有两个选定的边共享端点。 对于每个 (k=1,2,\ldots,n-1)，我们需要恰好包含 (k) 条边的所有匹配中边权重的最大可能总和。 如果不存在大小 (k) 的匹配，我们打印`?`。 

输入是一棵树，因此它恰好包含 (n-1) 条边。 权重可以是负数，这意味着大小 (k) 的有效匹配可能具有负最优值。 我们不允许用零替换否定答案，因为所选边的数量是固定的。 

对于（n\le 200000），一个普通的树背包就太贵了。 如果一个顶点有一个大小为 (s) 的子树，则存储每个可能的匹配大小的答案已经花费 (O(s))，并且直接组合两个这样的数组花费 (O(s_1s_2))。 在一条路径上，重复合并不断增长的数组将需要 (O(n^2))，这已经远远超出了六秒限制所能支持的范围。 该解决方案必须利用这些 DP 阵列的特殊形状。 

有四种边缘情况特别容易处理不当。 

首先，负权重仍然是有效的答案。 对于输入```
2
1 2 -7
```唯一可能的匹配有一个边缘，因此正确的输出是```
-7
```将答案初始化为零并以零获取最大值的实现将错误地打印`0`。 

其次，某些尺寸可能存在匹配，然后就变得不可能了。 为了```
3
1 2 -5
2 3 -2
```最佳单边匹配使用边 (2\text{-}3)，给出`-2`，而两条边匹配不存在。 答案是```
-2 ?
```仅检查前几个 DP 条目的粗心实现可能会意外地将无法到达的状态解释为实际值。 

第三，最大匹配大小不是(n-1)。 在 6 个顶点的路径中，最多可以选择 3 条边。 为了```
6
1 2 3
2 3 3
3 4 3
4 5 3
5 6 3
```答案是```
3 6 9 ? ?
```DP 必须保留无法到达的基数，而不是假设 (n-1) 以内的每个大小都是可行的。 

第四，同等权重可以产生很多最优选择。 对于一个明星来说```
5
1 2 4
1 3 4
1 4 4
1 5 4
```只能选择一条边，所以答案是```
4 ? ? ?
```简单地按权重对边进行排序的贪心规则无法解决问题，因为重要的问题是共享顶点的边之间的相互作用。 

## 方法

 直接的解决方案是树DP。 树的根位于顶点 (1)。 对于每个顶点 (u)，在其子树内保留两个描述匹配的数组。 

令 (f_u^0[k]) 为 (u) 子树中与 (k) 条边匹配的最大权重，其中 (u) 不与其任何子树匹配。 令 (f_u^1[k]) 为 (u) 恰好匹配一个子项时的对应值。 对于叶子，(f_u^0=[0]) 和 (f_u^1) 为空。 

假设 (v) 是 (u) 的子级，由权重 (w) 的边连接。 如果我们不使用(uv)，(v)的贡献是(\max(f_v^0,f_v^1))。 如果我们使用 (uv)，则 (v) 本身无法与另一个子项匹配，因此它的贡献为 (f_v^0)，移动一个匹配边并增加 (w)。 

剩下的问题是结合基数维度。 如果两个 DP 数组 (a) 和 (b) 描述独立的子树，则普通的树-背包转移为

 [
 c[k]=\max_{i+j=k}(a[i]+b[j])。 
]

 对于任意数组，这是二次的。 这里的数组有一个至关重要的凹性。 边际收益

 [
 a[i]-a[i-1]
 ]

 均不增加。 这是从基数约束匹配的标准最小成本或最大成本流解释得出的。 在二部图中，当我们最大化权重时，再发送一个匹配流单位的边际成本不会增加。 该树是二分树，因此相同的属性适用于每个子树 DP 配置文件。 该问题的标准解决方案中也使用了相同的观察结果。 

对于两个这样的凹阵列，最大加卷积成为它们边际增益的合并。 如果 (a) 的边际收益为

 [
 a[1]-a[0],a[2]-a[1],\ldots
 ]

 并且（b）的边际增益的定义类似，我们将这两个已经排序的序列放在一起。 合并序列的前缀和正是卷积。 因此，两个长度为 (A) 和 (B) 的轮廓可以组合为 (O(A+B)) 而不是 (O(AB))。 这是官方解决方案使用的 Minkowski-sum 观点。 

这解决了昂贵的卷积，但路径仍然会导致问题。 如果我们将顶点一一组合，则数组的大小为 (1,2,3,\ldots,n)，产生 (O(n^2)) 工作。 解决这个问题的观察方法是重光分解。 

对于每个顶点，选择其最大的子子树作为重子树。 其他孩子都很轻。 我们首先使用分治法组合顶点的所有轻子节点，因此每个轻子节点贡献仅参与 (O(\log n)) 合并。 然后我们再次使用分而治之的方法一次性处理整个重链。 每个链分割根据附加到其顶点的非重子树信息量进行平衡。 这给出了所需的 (O(n\log^2 n)) 界限。 

暴力方法和优化方法可以总结如下。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 直树背包| (O(n^2)) | (O(n^2)) 在最坏的情况下 | 太慢了 |
 | 没有 HLD 的凹卷积 | 路径上的 (O(n^2)) | (O(n)) 到 (O(n^2)) 取决于存储 | 还是太慢|
 | HLD + 分而治之的 Minkowski 和 | (O(n\log^2 n)) | (O(n\log n)) 瞬态，(O(n)) 图形存储 | 已接受 |

 ## 算法演练

 1. 以顶点 (1) 为树根，计算每个子树大小，并为每个顶点选择具有最大子树大小的子树作为其重子树。 将每个子-父边缘的权重与子存储在一起。 

重子树将最大的剩余子树附加到当前顶点。 每次我们穿过一条亮边时，子树的大小至少会增加一倍，因此一个顶点只能位于 (O(\log n)) 条亮边下方。 

1. 对于每个顶点 (u)，首先求解所有轻子子树。 对于轻子 (v)，我们已经有了两个配置文件 (f_v^0) 和 (f_v^1)。 

如果 (u) 与 (uv) 不匹配，则贡献为

 [
 g_v^0=\max(f_v^0,f_v^1)。 
]

如果 (u) 与 (v) 匹配，则 (v) 不能同时与其自己的子级之一匹配。 贡献是

 [
 g_v^1[k+1]=f_v^0[k]+w(u,v)。 
]

 对于所有轻子级，我们需要一个针对 (u) 与其子级不匹配的情况的配置文件，以及针对恰好有一个轻级子级与 (u) 匹配的情况的另一配置文件。 

1. 使用分而治之的方法将光孩子组合起来。 在这棵分而治之树的叶子上，这对配置文件很简单

 [
 (g_v^0,g_v^1)。 
]

 当两个组连接时，新的“零”轮廓是它们的零轮廓的 Minkowski 卷积。 新的“一”轮廓是两种可能性中的最大值，其中入射到当前顶点的唯一边来自左组或右组。 

由于所有轮廓都是凹的，因此每个卷积在两个数组的长度上都是线性的。 分而治之可以防止一系列日益昂贵的合并。 

1. 现在考虑一条重链 (v_1,v_2,\ldots,v_m)，从顶部到底部排序。 对于每个顶点，我们已经知道其所有轻子节点产生的两个轮廓。 

一个链段需要四个轮廓。 这两个二进制状态描述了其顶部端点和底部端点是否已经在段内匹配。 对于单个顶点，只有状态 (00) 和状态 (11) 是可能的，因为同一顶点同时是两个端点。 

1. 将重链段分成两个平衡的部分。 通过采用所有兼容的 Minkowski 卷积，组合左右段的四种状态，而不选择它们的连接边。 

外部端点仍然是两个原始线段的端点。 这是普通的串联情况。 

1. 分别考虑选择连接两半的边。 仅当左半部的右端点和右半部的左端点当前在各自的半部内不匹配时，这样的边才是合法的。 

在这种情况下，请添加边权重并将生成的轮廓移动一个位置，因为已选择了一个附加匹配边。 两个内部端点都被占用，因此相应的边界状态从 (0) 变为 (1)。 

1. 重复链分而治之，直到完整的重链被合并。 其顶部顶点的所得两个轮廓是该子树所需的轮廓。 
2. 从下往上处理每条重链。 当一条链完成后，只有其顶部顶点需要对其父级保持可用。 所有内部配置文件都可以释放，从而使工作内存保持在控制之下。 
3. 对包含根的链进行处理后，取

 [
 F[k]=\max(f_1^0[k],f_1^1[k])。 
]

 对于每个 (k=1,\ldots,n-1)，如果可达，则打印 (F[k]) 并且`?`否则。 

### 为什么它有效

 不变的是，为顶点或链段存储的每个轮廓准确地表示该区域内的所有匹配，根据相关边界顶点是否已在该区域内匹配来分类。 光-子过渡考虑将子连接到其父的边的仅有的两种可能性，而链过渡考虑两个链段之间的边的仅有的两种可能性，选择的或未选择的。 因此，每个合法匹配都由某个 DP 状态表示，并且由转换构造的每个状态都对应于一个合法匹配。 

数值优化不会改变这些转变。 它只会更快地计算它们的最大加卷积。 由于基数分布是凹的，它们的边际增益已经排序，因此合并边际增益给出与二次定义完全相同的卷积。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

NEG = -10**30

def solve():
    n = int(input())

    graph = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        graph[u].append((v, w))
        graph[v].append((u, w))

    parent = [0] * (n + 1)
    value = [0] * (n + 1)
    size = [1] * (n + 1)
    heavy = [0] * (n + 1)

    order = [1]
    parent[1] = -1

    for u in order:
        for v, w in graph[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            value[v] = w
            order.append(v)

    for u in reversed(order):
        size[u] = 1
        best = 0
        best_size = 0
        for v, _ in graph[u]:
            if parent[v] == u:
                size[u] += size[v]
                if size[v] > best_size:
                    best_size = size[v]
                    best = v
        heavy[u] = best

    f0 = [None] * (n + 1)
    f1 = [None] * (n + 1)

    def max_merge(a, b):
        if not a:
            return b[:]
        if not b:
            return a[:]

        m = max(len(a), len(b))
        c = [NEG] * m

        la = len(a)
        lb = len(b)

        for i in range(m):
            x = a[i] if i < la else NEG
            y = b[i] if i < lb else NEG
            c[i] = x if x >= y else y

        return c

    def minkowski(a, b):
        if not a or not b:
            return []

        la = len(a)
        lb = len(b)

        c = [0] * (la + lb - 1)
        c[0] = a[0] + b[0]

        da = [0] * (la - 1)
        db = [0] * (lb - 1)

        for i in range(1, la):
            da[i - 1] = a[i] - a[i - 1]

        for i in range(1, lb):
            db[i - 1] = b[i] - b[i - 1]

        i = 0
        j = 0
        p = 1
        total = len(c)

        while p < total:
            if j == len(db) or (i < len(da) and da[i] > db[j]):
                c[p] = da[i]
                i += 1
            else:
                c[p] = db[j]
                j += 1
            p += 1

        for i in range(1, total):
            c[i] += c[i - 1]

        return c

    def solve_light(ids, l, r):
        if l == r:
            u = ids[l]

            g = f0[u][:]
            if g:
                for i in range(len(g)):
                    g[i] += value[u]
                g.insert(0, NEG)

            return (
                max_merge(f0[u], f1[u]),
                g
            )

        mid = (l + r) >> 1

        left0, left1 = solve_light(ids, l, mid)
        right0, right1 = solve_light(ids, mid + 1, r)

        zero = minkowski(left0, right0)

        one_left = minkowski(left1, right0)
        one_right = minkowski(left0, right1)
        one = max_merge(one_left, one_right)

        return zero, one

    def solve_chain(ids, l, r):
        if l == r:
            u = ids[l]

            return (
                [[f0[u][:], []],
                 [[], f1[u][:]]]
            )

        total_light = 0
        for i in range(l, r + 1):
            u = ids[i]
            total_light += size[u] - size[heavy[u]]

        mid = l
        used = 0

        while mid < r and used < total_light // 2:
            u = ids[mid]
            used += size[u] - size[heavy[u]]
            mid += 1

        left = solve_chain(ids, l, mid - 1)
        right = solve_chain(ids, mid, r)

        res = [
            [[], []],
            [[], []]
        ]

        for a in range(2):
            for b in range(2):
                for c in range(2):
                    for d in range(2):
                        x = minkowski(left[a][b], right[c][d])
                        res[a][d] = max_merge(res[a][d], x)

        for a in range(2):
            for d in range(2):
                x = minkowski(left[a][0], right[0][d])

                if not x:
                    continue

                for i in range(len(x)):
                    x[i] += value[ids[mid]]

                x.insert(0, NEG)

                na = 1 if (l == mid - 1) else a
                nd = 1 if (mid == r) else d

                res[na][nd] = max_merge(res[na][nd], x)

        return res

    def process_chain(top):
        chain = []
        u = top

        while u:
            chain.append(u)
            u = heavy[u]

        for u in chain:
            light = []

            for v, _ in graph[u]:
                if parent[v] == u and v != heavy[u]:
                    process_chain(v)
                    light.append(v)

            if not light:
                f0[u] = [0]
                f1[u] = []
            else:
                a, b = solve_light(light, 0, len(light) - 1)
                f0[u] = a
                f1[u] = b

                for v in light:
                    f0[v] = None
                    f1[v] = None

        res = solve_chain(chain, 0, len(chain) - 1)

        f0[top] = max_merge(res[0][0], res[0][1])
        f1[top] = max_merge(res[1][0], res[1][1])

        for u in chain[1:]:
            f0[u] = None
            f1[u] = None

    process_chain(1)

    answer = []
    root0 = f0[1]
    root1 = f1[1]

    for k in range(1, n):
        best = NEG

        if k < len(root0):
            best = max(best, root0[k])

        if k < len(root1):
            best = max(best, root1[k])

        if best <= NEG // 2:
            answer.append("?")
        else:
            answer.append(str(best))

    print(" ".join(answer))

if __name__ == "__main__":
    solve()
```第一个预处理过程是迭代的而不是递归的。 这避免了 Python 调用堆栈依赖于原始树的高度，在路径上原始树的高度可以是 (200000)。 然后反向遍历计算子树大小并选择最大的子树作为重子树。 

这`minkowski`函数是核心数值优化。 它通过形成连续的差异并按降序合并这些差异来计算最大加卷积。 输入轮廓是凹的，因此这些差异已经排序。 前缀和重建结果轮廓。 

领先的`NEG`移位轮廓中的值表示不可能的匹配尺寸。 它故意比每个真实答案小得多。 最大可能的绝对总重量低于 (2\cdot10^{14})，因此`-10**30`留下了非常大的安全裕度，而且 Python 整数无论如何也不存在溢出问题。`solve_light`为所有轻子级实现分治合并。 它的第二个轮廓对应于恰好选择一条入射到当前顶点的边。 移动一个位置说明了所选边缘。`solve_chain`是重链的四状态分而治之 DP。 它的状态`res[a][b]`记录两个暴露端点的状态。 第一个组合循环处理未选择的边界边。 第二个循环处理选择该边，要求两个相邻端点状态均为零。 

分割的权重为`size[u] - size[heavy[u]]`，不继续通过重边缘的信息量。 这个细节使链递归具有平衡的复杂性，而不是仅仅按顶点数量进行分割。 

最终答案取两个根状态中的最大值，因为根没有父级，因此对于它是否与其子级之一匹配没有外部限制。 

该实现遵循标准解决方案中描述的 (O(n\log^2 n)) HLD 和凹卷积结构。 

## 工作示例

 ### 示例 1

 这棵树是```
1
|
2
/ \
3  4
|
5
```具有权重 (3,5,4,2)。 按子树大小选择的重路径是 (1\to2\to3\to5)，而 (4) 是 (2) 的轻子路径。 

相关的本地概况演变如下。 

| 舞台| 顶点或线段 | (f^0) | (f^0) | (f^1) | (f^1) |
 | --- | --- | --- | --- |
 | 1 | 叶 4 |`[0]`|`[]`|
 | 2 | 顶点 2，重子之前 |`[0]`|`[-inf, 4]`|
 | 3 | 段 3-5 |`[0]`|`[-inf, 2]`|
 | 4 | 2 | 的子树`[0, 2]`|`[-inf, 5, 6]`|
 | 5 | 整棵树 |`[0, 5, 6]`|`[-inf, 3, 5]`|

 从根本上来说，最好的配置文件是`[0,5,6]`。 一条边的条目是 (5)，从边 (2\text{-}3) 获得。 两条边的条目是 (6)，从边 (2\text{-}4) 和 (3\text{-}5) 获得。 更大的基数是无法达到的，所以输出是`5 6 ? ?`。 

该跟踪还显示了为什么需要这两种状态。 在顶点 (2) 处，选择 (2\text{-}4) 会阻止选择 (2\text{-}3)，但不会阻止选择 (3\text{-}5)。 

### 示例 2

 对于十顶点树，最终的根轮廓包含以下可达值。 

| 匹配尺寸（k）| 最超值|
 | --- | --- |
 | 1 | 5 |
 | 2 | 10 | 10
 | 3 | 15 | 15
 | 4 | 10 | 10
 | 5 | 无法到达 |
 | 6 | 无法到达 |
 | 7 | 无法到达 |
 | 8 | 无法到达 |
 | 9 | 无法到达 |

 迹线的重要部分是该值不必随 (k) 单调递减。 前三个匹配尺寸可以使用多个正边缘，而强制使用第四个边缘可能需要用重量较轻的配置替换更好的配置。 DP 独立优化每个基数，所以`10`(k=4) 是完全有效的，即使它小于 (k=3) 的答案。 

最终输出是```
5 10 15 10 ? ? ? ? ?
```## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log^2 n)) | 凹卷积在轮廓大小上是线性的，而轻子链和重链合并通过分而治之来平衡 |
 | 空间| (O(n\log n)) 瞬态，(O(n)) 图形存储 | DP向量在其子树或链被消耗后被释放|

 (O(n\log^2 n)) 时间限制是该方法处理 (n=200000) 的关键原因。 轻边只能遍历 (O(\log n)) 次，因为每次此类转换后子树大小至少加倍，并且分而治之卷积会添加另一个对数因子。 这是 HLD 解的预期渐近复杂度。 

边权重可以大到(10^9)，并且可以有(O(n))条选择的边，因此C++中需要64位运算。 Python 整数自然地提供了所需的范围。 

## 测试用例

 以下线束假设提交的解决方案已另存为`solution.py`。 它使用子进程来测试竞争性编程程序的确切标准输入/标准输出接口。```python
import subprocess

def run(inp: str) -> str:
    result = subprocess.run(
        ["python3", "solution.py"],
        input=inp,
        text=True,
        capture_output=True,
        check=True,
    )
    return result.stdout.strip()

# Provided sample 1
assert run("""\
5
1 2 3
2 3 5
2 4 4
3 5 2
""") == "5 6 ? ?", "sample 1"

# Provided sample 2
assert run("""\
10
2 8 -5
5 10 5
3 4 -5
1 6 5
3 9 5
1 7 -3
4 8 -5
10 8 -5
1 8 -3
""") == "5 10 15 10 ? ? ? ? ?", "sample 2"

# Provided sample 3
assert run("""\
2
1 2 35
""") == "35", "sample 3"

# Minimum size with a negative edge
assert run("""\
2
1 2 -7
""") == "-7", "negative answer must remain negative"

# Three-vertex path, one matching is possible but two are not
assert run("""\
3
1 2 -5
2 3 -2
""") == "-2 ?", "unreachable cardinality"

# Star, all edges equal
assert run("""\
5
1 2 4
1 3 4
1 4 4
1 5 4
""") == "4 ? ? ?", "star matching size"

# Path with equal positive weights
assert run("""\
6
1 2 3
2 3 3
3 4 3
4 5 3
5 6 3
""") == "3 6 9 ? ?", "maximum matching size"

# Maximum-size stress shape.
# A star on 200000 vertices has maximum matching size 1.
n = 200000
parts = [str(n)]
parts.extend(f"1 {v} 1" for v in range(2, n + 1))
maximum_input = "\n".join(parts) + "\n"
maximum_expected = "1 " + " ".join("?" for _ in range(n - 2))
assert run(maximum_input) == maximum_expected, "maximum-size star"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 / 1 2 -7`|`-7`| 负最优值|
 |`3 / 1 2 -5 / 2 3 -2`|`-2 ?`| 不可能的更大匹配尺寸 |
 | 四条相等的边入射到一个中心 |`4 ? ? ?`| 高度顶点的匹配冲突 |
 | 具有所有权重的六顶点路径`3`|`3 6 9 ? ?`| 精确的最大匹配大小和重复边际收益 |
 | 二十万顶点星|`1 ? ? ... ?`| 最大输入尺寸和极限度|

 ## 边缘情况

 处理单个负边沿是因为基本轮廓包含零仅用于选择不边沿，而请求的答案从 (k=1) 开始。 为了```
2
1 2 -7
```唯一边缘的移动轮廓是`[-inf, -7]`。 因此最终的根最大值给出`-7`，不为零。 

三个顶点的路径表现出不可达状态：```
3
1 2 -5
2 3 -2
```两条边共享顶点 (2)，因此 DP 可以创建具有值的有效大小为 1 的状态`-2`，但没有有效的尺寸二状态。 对应的数组位置保持不变`NEG`，输出逻辑将其转换为`?`。 

一颗星说明了为什么选择局部最重的边是不够的：```
5
1 2 4
1 3 4
1 4 4
1 5 4
```所有四个边都具有相同的权重，但它们都在顶点 (1) 处发生冲突。 中心已匹配的状态会阻止选择所有其他入射边。 生成的配置文件仅包含尺寸 0 和 1。 

六顶点路径```
6
1 2 3
2 3 3
3 4 3
4 5 3
5 6 3
```最大匹配尺寸为三。 三个边 (1\text{-}2)、(3\text{-}4) 和 (5\text{-}6) 给出权重 (9)。 下一个基数是不可能的，因此答案在第三个值之后结束。 这会检查可达和不可达 DP 条目之间的边界。 

最后，最大尺寸的星形有 (200000) 个顶点和 (199999) 个边。 每条边都共享中心，因此只有一条边可以属于匹配。 该算法仍然需要处理所有顶点，但重轻结构选择一个叶子作为重子节点，并将其余叶子视为轻子节点。 结果的答案是`1`其次是`199998`问号。 此案例练习了高度顶点处理和处理完整输入大小的要求。
