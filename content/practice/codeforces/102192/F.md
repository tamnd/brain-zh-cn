---
title: "CF 102192F - 布尔 3 数组"
description: "布尔 3 数组是一个（m×n×p）盒子，其单元格包含零或一。 我们可以沿着三个维度中的每一个独立地排列切片，并且我们可以沿着任何维度切换任何完整的切片。"
date: "2026-08-18T02:04:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "F"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 273
verified: true
draft: false
---

[CF 102192F - 布尔 3 数组](https://codeforces.com/problemset/problem/102192/F)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 布尔 3 数组是一个 (m\times n\times p) 盒子，其单元格包含零或一。 我们可以沿着三个维度中的每一个独立地排列切片，并且我们可以沿着任何维度切换任何完整的切片。 如果可以使用这些操作将一个数组更改为另一个数组，则两个数组属于同一类。 任务是计算存在多少个这样的类，因为从每个类中我们最多可以选择一个代表。 

官方输入的测试用例多达300个，每个维度最多13个。小维度界限是中心线索。 在 (13\times13\times13) 处直接枚举 (2^{mnp}) 数组已经不可能了，因为那里正好有 (2^{2197}) 个数组。 排列组也太大而无法单独枚举。 我们需要计算轨道而不构建它们。 

有几种简单的情况会暴露简单实现中的错误。 为了`1 1 1`，单个单元格可以切换，因此两个可能的数组是等效的，答案是`1`。 为了`1 1 2`，两层中的每一层都可以独立切换，因此所有四个数组都是等效的，答案又是`1`。 对于这种情况，仅考虑排列的程序将错误地返回两个类。 

一个稍微不那么简单的边界情况是`1 2 2`。 第一维消失后，结构是一个 (2\times2) 二元矩阵。 行和列切换一次更改两个单元格，因此四个单元格的奇偶校验是不变的。 双方均出现，给出答案`2`。 一个粗心的论点说任意切片翻转总是可以清除整个数组，但忽略了这个不变量。 

官方声明确认了边界 (m,n,p\le13)、2 秒限制和样本输出`1`,`9`， 和`723`为了`1 1 1`,`2 2 2`， 和`2 3 4`。 

## 方法

 暴力方法将枚举 (2^{mnp}) 数组中的每一个，并通过尝试允许的操作将每个数组分配给一个等价类。 这是正确的，因为操作从语句中生成了精确的等价关系。 最大尺寸时有 (2^{2197}) 个数组，大约为 (10^{661}) 个，因此即使仅仅读取所有可能的数组也是不可能的。 在最坏的情况下，成对比较需要精确的 (\binom{2^{2197}}2) 比较。 

有用的观察结果是，这些操作形成了布尔数组集上的有限群操作。 因此，等价类的数量由 Burnside 引理给出：所有组元素的平均值是由该元素固定的数组数量。 

组元素由第一维度的排列、第二维度的排列、第三维度的排列以及切片切换的集合组成。 我们不处理单独的排列，而是按循环类型对排列进行分组。 大小最多为 13 的排列的可能循环类型非常少，大小为 13 时只有 101 个。 

修复三个排列。 考虑一个长度为 (a) 的循环、一个长度为 (b) 的循环和一个长度为 (c) 的循环。 它们对相应细胞块的产物作用

 [
 \frac{abc}{\operatorname{lcm}(a,b,c)}
 ]

 细胞轨道。 因此，如果三个排列具有循环列表 (A,B,C)，则细胞轨道的总数为

 \sum_{a\in A}\sum_{b\in B}\sum_{c\in C}
 \frac{abc}{\operatorname{lcm}(a,b,c)}。 
]

 更困难的部分是计算哪些切片切换选择允许固定数组存在。 这变成了 (\mathbb F_2) 上的线性系统。 对于每个排列周期，只有该周期上的切换奇偶校验很重要。 对应于所选周期奇偶校验的实际切换分配的数量已经被吸收到该系统的总尺寸中。 

对于来自周期长度 (a,b,c) 的元胞轨道，设 (L=\operatorname{lcm}(a,b,c))。 相应的一致性方程恰好包含 (a) 周期 (L/a) 次的奇偶校验。 以 2 为模，当 (L/a) 为奇数时，该系数恰好为 1。 当循环 (a) 具有最大的 2 次幂除以 (a,b,c) 的长度时，就会发生这种情况。 

这意味着线性代数不依赖于完整的循环长度。 这仅取决于他们的 2-adic 估值。 在固定估值 (v) 下，令 (x,y,z) 为三个排列中精确估值 (v) 的周期数。 此估值的限制独立于所有其他估值。 如果所有三个维度都有评估周期 (v) 为止的可用周期，则当所有三个维度都有评估周期 (v) 时，在此级别贡献的排名为 (x+y+z-2)，当恰好有两个维度有评估周期时，为 (x+y-1)，而只有一个维度有评估周期时，则为周期数。 

这两部分现在干净地结合在一起。 对于排列循环类型的固定三元组，所有切片切换选择的固定数组之和为

 [
 2^{m+n+p-r}\cdot 2^{Q},
 ]

 其中（r）是奇偶校验约束的等级，（Q）是细胞轨道的数量。 

蛮力方法之所以有效，是因为它明确地代表了每个轨道。 它失败了，因为数组数量多得天文数字。 Burnside 让我们可以一次性计算所有这些轨道，而循环类型将排列空间从阶乘排列压缩到每个维度最多 101 个分区。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^{mnp})) 或更糟 | (O(2^{mnp})) | 太慢了|
 | Burnside 与自行车类型 | (O(P(m)P(n)P(p)\cdot 13)) 每个不同维度三元组 | (O(P(13)^2\cdot13)) 辅助 | 已接受 |

 这里(P(k))表示(k)的整数分区的数量，其中(P(13)=101)。 由于答案在三个维度上是对称的，因此实现在缓存之前对每个维度三元组进行排序。 只有 (\binom{15}{3}=455) 个可能的排序三元组。 

## 算法演练

1. 生成从 1 到 13 的每个数字的每个整数分区。对于每个分区，存储其循环长度、具有该循环类型的排列数量以及每个 2-adic 评估有多少个循环。 

诸如 (1+1+2) 之类的划分表示包含两个固定点和一个 2 循环的排列。 其重数为

 [
 \frac{3!}{1^2,2^1,2!,1!}=3。 
]
 2. 对于所需的每对循环类型，预先计算

 \sum_{a,b}
 \text{cnt}_A[a]\text{cnt}_B[b]
 \frac{abc}{\operatorname{lcm}(a,b,c)}
 ]

 对于每个可能的第三个周期长度（c）。 

一旦知道这个向量，第三种循环类型的细胞轨道总数就是

 [
 Q=\sum_c \text{cnt}_C[c]S[c]。 
]

 这避免了在最内层循环内重复评估 gcd 和 lcm 操作。 
3. 对于三重循环类型，独立计算切换一致性方程的秩以进行评估 (v=0,1,2,3)。 最多 13 的周期长度没有比 3 更大的 2-adic 估值。 

在评估(v)时，首先检查每个维度是否最多包含至少一个评估周期(v)。 否则，任何细胞轨道都不能将 (v) 作为其最大估值。 如果该级别处于活动状态，则统计有多少个维度至少具有一个周期的精确估值（v），并添加相应的排名贡献。 
4. 对于每个置换循环型三元组，将其三个置换重数乘以

 [
 2^{m+n+p-r+Q}。 
]

 指数 (m+n+p-r) 计算所有满足奇偶校验约束的切片切换分配，而 (Q) 计算结果单元轨道中单元的二进制选择。 
5. 将所有循环类型三元组的这些贡献相加。 
6. 将 Burnside 总和除以

 [
 m!,n!,p!,2^{m+n+p}。 
]

 这里有一个小微妙之处。 切片切换具有二维内核：在二维中切换每个切片不会产生任何变化。 因此，实际切换组的大小为 (2^{m+n+p-2})。 我们的计算故意对所有 (2^{m+n+p}) 切换描述求和，因此每个实际的组元素出现四次。 同样的四因数也出现在分子中，这就是为什么除以 (2^{m+n+p}) 是完全正确的。 
7. 在评估答案之前对三个维度进行排序并缓存结果。 这些操作对称地处理三个轴，因此这不会改变答案，并避免在相同维度的排列上重复工作。 

### 为什么它有效

 对于每个组元素，Burnside 都需要其确切数量的固定数组。 排列部分将细胞分裂成独立的轨道。 由元素固定的数组必须在每个这样的轨道上保持恒定，直到指定的切换奇偶校验，一旦切换奇偶校验一致，就会给出 (2^Q) 个选择。 

一致性条件仅通过其切片切换的奇偶校验来依赖于循环。 对于 2-adic 估值达到相应三元组中最大估值的周期，该奇偶校验的系数恰好是奇数。 因此，具有相同最大估值的所有约束形成一个单独的线性系统，其等级是上述完整的二部或三部奇偶校验等级。 

因此，每个排列三元组都准确地贡献了算法使用的值。 通过循环类型重数对所有排列求和，得到完整的 Burnside 分子，最后的除法精确给出等价类的数量。 

## Python 解决方案```python
import sys
from math import gcd
from functools import lru_cache

input = sys.stdin.readline

MOD = 998244353
MAXN = 13
MAXCELLS = MAXN * MAXN * MAXN

fact = [1] * (MAXN + 1)
for i in range(1, MAXN + 1):
    fact[i] = fact[i - 1] * i % MOD

invfact = [1] * (MAXN + 1)
invfact[MAXN] = pow(fact[MAXN], MOD - 2, MOD)
for i in range(MAXN, 0, -1):
    invfact[i - 1] = invfact[i] * i % MOD

pow2 = [1] * (MAXCELLS + 1)
for i in range(1, MAXCELLS + 1):
    pow2[i] = pow2[i - 1] * 2 % MOD

invpow2 = [1] * (MAXCELLS + 1)
inv2 = (MOD + 1) // 2
for i in range(1, MAXCELLS + 1):
    invpow2[i] = invpow2[i - 1] * inv2 % MOD

def v2(x):
    return (x & -x).bit_length() - 1

# orbit3[a][b][c] is the number of cell orbits produced
# by one a-cycle, one b-cycle and one c-cycle.
orbit3 = [[[0] * (MAXN + 1) for _ in range(MAXN + 1)]
          for _ in range(MAXN + 1)]

for a in range(1, MAXN + 1):
    for b in range(1, MAXN + 1):
        ab = a * b // gcd(a, b)
        for c in range(1, MAXN + 1):
            l = ab * c // gcd(ab, c)
            orbit3[a][b][c] = a * b * c // l

class CycleType:
    __slots__ = ("n", "parts", "cnt", "vcnt", "weight", "cum")

    def __init__(self, n, parts, cnt):
        self.n = n
        self.parts = parts
        self.cnt = cnt

        vcnt = [0] * 4
        for length, number in cnt.items():
            vcnt[v2(length)] += number
        self.vcnt = tuple(vcnt)

        denom = 1
        for length, number in cnt.items():
            for _ in range(number):
                denom *= length
            denom *= fact[number]
        self.weight = fact[n] * pow(denom, MOD - 2, MOD) % MOD

        s = 0
        cum = []
        for x in vcnt:
            s += x
            cum.append(s)
        self.cum = tuple(cum)

def make_cycle_types(n):
    result = []

    def dfs(rem, last, parts):
        if rem == 0:
            cnt = {}
            for x in parts:
                cnt[x] = cnt.get(x, 0) + 1
            result.append(CycleType(n, tuple(parts), cnt))
            return

        for x in range(last, rem + 1):
            parts.append(x)
            dfs(rem - x, x, parts)
            parts.pop()

    dfs(n, 1, [])
    return result

types = [None] * (MAXN + 1)
for n in range(1, MAXN + 1):
    types[n] = make_cycle_types(n)

pair_orbit_cache = {}

def get_pair_orbits(A, B):
    key = (id(A), id(B))
    if key in pair_orbit_cache:
        return pair_orbit_cache[key]

    s = [0] * (MAXN + 1)

    for a in A.parts:
        ca = A.cnt[a]
        for b in B.parts:
            cb = B.cnt[b]
            mul = ca * cb
            row = orbit3[a][b]
            for c in range(1, MAXN + 1):
                s[c] += mul * row[c]

    pair_orbit_cache[key] = tuple(s)
    return pair_orbit_cache[key]

def rank_of(A, B, C):
    rank = 0

    for v in range(4):
        av = A.vcnt[v]
        bv = B.vcnt[v]
        cv = C.vcnt[v]

        if av == 0 and bv == 0 and cv == 0:
            continue

        # Every dimension must have some cycle of valuation <= v,
        # otherwise v cannot be the maximum valuation of a cell orbit.
        if A.cum[v] == 0 or B.cum[v] == 0 or C.cum[v] == 0:
            continue

        active_dimensions = (av > 0) + (bv > 0) + (cv > 0)
        total = av + bv + cv

        rank += total - active_dimensions + 1

    return rank

@lru_cache(maxsize=None)
def solve_dimension(n, m, p):
    n, m, p = sorted((n, m, p))

    total = 0

    for A in types[n]:
        wa = A.weight

        for B in types[m]:
            wb = B.weight
            s = get_pair_orbits(A, B)
            wab = wa * wb % MOD

            for C in types[p]:
                q = 0
                for c in C.parts:
                    q += C.cnt[c] * s[c]

                r = rank_of(A, B, C)

                contribution = pow2[n + m + p - r + q]
                contribution = contribution * wab % MOD
                contribution = contribution * C.weight % MOD

                total += contribution

    total %= MOD

    denominator_inverse = (
        invfact[n]
        * invfact[m]
        % MOD
        * invfact[p]
        % MOD
        * invpow2[n + m + p]
        % MOD
    )

    return total * denominator_inverse % MOD

def main():
    T = int(input())
    out = []

    for _ in range(T):
        n, m, p = map(int, input().split())
        out.append(str(solve_dimension(n, m, p)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```阶乘数组处理多种排列循环类型。 对于具有 (c_l) 个长度为 (l) 的循环的循环类型，其重数为

 [
 \frac{n!}{\prod_l l^{c_l}c_l!}。 
]

这`CycleType`对象准确地存储了 Burnside 所需的信息：其循环长度、其多重性、其排列权重以及每个 2-adic 估值的循环数。 

这`orbit3`table 从最里面的枚举中删除了 gcd 和 lcm 工作。 它的值是三个单独排列周期乘积内的轨道数，即它们的大小除以这些大小的 lcm 的乘积。`get_pair_orbits`然后将两种循环类型组合成一个紧凑向量。 一旦计算出该向量，选择第三循环类型仅需要一个短的加权和。`rank_of`故意使用累积估值计数。 仅当每个维度至少有一个估值不大于该级别的周期时，该估值级别才能提供约束。 表达式`total - active_dimensions + 1`给出完整的一方、二方或三方奇偶校验系统的等级.

 Python 整数不会溢出，但每个组合值都会按模减少`998244353`乘法后。 的指数`pow2`至多 (mnp+m+n+p)，完全在预先计算的范围内。 

最终的逆因子包含`invpow2[n+m+p]`， 不是`invpow2[n+m+p-2]`。 该代码枚举了所有切片切换描述，包括表示切换子组中的身份的四个描述。 这四倍的冗余是有意为之的，并且抵消了伯恩赛德分子中的相应因子。 

## 工作示例

 ### 示例 1：`1 1 1`每个维度中只有一种循环类型，即长度为 1 的单个循环。 

| 尺寸| 循环类型| 排列权重 | 2-进数计数 |
 | --- | --- | --- | --- |
 | 1 |`[1]`| 1 | (v_2=0:1) |
 | 1 |`[1]`| 1 | (v_2=0:1) |
 | 1 |`[1]`| 1 | (v_2=0:1) |

 单个细胞是一个细胞轨道，所以（Q=1）。 在估值为零时，所有三个维度都参与，给出排名（1+1+1-2=1）。 

| 数量 | 价值|
 | --- | --- |
 | (m+n+p) | (m+n+p) | 3 |
 | （问）| 1 |
 | 等级 | 1 |
 | 固定数组和 | (2^{3-1+1}=8) |
 | 分母| (2^3=8) | (2^3=8) |
 | 答案| 1 |

 结果是`1`，因为两个可能的单单元阵列仅通过切换不同。 

### 示例 2：`2 2 2`对于大小 2，两种置换循环类型是`[1,1]`和`[2]`，每个重数为 1。 

| 第一维度| 二次元| 第三维度 | 主要作用|
 | --- | --- | --- | --- |
 |`[1,1]`|`[1,1]`|`[1,1]`| 所有周期估值均为 0 |
 |`[1,1]`|`[1,1]`|`[2]`| 第三维度估值更大 |
 |`[1,1]`|`[2]`|`[1,1]`| 第二维度估值更大 |
 |`[1,1]`|`[2]`|`[2]`| 两个2周期估值最大|
 |`[2]`|`[1,1]`|`[1,1]`| 与第二行对称 |
 |`[2]`|`[1,1]`|`[2]`| 与第四行对称|
 |`[2]`|`[2]`|`[1,1]`| 与第四行对称|
 |`[2]`|`[2]`|`[2]`| 所有三个维度都有估值 1 |

 The algorithm evaluates these eight cycle-type triples, multiplies each fixed-array count by its permutation multiplicity, and divides their sum by

 [
 2^{6}(2!)^3。 
]

 由此产生的轨道数为`9`，与官方样品相符。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(P(n)P(m)P(p)\cdot13)) 每个未缓存的维度三元 | 每个循环型三元组都需要一个短轨道总和和四个估值水平 |
 | 空间| (O(P(13)^2\cdot13)) | 缓存的轨道向量对加上所有分区数据 |

 由于 (P(13)=101)，即使是最大的个案也最多有 (101^3) 个循环型三元组。 对维度进行排序使答案对称，并且缓存可以防止对相同维度的三元组进行重复工作。 约束故意设置得足够小，以便整数分区取代不可能的排列和数组枚举。 

## 测试用例```python
# This test harness uses the solve_dimension function from the solution above.

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    t = data[0]
    pos = 1
    ans = []

    for _ in range(t):
        n, m, p = data[pos], data[pos + 1], data[pos + 2]
        pos += 3
        ans.append(str(solve_dimension(n, m, p)))

    return "\n".join(ans)

# Official samples
assert run("""1
1 1 1
""") == "1", "sample 1"

assert run("""1
2 2 2
""") == "9", "sample 2"

assert run("""1
2 3 4
""") == "723", "sample 3"

# Minimum size
assert run("""1
1 1 1
""") == "1", "minimum dimensions"

# Maximum allowed dimension, with the other two dimensions minimal.
# Every layer can be toggled independently, so all arrays are equivalent.
assert run("""1
1 1 13
""") == "1", "maximum single dimension"

# Boundary case where the answer is not 1.
# This exposes the invariant given by the parity of all four cells.
assert run("""1
1 2 2
""") == "2", "2x2 matrix parity"

# Another one-dimensional boundary case.
assert run("""1
1 1 2
""") == "1", "independent layer toggles"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1`|`1`| 最小尺寸数组和完整切换等价 |
 |`1 1 13`|`1`| 最大尺寸限制和独立层切换 |
 |`1 2 2`|`2`| 当一维为 1 时非平凡奇偶不变 |
 |`1 1 2`|`1`| 各个层的独立切换|
 |`2 2 2`|`9`| 排列、切换和 2-adic 秩之间的交互

 ## 边缘情况

 对于`1 1 1`，该算法在每个维度都有一种循环类型。 其细胞轨道计数为(1)，奇偶校验等级为(1)，伯恩赛德分子为(2^{3-1+1}=8)。 分母也是8，所以结果就是`1`。 

为了`1 1 2`，前两个维度包含一个 1-cycle，第三个维度包含两个 1-cycle 或一个 2-cycle。 两个单独层上的切换操作已经连接了所有四个二进制数组。 Burnside 计算给出一个轨道，所以答案是`1`。 这种情况捕获将层排列视为唯一操作的实现。 

为了`1 2 2`，两个非平凡的维度形成一个二元（2\times2）矩阵。 切换一行或一列正好改变两个单元格，因此总个数的奇偶校验不能改变。 排列行或列也保留了这种奇偶性。 两个奇偶校验值都会出现，并且固定奇偶校验的每个矩阵在允许的操作下都是等效的，恰好给出两个类。 循环式计算产生`2`。 

对于最大允许的单一尺寸，`1 1 13`，13层中的每一层都可以独立切换。 从任何二进制向量开始，精确切换包含 1 的层，获得全零数组。 因此，每个数组都等价于其他数组，答案仍然存在`1`。 该算法无需特殊情况即可处理此问题，因为 Burnside 排名会自动考虑所有独立切片切换。 

案例`2 2 2`是对整个机器进行有用的健全性检查。 它包含奇数长度周期和偶数长度周期，因此 2-adic 估值之间的区别很重要。 仅使用循环数，而不跟踪它们的长度是奇数还是偶数，会给出错误的固定数组计数。 基于评估的排名计算正是区分这些情况并产生正确答案的方法`9`。
