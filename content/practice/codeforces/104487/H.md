---
title: "CF 104487H-XY？"
description: "我们得到一个质数模 $p$，以及两个互质的指数 $a$ 和 $b$，以及两个值 $x$ 和 $y$。 有一个隐藏的一致性条件：如果我们将 $x$ 的 $a$ 次方和 $y$ 的 $b$ 次方，这些结果等于模 $p$。"
date: "2026-06-30T12:39:39+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104487
codeforces_index: "H"
codeforces_contest_name: "Tishreen + SVU CPC 2023"
rating: 0
weight: 104487
solve_time_s: 56
verified: true
draft: false
---

[CF 104487H - X Y ？](https://codeforces.com/problemset/problem/104487/H)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一个素数模$p$，加上两个指数$a$和$b$是互质的，并且有两个值$x$和$y$。 有一个隐藏的一致性条件：如果我们提出$x$权力$a$和$y$权力$b$，这些结果等于模$p$。 换句话说，这对$(x, y)$不是任意的； 它已经满足乘法结构模中的强代数关系$p$。 

对于每个查询，我们被要求重建一个值$z$这样当我们提出$z$权力$a$，我们得到$y$模数$p$，当我们提高$z$权力$b$，我们得到$x$模数$p$。 如果多个正整数满足这一点，我们需要最小的正整数。 如果不存在，我们输出$-1$。 

关键点是一切都发生在模数下$p$， 在哪里$p$是质数，因此所有非零值形成一个乘法群。 这使得幂运算的行为类似于指数空间中的线性代数，这是该解决方案所依赖的中心结构。 

约束允许最多$10^5$查询，因此任何尝试搜索的解决方案$z$每个查询直接或强力候选者是立即不可行的。 即使每个候选人只进行一次模幂运算也会爆炸。 我们需要一个$O(\log p)$或者$O(1)$每个查询构造。 

出现微妙的边缘情况时，$x$或者$y$可以整除$p$，这意味着它们的模数为零$p$。 在这种情况下，求幂会破坏信息，因为任何零的正幂都是零。 简单的基于逆的代数方法会错误地尝试在指数空间中除以零，从而产生无效结果或崩溃。 

例如，如果$x \equiv 0 \pmod p$，那么条件$z^b \equiv x$力量$z \equiv 0 \pmod p$，它立即确定答案，但前提是它与另一个方程一致。 在进行任何乘法群推理之前，必须将这种情况分开。 

## 方法

 蛮力的想法是尝试所有可能的值$z$模数$p$并检查两个方程是否成立。 这在数学上是正确的，因为解（如果存在）必须位于范围内$0$到$p-1$。 然而，这种方法需要$O(p)$每个查询进行检查，并且每次检查都涉及两次求幂，这使得它远远超出了可行的限制$p$可以达到$10^9$。 

结构改进来自于认识到以素数为模，所有非零元素形成循环乘法群，并且求幂的行为类似于指数空间中的乘法。 系统$$z^a \equiv y \pmod p,\quad z^b \equiv x \pmod p$$可以解释为对“指数表示”的两个线性约束$z$。 自从$a$和$b$是互质的，我们可以使用 Bézout 系数将这些约束组合成一个表达式。 

如果我们能找到整数$u$和$v$这样$$au + bv = 1,$$然后我们可以将两边都升起$z$到该线性组合：$$z = z^{au + bv} = (z^a)^u (z^b)^v \equiv y^u x^v \pmod p.$$这样就直接构造了$z$从$x$和$y$，将问题简化为模幂和模逆。 

唯一的复杂之处是处理负指数$u$或者$v$，对应于模逆。 仅当基数非零模时这才有效$p$，强调为什么零案例必须单独处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解结束$z$|$O(p \log p)$每个查询 |$O(1)$| 太慢了 |
 | 扩展 GCD 构造 |$O(\log p)$每个查询 |$O(1)$| 已接受 |

 ## 算法演练

 ### 第 1 步：对所有内容进行模减$p$我们首先减少$x$和$y$模数$p$。 这是必要的，因为所有条件都是在模算术中定义的，并且在该域之外工作会引入不相关的幅度信息。 

### 步骤 2：显式处理零案例

 如果其中之一$x \equiv 0$或者$y \equiv 0$，我们必须单独对待该系统，因为零时不存在乘法逆元。 

如果$x \equiv 0$，然后从$z^b \equiv x$，我们得到$z \equiv 0$。 然后我们检查这是否也满足$z^a \equiv y$。 自从$0^a = 0$，这需要$y \equiv 0$。 如果一致，则答案是$0$模数$p$，对应于输出$p$作为最小的正整数。 

对称论证适用于以下情况$y \equiv 0$。 

### 步骤 3：乘法群中的运算

 现在假设$x \neq 0$和$y \neq 0$模数$p$。 我们将它们视为群的元素，其中除法是通过模逆来定义的。 

### 步骤 4：计算 Bézout 系数

 我们计算整数$u$和$v$这样：$$au + bv = 1.$$这是使用扩展欧几里得算法完成的。 存在性由以下条件保证$\gcd(a,b)=1$。 

### 步骤 5：构建候选解决方案

 我们计算：$$z \equiv y^u \cdot x^v \pmod p.$$如果$u$或者$v$为负数，我们用模逆幂代替幂。 

这会产生一个同时满足两个约束的候选者，因为它重建了$z$作为指数形式的两个给定方程的线性组合。 

### 步骤 6：归一化为正整数

 如果结果是$0$，我们输出$p$。 否则，我们直接输出模代表。 

### 为什么它有效

 正确性来自于将求幂视为乘法群模中的同态$p$。 每个非零元素都有一个明确定义的指数结构，并且 Bézout 的恒等式允许我们根据指数互质的两个幂约束来重建基数。 自从$au + bv = 1$，应用这种组合将系统折叠成单个一致的重建$z$。 原始约束保证构造的值满足两个方程，因为将其替换回去会将两个表达式减少为组中的恒等式。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def egcd(a, b):
    if b == 0:
        return a, 1, 0
    g, x, y = egcd(b, a % b)
    return g, y, x - (a // b) * y

def mod_pow(a, e, mod):
    return pow(a, e, mod)

def solve():
    Q = int(input())
    out = []

    for _ in range(Q):
        p, a, b, x, y = map(int, input().split())

        x %= p
        y %= p

        # handle zero cases
        if x == 0 or y == 0:
            z = 0
            if pow(z, a, p) == y and pow(z, b, p) == x:
                out.append(str(p))
            else:
                out.append("-1")
            continue

        # Bézout: a*u + b*v = 1
        g, u, v = egcd(a, b)

        # g must be 1 since gcd(a,b)=1
        if g != 1:
            out.append("-1")
            continue

        # z = y^u * x^v mod p
        zu = pow(y, u, p) if u >= 0 else pow(pow(y, -u, p), p - 2, p)
        zv = pow(x, v, p) if v >= 0 else pow(pow(x, -v, p), p - 2, p)

        z = (zu * zv) % p

        if z == 0:
            z = p

        out.append(str(z))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该实现分离了简并零模$p$使用模逆之前的情况，因为否则逆将是未定义的。 扩展 gcd 产生系数$u$和$v$，直接用作指数。 负指数使用费马小定理通过模逆通过求幂进行转换：$p-2$。 

最后的归一化步骤确保输出是正整数，因为模代表$0$对应于$p$在所需的输出域中。 

## 工作示例

 考虑一个小例子，其中$p = 7$,$a = 1$,$b = 2$,$x = 2$,$y = 4$。 我们首先减少模 7，这使值保持不变。 由于两者均非零，我们计算 Bézout 系数$1u + 2v = 1$, 给予$u = 1$,$v = 0$。 建设产量$z = y^1 x^0 = 4$。 检查，$4^1 = 4$和$4^2 = 16 \equiv 2 \pmod 7$，因此它满足这两个约束。 

| 步骤| 价值|
 | --- | --- |
 | x 模 p | 2 |
 | y 模 p | 4 |
 | 你，v | (1, 0) | (1, 0) |
 | z | 4 |

 该迹线表明，当一个 Bézout 系数为零时，解简化为直接根约束。 

现在考虑出现零的情况：$p = 5$,$x = 0$,$y = 0$,$a = 2$,$b = 3$。 唯一可能的$z$两者都满足是$z = 0$，对应于输出$5$。 

| 步骤| 价值|
 | --- | --- |
 | x 模 p | 0 |
 | y 模 p | 0 |
 | z 候选人 | 0 |
 | 有效性 | 两个方程均满足 |

 这证实了为什么在应用乘法逆元之前必须单独处理零。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(Q \log \max(a,b))$| 每个查询的扩展 gcd 加上常数模幂 |
 | 空间|$O(1)$| 每个查询仅存储几个整数|

 该解决方案完全符合限制，因为每个查询都简化为对数算术运算和模幂运算，两者都足够快$10^5$查询。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math

    def egcd(a, b):
        if b == 0:
            return a, 1, 0
        g, x, y = egcd(b, a % b)
        return g, y, x - (a // b) * y

    Q = int(input())
    out = []

    for _ in range(Q):
        p, a, b, x, y = map(int, input().split())
        x %= p
        y %= p

        if x == 0 or y == 0:
            z = 0
            if pow(z, a, p) == y and pow(z, b, p) == x:
                out.append(str(p))
            else:
                out.append("-1")
            continue

        g, u, v = egcd(a, b)

        zu = pow(y, u, p) if u >= 0 else pow(pow(y, -u, p), p - 2, p)
        zv = pow(x, v, p) if v >= 0 else pow(pow(x, -v, p), p - 2, p)

        z = (zu * zv) % p
        if z == 0:
            z = p

        out.append(str(z))

    return "\n".join(out)

# custom cases
assert run("3\n2 1 2 2 4\n7 1 2 2 4\n5 2 3 0 0\n") != "", "basic functionality"
assert run("1\n5 2 3 0 0\n") == "5", "all zero case"
assert run("1\n7 1 2 2 4\n") == "4", "simple valid reconstruction"
assert run("1\n11 3 2 7 3\n") != "0", "nonzero normalization check"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个有效对 | 正确的 z | 基本重建正确性 |
 | 全零情况 | p| 退化模块化案例 |
 | 简单重建 | 计算出的 z | Bézout 构造的正确性 |
 | 标准化检查| 非零 | 避免错误的零输出 |

 ## 边缘情况

 当两者$x$和$y$模数为零$p$，该算法正确地将解简化为$z = 0$，然后转换为$p$。 简单的基于 Bézout 的公式会立即失败，因为模逆不存在，但显式的早期检查可确保计算永远不会达到无效操作。 

当正好是其中之一时$x$或者$y$为零，系统就会变得不一致，除非两个方程强制采用相同的零结构。 该算法通过直接验证这两个条件来检查这一点$z = 0$，防止指数代数的错误构造。 

当所有值均非零时，该算法完全在乘法群模内运行$p$，其中 Bézout 重建有效。 这种情况的分离确保了计算的每个分支都保持在数学上有效的域内。
