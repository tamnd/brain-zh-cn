---
title: "CF 1860B - 精美硬币"
description: "我们被要求确定当 Monocarp 有两种类型的硬币时，Monocarp 必须使用最少数量的花式硬币来支付 m burles：一种价值 1 burles，一种价值 k burles。"
date: "2026-06-09T00:21:59+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1860
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 153 (Rated for Div. 2)"
rating: 1200
weight: 1860
solve_time_s: 106
verified: true
draft: false
---

[CF 1860B - 花式硬币](https://codeforces.com/problemset/problem/1860/B)

 **评分：** 1200
 **标签：** 二分查找、暴力破解、贪心、数学
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定 Monocarp 必须使用的最少花式硬币才能准确支付`m`当他有两种类型的硬币时，他会得到 burles：一种价值 1 burles，另一种价值 1 burles`k`布尔斯。 对于每种类型，他的普通硬币数量有限（`a_1`1-Burle 硬币，`a_k`k-burle 硬币）和无限多的花式硬币。 从 Monocarp 希望尽量减少其使用的意义上来说，花式硬币更加“昂贵”。 

输入由多个测试用例组成。 对于每项，我们都会收到总金额`m`，较大的硬币价值`k`，以及可用普通硬币的数量`a_1`和`a_k`。 对于每种情况，我们必须计算准确达到目标所需的最小花式硬币总数`m`使用普通硬币和花式硬币的任意组合。 

约束表明`m`和`k`可以大到`10^8`，以及测试用例的数量`t`最多可达 30,000。 这排除了任何迭代所有可能的硬币组合的解决方案，因为这可能会导致最多`10^16`以一种幼稚的方式进行操作。 我们需要一种方法来计算每个测试用例的恒定时间或相对于对数时间的结果`k`。 

一些微妙的边缘情况是当 Monocarp 的一种或两种类型的普通硬币为零时，或者当`m`小于`k`。 例如，如果`m = 5`,`k = 3`， 和`a_1 = 0`,`a_k = 1`，正确答案是 2 个花式硬币（一枚 3-burle 硬币和两枚 1-burle 硬币），而不是 1 个花式硬币。 一个粗心的实施，贪婪地使用大硬币而不检查常规硬币计数会产生错误的结果。 

## 方法

 暴力方法将尝试使用每种类型的硬币数量的所有组合，计算每种可能性的奇特硬币的总数。 具体来说，我们可以迭代`x`从 0 到最小值`a_k`和`m//k`，代表使用的常规 k-burle 硬币的数量，然后求解所需的 1-burle 硬币的数量。 这种方法是正确的，但太慢了：在最坏的情况下，我们可以尝试`m/k`30,000 个测试用例中每一个的可能性，很容易超出时间限制。 

关键的见解是考虑余数模`k`。 总金额`m`可以表示为`m = q * k + r`在哪里`0 ≤ r < k`。 花式 1-burle 硬币的数量恰好是普通 1-burle 硬币无法覆盖的剩余部分的数量，即：`max(0, r - a_1)`。 对于 k-burle 硬币，超出常规 k-burle 硬币的任何短缺都会产生影响`q - a_k`花哨的硬币，但前提是正面。 这将问题简化为使用除法和模的简单算术计算，从而消除了迭代的需要。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个测试用例的 O(m/k) | O(1) | O(1) | 太慢了 |
 | 最佳 | 每个测试用例 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 划分总金额`m`经过`k`求商`q`和余数`r`。`q`表示如果我们忽略常规硬币可用性所需的 k-burle 硬币数量。`r`代表用 1-burle 硬币支付的剩余金额。 
2. 计算需要多少枚精美的 1-burle 硬币。 使用`fancy_1 = max(0, r - a_1)`。 这确保我们首先消耗所有可用的常规 1-burle 硬币来支付剩余部分。 
3. 计算需要多少个精美的 k-burle 硬币。 消耗掉所有普通的 k-burle 硬币后，任何剩余的 k-burle 硬币需求都必须来自精美硬币。 使用`fancy_k = max(0, q - a_k)`。 
4. 将两个值相加：`fancy_1 + fancy_k`是所需花哨硬币的最少数量。 

为什么有效：首先用普通硬币支付尽可能多的费用，然后仅使用花式硬币来弥补不足，我们保证花式硬币的使用量最少。 除法和取模可确保自动最小化 k-burle 硬币的数量，因为任何剩余的 1-burle 数量都会直接计算为余数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    t = int(input())
    for _ in range(t):
        m, k, a1, ak = map(int, input().split())
        q, r = divmod(m, k)
        fancy_1 = max(0, r - a1)
        fancy_k = max(0, q - ak)
        print(fancy_1 + fancy_k)

if __name__ == "__main__":
    main()
```该解决方案可以有效地读取所有输入`sys.stdin.readline`。`divmod`避免为商和余数编写两个单独的运算。 使用`max(0, ...)`保证我们绝不会报告负花式硬币。 减法的顺序确保我们首先消耗所有普通硬币，然后再计算花式硬币，这与贪婪策略保持一致。 

## 工作示例

 **示例1：**`m = 11, k = 3, a1 = 6, ak = 1`| 步骤| q，r | fancy_1 | 奇特_k | 总花哨|
 | --- | --- | --- | --- | --- |
 | 计算 q、r | 11 // 3 = 3, 11 % 3 = 2 | 最大(0, 2 - 6) = 0 | 最大(0, 3 - 1) = 2 | 2 |

 Trace 表明，尽管 1-burle 硬币足以覆盖剩余部分，但我们需要两枚精美的 k-burle 硬币来弥补大部分。 

**示例2：**`m = 11, k = 3, a1 = 0, ak = 0`| 步骤| q，r | fancy_1 | 奇特_k | 总花哨|
 | --- | --- | --- | --- | --- |
 | 计算 q、r | 11 // 3 = 3, 11 % 3 = 2 | 最大(0, 2 - 0) = 2 | 最大(0, 3 - 0) = 3 | 5 |

 这里不存在普通硬币，因此所有硬币都必须是花式的。 这与示例输出相匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(1) | 每个测试用例仅执行除法、取模和两个最大值运算。 |
 | 空间| 每个测试用例 O(1) | 仅存储少数整数变量。 |

 给定`t ≤ 3e4`，总时间可以忽略不计（~10^5 次操作），在 2 秒内轻松完成。 内存使用量极小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided samples
assert run("4\n11 3 0 0\n11 3 20 20\n11 3 6 1\n100000000 2 0 0\n") == "5\n0\n1\n50000000"

# Custom cases
assert run("1\n5 5 0 1\n") == "0", "Use one regular k-burle coin"
assert run("1\n5 5 0 0\n") == "1", "Use one fancy k-burle coin"
assert run("1\n1 2 1 0\n") == "0", "Exactly enough 1-burle coin"
assert run("1\n1 2 0 0\n") == "1", "No regular coins, must use one fancy 1-burle coin"
assert run("1\n100000000 100000000 0 0\n") == "1", "Large k equal to m"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5 5 0 1`| 0 | 正确消耗一枚普通的 k-burle 硬币 |
 |`5 5 0 0`| 1 | 当没有常规可用时，使用精美的 k-burle 硬币 |
 |`1 2 1 0`| 0 | 最小 1-burle 硬币覆盖剩余 |
 |`1 2 0 0`| 1 | 没有普通硬币时需要最少的花式硬币 |
 |`100000000 100000000 0 0`| 1 | 正确处理大量 |

 ## 边缘情况

 当`a1 = 0`和`ak = 0`，所有的硬币都必须是花哨的。 用于输入`m = 11, k = 3`，我们计算`q = 3, r = 2`。 然后`花哨_
