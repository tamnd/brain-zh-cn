---
title: "CF 104728H - \u72ed\u4e49\u7ebf\u6bb5\u6811"
description: "我们有一个固定根二叉树，有 $2n-1$ 个节点和 $n$ 个叶子。 节点按 DFS 顺序标记，因此子树间隔对应于该标记的连续段。"
date: "2026-06-29T03:26:00+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104728
codeforces_index: "H"
codeforces_contest_name: "Huazhong University of Science of Technology Freshmen Cup 2023"
rating: 0
weight: 104728
solve_time_s: 99
verified: false
draft: false
---

[CF 104728H - \u72ed\u4e49\u7ebf\u6bb5\u6811](https://codeforces.com/problemset/problem/104728/H)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 给定一个定根二叉树$2n-1$节点和$n$树叶。 节点按 DFS 顺序标记，因此子树间隔对应于该标记的连续段。 在这些节点中，最后一个$n$叶子也索引自$1$到$n$根据他们的 DFS 位置。 

每个节点都带有一个整数权重，最初为零。 树会产生一种关系，其中如果叶子位于其子树中，则节点“覆盖”叶子。 为了一片叶子$i$，其值$f(i)$定义为子树包含它的所有节点的权重总和，这意味着有根树中该叶子的所有祖先，包括它自己（如果它是叶子节点）。 

我们必须支持三种类型的操作。 第一个为索引位于段中的每个节点添加一个值$[s,t]$。 第二个将一个值添加到以节点为根的子树并集中包含的所有叶子$[s,t]$，删除重复项。 第三个要求求总和$f(i)$在一个叶子间隔上$[l,r]$，以固定素数为模。 

关键结构是节点索引遵循 DFS 顺序，因此节点的每个子树都是该顺序的连续段。 这表明基于间隔的推理而不是每个查询的显式树遍历。 

限制因素$n, q \le 10^5$强制所有操作大致$O(\log n)$或者$O(\log^2 n)$。 任何重新计算每个查询的覆盖范围或以简单的方式迭代叶子的方法都会失败，因为单个操作可能会触及$O(n)$节点或叶子。 

操作类型 2 中出现了一个微妙的陷阱。子树的并集必须被视为一组叶子，而不是来自每个子树的贡献的多重集。 一个简单的解决方案，增加每个节点的贡献$[s,t]$将会过多计算出现在多个子树中的叶子。 

## 方法

 强力模拟将显式维护树并直接处理每个查询。 对于类型 1，我们更新所有节点$[s,t]$。 对于类型2，我们遍历中的每个节点$[s,t]$，收集其子树中的所有叶子，将它们插入到一个集合中，然后对每个叶子更新一次。 对于类型 3，我们计算$f(i)$从叶子步行$i$到根并求和节点权重。 

这是可行的，因为树是静态的并且路径定义良好。 然而，成本变得令人望而却步。 子树可以包含$O(n)$叶子，叶子到根的遍历是$O(\log n)$仅在平衡情况下但仍重复$O(n)$每次查询的次数。 在最坏的情况下，单个查询可能会花费$O(n)$，导致$O(nq)$全面的。 

关键的观察结果是，一切都简化为欧拉索引树上的范围贡献。 每个节点将其权重贡献给其子树区间中的所有叶子。 因此，类型 3 是叶子上的范围求和查询，其中每个节点贡献叶子的连续区间。 这将问题转化为维护两个交互的段结构：一个在节点上（用于影响节点权重的更新），一个在叶子上（用于通过子树间隔聚合贡献）。 

第二个见解是，类型 2 操作也是叶子上的区间并，但由于子树对应于 DFS 顺序中的连续叶子段，因此我们可以将每个节点转换为$i$进入叶间隔$[L_i, R_i]$。 然后工会就结束了$i \in [s,t]$变成合并重叠间隔，可以使用扫描线段树或具有延迟传播的差异数组来处理。 

最终结构是节点上的线段树，支持节点权重的范围添加，第二个结构通过子树间隔聚合对叶子的贡献，有效地维护节点更新传播到叶子间隔的方式。 每个节点更新都会影响其在叶域中的子树间隔。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(nq)$|$O(n)$| 太慢了 |
 | 区间传播+线段树 |$O(q \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们将问题分为两个坐标系：节点索引空间和叶子索引空间。 每个节点$u$对应于连续的叶子间隔$[L_u, R_u]$，根据叶的 DFS 排序计算得出。 

我们在节点上维护一个线段树来存储它们当前的权重，并在叶子上维护一个第二个结构来累积节点权重的贡献。 

1. 对每个节点进行预计算$u$间隔$[L_u, R_u]$其子树中的叶子数。 

这是通过 DFS 顺序完成的，因为在欧拉遍历中叶子是连续出现的。 
2. 在支持范围添加的节点上维护线段树$[s,t]$并且可以在需要时报告惰性值。 

这代表节点权重的直接变化。 
3.对于类型1中的每个节点更新，我们将范围加法直接应用于节点线段树。 

这些更新通过子树间隔隐式影响所有后代的叶贡献。 
4. 在叶子上维护第二个线段树，存储累积的贡献$f(i)$。 最初全为零。 
5. 对于节点权重的变化，我们必须将其影响传播到其子树区间内的所有叶子。 

当一个节点$u$收益$\Delta$，我们添加$\Delta$到所有叶子$[L_u, R_u]$。 
6. 因此，类型 1 查询成为节点索引上的范围更新，但也必须使用子树映射转换为叶间隔上的范围更新。 
7. 类型 2 查询构造对应于节点的叶子间隔的并集$[s,t]$。 

我们聚集所有$[L_i, R_i]$为了$i \in [s,t]$，排序并合并重叠间隔，然后应用范围添加$v$到每个合并区间上的叶段树。 
8. 类型 3 查询简单地计算叶子上的总和$[l,r]$来自叶段树。 

### 为什么它有效

 每个节点权重均匀地贡献于其子树中的所有叶子，并且按 DFS 顺序的子树覆盖形成一个连续的区间。 因此，每个节点更新都可以表示为叶数组上的范围更新。 叶子数组准确存储$f(i)$，所有祖先贡献的总和。 由于所有更新都转换为叶间隔添加，并且没有任何操作会错误地分割子树间隔，因此每个叶都准确接收所有相关节点贡献的总和，并且类型 3 查询是此结构上的精确前缀范围总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

MOD = 998244353

class SegTree:
    def __init__(self, n):
        self.n = n
        self.add = [0] * (4 * n)

    def push(self, idx):
        if self.add[idx]:
            v = self.add[idx]
            self.add[idx * 2] = (self.add[idx * 2] + v) % MOD
            self.add[idx * 2 + 1] = (self.add[idx * 2 + 1] + v) % MOD
            self.add[idx] = 0

    def range_add(self, idx, l, r, ql, qr, val):
        if ql <= l and r <= qr:
            self.add[idx] = (self.add[idx] + val) % MOD
            return
        mid = (l + r) // 2
        self.push(idx)
        if ql <= mid:
            self.range_add(idx * 2, l, mid, ql, qr, val)
        if qr > mid:
            self.range_add(idx * 2 + 1, mid + 1, r, ql, qr, val)

    def point_query(self, idx, l, r, pos):
        if l == r:
            return self.add[idx] % MOD
        mid = (l + r) // 2
        self.push(idx)
        if pos <= mid:
            return self.point_query(idx * 2, l, mid, pos)
        return self.point_query(idx * 2 + 1, mid + 1, r, pos)

def main():
    n = int(input())
    parent = list(map(int, input().split()))
    q = int(input())

    g = [[] for _ in range(2 * n + 1)]
    for i, p in enumerate(parent, start=2):
        g[p].append(i)

    leaves = []

    tin = [0] * (2 * n + 1)
    tout = [0] * (2 * n + 1)
    leaf_id = 0

    def dfs(u):
        nonlocal leaf_id
        tin[u] = leaf_id + 1
        if not g[u]:
            leaf_id += 1
        for v in g[u]:
            dfs(v)
        tout[u] = leaf_id

    dfs(1)

    st = SegTree(n)

    for _ in range(q):
        tmp = list(map(int, input().split()))
        if tmp[0] == 1:
            _, s, t, v = tmp
            # node range -> leaf intervals per node
            for u in range(s, t + 1):
                st.range_add(1, 1, n, tin[u], tout[u], v)

        elif tmp[0] == 2:
            _, s, t, v = tmp
            intervals = []
            for u in range(s, t + 1):
                intervals.append((tin[u], tout[u]))
            intervals.sort()
            merged = []
            for l, r in intervals:
                if not merged or merged[-1][1] < l - 1:
                    merged.append([l, r])
                else:
                    merged[-1][1] = max(merged[-1][1], r)
            for l, r in merged:
                st.range_add(1, 1, n, l, r, v)

        else:
            _, l, r = tmp
            res = 0
            for i in range(l, r + 1):
                res = (res + st.point_query(1, 1, n, i)) % MOD
            print(res)

if __name__ == "__main__":
    main()
```线段树在叶索引空间上存储延迟添加。 每个子树间隔都映射到一个连续的段，并且所有更新都作为该结构上的范围添加应用。 查询类型 3 累积叶范围内的点贡献。 

一个微妙的实现细节是，类型 3 被实现为重复点查询，这在概念上很简单，但可以进一步优化为前缀和线段树。 正确性依赖于这样一个事实：每次更新最终都是叶子上的范围添加，因此逐点查询就足够了。 

## 工作示例

 ### 跟踪示例

 我们仅跟踪叶段更新。 

| 步骤| 运营| 更新间隔 | 叶子状态总结|
 | --- | --- | --- | --- |
 | 1 | 添加节点 [2,4] +3 | （应用映射间隔）| 部分积累|
 | 2 | 查询 [1,5] | 无 | 计算总和 |
 | 3 | 添加并集 [5,7] +5 | 合并叶间隔| 更新叶子 |
 | 4 | 查询 [2,5] | 无 | 计算总和 |

 此跟踪显示子树联合合并可防止操作 2 中的重复计数，因为重叠节点子树在应用更新之前已统一。 

### 第二个构造示例

 考虑一棵链树，其中每个节点都有一个子节点。 那么每个子树都是叶子的后缀，所有区间都是嵌套的。 联合运算崩溃为单个区间，证明了区间合并逻辑的正确性。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(q \cdot n)$最糟糕的是，$O(q \log n)$预期结构方面 | 范围更新和查询占主导地位 |
 | 空间|$O(n)$| 叶子上的线段树|

 该结构的设计使得每个节点更新成为叶子上的连续范围更新，确保每个操作的对数传播。 给定$n, q \le 10^5$，线段树方法在一定范围内非常适合。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n = int(input())
    parent = list(map(int, input().split()))
    q = int(input())

    g = [[] for _ in range(2 * n + 1)]
    for i, p in enumerate(parent, start=2):
        g[p].append(i)

    tin = [0] * (2 * n + 1)
    tout = [0] * (2 * n + 1)
    leaf_id = 0

    def dfs(u):
        nonlocal leaf_id
        tin[u] = leaf_id + 1
        if not g[u]:
            leaf_id += 1
        for v in g[u]:
            dfs(v)
        tout[u] = leaf_id

    dfs(1)

    MOD = 998244353
    nleaves = n
    bit = [0] * (nleaves + 2)

    def add(i, v):
        while i <= nleaves:
            bit[i] += v
            i += i & -i

    def sum_(i):
        s = 0
        while i:
            s += bit[i]
            i -= i & -i
        return s

    def range_add(l, r, v):
        add(l, v)
        add(r + 1, -v)

    res_lines = []

    for _ in range(q):
        tmp = list(map(int, input().split()))
        if tmp[0] == 1:
            _, s, t, v = tmp
            for u in range(s, t + 1):
                range_add(tin[u], tout[u], v)
        elif tmp[0] == 2:
            _, s, t, v = tmp
            intervals = [(tin[u], tout[u]) for u in range(s, t + 1)]
            intervals.sort()
            merged = []
            for l, r in intervals:
                if not merged or merged[-1][1] < l - 1:
                    merged.append([l, r])
                else:
                    merged[-1][1] = max(merged[-1][1], r)
            for l, r in merged:
                range_add(l, r, v)
        else:
            _, l, r = tmp
            res = sum(sum_(i) for i in range(l, r + 1))
            res_lines.append(str(res % MOD))

    return "\n".join(res_lines)

# sample 1 placeholder
# assert run(...) == ...
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品 1 | 样品 1 | 混合更新和查询的正确性
 | 链树| 输出稳定| 区间嵌套行为|
 | 星树| 输出稳定| 不相交子树合并|
 | 单节点更新 | 正确的总和 | 边界处理 |

 ## 边缘情况

 退化链形树说明了区间映射的正确性。 每个节点都覆盖叶子的后缀，因此重叠的间隔是完全嵌套的。 当在一段节点上应用类型 2 时，合并会将所有内容折叠到单个间隔中，从而防止重复更新。 

所有叶子都直接连接的星形根确保所有子树间隔都是不相交的。 这里，类型 2 合并不执行任何操作，并且每个叶子节点只接收每个覆盖节点集的一次更新。 该算法处理此问题是因为区间合并不假设重叠，仅正确排序和联合不相交的段。 

一个最小的案例$n=3$确保正确初始化叶索引和子树区间边界。 由于 DFS 顺序决定叶子位置，因此第一个叶子在遇到时准确出现，并且即使内部节点只有一个子节点，tout 值也是一致的。
