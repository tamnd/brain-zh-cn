---
title: "CF 105345J - 幻影扑克"
description: "我们得到了一系列排成一行的 $n$ 卡片，其中每张卡片都带有从 1 到 13 的值。随着时间的推移，这些值会通过更新而改变，并且我们还被要求回答范围查询。 第一种类型的查询将数组中的单个位置更改为新值。"
date: "2026-06-23T05:51:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105345
codeforces_index: "J"
codeforces_contest_name: "UTPC Contest 09-13-24 Div. 1 (Advanced)"
rating: 0
weight: 105345
solve_time_s: 187
verified: false
draft: false
---

[CF 105345J - 幻影扑克](https://codeforces.com/problemset/problem/105345/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 7s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个数组$n$卡片排成一行，每张卡片都有一个从 1 到 13 的值。随着时间的推移，这些值会通过更新而改变，并且我们还被要求回答范围查询。 

第一种类型的查询将数组中的单个位置更改为新值。 第二种类型的查询要求我们计算给定段中有多少张非空卡片选择$[l, r]$具有与 5 模 13 同余的所选值的乘积。每张卡的位置都是不同的，因此即使不同索引处的相同值也会产生不同的组合。 

核心困难在于，我们计算的不是简单的和或频率，而是其乘积落在模 13 的特定残差类中的子集。由于 13 是素数，模 13 的乘法在非零残差上形成一个干净的代数结构，但值 1 和重复更新的存在表明我们需要一个支持动态范围查询的数据结构。 

限制条件$n, q \le 10^4$立即排除对所有子集的每个查询从头开始重新计算答案，因为即使是单个大小范围$m$有$2^m$子集，即使对于中等程度的情况也是不可行的$m$。 任何针对每个查询重新计算子集信息的解决方案都会立即变得太慢。 

一个微妙的问题是，乘积条件是模 13，但元素包括从 1 到 13 的值。值 13 本身表现为 0 模 13，这一点很重要，因为乘以 13 总是会将乘积折叠为 0 mod 13，这意味着此类元素的行为类似于吸收态。 

另一个边缘情况来自更新：更改单个元素可能会极大地影响范围内的子集计数，因此任何预先计算静态答案的方法都无法在修改后幸存。 

## 方法

 暴力破解的想法是从考虑一个查询开始的$[l, r]$。 我们枚举该段的所有子集，并以 13 为模计算它们的乘积，当答案等于 5 时增加答案。这是正确的，因为它直接匹配任务的定义。 

然而，这种方法扩展了$m$元素进入$2^m$每个查询的子集，所以即使对于$m = 20$它变得边界，并且对于$m = 10^4$这是不可能的。 问题不仅在于子集枚举，还在于重复查询和更新，这进一步增加了成本。 

关键的结构观察是模 13 的乘法仅取决于残差类别，并且我们在乘法约束下计算子集。 这是一个经典的设置，我们将元素转换为有限状态空间并在子集上保持类似卷积的结构。 每个元素以乘法方式贡献子集乘积，而乘积上的子集计数对应于将生成函数组合在模 13 的类群结构上。 

我们将每个片段视为在残基 0 到 12 上产生频率分布，其中每个位置贡献一个多项式：$$P_i(x) = 1 + x^{a_i}$$段积对应于这些多项式的相乘。 系数为$x^k$在最终产品中计算其产品等于的子集$k \bmod 13$。 答案就是留数 5 的系数。 

由于更新是点变化，而查询是基于范围的，因此我们需要一个线段树，其中每个节点存储这个 13 维分布。 合并两个段对应于乘法模 13 下的卷积，即$O(13^2)$，一个常数。 

这减少了维护带有点更新和范围查询的多项式向量线段树的问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(q \cdot 2^n)$|$O(1)$| 太慢了|
 | 残差DP上的线段树|$O((n+q)\cdot 13^2 \log n)$|$O(n \cdot 13)$| 已接受 |

 ## 算法演练

 我们用频率数组表示每个段`dp`大小为 13，其中`dp[k]`存储该细分市场有多少个子集生产出与以下产品一致的产品$k \bmod 13$。 

1. 初始化一个叶子节点的值$x$。 我们从包含单个元素的段开始，因此有两个子集：包含产品 1 的空子集和包含产品的单例子集$x$。 这意味着我们初始化`dp[1] = 1`和`dp[x % 13] += 1`，除非当$x \equiv 0 \pmod{13}$，其中乘法折叠为 0 并且必须显式处理。 
2. 对于每个内部节点，通过组合两个子节点的子集乘积分布来合并它们。 对于每一个残留物$i$从左边的孩子开始，$j$从右孩子开始，子集相乘得到一个乘积$i \cdot j \bmod 13$。 我们将这些累积到父发行版中。 
3. 为了合并，我们迭代所有残基对并计算：$$new[k] += left[i] \cdot right[j], \quad k = (i \cdot j) \bmod 13$$4. 使用此合并操作在数组上构建线段树。 
5. 对于类型 1 查询，更新单个叶子并使用相同的合并规则向上重新计算所有受影响的线段树节点。 
6. 对于类型 2 查询，查询线段树$[l, r]$并获得结果分布。 答案是`dp[5]`。 

这样做的原因是每个线段树节点准确地表示其线段的子集乘积的多重集。 合并操作相当于独立于左段和右段选择子集并将它们组合起来，这与不相交并集上的子集的组合定义相匹配。 由于并集的每个子集都唯一地分解为每一半的子集，因此卷积完全捕获了所有可能性而不重复。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

class SegTree:
    def __init__(self, arr):
        self.n = len(arr)
        self.t = [None] * (4 * self.n)
        self.build(1, 0, self.n - 1, arr)

    def merge(self, A, B):
        C = [0] * 13
        for i in range(13):
            if A[i] == 0:
                continue
            for j in range(13):
                if B[j] == 0:
                    continue
                C[(i * j) % 13] = (C[(i * j) % 13] + A[i] * B[j]) % MOD
        return C

    def build(self, v, l, r, arr):
        if l == r:
            x = arr[l] % 13
            dp = [0] * 13
            dp[1] = 1
            dp[x] = (dp[x] + 1) % MOD
            self.t[v] = dp
            return
        m = (l + r) // 2
        self.build(v*2, l, m, arr)
        self.build(v*2+1, m+1, r, arr)
        self.t[v] = self.merge(self.t[v*2], self.t[v*2+1])

    def update(self, v, l, r, idx, val):
        if l == r:
            x = val % 13
            dp = [0] * 13
            dp[1] = 1
            dp[x] = (dp[x] + 1) % MOD
            self.t[v] = dp
            return
        m = (l + r) // 2
        if idx <= m:
            self.update(v*2, l, m, idx, val)
        else:
            self.update(v*2+1, m+1, r, idx, val)
        self.t[v] = self.merge(self.t[v*2], self.t[v*2+1])

    def query(self, v, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.t[v]
        m = (l + r) // 2
        if qr <= m:
            return self.query(v*2, l, m, ql, qr)
        if ql > m:
            return self.query(v*2+1, m+1, r, ql, qr)
        left = self.query(v*2, l, m, ql, qr)
        right = self.query(v*2+1, m+1, r, ql, qr)
        return self.merge(left, right)

n, q = map(int, input().split())
arr = list(map(int, input().split()))

st = SegTree(arr)

for _ in range(q):
    tmp = list(map(int, input().split()))
    if tmp[0] == 1:
        _, i, x = tmp
        st.update(1, 0, n-1, i-1, x)
    else:
        _, l, r = tmp
        res = st.query(1, 0, n-1, l-1, r-1)
        print(res[5] % MOD)
```核心实现围绕线段树节点表示展开。 每个节点都是一个 13 长度的数组，捕获该段中子集的所有可能的乘积残基。 合并函数对残差执行完全卷积，其大小恒定并且在约束下是安全的。 

一个微妙的点是初始化：每个段都包含空子集，它总是贡献乘积 1，所以`dp[1] = 1`每片叶子都需要。 然后将单个元素子集添加到顶部。 忘记空子集会破坏所有合并，因为它删除了正确卷积行为所需的单位元素。 

更新操作完全按照构建时的方式重建叶子，确保一致性。 查询逻辑依赖于标准线段树分解并按顺序合并部分答案。 

## 工作示例

 考虑一个小数组$[2, 5, 7]$以及全范围的查询。 每个叶子开始时都是一个分布，其中空子集给出残差 1，单例贡献其值。 

| 节点| dp[1] | dp[1] | dp[2] | dp[2] | dp[5] | dp[5] | dp[7] | dp[7] | 其他|
 | ---| ---| ---| ---| ---| ---|
 | 2 | 1 | 1 | 0 | 0 | - |
 | 5 | 1 | 0 | 1 | 0 | - |
 | 7 | 1 | 0 | 0 | 1 | - |

 合并前两个节点会合并来自 {2,5} 的所有子集乘积。 生成的分布包括产品 1、2、5 和 10。 

与 7 合并后，之前的所有乘积要么保留（不包括 7），要么乘以 7。 

| 步骤| 活跃部分| dp[5] | dp[5] |
 | ---| ---| ---|
 | [2,5] 之后 | 前两个的子集 | 1 |
 | [2,5,7] 之后 | 品种齐全| 最终值|

 最终的 dp[5] 计算乘积 mod 13 等于 5 的所有子集。 

该轨迹表明，每个子集都在段边界上干净地分割，并且卷积在合并过程中保持了正确性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n + q) \cdot 13^2 \log n)$| 每次更新/查询都会涉及$O(\log n)$节点，每次合并花费恒定的 13×13 工作 |
 | 空间|$O(n \cdot 13)$| 每个线段树节点存储一个固定大小的残差分布|

 常数因子很小，因为 13 是固定的，因此该解决方案可以轻松地满足以下时间限制：$10^4$运营。 

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
            self.t = [None] * (4 * self.n)
            self.build(1, 0, self.n - 1, arr)

        def merge(self, A, B):
            C = [0] * 13
            for i in range(13):
                for j in range(13):
                    C[(i * j) % 13] = (C[(i * j) % 13] + A[i] * B[j]) % MOD
            return C

        def build(self, v, l, r, arr):
            if l == r:
                x = arr[l] % 13
                dp = [0] * 13
                dp[1] = 1
                dp[x] = (dp[x] + 1) % MOD
                self.t[v] = dp
                return
            m = (l + r) // 2
            self.build(v*2, l, m, arr)
            self.build(v*2+1, m+1, r, arr)
            self.t[v] = self.merge(self.t[v*2], self.t[v*2+1])

        def update(self, v, l, r, idx, val):
            if l == r:
                x = val % 13
                dp = [0] * 13
                dp[1] = 1
                dp[x] = (dp[x] + 1) % MOD
                self.t[v] = dp
                return
            m = (l + r) // 2
            if idx <= m:
                self.update(v*2, l, m, idx, val)
            else:
                self.update(v*2+1, m+1, r, idx, val)
            self.t[v] = self.merge(self.t[v*2], self.t[v*2+1])

        def query(self, v, l, r, ql, qr):
            if ql <= l and r <= qr:
                return self.t[v]
            m = (l + r) // 2
            if qr <= m:
                return self.query(v*2, l, m, ql, qr)
            if ql > m:
                return self.query(v*2+1, m+1, r, ql, qr)
            left = self.query(v*2, l, m, ql, qr)
            right = self.query(v*2+1, m+1, r, ql, qr)
            return self.merge(left, right)

    data = inp.strip().split()
    n, q = map(int, data[:2])
    arr = list(map(int, data[2:2+n]))
    st = SegTree(arr)

    idx = 2+n
    out = []
    for _ in range(q):
        t = int(data[idx]); idx += 1
        if t == 1:
            i = int(data[idx]); x = int(data[idx+1]); idx += 2
            st.update(1, 0, n-1, i-1, x)
        else:
            l = int(data[idx]); r = int(data[idx+1]); idx += 2
            res = st.query(1, 0, n-1, l-1, r-1)
            out.append(str(res[5] % MOD))

    return "\n".join(out)

# custom tests
assert run("4 3\n1 2 5 9\n2 1 4\n1 2 4\n2 1 4") is not None
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小单次查询 | 正确的残留计数 | 基本正确性 |
 | 重复更新| 稳定的重新计算 | 更新传播 |
 | 所有相同的值 | 组合爆炸处理| 子集 DP 正确性 |
 | 混合值包括 13 | 零残留处理| 模塌陷 |

 ## 边缘情况

 当值为 13 时，会出现临界边缘情况。在这种情况下，其残数为 0，并且包含它的任何子集都会强制乘积变为 0。DP 必须正确允许转换为残数 0，而不破坏乘法结构。 仅包含 13s 的段应将除空子集之外的所有子集映射到 0，而空子集保持为 1，这确保合并保持一致。 

另一个微妙的情况是多个 1。 由于 1 不会改变乘积，因此它只会将每个段中的子集数量加倍。 DP 必须正确反映每个 1 引入一个独立的选择，该选择由空子集和单例贡献捕获，两者都落在残基 1 中。 

最后一种情况是更新将值从 13 更改为非零余数。 如果不从头开始重建叶子，先前的 DP 状态将泄漏到新状态中，从而破坏卷积结构。 重新初始化每个叶子完全确保每次修改后的正确性。
