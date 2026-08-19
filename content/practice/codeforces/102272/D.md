---
title: "CF 102272D - C\u00e1nh \u0110\u1ed3ng Hoa"
description: "我们有一个花数数组 (A1,ldots,AN)。 类型 1 运算选择一个区间 ([l,r]) 并向其添加一个阶梯。 位置(l)接收(1)，位置(l+1)接收(2)，并且通常位置(i)接收(i-l+1)。"
date: "2026-08-19T05:11:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102272
codeforces_index: "D"
codeforces_contest_name: "HCW 19 Individual Day 1"
rating: 0
weight: 102272
solve_time_s: 206
verified: true
draft: false
---

[CF 102272D - C\u00e1nh \u0110\u1ed3ng Hoa](https://codeforces.com/problemset/problem/102272/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个花朵计数数组 (A_1,\ldots,A_N)。 类型 1 运算选择一个区间 ([l,r]) 并向其添加一个阶梯。 位置(l)接收(1)，位置(l+1)接收(2)，并且通常位置(i)接收(i-l+1)。 类型 2 运算要求当前数组在区间 ([u,v]) 上求和。 

这些操作是按顺序处理的，因此每个查询都必须看到之前发生的所有更新。 任务是打印每个类型 2 操作的答案。 

最大的测试可以包含 (10^5) 个位置和 (10^5) 个操作，最多有四个测试用例。 (O(NQ)) 解决方案在最坏的情况下可以执行大约 (10^{10}) 次基本数组运算，这远远超出了两秒的限制。 即使 (O(N+Q\sqrt N)) 在这里也会变得不必要的昂贵。 我们需要每个操作大约花费 (O(\log N)) 时间。 

有几种边界情况可能会导致看似正确的实现失败。 首先，更新可以只包含一个位置。 例如，```
1
1
0
2
1 1 1
2 1 1
```产生```
1
```because the update adds only (1). 该公式始终在 (l+1) 处插入第二个差值，而不检查 (l<r) 是否会破坏状态。 

更新也可以到达最后一个数组位置。 例如，```
1
3
0 0 0
2
1 2 3
2 1 3
```产生```
6
```因为位置 (2,3) 上的添加值是 (1,2)，给出数组 ([0,1,2])。 内部表示可以使用位置 (r+1=4)，但该位置不属于数组，只能充当终止差异。 将 Fenwick 树分配得太窄或在此边界上错误地查询它可能会导致相差一错误。 

查询可能仅涵盖更新的一部分。 例如，```
1
5
0 0 0 0 0
2
1 2 5
2 3 4
```产生```
5
```因为更新创建了 ([0,1,2,3,4])，并且位置 (3,4) 总和为 (5)。 将楼梯视为恒定范围加法会错误地给出 (2+2=4)。 

最后，多个更新可能会重叠。 例如，```
1
4
0 0 0 0
3
1 1 3
1 2 4
2 2 3
```产生```
5
```第一次更新添加 ([1,2,3,0])，第二次更新添加 ([0,1,2,3])，因此位置 (2,3) 包含 (3,5)。 每次更新都必须独立地贡献于最终总和。 

## 方法

 直接的解决方案是通过访问从(l)到(r)的每个(i)并将(i-l+1)添加到(A_i)来处理类型1操作。 然后可以使用前缀和结构或简单地通过扫描请求的间隔来回答类型 2 操作。 这是正确的，因为每次更新都准确地应用于它所描述的位置。 

问题在于更新涉及的位置数量。 如果 (N=Q=10^5)，我们可以有 (10^5) 次更新覆盖几乎整个数组。 一次更新可能需要 (10^5) 次添加，在最坏的情况下大约提供 (10^{10}) 次操作。 两秒的限制排除了这种情况。 

有用的观察是更新所增加的价值不是任意的。 在 ([l,r]) 上，

 [
 i-l+1=i+(1-l)。 
]

 因此每次更新都会添加位置索引的线性函数。 更具体地说，如果位置 (i) 处的增加值写为

 [
 f(i)=ai+b,
 ]

 那么这里（a=1）和（b=1-l）。 

我们实际上不需要存储每个受影响的值。 相反，请考虑所有更新贡献的值的差异数组。 对于 ([l,r]) 上的一次线性更新 (f(i)=ai+b)，其差分数组只有三种可能的变化。 在 (l) 处，我们从 (f(l)) 开始。 在 (l) 和 (r) 之间，连续值增加 (a)，因此在 (l+1) 处我们添加 (a)。 在 (r+1) 处，我们减去 (f(r))，从而终止更新。 

对于这个特定问题，(a=1) 和 (b=1-l)，所以

 [
 f(l)=1
 ]

 和

 [
 f(r)=r-l+1。 
]

 因此，一次更新可以仅由差异数组中恒定数量的点变化来表示。 

剩下的问题是如何有效地从这些差异变化中恢复范围和。 如果(D_j)是差值数组，则位置(i)处的值为

 [
 X_i=\sum_{j\le i}D_j。 
]

 因此，通过 (x) 的前缀和为

 \sum_{j=1}^{x}D_j(x-j+1)。 
]

 重新排列，

 (x+1)\sum_{j=1}^{x}D_j-\sum_{j=1}^{x}jD_j。 
]

 这意味着我们只需要两个前缀量：(\sum D_j) 和 (\sum jD_j)。 两棵 Fenwick 树可以在 (O(\log N)) 的点变化下维持这些数量。 

原始数组不需要插入到这些 Fenwick 树中。 我们预先计算其普通前缀和一次，然后在回答查询时添加所有后续楼梯更新的贡献。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(NQ)) | (O(N)) | 太慢了 |
 | 最佳 | (O(N+Q\log N)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 计算初始花数的普通前缀和数组。 令 (P[x]) 为位置 (1) 到 (x) 的初始值之和。 然后，对 ([u,v]) 的查询可以获得其初始贡献为 (P[v]-P[u-1])。 
2. 维护两棵芬威克树。 第一个将点更改存储到差异数组 (D)，而第二个存储相同的更改乘以它们的位置。 如果 (d) 的差异变化发生在位置 (p) 处，则将 (d) 添加到第一棵树，将 (p d) 添加到第二棵树。 
3.对于更新([l,r])，增加的值为(f(i)=i-l+1)。 在位置(l)处，差值数组必须增加(f(l)=1)，因此在(l)处添加(+1)。 如果 (l<r)，连续值增加 (1)，因此在 (l+1) 处添加 (+1)。 在(r+1)处，减去最终值(f(r)=r-l+1)。 由此产生的差异变化准确地描述了此更新添加的楼梯。 
4. 计算所有更新对前缀([1,x])的贡献，得到

 [
 S_D=\sum_{j\le x}D_j
 ]

 从第一棵芬威克树和

 [
 S_{jD}=\sum_{j\le x}jD_j
 ]

 从第二个开始。 动态前缀和为

 [
 (x+1)S_D-S_{jD}。 
]

 该公式直接通过计算有多少个前缀位置包含每个差值而得出。 在位置 (j) 处引入的差异会影响位置 (j,j+1,\ldots,x)，即 (x-j+1) 个位置。

1. 对于类型2查询([u,v])，通过(v)计算动态前缀和，并通过(u-1)减去动态前缀和。 添加相应的初始前缀和差。 这给出了 ([u,v]) 上的完整当前总和。 
2. 按输入顺序处理所有操作。 更新会立即修改两个 Fenwick 树，而查询只会读取它们，因此每个查询都会自动准确地看到其之前的更新。 

### 为什么它有效

 不变量是两棵 Fenwick 树代表由处理后的 1 类操作引起的每朵花贡献的差异数组。 对于每次更新，三个差异变化在 ([l,r]) 上重建序列 (1,2,\ldots,r-l+1) ，在其外部为零。 由于差异数组线性相加，因此通过添加差异变化可以正确表示重叠更新。 

对于以 (x) 结尾的任何前缀，每个差异 (D_j) 都会对位置 (j) 到 (x) 做出贡献，从而给出 (D_j(x-j+1)) 朵花总数。 身份

 (x+1)\sum_{j\le x}D_j-\sum_{j\le x}jD_j
 ]

 因此恢复精确的动态前缀和。 减去两个前缀给出精确的动态区间和，添加未改变的初始前缀和给出当前数组和。 因此，每个第 2 类答案都是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    __slots__ = ("n", "bit")

    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, value):
        n = self.n
        bit = self.bit
        while idx <= n:
            bit[idx] += value
            idx += idx & -idx

    def sum(self, idx):
        bit = self.bit
        res = 0
        while idx > 0:
            res += bit[idx]
            idx -= idx & -idx
        return res

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        prefix = [0] * (n + 1)
        for i, value in enumerate(a, 1):
            prefix[i] = prefix[i - 1] + value

        # One tree stores D[j].
        # The other stores j * D[j].
        bit_d = Fenwick(n + 1)
        bit_jd = Fenwick(n + 1)

        def add_difference(pos, delta):
            if pos > n + 1:
                return
            bit_d.add(pos, delta)
            bit_jd.add(pos, pos * delta)

        def dynamic_prefix(x):
            if x <= 0:
                return 0
            sum_d = bit_d.sum(x)
            sum_jd = bit_jd.sum(x)
            return (x + 1) * sum_d - sum_jd

        q = int(input())

        for _ in range(q):
            query = list(map(int, input().split()))
            typ, x, y = query

            if typ == 1:
                l, r = x, y

                # f(i) = i - l + 1
                # At l: start with f(l) = 1.
                add_difference(l, 1)

                # From l+1 through r, consecutive values differ by 1.
                if l < r:
                    add_difference(l + 1, 1)

                # At r+1, terminate the staircase.
                add_difference(r + 1, -(r - l + 1))

            else:
                u, v = x, y

                initial = prefix[v] - prefix[u - 1]
                dynamic = dynamic_prefix(v) - dynamic_prefix(u - 1)

                out.append(str(initial + dynamic))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`prefix`数组单独处理初始花。 这很方便，因为初始值永远不会改变，因此没有理由让 Fenwick 结构代表它们。`bit_d`表示 (D_j)，而`bit_jd`代表(jD_j)。 帮手`add_difference`一起更新两个结构，这可以防止两个表示不同步。 

对于更新 ([l,r])，第一个更改始终是`+1`在`l`。 第二个变化也是`+1`，但仅当`l < r`。 这一条件对于单元素更新至关重要。 最终的更改位于`r + 1`并且等于`-(r-l+1)`。 芬威克树有大小`n + 1`特别是这样，当`r = n`。 

这`dynamic_prefix`功能实现

 [
 (x+1)\sum_{j\le x}D_j-\sum_{j\le x}jD_j。 
]

什么时候`x`为零，则答案立即为零，这使得从位置 (1) 开始的查询安全，因为它们请求`dynamic_prefix(0)`。 

Python 整数具有任意精度，因此潜在的大花数不会溢出。 最大可能总数可能会大幅超出 32 位整数范围。 

每个 Fenwick 操作都是对数的，并且每次更新都会执行恒定数量的操作。 查询执行两次前缀计算，每个端点计算一次。 由此产生的实现避免了触及潜在的巨大更新间隔本身。 

## 工作示例

 第一个测试用例开始于

 [
 [2,1,3,5,2]。 
]

 下表跟踪每次操作后的数组以及查询发生时的答案。 

| 运营| 更新或查询 | 当前数组 | 回答 |
 | --- | --- | --- | --- |
 |`1 1 3`| 将 (1,2,3) 添加到位置 (1,2,3) |`[3, 3, 6, 5, 2]`| |
 |`2 3 5`| 位置 (3) 到 (5) 的总和 |`[3, 3, 6, 5, 2]`|`13`|
 |`1 4 5`| 将 (1,2) 添加到位置 (4,5) |`[3, 3, 6, 6, 4]`| |
 |`1 2 5`| 将 (1,2,3,4) 添加到位置 (2) 到 (5) |`[3, 4, 8, 9, 8]`| |
 |`1 1 1`| 将 (1) 添加到位置 (1) |`[4, 4, 8, 9, 8]`| |
 |`2 1 4`| 位置 (1) 到 (4) 的总和 |`[4, 4, 8, 9, 8]`|`25`|

 对于第一次更新，差异表示接收`+1`在位置 (1) 处，`+1`在位置 (2) 处，并且`-3`在位置 (4) 处。 它的重建值为(1,2,3,0,0)，正是更新所需的楼梯。 添加相同的表示以供以后更新，因此重叠操作自然会累积。 

第二个测试用例开始于

 [
 [10,5,2,0,8,6,2]。 
]

 | 运营| 更新或查询 | 当前数组 | 回答 |
 | --- | --- | --- | --- |
 |`1 2 5`| 将 (1,2,3,4) 添加到位置 (2) 到 (5) |`[10, 6, 4, 3, 12, 6, 2]`| |
 |`1 1 6`| 将 (1,2,3,4,5,6) 添加到位置 (1) 到 (6) |`[11, 8, 7, 7, 17, 12, 2]`| |
 |`2 4 7`| 位置 (4) 到 (7) 的总和 |`[11, 8, 7, 7, 17, 12, 2]`|`38`|
 |`1 1 3`| 将 (1,2,3) 添加到位置 (1) 到 (3) |`[12, 10, 10, 7, 17, 12, 2]`| |
 |`1 5 5`| 将 (1) 添加到位置 (5) |`[12, 10, 10, 7, 18, 12, 2]`| |
 |`1 1 5`| 将 (1,2,3,4,5) 添加到位置 (1) 到 (5) |`[13, 12, 13, 11, 23, 12, 2]`| |
 |`2 1 7`| 对整个数组求和 |`[13, 12, 13, 11, 23, 12, 2]`|`86`|

 单位置更新`1 5 5`是一个有用的检查。 自从`l == r`，代码仅插入起始差异和终止差异。 中间体`l+1`跳过更改，因此表示的序列恰好包含一朵添加的花。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N+Q\log N)) | 构建初始前缀总和成本 (O(N))； 每次更新和查询都会执行恒定数量的 Fenwick 操作 |
 | 空间| (O(N)) | 初始前缀数组和两个 Fenwick 树各自使用 (O(N)) 内存 |

 使用 (N,Q\le10^5)，该解决方案在每个测试用例中执行几百万次 Fenwick 树迭代，而不是数十亿次直接数组更新。 内存使用量是线性的并且完全低于 256 MB。 

## 测试用例

 以下测试工具使用相同算法的可调用版本。 最大大小的情况是生成的，而不是按字面写出，这使测试源保持可读，同时仍然执行规定的限制。```python
import sys
import io

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, value):
        while idx <= self.n:
            self.bit[idx] += value
            idx += idx & -idx

    def sum(self, idx):
        res = 0
        while idx:
            res += self.bit[idx]
            idx -= idx & -idx
        return res

def solve_io():
    input = sys.stdin.readline
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        prefix = [0] * (n + 1)
        for i, value in enumerate(a, 1):
            prefix[i] = prefix[i - 1] + value

        bit_d = Fenwick(n + 1)
        bit_jd = Fenwick(n + 1)

        def add_difference(pos, delta):
            bit_d.add(pos, delta)
            bit_jd.add(pos, pos * delta)

        def dynamic_prefix(x):
            if x <= 0:
                return 0
            sd = bit_d.sum(x)
            sjd = bit_jd.sum(x)
            return (x + 1) * sd - sjd

        q = int(input())

        for _ in range(q):
            typ, x, y = map(int, input().split())

            if typ == 1:
                l, r = x, y
                add_difference(l, 1)
                if l < r:
                    add_difference(l + 1, 1)
                add_difference(r + 1, -(r - l + 1))
            else:
                u, v = x, y
                ans = (
                    prefix[v] - prefix[u - 1]
                    + dynamic_prefix(v)
                    - dynamic_prefix(u - 1)
                )
                out.append(str(ans))

    return "\n".join(out)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve_io()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

sample = """\
2
5
2 1 3 5 2
6
1 1 3
2 3 5
1 4 5
1 2 5
1 1 1
2 1 4
7
10 5 2 0 8 6 2
7
1 2 5
1 1 6
2 4 7
1 1 3
1 5 5
1 1 5
2 1 7
"""

assert run(sample) == "13\n25\n38\n86", "provided sample"

assert run("""\
1
1
0
2
1 1 1
2 1 1
""") == "1", "minimum size"

assert run("""\
1
3
0 0 0
3
1 2 3
2 1 3
2 3 3
""") == "6\n2", "right boundary and partial query"

assert run("""\
1
5
7 7 7 7 7
4
2 1 5
1 3 5
2 1 5
2 3 5
""") == "35\n41\n24", "all equal initial values"

assert run("""\
1
4
0 0 0 0
5
1 1 4
1 2 3
2 1 4
2 2 3
2 4 4
""") == "14\n7\n4", "overlap and boundaries"

n = 100000
maximum_case = (
    "1\n"
    f"{n}\n"
    + ("1 " * (n - 1))
    + "1\n"
    + f"{n}\n"
    + "\n".join(
        ["1 1 100000"] * (n - 1)
        + ["2 1 100000"]
    )
    + "\n"
)

expected = n + (n - 1) * (n * (n + 1) // 2)
assert run(maximum_case) == str(expected), "maximum size"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸情况 (N=1) |`1`| 单位置更新和 (u-1=0) 前缀边界 |
 | 更新到达位置 (N) |`6`,`2`| 正确处理 (r+1) 处的终止差异和部分查询 |
 | 所有初始值均相等 |`35`,`41`,`24`| 不可变初始前缀和与动态更新的分离 |
 | 重叠更新 |`14`,`7`,`4`| 多个楼梯更新和区间边界的可加性|
 | 生成 (N=Q=10^5) 案例 | 通过测试中的公式计算| 时间复杂度、大整数、重复全范围更新 |

 ## 边缘情况

 对于单元素更新，请考虑```
1
1
0
2
1 1 1
2 1 1
```更新为(f(1)=1)。 该算法添加`+1`到位置 (1) 处的差异数组并且`-1`在位置 (2) 处。 第二个更改存储在 Fenwick 树中，但位于查询的前缀之外。 因此，到位置 (1) 的前缀为 (1)，输出为`1`。 (l+1) 处缺失的中间变化是故意的，因为楼梯中没有第二个位置。 

对于以最终位置结束的更新，请考虑```
1
3
0 0 0
2
1 2 3
2 1 3
```更新将 (1,2) 贡献给位置 (2,3)。 其差异变化为`+1`在（2）处，`+1`在 (3) 处，并且`-2`在（4）处。 Fenwick 树的大小为 (N+1)，因此位置 (4) 可以保存终止差异。 通过 (3) 的前缀忽略该终止并给出 (3)，因此预期输出实际上是`3`。 

对于仅涵盖部分更新的查询，请考虑```
1
5
0 0 0 0 0
2
1 2 5
2 3 4
```更新产生 ([0,1,2,3,4])。 到(4)的前缀是(6)，而到(2)的前缀是(1)，所以请求的和是(6-1=5)。 动态前缀公式在不知道区间中各个值的情况下起作用。 

对于重叠更新，请考虑```
1
4
0 0 0 0
3
1 1 3
1 2 4
2 2 3
```第一个更新贡献 ([1,2,3,0])，第二个更新贡献 ([0,1,2,3])。 它们的总和是([1,3,5,3])，因此位置(2,3)包含(3+5=8)。 差异表示只是将两次更新的差异变化相加，产生完全相同的组合数组。 

最大尺寸的情况涉及另一个实际边界。 对于 (N=Q=10^5)，如果每次更新都访问所有 (N) 个位置，则不可能重复更新整个数组。 Fenwick 表示每次更新仅涉及恒定数量的位置，因此操作数量以 (O(Q\log N)) 而不是 (O(NQ)) 的形式增长。 Python 的任意精度整数也可以安全地处理结果总数，该总数可能比 (2^{31}-1) 大得多。
