---
title: "CF 1416A - k-惊人的数字"
description: "我们得到一个数组，其值在 1 到 n 之间。 对于每个长度 k，我们查看长度为 k 的所有子数组。 如果每个此类子数组至少包含一次 x，则值 x 被视为有效。 在所有有效值中，我们必须输出最小的一个。"
date: "2026-06-11T07:02:37+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1416
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 673 (Div. 1)"
rating: 1500
weight: 1416
solve_time_s: 148
verified: true
draft: false
---

[CF 1416A - k-惊人数字](https://codeforces.com/problemset/problem/1416/A)

 **评分：** 1500
 **标签：** 二分查找、数据结构、实现、两个指针
 **求解时间：** 2m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个数组，其值介于`1`和`n`。 

对于每个长度`k`，我们查看 **所有** 长度的子数组`k`。 一个值`x`如果每个这样的子数组至少包含一次出现，则被认为是有效的`x`。 在所有有效值中，我们必须输出最小的一个。 如果每个长度都没有出现值-`k`子数组，答案是`-1`。 

考虑条件的另一种方式是：如果一个值`x`某些长度缺失-`k`子数组，那么`x`不是候选人。 我们需要在取任何长度段时无法避免的值`k`。 

所有测试用例的总大小最多为`3 · 10^5`。 任何处理每一个的解决方案`k`单独或扫描所有子数组中的每个值将太慢。 和`n = 3 · 10^5`，我们通常需要接近的东西`O(n log n)`或者`O(n)`每个测试用例。 

棘手的部分是必须为每个`k`从`1`到`n`，因此我们需要一种方法来表征某个值对于给定段长度何时变得有效。 

考虑数组：```
1 2 1
```为了`k = 2`，各段是`[1,2]`和`[2,1]`。 价值`1`两者都出现，所以答案是`1`。 

粗心的方法可能只计算总发生次数。 自从`2`出现一次并且`1`出现两次，看来频率才是最重要的。 它不是。 位置比计数更重要。 

另一个重要案例是：```
1 2 3 4 5
```每个值都只出现一次。 

为了`k = 3`，各段是：```
[1,2,3]
[2,3,4]
[3,4,5]
```唯一价值`3`出现在所有这些中，所以答案是`3`。 

基于频率的方法完全忽略了这种行为。 

还有一种边缘情况是一个值多次出现但差距很大：```
1 1 1 2 1
```价值`1`出现四次，但如果有很长一段没有它，某些片段可以避免它。 重要的是连续出现之间的最大距离，而不是出现的总数。 

## 方法

 A brute-force solution would process every`k`独立。 对于每个值，我们可以检查每个长度是否`k`子数组包含该值。 

一种方法是生成所有`n-k+1`子数组并跟踪每个子数组中出现的值。 即使进行了优化，这很快就会变得至少`O(n²)`并且经常`O(n³)`。 和`n = 3 · 10^5`，这样的方法是没有希望的。 

关键观察来自于查看单个值`x`。 

假设出现以下情况`x`位于以下位置：```
p1, p2, ..., pm
```添加两个虚拟位置：```
0 and n+1
```现在考虑一下差距：```
p1 - 0
p2 - p1
...
pm - p(m-1)
(n+1) - pm
```设最大差距为`g`。 

这意味着什么？ 

如果有长度差距`g`，那么在这两个连续出现之间有`g-1`位置不包含`x`。 

一段长度`g-1`可以完全装入该间隙内，避免`x`完全地。 

所以`x`不能出现在每个长度段中`g-1`。 

另一方面，任意长度的线段`g`必须至少跨越一次出现`x`，因为没有足够大的间隙来容纳`g`连续位置无`x`。 

这给出了一个非常有用的特征：

 一个值`x`出现在每个长度的子数组中`k`当且仅当```
k ≥ largest_gap(x)
```因此每个值都有一个阈值：```
need[x] = largest_gap(x)
```对于所有人`k ≥ need[x]`， 价值`x`是有效的。 

现在问题变成：

 对于每个`k`，找到阈值最大为的最小值`k`。 

这要容易得多。 

我们计算`need[x]`对于每个值。 然后对于每个值`x`，从位置开始成为候选者`need[x]`。 我们存储：```
ans[need[x]] = min(ans[need[x]], x)
```之后，前缀最小扫描将候选者传播到更大的`k`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n2) 到 O(n3) | O(n²) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 为每个值创建一个出现位置列表`1`到`n`。 
2.对于每个数组位置`i`, 附加`i`到出现列表`a[i]`。 
3. 对于每个值`x`，计算其最大间隙。 

从之前的位置开始`0`。 对于每个出现位置`p`， 更新：```
gap = p - previous
```保持最大的这样的差距。 

处理完所有事件后，还要考虑：```
(n + 1) - last_occurrence
```这将处理最后一次出现后的后缀。 
4. 令最大差距为`need[x]`。 

价值`x`对每个都有效`k ≥ need[x]`。 
5. 创建数组`ans`初始化为无穷大。 
6. 对于每个值`x`至少出现一次，更新：```
ans[need[x]] = min(ans[need[x]], x)
```我们记录阈值恰好为的最小值`need[x]`。 
7. 执行前缀最小扫描：```
ans[k] = min(ans[k], ans[k-1])
```为所有人`k`从`2`到`n`。 

一旦某个值变得有效，它对于所有较大的段长度都保持有效。 
8. 将任何剩余的无穷条目替换为`-1`。 
9. 输出`ans[1] ... ans[n]`。 

### 为什么它有效

 对于一个值`x`，连续出现之间的最大距离（包括数组边界）决定了最长的区域，而无需`x`。 

子数组可以避免`x`正是当它完全适合这个区域时。 子数组的最大可能长度，避免`x`是`largest_gap(x) - 1`。 

因此，每个长度的子数组`k`包含`x`恰好当`k ≥ largest_gap(x)`。 

该算法计算每个值的阈值。 值从其阈值开始成为有效候选值，并在之后保持有效。 取每个候选者中的最小值`k`恰好产生所需的 k-amazing 数字。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        pos = [[] for _ in range(n + 1)]

        for i, x in enumerate(a, start=1):
            pos[x].append(i)

        INF = n + 1
        ans = [INF] * (n + 1)

        for value in range(1, n + 1):
            if not pos[value]:
                continue

            mx_gap = 0
            prev = 0

            for p in pos[value]:
                mx_gap = max(mx_gap, p - prev)
                prev = p

            mx_gap = max(mx_gap, n + 1 - prev)

            ans[mx_gap] = min(ans[mx_gap], value)

        for k in range(2, n + 1):
            ans[k] = min(ans[k], ans[k - 1])

        result = []

        for k in range(1, n + 1):
            if ans[k] == INF:
                result.append("-1")
            else:
                result.append(str(ans[k]))

        out.append(" ".join(result))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```出现列表是解决方案的基础。 对于每个值，我们只需要它出现的位置，因为出现之间的最大间隙完全决定了该值何时有效。 

边界位置`0`和`n+1`通过隐式处理`prev = 0`和最后的检查`n + 1 - prev`。 忘记任一边界是此问题中最常见的错误。 出现在第一个位置的值仍然留下大小的前缀间隙`1`，并且出现在最后位置的值仍然留下大小的后缀间隙`1`。 

数组`ans`按阈值存储信息。 如果`need[x] = 5`，然后值`x`首先生效于`k = 5`。 前缀最小传递将这些阈值条目转换为所有较大长度的答案。 

## 工作示例

 ### 示例 1

 输入：```
5
1 2 3 4 5
```出现差距：

 | 价值| 职位 | 最大差距|
 | --- | --- | --- |
 | 1 | [1] | 5 |
 | 2 | [2] | 4 |
 | 3 | [3] | 3 |
 | 4 | [4] | 4 |
 | 5 | [5]| 5 |

 按阈值插入值后：

 | k | 存储最小值|
 | --- | --- |
 | 1 | 信息 |
 | 2 | 信息 |
 | 3 | 3 |
 | 4 | 2 |
 | 5 | 1 |

 前缀最小值之后：

 | k | 回答 |
 | --- | --- |
 | 1 | -1 |
 | 2 | -1 |
 | 3 | 3 |
 | 4 | 2 |
 | 5 | 1 |

 输出：```
-1 -1 3 2 1
```此示例表明，仅出现一次的值仍然可以成为足够大的段长度的答案。 

### 示例 2

 输入：```
6
1 3 1 5 3 1
```发生情况分析：

 | 价值| 职位 | 最大差距|
 | --- | --- | --- |
 | 1 | [1,3,6]| 3 |
 | 2 | []| - |
 | 3 | [2,5]| 3 |
 | 4 | []| - |
 | 5 | [4] | 4 |

 阈值插入：

 | k | 存储最小值|
 | --- | --- |
 | 3 | 1 |
 | 4 | 5 |

 前缀最小值：

 | k | 回答 |
 | --- | --- |
 | 1 | -1 |
 | 2 | -1 |
 | 3 | 1 |
 | 4 | 1 |
 | 5 | 1 |
 | 6 | 1 |

 输出：```
-1 -1 1 1 1 1
```该迹证明了单调性。 一次价值`1`生效日期为`k = 3`，它对于每个更大的仍然有效`k`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | Each occurrence is processed a constant number of times |
 | 空间| O(n) | Occurrence lists and answer arrays store O(n) data |

 在所有测试用例中，总`n`至多是`3 · 10^5`，所以总体复杂度仍然是`O(3 · 10^5)`。 这完全符合时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    def input():
        return sys.stdin.readline()

    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        pos = [[] for _ in range(n + 1)]

        for i, x in enumerate(a, start=1):
            pos[x].append(i)

        INF = n + 1
        ans = [INF] * (n + 1)

        for value in range(1, n + 1):
            if not pos[value]:
                continue

            prev = 0
            mx_gap = 0

            for p in pos[value]:
                mx_gap = max(mx_gap, p - prev)
                prev = p

            mx_gap = max(mx_gap, n + 1 - prev)
            ans[mx_gap] = min(ans[mx_gap], value)

        for k in range(2, n + 1):
            ans[k] = min(ans[k], ans[k - 1])

        out.append(
            " ".join(
                "-1" if ans[k] == INF else str(ans[k])
                for k in range(1, n + 1)
            )
        )

    return "\n".join(out)

# provided samples
assert run(
"""3
5
1 2 3 4 5
5
4 4 4 4 2
6
1 3 1 5 3 1
"""
) == (
"""-1 -1 3 2 1
-1 4 4 4 2
-1 -1 1 1 1 1"""
), "sample"

# minimum size
assert run(
"""1
1
1
"""
) == "1", "single element"

# all equal
assert run(
"""1
4
2 2 2 2
"""
) == "2 2 2 2", "all equal values"

# alternating pattern
assert run(
"""1
5
1 2 1 2 1
"""
) == "-1 1 1 1 1", "alternating occurrences"

# boundary gap check
assert run(
"""1
3
1 2 3
"""
) == "-1 2 1", "prefix and suffix gaps"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`[1]`|`1`| 尽可能小的实例 |
 |`[2,2,2,2]`|`2 2 2 2`| 间隙大小为 1 的重复值 |
 |`[1,2,1,2,1]`|`-1 1 1 1 1`| 多次出现和阈值传播 |
 |`[1,2,3]`|`-1 2 1`| 正确处理边界间隙|

 ## 边缘情况

 考虑：```
1
3
1 2 3
```价值`2`出现在中间。 其差距在于：```
2 - 0 = 2
4 - 2 = 2
```最大的差距是`2`，所以它变得有效`k = 2`。 

价值`1`差距最大`3`，因此它仅适用于`k = 3`。 

输出是：```
-1 2 1
```不考虑虚拟头寸`0`和`n+1`，这个答案是错误的。 

现在考虑：```
1
4
2 2 2 2
```差距都是`1`， 所以`need[2] = 1`。 

算法放置值`2`在`ans[1]`，并且前缀最小扫描将其传播到每个更大的`k`。 

输出：```
2 2 2 2
```这验证了到处出现的值对于所有段长度都立即有效。 

最后考虑：```
1
5
1 2 1 2 1
```为了价值`1`差距是：```
1, 2, 2, 2
```最大的差距是`2`，所以每段长度至少`2`必须包含一个`1`。 

算法记录：```
need[1] = 2
```并产生：```
-1 1 1 1 1
```这个例子说明了为什么最大的差距，而不是频率，是决定有效性的数量。
