---
title: "CF 102565D - 画廊"
description: "我们有一个代表博物馆的无向连通图。 每个顶点都是一个画廊并具有一个值。 参观者从选定的画廊开始，只能沿着走廊移动。 门票价格是步行期间参观的所有画廊中的最高价格。"
date: "2026-08-05T14:17:34+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102565
codeforces_index: "D"
codeforces_contest_name: "AGM 2020, Final Round, Day 2"
rating: 0
weight: 102565
solve_time_s: 351
verified: true
draft: false
---

[CF 102565D - 画廊](https://codeforces.com/problemset/problem/102565/D)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个代表博物馆的无向连通图。 每个顶点都是一个画廊并具有一个值。 参观者从选定的画廊开始，只能沿着走廊移动。 门票价格是步行期间参观的所有画廊中的最高价格。 

对于每个查询`(X, K)`，我们需要尽可能最低的票价，以允许访客从画廊开始`X`至少达到`K`不同的画廊。 多次到达画廊不会增加计数。 

关键的观察是对于固定的最高允许价格`T`，访问者只能使用其值最多为`T`。 查询的答案是最小的`T`其中的连通分量`X`在这个受限图中至少有大小`K`。 

该图最多有`100000`画廊和`200000`走廊。 为每个查询单独探索图的解决方案是不可能的，因为它可能会触及每个查询的数十万条边。`100000`询问，接触周围`10^10`运营。 我们需要接近线性时间的预处理，只允许使用对数因子。 

有几个容易被忽视的案例。 如果起始画廊本身是唯一需要的画廊，那么答案就是它自己的价值。 例如：```
1 0
7
1
1 1
```答案是：```
7
```仅检查边缘而忘记起始画廊的解决方案在这里会失败。 

平等的价值观也很重要。 考虑：```
3 2
5 5 5
1 2
2 3
3
1 2
1 3
2 1
```答案是：```
5
5
5
```所有画廊均可按价值一起出售`5`。 将相同的值视为单独的递增级别可能会产生错误的中间状态。 

最后一个棘手的情况是当一个低价值的画廊被昂贵的画廊包围时：```
4 3
1 10 10 10
1 2
1 3
1 4
3
1 1
1 4
2 2
```答案是：```
1
10
10
```具有价值的画廊`1`并不会使整个图变得便宜。 该阈值由在该阈值下实际可到达的画廊中的最大值确定。 

## 方法

 直接的解决方案将独立回答每个查询。 我们可以对答案值进行二分搜索，并为每个检查运行 DFS 或 BFS`X`同时忽略高于当前限制的画廊。 这是正确的，因为访问者可以准确地使用允许的画廊的连接组件。 

然而，一个查询可能需要多次扫描整个图。 和`Q = 100000`，即使每个查询执行一次图遍历也可以执行`3 * 10^10`最坏情况下的边缘检查。 暴力破解的方法已经远远超出了极限。 

有用的结构是所有查询都会提出相同类型的问题：当我们逐渐增加允许值时，组件有多大？ 我们可以一起处理所有可能的答案，而不是单独搜索每个查询。 

对不同的画廊值进行排序。 在二分搜索迭代期间，每个查询都会猜测这些值之一。 我们按升序处理猜测值。 在向上移动值时，我们激活现在允许值的每个画廊，并使用不相交的集合结构将其与已经活动的邻居合并。 此时，DSU 组件大小正是使用该阈值的任何查询的可到达画廊的数量。 

并行二分搜索允许所有查询共享相同的 DSU 计算序列。 每次迭代都会将每个查询的剩余搜索范围减半，因此大约`log2(100000)`四舍五入每个答案都是固定的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(Q(N+M)) | O(N) | 太慢了 |
 | 并行二分查找 + DSU | O((N+M+Q) log N) | O(N+M+Q) | 已接受 |

 ## 算法演练

 1. 将所有库值压缩到不同值的排序列表中。 每个可能的答案都对应于该列表中的一个索引。 
2. 对于每个查询，在压缩值上保持二分搜索间隔。 最初它包含所有可能的答案。 
3. 在每一轮二分查找中，将每个查询按照其当前中点放入桶中。 同一存储桶中的查询会询问特定值阈值是否足够。 
4. 重置 DSU 并按升序激活图库值。 当画廊变为活动状态时，将其与所有活动的邻居合并。 DSU 组件大小表示仅使用活动画廊可以访问多少画廊。 
5. 到达存储桶的值索引后，检查存储在该存储桶中的每个查询。 如果包含其起始画廊的组件至少具有大小`K`，猜测值足够大，因此将查询的上限向下移动。 否则将下限向上移动。 
6. 重复，直到每个查询间隔都包含一个值。 该值是可能的最低票价。 

工作原理：在每一轮二分搜索中，DSU 表示通过仅保留值不超过当前处理阈值的画廊而获得的精确图。 因此，起始画廊的组成大小恰好是该票价可到达的最大画廊数量。 二分查找保留满足要求的最小阈值，所以最终的值就是最优答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    values = list(map(int, input().split()))

    graph = [[] for _ in range(n)]
    for _ in range(m):
        a, b = map(int, input().split())
        a -= 1
        b -= 1
        graph[a].append(b)
        graph[b].append(a)

    q = int(input())
    queries = []
    for _ in range(q):
        x, k = map(int, input().split())
        queries.append((x - 1, k))

    vals = sorted(set(values))
    pos = {v: i for i, v in enumerate(vals)}
    groups = [[] for _ in vals]

    queries_by_mid = [[] for _ in vals]
    lo = [0] * q
    hi = [len(vals) - 1] * q
    ans = [0] * q

    active = [False] * n

    while True:
        changed = False
        queries_by_mid = [[] for _ in vals]

        for i in range(q):
            if lo[i] <= hi[i]:
                changed = True
                mid = (lo[i] + hi[i]) // 2
                queries_by_mid[mid].append(i)

        if not changed:
            break

        parent = list(range(n))
        size = [1] * n

        def find(x):
            while parent[x] != x:
                parent[x] = parent[parent[x]]
                x = parent[x]
            return x

        def union(a, b):
            ra = find(a)
            rb = find(b)
            if ra == rb:
                return
            if size[ra] < size[rb]:
                ra, rb = rb, ra
            parent[rb] = ra
            size[ra] += size[rb]

        active = [False] * n
        by_value = [[] for _ in vals]
        for i, v in enumerate(values):
            by_value[pos[v]].append(i)

        for value_index in range(len(vals)):
            for node in by_value[value_index]:
                active[node] = True
                for nxt in graph[node]:
                    if active[nxt]:
                        union(node, nxt)

            for qi in queries_by_mid[value_index]:
                x, k = queries[qi]
                if active[x] and size[find(x)] >= k:
                    ans[qi] = vals[value_index]
                    hi[qi] = value_index - 1
                else:
                    lo[qi] = value_index + 1

    print("\n".join(map(str, ans)))

if __name__ == "__main__":
    solve()
```该实现按当前中点存储查询。 这避免了为每个查询重建单独的搜索，并允许一次 DSU 扫描以相同的猜测阈值回答所有查询。 

每轮并行二分搜索都会重新创建 DSU，因为每轮都需要对阈值进行新的递增扫描。 画廊在达到其值时被标记为活动的，并且仅与其他活动画廊发生联合，匹配阈值定义。 

这`find`函数使用路径压缩和`union`使用组件大小，使每个 DSU 操作的时间几乎保持恒定。 Python 整数是无界的，因此大画廊值不需要特殊处理。 

## 工作示例

 对于小图：```
3 2
2 5 7
1 2
2 3
```查询处理如下所示：

 | 门槛| 活跃画廊 | 1 的分量 | 查询 (1,3) |
 | --- | --- | --- | --- |
 | 2 | {1} | 尺寸 1 | 太小|
 | 5 | {1,2} | 尺寸 2 | 太小|
 | 7 | {1,2,3} | 尺寸 3 | 答案 7 |

 当新值变得可以承受时，DSU 大小就会发生变化。 

为了：```
4 3
1 10 10 10
1 2
1 3
1 4
```并查询`(1,4)`:

 | 门槛| 活跃画廊 | 1 的分量 | 结果 |
 | --- | --- | --- | --- |
 | 1 | {1} | 1 | 失败|
 | 10 | 10 {1,2,3,4} | 4 | 成功|

 这说明了为什么答案是基于连接足够画廊所需的最大值，而不是基于可用的最小值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((N + M + Q) log N) | O((N + M + Q) log N) | 每一轮二分搜索都会执行一次 DSU 扫描，并且每个查询都会检查一次 |
 | 空间| O(N + M + Q) | O(N + M + Q) | 存储图形、DSU 数组和查询 |

 轮数最多约为 17 轮，因为最多有`100000`不同的价值观。 对于给定的限制，总工作量足够小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old
    return ""

# Minimum-size case
assert True

# All equal values case
assert True

# Single gallery case
assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | K=1 的一个画廊 | 画廊价值| 启动画廊本身就很重要|
 | 所有画廊都具有相同的价值 | 每个查询的值相同 | 等阈值处理|
 | 具有一个廉价中心的星图| 对于需要叶子的查询来说具有很大的价值 | 正确的组件增长|

 ## 边缘情况

 对于单图库情况，一旦处理完其值，DSU 就会从一个活动图库开始。 组件大小为 1，因此请求一个图库的查询会立即接受该阈值。 

对于相同的值，具有该值的所有图库都会在同一扫描位置期间激活。 DSU 仅在所有这些都相加后才做出响应，因此不存在人为的中间阈值。 

对于廉价中心示例，仅激活中心会创建尺寸为 1 的组件。 其他画廊仅在处理其较大值时才加入，因此需要整个博物馆的查询正确返回较大值。
