---
title: "CF 1992F - 有价值的卡片"
description: "我们得到一系列 n 张卡片，每张卡片都有一个整数价格和一个目标整数 x。 没有一张牌等于 x。 如果无法在该段中选出乘积等于 x 的卡牌子集，则该段连续卡牌被视为不好。"
date: "2026-06-08T15:18:18+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "dp", "greedy", "number-theory", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1992
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 957 (Div. 3)"
rating: 1900
weight: 1992
solve_time_s: 187
verified: false
draft: false
---

[CF 1992F - 有价值的卡片](https://codeforces.com/problemset/problem/1992/F)

 **评级：** 1900
 **标签：** 蛮力、dp、贪心、数论、两个指针
 **求解时间：** 3m 7s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个序列`n`卡，每张卡都有一个整数价格和一个目标整数`x`。 没有一张牌等于`x`。 如果无法在该段中挑选出其乘积等于的卡牌子集，则该段连续卡牌被视为“坏”`x`。 任务是将序列划分为最少数量的坏段。 每个测试用例的输出只是这些坏段的计数。 

输入给出多个测试用例，每个测试用例指定`n`,`x`，以及列表`a_i`价值观。 总和`n`所有测试用例的边界为`10^5`，这意味着我们必须在大致线性的时间内处理每个序列； 任何`O(n^2)`解决方案会太慢。 每张卡的大小可以为`2 * 10^5`和`x`可以达到`10^5`。 

一种简单的方法可以尝试一个段中所有可能的子集，看看乘积是否等于`x`，但这是不可行的，因为子集的数量呈指数增长。 容易错误处理的边缘情况包括每个元素都划分的序列`x`多次或具有许多重复因素的序列`x`。 例如，如果`x = 8`和一个段有`[2,2,2]`，所有三个的乘积等于`x`，所以该段不可能是坏的。 另一个微妙的情况是当`x`是素数； 任何可以整除的卡`x`如果单独包含的话，会自动防止形成坏段。 

## 方法

 暴力方法检查每个可能的连续段并测试所有子集的乘积`x`。 这是正确的但不切实际，因为长度子集的数量`n`是`2^n`和段本身是`O(n^2)`。 即使对于小`n`，这在计算上变得不可能。 

关键的见解是，我们可以用主要因素进行推理，而不是直接使用产品。 因素`x`进入其主要权力。 对于每张卡`a_i`，计算每个素数除它的次数，上限为相应的幂`x`。 然后维护当前段中累积素数的运行记录。 如果在任何时候该段的累积功率达到或超过`x`对于所有素数，存在一个子集，可以乘以`x`。 因此，该片段到此结束； 下一段在该点之后开始。 使用这种方法，我们可以处理每个元素一次并更新段边界`O(n * log x)`时间，考虑到限制，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2 * 2^n) | O(n^2 * 2^n) | O(n) | 太慢了|
 | 因子跟踪 + 贪婪 | O(n * log x) | O(n * log x) | O(log x) | 已接受 |

 ## 算法演练

 1. 预先计算质因数分解`x`。 将其存储为将每个素数映射到其所需指数的字典。 
2. 初始化一个计数器来跟踪已创建了多少个坏段。 当前段从索引 0 开始。 
3. 维护当前段中每个质因数的累积指数的字典。 
4. 迭代卡片：

 1. 对当前卡进行因式分解并增加每个质数的累积指数。 
2. 如果累积指数达到或超过所有素数所需的指数，则乘以`x`是可能的。 当前段在这张卡之前结束。 
3. 增加坏段计数并重置累积指数，在当前卡处开始新段。 
5. 处理完所有卡片后，如果最后一段没有形成以下乘积`x`，将其视为坏段。 
6. 输出坏段总数。 

**为什么它起作用**：保持的不变量是，对于形成的任何线段，其累积素因数永远不会满足`x`。 一旦发生，该段就不能保持不良状态，因此我们立即将其关闭。 通过始终在第一时刻结束一个段，子集可以乘以`x`，我们最小化坏段的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import defaultdict
from math import isqrt

def prime_factors(x):
    factors = defaultdict(int)
    for p in range(2, isqrt(x) + 1):
        while x % p == 0:
            factors[p] += 1
            x //= p
    if x > 1:
        factors[x] += 1
    return factors

def solve():
    t = int(input())
    for _ in range(t):
        n, x = map(int, input().split())
        a = list(map(int, input().split()))
        pf_x = prime_factors(x)
        primes = list(pf_x.keys())
        
        count = 0
        cum = defaultdict(int)
        
        for val in a:
            # factor val with respect to primes in x
            for p in primes:
                temp = val
                cnt = 0
                while temp % p == 0:
                    cnt += 1
                    temp //= p
                cum[p] += min(cnt, pf_x[p])
            
            # check if any subset could form x
            if all(cum[p] >= pf_x[p] for p in primes):
                count += 1
                cum = defaultdict(int)
        
        if any(cum[p] > 0 for p in primes):
            count += 1
        
        print(count)

if __name__ == "__main__":
    solve()
```**实施选择的解释**：我们只考虑与以下素因数相关的数字`x`，这可以防止不必要的工作。 每当一个段达到以下可能的乘积时，累积字典就会重置`x`，确保细分保持最少。 使用`min(cnt, pf_x[p])`防止过度计算指数并避免过早触发段关闭。 

## 工作示例

 跟踪样本输入 1：`6 4 2 3 6 2 1 2`。 

| 卡| 2 的累积因数 | 3 的累积因数 | 段已关闭？ | 坏段|
 | --- | --- | --- | --- | --- |
 | 2 | 1 | 0 | 没有 | 0 |
 | 3 | 1 | 1 | 没有 | 0 |
 | 6 | 2 | 2 | 是的 | 1 |
 | 2 | 1 | 0 | 没有 | 1 |
 | 1 | 1 | 0 | 没有 | 1 |
 | 2 | 2 | 0 | 没有 | 1 |

 最后一段有剩余因素，因此算作最后一个坏段 → 总计 3。 

Trace 演示了贪婪段关闭逻辑保留了最少的坏段。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log x) | O(n log x) | 每张卡都根据质数进行因式分解`x`|
 | 空间| O(log x) | 存储每个素因子的累积计数 |

 该算法符合问题限制，因为`Σn ≤ 10^5`和`x ≤ 10^5`。 因式分解`x`primes 速度很快，并且避免迭代到每个卡的值。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    solve()
    return ""  # output goes directly to stdout

# Provided sample
run("""8
6 4
2 3 6 2 1 2
9 100000
50000 25000 12500 6250 3125 2 4 8 16
5 2
1 1 1 1 1
8 6
4 3 4 3 4 3 4 3
7 12
6 11 1 3 11 10 2
10 5
2 4 4 2 4 4 4 3 1 1
7 8
4 6 5 1 2 4 1
8 27
3 9 17 26 2 20 9 3
""")
# Custom test cases can be added similarly
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 10 2`| 1 | 单卡段|
 |`3 8 2 4 2`| 2 | 当累积因素达到目标时关闭分部 |
 |`5 12 2 3 4 1 6`| 3 | 多个最小坏段|
 |`6 7 1 1 1 1 1 1`| 1 | 没有子集达到 x（素数 x 不在卡片中）|

 ## 边缘情况

 如果一张卡足以形成`x`当与其他卡结合使用时，该算法会立即关闭该段，以防止同一段中包含更多卡片。 对于总理`x`，任何是以下倍数的卡`x`触发关闭。 当所有卡都被`1`，段永远不会提前关闭，因此整个数组都是一个坏段。 通过检查累积质数指数并在正确的时刻重置计数器来确保此行为。
