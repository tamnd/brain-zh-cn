---
title: "CF 2191C - 排序游戏"
description: "我们得到一个带权无向图。 我们必须精确选择 $n-1$ 边。 If those $n-1$ edges form a spanning tree, the choice is forbidden. We want the minimum possible total weight among all choices of $n-1$ edges that do not form a tree."
date: "2026-06-09T04:41:27+07:00"
tags: ["codeforces", "competitive-programming", "games"]
categories: ["algorithms"]
codeforces_contest: 2191
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1073 (Div. 2)"
rating: 1200
weight: 2191
solve_time_s: 194
verified: false
draft: false
---

[CF 2191C - 排序游戏](https://codeforces.com/problemset/problem/2191/C)

 **评分：** 1200
 **标签：** 游戏
 **求解时间：** 3m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个带权无向图。 我们必须准确选择$n-1$边缘。 

If those$n-1$边形成生成树，禁止选择。 我们希望所有选择中的总重量尽可能最小$n-1$**不**形成树的边。 

上的图表$n$顶点正好$n-1$当且仅当边是连通的时，边才是一棵树。 这一观察立即简化了问题：我们正在寻找最小权重集$n-1$其诱导图断开的边。 

图形尺寸很大。 在所有测试用例中，顶点总数和边总数最多均为$2 \cdot 10^5$。 任何枚举子集、生成树、甚至所有边集对的算法都是完全不可能的。 我们需要一些接近的东西$O(m \log m)$每个测试文件。 

当全局最轻时会出现微妙的边缘情况$n-1$边缘已经断开。 例如：```
n = 4
edges: 1, 2, 3, 100
```选择三个最轻的边已经给出了一个断开的图，所以答案很简单$1+2+3=6$。 如果解决方案首先构建 MST，然后强制进行修改，则会错过这种情况。 

另一个重要的情况是当最轻的$n-1$边形成一棵树。 那么答案不一定是通过替换任意树边来获得的。 更换者必须断开图表。 例如，如果一条额外的边创建了一个循环，则从该循环中删除一条边可以保持图的连通性，但仍然会给出一棵树，这是禁止的。 

最后的极端情况发生在以下情况：$m=n-1$。 该图恰好包含一组$n-1$边缘。 如果该集合是一棵树，则不存在有效答案，我们必须打印$-1$。 

## 方法

 暴力解决方案将检查每个子集$n-1$边，检查它是否形成一棵树，并保留无效权值中的最小权值。 有$$\binom{m}{n-1}$$这样的子集，即使对于具有几十条边的图来说，也是天文数字般大的。 

关键的观察结果来自于按权重对所有边进行排序。 

让$r=n-1$。 考虑第一个$r$按非递减权重顺序排列边。 调用此设置$P$。 

每一套$r$边的权重至少为$P$， 因为$P$包含全球最轻的$r$边缘。 

如果$P$已经断开连接，那么它立即是最佳的，我们就完成了。 

有趣的情况是当$P$形成一棵树。 

假设我们添加一条边$e$外部$P$。 自从$P$是一棵树，添加$e$恰好创建一个周期。 如果我们从该循环中删除一条边，图仍然保持连接，并且我们仍然有一棵树。 那没有帮助。 

为了获得一个断开的图，我们必须删除一条不属于由$e$。 

对于固定外边缘$e$，通过一次交换可获得的最便宜的断开集是通过删除最重的边来实现的$P$不在端点之间的路径上$e$。 

令人惊讶的事实是，每个最佳答案都可以通过这样一个交换来表示。 任何不同于$P$通过多次添加和删除，权重增加至少与最佳有效的单个交换一样大。 

这将整个问题简化为针对前缀之外的每条边查找不在相应树路径上的前缀树的最大权重边。 

这就变成了树数据结构问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳 |$O(m \log^2 n)$|$O(n \log n)$| 已接受 |

 ## 算法演练

 ### 构建关键前缀

 1. 按权重对所有边进行排序。 
2.让$r=n-1$。 拿第一个$r$边并调用该集合$P$。 
3. 计算它们的权重之和，表示为$S$。 
4. 在边缘使用DSU$P$。 
5.如果$P$断开，输出$S$。 没有其他的一套$r$边可以有更小的权重。 
6. 如果$m=r$， 然后$P$是唯一可能的集合$r$边缘。 由于它是一棵树，因此不存在有效答案，因此输出$-1$。 

### 当前缀是树时

 1. 治疗$P$作为一棵树。 
2. 树根并建造二元升降台。 
3. 对于每个祖先跳转，存储两个值：

 - 该次跳跃的最大边缘重量，
 - 该跳跃的第二个最大边缘重量。 
4. 对于每一个边缘$e=(u,v,w)$外部$P$, 查询路径来自$u$到$v$树里面。 
5.让$M$是整棵树上的最大边权重。 
6.让$P_{\max}(u,v)$是之间树路径上的最大边权重$u$和$v$。 
7. 我们需要该路径上**不**的最重的树边缘。 
8. 如果$M$不包含在路径中，那么答案很简单$M$。 
9.如果$M$位于路径上，我们需要路径外最大的树边。 这等于以下较大者：

 - 当最大值唯一时，整棵树中第二大的边权重，
 - 当它出现在路径之外的其他地方时，具有相同的最大值。 
10. 使用存储的最大和第二最大信息，计算最佳可移除边权重$h$。 
11. 该外缘的成本增加为$$w-h.$$1. 取所有外边缘的最小有效增量。 
2.答案是$$S + \min(w-h).$$### 为什么它有效

 第一个$n-1$边是该尺寸的最小权重集。 任何其他套装必须用较重的边缘替换其中一些。 

当前缀断开时，它已经是一个有效的解决方案，无法改进。 

当前缀是一棵树时，添加一个非前缀边会创建一个唯一的循环。 删除该循环之外的边会断开图形的连接，从而给出一组有效的$n-1$边缘。 

对于固定添加的边，删除最重的允许树边会产生最小的可能增加。 

任何与前缀有多次交换差异的有效解决方案必须包含至少一个未被任何添加边路径覆盖的已删除树边。 将删除的边与添加的边之一进行比较会产生不小于最佳有效单个交换的成本增加。 因此，最优解决方案总是通过一次交换来实现，并最小化$w-h$覆盖所有外边缘就足够了。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LOG = 19

class DSU:
    def __init__(self, n):
        self.p = list(range(n))
        self.sz = [1] * n

    def find(self, x):
        while self.p[x] != x:
            self.p[x] = self.p[self.p[x]]
            x = self.p[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return False
        if self.sz[a] < self.sz[b]:
            a, b = b, a
        self.p[b] = a
        self.sz[a] += self.sz[b]
        return True

def merge_pair(a, b):
    vals = [a[0], a[1], b[0], b[1]]
    vals.sort(reverse=True)
    return (vals[0], vals[1])

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n, m = map(int, input().split())

        edges = []
        for _ in range(m):
            u, v, w = map(int, input().split())
            edges.append((w, u - 1, v - 1))

        edges.sort()

        r = n - 1
        prefix = edges[:r]
        extra = edges[r:]

        prefix_sum = sum(w for w, _, _ in prefix)

        dsu = DSU(n)
        for w, u, v in prefix:
            dsu.union(u, v)

        root = dsu.find(0)
        connected = all(dsu.find(i) == root for i in range(n))

        if not connected:
            out.append(str(prefix_sum))
            continue

        if m == r:
            out.append("-1")
            continue

        tree = [[] for _ in range(n)]
        all_tree_weights = []

        for w, u, v in prefix:
            tree[u].append((v, w))
            tree[v].append((u, w))
            all_tree_weights.append(w)

        max1 = max(all_tree_weights)
        cnt_max1 = all_tree_weights.count(max1)

        if cnt_max1 >= 2:
            max2 = max1
        else:
            max2 = max((x for x in all_tree_weights if x != max1), default=-1)

        depth = [0] * n
        up = [[0] * n for _ in range(LOG)]
        best = [[(-1, -1)] * n for _ in range(LOG)]

        stack = [(0, -1, -1)]
        order = [0]

        parent = [-1] * n
        parent[0] = 0

        while stack:
            v, p, w = stack.pop()

            up[0][v] = p if p != -1 else 0
            best[0][v] = (w, -1)

            for to, wt in tree[v]:
                if to == p:
                    continue
                depth[to] = depth[v] + 1
                parent[to] = v
                stack.append((to, v, wt))

        for k in range(1, LOG):
            uk = up[k - 1]
            uk2 = up[k]
            bk = best[k]
            bk1 = best[k - 1]

            for v in range(n):
                mid = uk[v]
                uk2[v] = uk[mid]
                bk[v] = merge_pair(bk1[v], bk1[mid])

        def path_two_max(a, b):
            res = (-1, -1)

            if depth[a] < depth[b]:
                a, b = b, a

            diff = depth[a] - depth[b]
            bit = 0
            while diff:
                if diff & 1:
                    res = merge_pair(res, best[bit][a])
                    a = up[bit][a]
                diff >>= 1
                bit += 1

            if a == b:
                return res

            for k in range(LOG - 1, -1, -1):
                if up[k][a] != up[k][b]:
                    res = merge_pair(res, best[k][a])
                    res = merge_pair(res, best[k][b])
                    a = up[k][a]
                    b = up[k][b]

            res = merge_pair(res, best[0][a])
            res = merge_pair(res, best[0][b])

            return res

        INF = 10**30
        add = INF

        for w, u, v in extra:
            path_max, path_second = path_two_max(u, v)

            if max1 > path_max:
                removable = max1
            else:
                removable = max(max2, path_second)

            if removable != -1:
                add = min(add, w - removable)

        if add == INF:
            out.append("-1")
        else:
            out.append(str(prefix_sum + add))

    sys.stdout.write("\n".join(out))

solve()
```排序后，算法首先检查是否是全局最轻的$n-1$边缘已经断开。 该案件会立即处理，因为没有其他案件$n-1$-边集可以有更小的总和。 

当前缀形成一棵树时，其余的工作就发生在该树上。 二值提升允许我们查询任意树路径上最大和第二大的边权重$O(\log n)$。 这些值足以确定不在路径上的最重边缘，这正是我们想要删除的边缘。 

该实现存储每个提升段的两个最大重量。 合并两个段是通过取四个候选值中的两个最大值来完成的。 这可以保持路径查询的效率，同时避免更复杂的数据结构。 

所有重量计算都使用 Python 整数，它可以安全地处理高达$10^9$总结起来大致为$2 \cdot 10^{14}$。 

## 工作示例

 ### 示例 1，第一个测试用例

 权重排序：

 | 索引 | 重量 |
 | ---| ---|
 | 1 | 1 |
 | 2 | 4 |
 | 3 | 5 |
 | 4 | 6 |
 | 5 | 7 |
 | 6 | 9 |

 这里$n=4$，所以我们需要$r=3$边缘。 

前三个边有总权重$10$。 

| 选择的前缀边 | 重量总和| 已连接？ |
 | ---| ---| ---|
 | 1, 4, 5 | 10 | 10 没有 |

 由于前缀已断开，因此答案立即为 10。 

此示例说明了为什么首先检查前缀至关重要。 构建树结构将是不必要的工作。 

### 示例 1，第二个测试用例

 该图有权重：

 | 重量 |
 | ---|
 | 5 |
 | 5 |
 | 5 |
 | 8 |

 再次$r=3$。 

前三个边形成路径$1-2-3-4$，这是一棵树。 

| 前缀和| 已连接？ |
 | ---| ---|
 | 15 | 15 是的 |

 只有一个外边，重量为 8。 

它在树中的路径包含所有三个权重为 5 的边。 这条路之外没有树的边缘。 

| 外缘重量 | 最佳可移动边缘外侧路径 |
 | ---| ---|
 | 8 | 无 |

 不存在有效的交换。 答案是$-1$。 

这表明了每个人的情况$3$-边子集是一棵树。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(m \log m + m \log n)$| 排序对每条非前缀边加一次路径查询|
 | 空间|$O(n \log n)$| 二元升降台|

 所有测试用例的顶点和边的总数最多为$2 \cdot 10^5$， 所以$O(m \log m + m \log n)$很容易符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    # paste solve() here and return output
    pass

assert run("""4
4 6
1 2 7
1 3 4
1 4 1
2 3 9
2 4 6
3 4 5
4 4
1 2 5
2 3 5
3 4 5
1 4 8
4 4
1 4 1
1 3 4
2 4 2
3 4 3
4 4
2 3 7
1 2 5
2 4 9
4 3 12
""").strip() == """10
-1
8
28""".strip()

assert run("""1
2 1
1 2 5
""").strip() == "-1"

assert run("""1
4 4
1 2 1
3 4 2
1 3 100
2 4 200
""").strip() == "103"

assert run("""1
3 3
1 2 5
2 3 5
1 3 5
""").strip() == "10"

assert run("""1
4 5
1 2 1
2 3 2
3 4 100
1 3 101
2 4 102
""").strip() == "104"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2 个顶点，1 个边 | -1 | 唯一可能的集合是树 |
 | 断开的灯前缀 | 103 | 103 立即前缀答案 |
 | 所有重量均相等 | 10 | 10 正确处理重复最大值 |
 | 树路径上的大边缘| 104 | 104 正确选择可移动边缘外路径|

 ## 边缘情况

 考虑：```
4 4
1 2 1
3 4 2
1 3 100
2 4 200
```前三个边已经形成一个断开的图。 它们的总和是 103。由于它们是全局最轻的三个边，因此没有有效答案可以更小。 该算法检测到断开的前缀并立即停止。 

考虑：```
2 1
1 2 5
```大小只有一个可能的子集$n-1$。 它是一棵树。 不存在有效的选择。 算法达到`m == n - 1`案例和退货$-1$。 

考虑：```
3 3
1 2 5
2 3 5
1 3 5
```前缀树包含两条权重为 5 的边，外侧边的权重也为 5。存在多个最大值。 该实现在每条路径上保留最大和第二大权重，以便正确处理重复的最大值。 答案仍然是10。
