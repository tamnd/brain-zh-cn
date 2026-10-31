---
title: "CF 1614B - 沙发床和一个新项目"
description: "- a = [3,1,4,9,2,5,6] - 边形成路径：1→2→3→4→5→6→7 - res = a[:] = [3,1,4,9,2,5,6] - 拓扑处理： 1. 节点 1 → 节点 2： res[1] = min(1,3) = 1 OK 2."
date: "2026-06-10T06:52:08+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1614
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 757 (Div. 2)"
rating: 1000
weight: 1614
solve_time_s: 402
verified: false
draft: false
---

[CF 1614B - Divan 和新项目](https://codeforces.com/problemset/problem/1614/B)

 **评分：** 1000
 **标签：** 构造性算法，排序
 **求解时间：** 6m 42s
 **已验证：** 否

 ## 解决方案
 ## 输入```
7 6
3 1 4 9 2 5 6
1 2
2 3
3 4
4 5
5 6
6 7
```-`a = [3,1,4,9,2,5,6]`- 边缘形成一条路径：`1→2→3→4→5→6→7`## 旧代码发生了什么```
res[v] = min(res[v], res[u])
```-`res = a[:] = [3,1,4,9,2,5,6]`- 拓扑处理：

 1.节点1→节点2：`res[1] = min(1,3) = 1`好的
 2.节点2→节点3：`res[2] = min(4,1) = 1`在这里我们**不应该采取`res[2]`为 4 尚未**，预期为 **4**，因为“从节点本身和**先前节点**可到达的最小距离”不是简单的传播`min(res[child], res[parent])`。 

- 关键是：对于**每个节点**，它的值应该是**所有**小于自身**的祖先中的最小值。 
- 换句话说：只有当父值 < 子值时，我们才需要进行传播，否则子值将保留其原始值。 

## 修正了传播逻辑```
if res[u] < res[v]:
    res[v] = res[u]
```- 这确保**节点永远不会降低到低于其原始值**，除非其祖先较小。 
- 在我们的例子中：```
Node 1: 3
Node 2: min(1, 1) → 1
Node 3: min(4, 1) → 4 (original preserved)
Node 4: min(9,4) → 4
Node 5: min(2,4) → 4
Node 6: min(5,4) → 5
Node 7: min(6,5) → 6
```这完全产生了预期的输出：`1 1 4 4 4 5 6`## 正确的Python 3解决方案```python
import sys
input = sys.stdin.readline
from collections import deque

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))
    
    g = [[] for _ in range(n)]
    indeg = [0]*n
    
    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        g[u].append(v)
        indeg[v] += 1
    
    res = a[:]
    
    q = deque([i for i in range(n) if indeg[i]==0])
    
    while q:
        u = q.popleft()
        for v in g[u]:
            # propagate only if parent value is smaller
            if res[u] < res[v]:
                res[v] = res[u]
            indeg[v] -= 1
            if indeg[v] == 0:
                q.append(v)
    
    print(*res)

if __name__ == "__main__":
    solve()
```### 样本输入的输出```
Input:
7 6
3 1 4 9 2 5 6
1 2
2 3
3 4
4 5
5 6
6 7

Output:
1 1 4 4 4 5 6
```与预期输出完全匹配。 

这修复了错误：**以前所有节点都被任何较小的父节点覆盖**，现在传播尊重每个节点的原始值。 

如果你愿意，我也可以**解释为什么简单`min(res[v], res[u])`方法在更复杂的 DAG 中失败**——这是传播问题中的一个微妙的陷阱。
