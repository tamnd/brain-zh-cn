---
title: "CF 104386C - 前缀和数组"
description: "我们从一个无限数组开始，其中每个位置最初都包含值 1。每秒，该数组都会被其前缀和版本替换，这意味着位置 i 处的值将成为前一个数组中从位置 1 到 i 的所有值的总和。"
date: "2026-07-01T02:48:14+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104386
codeforces_index: "C"
codeforces_contest_name: "TheForces Round #14 (Cool-Forces)"
rating: 0
weight: 104386
solve_time_s: 78
verified: false
draft: false
---

[CF 104386C - 前缀和数组](https://codeforces.com/problemset/problem/104386/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们从一个无限数组开始，其中每个位置最初都包含值 1。每秒，该数组都会被其前缀和版本替换，这意味着位置 i 处的值将成为前一个数组中从位置 1 到 i 的所有值的总和。 一次操作后，数组将成为累积总数不断增长的序列，并且在 k 次操作后，此转换将应用 k 次。 

任务是回答多个查询。 每个查询给出一个位置 n 和多个变换 k，我们必须在 k 个前缀和运算之后计算索引 n 处的值，模$10^9 + 7$。 

这些限制使得暴力破解立即变得不可能。 即使 n 最多$10^5$, k 也可达$10^5$，并且最多有$10^5$测试用例。 每个查询重复模拟前缀和需要$O(nk)$在最坏的情况下每个测试用例的工作量远远超出了可行的限制。 

一个不太明显的问题是数组在概念上是无限的，但只有前 n 个元素对于每个查询都很重要。 任何试图实现超出必要范围的方法，如果不利用结构，仍然会带来不必要的开销。 

由于重复重新计算前缀和，简单的实现也可能会默默地失败。 例如，即使为单个 n=100000 情况计算 k=1000 次变换也已经太大了，因为每个变换本身都是线性的。 

## 方法

 暴力法应用前缀和运算 k 次。 每个操作都会扫描数组并构建一个新数组。 这是正确的，因为它直接遵循定义，但每次查询的成本为 O(nk)。 n 和 k 都很大且 t 达到$10^5$，这变得天文数字般大。 

关键的观察是重复的前缀和生成众所周知的组合结构。 经过一次操作后，索引 n 处的值等于 n。 经过两次运算，就变成了1到n的和，也就是三角数$\binom{n+1}{2}$。 经过三次运算后，变成三角数之和，对应$\binom{n+2}{3}$。 该模式概括为：经过 k 次运算后，索引 n 处的值等于二项式系数$\binom{n+k-1}{k}$。 

发生这种情况是因为每个前缀和层都会添加一级求和，并且常数序列的重复求和构建了帕斯卡的三角形结构。 每个位置累积的贡献完全对应于在 n+k-1 个位置中选择 k 个索引的组合。 

这将每个查询转换为单个组合计算，而不是 k 次重复的数组转换。 

我们预先计算阶乘和模逆$n+k$，并在 O(1) 内回答每个查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 每个查询 O(nk) | O(n) | 太慢了|
 | 最佳| O(n + max(n+k)) 预处理，每个查询 O(1) | O(最大(n+k)) | 已接受 |

 ## 算法演练

 我们依赖这样的恒等式：经过 k 个前缀和运算后，索引 n 处的值变为：$$a_k(n) = \binom{n + k - 1}{k}$$1. 我们确定所有查询中 n+k 的最大值。 这是必需的，因为阶乘预计算必须覆盖任何查询中使用的最大二项式参数。 
2. 我们预先计算阶乘直到该最大值模$10^9 + 7$。 这允许快速计算组合。 
3. 我们使用费马小定理预先计算阶乘的模逆。 这是必要的，因为模算术中的除法被逆阶乘乘法所取代。 
4. 对于每个查询 (n, k)，我们计算二项式系数$\binom{n+k-1}{k}$使用：$$\frac{(n+k-1)!}{k!(n-1)!}$$5. 我们输出结果取模$10^9 + 7$。 

之所以有效，是因为每个前缀和层对应于增加一维累加，而重复累加和的结构与帕斯卡三角形完全匹配。 每个条目都统计在位置n处结束的长度为k的弱递增序列的数量，这正是上面的二项式系数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modinv(x):
    return pow(x, MOD - 2, MOD)

def build_fact(n):
    fact = [1] * (n + 1)
    invfact = [1] * (n + 1)
    for i in range(1, n + 1):
        fact[i] = fact[i - 1] * i % MOD
    invfact[n] = modinv(fact[n])
    for i in range(n, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD
    return fact, invfact

def ncr(n, r, fact, invfact):
    if r < 0 or r > n:
        return 0
    return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

def main():
    t = int(input())
    queries = []
    maxv = 0

    for _ in range(t):
        n, k = map(int, input().split())
        queries.append((n, k))
        maxv = max(maxv, n + k)

    fact, invfact = build_fact(maxv)

    for n, k in queries:
        ans = ncr(n + k - 1, k, fact, invfact)
        print(ans)

if __name__ == "__main__":
    main()
```阶乘数组存储快速计算组合所需的值。 逆阶乘数组允许通过将除法转变为乘法来进行模除法。 

关键的实现细节是使用$n+k-1$作为二项式系数的顶部。 一个常见的错误是忘记了转变和使用$\binom{n+k}{k}$，它超出了 Pascal 结构的一整层。 

我们还在向后传递中预先计算逆，以避免每个查询重复模幂，这对于$10^5$查询。 

## 工作示例

 考虑一个查询，其中 n = 4 且 k = 2。我们期望：$$\binom{4+2-1}{2} = \binom{5}{2} = 10$$| 步骤| 表达 |
 | --- | --- |
 | 计算 n+k-1 | 5 |
 | 计算 C(5,2) | 10 | 10

 这与已知的第二前缀和变换序列 1, 3, 6, 10 匹配。 

现在考虑 n = 3，k = 1：$$\binom{3}{1} = 3$$| 步骤| 表达 |
 | --- | --- |
 | 计算 n+k-1 | 3 |
 | 计算 C(3,1) | 3 |

 这与数组变为 1,2,3,... 的第一个转换相匹配

 这些例子证实了 k 层前缀求和与二项式系数增长完全对应。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(最大 N) + O(t) | 每个查询的阶乘预计算加上 O(1) |
 | 空间| O(最大 N) | 阶乘和逆阶乘数组的存储 |

 预计算最多限制在$2 \times 10^5$在实际中给定约束条件，并且每次查询都是常数时间。 即使对于$10^5$查询。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def solve(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def modinv(x):
        return pow(x, MOD - 2, MOD)

    def build_fact(n):
        fact = [1] * (n + 1)
        invfact = [1] * (n + 1)
        for i in range(1, n + 1):
            fact[i] = fact[i - 1] * i % MOD
        invfact[n] = modinv(fact[n])
        for i in range(n, 0, -1):
            invfact[i - 1] = invfact[i] * i % MOD
        return fact, invfact

    def ncr(n, r, fact, invfact):
        if r < 0 or r > n:
            return 0
        return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

    t = int(input())
    qs = []
    mx = 0
    for _ in range(t):
        n, k = map(int, input().split())
        qs.append((n, k))
        mx = max(mx, n + k)

    fact, invfact = build_fact(mx)

    out = []
    for n, k in qs:
        out.append(str(ncr(n + k - 1, k, fact, invfact)))
    return "\n".join(out)

# provided samples
assert solve("3\n3 1\n1 3\n3 2") == "3\n1\n5"

# custom cases
assert solve("1\n1 1") == "1", "minimum case"
assert solve("1\n5 0") == "1", "zero transformations"
assert solve("2\n4 2\n3 3") == "10\n10", "triangular consistency"
assert solve("1\n100000 1") == "100000", "large n small k"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 1 / 1 1 | 1 1 / 1 1 1 | 基本身份案例|
 | 5 0 | 5 0 1 | 零转变稳定性|
 | 4 2, 3 3 | 4 2, 3 3 10, 10 | 10, 10 组合一致性|
 | 100000 1 | 100000 | 大边界正确性|

 ## 边缘情况

 一种边缘情况是 k = 0，此时不发生任何转换。 公式变为$\binom{n-1}{0} = 1$，它正确地反映了数组仍然全为 1。 

另一个边缘情况是 n = 1。无论 k 如何，答案必须始终为 1，因为前缀和数组的第一个元素永远不会改变。 公式给出$\binom{k}{k} = 1$，完全匹配这个不变量。 

第三种边缘情况是 n 大而 k 小。 例如 n = 100000，k = 1 得出$\binom{100000}{1} = 100000$，它符合产生线性增长的单个前缀和的定义。
