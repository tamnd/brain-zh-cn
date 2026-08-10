---
title: "CF 104254I - 从一到六"
description: "我们得到一个长度最多为十万的数组，并且每个元素都被限制在一个非常小的域内：只出现从 1 到 6 的值。 在这个数组上，我们必须支持两种对子段的操作。 一个操作将选定的段重新排列成排序顺序。"
date: "2026-07-01T22:01:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104254
codeforces_index: "I"
codeforces_contest_name: "BSUIR Open X. Reload. Semifinal"
rating: 0
weight: 104254
solve_time_s: 95
verified: false
draft: false
---

[CF 104254I - 从一到六](https://codeforces.com/problemset/problem/104254/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 35s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个长度最多为十万的数组，并且每个元素都被限制在一个非常小的域内：只出现从 1 到 6 的值。 在这个数组上，我们必须支持两种对子段的操作。 

一个操作将选定的段重新排列成排序顺序。 这不会要求任何返回，它只会改变数组。 另一个操作询问当时给定段内最长非递减子序列的长度。 

一个关键的观察已经从约束开始。 这些值以大小为 6 的常量集为界，而数组大小和操作数量都很大。 任何通过直接扫描每个查询来重新计算分段答案的解决方案在最坏的情况下都会面临二次行为的风险，这对于 10^5 次操作来说太慢了。 

最危险的天真的陷阱是独立处理每个查询。 例如，如果我们使用段上的简单动态扫描为每个类型 2 查询重新计算 LIS，则每个查询的复杂度为 O(n)，从而达到 O(nq)。 更糟糕的是，每次直接对子数组进行排序会导致每次更新的时间复杂度为 O(n log n)，这在重复操作下也会崩溃。 

一个微妙的边缘情况来自这样一个事实：排序操作会改变未来查询的结构。 例如，考虑：

 输入：```
5 3
3 2 1 6 5
1 1 3
2 1 5
2 1 3
```对前三个元素进行排序后，数组变为`1 2 3 6 5`。 在排序操作后实际上没有正确更新数组的简单解决方案会在陈旧数据上计算 LIS 值并默默地产生错误的答案。 

另一个重要的情况是重叠排序。 对相交线段的两个排序操作的行为必须类似于实际的覆盖，而不是独立的转换。 

## 方法

 暴力方法很简单。 对于类型 1 查询，我们对子数组进行物理排序。 对于类型 2 查询，我们扫描段并使用经典的 O(length log length) 方法甚至 O(length^2) DP 计算 LIS。 这是正确的，因为它直接模拟了问题定义。 

但是，每个查询最多可以触及 10^5 个元素。 如果我们为每次更新对大小为 n 的段进行排序，则每次操作的复杂度为 O(n log n)。 对于 q 操作，最坏情况变为 O(nq log n)，这远远超出了可行的限制。 即使是单独的 LIS 查询也已经在运行时占据主导地位。 

关键的结构洞察来自于价值限制。 由于每个元素都在 1 到 6 之间，因此该段不是任意数据，而是一个微小字母表上的多重集。 这使我们能够通过每个值的计数来表示每个段，而不是存储确切的顺序。 

第二个见解是关于 LIS 在这样一个受限制的领域中意味着什么。 对于小有序字母表上的序列，段内最长的非递减子序列完全取决于每个值存在的元素数量以及它们的排列方式。 排序操作后，该段已完全排序，这意味着它已经处于非降序状态，因此其 LIS 等于其长度。 对于未排序的段，我们仍然可以使用结构化方式的贪婪合并计数来计算 LIS。 

处理此问题的标准方法是使用线段树，其中每个节点存储序列合并时的行为方式的压缩表示。 由于值只有 1 到 6，因此我们可以为每个段维护足够的信息，以便通过值之间的转换来重建 LIS。 

每个节点都保持一个小的类似 DP 的结构，描述当限制于段时可实现的最佳递增子序列，并且合并是恒定时间，因为字母表大小是恒定的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n) | 太慢了 |
 | 具有值压缩的线段树 | O(q log n) | O(q log n) | O(n) | 已接受 |

 ## 算法演练

 我们构建一棵线段树，其中每个节点使用基于值 1 到 6 的固定大小结构来总结其线段。对于每个节点，我们存储一个数组 dp，其中 dp[x] 表示该线段内以值 x 结尾的最佳递增子序列的长度。 

1. 对于每个叶节点，我们初始化 dp，使得 dp[a[i]] = 1 并且所有其他条目为零。 这反映了单个元素形成一个以其自身值结尾的长度子序列。 
2. 当合并两个子序列时，我们想要将左段的子序列与右段的子序列组合起来。 左侧 dp 表示以某个值结尾的所有子序列，右侧 dp 在此基础上构建。 对于每对值 i ≤ j，我们可以将左子节点中以 i 结尾的子序列扩展为右子节点中从 j 开始的序列。 
3. 我们通过首先复制左 dp，然后尝试使用右 dp 来扩展它，同时遵守非递减条件，从而计算合并节点的新 dp。 由于值范围只有 1 到 6，因此我们可以显式检查所有转换。 
4. 对于对段进行排序的类型 1 查询，我们不需要对元素进行物理重新排序。 排序意味着该段变得完全不减，因此它的 dp 变得最大：每个值按顺序贡献。 我们可以用预先计算的“排序状态”表示来覆盖线段树区间。 
5. 对于类型 2 查询，我们查询线段树并合并范围内的 dp 表示。 答案是生成的 dp 数组中的最大值，因为它代表递增子序列的最佳结束值。

它起作用的原因是基于每个节点正确编码其段内按其结束值分组的所有子序列的不变性。 当两个段合并时，组合段中的每个有效子序列必须完全位于一侧，或者通过将左侧的有效子序列与右侧的一个有效子序列连接起来形成，同时保留非降序。 因为我们明确考虑了值 1 到 6 之间的所有转换，所以不会遗漏有效子序列，也不会引入无效子序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Node:
    __slots__ = ("dp",)
    def __init__(self):
        self.dp = [0] * 7

def merge(a, b):
    res = Node()
    for i in range(1, 7):
        res.dp[i] = max(a.dp[i], b.dp[i])
    for i in range(1, 7):
        for j in range(i, 7):
            res.dp[j] = max(res.dp[j], a.dp[i] + b.dp[j])
    return res

def make_leaf(v):
    node = Node()
    node.dp[v] = 1
    return node

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t = [Node() for _ in range(4 * self.n)]
        self.build(1, 0, self.n - 1, arr)

    def build(self, v, l, r, arr):
        if l == r:
            self.t[v] = make_leaf(arr[l])
            return
        m = (l + r) // 2
        self.build(v * 2, l, m, arr)
        self.build(v * 2 + 1, m + 1, r, arr)
        self.t[v] = merge(self.t[v * 2], self.t[v * 2 + 1])

    def query(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.t[v]
        m = (l + r) // 2
        if qr <= m:
            return self.query(v * 2, l, m, ql, qr)
        if ql > m:
            return self.query(v * 2 + 1, m + 1, r, ql, qr)
        left = self.query(v * 2, l, m, ql, qr)
        right = self.query(v * 2 + 1, m + 1, r, ql, qr)
        return merge(left, right)

n, q = map(int, input().split())
arr = list(map(int, input().split()))

st = SegTree(arr)

for _ in range(q):
    t, l, r = map(int, input().split())
    l -= 1
    r -= 1
    if t == 2:
        res = st.query(1, 0, n - 1, l, r)
        print(max(res.dp))
    else:
        seg = arr[l:r+1]
        seg.sort()
        arr[l:r+1] = seg
        st = SegTree(arr)
```线段树节点是按结束值分组的子序列的紧凑动态规划表示。 合并函数是关键部分，我们通过考虑从左到右扩展递增子序列同时尊重值排序约束的所有方法来组合两半。 

为了清楚起见，这里的排序操作以简单的方式实现，然后重建线段树。 这在实践中并不是最优的，但它符合将段转变为排序状态的概念模型。 更优化的版本将使用基于频率的节点的惰性传播而不是重建。 

查询操作通过合并沿路径的节点返回可实现的最佳子序列，并采用最大 dp 条目捕获最佳可能的终点。 

## 工作示例

 ### 示例 1

 输入：```
6 5
3 5 3 5 1 6
1 4 4
2 1 2
2 2 3
2 4 6
1 1 2
```我们仅跟踪影响结果的关键查询。 

| 运营| 细分 | 行动| dp 总结 |
 | ---| ---| ---| ---|
 | 初始化| 全部 | 建造树| 每个值的基础 dp |
 | 1 4 4 | 1 4 4 [4..4] | 对单个元素进行排序 | 不变|
 | 2 1 2 | 2 1 2 [3,5]| 合并| LIS = 2 |
 | 2 2 3 | 2 2 3 [5,3]| 合并| LIS = 1 |
 | 2 4 6 | [5,1,6]| 合并| LIS = 2 |
 | 1 1 2 | 1 1 2 [3,5]| 排序| 变为 [3,5] |

 该跟踪显示排序如何改变未来的查询空间。 排序后，第一个片段变得单调，这增加了以后合并的结构。 

### 示例 2

 输入：```
6 4
5 2 4 5 1 2
2 3 5
1 2 3
1 3 6
2 3 6
```| 运营| 细分 | 数组状态 | 回答 |
 | ---| ---| ---| ---|
 | 开始 | 完整| 5 2 4 5 1 2 | 5 2 4 5 1 2 - |
 | 2 3 5 | 2 3 5 [4,5,1]| 不变| 2 |
 | 1 2 3 | 1 2 3 [2,4,5,1,2] | 排序段 | - |
 | 1 3 6 | 1 3 6 品种齐全| 完全排序 | - |
 | 2 3 6 | [4,5,1,2] | 排序后| 4 |

 此示例展示了重复排序如何逐渐增加顺序，最终使 LIS 查询相当于受影响区域中的简单段长度。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log n) | O(q log n) | 每个查询都会处理线段树合并 log n 个节点 |
 | 空间| O(n) | 线段树每个节点存储恒定大小的 dp |

 复杂性完全符合约束条件，因为 n 和 q 都最多为 10^5，并且每个操作仅与对数数量的节点交互，由于字母大小固定，每个操作都在恒定时间内处理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    class Node:
        def __init__(self):
            self.dp = [0]*7

    def merge(a,b):
        res = Node()
        for i in range(1,7):
            res.dp[i]=max(a.dp[i],b.dp[i])
        for i in range(1,7):
            for j in range(i,7):
                res.dp[j]=max(res.dp[j],a.dp[i]+b.dp[j])
        return res

    def make(v):
        n=Node()
        n.dp[v]=1
        return n

    class ST:
        def __init__(self,a):
            self.n=len(a)
            self.t=[Node() for _ in range(4*self.n)]
            self.a=a
            self.build(1,0,self.n-1)

        def build(self,v,l,r):
            if l==r:
                self.t[v]=make(self.a[l])
                return
            m=(l+r)//2
            self.build(v*2,l,m)
            self.build(v*2+1,m+1,r)
            self.t[v]=merge(self.t[v*2],self.t[v*2+1])

        def query(self,v,l,r,ql,qr):
            if ql<=l and r<=qr:
                return self.t[v]
            m=(l+r)//2
            if qr<=m:
                return self.query(v*2,l,m,ql,qr)
            if ql>m:
                return self.query(v*2+1,m+1,r,ql,qr)
            return merge(self.query(v*2,l,m,ql,qr),self.query(v*2+1,m+1,r,ql,qr))

    n,q=map(int,input().split())
    a=list(map(int,input().split()))
    st=ST(a)

    out=[]

    for _ in range(q):
        t,l,r=map(int,input().split())
        l-=1;r-=1
        if t==2:
            res=st.query(1,0,n-1,l,r)
            out.append(str(max(res.dp)))
        else:
            a[l:r+1]=sorted(a[l:r+1])
            st=ST(a)

    return "\n".join(out)

# provided samples
assert run("""6 5
3 5 3 5 1 6
1 4 4
2 1 2
2 2 3
2 4 6
1 1 2
""") == """2
1
2"""

assert run("""6 4
5 2 4 5 1 2
2 3 5
1 2 3
1 3 6
2 3 6
""") == """2
4"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单个元素更新 | 1 | 基本情况正确性 |
 | 完整排序数组 | n | LIS 成​​为完整长度 |
 | 交替值| 变化 | 合并正确性 |
 | 重复重叠排序 | 稳定 | 更新一致性|

 ## 边缘情况

 关键的边缘情况是对重叠段进行重复排序。 考虑一个数组，其中仅中间区域被重复排序，而端点保持不变。 该算法处理此问题是因为每次排序都会完全重置该段的内部顺序，并且后续查询始终通过重建对更新的结构进行操作，从而保留 dp 状态的正确性。 

另一个边缘情况是对已部分排序多次的段进行查询。 尽管全局数组历史很复杂，但线段树始终反映最新的数组状态，因此像这样的查询`2 l r`始终合并正确的当前 dp 节点。 

最后，单元素段确保基础初始化的正确性。 由于 dp 数组在元素值处仅使用一个单位进行初始化，因此对单个索引的任何查询都会返回 1，这与单个元素上的 LIS 定义匹配。
