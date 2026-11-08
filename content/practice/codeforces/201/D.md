---
title: "CF 201D - 全新问题"
description: "Lesha 的问题描述由 n 个不同的单词组成，并按固定顺序书写。 每个档案问题都是另一个单词序列，但档案描述可能会多次重复单词。 我们想要将 Lesha 的描述与每个档案描述进行比较。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "brute-force", "dp"]
categories: ["algorithms"]
codeforces_contest: 201
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 127 (Div. 1)"
rating: 2600
weight: 201
solve_time_s: 99
verified: true
draft: false
---

[CF 201D - 全新问题](https://codeforces.com/problemset/problem/201/D)

 **评分：** 2600
 **标签：** 位掩码、暴力破解、dp
 **求解时间：** 1m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Lesha 有一个问题描述`n`不同的单词，以固定的顺序书写。 每个档案问题都是另一个单词序列，但档案描述可能会多次重复单词。 

我们想要将 Lesha 的描述与每个档案描述进行比较。 对于一个档案问题，我们可以按任意顺序排列 Lesha 的单词。 如果该排列作为存档描述内的子序列出现，则存档问题被认为是相似的。 

在所有有效的排列中，我们选择相对于 Lesha 单词的原始顺序倒置次数最少的排列。 我们需要的反演越少，问题就越相似。 

如果最佳排列有`x`反转，则相似度得分为：$$p = \frac{n(n-1)}{2} + 1 - x$$最大可能的反转是`n(n-1)/2`，因此更大的相似性意味着更少的反转。 

任务是找到相似度最大的存档问题。 如果没有档案问题包含 Lesha 单词的任何排列作为子序列，我们打印`"Brand new problem!"`。 

这些约束完全塑造了解决方案。 

临界界限是`n ≤ 15`。 这立即表明位掩码 DP，因为`2^15 = 32768`是可以管理的。 同时，档案描述最多可以包含`500000`总字数，因此任何以存档长度呈指数增长的解决方案都是不可能的。 

对所有排列进行暴力破解需要检查`15!`排列，这是一个天文数字。 甚至`10!`已经太大了。 

小的`n`巨大的存档大小表明应该几乎线性地处理存档，而昂贵的组合必须仅在`n`乐莎的话。 

有几个微妙的情况打破了简单的解决方案。 

假设 Lesha 的话是：```
a b c
```存档描述为：```
c b a
```唯一有效的排列恰好是`c b a`，有 3 个反转。 试图保留原始顺序的贪婪方法将无法找到任何解决方案，即使存在解决方案。 

另一个危险的情况是重复的存档词：```
Lesha: a b
Archive: a a a b
```最好的排列仍然是`a b`0 次反转。 如果我们只存储每个单词的第一次出现并忽略后面的位置，我们可能会意外丢失有效的转换。 

当可能存在多种排列时，会出现一个更微妙的问题：```
Lesha: a b c
Archive: b a c
```两种排列`b a c`和`a c b`是子序列。 它们的反转计数不同：```
b a c -> 1 inversion
a c b -> 1 inversion
```一个粗心的 DP 只检查存在性会错过最小化反转的需要。 

最后，打破平局很重要。 如果两个归档问题达到相同的相似度，我们必须输出最小的归档索引。 

## 方法

 最直接的暴力解决方案是生成 Lesha 单词的每种排列。 对于每个排列，我们检查它是否作为子序列出现在存档描述中。 如果是，我们计算其反转计数并保持最小值。 

检查子序列是否存在需要归档长度的线性时间。 最多有`n!`排列。 

为了`n = 15`:$$15! \approx 1.3 \times 10^{12}$$即使在考虑存档扫描之前，这也是无望的。 

暴力破解在概念上是有效的，因为问题实际上要求我们搜索排列。 问题在于排列是错误的表示。 

关键的观察是我们实际上并不关心完整的排列本身。 我们只关心按存档顺序构建子序列，同时最大限度地减少反转。 

假设我们从左到右扫描档案描述。 每当我们遇到 Lesha 的某个单词时，我们可能会决定将其附加到我们选择的子序列中。 

单词附加的顺序成为排列。 

现在考虑增量反转计数。 

如果我们附加单词`i`在已经选择了一些单词集之后，那么每个先前选择的索引大于的单词`i`创建一个反转。 

这意味着额外的反转成本仅取决于当前的子集掩码。 

这正是 DP 子集所需的结构。 

我们定义：`dp[mask] = minimum inversions needed to build exactly this set of chosen words as a subsequence so far`处理Lesha索引对应的新归档词时`i`，我们可以转换：```
mask -> mask | (1 << i)
```添加的反转计数等于已选择的索引的数量大于`i`。 

存档是从左到右处理的，因此自动遵守后续顺序。 

这将阶乘搜索转换为 DP`2^n`面具。 

口罩总数最多为`32768`，它足够小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m·k·n！) | O(n) | 太慢了 |
 | 最佳 | O(总单词数·2^n) | O(2^n) | O(2^n) | 已接受 |

 ## 算法演练

 1. 读取 Lesha 的单词并为每个单词分配其原始索引`0`到`n-1`。 
2. 对于每个存档问题，初始化：```
dp[mask] = minimum inversions
```将所有状态设置为无穷大，除了：```
dp[0] = 0
```这表示不选择零反转的单词。 

1. 从左到右处理档案描述。 

只有莱莎描述中出现的词语才重要。 所有其他单词都可以立即忽略。 

1、假设当前归档词对应的是Lesha索引`i`。 

我们尝试将此单词附加到每个尚未包含的现有子集中`i`。 

1. 对于每个有效掩码，计算添加的反转成本。 

如果我们附加`i`，然后每个已选择的索引`j > i`贡献一个反转。 

所以：```
extra = count of bits j in mask where j > i
```1. 过渡：```
new_mask = mask | (1 << i)

dp[new_mask] = min(
    dp[new_mask],
    dp[mask] + extra
)
```我们按降序迭代掩码，因此相同的存档事件不会重复使用多次。 

1. 处理完整个档案描述后，检查完整掩码：```
full = (1 << n) - 1
```如果`dp[full]`是有限的，那么这个存档问题包含一些有效的排列。 

1. 将倒数计数转换为相似度：$$p = \frac{n(n-1)}{2} + 1 - dp[full]$$最大限度地保留存档问题`p`。 通过较小的指数打破平局。 

1. 如果没有存档问题达到完整掩码，则打印：```
Brand new problem!
```否则打印最佳归档索引并：```
[:||||...||:]
```恰好与`p`垂直条。 

### 为什么它有效

 DP 不变量为：```
dp[mask] = minimum inversions among all subsequences
formed so far whose chosen Lesha words are exactly mask
```当从左到右处理存档单词时，每次转换都会在子序列的末尾附加一个新单词。 这会自动保留子序列的有效性。 

附加词的倒装贡献`i`仅取决于已经选择了哪些较大的指数。 当较小索引的单词附加在较大索引的单词之后时，每个这样的对都贡献一次反转，并且每个反转都只计算一次。 

由于每个有效排列都对应于一些 DP 转换序列，并且每个 DP 转换都构造一个有效排列，因此 DP 精确地探索所需的搜索空间，同时最小化反转。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**9

def solve():
    n = int(input())
    words = input().split()

    pos = {}
    for i, w in enumerate(words):
        pos[w] = i

    m = int(input())

    full = (1 << n) - 1
    max_inv = n * (n - 1) // 2

    best_similarity = -1
    best_index = -1

    greater_bits = [0] * n
    for i in range(n):
        mask = 0
        for j in range(i + 1, n):
            mask |= (1 << j)
        greater_bits[i] = mask

    for problem_index in range(1, m + 1):
        data = input().split()
        k = int(data[0])
        archive = data[1:]

        dp = [INF] * (1 << n)
        dp[0] = 0

        for w in archive:
            if w not in pos:
                continue

            i = pos[w]
            bit = 1 << i

            for mask in range(full, -1, -1):
                if dp[mask] == INF:
                    continue

                if mask & bit:
                    continue

                new_mask = mask | bit

                extra = (mask & greater_bits[i]).bit_count()

                cand = dp[mask] + extra

                if cand < dp[new_mask]:
                    dp[new_mask] = cand

        if dp[full] == INF:
            continue

        inversions = dp[full]
        similarity = max_inv + 1 - inversions

        if similarity > best_similarity:
            best_similarity = similarity
            best_index = problem_index

    if best_similarity == -1:
        print("Brand new problem!")
    else:
        print(best_index)
        print("[:{}:]".format("|" * best_similarity))

solve()
```字典`pos`将每个 Lesha 单词映射到其原始索引。 由于 Lesha 的单词保证是不同的，因此这种映射是明确的。 

DP数组有大小`2^n`，这是可行的，因为`n ≤ 15`。 

数组`greater_bits[i]`存储包含所有大于的索引的位掩码`i`。 这让我们可以使用以下方法计算恒定时间内新创建的反转的数量：```
(mask & greater_bits[i]).bit_count()
```该表达式计算了有多少个已选择的单词最初出现在`i`。 

递减掩码迭代是必不可少的。 如果没有它，单个存档事件可能会在同一迭代期间多次重复使用，这将违反子序列规则。 

另一个微妙的点是存档问题可能会多次重复单词。 我们必须单独处理每个事件，因为后面的事件可以创建更好的子序列。 

最终的相似度公式直接来自该陈述。 

## 工作示例

 ### 示例 1

 输入：```
4
find the next palindrome
1
10 find the previous palindrome or print better luck next time
```指数是：

 | 词| 索引 |
 | --- | --- |
 | 查找| 0 |
 | | 的 | 1 |
 | 下一个 | 2 |
 | 回文| 3 |

 与存档相关的序列变为：```
find the palindrome next
```DP 转换：

 | 当前词 | 构建排列 | 倒转|
 | --- | --- | --- |
 | 查找| 查找| 0 |
 | | 的 | 找到 | 0 |
 | 回文| 找到回文 | 0 |
 | 下一个 | 接下来找到回文 | 1 |

 最终的排列是：```
find the palindrome next
```与原始订单相比：```
find the next palindrome
```仅有的`(palindrome, next)`是颠倒的。 

为了`n = 4`:$$\frac{4 \cdot 3}{2} = 6$$相似：$$6 + 1 - 1 = 6$$输出：```
1
[:||||||:]
```该迹线演示了如何在保留子序列顺序的同时逐步累积反转。 

### 示例 2

 输入：```
3
a b c
1
3 c b a
```相关存档顺序：```
c b a
```DP进化：

 | 当前词 | 迄今为止最好的排列 | 倒转|
 | --- | --- | --- |
 | c | c | 0 |
 | 乙| 乙 | 1 |
 | 一个 | c b a | 3 |

 排列`c b a`所有三对都反转：```
(c,b), (c,a), (b,a)
```最大反转次数`n = 3`也是 3，所以：$$3 + 1 - 3 = 1$$输出：```
1
[:|:]
```此示例表明该算法可以正确处理完全相反的排序。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(总单词数·2^n) | 每个相关的存档词都会迭代所有子集掩码 |
 | 空间| O(2^n) | O(2^n) | 子集上的 DP 数组 |

 最大可能的 DP 有`32768`州。 归档总长度约为`5 × 10^5`，这使得总操作数在优化的 Python 中保持在实际限制内。 

与 256 MB 限制相比，内存使用量很小。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

INF = 10**9

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    out = io.StringIO()
    sys.stdout = out

    input = sys.stdin.readline

    n = int(input())
    words = input().split()

    pos = {}
    for i, w in enumerate(words):
        pos[w] = i

    m = int(input())

    full = (1 << n) - 1
    max_inv = n * (n - 1) // 2

    best_similarity = -1
    best_index = -1

    greater_bits = [0] * n
    for i in range(n):
        mask = 0
        for j in range(i + 1, n):
            mask |= (1 << j)
        greater_bits[i] = mask

    for problem_index in range(1, m + 1):
        data = input().split()
        archive = data[1:]

        dp = [INF] * (1 << n)
        dp[0] = 0

        for w in archive:
            if w not in pos:
                continue

            i = pos[w]
            bit = 1 << i

            for mask in range(full, -1, -1):
                if dp[mask] == INF:
                    continue

                if mask & bit:
                    continue

                new_mask = mask | bit

                extra = (mask & greater_bits[i]).bit_count()

                dp[new_mask] = min(
                    dp[new_mask],
                    dp[mask] + extra
                )

        if dp[full] == INF:
            continue

        similarity = max_inv + 1 - dp[full]

        if similarity > best_similarity:
            best_similarity = similarity
            best_index = problem_index

    if best_similarity == -1:
        print("Brand new problem!")
    else:
        print(best_index)
        print("[:{}:]".format("|" * best_similarity))

    return out.getvalue()

# provided sample
assert run(
"""4
find the next palindrome
1
10 find the previous palindrome or print better luck next time
"""
) == "1\n[:||||||:]\n", "sample 1"

# minimum size
assert run(
"""1
hello
1
1 hello
"""
) == "1\n[:|:]\n", "single word"

# no valid permutation
assert run(
"""2
a b
1
3 a x x
"""
) == "Brand new problem!\n", "missing word"

# reversed order
assert run(
"""3
a b c
1
3 c b a
"""
) == "1\n[:|:]\n", "maximum inversions"

# tie-breaking by smaller index
assert run(
"""2
a b
2
2 a b
2 a b
"""
) == "1\n[:||:]\n", "smallest index tie"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单字案例 | 相似度 1 | 最小约束|
 | 缺字 | 全新问题| 全面罩遥不可及|
 | 颠倒顺序 | 最低相似度 | 最大反转处理|
 | 相同的最佳档案 | 选择的最小索引 | 决胜局正确性 |

 ## 边缘情况

 考虑：```
2
a b
1
3 a a b
```存档重复`a`多次。 

DP 独立处理每个事件。 读完第一本后`a`，我们可以形成子集`{a}`。 后来的`a`该子集的出现次数将被忽略，因为该位已设置。 

什么时候`b`到达时，DP 达到零反转的完整掩模。 

输出：```
1
[:||:]
```这确认了重复的存档词已被安全处理。 

现在考虑完全相反的情况：```
3
a b c
1
3 c b a
```过渡：```
{} -> {c} -> {c,b} -> {c,b,a}
```追加时`b`，一个更大的索引（`c`) 已经存在，添加一个反转。 

追加时`a`，两个更大的指数已经存在，增加了两个反转。 

总反转：```
1 + 2 = 3
```这是正确的。 

最后，考虑没有有效子序列的情况：```
3
a b c
1
4 a x y b
```DP 永远不会达到全遮罩，因为`c`永远不会出现。 

最终状态仍然是无限的：```
dp[111] = INF
```所以算法正确地打印：```
Brand new problem!
```
