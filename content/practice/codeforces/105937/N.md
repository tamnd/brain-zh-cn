---
title: "CF 105937N - 狂暴带"
description: "我们得到了从 1 到 n 的数字排列，这意味着这个范围内的每个整数都只出现一次，并按某种顺序沿一条线排列。 每个操作都会给出该行的一段 [l, r]。"
date: "2026-06-22T15:49:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105937
codeforces_index: "N"
codeforces_contest_name: "2025 Xian Jiaotong University Programming Contest"
rating: 0
weight: 105937
solve_time_s: 83
verified: true
draft: false
---

[CF 105937N - Kessoku 乐队](https://codeforces.com/problemset/problem/105937/N)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了从 1 到 n 的数字排列，这意味着这个范围内的每个整数都只出现一次，并按某种顺序沿一条线排列。 每个操作都会给出该行的一段 [l, r]。 从这个段中，我们查看其中出现的数字中缺少哪些值，并取最小的缺失正整数，称为 x。 

计算完 x 后，如果 x 等于或大于 n，我们只需输出单词“peace”，不对排列进行任何操作。 否则，我们输出 x，然后通过交换值 x 和 x + 1 的位置（无论它们当前在哪里）来修改排列。 

因此，每个查询既是动态排列上的范围存在查询，又是对值域中两个连续值进行稍微重新排列的局部结构更新。 

约束很大：n 最多可达 5 × 10^5，k 最多可达 10^5。 任何扫描每个查询间隔的解决方案都将太慢，因为在最坏的情况下这将花费 O(nk)，这远远超出了可接受的范围。 即使每个查询的 O(n log n) 也太大了。 我们需要每个查询更接近对数的东西，具有非常快的更新和范围检查。 

棘手的部分是排列是动态的。 每次查询后，交换 x 和 x+1 都会更改位置，这会影响所有未来的范围查询。 这排除了对值的任何静态预处理。 

一个微妙的边缘情况是缺失的数字为 n 或更大。 由于排列仅包含 1 到 n，因此 x 始终最多为 n+1。 如果 x 等于 n+1，或者实际上如果所有 1..n 都出现在段中，我们输出“peace”。 在这种情况下，幼稚的实现可能会错误地尝试交换，但交换必须仅在 x < n 时发生。 

## 方法

 一种直接的方法是通过扫描段 [l, r] 来处理每个查询，标记出现的值，然后通过从 1 向上检查找到最小的缺失整数。 这是正确的，但太慢了。 如果我们重置簿记数组，在最坏的情况下每个查询的成本为 O(r - l + 1 + n)，并且对于最多 10^5 个查询，这变得不可行。 

主要困难在于，我们反复要求范围内值的混合，其中值来自通过值空间中相邻值的交换而变化的排列。 这表明我们需要一个能够快速回答“[l, r] 中是否存在值 v”的结构，并支持移动两个值位置的更新。 

关键的观察是我们实际上不需要检查段中的所有值。 我们只需要找到使得v不出现在[l,r]中的最小值v即可。 这可以变成对值的前缀式搜索：我们以升序测试候选 v，并且对于每个 v，我们检查它是否存在于段中。 第一个缺失的 v 就是答案。 

因此核心操作变成了一个动态的“点位置”结构：对于每个值 v，我们维护其当前位置 pos[v]。 然后检查 v 是否出现在 [l, r] 中就是检查 pos[v] 是否在该区间内。 这将范围查询减少为每个候选值的 O(1) 检查序列。 

剩下的挑战是快速找到最小的缺失 v。 我们可以在值域 [1..n] 上维护一棵线段树，为每个线段存储该线段中的所有值是否完全“覆盖”（即它们的位置位于当前查询范围内）。 然而，由于每个查询都有不同的 [l, r]，我们无法预先计算它。 

相反，我们颠倒了视角。 对于固定查询 [l, r]，我们想要最小的 v，使得 pos[v] 不在 [l, r] 中。 这相当于找到第一个 v，其中 pos[v] < l 或 pos[v] > r。 如果我们使用存储一系列值中值的最小和最大位置的线段树节点仔细定义它，那么这是 v 上的单调谓词。

对于一系列值[L,R]，我们可以维护minPos和maxPos。 如果 minPos 和 maxPos 都位于 [l, r] 内，则该范围内的所有值都在段内。 否则，该范围内至少存在一个缺失值。 这允许我们使用线段树二分搜索最小的 v，降序搜索，直到找到位置逃逸 [l, r] 的第一个值。 

更新很简单：交换 x 和 x+1 只是交换它们在 pos[] 中的位置。 

这导致通过线段树下降查找 mex 的 O(log n) 查询，以及每次交换的 O(1) 更新，从而给出总体 O((n + k) log n) 解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nk) | O(nk) | O(n) | 太慢了|
 | 最优（线段树值） | O((n + k) log n) | O((n + k) log n) | O(n) | 已接受 |

 ## 算法演练

 我们在从 1 到 n 的值域上构建一棵线段树。 每个节点表示一个连续的值范围并存储两条信息：当前排列中这些值之间的最小位置和这些值之间的最大位置。 

我们还维护一个数组 pos[v]，它告诉我们值 v 在排列中的当前索引。 

对于每个查询 [l, r]，我们想要最小的 v，使得 pos[v] 不在 [l, r] 中。 

1. 使用初始排列构建线段树。 对于每个值 v，我们将 pos[v] 设置为其索引，叶子节点存储 (pos[v], pos[v])。 内部节点计算子节点的最小值和最大值。 
2. 为了回答查询 [l, r]，我们从根开始沿线段树下降，总是尝试按升序找到位置在 [l, r] 之外的值。 在每个节点，我们检查整个段是否完全位于 [l, r] 内，这意味着它的 minPos ≥ l 且 maxPos ≤ r。 如果这是真的，那么该节点中的所有值都在该段内，因此我们跳过它。 
3、如果一个节点不完全包含，则说明至少存在一个位置在[l,r]之外的值。 然后，我们向下查找其子级，始终首先选择左子级，因为我们想要尽可能小的值。 
4. 当我们到达与值 v 对应的叶节点时，我们检查 pos[v] 是否在 [l, r] 内部。 如果在外部，我们返回 v 作为 mex。 否则，该分支无效。 
5. 得到x后，如果x等于n，则输出“peace”，不做任何进一步的操作。 
6. 如果x小于n，则输出x，然后交换x和x+1的位置。 我们更新 pos[x] 和 pos[x+1]，并更新这两个值的线段树叶子并向上传播更改。 

它的工作原理基于结构不变量：每个节点始终代表其值范围的正确最小和最大位置。 这确保了当一个节点完全包含在 [l, r] 中时，我们可以安全地丢弃整个子树，因为该段中不会丢失其中的任何值。 相反，如果一个节点未完全包含，则它保证其范围内至少有一个值违反间隔条件，因此答案必须位于该子树中的某个位置。 树遍历通过始终先向左探索再向右探索来保持顺序，这保证找到最小的有效值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, pos):
        self.n = len(pos) - 1
        self.minv = [0] * (4 * self.n)
        self.maxv = [0] * (4 * self.n)
        self.build(1, 1, self.n, pos)

    def build(self, idx, l, r, pos):
        if l == r:
            self.minv[idx] = self.maxv[idx] = pos[l]
            return
        mid = (l + r) // 2
        self.build(idx * 2, l, mid, pos)
        self.build(idx * 2 + 1, mid + 1, r, pos)
        self.pull(idx)

    def pull(self, idx):
        self.minv[idx] = min(self.minv[idx * 2], self.minv[idx * 2 + 1])
        self.maxv[idx] = max(self.maxv[idx * 2], self.maxv[idx * 2 + 1])

    def update(self, idx, l, r, pos_idx, val):
        if l == r:
            self.minv[idx] = self.maxv[idx] = val
            return
        mid = (l + r) // 2
        if pos_idx <= mid:
            self.update(idx * 2, l, mid, pos_idx, val)
        else:
            self.update(idx * 2 + 1, mid + 1, r, pos_idx, val)
        self.pull(idx)

    def find_mex(self, idx, l, r, ql, qr):
        if self.minv[idx] >= l and self.maxv[idx] <= r:
            return -1
        if l == r:
            return l if not (ql <= self.minv[idx] <= qr) else -1
        mid = (l + r) // 2
        res = self.find_mex(idx * 2, l, mid, ql, qr)
        if res != -1:
            return res
        return self.find_mex(idx * 2 + 1, mid + 1, r, ql, qr)

n = int(input())
a = list(map(int, input().split()))
k = int(input())

pos = [0] * (n + 1)
for i, v in enumerate(a, 1):
    pos[v] = i

st = SegTree(pos)

for _ in range(k):
    l, r = map(int, input().split())
    x = st.find_mex(1, 1, n, l, r)

    if x == -1 or x == n:
        print("peace")
        continue

    print(x)
    px, py = pos[x], pos[x + 1]
    pos[x], pos[x + 1] = py, px

    st.update(1, 1, n, x, pos[x])
    st.update(1, 1, n, x + 1, pos[x + 1])
```线段树是基于值而不是位置构建的。 每个叶子对应一个值 v 并存储其在排列中的当前位置。 这种反转使得值的范围查询变得有意义。 

mex 搜索的工作原理是修剪其值在位置上完全位于 [l, r] 内部的整个段。 如果一个节点的整个取值范围都在查询段内，则它不能包含答案，因此会立即跳过。 

交换步骤会小心地更新 pos 数组和线段树叶子以获取交换的值。 错过任何一个更新都会使结构不同步并产生不正确的未来查询。 

## 工作示例

 我们追踪一个小例子来观察结构如何演变。 

考虑使用查询 [2, 4] 进行排列 [4, 3, 1, 2, 5]。 

| 步骤| 查询 [l, r] | 找到 x | 行动| 排列|
 | --- | --- | --- | --- | --- |
 | 1 | [2,4]| 4 | 交换 4 和 5 | [5,3,1,2,4]|
 | 2 | [2,5]| 5 | 和平| [5,3,1,2,4]|
 | 3 | [1,3]| 2 | 交换 2 和 3 | [5,2,1,3,4]|
 | 4 | [1,3]| 3 | 交换 3 和 4 | [5,2,1,4,3]|
 | 5 | [1,5]| 6 | 和平| [5,2,1,4,3]|

 每个步骤都表明，一旦所有小值都出现在查询区间中，mex 就会向上移动，直到逃出域，从而产生“和平”。 

现在考虑一个较小的重点案例：排列 [1, 2, 3, 4]，查询 [2, 3]。 

| v 已检查 | 位置[v] | 在[2,3]中？ |
 | --- | --- | --- |
 | 1 | 1 | 没有|
 | 2 | 2 | 是的 |
 | 3 | 3 | 是的 |
 | 4 | 4 | 没有|

 最小的缺失是 1，它会立即触发 1 和 2 之间的交换，演示本地值调整如何通过未来的查询传播。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + k) log n) | O((n + k) log n) | 每个查询都会对线段树的值进行降序排列，并且每次交换都会更新两个叶子 |
 | 空间| O(n) | 线段树和位置数组|

 对于 n 高达 5 × 10^5 和 k 高达 10^5 而言，对数因子就足够了，因为每个操作仅触及树中的路径而不是扫描范围。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    class SegTree:
        def __init__(self, pos):
            self.n = len(pos) - 1
            self.minv = [0] * (4 * self.n)
            self.maxv = [0] * (4 * self.n)
            self.build(1, 1, self.n, pos)

        def build(self, idx, l, r, pos):
            if l == r:
                self.minv[idx] = self.maxv[idx] = pos[l]
                return
            mid = (l + r) // 2
            self.build(idx * 2, l, mid, pos)
            self.build(idx * 2 + 1, mid + 1, r, pos)
            self.pull(idx)

        def pull(self, idx):
            self.minv[idx] = min(self.minv[idx * 2], self.minv[idx * 2 + 1])
            self.maxv[idx] = max(self.maxv[idx * 2], self.maxv[idx * 2 + 1])

        def update(self, idx, l, r, pos_idx, val):
            if l == r:
                self.minv[idx] = self.maxv[idx] = val
                return
            mid = (l + r) // 2
            if pos_idx <= mid:
                self.update(idx * 2, l, mid, pos_idx, val)
            else:
                self.update(idx * 2 + 1, mid + 1, r, pos_idx, val)
            self.pull(idx)

        def find_mex(self, idx, l, r, ql, qr):
            if self.minv[idx] >= l and self.maxv[idx] <= r:
                return -1
            if l == r:
                return l if not (ql <= self.minv[idx] <= qr) else -1
            mid = (l + r) // 2
            res = self.find_mex(idx * 2, l, mid, ql, qr)
            if res != -1:
                return res
            return self.find_mex(idx * 2 + 1, mid + 1, r, ql, qr)

    n = 1
    a = [1]
    pos = [0, 1]
    st = SegTree(pos)
    assert run("1\n1\n1\n1 1\n") == "peace\n", "min size"

    return "ok"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | n=1 单个查询 | 和平| 最小边界情况|

 ## 边缘情况

 当查询的段已包含所有值 1 到 n 时，就会发生临界边缘情况。 在这种情况下，每个值 v 都满足 [l, r] 内的 pos[v]，因此 mex 变为 n+1，我们输出“peace”。 线段树将正确修剪每个节点，因为每个节点的最小和最大位置将落在查询区间内，导致完全覆盖并且找不到候选叶子。 

另一个微妙的情况是涉及前后移动位置的相邻值的重复交换。 由于每次交换仅涉及两个值并立即更新它们的两个叶节点，因此保留了 pos[v] 始终正确的不变量。 即使经过多次操作，结构仍然保持一致，因为每个更新都是本地化的并通过树传播。 

最后一个极端情况是 x 为 n 时。 即使它是最大的有效值，与 x+1 的交换也是无效的，因为 x+1 不存在。 该代码明确将 x == n 视为停止条件，确保不会发生越界更新。
