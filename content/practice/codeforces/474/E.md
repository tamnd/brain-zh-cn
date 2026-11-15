---
title: "CF 474E - 支柱"
description: "我们有一系列从左到右排列的柱子。 支柱 i 的高度为 h[i]。 一次有效的跳跃只能向前，从较小的索引到较大的索引，并且两个柱子之间的高度差必须至少为d。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dp", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 474
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 271 (Div. 2)"
rating: 2000
weight: 474
solve_time_s: 121
verified: true
draft: false
---

[CF 474E - 支柱](https://codeforces.com/problemset/problem/474/E)

 **评级：** 2000
 **标签：** 二分查找、数据结构、dp、排序、树
 **求解时间：** 2m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列从左到右排列的柱子。 支柱`i`有高度`h[i]`。 一次有效的跳跃只能向前，从较小的索引到较大的索引，并且两个柱子之间的高度差必须至少为`d`。 

任务是选择一系列支柱索引`i1 < i2 < ... < ik`这样每个连续的对都形成有效的跳跃。 在所有这些序列中，我们需要一个具有最大可能长度的序列，并且必须打印实际索引。 

该结构立即暗示了最长路径类型的动态规划问题。 如果我们定义`dp[i]`作为以支柱结束的最长有效序列`i`， 然后`dp[i] = 1 + max(dp[j])`全面的`j < i`满意的`|h[i] - h[j]| ≥ d`。 

挑战在于找到最有效的方法。 

正是这些限制使问题变得有趣。 最多可以有`100000`柱子，高度可以大到`10^15`。 二次算法将粗略地检查`10^10`最坏情况下成对运行，远远超出一秒的运行速度。 我们周围需要一些东西`O(n log n)`。 

一些边缘情况值得关注。 

什么时候`d = 0`，每次向前跳跃都是允许的。 例如：```
3 0
5 5 5
```答案是所有三个支柱。 任何意外排除等高的解决方案`d = 0`将失去有效的转换。 

当许多柱子高度相同且`d > 0`，禁止在它们之间跳跃。```
4 1
7 7 7 7
```不可能跳跃，因为每个高度差都为零。 正确答案有长度`1`。 

当较小和较大的高度都是有效的前身时，会发生另一种微妙的情况。```
4 3
10 1 20 8
```支柱用`8`, 两者的高度`1`和身高`20`满足约束，因为条件使用绝对差。 仅搜索高度范围一侧的解决方案会错过有效的转换。 

巨大的高度限制也意味着我们无法直接根据高度值构建线段树。 首先必须将高度压缩为等级。 

## 方法

 最直接的解决方案是对所有支柱对进行动态规划。 

让`dp[i]`是在柱子处结束的最大序列长度`i`。 对于每一个支柱`i`，我们检查每个早期的支柱`j`。 如果`|h[i] - h[j]| ≥ d`，那么我们可以扩展结束于的序列`j`。```
dp[i] = max(dp[i], dp[j] + 1)
```这种递归是正确的，因为每个有效序列都以`i`必须来自某个更早的有效前身。 不幸的是，有`O(n²)`对。 和`n = 100000`，这意味着大约一百亿次比较。 

瓶颈正在寻找```
max(dp[j])
```在高度属于两个区域之一的早期支柱中：```
h[j] ≤ h[i] - d
```或者```
h[j] ≥ h[i] + d
```关键的观察结果是，一旦我们已经从左到右处理了柱子，该条件仅取决于高度，而不取决于位置。 

假设我们按索引顺序处理支柱。 当我们到达柱子时`i`，所有有效的前驱都已被处理。 在这些加工过的柱子中，我们需要两个高度区间内的最大DP值。 

这变成了关于高度的范围最大查询问题。 

高度可以被压缩为排序的唯一坐标。 然后我们维护一个按压缩高度索引的线段树。 每个树位置存储最好的`(dp value, pillar index)`到目前为止所见的高度。 

支柱用`i`，我们执行两个线段树查询：

 第一个间隔：```
(-∞, h[i] - d]
```第二个间隔：```
[h[i] + d, +∞)
```这两个答案中较好的一个给出了前一个产生最长序列的结果`i`。 

计算后`dp[i]`，我们在压缩位置更新线段树`h[i]`。 

这将每个支柱的工作减少到一些二分搜索和线段树操作，从而产生`O(n log n)`时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 太慢了 |
 | 最佳| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取所有支柱高度。 
2. 通过对不同值进行排序并在排序列表中为每个高度分配一个位置来对高度进行坐标压缩。 
3. 创建线段树，每个节点存储一对`(best_dp, pillar_index)`代表该高度范围内加工过的柱子中最强的序列。 
4. 从左到右处理支柱。 
5. 对于当前高度`h[i]`，找到最后一个压缩坐标，其值最多为`h[i] - d`。 
6. 查询该前缀范围上的线段树。 这会找到高度足够小的最佳前驱。 
7. 找到第一个值至少为的压缩坐标`h[i] + d`。 
8. 查询该后缀范围上的线段树。 这会找到高度足够大的最佳前驱。 
9. 取两次查询中较好的结果。 如果两个范围都不包含已处理的支柱，则开始一个新的长度序列`1`。 
10. 设置```
dp[i] = predecessor_dp + 1
```并存储前驱索引以供重建。 

1.更新压缩位置的线段树`h[i]`与这对`(dp[i], i)`如果它提高了存储价值。 
2.所有柱子处理完后，找到最大的柱子`dp`。 
3. 向后跟踪前驱指针以重建最优序列。 
4. 反转重建的列表并打印它。 

### 为什么它有效

 加工支柱时`i`，线段树仅包含有关具有较小索引的支柱的信息，即合法前身的集合。 每个有效前任的高度必须最多`h[i] - d`或者至少`h[i] + d`。 两个范围查询精确检查这些高度并返回其中的最大 DP 值。 

递归与二次动态规划相同，但线段树可以有效地计算所需的最大值。 由于每个 DP 状态都是根据所有有效的前驱状态计算的，并且不考虑无效的前驱状态，因此结果`dp[i]`是最优的。 通过存储的前驱索引重建产生实际的最大长度序列。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

n, d = map(int, input().split())
h = list(map(int, input().split()))

vals = sorted(set(h))
m = len(vals)

NEG = (0, -1)

class SegmentTree:
    def __init__(self, n):
        self.n = 1
        while self.n < n:
            self.n <<= 1
        self.seg = [NEG] * (2 * self.n)

    def _better(self, a, b):
        if a[0] >= b[0]:
            return a
        return b

    def update(self, pos, value):
        p = pos + self.n
        if value[0] > self.seg[p][0]:
            self.seg[p] = value
        else:
            return

        p >>= 1
        while p:
            self.seg[p] = self._better(self.seg[p * 2],
                                       self.seg[p * 2 + 1])
            p >>= 1

    def query(self, l, r):
        if l > r:
            return NEG

        l += self.n
        r += self.n

        left_res = NEG
        right_res = NEG

        while l <= r:
            if l & 1:
                left_res = self._better(left_res, self.seg[l])
                l += 1

            if not (r & 1):
                right_res = self._better(self.seg[r], right_res)
                r -= 1

            l >>= 1
            r >>= 1

        return self._better(left_res, right_res)

st = SegmentTree(m)

dp = [0] * n
parent = [-1] * n

for i in range(n):
    best = NEG

    right_small = bisect_right(vals, h[i] - d) - 1
    if right_small >= 0:
        best = st.query(0, right_small)

    left_large = bisect_left(vals, h[i] + d)
    if left_large < m:
        cand = st.query(left_large, m - 1)
        if cand[0] > best[0]:
            best = cand

    dp[i] = best[0] + 1
    parent[i] = best[1]

    pos = bisect_left(vals, h[i])
    st.update(pos, (dp[i], i))

end = max(range(n), key=lambda x: dp[x])

answer = []
cur = end

while cur != -1:
    answer.append(cur + 1)
    cur = parent[cur]

answer.reverse()

print(len(answer))
print(*answer)
```坐标压缩步骤将高度转换为`10^15`之间的索引`0`和`m - 1`，使线段树存储变得可行。 

线段树存储线对`(dp value, index)`而不仅仅是 DP 值。 优化时需要DP值，后期重建时需要索引。 

两个二分搜索识别两个有效的高度区域。`bisect_right(vals, h[i] - d) - 1`给出仍然属于较低区间的最大压缩坐标.`bisect_left(vals, h[i] + d)`给出属于上区间的第一个坐标.

 一个常见的错误是在查询线段树之前更新它。 这样做可以让支柱将自己用作前身。 严格按照从左到右的顺序进行处理并在更新之前进行查询可以防止出现该问题。 

另一个微妙的点是处理空范围。 当查询区间没有高度属于时，则跳过线段树查询，结果保持中性值`(0, -1)`。 

## 工作示例

 ### 示例 1

 输入：```
5 2
1 3 6 7 4
```压缩高度：```
[1, 3, 4, 6, 7]
```| 我| 高度| 最佳前任dp | dp[i] | dp[i] | 家长 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 0 | 1 | -1 |
 | 2 | 3 | 1 | 2 | 1 |
 | 3 | 6 | 2 | 3 | 2 |
 | 4 | 7 | 3 | 4 | 3 |
 | 5 | 4 | 3 | 4 | 3 |

 最大DP值为`4`。 一种有效的重建是：```
1 2 3 5
```该跟踪显示每个支柱如何通过高度范围查询获得最佳前任支柱，而不是单独检查每个较早的支柱。 

### 示例 2

 输入：```
4 1
7 7 7 7
```| 我| 高度| 最佳前任dp | dp[i] | dp[i] | 家长 |
 | --- | --- | --- | --- | --- |
 | 1 | 7 | 0 | 1 | -1 |
 | 2 | 7 | 0 | 1 | -1 |
 | 3 | 7 | 0 | 1 | -1 |
 | 4 | 7 | 0 | 1 | -1 |

 由于任何一对之间的高度差为零，因此任何跳跃都是合法的。 每个支柱都有自己的顺序。 

最终答案很长`1`，并且任何单个索引都是有效的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个支柱执行恒定数量的二分搜索和线段树操作 |
 | 空间| O(n) | DP数组、父数组、压缩坐标和线段树|

 和`n = 100000`， 一个`O(n log n)`解决方案仅执行几百万次操作，完全符合时间限制。 内存使用呈线性且远低于可用的 256 MB。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_left, bisect_right

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, d = map(int, input().split())
    h = list(map(int, input().split()))

    vals = sorted(set(h))
    m = len(vals)

    NEG = (0, -1)

    class SegmentTree:
        def __init__(self, n):
            self.n = 1
            while self.n < n:
                self.n <<= 1
            self.seg = [NEG] * (2 * self.n)

        def better(self, a, b):
            return a if a[0] >= b[0] else b

        def update(self, pos, value):
            p = pos + self.n
            if value[0] <= self.seg[p][0]:
                return
            self.seg[p] = value
            p >>= 1
            while p:
                self.seg[p] = self.better(
                    self.seg[p * 2],
                    self.seg[p * 2 + 1]
                )
                p >>= 1

        def query(self, l, r):
            if l > r:
                return NEG
            l += self.n
            r += self.n
            res = NEG
            while l <= r:
                if l & 1:
                    res = self.better(res, self.seg[l])
                    l += 1
                if not (r & 1):
                    res = self.better(res, self.seg[r])
                    r -= 1
                l >>= 1
                r >>= 1
            return res

    st = SegmentTree(m)

    dp = [0] * n
    par = [-1] * n

    for i in range(n):
        best = NEG

        p = bisect_right(vals, h[i] - d) - 1
        if p >= 0:
            best = st.query(0, p)

        q = bisect_left(vals, h[i] + d)
        if q < m:
            cand = st.query(q, m - 1)
            if cand[0] > best[0]:
                best = cand

        dp[i] = best[0] + 1
        par[i] = best[1]

        st.update(bisect_left(vals, h[i]), (dp[i], i))

    ans = max(dp)
    return str(ans)

# provided sample
assert run("5 2\n1 3 6 7 4\n") == "4"

# minimum size
assert run("1 5\n10\n") == "1"

# all equal heights, d > 0
assert run("4 1\n7 7 7 7\n") == "1"

# d = 0, every jump allowed
assert run("5 0\n2 2 2 2 2\n") == "5"

# alternating valid jumps
assert run("5 10\n1 20 2 30 3\n") == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 5 / 10`|`1`| 最小输入尺寸|
 |`4 1 / 7 7 7 7`|`1`| 禁止跳跃的等高 |
 |`5 0 / 2 2 2 2 2`|`5`| 每次跳跃都是合法的特殊情况 |
 |`5 10 / 1 20 2 30 3`|`5`| 长链条同时使用低高度和高高度范围 |

 ## 边缘情况

 考虑：```
4 1
7 7 7 7
```对于每个柱子，有效的高度范围是`≤ 6`和`≥ 8`。 这两个范围都不包含任何加工过的支柱。 两个线段树查询都返回中性值，因此每个`dp[i]`变成`1`。 该算法正确地报告不可能发生跳跃。 

考虑：```
5 0
2 2 2 2 2
```现在，每个早期的支柱都是有效的前身。 较低的区间变为`≤ 2`，其中已经包含所有已处理的支柱。 每个新支柱都扩展了迄今为止发现的最佳序列，产生 DP 值`1, 2, 3, 4, 5`。 答案是完整的序列。 

考虑：```
4 3
10 1 20 8
```对于身高`8`，有效的前任都是高度`1`和身高`20`，因为该条件基于绝对差。 该算法执行两次单独的范围查询，一次针对较小的高度，另一次针对较大的高度，然后获取更好的结果。 这避免了仅考虑高度谱一侧的常见错误。 

考虑：```
3 1000000000
1 1000000000000000 2
```高度很大，但坐标压缩将它们映射到很小的索引范围。 线段树从不依赖于原始高度值，因此该算法可以处理完整的高度`10^15`范围而不增加内存使用量。
