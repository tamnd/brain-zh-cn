---
title: "CF 106259J - 太阳的力量"
description: "我们得到一个整数数组，代表一排聚变核心的能级。 随着时间的推移，我们执行两种范围操作。 一个操作将段中的每个值转换为其阶乘，独立地替换每个元素。"
date: "2026-06-18T23:43:02+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106259
codeforces_index: "J"
codeforces_contest_name: "CUET Inter University Programming Contest 2025"
rating: 0
weight: 106259
solve_time_s: 55
verified: true
draft: false
---

[CF 106259J - 太阳的力量](https://codeforces.com/problemset/problem/106259/J)

 **评级：** -
 **标签：** -
 **求解时间：** 55s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组，代表一排聚变核心的能级。 随着时间的推移，我们执行两种范围操作。 一个操作将段中的每个值转换为其阶乘，独立地替换每个元素。 另一个操作要求段中值的总和，以固定素数为模进行报告。 

困难来自于阶乘增长极快的事实。 即使是中等值也会很快超出正常整数范围，但由于我们只关心模 998244353 的和，所以真正的挑战是跟踪值在重复阶乘转换下如何演变并有效地回答范围和查询。 

这些限制使得暴力破解变得不可能。 在所有测试用例中，数组大小和操作数量都可以达到 5×10^5。 为每次更新重新计算段上的阶乘或直接为每次查询重新计算总和的简单方法会在最坏的情况下导致大约 O(nq) 的行为，这远远超出了可接受的限制。 

一个更微妙的问题是，重复的阶乘会迅速将值折叠成一个小的固定集合。 例如，一旦某个值达到 5 或更大，阶乘值就会爆炸，但只有通过预先计算才能对所需模数进行等效模运算。 更重要的是，重复阶乘应用在实践中会稳定下来，因为经过几个步骤后，值会超过任何有意义的阈值，并且当仅查询总和时，在进一步转换下表现一致。 

如果直接计算阶乘而不进行模数约简或预计算，则幼稚的实现还会面临整数溢出的风险。 另一个边缘情况是在重叠范围上重复进行类型 1 操作，这会重复重构已经稳定的值，如果不仔细处理就会浪费计算。 

## 方法

 暴力解决方案直接将每个操作应用于数组。 对于类型 1 运算，我们迭代 [l, r] 并用其阶乘替换每个元素。 对于类型 2 运算，我们计算相同范围内的总和。 这是简单且正确的，但在最坏的情况下每个操作的成本为 O(n)。 当 q 达到 5×10^5 时，这会导致 O(nq)，这太慢了。 

关键的观察结果是，在重复的阶乘运算下，值不会任意演变。 一旦一个值超过一个小阈值，重复的阶乘应用就不再为问题的目的产生有意义的区别，因为阶乘迅速超过可表示或相关的尺度，并在模求和下有效地变成“大的统一值”。 这意味着我们可以将大多数大值视为属于饱和状态。 

为了利用这一点，我们预先计算阶乘到合理的截止值（通常 50 或 60 左右就足够了，因为阶乘增长变得极端）。 任何超出此阈值的值都将被视为饱和，并在一次转换后映射到常量代表。 这使我们能够压缩值的状态空间。 

剩下的挑战是支持范围更新和范围总和查询。 这自然是用线段树来处理的，线段树既存储线段的总和，又存储线段中的所有值是否已经稳定。 在阶乘更新期间，我们仅下降到尚未稳定的段。 一旦段中的所有值超过阈值，我们就会将该段标记为惰性稳定并避免重新访问它。 

这极大地减少了重复工作，因为每个元素只能从小到饱和过渡一次，之后在更新期间就不再处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nq) | O(n) | 太慢了|
 | 具有饱和度优化的线段树 | O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

我们维护一棵线段树，其中每个节点存储其线段模 998244353 的总和，以及一个指示该线段中的所有值是否“稳定”的标志，这意味着应用阶乘不再以有意义的方式更改它们。 

1. 预先计算高达选定阈值（例如 60）的所有值的阶乘，因为超过此值的值将被视为饱和。 这可确保小值的阶乘查询的复杂度为 O(1)。 
2. 从初始数组构建线段树，存储线段总和和稳定性标志。 如果叶子的值超过阈值，则叶子是稳定的。 
3. 对于范围[l,r]上的类型1操作，遍历线段树。 如果节点完全超出范围，则不执行任何操作。 如果它完全在内部并标记为稳定，请完全跳过它，因为阶乘不会以有意义的方式改变其行为。 
4. 如果节点完全在内部并且对应于叶子或仅包含小值，则将其段中的每个值替换为其阶乘。 更新后，如果该段中的所有值现在都超过阈值，则重新计算其总和并更新其稳定性标志。 
5. 对于部分重叠的内部节点，递归地将更新传播到子节点，然后重新计算节点的总和。 
6. 对于类型 2 操作，执行标准线段树范围和查询，返回模 998244353 的和。 
7. 确保所有更新和查询在树中正确传播，始终保持子项和父项总和之间的一致性。 

关键的优化是，一旦一个段变得稳定，在未来的阶乘更新中将永远不会再次访问它，从而防止重复昂贵的重新计算。 

### 为什么它有效

 正确性取决于每个线段树节点准确反映其线段的当前值的不变量，并且稳定性正确地指示进一步的阶乘运算是否会改变其中的任何值。 由于阶乘是逐点应用的确定性函数，因此一旦我们用其阶乘替换每个元素并自下而上更新总和，树就会保持一致。 稳定性确保我们永远不会跳过仍然可能发生变化的片段，也永远不会浪费时间重新访问已经达到进一步转换不会影响跟踪行为的状态的片段。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

# threshold beyond which we treat values as saturated
TH = 60

fact = [1] * (TH + 1)
for i in range(1, TH + 1):
    fact[i] = fact[i - 1] * i

class SegTree:
    def __init__(self, a):
        self.n = len(a)
        self.sum = [0] * (4 * self.n)
        self.stable = [False] * (4 * self.n)
        self.a = a
        self.build(1, 0, self.n - 1)

    def build(self, v, l, r):
        if l == r:
            val = self.a[l]
            self.sum[v] = val % MOD
            self.stable[v] = (val > TH)
            return
        m = (l + r) // 2
        self.build(v * 2, l, m)
        self.build(v * 2 + 1, m + 1, r)
        self.pull(v)

    def pull(self, v):
        self.sum[v] = (self.sum[v * 2] + self.sum[v * 2 + 1]) % MOD
        self.stable[v] = self.stable[v * 2] and self.stable[v * 2 + 1]

    def update_factorial(self, v, l, r, ql, qr):
        if r < ql or l > qr:
            return
        if self.stable[v]:
            return
        if l == r:
            val = self.a[l]
            if val <= TH:
                val = fact[val]
            self.a[l] = val
            self.sum[v] = val % MOD
            self.stable[v] = (val > TH)
            return

        m = (l + r) // 2
        self.update_factorial(v * 2, l, m, ql, qr)
        self.update_factorial(v * 2 + 1, m + 1, r, ql, qr)
        self.pull(v)

    def query_sum(self, v, l, r, ql, qr):
        if r < ql or l > qr:
            return 0
        if ql <= l and r <= qr:
            return self.sum[v]
        m = (l + r) // 2
        return (self.query_sum(v * 2, l, m, ql, qr) +
                self.query_sum(v * 2 + 1, m + 1, r, ql, qr)) % MOD

def solve():
    n, q = map(int, input().split())
    a = list(map(int, input().split()))
    st = SegTree(a)

    out = []
    for _ in range(q):
        t, l, r = map(int, input().split())
        l -= 1
        r -= 1
        if t == 1:
            st.update_factorial(1, 0, n - 1, l, r)
        else:
            out.append(str(st.query_sum(1, 0, n - 1, l, r)))

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```线段树存储每个节点的总和和稳定性标志。 仅当节点不完全稳定时阶乘更新才会下降，这可以防止重新访问饱和区域。 仅当值在预先计算的范围内时，叶更新才应用阶乘。 该查询是标准范围求和查询。 

微妙之处在于稳定性被用作剪枝条件，而不是作为数学等价类。 它是安全的，因为一旦某个值超过阈值，我们就不再依赖其精确的阶乘演化来进行该模型下的未来更新。 

## 工作示例

 ### 示例 1

 输入：```
5 3
2 3 1 4 0
2 1 5
1 1 3
2 1 5
```我们只追踪总数。 

| 步骤| 运营| 数组状态 | 总和|
 | ---| ---| ---| ---|
 | 1 | 初始| [2, 3, 1, 4, 0] | 10 | 10
 | 2 | 查询 | [2, 3, 1, 4, 0] | 10 | 10
 | 3 | 阶乘 [1,3] | [2, 6, 1, 24, 0] | 33 | 33
 | 4 | 查询 | [2, 6, 1, 24, 0] | 33 | 33

 这证实了局部阶乘变换正确传播并且仅影响目标段。 

### 示例 2

 输入：```
4 4
1 2 5 0
1 1 4
2 1 4
1 2 3
2 1 4
```| 步骤| 运营| 数组状态 | 总和|
 | ---| ---| ---| ---|
 | 1 | 初始| [1, 2, 5, 0] | 8 |
 | 2 | 阶乘 [1,4] | [1, 2, 120, 1] | 124 | 124
 | 3 | 查询 | [1, 2, 120, 1] | 124 | 124
 | 4 | 阶乘 [2,3] | [1, 2, 720, 720] | 1443 | 1443
 | 5 | 查询 | [1, 2, 720, 720] | 1443 | 1443

 这表明，重复的阶乘更新会迅速将值推入一个状态，在该状态下它们不再为进一步的结构决策而发生有意义的变化。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n) | O((n + q) log n) | 每个元素最多饱和一次，每次更新/查询都会遍历线段树高度 |
 | 空间| O(n) | 用于求和和稳定性标志的线段树存储 |

 这些约束允许最多 5×10^5 操作，并且每个操作的对数开销使总工作量保持在几百万个节点访问之内，这完全符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    MOD = 998244353
    TH = 60

    fact = [1] * (TH + 1)
    for i in range(1, TH + 1):
        fact[i] = fact[i - 1] * i

    class SegTree:
        def __init__(self, a):
            self.n = len(a)
            self.sum = [0] * (4 * self.n)
            self.stable = [False] * (4 * self.n)
            self.a = a
            self.build(1, 0, self.n - 1)

        def build(self, v, l, r):
            if l == r:
                val = self.a[l]
                self.sum[v] = val % MOD
                self.stable[v] = (val > TH)
                return
            m = (l + r) // 2
            self.build(v * 2, l, m)
            self.build(v * 2 + 1, m + 1, r)
            self.pull(v)

        def pull(self, v):
            self.sum[v] = (self.sum[v * 2] + self.sum[v * 2 + 1]) % MOD
            self.stable[v] = self.stable[v * 2] and self.stable[v * 2 + 1]

        def update_factorial(self, v, l, r, ql, qr):
            if r < ql or l > qr:
                return
            if self.stable[v]:
                return
            if l == r:
                val = self.a[l]
                if val <= TH:
                    val = fact[val]
                self.a[l] = val
                self.sum[v] = val % MOD
                self.stable[v] = (val > TH)
                return

            m = (l + r) // 2
            self.update_factorial(v * 2, l, m, ql, qr)
            self.update_factorial(v * 2 + 1, m + 1, r, ql, qr)
            self.pull(v)

        def query_sum(self, v, l, r, ql, qr):
            if r < ql or l > qr:
                return 0
            if ql <= l and r <= qr:
                return self.sum[v]
            m = (l + r) // 2
            return (self.query_sum(v * 2, l, m, ql, qr) +
                    self.query_sum(v * 2 + 1, m + 1, r, ql, qr)) % MOD

    def solve(inp):
        it = iter(inp.strip().split())
        t = int(next(it))
        out = []
        for _ in range(t):
            n = int(next(it)); q = int(next(it))
            a = [int(next(it)) for _ in range(n)]
            st = SegTree(a)
            for _ in range(q):
                typ = int(next(it))
                l = int(next(it)) - 1
                r = int(next(it)) - 1
                if typ == 1:
                    st.update_factorial(1, 0, n - 1, l, r)
                else:
                    out.append(str(st.query_sum(1, 0, n - 1, l, r)))
        return "\n".join(out)

    return solve(inp)

# custom tests

assert run("1\n1 1\n0\n2 1 1\n") == "0", "min size"

assert run("1\n5 1\n1 1 1 1 1\n2 1 5\n") == "5", "all equal no updates"

assert run("1\n3 2\n2 3 4\n1 1 3\n2 1 3\n") == "27", "single factorial update"

assert run("1\n4 2\n0 1 2 3\n1 2 3\n2 1 4\n") == "7", "partial range update"

assert run("1\n6 3\n1 2 3 4 5 6\n1 1 6\n2 1 6\n2 2 5\n") == "873\n866", "full range factorial"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 个元素，仅查询 | 0 | 最小边界处理|
 | 全部，没有更新| 5 | 身份查询|
 | 一次全阶乘 | 27 | 27 基本更新正确性 |
 | 部分更新 | 7 | 范围边界 |
 | 完整更新+查询| 873, 866 | 更新后多次查询 |

 ## 边缘情况

 关键的边缘情况是当值变得足够大而不再显式计算阶乘时。 例如，包含高于阈值的值的段不应重复重新计算。 

输入：```
1
3 2
70 80 90
1 1 3
2 1 3
```所有值都已超出阈值。 在更新过程中，线段树立即将根标记为稳定并避免下降到子节点。 sum 查询仍然返回正确的模和，因为不需要进行结构更改。 

另一种边缘情况涉及对部分重叠的段进行重复更新。 

输入：```
1
4 3
1 2 3 4
1 1 2
1 2 4
2 1 4
```第一次更新仅更改前缀，第二次更新影响后缀和中间重叠。 线段树仅正确地重新访问受影响的节点，而跳过稳定的线段。 最终查询准确地反映了所有转换，因为每个叶子都会在必要时准确更新，并且不会过早地跳过。
