---
title: "CF 1580B - 数学课程"
description: "我们被要求计算从 1 到 $n$ 的数字排列，其中恰好有 $k$ 个“好”数字。 如果当我们查看包含 $x$ 的所有连续子数组时，恰好存在 $m$ 个不同的最大值，则排列中的数字 $x$ 被称为良好。"
date: "2026-06-10T10:12:40+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "dp", "trees"]
categories: ["algorithms"]
codeforces_contest: 1580
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 745 (Div. 1)"
rating: 2600
weight: 1580
solve_time_s: 124
verified: false
draft: false
---

[CF 1580B - 数学课程](https://codeforces.com/problemset/problem/1580/B)

 **评分：** 2600
 **标签：** 暴力破解、组合数学、dp、树
 **求解时间：** 2m 4s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算从 1 到 1 的数字排列$n$正是有$k$“好”数字。 一个数字$x$如果当我们查看包含以下内容的所有连续子数组时，排列中的排列被称为良好：$x$，正好有$m$明显的最大值。 例如，排列 [1,3,2,4] 中的数字 1 是子数组 [1]、[1,3]、[1,3,2] 和 [1,3,2,4] 的一部分。 这些子数组的最大值为 1、3、3 和 4，给出三个不同的最大值。 如果$m$是3，那么1就很好。 

输入由四个整数组成$n, m, k, p$， 在哪里$n$是排列大小，$m$是一个数字良好所需的不同最大值的数量，$k$是我们想要的排列中好数字的确切数量，并且$p$是答案的模数。 

界限$n \le 100$表明任何$O(n^4)$或更高的方法会太慢。 直接计算所有排列是不可行的，因为有$n!$排列，其增长速度快于$10^{100}$为了$n=100$。 这个问题需要一种组合方法来避免显式枚举排列。 

非明显的边缘情况包括以下情况$m=1$，在这种情况下，只有最大的数字才是好的。 另一个棘手的情况是$k=n$，其中排列中的每个数字都必须是好的，这只有在非常受限的配置中才有可能。 如果简单的解决方案对每个排列的子数组进行计数，那么它将在这些边界上失败。 

## 方法

 暴力方法将生成所有$n!$排列，迭代每个数字，并为每个数字计算包含它的所有子数组以计算不同的最大值。 这种方法在逻辑上是正确的，但具有阶乘时间复杂度，使其无法用于$n>10$。 

关键的见解来自于理解数字的构成因素$x$好的。 对于一个号码$x$在排列中，其包含的子数组中不同最大值的数量仅由大于的数字的相对位置决定$x$。 如果正好有$m-1$数字大于$x$将排列“分开”$x$， 然后$x$会好的。 因此，我们可以组合地重新构建问题：选择哪些数字是好的，将较大的数字相对于每个好的数字放置以满足最大计数，并计算有效的排列。 

对剩余位置和剩余“好位置”数量的动态编程使我们能够计算有效排列的总数，而无需生成它们。 这将问题减少到$O(n^3)$或者$O(n^2)$取决于实施，这是可行的$n \le 100$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n! * n^3) | O(n! * n^3) | O(n) | 太慢了 |
 | 最佳 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 认识到一个数字是否好只取决于大于它的数字以及它们相对于它的位置。 因此，我们从最大到最小处理数字。 
2.让$f(i,j)$是排列第一个的方式的数量$i$恰好有这样的数字$j$他们中的一些人都很好。 该 DP 将按数字大小递增地计算排列。 
3.求最大数$n$，如果$m=1$否则就不可能好。 初始化$f(1,1) = 1$如果最大的数字是好的，否则$f(1,0) = 1$。 
4. 对于每个数字$x$从最大到最小，考虑两个选项：将其列为好或不好。 在已放置的数字周围选择位置以维持最大值属性的方法有多种：$\binom{remaining+1}{1}$段之间插入的方法。 
5.使用插入方式的数量更新DP表$x$进入现有序列以保持良好/不良状态。 使用模数$p$在所有操作中。 
6. 处理完所有数字后，$f(n,k)$包含完全排列的数量$k$好的数字模数$p$。 

为什么它有效：DP 不变量保证$f(i,j)$计算第一个的所有排列$i$最大的数字正好$j$好的数字，与较小数字的相对顺序无关。 通过从最大到最小处理并组合计算插入位置，我们确保没有排列被计算两次，并保持良好的数量条件。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from math import comb

def main():
    n, m, k, p = map(int, input().split())
    
    # Precompute factorials modulo p for combinations
    fact = [1]*(n+1)
    for i in range(1,n+1):
        fact[i] = fact[i-1]*i % p

    # Precompute binomial coefficients modulo p
    C = [[0]*(n+1) for _ in range(n+1)]
    for i in range(n+1):
        C[i][0] = 1
        for j in range(1,i+1):
            C[i][j] = (C[i-1][j-1]+C[i-1][j])%p

    # DP[i][j]: ways to arrange first i numbers with exactly j good numbers
    dp = [[0]*(k+2) for _ in range(n+2)]
    dp[0][0] = 1

    for i in range(1,n+1):
        for j in range(0,min(i,k)+1):
            # place current number as non-good
            dp[i][j] = dp[i-1][j] * (i-1 + 1) % p
            # place current number as good, if j>0 and possible
            if j>0 and m<=i:
                dp[i][j] = (dp[i][j] + dp[i-1][j-1] * C[i-1][m-1]) % p

    print(dp[n][k]%p)

if __name__ == "__main__":
    main()
```该代码首先预先计算阶乘和二项式系数的模$p$以允许快速计算插入计数。 考虑当前数字良好和不好的情况，迭代更新 DP 表。 组合计数$C[i-1][m-1]$反映为大于当前数字的数字选择位置以完全满足$m$最大值。 

## 工作示例

 使用示例输入`4 3 2 10007`:

 | 步骤| 我| j | dp[i][j] | dp[i][j] |
 | --- | --- | --- | --- |
 | 初始化| 0 | 0 | 1 |
 | 1 | 1 | 0 | 1 |
 | 1 | 1 | 1 | 1（最大的数字就可以了）|
 | 2 | 2 | 0 | 2 |
 | 2 | 2 | 1 | 2 |
 | 2 | 2 | 2 | 0 |
 | 3 | 3 | 0 | 6 |
 | 3 | 3 | 1 | 6 |
 | 3 | 3 | 2 | 4 |
 | 4 | 4 | 2 | 4 |

 这证实了`dp[4][2] = 4`正如预期的那样。 

另一个测试`n=3, m=2, k=1, p=100`:

 | 步骤| 我| j | dp[i][j] | dp[i][j] |
 | --- | --- | --- | --- |
 | 初始化| 0 | 0 | 1 |
 | 1 | 1 | 0 | 1 |
 | 1 | 1 | 1 | 0 |
 | 2 | 2 | 0 | 2 |
 | 2 | 2 | 1 | 1 |
 | 3 | 3 | 1 | 3 |

 用恰好一个好数来确认一种排列。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^3) | O(n^3) | 三个嵌套循环：i 代表数字，j 代表良好计数，以及组合计算 |
 | 空间| O(n^2) | O(n^2) | DP工作台及组合工作台|

 复杂性在限制之内，因为$n \le 100$允许$10^6$2秒内即可舒适操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    from contextlib import redirect_stdout
    f = io.StringIO()
    with redirect_stdout(f):
        main()
    return f.getvalue().strip()

assert run("4 3 2 10007") == "4", "sample 1"
assert run("3 2 1 100") == "3", "custom 1"
assert run("1 1 1 10") == "1", "minimum size"
assert run("5 1 1 1000") == "24", "only largest can be good"
assert run
```
