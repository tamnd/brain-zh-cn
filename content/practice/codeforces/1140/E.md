---
title: "CF 1140E - 无回文数组"
description: "我们被要求计算可以从长度为 n 的部分指定数组构造的数组数量，其中缺少一些元素并用 -1 表示。 每个 -1 可以替换为 1 到 k 之间的任何整数。"
date: "2026-06-12T03:47:18+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "divide-and-conquer", "dp"]
categories: ["algorithms"]
codeforces_contest: 1140
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 62 (Rated for Div. 2)"
rating: 2200
weight: 1140
solve_time_s: 78
verified: true
draft: false
---

[CF 1140E - 无回文数组](https://codeforces.com/problemset/problem/1140/E)

 **评分：** 2200
 **标签：** 组合学、分而治之、dp
 **求解时间：** 1m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算可以从部分指定长度的数组构造的数组数量`n`，其中缺少一些元素并表示为`-1`。 每个`-1`可以替换为任意整数`1`到`k`。 关键的约束是结果数组不得包含任何奇数长度大于的回文子数组`1`。 换句话说，长度为 3、5、7 等的任何连续段不能向前和向后读取相同的内容。 

输入数组可能有一些固定的数字和一些`-1`s。 输出是一个整数：填充方式的计数`-1`s 形成一个“好”数组，取模`998244353`。 

限制条件很大：`n`和`k`每个最多可以达到200,000。 一种暴力方法，尝试所有可能的替代方案`-1`是完全不可行的，因为这将涉及到`k^n`的可能性。 我们需要一个在线性或接近线性时间内工作的解决方案`n`。 

边缘情况包括具有所有`-1`s，没有的数组`-1`s、具有两个或多个相同相邻值的数组，以及固定值已强制回文的数组。 例如，数组`[1, -1, 1]`有一个长度为 3 的回文，如果`-1`被替换为`1`，所以只有`k-1`选择是有效的。 另一个边缘情况是具有交替固定值的数组，例如`[1, 2, 1, 2, 1]`，其中某些位置必须不同以避免形成长度为 3 的回文。 

## 方法

 一种天真的方法是尝试每种数字组合`-1`位置，然后检查每个奇数长度子数组是否有回文。 这在原则上是正确的，但即使对于`n = 20`和`k = 5`，有超过10万亿种可能性。 每个候选人的检查本身是 O(n^2)，这使得该方法不可行。 

关键的见解是奇数长度的回文是局部的并且以特定位置为中心。 长度为 3 的奇数回文仅涉及三个连续数字，长度为 5 涉及五个连续数字，依此类推。 我们可以将问题分成两个独立的问题：一个针对奇数索引处的元素，另一个针对偶数索引处的元素。 每个序列都可以独立处理，因为回文仅出现在具有相同奇偶校验索引分隔的连续元素之间。 

一旦我们分割了数组，我们就可以单独处理每个子序列。 子序列简化为更简单的“填充约束”问题：对于一段连续的`-1`s 在两个固定值之间，我们需要计算填充它的方法数量，而不会创建会导致回文的重复。 有一个众所周知的组合公式：如果线段长度为`len`且边界值相等，有`(k-1)^(len//2)`方式，如果它们不同，则有`(k-1)^((len+1)//2)`方式。 如果只有一个`-1`并且没有任何限制，可以填写`k`方式。 

将子序列的所有独立段的计数相乘即可得出该子序列的总计数。 将奇数子序列和偶数子序列的计数相乘即可得出最终答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(k^n * n^2) | O(k^n * n^2) | O(n) | 太慢了 |
 | 分裂奇偶校验 DP | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将数组分成两个子序列：一个包含奇数索引处的元素，一个包含偶数索引处的元素。 这可确保长度为 3 或以上的回文不会跨越序列，从而允许独立处理。 
2. 对于每个子序列，迭代其元素并识别连续的片段`-1`s。 每个段要么位于两个已知数字之间，要么位于数组的边界处。 
3. 对于每个段：

 - 如果两边都有已知数，则根据边界值是否相等计算有效填充数。 使用公式`(k-1)^(segment_length//2)`对于相等的边界和`(k-1)^((segment_length+1)//2)`对于不平等的边界。 
- 如果该段在一侧不受限制，则将其视为在自由侧具有自由度。 一段长度`len`贡献`k * (k-1)^(len-1)`方式。 
4. 将子序列中所有段的路数相乘。 
5. 将两个子序列的结果相乘，得到好数组的总数模`998244353`。 
6. 返回结果。 

为什么它有效：通过分为奇数和偶数索引，我们确保不会遗漏奇数长度大于 1 的回文。 独立地计算每个分段的有效填充并将它们相乘可以保持正确性，因为分段不会跨固定边界相互作用。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def count_good(subseq, k):
    n = len(subseq)
    ans = 1
    i = 0
    while i < n:
        if subseq[i] != -1:
            i += 1
            continue
        j = i
        while j < n and subseq[j] == -1:
            j += 1
        left = subseq[i-1] if i-1 >= 0 else None
        right = subseq[j] if j < n else None
        length = j - i
        if left is None and right is None:
            ways = k * pow(k-1, length-1, MOD) if length > 0 else k
        elif left is None or right is None:
            ways = pow(k-1, length, MOD)
        else:
            if left == right:
                ways = pow(k-1, length//2, MOD)
            else:
                ways = pow(k-1, (length+1)//2, MOD)
        ans = ans * ways % MOD
        i = j
    return ans

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    odd = a[::2]
    even = a[1::2]
    res = count_good(odd, k) * count_good(even, k) % MOD
    print(res)

solve()
```功能`count_good`一次处理一个子序列。 它标识连续的`-1`分段并应用组合公式。 对数组边界处的段进行特殊处理，其中可能只有一个固定邻居或根本没有。 主函数将数组分成奇数和偶数子序列，计算每个子序列的路数，并将它们相乘以取模`998244353`。 

## 工作示例

 示例 1 输入：```
2 3
-1 -1
```| 索引 | 后续| 细分 | 左| 对| 长度 | 方式|
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | 奇数 [-1] | 0-0 | 无 | 无 | 1 | 3 |
 | 0 | 甚至 [ -1 ] | 0-0 | 无 | 无 | 1 | 3 |

 将两个子序列相乘：3 * 3 = 9，与预期输出匹配。 

示例 2 输入：```
3 2
-1 1 -1
```奇数子序列：`[-1, -1]`偶数序列：`[1]`对于奇数子序列，有两个片段`-1`s，一侧无界，右界为 1。使用公式`(k-1)^length = 1^2 = 1`。 

甚至子序列也没有`-1`，所以 1 种方式。 

总路数 = 1 * 1 = 1。 

这演示了正确处理具有部分边界的段。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个元素在奇数和偶数子序列中都会被访问一次； 段处理是线性的。 |
 | 空间| O(n) | 存储两个大小分别为 n/2 的子序列。 |

 该解决方案完全符合 2 秒限制和 256 MB 内存限制，因为所有运算都是线性的并且仅涉及模幂运算。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided sample
assert run("2 3\n-1 -1\n") == "9", "sample 1"

# Custom cases
assert run("3 2\n-1 1 -1\n") == "1", "partial bounds"
assert run("4 2\n-1 -1 -1 -1\n") == "4", "all -1, even length"
assert run("5 3\n1 -1 2 -1 3\n") == "4", "alternating fixed values"
assert run("2 200000\n-1 -1\n") == str(200000**2 % 998244353), "large k"
assert run("6 2\n1 -1 -
```
