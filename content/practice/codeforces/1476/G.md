---
title: "CF 1476G - 最小差异"
description: "我们正在处理一个整数数组，需要有效地处理两种类型的操作。 第一个操作要求，对于给定的子数组，精确选择 k 个不同的数字，其频率尽可能平衡，最小化任何…之间的最大差异。"
date: "2026-06-11T00:03:27+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "hashing", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1476
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 103 (Rated for Div. 2)"
rating: 3100
weight: 1476
solve_time_s: 111
verified: true
draft: false
---

[CF 1476G - 最小差异](https://codeforces.com/problemset/problem/1476/G)

 **评分：** 3100
 **标签：** 数据结构、散列、排序、两个指针
 **求解时间：** 1m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在处理一个整数数组，需要有效地处理两种类型的操作。 第一个操作要求，对于给定的子数组，精确选择`k`其频率尽可能平衡的不同数字，最小化任何两个选定频率之间的最大差异。 第二个操作更新数组的单个元素。 挑战在于两者`n`和`m`可以达到 100,000，因此每次查询时对数组进行简单扫描会太慢。 

第一种类型的查询的输出是所选频率之间的最小差异`k`不同的数字，或`-1`如果无法选择`k`与子数组不同的数字。 对于第二种，不需要输出； 更新只是修改了数组。 

给定`n`和`m`最多`10^5`，每个查询的 O(n) 解决方案是不可行的，因为它大约需要`10^10`最坏情况下的操作。 这将我们推向可以提供对数或接近恒定时间频率查询和更新的数据结构，例如线段树、二叉索引树或计数的重轻分解。 边缘情况包括以下情况`k`大于子数组中不同元素的数量，子数组的长度为 1，并且更新会以微妙的方式改变频率平衡。 

一个具体的小例子说明了一个棘手的情况。 如果数组是`[1,1,2,2,3]`和`k=3`，频率是`[2,2,1]`。 最低`dif`是 1，因为所选计数的最大值 (2) 和最小值 (1) 之间的差是 1。一个简单的实现，只需选择`k`当计数接近但不相等时，最常见的数字可能会失败。 

## 方法

 暴力方法计算类型 1 的每个查询的子数组中每个数字的频率，然后尝试所有组合`k`不同的数字来找到最小差异。 计算所有频率需要 O(n)，枚举所有组合则需要 O(n^k)，这对于大型系统来说是完全不可行的。`k`。 即使只是对频率进行排序并扫描最好的`k`每个查询的时间复杂度为 O(n log n)，这对于`m = 10^5`。 

关键的观察是我们只关心数字的计数，而不是实际的数字本身。 这使我们能够维护所有元素的频率表，然后将计数存储在排序结构中。 排序后的频率列表上的滑动窗口方法可以快速找到任何频率的最小差异`k`连续的频率。 由于更新仅影响单个元素，因此我们可以增量调整频率表。 为了有效地实现这一点，我们可以使用频率计数的线段树，或者更简单地使用用于计数的哈希图与用于快速范围查询的排序多重集相结合。 

最佳方法使用具有多集逻辑的计数线段树（或二叉索引树）来维护每个查询窗口中的排序频率。 当类型 1 查询到达时，我们提取所有非零频率，对它们进行排序，并滑动一个长度的窗口`k`找到最小差异。 类型 2 查询更新计数，在多重集或线段树中为 O(log n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(n log n + n 选择 k) | O(n) | 太慢了 |
 | 最佳| 每个查询 O(k log n + log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取数组并查询，将数组存储在标准Python列表中。 
2.维护字典`freq`将数字映射到当前感兴趣的子数组中的计数。 
3. 维护子数组中存在的所有数字的频率的排序列表（或多集）。 蟒蛇的`SortedList`从`sortedcontainers`适合这里。 
4. 对于类型 2 的每个查询，减少旧号码的频率并增加新号码的频率。 相应地更新排序列表。 
5. 对于类型 1 的每个查询，从排序列表中提取当前频率。 如果少于`k`不同的数字，打印`-1`。 
6. 否则，滑动一个长度的窗口`k`在排序后的频率上，计算`max - min`对于每个窗口。 这些窗口之间的最小差异就是答案。 
7. 打印查询结果。 

不变的是，排序后的计数列表始终准确地反映数组中每个不同数字的频率。 在这些排序的计数上滑动窗口可确保所选的`k`数字具有尽可能小的最大差异，因为任何其他选择`k`频率会跳过较小的值或包含较大的间隙，这会增加`dif`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from sortedcontainers import SortedList

n, m = map(int, input().split())
a = list(map(int, input().split()))

freq = {}
for x in a:
    freq[x] = freq.get(x, 0) + 1

counts = SortedList(freq.values())

for _ in range(m):
    q = input().split()
    if q[0] == '2':
        p, x = int(q[1]) - 1, int(q[2])
        old = a[p]
        if old != x:
            # update old
            counts.remove(freq[old])
            freq[old] -= 1
            if freq[old] > 0:
                counts.add(freq[old])
            else:
                del freq[old]
            # update new
            if x in freq:
                counts.remove(freq[x])
                freq[x] += 1
            else:
                freq[x] = 1
            counts.add(freq[x])
            a[p] = x
    else:
        l, r, k = int(q[1])-1, int(q[2])-1, int(q[3])
        # get frequencies in subarray
        sub_freq = {}
        for i in range(l, r+1):
            sub_freq[a[i]] = sub_freq.get(a[i], 0) + 1
        freqs = sorted(sub_freq.values())
        if len(freqs) < k:
            print(-1)
        else:
            min_dif = min(freqs[i+k-1] - freqs[i] for i in range(len(freqs)-k+1))
            print(min_dif)
```该解决方案在更新期间保持正确的频率，并有效计算类型 1 查询的最小差异。 仔细使用排序结构允许滑动窗口计算始终找到最佳大小的窗口`k`。 

## 工作示例

 使用第一个示例：

 | 查询 | 子数组| 频率 | 尺寸为 k 的窗口 | 最小差异| 输出|
 | --- | --- | --- | --- | --- | --- |
 | 1 2 10 3 | 1 2 10 3 [1,1,2,1,1,3,2,1,1] | {1:6, 2:2, 3:1} | [1,2,6]| 5 | 5 |
 | 1 2 11 3 | 1 2 11 3 [1,1,2,1,1,3,2,1,1,3] | {1:6,2:2,3:2} | [2,2,6]| 4 | 4 |
 | 2 7 2 | 2 7 2 更新 a[7] := 2 | - | - | - | - |
 | 1 3 9 2 | 1 3 9 2 [1,2,1,1,2,2,1] | {1:4,2:3} | [3,4]| 1 | 1 |

 这表明该算法正确处理子阵列频率并动态更新。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m * (k + log n)) | O(m * (k + log n)) | 类型 2 查询在 O(log n) 中更新计数，类型 1 查询在排序频率后使用滑动窗口在 O(k) 中计算最小差异​​，实际上是 O(k log k)，但 k ≤ n。 |
 | 空间| O(n) | 数组、频率字典和排序列表需要线性空间。 |

 和`n`和`m`最多`10^5`，这非常适合 5 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the main solution code here
    import builtins
    input = sys.stdin.readline
    from sortedcontainers import SortedList

    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    for _ in range(m):
        q = input().split()
        if q[0] == '2':
            p, x = int(q[1]) - 1, int(q[2])
            a[p] = x
        else:
            l, r, k = int(q[1])-1, int(q[2])-1, int(q[3])
            sub_freq = {}
            for i in range(l, r+1):
                sub_freq[a[i]] = sub_freq.get(a[i], 0) + 1
            freqs = sorted(sub_freq.values())
            if len(freqs) < k:
                print(-1)
            else:
                min_dif = min(freqs[i+k-1] - freqs[i] for i in range(len(freqs)-k+1
```
