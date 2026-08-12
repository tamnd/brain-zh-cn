---
title: "CF 102411J - 只是最后一个数字"
description: "这座山可以看作是一个有向无环图，其顶点是点 (1,ldots,n)。 每条路径都从较小的索引到较大的索引，因此顶点编号本身给出了拓扑顺序。"
date: "2026-08-12T00:21:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102411
codeforces_index: "J"
codeforces_contest_name: "ICPC 2019-2020 North-Western Russia Regional Contest"
rating: 0
weight: 102411
solve_time_s: 174
verified: true
draft: false
---

[CF 102411J - 只是最后一个数字](https://codeforces.com/problemset/problem/102411/J)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这座山可以看作是一个有向无环图，其顶点是点 (1,\ldots,n)。 每条路径都从较小的索引到较大的索引，因此顶点编号本身给出了拓扑顺序。 

对于每对 (i<j)，输入仅给出从 (i) 到 (j) 的有向路径数量的最后一位十进制数字。 路径（i\to j）本身就是一条路径，而更长的路径是通过中间顶点获得的。 任务是恢复是否存在每个可能的有向边。 

有用的区别在于直接从 (i) 到 (j) 的路径和首先访问某个中间顶点 (k) 的路径。 如果我们已经知道 (i<k<j) 的所有边 (i\to k)，则从 (i) 到 (j) 的间接路径数为

 [
 \sum_{i<k<j} E_{i,k}P_{k,j},
 ]

 其中 (E_{i,k}) 是 (0) 或 (1)，(P_{k,j}) 是从 (k) 到 (j) 的路径总数。 我们只知道 (P_{k,j}) 模 (10)，但这就足够了，因为最终答案也仅取决于模 (10) 的值。 

界限（n\le 500）足够大，以至于枚举所有可能的路径是完全不可能的。 即使是检查每个三元组 ((i,k,j)) 的更好的动态递归也能执行

 [
 \frac{n(n-1)(n-2)}6
 ]

 内部迭代，当 (n=500) 时，约为 (20.7) 万次。 这在优化的 C++ 中是合理的，但执行数百万个嵌套解释操作的 Python 实现可能会不必要地接近时间限制。 我们将使用仅十位数字的固定十进制字母表将昂贵的部分减少到大约 (10\binom n2) 位运算。 

有几种边缘情况可能会悄悄地破坏简单的实现。 第一个是相邻对。 对于 (j=i+1)，没有中间顶点，因此间接路径和恰好为零。 例如，```
2
01
00
```从顶点 (1) 到顶点 (2) 有一条路径，所以答案是```
01
00
```意外访问无效中间索引的实现可能会在此失败。 

第二种边缘情况是模块化环绕。 最后一位数字为零并不一定意味着没有直接边缘。 可以有 9 条间接路径和 1 条直接路径，总共有 10 条路径。 例如，以下有效图具有直接边 (1\to6)，但从 (1) 到 (6) 正好有 10 条路径：```
6
012350
001124
000112
000001
000001
000000
```它的正确输出是```
011111
001011
000100
000011
000001
000000
```输入在位置 ((1,6)) 处包含零，但存在边 (1\to6)。 将输入零解释为“无边缘”而不考虑九个间接路径的解决方案会出错。 

第三种边缘情况是输入矩阵包含路径计数，而不是邻接信息。 例如，如果 (i\to k) 存在，并且有两条从 (k) 到 (j) 的路径，则这两条路径必须对从 (i) 到 (j) 的间接计数做出贡献。 使用原始输入数字就好像它直接表示 (E_{i,k}) 会混合两个不同的量。 

## 方法

 直接暴力法完全遵循路径分解。 以增加的距离处理对 ((i,j))。 对于每一对，枚举每个中间值 (k)，添加 (E_{i,k}P_{k,j})，并将结果与​​给定的最后一位数字进行比较。 由于所有具有 (k<j) 的 (E_{i,k}) 都已被恢复，因此这是正确的。 

更准确地说，如果 (S) 是从 (i) 到 (j) 的间接路径的数量，则

 [
 P_{i,j}\equiv S+E_{i,j}\pmod {10}。 
]

 由于 (E_{i,j}) 只能为零或一，因此边缘恰好存在于

 [
 (S+1)\bmod 10=P_{i,j}。 
]

 最里面的迭代次数是

 \frac{n(n-1)(n-2)}6。 
]

 在 (n=500) 处，即 (20,708,500) 次迭代。 递推式在数学上很简单，并且是问题的标准可接受的三次公式。 

暴力递归之所以有效，是因为该图是 DAG。 一旦处理完所有较短的间隔，每个可能的第一个中间顶点 (k) 都有一个已重建的边 (i\to k)，而路径计数 (P_{k,j}) 已存在于输入中。 

Python 的问题不在于数学，而在于执行数千万个嵌套操作的成本。 使计算成本大大降低的观察结果是，每个 (P_{k,j}) 都是仅有的十位数字之一。 对于固定的目的地 (j) 和数字 (d)，我们可以存储一个恰好包含 (P_{k,j}=d) 的顶点 (k) 的位集。 

对于固定源 (i)，维护另一个包含已重构的传出边缘 (i\to k) 的位集。 那么满足这两个条件的中间顶点的数量只是一个位交集，然后是`bit_count()`。 

如果`edges`包含已知顶点 (k) (E_{i,k}=1)，并且`mask[j][d]`包含到 (j) 的路径计数位数等于 (d) 的顶点，则

 \sum_{d=0}^{9}
 d\c点
 \operatorname{popcount}
 \左(
 \text{边}\mathbin{&}\text{掩码}[j][d]
 \右）。 
]

 Python 整数在优化的本机代码中实现任意长度的位集，因此这些交集和总体计数比显式循环每个 (k) 便宜得多。 

关键的结构事实是，在从左到右处理 (j) 时，`edges`仅包含小于 (j) 的顶点。 因此，无需显式屏蔽范围 (i<k<j)。 重建的顺序自动提供了该限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n^3)) | (O(n^2)) | 数学上正确，但 Python 速度过慢 |
 | 按数字位设置 | (O(10n^2)) | (O(10n^2)) | 已接受 |

 ## 算法演练

 1. 读取矩阵最后一位数字并保持不变。 它代表 (P_{i,j}\bmod 10)，而不是图本身，因此每当我们决定新边时它都必须保持可用。 
2. 为每个目的地 (j) 构建十个位掩码。 位置 (k) 处的位设置为`mask[j][d]`恰好当输入表明从 (k) 到 (j) 的路径数以数字 (d) 结尾时。 只需要存储(k<j)。 
3. 创建一个最初为空的邻接矩阵并从左到右处理源顶点 (i)。 对于每个固定 (i)，维护一个整数`edge_mask`。 当我们已经建立了直接边缘 (i\to k) 时，它的第 (k) 位恰好是 1。 
4. 对于每个目的地(j>i)，计算从(i)到(j)的间接路径的数量。 对于每个数字 (d)，相交`edge_mask`和`mask[j][d]`。 总体计数给出了中间顶点 (k) 的数量，其中 (i\to k) 是一条边，并且 (P_{k,j}) 具有最后一位数字 (d)。 将该计数乘以 (d)，并将其添加到间接总数中。 
5. 减少间接总模 (10)。 如果没有直接边缘，则观察到的数字必须等于该值。 如果存在直接边缘，则观察到的数字必须等于间接值加一模 (10)。 由于保证了有效输入，因此边缘恰好在以下时间出现：

 [
 (\text{间接}+1)\bmod 10=P_{i,j}。 
]

 1. 如果存在边缘，则设置位 (j)`edge_mask`在决定对 ((i,j)) 后立即进行。 它不能插入到 (j) 的计算之前，因为直接边 (i\to j) 不是从 (i) 到 (j) 的路径的中间边。 
2. 处理完(i)的所有目的地后，输出邻接矩阵的相应行。 对每个源顶点重复此操作。 

不变量是在处理一对 ((i,j)) 之前，`edge_mask`恰好包含 (i<k<j) 的直接边 (i\to k)。 因此，从 (i) 到 (j) 的每条间接路径都有唯一的第一条边 (i\to k)，并且从 (k) 到 (j) 连续的所有路径均由 (P_{k,j}) 计数。 它们的总和正是不使用直接边（i\to j）的路径数。 加一代表直接边缘，因此与观察到的最后一位数字的比较唯一地确定该边缘是否存在。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    p = [input().strip() for _ in range(n)]

    # masks[j][d] has bit k set iff p[k][j] == digit d.
    masks = [[0] * 10 for _ in range(n)]

    for k in range(n):
        bit = 1 << k
        row = p[k]
        for j in range(k + 1, n):
            masks[j][ord(row[j]) - 48] |= bit

    ans = [bytearray(n) for _ in range(n)]

    for i in range(n - 1):
        edge_mask = 0
        row = ans[i]

        for j in range(i + 1, n):
            col_masks = masks[j]

            indirect = 0
            for d in range(1, 10):
                indirect += d * (edge_mask & col_masks[d]).bit_count()

            given = ord(p[i][j]) - 48

            if (indirect + 1) % 10 == given:
                row[j] = 1
                edge_mask |= 1 << j

    sys.stdout.write(
        '\n'.join(''.join('1' if x else '0' for x in row) for row in ans)
    )

if __name__ == "__main__":
    solve()
```第一个循环构造数字掩码。 对于固定的中间顶点 (k)，`bit = 1 << k`整行重复使用，避免重复移位。 循环开始于`k + 1`因为对角线处或对角线下方的条目保证为零，并且永远不能成为前向路径的中间顶点。 

第二阶段重建图。`edge_mask`为每个源 (i) 重置，因为它仅表示离开该源的边。 目的地 (j) 按升序处理，因此每个位都已存在于`edge_mask`对应于有效的中间顶点。 

表达式```
(edge_mask & col_masks[d]).bit_count()
```是 (k) 上整个循环的优化替换。 交集准确地保留了 (E_{i,k}=1) 和 (P_{k,j}\equiv d\pmod{10}) 的 (k)。 

数字零不需要处理，因为它对总和的贡献为零。 零掩码仍然被构建，因为它们使表示完整并保持构造简单。 

将直接边插入`edge_mask`仅在决定 ((i,j)) 之后。 在计算之前移动该操作会错误地将直接边计为中间顶点。 

Python 中不存在整数溢出问题。 尽管间接总和可以超过十，但只有其模十的值才重要。 为了简单起见，该实现保留了完整的小总和，并且最多为一对添加 (9(n-2))。 

## 工作示例

 只有一个官方示例，因此第二条跟踪使用边缘讨论中的模块化环绕案例。 

对于示例 1，输入为```
5
01113
00012
00001
00001
00000
```下表显示了逐对决策。 这`indirect`列是使用已经重建的边缘计算的。 

| 来源（一）| 目的地 (j) | 给定数字 | 间接路径 mod 10 | 边缘|
 | --- | --- | --- | --- | --- |
 | 1 | 2 | 1 | 0 | 1 |
 | 1 | 3 | 1 | 0 | 1 |
 | 1 | 4 | 1 | 1 | 0 |
 | 1 | 5 | 3 | 3 | 0 |
 | 2 | 3 | 0 | 0 | 0 |
 | 2 | 4 | 1 | 0 | 1 |
 | 2 | 5 | 2 | 1 | 1 |
 | 3 | 4 | 0 | 0 | 0 |
 | 3 | 5 | 1 | 0 | 1 |
 | 4 | 5 | 1 | 0 | 1 |

 例如，当处理(1\to5)时，来自顶点(1)的已知边是(1\to2)和(1\to3)。 相应的路径计数为 (P_{2,5}=2) 和 (P_{3,5}=1)，给出三个间接路径。 由于观察到的数字也是三，因此不需要直接边（1\to5）。 

得到的邻接矩阵是```
01100
00011
00001
00001
00000
```与样本相匹配。 

对于模块化环绕式案例，```
6
012350
001124
000112
000001
000001
000000
```考虑源顶点 (1)。 决定是：

 | (j) | 给定数字 | (j) | 之前已知的边缘掩模 间接路径| 边 (1\to j) |
 | ---| ---| ---| ---| ---|
 | 2 | 1 | 无 | 0 | 1 |
 | 3 | 2 | (2) | 1 | 1 |
 | 4 | 3 | (2,3) | 2 | 1 |
 | 5 | 5 | (2,3,4) | 4 | 1 |
 | 6 | 0 | (2,3,4,5) | 9 | 1 |

 最后一行演示了对结果取模 10 的目的。 在决定 (1\to6) 之前，四个已知的边贡献

 # 4+2+2+1

 1.

 ]

 添加直接边给出十条路径，其最后一位数字为零。 自从

 [
 (9+1)\bmod 10=0,
 ]

 即使输入数字为零，算法也能正确重建边缘。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(10n^2)) | 有 (O(n^2)) 对，每对使用本机整数位运算检查十个可能的数字 |
 | 空间| (O(10n^2)) | 为每个目的地存储十个位组，加上（n\times n）答案 |

 对于 (n=500)，只有 (124{,}750) 个对和十个数字类别，因此算法执行大约 (1.25) 万次`bit_count()`运营。 每个位集本身仅包含 500 个相关位。 这很好地满足了 2 秒和 512 MB 的限制，同时避免了三次递归的大约 2070 万次显式 Python 级内部迭代。 

## 测试用例```python
import sys
import io

def solve():
    n = int(input())
    p = [input().strip() for _ in range(n)]

    masks = [[0] * 10 for _ in range(n)]

    for k in range(n):
        bit = 1 << k
        row = p[k]
        for j in range(k + 1, n):
            masks[j][ord(row[j]) - 48] |= bit

    ans = [bytearray(n) for _ in range(n)]

    for i in range(n - 1):
        edge_mask = 0
        row = ans[i]

        for j in range(i + 1, n):
            col_masks = masks[j]

            indirect = 0
            for d in range(1, 10):
                indirect += d * (edge_mask & col_masks[d]).bit_count()

            given = ord(p[i][j]) - 48

            if (indirect + 1) % 10 == given:
                row[j] = 1
                edge_mask |= 1 << j

    sys.stdout.write(
        '\n'.join(''.join('1' if x else '0' for x in row) for row in ans)
    )

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    try:
        solve()
        result = sys.stdout.getvalue() if hasattr(sys.stdout, "getvalue") else ""
    finally:
        input = old_input
        sys.stdin = old_stdin

    return result

def run_capture(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        input = old_input
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run_capture(
    """5
01113
00012
00001
00001
00000
"""
) == """01100
00011
00001
00001
00000
""", "sample 1"

# Minimum-size graph with one edge
assert run_capture(
    """2
01
00
"""
) == """01
00
""", "minimum size"

# Minimum-size graph with no edge
assert run_capture(
    """2
00
00
"""
) == """00
00
""", "minimum size, no edge"

# Complete DAG on four vertices.
# Path counts are:
# 1 -> 2: 1
# 1 -> 3: 2
# 1 -> 4: 4
# 2 -> 3: 1
# 2 -> 4: 2
# 3 -> 4: 1
assert run_capture(
    """4
0114
0012
0001
0000
"""
) == """0111
0011
0001
0000
""", "complete DAG"

# A direct edge whose total path count wraps from 10 to digit 0.
assert run_capture(
    """6
012350
001124
000112
000001
000001
000000
"""
) == """011111
001011
000100
000011
000001
000000
""", "modulo 10 wraparound"

# Maximum-size input.
# The empty graph has zero paths between every distinct pair,
# so the input and output are both 500 zero rows.
n = 500
zero_row = "0" * n
max_input = str(n) + "\n" + "\n".join([zero_row] * n) + "\n"
max_output = "\n".join([zero_row] * n) + "\n"

assert run_capture(max_input) == max_output, "maximum size"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 01 / 00`|`01 / 00`| 最小尺寸和相邻对处理 |
 |`2 / 00 / 00`|`00 / 00`| 空图和零路径计数 |
 |`4 / 0114 / 0012 / 0001 / 0000`| 完全上三角邻接| 多个间接路径和正确的重建顺序 |
 |`6 / 012350 / 001124 / 000112 / 000001 / 000001 / 000000`|`011111 / 001011 / 000100 / 000011 / 000001 / 000000`| 最后一位数字环绕，包括观察到的数字零的现有边缘 |
 | (500\times500) 零矩阵 | (500\times500) 零矩阵 | 最大值 (n)、内存使用和性能 |

 ## 边缘情况

 相邻对的情况没有中间顶点。 为了```
2
01
00
```该对 ((1,2)) 的间接和为零。 观察到的数字是 1，所以

 [
 (0+1)\bmod10=1,
 ]

 算法设置边缘 (1\to2)。 没有尝试检查它们之间不存在的顶点。 

空图的处理方式完全相同。 为了```
2
00
00
```间接和为零，观察到的数字也为零。 自从

 [
 (0+1)\bmod10\ne0,
 ]

 边缘不存在。 所得矩阵仍然全为零。 

最具欺骗性的情况是模块化环绕。 考虑```
6
012350
001124
000112
000001
000001
000000
```对于(1\to6)，已经重建的边是(1\to2,1\to3,1\to4,1\to5)。 他们的贡献是

 [
 P_{2,6}=4,\qquad
 P_{3,6}=2,\qquad
 P_{4,6}=2,\qquad
 P_{5,6}=1。 
]

 间接总数为(9)。 观察到的数字为零，但添加直接边会产生十条路径，因此正确的决策是（E_{1,6}=1）。 算法测试`(9 + 1) % 10 == 0`并正确恢复该边缘。 

最后，重建顺序至关重要。 当决定(E_{i,j})时，只有(k<j)的边(E_{i,k})被允许参与间接路径和。 从左到右处理 (j) 保证了`edge_mask`表示一条已经建立的边，并且当前候选边（i\to j）没有意外地被计为它自己的中间贡献。
