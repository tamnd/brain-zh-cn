---
title: "CF 102391F - 希尔伯特酒店"
description: "我们有编号为 (0,1,2,ldots) 的无限序列房间，并且每个房间始终只包含一位客人。 客人属于团体。 最初，每个房间都包含一位来自组 (0) 的客人。 类型 1 操作创建一个新组。"
date: "2026-08-11T23:03:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102391
codeforces_index: "F"
codeforces_contest_name: "XX Open Cup, Grand Prix of Korea"
rating: 0
weight: 102391
solve_time_s: 222
verified: true
draft: false
---

[CF 102391F - 希尔伯特酒店](https://codeforces.com/problemset/problem/102391/F)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 42s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有编号为 (0,1,2,\ldots) 的无限序列房间，并且每个房间始终仅包含一名客人。 客人属于团体。 最初，每个房间都包含一位来自组 (0) 的客人。 

类型 1 操作创建一个新组。 如果其参数是正整数（k），则每个现有客人向右移动（k）个房间，因此新组占用房间（0,1,\ldots,k-1）。 如果参数为（0），则每个现有客人从房间（x）移动到房间（2x），并且新组占据所有奇数房间。 

类型 2 查询询问特定组占用的第 (x) 个最小房间。 类型 3 查询询问哪个组当前占用特定房间。 

困难在于酒店是无限的，因此我们永远无法显式模拟房间数组。 操作数量也很大（300000），这排除了每个查询都遍历所有先前操作的情况。 由于 2 秒级的时间限制，(O(Q^2)) 模拟远远超出了可能的范围。 我们需要每个查询的大致对数工作量。 

有几种边界情况很容易导致错误的答案。 

首先，房间 (0) 在无限操作下表现不同。 它被映射到(0)，因此反复反转无限操作不会使空间(0)变小。 例如，```
3
1 0
1 0
3 0
```有输出```
2
```因为房间 (0) 仍然被最新的无限组占据。 假设每次无限操作将房间号减半的反向模拟可能会卡住或错误地跳过该组。 

其次，有限运算中的相等性很重要。 如果反向操作有参数(k)，则房间(x=k)属于旧的酒店状态，而不是新插入的组。 例如，```
3
1 5
3 5
3 4
```输出```
0
1
```因为组 (1) 占用房间 (0) 到 (4)，而房间 (5) 仍属于组 (0)。 使用 (x\leq k) 而不是 (x<k) 会错误地将房间 (5) 分配给组 (1)。 

第三，第 (x) 位客人是单索引的。 如果一个团体占用房间 (0,1,2)，则其第一位客人位于房间 (0)，而不是房间 (1)。 例如，```
2
1 3
2 1 1
```输出```
0
```因为组 (1) 的第一个房间是房间 (0)。 

## 方法

 直接的方法是维护每个客人当前的房间，并在每次类型1操作后更新所有房间。 这是不可能的，因为客人有无限多。 我们可以将注意力限制在有限的前缀上，但即使如此，单个操作也可能影响每个相关的房间，因此这仍然无法扩展。 通过 (300000) 次操作，二次方法可以轻松执行大约 (9\times10^{10}) 次更新。 

第一个关键观察结果是，应用于现有客人的每个操作都是仿射变换。 有限运算是

 [
 x\映射到 x+k,
 ]

 而无限操作是

 [
 x\映射到 2x。 
]

 这些操作的组合总是具有以下形式

 [
 F(x)=ax+b,
 ]

 其中 (a) 是 2 的幂。 这就对每一位老客人的动向进行了简洁的描述。 

假设当累积变换为

 [
 F_g(x)=a_gx+b_g。 
]

 它自己的房间在以后的运算之前就形成了一个等差数列。 对于有限群，这个级数是

 [
 0,1,\l点,k-1,
 ]

 所以它的第一项是 (0)，其差是 (1)。 对于无限群来说是

 [
 1,3,5,\l点,
 ]

 所以它的第一项是 (1)，其差是 (2)。 

如果当前累积变换是(F(x)=ax+b)，我们可以代数地撤消(F_g)，然后应用(F)。 从组的插入坐标到其当前房间的最终变换再次是仿射的。 由于 (a_g) 是 2 的幂，因此它是模 (10^9+7) 可逆的。 因此，在为每个组存储一些值后，可以在恒定时间内回答类型 2 查询。 

第二个关键观察处理类型 3 查询。 从被查询的房间开始向后进行。 具有参数 (k) 的有限运算具有相反的规则

 [
 x\geq k \右箭头 x\左箭头 x-k,
 ]

 而 (x<k) 表示该房间刚刚被该操作的新组占用。 

对于无限操作，奇数 (x) 表示该房间新被该无限组占用。 如果(x)是偶数，则老客人来自(x/2)房间。 

两个连续的无限运算之间的有限运算可以作为一个块来处理。 如果它们的参数是(k_1,k_2,\ldots,k_m)，则存储它们的前缀和。 向后遍历整个块只会减去

 [
 k_1+k_2+\cdots+k_m。 
]

 如果查询的 (x) 变得小于该总数，则只需要一次二分搜索即可找到捕获它的精确有限运算。 

跨越无限操作后，成功的反向步骤会将正 (x) 更改为 (x/2)。 因此，最多可以有 (O(\log x)) 个这样的步骤。 这是即使操作序列可以包含（300000）个事件，逆向过程也很快的关键原因。 

比较结果为：

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(Q^2)) 在最坏的情况下 | (O(Q)) 或更糟 | 太慢了|
 | 仿射表示 + 有限运算块 | (O(Q(\log Q+\log V))) | (O(Q)) | 已接受 |

 这里 (V\leq10^9) 是类型 3 查询中出现的房间号。 实际上，逆过程的对数因子最多约为 (30)，因为 (2^{30}>10^9)。 

## 算法演练

 1.用仿射函数表示所有操作对现有客人的影响

 [
 F(x)=ax+b。 
]

 最初（a=1，b=0）。 带参数 (k) 的有限运算将其更改为

 [
 a'=a,\qquad b'=b+k,
 ]

 而无限操作将其更改为

 [
 a'=2a，\qquad b'=2b。 
]

 对于类型 2 的答案，仅需要 (b) 和 (a) 模 (10^9+7)。 

1. 对于每个组，存储该组进入酒店后立即存在的仿射变换（F_g(x)=a_gx+b_g）。 还存储其初始算术级数的起点（s_g）和差值（d_g）。 

对于初始组 (0)，使用

 [
 s_0=0，\qquad d_0=1。 
]

 对于有限组使用

 [
 s_g=0,\qquad d_g=1。 
]

 供无限组使用

 [
 s_g=1,\qquad d_g=2。 
]

在插入时存储变换的原因是，所有后来的运动都可以通过从该历史状态到当前状态的变换来描述。 

1. 保持 (a) 模 (10^9+7) 的逆。 由于 (a) 始终是 2 的幂，因此它的倒数始终存在。 当无限运算将 (a) 乘以 (2) 时，请将其倒数乘以 (2^{-1})。 
2. 要回答组 (g) 的类型 2 查询，令

 [
 c=a\cdot a_g^{-1}\pmod M.
 ]

 (g)组的历史坐标与当前坐标之间的平移为

 [
 e=b-cb_g。 
]

 当前房间对应的历史坐标（y）为

 [
 赛+e。 
]

 (g)组的第(x)位客人有历史坐标

 [
 s_g+d_g(x-1)。 
]

 因此它当前的房间是

 [
 e+c(s_g+d_g(x-1))\pmod M.
 ]

 这在常数时间内给出了答案。 

1. 对于类型 3 查询，将所有有限类型 1 操作划分为由无限操作分隔的块。 第一个块包含第一个无限运算之前的有限运算。 后面的每个块都包含紧随一个无限操作之后的有限操作。 

对于每个块，存储其有限（k）值和相应组号的累积和。 

1、如果查询的房间为（0），则立即返回最近一次有限运算的组号，如果没有发生有限运算则返回（0）。 无限操作使空间 (0) 保持不变，因此只有有限插入才能替换其占用者。 
2. 否则，从最后一个有限块开始，反转其有限运算。 如果块的总和 (k) 大于 (x)，则负责的操作位于该块内。 对累积和使用二分查找来定位后缀和大于 (x) 的最后一个有限运算。 

如果总数最多为 (x)，则减去整个块总数并交叉前面的无限操作。 

1. 在无限操作中，奇数 (x) 属于新插入的组，因此返回其组号。 如果 (x) 是偶数，则将 (x) 替换为 (x/2) 并继续前面的块。 
2. 如果减去一个完整的有限块使得 (x=0)，则答案是该块之前的最新有限群。 无需遍历潜在的巨大连续无限操作序列，因为它们都留下空间 (0) 不变。 

### 为什么它有效

 类型 2 查询的不变量是每个组都由其原始算术级数以及组输入时处于活动状态的仿射变换来表示。 将逆历史变换与当前变换组合起来可以准确地描述该组的每个成员现在所在的位置，因此该公式返回正确的第 (x) 个房间。 

对于类型 3 查询，反转有限操作是精确的，因为房间 (0,\ldots,k-1) 正是新插入的房间，而其他所有房间都来自 (x-k)。 反转无限操作也是精确的，因为奇数房间正是新插入的房间，而每个偶数房间都来自 (x/2)。 对连续的有限运算进行分组不会改变这个逻辑，因为它们的相反效果只是以相反的顺序减去它们的参数。 每次无限运算与正房间号交叉时，房间号就会减半，因此只能对数次这样的交叉。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

MOD = 1_000_000_007
INV2 = (MOD + 1) // 2

def solve():
    q = int(input())

    # Current global affine transformation:
    # F(x) = A * x + B
    A = 1
    B = 0
    invA = 1

    # Information stored for every group.
    # Group 0 is the initial infinite set 0,1,2,...
    a_hist = [1]
    b_hist = [0]
    inv_hist = [1]
    start = [0]
    step = [1]

    # Blocks of finite operations.
    # blocks[b] contains cumulative sums of k in block b.
    blocks = [[]]

    # The corresponding group ids for the finite operations.
    block_groups = [[]]

    # For every block, the latest finite group strictly before it.
    prev_finite = [0]

    # Group ids of infinite operations.
    # Infinite operation corresponding to block b (b > 0)
    # is inf_groups[b - 1].
    inf_groups = []

    last_finite_group = 0

    # Number of type 1 operations processed.
    groups = 0

    out = []

    for _ in range(q):
        query = input().split()
        typ = int(query[0])

        if typ == 1:
            k = int(query[1])
            groups += 1
            gid = groups

            if k > 0:
                # All old rooms shift by k.
                B = (B + k) % MOD

                # The new group occupies 0,1,...,k-1.
                a_hist.append(A)
                b_hist.append(B)
                inv_hist.append(invA)
                start.append(0)
                step.append(1)

                if blocks[-1]:
                    cumulative = blocks[-1][-1] + k
                else:
                    cumulative = k

                blocks[-1].append(cumulative)
                block_groups[-1].append(gid)

                last_finite_group = gid

            else:
                # All old rooms double.
                A = (2 * A) % MOD
                B = (2 * B) % MOD
                invA = (invA * INV2) % MOD

                # The new group occupies 1,3,5,...
                a_hist.append(A)
                b_hist.append(B)
                inv_hist.append(invA)
                start.append(1)
                step.append(2)

                inf_groups.append(gid)

                # Start a new finite block.
                blocks.append([])
                block_groups.append([])
                prev_finite.append(last_finite_group)

        elif typ == 2:
            g = int(query[1])
            x = int(query[2])

            c = (A * inv_hist[g]) % MOD
            e = (B - c * b_hist[g]) % MOD

            first = (e + c * start[g]) % MOD
            diff = (c * step[g]) % MOD

            answer = (first + diff * (x - 1)) % MOD
            out.append(str(answer))

        else:
            x = int(query[1])

            # Infinite operations leave room 0 fixed.
            if x == 0:
                out.append(str(last_finite_group))
                continue

            block = len(blocks) - 1

            while True:
                cumulative = blocks[block]

                if cumulative:
                    total = cumulative[-1]

                    if x < total:
                        # Find the first prefix sum >= total - x.
                        # Its corresponding finite operation is exactly
                        # the one whose reverse interval contains x.
                        idx = bisect_left(cumulative, total - x)
                        out.append(str(block_groups[block][idx]))
                        break

                    x -= total

                    if x == 0:
                        # Everything in this block was reversed.
                        # Room 0 now belongs to the latest finite group
                        # before this block.
                        out.append(str(prev_finite[block]))
                        break

                if block == 0:
                    # We have reached the initial configuration.
                    out.append("0")
                    break

                # Cross the infinite operation before this block.
                infinite_group = inf_groups[block - 1]

                if x & 1:
                    # Odd rooms were newly occupied by this group.
                    out.append(str(infinite_group))
                    break

                # An even room came from x / 2.
                x //= 2
                block -= 1

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`A`,`B`， 和`invA`变量描述应用于最新类型 1 操作之前存在的每个来宾的当前仿射变换。 有限操作仅改变`B`，而无限运算使两者加倍`A`和`B`。 

四个历史数组存储在插入时属于每个组的变换和算术级数。 初始组在概念上是在零时间插入的，这就是为什么它的存储值为 (A=1,B=0,s=0,d=1)。 

类型 2 公式使用当前乘数与组插入时乘数之间的比率。 由于每个乘数都是 2 的幂，因此模除法是安全的。 逆乘数被显式更新，避免了每个查询的昂贵的模幂运算。 

对于类型 3 查询，`blocks`存储累积和而不是原始 (k) 值。 假设一个块包含(k_1,k_2,k_3)，累积和为(k_1,k_1+k_2,k_1+k_2+k_3)。 如果当前房间小于总房间，`bisect_left`发现第一个前缀和达到`total - x`。 该索引标识新插入的区间包含反转空间的有限运算。 

严格比较`x < total`以及使用`total - x`两者都是边界敏感的。 什么时候`x == total`，块中的每个有限操作都已被反转，我们必须跨越前面的无限操作。 

Python 整数具有任意精度，因此有限 (k) 值的累积和不会溢出。 用于类型 2 答案的值按模 (10^9+7) 减少，而块和仍保持精确整数，因为它们用于与 (x) 进行比较。 

## 工作示例

 语句中只有一个示例，因此下面的第二个跟踪使用了一个小的自定义序列。 

### 示例 1

 每个类型1操作之后的状态可以通过当前的仿射变换和新创建的组来概括。 

| 查询 | 1 型状态 | (一) | （二）| 新组|
 | ---| ---| ---| ---| ---|
 |`3 0`| 没有操作 | 1 | 0 | 无 |
 |`1 3`| 移动 3 | 1 | 3 | 1 |
 |`2 1 2`| 不变| 1 | 3 | 查询组 1 |
 |`1 0`| 双| 2 | 6 | 2 |
 |`3 10`| 不变| 2 | 6 | 反向查询 |
 |`2 2 5`| 不变| 2 | 6 | 查询组 2 |
 |`1 5`| 移动 5 | 2 | 11 | 11 3 |
 |`1 0`| 双| 4 | 22 | 22 4 |
 |`3 5`| 不变| 4 | 22 | 22 反向查询 |
 |`2 3 3`| 不变| 4 | 22 | 22 查询组 3 |

 为了`2 1 2`，组 1 插入为 (A_g=1,B_g=3)，而当前的变换是相同的。 它的历史级数是(0,1,2)，所以第二个房间是(1)。 

在第一个无限操作之后，第 2 组从奇数房间开始。 此时，组 2 的房间为 (1,3,5,7,9,\ldots)，因此其第五个房间为 (9)。 

查询`3 10`反转无限运算，因为 (10) 是偶数，产生 (5)。 没有先前的无限运算，因此继续通过（3）的有限移位，产生（2），最后到达初始组。 因此房间 (10) 属于组 (0)。 

经过最后两次操作后，组 4 占用了奇数个房间，因此房间 (5) 属于组 (4)。 最终的类型 2 查询请求组 3 的第三个房间，在后面的无限操作之后，该房间已成为奇数级数 (1,3,5,\ldots)，在适当的历史变换后给出 (4) 作为输出。 

完整的输出是```
0
1
0
9
4
4
```### 自定义跟踪

 考虑：```
8
1 1
1 2
1 0
1 0
3 1
3 2
3 6
2 3 3
```重要的状态是：

 | 查询 | 当前行动| 房间被逆转| 块| 结果 |
 | ---| ---| ---| ---| ---|
 |`1 1`| 第 1 组进入 | | 有限块 0 | |
 |`1 2`| 第 2 组进入 | | 有限块 0 | |
 |`1 0`| 第 3 组进入 | | 新区块 1 | |
 |`1 0`| 第 4 组进入 | | 新区块 2 | |
 |`3 1`| 奇数至迟无穷 | 1 | 区块 2 | 第 4 组 |
 |`3 2`| 偶数，除以 2 | 2 → 1 | 区块 1 | 第 3 组 |
 |`3 6`| 偶数，除以 2 | 6 → 3 | 区块 1 | 第 3 组 |
 |`2 3 3`| 等差数列查询| | 第 3 组 | 10号房间|

 第 3 组是由第一个无限操作创建的，因此它的房间最初是 (1,3,5,\ldots)。 第二个无限运算将它们加倍为 (2,6,10,\ldots)。 因此，房间 (2) 和 (6) 都属于组 3。 

组 4 是最新的无限组并占据所有奇数房间，因此房间 (1) 立即标识组 4。类型 2 查询要求组 3 的第三个房间，即 (10)。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(Q(\log Q+\log V))) | 类型 1 和类型 2 操作均为 (O(1))； 类型 3 查询最多跨越 (O(\log V)) 无限次操作并最多执行一次 (O(\log Q)) 二分搜索。 |
 | 空间| (O(Q)) | 历史组数据和有限操作块数据每个类型 1 操作最多包含一个条目。 |

 类型 3 查询中的最大房间值为 (10^9)，因此最多可以成功进行 (30) 次减半。 操作总数为 (300000)，因此线性存储界限很容易在 1024 MB 内存限制内。 该算法避免构造任何无限的房间集，并且每个查询仅执行对数工作。 

## 测试用例

 下面的测试工具假设上面的解决方案保存为`solution.py`，与`solve()`功能不变。```python
# Save the solution as solution.py before running this file.
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solution.solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
sample1 = """\
10
3 0
1 3
2 1 2
1 0
3 10
2 2 5
1 5
1 0
3 5
2 3 3
"""

assert run(sample1) == """\
0
1
0
9
4
4\
""", "sample 1"

# Custom 1: minimum-size input
assert run("""\
1
3 0
""") == "0\n", "initial group"

# Custom 2: finite block, equality and x-th indexing
assert run("""\
5
1 2
1 3
3 0
3 4
2 1 2
""") == """\
2
1
4
""", "finite operations and boundaries"

# Custom 3: consecutive infinite operations
assert run("""\
8
1 1
1 2
1 0
1 0
3 1
3 2
3 6
2 3 3
""") == """\
4
3
3
10\
""", "repeated infinite operations"

# Custom 4: all-equal finite values and one-indexed query
assert run("""\
4
1 7
1 7
1 7
2 1 7
""") == "20\n", "repeated equal k values"

# Custom 5: maximum-size stress case
q = 300000
maximum_input = str(q) + "\n" + ("1 1\n" * (q - 1)) + "3 0\n"

assert run(maximum_input) == f"{q - 1}\n", "maximum number of queries"
```自定义案例验证以下属性：

 | 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 3 0`|`0`| 初始组和最小有效输入 |
 | 两个有限运算后跟类型 3 和类型 2 |`2, 1, 4`| 有限反向块、精确边界处理和单索引 (x) |
 | 两个连续的无限操作 |`4, 3, 3, 10`| 重复减半、奇数房间检测和无限群算术级数 |
 | 三个相同`k=7`运营|`20`| 重复移位和累积有限和|
 | (299999) 份`1 1`其次是`3 0`|`299999`| 最大查询数和房间 (0) 处理 |

 ## 边缘情况

 对于房间 (0)，算法立即返回`last_finite_group`。 考虑```
4
1 5
1 0
1 0
3 0
```两个无限操作将 room (0) 保持为 room (0)。 初始状态之后唯一的有限插入是组(1)，所以答案是`1`。 该算法从不执行潜在无限的零减半序列。 

对于精确的有限边界，考虑```
3
1 5
3 5
3 4
```有限插入占用房间 (0,1,2,3,4)。 反转房间 (5) 使用条件 (x\geq5)，给出前任房间 (0)，因此房间 (5) 属于组 (0)。 反转房间 (4) 反而会发现 (x<5)，因此返回组 (1)。 输出是`0`其次是`1`。 

对于连续的无限操作，考虑```
4
1 0
1 0
3 2
```第一个无限群最初占据 (1,3,5,\ldots)。 第二个无限操作将这些访客移动到 (2,6,10,\ldots)。 反转房间（2），首先看到一个偶数房间，将其除以二，得到（1）。 前面的无限操作然后看到一个奇数房间，所以答案是组（1）。 

对于有限块，考虑参数 (3,5)。 如果当前房间是（4），则用（k=5）反转最新操作立即发现（4<5），因此第二个有限组拥有该房间。 如果当前房间是(5)，则反转先减去(5)，达到(0)，然后继续前面的状态。 执行中的严格不平等正是这两种情况的区别所在。 

对于类型 2 索引，使用 (k=3) 创建的有限群从 (0) 开始，差值 (1)。 它的房间是 (0,1,2)，因此 (x=1) 的答案是 (0)，(x=3) 的答案是 (2)。 该公式使用 (x-1)，防止常见的相差一错误。 

最后，只有类型 2 的答案才需要模运算。 实际的有限块总和不会按模 (10^9+7) 减少，因为它们是在反向模拟期间与真实房间号进行比较的。 一旦累积位移超过模数，混合这两个角色将产生不正确的类型 3 答案。
