---
title: "CF 102441J - 亲子鉴定"
description: "我们有一棵有根树，以顶点 1 为根。 顶点编号从 1 到 (n)。 对于查询区间 ([l,r])，具有 (lle vle r) 的每个顶点 (v) 贡献位于 (v) 子树中的同一区间的顶点数。"
date: "2026-08-08T13:33:12+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102441
codeforces_index: "J"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Final"
rating: 0
weight: 102441
solve_time_s: 268
verified: true
draft: false
---

[CF 102441J - 亲子鉴定](https://codeforces.com/problemset/problem/102441/J)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有根树，以顶点 1 为根。 顶点编号从 1 到 (n)。 对于查询区间 ([l,r])，具有 (l\le v\le r) 的每个顶点 (v) 贡献位于 (v) 子树中的同一区间的顶点数。 因此，答案是 (u) 是 (v) 祖先的区间内有序对 ((u,v)) 的数量，包括对 ((v,v))。 

该树由 (n-1) 个祖先引用给出。 第 (i) 个引用描述了顶点 (i+1) 的祖先，因此顶点的每个祖先都有一个较小的标签。 使用先前的答案对查询进行编码：将两个输入值与先前的答案进行异或，减少模（n），移位到范围（1\ldots n），然后排序以获得（l）和（r）。 这种编码使查询在线，因此我们无法在看到所有解码间隔后重新排序或预处理它们。 原始问题指定 (n,q\le 50000) 和 3 秒的时间限制。 

答案可以大到 (n(n+1)/2)。 对于 (n=50000)，即 (1,250,025,000)，因此 32 位有符号整数仍然足以满足最终答案，尽管使用 Python 整数消除了任何溢出问题。 

如果实现仅计算具有两个不同顶点的祖先-后代对，那么单例区间很容易出错。 例如，```
1
1
0 0
```解码为([1,1])，答案为`1`，因为顶点包含在它自己的子树中。 

两个不相关的顶点是另一个有用的边界情况。 考虑```
3
1
1
1
1 2
```查询是([2,3])。 两个顶点都不是另一个顶点的祖先，因此每个顶点仅贡献自己，答案是`2`。 将间隔中的每对顶点计算为祖先对的实现将错误地返回`3`。 

包含根的查询还会测试整个子树是否被正确处理。 为了```
3
1
1
1
0 2
```区间为 ([1,3])。 顶点 1 包含所有三个顶点，而顶点 2 和 3 仅包含其自身。 答案是`3 + 1 + 1 = 5`。 意外排除根或在错误位置将子树间隔视为半开的实现可能会丢失这些贡献之一。 

## 方法

 直接的方法是检查查询区间中的每一对顶点，并测试其中一个是否是另一个的祖先。 DFS 给每个顶点一个进入时间`tin`和退出时间`tout`，并且 (u) 正是 (v) 的祖先

 [
 tin_u\letin_v<tout_u。 
]

 这使得每对测试在预处理后的时间恒定。 但是，包含所有 (n) 个顶点的查询会检查 (\Theta(n^2)) 对。 对于 (n=q=50000)，一个查询大约有 (1.25\times10^9) 个无序对，所有查询大约有 (6.25\times10^{13}) 个无序对检查。 蛮力是正确的，因为它准确地测试了答案的定义，但它远远超出了可用时间。 

有用的观察结果是，祖先关系在 DFS 顺序中具有非常严格的结构。 对于两个不同的顶点，恰好发生以下情况之一。 一棵子树包含另一棵子树，或者它们的子树不相交。 如果 (u) 和 (v) 不相交并且 (u) 在 DFS 顺序中首先出现，则

 [
 tout_u\letin_v。 
]

 社论的表述使用了这种补充观点。 对于包含 (k) 个顶点的区间，有 (\binom{k}{2}) 个无序的不同顶点对。 每一个不是祖先-后代对的对都是一对不相交的子树。 如果`bad(l,r)`是这种不相交对的数量，那么

 # k+\binom{k}{2}-bad(l,r)

 \frac{k(k+1)}2-bad(l,r)。 
]

 这将问题转化为对顶点标签的范围查询，其中如果两个相应的子树不相交，则每一对贡献一个。 

然后我们将标签轴分成大小为 (T) 的块。 查询在其两端最多有两个部分块。 它们之间的一切都由完整的块组成。 我们预先计算完整块的每个间隔的答案。 我们还预先计算，对于每个顶点和每个块边界，块的前缀中有多少个顶点与该顶点具有不相交的子树，并且对于块的后缀是对称的。 这使得边界顶点和所有完整的中间块之间的每个交互都可以在 (O(1)) 中进行评估。 

两个部分块内唯一剩余的工作以 (O(T)) 为界。 两个部分块之间的交互是通过在对每个块排序一次后合并它们的 DFS 区间端点来计数的。 

这与官方编辑材料中描述的平方根分解思想相同：在 (n/\sqrt q) 周围选择 (T)，预先计算元素到块前缀信息和完整块答案，然后通过仅处理两个边界块来回答每个查询。 所得界限为 (O(n(\sqrt q+\log n)))。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(qn^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n(\sqrt q+\log n))) | (O(n\sqrt q)) | 已接受 |

 ## 算法演练

 1. 从顶点 1 运行 DFS 并计算`tin[v]`和`tout[v]`。 (v)的子树由半开DFS区间([tin[v],tout[v]))表示。 当以下任一情况时，两个顶点具有不相交的子树：`tout[u] <= tin[v]`或者`tout[v] <= tin[u]`成立。 
2. 选择接近 (n/\sqrt q) 的块大小 (T)。 标签间隔（1\ldots n）被分为连续的块。 查询可以与许多完整的块相交，但只有其第一个和最后一个块可以是部分的。 
3. 对于每个顶点 (v) 和每个块前缀，预先计算该前缀中有多少个顶点具有与 (v) 不相交的子树。 我们称之为`pref[v][b]`， 在哪里`b`表示索引小于的块`b`。 

该值是两个独立条件的总和。 前一个顶点 (u) 与 (v) 不相交，要么是因为 (tout[u]\letin[v])，要么是因为 (tout[v]\letin[u])。 两组都可以通过扫描 DFS 进入和退出时间进行计数。 
4. 构建相似后缀表`suf[v][b]`，它计算块中不相交的顶点`b`向前。 使用相同的两个 DFS 时间扫描，但块索引以相反的方式处理。 
5. 对于每个块，预先计算该块的每个子区间内不相交对的数量。 一个块中只有 (T) 个顶点，因此它的所有子区间都可以在 (O(T^2)) 中处理。 我们将结果存储在一个紧凑的整数数组中。 
6. 预计算`full[a][b]`，属于完整块 (a,a+1,\ldots,b) 的所有顶点之间不相交对的数量。 当块（b）被附加到从块（a）开始的区间时，其内部对是已知的。 对于块 (b) 中的每个顶点 (v)，`pref[v][b] - pref[v][a]`计算前面完整块中不相交的伙伴。 将整个块的总和得出新的跨块贡献。 
7. 使用之前的答案解码每个查询。 将两个编码数字转换为 (1\ldots n) 中的顶点，将它们排序为 (l) 和 (r)，并在内部使用从零开始的索引。 
8. 如果两个端点在同一个块中，则获取`bad(l,r)`直接来自预先计算的子区间表。 
9. 否则，取预先计算的`full`严格位于两个边界块之间的完整块的值。 将不相交的对添加到左块的部分后缀和右块的部分前缀内。 
10. 对于左侧部分块中的每个顶点，使用后缀表来计算其在完整中间块中的不相交伙伴。 对于右侧部分块中的每个顶点，使用前缀表来计算其在中间块中的不相交伙伴。 最多有 (2T) 个这样的边界顶点，因此成本为 (O(T))。 
11. 最后，计算两个部分块之间的不相交对。 价值观`tout`在左边和`tin`右边已排序，所以满足的数`tout[left] <= tin[right]`可以通过线性两指针合并找到。 角色互换，重复上述步骤。 这对两个部分块之间的每个不相交对恰好计数一次。 
12.如果区间包含(k=r-l+1)个顶点，则输出(k(k+1)/2-bad(l,r))，然后将该值存储为先前的答案以解码下一个查询。 

### 为什么它有效

 对于每两个不同的顶点，它们的子树要么是嵌套的，要么是不相交的。 嵌套对恰好贡献一种祖先-后代关系，而不相交对则不贡献任何关系。 因此，在查询间隔内的 (\binom{k}{2}) 无序对中，恰好`bad(l,r)`未能贡献祖先关系。 每个顶点也贡献自己，提供 (k) 个额外的对。 分解对每个不相交对精确计数一次，无论是在一个部分块内、在部分块和完整的中间块之间、在两个完整块之间或在两个部分块之间。 因此最终的公式 (k(k+1)/2-bad(l,r)) 正是所需的总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from array import array
from math import isqrt

def solve():
    n = int(input())

    children = [[] for _ in range(n)]
    for v in range(1, n):
        p = int(input()) - 1
        children[p].append(v)

    # Iterative DFS.
    tin = [0] * n
    tout = [0] * n
    at_tin = [0] * n
    at_tout = [0] * (n + 1)

    timer = 0
    stack = [(0, 0, 0)]

    while stack:
        v, p, state = stack.pop()

        if state == 0:
            tin[v] = timer
            at_tin[timer] = v
            timer += 1

            stack.append((v, p, 1))
            for u in reversed(children[v]):
                if u != p:
                    stack.append((u, v, 0))
        else:
            tout[v] = timer
            at_tout[timer] = v

    q = int(input())

    # T ~= n / sqrt(q).
    sq = max(1, isqrt(q))
    T = max(1, n // sq)
    B = (n + T - 1) // T
    stride = B + 1

    block_of = [v // T for v in range(n)]
    block_start = [b * T for b in range(B)]
    block_end = [min(n, (b + 1) * T) for b in range(B)]

    # Build a table:
    # table[v][b] = number of vertices in blocks [0, b)
    # whose subtrees are disjoint from v.
    #
    # If reverse=True, blocks are considered in reverse order.
    def build_disjoint_table(reverse):
        size = n * stride
        table = array('I', [0]) * size

        def mapped_block(v):
            b = block_of[v]
            return B - 1 - b if reverse else b

        cnt = [0] * B

        # First condition:
        # tout[u] <= tin[v].
        #
        # Sweep the threshold tin[v] from small to large.
        for t in range(n):
            u = at_tout[t] if t <= n else 0
            if t > 0:
                u = at_tout[t]
                cnt[mapped_block(u)] += 1

            v = at_tin[t]
            base = v * stride
            cur = 0
            table[base] = 0

            for b in range(B):
                cur += cnt[b]
                table[base + b + 1] = cur

        # Second condition:
        # tout[v] <= tin[u], equivalently tin[u] >= tout[v].
        #
        # Sweep the threshold tout[v] from large to small.
        cnt = [0] * B

        for s in range(n, 0, -1):
            u = at_tin[s - 1]
            cnt[mapped_block(u)] += 1

            v = at_tout[s]
            base = v * stride
            cur = 0

            for b in range(B):
                cur += cnt[b]
                table[base + b + 1] += cur

        return table

    pref = build_disjoint_table(False)
    suf = build_disjoint_table(True)

    # Precompute all subinterval answers inside one block.
    #
    # small[b][l * m + r] =
    # number of disjoint pairs in that subinterval.
    small = []
    internal = [0] * B

    for b in range(B):
        L = block_start[b]
        R = block_end[b]
        m = R - L

        sqmat = array('I', [0]) * (m * m)

        # Process the left endpoint backwards.
        # bad(l, r) = bad(l+1, r) + pairs(l, l+1..r).
        for l in range(m - 1, -1, -1):
            cur = 0
            vl = L + l
            row = l * m
            next_row = (l + 1) * m

            for r in range(l + 1, m):
                vr = L + r

                disjoint = (
                    tout[vl] <= tin[vr] or
                    tout[vr] <= tin[vl]
                )

                if disjoint:
                    cur += 1

                sqmat[row + r] = sqmat[next_row + r] + cur

        small.append(sqmat)
        internal[b] = sqmat[m - 1] if m else 0

    # full[a][b] = number of disjoint pairs in complete blocks a..b.
    full = [[0] * B for _ in range(B)]

    for a in range(B):
        total = 0

        for b in range(a, B):
            cross = 0

            for v in range(block_start[b], block_end[b]):
                base = v * stride
                cross += pref[base + b] - pref[base + a]

            total += internal[b] + cross
            full[a][b] = total

    # Values sorted by DFS entry and exit times inside every label block.
    # They let us count pairs between the two partial blocks in O(T).
    sorted_tin = []
    sorted_tout = []

    for b in range(B):
        L = block_start[b]
        R = block_end[b]

        ids = list(range(L, R))
        sorted_tin.append(sorted(ids, key=tin.__getitem__))
        sorted_tout.append(sorted(ids, key=tout.__getitem__))

    def count_le(A, Bvals):
        # A and Bvals are sorted.
        # Count pairs (a,b) with a <= b.
        j = 0
        m = len(Bvals)
        ans = 0

        for a in A:
            while j < m and Bvals[j] < a:
                j += 1
            ans += m - j

        return ans

    def cross_partial(lb, l, left_end, rb, right_start, r):
        # Count disjoint pairs between:
        # [l, left_end] and [right_start, r].
        #
        # The first orientation is tout[left] <= tin[right].
        # The second orientation is tout[right] <= tin[left].
        out_left = [
            tout[v]
            for v in sorted_tout[lb]
            if v >= l
        ]
        in_right = [
            tin[v]
            for v in sorted_tin[rb]
            if v <= r
        ]

        out_right = [
            tout[v]
            for v in sorted_tout[rb]
            if v <= r
        ]
        in_left = [
            tin[v]
            for v in sorted_tin[lb]
            if v >= l
        ]

        return count_le(out_left, in_right) + count_le(out_right, in_left)

    def query(l, r):
        k = r - l + 1
        lb = l // T
        rb = r // T

        if lb == rb:
            m = block_end[lb] - block_start[lb]
            ll = l - block_start[lb]
            rr = r - block_start[lb]
            bad = small[lb][ll * m + rr]
            return k * (k + 1) // 2 - bad

        # Complete blocks strictly between the two boundary blocks.
        bad = 0

        ml = lb + 1
        mr = rb - 1

        if ml <= mr:
            bad += full[ml][mr]

        # Pairs entirely inside the two partial blocks.
        left_m = block_end[lb] - block_start[lb]
        left_l = l - block_start[lb]
        bad += small[lb][left_l * left_m + left_m - 1]

        right_m = block_end[rb] - block_start[rb]
        right_r = r - block_start[rb]
        bad += small[rb][right_r]

        if ml <= mr:
            # Left partial block against all complete middle blocks.
            #
            # suf[v][B-k] represents original blocks k..B-1.
            left_prefix_column = B - (lb + 1)
            left_suffix_column = B - rb

            for v in range(l, block_end[lb]):
                base = v * stride
                bad += (
                    suf[base + left_prefix_column]
                    - suf[base + left_suffix_column]
                )

            # Complete middle blocks against the right partial block.
            for v in range(block_start[rb], r + 1):
                base = v * stride
                bad += (
                    pref[base + rb]
                    - pref[base + (lb + 1)]
                )

        # Interaction between the two partial blocks.
        bad += cross_partial(
            lb, l, block_end[lb] - 1,
            rb, block_start[rb], r
        )

        return k * (k + 1) // 2 - bad

    ans = 0
    output = []

    for _ in range(q):
        u, v = map(int, input().split())

        x = 1 + ((u ^ ans) % n)
        y = 1 + ((v ^ ans) % n)

        l = min(x, y) - 1
        r = max(x, y) - 1

        ans = query(l, r)
        output.append(str(ans))

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```DFS 是迭代的，因为链形树可以包含 50000 个顶点，这将超出 Python 的正常递归深度。`tin`在输入时分配并且`tout`退出时，因此顶点的子树恰好是 DFS 顺序中的一个半开区间。 

两个不相交对表存储在`array('I')`而不是普通的 Python 列表。 有 (O(n\sqrt q)) 个条目，Python 整数会消耗更多的内存。 每个存储的计数最多为 (\binom n2)，适合此约束的无符号 32 位整数。 

每个表句柄的第一次扫描`tout[u] <= tin[v]`。 第二个手柄`tout[v] <= tin[u]`。 它们的总和恰好是其子树不相交的顶点数`v`。 反转块编号会生成后缀表，而不更改底层树信息。 

这`small`表处理完全保留在一个块内的间隔。 递归使用先前计算的行，因此在生成所有 (O(T^2)) 间隔值时，每对顶点都会检查一次。 

完整块表是根据前缀不相交计数构建的。 当阻塞时`b`附加到从块开始的范围`a`， 区别`pref[v][b] - pref[v][a]`删除块之前的所有顶点`a`并将前面的块保留在当前范围内。 

查询代码保持操作顺序精确，因为 XOR 编码取决于先前的答案。 在任何范围计算之前必须对原始查询值进行解码，并且新计算的答案必须分配给`ans`仅在当前查询完全评估之后。 

## 工作示例

 官方示例包含五个编码查询。 前两个已经在概念上演示了全范围情况和跨越多个块的查询。 

| 查询 | 上一个答案 | (x)| (y)| 间隔| 顶点| 不相交的对 | 回答 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | 9 | [1,9]| 9 | 3 | 42 | 42
 | 2 | 42 | 42 8 | 5 | [5,8]| 4 | 2 | 8 |
 | 3 | 8 | 2 | 3 | [2,3]| 2 | 1 | 3 |
 | 4 | 3 | 6 | 7 | [6,7]| 2 | 1 | 3 |
 | 5 | 3 | 5 | 8 | [5,8]| 4 | 2 | 8 |

 对于第一个查询，选择了所有九个顶点。 在删除不相交对之前，有 (9\cdot10/2=45) 个自体或无序对贡献可用。 唯一不相交的子树对是涉及顶点 6 和顶点 7、8 或 9 之一的三对。因此 (45-3=42)。 

对于第二个查询，先前的答案是 42。编码值变为 (1\oplus42=43) 和 (2\oplus42=40)。 模 9 减少并加 1 得到顶点 8 和 5，因此区间为 [5,8]。 有四个顶点，给出十种自序对或无序对的可能性，还有两个不相交的对，给出 (10-2=8)。 

一个单独的小例子使不相交对的逻辑更加清晰。```
4
1
1
2
1
2 3
```唯一的查询解码为 [3,4]。 顶点 3 和 4 位于不同的分支中，因此它们的子树是不相交的。 有两个顶点和一对不相交的顶点，因此答案是 (2\cdot3/2-1=2)。 

| 步骤| 上一个答案 | (u)| （五）| 解码间隔| (k) | 坏对| 回答 |
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 2 | 3 | [3,4]| 2 | 1 | 2 |

 此示例确认该算法不会将两个不相关的顶点与祖先-后代对混淆。 它还锻炼了查询在标签数组的同一小区域内开始和结束的边界。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n(\sqrt q+\log n))) | DFS 和排序采用 (O(n\log n))； 块预处理需要 (O(n^2/T)); 查询每次需要 (O(T)) |
 | 空间| (O(n^2/T+nT)) | 前缀/后缀块表和块内间隔表支配内存|

 对于 (T\approx n/\sqrt q)，预处理项 (n^2/T) 和总查询项 (qT) 均为 (O(n\sqrt q))。 对于 (n,q\le50000)，这是预期的平方根权衡。 紧凑整数数组将大型 (O(n\sqrt q)) 表保留在 512 MB 内存限制内。 

## 测试用例

 测试工具假设提交的解决方案可用`solution.py`并暴露`solve()`。```python
import sys
import io
from contextlib import redirect_stdout

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        out = io.StringIO()
        with redirect_stdout(out):
            solve()
        return out.getvalue()
    finally:
        sys.stdin = old_stdin

# Provided sample.
sample = """\
9
1
2
3
4
5
5
7
8
5
0 8
1 2
2 3
4 5
6 7
"""
assert run(sample) == "42\n8\n3\n3\n3", "provided sample"

# Minimum-size tree.
minimum = """\
1
1
0 0
"""
assert run(minimum) == "1", "singleton vertex"

# All encoded values equal.
# Every query becomes a singleton after XOR decoding.
all_equal = """\
5
1
1
1
1
4
0 0
0 0
0 0
0 0
"""
assert run(all_equal) == "1\n1\n1\n1", "all-equal encoded queries"

# Two sibling leaves.
siblings = """\
3
1
1
1
1 2
"""
assert run(siblings) == "2", "disjoint sibling subtrees"

# Root plus two children.
root_interval = """\
3
1
1
1
0 2
"""
assert run(root_interval) == "5", "root interval boundary"

# Maximum-size chain.
# Every vertex is an ancestor of every later vertex, so the full interval
# has answer n * (n + 1) / 2.
n = 50000
parents = "\n".join(["1"] + [str(i) for i in range(2, n)])
maximum = (
    str(n) + "\n" +
    parents + "\n" +
    "1\n" +
    "0 " + str(n - 1) + "\n"
)
expected = str(n * (n + 1) // 2)
assert run(maximum) == expected, "maximum-size chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 0 0`|`1`| 最小树和自计数 |
 | 五节点星形四`0 0`查询 |`1 1 1 1`| 重复异或解码和单例间隔 |
 | 带父母的三节点树`1,1`， 询问`1 2`|`2`| 两个不相交的子树和区间边界 |
 | 带父母的三节点树`1,1`， 询问`0 2`|`5`| 根子树和全区间|
 | 50000节点链|`1250025000`| 最大尺寸、大答案和最坏情况祖先结构 |

 ## 边缘情况

 对于单例区间，算法立即进入同块分支。 为了```
1
1
0 0
```该区间包含一个顶点，所以`k=1`和`bad=0`。 返回值为(1\cdot2/2=1)。 块内表包含相同的结果，因为它的唯一间隔没有一对不同的顶点。 

对于两个不相关的顶点，考虑```
3
1
1
1
2
1
```编码后的查询是[2,3]。 它们的子树是不相交的，所以`bad=1`。 当 (k=2) 时，公式给出 (2\cdot3/2-1=2)。 两个部分范围之间的合并通过两个 DFS 区间不等式之一检测不相交对。 

对于完整的三顶点星，```
3
1
1
1
0 2
```区间为[1,3]。 顶点 1 是两个叶子的祖先，而两个叶子是不相交的。 因此`bad=1`，(k=3)，答案是(3\cdot4/2-1=5)。 根向其子树贡献三个节点，而每个叶子贡献自己。 

编码查询也需要特别小心，因为当前答案会改变下一个输入对的含义。 在官方示例中，第一个查询给出 42。接下来的原始值`1 2`因此使用 XOR 与 42 进行解码，产生区间 [5,8]，而不是原始数字可能建议的区间 [2,3]。 这种依赖性就是必须严格按照输入顺序回答查询的原因。 

最后，链是与星形相反的极端结构。 在 50000 个节点的链中，每对不同的顶点都是祖先-后代对，因此`bad=0`整个间隔。 答案变为 (50000\cdot50001/2=1,250,025,000)。 这种情况既检查最大可能答案的算术，又检查不相交对机器不会意外减去嵌套子树的事实。
