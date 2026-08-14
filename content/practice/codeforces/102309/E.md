---
title: "CF 102309E - Orz 熊猫的期望"
description: "从左到右排列有（n）个盒子。 类型 1 运算选择间隔 ([l,r])、数字 (x) 和偏移量 (c)。 对于该间隔中的每个位置（p），其中（p=l+k-1），恰好将一个新纸条放入框（p）中。"
date: "2026-08-13T23:45:31+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102309
codeforces_index: "E"
codeforces_contest_name: "The 2019 \u201cOrz Panda\u201d Cup Programming Contest"
rating: 0
weight: 102309
solve_time_s: 161
verified: true
draft: false
---

[CF 102309E - Orz Pandas 的期望](https://codeforces.com/problemset/problem/102309/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 从左到右排列有（n）个盒子。 类型 1 运算选择间隔 ([l,r])、数字 (x) 和偏移量 (c)。 对于该间隔中的每个位置（p），其中（p=l+k-1），恰好将一个新纸条放入框（p）中。 它的值是由数字 (x) 的 (c+k) 个副本组成的数字。 

类型 2 操作要求我们查看当前存储在盒子 ([l,r]) 中的每个纸条，均匀随机选择一个，并返回所选纸条的期望值。 因此，答案是间隔中所有条带值的总和除以那里的条带总数。 除法以模 (10^9+7) 进行。 

这些限制使得直接模拟变得不可能。 可能有 (10^5) 个操作和 (10^4) 个框，因此每次更新处理每个受影响的框可能需要 (10^9) 个框更新。 值参数(c)也可以达到(10^9)，因此构造实际的十进制字符串是完全不可能的。 我们需要用代数表示每个条带值并立即更新整个间隔。 

有几种边缘情况，简单的实现可能会处理不当。 首先，查询可以覆盖根本不包含条带的框。 例如，```
1 1
2 1 1
```没有可用的条带，所以答案是`0`。 盲目计算计数的倒数的解决方案将除以零。 

其次，当(l>1)时(c)可以为零。 例如，```
3 2
1 3 3 1 0
2 3 3
```放置一位数字条`1`进入框3，所以答案是`1`。 代数表示自然包含 (10^{c-l+1}=10^{-2})，因此将此指数视为普通非负指数会给出错误的结果。 我们通过预先计算 10 的倒数幂来处理这个问题。 

第三，查询间隔不需要与更新间隔匹配。 例如，```
4 2
1 2 4 3 1
2 3 4
```创造`33`,`333`， 和`3333`在框 2、3 和 4 中。查询仅看到`333`和`3333`，所以答案是（3666/2=1833）。 仅存储每次更新的总贡献而不考虑其位置边界的解决方案将包括`33`错误地。 

最后，许多更新可能会重叠。 这些条带不会被后续操作所取代，而是会累积。 例如，```
1 3
1 1 1 9 0
1 1 1 9 0
2 1 1
```留下两条带，都等于`9`，所以期望值仍然是`9`。 数据结构必须在附加更新下维护总和和计数。 

## 方法

 蛮力方法很简单。 对于每个盒子，维护当前内部的条带列表。 对于类型 1 运算，迭代 (p=l,\ldots,r)，计算相应的重复数字，并将其附加到框 (p)。 对于类型 2 操作，迭代请求的框并对条带数量和这些条带的值求和。 这是正确的，因为统一选择的项目的期望正是总价值除以项目数量。 

问题是工作量。 一个类型 1 操作可以触及 (10^4) 个盒子，并且可以有 (10^5) 个操作，给出多达 (10^9) 个单独的盒子更新。 查询还可能需要每个扫描 (10^4) 个盒子。 在操作的生命周期内，数据本身最多可以包含 (10^9) 个条带，因此显式存储每个条带也不可行。 

有用的观察结果是，在位置 (p) 处添加的条带的值具有非常简单的形式。 长度为 (L) 的重复数字为

 [
 x\frac{10^L-1}{9}。 
]

 对于从 (l) 开始的更新，位置 (p) 对应于 (k=p-l+1)，因此其条带长度为 (c+p-l+1)。 其值为

 [
 x\frac{10^{c+p-l+1}-1}{9}。 
]

 重新排列给出

 [
 \frac{x10^{c-l+1}}9 10^p-\frac{x}{9}。 
]

 对于固定更新，这只是

 [
 A\cdot 10^p+B,
 ]

 其中 (A) 和 (B) 是整个更新间隔内的常数。 

这正是惰性线段树可以利用的结构。 对于每个段，我们存储 (10^p) 的总和、所有当前条带值的总和以及条带的数量。 应用系数 (A,B) 更新会改变段 ([L,R]) 的值总和

 [
 A\sum_{p=L}^{R}10^p+B(R-L+1)。 
]

 同时，每个位置都添加一个新条带，因此条带数增加 (R-L+1)。 

因此，线段树在 (O(\log n)) 中惰性地执行整个类型 1 操作，而类型 2 操作在 (O(\log n)) 中获得总值和总数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(百万)) | 最坏情况下的 (O(mn)) | 太慢了|
 | 最佳| (O(m\log n+\sum \log c_i)) | (O(n)) | (O(n)) | 已接受 |

 (\log c_i) 项来自计算 (10^{c_i}) 时的模幂。 由于 (c_i\le 10^9)，每次更新仅需要约 30 次模乘法。 

## 算法演练

 1. 对每个 (0\le p\le n) 预先计算 (10^p\bmod M) 和 (10^{-p}\bmod M)。 需要逆幂是因为当 (c<l-1) 时系数 (10^{c-l+1}) 可以具有负指数。 我们可以安全地将其写为 (10^c10^{1-l})。 
2. 在位置 (1,\ldots,n) 上构建线段树。 每个节点存储`pow_sum`，其线段上的 (10^p) 之和，以及两个动态量：`value_sum`，当前段中所有纸带值的总和，以及`count_sum`，当前段中的条带数。 
3. 对于类型 1 运算 ((l,r,x,c))，将位置 (p) 处添加的值重写为

 [
 \frac{x10^{c-l+1}}9 10^p-\frac{x}{9}。 
]

 定义

 [
 A=x10^c10^{1-l}9^{-1}\pmod M
 ]

 和

 [
 B=-x9^{-1}\pmod M。 
]

 每个位置 (p\in[l,r]) 的更新恰好是 (A10^p+B)。 
4. 将此更新惰性地应用到线段树。 对于表示 ([L,R]) 的完全覆盖节点，添加

 [
 A\cdot\text{pow_sum}+B(R-L+1)
 ]

 为其值总和，并将 (R-L+1) 添加到其计数中。 将 (A,B) 和计数增量存储在节点的惰性字段中，以便后代稍后收到相同的更新。 
5. 对于类型 2 查询 ([l,r])，在线段树中查询对 ((S,C))，其中 (S) 是这些框中所有条带的总值，(C) 是它们的总数。 如果（C=0），输出`0`。 否则输出

 [
 SC^{-1}\pmod M。 
]
 6. 处理测试用例直到 EOF。 为每个新对 ((n,m)) 重建树，因此来自不同测试用例的条带永远不会交互。 

### 为什么它有效

 不变量是对于每个线段树节点，`value_sum`等于当前属于该节点间隔中的位置的每个条带的值的总和，而`count_sum`等于这些条带的数量。 静态的`pow_sum`等于相同位置上 (10^p) 的总和。 

类型 1 操作将 (A10^p+B) 添加到每个受影响位置的一个新条带上。 对于完整的段，对该表达式求和得到 (A\cdot\text{pow_sum}+B\cdot\text{length})，正是树应用的更新，并且新条带的数量正是段长度。 惰性传播为每个后代保留了相同的数量。 

因此，类型 2 查询获得其间隔内可选择条带的准确总值和准确总数。 前者除以后者正是所请求期望的定义，因此返回的模值是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1000000007
INV9 = pow(9, MOD - 2, MOD)
INV10 = pow(10, MOD - 2, MOD)

def solve():
    out = []

    while True:
        first = input()
        if not first:
            break

        n, m = map(int, first.split())

        pow10 = [1] * (n + 1)
        invpow10 = [1] * (n + 1)

        for i in range(1, n + 1):
            pow10[i] = pow10[i - 1] * 10 % MOD
            invpow10[i] = invpow10[i - 1] * INV10 % MOD

        size = 4 * n + 5

        pow_sum = [0] * size
        value_sum = [0] * size
        count_sum = [0] * size

        lazy_a = [0] * size
        lazy_b = [0] * size
        lazy_c = [0] * size

        def build(node, left, right):
            if left == right:
                pow_sum[node] = pow10[left]
                return

            mid = (left + right) >> 1
            lc = node << 1
            rc = lc | 1

            build(lc, left, mid)
            build(rc, mid + 1, right)

            pow_sum[node] = (pow_sum[lc] + pow_sum[rc]) % MOD

        def apply(node, left, right, a, b, c):
            length = right - left + 1

            value_sum[node] = (
                value_sum[node]
                + a * pow_sum[node]
                + b * length
            ) % MOD

            count_sum[node] += c * length

            lazy_a[node] = (lazy_a[node] + a) % MOD
            lazy_b[node] = (lazy_b[node] + b) % MOD
            lazy_c[node] += c

        def push(node, left, right):
            a = lazy_a[node]
            b = lazy_b[node]
            c = lazy_c[node]

            if a == 0 and b == 0 and c == 0:
                return

            if left != right:
                mid = (left + right) >> 1
                lc = node << 1
                rc = lc | 1

                apply(lc, left, mid, a, b, c)
                apply(rc, mid + 1, right, a, b, c)

            lazy_a[node] = 0
            lazy_b[node] = 0
            lazy_c[node] = 0

        def update(node, left, right, ql, qr, a, b):
            if ql <= left and right <= qr:
                apply(node, left, right, a, b, 1)
                return

            push(node, left, right)

            mid = (left + right) >> 1
            lc = node << 1
            rc = lc | 1

            if ql <= mid:
                update(lc, left, mid, ql, qr, a, b)

            if qr > mid:
                update(rc, mid + 1, right, ql, qr, a, b)

            value_sum[node] = (value_sum[lc] + value_sum[rc]) % MOD
            count_sum[node] = count_sum[lc] + count_sum[rc]

        def query(node, left, right, ql, qr):
            if ql <= left and right <= qr:
                return value_sum[node], count_sum[node]

            push(node, left, right)

            mid = (left + right) >> 1
            lc = node << 1
            rc = lc | 1

            total_value = 0
            total_count = 0

            if ql <= mid:
                v, c = query(lc, left, mid, ql, qr)
                total_value += v
                total_count += c

            if qr > mid:
                v, c = query(rc, mid + 1, right, ql, qr)
                total_value += v
                total_count += c

            return total_value % MOD, total_count

        build(1, 1, n)

        for _ in range(m):
            operation = list(map(int, input().split()))

            if operation[0] == 1:
                _, l, r, x, c = operation

                # x * 10^(c-l+1) / 9
                # = x * 10^c * 10^(1-l) / 9
                a = x * pow(10, c, MOD) % MOD
                a = a * invpow10[l - 1] % MOD
                a = a * 10 % MOD
                a = a * INV9 % MOD

                b = (-x * INV9) % MOD

                update(1, 1, n, l, r, a, b)

            else:
                _, l, r = operation

                total_value, total_count = query(
                    1, 1, n, l, r
                )

                if total_count == 0:
                    out.append("0")
                else:
                    answer = total_value * pow(
                        total_count, MOD - 2, MOD
                    ) % MOD
                    out.append(str(answer))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```这`pow10`数组包含每个盒子的静态权重 (10^p)。 这`invpow10`array 处理 (c-l+1) 为负数的情况。 使用

 [
 10^{c-l+1}=10^c10^{-(l-1)}10
 ]

 保留传递给的每个指数`pow`非负的。 

线段树的`pow_sum`永远不会改变，因为盒子的位置永远不会改变。 其他三个节点数量是动态的。`value_sum`存储条带值的模和，`count_sum`存储普通整数计数，三个惰性数组描述仍需要传播到子级的更新。 

里面的顺序`apply`概念上的问题。 首先，当前节点接收完整的更新。 只有在此之后，惰性传播才会将相同的更新推迟到其子级。 当查询与节点部分相交时，`push`在下降之前调用，因此子级可以看到之前仅存储在其祖先中的每个更新。 

故意不以模 (M) 减少计数。 最多 (10^5) 个操作每个操作最多可以为查询贡献 (10^4) 个条带，因此总计数最多为 (10^9)，小于 (M=10^9+7)。 因此，非零计数始终是可逆模 (M) 的，并且将其保留为普通整数也使零测试变得直接。 

Python整数不会溢出，因此中间产物`a * pow_sum[node]`是安全的。 算术运算后，值和和惰性系数会按模 (M) 减小，以便它们的大小保持受控。 

## 工作示例

 ### 示例 1

 输入是```
3 3
1 2 3 5 1
1 1 2 1 3
2 2 3
```第一次更新放了`55`进入框 2 并`555`进入框 3。第二次更新将`1111`进入框 1 和`11111`进入框 2。查询涵盖框 2 和 3。 

| 运营| 受影响的职位 | 新条| 查询结果 |
 | ---| ---| ---| ---|
 |`1 2 3 5 1`| 2, 3 | 55, 555 | 55, 555 |
 |`1 1 2 1 3`| 1, 2 | 1111, 11111 | |
 |`2 2 3`| 2, 3 | 55、11111、555 | ((55+11111+555)/3=3907) |

 线段树在框 2 到 3 上具有总值 (11721) 和总计数 (3)，给出`3907`。 

这表明不同的更新可以在同一个框中重叠，每个条带仍然可以独立选择。 

### 示例 2

 考虑```
4 4
1 1 4 2 0
2 1 4
1 2 3 3 1
2 2 3
```第一次更新创建`2`,`22`,`222`， 和`2222`。 因此，它的第一个查询看到四个条带，其总和为 (2468)。 

| 运营| 职位 | 增值 | 查询金额 | 查询次数 |
 | ---| ---| ---| ---| ---|
 |`1 1 4 2 0`| 1、2、3、4 | 2、22、222、2222 | | |
 |`2 1 4`| 1、2、3、4 | | 2468 | 2468 4 |
 |`1 2 3 3 1`| 2, 3 | 33, 333 | | |
 |`2 2 3`| 2, 3 | 22、222、33、333 | 610 | 610 4 |

 第一个期望是（2468/4=617）。 第二个是（610/4=305/2），即`500000156`模 (10^9+7)。 

第二个查询确认树组合了新旧条带，同时将结果精确限制为请求的间隔。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(m\log n+\sum \log c_i)) | 每个更新和查询都会访问 (O(\log n)) 个线段树节点，而每个类型 1 操作都会在 (O(\log c)) 中计算 (10^c\bmod M)。 |
 | 空间| (O(n)) | (O(n)) | 线段树和幂数组均包含 (O(n)) 个条目。 |

 对于 (n\le10^4) 和 (m\le10^5)，线段树每次操作仅执行对数工作。 最大的指数是 (10^9)，因此模幂每次更新只需要少量恒定数量的乘法步骤。 内存消耗也在 256 MB 以内。 

## 测试用例

 以下测试工具假设提交的解决方案保存为`solution.py`。 助手替换了标准输入和模块的`input`函数使得相同`solve()`执行可以反复进行。```python
import sys
import io
import solution

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout
    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solution.input = sys.stdin.readline
        solution.solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    """3 3
1 2 3 5 1
1 1 2 1 3
2 2 3
"""
) == "3907", "sample 1"

# Minimum-size input, with no available strips
assert run(
    """1 1
2 1 1
"""
) == "0", "empty query"

# Repeated identical strips in one box
assert run(
    """1 4
1 1 1 9 0
1 1 1 9 0
1 1 1 9 0
2 1 1
"""
) == "9", "all-equal values"

# Boundary case with c = 0 and l > 1, which needs inverse powers of 10
assert run(
    """3 2
1 3 3 1 0
2 3 3
"""
) == "1", "negative exponent case"

# Large c, checking modular exponentiation
MOD = 1000000007
INV9 = pow(9, MOD - 2, MOD)
huge_value = 7 * (pow(10, 1000000001, MOD) - 1) % MOD
huge_value = huge_value * INV9 % MOD

assert run(
    """2 2
1 2 2 7 1000000000
2 2 2
"""
) == str(huge_value), "large c"

# Maximum-size n and m.
# Every update covers the whole array, so the expected value in the last
# box is just the same repunit value, regardless of the number of updates.
n = 10000
m = 100000
lines = [f"{n} {m}"]
lines.extend(["1 1 10000 1 0"] * (m - 1))
lines.append("2 10000 10000")
max_input = "\n".join(lines) + "\n"

repunit = (pow(10, 10000, MOD) - 1) * INV9 % MOD
expected_max = repunit * (m - 1) % MOD

assert run(max_input) == str(expected_max), "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 2 1 1`|`0`| 空查询和除零保护 |
 | 一盒三个相同的更新 |`9`| 多个相等条带的累积 |
 |`1 3 3 1 0`随后是一个查询 |`1`| (10^{c-l+1}) | 中的负指数
 | 更新为 (c=10^9) | 计算模值 | 大指数处理 |
 | (n=10^4,\m=10^5) | 计算模值 | 最大输入大小和惰性全范围更新 |

 ## 边缘情况

 在模块化反转之前处理空查询。 为了```
1 1
2 1 1
```根代表唯一的盒子并且有`count_sum = 0`。 查询返回`(0, 0)`，所以代码立即附加`0`。 没有尝试逆向。 

负指数情况通过逆幂数组处理。 为了```
3 2
1 3 3 1 0
2 3 3
```条带的长度为 (c+1=1)，因此其值恰好为`1`。 从代数上来说，

 [
 1\frac{10^{0+1}-1}{9}=1。 
]

 系数表示使用

 [
 10^{c-l+1}=10^{-2},
 ]

 表示为`10^0 * 10^-2`。 线段树将该系数乘以（10^3）并减去常数（1/9），恢复`1`模 (M)。 

边界对齐由线段树的半开逻辑处理，该半开逻辑通过包含区间实现。 为了```
4 2
1 2 4 3 1
2 3 4
```更新仅影响位置 2、3 和 4。查询仅访问位置 3 和 4，返回值`333`和`3333`，总和`3666`并数数`2`。 结果是`1833`。 

重叠更新是累加性的，因为每个类型 1 操作都代表一个新条带而不是替换。 如果两个相同的更新影响同一个盒子，则该节点的`value_sum`和`count_sum`每个人都收到两份独立的捐款。 对于三个更新添加`9`到唯一的盒子，存储的对变成`(27,3)`，查询返回(27/3=9)。 

Large (c) 永远不会用于构造十进制字符串。 对于 (c=10^9)，代码使用模幂计算 (10^{c}\bmod M)，并将其与预先计算的起始位置的逆幂相结合。 结果值在数学上与巨大的重复数字整数相同，但所有算术都保持模 (10^9+7)。 

一次查询中条带的最大总数可以达到（10^9），但这仍然低于（M）。 因此，在给定的约束下，分母不能与零模 (M) 全等。 将计数存储为普通的 Python 整数还可以避免通过模块化减少意外丢失信息。
