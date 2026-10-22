---
title: "CF 1177B - 数字序列（硬版）"
description: "我们被要求考虑连续写入所有不带任何分隔符的正整数形成的无限字符串：“1234567891011121314…”。 给定位置 $k$，我们必须确定哪个数字占据该位置。"
date: "2026-06-12T01:43:28+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "divide-and-conquer", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1177
codeforces_index: "B"
codeforces_contest_name: "Testing Round 15 (Unrated)"
rating: 1800
weight: 1177
solve_time_s: 92
verified: true
draft: false
---

[CF 1177B - 数字序列（硬版）](https://codeforces.com/problemset/problem/1177/B)

 **评分：** 1800
 **标签：** 二分查找、分而治之、实现
 **求解时间：** 1m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求考虑通过连续写入所有不带任何分隔符的正整数而形成的无限字符串：“1234567891011121314…”。 给定一个位置$k$，我们必须确定哪个数字占据该位置。 输入是单个整数$k$最多$10^{12}$，输出为对应的数字。 

第一个观察结果是序列是由数字的长度隐式构造的。 单位数占据位置 1 到 9。两位数占据位置 10 到 189，三位数占据位置 190 到 2889，依此类推。 这种按数字长度分层对于效率至关重要。 一种简单的方法，将字符串构造为$k$需要存储最多$10^{12}$数字，这在内存中是不可行的，并且在合理的时间内生成速度太慢。 

一个重要的边缘情况发生在数字长度之间的边界附近。 例如，如果$k = 10$，该数字属于“10”，即前两位数。 在不考虑长度组的情况下计算数字的简单实现可能会计算错误并选择错误的数字。 

另一种微妙的情况发生在$k$例如，正好落在长度组的最后一位数字上$k = 9$或者$k = 189$。 这些位置对应于 1 位或 2 位数字的最后一位数字。 仔细处理边界可以防止差一错误。 

## 方法

 蛮力方法很简单：从 1 开始，将每个数字作为字符串附加，直到总长度达到$k$。 然后返回$k$第 - 个字符。 这是正确的，因为我们确实模拟了该序列。 问题出现在性能上。 为了$k$靠近$10^{12}$，一位一位生成数字至少需要$10^{12}$操作，远远超出了 1 秒时间限制的实际限制。 

最佳解决方案的关键在于序列由数字长度相等的数字块构成。 数字与$d$数字占据一个连续的长度块$d \times 9 \times 10^{d-1}$。 通过累加计算这些块的长度，我们可以确定哪个块包含$k$-th 位而不生成整个序列。 一旦识别出该块，整数除法和模算术就会找到该数字中的确切数字和数字。 这减少了线性问题$k$数字长度的对数，这是可以接受的$k$最多$10^{12}$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(k) | O(k) | 太慢了 |
 | 最佳 | O(log k) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化数字长度计数器`d = 1`以及该长度的起始编号`start = 1`。 初始化累积长度计数器`count = 0`跟踪迄今为止处理的总数字。 
2. 计算当前块的长度`d`- 数字为`block_len = 9 * 10^(d-1) * d`。 如果添加`block_len`到`count`保持`count < k`, 增量`d`并更新`count += block_len`。 重复直到块包含`k`被发现。 
3. 一旦正确的数字长度`d`找到，计算偏移量`k`块内：`offset = k - count - 1`。 这`-1`将位置转换为块内从零开始的索引。 
4. 使用整数除法确定块中的哪个数字包含所需的数字：`number_index = offset // d`。 实际数量是`number = 10^(d-1) + number_index`。 
5. 使用模数确定该数字中的哪一位是目标：`digit_index = offset % d`。 通过将数字转换为字符串并索引来提取数字：`str(number)[digit_index]`。 
6. 输出数字作为答案。 

为什么它有效：在每一步中，我们都保持不变式`count`跟踪所有较小块所覆盖的数字总数。 通过识别块长度`d`其中包含`k`，并使用整数除法和取模，我们精确地映射了全局位置`k`到一个数字和该数字内的数字。 没有歧义，因为每个块中的数字都是连续的且大小统一。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

k = int(input())

d = 1
count = 0

while True:
    block_len = 9 * (10 ** (d - 1)) * d
    if count + block_len >= k:
        break
    count += block_len
    d += 1

offset = k - count - 1
number_index = offset // d
digit_index = offset % d
number = 10 ** (d - 1) + number_index
print(str(number)[digit_index])
```代码完全遵循算法。 这`while`循环通过累加来搜索正确的数字长度块`count`。 从零开始的索引`offset = k - count - 1`确保整数除法和模数正确定位数字和数字。 转换为字符串是安全的，因为数字最多有 12 位数字（因为`k ≤ 10^12`) 并且很适合 Python 整数。 

## 工作示例

 样本1：`k = 7`| 变量| 价值|
 | --- | --- |
 | d | 1 |
 | 计数| 0 |
 | 块长度 | 9 |
 | 偏移| 6 |
 | 编号索引 | 6 |
 | 数量 | 7 |
 | 数字索引 | 0 |
 | 输出| 7 |

 跟踪证实`k=7`属于 1 位数字，精确映射到数字 7，数字 0。 

样本2：`k = 12`| 变量| 价值|
 | --- | --- |
 | d | 2 |
 | 计数| 9 |
 | 块长度 | 180 | 180
 | 偏移| 2 |
 | 编号索引 | 1 |
 | 数量 | 10 + 1 = 11 |
 | 数字索引 | 0 |
 | 输出| 1 |

 此跟踪演示了如何正确处理从 1 位数到 2 位数的转换。 偏移计算将全局位置映射到正确的数字和数字。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(log k) | 每次迭代都会将起始数字乘以 10，因此考虑的数字长度最多为 12`k ≤ 10^12`。 所有后续计算都是恒定时间。 |
 | 空间| O(1) | O(1) | 仅存储整数变量，不存储大数组或字符串。 |

 考虑到这些限制，这完全符合 1 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    k = int(input())
    d = 1
    count = 0
    while True:
        block_len = 9 * (10 ** (d - 1)) * d
        if count + block_len >= k:
            break
        count += block_len
        d += 1
    offset = k - count - 1
    number_index = offset // d
    digit_index = offset % d
    number = 10 ** (d - 1) + number_index
    return str(number)[digit_index]

# provided samples
assert run("7") == "7", "sample 1"

# custom cases
assert run("1") == "1", "first digit"
assert run("10") == "1", "transition from 1-digit to 2-digit"
assert run("190") == "1", "
```
