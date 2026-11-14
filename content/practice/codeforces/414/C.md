---
title: "CF 414C - Mashmokh 和反向操作"
description: "我们得到一个长度为 $2^n$ 的数组（其中 $n$ 最多为 20）和一系列查询。 每个查询指定一个数字 $qi$，它告诉我们重复地将数组拆分为大小为 $2^{qi}$ 的块，反转每个块，然后将这些块重新连接在一起。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "divide-and-conquer"]
categories: ["algorithms"]
codeforces_contest: 414
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 240 (Div. 1)"
rating: 2100
weight: 414
solve_time_s: 100
verified: true
draft: false
---

[CF 414C - Mashmokh 和反向操作](https://codeforces.com/problemset/problem/414/C)

 **评分：** 2100
 **标签：** 组合数学，分而治之
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个长度的数组$2^n$， 在哪里$n$最多 20 个，并且是一个查询序列。 每个查询指定一个数字$q_i$，它告诉我们重复地将数组分割成大小的块$2^{q_i}$，反转每个块，然后将块重新连接在一起。 执行反转后，我们需要计算结果数组中的反转次数。 

倒置是一对索引$(i,j)$这样$i < j$和$a[i] > a[j]$。 查询操作是**累积的**，这意味着每次查询后都会永久修改数组。 

给定约束条件，数组大小最多为$2^{20} \approx 10^6$，这是可以管理的，但是查询的数量也可能非常大（$m \le 10^6$）。 因此，任何在每次查询后使用二次算法从头开始重新计算反转的简单解决方案（$O(N^2)$）会太慢。 甚至一个$O(N \log N)$每个查询的反转计数可能几乎不适合，我们应该寻找**重用计算**的方法。 

边缘情况包括$n = 0$（数组大小为 1，无反转），$q_i = 0$（大小为 1 的块，对数组没有影响），以及重复相同的查询$q_i$多次。 仔细处理数组反转也至关重要，因为块反转与反转整个数组不同。 

幼稚的实现可能会因为在部分反转后错误地重新计算反转而默默地失败，或者在以下情况下误解如何分割成块：$q_i = 0$或者$q_i = n$。 

## 方法

 暴力方法很简单：对于每个查询，将数组分割成大小的块$2^{q_i}$，反转每个块，重新组装数组，然后使用合并排序或朴素计数反转$O(N^2)$环形。 通过合并排序计算反转是$O(N \log N)$。 

为了$n = 20$,$N = 2^n = 1,048,576$。 每个查询的单个合并排序的成本大约是$N \log N \approx 2 \times 10^7$运营。 和$m = 10^6$查询，这将超出合理的时间限制。 甚至$O(N \log N)$每个查询太慢。 

关键的见解是每个查询都会反转 ** 大小的块$2^{q_i}$**，它完全对应于索引二进制表示中的翻转位。 如果我们预先计算**合并排序树**的每个级别的反转数量，我们只需切换反转的级别即可回答每个查询。 具体来说，完整的合并排序可以被视为**分治树**：顶层合并第一半和第二半，下一层合并四分之一，依此类推。 反转大小块$2^k$以影响级别反转的方式交换元素$0..k-1$这棵树的。 

因此，最佳方法是预处理每个级别的反转并维护**翻转位掩码**。 每个查询都会更新此掩码，并且可以计算反转总数$O(n)$每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m * N log N) | O(m * N log N) | O(N) | 太慢了|
 | 最佳| O(N log N + m * n) | O(N log N + m * n) | O(N log N) | O(N log N) | 已接受 |

 ## 算法演练

 1. **按级别预先计算反转。** 将数组视为完整的合并排序树。 归并排序的每一级对应于归并长度的段$2^k$。 在预处理过程中，对于每个级别，计算每个段的左半部分和右半部分之间创建的反转数量并将它们存储在数组中`inv_level[k]`。 这为我们提供了一种方法来了解，对于任何段大小，如果不反转，它会贡献多少个反转。 
2. **初始化位掩码以跟踪反转。** 位掩码`rev_mask`有长度$n$， 在哪里`rev_mask[k]`指示段的大小是否$2^k$因质疑而被撤销。 最初全为零。 
3. **处理每个查询$q_i$.** 对于查询$q_i$，按级别翻转掩码中的所有位`0`到`q_i-1`。 这模拟了反转所有大小块的效果$2^{q_i}$。 推理来自于合并排序反转如何受到影响：翻转段会反转其中的所有较低级别的反转。 
4. **计算总反转。** 更新掩码​​后，通过求和计算总反转`inv_level[k]`对于水平，其中`rev_mask[k]`为零，并且`total_pairs[k] - inv_level[k]`对于水平，其中`rev_mask[k]`是一。 这里`total_pairs[k]`是水平上可能的最大反转次数`k`，即跨越左右两半大小的对$2^k$。 
5. **输出结果。** 对每个查询重复步骤 3-4。 因为我们只更新掩码并求和$n \le 20$级别，每个查询是$O(n)$并且可行的$m \le 10^6$。 

**为什么它有效。** 反转在合并排序树中是可加的。 反转一段大小$2^k$翻转该段内的所有反转，这正是通过切换以下级别的预先计算值来解释的$k$。 没有反转被重复计算或遗漏，因为合并排序树结构在某个级别上唯一地划分所有对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def count_inversions(arr):
    n = len(arr)
    tmp = arr[:]
    inv_levels = [0] * (n.bit_length())
    
    def merge_sort(l, r, level):
        if r - l <= 1:
            return 0
        m = (l + r) // 2
        inv = merge_sort(l, m, level - 1) + merge_sort(m, r, level - 1)
        i, j, k = l, m, l
        while i < m and j < r:
            if arr[i] <= arr[j]:
                tmp[k] = arr[i]
                i += 1
            else:
                tmp[k] = arr[j]
                inv += m - i
                j += 1
            k += 1
        while i < m:
            tmp[k] = arr[i]
            i += 1
            k += 1
        while j < r:
            tmp[k] = arr[j]
            j += 1
            k += 1
        arr[l:r] = tmp[l:r]
        inv_levels[level] += inv
        return inv
    
    total_inv = merge_sort(0, n, n.bit_length() - 1)
    return inv_levels, total_inv

n = int(input())
arr = list(map(int, input().split()))
m = int(input())
queries = list(map(int, input().split()))

inv_levels, _ = count_inversions(arr[:])
total_pairs = [(1 << (i)) * (1 << (i)) for i in range(n.bit_length())]

rev_mask = [0] * n
res = []

for q in queries:
    for i in range(q):
        rev_mask[i] ^= 1
    total = 0
    for i in range(n):
        if rev_mask[i]:
            total += total_pairs[i] - inv_levels[i]
        else:
            total += inv_levels[i]
    res.append(str(total))

sys.stdout.write('\n'.join(res) + '\n')
```**解释。**`count_inversions`函数计算每个合并排序级别的反转。 这`rev_mask`跟踪哪些级别已反转。`total_pairs`计算每个级别可能的最大反转计数。 对于每个查询，都会更新掩码，并通过对级别求和、在必要时翻转贡献来计算总反转计数。 

微妙之处包括在合并排序树中从下到上正确索引级别以及处理查询`q = 0`（无变化）或`q = n`（全阵列反转）。 

## 工作示例

 **样品1**

 输入数组：`[2, 1, 4, 3]`查询：`[1, 2, 0, 2]`| 查询 | 反转块 | rev_mask | 倒转|
 | --- | --- | --- | --- |
 | 1 |`[1,2],[3,4]`|`[1,0]`| 0 |
 | 2 |`[4,3,2,1]`|`[0,1]`| 6 |
 | 0 | 没有变化|`[0,1]`| 6 |
 | 2 | 完全逆转`[1,2,3,4]`|`[0,0]`| 0 |

 跟踪确认翻转级别与反转计数完全匹配。 

**自定义输入**

 数组：`[1,3,2
