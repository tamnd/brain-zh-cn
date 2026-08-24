---
title: "CF 102191I - 项目介绍"
description: "公司的层次结构是一棵有根的树。 员工 u 直接向 p[u] 汇报，并反复遵循父级指示，最终到达 CEO。 每一位员工都属于一个项目。"
date: "2026-08-24T10:57:07+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102191
codeforces_index: "I"
codeforces_contest_name: "PSUT Coding Marathon 2019"
rating: 0
weight: 102191
solve_time_s: 2145
verified: true
draft: false
---

[CF 102191I - 项目演示](https://codeforces.com/problemset/problem/102191/I)

 **评级：** -
 **标签：** -
 **求解时间：** 35m 45s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 公司的层次结构是一棵有根的树。 员工`u`直接向`p[u]`，并反复遵循父级指示，最终到达首席执行官。 每一位员工都属于一个项目。 

对于特定项目，分配到该项目的每位员工以及从每位员工到首席执行官的每一位经理都会参加其演示。 如果两个项目成员有一个共同的经理，则该经理只能计算一次。 因此，项目所需的答案是所有根到项目成员路径的并集中包含的不同顶点的数量。 

输入最多包含 (10^6) 名员工，因此为每个项目成员单独走到 CEO 的算法可以执行 (O(n^2)) 工作。 对于一百万个顶点，即使是线性传递在三秒限制内也已经相当大了，因此目标必须接近线性。 在 Python 中，为每个顶点存储 (O(\log n)) 祖先表也是不可取的，因为 (10^6 \log n) 个整数超出了内存预算。 解决方案应使用线性大小的数组并避免递归 DFS。 

有几种情况很容易处理不当。 如果来自同一项目的两个员工位于同一根路径上，则他们的共同祖先不得被计算两次。 例如，```
3 1
1 1 1
0 1 2
```所有三名员工都属于项目 1，答案是`3`。 独立添加三个根路径长度的解决方案将对员工 1 和 2 进行多次计数。 

一名员工本身可以是具有相同项目的另一名员工的祖先。 例如，```
4 2
1 2 1 2
0 1 2 3
```项目 1 包含员工 1 和 3。他们的路径是`1`和`1 -> 2 -> 3`，所以项目 1 的答案是`3`， 不是`4`。 输出是`3 4`。 

CEO 也可以是项目的唯一成员。 为了```
1 1
1
0
```答案是`1`。 任何以边计数开始并忘记根本身的公式都将产生零。 

最后，一个项目可以在完全不同的分支中拥有成员。 在```
5 2
1 1 2 1 2
0 1 1 2 2
```项目 1 包含员工 1、2 和 4。其参与者是`{1, 2, 4}`，所以答案是`3`。 项目 2 包含员工 3 和 5，其路径给出`{1, 2, 3, 5}`，所以它的答案是`4`。 正确的输出是`3 4`。 

## 方法

 直接解决方案跟踪从该员工到所有经理的每个项目成员，并将每个被访问的员工插入到项目的集合中。 这是正确的，因为正是那些祖先应该参加。 问题在于重复行走的次数。 考虑一个由 (n) 名员工组成的链，其中每个员工都属于同一个项目。 第一个员工可能需要一个父步骤，接下来的两个步骤，依此类推，给出

 [
 1 + 2 + \cdots + (n-1) = \frac{n(n-1)}2 = O(n^2)
 ]

 父遍历。 对于 (n=10^6) 来说，这大约是 (5\cdot10^{11}) 次操作，远远超出了限制。 

有用的观察是，对于一个项目，我们不需要显式构建整个路径联合。 对 DFS 预购中的项目员工进行排序。 假设它们的顺序是 (v_1,v_2,\ldots,v_k)。 第一个员工从根部贡献了整个路径，其中包含`depth[v1] + 1`顶点。 之后，在添加(v_i)时，其根路径中已经被前一个项目成员覆盖的部分结束于

 [
 LCA(v_{i-1},v_i)。 
]

 因此，(v_i) 贡献的新顶点数为

 [
 深度[v_i]-深度[LCA(v_{i-1},v_i)]。 
]

 因此答案是

 [
 1+深度[v_1]
 +\sum_{i=2}^{k}
 \left(深度[v_i]-深度[LCA(v_{i-1},v_i)]\right)。 
]

 连续预序出现就足够的原因是子树在预序中形成连续的间隔。 当两个标记节点按前序分开时，它们之间的每个分支都由连续转换之一表示。 它们的 LCA 准确地解释了根路径重叠的部分。 

因此，我们只需要在每个项目的连续出现之间进行一次 LCA 查询。 总共最多有 (n-1) 个这样的查询。 

传统的二进制提升 LCA 将在每个 (O(\log n)) 中回答这些查询，并且需要 (O(n\log n)) 内存。 对于 (10^6) 个顶点，内存使用在 Python 中特别没有吸引力。 由于我们所有的 LCA 查询在前序遍历后都是已知的，因此我们可以使用 Tarjan 的离线 LCA 算法。 它在几乎线性时间和线性内存中使用不相交集结构一起回答所有这些查询。 

因此，完整的策略是按预序遍历层次结构一次，在具有相同项目的每对连续员工之间生成一个 LCA 查询，然后使用 Tarjan 离线 LCA 算法的迭代版本处理所有查询。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) | (O(n)) | (O(n)) | 太慢了 |
 | 最佳 | (O(n\alpha(n))) | (O(n)) | (O(n)) | 已接受 |

 这里 (\alpha(n)) 是反阿克曼函数，它增长得很慢，以至于在这个约束范围内它实际上是恒定的。 

## 算法演练

 1. 将父数组转换为有根子数组表示。 由于除了 CEO 之外，每个员工都只有一位经理，因此每个非根员工都可以插入到其经理的子级链表中。 我们使用数组而不是 Python 列表列表，因为一百万个嵌套的 Python 对象会消耗太多内存。 
2. 执行 CEO 的迭代 DFS。 当员工第一次进入时，记录其深度并检查其项目。 对于每个项目，保留`prev[project]`，预订单中最近遇到的该项目的员工。 
3. 如果当前员工是其项目的第一个出现，则使用以下命令初始化该项目的答案`depth[current] + 1`。 这计算了从首席执行官到第一个项目成员的完整路径。 
4. 如果该项目以前出现过，则在之间创建 LCA 查询`prev[project]`以及现任员工。 当前员工是预购中的较晚端点。 将查询存储在两个端点上，以便 Tarjan 的算法可以在任一端点完成时处理它。 然后更换`prev[project]`与现任员工。 
5. DFS 还记录后序序列。 我们需要第二次排序，因为 Tarjan 的离线 LCA 算法仅在处理完所有后代后才处理顶点。 
6. 初始化一个不相交集结构，每个员工一组。 对于每个集合，还维护其当前的树祖先。 联合操作在子进程完成后执行，与 Tarjan 算法完全相同。 按等级联合使 DSU 保持浅，而路径压缩使重复`find`运营几乎恒定的摊销时间。 
7. 按后序处理员工。 将当前员工标记为已处理。 对于附加到它的每个 LCA 查询，如果另一个端点已被处理，则 LCA 是`ancestor[find(other)]`。 此时，包含另一个端点的 DSU 组件准确地代表了 LCA 之前树的已完成部分。 
8. 对于稍后预购端点为`v`, 添加

 [
 深度[v]-深度[LCA]
 ]

 该项目的答案。 这正是通往的路径的一部分`v`之前的项目中尚未包含该内容。 

1. 处理完员工的询问后`u`，将其 DSU 组件与其父组件合并。 如果`u`是首席执行官，没有父级，处理结束。 否则，合并后，将新 DSU 代表的祖先设置为`parent[u]`。 

### 为什么它有效

 对于固定项目，令其预序员工为 (v_1,\ldots,v_k)。 (v_1) 的根路径贡献完全`depth[v1] + 1`顶点。 稍后再考虑 (v_i)。 由于 (v_{i-1}) 是前序中紧邻的前一个项目成员，因此 (v_i) 的根路径的已覆盖部分以 (LCA(v_{i-1},v_i)) 结束。 通往 (v_i) 的路径上 LCA 以下的所有内容都是新的，贡献完全一致`depth[v_i] - depth[LCA]`。 将这些不相交的新部分相加，每个参加的员工都只计算一次。 

Tarjan 的离线 LCA 不变量提供所需的 LCA 值。 当一个顶点被处理时，每个完成的子子树都已经被合并到其 DSU 组件中，但该组件尚未通过该顶点合并到其父级中。 因此，对于其他端点已被处理的查询，存储在该端点的 DSU 代表处的祖先恰好是两个查询端点的最低公共祖先。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    color = array('i', map(int, input().split()))

    # parent[v] is zero-based, -1 for the CEO.
    parent = array('i', (x - 1 for x in map(int, input().split())))

    # First-child linked lists.
    head = array('i', [-1]) * n
    nxt = array('i', [-1]) * n

    root = 0
    for v in range(n):
        p = parent[v]
        if p == -1:
            root = v
        else:
            nxt[v] = head[p]
            head[p] = v

    depth = array('i', [0]) * n

    # Last occurrence of every project in preorder.
    prev = array('i', [-1]) * (m + 1)

    # At most n-1 consecutive-occurrence queries exist.
    q_u = array('i', [0]) * n
    q_v = array('i', [0]) * n
    q1 = array('i', [-1]) * n
    q2 = array('i', [-1]) * n
    q_count = 0

    answer = array('i', [0]) * (m + 1)

    # Iterative DFS. head[u] is consumed as the current child iterator.
    stack = array('i', [root])
    postorder = array('i')

    # Enter the root.
    c = color[root]
    prev[c] = root
    answer[c] = 1

    while stack:
        u = stack[-1]
        e = head[u]

        if e == -1:
            stack.pop()
            postorder.append(u)
            continue

        # Consume this child edge.
        head[u] = nxt[e]
        v = e
        depth[v] = depth[u] + 1

        c = color[v]
        old = prev[c]

        if old == -1:
            answer[c] = depth[v] + 1
        else:
            qid = q_count
            q_count += 1

            q_u[qid] = old
            q_v[qid] = v

            if q1[old] == -1:
                q1[old] = qid
            else:
                q2[old] = qid

            if q1[v] == -1:
                q1[v] = qid
            else:
                q2[v] = qid

        prev[c] = v
        stack.append(v)

    # Tarjan offline LCA.
    dsu = array('i', range(n))
    ancestor = array('i', range(n))
    rank = bytearray(n)
    processed = bytearray(n)

    def find(x):
        r = x
        while dsu[r] != r:
            r = dsu[r]

        while dsu[x] != x:
            y = dsu[x]
            dsu[x] = r
            x = y

        return r

    for u in postorder:
        processed[u] = 1

        qid = q1[u]
        if qid != -1:
            v = q_v[qid] if q_u[qid] == u else q_u[qid]
            if processed[v]:
                r = find(v)
                lca = ancestor[r]
                cur = q_v[qid]
                answer[color[cur]] += depth[cur] - depth[lca]

        qid = q2[u]
        if qid != -1:
            v = q_v[qid] if q_u[qid] == u else q_u[qid]
            if processed[v]:
                r = find(v)
                lca = ancestor[r]
                cur = q_v[qid]
                answer[color[cur]] += depth[cur] - depth[lca]

        p = parent[u]
        if p != -1:
            ru = find(u)
            rp = find(p)

            if ru != rp:
                if rank[ru] < rank[rp]:
                    dsu[ru] = rp
                    new_root = rp
                elif rank[ru] > rank[rp]:
                    dsu[rp] = ru
                    new_root = ru
                else:
                    dsu[rp] = ru
                    rank[ru] += 1
                    new_root = ru

                ancestor[new_root] = p

    sys.stdout.write(' '.join(map(str, answer[1:])))

if __name__ == "__main__":
    solve()
```第一个输入行是正常读取的，而两个大数组是直接从迭代器构造的。 使用`array('i')`将每个整数保留为四个字节，而不是更大的 Python 整数表示形式。 当多个数组各自包含一百万个元素时，这种差异很重要。 

父数组立即转换为从零开始的索引。 首席执行官成为`-1`，它为唯一不应合并到另一个 DSU 组件中的顶点提供了一个方便的标记。 

子树用以下方式表示`head`和`nxt`。 对于每一位员工`v`,`nxt[v]`指向另一个孩子`parent[v]`。 DFS消耗`head[u]`作为其当前子指针，因此不需要单独的迭代器数组。 

预购 DFS 同时执行两项工作。 它计算深度并发现连续的项目发生，而相同的迭代遍历记录稍后需要的后序。 该堆栈仅包含顶点索引，避免了 Python 递归及其在 100 万员工的链上的失败。 

最多可以有 (n-1) 个 LCA 查询，因为每个项目的第一次出现不会创建查询。 每个顶点最多可以是两个此类查询的端点，一个将其连接到前一个出现，一个将其连接到下一个出现。 这允许`q1`和`q2`存储查询 ID，而无需为每个顶点构建大量 Python 对象列表。 

答案初始化为`depth[v] + 1`每个项目的第一次出现。 这`+1`当以 CEO 的深度为零来测量深度时，需要考虑员工本身。 

第二阶段迭代实现Tarjan的离线LCA算法。`processed[v]`扮演Tarjan的黑色角色。 仅当查询的另一个端点已被处理时才会得到答复。 此时，其 DSU 组件代表包含该端点的已完成分支，并且`ancestor[find(v)]`给出正确的 LCA。 

即使 DSU 表示树遍历，也会使用按等级并集。 集合的代表不必是实际的树祖先，因为`ancestor`分别记录哪个树顶点代表该组件的最高相关祖先。 这种区别使得标准近乎恒定时间的 DSU 得以保证。 

所有算术都适合有符号 32 位整数，因为每个项目答案最多为 (n\le10^6)。 Python 整数也可以安全地处理这些值，但紧凑的整数数组对于内存使用很有用。 

## 工作示例

 ### 示例 1

 层次结构是```
1
├── 3
│   ├── 4
│   └── 5
└── 2
    └── 6
```子插入顺序使实际的 DFS 预序`1, 3, 5, 4, 2, 6`。 项目发生情况和生成的 LCA 查询如下所示。 

| 预购位置 | 员工| 项目| 上一个相同的项目 | 新的初始贡献 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 1 | 无 | 1 |
 | 2 | 3 | 4 | 无 | 2 |
 | 3 | 5 | 2 | 无 | 3 |
 | 4 | 4 | 3 | 无 | 3 |
 | 5 | 2 | 2 | 5 | 0 |
 | 6 | 6 | 4 | 3 | 0 |

 对于项目 2，查询是`(5, 2)`。 他们的 LCA 是员工 1。员工 5 最初贡献了三个顶点，即`{1,3,5}`。 添加员工 2 贡献`depth[2] - depth[1] = 1`，有四名与会者。 

对于项目 4，查询是`(3, 6)`。 他们的 LCA 是员工 1。第一次出现贡献了两个顶点`{1,3}`，员工 6 从员工 1 的基础上贡献了两个额外级别，产生了四名参与者。 

最终的答案是`1 4 3 4`。 

### 自定义示例

 考虑```
5 2
1 1 2 1 2
0 1 1 2 2
```这棵树是```
1
├── 2
│   ├── 4
│   └── 5
└── 3
```可能的 DFS 预购是`1, 3, 2, 5, 4`。 相关状态是：

 | 员工| 项目| 上一个相同的项目 | LCA查询| 贡献|
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 无 | 无 | 1 |
 | 3 | 2 | 无 | 无 | 2 |
 | 2 | 1 | 1 |`(1,2)`| 1 |
 | 5 | 2 | 3 |`(3,5)`| 2 |
 | 4 | 1 | 2 |`(2,4)`| 1 |

 对于项目 1，第一位员工是 CEO，因此初始贡献为 1。 查询`(1,2)`具有 LCA 1 并贡献多一个顶点。 查询`(2,4)`具有 LCA 2 并贡献多一个顶点。 结果是`3`。 

对于项目 2，员工 3 做出贡献`{1,3}`，员工 5 贡献了 LCA 1 以下的路径，即`{2,5}`。 结果是`4`。 

输出是`3 4`。 此示例演示了为什么祖先-后代对不得导致整个路径被再次计数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n\alpha(n))) | DFS、查询构造和后序遍历是线性的，而 Tarjan 的 DSU 操作是摊销的 (O(\alpha(n)))。 |
 | 空间| (O(n)) | (O(n)) | 每个树、查询、遍历和 DSU 结构都使用线性大小的紧凑数组。 |

 约束 (n\le10^6) 使得线性存储器设计特别相关。 该实现以紧凑的形式存储整数数据`array`对象并使用迭代遍历，因此它避免了Python的递归调用堆栈和嵌套列表的大对象开销。 该算法仅对树执行恒定次数的遍历以及几乎恒定摊销的 DSU 操作。 

## 测试用例```python
import sys
import io
from array import array

def solve():
    n, m = map(int, input().split())
    color = array('i', map(int, input().split()))
    parent = array('i', (x - 1 for x in map(int, input().split())))

    head = array('i', [-1]) * n
    nxt = array('i', [-1]) * n

    root = 0
    for v in range(n):
        p = parent[v]
        if p == -1:
            root = v
        else:
            nxt[v] = head[p]
            head[p] = v

    depth = array('i', [0]) * n
    prev = array('i', [-1]) * (m + 1)
    answer = array('i', [0]) * (m + 1)

    q_u = array('i', [0]) * n
    q_v = array('i', [0]) * n
    q1 = array('i', [-1]) * n
    q2 = array('i', [-1]) * n
    q_count = 0

    stack = array('i', [root])
    postorder = array('i')

    c = color[root]
    prev[c] = root
    answer[c] = 1

    while stack:
        u = stack[-1]
        e = head[u]

        if e == -1:
            stack.pop()
            postorder.append(u)
            continue

        head[u] = nxt[e]
        v = e
        depth[v] = depth[u] + 1

        c = color[v]
        old = prev[c]

        if old == -1:
            answer[c] = depth[v] + 1
        else:
            qid = q_count
            q_count += 1

            q_u[qid] = old
            q_v[qid] = v

            if q1[old] == -1:
                q1[old] = qid
            else:
                q2[old] = qid

            if q1[v] == -1:
                q1[v] = qid
            else:
                q2[v] = qid

        prev[c] = v
        stack.append(v)

    dsu = array('i', range(n))
    ancestor = array('i', range(n))
    rank = bytearray(n)
    processed = bytearray(n)

    def find(x):
        r = x
        while dsu[r] != r:
            r = dsu[r]

        while dsu[x] != x:
            y = dsu[x]
            dsu[x] = r
            x = y

        return r

    for u in postorder:
        processed[u] = 1

        for qid in (q1[u], q2[u]):
            if qid == -1:
                continue

            v = q_v[qid] if q_u[qid] == u else q_u[qid]

            if processed[v]:
                lca = ancestor[find(v)]
                cur = q_v[qid]
                answer[color[cur]] += depth[cur] - depth[lca]

        p = parent[u]
        if p != -1:
            ru = find(u)
            rp = find(p)

            if ru != rp:
                if rank[ru] < rank[rp]:
                    dsu[ru] = rp
                    new_root = rp
                elif rank[ru] > rank[rp]:
                    dsu[rp] = ru
                    new_root = ru
                else:
                    dsu[rp] = ru
                    rank[ru] += 1
                    new_root = ru

                ancestor[new_root] = p

    sys.stdout.write(' '.join(map(str, answer[1:])))

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input

    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    try:
        solve()
        return ""
    finally:
        sys.stdin = old_stdin
        input = old_input

# Provided sample.
sample1 = """\
6 4
1 2 4 3 2 4
0 1 1 3 3 2
"""

# The helper above writes directly to stdout in solve(), so capture it.
def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout
        input = old_input

assert run(sample1) == "1 4 3 4", "sample 1"

assert run("""\
1 1
1
0
""") == "1", "single employee"

assert run("""\
4 1
1 1 1 1
0 1 2 3
""") == "4", "all employees same project"

assert run("""\
4 2
1 2 1 2
0 1 2 3
""") == "3 4", "ancestor-descendant overlap"

assert run("""\
5 2
1 1 2 1 2
0 1 1 2 2
""") == "3 4", "different branches"

# Maximum-size shape, one project, one million employees in a chain.
n = 1_000_000
colors = "1 " * (n - 1) + "1"
parents = "0 " + " ".join(map(str, range(1, n)))
max_case = f"{n} 1\n{colors}\n{parents}\n"

assert run(max_case) == "1000000", "maximum-size chain"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 1 / 0`|`1`| 最小规模的树和仅限 CEO 的项目 |
 |`4 1 / 1 1 1 1 / 0 1 2 3`|`4`| 所有员工共享一个项目，每条路径都有重叠 |
 |`4 2 / 1 2 1 2 / 0 1 2 3`|`3 4`| 祖先-后代重叠和边界深度|
 |`5 2 / 1 1 2 1 2 / 0 1 1 2 2`|`3 4`| 不同分支机构的项目成员 |
 | 百万员工一项目形成链条|`1000000`| 最大限度`n`、长深度、迭代 DFS 和线性内存 |

 ## 边缘情况

 对于单一员工的情况```
1 1
1
0
```CEO也是唯一的项目成员。 在前序遍历期间，项目 1 之前没有出现过，因此其答案被初始化为`depth[1] + 1 = 1`。 没有 LCA 查询，CEO 也没有可以合并的母公司。 结果是`1`。 

对于全平等链```
4 1
1 1 1 1
0 1 2 3
```预购是`1,2,3,4`。 第一次出现贡献一个顶点。 连续的查询是`(1,2)`,`(2,3)`， 和`(3,4)`。 他们的LCA分别是`1`,`2`， 和`3`，因此每个查询都会贡献一个新顶点。 答案就变成了`1+1+1+1=4`。 即使每个项目成员都位于同一根路径上，也不会计算两次员工。 

对于祖先-后代重叠，```
4 2
1 2 1 2
0 1 2 3
```项目 1 发生在员工 1 和 3 处。第一次发生贡献员工 1。员工 1 和 3 的 LCA 是员工 1，因此第二次发生贡献员工`depth[3] - depth[1] = 2`。 答案是`3`，对应员工`{1,2,3}`。 项目 2 同样涵盖了所有四名员工，`4`。 

对于不同分会的会员来说，```
5 2
1 1 2 1 2
0 1 1 2 2
```项目 2 有员工 3 和 5。他们的 LCA 是员工 1。第一个成员贡献两个顶点，`{1,3}`，第二个贡献`depth[5] - depth[1] = 2`，添加`{2,5}`。 结果是`4`。 即使两个项目成员都需要该 CEO，共享的 CEO 也会被计算一次。 

对于最大深度的情况，百万员工的链，既强调遍历深度，又强调内存。 该实现从不递归调用 DFS，因此 Python 递归限制无关紧要。 每个员工仅贡献恒定数量的紧凑数组，Tarjan 的 DSU 处理连续的项目查询，而无需构建 (O(n\log n)) 祖先表。 对于包含每个员工的单个项目，根路径的并集是整个链，因此答案正是`1000000`。
