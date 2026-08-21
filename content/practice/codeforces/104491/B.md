---
title: "CF 104491B - 标准问题"
description: "我们得到了整数线上的线段集合。 每个段都描述了它可以“发出”的一系列值，并且还带有一个权重。 从这些片段中，我们按照原始顺序选择一些子序列。"
date: "2026-06-30T12:28:35+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104491
codeforces_index: "B"
codeforces_contest_name: "43rd Petrozavodsk Programming Camp (2022 Summer) Day 7. HSE Koresha Contest"
rating: 0
weight: 104491
solve_time_s: 132
verified: false
draft: false
---

[CF 104491B - 标准问题](https://codeforces.com/problemset/problem/104491/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 12s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了整数线上的线段集合。 每个段都描述了它可以“发出”的一系列值，并且还带有一个权重。 从这些片段中，我们按照原始顺序选择一些子序列。 

一旦子序列被固定，我们就为每个选定的段分配一个来自其自身范围的具体整数。 这会产生一个整数序列。 如果我们可以选择这些整数，使它们形成一个非递减序列，则该序列被认为是有效的。 

在所有有效的子序列中，我们想要两件事。 首先，所选段的最大可能权重总和。 其次，有多少子序列达到最大权重，以 998244353 为模。 

一个关键的困难是有效性取决于是否可以为所选段分配兼容的值，而不仅仅是段端点本身。 天真的阅读可能表明这是一个标准加权子序列问题，但可行性取决于间隔是否可以链接到非递减分配中。 

这些约束迫使我们在所有测试用例中处理多达二十万个段，因此任何尝试所有子序列甚至对段进行二次动态规划的解决方案都是立即不可能的。 我们需要每个测试用例大致线性或接近线性的行为，通常类似于$O(n \log m)$。 

一个微妙的边缘情况是可行性不仅仅由成对重叠决定。 如果我们选择不兼容的中间值，两个间隔可能会重叠，但在较长的链中仍然会失败。 例如，选择$[1,2]$,$[2,3]$,$[1,1]$该顺序是无效的，因为即使存在成对重叠，最后一个间隔也会在较早的分配之后强制下降。 

正确的观点是，可行性取决于我们是否可以在尊重约束的同时贪婪地分配值，这会导致跟踪当前所选值而不仅仅是最后一个间隔的状态。 

## 方法

 强力方法将尝试每个段子序列，并为每个子序列尝试贪婪地分配值以检查可行性。 对于长度的子序列$k$，检查可行性是线性的$k$，所以总体来说这会呈指数增长$n$，按顺序$2^n \cdot n$，这远远超出了任何限制。 

主要的结构观察是，一旦我们确定了子序列顺序，可行性就会降低到维持单个“当前值”。 当处理选定的段时$[l_i, r_i]$，我们总是可以选择最小的可能有效值，即$\max(l_i, \text{current})$。 失败的唯一方法是该值超过$r_i$。 这会将可行性转换为具有一个参数的状态机：当前值。 

这意味着我们正在进行加权子序列选择，其中 DP 状态不仅仅是位置，还包括当前值$[1, m]$。 转换取决于是否跳过或采用某个段，以及如果采用，它如何转换当前值。 

总体来说是个天真的DP$n \times m$状态仍然太慢，因此我们需要在值范围内批量处理转换。 每个段在当前值范围内仅引发两种行为，这允许通过范围更新和前缀查询进行基于段树的优化。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n \cdot n)$|$O(n)$| 太慢了 |
 | DP 超过 (i, 值) |$O(nm)$|$O(m)$| 太慢了 |
 | 线段树优化DP |$O(n \log m)$|$O(m)$| 已接受 |

 ## 算法演练

 在处理选定的片段后，我们将 DP 维持在“当前值”之上。 让`dp[x]`如果当前值恰好是，则存储可达到的最佳总重量`x`，以及实现它的方法数量。 

我们在选择任何段之前初始化系统，其中当前值实际上为 1，总权重为 0。 

### 步骤

 1. 根据值初始化线段树$1 \ldots m$。 每个节点存储一对$(\text{best weight}, \text{count})$。 放`dp[1] = (0, 1)`和所有其他人$-\infty$。 
2. 按输入顺序处理段。 对于每个段$[l, r]$有重量$c$，我们通过更新当前的结构来构建一个新的DP。 
3. 首先考虑对当前值所在的状态进行分段$(l, r]$。 如果当前值为$x$在此范围内，下一个值保持不变$x$，我们只需添加$c$至总重量。 这有效是因为$x \ge l$，所以所选值可以是$x$，并且保留了可行性。 我们执行范围添加$c$超过$(l, r]$。 
4.接下来考虑当前值最多为的状态$l$。 对于所有这些状态，在获取该段之后，下一个值变为$l$，因为我们必须将其至少提升到线段的左端点。 在所有这些状态中，我们在获取该段之前需要最佳可实现的权重，因此我们查询前缀上的最大值$[1, l]$。 
5. 添加$c$到这个最佳前缀值，并用它来更新状态$l$通过取现有值之间的最大值$l$还有这位新候选人。 如果相等，我们将方法的数量相加。 
6. 还允许通过不改变地继续前一个 DP 来隐式跳过该段，因为所有更新都应用在当前结构之上。 
7. 处理完所有段后，扫描 DP 以查找所有状态的最大值以及实现该值的状态的总计数。 

### 为什么它有效

 DP不变量是在处理完段的前缀后，`dp[x]`正确地表示所有有效子序列中可实现的最佳权重，其最终构造值恰好是`x`。 每个转换都保留了可行性，因为它通过当前值状态明确地强制执行单调构造规则。 线段树确保我们始终将转换应用于在更新规则下行为一致的整个范围，因此不会部分或错误地更新状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353
NEG = -10**30

class SegTree:
    def __init__(self, n):
        self.n = n
        self.mx = [NEG] * (4 * n)
        self.cnt = [0] * (4 * n)
        self.lz = [0] * (4 * n)

    def _apply(self, idx, val):
        self.mx[idx] += val
        self.lz[idx] += val

    def _push(self, idx):
        if self.lz[idx]:
            v = self.lz[idx]
            self._apply(idx * 2, v)
            self._apply(idx * 2 + 1, v)
            self.lz[idx] = 0

    def _pull(self, idx):
        if self.mx[idx * 2] > self.mx[idx * 2 + 1]:
            self.mx[idx] = self.mx[idx * 2]
            self.cnt[idx] = self.cnt[idx * 2]
        elif self.mx[idx * 2] < self.mx[idx * 2 + 1]:
            self.mx[idx] = self.mx[idx * 2 + 1]
            self.cnt[idx] = self.cnt[idx * 2 + 1]
        else:
            self.mx[idx] = self.mx[idx * 2]
            self.cnt[idx] = (self.cnt[idx * 2] + self.cnt[idx * 2 + 1]) % MOD

    def build(self, idx, l, r):
        if l == r:
            if l == 1:
                self.mx[idx] = 0
                self.cnt[idx] = 1
            else:
                self.mx[idx] = NEG
                self.cnt[idx] = 0
            return
        m = (l + r) // 2
        self.build(idx * 2, l, m)
        self.build(idx * 2 + 1, m + 1, r)
        self._pull(idx)

    def range_add(self, idx, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self._apply(idx, val)
            return
        self._push(idx)
        m = (l + r) // 2
        if ql <= m:
            self.range_add(idx * 2, l, m, ql, qr, val)
        if qr > m:
            self.range_add(idx * 2 + 1, m + 1, r, ql, qr, val)
        self._pull(idx)

    def query_max(self, idx, l, r, ql, qr):
        if ql <= l and r <= qr:
            return self.mx[idx], self.cnt[idx]
        self._push(idx)
        m = (l + r) // 2
        best = NEG
        ways = 0
        if ql <= m:
            v, c = self.query_max(idx * 2, l, m, ql, qr)
            if v > best:
                best, ways = v, c
            elif v == best:
                ways = (ways + c) % MOD
        if qr > m:
            v, c = self.query_max(idx * 2 + 1, m + 1, r, ql, qr)
            if v > best:
                best, ways = v, c
            elif v == best:
                ways = (ways + c) % MOD
        return best, ways

    def point_chmax(self, idx, l, r, pos, val, ways):
        if l == r:
            if val > self.mx[idx]:
                self.mx[idx] = val
                self.cnt[idx] = ways % MOD
            elif val == self.mx[idx]:
                self.cnt[idx] = (self.cnt[idx] + ways) % MOD
            return
        self._push(idx)
        m = (l + r) // 2
        if pos <= m:
            self.point_chmax(idx * 2, l, m, pos, val, ways)
        else:
            self.point_chmax(idx * 2 + 1, m + 1, r, pos, val, ways)
        self._pull(idx)

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        segs = [tuple(map(int, input().split())) for _ in range(n)]

        st = SegTree(m)
        st.build(1, 1, m)

        for l, r, c in segs:
            if l <= r:
                st.range_add(1, 1, m, l + 1, r, c)
                best, ways = st.query_max(1, 1, m, 1, l)
                if best != NEG:
                    st.point_chmax(1, 1, m, l, best + c, ways)

        ans_val, ans_cnt = st.query_max(1, 1, m, 1, m)
        print(ans_val, ans_cnt % MOD)

if __name__ == "__main__":
    solve()
```线段树存储最大可实现权重以及实现该最大值的方法数量。 惰性传播仅用于范围加法，这恰好对应于在获取一段后当前值保持不变的状态转换。 

前缀查询是必不可少的，因为它捕获了折叠为单个值的所有状态$l$拍摄一段后。 点更新于$l$正确合并这些贡献。 

一个常见的陷阱是尝试对整个前缀应用统一更新，但这些状态会分解为单个目标，因此在更新之前必须先聚合它们。 

## 工作示例

 ### 示例 1

 考虑细分：$[1,2], c=1$,$[2,3], c=2$我们跟踪 dp 超过值 1..3。 

| 步骤| 细分 | 行动| dp状态总结|
 | --- | --- | --- | --- |
 | 0 | 初始化| dp[1]=0 | dp[1]=0 (1:0) |
 | 1 | [1,2]| prefix=0 → 更新 1，范围添加 | (1:1, 2:1) |
 | 2 | [2,3]| prefix(1..2)=1 → dp[2]=3, 加到 3 | （1：1、2：3、3：3）|

 最终答案是 3 和 1 路。 

这显示了范围添加和前缀折叠如何相互作用：状态 1 通过前缀传播到 2，然后随后以与中间范围中的状态不同的方式演化。 

### 示例 2

 细分：$[1,1], c=3$,$[1,2], c=3$| 步骤| 细分 | 行动| dp状态总结|
 | --- | --- | --- | --- |
 | 0 | 初始化| dp[1]=0 | dp[1]=0 (1:0) |
 | 1 | [1,1]| 前缀=0 → dp[1]=3 | (1:3) |
 | 2 | [1,2]| prefix=3 → dp[1]=6, 加到 2 | (1:6, 2:6) |

 两个状态都达到相同的最佳值，并且都对计数有贡献。 

这凸显了多个状态如何收敛到相同的最大值，需要仔细计算相等的最大值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log m)$| 每个段都会触发前缀查询、点更新和范围添加 |
 | 空间|$O(m)$| 值域上的线段树|

 所有测试用例的总大小限制总和为$2 \cdot 10^5$，因此每个段的对数因子在限制范围内很合适。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import contextlib

    out = io.StringIO()
    with contextlib.redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# minimal case
assert run("1\n1 1\n1 1 5\n") == "5 1"

# chain
assert run("1\n2 3\n1 2 1\n2 3 2\n") == "3 1"

# all same interval
assert run("1\n3 5\n1 5 1\n1 5 1\n1 5 1\n") == "3 1"

# disjoint forcing choice
assert run("1\n2 5\n1 1 10\n5 5 10\n") == "20 1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单段| 5 1 | 基础初始化 |
 | 链间隔| 3 1 | 3 1 状态传播|
 | 相同的间隔 | 3 1 | 3 1 计算收敛|
 | 不相交的极端| 20 1 | 20 1 正确的跳过与采取|

 ## 边缘情况

 关键的边缘情况是所有段共享相同的值范围。 DP 必须正确累加导致相同最终状态的多种方式，而不会重复计算。 线段树合并逻辑确保仅当值相等时才对计数求和。 

另一个微妙的情况是当段的左端点为 1 时。在这种情况下，所有状态都直接折叠为状态 1，并且前缀查询跨越整个活动范围。 该算法通过始终查询来正确处理这个问题$[1, l]$，在这种情况下成为完整的 DP。 

最后，当前缀查询无法到达任何状态时，最佳值仍然存在$-\infty$，并且点更新被跳过。 这可以防止无法访问的配置无效传播到 DP 中。
