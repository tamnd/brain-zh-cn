---
title: "CF 75C - 改进型 GCD"
description: "我们给出两个正整数，然后进行许多范围查询。 对于每个查询 [low, high]，我们必须找到该区间内能除以这两个数字的最大整数。 第一个观察结果是我们并没有真正独立地处理 a 和 b。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 75
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 67 (Div. 2)"
rating: 1600
weight: 75
solve_time_s: 100
verified: true
draft: false
---

[CF 75C - 修改后的 GCD](https://codeforces.com/problemset/problem/75/C)

 **评分：** 1600
 **标签：** 二分查找，数论
 **求解时间：** 1m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出两个正整数，然后进行许多范围查询。 对于每个查询`[low, high]`，我们必须找到该区间内能整除这两个数字的最大整数。 

第一个观察结果是我们并没有真正与`a`和`b`独立。 任何能整除两者的数也必须整除`gcd(a, b)`。 一旦我们计算出两个数字的最大公约数，每个有效答案就成为它的除数之一。 

输入大小强烈暗示必须快速回答查询。 数字本身可以达到`10^9`，这使得不可能遍历查询范围中的每个整数。 单个查询间隔可能包含十亿个数字。 高达`10^4`查询，甚至是`O(high - low)`每个查询的方法将是灾难性的。 

同时，`10^9`足够小，可以枚举一个数的约数。 一个数字最多`10^9`最多有几千个约数。 通过检查小于等于的整数来查找所有除数`sqrt(g)`足够快因为`sqrt(10^9)`大致是`31623`。 

棘手的部分是正确处理范围条件。 我们不想要 gcd 的任何除数。 我们想要里面最大的除数`[low, high]`。 

有几种边缘情况可以悄悄地破坏不正确的实现。 

认为：```
a = 12
b = 18
query = [7, 11]
```最大公约数是`6`，其约数是`{1, 2, 3, 6}`。 没有一个位于区间内，所以答案是`-1`。 一个粗心的实现，只向下搜索`high`不仔细检查整除性可能会意外返回`6`，即使它超出了范围。 

当答案等于下限时，会出现另一种微妙的情况：```
a = 100
b = 50
query = [25, 30]
```公约数是`{1, 2, 5, 10, 25, 50}`。 正确答案是`25`。 如果二分查找边界处理不正确，很容易跳过精确匹配并返回`-1`。 

生成除数时也需要注意完全平方数。```
gcd = 36
```迭代时`i = 6`， 两个都`i`和`gcd // i`是同一个除数。 盲目添加两个重复项`6`。 如果稍后对重复项进行排序，该算法仍然有效，但不必要的重复会使推理变得复杂并浪费时间。 

最后，考虑 gcd 本身何时在范围内：```
a = 9
b = 27
query = [9, 11]
```答案是立即`9`。 一些不正确的解决方案搜索严格小于`high`，它错过了这个精确边界的情况。 

## 方法

 最直接的方法是独立处理每个查询。 对于查询`[low, high]`，我们可以从`high`到`low`并检查每个数字是否整除两者`a`和`b`。 

这是可行的，因为遇到的第一个有效数字自动是区间中最大的有效除数。 

问题是运行时间。 在最坏的情况下，查询范围可能包含几乎`10^9`数字。 和`10^4`查询，这变得完全不可能。 

关键的观察是每个公约数`a`和`b`必须划分`g = gcd(a, b)`。 

我们可以预先计算所有除数，而不是搜索区间本身`g`。 这将问题从：

 “在能整除这两个数的范围内找到一个整数”

 至：

 “求最大除数`g`范围之内。”

 那要小得多。 一个数字最多`10^9`与其大小相比，约数很少。 我们可以生成所有除数`O(sqrt(g))`，对它们排序一次，然后使用二分搜索回答每个查询。 

对于查询`[low, high]`，我们二分查找最大除数`<= high`。 如果该除数至少仍然是`low`，这就是答案。 否则不存在有效除数。 

蛮力之所以有效，是因为检查整除性简单且正确，但它会失败，因为它搜索的数字范围很大。 基于除数的解决方案之所以成功，是因为可能的答案集很小，并且在所有查询中都是固定的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n × 范围大小) | O(1) | O(1) | 太慢了 |
 | 最佳| O(sqrt(g) + n log d) | O(d) | 已接受 |

 这里，`g = gcd(a, b)`和`d`是的约数`g`。 

## 算法演练

 1. 读取整数`a`和`b`。 
2. 计算`g = gcd(a, b)`。 

的每个公约数`a`和`b`必须划分`g`，所以所有有效答案都来自于除数`g`。 
3. 生成 的所有约数`g`。 

迭代自`1`到`sqrt(g)`。 每当`i`划分`g`， 两个都`i`和`g // i`是除数。 
4. 避免重复插入`i * i == g`。 

完全平方产生相同的除数两次，所以我们只插入一次。 
5. 对除数列表进行排序。 

二分查找需要排序。 
6. 对于每个查询`[low, high]`，二分查找最大除数`<= high`。 

在Python中，`bisect_right(divs, high) - 1`给出不超过的最大除数的索引`high`。 
7.检查这个除数是否至少仍然是`low`。 

如果是，请打印出来。 否则打印`-1`。 

### 为什么它有效

 该算法依赖于一个属性：

 一个数字可以整除两者`a`和`b`当且仅当它可除`gcd(a, b)`。 

这意味着可能答案的完整集合恰好是除数集`g`。 通过对这些除数进行排序，二分查找总能找到不超过的最大除数`high`。 如果该值也至少是`low`，它位于所需的区间内，并且是最大可能的有效答案。 如果它小于`low`，那么每个较早的除数都更小，因此区间中不存在有效的除数。 

## Python 解决方案```python
import sys
from math import gcd, isqrt
from bisect import bisect_right

input = sys.stdin.readline

def solve():
    a, b = map(int, input().split())

    g = gcd(a, b)

    divisors = []

    for i in range(1, isqrt(g) + 1):
        if g % i == 0:
            divisors.append(i)

            other = g // i
            if other != i:
                divisors.append(other)

    divisors.sort()

    q = int(input())

    for _ in range(q):
        low, high = map(int, input().split())

        idx = bisect_right(divisors, high) - 1

        if idx >= 0 and divisors[idx] >= low:
            print(divisors[idx])
        else:
            print(-1)

solve()
```该解决方案首先将原始问题分解为 gcd 问题。 一次`g = gcd(a, b)`计算出来后，每个有效答案都必须来自它的除数。 

除数生成循环仅运行至`sqrt(g)`。 每当`i`划分`g`，我们立即知道`g // i`也是一个除数。 这种配对生成技巧将复杂性从线性时间降低到平方根时间。 

条件：```
if other != i:
```正确处理完全平方数。 Without it, divisors like`6`在`36`将被插入两次。 

After sorting the divisor list, each query becomes a binary search problem.`bisect_right(divisors, high)`返回所有值之后的插入位置`<= high`。 减一给出最大有效候选者的索引。 

边界检查：```
divisors[idx] >= low
```是必不可少的。 二分查找仅保证除数最多为`high`。 我们仍然必须确认它位于区间内。 

实现使用`isqrt`而不是浮点平方根。 整数平方根避免了精度问题并且对于除数枚举来说更干净。 

## 工作示例

 ### 示例 1

 输入：```
9 27
3
1 5
10 11
9 11
```最大公约数为：```
gcd(9, 27) = 9
```的除数`9`：```
[1, 3, 9]
```| 查询 | 最大除数 ≤ 高 | 候选人 | 有效的？ | 回答 |
 | --- | --- | --- | --- | --- |
 | [1, 5] | 3 | 3 | 3 ≥ 1 | 3 ≥ 1 3 |
 | [10, 11] | 9 | 9 | 9 < 10 | 9 < 10 -1 |
 | [9, 11] | 9 | 9 | 9 ≥ 9 | 9 ≥ 9 9 |

 此示例演示了核心二分搜索逻辑。 第二个查询显示了为什么我们仍然必须比较`low`找到不超过的最大除数后`high`。 

### 示例 2

 输入：```
100 80
4
1 2
5 15
16 25
41 50
```最大公约数为：```
gcd(100, 80) = 20
```的除数`20`：```
[1, 2, 4, 5, 10, 20]
```| 查询 | 最大除数 ≤ 高 | 候选人 | 有效的？ | 回答 |
 | --- | --- | --- | --- | --- |
 | [1, 2] | 2 | 2 | 2 ≥ 1 | 2 |
 | [5, 15] | 10 | 10 10 | 10 10 ≥ 5 | 10 ≥ 5 10 | 10
 | [16, 25] | 20 | 20 | 20 ≥ 16 | 20 |
 | [41, 50] | 20 | 20 | 20 < 41 | 20 < 41 -1 |

 该跟踪表明该算法从不扫描间隔本身。 即使对于大范围，它也只在 gcd 的约数中搜索。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(sqrt(g) + n log d) |`sqrt(g)`生成除数，每个查询进行二分搜索 |
 | 空间| O(d) | 存储 gcd 的所有除数 |

 这里`g = gcd(a, b)`和`d`是的约数`g`。 

最大平方根约为`31623`，这对于 2 秒的限制来说很小。 除数计数也很小，因此每个查询在一个非常短的数组上以对数时间完成。 该解决方案可以轻松满足时间和内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import gcd, isqrt
from bisect import bisect_right

def solve():
    input = sys.stdin.readline

    a, b = map(int, input().split())

    g = gcd(a, b)

    divisors = []

    for i in range(1, isqrt(g) + 1):
        if g % i == 0:
            divisors.append(i)

            other = g // i
            if other != i:
                divisors.append(other)

    divisors.sort()

    q = int(input())

    out = []

    for _ in range(q):
        low, high = map(int, input().split())

        idx = bisect_right(divisors, high) - 1

        if idx >= 0 and divisors[idx] >= low:
            out.append(str(divisors[idx]))
        else:
            out.append("-1")

    print("\n".join(out))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue()

# provided sample
assert run(
"""9 27
3
1 5
10 11
9 11
"""
) == "3\n-1\n9\n", "sample 1"

# minimum-size input
assert run(
"""1 1
1
1 1
"""
) == "1\n", "minimum case"

# no divisor in range
assert run(
"""12 18
1
7 11
"""
) == "-1\n", "no valid divisor"

# exact lower-bound answer
assert run(
"""100 50
1
25 30
"""
) == "25\n", "boundary inclusion"

# perfect square gcd
assert run(
"""36 72
2
6 6
7 8
"""
) == "6\n-1\n", "perfect square divisor handling"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`带查询`[1,1]`|`1`| 最小约束 |
 |`12 18`带查询`[7,11]`|`-1`| | 范围内不存在除数
 |`100 50`带查询`[25,30]`|`25`| 包含下边界 |
 |`36 72`有疑问`[6,6]`和`[7,8]`|`6`,`-1`| 完美的正方形处理和缺失间隔|

 ## 边缘情况

 考虑没有除数位于区间内的情况：```
12 18
1
7 11
```最大公约数是`6`，其约数是`[1, 2, 3, 6]`。 

二分查找最大除数`<= 11`回报`6`。 然后该算法检查是否`6 >= 7`。 失败了，所以输出变成`-1`。 

这种额外的边界检查可防止返回请求间隔之外的除数。 

现在考虑一个精确边界答案：```
100 50
1
25 30
```最大公约数是`50`，其约数是`[1, 2, 5, 10, 25, 50]`。 

二分查找最大除数`<= 30`回报`25`。 自从`25 >= 25`，算法输出`25`。 

这证实了两端都包含间隔。 

最后，考虑完美平方 gcd：```
36 72
1
6 6
```最大公约数是`36`。 

在除数生成过程中，当`i = 6`， 两个都`i`和`36 // 6`平等的`6`。 该实现仅将其插入一次，因为：```
if other != i:
```除数列表仍然正确：```
[1, 2, 3, 4, 6, 9, 12, 18, 36]
```二分查找然后正确找到`6`对于间隔`[6, 6]`。
