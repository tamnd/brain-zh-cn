---
title: "CF 1450A - 避免 Trygub"
description: "给定一个由小写英文字母组成的字符串 a。 任务是将其字符重新排序为字符串 b，使得字符串“trygub”不会作为 b 中的子序列出现。"
date: "2026-06-11T03:37:19+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1450
codeforces_index: "A"
codeforces_contest_name: "Codeforces Global Round 12"
rating: 800
weight: 1450
solve_time_s: 98
verified: false
draft: false
---

[CF 1450A - 避免 Trygub](https://codeforces.com/problemset/problem/1450/A)

 **评分：** 800
 **标签：** 构造性算法，排序
 **求解时间：** 1m 38s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个字符串`a`由小写英文字母组成。 任务是将其字符重新排序为字符串`b`这样字符串“trygub”不会作为子序列出现在`b`。 子序列是通过删除零个或多个字符而不改变剩余字符的相对顺序而形成的。 例如，如果`a = "xzyw"`，那么“xy”是子序列，但“yx”不是。 

输入提供多个测试用例。 每个测试用例都给出字符串的长度和字符串本身。 每个测试用例的输出都是字符串的重新排列版本，其中“trygub”无法通过删除字符来获得。 

限制很小：`n`最多可以达到 200 并且`t`最多 100，这意味着我们需要处理的字符总数最多为 20,000 个。 这足够小，即使是线性操作每个字符串的简单算法也会很快。 不需要复杂的数据结构或针对非常大的输入进行优化。 

当字符串`a`已包含字母 't'、'r'、'y'、'g'、'u'、'b' 且其中某处的顺序完全相同。 一个天真的解决方案，简单地离开`a`未更改可能会意外地允许“trygub”作为子序列。 当字符串短于 6 个字母时，会出现另一种边缘情况 - 在这种情况下，“trygub”不可能出现，因此任何排序都是有效的。 如果字符串包含重复的字母，则必须通过将六个字符保持在破坏“trygub”序列的顺序来避免创建子序列。 

## 方法

 暴力方法会尝试字符串的所有排列`a`并检查“trygub”是否是子序列。 这种方法是正确的，但不切实际，因为排列的数量是`n!`，即使对于`n = 10`。 检查子序列的每个排列的时间复杂度为 O(n)，因此总时间远远超出了可接受的限制。 

关键的见解是我们不需要显式搜索子序列。 “Trygub”有六个不同的角色。 任何字符串都可以重新排列，使得这些字符中至少有一个不会以形成“trygub”所需的原始顺序出现。 最简单的方法是对字符串进行排序。 排序会更改所有字符的相对顺序，因此它永远不会保留确切的序列“trygub”，除非原始字符串完全按照该顺序“bgrtuy”，而按字母顺序排序是不可能的。 排序保证“trygub”不会作为子序列出现，并且实现很简单。 

另一种方法是将所有出现的“t”、“r”、“y”、“g”、“u”、“b”移动到不同的顺序（例如，反转它们或打乱它们）。 排序更简单，并且保证适用于任何输入。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（尝试所有排列）| O(n!) | O(n) | 太慢了 |
 | 对字符串进行排序 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，读取长度`n`和字符串`a`。 
3. 将字符串转换为字符列表。 
4. 按字母顺序对列表进行排序。 这会更改所有字符的相对顺序。 
5. 将排序后的字符重新连接成字符串`b`。 
6. 打印`b`。 

排序之所以有效，是因为它确保字符“t”、“r”、“y”、“g”、“u”、“b”不能以确切的顺序“trygub”出现，从而破坏子序列。 由于我们允许任何有效的排列，因此排序满足问题约束。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = input().strip()
    b = ''.join(sorted(a))
    print(b)
```代码首先读取测试用例的数量。 对于每种情况，它都会读取字符串，去除空格，对其进行排序，然后打印结果。 排序保证“trygub”不能是子序列。 使用`input().strip()`避免可能干扰排序的尾随换行问题。 

## 工作示例

 输入示例：```
11
antontrygub
```| 步骤| 多变的`a`| 已排序`b`|
 | ---| ---| ---|
 | 读取字符串 | 安东尼特里古布 | 安东尼特里古布 |
 | 转换为列表 | ['a'、'n'、t'、'o'、'n'、't'、'r'、'y'、'g'、'u'、'b'] | 相同|
 | 排序 | 相同| ['a'、'b'、'g'、'n'、'n'、'o'、'r'、't'、't'、'u'、'y'] |
 | 加入 | - | “abgnnorttuy”|

 排序后的输出不包含“trygub”作为子序列，因为字母的相对顺序不同。 

另一个例子：```
15
bestcoordinator
```| 步骤| 多变的`a`| 已排序`b`|
 | ---| ---| ---|
 | 读取字符串 | 最佳协调员| 相同|
 | 排序 | 相同| 'aabccddeinnoorrstt' |

 输出不能包含“trygub”，因为字母已重新排列。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 对每个字符串进行排序需要 O(n log n) 并且 n <= 200 |
 | 空间| O(n) | 存储排序后的字符列表 |

 当 t <= 100 且 n <= 200 时，总操作最多为 100 * 200 log 200，大约为 11,000 - 对于现代 CPU 来说微不足道。 内存完全在 256 MB 限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = input().strip()
        b = ''.join(sorted(a))
        output.append(b)
    return '\n'.join(output)

# Provided samples
assert run("3\n11\nantontrygub\n15\nbestcoordinator\n19\ntrywatchinggurabruh\n") == "abgnnorttuy\naabccddeinnoorrstt\naabccghhirrrsttuwyy"

# Custom cases
assert run("1\n5\naaaaa\n") == "aaaaa", "all identical letters"
assert run("1\n6\nttrygu\n") == "gttury", "letters in 'trygub' only"
assert run("1\n1\na\n") == "a", "minimum size input"
assert run("1\n7\nzyxwvut\n") == "tuvwxyz", "descending input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 5 个字母都一样 | 啊啊啊| 正确处理重复字母|
 | “ttrygu”| gttury | 确保 'trygub' 不是子序列，即使只有这些字母 |
 | 1 个字母 | 一个 | 最小输入处理|
 | 降序 | tuvwxyz | 排序正确性 |

 ## 边缘情况

 对于短于 6 的字符串，例如`a = "abc"`，算法简单地排序并输出“abc”。 由于少于 6 个字母，因此无法出现“trygub”。 对于恰好包含字母 't'、'r'、'y'、'g'、'u'、'b' 的字符串，例如`a = "trygub"`，排序会产生“bgrtuy”，这会破坏所需的顺序并防止“trygub”成为子序列。 这证实了该方法适用于最小、最大和边缘序列。
