---
title: "CF 102439I - 等模段"
description: "对于每个连续的段 [L, R]，有两种方法对其进行评估。 从 L 开始，重复取下一个数组元素的余数：a[L] % a[L+1] % ... % a[R]。 从 R 开始，沿相反方向做同样的事情：a[R] % a[R-1] % ... % a[L]。"
date: "2026-08-10T07:01:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102439
codeforces_index: "I"
codeforces_contest_name: "2018-2019 9th BSUIR Open Programming Championship. Semifinal"
rating: 0
weight: 102439
solve_time_s: 386
verified: true
draft: false
---

[CF 102439I - 等模段](https://codeforces.com/problemset/problem/102439/I)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个连续的段`[L, R]`，有两种评估方法。 开始于`L`，重复对下一个数组元素求余：`a[L] % a[L+1] % ... % a[R]`。 

开始于`R`，以相反的方向做同样的事情：`a[R] % a[R-1] % ... % a[L]`。 

我们必须计算有多少段在两个方向上产生相同的最终值。 长度为 1 的段始终符合条件，因为两个表达式仅包含相同的元素。 

该数组最多包含`10^5`元素，而每个值最多是`3 * 10^5`。 二次算法已经有了`10^10`段，因此即使每个段的恒定时间处理也会太慢。 更现实的是，评估模链本身会花费段长度的线性时间，这将直接解决方案推向立方时间。 有用的结构必须来自于模运算快速减少其参数的事实。 

有几种边缘情况很容易被错误处理。 为了`n = 1`，必须计算唯一的段，因此输入```
1
7
```有答案`1`。 只考虑长度至少为 2 的段的解决方案将会错过它。 

相等的值可以使模运算产生零。 为了```
2
5 5
```两个单身人士符合资格，并且`[1,2]`也符合条件，因为两个方向的评估结果都是`5 % 5 = 0`，所以答案是`3`。 将相等的值视为当前值保持不变将错误地返回`2`。 这也是官方的第一个样品。 

段的端点不必相等即可获得资格，并且相等的端点本身并不能保证任何内容。 为了```
2
6 3
```两个单身人士都有资格，但是`[1,2]`不是：从左到右的结果是`6 % 3 = 0`，而从右到左的结果是`3 % 6 = 3`。 正确答案是`2`。 

最后，答案可以超过 32 位有符号整数。 如果全部`100000`元素相等，每一个`n(n+1)/2 = 5000050000`段合格。 Python 整数自然地处理这个问题，而 C++ 实现则需要`long long`。 

## 方法

 直接方法很简单。 对于每对`(L,R)`，从左侧评估模链，然后从右侧再次评估。 如果两个结果匹配，则增加答案。 

这是正确的，因为它准确地测试了有效段的定义。 问题是工作量。 有`n(n+1)/2`段，所有段的总长度为`n(n+1)(n+2)/6`。 

为了`n = 100000`，这大约是`1.67 * 10^14`元素访问一个方向及左右`3.33 * 10^14`对于两个方向。 该方法远未达到 1.5 秒的限制。 

关键的观察结果是，模链并不会在每个位置都发生真正的变化。 假设当前值为`x`下一个数组值是`y`。 如果`y > x`， 然后`x % y = x`，所以结果根本没有改变。 因此，第一个可以改变结果的位置是第一个值最多为`x`。 

一旦找到这样的位置，新值就变成`x % y`。 如果`y <= x`，这个新值严格小于`x/2`。 看到这一点，如果`y <= x/2`，余数小于`y`，因此小于`x/2`。 如果`y > x/2`，那么商恰好为 1，余数为`x-y`，它又小于`x/2`。 

因此，每次实际更改都会使当前值至少减少一半。 因为每个数组值最多是`3 * 10^5`，固定的起始位置只能有`O(log a[L])`，因此最多大约二十个不同的状态。 

对于固定的左端点`L`，因此我们可以将从左到右结果的整个序列表示为少量的间隔。 每个区间表示结果是某个固定值`v`对于每个右端点`[p,q]`。 从右侧应用相同的结构，为每个固定的右端点提供少量间隔。 

这就是中央减少。 而不是考虑每一个`(L,R)`单独地，我们仅获得`O(n log A)`水平和垂直间隔，其中`A = max(a_i)`。 有效段恰好是具有相同值的左状态区间和右状态区间的交集。 

剩下的任务是几何计数。 对于一个值`v`，左状态区间的形式为`L = fixed, R in [p,q]`,

 而右状态区间的形式为`R = fixed, L in [p,q]`。 

它们的交集是一对有效的`(L,R)`恰好当固定坐标位于相应的区间内时。 

我们使用扫描线一次处理一个值`R`。 每个左状态区间都成为坐标处的活动点`L`而其右端点范围处于活动状态。 每个右状态区间都会询问有多少个活动点`L`在其区间内。 芬威克树处理这些点更新和范围查询。 

同样的想法也出现在问题的预期扫描线公式中：模状态仅形成`O(n log A)`间隔，之后它们的交集就可以算作二维离线查询问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(n^3)`|`O(1)`| 太慢了|
 | 最佳|`O(n log A log n)`|`O(n log A + A)`| 已接受 |

 ## 算法演练

 1. 构建一棵线段树，存储每个线段中的最小数组值。 我们需要重复执行一个操作：给定一个起始位置`p`和当前值`x`，找到位于或之后的第一个位置`p`其数组值最多为`x`。 最小线段树可以直接回答这个问题`O(log n)`通过跳过最小值大于的节点`x`。 
2. 修复左端点`L`并开始于`x = a[L]`。 当前的右端点是`L`。 找到第一个位置`p > L`和`a[p] <= x`。 从当前右端点到`p-1`使值等于`x`，因为它们的所有值都大于`x`。 存储代表这些右端点的一个水平间隔。 
3.如果有这样的职位`p`存在，替换`x`和`x % a[p]`并继续从`p`。 如果不存在这样的位置，则当前值保持不变，直到数组末尾，因此该左端点的状态已完成。 
4. 对每个左端点重复此操作。 每个状态都存储在属于其值的桶中。 左状态记录包含其右端点区间`[p,q]`及其固定的左端点`L`。 
5. 反转阵列并执行完全相同的过程。 反转数组中的状态对应于原始数组中的固定右端点。 将反转的间隔转换回原始坐标并将其存储为包含固定间隔的垂直记录`R`和允许的范围`L`。 
6. 对于每个模值`v`，按扫描坐标对所有记录进行排序。 水平记录在允许的最小值时开始处于活动状态`R`。 存储其固定值`L`在 Fenwick 树中及其在最小堆中的过期位置。 
7. 当垂直记录右端点固定时`R`达到时，首先删除每个活动的水平记录，其最大允许值`R`小于`R`。 剩余的芬威克树恰好包含水平状态，其间隔包含此`R`。 
8.查询Fenwick树垂直记录的允许范围`[L1,L2]`。 找到的每个点代表一对`(L,R)`两个方向具有相同的值`v`，因此将该计数添加到答案中。 
9. 处理每个值桶并打印累积的答案。 单例段已经存在于两种状态表示中，因此它们不需要单独的特殊情况。 

### 为什么它有效

 对于每一个固定的`L`，存储的水平间隔形成所有可能的右端点的分区。 在一个这样的区间内，从左到右的模值是恒定的，因为没有遇到的除数最多是当前值。 当间隔结束时，下一个除数会更改值，并且新值严格小于旧值的一半。 因此，存储的间隔恰好包含所有可能的从左到右状态。 

相反的结构给出了从右到左状态的类似精确划分。 考虑任何细分市场`[L,R]`。 它恰好属于一种有值的水平状态`v`并且恰好有一个具有一定值的垂直状态`w`。 该段恰好在以下情况下有效：`v = w`。 对于固定值，扫描线精确计算水平状态右间隔包含的那些交点`R`垂直状态的左区间包含`L`。 因此，每个有效段都被计数一次，并且无效段不被计数。 

减半属性限制了从每个起始位置生成的状态数量。 每次当前值发生变化时，它都会小于先前值的一半，并且一旦达到零，它就不会再发生变化，因为所有数组值都是正数。 这给出了`O(log A)`每个端点的状态。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

INF = 10**9
SHIFT = 17
MASK = (1 << SHIFT) - 1

def build_min_tree(a):
    n = len(a)
    size = 1 << (n - 1).bit_length()
    tree = [INF] * (2 * size)
    tree[size:size + n] = a

    for i in range(size - 1, 0, -1):
        left = tree[i << 1]
        right = tree[i << 1 | 1]
        tree[i] = left if left <= right else right

    return tree, size

def first_leq(tree, size, n, start, x):
    """First index >= start with a[index] <= x, or n if none exists."""
    if start >= n:
        return n

    p = start + size

    while p:
        if p & 1:
            if tree[p] <= x:
                while p < size:
                    left = p << 1
                    if tree[left] <= x:
                        p = left
                    else:
                        p = left | 1
                pos = p - size
                return pos if pos < n else n
            p += 1
        p >>= 1

    return n

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    max_a = max(a)

    # buckets[v] contains packed horizontal and vertical records
    # having modulo-state value v.
    buckets = [[] for _ in range(max_a + 1)]

    # ------------------------------------------------------------
    # Left-to-right states.
    #
    # Record:
    #   type = 0
    #   coord = first R for which the state is active
    #   field1 = last R for which the state is active
    #   field2 = fixed L
    #
    # Packed as:
    #   coord << 35 | field1 << 17 | field2
    # ------------------------------------------------------------
    tree, size = build_min_tree(a)

    for L in range(n):
        now = a[L]
        j = L

        while True:
            p = first_leq(tree, size, n, j + 1, now)

            if p == n:
                end = n - 1
                buckets[now].append((j << 35) | (end << SHIFT) | L)
                break

            end = p - 1
            buckets[now].append((j << 35) | (end << SHIFT) | L)

            now %= a[p]
            j = p

    # ------------------------------------------------------------
    # Right-to-left states.
    #
    # Generate them as left-to-right states on the reversed array.
    #
    # Record:
    #   type = 1
    #   coord = fixed R
    #   field1 = smallest allowed L
    #   field2 = largest allowed L
    #
    # The type bit is bit 34.
    # ------------------------------------------------------------
    rev = a[::-1]
    tree, size = build_min_tree(rev)

    for s in range(n):
        now = rev[s]
        j = s
        original_r = n - 1 - s

        while True:
            p = first_leq(tree, size, n, j + 1, now)

            if p == n:
                end = n - 1
                lo = n - 1 - end
                hi = n - 1 - j

                record = (
                    (original_r << 35)
                    | (1 << 34)
                    | (lo << SHIFT)
                    | hi
                )
                buckets[now].append(record)
                break

            end = p - 1
            lo = n - 1 - end
            hi = n - 1 - j

            record = (
                (original_r << 35)
                | (1 << 34)
                | (lo << SHIFT)
                | hi
            )
            buckets[now].append(record)

            now %= rev[p]
            j = p

    # ------------------------------------------------------------
    # For each value, count intersections between horizontal
    # and vertical state rectangles.
    # ------------------------------------------------------------
    bit = [0] * (n + 1)
    tag = [0] * (n + 1)
    stamp = 0
    answer = 0

    for bucket in buckets:
        if not bucket:
            continue

        bucket.sort()
        stamp += 1

        heap = []

        for rec in bucket:
            typ = (rec >> 34) & 1
            coord = rec >> 35
            x1 = (rec >> SHIFT) & MASK
            x2 = rec & MASK

            if typ == 0:
                # Horizontal state:
                # active for R in [coord, x1],
                # fixed L = x2.
                end = x1
                point = x2

                idx = point + 1
                while idx <= n:
                    if tag[idx] != stamp:
                        tag[idx] = stamp
                        bit[idx] = 1
                    else:
                        bit[idx] += 1
                    idx += idx & -idx

                heapq.heappush(heap, (end << SHIFT) | point)

            else:
                # Vertical state:
                # fixed R = coord,
                # allowed L in [x1, x2].
                while heap and (heap[0] >> SHIFT) < coord:
                    item = heapq.heappop(heap)
                    point = item & MASK

                    idx = point + 1
                    while idx <= n:
                        bit[idx] -= 1
                        idx += idx & -idx

                # Fenwick range sum [x1, x2].
                idx = x2 + 1
                right_sum = 0
                while idx:
                    if tag[idx] == stamp:
                        right_sum += bit[idx]
                    idx -= idx & -idx

                idx = x1
                left_sum = 0
                while idx:
                    if tag[idx] == stamp:
                        left_sum += bit[idx]
                    idx -= idx & -idx

                answer += right_sum - left_sum

        bucket.clear()

    print(answer)

if __name__ == "__main__":
    solve()
```线段树存储最小值而不是实际的模结果。 这就足够了，因为下一个位置可以改变当前值`x`正好是数组值最多为的第一个位置`x`。 这`first_leq`例程直接搜索后缀，避免围绕 RMQ 查询进行单独的二进制搜索。 

从左到右循环记录`[j,end]`因为该间隔中的每个右端点都会看到完全相同的累积值。 状态仅在以下时刻发生变化`p`， 在哪里`a[p] <= now`，并且在继续之前执行模运算`p`。 

反向传球需要仔细注意坐标。 反向索引`q`对应原始索引`n-1-q`。 因此反转区间`[j,end]`变为原始左端点区间`[n-1-end,n-1-j]`，而原始右端点固定为`n-1-s`。 

使用压缩整数而不是 Python 元组，因为可以`O(n log A)`记录。 打包字段大大减少了内存消耗，并且还通过扫描坐标和记录类型为记录提供了自然的排序顺序。 类型`0`用于水平记录和类型`1`对于垂直记录，因此在该坐标处的垂直查询之前处理从同一坐标开始的水平记录。 

芬威克树为每个活动的固定左端点存储一个计数。 堆会跟踪这些水平间隔何时停止活动。 在处理垂直查询之前`R`，每个水平间隔之前结束`R`被删除。 间隔恰好结束于`R`保持活动状态，这是所需的包含边界条件。 

时间戳数组阻止我们在处理每个值后清除整个芬威克树。 只有在当前值桶期间触及的位置才被视为已初始化。 这很重要，因为最多可以有`3 * 10^5`不同的可能模值。 

Python 的任意精度整数也消除了答案中的溢出问题。 最大可能的答案是`5000050000`。 

## 工作示例

 ### 示例 1

 官方第一个样本是```
2
5 5
```它的答案是`3`。 

左状态和右状态可以总结如下。 

| 方向 | 固定端点| 状态值| 可变终点间隔 |
 | --- | --- | --- | --- |
 | 左|`L=1`|`5`|`R=1..1`|
 | 左|`L=1`|`0`|`R=2..2`|
 | 左|`L=2`|`5`|`R=2..2`|
 | 对|`R=1`|`5`|`L=1..1`|
 | 对|`R=2`|`5`|`L=2..2`|
 | 对|`R=2`|`0`|`L=1..1`|

 为了价值`5`，扫描发现`(1,1)`和`(2,2)`。 为了价值`0`，它发现`(1,2)`。 总计为`3`。 

该示例演示了为什么相等的相邻值必须创建一个新状态。 操作`5 % 5`将累计值从`5`到`0`，因此将等除数视为无害会丢失长度二段。 

### 示例 2

 第二个样本是```
3
8 3 5
```有答案`4`。 

从左到右的状态是

 | 固定的`L`| 当前状态值 | 正确的端点 |
 | --- | --- | --- |
 |`1`|`8`|`1..1`|
 |`1`|`2`|`2..3`|
 |`2`|`3`|`2..3`|
 |`3`|`5`|`3..3`|

 例如，开始于`L=1`, 最多第一个值`8`是`3`， 所以`8 % 3 = 2`。 由于剩余价值`5`大于`2`，结果保持`2`通过`R=3`。 

从右到左的状态是

 | 固定的`R`| 当前状态值 | 左端点|
 | --- | --- | --- |
 |`1`|`8`|`1..1`|
 |`2`|`3`|`1..2`|
 |`3`|`5`|`3..3`|
 |`3`|`2`|`1..2`|

 匹配的交点是

 | 价值| 细分 |
 | --- | --- |
 |`8`|`[1,1]`|
 |`3`|`[2,2]`|
 |`5`|`[3,3]`|
 |`2`|`[1,3]`|

 所以答案是`4`。 

三重`[1,3]`这是一个有趣的案例。 从左边开始它的值是`8 % 3 % 5 = 2`，而从右边看是`5 % 3 % 8 = 2`。 扫描线发现它是水平状态的交点`L=1, R in [2,3]`与垂直状态`R=3, L in [1,2]`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n log A log n)`| 每个端点都有`O(log A)`状态，每个状态都使用线段树搜索，所有状态记录都经过排序和Fenwick操作|
 | 空间|`O(n log A + A)`| 有`O(n log A)`打包状态记录和`O(A)`价值桶 |

 这里`A = max(a_i) <= 3 * 10^5`，因此每个端点仅创建少量状态。 和`n = 10^5`，模数减少的对数因子约为 20。 离线扫描避免了任何段的二次枚举并符合预期`O(n log n log A)`针对此问题描述的方法。 

## 测试用例

 以下线束假设提交的解决方案保存为`solution.py`并暴露了`solve()`从上面的解决方案中可以得到函数。```python
# Test harness for solution.py
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
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run("2\n5 5\n") == "3", "sample 1"
assert run("3\n8 3 5\n") == "4", "sample 2"

# Minimum-size input
assert run("1\n7\n") == "1", "single element"

# All values equal.
# Every segment evaluates to 5 for a singleton and 0 for length >= 2.
# Both directions are identical for every segment.
assert run("3\n5 5 5\n") == "6", "all equal"

# Equal modulo can produce zero, and the boundaries are inclusive.
assert run("4\n4 2 3 2\n") == "6", "zero and boundary handling"

# A length-two segment can fail even when one direction becomes zero.
assert run("2\n6 3\n") == "2", "different two-element results"

# Maximum n and maximum answer.
n = 100000
inp = str(n) + "\n" + " ".join(["300000"] * n) + "\n"
assert run(inp) == "5000050000", "maximum size and 64-bit answer"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / 7`|`1`| 最小尺寸和单例处理 |
 |`3 / 5 5 5`|`6`| 等值和模结果变为零 |
 |`4 / 4 2 3 2`|`6`| 多个状态变化和包含区间边界 |
 |`2 / 6 3`|`2`| 左右模结果不同 |
 |`100000 / 300000 ... 300000`|`5000050000`| 最大尺寸和大答案|

 ## 边缘情况

 单元素情况`1 / 7`产生一种左状态和一种右状态，两者都有值`7`并且都固定在位置`1`。 扫描与它们相交一次，给出答案`1`。 

为了`2 / 5 5`，左边第一个状态是值`5`仅在`R=1`。 在`R=2`，除数等于当前值，因此状态变为零。 从右到左的结构表现得对称。 价值`5`贡献两个单例段，而值`0`贡献`[1,2]`, 给予`3`。 

为了`2 / 6 3`，左侧状态为`L=1`变化自`6`到`0`在第二个元素处。 正确的状态`R=2`遗迹`3`在两个可能的左端点上，因为`3 % 6 = 3`。 由于状态值永远不会与长度为 2 的线段匹配，因此仅保留两个单例交集，从而给出`2`。 

为了`4 / 4 2 3 2`, 段`[2,4]`对于测试区间边界特别有用。 其左结果为`2 % 3 % 2 = 0`，而它的正确结果是`2 % 3 % 2 = 0`，所以必须计算。 算法表示左边的结果`0`作为结束于的间隔`R=4`和正确的结果`0`作为开始于的间隔`L=2`。 由于两个扫描线边界都包含在内，因此保留它们的交集。 

对于最大输入完全由`300000`, 每对`(L,R)`在两个方向上具有相同的结果。 有`100000 * 100001 / 2 = 5000050000`这样的对。 状态压缩在这里特别有效：每个端点只有几个状态，因为第一个相等的值立即将累积值更改为零，之后它保持为零。 

如果您愿意，我还可以提供这篇社论的**更具竞赛风格的精简版本**，保留相同的证明和 Python 实现，但大大减少了说明。
