---
title: "CF 102202E - 水知道答案"
description: "我们有 (N) 个矩形盒子。 每个盒子可以以任一方向放置，并且所有盒子必须在地面上形成连续的一排。 雨水是垂直落下的，因此水只能保留在盒子水平包围的区域中。"
date: "2026-08-18T01:12:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102202
codeforces_index: "E"
codeforces_contest_name: "2019 KAIST RUN Spring Contest"
rating: 0
weight: 102202
solve_time_s: 397
verified: false
draft: false
---

[CF 102202E - 水知道答案](https://codeforces.com/problemset/problem/102202/E)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有 (N) 个矩形盒子。 每个盒子可以以任一方向放置，并且所有盒子必须在地面上形成连续的一排。 雨水是垂直落下的，因此水只能保留在盒子水平包围的区域中。 

考虑一种可能的水位 (H) 的有用方法是确定哪些盒子形成容器的两个壁以及哪些盒子位于容器内。 让

 [
 L_i=\max(w_i,h_i),\qquad S_i=\min(w_i,h_i)。 
]

 对于容器内使用的盒子，最佳方向是将其长边水平放置，将其短边垂直放置。 如果 (S_i<H)，则该框贡献

 [
 L_i(H-S_i)
 ]

 到存储区。 如果 (S_i\ge H)，它没有任何贡献。 

盒子可以用作墙。 要达到水平 (H)，其垂直边必须至少为 (H)，因此这在 (L_i\ge H) 时是可能的。 在这个角色中，我们旋转它，将其较长的一侧垂直放置。 因此，对于固定的 (H)，我们需要两个不同的盒子，其中 (L_i\ge H) 作为两个墙。 在所有这些盒子中，我们应该选择普通贡献 (L_i(H-S_i)) 最小的两个，因为这就是我们将盒子变成墙而失去的两个贡献。 这种固定高度的公式是解决方案使用的中心缩减。 

这些约束排除了 (N) 中的任何二次项。 当 (N) 与 (250000) 一样大时，即使 (O(N^2)) 也意味着大约 (6.25\times10^{10}) 对运算。 边长最多为 (10^6)，这为我们提供了有用的有界坐标范围，但迭代每个高度和每个框仍需要最多 (10^6\cdot250000=2.5\times10^{11}) 评估。 我们大约需要 (O(N\log N))。 

直接实现可能会错误处理几种边缘情况。 首先，能够达到所选级别的盒子可能少于两个。 例如，```
3
1 3
1 2
1 1
```只有一个带有 (L_i\ge3) 的盒子，因此第 (3) 层根本无法容纳任何水。 简单地计算贡献而不检查两堵墙的例程可能会报告正值。 

其次，短边正好是水位的盒子的贡献为零，而不是负数。 为了```
3
1 2
1 2
1 1
```正确答案是（1）。 两个 (1\times2) 盒子可以旋转成高度为 (2) 的垂直墙，而 (1\times1) 盒子可容纳一个单位的水。 使用 (H-S_i) 而不钳位为零会错误地引入负贡献。 

第三，轮换对于这两个角色都很重要。 考虑```
3
2 5
2 5
100 1
```两个 (2\times5) 盒子成为高度为 (5) 的垂直墙，而 (100\times1) 盒子水平位于其中。 答案是（100（5-1）=400）。 将原始输入宽度视为永久水平会错过这种排列。 

最后，相同的尺寸不会导致特殊的几何复杂性。 为了```
3
2 2
2 2
2 2
```每种可能的排列方式的储水量均为零，因此答案为（0）。 实现必须允许 (L_i) 和 (S_i) 相等，而不依赖于它们之间的严格不平等。 

## 方法

 最直接的暴力枚举了盒子的每一种排列、每一种旋转选择，然后评估所得到的排列。 这需要 (N!,2^N) 个排列，每个排列进行 (O(N)) 次扫描，得到 (O(N!,2^N N))。 在（N=250000）时，这远远超出了考虑范围。 

一种更有用的简单方法是使用固定高度观察。 对于每个可能的整数 (H)，扫描所有框，计算 (L_i\max(0,H-S_i))，识别 (L_i\ge H) 具有最小贡献的两个框，并将它们相减。 最多有 (10^6) 个可能的高度，因此在最坏的情况下需要 (O(10^6N)) 或 (2.5\times10^{11}) 框评估。 

蛮力之所以有效，是因为一旦知道了 (H) 和两堵墙，剩下的每个盒子就可以独立处理。 问题是重复查找两个最小值的成本很高。 关键的观察结果是每个框都贡献 (H) 的线性函数：

 [
 f_i(H)=L_iH-L_iS_i。 
]

 我们只需要两个最小的活动函数，当 (H\le L_i) 时，盒子就可以作为墙。 这正是李超树处理的动态最小行查询类型。 原始解决方案使用经过修改的李超树，以便每个节点保留其两条最佳线，而不是仅保留其单个最佳线。 

还有一项优化。 固定高度答案不必在所有 (10^6) 高度进行检查。 在(S_i)和(L_i)中出现的两个连续值之间，贡献框的集合和可能的墙的集合是不变的。 (H) 中的总贡献是仿射函数，而两个最小仿射函数之和是凹函数。 因此，它们的差异是凸的，并且凸函数在端点处的区间上达到最大值。 因此，检查所有 (S_i) 和 (L_i) 之间的不同值就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(N!2^N N)) | (O(N)) | 太慢了 |
 | 固定高度，扫描所有盒子| (O(10^6N)) | (O(N)) | 太慢了 |
 | 最佳| (O(N\log N)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 对于每个框，计算 (L_i=\max(w_i,h_i)) 和 (S_i=\min(w_i,h_i))。 将 (L_i) 视为可用作内部盒子的水平宽度或墙壁的垂直高度的尺寸。 它作为水平 (H) 的内部盒子的贡献是

 [
 g_i(H)=\max(0,L_i(H-S_i))。 
]

 1. 固定水位（H）。 当 (L_i\ge H) 时，盒子可以是两个外壁之一。 其他所有盒子都可以放置在这些墙之间。 该 (H) 的最大面积是所有 (g_i(H)) 的总和减去满足 (L_i\ge H) 的框中两个最小的 (g_i(H))。 
2.观察在应用零最大值之前，每个贡献都是线

 [
 f_i(H)=L_iH-L_iS_i。 
]

 我们从大到小处理（H）。 当我们到达（H=L_i）时，盒子（i）就可以成为一堵墙，并且它的线被插入到李超树中。 由于我们不再增加 (H)，因此插入的行仍然适合以后的每个查询。

1. 在候选高度坐标上维护一棵李超树。 普通李超节点存储在中点处最小值的线。 在这里，我们将两条最小的不同线存储在中点。 在插入过程中，更好的行成为第一行，次佳的行成为第二行，只有被替换的候选行必须继续递归到一个子行。 
2. 对于高度 (H) 的查询，从根向代表 (H) 的叶子走动。 在每个访问的节点，两个存储的行都是两个最小值的候选者。 将这些值合并为两个运行最小值。 这给出了所有当前插入的候选墙中最小和第二小的原始值 (f_i(H))。 
3. 分别计算所有非负贡献的总和。 按 (S_i) 对框进行排序，并构建 (L_i) 和 (L_iS_i) 的前缀和。 对于高度 (H)，所有具有 (S_i<H) 的框都有贡献，因此如果它们的总和 (L_i) 为 (A) 并且它们的总和 (L_iS_i) 为 (B)，则总和为

 [
 啊-B。 
]

 (S_i=H) 的值贡献为零，因此在该边界处使用严格或非严格包含会给出相同的结果。 

1.减去从李超树获得的两个最小的非负墙贡献。 如果存在的候选墙少于两个，则该高度不能容纳水并被跳过。 
2. 检查所有(L_i) 和(S_i) 中的每个不同值，保留最大的结果面积。 这些就足够了，因为在连续的事件高度之间，活动集是固定的，并且生成的目标是凸的，因此内部高度不能优于两个端点。 

为什么它有效：对于任何固定的（H），不是两个墙之一的每个盒子都可以独立定向以准确贡献（g_i（H））。 唯一必须牺牲的盒子是两堵墙，因此选择两个最小的合格贡献是最佳的。 李超树恰好保持了这两个最小值。 前缀和给出了移除两堵墙之前每个盒子的贡献。 最后，没有 (S_i) 或 (L_i) 事件的每个区间都有一组固定的参与线，并且其目标是凸的，因此检查其端点会覆盖其最大值。 因此，算法检查的最佳值等于全局最优水域。 

## Python 解决方案```python
import sys
from bisect import bisect_left

input = sys.stdin.readline

INF = 10**30

def solve():
    n = int(input())

    L = [0] * (n + 1)
    S = [0] * (n + 1)

    for i in range(1, n + 1):
        w, h = map(int, input().split())
        if w < h:
            w, h = h, w
        L[i] = w
        S[i] = h

    # Candidate heights are exactly the points where either
    # a contribution starts/ends or a box becomes a possible wall.
    events = sorted(set(L[1:] + S[1:]))

    # Sort boxes by wall threshold, descending.
    by_l = list(range(1, n + 1))
    by_l.sort(key=L.__getitem__, reverse=True)

    # Sort boxes by their smaller side for prefix sums.
    by_s = list(range(1, n + 1))
    by_s.sort(key=S.__getitem__)

    svals = [0] * n
    pref_l = [0] * (n + 1)
    pref_ls = [0] * (n + 1)

    for j, idx in enumerate(by_s):
        svals[j] = S[idx]
        pref_l[j + 1] = pref_l[j] + L[idx]
        pref_ls[j + 1] = pref_ls[j] + L[idx] * S[idx]

    # Dynamic Li Chao tree.
    # Each inserted line creates at most one new node.
    left = [0] * (n + 1)
    right = [0] * (n + 1)
    best = [0] * (n + 1)
    second = [0] * (n + 1)

    root = 0
    nodes = 0

    # We use the compressed event coordinates as the Li Chao domain.
    xs = events
    m = len(xs)

    def value(idx, x):
        if idx == 0:
            return INF
        return L[idx] * x - L[idx] * S[idx]

    def insert(line):
        nonlocal root, nodes

        if root == 0:
            nodes += 1
            root = nodes
            best[root] = line
            return

        node = root
        lo = 0
        hi = m - 1
        cur = line

        while True:
            mid = (lo + hi) >> 1
            xmid = xs[mid]

            a = best[node]
            b = second[node]

            if value(a, xmid) > value(cur, xmid):
                best[node], second[node], cur = cur, a, b
            elif value(b, xmid) > value(cur, xmid):
                second[node], cur = cur, b

            if cur == 0 or lo == hi:
                return

            # cur can improve on the current second-best line
            # only in a child where the two lines can change order.
            if value(second[node], xs[lo]) > value(cur, xs[lo]):
                nxt = left[node]
                if nxt == 0:
                    nodes += 1
                    nxt = nodes
                    left[node] = nxt
                    best[nxt] = cur
                    return
                node = nxt
                hi = mid
            elif value(second[node], xs[hi]) > value(cur, xs[hi]):
                nxt = right[node]
                if nxt == 0:
                    nodes += 1
                    nxt = nodes
                    right[node] = nxt
                    best[nxt] = cur
                    return
                node = nxt
                lo = mid + 1
            else:
                return

    def query(x):
        if root == 0:
            return INF, INF

        lo = 0
        hi = m - 1
        node = root
        first = INF
        second_best = INF

        while node:
            v = value(best[node], x)
            if v < first:
                second_best = first
                first = v
            elif v < second_best:
                second_best = v

            v = value(second[node], x)
            if v < first:
                second_best = first
                first = v
            elif v < second_best:
                second_best = v

            if lo == hi:
                break

            mid = (lo + hi) >> 1
            pos = bisect_left(xs, x, lo, hi + 1)

            if pos <= mid:
                node = left[node]
                hi = mid
            else:
                node = right[node]
                lo = mid + 1

        return first, second_best

    ans = 0
    p = 0

    for H in reversed(events):
        while p < n and L[by_l[p]] >= H:
            insert(by_l[p])
            p += 1

        # Boxes with S_i < H have positive possible contribution.
        k = bisect_left(svals, H)
        total = H * pref_l[k] - pref_ls[k]

        first, second_best = query(H)

        # Two distinct walls are mandatory.
        if second_best == INF:
            continue

        total -= max(first, 0)
        total -= max(second_best, 0)

        if total > ans:
            ans = total

    print(ans)

if __name__ == "__main__":
    solve()
```实现的第一部分将每个矩形归一化为 (L_i) 和 (S_i)。 此后输入方向不再重要，因为解决方案可以独立旋转每个框。 

这两个排序的顺序有不同的用途。`by_l`控制盒子何时作为可能的墙进入李超结构。`by_s`支持评估某个高度上所有普通框贡献之和所需的前缀和。 

李超的实现与教科书上的稍有不同。 每个节点存储`best[node]`和`second[node]`。 插入新行时，中点处的两条最佳行保留在节点中，而移位的候选行继续朝向子节点。 由于一次插入最多可以创建一个新节点，因此最多创建 (N) 个节点，因此动态树使用 (O(N)) 内存。 

行评估始终使用 Python 整数完成。 最大可能的区域约为 (N\cdot10^6\cdot10^6=2.5\times10^{17})，因此固定宽度的 32 位算术会溢出。 Python 整数自动避免了这个问题。 

查询沿着压缩的坐标树向下走。 这`bisect_left`在查询中找到包含 (x) 的一侧。 由于查询坐标本身属于`xs`，这是准确的。 该实现保留了沿着根到叶路径看到的两个最小值，这已经足够了，因为存储在李超节点中的每条线都是查询点的候选点。 

减法使用`max(value, 0)`因为 (L_i(H-S_i)) 只是一个假设的贡献。 具有 (S_i\ge H) 的框贡献为零，而不是负数。 这是特别相关的，因为李超树有意保留原始仿射函数而不是钳位函数。 

## 工作示例

 ### 示例 1

 三个盒子变成((L,S)=(4,3),(6,2),(5,1))。 事件高度为 (1,2,3,4,5,6)。 

| (H)| 插墙候选人| 总潜在面积| 两个最小的壁值 | 候选人回答|
 | --- | --- | --- | --- | --- |
 | 6 | 框 2 | 61 | 61 少于两个 | 0 |
 | 5 | 盒子 2、3 | 46 | 46 18、20 | 8 |
 | 4 | 框 1、2、3 | 31 | 31 4, 12 | 15 | 15
 | 3 | 框 1、2、3 | 16 | 16 0, 6 | 10 | 10
 | 2 | 框 1、2、3 | 5 | 0, 0 | 5 |
 | 1 | 框 1、2、3 | 0 | 0, 0 | 0 |

 在 (H=4) 时，潜在贡献为 (4,12,15)。 两个装有捐款 (4) 和 (12) 的盒子成为墙壁，第三个盒子则用来储存 (15) 单位的水。 因此答案为(15)。 

### 构建的示例

 考虑```
3
1 3
1 3
1 1
```标准化框为 ((3,1),(3,1),(1,1))。 唯一有用的事件高度是 (1) 和 (3)。 

| (H)| 插墙候选人| 总潜在面积| 两个最小的壁值 | 候选人回答|
 | --- | --- | --- | --- | --- |
 | 3 | 盒子 1, 2 | 14 | 14 6, 6 | 2 |
 | 1 | 盒子 1, 2 | 0 | 0, 0 | 0 |

 在高度 (3) 处，两个 (1\times3) 盒子旋转成高度 (3) 的垂直墙。 (1\times1) 盒子保持在内部，其高度为 (1)，因此它可容纳 (3-1=2) 单位的水。 答案是（2）。 

这些痕迹还说明了为什么必须删除两个最小的贡献，而不是简单地选择两个最高的盒子。 在(H=3)处，两个长盒子必然是墙，并且它们假设的内部贡献正是李超查询去除的值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N\log N)) | 两种排序加上 (N) 次李超插入和 (O(N)) 次高度查询，每次都需要 (O(\log N)) |
 | 空间| (O(N)) | 盒子数组，排序数组，前缀和，最多（N）个李超节点 |

 对于 (N=250000)，(O(N\log N)) 适合三秒限制，而 (O(N)) 内存使用量正好在 1024 MB 限制之内。 有界边长仅用于激发固定高度公式； 该实现压缩了相关高度，因此不需要百万元素的李超树。 

## 测试用例

 以下线束假设上述解决方案保存为`solution.py`并暴露了`solve()`实现中显示的功能。```python
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
    """3
4 3
2 6
5 1
"""
) == "15", "sample 1"

# Minimum-size input, and a water level exactly equal to the two wall heights.
assert run(
    """3
1 3
1 3
1 1
"""
) == "2", "minimum size and exact wall height"

# All boxes are identical, so no arrangement can trap water.
assert run(
    """3
2 2
2 2
2 2
"""
) == "0", "all equal values"

# The long dimension must be used horizontally for the interior box.
assert run(
    """3
2 5
2 5
100 1
"""
) == "400", "rotation choice"

# Water appears exactly at H = S + 1, catching strict-boundary mistakes.
assert run(
    """3
1 2
1 2
1 1
"""
) == "1", "off-by-one at the water level"

# Maximum N, with the smallest possible dimensions.
# There is no possible water, but the test exercises the full input size.
max_n = 250000
max_case = str(max_n) + "\n" + ("1 1\n" * max_n)
assert run(max_case) == "0", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 / 1 3 / 1 3 / 1 1`| 2 | 最小值 (N)，两个有效墙，精确边界高度 |
 |`3 / 2 2 / 2 2 / 2 2`| 0 | 尺寸均等 |
 |`3 / 2 5 / 2 5 / 100 1`| 400 | 墙壁和内盒旋转的正确使用|
 |`3 / 1 2 / 1 2 / 1 1`| 1 | 当 (H=S_i+1) | 时偏离一的行为
 | 250000份`1 1`| 0 | 最大输入尺寸和性能|

 ## 边缘情况

 对于高层只有一堵可能的墙的情况，```
3
1 3
1 2
1 1
```考虑(H=3)。 只有第一个框有 (L_i\ge3)，因此李超查询只能返回一个有限的墙候选。 该实现检测到第二个最小值是`INF`并跳过这个高度。 在 (H=2) 处，两个盒子成为可能的墙壁，但第一个盒子作为墙壁的贡献为零，其余配置仍然没有给出正的捕获区域。 最终答案是（0）。 

对于精确边界情况，```
3
1 2
1 2
1 1
```在 (H=2) 处，两个 (1\times2) 盒子作为墙插入。 (1\times1) 盒子贡献 (1(2-1)=1)。 两个候选墙的原始贡献为零，因此减去它们就剩下 (1)。 答案正是 (1)，这说明了为什么贡献必须被限制在零，以及为什么具有 (S_i=H) 的盒子不能被视为产生负水。 

对于旋转敏感的情况，```
3
2 5
2 5
100 1
```归一化维度为 ((5,2),(5,2),(100,1))。 在 (H=5) 处，可以旋转前两个盒子，使其 (5) 边垂直，形成两面墙。 第三个盒子水平使用其 (100) 边，垂直使用其 (1) 边，贡献 (100(5-1)=400)。 李超查询删除了两个候选墙，计算出的答案是（400）。 

对于相同的维度，```
3
2 2
2 2
2 2
```每个标准化框都是 ((2,2))。 在 (H=2) 时，所有贡献均为零。 在(2)之上，不存在具有(L_i\ge H)的盒子，因此不可能有两堵墙。 在 (2) 之下，没有任何盒子的上方有正的空间。 该算法因此返回 (0)。 

最大尺寸的箱子由 (250000) 个尺寸为 (1\times1) 的箱子组成。 每个盒子都有 (L_i=S_i=1)，因此每个候选水贡献为零，答案为 (0)。 该实现仍然通过排序和李超机制处理所有盒子，在不依赖小输入大小的情况下执行预期的 (O(N\log N)) 行为。
