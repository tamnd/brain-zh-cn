---
title: "CF 1436A - 重新订购"
description: "该问题提出一个整数数组，并询问是否可以对其进行重新排序，以便特定的加权和与给定的目标值匹配。"
date: "2026-06-11T04:52:08+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1436
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 678 (Div. 2)"
rating: 800
weight: 1436
solve_time_s: 206
verified: true
draft: false
---

[CF 1436A - 重新排序](https://codeforces.com/problemset/problem/1436/A)

 **评分：** 800
 **标签：** 数学
 **求解时间：** 3m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题提出一个整数数组，并询问是否可以对其进行重新排序，以便特定的加权和与给定的目标值匹配。 总和定义为所有起始位置的总和$i$从该位置到每个元素末尾的总和除以其从一开始的索引。 从概念上讲，每个元素对总和的多项有贡献，较早的元素比后面的元素影响更多的项。 

输入由多个测试用例组成。 每个测试用例都会给出数组的长度、目标总和以及数组本身。 如果存在产生精确总和的数组的任何排列，则输出应为“YES”，否则输出应为“NO”。 

在条件限制下$1 \le n \le 100$和$0 \le a_i, m \le 10^6$，我们可以安全地执行计算$O(n \log n)$或者$O(n^2)$每个测试用例，因为$100^2$操作是可以接受的。 一个天真的解决方案尝试了所有$n!$排列是不可行的。 要观察的边缘情况包括零数组、具有单个元素的数组或小于最小元素的目标。 例如，使用数组$[0, 0, 0]$和目标$1$，正确的输出是“NO”。 如果数组是$[5]$目标是$5$，答案是“是”。 

## 方法

 暴力方法将生成所有$n!$排列并计算每个排列的总和。 虽然正确，但这是不切实际的，因为即使对于$n = 10$，排列数超过300万。 

关键的观察结果是数组元素的总和是线性的。 重写公式得出：$$\sum_{i=1}^{n}\sum_{j=i}^{n} \frac{a_j}{j} = \sum_{j=1}^{n} a_j \sum_{i=1}^{j} \frac{1}{j} = \sum_{j=1}^{n} a_j$$自从$\sum_{i=1}^{j} \frac{1}{j} = 1$。 因此，加权和简化为数组元素的简单和。 这种显着的简化意味着总和在重新排序下保持不变。 然后问题就简化为检查所有元素的总和是否等于目标。 这种见解将看似复杂的组合问题转化为简单的算术检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（所有排列）| O(n! * n) | O(n! * n) | O(n) | 太慢了 |
 | 总和检查（最佳）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 
2. 对于每个测试用例，请阅读$n$和$m$，然后读取长度的数组$n$。 
3. 计算所有数组元素的总和。 
4. 将此总和与$m$。 如果相等，则打印“YES”； 否则，打印“NO”。 

为什么它有效：问题中给出的公式会折叠为数组元素的总和，无论它们的顺序如何。 因此，如果总和与目标匹配，则任何排列都简单地满足条件。 如果不是，则任何排列都不能满足该条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        if sum(a) == m:
            print("YES")
        else:
            print("NO")

if __name__ == "__main__":
    solve()
```该解决方案可以有效地读取输入`sys.stdin.readline`，在线性时间内计算总和，并将其直接与目标进行比较。 这些变量的作用域位于循环内部，以避免跨测试用例重用。 总和检查是准确的，因为所有数字都是整数，避免了浮点问题。 

## 工作示例

 **样品1**

 | 变量| 价值|
 | ---| ---|
 | n | 3 |
 | 米 | 8 |
 | 一个 | [2, 5, 1] |
 | 总和（一）| 8 |
 | 比较| 8 == 8 → 是 |

 **样品2**

 | 变量| 价值|
 | ---| ---|
 | n | 4 |
 | 米 | 4 |
 | 一个 | [0, 1, 2, 3] |
 | 总和（一）| 6 |
 | 比较| 6 != 4 → 否 |

 这些痕迹表明唯一的要求是数组的总和。 内部和外部求和在重新排序下是不变的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n * t) | 每个测试用例最多包含 100 个元素。 |
 | 空间| O(n) | 每个测试用例的数组存储。 |

 和$t \le 100$和$n \le 100$，最坏情况下的操作是 10,000 次，完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided samples
assert run("2\n3 8\n2 5 1\n4 4\n0 1 2 3\n") == "YES\nNO", "sample 1"

# custom cases
assert run("1\n1 5\n5\n") == "YES", "single element equal"
assert run("1\n1 5\n4\n") == "NO", "single element not equal"
assert run("1\n3 0\n0 0 0\n") == "YES", "all zeros target zero"
assert run("1\n3 1\n0 0 1\n") == "YES", "sum equals target with zero elements"
assert run("1\n3 2\n1 0 0\n") == "NO", "sum does not equal target"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1\n1 5\n5\n | 1\n1 5\n5\n | 是 | 单元素数组，其中元素等于目标 |
 | 1\n1 5\n4\n | 1\n1 5\n4\n | 否 | 元素与目标不同的单元素数组 |
 | 1\n3 0\n0 0 0\n | 1\n3 0\n0 0 0\n | 是 | 一切归零，目标归零 |
 | 1\n3 1\n0 0 1\n | 1\n3 1\n0 0 1\n | 是 | 总和与存在零的目标匹配 |
 | 1\n3 2\n1 0 0\n | 1\n3 2\n1 0 0\n | 否 | 总和与目标 | 不匹配

 ## 边缘情况

 最小边缘情况是长度为 1 的数组。 总和检查可以简单地处理这个问题，因为单个元素必须与目标匹配。 只要目标为零，全零数组就可以工作，而混合零数组则可以正常工作，因为所有元素的总和才是最重要的，忽略顺序。 不需要浮点运算，因为所有运算都是整数和。
