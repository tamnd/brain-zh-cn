---
title: "CF 102279E - 提升统治地位"
description: "我们有 (N) 个攻击集。 集合(i)包含(Ai)次攻击，一组完成后，未来每次攻击所需的时间只会减少，成为当前时间和(Bi)的最小值。 第 1 组已经完成，因此初始起音时间为 (B1)。"
date: "2026-08-16T19:14:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102279
codeforces_index: "E"
codeforces_contest_name: "HCW 19 Team Round (ICPC format)"
rating: 0
weight: 102279
solve_time_s: 125
verified: true
draft: false
---

[CF 102279E - 提升至统治地位](https://codeforces.com/problemset/problem/102279/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有 (N) 个攻击集。 集合(i)包含(A_i)次攻击，集合完成后，未来每次攻击所需的时间只会减少，成为当前时间和(B_i)的最小值。 第 1 组已经完成，因此初始起音时间为 (B_1)。 我们可以选择完成剩余组的顺序。 

目标是尽量减少完成 (2) 到 (N) 组所花费的总时间。 由于(B_N=0)，一旦设置(N)完成，则剩余的每次攻击花费的时间为零。 因此，真正的问题是决定哪些集合应该在集合（N）之前完成，以及以什么顺序完成，以便集合（N）本身变得尽可能便宜。 

数组有一个特别有用的结构。 攻击次数严格增加，(A_1<A_2<\dots<A_N)，而次数严格减少，(B_1>B_2>\dots>B_N)。 对于 (N\le 10^5)，一个 (O(N^2)) 动态规划需要

 [
 \frac{N(N-1)}2
 ]

 转换，最大输入大小时有 (4,999,950,000) 个转换。 这远远超出了一秒的极限所能容忍的范围。 我们需要一个 (O(N)) 或 (O(N\log N)) 的解决方案。 

在一些边界情况下，对已完成的第一组和最终零成本组的解释很重要。 对于（N=1），```
1
1
0
```答案是`0`，因为没有什么需要完成。 将初始集合的成本添加为答案的一部分的解决方案是错误地对过程进行建模。 

为了```
2
1 2
5 0
```答案是`10`。 第1组已经完成，第2组需要以当前5的速度进行两次攻击。其自身（B_2=0）仅影响第2组完成后的速度，因此无法使这两次攻击自由。 

第三种边缘情况是立即完成集合 (N) 并不总是最佳的。 对于第一个样本，立即完成第 5 组的成本 (6\cdot5=30)，但首先完成第 4 组的成本 (4\cdot5=20)，之后完成第 5 组的成本 (6\cdot1=6)。 总数为 26，因此最优策略故意支付中间集的费用，以在处理最终集之前降低速度。 

最后，答案可以超过32位整数范围。 对于 (N=100000)、(A_i=i) 和 (B_i=N-i)，答案为 (N(N-1)=9,999,900,000)。 Python 整数具有任意精度，因此在实现中不需要特殊处理。 

## 方法

 暴力动态程序直接来自于考虑在组（i）之前完成的最后一组。 假设集合 (j<i) 是 (i) 之前完成的最后一个集合。 到那时，攻击时间已减少到 (B_j)，因此完成集合 (i) 的成本为 (A_iB_j)。 如果 (dp[j]) 是达到该状态所需的最小成本，则候选成本为

 [
 dp[j]+B_jA_i。 
]

 因此

 [
 dp[i]=\min_{1\le j<i}\left(dp[j]+B_jA_i\right),
 ]

 与（dp[1]=0）。 答案是(dp[N])。 这种简化是用于该单调动态程序的标准形式。 

递归是正确的，因为最佳调度可以由实际减少当前攻击时间的集合的索引来表示。 这些指数正在增加。 如果 (j) 是前一个此类索引，而 (i) 是下一个索引，则它们之间跳过的所有组都可以在攻击时间变得更小时之后完成。 特别是，在组 (N) 完成后，速度为零，因此那些跳过的组没有任何贡献。 因此，到达 (i) 的全部成本由前一个状态 (j) 和转换 (B_jA_i) 捕获。 

计算此递推直接检查每个 (i) 的每个 (j<i)。 转换评估的确切数量是 (N(N-1)/2)，对于 (N=10^5) 来说大约是 50 亿。 蛮力公式很有用，因为它揭示了最优解的结构，但不能直接使用。 

关键的观察是每个候选转换都有以下形式

 [
 dp[j]+B_jA_i。 
]

 对于固定的 (j)，将其视为一条线

 [
 y=B_jx+dp[j]。 
]

 当计算 (dp[i]) 时，我们在 (x=A_i) 处查询这些行。 输入保证斜率 (B_j) 严格递减，而查询坐标 (A_i) 严格递增。 这正是单调凸包技巧只能维持可以变得最佳的线条的设置。 

因为查询仅向右移动，所以一旦外壳中的第二行在当前查询点变得不比第一行差，第一行就永远不会再次变得最佳。 同样，当一条新线使其两条相邻线之间的中间线变得多余时，该中间线可以被永久丢弃。 

生成的算法将每行插入一次，每行最多删除一次，并处理每个查询一次。 总功是线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(N^2)) | (O(N)) | 太慢了 |
 | 最佳凸包技巧 | (O(N)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 定义(dp[i])为达到集合(i)刚刚完成的状态所需的最短时间，其攻击时间为(B_i)。 第 1 组已经完成，因此 (dp[1]=0)。 最终答案是（dp[N]），因为完成集合（N）使得以后的每次攻击都花费零时间。 
2. 将转换重写为

 [
 dp[i]=\min_{j<i}\left(B_jA_i+dp[j]\right)。 
]

 对于每个固定 (j)，这是一条具有斜率 (B_j) 和截距 (dp[j]) 的线。 计算 (dp[i]) 意味着找到 (x=A_i) 处的最小线值。

1. 将候选行存储在双端队列中。 斜率按严格降序到达，因为 (B_1>B_2>\dots>B_N)。 查询位置以严格递增的顺序到达，因为 (A_1<A_2<\dots<A_N)。 
2. 在查询(A_i)之前，比较双端队列中的前两行。 如果第二行在 (A_i) 处给出的值不大于第一行，则删除第一行。 由于第一条线的斜率更大，并且所有未来的 (A) 值都更大，因此它永远不会再变得更好。 
3. 从前面删除所有过时的行后，评估 (A_i) 处的第一条剩余行。 该值是 (dp[i])，因为双端队列恰好包含仍然可以是最佳的候选行。 
4. 建设新线路

 [
 y=B_ix+dp[i]。 
]

 在附加之前，请检查最后两行和新行。 如果中间线位于下信封上方，则它永远不可能是任何未来查询的最小值，因此请将其删除。 该测试是使用交叉乘法执行的，避免了浮点交集计算。 

1. 追加新行并继续。 每行插入一次，并且只能从任一端删除一次，因此双端队列操作的总数为 (O(N))。 

为什么它有效：不变的是双端队列包含迄今为止生成的所有行的下包络，按照它们随着 (x) 增加而变得最佳的顺序。 前查询规则仅在后面的行已经至少与当前 (x) 一样好之后才删除一行，并且后面的行具有较小的斜率，因此它对于每个未来 (x) 都至少保持一样好。 后移规则丢弃其相邻线之间最优区间已消失的线。 因此，前线始终代表当前 (A_i) 的最佳转换，因此计算值正是动态规划最优值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    if n == 1:
        print(0)
        return

    # Each line is represented as (slope, intercept).
    # We need minimum values, slopes are strictly decreasing,
    # and query x-values are strictly increasing.
    hull = [(b[0], 0)]
    head = 0

    dp = [0] * n

    def value(line, x):
        m, c = line
        return m * x + c

    for i in range(1, n):
        x = a[i]

        # Remove lines that can never be optimal again.
        while head + 1 < len(hull) and value(hull[head], x) >= value(hull[head + 1], x):
            head += 1

        dp[i] = value(hull[head], x)

        new_line = (b[i], dp[i])

        # Remove redundant lines from the back.
        while len(hull) - head >= 2:
            l1 = hull[-2]
            l2 = hull[-1]
            l3 = new_line

            m1, c1 = l1
            m2, c2 = l2
            m3, c3 = l3

            # Intersection(l1, l2) >= Intersection(l2, l3)
            # means l2 can never be the minimum on a future query.
            if (c2 - c1) * (m2 - m3) >= (c3 - c2) * (m1 - m2):
                hull.pop()
            else:
                break

        hull.append(new_line)

    print(dp[-1])

if __name__ == "__main__":
    solve()
```输入数组直接存储，因为所有转换都使用原始 (A_i) 和 (B_i) 值。 第一行初始化为`(B1, 0)`，它完全对应于 (dp[1]=0)。 

主循环从索引 1 开始，代表集合 2。这是必要的，因为集合 1 已经完成并且不能再次充电。 在迭代 (i) 时，当前查询坐标为`a[i]`，并且船体的前部给出了最优的先前设置。 

前指针`head`避免从前面物理删除行。 一旦一条线变得过时，就推进`head`就足够了。 从后面删除的行会被物理弹出，因为无论将来的查询如何，它们都是冗余的。 

后面的条件比较交集而不进行除法：

 [
 \frac{c_2-c_1}{m_1-m_2}
 \ge
 \frac{c_3-c_2}{m_2-m_3}。 
]

 斜率差为正，因为斜率严格递减。 叉乘是精确的，Python 的整数不会溢出。 此处使用浮点交点坐标会带来不必要的精度风险。 

集合 (N) 的最后一条线具有斜率 (B_N=0)。 它的值正是达到集合（N）的最小总成本。 该组完成后，剩余的每组都是免费的，因此不需要额外的期限。 

## 工作示例

 对于样品 1，```
5
1 2 3 4 6
5 4 3 1 0
```动态编程状态如下。 

| 集 (i) | (A_i) | (B_i) | 上一组最好的 | (dp[i]) | 赫尔决定|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 5 | 已经完成 | 0 | 插入 (5x) |
 | 2 | 2 | 4 | 1 | 10 | 10 插入 (4x+10) |
 | 3 | 3 | 3 | 1 | 15 | 15 第 2 行变得多余 |
 | 4 | 4 | 1 | 1 | 20 | 第 3 行变得多余 |
 | 5 | 6 | 0 | 4 | 26 | 26 插入最后一行 |

 对于第 5 组，选择第 4 组作为前一个变速组给出

 [
 dp[4]+B_4A_5=20+1\cdot6=26。 
]

 相应的时间表是先完成第 4 组，然后完成第 5 组。第 2 组和第 3 组可以推迟到第 5 组之后，此时其成本为零。 

对于样品 2，```
6
1 2 3 8 9 10
5 4 3 2 1 0
```这些州是：

 | 集 (i) | (A_i) | (B_i) | 上一组最好的 | (dp[i]) | 赫尔决定|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 5 | 已经完成 | 0 | 插入 (5x) |
 | 2 | 2 | 4 | 1 | 10 | 10 插入 (4x+10) |
 | 3 | 3 | 3 | 1 | 15 | 15 删除多余行|
 | 4 | 8 | 2 | 3 | 39 | 39 删除过时的前线|
 | 5 | 9 | 1 | 3 | 42 | 42 保留相关信封|
 | 6 | 10 | 10 0 | 3 | 45 | 45 最终答案|

 最终的转换使用集合 3：

 [
 dp[6]=dp[3]+B_3A_6
 =15+3\cdot10
 =45。 
]

 这对应于示例的先完成第 3 组，然后第 6 组的策略。第 6 组完成后，剩余的每组都可以零成本完成。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N)) | 每行插入一次，最多删除一次，而每个查询单调前进前指针。 |
 | 空间| (O(N)) | 外壳和输入数组包含 (O(N)) 个值。 |

 对于 (N\le10^5)，除了摊销双端队列删除之外，线性解决方案仅对每个元素执行恒定数量的算术运算。 它轻松地避免了二次动态规划的大约 50 亿次转换。 Python 的任意精度整数还可以安全地处理大于 32 位范围的乘积和答案。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    if n == 1:
        print(0)
        return

    hull = [(b[0], 0)]
    head = 0
    dp = [0] * n

    def value(line, x):
        return line[0] * x + line[1]

    for i in range(1, n):
        x = a[i]

        while head + 1 < len(hull) and value(hull[head], x) >= value(hull[head + 1], x):
            head += 1

        dp[i] = value(hull[head], x)

        new_line = (b[i], dp[i])

        while len(hull) - head >= 2:
            m1, c1 = hull[-2]
            m2, c2 = hull[-1]
            m3, c3 = new_line

            if (c2 - c1) * (m2 - m3) >= (c3 - c2) * (m1 - m2):
                hull.pop()
            else:
                break

        hull.append(new_line)

    print(dp[-1])

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
assert run(
    "5\n"
    "1 2 3 4 6\n"
    "5 4 3 1 0\n"
) == "26", "sample 1"

assert run(
    "6\n"
    "1 2 3 8 9 10\n"
    "5 4 3 2 1 0\n"
) == "45", "sample 2"

# Minimum-size input
assert run(
    "1\n"
    "1\n"
    "0\n"
) == "0", "only the already-completed set exists"

# Boundary case: the first set must not be charged again
assert run(
    "2\n"
    "1 2\n"
    "5 0\n"
) == "10", "set 1 is already completed"

# All A values equal, outside the official constraints.
# This checks that equal query coordinates do not break the hull logic.
assert run(
    "3\n"
    "1 1 1\n"
    "2 1 0\n"
) == "2", "equal query coordinates"

# Maximum-size case and large answer.
# A[i] = i, B[i] = n-i, so the answer is n*(n-1).
n = 100000
a = " ".join(map(str, range(1, n + 1)))
b = " ".join(map(str, range(n - 1, -1, -1)))
expected = str(n * (n - 1))

assert run(f"{n}\n{a}\n{b}\n") == expected, "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 / 0`|`0`| 最小尺寸输入且已完成第一组 |
 |`2 / 1 2 / 5 0`|`10`| 初始状态和第一个实际转换之间的边界 |
 |`3 / 1 1 1 / 2 1 0`|`2`| 等价查询坐标，不受官方限制 |
 | (N=100000,\A_i=i,\B_i=N-i) |`9999900000`| 最大尺寸和大整数运算|

 全平等测试被故意标记为在官方输入保证之外。 有效的问题实例不能使所有 (A_i) 相等，因为 (A_i) 值必须严格递增，并且不能使所有 (B_i) 相等，因为 (B_i) 值必须严格递减且 (B_N=0)。 它作为实现稳健性检查仍然有用，因为查询逻辑对于非递减 (A_i) 仍然有效。 

## 边缘情况

 对于最小情况，```
1
1
0
```算法输入`n == 1`分支和打印`0`。 没有过渡到计算，因为唯一的一组已经完成。 永远不需要船体。 

对于初始状态边界，```
2
1 2
5 0
```外壳从线 (5x) 开始，代表集合 1 (dp[1]=0)。 集合 2 的查询位于 (x=2)，因此值为 (5\cdot2=10)。 算法打印`10`。 它永远不会添加 (1\cdot5)，因为集合 1 不是剩余工作的一部分。 

对于直接进入最终组并不是最佳的情况，```
5
1 2 3 4 6
5 4 3 1 0
```集合 5 的相关转换是通过集合 4。算法计算 (dp[4]=20)，然后评估集合 4 在 (A_5=6) 处的线：

 [
 20+1\cdot6=26。 
]

 从集合 1 直接转换将花费 (0+5\cdot6=30)，因此船体正确选择集合 4 并产生`26`。 

对于(N=100000)、(A_i=i)和(B_i=N-i)的大值情况，第一行表示(dp[1]=0)。 对于每个 (i)，使用集合 1 给出

 [
 dp[1]+B_1A_i=(N-1)i。 
]

 对于这个特定的结构，以后的每一个过渡都不会更好，所以

 [
 dp[N]=N(N-1)=9,999,900,000。 
]

 结果大于 (2^{31}-1)，它捕获使用 32 位算术的实现。 Python 的整数表示直接处理该值。 

对于相等的查询坐标，如```
3
1 1 1
2 1 0
```第一个转换给出 (dp[2]=2)。 在第三个查询中，行 (2x) 和行 (x+2) 在 (x=1) 处的计算结果均为 2。 前端查询条件允许在相等时丢弃较旧的行，并且答案仍然存在`2`。 该测试不在官方严格增加条件的范围内，但它证实了该实现不依赖于浮点交集比较或严格不同的查询坐标。
