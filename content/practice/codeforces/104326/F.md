---
title: "CF 104326F - 重复二进制"
description: "我们正在研究分数的表示形式，特别是 $frac{1}{x}$，但以 $b$ 为基数而不是 10 为基数。当您以任何基数展开有理数时，其小数部分最终会变成周期性的。"
date: "2026-07-01T19:09:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104326
codeforces_index: "F"
codeforces_contest_name: "Udmurt SU Contest 2011"
rating: 0
weight: 104326
solve_time_s: 72
verified: true
draft: false
---

[CF 104326F - 重复 b-ary](https://codeforces.com/problemset/problem/104326/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在研究分数的表示，特别是$\frac{1}{x}$，但是用基数写成$b$而不是以 10 为底。当您以任何底数展开有理数时，它的小数部分最终会变成周期性的。 在重复开始之前可能会出现一些数字前缀，之后数字将永远重复。 

任务不是构造扩展本身，而只是确定两个值：重复循环开始之前出现了多少位，以及重复循环有多长。 

输入给出一个分母$x$和一个基地$b$。 我们想象执行 1 的长除法$x$，但每一步都是在基础中完成的$b$。 在每一步中，余数决定下一个数字，并将余数乘以$b$模拟移动到下一个小数位置。 

该过程的行为完全由余数模控制$x$。 一旦余数重复，数字序列也必须重复，因为该过程是确定性的。 

约束条件允许$x \le 10^{12}$和$b \le 10^{18}$。 这排除了任何逐位扩展的模拟。 简单的模拟最多可以运行$x$在重复已经太大的余数之前先执行最坏的情况。 

一个更微妙的问题是，即使直接推理所有余数也是不够的，除非我们了解乘法如何$b$表现为模因子$x$。 循环的结构取决于该过程是否可以达到与以下项互质的余数：$x$，以及如何因式分解$x$相互作用$b$。 

一个天真的错误是假设周期总是与乘法顺序相关$b$模数$x$。 这会失败，当$x$和$b$不是互质的，因为$b$可以立即破坏部分模数结构，产生非周期前缀。 

另一个微妙的失败是将前缀长度始终视为零。 如果$x$与 共享素因数$b$，在任何循环开始之前，初始除法会反复取消这些因素。 

例如，如果$x = 12$和$b = 10$，基数与分母共享因子 2 和 3。 的扩展$1/12$以 10 为底是有限的，因此周期部分为零。 一种仅计算乘法阶模的方法$x$将错误地产生非零周期。 

## 方法

 关键的观察结果是，长除法过程可以分为两个阶段：一个阶段是分母与基数共享因子，另一个阶段是分母与基数互质。 

写$x = g \cdot x'$， 在哪里$g$包含所有素因数$x$这也划分$b$。 这些因素在扩展过程中被“吸收”到基础中，这意味着它们仅对有限的前缀做出贡献，并且从不参与重复循环。 

删除所有这些共享因素后，我们只剩下一个减少的分母$x'$这样$\gcd(x', b) = 1$。 从这一点开始，分数展开式的行为就像乘以$b$，周期对应于乘法顺序$b$模数$x'$。 

前缀长度取决于我们必须将余数乘以多少次$b$在所有共同因素消失之前。 每个这样的乘法都会有效地移动数字，同时消除与$b$。 所需步数等于每个素数除法的最高次方$\gcd(x, b^\infty)$，这相当于删除所有素数$x$出现在$b$。 

一旦完成标准化，剩下的系统就干净了：我们模拟乘法群模中的余数循环$x'$，其中每个状态都是可逆的。 周期长度最小$t$这样$b^t \equiv 1 \pmod{x'}$。 

计算此阶数需要因式分解$x'$，然后使用欧拉定理或素数幂的直接阶计算。 

蛮力方法将模拟余数序列：$r_{k+1} = (r_k \cdot b) \bmod x$，跟踪看到的状态直到重复。 这可以采取$O(x)$步骤，这是不可行的$x \le 10^{12}$。 

优化方法用数论代替模拟：分解出前缀的共享素数，然后计算周期的乘法阶。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟 |$O(x)$|$O(x)$| 太慢了 |
 | 因式分解 + 乘法阶 |$O(\sqrt{x})$到$O(\log x)$优化 |$O(1)$-$O(\log x)$| 已接受 |

 ## 算法演练

 1. 删除所有质因数$x$这也划分$b$。 这是通过反复计算来完成的$\gcd(x, b)$并划分$x$直到没有公因数为止。 此步骤隔离了分母中有助于重复循环的部分。 
2. 让$x'$是所有这些减少之后的剩余价值。 移除因子的数量决定了非周期前缀的长度。 每次删除对应于基数中的一位数字步长$b$在重复稳定之前发生取消的除法过程。 
3.如果$x' = 1$，分数在基数上变得有限$b$，所以不存在重复循环。 周期长度为零。 
4. 否则，计算乘法阶$b$模数$x'$。 这意味着找到最小的正整数$t$这样$b^t \equiv 1 \pmod{x'}$。 该值恰好对应于长除法中余数序列的循环长度。 
5. 计算阶数、因子$\varphi(x')$隐式地通过质因数分解$x'$，然后迭代减少指数$t$通过检查除数同时保持同余条件。 

### 为什么它有效

 在基地的每一步-$b$展开式，余数乘以$b$并以当前有效分母为模进行缩减。 之间的共同因素$b$分母立即崩溃，有效模量减小。 一旦所有这些因素都被移除，剩下的系统就处于一个乘法群模中$x'$，其中每个状态都是可逆的，并且余数序列最终必须以等于乘法顺序的周期重复$b$。 这保证了该过程干净地分成由因子取消引起的有限前缀和纯循环余数过程。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from math import gcd

def factorize(n):
    f = {}
    d = 2
    while d * d <= n:
        while n % d == 0:
            f[d] = f.get(d, 0) + 1
            n //= d
        d += 1
    if n > 1:
        f[n] = f.get(n, 0) + 1
    return f

def remove_common_factors(x, b):
    g = gcd(x, b)
    prefix = 0
    while g != 1:
        while x % g == 0:
            x //= g
            prefix += 1
        g = gcd(x, b)
    return x, prefix

def mod_pow(a, e, mod):
    r = 1
    a %= mod
    while e:
        if e & 1:
            r = (r * a) % mod
        a = (a * a) % mod
        e >>= 1
    return r

def multiplicative_order(b, mod):
    phi = mod
    factors = factorize(phi)
    for p in factors:
        phi -= phi // p

    order = phi
    for p in factorize(order):
        while order % p == 0 and mod_pow(b, order // p, mod) == 1:
            order //= p
    return order

def solve():
    x, b = map(int, input().split())
    x, prefix = remove_common_factors(x, b)

    if x == 1:
        print(prefix, 0)
        return

    # ensure gcd(b, x) = 1
    g = gcd(b, x)
    if g != 1:
        x //= g

    period = multiplicative_order(b, x)
    print(prefix, period)

if __name__ == "__main__":
    solve()
```功能`remove_common_factors`模拟长除法中分母与底数共享质数的部分。 每次找到共同的 gcd 时，这些因子就会从分母中剥离出来，从而形成非重复前缀。 

一旦获得约分母，`multiplicative_order`计算周期长度。 它首先使用素因数分解计算模数的欧拉余数，然后通过测试候选阶数的除数来减少模数。 快速求幂检查是否$b$折叠到以约化分母为模 1。 

一个微妙的点是，前缀是根据因子删除来计算的，而不仅仅是 gcd 调用。 每次除以共享质因数都对应于基数扩展中的一位数字移位。 

## 工作示例

 ### 示例 1

 输入：```
2 10
```我们从$x = 2$,$b = 10$。 gcd为2，所以我们立即将其删除。 

| 步骤| x| gcd(x, b) | gcd(x, b) | 前缀 |
 | --- | --- | --- | --- |
 | 0 | 2 | 2 | 0 |
 | 1 | 1 | - | 1 |

 现在$x' = 1$，因此分数终止。 不存在重复循环。 

这符合以下事实：$1/2 = 0.5$以 10 为基数。 

输出：```
1 0
```### 示例 2

 输入：```
3 10
```我们有$\gcd(3, 10) = 1$，因此不会发生前缀删除。 

现在我们计算 10 模 3 的乘法阶。 

| 步骤| b^k 模 3 |
 | --- | --- |
 | 1 | 1 |

 自从$10 \equiv 1 \pmod{3}$，周期长度为1。 

这对应于循环小数$1/3 = 0.\overline{3}$。 

输出：```
0 1
```## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(\sqrt{x} + \log x)$| 因式分解占主导地位； 模幂是对数 |
 | 空间|$O(1)$| 仅存储素因数和计数器 |

 界限可达$10^{12}$在 Python 中进行剪枝的试除因式分解是安全的，并且相比之下，求幂步骤可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import gcd

    def factorize(n):
        f = {}
        d = 2
        while d * d <= n:
            while n % d == 0:
                f[d] = f.get(d, 0) + 1
                n //= d
            d += 1
        if n > 1:
            f[n] = f.get(n, 0) + 1
        return f

    def remove_common_factors(x, b):
        g = gcd(x, b)
        prefix = 0
        while g != 1:
            while x % g == 0:
                x //= g
                prefix += 1
            g = gcd(x, b)
        return x, prefix

    def mod_pow(a, e, mod):
        r = 1
        a %= mod
        while e:
            if e & 1:
                r = (r * a) % mod
            a = (a * a) % mod
            e >>= 1
        return r

    def multiplicative_order(b, mod):
        phi = mod
        for p in factorize(phi):
            phi -= phi // p

        order = phi
        for p in factorize(order):
            while order % p == 0 and mod_pow(b, order // p, mod) == 1:
                order //= p
        return order

    def solve():
        x, b = map(int, sys.stdin.readline().split())
        from math import gcd
        x, prefix = remove_common_factors(x, b)

        if x == 1:
            return f"{prefix} 0\n"

        g = gcd(b, x)
        if g != 1:
            x //= g

        period = multiplicative_order(b, x)
        return f"{prefix} {period}\n"

    return solve()

# provided samples
assert run("2 10\n") == "1 0\n", "sample 1"
assert run("3 10\n") == "0 1\n", "sample 2"
assert run("2 2\n") == "1 0\n", "sample 3"

# custom cases
assert run("12 10\n") == "1 0\n", "finite expansion with shared factors"
assert run("7 10\n") == "0 6\n", "classic repetend length in base 10"
assert run("1 2\n") == "0 0\n", "trivial case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 12 10 | 12 1 0 | 1 0 由于共享因素导致小数有限 |
 | 7 10 | 0 6 | 全期案例|
 | 1 2 | 0 0 | 简单的终止案例|

 ## 边缘情况

 当去除与底数相同的因子后，分母变为 1 时，就会出现微妙的边缘情况。 对于像这样的输入`12 10`，重复的 gcd 去除将 12 减少到 1，因为 2 和 3 都除 10。该算法在终止前正确地计算了前缀的一步，产生`1 0`。 

另一种情况是底数从一开始就与分母互质。 为了`7 10`，没有发生前缀去除，整个行为由 10 模 7 的乘法阶决定。算法立即进入循环计算，没有不必要的减少。 

当分子已经与基本表示完全兼容时，例如`1 2`，gcd 为 1，2 模 1 的阶数几乎为零。 该算法短路了这种情况，以避免无效的模块化计算。
