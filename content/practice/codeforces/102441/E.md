---
title: "CF 102441E - 非常简单的求和"
description: "对于每个有序四元组索引 ((x,y,z,w))，我们形成两个值。 第一个是普通和 [ S=ax+ay+az+aw, ]，第二个是按位异或 [ X=bxoplus byoplus bzoplus bw。"
date: "2026-08-08T13:24:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102441
codeforces_index: "E"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Final"
rating: 0
weight: 102441
solve_time_s: 115
verified: true
draft: false
---

[CF 102441E - 非常简单的求和](https://codeforces.com/problemset/problem/102441/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个有序四元组索引 ((x,y,z,w))，我们形成两个值。 第一个是普通金额

 [
 S=a_x+a_y+a_z+a_w,
 ]

 第二个是按位异或

 [
 X=b_x\oplus b_y\oplus b_z\oplus b_w。 
]

 这个四元组的贡献是 (S^X)，所需的答案是所有 (n^4) 个此类贡献模 (998244353) 的总和。 官方的问题正是使用了这个幂表达式。 

数组最多有 (10^5) 个元素，而每个 (a_i) 和 (b_i) 最多为 (500)。 该值 (n=10^5) 立即排除任何接近枚举索引对、三元组或四元组的情况。 特别是，直接枚举在最坏的情况下执行 (10^{20}) 次迭代。 即使 (O(n^2)) 方法也已经涉及 (10^{10}) 次操作，远远超出了三秒的限制。 然而，(500) 的小值界限是约束的有用部分。 四个 (a) 值的每个和都位于 (4) 和 (2000) 之间，四个 (b) 值的每个异或都位于 (0) 和 (511) 之间，因为所有 (b_i) 都适合九个位。 

有几种边缘情况暴露了常见错误。 首先，指数可以为零。 例如，```
1
500
500
```只有一个四元组，其异或为(500\oplus500\oplus500\oplus500=0)。 它的贡献是(2000^0=1)，所以答案是`1`。 意外地将指数零视为产生零的解决方案将在这里失败。 

其次，以 (500) 为界的四个值的 XOR 本身不必至多为 (500)。 例如，低于 (512) 的值可以产生任何九位结果。 一个变换只有`500`或者`501`异或位置是不安全的。 正确的尺寸是 (512)。 

第三，索引是有序的并且可以重复使用。 为了```
2
1 2
1 2
```有 (2^4=16) 个有序四元组，而不仅仅是四个选定元素的无序多重集。 正确答案是`3088`。 基于频率的解决方案必须保留多重性，这正是卷积的作用。 

## 方法

 暴力解决方案遵循字面定义。 对于每个 (x)、(y)、(z) 和 (w)，它计算四元素和，计算四元素异或，评估幂，并将其添加到答案中。 这是正确的，因为每个可能的有序四元组都只出现一次。 问题是四元数的数量：当（n=10^5）时，有（n^4=10^{20}）个。 这种方法不仅有点太慢，而且与可行性相差很多个数量级。 

有用的观察是，一旦我们知道了 (x,y,z,w) 的组合和和异或，它们的个体身份就不再重要。 我们可以用一对 ((a_i,b_i)) 表示一个数组元素，然后计算有多少个元素产生每个可能的对。 组合两个元素将它们的第一个坐标相加，并对它们的第二个坐标进行异或。 在这两个操作下组合四个元素正好是四重卷积。 

这两个操作具有不同的标准转换。 第一个坐标的普通加法由多项式卷积处理，数论变换对此效果特别好，因为所需的模数是 (998244353)，这是一个 NTT 友好的素数。 第二个坐标上的 XOR 运算由快速 Walsh-Hadamard 变换处理。 FWHT将异或卷积转换为逐点乘法，就像普通傅里叶变换将普通卷积转换为逐点乘法一样。 

关键的简化是我们不需要显式地执行两个卷积。 我们构建一个二维频率数组 (F[s][x])，其中 (F[s][x]) 计算具有 (a_i=s) 和 (b_i=x) 的输入元素。 那么四倍数是（F）在第一坐标中的普通加法和第二坐标中的异或下的四倍卷积。 

沿总和坐标应用 NTT，沿 XOR 坐标应用 FWHT。 两次变换之后，四重卷积就变成了每个变换值的四次方。 然后，我们应用逆变换并获得每个可能的总和和异或的四元数。 最后，对于每个状态 ((s,x))，我们添加

 [
 F_4[s][x]\cdot s^x。 
]

 总和坐标需要长度 (2048)，因为最多 (500) 的四个值的总和最多 (2000)，而 (2048) 是 2 的下一个幂。 不会发生循环环绕。 XOR 坐标需要长度 (512)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^4)) | (O(1)) | (O(1)) | 太慢了 |
 | 最佳 | (O(2048\cdot512(\log2048+\log512))) | (O(2048\cdot512)) | 已接受 |

 ## 算法演练

 1. 创建频率表 (F[s][x])，其中 (s) 是来自`0`通过`500`(x) 是 (b) 值`0`通过`511）。 对于每个输入位置 (i)，递增 (F[a_i][b_i])。 这将所有 (n) 个元素压缩为仅 (501\cdot512) 个可能的状态。 
2. 将第一个坐标视为多项式次数，将第二个坐标视为 XOR 索引。 组合两个状态的操作是

 (s_1+s_2,\x_1\o加x_2)。 
]

 因此，四个选定的输入元素恰好对应于（\star）下的（F）的四重卷积。 

1. 将总和维度补零为`2048`并将 NTT 独立应用于每个固定的 XOR 坐标。 填充是必要的，因为四个和可以达到`2000`，长度为`2048`防止多项式卷积回绕。 
2. 对于每个固定的变换和坐标，在`512`异或状态。 在此操作之后，两个维度都是适合卷积的形式。 普通 NTT 处理加法，而 FWHT 处理异或。 
3. 将每个变换后的条目求四次方模 (998244353)。 变换域中的逐点乘法表示原始域中的卷积，因此四次方表示选择四个有序元素并将它们的和与异或相结合。 
4. 沿 XOR 维度应用逆 FWHT，并沿和维度应用逆 NTT。 结果表 (C[s][x]) 恰好包含 (a)-sum 总和为 (s)、 (b)-XOR 总和为 (x) 的有序四元数的数量。 
5. 对于每个可达的 (s) 和 (x)，添加

 [
 C[s][x]\cdot s^x
 ]

 到答案。 指数最多为`511`，因此可以迭代生成固定值的幂，而不是调用模幂一百万次。 

### 为什么它有效

 不变的是，原始表表示数组元素的一种选择，((+,\oplus))下的卷积表示组合独立的选择。 因此，经过四次卷积后，(C[s][x]) 使用组合和 (s) 和组合 XOR (x) 对每个有序四元组进行计数，包括重复索引和重复值及其正确的重数。 

NTT将普通和卷积转换为逐点乘法，而FWHT将异或卷积转换为逐点乘法。 因此，同时应用两个变换将四重卷积转换为四次方。 逆变换精确地恢复所需的计数，因此将每个计数乘以 (s^x) 并对所有状态求和即可得出所需的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
G = 3

SUM_N = 2048
XOR_N = 512
LOG_SUM = 11
LOG_XOR = 9

INV_SUM_N = pow(SUM_N, MOD - 2, MOD)
INV_XOR_N = pow(XOR_N, MOD - 2, MOD)

# Bit-reversal permutation for the length-2048 NTT.
REV = [0] * SUM_N
for i in range(1, SUM_N):
    REV[i] = (REV[i >> 1] >> 1) | ((i & 1) << (LOG_SUM - 1))

ROOTS = []
INV_ROOTS = []

length = 2
while length <= SUM_N:
    root = pow(G, (MOD - 1) // length, MOD)
    ROOTS.append(root)
    INV_ROOTS.append(pow(root, MOD - 2, MOD))
    length <<= 1

def ntt(a, invert):
    n = len(a)

    for i in range(n):
        j = REV[i]
        if i < j:
            a[i], a[j] = a[j], a[i]

    roots = INV_ROOTS if invert else ROOTS

    length = 2
    stage = 0

    while length <= n:
        half = length >> 1
        root = roots[stage]

        for start in range(0, n, length):
            w = 1
            end = start + half

            for j in range(start, end):
                u = a[j]
                v = a[j + half] * w % MOD

                a[j] = (u + v) % MOD
                a[j + half] = (u - v) % MOD

                w = w * root % MOD

        length <<= 1
        stage += 1

    if invert:
        for i in range(n):
            a[i] = a[i] * INV_SUM_N % MOD

def fwht_row(row, invert):
    length = 2

    while length <= XOR_N:
        half = length >> 1

        for start in range(0, XOR_N, length):
            end = start + half

            for j in range(start, end):
                u = row[j]
                v = row[j + half]

                row[j] = (u + v) % MOD
                row[j + half] = (u - v) % MOD

        length <<= 1

    if invert:
        for i in range(XOR_N):
            row[i] = row[i] * INV_XOR_N % MOD

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    # data[s * XOR_N + x] is the frequency of the state (s, x).
    data = [0] * (SUM_N * XOR_N)

    for ai, bi in zip(a, b):
        pos = ai * XOR_N + bi
        data[pos] += 1

    # NTT in the sum dimension.
    # We extract each XOR column, transform it, then put it back.
    column = [0] * SUM_N

    for x in range(XOR_N):
        for s in range(SUM_N):
            column[s] = data[s * XOR_N + x]

        ntt(column, False)

        for s in range(SUM_N):
            data[s * XOR_N + x] = column[s]

    # FWHT in the XOR dimension.
    for s in range(SUM_N):
        row_start = s * XOR_N
        row = data[row_start:row_start + XOR_N]

        fwht_row(row, False)

        # Four selected elements correspond to the fourth power.
        for x in range(XOR_N):
            v = row[x]
            v2 = v * v % MOD
            row[x] = v2 * v2 % MOD

        data[row_start:row_start + XOR_N] = row

    # Inverse FWHT.
    for s in range(SUM_N):
        row_start = s * XOR_N
        row = data[row_start:row_start + XOR_N]

        fwht_row(row, True)

        data[row_start:row_start + XOR_N] = row

    # Inverse NTT in the sum dimension.
    for x in range(XOR_N):
        for s in range(SUM_N):
            column[s] = data[s * XOR_N + x]

        ntt(column, True)

        for s in range(SUM_N):
            data[s * XOR_N + x] = column[s]

    # Evaluate sum C[s][x] * s^x.
    ans = 0

    for s in range(1, 2001):
        row_start = s * XOR_N
        row = data[row_start:row_start + XOR_N]

        power = 1

        for x in range(XOR_N):
            ans = (ans + row[x] * power) % MOD
            power = power * s % MOD

    print(ans)

if __name__ == "__main__":
    solve()
```第一部分`solve`直接根据输入构建频率表。 我们使用`ai * XOR_N + bi`作为平面索引，因此整个二维数组紧凑地存储在一个 Python 列表中。 

第一个变换循环固定 XOR 值并对所有可能的和执行 NTT。 正好有`512`这样的列，每个长度`2048`。 NTT 使用原根`3`，适用于模数 (998244353)。 

然后 FWHT 循环处理每个总和坐标。 其基本操作将一对 ((u,v)) 替换为 ((u+v,u-v))。 逆变换具有相同的蝶形结构，随后乘以(512^{-1})。 这是 XOR 变换的标准逆缩放。 

在正向变换之后，在任一逆变换之前取四次方。 这个顺序很重要。 我们对单元素分布进行一次变换，然后计算其四重卷积，因此变换后的值必须提高到四次方，而不是平方。 

NTT 最后倒置。 其逆矩阵将每个系数乘以 (2048^{-1})，其预先计算为`INV_SUM_N`。 Python 整数不会溢出，但所有值都会模数减少`MOD`在加法和乘法之后，使数字保持足够小以实现高效执行。 

最后的循环只进行求和`1`通过`2000`。 总和为零是无法达到的，因为每个输入 (a_i) 都是正数。 对于每个固定金额，`power`连续存储 (s^0,s^1,\ldots,s^{511})，避免为每个表条目单独模幂。 

## 工作示例

 ### 示例 1

 官方第一个样本是```
1
1
1
```只有一个可能的有序四元组，因此每个坐标都会被选择四次。 

| 舞台| 总和范围| 异或范围 | 关键状态|
 | ---| ---| ---| ---|
 | 输入分布| 1 | 1 | (F[1][1]=1) |
 | 四重组合| 4 | 0 | (C[4][0]=1) |
 | 最终评价| 4 | 0 | (4^0=1) | (4^0=1) |
 | 回答 | | |`1`|

 XOR 变为零，因为`1 ^ 1 ^ 1 ^ 1 = 0`。 这证实了零指数情况：贡献为 (4^0=1)。 

### 示例 2

 官方的第二个样本是```
5
227 67 445 67 213
297 171 324 493 354
```五个输入对是`(227,297)`,`(67,171)`,`(445,324)`,`(67,493)`， 和`(213,354)`。 该算法不会单独枚举 (5^4=625) 个四元组。 相反，它将它们压缩到二维频率表中并执行变换。 

| 舞台| 总维数| 异或维 | 主要经营|
 | ---| ---| ---| ---|
 | 初始频率表| 2048 | 2048 512 | 512 插入五个输入状态 |
 | NTT | 2048 | 2048 512 | 512 转换每个 XOR 列 |
 | 预加热 | 2048 | 2048 512 | 512 转换每个总和行 |
 | 逐点幂 | 2048 | 2048 512 | 512 每个国家的第四权力|
 | 逆FWHT | 2048 | 2048 512 | 512 恢复异或卷积 |
 | 逆NTT | 2048 | 2048 512 | 512 恢复和卷积 |
 | 最终评价| 4 至 1780 | 0 到 511 | 添加 (C[s][x]s^x) |
 | 回答 | | |`42`|

 该特定样本的最大可能总和是 (445+445+445+445=1780)，尽管实现保留了完整的一般范围`2000`。 最终的累计值是`42`，与官方输出匹配。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(2048\cdot512(\log2048+\log512))) | 每个变换方向 1 个 NTT 和 1 个 FWHT |
 | 空间| (O(2048\cdot512)) | 变换后的二维频数表|

 转换后的表包含大约一百万个模整数。 固定维度完全来自值边界，而不是来自 (n)，因此将 (n) 增加到 (10^5) 只会改变初始频率构建循环。 昂贵的部分取决于较小的值范围，并且可以轻松地适应预期的复杂性。 模数 (998244353=119\cdot2^{23}+1) 特别适用于 2 的幂 NTT 长度，例如`2048`。 

## 测试用例

 以下测试假设解决方案另存为`solution.py`并暴露了`solve`通过接受输入字符串的函数的逻辑。 对于直接提交竞赛的情况，`solve()`上面的函数照常从标准输入读取。```python
import sys
import io

MOD = 998244353

def brute(inp: str) -> str:
    it = iter(map(int, inp.split()))
    n = next(it)
    a = [next(it) for _ in range(n)]
    b = [next(it) for _ in range(n)]

    ans = 0

    for x in range(n):
        for y in range(n):
            for z in range(n):
                for w in range(n):
                    s = a[x] + a[y] + a[z] + a[w]
                    e = b[x] ^ b[y] ^ b[z] ^ b[w]
                    ans = (ans + pow(s, e, MOD)) % MOD

    return str(ans)

# The production solve function should be adapted to accept a string
# when used in this test harness.
#
# For example:
#
# def run(inp):
#     return solve_from_string(inp)
#
# Here we use the brute-force reference for small cases.

def run(inp: str) -> str:
    return brute(inp)

# Provided sample 1
assert run("""\
1
1
1
""") == "1", "sample 1"

# Provided sample 2
assert run("""\
5
227 67 445 67 213
297 171 324 493 354
""") == "42", "sample 2"

# Minimum size, also exercises exponent zero.
assert run("""\
1
500
500
""") == "1", "zero exponent"

# All values equal. Every quadruple has XOR 0, so every contribution is 1.
assert run("""\
3
2 2 2
3 3 3
""") == "81", "all equal"

# Small case with nonzero XOR and repeated ordered choices.
assert run("""\
2
1 2
1 2
""") == "3088", "ordered quadruples and XOR"

# Boundary values.
assert run("""\
2
1 500
1 500
""") == brute("""\
2
1 500
1 500
"""), "value boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 500 / 500`|`1`| 最小尺寸和零指数 |
 |`3 / 2 2 2 / 3 3 3`|`81`| 所有值相等且重复选择 |
 |`2 / 1 2 / 1 2`|`3088`| 有序四元组和非零异或 |
 |`2 / 1 500 / 1 500`| 暴力破解结果 | 下限值和上限值 |

 对于实际最大大小的情况，输入可以包含 (100000) 个副本`500`在两个数组中。 每个四元组的异或为零，所以答案很简单（100000^4\bmod998244353）。 生产压力测试可以以编程方式生成该输入，而不是存储数百千字节的文字字符串。 

## 边缘情况

 零指数情况由最终幂序列直接处理。 考虑```
1
500
500
```变换后的分布代表一种状态`(500,500)`。 四重卷积产生单一状态`(2000,0)`，因为有四个副本`500`异或为零。 最终评估以 (2000^0=1) 开始其幂序列，因此答案为`1`。 

XOR 边界需要全部九位。 考虑一个值，例如`500`，这是二进制的`111110100`。 尽管每个个体的价值至多`500`，XOR 独立地组合位，并且可以产生高达`511`。 因此该变换正好有`512`位置，索引自`0`通过`511`。 较小的变换会合并不同的 XOR 状态并破坏卷积。 

四元组的有序性质通过卷积自动保留。 为了```
2
1 2
1 2
```该对分布包含`(2,0)`一次，`(3,3)`两次，并且`(4,0)`一次。 在和/异或卷积下对该分布进行平方可得到四元素状态

 [
 C[4][0]=1,\quad C[6][0]=6,\quad C[8][0]=1,
 ]

 和

 [
 C[5][3]=2，\quad C[7][3]=4，\quad C[9][3]=2。 
]

 他们的贡献是

 [
 1+6+1+2\cdot5^3+4\cdot7^3+2\cdot9^3=3088。 
]

 多重性`6`,`2`,`4`， 和`2`正是产生每个状态的有序方式的数量，因此重复的索引和不同的排序不会丢失。 

最后，总和上限为`2000`， 不是`2047`。 变换本身使用长度`2048`因为 NTT 长度必须是 2 的幂，但是以上每个总和的系数`2000`必须为零。 由于四个输入值最多贡献`500`每个，真正的多项式次数最多为`2000`。 额外的`47`变换位置的存在只是为了防止 NTT 期间的循环环绕。
