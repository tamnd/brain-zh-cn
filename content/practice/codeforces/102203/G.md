---
title: "CF 102203G - \u0417\u0430\u043f\u0443\u0442\u044b\u0432\u0430\u043d\u0438\u0435\u0441\u043b\u0435\u0434\u043e\u0432"
description: "只有 8 个区，因此每个智能体都可以用 8 × 8 的二进制转移矩阵来表示。 对于特工 (k)，当该特工可以将 Rick 和 Vallona 从区 (u) 带到区 (v) 时，条目 (Ak[u][v]) 为 1。"
date: "2026-08-18T11:20:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102203
codeforces_index: "G"
codeforces_contest_name: "\u0427\u0435\u0442\u0432\u0435\u0440\u0442\u0430\u044f \u041b\u0438\u043f\u0435\u0446\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e (8-11 \u043a\u043b\u0430\u0441\u0441\u044b)"
rating: 0
weight: 102203
solve_time_s: 200
verified: true
draft: false
---

[CF 102203G - \u0417\u0430\u043f\u0443\u0442\u044b\u0432\u0430\u043d\u0438\u0435 \u0441\u043b\u0435\u0434\u043e\u0432](https://codeforces.com/problemset/problem/102203/G)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 只有 8 个区，因此每个智能体都可以用 8 × 8 的二进制转移矩阵来表示。 对于特工 (k)，当该特工可以将 Rick 和 Vallona 从区 (u) 带到区 (v) 时，条目 (A_k[u][v]) 为 1。 

对于查询 ([l,r,s,t])，代理必须按固定顺序 (l,l+1,\ldots,r) 使用。 如果我们将它们的矩阵写为 (A_l,A_{l+1},\ldots,A_r)，那么可能的路线数正是 ((s,t)) 条目

 [
 A_lA_{l+1}\c点 A_r
 ]

 其中乘法是普通矩阵乘法以 998244353 为模。乘法对每个可能的中间区域进行求和，因此单个矩阵乘积对每个不同的路径恰好计数一次。 Codeforces 问题页面上给出了官方的约束和示例。 

输入最多包含 (10^5) 个代理和 (2\cdot10^5) 个查询。 直接扫描一个查询可以触及 (10^5) 个矩阵，当重复 (2\cdot10^5) 次时，这已经太多了。 即使是自然动态编程版本，它维护一个 8 元素向量并在 64 次标量运算中应用一个二进制矩阵，也可以达到

 [
 2\cdot10^5\cdot10^5\cdot64=1.28\cdot10^{12}
 ]

 标量运算。 传统的线段树将每个查询的矩阵乘积数量减少到 (O(\log n))，但每个乘积都是完整的 8 × 8 矩阵乘法，因此 Python 仍然会执行大量工作。 

查询中的异常情况是关键。 没有查询间隔正确包含在另一个查询间隔内。 如果两个区间按其左端点排序，并且第一个区间的右端点大于第二个区间，则第二个区间将包含在第一个区间中。 因此，按 (l) 排序后，右端点也是非递减的。 相等的左端点可以简单地通过增加右端点来排序。 

这意味着查询的范围可以被视为滑动窗口。 左端点仅向右移动，右端点仅向右移动。 我们需要一个数据结构来维护序列的乘积，同时支持右侧追加和左侧删除。 标准的两栈滑动窗口聚合结构完全适用于任何关联运算，包括非交换矩阵乘法。 

有几种边缘情况很容易被错误处理。 长度为 1 的区间必须直接返回相应的矩阵条目。 例如，```
1 1
9223372036854775808
1 1 1 1
```只有转换 (1\to 1)，所以答案是`1`。 将查询视为具有空产品会错误地返回单位矩阵条目，而不是实际的代理转换。 

路线可能会重新访问同一地区，包括立即访问。 例如，```
2 1
9223372036854775808
9223372036854775808
1 2 1 1
```有一个根，(1\to 1\to 1)，所以答案是`1`。 假设每次移动都必须改变区域的解决方案将错误地丢弃这条路线。 

最后，矩阵可能根本不包含任何转换。 例如，```
1 1
0
1 1 1 1
```有答案`0`。 意外使用零代理的单位矩阵，或者将空乘积单位与实际的零转移矩阵混淆的实现将在这种情况下失败。 

## 方法

 最直接的正确方法是独立处理每个查询。 从一个 8 元素向量开始，在起始区域包含 1，在其他区域包含 0。 对于从 (l) 到 (r) 的每个智能体，将此向量乘以该智能体的二元转移矩阵。 在最后一个代理之后，(t)对应的分量就是答案。 这是正确的，因为在处理前 (k) 个代理之后，向量存储了到达这些代理之后到达每个区域的方式数量。 

问题是重复扫描。 一个查询可以包含 (10^5) 个代理，并且可以有 (2\cdot10^5) 个查询。 最坏的情况是大约 (1.28\cdot10^{12}) 标量向量矩阵运算，远远超出了限制。 

标准范围乘积数据结构会将线段的乘积存储在线段树中。 然后，查询可以组合 (O(\log n)) 预先计算的矩阵。 该代数是完全有效的，因为矩阵乘法是结合的，但它没有利用特殊的查询条件。 使用 (2\cdot10^5) 次查询和大约 17 个树级别，即数百万次 8 × 8 矩阵乘法。 

决定性的观察结果是查询在排序后形成单调序列。 左边界永远不会向后移动，右边界也不会向后移动。 因此，我们可以将当前查询间隔准确地维护为代理矩阵的 FIFO 序列。 

障碍在于矩阵乘法一般来说是不可逆的。 如果当前乘积是 (A_lA_{l+1}\cdots A_r)，则不能通过乘以逆数来移除 (A_l)，因为 (A_l) 可能是单数。 两栈聚合队列完全避免了这种情况。 每个堆栈都存储部分产品，因此删除最旧的元素只需要在相反的堆栈变空时重建它。 每个矩阵最多在堆栈之间移动一次，从而为每个窗口更新提供摊销常数的许多幺半群操作。 这与通常称为 SWAG 的滑动窗口聚合思想相同。 

针对这个问题还有另一个有用的优化。 每个原始代理矩阵都是二进制的。 将代理添加到堆栈聚合时，一个操作数始终是二进制的，因此乘法可以作为所选行或列的总和来执行，而不是 64 个普通模乘法。 下面的代码使用了这种优化。 当回答查询时，我们甚至不需要两个堆栈聚合的整个乘积。 我们只需要一项，因此将两个聚合组合起来只需 8 个乘加项。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(mn\cdot8^2)) | (O(8^2)) | 太慢了|
 | 线段树| (O(m\log n\cdot8^3)) | (O(n\cdot8^2)) | 正确，但不必要地昂贵 |
 | 最佳 SWAG | (O(n\cdot8^3+m\cdot8)) | (O(n\cdot8^2+m)) | 已接受 |

 由于 8 是固定常数，因此最佳复杂度实际上是 (O(n+m)) 矩阵运算。 

## 算法演练

 1. 将每个 64 位输入数字转换为其 8 × 8 二进制矩阵。 我们存储它的 8 个行掩码和 8 个列掩码，以及展平的 64 个条目。 这些掩码让我们可以将任意聚合乘以二元代理矩阵，而无需执行不必要的标量乘法。 
2. 读取所有查询并按以下顺序排序`(l, r)`。 原始顺序与每个查询一起存储，以便稍后可以恢复答案。 按 (l) 排序足以使 (r) 非递减，因为查询族不包含正确的嵌套。 
3. 维护一个精确包含当前属于正在处理的查询的代理的滑动窗口。 它的两个端点是`left`和`right`。 最初窗口是空的。 
4. 要将窗口向右扩展，请附加每个新代理，直到`right`等于当前查询的 (r)。 返回堆栈存储新追加的矩阵。 它的聚合是该堆栈中所有矩阵按时间顺序排列的乘积。 
5. 要向前移动左端点，请从窗口前面删除矩阵，直到`left`等于当前查询的 (l)。 如果前面的堆栈非空，则可以简单地弹出最旧的矩阵。 如果为空，则将每个矩阵从后堆栈移动到前堆栈。 颠倒它们的顺序使得最旧的矩阵成为前端堆栈的顶部元素。 
6. 重建前堆栈时，从最旧的矩阵到最新的矩阵重新计算其聚合。 如果新矩阵是 (A)，之前的聚合是 (P)，则新聚合是 (A P)，而不是 (P A)。 顺序很重要，因为矩阵乘法不可交换。 
7. 窗口表示([l,r])后，其乘积最多被分成两个聚合。 如果两个堆栈都存在，则完整的产品是`front_product * back_product`。 如果一堆是空的，则其聚合已经是整个产品。 
8. 仅需要请求的条目 ((s,t))。 如果两个聚合是 (F) 和 (B)，则计算

 [
 (FB)[s][t]=\sum_{k=0}^{7}F[s][k]B[k][t]。 
]

 这仅需要八次标量乘法。 

1. 将答案存储在查询的原始索引下。 处理完所有排序的查询后，按原始顺序打印答案。 

### 为什么它有效

 不变的是，在回答查询 ([l,r]) 之前，两个堆栈一起准确地按该顺序表示矩阵 (A_l,A_{l+1},\ldots,A_r)。 后堆栈按时间顺序将其矩阵存储在其聚合中，而前堆栈将其矩阵从最旧到最新存储在其聚合中。 当后堆栈转移到前堆栈时，物理反转将堆栈顺序更改为时间顺序，并且每个新的前聚合形成为（AP），保留乘积顺序。 因此，两个聚合表示的乘积始终恰好是 (A_lA_{l+1}\cdots A_r)。 因此，所请求的矩阵条目精确地计算从 (s) 到 (t) 的路线。 

摊销界限如下，因为每个代理都被追加一次，并且每当重建前端堆栈时，每个移动的代理在弹出之前都会被传输一次。 代理不能在单调滑动窗口下重复来回传输。 因此，堆栈聚合更新的总数在 (n) 中是线性的。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 998244353

# Positions of set bits for every 8-bit mask.
BIT_POS = [()]
for mask in range(1, 256):
    cur = []
    x = mask
    while x:
        b = x & -x
        cur.append(b.bit_length() - 1)
        x -= b
    BIT_POS.append(tuple(cur))

def parse_agent(x):
    rows = [0] * 8
    cols = [0] * 8
    flat = [0] * 64

    # Bit 63 is matrix position (0, 0), bit 0 is (7, 7).
    for p in range(64):
        bit = (x >> (63 - p)) & 1
        if bit:
            i = p >> 3
            j = p & 7
            rows[i] |= 1 << j
            cols[j] |= 1 << i
            flat[p] = 1

    return (tuple(rows), tuple(cols), tuple(flat))

def mul_right_binary(a, cols):
    """
    Compute A * B, where A is a general 8x8 matrix and B is binary.
    """
    out = array('I', [0]) * 64

    for i in range(8):
        base = i << 3
        for j in range(8):
            pos = BIT_POS[cols[j]]

            if not pos:
                continue

            if len(pos) == 1:
                value = a[base + pos[0]]
            else:
                value = 0
                for k in pos:
                    value += a[base + k]
                value %= MOD

            out[base + j] = value

    return out

def mul_left_binary(rows, b):
    """
    Compute A * B, where A is binary and B is a general 8x8 matrix.
    """
    out = array('I', [0]) * 64

    for i in range(8):
        pos = BIT_POS[rows[i]]
        base = i << 3

        if not pos:
            continue

        if len(pos) == 1:
            src = pos[0] << 3
            for j in range(8):
                out[base + j] = b[src + j]
        else:
            for j in range(8):
                value = 0
                for k in pos:
                    value += b[(k << 3) + j]
                out[base + j] = value % MOD

    return out

def entry_product(a, b, s, t):
    """
    Return (A * B)[s][t], without constructing A * B.
    """
    base_a = s << 3
    value = 0

    for k in range(8):
        value += a[base_a + k] * b[(k << 3) + t]

    return value % MOD

def solve():
    n, m = map(int, input().split())

    agents = []
    for _ in range(n):
        agents.append(parse_agent(int(input())))

    queries = []
    for idx in range(m):
        l, r, s, t = map(int, input().split())
        queries.append((l - 1, r - 1, s - 1, t - 1, idx))

    # For non-nested intervals, sorting by l makes r nondecreasing.
    queries.sort(key=lambda q: (q[0], q[1]))

    # Each entry is (raw_agent, aggregate_of_stack).
    #
    # Back stack:
    #   top is the newest element.
    #   aggregate is product from oldest to newest.
    #
    # Front stack:
    #   top is the oldest element.
    #   aggregate is product from oldest to newest.
    back = []
    front = []

    left = 0
    right = -1

    answers = [0] * m

    for ql, qr, s, t, idx in queries:
        while right < qr:
            right += 1
            raw = agents[right]

            if back:
                old_agg = back[-1][1]
                agg = mul_right_binary(old_agg, raw[1])
            else:
                agg = raw[2]

            back.append((raw, agg))

        while left < ql:
            if not front:
                # Transfer back -> front.
                while back:
                    raw, _ = back.pop()

                    if front:
                        old_agg = front[-1][1]
                        agg = mul_left_binary(raw[0], old_agg)
                    else:
                        agg = raw[2]

                    front.append((raw, agg))

            front.pop()
            left += 1

        if front:
            f = front[-1][1]

            if back:
                b = back[-1][1]
                answers[idx] = entry_product(f, b, s, t)
            else:
                answers[idx] = f[(s << 3) + t]
        else:
            b = back[-1][1]
            answers[idx] = b[(s << 3) + t]

    sys.stdout.write('\n'.join(map(str, answers)))

if __name__ == "__main__":
    solve()
```这`parse_agent`函数完全遵循语句的位顺序。 最高有效位表示矩阵位置((0,0))，因此位置`p`使用位`63 - p`。 这是错误答案的常见来源，因为将最低有效位视为第一个矩阵元素会反转整个编码。 

这`rows`和`cols`掩码包含优化乘法例程所需的二进制结构。 为了`A * B`与二进制`B`，每个输出条目是从一行中选择的条目的总和`A`，其中选定的索引由列掩码确定`B`。 对称思想用于`A * B`什么时候`A`是二进制的。 

这两个堆栈包含原始代理和属于该堆栈前缀的聚合。 后向聚合更新为`old_aggregate * new_agent`。 前面的聚合被重建为`new_agent * old_aggregate`，因为转移的代理比前端堆栈中已有的所有内容都旧。 

该代码在回答查询时故意避免构造前聚合和后聚合的乘积。 只需要一个矩阵条目，因此`entry_product`直接计算相应的八项点积。 

这`array('I')`type 将聚合条目存储为 32 位无符号整数而不是 Python 整数对象。 每个值都会以 998244353 为模减少，因此四个字节就足够了。 当窗口包含接近 (10^5) 个矩阵时，这会大大减少内存消耗。 

Python整数具有任意精度，因此在普通算术中不存在溢出问题。 对最多八项求和后的显式模数使聚合条目保持在模数以下，而最终查询点积也会以所需值的模数减少。 

## 工作示例

 官方的样例是：```
3 3
9241386504218214000
4692768438333080000
4620710844295152000
1 2 3 4
1 3 1 3
3 3 1 2
```其输出为：```
0
1
1
```第一个查询使用代理 1 和 2。代理 1 没有来自区域 3 的传出转换，因此路由计数立即变为零。 第二个查询使用所有三个代理并具有唯一的路由 (1\to2\to3)。 第三个查询仅使用代理 3 并具有唯一的转换 (1\to2)。 这些正是官方样本结果。 

对于滑动窗口行为，考虑两个代理形成一条链：```
2 3
4611686018427387904
9007199254740992
1 1 1 2
1 2 1 3
2 2 2 3
```第一个数字仅代表 (1\to2)，第二个数字仅代表 (2\to3)。 

| 查询 | 更新后的窗口 | 前台产品| 返回产品 | 回答 |
 | --- | --- | --- | --- | --- |
 |`[1,1]`,`1 -> 2`|`[1]`| 空 | (A_1) | 1 |
 |`[1,2]`,`1 -> 3`|`[1,2]`| (A_1) | (A_2) | 1 |
 |`[2,2]`,`2 -> 3`|`[2]`| (A_2) | 空 | 1 |

 第一个查询之后，窗口仅包含代理 1。第二个查询扩展了右边界，因此代理 2 被推入后台堆栈。 (A_1A_2) 的请求条目是一。 第三个查询将左边界从 1 移动到 2，因此代理 1 从前面删除，剩余的聚合正好是 (A_2)。 

第二个示例演示了重复访问和重复查询范围：```
2 3
9223372036854775808
9223372036854775808
1 2 1 1
1 2 1 1
2 2 1 1
```两个代理都只有转换 (1\to1)。 

| 查询 | 左| 对| 当前路线 | 回答 |
 | --- | --- | --- | --- | --- |
 | 第一| 1 | 2 | (1\to1\to1) | (1\to1\to1) | 1 |
 | 第二 | 1 | 2 | (1\to1\to1) | (1\to1\to1) | 1 |
 | 第三| 2 | 2 | (1\to1) | (1\to1) | 1 |

 重复查询不会引起任何特殊问题，因为排序处理可以连续回答相同的窗口。 重复的区域也被保留，因为从区域到其自身的矩阵过渡是完全有效的边。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\cdot8^3+m\cdot8)) | 每个代理推送一次，最多传输一次，而每个查询只需要 8 项点积 |
 | 空间| (O(n\cdot8^2+m)) | 堆栈聚合包含恒定大小的 8 × 8 矩阵，并且存储所有查询以进行排序 |

 因子 (8^3=512) 由问题固定，因此渐近行为与代理和查询的数量呈线性关系。 两个端点的单调性阻止了代理被重复插入和删除。 在 Python 实现中，通过将聚合矩阵存储在紧凑的 32 位数组中来处理 256 MB 内存限制。 

## 测试用例```python
# The following tests assume the solution code above has already been defined.
# The helper temporarily replaces the global input/output streams.

import sys
import io

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        input = old_input
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Official sample
sample = """\
3 3
9241386504218214000
4692768438333080000
4620710844295152000
1 2 3 4
1 3 1 3
3 3 1 2
"""
assert run(sample) == "0\n1\n1", "official sample"

# Minimum-size input
minimum = """\
1 1
9223372036854775808
1 1 1 1
"""
assert run(minimum) == "1", "single agent, single self-loop"

# Zero matrix and impossible transitions
zero = """\
1 2
0
1 1 1 1
1 1 8 8
"""
assert run(zero) == "0\n0", "zero transition matrix"

# Boundary and off-by-one test.
# Agent 1: 1 -> 2
# Agent 2: 2 -> 3
chain = """\
2 4
4611686018427387904
9007199254740992
1 1 1 2
1 2 1 3
2 2 2 3
1 2 1 2
"""
assert run(chain) == "1\n1\n1\n0", "chain and interval boundaries"

# Equal matrices and repeated visits.
same = """\
3 3
9223372036854775808
9223372036854775808
9223372036854775808
1 3 1 1
1 2 1 1
2 3 2 2
"""
assert run(same) == "1\n1\n0", "equal matrices and repeated district"

# Maximum number of agents, with one query.
# Every agent has no transitions, so every answer is zero.
n = 100000
max_n = str(n) + " 1\n" + ("0\n" * n) + "1 " + str(n) + " 1 1\n"
assert run(max_n) == "0", "maximum n"

# Maximum number of queries, with n = 1.
# Every query asks for the same self-loop.
m = 200000
max_m = "1 " + str(m) + "\n9223372036854775808\n"
max_m += ("1 1 1 1\n" * m)
assert run(max_m) == ("1\n" * m).rstrip("\n"), "maximum m"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`， 一`1 -> 1`过渡|`1`| 最小尺寸和长度-一个间隔|
 | 一零矩阵 |`0`,`0`| 不可能的过渡和地区边界`8`|
 | 二代理链|`1`,`1`,`1`,`0`| 左右端点更新，包括删除第一个代理 |
 | 三个相同的自循环矩阵 |`1`,`1`,`0`| 重复访问、相等矩阵、无过渡的起始区 |
 | (n=100000，m=1) |`0`| 最大代理人数 |
 | (n=1,m=200000) | 200000 行包含`1`| 查询和重复相同窗口的最大数量 |

 ## 边缘情况

 对于长度为一的区间，滑动窗口恰好包含一个矩阵。 假设输入是```
1 1
9223372036854775808
1 1 1 1
```二进制数只有第一位设置，因此矩阵包含 (A[1][1]=1)。 右边界前进到智能体1，左边界不动。 因此，返回堆栈包含一个等于 (A_1) 的聚合，并且答案读取其`(1,1)`直接进入。 结果是`1`。 

对于零转移矩阵，```
1 1
0
1 1 1 1
```解析器创建八个零行掩码和八个零列掩码。 单一总量也为零。 它是`(1,1)`输入为零，所以答案是`0`。 由于窗口不为空，因此没有引入单位矩阵。 

对于重复访问，请考虑```
2 1
9223372036854775808
9223372036854775808
1 2 1 1
```两个矩阵都只包含 (1\to1)。 聚合为(A_1A_2)，其`(1,1)`输入为 (1\cdot1=1)。 路线 (1\to1\to1) 仅计数一次。 该算法并不假设连续的地区必须不同。 

最微妙的边界情况是移动左端点。 在```
2 1
4611686018427387904
9007199254740992
2 2 2 3
```所需的窗口只有代理 2。处理首先通过代理 2 扩展右端点，因此两个代理都暂时进入该窗口。 然后`left`从 0 移动到 1，并且最旧的代理被删除。 剩余的聚合正好是（A_2），给出答案`1`。 这就是代码使用的原因`while left < ql`而不是仅比较端点一次。 

重复查询间隔也是有效的，因为该限制禁止适当的包含，而不是重复相同的查询。 如果两个连续的查询都要求`[1,2]`，排序使它们相邻，并且第二个查询根本不执行窗口移动。 它只是再次读取相同的两个堆栈聚合。 

二进制编码是另一个边界敏感的细节。 对于唯一边为 (1\to2) 的矩阵，第一行是`01000000`，对应于整数 (2^{62}=4611686018427387904)。 解析器的使用`63 - p`是将十进制值映射到第 1 行第 2 列，而不是第 8 行第 7 列。颠倒的位顺序将使涉及非对称矩阵的每个测试失败。
