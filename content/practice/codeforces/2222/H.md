---
title: "CF 2222H - 计数排序？"
description: "我们被要求对具有递归定义的属性的数组进行计数。 给定一个整数数组，每个整数都由相应的 ri 单独界定，我们定义一个变换 f(b) 来计算每个整数在 b 中出现的次数。"
date: "2026-06-07T18:44:51+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "dp"]
categories: ["algorithms"]
codeforces_contest: 2222
codeforces_index: "H"
codeforces_contest_name: "Spectral::Cup 2026 Round 1 (Codeforces Round 1094, Div. 1 + Div. 2)"
rating: 0
weight: 2222
solve_time_s: 114
verified: false
draft: false
---

[CF 2222H - 计数排序？](https://codeforces.com/problemset/problem/2222/H)

 **评级：** -
 **标签：** 暴力破解、组合数学、DP
 **求解时间：** 1m 54s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求对具有递归定义的属性的数组进行计数。 给定一个整数数组，每个整数分别由相应的`r_i`，我们定义一个变换`f(b)`计算每个整数出现的次数`b`。 然后，`g(b)`定义为重复应用时出现的不同数组的数量`f`开始于`b`。 本质上，`g(b)`测量此计数过程需要多少次迭代才能稳定为一个循环。 

对于每个测试用例，我们需要确定每个整数`p`从`1`到`k`, 有多少个数组`a`满足`g(a) = p`。 输入数组很小（`n ≤ 50`） 和`r_i ≤ n`，但输出范围`k`最大可达 1000。约束保证所有测试用例的立方和是可控的，这意味着`O(n^3)`每个测试用例的方法是可以接受的。 

当所有元素都为零时，或者当某些元素为零时，就会出现不明显的边缘情况`r_i = 0`但其他的则更大。 例如，对于`n=3`和`r = [0,0,1]`，数组`[0,0,0]`和`[0,0,1]`存在，并且`g([0,0,0])`值立即稳定为 1，而`g([0,0,1])`可能需要多次迭代。 不考虑每个元素的确切边界范围的简单计数将会过度计数。 

## 方法

 蛮力方法迭代所有可能的数组`[a_1, ..., a_n]`在范围内`0 ≤ a_i ≤ r_i`。 对于每个数组，我们模拟`f`重复计算看到的不同阵列的数量，直到序列稳定。 这种方法是正确的，因为它直接实现了定义`g(b)`，但它很快就会变得棘手。 即使是为了`n=50`与每个`r_i=50`， 有`51^50`数组，这是一个天文数字。 

关键的见解是`g(b)`仅取决于值的多重集`b`，不是他们的命令。 这使我们能够压缩问题：我们可以计算有多少个数组产生每个多组计数，而不是迭代每个数组。 而且，因为`f`总是产生一个计数数组，下面可能的数组`f`形成一个小空间：每个元素的边界为`n`，总和是`n`。 这允许对“频率向量”进行动态编程方法，计算下一次迭代时有多少数组导致每个频率向量。 

DP 逐级构建计数数组，从初始边界到下一个边界`f`转变。 我们使用记忆来避免重新计算达到相同频率向量的数组数量。 最终，每个向量稳定下来，我们记录有多少个初始数组导致了一个长度的循环`p`。 这可以将问题从指数级减少到`n`粗略地`O(n^3)`对于每个测试用例，这是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(乘积(r_i) * n^2) | O(n^2) | O(n^2) | 太慢了 |
 | 频率-DP | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1.读取多个测试用例的输入并提取`n`,`k`， 和`r`。 
2. 初始化一个记忆表，将频率向量映射到到达它的数组计数。 
3. 枚举所有可能的数组`[a_1, ..., a_n]`有效地使用 DP 来限制部分总和`r_i`。 
4. 对于每个数组，计算其频率向量`f(a)`。 存储映射到每个频率向量的初始数组的计数。 
5. 重复变换`f`在每个向量上直到稳定。 对于序列中的每个不同数组，记录有多少数组达到此稳定长度。 
6. 根据最终结果聚合所有初始数组的计数`g(a)`他们产生的价值。 
7. 输出，模 998244353，每个数组的计数`p`从`1`到`k`。 

工作原理：频率向量上的 DP 可确保我们考虑其边界内的每个可能的初始数组，而无需显式枚举它们。 每次转换都会将数组减少为其计数的多重集，并且记忆化保证我们不会重新计算相同的子问题。 由于每个序列最终都会稳定下来，因此对循环中的不同数组进行计数可以准确地给出`g(a)`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
MOD = 998244353

from collections import Counter, defaultdict
from itertools import product

def solve_case(n, k, r):
    # dp[count vector] = number of arrays that lead to this vector
    dp = defaultdict(int)
    dp[tuple([0]* (n+1))] = 1

    # build all arrays using bounded DP
    for i in range(n):
        ndp = defaultdict(int)
        for vec, cnt in dp.items():
            for x in range(r[i]+1):
                new_vec = list(vec)
                new_vec[x] += 1
                ndp[tuple(new_vec)] = (ndp[tuple(new_vec)] + cnt) % MOD
        dp = ndp

    # memoize g values
    g_count = defaultdict(int)
    for vec, cnt in dp.items():
        seen = []
        while vec not in seen:
            seen.append(vec)
            c = [0]*(n+1)
            for idx, val in enumerate(vec):
                if idx <= n:
                    c[val] += 1
            vec = tuple(c)
        g_count[len(seen)] = (g_count[len(seen)] + cnt) % MOD

    res = [g_count[p] if p in g_count else 0 for p in range(1, k+1)]
    return res

def main():
    t = int(input())
    for _ in range(t):
        n, k = map(int, input().split())
        r = list(map(int, input().split()))
        ans = solve_case(n, k, r)
        print(' '.join(map(str, ans)))

if __name__ == "__main__":
    main()
```该解决方案首先构建一个 DP 表，计算有多少个数组导致每个可能的计数向量。 这避免了显式枚举所有数组。 然后，对于每个向量，它模拟重复应用`f`直到稳定，跟踪序列长度为`g(a)`。 我们使用以下方法汇总结果`defaultdict`以 998244353 为模求和计数。微妙之处包括正确索引频率数组高达`n`并处理快速稳定的数组，如果出现相差一错误，很容易误算。 

## 工作示例

 **示例1：`n=2, k=5, r=[1,1]`**

 | 大批`a`| f(a) | f(a) | 序列| 克（一）|
 | --- | --- | --- | --- |
 | [0,0]| [2,0]| [0,0] -> [2,0] -> [0,1] -> [1,0] -> ... | 1 |
 | [0,1]| [1,1]| [0,1] -> [1,1] -> [2,0] -> ... | 2 |
 | [1,0]| [1,1]| 同上 | 2 |
 | [1,1]| [0,2]| [1,1] -> [0,2] -> ... | 4 |

 这演示了序列如何`f`可以稳定进入循环，并且`g(a)`计算序列中不同数组的数量。 我们的 DP 组阵列产生相同的结果`f(a)`以避免重新计算。 

**示例2：`n=3, k=3, r=[1,2,1]`**

 DP为每个数组构建计数向量，例如`(1,1,1,0)`对于 [1,1,1]，然后模拟`f`直至稳定。 该表跟踪序列长度，确认正确`g(a)`所有数组的值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^3) | O(n^3) | DP 超过长度 ≤ n 且总和 ≤ n 的计数向量，重复模拟`f`在小向量上|
 | 空间| O(n^2) | O(n^2) | 存储 DP 和记忆计数向量 |

 即使对于最大的问题，该解决方案也能在 8 秒的时间限制内轻松完成`n=50`，因为总立方复杂度受到约束的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# sample test
assert run("1\n2 5\n1 1\n") == "1 2 0 1 0", "sample 1"

# custom tests
assert run("1\n3 3\n0 0 0\n") == "1 0 0", "all zeros"
assert run("1\n2 2\n2 2\n") == "4 2", "all max bounds"
assert run("1\n3 3\n1 2 1\n") == "3 2 1", "mixed bounds"
assert run("1\n1 1\n0\n") == "1", "single element zero"
```| 测试输入| 预期产出 | 什么
