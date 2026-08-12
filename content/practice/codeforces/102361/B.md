---
title: "CF 102361B - 凉宫春日之树"
description: "我们有一棵有根树，其根是顶点 1。每个顶点都有一个整数权重，其深度是其到根的距离。"
date: "2026-08-13T00:06:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102361
codeforces_index: "B"
codeforces_contest_name: "2019 China Collegiate Programming Contest Qinhuangdao Onsite"
rating: 0
weight: 102361
solve_time_s: 246
verified: true
draft: false
---

[CF 102361B - 凉宫春日之树](https://codeforces.com/problemset/problem/102361/B)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 6s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有根树，其根是顶点 1。每个顶点都有一个整数权重，其深度是其到根的距离。 我们将所有顶点分为 A 组和 B 组，对于 B 的每个可能大小（从 0 到 n），我们需要两组总不喜欢度的最小可能值。 

A 组支付三种费用。 权重大于其后代的祖先会产生惩罚，两个不可比较的顶点会产生惩罚，A 中的每个顶点都会贡献其深度。 B 组只有一种配对惩罚：祖先的权重小于其后代的权重。 

微妙之处在于，一对可以在 A 中受到惩罚，在 B 中受到惩罚，或者在任何一组中都不受惩罚。 当两个顶点具有相等的权重并且一个顶点是另一个顶点的祖先时，两个组都不喜欢这对顶点。 这种特殊情况就是简单的“为每个顶点分配分数并排序”论证需要额外的结构观察的原因。 

官方限制允许n最大为500,000，时间限制为2秒，内存限制为1024 MB。 对于一次完整的顶点遍历，二次算法已经需要大约 2500 亿对运算，因此即使 O(n²) 也远远超出了预期范围。 该解决方案需要保持在 O(n log n) 左右，并且具有线性内存。 

第一个边缘情况是单个顶点。```
1
7
```没有对，并且唯一的顶点深度为零，所以答案是```
0
0
```将根深度初始化为 1 的解决方案会错误地报告正成本。 

第二种边缘情况是沿着祖先链的权重相等。```
3
1 1 1
1 2
2 3
```正确的输出是```
3
1
0
0
```对于 A 中的所有三个顶点，深度贡献为 0 + 1 + 2 = 3。如果仅最深的顶点移动到 B，则 A 包含前两个顶点，成本为 1。如果最深的两个顶点移动到 B，A 只包含根，成本为零。 同等权重的祖先对永远不会对任何一个群体做出贡献。 将每一对视为属于 A 方或 B 方的解决方案将导致这种情况出错。 

第三种边缘情况是具有相等权重的分支树。```
4
1 1 1 1
1 2
1 3
1 4
```正确的输出是```
6
3
1
0
0
```当一个叶子移动到 B 时，其他三个顶点仍留在 A 中。这三个叶子具有成对不可比较的关系，因此剩余两个叶子贡献 1 对惩罚，而它们的深度贡献 2，给出 3。当两个叶子移动到 B 时，A 包含根和一个叶子，它们是可比较的，因此成本仅为 1。这种情况捕获了处理等权祖先链的实现，但忘记了等权顶点可以分支。 

## 方法

 直接的方法是枚举 B 选择的集合。对于每个子集，它的大小告诉我们它属于哪个输出位置，我们可以评估每对顶点和每个深度贡献以获得准确的成本。 这是正确的，因为它考虑了每个可能的分区。 

问题是子集的数量。 B 有 2^n 种可能的选择，并且天真地评估一个选择需要 θ(n²) 对检查。 最坏的情况是 θ(n²2^n)，对于 n = 500,000 来说这是没有希望的。 即使通过枚举特定大小的所有子集来计算一个答案也需要二项式多项选择。 

有用的观察来自于一次观察一对。 当顶点 i 属于 B 时，令 x_i 为 1；当顶点 i 属于 A 时，令 x_i 为 0。对于不可比对，当两个端点都在 A 中时，该对的成本恰好为 1，因此其贡献为

 [
 (1-x_i)(1-x_j)=1-x_i-x_j+x_ix_j。 
]

 对于祖先权重较大的祖先对，会出现相同的表达式，因为惩罚属于 A。对于祖先权重较小的祖先对，惩罚属于 B，因此贡献就是

 [
 x_ix_j。 
]

 唯一没有贡献的对是具有相同权重的祖先对。 

这给出了一个常见的二次形式。 修复|B|后 = k，所有普通对的 x_i x_j 之和贡献一个固定的 (\binom{k}{2})，除了等权祖先对已被省略。 剩余的依赖于顶点的部分可以由每个顶点的分数来表示。 

令b_i为i的深度加上涉及i的A型对惩罚的数量。 如果我们暂时忽略等权祖先对，将 i 移动到 B 将使目标提高 b_i，而选择两个 B 顶点会引入固定 (\binom{k}{2}) 项。 

同等重量的祖先对需要特殊对待。 假设顶点 u 是 v 的等权祖先。如果为 B 选择 u 而 v 没有，我们可以用 v 替换 u 而不会使解决方案变得更糟。 沿着等权父子边缘，分数 b 严格获得足够的收益来补偿可能从配对奖励中损失的每个等权后代。 重复此变换给出了一个最佳解决方案，其中对于每个等权祖先关系，选择祖先意味着选择所有等权后代。 

对于这样一个向下封闭的集合，B 内的等权祖先对的数量只是所选顶点上它们的等权后代数量的总和。 我们可以将其吸收到顶点分数中。 

代数简化后，最终的分数具有特别紧凑的形式：

 [
 g_i =
 n-\操作符名称{子树大小}_i
 +#{\text{}i\text{ 的祖先，权重}>w_i}
 +#{\text{}i\text{ 的严格后代，权重}\le w_i}。 
]

 一旦知道这些分数，就可以通过取 k 个最大分数来获得大小为 k 的最佳解决方案。 相等的分数必须按深度递减排序，这保留了等权祖先关系所需的向下封闭属性。 

当每个顶点都在 A 中时，初始成本也会简化。 不可比对的数量为

 [
 \binom n2-\sum_i d_i,
 ]

 因为顶点 i 具有严格的 d_i 祖先。 添加 Mikuru 的 (\sum_i d_i) 会取消该术语。 因此初始成本很简单

 [
 C=\binom n2+
 #{(u,v)\text{ 是 }v,\ w_u>w_v} 的祖先。 
]

 后一个计数恰好是 g_i 中使用的祖先更大计数的总和。

剩下的任务是有效地计算子树大小、大于祖先的计数和小于或等于后代的计数。 欧拉之旅使每个子树都是连续的区间。 然后，Fenwick 树可以在 O(log n) 时间内回答所需的离线计数查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²2^n) | O(n²2^n) | O(n) | 太慢了|
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 使用迭代 DFS 在顶点 1 处将树作为根。 存储父级、深度、预购位置和预购列表。 以反向预序处理顶点然后给出每个子树的大小。 顶点 i 的子树占据欧拉区间 ([tin_i,tout_i])。 
2. 按权重对所有顶点进行排序。 我们将使用这一订单进行两次离线 Fenwick 扫描。 排序一次就足够了，因为两个所需的计数使用相同权重顺序的相反方向。 
3. 计算(a_i)，i 的权重严格大于(w_i) 的祖先的数量。 处理权重递减组中的顶点。 在插入组之前，查询该组中的每个顶点。 Fenwick 树存储子树上的范围添加，因此已插入的顶点为其子树中的每个顶点贡献 1。 由于只插入了较大的权重，因此 i 处的查询会准确计算其较大权重的祖先。 在插入之前查询相同权重的顶点，这正确地强制执行严格的不平等。 
4. 计算(c_i)，i 的权重至多为(w_i) 的严格后代的数量。 重置芬威克树并按升序处理权重组。 将当前组的每个顶点插入其欧拉位置，然后查询整个子树区间。 结果统计了子树中权重最大为(w_i)的顶点，包括i本身，所以减一。 
5. 计算

 [
 g_i=n-\operatorname{subtreeSize}_i+a_i+c_i。 
]

 第一项表示 i 子树外部的顶点。 第二项说明了重量较大的祖先。 第三项是指体重小到可以参与A方评分的后代，包括等权后代。 

1. 计算全A基线

 [
 C=\binom n2+\sum_i a_i。 
]

 不可比对惩罚和深度惩罚之间的取消使得这个表达式如此简短。 

1. 通过递减 (g_i) 对顶点进行排序，通过递减深度打破联系。 对于等权祖先和后代顶点，后代的分数至少与祖先一样大。 当分数平局时，更深层次首先使每个前缀相对于等权祖先向下封闭。 
2. 令(P_k) 为前k 个分数的总和。 (|B|=k) 的答案是

 [
 \boxed{C+\binom{k}{2}-P_k}。 
]

 当 k = 0 时，前缀和为零，公式给出全 A 成本。 对于 k = n，它给出将每个顶点放入 B 的成本。 

为什么它有效：对于任何固定的 B，每个不相等的祖先或不可比较的对都贡献一个二次项 (x_ix_j)，而每个 A 侧对也为每个端点贡献一个线性项 (-x_i)。 由于正好有 k 个顶点 x_i = 1，因此普通二次项贡献 (\binom{k}{2})。 等权祖先对是唯一缺失的二次项，它们的贡献正是此类所选对的数量。 分数 (g_i) 包含线性改进和等权后代奖励。 最优集可以转换为在等权后代中向下封闭的集，而不会降低其分数。 对于每个这样的集合，等权对奖励恰好是相应后代计数的总和，因此最大化目标正是最大化 g_i 的总和。 取 k 个最大的 g_i 就可以做到这一点，并且深度平局使得所选前缀向下封闭。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    w = list(map(int, input().split()))

    graph = [[] for _ in range(n)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append(v)
        graph[v].append(u)

    parent = [-2] * n
    depth = [0] * n
    tin = [0] * n
    order = []

    parent[0] = -1
    stack = [0]

    while stack:
        u = stack.pop()
        tin[u] = len(order) + 1
        order.append(u)

        for v in graph[u]:
            if v == parent[u]:
                continue
            parent[v] = u
            depth[v] = depth[u] + 1
            stack.append(v)

    size = [1] * n
    for u in reversed(order):
        p = parent[u]
        if p >= 0:
            size[p] += size[u]

    tout = [0] * n
    for u in range(n):
        tout[u] = tin[u] + size[u] - 1

    by_weight = list(range(n))
    by_weight.sort(key=w.__getitem__)

    bit = [0] * (n + 2)

    def add(pos, delta):
        while pos <= n:
            bit[pos] += delta
            pos += pos & -pos

    def prefix(pos):
        res = 0
        while pos:
            res += bit[pos]
            pos -= pos & -pos
        return res

    # Number of strictly larger-weight ancestors.
    anc_greater = [0] * n

    i = n - 1
    while i >= 0:
        j = i
        value = w[by_weight[i]]
        while j >= 0 and w[by_weight[j]] == value:
            j -= 1

        for p in range(j + 1, i + 1):
            u = by_weight[p]
            anc_greater[u] = prefix(tin[u])

        for p in range(j + 1, i + 1):
            u = by_weight[p]
            add(tin[u], 1)
            add(tout[u] + 1, -1)

        i = j

    # Reuse the Fenwick tree.
    bit = [0] * (n + 2)

    # Number of strict descendants with weight <= w[i].
    desc_le = [0] * n

    i = 0
    while i < n:
        j = i
        value = w[by_weight[i]]
        while j < n and w[by_weight[j]] == value:
            j += 1

        for p in range(i, j):
            u = by_weight[p]
            add(tin[u], 1)

        for p in range(i, j):
            u = by_weight[p]
            desc_le[u] = prefix(tout[u]) - prefix(tin[u] - 1) - 1

        i = j

    score = [0] * n
    base = n * (n - 1) // 2

    for u in range(n):
        score[u] = n - size[u] + anc_greater[u] + desc_le[u]
        base += anc_greater[u]

    # Equal-score equal-weight ancestors must come after descendants.
    vertices = list(range(n))
    scale = n + 1
    vertices.sort(
        key=lambda u: -(score[u] * scale + depth[u])
    )

    ans = [0] * (n + 1)
    prefix_score = 0

    for k, u in enumerate(vertices, 1):
        prefix_score += score[u]
        ans[k] = base + k * (k - 1) // 2 - prefix_score

    sys.stdout.write("\n".join(map(str, ans)))

if __name__ == "__main__":
    solve()
```第一个 DFS 是迭代的而不是递归的，因为一棵树可以是 500,000 个顶点的链，这会溢出 Python 的递归限制，并使递归实现变得脆弱。 预序位置是基于 1 的，因为 Fenwick 树自然使用基于 1 的索引。 

反向遍历计算子树大小，而不需要单独的后序遍历。 一旦知道了尺寸，`tout[u] = tin[u] + size[u] - 1`直接遵循欧拉排序。 

第一次 Fenwick 扫描使用范围添加和点查询。 将 1 添加到顶点的整个子树意味着 i 处的点查询精确计算 i 的活动祖先。 在当前权重组之前处理严格较大的权重会使相同的权重对查询不可见。 

第二次扫描使用点添加和范围查询。 在权重组 w 的末尾，芬威克树包含权重最多为 w 的每个顶点。 子树范围查询对子树内的此类顶点进行计数。 顶点本身也包含在内，因此最后减一是必要的。 

公式为`score`已经包括了同等重量的后代`desc_le`。 在实现中没有单独的等权项，因为

 #(\text{有重量的后代}\le w_i)。 
]

 Python 整数具有任意精度，这在这里很有用，因为中间对计数为 θ(n²)，在最大输入大小时约为 1.25 × 10^1。 

最终排序使用`score * (n + 1) + depth`作为单个整数键。 这避免了为每个顶点分配一个二元素元组。 分数是主键，而深度只解析相等的分数。 

## 工作示例

 官方的样本是```
4
4 1 2 3
1 2
2 3
2 4
```DFS 给出深度 0、1、2、2 和子树大小 4、3、1、1。祖先更大计数和后代小于或等于计数为：

 | 顶点| 深度 | 子树大小 | 更大的祖先| 后代 ≤ 体重 | 分数 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 4 | 0 | 3 | 3 |
 | 2 | 1 | 3 | 1 | 0 | 2 |
 | 3 | 2 | 1 | 1 | 0 | 4 |
 | 4 | 2 | 1 | 1 | 0 | 4 |

 基线是

 [
 \binom42 + (0+1+1+1)=6+3=9。 
]

 排序后的分数为 4、4、3、2。 

| k | 精选乐谱 | 前缀分数 | (\binom{k}{2}) | 回答 |
 | --- | --- | --- | --- | --- |
 | 0 | 无 | 0 | 0 | 9 |
 | 1 | 4 | 4 | 0 | 5 |
 | 2 | 4, 4 | 8 | 1 | 2 |
 | 3 | 4, 4, 3 | 11 | 11 3 | 1 |
 | 4 | 4, 4, 3, 2 | 13 | 6 | 2 |

 这再现了官方输出`9 5 2 1 2`。 k = 1, 2, 3 时选择的顶点可以是顶点 3，然后是 3 和 4，然后是 1、3 和 4，与语句中描述的方案匹配。 

对于第二个示例，考虑等权链。```
3
1 1 1
1 2
2 3
```每对祖先的权重都是相等的，所以春日和阿虚都不喜欢任何祖先对。 当一切都在 A 中时，唯一的成本是深度和。 

| 顶点| 深度 | 子树大小 | 更大的祖先| 后代 ≤ 体重 | 分数 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 0 | 3 | 0 | 2 | 2 |
 | 2 | 1 | 2 | 0 | 1 | 2 |
 | 3 | 2 | 1 | 0 | 0 | 2 |

 所有分数都相等，因此递减深度首先选择顶点 3，然后选择顶点 2，最后选择顶点 1。 

| k | 选定的顶点 | 前缀分数 | (\binom{k}{2}) | 回答 |
 | --- | --- | --- | --- | --- |
 | 0 | 无 | 0 | 0 | 3 |
 | 1 | 3 | 2 | 0 | 1 |
 | 2 | 3, 2 | 4 | 1 | 0 |
 | 3 | 3, 2, 1 | 6 | 3 | 0 |

 打破平局在这里至关重要。 如果在顶点3之前选择顶点1，则所选择的集合将不会在等权重之间向下封闭，并且简化的得分公式将不再正确地表示等权对奖励。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 一次树遍历、一次权重排序、两次 Fenwick 扫描和一次最终排序 |
 | 空间| O(n) | 树存储、欧拉数据、分数、排序数组和 Fenwick 树 |

 主要操作是两次 Fenwick 扫描和分类操作。 当 n = 500,000 时，O(n log n) 是 2 秒 C++ 限制的预期规模，而 1024 MB 的大内存余量为 Python 实现使用的线性辅助数组留出了空间。 

## 测试用例```python
# The solution code above should be placed in the same file before these tests.
# The test harness calls solve() with redirected stdin/stdout.

import sys
import io
from contextlib import redirect_stdout

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    try:
        with redirect_stdout(out):
            solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return out.getvalue() + ("\n" if out.getvalue() and not out.getvalue().endswith("\n") else "")

# Official sample
sample = """\
4
4 1 2 3
1 2
2 3
2 4
"""
assert run(sample) == "9\n5\n2\n1\n2\n", "official sample"

# Minimum-size input
minimum = """\
1
7
"""
assert run(minimum) == "0\n0\n", "single vertex"

# Equal weights on a chain
equal_chain = """\
3
1 1 1
1 2
2 3
"""
assert run(equal_chain) == "3\n1\n0\n0\n", "equal-weight chain"

# Equal weights on a branching tree
equal_star = """\
4
1 1 1 1
1 2
1 3
1 4
"""
assert run(equal_star) == "6\n3\n1\n0\n0\n", "equal-weight branching tree"

# Boundary weights and strict inequalities
boundary = """\
2
500000 1
1 2
"""
assert run(boundary) == "2\n0\n0\n", "maximum and minimum weights"

# Maximum-size test, all weights equal, chain.
# For an equal-weight chain, the answer for k B-vertices is
# C(n-k, 2), so the expected output can be generated directly.
n = 500000
weights = " ".join(["1"] * n)
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
maximum_input = f"{n}\n{weights}\n{edges}\n"

expected = "\n".join(
    str((n - k) * (n - k - 1) // 2)
    for k in range(n + 1)
) + "\n"

assert run(maximum_input) == expected, "maximum-size all-equal chain"
```自定义测试执行推导的不同部分。 单顶点情况检查根深度约定和所有空对边界。 等重链检查特殊的配对类型和基于深度的平局决胜。 等权星检查等权后代之间的分支。 边界权重情况检查严格与非严格比较。 最大尺寸链在 k 的整个范围内检查可扩展性和公式。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 7`|`0 0`| 最小 n 和根深度 |
 | 3 个顶点的等权链 |`3 1 0 0`| 平等的祖先权重和打破平局|
 | 4 个顶点的等权星 |`6 3 1 0 0`| 分支等重后代|
 | 两个带有权重的顶点`500000 1`|`2 0 0`| 严格的重量比较和边界值|
 | n = 500000 的等权链 | (\binom{500000-k}{2}) | 最大 n 和线性内存实现 |

 ## 边缘情况

 对于单顶点输入```
1
7
```DFS 分配深度为零，子树大小为一。 没有祖先，也没有后代，所以两者`anc_greater`和`desc_le`为零。 分数为 (1-1=0)，基线为 (\binom12=0)。 k = 0 和 k = 1 都会产生零。 

对于等重链```
3
1 1 1
1 2
2 3
```每个祖先比较都具有相同的权重，因此较大祖先的计数全部为零。 分数均为 2，因为第一个顶点有两个合格的后代，第二个顶点有一个后代加上其子树外部的一个顶点，第三个顶点有其子树外部的两个顶点。 三场比赛比分均平。 按深度递减排序给出的顺序为 3、2、1，因此每个前缀都是向下封闭的。 结果答案是 3, 1, 0, 0。 

对于同等重量的恒星```
4
1 1 1 1
1 2
1 3
1 4
```根的得分为 3，因为它具有三个等权的后代，并且每个叶子的得分也为 3，因为三个顶点位于其子树之外。 深度决胜局将所有叶子放在根之前。 对于 B 中的两个顶点，选择两个叶子，在 A 中留下根和一个叶子，因此成本恰好是剩余叶子的深度 1。对于 B 中的三个顶点，选择所有叶子，而 A 仅包含根，给出零。 

对于严格边界情况```
2
500000 1
1 2
```根的权重大于其子节点的权重，因此当两个顶点都在 A 中时，该对是 A 侧惩罚。基线为 (\binom22+1=2)。 孩子的得分为 2，因此为 B 选择它会将成本降低到零。 选择 B 的两个顶点的成本也为零，因为 Kyon 只不喜欢权重小于其后代的祖先，这在这里是错误的。 

对于最大尺寸等权链，每对顶点都是祖先对，因此不会受到对惩罚。 唯一的成本是 A 中剩余顶点的深度之和。最优 B 集由最深的 k 个顶点组成，将前 n-k 个顶点留在 A 中。它们的深度总和为

 \frac{(n-k)(n-k-1)}2.
 ]

 该实现的公式产生完全相同的表达式，确认二次校正和等权打破平局即使在最大输入大小下也能正确运行。
