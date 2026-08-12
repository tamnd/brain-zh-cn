---
title: "CF 102399J-\u041a\u043e\u043d\u043a\u0443\u0440\u0441\u043a\u043e\u0442\u0438\u043a\u043e\u0432"
description: "有 (n) 名居民和 (n) 只猫。 居民 (i) 拥有猫 (i)。 每个熟人关系都由从居民（a）到猫（b）的有向边表示，这意味着居民（a）认识猫（b）。 每个居民都认识自己的猫，因此每个顶点都有一个自循环。"
date: "2026-08-11T16:00:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102399
codeforces_index: "J"
codeforces_contest_name: "2019 \u041c\u043e\u0441\u043a\u043e\u0432\u0441\u043a\u0430\u044f \u043a\u043e\u043c\u0430\u043d\u0434\u043d\u0430\u044f \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434\u0430 \u0448\u043a\u043e\u043b\u044c\u043d\u0438\u043a\u043e\u0432, \u043b\u0438\u0433\u0430 A"
rating: 0
weight: 102399
solve_time_s: 227
verified: false
draft: false
---

[CF 102399J - \u041a\u043e\u043d\u043a\u0443\u0440\u0441 \u043a\u043e\u0442\u0438\u043a\u043e\u0432](https://codeforces.com/problemset/problem/102399/J)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 47s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 有 (n) 名居民和 (n) 只猫。 居民 (i) 拥有猫 (i)。 每个熟人关系都由从居民（a）到猫（b）的有向边表示，这意味着居民（a）认识猫（b）。 每个居民都认识自己的猫，因此每个顶点都有一个自循环。 

我们需要将 (n) 个索引分成两个非空集合。 第一组成为陪审团，这意味着这些指数被视为居民。 第二组成为参与者，这意味着这些指数被视为猫。 大小之和必须为 (n)，因此每个索引必须恰好属于这两个集合之一。 陪审团成员不得认识任何参赛的猫。 

最后一个条件有一个有用的图形解释。 假设索引 (a) 被分配给陪审团并且存在一条边 (a \to b)。 那么猫（b）不能是参与者，所以（b）也必须属于陪审团。 因此，每当一个顶点被放入陪审团中时，每个出边可到达的顶点也必须被放入陪审团中。 陪审团是一个封闭在传出边下的非空真子集。 

这些约束强烈建议使用线性图算法。 所有测试中最多可以有 (10^6) 个顶点和 (10^6) 个熟人边。 即使 (O(n^2)) 也太大了，而 (O(n+m)) 则合适。 大量的测试用例还意味着实现应该只处理每条边恒定的次数，并使用迭代图遍历而不是递归 DFS，因为具有 (10^6) 个顶点的图很容易超出 Python 的递归限制并产生过多的调用堆栈开销。 

有几种边缘情况可能会欺骗粗心的构造。 

对于 (n=1)，唯一可能的划分是没有陪审团成员或没有参与者。 所需的输出是`No`。```
1
1 1
1 1
```盲目选择可达或不可达集合的构造可能会意外地产生空的一面。 

对于非强连通图，即使有很多边，答案也确实存在。 例如，```
2
2 3
1 1
2 2
1 2
```答案可以是陪审团 ({2}) 和参与者猫 ({1})。 居民2只知道猫2，因此满足交叉条件。 坚持寻找度数为零的顶点的粗心方法会错过这一点，因为两个顶点都有出边。 

图表的方向也很重要。 考虑```
3
3 4
1 1
2 2
3 3
2 1
```这里陪审团 ({1}) 起作用，因为居民 1 只知道猫 1。无法到达顶点 1 的顶点集是 ({2,3})，它也形成有效的陪审团。 将熟人视为无向关系的实现会错误地得出顶点 1 和 2 必须位于同一侧的结论，即使该条件仅禁止从陪审团居民到参与者猫的边。 

最后，如果每个顶点都可以到达其他每个顶点，则不存在解。 例如，```
2
2 4
1 1
1 2
2 1
2 2
```将任一顶点放入陪审团会强制另一个顶点通过可达性进入陪审团。 因此，每个非空闭集都是整个图，不留下任何参与者。 

## 方法

 直接的暴力方法将枚举每个可能的陪审团子集。 有(2^n)个子集，空集和全集无效，留下(2^n-2)个候选。 对于每个候选人，我们可以扫描所有（m）条熟人边缘，如果某些边缘开始于陪审团并结束于陪审团之外，则拒绝它。 这是正确的，因为每个可能的分区都会被检查，但它的最坏情况工作是 ((2^n-2)m)，这对于 (n=30) 来说已经是巨大的了，更不用说 (n=10^6) 了。 

蛮力之所以有效，是因为唯一真正的选择是哪些指数属于陪审团。 关键是要了解是什么使所选子集有效。 如果 (a) 在陪审团中并且有一条边 (a\to b)，则 (b) 也必须在陪审团中。 重复这个论证表明陪审团必须包含从任何陪审团顶点可到达的每个顶点。 在图术语中，我们需要一个在传出边下闭合的非空真集合。 

这立即将问题与可达性联系起来。 从顶点1开始，如果从1无法到达某些顶点，则将所有这些无法到达的顶点作为陪审团。 该集合在传出边下是封闭的：如果一个不可到达的顶点有一条到可到达顶点的边，那么它本身就是可到达的。 

如果每个顶点都可以从 1 到达怎么办？ 然后我们在反转图中执行相同的想法。 如果反转后的图中某个顶点无法从 1 到达，则意味着原图中对应的顶点也无法到达 1。 将所有这样的顶点作为陪审团。 该集合在传出边下再次闭合。 如果反转图中每个顶点也从 1 可达，则每个顶点都可以到达 1，并且 1 也可以到达每个顶点，因此该图是强连通的。 在强连接图中，每个非空传出闭集必须包含所有顶点，从而不可能进行有效划分。 

因此，这两次遍历准确地区分了我们需要的两种情况。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^n·m)) | (O(n+m)) | 太慢了|
 | 最佳 | (O(n+m)) | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 将每个索引 (1,\ldots,n) 视为图顶点。 对于每个熟人对 ((a,b))，添加一条有向边 (a\to b)。 该方向准确地代表了禁止的情况：陪审团顶点 (a) 不能具有到参与者顶点 (b) 的传出边。 
2. 从原始图中的顶点 (1) 运行 DFS 或 BFS，并标记每个可到达的顶点。 如果某些顶点仍未被访问，则将这些顶点准确地放入陪审团中，并将所有其他顶点放入参与者集中。 这是第一个有用的情况，因为边不能离开不可达集并进入可达集。 
3. 如果到达了每个顶点，则构建反转图并从那里的顶点 (1) 开始遍历。 在反转图中达到(v)就相当于说(v)在原图中可以达到(1)。 
4. 如果反转图中某些顶点仍然无法到达，则将这些顶点放入陪审团中，将所有其他顶点放入参与者集中。 该集合在原始传出边下闭合。 假设 (v) 在其中并且 (v\to u)。 如果（u）可以到达（1），那么（v）可以到达（u），然后到达（1），这与反转图中的（1）无法到达（v）相矛盾。 
5. 如果第二次遍历也到达每个顶点，则输出`No`。 此时顶点1可以到达所有顶点，并且每个顶点都可以到达顶点1。因此，每对顶点都可以互相到达，因此该图是强连通的。 
6. 对于成功的案例，输出所选封闭集中的顶点作为陪审团居民，并将其补充作为参与猫。 这两个集合对所有 (n) 个索引进行分区，因此它们的大小自动总和为 (n)。 由于成功的遍历至少在所选集合之外留下了一个顶点，因此两侧都是非空的。 

### 为什么它有效

 中心不变量是陪审团必须在传出边缘下关闭。 第一次遍历从无法从 1 到达的顶点构造这样的集合。第二次遍历从不能到达 1 的顶点构造这样的集合。在任何一种情况下，所选集合的传出边都无法进入其补集，因此陪审团居民都不知道参与的猫。 

如果两次遍历都到达每个顶点，则该图是强连通的。 取任一非空陪审团集并在其中选择一个顶点 (v)。 由于该图是强连通的，因此每个顶点都可以从 (v) 到达。 因此，输出边缘下的闭合迫使每个顶点都进入陪审团。 然后陪审团将包含所有 (n) 个顶点，并且没有参与者，这是被禁止的。 因此`No`在强连接的情况下是完全正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def traverse(graph, start):
    n = len(graph)
    seen = bytearray(n)
    seen[start] = 1
    stack = [start]

    while stack:
        v = stack.pop()
        for u in graph[v]:
            if not seen[u]:
                seen[u] = 1
                stack.append(u)

    return seen

def solve():
    t = int(input())
    answer = []

    for _ in range(t):
        line = input()
        while not line.strip():
            line = input()

        n, m = map(int, line.split())

        graph = [[] for _ in range(n)]
        rev = [[] for _ in range(n)]

        for _ in range(m):
            a, b = map(int, input().split())
            a -= 1
            b -= 1
            graph[a].append(b)
            rev[b].append(a)

        reachable = traverse(graph, 0)

        if not all(reachable):
            jury = [i + 1 for i in range(n) if not reachable[i]]
            participants = [i + 1 for i in range(n) if reachable[i]]

            answer.append("Yes")
            answer.append(f"{len(jury)} {len(participants)}")
            answer.append(" ".join(map(str, jury)))
            answer.append(" ".join(map(str, participants)))
            continue

        can_reach_one = traverse(rev, 0)

        if not all(can_reach_one):
            jury = [i + 1 for i in range(n) if not can_reach_one[i]]
            participants = [i + 1 for i in range(n) if can_reach_one[i]]

            answer.append("Yes")
            answer.append(f"{len(jury)} {len(participants)}")
            answer.append(" ".join(map(str, jury)))
            answer.append(" ".join(map(str, participants)))
        else:
            answer.append("No")

    sys.stdout.write("\n".join(answer))

if __name__ == "__main__":
    solve()
```邻接表`graph`代表居民与猫的熟人边缘。 反向列表`rev`包含完全相反的边，这让第二次遍历回答了“哪些顶点可以到达顶点 1？”的问题。 无需从每个顶点运行单独的搜索。 

遍历使用的是`bytearray`而不是 Python 布尔值列表。 最多有 (10^6) 个顶点，这大大减少了内存消耗。 堆栈也是迭代的，避免了长链上的递归深度问题。 

第一个搜索检查是否每个顶点都可以从顶点 1 到达。当某个顶点不可到达时，代码会精确地选择不可到达的顶点作为陪审团。 条件`if not reachable[i]`是重要的边界选择：在这种情况下，顶点 1 本身属于补集，而每个无法到达的顶点都属于陪审团。 

第二次搜索使用`rev`。 当一个顶点能够到达原始图中的顶点 1 时，它就被准确地标记在那里。 因此，选择`not can_reach_one[i]`给出第二个可能的闭集.

 任何整数都不会溢出，因为 Python 整数是任意精度的，并且所有索引仅在实现内部转换为从零开始的形式。 输入保证熟人对是唯一的，因此不需要删除重复的边。 

分隔测试用例的空行是通过在读取 (n) 和 (m) 之前跳过空行来处理的。 输出被累积并写入一次，这比重复调用要快得多`print`对于潜在的数百万个指数。 

## 工作示例

 考虑样本中的第一个测试用例。```
3 4
1 1
2 2
3 3
1 3
```有向边为 (1\to1)、(2\to2)、(3\to3) 和 (1\to3)。 

| 步骤| 起始顶点 | 可到达的顶点 | 无法到达的顶点 | 行动|
 | ---| ---| ---| ---| ---|
 | 原创DFS | 1 | ({1,3}) | ({1,3}) | ({2}) | 陪审团 = ({2}) |
 | 输出| | 评审团 ({2}) | 参与者 ({1,3}) |`Yes`|

 集合 ({2}) 是闭集，因为它唯一的出边是 (2\to2)。 参与的猫是 1 和 3，居民 2 都不认识它们。 这给出了大小为 (1+2=3) 的有效分区。 

现在考虑第二个样本测试。```
3 7
1 1
1 2
1 3
2 2
3 1
3 2
3 3
```该图具有从 1 到每个顶点的边，从 3 到每个顶点的边，但 3 本身也存在，并且顶点 2 仅具有其自环。 

| 步骤| 起始顶点 | 可到达的顶点 | 无法到达的顶点 | 行动|
 | ---| ---| ---| ---| ---|
 | 原创DFS | 1 | ({1,2,3}) | (\var没有) | 继续 |
 | 反向 DFS | 1 | ({1,3}) | ({1,3}) | ({2}) | 陪审团 = ({2}) |
 | 输出| | 评审团 ({2}) | 参与者 ({1,3}) |`Yes`|

 在原始图中，每个顶点都可以从 1 到达，因此第一个构造不能给出非空陪审团。 在反转图中，从1无法到达顶点2，这意味着原图中顶点2无法到达1。 选择顶点 2 作为陪审团是有效的，因为它唯一的出边是自循环 (2\to2)。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n+m)) | 每个图边在两次遍历中最多检查一次。 |
 | 空间| (O(n+m)) | 原始邻接表和反向邻接表存储 (2m) 个有向条目以及遍历状态。 |

 在所有测试用例中，(n) 和 (m) 的总和最多为 (10^6)。 因此，图操作的总数大致与 (2\cdot10^6) 个顶点和 (2\cdot10^6) 个边条目呈线性关系，这适合给定的限制。 迭代遍历还避免了Python递归开销和递归深度失败。 

## 测试用例

 由于该问题接受任何有效分区，因此精确的输出字符串不是合适的断言。 下面的测试工具验证实际输出：它检查大小，验证两个集合是否形成一个分区，并根据陪审团和参与者集合检查每个熟人边缘。```python
import sys
import io

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out

    try:
        t = int(sys.stdin.readline())
        answer = []

        def traverse(graph, start):
            n = len(graph)
            seen = bytearray(n)
            seen[start] = 1
            stack = [start]

            while stack:
                v = stack.pop()
                for u in graph[v]:
                    if not seen[u]:
                        seen[u] = 1
                        stack.append(u)

            return seen

        for _ in range(t):
            line = sys.stdin.readline()
            while not line.strip():
                line = sys.stdin.readline()

            n, m = map(int, line.split())
            graph = [[] for _ in range(n)]
            rev = [[] for _ in range(n)]

            edges = []

            for _ in range(m):
                a, b = map(int, sys.stdin.readline().split())
                a -= 1
                b -= 1
                graph[a].append(b)
                rev[b].append(a)
                edges.append((a, b))

            first = traverse(graph, 0)

            if not all(first):
                jury = [i + 1 for i in range(n) if not first[i]]
                participants = [i + 1 for i in range(n) if first[i]]

                answer.append("Yes")
                answer.append(f"{len(jury)} {len(participants)}")
                answer.append(" ".join(map(str, jury)))
                answer.append(" ".join(map(str, participants)))
            else:
                second = traverse(rev, 0)

                if not all(second):
                    jury = [i + 1 for i in range(n) if not second[i]]
                    participants = [i + 1 for i in range(n) if second[i]]

                    answer.append("Yes")
                    answer.append(f"{len(jury)} {len(participants)}")
                    answer.append(" ".join(map(str, jury)))
                    answer.append(" ".join(map(str, participants)))
                else:
                    answer.append("No")

        return out.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

def validate(inp: str, out: str) -> bool:
    data = inp.split()
    pos = 0
    t = int(data[pos])
    pos += 1

    cases = []

    for _ in range(t):
        n = int(data[pos])
        m = int(data[pos + 1])
        pos += 2

        edges = []
        for _ in range(m):
            a = int(data[pos])
            b = int(data[pos + 1])
            pos += 2
            edges.append((a, b))

        cases.append((n, edges))

    tokens = out.split()
    pos = 0

    for n, edges in cases:
        if pos >= len(tokens):
            return False

        verdict = tokens[pos]
        pos += 1

        if verdict == "No":
            continue

        if verdict != "Yes" or pos + 2 > len(tokens):
            return False

        j = int(tokens[pos])
        p = int(tokens[pos + 1])
        pos += 2

        if j <= 0 or p <= 0 or j + p != n:
            return False

        if pos + j + p > len(tokens):
            return False

        jury = list(map(int, tokens[pos:pos + j]))
        pos += j

        participants = list(map(int, tokens[pos:pos + p]))
        pos += p

        if len(set(jury)) != j or len(set(participants)) != p:
            return False

        if any(x < 1 or x > n for x in jury + participants):
            return False

        jury_set = set(jury)
        participant_set = set(participants)

        if jury_set & participant_set:
            return False

        if len(jury_set | participant_set) != n:
            return False

        for a, b in edges:
            if a in jury_set and b in participant_set:
                return False

    return pos == len(tokens)

sample = """\
4
3 4
1 1
2 2
3 3
1 3

3 7
1 1
1 2
1 3
2 2
3 1
3 2
3 3

1 1
1 1

2 4
1 1
1 2
2 1
2 2
"""

assert validate(sample, solve_data(sample)), "provided sample"

minimum = """\
1
1 1
1 1
"""

assert solve_data(minimum).strip() == "No", "minimum-size case"

all_self = """\
1
4 4
1 1
2 2
3 3
4 4
"""

assert validate(all_self, solve_data(all_self)), "all-self edges"

chain = """\
1
4 7
1 1
2 2
3 3
4 4
1 2
2 3
3 4
"""

assert validate(chain, solve_data(chain)), "directed chain"

strongly_connected = """\
1
3 6
1 1
2 2
3 3
1 2
2 3
3 1
"""

assert solve_data(strongly_connected).strip() == "No", "strongly connected graph"

boundary = """\
1
2 3
1 1
2 2
1 2
"""

assert validate(boundary, solve_data(boundary)), "two-vertex boundary case"

large_self_loop_case = "1\n100000 100000\n" + "".join(
    f"{i} {i}\n" for i in range(1, 100001)
)

assert validate(
    large_self_loop_case,
    solve_data(large_self_loop_case)
), "large linear-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 1 / 1 1`|`No`| 最小的可能图不能分成两个非空边。 |
 | 四自循环 |`Yes`| 仅具有自边的顶点可以任意分为两个非空组。 |
 | 定向链 |`Yes`| 检查所选集是否必须在传出边缘下闭合。 |
 | 三循环自循环|`No`| 正确检测强连通图。 |
 | 两个顶点 (1\to2) |`Yes`| 检查最小的非平凡定向蕴涵和边界索引。 |
 | (100000) 自循环 |`Yes`| 在大输入上练习线性记忆和时间行为。 |

 ## 边缘情况

 对于最小情况，```
1
1 1
1 1
```第一次遍历到达顶点1，因此不存在不可到达的顶点。 反向遍历也到达顶点1。该图是强连通的，这意味着算法打印`No`。 这避免了打印单元素陪审团或参与者集而另一面留空的常见错误。 

对于仅由自环组成的图，```
1
4 4
1 1
2 2
3 3
4 4
```从顶点 1 开始的第一次遍历仅到达顶点 1。顶点 2、3、4 无法到达，因此算法选择 ({2,3,4}) 作为陪审团，选择 ({1}) 作为参与者集。 每个陪审团顶点只知道自己的猫，这也是陪审团索引，因此不存在禁止的陪审团到参与者边。 

对于有向链，```
1
4 7
1 1
2 2
3 3
4 4
1 2
2 3
3 4
```从 1 开始的第一次遍历到达了所有四个顶点，因此它不能直接提供封闭的不可达集。 在反向图中，每个顶点都可以到达顶点 1，因为原始链通向 4 而不是 1。因此反向遍历仅到达顶点 1，留下 ({2,3,4}) 作为陪审团。 该集合在原始边缘下闭合，因为 (2\to3) 和 (3\to4) 保留在其中。 

对于强连接的情况，```
1
3 6
1 1
2 2
3 3
1 2
2 3
3 1
```原始遍历从 1 到达所有顶点。 反转图也让 1 到达所有顶点，因为原始循环允许每个顶点到达 1。算法打印`No`。 任何非空陪审团都会将整个周期强制纳入陪审团，不留下任何参与的猫。 

对于两顶点边界情况，```
1
2 3
1 1
2 2
1 2
```第一次遍历到达两个顶点。 在反转图中，顶点 1 只到达其自身，因为原始边 (1\to2) 变为 (2\to1)。 因此，算法选择顶点 2 作为陪审团，顶点 1 作为参与者。 居民 2 只知道猫 2，因此该构造是有效的。 这种情况对于捕获基于 1 的输入标签和基于 0 的 Python 数组之间的转换中的差一错误特别有用。
