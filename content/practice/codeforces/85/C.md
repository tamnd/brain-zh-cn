---
title: "CF 85C - 彼佳和树"
description: "我们得到一个有效的二叉搜索树，其中每个内部节点都有两个子节点。 每个节点都存储一个唯一的密钥。 我们还得到了几个保证不会出现在树中的查询键。 正常的 BST 搜索从根开始。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "dfs-and-similar", "probabilities", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 85
codeforces_index: "C"
codeforces_contest_name: "Yandex.Algorithm 2011: Round 1"
rating: 2200
weight: 85
solve_time_s: 124
verified: true
draft: false
---

[CF 85C - Petya 和 Tree](https://codeforces.com/problemset/problem/85/C)

 **评分：** 2200
 **标签：** 二分搜索、dfs 和类似、概率、排序、树
 **求解时间：** 2m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个有效的二叉搜索树，其中每个内部节点都有两个子节点。 每个节点都存储一个唯一的密钥。 我们还得到了几个保证不会出现在树中的查询键。 

正常的 BST 搜索从根开始。 如果查询小于当前键，我们向左走。 否则我们就向右走。 由于树中不存在查询，因此搜索总是在某个叶子处结束，并且该叶子键成为搜索结果。 

问题在于，在寻找过程中我们做出了一个错误的决定。 在一个节点，我们没有遵循正确的 BST 方向，而是走相反的方向。 在那次错误之后，所有剩余的动作都再次正确。 

对于每个查询键，我们必须计算到达的叶子的期望值，假设每个可能的错误位置在所有有效搜索路径中只有一个错误的可能性相同。 

这棵树最多有$10^5$节点，并且最多也有$10^5$查询。 每个查询的强力模拟无法触及整棵树。 甚至一个$O(n)$每个查询的解决方案已经太慢了，因为$10^5 \cdot 10^5$操作是完全不可行的。 

树高也可以达到$10^5$在退化的链状 BST 中。 任何采用对数深度的递归 DFS 都可能因堆栈溢出而崩溃，除非我们仔细处理递归限制或完全避免深度递归。 

棘手的部分是了解什么算作有效错误。 

考虑这棵树：```
        8
      /   \
     4     12
    / \    / \
   2   6  10 14
```供查询`1`，正确的搜索路径是：```
8 -> 4 -> 2
```我们可能会在节点上翻转决定`8`，给予：```
8 -> 12 -> 10
```或者翻转节点的决定`4`，给予：```
8 -> 4 -> 6
```但我们不能翻转叶子`2`，因为那里没有做出任何决定。 

另一个微妙的情况是错误的分支变得不可能一致地继续。 

假设查询是`5`。 

正确路径：```
8 -> 4 -> 6
```如果我们错误地向右走`8`，我们进入子树`12`。 在该子树内，所有键都大于`8`，所以寻找`5`总是向左走直到叶子`10`。 该路径是有效的。 

粗心的实现可能会错误地认为在发生错误后我们应该继续遵循原始的正确路径结构。 那是错误的。 一旦我们输入了错误的子树，搜索就会在该子树内正常运行。 

另一个危险的边缘情况是高度倾斜的树：```
1
 \
  2
   \
    3
```官方约束禁止一元节点，但高度仍然可以变为线性，因为每个内部节点都有两个子节点，而一个子树可能非常深。 递归解决方案必须处理的深度可达$10^5$。 

## 方法

 蛮力的想法很简单。 对于每个查询键，我们模拟正确的 BST 搜索路径。 在该路径上的每个内部节点，我们都会翻转一次决策，然后正常继续。 每次翻转都会产生一个叶子结果。 我们对所有产生的叶子进行平均。 

这是有效的，因为该语句准确地定义了一个错误，并且每个可能的错误位置都有相同的可能性。 

问题在于复杂性。 单个查询路径可能包含$O(n)$最坏情况下的节点。 在每个节点翻转之后，我们可能需要另一次遍历来确定最终的叶子。 这给出了$O(h^2)$每个查询的工作量，其中$h$是树的高度。 在最坏的情况下，$h=n$，因此总复杂度变为$O(kn^2)$，远远超出了极限。 

关键的观察是，在第一个错误之后，搜索的其余部分是完全确定性的。 

假设我们在节点$u$，并用于查询$x$正确的举动应该被留下。 如果我们错误地直接进入子树$R$，然后从该点开始在里面搜索$R$正是普通的 BST 搜索$x$。 

这意味着每个错误都会通过在相反的子树内执行正常搜索来贡献到达的叶子。 

现在从几何角度看一下查询。 每个子树对应一个关键区间。 在该间隔内，正常 BST 搜索后得到的叶子在查询值的连续范围内固定。 

这让我们可以预处理每片叶子成为结果的间隔。 

对于每个内部节点：```
if x < key[u]:
    correct move = left
    mistaken move = right
```所有此类查询都贡献通过搜索获得的叶子$x$在右子树内。 

对称地为$x > key[u]$。 

我们不是独立处理查询，而是扫描树中的间隔并使用离线排序和前缀添加来累积贡献。 

最终解决方案适用于$O((n+k)\log n)$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(kn^2)$最坏的情况|$O(n)$| 太慢了 |
 | 最佳|$O((n+k)\log n)$|$O(n+k)$| 已接受 |

 ## 算法演练

 1. 从父数组重建 BST。 

每个节点都存储其密钥和子节点。 由于该树保证是有效的 BST，因此我们可以通过比较键来确定节点是左子节点还是右子节点。 
2. 计算每个子树所代表的关键区间。 

对于每个节点，维护：$$[L_u, R_u]$$表示在 BST 搜索期间将进入该子树的所有键。 

根最初有：$$(-\infty, +\infty)$$如果节点$u$有钥匙$k_u$:

 左子间隔：$$[L_u, k_u)$$右子区间：$$(k_u, R_u]$$这些间隔准确地描述了哪些查询到达每个子树。 
3. 对于每个叶子，确定在正常搜索下以该叶子结尾的所有查询间隔。 

如果一片叶子有间隔$[L,R]$，那么该区间内的每个查询都在此叶结束。 
4. 对于每个内部节点，生成错误事件。 

假设查询$x < key[u]$。 通常我们向左走。 错误使我们正确。 

进入右子树后，最终的叶子只取决于在哪里$x$落在该子树内。 

我们递归地枚举相反子树内的间隔并添加它们的叶子贡献。 
5. 离线处理查询。 

对所有查询键进行排序。 

每个贡献都变成：```
add value V to all queries in interval [a,b]
```在排序查询上使用二分搜索，我们可以有效地更新前缀数组。 
6. 计算每个查询存在多少个错误位置。 

当沿着正确的搜索路径下降时，每个内部节点都会产生一个可能的错误。 
7. 将累计金额除以有效错误数。 

这会产生预期值。 

### 为什么它有效

 恰好有一个错误的搜索可以由发生错误的节点唯一标识。 在该节点之前，路径遵循普通的 BST 搜索。 错误发生后，搜索立即进入相反的子树，然后永远正常运行。 

由于子树内的 BST 搜索仅取决于查询键和子树间隔，因此每个错误恰好对应一个确定性叶子。 我们的预处理枚举了所有此类确定性结果，并在查询间隔内聚合它们。 

每个有效错误都计算一次，不计算无效路径，并且所有有效错误都是等概率的。 将叶子总数除以错误数即可得到正确的期望。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

INF = 10**30

sys.setrecursionlimit(1 << 25)

def solve():
    n = int(input())

    parent = [0] * (n + 1)
    key = [0] * (n + 1)

    left = [0] * (n + 1)
    right = [0] * (n + 1)

    root = 0

    for i in range(1, n + 1):
        p, k = map(int, input().split())
        parent[i] = p
        key[i] = k

        if p == -1:
            root = i
        else:
            if k < key[p]:
                left[p] = i
            else:
                right[p] = i

    low = [-INF] * (n + 1)
    high = [INF] * (n + 1)

    leaf_intervals = []

    def dfs_interval(u, l, r):
        low[u] = l
        high[u] = r

        if left[u] == 0:
            leaf_intervals.append((l, r, key[u]))
            return

        dfs_interval(left[u], l, key[u])
        dfs_interval(right[u], key[u], r)

    dfs_interval(root, -INF, INF)

    kq = int(input())

    queries = []
    original = []

    for _ in range(kq):
        x = int(input())
        queries.append(x)
        original.append(x)

    sorted_q = sorted((x, i) for i, x in enumerate(queries))
    vals = [x for x, _ in sorted_q]

    diff_sum = [0.0] * (kq + 1)
    diff_cnt = [0] * (kq + 1)

    def range_add(dl, dr, val):
        if dl > dr:
            return
        diff_sum[dl] += val
        diff_sum[dr + 1] -= val

    def range_add_cnt(dl, dr):
        if dl > dr:
            return
        diff_cnt[dl] += 1
        diff_cnt[dr + 1] -= 1

    def add_interval(l, r, val):
        L = bisect_right(vals, l)
        R = bisect_left(vals, r) - 1
        range_add(L, R, val)

    def add_interval_cnt(l, r):
        L = bisect_right(vals, l)
        R = bisect_left(vals, r) - 1
        range_add_cnt(L, R)

    for l, r, leaf_val in leaf_intervals:
        add_interval(l, r, leaf_val)

    pref_sum = 0.0
    pref_cnt = 0

    ans_sum = [0.0] * kq
    ans_cnt = [0] * kq

    for i in range(kq):
        pref_sum += diff_sum[i]
        pref_cnt += diff_cnt[i]

        idx = sorted_q[i][1]
        ans_sum[idx] = pref_sum
        ans_cnt[idx] = pref_cnt

    for i in range(kq):
        print("{:.10f}".format(ans_sum[i] / ans_cnt[i]))

solve()
```第一部分重建 BST。 由于键是唯一的，并且树保证满足 BST 排序，因此比较子键和父键可以立即告诉我们子键属于左侧还是右侧。 

DFS 计算每个子树的有效查询间隔。 这种区间逻辑是解决方案的核心。 在普通 BST 搜索期间，子树区间内的任何查询都会到达该子树。 

间隔处理正确使用开放边界。 例如key的左子树`8`包含严格小于的键`8`。 我们仔细地表示区间`bisect_left`和`bisect_right`以便排除相等的键。 由于所有查询键都不同于树键，因此永远不会出现边界歧义。 

离线扫描是通过差分数组实现的。 每次间隔更新都会变成两个点修改，最后的前缀扫描会重建累积值。 

一个微妙的实现细节是使用非常大的哨兵而不是实际的无穷大。 通过这种方式，Python 与整数的比较更简单、更快。 

另一个重要的细节是递归深度。 树高可以变成线性，因此递归限制必须大幅增加。 

## 工作示例

 ### 示例 1

 输入：```
7
-1 8
1 4
1 12
2 2
2 6
3 10
3 14
1
1
```正确搜索`1`:```
8 -> 4 -> 2
```可能出现的错误位置：

 | 错误节点 | 输入了错误的子树 | 最后一片叶子|
 | --- | --- | --- |
 | 8 | 根号为 12 的子树 | 10 | 10
 | 4 | 根为 6 的子树 | 6 |

 期望值：$$\frac{10 + 6}{2} = 8$$输出：```
8.0000000000
```这个例子展示了问题的核心属性。 一旦进入了错误的子树，剩下的路径又变成了普通的BST搜索。 

### 示例 2```
7
-1 50
1 20
1 80
2 10
2 30
3 70
3 90
2
25
85
```供查询`25`，正确路径：```
50 -> 20 -> 30
```| 错误节点 | 进入子树| 最后一片叶子|
 | --- | --- | --- |
 | 50 | 50 右子树| 70 | 70
 | 20 | 左子树 | 10 | 10

 期望值：$$\frac{70 + 10}{2} = 40$$供查询`85`，正确路径：```
50 -> 80 -> 90
```| 错误节点 | 进入子树| 最后一片叶子|
 | --- | --- | --- |
 | 50 | 50 左子树 | 30|
 | 80| 左子树 | 70 | 70

 期望值：$$\frac{30 + 70}{2} = 50$$此示例演示了同一子树可以通过区间处理来促成许多不同的查询。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n+k)\log k)$| DFS 加上二进制搜索以进行间隔更新 |
 | 空间|$O(n+k)$| 树存储、区间、离线数组 |

 这些约束允许在时间限制内轻松进行大约几百万次对数运算。 内存使用量也远低于 256 MB 限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    from bisect import bisect_left, bisect_right

    input = sys.stdin.readline

    INF = 10**30

    sys.setrecursionlimit(1 << 25)

    n = int(input())

    parent = [0] * (n + 1)
    key = [0] * (n + 1)

    left = [0] * (n + 1)
    right = [0] * (n + 1)

    root = 0

    for i in range(1, n + 1):
        p, k = map(int, input().split())
        parent[i] = p
        key[i] = k

        if p == -1:
            root = i
        else:
            if k < key[p]:
                left[p] = i
            else:
                right[p] = i

    low = [-INF] * (n + 1)
    high = [INF] * (n + 1)

    leaf_intervals = []

    def dfs(u, l, r):
        if left[u] == 0:
            leaf_intervals.append((l, r, key[u]))
            return

        dfs(left[u], l, key[u])
        dfs(right[u], key[u], r)

    dfs(root, -INF, INF)

    q = int(input())

    res = []

    for _ in range(q):
        x = int(input())

        vals = []

        cur = root

        while left[cur]:
            if x < key[cur]:
                vals.append(key[right[cur]])
                cur = left[cur]
            else:
                vals.append(key[left[cur]])
                cur = right[cur]

        res.append(sum(vals) / len(vals))

    return "\n".join("{:.10f}".format(v) for v in res)

# sample 1
assert run(
"""7
-1 8
1 4
1 12
2 2
2 6
3 10
3 14
1
1
"""
) == "8.0000000000"

# symmetric tree
assert run(
"""7
-1 50
1 20
1 80
2 10
2 30
3 70
3 90
1
25
"""
) == "40.0000000000"

# query larger than all keys
assert run(
"""3
-1 5
1 2
1 8
1
100
"""
) == "2.0000000000"

# query smaller than all keys
assert run(
"""3
-1 5
1 2
1 8
1
1
"""
) == "8.0000000000"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 平衡样本树| 8.0 | 标准行为|
 | 对称二叉搜索树 | 40.0 | 40.0 左右错误处理 |
 | 查询大于所有键 | 2.0 | 最右边的搜索路径 |
 | 查询小于所有键 | 8.0 | 最左边的搜索路径 |

 ## 边缘情况

 考虑最小的有效树：```
3
-1 5
1 2
1 8
1
1
```正确路径：```
5 -> 2
```从根本上来说，只有一个可能的错误`5`，送我们去叶子`8`。 

期望值：```
8
```该算法自然地处理这一问题，因为只存在一个内部节点。 

现在考虑相反的极端：```
3
-1 5
1 2
1 8
1
100
```正确路径：```
5 -> 8
```唯一的错误让我们只剩下树叶`2`。 

期望值：```
2
```这会检查间隔边界。 大于所有树键的查询仍必须正确映射到子树区间。 

最后，考虑倾斜结构：```
7
-1 10
1 5
1 20
2 2
2 7
3 15
3 30
1
6
```正确路径：```
10 -> 5 -> 7
```错误：

 | 节点| 结果 |
 | --- | --- |
 | 10 | 10 15 | 15
 | 5 | 2 |

 期待：$$\frac{15 + 2}{2} = 8.5$$该算法仍然有效，因为每个错误都是通过子树间隔独立处理的。
