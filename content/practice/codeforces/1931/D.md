---
title: "CF 1931D - 可分割的对"
description: "我们得到一个整数数组和两个数字，$x$ 和 $y$。 如果两个元素 $ai + aj$ 之和可被 $x$ 整除，且 $ai - aj$ 之差可被 $y$ 整除，则 $i < j$ 的一对索引 $(i, j)$ 被视为“美丽”。"
date: "2026-06-08T18:28:04+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1931
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 925 (Div. 3)"
rating: 1300
weight: 1931
solve_time_s: 210
verified: true
draft: false
---

[CF 1931D - 可整除的对](https://codeforces.com/problemset/problem/1931/D)

 **评分：** 1300
 **标签：** 组合数学、数学、数论
 **求解时间：** 3m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和两个数字，$x$和$y$。 一对索引$(i, j)$和$i < j$如果两个元素的总和被认为是“美丽的”$a_i + a_j$可以整除$x$和区别$a_i - a_j$可以整除$y$。 对于每个测试用例，我们需要计算存在多少个这样的对。 

正确解释这些约束非常重要。 每个数组最多可达$2 \cdot 10^5$元素，并且最多可以有$10^4$测试用例。 总和为$n$所有测试用例不超过$2 \cdot 10^5$，所以我们可以治疗$n$同样有效地$2 \cdot 10^5$每批次。 直接检查所有对的蛮力方法需要$O(n^2)$操作，可能大到$4 \cdot 10^{10}$对于 2 秒的限制来说太慢了。 我们需要一个线性或近线性扩展的解决方案$n$。 

可能打破简单解决方案的边缘情况是当所有数字都相等或当$x$或者$y$简单地划分差异。 例如，如果$x = y = 1$，每一双都很漂亮。 粗心的实现可能会在不考虑负数的情况下尝试模运算，从而导致微妙的偏差或符号错误。 

## 方法

 天真的方法迭代每一对$(i, j)$并检查两个整除条件。 这是正确的，因为它直接实现了问题陈述，但它需要$O(n^2)$检查。 为了$n \approx 2 \cdot 10^5$，这将大致产生$2 \cdot 10^10$迭代次数，远远超出了可行的计算极限。 

优化的关键见解来自于查看模数的同余条件$x$和$y$。 让$a_i + a_j \equiv 0 \pmod{x}$和$a_i - a_j \equiv 0 \pmod{y}$。 我们可以同时解决这两个同余问题。 将它们相加和相减表明$2a_i \equiv 0 \pmod{\text{lcm}(x, y)}$和$2a_j \equiv 0 \pmod{\text{lcm}(x, y)}$直到一些班次。 具体来说，我们可以将问题转化为计算之前有多少个数字$a_j$满足相对于当前数字的线性同余$a_i$，这可以通过残差对派生模进行取模的哈希图（字典）来完成。 这将数组长度上的配对检查从二次减少为线性。 

这里的故事是，和与差条件一开始看起来很复杂，但是通过用模算术重新表述它们，它们就变成了计算匹配残数的问题。 使用字典来存储每个残基的频率允许我们在迭代数组一次时增量地计算美丽的对。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了 |
 | 模块化哈希图 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算最大公约数 (gcd)$x$和$y$，这将有助于将两个同余减少到一个模数。 让$g = \gcd(x, y)$。 
2. 从左到右迭代数组。 对于每个元素$a_i$，计算两个值：$r_i = a_i \bmod x$和$s_i = a_i \bmod y$。 这些表示当前元素相对于$x$和$y$。 
3. 构造组合残差键$(r_i, s_i)$并存储每个这样的键出现次数的频率图。 这允许检查有多少先前的元素满足与形成漂亮对所需的模块化条件$a_i$。 
4. 对于每个元素$a_i$，计算相应的互补残基$(r_j, s_j)$这将使这对$(a_j, a_i)$美丽，使用从同余推导出来的公式。 将地图中该键的频率添加到答案中。 
5、后处理$a_i$，在频率图中增加其键，以便将来的元素可以与其形成对。 

工作原理：在每一步，映射都会存储所有先前看到的元素的计数，这些元素按其残基模分组$x$和$y$。 每次遇到新元素时，我们都会准确计算它可以与哪些残基配对以满足和差条件。 因为我们只迭代一次，并且映射会跟踪所有相关的先前元素，所以我们对每个有效对精确计数一次，而不检查冗余对。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict
from math import gcd

def count_beautiful_pairs(n, x, y, a):
    freq = defaultdict(int)
    ans = 0
    g = gcd(x, y)
    lcm = x * y // g
    
    for val in a:
        # target residues for previous elements
        target = ((-val) % x, (val) % y)
        ans += freq[target]
        # current residue key
        key = (val % x, val % y)
        freq[key] += 1
    return ans

t = int(input())
for _ in range(t):
    n, x, y = map(int, input().split())
    a = list(map(int, input().split()))
    print(count_beautiful_pairs(n, x, y, a))
```该解决方案构建了一个由模数残基对键控的频率字典$x$和$y$。 对于每个元素，我们计算满足与先前元素的和和差约束的残差。 计数后增加频率可确保不会重复计算任何对。 使用`%`确保正确处理负数，这很微妙，因为 Python 的模运算符总是返回非负结果。 

## 工作示例

 获取输入`6 5 2; 1 2 7 4 9 6`。 遍历数组：

 | 我| 一个[我] | 值%x | val%y | 目标| 频率图| 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | 1 | (4,1) | {} | 0 |
 | 1 | 2 | 2 | 0 | (3,0) | {(1,1):1} | 0 |
 | 2 | 7 | 2 | 1 | (3,1) | {(1,1):1,(2,0):1} | 0 |
 | 3 | 4 | 4 | 0 | (1,0)| ... | 0 |
 | 4 | 9 | 4 | 1 | (1,1) | ... | 1 |
 | 5 | 6 | 1 | 0 | (4,0) | ... | 1 |

 最终答案是 2。此表显示，只有当目标键存在于频率映射中时，计数才会递增，从而确认模块化映射准确捕获有效对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个元素被处理一次，字典操作是 O(1) 摊销 |
 | 空间| O(n) | 频率字典最多可存储 n 个不同的残基对 |

 和$n$最多$2 \cdot 10^5$并且每个测试用例都是线性通过，该解决方案可以在 2 秒内轻松运行。 

## 测试用例```python
import io, sys

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    exec(open("solution.py").read())
    return output.getvalue().strip()

# provided samples
assert run("7\n6 5 2\n1 2 7 4 9 6\n7 9 5\n1 10 15 3 8 12 15\n9 4 10\n14 10 2 2 11 11 13 5 6\n9 5 6\n10 7 6 7 9 7 7 10 10\n9 6 2\n4 9 7 1 2 2 13 3 15\n9 2 3\n14 6 1 15 12 15 8 2 15\n10 5 7\n13 3 3 2 12 11 3 7 13 14") == "2\n0\n1\n3\n5\n7\n0"

# minimum input
assert run("1\n2 1 1\n1 1") == "1"

# all equal
assert run("1\n5 2 3\n6 6 6 6 6") == "10"

# no valid pairs
assert run("1\n3 7 5\n1 2 3") == "0"

# large numbers
assert run("1\n3 1000000000 999999
```
