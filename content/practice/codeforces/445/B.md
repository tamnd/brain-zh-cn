---
title: "CF 445B - DZY 爱化学"
description: "化学物质和反应形成无向图。 每个顶点代表一种化学物质，两个顶点之间的边意味着这两种化学物质发生反应。 我们从等于 1 的危险开始。化学品以任意顺序一次倒入一种。"
date: "2026-06-07T16:02:53+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "greedy"]
categories: ["algorithms"]
codeforces_contest: 445
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 254 (Div. 2)"
rating: 1400
weight: 445
solve_time_s: 109
verified: true
draft: false
---

[CF 445B - DZY 热爱化学](https://codeforces.com/problemset/problem/445/B)

 **评分：** 1400
 **标签：** dfs 和类似的、dsu、贪婪
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 化学物质和反应形成无向图。 每个顶点代表一种化学物质，两个顶点之间的边意味着这两种化学物质发生反应。 

我们从等于 1 的危险开始。化学品以任意顺序一次倒入一种。 每当新添加的化学品与管内已有的化学品至少有一个反应边缘时，当前危险就会乘以 2。否则危险保持不变。 

任务是选择使最终危险最大化的浇注顺序。 

直接阅读表明答案取决于顺序，但图形结构隐藏了一个更简单的模式。 关键问题是我们可以强制乘以 2 多少次。 

约束足够小，任何线性或接近线性的图算法都很容易被接受。 即使$n$和$m$原始问题中只有大约几十个，预期的解决方案基于连接的组件并运行在$O(n+m)$。 暴力破解排列需要$n!$的可能性，而这几乎立即变得不可能。 

一些边缘情况很容易被误解。 

考虑一个没有边的图：```
3 0
```任何化学物质都不会与之前插入的化学物质发生反应。 危险永远不会改变，所以答案是：```
1
```计算顶点而不是反应的粗心方法可能会错误地产生更大的值。 

考虑一个连接的链：```
3 2
1 2
2 3
```一个最佳顺序是 1、2、3。第一种化学物质不进行乘法运算。 第二个和第三个都会与已经存在的东西发生反应，因此危险会成倍增加。 答案是：```
4
```一个常见的错误是认为每条边都贡献乘法。 这里有两条边，但在第一个顶点之后只有两次成功插入。 

考虑两个断开连接的组件：```
4 2
1 2
3 4
```每个分量贡献一次乘法。 答案是：```
4
```将整个图视为单个结构会错误地给出$2^3=8$。 

## 方法

 蛮力的想法是尝试每一种可能的浇注顺序。 对于每个排列，我们模拟该过程并计算有多少插入导致与已插入的化学物质发生反应。 

这是正确的，因为它明确地评估每个有效的排序。 不幸的是，有$n!$排列。 即使是为了$n=15$，这已经是超过万亿种可能性了，完全不可行。 

为了找到更好的方法，我们需要了解一个连接组件内部发生的情况。 

取任何包含以下内容的连接组件$k$顶点。 从该组件中倒入的第一种化学物质不能与同一组件中的任何物质发生反应，因为它的组件伴侣还不存在。 可以安排所有其他顶点做出反应。 

为什么？ 从组件的任意顶点开始。 由于组件已连接，我们可以按 DFS 或 BFS 顺序显示剩余的顶点。 每个新显示的顶点都与某个先前显示的顶点有一条边，因此每次插入都会将危险乘以 2。 

这意味着尺寸的连通分量$k$准确贡献$k-1$乘法。 

不同的连接组件是独立的。 每个组件都有自己的贡献$k-1$乘法，并对所有分量求和得出$$\sum (k_i - 1)$$在哪里$k_i$是的大小$i$-th 连接分量。 

由于组件尺寸总计为$n$,$$\sum (k_i - 1) = n - c$$在哪里$c$是连接分量的数量。 

因此，最后的危险是$$2^{\,n-c}.$$剩下的就是用 DFS、BFS 或 DSU 对连接的组件进行计数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(n! \cdot (n+m))$|$O(n)$| 太慢了|
 | 最佳 |$O(n+m)$|$O(n)$| 已接受 |

 ## 算法演练

 1. 根据反应对构建无向图。 
2. 使用DFS 查找所有连通分量。 
3. 对于每个未访问的顶点，启动 DFS 并计算有多少个顶点属于其组件。 
4. 如果一个组件包含$k$顶点，添加$k-1$到危险倍增的总数。 

组件的第一个顶点无法产生反应。 每个剩余的顶点都可以插入到已经存在的邻居之后。 
5. 处理完所有分量后，令乘法总数为$cnt$。 
6.答案是$2^{cnt}$。 
7. 打印答案。 

### 为什么它有效

 在尺寸为的连接组件内$k$，至少必须先插入一个顶点。 该插入不会增加危险，因为不存在组件的其他顶点。 

通过 DFS 或 BFS 遍历到达其他每个顶点后都可以插入该顶点。 此时，它的邻居之一已经存在，因此插入会使危险增加 2 倍。 

因此，一个组件的贡献正好$k-1$乘法，不多也不少。 对所有分量求和得出乘法总数。 由于每次乘法都会使危险加倍，并且初始危险为 1，因此最终答案为$2^{\sum(k-1)}$。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())

    graph = [[] for _ in range(n)]

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n
    multiplications = 0

    for start in range(n):
        if visited[start]:
            continue

        stack = [start]
        visited[start] = True
        size = 0

        while stack:
            v = stack.pop()
            size += 1

            for to in graph[v]:
                if not visited[to]:
                    visited[to] = True
                    stack.append(to)

        multiplications += size - 1

    print(1 << multiplications)

if __name__ == "__main__":
    solve()
```该图存储为邻接列表，因为输入自然地描述了化学品之间的边缘。 

DFS 计算每个连接组件的大小。 一旦知道组件尺寸，我们就添加`size - 1`成功的危险加倍的次数。 

最终答案是2的幂。 Python 整数具有任意精度，因此即使是最大的有效答案也能轻松拟合。 使用`1 << multiplications`计算$2^{\text{multiplications}}$直接、高效。 

输入中的顶点从 1 开始编号，而 Python 列表使用基于 0 的索引，因此在读取边时每个端点都会精确地递减一次。 

## 工作示例

 ### 示例 1

 输入：```
1 0
```| 步骤| 元件尺寸| 乘法加法 | 总乘法|
 | ---| ---| ---| ---|
 | DFS 从 1 | 1 | 0 | 0 |

 最终答案：$$2^0 = 1$$输出：```
1
```这展示了尽可能小的图。 单一的孤立化学物质永远不会产生反应。 

### 示例 2

 输入：```
4 2
1 2
3 4
```| 步骤| 元件尺寸| 乘法加法 | 总乘法|
 | ---| ---| ---| ---|
 | DFS 从 1 | 2 | 1 | 1 |
 | DFS 从 3 | 2 | 1 | 2 |

 最终答案：$$2^2 = 4$$输出：```
4
```此示例显示断开连接的组件独立做出贡献。 每个尺寸为 2 的组件都会贡献一倍。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(n+m)$| 每个顶点和边在 DFS 期间最多被访问一次 |
 | 空间|$O(n+m)$| 邻接表加上访问过的数组 |

 该算法执行单个图遍历。 每条边都会被检查固定次数，使其足够快以解决问题限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, m = map(int, input().split())

    graph = [[] for _ in range(n)]

    for _ in range(m):
        u, v = map(int, input().split())
        u -= 1
        v -= 1
        graph[u].append(v)
        graph[v].append(u)

    visited = [False] * n
    mult = 0

    for i in range(n):
        if visited[i]:
            continue

        stack = [i]
        visited[i] = True
        size = 0

        while stack:
            v = stack.pop()
            size += 1

            for to in graph[v]:
                if not visited[to]:
                    visited[to] = True
                    stack.append(to)

        mult += size - 1

    return str(1 << mult)

# provided sample
assert run("1 0\n") == "1", "sample 1"

# single edge
assert run("2 1\n1 2\n") == "2", "one reaction"

# chain of three vertices
assert run("3 2\n1 2\n2 3\n") == "4", "connected component size 3"

# two disconnected pairs
assert run("4 2\n1 2\n3 4\n") == "4", "two components"

# complete graph on four vertices
assert run(
    "4 6\n"
    "1 2\n"
    "1 3\n"
    "1 4\n"
    "2 3\n"
    "2 4\n"
    "3 4\n"
) == "8", "single component size 4"

# all isolated vertices
assert run("5 0\n") == "1", "no reactions"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 0`|`1`| 最小输入|
 |`2 1`|`2`| 大小为 2 的单个连通分量 |
 | 长度为 3 的链条 |`4`| 连接遍历逻辑 |
 | 两对断开连接 |`4`| 多个组件|
 | 具有 4 个顶点的完整图 |`8`| 密集图，答案仅取决于组件大小 |
 |`5 0`|`1`| 所有顶点被隔离 |

 ## 边缘情况

 ### 所有化学品均被隔离

 输入：```
4 0
```该图包含四个连通分量，每个分量的大小为 1。 

| 元件尺寸| 贡献 |
 | ---| ---|
 | 1 | 0 |
 | 1 | 0 |
 | 1 | 0 |
 | 1 | 0 |

 总乘法等于 0，所以答案是：$$2^0 = 1.$$算法正确计算`size - 1 = 0`对于每个组件。 

### 一个大型连通组件

 输入：```
4 3
1 2
2 3
3 4
```该图已连接。 

| 元件尺寸| 贡献 |
 | ---| ---|
 | 4 | 3 |

 答案是：$$2^3 = 8.$$DFS 找到大小为 4 的单个分量并恰好添加 3 个乘法。 

### 多个不同大小的断开组件

 输入：```
6 3
1 2
2 3
5 6
```组件大小为 3、1 和 2。 

| 元件尺寸| 贡献 |
 | ---| ---|
 | 3 | 2 |
 | 1 | 0 |
 | 2 | 1 |

 总乘法：$$2 + 0 + 1 = 3.$$最终答案：$$2^3 = 8.$$这证实了该算法可以在没有任何特殊情况的情况下一起处理孤立的顶点和非平凡的组件。
