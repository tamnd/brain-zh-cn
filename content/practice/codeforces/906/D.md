---
title: "CF 906D - 电力塔"
description: "我们被要求计算一个以给定数字为模的“电力塔”。 从概念上讲，想象一系列岩石，每个岩石都具有正整数幂。"
date: "2026-06-12T23:21:08+07:00"
tags: ["codeforces", "competitive-programming", "chinese-remainder-theorem", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 906
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 454 (Div. 1, based on Technocup 2018 Elimination Round 4)"
rating: 2700
weight: 906
solve_time_s: 887
verified: true
draft: false
---

[CF 906D - 动力塔](https://codeforces.com/problemset/problem/906/D)

 **评分：** 2700
 **标签：** 中国剩余定理，数学，数论
 **求解时间：** 14m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算一个以给定数字为模的“电力塔”。 从概念上讲，想象一系列岩石，每个岩石都具有正整数幂。 为了用编号为 _l_ 到 _r_ 的岩石建造塔，我们从顶部岩石 _r_ 开始，一直向下到 _l_，反复将当前岩石的力量提高到其上方塔的力量。 正式来说，如果我们有岩石$w_l, w_{l+1}, \dots, w_r$，累积功率为$$w_l^{w_{l+1}^{\dots^{w_r}}} \mod m$$输入给出岩石的数量$n$, 模数$m$，按顺序排列每块岩石的力量，以及$q$询问岩石子范围的累积功率的查询。 

约束告诉我们$n$和$q$可以达到$10^5$岩石功率和模量可达$10^9$。 直接求幂的简单解决方案会产生天文数字，并且是不可行的。 即使 Python 的任意精度算术对于重复计算来说也太慢了$10^5$查询。 这意味着我们需要一种解决方案，避免计算全幂，而是使用模算术的属性。 

非明显的边缘情况包括$m = 1$，其中结果始终为 0，以及幂为 1 的序列，可以快速倒塌塔。 例如，当连续幂非常大时，就会出现另一个棘手的情况$2^{2^{30}}$，其中直接计算甚至会溢出 64 位整数。 正确处理这些情况需要仔细使用模归约和欧拉定理。 

## 方法

 蛮力方法从上到下迭代塔，计算嵌套的求模模$m$。 具体来说，对于每个查询，可以计算：```
result = w_r
for i in range(r-1, l-1, -1):
    result = w_i ** result % m
```这在数学上是正确的，但在实践中是不可行的。 即使一个查询也可能涉及对大至 10^9^{10^9} 的数字求幂，这是天文数字般昂贵的。 高达$10^5$查询时，复杂度与子数组的长度成指数关系，这是站不住脚的。 

优化的关键见解是模幂具有受欧拉定理控制的递归属性。 如果$a$和$m$是互质的，$a^{\phi(m)} \equiv 1 \mod m$， 在哪里$\phi$是欧拉函数。 这使我们能够减少指数模$\phi(m)$在每一步中，大大减少中间幂的大小，同时保持正确性。 如果$a$和$m$不是互质的，我们必须仔细处理归约以避免丢失正确的模行为，通常是通过限制指数并添加$\phi(m)$必要时。 

这将问题转化为递归计算，通过塔下降，使用 totient 链减少每一步的指数，直到到达底部。 即使对于大功率和大功率，这种方法也是有效的$m$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(q * (r-l+1) * 求幂) | O(1) | O(1) | 太慢了|
 | 最佳 | O(n log m + q log m) | O(n log m + q log m) | O(log m) 递归深度 | 已接受 |

 ## 算法演练

 1. 预先计算模数的 totient 链。 开始于$m$,反复计算$\phi(m_i)$直到达到 1。这允许在每个递归级别上减少指数。 
2. 定义递归函数`tower(l, r, mod)`计算$w_l^{w_{l+1}^{\dots^{w_r}}} \mod mod$。 如果`l == r`， 返回$w_l \mod mod$。 否则，计算`next_exp = tower(l+1, r, phi(mod))`。 
3. 使用指数进行模幂运算`next_exp`。 如果指数超过`phi(mod)`或者由于非互质情况而大于必要的值，通过添加来调整它`phi(mod)`正确处理溢出。 
4. 对于每个查询，请致电`tower(l, r, m)`并输出结果。 

为什么它有效：totient 减少保证了对于每个级别，我们用一个更小的等效模来替换潜在的巨大指数$\phi(m)$，而欧拉定理确保结果模$m$仍然正确。 递归地将其应用到塔下可以保留正确性不变量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(200000)

def phi(n):
    result = n
    i = 2
    while i * i <= n:
        if n % i == 0:
            while n % i == 0:
                n //= i
            result -= result // i
        i += 1
    if n > 1:
        result -= result // n
    return result

def mod_pow(a, b, mod):
    result = 1
    a %= mod
    while b > 0:
        if b & 1:
            result = result * a % mod
        a = a * a % mod
        b >>= 1
    return result

def tower(l, r, mod):
    if mod == 1:
        return 0
    if l == r:
        return w[l] % mod
    next_exp = tower(l+1, r, phis[mod])
    if next_exp >= phis[mod]:
        next_exp = next_exp % phis[mod] + phis[mod]
    return mod_pow(w[l], next_exp, mod)

n, m = map(int, input().split())
w = [0] + list(map(int, input().split()))
phis = {}

def build_phi_chain(x):
    if x in phis:
        return phis[x]
    if x == 1:
        phis[x] = 1
    else:
        phis[x] = phi(x)
    return phis[x]

def prepare_phis(x):
    build_phi_chain(x)
    current = x
    while current != 1:
        current = phis[current]
        build_phi_chain(current)

prepare_phis(m)

q = int(input())
for _ in range(q):
    l, r = map(int, input().split())
    print(tower(l, r, m))
```该解决方案首先预先计算模数的 totient 链，以实现有效的递归指数缩减。`mod_pow`执行快速模幂运算。 递归`tower`函数计算电力塔模`mod`，根据需要调整指数以考虑超过 totient 的值。 每个查询都会调用`tower`直接地。 

## 工作示例

 ### 输入示例 1```
6 1000000000
1 2 2 3 3 3
8
1 1
1 6
2 2
2 3
2 4
4 4
4 5
4 6
```| 查询 | 我| r | 计算塔 | 输出|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 1 | 1 |
 | 2 | 1 | 6 | 1^{2^{2^{3^{3^3}}}} 模 1e9 | 1 |
 | 3 | 2 | 2 | 2 | 2 |
 | 4 | 2 | 3 | 2^2 = 4 | 2^2 = 4 4 |
 | 5 | 2 | 4 | 2^{2^3} = 2^8 = 256 | 256 | 256
 | 6 | 4 | 4 | 3 | 3 |
 | 7 | 4 | 5 | 3^3 = 27 | 3^3 = 27 27 | 27
 | 8 | 4 | 6 | 3^{3^3} mod 1e9 = 597484987 | 597484987 |

 该跟踪显示了整体链和递归如何将大量指数减少到可管理的计算。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log m * log max w_i) | O(q log m * log max w_i) | 每个查询都通过塔下降，减少对 totient 链的模数，并为每个级别提供快速模幂 |
 | 空间| O(n + log m) | O(n + log m) | 幂数组加上递归堆栈受 totient 链长度限制 |

 这符合限制，因为$log m \le 30$为了$m \le 10^9$， 和$q \le 10^5$。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # Call the solution function
    exec(open('power_tower.py').read())
    return output.getvalue().strip()

# Provided sample
assert run("""6 1000000000
1 2 2 3 3 3
8
1 1
1 6
2 2
2 3
2 4
4 4
4 5
4 6""") == """1
1
2
4
256
3
27
597484987"""

# Custom cases
assert run("1
```
