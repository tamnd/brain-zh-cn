---
title: "CF 102309J - 失业的 Orz 熊猫"
description: "我们给出一个 (n×n) 整数矩阵 (A) 和正整数 (b1,ldots,bn)。 对于向量 (x)，定义 (y=Ax)。 该积分要求图像 (y) 位于轴对齐框 [ 0le yile bi 内的所有向量 (x) 的 (n) 维体积。"
date: "2026-08-13T07:06:17+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102309
codeforces_index: "J"
codeforces_contest_name: "The 2019 \u201cOrz Panda\u201d Cup Programming Contest"
rating: 0
weight: 102309
solve_time_s: 377
verified: true
draft: false
---

[CF 102309J - 失业的 Orz 熊猫](https://codeforces.com/problemset/problem/102309/J)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出一个 (n\times n) 整数矩阵 (A) 和正整数 (b_1,\ldots,b_n)。 对于向量 (x)，定义 (y=Ax)。 该积分要求其图像 (y) 位于轴对齐框内的所有向量 (x) 的 (n) 维体积

 [
 0\le y_i\le b_i。 
]

 所需的答案是该体积的平方。 

因此，关键的几何问题实际上并不是积分。 有效集合（y）只是一个矩形框，而（x）是从（y）通过线性变换（A）获得的。 如果 (A) 可逆，则长方体将变换回平行四面体，其体积由 (A) 的行列式决定。 如果 (A) 是奇异的，则 (x) 空间中的某个方向对 (Ax) 完全不可见，因此可行集在该方向上无限延伸。 

当 (A) 可逆时，

 # \frac{\operatorname{Vol}(y)}{|\det A|}

 \frac{\prod_i b_i}{|\det A|}。 
]

 因此，请求的值为

 [
 \盒装{
 \frac{\left(\prod_i b_i\right)^2}{(\det A)^2}
 }。 
]

 约束条件为 (n\le300)，因此 (O(n^3)) 算法是合适的。 三次算法执行大约 (300^3=27) 万次基本矩阵运算，而任何指数或阶乘都是完全不可行的。 矩阵项和 (b_i) 值都大到 (10^9)，因此将行列式计算为普通机器整数也是不安全的。 Python 的任意精度整数可以避免溢出，但模高斯消去法更干净，因为请求的结果本身就是素数模。 

粗心的实施必须区分两种不同的失败情况。 首先，奇异矩阵使得积分无穷大。 例如，```
2
1 1
1 1
2 2
```行列式为零，正确的输出是`Orz`。 可行 (x) 集包含不受限制的方向，因此将行列式仅视为分母会错误地建议除以零。 

其次，非零整数行列式本身可以被 (M=10^9+7) 整除。 例如，```
2
1 2
-500000003 1
1 1
```有行列式

 [
 1+2\cdot500000003=1000000007=M。 
]

 积分是有限的，但它的约分母仍然包含(M)，因为每一个(b_i\le10^9<M)，所以(\prod b_i)不能包含素因数(M)。 所需的模逆不存在，所以正确答案又是`Orz`。 仅检查整数上的行列式是否非零，然后盲目调用模逆的解决方案将产生无效结果。 

样品与```
2
1 1
1 -1
4 5
```有行列式 (-2)。 变换后的盒子的体积为 (4​​\cdot5=20)，因此可行 (x) 区域的体积为 (20/2=10)，并且请求的正方形为 (100)。 

## 方法

 思考行列式的一种直接的暴力方法是莱布尼茨公式，

 [
 \det A=\sum_{\pi} \operatorname{sgn}(\pi)
 \prod_i A_{i,\pi(i)}。 
]

 它检查 (n) 列的每一种排列的一项。 这意味着 (n!) 个乘积，以及大约 (n\cdot n!) 个标量运算（如果乘积是独立形成的）。 在 (n=300) 时，即使是 (300!) 也比四秒内可以处理的任何数据都要大得多。 直接数值积分的用处甚至更少，因为积分区域是原始坐标中的任意高维多面体。 

几何观察完全消除了积分。 约束已经是 (y=Ax) 坐标中的一个框。 对于可逆线性映射，体积的变化恰好是因子 (|\det A|)。 因此，整个积分可以使用一个行列式和 (b_i) 的乘积来表示。 

剩下的挑战是以与模除法兼容的形式有效地计算行列式。 高斯消元法计算 (O(n^3)) 中的行列式。 由于模 (M=1000000007) 是质数，因此每个非零矩阵项模 (M) 都有一个模逆。 因此，我们可以完全以模 (M) 进行消除。 

零行列式模 (M) 的含义有一个微妙之处。 整数上的零行列式当然意味着矩阵是奇异的，但逆模 (M) 略有不同：整数行列式可以非零，但可被 (M) 整除。 那个案子还得产生`Orz`，因为有理答案的分母包含 (M)。 由于所有 (b_i<M)，分子 ((\prod b_i)^2) 不能被 (M) 整除，因此在分数约简过程中，因子 (M) 不会消失。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力行列式扩展 | (O(n\cdot n!)) | (O(n)) | (O(n)) | 太慢了|
 | 最优模高斯消去法 | (O(n^3)) | (O(n^2)) | 已接受 |

 ## 算法演练

 1. 读取(A)和(b)，并对每个矩阵条目取模(M=1000000007)。 负项将转换为其等效的非负残基。 
2. 使用高斯消去法计算 (\det A\bmod M)。 在第 (i) 列，搜索第 (i,\ldots,n-1) 行中的非零主元。 如果不存在，则行列式为零模 (M)，因此输出`Orz`。 

如果行列式为零模 (M)，则 (A) 是真正奇异的或其非零整数行列式可被 (M) 整除。 这两种情况都会导致`Orz`，出于不同的数学原因。 
3. 当在当前行下方找到枢轴时，交换两行。 行交换会更改行列式的符号，因此将累积的行列式乘以 (-1)。 
4. 将行列式累加器乘以主元值。 然后消除该枢轴下方的条目。 如果主元是 (p) 并且被消除的条目是 (v)，则使用

 [
 f=v p^{-1}\pmod M
 ]

 并将该行替换为

 [
 R_j\leftarrow R_j-fR_i。 
]

 仅需要更新枢轴右侧的列，因为当前列变为零。 

1. 处理完所有列后，行列式累加器为 (\det A\bmod M)。 如果为零，则输出`Orz`。 否则，计算

 [
 B=\prod_i b_i\pmod M.
 ]

 1. 所需值为

 [
 \frac{B^2}{(\det A)^2}。 
]

 由于行列式是非零模 (M)，因此其模逆存在。 计算

 [
 B^2\cdot(\det A)^{-2}\pmod M。 
]

 蟒蛇的`pow(x, M-2, M)`给出模逆，因为 (M) 是素数.

 ### 为什么它有效

 令 (S={x:0\le (Ax)_i\le b_i\text{ 对于每个 }i})。 如果 (A) 可逆，则映射 (x\mapsto Ax) 将 (S) 双射映射到框 (B=[0,b_1]\times\cdots\times[0,b_n])。 变量的线性变化按 (|\det A|) 缩放体积，因此

 # \frac{\operatorname{Vol}(B)}{|\det A|}

 \frac{\prod_i b_i}{|\det A|}。 
]

 平方去除行列式的符号并给出算法使用的公式。 

如果 (A) 是奇异的，则存在 (Av=0) 的非零向量 (v)。 从任意可行点开始，沿 (v) 移动，(Ax) 保持不变，因此可行区域包含一条无界线，并且具有无限体积。 因此奇异矩阵必须产生`Orz`。 

最后，假设 (\det A\ne0) 是一个整数，但是 (\det A\equiv0\pmod M)。 由于 (M) 是素数并且每个 (b_i<M)，分子 ((\prod b_i)^2) 不能被 (M) 整除。 因此，约化后的分母仍然包含 (M)，因此其模逆不存在。 相同`Orz`决定是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007

def determinant_mod(a):
    n = len(a)
    det = 1

    for col in range(n):
        pivot = col
        while pivot < n and a[pivot][col] == 0:
            pivot += 1

        if pivot == n:
            return 0

        if pivot != col:
            a[col], a[pivot] = a[pivot], a[col]
            det = (-det) % MOD

        p = a[col][col]
        det = det * p % MOD

        inv_p = pow(p, MOD - 2, MOD)

        pivot_row = a[col]

        for row in range(col + 1, n):
            value = a[row][col]
            if value == 0:
                continue

            factor = value * inv_p % MOD
            current = a[row]

            for j in range(col + 1, n):
                current[j] = (current[j] - factor * pivot_row[j]) % MOD

            current[col] = 0

    return det

def solve():
    out = []

    for line in sys.stdin:
        line = line.strip()
        if not line:
            continue

        n = int(line)

        a = []
        for _ in range(n):
            row = list(map(int, input().split()))
            a.append([x % MOD for x in row])

        b = list(map(int, input().split()))

        det = determinant_mod(a)

        if det == 0:
            out.append("Orz")
            continue

        product_b = 1
        for x in b:
            product_b = product_b * (x % MOD) % MOD

        inv_det = pow(det, MOD - 2, MOD)
        ans = product_b * product_b % MOD
        ans = ans * inv_det % MOD
        ans = ans * inv_det % MOD

        out.append(str(ans))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```行列式例程会就地修改矩阵，从而避免分配另一个（n\times n）矩阵。 每个条目都保持模 (M)，因此在模运算之前，所有算术都大致受 (M^2) 限制。 

主元搜索是必要的，因为高斯消去法不能除以零主元。 行交换会改变行列式符号，这就是为什么`det`当选择不同的数据透视行时，该值被否定。 

消除因子计算如下`value * inv_p % MOD`。 然后将当前数据透视列显式设置为零。 内循环开始于`col + 1`，而不是在`col`，因为已知当前列的值将变为零。 这可以节省工作量，并避免在后面的行使用数据透视表列之前意外对其进行修改。 

在消除之前，行列式乘以每个主元。 高斯消去法将行列式保留到行交换，因为从一行中减去另一行的倍数不会改变行列式。 因此，主元的乘积与行交换的符号一起恰好是行列式模 (M)。 

Python 没有固定宽度整数溢出，但该实现仍然执行所有模 (M) 运算，因为数学输出是模 (M)，并且模高斯消除避免了巨大的行列式值。 

这两个电话`inv_det`最终表达式中的值对应于分母中的平方行列式。 无需计算绝对行列式，因为平方使其符号无关。 

## 工作示例

 ### 示例 1

 第一个示例案例是```
2
1 1
1 -1
4 5
```矩阵行列式是

 [
 1\cdot(-1)-1\cdot1=-2。 
]

 对（M）取模，即（M-2=1000000005）。 

| 步骤| 枢轴| 枢轴值 | 行列式模 (M) |
 | ---| ---| ---| ---|
 | 开始| 无 | 无 | 1 |
 | 第 0 列 | 0 | 1 | 1 |
 | 第 1 栏 | 1 | (-2) | (1000000005) |

 盒子边长的乘积为 (4​​\cdot5=20)。 因此

 # \frac{400}{4}

 1.

 ]

 输出是`100`。 

该迹线演示了普通的可逆情况。 行列式非零，因此可行域的体积有限，且行列式的模逆存在。 

### 示例 2

 第二个示例案例是```
2
1 1
1 1
2 2
```两行相同，因此行列式为零。 

| 步骤| 枢轴柱| 找到枢轴了吗？ | 决定性地位|
 | ---| ---| ---| ---|
 | 开始| 0 | 是的，值 1 | 非零|
 | 消除第 1 行 | 0 | 行变为`0 0`| 仍在追踪消除|
 | 第 1 栏 | 1 | 没有 | 零|

 在第 1 列，没有非零主元。 行列式为零模 (M)，在这种情况下，它作为整数也为零。 该矩阵具有零方向，因此可行集是无界的，积分是无穷大的。 

输出是`Orz`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n^3)) | 高斯消除更新每个 (n) 个主元的 (O(n^2)) 条目 |
 | 空间| (O(n^2)) | 矩阵本身占据 (n^2) 个条目 |

 对于 (n=300)，三次工作约为 2700 万次矩阵条目更新。 该矩阵仅需要 (300^2=90000) 个存储整数，大小在 256 MB 以内。 没有任何操作以指数方式依赖于 (n)，因此该算法适合问题的预期规模。 

## 测试用例```python
import sys
import io

MOD = 1000000007

def determinant_mod(a):
    n = len(a)
    det = 1

    for col in range(n):
        pivot = col
        while pivot < n and a[pivot][col] == 0:
            pivot += 1

        if pivot == n:
            return 0

        if pivot != col:
            a[col], a[pivot] = a[pivot], a[col]
            det = (-det) % MOD

        p = a[col][col]
        det = det * p % MOD
        inv_p = pow(p, MOD - 2, MOD)

        pivot_row = a[col]

        for row in range(col + 1, n):
            value = a[row][col]
            if value == 0:
                continue

            factor = value * inv_p % MOD
            current = a[row]

            for j in range(col + 1, n):
                current[j] = (
                    current[j] - factor * pivot_row[j]
                ) % MOD

            current[col] = 0

    return det

def solve_string(inp: str) -> str:
    data = inp.split()
    pos = 0
    ans = []

    while pos < len(data):
        n = int(data[pos])
        pos += 1

        a = []
        for _ in range(n):
            row = [int(data[pos + j]) % MOD for j in range(n)]
            pos += n
            a.append(row)

        b = [int(data[pos + i]) for i in range(n)]
        pos += n

        det = determinant_mod(a)

        if det == 0:
            ans.append("Orz")
            continue

        prod = 1
        for x in b:
            prod = prod * x % MOD

        inv_det = pow(det, MOD - 2, MOD)
        value = prod * prod % MOD
        value = value * inv_det % MOD
        value = value * inv_det % MOD

        ans.append(str(value))

    return "\n".join(ans)

def run(inp: str) -> str:
    return solve_string(inp)

sample = """\
2
1 1
1 -1
4 5
2
1 1
1 1
2 2
"""
assert run(sample) == "100\nOrz", "provided samples"

assert run("""\
1
1
1
""") == "1", "minimum size"

assert run("""\
2
2 0
0 2
3 3
""") == "81", "diagonal matrix and equal b"

assert run("""\
2
1 1
1 1
7 7
""") == "Orz", "singular all-equal rows"

assert run("""\
2
1 2
-500000003 1
1 1
""") == "Orz", "determinant divisible by MOD"

# Maximum-size structural case: identity matrix of size 300.
n = 300
lines = [str(n)]
for i in range(n):
    row = ["0"] * n
    row[i] = "1"
    lines.append(" ".join(row))
lines.append(" ".join(["1"] * n))
assert run("\n".join(lines)) == "1", "maximum-size identity matrix"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 / 1`|`1`| 最小矩阵大小和最简单的有限积分 |
 |`[[2,0],[0,2]]`,`b=[3,3]`|`81`| 行列式缩放和等边长|
 |`[[1,1],[1,1]]`,`b=[7,7]`|`Orz`| 奇异矩阵检测 |
 |`[[1,2],[-500000003,1]]`,`b=[1,1]`|`Orz`| 可被 (M) 整除的非零整数行列式 |
 | (300\times300) 身份，全部 (b_i=1) |`1`| 最大矩阵大小和立方实现 |

 ## 边缘情况

 即使原始不等式本身在每个 (y_i) 中看起来都有界，也必须拒绝奇异矩阵。 为了```
2
1 1
1 1
7 7
```向量 ((1,-1)^T) 属于 (A) 的零空间。 如果 (x) 满足约束，则 (x+t(1,-1)) 对于每个实数 (t) 满足完全相同的约束。 因此，可行区域是无界的。 高斯消去法将第二行变成零，并且在最后一列中找不到主元，因此算法输出`Orz`。 

模 (M) 消失的行列式也必须被拒绝。 考虑```
2
1 2
-500000003 1
1 1
```行列式是

 [
 1\cdot1-2(-500000003)=1000000007=M。 
]

 该矩阵在实数上是可逆的，因此积分本身是有限的。 其值为

 [
 \frac{1}{M^2}。 
]

 由于 (M) 是素数且分子是 (1)，因此约化分母没有模逆模 (M)。 行列式例程获得零模 (M)，因此程序正确打印`Orz`。 

最小的情况是```
1
1
1
```这里(Ax=x)，所以(x)的允许区间为([0,1])，其体积为(1)。 平方得到 (1)。 行列式算法的单个主元等于 (1)，最终公式给出 (1^2/1​​^2=1)。 

还必须正确处理行交换。 例如，```
2
0 1
1 0
2 3
```具有行列式 (-1)。 第一列在第一行中没有主元，因此算法交换行并记录符号变化。 盒子体积为 (6)，因此所需答案为 (6^2=36)。 忘记行列式符号不会损害这个特定的最终答案，因为行列式是平方的，但处理行交换对于行列式计算本身和维护正确的一般不变量仍然是必要的。 

最后，每个 (b_i) 都相等的情况在数学上并不特殊。 为了```
2
2 0
0 2
3 3
```变换后的盒子具有体积 (9)，而行列式具有绝对值 (4)。 因此，可行区域的体积为 (9/4)，所需的答案为 (81/16)。 取模 (M)，程序计算 (81\cdot16^{-1})。 这练习了实际的理性输出要求，而不仅仅是分母除分子的情况。
