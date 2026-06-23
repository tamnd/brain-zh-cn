---
title: "CF 105267F - \u9759\u6d41\u7684\u8def\u5f84"
description: "我们得到一个数字$N$，它可以通过它的质因数分解来完全描述。 每个质数 $pi$ 都具有相同的指数 $m$，因此 $N = p1^m p2^m cdots pk^m$。"
date: "2026-06-23T23:28:25+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105267
codeforces_index: "F"
codeforces_contest_name: "CCF CAT 2024"
rating: 0
weight: 105267
solve_time_s: 64
verified: true
draft: false
---

[CF 105267F - \u9759\u6d41\u7684\u8def\u5f84](https://codeforces.com/problemset/problem/105267/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个数字$N$这可以通过它的质因数分解来充分描述。 每个素数$p_i$以相同的指数出现$m$， 所以$N = p_1^m p_2^m \cdots p_k^m$。 的任何除数$N$可以通过为每个素数选择一个指数来表示$0$和$m$，形成长度向量$k$。 

对于除数$y$，我们定义一个函数$f(y)$作为因式分解中所有指数的总和。 在向量形式中，这只是坐标之和。 我们感兴趣的是那些指数和恰好为的除数$T$。 这些是“目标”节点。 

我们必须构建几个序列，每个序列从$1$并结束于$N$，其中每一步通过整除性从一个除数移动到一个更大的除数。 用指数术语来说，每一步都会增加一些坐标，但不会减少任何坐标。 因此，有效序列是一个单调路径$k$维度网格来自$(0,0,\dots,0)$到$(m,m,\dots,m)$。 

目标是选择尽可能少的此类路径，以便指数和恰好为每个除数$T$出现在至少一条选定的路径中。 

关键限制是$k \le 10^3$,$m \le 10^3$， 和$T \le mk \le 10^6$。 这排除了任何显式枚举所有除数或构建完整除数的方法$k$维晶格。 甚至存储完整的 DP 表大小$k \times T$可能是边界，任何立方体$k$或者$T$立刻就不可能了。 

经常打破天真的推理的一个微妙情况是假设单个路径可能覆盖多个目标除数。 例如，当$k=2, m=2, T=2$，目标包括$(2,0)$,$(1,1)$， 和$(0,2)$。 一条路径最多可以通过其中一个，因为一旦指数之和达到$2$，任何进一步的移动都会严格增加它。 因此任何路径都不能包含两个不同的目标。 这迫使我们采用纯粹基于计数的解决方案。 

另一个边缘情况是当$T=0$。 唯一的目标是根除数$1$，所以答案很明显$1$。 在相反的极端，当$T=mk$，唯一的目标是$N$，再次给出答案$1$。 

## 方法

 蛮力的观点是明确地构造所有单调路径$1$到$N$，然后检查它们经过了哪些目标节点，并尝试选择一个最小覆盖集。 即使生成所有路径也是不可行的：一个路径中单调路径的数量$k$维度网格呈指数增长$k$和$m$。 这立即超出了任何计算限制。 

结构上的突破是认识到每条路径最多可以覆盖一个目标节点。 功能$f$沿着任何有效路径严格增加，因为每一步至少增加一个指数并且永远不会减少任何指数。 因此，一旦路径到达总和的节点$T$，它永远不能重新访问具有相同总和的另一个节点。 这将问题转化为分区：每个有效目标必须分配给不同的路径，并且每个目标可以独立扩展为完整路径，最多可达$N$。 

所以答案正好是指数向量的数量$(e_1,\dots,e_k)$这样$0 \le e_i \le m$和$\sum e_i = T$。 这是一个有界整数组合问题，相当于提取$x^T$在$(1 + x + x^2 + \cdots + x^m)^k$。 

直接 DP 结束$k \times T$概念上很简单，但在最坏的情况下太慢了。 相反，我们以代数方式转换表达式并应用包含-排除来获得封闭形式。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力路径+选择| 指数| 指数| 太慢了 |
 | DP 层数 |$O(kT)$|$O(T)$| 太慢了 |
 | 包含排除公式 |$O(k)$|$O(1)$| 已接受 |

 ## 算法演练

 我们将生成函数重写为：$$(1 + x + \cdots + x^m)^k = \left(\frac{1 - x^{m+1}}{1 - x}\right)^k$$这将有界部分与无界组合结构分开。 

## 步骤 1

 展开$(1 - x^{m+1})^k$使用二项式定理。 这给出了总和$a$我们选择有多少素数贡献“截止”项$x^{m+1}$。 

每个术语贡献：$$\binom{k}{a} (-1)^a x^{a(m+1)}$$## 步骤 2

 展开$(1 - x)^{-k}$，这是一个标准的星条系列：$$(1 - x)^{-k} = \sum_{t \ge 0} \binom{t + k - 1}{k - 1} x^t$$这包括不受约束的组合。 

## 步骤 3

 将两个展开式相乘。 系数为$x^T$变成所有的总和$a$:$$\sum_{a \ge 0} \binom{k}{a} (-1)^a \binom{T - a(m+1) + k - 1}{k - 1}$$其中带有否定参数的术语将被忽略。 

## 步骤 4

 预计算阶乘和逆阶乘高达$T + k$。 然后每个二项式系数是$O(1)$。 

## 步骤 5

 迭代一遍$a$从$0$到$k$, 累积贡献模数$998244353$。 

### 为什么它有效

 该变换将有界约束与自由组合分开。 包含-排除项$(1 - x^{m+1})^k$删除任何坐标超过的所有解决方案$m$，修正超额计算$(1-x)^{-k}$。 每个有效指数向量都被精确计数一次，因为“溢出坐标”的每个子集都用交替符号进行校正。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD - 2, MOD)

def solve():
    m, k, T = map(int, input().split())
    primes = list(map(int, input().split()))  # not used

    max_n = T + k + 5

    fact = [1] * max_n
    invfact = [1] * max_n

    for i in range(1, max_n):
        fact[i] = fact[i - 1] * i % MOD

    invfact[max_n - 1] = modinv(fact[max_n - 1])
    for i in range(max_n - 2, -1, -1):
        invfact[i] = invfact[i + 1] * (i + 1) % MOD

    def C(n, r):
        if n < 0 or r < 0 or n < r:
            return 0
        return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

    ans = 0

    for a in range(k + 1):
        t = T - a * (m + 1)
        if t < 0:
            break
        ways = C(k, a) * C(t + k - 1, k - 1) % MOD
        if a % 2 == 1:
            ans = (ans - ways) % MOD
        else:
            ans = (ans + ways) % MOD

    print(ans % MOD)

if __name__ == "__main__":
    solve()
```该实现预先计算阶乘一次并将其用于所有二项式计算。 循环结束$a$提前停止时$T - a(m+1)$变为负数，因为进一步的项没有任何贡献。 在指数空间中重新表述问题后，素数就不再相关，因此读取它们只是为了完整性。 

## 工作示例

 考虑$k=2, m=1, T=1$。 有效的指数向量是$(1,0)$和$(0,1)$，所以答案应该是$2$。 

| 一个 | t = T - a(m+1) | C(k,a) | C(k,a) | C(t+k-1,k-1) | C(t+k-1,k-1) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | 2 | 2 |
 | 1 | -1 | 2 | - | 停止|

 最终结果是$2$，符合预期。 这证实了每个坐标选择都是独立计算的。 

现在考虑$k=3, m=2, T=3$。 我们正在计算解决方案$e_1+e_2+e_3=3$与每个$e_i \le 2$。 除了坐标等于 3 的向量外，有效向量都是 3 的组合。 

| 一个 | t | C(3,a) | C(3,a) | C(t+2,2) | C(t+2,2) | 贡献 |
 | --- | --- | --- | --- | --- |
 | 0 | 3 | 1 | 10 | 10 10 | 10
 | 1 | 0 | 3 | 1 | -3 |
 | 2 | -3 | - | - | 停止|

 结果是$7$，与直接枚举匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(k + T)$| 阶乘预计算占主导地位，循环$k$条款|
 | 空间|$O(T + k)$| 阶乘和逆阶乘数组 |

 这些限制允许最多约一百万$T$，并且该解决方案仅执行线性预处理和线性求和$k \le 10^3$，它很适合在限制范围内。 

## 测试用例```python
import sys, io

MOD = 998244353

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from math import prod

    # inline solution
    input = sys.stdin.readline
    m, k, T = map(int, input().split())
    primes = list(map(int, input().split()))

    max_n = T + k + 5
    fact = [1] * max_n
    invfact = [1] * max_n
    for i in range(1, max_n):
        fact[i] = fact[i - 1] * i % MOD

    def modinv(x):
        return pow(x, MOD - 2, MOD)

    invfact[max_n - 1] = modinv(fact[max_n - 1])
    for i in range(max_n - 2, -1, -1):
        invfact[i] = invfact[i + 1] * (i + 1) % MOD

    def C(n, r):
        if n < 0 or r < 0 or n < r:
            return 0
        return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

    ans = 0
    for a in range(k + 1):
        t = T - a * (m + 1)
        if t < 0:
            break
        ways = C(k, a) * C(t + k - 1, k - 1) % MOD
        if a % 2:
            ans = (ans - ways) % MOD
        else:
            ans = (ans + ways) % MOD

    return str(ans % MOD)

# minimum case
assert run("1 1 0\n2\n") == "1"

# single variable
assert run("3 1 2\n2\n") == "1"

# small symmetric case
assert run("1 2 1\n2 3\n") == "2"

# boundary T = mk
assert run("2 2 4\n2 3\n") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小| 1 | T=0 基本情况 |
 | k=1 | k=1 1 | 单维行为 |
 | 小 k=2 | 2 | 基本组成 |
 | T=mk | 1 | 最大边界正确性|

 ## 边缘情况

 当$T = 0$，唯一的解是零向量，因此该算法仅产生$a=0$术语与$C(k-1,k-1)=1$，给出输出$1$。 任何试图将其视为路径上的 DP 的尝试都会因考虑不必要的中间状态而被过度计算，但该公式正确地崩溃了。 

什么时候$T = mk$，只有一个指数向量存在，其中所有坐标都相等$m$。 式中，所有项均带有$a \ge 1$制作$t < 0$，所以只有$a=0$贡献，产生恰好一种配置。 这表明包含-排除干净地删除了所有无效的溢出情况，而无需特殊的大小写。
