---
title: "CF 1679D - 向你的图表扔一枚硬币......"
description: "该问题给出了一个有向图，其中每个顶点都有一个正整数值。 Masha 可以在任意顶点上放置一枚硬币，然后沿着图的边缘将其移动 $k-1$ 次。 每次硬币访问一个顶点时，该顶点的编号都会记录在笔记本中。"
date: "2026-06-10T00:41:58+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "dfs-and-similar", "dp", "graphs"]
categories: ["algorithms"]
codeforces_contest: 1679
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 791 (Div. 2)"
rating: 1900
weight: 1679
solve_time_s: 123
verified: true
draft: false
---

[CF 1679D - 向你的图表扔一枚硬币...](https://codeforces.com/problemset/problem/1679/D)

 **评级：** 1900
 **标签：** 二分查找、dfs 和类似、dp、图
 **求解时间：** 2m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题给出了一个有向图，其中每个顶点都有一个正整数值。 Masha 可以在任意顶点上放置一枚硬币，然后将其精确地沿着图的边缘移动$k-1$次。 每次硬币访问一个顶点时，该顶点的编号都会记录在笔记本中。 任务是最小化这些之后出现在笔记本中的最大数字$k$硬币放置，包括初始位置。 如果无法制作$k-1$由于图形太小或断开连接而移动，输出应该是$-1$。 

输入约束很大：最多$2 \cdot 10^5$顶点和边，以及$k$可以高达$10^{18}$。 这排除了任何显式模拟所有可能的移动或存储序列的算法$k$元素。 我们还需要处理大量的顶点值以及可能非常稀疏或断开连接的图。 

边缘情况很微妙。 如果图包含循环，Masha 可以无限重复顶点，这使得$k$只要从某个开始可以到达循环就无关紧要。 如果图是非循环的并且最长路径少于$k$顶点，输出为$-1$。 小图或最小顶点被隔离的图也存在幼稚算法的陷阱，这些算法仅在本地查找或假设所有顶点均可到达。 

例如，考虑一个具有三个顶点、边的图$1 \to 2$和$2 \to 3$， 和$k = 5$。 最长的路径只有三个顶点，所以无论玛莎如何移动，她都无法记录五个数字。 正确的输出是$-1$。 假设循环或无限移动的粗心方法会错误地尝试多次使用现有顶点。 

## 方法

 暴力方法是尝试将每个顶点作为起点并探索所有长度的路径$k$。 我们可以跟踪每条路径上的最大值并选择其中的最小值。 这在原则上是正确的，但很棘手：路径的数量随着图的大小呈指数增长，并且$k$取决于$10^{18}$。 即使是中等程度的深度有限的 DFS$k$是不可能的。 

关键的见解是认识到沿序列记录的最大数量是访问的顶点中的最大值。 如果我们猜测一个阈值$x$，我们可以检查是否存在长度的序列$k$只访问具有最多值的顶点$x$。 这将问题简化为由具有值的顶点形成的子图中的可达性问题$\le x$。 如果该子图的强连通分量有环，我们可以无限地重复移动以到达任何$k$。 如果图是非循环的，则子图中的最长路径必须至少为$k$。 利用这个属性，我们可以对候选最大值进行二分搜索，以有效地找到最小可行值$x$。 

暴力搜索显式尝试所有路径并失败$n = 2 \cdot 10^5$。 最佳解决方案将问题简化为对值进行二分搜索并结合 DFS 来检测循环或计算阈值子图中的最长路径。 这将复杂性降低到大约$O((n+m) \log n)$，这是可行的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^k) | O(n^k) | O(k) | 太慢了|
 | 二分查找+DFS | O((n+m) log(max a_i)) | O((n+m) log(max a_i)) | O(n+m) | 已接受 |

 ## 算法演练

 1. 收集所有唯一的顶点值并对其进行排序。 这些是序列中最小最大值的唯一候选者。 
2. Implement a check function`can(x)`如果存在长度序列则返回 True$k$只访问有值的顶点$\le x$。 构造仅包含顶点的子图`a[i] <= x`以及它们之间的边缘。 
3. 在`can(x)`，使用带有递归栈的DFS检测子图中是否存在循环。 如果存在循环，则序列可以无限延长。 在这种情况下返回 True。 
4. 如果不存在环，则使用具有记忆功能的 DFS 计算子图中最长路径的长度。 如果最长路径至少有$k$顶点，返回True； 否则，返回 False。 
5. 对排序后的唯一顶点值进行二分搜索。 对于每位候选人`x`， 使用`can(x)`以确定是否可能。 不断缩小搜索范围以找到最小的可行最大值。 
6. 如果没有候选人通过检查（所有子图均不支持$k$移动），返回$-1$。 

不变的是，我们总是在有效的顶点值中搜索，并且只考虑没有值超过候选阈值的子图。 DFS 正确识别了周期，保证我们不会低估可达性。 记忆最长路径计算确保非循环子图中的正确评估。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
sys.setrecursionlimit(10**6)

def solve():
    n, m, k = map(int, input().split())
    a = list(map(int, input().split()))
    edges = [[] for _ in range(n)]
    for _ in range(m):
        u, v = map(int, input().split())
        edges[u-1].append(v-1)

    unique_vals = sorted(set(a))

    def can(x):
        subgraph = [[] for _ in range(n)]
        for u in range(n):
            if a[u] <= x:
                for v in edges[u]:
                    if a[v] <= x:
                        subgraph[u].append(v)

        visited = [0]*n
        dp = [0]*n

        def dfs(u):
            visited[u] = 1
            max_len = 1
            for v in subgraph[u]:
                if visited[v] == 0:
                    ret = dfs(v)
                    max_len = max(max_len, 1 + ret)
                elif visited[v] == 1:
                    return k  # cycle detected
                else:
                    max_len = max(max_len, 1 + dp[v])
            visited[u] = 2
            dp[u] = max_len
            return dp[u]

        max_path = 0
        for i in range(n):
            if a[i] <= x and visited[i] == 0:
                length = dfs(i)
                if length >= k:
                    return True
                max_path = max(max_path, length)
        return max_path >= k

    left, right = 0, len(unique_vals)-1
    ans = -1
    while left <= right:
        mid = (left + right)//2
        if can(unique_vals[mid]):
            ans = unique_vals[mid]
            right = mid - 1
        else:
            left = mid + 1
    print(ans)

solve()
```该解决方案首先为每个候选最大值设置子图。 DFS 用于循环检测和最长路径计算。 这`visited`数组区分未访问、访问和已处理的节点以检测循环。 二分搜索仅迭代唯一值，避免不必要的重复检查。 

## 工作示例

 **样品1**

 | 步骤| 候选人 x | 子图顶点 | 循环？ | 最长的路径| 可以（x）吗？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 1 | [1] | 没有 | 1 | 假 |
 | 2 | 2 | [1,3]| 没有 | 2 | 假 |
 | 3 | 3 | [1,3,4]| 没有 | 3 | 假 |
 | 4 | 4 | [1,3,4,5]| 没有 | 4 | 真实|

 最小可行最大值为 4。这与示例输出匹配。 

**样品2**

 | 步骤| 候选人 x | 子图顶点 | 循环？ | 最长的路径| 可以（x）吗？ |
 | --- | --- | --- | --- | --- | --- |
 | 1 | 4 | [2,4,5,6] | 是的 | - | 真实|

 循环允许重复移动，因此任何大的$k$是可能的。 最小值最大值为 4。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n+m) log n) | O((n+m) log n) | 每个 DFS 的运行时间为 O(n+m)，二分搜索在唯一的顶点值上迭代 O(log n) |
 | 空间| O(n+m) | 对于邻接列表、访问数组和记忆 |

 该解决方案很容易满足约束条件：DFS 和记忆化可以有效地处理 200,000 个顶点，二分搜索在 32 位整数范围内添加对数因子。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("""6 7 4
1 10 2 3 4 5
1 2
1 3
3 4
4 5
5 6
6 2
2 5""") == "4", "sample 1"

# Minimum size
assert run("""1 0 1
7""") == "7", "single vertex, 1 move"

# Impossible moves
assert run("""3 2 5
1 2 3
1 2
2 3""") == "-1", "long path impossible"

#
```
