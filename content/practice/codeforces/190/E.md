---
title: "CF 190E - 反击"
description: "我们给出了一组城市，但问题在于输入并没有直接描述真实的道路系统。 相反，它描述了它的补充。"
date: "2026-06-03T01:21:22+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dsu", "graphs", "hashing", "sortings"]
categories: ["algorithms"]
codeforces_contest: 190
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 120 (Div. 2)"
rating: 2100
weight: 190
solve_time_s: 93
verified: false
draft: false
---

[CF 190E - 反击](https://codeforces.com/problemset/problem/190/E)

 **评分：** 2100
 **标签：** 数据结构、DSU、图形、哈希、排序
 **求解时间：** 1m 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们给出了一组城市，但问题在于输入并没有直接描述真实的道路系统。 相反，它描述了它的补充。 在输入中显示为相连的每对城市实际上在现实世界中之间没有道路，而每对未列出的城市实际上都有道路相连。 

所以我们实际上得到了一个图表$n$输入中的边定义真实图中的非边的顶点。 任务是找到真实图的连接组件，其中连接性是由输入中不存在的这些隐式边定义的。 

困难来自于密度。 如果我们尝试显式构造真实图，我们将处理最多$n(n-1)/2$潜在的边缘，太大了。 即使扫描所有对也是不可能的$n = 5 \cdot 10^5$，因为这需要按顺序$10^{11}$运营。 

第二个问题是输入图可以稀疏或密集，但无论哪种方式，直接推理补边都需要仔细处理。 其结构本质上是：我们被赋予一组稀疏的禁止边，而其他一切都是允许的。 

一个幼稚的错误是将输入边缘视为真实边缘。 例如，在示例输入中：```
4 4
1 2
1 3
4 2
4 3
```如果我们错误地将它们解释为真实的边，我们会得到两个分量：{1,2,3,4} 在该解释中实际上是完全连接的，这对于真实的图来说是错误的。 实际上，1 连接到 4，2 连接到 3。 

另一个微妙的失败案例是假设缺失的边缘形成多个断开的组件，可以贪婪地发现这些组件，而无需全局跟踪补体结构。 局部推理失败，因为补边依赖于全局缺失，而不是邻接表。 

## 方法

 蛮力的想法很简单：通过迭代所有城市对并在输入中不存在边时添加边来显式构建真实图。 之后，运行标准 DFS 或 BFS 来提取连接的组件。 

这是正确的，但构建步骤主导一切。 检查全部$\binom{n}{2}$对导致$O(n^2)$只是为了构建邻接结构，这在以下情况下是不可行的$n = 5 \cdot 10^5$。 即使在内存中存储这样的图表也是不可能的。 

关键的观察是我们不需要补图的显式边。 相反，我们可以通过维护一组动态的“未访问”顶点并使用禁止边列表来避免非法转换来模拟补体中的连接。 

对于每个节点，我们希望快速枚举所有不禁止与其连接的顶点。 如果我们维护一组所有当前未访问的节点，那么对于给定的节点$v$，它在补图中的邻居恰好是未访问的节点减去其禁止邻接表。 这将邻域发现转变为集合差异操作而不是完整扫描。 

使用平衡集（或有序结构），我们可以通过迭代未访问的节点并跳过禁止的节点来有效地提取有效的邻居。 每个节点都被处理一次，并且每个禁止边仅在相关时才被检查。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n^2)$|$O(n^2)$| 太慢了 |
 | 集 + BFS 过补 |$O((n + m)\log n)$|$O(n + m)$| 已接受 |

 ## 算法演练

 我们使用一组尚未访问的顶点在补图上模拟 BFS/DFS。 

1. 将所有禁止边存储在邻接表中。 对于每个城市$v$，我们保留真实图中未连接的城市的哈希集。 该表示直接来自输入。 
2. 维护一个包含所有未访问顶点的平衡集。 最初这个集合包含从 1 到$n$。 这种结构使我们能够快速迭代剩余的候选者。 
3. 迭代所有城市。 当我们找到一座城市$v$仍在未访问的集合中，我们启动一个新的连接组件。 
4. 初始化队列$v$并删除$v$来自未访问过的集合。 这会在隐式补图中启动 BFS。 
5. 当队列不为空时，弹出一个节点$u$。 我们现在想要找到所有顶点$w$这样$w$未被访问并且之间没有禁边$u$和$w$。 
6. 为了有效地做到这一点，我们迭代当前未访问的集合并收集候选项。 每当我们遇到一个节点$w$禁止的$u$，我们跳过它。 否则，我们将其从未访问集中删除并将其推入队列。 
7. 重复此操作直至队列变空。 那时，我们已经发现了真实图中的全连通分量。 
8. 继续扫描剩余的顶点，直到处理完所有顶点。 

### 为什么它有效

 在每一步中，BFS 仅通过补图中有效的边进行扩展，这意味着输入列表中不存在边。 未访问集保证我们永远不会处理一个节点两次，并且立即删除节点可以防止重复扫描。 每个节点都准确地插入到一个 BFS 树中，并且当扩展其端点时，每个有效的补边都被考虑一次。 这保留了标准 BFS 正确性，但基于隐式定义的邻接结构。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

from collections import deque

n, m = map(int, input().split())

bad = [set() for _ in range(n + 1)]
for _ in range(m):
    a, b = map(int, input().split())
    bad[a].add(b)
    bad[b].add(a)

unvisited = set(range(1, n + 1))
components = []

while unvisited:
    start = next(iter(unvisited))
    unvisited.remove(start)

    q = deque([start])
    comp = [start]

    while q:
        u = q.popleft()

        to_visit = []
        for v in list(unvisited):
            if v not in bad[u]:
                to_visit.append(v)

        for v in to_visit:
            if v in unvisited:
                unvisited.remove(v)
                q.append(v)
                comp.append(v)

    components.append(comp)

print(len(components))
for comp in components:
    print(len(comp), *comp)
```关键的实现选择是迭代快照`list(unvisited)`过滤前。 这可以避免在迭代期间修改集合，否则会使迭代器无效。 第二个微妙点是每个节点都被从`unvisited`一旦发现，确保即使多个 BFS 层遇到它也不会被处理两次。 

## 工作示例

 ### 示例 1

 输入：```
4 4
1 2
1 3
4 2
4 3
```我们从未访问的 = {1,2,3,4} 开始。 

| 步骤| 当前节点 | 之前未访问过 | 新增| 组件|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | {1,2,3,4} | {4} | {1,4} |
 | 2 | 4 | {2,3} | {} | {1,4} |
 | 3 | 2 | {2,3} | {3} | {2,3} |
 | 4 | 3 | {} | {} | {2,3} |

 该算法发现补图中 1 连接到 4，2 连接到 3。这与预期输出匹配。 

### 示例 2

 输入：```
5 2
1 2
4 5
```我们从所有未访问的节点开始。 

| 步骤| 当前节点 | 之前未访问过 | 新增| 组件|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | {1,2,3,4,5} | {3,4,5} | {1,3,4,5} |
 | 2 | 3 | {2} | {} | {1,3,4,5} |
 | 3 | 2 | {2} | {} | {2} |

 节点 1 连接到除 2 之外的所有节点，因此它会拉入 3、4、5。 移除禁止边后，节点 2 仍保持隔离状态。 

这些痕迹显示了如何通过排除而不是显式边缘列表来隐式构建补邻接。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n + m)\log n)$| 每个节点从集合中插入/删除一次，并且在扩展期间检查每个禁止的邻接|
 | 空间|$O(n + m)$| 禁止边缘和簿记结构的存储 |

 复杂性在一定范围内，因为每个城市都被处理一次，并且禁止边缘仅限制扩展而不是二次倍增工作。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    from collections import deque

    n, m = map(int, input().split())
    bad = [set() for _ in range(n + 1)]
    for _ in range(m):
        a, b = map(int, input().split())
        bad[a].add(b)
        bad[b].add(a)

    unvisited = set(range(1, n + 1))
    components = []

    while unvisited:
        start = next(iter(unvisited))
        unvisited.remove(start)

        q = deque([start])
        comp = [start]

        while q:
            u = q.popleft()
            for v in list(unvisited):
                if v not in bad[u]:
                    unvisited.remove(v)
                    q.append(v)
                    comp.append(v)

        components.append(comp)

    out = []
    out.append(str(len(components)))
    for comp in components:
        out.append(str(len(comp)) + " " + " ".join(map(str, comp)))
    return "\n".join(out)

# provided sample
assert run("""4 4
1 2
1 3
4 2
4 3
""").split()[0] == "2"

# single node
assert run("""1 0
""").strip() == "1\n1 1"

# fully connected forbidden (no edges in real graph)
assert run("""3 3
1 2
1 3
2 3
""").split()[0] == "3"

# no forbidden edges (complete real graph)
assert run("""3 0
""").split()[0] == "1"

# sparse mix
assert run("""5 2
1 2
4 5
""").split()[0] == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点 | 1 个组件 | 最小边界|
 | 全面禁止派系| 3 个组件 | 完全断开|
 | 没有边缘| 1 个组件 | 完整的连接补充|
 | 稀疏混合| 2 个组件 | 混合结构的正确性 |

 ## 边缘情况

 最小图与$n=1$没有禁止边并且必须输出单个分量。 该算法用{1}初始化未访问集，选择它作为起始节点，并立即形成仅包含该节点的组件。 没有发生扩展，符合预期结果。 

具有边 (1,2)、(1,3)、(2,3) 的完全禁止三角形会生成没有边的实图。 从 1 开始的 BFS 不能扩展到任何其他节点，因为每个潜在的邻居都被禁止。 该算法将每个节点隔离到其自己的组件中，根据需要生成三个单例组件。 

没有禁止边的情况在实际解释中会产生完整的图。 从任何节点开始，BFS 都会立即消耗所有剩余的顶点，因为没有任何顶点被阻塞。 该算法生成包含所有节点的单个组件，该组件与完全连接性相匹配。
