---
title: "CF 106043F - 图问题"
description: "我们得到一个连通的无向加权图。 从顶点 s 开始，到顶点 t 结束，我们可以遵循任何行走，不一定是简单的路径。 顶点和边可以任意多次重新访问。"
date: "2026-06-25T12:49:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106043
codeforces_index: "F"
codeforces_contest_name: "Teamscode Summer 2025 Advanced Division"
rating: 0
weight: 106043
solve_time_s: 69
verified: true
draft: false
---

[CF 106043F - 图问题](https://codeforces.com/problemset/problem/106043/F)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 9s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个连通的无向加权图。 从顶点开始`s`并在顶点结束`t`，我们可以走任何一条路，不一定是一条简单的路。 顶点和边可以任意多次重新访问。 

每条步行都有一个总权重，通过将所有遍历的边的权重相加而获得。 我们只关心总模数`k`。 

任务是确定有多少个不同的余数模`k`可以出现在所有可能的步行中`s`到`t`。 

该图最多可以包含`10^5`顶点和`2·10^5`每个测试用例的边缘。 任何尝试枚举行走的解决方案都是没有希望的，因为即使简单路径的数量也可能已经是指数级的。 我们需要对所有可实现的路径总和进行结构表征。 

最危险的边缘情况是树。 在一棵树中，两个顶点之间只有一条简单的路径，但行走仍然不是唯一的，因为我们可能会遍历一条边并立即返回。 

例如：```
2 1 4 1 2
1 2 1
```直接步行有重量`1`。 

我们还可以这样做：```
1 -> 2 -> 1 -> 2
```谁的体重是`3`。 

可实现的余数模`4`是`{1,3}`，所以答案是`2`， 不是`1`。 

另一个微妙的情况是当图表包含总重量与`k`。 

考虑：```
k = 6
cycle weight = 4
```重复插入该循环会改变余数`4 mod 6`，仅产生由下式生成的子群`gcd(4,6)=2`。 假设每个循环都会产生所有残留物的解决方案会过度计算。 

最后的边缘情况是`k = 1`。 每个数都等于`0 mod 1`，所以答案一定是`1`。 

## 方法

 一个蛮力的想法是从`s`到`t`，计算它们的权重模`k`，并标记可到达的残基。 这会立即遇到麻烦，因为图表可能包含循环。 行走的次数是无限的，即使将自己限制在短距离行走也无济于事，因为图的大小达到了`10^5`。 

关键的观察结果是，所有步道彼此之间的不同之处仅在于插入的闭合步道。 如果我们知道封闭行走会产生哪些重量变化，那么每个`s -> t`walk 只是一个固定的基础值加上这些变化的一些组合。 

选择任意生成树并让`dist[v]`是从根到`v`。 

对于非树边`(u,v,w)`，比较从根到的树路径`v`从根到的路线`u`然后使用这个边缘。 差异```
dist[u] + w - dist[v]
```测量使用该循环可以在步行中注入多少重量。 

树的边缘贡献了另一种类型的生成器。 即使在一棵纯树中，我们也可能遍历一条边并立即返回。 这会精确地改变步行重量`2w`。 

两者之间所有可能的差异`s -> t`游走形成由以下生成的整数的加法子群：```
2w                           for every edge
dist[u] + w - dist[v]        for every edge
```让```
G = gcd(all generators above)
```每个行走重量都等于```
base + x·G
```对于某个整数`x`。 

模数`k`，由生成的子群`G`恰好包含```
k / gcd(k, G)
```不同的残留物。 

这个值就是答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 无限/指数| 无界| 太慢了 |
 | 最佳| O(n + m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 使用DFS或BFS构建生成树。 
2. 遍历树的同时，计算`dist[v]`，从根到顶点的总树权`v`。 
3. 初始化`G = 0`。 
4. 对于每条图边`(u,v,w)`， 更新：```
G = gcd(G, 2w)
```这说明了穿过边缘并立即返回。 
5. 对于同一条边，更新：```
G = gcd(G, abs(dist[u] + w - dist[v]))
```这捕获了周期造成的差异。 
6. 处理完所有边后，计算：```
d = gcd(G, k)
```7. 输出：```
k / d
```### 为什么它有效

 树距离给出了势函数。 每个边遍历都可以写成伸缩贡献加上差异项。 

当一个完整的`s -> t`步行以这种方式扩展，伸缩部分折叠成一个固定常数，仅取决于`s`和`t`。 唯一的自由来自于差异值和`2w`回溯操作。 

所有步行重量差异的集合正是由这些值生成的加法子组。 整数的任何加法子群都是由其 gcd 生成的，即`G`。 

模数`k`，可达残基形成由下式生成的循环子群`G mod k`。 由下式生成的循环子群`G`有尺寸`k / gcd(k,G)`，给出所需的计数。 

## Python 解决方案```python
import sys
from math import gcd

input = sys.stdin.readline

def solve():
    t = int(input())

    for _ in range(t):
        n, m, k, s, tt = map(int, input().split())

        adj = [[] for _ in range(n)]
        edges = []

        for _ in range(m):
            u, v, w = map(int, input().split())
            u -= 1
            v -= 1

            adj[u].append((v, w))
            adj[v].append((u, w))
            edges.append((u, v, w))

        dist = [0] * n
        vis = [False] * n

        stack = [0]
        vis[0] = True

        while stack:
            u = stack.pop()

            for v, w in adj[u]:
                if not vis[v]:
                    vis[v] = True
                    dist[v] = dist[u] + w
                    stack.append(v)

        g = 0

        for u, v, w in edges:
            g = gcd(g, 2 * w)
            g = gcd(g, abs(dist[u] + w - dist[v]))

        print(k // gcd(k, g))

solve()
```DFS 计算距任意根的树距离。 根的选择并不重要，因为稍后只使用 gcd 值。 

第一个 gcd 更新包含遍历边缘并立即返回的功能。 如果没有这个术语，树木将被错误地处理。 

第二个 gcd 更新捕获了周期差异。 树边自动贡献零，因为对于树边我们有：```
dist[v] = dist[u] + w
```并且表达式变为零。 

所有算术都适合 64 位整数。 距离大致可以达到：```
10^5 × 10^9 = 10^14
```这完全在 Python 的整数范围内。 

## 工作示例

 ### 示例 1

 输入：```
1
4 5 3 1 4
1 4 3
1 2 1
2 4 2
2 3 4
3 4 5
```一种可能的 DFS 树给出：

 | 顶点| 距离 |
 | --- | --- |
 | 1 | 0 |
 | 2 | 1 |
 | 3 | 5 |
 | 4 | 3 |

 现在处理边缘。 

| 边缘| 2w| 距离[u]+w-距离[v] | 当前 G |
 | --- | --- | --- | --- |
 | 1-4 (3) | 1-4 (3) | 6 | 0 | 6 |
 | 1-2 (1) | 1-2 (1) | 2 | 0 | 2 |
 | 2-4 (2) | 2-4 (2) | 4 | 0 | 2 |
 | 2-3 (4) | 2-3 (4) | 8 | 0 | 2 |
 | 3-4 (5) | 3-4 (5) | 10 | 10 7 | 1 |

 最后：

 | 数量 | 价值|
 | --- | --- |
 | G | 1 |
 | gcd(G,k) | gcd(G,k) | 1 |
 | 回答 | 3 |

 这证实了所有三个残基模`3`是可达的。 

### 示例 2

 输入：```
1
2 1 4 1 2
1 2 1
```距离：

 | 顶点| 距离 |
 | --- | --- |
 | 1 | 0 |
 | 2 | 1 |

 边缘处理：

 | 边缘| 2w| 差异| 当前 G |
 | --- | --- | --- | --- |
 | 1-2 | 1-2 2 | 0 | 2 |

 最终计算：

 | 数量 | 价值|
 | --- | --- |
 | G | 2 |
 | gcd(G,k) | gcd(G,k) | 2 |
 | 回答 | 2 |

 可达残基为`{1,3}`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 一次图遍历，一次遍历所有边 |
 | 空间| O(n + m) | 邻接表、距离、访问数组 |

 和`n ≤ 10^5`和`m ≤ 2·10^5`，线性解决方案很容易符合典型的竞赛限制。 

## 测试用例```python
import sys
import io
from math import gcd

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    t = int(input())
    out = []

    for _ in range(t):
        n, m, k, s, tt = map(int, input().split())

        adj = [[] for _ in range(n)]
        edges = []

        for _ in range(m):
            u, v, w = map(int, input().split())
            u -= 1
            v -= 1

            adj[u].append((v, w))
            adj[v].append((u, w))
            edges.append((u, v, w))

        dist = [0] * n
        vis = [False] * n

        st = [0]
        vis[0] = True

        while st:
            u = st.pop()

            for v, w in adj[u]:
                if not vis[v]:
                    vis[v] = True
                    dist[v] = dist[u] + w
                    st.append(v)

        g = 0

        for u, v, w in edges:
            g = gcd(g, 2 * w)
            g = gcd(g, abs(dist[u] + w - dist[v]))

        out.append(str(k // gcd(k, g)))

    return "\n".join(out)

# sample
assert run(
"""1
4 5 3 1 4
1 4 3
1 2 1
2 4 2
2 3 4
3 4 5
"""
) == "3"

# single edge
assert run(
"""1
2 1 4 1 2
1 2 1
"""
) == "2"

# k = 1
assert run(
"""1
2 1 1 1 2
1 2 100
"""
) == "1"

# all weights zero
assert run(
"""1
3 2 7 1 3
1 2 0
2 3 0
"""
) == "1"

# cycle producing all residues modulo 5
assert run(
"""1
3 3 5 1 3
1 2 1
2 3 1
1 3 1
"""
) == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单边，权重1，k=4 | 2 | 回溯通过`2w`|
 | k=1 | k=1 1 | 最小模数|
 | 所有重量为零 | 1 | 简并图 |
 | 具有 gcd 1 的三角形 | 5 | 全面残留覆盖 |
 | 官方样品| 3 | 一般正确性 |

 ## 边缘情况

 考虑树：```
1
2 1 4 1 2
1 2 1
```只考虑循环的解决方案会得出没有自由的结论，因为图没有循环。 这是不正确的。 步行```
1 -> 2 -> 1 -> 2
```添加`2`至总重量。 我们的算法显式插入`2w`进入 gcd 计算，产生`G = 2`和正确答案`2`。 

现在考虑：```
1
2 1 1 1 2
1 2 100
```每个整数都等于`0 mod 1`。 该算法计算：```
answer = 1 / gcd(1, G) = 1
```这是唯一可能的结果。 

最后，考虑一个图，其周期差异 gcd 已经是`1`。 一次`G = 1`，我们有：```
gcd(k, G) = 1
```答案就变成了`k`。 该算法正确地识别出每个余数模`k`可以生产。
