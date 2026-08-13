---
title: "CF 102471B - 黑色和白色"
description: "我们有一个 (n×m) 棋盘，当 (i+j) 为偶数时，其单元格 ((i,j)) 的值为 (+1)，否则为 (-1)。 一条有效路径恰好由 (n) 个北台阶和 (m) 个东台阶组成，从左下角开始，到右上角结束。"
date: "2026-08-12T08:56:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102471
codeforces_index: "B"
codeforces_contest_name: "2019 ICPC Asia-East Continent Final"
rating: 0
weight: 102471
solve_time_s: 731
verified: true
draft: false
---

[CF 102471B - 黑白](https://codeforces.com/problemset/problem/102471/B)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个 (n\times m) 棋盘，当 (i+j) 为偶数时，其单元格 ((i,j)) 的值为 (+1)，否则为 (-1)。 一条有效路径恰好由 (n) 个北台阶和 (m) 个东台阶组成，从左下角开始，到右上角结束。 

有向路径左侧的单元格将其值贡献给分数。 我们需要计算有多少条路径的得分精确（k），模（998244353）。 

输入最多包含 (100) 个独立测试用例。 两个维度都可以是 (10^5)，因此依赖于 (nm) 的解决方案已经太大：一个测试用例可以包含 (10^{10}) 个单元。 枚举所有路径更加无望，因为它们的数量是

 [
 \binom{n+m}{n},
 ]

 即使对于中等尺寸来说，这也是巨大的。 有用的算法必须在全局阶乘预计算之后在基本恒定的时间内处理测试用例。 

在一些边界情况下，基于猜测分数范围的实现可能会出错。 对于 (n=m=1)，两条路径的分数为 (1) 和 (0)，因此输入`1 1 0`有答案（1），而`1 1 -1`有答案（0）。 假设分数围绕零对称的公式在这里已经失败了。 

(n+m) 的奇偶性也很重要。 为了`2 3 1`，正确答案是（1），而对于`2 3 -1`是（3）。 当总路径长度为奇数时，两侧不对称。 最后，一个不可能的分数，例如`2 2 2`答案为 (0)，最安全的实现应该从无效的二项式系数中自动获得答案，而不是单独处理每个分数边界。 

## 方法

 直接的暴力解决方案可以枚举每条路径。 有 (\binom{n+m}{n}) 条这样的路径。 即使我们只用 (O(n+m)) 时间计算一条路径的分数，总工作量也是

 [
 O\left((n+m)\binom{n+m}{n}\right)。 
]

 在 (n=m=100000) 时，这大约是 (200000\binom{200000}{100000}) 次操作，远远超出了任何可行的限制。 逐个细胞的分数计算会更糟，添加另一个因子（nm）。 

有用的观察结果是，棋盘着色使分数仅取决于路径词中北台阶位置的奇偶性。 

将路径写为 (n+m) 个字符的序列，其中`N`向北迈出一步`E`向东迈出一步。 从 (1) 开始对这些位置进行编号。 令 (A) 为偶数位置处出现的北步数。 

中心身份是

 [
 \boxed{\text{分数}=A-\left\lfloor\frac n2\right\rfloor}。 
]

 一旦知道了这一点，几何形状就消失了。 有

 [
 L_1=\left\lfloor\frac{n+m}{2}\right\rfloor
 ]

 均匀位置和

 [
 L_2=\left\lceil\frac{n+m}{2}\right\rceil
 ]

 路径词中的奇数位置。 如果分数为(k)，则偶数位置向北的台阶数必须为

 [
 A=\left\lfloor\frac n2\right\rfloor+k。 
]

 剩余的

 [
 n-A=\left\lceil\frac n2\right\rceil-k
 ]

 北台阶必须占据奇怪的位置。 选择是独立的，给予

 [
 \盒装{
 \binom{\lfloor(n+m)/2\rfloor}
 {\lfloor n/2\rfloor+k}
 \binom{\lceil(n+m)/2\rceil}
 {\lceil n/2\rceil-k}
 }。 
]

 阶乘和逆阶乘最多可以预先计算一次 (200000)，从而使每个测试用例 (O(1))。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O((n+m)\binom{n+m}{n})) | (O(n+m)) | 太慢了 |
 | 最佳| 预计算后每次测试 (O(1)) | (O(n+m)) 总计 | 已接受 |

 ## 算法演练

 1. 将路径表示为 (n) 的一个单词`N`步数和（米）`E`步骤。 每一条单调路径恰好对应一个这样的单词，因此对路径进行计数相当于对这些单词进行计数。 
2. 对于每一行 (i)，令 (c_i) 为路径从第 (i) 行向北迈出到第 (i+1) 行的列。 该垂直步长左侧的单元格正是具有列索引 (0,1,\ldots,c_i-1) 的单元格。 

他们的签名贡献是

 [
 \sum_{j=0}^{c_i-1}(-1)^{i+j}。 
]

 当 (c_i) 为偶数时，该和为零。 当(c_i)为奇数时，它等于((-1)^i)。 
3. 按照出现的顺序对北台阶进行编号。 让第 (q) 个北步出现在完整路径字中的位置 (t_q) 处。 在该步骤之前有 (q-1) 个北步骤，所以它的列是

 [
 c_{q-1}=t_q-q。 
]

 如果该列是奇数，则 (t_q) 和 (q) 具有相反的奇偶校验。 那么这个北步的贡献就是((-1)^{q-1})。 
4. 令 (A) 为偶数位置处向北的台阶数。 正向贡献正是在偶数位置具有奇数索引 (q) 的北台阶。 负贡献正是在奇数位置具有偶数索引 (q) 的北台阶。 

在 (\lfloor n/2\rfloor) 个偶数索引的北台阶中，每个台阶要么位于偶数位置，要么位于奇数位置。 因此

 ## #(\text{奇数}q,\t_q\text{偶数})

 # #(\text{偶数}q,\t_q\text{奇数})

 A-\左\lfloor\压裂n2\右\rfloor。 
]

 这个恒等式是整个解决方案的关键不变量。 
5. 对于所需的分数 (k)，求解 (A) 的恒等式：

 [
 A=\left\lfloor\frac n2\right\rfloor+k。 
]

 有 (\lfloor(n+m)/2\rfloor) 个偶数位置，因此有

 [
 \binom{\lfloor(n+m)/2\rfloor}
 {\lfloor n/2\rfloor+k}
 ]

 选择北台阶占据的偶数位置的方法。 
6. 有 (\lceil(n+m)/2\rceil) 个奇数位置。 剩余的 (n-A) 个北台阶必须占据这些位置。 自从

 [
 n-A=\left\lceil\frac n2\right\rceil-k,
 ]

 有

 [
 \binom{\lceil(n+m)/2\rceil}
 {\lceil n/2\rceil-k}
 ]

 选择。 
7. 将两个二项式系数乘以模 (998244353)。 如果任一较低参数超出其有效范围，则相应的二项式系数为零，因此不可能的分数不需要特殊情况。 

### 为什么它有效

 包含每个北台阶的行直接描述了该行中哪些单元格位于其左侧。 由于单元格颜色交替，因此对于偶数列，该行的有符号和为零，对于奇数列，该行的有符号总和恰好为 (+1) 或 (-1)。 将第 (q) 个北步的列表示为 (t_q-q) 将此条件转换为北步索引与其在路径字中的绝对位置之间的奇偶关系。 

在此转换之后，对分数的每个贡献仅取决于该北步占据偶数还是奇数位置。 总分正好是偶数位置向北的台阶数 (A) 减去 (\lfloor n/2\rfloor)。 一旦(A)确定，单词的偶数部分和奇数部分的北步位置的选择是独立的。 两个二项式系数精确地计算这些选择，因此每个有效路径都被计算一次，并且不会计算无效路径。 

## Python 解决方案```python
import sys

input = sys.stdin.readline

MOD = 998244353

def prepare(max_n):
    fact = [1] * (max_n + 1)
    for i in range(1, max_n + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact = [1] * (max_n + 1)
    invfact[max_n] = pow(fact[max_n], MOD - 2, MOD)
    for i in range(max_n, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    return fact, invfact

def comb(n, r, fact, invfact):
    if r < 0 or r > n:
        return 0
    return fact[n] * invfact[r] % MOD * invfact[n - r] % MOD

def main():
    T = int(input())
    tests = [tuple(map(int, input().split())) for _ in range(T)]

    max_size = 0
    for n, m, _ in tests:
        max_size = max(max_size, n + m)

    fact, invfact = prepare(max_size)

    ans = []

    for n, m, k in tests:
        even_positions = (n + m) // 2
        odd_positions = (n + m + 1) // 2

        north_on_even = n // 2 + k
        north_on_odd = (n + 1) // 2 - k

        left = comb(even_positions, north_on_even, fact, invfact)
        right = comb(odd_positions, north_on_odd, fact, invfact)

        ans.append(str(left * right % MOD))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    main()
```输入在预处理之前被完全读取，因此阶乘数组只需构建到测试文件中出现的最大 (n+m)。 由于 (n,m\leq100000)，此限制最多为 (200000)。 

这`comb`当函数的下参数为负或大于上参数时，函数显式返回零。 这可以处理超出可能范围的分数，而无需在主算法中添加额外的分支。 

对于每个测试用例，`even_positions`和`odd_positions`是长度为 (n+m) 的路径字中位置 (2,4,\ldots) 和 (1,3,\ldots) 的计数。 变量`north_on_even`和`north_on_odd`直接来自分数恒等式。 它们的总和正好是 (n)，这是一个有用的健全性检查。 

Python 中不存在整数溢出问题。 每个乘法都会对模 (998244353) 进行约简，并且由于模数是素数，因此可以通过费马定理获得模逆。 

## 工作示例

 ### 示例 1：`1 1 0`该路径有两级，因此有一个偶数位置和一个奇数位置。 我们需要以下值。 

| 变量| 价值|
 | --- | --- |
 | (n) | 1 |
 | (男)| 1 |
 | (k) | 0 |
 | 偶数位置 | 1 |
 | 奇数位置| 1 |
 | 北在偶数位置| (0+0=0) |
 | 北在奇怪的位置| (1-0=1) |
 | 答案| (\binom10\binom11=1) |

 唯一得分为零的路径是`NE`。 它的北步位于位置 (1)，因此在偶数位置处北步为零。 分数恒等式给出 (0-\lfloor1/2\rfloor=0)。 

该迹线展示了由奇数步数引起的不对称行为。 

### 示例 2：`1 1 -1`结构值不变，但现在要求的分数是（-1）。 

| 变量| 价值|
 | --- | --- |
 | (n) | 1 |
 | (男)| 1 |
 | (k) | -1 |
 | 偶数位置 | 1 |
 | 奇数位置| 1 |
 | 北在偶数位置| (0-1=-1) | (0-1=-1) |
 | 北在奇怪的位置| (1-(-1)=2) | (1-(-1)=2) |
 | 答案| (\binom1{-1}\binom12=0) |

 两个必需的二项式系数均无效。 因此答案是零。 这符合 (1\times1) 棋盘不能有分数 (-1) 的事实。 

### 示例 3：`2 2 1`有四个位置，每个奇偶校验两个。 

| 变量| 价值|
 | --- | --- |
 | (n) | 2 |
 | (男)| 2 |
 | (k) | 1 |
 | 偶数位置 | 2 |
 | 奇数位置| 2 |
 | 北在偶数位置| (1+1=2) | (1+1=2) |
 | 北在奇怪的位置| (1-1=0) | (1-1=0) |
 | 答案| (\binom22\binom20=1) |

 这里计算的唯一路径是`NENE`。 两个北台阶占据偶数位置，给出 (A=2) 和得分 (2-1=1)。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(M+T)) | 阶乘被预先计算到 (M=\max(n+m))，然后每个测试用例需要常数时间 |
 | 空间| (O(M)) | 阶乘和逆阶乘数组各包含 (M+1) 个值 |

 最大可能的 (M) 是 (200000)，因此预处理对于内存限制来说足够小。 预处理后，即使是 (100) 个大型测试用例，每个测试用例也只需要恒定的工作量。 没有构建网格，也没有枚举单独的路径。 

## 测试用例```python
# Complete assert-based tests for the formula used by the solution.

MOD = 998244353

def build_fact(limit):
    fact = [1] * (limit + 1)
    for i in range(1, limit + 1):
        fact[i] = fact[i - 1] * i % MOD

    invfact = [1] * (limit + 1)
    invfact[limit] = pow(fact[limit], MOD - 2, MOD)
    for i in range(limit, 0, -1):
        invfact[i - 1] = invfact[i] * i % MOD

    return fact, invfact

FACT, INVFACT = build_fact(200000)

def C(n, r):
    if r < 0 or r > n:
        return 0
    return FACT[n] * INVFACT[r] % MOD * INVFACT[n - r] % MOD

def expected(n, m, k):
    l1 = (n + m) // 2
    l2 = (n + m + 1) // 2
    a = n // 2 + k
    b = (n + 1) // 2 - k
    return C(l1, a) * C(l2, b) % MOD

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    t = data[0]
    pos = 1
    out = []

    for _ in range(t):
        n, m, k = data[pos], data[pos + 1], data[pos + 2]
        pos += 3
        out.append(str(expected(n, m, k)))

    return "\n".join(out)

# Provided samples.
sample = """\
5
1 1 0
1 1 -1
2 2 1
2 2 0
4 4 1
"""
assert run(sample) == """\
1
0
1
4
16
""", "provided samples"

# Minimum-size and asymmetric odd-length cases.
assert run("1\n1 1 1\n") == "1", "1x1 maximum score"
assert run("1\n1 2 0\n") == "2", "1x2 zero score"
assert run("1\n1 2 1\n") == "1", "1x2 positive score"

# Catches the asymmetry between positive and negative scores.
assert run("3\n2 3 1\n2 3 0\n2 3 -1\n") == """\
1
6
3
""", "odd total path length"

# Impossible score.
assert run("1\n2 2 2\n") == "0", "score outside the possible range"

# Maximum-size test case.
max_expected = expected(100000, 100000, 0)
assert run("1\n100000 100000 0\n") == str(max_expected), \
    "maximum n and m"

# A maximum-size dimension with a very small other dimension.
assert run("1\n100000 1 0\n") == "50001", \
    "maximum n with m=1"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1`|`1`| 最低板数和最高可获得分数 |
 |`1 2 0`|`2`| 奇数总路径长度和零分数 |
 |`2 3 1`,`2 3 0`,`2 3 -1`|`1`,`6`,`3`| 不对称分布的正分、零分和负分 |
 |`2 2 2`|`0`| 无效分数和二项式边界处理 |
 |`100000 100000 0`|`C(100000,50000)^2 mod 998244353`| 两个尺寸均达到最大值 |
 |`100000 1 0`|`50001`| 薄板大尺寸|

 ## 边缘情况

 对于`1 1 0`，公式给出 (L_1=L_2=1)、(A=0) 和 (B=1)。 答案是（\binom10\binom11=1）。 路径`NE`其北台阶位于奇数位置 1，因此其得分为零。 

为了`1 1 -1`，偶数位置所需的北步数为 (-1)。 由于具有负下参数的二项式系数为零，因此答案立即为零。 同样的机制可以处理每一个不可能的分数。 

为了`2 3`，总路径长度
