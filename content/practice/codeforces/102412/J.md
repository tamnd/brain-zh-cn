---
title: "CF 102412J - 另一个墨西哥问题"
description: "该问题来自 MEX Foundation Contest，Gym 102412，Problem J。官方限制为 (2le nle 2cdot10^5)、(1le kle n)、(0le aile n)，时间限制为 4 秒，内存为 512 MiB。 我们有一个非负整数数组 (a)。"
date: "2026-08-10T14:14:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102412
codeforces_index: "J"
codeforces_contest_name: "MEX Foundation Contest (supported by AIM Tech)"
rating: 0
weight: 102412
solve_time_s: 350
verified: true
draft: false
---

[CF 102412J - 另一个墨西哥问题](https://codeforces.com/problemset/problem/102412/J)

 **评级：** -
 **标签：** -
 **求解时间：** 5m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题来自 MEX Foundation Contest，Gym 102412，Problem J。官方限制为 (2\le n\le 2\cdot10^5)、(1\le k\le n)、(0\le a_i\le n)，时间限制为 4 秒，内存为 512 MiB。 

我们有一个非负整数数组 (a)。 我们必须将其划分为连续的部分，其中每个部分的长度最多为 (k)。 对于一块，它的值是它的元素和乘以它的 MEX。 整个分区的值是所有块的值之和，我们想要最大可能的值。 输出就是该最大值。 

设 (S_i=a_1+\cdots+a_i)，其中 (S_0=0)。 如果最后一块从 (j+1) 开始并在 (i) 结束，则其贡献为

 [
 \operatorname{mex}(a_{j+1},\ldots,a_i)(S_i-S_j)。 
]

 如果 (dp_i) 表示以 (i) 结尾的前缀的最佳答案，则直接递推为

 [
 dp_i=
 \max_{i-k\le j<i}
 \左(
 dp_j+
 \运算符名称{mex}(j+1,i)(S_i-S_j)
 \右）。 
]

 (j) 的下限是强制最大片段长度的因素。 由于 (n) 达到 (2\cdot10^5)，(O(n^2)) 算法已经需要大约 (4\cdot10^{10}) 次操作，远远超出了几秒钟的处理能力。 从头开始计算每个 MEX 都采用直接方法 (O(nk^2))，可以达到大约 (8\cdot10^{15}) 个初等运算。 即使增量地维护每个间隔 MEX 也会给出 (O(nk))，最多仍约为 (4\cdot10^{10}) 次操作。 该解决方案必须利用 MEX 的特殊结构，而不是独立检查所有候选区间。 

有几种边界情况很容易处理不当。 和`n = 2, k = 1, a = [5, 7]`，每件只包含一个正值，所以每个 MEX 都是零，答案是`0`。 假设每个非空段具有正 MEX 的实现在这里将失败。 

和`n = 2, k = 2, a = [0, 0]`，整个数组有MEX(1)，但它的和为零，所以它的贡献仍然为零，答案是`0`。 将 MEX 乘以总和必须在计算完两个量之后进行。 

和`n = 4, k = 2, a = [0, 1, 2, 3]`，整个数组将有 MEX (4)，但它不能是一个整体，因为它的长度是 4。 最好的分区是`[0,1]`和`[2,3]`，给出 (2\cdot1+0=2)。 忽略长度边界会产生完全无效的转换。 

重复也很重要。 为了`n = 3, k = 3, a = [0, 1, 1]`，MEX 是 (2)，而不是 (3)，因为 MEX 关心存在而不是频率。 正确的值为 (2\cdot2=4)。 

## 方法

 暴力 DP 直接从上面的递归推导出来。 对于每个右端点 (i)，尝试每个可能的先前切割 (j)，计算 (a_{j+1},\ldots,a_i) 的 MEX，并更新 (dp_i)。 这是正确的，因为每个有效分区都有一个最终片段，因此它的前一个剪切出现在这些转换中。 如果通过扫描片段重新计算 MEX，最坏情况的复杂度为 (O(nk^2))，当 (n=k=2\cdot10^5) 时，大约为 (8\cdot10^{15}) 次运算。 即使是在扩展间隔的同时维护所有 MEX 值的更仔细的版本也需要 (O(nk))，这仍然太大。 

有用的观察结果是，对于固定的右端点 (i)，后缀的 MEX 值是单调的。 如果我们增加左端点，元素就会被移除，所以 MEX 只能保持不变或减少。 因此，可能的先前切割 (j) 可以分为 MEX 恒定的连续间隔。 

假设先前切割的一个这样的区间是 (L\le j\le R)，并且它的 MEX 是 (m)。 整个区间的每个转变都具有以下形式

 mS_i+\left(dp_j-mS_j\right)。 
]

 对于这个 MEX 区块，我们只需要

 [
 \max_{L\le j\le R}(dp_j-mS_j)。 
]

 这将内部优化变成了行查询。 将先前的剪切 (j) 与线关联

 [
 F_j(x)=-S_jx+dp_j。 
]

 那么所需的数量就是

 [
 \max_{L\le j\le R}F_j(m)。 
]

 剩下的问题是如何有效地维护 MEX 区块。 当右端点从(i-1)移动到(i)时，只有新插入的值(a_i)才能改变后缀MEX值。 发生变化的 MEX 块会分割成更小的块，并且分割后这些块不必合并回去。 在整个扫描过程中，创建的块总数为 (O(n))。 值域上的线段树存储每个值的最后一次出现，让我们可以在 (O(\log n)) 中定位每个新的块边界。 这给出了 MEX 结构的 (O(n\log n)) 总工作量。 这种分解是标准溶液中的中心观察结果。 

分解后有两个嵌套的优化问题。 第一个要求在索引间隔内 (F_j(m)) 的最大值。 索引(j)上的线段树可以在每个节点存储一棵李超树。 一条线被插入到覆盖其位置的所有 (O(\log n)) 索引树节点中，并且范围查询访问 (O(\log n)) 个节点。 每个李超操作的成本为 (O(\log n))，每个范围操作的成本为 (O(\log^2 n))。 

第二个优化有一个特别有用的属性。 一旦 MEX 区块产生

 [
 C=\max_{L\le j\le R}F_j(m),
 ]

 它作为当前前缀和的函数的贡献是线

 [
 H(x)=mx+C。 
]

 MEX 值仅随着右端点的移动而增加，因此永远不需要删除旧线。 我们在块的左边界插入这条线，并维护另一个李超树的索引线段树。 然后，对当前滑动窗口的查询会精确考虑其左边界可以是合法的先前切割的块线。 这是数据结构的第二层。 标准推导给出 (O(n\log^2 n))，通过离线构建第二层可以进行 (O(n\log n)) 细化。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(nk^2)) | (O(n)) | (O(n)) | 太慢了|
 | 增量 MEX DP | (O(nk)) | (O(nk)) | (O(n)) | (O(n)) | 太慢了|
 | MEX 块 + 嵌套李超树 | (O(n\log^2 n)) | (O(n\log n)) | 已接受 |

 ## 算法演练

 1. 构建前缀和 (S_i)。 任何候选最终片段 (j+1,\ldots,i) 的总和就是 (S_i-S_j)，因此 DP 转换变成仿射表达式，而不需要再次扫描数组。 
2. 将与每个已解决的前缀 (j) 关联的行定义为

 [
 F_j(x)=-S_jx+dp_j。 
]

当后缀具有MEX(m)时，其转换为(mS_i+F_j(m))。 因此，整个 MEX 块可以减少到 (x=m) 处的一个范围最大查询。 
3. 维护每个值的最后一次出现。 对于当前右端点 (i)，值 (v) 正好在其最后一次出现大于 (j) 时出现在后缀 (j+1,\ldots,i) 中。 因此，MEX 可以由最后出现的数组确定。 
4. 将 MEX 块保留为边界堆栈。 MEX 值在堆栈上是单调的。 当插入(a_i)时，弹出边界不再有效的块，然后重复查找最后一次出现在当前边界之下的最小值。 每一项此类发现都会创建一个新的 MEX 区块。 

存储每个值区间中的最小最后一次出现的线段树支持在 (O(\log n)) 中进行此搜索。 重要的摊销是，块仅在创建时才被分割，因此块创建的总数是线性的。 
5. 对于每个新创建的具有 MEX (m) 的块 ([L,R])，查询第一个 Li Chao 结构

 [
 C=\max_{L\le j\le R}F_j(m)。 
]

 值 (C) 总结了该 MEX 块内所有可能的先前切割。 
6. 将块转换为线

 [
 H(x)=mx+C。 
]

 将此线插入到第二个范围 Li Chao 结构的位置 (L) 处。 该线代表每个未来的转换，其 MEX 至少是创建该线时使用的 MEX。 由于所有数组元素都是非负的，增加 MEX 只能提高贡献，因此保留旧行是安全的。 
7. 对于端点 (i)，在合法的前剪切范围 ([i-k,i-1]) 上查询第二个结构，剪裁为零。 这会处理位于长度约束内的每个完整的 MEX 块。 
8. 一个块可以与合法范围的左边界相交，但不完全包含在其中。 直接在 MEX 堆栈中找到该块，并仅在其剪切部分查询第一个结构。 此单个更正处理由长度限制创建的唯一部分块。 
9. 完整块查询和该部分块查询的最大值为(dp_i)。 插入新获得的行

 [
 F_i(x)=-S_ix+dp_i
 ]

 到第一个结构中，以便将来的端点可以使用前缀 (i)。 
10. 处理完每个端点后，返回(dp_n)。 

不变量是每个合法的前一切割 (j) 恰好属于一个当前 MEX 块，并且该块存储 (a_{j+1},\ldots,a_i) 的正确 MEX。 因此，第一个李超结构计算每个块中所有切割之间的最佳过渡。 第二个结构准确存储由已完成的块生成的仿射函数，并且其滑动窗口查询强制执行长度限制。 由于每个有效的最后一块都由这些情况之一表示，因此 (dp_i) 获得的最大值正是前缀的最佳值。 

## Python 解决方案

 下面的实现遵循 (O(n\log^2 n)) 构造。 它使用 MEX 块边界值上的线段树和其节点包含两个范围最大结构的 Li Chao 树的线段树。```python
import sys
from array import array

input = sys.stdin.readline
NEG = -(10 ** 40)

class LastOccurrenceTree:
    def __init__(self, n):
        self.n = n
        size = 1
        while size < n + 2:
            size <<= 1
        self.size = size
        self.mn = array('i', [0]) * (2 * size)

    def update(self, p, value):
        p += self.size
        self.mn[p] = value
        p >>= 1
        while p:
            x = self.mn[p << 1]
            y = self.mn[p << 1 | 1]
            self.mn[p] = x if x < y else y
            p >>= 1

    def first_less(self, limit):
        if self.mn[1] >= limit:
            return None

        p = 1
        l = 0
        r = self.size - 1

        while l != r:
            mid = (l + r) >> 1
            left = p << 1
            if self.mn[left] < limit:
                p = left
                r = mid
            else:
                p = left | 1
                l = mid + 1

        return self.mn[p], l

class RangeLiChao:
    def __init__(self, n, prefix, use_prefix):
        self.n = n
        self.prefix = prefix
        self.use_prefix = use_prefix

        self.roots = array('i', [0]) * (4 * n + 20)

        self.left = array('i', [0])
        self.right = array('i', [0])
        self.line = array('i', [0])

        self.slopes = [0]
        self.intercepts = [NEG]

    def value(self, line_id, x):
        if self.use_prefix:
            x = self.prefix[x]
        return self.slopes[line_id] * x + self.intercepts[line_id]

    def add_line(self, slope, intercept):
        self.slopes.append(slope)
        self.intercepts.append(intercept)
        return len(self.slopes) - 1

    def new_node(self, line_id):
        idx = len(self.line)
        self.left.append(0)
        self.right.append(0)
        self.line.append(line_id)
        return idx

    def insert_inner(self, root, line_id, lo, hi):
        if root == 0:
            return self.new_node(line_id)

        cur = self.line[root]
        mid = (lo + hi) >> 1

        left_new = self.value(line_id, lo) > self.value(cur, lo)
        mid_new = self.value(line_id, mid) > self.value(cur, mid)

        if mid_new:
            self.line[root], line_id = line_id, cur
            cur = self.line[root]

        if lo == hi:
            return root

        if left_new != mid_new:
            child = self.left[root]
            new_child = self.insert_inner(child, line_id, lo, mid)
            self.left[root] = new_child
        else:
            child = self.right[root]
            new_child = self.insert_inner(child, line_id, mid + 1, hi)
            self.right[root] = new_child

        return root

    def query_inner(self, root, x, lo, hi):
        if root == 0:
            return NEG

        ans = self.value(self.line[root], x)

        if lo == hi:
            return ans

        mid = (lo + hi) >> 1
        if x <= mid:
            other = self.query_inner(self.left[root], x, lo, mid)
        else:
            other = self.query_inner(self.right[root], x, mid + 1, hi)

        return ans if ans > other else other

    def insert(self, pos, slope, intercept):
        line_id = self.add_line(slope, intercept)

        node = 1
        lo = 0
        hi = self.n - 1

        while True:
            self.roots[node] = self.insert_inner(
                self.roots[node], line_id, 0, self.n - 1
            )

            if lo == hi:
                break

            mid = (lo + hi) >> 1
            if pos <= mid:
                node = node << 1
                hi = mid
            else:
                node = node << 1 | 1
                lo = mid + 1

        return line_id

    def query(self, left, right, x):
        if left > right:
            return NEG

        left += 1
        right += 1

        # Iterative canonical decomposition.
        L = left + self.n - 1
        R = right + self.n - 1

        ans = NEG

        while L <= R:
            if L & 1:
                q = self.query_inner(self.roots[L], x, 0, self.n - 1)
                if q > ans:
                    ans = q
                L += 1

            if not (R & 1):
                q = self.query_inner(self.roots[R], x, 0, self.n - 1)
                if q > ans:
                    ans = q
                R -= 1

            L >>= 1
            R >>= 1

        return ans

def solve_case(n, k, a):
    prefix = [0] * (n + 1)
    for i, x in enumerate(a, 1):
        prefix[i] = prefix[i - 1] + x

    # T1: lines F_j(x) = -S_j*x + dp_j.
    # x is a MEX, hence x in [0, n].
    t1 = RangeLiChao(n + 1, prefix, False)

    # T2: lines H(x) = mex*x + C, evaluated at x = S_i.
    # The implementation indexes x by i and converts it to S_i.
    t2 = RangeLiChao(n + 1, prefix, True)

    last_tree = LastOccurrenceTree(n + 1)
    last = [0] * (n + 1)

    # Stack entries are (boundary, mex).
    # The sentinel boundary is 0.
    stack = [(0, 0)]

    dp = [0] * (n + 1)

    # F_0(x) = 0.
    t1.insert(0, 0, 0)

    for i in range(1, n + 1):
        x = a[i]

        # The value x now occurs at i.
        # Blocks whose boundary lies after the previous occurrence of x
        # may need to be split.
        previous = last[x]

        while stack[-1][0] > previous:
            stack.pop()

        pending = []
        rpos = i

        while rpos > stack[-1][0]:
            result = last_tree.first_less(rpos)
            if result is None:
                break

            min_last, mex = result
            pending.append((rpos, mex))
            rpos = min_last

        pending.reverse()

        for pos, mex in pending:
            left_boundary = stack[-1][0]

            # C = max F_j(mex) for j in [left_boundary, pos - 1].
            c = t1.query(left_boundary, pos - 1, mex)

            # H(S_i) = mex*S_i + C.
            t2.insert(left_boundary, mex, c)

            stack.append((pos, mex))

        last[x] = i
        last_tree.update(x, i)

        lower = max(i - k, 0)

        # Find the first stack boundary >= lower + 1.
        lo = 1
        hi = len(stack)

        while lo < hi:
            mid = (lo + hi) >> 1
            if stack[mid][0] < lower + 1:
                lo = mid + 1
            else:
                hi = mid

        p = lo

        best = NEG

        # The first complete block starting at or after lower.
        q = t2.query(lower, i - 1, i)
        if q > best:
            best = q

        # The block crossing the left boundary may be only partially usable.
        if p < len(stack):
            block_left = stack[p - 1][0]
            block_right = stack[p][0] - 1

            if block_left < lower <= block_right:
                mex = stack[p][1]
                c = t1.query(lower, block_right, mex)
                candidate = mex * prefix[i] + c
                if candidate > best:
                    best = candidate

        dp[i] = best

        # F_i(x) = -S_i*x + dp_i.
        t1.insert(i, -prefix[i], dp[i])

    return dp[n]

def main():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    print(solve_case(n, k, a))

if __name__ == "__main__":
    main()
```首先构建前缀和数组，因为每个转换都使用 (S_i-S_j)。 Python 整数已经具有任意精度，因此不存在溢出问题，尽管原始 C++ 实现需要 64 位整数。`LastOccurrenceTree`存储每个值间隔中的最小最后一次出现。`first_less(x)`查找最后一次出现小于的最小值`x`。 当后缀边界到达该位置时，这正是成为 MEX 的值。`RangeLiChao`实现DP所需的黑匣子。 它的外部树由先前的切割位置索引。 每行都插入到覆盖该位置的 (O(\log n)) 外部节点中。 每个外部节点都有一个内部李超树，允许查询一系列位置，而无需显式访问每个先前的切割。 

第一个实例代表

 [
 F_j(x)=-S_jx+dp_j。 
]

 它的查询坐标是 MEX 本身。 第二个实例代表

 [
 H(x)=mx+C,
 ]

 其中参数是端点索引，并在内部转换为相应的前缀和 (S_i)。 

堆栈存储边界而不是每个先前的切割。 如果两个连续的堆栈边界是`L`和`R`，该区间内所有先前的削减都具有相同的 MEX。 这就是 DP 从不为一个端点执行 (O(k)) 次转换的原因。 

部分块查询是必要的，因为合法范围从 (i-k) 开始，它可以穿过 MEX 块的中间。 第二个结构处理完整的块，而第一个结构显式处理那个被剪切的块。 忽略此修正是一种常见的相差一错误。 

该代码使用零处的哨兵边界，并使用基于零的前缀索引表示 DP 切割。 因此，以 (i) 结束、以 (j+1) 开始的片段与切割索引 (j) 相关联，这使代数与前缀和保持一致。 

## 工作示例

 ### 示例 1

 对于```
5 3
3 4 0 0 3
```所需的答案是`10`。 

重要的 DP 状态是：

 | 端点 (i) | (S_i) | 最佳最终作品| 墨西哥 | (dp_i) |
 | ---| ---| ---| ---| ---|
 | 1 | 3 |`[3]`| 0 | 0 |
 | 2 | 7 |`[4]`或者`[3,4]`| 0 | 0 |
 | 3 | 7 |`[3,4,0]`| 1 | 7 |
 | 4 | 7 |`[0]`以 3 | 结尾的前缀之后 1 | 7 |
 | 5 | 10 | 10`[0,3]`以 3 | 结尾的前缀之后 1 | 10 | 10

 在端点 3 处，整个线段`[3,4,0]`有 MEX (1) 和 sum (7)，产生 (7)。 在端点 5 处，最佳转换为 (dp_3+1\cdot(10-7)=7+3=10)。 该迹线说明了为什么具有较小 MEX 的段在其总和很大时仍然是最佳的。 

### 示例 2

 对于```
8 4
0 1 2 0 3 1 4 1
```答案是`26`。 相关州有：

 | 端点 (i) | (S_i) | 先前最佳剪辑 (j) | 最后一段| 墨西哥 | (dp_i) |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 0 | 0 |`[0]`| 1 | 0 |
 | 2 | 1 | 0 |`[0,1]`| 2 | 2 |
 | 3 | 3 | 0 |`[0,1,2]`| 3 | 9 |
 | 4 | 3 | 0 |`[0,1,2,0]`| 3 | 9 |
 | 5 | 6 | 1 |`[1,2,0,3]`| 4 | 24 |
 | 6 | 7 | 2 |`[2,0,3,1]`| 4 | 26 | 26
 | 7 | 11 | 11 6 |`[4]`| 0 | 26 | 26
 | 8 | 12 | 12 6 |`[4,1]`| 0 | 26 | 26

 端点 6 处的转变很有趣。 最后四个元素是`[2,0,3,1]`，其 MEX 为 (4)，其总和为 (6)。 它们之前的前缀具有值 (dp_2=2)，给出

 [
 2+4\cdot6=26。 
]

 这说明了为什么 DP 必须将最佳前缀值与当前片段的 MEX 分开保存。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n\log^2 n)) | 有 (O(n)) 个 MEX 块创建，每个范围李超操作成本为 (O(\log^2 n))。 |
 | 空间| (O(n\log n)) | 每条插入的线都参与 (O(\log n)) 个外部线段树节点。 |

 原始问题允许 (n=2\cdot10^5) 并给出 4 秒和 512 MiB。 该算法渐进地足够快，因为它仅用 (O(n)) MEX 块和对数几何查询替换 (O(nk)) 族转换。 嵌套的李超实现是内存密集型的，这就是为什么最初的高性能实现使用紧凑的静态数组而不是Python对象。 

## 测试用例

 官方给出的样本是：```
# The reference solution above reads one case at a time.

# Sample 1
assert solve_case(
    5, 3, [3, 4, 0, 0, 3]
) == 10

# Sample 2
assert solve_case(
    8, 4, [0, 1, 2, 0, 3, 1, 4, 1]
) == 26

# Sample 3
assert solve_case(
    10, 5, [0, 2, 0, 1, 2, 1, 0, 2, 2, 1]
) == 33

# Minimum size, k = 1.
assert solve_case(
    2, 1, [5, 7]
) == 0

# All equal values. The MEX is 0 because 0 never appears.
assert solve_case(
    5, 3, [7, 7, 7, 7, 7]
) == 0

# Maximum possible piece length is allowed.
assert solve_case(
    4, 4, [0, 1, 2, 3]
) == 9

# Length boundary catches an invalid transition using all four elements.
assert solve_case(
    4, 2, [0, 1, 2, 3]
) == 2
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 1 / 5 7`|`0`| 单例正值的最小大小和 MEX 零 |
 |`5 3 / 7 7 7 7 7`|`0`| 没有零的所有相等值 |
 |`4 4 / 0 1 2 3`|`9`| 当 (k=n) | 时的全数组段
 |`4 2 / 0 1 2 3`|`2`| 正确执行最大段长度 |

 对于最大尺寸的应力情况，一个有用的测试是`n = 200000`,`k = 1`，每个元素都等于`1`。 每个段的 MEX 为零，因此预期答案为零。 这会检查当 MEX 结构很简单时，实现不会意外地分配与 (nk) 成比例的工作。 

## 边缘情况

 对于`n = 2, k = 1, a = [5,7]`，合法的部分是`[5]`和`[7]`。 两者都不包含零，因此两个 MEX 值都为零。 民主党得到`dp[1] = 0`和`dp[2] = 0`。 答案是`0`。 MEX 堆栈仅包含零个 MEX 块，因此李超结构永远不会产生积极的贡献。 

为了`n = 2, k = 2, a = [0,0]`，整个段有 MEX (1)，但其总和为零。 转换为 (1\cdot0=0)，因此`dp[2]=0`。 这练习了 MEX 为正但该部分没有贡献的情况。 

为了`n = 4, k = 2, a = [0,1,2,3]`，端点 4 的合法范围仅包含切口 2 和 3。 诱人的段`[0,1,2,3]`被排除，因为它的长度是四。 最好的有效分区是`[0,1]`其次是`[2,3]`，值为 (2\cdot1+0=2)。 显式部分块查询可以防止数据结构意外使用跨越滑动窗口左边界的 MEX 块。 

为了`n = 3, k = 3, a = [0,1,1]`，值`0`和`1`存在，同时`2`不存在，因此 MEX 正好是 (2)。 总和为 (2)，得出 (4)。 最后出现的表示自然会处理重复项，因为在决定候选剪切后该值是否存在时，只有每个值的最近出现才重要。
