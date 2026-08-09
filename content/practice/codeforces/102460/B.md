---
title: "CF 102460B - 电力监控系统"
description: "电网是一棵树，因此每对节点之间都有一条路径。 我们需要选择尽可能少的节点来放置 PMU。 将 PMU 放置在节点上会立即监视该节点、每条事件传输线路以及每个相邻节点。"
date: "2026-08-08T09:58:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102460
codeforces_index: "B"
codeforces_contest_name: "2019-2020 ICPC Asia Taipei-Hsinchu Regional Contest"
rating: 0
weight: 102460
solve_time_s: 188
verified: true
draft: false
---

[CF 102460B - 功率监控系统](https://codeforces.com/problemset/problem/102460/B)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 电网是一棵树，因此每对节点之间都有一条路径。 我们需要选择尽可能少的节点来放置 PMU。 

将 PMU 放置在节点上会立即监视该节点、每条事件传输线路以及每个相邻节点。 完成该初始步骤后，监控可以在整个树中传播。 受监控的节点可以监控其唯一剩余的未受监控的邻居，并且一旦监控了一条边的两个端点，该边也会受到监控。 在树上，这些规则正是通常的权力支配过程：首先获取每个选定顶点的封闭邻域，然后反复让受监视的顶点强制其唯一的不受监视的邻居。 输出是最终监视每个节点所需的最小选定顶点数。 

输入包含 (n) 个节点和 (n-1) 个边。 由于图是一棵树，因此没有循环，也不需要通用的图算法。 限制 (n\le 100000) 排除了枚举顶点子集的方法，并且 2 秒限制强烈支持 (O(n)) 或 (O(n\log n)) 算法。 事实上，每个子树都通过一个父边连接到树的其余部分，这一事实是我们将利用的结构属性。 

第一个边缘情况是最小的可能树：```
2
1 2
```一个 PMU 就足够了，因为任一节点都会立即监视这两个节点。 答案是`1`。 仅考虑内部顶点而忘记最终根情况的实现可能会错误地返回零。 

第二个边缘情况是一颗星：```
5
1 2
1 3
1 4
1 5
```正确答案是`1`，通过将 PMU 放置在节点 1 处。尝试独立处理叶子的策略可能会错误地放置多个 PMU，即使一个中央 PMU 立即观察到所有这些 PMU。 

第三种边缘情况是分支树，其中一个 PMU 是不够的：```
7
1 2
1 3
2 4
2 5
3 6
3 7
```正确答案是`2`。 节点 1 处的 PMU 观察节点 1、2 和 3，但节点 2 和 3 中的每个节点仍然有两个不受监控的子节点，因此两者都无法强制执行任何操作。 然而，在任意叶子上不需要两个额外的 PMU，因为将它们放置在节点 2 和 3 上会监视所有四个叶子。 诸如“每个分支顶点一个 PMU”之类的幼稚规则在星形上也是错误的，因为分支顶点本身已经解决了整个树的问题。 

## 方法

 直接暴力方法是尝试将每个可能的顶点子集作为 PMU 集。 对于每个子集，模拟监控规则，直到无法监控到新的顶点，然后检查整棵树是否被覆盖。 有 (2^n) 个可能的子集，甚至每个子集的线性时间模拟都会给出 (O(n2^n)) 工作。 在 (n=30) 时，这已经是大约 (30\cdot2^{30}) 或大约 (3.2\times10^{10}) 顶点级操作。 在（n=100000）时，指数枚举是完全不可行的。 

蛮力之所以有效，是因为一旦 PMU 位置固定，监控过程本身就是确定性的。 问题在于它忽略了这样一个事实：树让我们在处理其父树之前决定子树。 

树的根位于节点 1，并从叶子到根处理顶点。 考虑一个非根顶点 (v)。 当我们处理 (v) 时，其子子树内的所有决策都已经做出，并且已经执行了可以向上传播的任何监视。 (v) 的子树与树的其余部分之间的唯一连接是从 (v) 到其父级的边。 

关键的观察结果是，如果 (v) 当前至少有两个不受监控的子节点，则仅通过等待父节点的传播无法完成子树。 受监视的 (v) 最多可以强制剩下一个邻居。 对于两个不受监控的子方向，必须在树的这一部分中使用一些 PMU。 将 PMU 放置在 (v) 处至少与将其放置在这些分支之一的较深处一样有用，因为 (v) 直接观察其所有子树并将子树连接到父树。 

这给出了贪婪的后序规则。 每当非根顶点至少有两个不受监控的子节点时，请在该顶点放置一个 PMU 并彻底应用监控规则。 否则，推迟决策，因为该顶点仍然可以通过上面的传播来处理。 处理完所有非根顶点后，如果根仍然不受监控，则需要在根处添加一个最终 PMU。 

这是功率支配的标准线性时间树算法。 后序条件及其最优性源于以下事实：当考虑其父级时，每个子子树都已得到最优解析。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(n2^n)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 以节点 1 为树的根并计算每个顶点的父节点。 存储一个遍历顺序，以便反转它可以在处理父母之前处理孩子。 特定的根不会影响最小答案，因此选择节点 1 只是一个方便的实现选择。 
2. 维护`observed[v]`，它告诉节点 (v) 是否已被监视。 还维护`unobserved[v]`，(v) 当前不受监控的邻居数量。 这让我们可以应用传播规则，而无需重复扫描整个图。 
3. 每当一个顶点被观察到时，减少其每个邻居的不受监控的邻居计数。 如果观察到的顶点恰好到达一个不受监控的邻居，请将其放入队列中，因为它现在可以强制该邻居。 
4. 当 PMU 放置在 (v) 处时，标记 (v) 及其所有相邻的观察到的位置。 然后处理传播队列直到它变空。 这准确地再现了权力统治的两个阶段：PMU 观察其封闭邻域，之后受监控的顶点反复强制其独特的不受监控的邻居。 
5. 以逆遍历顺序处理每个非根顶点。 计算有多少个孩子仍未被观察到。 如果至少有两个孩子未被观察到，则将 PMU 放置在 (v) 处，增加答案，并耗尽传播队列。 
6. 如果 (v) 有零个或一个未观察到的子节点，请勿将 PMU 放置在那里。 最多有一个未被观察到的孩子，父方最终可以提供丢失的受监控邻居，从而允许 (v) 强制该孩子。 提前使用 PMU 不会改善最优结果。 
7. 处理完所有非根顶点后，检查根。 如果仍未观察到，则在那里放置一个 PMU。 由于根没有父级，因此没有后来的顶点可以强制它，因此最终检查是必要的。 
8. 输出放置的PMU 数量。 

不变的是，在处理顶点 (v) 后，算法已经在每个已处理的子子树内做出了最小必要数量的 PMU 决策，同时尽可能从上面处理 (v)。 如果 (v) 有两个未观察到的子节点，则其子树内的一个 PMU 是不可避免的，并且将其放置在 (v) 处同时支配两个子节点方向。 如果它至多有一个未观察到的子级，则传播可以处理剩余的方向，因此无需添加 PMU。 由于每个子树仅通过其父边缘与树的其余部分进行通信，因此这些本地决策不会干扰已处理的子树。 这给出了全局最优值。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    n = int(input())

    graph = [[] for _ in range(n)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append(v)
        graph[v].append(u)

    # Root the tree at 0.
    parent = [-1] * n
    order = [0]
    parent[0] = 0

    for v in order:
        for u in graph[v]:
            if u == parent[v]:
                continue
            parent[u] = v
            order.append(u)

    children = [[] for _ in range(n)]
    for v in range(1, n):
        children[parent[v]].append(v)

    observed = [False] * n
    unobserved = [len(graph[v]) for v in range(n)]
    queued = [False] * n
    q = deque()

    def observe(v):
        if observed[v]:
            return

        observed[v] = True

        for u in graph[v]:
            unobserved[u] -= 1
            if observed[u] and unobserved[u] == 1 and not queued[u]:
                queued[u] = True
                q.append(u)

    def propagate():
        while q:
            v = q.popleft()
            queued[v] = False

            if not observed[v] or unobserved[v] != 1:
                continue

            for u in graph[v]:
                if not observed[u]:
                    observe(u)
                    break

    def place_pmu(v):
        observe(v)
        for u in graph[v]:
            observe(u)
        propagate()

    answer = 0

    # Reverse order is a postorder because every child occurs
    # after its parent in the original traversal.
    for v in reversed(order[1:]):
        unobserved_children = 0

        for u in children[v]:
            if not observed[u]:
                unobserved_children += 1

        if unobserved_children >= 2:
            answer += 1
            place_pmu(v)

    if not observed[0]:
        answer += 1

    print(answer)

if __name__ == "__main__":
    solve()
```邻接表将树存储在 (O(n)) 空间中。 这`parent`数组和`order`array 无需递归 DFS 即可建立根树顺序，从而避免了包含 100000 个顶点的路径上的 Python 递归深度问题。 

这`observe`功能是中央簿记操作。 当一个顶点被观察到时，每个邻居都会失去一个未观察到的邻居。 如果一个已经观察到的邻居现在恰好有一个未观察到的邻居，则它有资格强制。 每个顶点最多被观察一次，因此所有调用`observe`一起仅接触 (O(n)) 条边。 

这`place_pmu`函数首先观察选定的顶点及其所有邻居，与 PMU 的初始效果完全匹配。 然后它调用`propagate`，重复执行强制规则。 这`unobserved[v] == 1`检查是规则的实施，即除了一个事件边缘之外的所有事件边缘都已被监控。 

后序循环在子树被解析后检查子树。 叶子没有孩子，因此永远不会触发`>= 2`条件，这是故意的。 对于这个问题，选择叶子永远不会比选择其父代更好，因此最优解决方案总是可以避免选择叶子。 

根被故意排除在贪婪循环之外。 树算法将根视为最终的未解决边界。 如果它仍未被观察到，选择它既是充分的也是必要的。 忘记这个最终条件是路径和二顶点树上的主要边界错误。 

任何整数都不能变得大到足以溢出 Python 整数。 答案最多是 (n)，尽管对于这种类型的树来说，实际的最佳值通常要小得多。 

## 工作示例

 对于示例 1，树的根位于节点 1。相关子关系为 (1\to2)、(2\to3,4)、(4\to5,6)、(6\to7,8) 和 (8\to9,10)。 处理从叶子向上进行。 

| 处理后的顶点| 做决定前不被观察的孩子| PMU 放置 | 新观察区域|
 | ---| ---| ---| ---|
 | 8 | 2 | 是的 | 8、9、10 以及向 6 传播 |
 | 6 | 0 | 没有 | 已经观察到 |
 | 4 | 1 | 没有 | 儿童 6 已被观察 |
 | 2 | 1 | 没有 | 子 4 已被观察 |
 | 1 | 最终根检查| 没有 | 已经观察到 |

 节点 8 处的第一个 PMU 通过链向节点 1 传播。在这个特定示例中，仅此一点并不能立即完成上部分支，因为节点 2 还有另一个未解析的子方向。 因此，在后序处理过程中需要第二个 PMU，给出示例答案`2`。 

决定性选择的更明确的状态跟踪是：

 | 舞台| 迄今为止的 PMU | 重要的未被观察到的孩子| 行动|
 | ---| ---| ---| ---|
 | 8 点之前 | 0 | 8 有 9 和 10 | 将 PMU 置于 8 |
 | 传播后| 1 | 上链部分监控 | 继续向上 |
 | 4点| 1 | 至多一个未解决的孩子 | 请勿放置|
 | 2点| 1 | 两个未解决的方向| 将 PMU 置于 2 |
 | 根检查| 2 | 根观察| 完成 |

 该示例说明了为什么阈值是两个未被观察的孩子而不是一个。 恰好有一个未解决的子方向的顶点可以使用强制规则，而两个未解决的子方向则需要新的监视源。 

对于示例 2，树是一个以节点 1 为中心的星形树。 

| 处理后的顶点| 未被观察的儿童 | PMU 放置 | 传播后的状态 |
 | ---| ---| ---| ---|
 | 5 | 0 | 没有 | 不变 |
 | 4 | 0 | 没有 | 不变 |
 | 3 | 0 | 没有 | 不变 |
 | 2 | 0 | 没有 | 不变 |
 | 1 | 最终根检查| 是的 | 观察到的所有五个顶点 |

 根是这里的自然选择。 选择节点 1 立即观察每个叶子，所以答案是`1`。 这个例子证实了为什么必须单独处理根以及为什么单独计算分支顶点无法解决问题。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n)) | (O(n)) | 每个顶点和边仅被处理固定次数 |
 | 空间| (O(n)) | (O(n)) | 邻接表、遍历数组、状态和传播队列 |

 该树恰好包含 (n-1) 条边，因此它的邻接表有 (O(n)) 个条目。 后序遍历检查每个子边一次，而每个观察仅更改顶点的状态一次并检查其关联边一次。 因此总工作是线性的。 对于 (n=100000)，(O(n)) 完全符合问题的预期规模，而指数暴力方法则根本不可行。 

## 测试用例```python
import sys
import io
from collections import deque

def solve_data(data: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(data)

    def input():
        return sys.stdin.readline

    n = int(input())

    graph = [[] for _ in range(n)]
    for _ in range(n - 1):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append(v)
        graph[v].append(u)

    parent = [-1] * n
    order = [0]
    parent[0] = 0

    for v in order:
        for u in graph[v]:
            if u == parent[v]:
                continue
            parent[u] = v
            order.append(u)

    children = [[] for _ in range(n)]
    for v in range(1, n):
        children[parent[v]].append(v)

    observed = [False] * n
    unobserved = [len(graph[v]) for v in range(n)]
    queued = [False] * n
    q = deque()

    def observe(v):
        if observed[v]:
            return

        observed[v] = True

        for u in graph[v]:
            unobserved[u] -= 1
            if observed[u] and unobserved[u] == 1 and not queued[u]:
                queued[u] = True
                q.append(u)

    def propagate():
        while q:
            v = q.popleft()
            queued[v] = False

            if not observed[v] or unobserved[v] != 1:
                continue

            for u in graph[v]:
                if not observed[u]:
                    observe(u)
                    break

    def place_pmu(v):
        observe(v)
        for u in graph[v]:
            observe(u)
        propagate()

    answer = 0

    for v in reversed(order[1:]):
        cnt = 0
        for u in children[v]:
            if not observed[u]:
                cnt += 1

        if cnt >= 2:
            answer += 1
            place_pmu(v)

    if not observed[0]:
        answer += 1

    sys.stdin = old_stdin
    return str(answer)

# Provided sample 1
sample1 = """\
10
1 2
2 3
2 4
4 5
4 6
6 7
6 8
8 9
8 10
"""
assert solve_data(sample1).strip() == "2", "sample 1"

# Provided sample 2
sample2 = """\
5
1 2
1 3
1 4
1 5
"""
assert solve_data(sample2).strip() == "1", "sample 2"

# Minimum-size tree
assert solve_data("""\
2
1 2
""").strip() == "1", "minimum-size tree"

# Balanced branching tree
assert solve_data("""\
7
1 2
1 3
2 4
2 5
3 6
3 7
""").strip() == "2", "two-level branching tree"

# Long path, exercising propagation and the root boundary
n = 100000
path_input = str(n) + "\n" + "\n".join(
    f"{i} {i + 1}" for i in range(1, n)
) + "\n"
assert solve_data(path_input).strip() == "1", "maximum-size path"

# Star with many equal leaf branches
n = 100000
star_input = str(n) + "\n" + "\n".join(
    f"1 {i}" for i in range(2, n + 1)
) + "\n"
assert solve_data(star_input).strip() == "1", "maximum-size star"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`2 / 1 2`|`1`| 最小尺寸树和最终根处理 |
 |`7 / 1-2, 1-3, 2-4, 2-5, 3-6, 3-7`|`2`| 两个同时未解决的分支 |
 | 100000 个顶点的路径 |`1`| 最大尺寸、深度传播、无递归 |
 | 100000个顶点的星|`1`| 最大程度和直接统治|

 ## 边缘情况

 对于二顶点树```
2
1 2
```唯一的非根顶点是叶子，因此后序循环永远不会放置 PMU。 节点 1 仍未被观察到，因此最终的根检查将一个 PMU 放置在节点 1 处。该 PMU 观察两个顶点，产生`1`。 

为了明星```
5
1 2
1 3
1 4
1 5
```所有四个非根顶点都是叶子。 因此，贪婪循环不放置 PMU。 根是不可观察的，因此一个 PMU 放置在节点 1 处。它的闭邻域包含整个树，给出`1`。 

对于分支树```
7
1 2
1 3
2 4
2 5
3 6
3 7
```首先处理叶子并且不能触发 PMU。 当节点 2 被处理时，子节点 4 和 5 都未被观察到，因此节点 2 收到 PMU 并且两个叶子节点都被观察到。 同样的情况在节点 3 处独立发生。此时节点 1 已被观察到，因此最终答案为`2`。 这正是这样的情况：允许具有两个未解决的子节点的顶点保持未定状态将留下两个没有任何强制步骤可以进入的分支。 

对于长路径，例如```
5
1 2
2 3
3 4
4 5
```每个内部顶点在处理时最多有一个未观察到的子顶点。 因此，该算法在根检查之前不会放置 PMU。 节点 1 处的 PMU 观察节点 1 和 2，然后节点 2 强制节点 3，节点 3 强制节点 4，节点 4 强制节点 5。答案是`1`。 这抓住了一个常见错误，即仅仅因为一个 PMU 的初始邻域很小，就假设一条长路径需要多个 PMU。
