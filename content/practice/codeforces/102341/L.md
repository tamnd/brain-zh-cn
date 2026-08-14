---
title: "CF 102341L - Lati@s"
description: "这个游戏看起来很庞大，因为一步棋会用最多 (2^n-1) 个新元组替换单个元组，并且初始位置已经包含 (n!) 个元组。 看待它的有用方法不是将其视为模拟，而是将其视为其位置具有斯普拉格-格伦迪值的公正游戏。"
date: "2026-08-13T03:26:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "L"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 161
verified: true
draft: false
---

[CF 102341L - Lati@s](https://codeforces.com/problemset/problem/102341/L)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这个游戏看起来很庞大，因为一步棋会用最多 (2^n-1) 个新元组替换单个元组，并且初始位置已经包含 (n!) 个元组。 看待它的有用方法不是将其视为模拟，而是将其视为其位置具有斯普拉格-格伦迪值的公正游戏。 

元组 (A=(A_1,\ldots,A_n)) 仅当每个坐标都为正时才能播放。 移动选择一个具有 (0\le B_i<A_i) 的任意元组 (B)，删除 (A)，并插入通过在每个坐标中独立选择 (A_i) 或 (B_i) 获得的每个元组，但不插入原始元组 (A) 本身。 整个位置是这些元组游戏的不相交和，因此所有元组的 Grundy 值都是异或的。 

输入给出一个 (n\times n) 矩阵 (M)。 对于其列的每一种排列，我们使用不同的列从每一行中取出一个条目并获得一个初始元组。 因此，初始位置包含与矩阵中所有排列选择相关的 (n!) 个乘积。 所需的输出只是它们的 Grundy 值的 XOR 是否为零。 零值意味着第二个玩家获胜，而非零值意味着第一个玩家获胜。 

界限 (n\le150) 排除了 (n) 中的任何指数，包括显式生成 (n!) 元组。 即使对于 (n=20)，(n!) 也已经约为 (2.4\cdot10^{18})，而对于 (n=150)，它远远超出了任何实际表示。 该矩阵只有 (n^2\le22500) 个条目，这强烈表明必须以代数方式重写排列和。 矩阵项低于(2^{64})，因此普通的有符号64位算术是不安全的，并且所需的乘法无论如何也不是普通的整数乘法。 

有几个小情况很容易欺骗将游戏视为普通算术的实现。 例如，```
1
0
```有输出`Second`。 唯一的元组是 ((0))，因此它没有合法的移动。 将每个元组视为正堆的实现会错误地宣布先手获胜。 

为了```
1
18446744073709551615
```输出是`First`。 对于一个坐标，游戏恰好是该大小的普通 Nim 堆，因此每个正值都获胜。 有符号的 64 位解析器在此输入上已经失败，因为 (2^{64}-1) 大于 (2^{63}-1)。 

另一个微妙的情况是重复的行。 例如，```
2
1 1
1 1
```有输出`Second`。 有两个相同的排列元组，即((1,1))两次。 它们的 Grundy 值通过 XOR 抵消。 将排列和转换为普通整数和的实现会错过这个特征 - 两个抵消。 

最后是第二个样本，```
2
1 2
2 3
```还给出`Second`。 类似行列式的表达式为 (1\otimes3\oplus2\otimes2=3\oplus3=0)，其中 (\otimes) 是次数乘法。 使用普通乘法会得到 (3+4=7)，这与游戏的 Grundy 值无关。 

## 方法

 直接方法将枚举每个排列，构建其元组，计算该元组的 Grundy 值，并对所有这些值进行异或。 这已经是不可能的了，因为有 (n!) 种排列。 对于每个条目等于 (2^{64}-1) 的最坏情况矩阵，有 (n!) 个初始元组，如果我们尝试从一个这样的元组中枚举 (B) 的所有合法选择，则 (B) 有 ((2^{64}-1)^n) 个选择，每个选择都会生成 (2^n-1) 个元组。 因此，即使枚举博弈树的第一层也将涉及 (n!(2^{64}-1)^n(2^n-1)) 个组合。 蛮力在概念上是正确的，但在实际的游戏分析变得相关之前它就失败了。 

关键的观察结果是元组的 Grundy 值具有显着的代数形式。 包含 (a) 的一坐标元组具有 Grundy 值 (a)。 对于多个坐标，移动将 (A) 替换为 (A_i) 和 (B_i) 的所有非空组合。 因为独立分量的 Grundy 值是异或的，所以生成的元组的异或就像特征二的乘积一样展开。 

这正是数字乘法的递归游戏解释。 如果一个元组是 (A=(A_1,\ldots,A_n))，那么它的 Grundy 值为

 [
 g(A)=A_1\otimes A_2\otimes\cdots\otimes A_n。 
]

 原因是从 (A) 到选定的 (B) 的移动创建了与数字乘法的标准递归定义中使用的相同的三角、四角和更高维结构。 所有非空子集上的 XOR 是相应的乘积展开，并且次数乘法的 mex 表征准确地给出了所需的 Grundy 递推。 这是康威递减矩形游戏的 (n) 维版本。 

因此起始位置是 XOR

 [
 \bigotimes_{i=1}^{n} M_{i,\sigma(i)}
 ]

 在每个排列（\sigma）上。 数字加法是 XOR，数字乘法是 XOR 上的分配性。 将行列式展开到特征二的域上就精确地给出了这个排列和。 通常的行列式符号消失了，因为特征二中有 (1=-1)。 因此整个游戏简化为计算

 [
 \det(M)
 ]

 其中每个加法都是异或，每个乘法都是数字乘法。 这种减少也是针对该问题已发布的解决方案讨论的中心观察结果。 

剩下的挑战是足够快地实现数字乘法。 (2^{64}) 以下的值在多次加法和乘法下形成有限域 (\mathrm{GF}(2^{64}))。 在 (O(n^3)) 高斯消去法中，简单的递归乘法代价太高。 相反，我们将 64 位数字分割成 16 位数字，并预先计算 16 位数字字段的对数/指数表示。 然后，可以仅使用恒定数量的 16 位现场产品来组装 64 位产品。 这与已建立的许多图书馆所使用的分而治之的结构相同。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n!(2^{64})^n2^n)) 已经用于第一个移动层 | 天文| 太慢了|
 | 最佳| (O(n^3+2^{16})) | (O(n^2+2^{16})) | 已接受 |

 ## 算法演练

 1. 将每个矩阵条目解释为 64 位数字。 数字的加法是普通的按位异或，而乘法是特殊的数字乘积。 
2.将每个初始元组视为一个独立公正的博弈。 元组 (A) 的 Grundy 值为

 [
 A_1\o次A_2\o次\cdots\o次A_n。 
]

 多维移动规则正是其Grundy值是次数乘法的递归结构，因此我们永远不需要模拟元组的后代。 

1. 对所有排列元组的 Grundy 值进行异或。 根据分布性，这变为

[
 \bigoplus_{\sigma}
 \左(
 M_{1,\西格玛(1)}
 \otimes\cdots\otimes
 M_{n,\西格玛(n)}
 \右）。 
]

 这是 64 位数字字段上 (M) 的行列式。 由于该域具有特征二，因此对于奇数排列没有单独的符号。 

1. 用高斯消去法计算行列式。 对于列 (k)，找到该列中具有非零条目的行 (p\ge k)。 如果不存在，行列式为零，答案立即`Second`。 
2. 将行 (p) 与行 (k) 交换。 在普通字段中，行交换否定行列式，但在特征二中，值的否定是其本身，因此行列式不会改变。 
3. 将行列式累加器乘以主元 (A_{k,k})。 然后计算其乘法逆元并用它来消除主元下方的条目。 对于一行 (i>k)，所需因子为

 [
 f=A_{i,k}\o次A_{k,k}^{-1}。 
]

 对于每个 (j>k)，替换

 [
 A_{i,j}
 \左箭头
 A_{i,j}\oplus(f\otimes A_{k,j})。 
]

 然后可以将列(k)中的条目直接设置为零。 

1. 使用域恒等式计算逆

 [
 x^{-1}=x^{2^{64}-2}
 ]

 对于非零 (x)。 二进制求幂每个主元仅需要 64 次乘法，这与 (O(n^3)) 消除更新相比可以忽略不计。 有限域逆恒等式也是已发布的解决方案中使用的一种。 

1、处理完所有列后，行列式累加器就是整个起始位置的Grundy值。 打印`First`当它非零且`Second`否则。 

### 为什么它有效

 不变量是所有当前表示的元组游戏的 Grundy 值的 XOR 是它们各个游戏值的尼姆和。 对于一个元组，移动规则正是多维递减矩形游戏，其Grundy值是其坐标的次数乘积。 因此，初始位置的值等于所有排列所选择的编号乘积的异或。 分布性将该排列 XOR 转变为数字域上 (M) 的行列式。 高斯消去法保留了行列式，同时将矩阵简化为三角形形式，其主元的乘积就是行列式。 零行列式意味着零 Grundy 值，这正是第一个玩家的失败位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MASK16 = 65535
ORDER = 65535
PROOT = 10279
PPOLY = 92191

def build_small_table():
    dp = [[0] * 256 for _ in range(256)]
    dp[1][1] = 1

    for e in range(1, 4):
        p = 1 << e
        q = p >> 1
        ep = 1 << p
        eq = 1 << q
        mask = eq - 1

        for i in range(ep):
            for j in range(i, ep):
                if i < eq and j < eq:
                    continue

                if min(i, j) <= 1:
                    v = i * j
                else:
                    iu = i >> q
                    il = i & mask
                    ju = j >> q
                    jl = j & mask

                    u = dp[iu][ju]
                    l = dp[il][jl]
                    ul = dp[iu ^ il][ju ^ jl]
                    uq = dp[u][eq >> 1]

                    v = ((ul ^ l) << q) ^ uq ^ l

                dp[i][j] = v
                dp[j][i] = v

    return dp

SMALL = build_small_table()

def nim16_direct(a, b):
    if a == 0 or b == 0:
        return 0
    if min(a, b) <= 1:
        return a * b

    iu = a >> 8
    il = a & 255
    ju = b >> 8
    jl = b & 255

    u = SMALL[iu][ju]
    l = SMALL[il][jl]
    ul = SMALL[iu ^ il][ju ^ jl]
    uq = SMALL[u][128]

    return ((ul ^ l) << 8) ^ uq ^ l

def build_field_tables():
    base = [1] * 16
    for i in range(1, 16):
        base[i] = nim16_direct(base[i - 1], PROOT)

    raw_exp = [0] * ORDER
    raw_exp[0] = 1

    for i in range(1, ORDER):
        x = raw_exp[i - 1]
        raw_exp[i] = (x << 1) ^ (PPOLY if x & 32768 else 0)

    pre = [0] * 65536
    for bit in range(16):
        start = 1 << bit
        end = start << 1
        value = base[bit]
        for x in range(start, end):
            pre[x] = pre[x - start] ^ value

    exp = [0] * ORDER
    log = [0] * 65536

    for i in range(ORDER):
        value = pre[raw_exp[i]]
        exp[i] = value
        log[value] = i

    return exp, log

EXP16, LOG16 = build_field_tables()

def mul16(a, b):
    if a == 0 or b == 0:
        return 0
    return EXP16[(LOG16[a] + LOG16[b]) % ORDER]

def h16(a, shift):
    if a == 0:
        return 0
    return EXP16[(LOG16[a] + shift) % ORDER]

def mul32(a, b):
    ah = a >> 16
    al = a & MASK16
    bh = b >> 16
    bl = b & MASK16

    low = mul16(al, bl)
    cross = mul16(ah ^ al, bh ^ bl)
    high = h16(mul16(ah, bh), 3)

    return ((cross ^ low) << 16) ^ high ^ low

def mul64(a, b):
    if a == 0 or b == 0:
        return 0

    ah = a >> 32
    al = a & 0xffffffff
    bh = b >> 32
    bl = b & 0xffffffff

    low = mul32(al, bl)
    cross = mul32(ah ^ al, bh ^ bl)

    high_part = mul32(ah, bh)
    h_high = (
        (h16((high_part >> 16) ^ (high_part & MASK16), 3) << 16)
        ^ h16(high_part >> 16, 6)
    )

    return ((cross ^ low) << 32) ^ h_high ^ low

def nim_pow(a, e):
    result = 1
    while e:
        if e & 1:
            result = mul64(result, a)
        a = mul64(a, a)
        e >>= 1
    return result

def nim_inverse(a):
    return nim_pow(a, (1 << 64) - 2)

def determinant(mat):
    n = len(mat)
    det = 1

    for col in range(n):
        pivot = col
        while pivot < n and mat[pivot][col] == 0:
            pivot += 1

        if pivot == n:
            return 0

        if pivot != col:
            mat[pivot], mat[col] = mat[col], mat[pivot]

        p = mat[col][col]
        det = mul64(det, p)
        inv = nim_inverse(p)

        pivot_row = mat[col]

        for i in range(col + 1, n):
            value = mat[i][col]
            if value == 0:
                continue

            factor = mul64(value, inv)
            row = mat[i]

            row[col] = 0
            for j in range(col + 1, n):
                row[j] ^= mul64(factor, pivot_row[j])

    return det

def solve():
    n = int(input())
    mat = [list(map(int, input().split())) for _ in range(n)]

    ans = determinant(mat)
    print("First" if ans else "Second")

if __name__ == "__main__":
    solve()
```第一个预处理阶段为以下所有数字构建乘法 (256)。 递归将 8 位值分成两半，并使用位数乘法的递归定义。 该表仅包含 (256^2) 个条目。 

下一阶段构建具有 65536 个元素的字段表示。 价值`PPOLY = 92191`描述用于多项式表示的不可约多项式，而`PROOT = 10279`提供数字表示中的原始元素。 指数表将该原始元素的幂转换为实际的 16 位数字，并且`LOG16`执行反向映射。 此结构是标准快速数字实现的 16 位版本。 

16 位数字乘积只是两次表查找和一次索引操作。 32 位和 64 位产品使用来自数字领域的 Karatsuba 风格标识。 尤其，`mul32`需要三个 16 位产品，并且`mul64`需要三个 32 位产品。 位移表示为`h16`对应于 16 位字段分解中乘以 (2^{15})。 

行列式例程执行普通的高斯消元法，用异或代替加法。 由于该字段具有特征二，因此行交换不会引入符号更改。 主元本身乘以`det`在该行用于消除之前，因此即使消除行未标准化，最终值仍然是行列式。 

其倒数指数为`(1 << 64) - 2`，正好是 (2^{64}-2)。 Python 整数具有任意精度，因此在构造指数或解析输入值时不会发生溢出。 矩阵条目本身保持在 (2^{64}) 以下，并且每个数字运算都会返回另一个 64 位字段元素。 

消除过程中的操作顺序很重要。 在修改数据透视表行之前，必须使用当前数据透视表的倒数来计算该因子。 在此实现中，数据透视行从未标准化，因此其原始条目对于每个行更新仍然可用。 

## 工作示例

 ### 示例 1

 矩阵是```
0 1 2
1 2 3
1 2 1
```消去迹为：

 | 专栏 | 枢轴行| 枢轴| 行更新 | 行列式 |
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | (R_1\leftrightarrow R_0)，然后 (R_2\leftarrow R_2\oplus R_0) | 1 |
 | 1 | 1 | 1 | 枢轴下方没有非零条目 | 1 |
 | 2 | 2 | 2 | 下面没有行 | 2 |

 第一次交换后矩阵为```
1 2 3
0 1 2
1 2 1
```第三行的因子是 (1\otimes1^{-1}=1)，因此第三行变为```
0 0 2
```因此，三角形枢轴为 (1,1,2)，行列式为

 [
 1\otimes1\otime2=2。 
]

 行列式非零，因此初始博弈具有非零 Grundy 值，答案为`First`。 

该迹线还说明了为什么不能将普通乘法代入行列式。 在 nimber 字段中评估相同的矩阵，例如 (2\otimes2=3)。 

### 示例 2

 矩阵是```
1 2
2 3
```踪迹是：

 | 专栏 | 枢轴| 逆| 行因子| 更新行 | 行列式 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1 | 1 | 2 | ([0,,3\oplus(2\otimes2)]=[0,0]) | 1 |
 | 1 | 0 | 不可用 | 无 | 无 | 0 |

 由于 (2\otimes2=3)，第二个条目变为

 [
 3\oplus3=0。 
]

 第二个主元不存在，因此行列式为零，答案为`Second`。 

此示例练习了矩阵变为奇异的情况，因为次数乘法与普通整数乘法不同。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n^3+2^{16})) | 高斯消除执行 (O(n^3)) 字段操作，而 16 位表需要 (O(2^{16})) 预处理 |
 | 空间| (O(n^2+2^{16})) | 矩阵需要 (O(n^2)) 存储，指数/对数表需要 (O(2^{16})) 存储 |

 对于(n\le150)，高斯消元法只有大约几百万次矩阵级运算，并且每次乘法都会减少到恒定的16位表访问次数。 预处理独立于 (n)，因此解适合预期的多项式界限，而不是原始排列集的阶乘大小。 

## 测试用例

 以下线束假设提交的实现保存为`solution.py`并暴露了`solve()`功能。 最大大小的情况以编程方式生成，因此测试文件本身仍然可读。```python
# test_solution.py
import sys
import io
from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
assert run(
    """3
0 1 2
1 2 3
1 2 1
"""
) == "First", "sample 1"

# Provided sample 2
assert run(
    """2
1 2
2 3
"""
) == "Second", "sample 2"

# Minimum size, zero tuple is immediately losing.
assert run(
    """1
0
"""
) == "Second", "single zero"

# Minimum size, largest allowed input value is positive.
MAX64 = (1 << 64) - 1
assert run(
    f"""1
{MAX64}
"""
) == "First", "single maximum value"

# Identity matrix has determinant 1.
assert run(
    """2
1 0
0 1
"""
) == "First", "identity matrix"

# Equal rows make the determinant zero.
assert run(
    """2
1 1
1 1
"""
) == "Second", "equal rows"

# Boundary value combined with a zero entry.
assert run(
    f"""2
{MAX64} 0
0 1
"""
) == "First", "maximum boundary value"

# Maximum n, all rows equal, so determinant is zero.
max_case = "150\n" + "\n".join(["7 " * 149 + "7"] * 150) + "\n"
assert run(max_case) == "Second", "maximum n with equal rows"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 0`|`Second`| 包含零的元组没有移动 |
 |`1 / 2^64-1`|`First`| 64位无符号边界和一维游戏|
 |`2 / identity`|`First`| 非对角线项为零的非零行列式 |
 |`2 / equal rows`|`Second`| 特征-二消去矩阵和奇异矩阵|
 |`2 / [[2^64-1,0],[0,1]]`|`First`| 无符号溢出的最大输入值 |
 |`150 / all 7`|`Second`| 最大矩阵维数和立即零行列式 |

 ## 边缘情况

 在尝试任何逆或消除之前处理零元组情况。 为了```
1
0
```行列式是单个条目 (0)，因此算法返回零并打印`Second`。 这与游戏匹配，因为无法选择包含零的元组。 

为了获得最大可能的值，```
1
18446744073709551615
```行列式是相同的非零数字。 一维游戏是一个普通的 Nim 堆，因此它的 Grundy 值就是堆大小本身。 该算法从不将该值转换为有符号类型，并且非零行列式产生`First`。 

重复的元组由 XOR 自动处理。 和```
2
1 1
1 1
```两种排列产生完全相同的元组 ((1,1))。 它的Grundy值为(1\otimes1=1)，两个副本贡献(1\oplus1=0)。 行列式也为零，因为两行相等，因此算法打印`Second`。 

在算法搜索完其下方的所有行之前，零主元并不意味着零行列式。 例如，```
2
0 1
1 0
```第一个主元位置从零开始，但第二行提供非零主元。 交换行后，主元为 (1) 和 (1)，给出行列式 (1) 和输出`First`。 一个简单检查的实现`matrix[k][k] == 0`不搜索另一行将错误返回`Second`。 

第二个示例揭示了普通算术和数字算术之间的差异。 为了```
2
1 2
2 3
```消除因子为(2)，右下值为

 [
 3\oplus(2\otimes2)=3\oplus3=0。 
]

 行列式为零，所以结果是`Second`。 普通的整数消除会使用(2\cdot2=4)并得到(3-4=-1)，这与游戏的代数无关。 

在最大维度，考虑一个 (150\times150) 矩阵，其中每个条目都是 (7)。 可以选择第一个主元，但其他所有行都与其相同，因此消除会使所有后面的主元列消失。 等价地，行列式有两个相等的行并且为零。 该算法终止于`Second`无需构建（150！）个初始元组。
