---
title: "CF 102309G - Orz 熊猫游戏"
description: "我们有n个房间，从左到右排列。 每个房间都包含一堆石头，分组输入记录 (p, q, c) 意味着房间 q 包含 c 个不同的石堆，其大小为 p。 查询给出一个区间 [l, r]。"
date: "2026-08-13T06:59:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102309
codeforces_index: "G"
codeforces_contest_name: "The 2019 \u201cOrz Panda\u201d Cup Programming Contest"
rating: 0
weight: 102309
solve_time_s: 789
verified: true
draft: false
---

[CF 102309G - Orz 熊猫游戏](https://codeforces.com/problemset/problem/102309/G)

 **评级：** -
 **标签：** -
 **求解时间：** 13m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`房间从左到右排列。 每个房间都包含成堆的石头和分组的输入记录`(p, q, c)`意思是那个房间`q`包含`c`不同的桩，其大小为`p`。 查询给出一个区间`[l, r]`。 在此区间内的每个房间中，qkoqhh 可以不选择任何一堆，也可以选择该房间中的一堆。 

还有一堆额外的尺寸`x`，在游戏开始前创建。 做出所有选择后，选定的桩与额外的桩一起形成 Nim 位置。 当所有堆大小的异或非零时，第一个玩家获胜，因此当所选房间堆的异或为非零时，qkoqhh 获胜。`x`。 查询的答案是做出这些选择的不同方法的数量，以模数计算`10007`。 

多样性很重要。 如果一个房间包含三堆不同大小的堆`5`，选择一堆尺寸`5`给出了三种不同的选择。 一个房间包含`c`大小为零的堆贡献`c`除了选择不选择任何内容之外，还有不同的方法可以保持异或不变。 

这些限制使得结构非常具体。 只有`n <= 500`房间，以及每堆尺寸和`x`至多是`500`，因此每个堆大小都适合 9 位异或状态。 因此只有`2^9 = 512`可能的异或值。 另一方面，`m`可以是`10000`，并且单个记录可以描述`10000`物理桩，因此显式扩展所有桩可以创建最多`10^8`对象。 该算法必须聚合相等的堆大小，而不是迭代各个堆。 

可以有多达`n(n+1)/2 = 125250`查询。 一个方法，花费`O(n)`每个查询的或更多工作已经约为数千万次操作，因此较小的固定异或维度`512`必须被利用。 有用的目标大致是`O((n+Q) * 512)`预处理后。 

对选择进行直接暴力是完全没有希望的。 即使每个堆中只有一个非零堆`500`房间，有`2^500`可能的选择，大约`3.27 * 10^150`。 如果每个选择都扫描所有房间，那就是`500 * 2^500`房间决定。 

一些边缘情况可能会悄悄破坏更简单的实现。 首先，零大小的堆不会改变异或值，但是选择不同的零大小的堆仍然会给出不同的选择。 例如，与`n=1`,`x=0`，以及房间里的一堆零大小的东西`1`，查询`[1,1]`有答案`2`：什么都不选择或选择零堆。 忽略零大小堆的实现将返回`1`。 

其次，重复的大小必须保留其多样性。 为了`n=1`,`x=1`，以及两个不同大小的堆`1`在房间里`1`，查询`[1,1]`有答案`2`，因为任一物理堆都会产生异或`1`。 将这两堆视为一个值将返回`1`。 

第三，不能盲目地对前缀产品进行模块化划分。 转换后的房间值可以是`0`模数`10007`。 如果这样的房间位于查询区间内，则相应的变换区间乘积为零。 将两个零前缀乘积相除会丢失此信息，并可能产生不正确的非零值。 最佳解决方案明确记录每个变换坐标的最后一个零因子。 

## 方法

 蛮力解决方案将枚举每个合法的桩选择，计算所选桩的异或，然后将其异或`x`，并计算最终异或为零的选择。 这是正确的，因为 Nim 恰好在其堆异或为零时丢失。 问题是选择的数量。 即使是每个房间一堆的小得多的情况也已经产生了`2^500`选择，实际输入最多可以包含`10^8`通过多重性进行物理堆积。 

一个自然的动态规划改进是保持`dp[s]`, 获得异或的方式数`s`处理完一些房间后。 对于堆有尺寸的房间`p`具有多重性`c[p]`，过渡是`new[s] = dp[s] + sum(c[p] * dp[s xor p])`。 

这是正确的，并且已经消除了对物理桩数量的依赖。 然而，进行这种转变直接花费`O(512 * number_of_distinct_sizes)`每个房间。 更重要的是，独立回答每个间隔仍然需要处理该间隔内的所有房间。 

关键的观察结果是转换是异或卷积。 定义房间向量`f`通过设置`f[0]`到`1`不选择任何内容，然后将每个桩大小的重数添加到其相应的位置。 区间DP正是区间内所有房间向量的异或卷积。 

Walsh-Hadamard 变换使 XOR 卷积对角化。 变换向量后，异或卷积就变成了普通的逐点乘法。 这与快速 Walsh-Hadamard 变换常用于 XOR 卷积的原因相同。 

对于变换后的坐标`k`， 让`a_q[k]`是房间的变换值`q`。 区间的变换值`[l,r]`简直就是`a_l[k] * a_{l+1}[k] * ... * a_r[k]`。 

现在区间问题已经变成了一个区间乘积问题`512`独立的标量序列。 

前缀积通常可以让我们通过除法获得范围积。 有一个复杂的情况：一个因子可以为零模`10007`。 我们通过为每个变换后的坐标维护两条信息来解决这个问题。 第一个是迄今为止看到的所有非零因子的乘积。 第二个是最新的零因子的位置。 如果最新的零位于里面`[l,r]`，区间积为零。 否则，区间乘积是两个非零前缀乘积的商。 

最后，逆 Walsh-Hadamard 变换给出每个异或值的选择数。 我们只需要对应的系数`x`，因此我们可以直接使用逆变换公式计算该系数，而不用将整个区间变换回来。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(n * 2^n)`即使每个房间一堆|`O(n)`| 太慢了|
 | 每个间隔的直接异或 DP |`O(Q * n * 512)`|`O(512)`| 太慢了|
 | 最佳、WHT + 系列产品 |`O(n * 512 * log 512 + (n + Q) * 512)`|`O(n * 512)`| 已接受 |

 ## 算法演练

 1. 每个房间`q`,建立一个数组`f_q`长度`512`。 位置`0`从价值开始`1`，代表不选择任何内容的选择。 对于每个输入记录`(p,q,c)`， 添加`c`到`f_q[p]`。 如果`p=0`， 这意味着`f_q[0]`变成`1+c`，因为选择任何一个零堆都会使异或保持不变，但会给出不同的选择。 
2. 对每个房间向量应用 Walsh-Hadamard 变换。 变换后的向量`A_q`有`512`坐标。 在坐标处`k`它代表`A_q[k] = sum_v f_q[v] * (-1)^{popcount(k & v)}`。 

选择这种变换的原因是房间选择分布之间的异或卷积变成了普通的坐标乘法。 
3.对于每个变换后的坐标`k`，从左到右扫描房间并构建仅包含非零因子的前缀积。 让`pref[k][i]`是...的产物`A_1[k] ... A_i[k]`跳过每个等于零的因素后。 还存储`last_zero[k][i]`, 最多最大的房间索引`i`在哪里`A_q[k]`为零。 
4. 查询`[l,r]`和固定坐标`k`,首先检查`last_zero[k][r]`。 如果至少是`l`，则区间内的一个因子为零，因此变换后的区间乘积为零。 否则区间中的每个因子都不为零，其乘积为`pref[k][r] / pref[k][l-1]`。 

由于模数`10007`是素数，每个非零余数都有一个模逆。 该实现预先计算每个非零余数的逆一次，因此每个范围乘积都是在恒定时间内获得的。 
5. Walsh-Hadamard 逆变换有一个特别方便的公式。 如果`P[k]`是变换后的区间积，则异或为的选择数`x`是`answer = inv(512) * sum_k P[k] * (-1)^{popcount(k & x)}`。 

为每个预先计算这个符号`k`，然后评估每个查询的公式。 
6. 使用相同的转换后的前缀数据处理所有查询。 无需为每个间隔重建异或 DP。 每个查询执行`512`独立的标量范围乘积查找和最终的模块化缩减。 

为什么它有效

 对于每个房间来说，`f_q[v]`正是使房间贡献异或的方法的数量`v`。 组合两个房间意味着从每个房间中选择一个贡献，因此它们的结果分布是它们向量的异或卷积。 Walsh-Hadamard 变换将此卷积转换为坐标乘法，因此间隔的变换向量正是其房间变换的乘积。 

前缀结构为每个坐标正确返回该乘积。 如果间隔内出现零因子，则存储的最后零位置会检测到它并返回零。 如果没有出现零，则两个前缀乘积均非零，因此它们的商正是所需的区间乘积模`10007`。 

然后，逆 Walsh-Hadamard 公式提取异或系数`x`。 该系数精确计算其所选桩异或的选择`x`，这意味着它们与初始堆一起异或`x`为零。 这样的 Nim 位置对于第一个玩家来说是失败的，因此每一次计算的选择都恰好是 qkoqhh 的获胜选择。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10007
S = 512
INV_S = pow(S, MOD - 2, MOD)

# Modular inverses of every nonzero residue modulo MOD.
INV = [0] * MOD
INV[1] = 1
for i in range(2, MOD):
    INV[i] = MOD - (MOD // i) * INV[MOD % i] % MOD

def fwht(a):
    """Walsh-Hadamard transform for XOR convolution."""
    h = 1
    while h < S:
        step = h << 1
        for base in range(0, S, step):
            end = base + h
            j = base
            while j < end:
                u = a[j]
                v = a[j + h]

                x = u + v
                if x >= MOD:
                    x -= MOD

                y = u - v
                if y < 0:
                    y += MOD

                a[j] = x
                a[j + h] = y
                j += 1
        h <<= 1

def solve():
    out = []

    while True:
        line = input()
        if not line:
            break
        if not line.strip():
            continue

        n, x = map(int, line.split())

        m = int(input())

        rooms = [[0] * S for _ in range(n)]

        for _ in range(m):
            p, q, c = map(int, input().split())
            rooms[q - 1][p] = (rooms[q - 1][p] + c) % MOD

        # Choosing nothing is always one possibility.
        for q in range(n):
            rooms[q][0] = (rooms[q][0] + 1) % MOD

        # Transform every room.
        for q in range(n):
            fwht(rooms[q])

        # pref[k][i] = product of all nonzero transformed factors
        # among rooms 1..i at coordinate k.
        pref = [[1] * (n + 1) for _ in range(S)]

        # last_zero[k][i] = latest room <= i whose transformed
        # value at coordinate k is zero.
        last_zero = [[0] * (n + 1) for _ in range(S)]

        for k in range(S):
            p = 1
            z = 0

            prow = pref[k]
            zrow = last_zero[k]

            for i in range(1, n + 1):
                value = rooms[i - 1][k]

                if value == 0:
                    z = i
                else:
                    p = (p * value) % MOD

                prow[i] = p
                zrow[i] = z

        qn = int(input())
        queries = []

        for _ in range(qn):
            l, r = map(int, input().split())
            queries.append((l, r))

        # The inverse transform coefficient for xor x uses
        # the character (-1)^(popcount(k & x)).
        signs = [1] * S
        for k in range(S):
            if (k & x).bit_count() & 1:
                signs[k] = -1

        answers = [0] * qn

        # Process one transformed coordinate at a time.
        # This keeps the prefix rows local and avoids repeated
        # two-dimensional indexing in the hottest loop.
        for k in range(S):
            prow = pref[k]
            zrow = last_zero[k]
            sign = signs[k]

            for qi, (l, r) in enumerate(queries):
                if zrow[r] >= l:
                    continue

                # Both prefix values are nonzero, so division is valid.
                value = prow[r] * INV[prow[l - 1]]

                if sign == 1:
                    answers[qi] += value
                else:
                    answers[qi] -= value

        for value in answers:
            value %= MOD
            value = value * INV_S % MOD
            out.append(str(value))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入首先直接聚合到`rooms[q][p]`，因此该实现永远不会扩展潜在的大量物理桩。 额外的`1`添加到位置零表示从该房间中不选择任何内容。 

Walsh-Hadamard 变换使用标准蝶形运算`u+v`和`u-v`。 值按模减少`10007`在每个蝴蝶之后，这使得每个存储的系数都很小。 变换长度正好是`512`因为所有桩尺寸都低于`512`。 

前缀构造故意忽略零变换因子，而不是将它们乘以前缀。 这就是后来分裂成为可能的原因。`last_zero`携带区分包含零因子的区间和其非零乘积恰好具有相同前缀值的区间所需的缺失信息。 

逆表`INV`避免为每个查询和频率调用模幂。 由于前缀积永远不会为零，`INV[prow[l - 1]]`始终有效。 表达式`prow[r] * INV[prow[l - 1]]`保留为普通的 Python 整数，直到最终的查询减少。 这消除了最热循环中昂贵的模运算。 

查询循环在转换后的坐标上运行，而不是为每个查询重建数组。 符号由共享位的奇偶校验确定`k`和`x`，与异或值的逆 Walsh-Hadamard 字符完全匹配`x`。 

Python 中不存在整数溢出问题。 在固定宽度语言中，这里的中间积也很小，因为两个操作数都在下面`10007`，但 Python 自然会处理累积的较大临时金额`512`坐标。 

## 工作示例

 ### 示例 1

 输入描述了三个房间`x=1`。 房间 1 包含两堆不同大小的堆`1`。 2 号和 3 号房间各包含一堆尺寸`2`。 

对于房间 1，选择分布为`f=[1,2]`关于异或值`0`和`1`。 对于2号房间来说是`f=[1,0,1]`，房间 3 具有相同的分布。 

下表显示了相关低 xor 值的等效 xor DP 状态。 这与 Walsh-Hadamard 逆变换表示的状态相同，但更容易直接检查。 

| 处理过的房间|`dp[0]`|`dp[1]`|`dp[2]`|`dp[3]`|
 | ---| ---| ---| ---| ---|
 | 无 | 1 | 0 | 0 | 0 |
 | 房间 1 | 1 | 2 | 0 | 0 |
 | 房间 1..2 | 1 | 2 | 1 | 2 |
 | 房间 1..3 | 2 | 4 | 2 | 4 |

 供查询`[1,1]`，所需的异或是`x=1`，所以答案是`dp[1]=2`。 为了`[1,2]`，仍然是`2`。 为了`[1,3]`，就变成`4`。 因此输出是`2, 2, 4`。 

第三个查询演示了为什么不同房间的不同选择通过异或组合。 获得异或`1`，qkoqhh 选择房间 1 中的两个 size-1 堆之一，而房间 2 和 3 必须要么都被跳过，要么都贡献其 size-2 堆。 这给出了`2 * 2 = 4`选择。 

### 示例 2

 这里`x=0`。 房间 1 包含两堆不同大小的堆`1`，而房间 2 包含两堆大小不同的堆`2`。 查询涵盖两个房间。 

| 处理过的房间|`dp[0]`|`dp[1]`|`dp[2]`|`dp[3]`|
 | ---| ---| ---| ---| ---|
 | 无 | 1 | 0 | 0 | 0 |
 | 房间 1 | 1 | 2 | 0 | 0 |
 | 房间 1..2 | 1 | 2 | 2 | 4 |

 答案是异或的系数`x=0`，即`dp[0]=1`。 唯一获胜的选择就是什么都不选择。 选择一个 size-1 堆给出异或`1`，选择一个 size-2 堆给出异或`2`，并从两个房间中选择一个给出异或`3`。 

这个例子也证实了多重性的计算是正确的。 价值观`2`在`dp[1]`和`dp[2]`来自相应房间中两个不同的物理堆。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n * 512 * log 512 + (n + Q) * 512 + m)`| 每个房间都会变换一次，为所有 512 个坐标构建前缀，并且每个查询都会检查 512 个坐标 |
 | 空间|`O(n * 512 + Q)`| 房间变换、前缀产品、零位置和存储查询 |

 和`n <= 500`和`Q <= 125250`，查询阶段最多执行大约`64`万个简单的坐标操作。 异或维数固定为`512`，而房间变换只需要`9`蝴蝶层。 该算法还避免存储物理堆，这是必要的，因为多重性可以代表比`m`建议。 

官方问题页面给出了相同的`n <= 500`,`m <= 10000`， 和`Q <= n(n+1)/2`界限。 

## 测试用例

 以下线束假设`solve()`上述解决方案中的函数可从名为的文件中获得`solution.py`。```python
import sys
import io

from solution import solve

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
sample = """\
3 1
3
1 1 2
2 2 1
2 3 1
3
1 1
1 2
1 3
3 0
3
1 1 1
1 1 1
2 2 2
1
1 3
"""

assert run(sample) == "2\n2\n4\n1", "provided samples"

# Minimum-size input, nonzero pile.
assert run("""\
1 1
1
1 1 1
1
1 1
""") == "1", "minimum-size nonzero case"

# Zero-sized pile must count as a separate choice.
assert run("""\
1 0
1
0 1 1
1
1 1
""") == "2", "zero pile multiplicity"

# Duplicate piles in one room are distinct choices.
assert run("""\
1 1
1
1 1 2
1
1 1
""") == "2", "duplicate physical piles"

# Boundary intervals and xor values.
assert run("""\
3 3
3
1 1 1
2 2 1
4 3 1
3
1 2
2 3
1 3
""") == "1\n0\n1", "interval boundaries"

# Maximum n, with a large multiplicity.
assert run("""\
500 0
1
0 500 10000
1
1 500
""") == "10001", "maximum room count"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`, 一件尺寸-1 堆 |`1`| 最小输入和基本 Nim 异或条件 |
 |`1 0`, 一件尺寸-0 堆 |`2`| 选择零堆与不选择任何东西不同|
 |`1 1`, 两堆 1 号 |`2`| 相同的桩尺寸仍然是不同的选择
 | 三房大小`1,2,4`|`1, 0, 1`| 左右区间边界|
 |`n=500`、万零桩|`10001`| 大的`n`、大量重数和模安全聚合 |

 ## 边缘情况

 初始化向量时，将处理包含零大小桩的房间。 假设输入是```
1 0
1
0 1 1
1
1 1
```房间 1 最初有空选择，为异或零贡献一种方式。 单个零大小的堆添加了另一种异或零的方法，所以`f[0]=2`。 每个变换后的坐标都乘以`2`。 最终的异或零系数为`2`，这正是选择的数量。 一个粗心的实施始于`f[0]=1`但丢弃记录`p=0`会错误地产生`1`。 

重复的堆通过添加到相同的堆中来处理`f[p]`入口。 为了```
1 1
1
1 1 2
1
1 1
```房间向量有`f[0]=1`和`f[1]=2`。 共有三种合法房间选择：不选择任何内容、选择第一个 size-1 堆、或选择第二个 size-1 堆。 只有最后两个给出异或`1`，所以答案是`2`。 该算法永远不需要区分变换后的向量内的两个堆，因为它们的重数已经由系数表示`2`。 

区间边界情况是```
3 3
3
1 1 1
2 2 1
4 3 1
3
1 2
2 3
1 3
```为了`[1,2]`，可用的非零值是`1`和`2`，它们可能的异或是`0,1,2,3`, 所以异或`3`通过选择两堆来发生一次。 答案是`1`。 为了`[2,3]`，可能的异或是`0,2,4,6`, 所以异或`3`永远不会发生，答案是`0`。 为了`[1,3]`，选择 size-1 和 size-2 堆给出异或`3`，而尺寸 4 的桩不能是另一个组合的一部分`3`，所以答案又是`1`。 前缀索引使用`pref[l-1]`，这正是防止左端点被意外排除或包含两次的原因。 

零变换因子情况的处理与堆大小无关。 对于某些频率`k`，假设一段时间内变换后的房间值是`5,0,7`。 正确的变换产物为零。 前缀结构将非零因子的乘积存储为`35`并记录零的位置。 覆盖零的查询`last_zero[k][r] >= l`并立即贡献为零。 在该零之后开始的查询在其间隔内看不到零，并且可以安全地划分非零前缀乘积。 这就是该实现不简单地使用普通前缀划分的原因。 

最后，额外的初始堆不被视为另一个房间。 它的唯一作用是将目标异或从`0`到`x`。 当一组选定的房间堆的异或等于时，qkoqhh 就会获胜`x`，因为那么包括初始堆在内的总异或是`x xor x = 0`。 这就是为什么最终的逆变换提取使用坐标`x`而不是协调`0`。
