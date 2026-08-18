---
title: "CF 102249D - 树木即服务"
description: "我们需要在顶点 1 ... N 上构造一棵有根树。每个要求都具有 (x, y, z) 的形式，这意味着当我们从 x 和 y 向上走时，它们的第一个公共顶点必须恰好是 z。"
date: "2026-08-17T21:56:20+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102249
codeforces_index: "D"
codeforces_contest_name: "2019 Facebook Hacker Cup, Qualification Round"
rating: 0
weight: 102249
solve_time_s: 264
verified: true
draft: false
---

[CF 102249D - 树即服务](https://codeforces.com/problemset/problem/102249/D)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 24s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要在顶点上构造一棵有根树`1 ... N`。 每个需求都有形式`(x, y, z)`，这意味着当我们从`x`和`y`，它们的第一个公共顶点必须恰好是`z`。 我们可以为每个顶点选择任何父节点，只要生成的父指针描述一棵有根树并且满足每个要求即可。 

输出给出每个顶点的父顶点。 恰好有一个顶点有父顶点`0`，这是根。 由于该问题接受任何有效的树，因此两个不同的父数组都可以是正确的。 

限制故意很小。 最多有 60 个顶点和 120 个要求，因此算法围绕`O(NM + N^2)`很容易足够快。 小的`N`还允许我们在递归分割顶点集时重复使用简单的不相交集结构。 排除的是对有根标记树的详尽枚举，其数量为`N^(N-1)`。 在`N = 60`，这大约是`10^105`，所以即使很快检查一个候选者也是无用的。 

有几种边缘情况很容易被错误处理。 

首先，LCA可以是两个被查询的顶点之一。 例如，```
2 1
1 2 1
```是有效的。 顶点`1`是顶点的祖先`2`，所以 LCA 是`1`，父数组可以是`0 1`。 始终假设的构造`z`必须不同于`x`和`y`会错误地拒绝此案。 

其次，选择任意根并不安全。 为了```
3 1
1 2 3
```唯一可能的根是`3`， 因为`3`必须是两者的祖先`1`和`2`。 选择`1`因为 root 立即使该要求变得不可能。 该构造必须标识一个不强制在当前集合内具有祖先的顶点。 

第三，几个要求可以强制祖先关系中的循环。 考虑```
3 3
1 2 2
2 3 3
3 1 1
```第一个要求力量`2`多于`1`, 第二力`3`多于`2`，以及第三力`1`多于`3`。 没有根树可以包含所有这三个关系，所以答案是`Impossible`。 

最后，LCA 等于当前根的要求是分离约束，而不是分组约束。 例如，```
3 2
1 2 3
1 3 1
```不能通过简单地将每个三元组分组在一起来处理。 第一个要求是想要`1`和`2`在不同的子树中`3`，而第二个说`1`是的祖先`3`。 这些要求是冲突的。 将每个需求视为普通的联合操作将失去“必须在一起”和“必须分开”之间的区别。 

## 方法

 蛮力方法在概念上很简单。 枚举上每一个有根树`N`标记顶点，计算每个查询对的 LCA，并保持第一棵树满足所有要求。 有`N^(N-1)`有根标记的树。 即使在考虑验证之前，最坏的情况`N = 60`是`60^59`， 大约`10^105`候选人。 检查`M`要求与`O(N)`LCA 计算将使工作变得粗略`O(N^(N-1)MN)`，这是完全不可行的。 

有用的观察结果是，一项 LCA 要求包含两种不同类型的信息。 

如果`LCA(x, y) = z`， 然后`z`必须是两者的祖先`x`和`y`。 如果`z`不是当前子树的根，那么`x`,`y`， 和`z`必须全部保留在该根的同一子子树内。 它们永远不能被分成不同的子子树。 

另一方面，如果`z`是当前子树的根，那么`x`和`y`必须属于不同的子子树，除非其中之一是根本身。 否则他们的 LCA 将低于`z`。 

这给了我们一个递归分区过程。 选择合适的根`r`对于当前的顶点集。 使用不相交集联合结构来合并被迫保留在同一子子树中的顶点`r`。 然后每个结果组件成为一个子子树`r`。 LCA 为的要求`r`通过要求两个非根端点落在不同的组件中来进行检查。 然后将相同的过程独立地应用于每个组件。 

根本身不能是任意的。 对于每一个要求`LCA(x, y) = z`， 如果`x != z`， 然后`z`力量`x`低于`z`; 同样，如果`y != z`， 然后`z`力量`y`低于`z`。 因此，当前集合的有效根必须没有来自该集合中另一个顶点的强制祖先边。 这样的顶点是强制祖先关系的最小元素。 

我们不需要尝试每个最小顶点的原因是这些约束的一个有用属性。 一旦集合被分割成子组件，完全包含在一个组件中的约束就独立于其他组件中所做的选择。 如果无法构造某个组件，则更改上面选择的根不能使这些相同的约束同时消失。 竞赛讨论在采用包含失败顶点子集的最小子树方面给出了相同的理由。 

蛮力方法之所以有效，是因为它明确地尝试了所有可能的层次结构。 它失败了，因为层次结构的数量巨大。 每个 LCA 要求要么强制顶点进入同一子子树，要么强制它们进入不同的子子树，这一观察结果将问题简化为重复分区，这是多项式的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(N^(N-1) M N)`|`O(N)`| 太慢了 |
 | 递归 DSU 分区 |`O(NM + N^2 α(N))`|`O(N^2)`| 已接受 |

 ## 算法演练

 1. 存储每一个需求`(x, y, z)`并将其解释为两个可能的祖先关系，`z -> x`什么时候`x != z`和`z -> y`什么时候`y != z`。 这些关系告诉我们哪些顶点不能被选择作为同一当前子树的根。 
2. 从完整的顶点集开始`{1, ..., N}`并为其递归构造一棵树。 递归调用接收一个集合`S`其顶点应该形成一棵连通的有根子树。 
3. 在选择根之前，检查每一个需求，其`z`属于`S`。 如果`z`在里面`S`， 两个都`x`和`y`也必须在里面`S`， 因为`z`是他们的祖先。 如果一个端点已放置在外部`S`，施工是不可能的。 
4. 找到一个顶点`r`在`S`没有来自另一个顶点的强制传入边`S`。 换句话说，不能有任何要求`z != r`和`x = r`，并且没有要求`z != r`和`y = r`。 这样的顶点可以作为该子树的根。 如果不存在这样的顶点，则强制祖先关系包含循环，因此答案是不可能的。 
5. 创建一个包含所有顶点的DSU`S`。 对于每一个要求`(x, y, z)`完全包含在`S`和`z != r`, 合并`x`,`y`， 和`z`。 自从`r`上面是`z`，所有三个顶点必须位于同一个子节点下方`r`。 完全按照要求合并所有三个记录。 
6. 现在检查每个要求`(x, y, r)`。 如果两个端点都不是`r`，它们的 DSU 组件必须不同。 如果它们位于同一组件中，则两者将位于同一子子树中`r`，使其 LCA 严格低于`r`。 如果一个端点是`r`，自动满足要求，因为根和任何后代的 LCA 都是根。 
7. DSU 组件如下`S - {r}`现在是子树`r`。 对于每个组件，递归地构建其树。 如果递归构造返回 root`v`， 放`parent[v] = r`。 
8. 如果递归调用仅包含一个顶点，则该顶点是该子树的根并且不需要进一步的工作。 处理完每个组件后，返回`r`给来电者。 
9. 构造完整树后，父数组恰好包含一个`0`、根，并且每个其他顶点都有一个父顶点。 可以选择通过重新计算每个需求的 LCA 来验证构造。 这仅需花费`O(MN)`并且作为防御性实施检查很有用。 

### 为什么它有效

 关键的不变量是每个递归集`S`代表最终树的一个子树，并且其LCA位于的每个需求`S`它的所有三个顶点都在里面`S`。 

假设当前根是`r`。 对于一个需求`(x, y, z)`和`z != r`, 顶点`z`正好低于 的一个子项`r`。 自从`z`必须是两者的祖先`x`和`y`，所有三个顶点必须位于同一个子项下方。 DSU 将它们合并，因此构造永远不会分离必须保持在一起的顶点。 

对于一个需求`(x, y, r)`，LCA 必须恰好是当前根。 因此`x`和`y`必须占用不同的子组件，并且 DSU 检查恰恰拒绝它们在一起的情况。 

经过这些检查后，每个 DSU 组件都可以安全地成为`r`。 属于不同组件的需求不能将 LCA 严格限制在其中一个组件内，因为这样的需求会迫使其所有三个顶点进入同一组件。 因此，递归问题是独立的。 

根选择规则可防止将顶点放置在已需要作为其祖先的顶点之上。 如果强制祖先图有环，则不存在有效根。 如果实例可行，则重复采用最小顶点并按约束进行分区可以保留可行性，因此不需要对根选择进行回溯。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, nodes):
        self.parent = {v: v for v in nodes}
        self.size = {v: 1 for v in nodes}

    def find(self, x):
        p = self.parent[x]
        if p != x:
            self.parent[x] = self.find(p)
        return self.parent[x]

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return

        if self.size[a] < self.size[b]:
            a, b = b, a

        self.parent[b] = a
        self.size[a] += self.size[b]

def construct_tree(n, constraints):
    parent = [-1] * (n + 1)

    def build(nodes):
        if len(nodes) == 1:
            return nodes[0]

        inside = set(nodes)

        # Every constraint whose LCA is inside this subtree
        # must have all of its vertices inside it.
        for x, y, z in constraints:
            if z in inside and (x not in inside or y not in inside):
                return -1

        # Find a minimal vertex in the forced ancestor relation.
        incoming = {v: False for v in nodes}

        for x, y, z in constraints:
            if z not in inside:
                continue

            if x in inside and x != z:
                incoming[x] = True
            if y in inside and y != z:
                incoming[y] = True

        root = -1
        for v in nodes:
            if not incoming[v]:
                root = v
                break

        if root == -1:
            return -1

        dsu = DSU(nodes)

        # If the current root is r and z != r, then x, y, z
        # must all lie in the same child subtree of r.
        for x, y, z in constraints:
            if z not in inside or z == root:
                continue

            dsu.union(x, y)
            dsu.union(x, z)

        # If z is the current root, x and y must be in
        # different child subtrees unless one of them is root.
        for x, y, z in constraints:
            if z != root:
                continue

            if x == root or y == root:
                continue

            if dsu.find(x) == dsu.find(y):
                return -1

        # Build the DSU components excluding the root.
        groups = {}

        for v in nodes:
            if v == root:
                continue

            r = dsu.find(v)
            groups.setdefault(r, []).append(v)

        # Every component becomes one child subtree of root.
        for component in groups.values():
            child_root = build(component)
            if child_root == -1:
                return -1
            parent[child_root] = root

        return root

    root = build(list(range(1, n + 1)))

    if root == -1:
        return None

    parent[root] = 0
    return parent[1:]

def lca(parent, a, b):
    ancestors = set()

    while a != 0:
        ancestors.add(a)
        a = parent[a]

    while b != 0:
        if b in ancestors:
            return b
        b = parent[b]

    return 0

def valid_tree(parent, constraints):
    n = len(parent)
    if parent.count(0) != 1:
        return False

    # Check that every parent pointer stays inside the vertex range.
    for p in parent:
        if p < 0 or p > n:
            return False

    # Check that the parent pointers contain no cycle.
    for v in range(1, n + 1):
        seen = set()
        u = v

        while u != 0:
            if u in seen:
                return False
            seen.add(u)
            u = parent[u]

    for x, y, z in constraints:
        if lca(parent, x, y) != z:
            return False

    return True

def solve_case(n, constraints):
    answer = construct_tree(n, constraints)

    if answer is None:
        return None

    # Defensive verification. The construction itself is sufficient,
    # but this catches implementation mistakes without changing
    # the asymptotic complexity.
    if not valid_tree(answer, constraints):
        return None

    return answer

def main():
    t = int(input())
    out = []

    for case_id in range(1, t + 1):
        n, m = map(int, input().split())
        constraints = [
            tuple(map(int, input().split()))
            for _ in range(m)
        ]

        answer = solve_case(n, constraints)

        if answer is None:
            out.append(f"Case #{case_id}: Impossible")
        else:
            out.append(
                f"Case #{case_id}: " +
                " ".join(map(str, answer))
            )

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```这`DSU`类对于每个递归调用都是本地的，因为组件仅相对于当前子树才有意义。 路径压缩不断重复`find`对于这些约束，操作实际上是恒定的。 

这`build`函数首先检查 LCA 属于当前集合的需求是否未到达该集合之外。 这个条件直接来自祖先：如果`z`在子树内部，两个查询的顶点必须是子树的后代`z`，因此它们也必须位于子树内部。 

这`incoming`数组记录强制祖先关系。 什么时候`z != x`，要求说的是`z`必须在上面`x`， 所以`x`不能是当前根。 同样的推理也适用于`y`。 自我关系，例如`LCA(x, y) = x`不标记`x`具有传入边，因为`x`被允许成为的祖先`y`。 

第一个 DSU 遍仅处理 LCA 不是当前根的需求。 之间的区别`z != root`和`z == root`是必不可少的。 前者意味着三个顶点必须在一个子节点下方保持在一起`root`; 后者意味着两个查询的端点必须分开`root`。 

仅在检查了涉及当前根的所有约束后才构建组。 每个组都保证通过“必须保持在一起”关系进行内部连接，并将其递归构造的根直接放置在当前根的下方，为该组创建一个子子树。 

最终验证使用祖先集来计算每个 LCA`O(N)`。 Python不存在整数溢出问题，递归深度最多为`N`，只有 60。该代码始终使用从 1 开始的顶点编号，并仅在输出边界处将最终父数组转换为从 0 开始的 Python 列表。 

## 工作示例

 ### 示例 1

 输入是```
3 1
1 2 3
```有一个要求，`LCA(1, 2) = 3`。 

| 当前设置 | 强制传入边缘| 选择根| 分组后的DSU组件| 分离检查 |
 | --- | --- | --- | --- | --- |
 |`{1,2,3}`|`3 -> 1`,`3 -> 2`|`3`|`{1}`,`{2}`|`1`和`2`是不同的|

 唯一没有强制传入边的顶点是`3`，所以它成为根。 因为要求有`z = 3`，端点`1`和`2`必须位于不同的子组件中。 他们已经分开了，所以都成为了孩子`3`。 

生成的父数组是`3 3 0`，匹配示例输出。 

### 示例 2

 输入是```
3 3
1 2 2
2 3 3
3 1 1
```强制祖先关系是：

 | 要求 | 强迫关系|
 | --- | --- |
 |`LCA(1,2)=2`|`2 -> 1`|
 |`LCA(2,3)=3`|`3 -> 2`|
 |`LCA(3,1)=1`|`1 -> 3`|

 根搜索发现每个顶点都有一个传入的强制关系。 

| 顶点| 强制祖先传入|
 | --- | --- |
 |`1`|`2`,`1`|
 |`2`|`3`|
 |`3`|`1`|

 没有可能的根，所以构造立即返回`Impossible`。 

该迹线说明了为什么仅检查局部 LCA 方程是不够的。 这些方程共同强加了循环祖先关系，没有有根树可以表示这种关系。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(NM + N^2 α(N))`| 最多`N`递归调用扫描`M`约束，并且 DSU 在所有递归级别上的工作受以下限制`O(N^2 α(N))`。 最终验证添加`O(MN)`。 |
 | 空间|`O(N^2)`| 递归调用和临时顶点集可以占用`O(N^2)`最坏情况下的空间，而约束列表和父数组使用`O(M + N)`。 |

 和`N <= 60`和`M <= 120`，即使是简单的二次因子也很小。 在最坏的结构情况下，该算法在每个测试用例中仅执行数十万次原始操作，远远低于有根树的指数枚举所需的操作。 

## 测试用例

 在某些情况下，该示例具有多个有效输出，因此比较完整输出字符串的断言将不必要地严格。 相反，以下测试工具断言每个报告的树都是有效的，并且两个不可能的示例案例实际上被拒绝。```python
import sys
import io

class DSU:
    def __init__(self, nodes):
        self.parent = {v: v for v in nodes}
        self.size = {v: 1 for v in nodes}

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)
        if a == b:
            return
        if self.size[a] < self.size[b]:
            a, b = b, a
        self.parent[b] = a
        self.size[a] += self.size[b]

def solve_case(n, constraints):
    parent = [-1] * (n + 1)

    def build(nodes):
        if len(nodes) == 1:
            return nodes[0]

        inside = set(nodes)

        for x, y, z in constraints:
            if z in inside and (x not in inside or y not in inside):
                return -1

        incoming = {v: False for v in nodes}

        for x, y, z in constraints:
            if z not in inside:
                continue
            if x in inside and x != z:
                incoming[x] = True
            if y in inside and y != z:
                incoming[y] = True

        root = -1
        for v in nodes:
            if not incoming[v]:
                root = v
                break

        if root == -1:
            return -1

        dsu = DSU(nodes)

        for x, y, z in constraints:
            if z in inside and z != root:
                dsu.union(x, y)
                dsu.union(x, z)

        for x, y, z in constraints:
            if z == root and x != root and y != root:
                if dsu.find(x) == dsu.find(y):
                    return -1

        groups = {}
        for v in nodes:
            if v == root:
                continue
            r = dsu.find(v)
            groups.setdefault(r, []).append(v)

        for component in groups.values():
            child_root = build(component)
            if child_root == -1:
                return -1
            parent[child_root] = root

        return root

    root = build(list(range(1, n + 1)))
    if root == -1:
        return None

    parent[root] = 0
    return parent[1:]

def lca(parent, a, b):
    seen = set()

    while a != 0:
        seen.add(a)
        a = parent[a]

    while b != 0:
        if b in seen:
            return b
        b = parent[b]

    return 0

def valid_answer(n, constraints, answer):
    if answer is None:
        return False

    if len(answer) != n:
        return False

    if answer.count(0) != 1:
        return False

    for i, p in enumerate(answer, 1):
        if p < 0 or p > n or p == i:
            return False

    for v in range(1, n + 1):
        seen = set()
        u = v
        while u != 0:
            if u in seen:
                return False
            seen.add(u)
            u = answer[u - 1]

    for x, y, z in constraints:
        if lca(answer, x, y) != z:
            return False

    return True

def run(inp: str) -> str:
    data = io.StringIO(inp)
    t = int(data.readline())
    outputs = []

    for case_id in range(1, t + 1):
        n, m = map(int, data.readline().split())
        constraints = [
            tuple(map(int, data.readline().split()))
            for _ in range(m)
        ]

        answer = solve_case(n, constraints)

        if answer is None:
            outputs.append(f"Case #{case_id}: Impossible")
        else:
            outputs.append(
                f"Case #{case_id}: " +
                " ".join(map(str, answer))
            )

    return "\n".join(outputs)

def parse_outputs(out):
    return out.strip().splitlines()

def check_case(line, case_id, n, constraints, must_be_impossible=False):
    prefix = f"Case #{case_id}: "
    assert line.startswith(prefix), line

    body = line[len(prefix):]

    if must_be_impossible:
        assert body == "Impossible", line
        return

    assert body != "Impossible", line
    answer = list(map(int, body.split()))
    assert valid_answer(n, constraints, answer), line

# Provided samples
sample = """6
3 1
1 2 3
3 3
1 2 2
2 3 3
3 1 1
4 2
2 1 2
1 4 3
6 3
2 4 3
6 5 4
1 2 6
7 4
7 3 5
4 1 2
6 3 6
6 4 5
12 9
1 5 7
11 2 6
9 4 12
8 12 6
10 1 7
4 3 12
3 10 6
8 11 8
2 5 10
"""

out = parse_outputs(run(sample))
assert len(out) == 6

check_case(out[0], 1, 3, [(1, 2, 3)])
check_case(
    out[1], 2, 3,
    [(1, 2, 2), (2, 3, 3), (3, 1, 1)],
    must_be_impossible=True
)
check_case(
    out[2], 3, 4,
    [(2, 1, 2), (1, 4, 3)]
)
check_case(
    out[3], 4, 6,
    [(2, 4, 3), (6, 5, 4), (1, 2, 6)],
    must_be_impossible=True
)
check_case(
    out[4], 5, 7,
    [(7, 3, 5), (4, 1, 2), (6, 3, 6), (6, 4, 5)]
)
check_case(
    out[5], 6, 12,
    [
        (1, 5, 7), (11, 2, 6), (9, 4, 12),
        (8, 12, 6), (10, 1, 7), (4, 3, 12),
        (3, 10, 6), (8, 11, 8), (2, 5, 10)
    ]
)

# Minimum-size input.
minimum = """1
2 1
1 2 1
"""
out = parse_outputs(run(minimum))
check_case(out[0], 1, 2, [(1, 2, 1)])

# All requirements use the same LCA.
all_equal = """4
5 4
1 2 5
1 3 5
1 4 5
2 3 5
"""
out = parse_outputs(run(all_equal))
check_case(
    out[0], 1, 5,
    [(1, 2, 5), (1, 3, 5), (1, 4, 5), (2, 3, 5)]
)

# Maximum-size instance, with 60 vertices and 120 consistent constraints.
# Vertex 60 is the root and every other vertex can be its direct child.
constraints = []
for i in range(120):
    x = 1 + (i % 59)
    y = 1 + ((i + 1) % 59)
    if x == y:
        y = 59
    constraints.append((x, y, 60))

maximum = "1\n60 120\n"
maximum += "\n".join(f"{x} {y} {z}" for x, y, z in constraints)
maximum += "\n"

out = parse_outputs(run(maximum))
check_case(out[0], 1, 60, constraints)

# Contradictory ancestor cycle.
cycle = """1
3 3
1 2 2
2 3 3
3 1 1
"""
out = parse_outputs(run(cycle))
check_case(
    out[0], 1, 3,
    [(1, 2, 2), (2, 3, 3), (3, 1, 1)],
    must_be_impossible=True
)

print("All tests passed.")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1 / 1 2 1`| 任何有效的树 | 最低限度`N`以及 LCA 等于一个查询顶点的情况 |
 |`5 4 / ... 5`| 任何有效的树 | 多个需求共享相同的 LCA 并分离多对 |
 |`60 120 / ... 60`| 任何有效的树 | 最大限度`N`， 最大限度`M`，以及重复的边界尺度 DSU 操作 |
 |`3 3 / 1 2 2 / 2 3 3 / 3 1 1`|`Impossible`| 循环强制祖先关系|

 ## 边缘情况

 对于端点 LCA 情况```
2 1
1 2 1
```强迫关系是`1 -> 2`，而顶点`1`本身没有传入的强制边缘。 算法选择`1`作为根。 既然要求有`z = root`，它不需要`1`和`2`分开。 单例组件`{2}`成为的孩子`1`，给出父数组`0 1`。 生命周期评估为`1`和`2`正是`1`。 

对于根选择情况```
3 1
1 2 3
```强迫关系是`3 -> 1`和`3 -> 2`。 顶点`1`和`2`两者都有传入关系，而`3`没有，所以算法选择`3`。 因为`z`等于根，`1`和`2`必须占用不同的组件。 他们这样做了，生产了这棵树`3 3 0`。 

对于循环情况```
3 3
1 2 2
2 3 3
3 1 1
```强迫关系是`2 -> 1`,`3 -> 2`， 和`1 -> 3`。 每个顶点都有一个传入关系，因此在尝试任何 DSU 分区之前根搜索会失败。 返回`Impossible`是正确的，因为每棵有根树都至少有一个顶点，并且整个顶点集中没有祖先。 

一个微妙的分离案例是```
3 2
1 2 3
1 3 1
```第一个要求力量`3`多于`1`和`2`。 第二势力`1`多于`3`。 因此祖先关系已经包含`1 -> 3 -> 1`。 在根选择过程中，既不`1`也不`3`可以选择作为有效的最小根，并且构造拒绝该实例。 

另一个有用的案例是一组独立的需求：```
5 1
1 2 3
```顶点`4`和`5`永远不会出现在任何需求中。 该算法仍然将它们放置在树中的某个位置，因为每个 DSU 组件都会递归地转换为子树。 它们可以简单地成为额外的分支。 它们的位置不会影响所需的 LCA，这就是为什么不受约束的顶点不需要特殊处理的原因。
