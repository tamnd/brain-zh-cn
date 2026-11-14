---
title: "CF 444C - DZY 热爱色彩"
description: "我们有一条由位置 1...n 组成的丝带。 最初，位置 i 具有颜色 i，因此每个位置都以不同的颜色开始。 执行两种操作。 绘制操作将新颜色 x 分配给段 [l, r] 中的每个位置。"
date: "2026-06-07T16:00:27+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 444
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 254 (Div. 1)"
rating: 2400
weight: 444
solve_time_s: 319
verified: false
draft: false
---

[CF 444C - DZY 喜欢颜色](https://codeforces.com/problemset/problem/444/C)

 **评分：** 2400
 **标签：** 数据结构
 **求解时间：** 5m 19s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个由职位组成的功能区`1...n`。 最初，位置`i`有颜色`i`，所以每个位置都以不同的颜色开始。 

执行两种操作。 

绘画操作分配新颜色`x`到段中的每个位置`[l, r]`。 当当前位置有颜色时`y`被重新绘制为`x`，其累积的色彩增加了`|x - y|`。 

查询操作要求获取某个片段的总色彩度`[l, r]`。 

挑战在于色带长度和操作次数都可以达到`10^5`。 在每次更新中重新绘制每个位置的简单模拟可能需要最多`10^10`最坏的情况下位置更新，在2秒的限制内是完全不可能的。 

第一个观察结果是颜色发生了多次变化，但每次绘制操作后，整个间隔都变成了单一颜色。 色带自然分解为具有相同当前颜色的最大片段。 如果我们可以直接维护这些段而不是单独的位置，那么每次操作的更改数量就会少得多。 

另一个微妙的方面是色彩会永久积累。 重新绘制位置不会覆盖以前的贡献。 例如：```
n = 1

paint [1,1] color 5
paint [1,1] color 2
query [1,1]
```答案是```
|5-1| + |2-5| = 4 + 3 = 7
```仅存储当前颜色的粗心实现将丢失早期的贡献。 

当用相同的颜色重新绘制时会出现第二个容易的错误。```
n = 3

paint [1,3] color 10
paint [1,3] color 10
query [1,3]
```第二次更新贡献为零，因为每个位置都已经有颜色`10`。 第二次更新后答案必须保持不变。 

错误的第三个来源是与现有颜色段部分重叠。```
n = 5

paint [2,4] color 7
```最初的颜色段是```
[1]=1 [2]=2 [3]=3 [4]=4 [5]=5
```此更新与三种现有颜色相交。 对色彩的贡献是```
|7-2| + |7-3| + |7-4|
```分别对应位置 2、3 和 4。 任何段结构必须首先在更新范围的边界处分割，否则段长度和贡献将变得不正确。 

## 方法

 蛮力方法存储每个位置的当前颜色和累积的色彩。 

如需更新`[l,r] -> x`，迭代范围内的每个位置，添加`|current_color - x|`改变其色彩，然后将其颜色替换为`x`。 

对于查询，对请求的时间间隔内的色彩值进行求和。 

这个方法显然是正确的，因为它直接遵循定义。 不幸的是，一次更新可能会触动`O(n)`职位。 和`10^5`长度丝带的更新`10^5`，最坏情况工作达到`10^10`运营。 

关键的观察结果是，绘制操作以完全相同的方式影响整个单色段。 

假设职位`[L,R]`目前都有颜色`c`，然后我们用颜色重新绘制它们`x`。 

每个位置获得相同的金额：```
|x-c|
```我们可以将此值添加到间隔数据结构中，而不是单独更新每个位置`[L,R]`。 

这表明将问题分成两个独立的部分。 

第一部分跟踪当前颜色。 为此，我们维护最大单色间隔的有序集合。 重新绘制范围只需要检查与其相交的间隔。 

第二部分追踪积累的色彩。 每次间隔长度`k`和颜色`c`被重新绘制为`x`，该区间内的每个位置都会收到一个加性增量`|x-c|`。 这只是一个范围添加操作。 查询要求范围总和。 具有惰性传播的线段树处理这两个操作`O(log n)`。 

间隔集告诉我们哪些位置接收哪个增量。 线段树存储累积的色彩值。 

每个重绘操作将间隔边界分割为`l`和`r+1`，访问所有受影响的单色区间，将相应的范围添加应用于线段树，删除这些区间，最后插入一个新的彩色区间`x`。 

经典的有序不相交间隔树论证表明，每个间隔只能创建和销毁有限次数。 在所有操作中，间隔访问的总数仍然是可控的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(n) | 太慢了|
 | 最佳 | O((m + K) log n) 其中 K 是分割/访问的总间隔 | O(n) | 已接受 |

 ## 算法演练

 1. 构建一组代表当前颜色的有序间隔。 

最初，每个位置都有唯一的颜色，因此我们创建间隔：```
[1,1] color 1
[2,2] color 2
...
[n,n] color n
```2. 构建存储色彩值的惰性线段树。 

每个值都从零开始。 
3.在处理更新之前，在位置分割区间结构`l`。 

如果某个区间跨越`l`，将其替换为两个间隔，以便一个间隔恰好从`l`。 
4.在位置再次分割`r+1`。 

这一步之后，每个区间都完全在里面了`[l,r]`成为集合中的显式区间。 
5. 迭代完全包含在的所有区间`[l,r]`。 

假设一个区间是`[L,R]`使用当前颜色`c`。 

该区间内的每个位置都会获得：```
|x-c|
```应用线段树范围加法`|x-c|`在`[L,R]`。 
6. 删除包含在的所有区间`[l,r]`。 

它们的颜色不再相关，因为重绘操作会覆盖它们。 
7. 插入一个新的区间`[l,r]`有颜色`x`。 

该间隔代表整个重绘区域。 
8. 对于查询操作，只需向线段树询问范围和`[l,r]`。 

线段树已经包含了曾经应用的每个色彩增量。 

### 为什么它有效

 间隔集始终表示功能区的准确当前颜色，作为不相交的单色间隔的分区。 

分裂后于`l`和`r+1`, 里面的每个区间`[l,r]`具有单一当前颜色。 从颜色重新绘制这样一个区间`c`着色`x`将该区间内的每个位置精确增加`|x-c|`，这正是应用于线段树的更新。 

线段树存储随时间累积的所有重绘贡献的总和。 由于每个重绘贡献都会添加到每个受影响的位置一次并且永远不会被删除，因此范围和查询会准确返回所请求的总色彩。 

因此，区间结构保持正确的当前颜色，而线段树保持正确的累积色彩，并且它们一起准确地模拟每个操作。 

## Python 解决方案```python
import sys
from bisect import bisect_left
input = sys.stdin.readline

class SegTree:
    def __init__(self, n):
        self.n = n
        self.sum = [0] * (4 * n)
        self.lazy = [0] * (4 * n)

    def _push(self, p, l, r):
        if self.lazy[p] == 0:
            return

        mid = (l + r) >> 1
        v = self.lazy[p]

        self.sum[p * 2] += v * (mid - l + 1)
        self.sum[p * 2 + 1] += v * (r - mid)

        self.lazy[p * 2] += v
        self.lazy[p * 2 + 1] += v

        self.lazy[p] = 0

    def _add(self, p, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.sum[p] += val * (r - l + 1)
            self.lazy[p] += val
            return

        self._push(p, l, r)

        mid = (l + r) >> 1

        if ql <= mid:
            self._add(p * 2, l, mid, ql, qr, val)
        if qr > mid:
            self._add(p * 2 + 1, mid + 1, r, ql, qr, val)

        self.sum[p] = self.sum[p * 2] + self.sum[p * 2 + 1]

    def add(self, l, r, val):
        self._add(1, 1, self.n, l, r, val)

    def _query(self, p, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.sum[p]

        self._push(p, l, r)

        mid = (l + r) >> 1
        ans = 0

        if ql <= mid:
            ans += self._query(p * 2, l, mid, ql, qr)
        if qr > mid:
            ans += self._query(p * 2 + 1, mid + 1, r, ql, qr)

        return ans

    def query(self, l, r):
        return self._query(1, 1, self.n, l, r)

def solve():
    n, m = map(int, input().split())

    seg = SegTree(n)

    starts = list(range(1, n + 1))
    color = {i: i for i in range(1, n + 1)}
    right = {i: i for i in range(1, n + 1)}

    def split(pos):
        if pos > n:
            return len(starts)

        idx = bisect_left(starts, pos)

        if idx < len(starts) and starts[idx] == pos:
            return idx

        idx -= 1
        s = starts[idx]
        e = right[s]
        c = color[s]

        starts.insert(idx + 1, pos)

        right[s] = pos - 1
        right[pos] = e

        color[pos] = c

        return idx + 1

    out = []

    for _ in range(m):
        op = list(map(int, input().split()))

        if op[0] == 1:
            _, l, r, x = op

            ir = split(r + 1)
            il = split(l)

            affected = starts[il:ir]

            for s in affected:
                e = right[s]
                c = color[s]
                seg.add(s, e, abs(x - c))

            for s in affected:
                del color[s]
                del right[s]

            starts[il:ir] = [l]
            color[l] = x
            right[l] = r

        else:
            _, l, r = op
            out.append(str(seg.query(l, r)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```线段树仅负责色彩值。 每次重绘都会转化为范围添加操作，并且每个查询都会变为范围求和请求。 

间隔结构存储当前颜色。 每个间隔由其左端点标识。 这`starts`列表保持排序，而字典存储间隔的右端点和颜色。 

这`split(pos)`常规操作是关键操作。 如果一个区间跨越`pos`，它被分为两个具有相同颜色的区间。 在两个更新边界处分割后，重绘范围内的每个间隔都可以独立处理。 

一个微妙的实现细节是两个分割的顺序。 我们分手于`r + 1`在分裂之前`l`。 这反映了标准 ODT 实现，并避免使我们稍后处理的迭代器范围无效。 

另一个细节是答案可能会超出 32 位限制。 每个线段树值都存储在 Python 整数中，它会自动处理任意大的值。 

## 工作示例

 ### 示例 1

 输入：```
3 3
1 1 2 4
1 2 3 5
2 1 3
```每次操作后的状态：

 | 运营| 术后间隔时间| 添加贡献 |
 | ---| ---| ---|
 | 初始| [1,1]:1 [2,2]:2 [3,3]:3 | 0 |
 | 油漆 [1,2] -> 4 | [1,2]:4 [3,3]:3 | pos1 上有 3 个，pos2 上有 2 个 |
 | 油漆 [2,3] -> 5 | [1,1]:4 [2,3]:5 | 1 个在 pos2，2 个在 pos3 |
 | 查询[1,3] | 不变| 答案 = 8 |

 色彩值变为：

 | 位置 | 价值|
 | ---| ---|
 | 1 | 3 |
 | 2 | 3 |
 | 3 | 2 |

 和：```
3 + 3 + 2 = 8
```此示例显示线段树如何累积多个重绘操作的​​贡献。 

### 示例 2

 输入：```
5 3
1 2 4 7
2 1 5
2 2 4
```重新喷漆后：

 | 位置 | 旧色| 新颜色| 增量|
 | ---| ---| ---| ---|
 | 2 | 2 | 7 | 5 |
 | 3 | 3 | 7 | 4 |
 | 4 | 4 | 7 | 3 |

 色彩数组：```
[0, 5, 4, 3, 0]
```查询：

 | 查询 | 结果 |
 | ---| ---|
 | [1,5]| 12 | 12
 | [2,4]| 12 | 12

 该迹线表明，重新绘制范围对每个覆盖的单色间隔都有独立的贡献。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((m + K) log n) | O((m + K) log n) | 每个线段树操作的成本为 O(log n)，并且仅当更新访问时才处理由分割创建的每个间隔 |
 | 空间| O(n) | 线段树加区间表示|

 区间结构绝不会包含超过`O(n + m)`整个执行过程中的间隔，并且线段树使用线性内存。 和`n, m ≤ 10^5`，这完全符合该问题的公认解决方案所使用的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    from bisect import bisect_left

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    input = sys.stdin.readline

    class SegTree:
        def __init__(self, n):
            self.n = n
            self.sum = [0] * (4 * n)
            self.lazy = [0] * (4 * n)

        def push(self, p, l, r):
            if not self.lazy[p]:
                return
            mid = (l + r) // 2
            v = self.lazy[p]
            self.sum[p * 2] += v * (mid - l + 1)
            self.sum[p * 2 + 1] += v * (r - mid)
            self.lazy[p * 2] += v
            self.lazy[p * 2 + 1] += v
            self.lazy[p] = 0

        def add(self, p, l, r, ql, qr, v):
            if ql <= l and r <= qr:
                self.sum[p] += v * (r - l + 1)
                self.lazy[p] += v
                return
            self.push(p, l, r)
            mid = (l + r) // 2
            if ql <= mid:
                self.add(p * 2, l, mid, ql, qr, v)
            if qr > mid:
                self.add(p * 2 + 1, mid + 1, r, ql, qr, v)
            self.sum[p] = self.sum[p * 2] + self.sum[p * 2 + 1]

        def query(self, p, l, r, ql, qr):
            if ql <= l and r <= qr:
                return self.sum[p]
            self.push(p, l, r)
            mid = (l + r) // 2
            ans = 0
            if ql <= mid:
                ans += self.query(p * 2, l, mid, ql, qr)
            if qr > mid:
                ans += self.query(p * 2 + 1, mid + 1, r, ql, qr)
            return ans

    n, m = map(int, input().split())
    seg = SegTree(n)

    starts = list(range(1, n + 1))
    color = {i: i for i in range(1, n + 1)}
    right = {i: i for i in range(1, n + 1)}

    def split(pos):
        if pos > n:
            return len(starts)
        idx = bisect_left(starts, pos)
        if idx < len(starts) and starts[idx] == pos:
            return idx
        idx -= 1
        s = starts[idx]
        starts.insert(idx + 1, pos)
        right[pos] = right[s]
        color[pos] = color[s]
        right[s] = pos - 1
        return idx + 1

    ans = []

    for _ in range(m):
        q = list(map(int, input().split()))

        if q[0] == 1:
            _, l, r, x = q
            ir = split(r + 1)
            il = split(l)

            cur = starts[il:ir]

            for s in cur:
                seg.add(1, 1, n, s, right[s], abs(x - color[s]))

            for s in cur:
                del color[s]
                del right[s]

            starts[il:ir] = [l]
            color[l] = x
            right[l] = r

        else:
            _, l, r = q
            ans.append(str(seg.query(1, 1, n, l, r)))

    return "\n".join(ans)

# sample
assert run(
"""3 3
1 1 2 4
1 2 3 5
2 1 3
"""
) == "8"

# minimum size
assert run(
"""1 1
2 1 1
"""
) == "0"

# repaint same color
assert run(
"""1 2
1 1 1 1
2 1 1
"""
) == "0"

# full range repaint
assert run(
"""3 2
1 1 3 10
2 1 3
"""
) == "24"

# boundary split test
assert run(
"""5 3
1 2 4 7
2 1 5
2 2 4
"""
) == "12\n12"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素查询| 0 | 初始状态处理 |
 | 用相同的颜色重新涂漆| 0 | 零贡献更新 |
 | 全系列重涂| 24 | 全阵列更新|
 | 部分内部重新粉刷| 12, 12 | 12, 12 正确的区间分割 |
 | 官方样品| 8 | 一般正确性 |

 ## 边缘情况

 考虑用相同的颜色重新绘制。```
1 2
1 1 1 1
2 1 1
```位置 1 最初具有颜色 1。用颜色 1 重新绘制它会添加```
|1-1| = 0
```该算法访问区间，计算`abs(x - c)`，获得零，并应用零范围加法。 查询正确返回`0`。 

考虑重复重新绘制同一位置。```
1 3
1 1 1 5
1 1 1 2
2 1 1
```第一次重绘贡献`4`，第二个贡献`3`。 线段树存储了这两个更新，所以最终的答案是`7`。 由于贡献仅被添加而不会被覆盖，因此累积的色彩仍然是正确的。 

考虑在现有间隔内开始和结束的重新绘制。```
5 2
1 2 4 7
2 1 5
```在处理更新之前，算法在位置处进行分割`2`和`5`。 受影响的区域成为完整的单色区间的集合。 每个接收恰好一个范围加法，等于其色差`7`。 外面没有位置`[2,4]`被触摸，查询正确返回`12`。 

这些情况正是区间分割和累积范围添加很重要的地方。 该算法通过其不变量自然地处理它们，即间隔集始终与当前着色匹配，并且线段树始终存储曾经应用的每个重绘贡献。
