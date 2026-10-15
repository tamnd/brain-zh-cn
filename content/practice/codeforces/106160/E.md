---
title: "CF 106160E - 令人痛苦的电梯"
description: "每个图顶点都有一个唯一的标识符。 其中一个顶点的标识符为 1。我们可以删除边，但不允许添加边。 删除一些边后，我们查看包含标识符为 1 的顶点的连通分量。"
date: "2026-06-25T11:12:42+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106160
codeforces_index: "E"
codeforces_contest_name: "2025 Benelux Algorithm Programming Contest (BAPC 25)"
rating: 0
weight: 106160
solve_time_s: 56
verified: true
draft: false
---

[CF 106160E - 令人痛苦的电梯](https://codeforces.com/problemset/problem/106160/E)

 **评级：** -
 **标签：** -
 **求解时间：** 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个图顶点都有一个唯一的标识符。 其中一个顶点有标识符`1`。 

我们可以删除边，但不允许添加边。 删除一些边后，我们查看包含标识符为的顶点的连通分量`1`。 

电梯手册要求该组件中出现的标识符必须准确无误`1, 2, 3, ..., k`对于某些人来说`k`。 

任务就是最大化这个`k`。 

重述问题的一个有用方法是：对于每个候选值`k`，组件必须包含具有标识符的唯一顶点`1`，具有标识符的唯一顶点`2`，依此类推，直到`k`，并且它不能包含大于的标识符`k`。 

该图最多有`2 · 10^5`顶点和`4 · 10^5`边缘。 任何针对许多不同值重复运行图遍历的解决方案`k`太贵了。 例如，从头开始检查每个前缀的连接性将花费大约`O(n(n+m))`，远远超出了极限。 

第一个微妙的观察是标识符不能保证是连续的。 假设标识符是：```
1 2 4
```没有办法获得大小的排列`3`，因为标识符`3`不存在于图中的任何地方。 

另一个容易犯的错误是检查原始图中的连接性，而不是在允许的标识符集中检查连接性。 

考虑：```
ids: 1 2 3
edges:
1-3
3-2
```如果标识符`3`比候选人大`k = 2`，然后是顶点`1`和`2`不只使用标识符进行连接`≤ 2`。 通过标识符的路径`3`无法使用，因为该顶点也属于该组件。 

当所需的标识符存在但被分成多个组件时，就会出现第二种边缘情况。```
ids: 1 2 3
edges:
(1,2)
```标识符`1..3`存在，但是这些顶点上的导出图不连通，所以`k = 3`是不可能的。 

## 方法

 蛮力方法会尝试每个可行的值`k`。 

对于固定的`k`，我们取标识符最多为的所有顶点`k`，构建归纳图，并检查这些顶点是否形成连通分量。 如果确实如此，则通过删除从该集合到外部世界的每条边，包含标识符的组件`1`正好变成标识符`1..k`。 

这是正确的，但太慢了。 最多可以有`2 · 10^5`的候选值`k`，并且每次连通性检查可能会扫描整个图。 

关键的观察是我们测试的集合是嵌套的。 

让`S_k`是其标识符所属的顶点`1..k`。 

当我们从`k`到`k+1`，我们正好添加一个新顶点，该顶点的标识符为`k+1`。 我们从不删除顶点。 

这使得这是一个动态连接问题，其中顶点以递增的标识符顺序激活。 不相交集并集结构非常适合这种情况。 

当一个新的顶点变得活跃时，我们只需要将它连接到已经活跃的邻居。 如果我们维护活动顶点之间的连通分量的数量，则：```
S_k is connected
⇔
the number of active components equals 1
```唯一剩下的细节是标识符可能有间隙。 如果标识符`k+1`不存在，则不可能有更大的排列，因为集合`1..k+1`永远无法形成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n(n+m)) | O(n(n+m)) | O(n+m) | 太慢了 |
 | 最佳 DSU | O((n+m) α(n)) | O((n+m) α(n)) | O(n+m) | 已接受 |

 ## 算法演练

 1.读取所有标识符并定位每个标识符对应的顶点。 
2. 计算全局存在的最大连续标识符前缀。 开始于`1`，在下一个标识符存在时继续增加。 设此极限为`L`。 
3. 构建图邻接表。 
4. 按标识符顺序激活顶点`1, 2, ..., L`。 
5.激活带有标识符的顶点时`k`，为其创建一个新的 DSU 组件，并将活动组件数量增加 1。 
6. 对于该顶点的每个邻居，检查该邻居是否已经处于活动状态。 这恰好发生在其标识符最多为`k`。 
7. 当两个顶点属于不同的 DSU 集时，将它们合并。 每一次成功的结合都会使活性成分数量减少一个。 
8. 处理完所有联合后的标识符`k`，检查有效成分数是否等于`1`。 
9. 如果是，则所有带有标识符的顶点`1..k`形成一个连通的归纳图，所以`k`是可以实现的。 更新答案。 
10. 继续直到标识符`L`已处理。 

### 为什么它有效

 对于固定的`k`，活动顶点正是其标识符属于的顶点`1..k`。 

DSU 精确包含端点均处于活动状态的边，因为当后一个端点变为活动状态时会执行并集。 

因此，DSU 表示标识符上的归纳图的连通分量`1..k`。 

如果有效成分数为`1`，该归纳图是连通的。 然后，我们可以删除集合中具有较大标识符的顶点的每条边，留下标识符恰好为的组件`1..k`。 

如果有源元件数量大于`1`，任何边缘删除都无法将这些片段连接在一起，因为删除永远不会创建新路径。 

因此一个值`k`当有源元件数量等于时是可行的`1`，并取其中最大的`k`给出最佳答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))
        self.size = [1] * n

    def find(self, x):
        while self.parent[x] != x:
            self.parent[x] = self.parent[self.parent[x]]
            x = self.parent[x]
        return x

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)

        if a == b:
            return False

        if self.size[a] < self.size[b]:
            a, b = b, a

        self.parent[b] = a
        self.size[a] += self.size[b]
        return True

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    pos = {}
    for i, x in enumerate(a):
        pos[x] = i

    g = [[] for _ in range(n)]

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        g[v].append(u)

    L = 1
    while L + 1 in pos:
        L += 1

    dsu = DSU(n)
    active = [False] * n
    components = 0
    answer = 0

    for ident in range(1, L + 1):
        v = pos[ident]

        active[v] = True
        components += 1

        for to in g[v]:
            if active[to]:
                if dsu.union(v, to):
                    components -= 1

        if components == 1:
            answer = ident

    print(answer)

solve()
```第一部分将每个标识符映射到其顶点。 这让我们可以直接按标识符顺序激活顶点。 

变量`L`是输入中实际存在的标识符的最大连续前缀。 一旦缺少一个数字，任何更大的排列都变得不可能，因此没有理由处理更多的标识符。 

DSU 仅维护活动顶点之间的连接。 当顶点的标识符进入当前前缀时，该顶点就会变为活动状态。 

组件计数器是关键的实现细节。 激活一个顶点会创建一个新组件。 每个成功的联合都会合并两个组件并将计数器减一。 处理后的标识符`k`，计数器等于标识符上的归纳图中的连接分量的数量`1..k`。 

对于通向非活动顶点的边不需要进行特殊处理。 这些顶点对应于大于当前的标识符`k`，因此它们被故意忽略。 

## 工作示例

 ### 示例 1```
n = 5
ids = [4, 3, 10, 2, 1]

edges:
1-2
4-5
2-3
2-4
1-3
2-5
```连续的标识符前缀是`1,2,3,4`， 所以`L = 4`。 

| k | 激活标识符 | 联合后的组件 | 已连接？ | 回答 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 是的 | 1 |
 | 2 | 2 | 1 | 是的 | 2 |
 | 3 | 3 | 1 | 是的 | 3 |
 | 4 | 4 | 1 | 是的 | 4 |

 标识符的归纳图`1..4`是连通的，所以答案就变成了`4`。 

这个例子表明，大于目标值的标识符可以通过删除边简单地断开。 

### 示例 2```
ids = [1, 2, 3]
edges:
1-2
```| k | 激活标识符 | 联合后的组件 | 已连接？ | 回答 |
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 是的 | 1 |
 | 2 | 2 | 1 | 是的 | 2 |
 | 3 | 3 | 2 | 没有 | 2 |

 第三个顶点与前两个顶点没有连接，因此标识符上的诱导图`1..3`已断开连接。 

答案依然存在`2`。 

这表明仅仅拥有所有必需的标识符是不够的，它们还必须形成一个连接的诱导图。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + m) α(n)) | O((n + m) α(n)) | 每条边最多被考虑两次，DSU 操作几乎恒定 |
 | 空间| O(n + m) | 邻接表、DSU 和辅助数组 |

 和`n ≤ 2 · 10^5`和`m ≤ 4 · 10^5`, this easily fits within the limits. DSU 仅贡献逆阿克曼开销，这在实践中实际上是恒定的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))
            self.size = [1] * n

        def find(self, x):
            while self.parent[x] != x:
                self.parent[x] = self.parent[self.parent[x]]
                x = self.parent[x]
            return x

        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)

            if a == b:
                return False

            if self.size[a] < self.size[b]:
                a, b = b, a

            self.parent[b] = a
            self.size[a] += self.size[b]
            return True

    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    pos = {}
    for i, x in enumerate(a):
        pos[x] = i

    g = [[] for _ in range(n)]

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        g[v].append(u)

    L = 1
    while L + 1 in pos:
        L += 1

    dsu = DSU(n)
    active = [False] * n
    comp = 0
    ans = 0

    for ident in range(1, L + 1):
        v = pos[ident]
        active[v] = True
        comp += 1

        for to in g[v]:
            if active[to]:
                if dsu.union(v, to):
                    comp -= 1

        if comp == 1:
            ans = ident

    return str(ans) + "\n"

# sample
assert run(
"""5 6
4 3 10 2 1
1 2
4 5
2 3
2 4
1 3
2 5
"""
) == "4\n"

# single vertex
assert run(
"""1 0
1
"""
) == "1\n"

# missing identifier 2
assert run(
"""3 2
1 3 4
1 2
2 3
"""
) == "1\n"

# all identifiers exist but graph disconnected
assert run(
"""3 1
1 2 3
1 2
"""
) == "2\n"

# chain becomes connected only at the end
assert run(
"""4 3
1 2 3 4
1 2
2 3
3 4
"""
) == "4\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单顶点| 1 | 最小输入尺寸|
 | 缺少标识符 2 | 1 | 连续前缀限制 |
 | 断开连接的第三个顶点 | 2 | 连接要求 |
 | 简单链条| 4 | 完整前缀连接 |
 | 案例案例| 4 | 官方行为|

 ## 边缘情况

 考虑标识符：```
3 1 4
```标识符`2`不存在。 

该算法计算`L = 1`，因为连续的前缀在之后立即停止`1`。 唯一标识符`1`已处理，答案为`1`。 

由于大小的排列，不可能有更大的答案`2`需要标识符`2`。 

现在考虑：```
3 1
1 2 3
1 2
```当标识符`1`被激活后，有一个组件。 

当标识符`2`被激活，边缘`(1,2)`将两个顶点合并为一个组件。 

当标识符`3`被激活时，它形成第二个组件，因为没有边将其连接到活动图。 

元件数量变为`2`， 所以`k = 3`被拒绝，答案保留`2`。 

最后，考虑：```
3 2
1 2 100
1 3
2 3
```标识符`1`和`2`不是直接连接的，而是通过标识符连接`100`。 

为了`k = 2`, 顶点`100`处于非活动状态，无法参与归纳图。 活动图在标识符之间不包含边`1`和`2`，因此已断开连接。 

算法正确拒绝`k = 2`，反映出最终组件可能不包含大于的标识符`k`。
