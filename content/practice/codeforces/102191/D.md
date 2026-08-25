---
title: "CF 102191D - 图片日"
description: "我们有 (n) 个学生，其中 (n) 是偶数，并且学生已经分为 (n/2) 个友谊对。 每对的两名学生必须在最后一行占据连续的位置。 在一对内，任一顺序都是允许的。"
date: "2026-08-25T08:19:58+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102191
codeforces_index: "D"
codeforces_contest_name: "PSUT Coding Marathon 2019"
rating: 0
weight: 102191
solve_time_s: 2278
verified: false
draft: false
---

[CF 102191D - 图片日](https://codeforces.com/problemset/problem/102191/D)

 **评级：** -
 **标签：** -
 **求解时间：** 37m 58s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有 (n) 个学生，其中 (n) 是偶数，并且学生已经分为 (n/2) 个友谊对。 每对的两名学生必须在最后一行占据连续的位置。 在一对内，任一顺序都是允许的。 

暂时忽略这对，一个有效的高度序列有一个峰值：高度可能保持不变或增加到峰值，然后它们可能保持不变或减小。 任务是选择对的顺序和每对的方向，以便同时满足这两个要求。 如果无法做到这一点，我们将打印`-1`。 

对于具有高度 (a) 和 (b) 的一对，将其存储为区间 ([l,r]) 很有用，其中 (l=\min(a,b)) 和 (r=\max(a,b))。 如果该对完全位于递增侧，则它必须显示为 (l,r)。 如果它完全位于递减一侧，则它必须显示为 (r,l)。 

考虑由区间 ([l_1,r_1]) 和 ([l_2,r_2]) 表示的两对。 如果它们都在递增的一侧，则仅当 (r_1\le l_2) 时第一个可以先于第二个。 因此两个重叠的区间不能在同一侧。 同样的推理也适用于减少的一侧。 允许相等，因此仅在端点处接触的间隔不会发生冲突。 

约束 (n\le 3\cdot10^5) 排除了任何涉及对的排列或所有对关系的二次构造的情况。 最多有 (150000) 对，因此 (O(n^2)) 方法已经执行大约 (2.25\cdot10^{10}) 对比较。 由于 2 秒的限制，预期的复杂性需要约为 (O(n\log n)) 或更好。 

一些边缘情况很容易被错误处理。 首先，触摸间隔是兼容的。 为了```
4
1 3
3 5
```安排`1 3 3 5`是有效的。 将共享端点的间隔视为重叠的粗心实现会错误地拒绝它。 

其次，一对可以包含相同的高度。 为了```
2
5 5
```答案`5 5`是有效的。 该对本身不会增加或减少，并且等高间隔也可以彼此相邻而不违反单调性。 

第三，几对可以共享全局最大值。 对于样本输入，两对`[6,7]`和`[5,7]`包含高度`7`。 我们不能简单地假设第一个这样的对是峰值对。 下面的结构选择具有最大较小端点的全局最大对，这是提供最强可能保证的选择。 

最后，三个相互重叠的对会使答案变得不可能。 为了```
6
1 10
2 9
3 8
```每对都与其他对重叠。 最多一对可以占据峰值位置，留下两个重叠的对必须位于同一侧。 因此正确的输出是`-1`。 

## 方法

 最直接的暴力解决方案将每对友谊对视为一个块。 对于 (m=n/2) 个块，每个块有 (m!) 个可能的顺序和两个可能的方向，从而给出 (2^m m!) 个候选。 对于每个候选者，我们将扩展块并检查所得的（n）元素序列是否是单峰的。 这需要每个候选者进行 (\Theta(n)) 工作，因此总数为 (\Theta(n2^m m!))。 在最大输入大小下，这已经意味着 (2^{150000}\cdot150000!) 在检查其中一个之前可能的安排，这是完全不可行的。 

有用的观察是一对可以被视为一个区间 ([l,r])。 重叠的两对不能放置在同一单调侧。 因此，在确定哪对包含峰值后，每个剩余的对都必须分配给两侧之一，并且重叠的对必须分配不同的侧。 

对于峰值对有一个特别有用的选择。 设所有学生中最大的身高为(H)，并在所有包含(H)的对中，选择([L,H])中具有最大(L)的对。 只要存在解，该对就始终可以作为峰值对。 

为什么选择最大的 (L) 很重要？ 具有 (r>L) 的所有其他对都重叠 ([L,H])，因为其最大值高于 (L)，而高度不能超过 (H)。 这样的一对不能与峰值对放在同一侧，因此它们都被迫放在相反的一侧。 每对 (r\l​​e L) 都不与峰值对重叠，并且可能会走向任一侧。 

去除峰值对后，剩下的问题正是区间重叠图上的双色问题。 将一侧着色为左侧，将另一侧着色为右侧。 具有 (r>L) 的对在右侧预着色。 如果存在有效的着色，则可以通过增加左端点来对左间隔进行排序，而可以通过减少左端点来对右间隔进行排序。 

区间图不需要简单地构建。 按左端点对间隔进行排序后，维护当前活动的间隔。 如果在两个较早的间隔仍处于活动状态时开始新的间隔，则所有三个间隔都会在该位置重叠，从而产生三角形。 这样的图不能分成两个单调的边，因此我们可以立即拒绝候选者。 当至多有 1 个活动间隔时，至多有 1 个重叠边缘要添加。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n2^{n/2}(n/2)!)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳 | (O(n\log n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 用 (l\le r) 将每个友谊对归一化为区间 ([l,r])。 在 (r) 为全局最大值 (H) 的所有对中，选择具有最大 (l) 的对。 将其称为峰值对 ([L,H])。 删除这对留下 (m-1) 个间隔。 
2. 将每个剩余间隔（r>L）标记为强制到右侧。 这样的间隔与峰值对重叠，因此将其放在左侧会使序列在峰值对之前减少或在峰值对之后以错误的方向增加。 具有 (r\l​​e L) 的间隔保持非受迫状态，因为它们可以接触或完全位于峰值对的左端点下方。 
3. 按左端点对剩余间隔进行排序。 从左到右扫描它们，同时保留最小堆的间隔，其右端点仍然严格大于当前左端点。 具有 (r\l​​e l_{\text{current}}) 的间隔将从堆中删除，因为允许在端点处进行触摸。 
4. 如果新间隔开始时两个间隔仍然有效，则三个间隔成对重叠。 它们在重叠图中形成一个三角形，如果不在同一边上放置两个重叠对，则两条边不能包含所有三个。 返回`-1`。 
5. 如果恰好有一个间隔处于活动状态，则将当前间隔连接到该活动间隔。 这两对必须占据相对的两侧。 然后将当前区间插入堆中。 
6. 使用 BFS 或 DFS 对生成的重叠图进行两种颜色处理。 两种颜色代表图片的两侧。 最初，每个强制间隔都会接收右侧颜色。 未着色的连通分量可以以任一颜色开始。 每当遍历一条边时，相邻区间必须接收相反的颜色。 如果一条边要求两个间隔具有相同的颜色，则构造是不可能的。 
7. 收集左侧所有颜色的区间，并按递增 (l) 对它们进行排序。 将每个输出为 (l,r)。 因为相同颜色的区间永远不会重叠，所以这会产生一个非递减序列，并且这一侧的最终区间为 (r\l​​e L)。 
8. 将所选峰值对输出为 (L,H)。 该对从高度 (H) 处开始递减部分，因此它自然地连接到每个右侧区间。 
9. 收集右侧区间并按降序 (l) 对它们进行排序。 将每个输出为 (r,l)。 由于这些间隔是成对不重叠的，因此它们的递减方​​向完全按照所需的顺序连接。 最后打印整个序列。 

### 为什么它有效

 关键的不变量是分配给相同颜色的间隔永远不会重叠。 在左侧，此类间隔的递增方向可以从小到大排序，因为对于连续间隔，我们有 (r_i\le l_{i+1})。 在右侧，出于同样的原因，可以按相反方向对递减方向进行排序。 

峰对的选择使得预着色变得安全。 假设存在一些有效的图片。 令 ([L,H]) 为包含全局最大值 (H) 的所有对中具有最大 (L) 的选定对。 每个 (r>L) 的区间都与该对重叠，因此它必须位于任何有效图片的相反一侧。 由于所有这些间隔都在同一侧，因此它们也必须是成对不重叠的。 因此，现有的有效图片给出了所有剩余间隔的有效双色，其中每个强制间隔都具有相同的颜色。 只要存在这种颜色，我们的 BFS 就会发现这种颜色。 

相反，如果我们的图形着色成功，则一侧的每一对都不会与该侧的所有其他对重叠。 该构造根据其间隔端点对每条边进行排序，将峰对放置在它们之间，并将峰对定向到峰。 然后，每个相邻边界在所需方向上都是单调的，因此生成的序列是有效的图片。 

## Python 解决方案```python
import sys
import heapq
from collections import deque

input = sys.stdin.readline

def build_solution(pairs):
    m = len(pairs)

    intervals = []
    for a, b in pairs:
        if a <= b:
            intervals.append((a, b))
        else:
            intervals.append((b, a))

    # Choose the pair containing the global maximum,
    # with the largest possible smaller endpoint.
    peak = 0
    for i in range(1, m):
        if intervals[i][1] > intervals[peak][1]:
            peak = i
        elif intervals[i][1] == intervals[peak][1]:
            if intervals[i][0] > intervals[peak][0]:
                peak = i

    L, H = intervals[peak]

    rest = []
    for i, (l, r) in enumerate(intervals):
        if i != peak:
            rest.append((l, r))

    k = len(rest)
    if k == 0:
        return [L, H]

    # Sort by left endpoint for the interval sweep.
    order = list(range(k))
    order.sort(key=lambda i: (rest[i][0], rest[i][1]))

    graph = [[] for _ in range(k)]
    heap = []

    for idx in order:
        l, r = rest[idx]

        while heap and heap[0][0] <= l:
            heapq.heappop(heap)

        # Two active intervals plus the current one would
        # form a triangle.
        if len(heap) >= 2:
            return None

        if heap:
            other = heap[0][1]
            graph[idx].append(other)
            graph[other].append(idx)

        heapq.heappush(heap, (r, idx))

    # Color 0 = left, 1 = right.
    color = [-1] * k

    # Every interval with r > L overlaps the peak interval,
    # so it must be on the right.
    for i, (l, r) in enumerate(rest):
        if r > L:
            color[i] = 1

    # Propagate the forced colors through the graph.
    for start in range(k):
        if color[start] != -1:
            continue

        color[start] = 0
        q = deque([start])

        while q:
            u = q.popleft()

            for v in graph[u]:
                wanted = color[u] ^ 1

                if color[v] == -1:
                    color[v] = wanted
                    q.append(v)
                elif color[v] != wanted:
                    return None

    left = []
    right = []

    for i, (l, r) in enumerate(rest):
        if color[i] == 0:
            left.append((l, r))
        else:
            right.append((l, r))

    # Increasing side.
    left.sort(key=lambda x: (x[0], x[1]))

    # Decreasing side, closest to the peak first.
    right.sort(key=lambda x: (x[0], x[1]), reverse=True)

    answer = []

    for l, r in left:
        answer.extend((l, r))

    answer.extend((L, H))

    for l, r in right:
        answer.extend((r, l))

    return answer

def main():
    n = int(input())
    pairs = [tuple(map(int, input().split())) for _ in range(n // 2)]

    answer = build_solution(pairs)

    if answer is None:
        print(-1)
    else:
        print(*answer)

if __name__ == "__main__":
    main()
```第一部分`build_solution`将每一对标准化为 ((l,r))。 这不会丢失任何信息，因为友谊对内的原始顺序是无关的。 

循环选择`peak`首先比较较大的端点，然后比较较小的端点。 第二个比较是必要的。 在包含全局最大值的对中，选择最大的较小端点可以最大限度地减少被迫到达峰值另一侧的对的集合。 

间隔扫描使用`r <= l`从堆中删除间隔时。 这是使触摸间隔兼容的边界条件。 例如，`[1,3]`和`[3,5]`可以按递增顺序连续。 

当两对重叠时，该图恰好包含一条边。 堆包含每个已开始但尚未结束的间隔。 在有效的双色区间图中，当新区间开始时，最多可以保留一个先前活动的区间。 如果剩下两个，则新间隔与两者重叠，而这两个间隔也彼此重叠，形成一个三角形。 

着色阶段首先分配颜色`1`到每个间隔`r>L`。 These are the pairs that overlap the peak pair and consequently cannot be on the same side as it. 然后，BFS 通过每个重叠边缘传播所需的相反颜色。 

最终的排序在两侧故意不同。 左侧使用递增(l)，每个块都打印为(l,r)。 右侧使用递减(l)，每个块都打印为(r,l)。 The peak pair is printed between these two groups as (L,H).

 Python 整数可处理高达 (10^9) 的高度，而不会出现任何溢出问题。 对性能重要的主要实现细节是使用`heapq`和邻接列表，而不是扫描所有先前的间隔来查找每个新的间隔。 

## 工作示例

 ### 示例 1

 输入是```
8
1 3
4 2
6 7
5 7
```经过标准化并选择具有最大较小端点的全局最大对后，`[6,7]`成为峰值对。 

| 步骤| 当前间隔| 活动间隔| 添加边缘| 强行向右|
 | --- | --- | --- | --- | --- |
 | 1 |`[1,3]`| 无 | 无 | 没有|
 | 2 |`[2,4]`|`[1,3]`|`[1,3] - [2,4]`| 没有|
 | 3 |`[5,7]`| 无 | 无 | 是的 |

 间隔`[1,3]`和`[2,4]`重叠，因此它们收到相反的颜色。 间隔`[5,7]`被迫向右移动，因为其右端点大于峰的左端点 (6)。 

有效的着色是```
Left:  [1,3]
Peak:  [6,7]
Right: [5,7], [2,4]
```该构造的结果序列是```
1 3 6 7 7 5 4 2
```到第一个为止都是不减的`7`并且之后不再增加。 每个原始对仍然相邻。 

### 构造不可能的情况

 考虑```
6
1 10
2 9
3 8
```所选峰值为`[1,10]`。 其他间隔是`[2,9]`和`[3,8]`。 

| 步骤| 当前间隔| 活动间隔| 添加边缘| 强行向右|
 | --- | --- | --- | --- | --- |
 | 1 |`[2,9]`| 无 | 无 | 是的 |
 | 2 |`[3,8]`|`[2,9]`|`[2,9] - [3,8]`| 是的 |

 剩余的两个间隔都被迫向右，但它们彼此重叠。 图形边缘要求它们有不同的颜色，而预着色则要求两者都有颜色`1`。 BFS检测矛盾并返回`-1`。 

这说明了为什么仅检查每对是否单独适合峰值旁边是不够的。 被迫站在同一侧的对也必须相互兼容。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\log n)) | 对区间和最终组进行排序的成本为 (O(n\log n))，而堆操作和图遍历的成本分别为 (O(n\log n)) 和 (O(n))。 |
 | 空间| (O(n)) | (O(n)) | 间隔、堆、邻接表、颜色和输出都需要线性空间。 |

 最多有 (150000) 个友谊对，因此 (O(n\log n)) 仅执行几百万对数规模的操作。 (O(n)) 内存使用量也完全符合 256 MB 的限制。 

## 测试用例

 输出是建设性的，因此测试应该验证返回的序列，而不是将其与一个特定的答案进行比较。 以下线束检查对块，验证每个输入对是否仅使用一次，并检查单峰属性。```python
import sys
import io
from collections import Counter
import heapq
from collections import deque

def solution(inp: str) -> str:
    data = inp.split()
    it = iter(data)

    n = int(next(it))
    pairs = [(int(next(it)), int(next(it))) for _ in range(n // 2)]

    intervals = []
    for a, b in pairs:
        if a <= b:
            intervals.append((a, b))
        else:
            intervals.append((b, a))

    m = len(intervals)

    peak = 0
    for i in range(1, m):
        if intervals[i][1] > intervals[peak][1]:
            peak = i
        elif intervals[i][1] == intervals[peak][1]:
            if intervals[i][0] > intervals[peak][0]:
                peak = i

    L, H = intervals[peak]

    rest = [intervals[i] for i in range(m) if i != peak]
    k = len(rest)

    if k == 0:
        return f"{L} {H}"

    order = sorted(range(k), key=lambda i: (rest[i][0], rest[i][1]))

    graph = [[] for _ in range(k)]
    heap = []

    for idx in order:
        l, r = rest[idx]

        while heap and heap[0][0] <= l:
            heapq.heappop(heap)

        if len(heap) >= 2:
            return "-1"

        if heap:
            other = heap[0][1]
            graph[idx].append(other)
            graph[other].append(idx)

        heapq.heappush(heap, (r, idx))

    color = [-1] * k

    for i, (l, r) in enumerate(rest):
        if r > L:
            color[i] = 1

    for start in range(k):
        if color[start] != -1:
            continue

        color[start] = 0
        q = deque([start])

        while q:
            u = q.popleft()

            for v in graph[u]:
                wanted = color[u] ^ 1

                if color[v] == -1:
                    color[v] = wanted
                    q.append(v)
                elif color[v] != wanted:
                    return "-1"

    left = []
    right = []

    for i, interval in enumerate(rest):
        if color[i] == 0:
            left.append(interval)
        else:
            right.append(interval)

    left.sort()
    right.sort(reverse=True)

    ans = []

    for l, r in left:
        ans.extend((l, r))

    ans.extend((L, H))

    for l, r in right:
        ans.extend((r, l))

    return " ".join(map(str, ans))

def run(inp: str) -> str:
    return solution(inp)

def valid(inp: str, out: str) -> bool:
    data = inp.split()
    n = int(data[0])
    values = list(map(int, data[1:]))

    if out.strip() == "-1":
        return False

    ans = list(map(int, out.split()))

    if len(ans) != n:
        return False

    pairs = []
    for i in range(n // 2):
        a = values[2 * i]
        b = values[2 * i + 1]
        pairs.append(tuple(sorted((a, b))))

    produced = []
    for i in range(0, n, 2):
        produced.append(tuple(sorted((ans[i], ans[i + 1]))))

    if Counter(pairs) != Counter(produced):
        return False

    peak = max(ans)
    first_peak = ans.index(peak)

    for i in range(first_peak):
        if ans[i] > ans[i + 1]:
            return False

    for i in range(first_peak, n - 1):
        if ans[i] < ans[i + 1]:
            return False

    return True

sample1 = """\
8
1 3
4 2
6 7
5 7
"""

out = run(sample1)
assert valid(sample1, out), "sample 1"

minimum = """\
2
1 1
"""

out = run(minimum)
assert valid(minimum, out), "minimum-size case"

touching = """\
4
1 3
3 5
"""

out = run(touching)
assert valid(touching, out), "touching intervals must be allowed"

all_equal = """\
6
5 5
5 5
5 5
"""

out = run(all_equal)
assert valid(all_equal, out), "all-equal heights"

impossible = """\
6
1 10
2 9
3 8
"""

assert run(impossible).strip() == "-1", "three mutually overlapping pairs"

boundary = """\
4
1 1000000000
999999999 1000000000
"""

out = run(boundary)
assert valid(boundary, out), "height boundary case"

# Maximum-size case: 300000 students, 150000 pairwise disjoint intervals.
m = 150000
maximum_pairs = "\n".join(f"{2 * i} {2 * i + 1}" for i in range(m))
maximum = f"{2 * m}\n{maximum_pairs}\n"

out = run(maximum)
assert valid(maximum, out), "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 任何有效的安排 | 基本结构和双面着色 |
 |`2 / 1 1`| 任何有效的安排 | 最小输入和单对 |
 |`4 / 1 3 / 3 5`| 任何有效的安排 | 端点接触不得视为重叠 |
 |`6 / 5 5 / 5 5 / 5 5`| 任何有效的安排 | 等高零宽度间隔 |
 |`6 / 1 10 / 2 9 / 3 8`|`-1`| 区间重叠引发的强迫方冲突|
 |`4 / 1 1000000000 / 999999999 1000000000`| 任何有效的安排 | 最大高度边界和多个全局最大值 |
 | 300000 名互不相交的学生 | 任何有效的安排 | 最大输入大小和 (O(n\log n)) 性能 |

 ## 边缘情况

 ### 一对

 对于```
2
7 3
```归一化间隔是`[3,7]`。 自动选择为峰值对，没有剩余区间，答案为`3 7`。 该序列一般是单峰的，并且友谊对是相邻的。 

### 等高

 对于```
6
5 5
5 5
5 5
```每个区间是`[5,5]`。 由于扫描会在任何时候删除一个间隔`r <= l`，等高间隔永远不会产生重叠边缘。 该算法可以将峰值对放在中心，将所有其他对放在两侧。 每个可能的输出完全由`5`，所以它是有效的。 

### 触摸间隔

 对于```
4
1 3
3 5
```间隔`[1,3]`和`[3,5]`接触但在与问题相关的意义上不重叠。 扫描过程`[1,3]`，然后在处理之前将其删除`[3,5]`因为`3 <= 3`。 没有创建图边。 该算法可以选择`[3,5]`作为峰值并把`[1,3]`左边，生产```
1 3 3 5
```整个过程是不减的。 

### 包含全局最大值的多个对

 对于```
4
1 1000000000
999999999 1000000000
```两对都有全局最大值 (10^9)。 算法选择`[999999999,1000000000]`因为它有较大的较小端点。 另一对被迫向右，因为它的右端点大于`999999999`。 由此产生的排列是```
999999999 1000000000 1000000000 1
```它具有所需的峰值并使每个友谊对的两个成员都保持在一起。 

### 三个相互重叠的区间

 对于```
6
1 10
2 9
3 8
```所选峰值是`[1,10]`。 其余两个间隔的右端点均大于峰值的左端点`1`，所以两者都被迫向右。 它们也相互重叠。 该图包含两个顶点之间的边，这两个顶点已经被强制为相同颜色，因此 BFS 发现矛盾并打印`-1`。 

### 最大输入大小

 对于 (n=300000)，有 (150000) 对。 如果这些对是```
0 1
2 3
4 5
...
299998 299999
```所有区间都是不相交的。 重叠图没有边，着色是直接的，主要工作是排序。 该算法保持在 (O(n\log n)) 范围内，这适合给定的限制。
