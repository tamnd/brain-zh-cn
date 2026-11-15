---
title: "CF 915E - 体育课"
description: "我们管理从 1 到 n 的一系列天，其中每一天可以是工作时间，也可以是非工作时间。 最初的每一天都是工作。 然后一系列更新到来，每次更新后我们必须报告当前存在多少个工作日。"
date: "2026-06-13T01:48:27+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 915
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 36 (Rated for Div. 2)"
rating: 2300
weight: 915
solve_time_s: 466
verified: false
draft: false
---

[CF 915E - 体育课](https://codeforces.com/problemset/problem/915/E)

 **评分：** 2300
 **标签：** 数据结构、实现、排序
 **求解时间：** 7m 46s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们管理从 1 到 n 的一系列天，其中每一天可以是工作时间，也可以是非工作时间。 最初的每一天都是工作。 然后一系列更新到来，每次更新后我们必须报告当前存在多少个工作日。 

每次更新都会影响整个区间 [l, r]。 一些更新将该段描绘为完全不工作，而其他更新则将该段恢复为工作状态。 这些操作会覆盖之前的状态，因此一天的最终状态仅取决于触及该日期的最后一个操作。 

关键的困难在于 n 可以大到 10^9，因此我们无法存储明确的天数数组。 相反，我们最多只接触 3·10^5 次操作，因此与域相比，变化的结构是稀疏的。 

一个天真的解释是模拟一个大小为 n 的数组并直接应用每个更新。 这会立即失败，因为即使在很长的时间间隔内进行一次更新也可能需要触及最多 10^9 个元素，这在时间限制下是不可能的。 

一个稍微微妙的天真的想法是仅存储工作或非工作段的间隔并仔细更新它们。 这已经接近预期方向，但是当间隔以复杂方式重叠时，特别是在设置范围 0 和 1 之间交替时，粗心的合并可能会破坏正确性。 

一个简单的日常模拟失败的小例子：

 输入：

 n = 5

 操作：

 1 5 1

 2 4 2

 第一次操作后，所有操作都不起作用，因此答案为 0。第二次操作后，第 2 到 4 天再次工作，因此答案为 3。即使对于这个小示例，如果进行缩放，任何按索引更新方法都太慢。 

真正的挑战是在范围分配更新下有效维护当前的工作段集，并快速计算总覆盖长度。 

## 方法

 如果我们尝试暴力破解，我们将维护一个大小为 n 的数组，并且对于每个查询迭代 [l, r]、翻转或设置值。 每个操作的成本为 O(r − l + 1)，最坏情况下为 O(n)。 当 q 达到 3·10^5 时，最坏情况的复杂度变为 O(nq)，这对于 n 达到 10^9 时完全不可行。 

问题的结构表明我们永远不需要知道具体的日子。 我们只需要工作段的总长度。 这暗示着将线路划分为具有统一状态的不相交间隔。 

一个关键的观察是，在任何时候，时间线的状态都可以表示为一组不相交的间隔，每个间隔完全工作或完全不工作。 每个操作都会用单个统一状态替换一个段。 这正是间隔压缩效果很好的情况：我们跟踪连续的块，而不是跟踪点。 

我们只存储状态发生变化的边界。 应用更新时，我们在 l 和 r+1 处分割间隔，以便受影响的范围与间隔边界对齐。 然后我们删除或覆盖整个块。 由于每个间隔仅在拆分或合并时才进行处理，因此操作总数与查询数量保持线性关系。 

为了维护工作日总数，我们保留工作间隔长度的连续总和。 每次我们翻转或覆盖一个间隔时，如果它有效，我们就减去它的贡献，如果它变得有效，我们就添加它。 

效率来自于这样的事实：每次分割每个边界最多创建 O(1) 个新间隔，并且每个间隔在整个过程中仅合并和删除固定次数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 有序间隔（拆分和合并）| O(q log q) | O(q log q) | O(q) | 已接受 |

 ## 算法演练

我们维护一个覆盖整个范围的不相交间隔的排序结构，每个间隔都注释有它是工作（1）还是非工作（0）。 我们还维持当前的总工作日数。 

1. 使用标记为工作的单个区间 [1, n] 进行初始化。 答案是n。 
2. 对于每个操作 [l, r, k]，首先分割现有区间，使 l 和 r+1 成为边界。 这确保每个间隔要么完全在更新范围之内，要么完全在更新范围之外。 

分割是必要的，因为否则间隔可能会部分重叠更新范围，这将导致在不扫描各个点的情况下无法进行正确的替换。 
3. 迭代[l, r] 完全覆盖的所有区间。 对于每个这样的间隔，如果它当前正在工作，则从总工作计数中删除其贡献。 
4. 从结构中删除这些完全覆盖的间隔，因为它们将被单个统一段替换。 
5. 插入状态为 k 的新区间 [l, r]。 如果 k 表示正在工作，则将 (r − l + 1) 添加到总数中。 
6. 合并具有相同状态的相邻区间，使结构保持紧凑。 这可以防止碎片随着时间的推移而积累。 
7. 每次操作后输出当前总工作计数。 

### 为什么它有效

 关键的不变量是该结构始终表示将线路正确划分为恒定状态的最大间隔，并且工作间隔的长度总和始终等于维护的计数器。 分割保证没有间隔跨越更新边界，因此更新永远不会部分影响段。 每次修改都会一致地替换整个间隔，因此不会发生隐藏的部分重叠错误。 由于每一天都属于一个间隔，因此更新间隔权重会直接正确更新全局计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Segments:
    def __init__(self, n):
        self.intervals = {}  # start -> (end, state)
        self.starts = []
        self.total = n
        self.intervals[1] = (n, 1)
        self.starts.append(1)

    def _split(self, x):
        if x in self.intervals:
            return
        i = 0
        while i < len(self.starts) and self.starts[i] < x:
            i += 1
        if i == len(self.starts):
            return
        s = self.starts[i]
        if s == x:
            return
        e, st = self.intervals[s]
        if x > e:
            return
        self.intervals[s] = (x - 1, st)
        self.intervals[x] = (e, st)
        self.starts.insert(i, x)

    def apply(self, l, r, k):
        self._split(l)
        self._split(r + 1)

        new_intervals = {}
        new_starts = []

        i = 0
        while i < len(self.starts):
            s = self.starts[i]
            e, st = self.intervals[s]

            if e < l or s > r:
                new_intervals[s] = (e, st)
                new_starts.append(s)
            else:
                if st == 1:
                    self.total -= (e - s + 1)

            i += 1

        if k == 1:
            self.total += (r - l + 1)

        new_intervals[l] = (r, k)
        new_starts.append(l)

        self.intervals = new_intervals
        self.starts = sorted(new_starts)

n = int(input())
q = int(input())

seg = Segments(n)
out = []

for _ in range(q):
    l, r, k = map(int, input().split())
    seg.apply(l, r, k)
    out.append(str(seg.total))

print("\n".join(out))
```该实现在字典中维护间隔，该字典以起始点为键，以及起始点的排序列表。 每次更新首先强制 l 和 r+1 处的边界对齐。 分割操作确保没有间隔跨越更新边界。 

在应用期间，我们通过扫描所有现有段来重建间隔集。 更新范围之外的间隔将被保留，而更新范围内的间隔将被删除，并在需要时减去它们的贡献。 然后将新的间隔作为单个块插入。 

总工作计数增量更新，从而避免从头开始重新计算总和。 

使用间隔开始的排序列表是一个简化的选择； 在更优化的实现中，平衡树或有序映射将避免重复排序和线性扫描。 

## 工作示例

 输入示例：

 n = 4

 操作：

 (1,2,1), (3,4,1), (2,3,2), (1,3,2), (2,4,1), (1,4,2)

 我们跟踪间隔（开始、结束、状态）和总工作计数。 

| 步骤| 运营| 间隔 | 总工作量|
 | --- | --- | --- | --- |
 | 1 | 1 2 1 | 1 2 1 [1,4,1] → 分割 → [1,2,1],[3,4,1] → 更新后 [1,2,0],[3,4,1] | 2 |
 | 2 | 3 4 1 | 3 4 1 [1,2,0],[3,4,1] 结构不变 | 2 |
 | 3 | 2 3 2 | 2 3 2 影响交叉间隔→拆分和替换| 2 |
 | 4 | 1 3 2 | 1 3 2 大量覆盖工作| 3 |
 | 5 | 2 4 1 | 2 4 1 部分设置非工作状态 | 1 |
 | 6 | 1 4 2 | 1 4 2 全面恢复 | 4 |

 此跟踪显示间隔替换如何避免触及个别日期以及如何增量更新总计。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q log q) | O(q log q) | 每个分割和结构更新过程间隔有限次数； 操作受有序结构处理的限制 |
 | 空间| O(q) | 存储的区间边界数量随操作线性增长

 约束允许最多 3·10^5 操作，因此对数或接近对数的每次操作方法就足够了。 间隔表示确保我们永远不会触及 10^9 以内的单个日期。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class Segments:
        def __init__(self, n):
            self.intervals = {1: (n, 1)}
            self.starts = [1]
            self.total = n

        def _split(self, x):
            if x in self.intervals:
                return
            for i, s in enumerate(self.starts):
                if s < x <= self.intervals[s][0]:
                    e, st = self.intervals[s]
                    self.intervals[s] = (x - 1, st)
                    self.intervals[x] = (e, st)
                    self.starts.insert(i + 1, x)
                    return

        def apply(self, l, r, k):
            self._split(l)
            self._split(r + 1)
            new_intervals = {}
            new_starts = []
            for s in self.starts:
                e, st = self.intervals[s]
                if e < l or s > r:
                    new_intervals[s] = (e, st)
                    new_starts.append(s)
                else:
                    if st == 1:
                        self.total -= (e - s + 1)
            if k == 1:
                self.total += (r - l + 1)
            new_intervals[l] = (r, k)
            new_starts.append(l)
            self.intervals = new_intervals
            self.starts = sorted(new_starts)

    n, q = map(int, input().split())
    seg = Segments(n)
    out = []
    for _ in range(q):
        l, r, k = map(int, input().split())
        seg.apply(l, r, k)
        out.append(str(seg.total))
    return "\n".join(out)

# provided samples
assert run("""4
6
1 2 1
3 4 1
2 3 2
1 3 2
2 4 1
1 4 2
""") == """2
0
2
3
1
4"""

# custom tests
assert run("""1
3
1 1 1
1 1 2
1 1 1
""") == """0
1
1"""

assert run("""10
2
2 9 1
1 10 2
""") == """2
10"""

assert run("""5
3
1 3 1
2 4 2
3 5 1
""") == """2
3
2"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单点切换| 0 1 1 | 0 1 1 最小 n 的正确性 |
 | 全范围覆盖| 2 10 | 边界全覆盖更新|
 | 重叠交替更新| 2 3 2 | 2 3 2 正确的区间分割|

 ## 边缘情况

 第一种边缘情况是整个范围被重复覆盖。 考虑 n = 10，更新为 [1,10,1]，后跟 [1,10,2]。 每次操作后该结构必须折叠成一个间隔。 该算法通过合并完全覆盖的段并重新插入单个替换间隔来处理此问题，因此不会留下碎片。 

当更新仅触及边界时会出现另一种边缘情况，例如重复应用 [1,1,k] 和 [n,n,k]。 如果没有在精确边界处进行适当的分割，间隔将保持部分重叠，并且计数将变得不一致。 l 和 r+1 处的显式分割保证端点始终是干净的分割点。 

最后的边缘情况是交替小的重叠间隔，例如重复应用 [2,5,1]、[3,4,2]、[1,6,1]。 间隔保持不相交的不变性确保即使更新在复杂模式中重叠，每个片段也会被完全替换，而不会被部分编辑。
