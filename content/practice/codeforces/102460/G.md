---
title: "CF 102460G - 最佳选择"
description: "我们有一个由 (n) 个不同值组成的数组，但我们没有得到这些值本身。 相反，在选择算法开始之前，我们已经知道一些比较的结果。 对于每个给定的对 ((x,y))，我们知道 (a[x] < a[y])。"
date: "2026-08-09T18:27:36+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102460
codeforces_index: "G"
codeforces_contest_name: "2019-2020 ICPC Asia Taipei-Hsinchu Regional Contest"
rating: 0
weight: 102460
solve_time_s: 304
verified: true
draft: false
---

[CF 102460G - 最优选择](https://codeforces.com/problemset/problem/102460/G)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个由 (n) 个不同值组成的数组，但我们没有得到这些值本身。 相反，在选择算法开始之前，我们已经知道一些比较的结果。 对于每个给定的对 ((x,y))，我们知道 (a[x] < a[y])。 

任务不是找到一个特定数组的第 (k) 个元素。 假设该算法可以免费使用所有先前已知的比较，则要求我们提供任何基于比较的算法确定第 (k) 个最小数组元素所需的最小可能的最坏情况附加比较次数。 

将输入视为部分有序集的一种有用方法。 每个已知的比较都会给出一个有向关系 (x<y)，而传递性则免费给出更多关系。 例如，如果我们知道 (0<1) 和 (1<2)，那么我们也知道 (0<2)，即使该对从未明确给出。 

答案是最佳可能比较决策树的高度。 在每个内部节点，算法选择两个当前不可比较的元素并进行比较。 这两种可能的结果会导致两个较小的子问题。 一个节点的成本是其两个子节点的较大成本的一加上，因为输入可能会导致更糟糕的结果。 

小界限（n\le 8）完全改变了预期的方法。 数组的总排序最多有 (8!=40320) 个可能，因此我们可以显式表示每个可能的输入排序。 对于较大的 (n) 来说，这是没有希望的，但在这里它让我们将比较问题转化为精确的有限状态极小极大问题。 界限 (\ell\le n) 意味着最初已知的信息也很小，尽管传递性可以使其比给定对的数量强得多。 

当仅将明确给定的关系视为已知时，粗心的解决方案可能会失败。 例如，```
3 1 2
0 1
1 2
```有答案`0`。 由于 (0<1<2)，第一个元素已知是最小的。 忽略传递性的实现可能会错误地认为需要进行另一次比较。 

另一种微妙的情况是，即使已知多个关系，也无法唯一确定所需的元素。 为了```
3 2 1
0 1
```答案是`2`。 如果(2<0)，则顺序为(2<0<1)，所以答案为(0)。 如果(0<2)，我们还需要比较(1)和(2)。 简单地计算每个候选元素下面已知的元素数量的粗心实现可能会过早停止，而不考虑未来比较的两种可能结果。 

输入不包含实际数值，因此具有相等值的测试用例没有意义。 该问题明确假设所有数组元素都是不同的，并且该算法依赖于每个全排序都是没有关系的排列。 

## 方法

 最直接的暴力方法是枚举可能的比较策略。 有 (n(n-1)/2) 个可能的无序对，当 (n=8) 时最多 28 个。 策略是一个自适应二元决策树，其内部节点选择一对进行比较，其叶子标识第 (k) 个元素。 搜索所有这些树的成本太高了。 即使我们将自己限制在每对最多使用一次的序列中，最深层也仅包含

 [
 28！ =
 304888344611713860501504000000
 ]

 不同的比较顺序。 自适应决策树包含指数级更多的可能性，因为每次比较都可以创建两种不同的状态。 

不过，蛮力思想确实具有正确的概念结构。 比较不会揭示任意的信息。 它只是在两个元素之间添加一种关系。 经过多次比较，目前收集到的所有信息完全是偏序。 未来仅取决于哪些总订单与部分订单保持一致。 

这一观察结果使我们能够用信息状态的动态规划来取代决策树的巨大空间。 我们不直接存储偏序，而是存储与其一致的所有总排列的集合。 只有 40320 种排列，因此该集合自然适合位集。 

假设一个状态包含一些可能排列的集合（S）。 对于 (x,y) 对，预先计算包含 (x<y) 的每个排列的位集 (M_{x,y})。 比较 (x) 和 (y) 将状态分为

 [
 S_1=S\cap M_{x,y}
 ]

 和

 [
 S_2=S\set减去M_{x,y}。 
]

 如果一侧是空的，则比较不会提供新信息并且毫无用处。 否则这是合法的下一个比较。 

当每个剩余的排列将相同的元素放置在位置 (k) 时，状态完成。 到那时，答案已经确定，额外成本为零。 

这给出了精确的重现

 [
 dp(S)=
 1+\min_{x,y}
 \max\left(dp(S_1),dp(S_2)\right),
 ]

 其中最小值是实际分裂的比较结果 (S)。 

递归是精确的，因为每种可能的基于比较的算法都必须在当前状态下选择一些对，并且在比较之后，对手可以选择具有较大剩余成本的结果。 相反，根据递归选择最佳对会构造出具有恰好最坏情况高度的决策树。 

与蛮力方法的区别在于，许多不同的比较历史会导致相同的信息状态。 记忆化仅评估这种状态一次。 Python 整数在这里特别有用，因为 40320 位状态上的交集、补集和空性测试是作为高度优化的大整数运算实现的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 决策树数量呈指数级增长，最深序列级别已具有 (28!) 个比较序列 | 指数| 太慢了|
 | 最佳| (O(Sn^2B))，其中 (S) 是记忆状态的数量，(B=40320) 机器级位 | (O(SB)) | 已接受 |

 (S) 上的界限不是多项式，但这是故意的。 该问题要求精确的最优值并将 (n) 精确限制为 8，以便可以进行有限状态搜索。 

## 算法演练

1. 生成 (n) 个元素的每个排列。 排列表示数组从最小到最大的一种可能的完整排序。 自 (n\le8) 起，最多有 40320 个这样的排列。 
2. 为每个排列分配一位。 DP 状态是一个 Python 整数，其设置的位正是与迄今为止已知的所有信息一致的排列。 
3. 对于每个无序元素对，预先计算一个包含第一个元素小于第二个元素的所有排列的位集。 这使得比较成为一对整数位运算，而不是迭代所有排列。 
4. 通过从每个可能的排列开始并将其与对应于给定关系的掩码相交来构建初始状态。 如果输入为 (x<y)，则只有满足 (x<y) 的排列才能生存。 
5. 预先计算另外八个位组，每个位组对应每个可能的答案元素。 元素 (x) 的掩码恰好包含 (x) 占据位置 (k) 的排列。 
6. 对于 DP 状态，检查所有幸存排列是否在第 (k) 个位置上一致。 如果状态包含在一个答案掩码中，则返回零，因为不需要进一步比较。 
7. 否则，考虑每对元素。 将当前状态与对掩码相交以获得比较结果为 (x<y) 的排列。 互补部分给出了排列，其中 (y<x)。 
8. 如果一对结果的两个状态之一为空，则忽略该对。 这种比较已经是当前状态的信息所暗示的，并不能减少不确定性。 
9. 递归地求解两个结果状态。 比较本身的成本为 1，最坏的结果决定剩余成本，因此候选值是 1 加两个子成本的最大值。 
10. 在所有有用的比较中选择最小的候选者。 使用当前排列位集作为键来记住结果，因为最佳延续仅取决于该状态表示的信息。 
11. 根据可能的答案元素的数量使用下限。 如果有(c)个不同的元素仍然可以占据位置(k)，则至少需要(\lceil\log_2 c\rceil)更多的二进制比较。 如果当前最佳答案已经等于该下限，则没有其他比较可以改进它，因此对该状态的搜索可以提前停止。 
12. 在极小极大评估期间，首先评估更有前途的孩子。 如果它的成本已经达到当前的最佳值，则另一个孩子只需要足够好的界限来证明这种比较不能改善当前的最佳值。 这避免了大量不必要的递归。 

为什么它有效：不变的是 DP 状态包含与当前决策树路径上已知的每个比较完全一致的总订单。 比较将这些顺序精确地划分为两种可能的结果，因此这两种递归状态准确地描述了该比较之后可能出现的情况。 当所有幸存的全序都同意第 (k) 个元素时，状态就处于终结状态。 因此，每个递归转换都对应于一个合法的比较，每个最终状态都有一个唯一确定的答案，并且最小最大递归考虑每个可能的下一个比较。 因此，在这些选择中取最小值可以得到尽可能少的最坏情况比较次数。 

## Python 解决方案```python
import sys
import itertools
from functools import lru_cache

input = sys.stdin.readline

def solve_case(n, k, relations):
    permutations = list(itertools.permutations(range(n)))
    pcount = len(permutations)
    byte_count = (pcount + 7) >> 3

    pairs = []
    pair_id = [[-1] * n for _ in range(n)]

    for i in range(n):
        for j in range(i + 1, n):
            pair_id[i][j] = len(pairs)
            pairs.append((i, j))

    pair_bytes = [bytearray(byte_count) for _ in pairs]
    answer_bytes = [bytearray(byte_count) for _ in range(n)]

    for idx, perm in enumerate(permutations):
        byte_index = idx >> 3
        bit = 1 << (idx & 7)

        answer_bytes[perm[k - 1]][byte_index] |= bit

        pos = [0] * n
        for rank, x in enumerate(perm):
            pos[x] = rank

        for q, (x, y) in enumerate(pairs):
            if pos[x] < pos[y]:
                pair_bytes[q][byte_index] |= bit

    pair_masks = [
        int.from_bytes(bytes(data), "little")
        for data in pair_bytes
    ]
    answer_masks = [
        int.from_bytes(bytes(data), "little")
        for data in answer_bytes
    ]

    full = (1 << pcount) - 1
    initial = full

    for x, y in relations:
        if x < y:
            q = pair_id[x][y]
            initial &= pair_masks[q]
        else:
            q = pair_id[y][x]
            initial &= full ^ pair_masks[q]

    @lru_cache(maxsize=None)
    def possible_answers(state):
        result = 0
        for x, mask in enumerate(answer_masks):
            if state & ~mask == 0:
                result |= 1 << x
        return result

    @lru_cache(maxsize=None)
    def lower_bound(state):
        cnt = possible_answers(state).bit_count()
        if cnt <= 1:
            return 0
        return (cnt - 1).bit_length()

    @lru_cache(maxsize=None)
    def dp(state):
        candidates = possible_answers(state)

        if candidates.bit_count() <= 1:
            return 0

        best = 29
        lb = (candidates.bit_count() - 1).bit_length()

        if lb == best:
            return best

        for pair_mask in pair_masks:
            left = state & pair_mask
            if not left or left == state:
                continue

            right = state ^ left

            first, second = left, right

            # Explore the state with more possible answers first.
            if possible_answers(first).bit_count() < \
                    possible_answers(second).bit_count():
                first, second = second, first

            first_cost = dp(first)

            # The comparison cannot beat best if its first branch
            # is already too expensive.
            if 1 + first_cost >= best:
                continue

            second_lb = lower_bound(second)
            if 1 + max(first_cost, second_lb) >= best:
                continue

            second_cost = dp(second)
            value = 1 + max(first_cost, second_cost)

            if value < best:
                best = value
                if best == lb:
                    break

        return best

    return dp(initial)

def solve_input(data):
    it = iter(data.strip().split())
    n = int(next(it))
    k = int(next(it))
    l = int(next(it))

    relations = []
    for _ in range(l):
        x = int(next(it))
        y = int(next(it))
        relations.append((x, y))

    return str(solve_case(n, k, relations))

def main():
    data = sys.stdin.buffer.read().decode()
    sys.stdout.write(solve_input(data) + "\n")

if __name__ == "__main__":
    main()
```排列生成创建了可能输入的范围。 排列本身按升序存储，因此`perm[k - 1]`正是通过对该输入进行选择而返回的元素。 

在构造掩码时使用字节数组，因为一次一位地重复修改一个巨大的 Python 整数将是不必要的昂贵的。 施工完成后，`int.from_bytes`将每个字节数组转换为紧凑的 Python 整数，之后所有状态转换都变成快速整数运算。 

这对掩码对每次比较的两种可能结果进行编码。 如果`pair_mask`表示 (x<y)，则`state & pair_mask`是第一个结果并且`state ^ left`是第二个结果，因为`state`仅包含有效的排列。 

终端测试不需要重建偏序。 如果每个幸存的排列在位置（k）处具有相同的元素，则选择结果已经固定。 这正是允许比较决策树停止的点。 

这`possible_answers`缓存避免重复扫描相同状态的所有八个答案掩码。 当元素（x）仍然可以是所请求的顺序统计量时，其位（x）被精确地设置。 

Python 中不存在整数溢出问题。 最大状态只有40320位，Python整数直接处理任意精度。 递归深度最多为不同比较的次数，对于（n=8）为28。 

## 工作示例

 ### 示例 1

 输入是```
3 2 0
```最初的每个排列`0, 1, 2`是可能的。 所有三个元素仍然可以是第二小的。 

| 状态| 可能的第二个元素 | 行动| 结果 |
 | --- | --- | --- | --- |
 | 所有 6 种排列 |`{0,1,2}`| 比较`0`和`1`| 两种状态|
 |`0 < 1`|`{0,1,2}`| 比较`0`和`2`| 两种状态|
 |`2 < 0 < 1`|`{0}`| 停止| 成本 0 |
 |`0 < 2`和`0 < 1`|`{1,2}`| 比较`1`和`2`| 两个终端状态 |

 第一次比较花费 1，第二次比较花费 1，并且在分支中`0<2`需要进行第三次比较。 因此最坏情况的成本是`3`。 

DP 检查所有可能的第一次比较并找到相同的值，因此输出为```
3
```此示例说明了为什么识别答案比确定完整顺序弱。 学习后`0<1`，第二小的元素仍然未知，尽管关系已经相当严格。 

### 示例 2

 输入是```
7 2 5
0 6
3 6
4 6
2 0
0 5
```初始关系意味着

 [
 2<0<5，\qquad 0<6，\qquad 3<6，\qquad 4<6。 
]

 元素`5`和`6`不能是第二小的，因为已知至少有两个元素位于它们之前。 因此，可能的第二小元素是`0`,`1`,`2`,`3`， 和`4`。 

| 状态| 已知关系 | 可能的第二个元素 | 下限|
 | --- | --- | --- | --- |
 | 初始|`0<6, 3<6, 4<6, 2<0, 0<5`|`{0,1,2,3,4}`| 3 |
 | 经过任何有用的比较后| 初始关系加上一个新关系| 的子集`{0,1,2,3,4}`| 重新计算|
 | 终端状态| 所有幸存的订单都在位置 2 处一致 | 一个元素 | 0 |

 3 的下限只是一个信息界限。 候选者与候选集之外的元素之间的关系使得一些二元问题远不如界限假设的平衡。 极小极大 DP 检查每一个有用的比较，并递归地解释最坏的结果。 

确切的最优是`5`，所以输出是```
5
```## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(Sn^2B)) | (S) 记忆的信息状态，(O(n^2)) 每个状态可能的比较，以及由 Python 的大整数运算处理的 (B=40320) 位 |
 | 空间| (O(SB)) | 每个记忆状态都是一个 40320 位整数，具有用于配对和答案掩码的额外存储空间 |

 阶乘部分是解被限制为 (n\le8) 的原因。 在 (n=8) 时，总共只有 40320 个订单，因此一个状态作为原始位集大约可容纳 5 KB。 搜索从不探索任意数值数组，而仅探索可能的相对顺序的有限集。 一旦强制请求的顺序统计，记忆和终端检测就会停止搜索。 

已发布的问题约束是 (n\le8)、(1\le k\le n) 和 (\ell\le n)，它们正是使这种精确状态空间搜索可行的边界。 

## 测试用例

 该问题的输入中没有数组值，因此无法构造“所有相等值”测试。 语句的独特性假设也禁止使用相等的值。 以下测试涵盖最小实例、已解决的状态、边界顺序统计数据和 (n) 的最大值。```
# These tests assume solve_input(data) is the function
# from the solution above.

def run(inp: str) -> str:
    return solve_input(inp).strip()

# Provided sample 1
assert run(
    """3 2 0
"""
) == "3", "sample 1"

# Provided sample 2
assert run(
    """7 2 5
0 6
3 6
4 6
2 0
0 5
"""
) == "5", "sample 2"

# Minimum-size input: one element is already the answer.
assert run(
    """1 1 0
"""
) == "0", "minimum n"

# Two elements, smallest element unknown.
assert run(
    """2 1 0
"""
) == "1", "two elements without information"

# Two elements, complete information already known.
assert run(
    """2 2 1
0 1
"""
) == "0", "already determined maximum"

# Boundary order statistic with transitive information.
# 0 < 1 < 2, so the minimum is known without extra comparisons.
assert run(
    """3 1 2
0 1
1 2
"""
) == "0", "transitive minimum"

# Maximum-size input with a complete chain.
# The 4th smallest element is already determined.
assert run(
    """8 4 7
0 1
1 2
2 3
3 4
4 5
5 6
6 7
"""
) == "0", "maximum n and complete order"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 2 0`|`3`| 提供没有先验信息的中值示例 |
 |`7 2 5`与五个给定关系 |`5`| 提供部分有序状态 |
 |`1 1 0`|`0`| 最小可能 (n) |
 |`2 1 0`|`1`| 具有恰好一个未知比较的边界情况 |
 |`2 2 1`和`0 1`|`0`| 已确定订单统计 |
 |`3 1 2`和`0 1`,`1 2`|`0`| 传递性|
 |`8 4 7`形成完整链条|`0`| 最大值 (n) 和已知答案 |

 ## 边缘情况

 当 (n=1) 时，只有一种可能的排列，并且唯一的元素自动是第 (k) 个最小的元素。 初始状态已包含在一个应答掩码中，因此 DP 返回`0`。 

为了```
2 1 0
```两种排列都是可能的。 元素`0`是一个排列和元素中的最小值`1`是另一个中的最小值。 一次比较就区分了两种情况，因此 DP 返回`1`。 

为了```
2 2 1
0 1
```唯一一致的顺序是`0<1`。 每个幸存的排列位置`1`第二，所以终端测试立即成功，答案是`0`。 这捕获了对输入中已提供的比较进行收费的常见错误。 

为了```
3 1 2
0 1
1 2
```明确提供的关系意味着`0<2`通过传递性。 因此，每个一致排列都有`0`第一的。 该状态仅包含其第一个元素是的排列`0`，因此 DP 立即停止`0`。 

为了```
3 2 1
0 1
```关系`0<1`不足以确定中位数。 如果`2<0`，顺序是`2<0<1`答案是`0`。 如果`0<2`，中位数取两者之间较小的一个`1`和`2`，所以还需要再进行一次比较。 DP 保留这两种状态，而不是假设当前最受约束的元素一定是答案。 

对于最大尺寸的情况，```
8 4 7
0 1
1 2
2 3
3 4
4 5
5 6
6 7
```传递性决定了完整的顺序`0<1<2<3<4<5<6<7`。 因此第四小的元素是`3`。 所有一致排列都已在位置 4 上达成一致，因此不执行递归比较，结果为`0`。
