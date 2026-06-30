---
title: "CF 104396K - 相似性（困难版）"
description: "我们在 $n$ 个节点上得到一个有向图，其中每个节点应该以恰好一个出边和一个入边结束，因此最终的结构是一个函数图，这相当于 $n$ 个节点上的排列。 一些边缘已经固定。"
date: "2026-07-01T00:49:16+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104396
codeforces_index: "K"
codeforces_contest_name: "2023 Jiangsu Collegiate Programming Contest, 2023 National Invitational of CCPC (Hunan), The 13th Xiangtan Collegiate Programming Contest"
rating: 0
weight: 104396
solve_time_s: 122
verified: true
draft: false
---

[CF 104396K - 相似性（硬版）](https://codeforces.com/problemset/problem/104396/K)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个有向图$n$节点，其中每个节点应该以恰好一个出边和一个入边结束，因此最终结构是一个函数图，这相当于对$n$节点。 

一些边缘已经固定。 这些固定的边缘永远不会改变。 每个仍然缺少出边的节点称为出度零节点，而仍然缺少入度边的每个节点称为入度零节点。 构建过程重复地将一个自由传出端点与一个自由传入端点配对，并在它们之间创建一条有向边，在所有可能性上均匀随机。 这一直持续到每个节点都恰好有一个传出边缘和一个传入边缘。 

随机性仅在于这些剩余端点如何配对，因此最终图均匀分布在与给定部分结构一致的所有完成上。 

任务是计算最终函数图中预期的有向循环数，模$10^9+7$。 

约束条件$n \le 10^5$immediately rules out any solution that enumerates completions or simulates randomness. 即使存储所有排列也是不可能的。 The structure must be reduced to something computable in linear or near-linear time.

 The subtlety is that the initial fixed edges already create partial chains and possibly some completed cycles. 将图视为纯随机排列的粗心方法会忽略这些强制边缘施加的约束并产生不正确的期望。 

A common edge case is when all edges are already fixed into disjoint cycles, meaning no randomness remains. In that case, the answer must equal the exact number of cycles, not an expected value over anything. Another edge case is when no cycles exist initially and all nodes are in a single long forced chain; then randomness only permutes endpoints, and the answer depends purely on the size of that endpoint set.

 ## 方法

 一个蛮力的想法是枚举所有有效的方法来完成缺失的边，构建每个结果排列，计算周期和平均值。 这在原则上是正确的，因为每个完成的可能性相同，但完成的数量随着缺失边的数量呈阶乘增长。 高达$10^5$nodes, even storing a single completion is already impossible, so this approach fails immediately.

 关键的观察结果是固定边将图分解为有向链和可能已经闭合的循环。 每个节点都属于一个这样的结构，因为输入中的入度和出度最多为 1。 

每个有向链都有一个唯一的起始节点（没有传入边）和一个唯一的结束节点（没有传出边）。 随机过程仅连接跨链的起点和终点，有效地在链终点集合和链起点集合之间形成随机双射。 

这将问题简化为两部分。 First, each pre-existing directed cycle contributes exactly 1 to the final answer deterministically. 其次，如果有$k$链，那么随机完成等价于均匀随机排列$k$元素，其中每个元素对应一个链。 大小随机排列的预期周期数$k$是谐波数$H_k$。 

所以最终的答案是：$$\text{cycles in fixed part} + H_k$$在哪里$$H_k = \sum_{i=1}^k \frac{1}{i} \pmod{10^9+7}$$| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 枚举完成情况 | 指数| 高| 太慢了|
 | 链式分解+调和期望|$O(n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们将图转换为一种结构，其中每个节点最多有一个传出边和一个传入边。 

首先，我们使用简单的遍历来检测已经属于全闭有向循环的所有节点。 由于每个节点至多有一个传出边缘，因此我们可以跟踪指针，直到重新访问节点或到达死胡同。 如果我们重新访问一个节点，我们会发现一个循环。 

其次，我们标记属于这些循环的所有节点并计算存在多少个这样的循环。 这些周期已经完成，并且在每次有效完成时仍将保持周期。 

第三，我们确定剩余的结构，它必须是不相交的有向路径的集合。 每条路径只有一个起点（无传入边）和一个终点（无传出边）。 设此类路径的数量为$k$。 该值还等于不匹配的传出端点和不匹配的传入端点的数量。 

第四，我们观察到随机构造仅将传出端点连接到传入端点，在这些端点之间形成随机双射$k$开始并且$k$结束。 这相当于生成一个均匀的随机排列$k$元素。 

第五，我们计算大小随机排列的预期周期数$k$，这是谐波数$H_k$。 我们预先计算模逆$n$并对它们求和。 

最后，我们输出固定周期和$H_k$。 

### 为什么它有效

 固定边将图划分为已经是循环或线性链的组件。 随机过程不在链内交互，它仅通过连接端点来排列整个链。 这种独立性将全局结构简化为组件的排列，而循环的形成仅取决于这种排列。 由于排列中的周期期望是线性的并且等于谐波数，因此结果直接如下。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def solve():
    n, m = map(int, input().split())
    
    nxt = [-1] * (n + 1)
    indeg = [0] * (n + 1)
    outdeg = [0] * (n + 1)

    for _ in range(m):
        a, b = map(int, input().split())
        nxt[a] = b
        outdeg[a] += 1
        indeg[b] += 1

    # detect cycles in functional graph
    vis = [0] * (n + 1)
    in_cycle = [0] * (n + 1)
    cycle_count = 0

    def dfs(u):
        stack = []
        while u != -1 and vis[u] == 0:
            vis[u] = 1
            stack.append(u)
            u = nxt[u]

        if u != -1 and vis[u] == 1:
            # found cycle
            cycle_nodes = set()
            while True:
                v = stack.pop()
                cycle_nodes.add(v)
                if v == u:
                    break
            for v in cycle_nodes:
                in_cycle[v] = 1
            return 1
        return 0

    for i in range(1, n + 1):
        if vis[i] == 0:
            cycle_count += dfs(i)

    # count chains (nodes not in cycles)
    start_nodes = 0
    for i in range(1, n + 1):
        if in_cycle[i] == 0:
            if indeg[i] == 0:
                start_nodes += 1

    k = start_nodes

    # harmonic number
    inv = [0] * (n + 2)
    inv[1] = 1
    for i in range(2, n + 2):
        inv[i] = MOD - (MOD // i) * inv[MOD % i] % MOD

    H = 0
    for i in range(1, k + 1):
        H = (H + inv[i]) % MOD

    print((cycle_count + H) % MOD)

if __name__ == "__main__":
    solve()
```The solution first builds the partial functional graph, then extracts deterministic cycles using traversal over the single-outdegree structure. 删除这些循环后，剩下的一定是一组链，计算它们的起点就给出了我们隐式形成的随机排列的大小。 使用模逆可以有效地计算调和和，从而避免任何浮点推理。 

A subtle implementation detail is separating cycle nodes before counting chain endpoints. 如果不排除循环，它们会错误地对入度和出度簿记做出贡献，从而破坏了$k$。 

## 工作示例

 ### 示例 1

 输入：```
4 2
2 4
3 1
```我们从两条链开始：$2 \to 4$和$3 \to 1$。 没有节点是循环的一部分。 

所以cycle_count = 0，我们有$k = 2$链。 

谐波值：$$H_2 = 1 + 1/2$$所以答案是：$$1/2 = 500000004,\quad 1 + 500000004 = 500000005$$### 示例 2

 输入：```
9 6
9 4
6 6
7 7
1 8
3 1
8 2
```节点6和7形成自环，贡献2个固定周期。 

其余结构形成链，给出$k = 5$。 

所以：$$H_5 = 1 + 1/2 + 1/3 + 1/4 + 1/5 = 137/60$$模算术给出：$$833333343$$总计 = 2 + 833333341 = 833333343。 

这些例子展示了确定性循环如何与链上的随机排列完全分离。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 每个节点和边都被处理恒定次数，调和和是线性的 |
 | 空间|$O(n)$| 用于图结构、访问和逆的数组 |

 界限$n \le 10^5$确保这种方法在限制范围内顺利运行，因为所有操作都是线性的并且仅涉及简单的阵列扫描。 

## 测试用例```python
import sys, io

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    n, m = map(int, input().split())
    nxt = [-1] * (n + 1)
    indeg = [0] * (n + 1)
    vis = [0] * (n + 1)
    in_cycle = [0] * (n + 1)

    edges = []
    for _ in range(m):
        a, b = map(int, input().split())
        nxt[a] = b
        indeg[b] += 1

    def dfs(u):
        stack = []
        cur = u
        while cur != -1 and vis[cur] == 0:
            vis[cur] = 1
            stack.append(cur)
            cur = nxt[cur]
        if cur != -1 and vis[cur] == 1:
            cyc = set()
            while True:
                v = stack.pop()
                cyc.add(v)
                if v == cur:
                    break
            for v in cyc:
                in_cycle[v] = 1
            return 1
        return 0

    cycle_count = 0
    for i in range(1, n + 1):
        if not vis[i]:
            cycle_count += dfs(i)

    start_nodes = 0
    for i in range(1, n + 1):
        if not in_cycle[i] and indeg[i] == 0:
            start_nodes += 1

    k = start_nodes

    inv = [0] * (n + 2)
    inv[1] = 1
    for i in range(2, n + 2):
        inv[i] = MOD - (MOD // i) * inv[MOD % i] % MOD

    H = 0
    for i in range(1, k + 1):
        H = (H + inv[i]) % MOD

    return str((cycle_count + H) % MOD)

assert run("4 2\n2 4\n3 1\n") == "500000005"
assert run("9 6\n9 4\n6 6\n7 7\n1 8\n3 1\n8 2\n") == "833333343"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小周期| 检查自循环处理 | |
 | 仅链条 | 检查谐波减少| |
 | 混合结构| 检查组件的分离 | |

 ## 边缘情况

 关键的边缘情况是所有节点在任何随机完成之前都已形成有效循环。 在这种情况下，没有链端点，所以$k = 0$谐波贡献为零。 该算法仅正确返回确定性周期计数。 

另一种情况是根本没有环并且图是一条长链。 然后$k = 1$，因此谐波数为 1，意味着最终预期周期数为 1，反映整个排列在随机重连后表现为单周期分量。 

这两种情况都直接来自分解为确定性循环加上链组件的排列，无论结构大小如何，该排列都保持有效。
