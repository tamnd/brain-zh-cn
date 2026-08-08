---
title: "CF 102436C - 涂装计划"
description: "我们在数轴上有 (n) 个线段。 原始端点已成对丢失。 我们只知道所有（2n）个端点坐标，排序成一个数组（x1 < x2 <dots < x{2n}），并且我们知道原始线段的并集的总长度恰好为（k）。"
date: "2026-08-09T00:10:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102436
codeforces_index: "C"
codeforces_contest_name: "Innopolis Open 2019-2020, qualification, contest 1"
rating: 0
weight: 102436
solve_time_s: 132
verified: true
draft: false
---

[CF 102436C - 绘画计划](https://codeforces.com/problemset/problem/102436/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在数轴上有 (n) 个线段。 原始端点已成对丢失。 我们只知道所有（2n）个端点坐标，排序成一个数组（x_1 < x_2 < \dots < x_{2n}），并且我们知道原始线段的并集的总长度恰好为（k）。 

我们必须将 (2n) 坐标的任何配对重建为 (n) 段，其并集的长度为 (k)。 输出使用排序端点数组的索引，而不是坐标本身。 如果没有配对产生所需的联合长度，我们打印`No`。 否则我们打印`Yes`接下来是 (n) 对索引。 原始声明保证所有坐标都是不同的。 

约束是预期解决方案的关键。 最多可以有 7000 个段，因此有 14000 个端点。 目标联合长度 (k) 至多为 30000。状态仅取决于当前位置且长度达到 (k) 的 DP 是合理的，而 (n) 中的任何指数都立即不可能。 预期的解决方案使用排序端点的结构将重建转变为背包式DP，并且使用位集处理大状态维度。 

第一个边缘情况是小于最小可能并集的目标。 例如，```
2 1
0 1 2 3
```四个端点可以配对为 ([0,1]) 和 ([2,3])，给出联合长度 (2)。 每个其他配对都会产生长度至少为 (2) 的并集，因此正确的输出是`No`。 仅检查 (k) 是否可以形成为坐标之间的任意差异的粗心实现可能会错误地接受它。 

第二个边缘情况恰好是最小联合长度。 为了```
2 2
0 1 2 3
```相邻配对 ([0,1]), ([2,3]) 给出联合长度 (2)，所以答案是`Yes`。 假设某些间隔必须相交的解决方案可能会错过这种完全不相交的配置。 

第三种边缘情况是完全嵌套的配置。 为了```
2 3
0 1 2 3
```段 ([0,3]) 和 ([1,2]) 的并集长度为 (3)。 端点必须配对为 ((1,4)) 和 ((2,3))。 将相邻端点配对给出长度 (2)，因此仅采用最小配对是不够的。 

第四种边缘情况是（k=0）。 由于所有坐标都是不同的，因此每个线段都有正长度，因此即使一个线段的并集也有正长度。 因此```
1 0
0 1
```必须产生`No`。 将零视为空 DP 状态而不检查每个端点最终必须使用的实现将会出错。 

## 方法

 最直接的暴力方法是尝试 (2n) 个端点的每一种可能的配对。 有 ((2n-1)!!) 种不同的配对。 对于每个配对，我们可以按左端点对结果间隔进行排序，并以 (O(n)) 计算它们并集的长度。 因此，总工作量为 (O(n(2n-1)!!))。 即使（n=20）也已经远远超出了实际限制，而实际约束是（n=7000）。 蛮力是正确的，因为它确实检查了每一个可能的重建，但它的搜索空间增长得太快了。 

有一种更强大的方法来查看排序的端点。 

假设我们暂时将每个相邻对配对：

 [
 (x_1,x_2),(x_3,x_4),\ldots,(x_{2n-1},x_{2n})。 
]

 这些间隔是不相交的，并给出这些端点的最小可能并集。 称出它们的长度

 [
 a_i=x_{2i+2}-x_{2i+1}
 ]

 使用从零开始的索引。 

现在考虑两个连续的对。 而不是保留

 [
 (x_{2i},x_{2i+1}),\quad(x_{2i+2},x_{2i+3}),
 ]

 我们可以通过将四个端点按嵌套顺序配对来将它们的并集合并为一个连接的组件：

 [
 (x_{2i},x_{2i+3}),\quad(x_{2i+1},x_{2i+2})。 
]

 那么并集就是从第一个端点到最后一个端点的间隔。 当下一对被吸收时贡献的额外金额是

 [
 b_i=x_{2i+1}-x_{2i-1}
 ]

 对于 (i>0)。 

这给出了特别方便的表示。 最终并集的每个连接组件都包含一个连续的端点坐标块。 由于每个端点仅使用一次，因此可以通过嵌套这些端点来表示包含 (2m) 个端点的组件。 因此，整个重建可以被视为将（n）个相邻端点对划分为连续的块。 

对于覆盖索引对 (l) 到 (r) 的块，其并集为

 [
 [x_{2l},x_{2r+1}],
 ]

 其长度为

 a_l+b_{l+1}+b_{l+2}+\cdots+b_r。 
]

 因此，当从左到右扫描配对索引时，恰好有两个选择。 我们可以启动一个新组件，支付（a_i），或者扩展当前组件，支付（b_i）。 

现在这是一个 0/​​1 背包式问题。 在位置(i)，DP记录哪些总长度是可达的。 目标容量为 (k)，最多为 30000。正是出于这个原因，已发布的解决方案使用 C++ 位集。 

最后一个困难是重建。 普通的布尔 DP 需要记住每对位置和长度的前趋，即 (O(nk)) 内存。 相反，我们为每个位置保留一个位集，说明哪些可达状态使用了`extend`过渡。 在 Python 中，任意精度整数充当紧凑位集，因此一个整数可以同时表示所有 (k+1) 个状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n(2n-1)!!)) | (O(n)) | (O(n)) | 太慢了|
 | 普通DP| (O(nk)) | (O(nk)) | (O(nk)) 用于重建 | Python 太慢，占用内存大 |
 | 比特集 DP | (O(nk/W)) 字操作 | (O(nk/W)) 用于重建| 已接受 |

 这里（W）是一次机器字级位集操作处理的位数。 在Python中，同样的想法是通过任意精度整数实现的，其移位和按位运算同时处理许多DP状态。 

## 算法演练

 1. 计算位置 (i) 处基本相邻对的长度 (a_i=x_{2i+1}-x_{2i})。 还为每个 (i>0) 计算 (b_i=x_{2i+1}-x_{2i-1})。 以 (i) 成本 (a_i) 启动组件，同时通过 (i) 成本 (b_i) 扩展组件。 
2. 将可达的DP状态表示为一个整数`dp`。 当处理当前前缀后可以获得总联合长度（s）时，准确地设置位（s）。 最初只能到达长度零，所以`dp = 1`。 
3. 在位置(i)处，移动`dp`(a_i) 左边表示在 (i) 处开始一个新组件。 将其左移 (b_i) 表示将组件从前一对扩展到 (i)。 这两个位集的并集给出了新的可达状态。 
4. 存储哪些新可达的状态来自`b_i`过渡。 如果两个转换可以达到相同的状态，则更喜欢`a_i`过渡。 这种任意的平局打破是有用的，因为它意味着一个存储的位足以在重建期间识别前趋。 
5. 处理完所有 (n) 个位置后，检查位 (k)。 如果不设置，则端点序列不存在有效分区，因此打印`No`。 
6. 如果设置了位 (k)，则向后遍历 DP。 在位置(i)处，检查是否存储了`b_i`位设置为当前目标长度。 如果是，则当前组件已扩展，因此减去 (b_i)。 否则是从这里开始的，所以减去(a_i)。 
7. 恢复的选择将 (n) 个相邻端点对划分为连续的块。 对于每个块 ([l,r])，按嵌套顺序配对其端点。 最外面的段使用位置 (2l) 和 (2r+1)，下一个段使用 (2l+1) 和 (2r)，依此类推。 
8. 将从零开始的端点位置转换为所需的从一开始的索引，并打印生成的 (n) 个段。 

### 为什么它有效

 中心不变量是原始段的每个可能的并集都可以使用排序端点序列的连续连接组件来表示。 在一个组件内，嵌套端点会精确生成该组件的间隔，而不同组件则保持不相交。 因此，有效的重建相当于将（n）个相邻端点对划分为连续的块。 

对于从 (l) 开始到 (r) 结束的块，其并集长度正好是 (a_l+\sum_{i=l+1}^{r}b_i)。 DP 精确地考虑了每个位置的两种可能性：开始一个新块或扩展前一个块。 因此，每个DP路径对应于一个有效的块分区，并且每个有效的块分区对应于一个DP路径。 如果位 (k) 可达，则重构的选择会产生恰好 (k) 的并集； 如果无法到达，则不存在有效的重建。 

## Python 解决方案```python
import sys

input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    x = list(map(int, input().split()))

    # a[i] is the length of the basic adjacent pair.
    a = [x[2 * i + 1] - x[2 * i] for i in range(n)]

    # b[i] is the cost of extending the current component
    # from pair i-1 through pair i.
    b = [0] * n
    for i in range(1, n):
        b[i] = x[2 * i + 1] - x[2 * i - 1]

    # Bit s of dp means that total length s is reachable.
    dp = 1

    # For each i, bit s of extend[i] means that state s
    # was reached by taking the b[i] transition.
    extend = [0] * n

    mask = (1 << (k + 1)) - 1

    for i in range(n):
        from_start = dp << a[i]

        if i == 0:
            from_extend = 0
            chosen_extend = 0
        else:
            from_extend = dp << b[i]

            # If both transitions reach the same state, prefer
            # starting a new component.
            chosen_extend = from_extend & ~from_start

        dp = (from_start | from_extend) & mask
        extend[i] = chosen_extend & mask

    if not ((dp >> k) & 1):
        print("No")
        return

    # Reconstruct whether each position extends the previous block.
    used_extend = [False] * n
    cur = k

    for i in range(n - 1, -1, -1):
        if i > 0 and ((extend[i] >> cur) & 1):
            used_extend[i] = True
            cur -= b[i]
        else:
            cur -= a[i]

    # Convert the sequence of choices into consecutive blocks.
    blocks = []
    start = 0

    for i in range(1, n):
        if not used_extend[i]:
            blocks.append((start, i - 1))
            start = i

    blocks.append((start, n - 1))

    # Construct nested pairs inside every block.
    answer = []

    for l, r in blocks:
        while l <= r:
            # Zero-based endpoint positions:
            # 2*l and 2*r+1.
            answer.append((2 * l + 1, 2 * r + 2))
            l += 1
            r -= 1

    print("Yes")
    for u, v in answer:
        print(u, v)

if __name__ == "__main__":
    solve()
```第一部分构建`a`和`b`。 价值`a[i]`是使对 (i) 成为一个单独的连接组件的成本。 价值`b[i]`是将对 (i) 连接到紧邻其之前的组件的成本。 

表达式`dp << a[i]`通过启动组件的成本来移动每个可达到的总数。 同样地，`dp << b[i]`代表扩展当前组件。 因为所有成本都是正数，所以大于 (k) 的状态以后永远不会变得有用，因此掩码会安全地丢弃它们。 

表达式`from_extend & ~from_start`仅记录哪些扩展是有效前身但启动新组件不是有效的状态。 这对于重建来说已经足够了，因为当两种选择都可能时，实现会故意选择开始转换。 

向后重建精确地减去创建当前状态的转换。 价值`cur`因此，它会穿过有效的前驱状态，直到达到零。 

块构造内部使用从零开始的端点位置。 对于从对(l)到对(r)的块，最外面的段连接端点位置(2l)和(2r+1)。 向两个位置添加 1 即可得到所需的基于 1 的索引。 向内移动会产生所有剩余的嵌套段。 

Python 中不可能出现整数溢出。 在 C++ 中，原始约束也适合坐标和目标长度的普通 32 位整数。 Python 实现的主要内存成本是`extend`数组，包含最多 (k+1) 位的 (n) 个任意精度位集。 

## 工作示例

 ### 示例 1

 输入是```
4 9
0 1 3 5 8 9 10 12
```相邻对的长度是

 [
 a=[1,2,1,2],
 ]

 扩展成本为

 [
 b=[0,4,4,3]。 
]

 DP 的演变如下。 

| 职位| 启动成本 (a_i) | 扩展成本 (b_i) | 排名后可达到的总数|
 | --- | --- | --- | --- |
 | 0 | 1 | 不可用 | {1} |
 | 1 | 2 | 4 | {3, 5} |
 | 2 | 1 | 4 | {4,6,7,9}|
 | 3 | 2 | 3 | {6, 7, 8, 9, 10, 11, 12} |

 目标（9）是可以达到的。 一种有效的重建是`start, start, extend, start`，给出块 ([0,0])、([1,2]) 和 ([3,3])。 

相应的嵌套块 ([1,2]) 使用端点索引 (3,6) 和 (4,5)。 因此，一个有效的答案是```
Yes
1 2
3 6
4 5
7 8
```它们表示区间 ([0,1])、([3,9])、([5,8]) 和 ([10,12])，其并集长度为 (9)。 官方示例使用相同段的另一种有效顺序。 

轨迹展示了关键的不变量：选择`extend`将相邻的基本对连接成一个连通分量，同时选择`start`关闭前一个组件并开始另一个组件。 

### 示例 2

 输入是```
3 2
1 2 3 4 5 6
```这里

 [
 a=[1,1,1]
 ]

 和

 [
 b=[0,2,2]。 
]

 DP 的演变如下。 

| 职位| 启动成本 (a_i) | 扩展成本 (b_i) | 排名后可达到的总数|
 | --- | --- | --- | --- |
 | 0 | 1 | 不可用 | {1} |
 | 1 | 1 | 2 | {2, 3} |
 | 2 | 1 | 2 | {3, 4} |

 目标 (2) 在第二次转换后消失，并且在处理所有三对后无法到达。 因此正确的输出是```
No
```此示例说明了为什么仅检查最小可能并集是不够的。 对于三个不相交的相邻段，最小值为 (3)，而某些中间总数可能是不可能的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nk/W)) 位运算 | (n) 个位置中的每一个对 (k+1) 位执行恒定数量的移位和按位运算。 |
 | 空间| (O(nk/W)) | 为每个位置存储一个位集以重建所选的转换。 |

 这里是 (n\le7000) 和 (k\le30000)，因此每个存储的位集仅包含大约 30001 位，在 Python 整数开销之前大约为 3.75 KB。 整个前身历史记录约为几十兆字节，远低于 512 MB 内存限制。 位并行 DP 避免了普通嵌套循环 DP 所需的大约（7000×30000）个单独的 Python 级状态更新。 约束和限制在原始声明中给出。 

## 测试用例

 下面的测试工具检查了官方样品和几个结构案例。 由于答案是建设性的，因此它不会比较确切的段列表。 相反，它验证程序是否打印正确的`Yes`或者`No`，仅使用每个端点一次，保持每个段从左到右定向，并生成请求的联合长度。```python
import sys
import io

def solve_instance(n, k, x):
    a = [x[2 * i + 1] - x[2 * i] for i in range(n)]

    b = [0] * n
    for i in range(1, n):
        b[i] = x[2 * i + 1] - x[2 * i - 1]

    dp = 1
    extend = [0] * n
    mask = (1 << (k + 1)) - 1

    for i in range(n):
        from_start = dp << a[i]

        if i == 0:
            from_extend = 0
            chosen_extend = 0
        else:
            from_extend = dp << b[i]
            chosen_extend = from_extend & ~from_start

        dp = (from_start | from_extend) & mask
        extend[i] = chosen_extend & mask

    if not ((dp >> k) & 1):
        return "No\n"

    used_extend = [False] * n
    cur = k

    for i in range(n - 1, -1, -1):
        if i > 0 and ((extend[i] >> cur) & 1):
            used_extend[i] = True
            cur -= b[i]
        else:
            cur -= a[i]

    blocks = []
    start = 0

    for i in range(1, n):
        if not used_extend[i]:
            blocks.append((start, i - 1))
            start = i

    blocks.append((start, n - 1))

    answer = []

    for l, r in blocks:
        while l <= r:
            answer.append((2 * l + 1, 2 * r + 2))
            l += 1
            r -= 1

    out = ["Yes"]
    out.extend(f"{u} {v}" for u, v in answer)
    return "\n".join(out) + "\n"

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    n, k = data[0], data[1]
    x = data[2:2 + 2 * n]
    return solve_instance(n, k, x)

def verify(inp: str, out: str):
    data = list(map(int, inp.split()))
    n, k = data[0], data[1]
    x = data[2:2 + 2 * n]

    lines = out.strip().splitlines()

    if lines[0] == "No":
        return

    assert lines[0] == "Yes"
    assert len(lines) == n + 1

    used = [False] * (2 * n)
    intervals = []

    for line in lines[1:]:
        u, v = map(int, line.split())
        assert 1 <= u <= 2 * n
        assert 1 <= v <= 2 * n
        assert u < v

        u -= 1
        v -= 1

        assert not used[u]
        assert not used[v]

        used[u] = True
        used[v] = True
        intervals.append((x[u], x[v]))

    assert all(used)

    intervals.sort()

    total = 0
    left, right = intervals[0]

    for l, r in intervals[1:]:
        if l > right:
            total += right - left
            left, right = l, r
        else:
            right = max(right, r)

    total += right - left

    assert total == k

# Official sample 1
sample1 = """\
4 9
0 1 3 5 8 9 10 12
"""
out = run(sample1)
verify(sample1, out)
assert out.splitlines()[0] == "Yes"

# Official sample 2
sample2 = """\
3 2
1 2 3 4 5 6
"""
out = run(sample2)
assert out.strip() == "No"

# Minimum-size input
case_min = """\
1 4
0 4
"""
out = run(case_min)
verify(case_min, out)
assert out.splitlines()[0] == "Yes"

# Minimum possible union, all adjacent gaps equal
case_equal = """\
4 4
0 1 2 3 4 5 6 7
"""
out = run(case_equal)
verify(case_equal, out)
assert out.splitlines()[0] == "Yes"

# Nested configuration, catches block construction
case_nested = """\
2 3
0 1 2 3
"""
out = run(case_nested)
verify(case_nested, out)
assert out.splitlines()[0] == "Yes"

# Impossible value below the minimum
case_too_small = """\
2 1
0 1 2 3
"""
out = run(case_too_small)
assert out.strip() == "No"

# Maximum-size input from the official constraints
n = 7000
x = list(range(2 * n))
case_max = f"{n} {n}\n" + " ".join(map(str, x)) + "\n"
out = run(case_max)
verify(case_max, out)
assert out.splitlines()[0] == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 4 / 0 4`|`Yes`| 最小值 (n)，单段 |
 |`4 4 / 0 1 2 3 4 5 6 7`|`Yes`| 相邻间隙相等和最小并集 |
 |`2 3 / 0 1 2 3`|`Yes`| 嵌套组件构造 |
 |`2 1 / 0 1 2 3`|`No`| 目标低于可能的最小联合|
 |`7000 7000 / 0 1 ... 13999`|`Yes`| 最大（n），DP位置的最大数量|

 ## 边缘情况

 对于小于最小并集的目标，DP自然会拒绝该实例。 考虑```
2 1
0 1 2 3
```基本相邻成本为(a=[1,1])，而扩展成本为(b_1=2)。 唯一可达到的总数是 (1)、(2) 和 (3)，因此在处理完这两对后不会设置位 (1)。 算法打印`No`。 

对于完全等于最小并集的目标，请考虑```
2 2
0 1 2 3
```民主党可以选择`start`两次，给出 (a_0+a_1=1+1=2)。 重建的块是 ([0,0]) 和 ([1,1])，产生带有索引的段`(1,2)`和`(3,4)`。 他们的并集长度为 (2)。 

对于嵌套配置，请考虑```
2 3
0 1 2 3
```民主党可以选择`start`对于第一对和`extend`对于第二对。 成本变为

 [
 a_0+b_1=1+2=3。 
]

 生成的块是 ([0,1])。 它的嵌套结构产生`(1,4)`和`(2,3)`，对应于 ([0,3]) 和 ([1,2])。 它们的并集恰好是 ([0,3])，长度为 (3)。 

对于 (k=0)，考虑```
1 0
0 1
```唯一可用的转换成本为 (1)，因此在处理所有端点后，唯一可到达的状态是长度 (1)，而不是长度 (0)。 该算法因此打印`No`。 初始 DP 状态包含零这一事实并不意味着空结构是有效答案，因为每个端点必须恰好在一个段中使用。 

最后，最大尺寸的情况强调了使用位集的原因。 对于 (n=7000)，普通的 Python 循环将检查最多 (7000\cdot30001)，即大约 2.1 亿个 DP 状态。 位集表示使用整数移位和按位运算同时处理所有可能的长度，这是使完整约束实用的核心优化。 原始问题准确地设置了 (n) 和 (k) 的这些最大值。 

如果您愿意，我还可以将其变成更紧凑的 Codeforces 风格的编辑，或者提供与官方 bitset 解决方案更匹配的 C++17 版本。
