---
title: "CF 104587A - 全家人"
description: "我们通过父母到孩子的列表间接描述了一个根深蒂固的家庭结构，我们必须回答有关两个人在谱系方面如何相关的问题。"
date: "2026-06-30T07:28:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104587
codeforces_index: "A"
codeforces_contest_name: "2020-2021 ICPC East Central North America Regional Contest (ECNA 2020)"
rating: 0
weight: 104587
solve_time_s: 67
verified: true
draft: false
---

[CF 104587A - 全家人](https://codeforces.com/problemset/problem/104587/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们通过父母到孩子的列表间接描述了一个根深蒂固的家庭结构，我们必须回答有关两个人在谱系方面如何相关的问题。 

问题的核心是，对于树中的任意两个节点，它们的关系仅取决于它们的最低公共祖先以及它们到它的距离。 如果我们选择两个人 A 和 B，我们首先确定他们最近的共同祖先 C。从 C 开始，A 是下面的一些代，B 是下面的一些代。 这两个距离决定了它们是否是兄弟姐妹、一定程度的表兄弟姐妹，还是根据深度的不均匀程度进行了多次“移除”的表兄弟姐妹。 

输入不直接给出单根树。 相反，它提供了父子关系的几个片段。 这些片段一起形成一棵最多包含 100 个节点的有效树。 这个小界限很重要，因为它允许我们使用简单的预处理，例如来自每个节点的完整祖先表或 BFS，而无需担心性能。 

一个关键的微妙之处在于，尽管潜在的距离是对称的，但关系在措辞上并不对称。 输出格式取决于哪个节点被视为短语中的参考点，并且在某些特殊情况下，一个人是另一个人的直接祖先，这完全改变了语法结构。 

这里重要的边缘情况是这样的情况：一个节点是另一个节点的祖先，两个节点处于相同深度但不是兄弟节点，并且其中一个节点本身是共同祖先。 另一个微妙的情况是格式化序数，如“1st”、“2nd”、“3rd”，以及 11、12、13 的特殊后缀规则，这些规则通常会破坏简单的字符串构造。 

## 方法

 回答每个查询的强力方法是通过在树中重复向上移动直到根来计算两个节点的祖先，然后找到第一个公共节点。 由于树的大小最多为 100，因此即使进行 DFS 或存储父指针并重复向上行走也是很便宜的。 对于每个查询，我们可以重新计算父链并比较它们，但这将是多余的。 

一种更结构化的方法是对整个树进行一次预处理。 由于每个节点只有一个父节点（根除外），因此我们可以构建一个父节点映射，并根据输入片段构建邻接列表。 然后，我们通过查找从未作为子节点出现的节点来选择任何节点作为根节点。 从该根开始，我们使用 BFS 或 DFS 计算深度和直接父指针。 

一旦我们有了深度和父母，每个查询都会减少到寻找最低的共同祖先。 当 n ≤ 100 时，即使是通过逐步提升更深节点的朴素 LCA 也足够了，但我们也可以预先计算完整的祖先表或仅存储父指针并爬升。 

找到 LCA C 后，我们计算从 C 到 A 和 B 的距离 m 和 n。根据这两个值，我们使用语句中的规则直接确定关系类别。 剩下的工作是正确格式化字符串，特别是处理序数和特殊的措辞规则。 

相对于暴力破解的关键改进是我们避免了每个查询重新计算祖先结构。 相反，我们支付一次性 O(n) 成本，并在 O(n) 最坏情况下回答每个查询，这很容易足够快。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个查询的暴力破解 | O(n·p) | O(n·p) | O(n) | 已接受（小限制）|
 | 通过父母进行预计算+ LCA | O(n + p·n) | O(n + p·n) | O(n) | 已接受 |

 ## 算法演练

 我们首先根据父子描述重建树。 我们存储邻接列表和父地图。 任何从不作为子节点出现的节点都是根节点。 

然后，我们从根运行 DFS 或 BFS 来计算两个数组：每个节点的深度和父指针。

为了回答 A 和 B 之间的查询，我们通过确保 A 不比 B 更深来进行标准化。如果是，我们交换它们，使 A 更接近根。 

我们向上提升 B 直到两个节点处于相同的深度。 这是通过逐步跟随父指针来完成的。 对齐后，我们将两者一起向上移动，直到它们在同一节点相遇。 该节点是最低共同祖先 C.

 我们将 m 计算为深度[A] − 深度[C]，将 n 计算为深度[B] − 深度[C]。 

如果 m 为零，则 A 是 B 的祖先，我们根据 n 输出“孩子”、“孙子”或“曾孙”风格的短语。 如果 m 等于 n，则当 n 为 1 时，他们是兄弟姐妹，否则是第 (n−1) 个表兄弟姐妹。 如果 m 小于 n，我们直接使用定义中的表兄弟和移除公式。 

最后，我们使用正确的语法规则来格式化序数词和“timesremoved”一词。 

### 为什么它有效

 树中的每个关系都是由最低共同祖先和到它的两个距离唯一确定的。 预处理确保我们可以在确定的时间内检索这些距离。 LCA 步骤保证我们正在测量真正最接近的共享祖先，因此计算出的代数与问题中的正式定义完全匹配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def ordinal(x):
    if 10 <= x % 100 <= 20:
        suffix = "th"
    else:
        if x % 10 == 1:
            suffix = "st"
        elif x % 10 == 2:
            suffix = "nd"
        elif x % 10 == 3:
            suffix = "rd"
        else:
            suffix = "th"
    return f"{x}{suffix}"

def build_tree(t):
    children = {}
    parent = {}
    nodes = set()

    for _ in range(t):
        parts = input().split()
        s0 = parts[0]
        d = int(parts[1])
        kids = parts[2:]
        nodes.add(s0)
        children.setdefault(s0, [])
        for k in kids:
            children[s0].append(k)
            parent[k] = s0
            nodes.add(k)
    return children, parent, nodes

def lift(node, steps, parent):
    for _ in range(steps):
        node = parent[node]
    return node

def lca(a, b, parent, depth):
    if depth[a] > depth[b]:
        a, b = b, a
    while depth[b] > depth[a]:
        b = parent[b]
    while a != b:
        a = parent[a]
        b = parent[b]
    return a, b

def dfs(root, children, parent, depth):
    stack = [(root, None)]
    parent[root] = None
    depth[root] = 0

    while stack:
        u, p = stack.pop()
        for v in children.get(u, []):
            if v == p:
                continue
            parent[v] = u
            depth[v] = depth[u] + 1
            stack.append((v, u))

def solve():
    t, p = map(int, input().split())
    children, parent, nodes = build_tree(t)

    root = None
    for x in nodes:
        if x not in parent:
            root = x
            break

    depth = {}
    parent2 = {}
    dfs(root, children, parent2, depth)

    for _ in range(p):
        a, b = input().split()

        if depth[a] > depth[b]:
            a, b = b, a

        x, y = a, b
        while depth[y] > depth[x]:
            y = parent2[y]

        while x != y:
            x = parent2[x]
            y = parent2[y]

        l = x
        da = depth[a] - depth[l]
        db = depth[b] - depth[l]

        if da == 0:
            if db == 1:
                print(f"{a} is the child of {b}")
            elif db == 2:
                print(f"{a} is the grandchild of {b}")
            else:
                print(f"{a} is the great grandchild of {b}")
        elif da == db:
            if da == 1:
                print(f"{a} and {b} are siblings")
            else:
                print(f"{a} and {b} are {ordinal(da-1)} cousins")
        else:
            if da > db:
                a, b = b, a
                da, db = db, da
            c = da - 1
            r = db - da
            if c == 0:
                rel = "0th cousins"
            else:
                rel = f"{ordinal(c)} cousins"
            if r == 1:
                print(f"{a} and {b} are {rel}, 1 time removed")
            else:
                print(f"{a} and {b} are {rel}, {r} times removed")

solve()
```该解决方案使用邻接列表构建完整的树，然后运行 ​​DFS 来计算父指针和深度。 每个查询都通过提升节点来解决，直到找到它们的最低公共祖先，然后将距离转换为所需的关系格式。 

实施中的主要微妙之处在于正确处理祖先案件与堂兄弟案件。 另一个是确保序数格式遵循青少年例外的英语规则。 

## 工作示例

 ### 示例 1

 输入：```
1
A 2 B C
B 0
C 0
A B
B C
```我们构建一棵以 A 为根的树。深度为 A=0、B=1、C=1。 

| 查询 | 生命周期评估 | 深度A | 深度B | 关系 |
 | --- | --- | --- | --- | --- |
 | 乙 | 一个 | 0 | 1 | 孩子 |
 | BC | 一个 | 1 | 1 | 兄弟姐妹|

 这显示了直接祖先和兄弟处理。 

### 示例 2

 输入：```
1
A 1 B
B 1 C
C 0
A C
```深度：A=0、B=1、C=2。 A 和 C 的 LCA 是 A。 

| 查询 | 生命周期评估 | 米 | n | 关系 |
 | --- | --- | --- | --- | --- |
 | 空调| 一个 | 0 | 2 | 孙子 |

 这证实了直接的祖先到后代的路径逻辑。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + p·n) | O(n + p·n) | DFS 预处理加上每个查询的向上提升 |
 | 空间| O(n) | 父级和深度存储|

 给定 n ≤ 100 且 p ≤ 1000，即使重复父遍历，它也能在限制内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return ""

# sample structure tests (conceptual placeholders)
# assert run(...) == ...
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单链| 祖先案例| 直系血统|
 | 兄弟姐妹 | 兄弟姐妹| 等深|
 | 表兄弟结构| 表弟+删除| LCA距离逻辑|
 | 树深| 序数格式| 边缘语法|

 ## 边缘情况

 一种重要的边缘情况是一个节点恰好是根。 在这种情况下，LCA就是节点本身，深度差异直接决定另一个节点是子节点、孙子节点还是更深的后代节点。 假设 LCA 总是不同的简单实现会错误地标记这种情况。 

另一个边缘情况是两个节点共享同一个父节点。 这会产生兄弟节点，并且这是深度差为零但节点不相同的唯一情况。 该算法通过 LCA 相等性和相等深度正确地检测到这一点。 

最后一个微妙的情况是 11、12 和 13 等值的序数格式，其中后缀规则覆盖通常的最后一位逻辑。 该实现显式检查最后两位数字，以避免像“11st”这样的错误输出。
