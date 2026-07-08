---
title: "CF 102961D - 音乐会门票"
description: "该任务围绕固定价格音乐会门票的市场和一系列相继到达的买家展开。 每张门票都有一个价格，每个买家都有他们愿意支付的最高金额。"
date: "2026-07-04T06:50:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102961
codeforces_index: "D"
codeforces_contest_name: "CSES Problem Set: Sorting and Searching"
rating: 0
weight: 102961
solve_time_s: 51
verified: true
draft: false
---

[CF 102961D - 音乐会门票](https://codeforces.com/problemset/problem/102961/D)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该任务围绕固定价格音乐会门票的市场和一系列相继到达的买家展开。 每张门票都有一个价格，每个买家都有他们愿意支付的最高金额。 当买家到达时，他们会选择一张价格不超过其预算的门票。 在所有可用的门票中，他们总是选择他们能买得起的最贵的一张。 门票一旦售出，就会消失并且不能再次使用。 

输入描述了初始的多组票价，后跟买家列表，每个买家都有预算约束。 对于每个买家，我们必须确定他们最终购买哪张门票，或者报告不存在合适的门票。 

该结构立即表明插入顺序和删除都很重要。 关键操作不仅仅是查询阈值下是否存在票证，而是在动态集合下反复查找和删除最佳可行候选者。 

如果门票和买家的数量约为 200,000 或类似数量级，则任何扫描每个买家的整个门票列表的方法都会导致二次行为。 每个查询的简单线性扫描需要检查所有剩余票证，在最坏的情况下会产生大约 10^10 次操作，这远远超出了 2 秒执行窗口中的可行限制。 

这已经排除了重复的完整扫描或通过每个查询过滤进行简单排序。 

一些边缘情况自然会出现。 

一种是所有门票都比每个买家的预算都贵。 例如，门票是`[100, 200, 300]`买家是`[10, 50]`。 正确的输出是`-1 -1`。 粗心的实现如果没有正确处理“未找到候选者”的情况，可能会错误地返回最小的票证或重复使用以前的答案。 

另一种情况是多张门票价格相同。 例如门票`[50, 50, 50]`和买家`[50, 50]`。 每个买家应该得到一张不同的门票。 未正确从其结构中删除已用票证的解决方案可能会多次重复分配相同的逻辑票证。 

第三种微妙的情况是，当买家按预算降序到达时，这可能会欺骗依赖排序列表而没有适当删除支持的解决方案。 比如说门票`[20, 40, 60]`和买家`[70, 50, 30]`每次分配后需要逐渐缩小匹配状态更新。 

## 方法

 直接的暴力解决方案维护剩余票证的列表。 对于每个买家，我们迭代所有门票，检查那些不超出预算的门票，并选择其中最大的门票。 选择票证后，我们将其从列表中删除。 

这是有效的，因为它完全按照描述模拟过程，通过构造保持正确性。 然而，成本主要是扫描每个买家的整套门票。 和`n`门票和`m`买家，这会导致`O(nm)`时间复杂度。 当两者都很大时，这就变得难以管理。 

效率低下的原因在于从头开始反复搜索最佳候选者，即使票证集仅通过删除来增量更改。 我们需要的结构是一种能够有效支持两种操作的结构：找到不超过某个值的最大元素，并将其删除。 

这正是有序平衡结构所提供的。 如果我们对门票进行排序并将其维护在支持前一查询的结构中，则可以通过找到最右边的门票价格来为每个买家提供服务`<= budget`。 之后，我们将其删除。 平衡二叉搜索树或有序多重集支持对数时间内的这两种操作。 

在Python中，标准库不提供基于树的多重集，因此我们使用排序容器来模拟它，或者在竞争性编程中更常见的是，使用`bisect`在与 Fenwick 树或线段树结合的排序列表上。 最简洁的概念解决方案是压缩坐标上的线段树，其中每个节点存储最大可用索引或计数，使我们能够查询最佳可行票证并将其删除。 

关键的观察是价格在范围内是静态的，但可用性是动态变化的，我们只需要支持删除下的“best <= x”查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 线段树/有序结构| O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

 我们通过压缩门票价格并构建一个跟踪每种价格剩余多少张门票的结构来解决这个问题。 

1. 我们首先对所有门票价格进行排序，并将它们压缩到一个已排序的唯一数组中。 这使我们能够使用索引而不是原始值。 压缩有用的原因是我们只关心相对顺序，而不是实际大小。 
2. 我们在这些压缩索引上构建一个频率数组，存储每个价格水平存在的门票数量。 这自然会捕获重复项。 
3. 我们在此频率数组上构造一棵线段树，其中每个节点存储其线段中可用门票的总数。 这使我们能够快速确定某个范围内是否存在任何票证。 
4. 对于每个有预算的买家`x`，我们在压缩数组中进行二分查找以找到价格为的最大索引`<= x`。 这将搜索空间减少到仅有效候选者。 
5.我们查询范围内的线段树`[0, idx]`找到仍然有票可用的最右边的位置。 此步骤确定最实惠的门票。 
6. 如果不存在这样的位置，我们输出`-1`。 否则，我们输出相应的票价，减少其计数，并更新线段树。 

其高效工作的原因是，搜索有效价格边界和搜索该边界内的可用票据都是对数运算，并且每张票据都被删除一次。 

### 为什么它有效

 在任何时刻，线段树都准确地表示剩余票证的多重集。 查询始终选择计数为正的最大索引，该索引恰好对应于不超过买家预算的最昂贵的可用门票。 由于更新仅删除票证，因此结构单调收缩，从而保留所有未来查询的正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t = [0] * (4 * self.n)
        self.arr = arr
        self._build(1, 0, self.n - 1)

    def _build(self, v, l, r):
        if l == r:
            self.t[v] = 1
            return
        m = (l + r) // 2
        self._build(v*2, l, m)
        self._build(v*2+1, m+1, r)
        self.t[v] = self.t[v*2] + self.t[v*2+1]

    def _query(self, v, l, r, ql, qr):
        if ql > r or qr < l:
            return -1
        if l == r:
            return l if self.t[v] > 0 else -1
        if ql <= l and r <= qr:
            if self.t[v] == 0:
                return -1
            m = (l + r) // 2
            right = self._query(v*2+1, m+1, r, ql, qr)
            if right != -1:
                return right
            return self._query(v*2, l, m, ql, qr)

        m = (l + r) // 2
        right = self._query(v*2+1, m+1, r, ql, qr)
        left = self._query(v*2, l, m, ql, qr)
        return max(right, left)

    def update(self, v, l, r, idx):
        if l == r:
            self.t[v] -= 1
            return
        m = (l + r) // 2
        if idx <= m:
            self.update(v*2, l, m, idx)
        else:
            self.update(v*2+1, m+1, r, idx)
        self.t[v] = self.t[v*2] + self.t[v*2+1]

n, m = map(int, input().split())
tickets = list(map(int, input().split()))
buyers = list(map(int, input().split()))

vals = sorted(set(tickets))
idx = {v:i for i, v in enumerate(vals)}

freq = [0] * len(vals)
for t in tickets:
    freq[idx[t]] += 1

seg = SegTree(vals)
seg.t = seg.t  # structure initialized over presence; we adjust via updates

# rebuild tree properly with freq
def build(v, l, r):
    if l == r:
        seg.t[v] = freq[l]
        return
    m = (l + r) // 2
    build(v*2, l, m)
    build(v*2+1, m+1, r)
    seg.t[v] = seg.t[v*2] + seg.t[v*2+1]

build(1, 0, len(vals)-1)

def query_rightmost(v, l, r, ql, qr):
    if ql > r or qr < l or seg.t[v] == 0:
        return -1
    if l == r:
        return l
    m = (l + r) // 2
    res = query_rightmost(v*2+1, m+1, r, ql, qr)
    if res != -1:
        return res
    return query_rightmost(v*2, l, m, ql, qr)

out = []

for b in buyers:
    pos = bisect = None
    # binary search manually
    lo, hi = 0, len(vals) - 1
    while lo <= hi:
        mid = (lo + hi) // 2
        if vals[mid] <= b:
            pos = mid
            lo = mid + 1
        else:
            hi = mid - 1

    if pos is None:
        out.append("-1")
        continue

    res = query_rightmost(1, 0, len(vals)-1, 0, pos)
    if res == -1:
        out.append("-1")
    else:
        out.append(str(vals[res]))
        # remove one ticket
        def upd(v, l, r, idx):
            if l == r:
                seg.t[v] -= 1
                return
            m = (l + r) // 2
            if idx <= m:
                upd(v*2, l, m, idx)
            else:
                upd(v*2+1, m+1, r, idx)
            seg.t[v] = seg.t[v*2] + seg.t[v*2+1]

        upd(1, 0, len(vals)-1, res)

print("\n".join(out))
```该解决方案首先压缩价格，以便线段树索引对应于排序的票值。 二分搜索步骤找到最高的实惠价格指数，而线段树查询则找到该范围内最好的仍然可用的门票。 输出票证后，我们通过点更新减少其计数，因此无法重复使用。 

一个微妙的点是二分查找和线段树查询都是必要的。 二分搜索将域限制在可承受的价格范围内，而线段树则强制删除时的可用性。 

## 工作示例

 ### 示例 1

 门票是`[5, 3, 7]`, 买家是`[4, 8, 3]`。 

| 买家| 预算| 最大实惠指数| 已选门票 | 剩余多组 |
 | ---| ---| ---| ---| ---|
 | 1 | 4 | 3（值 5 太大，因此索引为 3）| 3 | [5, 7] |
 | 2 | 8 | 2 | 7 | [5]|
 | 3 | 3 | 1 | -1 | [5]|

 此跟踪显示该结构如何始终选择当前缩减集下的最佳可用票证。 

### 示例 2

 门票是`[10, 10, 20]`, 买家是`[10, 10, 10]`。 

| 买家| 预算| 可用最佳 | 已选门票 | 剩余多组 |
 | ---| ---| ---| ---| ---|
 | 1 | 10 | 10 10 | 10 10 | 10 [10, 20] |
 | 2 | 10 | 10 10 | 10 10 | 10 [20]|
 | 3 | 10 | 10 -1 | -1 | [20]|

 这证明了对重复项的正确处理，其中重复的相同价格被一一消耗。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log n) | O((n + m) log n) | 每个买家进行二分查找加线段树查询并更新|
 | 空间| O(n) | 压缩数组和线段树存储|

 对数因子确保可扩展至数十万个票证和查询，这完全符合典型的竞赛限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    tickets = list(map(int, input().split()))
    buyers = list(map(int, input().split()))

    vals = sorted(set(tickets))
    idx = {v:i for i, v in enumerate(vals)}

    freq = [0] * len(vals)
    for t in tickets:
        freq[idx[t]] += 1

    class Seg:
        def __init__(self):
            self.n = len(vals)
            self.t = [0] * (4*self.n)

        def build(self, v, l, r):
            if l == r:
                self.t[v] = freq[l]
                return
            m = (l+r)//2
            self.build(v*2,l,m)
            self.build(v*2+1,m+1,r)
            self.t[v]=self.t[v*2]+self.t[v*2+1]

        def query(self,v,l,r,ql,qr):
            if ql>r or qr<l or self.t[v]==0:
                return -1
            if l==r:
                return l
            m=(l+r)//2
            res=self.query(v*2+1,m+1,r,ql,qr)
            if res!=-1:
                return res
            return self.query(v*2,l,m,ql,qr)

        def upd(self,v,l,r,i):
            if l==r:
                self.t[v]-=1
                return
            m=(l+r)//2
            if i<=m:
                self.upd(v*2,l,m,i)
            else:
                self.upd(v*2+1,m+1,r,i)
            self.t[v]=self.t[v*2]+self.t[v*2+1]

    seg = Seg()
    seg.build(1,0,len(vals)-1)

    out=[]
    for b in buyers:
        pos=None
        lo,hi=0,len(vals)-1
        while lo<=hi:
            mid=(lo+hi)//2
            if vals[mid]<=b:
                pos=mid
                lo=mid+1
            else:
                hi=mid-1
        if pos is None:
            out.append("-1")
            continue
        res=seg.query(1,0,len(vals)-1,0,pos)
        if res==-1:
            out.append("-1")
        else:
            out.append(str(vals[res]))
            seg.upd(1,0,len(vals)-1,res)

    return "\n".join(out)

# provided samples
assert run("3 3\n5 3 7\n4 8 3\n") == "3\n7\n-1"

# custom cases
assert run("1 1\n10\n9\n") == "-1", "below all tickets"
assert run("1 2\n5\n5 5\n") == "5\n-1", "single ticket exhaustion"
assert run("4 4\n1 1 1 1\n1 1 1 1\n") == "1\n1\n1\n1", "all equal consumption"
assert run("3 3\n10 20 30\n5 15 25\n") == "-1\n10\n20", "boundary stepping"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单程票低于预算| -1 | 没有有效的选择处理|
 | 重复同一张票 | 5, -1 | 耗尽正确性 |
 | 所有相同的值 | 重复输出| 多集计数 |
 | 提高门槛| 逐步选择| 正确的贪心匹配 |

 ## 边缘情况

 当所有门票都高于每个买家预算时，在二分搜索将范围缩小到有效前缀后，线段树查询始终返回空状态。 对于像这样的输入`tickets = [100, 200]`和`buyers = [10, 20]`，每个查询范围都是有效的，但线段树报告可用性为零，导致`-1`输出一致。 该结构永远不会尝试访问无效索引，因为二分搜索边界确保查询范围始终是明确定义的。 

当存在多个相同的票证时，每次更新都会降低单个叶子的频率。 在这样的情况下`tickets = [50, 50]`，第一个查询根据压缩找到索引 0 或 1，更新后仅保留一个。 第二个查询仍然搜索相同的范围，但现在在耗尽之前正确返回剩余的匹配项。
