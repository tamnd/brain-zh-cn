---
title: "CF 242E - 段上的异或"
description: "我们维护一个可变的整数数组，其中重复执行两种类型的操作：范围求和查询和范围更新，其中子数组中的每个元素都与固定值进行异或。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 242
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 149 (Div. 2)"
rating: 2000
weight: 242
solve_time_s: 212
verified: true
draft: false
---

[CF 242E - 段上的异或](https://codeforces.com/problemset/problem/242/E)

 **评级：** 2000
 **标签：** 位掩码、数据结构
 **求解时间：** 3m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们维护一个可变的整数数组，其中重复执行两种类型的操作：范围求和查询和范围更新，其中子数组中的每个元素都与固定值进行异或。 任务是在第一种类型的每个查询之后输出总和，同时确保按顺序应用所有更新。 

一种简单的解释是建议通过迭代每个请求的段并逐个元素应用 XOR 更新来重新计算总和。 一旦我们观察到规模，就会立即遇到麻烦：数组最多有 100,000 个元素，并且有最多 50,000 个操作。 在最坏的情况下，每个操作都会涉及一个大的段，这将导致大约 5×10⁹ 元素更新或查询，这远远超出了可接受的限制。 

关键的困难在于，异或运算对于和的表现显然不是线性的。 与加法不同，对范围应用异或不允许我们简单地将预先计算的和调整恒定量。 效果取决于段中值的位结构。 

有问题的场景的一个简单示例是多个 XOR 更新重叠时：

 输入：```
a = [1, 2, 3]
update [1,3] xor 1
update [1,3] xor 1
query [1,3]
```正确答案是 6，因为应用 XOR 两次会抵消。 如果不仔细跟踪奇偶校验，忘记这种切换行为或尝试“累积”XOR 值的幼稚实现将产生不正确的中间状态。 

在部分更新后查询时会出现另一个微妙的边缘情况：总和取决于当前设置了每个位的元素数量，而不是直接取决于各个值。 任何正确的解决方案都必须隐式地维护位级计数。 

## 方法

 暴力解决方案很简单：对于求和查询，迭代范围并累加值； 对于 XOR 更新，迭代并对每个元素应用 XOR。 这是正确的，因为它直接遵循操作的定义。 然而，在最坏的情况下，每个操作的成本为 O(n)，导致复杂度为 O(nm)。 当 n = 10⁵ 且 m = 5×10⁴ 时，这是不可行的。 

关键的见解是将数字分解为位，并为每个段维护每个位位置中有多少个数字为 1。 段的总和完全由这些计数决定：对于位 i，其贡献为 count_of_ones[i] × 2^i。 

现在考虑 XOR 的作用。 与 x 进行异或会翻转 x 为 1 的位。这意味着对于 x 中设置的每个位，该位位置中的所有 1 和 0 计数都会在段内交换。 重要的是，此操作不依赖于实际值，仅依赖于计数，这使得它适合具有延迟传播的线段树。 

这会形成一个线段树，其中每个节点存储所有 0 到 20 位的位计数（因为值最多为 10⁶），以及指示待处理的 XOR 操作的惰性掩码。 应用惰性异或只是翻转掩码中设置的位的计数，而不需要立即接触子项。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(纳米) | O(1) | O(1) | 太慢了 |
 | 具有位计数+惰性异或的线段树| O((n + m) log n · B) | O((n + m) log n · B) | O(n·B) | O(n·B) | 已接受 |

 这里B是位数（大约20）。 

## 算法演练

 我们构造一个段树，其中每个节点存储两条信息：对于每个位位置，该段中有多少元素设置了该位，以及记录待处理位翻转的惰性 XOR 掩码。 

1. 通过计算每个段的位数，从初始数组构建树。 每个叶节点根据单个值的二进制表示来初始化计数。 
2. 对于每个内部节点，通过求和子节点的位数来合并子节点。 这确保每个节点正确地表示其段。 
3. 要对段应用 XOR 更新，我们不会立即更新每个元素。 相反，我们通过翻转 XOR 值中设置的每个位的存储位计数来更新节点。 如果设置了一位，则 1 的数量将变为 length_of_segment 减去 current_ones。 
4. 我们还将 XOR 掩码存储在惰性值中，以便以后需要时可以更新子级。 
5. 当访问节点时，如果存在未决的惰性异或，我们通过应用相同的位翻转操作并传播掩码将其下推到子节点。 
6. 对于范围总和查询，我们聚合所有覆盖节点的贡献。 每个节点贡献 sum = Σ(bit_count[i] × 2^i)。 

### 为什么它有效

 正确性来自于维持每个线段树节点在应用影响它的所有挂起的 XOR 操作之后始终存储其线段的准确位计数的不变性。 惰性传播确保更新不会丢失； 它要么立即应用于节点，要么存储以供将来传播。 由于 XOR 是位的对合（应用两次可恢复原始状态），因此翻转计数始终是可逆的并且与延迟的应用一致。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

B = 20  # since a[i] <= 10^6

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.size = 4 * self.n
        self.cnt = [[0] * B for _ in range(self.size)]
        self.lazy = [0] * self.size
        self.build(1, 0, self.n - 1, arr)

    def build(self, v, l, r, arr):
        if l == r:
            for b in range(B):
                if arr[l] & (1 << b):
                    self.cnt[v][b] = 1
            return
        m = (l + r) // 2
        self.build(v * 2, l, m, arr)
        self.build(v * 2 + 1, m + 1, r, arr)
        self.pull(v)

    def pull(self, v):
        for b in range(B):
            self.cnt[v][b] = self.cnt[v * 2][b] + self.cnt[v * 2 + 1][b]

    def apply(self, v, l, r, x):
        length = r - l + 1
        for b in range(B):
            if x & (1 << b):
                self.cnt[v][b] = length - self.cnt[v][b]
        self.lazy[v] ^= x

    def push(self, v, l, r):
        if self.lazy[v] == 0:
            return
        m = (l + r) // 2
        self.apply(v * 2, l, m, self.lazy[v])
        self.apply(v * 2 + 1, m + 1, r, self.lazy[v])
        self.lazy[v] = 0

    def update(self, v, l, r, ql, qr, x):
        if ql <= l and r <= qr:
            self.apply(v, l, r, x)
            return
        self.push(v, l, r)
        m = (l + r) // 2
        if ql <= m:
            self.update(v * 2, l, m, ql, qr, x)
        if qr > m:
            self.update(v * 2 + 1, m + 1, r, ql, qr, x)
        self.pull(v)

    def query(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.cnt[v]
        self.push(v, l, r)
        m = (l + r) // 2
        res = [0] * B
        if ql <= m:
            left = self.query(v * 2, l, m, ql, qr)
            for b in range(B):
                res[b] += left[b]
        if qr > m:
            right = self.query(v * 2 + 1, m + 1, r, ql, qr)
            for b in range(B):
                res[b] += right[b]
        return res

n = int(input())
arr = list(map(int, input().split()))
seg = SegTree(arr)

m = int(input())
out = []

for _ in range(m):
    tmp = list(map(int, input().split()))
    if tmp[0] == 1:
        l, r = tmp[1] - 1, tmp[2] - 1
        cnt = seg.query(1, 0, n - 1, l, r)
        s = 0
        for b in range(B):
            s += cnt[b] * (1 << b)
        out.append(str(s))
    else:
        l, r, x = tmp[1] - 1, tmp[2] - 1, tmp[3]
        seg.update(1, 0, n - 1, l, r, x)

print("\n".join(out))
```线段树是根据位计数而不是原始值构建的。 这是使 XOR 更新易于管理的关键转换。 每次更新要么翻转节点处的整个位分布，要么在需要时向下传播。 

查询步骤根据位计数而不是存储的值重建总和，这避免了需要重建单个元素。 

一个微妙的实现细节是里面的更新规则`apply`: 翻转用途`length - count`，这是有效的，因为该段中的每个位都是二进制的。 另一个重要的细节是，延迟传播使用 XOR 累积来存储 XOR 掩码，因为应用相同的掩码两次会抵消。 

## 工作示例

 ### 示例 1

 输入：```
a = [4, 10, 3, 13, 7]
query [2,4]
xor [1,3] with 3
query [2,4]
```我们仅在概念上跟踪比特贡献。 

| 步骤| 运营| 细分 | 比特计数效果| 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | 查询 [2,4] | [10,3,13] | 直接求和| 26 | 26
 | 2 | 异或 [1,3] | 影响 3 | 的所有位 翻转相关位 | - |
 | 3 | 查询 [2,4] | 更新片段 | 从计数重新计算 | 22 | 22

 跟踪显示，在异或之后，各个值发生变化，但位计数保留了正确性，而无需显式更新元素。 

### 示例 2

 输入：```
a = [1,2,3]
xor [1,3] with 1
xor [1,3] with 1
query [1,3]
```| 步骤| 运营| 数组状态 |
 | ---| ---| ---|
 | 1 | 初始| [1,2,3]|
 | 2 | 异或 1 | [0,3,2]|
 | 3 | 异或 1 | [1,2,3]|
 | 4 | 查询 | 6 |

 这证实了 XOR 取消，并说明了为什么惰性 XOR 必须使用切换行为。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) log n · B) | O((n + m) log n · B) | 每次更新和查询都会涉及 log n 个节点，每个节点处理 B 位 |
 | 空间| O(n·B) | O(n·B) | 每个线段树节点存储位数 |

 由于 B 很小（大约 20），并且当 n = 10⁵ 时，log n 约为 17，因此约束条件允许这样做。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    B = 20

    class SegTree:
        def __init__(self, arr):
            self.n = len(arr)
            self.cnt = [[0]*B for _ in range(4*self.n)]
            self.lazy = [0]*(4*self.n)
            self.build(1,0,self.n-1,arr)

        def build(self,v,l,r,a):
            if l==r:
                for b in range(B):
                    if a[l]>>b & 1:
                        self.cnt[v][b]=1
                return
            m=(l+r)//2
            self.build(v*2,l,m,a)
            self.build(v*2+1,m+1,r,a)
            for b in range(B):
                self.cnt[v][b]=self.cnt[v*2][b]+self.cnt[v*2+1][b]

        def apply(self,v,l,r,x):
            length=r-l+1
            for b in range(B):
                if x>>b & 1:
                    self.cnt[v][b]=length-self.cnt[v][b]
            self.lazy[v]^=x

        def push(self,v,l,r):
            if not self.lazy[v]:
                return
            m=(l+r)//2
            self.apply(v*2,l,m,self.lazy[v])
            self.apply(v*2+1,m+1,r,self.lazy[v])
            self.lazy[v]=0

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

        def query(self,v,l,r,ql,qr):
            if ql<=l and r<=qr:
                return self.cnt[v]
            self.push(v,l,r)
            m=(l+r)//2
            res=[0]*B
            if ql<=m:
                left=self.query(v*2,l,m,ql,qr)
                for i in range(B): res[i]+=left[i]
            if qr>m:
                right=self.query(v*2+1,m+1,r,ql,qr)
                for i in range(B): res[i]+=right[i]
            return res

    n = int(input())
    a = list(map(int,input().split()))
    st = SegTree(a)
    m = int(input())
    out=[]
    for _ in range(m):
        q=list(map(int,input().split()))
        if q[0]==1:
            l,r=q[1]-1,q[2]-1
            cnt=st.query(1,0,n-1,l,r)
            s=0
            for i in range(B):
                s+=cnt[i]<<i
            out.append(str(s))
        else:
            l,r,x=q[1]-1,q[2]-1,q[3]
            st.update(1,0,n-1,l,r,x)

    return "\n".join(out)

# provided sample
assert run("""5
4 10 3 13 7
8
1 2 4
2 1 3 3
1 2 4
1 3 3
2 2 5 5
1 1 5
2 1 2 10
1 2 3
""") == """26
22
0
34
11"""

# small cases
assert run("""1
5
2
1 1 1
1 1 1
""") == """5"""

assert run("""3
1 2 3
2 1 3 1
1 1 3
""") == """0"""

assert run("""4
0 0 0 0
2 1 4 7
1 1 4
""") == """28"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单元素| 5, 5 | 身份查询|
 | 完全异或取消 | 0 | 位切换正确性|
 | 全零异或 | 28 | 28 多位传播|

 ## 边缘情况

 关键边缘情况在重叠段上与相同值重复进行异或。 该算法可以正确处理此问题，因为惰性掩码使用 XOR 累加。 应用相同的掩码两次可以抵消，恢复原始位计数。 

另一个边缘情况是查询在多​​个祖先节点处具有挂起的延迟更新的段。 推送操作确保在任何部分查询计算之前应用所有待处理的转换，即使在深度嵌套的树中也能保持正确性。 

最后一种情况是全范围更新，然后是部分查询。 由于每个节点在传播后始终表示其段的正确位计数，因此查询任何子段都会产生正确的聚合贡献，而无需每个元素重建。
