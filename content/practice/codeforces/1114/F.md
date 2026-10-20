---
title: "CF 1114F - 请再对数组进行查询吗？"
description: "我们有一个整数数组，每个整数在 1 到 300 之间，并且需要处理两种类型的查询。 第一个查询将数组的连续段乘以给定数字。"
date: "2026-06-12T04:53:50+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures", "divide-and-conquer", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1114
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 538 (Div. 2)"
rating: 2400
weight: 1114
solve_time_s: 67
verified: true
draft: false
---

[CF 1114F - 请再对数组进行查询？](https://codeforces.com/problemset/problem/1114/F)

 **评分：** 2400
 **标签：** 位掩码、数据结构、分而治之、数学、数论
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个整数数组，每个整数在 1 到 300 之间，并且需要处理两种类型的查询。 第一个查询将数组的连续段乘以给定数字。 第二个查询要求数组的一段的乘积的欧拉函数，模$10^9 + 7$。 欧拉 totient 函数，$\varphi(n)$, 计算整数到$n$与 互质$n$。 由于乘法在乘积上是分布式的，因此乘法查询会更改段中每个元素的素因数分解，这反过来会影响包括这些元素的任何段的总和。 

限制很重要：数组最多可以有 400,000 个元素，并且可以有 200,000 个查询。 每次重新计算乘积，甚至重新计算每个段的质因数分解的简单方法会执行太多操作。 具体来说，为每个查询重新计算一个产品$O(n)$会产生$O(nq)\approx 8 \cdot 10^{10}$操作，这远远超出了 6 秒时间限制的可接受范围。 

不明显的边缘情况包括包含 1 的段。1 的总和是 1，因此任何完全由 1 组成的段都必须返回 1。类似地，乘以 1 的操作不会改变任何内容，但仍必须在我们的结构中进行跟踪。 如果使用类似的公式，假设所有元素都大于 1 的粗心实现可能会错误地计算零$\prod (p_i-1)p_i^{k_i-1}$对于素数$p_i$划分产品。 

另一个微妙之处是段元素的乘积可能会变得非常大，很快就会超过 64 位整数。 这会妨碍直接计算乘积； 该解决方案必须间接地使用乘法结构，最好是通过素数指数。 

## 方法

 暴力方法将通过迭代来处理 MULTIPLY 查询$l$到$r$并将每个元素相乘，然后通过计算段的乘积并分解它来处理 TOTIENT 查询。 这适用于小型数组，因为数组元素以 300 为界，因此它们的分解成本很低。 但是，如果有 400,000 个元素和 200,000 个查询，此方法可能需要多达$8 \cdot 10^{10}$乘法或因式分解，这是完全不可行的。 

关键的见解是这两种运算在素因数的指数空间中都是线性的。 从 1 到 300 的每个整数都有一组固定的质因数，将某个段乘以一个数字相当于将该段中的每个元素添加相应的质数指数。 类似地，计算乘积的 totient 可以简化为素数指数的组合：$\varphi(\prod a_i) = \prod p^{k_i-1}(p-1)$对于所有素数$p$划分产品。 这让我们可以为每个段存储素数位掩码或指数向量，并使用具有惰性传播的段树有效地更新/查询它。 

我们预先计算 300 以内所有数字的素数分解。然后，我们用组合的素数信息表示线段树中的每个线段。 乘法查询添加指数向量，totient 查询组合指数向量并计算 totient 模$10^9 + 7$。 使用位掩码来跟踪哪些素数划分了一个段，可以实现极快的组合操作。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * q * 8) | O(n) | 太慢了|
 | 线段树 + 位掩码指数 | O((n + q) * log n * P) | O(n * P) | 已接受 |

 这里，$P$是 ≤ 300 的素数个数，即 62。 

## 算法演练

 1. 使用筛子预先计算 300 以内的所有素数。 每个号码$1 \le x \le 300$与划分它的素数位掩码相关联。 店铺$\varphi(x)$如果需要，作为一个单独的表，最多可容纳 300 个数字。 
2. 对于数组中的每个元素，将其值转换为表示其素数因子的位掩码以及每个素数的指数向量。 
3. 在数组上构建一棵线段树，其中每个节点存储两条信息：该线段中素数的累积指数向量以及表示哪些素数除该线段中任何元素的位掩码。 
4. 对于 MULTIPLY 查询，将乘数转换为其指数向量和位掩码。 对线段树应用延迟更新，将指数添加到受影响的范围。 对位掩码使用按位或来指示素数的存在。 
5. 对于 TOTIENT 查询，查询线段树以获取该范围的累积指数向量和位掩码。 使用以下方法计算样本$\varphi(\prod a_i) = \prod_{p} p^{k_p - 1} (p-1)$模数$10^9 + 7$， 在哪里$k_p$是素数的总指数$p$在段中。 
6. 按顺序输出结果。 

**为什么有效：** 具有指数向量的线段树保证对于任何查询范围，我们都知道该线段的精确组合素因数分解。 延迟传播确保在目标查询之前正确累积多次乘法，从而保留每个节点准确表示其段的不变性。 位掩码允许快速组合并避免重新计算存在的素数。 正确性依赖于总函数的乘法性和乘法下指数的加法性质。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

# Precompute primes and factorizations
MAX_A = 300
primes = []
is_prime = [True] * (MAX_A+1)
is_prime[0] = is_prime[1] = False
for i in range(2, MAX_A+1):
    if is_prime[i]:
        primes.append(i)
        for j in range(i*i, MAX_A+1, i):
            is_prime[j] = False

prime_index = {p:i for i,p in enumerate(primes)}
P = len(primes)

# Factorization as exponent vector
def factorize(x):
    exps = [0]*P
    for i,p in enumerate(primes):
        while x % p == 0:
            x //= p
            exps[i] += 1
    return exps

class SegmentTree:
    def __init__(self, data):
        self.n = len(data)
        self.size = 1
        while self.size < self.n:
            self.size *= 2
        self.tree = [[0]*P for _ in range(2*self.size)]
        self.lazy = [[0]*P for _ in range(2*self.size)]
        for i in range(self.n):
            self.tree[self.size + i] = data[i]
        for i in range(self.size-1, 0, -1):
            for j in range(P):
                self.tree[i][j] = self.tree[2*i][j] + self.tree[2*i+1][j]

    def push(self, v, l, r):
        for j in range(P):
            if self.lazy[v][j]:
                self.tree[v][j] += self.lazy[v][j]*(r-l+1)
                if v < self.size:
                    self.lazy[2*v][j] += self.lazy[v][j]
                    self.lazy[2*v+1][j] += self.lazy[v][j]
                self.lazy[v][j] = 0

    def update(self, ql, qr, add, v=1, l=0, r=None):
        if r is None:
            r = self.size-1
        self.push(v,l,r)
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            for j in range(P):
                self.lazy[v][j] += add[j]
            self.push(v,l,r)
            return
        m = (l+r)//2
        self.update(ql, qr, add, 2*v, l, m)
        self.update(ql, qr, add, 2*v+1, m+1, r)
        for j in range(P):
            self.tree[v][j] = self.tree[2*v][j] + self.tree[2*v+1][j]

    def query(self, ql, qr, v=1, l=0, r=None):
        if r is None:
            r = self.size-1
        self.push(v,l,r)
        if qr < l or r < ql:
            return [0]*P
        if ql <= l and r <= qr:
            return self.tree[v][:]
        m = (l+r)//2
        left = self.query(ql, qr, 2*v, l, m)
        right = self.query(ql, qr, 2*v+1, m+1, r)
        return [left[j]+right[j] for j in range(P)]

def mod_pow(a,b):
    res=1
    while b>0:
        if b&1:
            res=res*a%MOD
        a=a*a%MOD
        b>>=1
    return res

def totient(exps):
    res = 1
    for i,p in enumerate(primes):
        k = exps[i]
        if k > 0:
            res = res *
```
