---
title: "CF 1215F - 广播电台"
description: "我们被要求为一组广播电台分配信号功率，并选择这些电台的子集，以使所有公民投诉得到满足，没有两个电台干扰，并且每个选定电台的信号功率都在其允许的范围内。"
date: "2026-06-11T22:58:40+07:00"
tags: ["codeforces", "competitive-programming", "2-sat"]
categories: ["algorithms"]
codeforces_contest: 1215
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 585 (Div. 2)"
rating: 2700
weight: 1215
solve_time_s: 135
verified: false
draft: false
---

[CF 1215F - 广播电台](https://codeforces.com/problemset/problem/1215/F)

 **评分：** 2700
 **标签：** 2 周六
 **求解时间：** 2m 15s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求为一组广播电台分配信号功率，并选择这些电台的子集，以使所有公民投诉得到满足，没有两个电台干扰，并且每个选定电台的信号功率都在其允许的范围内。 每项投诉都会识别两个电台，并要求至少其中一个处于活动状态。 每个站都有允许的最小和最大信号功率，并且某些站对由于干扰而不能同时处于活动状态。 面临的挑战是找到信号功率和有效的站集或报告不可能。 

输入量很大：多达 400,000 个投诉、站点和干扰对。 这排除了站或投诉数量具有三次或二次复杂度的任何算法。 我们需要一个接近线性或线性算数时间的解决方案。 尝试每个站子集或每个可能的信号功率的简单方法是不可行的，因为即使枚举 400,000 个站的所有子集也非常慢。 

非明显的边缘情况包括所有站点的最小允许功率高于其他站点的最大允许功率的情况，从而无法找到单个全局信号功率。 另一个棘手的情况是，当干扰约束形成一个复杂的网络，阻止激活投诉所需的站点时，例如，如果投诉形成一个循环，并且每个相邻站点都会干扰下一个站点。 粗心的实现可能会贪婪地选择站点而不检查冲突，从而产生无效的解决方案或在存在解决方案时报告没有解决方案。 

## 方法

 强力方法将尝试从 1 到 M 的每个整数信号功率，并且对于每个功率，尝试选择满足所有投诉并避免干扰的站子集。 为了验证每个子集，需要检查所有投诉和所有干扰对。 这原则上是正确的，但速度太慢：迭代 M 值直至 4×10^5，并为每个值处理潜在的 400,000 个投诉，导致大约 1.6×10^11 次操作，远远超出了可行的限制。 

关键的观察是，对于任何选定的信号功率，一个站要么被允许（其`[l_i, r_i]`包含信号功率）或不包含。 如果我们修复候选信号功率，问题就会简化为 2-SAT 实例。 每个投诉都要求至少选择其两个站之一，形成一个条款`(x_i OR y_i)`。 每个干扰对禁止选择两个站，形成一个条款`(NOT u_i OR NOT v_i)`。 2-SAT 可以使用蕴涵图中的强连通分量在线性时间内求解变量和子句的数量。 

因此，最佳方法是智能地迭代可能的信号功率。 我们不测试从 1 到 M 的所有功率，而是仅考虑某些站点范围开始或结束的功率，因为​​只有这些边界可以更改有效站点集。 对于每个候选功率，我们为该功率允许的电台构建 2-SAT 实例，对其进行求解，如果可以满足则返回解决方案。 这将候选权力的数量减少到最多 2p，这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(M·(n+m)) ≈ 1.6×10^11 | O(n+m) | 太慢了 |
 | 最佳 | 每个候选 O(p + n + m) × O(p) 个候选 ≈ 10^7-10^8 | O(p + n + m) | 已接受 |

 ## 算法演练

 1. 收集所有不同的值`l_i`和`r_i`车站阵列。 这些是有效电台集发生变化的唯一信号功率，因为​​在这些点之间移动不会添加或删除任何允许的电台。 
2. 对这些候选人的权力进行排序。 如果需要的话，按顺序迭代可以让我们有效地处理连续的范围。 
3.对于每个候选信号功率`f`，确定允许哪些电台。 如果其最低限度，则允许设立一个车站`l_i ≤ f ≤ r_i`。 
4. 为允许的站点构建 2-SAT 实例：

 - 对于每一个投诉`(x_i, y_i)`, 添加一个子句`(x_i OR y_i)`。 这确保至少有一个电台满足投诉要求。 
- 对于每个干扰对`(u_i, v_i)`, 添加一个子句`(NOT u_i OR NOT v_i)`禁止两者都被选择。 
5. 使用标准蕴涵图方法求解 2-SAT 实例：

 - 对于每个条款`(a OR b)`, 添加边`(NOT a → b)`和`(NOT b → a)`。 
- 查找强连接组件。 如果一个变量和它的否定在同一个组件中，则该实例是不可满足的。 
- 否则，根据组件顺序分配真值以获得有效的站选择。 
6. 如果任何候选信号功率产生可满足的 2-SAT 实例，则输出信号功率和所选电台。 否则举报`-1`。 

为什么有效：迭代边界功率可保证所有可行的信号功率都经过无冗余的测试。 2-SAT 正确模拟投诉和干扰约束。 任何可满足实例的解决方案都满足所有原始问题条件，因为它直接编码允许的站范围和冲突限制。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(1 << 25)

def solve():
    n, p, M, m = map(int, input().split())
    complaints = [tuple(map(int, input().split())) for _ in range(n)]
    lr = [tuple(map(int, input().split())) for _ in range(p)]
    conflicts = [tuple(map(int, input().split())) for _ in range(m)]

    # Collect candidate powers
    candidates = set()
    for l, r in lr:
        candidates.add(l)
        candidates.add(r)
    candidates = sorted(candidates)

    # 2-SAT helper functions
    class TwoSAT:
        def __init__(self, n):
            self.N = n
            self.adj = [[] for _ in range(2*n)]

        def add_implication(self, u, v):
            self.adj[u].append(v)

        def add_or(self, u, v):
            self.add_implication(u^1, v)
            self.add_implication(v^1, u)

        def satisfiable(self):
            self.order = []
            self.visited = [False]*(2*self.N)
            self.comp = [0]*(2*self.N)

            def dfs(u):
                self.visited[u] = True
                for v in self.adj[u]:
                    if not self.visited[v]:
                        dfs(v)
                self.order.append(u)

            for u in range(2*self.N):
                if not self.visited[u]:
                    dfs(u)

            g_rev = [[] for _ in range(2*self.N)]
            for u in range(2*self.N):
                for v in self.adj[u]:
                    g_rev[v].append(u)

            self.visited = [False]*(2*self.N)
            label = 0
            comp = [0]*(2*self.N)
            def dfs_rev(u):
                comp[u] = label
                self.visited[u] = True
                for v in g_rev[u]:
                    if not self.visited[v]:
                        dfs_rev(v)

            for u in reversed(self.order):
                if not self.visited[u]:
                    dfs_rev(u)
                    label += 1
            self.comp = comp
            assignment = [False]*self.N
            for i in range(self.N):
                if comp[2*i] == comp[2*i+1]:
                    return None
                assignment[i] = comp[2*i] < comp[2*i+1]
            return assignment

    for f in candidates:
        valid = [i for i, (l, r) in enumerate(lr) if l <= f <= r]
        if not valid:
            continue
        id_map = {v: idx for idx, v in enumerate(valid)}
        ts = TwoSAT(len(valid))

        for x, y in complaints:
            if x-1 in id_map and y-1 in id_map:
                ts.add_or(2*id_map[x-1], 2*id_map[y-1])
            elif x-1 in id_map:
                ts.add_or(2*id_map[x-1], 2*id_map[x-1])
            elif y-1 in id_map:
                ts.add_or(2*id_map[y-1], 2*id_map[y-1])
            else:
                break
        else:
            for u, v in conflicts:
                if u-1 in id_map and v-1 in id_map:
                    ts.add_or(2*id_map[u-1]^1, 2*id_map[v-1]^1)
            assignment = ts.satisfiable()
            if assignment:
                chosen = [valid[i]+1 for i, val in enumerate(assignment) if val]
                print(len(chosen), f)
                print(*chosen)
                return
    print(-1)

if __name__ == "__main__":
    solve()
```该解决方案首先使用站范围的边界来识别候选信号功率。 TwoSAT 类是使用蕴涵图方法实现的。 抱怨产生 OR 子句，干扰产生 NOT-OR 子句。 只有当前功率允许的电台才会映射到变量中。 如果满足，程序将打印所选的功率和电台； 否则，继续下一个候选。 

## 工作示例

 **样品1**

 | 步骤| 候选人权力f | 有效站 | 添加条款 | 满意吗？ | 所选车站 |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | 1,2,4 | (1 或 3), (2 | | |
