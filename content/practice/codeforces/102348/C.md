---
title: "CF 102348C - 弹珠"
description: "我们有一排 (n) 个弹珠，每个弹珠最多有 20 种颜色中的一种。 我们可以交换相邻的弹珠，目标是使每种颜色占据一个连续的块。 块本身可以按任何顺序出现。"
date: "2026-08-16T01:38:46+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102348
codeforces_index: "C"
codeforces_contest_name: "ICPC 2019-2020 NERC (NEERC), Southern and Volga Russia Qualifier"
rating: 0
weight: 102348
solve_time_s: 1338
verified: false
draft: false
---

[CF 102348C - 弹珠](https://codeforces.com/problemset/problem/102348/C)

 **评级：** -
 **标签：** -
 **求解时间：** 22m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一排 (n) 个弹珠，每个弹珠最多有 20 种颜色中的一种。 我们可以交换相邻的弹珠，目标是使每种颜色占据一个连续的块。 块本身可以按任何顺序出现。 

关键的困难是没有指定颜色的最终顺序。 一旦这个顺序被固定，问题就变成了标准的最小相邻交换问题。 真正的任务是选择不同颜色的最佳排列。 

令不同颜色为 (k) 种颜色。 由于每种颜色都在 1 到 20 之间，(k\leq20)，即使 (n) 可以大到 (4\cdot10^5)。 颜色数量的这种小限制是子集动态编程解决方案成为可能的原因。 (n) 中的解多项式和仅 (k) 中的指数是实用的，而 (n) 中的任何指数都是完全不可能的。 

界限 (n\leq4\cdot10^5) 还排除了重复模拟交换的情况。 单个变换可能需要 (\frac{n(n-1)}2) 次相邻交换，最大 (n) 为

 [
 \frac{400000\cdot399999}{2}=79,999,800,000。 
]

 因此，即使通过显式交换来处理一个特别糟糕的目标安排也远远超出了时间限制。 

有几种边缘情况很容易被错误处理。 如果所有弹珠都已形成块，即使颜色未按数字排序，答案也为零。 例如，```
4
2 2 1 1
```有答案（0）。 假设块必须按颜色值排序的解决方案会错误地将 (2,1) 更改为 (1,2)。 

如果只出现一种颜色，则无论(n)如何，都不需要进行任何操作。 例如，```
4
20 20 20 20
```有答案（0）。 盲目地为所有 20 种可能的颜色分配状态的解决方案可能会浪费大量时间，而正确的实现应该压缩实际出现的颜色。 

重复的颜色也很重要。 为了```
4
1 2 1 2
```答案是（1），因为交换中间的两个弹珠得到（1,1,2,2）。 将单个弹珠视为独立排序的对象可以计算相同颜色弹珠之间不必要的交换。 

最后，颜色值不限于较小的连续范围，例如 (1,\dots,k)。 为了```
4
20 1 20 1
```答案还是（1）。 实现应该压缩实际出现的颜色，而不是使用它们的数值作为 DP 索引。 

## 方法

 直接的暴力方法首先观察最终的有效排列完全由其色块的顺序决定。 如果不同的颜色是 (c_1,c_2,\ldots,c_k)，则有 (k!) 种可能的顺序。 

对于一个固定的顺序，我们可以为每种颜色分配所需的块等级并扫描原始数组。 相对顺序与所需块顺序不同的每一对弹珠恰好贡献一个相邻交换。 这是相邻互换的通常反转解释。 因此，可以在 (O(n)) 中评估固定顺序，为所有可能的顺序提供 (O(k!,n)) 时间。 

在 (k=20) 时，这是没有希望的。 有

 [
 20！ = 2,432,902,008,176,640,000
 ]

 可能的订单。 即使每个订单扫描一次 (4\cdot10^5) 弹珠也需要大约

 [
 20!\cdot4\cdot10^5 \约 9.73\cdot10^{23}
 ]

 元素访问。 

有用的观察是订单的成本可以成对分解。 假设最终序列中颜色 (x) 放置在颜色 (y) 之前。 最初出现在 (x) 之前出现的每个 (y) 都形成一对，其顺序必须颠倒。 每对这样的货币对恰好需要一次相邻的交换。 

定义

 [
 成本[x][y]
 ]

 作为原始数组中 (x) 出现在 (y) 之前的对的数量。 

现在想象一下从左到右构建最终的颜色顺序。 如果我们在一组已选择的颜色 (S) 之后附加颜色 (c)，则每个颜色 (x\in S) 都需要出现在 (c) 之前。 将 (c) 放在所有这些之后引入的交换正好是

 [
 \sum_{x\in S} 成本[c][x]。 
]

 重要的是，这仅取决于 (S) 和 (c)，而不取决于 (S) 的颜色先前排列的顺序。 这为我们提供了子集 DP 所需的最优子结构。 

我们使用位掩码来表示已放置的颜色集。 DP 状态记录准确地将该集合安排为前缀的最小成本。 添加一种新颜色即可实现过渡。 

比较是：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(k!,n)) | (O(k+n)) | 太慢了 |
 | 最佳 | (O(nk+k2^k)) | (O(k2^k)) | 已接受 |

 这里是 (k\leq20)，因此指数部分大致以 (20\cdot2^{20}) 为界，这是可以管理的。 

## 算法演练

 1. 将数组中实际出现的颜色压缩为索引 (0,1,\ldots,k-1)。 只有这些颜色可以作为最终块出现，并且 (k\leq20)。 
2. 构建成对成本矩阵。 对于每对颜色 (x,y)，令 (cost[x][y]) 为位置对 (i<j) 的数量，这样 (a_i=x) 和 (a_j=y)。 在从左到右扫描期间，当当前颜色为 (y) 时，每个先前看到的 (x) 都会为 (cost[x][y]) 贡献 1。 由于最多有 20 种颜色，因此此预处理成本为 (O(nk))。 
3. 考虑颜色的最终顺序，并重点关注添加最后一个颜色 (c) 的时刻。 所有其他颜色形成一个集合 (S)，并且 (c\notin S)。 附加(c)引起的额外成本是

 [
 add(c,S)=\sum_{x\in S}cost[c][x].
 ]

 当 (c) 需要位于 (S) 中的每种颜色之后时，此公式会准确计算相对顺序错误的对。 

1. 将 (dp[mask]) 定义为精确排列由 表示的颜色所需的相邻交换的最小数量`mask`到最后一行的一个有效前缀。 蒙版中的颜色可以按成本最小的顺序出现。 
2. 对于每个非空蒙版，尝试将其中包含的每种颜色 (c) 作为该前缀的最后一种颜色。 如果`prev = mask`如果没有 (c)，则转换为

 \min_{c\in 掩码}
 \左（
 dp[上一个]
 +
 \sum_{x\in prev}成本[c][x]
 \右）。 
]

 根据 DP 的定义，前一个项已经是最佳的，并且添加的项考虑了涉及新附加颜色的每一对。 

1.为了保持Python实现的快速性，预先计算子集和

 [
 sum_c[S]=\sum_{x\in S}cost[c][x]
 ]

 对于每种颜色 (c) 和不包含 (c) 的每个子集 (S)。 每个这样的表都有 (2^{k-1}) 个条目，因此所有这些表总共包含 (k2^{k-1}) 个值。 子集和本身是通过删除一组位来计算的：

 [
 sum_c[S]=sum_c[S\setminus{x}]+cost[c][x]。 
]

 该实现将这些值存储在紧凑的 64 位数组中。 

1. 迭代所有蒙版并对每种可能的最后颜色应用过渡。 答案是`dp[(1 << k) - 1]`，因为该蒙版包含每种不同的颜色。 

为什么有效：修复颜色的最终顺序。 每对不同颜色的弹珠要么保持其相对顺序，要么颠倒过来。 原始顺序与最终块顺序不一致的一对必须恰好交叉一次，并且相邻的交换只能改变两个交换弹珠的相对顺序。 因此，这种反向对的数量恰好是最终排序的相邻交换的最小数量。 

DP 隐含地考虑了每一种可能的最终排序。 当添加颜色 (c) 时，其贡献仅取决于其之前已有的颜色，而不取决于它们的内部顺序。 因此，每个排序都由一系列 DP 转换表示，并且每个转换都精确地添加涉及新附加块的交换。 因此，对所有可能的最后颜色取最小值给出了所有有效块订单的最小成本。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve_case(a):
    # Compress the colors that actually occur.
    colors = sorted(set(a))
    k = len(colors)
    index = {x: i for i, x in enumerate(colors)}
    b = [index[x] for x in a]

    # cost[x][y] = number of pairs (x before y) in the original array.
    cost = [[0] * k for _ in range(k)]
    seen = [0] * k

    for y in b:
        for x in range(k):
            cost[x][y] += seen[x]
        seen[y] += 1

    if k == 1:
        return 0

    # For every color c, store subset sums for subsets not containing c.
    # Such a subset has k-1 bits, hence 2^(k-1) entries.
    half = 1 << (k - 1)
    total_sum_entries = k * half
    subset_sum = array('q', [0]) * total_sum_entries

    for c in range(k):
        base = c * half

        others = []
        for x in range(k):
            if x != c:
                others.append(x)

        row = cost[c]

        for mask in range(1, half):
            lb = mask & -mask
            bit = lb.bit_length() - 1
            prev = mask ^ lb
            subset_sum[base + mask] = (
                subset_sum[base + prev] + row[others[bit]]
            )

    size = 1 << k
    inf = 10**30
    dp = [inf] * size
    dp[0] = 0

    lower_mask = [(1 << c) - 1 for c in range(k)]

    for mask in range(1, size):
        bits = mask
        best = inf

        while bits:
            lb = bits & -bits
            c = lb.bit_length() - 1
            prev = mask ^ lb

            # Remove bit c from prev to obtain its compressed
            # (k-1)-bit representation.
            compressed = (
                (prev & lower_mask[c])
                | ((prev >> (c + 1)) << c)
            )

            value = dp[prev] + subset_sum[c * half + compressed]

            if value < best:
                best = value

            bits ^= lb

        dp[mask] = best

    return dp[-1]

def main():
    n = int(input())
    a = list(map(int, input().split()))
    print(solve_case(a))

if __name__ == "__main__":
    main()
```第一部分`solve_case`压缩颜色。 这可以避免为从未出现过的颜色分配 DP 状态，并且还可以处理 20 等值，而无需对其进行特殊处理。 

这`cost`矩阵存储方向对计数。 当当前颜色为`y`，每个以前见过的颜色`x`给出一对`x`前`y`， 所以`cost[x][y]`增加了`seen[x]`。 这个方向很重要。 什么时候`y`被附加在之后`x`，有问题的对是那些`y`最初出现在之前`x`，它们存储为`cost[y][x]`。 

子集总和表针对每种可能的最后颜色单独索引。 由于最后一个颜色 (c) 不能出现在其前身掩码中，因此仅需要 (k-1) 位。 这将存储从 (k2^k) 个条目减少到 (k2^{k-1}) 个条目。 

压缩掩码删除位`c`。 它的较低位可以保留在原来的位置，而上面的每一位`c`向下移动一位。 表达式```
(prev & lower_mask[c]) | ((prev >> (c + 1)) << c)
```完全执行该转换。 

DP 开头为`dp[0] = 0`，因为空前缀不需要交换。 对于每个非空掩码，每个设置位都被视为最后一个块的颜色。 前身是通过以下方式获得的`mask ^ lb`，并且预先计算的子集总和提供将所选颜色放在所有前驱颜色之后的成本。 

Python 整数具有任意精度，因此即使答案可能比 (2^{31}) 大得多，也不存在溢出问题。 紧凑型`array('q')`用于子集总和，因为 Python 的普通整数会带来大量的每个对象内存开销。 

## 工作示例

 ### 示例 1

 输入是```
7
3 4 2 3 4 2 2
```不同的颜色是 (3,4,2)。 压缩后分别称为(0,1,2)。 

一些相关的配对成本是

 [
 成本[4][3]=1，
 \qquad
 成本[2][3]=1，
 \qquad
 成本[2][4]=1。 
]

 如果最终顺序为 (3,4,2)，则这正是必须交叉的三对。 

最优DP路径可表示如下：

 | 面膜| 最后的颜色 | 上一个面膜 | 增加成本| DP值|
 | ---| ---| ---| ---| ---|
 |`001`| 3 |`000`| 0 | 0 |
 |`011`| 4 |`001`| (成本[4][3]=1) | 1 |
 |`111`| 2 |`011`| (成本[2][3]+成本[2][4]=2) | 3 |

 生成的块顺序为 (3,4,2)，给出最终的排列```
3 3 4 4 2 2 2
```最小值为 (3)。 

该跟踪说明了为什么成本附加到所附加的颜色上。 当 4 附加在 3 之后时，只有 4 最初在 3 之前的对才有意义。 当附加 2 时，它必须正好与前面的 3 和 4 交叉，而这些对以错误的顺序出现。 

### 示例 2

 输入是```
5
20 1 14 10 2
```每种颜色只出现一次。 由于每种颜色已经形成长度为一的段，因此五个单块的任何顺序都是有效的，并且原始排列需要零交换。 

所有对成本都与最优无关，因为原始序列本身已经是有效的块排序。 

| 面膜| 最后的颜色 | 上一个面膜 | 增加成本| DP值|
 | ---| ---| ---| ---| ---|
 |`00001`| 20 |`00000`| 0 | 0 |
 |`00011`| 1 |`00001`| 0 | 0 |
 |`00111`| 14 | 14`00011`| 0 | 0 |
 |`01111`| 10 | 10`00111`| 0 | 0 |
 |`11111`| 2 |`01111`| 0 | 0 |

 每个 DP 状态都保持为零，因此最终答案是 (0)。 

这练习了每种颜色都出现一次的情况。 正确的解决方案必须认识到单一颜色已经是连续的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(nk+k2^k)) | 构建对成本需要 (O(nk))，子集总和和 DP 需要 (O(k2^k)) |
 | 空间| (O(k2^k)) | DP 有 (2^k) 个状态，紧凑子集和表有 (k2^{k-1}) 个条目 |

 对于 (k\leq20)，DP 最多包含 (2^{20}=1,048,576) 个状态。 转换最多检查每个状态 20 种可能的最后颜色。 对于每个 (4\cdot10^5) 弹珠，预处理最多扫描 20 个颜色计数器。 这些界限是围绕小颜色字母表设计的，因此即使在最大值 (n) 下，算法仍然可行。 

## 测试用例```python
import sys
import io
from array import array

def solve(inp: str) -> str:
    reader = io.StringIO(inp).readline
    n = int(reader())
    a = list(map(int, reader().split()))

    colors = sorted(set(a))
    k = len(colors)
    index = {x: i for i, x in enumerate(colors)}
    b = [index[x] for x in a]

    cost = [[0] * k for _ in range(k)]
    seen = [0] * k

    for y in b:
        for x in range(k):
            cost[x][y] += seen[x]
        seen[y] += 1

    if k == 1:
        return "0"

    half = 1 << (k - 1)
    subset_sum = array('q', [0]) * (k * half)

    for c in range(k):
        base = c * half
        others = [x for x in range(k) if x != c]
        row = cost[c]

        for mask in range(1, half):
            lb = mask & -mask
            bit = lb.bit_length() - 1
            prev = mask ^ lb
            subset_sum[base + mask] = (
                subset_sum[base + prev] + row[others[bit]]
            )

    size = 1 << k
    inf = 10**30
    dp = [inf] * size
    dp[0] = 0

    lower_mask = [(1 << c) - 1 for c in range(k)]

    for mask in range(1, size):
        bits = mask
        best = inf

        while bits:
            lb = bits & -bits
            c = lb.bit_length() - 1
            prev = mask ^ lb

            compressed = (
                (prev & lower_mask[c])
                | ((prev >> (c + 1)) << c)
            )

            value = dp[prev] + subset_sum[c * half + compressed]

            if value < best:
                best = value

            bits ^= lb

        dp[mask] = best

    return str(dp[-1])

# Provided samples
assert solve("""7
3 4 2 3 4 2 2
""") == "3", "sample 1"

assert solve("""5
20 1 14 10 2
""") == "0", "sample 2"

assert solve("""13
5 5 4 4 3 5 7 6 5 4 4 6 5
""") == "21", "sample 3"

# Minimum-size input
assert solve("""2
1 1
""") == "0", "minimum size, all equal"

assert solve("""2
1 2
""") == "0", "minimum size, two singleton blocks"

# Repeated colors requiring exactly one swap
assert solve("""4
1 2 1 2
""") == "1", "one crossing pair"

# Boundary color value and non-consecutive colors
assert solve("""4
20 1 20 1
""") == "1", "color value 20"

# Already grouped, but block order is not numerical
assert solve("""6
3 3 1 1 2 2
""") == "0", "arbitrary valid block order"

# Maximum-size input, all marbles have one color
maximum_case = "400000\n" + "20 " * 399999 + "20\n"
assert solve(maximum_case) == "0", "maximum n, all equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 1 1`|`0`| 最小尺寸和单一独特颜色 |
 |`2 / 1 2`|`0`| 两个单例块的最小尺寸 |
 |`4 / 1 2 1 2`|`1`| 恰好需要一个交叉路口 |
 |`4 / 20 1 20 1`|`1`| 边界颜色值和颜色压缩|
 |`6 / 3 3 1 1 2 2`|`0`| 有效的块顺序不需要按数字排序 |
 |`400000 / all 20`|`0`| 最大 (n)，单色处理 |

 ## 边缘情况

 如果每个大理石都有相同的颜色，则已经存在一个连续的片段。 为了```
4
20 20 20 20
```压缩产生(k=1)。 该算法立即返回零，而不是构造一个大的 DP。 这避免了不必要的工作和假设至少存在两种​​颜色的常见错误。 

如果每种颜色出现一次，则每个大理石都已经是其自己的连续块。 为了```
5
20 1 14 10 2
```有五个单例块，因此原始行已经有效并且答案为零。 配对成本不会强制任何特定的订单，因为原始订单本身就是允许的最终订单之一。 

如果颜色交错，配对计数公式可以准确捕获所需的交换。 为了```
4
1 2 1 2
```最终顺序 (1,2) 需要第二个弹珠和第三个弹珠交叉。 恰好存在一对，其中 2 出现在后面的 1 之前，因此 DP 将成本 (1) 分配给顺序 (1,2)。 反向区块顺序会花费更多，答案是（1）。 

如果颜色值稀疏或位于其边界，压缩可以防止数组索引错误。 为了```
4
20 1 20 1
```即使颜色的原始值为 20 和 1，颜色也会被压缩为两个 DP 索引。需要一次交叉，因此答案为 (1)。 

如果现有块的顺序是任意的，则必须接受该顺序。 为了```
6
3 3 1 1 2 2
```每种颜色已经是连续的，因此不需要交换。 DP 与数字颜色顺序无关。 可以自由选择(3,1,2)作为最终的块顺序并获得零。 

当一种颜色占主导地位时，最大的输入大小也是安全的。 对于颜色 20 的 (400000) 个副本，只有一种不同的颜色，因此算法在压缩后退出。 这种情况很有用，因为尽管实际实例只有一种状态，但始终构建 (2^{20}) 状态 DP 的实现会执行不必​​要的工作。
