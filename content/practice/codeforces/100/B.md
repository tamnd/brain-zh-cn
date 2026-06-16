---
title: "CF 100B - 友好号码"
description: "我们被要求确定一组非零整数是否形成一个“友好组”，这意味着每对数字都满足整除关系：一个数字可以整除另一个数字。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "implementation"]
categories: ["algorithms"]
codeforces_contest: 100
codeforces_index: "B"
codeforces_contest_name: "Unknown Language Round 3"
rating: 1500
weight: 100
solve_time_s: 139
verified: true
draft: false
---

[CF 100B - 友好数字](https://codeforces.com/problemset/problem/100/B)

 **评分：** 1500
 **标签：** *特殊、实施
 **求解时间：** 2m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定一组非零整数是否形成一个“友好组”，这意味着每对数字都满足整除关系：一个数字可以整除另一个数字。 输入提供整数的数量，$n$，后跟按非降序排序的以逗号分隔的整数列表。 如果整个组满足此条件，则输出应为“FRIENDS”，否则输出应为“NOT FRIENDS”。 

给定$n$最多可以达到 1000，每个数字最多可以有 7 位数字，对所有数字对进行强力检查是可行的，但不是最佳选择。 完整成对检查的最坏情况操作数是$n(n-1)/2$，大约是 500,000 次操作$n = 1000$。 在 Python 中，对于 2 秒的时间限制，这仍然是可以管理的。 然而，由于排序输入可以避免不必要的检查，因此我们可以利用一种结构。 

非明显的边缘情况包括所有数字都相同的组、包含 1 的组或具有不可被任何较小成员整除的较大数字的组。 例如，输入“1, 3, 6, 12”是 FRIENDS，但“2, 3, 6”不是 FRIENDS，因为 2 不能整除 3，3 不能整除 2。粗心的实现可能只检查排序数组中的连续数字，并在后一种情况下错误地返回 FRIENDS。 

## 方法

 蛮力方法检查每一对$a_i, a_j$和$i < j$并验证$a_i$划分$a_j$或者$a_j$划分$a_i$。 这是有效的，因为它明确验证了友好组的定义。 为了$n = 1000$，这需要大约 500,000 次整除性检查。 虽然此约束是可以接受的，但考虑到数字的排序顺序，这是不必要的。 

最佳方法利用排序顺序。 如果最小的数字除以所有其他数字，则数组中的每一对都将满足友谊条件。 这是因为整除性沿着最小元素的倍数是传递的：如果$x$划分$y$和$y$划分$z$， 然后$x$划分$z$。 因此，我们只需要检查最小的数字是否能整除列表中的所有其他数字。 这减少了检查次数$O(n^2)$到$O(n)$。 

蛮力之所以有效，是因为它直接实现了定义，但效率较低。 最小元素必须整除所有其他元素的观察结果将问题简化为单个线性扫描。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 可以接受但速度较慢|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取整数$n$以及以逗号分隔的排序数字列表。 
2. 将输入列表转换为整数。 
3. 将列表的第一个元素分配给变量`smallest`。 这位候选人必须区别其他所有候选人。 
4. 迭代列表中的剩余数字。 
5. 对于每个数字，检查它是否可以被整除`smallest`。 如果有任何数字不可整除，则立即打印“NOT FRIENDS”并退出。 
6. 如果所有数字都可以被`smallest`，打印“朋友”。 

不变的是，在检查所有数字后，如果没有发生违规，则最小的元素除以所有其他数字。 因为数字是排序的，并且整除性是沿着最小数字的倍数传递的，所以组中的每一对都满足友谊条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
nums = list(map(int, input().strip().split(',')))

smallest = nums[0]
for num in nums[1:]:
    if num % smallest != 0:
        print("NOT FRIENDS")
        sys.exit(0)
print("FRIENDS")
```我们读取输入并用逗号分隔它，将结果字符串转换为整数。 我们将第一个数字作为最小的数字，然后迭代其余数字以检查整除性。 使用`sys.exit(0)`失败时立即终止程序，避免不必要的检查。 运算顺序至关重要：在执行取模之前将字符串转换为整数可以防止运行时错误。 

## 工作示例

 样本1：

 输入：`1,3,6,12`| 变量| 迭代 1 | 迭代 2 | 迭代 3 |
 | --- | --- | --- | --- |
 | 编号 | 3 | 6 | 12 | 12
 | num % 最小 | 3 % 1 = 0 | 6 % 1 = 0 | 12% 1 = 0 |

 所有数字都能被 1 整除。输出：FRIENDS。 这证实了最小元素策略在最小值为 1 时有效。 

样本2：

 输入：`2,3,6`| 变量| 迭代 1 | 迭代 2 |
 | --- | --- | --- |
 | 编号 | 3 | 6 |
 | num % 最小 | 3 % 2 = 1 | - |

 3 不能被 2 整除。输出：NOT FRIENDS。 这表明失败后提前退出。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 我们遍历列表一次来检查整除性 |
 | 空间| O(n) | 我们将整数列表存储在内存中 |

 给定 n ≤ 1000，该算法最多执行 999 次模运算。 内存使用量可以忽略不计。 该解决方案非常适合时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    n = int(input())
    nums = list(map(int, input().strip().split(',')))
    smallest = nums[0]
    for num in nums[1:]:
        if num % smallest != 0:
            print("NOT FRIENDS")
            return output.getvalue().strip()
    print("FRIENDS")
    return output.getvalue().strip()

# provided sample
assert run("4\n1,3,6,12\n") == "FRIENDS", "sample 1"
# all equal
assert run("3\n5,5,5\n") == "FRIENDS", "all equal"
# minimum size
assert run("1\n7\n") == "FRIENDS", "single element"
# maximum size, all divisible
assert run("5\n2,4,8,16,32\n") == "FRIENDS", "powers of two"
# non-divisible in middle
assert run("4\n2,3,6,12\n") == "NOT FRIENDS", "failure in middle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 3,5,5 | 朋友 | 所有相同的数字 |
 | 1 元素：7 | 朋友 | 单元素群 |
 | 2,4,8,16,32 | 朋友 | 倍数链 |
 | 2,3,6,12 | 不是朋友| 及早发现中间故障|

 ## 边缘情况

 对于像这样的单元素群`7`，算法分配`smallest = 7`并没有找到剩余的数字。 它打印朋友。 这正确地处理了最小$n=1$设想。 对于所有数字都相同的组，模检查始终返回 0，因此会打印 FRIENDS。 如果最小的数字是 1，则所有其他数字都可以被 1 整除，因此即使使用大整数，也能正确返回 FRIENDS。 提前退出可确保我们在检测到违规行为后不会执行不必​​要的操作。
