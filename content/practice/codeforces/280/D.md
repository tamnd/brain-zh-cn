---
title: "CF 280D - k-最大子序列和"
description: "我们维护一个随时间变化的数组。 有两种操作。 一次操作更新一个位置。 另一个要求通过在给定区间 [l, r] 内选择最多 k 个成对不相交子数组来获得最大总和。"
date: "2026-06-05T08:49:07+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "flows", "graphs", "implementation"]
categories: ["algorithms"]
codeforces_contest: 280
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 172 (Div. 1)"
rating: 2800
weight: 280
solve_time_s: 147
verified: true
draft: false
---

[CF 280D - k-最大子序列和](https://codeforces.com/problemset/problem/280/D)

 **评分：** 2800
 **标签：** 数据结构、流程、图表、实现
 **求解时间：** 2m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个随时间变化的数组。 

有两种操作。 一次操作更新一个位置。 另一个要求选择最多可获得的最大总和`k`给定区间内的成对不相交子数组`[l, r]`。 

这句话“至多`k`” 至关重要。我们永远不会被迫承担负贡献。如果每个可能的子数组都有负和，则正确答案是`0`，通过完全不选择线段获得。 

数组长度达到`10^5`，并且最多有`10^5`运营。 查询间隔几乎可以覆盖整个数组。 扫描每个查询的时间间隔的解决方案是不可能的。 甚至`O(n)`每次操作需要大约`10^10`在最坏的情况下工作。 

第二个重要的观察结果是`k ≤ 20`。 间隔可能很大，但允许我们选择的段数却很小。 这种不对称性是解决问题的关键。 

一些边缘情况使问题比标准最大子数组查询更加棘手。 

考虑：```
[-5, -2, -7]
k = 3
```答案是`0`， 不是`-2`。 始终准确选择的解决方案`k`段将会失败。 

考虑：```
[9, -8, 9, -1, -1, -1, 9, -8, 9]
k = 2
```取两个单独最好的正块给出`9 + 9 = 18`，但最佳答案是`25`，通过一些负值连接得到。 本地选择不起作用。 

考虑：```
[10, -100, 10]
k = 1
```答案是`10`， 不是`20`。 当只允许一个段时，不能独立取两个正值。 

更新带来了另一个挑战。 预先计算每个区间的答案是不可能的，因为单个修改可能会影响多个区间。 

最终的解决方案必须有效地支持区间优化和点更新。 

## 方法

 最直接的方法是在每个查询间隔上动态编程。 

假设一个查询询问`[l, r]`。 我们最多可以运行经典DP来进行选择`k`该区间内不相交的子数组。 对于长度的区间`m`，这大约需要`O(mk)`时间。 

DP 是正确的，因为它明确跟踪已打开和关闭的段数。 不幸的是，在最坏的情况下`m = 10^5`最多有`10^4`此类查询。 即使与`k ≤ 20`，这大致变成```
10^4 × 10^5 × 20 = 2 × 10^10
```运营。 

我们需要一种无需扫描区间即可回答区间查询的方法。 

关键的观察结果来自最大不相交子阵列问题和最小成本/最大成本流之间众所周知的减少。 

将每个数组元素想象为一条边，其利润等于其值。 选择子数组对应于通过这些利润边的连续块发送一个流量单位。 最多限制我们自己`k`子数组成为容量限制`k`。 

对于固定间隔，答案最多变为发送的最大成本`k`流量单位。 

在我们利用两个事实之前，这听起来仍然很昂贵。 

第一的，`k`最多是很小`20`。 

其次，与区间对应的图形非常结构化。 每个增广路径精确对应于当前残差网络中的最大和子数组。 

残差网络操作可以使用支持以下功能的线段树来实现：

 1.最大子数组和查询。 
2.点更新。 
3. 对整个选定的子数组求反。 

找到当前最佳子数组后，我们增加一个流量单位。 在残差图中，这相当于反转所选段内每个元素的符号。 然后我们再次搜索。 

这正是最大成本流的经典连续最短路径解释。 

存储最大子数组信息的线段树可以找到最佳线段`O(log n)`。 否定整个段是通过惰性传播来处理的。 因为至多`k ≤ 20`需要扩充，每个查询仅花费`O(k log n)`。 

更新是同一线段树中的普通点修改。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的暴力 DP | O((r-l+1)k) | O((r-l+1)k) | O(r-l+1) | 太慢了 |
 | 线段树+流程解读| 每次查询 O(k log n)，更新 O(log n) | O(n) | 已接受 |

 ## 算法演练

 公认的解决方案使用最大子数组结构的经典线段树表示以及流量减少。 

每个线段树节点存储足够的信息来回答最大子数组查询，并且还存储足够的信息来支持符号反转。 

对于每个细分市场，我们维护：

 - 总金额。 
- 最佳前缀和。 
- 最佳后缀和。 
- 最佳子数组和。 

我们还维护相应的最小版本，因为求反会交换最大值和最小值。 

### 1.构建线段树

 对于包含值的叶子`x`，最大和最小结构都是立即已知的。 

使用标准最大子数组公式合并内部节点。 

### 2. 处理点更新

 当`a[i]`变成`val`，更新相应的叶子并重新计算所有祖先。 

之后线段树保持一致`O(log n)`工作。 

### 3. 开始回答查询`(l,r,k)`流量解释表明，我们重复发送一个以上的流量单位，而最佳增强路径具有正成本。 

最初，残差网络由当前数组值表示。 

### 4. 找到里面最大和的子数组`[l,r]`使用线段树，获取区间的最大子数组信息。 

这给出了最佳段及其端点的值。 

### 5. 如果值为非正则停止

 该问题允许选择少于`k`段。 

一旦最佳可用细分市场具有价值`≤ 0`，剩余的每一条增广路径都是无利可图的，所以答案不能增加。 

### 6. 将分段值添加到答案中

 这对应于再发送一个流量单位。 

### 7. 否定所选段

 在残差图中，使用线段引入了具有相反成本的反向边。 

线段树实现通过将所选子数组的每个元素乘以来实现完全相同的效果`-1`。 

惰性传播使得这个操作`O(log n)`。 

### 8.重复最多`k`次

 每次迭代都会在残差图中找到下一个最佳增广路径。 

### 9. 恢复所有修改的段

 查询不得永久更改数组。 

查询期间被否定的每个段在最后都会被再次否定，恢复原始状态。 

### 为什么它有效

 流量的减少将选择问题转化为`k`将不相交的子数组分解为具有单位增强的最大成本流问题。 

在残差网络中，最大成本增广路径恰好对应于当前的最大和子阵列。 增加一个流量单位会逆转该路径上的成本，这通过否定所选段来表示。 

最大成本流算法中的连续增强总是会产生最优流。 由于每个增强都是通过上面的线段树操作精确实现的，因此所选线段的序列与流算法产生的序列相同。 

当最佳可用利润变为负数时停止是正确的，因为额外的增强不会增加总成本。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10 ** 18

class Node:
    __slots__ = (
        "sum",
        "mx",
        "mxl",
        "mxr",
        "mn",
        "mnl",
        "mnr",
        "mx_pos",
        "mxl_pos",
        "mxr_pos",
        "mn_pos",
        "mnl_pos",
        "mnr_pos",
    )

    def __init__(self):
        self.sum = 0

        self.mx = self.mxl = self.mxr = -INF
        self.mn = self.mnl = self.mnr = INF

        self.mx_pos = (0, 0)
        self.mxl_pos = (0, 0)
        self.mxr_pos = (0, 0)

        self.mn_pos = (0, 0)
        self.mnl_pos = (0, 0)
        self.mnr_pos = (0, 0)

def merge(a, b):
    res = Node()

    res.sum = a.sum + b.sum

    if a.mxl >= a.sum + b.mxl:
        res.mxl = a.mxl
        res.mxl_pos = a.mxl_pos
    else:
        res.mxl = a.sum + b.mxl
        res.mxl_pos = (a.mxl_pos[0], b.mxl_pos[1])

    if b.mxr >= b.sum + a.mxr:
        res.mxr = b.mxr
        res.mxr_pos = b.mxr_pos
    else:
        res.mxr = b.sum + a.mxr
        res.mxr_pos = (a.mxr_pos[0], b.mxr_pos[1])

    res.mx = a.mx
    res.mx_pos = a.mx_pos

    if b.mx > res.mx:
        res.mx = b.mx
        res.mx_pos = b.mx_pos

    cross = a.mxr + b.mxl
    if cross > res.mx:
        res.mx = cross
        res.mx_pos = (a.mxr_pos[0], b.mxl_pos[1])

    if a.mnl <= a.sum + b.mnl:
        res.mnl = a.mnl
        res.mnl_pos = a.mnl_pos
    else:
        res.mnl = a.sum + b.mnl
        res.mnl_pos = (a.mnl_pos[0], b.mnl_pos[1])

    if b.mnr <= b.sum + a.mnr:
        res.mnr = b.mnr
        res.mnr_pos = b.mnr_pos
    else:
        res.mnr = b.sum + a.mnr
        res.mnr_pos = (a.mnr_pos[0], b.mnr_pos[1])

    res.mn = a.mn
    res.mn_pos = a.mn_pos

    if b.mn < res.mn:
        res.mn = b.mn
        res.mn_pos = b.mn_pos

    cross = a.mnr + b.mnl
    if cross < res.mn:
        res.mn = cross
        res.mn_pos = (a.mnr_pos[0], b.mnl_pos[1])

    return res

class SegTree:
    def __init__(self, arr):
        self.n = len(arr) - 1
        self.t = [Node() for _ in range(self.n * 4 + 5)]
        self.lazy = [False] * (self.n * 4 + 5)
        self.build(1, 1, self.n, arr)

    def apply(self, p):
        node = self.t[p]

        node.sum = -node.sum

        node.mx, node.mn = -node.mn, -node.mx
        node.mxl, node.mnl = -node.mnl, -node.mxl
        node.mxr, node.mnr = -node.mnr, -node.mxr

        node.mx_pos, node.mn_pos = node.mn_pos, node.mx_pos
        node.mxl_pos, node.mnl_pos = node.mnl_pos, node.mxl_pos
        node.mxr_pos, node.mnr_pos = node.mnr_pos, node.mxr_pos

        self.lazy[p] ^= True

    def push(self, p):
        if self.lazy[p]:
            self.apply(p << 1)
            self.apply(p << 1 | 1)
            self.lazy[p] = False

    def build(self, p, l, r, arr):
        if l == r:
            x = arr[l]
            node = self.t[p]

            node.sum = x

            node.mx = node.mxl = node.mxr = x
            node.mn = node.mnl = node.mnr = x

            node.mx_pos = node.mxl_pos = node.mxr_pos = (l, l)
            node.mn_pos = node.mnl_pos = node.mnr_pos = (l, l)
            return

        m = (l + r) >> 1
        self.build(p << 1, l, m, arr)
        self.build(p << 1 | 1, m + 1, r, arr)

        self.t[p] = merge(self.t[p << 1], self.t[p << 1 | 1])

    def update_point(self, p, l, r, idx, val):
        if l == r:
            node = self.t[p]

            node.sum = val

            node.mx = node.mxl = node.mxr = val
            node.mn = node.mnl = node.mnr = val

            node.mx_pos = node.mxl_pos = node.mxr_pos = (l, l)
            node.mn_pos = node.mnl_pos = node.mnr_pos = (l, l)
            return

        self.push(p)

        m = (l + r) >> 1
        if idx <= m:
            self.update_point(p << 1, l, m, idx, val)
        else:
            self.update_point(p << 1 | 1, m + 1, r, idx, val)

        self.t[p] = merge(self.t[p << 1], self.t[p << 1 | 1])

    def update_range(self, p, l, r, ql, qr):
        if ql <= l and r <= qr:
            self.apply(p)
            return

        self.push(p)

        m = (l + r) >> 1

        if ql <= m:
            self.update_range(p << 1, l, m, ql, qr)
        if qr > m:
            self.update_range(p << 1 | 1, m + 1, r, ql, qr)

        self.t[p] = merge(self.t[p << 1], self.t[p << 1 | 1])

    def query(self, p, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.t[p]

        self.push(p)

        m = (l + r) >> 1

        if qr <= m:
            return self.query(p << 1, l, m, ql, qr)
        if ql > m:
            return self.query(p << 1 | 1, m + 1, r, ql, qr)

        left = self.query(p << 1, l, m, ql, qr)
        right = self.query(p << 1 | 1, m + 1, r, ql, qr)

        return merge(left, right)

def solve():
    n = int(input())
    arr = [0] + list(map(int, input().split()))

    seg = SegTree(arr)

    m = int(input())
    ans = []

    for _ in range(m):
        q = list(map(int, input().split()))

        if q[0] == 0:
            _, idx, val = q
            seg.update_point(1, 1, n, idx, val)
        else:
            _, l, r, k = q

            changed = []
            cur = 0

            for _ in range(k):
                node = seg.query(1, 1, n, l, r)

                if node.mx <= 0:
                    break

                cur += node.mx

                x, y = node.mx_pos
                changed.append((x, y))

                seg.update_range(1, 1, n, x, y)

            for x, y in changed:
                seg.update_range(1, 1, n, x, y)

            ans.append(str(cur))

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```线段树存储最大子数组和最小子数组信息。 最小版本是必要的，因为否定一个段会将最大值变为最小值，反之亦然。 如果不存储两者，惰性符号反转将变得不可能。 

这`apply()`功能是最微妙的部分。 求反会改变每个和的符号。 求反后的最大子数组与前一个最小子数组的负数完全对应。 该代码交换最大和最小结构，同时否定它们的值。 

在查询期间，我们重复提取最佳子数组，添加其贡献，否定它，然后继续。 每个否定间隔都会被记住。 完成后，所有这些间隔再次被否定，因此全局数组返回到其原始状态。 

该实现始终使用基于 1 的索引，因为区间端点直接存储在树节点内。 这避免了许多相差一的错误。 

## 工作示例

 ### 示例 1

 输入：```
9 -8 9 -1 -1 -1 9 -8 9
k = 2
```| 迭代 | 最佳片段| 段总和| 运行答案|
 | --- | --- | --- | --- |
 | 1 | [1,7]| 16 | 16 16 | 16
 | 2 | [9,9]| 9 | 25 | 25

 答案就变成了`25`。 

这个例子说明了为什么贪婪地获取明显为正的块是不够的。 最佳第一段故意包含几个负值，因为这会产生更大的总贡献。 

### 示例 2

 输入：```
-5 -2 -7
k = 3
```| 迭代 | 最佳分段总和| 行动|
 | --- | --- | --- |
 | 1 | -2 | 停止|

 答案是`0`。 

这证明了“至多`k`“条件。一旦最佳可用段为非正数，算法就会停止。

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(log n) 更新，O(k log n) 查询 | 每次扩充都需要一次区间查询和一次范围否定 |
 | 空间| O(n) | 线段树和惰性数组|

 自从`k ≤ 20`，每个查询仅执行少量恒定数量的线段树操作。 和`n, m ≤ 10^5`，这很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    old_stdout = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = old_stdout
    return out.getvalue().strip()

# provided sample
assert run(
"""9
9 -8 9 -1 -1 -1 9 -8 9
3
1 1 9 1
1 1 9 2
1 4 6 3
"""
) == "17\n25\n0", "sample"

# minimum size
assert run(
"""1
5
1
1 1 1 1
"""
) == "5"

# all negative
assert run(
"""3
-1 -2 -3
1
1 1 3 5
"""
) == "0"

# update then query
assert run(
"""3
1 2 3
2
0 2 -10
1 1 3 2
"""
) == "4"

# off-by-one interval
assert run(
"""5
1 2 3 4 5
1
1 5 5 1
"""
) == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单一正元素 | 5 | 最小数组大小 |
 | 所有负值 | 0 | 选择零段|
 | 查询前更新 | 4 | 点更新正确性 |
 | 间隔`[5,5]`| 5 | 边界处理 |
 | 官方样品| 17,25,0 | 17,25,0 | 核心功能|

 ## 边缘情况

 考虑：```
3
-5 -2 -7
1
1 1 3 3
```最大子数组查询返回`-2`。 由于该值为非正数，因此增强循环立即终止。 没有选择任何段，输出变为`0`。 这符合允许选择零段的要求。 

考虑：```
3
10 -100 10
1
1 1 3 1
```最好的子数组是第一个或第三个元素，其值为`10`。 由于只允许一种扩充，因此算法在选择一个段后停止。 它永远不会通过巨大的负差距将两个正值结合起来。 

考虑：```
5
1 2 3 4 5
2
0 5 -10
1 4 5 1
```更新后，间隔`[4,5]`变成`[4,-10]`。 线段树重新计算所有受影响的祖先。 后续查询返回`4`，从单元素段获得`[4,4]`。 这证实了更新通过最大子数组结构正确传播。 

考虑：```
5
5 -1 5 -1 5
1
1 1 5 10
```虽然`k=10`，仅存在有限数量的有利可图的增强。 当正贡献耗尽后，最佳残差段变为非正，算法提前停止。 答案仍然是最优的，因为额外的段不会增加总和。
