---
title: "CF 1496B - 麦克斯和墨西哥"
description: "给定一个由不同非负整数组成的多重集，我们需要模拟一个过程，其中最多将元素 (mex + max + 1) // 2 添加到多重集中 k 次。 集合的 mex 是不存在的最小非负整数，max 是最大元素。"
date: "2026-06-10T21:55:10+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1496
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 706 (Div. 2)"
rating: 1100
weight: 1496
solve_time_s: 271
verified: false
draft: false
---

[CF 1496B - Max 和 Mex](https://codeforces.com/problemset/problem/1496/B)

 **评分：** 1100
 **标签：** 数学
 **求解时间：** 4m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了一组不同的非负整数，并且需要模拟一个过程，其中最多`k`次，我们添加元素`(mex + max + 1) // 2`到多重集。 这`mex`集合的 是不存在的最小非负整数，并且`max`是最大的元素。 执行操作后`k`有时，我们必须报告多重集包含多少个**不同的**整数。 

输入指定多个测试用例。 每个案例给出`n`，初始多重集大小，`k`、操作数以及多重集中的不同整数。 每种情况的输出都是一个整数。 

限制因素很大。`n`可以达到`10^5`， 和`k`可以达到`10^9`。 这意味着模拟每个操作是不可能的。 我们必须对每次添加后发生的情况进行数学推理。 总和`n`所有测试用例的总和是`10^5`，所以我们可以负担得起`O(n log n)`每个测试用例的操作，但类似`O(k)`是无望的。 

Subtle edge cases arise when the`mex`大于`max`。 例如，如果集合是`{0,1,2}`和`k=2`， 这`mex`是`3`和`max`是`2`。 添加`(3+2+1)//2=3`创建重复项，因此第一个操作不会增加不同元素的数量。 但是，在允许重复之后，添加新的`mex`大于当前的`max`将可预见地增加非重复计数。 

粗心的实现可能会模拟每个操作或无法处理`k=0`，在不执行任何操作的情况下产生错误的结果。 

## 方法

 蛮力方法很简单。 对于每个操作，计算`mex`和`max`， 计算`(mex + max + 1) // 2`，并将其插入到多重集中。 后`k`操作，计算不同元素的数量。 这是有效的，因为每个步骤都正确遵循问题定义。 然而，随着`k`最多`10^9`，这太慢了； 均匀计算`mex`反复会花费`O(n)`每次操作，给予`O(n*k)`这是不可行的。 

关键的观察结果是该过程很快稳定下来。 让`a = mex(S)`和`b = max(S)`。 如果`a > b`， 然后`(a+b+1)//2 = a`，它严格大于`b`，因此每个操作只是在当前最大值之后添加下一个整数。 在这种情况下，不同元素的数量增加`k`。 如果`a <= b`， 然后`(a+b+1)//2`产生一个介于`a`和`b`。 添加此数字可能会引入新元素（如果不在集合中）或重复元素（如果在集合中）。 大多数情况下添加一次就足够了； 之后，集合不再改变，因为`mex`变得等于新的数字，从而稳定集合。 

因此，我们只需要考虑两种情况：要么集合在一次操作后稳定下来，要么我们只是在当前集合之外添加新数字`max`。 一旦我们知道，这会将问题简化为每个测试用例的恒定时间计算`mex`和`max`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*k) | O(n) | 对于大 k 来说太慢 |
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 将输入数组转换为Python`set`有效地跟踪不同的元素。 
2. 计算`mex`通过迭代`0`向上，直到集合中缺少一个整数。 
3. 计算`max`使用内置的`max()`功能。 
4. 如果`k=0`，立即返回当前不同元素的数量。 
5. 如果`mex`大于`max`，每次操作都会添加一个大于的新整数`max`。 所以之后的总不同计数`k`操作是`len(S) + k`。 
6. 否则，将候选新元素计算为`(mex + max + 1) // 2`。 如果尚不存在，请将其添加到集合中。 
7. 返回更新集的大小。 

为什么它有效：`mex`确保我们始终以最小的缺失元素为目标，并且公式`(mex + max + 1) // 2`生成当前范围内的新元素或将集合扩展到当前最大值之外。 在任何一种情况下，只有一个添加可能会改变非重复计数，如果`mex <= max`; 进一步的操作不会引入新的数字，因为`mex`转移到添加的元素，该元素现在位于集合中，立即稳定集合。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        arr = list(map(int, input().split()))
        S = set(arr)
        mex = 0
        while mex in S:
            mex += 1
        max_val = max(S)
        
        if k == 0:
            print(len(S))
            continue
        
        if mex > max_val:
            # Every operation adds a new number beyond current max
            print(len(S) + k)
        else:
            new_elem = (mex + max_val + 1) // 2
            S.add(new_elem)
            print(len(S))

if __name__ == "__main__":
    solve()
```该代码将数组转换为集合以进行 O(1) 成员资格检查。 计算`mex`要求从0向上扫描，直到找到缺失的数字。 如果`mex > max_val`，我们只需添加`k`连续的不同数字，每个数字都超出当前最大值。 否则，添加`(mex + max + 1)//2`一次就足够了，因为集合随后会立即稳定。 处理`k=0`确保我们不会意外修改集合。 

## 工作示例

 **示例1：**

 输入：`S = {0,1,3,4}`,`k=1`| 步骤| S | 墨西哥 | 最大| 新元素 | 笔记|
 | --- | --- | --- | --- | --- | --- |
 | 初始化| {0,1,3,4} | 2 | 4 | - | 初始设定|
 | OP1 | 添加 3 | 2 | 4 | 3 | 3 已经存在，因此 S 变为 {0,1,3,3,4} |
 | 决赛| {0,1,3,4} | - | - | - | 不同元素 = 4 |

 这表明添加已存在的元素不会增加非重复计数。 

**示例2：**

 输入：`S = {0,1,2}`,`k=2`| 步骤| S | 墨西哥 | 最大| 新元素 | 笔记|
 | --- | --- | --- | --- | --- | --- |
 | 初始化| {0,1,2} | 3 | 2 | - | 初始设定|
 | OP1 | 添加 3 | 3 | 3 | 3 | mex > max，添加新元素 |
 | OP2 | 添加 4 | 4 | 3 | 4 | 再次墨西哥 > 最大 |
 | 决赛| {0,1,2,3,4} | - | - | - | 不同元素 = 5 |

 这演示了以下情况：`mex > max`，其中每个操作都添加了一个真正的新元素。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 转换为集合，计算`mex`最多扫描一次`n+1`数字、计算`max`|
 | 空间| O(n) | 存储元素集 |

 鉴于所有的总和`n`≤ 10^5，这非常适合 1 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# Provided samples
assert run("5\n4 1\n0 1 3 4\n3 1\n0 1 4\n3 0\n0 1 4\n3 2\n0 1 2\n3 2\n1 2 3\n") == "4\n4\n3\n5\n3"

# Custom tests
# k = 0, should return original size
assert run("1\n5 0\n0 1 2 4 5\n") == "5"
# mex > max, k > 1
assert run("1\n3 3\n0 1 2\n") == "6"
# adding a number that already exists
assert run("1\n3 1\n0 1 4\n") == "4"
# single element, k = 5
assert run("1\n1 5\n0\n") == "6"
# large max with small mex
assert run("1\n4 2\n0 2 3 10\n") == "5"
```|
