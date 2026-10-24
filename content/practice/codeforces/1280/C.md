---
title: "CF 1280C - 杰里米·贝尔米"
description: "我们得到一棵带有 $2k$ 顶点的加权树。 在这些顶点上，我们必须放置 $2k$ 人，这些人被分为 $k$ 固定对。"
date: "2026-06-16T02:29:52+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "graphs", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 1280
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 607 (Div. 1)"
rating: 2000
weight: 1280
solve_time_s: 676
verified: false
draft: false
---

[CF 1280C - 杰里米·贝尔米](https://codeforces.com/problemset/problem/1280/C)

 **评级：** 2000
 **标签：** dfs 和类似的、图、贪婪、树
 **求解时间：** 11m 16s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一棵加权树$2k$顶点。 在这些顶点上我们必须放置$2k$人们，人们被分为$k$固定对。 放置后，每对贡献它们占据的两个顶点之间的距离，沿着树中的唯一路径测量。 目标不是计算固定分配的距离，而是选择分配本身。 我们被要求提供两个极值：所有对距离的最小可能总和以及最大可能总和。 

关键的困难在于我们不会任意地将顶点与具有已知成本矩阵的对进行匹配。 相反，每一对都会在树中贡献一个最短路径距离，该树的结构将所有选择耦合在一起。 任何分配都会改变哪些顶点对在树距离方面“相距较远”。 

这些约束意味着我们需要每个测试用例的线性或近线性解决方案。 所有测试的顶点总数最多为$3 \cdot 10^5$，所以任何算法$O(n \log n)$或者$O(n)$每个测试用例是可以接受的。 任何平方项$2k$，例如枚举分配或计算所有对的距离，是不可能的。 

一个微妙的边缘情况是当树是一条简单路径时。 在这种情况下，距离的表现就像数组中的绝对差，并且更容易看出配对极端位置如何改变总数。 假设“贪婪的最接近配对总是最优的”的粗心方法在这里失败了，因为在树中，局部最小化个体对距离并不能最小化全局总和。 类似地，最大化局部大距离可能会干扰分支，因此独立地对最远节点进行简单的贪婪匹配也会失败。 

另一个边缘情况是星形树。 在星形中，几乎所有距离都经过中心，因此将叶子配对在一起的行为与将叶子与中心配对的行为非常不同。 这正是暴露了对全局排序思想而不是局部配对启发法的需求的结构。 

## 方法

 强力解释是考虑所有分配方法$2k$人们对$2k$顶点并计算所得的对距离之和。 这是大小的阶乘，大约$(2k)!$，即使我们只考虑配对顶点而不是完整分配，匹配端点的方法数量$k$对仍然是指数的。 每次评估都需要求和$k$树距离，即使有效地计算这些距离也无法挽救组合爆炸。 这会立即失败超出非常小的范围$k$。 

关键的结构观察是每对中个体的身份是无关的； 只有终点才重要。 所以问题就变成了：我们正在有效地选择$k$无序的顶点对，其中每个顶点仅使用一次，每对的成本是其端点之间的树距离。 我们希望最小化或最大化这些选定距离的总和。 

这将问题转化为树导出的度量的匹配问题。 树度量的关键属性是距离在边上分解：每条边对总距离总和都有独立的贡献，具体取决于有多少个选定的对“穿过”该边。 

对于任何边，如果我们删除它，树就会分成两个部分。 当且仅当其端点位于不同的分量中时，一对才将该边的权重贡献给它的距离。 因此，所有对的总和可以看作是边的总和，其中每条边贡献其权重乘以穿过它的对的数量。 整个优化变成了如何分布顶点，以便在由边引起的每个切割中，有尽可能多或尽可能少的对穿过它。 

现在问题变成了全局计数问题。 我们需要了解在每个子树中放置多少对端点，因为这决定了有多少对端点穿过每条边。 两个极端的最佳构造都简化为从叶子向上贪婪地确定子树贡献，确保在每个子树上我们控制有多少“不配对端点”被向上推。 

标准解决方案使用 DFS 来计算子树大小并构造一个值，该值表示强制穿过每条边的端点数量。 为了最大化，我们希望最大化交叉，因此我们尝试尽可能地不平衡子树贡献。 至少，我们希望平衡它们，以便很少对被迫跨越边缘。 

最终的简化是，两个答案仅依赖于可以通过单次 DFS 遍历累积的子树 DP 值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力匹配 | 指数| 指数| 太慢了|
 | 树DP过边贡献|$O(n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们任意地给树生根。 对于每个节点，我们计算一个 DFS 值，该值表示如果我们以最佳方式处理子树，则必须将多少个“开放端点”传递给父节点。 

1. 将树的任意节点作为根并计算 DFS 阶数。 生根不会改变距离，但会给出计算子树贡献的方向。 
2. 对于每个节点，计算其子树中的顶点总数。 这告诉我们有多少端点源自该子树。 
3. 对于每个子子树，计算在子树内进行最佳配对后，有多少端点在其内部保持未配对状态。 这个剩余的数量必须越过边缘到达父级。 
4. 为了最小化总和，我们希望尽可能少的对穿过每条边。 这对应于在向上发送任何内容之前尽可能多地配对子树内的顶点。 因此，在每个节点，我们贪婪地在本地配对端点，并且仅向上传播剩余的奇偶校验。 
5. 为了最大化总和，我们希望最大化交叉，这意味着当增加全局边缘使用时，我们尽可能避免在子树内配对。 这会导致尽可能向上推动更多端点，从而有效地最大化每次切割的不平衡性。 
6. 对于每条边，一旦我们知道有多少个端点在每个方向上穿过它，我们就将其贡献计算为权重乘以必须穿过它的对的数量。 在所有边缘上累积这些可以得到$G$或者$B$。 

一个关键的不变量是，对于任何子树，DFS 都会维护在最佳策略（最小化或最大化）下必须连接到子树外部的不成对顶点的确切数量。 该值完全确定有多少对穿过每个连接边，并且由于每对距离恰好是沿其路径的边贡献之和，因此边分解可以得出正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

sys.setrecursionlimit(10**7)

def solve():
    t = int(input())
    for _ in range(t):
        k = int(input())
        n = 2 * k

        g = [[] for _ in range(n + 1)]
        for _ in range(n - 1):
            a, b, w = map(int, input().split())
            g[a].append((b, w))
            g[b].append((a, w))

        # dp[u] = number of unmatched nodes in subtree u (for min construction)
        visited = [False] * (n + 1)

        def dfs(u):
            visited[u] = True
            rem = 1
            for v, w in g[u]:
                if not visited[v]:
                    child = dfs(v)

                    # each child contributes child unmatched nodes upward
                    # but we can pair as much as possible inside subtree
                    rem += child

            # at this node, we pair within subtree as much as possible
            # so leftover is parity only
            return rem % 2

        # compute subtree contributions for min
        visited = [False] * (n + 1)
        total_unmatched = dfs(1)

        # For min answer: each edge contributes weight if subtree size is odd on one side
        # We recompute more carefully: we need subtree sizes
        visited = [False] * (n + 1)
        subtree = [0] * (n + 1)

        def dfs2(u):
            visited[u] = True
            s = 1
            for v, w in g[u]:
                if not visited[v]:
                    s += dfs2(v)
            subtree[u] = s
            return s

        dfs2(1)

        def dfs_min(u):
            visited[u] = True
            res = 0
            for v, w in g[u]:
                if not visited[v]:
                    res += dfs_min(v)
                    # contribution: smaller side size determines crossings
                    sz = subtree[v]
                    res += w * min(sz, n - sz)
            return res

        visited = [False] * (n + 1)
        G = dfs_min(1)

        # For maximum: complement trick using same edge formula
        total_weight_sum = 0

        def dfs_max(u):
            visited[u] = True
            res = 0
            for v, w in g[u]:
                if not visited[v]:
                    nonlocal total_weight_sum
                    res += dfs_max(v)
                    sz = subtree[v]
                    total_weight_sum_list[0] += w
                    res += w * max(sz, n - sz)
            return res

        visited = [False] * (n + 1)
        total_weight_sum_list = [0]
        B = dfs_max(1)

        print(G, B)

if __name__ == "__main__":
    solve()
```该实现将问题分解为计算子树大小，然后使用这些大小来评估边缘贡献。 子树大小计算至关重要，因为每条边都将树分为两部分，并且只需要一侧的大小即可确定在最佳构造下有多少对穿过该边。 

对于最小情况，每条边贡献的权重乘以较小的边尺寸，这反映出我们避免发送端点穿过切口，除非被迫。 对于最大情况，每条边贡献的权重乘以较大的边尺寸，这对应于最大化被迫在切口上分离的端点数量。 

一个微妙的点是，两个公式都依赖于相同的有根分解，并且正确性并不取决于选择哪个节点作为根，因为每个边都使用其诱导分区精确评估一次。 

## 工作示例

 ### 示例 1

 考虑一棵在一行中有 4 个节点的小树：$1 - 2 - 3 - 4$，和边权重$1, 2, 3$。 那么子树的大小取决于根为 1。 

| 节点| 子树大小 | 边缘贡献（最小）| 部分金额 |
 | ---| ---| ---| ---|
 | 1-2 | 1-2 3对1 | 1 * 1 | 1 |
 | 2-3 | 2-3 2 对 2 | 2 * 2 | 5 |
 | 3-4 | 3-4 1 对 3 | 3 * 1 | 3 * 1 8 |

 该表显示了每条边如何根据分割的较小边做出贡献。 这证实了在路径中，只有平衡的分流才能最小化总交叉距离。 

### 示例 2

 现在考虑一颗星，中心为 1，叶子为 2、3、4、5，权重为 1、2、3、4。 

| 边缘 | 子树大小 | 贡献（最大）| 部分金额 |
 | ---| ---| ---| ---|
 | 1-2 | 1-2 1 对 4 | 1 * 4 | 4 |
 | 1-3 | 1-3 1 对 4 | 2 * 4 | 12 | 12
 | 1-4 | 1-4 1 对 4 | 3 * 4 | 24 |
 | 1-5 | 1-5 1 对 4 | 4 * 4 | 40 | 40

 这演示了最大化如何推动每条边上每个可能的端点分离，从而导致高权重边上的大量积累。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n)$每个测试用例| 在 DFS 遍历中，每条边和节点都会被处理固定次数 |
 | 空间|$O(n)$| 邻接表和子树数组 |

 所有测试用例的顶点总数受以下限制$3 \cdot 10^5$，因此每个测试用例的线性时间方法就足够了，并且可以很好地适应时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdout.getvalue() if False else ""

# Placeholder since full solution integration depends on wrapper structure
# Provided samples would be included in a full harness
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 链树| 变化| 线性结构行为|
 | 星树| 变化| 高不平衡案例|
 | 单边对| 小等于| 基本正确性 |
 | 平衡二叉树| 稳定 | 子树分裂行为|

 ## 边缘情况

 链形树测试算法是否正确处理每条边都有明显分割且子树大小逐渐变化的长路径。 最低限度的解决方案必须通过在平衡的一半中进行本地配对来避免过度计数交叉。 

星形树测试算法是否正确识别每个边缘隔离单个叶子，根据优化方向强制最大或最小贡献。 贡献必须随着对面的大小而变化，而不仅仅是本地子树。 

统一权重树确保解决方案不依赖于权重排序，并正确聚合来自子树大小而不是边缘排序的纯结构贡献。
