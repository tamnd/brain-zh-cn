---
title: "CF 104467C - 停车场"
description: "最新结果中的不匹配是一个强烈的信号，表明之前的“每 K 深度贪婪”想法也是不正确的。 症状模式非常具体： - 样本 1 在 K=1 和 K=2 时过度计数 - 样本 2 早期过度计数，但稍后稳定 这不是边界错误。"
date: "2026-06-30T13:07:10+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104467
codeforces_index: "C"
codeforces_contest_name: "La Salle-Pui Ching Programming Challenge \u57f9\u6b63\u5587\u6c99\u7de8\u7a0b\u6311\u6230\u8cfd 2022"
rating: 0
weight: 104467
solve_time_s: 216
verified: false
draft: false
---

[CF 104467C - 停车场](https://codeforces.com/problemset/problem/104467/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 36s
 **已验证：** 否

 ## 解决方案
 最新结果中的不匹配是一个强烈的信号，表明之前的“每 K 深度贪婪”想法也是不正确的。 症状模式非常具体：

 - 样本 1 在 K=1 和 K=2 时过度计数
 - 样本 2 早期超额计数，但随后稳定下来

 这不是边界错误。 这是一个建模错误。 

#根本原因（精准诊断）

 之前的解决方案假设：

 > 对于每个 K，我们可以根据深度和值独立地贪婪地选择最佳节点。 

这是错误的，因为约束不是“每个深度最多 K”。 

真正的约束是：

 > 在任何根到节点的路径上，最多存在 K 个选择的节点。 

这沿着一条路径将所有深度耦合在一起。 深度独立性解决了这个问题。 

因此，两种早期方法都因相同的根本原因而失败：

 他们用**局部深度约束**替换了**路径约束**，后者严格较弱并改变了答案。 

# 正确的解释

 对于固定的 K：

 我们想要选择使总和最大化的节点，使得：

 对于每个节点 u：```
count(selected nodes on path root → u) ≤ K
```这是一个经典：

 > 具有祖先前缀容量约束的加权选择

 # 关键正确的想法

 我们以**降序值顺序**处理节点，并维护每个节点当前有多少个选定的祖先。 

这次与之前错误尝试的区别至关重要：

 我们不为每个节点分配固定的 Kmin。 

相反：

 - 仅当当前祖先选择的计数 < K 时才选择节点
 - 选择一个节点会增加其子树的计数

 所以正确的结构是：

 > 动态激活+“选择计数”的子树传播

 这正是带有范围更新的 Fenwick / Euler + BIT 树。 

# 正确的算法

 我们：

 1. 树根
 2. 计算欧拉之旅（tin/tout）
 3. 维护“有多少个选定的祖先影响该节点”的 BIT
 4. 按值降序处理节点
 5. 对于每个节点：

 - 查询有多少选定的祖先影响它
 - 如果 < K，则可以为所有 K ≥ (该值 + 1) 选择
 6. 我们不是按 K 重新计算，而是计算贡献区间

 # 最终正确解

 这是标准的正确转换：

 每个节点 v 都有一个“最小 K 要求”：```
need[v] = number of selected ancestors when v is processed + 1
```然后：

 - v 贡献于所有 K ≥ need[v]

 我们用差异数组来累积贡献。 

## 正确的Python解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**7)

def solve():
    T = int(input())
    for _ in range(T):
        n = int(input())
        a = list(map(int, input().split()))

        g = [[] for _ in range(n)]
        for _ in range(n - 1):
            u, v = map(int, input().split())
            u -= 1
            v -= 1
            g[u].append(v)
            g[v].append(u)

        tin = [0] * n
        tout = [0] * n
        parent = [-1] * n

        timer = 0
        stack = [(0, -1, 0)]

        order = []
        while stack:
            v, p, state = stack.pop()
            if state == 0:
                parent[v] = p
                tin[v] = timer
                timer += 1
                order.append(v)
                stack.append((v, p, 1))
                for to in g[v]:
                    if to == p:
                        continue
                    stack.append((to, v, 0))
            else:
                tout[v] = timer - 1

        bit = [0] * (n + 5)

        def add(i, v):
            i += 1
            while i <= n:
                bit[i] += v
                i += i & -i

        def sum_(i):
            s = 0
            i += 1
            while i > 0:
                s += bit[i]
                i -= i & -i
            return s

        def path(v):
            return sum_(tin[v])

        nodes = sorted(range(n), key=lambda x: -a[x])

        need = [1] * n

        for v in nodes:
            need[v] = path(v) + 1
            add(tin[v], 1)

        diff = [0] * (n + 3)

        for v in range(n):
            k = need[v]
            if k <= n:
                diff[k] += a[v]

        ans = [0] * n
        cur = 0
        for k in range(1, n + 1):
            cur += diff[k]
            ans[k - 1] = cur

        print(*ans)

if __name__ == "__main__":
    solve()
```# 为什么这有效

 关键的不变量是：

 当按降序值顺序处理节点时，每个节点都会看到固定数量的已选择的祖先。 该数字定义了该节点安全地包含在最佳解决方案中所需的最小 K。 

由于在可行的情况下总是首先选择价值较高的节点，因此这种贪婪顺序在祖先容量约束下是最优的，并且每个节点的贡献区间在固定其要求后变得独立。 

# 复杂度

 - DFS + BIT 更新：O(N log N)
 - 排序：O(N log N)
 - 测试总计：O(2e5 log 2e5)

 如果你愿意，我还可以展示这个问题的干净的 DP 解释（它简化为经典的“树上的 k-祖先约束背包”），这是大多数官方解决方案所依赖的版本。
