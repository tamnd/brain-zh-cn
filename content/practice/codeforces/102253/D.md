---
title: "CF 102253D - 除法游戏"
description: "我们有 (k) 个相同的堆，每个堆最初都包含相同的大整数 (n)。 桩是循环排列的。 回合 (1) 操作桩 (0)，回合 (2) 操作桩 (1)，依此类推，环绕在桩 (k-1) 之后。"
date: "2026-08-17T21:25:22+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102253
codeforces_index: "D"
codeforces_contest_name: "2017 Chinese Multi-University Training, BeihangU Contest"
rating: 0
weight: 102253
solve_time_s: 193
verified: true
draft: false
---

[CF 102253D - 除法游戏](https://codeforces.com/problemset/problem/102253/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 13s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (k) 个相同的堆，每个堆最初都包含相同的大整数 (n)。 桩是循环排列的。 回合 (1) 操作桩 (0)，回合 (2) 操作桩 (1)，依此类推，环绕在桩 (k-1) 之后。 

运算将堆中的当前值 (x) 替换为 (x) 的真除数 (d)，因此 (1 \le d < x)。 当某堆变成 (1) 时，游戏立即停止。 对于每个堆 (i)，我们需要完整操作序列的数量，其第一个堆到达 (1)，因此最后一个更改的堆是 (i)。 

整数 (n) 本身可能太大而无法构造。 相反，它的质因数分解为

 [
 n=\prod_{j=1}^{m}p_j^{e_j}。 
]

 素数本身与组合数学几乎无关。 重要的是指数向量 ((e_1,\ldots,e_m))，因为用除数替换数字只是独立地减少每个素数指数。 

让

 [
 w=\sum_{j=1}^{m}e_j。 
]

 每次操作至少使一个指数减少至少 1，因此单个堆最多可以操作 (w) 次。 由于 (w\le 10^5)，主循环是线性的或 (O(w\log w)) 的解决方案是现实的。 完全排除了在上限处进行 (10^{10}) 次运算的二次算法。 事实上，只有少数测试用例具有 (w\ge 10^4)，这一事实对于基于 NTT 的实现特别有用，因为只有真正的大型用例才需要昂贵的转换。 官方解决方案正是使用这种减少和给定模数下的 NTT。 

在几种边界情况下，肤浅的模拟或错误索引的公式会给出错误的答案。 例如，与```
1 1
2 2
```我们有 (n=4) 和一堆。 正好有两条链，(4\to1) 和 (4\to2\to1)，所以答案是`Case #1: 2`。 仅考虑最短链的模拟错过了第二种可能性。 

和```
1 2
2 1
```我们有两堆并且 (n=2)。 一堆 (0) 可以立即变成 (1)，给出一个有效序列。 如果堆(1)应该是最后一个，则堆(0)必须首先被改变而不变成(1)，这是不可能的。 答案是`Case #1: 1 0`。 对称地处理桩会错误地给出相同的答案。 

第二种微妙的情况是在同一个操作中可以减少多个素数指数。 对于(n=6=2^1 3^1)，一次运算可以将(6)直接变为(1)，也可以只去掉一个素因子，留下(2)或(3)。 一种独立计算每个素数链然后将它们相乘的方法忽略了每个操作必须至少减少一个指数的要求，同时允许多个指数一起减少。 

最后，必须正确处理与零先前操作相对应的术语。 我们定义(f(0)=0)，因为正数在零运算中不能变成(1)。 在另一个边界处，(f(w+1)=0)，因为 (w+1) 次操作不能发生在一堆上。 这两个人工边界值使最终求和变得干净并防止相差一的错误。 

## 方法

 直接方法将模拟每堆的每种可能的除数选择。 这是正确的，因为每个合法运算都是从一个除数到一个更小的真除数的转换。 问题在于链的数量。 考虑特别简单的输入 (n=2^w)。 从 (2^w) 到 (1) 的链由出现的中间指数 (1,2,\ldots,w-1) 确定。 每个子集都给出一个严格递减的链，因此一堆正好有 (2^{w-1}) 条链。 对于 (w=10^5)，即 (2^{99999}) 种可能性。 在考虑多堆之前，暴力破解已经是不可能的了。 

关键的观察是忘记实际的质数值并完全通过其指数向量来描述一堆。 假设一堆在达到 (1) 之前恰好被更改了 (x) 次。 令 (d_{r,j}) 为在操作 (j) 期间删除了多少指数 (e_r)。 然后

 [
 \sum_{j=1}^{x}d_{r,j}=e_r
 ]

 对于每个素数 (r)，并且每个操作实际上都必须改变堆，所以

 [
 \sum_{r=1}^{m}d_{r,j}>0
 ]

 对于每个操作 (j)。 

因此，(f(x))，即在恰好 (x) 次运算中一堆变为 (1) 的方式数量，恰好是此类矩阵 (d) 的数量。 这将除数链问题转变为受限组合问题。 这是官方解决方案使用的中心组合变换。 

如果我们暂时忽略每个操作必须删除某些内容的要求，则每个指数 (e_r) 可以分布在 (x) 个操作中

 [
 \binom{e_r+x-1}{x-1}
 ]

 方式。 乘以所有素因数得出

 [
 g(x)=\prod_{r=1}^{m}\binom{e_r+x-1}{x-1}。 
]

 现在，某些 (x) 操作可能什么也接收不到。 对空操作的包含-排除给出

 [
 f(x)=\sum_{y=0}^{x}(-1)^{x-y}\binom{x}{y}g(y)。 
]

 为每个 (x) 独立计算该公式将再次是二次的。 有用的部分是二项式系数分离：

 [
 \binom{x}{y}=\frac{x!}{y!(x-y)!}。 
]

 因此

 \sum_{y=0}^{x}
 \frac{(-1)^{x-y}}{(x-y)!}
 \frac{g(y)}{y!}。 
]

 这是一个普通的卷积。 定义

 [
 A_t=\frac{(-1)^t}{t!},
 \qquad
 B_y=\frac{g(y)}{y!}。 
]

 然后

 [
 \frac{f(x)}{x!}=(A*B)_x。 
]

 模数特别方便：

 [
 985661441=235\cdot2^{22}+1,
 ]

 (3) 是原根，因此 2 的幂 (2^{22}) 支持 NTT。 所需的最大卷积的长度最多约为 (2w)，当 (w\le10^5) 时，它适合 (2^{18})。 

我们仍然需要将 (f) 连接回桩的循环序列。 假设使用从零开始索引的桩 (i) 是变为 (1) 的桩，并假设这发生在第 (x) 次操作上。 (i) 之前的每一堆都已经被操作了 (x) 次，并且仍然必须包含不止一颗石头。 此类历史的数量为 (f(x+1))，因为在 (1) 之上结束的 (x) 操作的任何有效历史都恰好有一个可能的下一个操作，即将剩余值更改为 (1)。 最后一堆有 (x) 次操作并贡献 (f(x))。 (i) 之后的每一堆仅进行 (x-1) 次操作，并且也贡献 (f(x))。 因此

 \sum_{x=0}^{w}
 f(x+1)^i f(x)^{k-i}。 
]

这是 (O(wk))，它很小，因为 (k\le10)。 官方推导中也出现了相同的公式，桩索引从一开始。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^w)) 或更差的所有堆 | 指数| 太慢了 |
 | 最佳| (O(wm+w\log w+wk)) | (O(w)) | 已接受 |

 ## 算法演练

 1. 读取所有测试用例并仅存储指数 (e_1,\ldots,e_m) 和 (k)。 质数从不参与计数，因为除数运算完全由指数递减决定。 
2. 计算 (w=\sum e_i)。 任何桩的运算次数都不能超过 (w) 次，因为每次合法运算都会使总指数和至少减少 1。 
3. 预先计算阶乘和逆阶乘模 (985661441)，直到所有测试用例中最大的 (w)。 由于 (w<985661441)，直到 (w) 的每个整数都有一个模逆。 
4. 为 (1\le x\le w) 构建 (g(x))，其中

 [
 g(x)=\prod_r\binom{e_r+x-1}{x-1}。 
]

 设置 (g(0)=0)，因为正指数不能分布在零运算中。 从(g(1)=1)开始，各因子满足

 \binom{e+x-1}{x-1}\frac{e+x}{x}。 
]

 因此，从 (g(x)) 到 (g(x+1)) 的每一步仅需要 (m) 次模乘，而不是从头开始重新计算二项式系数。 

1.构造两个卷积数组

 [
 A_t=\frac{(-1)^t}{t!},
 \qquad
 B_t=\frac{g(t)}{t!}。 
]

 (x) 位置处的卷积系数正好是 (f(x)/x!)。 

1. 将这两个数组乘以 NTT。 所需的变换大小至少是两个的最小幂 (2(w+1)-1)。 给定模数在 (p-1) 中具有足够大的 2 次幂，因此变换是精确的模运算而不是浮点 FFT。 
2. 恢复

 [
 f(x)=(A*B)_x x!
 ]

 对于 (0\le x\le w)。 追加 (f(w+1)=0)。 该值为零，因为堆不能需要超过 (w) 次操作才能达到 (1)。 

1. 对于每一堆 (i)，计算

 \sum_{x=0}^{w}
 f(x+1)^i f(x)^{k-i}。 
]

 指数 (i) 对应于循环顺序中最后一个堆之前出现的堆。 剩余的 (k-i) 因子对应于最后的一堆及其之后的一堆。 

1. 输出对 (985661441) 取模的 (k) 个答案。 通常，结果序列是不对称的，因为回合顺序是固定的，即使所有桩都以相同的值开始。 

为什么它有效：整个解决方案背后的不变性是除数运算的合法链相当于指数递减矩阵，其行总和等于原始指数并且其列全部非零。 函数 (g) 对具有正确行和的所有矩阵进行计数，而包含-排除则精确删除那些包含空列的矩阵。 因此 (f(x)) 精确地计算到 (1) 的合法 (x) 操作链。 对于固定的最终堆和固定的 (x)，循环调度准确地确定每个其他堆已接收多少次操作，并且 (f(x+1)) 与 (f(x)) 因子精确地计算尚未达到 (1) 的历史记录。 对每个可能的 (x) 进行求和，对每个有效游戏进行一次计数，此时其第一堆变为 (1)。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 985661441
ROOT = 3
NAIVE_LIMIT = 256

FACT = []
IFACT = []

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
        wlen = pow(ROOT, (MOD - 1) // length, MOD)
        if invert:
            wlen = pow(wlen, MOD - 2, MOD)

        half = length >> 1
        for start in range(0, n, length):
            w = 1
            end = start + half
            for i in range(start, end):
                u = a[i]
                v = a[i + half] * w % MOD

                x = u + v
                if x >= MOD:
                    x -= MOD

                y = u - v
                if y < 0:
                    y += MOD

                a[i] = x
                a[i + half] = y
                w = w * wlen % MOD

        length <<= 1

    if invert:
        inv_n = pow(n, MOD - 2, MOD)
        for i in range(n):
            a[i] = a[i] * inv_n % MOD

def convolution(a, b):
    need = len(a) + len(b) - 1

    if min(len(a), len(b)) <= NAIVE_LIMIT:
        res = [0] * need
        for i, x in enumerate(a):
            if x == 0:
                continue
            for j, y in enumerate(b):
                if y:
                    res[i + j] = (res[i + j] + x * y) % MOD
        return res

    size = 1
    while size < need:
        size <<= 1

    a += [0] * (size - len(a))
    b += [0] * (size - len(b))

    ntt(a, False)
    ntt(b, False)

    for i in range(size):
        a[i] = a[i] * b[i] % MOD

    ntt(a, True)
    return a[:need]

def build_f(exps):
    w = sum(exps)

    g = [0] * (w + 1)
    g[1] = 1

    for x in range(1, w):
        inv_x = FACT[x - 1] * IFACT[x] % MOD
        ratio = 1

        for e in exps:
            ratio = ratio * (e + x) % MOD
            ratio = ratio * inv_x % MOD

        g[x + 1] = g[x] * ratio % MOD

    a = [0] * (w + 1)
    b = [0] * (w + 1)

    for x in range(w + 1):
        inv_fact = IFACT[x]
        a[x] = inv_fact if x % 2 == 0 else MOD - inv_fact
        b[x] = g[x] * inv_fact % MOD

    c = convolution(a, b)

    f = [0] * (w + 2)
    for x in range(w + 1):
        f[x] = c[x] * FACT[x] % MOD

    f[w + 1] = 0
    return f

def solve():
    global FACT, IFACT

    cases = []
    max_w = 0

    while True:
        line = input()
        if not line:
            break
        if not line.strip():
            continue

        m, k = map(int, line.split())
        exps = []

        for _ in range(m):
            _, e = map(int, input().split())
            exps.append(e)

        w = sum(exps)
        max_w = max(max_w, w)
        cases.append((exps, k))

    if not cases:
        return

    FACT = [1] * (max_w + 1)
    for i in range(1, max_w + 1):
        FACT[i] = FACT[i - 1] * i % MOD

    IFACT = [1] * (max_w + 1)
    IFACT[max_w] = pow(FACT[max_w], MOD - 2, MOD)
    for i in range(max_w, 0, -1):
        IFACT[i - 1] = IFACT[i] * i % MOD

    out = []

    for case_id, (exps, k) in enumerate(cases, 1):
        w = sum(exps)
        f = build_f(exps)

        ans = [0] * k

        for x in range(w + 1):
            left = f[x + 1]
            right = f[x]

            powers_left = [1] * k
            powers_right = [1] * (k + 1)

            for j in range(1, k):
                powers_left[j] = powers_left[j - 1] * left % MOD

            for j in range(1, k + 1):
                powers_right[j] = powers_right[j - 1] * right % MOD

            for i in range(k):
                ans[i] += powers_left[i] * powers_right[k - i] % MOD
                if ans[i] >= MOD:
                    ans[i] -= MOD

        out.append(
            "Case #{}: {}".format(case_id, " ".join(map(str, ans)))
        )

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入阶段首先存储指数列表，因此只能使用所有测试用例中的最大值 (w) 预先计算阶乘一次。 这很重要，因为可能有大约 200 个案例，并且重复重建阶乘数组会增加不必要的工作。 

(g) 的递推避免了参数与 (e_i+x-1) 一样大的阶乘。 对于每个指数，从 (x) 到 (x+1) 的转变乘以 ((e_i+x)/x)。 (x) 的倒数由下式获得`FACT[x - 1] * IFACT[x]`。 分母必须对每个指数应用一次，这就是为什么逆数出现在循环内部的原因`exps`。 

两个数组`a`和`b`直接实现归一化卷积。`a[x]`是 ((-1)^x/x!)，而`b[x]`是 (g(x)/x!)。 卷积后，将系数 (x) 乘以`FACT[x]`恢复 (f(x))。 

NTT 使用原根 (3)，该根对该模有效。 模数的形式为 (235\cdot2^{22}+1)，因此问题所需的每个变换长度都除以 2 的可用幂。 

最后的循环有意地经过(x=w)。 在 (x=w) 处，`f[x + 1]`是显式附加的零。 对于桩(0)，其指数为零，因此对应的(0^0)被模幂数组解释为(1)，这正是公式所要求的。 对于其他每一堆，同一个项都会消失，因为`f[w + 1]`发生。 

该实现仅对非常小的数组使用二次卷积。 一旦多项式变大，就使用NTT。 这不会改变渐进复杂性，并且避免在微小的测试用例上支付 NTT 较大的常数因子。 

## 工作示例

 ### 示例 1

 第一个示例案例是```
1 1
2 2
```所以 (n=2^2=4)、(k=1) 和 (w=2)。 

对于一个素数指数 (e=2)，无限制分布计数为

 [
 g(1)=1,\qquad g(2)=\binom31=3。 
]

 包含-排除给出

 [
 f(1)=1,
 ]

 和

 [
 f(2)=g(2)-2g(1)=3-2=1。 
]

 当总指数和仅为 2 时，不可能有 3 个非空运算，因此 (f(3)=0)。 

| (x)| (f(x)) | (f(x)) | (f(x+1)) | (f(x+1)) | 贡献堆 0 |
 | --- | --- | --- | --- |
 | 0 | 0 | 1 | (1^0 0^1=0) |
 | 1 | 1 | 1 | (1^0 1^1=1) |
 | 2 | 1 | 0 | (0^0 1^1=1) |

 这两个贡献完全对应于 (4\to1) 和 (4\to2\to1)。 结果是`Case #1: 2`，匹配示例输出。 

### 示例 2

 第二个示例案例是```
2 1
2 1
3 1
```所以 (n=2\cdot3=6)、(k=1) 和 (w=2)。 

有两行指数，每行包含一个单位。 对于一项操作，两个单元必须置于同一操作中，给出 (f(1)=1)。 对于两个运算，每个指数必须分配给不同的运算，给出两种可能性，因此(f(2)=2)。 

| (x)| (f(x)) | (f(x)) | (f(x+1)) | (f(x+1)) | 贡献 |
 | --- | --- | --- | --- |
 | 0 | 0 | 1 | (0) |
 | 1 | 1 | 2 | (1) |
 | 2 | 2 | 0 | (2\cdot0^0=2) |

 两条长度为 2 的链是 (6\to2\to1) 和 (6\to3\to1)，而 (6\to1) 给出长度为 1 的链。 总计为 (3)，产生`Case #2: 3`。 

第二条轨迹还说明了为什么可以在同一操作中删除不同的素数指数。 两个指数单元不被强制表现为独立的链。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(wm+w\log w+wk)) | (g(x)) 需要 (O(wm))，NTT 卷积需要 (O(w\log w))，所有堆答案需要 (O(wk)) |
 | 空间| (O(w)) | 阶乘、卷积数组和 (f) 都具有线性大小 |

 最大的(w)是(10^5)，而(m,k\le10)。 NTT 长度是上面的 2 的下一个幂 (2w+1)，最多 (2^{18})。 模数支持此变换大小，因为其 (2)-adic 因子为 (2^{22})。 只能有 5 种情况的特殊限制 (w\ge10^4) 使昂贵的大型变换得到控制。 由此产生的复杂性与预期的解决方案相匹配。 

## 测试用例

 以下测试假设上述解决方案保存为`solution.py`。 helper 替换了标准输入并捕获标准输出，因此相同`solve()`测试判断所使用的函数。```python
# helper: run solution on input string, return output string
import sys
import io
from solution import solve

MOD = 985661441

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output

    try:
        solve()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

    return output.getvalue()

# Provided samples
sample = """\
1 1
2 2
2 1
3 1
5 1
1 2
2 3
2 2
2 4
5 4
"""

expected_sample = """\
Case #1: 2
Case #2: 3
Case #3: 6 4
Case #4: 1499980 1281085
"""

assert run(sample) == expected_sample, "provided samples"

# Custom 1: minimum exponent, many piles.
# n = 2, k = 10. Only pile 0 can become 1.
inp = """\
1 10
2 1
"""

expected = "Case #1: 1 " + " ".join(["0"] * 9) + "\n"
assert run(inp) == expected, "prime n with many piles"

# Custom 2: boundary between one and two operations.
# n = 4, k = 2.
# f(1) = 1, f(2) = 1, so answers are [2, 1].
inp = """\
1 2
2 2
"""

assert run(inp) == "Case #1: 2 1\n", "two-pile boundary case"

# Custom 3: equal exponents on distinct primes.
# n = 2^2 * 3^2 = 36, k = 2.
# f(1), f(2), f(3), f(4) = 1, 7, 12, 6.
# Answers are 230 and 163.
inp = """\
2 2
2 2
3 2
"""

assert run(inp) == "Case #1: 230 163\n", "equal exponent case"

# Custom 4: maximum allowed exponent sum.
# n = 2^100000, k = 1.
# For one prime, every chain is a strictly decreasing sequence of
# exponents, so there are 2^99999 chains.
inp = """\
1 1
2 100000
"""

expected = f"Case #1: {pow(2, 99999, MOD)}\n"
assert run(inp) == expected, "maximum-size exponent case"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 10 / 2 1`|`Case #1: 1 0 0 0 0 0 0 0 0 0`| 最小指数、循环排序以及第一堆特殊的事实 |
 |`1 2 / 2 2`|`Case #1: 2 1`| (x=0) 和 (x=w) 边界和桩索引方向 |
 |`2 2 / 2 2 / 3 2`|`Case #1: 230 163`| 具有相等指数和同时指数递减的多个质因数 |
 |`1 1 / 2 100000`|`Case #1: 2^99999 mod 985661441`| 最大值 (w)、大阶乘、NTT 和底层链的指数数 |

 ## 边缘情况

 对于两桩质数情况```
1 2
2 1
```我们有 (w=1)、(f(0)=0)、(f(1)=1) 和 (f(2)=0)。 对于桩 (0)，(x=1) 的项是

 [
 f(2)^0f(1)^2=1,
 ]

 所以它的答案是（1）。 对于堆(1)，每一项都包含(f(2)=0)的正幂，所以它的答案是(0)。 算法输出`Case #1: 1 0`。 这捕获了最常见的索引错误，即循环顺序被意外地视为对称。 

为了```
1 2
2 2
```我们有 (n=4) 和 (w=2)。 合法链是 (4\to1) 和 (4\to2\to1)，因此 (f(1)=f(2)=1)。 对于桩 (0)，

 [
 f(1)^2+f(2)^2=2,
 ]

 而对于桩 (1)，

 [
 f(2)f(1)=1。 
]

 该算法产生`Case #1: 2 1`。 (f(w+1)=0) 边界消除了所有不可能的较长历史。 

为了```
2 2
2 1
3 1
```两个运算的指数矩阵有两行和两列。 每行包含一个单元，并且两列都必须非空，因此两行必须分配给不同的列。 恰好有两种可能性，给出(f(2)=2)。 得到的一堆答案是`Case #1: 5 2`。 这种情况揭示了为什么单个操作可以同时减少几个不同的素数指数。 

对于最大尺寸的情况```
1 1
2 100000
```只有一个指数。 有效链只是从指数 (100000) 到指数 (0) 的严格递减序列。 (99999) 个中间指数的每个子集都确定一条链，所以答案是

 [
 2^{99999}\pmod{985661441}。 
]

 该实现从不构造 (2^{100000})，从不枚举链，也从不构造原始整数 (n)。 它只处理指数和（w=100000），这正是组合公式所需的信息。
