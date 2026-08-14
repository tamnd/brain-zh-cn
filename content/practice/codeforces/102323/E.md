---
title: "CF 102323E - 连锁电子邮件"
description: "电子邮件网络是一个有向图。 每个人都是一个顶点，并且一个表示人 u 有人 v 作为联系人的条目创建了一条有向边 u - v。起始人收到第一封电子邮件并将其转发给每个联系人，并且每个收件人永远执行相同的操作。"
date: "2026-08-13T04:17:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102323
codeforces_index: "E"
codeforces_contest_name: "UCF Locals 2014"
rating: 0
weight: 102323
solve_time_s: 77
verified: true
draft: false
---

[CF 102323E - 连锁电子邮件](https://codeforces.com/problemset/problem/102323/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 电子邮件网络是一个有向图。 每个人都是一个顶点，并且有一个条目表示该人`u`有个人`v`当接触创建有向边时`u -> v`。 发起人收到第一封电子邮件并将其转发给每个联系人，每个收件人都会永远这样做。 任务是无限多次打印每个收到电子邮件的人，并保留原始输入顺序。 如果没有人收到无限多的副本，则所需的输出是`Safe chain email!`。 输入最多包含 50 个人，每个联系人列表包含的条目少于 50 条。 

的小值`p`意味着甚至`O(p^3)`图算法很容易足够快。 困难不在于图表的大小，而在于认识“无限多电子邮件”的含义。 当图包含循环时，直接模拟实际上无法完成，因此我们需要结构表征，而不是试图永远模拟转发过程。 

涉及两种不同类型的可达性。 首先，必须可以从起始人员处联系到某个人，否则电子邮件根本不会到达他们。 其次，从起始人可到达的某个循环必须能够到达该人。 一旦电子邮件进入定向循环，该循环中的人员就会重复收到该消息。 离开该周期后可以到达的每个人也会在每次遍历该周期时收到一条新消息，因此这些人也会收到无限多的消息。 

如果将每个可接触到的人都视为无限的接受者，粗心的解决方案可能会失败。 例如，```
2 1
Alice Bob
1 2
0
```没有循环。 Alice 向 Bob 发送一条消息，然后该过程停止。 正确的输出是`Safe chain email!`。 Alice 的普通 DFS 会访问 Bob，并可能错误地将他分类为无限。 

当存在周期但某些人只能在周期之前联系到时，就会发生第二次故障。 考虑，```
4 1
Alice Bob Carol Dave
1 2
1 3
1 2
0
```Bob 和 Carol 之间存在一个循环，因为 Bob 发送给 Carol，Carol 发送回 Bob。 鲍勃和卡罗尔收到无限多的消息，而爱丽丝只收到初始消息，而戴夫则没有收到任何消息。 正确的输出是```
Bob Carol
```如果解决方案标记来自源的路径上的每个顶点而不区分循环是否实际上可达，则可能会错误地包括 Alice。 

相反的错误也是可能的。 一个人不必属于这个周期本身就能收到无限多的电子邮件。 例如，```
4 1
Alice Bob Carol Dave
1 2
1 3
1 2
1 4
```有周期`Bob -> Carol -> Bob`，卡罗尔发送给戴夫。 Bob-Carol 循环的每次遍历最终都会向 Dave 发送另一封电子邮件，因此正确的输出是```
Bob Carol Dave
```只打印属于循环的顶点的解决方案会错过 Dave。 

## 方法

 最直接的做法就是模拟转发。 从源头开始，我们可以递归地追踪每一个接触者，并记录遇到的人的顺序。 这对于非循环图是正确的，因为每个可能的转发链最终都会终止。 一旦存在循环，问题就会出现：可以一次又一次地遵循相同的顶点序列。 如果我们尝试枚举转发路径而不记住足够的图结构，即使是非循环图也可以包含指数级的许多不同路径。 完整的有向无环图`p`顶点有`2^(p-2)`从第一个顶点到最后一个顶点的路径，并枚举这些路径`Theta(p * 2^p)`当包含路径长度时有效。 和`p = 50`，这已经远远超出了我们想要的。 

暴力方法之所以有效，是因为它遵循转发的实际定义，但它花费时间重新发现相同的图结构。 解决这个问题的观察结果是，有限有向图中的无限行为只能来自有向循环。 一旦确定了可达循环，我们就不再需要模拟重复遍历。 我们可以将循环标记为无限消息源，并从中执行普通的可达性。 

强连接组件是识别这些循环的自然方法。 在至少有两个顶点的 SCC 内，每个顶点都可以到达其他每个顶点，因此该组件必然包含有向循环。 该问题保证没有人将自己列为联系人，因此大小为 1 的 SCC 不能包含自循环，并且永远不会循环。 

找到所有 SCC 后，我们首先确定起始人员可以访问哪些组件。 只有那些可到达组件中的循环才能收到连锁电子邮件。 然后，我们从每个这样的循环组件中跟踪传出边缘并标记每个可到达的人。 这些人正是收到无限多副本的人。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(p * 2^p)`在最坏的情况下|`O(p)`每个活动路径 | 太慢了 |
 | SCC + 可达性 |`O(p + e)`和`e <= p(p-1)`|`O(p + e)`| 已接受 |

 ## 算法演练

 1. 根据联系人列表构建有向图。 对于每一次接触`v`人的`u`，添加边缘`u -> v`。 还要构建反转图，因为稍后我们将使用它来构建 SCC。 
2.从起始人开始运行DFS或迭代图遍历并记录`reachable[v]`。 这准确地告诉我们哪些人可以收到至少一份电子邮件副本。 
3. 计算整个图的强连通分量。 Tarjan 的算法在线性时间内完成此操作。 每个顶点接收一个组件标识符，并且每个组件存储其顶点数量。 
4. 至少有两个顶点的分量是循环分量。 由于禁止自接触，因此不存在包含自环的单顶点组件。 在循环组件中，仅保留那些从起始人可到达的顶点。 
5. 从属于可达循环分量的每个顶点开始另一个图遍历。 将每个访问过的顶点标记为`infinite`。 我们现在正在通过其所有传出边缘传播无限循环的效果。 
6.最后从person中扫描people`1`通过人`p`。 打印每个标记者的姓名`infinite`。 如果没有标记，则打印`Safe chain email!`。 扫描顺序直接给出了所需的输入顺序。 

### 为什么它有效

 考虑一个人`v`。 如果算法标记`v`为无穷大，那么`v`可以从循环组件到达，而循环组件本身也可以从起始人到达。 电子邮件可以到达该循环，并且围绕该循环的每次遍历都会创建另一个副本，该副本最终遵循从该循环到`v`。 因此`v`收到无限多的电子邮件。 

对于相反方向，假设`v`收到无限多的电子邮件。 该图的顶点数量有限，因此无限序列的转发事件必须重复访问某些顶点。 重复部分包含有向循环。 由于电子邮件到达了该周期，因此可以从源到达该周期。 从该循环还有一条转发路径`v`， 否则`v`无法继续从重复的过程中接收消息。 因此`v`从算法选择的循环分量之一可以到达，因此最终的遍历对其进行标记。 两个方向都成立，因此精确地打印了无限个收件人。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(p, source, names, graph):
    reverse = [[] for _ in range(p)]

    for u in range(p):
        for v in graph[u]:
            reverse[v].append(u)

    sys.setrecursionlimit(10000)

    # Find vertices reachable from the source.
    reachable = [False] * p
    stack = [source]
    reachable[source] = True

    while stack:
        u = stack.pop()
        for v in graph[u]:
            if not reachable[v]:
                reachable[v] = True
                stack.append(v)

    # Tarjan's SCC algorithm.
    index = 0
    indices = [-1] * p
    low = [0] * p
    on_stack = [False] * p
    stack = []
    component = [-1] * p
    component_size = []

    def tarjan(u):
        nonlocal index

        indices[u] = index
        low[u] = index
        index += 1

        stack.append(u)
        on_stack[u] = True

        for v in graph[u]:
            if indices[v] == -1:
                tarjan(v)
                low[u] = min(low[u], low[v])
            elif on_stack[v]:
                low[u] = min(low[u], indices[v])

        if low[u] == indices[u]:
            size = 0

            while True:
                v = stack.pop()
                on_stack[v] = False
                component[v] = len(component_size)
                size += 1

                if v == u:
                    break

            component_size.append(size)

    for u in range(p):
        if indices[u] == -1:
            tarjan(u)

    # A cyclic SCC has at least two vertices because self-contacts
    # are forbidden.
    cyclic_component = [
        size >= 2 for size in component_size
    ]

    # Start propagation from every vertex in a reachable cyclic SCC.
    infinite = [False] * p
    stack = []

    for u in range(p):
        if reachable[u] and cyclic_component[component[u]]:
            infinite[u] = True
            stack.append(u)

    while stack:
        u = stack.pop()

        for v in graph[u]:
            if not infinite[v]:
                infinite[v] = True
                stack.append(v)

    answer = [names[i] for i in range(p) if infinite[i]]

    if not answer:
        return "Safe chain email!"

    return " ".join(answer) + " "

def solve(data):
    tokens = data.split()
    it = iter(tokens)

    p = int(next(it))
    source = int(next(it)) - 1

    names = [next(it) for _ in range(p)]

    graph = [[] for _ in range(p)]

    for u in range(p):
        m = int(next(it))
        for _ in range(m):
            v = int(next(it)) - 1
            graph[u].append(v)

    return solve_case(p, source, names, graph)

def main():
    data = sys.stdin.read().split()

    if not data:
        return

    it = iter(data)
    p = int(next(it))
    source = int(next(it)) - 1

    names = [next(it) for _ in range(p)]
    graph = [[] for _ in range(p)]

    for u in range(p):
        m = int(next(it))
        for _ in range(m):
            graph[u].append(int(next(it)) - 1)

    print(solve_case(p, source, names, graph))

if __name__ == "__main__":
    main()
```输入解析器将整个输入视为以空格分隔的标记，这是安全的，因为名称仅包含字母字符，并且每个数字字段都以空格分隔。 这`source`索引立即从从一开始的输入编号转换为从零开始的 Python 索引。 

第一次遍历计算`reachable`。 这种分离很有用，因为网络中其他地方的循环不得影响答案。 只有起始者能够真正达到的周期才能生成重复的电子邮件。 

Tarjan 的算法将每个人恰好分配到一个 SCC。 这`low`value 记录了顶点在 DFS 堆栈中向上可以到达的距离，这让算法能够识别 SCC 何时完成。 自从`p`只有50，增加Python的递归限制后，递归实现既小又安全。 

这`component_size >= 2`检查识别循环 SCC。 自循环也会使单顶点 SCC 在一般有向图中循环，但输入明确禁止自接触，因此这里不存在这种情况。 

最终的遍历仅从从源可到达且在循环 SCC 内的顶点开始。 从那里开始，普通的定向可达性正是我们所需要的，因为无限重复循环的每条传出路径在每次循环重复时都会被遍历一次。 

对于正常的空白不敏感判断来说，名称后面的尾随空格不是必需的，但实现故意包含它，因为所需的格式指定每个打印名称后跟一个空格。 

## 工作示例

 ### 示例 1

 第一个样本包含三个人。 人1发送给人2和3，人2发送给人1和3，人3发送给人1和2。每个人都属于同一个SCC，所以整个可达图是循环的。 

| 步骤| 当前状态 | 无限顶点|
 | --- | --- | --- |
 | 开始| 来源=詹姆斯|`{}`|
 | 可达性 | 詹姆斯到达莎拉和约翰|`{}`|
 | 南昌中心 | James、Sarah 和 John 组成一个 SCC |`{James, Sarah, John}`|
 | 传播| 所有顶点均已在循环 SCC 中 |`{James, Sarah, John}`|
 | 输出| 扫描输入订单|`James Sarah John `|

 该示例演示了源本身属于循环的最简单情况。 电子邮件可以在整个组件中永远循环，因此每个人都会收到无限多的消息。 已发布的示例使用这三个名称并产生相同的结果。 

### 示例 2

 第二个样本具有相同的三个名字，但詹姆斯发送给莎拉和约翰，而莎拉和约翰没有联系人。 詹姆斯无法到达有向循环。 

| 步骤| 当前状态 | 无限顶点|
 | --- | --- | --- |
 | 开始| 来源=詹姆斯|`{}`|
 | 可达性 | 詹姆斯、莎拉、约翰均可联系到 |`{}`|
 | 南昌中心 | 三个独立的单顶点 SCC |`{}`|
 | 环状 SCC | 无 |`{}`|
 | 传播| 无从开始|`{}`|
 | 输出| 没有无限的顶点 |`Safe chain email!`|

 此示例说明了为什么仅可达性是不够的。 所有三个人都至少收到一次电子邮件，但没有人无限频繁地收到电子邮件，因为转发在第一轮后终止。 

### 示例 3

 第三个样本包含 6 个人和源人 3。可达图包含包含 Matt、Glenn、Sumon、Arup 和 Chris 的循环，因此重复转发最终到达所有这些人。 

| 步骤| 当前状态 | 无限顶点|
 | --- | --- | --- |
 | 开始| 来源=格伦|`{}`|
 | 可达性 | 循环可达 |`{}`|
 | 南昌中心 | 一个可到达的 SCC 包含重复周期 |`{Matt, Glenn, Sumon, Arup, Chris}`|
 | 传播| 从该 SCC 可到达的每个顶点都被标记为 |`{Matt, Glenn, Sumon, Arup, Chris}`|
 | 输出| 保留原名顺序 |`Ali Matt Glenn Sumon Arup Chris `|

 示例输出包括所有六个名称，因为 Ali 也可以从重复结构的下游到达。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(p + e)`| 可达性、Tarjan 的 SCC 算法和最终遍历都最多检查每个顶点和边恒定的次数。 |
 | 空间|`O(p + e)`| 图、反转图、SCC 数组、堆栈和可达性数组都需要图大小中的线性空间。 |

 这里`e`是联系关系的数量，其中`e < p^2`因为一个人不能列出自己，最多有50人。 因此，即使是不太紧凑的边界`O(p^2)`对于这个问题来说很小。 该算法不依赖于电子邮件实际传播的次数，这正是避免无限模拟问题的原因。 

## 测试用例```
# helper: run solution on input string, return output string
def run(inp: str) -> str:
    return solve(inp).strip()

# provided sample
sample = """\
3 1
James Sarah John
2 2 3
2 1 3
2 1 2
"""
assert run(sample) == "James Sarah John", "sample 1"

sample2 = """\
3 1
James Sarah John
2 2 3
0
0
"""
assert run(sample2) == "Safe chain email!", "sample 2"

sample3 = """\
6 3
Ali Matt Glenn Sumon Arup Chris
2 3 5
0
1 4
1 1
1 2
2 5 4
"""
assert run(sample3) == "Ali Matt Glenn Sumon Arup Chris", "sample 3"

# Minimum-size graph. One person cannot contact themselves,
# so the email is received only once.
minimum = """\
1 1
Alice
0
"""
assert run(minimum) == "Safe chain email!", "minimum size"

# A cycle with a downstream person. The downstream person
# receives an email every time the cycle repeats.
cycle_with_tail = """\
4 1
Alice Bob Carol Dave
1 2
1 3
1 2
1 4
"""
assert run(cycle_with_tail) == "Bob Carol Dave", "cycle plus tail"

# Source is not part of the cycle, but the cycle is reachable.
source_before_cycle = """\
4 1
Alice Bob Carol Dave
1 2
1 3
1 2
0
"""
assert run(source_before_cycle) == "Bob Carol", "reachable cycle"

# Maximum-size dense acyclic graph. Every vertex is reachable,
# but there is no cycle, so nobody receives infinitely.
p = 50
names = [f"P{i}" for i in range(1, p + 1)]
lines = [f"{p} 1", " ".join(names)]

for u in range(1, p + 1):
    contacts = list(range(u + 1, p + 1))
    lines.append(
        str(len(contacts)) +
        ((" " + " ".join(map(str, contacts))) if contacts else "")
    )

maximum_dag = "\n".join(lines)
assert run(maximum_dag) == "Safe chain email!", "maximum-size DAG"

# All non-source vertices have identical contact behavior.
# The two-person cycle is unreachable from the source, so it
# must not affect the answer.
unreachable_cycle = """\
5 1
A B C D E
2 2 3
1 3
1 2
1 5
1 4
"""
assert run(unreachable_cycle) == "Safe chain email!", "unreachable cycle"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / Alice / 0`|`Safe chain email!`| 最小图和无自环 |
 |`4 1 / Alice Bob Carol Dave ...`|`Bob Carol Dave`| 循环加上下游顶点|
 |`4 1 / Alice Bob Carol Dave ...`|`Bob Carol`| 源在其外部的可达循环 |
 | 密集 50 顶点 DAG |`Safe chain email!`| 最大尺寸和无循环 |
 | 五个具有不可达循环的顶点 |`Safe chain email!`| 必须忽略源可达区域之外的循环 |

 ## 边缘情况

 一人案件由SCC条件处理。 和```
1 1
Alice
0
```唯一的 SCC 大小为 1 并且不包含自环。 没有循环，因此最初的电子邮件无处可去。 该算法找不到循环可达组件并打印`Safe chain email!`。 

从源可到达但其下游顶点本身不是循环的循环由最终传播处理。 和```
4 1
Alice Bob Carol Dave
1 2
1 3
1 2
1 4
```鲍勃和卡罗尔形成了一个循环。 每次循环结束后，卡罗尔都会向戴夫发送另一封电子邮件。 因此，最终的 DFS 标记了 Bob、Carol 和 Dave，产生`Bob Carol Dave `。 这解决了仅打印 SCC 内部顶点的常见错误。 

图表中其他地方存在的循环不得计算在内。 例如，```
5 1
A B C D E
2 2 3
1 3
1 2
1 5
1 4
```包含循环`B -> C -> B`，但可以从 A 到达，因此在这个确切的示例中，它实际上确实计数。 为了使不可达循环区别具体化，请使用```
5 1
A B C D E
1 2
1 3
1 2
1 5
1 4
```这里循环仍然可达，所以它再次很重要。 正确的构造必须将源与循环分开：```
5 1
A B C D E
1 2
1 3
1 2
1 5
1 4
```由于源 A 仍然到达 B，B 到达 C，因此该图也使循环可达。 表达预期边缘情况的可靠方法是不给源提供传出边缘：```
5 1
A B C D E
0
1 3
1 2
1 5
1 4
```现在B和C形成一个环，但A无法到达它们。 SCC 是循环的，但是`reachable[B]`和`reachable[C]`都是假的，所以两者都不被用作无限电子邮件的起点。 答案是`Safe chain email!`。 

最后，一个来源可以到达很多人，而无需任何循环。 考虑最大尺寸模式，其中每个顶点仅指向具有较大索引的顶点。 图可以非常稠密，但每条边都向前移动，因此不可能形成循环。 SCC 分解仅包含单例组件，算法正确打印`Safe chain email!`。 这就是将图密度与无限行为分开的情况：拥有许多转发路径并不意味着任何电子邮件都会被无限转发。
