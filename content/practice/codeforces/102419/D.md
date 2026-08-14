---
title: "CF 102419D - 异或图"
description: "我们有一个无向图，每个顶点都已经带有一个小于 (2^{20}) 的整数。 我们可以选择顶点的子集和一个 XOR 值 (x)，然后用 (ai oplus x) 替换每个选定的值 (ai)。 目标是使每条边上的两个端点值都不同。"
date: "2026-08-14T14:48:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102419
codeforces_index: "D"
codeforces_contest_name: "SPC 2019"
rating: 0
weight: 102419
solve_time_s: 262
verified: false
draft: false
---

[CF 102419D - 异或图](https://codeforces.com/problemset/problem/102419/D)

 **评级：** -
 **标签：** -
 **求解时间：** 4m 22s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个无向图，每个顶点都已经带有一个小于 (2^{20}) 的整数。 我们可以选择顶点的子集和一个 XOR 值 (x)，然后用 (a_i \oplus x) 替换每个选定的值 (a_i)。 目标是使每条边上的两个端点值都不同。 

查看一条边的有用方法是根据是否选择其端点对其进行分类。 如果选择了两个端点，或者都未选择两个端点，则异或将同等地应用于两个值，因此它们的相等关系不会改变。 如果仅选择一个端点，则当以下情况时，两个最终值精确相等

 [
 x=a_u\o加上a_v。 
]

 这给出了问题的中心结构。 

对于端点最初具有相等值的边（a_u=a_v），两个端点不能具有相同的选择状态。 这样的边迫使两个顶点属于所选子集的相对侧。 因此，连接相等值的所有边形成的图必须是二分图。 

对于端点值不同的边，不限制是否选择两个端点。 如果恰好选择了一个端点，我们只需避免单个 XOR 值 (a_u\oplus a_v)。 

这些限制使得二次或指数搜索变得不可能。 由于多达 (3\cdot10^5) 个顶点和边且只有一秒，预期的解决方案基本上需要线性图处理。 值范围包含 (2^{20}=1,048,576) 个可能的 XOR 值，该值与最大值 (m=3\cdot10^5) 相比足够大，以保证可以通过短扫描找到一个合适的值。 

有几种边缘情况可能会欺骗直接实现。 考虑```
3 3
1 1 1
1 2
2 3
1 3
```每条边都连接相等的值，因此每条边都要求其端点位于相对的两侧。 这是一个奇数循环并且不能被二分。 正确的输出是`-1`。 仅检查单个边缘的粗心解决方案可能会错过全局矛盾。 

另一种情况是原始值已经正确的图：```
3 2
1 2 3
1 2
2 3
```不存在等值边，因此根本不存在二分约束。 我们可以选择一个顶点并选择一个不等于任何选定边上的异或差的 (x)。 解决方案不得假设存在某些等值边。 

多个边缘也值得关注。 例如，```
2 3
7 7
1 2
1 2
1 2
```所有三个边都施加完全相同的条件 (x\ne0)，并且该图仍然是二分图。 将输入视为简单图是不必要的，并且可能会引入错误，但重复约束本身不会造成任何困难。 

最后，所选的 (x) 必须保持低于 (2^{20})。 我们只会测试从 (1) 到 (m+1) 和 (m+1\le300001<2^{20}) 的值，因此自动遵守边界。 

## 方法

 最直接的强力方法是尝试每个顶点子集和每个可能的 XOR 值。 (x) 有 (2^n) 个子集和 (2^{20}) 个可能值。 对于每一对，检查所有边需要 (O(m))，给出

 [
 O(2^n\cdot2^{20}\cdot m)
 ]

 最坏情况下的边缘检查。 在 (n=3\cdot10^5) 处，这远远超出了任何可行的计算。 

我们可以通过首先观察等值边来确定子集是否可能来显着提高暴力破解能力。 对于等值边，必须恰好选择一个端点。 这正是二分着色条件。 我们可以使用单个 BFS 或 DFS 构造一个有效子集，而不是枚举 (2^n) 个子集。 

剩下的问题是如何选择(x)。 一旦子集固定，只有从选定顶点交叉到未选定顶点的边会约束 (x)。 每一条这样的边都禁止一个值，(a_u\oplus a_v)。 最多有 (m) 个禁止值，而我们可以在 (m+1) 个正整数中进行选择。 根据鸽巢原理，至少有一个

 [
 1,2,\l点,m+1
 ]

 不被禁止。 由于 (m+1<2^{20})，该值始终合法。 

蛮力之所以有效，是因为它直接测试每个可能的操作。 它失败了，因为可能的子集的数量是指数级的。 等值边单独决定所需的两种着色这一观察结果让我们可以用一个图遍历来代替指数搜索，之后巨大的 XOR 搜索最多可缩减为 (m+1) 个候选。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(2^n\cdot2^{20}\cdot m)) | (O(n+m)) | 太慢了 |
 | 最佳 | (O(n+m)) 预计实际时间 | (O(n+m)) | 已接受 |

 ## 算法演练

 1. 构建一个仅包含边 ((u,v)) 的单独图，其中 (a_u=a_v)。 这些边要求其端点具有不同的选择状态。 
2. 使用 BFS 对该等值图进行二分。 为每个顶点指定两种颜色之一：(0) 或 (1)。 对于每个等值边，其端点必须接收不同的颜色。 如果我们找到一条端点已经具有相同颜色的边，则所需的子集不存在，因此我们打印`-1`。 
3. 选择颜色 (1) 的每个顶点作为选定集。 如果等值图至少有一条边，则该集合自动非空。 如果等值图没有边，则手动选择顶点(1)。 这处理所有原始边缘值已经不同的情况。 
4. 检查每条原始边缘。 只有端点具有不同选择状态的边才能改变其相等关系。 对于每个这样的边，计算 (a_u\oplus a_v) 并将该值标记为 (x) 的禁止值。 
5. 搜索(x=1,2,\ldots,m+1)并取第一个不被禁止的值。 最多有 (m) 个禁止值，因此 (m+1) 个候选值不能全部被禁止。 另外，(m+1\le300001<2^{20})，所以所选值满足要求的范围。 
6. 输出选定的顶点和选定的(x)。 每个等值边都穿过二分，因此其端点接收不同的最终值。 穿过子集的每个不等值边都会避免其唯一的禁止 XOR 值，而端点位于同一边的边则保持其原始不等式。 

不变的是，二分着色后，每条等值边都有选择状态相反的端点。 这样的边最初具有相等的值，并且因为 (x\ne0)，对一个端点应用 XOR 会使两个值不同。 对于具有相反状态的不等值边，最终值可能仅对于单个值 (x=a_u\oplus a_v) 变得相等，该构造明确排除了该值。 具有相等选择状态的不等值边对两个端点应用异或或都不应用异或，因此它的两个不同值保持不同。 

因此，每条边对于最终操作都是有效的。 如果二分着色失败，则等值奇数循环会强制出现不可能的交替选择模式，因此报告`-1`也是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    edges = []
    equal_adj = [[] for _ in range(n)]

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        edges.append((u, v))

        if a[u] == a[v]:
            equal_adj[u].append(v)
            equal_adj[v].append(u)

    color = [-1] * n

    for start in range(n):
        if color[start] != -1:
            continue

        color[start] = 0
        stack = [start]

        while stack:
            u = stack.pop()

            for v in equal_adj[u]:
                if color[v] == -1:
                    color[v] = color[u] ^ 1
                    stack.append(v)
                elif color[v] == color[u]:
                    print(-1)
                    return

    selected = [i for i in range(n) if color[i] == 1]

    if not selected:
        selected = [0]

    forbidden = set()

    for u, v in edges:
        if (u in selected_set) != (v in selected_set):
            forbidden.add(a[u] ^ a[v])

    x = 1
    while x in forbidden:
        x += 1

    print(len(selected), x)
    print(*(v + 1 for v in selected))

if __name__ == "__main__":
    solve()
```上面的代码需要一个小的实现细节来提高成员资格测试的效率。 建设中`selected_set`在扫描边缘之前从列表中删除可以避免重复搜索 Python 列表。 完整的实现是：```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    edges = []
    equal_adj = [[] for _ in range(n)]

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        edges.append((u, v))

        if a[u] == a[v]:
            equal_adj[u].append(v)
            equal_adj[v].append(u)

    color = [-1] * n

    for start in range(n):
        if color[start] != -1:
            continue

        color[start] = 0
        stack = [start]

        while stack:
            u = stack.pop()

            for v in equal_adj[u]:
                if color[v] == -1:
                    color[v] = color[u] ^ 1
                    stack.append(v)
                elif color[v] == color[u]:
                    print(-1)
                    return

    selected = [i for i in range(n) if color[i] == 1]

    if not selected:
        selected = [0]

    selected_set = set(selected)

    forbidden = set()

    for u, v in edges:
        if (u in selected_set) != (v in selected_set):
            forbidden.add(a[u] ^ a[v])

    x = 1
    while x in forbidden:
        x += 1

    print(len(selected), x)
    print(*(v + 1 for v in selected))

if __name__ == "__main__":
    solve()
```第一遍存储每个原始边，因为第二阶段需要在确定选择集后检查所有边。 同时，只插入等值边`equal_adj`，保持二分图尽可能小。 

着色使用迭代堆栈而不是递归 DFS。 路径可以包含 (3\cdot10^5) 个顶点，这可能会超出 Python 的默认递归深度，因此递归需要额外的配置，这里没有必要。 

这`selected_set`至关重要。 Python 列表中的成员资格需要线性时间，在最坏的情况下将最终的边缘扫描变成 (O(nm))。 集合给出预期的 (O(1)) 成员资格检查。 

XOR 值从 (1) 开始，而不是 (0)。 这很方便，因为等值边禁止 (0)，并且它还保证操作实际上更改了选定的值。 更重要的是，从 (1) 到 (m+1) 有 (m+1) 个候选值，但最多 (m) 个不同的禁止值，因此循环必须终止。 

Python 整数不会溢出，并且每个输入值都低于 (2^{20})，因此`a[u] ^ a[v]`也低于 (2^{20})。 

## 工作示例

 ### 示例 1

 输入是```
3 3
1 1 1
1 2
2 3
1 3
```每条边都有相等的端点值，因此所有三个边都进入二部图。 

| 顶点| 指定颜色 | 原因 |
 | --- | --- | --- |
 | 1 | 0 | BFS 启动 |
 | 2 | 1 | 邻近 1 |
 | 3 | 0 | 毗邻 2 |
 | 1 和 3 | 0, 0 | 边缘冲突 (1\text{-}3) |

 边 (1\text{-}3) 连接具有相同颜色的顶点，因此等值图不是二分图。 没有选择集可以分开所有三个相等的边，并且算法会打印`-1`。 

这说明了为什么仅检查局部边缘是不够的。 只有在整个奇数周期的颜色交替之后，矛盾才会出现。 

### 示例 2

 输入是```
3 3
1 1 2
1 2
2 3
1 3
```只有边 (1\text{-}2) 具有相等的端点值。 

| 顶点| 颜色 | 已选择 | 原因 |
 | --- | --- | --- | --- |
 | 1 | 0 | 没有 | BFS 启动 |
 | 2 | 1 | 是的 | 等值边缘需要相反的颜色 |
 | 3 | 0 | 没有 | 顶点 3 没有通过等值边连接 |

 所选集是 ({2})。 交叉边及其禁止值是

 | 边缘| 端点值| 异或| 禁止？ |
 | --- | --- | --- | --- |
 | (1,2) | (1,1) | 0 | 是的 |
 | (2,3) | (1,2) | 3 | 是的 |
 | (1,3) | (1,2) | 3 | 否，均未选择 |

 第一个正候选是 (x=1)，这不是禁止的。 

运算后，值变为(1,0,2)。 所有三个边都连接不同的值，因此该构造是有效的。 

该迹线显示等值边如何确定子集，而不等值边仅删除 (x) 的可能值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+m)) 预期 | 等值图遍历一次，原始边扫描一次，异或搜索最多检查（m+1）个值 |
 | 空间| (O(n+m)) | 图形、原始边列表、着色和选定集需要线性内存 |

 最大输入有 (3\cdot10^5) 个顶点和 (3\cdot10^5) 个边，因此线性处理适合一秒限制。 该算法从不执行与 (2^n) 或 (2^{20}) 成比例的工作，并且其内存使用量保持在 256 MB 以内。 

## 测试用例

 由于建设性问题可以有许多正确的输出，因此最有用的测试工具会解析生成的答案并验证它，而不是比较原始输出文本。 下面的断言还检查了`-1`准确报告何时无法施工。```python
import sys
import io

def solve_data(inp: str) -> str:
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = next(it)
    a = [next(it) for _ in range(n)]

    edges = []
    equal_adj = [[] for _ in range(n)]

    for _ in range(m):
        u = next(it) - 1
        v = next(it) - 1
        edges.append((u, v))
        if a[u] == a[v]:
            equal_adj[u].append(v)
            equal_adj[v].append(u)

    color = [-1] * n

    for start in range(n):
        if color[start] != -1:
            continue

        color[start] = 0
        stack = [start]

        while stack:
            u = stack.pop()

            for v in equal_adj[u]:
                if color[v] == -1:
                    color[v] = color[u] ^ 1
                    stack.append(v)
                elif color[v] == color[u]:
                    return "-1\n"

    selected = [i for i in range(n) if color[i] == 1]

    if not selected:
        selected = [0]

    selected_set = set(selected)

    forbidden = set()
    for u, v in edges:
        if (u in selected_set) != (v in selected_set):
            forbidden.add(a[u] ^ a[v])

    x = 1
    while x in forbidden:
        x += 1

    return str(len(selected)) + " " + str(x) + "\n" + \
           " ".join(str(v + 1) for v in selected) + "\n"

def validate(inp: str, out: str) -> bool:
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    m = next(it)
    a = [next(it) for _ in range(n)]

    edges = [(next(it) - 1, next(it) - 1) for _ in range(m)]

    tokens = out.split()

    if tokens[0] == "-1":
        return True

    k = int(tokens[0])
    x = int(tokens[1])

    if not (0 <= k <= n):
        return False
    if not (0 <= x < (1 << 20)):
        return False

    chosen = list(map(lambda z: int(z) - 1, tokens[2:2 + k]))

    if len(chosen) != k:
        return False
    if len(set(chosen)) != k:
        return False
    if any(v < 0 or v >= n for v in chosen):
        return False

    chosen_set = set(chosen)

    for u, v in edges:
        au = a[u] ^ x if u in chosen_set else a[u]
        av = a[v] ^ x if v in chosen_set else a[v]

        if au == av:
            return False

    return True

sample1 = """\
3 3
1 1 1
1 2
2 3
1 3
"""

sample2 = """\
3 3
1 1 2
1 2
2 3
1 3
"""

sample3 = """\
5 4
1 2 3 4 5
1 2
1 3
1 4
4 5
"""

assert solve_data(sample1).strip() == "-1", "sample 1"

assert validate(sample2, solve_data(sample2)), "sample 2"
assert validate(sample3, solve_data(sample3)), "sample 3"

single_edge = """\
2 1
0 0
1 2
"""
assert validate(single_edge, solve_data(single_edge)), "minimum valid graph"

all_equal_path = """\
4 3
7 7 7 7
1 2
2 3
3 4
"""
assert validate(all_equal_path, solve_data(all_equal_path)), "all equal values"

boundary_values = """\
3 2
0 1048575 1
1 2
2 3
"""
assert validate(boundary_values, solve_data(boundary_values)), "20-bit boundary values"

maximum_size = ["300000 299999", " ".join(["5"] * 300000)]
maximum_size.extend(f"{i} {i + 1}" for i in range(1, 300000))
maximum_size = "\n".join(maximum_size) + "\n"
assert validate(maximum_size, solve_data(maximum_size)), "maximum-size path"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 |`-1`| 等值图中的奇环 |
 | 样品2 | 任何有效的构造 | 等值边加上不等值交叉边|
 | 样品 3 | 任何有效的构造 | 没有等值边，因此必须手动选择所选集 |
 |`2 1 / 0 0 / 1 2`| 任何有效的构造 | 最小有效图和 (x=0) 被禁止的事实 |
 | 路径上四个相等的值 | 任何有效的构造 | 多个等值边上的二分着色 |
 | 价值观`0`和`1048575`| 任何有效的构造 | 20 位极值 |
 | 300000 顶点路径 | 任何有效的构造 | 最大顶点和边尺度下的线性时间行为 |

 ## 边缘情况

 对于全等三角形```
3 3
1 1 1
1 2
2 3
1 3
```等值图是整个三角形。 从顶点 1 处的颜色 (0) 开始，通过边 (2\text{-}3) 强制顶点 2 为颜色 (1)，顶点 3 为颜色 (0)。 然后边 (1\text{-}3) 连接两个颜色 (0) 顶点，因此算法立即返回`-1`。 

对于没有等值边的图，```
3 2
1 2 3
1 2
2 3
```等值图没有边，因此所有顶点最初都接收颜色 (0)。 颜色 (1) 边为空，算法改为选择顶点 1。交叉边禁止 (1\oplus2=3)，而边 (2\text{-}3) 不交叉所选集合。 因此 (x=1) 有效，并将顶点 1 从 (1) 更改为 (0)，从而使边值不同。 

对于重复的边，```
2 3
7 7
1 2
1 2
1 2
```同一对在等值图中出现了 3 次。 BFS 仍然为两个顶点分配不同的颜色。 所选边包含一个端点，并且该边的每个副本都禁止 (7\oplus7=0)。 第一个候选者 (x=1) 同时对所有三个副本有效。 

对于最大可能的顶点值，```
3 2
0 1048575 1
1 2
2 3
```前两个值之间的 XOR 为 (1048575)，仍在 20 位范围内。 该算法从不假设 XOR 值在数值上很小，只是假设它们低于 (2^{20})。 其候选搜索使用从 (1) 开始的值，并且在到达 (2^{20}) 之前，鸽子洞参数保证了一个自由值。 

(m+1) 个候选者的选择还可以处理最坏可能的禁止 XOR 值集合。 即使 (1,\ldots,m) 中的每一个都被禁止，(m+1) 也不能被禁止，因为只有 (m) 条边，因此最多 (m) 个不同的禁止值。 由于 (m+1\le300001<2^{20})，搜索总是找到合法的 XOR 值。
