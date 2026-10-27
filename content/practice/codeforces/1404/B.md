---
title: "CF 1404B - 树标签"
description: "我们有一棵树，其中两个玩家从不同的顶点开始。 爱丽丝先行动。 每回合，Alice 可以跳到距离 da 内的任意顶点，Bob 可以跳到距离 db 内的任意顶点。 距离是树中标准的最短路径长度。"
date: "2026-06-14T17:13:28+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "games", "trees"]
categories: ["algorithms"]
codeforces_contest: 1404
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 668 (Div. 1)"
rating: 1900
weight: 1404
solve_time_s: 217
verified: true
draft: false
---

[CF 1404B - 树标签](https://codeforces.com/problemset/problem/1404/B)

 **评级：** 1900
 **标签：** dfs 和类似、dp、游戏、树木
 **求解时间：** 3m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树，其中两个玩家从不同的顶点开始。 爱丽丝先行动。 每回合，爱丽丝都可以跳到距离内的任何顶点`da`，鲍勃可以跳到距离内的任何顶点`db`。 距离是树中标准的最短路径长度。 

Alice 的目标是在某个移动序列结束时最终降落在与 Bob 相同的顶点上。 如果这种情况从未发生，鲍勃就被认为永远逃脱了。 

关键是运动不是局部的、一步一步的。 每次移动都允许在树度量半径内的任何地方跳跃，这使得游戏关于大邻域的可达性而不是邻接性。 

这些约束表明每个测试用例的解决方案接近线性，因为所有测试的顶点总数最多为 100000。任何每次移动重复探索树或模拟游戏的解决方案都会立即变得太慢。 

一个天真的解释会模拟每次移动后所有可能的位置。 这会失败，因为每次移动都会扩展到树中的一个大球，而分支因子在最坏的情况下会变成整个树。 甚至显式表示可达集也变成二次的。 

如果我们只比较初始距离，就会出现更微妙的故障模式。 例如，如果 Alice 最初距离 Bob 稍远，但移动性较大，则由于树的结构，她稍后仍可能捕获他。 相反，如果鲍勃的移动半径大得多，即使最初很接近，鲍勃也可能逃脱。 

朴素推理中缺少的关键要素是，树结构限制了距离缩小或增长的速度，而全局结构，尤其是直径，限制了逃生路线。 

## 方法

 暴力模拟将跟踪每个玩家在每个回合后可以到达的所有顶点。 从每个当前位置，我们将扩展到其中的所有节点`da`或者`db`使用广度优先搜索（BFS）。 重复此操作会导致重复探索大型重叠子树。 在最坏的情况下，每次移动都会花费`O(n)`，并且由于游戏可能会持续很多步，因此在问题的时间限制下这变得无界。 

关键的见解是我们不需要随着时间的推移模拟游戏。 结果仅取决于一小部分结构量：玩家之间的初始距离和树的整体“宽度”（由其直径捕获）。 

推理分为三种情况。 

如果爱丽丝已经可以一步到达鲍勃，她立即获胜。 

如果鲍勃与爱丽丝相比相对较慢，这意味着他的最大跳跃不超过爱丽丝的两倍，那么无论结构如何，爱丽丝总能最终缩小差距。 直观上，爱丽丝每秒移动的距离减少的速度是鲍勃无法补偿的。 

如果鲍勃明显更快，他可以尝试跑向树的最远部分。 在这种情况下，爱丽丝仍然获胜的唯一方法是树太“小”而鲍勃无法保持分离，这意味着直径不足以支撑逃生走廊。 

这将问题简化为计算单个最短路径距离和树直径。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| 最坏情况 O(n²) | O(n) | 太慢了 |
 | 直径+距离逻辑| 每次测试 O(n) | O(n) | 已接受 |

 ## 算法演练

 ### 1. 计算 Alice 和 Bob 之间的距离

 我们运行 BFS 或 DFS 来计算最短路径距离`d(a, b)`在树上。 这直接决定了Alice能否一举擒住Bob。 

如果这个距离最多为`da`，Alice 立即获胜，因为她可以直接跳到 Bob 的位置。 

### 2. 计算树的直径

 我们使用两次 BFS 遍历找到树的直径。 从任意节点开始的第一个 BFS 找到最远的节点`x`，然后是第二个 BFS`x`找到最远的距离`D`。 

该直径代表树中任意两个节点之间的最大可能间隔，并作为 Bob 可以连续撤退多远的界限。 

### 3.检查Bob相对于Alice是否太快

 如果`db <= 2 * da`，爱丽丝总是赢。 

直觉是，即使鲍勃以最佳方式远离，爱丽丝仍然可以减少交替转弯的有效距离。 鲍勃增加分离的速度不可能快于爱丽丝消除分离的速度。 

### 4. 处理快鲍勃政权

 如果`db > 2 * da`，鲍勃可以通​​过始终向树的最远部分移动来保持距离。 

在这种情况下，只有当树太小而无法持续逃逸时，爱丽丝才会获胜，即直径满足`D <= 2 * da`。 

如果直径大于此值，Bob 可以不断向远处端点重新定位并防止捕获。 

### 5. 组合条件

 如果满足以下任一条件，爱丽丝获胜：

 -`d(a, b) <= da`-`db <= 2 * da`-`D <= 2 * da`否则鲍勃获胜。 

### 为什么它有效

 核心不变量是鲍勃避免捕获的能力取决于沿着树中最长路径保持非递减间隔。 如果树足够“宽”（直径大）并且鲍勃比爱丽丝足够快，那么他总是可以重新定位以保持大于爱丽丝捕获半径的距离。 

如果鲍勃的速度不够快，爱丽丝的交替优势将确保任何分离最终都会崩溃。 在这种情况下，直径条件变得无关紧要，因为鲍勃无法足够快地利用全局结构。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def bfs(start, g):
    n = len(g) - 1
    dist = [-1] * (n + 1)
    q = deque([start])
    dist[start] = 0
    far = start
    while q:
        v = q.popleft()
        for to in g[v]:
            if dist[to] == -1:
                dist[to] = dist[v] + 1
                q.append(to)
                if dist[to] > dist[far]:
                    far = to
    return far, dist

def distance(a, b, g):
    _, dist = bfs(a, g)
    return dist[b]

def diameter(g):
    x, _ = bfs(1, g)
    y, dist = bfs(x, g)
    return dist[y]

def solve():
    t = int(input())
    out = []
    for _ in range(t):
        n, a, b, da, db = map(int, input().split())
        g = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            g[u].append(v)
            g[v].append(u)

        d = distance(a, b, g)
        D = diameter(g)

        if d <= da:
            out.append("Alice")
        elif db <= 2 * da:
            out.append("Alice")
        elif D <= 2 * da:
            out.append("Alice")
        else:
            out.append("Bob")

    print("\n".join(out))

if __name__ == "__main__":
    solve()
```该实现将逻辑分为三个独立的测量：Alice-Bob 距离、树直径和速度比较。 BFS 例程可重复用于距离查询和直径计算，以避免重复的遍历逻辑。 

一个常见的陷阱是每个测试用例重复重新计算距离。 这里所有的事情都是在每棵树的线性时间内计算的，确保总复杂性保持在限制范围内。 

## 工作示例

 ### 示例 1

 输入：```
4 3 2 1 2
1 2
1 3
1 4
```我们计算距离`d(3,2)=2`。 爱丽丝的跳跃是`da=1`，因此她无法立即联系到 Bob。 

这棵星形树的直径是2。 

我们检查条件：

 | 数量 | 价值|
 | ---| ---|
 | d(a,b) | d(a,b) | 2 |
 | 达| 1 |
 | 数据库 | 2 |
 | d | 2 |

 自从`db <= 2 * da`是`2 <= 2`，爱丽丝立即获胜。 

这证明了鲍勃即使在分支树中也不够快以维持分离的情况。 

### 示例 2

 输入：```
6 6 1 2 5
1 2
2 3
3 4
4 5
5 6
```这是一个路径图。 端点之间的距离为 5。 

| 数量 | 价值|
 | ---| ---|
 | d(a,b) | d(a,b) | 5 |
 | 达| 2 |
 | 数据库 | 5 |
 | d | 5 |

 这里`db > 2 * da`(5 > 4)，并且初始距离和直径都超过了 Alice 的到达阈值。 

鲍勃总是可以撤退到远端，保持分离。 这证实了鲍勃获胜。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每次测试 O(n) | 每个 BFS 在节点中都是线性的，并且我们每次测试都运行恒定的数量 |
 | 空间| O(n) | 邻接表加距离数组 |

 总和为`n`所有测试的总和以 100000 为界，因此该解决方案在时间限制内可以顺利运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    from collections import deque

    def bfs(start, g):
        n = len(g) - 1
        dist = [-1] * (n + 1)
        q = deque([start])
        dist[start] = 0
        far = start
        while q:
            v = q.popleft()
            for to in g[v]:
                if dist[to] == -1:
                    dist[to] = dist[v] + 1
                    q.append(to)
                    if dist[to] > dist[far]:
                        far = to
        return far, dist

    def distance(a, b, g):
        _, dist = bfs(a, g)
        return dist[b]

    def diameter(g):
        x, _ = bfs(1, g)
        y, dist = bfs(x, g)
        return dist[y]

    t = int(input())
    out = []
    for _ in range(t):
        n, a, b, da, db = map(int, input().split())
        g = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            g[u].append(v)
            g[v].append(u)

        d = distance(a, b, g)
        D = diameter(g)

        if d <= da or db <= 2 * da or D <= 2 * da:
            out.append("Alice")
        else:
            out.append("Bob")

    return "\n".join(out) + "\n"

# provided samples
assert run("""4
4 3 2 1 2
1 2
1 3
1 4
6 6 1 2 5
1 2
6 5
2 3
3 4
4 5
9 3 9 2 5
1 2
1 6
1 9
1 3
9 5
7 9
4 8
4 3
11 8 11 3 3
1 2
11 9
4 9
6 5
2 10
3 2
5 9
8 3
7 4
7 10
""") == """Alice
Bob
Alice
Alice
"""

# minimum case
assert run("""1
2 1 2 1 1
1 2
""") == "Alice\n"

# line case
assert run("""1
5 1 5 1 1
1 2
2 3
3 4
4 5
""") == "Alice\n"

# fast Bob
assert run("""1
5 1 5 1 10
1 2
2 3
3 4
4 5
""") == "Bob\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小树 | 爱丽丝| 基本邻接捕获|
 | 折线图| 爱丽丝| 直径边缘行为|
 | 快鲍勃| 鲍勃 | 高速逃生制度|

 ## 边缘情况

 当 Alice 和 Bob 已经很接近但 Bob 的移动范围很大时，就会出现严重的边缘情况。 即使鲍勃可以移动很远，如果直径足够小以防止持续躲避，爱丽丝仍然可能获胜。 条件`D <= 2 * da`通过限制鲍勃利用长逃生路径的能力来捕获这一点。 

另一个微妙的情况是鲍勃速度更快但树高度不平衡。 即使如此，如果直径很小，鲍勃也无法重复重置距离。 该算法正确地将这种情况分类为“爱丽丝获胜”。 

最后，在像单边这样的非常小的树中，直接距离比较占主导地位。 BFS 距离检查可确保正确性，而不依赖于直径推理。
