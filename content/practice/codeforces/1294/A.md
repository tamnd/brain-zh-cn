---
title: "CF 1294A - 收集硬币"
description: "我们被要求决定是否可以将给定数量的硬币分配给三姐妹，以便她们最终得到相同的硬币总数。 每个姐妹都已经有一些硬币：爱丽丝有 a，芭芭拉有 b，塞琳有 c。"
date: "2026-06-11T18:40:03+07:00"
tags: ["codeforces", "competitive-programming", "math"]
categories: ["algorithms"]
codeforces_contest: 1294
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 615 (Div. 3)"
rating: 800
weight: 1294
solve_time_s: 109
verified: true
draft: false
---

[CF 1294A - 收集硬币](https://codeforces.com/problemset/problem/1294/A)

 **评分：** 800
 **标签：** 数学
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求决定是否可以将给定数量的硬币分配给三姐妹，以便她们最终得到相同的硬币总数。 每个姐妹已经有一些硬币：爱丽丝有`a`，芭芭拉有`b`，而 Cerene 有`c`。 坡旅甲带来`n`额外的硬币，他可以给每个姐妹任意非负数的这些硬币。 问题是是否存在一种方法来分配所有`n`硬币这样`a + A = b + B = c + C`， 在哪里`A + B + C = n`和`A, B, C ≥ 0`。 

每个测试用例都是独立的，数量可以大到10^8，最多有10^4个测试用例。 这告诉我们，任何循环所有可能的硬币分布的解决方案都太慢了。 我们需要一种每个测试用例的复杂度为 O(1) 的方法。 

需要注意的边缘情况包括其中一个姐妹已经拥有比其他姐妹多得多的硬币的情况，或者平衡她们所需的硬币总数不能均匀分配的情况。 例如，如果姐妹们有 1、2、3 个硬币，`n = 3`简单地将硬币逐一相加的幼稚方法可能会错误地认为这是可能的，但仔细计算表明，您无法分配 3 个硬币以使所有总数相等，因为最大差距为 2，并且您无法平均分配剩余部分。 

## 方法

 蛮力方法会尝试每种组合`(A, B, C)`这样`A + B + C = n`。 这原则上是可行的，因为我们只需要检查整数解，但可能性的数量随着`n`。 鉴于`n`可以是10^8，这显然是不可行的。 

关键的见解是我们不需要尝试所有发行版。 让`max_coins`是目前姐妹们拥有的金币数量最多的。 为了平衡她们，我们至少必须让另外两个姐妹达到`max_coins`。 令达到该级别所需的硬币总数为`(max_coins - a) + (max_coins - b) + (max_coins - c)`。 如果这个数字超过`n`，这是不可能的。 

如果我们有足够的币，均衡后剩余的币为`max_coins`必须能被 3 整除。这是因为超出基线的任何额外硬币都必须平均分配，以保持所有三个姐妹之间的平等。 这个两步检查 - 首先确保我们有足够的硬币来到达`max_coins`，然后检查能否被 3 整除 - 将问题简化为简单的常数时间计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了|
 | 最佳 | 每个测试用例 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，确定任何姐妹当前拥有的最大硬币数量：`max_coins = max(a, b, c)`。 这是我们所有姐妹必须达到的最低目标。 
2. 计算使每个姐妹达到所需的硬币总数`max_coins`:`needed = (max_coins - a) + (max_coins - b) + (max_coins - c)`。 这说明了均衡所有三个的基线。 
3.检查Polycarp是否带来了硬币（`n`) 就足够了：如果`needed > n`，输出“否”。 分配是不可能的。 
4.如果有足够的币，计算剩余的币：`extra = n - needed`。 这些必须能被 3 整除才能平分给三个姐妹。 如果`extra % 3 == 0`，输出“是”； 否则，输出“NO”。 

**为什么有效：** 不变的是，在第 2 步之后，所有姐妹都至少被带到了`max_coins`。 任何剩余的硬币必须能被三整除以保持平等。 没有其他约束，因此该检查保证了正确性。 不需要进一步的迭代或复杂的分布。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    a, b, c, n = map(int, input().split())
    max_coins = max(a, b, c)
    needed = (max_coins - a) + (max_coins - b) + (max_coins - c)
    if n < needed:
        print("NO")
    else:
        extra = n - needed
        print("YES" if extra % 3 == 0 else "NO")
```该代码使用有效地读取多个测试用例`sys.stdin.readline`。 这`max`函数快速找到最高的起始硬币数。 我们计算平衡每个人所需的代币，并在两个简单的条件下检查可行性和可分割性。 使用整数算术可确保没有舍入错误，并且不存在相差一的问题，因为所有计算都是精确的。 

## 工作示例

 **示例输入 1：**`5 3 2 8`| 一个 | 乙| c | n | 最大币数 | 需要| 额外 | 决定|
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 5 | 3 | 2 | 8 | 5 | 5 | 3 | 是 |

 说明：从 3→5 带来 Barbara，从 2→5 带来 Cerene。`needed = 5`。 其余的`n - needed = 3`可以平分给每个姐妹多一枚硬币，实现平等。 

**示例输入 2：**`3 2 1 100000000`| 一个 | 乙| c | n | 最大币数 | 需要| 额外 | 决定|
 | ---| ---| ---| ---| ---| ---| ---| ---|
 | 3 | 2 | 1 | 100000000 | 3 | 3 | 99999997 | 否 |

 解释：我们将所有人带到 3。`needed = 3`。`extra = 99999997`不能被3整除，所以我们不能将它平分给三个姐妹。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(1) | 每个案例只有一些算术运算，没有循环`n`|
 | 空间| O(1) | O(1) | 仅使用了几个整数变量 |

 给定`t ≤ 10^4`，该算法很容易在 2 秒限制内运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        a, b, c, n = map(int, input().split())
        max_coins = max(a, b, c)
        needed = (max_coins - a) + (max_coins - b) + (max_coins - c)
        if n < needed:
            print("NO")
        else:
            extra = n - needed
            print("YES" if extra % 3 == 0 else "NO")
    return output.getvalue().strip()

# Provided samples
assert run("5\n5 3 2 8\n100 101 102 105\n3 2 1 100000000\n10 20 15 14\n101 101 101 3\n") == \
"YES\nYES\nNO\nNO\nYES", "sample 1"

# Custom cases
assert run("1\n1 1 1 0\n") == "YES", "all equal, no extra coins"
assert run("1\n1 2 3 3\n") == "YES", "small numbers, divisible extra"
assert run("1\n1 2 3 2\n") == "NO", "small numbers, insufficient extra"
assert run("1\n100000000 100000000 100000000 3\n") == "YES", "max input, small extra divisible"
assert run("1\n1 1 1 2\n") == "NO", "all equal, extra not divisible"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1 1 0 | 1 1 1 0 是 | 没有多余的金币，已经平等|
 | 1 2 3 3 | 1 2 3 3 是 | 足够的硬币可以平分和分割|
 | 1 2 3 2 | 1 2 3 2 否 | 金币不足，无法均衡 |
 | 100000000 100000000 100000000 3 | 是 | 处理最大输入值 |
 | 1 1 1 2 | 1 1 1 2 否 | 额外的硬币不能被 3 整除 |

 ## 边缘情况

 当所有姐妹已经拥有相等的硬币时，比如`a = b = c = 1`和`n = 0`,`needed = 0`和`extra = 0`。 整除性检查通过，因此输出为“YES”。 如果`n = 2`反而，`extra = 2`不能被 3 整除，因此输出为“NO”。 这表明该算法可以正确处理不需要分配或不可分割的剩余硬币的情况。 

当币种极度不平衡时，比如`a = 1, b = 2, c = 100000000`和`n
