---
title: "CF 160B - 倒霉票"
description: "我们得到一张由 2n 位数字组成的字符串表示的票据，其中 n 介于 1 到 100 之间。票据的前半部分包含前 n 位数字，后半部分包含其余 n 位数字。 我们被要求确定这张彩票是否“绝对不吉利”。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 160
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 111 (Div. 2)"
rating: 1100
weight: 160
solve_time_s: 89
verified: true
draft: false
---

[CF 160B - 倒霉票](https://codeforces.com/problemset/problem/160/B)

 **评分：** 1100
 **标签：** 贪心，排序
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一张由 2_n_ 个数字组成的字符串表示的票据，其中 _n_ 介于 1 到 100 之间。票据的前半部分包含前 _n_ 个数字，后半部分包含剩余的 _n_ 个数字。 我们被要求确定这张票是否“绝对不吉利”。 如果一张彩票可以将前半部分的每个数字与后半部分的数字配对，使得每个前半部分的数字都严格小于其配对的后半部分的数字，或者每个前半部分的数字严格大于其配对的后半部分的数字，那么这张彩票绝对不走运。 每个数字在配对中必须仅使用一次。 

输入保证票证的总长度最多为 200 位。 这个值很小，这意味着即使具有二次时间复杂度的方法在技术上也可以工作，但是使用排序的线性算术解决方案更加自然和高效。 

一个微妙的问题是票据可能有重复的数字。 例如，前半部分可以是`11`和下半场`22`。 在这里，仅比较总和或使用贪婪匹配而不进行排序的简单检查可能会失败。 另一种边缘情况是两半相同，例如`1234`拆分为`12`和`34`。 我们需要在排序后验证每个对应对的严格不等式，以避免错误的“是”答案。 

## 方法

 蛮力方法将尝试后半部分的所有可能排列，以找到满足两个严格不等式条件之一的双射。 对于 _n_ 到 100 的情况，排列的数量是 100！，这是一个天文数字，而且不可行。 蛮力在概念上是正确的，因为它会检查所有可能的配对，但由于组合爆炸而失败。 

关键的见解是数字的相对顺序比具体位置更重要。 如果我们按升序对两半进行排序，则可以两两比较数字：要么前半部分排序的数字都严格小于后半部分排序的数字，要么全部严格大于。 排序保证每个最小数字与另一半的最小数字相匹配，这是检查不幸标准的必要且充分的。 这将问题简化为排序后的简单线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * n) | O(n! * n) | O(n) | 太慢了 |
 | 排序 + 成对检查 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取整数_n_和长度为2_n_的票据字符串。 将绳子分成两半，`first_half`和`second_half`。 这种分离使我们能够独立地推理这两个群体。 
2. 将每一半转换为整数数字列表。 这使得比较变得简单并且避免处理字符串字符代码。 
3. 按升序对两半进行排序。 排序是核心步骤，它将问题从考虑所有排列简化为单个规范配对。 
4. 两两比较排序后的数字。 初始化两个标志：`all_first_less`和`all_first_greater`。 对于每个索引`i`从 0 到 n-1，如果数字来自`first_half`不小于对应的`second_half`数字、设定`all_first_less`为假。 类似地，如果数字来自`first_half`不大于对应的`second_half`数字、设定`all_first_greater`为假。 
5. 扫描后，如果`all_first_less`或者`all_first_greater`仍然正确，打印`YES`。 否则，打印`NO`。 

工作原理：排序可确保每个前半部分数字与剩余的最小后半部分数字配对。 如果排序后任何严格不等式失败，则没有其他排列可以满足该条件。 因此，排序比较是必要且充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
ticket = input().strip()

first_half = sorted(int(x) for x in ticket[:n])
second_half = sorted(int(x) for x in ticket[n:])

all_first_less = True
all_first_greater = True

for a, b in zip(first_half, second_half):
    if a >= b:
        all_first_less = False
    if a <= b:
        all_first_greater = False

print("YES" if all_first_less or all_first_greater else "NO")
```该解决方案首先读取输入并将票分成两半。 排序确保我们可以直接比较相应的数字。 该循环同时检查严格的不等式条件。 使用`zip`是一种清晰简洁的数字配对方式，可避免差一错误。 最终条件根据标志打印正确的结果。 

## 工作示例

 输入示例 1：```
2
2421
```| 上半场 | 下半场 | a >= b | a <= b | all_first_less | all_first_greater |
 | ---| ---| ---| ---| ---| ---|
 | 2 | 1 | 真实| 假 | 假 | 真实|
 | 4 | 2 | 真实| 假 | 假 | 真实|

 算法输出`YES`因为`all_first_greater`保持 True，确认该票符合不幸标准。 

输入示例 2：```
2
1234
```| 上半场 | 下半场 | a >= b | a <= b | all_first_less | all_first_greater |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 3 | 假 | 真实| 真实| 假 |
 | 2 | 4 | 假 | 真实| 真实| 假 |

 算法输出`YES`因为`all_first_less`仍然是 True。 排序可确保将每个最小的前半部分数字与最小的后半部分数字进行比较。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 对两半进行排序占主导地位； 比较扫描是线性的|
 | 空间| O(n) | 存储数字列表 |

 当 n 达到 100 时，排序和扫描在 2 秒内变得微不足道。 内存使用量也很少。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    ticket = input().strip()
    first_half = sorted(int(x) for x in ticket[:n])
    second_half = sorted(int(x) for x in ticket[n:])
    all_first_less = True
    all_first_greater = True
    for a, b in zip(first_half, second_half):
        if a >= b:
            all_first_less = False
        if a <= b:
            all_first_greater = False
    return "YES" if all_first_less or all_first_greater else "NO"

# Provided sample
assert run("2\n2421\n") == "YES", "sample 1"

# Custom cases
assert run("2\n1234\n") == "YES", "increasing halves"
assert run("2\n1221\n") == "NO", "mixed digits"
assert run("1\n12\n") == "YES", "minimum size, first less"
assert run("1\n21\n") == "YES", "minimum size, first greater"
assert run("3\n111222\n") == "YES", "all equal in halves, first less"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 2\n1234 | 是 | 排序后成对严格较少条件 |
 | 2\n1221 | 否 | 混合数字不能满足严格的不等式 |
 | 1\n12 | 1 是 | 最小n=1，先少|
 | 1\n21 | 1 是 | 最小n=1，先大|
 | 3\n111222 | 是 | 多个相等的数字，排序比较有效 |

 ## 边缘情况

 对于像这样的门票`1221`（上半场`12`, 下半场`21`），排序产生`12`和`12`。 成对比较时，第一个数字 1 vs 1 违反了小于和大于的严格不等式，因此两个标志都变为 false。 算法正确输出`NO`。 

对于最小尺寸的门票，例如`12`，比较是立即的：上半场 1 < 下半场 2，所以`all_first_less`仍然为真，屈服`YES`。 

对于半部有重复数字的门票，例如`111222`，排序可确保最小的数字配对。 上半场`111`, 下半场`222`，所有前半部分数字都严格小于，产生`YES`。 该算法正确处理重复项。
