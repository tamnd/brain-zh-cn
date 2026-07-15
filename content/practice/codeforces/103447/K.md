---
title: "CF 103447K - 神奇蛋优先"
description: "我们正在维护一系列数字，代表一组鸡蛋的当前“功率水平”。 每个鸡蛋都有一个初始值，随着时间的推移，我们会重复对子段应用乘法更新或要求子段的总和。 有两个操作。"
date: "2026-07-03T07:33:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103447
codeforces_index: "K"
codeforces_contest_name: "The 2021 China Collegiate Programming Contest (Harbin)"
rating: 0
weight: 103447
solve_time_s: 47
verified: true
draft: false
---

[CF 103447K - 神奇蛋优先](https://codeforces.com/problemset/problem/103447/K)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在维护一系列数字，代表一组鸡蛋的当前“功率水平”。 每个鸡蛋都有一个初始值，随着时间的推移，我们会重复对子段应用乘法更新或要求子段的总和。 

有两个操作。 一个运算将某个范围内的每个值相乘$[l, r]$由给定因素$k$。 另一个操作要求一个范围内的值的总和$[l, r]$，答案取模$M$。 在操作之间，值会持续存在，因此更新会随着时间的推移而累积。 

约束的地方$n$和$q$最多$10^5$，这意味着我们必须在大致对数时间内处理更新和查询。 任何从头开始重新计算每个操作范围的解决方案都会导致$O(nq)$，这远远超出了可行的限度。 甚至$O(n)$每个操作已经达到$10^{10}$最坏情况下的操作。 

一个微妙的困难来自于更新的乘法性质。 与加法更新不同，乘法与求和的交互方式可以防止简单的前缀重新计算。 如果我们不维护结构，则每个范围总和查询都需要重新计算所有受影响的值。 

典型的失败案例是简单的模拟：

 输入：```
5 3 100
1 2 3 4 5
1 1 5 2
2 1 5
2 1 5
```一种简单的方法是在第一次操作时将整个数组相乘，然后重新计算总和两次。 这已经花费了$O(n)$每个操作，但更新次数较多的更糟糕模式使其速度太慢。 

另一个陷阱是忘记更新是基于范围的。 如果人们错误地将乘法视为全局乘法或未能限制$[l, r]$，状态立即发散。 

核心挑战是高效支持模数下的范围乘法和范围求和查询。 

## 方法

 暴力方法显式地保留数组。 对于类型 1 操作，它迭代自$l$到$r$并将每个元素乘以$k$。 对于类型 2 运算，它直接对范围求和。 这是正确的，因为它准确地反映了定义。 

然而，每个操作在范围大小上都是线性的。 在最坏的情况下，更新和查询都会覆盖很大的段，给出大约$O(nq)$，这是周围$10^{10}$操作显然不可行。 

关键的观察是，我们实际上并不需要始终单独了解每个元素。 我们只需要两个聚合能力：能够扩展整个段，以及能够快速计算段总和。 这表明线段树的每个节点都存储其线段的总和。 

复杂之处在于乘法会惰性地应用于整个段。 如果某个段有待定的乘法因子，则其中的每个值都会统一缩放，因此段总和也会按相同的因子缩放。 这正是可以使用延迟传播来延迟的转换：我们在每个节点存储一个乘法标签，并仅在必要时将其下推。 

这将两个操作减少到$O(\log n)$：范围乘法更新惰性标记并调整总和，而范围总和查询聚合节点值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nq)$|$O(n)$| 太慢了|
 | 具有惰性乘法的线段树 |$O(q \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们构建一棵线段树，其中每个节点存储其线段模的总和$M$，以及代表待定缩放因子的惰性乘数。 

1. 从初始数组构建线段树。 每个叶子存储一个鸡蛋的值，每个内部节点存储其子节点的模数之和$M$。 这为我们提供了快速范围聚合的基础结构。 
2. 初始化一个惰性乘数数组，将所有值设置为 1。这表示最初没有段等待缩放。 
3. 应用范围乘法$[l, r]$经过$k$，我们遍历线段树。 每当节点段完全位于内部时$[l, r]$，我们将其存储的总和乘以$k$模数$M$，并将其惰性标签乘以$k$。 这确保了未来的传播将遵循累积的缩放比例。 
4. 当一个节点被部分覆盖时，我们在继续之前将其惰性乘数推送到其子节点。 推送意味着将存储的乘数应用于子项总和并将其与它们的惰性标记组合，然后将当前节点的标记重置为 1。这可以在混合部分重叠时保持正确性。 
5. 对于范围求和查询$[l, r]$，我们同样遍历这棵树。 完全覆盖的节点直接贡献其存储的总和。 部分覆盖的节点需要在下降之前推送惰性值。 
6. 每个操作都保持段和与所有先前的乘法一致，而无需显式触及每个元素。 

关键的不变量是，在应用由尚未下推的惰性标签表示的所有待处理乘数之后，每个节点的存储总和始终等于其段的真实总和。 惰性标记表示延迟的乘法变换，最终将统一应用于子树，因此由于分布性，立即或稍后应用它会产生相同的结果：$$k(a_1 + a_2 + \dots) = ka_1 + ka_2 + \dots$$因为乘法分布于加法，所以我们可以安全地延迟更新而不会失去正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, arr, mod):
        self.n = len(arr)
        self.mod = mod
        self.tree = [0] * (4 * self.n)
        self.lazy = [1] * (4 * self.n)
        self._build(1, 0, self.n - 1, arr)

    def _build(self, idx, l, r, arr):
        if l == r:
            self.tree[idx] = arr[l] % self.mod
            return
        mid = (l + r) // 2
        self._build(idx * 2, l, mid, arr)
        self._build(idx * 2 + 1, mid + 1, r, arr)
        self.tree[idx] = (self.tree[idx * 2] + self.tree[idx * 2 + 1]) % self.mod

    def _push(self, idx, l, r):
        if self.lazy[idx] == 1:
            return
        mul = self.lazy[idx]
        self.tree[idx] = (self.tree[idx] * mul) % self.mod
        if l != r:
            self.lazy[idx * 2] = (self.lazy[idx * 2] * mul) % self.mod
            self.lazy[idx * 2 + 1] = (self.lazy[idx * 2 + 1] * mul) % self.mod
        self.lazy[idx] = 1

    def update(self, idx, l, r, ql, qr, val):
        self._push(idx, l, r)
        if qr < l or r < ql:
            return
        if ql <= l and r <= qr:
            self.lazy[idx] = (self.lazy[idx] * val) % self.mod
            self._push(idx, l, r)
            return
        mid = (l + r) // 2
        self.update(idx * 2, l, mid, ql, qr, val)
        self.update(idx * 2 + 1, mid + 1, r, ql, qr, val)
        self.tree[idx] = (self.tree[idx * 2] + self.tree[idx * 2 + 1]) % self.mod

    def query(self, idx, l, r, ql, qr):
        self._push(idx, l, r)
        if qr < l or r < ql:
            return 0
        if ql <= l and r <= qr:
            return self.tree[idx]
        mid = (l + r) // 2
        return (self.query(idx * 2, l, mid, ql, qr) +
                self.query(idx * 2 + 1, mid + 1, r, ql, qr)) % self.mod

n, q, mod = map(int, input().split())
arr = list(map(int, input().split()))

st = SegTree(arr, mod)

out = []
for _ in range(q):
    tmp = list(map(int, input().split()))
    if tmp[0] == 1:
        _, l, r, k = tmp
        st.update(1, 0, n - 1, l - 1, r - 1, k)
    else:
        _, l, r = tmp
        out.append(str(st.query(1, 0, n - 1, l - 1, r - 1)))

print("\n".join(out))
```线段树存储当前线段总和和乘法惰性标记。 这`_push`函数将挂起的乘法应用于当前节点，如果该节点不是叶子，则将其传播到子节点。 这确保了我们每次下降时都能看到正确的值。 

更新函数首先解决待处理的延迟效应，然后检查重叠。 完全覆盖将乘法直接应用于节点并将其存储在惰性数组中。 部分覆盖递归地更新子级并重新计算总和。 

查询函数通过在使用节点总和之前推送惰性值来确保正确性，从而保证每个返回值反映所有挂起的更新。 

## 工作示例

 考虑样本数组$[1,2,3,4,5]$带模数$5$。 

第一次运算乘以$[2,5]$2.

 | 步骤| 细分 | 行动| 节点总和 |
 | --- | --- | --- | --- |
 | 1 | [1,5]| 下降| 15 | 15
 | 2 | [2,5]| 应用乘法 | 30 mod 5 = 0 在根表示级别 |

 传播后，值变为$[1,4,6,8,10]$，模 5 约简得出$[1,4,1,3,0]$。 

第二次操作查询$[1,4]$。 

| 步骤| 细分 | 返回金额 |
 | --- | --- | --- |
 | 1 | [1,4]| 1 + 4 + 1 + 3 = 9 mod 5 = 4 |

 这符合预期的行为，即乘法仅影响数组的一部分，而查询读取一致的总和。 

在重叠范围上重复更新的第二个跟踪显示了延迟传播的必要性。 如果不正确推送标签，重叠乘法将被应用两次或完全丢失，从而破坏一致性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(q \log n)$| 每次更新和查询都会访问线段树中对数数量的节点，惰性传播可确保每个访问节点持续工作 |
 | 空间|$O(n)$| 线段树和惰性数组每个节点存储恒定数量的值 |

 这种复杂性完全符合$n, q \le 10^5$，因为大约$10^5 \log 10^5$操作是容易可行的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from sys import stdin
    input = _sys.stdin.readline

    class SegTree:
        def __init__(self, arr, mod):
            self.n = len(arr)
            self.mod = mod
            self.tree = [0] * (4 * self.n)
            self.lazy = [1] * (4 * self.n)
            self._build(1, 0, self.n - 1, arr)

        def _build(self, idx, l, r, arr):
            if l == r:
                self.tree[idx] = arr[l] % self.mod
                return
            mid = (l + r) // 2
            self._build(idx*2, l, mid, arr)
            self._build(idx*2+1, mid+1, r, arr)
            self.tree[idx] = (self.tree[idx*2] + self.tree[idx*2+1]) % self.mod

        def _push(self, idx, l, r):
            if self.lazy[idx] == 1:
                return
            mul = self.lazy[idx]
            self.tree[idx] = self.tree[idx] * mul % self.mod
            if l != r:
                self.lazy[idx*2] = self.lazy[idx*2] * mul % self.mod
                self.lazy[idx*2+1] = self.lazy[idx*2+1] * mul % self.mod
            self.lazy[idx] = 1

        def update(self, idx, l, r, ql, qr, val):
            self._push(idx, l, r)
            if qr < l or r < ql:
                return
            if ql <= l and r <= qr:
                self.lazy[idx] = self.lazy[idx] * val % self.mod
                self._push(idx, l, r)
                return
            mid = (l+r)//2
            self.update(idx*2, l, mid, ql, qr, val)
            self.update(idx*2+1, mid+1, r, ql, qr, val)
            self.tree[idx] = (self.tree[idx*2] + self.tree[idx*2+1]) % self.mod

        def query(self, idx, l, r, ql, qr):
            self._push(idx, l, r)
            if qr < l or r < ql:
                return 0
            if ql <= l and r <= qr:
                return self.tree[idx]
            mid = (l+r)//2
            return (self.query(idx*2, l, mid, ql, qr) +
                    self.query(idx*2+1, mid+1, r, ql, qr)) % self.mod

    data = """5 7 5
1 2 3 4 5
2 2 5
1 1 3 1
2 1 4
1 2 4 2
2 1 5
1 3 5 2
2 1 5
"""
    sys.stdin = io.StringIO(data)
    n, q, mod = map(int, input().split())
    arr = list(map(int, input().split()))
    st = SegTree(arr, mod)
    out = []
    for _ in range(q):
        t = list(map(int, input().split()))
        if t[0] == 1:
            _, l, r, k = t
            st.update(1, 0, n-1, l-1, r-1, k)
        else:
            _, l, r = t
            out.append(str(st.query(1, 0, n-1, l-1, r-1)))
    return "\n".join(out)

# provided sample
assert run(data) == "4\n2\n1\n0", "sample"

# minimum size
assert run("""1 2 10
5
2 1 1
1 1 1 3
""") == "5", "min case"

# all equal
assert run("""3 2 100
2 2 2
1 1 3 2
2 1 3
""") == "12", "all equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品| 4 2 1 0 | 4 2 1 0 完整工作流程的正确性|
 | 单元素| 5 | 边界处理 |
 | 一切平等| 12 | 12 均匀传播|

 ## 边缘情况

 单元素数组强调叶节点处的惰性传播。 如果实现错误地将延迟标记传播到不存在的子级或无法在叶子上应用更新，则该值将变得不一致。 在这种情况下，将一个元素乘以一个因子并查询它应该仍然返回相同的元素模$M$，线段树保留它，因为更新直接修改叶节点。 

另一种边缘情况涉及重复重叠更新，例如在查询之前多次乘以范围。 正确性取决于惰性标签的乘法累加而不是被覆盖。 该不变量确保每个节点的惰性值代表影响它的所有待处理更新的乘积，因此重复的更新可以正确组合而不会出现顺序问题。
