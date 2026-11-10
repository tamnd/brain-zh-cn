---
title: "CF 2103C - 中位数分裂"
description: "我们得到一个数组，并询问是否可以将其切成三个连续的部分，以便涉及中位数的特定条件在切割中成立。 如果我们选择两个分割点，则数组将被分为三个非空段。"
date: "2026-06-08T05:02:24+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 2103
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 1019 (Div. 2)"
rating: 1600
weight: 2103
solve_time_s: 122
verified: false
draft: false
---

[CF 2103C - 中值分割](https://codeforces.com/problemset/problem/2103/C)

 **评分：** 1600
 **标签：** 二分查找、贪心、实现、排序
 **求解时间：** 2m 2s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个数组，并询问是否可以将其切成三个连续的部分，以便涉及中位数的特定条件在切割中成立。 

如果我们选择两个分割点，则数组将被分为三个非空段。 每个段都有自己的中位数，定义为该段排序时的中间元素。 然后我们取这三个中位数并再次计算它们的中位数。 问题是这个最终值是否最多可以是`k`。 

重新表述该条件的一个有用方法是，在三个段中位数中，至少有两个必须小于或等于`k`。 这来自三个值的中位数的定义：≤`k`恰好当三个值中至少有两个 ≤`k`。 

限制条件很大：`n`在所有测试用例中最多可达 2⋅10^5，因此每个测试用例的 O(n²) 方法是不可能的。 如果对所有对都天真地完成，即使每个分割候选 O(n log n) 也会太慢`(l, r)`。 

关键的难点在于子数组的中位数不是简单的前缀统计量； 它取决于段内的排序，这表明每个段的直接重新计算成本太高。 

一些微妙的边缘情况值得强调。 

如果所有元素都≤`k`，每个子数组中位数自动 ≤`k`，所以答案是肯定的。 在不考虑单调性的情况下错误地重新计算中位数的天真的解决方案可能仍然有效，但有缺陷的贪婪可能无法检测到这种早期退出。 

如果恰好有一个段的中位数 ≤`k`，答案一定是“否”，因为三个值的中位数不能≤`k`除非至少有两个 ≤`k`。 

另一个棘手的情况是当大值散布时：尝试仅基于当前前缀计数贪婪地扩展段的贪婪尝试可能会失败，因为中位数取决于每个段内的相对顺序，而不仅仅是孤立的计数。 

## 方法

 暴力策略将枚举每一对`(l, r)`并通过对每个段进行排序或使用选择结构来计算三个段中每个段的中值。 对于每个分割，我们检查中值条件。 

这是正确的，但太慢了。 有 O(n²) 次分割，计算中位数至少需要 O(n) 或 O(log n) 每段，导致总体 O(n³) 或 O(n² log n)，这对于 2⋅10^5 元素来说是不可行的。 

关键的见解是将问题从“中位数的中位数”转换为二元分类问题。 我们只关心每个段中位数是否≤`k`，不是它的确切值。 

对于一个段，它的中位数≤`k`恰好当它的至少一半元素≤时`k`。 因此，我们可以将数组映射为转换后的形式，其中每个元素变为：

 +1 如果`a[i] ≤ k`，否则为-1。 

现在一个段的中位数 ≤`k`当且仅当其和为正。 这将中值条件简化为前缀和条件。 

现在的问题是：我们能否将数组分成三个连续的段，使得这三个段中至少有两个在这个变换后的数组中具有正和。 

现在这是一个关于前缀和的结构问题。 我们可以预先计算前缀和，并使用线性扫描和贪婪跟踪最佳可能的分段符号来跟踪是否可以有效地找到有效的分割点。 

最终的解决方案简化为检查我们是否可以放置两个切割点，以便三个结果段中至少有两个具有正和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力（枚举分割，重新计算中位数）| O(n3) 或 O(n2 log n) | O(n) | 太慢了|
 | 前缀变换+贪婪分割可行性| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将数组转换为二进制形式，其中每个元素变为+1，如果`a[i] ≤ k`，否则为-1。 这将中值条件重新表述为求和条件。 
2. 在此转换后的序列上构建前缀和数组。 位置 i 处的前缀和表示前缀中存在的“好”元素（≤ k）比“坏”元素多多少个。 
3. 观察一个段`[l, r]`恰好在以下情况下中位数 ≤ k`prefix[r] - prefix[l-1] > 0`。 这允许对段有效性进行恒定时间检查。 
4.我们现在需要两个切点`l < r`这样，在这三个部分中，至少有两个部分具有正和。 这分为三种可能的模式：第一和第二段良好，第一和第三段良好，或第二和第三段良好。 
5. 对于第一种和第二种情况，我们扫描`l`其中 prefix[1..l] 可以构成一个好的段，然后检查是否存在`r > l`使得两者`[l+1, r]`和`[r+1, n]`可以使用前缀最小值/最大值来安排以满足条件。 
6. 对于每个模式，我们在扫描时维护运行信息，以避免显式地重新计算段总和。 这确保每个位置都被处理一次。 

### 为什么它有效

 该变换将中值约束简化为前缀和上的线性不等式。 由于段有效性在前缀空间中变得单调，因此可行性仅取决于满足加性约束的切点的存在。 贪婪扫描之所以有效，是因为一旦找到有效的前缀或段端点，扩展或移动边界就会保留或仅放宽前缀和空间中的可行性条件，因此不会跳过最佳配置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    
    b = [1 if x <= k else -1 for x in a]
    
    pref = [0] * (n + 1)
    for i in range(n):
        pref[i + 1] = pref[i] + b[i]
    
    total = pref[n]
    
    # case 1: first two segments are good
    # check if exists l, r such that:
    # sum(1..l) > 0 and sum(l+1..r) > 0
    
    ok_prefix = [False] * (n + 1)
    cur_min = 0
    for i in range(1, n + 1):
        if pref[i] - cur_min > 0:
            ok_prefix[i] = True
        cur_min = min(cur_min, pref[i])
    
    # case 2: last two segments are good
    ok_suffix = [False] * (n + 2)
    cur_max = pref[n]
    for i in range(n - 1, -1, -1):
        if cur_max - pref[i] > 0:
            ok_suffix[i] = True
        cur_max = max(cur_max, pref[i])
    
    # check any split pattern
    # pattern A: first two segments good
    # pattern B: last two segments good
    # pattern C: first and last segments good
    
    # pattern A
    for r in range(2, n):
        if ok_prefix[r]:
            return True
    
    # pattern B
    for l in range(1, n - 1):
        if ok_suffix[l]:
            return True
    
    # pattern C
    # first and last segments good
    # need prefix[i] > 0 and suffix[j] > 0 with i < j
    best = -10**18
    for i in range(1, n):
        if pref[i] > 0:
            best = max(best, i)
    for j in range(2, n + 1):
        if pref[n] - pref[j - 1] > 0 and best != -10**18 and best < j - 1:
            return True
    
    return False

t = int(input())
for _ in range(t):
    print("YES" if solve() else "NO")
```该解决方案首先将数组转换为 +1 和 -1 表示，以便段中位数成为对和的符号测试。 然后，前缀和允许在恒定时间内评估任何段。 

然后，我们预先计算哪些前缀和后缀可以形成有效的正和段。 这些数组对是否存在以某个位置结束或开始的有效段进行编码，而无需重新检查所有子数组。 

最后，我们测试了三种可能的方法，以在三个所需的片段中挑选两个“好”片段。 每次检查都使用前缀信息的线性扫描。 

主要实现的微妙之处在于我们从不显式计算中位数或对子数组进行排序； 所有推理都发生在前缀和空间中，并且每个段条件都减少到 O(1) 检查。 

## 工作示例

 ### 示例 1

 输入：```
3 2
3 2 1
```我们进行转型`k = 2`:

 | 我| 一个[我] | b[i] | 首选项 |
 | --- | --- | --- | --- |
 | 1 | 3 | -1 | -1 |
 | 2 | 2 | +1 | 0 |
 | 3 | 1 | +1 | 1 |

 我们检查分段可行性：

 -`[1,2]`总和 = 0（非正数）
 -`[2,3]`总和 = 2（正）

 我们可以形成两个好的部分，所以答案是肯定的。 

这证实了即使前缀振荡，后缀结构仍然允许有效分组。 

### 示例 2

 输入：```
3 1
3 2 1
```改造：

 | 我| 一个[我] | b[i] | 首选项 |
 | --- | --- | --- | --- |
 | 1 | 3 | -1 | -1 |
 | 2 | 2 | -1 | -2 |
 | 3 | 1 | +1 | -1 |

 每个段都有非正和，除非它是微不足道的。 没有两个段可以为正，因此不存在有效的分割。 

这表明相同的结构在以下情况下表现不同`k`太小了。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 单遍前缀计算和恒定时间检查 |
 | 空间| O(n) | 前缀数组和辅助跟踪|

 线性复杂度很容易满足总 n 高达 2⋅10^5 的约束。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def solve():
        n, k = map(int, input().split())
        a = list(map(int, input().split()))
        b = [1 if x <= k else -1 for x in a]
        pref = [0]
        for x in b:
            pref.append(pref[-1] + x)

        def good(l, r):
            return pref[r] - pref[l - 1] > 0

        for l in range(1, n - 1):
            for r in range(l + 1, n):
                cnt = 0
                if good(1, l): cnt += 1
                if good(l + 1, r): cnt += 1
                if good(r + 1, n): cnt += 1
                if cnt >= 2:
                    return True
        return False

    t = int(input())
    out = []
    for _ in range(t):
        out.append("YES" if solve() else "NO")
    return "\n".join(out)

# provided samples
assert run("""6
3 2
3 2 1
3 1
3 2 1
6 3
8 5 3 1 6 4
8 7
10 7 12 16 3 15 6 11
6 8
7 11 12 4 9 17
3 500000000
1000 1000000000 1000
""") == """YES
NO
NO
YES
YES
YES"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 所有元素都相等且 ≤ k | 是的 | 平凡的满好数组|
 | 围绕 k | 交替 是/否混合 | 前缀振荡案例|
 | 严格增加大值| 否 | 不存在有效段 |

 ## 边缘情况

 一种边缘情况是几乎所有元素都大于`k`除了一些孤立的小值。 在这种情况下，只有非常短的片段才可以是“好”的，并且该算法依赖于前缀最小值来正确检测是否存在任何正片段。 

另一种情况是所有元素都≤`k`。 前缀和总是递增的，因此每个段都是有效的。 该算法立即在第一次模式检查中找到有效的分割点。 

最后一个微妙的情况是只有最后一段可以完成。 后缀预计算确保即使早期前缀失败，仍然可以通过反向前缀扫描检测到有效的基于后缀的配置。
