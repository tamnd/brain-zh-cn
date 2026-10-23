---
title: "CF 1215C - 交换字母"
description: "我们有两个长度相等的字符串 s 和 t，仅由字母“a”和“b”组成。 任务是使用一系列允许的交换操作使 s 和 t 相同。 每个操作都让我们从 s 中选择一个字符，从 t 中选择一个字符并交换它们。"
date: "2026-06-11T22:56:25+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1215
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 585 (Div. 2)"
rating: 1500
weight: 1215
solve_time_s: 102
verified: true
draft: false
---

[CF 1215C - 交换字母](https://codeforces.com/problemset/problem/1215/C)

 **评分：** 1500
 **标签：** 构造性算法，贪心
 **求解时间：** 1m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个字符串，`s`和`t`，长度相等，仅由字母“a”和“b”组成。 任务是使`s`和`t`使用允许的交换操作序列相同。 每个操作让我们从其中选择一个角色`s`和一个来自`t`并交换它们。 目标是用最少的交换次数实现平等，或者确定这是不可能的。 

关键的观察结果是，互换仅影响两个位置：其中之一是`s`和一在`t`。 If at a position the characters are already equal, we do not need to swap them. Therefore, we only need to consider positions where`s[i] != t[i]`。 This reduces the problem to a set of mismatched pairs. Each mismatch can be classified into one of two types:`s[i] = a, t[i] = b`（将此类型称为 AB 型）和`s[i] = b, t[i] = a`（BA 型）。 

鉴于`n`最多可以达到 200,000，而且我们有 2 秒的时间限制，单纯地检查所有可能的交换的解决方案会太慢。 尝试所有组合的暴力方法将是 O(n²)，这是不可接受的。 我们需要一个线性时间的解决方案。 边缘情况包括具有奇数个某种不匹配类型，这可能使问题无法解决。 例如，如果只有一个AB不匹配而没有BA不匹配，则任何交换都无法解决它，因此输出必须为-1。 

## 方法

 蛮力方法将迭代所有位置`s`和`t`每当出现不匹配时就交换，尝试所有可能的组合，直到`s`等于`t`。 这是正确的，因为最终，如果可能的话，所有不匹配都会得到解决。 然而，这种方法太慢，因为在最坏的情况下，考虑的操作数量可能接近 n2，这对于 n = 200,000 来说太多了。 

最佳方法基于这样的见解：我们可以将相同类型的不匹配配对以减少交换次数。 具体来说，两个 AB 不匹配可以通过交换一个字符来解决`s`在第一个不匹配中与第二个中的相同，这修复了两者。 同样，两个BA不匹配也可以用同样的方式解决。 如果有一个剩余的AB和一个剩余的BA不匹配，我们可以首先在字符串中执行“自交换”`s`将其转换为可解析的对，然后交换`s`和`t`。 这种方法确保我们最大限度地减少交换次数并在线性时间内运行，因为我们只迭代不匹配的位置并成对处理它们。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化两个列表，`ab`和`ba`，分别存储发生 AB 和 BA 类型不匹配的索引。 此步骤确保我们有效地对不匹配进行分类。 
2. 遍历字符串`s`和`t`并联。 每当`s[i] != t[i]`, 追加`i`到适当的列表（`ab`如果`s[i]='a'`和`t[i]='b'`,`ba`如果`s[i]='b'`和`t[i]='a'`）。 这将问题分成每个不匹配类型的独立子问题。 
3. 如果不匹配的总数是奇数，则不可能解决所有不匹配，因为每次交换解决两个不匹配。 在这种情况下返回-1。 具体来说，如果`(len(ab) + len(ba)) % 2 != 0`，我们输出-1。 
4. 配对索引`ab`按连续顺序列出。 每对`(i, j)`需要一次交换`s[i]`和`t[j]`。 重复相同的过程`ba`列表。 通过解决每个交换的两个不匹配问题，减少了操作数量。 
5. 如果两者都`ab`和`ba`具有奇数长度，每个中都会有一个剩余索引。 首先执行交换`s`在剩余的AB索引处和相同的索引处`t`将问题转化为一对 BA 不匹配问题。 然后在这些变换后的位置之间执行交换。 这正好需要两次额外的交换。 此技巧可确保通过最少的操作解决所有不匹配问题。 
6. 按顺序输出交换总数和交换操作列表。 每个操作都由索引表示`(pos_s, pos_t)`。 

为什么它有效：在每一步中，我们要么配对相同类型的不匹配，要么将不匹配的对转换为可解析的配置。 没有任何操作会引入新的不匹配。 不变的是，在处理完所有对之后，所有不匹配都被解决，并且字符串是相等的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
s = input().strip()
t = input().strip()

ab = []
ba = []

for i in range(n):
    if s[i] != t[i]:
        if s[i] == 'a' and t[i] == 'b':
            ab.append(i + 1)  # using 1-based indexing
        else:
            ba.append(i + 1)

if (len(ab) + len(ba)) % 2 != 0:
    print(-1)
else:
    ops = []

    for i in range(0, len(ab) - len(ab) % 2, 2):
        ops.append((ab[i], ab[i + 1]))
    for i in range(0, len(ba) - len(ba) % 2, 2):
        ops.append((ba[i], ba[i + 1]))

    if len(ab) % 2 == 1:
        last_ab = ab[-1]
        last_ba = ba[-1]
        ops.append((last_ab, last_ab))
        ops.append((last_ab, last_ba))

    print(len(ops))
    for x, y in ops:
        print(x, y)
```该解决方案首先识别不匹配，然后通过配对有效解决它们，最后通过两步交换处理任何剩余的奇数对。 微妙之处在于确保输出基于 1 的索引并正确处理单个剩余对。 

## 工作示例

 输入示例 1：```
4
abab
aabb
```| 我| s[i] | t[i] | t[i] | ab | 巴|
 | --- | --- | --- | --- | --- |
 | 1 | 一个 | 一个 | | |
 | 2 | 乙| 一个 | | 2 |
 | 3 | 一个 | 乙| 3 | |
 | 4 | 乙| 乙| | |

 加工：

 - 配对 ab 指数：[3]（奇数）
 - 对 ba 指数：[2]（奇数）
 - 在3处执行自交换，然后将3与2交换
 - 总行动：2

 输入示例 2：```
2
ab
bb
```| 我| s[i] | t[i] | t[i] | ab | 巴|
 | --- | --- | --- | --- | --- |
 | 1 | 一个 | 乙| 1 | |
 | 2 | 乙| 乙| | |

 总不匹配 = 1（奇数），不可能。 

该跟踪显示了算法如何检测不可能性并正确处理剩余的奇数不匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 单遍对不匹配和线性配对操作进行分类。 |
 | 空间| O(n) | AB 和 BA 索引列表的存储。 |

 该算法随字符串长度线性缩放，适用于 2 秒限制内高达 200,000 的 n。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call the solution code here
    n = int(input())
    s = input().strip()
    t = input().strip()

    ab = []
    ba = []

    for i in range(n):
        if s[i] != t[i]:
            if s[i] == 'a' and t[i] == 'b':
                ab.append(i + 1)
            else:
                ba.append(i + 1)

    if (len(ab) + len(ba)) % 2 != 0:
        print(-1)
    else:
        ops = []

        for i in range(0, len(ab) - len(ab) % 2, 2):
            ops.append((ab[i], ab[i + 1]))
        for i in range(0, len(ba) - len(ba) % 2, 2):
            ops.append((ba[i], ba[i + 1]))

        if len(ab) % 2 == 1:
            last_ab = ab[-1]
            last_ba = ba[-1]
            ops.append((last_ab, last_ab))
            ops.append((last_ab, last_ba))

        print(len(ops))
        for x, y in ops:
            print(x, y)
    return output.getvalue().strip()

# Provided samples
assert run("4\nabab\naabb\n") == "2\n3 3\n3 2", "sample 1"
assert run("2\nab\nbb\n") == "-1",
```
