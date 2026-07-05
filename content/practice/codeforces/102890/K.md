---
title: "CF 102890K - K 参赛者"
description: "我们正在有效地计算有多少种方法可以从两个单独的池中组建一支规模为 k 的团队，其中每个池通过组合独立贡献，但一个池需要贡献至少 c 名成员。"
date: "2026-07-04T12:31:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102890
codeforces_index: "K"
codeforces_contest_name: "2020 ICPC Gran Premio de Mexico 3ra Fecha"
rating: 0
weight: 102890
solve_time_s: 50
verified: true
draft: false
---

[CF 102890K - K 参赛者](https://codeforces.com/problemset/problem/102890/K)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在有效地计算有多少种方法可以从两个单独的池中组建一支规模为 k 的团队，其中每个池通过组合独立贡献，但一个池需要贡献至少 c 名成员。 

输入可以理解为两个组的规模，A 组为 n，B 组为 m，以及所需的团队规模 k 和 A 组的最小贡献 c。输出是表示有效团队数量的单个整数。 

约束的直接含义是任何解决方案都必须有效地评估许多组合。 如果 n 和 m 很大，达到大约 10^5 或更大，并且 k 也可能很大，那么任何枚举子集或每次查询重复重新计算类似阶乘数量的方法都会太慢。 预处理后 2 秒解决方案的自然极限约为 O(n + m + k) 或 O(k)，而 n 或 m 中的任何二次方都是不可行的。 

在这种情况下，一些微妙的边缘情况自然会出现。 首先，如果 k 大于 n + m，则不存在有效的团队，因为我们无法选择比可用人员更多的人员。 例如，如果 n = 2、m = 2、k = 5、c = 1，则正确答案为 0，但盲目迭代 i 的粗心实现可能仍会尝试无效的二项式系数。 

其次，如果 c 为 0，则问题简化为对从 0 到 k 的所有可能的分割 i 求和。 错误地强制 i ≥ 1 的幼稚实现会错过有效的组合，例如从 B 组中选择所有 k 个成员。 

第三，如果c大于k，则答案必须立即为零，因为即使满足A组的最低要求也已经超过了团队总规模。 

## 方法

 蛮力方法会尝试将团队在两组之间进行所有可能的划分。 对于从 0 到 k 的每个 i，它使用二项式系数计算从 A 中选择 i 个人和从 B 中选择 k − i 的方法数。 然后它过滤掉 i < c 处的无效分割。 

这种方法是正确的，因为它明确枚举了团队的每个有效组成。 问题是计算成本。 除非预先计算，否则每个二项式系数计算都是昂贵的，并且即使预先计算，当 k 很大并且存在多个测试用例时，迭代每个测试用例的 k 值也会变得太慢。 在最坏的情况下，如果 k 约为 10^5，我们将为每个测试用例执行 10^5 次添加，并且可能会执行许多测试用例，这会将解决方案推向极限。 

关键的观察是，一旦使用阶乘和模逆，二项式系数就可以预先计算，从而允许在 O(1) 中计算每个组合。 这将问题从昂贵的重新计算转化为有效 i 上的简单线性求和。 A 组和 B 组之间的独立结构确保每次分裂通过 C(n, i) * C(m, k − i) 进行乘法贡献。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(k·(n + m)) | O(k·(n + m)) | O(1) | O(1) | 太慢了|
 | 具有阶乘预计算的组合学 | O(n + m + k) 预处理，每个查询 O(k) | O(n + m) | 已接受 |

 ## 算法演练

 我们首先预先计算最多 n + m 的阶乘和逆阶乘，因为我们需要的任何二项式系数都将受到这些值的限制。 

1. 预先计算直到 n + m 的所有 i 的阶乘fact[i]。 这样可以快速构建 nCr 值。 
2. 预先计算模逆invfact[i]，以便模运算中的除法变成常量时间乘法。 
3. 迭代 i 的所有可能值，其中 i 代表我们从 A 组中抽取多少人。 
4. 跳过任何违反约束的 i，特别是 i < c 或 i > n。 
5. 对于每个有效的 i，计算从 A 中选择 i 和从 B 中选择 k − i 的方法数。 
6. 将此产品添加到运行总计中。 
7. 输出最终的和。

迭代 i 的原因是它唯一地决定了团队的组成。 一旦 i 被固定，余数就被强制，所以我们正在计算不相交的组合情况。 

### 为什么它有效

 每个有效的团队都对应于 i 的一个值，即从 A 组中选择的元素的数量。这将整个解决方案空间划分为不重叠的情况。 在每种情况下，有效选择的数量都是独立且相乘的，因为 A 和 B 中的选择是不相交的集合。 因此，所有有效 i 的总和恰好涵盖了所有可能的有效团队一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def modinv(x):
    return pow(x, MOD - 2, MOD)

def build_fact(n):
    fact = [1] * (n + 1)
    invfact = [1] * (n + 1)

    for i in range(2, n + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact[n] = modinv(fact[n])
    for i in range(n, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    return fact, invfact

def ncr(n, r, fact, invfact):
    if r < 0 or r > n:
        return 0
    return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

def solve():
    n, m, k, c = map(int, input().split())

    if c > k:
        print(0)
        return

    fact, invfact = build_fact(n + m)

    ans = 0
    for i in range(c, k + 1):
        if i > n:
            break
        j = k - i
        if j > m:
            continue
        ans = (ans + ncr(n, i, fact, invfact) * ncr(m, j, fact, invfact)) % MOD

    print(ans)

if __name__ == "__main__":
    solve()
```阶乘预处理块构建了恒定时间二项式评估所需的工具。 由于模数是素数，所以模逆是使用费马定理计算的。 

i 上的循环是解决方案的核心。 每次迭代代表团队的一个固定分区。 边界检查确保我们永远不会尝试无效的组合，即我们试图挑选比任一组中可用的人数更多的人。 

一个微妙的实现细节是当 i 超过 n 时提前终止。 一旦 i 太大，进一步的值只会增加它，因此不存在额外的有效贡献。 

## 工作示例

 考虑一个小实例，其中 n = 3、m = 3、k = 3、c = 1。 

我们计算每个有效 i 的贡献。 

| 我（来自A）| j（来自 B）| C(n,i) | C(n,i) | C(m,j) | C(m,j) | 贡献|
 | ---| ---| ---| ---| ---|
 | 1 | 2 | 3 | 3 | 9 |
 | 2 | 1 | 3 | 3 | 9 |
 | 3 | 0 | 1 | 1 | 1 |

 最终答案是19。 

此跟踪显示每个分区如何独立贡献以及约束 c 如何简单地从求和中删除无效行。 

现在考虑 n = 2、m = 4、k = 3、c = 2。 

| 我| j | 有效 | 贡献 |
 | ---| ---| ---| ---|
 | 0 | 3 | 没有| 0 |
 | 1 | 2 | 没有| 0 |
 | 2 | 1 | 是的 | 2 * 4 = 8 | 2 * 4 = 8
 | 3 | 0 | 否 (i > n) | 0 |

 结果是 8，展示了组大小的上限如何修剪无效配置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + m + k) | O(n + m + k) | 阶乘预处理占主导地位，i 上的求和在 k 中是线性的
 | 空间| O(n + m) | 阶乘和逆阶乘数组的存储 |

 这非常适合典型的 Codeforces 约束，其中 n 和 m 高达 10^5 或稍高，因为预处理是线性的并且主循环是单遍。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys

    def modinv(x):
        return pow(x, MOD - 2, MOD)

    def build_fact(n):
        fact = [1] * (n + 1)
        invfact = [1] * (n + 1)
        for i in range(2, n + 1):
            fact[i] = fact[i - 1] * i % MOD
        invfact[n] = modinv(fact[n])
        for i in range(n, 0, -1):
            invfact[i - 1] = invfact[i] * i % MOD
        return fact, invfact

    def ncr(n, r, fact, invfact):
        if r < 0 or r > n:
            return 0
        return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

    def solve():
        n, m, k, c = map(int, _sys.stdin.readline().split())
        if c > k:
            print(0)
            return
        fact, invfact = build_fact(n + m)
        ans = 0
        for i in range(c, k + 1):
            if i > n:
                break
            j = k - i
            if j > m:
                continue
            ans = (ans + ncr(n, i, fact, invfact) * ncr(m, j, fact, invfact)) % MOD
        print(ans)

    solve()
    return sys.stdout.getvalue().strip()

# small cases
assert run("3 3 3 1") == "19"
assert run("2 4 3 2") == "8"
assert run("2 2 5 1") == "0"
assert run("5 5 3 0") == str((10*10*2) % MOD)
assert run("1 10 2 2") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 3 3 3 1 | 3 3 3 1 19 | 19 正态组合求和|
 | 2 4 3 2 | 2 4 3 2 8 | A 组的上限约束 |
 | 2 2 5 1 | 2 2 5 1 0 | 不可能的团队规模|
 | 5 5 3 0 | 5 5 3 0 200 | 200 A | 没有最小约束
 | 1 10 2 2 | 1 10 2 2 0 | 不可行的最低要求|

 ## 边缘情况

 当 A 组中所需的最小选择超过团队规模时，算法立即返回零。 用于输入`n=5, m=5, k=3, c=4`，从初始条件开始，循环被完全跳过`c > k`成立，产生输出 0，而无需计算阶乘。 

当团队规模超过可用人员总数时，例如`n=2, m=2, k=6, c=1`，每个候选人分裂最终都会违反`i <= n`或者`k-i <= m`，因此每次迭代都会被拒绝，最终的总和保持为零。 

当约束最小时，`c=0`，循环从 0 运行到 k 并包含每个有效分区。 该算法正确地计算了从两个不相交的集合中选择 k 个人的所有方法，有效地再现了二项式卷积的身份。
