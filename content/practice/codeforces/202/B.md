---
title: "CF 202B - 全新的简单问题"
description: "我们从 Torcoder 获得了 Lesha 新问题的标题和几个存档问题。 莱莎的标题里的字都清晰可见。 存档标题可能会重复单词。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force"]
categories: ["algorithms"]
codeforces_contest: 202
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 127 (Div. 2)"
rating: 1700
weight: 202
solve_time_s: 209
verified: true
draft: false
---

[CF 202B - 全新的简单问题](https://codeforces.com/problemset/problem/202/B)

 **评分：** 1700
 **标签：** 暴力破解
 **求解时间：** 3m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从 Torcoder 获得了 Lesha 新问题的标题和几个存档问题。 莱莎的标题里的字都清晰可见。 存档标题可能会重复单词。 

对于每个档案问题，我们想知道是否可以找到 Lesha 标题中的所有单词作为子序列，可能以不同的顺序。 在所有有效订单中，我们选择与 Lesha 标题的原始订单相比反转次数最少的订单。 

倒装是指两个单词相对于原始顺序交换。 如果 Lesha 的标题是：```
find the next palindrome
```然后是排列：```
find the palindrome next
```有一个反转，因为`palindrome`之前搬过`next`。 

如果某些存档问题的最佳排列是`x`倒置和 Lesha 的标题有`n`词，相似度得分为：```
p = n * (n - 1) / 2 - x
```当反转为零时，会出现最大可能值，这意味着存档已包含原始顺序的单词。 

我们必须找到相似度最大的存档问题。 如果没有存档问题包含所有单词的任何排列，我们打印`"Brand new problem!"`。 

这些约束完全塑造了解决方案。 Lesha的标题最多包含4个单词。 那是很小的。 排列的数量最多为：```
4! = 24
```每个档案描述最多包含20个单词，最多有10个档案问题。 在这里，即使对所有排列进行强力检查也是微不足道的。 

危险的部分不是性能，而是正确性。 

一个容易犯的错误是忘记存档可能包含重复的单词。 假设 Lesha 的标题是：```
a b
```存档标题是：```
a a a
```这个词`b`永远不会出现，所以排列不起作用。 粗心的子序列匹配器仅检查长度或部分匹配会错误地接受它。 

另一个微妙的情况是当多个排列作为子序列出现时选择错误的排列。 我们必须最小化反转，而不是最大化子序列灵活性。 

例子：```
Lesha: a b c
Archive: b a c
```两种排列`b a c`和`a c b`是子序列。 它们的反转计数不同：

 | 排列| 倒转|
 | --- | --- |
 | b a c | 1 |
 | a c b | 1 |

 在这里它们是并列的，但在更大的情况下，最小的因素很重要，因为相似性直接取决于倒置。 

另一个常见的错误是归档问题之间的联系处理不当。 如果两个问题达到相同的相似度，我们必须输出最小的索引。 

例子：```
Lesha: a b
Archive 1: b a
Archive 2: b a
```两者得分相同，因此答案必须存档`1`。 

## 方法

 最直接的方法是生成 Lesha 单词的每个排列。 自从`n ≤ 4`, there are at most 24 permutations. 对于每个存档问题，我们检查哪些排列显示为子序列。 其中，我们计算反转计数并保持最小值。 

检查序列是否是子序列与归档长度呈线性关系。 存档最多包含 20 个单词，因此一次检查最多需要 20 次比较。 

总的工作量很小：```
10 archive problems × 24 permutations × 20 checks
```这只是几千次操作。 

更天真的暴力会尝试存档位置的每个子集并比较结果序列。 对于长度为 20 的存档`n = 4`，这意味着检查：```
C(20,4) = 4845
```每个存档问题的位置组合。 即使这样仍然很容易适应，但它使实现变得复杂，因为我们需要从选定的位置重建排列。 

关键的观察是`n`非常小。 由于可能的排序数量以 24 为界，因此我们可以直接枚举所有候选排列并独立测试它们。 问题变成了排列生成、子序列匹配和倒置计数的干净组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解归档位置子集 | O(m × C(k,n) × n) | O(m × C(k,n) × n) | O(n) | 已接受 |
 | 枚举所有排列 | O(m × n! × k) | O(m × n! × k) | O(n!) | 已接受 |

 这里`k ≤ 20`和`n ≤ 4`。 

## 算法演练

 1.将Lesha的单词读入数组`base`。 
2. 生成所有排列`base`。 

自从`n ≤ 4`，这最多会产生 24 个序列。 
3. 对于每个排列，计算其相对于原始顺序的反转计数。 

我们将每个原始单词映射到其索引。 然后对于每一对`(i,j)`和`i < j`，如果原始位置`perm[i]`比原来的位置大`perm[j]`。 
4、独立处理每个档案问题。 
5. 对于每个排列，检查它是否作为子序列出现在存档标题内。 

使用两个指针：

 - 一个指针扫描排列
 - 一键扫描存档单词

 每当单词匹配时，就将排列指针前移。 

如果排列指针到达末尾，则排列是一个子序列。 
6. 在当前存档问题中找到的所有子序列中，保留最小反转计数。 

最少的倒置意味着最大的相似性。 
7. 将最小反转计数转换为相似度：```
p = n * (n - 1) / 2 - inversions
```1. 跟踪相似度最高的存档问题。 

如果相似之处相同，则保留较小的存档索引。 
2. 如果没有存档问题与任何排列匹配，则打印：```
Brand new problem!
```1. 否则打印最佳归档索引并构造相似度条：```
[:||||...||:]
```恰好与`p`垂直条。 

### 为什么它有效

 每个有效的解决方案都对应于 Lesha 单词的某种排列。 由于我们枚举了所有排列，因此我们永远不会错过任何一个候选。 

后续检查是准确的。 当且仅当其单词可以按档案标题内的顺序匹配时，排列才会被接受。 

在所有接受的排列中，问题定义明确要求具有最少反转的排列。 我们计算每个有效排列的反转计数并保持最小值，因此所选排列是正确的。 

最后，相似性是反转的单调变换。 最小化反转相当于最大化相似性。 

## Python 解决方案```python
import sys
from itertools import permutations

input = sys.stdin.readline

def is_subsequence(perm, archive):
    j = 0

    for word in archive:
        if j < len(perm) and word == perm[j]:
            j += 1

    return j == len(perm)

def solve():
    n = int(input())
    base = input().split()

    pos = {word: i for i, word in enumerate(base)}

    perms = []

    for perm in permutations(base):
        inv = 0

        for i in range(n):
            for j in range(i + 1, n):
                if pos[perm[i]] > pos[perm[j]]:
                    inv += 1

        perms.append((perm, inv))

    m = int(input())

    best_similarity = -1
    best_index = -1

    max_pairs = n * (n - 1) // 2

    for idx in range(1, m + 1):
        parts = input().split()

        k = int(parts[0])
        archive = parts[1:]

        best_inv = None

        for perm, inv in perms:
            if is_subsequence(perm, archive):
                if best_inv is None or inv < best_inv:
                    best_inv = inv

        if best_inv is not None:
            similarity = max_pairs - best_inv

            if similarity > best_similarity:
                best_similarity = similarity
                best_index = idx

    if best_index == -1:
        print("Brand new problem!")
    else:
        print(best_index)
        print("[:{}:]".format('|' * best_similarity))

if __name__ == "__main__":
    solve()
```该解决方案首先生成每个排列一次。 由于单词数量很少，预先计算所有排列及其反转计数可以简化后面的逻辑。 

反演计算使用存储在中的原始顺序映射`pos`。 这避免了重复搜索数组内的索引。 

子序列匹配器使用标准的贪婪扫描。 贪婪之所以有效，是因为匹配较早的出现永远不会导致以后的子序列变得不可能。 

经常导致错误的一个实现细节是正确计算相似度。 该公式使用：```
n * (n - 1) / 2
```这是有序对的最大可能数量。 由于Python使用整数除法`//`，我们计算：```
max_pairs = n * (n - 1) // 2
```另一个微妙的细节是领带处理。 我们仅在新的相似度严格更大时更新最佳存档。 由于我们以升序迭代存档问题，因此关系会自动保留较小的索引。 

## 工作示例

 ### 示例 1

 输入：```
4
find the next palindrome
1
10 find the previous palindrome or print better luck next time
```检查的键排列：

 | 排列| 倒转| 后续？ |
 | --- | --- | --- |
 | 找到下一个回文 | 0 | 没有 |
 | 接下来找到回文 | 1 | 是的 |
 | 接下来找到回文| 2 | 没有 |

 最佳有效排列是：```
find the palindrome next
```与一个反转。 

最大可能对数：```
4 × 3 / 2 = 6
```相似：```
6 - 1 = 5
```输出：```
1
[:|||||:]
```该轨迹显示了为什么最小反转很重要。 可能会出现多种排列，但只有最接近原始顺序的排列才能决定分数。 

### 自定义示例

 输入：```
3
a b c
2
3 c b a
3 a b c
```追踪：

 | 档案 | 最佳排列| 倒转| 相似度|
 | --- | --- | --- | --- |
 | c b a | c b a | 3 | 0 |
 | a b c | a b c | 0 | 3 |

 第二个档案获胜。 

输出：```
2
[:|||:]
```这个例子表明，相似性直接奖励保留原始顺序。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m × n! × k) | O(m × n! × k) | 对于每个存档，将每个排列作为子序列 | 检查
 | 空间| O(n!) | 存储所有排列和反转计数 |

 和`n ≤ 4`，我们最多有 24 种排列。 即使在最坏的情况下：```
10 × 24 × 20 = 4800
```进行后续比较。 该解决方案很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from itertools import permutations

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def is_subsequence(perm, archive):
        j = 0

        for word in archive:
            if j < len(perm) and word == perm[j]:
                j += 1

        return j == len(perm)

    out = io.StringIO()

    n = int(input())
    base = input().split()

    pos = {word: i for i, word in enumerate(base)}

    perms = []

    for perm in permutations(base):
        inv = 0

        for i in range(n):
            for j in range(i + 1, n):
                if pos[perm[i]] > pos[perm[j]]:
                    inv += 1

        perms.append((perm, inv))

    m = int(input())

    best_similarity = -1
    best_index = -1

    max_pairs = n * (n - 1) // 2

    for idx in range(1, m + 1):
        parts = input().split()
        archive = parts[1:]

        best_inv = None

        for perm, inv in perms:
            if is_subsequence(perm, archive):
                if best_inv is None or inv < best_inv:
                    best_inv = inv

        if best_inv is not None:
            similarity = max_pairs - best_inv

            if similarity > best_similarity:
                best_similarity = similarity
                best_index = idx

    if best_index == -1:
        print("Brand new problem!", file=out)
    else:
        print(best_index, file=out)
        print("[:{}:]".format('|' * best_similarity), file=out)

    return out.getvalue()

# provided sample
assert run(
"""4
find the next palindrome
1
10 find the previous palindrome or print better luck next time
"""
) == "1\n[:|||||:]\n", "sample 1"

# minimum size
assert run(
"""1
hello
1
1 hello
"""
) == "1\n[::]\n", "single word"

# no valid permutation
assert run(
"""2
a b
1
3 a a a
"""
) == "Brand new problem!\n", "missing word"

# tie between archives, smaller index wins
assert run(
"""2
a b
2
2 b a
2 b a
"""
) == "1\n[::]\n", "tie breaking"

# perfect ordering
assert run(
"""3
a b c
1
3 a b c
"""
) == "1\n[:|||:]\n", "maximum similarity"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单字案例|`[::]`| 零反转和零最大对 |
 | 档案中缺少单词 |`Brand new problem!`| 后续验证正确性 |
 | 两个相同的存档乐谱 | 选择较小的索引 | 领带处理 |
 | 完美订购 | 最大相似度| 正确的反演计算 |

 ## 边缘情况

 考虑这样一种情况：存档包含重复的单词，但缺少一个必需的单词：```
2
a b
1
4 a a a a
```该算法检查每个排列：```
a b
b a
```子序列匹配器永远不会到达任一排列的末尾，因为`b`永远不会出现。`best_inv`遗迹`None`，因此存档被正确拒绝。 

现在考虑领带处理：```
2
a b
2
2 b a
2 b a
```两个档案都包含排列`b a`与一个反转。 自从：```
max_pairs = 1
similarity = 1 - 1 = 0
```两个档案具有相同的相似性。 

仅当相似度严格较大时，算法才会更新答案。 档案`1`保持选中状态，这符合所需的行为。 

最后，考虑最小的可能输入：```
1
hello
1
1 hello
```只有一种排列和零种可能的反转：```
1 × 0 / 2 = 0
```相似度栏变为：```
[::]
```该实现自然地处理了这个问题，因为乘法`'|' * 0`产生一个空字符串。
