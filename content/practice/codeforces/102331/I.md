---
title: "CF 102331I - 交互式顶点"
description: "我们得到一棵最多有 (200,000) 个顶点的树。 在这棵树的某处有一个隐藏的特殊顶点 (u)。 我们知道整棵树，但不知道 (u)，我们必须通过交互式查询来发现它。 查询选择一个顶点 (x) 和一组顶点 (V)。"
date: "2026-08-13T03:43:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102331
codeforces_index: "I"
codeforces_contest_name: "2019 Summer Petrozavodsk Camp, Day 2: 300iq Contest 2 (XX Open Cup, Grand Prix of Kazan)"
rating: 0
weight: 102331
solve_time_s: 180
verified: true
draft: false
---

[CF 102331I - 交互式顶点](https://codeforces.com/problemset/problem/102331/I)

 **评级：** -
 **标签：** -
 **求解时间：** 3m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵最多有 (200,000) 个顶点的树。 在这棵树的某处有一个隐藏的特殊顶点 (u)。 我们知道整棵树，但不知道 (u)，我们必须通过交互式查询来发现它。 

查询选择一个顶点 (x) 和一组顶点 (V)。 交互者回答是否

 [
 \运算符名称{dist}(u,x)\leq \运算符名称{dist}(u,v)
 ]

 对于每个 (v\in V)。 换句话说，当 (x) 距离隐藏顶点不比查询集中的每个顶点更远时，答案就是 1。 在整个交互过程中，树和隐藏顶点保持固定。 官方协议最多允许(4\lceil\log_2 n\rceil)个查询。 

输入由 (n) 组成，后跟 (n-1) 条树边。 没有普通的离线输出，因为每个查询的答案都来自交互器。 一旦确定了隐藏顶点，我们就打印`! u`。 

(200,000) 的大小界限排除了树大小的任何二次方。 在最坏的情况下，即使 (O(n^2)) 也意味着大约 (4\cdot10^{10}) 次操作，远远超出了两秒的限制。 更巧妙的是，(O(n\log n)) 预处理算法是完全合理的，而交互式查询的数量有其自己更严格的对数界限。 因此，该解决方案必须将线性或近线性树处理与仔细平衡的查询序列结合起来。 

有几种简单的边界情况可能会破坏粗心的实现。 考虑尽可能最小的树，```
2
1 2
```具有隐藏顶点 (u=2)。 以顶点 1 为中心且查询集中有顶点 2 的查询必须回答 0，因为 (\operatorname{dist}(2,2)=0<1=\operatorname{dist}(2,1))。 如果实现假设质心始终具有至少两个相邻组件，则此处可能会失败。 

星号是另一个有用的边缘情况。 为了```
5
1 2
1 3
1 4
1 5
```如果隐藏顶点为 1，则针对所有四个邻居查询 (x=1) 将返回 1。每个邻居距隐藏顶点的距离为 1，而 (x) 本身的距离为 0。仅将查询解释为选择子组件之一的解决方案将错过质心本身就是答案的可能性。 

相反的情况也很重要。 在同一颗星中，如果 (u=2)，查询顶点 1 的四个邻居返回 0，因为顶点 2 本身在查询的顶点之中，并且与 (u) 的距离为 0，而顶点 1 的距离为 1。粗心的解决方案可能会颠倒答案的含义并继续进入错误的组件。 

最后，路径可以有一个质心，其两侧具有非常不同的结构。 例如，```
7
1 2
2 3
3 4
4 5
5 6
6 7
```具有平衡的中心区域，但在去除质心后，两个候选组件本身就是路径。 该算法必须重新计算幸存组件内的质心，而不是继续使用原始的求根。 

## 方法

 最简单的策略是逐个测试顶点。 对于候选 (x)，针对每个其他顶点查询 (x)。 当 (x=u) 时，答案恰好为 1，因为如果 (x=u)，其距离为零，并且每个其他顶点都处于非负距离，而如果 (x\neq u)，在查询集中包含 (u)，则答案为 0。这种方法是正确的，但可能需要 (n-1) 次查询。 最大 (n=200,000) 时，即 (199,999) 个查询，而允许的限制仅为 (4\lceil\log_2 200000\rceil=72)。 因此，问题不在于查询内的计算工作，而在于我们从每次交互中提取的信息量。 

关键的观察是当 (x) 与查询集中的每个顶点相邻时会发生什么。 假设 (c) 是某个顶点，(v) 是它的邻居之一。 删除 (c) 会将树分成多个组件，每个组件包含每个邻居。 如果隐藏顶点 (u) 位于包含 (v) 的分量中，则从 (u) 到 (c) 的路径从边 (v-c) 开始。 因此，

 [
 \操作符名称{距离}(u,v)=\操作符名称{距离}(u,c)-1。 
]

 因此，当隐藏顶点位于相应组件之一中时，使用 (x=c) 和相邻顶点集合 (v_1,\ldots,v_k) 的查询精确地返回 0。 如果它位于所有这些组件之外，则每个查询的邻居都是通过 (c) 距离更远的一条边，因此答案为 1。这会将不寻常的距离比较转换为对树组件并集的直接成员资格测试。 标准溶液使用相同的核心观察结果。 

下一个问题是如何选择(c)。 我们使用当前候选组件的质心。 删除质心后，组件最多包含当前顶点的一半。 这给了我们一个自然缩小的搜索空间。 

如果我们简单地根据相邻组件的数量对它们进行二分搜索，那么当一个组件包含的顶点比另一个组件多得多时，我们仍然可能做得很糟糕。 相反，我们执行加权二分搜索，其中每个组件都按其顶点数进行加权。 在每次分割中，我们选择总权重最平衡的两侧的前缀。 然后交互器告诉我们哪一边包含 (u)。 这是竞赛教程中描述的加权搜索。 

质心查询本身需要一次交互。 如果返回 1，则质心就是答案。 否则，隐藏顶点位于其中一个组件中。 加权二分搜索识别该组件。 我们将质心标记为已删除，并在幸存的组件内重复相同的过程。 由于每个阶段都会大大减少可能的顶点数量，因此查询总数在所需的 (4\lceil\log_2 n\rceil) 范围内保持对数。 

暴力方法在各个顶点上进行查询。 最佳方法是使用树的分隔符将一个查询转换为有关整个连接组件的语句。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n)) 查询，(O(n^2)) 如果简单地重新计算距离 | (O(n)) | (O(n)) | 查询太多 |
 | 最佳| (O(n\log n)) 树处理，(O(\log n)) 查询 | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 从整棵树开始作为候选组件。 维持一个`blocked`大批。 被阻塞的顶点已经被用作质心，并且永远不会属于未来的候选组件。 
2. 找到当前未阻塞组件的质心 (c)。 我们通过迭代树遍历来完成此操作，因为如果使用递归 DFS，则具有 (200,000) 个顶点的路径会溢出 Python 的递归堆栈。 
3. 考虑(c) 的每个无阻塞邻居(v)。 删除 (c) 会为每个此类邻居创建一个候选组件。 将每个组件及其邻居的大小存储在一起。 由于 (c) 是质心，因此每个这样的分量最多包含当前候选顶点的一半。 
4. 针对所有这些相邻顶点查询 (c)。 如果答案是1，(u=c)。 事实上，如果 (u=c)，则 (\operatorname{dist}(u,c)=0)，所以条件为真。 如果 (u) 位于邻居 (v) 的任何分量中，则 (v) 是比 (c) 更接近 (u) 的一条边，从而使条件为假。 这个单一查询准确地检测质心。 
5. 如果答案为 0，则按候选组件的大小对候选组件进行排序。 维持成分指数的区间。 选择一个前缀，使其总大小和剩余后缀大小中的较大者最小化。 针对属于该前缀的邻居顶点查询质心。 
6. 如果答案为0，则隐藏顶点属于所选前缀，因此丢弃后缀。 如果答案为1，则隐藏顶点属于后缀，因此丢弃前缀。 重复这一过程，直到只剩下一个组件。 
7. 将质心标记为已阻塞，并将唯一幸存的组件作为新的候选组件。 由于树是连接的，因此该组件可以简单地通过其幸存邻居及其已知大小来表示。 
8. 当候选组件有一个顶点时，该顶点必然是隐藏顶点。 打印并冲洗。 

中心不变量是每次查询后，隐藏顶点保留在当前候选组件内。 质心查询通过终止于质心或证明隐藏顶点位于其中一个组件中来保留此不变量。 然后，每个加权二元查询恰好选择必须包含隐藏顶点的一侧。 一旦质心被移除，幸存的一侧就是原始候选树的实际连通分量，因此相同的推理递归地适用。 加权分割持续足够快地缩小候选集以达到对数查询范围。 官方的解决方案遵循这种质心加加权二分搜索结构。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    g = [[] for _ in range(n + 1)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        g[u].append(v)
        g[v].append(u)

    blocked = [False] * (n + 1)
    parent = [0] * (n + 1)
    size = [0] * (n + 1)

    def ask(x, vertices):
        print("?", len(vertices), x, *vertices, flush=True)
        return int(input())

    def find_centroid(start):
        order = [start]
        parent[start] = 0

        for v in order:
            pv = parent[v]
            for to in g[v]:
                if blocked[to] or to == pv:
                    continue
                parent[to] = v
                order.append(to)

        total = len(order)

        for v in order:
            size[v] = 1

        for v in reversed(order):
            p = parent[v]
            if p:
                size[p] += size[v]

        centroid = start
        for v in order:
            largest = total - size[v]

            for to in g[v]:
                if blocked[to]:
                    continue
                if parent[to] == v:
                    if size[to] > largest:
                        largest = size[to]

            if largest * 2 <= total:
                centroid = v
                break

        return centroid, total

    current = 1
    current_size = n

    while current_size > 1:
        centroid, total = find_centroid(current)

        parts = []

        for to in g[centroid]:
            if blocked[to]:
                continue

            if parent[to] == centroid:
                part_size = size[to]
            else:
                part_size = total - size[centroid]

            parts.append((part_size, to))

        parts.sort()

        # If the centroid itself is the hidden vertex, the answer is 1.
        all_neighbors = [v for _, v in parts]
        if ask(centroid, all_neighbors):
            print("!", centroid, flush=True)
            return

        left = 0
        right = len(parts) - 1

        while left < right:
            total_weight = 0
            for i in range(left, right + 1):
                total_weight += parts[i][0]

            best_mid = left
            best_balance = 10**30
            prefix = 0

            for i in range(left, right + 1):
                prefix += parts[i][0]
                balance = max(prefix, total_weight - prefix)

                if balance < best_balance:
                    best_balance = balance
                    best_mid = i

            chosen = [parts[i][1] for i in range(left, best_mid + 1)]

            if ask(centroid, chosen):
                left = best_mid + 1
            else:
                right = best_mid

        next_vertex = parts[left][1]
        next_size = parts[left][0]

        blocked[centroid] = True
        current = next_vertex
        current_size = next_size

    print("!", current, flush=True)

if __name__ == "__main__":
    solve()
```输入阶段完全像往常一样构建无向树。 没有多个测试用例，因为此交互式问题每次调用描述一棵树。 官方协议同样以单个 (n) 及其 (n-1) 边开始。 

这`ask`函数故意很小。 它只打印一个查询行，刷新一次，然后立即读取交互器的答案。 该语句明确要求在 Python 中的每个查询后进行刷新。`find_centroid`使用迭代遍历。 第一遍收集当前未阻塞组件的所有顶点并记录它们的父级。 反向传递计算子树大小。 对于顶点 (v)，通过删除它创建的最大组件是 (v) 上面的部分，其大小`total - size[v]`，或其子子树之一。 每个此类组件的大小最多为一半的第一个顶点是质心。 

当质心不是临时遍历的根时，它的邻居之一就是它的父节点。 对于该邻居，其组件具有大小`total - size[centroid]`。 对于每个子邻居，组件大小很简单`size[to]`。 这就是代码需要来自质心搜索的父信息的原因。 

这`parts`列出商店`(component_size, neighbor)`将它们配对并按组件大小排序。 单个查询的正确性不需要排序，但它是给出所需查询范围的加权二分搜索策略的一部分。 查询顶点是邻居本身，而不是其组件深处的任意顶点。 这就是临界距离属性。 

循环`while left < right`是加权二分查找。 它的边界是索引`parts`，而不是顶点数。 每次回答后，间隔的一侧都会被丢弃。 最后剩下的邻居标识了唯一可以包含 (u) 的组件。 

Python 整数具有任意精度，因此组件大小算术中不存在整数溢出问题。 该实现还避免了递归 DFS，这是对形状像具有 (200,000) 个顶点的链的树的实际要求。 

## 工作示例

 ### 示例 1

 该树是一颗以顶点 1 为中心的星形树，交互器对第一个查询回答 1。 

| 步骤| 候选人尺寸| 质心| 询问邻居| 回答 | 新状态 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 5 | 1 | 2、3、4、5 | 1 | 答案 = 1 |

 答案就是顶点 1。这说明了为什么在尝试选择其组件之一之前必须检查质心本身。 官方示例正是使用了这种单查询交互。 

### 示例 2

 树是同一颗星，但隐藏顶点为 2。官方示例提供了四个零响应，尽管交互式解决方案允许提出不同的有效查询。 我们的加权分割可能会使用不同的序列，同时仍到达顶点 2。 

| 步骤| 候选人尺寸| 质心| 查询的顶点 | 回答 | 新状态|
 | --- | --- | --- | --- | --- | --- |
 | 1 | 5 | 1 | 2、3、4、5 | 0 | (u) 在一个叶子组件中 |
 | 2 | 4 | 1 | 2, 3 | 0 | (u) 位于组件 2 |
 | 3 | 1 | 1 | 2 | 0 | 组件 2 幸存 |

 最后幸存的组件是包含顶点 2 的单例，因此程序打印`! 2`。 示例的转录本包含不同的有效分区序列，这对于交互式问题来说是正常的，因为确切的查询顺序不是唯一规定的。 官方样本确认最终答案为2。 

这两个示例中重要的不变量是，对质心邻居的查询的零答案意味着隐藏顶点位于这些邻居的组件之一中。 该算法永远不需要计算到隐藏顶点本身的距离。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n)) | 每个质心阶段扫描其当前组件，并且每个顶点仅属于 (O(\log n)) 质心级别 |
 | 空间| (O(n)) | (O(n)) | 邻接表和辅助数组均使用线性空间 |
 | 查询 | (O(\log n)) | 质心检查和加权二分搜索查询以几何方式缩小候选空间 |

 最大树大小为 (200,000)，因此线性大小数组和 (O(n\log n)) 预处理完全符合 512 MiB 内存限制。 交互部分是要求更严格的。 该问题允许 (4\lceil\log_2 n\rceil) 个查询，最多只有 72 个查询 (n)。 质心和加权搜索结构是专门为保持在对数预算内而设计的。 

## 测试用例

 一个普通的`run(input) == output`harness 无法忠实地测试这个问题，因为输出取决于交互器生成的响应。 相反，有用的本地测试是确定性判断模拟器：它选择一个隐藏顶点，根据实际树距离计算每个查询的答案，并检查算法最终是否识别该顶点。 

以下工具反映了离线算法。 它还记录了查询次数，因此可以直接测试对数交互界限。```python
# Offline simulator for the interactive algorithm.
# It does not replace the interactive submission above.

def simulate(n, edges, hidden):
    g = [[] for _ in range(n + 1)]
    for u, v in edges:
        g[u].append(v)
        g[v].append(u)

    blocked = [False] * (n + 1)
    parent = [0] * (n + 1)
    size = [0] * (n + 1)
    queries = 0

    def distances_from_hidden():
        dist = [-1] * (n + 1)
        dist[hidden] = 0
        q = [hidden]

        for v in q:
            for to in g[v]:
                if dist[to] == -1:
                    dist[to] = dist[v] + 1
                    q.append(to)

        return dist

    dist = distances_from_hidden()

    def ask(x, vertices):
        nonlocal queries
        queries += 1
        return all(dist[v] >= dist[x] for v in vertices)

    def find_centroid(start):
        order = [start]
        parent[start] = 0

        for v in order:
            pv = parent[v]
            for to in g[v]:
                if blocked[to] or to == pv:
                    continue
                parent[to] = v
                order.append(to)

        total = len(order)

        for v in order:
            size[v] = 1

        for v in reversed(order):
            p = parent[v]
            if p:
                size[p] += size[v]

        for v in order:
            largest = total - size[v]

            for to in g[v]:
                if blocked[to]:
                    continue
                if parent[to] == v:
                    largest = max(largest, size[to])

            if largest * 2 <= total:
                return v, total

        raise AssertionError("centroid not found")

    current = 1
    current_size = n

    while current_size > 1:
        centroid, total = find_centroid(current)

        parts = []

        for to in g[centroid]:
            if blocked[to]:
                continue

            if parent[to] == centroid:
                part_size = size[to]
            else:
                part_size = total - size[centroid]

            parts.append((part_size, to))

        parts.sort()

        if ask(centroid, [v for _, v in parts]):
            answer = centroid
            assert answer == hidden
            assert queries <= 4 * ((n - 1).bit_length())
            return answer, queries

        left = 0
        right = len(parts) - 1

        while left < right:
            total_weight = sum(parts[i][0] for i in range(left, right + 1))

            best_mid = left
            best_balance = 10**30
            prefix = 0

            for i in range(left, right + 1):
                prefix += parts[i][0]
                balance = max(prefix, total_weight - prefix)

                if balance < best_balance:
                    best_balance = balance
                    best_mid = i

            chosen = [parts[i][1] for i in range(left, best_mid + 1)]

            if ask(centroid, chosen):
                left = best_mid + 1
            else:
                right = best_mid

        current = parts[left][1]
        current_size = parts[left][0]
        blocked[centroid] = True

    assert current == hidden
    assert queries <= 4 * ((n - 1).bit_length())
    return current, queries

# Sample 1
edges = [(1, 2), (1, 3), (1, 4), (1, 5)]
assert simulate(5, edges, 1)[0] == 1

# Sample 2
assert simulate(5, edges, 2)[0] == 2

# Minimum-size tree, hidden at the endpoint.
edges = [(1, 2)]
assert simulate(2, edges, 2)[0] == 2

# Equal-size components around a centroid.
edges = [
    (1, 2), (1, 3), (1, 4),
    (1, 5), (1, 6), (1, 7)
]
assert simulate(7, edges, 6)[0] == 6

# Long path, hidden at the boundary.
edges = [(i, i + 1) for i in range(1, 15)]
assert simulate(15, edges, 15)[0] == 15

# Maximum-size star, all components initially have equal size.
n = 200000
edges = [(1, i) for i in range(2, n + 1)]
answer, queries = simulate(n, edges, n)
assert answer == n
assert queries <= 4 * ((n - 1).bit_length())
```最大尺寸测试故意成为一颗星，因为它强调大量相同尺寸的组件，并检查加权二分搜索不会意外地在度数上变成线性。 模拟器还会检查正式的查询预算，这对于此交互式问题比比较固定的输出字符串更有用。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 带有隐藏顶点 1 的示例 1 星 | 1 | 质心本身就是答案 |
 | 具有隐藏顶点 2 的示例 2 星 | 2 | 零质心查询后的组件选择 |
 | (2)-顶点树，隐藏顶点2 | 2 | 最小尺寸边界情况 |
 | 七顶点星，隐藏顶点6 | 6 | 相同的组件大小和加权分割 |
 | 十五顶点路径，隐藏顶点 15 | 15 | 15 原始生根和边界目标严重不平衡|
 | (200,000)-顶点星形，隐藏顶点(200,000) | (200,000) | 最大大小和查询计数限制 |

 ## 边缘情况

 对于二顶点树```
2
1 2
```唯一可能的质心是任一顶点。 假设算法从顶点 1 开始。它唯一未阻塞的邻居是 2，因此第一个查询相当于询问顶点 2 是否至少与顶点 1 一样接近隐藏顶点。如果 (u=2)，则答案为 0，幸存组件为单例`{2}`。 跳过下一次迭代，因为它的大小已经是 1，并且程序打印`! 2`。 没有关于有多个孩子的假设。 

为了明星```
5
1 2
1 3
1 4
1 5
```对于(u=1)，顶点1是质心，查询使用邻居2、3、4和5。它们到(u)的距离都是1，而(u)到质心的距离是0，所以答案是1。算法立即打印`! 1`。 这正是第一个官方样本所代表的情况。 

对于 (u=2) 的同一颗星，质心查询返回 0，因为查询的顶点 2 与隐藏顶点的距离为 0，而质心的距离为 1。然后，该算法将四个叶子组件视为四个加权候选，每个大小为 1。平衡分割可以询问两个叶子，收到 0，因为叶子 2 在其中，然后将间隔缩小到剩余的相关候选。 最终只剩下分量 2，所以答案是`! 2`。 官方示例使用四个查询来得出相同的答案。 

对于长路径，例如```
7
1 2
2 3
3 4
4 5
5 6
6 7
```整棵树的质心为顶点 4。如果隐藏顶点为 7，则第一次质心查询返回 0。只有包含 5 的分量才能包含目标，其大小为 3。然后顶点 4 被阻塞，算法找到剩余路径 5-6-7 的质心，即 6。同样的距离比较识别出包含 7 的分量。继续搜索，直到孤立 7。 要点是每次归约后都会重新计算质心，而不是将原始树的根视为永久的。 

最大度数的情况是一颗大星。 去除中心后的每个组件的大小均为 1，因此排序后所有权重相等。 然后，加权搜索的行为就像叶子上的普通二分搜索一样，只需要对数数量的交互。 这正是那种公开了意外地逐个扫描叶子的实现的树。 

最后一个实现陷阱是递归 DFS。 具有 (200,000) 个顶点的路径可以创建接近 (200,000) 的递归深度，即使算法本身是正确的，这在 Python 中也是不安全的。 提交的实现使用显式列表作为遍历堆栈，因此输入树的深度不会影响Python的调用堆栈。
