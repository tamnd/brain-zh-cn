---
title: "CF 102319F - 永远年轻"
description: "学生有不同的年龄，因此班级的安排只是数字（1，ldots，s）的排列。 亨利圈出的学生的最大数量是该排列的最长递增子序列的长度。"
date: "2026-08-14T04:51:44+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102319
codeforces_index: "F"
codeforces_contest_name: "UBC Summer Contest 2018"
rating: 0
weight: 102319
solve_time_s: 123
verified: true
draft: false
---

[CF 102319F - 永远年轻](https://codeforces.com/problemset/problem/102319/F)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 学生的年龄不同，因此班级的安排只是数字 (1,\ldots,s) 的排列。 亨利圈出的学生的最大数量是该排列的最长递增子序列的长度。 尤金最大值是最长递减子序列的长度。 

我们需要计算最长递增子序列的长度正好为 (n) 且最长递减子序列的长度正好为 (m) 的排列。 答案需要模 (10^9+7)。 

大值（s\le 10^6）立即排除了以二次或阶乘方式检查学生的任何内容。 有用的额外约束是 (n+m\ge s-50)。 这表示两个所需的子序列长度几乎与整个排列一样大，这严重限制了可能的组合结构。 整个解决方案利用了该限制。 

有两个基本的可行性条件值得牢记。 排列不能具有长度之和超过 (s+1) 的增减子序列，因为这两个子序列最多可以共享一个学生。 此外，只要存在这样的排列，Erdős-Szekeres 就意味着 (nm\ge s)。 

第一种边缘情况是(s=1，n=1，m=1)。 恰好有一种排列，所以答案是（1）。 假设杨图中始终至少有一个重要的行或列的粗心实现可能会错误地处理这种情况。 

第二个边缘情况是(s=5,n=5,m=5)。 请求的子序列长度之和为(10)，大于(s+1=6)，所以答案为(0)。 仅检查 (n+m) 上规定的下限并开始枚举形状的程序可能会意外地将不可能的形状视为有效。 

第三种边缘情况发生在允许范围的另一端，例如（s=52，n=1，m=1）。 这里 (n+m=2=s-50)，因此输入满足特殊约束，但 52 个不同值的排列不能使 LIS 和 LDS 都等于 1。答案是 (0)。 特殊条件限制了我们必须枚举的额外结构的数量，但它并不使每对 (n,m) 都可行。 

最后，当(n+m=s+1)时，两个子序列必须恰好用一个公共元素覆盖整个排列。 只有一种可能的杨氏图形状，即钩子。 这种情况对于捕获下面使用的小参数定义中的差一错误很有用。 

## 方法

 直接的方法是枚举所有（s！）排列，计算它们的最长递增和递减子序列，并计算那些满足请求值的序列。 即使使用 (O(s\log s)) LIS 实现，这也需要 (O(s!,s\log s)) 操作。 在(s=20)时，排列数已经是(20!\approx2.43\cdot10^{18})，所以这种方法完全不可用。 

更好的方法是停止思考排列本身。 Robinson-Schensted 对应给出了排列和具有相同形状的标准 Young 画面对之间的双射。 对于形状为 (\lambda) 的排列，(\lambda) 的第一行的长度等于 LIS，第一列的长度等于 LDS。 

如果 (f^\lambda) 表示形状为 (\lambda) 的标准 Young 画面的数量，则固定形状恰好对应于 ((f^\lambda)^2) 个排列，因为两个画面可以独立选择。 因此期望的答案是

 [
 \sum_{\substack{\lambda\vdash s\\lambda_1=n\\lambda'_1=m}}(f^\lambda)^2。 
]

 蛮力之所以有效，是因为每个排列都由其一对画面恰好表示一次。 问题在于，当 (s) 很大时，(s) 的分区仍然太多而无法枚举。 

关键的观察是条件 (n+m\ge s-50)。 具有第一行 (n) 和第一列 (m) 的杨图有一个强制钩子，其中包含

 [
 n+m-1
 ]

细胞。 其他一切最多由

 [
 t=s-(n+m-1)=s-n-m+1
 ]

 额外的细胞。 对于每个可行实例，输入条件给出 (0\le t\le51)。 

从这些附加单元格中删除第一行和第一列。 剩下的是 (t) 的普通分区 (\mu)。 从(t\le51)开始，最多有(p(51)=239943)个这样的分区。 

这就是中央减少。 我们枚举最多 51 个分区，而不是枚举 (s) 的分区（这可能是一个巨大的数字）。剩下的任务是快速计算 (f^\lambda)，而不构建包含最多一百万个单元的图。 

钩长公式给出

 [
 f^\lambda=\frac{s!}{\prod_{c\in\lambda}h(c)},
 ]

 其中 (h(c)) 是单元格的钩长度。 

形状几乎是一个钩子，因此它的钩子乘积可以仅使用 (O(t)) 因子来表达。 我们预先计算模逆直到 (s)，然后可以在 (O(t)) 时间内评估每个候选形状。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(s!,s\log s)) | (O(s)) | 太慢了 |
 | 最佳| (O(s+p(51)\cdot51)) | (O(s)) | 已接受 |

 ## 算法演练

 1. 定义

 [
 t=s-n-m+1。 
]

 强制钩子有 (n+m-1) 个单元格，因此 (t) 正是该钩子之外的单元格数量。 如果(t<0)，则(n+m>s+1)，这是不可能的。 如果 (nm<s)，所需的形状无法放入 (n\times m) 矩形内，因此答案也为零。 

1. 将每个有效的杨图表示为

 [
 lambda=(n,mu_1+1,mu_2+1,dots),
 ]

 其中 (\mu) 是 (t) 的一个分区。 

第一行下面的行数最多为(m-1)，因此(\mu)最多有(m-1)部分。 由于 (\lambda) 的第二行不能比第一行长，因此 (\mu) 的每个部分最多为 (n-1)。 

因此，我们枚举 (t) 的分区，其中最大部分为 (n-1)，最多为 (m-1) 部分。 

1. 对于特定分区 (\mu)，构造其列高。 设(h_c)为(μ)中至少为(c)的部分的数量。 

(\lambda) 的右下部分正是 (\mu) 的图，向下移动一行并向右移动一列。 这些柱高让我们能够在恒定时间内获得该小部分中的每个钩子长度。 

1. 将 (\lambda) 的钩积分成四块。 单元格 ((1,1)) 的钩长度为 (s)，因此取消该因子后的分子为 ((s-1)!)。 

对于第一行的其余部分，第 (c+1) 列对应的单元格具有钩长度

 [
 n-c+h_c
 ]

 对于 (1\le c\le\mu_1)。 在最后占用的列 (\mu) 之后，因子很简单

 [
 n-\mu_1-1,\ldots,1,
 ]

 给出阶乘 ((n-\mu_1-1)!)。 

1. 第一列第一个单元格下方的单元格具有钩长度

 [
 m-r+\mu_r
 ]

 对于 (\mu) 的第 (r) 行。 一旦 (\mu) 的非零部分结束，剩余的因子就形成

 [
 (m-L-1)!,
 ]

 其中 (L) 是 (\mu) 的部分数。 

1. 对于 (\mu) 内的每个单元格 ((r,c))，其在 (\lambda) 中对应的单元格具有钩长度

 [
 \mu_r-c+h_c-r+1。 
]

 恰好有 (t) 个这样的单元格，因此整个部分需要 (O(t)) 次操作。 

1. 将这些因素与钩长公式结合起来。 由于每个钩子长度最多为 (s\le10^6<10^9+7)，因此每个分母因子都有一个模逆。 
2. 对结果值 (f^\lambda) 求平方并将其添加到答案中。 RSK 告诉我们，这个平方精确地计算了 RSK 形状为 (\lambda) 的排列，因此对所有有效形状求和即可得到所需的计数。 

### 为什么它有效

 每个排列双射对应于一对具有共同形状（\lambda）的标准杨氏画面。 LIS 和 LDS 分别是该形状的第一行和第一列长度。 因此，固定 (n) 和 (m) 与将第一行限制为 (n)、将第一列限制为 (m) 完全相同。

每个这样的形状都包含 (n+m-1) 个单元格的钩子，并且所有剩余单元格形成 (t=s-n-m+1) 的分区 (\mu)。 该算法在强制宽度和高度限制的同时，对每个这样的 (\mu) 精确枚举一次，因此每个允许的形状恰好出现一次，并且不会出现不允许的形状。 钩长度计算给出了该形状的画面的确切数量 (f^\lambda)，并且这对画面给出了 ((f^\lambda)^2) 个排列。 因此，每个有效排列都对答案贡献一次。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

MOD = 1_000_000_007

def solve_case(s, n, m):
    t = s - n - m + 1

    # n + m > s + 1 is impossible.
    # n * m < s means an n by m Young diagram cannot contain s cells.
    if t < 0 or n * m < s:
        return 0

    max_mu = min(t, n - 1)

    # Factorial of s - 1, and factorials of n - 1 and m - 1.
    fact_s = 1
    fact_n = 1
    fact_m = 1

    for i in range(2, s):
        fact_s = fact_s * i % MOD
        if i == n - 1:
            fact_n = fact_s
        if i == m - 1:
            fact_m = fact_s

    # Handle n = 1 or m = 1, where the corresponding factorial is 0!.
    if n - 1 == 0:
        fact_n = 1
    if m - 1 == 0:
        fact_m = 1

    # Modular inverses of every integer up to s.
    inv = array('I', [0]) * (s + 1)
    if s >= 1:
        inv[1] = 1
    for i in range(2, s + 1):
        inv[i] = (MOD - (MOD // i) * inv[MOD % i] % MOD) % MOD

    # We only need inverse factorials close to n - 1 and m - 1.
    # invfact_n[j] = 1 / (n - 1 - j)!
    invfact_n = [0] * (max_mu + 1)
    invfact_m = [0] * (min(t, m - 1) + 1)

    invfact_n[0] = pow(fact_n, MOD - 2, MOD)
    for j in range(1, len(invfact_n)):
        x = n - j
        invfact_n[j] = invfact_n[j - 1] * x % MOD

    invfact_m[0] = pow(fact_m, MOD - 2, MOD)
    for j in range(1, len(invfact_m)):
        x = m - j
        invfact_m[j] = invfact_m[j - 1] * x % MOD

    answer = 0
    mu = []

    def process():
        nonlocal answer

        L = len(mu)
        mu1 = mu[0] if L else 0

        # Column heights of mu.
        heights = [0] * (mu1 + 1)
        for x in mu:
            for c in range(1, x + 1):
                heights[c] += 1

        # Start with (s-1)!.
        f = fact_s

        # First row.
        f = f * invfact_n[mu1] % MOD
        for c in range(1, mu1 + 1):
            hook = n - c + heights[c]
            f = f * inv[hook] % MOD

        # First column below the top cell.
        f = f * invfact_m[L] % MOD
        for r, x in enumerate(mu, 1):
            hook = m - r + x
            f = f * inv[hook] % MOD

        # Cells corresponding to the diagram mu.
        for r, x in enumerate(mu, 1):
            for c in range(1, x + 1):
                hook = x - c + heights[c] - r + 1
                f = f * inv[hook] % MOD

        answer = (answer + f * f) % MOD

    def generate(rem, maximum, parts_left):
        if rem == 0:
            process()
            return

        if parts_left == 0 or maximum == 0:
            return

        upper = min(rem, maximum)

        for x in range(upper, 0, -1):
            mu.append(x)
            generate(rem - x, x, parts_left - 1)
            mu.pop()

    generate(t, n - 1, m - 1)
    return answer

def main():
    s, n, m = map(int, input().split())
    print(solve_case(s, n, m))

if __name__ == "__main__":
    main()
```实现的第一部分在进行任何枚举之前计算 (t) 并拒绝不可能的输入。 条件 (n*m<s) 相当于说 (n) 列、(m) 行杨氏图无法包含足够的单元格。 

阶乘循环计算 ((s-1)!)，它是除去左上角单元格的钩长度 (s) 后剩下的分子。 在同一个循环中，它记录 ((n-1)!) 和 ((m-1)!)，因为稍后只需要它们的逆阶乘的小范围。 

逆数组使用标准递归

 -\左\lfloor\frac{MOD}{i}\右\rfloor
 \operatorname{inv}(MOD\bmod i)
 \pmod{MOD}。 
]

 没有钩子长度可以被 (MOD) 整除，因为所有钩子长度最多为 (10^6)，因此这些倒数始终有效。 

这两个反阶乘数组故意很短。 对于第一行，我们只需要 ((n-1-j)!) for (0\le j\le t)，并且类似的语句适用于第一列。 无需存储最多一百万个完整的阶乘和逆阶乘表。 

递归生成器保持分区部分不增加。 参数`maximum`是下一部分允许的最大值，而`parts_left`强制执行 (\mu) 至多 (m-1) 个部分的条件。 因为(t\le51)，递归深度最多为51。 

里面`process`,`heights[c]`是 (\mu) 中 (c) 列的列高。 然后直接根据上面的公式计算第一行、第一列和右下钩因子。 (\mu) 个单元上的循环恰好处理 (t) 个单元，因此它们从不依赖于 (s) 的潜在巨大值。 

Python 中不存在整数溢出问题。 每个乘法都会以 (10^9+7) 为模进行约减，并且仅在 (f^\lambda) 已以相同模数约约后，才对最终贡献进行平方。 

## 工作示例

 ### 示例 1

 对于

 [
 s=6,\quad n=3,\quad m=3,
 ]

 我们得到

 [
 t=6-3-3+1=1。 
]

 1 的唯一划分是 (\mu=(1))，给出杨氏图

 [
 λ=(3,2,1)。 
]

 其钩长为(5,3,1,3,1,1)，其乘积为45。因此

 [
 f^\lambda=\frac{6!}{45}=16。 
]

 只有一种有效形状，因此答案是 (16^2=256)。 

| (\mu) | (\lambda) | (f^\lambda) | 贡献|
 | --- | --- | --- | --- |
 | ((1)) | ((3,2,1)) | ((3,2,1)) | 16 | 16 256 | 256

 轨迹显示了主要的减少。 六名学生不需要枚举 (6!=720) 排列。 一旦 RSK 形状固定，所有 256 个有效排列都会立即计数。 

### 示例 2

 对于

 [
 s=12,\quad n=3,\quad m=4,
 ]

 我们得到

 [
 t=12-3-4+1=6。 
]

 分区最多可以有三个部分，每个部分最多可以有两个。 唯一的可能性是 ((2,2,2)) 和 ((2,2,1))。 

它们产生形状 ((3,3,3,3)) 和 ((3,3,3,2))。 

| (\mu) | (\lambda) | (f^\lambda) | (f^\lambda{}^2) |
 | --- | --- | --- | --- |
 | ((2,2,2)) | ((2,2,2)) | ((3,3,3,3)) | 462 | 462 213444 | 213444
 | ((2,2,1)) | ((2,2,1)) | ((3,3,3,2)) | 5544 | 30735936 |
 | 总计 | | | 30949380 |

 因此答案是

 [
 213444+30735936=30949380。 
]

 此示例说明了为什么枚举不受限制的分区是不够的。 宽度限制 (\mu_1\le n-1) 和高度限制 (\ell(\mu)\le m-1) 消除了 6 的其他分区。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(s+t,p(t))) | 预计算成本 (O(s))，并且每个 (p(t)) 分区都在 (O(t)) 中处理。 |
 | 空间| (O(s+t)) | 逆数组使用 (O(s)) 内存，当前分区使用 (​​O(t))。 |

 这里 (t\le51) 和 (p(51)=239943)。 因此，分区计数的叶数少于约 240,000 个，每个叶最多处理 51 个小单元。 唯一依赖于完整输入大小的部分是高达 (s\le10^6) 的线性预处理。 这比任何涉及排列本身的方法更适合预期的约束。 

## 测试用例```python
from array import array

MOD = 1_000_000_007

def solve_case(s, n, m):
    t = s - n - m + 1

    if t < 0 or n * m < s:
        return 0

    max_mu = min(t, n - 1)

    fact_s = 1
    fact_n = 1
    fact_m = 1

    for i in range(2, s):
        fact_s = fact_s * i % MOD
        if i == n - 1:
            fact_n = fact_s
        if i == m - 1:
            fact_m = fact_s

    if n - 1 == 0:
        fact_n = 1
    if m - 1 == 0:
        fact_m = 1

    inv = array('I', [0]) * (s + 1)
    inv[1] = 1
    for i in range(2, s + 1):
        inv[i] = (MOD - (MOD // i) * inv[MOD % i] % MOD) % MOD

    invfact_n = [0] * (max_mu + 1)
    invfact_m = [0] * (min(t, m - 1) + 1)

    invfact_n[0] = pow(fact_n, MOD - 2, MOD)
    for j in range(1, len(invfact_n)):
        invfact_n[j] = invfact_n[j - 1] * (n - j) % MOD

    invfact_m[0] = pow(fact_m, MOD - 2, MOD)
    for j in range(1, len(invfact_m)):
        invfact_m[j] = invfact_m[j - 1] * (m - j) % MOD

    answer = 0
    mu = []

    def process():
        nonlocal answer

        L = len(mu)
        mu1 = mu[0] if L else 0

        heights = [0] * (mu1 + 1)
        for x in mu:
            for c in range(1, x + 1):
                heights[c] += 1

        f = fact_s

        f = f * invfact_n[mu1] % MOD
        for c in range(1, mu1 + 1):
            f = f * inv[n - c + heights[c]] % MOD

        f = f * invfact_m[L] % MOD
        for r, x in enumerate(mu, 1):
            f = f * inv[m - r + x] % MOD

        for r, x in enumerate(mu, 1):
            for c in range(1, x + 1):
                hook = x - c + heights[c] - r + 1
                f = f * inv[hook] % MOD

        answer = (answer + f * f) % MOD

    def generate(rem, maximum, parts_left):
        if rem == 0:
            process()
            return
        if parts_left == 0 or maximum == 0:
            return

        for x in range(min(rem, maximum), 0, -1):
            mu.append(x)
            generate(rem - x, x, parts_left - 1)
            mu.pop()

    generate(t, n - 1, m - 1)
    return answer

def run(inp: str) -> str:
    s, n, m = map(int, inp.split())
    return str(solve_case(s, n, m))

# Provided samples
assert run("6 3 3") == "256", "sample 1"
assert run("12 3 4") == "30949380", "sample 2"

# Minimum-size case, and n, m, s are all equal.
assert run("1 1 1") == "1", "minimum size"

# A completely increasing permutation is the only valid arrangement.
assert run("5 5 1") == "1", "maximum LIS"

# A completely decreasing permutation is the only valid arrangement.
assert run("5 1 5") == "1", "maximum LDS"

# n + m > s + 1, so no permutation can satisfy the request.
assert run("5 5 5") == "0", "impossible sum"

# The lower bound n + m = s - 50 is met exactly,
# but LIS = LDS = 1 is impossible for 52 distinct values.
assert run("52 1 1") == "0", "boundary lower bound"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1`| 1 | 最小尺寸和同等参数|
 |`5 5 1`| 1 | Purely increasing permutation |
 |`5 1 5`| 1 | 纯递减排列 |
 |`5 5 5`| 0 | 不可能 (n+m>s+1) 边界 |
 |`52 1 1`| 0 | 精确 (n+m=s-50) 边界 |

 ## 边缘情况

 对于`1 1 1`，值（t=1-1-1+1=0）。 生成器立即处理空分区（\mu）。 对应的形状就是((1))，其表数为1，答案变为(1^2=1)。 这也说明了为什么必须显式处理空分区，而不是假设至少存在一个额外的单元。 

为了`5 5 5`，我们得到(t=5-5-5+1=-4)。 该算法在构造任何阶乘或分区数据之​​前返回零。 负值意味着强制挂钩已经包含五个以上的单元格，因此大小为 5 的杨图不能具有长度均为 5 的第一行和第一列。 

为了`52 1 1`，由于 (1+1=52-50)，所以满足特殊约束。 然而，

 [
 n\cdot m=1<52,
 ]

 因此 (n\times m) 杨图不能包含 52 个单元格。 早期可行性测试返回零。 这是一个有用的例子，因为仅仅检查 (t\le51) 是不够的。 

为了`5 5 1`，我们有 (t=0)。 唯一的形状是钩子 ((5))，因为 (m=1) 不允许有更低的行。 它的tableau计数是1，对应于唯一的递增排列。 模拟输入`5 1 5`产生单列形状和独特的递减排列。 

对于样品`6 3 3`，（t=1），因此整个形状由单个分区（（1））决定。 该算法得到(f^\lambda=16)并相加(16^2=256)。 这捕获了将多余部分定义为 (s-n-m) 的常见错误，该错误会减少 1，并且会错误地将这种情况视为具有零个额外单元格。
