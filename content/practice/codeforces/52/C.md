---
title: "CF 52C - 圆形 RMQ"
description: "我们有一个排列成圆圈的数组。 每个操作都在两个索引之间的段上进行，但该段可能会环绕数组的末尾。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 52
codeforces_index: "C"
codeforces_contest_name: "Codeforces Testing Round 1"
rating: 2200
weight: 52
solve_time_s: 138
verified: true
draft: false
---
[CF 52C - 圆形 RMQ](https://codeforces.com/problemset/problem/52/C)

 **评分：** 2200
 **标签：** 数据结构
 **求解时间：** 2m 18s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个排列成圆圈的数组。 每个操作都在两个索引之间的段上进行，但该段可能会环绕数组的末尾。 

有两个操作。 

第一个操作为范围中的每个元素添加一个值。 

第二个操作要求范围内的最小值。 

如果左端点小于或等于右端点，则该段是正常的连续区间。 如果左端点较大，则线段会环绕。 例如，在大小为 5 的数组中，范围`[3,1]`均值指数`3,4,0,1`。 

输入给出初始数组，随后进行最多 200000 次操作。 对于每个查询操作，我们必须打印所请求的圆弧段中的最小值。 

这些约束立即排除了每个操作的任何线性时间处理。 和`n = 200000`和`m = 200000`，暴力解决方案可以粗略地触及`4 * 10^10`最坏情况下的元素，远远超出了2秒内所能容纳的范围。 甚至`O(sqrt n)`在这种规模下，每个操作在 Python 中会感到不舒服。 我们需要接近对数时间的更新和查询时间。 

操作也是混杂的。 更新修改范围，查询要求范围最小值。 这种组合正是需要延迟传播的设置。 仅支持点更新或仅静态查询的结构是不够的。 

圆形性质产生了几种容易误处理的边缘情况。 

考虑这个输入：```
5
1 2 3 4 5
1
3 1
```查询并不意味着空范围。 这意味着指数`3,4,0,1`，所以答案是`1`。 一个粗心的实现假设`l <= r`会崩溃或返回错误的结果。 

负面更新也很重要：```
3
5 5 5
2
0 2 -10
0 2
```更新后，数组变为`[-5,-5,-5]`，所以答案是`-5`。 任何使用无符号整数或不正确初始化最小值的实现都会在此处失败。 

当范围通过换行覆盖整个数组时，会出现另一种微妙的情况：```
4
10 20 30 40
2
2 1 -5
0 3
```更新内容`[2,1]`影响每个索引，因为包装段是`2,3,0,1`。 最终的数组变成`[5,15,25,35]`，所以最小值是`5`。 错误地分割圆形范围可能会留下间隙。 

## 方法

 最直接的解决办法就是逐字模拟每一个操作。 

对于更新，请迭代段中的所有索引并添加值。 对于查询，迭代段中的所有索引并计算最小值。 

这是可行的，因为操作很简单，并且可以通过手动包装索引来处理循环间隔。 问题是性能。 在最坏的情况下，每一次操作都可能触及所有`n`元素。 两者都有`n`和`m`等于`200000`，我们粗略得到：```
200000 * 200000 = 4 * 10^10
```运营。 这太慢了几百倍。 

关键的观察结果是这两种操作都是基于范围的。 

我们不需要立即更新每个元素。 如果整个段接收到`+v`，我们可以懒惰地存储这些信息，只在必要时将其推得更深。 同时，如果每个节点都存储其段的最小值，那么范围最小查询就变得自然。 

这直接导致了具有惰性传播的线段树。 

圆形间隔是唯一的额外复杂性。 包裹的段`[l,r]`和`l > r`可以分为两个正常区间：```
[l, n-1]
[0, r]
```一旦我们将每个循环范围减少到最多两个普通范围，其余的就成为标准的线段树处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(1) | O(1) | 太慢了 |
 | 最佳| O(m log n) | O(n) | 已接受 |

 ## 算法演练

 1. 在数组上构建线段树。 

每个节点都存储其段内的最小值。 根存储整个数组的最小值。 
2. 在树旁边添加一个惰性数组。`lazy[node]`存储仍需要传播给子级的待处理增量。 这让我们可以延迟更新，而不是立即触及每个元素。 
3. 对于范围更新，递归地处理线段树。 

如果当前节点完全位于更新范围内，则直接将增量添加到`tree[node]`并将其记录在`lazy[node]`。 

我们不会进一步下降，因为该段中的每个元素都会发生相同的变化。 
4. 如果节点仅被部分覆盖，则在继续之前将其挂起的惰性值向下推。 

这可以在递归继续深入之前保持子值正确。 
5. 更新子节点后，将当前节点重新计算为：```
tree[node] = min(left child, right child)
```这保留了每个节点存储其段的最小值的不变性。 
6. 对于范围最小查询，递归遍历相关节点。 

如果当前段完全位于查询范围内，则立即返回其存储的最小值。 
7. 如果该段仅部分重叠，则首先推送惰性值并使用`min`。 
8. 通过分割循环间隔来处理它们。 

如果`l <= r`，处理正常。 

如果`l > r`， 过程：```
[l, n-1]
[0, r]
```对于查询，取两部分中的最小值。 

对于更新，请将增量应用于两个部分。 

### 为什么它有效

 线段树始终保持一个不变量：```
tree[node] = minimum value inside that segment,
including all applied and pending updates.
```延迟传播保留了正确性，因为在任何未来查询或更深层次的递归需要该信息之前，都会记录每个延迟的增量。 当一个节点被更新完全覆盖时，将其存储的最小值增加`v`有效，因为该段中的每个元素均匀变化`v`。 

将包裹区间拆分为两个普通区间也是正确的，因为圆弧段正是这两个不相交区间的并集。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

class SegmentTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [0] * (4 * self.n)
        self.lazy = [0] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def build(self, node, l, r, arr):
        if l == r:
            self.tree[node] = arr[l]
            return

        mid = (l + r) // 2

        self.build(node * 2, l, mid, arr)
        self.build(node * 2 + 1, mid + 1, r, arr)

        self.tree[node] = min(
            self.tree[node * 2],
            self.tree[node * 2 + 1]
        )

    def push(self, node):
        if self.lazy[node] != 0:
            val = self.lazy[node]

            left = node * 2
            right = node * 2 + 1

            self.tree[left] += val
            self.tree[right] += val

            self.lazy[left] += val
            self.lazy[right] += val

            self.lazy[node] = 0

    def update(self, node, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.tree[node] += val
            self.lazy[node] += val
            return

        self.push(node)

        mid = (l + r) // 2

        if ql <= mid:
            self.update(node * 2, l, mid, ql, qr, val)

        if qr > mid:
            self.update(node * 2 + 1, mid + 1, r, ql, qr, val)

        self.tree[node] = min(
            self.tree[node * 2],
            self.tree[node * 2 + 1]
        )

    def query(self, node, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.tree[node]

        self.push(node)

        mid = (l + r) // 2
        ans = INF

        if ql <= mid:
            ans = min(ans, self.query(node * 2, l, mid, ql, qr))

        if qr > mid:
            ans = min(ans, self.query(node * 2 + 1, mid + 1, r, ql, qr))

        return ans

def solve():
    n = int(input())
    arr = list(map(int, input().split()))

    seg = SegmentTree(arr)

    m = int(input())

    out = []

    for _ in range(m):
        parts = list(map(int, input().split()))

        if len(parts) == 2:
            l, r = parts

            if l <= r:
                ans = seg.query(1, 0, n - 1, l, r)
            else:
                ans = min(
                    seg.query(1, 0, n - 1, l, n - 1),
                    seg.query(1, 0, n - 1, 0, r)
                )

            out.append(str(ans))

        else:
            l, r, v = parts

            if l <= r:
                seg.update(1, 0, n - 1, l, r, v)
            else:
                seg.update(1, 0, n - 1, l, n - 1, v)
                seg.update(1, 0, n - 1, 0, r, v)

    sys.stdout.write("\n".join(out))

solve()
```线段树存储线段的最小值。 构建阶段递归地向上组合子最小值。 

这`lazy`数组是关键的优化。 当更新完全覆盖一个段时，我们直接修改节点并推迟传播。 这避免了下降到每片叶子。 

这`push`函数在更深层次的递归之前将挂起的更新传输给子级。 忘记这一步是惰性传播中最常见的错误。 否则查询会读取过时的子值。 

查询函数用一个非常大的值初始化答案，因为最少的查询需要一个中性元素。 使用`0`这里会打破所有值为正的情况。 

循环间隔在线段树逻辑之外进行处理。 这使树的实现保持干净并且仅关注普通间隔。 

递归边界两端都包含在内。 这种选择必须在任何地方保持一致，特别是在以下方面：```
mid = (l + r) // 2
```与子段：```
[l, mid]
[mid + 1, r]
```混合包容性约定和半开放约定是产生相差一错误的常见原因。 

## 工作示例

 ### 示例 1

 输入：```
4
1 2 3 4
4
3 0
3 0 -1
0 1
2 1
```初始数组：```
[1, 2, 3, 4]
```| 运营| 受影响范围 | 操作后的数组 | 查询结果 |
 | --- | --- | --- | --- |
 |`3 0`| 指数`3,0`|`[1,2,3,4]`|`1`|
 |`3 0 -1`| 指数`3,0`|`[0,2,3,3]`| - |
 |`0 1`| 指数`0,1`|`[0,2,3,3]`|`0`|
 |`2 1`| 指数`2,3,0,1`|`[0,2,3,3]`|`0`|

 第一个查询演示了包装查询。 更新还包装并正确修改了数组的两端。 最终查询通过回绕覆盖整个数组。 

### 示例 2

 输入：```
5
10 20 30 40 50
5
1 3
4 1 -15
0 4
2 2 -100
0 4
```初始数组：```
[10,20,30,40,50]
```| 运营| 受影响范围 | 操作后的数组 | 查询结果 |
 | --- | --- | --- | --- |
 |`1 3`| 指数`1,2,3`|`[10,20,30,40,50]`|`20`|
 |`4 1 -15`| 指数`4,0,1`|`[-5,5,30,40,35]`| - |
 |`0 4`| 完整阵列|`[-5,5,30,40,35]`|`-5`|
 |`2 2 -100`| 指数`2`|`[-5,5,-70,40,35]`| - |
 |`0 4`| 完整阵列|`[-5,5,-70,40,35]`|`-70`|

 此跟踪显示包装更新和点更新。 线段树使用相同的递归机制来处理两者。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m log n) | 每次更新和查询最多涉及对数个线段树节点 |
 | 空间| O(n) | 线段树和惰性数组需要线性存储 |

 和`n`和`m`两者都达到`200000`，对数运算足够快。 具有惰性传播的线段树可以轻松地满足时间限制和内存限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    input_data = io.StringIO(inp)
    output_data = io.StringIO()

    input = input_data.readline

    INF = 10**18

    class SegmentTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.tree = [0] * (4 * self.n)
            self.lazy = [0] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def build(self, node, l, r, arr):
            if l == r:
                self.tree[node] = arr[l]
                return

            mid = (l + r) // 2

            self.build(node * 2, l, mid, arr)
            self.build(node * 2 + 1, mid + 1, r, arr)

            self.tree[node] = min(
                self.tree[node * 2],
                self.tree[node * 2 + 1]
            )

        def push(self, node):
            if self.lazy[node]:
                val = self.lazy[node]

                self.tree[node * 2] += val
                self.tree[node * 2 + 1] += val

                self.lazy[node * 2] += val
                self.lazy[node * 2 + 1] += val

                self.lazy[node] = 0

        def update(self, node, l, r, ql, qr, val):
            if ql <= l and r <= qr:
                self.tree[node] += val
                self.lazy[node] += val
                return

            self.push(node)

            mid = (l + r) // 2

            if ql <= mid:
                self.update(node * 2, l, mid, ql, qr, val)

            if qr > mid:
                self.update(node * 2 + 1, mid + 1, r, ql, qr, val)

            self.tree[node] = min(
                self.tree[node * 2],
                self.tree[node * 2 + 1]
            )

        def query(self, node, l, r, ql, qr):
            if ql <= l and r <= qr:
                return self.tree[node]

            self.push(node)

            mid = (l + r) // 2
            ans = INF

            if ql <= mid:
                ans = min(ans, self.query(node * 2, l, mid, ql, qr))

            if qr > mid:
                ans = min(ans, self.query(node * 2 + 1, mid + 1, r, ql, qr))

            return ans

    n = int(input())
    arr = list(map(int, input().split()))

    seg = SegmentTree(arr)

    m = int(input())

    out = []

    for _ in range(m):
        parts = list(map(int, input().split()))

        if len(parts) == 2:
            l, r = parts

            if l <= r:
                ans = seg.query(1, 0, n - 1, l, r)
            else:
                ans = min(
                    seg.query(1, 0, n - 1, l, n - 1),
                    seg.query(1, 0, n - 1, 0, r)
                )

            out.append(str(ans))

        else:
            l, r, v = parts

            if l <= r:
                seg.update(1, 0, n - 1, l, r, v)
            else:
                seg.update(1, 0, n - 1, l, n - 1, v)
                seg.update(1, 0, n - 1, 0, r, v)

    return "\n".join(out)

# provided samples
assert run(
"""4
1 2 3 4
4
3 0
3 0 -1
0 1
2 1
"""
) == "1\n0\n0", "sample 1"

# minimum size
assert run(
"""1
5
3
0 0
0 0 -3
0 0
"""
) == "5\n2", "single element"

# all equal values
assert run(
"""5
7 7 7 7 7
4
0 4
1 3 5
0 4
4 1
"""
) == "7\n7\n7", "all equal values"

# wrap-around update covering all elements
assert run(
"""4
10 20 30 40
2
2 1 -5
0 3
"""
) == "5", "full circular coverage"

# negative updates and queries
assert run(
"""3
5 5 5
3
0 2 -10
0 2
1 1
"""
) == "-5\n-5", "negative values"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素数组 |`5`， 然后`2`| 正确处理尽可能小的树 |
 | 所有相同的值 | 总是`7`| 更新不会意外影响不相关的段 |
 | 包装全阵列更新 |`5`| 循环分割逻辑|
 | 负面更新 |`-5`| 对负数的正确最小处理 |

 ## 边缘情况

 包装的查询不得被视为空。 

输入：```
5
1 2 3 4 5
1
3 1
```算法分裂`[3,1]`进入：```
[3,4]
[0,1]
```第一个查询返回`4`，第二个返回`1`，最终的答案是：```
min(4,1) = 1
```这正确地符合循环解释。 

负更新必须通过惰性值正确传播。 

输入：```
3
5 5 5
2
0 2 -10
0 2
```更新完全覆盖了根段，因此根最小值立即变为`-5`， 和`lazy[root]`商店`-10`。 

后面的查询从根读取已经正确的最小值，而不需要访问每个叶子。 输出是：```
-5
```包装的更新可能覆盖整个数组。 

输入：```
4
10 20 30 40
2
2 1 -5
0 3
```更新分为：```
[2,3]
[0,1]
```它们一起覆盖每个索引一次。 

数组变为：```
[5,15,25,35]
```最终最小查询返回`5`。 

这种情况证实，即使包装间隔跨越整个数组，分割包装范围也能保持正确性。
