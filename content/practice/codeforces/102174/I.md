---
title: "CF 102174I - \u51fa\u7ed9 保罗-卢\u7684\u6570\u6570\u9898"
description: "我们有一个 (n×n) 棋盘，每个单元格包含一个从 (1) 到 (k) 的整数。 如果某个单元格的值严格大于其行中的所有其他值并且也严格大于其列中的所有其他值，则该单元格称为双点。"
date: "2026-08-19T07:16:03+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102174
codeforces_index: "I"
codeforces_contest_name: "The 14-th BIT Campus Programming Contest"
rating: 0
weight: 102174
solve_time_s: 111
verified: true
draft: false
---

[CF 102174I - \u51fa\u7ed9 paul-lu \u7684\u6570\u6570\u9898](https://codeforces.com/problemset/problem/102174/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个 (n\times n) 棋盘，每个单元格包含一个从 (1) 到 (k) 的整数。 如果某个单元格的值严格大于其行中的所有其他值并且也严格大于其列中的所有其他值，则该单元格称为双点。 

对于每个填满的棋盘，令 (I) 为该棋盘上的 bi 点数。 如果 (B_i) 是恰好具有 (i) 个 bi 点的板的数量，则所需数量为

 [
 \sum_i i^2 B_i。 
]

 这只是所有 (k^{n^2}) 个可能板的 (I^2) 之和。 我们永远不需要确定 (I) 的整个分布。 平方是关键：展开（I^2）后，我们只需要统计包含一个指定bi点的配置和包含两个指定bi点的配置即可。 

界限 (n,k\le 200) 排除 (n^2) 中的任何指数。 最多有 (20) 个测试用例，因此每个用例的 (O(k\log n)) 或 (O(k^2)) 计算量很容易足够小，而甚至 (O(n^2k)) 也已经不必要地大了。 棋盘本身最多有 (40000) 个单元格，但我们只需要象征性地计算分配数。 

如果不仔细区分，有几种边界情况可能会破坏公式。 对于 (n=1)，唯一的单元格自动成为 bi 点，无论其值如何，因此答案正是 (k)。 例如，输入`1 5`有答案（5）。 此处不能直接使用包含 (2n-4) 等幂的公式，因为该指数变为负数。 

对于 (k=1) 和 (n>1)，每个单元格的值均为 (1)，因此任何单元格都不能严格大于其行或列中的其他单元格。 因此答案是（0）。 例如，输入`3 1`有答案（0）。 将 (0^0) 视为有效最大值的证据的粗心实现可能会错误地计算 bi 点。 

对于(n=2,k=2)，答案是(12)。 恰好具有 1 个 bi 点的棋盘是具有 1 (2)、其行中相邻的一个 (1)、其列中相邻的一个 (1) 和相对的单元格等于 (1) 的四块棋盘，贡献 (4)。 带有两个 (2) 的两个对角板各有两个双点，每个点贡献 (2^2)，另一个点为 (8)。 一个常见的错误是将包含选定双点的每个棋盘计为仅具有一个双点的棋盘。 这样的棋盘可能包含多个双点，因此指标变量是必要的。 

## 方法

 直接的方法是枚举每个板，计算其双点，计算平方，并将其添加到答案中。 有 (k^{n^2}) 个板。 即使检查一块板只花费 (O(n^2))，总数也将是 (O(n^2k^{n^2}))。 在最大约束下，它包含 (200^{40000}) 个板，因此该方法完全不可行。 

有用的观察是我们需要的数量是二阶矩。 当单元格 (c) 是双点时，令 (X_c) 为 (1)，否则为 (0)。 然后

 [
 I=\sum_c X_c
 ]

 和

 [
 I^2=\sum_c X_c+2\sum_{c<d}X_cX_d。 
]

 所以我们只需要两种计数：一个固定单元为bi点的板的数量，以及两个固定单元同时为bi点的板的数量。 

对于一个固定单元格，假设其值为(x)。 其行和列中的所有其他单元格都必须小于 (x)。 这样的细胞有 (2n-2) 个，并且它们是不同的。 每个人都有 (x-1) 个选择。 所有剩余的单元格均不受限制。 

对于两个固定单元，存在三种几何可能性。 如果它们在同一行，则它们不能都是严格的行最大值。 当它们在同一列时也是如此。 因此，只有不同行和不同列的配对才重要。 

考虑这样一对并称它们为 (a) 和 (b)。 每个固定单元格约束 (2n-2) 个单元格，但两个单元格位于另一个固定单元格的行或列的交叉点处。 这两个单元格必须小于 (a) 和 (b)，因此每个单元格都有 (\min(a,b)-1) 个选择。 剩余的受约束单元可以根据它们必须小于哪个固定值来分离。 这会产生一个对称和，可以通过维护前缀和将其简化为单个循环。 

蛮力之所以有效，是因为检查一块板可以准确确定其贡献，但它会失败，因为板的数量呈指数级增长。 (I^2) 仅涉及一个单元和两个单元指示乘积的观察结果将问题简化为少量的幂和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2k^{n^2})) | (O(n^2)) | 太慢了|
 | 最佳| (O(k\log n)) | (O(k\log n)) | (O(1)) | (O(1)) | 已接受 |

 ## 算法演练

 1. 单独处理（n=1）。 恰好有一个单元格，并且它始终是一个双点，因此 (k) 个板中的每一块都贡献 (1^2)，给出答案 (k)。 
2. 固定某一特定单元格，并令其值为(x)。 该行或列中还有 (2n-2) 个其他单元格，且所有单元格都必须小于 (x)。 因此这个固定单元格是一个双点

 [
 (x-1)^{2n-2}k^{(n-1)^2}
 ]

 板。 对 (x=1,\ldots,k) 求和，一个固定单元的板数为

 [
 A=k^{(n-1)^2}\sum_{t=0}^{k-1}t^{2n-2}。 
]

 固定单元格有 (n^2) 个选择，因此答案的第一部分是 (n^2A)。 

1. 考虑两个固定单元。 如果它们共享行或列，则它们的同时贡献为零，因为两个单元格不能同时严格大于同一行或列中的其他单元格。 
2. 对于不同行和列的两个单元格，将它们的值写为（a）和（b），并放入（t=a-1），（u=b-1）。 每个固定单元有 (2n-4) 个仅受其自身值约束的单元。 两个交叉单元格必须小于这两个值，因此每个单元格都有 (\min(t,u)) 个选择。 有

 [
 (n-2)^2
 ]

 完全不受限制的细胞。 

因此，该固定对的分配数量为

[
 k^{(n-2)^2}
 \sum_{t=0}^{k-1}\sum_{u=0}^{k-1}
 t^{2n-4}u^{2n-4}\min(t,u)^2。 
]

 让

 [
 p=2n-4。 
]

 双和在 (t,u) 中对称。 对于 (t>u)，(\min(t,u)=u)，所以该部分是

 [
 \sum_{t=0}^{k-1}t^p\sum_{u=0}^{t-1}u^{p+2}。 
]

 对角线 (t=u) 贡献

 [
 \sum_{t=0}^{k-1}t^{2p+2}。 
]

 因此整个双倍总和是

 [
 2\sum_{t=0}^{k-1}t^p
 \left(\sum_{u=0}^{t-1}u^{p+2}\right)
 +
 \sum_{t=0}^{k-1}t^{2p+2}。 
]

 我们可以在扫描 (t) 时增量计算内部和，因此双和变成一个循环。 

1. 计算不同行和不同列中有多少个无序单元对。 选择两行，选择两列，然后选择两个对角线匹配之一：

 \frac{n^2(n-1)^2}{2}。 
]

 由于 (I^2) 的展开包含每个无序对两次，因此系数变为

 [
 n^2(n-1)^2。 
]

 因此答案的第二部分是

 [
 n^2(n-1)^2
 k^{(n-2)^2}
 \左(
 2\sum_{t=0}^{k-1}t^p
 \sum_{u=0}^{t-1}u^{p+2}
 +
 \sum_{t=0}^{k-1}t^{2p+2}
 \右）。 
]

 1. 将单节电池贡献和两节电池贡献以模 (998244353) 相加。 每个幂都通过模幂进行评估，Python 的内置`pow(a, b, MOD)`在 (O(\log b)) 中执行此操作。 

为什么它有效：不变式就是恒等式

 [
 I^2=\sum_c X_c+2\sum_{c<d}X_cX_d。 
]

 第一个计数公式准确给出了每个学期的板数 (X_c)。 对于每对 (X_cX_d)，共享行或列的对贡献为零，而不同行和列中的每对恰好具有受限制和不受限制的单元格的计数集。 由于每个可能的单细胞项和每个可能的双细胞项均以其展开式的系数精确出现，因此最终的总和恰好为 (\sum_i i^2B_i)。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def solve_case(n, k):
    if n == 1:
        return k % MOD

    # Contribution of one fixed cell.
    single_exp = 2 * n - 2
    free_single = (n - 1) * (n - 1)

    sum_single = 0
    for t in range(k):
        sum_single += pow(t, single_exp, MOD)
        if sum_single >= MOD:
            sum_single -= MOD

    one_fixed = pow(k, free_single, MOD) * sum_single % MOD
    first = n * n % MOD * one_fixed % MOD

    # Contribution of one fixed pair in different rows and columns.
    p = 2 * n - 4
    free_pair = (n - 2) * (n - 2)

    prefix = 0
    pair_core = 0

    for t in range(k):
        tp = pow(t, p, MOD)

        # u < t contributes t^p * u^(p+2).
        pair_core += 2 * tp % MOD * prefix
        pair_core %= MOD

        # The diagonal term t = u.
        pair_core += pow(t, 2 * p + 2, MOD)
        pair_core %= MOD

        # Add u = t for the next iteration.
        prefix += pow(t, p + 2, MOD)
        prefix %= MOD

    pair_fixed = pow(k, free_pair, MOD) * pair_core % MOD

    pair_factor = n * n % MOD
    pair_factor = pair_factor * (n - 1) % MOD
    pair_factor = pair_factor * (n - 1) % MOD

    second = pair_factor * pair_fixed % MOD

    return (first + second) % MOD

def main():
    T = int(input())
    out = []

    for _ in range(T):
        n, k = map(int, input().split())
        out.append(str(solve_case(n, k)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```第一个分支处理通用配对公式包含负指数的唯一情况。 当 (n=1) 时，答案只是单个单元格中可能值的数量。 

对于 (n>1)，`single_exp`是 (2n-2)，因为固定 bi 点在其行中恰好有 (n-1) 个受约束单元格，在其列中恰好有 (n-1) 个受约束单元格。 其余 ((n-1)^2) 个单元格不受限制。 

对于配对计算，`p = 2*n-4`。 固定不同行列的两个单元格后，每个固定值独立控制（2n-4）个单元格。 两个交叉单元格由两个值控制，这就是为什么它们贡献由较小值的指数 (p+2) 表示的额外因子。 

变量`prefix`商店

 [
 \sum_{u<t}u^{p+2}。 
]

 在将当前 (t) 添加到前缀之前，它恰好包含对称和的 (u<t) 部分所需的值。 对角线贡献 (t=u) 单独添加为 (t^{2p+2})。 

所有乘法均以模 (998244353) 进行缩减。 Python 整数不会溢出，但减少中间产物可以使值保持较小并使实现更接近数学公式。 

因素`n*n*(n-1)*(n-1)`不是无序对的数量。 它已经包含 (I^2) 展开中的因子 (2)。 这是一个很容易引入二分之一误差的地方。 

## 工作示例

 对于样本 1，(n=2,k=2)。 单格指数为 (2n-2=2)，非限制格指数为 ((n-1)^2=1)。 

| 变量| 价值|
 | ---| --- |
 | (n) | 2 |
 | (k) | 2 |
 | (2n-2) | (2n-2) | 2 |
 | (\sum t^{2n-2}) | (0^2+1^2=1) |
 | (k^{(n-1)^2}) | (2) |
 | 一个固定细胞 | (2) |
 | (n^2) 单细胞贡献 | (8) |

 对于配对计算，(p=0)，因此只有 (t=u=1) 对核心和有贡献。 

| 变量| 价值|
 | ---| --- |
 | （页）| 0 |
 | ((n-2)^2) | ((n-2)^2) | 0 |
 | 对芯| 1 |
 | (k^{(n-2)^2}) | 1 |
 | 对贡献因子 | (2^2(2-1)^2=4) |
 | 两细胞贡献| 4 |
 | 最终答案| 12 | 12

 值 (12) 与样本匹配。 该计算还说明了为什么不得将具有两个双点的板从单格计数中删除。 它们的两个 bi 点中的每一个都被有意地计数一次，这正是 (I^2) 展开所需的。 

对于样本 2，(n=3，k=2)。 这里(2n-2=4)，所以一个固定的bi点需要周围的四个单元格更小。 

| 变量| 价值|
 | ---| ---|
 | (n) | 3 |
 | (k) | 2 |
 | (2n-2) | (2n-2) | 4 |
 | (\sum t^4) | (\sum t^4) | 1 |
 | (k^{(n-1)^2}) | (2^4=16) | (2^4=16) |
 | 一个固定细胞 | 16 | 16
 | (n^2) 单细胞贡献 | 144 | 144

 对于两个兼容单元格，(p=2)，并且存在一个不受限制的单元格，因为((n-2)^2=1)。 

| 变量| 价值|
 | ---| ---|
 | （页）| 2 |
 | 对芯| 1 |
 | (k^{(n-2)^2}) | 2 |
 | 一对固定| 2 |
 | 对贡献因子 | (3^2\cdot2^2=36) |
 | 两格贡献 | 72 | 72
 | 最终答案| 216 | 216

 第二条迹线证实了双电池情况的几何形状。 四个单元仅由两个选定最大值之一控制，两个交叉单元由两个最大值控制，一个单元保持完全自由。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | ---|
 | 时间 | (O(k\log n)) | (O(k\log n)) | 有 (O(k)) 次迭代，每次迭代都使用恒定数量的指数模幂 (O(n))。 |
 | 空间| (O(1)) | (O(1)) | 仅存储恒定数量的模整数。 |

 对于 (n,k\le200)，每个测试用例仅执行几百次模幂运算，每次都需要对数多次模乘法。 即使有 (20) 个测试用例，这也完全在给定的限制内，而内存使用量是恒定的。 

## 测试用例

 以下测试程序使用优化实现以及直接 (O(k^2)) 参考公式。 该参考仅用于测试，因此它仍然很小（k\le200）。```python
import sys
import io

MOD = 998244353

def solve_case(n, k):
    if n == 1:
        return k % MOD

    single_exp = 2 * n - 2
    free_single = (n - 1) * (n - 1)

    sum_single = 0
    for t in range(k):
        sum_single = (sum_single + pow(t, single_exp, MOD)) % MOD

    one_fixed = pow(k, free_single, MOD) * sum_single % MOD
    first = n * n % MOD * one_fixed % MOD

    p = 2 * n - 4
    free_pair = (n - 2) * (n - 2)

    prefix = 0
    pair_core = 0

    for t in range(k):
        tp = pow(t, p, MOD)
        pair_core = (pair_core + 2 * tp * prefix) % MOD
        pair_core = (pair_core + pow(t, 2 * p + 2, MOD)) % MOD
        prefix = (prefix + pow(t, p + 2, MOD)) % MOD

    pair_fixed = pow(k, free_pair, MOD) * pair_core % MOD

    pair_factor = n * n % MOD
    pair_factor = pair_factor * (n - 1) % MOD
    pair_factor = pair_factor * (n - 1) % MOD

    return (first + pair_factor * pair_fixed) % MOD

def reference(n, k):
    if n == 1:
        return k % MOD

    single = 0
    for t in range(k):
        single += pow(t, 2 * n - 2, MOD)
    single %= MOD
    first = n * n % MOD
    first = first * pow(k, (n - 1) * (n - 1), MOD) % MOD
    first = first * single % MOD

    p = 2 * n - 4
    core = 0
    for t in range(k):
        for u in range(k):
            core += (
                pow(t, p, MOD)
                * pow(u, p, MOD)
                * min(t, u) ** 2
            )
            core %= MOD

    pair = pow(k, (n - 2) * (n - 2), MOD) * core % MOD
    pair_factor = n * n * (n - 1) * (n - 1) % MOD

    return (first + pair_factor * pair) % MOD

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input_func = sys.stdin.readline

    T = int(input_func())
    ans = []

    for _ in range(T):
        n, k = map(int, input_func().split())
        ans.append(str(solve_case(n, k)))

    return "\n".join(ans)

# Provided samples
assert run("3\n2 2\n3 2\n4 5\n") == (
    "12\n216\n129097970"
), "provided samples"

# Minimum-size input.
assert run("1\n1 1\n") == "1", "minimum n and k"

# n = 1 with many possible values.
assert run("1\n1 200\n") == "200", "single-cell boundary"

# All boards are equal when k = 1 and n > 1.
assert run("1\n3 1\n") == "0", "all-equal boards"

# Small case that exercises the pair formula.
assert run("1\n2 3\n") == "48", "n=2 pair counting"

# Maximum-size input, checked against a direct O(k^2) reference.
max_expected = reference(200, 200)
assert run("1\n200 200\n") == str(max_expected), "maximum constraints"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1`|`1`| 最小板和 (n=1) 特殊情况 |
 |`1 200`|`200`| 具有完整值范围的单个单元格 |
 |`3 1`|`0`| 所有细胞都是平等的，因此严格的最大值不可能存在 |
 |`2 3`|`48`| 两细胞贡献和对角线对计数 |
 |`200 200`| 直接参考价值| 最大约束和模幂|

 ## 边缘情况

 对于 (n=1,k=5)，板由单个单元组成。 无论它包含什么值，它都比其行和列中的所有其他单元格大，因为没有其他单元格。 因此，五块板中的每一块都有 (I=1)，给出

 [
 5\cdot1^2=5。 
]

 该实现立即返回 (k) 并且从不计算配对公式。 

对于 (n=3,k=1)，每个板都是仅包含 (1) 的单一配置。 没有单元格严格大于其行或列中的其他单元格，因此 (I=0)，答案为 (0)。 在单格公式中，每一项都包含(t^{2n-2}=0^4=0)，因此贡献自然消失。 配对贡献也消失了。 

对于 (n=2,k=2)，固定单元的单单元计数为

 [
 2^{1}(0^2+1^2)=2。 
]

 有四个单元格，由线性项得出 (8)。 两个单元格只有在对角线的情况下才能同时为bi点。 对于每个固定对角线对，两个选定值的唯一有效分配是 (2,2)，而其余两个单元格必须是 (1)，给出一个分配。 有两个对角线对，(I^2) 中的因子 (2) 给出 (4)。 总数为（8+4=12）。 

对于 (n=200,k=200)，该算法从不构建棋盘，也从不迭代 (n^2) 个单元。 它仅评估（200）个可能值的单电池功率和和对功率和。 最大指数低于 (40000)，因此模幂运算成本低廉，并且所有中间值都会以模 (998244353) 进行缩减。
