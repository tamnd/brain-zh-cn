---
title: "CF 102309D - Orz Pandas 总监"
description: "我们有两组功能。 第一组包含 (n) 个特征，第二组包含 (m) 个特征。 每个特征都有一个正权重，并且有些特征对被声明为不兼容。"
date: "2026-08-13T23:50:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102309
codeforces_index: "D"
codeforces_contest_name: "The 2019 \u201cOrz Panda\u201d Cup Programming Contest"
rating: 0
weight: 102309
solve_time_s: 62
verified: true
draft: false
---

[CF 102309D - Orz Pandas 总监](https://codeforces.com/problemset/problem/102309/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两组功能。 第一组包含 (n) 个特征，第二组包含 (m) 个特征。 每个特征都有一个正权重，并且有些特征对被声明为不兼容。 输入保证每个不兼容对包含第一组中的一个特征和第二组中的一个特征，因此冲突图是二部的。 

我们需要选择一组具有最大总权重的特征，以便选择的两个端点不会发生冲突。 在图术语中，这是二分图中的最大权重独立集。 

对于每个测试用例，第一行给出 (n) 和 (m)。 下一行给出 (n+m) 个特征权重。 然后是 (k) 个冲突对。 一对 ((p,q)) 意味着不能同时选择特征 (p) 和 (q)。 由于 (p\le n<q)，每条边都从二分图的左侧部分到右侧部分。 

所需的输出是无冲突特征集的最大可能的权重总和。 可以有多个测试用例，它们会持续到文件末尾。 

这里是(n,m\le100)，所以图最多有200个顶点。 冲突数量可以达到10,000，这接近两组100个顶点之间的最大可能边数。 对所有子集的强力搜索最多有 (2^{200}) 种可能性，这远远超出了一秒解决方案可以处理的范围。 少量的顶点最初可能建议进行子集枚举，但指数因子才是真正的障碍。 密集的边缘边界还意味着算法应该能够轻松处理大约 10,000 条边缘。 

权重可以大到 (10^7)。 由于特征最多有200个，所以答案可以达到(2\cdot10^9)。 Python 整数具有任意精度，而 C++ 实现仍然适合有符号 32 位整数内的这个特定界限，尽管使用 64 位容量是流实现的标准安全选择。 

在某些情况下，看似简单的实现可能会失败。 首先，冲突并不意味着必须选择或拒绝整个群体。 例如，```
1 1
5 7
1
1 2
```有答案`7`，因为我们可以选择第二个特征并保留第一个特征不选择。 贪婪地选择较重特征的方法恰好在这里起作用，但是当多个冲突相互作用时，这个想法就失败了。 

例如，```
2 2
6 5 7 7
3
1 3
1 4
2 3
```有答案`12`，通过选择特征 2 和 4 获得。对特征 1 的贪婪决策可以阻止右侧特征并产生较小的答案。 

另一种边界情况是没有冲突的特征。 为了```
1 1
4 9
1
1 2
```我们不能同时采用这两个特征，但我们可以采用权重为 9 的特征，所以答案是`9`。 在流构造中，每个顶点即使没有事件冲突边，仍然必须接收自己的权重容量。 

最后一个实施陷阱是用于冲突边缘的容量。 它必须大于所有特征权重的总和。 如果选择的容量太小，则最小切割可能更喜欢切割冲突边而不是支付顶点费用，这与删除特征不对应。 选择`sum(weights) + 1`完全避免了这个问题。 

## 方法

 直接的方法是枚举 (n+m) 个特征的每个子集。 对于每个子集，我们检查它是否包含任何冲突边的两个端点。 如果有效，我们计算它的权重并保留最大值。 这是正确的，因为每个可能的选择在子集中只出现一次。 

然而，最多有 200 个特征，可以有 (2^{200}) 个子集。 即使检查一个子集只花费常数时间，这也大约是 (1.6\cdot10^{60}) 个状态。 为每个子集检查多达 10,000 个冲突将使理论工作量变得更大。 暴力解决方案对于理解问题很有用，但不可能使其符合时间限制。 

冲突的结构为我们提供了一条更强有力的路线。 该图是二分图，我们正在寻找最大权重独立集。 每个独立集恰好是顶点覆盖的补集：如果我们删除独立集之外的所有顶点，则每个冲突边必须至少删除一个端点。 由于所有权重均为正数，因此最大化保留的权重相当于最小化移除的总重量。 

所以问题变成了二部图中的最小权重顶点覆盖。 柯尼希定理的加权版本可以通过最小 (s)-(t) 割来求解。 

构造一个具有源 (s)、所有第一组顶点、所有第二组顶点和汇 (t) 的流网络。 为每个第一组顶点提供一条来自 (s) 的边，其容量等于其权重。 为每个第二组顶点提供一条到 (t) 的边，其容量等于其权重。 对于从左顶点到右顶点的每个冲突，添加一条容量大于所有顶点总权重的有向边。 

考虑 (s)-(t) 切割。 如果左顶点位于源侧，则不会切割其源边。 如果它移动到接收器一侧，则其源边缘被切割，我们支付其重量。 类似地，源侧的右顶点会导致其到接收器的边缘被切割，从而支付其重量。 

非常大的冲突边可防止最小切割将冲突的左顶点和右顶点放置在错误方向的相对侧上。 由于总是存在最多为所有顶点的总权重的成本切割，因此容量大于该总重量的冲突边永远不会成为最小切割的一部分。 因此，每个最小割对应于一个顶点覆盖，其容量正是该覆盖的重量。 

如果最小顶点覆盖有权重(C)，则最大独立集有权重

 [
 \sum_i w_i-C。 
]

 因此，一次最大流量计算就给出了答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^{n+m}k)) | (O(n+m+k)) | 太慢了|
 | 最佳| (O(V^2E)) 与 Dinic | (O(V+E)) | 已接受 |

 这里(V=n+m+2)和(E=k+n+m)。 所述 (O(V^2E)) 界限是一般整数容量网络上 Dinic 算法的标准最坏情况界限。 最多约有 202 个顶点和 10,200 个前向边，这很容易管理。 

## 算法演练

1. 读取一个测试用例并存储所有（n+m）个特征的权重。 计算他们的总重量。 我们最终将减去必须丢弃的顶点的最小权重。 
2. 创建一个包含源、(n) 个左侧特征顶点、(m) 个右侧特征顶点和一个汇点的流网络。 使用从零开始的内部顶点索引，同时将每个输入特征编号从从一开始的索引转换。 
3. 将一条边从源添加到每个左侧要素，其容量等于该要素的权重。 削减这个边缘意味着从选定的集合中删除该特征，因此这样做的成本正是它的重量。 
4. 从每个右侧特征向水槽添加一条边缘，其容量等于其重量。 切割这样的边缘对于右侧特征具有相同的解释。 
5. 对于每个冲突((p,q))，用容量从对应的左顶点到对应的右顶点添加一条边`total_weight + 1`。 这个容量故意大于删除每个功能的成本。 最小切割永远不会选择切割这样的边，因此必须通过将至少一个端点移动到切割的适当一侧来覆盖每个冲突。 
6. 在生成的网络上运行最大流量算法。 根据最大流量最小切割定理，得到的流量值等于最小切割能力。 通过构造，该最小切割恰好是顶点覆盖的最小重量。 
7. 从总特征权重中减去最小顶点覆盖权重。 其余特征形成最大权重独立集，因此这个差异就是所需的答案。 

为什么它有效：考虑任何最小割并查看源端的顶点。 汇侧的左顶点将其源边贡献给切割，而源侧的右顶点贡献其汇边。 由于每个冲突边的容量都大于所有顶点的总权重，因此最小割不会使用冲突边。 因此，每一冲突至少有一个位于源端独立集之外的端点。 从该集合中删除的顶点形成顶点覆盖，并且切割容量恰好等于它们的总重量。 相反，任何顶点覆盖都可以通过将移除的左顶点放置在接收器侧并将移除的右顶点放置在源侧来定义相同权重的切割。 因此，最小割正是最小权重顶点覆盖。 取其补集得到最大权重独立集，这正是所需的特征选择。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Dinic:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, cap):
        forward = [v, cap, None]
        backward = [u, 0, forward]
        forward[2] = backward
        self.g[u].append(forward)
        self.g[v].append(backward)

    def bfs(self, s, t):
        level = [-1] * self.n
        level[s] = 0
        queue = [s]
        head = 0

        while head < len(queue):
            u = queue[head]
            head += 1

            for v, cap, rev in self.g[u]:
                if cap > 0 and level[v] == -1:
                    level[v] = level[u] + 1
                    queue.append(v)

        return level[t] != -1, level

    def dfs(self, u, t, pushed, level, it):
        if u == t:
            return pushed

        while it[u] < len(self.g[u]):
            edge = self.g[u][it[u]]
            v, cap, rev = edge

            if cap > 0 and level[v] == level[u] + 1:
                flow = self.dfs(v, t, min(pushed, cap), level, it)

                if flow:
                    edge[1] -= flow
                    rev[1] += flow
                    return flow

            it[u] += 1

        return 0

    def max_flow(self, s, t):
        flow = 0
        INF = 10**30

        while True:
            found, level = self.bfs(s, t)
            if not found:
                break

            it = [0] * self.n

            while True:
                pushed = self.dfs(s, t, INF, level, it)
                if pushed == 0:
                    break
                flow += pushed

        return flow

def solve(data):
    pos = 0
    out = []

    while pos < len(data):
        n = data[pos]
        m = data[pos + 1]
        pos += 2

        weights = data[pos:pos + n + m]
        pos += n + m

        k = data[pos]
        pos += 1

        conflicts = []
        for _ in range(k):
            p = data[pos] - 1
            q = data[pos + 1] - 1
            pos += 2
            conflicts.append((p, q))

        total = sum(weights)

        source = n + m
        sink = source + 1
        dinic = Dinic(n + m + 2)

        for i in range(n):
            dinic.add_edge(source, i, weights[i])

        for j in range(n, n + m):
            dinic.add_edge(j, sink, weights[j])

        inf = total + 1

        for p, q in conflicts:
            dinic.add_edge(p, q, inf)

        cover_weight = dinic.max_flow(source, sink)
        out.append(str(total - cover_weight))

    return "\n".join(out)

def main():
    data = list(map(int, sys.stdin.buffer.read().split()))
    sys.stdout.write(solve(data))

if __name__ == "__main__":
    main()
```这`Dinic`类将每个剩余边缘及其反向边缘的引用存储在一起。 当流量向前推动时，正向容量减少，反向容量增加。 这种反向能力可以让后来的增强路径撤销之前的决定。 

BFS 构建 Dinic 使用的级别图。 它只遍历具有正剩余容量的边，因此当前无法接收更多流量的顶点将被忽略。 

DFS 通过一次只前进一层的边缘发送阻塞流。 这`it`数组会记住每个顶点最后考虑的出边。 如果没有它，可能会重复扫描相同的饱和或不可用的边缘，从而使实现速度慢得多。 

这`solve`函数首先将整个输入读取为整数。 这很方便，因为测试用例一直持续到 EOF 并且输入没有明确的测试用例计数。 位置`pos`遍历展平的整数数组并消耗属于每个测试用例的值的数量。 

源索引为`n + m`，水槽为`n + m + 1`。 输入中编号为 (p) 的特征成为顶点`p - 1`，这是必要的，因为输入使用从一开始的索引，而 Python 数组使用从零开始的索引。 

冲突容量为`total + 1`，不是任意常数，例如 (10^9)。 这已经足够了，因为删除每个特征的削减成本正好`total`，因此最小割永远不会选择成本高于成本的冲突边`total`。 

Python 中不存在整数溢出问题。 最大的有用容量仅略高于所有权重的总和，即最多 (2\cdot10^9)，但 Python 的任意精度整数使得实现即使该界限发生变化也是稳健的。 

最终的答案是`total - cover_weight`，直接实现独立集与顶点覆盖的补关系。 

## 工作示例

 提供的语句仅包含一个实际示例，因此第二个跟踪使用一个小型构造的测试用例。 

对于样本 1，四个特征权重为 (4,3,8,2)。 冲突是(1)-(3)、(1)-(4)和(2)-(4)。 

总重量为(17)。 流网络的左侧顶点具有源容量 (4) 和 (3)，右侧顶点具有汇容量 (8) 和 (2)。 

| 步骤| 左功能状态 | 正确的功能状态 | 最低保障成本| 独立设定重量 |
 | ---| ---| ---| ---| ---|
 | 初始| 1, 2 可用 | 3, 4 可用 | 0 | 17 | 17
 | 解决与 1 | 的冲突 1 或删除 | 3, 4 | 4 或 10 | 取决于切割 |
 | 解决冲突 2-4 | 2 或删除 | 4 或删除 | 最小值变为 5 | 12 | 12
 | 决赛| 删除功能 2 | 保留 3 和 4 | 5 | 12 | 12

 最佳选择是特征 1 和 3，具有权重 (4+8=12)，或者等效地特征 3 和 4，也具有权重 (8+2=10)。 最小顶点覆盖的权重为 (5)，通过删除特征 1？ 实际上，特征1覆盖了与3和4的冲突，但冲突2-4仍然需要特征2或4。选择特征1和2作为覆盖成本（4+3=7），选择特征3和4成本（10），选择特征1和4成本（6）。 因此，最小覆盖范围是特征 1 和 4，成本为 (6)，给出 (17-6=11)。 这揭示了为什么跟踪必须遵循实际的剪切，而不是根据各个冲突进行猜测。 

正确的最大流量值为`6`，所以样本答案是`11`。 

对于第二个示例，请考虑：```
2 2
6 5 7 7
3
1 3
1 4
2 3
```可能有用的选择包括特征 2 和 4，总权重为 (5+7=12)。 流构造找到权重 (13) 的最小顶点覆盖，例如通过删除特征 1 和 2。得到的独立集权重是 (25-13=12)。 

| 步骤| 源端选择| 删除的顶点 | 削减成本 | 保持体重|
 | ---| ---| ---| ---| ---|
 | 初始| 考虑所有顶点| 无 | 0 | 25 | 25
 | 封面边缘 1-3 | 删除 1 或 3 | 候选人 1 | 6 | 19 | 19
 | 封面边缘 1-4 | 1 已删除 | 候选人不变| 6 | 19 | 19
 | 封面边缘 2-3 | 删除 2 或 3 | 候选人 1, 2 | 11 | 11 14 | 14
 | 最小切割 | 删除 1 和 2 | 1, 2 | 11 | 11 14 | 14

 这里实际的最小覆盖是特征 1 和 2，成本为 (6+5=11)，因此最大独立集具有权重 (25-11=14)，通过选择特征 3 和 4 获得。这个示例演示了为什么优化必须考虑整个冲突结构，而不是一次贪婪地处理一个边。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(V^2E)) Dinic 最坏情况 | (V=n+m+2\le202)，而 (E=O(n+m+k)\le10200) |
 | 空间| (O(V+E)) | 残差图存储每个网络边的两个方向 |

 该图的顶点数量很小，最多具有约 10,200 个前向边，因此即使是 Dinic 的一般最坏情况边界在这里也是实用的。 结构本身的特征和冲突的数量是线性的。 内存使用量也轻松低于 256 MB。 

## 测试用例```python
import sys
import io

class Dinic:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, cap):
        f = [v, cap, None]
        r = [u, 0, f]
        f[2] = r
        self.g[u].append(f)
        self.g[v].append(r)

    def bfs(self, s, t):
        level = [-1] * self.n
        level[s] = 0
        q = [s]
        head = 0

        while head < len(q):
            u = q[head]
            head += 1

            for v, cap, rev in self.g[u]:
                if cap > 0 and level[v] == -1:
                    level[v] = level[u] + 1
                    q.append(v)

        return level[t] != -1, level

    def dfs(self, u, t, pushed, level, it):
        if u == t:
            return pushed

        while it[u] < len(self.g[u]):
            edge = self.g[u][it[u]]
            v, cap, rev = edge

            if cap > 0 and level[v] == level[u] + 1:
                f = self.dfs(v, t, min(pushed, cap), level, it)
                if f:
                    edge[1] -= f
                    rev[1] += f
                    return f

            it[u] += 1

        return 0

    def max_flow(self, s, t):
        ans = 0
        INF = 10**30

        while True:
            ok, level = self.bfs(s, t)
            if not ok:
                break

            it = [0] * self.n

            while True:
                f = self.dfs(s, t, INF, level, it)
                if f == 0:
                    break
                ans += f

        return ans

def solve(data):
    pos = 0
    ans = []

    while pos < len(data):
        n, m = data[pos], data[pos + 1]
        pos += 2

        w = data[pos:pos + n + m]
        pos += n + m

        k = data[pos]
        pos += 1

        edges = []
        for _ in range(k):
            p, q = data[pos] - 1, data[pos + 1] - 1
            pos += 2
            edges.append((p, q))

        total = sum(w)
        s = n + m
        t = s + 1

        flow = Dinic(t + 1)

        for i in range(n):
            flow.add_edge(s, i, w[i])

        for i in range(n, n + m):
            flow.add_edge(i, t, w[i])

        inf = total + 1

        for p, q in edges:
            flow.add_edge(p, q, inf)

        ans.append(str(total - flow.max_flow(s, t)))

    return "\n".join(ans)

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    return solve(data)

sample1 = """\
2 2
4 3 8 2
3
1 3
1 4
2 4
"""
assert run(sample1) == "11", "sample 1"

minimum = """\
1 1
5 7
1
1 2
"""
assert run(minimum) == "7", "minimum-size case"

all_equal = """\
2 2
5 5 5 5
4
1 3
1 4
2 3
2 4
"""
assert run(all_equal) == "10", "all-equal complete bipartite graph"

boundary = """\
2 2
1 100 99 2
2
1 3
2 4
"""
assert run(boundary) == "199", "large boundary weight"

no_real_conflict_choice = """\
1 1
10000000 10000000
1
1 2
"""
assert run(no_real_conflict_choice) == "10000000", "maximum weight boundary"

max_size_input = "100 100\n" + " ".join(["1"] * 200) + "\n10000\n"
max_size_input += "".join(
    f"{i} {100 + j}\n"
    for i in range(1, 101)
    for j in range(1, 101)
)
assert run(max_size_input) == "100", "maximum-size dense graph"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 2 / 4 3 8 2 / 3 conflicts`|`11`| 提供样品和基本减少到最小切割 |
 |`1 1 / 5 7 / 1 conflict`|`7`| 最小图形尺寸和不对称权重 |
 |`2 2 / 5 5 5 5 / 4 conflicts`|`10`| 完全二部图且权重相等 |
 |`2 2 / 1 100 99 2 / 2 conflicts`|`199`| 体重差异大，独立决策|
 |`1 1 / 10000000 10000000 / 1 conflict`|`10000000`| 最大个人重量和容量处理|
 |`100 100 / 200 unit weights / 10000 conflicts`|`100`| 最大图尺寸和密集冲突集|

 最大尺寸测试使用所有可能的从左到右冲突，生成完整的 (K_{100,100})。 由于两个组中的每一对都存在冲突，因此无冲突选择可以仅包含一侧的顶点，权重为 100，因为所有 200 个顶点都具有单位权重。 此测试对于捕获意外遗漏某些边缘或使用不正确的特征索引边界的实现特别有用。 

## 边缘情况

 第一个边缘情况是权重不相等的单一冲突：```
1 1
5 7
1
1 2
```总权重为 12。网络包含从源到左顶点的容量为 5，从右顶点到汇点的容量为 7，冲突边容量为 13。最小割选择便宜的顶点进行删除，即权重为 5 的左顶点。最大独立集权重为 (12-5=7)。 总是删除正确端点的粗心实现会错误地返回 5。 

第二个边缘情况说明了为什么必须全局考虑冲突：```
2 2
6 5 7 7
3
1 3
1 4
2 3
```总权重为 25。选择特征 3 和 4 给出 14 并且不包含冲突。 相应的最小顶点覆盖的权重为 11，由特征 1 和 2 组成。因此，流值为 11，答案为 14。处理第一个冲突并立即删除本地更便宜的端点的贪心方法可能会做出与后续冲突产生不良交互的选择。 

第三种边缘情况是完全连接的二分图：```
2 2
5 5 5 5
4
1 3
1 4
2 3
2 4
```每个左边的特征都与每个右边的特征冲突。 因此，有效的选择只能使用一侧的顶点。 任一侧贡献 10，因此答案为 10。流网络的最小顶点覆盖权重为 10，补集的权重也为 10。这将检查该构造是否处理与每个顶点相关的多个冲突边。 

第四个边缘情况检查最大的有用容量规模：```
1 1
10000000 10000000
1
1 2
```总权重为20,000,000，因此冲突容量变为20,000,001。 最低限度的削减会花费 10,000,000 美元删除其中一个功能，而保留另一个功能。 答案是10,000,000。 使用`total + 1`因为无限容量就足够了，并且避免依赖硬编码的幻数。 

最终的边界情况是一个密集图，每边有 100 个顶点以及所有 10,000 个可能的冲突。 该算法添加每条冲突边，并且由于其容量超过总顶点权重，因此最小切割无法切割这些边中的任何一条。 相反，它必须选择整个面作为更便宜的顶点覆盖替代方案。 对于每个顶点的单位权重，最小覆盖成本为 100，最大独立集的权重也为 100。这会运用顶点和边计数的最大值，同时保留在较小实例上使用的相同数学不变量。
