---
title: "CF 1949C - 一年一度的蚂蚁聚会"
description: "树的每个顶点最初只包含一只蚂蚁。 移动选择一条边 $(u,v)$ 并命令当前聚集在 $u$ 的所有蚂蚁移动到 $v$。 仅当目的地已经包含至少与来源一样多的蚂蚁时，蚂蚁才会服从。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1949
codeforces_index: "C"
codeforces_contest_name: "European Championship 2024 - Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 1900
weight: 1949
solve_time_s: 288
verified: true
draft: false
---

[CF 1949C - 一年一度的蚂蚁聚会](https://codeforces.com/problemset/problem/1949/C)

 **评级：** 1900
 **标签：** dfs 和类似的、dp、贪婪、树木
 **求解时间：** 4m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 树的每个顶点最初只包含一只蚂蚁。 

一步棋选择优势$(u,v)$并命令当前聚集的所有蚂蚁$u$搬到$v$。 仅当目的地已经包含至少与来源一样多的蚂蚁时，蚂蚁才会服从。 如果发生搬迁，该小组将在$u$消失并且它的蚂蚁被添加到$v$。 

问题是是否存在某种有效的移动序列最终聚集所有$n$蚂蚁进入单个顶点。 

输入是一棵树，最多有$200\,000$顶点。 二次或偶数$O(n \sqrt n)$这种规模的解决方案已经很危险了。 我们需要接近线性时间的东西，可能带有来自排序的对数因子。 

棘手的部分是可行性不仅仅由子树大小决定。 合并的顺序很重要。 如果从最小到最大处理多个相邻组件，则节点可能能够吸收它们，但如果必须过早吸收大组件，则失败。 

一个常见的错误是只关注组件的最终尺寸。 考虑：```
1 - 2 - 3 - 4
```如果我们尝试在顶点 2 处收集所有内容，则右侧组件的大小为 2。顶点 2 开始时只有一只蚂蚁，因此它无法立即吸收该组件。 正确的策略是首先吸收顶点 1，将顶点 2 处的计数增加到 2，然后才吸收大小为 2 的分量。 任何忽略合并顺序的解决方案都会给出错误的答案。 

另一个微妙的情况是明星：```
    2
    |
3 - 1 - 4
```答案是`YES`。 顶点 1 可以逐个吸收每个叶子，因为每个叶子的大小均为 1。诸如“中心必须至少与每个相邻组件一样大”之类的天真的规则会错误地拒绝这种情况。 

最小的输入也值得检查：```
1
```答案是`YES`，因为所有的蚂蚁都已经聚集了。 

## 方法

 一个蛮力的想法是尝试将每个顶点作为交汇点并显式模拟所有可能的合并顺序。 对于固定根，每个相邻组件只有在内部聚集后才能合并，因此我们需要探索许多可能的顺序。 状态数量呈指数级增长，很久以前就变得完全不可行$n=200000$。 

关键的观察结果是，一旦组件成功聚集到其附着顶点，只有一个数字很重要：它的大小。 

假设一个顶点想要吸收具有大小的相邻组件$$s_1,s_2,\dots,s_k.$$顶点从一只蚂蚁开始。 如果我们按升序处理组件，则该顺序始终是最佳的。 尽早吸收较小的成分只会有所帮助。 

排序后，让尺寸为$$s_1 \le s_2 \le \dots \le s_k.$$当且仅当在每次吸收之前当前的蚂蚁数量足够大时，合并就会成功。 

如果处理前的当前金额$s_i$是$$1 + \sum_{j<i} s_j,$$那么我们需要$$s_i \le 1 + \sum_{j<i} s_j.$$这个条件完全表征了一个顶点是否可以聚集所有相邻的分量。 

现在查看每个有向边$u \to v$。 去除边缘。 侧面含有$u$是一个组件。 定义有向 DP 状态：

 如果整个组件可以聚集成，则状态有效$u$。 

有效性$u \to v$仅取决于附加到的相邻组件的有效性和大小$u$，不包括包含的边$v$。 

这就把问题变成了树上重新定位 DP 的问题。 

剩下的挑战是有效地检查每个可能排除的邻居的排序大小条件。 对每条边的直接重新计算将是二次的。 关键的优化是针对每个顶点预先计算从排序列表中删除任何一个邻居的效果。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 蛮力 | 指数| 指数| 太慢了|
 | 最佳重新root DP |$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 ### 组件尺寸的预计算

 对于每个有向边，我们需要移除该边后该侧组件的大小。 

树的根位于顶点 1。 

对于一个孩子$v$的$u$，元件尺寸$v \to u$简直就是`sub[v]`。 

对于相反方向$u \to v$，尺寸为`n - sub[v]`。 

### 根据大小计算合并可行性

 对于已排序的序列$$b_1 \le b_2 \le \dots \le b_m,$$定义$$d_i = b_i - \sum_{j<i} b_j.$$合并条件等价于$$\max_i d_i \le 1.$$这直接源于要求每次吸收之前当前的蚂蚁数量足够大。 

### 有效地移除一个邻居

 对于一个顶点，让其相邻组件的大小进行排序。 

如果我们删除位置上的元素$k$，然后每个后面的前缀和减少$b_k$。 

对于之后的指数$k$,$$d_i' = d_i + b_k.$$使用原始的前缀和后缀最大值$d_i$，我们可以计算出$O(1)$排除任何特定邻居后合并条件是否仍然有效。 

### 自下而上的DP

 1. 以顶点 1 为树根并计算子树大小。 
2. 对于每个顶点，对所有事件分量的大小进行排序并预计算：

 1.所有邻居是否可以合并。 
2.是否可以合并除特定邻居之外的所有邻居。 
3. 以逆DFS顺序处理顶点。 
4.让`down[u]`表示有向状态的有效性$u \to parent(u)$。 
5.`down[u]`在以下情况下为真：

 1. 每个子状态`down[child]`是真的。 
2、排除父方后，满足大小条件。 

### 自上而下的DP

 1.让`up[u]`表示有效性$parent(u) \to u$。 
2. 从根向下遍历顶点。 
3. 对于每个顶点，计算有多少个传入的有向状态无效。 
4. 顶点可以是最终聚集点当且仅当：

 1. 所有传入的状态均有效。 
2. 使用所有相邻组件的尺寸条件有效。 
5. 计算`up[child]`，从无效计数中排除该子项的传入状态，并使用预先计算的大小条件结果来排除该子项。 

### 为什么它有效

 对于每个有向边缘状态，DP 准确地表示以下语句：

 “边缘这一侧的整个组件可以聚集到端点。”

 仅当附加到该顶点的每个相邻组件都可以首先聚集到其自己的附加点时，该组件才能聚集到该顶点。 这正是传入的 DP 状态编码的内容。 

当这些相邻组件可用后，只有它们的大小才重要。 排序大小条件对于顶点吸收它们来说既是必要的也是充分的。 

自下而上的过程计算所有指向根的状态。 自上而下的传递提供了缺失的父端信息。 两次通过后，每个有向边缘状态都已正确评估。 

当每个事件分量都可以向它聚集并且它可以吸收所有事件分量时，顶点就是一个有效的交汇点。 该算法准确地检查该条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    adj = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        adj[u].append(v)
        adj[v].append(u)

    if n == 1:
        print("YES")
        return

    parent = [0] * (n + 1)
    parent[1] = -1

    order = [1]
    for u in order:
        for v in adj[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            order.append(v)

    sub = [1] * (n + 1)
    for u in reversed(order[1:]):
        sub[parent[u]] += sub[u]

    good_all = [False] * (n + 1)
    good_excl = [dict() for _ in range(n + 1)]

    for u in range(1, n + 1):
        items = []

        for v in adj[u]:
            if parent[v] == u:
                sz = sub[v]
            else:
                sz = n - sub[u]
            items.append((sz, v))

        m = len(items)

        if m == 0:
            good_all[u] = True
            continue

        items.sort()

        b = [x for x, _ in items]

        d = [0] * m
        pref = 0
        for i in range(m):
            d[i] = b[i] - pref
            pref += b[i]

        pref_max = [0] * m
        suff_max = [0] * m

        pref_max[0] = d[0]
        for i in range(1, m):
            pref_max[i] = max(pref_max[i - 1], d[i])

        suff_max[m - 1] = d[m - 1]
        for i in range(m - 2, -1, -1):
            suff_max[i] = max(suff_max[i + 1], d[i])

        good_all[u] = pref_max[-1] <= 1

        for i, (_, v) in enumerate(items):
            left = pref_max[i - 1] if i > 0 else 0
            right = suff_max[i + 1] + b[i] if i + 1 < m else 0
            need = max(left, right)
            good_excl[u][v] = (need <= 1)

    down = [True] * (n + 1)

    for u in reversed(order[1:]):
        ok = True

        for v in adj[u]:
            if parent[v] == u and not down[v]:
                ok = False
                break

        down[u] = ok and good_excl[u][parent[u]]

    up = [True] * (n + 1)

    answer = False

    for u in order:
        invalid = 0

        if parent[u] != -1 and not up[u]:
            invalid += 1

        for v in adj[u]:
            if parent[v] == u and not down[v]:
                invalid += 1

        if invalid == 0 and good_all[u]:
            answer = True

        for v in adj[u]:
            if parent[v] == u:
                invalid_excluding_v = invalid - (0 if down[v] else 1)
                up[v] = (invalid_excluding_v == 0 and good_excl[u][v])

    print("YES" if answer else "NO")

solve()
```第一个 DFS 计算父关系和子树大小。 这些尺寸决定了每个有向边缘分量的尺寸。 

下一阶段独立处理每个顶点。 对相邻组件大小进行排序后，它构建$d_i$数组并预先计算完整邻居集和每个可能排除的邻居的合并条件。 

这`down`DP 评估朝向根的定向状态。 仅当所有必需的子状态都有效并且大小条件成立时，状态才有效。 

这`up`DP 提供父方缺失的信息。 它不是从头开始重新计算每个子项的有效性，而是使用预先计算的排除结果和无效传入状态的计数。 

该实现从不使用递归，这避免了树上的递归深度问题$200000$顶点。 

## 工作示例

 ### 示例 1

 输入：```
7
5 1
3 2
4 6
3 6
7 1
1 3
```一个有效的聚集点是顶点 3。 

| 顶点| 来料元件尺寸 | 尺寸排序 | 合并有效 |
 | --- | --- | --- | --- |
 | 3 | 1、2、3 | 1、2、3 | 是的 |
 | 1 | 1, 1, 4 | 1, 1, 4 | 没有 |
 | 6 | 1, 4 | 1, 4 | 没有 |

 在顶点 3 处：

 | 步骤| 当前的蚂蚁 | 吸收成分|
 | --- | --- | --- |
 | 开始| 1 | - |
 | 1 | 2 | 尺寸 1 |
 | 2 | 4 | 尺寸 2 |
 | 3 | 7 | 尺寸 3 |

 所有成分都可以被吸收，所以答案是`YES`。 

该跟踪显示了为什么按升序处理是最佳的。 每次成功的吸收都会增加以后合并的可用质量。 

### 示例 2

 考虑：```
4
1 2
2 3
3 4
```| 顶点| 来料元件尺寸 | 尺寸排序 | 合并有效 |
 | --- | --- | --- | --- |
 | 1 | 3 | 没有 | |
 | 2 | 1, 2 | 是的 | |
 | 3 | 1, 2 | 是的 | |
 | 4 | 3 | 没有 | |

 DP 还检查 2 号边是否可以自行聚集到其连接点中。 它不能，因为该侧包含大小为 2 的组件，无法从一只蚂蚁开始形成。 

最终的答案是`NO`。 

这个例子表明局部尺寸检查是不够的。 相邻组件本身必须是可聚集的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n)$| 每个顶点对其事件分量大小排序一次 |
 | 空间|$O(n)$| 邻接表、子树大小和 DP 数组 |

 所有度数的总和是$2(n-1)$，因此处理的数据总量是线性的。 唯一的超线性因素来自于对每个顶点的邻居大小进行排序，从而给出整体$O(n \log n)$复杂性，它完全符合限制$n=200000$。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n = int(input())
    adj = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        adj[u].append(v)
        adj[v].append(u)

    if n == 1:
        return "YES\n"

    parent = [0] * (n + 1)
    parent[1] = -1

    order = [1]
    for u in order:
        for v in adj[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            order.append(v)

    sub = [1] * (n + 1)
    for u in reversed(order[1:]):
        sub[parent[u]] += sub[u]

    good_all = [False] * (n + 1)
    good_excl = [dict() for _ in range(n + 1)]

    for u in range(1, n + 1):
        items = []

        for v in adj[u]:
            if parent[v] == u:
                sz = sub[v]
            else:
                sz = len(parent) - 1 - sub[u]
            items.append((sz, v))

        m = len(items)

        if m == 0:
            good_all[u] = True
            continue

        items.sort()

        b = [x for x, _ in items]

        d = []
        pref = 0
        for s in b:
            d.append(s - pref)
            pref += s

        pm = [0] * m
        sm = [0] * m

        pm[0] = d[0]
        for i in range(1, m):
            pm[i] = max(pm[i - 1], d[i])

        sm[-1] = d[-1]
        for i in range(m - 2, -1, -1):
            sm[i] = max(sm[i + 1], d[i])

        good_all[u] = pm[-1] <= 1

        for i, (_, v) in enumerate(items):
            left = pm[i - 1] if i else 0
            right = sm[i + 1] + b[i] if i + 1 < m else 0
            good_excl[u][v] = max(left, right) <= 1

    down = [True] * (n + 1)

    for u in reversed(order[1:]):
        ok = True
        for v in adj[u]:
            if parent[v] == u and not down[v]:
                ok = False
        down[u] = ok and good_excl[u][parent[u]]

    up = [True] * (n + 1)

    ans = False

    for u in order:
        invalid = 0

        if parent[u] != -1 and not up[u]:
            invalid += 1

        for v in adj[u]:
            if parent[v] == u and not down[v]:
                invalid += 1

        if invalid == 0 and good_all[u]:
            ans = True

        for v in adj[u]:
            if parent[v] == u:
                invalid_ex = invalid - (0 if down[v] else 1)
                up[v] = invalid_ex == 0 and good_excl[u][v]

    return ("YES\n" if ans else "NO\n")

# minimum size
assert run("1\n") == "YES\n"

# star
assert run(
"""4
1 2
1 3
1 4
"""
) == "YES\n"

# chain of four
assert run(
"""4
1 2
2 3
3 4
"""
) == "NO\n"

# balanced binary tree
assert run(
"""7
1 2
1 3
2 4
2 5
3 6
3 7
"""
) == "YES\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单顶点 | 是 | 最小边界情况 |
 | 3 叶星 | 是 | 重复吸收1号成分|
 | 长度为 4 的路径 | 否 | 无法在内部收集的组件 |
 | 平衡二叉树| 是 | 多个成功的跨级别合并 |

 ## 边缘情况

 考虑最小的树：```
1
```该算法不计算有向状态。`good_all[1]`是正确的，因为没有相邻的组件可以吸收。 答案是`YES`。 

考虑一颗星：```
4
1 2
1 3
1 4
```顶点 1 的相邻分量大小为$[1,1,1]$。 排序条件成功，因为每个尺寸最多是当前累积的质量。 所有从叶到中心的定向状态都是有效的，因此算法将顶点 1 标记为可行的聚集点。 

考虑一条路径：```
4
1 2
2 3
3 4
```Vertex 2 查看组件尺寸$[1,2]$，局部满足尺寸条件。 然而，尺寸 2 的边无法聚集到其附着顶点。 该侧的定向 DP 无效，算法正确地拒绝该树。 

这些案例说明了为什么解决方案需要两个要素：局部尺寸条件和相邻组件的递归有效性。
