---
title: "CF 102428I - 改进垃圾邮件"
description: "将每个邮件列表视为有向图中的一个顶点。 当邮件列表 i 包含邮件列表 j 时，从 i 到 j 绘制一条边。 客户电子邮件是终端顶点。"
date: "2026-08-12T07:20:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102428
codeforces_index: "I"
codeforces_contest_name: "2019-2020 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 102428
solve_time_s: 107
verified: true
draft: false
---

[CF 102428I - 改进垃圾邮件](https://codeforces.com/problemset/problem/102428/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将每个邮件列表视为有向图中的一个顶点。 当邮件列表`i`包含邮件列表`j`，从中绘制一条边`i`到`j`。 客户电子邮件是终端顶点。 将消息发送到邮件列表意味着遵循每个传出选择，因此可以通过许多不同的路径到达同一客户端。 

创建规则赋予该图一个重要属性：邮件列表形成 DAG。 列表只能插入到已经存在的列表中，并且列表一次创建一个，因此后面的列表到列表的边总是在创建时间内向前或向后移动，而不会返回到已经存在的列表。 列表的数字地址并不代表其创建时间，因此我们不能假设一条边从较小的索引到较大的索引。 

第一个答案，`B`，单独计算每次交货。 如果可以通过三个不同的路径到达某个客户端，则该客户端将贡献三个`B`。 第二个答案，`A`，仅对每个可到达的客户端进行一次计数。 因此`A`只是从邮件列表中可到达的不同客户端地址的数量`1`。 

最多有`1000`邮件列表和`2000`总地址。 列表可以包含几乎所有地址，因此成员条目总数可以接近`L(N-1)`，不到两百万。 这排除了重复扩展相同子列表或枚举所有可能路径的算法。 线性或近线性图算法适合这些边界。 

在一些简单的情况下，粗心的实施会产生错误的结果。 首先，可以通过两个不同的分支机构联系同一个客户。 例如，```
4 3
2 2 3
1 4
1 4
```这里的邮件列表`1`到达客户`4`通过两个列表`2`和`3`。 普通系统发送两条消息，而改进系统发送一条消息，所以答案是`2 1`。 仅计算直接出现在列表中的不同地址的解决方案`1`错过了重复项。 

第二个陷阱是客户端可以直接出现，也可以通过另一个列表出现：```
4 2
2 2 3
1 3
```列表`1`包含列表`2`和客户`3`，同时列出`2`还包含客户端`3`。 普通交货数量为`2`，但只存在一个不同的客户端，所以答案是`2 1`。 仅删除每个单独列表中的重复条目的解决方案仍然会过度计数。 

第三个陷阱是假设列表索引描述创建顺序。 考虑```
3 2
1 2
1 3
```列表`1`包含列表`2`，并列出`2`包含客户端`3`。 正确答案是`1 1`。 按数字顺序处理列表的 DP 尝试计算列表`1`之前的列表`2`，即使列出`1`取决于它。 该图必须按拓扑顺序排列。 

## 方法

 直接暴力模拟完全遵循邮件列表层次结构，就像真实系统一样。 每当遇到客户端时，它都会增加传递计数，每当遇到另一个邮件列表时，它都会递归地处理该列表。 这是正确的，因为邮件列表的每次出现都代表另一次独立的遍历，与原始系统中完全相同。 

问题是同一个子图可以一遍又一遍地扩展。 考虑将邮件列表排列为完整的 DAG，其中包含列表`1`指向后面的每个列表，列表`2`指向后面的每个列表，等等。 将一封客户电子邮件放入最终列表中。 中间列表的每个子集都给出了与列表不同的路径`1`到最后一封电子邮件。 和`L`列表，这会创建`2^(L-2)`向同一客户交货。 在`L = 1000`， 那是`2^998`递归叶访问，远远超出了可以执行的任何操作。 

解决这个问题的观察结果是，该图是一个 DAG，因此每个邮件列表的效果可以计算一次并重复使用。 定义`ways[i]`作为邮件列表时产生的客户交付数量`i`已处理。 对于直接位于列表内的客户，我们添加一个。 对于另一个邮件列表`j`，我们添加`ways[j]`。 一旦所有的孩子都被计算出来，`ways[i]`无论最终到达多少条不同的路径，都是已知的`i`。 

无重复的答案甚至更简单。 我们不需要为每个列表构建可到达的客户端集。 从列表开始`1`，运行图形遍历并在遇到每个地址时立即对其进行标记。 邮件列表仅在第一次到达时进行处理，并且仅在第一次到达时对客户端进行计数。 这直接对改进的行为进行建模。 

在 DP 之前我们需要的唯一结构细节是邮件列表图的拓扑排序。 卡恩的算法给出了父母对孩子的命令。 颠倒该顺序可以保证引用的每个列表`i`当我们计算时已经被评估了`ways[i]`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(扩展路径数) | O(L) 递归深度 | 太慢了|
 | 最佳| O(N + E) | O(N + E) | 已接受 |

 这里`E`表示会员条目总数。 蛮力复杂度不是多项式，因为路径的数量可以是指数的`L`。 

## 算法演练

 1. 阅读每个邮件列表并存储其成员。 对于属于另一个邮件列表的每个成员，将当前列表中的有向边添加到该成员并增加该成员的入度。 保留完整的成员资格列表很有用，因为稍后 DP 和无重复遍历将使用相同的表示。 
2. 在邮件列表图上运行 Kahn 的拓扑排序。 从入度为零的每个列表开始，重复删除一个这样的列表，并减少其子列表的入度。 创建规则保证图是非循环的，因此每个邮件列表最终都会出现在排序中。 
3. 颠倒拓扑顺序。 如果`i -> j`意味着列表`i`包含列表`j`， 然后`j`必须先评估`i`。 相反的顺序正好给出了依赖方向。 
4. 以相反的顺序处理邮件列表并计算`ways[i]`。 对于列表中的每个直接客户`i`， 添加`1`。 对于每个邮件列表`j`在列表中`i`， 添加`ways[j]`。 对结果取模`10^9 + 7`。 由于每个引用列表都已被处理，因此不需要递归扩展。 
5. 从邮件列表开始`1`，对所有地址执行 DFS 或 BFS。 维持一`seen`涵盖邮件列表和客户端地址的数组。 当到达以前未见过的客户端时，对其进行标记并递增`A`。 当到达以前未见过的邮件列表时，对其进行标记并将其放入遍历队列中。 
6. 输出`ways[1]`以及遍历到达的不同客户端的数量。 第一个值分别对每个路径进行计数，而第二个值对每个地址最多计数一次。 

### 为什么它有效

 对于第一个答案，不变的是处理列表之后`i`,`ways[i]`恰好等于从以下位置开始的客户端传送路径的数量`i`。 每个直接客户端贡献一条路径，每个包含的邮件列表贡献从该子列表开始的所有路径。 由于相反的拓扑顺序首先处理每个子项，因此递归将每个可能的交付恰好考虑一次。 

对于第二个答案，不变的是地址最多被处理一次。 可从列表中联系到的每个客户`1`最终会在遍历中遇到，因此每个可到达的客户端都为 贡献了一个`A`。 如果多个路径到达同一客户端，则其`seen`当后面的路径遇到它时，条目已经设置，因此不会计算重复项。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    input = sys.stdin.readline

    n, l = map(int, input().split())

    members = [[] for _ in range(l)]
    graph = [[] for _ in range(l)]
    indegree = [0] * l

    for i in range(l):
        data = list(map(int, input().split()))
        k = data[0]
        cur = [x - 1 for x in data[1:k + 1]]
        members[i] = cur

        for x in cur:
            if x < l:
                graph[i].append(x)
                indegree[x] += 1

    # Topological order of the mailing-list DAG.
    queue = []
    head = 0

    for i in range(l):
        if indegree[i] == 0:
            queue.append(i)

    topo = []

    while head < len(queue):
        u = queue[head]
        head += 1
        topo.append(u)

        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)

    # Children must be evaluated before parents.
    ways = [0] * l

    for u in reversed(topo):
        total = 0

        for x in members[u]:
            if x < l:
                total += ways[x]
            else:
                total += 1

        ways[u] = total % MOD

    # Count distinct client emails reachable from list 1.
    seen = [False] * n
    seen[0] = True

    queue = [0]
    head = 0
    distinct_clients = 0

    while head < len(queue):
        u = queue[head]
        head += 1

        for x in members[u]:
            if seen[x]:
                continue

            seen[x] = True

            if x < l:
                queue.append(x)
            else:
                distinct_clients += 1

    return f"{ways[0]} {distinct_clients}"

if __name__ == "__main__":
    print(solve())
```输入存储在`members`，使用从零开始的地址。 一个值小于`l`是一个邮件列表，而至少有一个值`l`是客户地址。 这就是为什么条件是`x < l`，而不是`x <= l`。 

这`graph`数组仅包含列表到列表的边。 它是独立于`members`因为拓扑排序只需要那些边，而DP需要区分列表成员和客户端成员。 

入度数组属于Kahn算法。 拓扑排序建立后就不再需要了，因此相同的内存不会重复。 

DP 迭代`reversed(topo)`。 这个方向很容易出错。 如果列出`u`包含列表`v`，该图包含`u -> v`，所以普通的拓扑顺序`u`前`v`。 DP 需要相反的顺序，`v`前`u`。 

Python整数不会溢出，但是模运算仍然是必要的，因为所需的答案是模`10^9 + 7`。 在计算每个列表后执行一次取模，这已经足够了，因为中间和受成员数乘以的限制`MOD`。 

对于无重复遍历，一`seen`数组对于两种地址都足够了。 见过的邮件列表永远不会再扩大，见过的客户也永远不会再被计数。 这正是计算路径之间的区别`B`并计算可到达的顶点`A`。 

## 工作示例

 ### 示例 1

 邮件列表边缘是`1 -> 2`,`1 -> 3`， 和`3 -> 2`。 卡恩算法可以产生顺序`1, 3, 2`，所以 DP 处理`2, 3, 1`。 

| 列表 | 会员 |`ways`加工后| 可达客户|
 | --- | --- | --- | --- |
 | 2 | 4, 5 | 2 | 4, 5 |
 | 3 | 4, 2 | 3 | 4, 5 |
 | 1 | 2, 3 | 5 | 4, 5 |

 列表`2`直接发送给客户`4`和`5`, 给予`ways[2] = 2`。 列表`3`直接发送至`4`然后是进程列表`2`， 所以`ways[3] = 1 + 2 = 3`。 最后列出`1`处理两个列表，给出`2 + 3 = 5`。 

可达性遍历看到客户端`4`和`5`各一次。 客户`4`通过两个列表都遇到`2`和`3`， 但`seen[4]`防止第二次相遇增加答案。 结果是`5 2`。 

### 示例 2

 相关的邮件列表边缘是`1 -> 6`,`3 -> 6`,`3 -> 4`,`3 -> 5`,`5 -> 4`,`6 -> 5`， 和`6 -> 4`。 一种有效的拓扑顺序是`1, 2, 3, 6, 5, 4`，因此 DP 使用相反的顺序。 

| 列表 | DP相关成员|`ways`|
 | --- | --- | --- |
 | 4 | 14、15 | 2 |
 | 5 | 6？ 不，实际上是 4, 14 | 3 |
 | 6 | 5, 4 | 5 |
 | 3 | 6、14、4、5、15 | 12 | 12
 | 2 | 10, 11, 12, 13, 9, 7, 8 | 10, 11, 12, 13, 9, 7, 8 | 7 |
 | 1 | 6 | 5 |

 列表`4`直接包含客户端`14`和`15`，所以它产生两条消息。 列表`5`包含列表`4`和客户`14`，生产`2 + 1 = 3`。 列表`6`包含列表`5`和`4`，生产`3 + 2 = 5`。 自列出以来`1`仅包含列表`6`,`B = 5`。 

对于改进后的系统，从列表中遍历`1`到达列表`6`，然后列出`5`和`4`，最终只有客户`14`和`15`。 通往这些客户的两条路径都分解为每个地址一次交付，从而使`A = 2`。 

## 复杂度分析

 让`E`是所有邮件列表中的成员条目总数。 

| 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N + E) | 拓扑排序、DP 和可达性遍历均以恒定次数检查每个存储的成员资格 |
 | 空间| O(N + E) | 成员列表、邮件列表图、入度、DP 值、队列和访问数组都与输入大小呈线性 |

 最大可能`E`下面是`L(N-1)`，在给定的限制下低于 200 万。 每个成员资格仅被检查固定次数，因此即使对于密集的邮件列表结构，算法也能保持在预期规模内。 

## 测试用例```python
import sys
import io

MOD = 1_000_000_007

def solve():
    input = sys.stdin.readline

    n, l = map(int, input().split())

    members = [[] for _ in range(l)]
    graph = [[] for _ in range(l)]
    indegree = [0] * l

    for i in range(l):
        data = list(map(int, input().split()))
        k = data[0]
        cur = [x - 1 for x in data[1:k + 1]]
        members[i] = cur

        for x in cur:
            if x < l:
                graph[i].append(x)
                indegree[x] += 1

    queue = []
    head = 0

    for i in range(l):
        if indegree[i] == 0:
            queue.append(i)

    topo = []

    while head < len(queue):
        u = queue[head]
        head += 1
        topo.append(u)

        for v in graph[u]:
            indegree[v] -= 1
            if indegree[v] == 0:
                queue.append(v)

    ways = [0] * l

    for u in reversed(topo):
        total = 0
        for x in members[u]:
            if x < l:
                total += ways[x]
            else:
                total += 1
        ways[u] = total % MOD

    seen = [False] * n
    seen[0] = True

    queue = [0]
    head = 0
    distinct_clients = 0

    while head < len(queue):
        u = queue[head]
        head += 1

        for x in members[u]:
            if seen[x]:
                continue

            seen[x] = True

            if x < l:
                queue.append(x)
            else:
                distinct_clients += 1

    return f"{ways[0]} {distinct_clients}"

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

sample1 = """\
5 3
2 2 3
2 4 5
2 4 2
"""

sample2 = """\
15 6
1 6
7 10 11 12 13 9 7 8
5 6 14 4 5 15
2 14 15
2 4 14
2 5 4
"""

sample3 = """\
10 5
4 8 9 10 3
3 9 10 6
3 8 9 7
6 2 3 6 7 8 10
5 9 10 3 1 7
"""

assert run(sample1) == "5 2", "sample 1"
assert run(sample2) == "5 2", "sample 2"
assert run(sample3) == "6 4", "sample 3"

# Minimum-size instance.
assert run("""\
2 1
1 2
""") == "1 1", "minimum-size case"

# Same client reached through two different lists.
assert run("""\
4 3
2 2 3
1 4
1 4
""") == "2 1", "duplicate through two branches"

# Same client appears directly and through a nested list.
assert run("""\
4 2
2 2 3
1 3
""") == "2 1", "direct plus indirect duplicate"

# Many paths to the same client.
assert run("""\
8 4
4 2 3 4 8
3 3 4 8
2 4 8
1 8
""") == "8 1", "exponential path structure"

# Maximum N and maximum L, with the boundary client N appearing.
n = 2000
l = 1000
lines = [f"{n} {l}"]
for i in range(l):
    lines.append(f"1 {l + i + 1}")

max_case = "\n".join(lines) + "\n"
assert run(max_case) == "1 1", "maximum-size boundary case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1 / 1 2`|`1 1`| 最小值和第一个客户端地址|
 |`4 3 / 2 2 3 / 1 4 / 1 4`|`2 1`| 通过不同的分支机构联系同一客户|
 |`4 2 / 2 2 3 / 1 3`|`2 1`| 直接和间接接触到的客户|
 |`8 4 / 4 2 3 4 8 / 3 3 4 8 / 2 4 8 / 1 8`|`8 1`| 许多不同的路径以一个客户端结束 |
 |`N=2000, L=1000`，每个列表包含其自己的边界客户端 |`1 1`| 最大尺寸和地址`N`|

 ## 边缘情况

 第一个边缘情况是通过不同分支的重复可达性。 为了```
4 3
2 2 3
1 4
1 4
```拓扑DP计算`ways[2] = 1`和`ways[3] = 1`， 所以`ways[1] = 2`。 在可达性遍历过程中，列出`2`发现客户`4`第一的。 何时列出`3`被处理，`seen[4]`已为 true，因此不会再次计算该客户端。 输出是`2 1`。 

第二个边缘情况是由直接成员资格和嵌套成员资格引起的重复。 为了```
4 2
2 2 3
1 3
```列表`2`为客户生产一份货物`3`。 列表`1`还包含客户端`3`直接，所以`ways[1] = 2`。 遍历达到`3`直接从列表中`1`然后通过列表再次遇到它`2`，但第二次出现将被忽略。 输出是`2 1`。 

第三种边缘情况是数字地址顺序和依赖顺序之间的不匹配：```
3 2
1 2
1 3
```该图包含`1 -> 2`，并列出`2`包含客户端`3`。 卡恩的算法位置列表`1`之前的列表`2`，然后以相反的顺序计算列表`2`第一的。 因此`ways[2] = 1`， 其次是`ways[1] = 1`。 从列表中遍历`1`也到达客户`3`, 给予`1 1`。 数字索引 DP 会失败，因为它会尝试使用`ways[2]`在计算之前。 

最终的结构边缘情况是一个具有指数级多到同一客户端的路径的图：```
8 4
4 2 3 4 8
3 3 4 8
2 4 8
1 8
```列表中有八个不同的路径`1`给客户`8`， 所以`B = 8`。 改进的遍历看到客户端`8`一次并给予`A = 1`。 DP 通过计算每个列表一次来处理所有八条路径，而不是显式遍历这八条路径。 这是使算法扩展到更大的最大情况的属性。
