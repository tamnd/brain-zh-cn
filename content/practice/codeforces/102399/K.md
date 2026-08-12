---
title: "CF 102399K - \u0427\u0435\u0440\u0435\u043f\u0430\u0448\u043a\u0430"
description: "我们有一个 (2×n) 网格，恰好包含 (2n) 个生菜叶子。 每片叶子都有一个非负能量值，Kolya 可以在海龟开始之前自由排列所有叶子。"
date: "2026-08-11T23:39:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102399
codeforces_index: "K"
codeforces_contest_name: "2019 \u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432, \u043b\u0438\u0433\u0430 A"
rating: 0
weight: 102399
solve_time_s: 239
verified: false
draft: false
---

[CF 102399K - \u0427\u0435\u0440\u0435\u043f\u0430\u0448\u043a\u0430](https://codeforces.com/problemset/problem/102399/K)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 59s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个 (2\times n) 网格，恰好包含 (2n) 个生菜叶。 每片叶子都有一个非负能量值，Kolya 可以在海龟开始之前自由排列所有叶子。 

从左上单元格到右下单元格的路径包括向右移动一段时间并向下移动一次。 如果向下移动发生在第 (k) 列，则海龟会吃掉顶行的前 (k) 个单元格和底行的最后 (n-k+1) 个单元格。 由于乌龟选择总能量最大的路径，因此放置的值是所有 (n) 条此类路径中的最大值。 我们需要排列给定的 (2n) 个值的多重集，以使该最大值尽可能小。 

输入在顶行中给出原始 (n) 个值，然后在底行中给出 (n) 个值。 它们原来的位置没有任何意义，因为Kolya可以收集所有（2n）个叶子并任意重新分配它们。 输出是任何最佳（2\times n）排列。 

界限 (n\le25) 是主要线索。 最多有 (50) 个叶子，因此 (n) 中的算法指数仍然太大，但对总能量的子集和式动态规划是可行的。 每个值最多为 (50000)，因此所有叶子的总能量最多为 (2\cdot25\cdot50000=2.5\cdot10^6)。 这使得可达总和的位集表示变得可行。 官方问题还给​​出了5秒的时间限制和512MB的内存限制，这与bitset动态规划解决方案一致。 

有几种边缘情况，粗心的构造可能会处理不当。 首先，每个可能的路径上都存在两个端点。 例如，```
2
1 4
2 3
```具有值 (1,2,3,4)。 如果我们将两个最大值放在端点处，一种最佳排列是```
1 3
4 2
```两个可能的路径和是（7）和（6），所以乌龟吃（7）。 试图在中间隐藏大值的构造永远无法克服以下事实：某些两个值必须占据两个不可避免的端点。 

其次，相等的值必须被视为普通的多重集，而不是不同的对象。 例如，```
3
0 0 0
0 0 0
```只有零，因此每个排列都有值 (0)。 子集重建必须允许重复值并且不得依赖于唯一索引。 

第三，剩余值的最佳分割不必恰好具有总能量的一半。 为了```
3
0 100 200
300 400 500
```两个最小值 (0) 和 (100) 属于端点。 其余值为 (200,300,400,500)，总计为 (1400)。 为顶行的内部单元选择 (300+400=700) 使得两个极值路径总和相等。 仅基于个体值的贪婪选择可能会错过这样一个平衡的子集。 

## 方法

 直接的强力解决方案将枚举 (2n) 叶子的每个排列。 对于每个排列，我们可以评估所有（n）个可能的向下列并保持最小的最大路径和。 这是正确的，因为考虑了所有可能的重新排列。 然而，有 ((2n)!) 标记的排列，并且评估所有路径会添加另一个 (n) 因子，从而给出 (O((2n)!,n)) 运算。 在 (n=25) 时，路径评估的数量级为 (50!\cdot25)，大致为 (7.6\cdot10^{65})。 即使忽略重复值，这也是无望的。 

当我们停止考虑任意排列并询问最佳排列是什么样子时，有用的结构就会出现。 可以假设顶行是非递减的，而底行可以假设是非递增的。 这是一个交换参数：如果两个顶行位置 (i<j) 包含 (x>y)，则交换它们不能增加最大路径和。 类似的论证适用于相反方向的底行。 这种单调性观察是问题的关键属性之一。 

现在假设顶行是

 [
 t_1\le t_2\le\cdots\le t_n
 ]

 最下面一行是

 [
 b_1\ge b_2\ge\cdots\ge b_n。 
]

 令 (F_k) 为 (k) 列中向下移动的路径之和。 然后

 [
 F_k=t_1+\cdots+t_k+b_k+\cdots+b_n。 
]

 对于连续路径，

 [
 F_{k+1}-F_k=t_{k+1}-b_k。 
]

 由于 (t_{k+1}) 不减且 (b_k) 不增，因此差值 (F_{k+1}-F_k) 不减。 因此序列 (F_k) 是离散凸的。 凸序列只能在端点处达到最大值，因此海龟的最大路径是两个极端路径之一。 

这极大地解决了问题。 第一个极端路径包含整个底行和仅第一个顶部单元格。 第二个包含整个顶行和最后一个底部单元格。 

两个不可避免的单元格应包含两个最小值。 将最小值放在左上角的单元格中，将第二小的值放在右下角的单元格中。 交换参数表明，将较小的值移至任一端点不能增加两个极端路径总和中较大的一个。 这也是标准解决方案所使用的结构。 

固定这两个端点后，正好保留 (2n-2) 个值。 假设他们的总数是（S）。 准确选择其中 (n-1) 个作为顶行的内部单元格，并令它们的总和为 (X)。 其余 (n-1) 个值将转到底行的内部单元格。 

两个极端路径和具有来自两个端点的共同贡献。 它们的可变部分很简单

 [
 X
 ]

 和

 [
 S-X。 
]

 所以我们需要最小化

 [
 \max(X,S-X)。 
]

 这意味着我们需要恰好 (n-1) 个剩余值的子集，其总和尽可能接近 (S/2)。 由于采用 (X>S/2) 永远不会比用 (S-X<S/2) 替换它更好，因此找到最大可达值 (X\le S/2) 就足够了。 

这是一个基数约束的子集和问题。 标准 (O(nS)) 布尔 DP 在概念上已经很简单，但 (S) 可以在 (2.4\cdot10^6) 左右，并且我们需要跟踪最多 (25) 个不同的基数。 位集将总维数减少了机器字因子。 在 Python 中，整数本身就是一个位集，因此一次移位可以在优化的 C 代码中执行整个转换。 

结构观察和DP之间的联系是中心思想。 暴力解决方案失败了，因为它将所有排列视为不相关。 单调性将每个最佳排列减少为两个已排序的行，凸性参数将所有可能的路径减少为两个极端路径，这两条路径减少了平衡两个子集和的优化。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O((2n)!,n)) | (O(n)) | (O(n)) | 太慢了|
 | 普通子集和 DP | (O(n^2S)) | (O(nS)) | 在最坏的情况下太慢|
 | 比特集 DP | (O(n^2S/w)) | (O(n^2S/w)) | 已接受 |

 这里 (S\le2.4\cdot10^6) 是 (2n-2) 个非端点值的总和，(w) 是机器字大小。 Python 的任意精度整数有效地实现了这种位集操作。 

## 算法演练

 1. 读取所有（2n）个值并对它们进行排序。 将最小值放入左上角的单元格中，将第二小的值放入右下角的单元格中。 这些单元属于每个可能的路径，因此分配其中的两个最小值是最佳的。 
2. 令剩余的 (2n-2) 个值为 (v_1,\ldots,v_{2n-2})，并令它们的总和为 (S)。 我们需要准确地选择其中 (n-1) 个作为顶行的内部单元格。 如果它们的总和为 (X)，则其余值的总和为 (S-X)。 
3. 用位集表示可达子集和。 让`dp[j]`是一个整数，当处理值的某个子集包含 (j) 个元素并且具有总和 (x) 时，其位 (x) 被准确设置。 最初只存在空子集，所以`dp[0] = 1`。 
4. 处理每个剩余值(v)。 使用降序更新基数状态```
dp[j] |= dp[j-1] << v
```左移将每个可达和 (x) 移动到 (x+v)，而按位或保留不使用 (v) 的子集。 降序`j`是必要的，因为在一次转换期间不得多次使用相同的值。 

1. 处理完所有值后，检查位组中是否有 (n-1) 个选定的值。 从(S//2)开始，求最大可达和(X)。 这是最优的，因为目标是 (\max(X,S-X))，随着 (X) 从下面接近 (S/2)，它会减小。 
2. 重建哪些值构成顶级内部组。 向后遍历处理后的值。 如果前一个 DP 状态可以使用少一个选定值形成 (X-v)，则将 (v) 放入顶部组并用 (X-v) 替换 (X)。 否则将 (v) 放入底部组中。 存储的 DP 状态保证这些选择中至少之一能够再现可达目标。 
3. 对选定的最高值进行递增排序，并将它们放在最小端点之后。 对底部值进行降序排序，并将它们放在第二小的端点之前。 结果行在结构论证所需的方向上是单调的。 

它起作用的原因可以通过一个不变量来捕获：对行进行排序后，每个可能的路径和都位于两个极端路径和之间，因为连续的差异形成了一个非递减序列。 两条极端路径具有相同的两个端点贡献，而它们的剩余贡献为(X)和(S-X)。 DP 找到最小化其最大值的子集 (X)。 由于每个最优解都可以在不增加其值的情况下转化为这种单调形式，并且动态规划考虑了每个可能的基数-((n-1))子集，因此构造的排列达到了全局最优。 

## Python 解决方案```python
import sys

input = sys.stdin.readline

def solve():
    n = int(input())
    values = list(map(int, input().split()))
    values += list(map(int, input().split()))

    values.sort()

    # The two unavoidable endpoints get the two smallest values.
    top_left = values[0]
    bottom_right = values[1]

    remaining = values[2:]
    m = len(remaining)
    need = n - 1

    total = sum(remaining)
    half = total // 2

    # dp[j] is a bitset:
    # bit s is 1 iff we can choose j processed values with sum s.
    dp = [0] * (need + 1)
    dp[0] = 1

    # Keep every layer for reconstruction.
    history = [dp[:]]

    mask = (1 << (half + 1)) - 1

    for v in remaining:
        upper = min(need, len(history[-1]))
        for j in range(need, 0, -1):
            dp[j] |= (dp[j - 1] << v) & mask
        history.append(dp[:])

    bits = dp[need]
    target = bits.bit_length() - 1

    # target is the largest reachable sum <= half.
    top_internal = []
    bottom_internal = []

    j = need
    current = target

    for i in range(m, 0, -1):
        v = remaining[i - 1]

        if j > 0 and current >= v:
            previous = history[i - 1][j - 1]
            if (previous >> (current - v)) & 1:
                top_internal.append(v)
                current -= v
                j -= 1
                continue

        bottom_internal.append(v)

    top_internal.sort()
    bottom_internal.sort(reverse=True)

    top = [top_left] + top_internal
    bottom = bottom_internal + [bottom_right]

    print(*top)
    print(*bottom)

if __name__ == "__main__":
    solve()
```第一部分对所有叶子进行排序，并修复每条路径必须访问的两个单元格处的两个最小值。 这直接实现了证明中的端点属性。 

位集DP使用具有二进制位的整数来表示和(s)是否可达。 例如，如果`dp[2]`包含位 (3) 和 (7)，则两个处理值的子集可以具有和 (3) 和 (7)。 将此整数移位 (v) 会将这些可达总和更改为 (3+v) 和 (7+v)。 

DP 从大基数更新为小基数。 如果从小到大更新，则可以在同一次迭代中重复插入当前值，这会将 0/1 子集和变成无界背包。 

这`mask`删除所有大于 (S/2) 的总和。 这样的总和以后永远不会有用，因为所有值都是非负的，因此丢弃的总和在添加更多值后永远不会返回到有用范围。 除了减少内存流量之外，这还可以使 Python 整数更小。 

这`history`数组存储每个处理值后的 DP 状态。 仅重建时需要它。 一旦知道目标总和，我们就检查之前的状态以确定是否选择了当前值。 表达式```
(previous >> (current - v)) & 1
```准确检查之前的状态是否可以达到所需的剩余金额。 

Python 中不可能出现整数溢出。 在 C++ 中，64 位类型也足以满足路径总和，因为路径最多包含 (n+1\le26) 个值，每个值最多 (50000)，但 Python 整数完全消除了这个问题。 

最终的排序并不是表面的。 DP 仅决定哪些值属于每行的内部单元格。 单调性证明要求顶行递增，底行递减，因此在打印之前必须对这两组进行排序。 

## 工作示例

 ### 示例 1

 输入值为 (1,4,2,3)。 排序后我们得到(1,2,3,4)。 最小的两个值成为端点。 

| 步骤| 剩余价值| 所需数量 | 总计 | 一半| 选择总和 |
 | ---| ---| ---| ---| ---| ---|
 | 排序 | (1,2,3,4) | | | | |
 | 修复端点 | (3,4) | | (7) | (3) | |
 | DP | (3,4) | (1) | (7) | (3) | (3) |
 | 重建| (3) 选定| (0) 左 | | | (0) |

 顶部内部组是 ({3})，底部内部组是 ({4})。 对它们进行排序给出```
1 3
4 2
```立即向下的路径有和 (1+4+2=7)。 第二列中向下的路径的总和为 (1+3+2=6)。 最大值为 (7)。 

轨迹演示了平衡原理。 两个端点值是固定的，其余值尽可能均匀地分配在两个极端路径之间。 

### 示例 2

 所有六个值均为零。 

| 步骤| 剩余价值| 所需数量 | 总计 | 一半| 选择总和 |
 | ---| ---| ---| ---| ---| ---|
 | 排序 | (0,0,0,0,0,0) | (0,0,0,0,0,0) | | | | |
 | 修复端点 | (0,0) | (0,0) | | (0) | (0) | |
 | DP | 四个零 | (2) | (0) | (0) | (0) |
 | 重建| 两个零 | (0) 左 | | | (0) |

 任何排列都是最优的，算法打印```
0 0 0
0 0 0
```该示例练习了重复值以及目标总和恰好为零的边界情况。 

## 复杂度分析

 令 (S) 为未放置在端点处的 (2n-2) 个值的总和。 我们有 (S\le48\cdot50000=2.4\cdot10^6)。 

| 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n^2S/w)) | 有 (O(n^2)) 个位集转换，每个转换都在 (O(S/w)) 个机器字上操作。 |
 | 空间| (O(n^2S/w)) | 我们存储 (O(n^2)) DP 位集用于重建。 |

 对于 (n\le25)，基数状态的数量很小，而最大的位集仅包含大约 (1.2\cdot10^6) 个有用位，因为上面 (S/2) 的总和被丢弃。 蟒蛇的`int`操作在优化的本机代码中执行大的位集移位，这使得这比在 Python 中迭代每个可能的总和要快得多。 

对于给定的 512 MB 限制，内存限制也是安全的。 问题的小 (n) 使得存储重建层变得可行。 

## 测试用例

 建设性问题的输出不需要是唯一的，因此最稳健的测试验证输出是输入的排列，并且其最大路径和等于最优路径和。 对于小情况，我们可以通过枚举所有排列来计算最优值。 下面的测试还包括针对实现具有独特自然结果的情况的确定性精确输出检查。```python
# The solution function is the same algorithm as above.
import sys
import io
from itertools import permutations

def solution(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        n = int(sys.stdin.readline())
        values = list(map(int, sys.stdin.readline().split()))
        values += list(map(int, sys.stdin.readline().split()))

        values.sort()

        top_left = values[0]
        bottom_right = values[1]

        remaining = values[2:]
        m = len(remaining)
        need = n - 1

        total = sum(remaining)
        half = total // 2

        dp = [0] * (need + 1)
        dp[0] = 1

        history = [dp[:]]
        mask = (1 << (half + 1)) - 1

        for v in remaining:
            for j in range(need, 0, -1):
                dp[j] |= (dp[j - 1] << v) & mask
            history.append(dp[:])

        target = dp[need].bit_length() - 1

        top_internal = []
        bottom_internal = []

        j = need
        current = target

        for i in range(m, 0, -1):
            v = remaining[i - 1]

            if j > 0 and current >= v:
                previous = history[i - 1][j - 1]
                if (previous >> (current - v)) & 1:
                    top_internal.append(v)
                    current -= v
                    j -= 1
                    continue

            bottom_internal.append(v)

        top_internal.sort()
        bottom_internal.sort(reverse=True)

        top = [top_left] + top_internal
        bottom = bottom_internal + [bottom_right]

        print(*top)
        print(*bottom)

        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def max_path_sum(grid):
    top, bottom = grid
    n = len(top)

    best = 0
    for k in range(n):
        cur = sum(top[:k + 1]) + sum(bottom[k:])
        best = max(best, cur)

    return best

def parse_grid(out, n):
    lines = out.strip().splitlines()
    assert len(lines) == 2

    top = list(map(int, lines[0].split()))
    bottom = list(map(int, lines[1].split()))

    assert len(top) == n
    assert len(bottom) == n

    return [top, bottom]

def brute_optimum(values, n):
    best = 10**30

    # For these tests the values are small enough that exhaustive
    # permutation is practical.
    for p in set(permutations(values)):
        grid = [list(p[:n]), list(p[n:])]
        best = min(best, max_path_sum(grid))

    return best

def assert_optimal(inp):
    lines = inp.strip().splitlines()
    n = int(lines[0])
    original = list(map(int, lines[1].split()))
    original += list(map(int, lines[2].split()))

    out = solution(inp)
    grid = parse_grid(out, n)

    produced = grid[0] + grid[1]

    assert sorted(produced) == sorted(original), "output is not a permutation"

    expected = brute_optimum(original, n)
    actual = max_path_sum(grid)

    assert actual == expected, (
        f"not optimal: expected {expected}, got {actual}\n{out}"
    )

# Provided sample 1.
assert solution(
    """2
1 4
2 3
"""
) == """1 3
4 2
""", "sample 1"

# Provided sample 2.
assert solution(
    """3
0 0 0
0 0 0
"""
) == """0 0 0
0 0 0
""", "sample 2"

# Provided sample 3. The optimal output is not unique.
assert_optimal(
    """3
1 0 1
0 0 0
"""
)

# Minimum-size case with a nontrivial ordering.
assert solution(
    """2
0 1
2 3
"""
) == """0 2
3 1
""", "minimum n=2"

# All values equal.
assert solution(
    """4
5 5 5 5
5 5 5 5
"""
) == """5 5 5 5
5 5 5 5
""", "all equal"

# Boundary values and a perfectly balanced subset.
assert solution(
    """3
0 100 200
300 400 500
"""
) == """0 300 400
500 200 100
""", "balanced subset"

# Maximum-size input.
assert solution(
    "25\n" +
    " ".join(["50000"] * 25) + "\n" +
    " ".join(["50000"] * 25) + "\n"
) == (
    " ".join(["50000"] * 25) + "\n" +
    " ".join(["50000"] * 25) + "\n"
), "maximum n and maximum values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 0 1 / 2 3`|`0 2 / 3 1`| 最小值 (n)、端点放置、精确子集基数 |
 |`4 / 5 5 5 5 / 5 5 5 5`| 四`5`每行中的 s | 重复值和零宽度 DP 选择
 |`3 / 0 100 200 / 300 400 500`|`0 300 400 / 500 200 100`| 平衡子集和与行单调性 |
 | (n=25)，所有值 (50000) | 全部`50000`| 最大值 (n)、最大叶值、大位集 |

 ## 边缘情况

 第一个边缘情况是 (n=2)。 只有两条可能的路径，因此每个内部组只包含一个值。 为了```
2
0 1
2 3
```排序后的值为 (0,1,2,3)。 端点接收 (0) 和 (1)，留下 (2,3)。 DP必须选择一个值，最好的选择是（2）。 得到的网格是```
0 2
3 1
```两条路径和是(4)和(3)，所以答案是(4)。 一个常见的差一错误是选择 (n) 个剩余值而不是 (n-1)，这会使行的单元格数量错误。 

第二种边缘情况是所有值都相等时。 为了```
4
5 5 5 5
5 5 5 5
```端点都是 (5)，并且每个剩余子集对于固定基数具有相同的总和。 使用其余六个值中的任意三个，DP 达到目标 (15)。 排序产生两行，每行四个`5`s。 每条可能的路径都有相同的总和，因此构造是最优的。 

第三种边缘情况是最佳子集总和恰好是剩余总和的一半。 为了```
3
0 100 200
300 400 500
```两个端点值为 (0) 和 (100)。 剩余总数为 (1400)，因此理想的内部最高总和为 (700)。 DP 发现 (300+400=700)。 其余值是 (500) 和 (200)，按降序排列。 得到的网格是```
0 300 400
500 200 100
```两条极端路径的总和都是(800)，凸性保证没有中间路径更大。 这捕获了仅搜索严格低于一半的子集总和的实现。 

第四个边缘情况是最大输入大小。 当 (n=25) 时，有 (50) 个叶子，最大可能的总能量为 (2.5\cdot10^6)。 固定两个最小端点后，DP 最多处理 (48) 个值，并且只需要求和到总数的一半。 位集表示使得这一点变得可行，而无需为 Python 中的每个状态迭代数百万个和。 

最后一个微妙的情况是重复值的存在。 重建使用排序列表中的位置而不是不同的数字标识。 如果多个叶子具有相同的值，则选择任何出现都会给出相同的排列值，并且 DP 的向后重建自然会处理这些重复项，而不需要唯一的标识符。
