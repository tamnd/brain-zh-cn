---
title: "CF 103E - 购买套装"
description: "我们得到了几组整数，每组都有一个相关的成本。 我们可以选择这些集合的任何集合，包括空集合。 令所选集合的数量为 $k$，并让所有所选集合的并集包含 $u$ 个不同的整数。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "flows", "graph-matchings"]
categories: ["algorithms"]
codeforces_contest: 103
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 80 (Div. 1 Only)"
rating: 2900
weight: 103
solve_time_s: 190
verified: false
draft: false
---

[CF 103E - 购买套装](https://codeforces.com/problemset/problem/103/E)

 **评分：** 2900
 **标签：** 流、图匹配
 **求解时间：** 3m 10s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了几组整数，每组都有一个相关的成本。 我们可以选择这些集合的任何集合，包括空集合。 令所选集合的数量为$k$，并让所有选定集合的并集包含$u$不同的整数。 

目标是在满足以下条件的情况下最小化总成本$u = k$。 

该声明的不寻常部分是关于集合族的保证。 对于每个集合$k$集合，它们的并集总是至少包含$k$不同的数字。 这正是霍尔的条件。 这意味着每个选定的集合都可以从该集合内部分配一个不同的代表元素。 

输入大小足够小以允许三次图算法，但对于子集枚举来说太大。 自从$n \le 300$, 蛮力压倒一切$2^n$收藏是无望的。 甚至$2^{40}$已经太大了，这里我们可能有$2^{300}$子集。 

成本可能是负的，这改变了优化的性质。 像“获取所有负集”这样天真的贪婪策略可能会失败，因为添加一组可能会迫使联合大小增长，从而打破平等条件。 

一个微妙的边缘情况是空集合。 如果所有成本均为正，则不购买任何内容都是有效的，因为所选集合的数量和联合大小都为零。 

例如：```
2
1 1
1 2
5 7
```正确答案是：```
0
```坚持选择至少一组的粗心解决方案会错误地输出`5`。 

当多个集合严重重叠时，会出现另一个棘手的情况。```
3
2 1 2
2 1 2
1 2
-5 -4 100
```正确答案是：```
-9
```前两组都可以被选择，因为并集的大小为 2 并且有 2 个被选择的组。 不应添加第三组，因为这样我们将有 3 组，但仍然只有 2 个不同的数字。 

一个常见的错误是认为条件意味着所选集合必须是成对不相交的。 那是错误的。 该条件仅限制联合体的总大小。 

另一个危险的情况是平等已经自动成立。```
2
1 1
1 2
-3 -4
```正确答案是：```
-7
```每组贡献不同的数字，因此两者都采用是最佳选择。 

了解平等何时发生是解决问题的关键。 

## 方法

 蛮力方法很简单。 枚举集合的每个子集，计算并集的大小，并保持子集之间的最小总成本，其中：$$|\text{chosen sets}| = |\text{union}|$$声明中的条件保证：$$|\text{union}| \ge |\text{chosen sets}|$$对于每个子集。 所以可行子集正是那些满足等式的子集。 

这种强力方法是正确的，因为它显式检查每个可能的集合。 问题在于复杂性。 有$2^n$子集，以及$n$可以是300。甚至存储所有子集也是不可能的。 

重要的观察来自霍尔定理。 

该声明保证说每个集合的集合至少具有与集合一样多的不同元素。 霍尔定理告诉我们，每个集合都承认所选集合和不同元素之间的完美匹配。 

现在考虑等式何时成立：$$|\text{union}| = |\text{chosen sets}|$$假设我们查看所选集合和其中出现的元素之间的二分图。 Hall 保证匹配覆盖所有选定的集合。 由于并集包含与集合完全相同的元素，因此匹配实际上必须使用并集中的每个元素。 

这意味着每个选定的元素都只匹配一次。 

这立即意味着所选子图形成了一个平衡的组件结构。 在拟阵语言中，可行集合正是横向拟阵的紧集。 

然后，优化可以转化为最小权重闭合问题，从而简化为最小割计算。 

关键的结构事实是：

 当且仅当集合的子集是从匹配中的交替路径导出的有向依赖图中的强连接组件的并集时，它才满足相等性。 

我们首先构建一个从集合到不同元素的完美匹配。 然后我们定向边缘：

 从一个集合到其中所有不匹配的元素。 

从匹配的元素返回到其匹配的集合。 

这将创建一个有向图。 紧子集与可达性下封闭的顶点子集完全对应。 

寻找最小成本闭子集是最小割的经典归约。 

蛮力之所以有效，是因为条件仅取决于子集和并集，但会失败，因为子集的数量呈指数级增长。 霍尔结构允许我们将可行子集重新解释为有向图中的闭集，将指数搜索转变为多项式时间流计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(2^n \cdot n^2)$|$O(n^2)$| 太慢了 |
 | 最佳|$O(n^3)$|$O(n^2)$| 已接受 |

 ## 算法演练

 1. 在集合和数字之间构建二分图。 

左侧包含$n$套。 右侧包含数字$1 \ldots n$。 集合中有一条边$i$编号$x$如果$x$属于集合。 
2. 计算覆盖所有集合的完美匹配。 

霍尔的条件保证了这种匹配的存在。 我们可以使用库恩算法，因为$n \le 300$。 
3. 构建有向图。 

对于每组$i$：

如果$i$包含数字$x$和$x$不匹配到$i$，添加有向边：$$i \to \text{owner}(x)$$在哪里`owner(x)`是匹配到的集合$x$。 

该边代表交替路径依赖性。 如果我们包括集合$i$，我们被迫包括所有者$x$以保持密封性。 
4. 计算强连通分量。 

在一个 SCC 内，每个顶点都依赖于其他每个顶点。 我们要么采用整个 SCC，要么不采用。 
5. 将SCC图压缩为DAG。 

每个 SCC 成为一个节点，其权重等于其集合成本之和。 
6. 找到最小权重闭子集。 

闭子集意味着：

 如果选择了一个节点，则还必须选择所有传出邻居。 

这是使用最小割来解决的。 
7.构建流量网络。 

对于每个总重量为负的 SCC，连接：$$S \to \text{SCC}$$容量等于$-w$。 

对于每个总重量为正的 SCC，连接：$$\text{SCC} \to T$$容量等于$w$。 

对于每个 DAG 边：$$u \to v$$添加无限容量。 
8. 运行最大流量/最小切割。 

最小闭子集权重等于：$$\text{maxflow} - \sum_{\text{negative } w} |w|$$9. 与零比较。 

空集合始终有效，因此答案不能超过零。 

### 为什么它有效

 匹配将霍尔条件转换为结构依赖图。 紧子集正是那些还包含每个可达依赖项的子集。 这正是有向图中闭集的定义。 

强连接组件代表不可分割的组，因为 SCC 内的每个顶点都会强制其他每个顶点。 

减少最小重量闭合的最小切割是标准的。 无限容量边禁止违反封闭约束。 削减选择哪些 SCC 仍然可以从源到达，并且容量恰好等于排除负 SCC 或包含正 SCC 的惩罚。 

因为每个可行集合都对应一个封闭子集，反之亦然，因此最小化封闭权重会给出最佳答案。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

INF = 10**18

class Dinic:
    def __init__(self, n):
        self.n = n
        self.g = [[] for _ in range(n)]

    def add_edge(self, u, v, c):
        self.g[u].append([v, c, len(self.g[v])])
        self.g[v].append([u, 0, len(self.g[u]) - 1])

    def bfs(self, s, t):
        self.level = [-1] * self.n
        q = deque([s])
        self.level[s] = 0

        while q:
            u = q.popleft()
            for v, c, rev in self.g[u]:
                if c > 0 and self.level[v] == -1:
                    self.level[v] = self.level[u] + 1
                    q.append(v)

        return self.level[t] != -1

    def dfs(self, u, t, f):
        if u == t:
            return f

        for i in range(self.ptr[u], len(self.g[u])):
            self.ptr[u] = i

            v, c, rev = self.g[u][i]

            if c > 0 and self.level[v] == self.level[u] + 1:
                pushed = self.dfs(v, t, min(f, c))

                if pushed:
                    self.g[u][i][1] -= pushed
                    self.g[v][rev][1] += pushed
                    return pushed

        return 0

    def maxflow(self, s, t):
        flow = 0

        while self.bfs(s, t):
            self.ptr = [0] * self.n

            while True:
                pushed = self.dfs(s, t, INF)
                if not pushed:
                    break
                flow += pushed

        return flow

def solve():
    n = int(input())

    sets = []
    for _ in range(n):
        arr = list(map(int, input().split()))
        sets.append(arr[1:])

    cost = list(map(int, input().split()))

    match_num = [-1] * (n + 1)

    def kuhn(u, vis):
        if vis[u]:
            return False

        vis[u] = True

        for x in sets[u]:
            if match_num[x] == -1 or kuhn(match_num[x], vis):
                match_num[x] = u
                return True

        return False

    for i in range(n):
        vis = [False] * n
        kuhn(i, vis)

    owner = [-1] * (n + 1)

    for x in range(1, n + 1):
        if match_num[x] != -1:
            owner[x] = match_num[x]

    g = [[] for _ in range(n)]

    for i in range(n):
        matched_x = -1

        for x in sets[i]:
            if owner[x] == i:
                matched_x = x

        for x in sets[i]:
            if x != matched_x:
                g[i].append(owner[x])

    # Tarjan SCC
    sys.setrecursionlimit(10**6)

    tin = [-1] * n
    low = [0] * n
    stack = []
    in_stack = [False] * n

    comp = [-1] * n
    timer = 0
    comp_cnt = 0

    def dfs(u):
        nonlocal timer, comp_cnt

        tin[u] = low[u] = timer
        timer += 1

        stack.append(u)
        in_stack[u] = True

        for v in g[u]:
            if tin[v] == -1:
                dfs(v)
                low[u] = min(low[u], low[v])
            elif in_stack[v]:
                low[u] = min(low[u], tin[v])

        if low[u] == tin[u]:
            while True:
                x = stack.pop()
                in_stack[x] = False
                comp[x] = comp_cnt

                if x == u:
                    break

            comp_cnt += 1

    for i in range(n):
        if tin[i] == -1:
            dfs(i)

    comp_weight = [0] * comp_cnt

    for i in range(n):
        comp_weight[comp[i]] += cost[i]

    dag = set()

    for u in range(n):
        for v in g[u]:
            cu = comp[u]
            cv = comp[v]

            if cu != cv:
                dag.add((cu, cv))

    S = comp_cnt
    T = comp_cnt + 1

    dinic = Dinic(comp_cnt + 2)

    neg_sum = 0

    for i in range(comp_cnt):
        w = comp_weight[i]

        if w < 0:
            dinic.add_edge(S, i, -w)
            neg_sum += -w
        else:
            dinic.add_edge(i, T, w)

    for u, v in dag:
        dinic.add_edge(u, v, INF)

    flow = dinic.maxflow(S, T)

    ans = flow - neg_sum
    ans = min(ans, 0)

    print(ans)

solve()
```第一部分计算从数字到集合的匹配。 霍尔条件保证每个集合都能获得不同的代表，因此库恩算法总是成功的。 

有向图的构造是最微妙的部分。 每个不匹配的边都会创建一条依赖边。 如果设置`i`也可以使用另一组拥有的号码，然后包括`i`如果没有那个所有者就会违反严格性。 

SCC 压缩是必要的，因为依赖关系可能形成循环。 在一个循环中，每个集合都会强制其他集合，因此必须一起选择它们。 

最小割结构编码了闭合规则。 无限边可防止违反依赖性的剪切。 负的SCC权重是有利可图的，并且从源头上有联系。 正 SCC 权重是惩罚项并连接到接收器。 

最终公式：```
flow - neg_sum
```是从最小切割值返回到最小闭合重量的标准转换。 

一个微妙的实现细节是使用足够大的`INF`。 它只需要超过任何可能的绝对答案。 由于成本受限于$10^6$并且最多有300套，$10^{18}$是完全安全的。 

## 工作示例

 ### 示例 1

 输入：```
3
1 1
2 2 3
1 3
10 20 -3
```一种可能的匹配是：

 | 设置| 匹配号码 |
 | ---| ---|
 | 0 | 1 |
 | 1 | 2 |
 | 2 | 3 |

 依赖关系图：

 | 设置| 额外号码 | 边缘 |
 | ---| ---| ---|
 | 0 | 无 | 无 |
 | 1 | 3 | 1 → 2 |
 | 2 | 无 | 无 |

 SCC：

 | 南昌中心 | 套装| 重量 |
 | ---| ---| ---|
 | 一个 | {0} | 10 | 10
 | 乙| {1} | 20 |
 | C | {2} | -3 |

 唯一的负 SCC 是`{2}`并且它没有传出依赖项，因此我们单独选择它。 

结果：```
-3
```这个例子表明单个集合已经可以满足相等条件。 放`{3}`有一个元素并贡献一组。 

### 自定义示例

 输入：```
3
2 1 2
2 1 2
1 2
-5 -4 100
```假设匹配是：

 | 设置| 匹配号码 |
 | ---| ---|
 | 0 | 1 |
 | 1 | 2 |

 依赖项：

 | 设置| 额外号码 | 边缘 |
 | ---| ---| ---|
 | 0 | 2 | 0 → 1 |
 | 1 | 1 | 1 → 0 |
 | 2 | 2 | 2 → 1 |

 SCC：

 | 南昌中心 | 套装| 重量 |
 | ---| ---| ---|
 | 一个 | {0,1} | -9 |
 | 乙| {2} | 100 | 100

 由于集合 0 和 1 形成一个循环，因此它们必须放在一起。 

最佳答案：```
-9
```这说明了为什么 SCC 压缩是必要的。 只取前两组中的一组将违反封闭性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n^3)$| 匹配、SCC 计算和最大流都适合立方复杂度 |
 | 空间|$O(n^2)$| 图和流网络最多存储二次边 |

 和$n \le 300$，三次算法完全实用。 即使是密集的图表也能轻松地在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    from collections import deque

    input = sys.stdin.readline
    INF = 10**18

    class Dinic:
        def __init__(self, n):
            self.n = n
            self.g = [[] for _ in range(n)]

        def add_edge(self, u, v, c):
            self.g[u].append([v, c, len(self.g[v])])
            self.g[v].append([u, 0, len(self.g[u]) - 1])

        def bfs(self, s, t):
            self.level = [-1] * self.n
            q = deque([s])
            self.level[s] = 0

            while q:
                u = q.popleft()

                for v, c, rev in self.g[u]:
                    if c > 0 and self.level[v] == -1:
                        self.level[v] = self.level[u] + 1
                        q.append(v)

            return self.level[t] != -1

        def dfs(self, u, t, f):
            if u == t:
                return f

            for i in range(self.ptr[u], len(self.g[u])):
                self.ptr[u] = i

                v, c, rev = self.g[u][i]

                if c > 0 and self.level[v] == self.level[u] + 1:
                    pushed = self.dfs(v, t, min(f, c))

                    if pushed:
                        self.g[u][i][1] -= pushed
                        self.g[v][rev][1] += pushed
                        return pushed

            return 0

        def maxflow(self, s, t):
            flow = 0

            while self.bfs(s, t):
                self.ptr = [0] * self.n

                while True:
                    pushed = self.dfs(s, t, INF)

                    if not pushed:
                        break

                    flow += pushed

            return flow

    n = int(input())

    sets = []

    for _ in range(n):
        arr = list(map(int, input().split()))
        sets.append(arr[1:])

    cost = list(map(int, input().split()))

    match_num = [-1] * (n + 1)

    def kuhn(u, vis):
        if vis[u]:
            return False

        vis[u] = True

        for x in sets[u]:
            if match_num[x] == -1 or kuhn(match_num[x], vis):
                match_num[x] = u
                return True

        return False

    for i in range(n):
        vis = [False] * n
        kuhn(i, vis)

    owner = [-1] * (n + 1)

    for x in range(1, n + 1):
        if match_num[x] != -1:
            owner[x] = match_num[x]

    g = [[] for _ in range(n)]

    for i in range(n):
        matched_x = -1

        for x in sets[i]:
            if owner[x] == i:
                matched_x = x

        for x in sets[i]:
            if x != matched_x:
                g[i].append(owner[x])

    sys.setrecursionlimit(10**6)

    tin = [-1] * n
    low = [0] * n
    stack = []
    in_stack = [False] * n

    comp = [-1] * n
    timer = 0
    comp_cnt = 0

    def dfs(u):
        nonlocal timer, comp_cnt

        tin[u] = low[u] = timer
        timer += 1

        stack.append(u)
        in_stack[u] = True

        for v in g[u]:
            if tin[v] == -1:
                dfs(v)
                low[u] = min(low[u], low[v])
            elif in_stack[v]:
                low[u] = min(low[u], tin[v])

        if low[u] == tin[u]:
            while True:
                x = stack.pop()
                in_stack[x] = False
                comp[x] = comp_cnt

                if x == u:
                    break

            comp_cnt += 1

    for i in range(n):
        if tin[i] == -1:
            dfs(i)

    comp_weight = [0] * comp_cnt

    for i in range(n):
        comp_weight[comp[i]] += cost[i]

    dag = set()

    for u in range(n):
        for v in g[u]:
            cu = comp[u]
            cv = comp[v]

            if cu != cv:
                dag.add((cu, cv))

    S = comp_cnt
    T = comp_cnt + 1

    dinic = Dinic(comp_cnt + 2)

    neg_sum = 0

    for i in range(comp_cnt):
        w = comp_weight[i]

        if w < 0:
            dinic.add_edge(S, i, -w)
            neg_sum += -w
        else:
            dinic.add_edge(i, T, w)

    for u, v in dag:
        dinic.add_edge(u, v, INF)

    ans = dinic.maxflow(S, T) - neg_sum
    ans = min(ans, 0)

    return str(ans) + "\n"

# provided sample
assert run(
"""3
1 1
2 2 3
1 3
10 20 -3
"""
) == "-3\n"

# empty collection optimal
assert run(
"""2
1 1
1 2
5 7
"""
) == "0\n"

# SCC cycle
assert run(
"""3
2 1 2
2 1 2
1 2
-5 -4 100
"""
) == "-9\n"

# all negative independent sets
assert run(
"""3
1 1
1 2
1 3
-1 -2 -3
"""
) == "-6\n"

# minimum size
assert run(
"""1
1 1
5
"""
) == "0\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单正集| 0 | 空集合处理 |
 | 两个重叠的负集 | -9 | SCC 压缩正确性 |
 | 独立负单例集| -6 | 多个不相交的可行组件 |
 | 最小尺寸输入| 0 | 边界条件为$n=1$|

 ## 边缘情况

 考虑每个可用集都有正成本的情况。```
2
1 1
1 2
5 7
```该算法构建两个具有正权重的独立 SCC。 在流网络中，两者仅连接到接收器。 最小切割排除了两个 SCC，产生总成本 0。这正确地对应于选择空集合。 

现在考虑循环依赖。```
2
2 1 2
2 1 2
-3 -4
```假设集合 0 拥有数字 1，集合 1 拥有数字 2。那么每个集合都有一条与其他所有者的数字不匹配的边，从而创建边：```
0 → 1
1 → 0
```两套折叠成一个 SCC，总重量`-7`。 最小切割要么选择两者，要么都不选择。 由于 SCC 权重为负，算法会同时选择两者，从而产生正确的答案`-7`。 

最后，考虑一下误导性的重叠。```
3
2 1 2
1 1
1 2
-100 1 1
```仅选择第一组是有效的，因为一组和两个数字不满足相等性。 依赖图捕获了这一点。 大的负集取决于两个单例所有者，因此闭包强制包含所有三个集。 他们的总成本是`-98`，并且并集大小变为2，而集合数变为3，这是不可能的。 闭包约束会自动防止这种无效选择。
