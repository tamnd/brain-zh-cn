---
title: "CF 106433F - 断线操作"
description: "网络是一棵代理树。 必须恰好将 k 个代理标记为活动状态。 每个通信通道的两个端点接收不同的状态（一个活动，一个不活动），贡献一分。"
date: "2026-06-25T09:38:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106433
codeforces_index: "F"
codeforces_contest_name: "XXX Spain Olympiad in Informatics, online qualifier"
rating: 0
weight: 106433
solve_time_s: 39
verified: true
draft: false
---

[CF 106433F - 断线操作](https://codeforces.com/problemset/problem/106433/F)

 **评级：** -
 **标签：** -
 **求解时间：** 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 网络是一棵代理树。 确切地`k`代理必须标记为活动状态。 每个通信通道的两个端点接收不同的状态（一个活动，一个不活动），贡献一分。 目标是选择活性剂以使此类交叉通道的数量尽可能大。 

因为网络是一棵树，所以每对代理之间都有唯一的路径。 此属性消除了循环并使子树动态编程方法变得自然。 

约束条件`n <= 2000`是主要线索。 二次解是现实的，因为所有测试用例的顶点总数也只有 2000 个。`O(n^2)`每个测试用例都是安全的，而枚举子集或尝试所有选择的解决方案`k`顶点是不可能的，因为可能的选择数量呈指数增长。 

重要的边缘情况来自于的精确值`k`以及从树的结构来看。 

为了`k = 0`，没有代理处于活动状态，因此没有边可以连接不同的组。 例如：```
Input
1
2 0
1 2
```答案是：```
0
```假设至少有一个活动顶点的粗心解决方案可能会访问无效状态或错误地计算边数。 

为了`k = n`，每个代理都是活跃的，所以同样没有交叉边。 例如：```
Input
1
3 3
1 2
2 3
```答案是：```
0
```尝试最大化所选顶点的度数的贪心方法可能会失败，因为选择所有顶点会删除所有可能的边界。 

链的行为也与星形不同。 考虑：```
Input
1
5 2
1 2
1 3
1 4
1 5
```答案是：```
3
```选择中心和一片叶子仅给出三个交叉边。 选择两个叶子仅给出两个交叉边。 仅基于选择高度顶点的策略可能会忽略考虑所选顶点如何与其子节点交互的需要。 

## 方法

 直接的暴力解决方案会尝试所有可能的组`k`活动代理，计算活动组和非活动组之间交叉的边，并保留最大值。 这是正确的，因为每个有效的选择都会被检查。 然而，选择的数量是`C(n, k)`，即使对于中等程度的人来说，这也会变得巨大`n`。 和`n = 2000`，枚举子集是完全不可能的。 

树结构为我们提供了一种构建答案而不是猜测答案的方法。 当我们为树建立根时，每条边都将一个顶点与其子节点之一连接起来。 该边是否起作用仅取决于两个端点的状态。 这意味着每个子树都可以总结其中所有可能的选择。 

一维子树 DP 中缺少的信息是该子树的根是否处于活动状态。 包含活动顶点的子子树不一定使其父级的边成为交叉边，因为子树本身可能仍处于非活动状态。 我们通过保持两种状态来解决这个问题：一种是当前顶点处于活动状态，另一种是当前顶点处于非活动状态。 

蛮力之所以有效，是因为它检查所有可能的活动集，但会失败，因为活动集太多。 每个边缘贡献仅取决于两个端点的观察结果使我们能够将较小子树的最佳答案与背包式合并相结合。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(C(n,k) * n) | O(C(n,k) * n) | O(n) | 太慢了|
 | 树DP | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1.在任意顶点处建立树的根，例如vertex`1`，并运行深度优先搜索。 DFS 顺序让我们可以在处理父级之前处理子级。 
2. 对于每个顶点`v`，维护两个数组。`active[v][i]`是子树内交叉边的最大数量`v`确切的时候`i`顶点是活动的并且`v`本身是活跃的。`inactive[v][i]`当`v`本身是不活动的。 
3. 用两种可能性初始化每个顶点。 如果`v`处于活动状态，子树当前包含一个活动顶点并贡献零交叉边。 如果`v`处于非活动状态，它包含零个活动顶点并且还提供零交叉边。 
4. 使用背包转换将每个子子树合并到当前顶点。 假设子子树贡献`j`活动顶点。 如果`v`是活跃的，选择一个活跃的子根使用`active[child][j]`，在选择不活动的子根时使用`inactive[child][j] + 1`因为之间的边缘`v`孩子穿过隔断。 
5. 执行对称转换时`v`处于非活动状态。 选择活动子根会添加一个交叉边，而选择非活动子根则不会。 
6. 合并所有子节点后，答案是使 root 处于活动状态更好`k`活动顶点或使其不活动`k`活动顶点。 

为什么它有效：

 不变的是，在处理一个顶点之后，每个 DP 状态在该子树内为每个可能数量的活动顶点存储最佳可能数量的交叉边，同时尊重子树根的状态。 当其父项和子项合并时，每条边都被仅考虑一次。 此时 DP 状态知道两个端点的状态，因此边沿要么在交叉时被准确计数，要么在未交叉时被忽略。 由于每个子树组合都是通过背包合并来探索的，因此最终的根状态代表了准确的最佳可能选择`k`活动顶点。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(n, k, edges):
    graph = [[] for _ in range(n)]
    for u, v in edges:
        u -= 1
        v -= 1
        graph[u].append(v)
        graph[v].append(u)

    active = [None] * n
    inactive = [None] * n
    size = [0] * n

    def dfs(v, p):
        size[v] = 1
        active[v] = [-10**9] * 2
        inactive[v] = [-10**9] * 2

        active[v][1] = 0
        inactive[v][0] = 0

        for u in graph[v]:
            if u == p:
                continue
            dfs(u, v)

            new_active = [-10**9] * (size[v] + size[u] + 1)
            new_inactive = [-10**9] * (size[v] + size[u] + 1)

            for i in range(size[v] + 1):
                if active[v][i] > -10**9:
                    for j in range(size[u] + 1):
                        if active[u][j] > -10**9:
                            new_active[i + j] = max(
                                new_active[i + j],
                                active[v][i] + active[u][j]
                            )
                        if inactive[u][j] > -10**9:
                            new_active[i + j] = max(
                                new_active[i + j],
                                active[v][i] + inactive[u][j] + 1
                            )

                if inactive[v][i] > -10**9:
                    for j in range(size[u] + 1):
                        if active[u][j] > -10**9:
                            new_inactive[i + j] = max(
                                new_inactive[i + j],
                                inactive[v][i] + active[u][j] + 1
                            )
                        if inactive[u][j] > -10**9:
                            new_inactive[i + j] = max(
                                new_inactive[i + j],
                                inactive[v][i] + inactive[u][j]
                            )

            size[v] += size[u]
            active[v] = new_active[:size[v] + 1]
            inactive[v] = new_inactive[:size[v] + 1]

    dfs(0, -1)
    return max(active[0][k], inactive[0][k])

def main():
    t = int(input())
    ans = []
    for _ in range(t):
        n, k = map(int, input().split())
        edges = [tuple(map(int, input().split())) for _ in range(n - 1)]
        ans.append(str(solve_case(n, k, edges)))
    print("\n".join(ans))

if __name__ == "__main__":
    main()
```邻接表存储树，因为每个顶点可以有许多邻居，并且输入仅给出边。 DFS 将无向树转换为有根子树。 

两个 DP 阵列是核心实现细节。`active[v][i]`和`inactive[v][i]`具有不同的含义，这避免了当子子树包含活动顶点但子树本身不活动时计算边的常见错误。 

在合并过程中，循环会尝试在已处理的部分之间对活动顶点进行所有可能的分割。`v`和新的子子树。 仅当端点状态不同时，转换才会添加 1。 初始状态处理边界情况`0`和`1`子树内的活动顶点。 

Python 整数不会溢出，但仍然需要负哨兵值来表示不可能的状态。 答案总是可以在索引中找到`k`，因为该问题恰好需要那么多的活动顶点。 

## 工作示例

 ### 示例 1

 输入：```
3
3 2
1 2
2 3
5 2
1 2
1 3
1 4
1 5
2 0
1 2
```对于第一棵树：

 | 顶点| 状态| 活跃计数 | 最佳交叉边缘 |
 | --- | --- | --- | --- |
 | 1 | 不活跃 | 2 | 2 |
 | 1 | 活跃 | 2 | 1 |
 | 回答 | | | 2 |

 最优选择激活链的两个端点。 两条边都穿过隔板。 

对于第二棵树：

 | 顶点| 状态| 活跃计数 | 最佳交叉边缘 |
 | --- | --- | --- | --- |
 | 1 | 活跃 | 2 | 3 |
 | 1 | 不活跃 | 2 | 2 |
 | 回答 | | | 3 |

 激活中心和一片叶子会与其余叶子创建三个交叉边缘。 

### 示例 2

 输入：```
1
4 1
1 2
2 3
3 4
```| 顶点| 状态| 活跃计数 | 最佳交叉边缘 |
 | --- | --- | --- | --- |
 | 1 | 活跃 | 1 | 1 |
 | 2 | 活跃 | 1 | 2 |
 | 3 | 活跃 | 1 | 2 |
 | 4 | 活跃 | 1 | 1 |
 | 回答 | | | 2 |

 最好的单个活动顶点是中间顶点之一，因为它有两个可以交叉的入射边。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 每个树边对可能的活动计数执行背包合并。 |
 | 空间| O(n^2) | O(n^2) | 在最坏的情况下，跨所有顶点存储的 DP 数组包含二次总信息。 |

 最大总计`n`在所有情况下都是 2000，因此二次算法完全符合限制。 该实现仅存储当前树的数组，保持内存使用实用。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().split()
    sys.stdin = old

    if not data:
        return ""

    it = iter(data)
    t = int(next(it))
    out = []

    def solve_case(n, k, edges):
        graph = [[] for _ in range(n)]
        for u, v in edges:
            u -= 1
            v -= 1
            graph[u].append(v)
            graph[v].append(u)

        A = [None] * n
        B = [None] * n
        sz = [0] * n

        def dfs(v, p):
            sz[v] = 1
            A[v] = [-10**9, 0]
            B[v] = [0, -10**9]

            for u in graph[v]:
                if u == p:
                    continue
                dfs(u, v)
                na = [-10**9] * (sz[v] + sz[u] + 1)
                nb = [-10**9] * (sz[v] + sz[u] + 1)
                for i in range(sz[v] + 1):
                    for j in range(sz[u] + 1):
                        if i < len(A[v]) and j < len(A[u]):
                            na[i+j] = max(na[i+j], A[v][i] + A[u][j])
                        if i < len(A[v]) and j < len(B[u]):
                            na[i+j] = max(na[i+j], A[v][i] + B[u][j] + 1)
                        if i < len(B[v]) and j < len(A[u]):
                            nb[i+j] = max(nb[i+j], B[v][i] + A[u][j] + 1)
                        if i < len(B[v]) and j < len(B[u]):
                            nb[i+j] = max(nb[i+j], B[v][i] + B[u][j])
                sz[v] += sz[u]
                A[v] = na[:sz[v]+1]
                B[v] = nb[:sz[v]+1]

        dfs(0, -1)
        return max(A[0][k], B[0][k])

    for _ in range(t):
        n = int(next(it))
        k = int(next(it))
        edges = []
        for _ in range(n - 1):
            edges.append((int(next(it)), int(next(it))))
        out.append(str(solve_case(n, k, edges)))

    return "\n".join(out)

assert run("""3
3 2
1 2
2 3
5 2
1 2
1 3
1 4
1 5
2 0
1 2
""") == "2\n3\n0", "samples"

assert run("""1
2 1
1 2
""") == "1", "minimum tree"

assert run("""1
5 5
1 2
2 3
3 4
4 5
""") == "0", "all active"

assert run("""1
5 0
1 2
1 3
1 4
1 5
""") == "0", "none active"

assert run("""1
4 1
1 2
2 3
3 4
""") == "2", "middle vertex choice"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 三个示例案例|`2, 3, 0`| 基本正确性和边界`k`价值观 |
 | 两个顶点，其中一个处于活动状态 |`1`| 最小的树 |
 | 整棵树都处于活动状态 |`0`| 当所有顶点共享一个状态时没有交叉边 |
 | 没有活动顶点 |`0`| 空选择集处理 |
 | 具有一个活动顶点的链 |`2`| 选择内部顶点而不是叶子 |

 ## 边缘情况

 当`k = 0`，除了完全不活动状态之外的每个 DP 状态在根上都是不可能的。 为了：```
1
2 0
1 2
```DFS 从每个叶子开始，仅通过其非活动状态允许零个活动顶点。 合并永远不会创建交叉边，因为两个端点都保持不活动状态，给出答案`0`。 

什么时候`k = n`，每个顶点都必须是活动的。 DP 只能在整个树中使用活动状态。 由于每条边都有两个活动端点，因此没有过渡会增加交叉贡献。 为了：```
1
3 3
1 2
2 3
```答案依然存在`0`。 

对于星形树：```
1
5 2
1 2
1 3
1 4
1 5
```根有四个孩子。 DP 将选择具有一片叶子的中心与选择两片叶子进行比较。 中心选择创建了三个具有不同端点状态的子边，因此达到了最优答案`3`。 

对于链条：```
1
4 1
1 2
2 3
3 4
```DP 为每个子树保留两种根状态可能性。 它发现选择顶点`2`或者`3`给出两个交叉边，而选择端点仅给出一个。 这正是基于局部度的贪婪选择是不够的情况。
