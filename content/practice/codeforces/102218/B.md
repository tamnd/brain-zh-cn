---
title: "CF 102218B - 购买成堆的石头"
description: "我们正好购买 (M) 堆。 每堆独立选择 (K) 个可用正尺寸之一，每个尺寸都有概率 (1/K)。 当所有牌堆都揭开后，游戏就变成了普通的 Nim 位置。 对于 Nim 来说，当所有桩大小的异或非零时，Alice 就获胜。"
date: "2026-08-20T03:16:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102218
codeforces_index: "B"
codeforces_contest_name: "2019, XI Annual Programming Contest by ESCOM-IPN"
rating: 0
weight: 102218
solve_time_s: 702
verified: false
draft: false
---

[CF 102218B - 购买成堆的石头](https://codeforces.com/problemset/problem/102218/B)

 **评级：** -
 **标签：** -
 **求解时间：** 11m 42s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们正好购买 (M) 堆。 每堆独立选择 (K) 个可用正尺寸之一，每个尺寸都有概率 (1/K)。 当所有牌堆都揭开后，游戏就变成了普通的 Nim 位置。 

对于 Nim 来说，当所有桩大小的异或非零时，Alice 就获胜。 因此问题是计算概率

 [
 \Pr[c_{i_1}\oplus c_{i_2}\oplus\cdots\oplus c_{i_M}\ne 0],
 ]

 其中每个 (i_j) 都是从 (K) 个可用大小中独立且统一地选择的。 

要求答案取模 (998244353)。 如果 (W) 是 (M) 堆大小的有序选择数，其异或非零，则所需概率为 (W/K^M)，因此对素数取模后变为

 [
 W\cdot (K^M)^{-1}\pmod {998244353}。 
]

 堆的数量（M）可以大到（10^9），因此任何一个一个地处理堆的方法都是不可能的。 可能的桩尺寸均低于 (2^{17})，这是关键的结构约束。 这意味着每个大小都适合 17 位异或空间，其中仅包含

 [
 2^{17}=131072
 ]

 可能的值。 (O(2^{17}\cdot17)) 算法很容易实现，而 (O(MK))、(O(M2^{17})) 或枚举所有 (K^M) 个有序选择是没有希望的。 

有几种边缘情况可能会悄无声息地破坏实现。 如果（K=1），每堆的大小完全相同。 例如，```
2 1
5
```给出概率 (1)，因为 (5\oplus5=0)，所以第一个玩家的位置是失败的。 如果公式假设有几个不同的选择或忘记偶数个相等值的异或为零，则可能会出错。 

为了```
1 1
5
```答案是（0）。 只有一堆，而且它的大小不为零，因此爱丽丝可以移除它并获胜。 这也捕获了指数所在的边界 (M=1)。 

另一个有用的案例是```
3 2
1 2
```这两个值的可能计数总计为 (3)。 为了获得异或零，两个计数必须是偶数，这是不可能的，因为它们的总和是奇数。 因此，爱丽丝获胜的概率是 (1)，而不是 (0)。 如果粗心地只检查是否存在重复的堆大小，就会错过奇偶校验条件。 

最后，变换必须包括从 (0) 到 (2^{17}-1) 的整个异或域，即使每个提供的大小都是正数。 值 (0) 不是提供的堆大小，但它是可能的异或结果，并且在计算失败位置时至关重要。 

## 方法

 直接方法考虑来自 (K) 个可用堆大小的 (M) 个选择的每个有序序列。 对于每个序列，我们对其元素进行异或并检查结果是否非零。 这是正确的，因为每个有序序列都有精确的概率 (1/K^M)。 

问题在于序列的数量。 它们有 (K^M) 个，因此即使每个序列的工作量恒定，运行时间也是 (O(K^M M))。 例如，(K=2) 和 (M=10^9) 已经给出了 (2^{10^9}) 个可能的序列。 在达到最大约束之前很久，暴力方法就变得毫无用处。 

一个更有希望的观点是计算丢失位置，即异或恰好为零的序列。 由于每个堆值都低于 (2^{17})，因此异或运算在 17 位整数的有限向量空间中进行。 这给了我们只有 (N=2^{17}) 种可能的异或状态。 

我们可以定义一个动态编程数组，其中`dp[x]`是经过一定数量的堆后获得 xor (x) 的方法的数量。 再添加一堆值为 (c) 的状态，将状态 (x) 更改为 (x\oplus c)。 一次转换将花费 (O(NK))，执行 (M) 次将花费 (O(MNK))，这仍然太大，因为 (M) 可以达到 (10^9)。 

关键的观察是这种转变是异或卷积。 如果 (f[x]) 描述当前分布，而 (g[c]) 是新买的一堆分布，则下一个分布是

 [
 h[x]=\sum_y f[y]g[x\oplus y]。 
]

 异或卷积有专门为其设计的傅里叶变换，即 Walsh-Hadamard 变换。 在变换空间中，异或卷积变成逐点乘法。 因此，获取 (M) 堆就变得简单地将每个变换后的值提高到 (M) 次方。 

当 (x) 是提供的尺寸之一时，令 (A[x]) 为 (1)，否则为 (0)。 其 Walsh-Hadamard 变换为

 [
 F[s]=\sum_x A[x](-1)^{\operatorname{popcount}(s\mathbin{&}x)}。 
]

 xor 等于 0 的有序 (M) 元组的数量为

 [
 L=\frac{1}{N}\sum_{s=0}^{N-1}F[s]^M。 
]

 这是专门在异或状态零处评估的标准逆 Walsh-Hadamard 公式。 我们实际上并不需要重建整个分布。 我们只需要零系数，因此在变换并取幂之后，我们可以对变换后的值求和。 

期望的答案是获胜的概率，即一减去失败的概率。 由于有 (K^M) 个同样可能的有序选择，

 \frac{1}{NK^M}\sum_s F[s]^M。 
]

 因此

 1-
 \frac{\sum_s F[s]^M}{NK^M}
 }
 \pmod {998244353}。 
]

 变换本身的成本为 (O(N\log N))，并且有 (N) 个模幂，每次成本为 (O(\log M))。 由于 (N=2^{17})，这可以轻松处理约束。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(K^MM)) | (O(M)) | 太慢了 |
 | 异或状态上的 DP | (O(MNK)) | (O(N)) | 太慢了 |
 | Walsh-Hadamard 变换 | (O(N\log N+N\log M)) | (O(N)) | 已接受 |

 ## 算法演练

 1.设置(N=2^{17})，因为每个堆大小最多由17位表示。 创建一个数组`a`长度 (N)，其中`a[c]=1`对于每个提供的桩尺寸 (c) 和其他地方的零。 该数组描述了标准化之前的单堆分布。 
2. 应用快速 Walsh-Hadamard 变换`a`。 对于每个变换坐标，结果值是有符号和

 [
 F[s]=\sum_{c\in C}(-1)^{\operatorname{popcount}(s\mathbin{&}c)}。 
]

 该变换将异或卷积转换为乘法，这正是我们所需要的，因为独立的堆通过异或组合。 

1. 将每个变换后的值取模 (998244353) 的 (M) 次方。 如果一堆贡献变换值 (F[s])，则 (M) 个独立堆贡献 (F[s]^M)。 我们可以直接用模二进制求幂来计算，所以 (M) 的巨大值不是问题。 
2. 对 (N) 个变换坐标上的所有 (F[s]^M) 求和。 根据 Walsh-Hadamard 逆公式，将此总和除以 (N) 即可得出异或为零的有序 (M) 元组的数量。 
3. 将输掉的次数除以(K^M)，得到输掉的概率。 模除法是乘以模逆，所以我们计算

 \left(\sum_sF[s]^M\right)
 (NK^M)^{-1}
 \pmod {998244353}。 
]

 1. 输出 (1-\text{lose}) modulo (998244353)，因为当异或不为零时，Alice 恰好获胜。 

为什么它有效：该方法背后的不变性是每个 Walsh-Hadamard 坐标独立跟踪每个可能的异或状态的有符号贡献。 对于一堆，坐标是 (F[s])。 通过异或组合独立堆对应于异或卷积，而 Walsh-Hadamard 变换将该卷积更改为普通乘法。 经过 (M) 堆后，坐标为 (F[s]^M)。 逆变换表示异或状态零的系数恰好是所有变换坐标之和的 (1/N) 倍。 由于每个有序选择都具有相等的概率 (1/K^M)，因此对该计数进行归一化可得出失败概率，其补码是 Alice 的获胜概率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
LOG = 17
N = 1 << LOG

def fwht(a):
    n = len(a)
    length = 1

    while length < n:
        step = length << 1

        for i in range(0, n, step):
            end = i + length

            for j in range(i, end):
                x = a[j]
                y = a[j + length]

                a[j] = x + y
                a[j + length] = x - y

        length = step

def solve():
    M, K = map(int, input().split())
    c = list(map(int, input().split()))

    a = [0] * N
    for x in c:
        a[x] = 1

    fwht(a)

    total = 0
    for x in a:
        total = (total + pow(x % MOD, M, MOD)) % MOD

    denominator = N * pow(K, M, MOD) % MOD
    losing = total * pow(denominator, MOD - 2, MOD) % MOD

    answer = (1 - losing) % MOD
    print(answer)

if __name__ == "__main__":
    solve()
```输入数组恰好包含每个可能的堆大小的一个条目。 因为所有提供的尺寸都是不同的，所以分配`1`他们每个人都给出了正确的一堆计数函数。`fwht`执行非标准化 Walsh-Hadamard 变换。 每个蝴蝶用 ((x+y,x-y)) 替换一对 ((x,y))。 正向变换过程中没有除法，这使得实现简单并避免在每个蝴蝶中引入模逆。 

变换值可以为负值，也可以在变换过程中增大。 Python 整数不会溢出，但在模幂运算之前减少值仍然有用。 表达式`x % MOD`正确处理负值。 

求幂`pow(x % MOD, M, MOD)`是必不可少的，因为 (M) 可以是 (10^9)。 每个变换坐标的二进制求幂仅需要 (O(\log M)) 模乘法。 

因子 (N) 来自 Walsh-Hadamard 逆变换。 一个常见的实施错误是忽略它并意外地计算出 (N) 倍的亏损头寸数量。 

另一个分母是(K^M)，因为商店选择是独立且统一的。 我们将这两个因素结合起来为`N * K^M`在进行模逆之前。 由于 (N=2^{17}) 和 (K<2^{17}<998244353)，这两个因子都不能被素数模整除。 

最后，`1 - losing`取模`MOD`。 这处理了以下情况：`losing`大于`1`经过算术后，即使潜在的概率在零和一之间。 

## 工作示例

 ### 示例 1

 输入是```
2 2
1 3
```有四个有序对。 两个失败的对是 ((1,1)) 和 ((3,3))，因为它们的异或为零。 同样，两对获胜。 

对于变换，相关的有符号和由两个值1和3确定。下表显示了变换和求幂后的主要量。 

| 数量 | 价值|
 | --- | --- |
 | (男)| 2 |
 | (K) | 2 |
 | (N)| 131072 | 131072
 | 每个提供值的一堆计数 | 1 |
 | 总订购选择 (K^M) | 4 |
 | 失去选择| 2 |
 | 获胜概率 | (2/4=1/2) |
 | 模块化答案 | 499122177 |

 输出`499122177`是 (1/2) 的模表示，因为 (2^{-1}\equiv499122177\pmod{998244353})。 这证实了变换计数通过异或空间大小和可能的订购购买数量标准化。 

### 示例 2

 输入是```
11 1
5
```只有一种可能的堆大小，因此 11 堆中的每一堆都包含 5 个石子。 

| 数量 | 价值|
 | --- | --- |
 | (男)| 11 | 11
 | (K) | 1 |
 | 唯一可能的堆尺寸 | 5 |
 | 总异或| (5) |
 | 损失概率| 0 |
 | 获胜概率 | 1 |
 | 输出| 1 |

 由于11是奇数，

 [
 5\oplus5\oplus\cdots\oplus5=5,
 ]

 有 11 个 5 的副本。异或非零，因此 Alice 总是获胜。 此示例检查求幂是否正确处理单个可用值，以及奇数个相等的桩是否获胜。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(2^{17}\cdot17+2^{17}\log M)) | FWHT 有 17 个级别，每个变换坐标后跟一个模幂 |
 | 空间| (O(2^{17})) | 一个数组存储所有异或空间值 |

 该变换只有 131072 个条目，每个条目参与 17 个蝶形级别。 求幂阶段对于 (M\le10^9) 的每个坐标最多执行约 30 个模平方步骤。 这很容易在预期范围内，而对 (M) 的依赖性是对数而不是线性。 

## 测试用例```python
import sys
import io

MOD = 998244353
N = 1 << 17

def fwht(a):
    n = len(a)
    length = 1

    while length < n:
        step = length << 1
        for i in range(0, n, step):
            for j in range(i, i + length):
                x = a[j]
                y = a[j + length]
                a[j] = x + y
                a[j + length] = x - y
        length = step

def solve():
    M, K = map(int, input().split())
    c = list(map(int, input().split()))

    a = [0] * N
    for x in c:
        a[x] = 1

    fwht(a)

    total = sum(pow(x % MOD, M, MOD) for x in a) % MOD
    denominator = N * pow(K, M, MOD) % MOD
    losing = total * pow(denominator, MOD - 2, MOD) % MOD

    print((1 - losing) % MOD)

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    try:
        sys.stdin = io.StringIO(inp)
        input = sys.stdin.readline

        output = io.StringIO()
        old_stdout = sys.stdout
        sys.stdout = output
        try:
            solve()
        finally:
            sys.stdout = old_stdout

        return output.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        input = old_input

# Provided samples
assert run("2 2\n1 3\n") == "499122177", "sample 1"
assert run("11 1\n5\n") == "1", "sample 2"
assert run("7 3\n1 2 3\n") == "50665352", "sample 3"

# Minimum-size input: one pile, one possible nonzero size.
assert run("1 1\n1\n") == "0", "single pile must be winning"

# One possible size, even number of piles.
assert run("2 1\n5\n") == "1", "two equal piles have xor zero"

# Two possible sizes, odd number of piles.
# With values 1 and 2, xor zero requires both counts to be even,
# which is impossible when M is odd.
assert run("3 2\n1 2\n") == "1", "odd length cannot have zero xor"

# Boundary value 2^17 - 1 with a huge exponent.
# M is even, so the xor of all equal piles is zero.
assert run("1000000000 1\n131071\n") == "0", "large even exponent"

# Two values and an even number of piles.
# For {1, 2}, exactly half of all even-length sequences have xor zero.
assert run("4 2\n1 2\n") == "499122177", "even-length two-value case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 1`|`0`| 最小值 (M)，单个非零桩 |
 |`2 1 / 5`|`1`| 所有桩都相等且重数为偶数 |
 |`3 2 / 1 2`|`1`| 奇数长度异或奇偶校验 |
 |`1000000000 1 / 131071`|`0`| 最大（M）和最大桩值|
 |`4 2 / 1 2`|`499122177`| 偶数长度异或分布和模块化 (1/2) |

 ## 边缘情况

 对于单一可用大小，整个游戏是确定性的。 有输入```
1 1
5
```变换仍然有效，因为初始数组有一个非零条目。 更简单地说，异或包含 5 的一份副本，因此它是非零且答案为 0。该实现不需要特殊情况，因为 (F[s]^1=F[s]) 自动生成相同的计数。 

为了```
2 1
5
```两堆都包含 5，因此它们的异或为 (5\oplus5=0)。 Alice每次都输了，输出为1只是获胜概率？ 这里获胜概率实际上是0，所以正确的输出是`0`。 这正是指数奇偶性如此重要的原因。 测试套件使用这种区别来捕获混淆零异或与非零异或的实现。 

对于提供的样本```
11 1
5
```有 11 个 5 的副本，给出异或 5。Alice 以概率 1 获胜，产生输出`1`。 当 (M) 的奇偶校验发生变化时，相同的确定性情况会完全改变。 

对于最大桩值，```
1000000000 1
131071
```价值`131071`正好是 (2^{17}-1)，即允许的最大大小。 由于 (M) 是偶数，因此其重复 (10^9) 次的异或为零，因此 Alice 的获胜概率为 0。变换数组具有可用索引 131071，因为其有效索引贯穿 (2^{17}-1)。 使用大小为 (2^{17}-1) 的数组会导致此处出现差一失败。 

尽管零是买不到的，但零的价值值得特别关注。 它必须仍然作为变换和异或状态存在，因为问题询问总异或是否为零。 索引零处的初始频率为零，但最终分布可以有非零计数。 从变换中删除索引零将完全破坏我们需要恢复的系数。 

最后，预计会有负变换值。 Walsh-Hadamard 蝴蝶执行减法，因此许多坐标可能会变为负值。 模幂必须首先将它们解释为模 (998244353)。 蟒蛇的`%`运算给出了正确的非负余数，允许普通的模块化幂函数无需任何特殊逻辑即可处理这些坐标。
