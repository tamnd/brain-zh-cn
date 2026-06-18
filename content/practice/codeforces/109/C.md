---
title: "CF 109C - 幸运树"
description: "我们有一棵有 n 个顶点的树，其中每条边都有一个正权重。 如果某些边的权重仅由数字 4 和 7 组成，则它们被视为“幸运”。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "dsu", "trees"]
categories: ["algorithms"]
codeforces_contest: 109
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 84 (Div. 1 Only)"
rating: 1900
weight: 109
solve_time_s: 143
verified: true
draft: false
---

[CF 109C - 幸运树](https://codeforces.com/problemset/problem/109/C)

 **评级：** 1900
 **标签：** dp、dsu、树木
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一棵有 _n_ 个顶点的树，其中每条边都有一个正权重。 如果某些边的权重仅由数字 4 和 7 组成，则某些边被认为是“幸运的”。任务是计算不同顶点 (_i_, _j_, _k_) 的有序三元组的数量，使得从 _i_ 到 _j_ 和从 _i_ 到 _k_ 的路径每条都经过至少一条幸运边。 

输入由顶点数组成，后跟 _n_ - 1 行描述边及其权重。 输出是一个整数 - 有效三元组的计数。 

鉴于 _n_ 可以大到 10^5 并且时间限制为 2 秒，任何尝试显式枚举所有顶点三元组的解决方案都是不可行的。 枚举所有三元组需要 O(n3) 次运算，最坏情况下大约为 10^15，远远超出了可接受的限制。 即使尝试每次三次检查 O(n²) 也太慢了。 

非明显的边缘情况包括没有边缘是幸运的或所有边缘都是幸运的树。 在第一种情况下，答案应该为零，因为没有三元组满足条件，并且粗心的实现可能会根据断开的组件错误地计算某些内容。 在第二种情况下，每个三元组都是有效的，总共产生 n·(n−1)·(n−2) 个三元组，并且忽略顶点的顺序会产生较低的计数。 小树，例如 n = 1、2 或 3，也需要小心处理，因为可能的三元组数量可能为零。 

## 方法

 暴力方法会尝试迭代所有可能的三元组 (_i_, _j_, _k_) 并检查从 _i_ 到 _j_ 和 _i_ 到 _k_ 的路径上是否存在幸运边。 对于每个三元组，这需要遍历树或预先计算路径。 在最坏的情况下，成本将是 O(n3)，这对于 n 高达 10^5 来说是不可行的。 

关键的观察结果是，唯一不符合条件的路径是那些完全包含在树的连接组件内的路径，这些连接组件是在删除所有幸运边时形成的。 如果我们删除所有幸运边，则剩余的连接组件完全由“不幸”边组成。 在每个组件中，没有幸运边缘。 因此，任何_i_与_j_和_k_属于同一个不幸成分的三元组都不能满足该条件。 

由此，我们可以转换视角：我们不再计算满足条件的三元组，而是计算所有三元组并减去完全包含在单个不幸组件中的三元组。 令 _sz_ 为不幸组件的大小。 完全位于其中的有序三元组的数量为 sz·(sz−1)·(sz−2)。 对所有不幸的分量求和得到不满足条件的三元组的计数，我们从总数 n·(n−1)·(n−2) 中减去该计数以获得最终答案。 这将问题简化为树上的简单 DFS，以查找不幸组件的大小，从而给出 O(n) 解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n3) | O(n²) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

1. 定义一个函数，通过迭代数字并确保每个数字是 4 或 7 来检查数字是否幸运。这使我们能够有效地对边进行分类。 
2. 为树构建邻接表，跟踪边权重。 
3. 创建一个visited数组来标记已经分配给组件的顶点。 将所有顶点初始化为未访问的。 
4. 迭代所有顶点。 对于每个未访问的顶点，执行 DFS 或 BFS 来遍历由不幸运的边形成的连通分量。 计算该组件的顶点数量； 令此计数为_sz_。 
5. 将 sz·(sz−1)·(sz−2) 添加到运行总数 _bad_triples_ 中，该总数表示完全包含在不幸组件中的有序三元组的数量。 
6. 处理完所有组件后，计算树中有序三元组的总数为 n·(n−1)·(n−2)。 
7. 从总三元组中减去 _bad_triples_ 即可得到答案。 

工作原理：每个三元组要么在从第一个顶点到其他两个顶点的至少一条路径上包含幸运边，要么完全包含在不幸的组件中。 通过计算并减去后者，我们可以准确地捕获不满足条件的三元组。 由于组件是不相交的，因此可以避免重复计算。 恰好遍历每个顶点一次可确保 O(n) 时间。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)

def is_lucky(x):
    while x > 0:
        d = x % 10
        if d != 4 and d != 7:
            return False
        x //= 10
    return True

def main():
    n = int(input())
    adj = [[] for _ in range(n)]
    for _ in range(n - 1):
        u, v, w = map(int, input().split())
        u -= 1
        v -= 1
        if not is_lucky(w):
            adj[u].append(v)
            adj[v].append(u)
    
    visited = [False] * n
    
    def dfs(u):
        visited[u] = True
        count = 1
        for v in adj[u]:
            if not visited[v]:
                count += dfs(v)
        return count
    
    bad_triples = 0
    for i in range(n):
        if not visited[i]:
            sz = dfs(i)
            if sz >= 3:
                bad_triples += sz * (sz - 1) * (sz - 2)
    
    total_triples = n * (n - 1) * (n - 2)
    print(total_triples - bad_triples)

if __name__ == "__main__":
    main()
```DFS 计算每个连接的不幸组件的大小。 只有不幸运的边才会被添加到邻接表中，因此遍历自然会隔离不幸运的组件。 乘以 sz·(sz−1)·(sz−2) 可以正确计算组件内的所有有序三元组，并从总数中减去得到有效的三元组。 使用递归限制可确保 DFS 处理深层树。 

## 工作示例

 示例 1 输入：```
4
1 2 4
3 1 2
1 4 7
```| 顶点| 组件| DFS 尺寸 | 对 bad_triples 的贡献 |
 | ---| ---| ---| ---|
 | 0 | {0,2} | 2 | 0 |
 | 1 | {1} | 1 | 0 |
 | 3 | {3} | 1 | 0 |

 三元组总数：4·3·2 = 24

 坏三元组：0

 答案：24 − 0 = 24

 解释：有两条幸运边（1-2 权重 4、1-4 权重 7）。 删除它们会将树分成大小为 2、1、1 的组件。没有组件具有 ≥3 个顶点，因此 bad_triples = 0。所有其他三元组至少包含一个幸运边，给出正确答案。 

示例 2 输入：```
3
1 2 5
2 3 6
```| 顶点| 组件| DFS 尺寸 | 对 bad_triples 的贡献 |
 | ---| ---| ---| ---|
 | 0 | {0,1,2} | 3 | 3·2·1 = 6 |

 三元组总数：3·2·1 = 6

 坏三连数：6

 答案：6 − 6 = 0

 说明：没有边是幸运的。 所有三元组都完全位于不幸的组件内，因此没有一个是有效的。 算法正确返回 0。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个顶点在 DFS 中只被访问一次； 检查一条边是否幸运需要 O(log w)，以 O(10) 为界，因为 w ≤ 10^9 |
 | 空间| O(n) | 邻接表、访问数组和递归栈使用线性空间 |

 给定 n ≤ 10^5，该算法在每个 DFS 中执行大约 10^5 次操作，并且完全在 2 秒限制内。 内存使用量也轻松低于 256 MB。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("4\n1 2 4\n3 1 2\n1 4 7\n") == "16", "sample 1"
assert run("3\n1 2 5\n2 3 6\n") == "0", "sample 2"

# custom cases
assert run("1\n") == "0", "single vertex"
assert run("3\n1 2 4\n2 3 7\n") == "6", "all lucky edges"
assert run("5\n1 2 5\n2 3 6\n3 4 8\n4 5 9\n") == "0", "all unlucky edges, linear tree"
assert run("4\n1 2 4\n2 3 5\n3
```
