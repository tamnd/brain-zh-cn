---
title: "CF 102214G - 文字"
description: "该游戏可以建模为有向图。 每个字母都是一个顶点，每个单词都是从第一个字母到最后一个字母的有向边。"
date: "2026-08-18T00:14:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102214
codeforces_index: "G"
codeforces_contest_name: "\u041e\u0442\u043a\u0440\u044b\u0442\u043e\u0435 \u043b\u0438\u0447\u043d\u043e\u0435 \u043f\u0435\u0440\u0432\u0435\u043d\u0441\u0442\u0432\u043e \u0418\u041a\u0418\u0422 \u0421\u0424\u0423 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2015"
rating: 0
weight: 102214
solve_time_s: 97
verified: true
draft: false
---

[CF 102214G - 单词](https://codeforces.com/problemset/problem/102214/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 37s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该游戏可以建模为有向图。 每个字母都是一个顶点，每个单词都是从第一个字母到最后一个字母的有向边。 如果玩家刚刚说了一个由边 (u \to v) 表示的单词，则下一个单词必须从 (v) 开始，因此下一条边必须离开顶点 (v)。 

任务是添加尽可能少的新单词，因此添加尽可能少的有向边，以便从每个现有单词中我们最终可以通过有效的游戏动作到达每个其他单词。 输入最多包含 (N,M\le 100000)，其中 (N) 是字母表大小，(M) 是现有单词数。 官方限制为 2 秒和 256 MB。 二次算法在上限上已经需要大约 (10^{10}) 次运算，因此解本质上必须是线性的或 (O((N+M)\log N))。 

有一个微妙的建模问题：没有出现在单词中的字母不应该参与答案。 例如，```
5 1
1 2
```有答案`1`。 我们只需要添加`2 -> 1`。 为所有五个字母创建 SCC 并将三个独立的字母计为需要连接的组件的粗心实现会产生更大的答案。 

另一个边缘情况是已经强连接的图。 例如，```
3 3
1 2
2 3
3 1
```有答案`0`。 从每个单词到其他每个单词已经有一条有效的路线。 盲目应用通常的源/汇公式而不检查是否只有一个 SCC 的实现将错误地返回`1`。 

自循环也值得关注。 为了```
1 1
1 1
```答案是`0`。 单个单词后面只能跟着另一个以字母 1 开头的单词，并且同一字母既是其开头又是结尾。 由于只有一个活动的 SCC，因此不需要新词。 

最后，几个单词可以具有相同的端点字母对。 它们在游戏中是不同的单词，但对于可达性而言，它们的行为与图边相同。 SCC计算只需要两个字母之间存在边，因此重复的边不会改变组件结构。 

## 方法

 直接的方法是尝试添加可能的单词，直到生成的图变得强连接。 有 (N^2) 个可能的有序字母对，因此已经有 (2^{N^2}) 个可能的候选单词子集。 对于每个候选子集，我们必须构建结果图并检查可达性，在最坏的情况下需要 (O(N+M+N^2)) 工作。 由此产生的最坏情况操作计数是 (O(2^{N^2}(N+M+N^2)))，即使对于非常小的字母表，这也是完全不可行的。 蛮力在概念上是正确的，因为它准确地测试了游戏所需的属性，但它忽略了有向图的结构。 

关键的观察结果是，游戏条件相当于单词中实际出现的字母形成的图形的强连通性。 假设有一条从单词（A）的最后一个字母到单词（B）的第一个字母的路径。 我们可以玩（A），使用中间词遵循该路径，最终玩（B）。 因此，当每个活动字母可以到达其他所有活动字母时，每个单词都可以准确地到达其他所有单词。 

一旦问题以这种方式表述，强连接的组件就给出了整个结构。 在一个 SCC 内，每个顶点都可以到达其他每个顶点。 将每个 SCC 收缩为一个顶点后，得到的压缩图就是一个 DAG。 如果它有多个组件，则每个源组件都需要一个传入边缘，每个接收器组件都需要一个传出边缘。 在组件之间添加有向边可以满足这两个要求。 

令(S)为源SCC的数量，(T)为宿SCC的数量。 至少需要 (S) 个新单词，因为一个添加的单词只有一个起始点，因此最多可以为一个源 SCC 提供输入边缘。 类似地，至少需要(T)个新单词，因为添加一个单词最多可以留下一个接收器SCC。 因此至少需要 (\max(S,T)) 个单词。 

该下限也是可以实现的。 我们可以循环地将接收器组件连接到源组件，当源或接收器的计数不同时重用它们。 通过 (K=\max(S,T)) 添加边，每个源接收一个传入边，每个接收器接收一个传出边，并且生成的凝结图变得强连接。 所以答案正是 (\max(S,T))，除了只有一个活动 SCC 的图已经需要零添加的单词。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^{N^2}(N+M+N^2))) | (O(N^2+N+M)) | 太慢了 |
 | SCC冷凝 | (O(N+M)) | (O(N+M)) | 已接受 |

 ## 算法演练

 1. 使用字母作为顶点、单词作为边构建有向图。 还构建反转图。 我们只需要作为某个单词的第一个或最后一个字母出现的顶点，因为孤立的字母不能影响单词之间的转换。 
2.用Kosaraju算法找到所有强连通分量。 第一个 DFS 按整理顺序记录顶点，而反向图上的第二个 DFS 按反向整理顺序分配组件标识符。 
3. 如果所有活动顶点都属于一个SCC，则输出`0`。 每个词已经可以到达其他词了。 
4. 对于每条原始边 (u\to v)，比较 (u) 和 (v) 的 SCC 标识符。 如果它们不同，则这是凝聚 DAG 的两个顶点之间的边。 增加目标 SCC 的入度和源 SCC 的出度。 
5. 计算入度为零的 SCC 和出度为零的 SCC。 这些是凝结图的源和汇组件。 
6. 输出这两个计数中较大的一个。 这是所需的最小新字数，因为每个源都需要一个传入连接，每个接收器都需要一个传出连接，而上述循环结构恰好用那么多边满足了这两个要求。 

### 为什么它有效

 收缩 SCC 后，每个剩余的边都会在不同的组件之间移动，生成的图就是 DAG。 源组件没有来自另一组件的传入路径，因此至少有一个新添加的单词必须进入其中。 同样，接收器组件无法到达另一个组件，因此至少有一个新添加的单词必须离开它。 因此任何有效的解决方案至少需要 (\max(S,T)) 个新单词。 

相反，取宿SCC和源SCC并循环连接它们。 如果一侧的组件较少​​，请在必要时重用该侧的组件。 然后，每个源接收一个传入边缘，每个接收器接收一个传出边缘，并且遵循循环连接让我们可以从每个 SCC 移动到每个其他 SCC。 由于每个 SCC 内部已经是强连接的，因此整个图变得强连接。 下限是可以实现的，因此 (\max(S,T)) 是最优的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n)]
    rev = [[] for _ in range(n)]
    edges = []
    active = [False] * n

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1

        graph[u].append(v)
        rev[v].append(u)
        edges.append((u, v))

        active[u] = True
        active[v] = True

    # First pass of Kosaraju: finishing order.
    visited = [False] * n
    order = []

    for start in range(n):
        if not active[start] or visited[start]:
            continue

        visited[start] = True
        stack = [(start, 0)]

        while stack:
            u, idx = stack[-1]

            if idx < len(graph[u]):
                v = graph[u][idx]
                stack[-1] = (u, idx + 1)

                if not visited[v]:
                    visited[v] = True
                    stack.append((v, 0))
            else:
                order.append(u)
                stack.pop()

    # Second pass on the reversed graph: assign SCCs.
    comp = [-1] * n
    comp_count = 0

    for start in reversed(order):
        if comp[start] != -1:
            continue

        comp[start] = comp_count
        stack = [start]

        while stack:
            u = stack.pop()

            for v in rev[u]:
                if comp[v] == -1:
                    comp[v] = comp_count
                    stack.append(v)

        comp_count += 1

    if comp_count == 1:
        print(0)
        return

    indeg = [0] * comp_count
    outdeg = [0] * comp_count

    for u, v in edges:
        cu = comp[u]
        cv = comp[v]

        if cu != cv:
            outdeg[cu] = 1
            indeg[cv] = 1

    sources = 0
    sinks = 0

    for c in range(comp_count):
        if indeg[c] == 0:
            sources += 1
        if outdeg[c] == 0:
            sinks += 1

    print(max(sources, sinks))

if __name__ == "__main__":
    solve()
```输入循环构造原始图和反转图，因为 Kosaraju 需要两个方向。 这`active`数组可防止孤立的字母被视为有意义的组件。 

第一个 DFS 是迭代的而不是递归的。 当 (N=100000) 时，递归 DFS 可能会超出 Python 的递归限制，并且还会产生不必要的解释器开销。 堆栈存储当前顶点和下一个出边的索引，这让我们无需递归即可重现递归 DFS 整理顺序。 

第二个 DFS 遍历反转图，并将一个组件标识符分配给每个可到达的顶点。 由于顶点是从第一遍开始按照递减的整理顺序进行处理的，因此每次遍历都恰好位于一个 SCC 内。 

知道 SCC 后，只有不同组件之间交叉的边才重要。 我们不需要此类边的确切数量，只需要每个组件是否至少有一个传入或传出边，因此`indeg`和`outdeg`存储为类似布尔的整数。 一个 SCC 内部的边会被忽略，因为它不会影响凝聚 DAG。 

特殊情况`comp_count == 1`必须在计算源和汇之前进行处理。 对于单个分量，在凝聚表示中它的入度和出度都为零，但正确的答案是`0`， 不是`1`。 

Python 整数具有任意精度，因此不存在整数溢出问题。 图存储总量与顶点和边的数量成线性关系。 

## 工作示例

 ### 示例 1

 官方示例包含三个有向循环，从第一个循环到其他两个循环有额外的边。 它的答案是`2`。```
9 11
1 2
2 3
3 1
4 5
5 6
6 4
7 8
8 9
9 7
1 4
1 7
```SCC分解和缩合信息为：

 | 南昌中心 | 顶点 | 入度| 出度 | 角色 |
 | ---| ---| ---| ---| ---|
 | 0 | 1、2、3 | 0 | 1 | 来源 |
 | 1 | 4、5、6 | 1 | 0 | 水槽|
 | 2 | 7、8、9 | 1 | 0 | 水槽|

 有一个源 SCC 和两个宿 SCC，因此算法计算`max(1, 2) = 2`。 

从概念上讲，这两个附加词可以将两个接收器组件连接回源组件。 一旦这些连接存在，所有三个 SCC 都位于一个强连接结构中。 该示例说明了为什么仅计算源组件是不够的：必须修复两个方向的可达性。 

### 构造示例 2

 考虑：```
4 3
1 2
2 3
3 4
```SCC 都是单个顶点。 凝结图只是一条链。 

| 南昌中心 | 顶点| 入度| 出度 | 角色 |
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 0 | 1 | 来源 |
 | 1 | 2 | 1 | 1 | 内部|
 | 2 | 3 | 1 | 1 | 内部|
 | 3 | 4 | 1 | 0 | 水槽|

 有一个源和一个汇，所以答案是`1`。 添加这个词`4 -> 1`将链条闭合成一个循环。 

该跟踪显示了源计数和接收器计数相等的最简单情况。 它还说明了为什么答案不是 SCC 的数量减一。 单个添加的边可以将最终接收器连接回初始源并修复整个链。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(N+M)) | 每个图和反向图边都被遍历恒定的次数。 |
 | 空间| (O(N+M)) | 两个邻接表、边表、组件数组和DFS堆栈都是线性的。 |

 (100000) 个字母和 (100000) 个单词的上限使得线性复杂度合适。 该算法执行一些图形遍历并扫描原始边缘，因此它保持在预期的 2 秒和 256 MB 限制内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    try:
        n, m = map(int, input().split())

        graph = [[] for _ in range(n)]
        rev = [[] for _ in range(n)]
        edges = []
        active = [False] * n

        for _ in range(m):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            graph[u].append(v)
            rev[v].append(u)
            edges.append((u, v))
            active[u] = True
            active[v] = True

        visited = [False] * n
        order = []

        for start in range(n):
            if not active[start] or visited[start]:
                continue

            visited[start] = True
            stack = [(start, 0)]

            while stack:
                u, idx = stack[-1]

                if idx < len(graph[u]):
                    v = graph[u][idx]
                    stack[-1] = (u, idx + 1)

                    if not visited[v]:
                        visited[v] = True
                        stack.append((v, 0))
                else:
                    order.append(u)
                    stack.pop()

        comp = [-1] * n
        comp_count = 0

        for start in reversed(order):
            if comp[start] != -1:
                continue

            comp[start] = comp_count
            stack = [start]

            while stack:
                u = stack.pop()

                for v in rev[u]:
                    if comp[v] == -1:
                        comp[v] = comp_count
                        stack.append(v)

            comp_count += 1

        if comp_count == 1:
            return "0\n"

        indeg = [0] * comp_count
        outdeg = [0] * comp_count

        for u, v in edges:
            cu = comp[u]
            cv = comp[v]

            if cu != cv:
                outdeg[cu] = 1
                indeg[cv] = 1

        sources = sum(x == 0 for x in indeg)
        sinks = sum(x == 0 for x in outdeg)

        return f"{max(sources, sinks)}\n"

    finally:
        sys.stdin = old_stdin
        input = old_input

# Provided sample
assert run("""\
9 11
1 2
2 3
3 1
4 5
5 6
6 4
7 8
8 9
9 7
1 4
1 7
""") == "2\n", "provided sample"

# Minimum size, one self-loop
assert run("""\
1 1
1 1
""") == "0\n", "single self-loop"

# One non-trivial word
assert run("""\
2 1
1 2
""") == "1\n", "single directed edge"

# Isolated letters must not count
assert run("""\
5 1
1 2
""") == "1\n", "isolated letters"

# All active vertices already strongly connected
assert run("""\
4 5
1 2
2 3
3 4
4 1
2 4
""") == "0\n", "already strongly connected"

# Maximum-size style case: a chain of 100000 vertices
n = 100000
chain = [f"{i} {i + 1}" for i in range(1, n)]
chain_input = f"{n} {n - 1}\n" + "\n".join(chain) + "\n"
assert run(chain_input) == "1\n", "maximum-size chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 1 1`|`0`| 最小尺寸图和自循环处理 |
 |`2 1 / 1 2`|`1`| 单源单汇|
 |`5 1 / 1 2`|`1`| 必须忽略孤立的字母 |
 |`4 5 / 1 2 / 2 3 / 3 4 / 4 1 / 2 4`|`0`| 已经是强连通图 |
 | 100000 顶点有向链 |`1`| 最大尺寸输入和线性性能|

 ## 边缘情况

 对于孤立的字母，请考虑确切的输入```
5 1
1 2
```只有字母 1 和 2 处于活动状态。 Kosaraju 创建两个 SCC，其中一个包含每个活动字母。 第一个的入度为零，第二个的出度为零，因此源计数和汇计数均为 1。 算法返回`1`，正确忽略字母 3、4 和 5。 

对于已经强连接的图，```
3 3
1 2
2 3
3 1
```所有三个顶点都接收相同的组件标识符。 算法立即停止在`comp_count == 1`检查并打印`0`。 不需要源或接收器计数，因为原始图已经允许每对单词之间的移动。 

对于单个非循环单词，```
2 1
1 2
```有两个 SCC。 顶点 1 是源，顶点 2 是汇。 一个新词，`2 -> 1`，关闭循环，所以答案是`1`。 这会捕获当只有一个原始边时意外返回零的实现。 

对于长单向链，```
4 3
1 2
2 3
3 4
```每个顶点都是其自己的 SCC，但只有顶点 1 是源，只有顶点 4 是接收器。 答案依然是`1`，因为添加`4 -> 1`使整个图强连通。 计算 SCC 本身而不是源 SCC 和汇 SCC 会大大高估答案。 

对于官方样本，三个周期形成三个 SCC。 第一个 SCC 是源，而第二个和第三个是接收器。 答案是`2`，匹配示例输出。 该示例演示了不对称情况，其中接收器组件的数量大于源组件的数量，这正是该公式使用的原因`max(sources, sinks)`。
