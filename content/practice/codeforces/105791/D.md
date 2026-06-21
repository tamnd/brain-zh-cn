---
title: "CF 105791D - 飞镖"
description: "每个测试都描述了一个简单的结构化战斗：有 n 波敌人，第 i 波正好包含 i 个气球。 波浪中的每个气球都具有相同的功率级别 k，并且摧毁单个气球的成本是 i 的 k 次方。"
date: "2026-06-21T14:24:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105791
codeforces_index: "D"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2025"
rating: 0
weight: 105791
solve_time_s: 58
verified: true
draft: false
---

[CF 105791D - 飞镖](https://codeforces.com/problemset/problem/105791/D)

 **评级：** -
 **标签：** -
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个测试都描述了一个简单的结构化战斗：有 n 波敌人，第 i 波正好包含 i 个气球。 波浪中的每个气球都具有相同的功率级别 k，并且摧毁单个气球的成本是 i 的 k 次方。 因此，整个关卡所需的飞镖总数是从 1 到 n 的所有 i 的 i^k 之和。 

换句话说，任务是在大模数下计算 S_k(n) = 1^k + 2^k + … + n^k 形式的经典幂和。 

困难不在于定义，而在于规模。 项数 n 可以大到 10^9，因此迭代所有 i 是不可能的。 指数 k 至多为 1000，这表明 k 中的多项式结构而不是 n 中的多项式结构。 

一个简单的实现会尝试为每个测试用例从 1 循环到 n 并累积 i^k。 即使对于 n = 10^9 的单个测试，这也会立即失败，因为它需要十亿次模幂。 

另一个常见的失败是对所有 i 到 n 的预计算能力。 这也打破了内存和时间限制，因为 n 太大而无法实现。 

更微妙的边缘情况是当 k = 0 或 k = 1 时。对于 k = 0，每一项都是 1，答案是 n，对于 k = 1，答案是 n(n+1)/2。 任何通用公式都必须正确退化到这些情况，而没有数值不稳定。 

## 方法

 蛮力法直接计算每一项 i^k 并对它们求和。 这在数学上是正确的，但在计算上是不可行的。 对于每个测试用例，它执行 O(n) 次求幂，每次求幂成本为 O(log k)，导致在最坏的情况下每个测试大约需要 10^9 次操作，这远远超出了任何时间限制。 

关键的观察结果是 S_k(n) 不是 n 的任意函数。 它是一个 k+1 次 n 多项式。 这是关于幂和的众所周知的事实，并且可以使用涉及斯特林数的有限差分或二项式展开式来导出。 

一旦我们接受这个结构，问题就变成了在大点 n 处有效评估多项式的​​问题。 我们不迭代 i，而是使用第二类斯特林数重写 i^k：

 i^k = S(k, j) * j 从 0 到 k 的 j 总和！ * C(i,j)

 现在对 i 从 1 到 n 求和，我们可以交换求和：

 S_k(n) = S(k, j) * j 的 j 之和！ * 对 C(i, j) 中的 i 求和

 内部总和有一个干净的封闭形式：

 sum_{i=1..n} C(i, j) = C(n+1, j+1)

 这将整个问题简化为计算固定 k 的斯特林数并评估 n 处的一些二项式系数。 

因此，我们不迭代 n，而是只迭代 k，它最多为 1000。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n·log k) | O(n·log k) | O(1) | O(1) | 太慢了|
 | 斯特林+组合数学| 每次测试 O(k^2) | O(k^2) | O(k^2) | 已接受 |

 ## 算法演练

 1. 读取测试用例的 n 和 k。 目标是计算 S_k(n)，即 i 从 1 到 n 的 i^k 之和。 
2. 使用递推式 S(k, j) = j * S(k-1, j) + S(k-1, j-1) 预先计算给定 k 的第二类斯特林数 S(k, j)。 这将构建将幂转换为组合的系数。 
3. 预先计算直到 k 的阶乘，因为每一项还涉及乘数 j!。 这允许在评估期间进行恒定时间访问。 
4. 对于从 0 到 k 的每个 j，计算二项式系数 C(n+1, j+1)。 由于 n 很大，请将其计算为下降乘积 (n+1)(n)…(n-j+1) 除以 (j+1)！ 在模运算下。 
5. 对于每个 j，将 S(k, j)、j! 和 C(n+1, j+1) 相乘，并将结果累加到答案中。 
6. 输出模 10^9 + 7 的最终总和。

为什么有效：该变换将每个单项式 i^k 替换为二项式基函数 C(i, j) 的线性组合。 这些基函数 i 的总和折叠成单个二项式项 C(n+1, j+1)，因此整个求和变成封闭形式的有限线性组合，而不是长前缀和。 正确性来自于两个表示在所有整数 i 上一致的恒等式，因此它们在任何前缀上的和也必须一致。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def build_stirling(k):
    S = [[0] * (k + 1) for _ in range(k + 1)]
    S[0][0] = 1
    for i in range(1, k + 1):
        for j in range(1, i + 1):
            S[i][j] = (S[i - 1][j - 1] + j * S[i - 1][j]) % MOD
    return S

def solve():
    t = int(input())
    tests = []
    max_k = 0
    for _ in range(t):
        n, k = map(int, input().split())
        tests.append((n, k))
        max_k = max(max_k, k)

    fact = [1] * (max_k + 2)
    invfact = [1] * (max_k + 2)
    for i in range(1, max_k + 2):
        fact[i] = fact[i - 1] * i % MOD

    invfact[max_k + 1] = pow(fact[max_k + 1], MOD - 2, MOD)
    for i in range(max_k, -1, -1):
        invfact[i] = invfact[i + 1] * (i + 1) % MOD

    stir = build_stirling(max_k)

    for n, k in tests:
        if k == 0:
            print(n % MOD)
            continue

        ans = 0
        # compute C(n+1, j+1) using falling product
        for j in range(0, k + 1):
            # compute numerator (n+1)P(j+1)
            num = 1
            x = n + 1
            for t2 in range(j + 1):
                num = num * (x - t2) % MOD

            comb = num * invfact[j + 1] % MOD

            ans = (ans + stir[k][j] * fact[j] % MOD * comb) % MOD

        print(ans % MOD)

if __name__ == "__main__":
    solve()
```该解决方案的结构是将预处理与每次测试计算分开。 斯特林数在所有测试中计算一次直至最大 k，从而避免重新计算。 阶乘和逆阶乘也会预先计算一次，以进行快速二项式评估。 

在每个测试中，二项式项 C(n+1, j+1) 是使用下降乘积而不是 n 的阶乘来计算的，因为 n 对于直接基于阶乘的组合而言太大。 这避免了溢出并保持所有算术模块化。 

一个常见的陷阱是忘记总和从 i = 1 开始，这就是恒等式产生 C(n+1, j+1) 而不是 C(n, j+1) 的原因。 

## 工作示例

 考虑 n = 3，k = 2。正确答案是 1^2 + 2^2 + 3^2 = 14。 

我们计算 k = 2 时的斯特林数：S(2,1) = 1，S(2,2) = 1。 

| j | S(k,j) | S(k,j) | j！ | C(n+1,j+1) | C(n+1,j+1) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 1 | C(4,1)=4 | C(4,1)=4 | 0 |
 | 1 | 1 | 1 | C(4,2)=6 | C(4,2)=6 6 |
 | 2 | 1 | 2 | C(4,3)=4 | C(4,3)=4 | 8 |

 求和得到 14。 

这证实了变换与直接求值相匹配，并且高阶结构正确地分解为二项式项。 

现在考虑 n = 5，k = 1。预期结果为 1 + 2 + 3 + 4 + 5 = 15。 

| j | S(1,j) | S(1,j) | j！ | C(6,j+1) | C(6,j+1) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 0 | 0 | 1 | 6 | 0 |
 | 1 | 1 | 1 | 15 | 15 15 | 15

 这证实了该公式正确地简化为三角数恒等式。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每次测试 O(k^2) | 斯特林 DP 占主导地位，二项式评估为 O(k) |
 | 空间| O(k^2) | O(k^2) | 斯特林桌存储 |

 约束条件使 k 最多为 1000，因此即使是二次预处理也能轻松适应。 测试数量足够小，重复的 O(k^2) 工作仍处于限制范围内。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    input = _sys.stdin.readline

    def build_stirling(k):
        S = [[0] * (k + 1) for _ in range(k + 1)]
        S[0][0] = 1
        for i in range(1, k + 1):
            for j in range(1, i + 1):
                S[i][j] = (S[i - 1][j - 1] + j * S[i - 1][j]) % MOD
        return S

    t = int(input())
    tests = []
    max_k = 0
    for _ in range(t):
        n, k = map(int, input().split())
        tests.append((n, k))
        max_k = max(max_k, k)

    fact = [1] * (max_k + 2)
    invfact = [1] * (max_k + 2)
    for i in range(1, max_k + 2):
        fact[i] = fact[i - 1] * i % MOD
    invfact[max_k + 1] = pow(fact[max_k + 1], MOD - 2, MOD)
    for i in range(max_k, -1, -1):
        invfact[i] = invfact[i + 1] * (i + 1) % MOD

    stir = build_stirling(max_k)

    out = []
    for n, k in tests:
        if k == 0:
            out.append(str(n % MOD))
            continue
        ans = 0
        for j in range(k + 1):
            num = 1
            x = n + 1
            for t2 in range(j + 1):
                num = num * (x - t2) % MOD
            comb = num * invfact[j + 1] % MOD
            ans = (ans + stir[k][j] * fact[j] % MOD * comb) % MOD
        out.append(str(ans % MOD))

    return "\n".join(out)

# provided samples (placeholders since original sample output not fully visible)
# basic sanity checks
assert run("1\n3 2\n") == "14"
assert run("1\n5 1\n") == "15"
assert run("1\n10 0\n") == "10"

# custom cases
assert run("1\n1 100\n") == "1", "n=1 edge"
assert run("1\n10 2\n") == str((1*1 + 2*2 + 3*3 + 4*4 + 5*5 + 6*6 + 7*7 + 8*8 + 9*9 + 10*10) % MOD), "square sum"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1\n1 100 | 1 1 | 大 k，最小 n |
 | 1\n10 2 | 385 | 385 二次和的正确性 |
 | 1\n5 1 | 1\n5 15 | 15 线性情况|

 ## 边缘情况

 当 k = 0 时，每一项 i^0 都等于 1，因此总和应等于 n。 在该算法中，这完全绕过了斯特林展开并直接返回 n 模 MOD，它与恒等式 C(n+1,1) = n+1 匹配，但通过从 1 开始的正确索引进行移位。 

当 n = 1 时，所有高级结构都会崩溃，因为总和包含单个项。 二项式求值生成 C(2, j+1)，仅当 j = 0 时该值才为非零，从而确保无论 k 如何，结果始终为 1^k = 1。 

当k相对于n较大时，许多更高的斯特林项仍然出现在计算中，但二项式系数C(n+1, j+1)在j > n时自然消失，因此公式保持稳定并避免了大指数的不必要贡献。
