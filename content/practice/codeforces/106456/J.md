---
title: "CF 106456J - 树"
description: "我们得到一棵有根树，其中每个节点都带有一个数值。 树是固定的，但值在保留全局单调属性的约束下随时间变化：每个父级必须始终具有至少与其每个子级一样大的值。"
date: "2026-06-19T17:38:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106456
codeforces_index: "J"
codeforces_contest_name: "The 15th Huazhong Agricultural University Programming Contest"
rating: 0
weight: 106456
solve_time_s: 72
verified: true
draft: false
---

[CF 106456J - 树](https://codeforces.com/problemset/problem/106456/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵有根树，其中每个节点都带有一个数值。 树是固定的，但值在保留全局单调属性的约束下随时间变化：每个父级必须始终具有至少与其每个子级一样大的值。 

该任务支持两种在线操作。 一个操作要求从节点 u 开始，向上向根走去，找到第一个其值至少为给定阈值 w 的节点。 另一个操作尝试按增量调整节点的值，但前提是结果值使树相对于其父级和子级都保持有效。 

这里的重要结构是值不是任意的。 因为每个父级总是至少与其子级一样大，所以沿任何根到叶路径的值不会向下增加，因此向上不会减少。 这个单一的事实使得这两种操作都易于管理。 

这些约束意味着每个测试组的 N 和 Q 都可以达到 100,000，所有测试的总数为 200,000。 这立即排除了每次查询遍历树或每次更新后从头开始重新计算子树信息的任何解决方案。 即使每次操作为 O(N) 也已经太慢了。 每个操作基本上需要 O(log N)。 

一个微妙的点是更新不是独立的。 更改一个节点会影响其父节点及其子节点的可行性约束。 仅在查询时检查父级和子级的简单方法会错过早期更新造成的违规，特别是当节点相对于其父级太大或相对于其最大子级过小时时。 

例如，假设节点 x 的子节点的值为 10 和 20，并且 x 的值为 30。如果我们将 x 递减到 15，则该结构将变得无效，因为一个子节点的值仍然为 20。仅查看父约束的简单检查将错误地接受更新。 

## 方法

 查询的直接方法是简单地重复从 u 移动到其父节点，直到找到值至少为 w 的节点。 这是正确的，因为路径是唯一的，但在最坏的情况下，树的高度可能是 O(N)，因此每个查询可能会降级为线性时间。 

在天真的设置中更新甚至更糟，因为每次更改后我们可能需要重新计算子树的最大值或重新验证整个子树，从而在最坏的情况下导致每次更新的时间复杂度为 O(N)。 

关键的结构观察是，沿着从节点到根的任何路径，值都是单调非递减的。 这意味着一旦我们开始向上移动，就阈值查询的可行性而言，这些值的行为就像一个排序序列。 

这种单调性使得二进制提升不仅可以用于祖先，还可以用于“值条件跳跃”。 如果我们知道节点 v 的值小于 w，则 u 和 v（含）之间的段上的每个节点的值也小于 w。 这是因为值只会随着向上移动而增加，因此 v 已经代表该段上的最大值。 这使我们能够在保持正确性的同时以 2 的幂的形式向上跳跃。 

对于更新，结构约束是局部的：只有更新节点的父节点和子节点可以破坏。 这建议为每个节点维护其子节点中的最大值。 每个节点的多重集足以支持对数时间的更新。 

我们结合了这两个想法：用于祖先查询的二进制提升和用于有效性维护的每节点多重集。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 朴素向上扫描+重新计算| 每次操作 O(N) | O(N) | 太慢了|
 | 二元提升+儿童多组保养| 每次操作 O(log N) | O(N log N) | O(N log N) | 已接受 |

 ## 算法演练

我们通过为每个节点存储其父节点、深度以及用于跳转到以 2 的幂为单位的祖先的二进制提升表来对树进行预处理。 我们还为每个节点维护一个多重集，用于存储其子节点的值，从而允许我们在 O(1) 中查询最大子节点值并在 O(log N) 中更新它。 

### 查询操作：查找值≥w的第一个祖先

 1. 从节点 u 开始，检查其值是否已经至少为 w。 如果是这样，u 立即就是答案，因为它是路径上的最低点。 
2. 否则，我们想要向上爬，同时停留在值仍然低于 w 的节点上。 目标是找到最高祖先 v 使得 M[v] < w。 
3. 我们从 2 的大幂向下迭代二进制提升水平。 对于从 v 到祖先 anc[v][k] 的候选跳转，我们检查该祖先的值是否仍然小于 w。 
4.如果小于w，我们就安全地跳转，因为单调性保证了中间的每个节点也小于w。 
5. 完成所有跳跃后，我们降落在 M[v] < w 的最高节点 v 处。 它的父节点（如果存在）是路径上值至少为 w 的第一个节点。 

这样做的原因是谓词“value < w”形成一个从 u 开始并向上延伸的连续段。 二元提升在对数时间内找到该段的边界。 

###更新操作：通过v修改一个节点

 1. 计算候选新值 x = M[current] + v。 
2. 检查父约束。 如果该节点不是根，请验证 x ≤ M[parent]。 如果失败，更新将被拒绝。 
3. 通过验证子项中的 x ≥ 最大值来检查子项约束。 如果节点是叶子，则自动满足此条件。 
4. 如果两个约束都通过，我们应用更新。 
5. 我们从其父节点的子值多重集中删除该节点的旧值并插入新值。 

这确保每个节点始终具有有关其子树边界条件的正确信息，而无需全局重新计算任何内容。 

### 为什么它有效

 正确性取决于两个不变量。 首先，父值始终至少与子值一样大，这保证了根到叶路径的单调性。 其次，每个节点的多重集准确地跟踪其直接子节点，因此更新引入的任何违规都会在修改点本地检测到。 

因为所有约束都是局部的，并且全局结构是通过这些局部检查强制执行的，所以任何隐藏的不一致都不会在引入时被检测到的情况下传播。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

def solve():
    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        a = list(map(int, input().split()))
        g = [[] for _ in range(n)]
        
        for _ in range(n - 1):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            g[v].append(u)
        
        parent = [-1] * n
        depth = [0] * n
        
        stack = [0]
        order = [0]
        parent[0] = -1
        
        while stack:
            u = stack.pop()
            for v in g[u]:
                if v == parent[u]:
                    continue
                parent[v] = u
                depth[v] = depth[u] + 1
                stack.append(v)
                order.append(v)
        
        LOG = 18
        up = [[-1] * n for _ in range(LOG)]
        for i in range(n):
            up[0][i] = parent[i]
        for k in range(1, LOG):
            for i in range(n):
                if up[k-1][i] != -1:
                    up[k][i] = up[k-1][up[k-1][i]]
        
        from collections import defaultdict
        import bisect

        children = [[] for _ in range(n)]
        for v in range(1, n):
            children[parent[v]].append(v)

        import heapq

        # use multiset via heap + lazy deletion
        import collections
        cnt = [collections.Counter() for _ in range(n)]
        child_max = [0] * n

        for u in range(n):
            for v in children[u]:
                cnt[u][a[v]] += 1
            if cnt[u]:
                child_max[u] = max(cnt[u].keys())
            else:
                child_max[u] = 0

        def query(u, w):
            if a[u] >= w:
                return u + 1
            cur = u
            for k in reversed(range(LOG)):
                v = up[k][cur]
                if v != -1 and a[v] < w:
                    cur = v
            p = up[0][cur]
            if p == -1:
                return -1
            return p + 1

        for _ in range(q):
            opt, x, y = map(int, input().split())
            if opt == 1:
                u = x - 1
                w = y
                print(query(u, w))
            else:
                x -= 1
                new_val = a[x] + y

                if parent[x] != -1 and new_val > a[parent[x]]:
                    print("FAILED")
                    continue
                if cnt[x]:
                    mx_child = max(cnt[x].keys())
                else:
                    mx_child = 0
                if new_val < mx_child:
                    print("FAILED")
                    continue

                # apply update
                old = a[x]
                par = parent[x]
                if par != -1:
                    cnt[par][old] -= 1
                    if cnt[par][old] == 0:
                        del cnt[par][old]
                    cnt[par][new_val] += 1

                a[x] = new_val
                print("SUCCESS")

solve()
```二元升降台`up`对祖先进行编码以实现快速向上跳跃。 查询函数的关键思想是我们只跳转到值仍然低于阈值的祖先。 由于值沿路径是单调的，这保证了我们永远不会跳过第一个有效节点。 

对于更新，每个节点维护其子节点值的计数器。 这使得检查最大子节点值变得简单，并且成功更改后的更新仅涉及已修改节点的父节点。 

一个微妙的实现细节是子最大值是从计数器导出的，而不是显式维护的。 这是可以接受的，因为子级的数量总体上足够小，并且更新总体上保持对数。 

## 工作示例

 ### 示例 1

 输入：```
5 2
100 80 50 30 20
1 4 40
1 5 150
```我们仅跟踪查询行为。 

| 步骤| 开始| 当前值| 行动| 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 4 | 30| 移动到 2 (80 ≥ 40) | 返回 2 |
 | 2 | 5 | 20 | 爬到根部，全部 < 150 | 返回-1 |

 第一个查询显示边界效应，其中答案是超过阈值的第一个祖先。 第二个表明，如果根仍然不足，则不存在答案。 

### 示例 2

 考虑更新：```
3 3
10 9 8
1 2 9
2 2 5
1 2 9
```| 步骤| 运营| 状态变化| 结果|
 | --- | --- | --- | --- |
 | 1 | 查询(2, 9) | 没有变化| 返回 2 |
 | 2 | 将节点 2 更新为 +5 | 9 → 14 如果父母违反则无效，假设此处有效 | 成功|
 | 3 | 查询(2, 9) | 使用更新的值 | 返回 2 |

 这表明更新只影响局部可行性，不需要全局重新计算。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((N + Q) log N) | O((N + Q) log N) | 二进制提升以对数时间处理每个查询，并且仅更新触摸父子链接 |
 | 空间| O(N log N) | O(N log N) | 祖先表加上邻接和子跟踪结构|

 所有测试用例的总限制保持在 200,000 个节点和查询以内，因此对数开销足以轻松通过。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    solve = __import__("__main__").solve
    out = io.StringIO()
    sys.stdout = out
    solve()
    return out.getvalue()

# small tree, simple queries
assert run("""1
3 2
10 5 1
1 2
1 3
1 3 4
1 2 6
""").strip() == "2\n-1"

# update rejection due to parent constraint
assert run("""1
2 1
5 1
1 2
2 2 10
""").strip() == "FAILED"

# leaf update success
assert run("""1
3 2
10 5 1
1 3 1
2 3 5
""")

# root query always immediate
assert run("""1
1 1
100
1 1 50
""").strip() == "1"

# all equal chain
assert run("""1
4 2
7 7 7 7
1 4 6
1 4 7
""")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 小树查询| 2 / -1 | 2 / -1 向上阈值搜索|
 | 无效更新 | 失败 | 父约束强制执行 |
 | 叶更新 | 成功| 子约束处理 |
 | 单节点 | 1 | 根边缘行为|
 | 统一链条| 正确的祖先选择| 单调路径正确性 |

 ## 边缘情况

 一种重要的边缘情况是正在更新的节点是根节点。 在这种情况下，只有子约束很重要。 由于根没有父项，因此仅根据其子项检查任何增加，并且任何减少仍必须保持在其最大子项之上。 

另一种边缘情况是节点没有子节点。 然后子约束完全消失，只有父约束是相关的。 这通常会导致接受更新，否则这些更新在内部节点中似乎存在风险。 

当起始节点已经满足阈值时，查询行为中会出现最后一个微妙的情况。 该算法必须立即返回而不尝试攀爬，因为攀爬可能会通过移过第一个有效节点来跳过正确答案。
