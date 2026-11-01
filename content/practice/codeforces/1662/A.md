---
title: "CF 1662A - 组织 SWERC"
description: "Gianni 需要从评委提交的一系列问题中为 SWERC 整理出一个问题集。 每个问题都有一个美丽分数和从 1 到 10 的难度等级。"
date: "2026-06-10T02:39:06+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1662
codeforces_index: "A"
codeforces_contest_name: "SWERC 2021-2022 - Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 0
weight: 1662
solve_time_s: 88
verified: true
draft: false
---

[CF 1662A - 组织 SWERC](https://codeforces.com/problemset/problem/1662/A)

 **评级：** -
 **标签：** 暴力破解、实施
 **求解时间：** 1m 28s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Gianni 需要从评委提交的一系列问题中为 SWERC 整理出一个问题集。 每个问题都有一个美观度分数和一个从 1 到 10 的难度等级。Gianni 希望最终的问题集恰好有一个从 1 到 10 的难度的问题，并且对于每个难度，他都会选择具有最高美观度的问题。 如果池中缺少任何一个难度，贾尼就无法组成全套。 

输入提供多个测试用例。 每个测试用例指定问题的数量，然后列出每个问题的美观性和难度。 输出必须是所选问题集的整体美感或字符串`MOREPROBLEMS`如果无法制作全套。 

约束很小：每个测试用例最多有 100 个问题，并且最多有 100 个测试用例。 由于只有 10 个困难，因此单独处理每个困难的解决方案是可行的。 输入大小足够小，嵌套循环超过 10 个困难和问题是可以接受的。 

边缘情况包括完全缺失某个难度，或者多个问题具有相同的难度但具有不同的美观分数。 例如，如果输入是：```
1
3
5 1
4 1
7 2
```预期输出是`MOREPROBLEMS`因为困难 3 到 10 被遗漏了，尽管我们对于困难 1 和 2 有多个问题。一个粗心的解决方案可能会在没有检查遗漏困难的情况下对所有的美丽进行求和，产生错误的总计 16，而不是报告不可能性。 

## 方法

 最简单的方法是迭代每个测试用例的所有 10 个困难，并且对于每个困难，扫描整个问题列表以找到该困难的最大美感。 如果缺少困难，我们会返回`MOREPROBLEMS`。 这是有效的，因为困难和问题的数量都很少。 最坏情况下的操作次数是`t * 10 * n`在哪里`t`是测试用例的数量，`n`问题的数量。 和`t ≤ 100`和`n ≤ 100`，这最多给出 100,000 次操作，这对于 2 秒的时间限制来说是可以接受的。 

最佳方法利用了一小部分固定的困难。 我们可以使用大小为 11 的数组（索引 1 到 10）来跟踪每个难度的最大美感。 我们迭代问题列表一次，更新问题难度的最大美感。 处理完所有问题后，我们检查是否有任何困难没有问题（美丽保持初始值）。 如果是，则输出`MOREPROBLEMS`。 否则，将存储的最大美丽值求和。 这种方法减少了重复扫描，干净、直接。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(t * n * 10) | O(1) | O(1) | 已接受 |
 | 最佳 | O(t * n) | O(10) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 对于每个测试用例：
 2. Read the number of problems`n`。 
3.初始化一个数组`max_beauty`大小为 11，所有条目设置为 -1。 指数`i`会存储困难问题的最大美感`i`。 
4. 对于每个问题，解读它的美妙之处`b`和难度`d`。 更新`max_beauty[d]`是其当前值的最大值并且`b`。 这确保了在阅读完所有问题后，`max_beauty[d]`存储最美的难题`d`。 
5. 检查从 1 到 10 的所有困难。如果有的话`max_beauty[d]`仍然是-1，打印`MOREPROBLEMS`对于这个测试用例。 
6. 否则，将以下值相加`max_beauty[1..10]`并打印结果。 

为什么它有效：不变的是在处理完所有问题之后，`max_beauty[d]`包含任何困难问题的最大美感`d`，如果不存在此类问题，则为 -1。 检查 -1 可确保我们不会错过任何困难。 将这些最大值相加就可以得出问题集的整体美感，因为詹尼总是根据难度选择最美丽的问题。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    max_beauty = [-1] * 11  # indices 1..10
    for _ in range(n):
        b, d = map(int, input().split())
        if b > max_beauty[d]:
            max_beauty[d] = b
    if -1 in max_beauty[1:]:
        print("MOREPROBLEMS")
    else:
        print(sum(max_beauty[1:]))
```代码初始化`max_beauty`with -1 to clearly detect missing difficulties. 每个问题都会因其难度而更新最大的美感。 支票为`-1`确保我们仅在涵盖所有困难的情况下计算总和。 使用索引 1 到 10 来匹配问题的难度编号并避免相差一的错误。 快速输入通过`sys.stdin.readline`用于有效地处理多个测试用例。 

## 工作示例

 ### 示例 1

 输入：```
3
8 4
9 3
6 7
```| 步骤| 问题 | 更新后 max_beauty[1..10] |
 | ---| ---| ---|
 | 1 | 8 4 | [-1、-1、-1、8、-1、-1、-1、-1、-1、-1、-1] |
 | 2 | 9 3 | [-1、-1、9、8、-1、-1、-1、-1、-1、-1、-1] |
 | 3 | 6 7 | [-1、-1、9、8、-1、-1、6、-1、-1、-1、-1] |

 查看`max_beauty[1..10]`：索引 1,2,5,6,8,9,10 处缺少条目 → 输出`MOREPROBLEMS`。 

### 示例 2

 输入：```
12
3 10
10 1
10 2
10 3
10 4
3 10
10 5
10 6
10 7
10 8
10 9
1 10
```| 步骤| 问题 | 更新后 max_beauty[1..10] |
 | ---| ---| ---|
 | 1 | 3 10 | [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, 3] |
 | 2 | 10 1 | 10 [-1, 10, -1, -1, -1, -1, -1, -1, -1, -1, 3] |
 | ... | ... | ... |
 | 12 | 12 1 10 | 1 最后一个问题的美感为 1 → max_beauty[10] 仍为 3 |

 和`max_beauty[1..10] = 10 + 10 + 10 + 10 + 10 + 10 + 10 + 10 + 10 + 3 = 93`。 

该跟踪确认算法正确更新了每个难度的最大美度，并在处理每个难度的多个问题时计算总美度。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(t * n) | 每个问题处理一次，更新大小为 10 的数组。检查每个测试用例是否存在缺失的困难需要 O(10)。 |
 | 空间| O(10) |`max_beauty`每个测试用例数组存储 10 个值。 |

 当 t ≤ 100 且 n ≤ 100 时，该解决方案最多执行 10,000 次操作，完全在 2 秒的限制之内。 内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        t = int(input())
        for _ in range(t):
            n = int(input())
            max_beauty = [-1] * 11
            for _ in range(n):
                b, d = map(int, input().split())
                max_beauty[d] = max(max_beauty[d], b)
            if -1 in max_beauty[1:]:
                print("MOREPROBLEMS")
            else:
                print(sum(max_beauty[1:]))
    return out.getvalue().strip()

# Provided samples
assert run("2\n3\n8 4\n9 3\n6 7\n12\n3 10\n10 1\n10 2\n10 3\n10 4\n3 10\n10 5\n10 6\n10 7\n10 8\n10 9\n1 10") == "MOREPROBLEMS\n93"

# Minimum-size input
assert run("1\n1\n1 1") == "MOREPROBLEMS", "only one problem, missing difficulties 2..10"

# Maximum-size input with all difficulties
input_data = "1\n100\n" + "\n".join(f"{i%10+1} {i%10+1}" for i in range(100))
expected_sum =
```
