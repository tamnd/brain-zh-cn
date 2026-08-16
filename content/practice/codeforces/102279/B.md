---
title: "CF 102279B - 开始寻找节点"
description: "我们有一棵树，有多达 200,000 个顶点，其中一个未知的顶点包含隐藏的秘密。 该程序可以使用两个查询与交互器进行通信。 类型 1 查询询问从选定顶点到隐藏顶点的距离。"
date: "2026-08-16T19:10:56+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102279
codeforces_index: "B"
codeforces_contest_name: "HCW 19 Team Round (ICPC format)"
rating: 0
weight: 102279
solve_time_s: 129
verified: true
draft: false
---

[CF 102279B - 开始寻找节点](https://codeforces.com/problemset/problem/102279/B)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵树，有多达 200,000 个顶点，其中一个未知的顶点包含隐藏的秘密。 该程序可以使用两个查询与交互器进行通信。 类型 1 查询询问从选定顶点到隐藏顶点的距离。 类型 2 查询询问位于通往隐藏顶点的路径上的所选顶点的邻居。 如果所选顶点已经是隐藏顶点，则类型 2 返回零。 目标是使用最多 36 个查询来识别隐藏顶点。 该问题是真正的交互式问题，因此输入仅包含树，而查询的答案在执行期间到达。 

该树有 200,000 个顶点，因此在 36 个查询限制下，使用查询扫描所有顶点是不可能的。 尽管对树进行线性预处理是完全合理的，但在最坏的情况下，每个顶点进行一次查询将需要 200,000 次查询。 预期的解决方案必须使可能的隐藏顶点集在每次查询后以几何方式缩小。 

有三种边缘情况特别容易处理不当。 第一个是单顶点树：```
1
```唯一的顶点必然是答案，所以正确的输出是`1`。 假设每个类型 2 答案都是有效邻居的粗心实现将会失败，因为交互器在查询隐藏顶点本身时返回零。 

第二种情况是双顶点树：```
2
1 2
```如果隐藏顶点为 2，则使用类型 2 查询顶点 1 将返回 2。然后该算法必须在包含 2 的单顶点组件内继续并再次查询它，接收零。 在第一个非零响应之后停止将输出邻居而不是隐藏的顶点。 

第三个案例是明星：```
5
1 2
1 3
1 4
1 5
```如果隐藏顶点为 5，则顶点 1 是质心。 1 处的类型 2 查询立即识别出唯一相关的组件，即包含 5 的单例。算法必须从剩余的树中切除质心，而不是全局丢弃返回的邻居或将响应视为最终答案。 

官方社论给出了 LCA、DFS 和二分搜索解决方案，并提到质心分解作为替代方案。 下面的方法直接使用质心思想，这使得查询边界特别透明。 

## 方法

 一个简单的策略是对每个顶点进行类型 1 查询，直到返回的距离为零。 这是正确的，因为恰好有一个顶点与隐藏顶点的距离为零。 问题是查询限制。 在最坏的情况下，隐藏顶点是最后一个测试的顶点，需要 200,000 次查询，而交互器只允许 36 次。 

暴力方法之所以有效，是因为距离查询提供了有关测试顶点是否是答案的完整信息。 它失败了，因为它花费了一个查询来区分一个候选者。 我们需要一个查询，其答案可以立即消除大部分候选者。 

关键的观察是树质心的定义。 每棵树都有一个顶点，删除该顶点后，每个生成的连通分量最多包含原始顶点的一半。 假设当前的一组可能的隐藏顶点形成一个连通分量，并且我们选择它的质心`c`。 

类型 2 查询位于`c`正好给出路径上的第一条边`c`到隐藏的顶点。 如果答案为零，`c`它本身被隐藏了，我们就完成了。 否则，假设答案是`v`。 由于隐藏的顶点位于更远的地方`v`，它必须属于包含`v`后`c`被删除。 我们可以完全丢弃所有其他组件。 

重要的是，剩余组件的顶点数最多只有前一个组件的一半。 我们对该组件重复相同的操作。 这正是质心分解背后的查询模式，它在每​​次查询后将可能的顶点数量减少了大约两倍。 外部竞赛材料中也描述了针对此问题的基于质心的解决方案，作为解决该任务的自然方法。 

对于 200,000 个顶点，18 次减半就足够了，因为`2^18 = 262144`。 因此，该算法最多使用 18 个类型 2 查询，远低于 36 个限制。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n) 查询和 O(n) 本地工作 | O(n) | 太慢了 |
 | 质心搜索 | O(n log n) 本地工作和 O(log n) 查询 | O(n) | 已接受 |

 ## 算法演练

 1. 构建树的邻接表。 我们将反复检查通过切割先前选择的质心获得的连接组件，因此原始树本身不需要修改。 
2. 维护一个布尔值`blocked`大批。 被阻挡的顶点表示已经从当前搜索空间中移除的质心。 包含隐藏顶点的组件始终由一个未阻塞的起始顶点表示。 
3、从当前顶点开始，只遍历未被遮挡的顶点，收集整个当前分量。 在此遍历过程中，为每个访问过的顶点存储一个父顶点。 在 Python 中迭代遍历是更可取的，因为树可以是长度为 200,000 的路径，这将超出正常的递归限制。 
4. 通过反向处理遍历顺序来计算收集组件内的子树大小。 对于每个顶点，其父侧组件的大小为`total_size - subtree_size[v]`，而每个孩子都贡献自己的子树大小。 
5. 找到一个顶点`c`每个结果组件的大小最多`total_size / 2`。 这样的顶点就是质心。 我们可以简单地扫描当前组件中的所有顶点并使用子树大小测试此条件。 
6.询问互动者`? 2 c`。 如果答案为零，则质心本身就是隐藏顶点，因此打印`! c`并终止。 
7. 如果答案是一个顶点`v`， 堵塞`c`并使`v`下一次迭代的起始顶点。 边缘从`c`朝向`v`现已有效削减。 因为`v`位于路径上`c`对于隐藏顶点，隐藏顶点保证位于这个新组件内部。 
8. 重复直到类型 2 查询返回零。 每次迭代都会将可能的顶点数量减少至少一半，因此最多需要 18 次查询`n <= 200000`。 

### 为什么它有效

 保持当前未被阻挡的组件包含隐藏顶点的不变量。 最初，整个树都是当前组件，因此不变量为真。 当其质心`c`被查询，非零答案`v`是的邻居`c`走在独特的道路上`c`到隐藏的顶点。 去除`c`因此，将隐藏顶点恰好保留在包含的组件中`v`。 该算法精确地保留了该分量，因此不变量仍然成立。 如果查询返回零，则交互器已确定`c`是隐藏顶点，因此算法可以安全地输出它。 

质心属性保证保留的组件最多包含前一个组件的一半。 从最多 200,000 个顶点开始，经过 18 次这样的缩减后，只剩下不到 1 个顶点，因此必须在超过 36 个查询限制之前识别出隐藏顶点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(1_000_000)

def find_centroid(start, graph, blocked, parent, size):
    order = [start]
    parent[start] = 0

    for v in order:
        pv = parent[v]
        for to in graph[v]:
            if blocked[to] or to == pv:
                continue
            parent[to] = v
            order.append(to)

    total = len(order)

    for v in reversed(order):
        size[v] = 1
        pv = parent[v]
        for to in graph[v]:
            if blocked[to] or parent[to] != v:
                continue
            size[v] += size[to]

    for v in order:
        largest = total - size[v]

        for to in graph[v]:
            if blocked[to] or parent[to] != v:
                continue
            if size[to] > largest:
                largest = size[to]

        if largest * 2 <= total:
            return v

    return start

def ask(t, v):
    print("?", t, v, flush=True)
    ans = int(input())
    if ans == -1:
        sys.exit(0)
    return ans

def main():
    n = int(input())

    graph = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        u, v = map(int, input().split())
        graph[u].append(v)
        graph[v].append(u)

    blocked = [False] * (n + 1)
    parent = [0] * (n + 1)
    size = [0] * (n + 1)

    current = 1
    queries = 0

    while True:
        centroid = find_centroid(
            current,
            graph,
            blocked,
            parent,
            size
        )

        queries += 1
        if queries > 36:
            sys.exit(0)

        nxt = ask(2, centroid)

        if nxt == 0:
            print("!", centroid, flush=True)
            return

        blocked[centroid] = True
        current = nxt

if __name__ == "__main__":
    main()
```邻接表存储原始树。 不会物理删除任何边，因为这样做需要更新多个邻接表。 反而，`blocked[v]`使先前选择的质心对于所有未来的组件遍历不可见。`find_centroid`首先遍历当前连接的组件。 这`order`列表按父子之前的顺序包含其顶点。 向后处理这个列表可以得到每个子树的大小，无需递归。 这对于 Python 特别有用，因为路径形树可以包含 200,000 个嵌套顶点。 

对于一个顶点`v`,`size[v]`是其子树相对于临时根的大小`start`。 去除`v`在父侧创建一个可能的组件，其大小为`total - size[v]`，为每个具有尺寸的孩子加上一个组件`size[child]`。 当这些值中的最大值最多为一半时，该顶点就是质心`total`。 

这`ask`函数打印查询并立即刷新标准输出。 在交互式问题中，刷新是强制性的，因为交互器无法回答仍处于缓冲状态的查询。 如果交互者返回`-1`，协议规定程序必须终止。 

仅需要类型 2 查询。 非零答案本身并不是隐藏顶点。 它是通往隐藏顶点的路径上当前质心之后的第一个顶点，因此它告诉我们要保留哪个半大小的组件。 

从技术上讲，查询计数器对于正确性来说是不必要的，因为质心参数已经证明对于最大输入大小最多进行 18 次查询。 将其保留在实现中可以使意外的协议违规安全地失败。 

组件遍历或质心计算中没有递归。 这避免了路径形树上的 Python 堆栈溢出。 Python 整数也不存在子树大小的溢出问题，尽管所有相关大小无论如何都最多只有 200,000。 

## 工作示例

 该声明提供了一份互动记录。 它的树是```
7
2 1
2 4
3 5
6 2
1 3
2 7
```记录显示隐藏顶点为 3。 

完整的七顶点树的质心是顶点 2。删除 2 个叶子组件的大小为 1、1、1 和 3，因此每个组件的大小最多为 3。 

| 当前组件| 尺寸| 质心| 类型 2 答案 | 下一个组件 | 裁剪后尺寸|
 | ---| ---| ---| ---| ---| ---|
 |`{1,2,3,4,5,6,7}`| 7 | 2 | 1 |`{1,3,5}`| 3 |
 |`{1,3,5}`| 3 | 3 | 0 | 完成 | 1 |

 第一个查询有效`? 2 2`，交互器返回 1，因为从 2 到隐藏顶点 3 的路径从边开始`2 -> 1`。 在块 2 之后，唯一相关的组件是`{1,3,5}`。 它的质心是 3。查询 3 返回零，因此答案是 3。这演示了中心不变量：在每个非零答案之后，隐藏顶点保留在所选组件中。 

对于第二个示例，考虑一颗星，其中心为顶点 1，隐藏顶点为 5。```
6
1 2
1 3
1 4
1 5
1 6
```该中心本身就是质心，因为移除它会留下五个大小为 1 的分量。 

| 当前组件| 尺寸| 质心| 类型 2 答案 | 下一个组件 | 裁剪后尺寸|
 | ---| ---| ---| ---| ---| ---|
 |`{1,2,3,4,5,6}`| 6 | 1 | 5 |`{5}`| 1 |
 |`{5}`| 1 | 5 | 0 | 完成 | 1 |

 第一个查询立即识别包含隐藏顶点的分支。 第二个查询是对该单例组件进行的并返回零。 此示例说明了为什么非零类型 2 响应应被解释为方向，而不是最终答案。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 每次质心搜索迭代都会扫描其当前组件，其大小呈几何减小 |
 | 空间| O(n) | 邻接表和辅助数组都需要线性空间 |
 | 查询 | O(log n) | 每个查询将候选组件最多减少到先前大小的一半 |

 为了`n = 200000`，最多可以有 18 个质心查询，因为`2^18 = 262144`。 本地树处理执行几何扫描序列，边界为`O(n log n)`，它很容易兼容编译实现中的 2 秒和 256 MB 限制，并且在具有迭代遍历的 Python 中也很实用。 

## 测试用例

 因为这是一个交互问题，所以发布的样本是交互记录而不是普通的确定性输入/输出对。 一个正常的`run(input)`助手无法重现交互器。 以下测试工具使用固定的隐藏顶点并模拟类型 2 答案。 离线求解器镜像提交的质心算法，而模拟器将树植根于隐藏顶点，以便查询顶点的父节点恰好是交互器的类型 2 响应。```python
import io
import sys

def solve_offline(inp: str, hidden: int):
    data = list(map(int, inp.split()))
    it = iter(data)

    n = next(it)
    graph = [[] for _ in range(n + 1)]

    for _ in range(n - 1):
        u = next(it)
        v = next(it)
        graph[u].append(v)
        graph[v].append(u)

    # Simulate the interactor's type-2 answers.
    parent_hidden = [0] * (n + 1)
    order = [hidden]

    for v in order:
        for to in graph[v]:
            if to == parent_hidden[v]:
                continue
            parent_hidden[to] = v
            order.append(to)

    blocked = [False] * (n + 1)
    parent = [0] * (n + 1)
    size = [0] * (n + 1)

    def find_centroid(start):
        order = [start]
        parent[start] = 0

        for v in order:
            for to in graph[v]:
                if blocked[to] or to == parent[v]:
                    continue
                parent[to] = v
                order.append(to)

        total = len(order)

        for v in reversed(order):
            size[v] = 1
            for to in graph[v]:
                if blocked[to] or parent[to] != v:
                    continue
                size[v] += size[to]

        for v in order:
            largest = total - size[v]

            for to in graph[v]:
                if blocked[to] or parent[to] != v:
                    continue
                largest = max(largest, size[to])

            if largest * 2 <= total:
                return v

        return start

    current = 1
    queries = 0

    while True:
        centroid = find_centroid(current)
        queries += 1

        if centroid == hidden:
            return centroid, queries

        nxt = parent_hidden[centroid]
        blocked[centroid] = True
        current = nxt

# Provided sample tree. The interaction transcript establishes hidden = 3.
sample = """\
7
2 1
2 4
3 5
6 2
1 3
2 7
"""
assert solve_offline(sample, 3) == (3, 2), "sample"

# Minimum-size tree.
case_min = """\
1
"""
assert solve_offline(case_min, 1) == (1, 1), "minimum tree"

# Two vertices, hidden at the second vertex.
case_two = """\
2
1 2
"""
assert solve_offline(case_two, 2) == (2, 2), "two-vertex boundary"

# Star, testing a highly branching tree and an immediate singleton component.
case_star = """\
5
1 2
1 3
1 4
1 5
"""
assert solve_offline(case_star, 5) == (5, 2), "star"

# Maximum-size path, hidden at the final vertex.
n = 200000
case_max = str(n) + "\n" + "\n".join(
    f"{i} {i + 1}" for i in range(1, n)
) + "\n"

answer, queries = solve_offline(case_max, n)
assert answer == n, "maximum-size path answer"
assert queries <= 18, "centroid query bound"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`7`具有六个样本边缘，隐藏`3`|`3`| 提供交互示例和法向质心缩减 |
 |`1`|`1`| 最小输入、零响应查询 |
 |`2`有边缘`1 2`, 隐藏`2`|`2`| 第一次剪切后的单例组件 |
 | 五顶点星形中心位于`1`, 隐藏`5`|`5`| 高度分支树和定向 2 型响应 |
 | 具有 200,000 个顶点的隐藏路径`200000`|`200000`| 最大尺寸、深度树、迭代遍历和查询绑定 |

 最大尺寸测试故意使用路径，因为它是递归树算法最差的形状。 提交的解决方案永远不会通过路径递归，并且质心进程在每次查询时将其减少到大约剩余长度的一半。 

## 边缘情况

 对于一棵单顶点树，```
1
```唯一可能的电流分量是`{1}`，其质心为1。类型2查询`? 2 1`返回零，因为顶点 1 是隐藏顶点。 程序立即打印`! 1`。 没有尝试将零解释为邻居，因此边界情况得到正确处理。 

对于二顶点树```
2
1 2
```对于隐藏顶点 2，初始质心为 1。1 处的类型 2 查询返回 2。然后顶点 1 被阻塞，留下单例组件`{2}`。 它的质心是2，下一个类型2查询返回零。 该算法在两次查询后打印 2。 这是最小的例子，展示了为什么非零类型 2 响应意味着“继续朝这个方向”而不是“回答这个顶点”。 

对于五顶点星```
5
1 2
1 3
1 4
1 5
```由于隐藏顶点 5，顶点 1 是质心。 查询它返回 5，因此所有其他叶子可以立即被丢弃。 下一个组件仅包含顶点 5，其查询返回零。 该算法使用两个查询，并且不需要距离信息。 

对于最大尺寸路径，第一个质心位于中间附近。 如果隐藏顶点位于一个端点，则类型 2 答案选择包含该端点的一半。 下一个质心再次位于该一半的中间附近，并且相同的过程继续进行。 因此，尽管深度为 199,999，但包含 200,000 个顶点的路径最多需要 18 次查询。 迭代遍历可以防止路径深度导致 Python 递归失败。 

所有这些示例的中心边缘情况是其余组件具有一个顶点的时刻。 质心必然是该顶点，并且类型 2 返回零。 该实现在阻止质心之前检查此响应，因此它永远不会意外地从搜索空间中删除正确的答案。
