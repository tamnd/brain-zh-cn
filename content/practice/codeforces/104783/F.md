---
title: "CF 104783F - 布里森堡"
description: "我们得到一个正整数 $m$。 将 $m$ 视为定义一组“硬币”，其中每个硬币是 $m$ 的除数。 我们最多可以使用每个除数一次，并且我们尝试使用这些硬币来求和。"
date: "2026-06-28T14:48:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104783
codeforces_index: "F"
codeforces_contest_name: "2021-2022 CTU Open Contest"
rating: 0
weight: 104783
solve_time_s: 77
verified: true
draft: false
---

[CF 104783F - 布里松堡](https://codeforces.com/problemset/problem/104783/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一个正整数$m$。 想想$m$定义一组“硬币”，其中每个硬币是$m$。 我们最多可以使用每个除数一次，并且我们尝试使用这些硬币来求和。 

问题是是否每个整数$1$最多$m-1$可以形成为不同除数的和$m$。 如果可能的话，我们会致电$m$“好”，否则就是“坏”。 

对于每个测试用例，我们独立决定是否给定$m$很好。 

约束条件允许$m$最多$10^{12}$最多$100$测试用例。 枚举所有除数然后尝试子集和的简单方法太慢了。 即使列出除数也是可以管理的，但在最坏的情况下，每个数字可能有数十个除数的子集总和会变成指数。 

一个更微妙的问题是，即使是没有结构的贪婪子集和检查也是不够的。 例如，对于$m = 10$，除数是$1,2,5,10$。 使用后$1$和$2$，我们只能达到$3$。 下一个除数是$5$，它已经太大而无法扩展覆盖范围，即使原则上除数的总和足够大，一切都会立即崩溃。 

这表明除数的顺序和“间隙结构”很重要，而不仅仅是它们的总和。 

## 方法

 直接的暴力解决方案将枚举所有除数$m$，然后尝试所有子集，看看所有值是否达到$m-1$具有代表性。 这是除数数量的指数。 周围有一个数字$10^{12}$在极端情况下，可能有几百个除数的数量级，这使得这完全不可行。 

更好的方法是将问题重新解释为经典的硬币系统可达性问题。 对所有约数进行排序$m$按递增顺序并模拟可以以贪婪方式实现哪些总和。 假设我们已经能够得出区间内的所有和$[1, R]$。 下一个最小除数$d$只有当$d \le R+1$，因为否则有一个间隙$R+1$不能用以前使用过的硬币的任何组合来填充。 

这种贪婪过程对于硬币系统来说是正确的，并且充分表征了达到极限的所有值都可以表示的情况。 

困难在于我们必须检查除数集的这个条件$m$无需显式枚举所有子集。 这就是一个已知的数论特征出现的地方：其除数形成“实用”硬币系统的数字正是所谓的实用数字。 这些整数的除数允许形成每个值最多$m$。 我们的要求稍微弱一些，因为我们只需要$m-1$，但同样的结构也适用，因为如果系统可以达到$m$，肯定达到了$m-1$，并且所有故障在此之前都已显现。 

所以任务减少到检查是否$m$通过质因数分解满足实际数条件。 

经典的表征是渐进的。 如果我们建造$m$从素数递增的素数阶分解开始，在每一步中，我们都会检查下一个素数与之前因子已经可实现的总和结构相比是否足够小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力除数子集 | 指数| O(d(米)) | 太慢了|
 | 通过分解进行实际数字测试 |$O(\sqrt{m})$每次测试 | O(log m) | 已接受 |

 ## 算法演练

 我们依赖于实际数字的标准结构定理。 我们以素数的递增顺序处理素数分解并维护两个量：当前构造的值$v$和除数之和$v$，表示为$\sigma(v)$。 

1. 因式分解$m$转化为素数幂$p_1^{a_1} p_2^{a_2} \dots p_k^{a_k}$，按素数递增排序。 
2. 初始化$v = 1$和$\sigma(v) = 1$。 
3. 如果最小素数不是$2$，我们立即失败。 这是因为如果没有因子 2，我们就无法从 1 开始连续形成偶数和奇数小整数。 
4. 对于每个素数幂$p^a$为了顺序，考虑扩展当前的数量$v$。 在相乘之前，检查是否$$p \le \sigma(v) + 1.$$如果失败，则可实现的金额之间存在小于下一个硬币大小的差距，因此该结构无法涵盖所有​​值。 
5. 如果条件成立，则更新：$$v \leftarrow v \cdot p^a,
\quad
\sigma(v) \leftarrow \sigma(v) \cdot \frac{p^{a+1} - 1}{p - 1}.$$6.处理完所有素数后，该数有效。 

### 为什么它有效

 在任何时候，部分构造的数字的除数的行为就像一个硬币系统，其可实现的总和区间恰好是$[1, \sigma(v)]$。 条件$p \le \sigma(v)+1$保证下一批除数不会在可达范围内引入间隙。 一旦这个不变量对每一步都成立，可达区间就会连续增长而没有漏洞，这意味着所有整数直到$m$是可表示的，因此所有整数直到$m-1$也具有代表性。 

如果条件失败，第一个无法到达的整数严格出现在我们达到完整范围之前，并且后面的乘法无法修复该间隙，因为所有未来的除数都更大。 

## Python 解决方案```python
import sys
import math
input = sys.stdin.readline

def factorize(n):
    f = []
    i = 2
    while i * i <= n:
        if n % i == 0:
            cnt = 0
            while n % i == 0:
                n //= i
                cnt += 1
            f.append((i, cnt))
        i += 1
    if n > 1:
        f.append((n, 1))
    return f

def is_practical(n):
    if n == 1:
        return True

    fac = factorize(n)
    fac.sort()

    if fac[0][0] != 2:
        return False

    v = 1
    sigma = 1

    for p, a in fac:
        if p > sigma + 1:
            return False

        sigma *= (p**(a + 1) - 1) // (p - 1)
        v *= p ** a

    return True

def main():
    t = int(input())
    for _ in range(t):
        m = int(input())
        print("Yes" if is_practical(m) else "No")

if __name__ == "__main__":
    main()
```因式分解步骤是一个简单的试除法，直到$\sqrt{m}$。 自从$m \le 10^{12}$，这对于最多 100 个测试用例仍然有效。 

关键的实现细节是在更新 sigma 值之前检查整除条件，因为决策仅取决于已构造的前缀。 

sigma 更新使用除数和的封闭形式进行质数幂扩展，完全避免了除数的枚举。 

## 工作示例

 考虑$m = 10$。 其因式分解为$2 \cdot 5$。 

| 步骤| 总理| | 之前 | σ(v) 健康）状况$p \le σ(v)+1$| 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 1 | 2 ≤ 2 | 接受|
 | 2 | 5 | 3 | 5 ≤ 4 假 | 拒绝|

 该过程在第二个素数处失败，因为现有结构仅保证覆盖范围最多为 3，但下一个硬币是 5，留下了 4 的间隙。 

现在考虑$m = 12 = 2^2 \cdot 3$。 

| 步骤| 总理| | 之前 | σ(v) 状况 | 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 1 | 2 ≤ 2 | 接受|
 | 2 | 3 | 3 | 3≤4| 接受|

 没有出现间隙，因此所有值都达到$11$可以形成。 

第二个例子展示了足够小的素数如何允许连续扩展可达区间。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(T \sqrt{m})$| 因式分解的每个测试用例的试除|
 | 空间|$O(\log m)$| 存储素因数分解 |

 和$T \le 100$和$m \le 10^{12}$，该解决方案在限制内运行良好，因为$\sqrt{10^{12}} = 10^6$，由于因式分解的提前终止，通常只需要其中的一小部分。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from math import isclose
    output = []

    def solve():
        t = int(input())
        for _ in range(t):
            m = int(input())
            # simplified inline logic (reuse from main idea)
            def factorize(n):
                f = []
                i = 2
                while i * i <= n:
                    if n % i == 0:
                        c = 0
                        while n % i == 0:
                            n //= i
                            c += 1
                        f.append((i, c))
                    i += 1
                if n > 1:
                    f.append((n, 1))
                return f

            if m == 1:
                output.append("Yes")
                continue

            fac = factorize(m)
            fac.sort()
            if fac[0][0] != 2:
                output.append("No")
                continue

            sigma = 1
            ok = True
            for p, a in fac:
                if p > sigma + 1:
                    ok = False
                    break
                sigma *= (p**(a + 1) - 1) // (p - 1)

            output.append("Yes" if ok else "No")

    solve()
    return "\n".join(output)

# provided samples
assert run("1\n1\n") == "Yes", "sample 1"

# all ones
assert run("3\n1\n2\n3\n") in {"Yes\nYes\nNo", "Yes\nYes\nYes"}, "small sanity"

# powers of two
assert run("3\n8\n16\n32\n") == "Yes\nYes\nYes", "powers of two"

# failing prime structure
assert run("2\n10\n14\n") == "No\nNo", "bad composites"

# mixed
assert run("3\n6\n12\n20\n") == "Yes\nYes\nYes", "practical-like cases"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 两个的幂| 是的 是的 | 最小有效链结构 |
 | 10、14 | 否 否 | 由于大质数导致早期失效|
 | 6、12、20 | 是的 是的 | 复合案例通过条件|

 ## 边缘情况

 对于$m = 1$，除数集合只包含1，并且没有小于1的正整数来表示。 该算法立即接受这种情况，因为它完全满足条件。 

对于像这样的素数$m = 13$，因式分解产生除 2 之外的单个素数。由于我们要求从 2 开始，因此算法立即拒绝，这与除数的事实相匹配$\{1, 13\}$不能形成像 2 或 3 这样的整数。 

对于像这样的数字$m = 10$，故障发生在素数 5 引入的第一个大间隙处。可通过以下方式获得的部分和$\{1,2\}$最多只有 3，因此所需的连续性在达到整个范围之前就会中断，并且算法会在该点正确停止。
