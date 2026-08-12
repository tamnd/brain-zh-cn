---
title: "CF 102428C - 减少不平等"
description: "每个月，农民的财富都会发生 A 中相应值的变化。加上该月的收入后，财富立即被迫回到区间 [L, U]：高于 U 的值变为 U，低于 L 的值变为 L。"
date: "2026-08-10T08:32:40+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102428
codeforces_index: "C"
codeforces_contest_name: "2019-2020 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 102428
solve_time_s: 452
verified: true
draft: false
---

[CF 102428C - 减少不平等](https://codeforces.com/problemset/problem/102428/C)

 **评级：** -
 **标签：** -
 **求解时间：** 7m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个月，农民的财富变化相应的值`A`。 加上当月的收入后，财富立即被强制回到区间`[L, U]`：以上值`U`变得`U`，以及下面的值`L`变得`L`。 

查询给出起始月份`B`, 结束月份`E`，以及初始财富`X`。 我们必须申请几个月`B`通过`E`按顺序，包括更正`[L,U]`每个月过后，报告最终财富。 

输入包含一个数组`N`月收入，其次是`Q`独立查询。 的价值观`N`和`Q`都可以达到`10^5`，而单个查询可能涵盖所有`N`几个月。 官方存档给出了3秒的时间限制和1024MB的内存限制。 和`10^5`查询，一种涉及每个查询每月的方法最多可以执行`10^10`月份过渡。 这排除了每个查询的线性工作，并要求在预处理后每个查询的大致对数工作。 

有几种边缘情况可能会使看似合理的实现变得错误。 首先，修正会在每个月之后进行，而不仅仅是在月底。 考虑：```
2 1 10
-10 10
1
1 2 5
```财富顺序为`5 -> 1 -> 10`，所以答案是`10`。 一个粗心的解决方案首先将两个收入相加得到`5`，完全忽略了下限改变了第二个月的起点。 

第二个边缘情况是恰好包含一个月的查询。 例如：```
1 1 10
100
1
1 1 5
```答案是`10`。 没有理由将一个月视为空间隔或在添加其收入之前应用修正。 

第三种边缘情况是变得恒定的变换。 考虑：```
2 1 10
8 -8
1
1 2 3
```开始于`3`，第一个月给出`10`，第二个给出`2`，所以答案是`2`。 这两个月之后，每一个足够大的起始值都被强行突破了上限，作文不再是普通的翻译。 仅存储总收入的表示形式是不够的。 

## 方法

 直接方法很简单。 对于每个查询，初始化财富`X`，然后从`B`通过`E`，添加`A[i]`并将结果钳位到`[L,U]`每次添加后。 这是正确的，因为它完全遵循问题描述的每月流程。 

问题在于重复工作量。 如果每个查询都覆盖整个数组，则可以有`Q * N = 10^5 * 10^5 = 10^10`个别月份的更新。 虽然每次更新的时间都是恒定的，但这远远超出了时间限制。 

有用的观察是，整个几个月的间隔可以被视为单个函数。 一个月有收入`a`，变换为

 [
 f(x)=\min(U,\max(L,x+a))。 
]

 乍一看，这看起来很难组合，因为夹紧操作可能会破坏前几个月的部分信息。 然而，这些变换的每个组合都有非常小的表示。 

将一个变换表示为

 [
 f(x)=\min(hi,\max(lo,x+add))。 
]

这里`add`描述函数斜率为一的部分的平移，而`lo`和`hi`描述最终的下部和上部高原。 单月有代表性`(a, L, U)`。 

假设第一个变换是

 [
 f(x)=\operatorname{clamp}(x+s_1,l_1,u_1)
 ]

 下一个转变是

 [
 g(x)=\operatorname{clamp}(x+s_2,l_2,u_2)。 
]

 我们需要组合`g(f(x))`。 在第二个钳位之前，第一个函数的输出移位`s2`，因此其有效范围变为`[l1+s2, u1+s2]`。 如果这个移动范围相交`[l2,u2]`，其组成为

 [
 \运算符名称{钳位}
 \左(
 x+s_1+s_2,
 \max(l_1+s_2,l_2),
 \min(u_1+s_2,u_2)
 \右）。 
]

 如果移动的第一个范围完全低于`l2`，结果不断`l2`。 如果它完全位于上方`u2`，结果不断`u2`。 

这为我们提供了用于组合连续月份的恒定大小的关联运算。 线段树可以存储每个区间的组合变换。 然后查询组合`O(log N)`树节点而不是每月访问一次。 

蛮力方法之所以有效，是因为它明确地模拟了每个状态转换，但当重复模拟相同的长间隔时就会失败。 整个区间可以由三个整数概括这一观察结果让我们可以用区间合成来代替重复模拟。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 最坏情况下的 O(NQ) | 除了输入 | O(1) 太慢了|
 | 最佳 | O(N + Q log N) | O(N + Q log N) | O(N) | 已接受 |

 ## 算法演练

 1. 将每个区间变换表示为`(add, lo, hi)`, 含义

 [
 f(x)=\min(hi,\max(lo,x+add))。 
]

 单月有收入`A[i]`是`(A[i], L, U)`因为农民首先添加`A[i]`然后夹到`[L,U]`。 
2. 定义如何组合两个转换。 假设第一个变换是`(s1,l1,u1)`第二个是`(s2,l2,u2)`。 应用第一个转换后，添加`s2`将其输出范围转移到`[l1+s2,u1+s2]`。 

如果`u1+s2 < l2`，每个可能的值都低于第二个变换的下界，因此复合是常数函数`l2`。 

如果`l1+s2 > u2`，每个可能的值都高于第二个变换的上限，因此复合是常数函数`u2`。 

否则两个范围重叠，并且组合表示为

 [
 s=s_1+s_2,
 ]

 [
 lo=\max(l_1+s_2,l_2),
 ]

 [
 hi=\min(u_1+s_2,u_2)。 
]
 3. 构建线段树。 每片叶子将变形保存一个月。 每个内部节点存储其左子节点变换的组合，然后存储其右子节点变换的组合。 顺序很重要，因为每月的转换是不可交换的。 
4. 查询`[B,E]`，使用标准迭代线段树范围查询来收集覆盖该区间的转换。 从左侧选择的节点按其自然顺序组成。 从右侧选择的节点必须预先添加，因为它们出现在该侧已累积的节点之前。 
5. 通过身份转换启动查询累加器`(0,L,U)`。 因为每一个有效的财富都在于`[L,U]`，这充当`f(x)=x`对于每个可能的输入。 从左到右组合所有选定的节点。 
6. 将所得转换应用到`X`。 结果正是月后的财富`E`，因为线段树变换代表了每个月操作的组成`[B,E]`。 

### 为什么它有效

 关键的不变量是每个线段树节点准确地表示其间隔内所有月份对任何有效起始财富的影响。 一片叶子是正确的，因为它恰好是每月更新一次。 当两个相邻间隔合并时，右侧变换将应用于左侧变换的输出，因此父级表示它们的完整时间顺序。 通过归纳，任何查询分解的根代表整个请求的区间。 由于最终的转换是根据查询的初始财富来评估的`X`，产生的价值正是经过每月校正后的财富。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def combine(s1, l1, u1, s2, l2, u2):
    """
    Return the transformation obtained by applying
    (s1, l1, u1) first and (s2, l2, u2) second.
    """

    shifted_l = l1 + s2
    shifted_u = u1 + s2

    if shifted_u < l2:
        return 0, l2, l2

    if shifted_l > u2:
        return 0, u2, u2

    return (
        s1 + s2,
        max(shifted_l, l2),
        min(shifted_u, u2),
    )

def main():
    n, L, U = map(int, input().split())
    a = list(map(int, input().split()))

    size = 1
    while size < n:
        size <<= 1

    # Each tree node stores (add, low, high).
    add = [0] * (2 * size)
    low = [L] * (2 * size)
    high = [U] * (2 * size)

    for i in range(n):
        add[size + i] = a[i]

    for i in range(size - 1, 0, -1):
        left = i << 1
        right = left | 1

        s1 = add[left]
        l1 = low[left]
        u1 = high[left]

        s2 = add[right]
        l2 = low[right]
        u2 = high[right]

        ns, nl, nu = combine(s1, l1, u1, s2, l2, u2)
        add[i] = ns
        low[i] = nl
        high[i] = nu

    q = int(input())
    out = []

    for _ in range(q):
        B, E, x = map(int, input().split())

        # Convert [B, E] to the half-open interval [B-1, E).
        left = B - 1 + size
        right = E + size

        # Identity transformation on [L, U].
        ls, ll, lu = 0, L, U
        rs, rl, ru = 0, L, U

        while left < right:
            if left & 1:
                ns, nl, nu = combine(
                    ls, ll, lu,
                    add[left], low[left], high[left]
                )
                ls, ll, lu = ns, nl, nu
                left += 1

            if right & 1:
                right -= 1
                ns, nl, nu = combine(
                    add[right], low[right], high[right],
                    rs, rl, ru
                )
                rs, rl, ru = ns, nl, nu

            left >>= 1
            right >>= 1

        # The right accumulator was built by prepending nodes,
        # so the complete interval is left_acc followed by right_acc.
        ss, sl, su = combine(ls, ll, lu, rs, rl, ru)

        x += ss
        if x < sl:
            x = sl
        elif x > su:
            x = su

        out.append(str(x))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这`combine`函数是解决方案的数学核心。 它的第一个转换在第二个转换之前应用，与时间顺序匹配。 明确处理两种不相交的情况，因为否则计算出的下限和上限可能会交叉，这不会描述有效的钳位间隔。 

线段树使用迭代布局。 叶子对应超出的位置`N`被初始化为恒等变换`(0,L,U)`，因此它们不会影响任何实际间隔。 查询使用`[B-1,E)`在内部，这使得右端点具有独占性，并避免在遍历树时进行逐一调整。 

这两个查询累加器是必要的，因为迭代范围查询会以相反的顺序从右侧发现一些节点。 左侧累加器附加转换，而右侧累加器前置它们。 最后组合两个累加器可恢复原始的从左到右的顺序。 

Python 整数具有任意精度，因此累加`add`即使达到`10^5`收入规模`10^6`可以组合。 

## 工作示例

 ### 示例 1

 考虑官方示例中的第一个查询：```
2 5 31
```相关收入为`10, 1, -1, -70`。 开始于`31`，实际财富序列为`41, 41, 40, 1`。 

变换表示进行相同的计算，而无需模拟每种可能的起始财富。 

| 处理月份 | 收入 |`add`|`lo`|`hi`| X = 31 的结果 |
 | ---| ---| ---| ---| ---| ---|
 | 无 | | 0 | 1 | 41 | 41 31 |
 | 2 | 10 | 10 10 | 10 1 | 41 | 41 41 | 41
 | 2 至 3 | 1 | 11 | 11 2 | 41 | 41 41 | 41
 | 2 至 4 | -1 | 10 | 10 1 | 40 | 40 40 | 40
 | 2 至 5 | -70 | -70 -60 | 1 | 1 | 1 |

 最终合成后，变换恒定为`1`。 这抓住了这样一个事实：巨大的负收入迫使所有可能的起始财富在该区间结束时降到下限。 此查询的示例输出是`1`。 

### 第二个例子

 采取：```
4 2 10
7 -6 4 -20
1
1 4 5
```开始于`5`，财富变化如下：```
5 -> 10 -> 4 -> 8 -> 2
```几个月来累积的转变是：

 | 处理月份 | 收入 |`add`|`lo`|`hi`| X = 5 的结果 |
 | ---| ---| ---| ---| ---| ---|
 | 无 | | 0 | 2 | 10 | 10 5 |
 | 1 | 7 | 7 | 2 | 10 | 10 10 | 10
 | 1 到 2 | -6 | 1 | 2 | 4 | 4 |
 | 1 至 3 | 4 | 5 | 6 | 8 | 8 |
 | 1 至 4 | -20 | -20 -15 | -15 2 | 2 | 2 |

 最终函数恒定为`2`。 该表说明了为什么仅存储总收入是不够的。 第 1 个月后的中间上钳位改变了第 2 个月看到的输入。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N + Q log N) | O(N + Q log N) | 构建线段树需要 O(N)，每个查询都会访问 O(log N) 个节点。 |
 | 空间| O(N) | 线段树为每个树节点存储三个整数。 |

 和`N,Q <= 10^5`，预处理是线性的，每个查询仅执行对数工作。 最大总数约为几百万个树操作，而不是`10^10`暴力破解的月更新，因此该方法符合预期的约束。 

## 测试用例

 以下线束假设`main`解决方案中的函数可在同一文件中使用。 它重定向标准输入并捕获标准输出，以便断言执行实际实现。```python
import sys
import io

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        main()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
sample = """\
5 1 41
-10 10 1 -1 -70
10
2 5 31
2 4 30
2 4 29
2 4 28
1 2 20
1 2 10
1 4 11
1 4 10
1 4 40
1 4 41
"""

sample_expected = """\
1
40
39
38
20
11
11
11
40
40
"""

assert run(sample) == sample_expected, "sample 1"

# Minimum-size and fixed-bound case
minimum = """\
1 5 5
123
3
1 1 5
1 1 5
1 1 5
"""

assert run(minimum) == "5\n5\n5\n", "minimum size and L = U"

# Intermediate lower clamp followed by positive income
lower_then_rise = """\
2 1 10
-10 10
1
1 2 5
"""

assert run(lower_then_rise) == "10\n", "intermediate lower clamp"

# Upper and lower boundaries, including single-month queries
boundaries = """\
4 1 10
9 -9 9 -9
5
1 1 1
1 2 1
2 2 10
2 3 10
1 4 5
"""

assert run(boundaries) == "10\n1\n1\n10\n1\n", "boundary transitions"

# All incomes equal, repeatedly hitting the upper bound
all_equal = """\
4 2 8
3 3 3 3
3
1 4 2
1 4 5
2 3 2
"""

assert run(all_equal) == "8\n8\n8\n", "all equal incomes"

# Maximum-size stress test.
# Every query covers the entire array, and every month has income 1.
n = 100000
q = 100000

max_input = (
    f"{n} 1 2\n"
    + ("1 " * (n - 1))
    + "1\n"
    + f"{q}\n"
    + ("1 100000 1\n" * q)
)

max_output = "2\n" * q

assert run(max_input) == max_output, "maximum-size test"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 样品1 |`1, 40, 39, 38, 20, 11, 11, 11, 40, 40`| 完整的官方示例和混合剪辑行为 |
 | 最小情况|`5, 5, 5`|`N = 1`,`L = U`，以及强制恒定变换 |
 | 先降后升|`10`| 中间一个月后夹紧|
 | 边界情况 |`10, 1, 1, 10, 1`| 单月间隔和双向 |
 | 一切平等|`8, 8, 8`| 重复上部剪裁 |
 | 最大尺寸外壳 |`100000`行包含`2`| 最大限度`N`， 最大限度`Q`和对数查询性能 |

 ## 边缘情况

 中间夹的情况是```
2 1 10
-10 10
1
1 2 5
```初始变换是`(0,1,10)`。 第 1 个月将其更改为`(0,1,1)`，因为与查询相关的每个起始值都会减少到以下`1`然后夹到`1`。 撰写第 2 个月的收入`10`产生不断的转变`10`。 将其应用到`5`给出`10`。 仅前缀和方法会错误地生成`5`。 

单月情况是```
1 1 10
100
1
1 1 5
```线段树包含一个叶子`(100,1,10)`。 查询选择该叶子，应用恒等累加器，并计算结果函数`5`。 中间值为`105`，即上面的`10`，所以答案是`10`。 

常量变换的情况是```
2 1 10
8 -8
1
1 2 3
```第一个月后，转变是`(8,1,10)`。 当第二个月组成时，其转变为`-8`将第一个转换的有效输出间隔从`[1,10]`到`[-7,2]`。 与它相交`[1,10]`给出`[1,2]`，而总位移为零。 最终的变换是`clamp(x,1,2)`，所以从`3`给出`2`。 这正是仅基于总和的表示无法表达的行为。 

等式约束的情况是```
1 5 5
123
1
1 1 5
```因为`L`和`U`是平等的，每一种可能的财富都已经被迫精确地`5`。 叶子变换为`(123,5,5)`，恒定为`5`，查询返回`5`。 即使允许的间隔仅包含一个值，组合逻辑仍然有效。
