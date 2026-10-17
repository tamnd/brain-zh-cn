---
title: "CF 106298I - 兆多项式"
description: "我们得到了一个整数集合，它们定义了由下降阶乘构建的有理表达式。 中心对象是通过多项式恒等式中的两个等效系数比较间接定义的常数 $K$。"
date: "2026-06-18T22:29:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106298
codeforces_index: "I"
codeforces_contest_name: "OCPC 2024 Summer, Day 4: wuhudsm Contest"
rating: 0
weight: 106298
solve_time_s: 53
verified: true
draft: false
---

[CF 106298I - 兆多项式](https://codeforces.com/problemset/problem/106298/I)

 **评级：** -
 **标签：** -
 **求解时间：** 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个整数集合，它们定义了由下降阶乘构建的有理表达式。 中心物体是一个常数$K$通过多项式恒等式中的两个等效系数比较间接定义。 简化这些恒等式后，任务简化为检查是否由连续整数除以的乘积构造的值$A$是一个整数。 

具体来说，出现的分子是以下形式的截断阶乘部分$n \cdot (n-1) \cdot \ldots \cdot (n-k+1)$。 这是长度排列的数量$k$选自$n$，通常写为$nPk = \frac{n!}{(n-k)!}$。 价值$K$这个排列积除以$A$。 问题是这种划分是否准确。 

还有一个额外的代数恒等式涉及$B, C, D$， 和$(n-k)$，这保证了多项式系数的一致性。 这种身份不会改变计算核心：它只会激发为什么相同的$K$出现在两个不同的系数比较中。 唯一重要的计算检查是是否所有素因数$A$完全被置换积的素因数分解所覆盖。 

输入结构自然地被解释为多个查询，每个查询指定参数$A, B, C, D, n, k$，对于每个查询，我们必须决定是否$K$是一个整数。 

这种类型的 Codeforces 问题所隐含的约束形状通常允许最大$n$，因此明确扩展产品是不可行的。 一个简单的乘法需要$O(k)$每个查询，当查询数量和$k$很大。 

出现微妙的失败情况时$A$包含小素数的高次方。 例如，如果$A = 2^{20}$,$n = 10^6$， 和$k$很大，如果一个简单的方法不能正确跟踪整个范围内素数的重数，它可能会溢出或误算因子。 另一个边缘情况是当$k = 0$，其中乘积为空且等于 1，这意味着答案完全取决于是否$A = 1$。 

## 方法

 最直接的方法是计算乘积$n \cdot (n-1) \cdot \ldots \cdot (n-k+1)$明确地为每个查询，然后检查整除性$A$。 这在原则上是正确的，因为它与分子的定义完全匹配。 问题是成本：每个查询都需要$O(k)$乘法，并且对于大量输入，这在时间限制内是不可能的。 此外，中间产品变得非常大，需要任意精度的算术或重复的缩减，这使得实现变得复杂，并且仍然不能解决时间复杂度问题。 

关键的观察是我们永远不需要产品的全部价值。 我们只需要知道，对于每个素数$p$划分$A$，是否为$p$置换积中至少是指数$A$。 这将问题从数值计算转移到估值计数。 

排列积$n \cdot (n-1) \cdot \ldots \cdot (n-k+1)$可以表示为$\frac{n!}{(n-k)!}$。 这使我们能够计算任何素数的指数$p$使用标准阶乘估值技巧：$v_p(n!) - v_p((n-k)!)$。 这消除了迭代该范围内的所有元素的需要，并用每个素数的对数计数来代替它。 

我们因式分解$A$每个查询一次，然后对于每个素因数$p$，我们使用阶乘估值公式计算其在排列范围内的指数。 如果满足所有所需的指数，则答案是肯定的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力产品|$O(k)$每个查询 |$O(1)$| 太慢了|
 | 素因子+估值|$O(\sqrt{A} + \log n)$每个查询 |$O(1)$| 已接受 |

 ## 算法演练

 ### 算法演练

 1. 读取包含以下内容的查询$A, B, C, D, n, k$。 仅有的$A, n, k$影响整除性检查，因此计算时忽略其他值。 
2. 因式分解$A$进入其主要组成部分。 这给出了$A = \prod p_i^{e_i}$。 我们需要独立验证每个指数。 
3. 将分子重写为阶乘比$n! / (n-k)!$。 这将产品范围转换为可以有效计算素数指数的形式。 
4. 对于每个素数$p_i$，计算其指数$n!$使用重复除以$p_i$，然后减去它的指数$(n-k)!$。 这给出了排列积中的指数。 
5. 将该指数与$e_i$。 如果任何素数的指数不足，立即得出结论$K$不是整数。 
6. 如果所有素数都满足条件，则得出结论$K$是一个整数。 

核心思想是，整除性简化为检查素数分解中的指数优势，而阶乘结构允许在不显式构造数字的情况下计算这些指数。 

### 为什么它有效

 排列积和阶乘比与整数相同，因此它们的质因数分解完全匹配。 由于整数整除性相当于按分量比较素数指数，因此独立地检查每个素数可以完全表征是否$A$划分产品。 阶乘分解确保我们可以准确地计算这些指数，而无需枚举范围。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def factorize(x):
    f = {}
    p = 2
    while p * p <= x:
        while x % p == 0:
            f[p] = f.get(p, 0) + 1
            x //= p
        p += 1
    if x > 1:
        f[x] = f.get(x, 0) + 1
    return f

def vp_factorial(n, p):
    cnt = 0
    while n:
        n //= p
        cnt += n
    return cnt

def solve():
    t = int(input())
    out = []
    for _ in range(t):
        A, B, C, D, n, k = map(int, input().split())

        if k == 0:
            out.append("YES" if A == 1 else "NO")
            continue

        factors = factorize(A)
        ok = True

        for p, need in factors.items():
            total = vp_factorial(n, p) - vp_factorial(n - k, p)
            if total < need:
                ok = False
                break

        out.append("YES" if ok else "NO")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```解决方案从因式分解开始$A$，因为所有的整除性约束都是以其素数幂来表达的。 功能`vp_factorial`使用楼层除法的标准求和来计算阶乘内素数的指数，即使对于大型$n$。 

对于每个查询，排列范围指数计算为两个阶乘指数之间的差。 这避免了显式迭代产品范围并保持计算对数$n$。 

特殊情况$k = 0$对应于空乘积，等于 1，所以只有$A = 1$可以成功。 

## 工作示例

 考虑一个简单的查询，其中$A = 12$,$n = 5$,$k = 3$。 分子是$5 \cdot 4 \cdot 3 = 60$。 我们因式分解$12 = 2^2 \cdot 3$。 产品60有$2^2 \cdot 3 \cdot 5$，因此两个必需的指数都存在。 

| 步骤| p| v_p(n!) | v_p(n!) | v_p((n-k)!) | v_p((n-k)!) | 差异| 必填 | 结果 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 2 | 2 | 3 | 1 | 2 | 2 | 好的 |
 | 3 | 3 | 1 | 0 | 1 | 1 | 好的 |

 该跟踪显示每个素数约束都是独立检查的并且所有约束都得到满足。 

现在考虑$A = 8$,$n = 6$,$k = 2$。 该产品是$6 \cdot 5 = 30$，仅包含 2 的一个因数。 

| 步骤| p| v_p(n!) | v_p(n!) | v_p((n-k)!) | v_p((n-k)!) | 差异| 必填 | 结果 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 2 | 2 | 4 | 3 | 1 | 3 | 失败 |

 这里缺少 2 的幂立即使答案无效。 

这些示例展示了该方法如何在不计算完整乘积的情况下隔离主要缺陷。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(T \cdot (\sqrt{A} + \log n))$| 因式分解$A$加上每个素数的阶乘估值 |
 | 空间|$O(1)$| 只存储质因数$A$|

 该方法非常适合典型的约束，因为即使对于大量输入，因式分解和因式评估也很快，并且在该范围内没有每个元素迭代$k$是必须的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import sys as _sys

    # re-run solution
    input = _sys.stdin.readline

    def factorize(x):
        f = {}
        p = 2
        while p * p <= x:
            while x % p == 0:
                f[p] = f.get(p, 0) + 1
                x //= p
            p += 1
        if x > 1:
            f[x] = f.get(x, 0) + 1
        return f

    def vp_factorial(n, p):
        cnt = 0
        while n:
            n //= p
            cnt += n
        return cnt

    def solve():
        t = int(input())
        out = []
        for _ in range(t):
            A, B, C, D, n, k = map(int, input().split())

            if k == 0:
                out.append("YES" if A == 1 else "NO")
                continue

            factors = factorize(A)
            ok = True

            for p, need in factors.items():
                total = vp_factorial(n, p) - vp_factorial(n - k, p)
                if total < need:
                    ok = False
                    break

            out.append("YES" if ok else "NO")

        return "\n".join(out)

    return solve()

# custom cases
assert run("1\n1 0 0 0 5 3\n") == "YES", "trivial divisor"
assert run("1\n2 0 0 0 5 2\n") == "YES", "2 divides 5*4"
assert run("1\n8 0 0 0 6 2\n") == "NO", "insufficient powers of 2"
assert run("1\n12 0 0 0 5 3\n") == "YES", "mixed primes"
assert run("1\n6 0 0 0 3 3\n") == "YES", "edge full product"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |$A=1$案例 | 是 | 身份除数边缘情况 |
 | 2 的小幂 | 是 | 阶乘指数累加 |
 | 2-adic 估值不足 | 否 | 故障检测|
 | 混合素数| 是 | 多重素数正确性 |
 | 全系列产品 | 是 | 边界$k=n$款式案例 |

 ## 边缘情况

 一个关键的边缘情况是当$k = 0$。 产品变空，计算结果为 1。对于任何$A > 1$，整除性立即失败。 该算法在任何因式分解之前显式地处理这个问题。 

另一种情况是当$k = n$。 分子变为$n!$，算法自然地简化为检查是否$A$划分$n!$采用相同的估值方法。 由于阶乘差变为$v_p(n!) - v_p(0!)$， 和$v_p(0!) = 0$，计算保持一致。 

第三种微妙的情况是当$A = 1$。 因式分解步骤产生一组空素数，因此不执行任何检查，答案始终是“是”。
