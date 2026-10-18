---
title: "CF 106409J - 树查询"
description: "该问题要求对树进行许多范围查询。 树顶点有从 1 到 n 的固定标签。 查询给出标签的连续区间 [l, r]，这意味着我们选择标签在该区间内的每个顶点。"
date: "2026-06-25T09:59:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106409
codeforces_index: "J"
codeforces_contest_name: "HPI 2026 Advanced"
rating: 0
weight: 106409
solve_time_s: 35
verified: true
draft: false
---

[CF 106409J - 树查询](https://codeforces.com/problemset/problem/106409/J)

 **评级：** -
 **标签：** -
 **求解时间：** 35s
 **已验证：** 是的

 ## 解决方案
 # 问题理解

 该问题要求对树进行许多范围查询。 树的顶点有固定的标签`1`到`n`。 查询给出连续的标签间隔`[l, r]`，这意味着我们选择标签在该区间内的每个顶点。 答案是包含所有选定顶点的树的最小连通子图中的边数。 这是跨越这些顶点的最小子树的大小。 原始语句将其定义为连接每对选定顶点的最小边集。 

思考答案的一种直接方法是，如果我们标记所选顶点，我们需要准确保留它们之间路径上的边。 对于单个顶点，答案为零，因为不需要边。 对于两个顶点，答案就是它们的距离。 对于许多顶点，答案是原始树内斯坦纳树的大小。 

这些限制迫使我们采取不平凡的方法。 顶点总数最多为`2 * 10^5`并且查询总数最多为`3 * 10^5`。 为每个查询重建生成子树将需要重复访问许多顶点。 一个接近的解决方案`O(nq)`是不可能的，甚至`O(n sqrt(n))`风格预处理必须精心设计。 

一些边缘情况很容易被忽略。 如果查询仅包含一个顶点，则答案为零。```
Input:
1
1 1
1 1
```选定的集合是`{1}`，所以输出是：```
0
```如果解决方案不处理单元素情况，则始终计算连续选定顶点之间的距离的解决方案将错误地创建非零贡献。 

包含整个树的查询是另一个重要的边界情况。```
Input:
1
4 1
1 2
2 3
2 4
1 4
```所有顶点都被选中。 答案是所有三个边：```
3
```任何仅考虑选定顶点之间的直接路径的方法都可能会错过诸如边之类的分支`2-4`。 

第三个常见错误是忘记所选顶点是按其 DFS 位置而不是标签排序的。 标签仅定义查询间隔。 树结构决定了需要哪些边。 

## 方法

 暴力解决方案从定义开始。 对于每个查询`[l, r]`，收集该区间内带有标签的所有顶点。 然后构建包含它们的最小子树。 一种方法是重复添加从每个选定顶点到当前子树的路径。 这是正确的，因为每个所需的边都必须属于选定顶点之间的路径。 然而，在最坏的情况下，查询可能包含几乎所有顶点，并且构造路径可能会花费`O(n)`。 和`q`查询这变成`O(nq)`，可以到达周围`6 * 10^10`运营。 

关键的观察是我们不需要为每个查询显式构建子树。 对于任意一组顶点，按其 DFS 进入时间对它们进行排序。 如果按此顺序的顶点是`v1, v2, ..., vk`，生成树的长度为：$$\frac{dist(v_1,v_2)+dist(v_2,v_3)+...+dist(v_k,v_1)}{2}$$循环和对每条边精确计数两次，从该边创建的切割的每一侧计算一次。 

这个公式彻底改变了问题。 现在，一个查询要求我们以 DFS 顺序维护一组动态顶点以及相邻顶点之间距离的循环和。 由于查询是顶点标签上的间隔，因此我们可以使用 Mo 算法对其进行处理。 从一个区间移动到下一个区间只会添加或删除少量顶点。 

当一个顶点插入 DFS 有序集中时，只有两个相邻对发生变化。 如果它的前身是`a`后继者是`b`，距离总和增加：$$dist(a,x)+dist(x,b)-dist(a,b)$$删除顶点会反转此操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(nq)`|`O(n)`| 太慢了|
 | 最佳|`O((n+q)√n log n)`|`O(n log n)`| 已接受 |

 ## 算法演练

 1. 在任意顶点处以树为根并计算 DFS 进入时间。 还可以计算 LCA 查询的二进制提升表。 DFS 顺序给出了可以维护选定顶点的固定循环顺序。 
2. 转换每个查询`[l, r]`进入对顶点标签的 Mo 查询。 按块对查询进行排序可减少插入和删除操作的总数。 
3. 维护当前选定的顶点集。 存储哪些 DFS 位置处于活动状态并支持查找上一个和下一个活动位置。 
4. 添加顶点时`x`，在DFS顺序中找到它的前驱和后继。 用两条新边替换它们之间的圆距离和中的旧边`x`。 
5. 移除顶点时`x`，执行逆运算。 两条边经过`x`消失，直接的前继连接返回。 
6. 处理完查询后，将维护的循环距离总和除以二。 结果是最小子树中的边数。 

为什么它有效：不变的是，维护的值始终是按 DFS 顺序连续选定的顶点之间的距离的循环和。 插入和删除公式精确更新受影响的相邻对，因此每次 Mo 移动后不变式仍然成立。 由于树的标记顶点的循环和将最小连接子树中的每条边都计数两次，因此除以二即可得到所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    data = sys.stdin.buffer.read().split()
    it = iter(data)

    t = int(next(it))
    out = []

    for _ in range(t):
        n = int(next(it))
        q = int(next(it))

        g = [[] for _ in range(n)]
        for _ in range(n - 1):
            a = int(next(it)) - 1
            b = int(next(it)) - 1
            g[a].append(b)
            g[b].append(a)

        LOG = (n).bit_length()
        up = [[0] * n for _ in range(LOG)]
        tin = [0] * n
        depth = [0] * n
        order = []
        
        stack = [(0, -1, 0)]
        timer = 0
        while stack:
            u, p, state = stack.pop()
            if state == 0:
                tin[u] = timer
                order.append(u)
                timer += 1
                up[0][u] = u if p == -1 else p
                for i in range(1, LOG):
                    up[i][u] = up[i - 1][up[i - 1][u]]
                stack.append((u, p, 1))
                for v in reversed(g[u]):
                    if v != p:
                        depth[v] = depth[u] + 1
                        stack.append((v, u, 0))

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
            for i in range(LOG - 1, -1, -1):
                if up[i][a] != up[i][b]:
                    a = up[i][a]
                    b = up[i][b]
            return up[0][a]

        def dist(a, b):
            c = lca(a, b)
            return depth[a] + depth[b] - 2 * depth[c]

        queries = []
        block = max(1, int(n ** 0.5))
        for idx in range(q):
            l = int(next(it)) - 1
            r = int(next(it)) - 1
            queries.append((l, r, idx))

        queries.sort(key=lambda x: (x[0] // block, x[1] if (x[0] // block) % 2 == 0 else -x[1]))

        active = [False] * n
        pos_to_node = [0] * n
        node_to_pos = tin[:]

        bs = 450
        cnt = [0] * ((n + bs - 1) // bs + 1)
        positions = [False] * n

        def previous(pos):
            b = pos // bs
            for i in range(pos - 1, b * bs - 1, -1):
                if positions[i]:
                    return i
            for j in range(b - 1, -1, -1):
                if cnt[j]:
                    for i in range(min(n - 1, (j + 1) * bs - 1), j * bs - 1, -1):
                        if positions[i]:
                            return i
            return -1

        def following(pos):
            b = pos // bs
            for i in range(pos + 1, min(n, (b + 1) * bs)):
                if positions[i]:
                    return i
            for j in range(b + 1, len(cnt)):
                if cnt[j]:
                    for i in range(j * bs, min(n, (j + 1) * bs)):
                        if positions[i]:
                            return i
            return -1

        cur_sum = 0
        size = 0

        def add_node(x):
            nonlocal cur_sum, size
            p = node_to_pos[x]
            if size:
                a = previous(p)
                b = following(p)
                if a == -1:
                    a = following(p)
                if b == -1:
                    b = previous(p)
                if a == -1:
                    cur_sum += 0
                else:
                    cur_sum += dist(pos_to_node[a], x)
                    cur_sum += dist(x, pos_to_node[b])
                    cur_sum -= dist(pos_to_node[a], pos_to_node[b])
            positions[p] = True
            pos_to_node[p] = x
            cnt[p // bs] += 1
            size += 1

        def remove_node(x):
            nonlocal cur_sum, size
            p = node_to_pos[x]
            if size > 1:
                a = previous(p)
                b = following(p)
                if a == -1:
                    a = b
                if b == -1:
                    b = a
                cur_sum -= dist(pos_to_node[a], x)
                cur_sum -= dist(x, pos_to_node[b])
                cur_sum += dist(pos_to_node[a], pos_to_node[b])
            positions[p] = False
            cnt[p // bs] -= 1
            size -= 1

        ans = [0] * q
        L = 0
        R = -1

        for l, r, idx in queries:
            while L > l:
                L -= 1
                add_node(L)
            while R < r:
                R += 1
                add_node(R)
            while L < l:
                remove_node(L)
                L += 1
            while R > r:
                remove_node(R)
                R -= 1
            ans[idx] = cur_sum // 2

        out.extend(map(str, ans))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```预处理构建 DFS 顺序和二进制提升表。 LCA 结构仅用于快速评估距离，因为对维护周期的每次更新都需要进行一些距离计算。 

Mo 排序使添加和删除操作的数量保持可控。 活动数组按 DFS 位置而不是顶点标签进行索引，因为循环公式取决于 DFS 顺序。 

DFS 位置上的平方根分解取代了平衡二叉搜索树。 Python 不直接提供搜索，因此前驱和后继搜索是通过块来处理的。 选择块大小以使检查位置的数量保持较小。 

仅在回答查询时才执行除以二的操作。 维护的值有意保留为双倍子树大小，这避免了小数中间值。 

## 工作示例

 考虑示例树：```
1-2
2-3
2-4
1-5
5-6
```对于查询`[1,3]`，选定的顶点是`1,2,3`。 

| 步骤| 选定的顶点 | 循环距离总和 | 回答 |
 | ---| ---| ---| ---|
 | 添加 1 | {1} | 0 | 0 |
 | 添加 2 | {1,2} | 2 | 1 |
 | 添加 3 | {1,2,3} | 4 | 2 |

 循环和对边进行计数`1-2`和`2-3`两次，给出答案`2`。 

供查询`[4,6]`，选定的顶点是`4,5,6`。 

| 步骤| 选定的顶点 | 循环距离总和 | 回答 |
 | ---| ---| ---| ---|
 | 添加 4 | {4} | 0 | 0 |
 | 添加 5 | {4,5} | 6 | 3 |
 | 添加 6 | {4,5,6} | 8 | 4 |

 所需的子树包含`2-4`,`1-2`,`1-5`， 和`5-6`，所以答案是`4`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O((n+q)√n log n)`| Mo运动给出了大约`O((n+q)√n)`更新，并且每次更新都会执行基于 LCA 的距离查询 |
 | 空间|`O(n log n)`| 二进制提升主导内存使用 |

 约束允许这样做，因为顶点总数是`2 * 10^5`查询总数为`3 * 10^5`。 该算法避免重建大型子树，并且仅在查询之间移动时执行局部更改。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    # In a local setup, call solve() here after importing the solution.
    sys.stdin = old
    return ""

# Test cases should be executed against the solve() function from the solution file.

tests = [
    (
        "1\n1 1\n1 1\n",
        "0"
    ),
    (
        "1\n4 1\n1 2\n2 3\n2 4\n1 4\n",
        "3"
    ),
    (
        "1\n6 3\n1 2\n2 3\n2 4\n1 5\n5 6\n1 2\n1 3\n4 6\n",
        "1\n2\n4"
    )
]
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单顶点树|`0`| 空边集处理|
 | 整树查询 |`3`| 必须包含所有分支 |
 | 样本树|`1 2 4`| 通用生成子树计算|

 ## 边缘情况

 对于单个选定的顶点，活动集包含一个 DFS 位置。 循环距离和保持为零，因为不需要边来连接一个节点。 

对于整个树查询，每个顶点最终都会变得活跃。 每条边都包含在最小子树中，并且循环距离和正好是树中边数的两倍。 

对于所选顶点位于不同分支中的查询，距离计算中的 LCA 贡献自动包括共享路径。 该算法从不假设选定的顶点是直接连接的，因此分支边会被正确计数。
