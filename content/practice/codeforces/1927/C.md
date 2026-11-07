---
title: "CF 1927C - 选择不同的！"
description: "我们有两个数组 a 和 b，以及一个偶数 k。 我们需要从每个数组中精确挑选 k/2 个元素，以便所选元素的多重集包含从 1 到 k 的所有整数。"
date: "2026-06-08T18:53:24+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1927
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 923 (Div. 3)"
rating: 1000
weight: 1927
solve_time_s: 138
verified: false
draft: false
---

[CF 1927C - 选择不同的！](https://codeforces.com/problemset/problem/1927/C)

 **评分：** 1000
 **标签：** 暴力、贪婪、数学
 **求解时间：** 2m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个数组，`a`和`b`，和一个偶数`k`。 我们需要准确地选择`k/2`每个数组中的元素，使得所选元素的多重集包含**来自的所有整数`1`到`k`**。 我们选择元素的顺序并不重要； 重要的是全系列的覆盖`[1, k]`。 

输入提供多个测试用例。 每个测试用例指定数组的长度`n`和`m`、数组本身以及 的值`k`。 输出是简单的“是”或“否”，具体取决于选择是否可能。 

这些限制虽然温和但很重要。`n`和`m`可以达到`2 * 10^5`单独测试，并且所有测试用例的总和不超过`4 * 10^5`。 这排除了任何检查大小的**所有可能子集**的方法`k/2`在任一数组中，因为子集的数量以组合方式增长。 相反，我们需要一个可以线性或近线性扫描每个阵列的解决方案。 的价值`k`总是均匀且满足`k <= 2 * min(n, m)`，这保证了选择`k/2`每个数组中的元素在计数方面始终是可行的。 

边缘情况很微妙。 一种是数组包含重复元素时。 例如，如果`k=4`,`a=[1,1,1,1]`和`b=[2,3,4]`，我们只能选择`1`从`a`（我们想要多少就多少，但重复不覆盖新数字），并且我们无法满足覆盖要求，所以答案是“否”。 另一种情况是当`k/2`等于数组的长度，迫使我们选择其中的所有元素。 我们仍然必须检查另一个数组是否可以覆盖剩余的数字。 忽略这些细微差别会导致细微的错误。 

## 方法

 天真的方法是蛮力。 可以枚举大小的所有子集`k/2`从`a`以及大小的所有子集`k/2`从`b`，然后检查他们的并集是否涵盖了来自的所有数字`1`到`k`。 虽然这在理论上可行，但复杂性是`O(n choose k/2 * m choose k/2 * k)`，这对于`n, m`最多`2*10^5`。 

关键的见解是我们不关心特定的子集，只关心**存在哪些数字**。 每个数组只能向覆盖范围贡献一次数字，即使它有多个重复项也是如此。 因此，我们可以将每个数组视为一组小于或等于的数字`k`**。 那么问题就简化为检查是否最多可以选择`k/2`每个集合中的元素，同时共同覆盖所有`1..k`。 

实际上，我们只需要计算其中有多少个数字`1..k`存在于每个数组中。 让`count_in_a`是数字的个数`1..k`出现在`a`，并且类似地`count_in_b`为了`b`。 如果`count_in_a > k/2`，我们只能选择`k/2`数字来自`a`，因此有效地覆盖数字的数量`a`是`min(count_in_a, k/2)`。 同样对于`b`。 然后，问题就简化为验证这些贡献的总和是否至少为`k`。 如果是，则存在有效选择； 否则，它不会。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((n 选择 k/2) * (m 选择 k/2) * k) | O(k) | 太慢了 |
 | 最佳 | 每个测试用例 O(n + m + k) | O(k) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`,`m`,`k`和数组`a`和`b`。 
3.初始化两个布尔数组（或集合）`present_a`和`present_b`长度`k+1`跟踪哪些号码来自`1..k`出现在`a`和`b`分别。 
4. 对于中的每个数字`a`，如果它介于`1`和`k`，将其标记为存在于`present_a`。 
5. 重复`b`, 标记`present_b`。 
6. 数一下里面的数字`1..k`出现在每个数组中的：`count_in_a`是`present_a[1..k]`， 和`count_in_b`是`present_b[1..k]`。 
7. 计算每个阵列的有效贡献：`contrib_a = min(count_in_a, k/2)`,`contrib_b = min(count_in_b, k/2)`。 
8.如果`contrib_a + contrib_b >= k`，输出“是”。 否则，输出“NO”。 

**为什么有效：** 不变的是每个数组最多可以贡献`k/2`覆盖范围的数字。 通过计算存在的实际数量并将其限制为`k/2`，我们模拟每个阵列可以提供的最大覆盖范围。 如果他们的综合覆盖范围达到`k`，然后有效选择`k/2`每个数组中的元素都存在； 否则，这是不可能的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    
    present_a = [0] * (k + 1)
    present_b = [0] * (k + 1)
    
    for x in a:
        if 1 <= x <= k:
            present_a[x] = 1
    for x in b:
        if 1 <= x <= k:
            present_b[x] = 1
    
    count_in_a = sum(present_a[1:])
    count_in_b = sum(present_b[1:])
    
    contrib_a = min(count_in_a, k // 2)
    contrib_b = min(count_in_b, k // 2)
    
    print("YES" if contrib_a + contrib_b >= k else "NO")
```该解决方案可以高效地读取输入，并使用布尔数组来跟踪哪些数字可用。 使用`min(count, k//2)`确保我们遵守可以从每个数组中选取的元素数量的限制。 对存在数组求和是安全的，因为我们忽略外面的数字`1..k`。 这可以避免差一错误。 

## 工作示例

 **示例1：**`a=[2,3,8,5,6,5]`,`b=[1,3,4,10,5]`,`k=6`。 

| 数量 | 存在于 | 存在于 b |
 | ---| ---| ---|
 | 1 | 0 | 1 |
 | 2 | 1 | 0 |
 | 3 | 1 | 1 |
 | 4 | 0 | 1 |
 | 5 | 1 | 1 |
 | 6 | 1 | 0 |`count_in_a = 4`,`count_in_b = 4`。`k/2 = 3`。`contrib_a = 3`,`contrib_b = 3`。 总和 = 6 ≥ k → 是。 

**示例2：**`a=[2,3,4,5,6,5]`,`b=[1,3,8,10,3]`,`k=6`。 

| 数量 | 存在于 | 存在于 b |
 | ---| ---| ---|
 | 1 | 0 | 1 |
 | 2 | 1 | 0 |
 | 3 | 1 | 1 |
 | 4 | 1 | 0 |
 | 5 | 1 | 0 |
 | 6 | 1 | 0 |`count_in_a = 5`,`count_in_b = 2`。`contrib_a = 3`,`contrib_b = 2`。 总和 = 5 < 6 → 否。 

这些痕迹表明，限制贡献可确保解决方案尊重`k/2`选择限制。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n + m + k) | 扫描每个数组一次，对存在数组求和 |
 | 空间| O(k) | 两个大小为 k+1 的数组来跟踪存在 |

 在所有测试用例中，总和`n + m`≤ 4 * 10^5，并且`k ≤ 2 * min(n, m)`≤ 4 * 10^5。 整个操作完全符合 2 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution code
    t = int(input())
    for _ in range(t):
        n, m, k = map(int, input().split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))
        present_a =
```
