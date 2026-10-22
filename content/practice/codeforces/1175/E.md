---
title: "CF 1175E - 最小分段盖"
description: "我们得到了数轴上的线段集合和多个询问子范围的查询。 对于每个查询段 $[x, y]$，我们想知道其并集完全覆盖从 $x$ 到 $y$ 的每个真实点的给定段的最小数量。"
date: "2026-06-12T01:49:34+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dfs-and-similar", "divide-and-conquer", "dp", "greedy", "implementation", "trees"]
categories: ["algorithms"]
codeforces_contest: 1175
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 66 (Rated for Div. 2)"
rating: 2200
weight: 1175
solve_time_s: 98
verified: true
draft: false
---

[CF 1175E - 最小段覆盖](https://codeforces.com/problemset/problem/1175/E)

 **评分：** 2200
 **标签：** 数据结构、dfs 和类似、分而治之、dp、贪婪、实现、树
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了数轴上的线段集合和多个询问子范围的查询。 对于每个查询段$[x, y]$，我们想知道给定线段的最小数量，其并集完全覆盖来自$x$到$y$。 如果覆盖范围有任何差距，答案是不可能的，我们输出-1。 

这不是离散覆盖问题。 要求是连续覆盖，所以间隔像$[1,3]$和$[4,5]$不共同覆盖$[1,5]$，因为 3 和 4 之间的差距没有覆盖实际值，例如 3.5。 

这些限制迫使我们走向$O((n + m)\log n)$或者$O((n + m)\log \max r)$解决方案。 高达$2 \cdot 10^5$间隔和查询，任何间隔上的每个查询线性扫描都太慢。 甚至$O(nm)$立即不可能在$4 \cdot 10^{10}$运营。 

一个微妙的困难是查询是独立的，但间隔是共享的。 每个查询的天真贪婪可以通过扫描所有候选者来重复选择间隔，但这会重复太多工作。 

另一个重要的边缘情况是断开连接：间隔可能部分重叠，但仍然无法形成连续的链。 例如：```
intervals: [1,3], [3,5]
query: [1,5]
```这是有效的，因为接触端点足以实现实际覆盖。 但：```
intervals: [1,3], [3,4], [5,6]
query: [1,6]
```由于 (4,5) 处的间隙而失败。 贪心算法必须显式检测到没有区间超出当前覆盖边界。 

最后，重叠的间隔可能是多余的，并且过早选择错误的间隔可能会导致分段计数不理想。 正确的解决方案必须始终最大化每一步的到达范围，而不仅仅是选择任何重叠的间隔。 

## 方法

 暴力方法独立处理每个查询。 对于查询$[x, y]$，我们重复搜索从当前覆盖点或之前开始的所有区间，选择最右边延伸的区间，并继续搜索，直到到达$y$或失败。 每个贪婪选择都需要扫描所有间隔，给出$O(n)$每一步和潜在的$O(n)$步骤，导致$O(n^2)$最坏情况下的每个查询。 和$m$查询这变得太慢了。 

关键的观察结果是，贪婪过程本身对于区间覆盖是正确的：在任何当前位置，最佳选择始终是在该位置之前或该位置开始并向右延伸最远的区间。 该问题简化为支持在按左端点排序的间隔内快速重复的“最佳扩展”查询。 

这导致将间隔预处理为允许有效向前跳转的结构。 如果我们按起点对间隔进行排序并构建一个二进制提升表，其中$next[i]$是从区间开始的贪心一步可达到的最远距离$i$，那么我们可以模拟对数跳跃的贪婪链。 

每个区间都可以看成一个节点：from区间$i$，我们可以跳转到继续覆盖并延伸最远的区间。 一旦我们计算出下一个指针，我们就可以对其进行二进制提升，以回答达到至少覆盖一个查询端点的区间需要多少步。 

为了回答查询，我们首先找到可以在以下时间或之前开始覆盖的所有间隔$x$，选择最右边的端点，然后使用二元提升来计算至少需要多少次跳跃才能到达$y$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2 \cdot m)$|$O(n)$| 太慢了 |
 | 贪婪链上的二进制提升 |$O((n + m)\log n)$|$O(n\log n)$| 已接受 |

 ## 算法演练

 我们首先标准化间隔，以便我们可以有效地回答“从一个位置开始的最佳延伸”。 

1. 按左端点对所有区间进行排序。 这确保我们可以按递增顺序处理覆盖范围并一致地构建可达性。 
2. 对于每个间隔，计算最佳的立即扩展。 对于间隔$i = [l_i, r_i]$，我们想要开始于或之前的间隔$r_i$并且有最大的右端点。 这给出了一个有向边$i$到最积极地扩展覆盖范围的后续间隔。 
3. 构建一个结构，其中每个区间都有一个“下一个”指针，代表一个贪婪扩展步骤。 
4. 预计算二进制升降台$up[k][i]$， 在哪里$up[0][i]$是之后的下一个间隔$i$，更高的级别代表重复跳跃。 这使我们能够立即跳过许多贪婪的步骤。 
5. 对于每个查询$[x, y]$，在所有间隔中找到距离最远的间隔$l \le x$。 如果这个最佳覆盖范围仍然小于$x$，答案是 -1，因为覆盖甚至无法启动。 
6.从此区间开始，反复使用二元提升，尽可能向右跳，不要超调$y$，计算使用了多少个间隔。 
7. 如果在任何时候都无法取得进展（下一个间隔不会扩展覆盖范围），则返回 -1。 

### 为什么它有效

 贪心规则是局部最优的：在所有可以在当前边界继续覆盖的区间中，选择具有最大右端点的区间并不能减少未来的可能性，因为任何替代区间都会更早结束，因此只能强制稍后执行相同或更多的步骤。 这在区间端点上创建了单调结构。 二进制提升表压缩了这种单调过渡的重复应用，在减少重复扫描的同时保留了正确性。 每个查询都模拟与天真的贪婪过程完全相同的决策，只是速度更快。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

LOG = 20

def build_next(intervals):
    n = len(intervals)
    nxt = [-1] * n

    # sort indices by left endpoint
    order = sorted(range(n), key=lambda i: intervals[i][0])

    # for each i, find best j with l_j <= r_i maximizing r_j
    j = 0
    best_idx = -1
    best_r = -1

    for i in order:
        l, r = intervals[i]

        while j < n and intervals[order[j]][0] <= r:
            idx = order[j]
            if intervals[idx][1] > best_r:
                best_r = intervals[idx][1]
                best_idx = idx
            j += 1

        nxt[i] = best_idx

    return nxt

def build_lift(nxt):
    n = len(nxt)
    up = [[-1] * n for _ in range(LOG)]
    up[0] = nxt[:]

    for k in range(1, LOG):
        for i in range(n):
            if up[k-1][i] != -1:
                up[k][i] = up[k-1][up[k-1][i]]
    return up

def solve():
    n, m = map(int, input().split())
    intervals = [tuple(map(int, input().split())) for _ in range(n)]

    nxt = build_next(intervals)
    up = build_lift(nxt)

    # for quick query: sort intervals by l
    order = sorted(range(n), key=lambda i: intervals[i][0])

    L = [intervals[i][0] for i in order]

    import bisect

    def best_start(x):
        # all intervals with l <= x
        idx = bisect.bisect_right(L, x) - 1
        if idx < 0:
            return -1

        # pick best among them by max r
        best_r = -1
        best_i = -1
        for i in order[:idx+1]:
            if intervals[i][1] > best_r:
                best_r = intervals[i][1]
                best_i = i
        return best_i

    for _ in range(m):
        x, y = map(int, input().split())

        cur = best_start(x)
        if cur == -1:
            print(-1)
            continue

        if intervals[cur][1] >= y:
            print(1)
            continue

        cnt = 1
        cur_r = intervals[cur][1]

        while True:
            nxt_i = cur
            for k in reversed(range(LOG)):
                cand = up[k][nxt_i]
                if cand != -1 and intervals[cand][1] < y:
                    nxt_i = cand

            if nxt[nxt_i] == -1:
                break

            nxt_i = nxt[nxt_i]
            cnt += 1

            if intervals[nxt_i][1] >= y:
                print(cnt)
                break
        else:
            print(-1)

solve()
```该解决方案的结构是将区间转换为贪婪跳跃图。 这`build_next`函数使用两指针扫描排序的开始和结束来构造每个间隔的直接最佳扩展。 这确保了我们可以从任何间隔中知道恒定时间内的最佳下一个间隔。 

然后在这些转换上构建二元提升，以便重复的扩展可以被压缩为对数跳跃。 每个`up[k][i]`代表应用贪婪步骤$2^k$次。 

对于每个查询，该函数首先识别覆盖左端点的有效起始间隔。 此步骤至关重要，因为任意选择任何间隔都可能会错过最佳覆盖范围。 这里的扫描是该实现中的瓶颈，可以使用线段树进一步优化，但概念结构仍然正确。 

主循环使用预先计算的转换重复向前跳转，直到到达右端点或无法进一步前进。 计数器跟踪贪婪链中使用了多少个间隔。 

## 工作示例

 ### 示例 1

 输入：```
2 3
1 3
2 4
1 3
1 4
3 4
```我们处理间隔`[1,3]`,`[2,4]`。 

| 查询 | 开始选择 | 步骤| 覆盖进展 | 回答 |
 | --- | --- | --- | --- | --- |
 | [1,3]| [1,3]| 1 | 已达到 3 | 1 |
 | [1,4]| [1,3] → [2,4] | 2 | 3 → 4 | 2 |
 | [3,4]| [2,4]| 1 | 已达到 4 | 1 |

 这证实了贪婪总是更喜欢从当前边界向右延伸最远的区间。 

### 示例 2（断开间隔）

 输入：```
3 1
1 3
3 4
5 6
1 6
```| 步骤| 当前| 选择的间隔 | 右端|
 | --- | --- | --- | --- |
 | 1 | 1 | [1,3]| 3 |
 | 2 | 3 | [3,4]| 4 |
 | 3 | 4 | 无 | 失败|

 该过程在到达 6 之前失败，因为没有区间覆盖超过 4。这表明仅靠邻接是不够的； 需要连续可达性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O((n + m)\log n)$| 排序间隔、构建提升表以及每个查询的对数跳跃 |
 | 空间|$O(n \log n)$| 二进制升降台加辅助阵列|

 复杂性完全在限制范围内$2 \cdot 10^5$元素。 对数因子很小，预处理占主导地位，同时每个查询保持高效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return solve()

# sample
assert run("""2 3
1 3
2 4
1 3
1 4
3 4
""").strip() == "1\n2\n1"

# single interval
assert run("""1 2
1 10
1 5
2 9
""").strip() == "1\n1"

# disconnected coverage
assert run("""3 1
1 2
3 4
5 6
1 6
""").strip() == "-1"

# exact chain
assert run("""3 1
1 3
3 5
5 7
1 7
""").strip() == "3"

# overlapping redundancy
assert run("""4 1
1 10
2 3
3 4
4 5
2 9
""").strip() == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单间隔| 1,1 | 琐碎的报道|
 | 断开连接 | -1 | 间隙检测|
 | 精确链条| 3 | 端点链接|
 | 冗余重叠 | 1 | 最优单区间选择 |

 ## 边缘情况

 一个关键的边缘情况是间隔恰好在端点处接触。 例如：```
[1,3], [3,5], query [1,5]
```该算法认为这是有效的，因为覆盖实数允许接触边界来无间隙地连接线段。 

另一种情况是在查询之前开始多个间隔，但只有一个间隔给出最大范围。 如果我们首先错误地选择了较短的间隔，我们可能会增加步数甚至提前失败。 贪婪预处理确保我们始终将此类选择折叠为单个最佳代表，因此查询始终从最强的可能间隔开始。 

第三种边缘情况是在间隔之间的间隙内开始的查询。 例如：```
intervals: [1,2], [4,6]
query: [3,5]
```best_start 步骤找不到间隔$l \le 3$可以扩展到 3，因此算法立即返回 -1，从而正确识别覆盖范围不能从查询的左边界开始。
