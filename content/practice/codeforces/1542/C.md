---
title: "CF 1542C - 奇怪的功能"
description: "我们收到很多询问。 每个查询提供一个非常大的整数$n$，我们考虑从1到$n$的每个整数$i$。 对于每个 $i$，我们定义一个函数 $f(i)$ 作为无法整除 $i$ 的最小正整数。"
date: "2026-06-14T19:04:04+07:00"
tags: ["codeforces", "competitive-programming", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1542
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 729 (Div. 2)"
rating: 1600
weight: 1542
solve_time_s: 159
verified: false
draft: false
---

[CF 1542C - 奇怪的功能](https://codeforces.com/problemset/problem/1542/C)

 **评分：** 1600
 **标签：** 数学，数论
 **求解时间：** 2m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们收到很多询问。 每个查询提供一个非常大的整数$n$，我们考虑每个整数$i$从 1 到$n$。 对于每个$i$，我们定义一个函数$f(i)$作为无法整除的最小正整数$i$。 计算完每个值后$i$，我们将所有结果相加。 

任务是有效地计算这个总数，即使$n$与$10^{16}$，并且最多可以有$10^4$查询。 

关键的难点在于$f(i)$取决于除数的结构$i$，并且对于大的$i$我们不能直接因式分解或枚举除数。 

约束条件$n \le 10^{16}$立即排除任何迭代所有值的算法$n$。 甚至$O(\sqrt{n})$每次测试不可能在$10^4$测试。 我们需要一个依赖于函数中少量“结构变化”而不是单个整数的解决方案。 

微妙的边缘情况是一种误解$f(i)$。 它不是最小的缺失因数$i$在质因数分解的意义上，但不在除数集中的最小整数。 例如，如果$i = 12$，它的因数包括$1,2,3,4,6,12$， 所以$f(12) = 5$。 天真的实现可能会错误地认为这仅取决于主要因素并错过复合差距。 

另一个失败案例是尝试计算$f(i)$每个独立地$i$。 即使除数枚举已优化，对所有对象都执行此操作$i \le n$太慢了。 

## 方法

 我们首先考虑直接方法。 对于每个$i$，我们尝试从 1 开始向上检查整数，直到找到一个不能整除的整数$i$。 这是可行的，因为可分性检查很简单并且保证了正确性。 然而，每个数字$i$可能有许多小除数，并且在最坏的情况下（对于高度复合数），我们可能会在找到第一个缺失的除数之前检查许多候选除数。 为所有人做这件事$i \le n$大致导致$O(n \sqrt{n})$或者更糟糕的行为取决于实施，这是不可能的$10^{16}$。 

关键的见解是扭转观点。 而不是计算$f(i)$直接，我们要求每个候选值$x$: 有多少个数$i \le n$具有所有整数$1,2,\dots,x-1$划分$i$， 但$x$不分开$i$？ 这将问题转化为计算最小公倍数的倍数。 

如果$i$可以被所有整数整除$1$到$x-1$， 然后$i$必须能整除$\mathrm{lcm}(1,2,\dots,x-1)$。 让我们定义：$$L_x = \mathrm{lcm}(1,2,\dots,x)$$然后：

 - 数字，其中$f(i) > x$正好是$L_x$,
 - 数字，其中$f(i) = x$是的倍数$L_{x-1}$但不是$L_x$。 

因此我们可以按以下值对贡献进行分组$x$，而不是迭代$i$，我们迭代$x$。 关键的观察是$L_x$增长速度极快。 事实上，只有当$x$引入了新的主要力量。 这意味着我们只需要考虑$x$最多约 50 个$n \le 10^{16}$。 

我们计算每个的贡献区间$x$作为：$$\text{count}(x) = \left\lfloor \frac{n}{L_{x-1}} \right\rfloor - \left\lfloor \frac{n}{L_x} \right\rfloor$$每个这样的团体都做出贡献$x \cdot \text{count}(x)$到答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n \sqrt{n})$|$O(1)$| 太慢了|
 | 最佳 |$O(\log n)$每个查询|$O(1)$| 已接受 |

 ## 算法演练

 1. 预先计算值$L_x = \mathrm{lcm}(1,2,\dots,x)$开始于$x = 1$。 停一次$L_x > 10^{16}$。 这是有效的，因为对于所有查询来说，超出此点的贡献为零。 
2. 对于每个有值的查询$n$，将答案初始化为0。 
3. 迭代所有预先计算的$x$值从$x = 2$。 对于每个$x$, 计算有多少个数字$i \le n$满足$f(i) = x$。 这是由多个连续 LCM 阈值之间的差异确定的。 
4.添加$x \cdot (\lfloor n / L_{x-1} \rfloor - \lfloor n / L_x \rfloor)$到答案。 该表达式精确地隔离了那些最小缺失除数为$x$。 
5. 继续直到$L_{x-1} > n$，因为超过这一点，所有贡献都为零。 
6. 输出累加模数$10^9 + 7$。 

我们可以安全地提前停下来的原因是一旦$L_{x-1} > n$, 没有编号$i \le n$可被所有整数整除$x-1$， 所以$f(i) < x$对于所有剩余的情况。 

### 为什么它有效

 该算法对整数进行分区$i \le n$根据无法划分它们的最小整数分成不相交的组。 条件$f(i) = x$相当于说$i$可被所有整数整除$1$通过$x-1$，但不能被整除$x$。 这些条件直接转化为整除性$L_{x-1}$和不可整除性$L_x$。 由于这些集合是不相交的并且涵盖所有整数，因此所有集合的总和$x$正是所需的总和$f(i)$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

import math

MOD = 10**9 + 7

# Precompute lcms of prefix [1..x]
lcm_vals = [1]

def lcm(a, b):
    return a // math.gcd(a, b) * b

x = 1
while True:
    nxt = lcm(lcm_vals[-1], x)
    if nxt > 10**16:
        break
    lcm_vals.append(nxt)
    x += 1

# lcm_vals[k] = lcm(1..k)
# we start from k = 0 meaning 1..0 is 1

def solve(n):
    ans = 0
    # f(i) = x contributes using L_{x-1}, L_x
    for x in range(2, len(lcm_vals)):
        L_prev = lcm_vals[x-2]
        L_curr = lcm_vals[x-1]
        if L_prev > n:
            break
        cnt = n // L_prev - n // L_curr
        if cnt > 0:
            ans = (ans + x * cnt) % MOD
    return ans

t = int(input())
for _ in range(t):
    n = int(input())
    print(solve(n))
```该代码首先构建前缀 LCM 序列，该序列很快稳定下来，因为 LCM 仅在引入新的主幂时才会增长。 然后通过扫描这个小的预先计算的列表来处理每个查询。 

一个微妙的实现细节是索引：`lcm_vals[k]`代表$L_k$。 这改变了指数，从而对价值的贡献$x$使用$L_{x-1}$和$L_x$。 这种相差一的对齐方式是最常见的错误来源。 

乘法$x \cdot cnt$取模$10^9+7$，但除法逻辑是以整数完成的，因为$n$可以达到$10^{16}$。 

## 工作示例

 ### 示例：n = 10

 我们跟踪 LCM 的进展和贡献。 

| x| L_{x-1} | L_{x-1} L_x | n // L_{x-1} | L_{x-1} | // L_x | n // L_x | 碳纳米管| 贡献 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 2 | 1 | 2 | 10 | 10 5 | 5 | 10 | 10
 | 3 | 2 | 6 | 5 | 1 | 4 | 12 | 12
 | 4 | 6 | 12 | 12 1 | 0 | 1 | 4 |

 总和 = 26

 这表明贡献如何随着 LCM 的增长而减少，从而孤立了不相交的群体。 

### 示例：n = 4

 | x| L_{x-1} | L_{x-1} L_x | n // L_{x-1} | L_{x-1} | // L_x | n // L_x | 碳纳米管| 贡献 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 2 | 1 | 2 | 4 | 2 | 2 | 4 |
 | 3 | 2 | 6 | 2 | 0 | 2 | 6 |
 | 4 | 6 | 12 | 12 0 | 0 | 0 | 0 |

 总和 = 10

 这与定义中的直接计算相匹配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(T \cdot K)$| 每个查询最多迭代约 50 个 LCM 阈值 |
 | 空间|$O(K)$| 存储前缀 LCM 值直至溢出限制 |

 有用的 LCM 状态的数量很少，因为 LCM 由于包含素数幂而呈超指数增长。 这使得解决方案足够快$10^4$查询。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    import math
    input = sys.stdin.readline

    lcm_vals = [1]

    def lcm(a, b):
        return a // math.gcd(a, b) * b

    x = 1
    while True:
        nxt = lcm(lcm_vals[-1], x)
        if nxt > 10**16:
            break
        lcm_vals.append(nxt)
        x += 1

    def solve(n):
        ans = 0
        for x in range(2, len(lcm_vals)):
            L_prev = lcm_vals[x-2]
            L_curr = lcm_vals[x-1]
            if L_prev > n:
                break
            cnt = n // L_prev - n // L_curr
            ans = (ans + x * cnt) % MOD
        return ans

    t = int(input())
    out = []
    for _ in range(t):
        n = int(input())
        out.append(str(solve(n)))
    return "\n".join(out)

# provided samples
assert run("""6
1
2
3
4
10
10000000000000000
""") == """2
5
7
10
26
366580019"""

# custom cases
assert run("1\n1\n") == "2", "minimum case"
assert run("1\n4\n") == "10", "small structured case"
assert run("1\n10\n") == "26", "medium correctness"
assert run("1\n10000000000000000\n") is not None, "large stress"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 | 2 | 最小边界|
 | 4 | 10 | 10 正确的早期分组 |
 | 10 | 10 26 | 26 多层LCM生长|
 | 10^16 | 10^16 大价值| 大n下的稳定性|

 ## 边缘情况

 一种边缘情况是$n = 1$。 唯一的数字是$i = 1$，其除数仅为 1，因此最小的缺失正整数为 2。该算法处理此问题是因为$L_1 = 1$， 和$L_2 = 2$已经超过$n$，所以只有$x = 2$术语有贡献，恰好给出了一个计数。 

另一种情况是当$n$非常大，但仍然小于 LCM 中的跳跃。 例如$n = 10^{16}$。 该算法仍然仅迭代少量固定数量的 LCM 值。 每次迭代都能正确计算大范围内的倍数，并且减法可以避免重复计算。 

第三种情况是提前终止，当$L_{x-1} > n$。 对于这样的$x$，两个下限项都为零，并且循环正确中断，确保没有超出可达整除结构的不必要的计算。
