---
title: "CF 102431G - 树上的游戏"
description: "我们有一棵以顶点 1 为根的树，最初在顶点 1 处有一个令牌。Panda 首先移动。 在第一个回合之后的每个回合中，玩家必须将代币移动得比对手在前一回合中移动的距离更远。 没有合法动作的玩家就输了。"
date: "2026-08-08T23:51:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102431
codeforces_index: "G"
codeforces_contest_name: "2019 China Collegiate Programming Contest Final (CCPC-Final 2019)"
rating: 0
weight: 102431
solve_time_s: 247
verified: true
draft: false
---

[CF 102431G - 树上的游戏](https://codeforces.com/problemset/problem/102431/G)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵以顶点 1 为根的树，最初在顶点 1 处有一个令牌。Panda 首先移动。 在第一个回合之后的每个回合中，玩家必须将代币移动得比对手在前一回合中移动的距离更远。 没有合法动作的玩家就输了。 

羊可以通过选择任何包含顶点 1 的连通子图来间接删除边和顶点。由于原始图是一棵树，因此每个这样的子图本身就是一棵包含根的树。 我们需要计算有多少个有根连通子图为羊赢得了位置，模 (10^9+7)。 官方的解决方案将游戏简化为树直径中心的位置，然后计算以顶点 1 为中心的有根子图。 

输入包含每个测试用例最多 (2\cdot10^5) 个顶点和最多 10 个测试用例。 对边权重或其他小数值参数没有有用的依赖，因此 (n) 中二次的算法已经太昂贵了。 特别是，在每个顶点扫描长度为 (O(n)) 的深度数组的 DP 可以在长树上执行 (O(n^2)) 工作。 我们需要使深度DP的总量接近线性，或者在最坏的情况下（O(n\log n)）。 

有三种边界情况值得关注。 

对于单个顶点，唯一可能的子图是顶点 1 本身。 它的直径长度为零，中心为顶点 1，因此答案为 1。 

对于两个顶点，唯一获胜的子图是单例 ({1})。 包含两个顶点的子图的直径由一条边组成，其中心是该边的中间而不是顶点 1。因此```
1
2
1 2
```产生```
Case #1: 1
```如果我们只查看从根部开始的最大深度，路径也可能会产生误导。 为了```
1
3
1 2
2 3
```三个可能的有根子图是 ({1})、({1,2}) 和 ({1,2,3})。 只有单例将顶点 1 作为其直径中心，因此答案为 1。如果粗心的实现将根视为最深顶点之一，就会错误地计数更多。 

星星给出了相反的边界。 为了```
1
4
1 2
1 3
1 4
```任何包含顶点 1 和至少两个叶子的子图的直径为 2，中心为 1。这样的非单子图有四个，对应于三对叶子和所有三个叶子的集合。 与单例一起，答案是 5。这种情况抓住了“最大深度出现”和“最大深度出现在至少两个不同的根分支中”之间的区别。 

## 方法

 直接解法可以枚举包含顶点 1 的每个连通子图，确定其直径，并检查顶点 1 是否为中心。 候选人的数量呈指数级增长。 即使使用 (2^{n-1}) 边缘子集的较宽松上限，测试 (O(n)) 中的每个候选也会给出 (O(n2^{n-1})) 工作。 对于(n=2\cdot10^5)，这是完全不可能的。 

第一个有用的观察是，复杂的移动规则具有令人惊讶的简单的博弈论特征。 考虑任何固定的树及其直径。 如果初始标记位于直径的中心，则第二个玩家采用镜像策略。 每当第一个玩家移动到距中心距离 (d) 的某个顶点时，第二个玩家就可以移动到中心另一侧相同距离的顶点。 所需的移动距离匹配，严格的不平等迫使最终的游戏走向直径终点。 官方分析准确地给出了这种直径中心特征。 

如果起始顶点不是直径中心，则第一个玩家可以向中心移动并获得相应的优势。 因此，当顶点 1 是所选子图直径的中心时，绵羊获胜。 

现在这个游戏已经消失了。 该问题纯粹是组合问题：计算直径以顶点 1 为中心的连通有根子树。 

原始树的根位于顶点 1。考虑包含根的选定连通子树。 设其距顶点 1 的最大深度为 (D)。 当在顶点 1 的至少两个不同的子树中达到深度 (D) 时，顶点 1 正是直径中心。 

为什么？ 如果两个不同的分支都包含深度 (D) 的顶点，则这两个顶点通过根的距离为 (2D)。 任何完全在一根分支内的路径的长度至多为(2D-2)，因此直径经过顶点1，其中心正好是顶点1。反之，如果只有一根根分支达到深度(D)，则无法通过根形成长度为(2D)的直径，因此根不是中心。 

因此，我们需要一个树DP来计算包含每个顶点的连接子树，并按其最大深度进行分类。 

定义(f_u[i])为(u)的子树内部连通子树的数量，包含(u)，从(u)测量的最大深度恰好是(i)。 对于叶子，(f_u[0]=1)。 

假设我们已经处理了 (u) 的一些子级，由数组 (A_i) 表示，现在添加一个子级 (v)，其对应的数组为 (B_i)。 最大深度为 (i) 的新子树可以通过两种方式出现。 新子级达到深度 (i)，而前一部分的深度最多为 (i)，或者前一部分达到深度 (i)，而新子级的深度严格小于 (i)。 这给出了逐点递归

 B_i\左(1+\sum_{j=0}^{i}A_j\右)
 +
 A_i\left(1+\sum_{j=0}^{i-1}B_j\right)。 
]

 复发很简单，但对每个孩子单独评估仍然太慢。 关键的结构观察是我们只需要显式处理较短的子数组。 对于每个顶点，我们选择一个最大高度的子节点作为其重子节点。 DP 数组沿着这条重链存储，并在其顶点之间共享。 然后，灯光孩子的数组会按照与灯光孩子的高度成比例的时间合并到当前数组中。 这是该问题的公认解决方案所使用的长链分解。

当前DP数组超出光子最大深度的后缀只需要乘以一标量即可。 我们惰性地存储这个乘法。 当最终访问数组位置时，其挂起的乘法被推送到下一个位置。 由于DP位置从小深度到大深度被消耗，所以每个惰性标签仅沿着链向前移动。 

计算完所有(f_u)后，单独处理根。 对于根的每个子项 (c)，定义

 [
 a_c(D)=f_c[D-1],
 ]

 它计算分支 (c) 中的非空选择，其最大根深度恰好是 (D)。 还定义

 [
 b_c(D)=1+\sum_{j=0}^{D-2}f_c[j],
 ]

 其中附加的 1 表示从该分支中不选择任何内容。 因此 (b_c(D)) 计算最大深度严格小于 (D) 的分支选择。 

对于固定深度 (D)，产品

 [
 P_D=\prod_c (a_c(D)+b_c(D))
 ]

 计算最大深度最多为 (D) 的所有有根子树。 因此 (P_D-P_{D-1}) 计算最大深度恰好为 (D) 的那些。 

其中，我们必须删除恰好有一个根分支到达深度（D）的配置。 定义

 [
 Q_D=\sum_ca_c(D)\prod_{j\ne c}b_j(D)。 
]

 然后

 [
 P_D-P_{D-1}-Q_D
 ]

 正是在至少两个根分支中实现最大深度 (D) 的配置数量。 

我们用根子节点上的线段树维护 (P_D)、(\prod b_c(D)) 和 (Q_D)。 每个分支在每个深度上仅更改其 (a_c,b_c) 一次，并且此类更改的总数最多为分支高度之和，即 (O(n))。 线段树进行每次更改 (O(\log n))。 

单例根是单独处理的，因此最终答案是所有正深度的有效配置之和加一。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n2^{n-1})) | (O(n)) | (O(n)) | 太慢了|
 | 普通树DP| (O(n^2)) | (O(n^2)) 在最坏的情况下 | 太慢了|
 | 长链DP+根聚合| (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

1. 以顶点 1 为树根，构建父子在子之前的遍历顺序。 向后处理此顺序会在处理其父级之前给出每个子级的 DP。 
2. 计算每个顶点的高度并选择具有最大高度的重子节点。 顶点的 DP 数组放置在重链上的一个位置，因此紧邻其下方的子节点对应于同一数组中的下一个位置。 
3.为每条重链分配一个连续的DP阵列。 高度 (h) 的链需要 (h+2) 个位置，因为惰性后缀乘法需要一个额外的位置。 
4. 从叶向根处理顶点。 设(f_u[0]=1)，表示仅由(u)组成的子树。 
5. 在合并过程中跳过重子节点，因为它的 DP 数组已经与 (u) 物理共享。 其他所有子级都是轻子级，并且会显式合并。 
6. 合并光子 (v) 时，从深度零向上扫描其 DP 阵列。 维护两个前缀和。 第一个是 (1+\sum_{j\le i}f_u[j])，第二个是 (1+\sum_{j<i}f_v[j])。 这两个量正是新的最大深度的递归所需的系数。 
7. 在(v)表示的最后一个深度之后，每个剩余位置乘以相同的因子，即(1+\sum_j f_v[j])。 将该操作存储为惰性乘法，而不是触及链的其余部分。 
8.完成树DP后，将根的每个子节点视为一个独立的分支。 在深度 (D) 处，维持 (a_c=f_c[D-1]) 和 (b_c=1+\sum_{j<D-1}f_c[j])。 ((a_c,b_c)) 对完整地描述了分支 (c) 如何参与最大深度为 (D) 的子树。 
9. 使用线段树，其节点存储三个值。 第一个是 (a_c+b_c) 的乘积，第二个是 (b_c) 的乘积，第三个计算只有一个分支贡献 (a_c) 的配置。 如果线段树节点的两个子节点具有状态 ((P_1,B_1,Q_1)) 和 ((P_2,B_2,Q_2))，则将它们组合为
 [
 P=P_1P_2,
 ]
 [
 B=B_1B_2,
 ]
 [
 Q=Q_1B_2+B_1Q_2。 
]
 最后一个公式表示达到当前最大值的唯一分支要么位于左段，要么位于右段。 
10. 对于每个正深度 (D)，让线段树根给出 (P_D) 和 (Q_D)。 如果 (P_{D-1}) 是最大深度低于 (D) 的选择数，则
 [
 P_D-P_{D-1}-Q_D
 ]
 精确计算至少两个根分支中最大深度为 (D) 的子树。 将其添加到答案中并继续进入下一个深度。 

### 为什么它有效

 当起始顶点是树直径的中心时，第二个玩家获胜。 当有根连通子树的最大根深度出现在至少两个不同的根分支中时，该树的直径中心为顶点 1。 DP 根据其确切的最大深度来计算每个分支内每个可能的连接选择。 然后，根聚合根据全局最大深度将配置分开，并准确删除其中只有一个分支达到该最大值的配置。 因此，每棵被统计的子树都以根 1 为直径中心，并且每棵以根 1 为直径中心的子树都被恰好计数一次。 

重链表示不会改变任何 DP 值。 它仅更改存储值的位置。 顶点及其重子节点使用同一数组中的相邻位置，而轻子节点的数组将合并到该共享数组中。 惰性后缀乘数在代数上等同于将所有未受影响的较大深度状态乘以相同的因子。 因此，优化保留了原始的 DP 递归。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve_case(n, adj):
    if n == 1:
        return 1

    # Root the tree at 0.
    parent = [-1] * n
    parent[0] = -2
    order = [0]

    for u in order:
        for v in adj[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            order.append(v)

    # Height and heavy child.
    height = [0] * n
    heavy = [-1] * n

    for u in reversed(order):
        best_h = -1
        best_v = -1
        for v in adj[u]:
            if parent[v] == u:
                hv = height[v]
                if hv > best_h:
                    best_h = hv
                    best_v = v
        if best_v != -1:
            height[u] = best_h + 1
            heavy[u] = best_v

    # Allocate one contiguous array per heavy chain.
    base = [0] * n
    pool_size = 0

    for u in order:
        p = parent[u]
        if p != -2 and heavy[p] == u:
            continue

        x = u
        cur = pool_size
        length = height[u] + 2
        pool_size += length

        while x != -1:
            base[x] = cur
            cur += 1
            x = heavy[x]

    val = [0] * pool_size
    tag = [1] * pool_size

    def modify(pos, mul):
        val[pos] = val[pos] * mul % MOD
        tag[pos] = tag[pos] * mul % MOD

    def pushdown(pos):
        t = tag[pos]
        if t != 1:
            nxt = pos + 1
            val[nxt] = val[nxt] * t % MOD
            tag[nxt] = tag[nxt] * t % MOD
            tag[pos] = 1

    # Tree DP.
    for u in reversed(order):
        bu = base[u]
        val[bu] = 1

        # Only light children are explicitly merged.
        for v in adj[u]:
            if parent[v] != u or v == heavy[u]:
                continue

            bv = base[v]
            length = height[v] + 1

            r = 1
            s = 1

            for i in range(1, length + 1):
                pu = bu + i
                pv = bv + i - 1

                pushdown(pu)
                pushdown(pv)

                a = val[pu]
                b = val[pv]

                # r = 1 + sum of current f-values through depth i.
                r += a
                if r >= MOD:
                    r -= MOD

                # s = 1 + sum of child f-values below depth i.
                val[pu] = (r * b + s * a) % MOD

                s += b
                if s >= MOD:
                    s -= MOD

            # For all larger depths the light child can only be chosen
            # completely or omitted, so the multiplier is the same.
            modify(bu + length + 1, s)

    # Root aggregation.
    root_children = [v for v in adj[0] if parent[v] == 0]
    k = len(root_children)

    if k == 0:
        return 1

    max_depth = max(height[v] + 1 for v in root_children)

    # events[d] contains branches whose height reaches depth d.
    events = [[] for _ in range(max_depth + 1)]

    for idx, v in enumerate(root_children):
        branch_height = height[v] + 1
        for d in range(1, branch_height + 1):
            events[d].append(idx)

    # For each root branch:
    # b[idx] = number of choices with maximum depth < current d
    # a[idx] = number of choices with maximum depth == current d
    b = [1] * k
    a = [1] * k

    size = 1
    while size < k:
        size <<= 1

    seg_p = [1] * (2 * size)
    seg_b = [1] * (2 * size)
    seg_q = [0] * (2 * size)

    # Initially d = 1, so b = 1 and a = f_child[0] = 1.
    for i in range(k):
        pos = size + i
        seg_p[pos] = 2
        seg_b[pos] = 1
        seg_q[pos] = 1

    for pos in range(size - 1, 0, -1):
        left = pos << 1
        right = left | 1

        seg_p[pos] = seg_p[left] * seg_p[right] % MOD
        seg_b[pos] = seg_b[left] * seg_b[right] % MOD
        seg_q[pos] = (
            seg_q[left] * seg_b[right]
            + seg_b[left] * seg_q[right]
        ) % MOD

    def update_branch(idx):
        pos = size + idx
        x = (b[idx] + a[idx]) % MOD

        seg_p[pos] = x
        seg_b[pos] = b[idx]
        seg_q[pos] = a[idx]

        pos >>= 1
        while pos:
            left = pos << 1
            right = left | 1

            seg_p[pos] = seg_p[left] * seg_p[right] % MOD
            seg_b[pos] = seg_b[left] * seg_b[right] % MOD
            seg_q[pos] = (
                seg_q[left] * seg_b[right]
                + seg_b[left] * seg_q[right]
            ) % MOD

            pos >>= 1

    answer = 1
    previous_p = 1

    for d in range(1, max_depth + 1):
        if d >= 2:
            for idx in events[d]:
                v = root_children[idx]

                old_a = a[idx]
                b[idx] += old_a
                if b[idx] >= MOD:
                    b[idx] -= MOD

                pos = base[v] + d - 1
                pushdown(pos)
                a[idx] = val[pos]

                update_branch(idx)

        current_p = seg_p[1]
        exactly_one = seg_q[1]

        good = current_p - previous_p - exactly_one
        good %= MOD

        answer += good
        if answer >= MOD:
            answer -= MOD

        previous_p = current_p

    return answer

def solve():
    t = int(input())
    out = []

    for case_id in range(1, t + 1):
        n = int(input())
        adj = [[] for _ in range(n)]

        for _ in range(n - 1):
            x, y = map(int, input().split())
            x -= 1
            y -= 1
            adj[x].append(y)
            adj[y].append(x)

        ans = solve_case(n, adj)
        out.append(f"Case #{case_id}: {ans}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一次遍历无需递归即可建立有根表示。 避免递归 DFS 是有意为之的，因为 (2\cdot10^5) 个顶点的路径否则会超出 Python 的递归深度。 

高度计算以相反的顺序执行。 身高最高的孩子成为最重的孩子。 重子级不会显式合并，因为它的 DP 存储已经与父级存储相邻。 这是中央内存优化。 

这`val`数组存储实际的 DP 值，而`tag`存储待处理的乘法。 当从位置 (p) 开始的后缀乘以某个值时，只需立即更改位置 (p)。 标签为后面的位置记录相同的乘数。 呼唤`pushdown(p)`将其转移到(p+1)。 由于每次合并都按递增顺序读取深度，因此每个挂起的标签在需要时准确地向前移动。 

变量`r`和`s`合并中是前缀计数。 表达式```
val[pu] = (r * b + s * a) % MOD
```是新的精确最大深度的两种情况的递归。 更新的顺序很重要：`r`必须包括当前的`a`， 尽管`s`仍必须仅表示严格小于当前深度的子深度。 

根聚合故意不使用模除法。 分支计数的乘积可以为零模 (10^9+7)，因此尝试使用模逆来删除一个因子将需要对零因子进行特殊处理。 线段树完全避免了划分。 

对于线段树节点，`seg_p`代表所有的选择，`seg_b`表示该段中没有分支达到当前最大值的选择，并且`seg_q`代表只有一个分支所做的选择。 这三个值足以组合任意组的根分支。 

所有算术都以模 (10^9+7) 进行缩减。 Python 整数不会溢出，但减少乘积可以使整数保持较小并避免不必要的增长。 

## 工作示例

 ### 示例 1

 这棵树就是（1-2）。 只有一个根分支，因此任何非空子树都不可能在两个不同的分支中具有最大深度。 

| 深度（D）| 分支（一）| 分支 (b) | (P_D) | (Q_D) | 新的有效子树 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 2 | 1 | (2-1-1=0) | (2-1-1=0) |

 单独添加单根根，得到最终答案1。 

### 示例 2

 这棵树是```
      1
     / \
    2   4
    |  / \
    3 5   6
```对于以 2 为根的分支，精确深度 DP 为

 [
 f_2=[1,1]。 
]

 对于以 4 为根的分支，精确深度 DP 为

 [
 f_4=[1,3],
 ]

 因为唯一的零深度选择是顶点 4，而在深度 1，我们可以选择顶点 5、顶点 6 或两者。 

在深度 1 时，两个分支都可以达到最大值：

 | 深度（D）| 分支 2 (a,b) | 分支 4 (a,b) | (P_D) | (Q_D) | 新有效 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | ((1,1)) | ((1,1)) | ((1,1)) | ((1,1)) | 4 | 2 | (4-1-2=1) | (4-1-2=1) |

 在深度 2 处，以 2 为根的分支具有 (a=1,b=2)，而以 4 为根的分支具有 (a=3,b=2)。 

| 深度（D）| 分支 2 (a,b) | 分支 4 (a,b) | (P_D) | (Q_D) | 新有效|
 | --- | --- | --- | --- | --- | --- |
 | 2 | ((1,2)) | ((1,2)) | ((3,2)) | ((3,2)) | 15 | 15 8 | (15-4-8=3) |

 有 1 个单例、1 个最大深度为 1 的有效子树和 3 个最大深度为 2 的有效子树。总计为

 [
 1+1+3=5，
 ]

 匹配样本输出。 

该迹线还说明了为什么仅仅计算直径穿过根的子树是不够的。 必须在至少两个不同的分支上达到最大深度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n)) | 长链DP显式地处理每个轻链深度，根分支更新使用线段树。 |
 | 空间| (O(n)) | (O(n)) | 重链DP存储、树表示和根聚合结构都是线性的。 |

 树DP比二次方法小得多，因为顶点的长重路径被存储一次并被该路径上的所有顶点重用。 轻子级合并负责较短的链，给出此实现的标准 (O(n\log n)) 界限。 根聚合仅执行 (O(n)) 分支深度更新，每次更新需要 (O(\log n))。 对于 (n\le2\cdot10^5)，这符合问题的预期复杂性。 官方竞赛材料还给出了 (O(n)) 或 (O(n\log n)) 树-DP 解决方案，并明确警告不要出现 (O(n^2)) 退化。 

## 测试用例

 以下测试工具假设提交的解决方案已另存为`solution.py`。 它调用实​​际的程序，因此断言测试完整的输入/输出行为，而不是单独的重新实现。```python
# helper: run the submitted solution and return its output
import subprocess
import sys

def run(inp: str) -> str:
    result = subprocess.run(
        [sys.executable, "solution.py"],
        input=inp,
        text=True,
        capture_output=True,
        check=True,
    )
    return result.stdout.strip()

# Provided sample
sample = """\
2
2
1 2
6
1 2
2 3
1 4
4 5
4 6
"""
assert run(sample) == """\
Case #1: 1
Case #2: 5
""".strip(), "provided samples"

# Minimum-size tree
assert run("""\
1
1
""") == "Case #1: 1", "single vertex"

# Path of length 3
assert run("""\
1
3
1 2
2 3
""") == "Case #1: 1", "path"

# Star with three leaves.
# Valid choices are the singleton plus every choice containing
# at least two leaves: 1 + C(3,2) + C(3,3) = 5.
assert run("""\
1
4
1 2
1 3
1 4
""") == "Case #1: 5", "star"

# Maximum-size path.
# Every connected subgraph containing vertex 1 is a prefix of the path,
# and only the singleton has vertex 1 as its diameter center.
n = 200000
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
max_path = f"1\n{n}\n{edges}\n"

assert run(max_path) == "Case #1: 1", "maximum-size path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 1`|`Case #1: 1`| 最小尺寸和单例处理 |
 |`1-2-3`|`Case #1: 1`| 一条路径，其中根永远不是非平凡前缀的中心 |
 | 三叶星|`Case #1: 5`| 多个分支达到相同的最大深度 |
 | 具有 200000 个顶点的路径 |`Case #1: 1`| 递归 DFS 或二次 DP 的最大尺寸和避免 |
 | 官方样品|`1`,`5`| 针对给定示例的完全正确性 |

 ## 边缘情况

 对于单顶点树```
1
1
```有根的树没有孩子。 DP仅包含(f_1[0]=1)，并且根聚合没有正深度要处理。 单例的答案从 1 开始，并且始终保持为 1。 

对于二顶点树```
1
2
1 2
```有一根根枝。 在深度 1 处，该分支具有 (a=1) 和 (b=1)，因此 (P_1=2)。 在一种配置中，恰好有一个分支达到深度 1，即 (Q_1=1)。 由于(P_0=1)，在最大深度处至少有两个分支的数量是(2-1-1=0)。 单例仍然是唯一获胜的选择。 

对于路径```
1
3
1 2
2 3
```根仍然只有一个分支。 最大深度可以是 1 或 2，但它永远不能出现在两个不同的分支中。 两种深度都贡献零获胜配置，只留下单例。 

为了明星```
1
4
1 2
1 3
1 4
```有三个根枝。 在深度 1 处，每个分支都有 (a=1) 和 (b=1)。 因此，所有（2^3=8）个分支选择都由（P_1）表示，而在（Q_1=3）配置中只有一个分支达到最大值。 删除单例情况和恰好一个分支情况给出 (8-1-3=4) 个有效的非单例子树。 添加单例得到 5。 

最大尺寸路径也是一种有用的实现边缘情况。 它的深度可以是 (199999)，因此使用递归 DFS 的实现通常会溢出 Python 的递归限制。 该解决方案始终使用迭代遍历。 由于路径没有光子路径，因此几乎完全不存在昂贵的合并循环，因此大深度不会导致二次工作。 

等高分支是另一个微妙的情况。 体重最大的孩子是在身高最高的孩子中任意选择的。 如果两个孩子身高相同，一个会重，另一个会轻。 轻分支仍然完全合并到共享 DP 数组中，因此不会丢失任何子树选择。 选择哪个等高子项较重仅影响存储，而不会影响 DP 值。 

最后，在除积时，模零不能被视为普通整数零。 即使配置的实际数量为正，分支计数也可以与零模 (10^9+7) 全等。 因此，根聚合仅使用线段树和乘法，避免模逆并使计算即使在某些乘积对模取模消失时也有效。
