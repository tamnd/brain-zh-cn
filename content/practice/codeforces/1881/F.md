---
title: "CF 1881F - 最小最大距离"
description: "我们得到一棵树和它标记为特殊的顶点的子集。 对于每个顶点 $v$，将 $f(v)$ 定义为从 $v$ 到最远标记顶点的距离。 我们想要选择一个顶点，其最远的标记顶点尽可能接近。"
date: "2026-06-08T22:42:23+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "graphs", "shortest-paths", "trees"]
categories: ["algorithms"]
codeforces_contest: 1881
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 903 (Div. 3)"
rating: 1700
weight: 1881
solve_time_s: 140
verified: true
draft: false
---

[CF 1881F - 最小最大距离](https://codeforces.com/problemset/problem/1881/F)

 **评分：** 1700
 **标签：** dfs 和类似的、dp、图、最短路径、树
 **求解时间：** 2m 20s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一棵树和它标记为特殊的顶点的子集。 

对于每个顶点$v$， 定义$f(v)$作为距离$v$到最远的标记顶点。 我们想要选择一个顶点，其最远的标记顶点尽可能接近。 答案是最小值$f(v)$在所有顶点上。 

从不同的角度来看，将所有标记的顶点想象为重要位置。 对于每个候选顶点，查看到任何标记顶点的最差距离。 我们需要最小化这种最坏情况距离的顶点。 

该树最多可以包含$2 \cdot 10^5$所有测试用例的顶点。 任何从每个顶点执行遍历的算法都需要$O(n^2)$在最坏的情况下工作，这远远超出了两秒钟的时间。 我们需要一个每个测试用例接近线性时间的解决方案。 

一些边缘情况很容易被错误处理。 

考虑一棵只有一个标记顶点的树：```
1
5 1
3
1 2
2 3
3 4
4 5
```正确答案是`0`，因为选择顶点 3 会给出到唯一标记顶点的距离 0。 假设两个端点始终存在的解决方案将在这里失败。 

考虑一条每个顶点都被标记的路径：```
1
4 4
1 2 3 4
1 2
2 3
3 4
```答案是`2`。 最好的顶点是 2 和 3，它们最远的标记顶点在距离 2 处。仅查看附近的标记顶点会错过端点的影响。 

另一个微妙的情况是当标记的顶点在一棵大树内形成一个小簇时：```
1
7 2
3 4
1 2
2 3
3 4
4 5
5 6
6 7
```答案是`1`。 最佳顶点是 3 和 4。尝试平衡到所有顶点而不是仅标记顶点的距离的粗心方法会产生更大的值。 

## 方法

 直接的解决方案是计算$f(v)$分别为每个顶点。 

对于固定顶点$v$，我们可以运行 BFS 或 DFS 来获取到所有顶点的距离，然后取标记顶点之间的最大距离。 对每个顶点重复此操作给出$O(n^2)$在树上的时间。 和$n = 2 \cdot 10^5$，这大约需要$4 \cdot 10^{10}$最坏情况下的操作。 

关键的观察是我们并不关心所有标记的顶点。 我们只关心最远的那一个。 

假设我们只查看标记的顶点并找到所有标记对中距离最大的两个标记顶点。 打电话给他们$A$和$B$。 它们形成了标记组的直径。 

现在考虑任意顶点$v$。 让$$d_A(v)=\operatorname{dist}(v,A)$$和$$d_B(v)=\operatorname{dist}(v,B).$$树的一个重要特性是对于每个标记的顶点$x$,$$\operatorname{dist}(v,x) \le \max(d_A(v), d_B(v)).$$这意味着距离最远的标记顶点$v$始终是两个直径端点之一。 

所以$$f(v)=\max(d_A(v), d_B(v)).$$一旦知道了直径端点，我们只需要距离$A$和来自$B$。 然后我们对每个顶点评估上述表达式并取最小值。 

剩下的问题是如何找到标记的直径。 这是标准的双 DFS 技巧，稍作修改。 

从任何标记的顶点开始并找到最远的标记顶点$A$。 然后从$A$并找到最远的标记顶点$B$。 之间的路径$A$和$B$是标记顶点之间的直径。 

之后，一个DFS从$A$和一个 DFS 来自$B$提供所有需要的距离。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n)$每个测试用例|$O(n)$| 已接受 |

 ## 算法演练

 1. 读取树和标记顶点的列表。 
2. 选择任何标记的顶点作为起点。 
3. 从该顶点运行 DFS 并计算到每个顶点的距离。 
4. 在所有标记的顶点中，选择距离最大的一个。 叫它$A$。 

该顶点必须是标记直径的端点。 
5. 运行另一个 DFS$A$。 
6. 在所有标记的顶点中，选择距离最远的一个$A$。 叫它$B$。 

这对$(A,B)$形成标记顶点的直径。 
7. 存储所有距离$A$。 调用这个数组`distA`。 
8. 运行第三个 DFS$B$并将所有距离存储在`distB`。 
9. 对于每个顶点$v$, 计算$$\max(\text{distA}[v], \text{distB}[v]).$$这等于距离$v$到最远的标记顶点。 
10. 取所有顶点中的最小值并输出。 

### 为什么它有效

 让$A$和$B$是标记顶点的直径的端点。 

对于任何标记的顶点$x$，直径最大值意味着$$\operatorname{dist}(A,x)\le \operatorname{dist}(A,B)$$和$$\operatorname{dist}(B,x)\le \operatorname{dist}(A,B).$$标准的树直径属性表明对于每个顶点$v$，距离最远的标记顶点$v$必须是直径端点之一。 最后，$$\max_{x \text{ marked}} \operatorname{dist}(v,x) = \max( \operatorname{dist}(v,A), \operatorname{dist}(v,B) ).$$该算法精确计算每个顶点的这两个距离并最小化它们的最大值。 由于每个候选值都被正确计算，因此最小值也是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n, k = map(int, input().split())
        marked = list(map(int, input().split()))

        g = [[] for _ in range(n + 1)]

        for _ in range(n - 1):
            u, v = map(int, input().split())
            g[u].append(v)
            g[v].append(u)

        def distances(start):
            dist = [-1] * (n + 1)
            dist[start] = 0

            stack = [start]

            while stack:
                v = stack.pop()

                for to in g[v]:
                    if dist[to] == -1:
                        dist[to] = dist[v] + 1
                        stack.append(to)

            return dist

        start = marked[0]

        dist0 = distances(start)

        A = max(marked, key=lambda x: dist0[x])

        distA = distances(A)

        B = max(marked, key=lambda x: distA[x])

        distB = distances(B)

        ans = min(max(distA[v], distB[v]) for v in range(1, n + 1))

        print(ans)

solve()
```辅助函数`distances()`执行迭代 DFS 并返回从一个源到每个顶点的距离。 迭代遍历比递归 DFS 更安全，因为树最多可以包含$2 \cdot 10^5$顶点，这将超出 Python 的递归深度。 

第一次遍历找到位于标记直径一端的标记顶点。 第二次遍历识别相反的端点。 这些与用于查找树直径的步骤完全相同，只是仅在标记的顶点中选择最远的顶点。 

第三次遍历是必要的，因为我们需要同时计算到两个直径端点的距离。 一次`distA`和`distB`可用，表达式`max(distA[v], distB[v])`给出顶点的最远标记距离`v`。 

一个常见的错误是最小化`distA[v] + distB[v]`或其他一些组合。 该问题要求最差标记距离，因此正确的表达式是两个端点距离中的最大值。 

## 工作示例

 ### 示例 1```
7 3
Marked: 2 6 7
```这棵树是：```
    1
   / \
  2   3
 / \ / \
4  5 6  7
```标记的直径端点为 2 和 6。 

| 顶点| distA（来自 2）| distB（来自 6）| 最大|
 | --- | --- | --- | --- |
 | 1 | 1 | 2 | 2 |
 | 2 | 0 | 3 | 3 |
 | 3 | 2 | 1 | 2 |
 | 4 | 1 | 4 | 4 |
 | 5 | 1 | 4 | 4 |
 | 6 | 3 | 0 | 3 |
 | 7 | 3 | 2 | 3 |

 最后一列的最小值是`2`，由顶点 1 和 3 实现。 

此示例显示了该解决方案的核心属性。 一旦直径端点已知，每个顶点的答案就仅来自这两个距离。 

### 示例 2```
4 4
Marked: 1 2 3 4
1-2-3-4
```标记的直径端点是 1 和 4。 

| 顶点| 距离 | 距离 | 最大|
 | --- | --- | --- | --- |
 | 1 | 0 | 3 | 3 |
 | 2 | 1 | 2 | 2 |
 | 3 | 2 | 1 | 2 |
 | 4 | 3 | 0 | 3 |

 最小值为`2`。 

这表明，当每个顶点都被标记时，问题就简化为寻找直径路径的中心。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n)$| 三个全树遍历和线性扫描|
 | 空间|$O(n)$| 邻接表和距离数组 |

 全部的总和$n$跨测试用例的值最多是$2 \cdot 10^5$。 每个测试用例的线性处理意味着总工作量与整体输入大小也是线性的，这很容易符合限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline
    out = []

    t = int(input())

    for _ in range(t):
        n, k = map(int, input().split())
        marked = list(map(int, input().split()))

        g = [[] for _ in range(n + 1)]

        for _ in range(n - 1):
            u, v = map(int, input().split())
            g[u].append(v)
            g[v].append(u)

        def distances(start):
            dist = [-1] * (n + 1)
            dist[start] = 0
            stack = [start]

            while stack:
                v = stack.pop()
                for to in g[v]:
                    if dist[to] == -1:
                        dist[to] = dist[v] + 1
                        stack.append(to)

            return dist

        d0 = distances(marked[0])
        A = max(marked, key=lambda x: d0[x])

        dA = distances(A)
        B = max(marked, key=lambda x: dA[x])

        dB = distances(B)

        out.append(str(min(max(dA[i], dB[i]) for i in range(1, n + 1))))

    return "\n".join(out)

# provided sample
assert run(
"""6
7 3
2 6 7
1 2
1 3
2 4
2 5
3 6
3 7
4 4
1 2 3 4
1 2
2 3
3 4
5 1
1
1 2
1 3
1 4
1 5
5 2
4 5
1 2
2 3
1 4
4 5
10 8
1 2 3 4 5 8 9 10
2 10
10 5
5 3
3 1
1 7
7 4
4 9
8 9
6 1
10 9
1 2 4 5 6 7 8 9 10
1 3
3 9
9 4
4 10
10 6
6 7
7 2
2 5
5 8
"""
) == "2\n2\n0\n1\n4\n5"

# single vertex
assert run(
"""1
1 1
1
"""
) == "0"

# path with one marked endpoint
assert run(
"""1
5 1
5
1 2
2 3
3 4
4 5
"""
) == "0"

# two marked endpoints of a path
assert run(
"""1
5 2
1 5
1 2
2 3
3 4
4 5
"""
) == "2"

# star centered at marked vertex
assert run(
"""1
5 1
1
1 2
1 3
1 4
1 5
"""
) == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单顶点树 | 0 | 尽可能最小的输入 |
 | 路径上一个标记的端点 | 0 | 处理$k=1$|
 | 带有标记端点的路径 | 2 | 直径中心行为 |
 | 带有标记中心的星形 | 0 | 距唯一标记节点的距离 |

 ## 边缘情况

 考虑单个标记的顶点。```
1
5 1
3
1 2
2 3
3 4
4 5
```第一次直径搜索找到顶点 3。第二次搜索也找到顶点 3。因此$A=B=3$。 每个顶点都使用`max(distA, distB)`，这只是它到顶点 3 的距离。最小值出现在顶点 3 处并且等于 0。 

考虑路径上标记的所有顶点。```
1
4 4
1 2 3 4
1 2
2 3
3 4
```标记的直径是整个路径，具有端点 1 和 4。距这些端点的距离正确地将顶点 2 和 3 识别为中心。 答案变成2。 

考虑集中在一个区域的标记顶点。```
1
7 2
3 4
1 2
2 3
3 4
4 5
5 6
6 7
```直径端点为 3 和 4。距这些端点的距离为：

 | 顶点| 最大（距离（3），距离（4））|
 | --- | --- |
 | 1 | 3 |
 | 2 | 2 |
 | 3 | 1 |
 | 4 | 1 |
 | 5 | 2 |
 | 6 | 3 |
 | 7 | 4 |

 最小值为 1，在顶点 3 和 4 处实现。该算法仅关注标记的顶点，完全按照问题定义的要求。
