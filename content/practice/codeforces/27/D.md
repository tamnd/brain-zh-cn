---
title: "CF 27D - 环路 2"
description: "我们有一个由 n 个城市排列成环的循环。 每对连续的城市都已由外环路连接起来，并且城市 n 也连接回城市 1。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "2-sat", "dfs-and-similar", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 27
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 27 (Codeforces format, Div. 2)"
rating: 2200
weight: 27
solve_time_s: 90
verified: true
draft: false
---
[CF 27D - 环路 2](https://codeforces.com/problemset/problem/27/D)

 **评分：** 2200
 **标签：** 2-sat、dfs 和类似、dsu、图表
 **求解时间：** 1m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个循环`n`城市排列成环。 每对连续的城市都已经由外环路连接起来，并且城市`n`也连接回城市`1`。 

我们还额外给出了`m`新道路。 每条新道路都通过一条曲线连接两个城市，该曲线必须完全位于环内或环外。 两条新道路仅允许在共享端点处接触。 禁止任何其他交叉路口。 

任务是决定每条新道路是否应该向内还是向外，以便没有两条道路交叉。 如果存在这样的分配，我们打印一个长度的字符串`m`每个字符在哪里`i`或者`o`。 否则我们打印`Impossible`。 

一旦我们注意到环固定了城市的循环顺序，几何形状就会变得简单得多。 道路只是一个圆的弦。 当两条弦的端点围绕循环交替时，它们恰好在圆内相交。 

这些限制足够小，我们可以明确地比较每对道路。 自从`m ≤ 100`, 最多有`4950`对。 这立即表明`O(m²)`图构建是安全的。 不需要更复杂的几何数据结构。 

危险的部分不是性能，而是正确地模拟交叉条件。 粗心的实现经常会导致循环顺序错误，尤其是当端点环绕编号末尾时。 

一种微妙的情况是两条道路共享一个端点。 这样的道路永远不会形成禁止交叉路口。 

例子：```
5 2
1 3
1 4
```这些道路只与城市相连`1`，所以两者都可以被绘制在里面。 忽略共享顶点的简单交替端点检查可能会错误地将它们标记为相交。 

当端点未标准化时，另一个容易出现的错误就会出现。 

例子：```
6 2
5 2
1 4
```如果我们将第一条路保留为`(5,2)`而不是将其转换为`(2,5)`，间隔检查变得不一致并且可能会错过交叉点。 

一个更微妙的几何问题来自圆形结构。 

例子：```
6 2
1 4
2 5
```绕一圈走就发出了命令`1 2 4 5`。 端点是交替的，因此如果放置在同一侧，弦就会相交。 任何正确的解决方案都必须迫使一条路向内，另一条路向外。 

最后，存在一些约束相互矛盾的配置。 

例子：```
6 3
1 4
2 5
3 6
```每对交叉，因此每对必须位于相对的两侧。 这形成了一个奇怪的约束循环，这在只有两侧是不可能的。 正确的输出是`Impossible`。 

## 方法

 蛮力的想法很简单。 每条路独立选择内部或外部，因此有`2^m`可能的任务。 对于每个任务，我们可以检查每对道路并验证相交的道路是否放置在相对侧。 

这是有效的，因为条件纯粹是成对的。 两条路只有在几何上交叉时才有意义。 不幸的是，即使`m = 100`使`2^100`天文数字般大。 在最坏的情况下，没有任何修剪策略可以挽救这种方法。 

关键的观察是每个交叉对都会施加一个二元约束：

 如果两条路相交，则其中必须恰好有一条在内部。 

这是经典的 2 着色条件。 我们可以将每条路视为一个布尔变量：`True`意思是里面，`False`意思是外面。 

每当两条路交叉时，它们的值必定不同。 这将问题转换为检查图是否是二分图。 每条路都成为一个顶点。 如果相应的道路相交，我们就连接两个顶点。 然后：

 如果图是二分图，则一个分区可以在内部，另一个分区可以在外部。 

如果图不是二分图，则某些奇怪的循环会迫使要求相互矛盾。 

该问题通常也被描述为 2-SAT 实例，因为每个交叉对都会生成：`(A or B) and (!A or !B)`这强制执行`A != B`。 

对于这个特定问题，双向检查更简单并且完全足够。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^m · 平方米) | O(米) | 太慢了 |
 | 最佳 | O(平方米) | O(平方米) | 已接受 |

 ## 算法演练

 1. 读取所有道路并对每条道路进行标准化，以便`a < b`。 

这让我们可以将每条道路视为循环顺序上的标准间隔。 
2. 对于每对道路，判断它们是否相交。 

两条路`(a,b)`和`(c,d)`如果它们的端点交替，则相交：`a < c < b < d`或者`c < a < d < b`共享端点被忽略，因为允许触摸端点。 
3. 构建一个图，其中每条道路都是一个顶点。 

如果两条道路相交，请在它们的顶点之间添加一条无向边。 
4. 尝试使用 DFS 或 BFS 对图进行 2 色。 

指定颜色`0`一侧和颜色`1`到另一个。 
5. 每当我们遍历一条边时，强制相邻顶点接收相反的颜色。 

这符合相交道路必须位于环路两侧的要求。 
6. 如果我们遇到一条边，其端点已经具有相同的颜色，则该图不是二分图。 

在这种情况下打印`Impossible`。 
7. 否则，将颜色转换为字符。 

例如：`0 -> i`

`1 -> o`打印结果字符串。 

### 为什么它有效

 该图准确地捕捉了禁止的情况。 每条边代表一对无法绘制在同一侧的道路，因为它们在几何上相交。 

有效的绘图相当于将两条边之一分配给每条道路，使得相邻顶点接收不同的分配。 这正是二分图着色的定义。 

如果图是二分图，则着色直接给出有效的构造。 如果不是二分的，一些奇怪的循环需要在循环周围交替颜色，并最终产生矛盾。 在这种情况下不存在有效的展示位置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def intersect(a, b, c, d):
    if len({a, b, c, d}) < 4:
        return False

    return (a < c < b < d) or (c < a < d < b)

def solve():
    n, m = map(int, input().split())

    roads = []

    for _ in range(m):
        a, b = map(int, input().split())

        if a > b:
            a, b = b, a

        roads.append((a, b))

    graph = [[] for _ in range(m)]

    for i in range(m):
        a, b = roads[i]

        for j in range(i + 1, m):
            c, d = roads[j]

            if intersect(a, b, c, d):
                graph[i].append(j)
                graph[j].append(i)

    color = [-1] * m

    def dfs(v, c):
        color[v] = c

        for to in graph[v]:
            if color[to] == -1:
                if not dfs(to, c ^ 1):
                    return False
            elif color[to] == c:
                return False

        return True

    for i in range(m):
        if color[i] == -1:
            if not dfs(i, 0):
                print("Impossible")
                return

    ans = ''.join('i' if c == 0 else 'o' for c in color)
    print(ans)

solve()
```第一个重要的细节是端点标准化。 每条道路都存储有`a < b`。 如果没有此步骤，交替端点测试就会变得不一致。 

这`intersect`函数直接实现几何条件。 当第二弦的一个端点严格位于第一弦的音程之内而另一个端点位于之外时，两个弦相交。 共享端点在检查之前被排除，因为它们是合法的交叉点。 

图的构建对每对道路进行一次比较。 自从`m ≤ 100`，这最多花费五千张支票左右。 

DFS 执行普通的二分着色。 表达式`c ^ 1`之间翻转`0`和`1`。 如果我们重新访问与其邻居颜色相同的顶点，我们会发现一个奇怪的循环并立即终止。 

最后，颜色被转化为`i`和`o`。 任何一致的映射都有效。 

## 工作示例

 ### 示例 1

 输入：```
4 2
1 3
2 4
```道路相交，因为顺序是`1 2 3 4`。 

| 配对| 相交？ | 图边|
 | --- | --- | --- |
 | (1,3) 和 (2,4) | 是的 | 0 ↔ 1 |

 DFS着色：

 | 顶点| 颜色 | 输出字符 |
 | --- | --- | --- |
 | 0 | 0 | 我|
 | 1 | 1 | 哦|

 可能的输出：```
io
```此示例演示了核心约束。 相交的道路必须采用相反的颜色。 

### 示例 2

 输入：```
6 3
1 4
2 5
3 6
```两两相交：

 | 配对| 相交？ |
 | --- | --- |
 | (1,4) 和 (2,5) | 是的 |
 | (1,4) 和 (3,6) | 是的 |
 | (2,5) 和 (3,6) | 是的 |

 图形变成三角形。 

DFS着色尝试：

 | 顶点| 指定颜色 |
 | --- | --- |
 | 0 | 0 |
 | 1 | 1 |
 | 2 | 1 |

 现在顶点`1`和`2`相邻但具有相同的颜色，因此该图不是二分图。 

输出：```
Impossible
```该迹线显示奇数周期如何对应矛盾的几何要求。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(平方米) | 每对道路都检查一次 |
 | 空间| O(平方米) | 交集图可以包含 O(m²) 条边 |

 和`m ≤ 100`，即使是密集的图例也很小。 大约五千对检查和最多一万个邻接条目很容易满足限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def intersect(a, b, c, d):
        if len({a, b, c, d}) < 4:
            return False

        return (a < c < b < d) or (c < a < d < b)

    n, m = map(int, input().split())

    roads = []

    for _ in range(m):
        a, b = map(int, input().split())

        if a > b:
            a, b = b, a

        roads.append((a, b))

    graph = [[] for _ in range(m)]

    for i in range(m):
        a, b = roads[i]

        for j in range(i + 1, m):
            c, d = roads[j]

            if intersect(a, b, c, d):
                graph[i].append(j)
                graph[j].append(i)

    color = [-1] * m

    def dfs(v, c):
        color[v] = c

        for to in graph[v]:
            if color[to] == -1:
                if not dfs(to, c ^ 1):
                    return False
            elif color[to] == c:
                return False

        return True

    ok = True

    for i in range(m):
        if color[i] == -1:
            if not dfs(i, 0):
                ok = False
                break

    if not ok:
        return "Impossible"

    return ''.join('i' if c == 0 else 'o' for c in color)

# provided sample
assert run(
"""4 2
1 3
2 4
"""
) in ["io", "oi"], "sample 1"

# minimum valid input
assert run(
"""4 1
1 3
"""
) == "i", "single road"

# impossible odd cycle
assert run(
"""6 3
1 4
2 5
3 6
"""
) == "Impossible", "odd cycle"

# shared endpoint should not intersect
assert run(
"""5 2
1 3
1 4
"""
) == "ii", "shared endpoint"

# non-crossing nested chords
assert run(
"""6 2
1 6
2 5
"""
) == "ii", "nested non-crossing"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单路|`i`| 具有一个组件的简单图 |
 | 三对交叉|`Impossible`| 奇循环矛盾 |
 | 共享端点案例|`ii`| 允许端点触摸 |
 | 嵌套和弦|`ii`| 嵌套间隔不相交 |

 ## 边缘情况

 考虑共享一个端点的道路：```
5 2
1 3
1 4
```标准化后我们有`(1,3)`和`(1,4)`。 交集检查首先注意到四个端点不不同，因此它立即返回`False`。 图中未添加任何边。 两条道路可能会获得相同的颜色，从而产生`ii`。 

现在考虑反转端点：```
6 2
5 2
1 4
```标准化转换`(5,2)`进入`(2,5)`。 围绕圆的顺序变为`1 2 4 5`，交替出现，因此道路相交。 添加一条边，图形强制使用相反的颜色。 如果没有标准化，区间逻辑就会失败。 

最后，考虑不可能三角形：```
6 3
1 4
2 5
3 6
```每对交替出现，因此该图是一个 3 循环。 DFS分配颜色：```
0 -> 0
1 -> 1
2 -> 0
```但顶点`0`和`2`相邻，产生冲突。 算法正确打印`Impossible`。
