---
title: "CF 43C - 幸运券"
description: "我们得到了一系列门票。 每一块都是一个数字，代表一张原本能被三整除的票的碎片。 该问题要求我们从这些碎片中重建出最大数量的幸运彩票。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 43
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 42 (Div. 2)"
rating: 1300
weight: 43
solve_time_s: 72
verified: true
draft: false
---
[CF 43C - 幸运券](https://codeforces.com/problemset/problem/43/C)

 **评分：** 1300
 **标签：** 贪婪
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一系列门票。 每一块都是一个数字，代表一张原本能被三整除的票的碎片。 该问题要求我们从这些碎片中重建出最大数量的幸运彩票。 幸运彩票被定义为能被三整除的数字，每张重建的彩票必须恰好由两块粘在一起组成。 碎片可以按任何顺序粘合，所以如果我们有碎片`x`和`y`，我们可以形成`xy`或者`yx`。 

输入由件数组成`n`以及代表每个部分的整数列表。 输出是我们通过配对可以产生的最大幸运票数。 由于我们要处理多达 10,000 个片段，因此任何显式尝试所有可能对的算法都将涉及多达$\binom{10^4}{2} \approx 5 \times 10^7$操作，对于 2 秒的时间限制来说太慢了。 这表明我们需要一种线性或近线性的方法。 

当我们的棋子可以单独被三整除但不能与其他棋子配对以保持整除性时，就会出现一种微妙的边缘情况。 例如，如果所有片段都是`3`，我们可以将它们自由配对，但是如果我们有`3, 3, 1`， 这`1`除非与正确的余数匹配，否则不能配对形成可被三整除的票。 当棋子的余数为 1 和 2 模 3 时，会出现另一种棘手的情况：它们彼此互补，但天真的配对可能会留下未使用的剩余部分。 

## 方法

 强力解决方案将迭代所有对的片段，检查两个串联是否能被三整除，并计算有效票数。 这是可行的，因为检查能否被三整除很简单，但是对于$n = 10^4$，我们大约需要$n^2 = 10^8$在最坏的情况下进行检查。 考虑到时间限制，这太慢了。 

关键的见解是我们只关心被三整除。 在数字加法和连接数字的情况下，可被三整除`x`和`y`相当于评估`(x * 10^len(y) + y) % 3`。 根据模运算的性质，`10^k % 3 == 1`对于任何`k >= 1`。 这简化了我们的检查：`(x * 10^len(y) + y) % 3 == (x + y) % 3`。 因此，我们可以通过模 3 的余数对所有片段进行分类。让`count0`是能被 3 整除的件数，`count1`是余数 1，并且`count2`为余数2。 

通过这种分组，任何一对`(0,0)`,`(1,2)`， 或者`(0,0)`形成一张幸运票。 然后可以通过配对尽可能多的数量来计算幸运彩票的最大数量`1`与`2`s 尽可能并使用剩余的可被 3 整除的棋子。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了|
 | 最佳| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取棋子列表并以 3 为模计算每个棋子。此步骤将问题从处理大数简化为处理三个小数：余数 0、余数 1 和余数 2。 
2. 计算每个剩余类别的件数：`count0`,`count1`,`count2`。 
3. 根据余数 1 和 2 计算对。这是`pairs12 = min(count1, count2)`因为每一对都需要每个类别中的一件。 
4. 计算余数为 0 的对：`pairs0 = count0 // 2`因为两个余数为 0 的部分之和总是 3 的倍数。 
5. 将两种类型的对相加，得到幸运彩票的最大总数：`max_tickets = pairs12 + pairs0`。 

为什么有效：每件作品都属于一个剩余类别。 1 和 2 配对保证了整除性，0 和 0 配对保证了整除性，剩余的碎片在不违反两片约束的情况下不能形成任何新的可被三整除的票。 这确保我们最大限度地利用门票，而不会留下任何未使用的潜在配对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
pieces = list(map(int, input().split()))

count0 = count1 = count2 = 0

for num in pieces:
    r = num % 3
    if r == 0:
        count0 += 1
    elif r == 1:
        count1 += 1
    else:
        count2 += 1

pairs12 = min(count1, count2)
pairs0 = count0 // 2

print(pairs12 + pairs0)
```该代码首先根据模 3 余数对各个片段进行分类。 计数是微不足道的，但不能混淆类别。 配对互补余数很简单`min`，整数除法处理余数 0 对。 如果我们使用浮点除法或尝试将余数 0 的部分与余数 1/2 的部分配对，就会出现差一错误。 

## 工作示例

 **示例1：**

 输入：`3\n123 123 99\n`| 件 | 模组 3 |
 | --- | --- |
 | 123 | 123 0 |
 | 123 | 123 0 |
 | 99 | 99 0 |`count0 = 3`,`count1 = 0`,`count2 = 0`

`pairs0 = 3 // 2 = 1`

`pairs12 = min(0,0) = 0`

`max_tickets = 1 + 0 = 1`**示例2：**

 输入：`4\n1 2 1 2\n`| 件 | 模组 3 |
 | --- | --- |
 | 1 | 1 |
 | 2 | 2 |
 | 1 | 1 |
 | 2 | 2 |`count0 = 0`,`count1 = 2`,`count2 = 2`

`pairs12 = min(2,2) = 2`

`pairs0 = 0`

`max_tickets = 2 + 0 = 2`这证实了该算法正确地配对了互补余数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 单次计算模数和计数 |
 | 空间| O(1) | O(1) | 仅需要三个计数器，无需额外的阵列 |

 这完全符合以下限制：$n \le 10^4$2 秒最多允许大约 10^8 次操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    pieces = list(map(int, input().split()))
    count0 = count1 = count2 = 0
    for num in pieces:
        r = num % 3
        if r == 0:
            count0 += 1
        elif r == 1:
            count1 += 1
        else:
            count2 += 1
    return str(min(count1, count2) + count0 // 2)

# Provided sample
assert run("3\n123 123 99\n") == "1", "sample 1"

# Minimum input
assert run("1\n3\n") == "0", "single piece cannot form ticket"

# All equal remainder-0
assert run("4\n6 6 6 6\n") == "2", "two pairs of divisible by 3"

# All remainder 1 and 2
assert run("6\n1 2 1 2 1 2\n") == "3", "pair all 1s and 2s"

# Mixed with leftovers
assert run("5\n3 6 1 2 4\n") == "2", "one pair 0s, one pair 1+2"

# Maximum size, all divisible by 3
assert run("10000\n" + " ".join(["3"]*10000) + "\n") == "5000", "largest input all 0s"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n3`| 0 | 单件不能成票|
 |`4\n6 6 6 6`| 2 | 所有余数为 0 对 |
 |`6\n1 2 1 2 1 2`| 3 | 配对余数 1 和余数 2 |
 |`5\n3 6 1 2 4`| 2 | 剩菜混合类型|
 |`10000\n3 3 ...`| 5000 | 大输入压力测试|

 ## 边缘情况

 如果我们有单张，则不能形成票：输入`1\n3`输出`0`。 该算法正确地使其不配对。 

如果我们有奇数个余数为 0 的块，例如，`3 6 9`,`count0 // 2`确保只形成一张票并且一张保持未使用。 

如果剩余 1 和剩余 2 件不平衡，例如，`1 1 2`, `对12
