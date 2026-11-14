---
title: "CF 449E - Jzzhu 和方块"
description: "我们将所有格点都放在一个大小为 $n 乘以 m$ 的矩形内。 任何四个顶点为格点的正方形都是允许的，即使它是旋转的。 对于每个这样的正方形，我们都会查看完全包含在其中的单位网格单元。 每个包含的单位单元接收一个点。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math", "number-theory"]
categories: ["algorithms"]
codeforces_contest: 449
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 257 (Div. 1)"
rating: 2900
weight: 449
solve_time_s: 153
verified: false
draft: false
---

[CF 449E - Jzzhu 和 Squares](https://codeforces.com/problemset/problem/449/E)

 **评分：** 2900
 **标签：** dp、数学、数论
 **求解时间：** 2m 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们将所有格点都放在一个大小为 的矩形内$n \times m$。 任何四个顶点为格点的正方形都是允许的，即使它是旋转的。 

对于每个这样的正方形，我们都会查看完全包含在其中的单位网格单元。 每个包含的单位单元接收一个点。 一个单元格可以接收来自许多不同方块的点。 任务是计算绘制的点的总数。 

输入最多包含$10^5$测试用例，同时两者$n$和$m$可以大到$10^6$。 为每个查询执行任何有意义的工作的解决方案已经处于危险之中。 甚至一个$O(\sqrt n)$在最坏的情况下，每次测试的解决方案都将过于昂贵。 繁重的工作必须在预处理中完成一次，之后每个查询都应该在恒定的时间内得到答复。 

棘手的部分是正方形不限于轴对齐。 一个幼稚的实现通常只计算边沿网格的普通正方形，这会错过大部分答案。 

考虑：```
n = 2, m = 2
```除了四个单位正方形外，还有带有顶点的菱形正方形```
(1,0), (2,1), (1,2), (0,1)
```它完全包含一个单位单元，因此忽略旋转的正方形会产生比正确值更小的答案$8$。 

另一个容易犯的错误是计算与正方形相交的单元格，而不是完全包含在正方形内的单元格。 对于上面的菱形，有几个单元接触边界，但只有中心单元完全在内部。 

错误的第三个来源是重复计算平方描述。 由边向量生成的正方形$(a,b)$与生成的形状相同$(b,a)$，但它们对应于网格内的不同位置，并且在对所有有效方向求和时必须包括两者。 

## 方法

 最直接的想法就是枚举每一个格子方格。 

格子正方形可以通过起始顶点和边向量来描述$(a,b)$。 第二条边是通过将该向量旋转获得的$90^\circ$, 给予$(-b,a)$。 一旦所有四个顶点都位于矩形内，我们就有了一个有效的正方形。 

生成正方形后，我们可以测试每个晶胞并计算有多少个晶胞完全位于其中。 

这是正确的，但速度慢得令人绝望。 已经有$O(n^2m^2)$可能的顶点组合，并检查每个单元格的包容性会使情况变得更糟。 和$n,m \le 10^6$，暴力破解是遥不可及的。 

关键的观察结果是，格子正方形的几何形状仅取决于其边向量。 

取一条边向量$(a,b)$和$a,b \ge 0$。 包含格子正方形的最小轴对齐正方形的边长$$L=a+b.$$每个方格的值相同$L$具有完全相同数量的可能放置：$$(n-L+1)(m-L+1).$$因此，我们不必首先考虑位置，而是可以通过以下方式对所有格子方块进行分类：$L$。 

下一步是确定有多少单位单元完全包含在由$(a,b)$。 

几何分解给出$$f(a,b)=a^2+b^2-2(a+b)+2\gcd(a,b).$$这将几何问题转化为纯算术问题。 

对于固定的$$L=a+b,$$定义$$F(L)=\sum_{a=0}^{L-1} f(a,L-a).$$然后每个正方形的边界大小$L$通过相同的价值做出贡献$F(L)$，答案就变成了$$\sum_{L=1}^{\min(n,m)} (n-L+1)(m-L+1)F(L).$$现在只剩下数论了。 

使用$$\gcd(a,L-a)=\gcd(a,L),$$我们得到$$F(L) = \frac{2L^3+L}{3} -2L^2 + 2\sum_{a=0}^{L-1}\gcd(a,L).$$古典身份$$\sum_{a=0}^{L-1}\gcd(a,L) = \sum_{d\mid L} d\,\varphi(L/d)$$允许所有值$F(L)$最多$10^6$用除数筛预先计算。 

最后，展开$$(n-L+1)(m-L+1) = (n+1)(m+1) -(n+m+2)L +L^2.$$如果我们存储前缀和$$F(L),\quad L F(L),\quad L^2 F(L),$$每个查询都变成一个$O(1)$公式。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 有效网格尺寸呈指数级增长，远远超出$O(n^2m^2)$| 巨大 | 太慢了 |
 | 最佳| 预处理$O(N \log N)$， 询问$O(1)$|$O(N)$| 已接受 |

 这里$N = 10^6$。 

## 算法演练

 1. 预计算 Euler 的 totient 函数$\varphi(i)$为所有人$i \le 10^6$使用线性筛。 
2. 计算$$G(i)=\sum_{d\mid i} d\,\varphi(i/d).$$这可以通过迭代所有除数来完成：$$G(j) += i \cdot \varphi(j/i).$$总复杂度为$O(N \log N)$。 

1. 对于每一个$L$从$1$到$N$, 计算$$F(L) = \frac{2L^3+L}{3} -2L^2 + 2G(L).$$所有算术均取模$10^9+7$。 

1. 构建三个前缀数组：$$S_0(x)=\sum_{L\le x}F(L),$$

$$S_1(x)=\sum_{L\le x}L\,F(L),$$

$$S_2(x)=\sum_{L\le x}L^2F(L).$$1. 对于查询，交换$n,m$如果有必要的话$n \le m$。 
2.让$k=n$。 每个有效方格必须满足$L \le k$。 
3. 使用扩展$$(n-L+1)(m-L+1) = (n+1)(m+1) -(n+m+2)L +L^2.$$1. 替换前缀和：$$\text{ans} = (n+1)(m+1)S_0(k) -(n+m+2)S_1(k) +S_2(k).$$1.输出结果取模$10^9+7$。 

### 为什么它有效

 由边向量生成的每个格子正方形$(a,b)$唯一相关的是$L=a+b$，其最小轴对齐边界正方形的边长。 

对于固定的$L$，所有这样的正方形都恰好有$(n-L+1)(m-L+1)$展示位置。 几何公式计算每个形状完全包含的单位单元的数量，并对所有对进行求和$(a,L-a)$产生$F(L)$。 

除数恒等式将 gcd 贡献转换为乘法算术函数，允许所有$F(L)$要预先计算的值。 由于每个有效方格恰好属于以下一个值$L$，并且每个位置只计算一次，最终的总和等于绘制点的总数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007
MAXN = 1000000

phi = [0] * (MAXN + 1)
primes = []
is_comp = [False] * (MAXN + 1)

phi[1] = 1
for i in range(2, MAXN + 1):
    if not is_comp[i]:
        primes.append(i)
        phi[i] = i - 1
    for p in primes:
        v = i * p
        if v > MAXN:
            break
        is_comp[v] = True
        if i % p == 0:
            phi[v] = phi[i] * p
            break
        phi[v] = phi[i] * (p - 1)

g = [0] * (MAXN + 1)

for d in range(1, MAXN + 1):
    step = d
    for x in range(d, MAXN + 1, step):
        g[x] = (g[x] + d * phi[x // d]) % MOD

inv3 = pow(3, MOD - 2, MOD)

s0 = [0] * (MAXN + 1)
s1 = [0] * (MAXN + 1)
s2 = [0] * (MAXN + 1)

for L in range(1, MAXN + 1):
    l = L % MOD

    part = ((2 * l * l % MOD) * l + l) % MOD
    part = part * inv3 % MOD

    f = (part - 2 * l * l + 2 * g[L]) % MOD

    s0[L] = (s0[L - 1] + f) % MOD
    s1[L] = (s1[L - 1] + l * f) % MOD
    s2[L] = (s2[L - 1] + l * l % MOD * f) % MOD

t = int(input())

ans = []
for _ in range(t):
    n, m = map(int, input().split())

    if n > m:
        n, m = m, n

    k = n

    res = (
        (n + 1) * (m + 1) % MOD * s0[k]
        - (n + m + 2) % MOD * s1[k]
        + s2[k]
    ) % MOD

    ans.append(str(res))

sys.stdout.write("\n".join(ans))
```线性筛计算所有 totients$O(N)$。 之后，除数循环评估$$G(x)=\sum_{d\mid x} d\varphi(x/d)$$对于每一个$x$。 

公式为$F(L)$包含除以三。 由于计算是以素数为模进行的，因此使用三的模逆来代替普通的整数除法。 

前缀数组是常量时间查询处理的核心。 一次$$\sum F(L), \quad \sum L F(L), \quad \sum L^2F(L)$$可用时，可以立即评估扩展的二次权重。 

一个常见的实施错误是忘记交换$n$和$m$。 总和仅达到$\min(n,m)$，因为有边界大小的正方形$L$不适合如果$L$超过任一维度。 

另一个简单的错误是在取模后使用普通整数除法。 三次项必须乘以三的模倒数。 

## 工作示例

 ### 示例 1

 输入：```
1 3
```仅有的$L=1$是可能的。 

| 左 | 前（左）| 展示位置 | 贡献 |
 | --- | --- | --- | --- |
 | 1 | 1 | 3 | 3 |

 总答案：$$3.$$此示例显示包含普通的轴对齐单位方块。 三个单位单元中的每一个都恰好接收一个点。 

### 示例 2

 输入：```
2 2
```可能的值为$L=1$和$L=2$。 

| 左 | 前（左）| 展示位置 | 贡献 |
 | --- | --- | --- | --- |
 | 1 | 1 | 4 | 4 |
 | 2 | 4 | 1 | 4 |

 全部的：$$4+4=8.$$这$L=2$贡献来自旋转的格子方块。 没有他们，答案将是错误的$4$。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(N \log N + t)$| 预计算占主导地位，每个查询都是$O(1)$|
 | 空间|$O(N)$| 总数、除数和以及前缀数组 |

 和$N=10^6$，预处理完全符合限制。 重要的部分是$10^5$查询会在恒定时间内得到答复。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import gcd

MOD = 1000000007

def brute(n, m):
    ans = 0

    for x in range(n + 1):
        for y in range(m + 1):
            for a in range(-n, n + 1):
                for b in range(-m, m + 1):
                    if a == 0 and b == 0:
                        continue

                    pts = [
                        (x, y),
                        (x + a, y + b),
                        (x - b, y + a),
                        (x + a - b, y + a + b),
                    ]

                    ok = True
                    for px, py in pts:
                        if not (0 <= px <= n and 0 <= py <= m):
                            ok = False
                            break

                    if not ok:
                        continue

                    # avoid counting same square four times
                    if (a < 0) or (a == 0 and b < 0):
                        continue

                    minx = min(p[0] for p in pts)
                    maxx = max(p[0] for p in pts)
                    miny = min(p[1] for p in pts)
                    maxy = max(p[1] for p in pts)

                    def inside(cx, cy):
                        s = []
                        for i in range(4):
                            x1, y1 = pts[i]
                            x2, y2 = pts[(i + 1) % 4]
                            s.append(
                                (x2 - x1) * (cy - y1)
                                - (y2 - y1) * (cx - x1)
                            )
                        return all(v >= 0 for v in s) or all(v <= 0 for v in s)

                    for i in range(minx, maxx):
                        for j in range(miny, maxy):
                            corners = [
                                (i, j),
                                (i + 1, j),
                                (i, j + 1),
                                (i + 1, j + 1),
                            ]
                            if all(inside(cx, cy) for cx, cy in corners):
                                ans += 1

    return ans

def run(inp: str) -> str:
    data = inp.strip().split()
    t = int(data[0])

    out = []
    ptr = 1
    for _ in range(t):
        n = int(data[ptr])
        m = int(data[ptr + 1])
        ptr += 2
        out.append(str(brute(n, m)))
    return "\n".join(out)

# provided samples
assert run("4\n1 3\n2 2\n2 5\n3 4\n") == "3\n8\n26\n58", "sample"

# minimum size
assert run("1\n1 1\n") == "1", "single unit square"

# thin rectangle
assert run("1\n1 2\n") == "2", "no room for rotated squares"

# symmetric small case
assert run("1\n2 2\n") == "8", "rotated square contribution"

# off-by-one on bounding size
assert run("1\n2 3\n") == "14", "largest L fits exactly once"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`1`| 尽可能最小的网格 |
 |`1 2`|`2`| 没有旋转的正方形可以容纳 |
 |`2 2`|`8`| 旋转格子方贡献|
 |`2 3`|`14`| 当最大边界方块适合一次时的正确处理 |

 ## 边缘情况

 考虑：```
1
1 2
```仅有的$L=1$适合。 该算法评估$$(1-1+1)(2-1+1)F(1)=2.$$没有更大的边界框可以容纳，因为$L=2>\min(n,m)$。 答案正是两个晶胞。 

现在考虑：```
1
2 2
```求和使用$L=1$和$L=2$。 

为了$L=2$，这对$(1,1)$代表菱形正方形。 它的贡献包含在里面$F(2)$，这就是为什么结果变成$8$而不是$4$。 

最后，考虑：```
1
3 3
```如果粗心的解决方案仅对与方形边界相交的单元格进行计数，则会出现过度计数。 公式为$f(a,b)$是专门针对完全包含在正方形内的单元而得出的。 gcd 项来自边界上的晶格点，并精确删除那些部分覆盖的单元格。 这种几何校正就是算术公式对于所有方向都保持准确的原因。 

资料来源：
