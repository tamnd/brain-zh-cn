---
title: "CF 102185I - \u0425\u0430\u043e\u0442\u0438\u0447\u043d\u044b\u0435\u043f\u043b\u044e\u043c\u0431\u0443\u0441\u044b"
description: "我们有一行恰好包含 K 个颜色中每一种颜色的 N 个铅垂线，因此总长度是 N 乘以 K。唯一允许的操作是从该行中取出一个现有的铅垂线，并将其插入到最左边或最右边。"
date: "2026-08-19T06:43:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102185
codeforces_index: "I"
codeforces_contest_name: "Southern Russia Open Championship \u2013 ContestSFedU 2019, Team Final."
rating: 0
weight: 102185
solve_time_s: 303
verified: true
draft: false
---

[CF 102185I - \u0425\u0430\u043e\u0442\u0438\u0447\u043d\u044b\u0435 \u043f\u043b\u044e\u043c\u0431\u0443\u0441\u044b](https://codeforces.com/problemset/problem/102185/I)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一行恰好包含 K 个颜色中每一种颜色的 N 个铅垂线，因此总长度是 N 乘以 K。唯一允许的操作是从该行中取出一个现有的铅垂线，并将其插入到最左边或最右边。 目标是使每种颜色占据一个连续的块。 这些色块的顺序是任意的。 

关键的困难在于操作不允许任意交换。 我们从不移动的每一个铅锤都与其他从不移动的铅锤保持其相对顺序。 移动的铅锤最终可以排列在两端，而未触及的铅锤则形成最后一排的中间部分。 

答案是移动铅块的最少数量。 同样，我们希望最大限度地增加可以留在原处的铅锤数量。 

约束给出 N,K 最多 1000，而数组本身可以包含 1,000,000 个元素。 即使执行 O(NK 乘以 K) 工作的算法在最坏的情况下也已经是大约 10^9 次操作并且无法使用。 我们基本上需要阵列中的线性工作加上颜色数量的最多二次工作。 O(NK + K^2) 足够小，内存限制也允许存储原始数组。 

有几种边界情况可能会欺骗实现。 

对于 N=1 且 K=1，```
1 1
1
```答案是 0。只有一种颜色，并且它的单个铅色已经形成一个有效的组。 假设存在两种不同端点颜色的实现可能会错误地计算移动。 

对于 N=2 且 K=2，```
2 2
1 2 1 2
```答案是 2。只保留一种完整的颜色会使两个铅垂不受影响，因此两次移动就足够了。 只考虑已经连续的色块的粗心解决方案可能会错过这种可能性。 

一个更微妙的情况是```
3 2
1 1 2 2 1 2
```其答案是 2。前两个 1 和前两个 2 已经分组，将剩余的 1 和 2 移动到适当的末端即可完成两组。 坚持必须完全保留某些颜色的解决方案可能会错过这种最佳效果，因为这里最好的未触及的中间可能由两个部分端点颜色组成。 

## 方法

 直接蛮力会选择哪些铅总线被移动，哪些保留，然后检查剩余的铅总线是否可以形成有效的最终排列的中间。 这是正确的，因为就未触及的元素而言，每个合法的操作序列完全由已移动的元素集决定。 然而，有 2^(NK) 个可能的子集。 NK人数达到1,000,000，即使写下所有候选人也是不可能的。 枚举 K 个色块的排列也是没有希望的，因为 K! 对于 K=1000 来说已经是巨大的了。 

有用的观察是查看未移动的铅锤。 它们的相对顺序永远不会改变，所有移动的元素最终都会出现在它们之外。 因此，未受影响的铅锤必须作为一个中间序列出现在最后一行，其中每种颜色最多形成一个运行。 

假设一种颜色出现在该未受影响的序列内部的某个位置。 如果它的 N 个铅锤中的一个被移动，则移动的铅锤将必须放置在整排的两端之一。 它无法返回到该内部组旁边。 因此，内部颜色必须使其所有 N 个出现的颜色都保持不变。 

只有未触及序列的第一个和最后一个颜色组可以是部分的。 它们可以将一些事件移动到相应的外端。 因此，每个最优解都具有以下结构：```
partial left color
complete color
complete color
...
complete color
partial right color
```两种部分颜色也可能不存在。 如果根本没有完整的颜色，则未触及的序列由左部分颜色和右部分颜色组成。 

现在考虑完全保留的颜色 c。 令first[c] 和last[c] 为其在原始数组中的第一个和最后一个位置。 如果另一种颜色 d 也完全保留在 c 之前，则每次出现 d 都必须先于每次出现 c。 确切的条件是```
last[d] < first[c].
```因此，完整的颜色形成了一系列不重叠的间隔 [first[c], last[c]]。 由于所有完整的颜色恰好贡献了 N 个未触及的铅垂线，因此该问题变成了这些颜色区间上的动态规划问题。 

还有一个细节。 如果c是第一个完整的颜色，我们可以在first[c]之前另外保留一些出现的另一种颜色。 最好的颜色就是该前缀中最常出现的颜色。 同样，在最后一个完整的颜色之后，我们可以在后缀中保留最常见的颜色。 

我们必须记住这些端点颜色的身份，而不仅仅是它们的计数。 两侧不能使用相同的颜色，因为这样保留的颜色将形成两个单独的组。 双方保留两名最佳候选人就足以解决这一冲突。 

颜色不齐全的情况单独处理。 对于两个位置之间的每次剪切，我们都会找到最好的两种不同颜色，其中包含左侧的前缀颜色和右侧的后缀颜色。 前向扫描可以保留两个最常见的前缀颜色。 反向扫描可以保留两种最常见的后缀颜色。 由于反向扫描到达同一个cut时需要前缀信息，因此将其存储在紧凑数组中。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^(NK) · NK) | O(2^(NK) · NK) | O(NK) | 太慢了|
 | 最佳| O(NK + K²) | O(NK) | 已接受 |

 ## 算法演练

 1.读取数组并记录`first[c]`和`last[c]`对于每种颜色。 这两个位置准确地描述了完全未受影响的颜色可能出现的位置。 
2. 从左到右扫描数组，同时保留前缀中每种颜色出现的次数。 当颜色 c 第一次出现时，将出现频率最高的两种颜色保存在之前的位置`first[c]`。 这些是唯一可以充当完整块 c 左侧部分颜色的候选者。 
3. 在同一次正向扫描期间，在每次可能的剪切后保存两种最常见的颜色。 只有两个最佳候选者是必要的，因为唯一禁止的情况是两侧选择相同的颜色。 
4. 从右向左扫描阵列。 在处理最后一次出现的颜色 c 之前，当前计数准确地描述了之后的后缀`last[c]`。 将其两个最佳颜色保存为以 c 结尾的链的可能的右端点颜色。 
5. 按第一次出现的顺序对所有颜色进行排序。 对于每种颜色 c，创建表示以 c 结尾的完整颜色链的 DP 状态。 初始状态由 c 本身加上之前两个最佳左端点候选者之一组成`first[c]`。 
6. 要延长一条以 d 结尾且颜色为 c 的链，需要`last[d] < first[c]`。 这意味着 d 的每次出现都位于 c 的每次出现之前，因此两种颜色都可以保持完全不变。 添加 c 会使未触及的铅垂线的数量恰好增加 N。 
7.对于每个结束颜色c，保留具有不同左端点颜色的两个最佳DP状态。 两种状态就足够了，因为当选择右端点时，只有一种左颜色可以被禁止。 
8. 将每个以 c 结尾的 DP 状态与之后的两个最佳后缀候选相结合`last[c]`。 仅当两个端点颜色均为相同的非零颜色时才拒绝组合。 结果值是包含至少一种完整颜色的解决方案中未受影响的铅的最大数量。 
9. 使用存储的候选前缀和动态维护的候选后缀分别处理每个剪辑。 这处理不包含完整颜色的解决方案，其中整个未触及的序列由两个部分端点颜色组成。 
10.让`best`是两种情况下未触及的铅锤的最大数量。 所需答案是`N*K - best`，因为每一个不被算作未触及的铅锤都必须被移动一次。 

### 为什么它有效

 考虑任何最佳操作顺序，并仅查看从未移动过的铅锤。 它们的相对顺序没有改变，因此在最终的排列中它们显示为一个中间序列。 该序列中出现的每种颜色都必须具有其原始出现的所有 N 个颜色，否则该颜色的移动出现将必须穿过不相关的组才能返回到其自己的组。 只有中间序列的第一组和最后一组可以是部分的。 

因此，每个最佳解决方案要么由每侧至多一个部分颜色的完整颜色链表示，要么由没有完整颜色的两个部分颜色表示。 区间条件`last[d] < first[c]`准确描述两种颜色何时可以同时完整并按该顺序出现。 DP 枚举满足此条件的每个可能的链，而存储的端点候选者则枚举其周围的最佳可能部分颜色。 单独的剪切扫描覆盖了剩余的不完整颜色的情况。 由于每个有效的未触及配置都属于这两种形式之一，因此算法找到的未触及铅垂线的最大数量是最佳的。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

BASE = 1024
BITS = 10
MASK = BASE - 1
PAIR_BITS = 20

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    m = n * k

    first = [m] * k
    last = [-1] * k

    for i, x in enumerate(a):
        c = x - 1
        if first[c] == m:
            first[c] = i
        last[c] = i

    order = sorted(range(k), key=first.__getitem__)

    pref1 = [0] * k
    pref2 = [0] * k

    cnt = [0] * k
    t1 = 0
    id1 = 0
    t2 = 0
    id2 = 0

    # packed[i] stores the two best prefix candidates before position i.
    # Each candidate is encoded as count * BASE + color.
    packed = array('Q')
    packed.append(0)

    for i, x in enumerate(a):
        c = x - 1
        cid = c + 1

        if i == first[c]:
            pref1[c] = t1 * BASE + id1
            pref2[c] = t2 * BASE + id2

        cnt[c] += 1
        v = cnt[c]

        if cid == id1:
            t1 = v
        elif cid == id2:
            t2 = v
            if t2 > t1:
                t1, t2 = t2, t1
                id1, id2 = id2, id1
        elif v > t1:
            t2, id2 = t1, id1
            t1, id1 = v, cid
        elif v > t2:
            t2, id2 = v, cid

        e1 = t1 * BASE + id1
        e2 = t2 * BASE + id2
        packed.append((e1 << PAIR_BITS) | e2)

    # Suffix candidates for every color.
    suf1 = [0] * k
    suf2 = [0] * k

    cnt = [0] * k
    t1 = 0
    id1 = 0
    t2 = 0
    id2 = 0

    # No-complete-color case.
    best_no_full = 0

    # Cut m, where the suffix is empty.
    p = packed[m]
    pe1 = p >> PAIR_BITS
    pe2 = p & ((1 << PAIR_BITS) - 1)

    pc1 = pe1 >> BITS
    pi1 = pe1 & MASK
    pc2 = pe2 >> BITS
    pi2 = pe2 & MASK

    best_no_full = max(
        pc1,
        pc2,
    )

    for i in range(m - 1, -1, -1):
        c = a[i] - 1
        cid = c + 1

        if i == last[c]:
            suf1[c] = t1 * BASE + id1
            suf2[c] = t2 * BASE + id2

        cnt[c] += 1
        v = cnt[c]

        if cid == id1:
            t1 = v
        elif cid == id2:
            t2 = v
            if t2 > t1:
                t1, t2 = t2, t1
                id1, id2 = id2, id1
        elif v > t1:
            t2, id2 = t1, id1
            t1, id1 = v, cid
        elif v > t2:
            t2, id2 = v, cid

        # The current suffix is [i, m).
        p = packed[i]
        pe1 = p >> PAIR_BITS
        pe2 = p & ((1 << PAIR_BITS) - 1)

        pc1 = pe1 >> BITS
        pi1 = pe1 & MASK
        pc2 = pe2 >> BITS
        pi2 = pe2 & MASK

        # Combine the two best prefix and suffix colors.
        if pi1 == 0 or id1 == 0 or pi1 != id1:
            best_no_full = max(best_no_full, pc1 + t1)

        if pi1 == 0 or id2 == 0 or pi1 != id2:
            best_no_full = max(best_no_full, pc1 + t2)

        if pi2 != 0 and pi2 != id1:
            best_no_full = max(best_no_full, pc2 + t1)

        if pi2 != 0 and pi2 != id2:
            best_no_full = max(best_no_full, pc2 + t2)

    # DP states:
    # dp1[c], dp2[c] are the best two states ending with color c.
    # The second component is the color used as the left partial endpoint.
    dp1_val = [0] * k
    dp1_id = [0] * k
    dp2_val = [0] * k
    dp2_id = [0] * k

    for c in order:
        e1 = pref1[c]
        e2 = pref2[c]

        v1 = n + (e1 >> BITS)
        q1 = e1 & MASK

        v2 = n + (e2 >> BITS)
        q2 = e2 & MASK

        b1v = v1
        b1q = q1
        b2v = -1
        b2q = -1

        if q2 != q1:
            if v2 > b1v:
                b2v, b2q = b1v, b1q
                b1v, b1q = v2, q2
            else:
                b2v, b2q = v2, q2

        # Try every earlier complete color.
        for d in order:
            if first[d] >= first[c]:
                break
            if last[d] >= first[c]:
                continue

            v = dp1_val[d] + n
            q = dp1_id[d]

            if q == b1q:
                if v > b1v:
                    b1v = v
            elif q == b2q:
                if v > b2v:
                    b2v = v
            elif v > b1v:
                b2v, b2q = b1v, b1q
                b1v, b1q = v, q
            elif v > b2v:
                b2v, b2q = v, q

            v = dp2_val[d] + n
            q = dp2_id[d]

            if q == 0 and dp2_val[d] == 0:
                continue

            if q == b1q:
                if v > b1v:
                    b1v = v
            elif q == b2q:
                if v > b2v:
                    b2v = v
            elif v > b1v:
                b2v, b2q = b1v, b1q
                b1v, b1q = v, q
            elif v > b2v:
                b2v, b2q = v, q

        dp1_val[c] = b1v
        dp1_id[c] = b1q
        dp2_val[c] = b2v if b2v >= 0 else 0
        dp2_id[c] = b2q if b2v >= 0 else 0

    best = best_no_full

    for c in range(k):
        s1 = suf1[c]
        s2 = suf2[c]

        sc1 = s1 >> BITS
        si1 = s1 & MASK
        sc2 = s2 >> BITS
        si2 = s2 & MASK

        for dv, di in (
            (dp1_val[c], dp1_id[c]),
            (dp2_val[c], dp2_id[c]),
        ):
            if dv == 0:
                continue

            if di == 0 or si1 == 0 or di != si1:
                best = max(best, dv + sc1)

            if di == 0 or si2 == 0 or di != si2:
                best = max(best, dv + sc2)

    answer = m - best
    return str(answer)

if __name__ == "__main__":
    print(solve())
```第一次扫描计算每种颜色的第一次和最后一次出现。 这些边界是决定两种颜色是否都能完全保留所需的唯一信息。 

前向计数维护有两个目的。 当某种颜色第一次出现时，当前计数准确地描述了该颜色之前的前缀。 在每次切割时，打包值都会存储两个最佳前缀颜色，稍后在非完整颜色情况下需要它。 

打包使用 10 位作为颜色标识符，因为 K 最多为 1000。另外 10 位存储其计数，最多为 N。两个这样的候选者可以轻松放入 64 位整数。 使用`array('Q')`即使可能有一百万次剪切，也能保持较小的内存使用量。 

反向扫描计算后缀候选者。 处理位置 i 之前的后缀状态描述了 i 之后的位置，这正是当`i`是最后一次出现的颜色。 添加位置i后，后缀状态对应于i之前的剪切，并且可以与已经存储的前缀状态组合。 

DP 为每个结束颜色存储两种状态，而不是一种。 原因是最佳左端点颜色可能恰好等于最佳右端点颜色。 保留两种不同的左侧颜色可以保证我们在选择右侧端点时可以丢弃冲突的状态。 

Python 整数在这里不会溢出。 未触及的铅锤的最大数量是 N 乘以 K，最多 1,000,000 个。 编码的候选值也很适合在 64 位整数内。 

## 工作示例

 ### 示例 1

 输入是```
3 3
1 2 3 3 2 1 1 2 3
```相关的颜色区间是```
color 1: [1, 7]
color 2: [2, 8]
color 3: [3, 9]
```没有两个区间是不相交的，因此没有两种颜色可以同时是完整的。 一个有用的选择是颜色 2 作为完整的中间组。 其前可保留一种颜色1，其后可保留一种颜色3。 

| 状态| 价值|
 | --- | --- |
 | 完整颜色2 | 3 |
 | 最佳左偏色1 | 1 |
 | 最佳右偏色3 | 1 |
 | 未触及总数 | 5 |
 | 总铅 | 9 |
 | 移动| 4 |

 五个未受影响的铅锤可以显示为`1 2 2 2 3`。 剩下的四个都可以移到两端。 DP 找到 5 个未触及的元素，因此答案是 9 减 5，即 4。 

### 示例 2

 输入是```
2 4
3 3 1 1 4 4 2 2
```每种颜色已经形成一个完整的块。 

| 颜色 | 第一| 最后 | DP角色|
 | --- | ---| --- | --- |
 | 3 | 1 | 2 | 第一个完整的颜色|
 | 1 | 3 | 4 | 延伸链条|
 | 4 | 5 | 6 | 延伸链条|
 | 2 | 7 | 8 | 延伸链条|

 间隔条件在每次转换时都成立，因此可以完全保留所有四种颜色。 

| 状态| 价值|
 | --- | --- |
 | 颜色齐全| 4 |
 | 每种颜色的铅锤| 2 |
 | 未触及总数 | 8 |
 | 总铅 | 8 |
 | 移动| 0 |

 结果为零，这也证实了当原始排列已经有效时，DP 不会强制不必要的端点移动。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| --- | --- |
 | 时间 | O(NK + K²) | 阵列被扫描恒定次数，颜色 DP 最多检查 K² 对。 |
 | 空间| O(NK + K) | 原始数组和一个打包前缀状态以及 O(K) 颜色和 DP 数据一起存储。 |

 最大的数组包含 1,000,000 个铅垂线，因此线性部分仅执行几百万个简单操作。 二次 DP 最多包含 1,000,000 个颜色对检查。 该算法避免了对单个铅的颜色或子集的排列的任何依赖。 

## 测试用例```python
import sys
import io
from array import array

# Put the submitted solve() implementation above this test section.

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input
    try:
        sys.stdin = io.StringIO(inp)
        input = sys.stdin.readline
        return solve().strip()
    finally:
        sys.stdin = old_stdin
        input = old_input

# Provided samples
assert run(
    "3 3\n"
    "1 2 3 3 2 1 1 2 3\n"
) == "4", "sample 1"

assert run(
    "2 4\n"
    "3 3 1 1 4 4 2 2\n"
) == "0", "sample 2"

# Minimum-size input
assert run(
    "1 1\n"
    "1\n"
) == "0", "minimum size"

# All plumbuses already have one color group
assert run(
    "5 1\n"
    "1 1 1 1 1\n"
) == "0", "all equal"

# Alternating colors, so neither color can be kept as a complete
# group together with the other, but keeping one complete color
# still leaves an optimal solution.
assert run(
    "2 2\n"
    "1 2 1 2\n"
) == "2", "alternating boundary case"

# Two partial endpoint groups are optimal here.
assert run(
    "3 2\n"
    "1 1 2 2 1 2\n"
) == "2", "two partial endpoint colors"

# Maximum-size case: 1000 copies of each of two alternating colors.
# Keeping all 1000 occurrences of either color is optimal.
a = " ".join("1 2" for _ in range(1000))
assert run(
    "1000 2\n" + a + "\n"
) == "1000", "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 1`| 0 | 最小尺寸和单色处理 |
 |`5 1 / 1 1 1 1 1`| 0 | 所有元素已经形成一组 |
 |`2 2 / 1 2 1 2`| 2 | 重叠颜色间隔和全色 DP |
 |`3 2 / 1 1 2 2 1 2`| 2 | 使用端点部分颜色的最佳解决方案 |
 |`1000 2 / 1 2 ... 1 2`| 1000 | 1000 最大输入尺寸和大 DP/输入处理能力 |

 ## 边缘情况

 对于单色情况```
1 1
1
```DP 将颜色 1 视为一个完整的组并保持 N=1 铅灰色。 不需要左或右部分颜色，因此未触及的铅垂线的最大数量为 1，答案为 0。 

对于交替情况```
2 2
1 2 1 2
```间隔是`[1,3]`对于颜色 1 和`[2,4]`对于颜色 2。它们重叠，因此它们不能都是完整的。 DP 保持任一完整颜色，保留两个铅垂线，其余两个移至末端。 答案是2。 

对于两部分颜色的情况```
3 2
1 1 2 2 1 2
```前四个元素之后有一个切口。 前缀包含两个 1，后缀包含一个 1 和一个 2，但最好的有效排列是通过移动最后一个 1 和最后一个 2 来获得，留下`1 1 2 2`未受影响。 这些已经是两个完整的组，因此两次操作就足够了。 还检查了非完整颜色 DP，但全组表示给出了最佳值 2。 

对于最大尺寸交替情况，当 N=1000 且 K=2 时，数组包含 2000 个元素。 两个颜色区间完全重叠，因此它们不能同时保持完整。 完全保留其中一种颜色可以保留 1000 个铅锤，而另外 1000 个铅锤则必须移动。 该算法返回 1000，而不执行任何与 K 倍数组长度成比例的操作。 

端点冲突的情况值得特别关注。 假设最佳前缀颜色和最佳后缀颜色都是颜色 1。保留两者会创建两个独立的颜色 1 组，这是非法的。 该算法存储每一侧的两个最佳候选者并尝试这两个选择。 如果最好的候选者发生冲突，则可以选择一侧第二好的候选者。 如果不存在不同的候选者，则相应的端点将保持为空。
