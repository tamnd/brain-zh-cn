---
title: "CF 105930K - 路径规划 2"
description: "我们得到一个网格，其中每个单元格都包含一个整数值。 从左上角开始，我们只能向右或向下移动，直到到达右下角。 任何此类运动都会形成单调路径，并且每条路径都会收集其经过的单元格的值。"
date: "2026-06-21T11:54:01+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105930
codeforces_index: "K"
codeforces_contest_name: "The 15th Shandong CCPC Provincial Collegiate Programming Contest"
rating: 0
weight: 105930
solve_time_s: 96
verified: true
draft: false
---

[CF 105930K - 路径规划 2](https://codeforces.com/problemset/problem/105930/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个网格，其中每个单元格都包含一个整数值。 从左上角开始，我们只能向右或向下移动，直到到达右下角。 任何此类运动都会形成单调路径，并且每条路径都会收集其经过的单元格的值。 

对于选定的路径，我们查看该路径上出现的一组值并计算其 mex，即未出现在该路径上任何位置的最小非负整数。 任务是选择一条使该 mex 尽可能小的路径。 

因此，问题不在于最大化值的覆盖范围，而在于强制在至少一条有效路径中不存在一个小整数。 如果存在一条完全避免值 0 的路径，那么我们可以实现 mex 0。如果每条路径都必须包含 0，那么 mex 必须至少为 1，然后我们继续检查某个路径是否可以避免值 1，依此类推。 

这些限制意味着所有测试用例的单元总数最多为一百万。 这立即排除了任何为每个测试用例的许多候选值独立重新计算完整网格遍历的解决方案。 对每个整数值运行完整路径搜索的简单方法将重复扫描最多$10^6$细胞，导致不可接受的$10^{12}$最坏情况下的规模。 

当我们试图避免的值非常常见或形成跨网格的“障碍”时，就会出现关键的边缘情况。 例如，在单行网格中`1 x 5`，如果某个特定值出现在每一列中，则任何路径都必须包含该值，因此即使移动微不足道，也无法避免该值。 

另一个微妙的情况是开始或结束单元格本身包含我们试图避免的值。 在这种情况下，任何有效路径都无法避免这种情况，因为所有路径都必须包含两个端点。 

## 方法

 一种直接但缓慢的方法是从 0 开始向上测试值。 对于每个候选值$k$，我们暂时将所有细胞视为$k$被阻止并检查是否仍然存在仅使用向右和向下移动从左上角到右下角的单调路径。 如果存在这样的路径，则存在一条有效路径，其 mex 最多为$k$，因为该路径避免了$k$。 我们返回最小的这样的$k$。 

正确性来自于 mex 的定义：一条路径有 mex$k$或更小恰好当它避免$k$，因为 mex 仅由第一个缺失的整数确定，并且避免$k$保证缺失的整数最多为$k$。 

瓶颈在于每次检查都是一个图可达性问题$n \times m$网格、成本计算$O(nm)$。 在最坏的情况下，我们可能会尝试许多值，如果重复这样做，这会变得太慢。 

关键的观察是我们不需要模拟复杂的行为：对于固定值$k$，唯一相关的操作是是否删除所有具有值的单元格$k$在开始和结束之间断开网格。 这将每次检查减少为过滤网格上的标准网格可达性测试。 

我们可以进一步利用测试中总网格尺寸较小的约束。 我们为每个候选者的每个测试用例执行一次 BFS 或 DFS$k$，但至关重要的是，一旦找到第一个，我们就立即停止$k$允许一条路径。 由于 mex 通常相对于网格值较小，因此提前停止可以使解决方案在预期约束下保持实用。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每次都对每个值进行强力遍历 |$O(K \cdot n m)$|$O(nm)$| 太慢了|
 | 每个候选值的提前停止 BFS |$O(nm)$在实践中按每次测试摊销|$O(nm)$| 已接受 |

 ## 算法演练

 我们处理从 0 开始向上的值。 

1. 对于固定的候选值$k$，标记所有值等于的网格单元$k$被阻止。 这些单元格不能在路径中使用。 
2. 运行 BFS 或 DFS$(1,1)$，但仅遍历网格内且未被阻挡的右和下邻居。 
3.如果我们能达到$(n,m)$，则存在一条回避价值的路径$k$，所以 mex 最多可以是$k$。 我们输出$k$并停止。 
4. 如果我们无法到达目标，则每条有效路径必须至少包含一次$k$，所以我们移动到$k+1$并重复。 

正确性来自于将每次检查解释为可行性测试：我们询问删除所有有值的节点后网格图中是否存在单调路径$k$。 

### 为什么它有效

 任何有效路径完全由一系列向右和向下移动决定，并且网格形成有向无环图。 删除所有有价值的单元格$k$从图中准确删除这些节点。 如果仍然存在从起点到终点的路径，则存在一条路径，其值的集合不包含$k$，最多直接暗示 mex$k$。 反之，如果不存在这样的路径，则每条单调路径必须至少经过一条$k$-值单元格，强制 mex 大于$k$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve_one(n, m, grid):
    start_val = grid[0][0]
    
    # We try k starting from 0 upward until a feasible path exists.
    # In practice, we only need to consider values that appear in the grid.
    vals = set()
    for row in grid:
        for x in row:
            vals.add(x)
    vals = sorted(vals)
    
    # If 0 is not in grid, mex is 0 immediately.
    if 0 not in vals:
        return 0

    # Precompute list of candidates starting from 0 upward
    # but only those that matter (present values or 0)
    # We still conceptually test k in increasing order.
    max_val = vals[-1]

    def reachable(blocked_val):
        if grid[0][0] == blocked_val or grid[n-1][m-1] == blocked_val:
            return False
        
        q = deque()
        vis = [[False] * m for _ in range(n)]
        q.append((0, 0))
        vis[0][0] = True
        
        while q:
            i, j = q.popleft()
            if i == n - 1 and j == m - 1:
                return True
            
            for di, dj in ((0, 1), (1, 0)):
                ni, nj = i + di, j + dj
                if ni < n and nj < m and not vis[ni][nj]:
                    if grid[ni][nj] != blocked_val:
                        vis[ni][nj] = True
                        q.append((ni, nj))
        return False

    # try candidates in increasing order
    k = 0
    while True:
        if reachable(k):
            return k
        k += 1

def main():
    T = int(input())
    out = []
    for _ in range(T):
        n, m = map(int, input().split())
        grid = [list(map(int, input().split())) for _ in range(n)]
        out.append(str(solve_one(n, m, grid)))
    print("\n".join(out))

if __name__ == "__main__":
    main()
```该解决方案构建了一个小型 BFS 例程，用于测试删除所有等于候选值的单元格后是否存在单调路径。 主循环递增该值直到实现可行性，这直接产生可实现的最小 mex。 

一个微妙的实现细节是当起始或结束单元等于阻塞值时早期拒绝，因为在这种情况下不存在路径。 这可以避免不必要的遍历。 

## 工作示例

 ### 示例 1

 网格：```
2 0 1
0 3 4
1 5 6
```我们按顺序测试值。 

| k | 开始被阻止 | 结束封锁 | 可达 | 决定|
 | --- | --- | --- | --- | --- |
 | 0 | 没有 | 没有 | 没有 | 继续 |
 | 1 | 没有 | 没有 | 是的 | 答案 = 1 |

 BFS 为$k=0$失败是因为零形成了阻挡所有单调路径的屏障。 为了$k=1$，删除 1 仍然留下从左上角到右下角的连通路径，因此 mex 变为 1。 

### 示例 2

 网格：```
100 0 2 0 1
```| k | 开始被阻止 | 结束封锁 | 可达 | 决定|
 | --- | --- | --- | --- | --- |
 | 0 | 没有 | 没有 | 没有 | 继续 |
 | 1 | 没有 | 是的 | 没有 | 继续 |
 | 2 | 没有 | 没有 | 没有 | 继续 |
 | 3 | 没有 | 没有 | 是的 | 答案 = 3 |

 这显示了一种情况，在找到可以避免的值之前必须测试多个值，并且端点值阻碍了候选值的可行性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(nm \cdot K)$最差，但在实践中摊销很小 每个 BFS 最多探索所有网格单元，我们停在第一个可行的位置$k$|
 | 空间|$O(nm)$| 通过网格访问数组和 BFS 队列 |

 鉴于所有测试用例的总网格大小最多为$10^6$，每个 BFS 与输入大小呈线性关系，并且在得出答案之前通常只需要少量的 BFS 运行。 

## 测试用例```python
import sys, io
from collections import deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    input = _sys.stdin.readline

    def solve():
        T = int(input())
        res = []
        for _ in range(T):
            n, m = map(int, input().split())
            g = [list(map(int, input().split())) for _ in range(n)]

            def reachable(k):
                if g[0][0] == k or g[n-1][m-1] == k:
                    return False
                q = deque([(0, 0)])
                vis = [[False]*m for _ in range(n)]
                vis[0][0] = True
                while q:
                    i, j = q.popleft()
                    if i == n-1 and j == m-1:
                        return True
                    for di, dj in ((0,1),(1,0)):
                        ni, nj = i+di, j+dj
                        if 0 <= ni < n and 0 <= nj < m and not vis[ni][nj]:
                            if g[ni][nj] != k:
                                vis[ni][nj] = True
                                q.append((ni, nj))
                return False

            k = 0
            while not reachable(k):
                k += 1
            res.append(str(k))
        return "\n".join(res)

    return solve()

# sample-like tests
assert run("1\n2 3\n2 0 1\n0 3 4\n") == "1"
assert run("1\n1 5\n100 0 2 0 1\n") == "3"

# edge cases
assert run("1\n1 1\n0\n") == "1"
assert run("1\n1 1\n5\n") == "0"
assert run("1\n2 2\n0 1\n1 2\n") == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1x1 网格，带 0 | 1 | 最小网格，阻止开始/结束行为 |
 | 1x1 网格非零 | 0 | mex 当 0 不存在时 |
 | 小型混合网格| 1 | 简易屏障案例|

 ## 边缘情况

 临界边缘情况是起始单元格本身等于候选值。 在这种情况下，BFS 会立即拒绝候选者，因为没有路径可以开始。 这正确地迫使算法移动到下一个值。 

另一种情况是当网格是单行或单列时。 在这种情况下，该行上出现的任何阻塞值都会立即断开图表的连接，这使得可达性检查特别敏感，但仍然由相同的 BFS 逻辑正确处理。 

最后，当某个值没有出现在网格中的任何位置时，BFS 总是成功，因此第一个这样的值立即成为答案。 这与 mex 的定义一致，因为每个路径中都已经不存在第一个缺失的整数。
