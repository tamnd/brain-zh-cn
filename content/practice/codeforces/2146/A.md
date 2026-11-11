---
title: "CF 2146A - 相同出现次数"
description: "给定一个非递减整数数组，我们想要找到一个其元素出现相同次数的子序列。 子序列可以跳过元素，但不能更改它们的顺序。"
date: "2026-06-08T01:25:39+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2146
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 1052 (Div. 2)"
rating: 800
weight: 2146
solve_time_s: 72
verified: true
draft: false
---

[CF 2146A - 相同出现次数](https://codeforces.com/problemset/problem/2146/A)

 **评分：** 800
 **标签：** 暴力、贪婪、实现
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 给定一个非递减整数数组，我们想要找到一个其元素出现相同次数的子序列。 子序列可以跳过元素，但不能更改它们的顺序。 例如，从`[1, 1, 4, 4, 4]`，子序列`[1, 1, 4, 4]`是平衡的，因为`1`和`4`每个恰好出现两次。 任务是确定最长的平衡子序列的长度。 

约束条件适中：每个数组最多有100个元素，最多有500个测试用例。 这表明每个测试用例大约具有 O(n²) 次操作的算法将在时间限制内顺利运行。 小尺寸还使我们能够考虑基于计数频率的解决方案，而不必担心高复杂性优化。 

当所有元素都相同时，就会出现微妙的边缘情况。 为了`[3, 3, 3, 3, 3]`，整个数组已经平衡了。 另一种情况是每个元素都是不同的，例如`[1, 2, 3]`; 这里的平衡子序列是任何单个元素或所有元素（如果每个元素都出现一次），这是有效的，因为每个元素恰好出现一次。 在这些情况下，尝试形成子序列而不查看频率的简单方法可能会产生不正确的结果。 

## 方法

 暴力法是生成所有子序列并检查它们是否平衡。 对于每个子序列，计算每个元素的出现次数并进行比较。 这是正确的，因为它详尽地考虑了每种可能性。 然而，子序列的数量呈指数增长 (2ⁿ)，使得这种方法即使对于 n=20 也不可行。 

更好的方法利用了元素已排序并使用频率计数的事实。 首先，计算每个不同数字出现的次数。 然后，通过选择所有元素可以支持的出现次数 k 来获得最长平衡子序列。 例如，如果频率是`[3, 5, 2]`，我们可以选择 k=2，因为所有数字至少出现两次，形成长度的子序列`2 * 3 = 6`。 迭代所有可能的 k，从 1 到任何元素的最大频率，使我们能够有效地找到最大的平衡子序列。 

关键的见解是平衡子序列的长度是所选出现次数乘以至少可以提供那么多出现次数的不同数字的数量。 对频率计数进行排序简化了查找最大长度的过程，因为我们只需要检查数组中存在的频率。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2ⁿ * n) | O(2ⁿ * n) | O(n) | 太慢了 |
 | 最佳 | O(n²) | O(n) | 已接受 |

 ## 算法演练

 1. 读取测试用例数t。 对于每个测试用例，读取 n 和数组 a。 
2. 计算每个不同数字的出现次数。 由于数组已排序，因此我们可以一次性完成此操作。 将计数存储在列表中`freq`。 
3. 初始化`max_len`为 0。这将保存最长平衡子序列的长度。 
4. 对于从 1 到最大频率的每个可能的计数 k：

 a. 计算里面有多少个元素`freq`大于或等于 k。 打电话给这个`num_elements`。 

b. 候选子序列长度为`k * num_elements`。 更新`max_len`如果这比当前的大`max_len`。 
5. 迭代完所有k后，输出`max_len`对于这个测试用例。 

不变的是，在每一步，我们只考虑至少一个元素可以提供的计数 k。 通过迭代所有可能的 k，我们确保不会错过最佳子序列长度。 因为我们计算`num_elements`对于每个 k，我们仅正确地考虑可以参与该大小的平衡子序列的元素。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    
    freq = []
    count = 1
    for i in range(1, n):
        if a[i] == a[i-1]:
            count += 1
        else:
            freq.append(count)
            count = 1
    freq.append(count)
    
    max_len = 0
    max_freq = max(freq)
    
    for k in range(1, max_freq + 1):
        num_elements = sum(1 for f in freq if f >= k)
        max_len = max(max_len, k * num_elements)
    
    print(max_len)
```第一部分有效地读取输入并使用简单的线性扫描来计算频率。 这`freq`列表包含每个唯一数字出现的次数。 对可能的 k 值进行迭代可确保我们考虑每个数字出现相同次数的所有子序列。 对至少出现 k 次的元素进行计数可确保子序列保持平衡。 

## 工作示例

 **样品1：**`[1, 1, 4, 4, 4]`| 步骤| 频率 | 最大频率| k | 元素数量 | 候选长度 | 最大长度 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 初始| [2,3]| 3 | 1 | 2 | 2 | 2 |
 | | | | 2 | 2 | 4 | 4 |
 | | | | 3 | 1 | 3 | 4 |

 该算法正确选择 k=2 和两个数字来形成长度为 4 的平衡子序列。 

**样本2：**`[1,2]`| 步骤| 频率 | 最大频率| k | 元素数量 | 候选长度 | 最大长度 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 初始| [1,1]| 1 | 1 | 2 | 2 | 2 |

 两个数字都出现一次，因此整个数组是平衡的，最大长度为 2。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n²) | 计数频率为 O(n)。 对于每个 k 直到最大频率 (≤ n)，我们扫描 freq (≤ n) 来计算 num_elements。 |
 | 空间| O(n) | 存储每个不同数字的频率。 |

 当 n ≤ 100 时，每个测试用例的 O(n²) 次操作大约为 10,000 次操作，完全在 1 秒的限制之内。 该解决方案仅使用线性阵列来存储频率。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        freq = []
        count = 1
        for i in range(1, n):
            if a[i] == a[i-1]:
                count += 1
            else:
                freq.append(count)
                count = 1
        freq.append(count)
        max_len = 0
        max_freq = max(freq)
        for k in range(1, max_freq + 1):
            num_elements = sum(1 for f in freq if f >= k)
            max_len = max(max_len, k * num_elements)
        print(max_len)
    return output.getvalue().strip()

# Provided samples
assert run("4\n5\n1 1 4 4 4\n2\n1 2\n15\n1 1 1 1 1 2 2 2 2 3 3 3 4 4 5\n5\n3 3 3 3 3") == "4\n2\n9\n5"

# Custom cases
assert run("2\n1\n1\n3\n2 2 2") == "1\n3"  # minimum-size, all equal
assert run("1\n5\n1 2 3 4 5") == "5"  # all distinct
assert run("1\n6\n1 1 2 2 3 3") == "6"  # perfect balance
assert run("1\n7\n1 1 1 2 2 3 3") == "6"  # uneven counts
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1`|`1`| 单元素数组 |
 |`2 2 2`|`3`| 全部相等的元素，全数组平衡 |
 |`1 2 3 4 5`|`5`| 全部不同，每个计数 1 |
 |`1 1 2 2 3 3`|`6`| 已经完美平衡|
 |`1 1 1 2 2 3 3`|`6`| 必须排除出现一次`1`平衡|

 ## 边缘情况

 对于具有所有不同元素的数组，例如`[1, 2, 3]`,`freq = [1,1,1]`。 迭代 k=1，num_elements=3，候选长度=3，与数组长度匹配。 算法正确返回 3。 

对于具有所有相同元素的数组`[5,5,5,5]`,`频率=[4
