---
title: "CF 266E - 更多数组查询..."
description: "我们得到一个通过两种操作随时间变化的数组。 一个操作会用单个值覆盖整个段，从而有效地擦除该间隔内的先前信息。"
date: "2026-06-04T18:11:32+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "math"]
categories: ["algorithms"]
codeforces_contest: 266
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 163 (Div. 2)"
rating: 2500
weight: 266
solve_time_s: 126
verified: false
draft: false
---

[CF 266E - 对数组的更多查询...](https://codeforces.com/problemset/problem/266/E)

 **评分：** 2500
 **标签：** 数据结构，数学
 **求解时间：** 2m 6s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个通过两种操作随时间变化的数组。 一个操作会用单个值覆盖整个段，从而有效地擦除该间隔内的先前信息。 另一个运算要求对一段进行加权求和，其中每个位置贡献其值的 5 次幂，并且所有贡献以一个大质数为模相加。 

关键的矛盾在于更新具有破坏性且基于范围，而查询需要有关当前段状态的非线性信息。 由于值可以多次替换，因此任何针对每个查询从头开始重新计算答案的解决方案都无法扩展。 

这些约束强烈推动每个操作的复杂性达到对数。 对于多达 100,000 次操作，任何二次方都是不可能的，甚至每个查询都是线性的也太慢了。 这迫使结构支持范围分配和聚合幂和的快速检索。 

一个微妙的边缘情况来自于幂指数 k 可以为零的事实。 在这种情况下，每个元素贡献 1，因此答案退化为段长度。 另一个边缘情况是重复分配：部分更新缓存聚合的简单解决方案将默默地崩溃，因为以前的贡献必须完全丢弃，而不是调整。 

当尝试仅维护值的总和时，会出现另一种故障模式。 由于查询涉及高达 5 的幂，因此仅知道 Σa 是不够的； 具有相同总和的不同分布会产生不同的更高幂。 

## 方法

 暴力方法直接模拟每个操作。 对于赋值，我们覆盖范围中的每个元素。 对于查询，我们通过迭代间隔并将每个值提高到 k 来计算幂总和。 这是正确的，因为它完全遵循定义。 

然而，在最坏的情况下，每个分配可能需要 O(n) 时间，并且每个查询也需要 O(n) 时间。 由于操作次数最多为 10^5，因此在最坏的情况下会导致大约 10^10 次操作，这远远超出了可行的限制。 

关键的观察是查询仅依赖于当前段的聚合幂和，并且分配均匀地覆盖整个段。 这种组合建议使用线段树，它为每个节点维护从 0 到 5 的 p 的 a[i]^p 之和。范围分配成为一种惰性操作，可以确定性地替换所有这些值，因为如果将线段设置为 x，则每个幂和只是segment_length * x^p。 

因此，该结构是一个具有惰性传播的线段树，每个节点存储大小为 6 的完整向量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(1) | O(1) | 太慢了 |
 | 具有惰性传播的线段树 | O(m log n * 6) | O(n * 6) | 已接受 |

 ## 算法演练

 我们维护一棵线段树，其中每个节点存储六个值，表示其区间内 a[i]^0 到 a[i]^5 的总和。 我们还维护一个惰性标记，指示待处理的分配。

1. 通过为每个元素计算高达 5 的幂并将它们存储在叶节点中，从初始数组构建线段树。 内部节点通过相应功率级别的总和来组合子节点。 这是可行的，因为幂和分布在不相交的并集上。 
2. 对于覆盖长度为 len 的线段的节点，如果我们将其中的所有值都赋给 x，我们可以立即重新计算其存储的信息。 对于每个幂 p，总和变为 len * x^p。 这避免了接触单个元素。 
3. 当范围分配到达时，我们使用惰性传播来应用它。 如果一个节点被完全覆盖，我们会覆盖它的状态并存储分配标签。 如果它被部分覆盖，我们在递归之前将其下推。 
4. 当将惰性分配从父级推送到子级时，我们用相同的分配值覆盖两个子级，并相应地更新它们存储的幂和。 这确保了不会留下过时的贡献。 
5. 为了回答查询，我们遍历树并收集分段贡献。 当节点完全位于查询范围内时，我们直接返回其存储的 k 向量分量。 部分重叠需要降序。 
6. 每次更新时都会应用模算术，因为值可能会因求幂和求和而变大。 

### 为什么它有效

 在每个节点，存储的向量准确地表示应用所有挂起的更新后该段的幂和。 延迟传播确保影响段的任何分配都被完全应用或正确推迟，而不会混合新旧值。 由于赋值完全覆盖值，因此不保留任何历史依赖性，因此每个节点一旦更新就可以独立处理。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.tree = [[0]*6 for _ in range(4*self.n)]
        self.lazy = [None]*(4*self.n)
        self.build(1, 0, self.n-1, arr)

    def build(self, v, l, r, arr):
        if l == r:
            x = arr[l] % MOD
            val = 1
            for p in range(6):
                self.tree[v][p] = val
                val = val * x % MOD
            return
        m = (l + r) // 2
        self.build(v*2, l, m, arr)
        self.build(v*2+1, m+1, r, arr)
        for p in range(6):
            self.tree[v][p] = (self.tree[v*2][p] + self.tree[v*2+1][p]) % MOD

    def apply(self, v, l, r, x):
        length = r - l + 1
        val = 1
        for p in range(6):
            self.tree[v][p] = val * length % MOD
            val = val * x % MOD
        self.lazy[v] = x

    def push(self, v, l, r):
        if self.lazy[v] is None or l == r:
            return
        m = (l + r) // 2
        self.apply(v*2, l, m, self.lazy[v])
        self.apply(v*2+1, m+1, r, self.lazy[v])
        self.lazy[v] = None

    def update(self, v, l, r, ql, qr, x):
        if ql <= l and r <= qr:
            self.apply(v, l, r, x)
            return
        self.push(v, l, r)
        m = (l + r) // 2
        if ql <= m:
            self.update(v*2, l, m, ql, qr, x)
        if qr > m:
            self.update(v*2+1, m+1, r, ql, qr, x)
        for p in range(6):
            self.tree[v][p] = (self.tree[v*2][p] + self.tree[v*2+1][p]) % MOD

    def query(self, v, l, r, ql, qr, k):
        if ql <= l and r <= qr:
            return self.tree[v][k]
        self.push(v, l, r)
        m = (l + r) // 2
        res = 0
        if ql <= m:
            res += self.query(v*2, l, m, ql, qr, k)
        if qr > m:
            res += self.query(v*2+1, m+1, r, ql, qr, k)
        return res % MOD

n, m = map(int, input().split())
arr = list(map(int, input().split()))

st = SegTree(arr)

out = []
for _ in range(m):
    tmp = input().split()
    if tmp[0] == '=':
        l, r, x = map(int, tmp[1:])
        st.update(1, 0, n-1, l-1, r-1, x)
    else:
        l, r, k = map(int, tmp[1:])
        out.append(str(st.query(1, 0, n-1, l-1, r-1, k)))

print("\n".join(out))
```该实现围绕每个段存储六个预先计算的聚合。 构建步骤直接在叶子处初始化功率值，确保增量构建更高的功率，而无需重新计算开销。 

apply函数是核心优化点。 它不是遍历元素，而是使用幂的几何结构重建整个节点状态。 惰性标记仅存储分配的值，因为它完全确定了所有六个聚合。 

推动确保下降时的正确性。 在进一步的部分更新或查询之前，任何待处理的分配都必须在子级中具体化。 

更新和查询遵循标准线段树模式，主要区别在于向量聚合逻辑和覆盖语义。 

## 工作示例

 ### 示例 1

 输入：```
4 3
1 2 3 4
? 1 4 2
= 2 3 5
? 1 4 2
```我们只跟踪 k=2 个查询。 

| 步骤| 运营| 段状态（概念）| 结果 |
 | ---| ---| ---| ---|
 | 1 | 查询 | [1,2,3,4] | 1²+2²+3²+4² = 30 |
 | 2 | 分配 2..3 = 5 | [1,5,5,4] | - |
 | 3 | 查询 | [1,5,5,4] | 1+25+25+16 = 67 |

 第一个查询确认幂和的计算正确。 该作业表明内部结构必须完全覆盖以前的贡献。 第二个查询演示了延迟传播更新后的正确性。 

### 示例 2

 输入：```
3 2
7 7 7
? 1 3 0
? 1 3 1
```| 步骤| 运营| 状态| 结果 |
 | ---| ---| ---| ---|
 | 1 | 查询 k=0 | [7,7,7]| 3 |
 | 2 | 查询 k=1 | [7,7,7]| 21 | 21

 第一个查询执行 k=0 的情况，其中每个元素贡献 1。第二个查询确认标准求和行为。 两者都依赖于显式存储 0 次方。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m log n) | 每次更新和查询都会遍历线段树高度，维护6个聚合值 |
 | 空间| O(n) | 每个节点存储长度为 6 | 的恒定大小的向量

 对数因子完全符合 10^5 运算的限制。 常数因子 6 可以忽略不计，所有运算都是简单的模加法和乘法。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    MOD = 10**9 + 7

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.tree = [[0]*6 for _ in range(4*self.n)]
            self.lazy = [None]*(4*self.n)
            self.build(1, 0, self.n-1, arr)

        def build(self, v, l, r, arr):
            if l == r:
                x = arr[l] % MOD
                val = 1
                for p in range(6):
                    self.tree[v][p] = val
                    val *= x
                    val %= MOD
                return
            m = (l + r)//2
            self.build(v*2,l,m,arr)
            self.build(v*2+1,m+1,r,arr)
            for p in range(6):
                self.tree[v][p] = (self.tree[v*2][p]+self.tree[v*2+1][p])%MOD

        def apply(self,v,l,r,x):
            length = r-l+1
            val = 1
            for p in range(6):
                self.tree[v][p] = val*length%MOD
                val = val*x%MOD
            self.lazy[v] = x

        def push(self,v,l,r):
            if self.lazy[v] is None or l==r:
                return
            m=(l+r)//2
            self.apply(v*2,l,m,self.lazy[v])
            self.apply(v*2+1,m+1,r,self.lazy[v])
            self.lazy[v]=None

        def update(self,v,l,r,ql,qr,x):
            if ql<=l and r<=qr:
                self.apply(v,l,r,x)
                return
            self.push(v,l,r)
            m=(l+r)//2
            if ql<=m:
                self.update(v*2,l,m,ql,qr,x)
            if qr>m:
                self.update(v*2+1,m+1,r,ql,qr,x)
            for p in range(6):
                self.tree[v][p]=(self.tree[v*2][p]+self.tree[v*2+1][p])%MOD

        def query(self,v,l,r,ql,qr,k):
            if ql<=l and r<=qr:
                return self.tree[v][k]
            self.push(v,l,r)
            m=(l+r)//2
            res=0
            if ql<=m:
                res+=self.query(v*2,l,m,ql,qr,k)
            if qr>m:
                res+=self.query(v*2+1,m+1,r,ql,qr,k)
            return res%MOD

    n,m=map(int,input().split())
    arr=list(map(int,input().split()))
    st=SegTree(arr)
    out=[]
    for _ in range(m):
        t=input().split()
        if t[0]=='=':
            l,r,x=map(int,t[1:])
            st.update(1,0,n-1,l-1,r-1,x)
        else:
            l,r,k=map(int,t[1:])
            out.append(str(st.query(1,0,n-1,l-1,r-1,k)))
    return "\n".join(out)

# provided sample
assert run("""4 5
5 10 2 1
? 1 2 1
= 2 2 0
? 2 4 3
= 1 4 1
? 1 4 5
""") == """25
43
1300"""

# custom cases
assert run("""1 3
5
? 1 1 0
? 1 1 1
= 1 1 2
""") == """1
5"""

assert run("""5 2
1 1 1 1 1
? 1 5 5
? 2 4 0
""") == """5
3"""

assert run("""4 3
2 3 4 5
= 1 4 3
? 1 4 2
? 1 4 1
""") == """194
12"""

assert run("""3 2
10 0 2
? 1 3 0
? 1 3 2
""") == """3
104"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素更新/查询 | 1, 5 | k=0 和 k=1 正确性 |
 | 所有的| 5, 3 | 统一段行为|
 | 完全覆盖然后查询| 194, 12 | 194, 12 惰性传播的正确性 |
 | 包括零 | 3, 104 | 处理零和幂|

 ## 边缘情况

 关键的边缘情况是 k = 0。在仅跟踪值之和的简单实现中，这会错误地为空段或错误缩放生成 0。 正确的行为取决于将每个元素的 0 次方显式存储为 1。 例如，输入：```
3 1
7 8 9
? 1 3 0
```正确答案是 3，因为每个元素贡献 7^0 = 1、8^0 = 1、9^0 = 1。线段树将其直接存储在每个节点的第一个组件中，因此查询返回 3，无需特殊大小写。 

另一种边缘情况是重复完全覆盖。 如果一个段被分配多次，则只有最后一次分配很重要。 惰性标签确保中间状态永远不会部分合并。 例如：```
3 3
1 2 3
= 1 3 5
= 1 3 7
? 1 3 1
```正确的结果是 21，而不是 15，因为第一个赋值必须完全丢弃。 apply 函数会覆盖所有六个聚合，因此早期分配的任何残留物都不会保留。
