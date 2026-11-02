---
title: "CF 1696A - NIT orz！"
description: "我们得到一个整数数组和一个数字 $z$。 我们可以重复选择任何元素$ai$并执行两个按位运算：将$ai$更新为$aioperatorname{or}z$并同时将$z$更新为$aioperatorname{and}z$。"
date: "2026-06-09T22:33:06+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1696
codeforces_index: "A"
codeforces_contest_name: "Codeforces Global Round 21"
rating: 800
weight: 1696
solve_time_s: 123
verified: true
draft: false
---

[CF 1696A - NIT orz！](https://codeforces.com/problemset/problem/1696/A)

 **评分：** 800
 **标签：** 位掩码，贪婪
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一个数字$z$。 我们可以重复选择任何元素$a_i$并执行两个按位操作：更新$a_i$到$a_i \operatorname{or} z$并同时更新$z$到$a_i \operatorname{and} z$。 目标是确定在应用这些操作任意次后数组中的任何元素可以达到的最大值。 

该数组代表我们可以操作的初始值，并且$z$是一个值，通过 OR 运算有选择地将其位传播到数组元素中，同时通过 AND 运算丢失位。 问题本质上是关于理解比特如何从$z$数组元素以及哪些操作会产生最大的数字。 

约束条件适中：每个数组最多有2000个元素，并且$n$所有测试用例最多$10^4$。 这意味着每个测试用例使用二次算法是可行的，但模拟无限数量操作的算法是有风险的。 边缘情况包括大小为 1 的数组，其中$z$为零，并且所有元素都等于的数组$z$。 盲目应用操作直到收敛的幼稚实现可能会陷入困境或执行不必要的操作。 例如，如果$a = [7]$和$z = 3$，重复应用该操作不会将最大值增加到超过 7，并且粗心的循环可能会使计算过于复杂。 

## 方法

 暴力方法会尝试对每个元素重复应用该操作，直到没有发生任何变化。 这是正确的，因为每个应用程序要么增加$a_i$或减少$z$，所以最终稳定下来。 然而，在最坏的情况下，$z$最多可以有 30 位，对于每个元素，我们可以尝试所有位传输的组合。 和$n = 2000$，这可能会导致数百万次操作，从而使暴力破解速度变慢。 

关键的见解是，如果我们的目标只是最大元素，那么操作顺序并不重要。 每一次操作$a_i = a_i \operatorname{or} z$只能增加$a_i$， 和$z = a_i \operatorname{and} z$只能减少$z$。 因此，任何元素所能达到的最大值都是通过选择最大化的元素来实现的$a_i \operatorname{or} z$只需一步。 对不同元素应用多个运算无法产生比最佳单个 OR 运算更高的最大元素值。 

这将问题简化为计算$\max(a_i \operatorname{or} z)$全面的$i$，它与数组的大小呈线性关系。 这种方法非常有效并且能够很好地满足约束条件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * 2^30) | O(n) | 太慢了|
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 每个测试用例都是独立的，因此我们按顺序处理它们。 
2. 对于每个测试用例，请阅读$n$和$z$，后跟数组$a$长度$n$。 这些值定义了问题实例。 
3. 初始化变量`max_val`为零。 这将跟踪所有数组元素的最大可实现值。 
4. 迭代每个元素$a_i$在数组中。 
5. 计算`candidate = a_i | z`。 这代表了价值$a_i$如果我们用当前的操作应用一次，就会实现$z$。 考虑这个单一操作就足够了，因为多个操作的组合不会产生比最大 OR 结果更高的最大值。 
6. 更新`max_val`是其当前值的最大值并且`candidate`。 
7.处理完所有元素后，打印`max_val`作为测试用例的结果。 

为什么有效：OR 运算对于每个元素都是单调的，而 AND 运算对于每个元素都是单调的$z$仅在后续操作中减少位。 因此，单个步骤中可实现的最高值代表任何操作序列中的最大可能值。 多个操作的序列不能超过这个最大值，因为`a_i | z`已经设置了可以传输的所有位$z$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n, z = map(int, input().split())
    a = list(map(int, input().split()))
    max_val = 0
    for x in a:
        max_val = max(max_val, x | z)
    print(max_val)
```代码严格遵循算法。 读取输入`sys.stdin.readline`确保大型数组的快速输入。 OR 运算是针对每个元素独立计算的，并且`max_val`跟踪全局最大值。 这样可以避免不必要的操作`z`因为它的递减值永远不会产生更高的最大值。 由于数组内部是零索引的，所以可以避免偏一错误，即使问题使用一索引。 

## 工作示例

 对于输入：```
2 3
3 4
```| a_i | a_i | z | a_i | 候选人 = a_i | z | 最大值 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 3 | 3 | 3 | 3 | 3 | 3 | 3 |
 | 4 | 4 | 3 | 4 | 7 | 3 | 7 |

 最大值为 7。 

对于输入：```
5 5
0 2 4 6 8
```| a_i | a_i | z | a_i | 候选人 = a_i | z | 最大值 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 5 | 0 | 5 | 5 | 5 |
 | 2 | 2 | 5 | 2 | 7 | 5 | 7 |
 | 4 | 4 | 5 | 4 | 5 | 5 | 7 |
 | 6 | 6 | 5 | 6 | 7 | 5 | 7 |
 | 8 | 8 | 5 | 8 | 13 | 5 | 13 |

 最大值为 13，确认算法正确选择最佳 OR。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个元素都通过单个 OR 运算处理一次。 |
 | 空间| O(n) | 我们存储数组`a`对于每个测试用例。 |

 鉴于总和$n$所有测试用例不超过$10^4$，解决方案在时间和内存限制内高效运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        n, z = map(int, input().split())
        a = list(map(int, input().split()))
        max_val = 0
        for x in a:
            max_val = max(max_val, x | z)
        print(max_val)
    return output.getvalue().strip()

# provided samples
assert run("5\n2 3\n3 4\n5 5\n0 2 4 6 8\n1 9\n10\n5 7\n7 15 30 29 27\n3 39548743\n10293834 10284344 13635445") == "7\n13\n11\n31\n48234367", "sample 1"

# custom cases
assert run("1\n1 0\n0") == "0", "single element zero"
assert run("1\n3 0\n1 2 4") == "4", "z zero, pick max element"
assert run("1\n4 15\n0 0 0 0") == "15", "all zeros, z non-zero"
assert run("1\n5 31\n1 2 4 8 16") == "31", "z maximum, spreads to any element"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 0\n0 | 0 0 | 单元素数组，z=0 |
 | 3 0\n1 2 4 | 3 0\n1 4 | z=0 不增加任何元素，选择 max a_i |
 | 4 15\n0 0 0 0 | 15\n0 0 0 0 15 | 15 z 将所有位传输到任何元素 |
 | 5 31\n1 2 4 8 16 | 5 31\n1 2 4 8 16 31 | 最大 z 与任何 a_i 组合以获得最大值 |

 ## 边缘情况

 当`z`为零，OR 运算不会更改任何元素，因此答案只是原始数组的最大值。 例如，如果`a = [1, 2, 4]`和`z = 0`， 每个`a_i | z`等于`a_i`，给出最大值 4。当所有元素均为零且`z`不为零，最大值恰好变为`z`因为任何元素 OR z 都等于 z。 如果`z`已经大于所有数组元素，应用它
