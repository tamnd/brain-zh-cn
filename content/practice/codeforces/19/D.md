---
title: "CF 19D - 积分"
description: "我们在 2D 平面上维护一组动态点。 支持三种操作。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 19
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 19"
rating: 2800
weight: 19
solve_time_s: 229
verified: true
draft: false
---
[CF 19D - 分数](https://codeforces.com/problemset/problem/19/D)

 **评分：** 2800
 **标签：** 数据结构
 **求解时间：** 3m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在 2D 平面上维护一组动态点。 支持三种操作。`add x y`插入一个点。`remove x y`删除现有点。`find x y`要求坐标严格大于的点`(x, y)`在两个维度上，都有非常具体的打破平局规则。 

在所有满足的点中：

 -`px > x`-`py > y`我们想要尽可能最小的一个`px`。 如果几个点有相同的点`px`，我们选择最小的`py`。 

所以查询并不要求全局最小的有效点。 它首先最小化 x 坐标，然后最小化 y 坐标。 

操作次数达到`2 * 10^5`，坐标达到`10^9`。 大坐标立即建议进行坐标压缩，因为我们无法构建直接按坐标值索引的数组。 

操作次数是更严重的约束。 对每个点的所有点进行简单扫描`find`在最坏的情况下，查询将花费二次时间。 和`2 * 10^5`操作，一个`O(n)`查询可以很容易地产生周围`4 * 10^10`比较，这在2秒之内是完全不可能的。 

我们需要每个操作接近对数的时间。 

棘手的部分是排序规则是不对称的。 我们不仅仅需要上方和右侧的任何点。 我们特别需要最左边的有效 x 坐标，只有在固定该 x 坐标后，我们才能最小化 y。 

该结构是解决方案的关键。 

考虑这个例子：```
add 2 100
add 3 1
find 1 50
```正确答案是`(2, 100)`。 

全局最小化有效点中的 y 的粗心方法将会返回`(3, 1)`，这是错误的，因为 x 具有更高的优先级。 

另一个微妙的例子是严格的不平等。```
add 5 5
find 5 4
```答案是`-1`。 

虽然`y > 4`，x 坐标并不严格大于`5`。 

重复的 x 坐标也很重要。```
add 7 10
add 7 3
find 5 4
```答案是`(7, 10)`。 

重点`(7, 3)`失败是因为`3`不大于`4`。 我们不能只存储每个 x 坐标的最小 y。 我们需要知道是否存在比查询更大的 y。 

动态删除创建了另一种常见的故障模式。```
add 4 8
remove 4 8
find 1 1
```答案是`-1`。 

当点消失时，任何缓存的结构都必须正确删除贡献。 

## 方法

 暴力解决方案很简单。 维护集合中的所有当前点。 对于每个`find x y`，迭代每个点并根据问题排序保留最佳候选点。 

这是有效的，因为查询定义是明确的。 我们简单地测试每个点是否满足：```
px > x and py > y
```并保持字典顺序最小的`(px, py)`。 

使用哈希集插入和删除很容易，但查询变得昂贵。 在最坏的情况下我们可能会`2 * 10^5`活跃点和`2 * 10^5`查询，大致产生`4 * 10^10`检查。 

瓶颈是有效地搜索最小的有效 x 坐标。 

重要的观察是，对于每个 x 坐标，我们只关心该 x 处当前存在的最大 y。 

假设我们正在检查某个 x 坐标是否可以回答查询`(qx, qy)`。 

如果 x 处的最大 y 不大于`qy`，那么 x 就没有意义了。 

如果最大 y 大于`qy`，那么那里至少存在一个有效点。 

那么问题就变成了：

 - 找到大于的最小x坐标`qx`- 其最大 y 大于`qy`一旦找到 x，我们只需要 x 处超过的最小 y`qy`。 

这正是线段树能够很好处理的情况。 

我们压缩输入中出现的所有 x 坐标。 对于每个压缩的 x 索引，我们维护：

 - 当前存在于该 x 处的一组排序的 y 值
 - x 处的最大 y 值

 线段树存储这些最大值。 

现在查询变成：

 - 在线段树中搜索最左边的位置`qx`- 其存储的最大 y 超过`qy`找到该 x 坐标后，在其 y 集合内进行二分搜索以查找大于的最小 y`qy`。 

每个运算都变成对数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 最坏情况 | O(n²) O(n) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 首先读取所有操作并收集出现的每个 x 坐标。 

我们需要坐标压缩，因为 x 值可以大到`10^9`，但最多有`2 * 10^5`不同的坐标。 
2. 对 x 坐标进行排序和去重。 

每个原始 x 坐标接收一个压缩索引`0`和`m - 1`。 
3. 对于每个压缩的 x 索引，维护当前在该 x 处活动的 y 值的排序容器。 

我们需要对该结构进行两次操作：

 - 插入/删除 y
 - 找到严格大于查询值的最小 y
 4. 构建一棵线段树，其中每个节点存储其区间中当前存在的最大 y。 

如果 x 坐标没有活动点，则其值变为`-1`。 
5. 对于一个`add x y`操作：

 - 插入`y`进入 x 的排序结构
 - 用 x 处的新最大值 y 更新线段树的叶子

 线段树始终反映每个 x 坐标可用的最大 y。 
6. 对于一个`remove x y`操作：

 - 擦除`y`从 x 的结构
 - 重新计算 x 处的最大值 y
 - 更新线段树

 如果该 x 坐标处没有剩余点，则存储的最大值变为`-1`。 
7. 对于一个`find x y`操作：

 - 定位第一个压缩的 x-index 严格大于`x`- 在线段树中查询存储的最大y超过的最左边索引`y`搜索有效是因为如果段最大值不大于`y`，那么该段内的 x 坐标都无法回答查询。 
8. 如果不存在这样的x坐标，则输出`-1`。 
9. 否则，在该 x 坐标的 y 容器内，对严格大于查询值的最小 y 进行二分搜索。 

这给出了所需的平局打破行为：

 - 最小的有效 x 首先
 - x 中最小的有效 y

 ### 为什么它有效

 线段树不变量为：```
tree[node] = maximum y among all active points in that interval of x-coordinates
```查询时，如果段最大值最多为`qy`，那么该段中的每个点都不满足条件`py > qy`。 跳过整个部分总是安全的。 

搜索总是首先下降到左孩子。 因此，找到的第一个有效叶子对应于满足查询的最小 x 坐标。 

一旦 x 坐标固定，选择大于的最小 y`qy`该 x 坐标与所需的排序规则完全匹配。 

由于插入和删除总是刷新相应的最大 y，因此每次更新后不变式仍然为真。 

## Python 解决方案```python
import sys
from bisect import bisect_right, insort
from collections import defaultdict

input = sys.stdin.readline

class SegmentTree:
    def __init__(self, n):
        self.n = n
        self.tree = [-1] * (4 * n)

    def update(self, node, l, r, idx, val):
        if l == r:
            self.tree[node] = val
            return

        mid = (l + r) // 2

        if idx <= mid:
            self.update(node * 2, l, mid, idx, val)
        else:
            self.update(node * 2 + 1, mid + 1, r, idx, val)

        self.tree[node] = max(
            self.tree[node * 2],
            self.tree[node * 2 + 1]
        )

    def query(self, node, l, r, ql, y):
        if r < ql or self.tree[node] <= y:
            return -1

        if l == r:
            return l

        mid = (l + r) // 2

        left = self.query(node * 2, l, mid, ql, y)
        if left != -1:
            return left

        return self.query(node * 2 + 1, mid + 1, r, ql, y)

def solve():
    n = int(input())

    ops = []
    xs = []

    for _ in range(n):
        t, x, y = input().split()
        x = int(x)
        y = int(y)

        ops.append((t, x, y))
        xs.append(x)

    comp = sorted(set(xs))
    xid = {x: i for i, x in enumerate(comp)}

    m = len(comp)

    ys = defaultdict(list)

    seg = SegmentTree(m)

    out = []

    for t, x, y in ops:
        idx = xid[x]

        if t == "add":
            insort(ys[idx], y)
            seg.update(1, 0, m - 1, idx, ys[idx][-1])

        elif t == "remove":
            pos = bisect_right(ys[idx], y) - 1
            ys[idx].pop(pos)

            new_max = ys[idx][-1] if ys[idx] else -1
            seg.update(1, 0, m - 1, idx, new_max)

        else:
            start = bisect_right(comp, x)

            if start >= m:
                out.append("-1")
                continue

            res = seg.query(1, 0, m - 1, start, y)

            if res == -1:
                out.append("-1")
                continue

            pos = bisect_right(ys[res], y)
            ans_y = ys[res][pos]

            out.append(f"{comp[res]} {ans_y}")

    sys.stdout.write("\n".join(out))

solve()
```该解决方案从坐标压缩开始，因为 x 值稀疏且极大。 输入中任意位置出现的每个 x 坐标都会收到一个紧凑索引。 

对于每个压缩的 x 索引，`ys[idx]`按排序顺序存储所有活动 y 值。 排序顺序很重要，因为查询需要严格大于阈值的最小 y。 蟒蛇的`bisect_right`直接给出该位置。 

线段树每个 x 坐标仅存储一个数字，即最大有效 y。 该单个值足以确定 x 处的某个点是否可以满足查询。 

递归查询功能是解决方案的核心。 它会跳过最大 y 太小的段，并且始终首先探索左孩子。 这保证了第一个有效叶子对应于最小的有效 x 坐标。 

删除很容易出错。 删除 y 值后，我们必须重新计算该 x 坐标处的最大 y。 如果容器变空，我们会存储`-1`因此未来的查询正确地忽略该位置。 

该查询到处都使用严格的不等式。 因此`bisect_right`用于 x 和 y 搜索。 使用`bisect_left`会错误地允许相等的坐标。 

## 工作示例

 ### 示例 1

 输入：```
7
add 1 1
add 3 4
find 0 0
remove 1 1
find 0 0
add 1 1
find 0 0
```### 追踪

 | 步骤| 运营| 活动积分 | 最大分段| 回答 |
 | ---| ---| ---| ---| ---|
 | 1 | 添加 1 1 | {(1,1)} | x=1→1, x=3→-1 | |
 | 2 | 添加 3 4 | {(1,1),(3,4)} | x=1→1, x=3→4 | |
 | 3 | 找到 0 0 | 不变| 不变| 1 1 | 1
 | 4 | 删除 1 1 | {(3,4)} | x=1→-1, x=3→4 | |
 | 5 | 找到 0 0 | 不变| 不变| 3 4 |
 | 6 | 添加 1 1 | {(1,1),(3,4)} | x=1→1, x=3→4 | |
 | 7 | 找到 0 0 | 不变| 不变| 1 1 | 1

 该跟踪显示了为什么查询首先搜索最小的有效 x 坐标。 虽然`(3,4)`总是满足条件，`(1,1)`只要它存在，就首选它，因为它的 x 坐标较小。 

### 示例 2

 输入：```
8
add 5 2
add 5 10
add 7 3
find 4 5
find 5 1
remove 5 10
find 4 5
find 6 2
```### 追踪

 | 步骤| 运营| 活动积分 | x=5 处的最大值 | x=7 处的最大值 | 回答 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 添加 5 2 | {(5,2)} | 2 | -1 | |
 | 2 | 添加 5 10 | {(5,2),(5,10)} | 10 | 10 -1 | |
 | 3 | 添加 7 3 | {(5,2),(5,10),(7,3)} | 10 | 10 3 | |
 | 4 | 找到 4 5 | 不变| 10 | 10 3 | 5 10 |
 | 5 | 找到 5 1 | 不变| 10 | 10 3 | 7 3 |
 | 6 | 删除 5 10 | {(5,2),(7,3)} | 2 | 3 | |
 | 7 | 找到 4 5 | 不变| 2 | 3 | -1 |
 | 8 | 找到 6 2 | 不变| 2 | 3 | 7 3 |

 此示例说明了为什么存储每个 x 坐标的最大 y 就足够了。 删除之前，x=5 仍然可行，因为它的最大 y 为 10。删除之后`(5,10)`，最大值变为2，不再满足`y > 5`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每次更新和查询都会执行对数线段树和二分查找操作 |
 | 空间| O(n) | 坐标压缩、线段树和存储点均线性缩放 |

 至多有`2 * 10^5`运营，`O(n log n)`很容易符合限制。 线段树的性能大约是`log₂(2 * 10^5) ≈ 18`每个操作的递归级别，这在 Python 中非常易于管理。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_right, insort
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    input = sys.stdin.readline

    class SegmentTree:
        def __init__(self, n):
            self.n = n
            self.tree = [-1] * (4 * n)

        def update(self, node, l, r, idx, val):
            if l == r:
                self.tree[node] = val
                return

            mid = (l + r) // 2

            if idx <= mid:
                self.update(node * 2, l, mid, idx, val)
            else:
                self.update(node * 2 + 1, mid + 1, r, idx, val)

            self.tree[node] = max(
                self.tree[node * 2],
                self.tree[node * 2 + 1]
            )

        def query(self, node, l, r, ql, y):
            if r < ql or self.tree[node] <= y:
                return -1

            if l == r:
                return l

            mid = (l + r) // 2

            left = self.query(node * 2, l, mid, ql, y)
            if left != -1:
                return left

            return self.query(node * 2 + 1, mid + 1, r, ql, y)

    n = int(input())

    ops = []
    xs = []

    for _ in range(n):
        t, x, y = input().split()
        x = int(x)
        y = int(y)

        ops.append((t, x, y))
        xs.append(x)

    comp = sorted(set(xs))
    xid = {x: i for i, x in enumerate(comp)}

    ys = defaultdict(list)

    seg = SegmentTree(len(comp))

    ans = []

    for t, x, y in ops:
        idx = xid[x]

        if t == "add":
            insort(ys[idx], y)
            seg.update(1, 0, len(comp) - 1, idx, ys[idx][-1])

        elif t == "remove":
            pos = bisect_right(ys[idx], y) - 1
            ys[idx].pop(pos)

            val = ys[idx][-1] if ys[idx] else -1
            seg.update(1, 0, len(comp) - 1, idx, val)

        else:
            start = bisect_right(comp, x)

            if start >= len(comp):
                ans.append("-1")
                continue

            res = seg.query(1, 0, len(comp) - 1, start, y)

            if res == -1:
                ans.append("-1")
                continue

            pos = bisect_right(ys[res], y)
            ans.append(f"{comp[res]} {ys[res][pos]}")

    return "\n".join(ans)

# provided sample
assert run(
"""7
add 1 1
add 3 4
find 0 0
remove 1 1
find 0 0
add 1 1
find 0 0
"""
) == "1 1\n3 4\n1 1"

# minimum case
assert run(
"""1
find 0 0
"""
) == "-1"

# strict inequality check
assert run(
"""3
add 5 5
find 5 4
find 4 5
"""
) == "-1\n-1"

# multiple points with same x
assert run(
"""5
add 7 3
add 7 10
find 5 4
find 5 9
find 5 10
"""
) == "7 10\n7 10\n-1"

# deletion updates maximum correctly
assert run(
"""6
add 2 1
add 2 100
remove 2 100
find 1 50
find 1 0
find 0 0
"""
) == "-1\n2 1\n2 1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单身的`find`空集 |`-1`| 空结构处理 |
 | 等坐标查询 |`-1`| 严格不等式正确性 |
 | 同一 x 处的多个 y 值 | 正确的 y 选择 | 正确的决胜局内一x |
 | 删除最大的 y | 更新最大值 | 线段树维护正确性|

 ## 边缘情况

 再次考虑严格的不平等：```
3
add 5 5
find 5 4
find 4 5
```为了`find 5 4`，搜索严格在 x=5 之后开始。 不存在更大的 x，所以答案是`-1`。 

为了`find 4 5`，x=5 有效，但 y=5 并不严格大于 5。线段树存储最大值 y=5，不大于查询阈值，因此查询正确拒绝该线段。 

现在考虑重复的 x 值：```
4
add 7 3
add 7 10
find 5 4
find 5 9
```线段树存储 x=7 时的最大值 y=10。 

为了`find 5 4`，查询发现 x=7 是可行的，因为 10 > 4。在已排序的 y 列表内`[3, 10]`，二分查找返回 10 作为大于 4 的最小 y。 

对于`find 5 9`，同样的逻辑再次返回 10。 

删除正确性是另一个微妙的点：```
5
add 2 1
add 2 100
remove 2 100
find 1 50
find 1 0
```最初，线段树在 x=2 处存储最大值 y=100。 

删除后`(2,100)`，最大值变为 1。更新通过树向上传播。 

为了`find 1 50`，线段树现在拒绝 x=2，因为它的最大 y 不再大于 50，所以答案变为`-1`。 

为了`find 1 0`, 点`(2,1)`仍然满足查询并正确返回。
