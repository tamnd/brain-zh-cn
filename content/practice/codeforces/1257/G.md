---
title: "CF 1257G - 除数组"
description: "输入不直接给出数字。 相反，它将其素数分解作为素数因子列表给出，其中相等的素数可能出现多次。 假设素数 $q$ 出现 $c$ 次。 然后每个除数为该素数选择一个介于 $0$ 和 $c$ 之间的指数。"
date: "2026-06-11T20:50:29+07:00"
tags: ["codeforces", "competitive-programming", "divide-and-conquer", "fft", "greedy", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 1257
codeforces_index: "G"
codeforces_contest_name: "Educational Codeforces Round 76 (Rated for Div. 2)"
rating: 2600
weight: 1257
solve_time_s: 119
verified: true
draft: false
---

[CF 1257G - 除数集](https://codeforces.com/problemset/problem/1257/G)

 **评分：** 2600
 **标签：** 分而治之、fft、贪心、数学、数论
 **求解时间：** 1m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 输入不直接给出数字。 相反，它将其素数分解作为素数因子列表给出，其中相等的素数可能出现多次。 

假设有一个素数$q$出现$c$次。 然后每个除数选择一个指数$0$和$c$为了那个素数。 如果不同素数有重数$$c_1,c_2,\dots,c_k,$$那么每个除数对应一个向量$$(e_1,e_2,\dots,e_k), \qquad 0 \le e_i \le c_i.$$整除关系变得非常简单：$$(e_1,\dots,e_k)\mid(f_1,\dots,f_k)$$当且仅当$$e_i \le f_i$$对于每个坐标。 

我们必须找到最大可能的除数集合，使得没有两个不同的除数在整除性下具有可比性。 在偏序集术语中，我们正在寻找最大反链的大小。 

输入因子的个数最多为$2\cdot10^5$。 枚举除数是不可能的。 如果所有因数互不相同，则除数的个数为$2^n$，这是一个天文数字。 任何解决方案都必须直接处理相等素数的重数。 

一个微妙的点是答案不是除数的数量。 例如：```
n = 3
primes = [2,3,5]
```除数形成三维布尔格。 最大的反链有规模$3$， 不是$8$。 

另一个容易犯的错误是在没有证明的情况下就假设所有具有相同数量素因数的除数总是最优的。 考虑：```
x = 2^3
```除数是$1,2,4,8$。 每对都具有可比性，因此最大的好组有尺寸$1$。 除数晶格的结构很重要。 

第三个陷阱是尝试使用阶乘公式计算给定等级的除数。 重数可以大到$2\cdot10^5$，并且每个素数的指数是独立有界的。 正确的计数对象是生成函数，而不是多项式系数。 

## 方法

 蛮力视图很有用，因为它揭示了底层的组合结构。 

每个除数对应一个指数向量。 一个好的集合是链积偏序集中的反链$$[0,c_1]\times[0,c_2]\times\cdots\times[0,c_k].$$暴力解决方案将生成所有除数，建立整除关系，并搜索最大的反链。 这是没有希望的，因为除数的数量可能是指数级的$n$。 

关键的观察是这个偏序集的排名是$$r(e_1,\dots,e_k)=e_1+\cdots+e_k.$$同一等级的两个不同元素无法进行比较。 如果$$e_i\le f_i$$对于每个坐标且秩和都相等，则所有坐标必须相等。 

所以每个等级都自动成为反链。 

现在，一个深刻的定理出现了。 链的乘积是秩对称的且是秩单峰的，并且满足Sperner性质。 对于这样的偏序集，最大反链的大小等于最大秩的大小。 

总排名范围为$0$到$$c_1+\cdots+c_k=n.$$由于等级大小是对称且单峰的，因此最大的等级是中间的等级：$$\left\lfloor \frac n2 \right\rfloor .$$因此，整个问题简化为计算满足的指数向量$$0\le e_i\le c_i, \qquad e_1+\cdots+e_k=\left\lfloor\frac n2\right\rfloor.$$这正好是系数$$\prod_{i=1}^{k}(1+x+x^2+\cdots+x^{c_i})$$在学位$\lfloor n/2\rfloor$。 

剩下的任务是多项式乘法。 

每个因子都是以下形式的多项式$$1+x+\cdots+x^{c_i}.$$所有度数的总和是$$c_1+\cdots+c_k=n\le 2\cdot10^5.$$使用分而治之的策略将所有多项式相乘，NTT 给出了一个可接受的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 除数的指数 | 指数| 太慢了|
 | 最佳 |$O(n\log^2 n)$|$O(n\log n)$| 已接受 |

 ## 算法演练

 1. 计算每个素数在因式分解中出现的次数。 

如果素数出现$c$次，它贡献了多项式$$1+x+\cdots+x^c.$$2. 为每个重数创建一个多项式。 

系数全为 1，因为每个指数$0$通过$c$只允许一次。 
3. 重复将两个最小的多项式相乘。 

这类似于最佳合并模式。 它使中间多项式尺寸保持较小并减少总 NTT 工作。 
4.使用模数下的数论变换$998244353$对于每个乘法。 

专门选择该模数是因为它支持高效的 NTT。 
5、所有多项式合并后，得到最终的生成函数$$F(x)=\prod_i(1+x+\cdots+x^{c_i}).$$6.输出次数系数$$\left\lfloor \frac n2 \right\rfloor.$$根据链乘积的 Sperner 性质，该系数等于良好子集的最大大小。 

### 为什么它有效

 除数格是链的乘积。 其秩函数是总指数和。 每个等级形成一个反链，因为具有相同等级的可比较元素必须是相同的。 

链的乘积是Sperner偏集，因此最大的反链正是最大的秩。 排名大小由生成函数计算$$\prod_i(1+x+\cdots+x^{c_i}),$$对称性加上单峰性将最大等级置于度$\lfloor n/2\rfloor$。 该算法精确计算该系数，因此返回值是最大良好子集的大小。 

## Python 解决方案```python
import sys
from collections import Counter
from heapq import heapify, heappop, heappush

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

        for i in range(0, n, length):
            w = 1
            half = length // 2
            for j in range(i, i + half):
                u = a[j]
                v = a[j + half] * w % MOD

                a[j] = (u + v) % MOD
                a[j + half] = (u - v) % MOD

                w = w * wlen % MOD

        length <<= 1

    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD

def multiply(a, b):
    need = len(a) + len(b) - 1
    n = 1
    while n < need:
        n <<= 1

    fa = a[:] + [0] * (n - len(a))
    fb = b[:] + [0] * (n - len(b))

    ntt(fa, False)
    ntt(fb, False)

    for i in range(n):
        fa[i] = fa[i] * fb[i] % MOD

    ntt(fa, True)
    return fa[:need]

def solve():
    n = int(input())
    primes = list(map(int, input().split()))

    freq = Counter(primes)

    heap = []
    uid = 0

    for c in freq.values():
        poly = [1] * (c + 1)
        heap.append((len(poly), uid, poly))
        uid += 1

    heapify(heap)

    while len(heap) > 1:
        _, _, a = heappop(heap)
        _, _, b = heappop(heap)

        c = multiply(a, b)

        heappush(heap, (len(c), uid, c))
        uid += 1

    result = heap[0][2]
    print(result[n // 2] % MOD)

if __name__ == "__main__":
    solve()
```频率计数步骤将质因数分解转换为重数$c_i$。 每个重数立即变成多项式$1+x+\dots+x^{c_i}$。 

优先级队列对于正确性来说不是必需的，但它可以显着提高性能。 首先乘以小多项式可以使 NTT 工作总量接近最优。 

NTT 实现在模数下执行标准迭代变换$998244353$。 变换两个操作数后，将系数逐点相乘并变换回来。 

最终多项式的次数完全一致$n$。 程度$d$计算坐标和等于的指数向量$d$。 由于最大反链位于rank$\lfloor n/2\rfloor$，该系数就是答案。 

## 工作示例

 ### 示例 1

 输入：```
3
2999999 43 2999957
```所有素数都是不同的。 

多重性：

 | 总理| 计数|
 | ---| ---|
 | 2999999 | 2999999 1 |
 | 43 | 43 1 |
 | 2999957 | 2999957 1 |

 多项式：

 | 步骤| 多项式|
 | ---| ---|
 | 初始| (1+x), (1+x), (1+x) | (1+x), (1+x), (1+x) |
 | 合并后| (1+2x+x²) |
 | 决赛| 1+3x+3x²+x³ |

 目标度数为：$$\lfloor 3/2\rfloor=1.$$| 学位| 系数|
 | ---| ---|
 | 0 | 1 |
 | 1 | 3 |
 | 2 | 3 |
 | 3 | 1 |

 回答：```
3
```这正是布尔格的中间层。 

### 示例 2

 输入：```
6
2 3 2 3 2 2
```这里$$x=2^4\cdot3^2.$$多重性：

 | 总理| 计数|
 | ---| ---|
 | 2 | 4 |
 | 3 | 2 |

 多项式：

 | 步骤| 多项式|
 | ---| ---|
 | 初始| (1+x+x²+x³+x⁴), (1+x+x²) |
 | 决赛| 1+2x+3x²+3x³+3x⁴+2x⁵+x⁶ |

 目标学位：$$6/2=3.$$| 学位| 系数|
 | ---| ---|
 | 0 | 1 |
 | 1 | 2 |
 | 2 | 3 |
 | 3 | 3 |
 | 4 | 3 |
 | 5 | 2 |
 | 6 | 1 |

 回答：```
3
```该迹线显示了斯佩纳论证背后的等级对称性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n\log^2 n)$| NTT 乘以总学位$n$使用分而治之的合并 |
 | 空间|$O(n\log n)$| 多项式存储和 NTT 缓冲区 |

 由于总度数永远不会超过$2\cdot10^5$，基于 NTT 的方法很容易满足 5 秒限制和内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io
from collections import Counter

def run(inp: str) -> str:
    MOD = 998244353

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n = int(input())
    p = list(map(int, input().split()))

    freq = Counter(p)

    dp = [1]
    for c in freq.values():
        ndp = [0] * (len(dp) + c)
        for i, v in enumerate(dp):
            for e in range(c + 1):
                ndp[i + e] += v
        dp = ndp

    return str(dp[n // 2] % MOD) + "\n"

# sample 1
assert run("3\n2999999 43 2999957\n") == "3\n"

# sample 2
assert run("6\n2 3 2 3 2 2\n") == "3\n"

# minimum size
assert run("1\n2\n") == "1\n"

# all equal
assert run("5\n2 2 2 2 2\n") == "1\n"

# two distinct primes
assert run("2\n2 3\n") == "2\n"

# multiplicities (2,2)
assert run("4\n2 2 3 3\n") == "3\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 2`|`1`| 尽可能最小的输入 |
 |`2 2 2 2 2`|`1`| 单链，每双都具有可比性 |
 |`2 3`|`2`| 二维布尔格 |
 |`2 2 3 3`|`3`| 两条非平凡链的乘积 |

 ## 边缘情况

 考虑：```
1
2
```重数向量是$(1)$。 生成函数是$$1+x.$$目标度为$0$。 系数为$1$，这符合链具有最大反链大小的事实$1$。 

现在考虑：```
5
2 2 2 2 2
```重数向量是$(5)$。 生成函数是$$1+x+x^2+x^3+x^4+x^5.$$目标度为$2$。 其系数为$1$。 每个除数都位于一条链上$$1<2<4<8<16<32,$$所以没有反链可以包含多个元素。 

最后考虑：```
4
2 2 3 3
```重数是$(2,2)$。 生成函数是$$(1+x+x^2)^2 = 1+2x+3x^2+2x^3+x^4.$$中间系数为$3$。 秩的三个指数向量$2$是$$(0,2),\ (1,1),\ (2,0),$$并且它们形成了最大反链。 该算法精确计算该系数。
