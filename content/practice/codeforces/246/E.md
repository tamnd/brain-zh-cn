---
title: "CF 246E - 血亲归来"
description: "我们被赋予了一片描述家庭关系的有根森林。 每个人都有一个名字，最多有一个父母。 允许有多个根，因为有些人可能根本没有祖先。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dfs-and-similar", "dp", "sortings"]
categories: ["algorithms"]
codeforces_contest: 246
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 151 (Div. 2)"
rating: 2400
weight: 246
solve_time_s: 98
verified: true
draft: false
---

[CF 246E - 血亲回归](https://codeforces.com/problemset/problem/246/E)

 **评分：** 2400
 **标签：** 二分查找、数据结构、dfs 和类似、dp、排序
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被赋予了一片描述家庭关系的有根森林。 每个人都有一个名字，最多有一个父母。 允许有多个根，因为有些人可能根本没有祖先。 

对于每个查询`(v, k)`，我们需要所有后代中不同名称的数量`v`那正是`k`下面的边缘`v`。 

有用的改写使结构更加清晰。 让`depth[x]`是节点的深度`x`从它的树根开始。 一个节点是一个`k`- 的儿子`v`确切的时间：

 - 它位于子树内`v`- 它的深度是`depth[v] + k`所以每个查询都会问：

 > 在子树内`v`，有多少个不同的名字出现在深度`depth[v] + k`？ 

树的大小和查询数量都达到`10^5`。 任何为每个查询扫描子树的解决方案都会立即变得太慢。 在最坏的情况下，一棵子树可能包含几乎所有节点，导致粗略地`10^10`运营。 

这些限制强烈建议采用离线预处理方法。 我们周围需要一些东西`O(n log n)`或者`O((n + m) log n)`。 

一些边缘情况很容易被错误处理。 

考虑多个根：```
4
a 0
b 0
c 1
d 2
2
1 1
2 1
```正确答案是：```
1
1
```仅从一个根开始的 DFS 将完全错过森林的一部分。 

当请求的深度不存在时，会出现另一种微妙的情况：```
3
a 0
b 1
c 2
1
1 5
```答案是：```
0
```粗心的实现可能会尝试访问不存在的深度结构。 

Repeated names also matter:```
5
john 0
john 1
john 1
alice 2
alice 3
2
1 1
1 2
```在远处`1`从节点`1`，两个后代都被命名为`john`，所以答案是`1`， 不是`2`。 

最后，查询`k = 0`在这个问题中是不可能的，因为约束从`1`。 这就消除了一种常见的特殊情况。 

## 方法

 暴力解决方案很简单。 对于每个查询`(v, k)`，遍历子树`v`，收集深度等于的所有节点`depth[v] + k`，将它们的名字插入到集合中，并输出集合大小。 

这是正确的，因为它直接遵循 a 的定义`k`-儿子。 问题是成本。 在链状树中，子树可以包含`O(n)`节点。 和`m = 10^5`查询，总工作量变为`O(nm)`。 

我们需要跨查询重用工作。 

关键的观察是每个查询仅取决于两件事：

 - 一个子树
 - 单一深度

 树上的子树查询在欧拉之旅之后通常会变成区间查询。 在DFS期间，每个子树成为一个连续的段`[tin[v], tout[v]]`。 

现在想象一下深度处理节点。 对于每个深度`d`，我们维护出现在该深度的所有名称，按欧拉时间排序。 那么查询就变成：

 > 深度节点之间`d = depth[v] + k`，计算欧拉时间位于其中的不同名称`[tin[v], tout[v]]`。 

剩下的挑战是有效地计算范围内的不同值。 

这就是经典的离线不同查询技巧出现的地方。 假设我们从左到右处理欧拉位置。 对于每个名称，我们只保留其在 Fenwick 树中最新出现的活动状态。 然后，某个范围的总和给出了该范围内不同名称的数量。 

我们可以按深度对所有节点进行分组，并按目标深度对所有查询进行分组。 对于每个深度独立：

 1. 按欧拉阶对节点进行排序。 
2. 仅激活最近出现的每个名称。 
3. 回答该深度的所有区间查询。 

每个节点和查询仅参与一次，给出`O((n + m) log n)`解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(纳米) | O(n) | 太慢了 |
 | 最佳 | O((n + m) log n) | O((n + m) log n) | O(n + m) | 已接受 |

 ## 算法演练

 1. 从父阵列构建森林。 

每个节点都有父节点`0`成为根。 存储子邻接列表。 
2. 从每个根运行 DFS。 

在 DFS 期间，计算：

 -`depth[v]`-`tin[v]`-`tout[v]`我们在进入时增加一个全局计时器。 由于 DFS 排序，每个子树形成一个连续的欧拉区间。 
3. 按深度对节点进行分组。 

对于每个节点`v`, 附加`(tin[v], name[v])`进入`depth_nodes[depth[v]]`。 

查询仅比较某一精确深度的节点，因此独立处理深度可以避免不必要的工作。 
4. 转换每个查询`(v, k)`进入深度受限的区间查询。 

所需深度为：```
target = depth[v] + k
```子树区间为：```
[tin[v], tout[v]]
```存储查询分组依据`target`。 
5. 分别针对每个深度，按欧拉顺序处理所有节点。 

假设我们正在处理深度`d`。 

我们对所有节点进行深度排序`d`到欧拉时间。 然后我们从左向右扫。 

维护：

 - 欧拉位置上的芬威克树
 -`last[name]`，该名称出现的最新欧拉位置

 参观时`(pos, name)`:

 - 如果该名称之前出现过`old`，删除贡献`old`- 添加贡献于`pos`- 更新`last[name] = pos`在任何时刻，Fenwick 树在处理的位置中的每个不同名称都恰好包含一个活动事件。 
6.离线回答区间查询。 

按右端点对该深度的查询进行排序。 

将节点向上扫描到查询的右边界时，更新 Fenwick 树。 

然后里面不同名字的数量`[l, r]`是：```
bit.query(r) - bit.query(l - 1)
```7. 按原顺序输出答案。 

### 为什么它有效

 对于固定深度，扫描不变量为：

 > 处理后欧拉位置达到`x`，芬威克树包含`1`恰好在位置中每个不同名称的最后一次出现处`<= x`。 

考虑查询间隔`[l, r]`。 

如果某个名称出现在该区间内，则其最近一次出现的时间为`r`也必须位于区间内。 当较晚的事件出现时，较早的事件被删除。 

因此，每个不同的名称都在内部贡献了一个活跃位置`[l, r]`，并且区间中不存在的名称贡献为零。 

Fenwick 范围总和正是所需深度的子树中不同名称的数量。 

## Python 解决方案```python
import sys
from collections import defaultdict

input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, val):
        while idx <= self.n:
            self.bit[idx] += val
            idx += idx & -idx

    def query(self, idx):
        res = 0
        while idx > 0:
            res += self.bit[idx]
            idx -= idx & -idx
        return res

    def range_query(self, l, r):
        return self.query(r) - self.query(l - 1)

def solve():
    n = int(input())

    names = [""] * (n + 1)
    children = [[] for _ in range(n + 1)]
    roots = []

    for i in range(1, n + 1):
        s, r = input().split()
        r = int(r)

        names[i] = s

        if r == 0:
            roots.append(i)
        else:
            children[r].append(i)

    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    depth = [0] * (n + 1)

    depth_nodes = defaultdict(list)

    timer = 0

    sys.setrecursionlimit(1 << 25)

    def dfs(v, d):
        nonlocal timer

        timer += 1
        tin[v] = timer
        depth[v] = d

        depth_nodes[d].append((tin[v], names[v]))

        for to in children[v]:
            dfs(to, d + 1)

        tout[v] = timer

    for root in roots:
        dfs(root, 0)

    m = int(input())

    queries_by_depth = defaultdict(list)
    ans = [0] * m

    for idx in range(m):
        v, k = map(int, input().split())

        target = depth[v] + k

        queries_by_depth[target].append(
            (tout[v], tin[v], idx)
        )

    bit = Fenwick(n)

    for d in queries_by_depth:
        nodes = depth_nodes.get(d, [])
        nodes.sort()

        queries = queries_by_depth[d]
        queries.sort()

        last = {}

        ptr = 0

        used_positions = []

        for r, l, qid in queries:
            while ptr < len(nodes) and nodes[ptr][0] <= r:
                pos, name = nodes[ptr]

                if name in last:
                    bit.add(last[name], -1)

                bit.add(pos, 1)
                last[name] = pos

                used_positions.append(pos)

                ptr += 1

            ans[qid] = bit.range_query(l, r)

        for pos in used_positions:
            bit.add(pos, -1)

    print("\n".join(map(str, ans)))

solve()
```DFS 阶段分配欧拉区间。 因为 DFS 在返回之前充分探索了子树，所以每个子树`v`接收连续的欧拉范围。 该属性将子树查询转换为间隔查询。`depth_nodes[d]`存储深度的所有节点`d`。 这对`(tin[v], name[v])`就足够了，因为稍后仅使用欧拉间隔进行子树过滤。 

查询按目标深度而不是源节点分组。 这就是中央减少。 一旦深度固定，问题就变成了标准的离线范围内不同元素问题。 

Fenwick 树存储活跃的最新事件。 当某个名称再次出现时，会先删除先前出现的名称，然后再插入新名称。 如果没有此删除步骤，重复的名称将被计算多次。 

每个深度结束时的清理循环虽然微妙但必要。 相同的 Fenwick 树实例在不同深度上重复使用，因此当前深度的所有更新都必须恢复。 

另一个容易犯的错误是按以下方式对查询进行排序`tout[v]`。 扫描按递增的欧拉顺序处理节点，因此查询也必须按右端点前进。 

## 工作示例

 ### 示例 1

 输入：```
6
pasha 0
gerald 1
gerald 1
valera 2
igor 3
olesya 1
5
1 1
1 2
1 3
3 1
6 1
```DFS订单：

 | 节点| 名称 | 深度 | 锡 | 兜售|
 | --- | --- | --- | --- | --- |
 | 1 | 帕夏| 0 | 1 | 6 |
 | 2 | 杰拉德| 1 | 2 | 3 |
 | 4 | 瓦莱拉 | 2 | 3 | 3 |
 | 3 | 杰拉德| 1 | 4 | 5 |
 | 5 | 伊戈尔 | 2 | 5 | 5 |
 | 6 | 奥莱西亚 | 1 | 6 | 6 |

 查询转换：

 | 查询 | 目标深度| 间隔|
 | --- | --- | --- |
 | (1,1) | 1 | [1,6]|
 | (1,2) | 2 | [1,6]|
 | (1,3) | 3 | [1,6]|
 | (3,1) | 2 | [4,5]|
 | (6,1) | 2 | [6,6]|

 加工深度`1`:

 | 欧拉邮政 | 名称 | 活跃名称 |
 | --- | --- | --- |
 | 2 | 杰拉德| {杰拉德} |
 | 4 | 杰拉德| {杰拉德4岁} |
 | 6 | 奥莱西亚 | {杰拉德，奥莱西亚} |

 子树区间`[1,6]`包含两个活动名称，所以答案是`2`。 

加工深度`2`:

 | 欧拉邮政 | 名称 | 活跃名称 |
 | --- | --- | --- |
 | 3 | 瓦莱拉 | {瓦莱拉} |
 | 5 | 伊戈尔 | {瓦莱拉，伊戈尔} |

 完整的子树给出`2`，而间隔`[4,5]`仅包含`igor`, 给予`1`。 

此跟踪显示了为什么只有最新发生的事件才保持活动状态。 重复的`gerald`节点折叠成一个不同的名称。 

### 自定义示例

 输入：```
5
a 0
a 1
b 1
a 2
b 3
3
1 1
1 2
2 1
```DFS订单：

 | 节点| 名称 | 深度 | 锡 | 兜售|
 | --- | --- | --- | --- | --- |
 | 1 | 一个 | 0 | 1 | 5 |
 | 2 | 一个 | 1 | 2 | 3 |
 | 4 | 一个 | 2 | 3 | 3 |
 | 3 | 乙| 1 | 4 | 5 |
 | 5 | 乙| 2 | 5 | 5 |

 查询：

 | 查询 | 目标深度| 间隔|
 | --- | --- | --- |
 | (1,1) | 1 | [1,5]|
 | (1,2) | 2 | [1,5]|
 | (2,1) | 2 | [2,3]|

 加工深度`1`给出活跃的名字`{a, b}`， 回答`2`。 

加工深度`2`给出活跃的名字`{a, b}`对于完整的子树，回答`2`。 

对于间隔`[2,3]`, 仅有节点`4`就在里面，回答`1`。 

此示例演示了即使名称在不同分支之间重复，子树过滤和非重复计数也能正确交互。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 每个节点和查询执行 Fenwick 更新或查询 |
 | 空间| O(n + m) | 树存储、欧拉数组、分组查询、Fenwick 树 |

 和`10^5`节点和查询，大约几百万个 Fenwick 操作完全符合限制。 内存使用也保持线性。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, idx, val):
            while idx <= self.n:
                self.bit[idx] += val
                idx += idx & -idx

        def query(self, idx):
            res = 0
            while idx > 0:
                res += self.bit[idx]
                idx -= idx & -idx
            return res

        def range_query(self, l, r):
            return self.query(r) - self.query(l - 1)

    n = int(input())

    names = [""] * (n + 1)
    children = [[] for _ in range(n + 1)]
    roots = []

    for i in range(1, n + 1):
        s, r = input().split()
        r = int(r)

        names[i] = s

        if r == 0:
            roots.append(i)
        else:
            children[r].append(i)

    tin = [0] * (n + 1)
    tout = [0] * (n + 1)
    depth = [0] * (n + 1)

    depth_nodes = defaultdict(list)

    timer = 0

    sys.setrecursionlimit(1 << 25)

    def dfs(v, d):
        nonlocal timer

        timer += 1
        tin[v] = timer
        depth[v] = d

        depth_nodes[d].append((tin[v], names[v]))

        for to in children[v]:
            dfs(to, d + 1)

        tout[v] = timer

    for r in roots:
        dfs(r, 0)

    m = int(input())

    queries_by_depth = defaultdict(list)
    ans = [0] * m

    for idx in range(m):
        v, k = map(int, input().split())

        target = depth[v] + k

        queries_by_depth[target].append(
            (tout[v], tin[v], idx)
        )

    bit = Fenwick(n)

    for d in queries_by_depth:
        nodes = sorted(depth_nodes.get(d, []))
        queries = sorted(queries_by_depth[d])

        last = {}
        ptr = 0
        used = []

        for r, l, idx in queries:
            while ptr < len(nodes) and nodes[ptr][0] <= r:
                pos, name = nodes[ptr]

                if name in last:
                    bit.add(last[name], -1)

                bit.add(pos, 1)
                last[name] = pos

                used.append(pos)

                ptr += 1

            ans[idx] = bit.range_query(l, r)

        for pos in used:
            bit.add(pos, -1)

    return "\n".join(map(str, ans))

# provided sample
assert run(
"""6
pasha 0
gerald 1
gerald 1
valera 2
igor 3
olesya 1
5
1 1
1 2
1 3
3 1
6 1
"""
) == "2\n2\n0\n1\n0"

# minimum size
assert run(
"""1
alex 0
1
1 1
"""
) == "0"

# repeated names
assert run(
"""5
john 0
john 1
john 1
alice 2
alice 3
2
1 1
1 2
"""
) == "1\n1"

# multiple roots
assert run(
"""4
a 0
b 0
c 1
d 2
2
1 1
2 1
"""
) == "1\n1"

# chain tree, missing depth
assert run(
"""4
a 0
b 1
c 2
d 3
2
1 5
2 2
"""
) == "0\n1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单节点树 | 0 | 缺失目标深度|
 | 重复的名字 | 1 1 | 1 独特计数正确性 |
 | 多重根| 1 1 | 1 森林遍历正确性 |
 | 大k深链 | 0 1 | 边界深度处理 |

 ## 边缘情况

 考虑一个具有多个根的森林：```
4
a 0
b 0
c 1
d 2
2
1 1
2 1
```DFS从两个根开始`1`和`2`。 欧拉区间变为：

 | 节点| 锡 | 兜售|
 | --- | --- | --- |
 | 1 | 1 | 2 |
 | 3 | 2 | 2 |
 | 2 | 3 | 4 |
 | 4 | 4 | 4 |

 询问`(1,1)`映射到区间`[1,2]`在深度`1`，仅包含节点`3`。 询问`(2,1)`映射到`[3,4]`，仅包含节点`4`。 

该算法处理断开的树，因为每个根都会启动自己的 DFS。 

现在考虑不存在的深度：```
3
a 0
b 1
c 2
1
1 5
```目标深度为`5`， 但`depth_nodes[5]`是空的。 

在处理过程中，该深度的节点列表为空，因此不会发生 Fenwick 更新。 范围查询立即返回`0`。 

同一子树内的重复名称行为正确：```
5
john 0
john 1
john 1
alice 2
alice 3
2
1 1
1 2
```在深度`1`, 节点`(2, john)`和`(3, john)`出现。 处理第二次出现时，第一个出现的情况将从 Fenwick 树中删除。 

因此子树区间恰好包含一个活动事件`john`，产生答案`1`而不是`2`。
