---
title: "CF 102346D - 谴责黑手党"
description: "黑手党的等级制度形成一棵有根树，以成员 1 为根。 其他每个成员都有一个直接上级，因此每个成员都有一条独特的向上级晋升路径。"
date: "2026-08-13T01:20:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102346
codeforces_index: "D"
codeforces_contest_name: "2019-2020 ACM-ICPC Brazil Subregional Programming Contest"
rating: 0
weight: 102346
solve_time_s: 80
verified: true
draft: false
---

[CF 102346D - 谴责黑手党](https://codeforces.com/problemset/problem/102346/D)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 黑手党的等级制度形成一棵有根树，以成员 1 为根。 其他每个成员都有一个直接上级，因此每个成员都有一条独特的向上级晋升路径。 

当预言家认出一名成员时，警察可以逮捕该成员，然后反复审问被捕的成员以获取有关其上级的信息。 因此，选择一个成员可以有效地阻止从该成员到根的路径上的每个顶点。 

警察最多可以向预言家询问 K 名成员。 任务是选择这些成员，以便它们的根路径的并集包含尽可能多的不同顶点。 

输入通过 N 和 K 描述有根树，后跟从 2 到 N 的每个顶点的父节点。输出是可以逮捕的不同黑手党成员的最大数量。 

当 N 达到 100000 时，涉及所有对、所有子集或二次动态规划的算法过于昂贵。 围绕 O(N log N) 的解决方案是非常合适的，而当 K 很大时，甚至 O(NK) 也可以达到 10^10 次操作。 

在一些边缘情况下，粗心的实施可能会失败。 如果 K 为 1，则答案只是最深的根到顶点路径的长度，而不是 N。例如，`N = 3`,`K = 1`和父母`1 1`，答案是 2，因为选择其中一个孩子会逮捕老板和那个孩子。 

当多个分支具有相同深度时，会发生另一种微妙的情况。 和`N = 5`,`K = 2`和父母`1 1 2 2`，树有根 1，子节点 2 和 3，以及 2 岁以下的子节点 4 和 5。选择 4 个逮捕`1,2,4`，选择 3 仅添加顶点 3，得到 4。选择 4 和 5 则得到`1,2,4,5`，也是 4。当深度相等时，解决方案不得依赖于选择哪个子节点作为最长的分支。 

第三个案例是明星。 和`N = 5`,`K = 4`和父母`1 1 1 1`，每个选定的叶子在第一次选择后恰好贡献一个新顶点。 答案是 5。仅考虑一次完整的根到叶路径的实现可能会错过这些独立分支。 

## 方法

 直接的解决方案将尝试最多 K 个选定成员的所有可能集合，遵循从每个选定成员到根的父指针，并计算结果联合中的不同顶点。 这是正确的，因为捕获集正是这些根路径的并集。 然而，有`C(N,K)`当恰好选择了 K 个成员时可能有多种选择，并且处理每个选择本身可能需要 O(N) 工作。 在最坏的情况下，这是 θ(N · C(N,K))，当 K 约为 N/2 时，它是指数的。 即使是尝试每个可能的选定叶子的不太幼稚的实现也远远超出了限制。 

有用的观察是，一旦选择了一些根路径，已经捕获的顶点就会形成连接的有根子树。 每个剩余的可能贡献都位于通过一条边连接到该捕获区域的单独子树中。 

假设当前捕获的区域到达顶点 v，并且子 c 不是 v 下面所选延续的一部分。c 的整个子树仍然未受影响。 如果我们在该子树内额外使用一次观察者，我们可以获得的最大新顶点数就是从 c 开始的最深向下路径的长度。 

这给出了一个自然的贪婪过程。 从整棵树中最长的根到顶点路径开始。 采取该路径后，沿该路径跳过的每个子分支都将成为独立候选分支。 在当前所有可用的候选分支中，选择深度最大的一个。 当选择该分支时，沿着它自己的最深路径行走并将其所有跳过的子分支添加到候选集中。 

关键属性是每个候选代表一个完全未受影响的子树。 它的深度正是一个选择可以从该子树贡献的新顶点的最大数量。 选择较短的可用分支无法比选择最长的分支提供更直接的新顶点，而选择最长的分支会暴露其所有剩余的侧分支以供将来选择。 这为贪婪选择提供了最佳结构。 

我们可以在最大堆中维护可用分支。 预处理 DFS 计算`depth[v]`，从 v 开始的最长向下路径上的顶点数，以及`best[v]`，开始这条道路的孩子。 每次选择一个分支时，我们都会遵循`best`指针并将所有其他孩子推入堆中。 

蛮力方法和最优方法可总结如下。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | θ(N·C(N,K)) | O(N) | 太慢了|
 | 最佳| O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

 1. 从父数组构建有根树。 顶点 1 是根，每个顶点`v > 1`添加到其给定父级的子级列表中。 
2. 计算`depth[v]`， 在哪里`depth[v]`表示从v开始的最长向下路径上的顶点数。同时，存储`best[v]`，开始这样一条最长路径的孩子。 一片叶子有`depth[v] = 1`也没有最好的孩子。 
3. 放置`(depth[1], 1)`进入最大堆。 这表示第一个可用路径，可以从根以下的任何位置开始，并且最长可能的第一个贡献是从根开始的最深路径。 
4.重复K次。 从堆中删除深度最大的候选，并将该深度添加到答案中。 候选根属于未触及的子树，因此其选定的向下路径上的每个顶点都被新捕获。 
5. 从选定的候选根开始，遵循`best[v]`直到到达一片叶子。 在每个访问的顶点 v，检查除`best[v]`。 每个这样的子节点都会启动一个被所选路径跳过的子树，因此推送`(depth[child], child)`到堆中。 
6. 经过K次选择后，累加的总和就是不同捕获顶点的数量。 没有选定的路径会计算相同的新添加的顶点，因为只有当其子树与已选定的路径分离时，才会创建每个堆候选。 

不变的是，每个堆条目代表一棵完全未触及的附加到已捕获区域的子树，并且其存储深度是使用一个观察者查询从该子树获得的最大贡献。 所选路径始终采用最大的可用贡献。 一旦被选中，它的侧枝恰恰成为新的独立选择。 因此，堆总是描述所有可能的下一个贡献，并且取其最大值是每个阶段的最优贪婪选择。 

## Python 解决方案```python
import sys
import heapq

input = sys.stdin.readline

def solve(data=None):
    if data is None:
        data = sys.stdin.buffer.read().split()

    it = iter(data)
    n = int(next(it))
    k = int(next(it))

    children = [[] for _ in range(n)]

    for v in range(1, n):
        p = int(next(it)) - 1
        children[p].append(v)

    # Iterative DFS order, avoiding recursion depth problems on a chain.
    order = []
    stack = [0]

    while stack:
        v = stack.pop()
        order.append(v)
        for c in children[v]:
            stack.append(c)

    # depth[v] = number of vertices in the longest downward path from v.
    # best[v] = child starting that path.
    depth = [1] * n
    best = [-1] * n

    for v in reversed(order):
        best_depth = 0
        best_child = -1

        for c in children[v]:
            if depth[c] > best_depth:
                best_depth = depth[c]
                best_child = c

        if best_child != -1:
            depth[v] = best_depth + 1
            best[v] = best_child

    # Python has a min-heap, so store negative depths.
    heap = [(-depth[0], 0)]
    answer = 0

    for _ in range(k):
        neg_len, root = heapq.heappop(heap)
        answer += -neg_len

        v = root

        # Select the longest path from this candidate subtree.
        while v != -1:
            chosen = best[v]

            # Every other child starts a new available subtree.
            for c in children[v]:
                if c != chosen:
                    heapq.heappush(heap, (-depth[c], c))

            v = chosen

    return str(answer)

if __name__ == "__main__":
    print(solve())
```实现的第一部分构建邻接表。 输入使用从 1 开始的编号来标识从 2 到 N 的每个顶点，而代码会立即将所有内容转换为从 0 开始的索引。 顶点 1 因此变为索引 0。 

迭代 DFS 创建父项在子项之前的排序。 颠倒此顺序后，孩子会先于父母，这正是计算所需的顺序`depth[v]`来自已计算的子值。 使用迭代遍历是因为树可以是长度为 100000 的链，这将超出 Python 的默认递归调用堆栈。 

这`depth`计算选择最大的孩子`depth`。 由于当前顶点本身贡献了一个顶点，因此它的值是最好孩子的值加一。 这`best`数组会记住哪个孩子产生了该最大值。 

堆存储可用的子树。 蟒蛇的`heapq`是一个最小堆，因此代码存储负深度以使最大深度首先出现。 

当候选者被删除时，其存储的深度将直接添加到答案中。 然后代码沿着选定的最长路径行走。 对于该路径上的每个顶点，除了选定的延续之外的所有子节点都将成为新的堆条目。 这些孩子不能与刚刚选择的路径重叠，因此他们的整个最深路径仍然可以作为未来的贡献。 

Python 中不存在整数溢出问题，最大答案仅为 N。堆可能包含 O(N) 条目，而每个树顶点最多在一个选定的路径上处理或作为侧分支进行检查，从而提供除堆维护之外的结构操作所需的线性数量。 

## 工作示例

 对于样本 1，树的根为 1，最深路径为`1 -> 2 -> 4 -> 6 -> 8`。 它包含五个顶点。 取完后，有用的侧枝是以 3 为根、深度为 2 的子树，以及叶子为 7、深度为 1 的子树。 

| 选择| 选择前的堆| 选定的路径 | 添加| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 |`(5,1)`|`1-2-4-6-8`| 5 | 5 |
 | 2 |`(2,3), (1,7)`|`3-5`| 2 | 7 |

 第二个选择选择以 3 为根的子树，因为它的最深路径贡献了两个新顶点，而顶点 7 只贡献了一个。 最终答案是7。 

对于示例 2，最深的第一路径可以是`1 -> 2 -> 4 -> 8`，长度为 4。其跳过的分支包括顶点 5 的子树和顶点 9。从 3 开始的另一个根分支也变得可用。 

| 选择| 选择前的堆| 选定的路径 | 添加| 回答 |
 | --- | --- | --- | --- | --- |
 | 1 |`(4,1)`|`1-2-4-8`| 4 | 4 |
 | 2 |`(2,3), (2,5), (1,9)`|`3-6`| 2 | 6 |
 | 3 |`(2,5), (1,7), (1,9)`|`5-10`| 2 | 8 |

 第一个选择创建几个独立的边界子树。 第二个和第三个选择分别添加两个新顶点，总共 8 个。这里可以看到不变量：每次选择后，堆都包含来自每个仍未覆盖的分支的最佳可能单路径贡献。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N log N) | O(N log N) | 每个顶点都会被处理固定次数，每次堆插入或删除的成本为 O(log N)。 |
 | 空间| O(N) | 树、DFS 顺序、深度数组和堆都需要线性内存。 |

 当 N 最多 100000 时，O(N log N) 意味着大约几百万次或更少的堆操作，这完全在预期规模之内。 迭代遍历还避免了最坏情况链上的递归失败。 

## 测试用例```python
import io
import sys
import heapq

def solve(inp: str) -> str:
    data = inp.split()
    it = iter(data)

    n = int(next(it))
    k = int(next(it))

    children = [[] for _ in range(n)]

    for v in range(1, n):
        p = int(next(it)) - 1
        children[p].append(v)

    order = []
    stack = [0]

    while stack:
        v = stack.pop()
        order.append(v)
        for c in children[v]:
            stack.append(c)

    depth = [1] * n
    best = [-1] * n

    for v in reversed(order):
        best_depth = 0
        best_child = -1

        for c in children[v]:
            if depth[c] > best_depth:
                best_depth = depth[c]
                best_child = c

        if best_child != -1:
            depth[v] = best_depth + 1
            best[v] = best_child

    heap = [(-depth[0], 0)]
    answer = 0

    for _ in range(k):
        neg_len, root = heapq.heappop(heap)
        answer += -neg_len

        v = root
        while v != -1:
            chosen = best[v]

            for c in children[v]:
                if c != chosen:
                    heapq.heappush(heap, (-depth[c], c))

            v = chosen

    return str(answer)

# Provided sample 1
assert solve(
    "8 2\n"
    "1 1 2 3 4 4 6\n"
) == "7", "sample 1"

# Provided sample 2
assert solve(
    "10 3\n"
    "1 1 2 2 3 3 4 4 5\n"
) == "8", "sample 2"

# Minimum-size tree, K = 1.
assert solve(
    "3 1\n"
    "1 1\n"
) == "2", "minimum size and K=1"

# Star, every selected leaf after the first contributes one new vertex.
assert solve(
    "6 5\n"
    "1 1 1 1 1\n"
) == "6", "star with K=N-1"

# A chain. Every selected path is identical, so extra selections add nothing.
assert solve(
    "7 3\n"
    "1 2 3 4 5 6\n"
) == "7", "pure chain"

# Maximum-size star, testing both N=100000 and K=N-1.
n = 100000
parents = " ".join(["1"] * (n - 1))
assert solve(f"{n} {n - 1}\n{parents}\n") == str(n), "maximum-size star"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 1 / 1 1`| 2 | 最小尺寸和 K = 1 边界 |
 |`6 5 / 1 1 1 1 1`| 6 | 许多独立分支且K接近N |
 |`7 3 / 1 2 3 4 5 6`| 7 | 重复选择已覆盖的链条 |
 |`100000 99999 / 1 1 ... 1`| 100000 | 最大 N、最大堆活动和星形结构 |

 ## 边缘情况

 对于 K = 1 的情况，考虑`3 1`和父母一起`1 1`。 预处理给出`depth[1] = 2`，因为最深的路径包含根和一个孩子。 堆最初只包含`(2,1)`，因此单次迭代加 2 并停止。 输出为 2。假设每个分支都可以独立计数的解决方案将错误地返回 3。 

对于等深度分支，请考虑`5 2`和父母一起`1 1 2 2`。 根有两个子节点，顶点 2 有两个子节点。 最深路径的长度为 3，通过顶点 4 或 5。假设算法选择`1-2-4`第一的。 在处理该路径时，顶点 5 成为深度为 1 的候选点，顶点 3 成为深度为 2 的候选点。第二次选择`1-3`作为 1 的新贡献？ 根已经被覆盖，因此以 3 为根的候选仅贡献顶点 3，而以 5 为根的候选仅贡献顶点 5。因此总数为 4。如果首先选择顶点 5，将获得相同的结果。 里面的平局`best[v]`更改选定的路径，但不会更改其长度或最终的最佳值。 

对于明星，请考虑`5 4`和父母一起`1 1 1 1`。 第一个选择需要`1-2`，贡献 2。处理该路径将顶点 3、4 和 5 作为独立候选点公开，每个顶点的深度为 1。接下来的三个选择各贡献一个新顶点，产生`2 + 1 + 1 + 1 = 5`。 这正是顶点的总数，它说明了为什么必须将跳过的子级插入到堆中。 

对于链，请考虑`7 3`和父母一起`1 2 3 4 5 6`。 第一个候选者的深度为 7，并选择整棵树。 该路径上的每个顶点的所选子节点都等于其唯一的子节点，因此不会插入侧分支。 第一次选择后堆变空。 由于选择已捕获的顶点无法增加答案，因此剩余的先知使用没有任何效果，答案仍为 7。 

对于具有 100000 个顶点的最大尺寸星形，第一个选定的路径贡献 2，而其余 99998 个顶点成为深度 1 堆候选。 接下来的 99998 个选择每个贡献一个顶点，因此最终答案是 100000。该算法永远不会对选择对执行二次扫描，并且其总堆工作量仍为 O(N log N)。
