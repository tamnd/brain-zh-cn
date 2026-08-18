---
title: "CF 102219F - 军用级"
description: "我们有两排士兵，每排包含从 (1) 到 (n) 的位置。 第一排位置 (i) 的士兵必须与第二排的一名士兵恰好配对。"
date: "2026-08-17T22:54:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102219
codeforces_index: "F"
codeforces_contest_name: "2019 ICPC Malaysia National"
rating: 0
weight: 102219
solve_time_s: 180
verified: false
draft: false
---

[CF 102219F - 军事类](https://codeforces.com/problemset/problem/102219/F)

 **评级：** -
 **标签：** -
 **求解时间：** 3m
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两排士兵，每排包含从 (1) 到 (n) 的位置。 第一排位置 (i) 的士兵必须与第二排的一名士兵恰好配对。 当 (|i-j|\le e) 时，通常允许对 ((i,j))，并且明确禁止某些其他对。 

因此，完整的配对是 (1,\ldots,n) 的排列 (p)，其中第一行的士兵 (i) 与第二行的士兵 (p_i) 配对。 我们需要计算满足距离限制和每个显式禁止对限制的排列，模 (10^9+7)。 

关键约束是 (e\le4)。 (n) 的值可以达到 (2000)，因此二次方或更糟地依赖于 (n) 的解在一秒限制下已经让人感到不舒服，而任何阶乘则完全不可能。 然而，(e) 的值较小，意味着每个士兵最多只能与另一行中的 (2e+1\le9) 个位置交互。 有限的交互范围使得小的位掩码状态成为可能。 

在几种边界情况下，粗心的实现可能会默默地计算无效配对。 当 (e=0) 时，每个士兵都有一个可能的伙伴，所以```
1 0 0
```必须产生```
1
```尽管```
1 0 1
1 1
```必须产生```
0
```将禁止列表与距离限制分开处理的解决方案可能会意外地计算第二种情况下的身份配对。 

行的开头和结尾也很特殊，因为士兵周围的正常窗口延伸到范围 (1,\ldots,n) 之外。 例如，```
2 1 0
```有两个有效的配对，即 ((1,1),(2,2)) 和 ((1,2),(2,1))，所以答案是 (2)。 简单地假设窗口中的每个位置都是真正的士兵的掩码实现可以引入不存在的位置作为可能的伙伴。 

最后，必须对照正在处理的实际士兵来检查被禁止的一对，而不仅仅是对照面具中的位置。 为了```
2 1 1
1 2
```无限制答案是 (2)，但禁止配对 (1\to2)，仅留下一个有效配对。 仅检查列是否未使用但忽略禁止关系的转换会生成 (2) 而不是 (1)。 

## 方法

 直接的方法是生成第二排（n）个士兵的每个排列。 对于每个排列，检查所有 (n) 对并验证距离条件和禁止对条件。 这是正确的，因为两行之间的每个完全匹配都对应于一个排列。 

问题是排列的数量。 它们有 (n!) 个，检查一个排列需要 (O(n)) 时间，因此最坏情况的工作是 (O(n\cdot n!))。 在 (n=2000) 时，这意味着大约 (2000\cdot2000!) 配对检查，这远远超出了可以尝试的范围。 

暴力方法之所以有效，是因为它保留了整个匹配历史记录。 使更小的状态成为可能的观察结果是，当从左到右处理士兵时，士兵（i）只能使用从（i-e）到（i+e）的列。 一旦我们向右移动足够远，旧的柱子就再也不能使用了。 我们只需要记住这个狭窄的移动窗口内的哪些位置已经被占据了。 

该窗口中有 (2e+1) 个位置，最多 (9) 个。 我们可以使用最多包含 (9) 位的位掩码来表示它们的占用或空闲状态，从而给出最多 (2^9=512) 个状态。 对于每个第一排士兵，我们尝试窗口中的每个空闲位置，拒绝禁止对，然后将窗口向右移动一个位置。 

这一转变还为我们提供了一种强制每个第二排士兵最终都得到使用的方法。 当窗口移动时，其最左边的位置将永久消失。 如果该位置是真正的士兵并且其位仍然为零，则部分匹配永远无法完成，因此我们丢弃该状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n\cdot n!)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n\cdot 2^{2e+1}\cdot(2e+1)+k)) | (O(2^{2e+1}+k)) | 已接受 |

 ## 算法演练

 1. 将第一排士兵(i)的当前窗口表示为第二排位置
 [
 i-e,\ i-e+1,\ldots,i+e。 
]
 掩码的位(b)对应于位置(i-e+b)。 设置位意味着该位置已被占用，而未设置位意味着该位置仍然可用。

(1,\ldots,n) 之外的位置被视为已占用。 他们不是真正的士兵，因此任何过渡都不允许选择他们。 
2. 为每个第一排士兵建立一个禁止的位掩码。 如果((u,v))被禁止，并且(v)位于(u)的窗口内，则设置(v)对应的位。 然后，转换可以使用一位操作拒绝所有明确禁止的选择。 
3. 在处理士兵之前初始化掩码(1)。 它的窗口是
 [
 1-e,\l点,1+e。 
]
 (1) 以下的每个位置和 (n) 以上的每个位置一开始都是被占领的，因为这些位置与真实的士兵不对应。 该掩码的初始 DP 值为 (1)。 
4. 对于每个第一排士兵 (i)，迭代每个可到达的掩码。 对于每个零位 (b)，考虑将士兵 (i) 与
 [
 j=i-e+b。 
]
 这正是满足 (|i-j|\le e) 的合作伙伴集合，因此不会错过任何有效的合作伙伴。 
5. 如果位 (b) 已被占用或者相应的对 ((i,j)) 被禁止，则拒绝转换。 否则设置位 (b)，因为现在使用士兵 (j)。 
6. 在移动到下一行之前，需要设置最左边的位。 最左边的位表示位置 (i-e)。 处理完士兵(i)后，该位置将永远不会出现在以后的任何窗口中。 如果是未使用过的真兵，后面就没有机会匹配了，所以部分匹配必须丢弃。 
7. 将掩码右移一位，从 (i) 周围的窗口移动到 (i+1) 周围的窗口。 新的最右边位置是(i+e+1)。 如果它大于(n)，则立即设置它的位，因为它是一个不存在的位置。 否则不要设置它，因为它是一个新的、未使用的真实士兵。 
8、当士兵(n)处理完毕后，每个真正的第二排位置只有在被确认占据后才离开移动窗口。 所有剩余位置均位于行外并标记为已占用。 因此，每个位设置的完整掩码都准确地表示已完成的匹配。 它的DP值就是答案。 

### 为什么它有效

 不变的是，在处理第一（i）个士兵并移动窗口之后，小于当前窗口左端点的每个真实第二行位置都被恰好使用过一次，而掩码精确地记录了窗口中仍然可见的哪些位置已经被使用过。 转换为士兵 (i) 选择一个未使用的、允许的伙伴，因此它将每个有效的部分匹配恰好扩展一次。 对输出位的检查可以防止未使用的士兵永久消失。 由于未来的士兵只能在距离（e）内进行连接，因此当前窗口之外的信息不会影响任何未来的决策。 因此，每个幸存的 DP 状态都代表有效的部分匹配，并且每个有效的完整匹配都恰好遵循一个到完整掩码的转换序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    n, e, k = map(int, input().split())

    width = 2 * e + 1
    states = 1 << width
    full = states - 1
    top_bit = 1 << (width - 1)

    # banned[i] has a bit set for every forbidden second-row
    # position inside the window of first-row soldier i.
    banned = [0] * (n + 1)

    for _ in range(k):
        u, v = map(int, input().split())

        # Pairs outside the distance window can never be used anyway.
        if abs(u - v) <= e:
            bit = v - (u - e)
            if 0 <= bit < width:
                banned[u] |= 1 << bit

    # Before processing row 1, the window is [1-e, 1+e].
    # Positions outside [1,n] are considered already occupied.
    initial = 0
    for bit in range(width):
        col = 1 - e + bit
        if col < 1 or col > n:
            initial |= 1 << bit

    # For every mask, precompute which free bits can be selected,
    # together with the mask before inserting the new rightmost bit.
    transitions = [[] for _ in range(states)]

    for mask in range(states):
        free = full ^ mask
        while free:
            bit = free & -free
            free -= bit

            new_mask = mask | bit

            # The outgoing position must already be occupied.
            if new_mask & 1:
                transitions[mask].append(
                    (bit, new_mask >> 1)
                )

    dp = [0] * states
    dp[initial] = 1

    for i in range(1, n + 1):
        ndp = [0] * states
        forbidden = banned[i]

        # The new rightmost position after this transition.
        new_col = i + e + 1
        new_col_is_virtual = new_col > n

        for mask, value in enumerate(dp):
            if value == 0:
                continue

            for bit, shifted in transitions[mask]:
                if forbidden & bit:
                    continue

                nxt = shifted
                if new_col_is_virtual:
                    nxt |= top_bit

                x = ndp[nxt] + value
                if x >= MOD:
                    x -= MOD
                ndp[nxt] = x

        dp = ndp

    print(dp[full] % MOD)

if __name__ == "__main__":
    solve()
```输入阶段将每个禁止对转换为相应行的本地窗口内的一个位。 已经超出距离限制的禁止对可以被忽略，因为它们无论如何都无法参与有效的匹配。 

这`initial`mask 处理左边界。 例如，对于 (e=2)，第一个窗口是 ([-1,0,1,2,3])，因此前两个位置是虚拟的，并且以它们的位集开始。 

预先计算的`transitions`数组包含每个掩码转换的结构部分。 取决于当前输入行的唯一条件是所选位是否被禁止。 将这两部分分开可以避免为所有 (n) 行重复重建相同的掩码转换。 

支票`new_mask & 1`是关键的正确性条件。 当前士兵匹配完毕后，最左边的一栏即将消失。 它必须已经被占领，否则未来的第一排士兵就无法到达它。 

仅当新位置大于 (n) 时，才会设置新的最右边位。 这样的位置位于实际的第二行之外，并且永远不能选择，因此将其标记为已占用相当于将其从考虑中删除。 

Python 整数不会溢出，但所有 DP 加法仍会按模 (10^9+7) 进行缩减。 该实现使用两个一维数组，因此内存仅取决于掩码数量，而不是掩码数量的 (n) 倍。 

## 工作示例

 对于样品 1，```
2 1 0
```有两个有效的完整匹配。 这里(e=1)，所以每个掩码有三位。 第一个窗口是([0,1,2])，其中位置(0)是虚拟的。 

| 第一排士兵| 当前掩码| 所选栏目 | 轮班后戴口罩 | 意义|
 | ---| ---| ---| ---| ---|
 | 1 |`001`| 1 |`101`| 使用第 1 列 |
 | 1 |`001`| 2 |`110`| 使用第 2 列 |
 | 2 |`101`| 2 |`111`| 使用第 1 列和第 2 列 |
 | 2 |`110`| 1 |`111`| 使用第 1 列和第 2 列 |

 这两个分支完全对应于两个排列。 两者均以面膜结束`111`，所以答案是（2）。 该跟踪还说明了为什么虚拟位置必须以占据状态开始以及为什么最终状态是完整掩模。 

对于样品 2，```
2 1 1
1 2
```第一行位置（1）和第二行位置（2）之间的配对是禁止的。 

| 第一排士兵| 当前掩码| 候选人 | 结果 |
 | ---| ---| ---| ---|
 | 1 |`001`| 第 1 栏 | 接受，下一个面具`101`|
 | 1 |`001`| 第 2 栏 | 被禁止戴口罩拒绝|
 | 2 |`101`| 第 2 栏 | 接受，最终面具`111`|

 只有身份匹配才能生存。 答案是（1）。 此跟踪确认在添加 DP 转换之前将禁止对掩码应用于所选伙伴。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\cdot2^{2e+1}\cdot(2e+1)+k)) | 有 (n) 行，最多 (2^{2e+1}) 个掩码，每个掩码最多 (2e+1) 个伙伴选择 |
 | 空间| (O(2^{2e+1}+n+k)) | 两个 DP 数组、预先计算的转换和禁止的掩码 |

 由于(e\le4)，掩码的数量最多为(2^9=512)，每个状态最多有(9)个候选转换。 对于 (n\le2000)，DP 仅执行几百万次小状态操作，而禁止输入仅贡献 (O(k)) 预处理工作。 与 256 MB 限制相比，内存使用量也很小。 

## 测试用例```python
# This test harness assumes solve_data is the same algorithm as the
# solve() function above, but accepts a string and returns the answer.

import io
import sys

MOD = 1_000_000_007

def solve_data(data: str) -> str:
    it = iter(data.split())
    n = int(next(it))
    e = int(next(it))
    k = int(next(it))

    width = 2 * e + 1
    states = 1 << width
    full = states - 1
    top_bit = 1 << (width - 1)

    banned = [0] * (n + 1)

    for _ in range(k):
        u = int(next(it))
        v = int(next(it))
        if abs(u - v) <= e:
            bit = v - (u - e)
            if 0 <= bit < width:
                banned[u] |= 1 << bit

    initial = 0
    for bit in range(width):
        col = 1 - e + bit
        if col < 1 or col > n:
            initial |= 1 << bit

    transitions = [[] for _ in range(states)]

    for mask in range(states):
        free = full ^ mask
        while free:
            bit = free & -free
            free -= bit
            new_mask = mask | bit
            if new_mask & 1:
                transitions[mask].append((bit, new_mask >> 1))

    dp = [0] * states
    dp[initial] = 1

    for i in range(1, n + 1):
        ndp = [0] * states
        forbidden = banned[i]
        virtual_right = i + e + 1 > n

        for mask, value in enumerate(dp):
            if value == 0:
                continue

            for bit, shifted in transitions[mask]:
                if forbidden & bit:
                    continue

                nxt = shifted
                if virtual_right:
                    nxt |= top_bit

                ndp[nxt] = (ndp[nxt] + value) % MOD

        dp = ndp

    return str(dp[full])

# Provided sample 1
assert solve_data("2 1 0\n") == "2", "sample 1"

# Provided sample 2
assert solve_data("2 1 1\n1 2\n") == "1", "sample 2"

# Minimum size, only possible matching.
assert solve_data("1 0 0\n") == "1", "minimum size"

# Minimum size with its only pair forbidden.
assert solve_data("1 0 1\n1 1\n") == "0", "forbidden only pair"

# e = 0 means only the identity matching exists.
assert solve_data("5 0 0\n") == "1", "zero distance"

# e = 1, n = 3 gives identity, swap (1,2), or swap (2,3).
assert solve_data("3 1 0\n") == "3", "boundary window"

# Removing the (1,2) matching leaves two possibilities.
assert solve_data("3 1 1\n1 2\n") == "2", "forbidden boundary edge"

# For n = e + 1, every pair is allowed, so all 3! permutations work.
assert solve_data("3 2 0\n") == "6", "all positions allowed"

# Maximum n with the smallest state space.
assert solve_data("2000 0 0\n") == "1", "maximum n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0 0`|`1`| 最小大小实例和 (e=0) 身份情况 |
 |`1 0 1\n1 1`|`0`| 禁止对可以消除唯一匹配的 |
 |`5 0 0`|`1`| 零距离边界条件|
 |`3 1 0`|`3`| 移动窗口边界和几个有效的排列 |
 |`3 1 1\n1 2`|`2`| 禁止对位于允许窗口的边缘 |
 |`3 2 0`|`6`| 第二排每个位置均可到达 |
 |`2000 0 0`|`1`| 状态空间尽可能最小的最大值 (n) |

 ## 边缘情况

 当(e=0)时，每个第一排士兵只能使用具有相同索引的第二排士兵。 为了```
1 0 1
1 1
```初始掩码是`0`。 唯一的候选位对应于列 (1)，但禁止掩码包含该位，因此没有转换，最终的全掩码 DP 值为 (0)。 如果在转换期间不检查禁止的掩码，算法将错误地返回 (1)。 

在左边界，不存在的位置必须被视为已占用。 考虑```
2 1 0
```初始窗口为([0,1,2])，因此其初始掩码为`001`。 第一个士兵可以选择第（1）列或第（2）列。 在任一选择之后，传出虚拟列 (0) 已被占用，因此状态可以安全地向右移动。 这可以防止意外选择不存在的列 (0)。 

在右边界，进入窗口的新位置最终变得大于(n)。 在同一示例中，处理完第一个士兵后，新位置为 (3)，该位置不存在。 它的位立即被设置。 当处理第二个士兵时，该虚拟位置无法选择，而剩余的真实列仍然可以选择。 两个有效匹配因此都达到完整掩码。 

禁止对只能删除其他有效状态的一个分支。 为了```
2 1 1
1 2
```在考虑明确的限制之前，第一个士兵有两个可能的列。 删除到列 (2) 的过渡，仅留下列 (1)。 然后，第二个士兵被迫使用第 (2) 列，精确地给出一个完整的匹配。 

最终状态应该是完整的掩码，而不是任意幸存的掩码。 每个真实列在离开窗口之前都必须确认已被占用，而超出 (n) 的位置则明确插入为已占用。 因此，在最后一次移位之后，最终窗口中的所有（2e+1）个位置都被占用。 对于样本 1，最终状态是`111`，其DP值正是完全匹配的次数。
