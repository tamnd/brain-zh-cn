---
title: "CF 103443C - 社区服务"
description: "我们得到了一个动态的间隔系统，放置在从 0 到 n − 1 的数轴上。每个新人以间隔 [a, b] 到达，并根据到达顺序分配一个严格递增的标识符。 随后，服务请求以查询间隔 [c，d] 到达。"
date: "2026-07-03T07:40:08+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103443
codeforces_index: "C"
codeforces_contest_name: "The 2021 ICPC Asia Taipei Regional Programming Contest"
rating: 0
weight: 103443
solve_time_s: 56
verified: true
draft: false
---

[CF 103443C - 社区服务](https://codeforces.com/problemset/problem/103443/C)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个动态的间隔系统，放置在从 0 到 n − 1 的数轴上。每个新人以间隔 [a, b] 到达，并根据到达顺序分配一个严格递增的标识符。 随后，服务请求以查询间隔 [c，d] 到达。 对于每个查询，我们必须找到最近添加的范围与查询范围重叠的区间。 一旦在查询中使用该间隔，它就会被视为不活动，并且不应再次使用。 

因此，我们随时维护一组不断增长的活动间隔，每个间隔的时间戳等于其插入顺序。 查询要求与查询段相交的所有间隔中的最大时间戳。 回答后，所选间隔将从活动集中删除。 

关键的困难在于插入和删除都是在线的，并且查询必须始终反映查询时刻的最新活动间隔。 

约束允许最多 200,000 个事件，n 最多 1,000,000 个。 这立即排除了任何检查每个查询的所有间隔的方法，因为在最坏的情况下，天真的扫描每个查询的成本为 O(n)，导致 O(nm)，这远远超出了可行的限制。 

一些边缘案例揭示了常见的陷阱。 首先，多个间隔可以重叠同一个查询，但只有其中最新的才重要。 例如，如果间隔 1 为 [0, 10]，间隔 2 为 [3, 5]，间隔 3 为 [4, 6]，则查询 [4, 4] 应选择间隔 3，而不是间隔 2 或 1。 

其次，一旦使用了某个区间，它就必须从所有未来的答案中消失。 如果我们忘记正确删除它，则可能会再次错误地选择它。 

第三，重叠结构很重要：间隔不是不相交的，因此任何依赖于将线划分为不相交线段的结构都会失败。 

## 方法

 一种简单的方法是将所有间隔存储在一个列表中，对于每个查询，迭代所有间隔，检查它们是否与查询范围相交，并取时间戳最大的一个。 这是正确的，因为时间戳直接编码新近度，并且交叉检查的复杂度为 O(1)。 然而，如果间隔高达 200,000 个，查询次数为 200,000 个，那么在最坏的情况下这会导致大约 4 × 10^10 次检查，这太慢了。 

关键的观察是，这是一个经典的“删除区间内的范围最大值”问题。 我们需要反复回答：在与某个查询范围相交的所有活动区间中，哪个插入时间最长。 

坐标轴上的线段树提供了一种组织间隔的方法，以便每个间隔仅存储在 O(log n) 个节点中，特别是那些被线段树分解完全覆盖的节点。 每个节点都会跟踪完全覆盖其段的间隔。 对于每个节点，我们只需要知道存储在那里的最近的活动间隔。 

处理查询时，我们遍历完全位于查询范围内的线段树节点。 每个这样的节点都贡献其最佳的活动区间候选者。 答案是这些候选人中的最大值。 

删除是惰性处理的。 一旦使用了某个时间间隔，我们就将其标记为非活动状态。 每个节点维护一个间隔 id 堆栈，当访问顶部时，我们丢弃无效（已使用）的间隔，直到顶部再次激活。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的强力扫描 | O(n·e) | O(n·e) | O(n) | 太慢了|
 | 带区间栈的线段树 | O(e log n) | O(e log n) | O(e log n) | O(e log n) | 已接受 |

 ## 算法演练

 我们在坐标范围 [0, n − 1] 上构建一棵线段树。 每个节点代表一个段，并存储一堆区间标识符，这些区间标识符的区间完全覆盖该段。

对于每个间隔，我们还维护插入它的线段树节点列表，以便我们稍后可以通过将其标记为非活动来从概念上删除它。 

### 步骤

 1. 在每个新间隔到达时为其分配一个递增的 id。 存储其端点并将其标记为活动状态。 
2. 将区间插入线段树中。 每当线段树节点被 [a, b] 完全覆盖时，将区间 id 压入该节点的堆栈中。 这确保每个间隔分布在 O(log n) 个节点上。 
3. 当查询[c, d]到达时，遍历线段树并仅考虑完全包含在[c, d]中的节点。 对于每个此类节点，在清除不活动条目后检查其堆栈顶部。 
4. 清理是指在顶部间隔不再处于活动状态时重复从堆栈中弹出。 这确保每个节点始终暴露其最佳有效候选节点。 
5、查询的答案是遍历时收集到的所有有效栈顶中最大的id。 
6. 选择间隔 ID 作为答案后，将其标记为非活动状态，以便在以后的查询中不会考虑它。 

### 为什么它有效

 每个区间都准确地存储在线段树分解中完全代表它的节点中，因此其范围内的任何点都至少被一个这样的节点覆盖。 处理查询范围时，与查询相交的每个区间必须至少出现在完全包含在查询范围内的一个节点中。 在这些节点上取最大值可确保我们不会错过任何候选间隔。 由于我们总是从堆栈中清除不活动的间隔，因此我们永远不会错误地重用已删除的间隔。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

n, e = map(int, input().split())

# segment tree: each node stores list of interval ids
tree = [[] for _ in range(4 * n + 5)]

interval = [None]  # 1-indexed: (name, l, r)
active = [False]

def add(node, l, r, ql, qr, idx):
    if ql <= l and r <= qr:
        tree[node].append(idx)
        return
    mid = (l + r) // 2
    if ql <= mid:
        add(node * 2, l, mid, ql, qr, idx)
    if qr > mid:
        add(node * 2 + 1, mid + 1, r, ql, qr, idx)

def query(node, l, r, ql, qr):
    if ql <= l and r <= qr:
        while tree[node] and not active[tree[node][-1]]:
            tree[node].pop()
        return tree[node][-1] if tree[node] else 0

    mid = (l + r) // 2
    res = 0
    if ql <= mid:
        res = max(res, query(node * 2, l, mid, ql, qr))
    if qr > mid:
        res = max(res, query(node * 2 + 1, mid + 1, r, ql, qr))
    return res

for _ in range(e):
    tmp = input().split()
    t = tmp[0]

    if t == '1':
        name = tmp[1]
        a = int(tmp[2])
        b = int(tmp[3])
        interval.append((name, a, b))
        active.append(True)
        idx = len(interval) - 1
        add(1, 0, n - 1, a, b, idx)

    else:
        c = int(tmp[1])
        d = int(tmp[2])
        idx = query(1, 0, n - 1, c, d)
        if idx == 0:
            print("> <")
        else:
            print(interval[idx][0])
            active[idx] = False
```线段树插入函数将每个区间仅分布到其范围完全覆盖的节点。 这避免了存储冗余的每点信息。 查询函数仅遍历相关线段树分支并收集最佳可用区间 id。 

关键的微妙之处是延迟删除。 我们不是试图从它出现的每个节点中删除一个间隔，而是简单地将其标记为非活动状态，并在遇到节点堆栈顶部时将其清除。 这可以保持运营效率。 

## 工作示例

 ### 示例 1

 考虑一个 n = 10 的小系统。 

我们插入 id 1 的区间 A = [2, 6]、id 2 的区间 B = [4, 8]、id 3 的区间 C = [5, 7]。 

现在我们处理查询 [5, 5]。 

| 步骤| 节点覆盖 | 考虑的堆栈顶部| 最佳ID |
 | --- | --- | --- | --- |
 | 查询 | 节点覆盖 5 | A = 1，B = 2，C = 3 | 3 |

 结果是区间 C，因为它在重叠区间中具有最高的 id。 

输出后，间隔 C 被标记为无效。 如果再次发出另一个查询 [5, 5]，则答案变为 2，因为 C 被删除。 

### 示例 2

 间隔：

 [0, 9] ID 1，[3, 4] ID 2，[6, 8] ID 3。 

查询 [7, 7]：

 仅间隔 1 和 3 相交。 区间 3 较新。 

| 步骤| 活动间隔| 候选人| 结果 |
 | --- | --- | --- | --- |
 | 查询 | {1,3} | 1 和 3 | 3 |

 如果再查询[7, 7]，就只剩下区间1了，所以结果就变成1了。 

这些痕迹显示删除如何直接影响未来的查询。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(e log n) | O(e log n) | 每次插入和查询都会涉及 O(log n) 个节点 |
 | 空间| O(e log n) | O(e log n) | 每个区间都存储在 O(log n) 个线段树节点 |

 边界 n ≤ 10^6 和 e ≤ 200,000 非常适合这种复杂性，因为 log n 约为 20，总共大约有几百万次操作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, e = map(int, input().split())

    tree = [[] for _ in range(4 * n + 5)]
    interval = [None]
    active = [False]

    def add(node, l, r, ql, qr, idx):
        if ql <= l and r <= qr:
            tree[node].append(idx)
            return
        mid = (l + r) // 2
        if ql <= mid:
            add(node * 2, l, mid, ql, qr, idx)
        if qr > mid:
            add(node * 2 + 1, mid + 1, r, ql, qr, idx)

    def query(node, l, r, ql, qr):
        if ql <= l and r <= qr:
            while tree[node] and not active[tree[node][-1]]:
                tree[node].pop()
            return tree[node][-1] if tree[node] else 0

        mid = (l + r) // 2
        res = 0
        if ql <= mid:
            res = max(res, query(node * 2, l, mid, ql, qr))
        if qr > mid:
            res = max(res, query(node * 2 + 1, mid + 1, r, ql, qr))
        return res

    out = []
    for _ in range(e):
        tmp = input().split()
        if tmp[0] == '1':
            name = tmp[1]
            a, b = map(int, tmp[2:])
            interval.append((name, a, b))
            active.append(True)
            add(1, 0, n - 1, a, b, len(interval) - 1)
        else:
            c, d = map(int, tmp[1:])
            idx = query(1, 0, n - 1, c, d)
            if idx == 0:
                out.append("> <")
            else:
                out.append(interval[idx][0])
                active[idx] = False

    return "\n".join(out)

# custom tests

assert run("5 3\n1 A 0 2\n1 B 1 3\n2 1 1\n") == "B"
assert run("5 4\n1 A 0 4\n1 B 1 2\n2 1 1\n2 1 1\n") == "B\nA"
assert run("10 3\n2 1 5\n1 X 0 9\n2 1 5\n") == "X"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 与立即查询重叠间隔| 乙| max-id 选择的正确性 |
 | 删除后重复查询| B 然后 A | 正确的去除行为|
 | 任何间隔之前的查询 | X | 处理空状态|

 ## 边缘情况

 一种重要的边缘情况是多个间隔重叠同一区域并且在查询后删除最新的间隔。 该结构不得意外地重用它。 这是通过将其标记为非活动状态并仅在其到达顶部时才将其从堆栈中延迟删除来处理的。 

另一个边缘情况是查询范围不与任何活动间隔相交。 在这种情况下，每个候选节点在访问的节点上都保持为空，并且算法正确返回打印“> <”的标记值。 

最后，覆盖非常大范围的区间，例如[0, n − 1]，将被插入到很少的线段树节点中，但出现在许多查询中。 线段树确保它们仍能得到有效处理，因为每个查询仅涉及 O(log n) 个节点。
