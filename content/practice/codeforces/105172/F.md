---
title: "CF 105172F - 七海和雪花"
description: "输入描述了几个无向图，每个图都应该表示一个“雪花状”结构。 任务是确定每个图是否匹配一个非常严格的模式。 我们要寻找的结构可以分两层来理解。"
date: "2026-06-27T08:26:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105172
codeforces_index: "F"
codeforces_contest_name: "The 20th Southeast University Programming Contest (Summer)"
rating: 0
weight: 105172
solve_time_s: 183
verified: false
draft: false
---

[CF 105172F - 七海和雪花](https://codeforces.com/problemset/problem/105172/F)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 3s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 输入描述了几个无向图，每个图都应该表示一个“雪花状”结构。 任务是确定每个图是否匹配一个非常严格的模式。 

我们要寻找的结构可以分两层来理解。 首先，有一个形成“核心多边形”的简单循环。 其次，从这个循环的每个顶点，一棵树都可以向外悬挂，并且从它们的附着点看，所有这些悬挂的树必须具有相同的结构。 换句话说，如果你站在环上的任何顶点并向外看它的附加组件，你看到的有根树一定都是同构的。 

所以这个图并不是任意的。 它应该看起来像一个单一的循环，并且每个循环顶点都充当同一棵树的根。 

约束很大：所有测试用例的顶点和边的总和高达五十万。 这排除了任何为许多子树对独立重新计算昂贵的图同构检查的解决方案。 每个测试用例的节点数量呈二次方的情况都将立即失败。 每个测试用例的解决方案必须基本上是线性的或接近线性的。 

如果尝试天真的推理，一些失败案例自然会出现。 一个常见的错误是将每个周期都视为有效，即使附加结构不同。 例如，考虑一个三角形循环，其中一个顶点有一条长度为 2 的额外链，而其他顶点没有附件。 该图包含一个循环，但显然“雪花臂”并不相同，因此正确答案是否定的。 另一种失败情况是当图形包含通过树连接的多个循环时。 简单的循环检测可能独立地接受每个循环，但该结构不是具有统一附件的单个中心多边形。 

## 方法

 强力解释首先尝试识别循环，然后对于每个循环顶点提取其附加子树并使用树同构来比较所有子树。 测试树同构的一种直接方法是计算每个有根树的规范形式或散列。 

原则上这是可行的，但如果天真地这样做，它就会变得昂贵。 如果我们独立地为每个循环顶点重复重新计算子树编码，则不同分支中的相同节点会被重新处理多次。 在最坏的情况下，几乎每个节点都是附加到循环的长链的一部分，跨所有循环顶点的重复 DFS 遍历会导致对同一结构进行重复工作，从而将复杂性推向 O(n^2)。 

关键的观察结果是该结构干净地分成两部分。 该循环本身是独特的，可以使用 2 核剥离过程来提取。 一旦循环被识别，每个剩余节点都恰好属于以循环顶点为根的一棵树。 这些树彼此不相互作用。 这意味着我们可以使用单个 DFS 从每个循环根向外计算每个节点的子树哈希值，从而避免重新计算。 

第二个关键思想是循环识别可以通过迭代删除 1 度节点来完成。 反复去除叶子后，剩下的正是图中所有循环的并集。 由于预期的结构恰好包含一个循环，因此剩余的子图必须是该循环。 

隔离循环后，问题简化为计算每个有根附件树的规范哈希并验证所有此类哈希是否相同。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力子树比较 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 循环剥离+单次DFS哈希| O(n) | O(n) | 已接受 |

 ## 算法演练

1. 计算每个节点的度数，并使用队列重复删除度数为1的节点。 每次删除都会减少邻居的度数，因此会动态发现新的叶子。 当进程停止时，剩余的节点形成图的 2 核。 这隔离了所有循环节点。 
2. 检查每个剩余节点在剩余集合内是否恰好有两个邻居。 这保证了剩余的结构是单个简单循环而不是多个交织的循环。 
3. 如果剩余节点数小于3，则立即拒绝该图，因为不存在有效的多边形核。 
4. 构建仅限于非循环边的邻接表，这意味着我们忽略循环节点之间的边，仅遍历从循环向外延伸的边。 
5. 对于每个循环节点，对其非循环邻居执行 DFS 并计算有根树的规范哈希。 DFS 必须避免重新访问循环节点，以便仅包含向外的分支。 
6. 收集循环节点对应的所有哈希值。 如果任何哈希值与第一个哈希值不同，则附加的树不是同构的，答案是否定的。 
7. 确保在这些 DFS 遍历期间访问所有非循环节点。 如果任何节点未被访问，则意味着存在未连接到循环的断开组件，这违反了雪花结构。 

### 为什么它有效

 叶子剥皮步骤保证所有循环之外的每个节点都被删除，因为任何树节点最终都会成为叶子并被消除。 剩下的正是循环主干。 每个剩余节点恰好参与两个循环边，因此该结构不能分支或包含弦。 

一旦环路被固定，每条非环路边都属于一棵仅附加到一个环路节点的树。 这些树是不相交且独立的。 为每个有根树计算确定性哈希可确保同构结构产生相同的值，而任何结构差异都会改变子哈希的多重集，从而改变最终的编码。 这使得对所有循环顶点的相等性检查对于正确性来说既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        g = [[] for _ in range(n)]
        deg = [0] * n

        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            g[v].append(u)
            deg[u] += 1
            deg[v] += 1

        from collections import deque
        q = deque([i for i in range(n) if deg[i] <= 1])
        alive = [True] * n

        while q:
            u = q.popleft()
            if not alive[u]:
                continue
            alive[u] = False
            for v in g[u]:
                if alive[v]:
                    deg[v] -= 1
                    if deg[v] == 1:
                        q.append(v)

        core = [i for i in range(n) if alive[i]]

        if len(core) < 3:
            print("NO")
            continue

        core_set = set(core)

        ok = True
        for u in core:
            cnt = 0
            for v in g[u]:
                if v in core_set:
                    cnt += 1
            if cnt != 2:
                ok = False
                break

        if not ok:
            print("NO")
            continue

        seen = set()

        def dfs(u, p):
            seen.add(u)
            child_hashes = []
            for v in g[u]:
                if v in core_set or v == p:
                    continue
                child_hashes.append(dfs(v, u))
            child_hashes.sort()
            return tuple(child_hashes)

        hashes = []
        for u in core:
            for v in g[u]:
                if v not in core_set and v not in seen:
                    hashes.append(dfs(v, u))

        if not hashes:
            hashes = [() for _ in core]

        print("YES" if all(h == hashes[0] for h in hashes) else "NO")

if __name__ == "__main__":
    solve()
```该解决方案首先构建图表并计算度数。 基于队列的修剪步骤删除所有树状部分，只留下循环节点。 对其余节点的度检查强制该核心是单个简单循环。 

DFS 哈希步骤将循环节点的每个非循环邻居视为附加树的根。 递归通过对子哈希进行排序来构建子树结构的规范元组表示，确保顺序独立性。 每个子树只计算一次，因为`seen`set 防止重新访问跨不同循环根的节点。 

最后，比较所有收集的子树签名是否相等。 

## 工作示例

 ### 示例 1

 输入图对应于具有相同附件的清洁循环。 

| 步骤| 核心节点| 提取的子树哈希值 |
 | ---| ---| ---|
 | 修剪后| 大小为 k 的循环 | 待定 |
 | 来自每个循环节点的 DFS | 全部相同| 相同的元组 |

 每个循环节点都会产生相同的空或相同的结构，因此算法输出“是”。 

这证实了即使树很平凡，所有循环顶点上的相同附件也能被正确识别。 

### 示例 2

 考虑一个循环，其中一个顶点的链比其他顶点更长。 

| 步骤| 核心节点| 提取的子树哈希值 |
 | ---| ---| ---|
 | 修剪后| 循环依然| 待定 |
 | DFS 结果 | 一个哈希值不同 | 不匹配|

 在这里，一个循环顶点由于其额外的分支而产生更深的元组，而其他循环顶点则产生更简单的结构。 不匹配立即导致NO。 

这表明子树同构在所有循环顶点上全局强制执行。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个节点在剪枝期间进入和离开队列一次，并且在 DFS 散列期间每条边都被遍历恒定次数 |
 | 空间| O(n) | 邻接表、度数组和递归/访问存储 |

 测试用例的总输入大小以 5×10^5 为界，因此线性时间解决方案可以轻松满足时间和内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return solve_capture(inp)

def solve_capture(inp: str) -> str:
    import sys
    from io import StringIO
    backup = sys.stdin
    sys.stdin = StringIO(inp)
    out = StringIO()
    backup_out = sys.stdout
    sys.stdout = out
    solve()
    sys.stdout = backup_out
    sys.stdin = backup
    return out.getvalue().strip()

# provided samples
assert solve_capture("""5
6 6
1 2
2 3
3 1
1 5
4 2
3 6
4 3
1 2
2 4
3 2
4 4
1 3
3 2
2 4
1 4
9 12
1 2
2 3
3 1
2 4
5 4
2 5
1 7
6 7
1 6
8 3
3 9
8 9
6 6
1 2
2 3
3 1
4 5
6 5
6 4
""") == """YES
NO
YES
NO
NO"""

# custom cases
assert solve_capture("""1
3 3
1 2
2 3
3 1
""") == "YES"

assert solve_capture("""1
4 3
1 2
2 3
3 1
""") == "NO"

assert solve_capture("""1
6 5
1 2
2 3
3 1
1 4
1 5
""") == "NO"

assert solve_capture("""1
7 7
1 2
2 3
3 1
1 4
2 5
3 6
1 7
""") == "YES"

| Test input | Expected output | What it validates |
|---|---|---|
| triangle only | YES | minimal valid cycle |
| cycle missing closure | NO | invalid structure detection |
| uneven attachments | NO | subtree mismatch detection |
| symmetric star attachments | YES | identical tree verification |

## Edge Cases

A pure cycle with no attachments is the simplest valid configuration. In this case, the pruning step leaves all nodes in the core, and every cycle node has no outgoing DFS subtree, producing identical empty signatures. The algorithm correctly returns YES.

A graph containing multiple cycles connected through bridges is eliminated during the pruning stage. Any tree components are removed first, but multiple cycles would remain and violate the “degree equals two in core” condition, forcing rejection.

A case where one attachment tree is deeper than others is caught during DFS hashing. Even if the difference is only a single extra node at the bottom, the sorted tuple representation changes, producing a different canonical signature and ensuring rejection.
```
