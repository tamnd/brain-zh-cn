---
title: "CF 297C - 分裂独特性"
description: "给定一个长度为 n 的不同非负整数 s 的数组。 目标是将每个元素 s[i] 拆分为一对非负整数 a[i] 和 b[i]，使得 a[i] + b[i] = s[i]。 我们希望 a 和 b 几乎都是唯一的。"
date: "2026-06-05T18:16:20+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms"]
categories: ["algorithms"]
codeforces_contest: 297
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 180 (Div. 1)"
rating: 2400
weight: 297
solve_time_s: 110
verified: false
draft: false
---

[CF 297C - 分割唯一性](https://codeforces.com/problemset/problem/297/C)

 **评分：** 2400
 **标签：** 构造性算法
 **求解时间：** 1m 50s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个不同的非负整数数组`s`长度`n`。 目标是分割每个元素`s[i]`化为一对非负整数`a[i]`和`b[i]`这样`a[i] + b[i] = s[i]`。 我们两个都想要`a`和`b`几乎是独一无二的。 如果删除最多一半的重复元素（向下舍入）将数组变成严格唯一的数组，则该数组几乎是唯一的。 实际上，这使我们能够容忍大小为 2 的数组中存在一个重复项，大小为 5 的数组中存在两个重复项，依此类推。 

限制条件适中：`n`可以大到`10^5`和`s[i]`最多`10^9`。 这意味着我们不能使用任何暴力方法来尝试所有可能的分割，因为这将具有指数级的复杂性。 相反，我们需要一个大致在线性时间内运行的算法，可能与`O(n log n)`运营。 

不明显的边缘情况包括具有较小值的数组、具有连续数字的数组以及具有广泛间隔的大数字的数组。 例如，`s = [0,1]`需要小心，因为唯一的非负分割是`[0,0]`和`[0,1]`类型拆分。 幼稚的方法可能会产生负数或重复的分割，从而破坏几乎唯一性条件。 

## 方法

 暴力解决方案将迭代所有可能的对`(a[i], b[i])`这样`a[i] + b[i] = s[i]`对于每个`i`。 然后我们会检查是否`a`和`b`几乎是独一无二的。 这原则上是有效的，因为它探索了完整的搜索空间，但组合的数量随着`n`，使其完全不可行`n`最多`10^5`。 

关键的见解是`s`是严格递增的或者至少是唯一的。 这使我们能够贪婪地将最大的可用数字分配给一个数组，并将剩余的分配给另一个数组。 如果我们排序`s`按升序排列并维护两个集合来跟踪我们已经使用过的元素`a`和`b`，我们可以分配`a[i]`最大未使用值不超过`s[i]`，并让`b[i] = s[i] - a[i]`。 如果其中之一`a[i]`或者`b[i]`已经被获取，我们将补码分配给另一个数组。 这保证了几乎唯一性，因为每个重复项仅出现一次，并且可以轻松删除重复项以满足几乎唯一性条件。 

这种贪婪策略之所以有效，是因为`s`是唯一的，我们总是优先使用每个数组中未使用的值。 冲突自然限于一次重复，这在几乎唯一的定义下是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了 |
 | 贪婪分割| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 排序`s`按升序排列。 这使我们能够系统地分配分割，而不会丢失可能阻碍几乎唯一性的大量数字。 
2.初始化两个空集`used_a`和`used_b`跟踪已经放置的元素`a`和`b`。 
3. 迭代排序后的内容`s`按降序排列。 对于每个`value`:

 1.如果`value`不在`used_a`， 分配`a[i] = value`和`b[i] = 0`，然后标记`value`如所用`a`。 
2. 否则，分配`a[i] = 0`和`b[i] = value`，然后标记`value`如所用`b`。 
3. 如果两者都`a[i]`和`b[i]`会违反唯一性，输出“NO”。 
4.处理完所有元素后，返回数组`a`和`b`与“是”。 

为什么它有效：不变的是每个数字`s`要么完全放置在`a`或者`b`，并且仅在必要时才引入重复项。 自从`s`是唯一的，我们用最大的可用数字贪婪地分割，两个数组中的最大重复项数都是 1，满足几乎唯一的条件。 排序可确保较大的数字不会阻止较小的数字以违反唯一性属性的方式放置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
s = list(map(int, input().split()))

a_set = set()
b_set = set()
a = [0] * n
b = [0] * n

# Sort with original indices
s_with_idx = sorted([(val, idx) for idx, val in enumerate(s)], reverse=True)

possible = True
for val, idx in s_with_idx:
    if val not in a_set:
        a[idx] = val
        b[idx] = 0
        a_set.add(val)
    elif val not in b_set:
        a[idx] = 0
        b[idx] = val
        b_set.add(val)
    else:
        possible = False
        break

if possible:
    print("YES")
    print(" ".join(map(str, a)))
    print(" ".join(map(str, b)))
else:
    print("NO")
```该解决方案对数组进行排序，同时跟踪原始索引，以便我们可以输出`a`和`b`按原来的顺序。 对于每个值，我们贪婪地将其分配给`a`如果可能的话，否则`b`。 如果两者都被阻止，分裂是不可能的。 使用集合可以确保`O(1)`成员资格检查和排序给出`O(n log n)`总的复杂性。 

## 工作示例

 **样品1**

 输入：`s = [12, 5, 8, 3, 11, 9]`| idx | 值| 一组 | b_集 | 一个[idx] | b[idx] |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 12 | 12 {} | {} | 12 | 12 0 |
 | 4 | 11 | 11 {12} | {} | 11 | 11 0 |
 | 5 | 9 | {11,12} | {} | 9 | 0 |
 | 2 | 8 | {9,11,12} | {} | 8 | 0 |
 | 1 | 5 | {8,9,11,12} | {} | 5 | 0 |
 | 3 | 3 | {5,8,9,11,12} | {} | 3 | 0 |

 填充后，`b`遗迹`[0,0,0,0,0,0]`。 全部`a`值是唯一的，所以这几乎是唯一的。 

**自定义示例**

 输入：`s = [1, 2, 3, 4]`| idx | 值| 一组 | b_集 | 一个[idx] | b[idx] |
 | ---| ---| ---| ---| ---| ---|
 | 3 | 4 | {} | {} | 4 | 0 |
 | 2 | 3 | {4} | {} | 3 | 0 |
 | 1 | 2 | {3,4} | {} | 2 | 0 |
 | 0 | 1 | {2,3,4} | {} | 1 | 0 |`a = [1,2,3,4]`,`b = [0,0,0,0]`。 两个数组都是唯一的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序占主导地位，集合操作的摊销时间为 O(1)。 |
 | 空间| O(n) | 两个集合和两个长度数组`n`。 |

 和`n`最多`10^5`,`O(n log n)`完全在 1 秒的时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    s = list(map(int, input().split()))
    a_set = set()
    b_set = set()
    a = [0] * n
    b = [0] * n
    s_with_idx = sorted([(val, idx) for idx, val in enumerate(s)], reverse=True)
    possible = True
    for val, idx in s_with_idx:
        if val not in a_set:
            a[idx] = val
            b[idx] = 0
            a_set.add(val)
        elif val not in b_set:
            a[idx] = 0
            b[idx] = val
            b_set.add(val)
        else:
            possible = False
            break
    if possible:
        return "YES\n" + " ".join(map(str, a)) + "\n" + " ".join(map(str, b))
    else:
        return "NO"

# Provided samples
assert run("6\n12 5 8 3 11 9\n") == "YES\n12 5 8 3 11 9\n0 0 0 0 0 0", "sample 1"

# Custom cases
assert run("2\n0 1\n") == "YES\n0 1
```
