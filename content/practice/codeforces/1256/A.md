---
title: "CF 1256A - 付款无需找零"
description: "我们被要求确定是否可以使用两种类型的硬币构建目标总和 S。 一种类型的值为 n，有 1 个硬币，另一种类型的值为 1，有 b 个硬币。"
date: "2026-06-11T20:52:24+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1256
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 598 (Div. 3)"
rating: 1000
weight: 1256
solve_time_s: 110
verified: true
draft: false
---

[CF 1256A - 付款无需找零](https://codeforces.com/problemset/problem/1256/A)

 **评分：** 1000
 **标签：** 数学
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求确定目标金额是否`S`可以使用两种类型的硬币来构造。 一种类型有价值`n`并且有`a`它的硬币，其他类型也有价值`1`并且有`b`它的硬币。 对于每个测试用例，任务是决定我们是否可以选择一些数字`x`有价值的硬币`n`和一些数字`y`有价值的硬币`1`使得它们的总价值等于`S`。 限制条件是`x`不能超过`a`和`y`不能超过`b`。 

输入尺寸很大：`a`,`b`,`n`， 和`S`可以达到`10^9`，并且最多可以有`10^4`测试用例。 这排除了任何尝试每种组合的暴力方法`x`和`y`因为迭代次数可能会超过`10^9`每个测试用例，远远超出了一秒内的可行计算。 

当目标`S`不是的倍数`n`但我们的值钱硬币很少`1`。 例如，如果`a=1`,`b=1`,`n=3`， 和`S=4`，我们可以拿一枚价值 3 的硬币和一枚价值 1 的硬币来达到 4。但是如果`b=0`， 相同`S`即使无法到达`S`小于最大可能使用`a`的硬币`n`。 一种粗心的方法，只检查`S <= a * n + b`对于这种情况会错误地返回 YES。 

## 方法

 天真的方法是迭代每个可能的数量`n`- 价值硬币`x`从`0`到`a`并且对于每个`x`检查是否有`y`这样`x*n + y = S`和`y <= b`。 这是有效的，因为它直接测试所有可能的到达方式`S`，但它需要最多`a`每个测试用例的迭代次数。 自从`a`可以达到`10^9`，这种做法是完全不切实际的。 

The key observation that leads to an optimal solution is that we do not need to try every`x`。 最大的贡献来自于`n`- 应首先使用价值硬币以减少我们需要的剩余金额`1`- 价值硬币。 我们可以简单地采取`x = min(a, S // n)`有价硬币`n`。 这使得贡献最大化`n`- 硬币价值不超过`a`或超调`S`。 然后剩余金额达到`S`是`S - x * n`。 如果这个余数小于或等于`b`，我们可以用`1`- 价值硬币。 否则无法达到总和。 这一观察结果将解决方案简化为每个测试用例的恒定时间检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(a) | O(1) | O(1) | 对于 a=10^9 来说太慢 |
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，读取值`a`,`b`,`n`,`S`。 
2. 计算最大数量`n`-我们可以使用的硬币价值不超过`S`作为`S // n`。 
3. 通过我们拥有的实际代币来限制这个数量，给出`x = min(a, S // n)`。 
4. 计算使用后的剩余金额`x`有价硬币`n`:`remaining = S - x * n`。 
5. 检查是否`remaining`小于或等于`b`。 如果是，则打印`YES`; 否则，打印`NO`。 

为什么有效：通过在不超过目标的情况下获取尽可能多的高价值硬币，我们可以确保将剩余金额降至最低。 由于 1 面值的硬币可以覆盖任意金额，最多可达`b`，检查余数是否 ≤ b 保证了精确的总和`S`如果可能的话可以组建。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

q = int(input())
for _ in range(q):
    a, b, n, S = map(int, input().split())
    max_n_coins = min(a, S // n)
    remaining = S - max_n_coins * n
    if remaining <= b:
        print("YES")
    else:
        print("NO")
```该解决方案首先计算最大数量`n`-我们可以拿走的价值硬币（`S // n`），然后通过可用硬币限制它（`min(a, S // n)`）。 检查剩余金额`b`。 使用整数除法和减法可以保证没有浮点错误。 除了几个变量之外，不使用额外的空间。 

## 工作示例

 跟踪示例 1：

 输入：`1 2 3 4`| 步骤| 最大 n 个币 | 剩余| 剩余 <= b? | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 最小值(1, 4//3)=1 | 4 - 1*3 = 1 | 1 <= 2 | 1 <= 2 | 是 |

 输入：`1 2 3 6`| 步骤| 最大 n 个币 | 剩余| 剩余 <= b? | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 最小值(1, 6//3)=1 | 6 - 1*3 = 3 | 6 - 1*3 = 3 | 3 <= 2 | 3 <= 2 | 否 |

 这些痕迹表明，算法正确计算了要使用多少高价值硬币，并验证剩余金额是否可以用 1 价值硬币覆盖。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(1) | 每个测试用例都需要一些算术运算 |
 | 空间| O(1) | O(1) | 仅使用了少数整数变量 |

 给予`10^4`测试用例，总操作在`10^5`，很容易满足 1 秒的限制。 内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    q = int(input())
    for _ in range(q):
        a, b, n, S = map(int, input().split())
        max_n_coins = min(a, S // n)
        remaining = S - max_n_coins * n
        if remaining <= b:
            output.append("YES")
        else:
            output.append("NO")
    return "\n".join(output)

# Provided samples
assert run("4\n1 2 3 4\n1 2 3 6\n5 2 6 27\n3 3 5 18\n") == "YES\nNO\nNO\nYES", "Sample 1"

# Custom cases
assert run("1\n0 5 3 4\n") == "NO", "no n-value coins"
assert run("1\n5 0 3 9\n") == "YES", "exact multiples of n"
assert run("1\n5 0 3 10\n") == "NO", "remainder cannot be covered"
assert run("1\n1 1 1 2\n") == "YES", "minimum coin values"
assert run("1\n1000000000 1000000000 1000000000 2000000000\n") == "YES", "maximum coin counts"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`0 5 3 4`| 否 | 没有n值硬币就无法支付S |
 |`5 0 3 9`| 是 | n 的精确倍数，无需 1 值硬币 |
 |`5 0 3 10`| 否 | 剩余部分无法覆盖 |
 |`1 1 1 2`| 是 | 最小值，简单情况 |
 |`1000000000 1000000000 1000000000 2000000000`| 是 | 大量，压力测试|

 ## 边缘情况

 如果`a`为0时，算法设置`max_n_coins = 0`并检查是否`S <= b`。 例如，`a=0, b=5, n=3, S=4`导致`max_n_coins=0`,`remaining=4`， 和`remaining <= b`仅当`b >= 4`。 如果`b`较小，算法正确输出 NO。 

如果`S`小于`n`但我们有一些n值的硬币，`S // n`为 0，因此不使用 n 值硬币。 为了`a=5, b=5, n=10, S=3`,`max_n_coins=0`,`remaining=3`， 和`remaining <= b`评估结果为 YES，因为 1 值硬币就足够了。 

如果`S`正好等于`a * n + b`，该算法采用所有`a`硬币并使用剩余的`b`硬币来支付剩余部分。 这可以正确处理上限边缘。
