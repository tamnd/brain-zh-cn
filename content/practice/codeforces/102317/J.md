---
title: "CF 102317J - 涨潮"
description: "我们有一个由网格表示的矩形洞穴。 每个单元格包含零时刻海面上方的天花板高度。 独木舟从西北单元开始，必须到达东南单元，仅在侧面相邻的单元之间移动。"
date: "2026-08-16T19:08:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102317
codeforces_index: "J"
codeforces_contest_name: "UCF Locals 2016"
rating: 0
weight: 102317
solve_time_s: 113
verified: true
draft: false
---

[CF 102317J - 涨潮](https://codeforces.com/problemset/problem/102317/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 53s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个由网格表示的矩形洞穴。 每个单元格包含零时刻海面上方的天花板高度。 独木舟从西北单元开始，必须到达东南单元，仅在侧面相邻的单元之间移动。 

每行驶一秒，海平面就会上升一毫米。 如果独木舟在某个时间进入牢房`t`，其初始天花板高度为`a`，那么剩余的天花板高度是`a - t`。 仅当该值严格为正时，单元格才是合法的。 目标不是尽量减少旅行时间。 相反，在所有可能的路径中，我们希望沿该路径遇到的最小剩余天花板高度的最大可能值。 所需的输出是最大最小高度，或`impossible`如果不存在有效路径。 原始竞赛档案给出`1 <= r,c <= 500`和高度可达`10^9`。 

至多有`500 * 500 = 250000`对于单元格，一种仅检查网格固定次数的算法是理想的。 甚至`O(rc log 10^9)`是合理的，因为对数因子仅为 30 左右。`O((rc)^2)`方法已经需要周围`6.25 * 10^10`对最大的洞穴进行细胞操作，这远远超出了几秒钟的允许范围。 

在一些边缘情况下，看似合理的实现却给出了错误的答案。 首先，起始单元是在时间零进入的，因此单单元洞穴不需要任何移动。 为了```
1
1 1
7
```答案是`7`。 假设至少有一步操作或从零开始答案的实现可能会出错。 

第二个问题是严格的积极条件。 进入单元格时不允许上限正好为零。 为了```
1
1 3
3 1 3
```唯一的路线在第一个时间进入中间的单元格，赋予其剩余高度`1 - 1 = 0`。 正确的输出是`impossible`。 支票使用`>= 0`而不是`> 0`会错误地接受该路径。 

第三个问题是最佳路径不一定是几何最短路线。 考虑```
1
2 3
10 2 10
10 10 10
```直接顶行路线进入高度单元格`2`在时间一并且无效。 有效路线首先向下，然后穿过底行。 其剩余高度为`10, 9, 8, 7`，所以答案是`7`。 仅检查曼哈顿最短路线的方法会错过有效的绕行路线。 

样本本身更微妙地展示了同样的现象。 在第一个洞穴中，在保持最小间隙的情况下到达目的地`3`需要绕过低小区并接受更长的路线。 

## 方法

 最直接的暴力解决方案是枚举从西北角到东南角的所有可能的简单路径。 对于每条路径，我们知道进入每个单元格的确切时间，因此我们可以计算`a[cell] - time`对于每个单元格并保持最小值。 取所有路径中的最大值即可准确给出所需的答案。 

问题在于路径的数量。 在简单的路径搜索期间，在第一次移动之后，每个后续步骤可以有多达三个选择，因为没有必要立即返回到前一个单元格。 和`N = rc`单元格，搜索树可以有以下顺序`3^N`候选人步行。 即使是粗略的上限`3^(N-1)`是一个天文数字`N = 250000`。 蛮力是正确的，因为它考虑了所有可能性，但其指数搜索空间使其无法使用。 

一个更有用的观察是停止尝试优化路径，而是问一个是或否的问题：我们能否实现至少`K`？ 

假设目标最小间隙为`K`。 如果我们在某个时间进入一个单元格`t`，该单元格在以下情况下是可以接受的：`a[cell] - t >= K`。 

对于固定的`K`，这就把问题变成了可达性问题。 我们可以从一开始就运行 BFS。 BFS 尽可能早地到达每个单元格，并且越早到达总是越好，因为海平面较低。 如果某个时间可以到达某个小区`t`，那么稍后到达同一个单元永远不会使其未来的移动变得更容易。 

这给出了一个简单的可行性测试`O(rc)`。 谓词是单调的：如果路径可以保持最小间隙`K`，那么同一条路径当然可以保持任意较小的间隙。 因此，我们可以对最大的可行值进行二分搜索`K`。 

暴力破解之所以有效，是因为它直接评估每条路径，但会失败，因为路径数量呈指数级增长。 固定的最小间隙将问题转化为最早到达可达性的观察结果让我们可以用 BFS 代替路径枚举，并且可行性测试的单调性将优化减少为二分搜索。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数，高达约`O(3^(rc))`候选路径|`O(rc)`对于 DFS 状态 | 太慢了 |
 | 最佳 |`O(rc log 10^9)`|`O(rc)`| 已接受 |

 ## 算法演练

 1. 对待候选答案`K`作为所需的最小剩余天花板高度。 某个时间进入的单元格`t`对于该候选人来说正是可用的`a[cell] - t >= K`。 
2. 从西北单元运行 BFS。 BFS 级别代表经过的时间，因此每个单元都从该级别的队列中删除`t`恰好在之后达到`t`秒。 
3.考虑邻居时的时间`t`，假装我们在某个时间输入它`t + 1`。 我们仅在以下情况下将其排队`a[neighbor] - (t + 1) >= K`。 这同时检查潮汐状况和所需的最小间隙。 
4. 在第一次到达每个单元格时对其进行标记。 BFS 保证这个先到达是最早可能到达的。 稍后到达同一个单元是没有用的，因为每个未来的上限都会在稍后的时间变小。 
5.如果BFS到达东南方小区，则`K`是可行的。 如果BFS耗尽了可达的cell而没有到达，`K`是不可能的。 
6. 由于可行性是单调的，因此采用二分搜索`K`。 开始于`1`，因为有效路径必须具有严格的正间隙，并且使用`min(a[start], a[target])`作为安全上限。 如果`K = 1`不可行，打印`impossible`。 
7. 在二分查找过程中，保留最大的可行值。 当中点可行时，搜索更高的位置。 否则，向下搜索。 

为什么有效：对于固定的`K`，BFS 保持这样一个不变量：每个访问过的单元格从一开始就有一条有效路径，并且每个进入的单元格至少有剩余高度`K`。 由于 BFS 会尽可能早地发现每个单元，因此稍后到达该单元的任何替代路径都无法使情况变得更容易。 因此，当存在满足所需间隙的路径时，BFS 恰好到达目的地。 的可行值`K`形成正整数的前缀，因此二分查找返回最大的可行间隙。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve_case(r, c, grid):
    width = c + 2
    height = r + 2
    total = width * height

    # Pad the grid with zeroes. Since every tested K is at least 1,
    # the padding can never be entered.
    a = [0] * total
    max_height = 0

    for i in range(r):
        base = (i + 1) * width + 1
        row = grid[i]
        for j, x in enumerate(row):
            a[base + j] = x
            if x > max_height:
                max_height = x

    start = width + 1
    target = r * width + c

    def feasible(k):
        if a[start] < k:
            return False

        seen = bytearray(total)
        seen[start] = 1

        q = deque([start])
        time = 0

        while q:
            time += 1
            next_time = time

            for _ in range(len(q)):
                v = q.popleft()

                # Four neighboring cells in the padded grid.
                for nv in (v - 1, v + 1, v - width, v + width):
                    if seen[nv]:
                        continue

                    if a[nv] - next_time < k:
                        continue

                    if nv == target:
                        return True

                    seen[nv] = 1
                    q.append(nv)

        return start == target

    # A valid path must have strictly positive minimum clearance.
    if not feasible(1):
        return "impossible"

    lo = 1
    hi = min(a[start], a[target])
    answer = 1

    while lo <= hi:
        mid = (lo + hi) // 2

        if feasible(mid):
            answer = mid
            lo = mid + 1
        else:
            hi = mid - 1

    return str(answer)

def solve():
    t = int(input())
    out = []

    for _ in range(t):
        r, c = map(int, input().split())
        grid = [list(map(int, input().split())) for _ in range(r)]
        out.append(solve_case(r, c, grid))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```网格用零边框填充。 每个二分搜索阈值至少是`1`，所以那些人造细胞永远无法满足条件。 这避免了 BFS 内部单独的行和列边界检查，并使每次扩展只需添加四个索引。 

BFS 不存储每个单元格的明确距离。 相反，一次处理一级队列会直接给出当前时间。 当队列包含之后到达的单元格时`time - 1`秒后，所有邻居都会被输入`time`秒。 

这`seen`数组是一个`bytearray`，它比 Python 的布尔值或整数列表更节省内存。 每个单元最多插入 BFS 队列一次，以进行特定的可行性检查。 

条件使用`a[nv] - next_time < k`拒绝。 同等地，它接受`a[nv] - next_time >= k`。 由于二分查找开始于`1`，这会自动执行原来严格的正高度要求。 

发现目标后尽早返回可以节省 BFS 的其余部分。 起始单元格是单独处理的，因为它是在时间零而不是时间一输入的。 

不使用浮点运算。 高度可以达到`10^9`，但Python整数具有任意精度，因此不存在溢出问题。 

## 工作示例

 对于样本中的第一个洞穴，最佳最小间隙为`3`。 实现它的一种途径是`(1,1) -> (2,1) -> (3,1) -> (3,2) -> (3,3) -> (2,3) -> (2,4) -> (2,5) -> (3,5) -> (4,5)`。 

以下跟踪使用了这样一个成功的路径，并显示了为什么答案可以是`3`。 

| 步骤| 细胞| 时间 | 初始高度| 剩余高度| 迄今为止的最低值|
 | ---| ---| ---| ---| ---| ---|
 | 0 |`(1,1)`| 0 | 9 | 9 | 9 |
 | 1 |`(2,1)`| 1 | 9 | 8 | 8 |
 | 2 |`(3,1)`| 2 | 9 | 7 | 7 |
 | 3 |`(3,2)`| 3 | 6 | 3 | 3 |
 | 4 |`(3,3)`| 4 | 8 | 4 | 3 |
 | 5 |`(2,3)`| 5 | 8 | 3 | 3 |
 | 6 |`(2,4)`| 6 | 9 | 3 | 3 |
 | 7 |`(2,5)`| 7 | 12 | 12 5 | 3 |
 | 8 |`(3,5)`| 8 | 12 | 12 4 | 3 |
 | 9 |`(4,5)`| 9 | 12 | 12 3 | 3 |

 最小值恰好是`3`，所以上面的任何候选人`3`必须失败，同时`3`成功了。 这是 BFS 可行性测试处理的中心情况：较长的路线很有用，因为它通过一个序列到达后面的高单元格，而不会让间隙低于候选值。 

对于第二个洞穴，网格是单列：```
10
1
10
```唯一可能的路线是笔直向下。 

| 步骤| 细胞| 时间 | 初始高度| 剩余高度| 决定|
 | ---| ---| ---| ---| ---| ---|
 | 0 |`(1,1)`| 0 | 10 | 10 10 | 10 开始|
 | 1 |`(2,1)`| 1 | 1 | 0 | 拒绝 |
 | 2 |`(3,1)`| 2 | 10 | 10 8 | 无法到达 |

 中间的单元格无法进入，因为它的剩余上限为零。 因此，即使是最小的正阈值`K = 1`是不可行的，所以算法打印`impossible`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(rc log 10^9)`| 每个可行性检查最多访问每个单元一次，二分搜索最多执行大约 30 次检查。 |
 | 空间|`O(rc)`| 填充网格、BFS 队列和访问数组的单元数量都是线性的。 |

 为了最大`500 x 500`Cave，最多1个BFS处理`250000`真实的细胞。 因此，大约 30 次二分搜索迭代可提供大约 750 万次单元访问，每次访问的邻居处理量恒定。 这比指数路径枚举更符合问题的预期规模。 竞赛存档为此问题指定了 3 秒的时间限制和 256 MB 的内存限制。 

## 测试用例

 下面的线束使用相同的`solve_case`实施作为提交的解决方案。 最大大小的情况是生成的，而不是写为 250000 个单独的整数。```python
import io
import sys
from collections import deque

def solve_case(r, c, grid):
    width = c + 2
    total = (r + 2) * width

    a = [0] * total
    for i in range(r):
        base = (i + 1) * width + 1
        for j, x in enumerate(grid[i]):
            a[base + j] = x

    start = width + 1
    target = r * width + c

    def feasible(k):
        if a[start] < k:
            return False

        seen = bytearray(total)
        seen[start] = 1
        q = deque([start])
        time = 0

        while q:
            time += 1

            for _ in range(len(q)):
                v = q.popleft()

                for nv in (v - 1, v + 1, v - width, v + width):
                    if seen[nv]:
                        continue
                    if a[nv] - time < k:
                        continue
                    if nv == target:
                        return True

                    seen[nv] = 1
                    q.append(nv)

        return start == target

    if not feasible(1):
        return "impossible"

    lo, hi = 1, min(a[start], a[target])
    ans = 1

    while lo <= hi:
        mid = (lo + hi) // 2
        if feasible(mid):
            ans = mid
            lo = mid + 1
        else:
            hi = mid - 1

    return str(ans)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        t = int(sys.stdin.readline())
        out = []

        for _ in range(t):
            r, c = map(int, sys.stdin.readline().split())
            grid = [
                list(map(int, sys.stdin.readline().split()))
                for _ in range(r)
            ]
            out.append(solve_case(r, c, grid))

        return "\n".join(out)
    finally:
        sys.stdin = old_stdin

# Provided sample.
sample = """\
2
4 5
9 5 4 0 0
9 4 8 9 12
9 6 8 7 12
0 0 9 8 12
3 1
10
1
10
"""
assert run(sample) == "3\nimpossible", "provided sample"

# Minimum-size cave.
assert run("""\
1
1 1
7
""") == "7", "single cell"

# All cells equal. A shortest path from (1,1) to (2,2)
# takes two moves, so the minimum remaining height is 5 - 2 = 3.
assert run("""\
1
2 2
5 5
5 5
""") == "3", "all equal values"

# Zero remaining height is not allowed.
assert run("""\
1
1 3
3 1 3
""") == "impossible", "strictly positive entry condition"

# The direct route is blocked, but a detour succeeds.
assert run("""\
1
2 3
10 2 10
10 10 10
""") == "7", "detour around a low cell"

# Maximum-size grid, all values equal.
# The shortest path needs 998 moves in a 500 x 500 grid.
# The last cell therefore has clearance 1_000_000_000 - 998.
r = c = 500
rows = "\n".join([" ".join(["1000000000"] * c) for _ in range(r)])
maximum_case = f"1\n{r} {c}\n{rows}\n"
assert run(maximum_case) == str(1_000_000_000 - 998), "maximum-size grid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 1 / 7`|`7`| 最小尺寸输入和开始时间为零 |
 |`2 x 2`， 全部`5`|`3`| 全部相等的值和经过时间的影响 |
 |`1 x 3 / 3 1 3`|`impossible`| 零间隙和正间隙之间的边界 |
 |`2 x 3 / 10 2 10 / 10 10 10`|`7`| 更长的绕路可以打败直达路线|
 |`500 x 500`， 全部`10^9`|`999999002`| 最大尺寸和大高度 |

 ## 边缘情况

 对于单细胞洞穴```
1
1 1
7
```起点和目的地是同一个单元格。 独木舟在零时间进入它，所以它的间隙是`7`。 每个项目的可行性测试都会立即成功`K <= 7`，二分查找返回`7`。 无需发明一种运动或减少一秒。 

对于零间隙情况```
1
1 3
3 1 3
```BFS 从零时刻的第一个单元开始。 在第一个 BFS 级别，它在第一时间尝试中间单元并进行评估`1 - 1 = 0`。 由于候选最小值至少为`1`，细胞被拒绝。 没有其他路线，所以`K = 1`失败，答案是`impossible`。 代码中的严格比较阻止了零高度条目被接受。 

为了绕道而行，请考虑```
1
2 3
10 2 10
10 10 10
```顶部邻居有高度`2`并将在时间一进入，只留下`1`毫米。 BFS 可以在时间一进入高度较低的邻居`10`，然后向右移动两次和三次。 间隙是`10, 9, 8, 7`，给出答案`7`。 基于队列的最早到达搜索自然会找到这条路线，而无需枚举路径。 

对于最大尺寸全相等的情况，每个单元都有高度`10^9`。 由于没有障碍，最好的策略就是尽快到达目的地。 一个`500 x 500`网格需要`499 + 499 = 998`移动，因此输入目的地时已获得许可`10^9 - 998 = 999999002`。 该算法的 BFS 认识到，当每个单元具有相同高度时，最短到达时间是最佳的，而二分搜索则准确地找到剩余间隙。
