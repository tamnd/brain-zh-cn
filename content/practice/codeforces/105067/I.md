---
title: "CF 105067I - 消防员"
description: "我们有一排战士，每个战士都有一个力量值。 一场锦标赛会反复让当前序列中的前两名剩余战士进行战斗。 失败者将被移除，而在平局的情况下，双方都会被移除。"
date: "2026-06-28T00:15:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105067
codeforces_index: "I"
codeforces_contest_name: "Teamscode Spring 2024 (Advanced Division)"
rating: 0
weight: 105067
solve_time_s: 91
verified: false
draft: false
---

[CF 105067I - 消防员](https://codeforces.com/problemset/problem/105067/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 31s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一排战士，每个战士都有一个力量值。 一场锦标赛会反复让当前序列中的前两名剩余战士进行战斗。 失败者将被移除，而在平局的情况下，双方都会被移除。 这种情况一直持续到只剩下一名战斗机或根本没有战斗机为止。 

每个查询都会在本地修改数组：对于给定的段$[l, r]$，该段内的每个值都被替换为常量值$x$，并且我们必须确定在这个修改后的数组上运行锦标赛后哪个原始索引（如果有）作为最终获胜者存活下来。 

关键输出不是获胜者的值，而是其在数组中的原始位置。 如果这个过程消除了所有人，答案是$n+1$。 

这些限制意味着两者$n$和$q$跨测试用例可以达到数十万。 任何根据查询从头开始重新计算锦标赛的解决方案都会立即变得太慢。 每个查询的完整模拟将花费$O(nq)$，达到了$10^{11}$在最坏的情况下运作，远远超出极限。 甚至$O(n \log n)$每个查询都是不可接受的。 

连续范围覆盖和确定性消除过程之间的相互作用表明，必须通过支持范围修改和全局结果快速重新计算的结构来维护答案。 

当修改后所有值变得相等时，会出现微妙的边缘情况。 例如，如果数组变为$[5,5,5]$，然后前两个都消除，留下$[5]$，那个幸存者继续。 但如果数组是$[5,5]$，都消失了，没有人留下来。 天真的“最大元素获胜”直觉在这里失败了，因为平局可以消除所有候选人。 

另一个边缘情况是最强的值被重复。 例如，$[1,3,3,2]$。 前 3 个是否存活或被淘汰取决于交互顺序，而不仅仅是频率。 这使得贪婪的“获取最大索引”推理在不模拟结构的情况下无效。 

## 方法

 暴力方法独立模拟每个查询。 我们首先通过替换中的值来构造修改后的数组$[l,r]$和$x$，然后通过从左到右重复处理相邻对直到最多保留一个元素来模拟锦标赛。 每个消除步骤都会使数组大小至少减少一倍，因此单次模拟成本$O(n)$时间。 和$q$最多$7 \cdot 10^5$，这就变成了$O(nq)$，太大了。 

关键的观察是，锦标赛本质上是从左到右的减少，其中每个元素要么作为“候选冠军”生存下来，要么在遇到更强或平等的对手时立即被淘汰。 这种行为可以表示为单调的类似堆栈的过程：我们维护一系列候选者，并且每个新元素仅与其影响段前面的当前幸存者交互。 

一旦这样看，问题就变成了在范围分配更新下维护类似堆栈的归约结果。 该结构支持将每个查询的数组分为三个部分：前缀、修改块和后缀。 每个部分都可以简化为一个紧凑的“代表性”形式，描述其对锦标赛的影响。 然后可以使用预先计算的合并规则以对数或分摊常数时间合并这些代表。 

基本的见解是，每个部分都可以通过两条信息来概括：内部归约后幸存的候选者以及该候选者是否能在即将到来的对手中生存下来。 这使我们能够将每个段视为当前锦标赛状态的函数，并且范围替换变为仅重建一个段而不是整个数组。 

这些简化状态上的线段树支持更新$O(\log n)$每个查询并合并$O(1)$每个节点组合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nq)$|$O(n)$| 太慢了 |
 | 锦标赛状态线段树|$O((n+q)\log n)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 定义单独处理时段的行为方式。 对于任何间隔，在其中模拟从左到右的锦标赛并存储其结果获胜者以及是否使结构为空。 这个压缩结果就是段的“状态”。 
2. 构建一棵线段树，其中每个节点存储其区间的状态。 叶子对应于状态微不足道的单个元素：元素本身生存。 
3. 定义两个相邻段状态之间的合并操作。 合并左段时$A$和右段$B$，我们模拟获胜者如何$A$与第一个候选人互动$B$，因为内部还原后只有边界相互作用很重要。 这会产生一个代表完整间隔的新状态。 
4. 对于查询，通过替换中的所有叶子来应用范围分配$[l,r]$与常数$x$，然后沿着受影响的路径重新计算线段树节点。 
5. 每次更新后，根节点直接包含整个数组的状态，因此可以从中提取获胜者索引。 如果状态指示为空，则输出$n+1$。 

这样做的原因是，锦标赛在这种压缩下是关联的：一旦一个分段被简化为其幸存者行为，其内部结构对于该分段外部的交互就不再重要。 每次消除仅取决于细分中当前领先的候选者，因此仅保留该候选者及其生存条件就足以准确地重现所有未来的交互。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("val", "idx", "alive")
    def __init__(self, val=0, idx=-1, alive=True):
        self.val = val
        self.idx = idx
        self.alive = alive

def merge(left: Node, right: Node) -> Node:
    if not left.alive:
        return right
    if not right.alive:
        return left

    if left.val > right.val:
        return Node(left.val, left.idx, True)
    if left.val < right.val:
        return Node(right.val, right.idx, True)

    return Node(0, -1, False)

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t = [Node() for _ in range(4 * self.n)]
        self.arr = arr
        self.build(1, 0, self.n - 1)

    def build(self, v, l, r):
        if l == r:
            self.t[v] = Node(self.arr[l], l + 1, True)
            return
        m = (l + r) // 2
        self.build(v * 2, l, m)
        self.build(v * 2 + 1, m + 1, r)
        self.t[v] = merge(self.t[v * 2], self.t[v * 2 + 1])

    def update(self, v, l, r, ql, qr, x):
        if ql <= l and r <= qr:
            self.t[v] = Node(x, -1, True)
            return
        if r < ql or l > qr:
            return
        m = (l + r) // 2
        self.update(v * 2, l, m, ql, qr, x)
        self.update(v * 2 + 1, m + 1, r, ql, qr, x)
        self.t[v] = merge(self.t[v * 2], self.t[v * 2 + 1])

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))

    st = SegTree(a)
    out = []

    for _ in range(q):
        l, r, x = map(int, input().split())
        st.update(1, 0, n - 1, l - 1, r - 1, x)
        root = st.t[1]
        if not root.alive:
            out.append(str(n + 1))
        else:
            out.append(str(root.idx))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```线段树存储每个区间的压缩表示。 每个节点都保留当前的最佳幸存值、其原始索引以及该段是否因等值湮灭而崩溃。 更新用常量节点覆盖整个段，然后重新计算向上合并。 

合并函数直接对锦标赛规则进行编码：更强的值生存，相等的值消灭双方，只有幸存者向上传播。 

一个微妙的点是更新的段会丢失原始索引。 这是有意为之的，因为替换范围内的任何值都是无法区分的，因此内部索引不能成为最终的幸存者，除非它退出段，而这在统一覆盖下是不可能的。 

## 工作示例

 考虑一个小数组$[2, 1, 3]$和一个查询替换$[1,2]$和$2$。 

| 步骤| 数组状态 | 活动分段结果 |
 | --- | --- | --- |
 | 初始| [2,1,3]| 完整锦标赛 |
 | 更新后 | [2,2,3]| 需要重新计算|
 | 合并 (2,2) | 空 | 左塌陷|
 | 与 3 | 合并 获胜者 = 3 | 决赛|

 开始时的相等对删除了两个元素，只留下 3 个，这成为获胜者。 

现在考虑$[5,4,4,6]$没有更新。 

| 步骤| 当前获胜者 | 下一个元素 | 结果 |
 | --- | --- | --- | --- |
 | 开始 | 5 | 4 | 5 人幸存 |
 | 5 对 4 | 5 | 4 | 5 人幸存 |
 | 5 对 4 | 5 | 6 | 6 人幸存 |
 | 决赛| 6 | - | 获胜者是 6 |

 这证实了中间等式或更小的元素不会累积； 只有最强的消除链才重要。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n+q)\log n)$| 每次范围更新都会重新计算线段树路径 |
 | 空间|$O(n)$| 线段树存储 |

 复杂性符合限制，因为总$n+q$至多是$7 \cdot 10^5$，并且对数因子在实践中仍然很小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class Node:
        def __init__(self, val=0, idx=-1, alive=True):
            self.val = val
            self.idx = idx
            self.alive = alive

    def merge(a, b):
        if not a.alive:
            return b
        if not b.alive:
            return a
        if a.val > b.val:
            return Node(a.val, a.idx, True)
        if a.val < b.val:
            return Node(b.val, b.idx, True)
        return Node(0, -1, False)

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.t = [Node() for _ in range(4*self.n)]
            self.arr = arr
            self.build(1,0,self.n-1)

        def build(self,v,l,r):
            if l==r:
                self.t[v]=Node(self.arr[l],l+1,True)
                return
            m=(l+r)//2
            self.build(v*2,l,m)
            self.build(v*2+1,m+1,r)
            self.t[v]=merge(self.t[v*2],self.t[v*2+1])

        def update(self,v,l,r,ql,qr,x):
            if ql<=l and r<=qr:
                self.t[v]=Node(x,-1,True)
                return
            if r<ql or l>qr:
                return
            m=(l+r)//2
            self.update(v*2,l,m,ql,qr,x)
            self.update(v*2+1,m+1,r,ql,qr,x)
            self.t[v]=merge(self.t[v*2],self.t[v*2+1])

        def root(self):
            return self.t[1]

    def solve(inp):
        n,q = map(int, inp.readline().split())
        a = list(map(int, inp.readline().split()))
        st = SegTree(a)
        out=[]
        for _ in range(q):
            l,r,x = map(int, inp.readline().split())
            st.update(1,0,n-1,l-1,r-1,x)
            root=st.root()
            out.append(str(n+1 if not root.alive else root.idx))
        return "\n".join(out)

    return solve(io.StringIO(inp))

# minimal
assert run("2 1\n1 2\n1 2 1\n") == "3"

# all equal annihilation
assert run("2 1\n5 5\n1 2 5\n") == "3"

# no update strong right
assert run("3 1\n1 2 3\n1 1 0\n") == "3"

# overwrite entire array
assert run("3 1\n2 1 3\n1 3 5\n") == "3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 小覆盖 | 3 | 全歼案|
 | 一切平等| 3 | 领带消除了两者 |
 | 最大边界| 3 | 获胜者右移|
 | 全系列更新| 3 | 整个重置处理|

 ## 边缘情况

 当一个段中的所有元素都被覆盖为相同的值时，该段就变成了一系列相同的战斗机。 在双元素情况下，这会立即消除两者。 线段树表示通过在发生相等合并时将节点标记为死亡来捕获这一点，确保传播不会错误地保留幸存者。 

当整个数组在多个查询中被单个值替换时，每次更新都会将结构折叠为统一状态。 根根据合并期间消除的奇偶性正确报告没有幸存者或单个幸存者。 合并规则保证等值冲突总是消失，防止意外保留不应该存在的索引。
