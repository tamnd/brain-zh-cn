---
title: "CF 59B - 算命"
description: "玛丽娜可以从田野里采摘任何花朵。 每朵花都有一定数量的花瓣，她会从所有选定的花中一一摘下所有花瓣。 从第一片花瓣上的“爱”开始，短语在“爱”和“不爱”之间交替。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 59
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 55 (Div. 2)"
rating: 1200
weight: 59
solve_time_s: 117
verified: false
draft: false
---

[CF 59B - 算命](https://codeforces.com/problemset/problem/59/B)

 **评分：** 1200
 **标签：** 实现，数论
 **求解时间：** 1m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 玛丽娜可以从田野里采摘任何花朵。 每朵花都有一定数量的花瓣，她会从所有选定的花中一一摘下所有花瓣。 这些短语交替出现`"Loves"`和`"Doesn't love"`，从`"Loves"`在第一片花瓣上。 

最后的短语仅取决于花束中花瓣的总数。 如果总数是奇数，则最后说出的短语是`"Loves"`。 如果总数是偶数，则最后一个短语是`"Doesn't love"`。 

经过这次观察，任务变得简单多了。 我们根本不是在模拟算命过程。 我们只需要选择一个总和为奇数的子集，同时使总和尽可能大。 

花朵数量最多为 100 朵，每朵花最多有 100 个花瓣。 即使对所有子集的强力解决方案也将涉及检查$2^{100}$可能性，这是完全不可能的。 在竞争性编程中，一百万次操作通常就足够了，但是$2^{100}$是天文数字般的大。 

花瓣数的小值范围暗示解决方案可能取决于奇偶校验而不是复杂的优化。 一旦我们将问题简化为“求最大奇数和”，结构就变得非常直接。 

有一些边缘情况很容易破坏粗心的实现。 

假设每朵花都有偶数个花瓣：```
3
2 4 6
```总和是偶数，除去任何偶数仍然留下偶数和。 不存在奇怪的花束，所以正确答案是：```
0
```如果可能的话，总是打印总和的天真的方法在这里会失败。 

另一个棘手的情况是当总和是偶数，但有奇数花可用时：```
4
1 2 4 8
```总和是 15，这已经是奇数了，所以答案是 15。有些实现在看到一朵奇数花时就会错误地删除一朵奇数花，即使总数已经正确。 

当总和为偶数且有多个奇数花时，会出现不同的故障模式：```
5
1 3 5 2 2
```总和是 13，已经是奇数了，所以我们保留所有内容。 但如果总数是偶数，正确的策略是去除最小的奇数花，而不仅仅是任何奇数花。 移除一朵较大的奇数花会不必要地减少答案。 

例如：```
3
3 5 8
```总数是 16。去掉 5 个就是 11，去掉 3 个就是 13。最佳答案是 13。 

## 方法

 蛮力的想法很简单。 枚举每个可能的花子集，计算该子集中的花瓣总数，并保留最大的奇数和。 

这是有效的，因为每一束花束都对应一个子集。 如果我们检查所有子集，我们就能保证找到最好的有效子集。 

问题是子集的数量。 和$n = 100$，子集总数为：$$2^{100}$$这远远超出了任何程序在时限内可以处理的范围。 

关键的观察是只有平等才重要。 

产生奇数总数`"Loves"`，并且产生均匀的总数`"Doesn't love"`。 所以我们想要最大可能的奇数和。 

从所有花的总和开始。 只有两种情况。 

如果总和已经是奇数，我们显然应该保留每朵花，因为删除任何正数只会减少总和。 

如果总和是偶数，那么我们必须改变它的奇偶性。 去掉一朵偶数的花会使总和保持偶数，所以这没有帮助。 移除奇数朵花会将奇偶性翻转为奇数。 

在所有奇数花朵中，我们应该去掉最小的一朵，因为我们希望剩余的数量尽可能多。 

如果根本没有奇数花，则每个可能的子集和都是偶数，答案为 0。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n \cdot n)$|$O(1)$| 太慢了 |
 | 最佳|$O(n)$|$O(1)$| 已接受 |

 ## 算法演练

 1. 读出花朵的数量和花瓣的数量。 
2. 计算所有花瓣的总和。 

保留所有的花可以得到最大的总和，所以这是最好的起点。 
3. 检查总和是否为奇数。 

如果是奇数，请立即打印总数，因为没有更小的子集可以改进答案。 
4. 如果总和是偶数，则寻找花瓣数为奇数的最小的花。 

删除一个奇数会将偶数和变为奇数和。 
5. 如果存在这样的花，则打印：$$\text{total sum} - \text{smallest odd flower}$$This produces the maximum possible odd sum because we remove the minimum amount necessary to fix the parity.

 1. If no odd flower exists, print 0.

In this situation every flower is even, so every subset sum is also even.

 ### 为什么它有效

 The algorithm relies on parity properties.

 The sum of numbers changes parity only when an odd number is added or removed. Starting from the maximum possible sum, there are only two possibilities.

 If the total sum is already odd, any removal would decrease the answer, so keeping everything is optimal.

 If the total sum is even, we must remove an odd value to make it odd. Removing the smallest odd value minimizes the loss, which guarantees the resulting odd sum is as large as possible.

 No other operation can produce a better answer.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))

total = sum(a)

if total % 2 == 1:
    print(total)
else:
    smallest_odd = float('inf')

    for x in a:
        if x % 2 == 1:
            smallest_odd = min(smallest_odd, x)

    if smallest_odd == float('inf'):
        print(0)
    else:
        print(total - smallest_odd)
```该程序首先读取花瓣数并计算它们的总和。 

第一个分支处理最简单的情况。 如果总数已经是奇数，我们会直接打印它，因为保留所有鲜花总是可以最大化花束大小。 

第二个分支搜索最小奇数花。 变量`smallest_odd`从无穷大开始，这样我们就可以在循环期间安全地最小化实际值。 

奇偶校验使用`x % 2 == 1`。 任何奇数的花朵被移除后都可以翻转总数的奇偶性。 

条件：```
smallest_odd == float('inf')
```意味着没有发现奇怪的花。 在这种情况下，每朵花都是偶数，并且不存在奇数子集和。 

不存在溢出问题，因为最大可能总数仅为：$$100 \times 100 = 10000$$不过，Python 整数会自动处理更大的值。 

## 工作示例

 ### 示例 1

 输入：```
1
1
```| 步骤| 价值|
 | --- | --- |
 | 总金额 | 1 |
 | 总平价 | 奇数|
 | 输出| 1 |

 总数已经是奇数，所以取唯一的花是最佳的。 

### 示例 2

 输入：```
3
3 5 8
```| 步骤| 价值|
 | --- | --- |
 | 总金额 | 16 | 16
 | 总平价 | 甚至|
 | 奇花异草| 3, 5 |
 | 最小奇数| 3 |
 | 最终答案| 16 - 3 = 13 | 16 - 3 = 13 |

 该痕迹显示了为什么去除最小的奇花很重要。 删除 5 个只会产生 11 个，这更糟糕。 

### 示例 3

 输入：```
4
2 4 6 8
```| 步骤| 价值|
 | --- | --- |
 | 总金额 | 20 |
 | 总平价 | 甚至|
 | 发现奇怪的花| 无 |
 | 输出| 0 |

 每朵花都是偶数，因此每个子集和仍然是偶数。 不存在有效的花束。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 一次计算总和，一次找到最小的奇数花 |
 | 空间|$O(1)$| 仅使用了几个变量 |

 最多有 100 朵花，解决方案立即运行。 该算法是线性的，并使用恒定的额外内存，很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    total = sum(a)

    if total % 2 == 1:
        print(total)
    else:
        smallest_odd = float('inf')

        for x in a:
            if x % 2 == 1:
                smallest_odd = min(smallest_odd, x)

        if smallest_odd == float('inf'):
            print(0)
        else:
            print(total - smallest_odd)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue().strip()

# provided sample
assert run("1\n1\n") == "1", "sample 1"

# all even values
assert run("4\n2 4 6 8\n") == "0", "all sums are even"

# total already odd
assert run("4\n1 2 4 8\n") == "15", "keep all flowers"

# remove smallest odd
assert run("3\n3 5 8\n") == "13", "must remove minimum odd"

# minimum size with even flower
assert run("1\n2\n") == "0", "single even flower"

# maximum size style case
assert run("5\n100 100 100 100 99\n") == "499", "large values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`4 / 2 4 6 8`|`0`| 不存在奇数子集 |
 |`4 / 1 2 4 8`|`15`| 当总数已经是奇数时保留所有花 |
 |`3 / 3 5 8`|`13`| 必须去掉最小的奇花|
 |`1 / 2`|`0`| 单连花边箱 |
 |`5 / 100 100 100 100 99`|`499`| 使用较大的值可以正常工作 |

 ## 边缘情况

 考虑输入：```
3
2 4 6
```该算法计算出的总和为 12。由于 12 是偶数，因此它会搜索最小的奇数花。 不存在，因为每个值都是偶数。 

变量`smallest_odd`永远不会从无穷大改变，因此算法打印 0。 

这是正确的，因为偶数的每个子集也有偶数和。 

现在考虑：```
3
3 5 8
```总和是16，是偶数。 该算法扫描数组并找到奇数花 3 和 5。最小值为 3。 

删除 3 会产生：```
16 - 3 = 13
```这是奇数且最大的。 

如果我们去掉 5 朵，答案就是 11 朵，所以选择最小的奇数花是至关重要的。 

最后，检查：```
4
1 2 4 8
```总和是15，已经是奇数了。 

该算法立即打印 15，而不删除任何内容。 

这避免了一个常见的错误，即即使奇偶校验已经正确，实现也会不必要地删除奇怪的花。
