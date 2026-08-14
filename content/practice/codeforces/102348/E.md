---
title: "CF 102348E - 粉刷栅栏"
description: "我们有一排 (n) 栅栏板和 (m) 种颜色。 颜色 (i) 恰好适用于 (ai) 块木板，并且值总和为 (n)，因此必须使用每个单位的油漆。"
date: "2026-08-14T11:51:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102348
codeforces_index: "E"
codeforces_contest_name: "ICPC 2019-2020 NERC (NEERC), Southern and Volga Russia Qualifier"
rating: 0
weight: 102348
solve_time_s: 844
verified: true
draft: false
---

[CF 102348E - 绘制栅栏](https://codeforces.com/problemset/problem/102348/E)

 **评级：** -
 **标签：** -
 **求解时间：** 14m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排 (n) 栅栏板和 (m) 种颜色。 颜色 (i) 恰好适用于 (a_i) 块木板，并且值总和为 (n)，因此必须使用每个单位的油漆。 我们需要沿着栅栏排列这些颜色的出现，以便一种颜色的最大连续运行的长度不大于 (k)。 

输出要么是这样一个长度为 (n) 的颜色数组，每种颜色恰好使用 (a_i) 次，如果不存在有效排列，则输出为 (-1)。 

约束 (n \le 2\cdot 10^5) 排除了任何探索大部分可能排列的情况。 在最坏的情况下，即使 (O(n^2)) 也已经意味着大约 (4\cdot10^{10}) 次操作。 我们需要一个本质上线性或 (O(n\log n)) 的解决方案。 优先队列是合适的，因为每个位置都可以通过取剩余量最大的颜色来决定，同时暂时排除已达到运行限制的颜色。 

有几种边缘情况可能会导致粗心的实施失败。 首先，颜色可以恰好位于可行性边界处。 例如，```
6 2 3
5 1
```是可能的，与`1 1 1 2 1 1`。 颜色 1 的运行长度恰好为 (3)，因此拒绝长度为 (k) 的运行而不是大于 (k) 的运行将错误地打印 (-1)。 

第二种情况是当最大的颜色太大时，即使存在其他几种颜色。 例如，```
8 2 3
7 1
```是不可能的。 颜色 1 的七个副本需要至少三个单独的运行，但颜色 2 的单块木板只能分隔两个边界。 简单地开始放置最大颜色而不检查可行性的贪婪实现最终可能会陷入困境，需要正确处理这种情况。 

最小的可能输入也很特殊：```
1 1 1
1
```唯一有效的答案是`1`。 没有先前的颜色，也不可能出现运行违规，因此初始化不得假设答案已包含先前的木板。 

最后，(k) 可以大于每个有用的运行。 例如，```
5 2 5
4 1
```有效为`1 1 1 1 2`。 当 (k\ge n) 时，运行限制实际上是无关的，因此算法不得强制进行不必要的颜色更改。 

## 方法

 直接的暴力方法将栅栏视为排列问题。 在每个木板上，我们尝试剩余数量为正的每种颜色，递归地继续，并在当前运行超过 (k) 时立即拒绝分支。 这是正确的，因为最终会考虑每种可能的颜色，并且接受有效的颜色。 

问题在于可能的颜色数量。 即使忽略固定的多重性，也存在 (n) 个颜色的 (m^n) 个序列。 检查一个完整的序列需要 (O(n))，因此简单的穷举搜索可能需要 (O(nm^n)) 时间。 对于 (m=n=2\cdot10^5)，这个最坏情况的界限大约是 (O(n^{n+1}))，这是完全不可行的。 

有用的观察是，我们从不关心尚未填补的职位的身份。 在每一步中，重要的是每种颜色剩余多少份、最后使用的颜色以及当前运行的时间。 在可用的颜色中，剩余数量最多的一种是最危险的一种。 如果我们在使用较小的颜色时不使用它，则其剩余的副本以后会变得更难放置。 

这导致了优先级队列。 我们总是选择剩余数量最多的颜色。 如果该颜色与之前的颜色不同，我们可以立即使用它。 如果是相同的颜色并且当前运行已经达到(k)，我们暂时取第二大的颜色代替。 使用一次颜色后，其剩余计数会减少，如果仍有副本，则将其返回到堆中。 

还有一个简单的可行性条件。 假设颜色 (c) 出现 (A) 次。 由于 (c) 的每次运行最多包含 (k) 个副本，因此我们至少需要 (\lceil A/k\rceil) 次单独运行 (c)。 在这些运行之间必须至少有 (\lceil A/k\rceil-1) 个其他颜色的木板。 因此，

 [
 \left\lceil\frac{A}{k}\right\rceil\le n-A+1,
 ]

 这相当于

 [
 A \le k(n-A+1)。 
]

 最难的颜色是具有最大 (A) 的颜色，因此检查最大值 (a_i) 就足够了。 这可以在构建答案之前立即进行不可能性测试。 

蛮力之所以有效，是因为它探索了每种可能的排序，但会失败，因为排序数量呈指数级增长。 观察到只有最大的剩余颜色可能无法放置，这让我们可以用最大堆贪婪地做出每个决定。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(nm^n)) | (O(n+m)) | 太慢了 |
 | 最佳| (O(n\log m)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 读取颜色计数并找到最大计数 (A)。 如果 (A>k(n-A+1))，则打印 (-1)。 仅最大的颜色就需要比其他木板所能提供的更多的独立运行。 
2. 将每种颜色及其剩余计数放入最大堆中。 蟒蛇的`heapq`是一个最小堆，所以我们存储负计数。 
3. 保留`last`，前一块木板上使用的颜色，以及`run`，当前连续运行的长度。 最初没有以前的颜色，所以`last = -1`和`run = 0`。 
4. 在每个位置，从堆中删除剩余计数最大的颜色。 
5. 如果该颜色不同于`last`，使用它。 新的游程长度变为 (1)。 
6.如果等于`last`和`run < k`，再次使用它。 最好继续使用相同的颜色，因为它具有最大的剩余计数，并且当前运行仍然有空间。 
7. 如果等于`last`和`run = k`，现在不能使用。 从堆中删除下一个最大的颜色并使用该颜色代替。 将被阻止的颜色原封不动地返回到堆中。 如果不存在第二种颜色，则施工无法继续。 
8. 减少所选颜色的剩余数量。 如果仍有副本，请将其插回堆中。 
9. 重复此操作，直到分配完所有 (n) 块木板。 

### 为什么它有效

 不变的是，在每个构造的前缀之后，堆恰好包含每种颜色的未使用副本，而前缀已经满足游程长度限制。 每当允许最频繁的剩余颜色继续时，使用它都是安全的，因为推迟剩余数量较少的颜色不会使较小的颜色更难以放置。 每当当前运行达到 (k) 时，就禁止继续运行，因此任何有效的继续都必须选择另一种颜色。 选择最大的可用替代方案可以保留最有限的剩余资源。 

可行性不等式保证最大的颜色有足够的不匹配木板可用于分隔其所有所需的运行。 贪婪的选择总是仅在强制切换时才花费这些分隔颜色，而不是在当前颜色仍然可以合法继续的情况下浪费它们。 因此，如果初始可行性条件成立，堆构造可以消耗所有副本而不会卡住。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))

    mx = max(a)

    if mx > k * (n - mx + 1):
        print(-1)
        return

    heap = []
    for color, count in enumerate(a, 1):
        heapq.heappush(heap, (-count, color))

    ans = []
    last = -1
    run = 0

    for _ in range(n):
        neg_count, color = heapq.heappop(heap)
        count = -neg_count

        if color == last and run == k:
            if not heap:
                print(-1)
                return

            neg_count2, color2 = heapq.heappop(heap)
            count2 = -neg_count2

            heapq.heappush(heap, (-count, color))

            color = color2
            count = count2
            run = 1
        else:
            if color == last:
                run += 1
            else:
                run = 1

        ans.append(color)
        count -= 1

        if count > 0:
            heapq.heappush(heap, (-count, color))

        last = color

    print(*ans)

if __name__ == "__main__":
    solve()
```可行性检查仅使用最大计数。 对于具有 (A) 个副本的颜色，至少需要 (\lceil A/k\rceil) 条运行，并且 (n-A) 个其他木板最多提供 (n-A+1) 个可能的运行槽。 由于随着 (A) 的增长，不等式变得更加困难，因此检查最大计数涵盖了每种颜色。 

堆存储对`(-count, color)`这样最小的堆值对应于最大的剩余计数。 颜色索引被显式存储，因为两种颜色可以具有相同的计数并且仍然需要保持可区分。 

特别的分行在哪里`color == last and run == k`是关键的边界条件。 当前颜色已经占据了 (k) 个连续位置，因此再使用一次将创建长度为 (k+1) 的游程。 我们暂时将其删除，选择下一个最佳颜色，然后将被阻挡的颜色原封不动地放回去。 

当选定的颜色还剩一份副本时，减少其计数会产生零，并且不会被推回。 由于输入保证所有计数的总数为 (n)，因此需要恰好 (n) 次成功选择。 

Python整数不会溢出，可行性测试中最大的乘积最多是(n^2)，大约(4\cdot10^{10})，Python直接处理。 

## 工作示例

 ### 示例 1

 输入是```
5 2 1
2 3
```这里（k=1），所以相同的颜色可能永远不会相邻。 最大的计数是 (3)，并且

 [
 3 \le 1(5-3+1)=3,
 ]

 所以该实例正好处于可行性边界。 

| 位置 | 选择前堆| 最后 | 运行| 已选颜色 | 剩余选择数 |
 | --- | --- | --- | --- | --- | --- |
 | 1 |`(3,2), (2,1)`| 无 | 0 | 2 | 2 |
 | 2 |`(2,1), (2,2)`| 2 | 1 | 1 | 1 |
 | 3 |`(2,2), (1,1)`| 1 | 1 | 2 | 1 |
 | 4 |`(1,1), (1,2)`| 2 | 1 | 1 | 0 |
 | 5 |`(1,2)`| 1 | 1 | 2 | 0 |

 最终的着色结果是`2 1 2 1 2`。 因为(k=1)，每一步都被迫切换颜色，可行性不等式告诉我们颜色2有足够的分隔木板。 

### 示例 2

 输入是```
8 2 3
1 7
```最大的颜色有 (A=7) 个副本。 其所需运行次数为

 [
 \left\lceil\frac{7}{3}\right\rceil=3。 
]

 但另一种颜色的木板只有一块，因此最多可以将颜色 1 分开两次。 等价地，

 [
 7 > 3(8-7+1)=6。 
]

 该算法在构造任何东西之前会拒绝该实例。 

| 价值| 状态|
 | --- | --- |
 | (n) | 8 |
 | (k) | 3 |
 | 最大计数 (A) | 7 |
 | 最大可能的分离容量| (3(8-7+1)=6) |
 | 可行的？ | 没有 |
 | 输出|`-1`|

 这说明了为什么可行性检查必须使用`n - A + 1`，而不是简单地计算存在多少种其他颜色。 一块其他木板最多可以创建两个独立的主色组。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log m)) | 每个 Plank 都会导致恒定数量的堆操作，每次都需要 (O(\log m))。 |
 | 空间| (O(n+m)) | 答案包含 (n) 种颜色，堆最多包含 (m) 种颜色条目。 |

 对于 (n\le2\cdot10^5)，该算法仅对每个 Plank 执行对数量的堆工作。 内存使用量是线性的，因此完全符合 256 MB 的限制。 

## 测试用例

 由于有效输出不是唯一的，因此测试工具不应将成功的输出与一个固定字符串进行比较。 相反，它会检查输出是否具有正确数量的木板，使用每种颜色所需的次数，并且永远不会创建比 (k) 更长的运行时间。 对于不可能的情况，精确的`-1`比较合适。```python
import sys
import io
import heapq

input = sys.stdin.readline

def solve():
    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))

    mx = max(a)

    if mx > k * (n - mx + 1):
        print(-1)
        return

    heap = []
    for color, count in enumerate(a, 1):
        heapq.heappush(heap, (-count, color))

    ans = []
    last = -1
    run = 0

    for _ in range(n):
        neg_count, color = heapq.heappop(heap)
        count = -neg_count

        if color == last and run == k:
            if not heap:
                print(-1)
                return

            neg_count2, color2 = heapq.heappop(heap)
            count2 = -neg_count2

            heapq.heappush(heap, (-count, color))

            color = color2
            count = count2
            run = 1
        else:
            if color == last:
                run += 1
            else:
                run = 1

        ans.append(color)
        count -= 1

        if count > 0:
            heapq.heappush(heap, (-count, color))

        last = color

    print(*ans)

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = sys.stdin.readline

def validate(inp: str, out: str):
    data = list(map(int, inp.split()))
    n, m, k = data[0], data[1], data[2]
    a = data[3:3 + m]

    assert out != "-1"

    ans = list(map(int, out.split()))
    assert len(ans) == n

    cnt = [0] * (m + 1)

    last = -1
    run = 0

    for color in ans:
        assert 1 <= color <= m
        cnt[color] += 1

        if color == last:
            run += 1
        else:
            last = color
            run = 1

        assert run <= k

    for color in range(1, m + 1):
        assert cnt[color] == a[color - 1]

# Provided samples
sample1 = """\
5 2 1
2 3
"""
out = run(sample1)
validate(sample1, out)

sample2 = """\
8 2 3
1 7
"""
assert run(sample2) == "-1", "sample 2"

sample3 = """\
10 3 2
5 2 3
"""
out = run(sample3)
validate(sample3, out)

# Minimum-size input
case1 = """\
1 1 1
1
"""
assert run(case1) == "1", "minimum-size case"

# Exact feasibility boundary
case2 = """\
6 2 3
5 1
"""
out = run(case2)
validate(case2, out)

# All counts equal
case3 = """\
12 3 4
4 4 4
"""
out = run(case3)
validate(case3, out)

# Maximum-size input
case4 = "200000 2 100000\n100000 100000\n"
out = run(case4)
validate(case4, out)

# Just beyond the feasibility boundary
case5 = """\
8 2 3
7 1
"""
assert run(case5) == "-1", "impossible boundary case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 / 1`|`1`| 没有先前颜色的最小尺寸和初始化 |
 |`6 2 3 / 5 1`| 任何有效的颜色，例如`1 1 1 2 1 1`| 允许长度 (k) 的游程的精确边界 |
 |`12 3 4 / 4 4 4`| 任何有效的颜色 | 堆中颜色频率相同且关系相同 |
 |`200000 2 100000 / 100000 100000`| 任何有效的颜色 | 最大值(n)，大堆操作，并且正好在(k) | 处运行
 |`8 2 3 / 7 1`|`-1`| 可行性不平等和不可能的主色|

 ## 边缘情况

 对于最小输入```
1 1 1
1
```最大计数为 (1)，可行性测试给出 (1\le1(1-1+1))。 该堆仅包含颜色 1，该颜色被选择一次。 由于没有先前的颜色，因此运行从 (1) 开始，并且输出恰好是`1`。 

对于精确的边界情况```
6 2 3
5 1
```主色有五个副本。 它需要两次运行，因为 (\lceil5/3\rceil=2)，并且颜色 2 的单个副本足以将它们分开。 贪婪结构采用颜色 1 三次，当运行达到 (3) 时切换到颜色 2，然后采用颜色 1 两次。 结果是`1 1 1 2 1 1`，其最长行程的长度恰好为 (3)。 

对于相同的频率，```
12 3 4
4 4 4
```每种颜色在堆中具有相同的优先级。 堆的颜色索引始终打破联系，因此该结构可以生成四种颜色的副本，然后是另一种颜色的四个副本和第三种颜色的四个副本。 每个游程的长度为 (4)，恰好是允许的最大值。 

对于不可能的边界，```
8 2 3
7 1
```主色至少需要三行，而另一块木板最多可以分隔两行。 不等式变为 (7\le6)，这是假的，因此算法打印`-1`立即地。 无需部分构建，也不存在报无法完成的前缀的风险。 

情况（k=1）由相同的逻辑处理。 每当前一个颜色位于堆的顶部时，`run == k`已经成立，因此算法必须选择不同的颜色。 可行性条件简化为 (A\le n-A+1)，这是常见的要求，即最常见的颜色必须具有足够的其他元素来分隔其所有副本。
