---
title: "CF 409C - 巨著"
description: "该问题为我们提供了表示某些炼金成分数量的整数列表。 目标是确定这些量的最大公约数 (GCD)。 换句话说，我们想要找到最大的整数 $d$，使得每个给定的数字都可以被 $d$ 整除。"
date: "2026-06-07T01:55:34+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 409
codeforces_index: "C"
codeforces_contest_name: "April Fools Day Contest 2014"
rating: 1700
weight: 409
solve_time_s: 252
verified: true
draft: false
---

[CF 409C - 巨著](https://codeforces.com/problemset/problem/409/C)

 **评分：** 1700
 **标签：** *特别
 **求解时间：** 4m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题为我们提供了表示某些炼金成分数量的整数列表。 目标是确定这些量的最大公约数 (GCD)。 换句话说，我们要找到最大的整数$d$这样每个给定的数字都可以被整除$d$。 

输入数组最多可以有 100 个元素，每个元素的范围从 0 到 100。由于数字很小，即使是简单的算术运算也很快，但我们仍然必须小心零：数字和零的 GCD 是数字本身，因此忽略零可能会导致错误的答案。 

一个微妙的边缘情况是所有数字都为零。 在这种情况下，数学上 GCD 是未定义的，但在这个问题的上下文中，通常返回 0 或一致地处理它。 另一种情况是只有一个数字非零时：GCD 就是该数字。 天真地迭代和检查从 1 到最小数字的所有候选者的整除性是可行的，但速度不必要地慢，更重要的是，如果数字范围较大，则无法扩展。 

输出是一个整数，即所有输入值的 GCD。 这直接映射到您可以将所有数量均匀划分的最大“批量大小”。 

## 方法

 强力解决方案会迭代从 1 到输入数字最小值的每个整数，并检查它是否能整除所有元素。 这是有效的，因为如果一个数字整除所有元素，它必须不大于最小元素。 对于我们的输入大小，最小数量最多为 100，因此在这个问题中，这种方法是可行的。 但总的来说，如果数字可以达到$10^9$，迭代到最小值会太慢，给出$O(n \cdot \text{min}(a_i))$运营。 

更优雅解决方案的关键见解来自欧几里得算法：两个数字的 GCD$x$和$y$可以递归计算为$\gcd(y, x \% y)$。 这种方法速度很快，因为每个模运算都显着减小了问题的大小，并且复杂性是数字本身的对数。 将其扩展到多个数字很简单：数组的 GCD 只是$\gcd(\gcd(a_1, a_2), a_3, ..., a_n)$。 

蛮力方法之所以有效，是因为数字很小，但当数字变大时，它就会失败。 欧几里得方法将问题简化为一系列简单的操作，并保证对数时间，使其对更大的输入具有鲁棒性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * 分钟(a_i)) | O(1) | O(1) | 适用于小数量，对于大数量来说太慢 |
 | 欧几里得 GCD | O(n * log(max(a_i))) | O(n * log(max(a_i))) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 从输入中读取整数列表。 这些代表成分的数量。 
2. 初始化变量`current_gcd`与数组中的第一个数字。 这就是我们运行的 GCD。 
3. 迭代数组的其余部分。 对于每个数字，更新`current_gcd`成为以下的 GCD`current_gcd`和使用欧几里德算法的当前数字。 这确保了每个步骤之后，`current_gcd`除以迄今为止看到的所有数字。 
4. 迭代完成后，`current_gcd`是整个数组的 GCD。 打印该值。 

为什么有效：欧几里得算法保证$\gcd(x, y)$是能整除 x 和 y 的最大整数。 通过在所有数字上迭代应用它，不变量`current_gcd`除遇到的每个数字都被保留。 没有比这个运行 GCD 更大的数字可以整除所有元素，因此最终值是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from math import gcd
from functools import reduce

# read input and convert to integers
arr = list(map(int, input().split()))

# compute gcd of the entire array using reduce
result = reduce(gcd, arr)

print(result)
```我们使用`reduce`折叠`gcd`跨数组的函数。 使用`math.gcd`避免手动实现欧几里得算法并保证正确性。 将输入字符串转换为整数`map(int, ...)`处理输入中的任意间距。 像零这样的边缘情况会自动处理：`gcd(x, 0)`回报`x`。 

## 工作示例

 **示例输入 1：**```
2 4 6 8 10
```| 步骤| 当前_gcd | 下一个号码 | gcd(current_gcd, 下一个数字) |
 | --- | --- | --- | --- |
 | 初始| 2 | 4 | 2 |
 | 步骤 1 | 2 | 6 | 2 |
 | 步骤 2 | 2 | 8 | 2 |
 | 步骤 3 | 2 | 10 | 10 2 |

 输出：`2`此跟踪显示运行的 GCD 从未超过真实 GCD，并正确识别最大除数。 

**自定义输入：**```
5 10 15 20
```| 步骤| 当前_gcd | 下一个号码 | gcd(current_gcd, 下一个数字) |
 | --- | --- | --- | --- |
 | 初始| 5 | 10 | 10 5 |
 | 步骤 1 | 5 | 15 | 15 5 |
 | 步骤 2 | 5 | 20 | 20 5 |

 输出：`5`这表明当第一个元素是 GCD 时，算法立即稳定下来，确认了不变量。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * log(max(a_i))) | O(n * log(max(a_i))) | 每个 gcd 计算的数字大小都是对数，重复 n-1 次 |
 | 空间| O(n) | 我们存储整数数组 |

 输入约束$a_i \le 100$使得该算法在实践中速度极快。 内存占用极小，并且算法可以在 1 秒的限制下轻松运行。 

## 测试用例```python
import sys, io
from math import gcd
from functools import reduce

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    arr = list(map(int, input().split()))
    return str(reduce(gcd, arr))

# provided sample
assert run("2 4 6 8 10\n") == "2", "sample 1"

# single element
assert run("42\n") == "42", "single element"

# all zeros
assert run("0 0 0\n") == "0", "all zeros"

# mixed zeros
assert run("0 6 12 18\n") == "6", "zeros and non-zeros"

# all equal
assert run("7 7 7 7 7\n") == "7", "all equal numbers"

# prime numbers
assert run("3 5 7 11\n") == "1", "coprime numbers"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 42 | 42 42 | 42 单元素边缘情况 |
 | 0 0 0 | 0 0 0 0 | 正确处理所有零 |
 | 0 6 12 18 | 6 | 零不会破坏 GCD |
 | 7 7 7 7 7 | 7 7 7 7 7 7 | 相同的数字不会降低 GCD |
 | 3 5 7 11 | 3 5 7 11 1 | 互质数返回 1 |

 ## 边缘情况

 如果输入仅包含零，例如`0 0 0`,`reduce(gcd, arr)`正确返回0。如果输入是`[0, 6, 12]`，该算法将零视为中性元素，因为`gcd(x, 0) = x`，因此运行的 GCD 稳定在 6。对于单元素数组`[42]`，算法正确返回该数字。 

每个边缘情况都自然地由欧几里德算法和`reduce`方法，因此不需要额外的条件。
