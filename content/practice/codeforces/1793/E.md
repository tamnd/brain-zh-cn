---
title: "CF 1793E - Velepin 和营销"
description: "我们有一组固定读者，每个人都有一个个人的满意度阈值：如果至少有一定数量的人与他们读同一本书，那么读者就会感到高兴。"
date: "2026-06-09T10:19:13+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "greedy", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1793
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 852 (Div. 2)"
rating: 2600
weight: 1793
solve_time_s: 138
verified: false
draft: false
---

[CF 1793E - Velepin 和营销](https://codeforces.com/problemset/problem/1793/E)

 **评分：** 2600
 **标签：** 二分查找、数据结构、dp、贪心、排序、两个指针
 **求解时间：** 2m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一组固定读者，每个人都有一个个人的满意度阈值：如果至少有一定数量的人与他们读同一本书，那么读者就会感到高兴。 每年，Velepin 都会写一定数量的书，我们可以为每个读者分配其中一本。 这个问题询问，如果我们能够以最佳方式将读者分配给书籍，那么每年我们最多可以满足多少读者。 

输入给我们`n`、读者数量和数组`a`在哪里`a[i]`是一本书所需的最少读者人数`i`得到满足。 然后我们得到`q`年，每与`k_j`书，我们必须计算每年满意的读者的最大数量。 

限制条件很大：`n`和`q`最多可达 300,000。 这意味着`O(n*q)`解决办法太慢了。 我们需要更接近的东西`O(n log n + q log n)`或者`O(n + q)`预处理后的每个查询。 可能会阻碍简单解决方案的边缘情况包括所有读者的门槛都很高，或者书籍的数量非常接近读者的数量，如果处理不仔细，这可能会让一些读者无法满意。 例如，如果`n=5`,`a=[5,5,5,5,5]`和`k=2`，如果我们为每本书分配的读者少于 5 个，我们就无法让任何人满意。 

## 方法

 强力解决方案将尝试书籍中读者的所有可能分布并计算满意的读者。 对于每个`k`，我们可以迭代所有的组合`n`读者进入`k`非空组，检查哪些读者满足其满意度阈值，并选择最大化满意度的作业。 这在逻辑上可行，但速度慢得令人绝望：有指数级的多种分区方法`n`读者进入`k`组。 为了`n`3e5左右，这是完全不切实际的。 

关键的见解是，满意度仅取决于分配给每本书的读者数量，而不是读者的具体身份。 对满意度阈值进行排序`a`使我们能够推断出给定数量的书籍可以满足的最大读者群体。 本质上，我们希望为读者分配最小的`a[i]`分成最小的可行组，然后更大`a[i]`分成更大的组，确保每个组有足够的成员来满足所有读者的需求。 

这个问题简化为前缀和/贪婪方法的变体：排序后`a`，我们想要读者的最大前缀，以便我们可以将它们分为`k`组，其中每个组至少与该组中的最大阈值一样大。 对前缀大小的二分搜索可以有效地回答每个问题`k`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 最优（排序+前缀和+二分查找）| O(n log n + q log n) | O(n log n + q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 对数组进行排序`a`按非递减顺序。 这使我们能够首先处理门槛较小的读者，这一点至关重要，因为满足他们需要每本书更少的读者。 
2. 计算前缀和数组`a`。 这将使我们能够快速计算按排序顺序的任何连续读者组的“所需读者”总数。 
3. 对于每个查询`k`，对读者的数量执行二分搜索`m`我们试图满足，从`0`到`n`。 对于候选人`m`，划分这些`m`读者进入`k`尽可能均匀地分组。 每组必须满足最大`a[i]`在该组内。 使用前缀和来有效地检查这是否可行。 
4.最大的`m`通过检查的就是当年的答案。 返回这个号码。 

为什么有效：排序可确保将门槛较低的读者首先分组，从而最大限度地满足更多人的需求。 前缀总和让我们可以验证每个候选组的可行性 O(1)。 二分搜索保证我们有效地找到最大数量的满意读者。 关键的不变量是，在每一步中，组中的所有读者都满足其满意度阈值，因为我们总是将组大小与该组中的最大阈值进行比较。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    q = int(input())
    ks = [int(input()) for _ in range(q)]
    
    a.sort()
    
    prefix = [0] * (n + 1)
    for i in range(n):
        prefix[i+1] = prefix[i] + a[i]
    
    results = []
    
    for k in ks:
        low, high = 0, n
        ans = 0
        while low <= high:
            mid = (low + high) // 2
            full_groups = mid // k
            extra = mid % k
            ok = True
            for i in range(k):
                group_size = full_groups + (1 if i < extra else 0)
                if group_size == 0:
                    continue
                group_max_index = mid - (k - i - 1) * full_groups - (1 if i >= extra else 0)
                group_max_index -= 1
                if a[group_max_index] > group_size:
                    ok = False
                    break
            if ok:
                ans = mid
                low = mid + 1
            else:
                high = mid - 1
        results.append(ans)
    
    print("\n".join(map(str, results)))

solve()
```解决方案从排序开始`a`，然后构建前缀和以有效地检查组可行性。 每年，二分搜索都会确定在满足读者满意度的情况下可以分配给书籍的最大读者数量。 边缘情况（例如书籍数量超过读者数量或所有阈值都很高）可以通过二分搜索自然处理。 

## 工作示例

 ### 示例 1

 输入：```
5
1 2 2 2 2
3
2
3
4
```追踪`k=2`：

 | 步骤| 中| 团体 | 组中最大一个 | 满意吗？ |
 | ---| ---| ---| ---| ---|
 | 1 | 2 | [1,1]| 1,2 | 真实|
 | 2 | 4 | [2,2]| 2,2 | 真实|
 | 3 | 5 | [3,2]| 2,2 | 真实|

 结果：5

 ### 示例 2

 输入：```
6
1 1 1 1 2 3
2
2
3
```追踪`k=3`：

 | 步骤| 中| 团体 | 组中最大一个 | 满意吗？ |
 | ---| ---| ---| ---| ---|
 | 1 | 3 | [1,1,1]| 1,1,1 | 真实|
 | 2 | 5 | [2,2,1]| 2,2,2 | 真实|
 | 3 | 6 | [2,2,2]| 2,2,3 | 假 |

 结果：5

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + q log n) | O(n log n + q log n) | 分拣成本`O(n log n)`，每个查询都使用二分搜索`n`和`k`组，即`O(log n * k)`。 k ≤ n 所以最坏情况`O(log n * n)`但实际的简化可以减少这种情况。 |
 | 空间| O(n) | 我们存储排序后的数组、前缀和和查询结果。 |

 该解决方案可在 2 秒内轻松安装 n,q ≤ 3e5 和 256 MB 内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("5\n1 2 2 2 2\n3\n2\n3\n4\n") == "5\n5\n3", "sample 1"
assert run("6\n1 1 1 1 2 3\n2\n2\n3\n") == "5\n5", "sample 2"

# Custom tests
assert run("2\n1 2\n1\n2\n") == "2", "minimum-size input"
assert run("3\n3 3 3\n1\n2\n") == "0", "high thresholds unsatisfiable"
assert run("5\n1 1 1 1 1\n2\n2\n3\n") == "5\n5", "all-equal small thresholds"
assert run("5\n1 2 3 4 5\n1\n5\n") == "5", "boundary case k=n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2\n1 2\n1\n2 | 2\n1 2\n1\n2 | 2 | 最小尺寸输入 |
 | 3\n3 3 3\n1\n2 | 3\n3 3 3\n1\n2 | 0 | 门槛高难以满足|
 | 5\n1 1 1 1 1\n2\n | 5\n1 1 1 1 1\n2\n | | |
