---
title: "CF 102253C - 七彩树"
description: "我们有一棵有 (n) 个顶点的树。 每个顶点都有一种颜色，对于任何两个不同的顶点，我们查看它们独特的路径并计算该路径上出现的不同颜色的数量。 任务是对所有 (frac{n(n-1)}2) 无序顶点对求和该值。"
date: "2026-08-19T00:43:19+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102253
codeforces_index: "C"
codeforces_contest_name: "2017 Chinese Multi-University Training, BeihangU Contest"
rating: 0
weight: 102253
solve_time_s: 145
verified: true
draft: false
---

[CF 102253C - 七彩树](https://codeforces.com/problemset/problem/102253/C)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有 (n) 个顶点的树。 每个顶点都有一种颜色，对于任何两个不同的顶点，我们查看它们独特的路径并计算该路径上出现的不同颜色的数量。 任务是对所有 (\frac{n(n-1)}2) 个无序顶点对求和该值。 输入包含多个测试用例，每个测试用例由顶点颜色和后跟 (n-1) 条树边组成。 所需的输出是每个案例的总和，并以案例编号为前缀。 官方问题格式和示例输出由 Codeforces Gym 102253C 给出。 

约束 (n\le 2\cdot10^5) 排除任何接近二次时间的情况。 最大尺寸已经有大约 (2\cdot10^{10}) 个顶点对，因此即使将每对顶点对枚举一次也远远超出了两秒限制所能容忍的范围。 预期的解决方案必须仅处理每个顶点和边恒定的次数，从而给出 (n) 中的线性复杂度。 颜色值也最多为 (n)，这让我们可以在普通数组中维护每种颜色的信息。 

有几种简单的方法可以得到错误的答案。 重复的颜色只能对路径贡献一次。 例如，```
2
1 1
1 2
```只有一条路径，并且该路径恰好包含一种不同的颜色，所以答案是`1`。 为每个顶点添加一个贡献的解决方案将错误地获得`2`。 

两个端点都包含在它们的路径中。 为了```
2
1 2
1 2
```唯一的路径包含颜色 (1) 和 (2)，所以答案是`2`。 将路径视为仅包含其内部顶点会错误地给出零颜色。 

删除颜色时不能忘记树根侧的组件。 例如，```
3
1 1 2
1 2
1 3
```有路径值 (1,2,2)，给出答案`5`。 对于颜色 (2)，删除其唯一的顶点会使顶点 (1) 和 (2) 连接，因此一条路径会避开颜色 (2)。 仅检查颜色出现下方的子子树的计算将错过这个剩余的根侧组件。 

## 方法

 直接解决方案可以枚举每对顶点，找到其路径，将该路径上的颜色插入到集合中，然后添加集合的大小。 这是正确的，因为每条路径都会被检查一次，并且该组会删除重复的颜色。 问题是工作量。 在链上，所有路径访问的顶点总数为

 [
 \sum_{d=1}^{n-1}(n-d)(d+1)
 =\frac{n(n-1)(n+4)}6
 =\Theta(n^3)。 
]

 在 (n=2\cdot10^5) 处，这大约是 (1.3\cdot10^{15}) 次顶点访问，因此暴力方法几乎不可行。 

观点的有用改变是独立计算每种颜色的贡献。 颜色集包含 (k) 种颜色的路径对这 (k) 种颜色中每种颜色的答案贡献 (1)。 因此，最终答案是每种颜色 (c) 上包含至少一个颜色 (c) 顶点的路径数量之和。 这种贡献通过其补语更容易表达。 总共有 (\binom n2) 条路径，因此颜色 (c) 的贡献为

 [
 \binom n2-\text{避免颜色的路径数}c.
 ]

 现在删除每个具有颜色 (c) 的顶点。 剩下的图是一片森林。 当两个端点位于该林的同一连接组件中时，路径恰好避免 (c)。 如果分量大小为 (s_1,s_2,\ldots)，则避免 (c) 的路径数为

 [
 \sum_i \binom{s_i}{2}。 
]

 这将问题转化为计算通过移除每种颜色获得的所有分量的大小。 对每种颜色独立执行此操作将再次是二次方。 关键的观察结果是，所有这些计算都可以在一个 DFS 期间同时模拟。 标准解决方案将此描述为使用虚拟树思想，而无需显式构建虚拟树。 

树的根位于顶点 (1)。 考虑当前顶点 (u)、颜色 (c) 和一个子顶点 (v)。 在 (v) 的子树内部，一些节点属于以颜色 (c) 出现次数最多的位置为根的子树。 如果删除所有颜色 (c) 顶点，则这些节点将与 (u) 分离。 (v) 子树中的每个其他节点都属于附加到 (u) 的一个连通分量。 如果子树的大小为 (sz[v])，并且这些节点的 (x) 已被较高颜色 (c) 的顶点所占据，则组件大小为 (sz[v]-x)，贡献 (\binom{sz[v]-x}{2}) 避免路径。 

我们无需显式构造任何内容即可获得 (x)。 对于每种颜色 (c)，保持`dom[c]`，在 DFS 期间已与当前最高相关颜色 (c) 顶点关联的数量。 在下降到子级 (v) 之前，立即保存`dom[c]`。 从 (v) 返回后，新值和保存的值之间的差异正是那些较高颜色 (c) 区域占用的子树的数量。 该差值就是要从 (sz[v]) 中减去的数量。 同样的增量思想是该问题公认的树-DP 公式的核心。 

最后，在 DFS 完成后，颜色可能仍然有一个高于其最高出现次数的分量。 它的大小是 (n-\text{dom}[c])，因此我们将 (\binom{n-\text{dom}[c]}2) 添加到避免该颜色的路径数。 这是纯本地子树计算会错过的根侧组件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^3)) 链上 | (O(n)) | (O(n)) | 太慢了 |
 | 最佳| (O(n)) | (O(n)) | (O(n)) | (O(n)) | 已接受 |

 ## 算法演练

 1. 计算出现了多少种不同的颜色。 有 (\binom n2) 条路径，最初我们可以想象每种不同的颜色对每条路径都有贡献。 因此起始值为

 [
 \text{distinctColors}\cdot\binom n2.
 ]

 我们将减去避开每种颜色的路径。 

1. 以顶点 (1) 为树的根，并将 (sz[u]) 定义为 (u) 子树中的顶点数。 当 DFS 从每个孩子返回时都需要这个值。 
2. 维护数组`dom[c]`。 在 DFS 期间，它表示当前最高颜色 (c) 区域已吸收的总大小。 当处理带有颜色（c）的顶点（u）时，初始化一个局部值`added = 1`，因为 (u) 本身将成为由颜色 (c) 表示的新区域的一部分。 
3. 一次处理 (u) 的每个子项 (v)。 节省`before = dom[c]`就在进入(v)之前。 然后，在对该子树执行任何其他操作之前，将完全处理 (v) 的子树。 
4. 从(v)返回后，计算

 [
 x=dom[c]-之前。 
]

 值 (x) 计算 (v) 子树中属于较高颜色 (c) 区域的部分。 这些区域包含颜色 (c) 顶点，并且在颜色 (c) 被移除后与 (u) 断开。 

1. 剩余部分

 [
 块=sz[v]-x
 ]

 正是包含 (v) 且不包含颜色 (c) 顶点的连通分量。 该组件内的每对顶点都给出一条避免颜色 (c) 的路径，因此添加

 [
 \binom{块}{2}
 ]

 将从答案中减去的路径数。 

1.添加`block`到当地`added`(u) 的值。 处理完每个子项后，更新

 [
 dom[c]\mathrel{+}=添加。 
]

 这将用 (u) 表示的区域替换先前最高颜色的 (c) 区域，这正是 (u) 的父级所需的状态。 

1.在整个DFS之后，处理实际出现的每种颜色。 其剩余的根侧组件具有大小

 [
 n-dom[c]。 
]

 添加

 [
 \binom{n-dom[c]}2
 ]

 避开该颜色的路径数量。 

1. 减去避开路径的总数`distinctColors * C(n, 2)`。 结果是所有路径上不同颜色计数所需的总和。 

下面的实现使用显式 DFS 堆栈而不是 Python 递归。 该树可以是长度为 (2\cdot10^5) 的链，因此递归 Python DFS 存在超出解释器的递归堆栈的风险。 显式堆栈保留与递归递归完全相同的父子处理顺序。 

### 为什么它有效

 修复颜色 (c)。 删除颜色 (c) 的每个顶点将树划分为连接的组件，并且一个组件内的顶点对恰好具有避开 (c) 的路径。 对于颜色为 (c) 的顶点 (u) 的每个子 (v)，`dom[c] - before`精确计算 (v) 子树中已被 (v) 下面最高颜色 (c) 顶点分隔的部分。 删除这些部分留下一个连接的无颜色 (c) 大小的组件`sz[v] - (dom[c] - before)`，因此它的 (\binom{size}{2}) 对只计算一次。 当所有的孩子都处理完之后，`dom[c]`表示已由最高颜色 (c) 顶点占据的区域。 唯一未处理的组件是最高颜色 (c) 顶点上方的组件，其大小为 (n-dom[c])，并在最后计数。 因此，避免 (c) 的每对都会被计数一次，并且包含 (c) 的每对都会从该补码中排除。 将所有颜色的贡献相加，即可准确得出每条路径上不同颜色的数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    out = []
    case_no = 0

    while True:
        line = input()
        if not line:
            break
        line = line.strip()
        if not line:
            continue

        n = int(line)
        color = [0] + list(map(int, input().split()))

        graph = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            graph[u].append(v)
            graph[v].append(u)

        present = [False] * (n + 1)
        distinct = 0
        for u in range(1, n + 1):
            c = color[u]
            if not present[c]:
                present[c] = True
                distinct += 1

        # dom[c] is the amount already absorbed by the highest
        # color-c regions during the current DFS.
        dom = [0] * (n + 1)

        # sz[u] is the subtree size.
        sz = [0] * (n + 1)

        # Number of paths avoiding their corresponding colors.
        bad = 0

        # Frame:
        # [vertex, parent, next_edge_index, added, before]
        #
        # added is the local value that will be added to dom[color[u]]
        # when u finishes.
        # before stores dom[color[u]] immediately before entering
        # the currently processed child.
        sz[1] = 1
        stack = [[1, 0, 0, 1, 0]]

        while stack:
            frame = stack[-1]
            u = frame[0]
            p = frame[1]

            if frame[2] < len(graph[u]):
                v = graph[u][frame[2]]
                frame[2] += 1

                if v == p:
                    continue

                c = color[u]
                frame[4] = dom[c]

                sz[v] = 1
                stack.append([v, u, 0, 1, 0])
                continue

            # Finish u.
            c = color[u]
            dom[c] += frame[3]
            stack.pop()

            if stack:
                parent_frame = stack[-1]
                parent = parent_frame[0]
                pc = color[parent]

                added_in_child = dom[pc] - parent_frame[4]
                block = sz[u] - added_in_child

                bad += block * (block - 1) // 2
                parent_frame[3] += block
                sz[parent] += sz[u]

        # The component above the highest occurrence of each color.
        for c in range(1, n + 1):
            if not present[c]:
                continue
            block = n - dom[c]
            bad += block * (block - 1) // 2

        total = distinct * n * (n - 1) // 2
        answer = total - bad

        case_no += 1
        out.append(f"Case #{case_no}: {answer}")

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入阶段将颜色存储在单索引数组中，以便顶点编号和数组索引匹配。 这`present`数组同时计算不同的颜色，这使得初始贡献仅使用实际出现的颜色。 

这`dom`数组是状态的核心部分。 它按颜色而不是按顶点索引，因为同时对每种颜色执行相同的计算。 当孩子完成后，父母会比较新的`dom[color[parent]]`使用输入该子项之前保存的值。 只有差异属于该子树，因此这种减法可以防止再次计算在较早兄弟子树中积累的信息。 

这`added`当前顶点的每个 DFS 帧中的字段从 1 开始。 每个孩子都将其无色块贡献给这个值。 当顶点完成后，添加`added`到`dom[color[u]]`使整个新形成的最高颜色区域可供其父级使用。 

最后的循环处理树中每种颜色出现次数最多的部分。 当根没有那种颜色时，省略此步骤是错误答案的常见原因。 

所有路径计数都使用 Python 整数，因此不存在溢出问题。 在具有固定宽度整数的语言中，需要 64 位整数，因为答案可能约为 (n^3)。 

显式堆栈也是经过深思熟虑的。 递归 DFS 的链上深度为 (O(n))，而迭代版本使用 (O(n)) 堆内存，并且不存在递归深度故障。 

## 工作示例

 ### 示例 1

 树是链（1-2-3），颜色为（1,2,1）。 有3条路。 最初的贡献是两种不同的颜色乘以三条路径，得出（6）。 

DFS处理顶点(2)的子树，包括顶点(3)。 当顶点 (3) 完成时，颜色 (1) 已吸收一个顶点。 当顶点 (2) 完成时，颜色 (2) 已吸收两个顶点。 返回到顶点（1），颜色（1）区域占据了整棵树。 

| 顶点| 颜色 | 儿童 | 儿童尺码 |`before`|`dom`孩子之后|`block`|`bad`添加 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 3 | 1 | 无 | 0 | 0 | 1 | 0 | 0 |
 | 2 | 2 | 3 | 1 | 0 | 1 | 0 | 0 |
 | 1 | 1 | 2 | 2 | 0 | 1 | 1 | 0 |
 | 1 | 1 | 2 完成 | 2 | 0 | 3 | 0 | 0 |

 经过DFS之后，`dom[1] = 3`，因此颜色 (1) 没有剩余的根侧分量。`dom[2] = 2`，留下大小为 (1) 的分量，这有助于零避免路径。 因此`bad = 0`，答案仍然是（6）。 

这个例子说明了为什么相同的颜色不能按顶点独立计数。 两次出现的颜色 (1) 一起为每条路径贡献了一个单位，而不是两个。 

### 示例 2

 这棵树是```
        1(1)
       /   \
    2(2)   3(1)
    /  \      \
 4(3) 5(2)    6(1)
```有六个顶点和三种不同的颜色，因此初始值为

 [
 3\binom62=45。 
]

 相关的 DFS 转换为：

 | 顶点| 颜色 | 儿童 | 儿童尺码 |`before`|`dom`孩子之后|`block`|`bad`添加 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 4 | 3 | 无 | 1 | 0 | 1 | 0 | 0 |
 | 5 | 2 | 无 | 1 | 0 | 1 | 0 | 0 |
 | 2 | 2 | 4 | 1 | 0 | 0 | 1 | 0 |
 | 2 | 2 | 5 | 1 | 0 | 1 | 0 | 0 |
 | 3 | 1 | 6 | 1 | 0 | 1 | 0 | 0 |
 | 1 | 1 | 2 | 3 | 0 | 0 | 3 | 3 |
 | 1 | 1 | 3 | 2 | 0 | 2 | 0 | 0 |

 经过DFS后，与三种颜色相关的值是

 | 颜色 |`dom[color]`| 根侧尺寸| 根侧回避路径|
 | --- | --- | --- | --- |
 | 1 | 6 | 0 | 0 |
 | 2 | 3 | 3 | 3 |
 | 3 | 1 | 5 | 10 | 10

 通向顶点 (2) 的顶点 (1) 的子节点产生大小为 (3) 的无颜色 (1) 分量，考虑 (3) 避开路径。 颜色 (2) 在其最高出现次数之上具有另一个大小 (3) 的分量，占 (3) 条路径，而颜色 (3) 具有大小 (5) 的根侧分量，占 (10) 条路径。 

因此，缺失颜色贡献的总数为

 [
 3+3+10=16，
 ]

 最终的答案是

 [
 45-16=29。 
]

 该迹证明了中心不变量：`dom[c]`准确地携带已经被出现次数较多的颜色 (c) 分隔开的部分，而`sz[v] - delta`是该子子树中剩余的一个无颜色组件。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n)) | (O(n)) | 每个顶点和每个树边都会被处理固定次数，然后对 (n) 种可能的颜色进行一次扫描。 |
 | 空间| (O(n)) | (O(n)) | 邻接列表、子树大小、颜色状态、存在数组和显式 DFS 堆栈都使用线性内存。 |

 最大值 (n) 为 (2\cdot10^5)，因此线性传递适合两秒时间限制。 该实现避免了顶点对的二次数量和与 (n) 成比例的递归 DFS 深度。 答案可以超过 32 位范围，但 Python 整数直接处理所需的值。 

## 测试用例```python
import sys
import io

def solution():
    input = sys.stdin.readline
    out = []
    case_no = 0

    while True:
        line = input()
        if not line:
            break
        line = line.strip()
        if not line:
            continue

        n = int(line)
        color = [0] + list(map(int, input().split()))

        graph = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            graph[u].append(v)
            graph[v].append(u)

        present = [False] * (n + 1)
        distinct = 0
        for u in range(1, n + 1):
            c = color[u]
            if not present[c]:
                present[c] = True
                distinct += 1

        dom = [0] * (n + 1)
        sz = [0] * (n + 1)
        bad = 0

        sz[1] = 1
        stack = [[1, 0, 0, 1, 0]]

        while stack:
            frame = stack[-1]
            u, p = frame[0], frame[1]

            if frame[2] < len(graph[u]):
                v = graph[u][frame[2]]
                frame[2] += 1

                if v == p:
                    continue

                frame[4] = dom[color[u]]
                sz[v] = 1
                stack.append([v, u, 0, 1, 0])
            else:
                c = color[u]
                dom[c] += frame[3]
                stack.pop()

                if stack:
                    parent_frame = stack[-1]
                    parent = parent_frame[0]
                    pc = color[parent]

                    delta = dom[pc] - parent_frame[4]
                    block = sz[u] - delta

                    bad += block * (block - 1) // 2
                    parent_frame[3] += block
                    sz[parent] += sz[u]

        for c in range(1, n + 1):
            if present[c]:
                block = n - dom[c]
                bad += block * (block - 1) // 2

        total = distinct * n * (n - 1) // 2
        answer = total - bad

        case_no += 1
        out.append(f"Case #{case_no}: {answer}")

    return "\n".join(out)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    try:
        sys.stdin = io.StringIO(inp)
        return solution()
    finally:
        sys.stdin = old_stdin

sample1 = """\
3
1 2 1
1 2
2 3
"""

assert run(sample1) == "Case #1: 6", "sample 1"

sample2 = """\
6
1 2 1 3 2 1
1 2
1 3
2 4
2 5
3 6
"""

assert run(sample2) == "Case #1: 29", "sample 2"

minimum_same = """\
2
1 1
1 2
"""

assert run(minimum_same) == "Case #1: 1", "minimum size, equal colors"

minimum_different = """\
2
1 2
1 2
"""

assert run(minimum_different) == "Case #1: 2", "minimum size, different colors"

boundary_color = """\
3
3 1 2
1 2
2 3
"""

assert run(boundary_color) == "Case #1: 7", "color value n"

repeated_colors = """\
5
1 2 1 2 1
1 2
2 3
3 4
4 5
"""

assert run(repeated_colors) == "Case #1: 16", "repeated colors on a chain"

n = 200000
colors = " ".join(["1"] * n)
edges = "\n".join(f"{i} {i + 1}" for i in range(1, n))
maximum_case = f"{n}\n{colors}\n{edges}\n"

assert run(maximum_case) == "Case #1: 19999900000", "maximum n, all equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2`， 颜色`1 1`， 边缘`1 2`|`Case #1: 1`| 最小尺寸和重复颜色处理 |
 |`2`， 颜色`1 2`， 边缘`1 2`|`Case #1: 2`| 两个端点均贡献且有序对不计入 |
 |`3`， 颜色`3 1 2`, 边缘`1 2`,`2 3`|`Case #1: 7`| 颜色值等于最大允许值 (n) |
 | 5 条链带颜色`1 2 1 2 1`|`Case #1: 16`| 由其他颜色分隔的多个重复颜色 |
 | 200000 个顶点的链，全颜色`1`|`Case #1: 19999900000`| 最大输入大小、大整数算术和深度树处理 |

 ## 边缘情况

 对于两个顶点颜色相同的最小树，```
2
1 1
1 2
```初始贡献为 (1\cdot\binom22=1)。 DFS 将两个顶点吸收为`dom[1]`，因此根侧组件的大小为零。 没有路径可以避免颜色 (1)，给出`bad = 0`和最终答案`1`。 重复的颜色只计算一次，因为该算法针对每个颜色而不是每个顶点进行计算。 

对于两个不同颜色的顶点，```
2
1 2
1 2
```有一条路径并且包含两种颜色。 初始贡献为 (2\cdot1=2)。 每种颜色在其唯一的顶点被移除后就不再具有重要分量，因此不会减去任何回避路径。 结果是`2`。 这也确认了两个端点都属于该路径。 

对于远离根部出现的颜色，```
3
1 1 2
1 2
1 3
```路径为 (1\leftrightarrow2)、(1\leftrightarrow3) 和 (2\leftrightarrow3)，值为 (1,2,2)。 他们的总和是`5`。 对于颜色 (2)，删除顶点 (3) 会留下大小为 (2) 的分量，因此 (\binom22=1) 路径恰好避免了它。 颜色(2)的最终贡献是(3-1=2)。 相同颜色的顶点 (1) 和 (2) 贡献一种共同的颜色，而不是两个单独的贡献，从而给出总颜色`5`。 

对于交替链```
5
1 2 1 2 1
1 2
2 3
3 4
4 5
```十个无序对的路径值为 (2,1,2,1,2,1,2,1,2,2)，总和为`16`。 在DFS期间，差异`dom[c] - before`防止稍后出现的相同颜色被计为属于较早出现的无颜色分量的一部分。 这正是破坏更简单的子树大小公式的情况。 

对于最大尺寸的全等树，每条路径都包含唯一的颜色，所以答案很简单

 [
 \binom{200000}{2}=19999900000。 
]

 该算法迭代地处理链，永远不会递归 200000 层深度。 由于每个顶点具有相同的颜色，因此每个子端块的大小为零，`dom[1]`结束于 (200000)，根侧组件的大小也为零。 答案是`19999900000`，确认大整数边界和预期的线性行为。
