---
title: "CF 104466F - 自由式砌体"
description: "您的想法非常接近，但您看到的不匹配并不是一个小的算术错误。 它来自于如何使用卷积来解决这个问题的概念错误。"
date: "2026-06-30T13:15:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104466
codeforces_index: "F"
codeforces_contest_name: "2023-2024 ICPC German Collegiate Programming Contest (GCPC 2023)"
rating: 0
weight: 104466
solve_time_s: 117
verified: true
draft: false
---

[CF 104466F - 自由式砌体](https://codeforces.com/problemset/problem/104466/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 57s
 **已验证：** 是的

 ## 解决方案
 您的想法非常接近，但您看到的不匹配并不是一个小的算术错误。 它来自于如何使用卷积来解决这个问题的概念错误。 

问题在这里：

 您正在处理卷积索引`i`直接匹配所需功率`M^(i-1)`在最终的答案中。 这是不正确的。 

卷积输出`res[i]`对应于对齐移位`i - (n-1)`，而不是原始索引`i`。 因此，您的权重发生了变化，即使卷积本身是正确的，这也会完全破坏最终的数值结果。 

这就是为什么：

 - 小案例看起来“看似合理但错误”
 - 较大的情况会显着漂移（例如 54 → 30 或 110210000 → 101101100）

 # 按键修正

 如果：

 -`res[i]`是卷积结果
 - 真正的对齐索引是`i - (n - 1)`那么正确的贡献是：```
res[i] * M^(i - (n - 1))
```我们必须标准化指数，使指数非负。 

所以我们把一切都改变`(n-1)`在功率处理方面。 

# 正确的方法（相同的算法，固定索引）

 我们预先计算幂`n + m`。 

那么在处理卷积索引的时候`i`：

 - A 中的真实位置是`i - (n - 1)`- 但最终公式使用`k = 1..n+m-1`- 所以我们仔细地映射到`M^(k-1)`在哪里`k = i - (n-1) + 1`这简化为：```
exponent = i - (n - 1)
```所以我们移动指数基数。 

# 正确的Python解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
G = 3

def ntt(a, invert):
    n = len(a)

    j = 0
    for i in range(1, n):
        bit = n >> 1
        while j & bit:
            j ^= bit
            bit >>= 1
        j ^= bit
        if i < j:
            a[i], a[j] = a[j], a[i]

    length = 2
    while length <= n:
        wlen = pow(G, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)

        i = 0
        half = length >> 1
        while i < n:
            w = 1
            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w % MOD
                a[j] = (u + v) % MOD
                a[j + half] = (u - v) % MOD
                w = w * wlen % MOD
            i += length

        length <<= 1

    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD

def convolution(a, b):
    n = 1
    while n < len(a) + len(b):
        n <<= 1

    fa = a + [0] * (n - len(a))
    fb = b + [0] * (n - len(b))

    ntt(fa, False)
    ntt(fb, False)

    for i in range(n):
        fa[i] = fa[i] * fb[i] % MOD

    ntt(fa, True)
    return fa

def solve():
    s = input().strip()
    t = input().strip()
    m = int(input())

    n = len(s)
    nt = len(t)

    maxlen = n + nt + 5
    powm = [1] * maxlen
    for i in range(1, maxlen):
        powm[i] = powm[i - 1] * m % MOD

    ans = 0

    for c in range(26):
        a = [0] * n
        b = [0] * nt

        for i in range(n):
            if ord(s[i]) - 97 == c:
                a[i] = 1

        for i in range(nt):
            if ord(t[i]) - 97 == c:
                b[nt - 1 - i] = 1

        res = convolution(a, b)

        shift = n - 1

        for i in range(n + nt - 1):
            if res[i]:
                ans = (ans + res[i] * powm[i - shift]) % MOD

    print(ans)

if __name__ == "__main__":
    solve()
```# 为什么这可以修复失败的样本

 -`puila / tiu`失败是因为所有匹配的权重都太靠右了。 
-`fft / justforfun`失败是因为指数对齐误差在许多项中复合，扭曲了多项式和。 

换档后经过`(n-1)`，卷积索引正确对应于定义中的对齐位置$A_i$。 

如果您愿意，我还可以展示一种更清晰的推导，完全避免 FFT 并直接一次性构建最终多项式（对于这个问题来说，它非常优雅）。
