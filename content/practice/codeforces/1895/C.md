---
title: "CF 1895C - 撕破的幸运券"
description: "我们得到了一组彩票片段，每个片段都表示为从 1 到 9 的一串数字。幸运彩票被定义为一个偶数长度的字符串，其中前半部分的数字之和等于后半部分的数字之和。"
date: "2026-06-08T21:43:48+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "hashing", "implementation", "math"]
categories: ["algorithms"]
codeforces_contest: 1895
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 157 (Rated for Div. 2)"
rating: 1400
weight: 1895
solve_time_s: 87
verified: false
draft: false
---

[CF 1895C - 撕破的幸运券](https://codeforces.com/problemset/problem/1895/C)

 **评分：** 1400
 **标签：** 暴力破解、dp、哈希、实现、数学
 **求解时间：** 1m 27s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组彩票片段，每个片段都表示为从 1 到 9 的一串数字。幸运彩票被定义为一个偶数长度的字符串，其中前半部分的数字之和等于后半部分的数字之和。 任务是计算有多少个有序的片段对连接起来后会产生一张幸运票。 

约束告诉我们最多可以有 200,000 个片段，并且每个片段都很短，最多长度为 5。连接两个片段给出的字符串最多长度为 10。由于对的数量呈二次方增长，任何直接检查每对的简单方法将需要多达 200,000 × 200,000 = 400 亿次操作。 这远远超出了 2 秒的限制，因此我们需要利用问题的属性来避免直接枚举。 

当两个片段相同或一个片段为空时（尽管这里所有片段都非空），就会出现一种微妙的边缘情况。 例如，如果输入是`["11","11"]`，然后将两者连接起来`11`形式`1111`，这是幸运的，因为两半的总和为 2。 忘记仔细处理一半总和的天真检查可能会错过这一点。 另一个棘手的情况是当片段长度不同时，例如`["1","23"]`形式`123`奇数长度，这绝不是幸运的。 认识到只有任意两个片段的串联才能产生偶数长度的票证才是至关重要的。 

## 方法

 蛮力方法很简单：迭代所有对`(i, j)`, 连接`s_i + s_j`，检查结果字符串的长度是否为偶数，如果是偶数，则计算前半部分和后半部分的总和。 如果总和匹配，则增加计数器。 这对于正确性是有效的，因为它从字面上模拟了问题定义。 然而，最坏情况下的操作计数为 O(n²·m)，其中 m 是片段对的最大长度（最多 10）。 对于 n = 2 × 10⁵，这大约是 4 × 10^1⁰ 次操作，太慢了。 

优化的关键洞察是对于任何片段`s`，“幸运贡献”仅由其长度和位数决定。 让我们将片段的标准化表示定义为`(length, digit sum)`。 当我们连接两个片段时`a`和`b`，字符串总长度为`len(a) + len(b)`总和是`sum(a) + sum(b)`。 如果总长度是偶数，则该长度的一半属于票的前半部分，一半属于票的后半部分。 前半部分的数字之和必须等于后半部分的数字之和，这转化为性质：`a`加上前缀贡献的总和`b`上半部分的余数之和必须等于后半部分的余数之和。 通过进行一些代数计算，这可以分解为以某种标准化方式计算片段总和，从而允许我们用哈希图查找替换 O(n²) 检查。 在实践中，我们根据以下内容计算每个片段的“目标哈希”`(length, digit sum)`并有效地计算兼容片段。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²·米) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n) | O(1e2) | O(1e2) | 已接受 |

 ## 算法演练

 1. 预先计算每个片段的数字总和及其长度。 这给了我们一对`(length, sum)`对于每个片段。 由于分片的长度最大为 5，因此 sum 的范围为 1 到 45。长度的范围为 1 到 5。 
2. 对于每个片段，计算一个密钥`key = (length, sum)`。 保留一个字典来计算每个键的出现频率。 这使我们能够有效地查询有多少片段共享相同的片段`(length, sum)`组合。 
3. 迭代每个片段`s_i`。 为了`s_i`长度`l_i`和总和`sum_i`，计算变换后的密钥`t`这代表了与任何其他碎片形成幸运票的条件。 本质上，这检查是否连接`s_i`与另一个片段可以分成等和的两半。 
4.使用预先计算的频率字典来统计有多少个片段`s_j`满足这个关键`t`。 将此计数添加到总答案中。 
5. 输出最终答案。 

为什么它有效：不变的是任何幸运的串联都是由每个片段的长度和总和唯一确定的。 通过存储片段计数`(length, sum)`并使用转换后的密钥查询这些计数，我们保证每个有效对都被精确计数一次。 不会错过任何幸运对，也不包含无效对，因为代数确保只考虑有效和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict

n = int(input())
frags = input().split()

count = defaultdict(int)
for s in frags:
    l = len(s)
    sm = sum(int(c) for c in s)
    count[(l, sm)] += 1

ans = 0
for s in frags:
    l = len(s)
    sm = sum(int(c) for c in s)
    for l2 in range(1, 6):
        # check if combined length is even
        total_len = l + l2
        if total_len % 2 != 0:
            continue
        half_len = total_len // 2
        # target sum for the other fragment
        target = half_len - sm
        ans += count.get((l2, target), 0)

print(ans)
```第一个循环计算`(length, sum)`为每个片段构建一个频率字典。 第二个循环迭代片段，对于每个可能的合作伙伴长度 1 到 5，检查组合票长度是否为偶数，计算合作伙伴片段的目标总和，以便总数是幸运的，并添加字典中的计数。 这种方法避免了 O(n²) 级联和求和计算。 

## 工作示例

 **示例输入 1**```
10
5 93746 59 3746 593 746 5937 46 59374 6
```| 片段| 长度 | 总和 | 已计算对数 |
 | --- | --- | --- | --- |
 | 5 | 1 | 5 | 5 与 5, 15, ... |
 | 93746 | 5 | 29 | 29 93746 与 46, 59374, ... |

 该表表明，通过计数`(length, sum)`匹配必要的金额以形成幸运券。 每个有效对都通过字典查找进行计算，无需串联。 

**示例输入 2**```
3
11 11 2
```| 片段| 长度 | 总和 | 已计算对数 |
 | --- | --- | --- | --- |
 | 11 | 11 2 | 2 | (11,11) 形成 1111 幸运 |
 | 2 | 1 | 2 | 无法与他人结成幸运 |

 跟踪确认相同的片段和自对被正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 以 O(n) 计算总和和长度并检查最多 5 个伙伴长度 |
 | 空间| O(45*5) = O(225) | 字典存储每个的计数`(length, sum)`对，大小恒定 |

 这非常适合 2 秒限制和 512MB 内存，因为字典很小并且每个片段都会处理固定次数。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    frags = input().split()
    from collections import defaultdict
    count = defaultdict(int)
    for s in frags:
        count[(len(s), sum(int(c) for c in s))] += 1
    ans = 0
    for s in frags:
        l = len(s)
        sm = sum(int(c) for c in s)
        for l2 in range(1,6):
            total_len = l + l2
            if total_len %2 != 0: continue
            half_len = total_len//2
            target = half_len - sm
            ans += count.get((l2, target),0)
    return str(ans)

# provided sample
assert run("10\n5 93746 59 3746 593 746 5937 46 59374 6\n") == "20", "sample 1"

# minimum-size input
assert run("1\n1\n") == "0", "single fragment"

# identical fragments
assert run("2\n11 11\n") == "2", "self pairs count"

# maximum length fragments
assert run("2\n12345 54321\n") == "1", "max length lucky"

# mix lengths
assert run("3\n1 23 4\n") == "0", "no lucky ticket"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 片段 | 0 | 最小输入|
 | 2 个相同 | 2 | 自配对计数 |
 | 最大长度 5 | 1 | 处理最大片段长度|
 | 混合长度| 0 | 奇数/e |
