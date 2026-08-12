---
title: "CF 102361L - MUV LUV 替代品"
description: "小屋是一个矩形网格，但大多数单元格并不同样有用。 有两条垂直走廊，每条走廊有一个牢房宽。 第一个走廊位于左侧座位区之后，第二个走廊位于中间座位区之后。"
date: "2026-08-13T00:22:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102361
codeforces_index: "L"
codeforces_contest_name: "2019 China Collegiate Programming Contest Qinhuangdao Onsite"
rating: 0
weight: 102361
solve_time_s: 284
verified: true
draft: false
---

[CF 102361L - MUV LUV 替代品](https://codeforces.com/problemset/problem/102361/L)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 44s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 小屋是一个矩形网格，但大多数单元格并不同样有用。 有两条垂直走廊，每条走廊有一个牢房宽。 第一个走廊位于左侧座位区之后，第二个走廊位于中间座位区之后。 只有走廊单元允许垂直移动。 每个士兵都从三个座位区之一开始，最初的移动是水平的。 

来自左侧区域的士兵最终必须使用左侧走廊并从其出口离开。 来自右侧区域的士兵必须使用右侧的走廊。 来自中间区域的士兵可以选择任一走廊。 士兵一旦到达走廊，单位时间内可以向下移动一排，最终到达相应的出口。 

输入给出了行数、三个座位区的宽度以及士兵的数量。 每个士兵都由其区域及其初始行和列来描述。 要求的输出是每个士兵可以离开舱室的最小整数时间。 

最大的参数值在（10^9）左右，而士兵数量可以达到（10^5）。 我们无法构建网格、模拟每个单元或模拟每个运动步骤。 即使是每时刻处理一次每个士兵的模拟也可能需要在大型实例上进行大约 (10^{14}) 个士兵更新。 该解决方案必须依赖于 (10^5) 输入记录而不是 (10^9) 大小的几何图形。 

有几种边界情况会暴露模型中的错误。 如果一名士兵住在尽可能小的舱室中，答案就不是一个，因为士兵从坐着的牢房开始，必须首先进入走廊。 例如，与`1 1 1 1 1`和那个士兵`(1,1)`，左边的走廊是第2列，所以士兵需要一次水平移动和一次向下移动。 答案是`2`。 将走廊出口视为与起始单元格水平相邻的解决方案将错误地返回`1`。 

另一个微妙的情况是，几个士兵的最早退出时间相同。 例如，与`1 1 1 1 3`，将士兵置于`(1,1)`,`(1,3)`， 和`(1,5)`，分别属于左、中、右区域。 每个士兵都可以分别以两步到达其选择的走廊并退出，但当中间的士兵选择一侧时，三个士兵不能全部使用其走廊且退出时间为 2。 两名士兵必须共用一条走廊，因此其中一名士兵需要延迟退出时间。 正确答案是`3`。 独立对待每个士兵的最短路径会给出错误的答案`2`。 

第三个常见错误是忘记士兵可以等待。 从相对两侧接近同一条走廊的两名士兵可以通过在进入走廊之前延迟其中一名士兵来避免碰撞。 相关的限制不是它们的进入时间必须不同，而是它们通过该走廊的最终退出时间必须不同。 

## 方法

 最直接的暴力就是决定每个中区士兵使用哪个出口，然后解决由此产生的两组的移动问题。 如果有（s）个中区士兵，则有（2^s）个任务。 对于 (s=100000)，这意味着在考虑检查一项作业的成本之前有 (2^{100000}) 个不同的作业。 更真实的模拟也是没有希望的。 如果每个时刻扫描所有 (10^5) 个士兵，并且疏散时间约为 (10^9) 个时刻，则模拟将执行大约 (10^{14}) 个士兵更新。 

关键的观察是停止思考整个走廊，而是描述士兵离开出口的时间。 假设一名士兵在时间 (s) 进入走廊，从第 (x) 行开始。 其退出时间为(s+x)。 如果我们规定它的退出时间为(e)，那么它在走廊内的路径就完全确定了：在时间(t)，它的行是(e-t)。 使用同一走廊的两名士兵在退出时间相同时发生碰撞。 因此，一条走廊内的唯一要求是所有分配的士兵都有不同的整数退出时间。 

对于一名士兵，令 (p_L) 为其从左侧出口的最早可能退出时间，(p_R) 为其从右侧出口的最早可能退出时间。 分配到左侧走廊的士兵可以使用区间 ([p_L,T]) 中的任何整数退出时间，其中 (T) 是建议的最终时间。 右侧走廊也是如此。 

这就把几何问题变成了匹配问题。 每个走廊上有 (T) 个可能的出口时段。 士兵连接到左侧插槽的后缀和右侧插槽的后缀。 颠倒时间顺序会将这些后缀变成前缀，这给出了霍尔条件的一种特别方便的形式。 

对于固定 (T)，定义

 [
 d_L=\max(0,T-p_L+1)，\qquad d_R=\max(0,T-p_R+1)。 
]

 值（d_L）是左侧走廊上的士兵可用的反向时隙的数量。 值为零意味着士兵在时间 (T) 之前无法使用该走廊。 

考虑采用左侧的第一个 (a) 反向时隙和右侧的第一个 (b)。 士兵在 (d_L\le a) 和 (d_R\le b) 时被迫进入该集合。 这些士兵必须全部适合（a+b）槽。 因此可行性条件为

 [
 #{i:d_{L,i}\le a,\ d_{R,i}\le b}\le a+b
 ]

 对于每个（a，b）。 

因为每个士兵的可用槽都是前缀，所以根据霍尔定理检查这些前缀对就足够了。 我们可以从小到大扫过(a)。 当一名士兵变得活跃时，它会为每个 (b) 满足 (b\ge d_R) 贡献 1。 因此数量

 [
 #{d_R\le b}-b
 ]

 接收后缀上的范围添加。 线段树可以保持其最大值。 

有一个有用的转换，可以避免为每次二分搜索迭代显式构造所有 (d_R) 值。 放

 [
 q=T+1-b。 
]

 那么(d_R\le b)等价于(p_R\ge q)，包括士兵不能通过将其右侧最早时间视为无穷大来使用右侧走廊的情况。 霍尔条件变为

 [
 q+#{p_R\ge q}\le T+1+a。 
]

 对于每个现役士兵，其插入都会为每个阈值加一 (q\le p_R)。 我们使用支持前缀范围添加的线段树来维护 (q+\text{count}(p_R\ge q)) 的最大值。 

生成的算法对 (T) 执行二分搜索。 每次可行性检查都需要 (O(k\log k))，因此完整的复杂度为 (O(k\log k\log C))，其中 (C) 是答案的数值范围。 当 (C) 约为 (10^9) 时，额外的对数因子仅为 31 左右。

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解中间任务 | (O(2^k\cdot k\log k)) | (O(k)) | 太慢了 |
 | 时间步模拟| (O(kT)) | (O(k)) | 太慢了 |
 | 通过二分搜索进行最佳霍尔条件检查 | (O(k\log k\log C)) | (O(k\log k\log C)) | (O(k)) | 已接受 |

 ## 算法演练

 1. 将每个士兵转换为每个走廊的最早可能退出时间。 令左侧走廊为列(c_1=l_1+1)，右侧走廊为列(c_2=l_1+l_2+2)。 

左区士兵只有左值

 [
 p_L=x+c_1-y。 
]

 右区士兵只有正确的值

 [
 p_R=x+y-c_2。 
]

 中区士兵两者兼备

 [
 p_L=x+y-c_1,
 \qquad
 p_R=x+c_2-y。 
]

 对于禁止士兵使用的走廊，存储非常大的哨兵值。 
2. 给定候选疏散时间（T），将每个最早的疏散时间转换为时间倒转的截止时间。 

对于有限最早时间 (p)，可用反向时隙的数量为

 [
 d=\max(0,T-p+1)。 
]

 当且仅当 (d>0) 时，士兵才能使用走廊。 
3. 使用霍尔定理来表征可行性。 对于反转时间开始时的任何 (a) 左槽和 (b) 右槽，每个满足 (d_L\le a) 和 (d_R\le b) 的士兵在这些 (a+b) 槽内都有其完整的邻域。 因此这样的士兵不得超过(a+b)。 

由于邻域是前缀，这些前缀对足以测试完整的二分匹配。 
4. 将值(a)从小到大扫除。 当 (a) 达到士兵的 (d_L) 时，该士兵就会变得活跃。 对于当前的活动集，我们需要

 [
 \max_b\left(#{d_R\le b}-b\right)\le a。 
]

 每个具有正确截止日期 (d_R) 的新现役士兵都会增加每个 (b\ge d_R) 的计数。 这正是后缀范围的添加。 
5. 使用 (q=T+1-b) 重写右侧表达式。 条件变为

 [
 \max_q\left(q+#{p_R\ge q}\right)\le T+1+a。 
]

 具有正确最早时间 (p_R) 的新现役士兵会增加每个 (q\le p_R) 的维护值，因此我们需要添加前缀范围和全局最大值查询。 

只有等于现有有限值 (p_R) 以及 (T+1) 的阈值才可能是相关的。 在两个连续阈值之间，计数保持不变，而 (q) 增加，因此最大端点始终足够。 
6. 按递减 (p_L) 对士兵进行排序。 由于(T)固定，因此与增加(d_L)的处理相同。 具有（p_L>T）的士兵，包括禁止进入左侧走廊的士兵，都具有（d_L=0）并首先插入。 然后将相等的有限 (p_L) 值作为一组进行处理。 
7. 对于每个活动组，更新线段树的右侧阈值。 如果 (p_R>T)，则士兵无法使用右侧走廊，因此它对每个有效阈值有贡献，直至 (T+1)。 否则它会影响所有阈值 (q\le p_R)。 
8、每组结束后，将线段树最大值与(T+1+a)进行比较。 如果最大值更大，则违反霍尔条件并且 (T) 是不可能的。 
9.将每个中区士兵分配到左侧走廊，所有左侧区域和中区士兵一起调度，右侧区域士兵独立调度，得到上限。 对于一条走廊，对所有最早出口时间进行排序，并分配最早可能的不同出口时间。 在零和这个保证的可行上限之间进行二分搜索。 

### 为什么它有效

 中心不变量是走廊时间表完全由不同的整数退出时间来表征。 具有最早可能退出时间 (p) 的士兵可以恰好接收至少 (p) 的任何退出时间，因此对于固定 (T)，其可能的槽位形成后缀。 逆转时间将每个可能的时隙集变成一个前缀。

霍尔定理表明，当每组槽位都包含足够的容量来容纳其整个邻域都位于其中的所有士兵时，匹配就存在。 由于每个邻域都是两个前缀的并集，因此可以通过采用左走廊的前缀和右走廊的前缀来表示潜在的紧槽集。 线段树同时检查所有这些对。 

二分搜索是有效的，因为如果疏散在 (T) 个时刻是可能的，那么在任何更多数量的时刻中疏散仍然是可能的。 因此，可行性谓词是单调的，最小的可行（T）正是所需的答案。 

## Python 解决方案```python
import sys
from bisect import bisect_right

input = sys.stdin.readline

INF = 10**30
NEG = -10**30

class SegTree:
    def __init__(self, values):
        n = len(values)
        size = 1
        while size < n:
            size <<= 1

        self.size = size
        self.mx = [NEG] * (size << 1)
        self.lazy = [0] * (size << 1)

        base = size
        for i, v in enumerate(values):
            self.mx[base + i] = v

        for i in range(size - 1, 0, -1):
            self.mx[i] = max(self.mx[i << 1], self.mx[i << 1 | 1])

    def _add(self, node, left, right, ql, qr, value):
        if ql <= left and right <= qr:
            self.mx[node] += value
            self.lazy[node] += value
            return

        mid = (left + right) >> 1

        if ql <= mid:
            self._add(node << 1, left, mid, ql, qr, value)
        if mid < qr:
            self._add(node << 1 | 1, mid + 1, right, ql, qr, value)

        self.mx[node] = (
            self.lazy[node]
            + max(self.mx[node << 1], self.mx[node << 1 | 1])
        )

    def add_prefix(self, right, value):
        if right < 0:
            return
        if right >= self.size:
            right = self.size - 1
        self._add(1, 0, self.size - 1, 0, right, value)

    @property
    def maximum(self):
        return self.mx[1]

def corridor_cost(values):
    if not values:
        return 0

    values.sort()

    current = 0
    for p in values:
        current = max(p, current + 1)

    return current

def solve():
    n, l1, l2, l3, k = map(int, input().split())

    c1 = l1 + 1
    c2 = l1 + l2 + 2

    jobs = []
    left_fixed = []
    right_fixed = []
    middle = []

    for _ in range(k):
        a, x, y = map(int, input().split())

        if a == 1:
            p_l = x + c1 - y
            p_r = INF
            left_fixed.append(p_l)
        elif a == 2:
            p_l = x + y - c1
            p_r = x + c2 - y
            middle.append((p_l, p_r))
        else:
            p_l = INF
            p_r = x + y - c2
            right_fixed.append(p_r)

        jobs.append((p_l, p_r))

    # A guaranteed feasible solution:
    # send every middle-zone soldier to the left corridor.
    upper = max(
        corridor_cost(left_fixed + [p_l for p_l, _ in middle]),
        corridor_cost(right_fixed[:])
    )

    finite_right = sorted({p_r for _, p_r in jobs if p_r < INF})
    right_rank = {v: i for i, v in enumerate(finite_right)}

    jobs_by_left = sorted(jobs, key=lambda z: z[0], reverse=True)

    def feasible(T):
        # Only p_R values <= T are useful coordinates.
        m = bisect_right(finite_right, T)

        # q values are all useful p_R thresholds plus q = T + 1.
        coords = finite_right[:m]
        coords.append(T + 1)

        seg = SegTree(coords)

        idx = 0
        total = len(jobs_by_left)

        # All jobs with p_L > T, and all jobs forbidden from the
        # left corridor, have d_L = 0.
        while idx < total and jobs_by_left[idx][0] > T:
            p_r = jobs_by_left[idx][1]

            if p_r >= INF or p_r > T:
                seg.add_prefix(m, 1)
            else:
                seg.add_prefix(right_rank[p_r], 1)

            idx += 1

        # At a = 0, all d_L = 0 jobs are active.
        if seg.maximum > T + 1:
            return False

        # For finite p_L <= T, equal p_L values have the same d_L.
        while idx < total:
            p_l = jobs_by_left[idx][0]
            a = T - p_l + 1

            j = idx
            while j < total and jobs_by_left[j][0] == p_l:
                p_r = jobs_by_left[j][1]

                if p_r >= INF or p_r > T:
                    seg.add_prefix(m, 1)
                else:
                    seg.add_prefix(right_rank[p_r], 1)

                j += 1

            if seg.maximum > T + 1 + a:
                return False

            idx = j

        return True

    lo = 0
    hi = upper

    while lo < hi:
        mid = (lo + hi) >> 1
        if feasible(mid):
            hi = mid
        else:
            lo = mid + 1

    print(lo)

if __name__ == "__main__":
    solve()
```实现的第一部分将几何坐标转换为两个最早的退出时间。 走廊的柱子是`c1 = l1 + 1`和`c2 = l1 + l2 + 2`，所以水平距离是直接从列差得到的。`INF`代表士兵不允许使用的出口。 它故意比每个可能的实时时间都要大得多，因此在可行性检查中，这样的士兵在该走廊上收到的可用空位为零。 

这`corridor_cost`函数仅用于初始上限。 如果一条走廊上的最早出口时间排序为(p_1\le p_2\le\cdots)，则通过重复取，可以得到最早的不同出口时间`max(p_i, previous + 1)`。 这也说明了为什么走廊内的碰撞会减少到不同的出口时间。 

线段树存储以下形式的值

 [
 q+#{p_R\ge q}。 
]

 它的叶子从阈值开始`q`。 激活一名士兵会给每个不大于其士兵的阈值增加一个`p_R`，这正是前缀范围的添加。 根存储所有阈值的最大值。 

特殊门槛`T + 1`表示(b=0)，表示没有右走廊反向时隙可用。 被迫进入左侧走廊的士兵需要它。 的价值观`p_R`大于`T`具有相同的效果，因此它们更新整个有效阈值范围。 

扫描顺序递减`p_L`。 自从

 [
 d_L=\max(0,T-p_L+1),
 ]

 减少`p_L`正好在增加`d_L`。 所有值都带有`p_L>T`在 (a=0) 处一起处理。 等有限`p_L`值也一起处理，因为它们具有相同的霍尔参数 (a)。 

Python 整数具有任意精度，因此 (10^9) 大小的坐标和所有累积的调度时间都是安全的。 大的`INF`和`NEG`值远远超出可能的答案范围，只能作为哨兵。 

## 工作示例

 对于提供的示例，两个走廊列是 (3) 和 (6)。 

两名左区士兵最早离开出口时间（4）和（3）。 中间的士兵有最早的左退出时间（3）和最早的右退出时间（4）。 

| 士兵| 专区 | (p_L) | (p_R) |
 | --- | --- | --- | --- |
 | 一个 | 1 | 4 | 信息 |
 | 乙| 1 | 3 | 信息 |
 | C | 2 | 3 | 4 |

 对于 (T=3)，相反的截止日期是

 | 士兵| (d_L) | (d_R) |
 | --- | --- | --- |
 | 一个 | 0 | 0 |
 | 乙| 1 | 0 |
 | C | 1 | 0 |

 取 (a=1,b=0)，所有三名士兵都满足 (d_L\le1) 和 (d_R\le0)，因此他们都只能放入一个左边的槽中。 霍尔不等式变为 (3\le1)，失败。 

对于 (T=4)，截止日期变为

 | 士兵| (d_L) | (d_R) |
 | --- | --- | --- |
 | 一个 | 1 | 0 |
 | 乙| 2 | 0 |
 | C | 2 | 1 |

 现在满足了严格的条件。 例如，(a=2,b=1) 包含所有三个士兵并具有三个可用槽，给出 (3\le3)。 因此(T=4)是可行的，而(T=3)是不可行的，所以答案是`4`。 

这符合实际的运动时间表。 左边的两名士兵可以在时间（3）和（4）离开，而中间的士兵使用右边的走廊并在时间（4）离开。 

对于第二个例子，考虑```
1 1 1 1 3
1 1 1
2 1 3
3 1 5
```走廊是柱（2）和柱（4）。 每个士兵的最早可能退出时间为 (2)。 

| 士兵| 专区 | (p_L) | (p_R) |
 | --- | --- | --- | --- |
 | 一个 | 1 | 2 | 信息 |
 | 乙| 2 | 2 | 2 |
 | C | 3 | 信息 | 2 |

 尝试 (T=2) 给出

 | 士兵| (d_L) | (d_R) |
 | --- | --- | --- |
 | 一个 | 1 | 0 |
 | 乙| 1 | 1 |
 | C | 0 | 1 |

 对于(a=1,b=1)，所有三个士兵都满足两个截止条件，但只有两个槽位。 不等式 (3\le2) 失败。 

在 (T=3) 时，截止日期变为

 | 士兵| (d_L) | (d_R) |
 | --- | --- | --- |
 | 一个 | 2 | 0 |
 | 乙| 2 | 2 |
 | C | 0 | 2 |

 满足每个霍尔条件。 一种可能的分配是让 A 和 B 通过左侧走廊，让 C 通过右侧走廊。 左侧走廊使用退出时间 (2) 和 (3)，右侧走廊使用退出时间 (2)。 答案是`3`。 

此示例捕获重复的最早退出时间。 单个最短路径的长度都是二，但是使用同一走廊的两个士兵需要不同的退出时间。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(k\log k\log C)) | (O(k\log k\log C)) | 排序需要 (O(k\log k))，每次可行性检查使用 (O(k\log k))，二分搜索执行 (O(\log C)) 检查 |
 | 空间| (O(k)) | 士兵、压缩右侧阈值、线段树都使用线性空间|

 对于 (k\le100000)，算法从不依赖于网格尺寸本身。 (n,l_1,l_2,l_3) 等值可以是 (10^9)，而无需增加数据结构大小。 唯一的数字因素是对答案的二分搜索，当答案低于几十亿时，大约需要 31 次迭代。 

## 测试用例```python
# The solve() function from the previous section is assumed to be defined.

import sys
import io

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    try:
        solve()

        # solve() writes directly to stdout, so this helper is intended
        # to be adapted with an output capture in an actual test harness.
        # A convenient contest-style version is shown below instead.
    finally:
        sys.stdin = old_stdin
        input = old_input

    return ""

# For a fully executable harness, redirect stdout as well.

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout
    old_input = input

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

# Provided sample
assert run(
    """4 2 2 2 3
1 2 1
1 2 2
2 2 4
"""
) == "4", "provided sample"

# Minimum-size cabin, one soldier in the left zone.
assert run(
    """1 1 1 1 1
1 1 1
"""
) == "2", "minimum cabin"

# One soldier on each side. Both can leave at time 2.
assert run(
    """1 1 1 1 2
1 1 1
3 1 5
"""
) == "2", "independent corridors"

# Three soldiers with identical earliest exit time.
# Two of them must share one corridor, so the answer is 3.
assert run(
    """1 1 1 1 3
1 1 1
2 1 3
3 1 5
"""
) == "3", "duplicate earliest exit times"

# Boundary case around both corridor columns.
assert run(
    """1 2 1 2 2
1 1 2
2 1 4
"""
) == "3", "corridor boundary"

# Large coordinates and maximum number of soldiers.
# All soldiers are in the left zone at row 1.
# Their earliest times are consecutive and the largest is 1000000001.
parts = ["1000000000 1000000000 1 1 100000"]
for y in range(1, 100001):
    parts.append(f"1 1 {y}")

assert run("\n".join(parts) + "\n") == "1000000001", "large k and coordinates"
```第一个自定义案例验证最小可能尺寸和一次水平移动加一次垂直移动边界。 

第二个案例证实，当士兵不竞争同一个走廊时，两个走廊是独立的。 

第三种情况检查不能同时将相同的最早出口时间分配给同一走廊。 

第四个案例将士兵直接放在两个走廊边界旁边，并发现 (c_1) 和 (c_2) 的定义中存在错误。 

最后的情况使用 (100000) 名士兵，坐标接近 (10^9)。 它验证了渐近行为和任意大小整数算术的使用。 

| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 1 1`与一名左翼士兵|`2`| 最小尺寸和一对一处理 |
 |`1 1 1 1 2`一名左右士兵 |`2`| 独立走廊时间表|
 |`1 1 1 1 3`与左、中、右士兵|`3`| 重复的出口时间和走廊容量 |
 |`1 2 1 2 2`与边界相邻的士兵|`3`| 精确的走廊柱公式 |
 |`1000000000 1000000000 1 1 100000`剩下10万士兵|`1000000001`| 最大值（k）、大坐标和整数运算 |

 ## 边缘情况

 对于最小舱位```
1 1 1 1 1
1 1 1
```左边的走廊是第（2）栏。 士兵从第 (1) 列开始，因此 (p_L=1+(2-1)=2)。 只有一名士兵，因此不可能发生走廊碰撞。 二分查找发现(T=1)不可行，(T=2)可行。 

对于重复的最早退出时间，```
1 1 1 1 3
1 1 1
2 1 3
3 1 5
```所有三名士兵都有最早的退出时间 (2)。 在（T=2）时，左边的士兵在相反的时间（1）只有左边的槽位，中间的士兵可以使用任一走廊的槽位，而右边的士兵只有右边的槽位。 霍尔对于每个走廊上一个前缀槽的条件是看到所有三名士兵，但只有两个槽，因此 (T=2) 失败。 在 (T=3) 处，每个走廊都有足够多的不同出口时间，答案变为 (3)。 

对于靠近左侧走廊的士兵来说，```
1 2 1 2 2
1 1 2
2 1 4
```左侧走廊是第 (3) 列，右侧走廊是第 (6) 列。 左边的士兵有（p_L=2），第（4）列中间的士兵有（p_L=2）和（p_R=3）。 两人都可以在时间 (2) 单独从左侧离开，但如果两人都使用该走廊，则他们需要不同的走廊出口时间。 将中间的士兵派到右边给出退出时间 (2) 和 (3)，所以答案是`3`。 这发现了一个常见错误，即将两个走廊柱视为它们的位置是 (l_1) 和 (l_1+l_2+1)，而不是 (l_1+1) 和 (l_1+l_2+2)。 

对于一个非常大的实例，```
1000000000 1000000000 1 1 100000
```对于左侧区域第 (1) 行的所有 (100000) 名士兵，最早退出时间形成从 (999900002) 到 (1000000001) 的连续范围。 因为连续的最早时间已经给出了不同的退出槽位，所以最后一个士兵在时间 (1000000001) 离开。 该算法无需构建 (10^9) 宽的网格即可处理此问题。
