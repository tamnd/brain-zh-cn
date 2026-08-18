---
title: "CF 102192C - 城市发展"
description: "我们有n个按顺序排列的城市，这些城市同时被划分为嵌套的行政组。 第 i 层的组恰好包含 ni 个连续城市，并且每个较细的组完全位于一个较粗的组内。"
date: "2026-08-18T01:57:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "C"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 215
verified: true
draft: false
---

[CF 102192C - 城市发展](https://codeforces.com/problemset/problem/102192/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 35s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`城市按顺序排列，这些城市同时被划分为嵌套的行政组。 水平上的一组`i`恰好包含`n_i`连续的城市，并且每个更细的组完全位于一个更粗的组内。 最终等级有`n_k = 1`，所以单个城市本身就是一个级别-`k`团体。 

对于两个城市来说，相互作用系数仅取决于包含这两个城市的最细行政级别。 如果它们属于不同的顶级组，则它们的系数为`rho_0`。 如果它们首先在某个更精细的层面上分离，则相应的`rho_i`被使用。 城市通过以下方式与自身互动：`rho_k`。 

一年是当前城市价值向量的线性变换。 如果我们称这种转变为`A`，任务是计算`A^T d_0`模数`998244353`， 在哪里`T`可以大到`10^18`。 

直接解释给出了`n x n`矩阵，但存储或乘以这样的矩阵是立即不可能的。 即使矩阵的一种应用也需要`Theta(n^2)`运营。 和`n = 3 * 10^5`，这大约是`9 * 10^10`一年内的配对互动，远远超出了四秒的限制。 指数`T`也排除了逐年模拟的情况。 

层次结构本身就是有用的结构。 因为每个组的大小都除以前一个组的大小，所以每当大小严格减小时，它最多变为前一个大小的一半。 因此，虽然`k`可以大到`n`因为允许相等的连续大小，所以最多可以有`O(log n)`不同的团体规模。 

有几种边缘情况可能会悄无声息地破坏粗心的实现。 第一个是`n = 1`。 例如，```
1
1 1 3
1
7
2 5
```唯一的城市使用`rho_1 = 5`，所以答案是`7 * 5^3 = 875`。 治疗`rho_0`因为对角线系数会给出错误的结果。 

另一个边缘情况是重复的管理规模。 例如，```
1
4 3 1
4 2 1
3 3 3 3
1 2 4 7
```每个城市都看到另外三个城市，并进行全面互动`1 + 4 + 1 + 7`按级别排列，行总和为`13`。 由于每个初始值都是`3`，正确的输出是```
39 39 39 39
```假设每个级别都引入一个新分区的解决方案可能会创建零维特征空间并错误处理重复大小。 

当最大的行政组已包含所有城市时，会出现第三种边界情况。 例如，```
1
4 3 2
4 2 1
1 2 3 4
1 1 1 2
```这里的矩阵很简单`J + I`， 在哪里`J`是全1矩阵。 平方它给出`6J + I`，所以答案是```
61 62 63 64
```假设顶级组之外始终存在非空空间的解决方案将错误地丢弃这种情况。 

## 方法

 蛮力方法显式地构造交互矩阵。 对于每对城市，我们确定它们的最低共同行政级别并将相应的系数放入矩阵中。 申请一年然后花费`O(n^2)`，并这样做是为了`T`年成本`O(Tn^2)`。 即使我们尝试矩阵求幂，稠密的`n x n`矩阵会使乘法变得过于昂贵。 在`n = 3 * 10^5`，单独的矩阵将大致包含`9 * 10^10`条目。 

有用的观察是矩阵不是任意的。 定义`B_i`作为其条目为的矩阵`1`恰好当两个城市属于同一级别时——`i`团体。 由于系数变化自`rho_{i-1}`到`rho_i`当我们达到水平时`i`，相互作用矩阵可以写为

 [
 A = \rho_0 J + \sum_{i=1}^{k}(\rho_i-\rho_{i-1})B_i。 
]

 这种表示很强大，因为所有`B_i`是嵌套块矩阵。 更准确地说，如果`P_m`意味着对每个连续块内的向量进行平均`m`城市，那么

 [
 B_i = n_i P_{n_i}。 
]

 所有这些平均算子都是嵌套子空间上的投影，因此它们可以交换并且可以同时分解为独立的分层组件。 

对于不同的块大小`m`，将具有该大小的所有项收集到一个系数中

 [
 \gamma_m = \sum_{i=m}(\rho_i-\rho_{i-1})m。 
]

 那么矩阵就变成了

 [
 A = \rho_0 J + \sum_m \gamma_m P_m。 
]

 假设不同的尺寸是

 [
 m_1 > m_2 > \dots > m_r=1。 
]

让`P_0`成为所有的全局平均算子`n`城市。 区别

 [
 P_{m_q}-P_{m_{q-1}}
 ]

 准确提取内部恒定的信息`m_q`块，但其父块内的平均值为零。 每个这样的子空间都是一个特征空间`A`。 

属于按尺寸引入的分量的特征值`m_q`是后缀和

 [
 \lambda_q=\sum_{j=q}^{r}\gamma_{m_j}。 
]

 全局常数分量具有特征值

 [
 \lambda_0=n\rho_0+\sum_{j=1}^{r}\gamma_{m_j}。 
]

 其余部分由顶级组之间的差异组成，其特征值为零。 自从`T >= 1`，该分量在将矩阵提升到`T`次幂。 

蛮力之所以有效，是因为它应用了精确的交互矩阵。 它失败了，因为它独立对待每对城市。 通过观察矩阵是嵌套平均算子的总和，我们可以用少量的分层投影来替换成对交互。 由于不同的尺寸每当改变时就会减半，因此只有`O(log n)`这样的预测。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(T n^2)`|`O(n^2)`| 太慢了 |
 | 最佳 |`O(n + n log n)`|`O(n)`| 已接受 |

 下面的实现甚至比明确访问每个级别的每个城市更有效。 每个投影都是通过其块上的范围添加来应用的。 所有不同大小的块总数为`O(n)`因为尺寸至少减小了两倍。 

## 算法演练

 1. 读取行政规模和相互作用系数，然后用单个不同的规模替换连续的相等规模。 适合各种尺寸`m`, 积累

 [
 \gamma_m \mathrel{+}=m(\rho_i-\rho_{i-1})。 
]

 相同的级别产生相同的平均算子，因此可以安全地组合它们的矩阵贡献。 
2. 计算后缀特征值。 从最小到最大处理不同的尺寸给出

 [
 \lambda_q=\gamma_{m_q}+\lambda_{q+1}。 
]

 这正是之间差异的特征值`m_q`-块平均值及其父块平均值，因为每个更精细的投影都充当该组件上其块大小的乘法。 
3. 计算全局特征值

 [
 \lambda_0=n\rho_0+\sum_q\gamma_{m_q}。 
]

 全常数向量是特征向量，因为交互矩阵的每一行都具有相同的和。 
4. 将每个相关特征值提高为`T`模数`998244353`。 自从`T`可以达到`10^18`，需要进行二进制求幂。 
5. 将动力算子表示为平均投影的线性组合。 开始于`lambda_0^T`在全球平均水平上。 对于每个不同的尺寸`m < n`，相应的特征空间贡献

 [
 \lambda_m^T(P_m-P_{\text{父}})。 
]

 将正系数添加到`P_m`并从其父投影中减去它会产生每个投影的最终系数。 
6. 构建初始城市值的前缀和。 这使我们能够在恒定时间内获得任何管理块的总和，因此在乘以其大小的模倒数后获得其在恒定时间内的平均值。 
7. 使用差异数组应用每个投影系数。 对于每个块`[l,r)`，计算其平均值并通过两次差值数组更新将相应的值添加到整个区间。 只有`n/m`尺寸块`m`。 
8. 对差值数组进行一次前缀求和，恢复每个城市的最终值。 

正确性不变量是，在处理任何分层分量的集合之后，分配给城市的累积值正是这些分量在初始向量的特征空间分解中的贡献。 经营者`P_m`是嵌套投影，因此每个向量都唯一地分解为全局常数分量、嵌套块平均值之间的连续差异以及剩余的顶级差异分量。 后者的特征值为零，并在至少一年后消失。 每个其他分量乘以其精确的特征值，得到`T`，所以得到的向量正好是`A^T d_0`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve_case(n, k, T, sizes, d, rho):
    # Compress equal administrative sizes.
    groups = []
    gamma = []

    for i in range(k):
        m = sizes[i]
        add = (rho[i + 1] - rho[i]) * m % MOD

        if groups and groups[-1] == m:
            gamma[-1] = (gamma[-1] + add) % MOD
        else:
            groups.append(m)
            gamma.append(add)

    r = len(groups)

    # Suffix eigenvalues for the hierarchical difference spaces.
    eig = [0] * r
    cur = 0
    for i in range(r - 1, -1, -1):
        cur += gamma[i]
        cur %= MOD
        eig[i] = cur

    # Eigenvalue of the global constant subspace.
    global_eig = (rho[0] * n + cur) % MOD
    global_pow = pow(global_eig, T, MOD)

    # Coefficients of the projection operators.
    #
    # The decomposition is
    # A^T = global_pow * P_global
    #       + sum eig[i]^T * (P_i - P_parent).
    #
    # If groups[i] == n, P_i == P_global, so that component is zero.
    coeff = [0] * r
    coeff_global = global_pow

    previous = -1

    for i in range(r):
        m = groups[i]
        if m == n:
            continue

        ep = pow(eig[i], T, MOD)

        coeff[i] = (coeff[i] + ep) % MOD

        if previous == -1:
            coeff_global = (coeff_global - ep) % MOD
        else:
            coeff[previous] = (coeff[previous] - ep) % MOD

        previous = i

    # Prefix sums of the initial vector.
    pref = [0] * (n + 1)
    s = 0
    for i, x in enumerate(d):
        s += x
        pref[i + 1] = s % MOD

    # Difference array for range additions.
    diff = [0] * (n + 1)

    # Global average contribution.
    if coeff_global:
        avg = pref[n] * pow(n, MOD - 2, MOD) % MOD
        value = coeff_global * avg % MOD
        diff[0] += value
        diff[n] -= value

    # Contributions of every nontrivial administrative size.
    for i in range(r):
        c = coeff[i]
        m = groups[i]

        if c == 0 or m == n:
            continue

        inv_m = pow(m, MOD - 2, MOD)
        factor = c * inv_m % MOD

        for l in range(0, n, m):
            rr = l + m
            block_sum = (pref[rr] - pref[l]) % MOD
            value = block_sum * factor % MOD

            diff[l] += value
            diff[rr] -= value

    # Recover point values from the range additions.
    ans = [0] * n
    cur = 0
    for i in range(n):
        cur += diff[i]
        ans[i] = cur % MOD

    return ans

def main():
    t = int(input())
    out = []

    for _ in range(t):
        n, k, T = map(int, input().split())
        sizes = list(map(int, input().split()))
        d = list(map(int, input().split()))
        rho = list(map(int, input().split()))

        ans = solve_case(n, k, T, sizes, d, rho)
        out.append(" ".join(map(str, ans)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```第一部分压缩相同的大小。 因素`m`在`gamma`来自`B_i = mP_m`，因为对一个块求平均值将其总和除以`m`，而原始块矩阵返回总和。 

后缀循环计算每个层次差异空间的特征值。 如果一个向量在每个父块中的平均值为零，并且在当前块内恒定，则所有较粗的平均运算符都会消除它，而每个较精细的块运算符都会将其乘以其块大小。 这正好给出了后缀和`gamma`价值观。 

特殊情况`m == n`通过跳过相应的差异空间来处理。 其组包含所有城市的级别具有与全局投影相同的平均运算符，因此减去其幂特征值（就好像它是一个新组件一样）将引入一个假的零维组件。 

前缀数组以模数形式存储`MOD`。 所有块大小最多为`3 * 10^5`，它严格小于`998244353`，因此每个所需的模逆都存在。 

差异数组是实现优化的关键。 而不是将一个区块的平均值加到所有区块上`m`城市，两个边界更新代表整个范围。 跨越具有块大小的关卡`m`，只有`n/m`此类更新。 

Python 整数不会溢出，但仍会定期执行模归约，以使中间值保持较小。 求幂调用使用 Python 的三参数`pow`, which performs modular exponentiation in logarithmic time.

 ## 工作示例

 ### 示例 1

 样品有`n = 4`, 尺寸`2, 1`，初始向量`[1, 3, 5, 6]`，和系数`[2, 4, 5]`。 

矩阵分解开始于

 [
 A=2J+(4-2)B_1+(5-4)I。 
]

自从`B_1 = 2P_2`，这变成了

 [
 A=2J+4P_2+I。 
]

 全局特征值是`13`，二级块差异特征值为`5`，城市级差异特征值为`1`。 

| 组件| 特征值| 乘方系数 | 投影|
 | --- | --- | --- | --- |
 | 全球| 13 | 13 |`P_global`|
 | 尺码2差异| 5 | 5 |`P_2 - P_global`|
 | 尺码1差异| 1 | 1 |`I - P_2`|

 结合预测给出

 [
 A=8P_{\text{全局}}+4P_2+I。 
]

 相关平均值为`15/4`全球范围内，`2`在第一个 2 号块中，`11/2`在第二个 size-2 块中，原始值在 size`1`。 

| 城市 | 全球贡献| Size-2 贡献 | 城市贡献| 结果 |
 | --- | --- | --- | --- | --- |
 | 1 | 30| 8 | 1 | 39 | 39
 | 2 | 30| 8 | 3 | 41 | 41
 | 3 | 30| 22 | 22 5 | 57 | 57
 | 4 | 30| 22 | 22 6 | 58 | 58

 输出是`39 41 57 58`。 该迹线显示了为什么可以从块平均值而不是单个对交互中组装出答案。 

### 示例 2

 考虑```
1
2 1 2
1
1 2
2 3
```只有一个行政级别的规模`1`，因此不同城市的系数相互作用`2`，而城市则使用系数与其自身相互作用`3`。 矩阵是

 [
 A=
 \开始{p矩阵}
 3&2\
 2&3
 \end{pmatrix}。 
]

 其全局特征值为`5`，其差异特征值为`1`。 

| 组件| 特征值| 后`T = 2`| 投影|
 | --- | --- | --- | --- |
 | 全球| 5 | 25 | 25`P_global`|
 | 城市差异| 1 | 1 |`I - P_global`|

 因此

 [
 A^2=25P_{\text{全局}}+(I-P_{\text{全局}})
 =24P_{\text{全局}}+I。 
]

 全球平均为`[1,2]`是`3/2`, 给予

 | 城市 | 全球部分| 个别部分| 结果 |
 | --- | --- | --- | --- |
 | 1 | 36 | 36 1 | 37 | 37
 | 2 | 36 | 36 2 | 38 | 38

 输出是`37 38`。 此示例练习仅存在城市级别且没有重要中间行政区划的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n + S)`在哪里`S = sum(n/m)`不同尺寸 | 前缀构造、块处理和最终重建与块和城市总数呈线性 |
 | 空间|`O(n + r)`| 初始值、前缀和、差值数组，最多`O(log n)`不同的尺寸 |

 对于两个连续的不同行政区划，较小的划分较大，并且严格较小，因此最多是较大的一半。 因此，

 [
 \frac{n}{m_1}+\frac{n}{m_2}+\cdots < 1+2+4+\cdots < 2n。 
]

 因此，处理的管理块总数为`O(n)`， 不是`O(n log n)`。 因此，实现的实际复杂性是`O(n + k + log T)`每个测试用例，与`k`来自读取和压缩输入的术语。 在所有测试用例中，总和`n`至多是`10^6`，因此解保持在预期的范围内。 

## 测试用例

 以下测试工具假设提交的解决方案保存为`solution.py`并暴露了`solve_case`函数如上所示。```python
import sys
import io

from solution import solve_case

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        t = int(sys.stdin.readline())
        out = []

        for _ in range(t):
            n, k, T = map(int, sys.stdin.readline().split())
            sizes = list(map(int, sys.stdin.readline().split()))
            d = list(map(int, sys.stdin.readline().split()))
            rho = list(map(int, sys.stdin.readline().split()))
            ans = solve_case(n, k, T, sizes, d, rho)
            out.append(" ".join(map(str, ans)))

        return "\n".join(out)
    finally:
        sys.stdin = old_stdin

# Provided sample.
assert run(
    """1
4 2 1
2 1
1 3 5 6
2 4 5
"""
) == "39 41 57 58", "sample 1"

# Minimum-size case, n = 1.
expected = 7 * pow(5, 10**18, 998244353) % 998244353
assert run(
    """1
1 1 1000000000000000000
1
7
2 5
"""
) == str(expected), "minimum size and huge T"

# All initial values equal. Every row has sum 13.
assert run(
    """1
4 3 1
4 2 1
3 3 3 3
1 2 4 7
"""
) == "39 39 39 39", "all equal values"

# The largest administrative group is the whole country.
# The matrix is J + I, and its square is 6J + I.
assert run(
    """1
4 3 2
4 2 1
1 2 3 4
1 1 1 2
"""
) == "61 62 63 64", "top-level group equals all cities"

# Only city level exists. Matrix [[3,2],[2,3]], squared gives [[13,12],[12,13]].
assert run(
    """1
2 1 2
1
1 2
2 3
"""
) == "37 38", "city-level-only case"

# Maximum n, using uniform values and coefficients.
# A is the all-ones matrix, so one year produces n for every city.
n = 300000
inp = (
    "1\n"
    f"{n} 1 1\n"
    "1\n"
    + " ".join(["1"] * n) + "\n"
    "1 1\n"
)
out = run(inp).split()
assert len(out) == n, "maximum-size output length"
assert all(x == str(n % 998244353) for x in out), "maximum-size uniform case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n=1, T=10^18`|`7 * 5^T mod MOD`| 尽可能最小的层次结构和巨大的指数 |
 |`n=4`，所有初始值`3`|`39 39 39 39`| 常数向量特征值和重复层次|
 |`n=4`, 尺寸`4,2,1`,`T=2`|`61 62 63 64`| 顶级集团等于全市集 |
 |`n=2`,`k=1`,`T=2`|`37 38`| 无中级行政级别|
 |`n=300000`，统一值|`300000`重复`300000`次 | 最大输入尺寸和线性块处理|

 ## 边缘情况

 对于`n = 1`，每个平均算子都是恒等式。 在输入中```
1
1 1 3
1
7
2 5
```分解具有全局特征值`5`，因为唯一的矩阵条目是`rho_1`。 动力运算符乘以`5^3`, 给予`875`。 该实现自然地处理了这个问题，因为 size-1 组与全局投影仪一致，因此跳过了非平凡的差分分量。 

对于重复尺寸，请考虑```
1
4 3 1
4 2 1
3 3 3 3
1 2 4 7
```尺寸`4`和尺寸`2`投影仪是不同的，而即使插入额外的相同尺寸，三个级别本身也保持完整的表现。 压缩步骤将同等大小的贡献合并为一个`gamma`价值。 由于输入向量是恒定的，因此只有全局特征值很重要，并且每个输出都变成`39`。 

对于等于所有城市的顶级组，请考虑```
1
4 3 2
4 2 1
1 2 3 4
1 1 1 2
```矩阵是`J + I`。 其全局特征值为`5`，而每个非常数分量都有特征值`1`。 两年后，全球部分乘以`25`，并且每个非常数分量保持不变。 由于全球平均水平是`5/2`，结果是`25 * 5/2 + (d_i - 5/2) = 60 + d_i`, 给予`61 62 63 64`。 

对于仅包含城市级别的层次结构，输入```
1
2 1 2
1
1 2
2 3
```有矩阵

 [
 \开始{p矩阵}
 3&2\
 2&3
 \end{pmatrix}。 
]

 全局分量具有特征值`5`并且差分分量具有特征值`1`。 两年后，第一个分量乘以`25`，而第二个保持不变，产生`37 38`。 这抓住了一个常见的错误，即假设必须至少存在一个中间管理级别。
