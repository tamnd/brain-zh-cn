---
title: "CF 102460I - 光谱"
description: "我们需要根据元素之间的所有成对距离重建一个递增的整数数组 (X)。 第一个元素固定为零，每个元素都在 0 到 999 之间。"
date: "2026-08-08T10:13:02+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102460
codeforces_index: "I"
codeforces_contest_name: "2019-2020 ICPC Asia Taipei-Hsinchu Regional Contest"
rating: 0
weight: 102460
solve_time_s: 164
verified: true
draft: false
---

[CF 102460I - 频谱](https://codeforces.com/problemset/problem/102460/I)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要根据元素之间的所有成对距离重建一个递增的整数数组 (X)。 第一个元素固定为零，每个元素都在 0 到 999 之间。对于每对位置 (i<j)，频谱包含值 (x_j-x_i)，包括重复值。 输入以排序顺序给出这些 (\frac{n(n-1)}2) 距离，任务是找到可以精确生成该多重集的每个数组。 

例如，(n=3) 的频谱 (1,2,3) 可以来自 (0,1,3) 或 (0,2,3)。 这些数组不同，但它们的成对距离相同。 我们必须按字典顺序输出两者。 

上限 (n\le62) 表示频谱最多包含 (\frac{62\cdot61}{2}=1891) 个值。 这足够小，我们可以维护一个按距离索引的频率表。 999 的坐标范围甚至更有用：每个距离都属于从 1 到 999 的微小范围，因此可以使用固定大小的数组而不是平衡树或哈希表来检查和定位剩余距离。 在一般的收费公路问题中，搜索本身不能是多项式，因此解决方案必须利用最大剩余距离的结构来使分支极小。 

第一个非显而易见的情况是（n=2）。 只有一个距离。 用于输入`2`其次是`7`，唯一的答案是`0 7`。 假设存在要重建的内部点的递归实现在这里将失败。 

第二种情况是无效谱，其最大值超出坐标限制。 例如，```
2
1000
```没有有效的答案，因为唯一可能的数组是`0 1000`，这违反了界限 (x_i\le999)。 粗心的实现可能会在不检查坐标约束的情况下重建端点。 

重复距离也需要被视为多重集。 例如，```
4
2 2 2 4 4 6
```有答案`0 2 4 6`。 值 2 出现了 3 次，因为三个不同的对被两个分隔开。 将频谱视为一个集合会丢失此信息并可能接受无效的数组。 

一个特别重要的情况是当前无法解释的最大距离出现两次并且正好是总宽度的一半。 为了```
5
1 1 1 1 2 2 2 3 3 4
```答案是`0 1 2 3 4`。 端点和中点之间的距离 2 出现了两次，但中间坐标只有一个，即 2。如果盲目地同时插入 (d) 和 (W-d) 的规则会插入相同的坐标两次。 

## 方法

 直接的强力解决方案会将端点固定在 0 和某个最大值 (W)，然后从它们之间的整数中选择剩余的 (n-2) 个坐标。 由于 (W\le999)，最坏情况考虑

 [
 \binom{998}{n-2}
 ]

 不同的内部坐标集。 然后，对于每个候选数组，我们生成所有 (\frac{n(n-1)}2) 距离，并将它们的多重性与输入谱进行比较。 因此，最坏情况的工作是

 [
 O\left(\binom{998}{n-2}n^2\right)。 
]

 对于（n=62）来说，这是远远不可行的。 

蛮力之所以有效，是因为明确检查每个候选者肯定是正确的，但它完全忽略了频谱中包含的最强信息：其最大距离。 

令最大距离为(W)。 任何有效的数组必须同时包含 0 和 (W)，因为最大距离只能是最小坐标和最大坐标之间的距离。 一旦这些端点固定，请考虑尚未由已选择的点解释的最大距离 (d)。 

只有两个可能的坐标可以解释通过端点的距离。 1 是 (d)，因为它距 0 的距离是 (d)。 另一个是(W-d)，因为它到(W)的距离是(d)。 因此，每个有效的完成必须至少包含这两个坐标之一。 

这给出了标准的收费公路重建策略。 我们反复采用最大的无法解释的距离，并尝试唯一可以解释它的坐标。 每当提出一个坐标时，它到已选择坐标的所有距离都必须存在于剩余的多重集中。 即使缺少一个所需的距离，该分支也是不可能的，可以立即丢弃。 

对于这个问题来说，基本的回溯仍然不够。 算术级数可以创建许多看起来对称的分支。 额外的观察是关于多重性的。 

假设最大的未解释距离是(d)，并且其剩余重数大于二。 这种状态是不可能的。 在此阶段，无法解释的 (d) 的出现只能通过放置 (d) 或 (W-d) 来解释。 只有这两个端点生成的事件可用。 任何一对差值为 (d) 的未来未放置点到端点也将具有较大的距离，并且该较大的距离将首先被处理。 因此，最多可以保留当前最大距离的两个副本。 

如果 (d) 恰好出现两次并且 (d\ne W-d)，则 (d) 和 (W-d) 都被强制。 没有理由分支。 如果只插入其中一个，则端点只能解释 (d) 的一个副本，而另一个副本必须来自未来的一对，其较大的端点距离应该已经被处理。 

如果(d=W-d)，则两个候选点是相同的。 这是中点情况，因此单个坐标可以解释两个端点距离。 

这些多重性规则瓦解了有问题的分支，使简单的收费公路 DFS 在实践中呈指数增长。 在理论上最坏的情况下，结果搜索仍然是指数级的，但坐标界限和强强制放置规则使其在给定的限制下变得实用。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O\left(\binom{998}{n-2}n^2\right)) | (O(n^2)) | 太慢了 |
 | 最大距离剪枝回溯| (O(2^n n^2 + Rn\log n)) 最坏情况 | (O(1000+n+Rn)) | 已接受 |

 这里（R）是有效解的数量。 (2^n) 项描述了理论搜索树界限。 在实践中，多重性规则删除了导致朴素版本超时的大型对称子树。 

## 算法演练

1. 读取 (\frac{n(n-1)}2) 距离并找到它们的最大值 (W)。 如果(W>999)，则没有有效的数组。 否则，初始化频率数组`cnt`， 在哪里`cnt[d]`存储有多少个距离 (d) 副本尚未使用。 
2. 将0 和(W) 放入当前坐标集中。 距离 (W) 已由该对解释，因此减少`cnt[W]`一个。 这些端点是强制的，因为没有其他端点对的距离可以大于最小和最大坐标之间的距离。 
3. 在每个递归状态下，找到剩余频率为正的最大距离（d）。 这是下一个必须解释的距离。 
4. 如果所有 (n) 个坐标均已放置，则将当前组记录为解。 每次成功插入都会精确删除新点引入的距离，因此达到 (n) 个点意味着完整的频谱已被消耗。 
5.如果(d)的剩余重数大于2，则停止该分支。 只有两个可能的端点位置（d）和（W-d）可以解释当前最大距离。 
6. 如果`cnt[d] == 2`和 (d\ne W-d)，尝试将 (d) 和 (W-d) 放在一起。 这是被迫的，因此在这种状态下没有分支。 
7. 否则，尝试将 (d) 作为候选坐标。 对于该候选者，计算其到每个已放置坐标的距离。 仅当每个所需距离都有足够的剩余重数时，候选者才是合法的。 如果合法，则删除这些距离，添加坐标，递归，然后在回溯时恢复所有内容。 
8. 如果(d\ne W-d)，也以同样的方式尝试(W-d)。 这是唯一两个能够解释当前最大距离的可能坐标。 
9. 搜索完成后，将所有重建的数组按字典顺序排序。 解决方案内的坐标在存储之前也会进行排序，因为所需的输出表示正在增加。 

### 为什么它有效

 关键的不变量是`cnt`始终准确地表示当前坐标尚未生成的距离`points`。 最初，仅删除了端点距离 (W)。 每当添加新坐标时，它到所有现有坐标的距离都会被精确删除，因此不变式仍然成立。 

对于最大剩余距离 (d)，有效完成必须包含 (d) 或 (W-d)。 如果两者都不存在，则产生距离 (d) 的任何一对未来点的端点距离都将大于 (d)，这与 (d) 是当前最大的无法解释距离这一事实相矛盾。 因此，搜索永远不会丢弃有效的解决方案。 

多重剪枝遵循相同的论点。 两个端点位置无法解释 (d) 的两个以上无法解释的副本，因此该状态无法得出解决方案。 当恰好剩下两个副本并且 (d\ne W-d) 时，两个端点位置都被强制。 中点情况有所不同，因为 (W/2) 处的一个点到两个端点的距离为 (d)。 

仅当在剩余多重集中找到所有新创建的距离后，每个候选者才会被接受。 因此，每个记录的阵列都具有准确所需的频谱。 由于每个有效的完成都遵循递归所考虑的候选选择之一，因此最终会找到每个有效的数组。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n, spec):
    m = n * (n - 1) // 2

    if len(spec) != m:
        return []

    width = spec[-1]

    if width > 999:
        return []

    cnt = [0] * (width + 1)

    for d in spec:
        if d <= 0 or d > width:
            return []
        cnt[d] += 1

    # The maximum distance must be between 0 and width.
    cnt[width] -= 1

    points = [0, width]
    answers = []

    def largest_remaining():
        for d in range(width, 0, -1):
            if cnt[d]:
                return d
        return 0

    def place(candidates):
        """Try placing all candidates as one forced/branched operation."""
        k = len(candidates)

        if len(points) + k > n:
            return

        if len(set(candidates)) != k:
            return

        for x in candidates:
            if x <= 0 or x >= width or x in points:
                return

        need = {}

        # Distances from every new point to every old point.
        for x in candidates:
            for y in points:
                d = abs(x - y)
                need[d] = need.get(d, 0) + 1

        # Distances between new points when two are inserted together.
        for i in range(k):
            for j in range(i + 1, k):
                d = abs(candidates[i] - candidates[j])
                need[d] = need.get(d, 0) + 1

        # Check whether the remaining spectrum contains all
        # distances introduced by the new points.
        for d, amount in need.items():
            if d == 0 or d > width or cnt[d] < amount:
                return

        # Apply the changes.
        for d, amount in need.items():
            cnt[d] -= amount

        points.extend(candidates)

        dfs()

        for _ in candidates:
            points.pop()

        for d, amount in need.items():
            cnt[d] += amount

    def dfs():
        if len(points) == n:
            answers.append(tuple(sorted(points)))
            return

        d = largest_remaining()

        if d == 0:
            return

        # At the current largest unexplained distance, at most
        # two copies can still be possible.
        if cnt[d] > 2:
            return

        reflected = width - d

        # Two copies force both symmetric positions, except when
        # they coincide at the midpoint.
        if cnt[d] == 2 and d != reflected:
            place((d, reflected))
            return

        # One copy means either endpoint-side candidate may be used.
        # When d == reflected there is only one distinct candidate.
        place((d,))

        if reflected != d:
            place((reflected,))

    dfs()

    answers.sort()
    return answers

def main():
    n_line = input().strip()
    if not n_line:
        return

    n = int(n_line)
    m = n * (n - 1) // 2

    spec = []
    while len(spec) < m:
        spec.extend(map(int, input().split()))

    answers = solve_case(n, spec)

    out = [str(len(answers))]
    for ans in answers:
        out.append(" ".join(map(str, ans)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```频率数组直接按距离索引。 这比字典更可取，因为最大可能距离仅为 999，因此每次查找和更新都是常数时间且常数非常小。 

初始化固定两个端点并消除它们的距离`cnt`。 这自然地处理了 (n=2) 的情况，因为在删除唯一的距离之后，递归立即发现两个所需的点已经存在。 

这`place`函数执行中央多重集操作。 它首先拒绝开区间 ((0,W)) 之外的坐标，因为端点已经占据了 0 和 (W)。 它还拒绝重复的坐标，因为原始数组必须包含不同的值。 

这`need`字典是必要的，因为几个新生成的对可以具有相同的距离。 例如，将中点插入到宽度均匀的区间中会生成到两个端点的相同距离。 修改前聚合多重性`cnt`防止一系列单独的支票意外接受副本不足的多重集。 

通过将两个坐标传递给来处理两个候选者的情况`place`立刻。 他们的相互距离包含在`need`，这是另一个微妙的细节。 忽略该距离会使光谱留下无法解释的副本，并且可能会错误地接受重建。 

递归深度最多为 62，因此 Python 的递归限制不是问题。 Python 整数也具有任意精度，尽管此问题中的每个相关值最多为 999 并且不需要大型算术。 

最后，重构后对答案进行排序。 DFS阶数是由谱重数决定的，而不是字典顺序，因此依赖搜索顺序不能满足输出要求。 

## 工作示例

 ### 示例 1

 输入是```
4
2 2 2 4 4 6
```重要的状态转换是：

 | 步骤| 最大剩余距离| 计数 | 候选人行动 | 当前积分 | 剩余频谱|
 | ---| ---| ---| ---| ---| ---|
 | 初始| 6 | 1 | 修复端点 0 和 6 | 0, 6 | 2,2,2,4,4 |
 | 1 | 4 | 2 | 力 2 和 4 | 0,2,4,6 | 2 |
 | 2 | 2 | 1 | 不需要新的点，因为 2 被消耗为 2 和 4 之间的距离 | 0,2,4,6 | 空 |

 距离 4 出现两次，因此坐标 4 和 (6-4=2) 是强制的。 将它们插入在一起也会创建它们的相互距离 2，从而消耗 2 的最终副本。重建完成。 

结果输出是```
1
0 2 4 6
```此示例练习了重数二规则以及计算两个同时插入的坐标之间的距离的需要。 

### 示例 2

 输入频谱为```
3 3 6 9 9 12 12 15 18 21
```重建从端点 0 和 21 开始。 

| 步骤| 剩余最大 | 计数 | 候选人尝试过| 需要新的距离| 当前积分 |
 | ---| ---| ---| ---| ---| ---|
 | 初始| 21 | 21 1 | 0, 21 固定 | 21 | 21 0,21 | 0,21 |
 | 1A | 18 | 18 1 | 18 | 18 18,3 | 0,18,21 |
 | 2A | 15 | 15 1 | 15 | 15 15,3,6 | 因 3 不可用而被拒绝 |
 | 2B | 15 | 15 1 | 6 | 6,15,12 | 0,6,18,21 |
 | 3A | 12 | 12 1 | 12 | 12 12,9,6 | 因 6 不可用而被拒绝 |
 | 3B | 12 | 12 1 | 9 | 9,12,3 | 0,6,9,18,21 |
 | 决赛| 0 | 0 | 完整| 无 | 0,6,9,18,21 |
 | 1C | 18 | 18 1 | 3 | 3,18 | 3,18 0,3,21 |
 | 2C | 15 | 15 1 | 15 | 15 15,6,12 | 0,3,15,21 |
 | 3C | 12 | 12 1 | 12 | 12 12,9,9,3 | 0,3,12,15,21 |
 | 决赛| 0 | 0 | 完整| 无 | 0,3,12,15,21 |

 两个分支都有效，产生```
2
0 3 12 15 21
0 6 9 18 21
```该迹线说明了为什么候选者不会仅仅因为其坐标合理而被接受。 从新坐标到每个现有坐标的每个距离都必须具有正确的重数。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(2^n n^2 + Rn\log n)) 最坏情况 | 正常状态下最多存在两个候选分支，每个候选分支最多检查到 (n) 个现有点的距离。 查找最大剩余距离扫描最多 999 个条目。 |
 | 空间| (O(1000+n+Rn)) | 频率数组使用(O(1000))，递归和当前坐标集使用(O(n))，存储所有答案需要(O(Rn))。 |

 理论搜索仍然是指数的，因为一般的收费公路重建问题不知道是否接受多项式时间解决方案。 相关的实际改进是最大距离重数规则经常将双向分支变成两个坐标的强制插入。 999的坐标限制也使得频率操作变得极其廉价。 最多 1891 个输入距离和最多 62 个递归深度，这非常适合规定的 5 秒和 1024 MB 限制。 

## 测试用例

 以下测试假设编辑解决方案另存为`solution.py`， 和`solve_case`可以从中获得。```python
from solution import solve_case

def run(inp: str) -> str:
    data = list(map(int, inp.split()))
    n = data[0]
    spec = data[1:]

    ans = solve_case(n, spec)

    out = [str(len(ans))]
    for x in ans:
        out.append(" ".join(map(str, x)))

    return "\n".join(out) + "\n"

# Provided sample 1
assert run("""
4
2 2 2 4 4 6
""") == """1
0 2 4 6
""", "sample 1"

# Provided sample 2
assert run("""
5
3 3 6 9 9 12 12 15 18 21
""") == """2
0 3 12 15 21
0 6 9 18 21
""", "sample 2"

# Provided sample 3
assert run("""
5
6 7 8 9 10
""") == """0
""", "sample 3"

# Minimum-size input, n = 2.
assert run("""
2
7
""") == """1
0 7
""", "minimum n"

# All spectrum values are equal, possible only for n = 2.
assert run("""
2
999
""") == """1
0 999
""", "maximum coordinate"

# Two different solutions, catches reflection handling.
assert run("""
3
1 2 3
""") == """2
0 1 3
0 2 3
""", "two reflected solutions"

# Invalid repeated distances for n = 3.
assert run("""
3
1 1 1
""") == """0
""", "impossible spectrum"

# Largest distance outside the allowed coordinate range.
assert run("""
2
1000
""") == """0
""", "coordinate boundary"

# Maximum n. Construct X = 0, 1, ..., 61.
x = list(range(62))
spec = []
for i in range(62):
    for j in range(i + 1, 62):
        spec.append(j - i)
spec.sort()

max_input = "62\n" + " ".join(map(str, spec)) + "\n"
max_expected = "1\n" + " ".join(map(str, x)) + "\n"

assert run(max_input) == max_expected, "maximum n"
```定制案例可总结如下。 

| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 7`|`1 / 0 7`| 最小值（n），端点初始化 |
 |`2 / 999`|`1 / 0 999`| 最大坐标边界|
 |`3 / 1 2 3`| 两种解决方案 | 反思和词典排序|
 |`3 / 1 1 1`|`0`| 无效的重数 |
 |`2 / 1000`|`0`| 拒绝不可能的宽度 |
 |`62`与频谱`0..61`| 一种解决方案 | 最大值（n）、递归深度、大谱 |

 ## 边缘情况

 对于 (n=2)，输入```
2
7
```从端点 0 和 7 开始。唯一的频谱值立即被它们对消耗，因此当前集合已经具有所需的两个元素。 算法记录`0 7`而不尝试插入内部坐标。 

对于坐标边界，```
2
999
```宽度正好是999，所以可以接受。 结果是`0 999`。 实施检查`width > 999`，而不是`width >= 999`，这避免了合法上限处的相差一错误。 

对于超出范围的宽度，```
2
1000
```最大距离本身需要一个值为 1000 的元素，因为第一个元素固定为零。 该算法在开始搜索之前会拒绝该案例。 

对于重复的距离，```
4
2 2 2 4 4 6
```宽度 6 固定端点。 下一个最大距离是 4，重数为 2，因此 4 和 (6-4=2) 都是强制的。 他们的相互距离又是2，消耗了距离2的所有三个副本。最终的数组是`0 2 4 6`。 

对于中点情况，```
5
1 1 1 1 2 2 2 3 3 4
```宽度为4。当距离2成为重数为2的最大剩余距离时，两个候选者都是坐标2，因为(4-2=2)。 该算法识别出候选点一致并仅插入一个点。 该点创建两个端点距离为 2，而其到其他选定坐标的距离则占剩余副本。 

对于无效频谱，```
3
1 1 1
```宽度为 1，因此端点必须为 0 和 1。第三个不同的坐标不能严格适合它们。 递归搜索找不到合法候选并返回零解。 

对于两种解决方案的情况，```
3
1 2 3
```端点是 0 和 3。最大剩余距离是 2，其候选距离是 2 和 1。放置 1 会产生`0 1 3`，同时放置 2 产生`0 2 3`。 两者消耗完全相同的频谱，并对最终答案进行排序`0 1 3`前`0 2 3`。 

所有这些情况背后的中心不变量是剩余的频率表。 一个分支永远不会仅仅因为它的坐标看起来合理而被接受。 每个新创建的对必须消耗输入多重集中的一个匹配副本，并且当分支被放弃时，每个消耗的副本都会被恢复。 这可以防止重复距离、中点距离和对称解被错误处理。
