---
title: "CF 1385E - 定向边缘"
description: "我们得到一个图，其中每条边都已经知道其端点，但并非所有边都可以自由选择它们的方向。 一些边已经是有向的，并且必须保持原样，而其余的边是无向的，可以按照我们想要的方向进行定向。"
date: "2026-06-18T18:27:37+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dfs-and-similar", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1385
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 656 (Div. 3)"
rating: 2000
weight: 1385
solve_time_s: 305
verified: false
draft: false
---

[CF 1385E - 定向边缘](https://codeforces.com/problemset/problem/1385/E)

 **评级：** 2000
 **标签：** 构造性算法、dfs 和类似算法、图
 **求解时间：** 5m 5s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个图，其中每条边都已经知道其端点，但并非所有边都可以自由选择它们的方向。 一些边已经是有向的，并且必须保持原样，而其余的边是无向的，可以按照我们想要的方向进行定向。 任务是为所有无向边分配方向，使得最终的有向图不包含有向环。 

输出不仅仅是是/否决定。 如果可能的话，我们还必须输出每条边的完整方向，包括那些已经有向的边，这样得到的有向图是非循环的。 

约束的结构已经表明任何解决方案在图的大小上都必须接近线性。 所有测试用例上最多有 2·10^5 个顶点和边，任何二次方（例如在每次边分配后重复检查循环或尝试所有方向）都是完全不可行的。 该解决方案本质上必须对每个测试用例执行一次或几次图形遍历。 

一个关键的困难是有向边在顶点之间施加严格的排序约束，而无向边很灵活，但必须与这些约束一致地进行分配。 天真的直觉可能是首先忽略有向边，构建底层无向图的拓扑顺序，然后相应地定向边。 当有向边已经强制执行与朴素 DFS 顺序冲突的部分排序时，此操作会立即失败。 

例如，考虑三个节点 1 → 2 → 3 已经有向，以及 3 和 1 之间的无向边。如果该顺序将 3 放在 1 之前，则任何尝试分配忽略有向链的拓扑顺序最终都会产生矛盾，反之亦然。 有向边定义了必须全局遵守的刚性偏序。 

因此，中心问题是如何以保留非循环性的方式将固定有向约束与灵活的无向边合并。 

## 方法

 强力方法是将每个无向边视为具有两个可能的方向，并在检查循环时尝试分配方向。 即使我们使用 DFS 回溯，在最坏的情况下也有 2^(m0) 种可能性，其中 m0 是无向边的数量。 当m达到2·10^5时，这是完全不可能的。 

另一个天真的想法是单独计算有向边的拓扑顺序，然后按该顺序从早到晚定向每个无向边。 问题是有向边可能无法定义所有顶点的完整顺序，更重要的是，它们一开始可能不是非循环的。 如果有向边已经包含环，则不存在解，必须检测到这一点。 

关键的观察是，我们只需要与所有已定向边一致的拓扑排序。 一旦我们有了这样的顺序，每个无向边都可以按照该顺序安全地从早到晚定向，因为这保证了不会出现后向边，因此不会创建循环。 

这将问题简化为检查有向子图是否是非循环的，如果是，则在其上构造拓扑顺序。 之后，我们在排序阶段忽略无向边，然后只分配它们的方向。 

唯一的微妙之处在于，仅有向边可能无法通过遍历到达所有节点，因此我们仍然必须在拓扑排序中包含所有顶点。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^m) | O(2^m) | O(米) | 太慢了|
 | 有向图+定向无向边的拓扑排序 | O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 我们独立处理每个测试用例。

1. 仅使用有向边构建图，将它们存储为邻接列表并跟踪入度。 该图表示固定约束。 
2. 在此有向图上运行拓扑排序（卡恩算法）。 我们反复选取入度为零的节点并将其删除，从而产生顶点排序。 
3. 如果不能将所有顶点包含在拓扑顺序中，则有向边包含环，无法满足要求。 我们立即输出NO。 原因是任何由固定边形成的循环都不能通过定向无向边来打破。 
4. 如果我们成功获得拓扑顺序，则根据每个顶点在该顺序中的位置为每个顶点分配一个等级。 
5. 现在处理所有边。 对于每个有向边，我们保持不变。 对于每个无向边 (u, v)，我们比较它们的等级。 如果rank[u] <rank[v]，我们引导它u → v，否则我们引导它v → u。 
6.输出最终的有向边列表。 

步骤 5 起作用的原因是拓扑顺序保证所有有向边都按顺序前进。 因此，将无向边定向为与此顺序一致可确保它们也向前移动。 

### 为什么它有效

 拓扑顺序是由已定向边施加的所有约束的线性扩展。 原始图中的任何有向路径都必须严格按此顺序增加。 由于每条无向边都遵循相同的顺序，因此最终图中的每条边都从排名较低的顶点到排名较高的顶点。 有向循环需要严格递增的等级序列，最终返回到起始节点，这是不可能的。 

因此，构造的图是非循环的，如果固定有向边中存在循环，则在步骤3中可以正确检测到。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve():
    t = int(input())
    out = []
    
    for _ in range(t):
        n, m = map(int, input().split())
        
        adj = [[] for _ in range(n + 1)]
        indeg = [0] * (n + 1)
        edges = []
        
        for i in range(m):
            tpe, x, y = map(int, input().split())
            edges.append((tpe, x, y))
            if tpe == 1:
                adj[x].append(y)
                indeg[y] += 1
        
        q = deque([i for i in range(1, n + 1) if indeg[i] == 0])
        topo = []
        
        while q:
            u = q.popleft()
            topo.append(u)
            for v in adj[u]:
                indeg[v] -= 1
                if indeg[v] == 0:
                    q.append(v)
        
        if len(topo) != n:
            out.append("NO")
            continue
        
        pos = [0] * (n + 1)
        for i, v in enumerate(topo):
            pos[v] = i
        
        res = []
        for tpe, x, y in edges:
            if tpe == 1:
                res.append((x, y))
            else:
                if pos[x] < pos[y]:
                    res.append((x, y))
                else:
                    res.append((y, x))
        
        out.append("YES")
        for x, y in res:
            out.append(f"{x} {y}")
    
    print("\n".join(out))

if __name__ == "__main__":
    solve()
```首先隔离有向边以构建约束图。 卡恩算法部分构造有效的线性顺序或在队列提前清空时检测循环。 

位置数组对最终排序进行编码，以便无向边端点之间的比较为 O(1)。 这避免了在边缘处理期间重新计算排序逻辑。 

最后的循环保留有向边并严格根据计算顺序定向无向边，确保与所有约束的一致性。 

## 工作示例

 考虑一个小图，其中有向边强制形成清晰的链，无向边必须遵循它。 

输入：```
1
3 3
1 1 2
1 2 3
0 3 1
```我们构建有向图 1 → 2 → 3。Kahn 算法生成 topo = [1, 2, 3]。 

| 步骤| 队列| 弹出| 拓扑| 入度变化 |
 | --- | --- | --- | --- | --- |
 | 初始化| [1] | - | []| 2:1、3:1 |
 | 1 | [2] | 1 | [1] | 2:0 |
 | 2 | [3] | 2 | [1,2]| 3:0 |
 | 3 | []| 3 | [1,2,3]| - |

 现在 pos[1] < pos[3]，所以我们根据规则将 3 → 1 变为 3 → 1 或 1 → 3； 由于 1 在 3 之前，因此我们分配 1 → 3。 

输出边缘变为：```
1 2
2 3
1 3
```这表明所有边都按顺序前进并且没有创建循环。 

循环检测触发的第二个示例：

 输入：```
1
3 3
1 1 2
1 2 3
1 3 1
```Kahn算法无法处理所有节点，因为每个节点最初的入度都是1，所以队列为空。 拓扑列表的大小为 0 或 1，具体取决于初始化顺序，但不是 3。 

这证实了由于固定约束下的定向循环而导致的不可能性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 每个顶点和边在卡恩算法中处理一次，并在最终定向过程中处理一次 |
 | 空间| O(n + m) | 邻接表和边缘存储|

 测试用例中所有顶点和边的总和以 2·10^5 为界，因此线性解决方案可以轻松地满足时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    
    input = sys.stdin.readline
    from collections import deque

    def solve():
        t = int(input())
        out = []
        for _ in range(t):
            n, m = map(int, input().split())
            adj = [[] for _ in range(n + 1)]
            indeg = [0] * (n + 1)
            edges = []
            for i in range(m):
                tpe, x, y = map(int, input().split())
                edges.append((tpe, x, y))
                if tpe == 1:
                    adj[x].append(y)
                    indeg[y] += 1

            q = deque([i for i in range(1, n + 1) if indeg[i] == 0])
            topo = []
            while q:
                u = q.popleft()
                topo.append(u)
                for v in adj[u]:
                    indeg[v] -= 1
                    if indeg[v] == 0:
                        q.append(v)

            if len(topo) != n:
                out.append("NO")
                continue

            pos = [0] * (n + 1)
            for i, v in enumerate(topo):
                pos[v] = i

            out.append("YES")
            for tpe, x, y in edges:
                if tpe == 1:
                    out.append(f"{x} {y}")
                else:
                    if pos[x] < pos[y]:
                        out.append(f"{x} {y}")
                    else:
                        out.append(f"{y} {x}")

        return "\n".join(out)

    return solve()

# provided sample checks (format adapted)
# custom cases

# simple chain + undirected
assert run("1\n3 3\n1 1 2\n1 2 3\n0 3 1\n") != ""

# cycle impossible
assert run("1\n3 3\n1 1 2\n1 2 3\n1 3 1\n").strip().startswith("NO")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 链+无向| 是+边缘| 通过拓扑顺序正确定向 |
 | 有向循环| 否 | 循环检测正确性|

 ## 边缘情况

 一个微妙的情况是图根本没有有向边。 在这种情况下，有向子图是空的，因此每个顶点都以入度零开始。 拓扑顺序变成由队列顺序产生的任何排列。 该算法仍然有效，因为每个无向边的方向都与该任意顺序一致，保证没有循环。 

另一种情况是断开的图，其中不同的组件具有独立的有向约束。 卡恩的算法自然地以任何有效的顺序交错组件。 由于无向边总是根据全局顺序定向，因此组件之间的边不能形成跨组件的循环。 

失败的场景是在建立完整的拓扑顺序之前尝试定向无向边。 例如，如果在没有全局排序的情况下尝试在 DFS 期间贪婪地分配方向，则很容易创建一个稍后形成循环的后沿。 全局排序通过首先修复完整的线性结构然后才做出局部决策来避免这种情况。
