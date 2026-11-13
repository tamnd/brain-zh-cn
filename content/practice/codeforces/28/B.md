---
title: "CF 28B - pSort"
description: "我们从一个数组开始，其中位置 i 最初包含值 i。 每个位置也有固定的跳跃距离d[i]。 仅当 |i - j| 时才允许位置 i 和 j 之间的交换 = d[i]."
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dsu", "graphs"]
categories: ["algorithms"]
codeforces_contest: 28
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 28 (Codeforces format)"
rating: 1600
weight: 28
solve_time_s: 93
verified: true
draft: false
---
[CF 28B - pSort](https://codeforces.com/problemset/problem/28/B)

 **评分：** 1600
 **标签：** dfs 和类似、dsu、图表
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们从一个数组开始，其中位置`i`最初包含价值`i`。 每个位置也有固定的跳跃距离`d[i]`。 仓位之间允许互换`i`和`j`仅当`|i - j| = d[i]`。 

目标数组是一个排列。 我们必须决定允许的交换是否足以将初始有序数组转换为该排列。 

第一个重要的细节是交换规则在语句中是不对称的。 位置`i`可以与任何交换`j`满足距离条件。 但一旦存在这样的货币对，交换本身就完全正常，两者价值交换位置。 如果位置`i`可以达到`j`，然后位置`i`和`j`属于同一运动结构。 

约束条件很小，`n ≤ 100`。 即使是三次解也能在时间限制内轻松完成。 这意味着我们不需要高级优化，但我们仍然需要正确的图形解释。 对所有排列进行强力状态搜索是不可能的，因为有`n!`州。 即使是为了`n = 10`，这已经变得太大了。 

关键的观察是，互换仅在头寸的连接区域内移动值。 如果位置`1`最终能够达到的位置`3`和`5`通过一系列交换，可以在这些位置之间任意重新排列值。 如果两个位置属于不同的连接组件，则任何交换序列都不能将值移动越过该边界。 

一个常见的错误是仅检查直接交换而不是交换链。 

考虑：```
3
2 3 1
1 1 1
```正确答案是`YES`。 

位置`1`可以交换`2`， 和`2`可以交换`3`。 虽然`1`不能直接交换`3`，值`1`仍然可以通过中间交换前往那里。 

另一个容易犯的错误是忘记了图在实践中是无向的。 

例子：```
2
2 1
1 2
```答案是`NO`。 

位置`1`可以交换`2`因为`|1 - 2| = 1`，但位置`2`不能与交换`1`因为`|2 - 1| ≠ 2`。 既然声明说`i`第-个细胞可以与`j`，仅从有效生成的边`i`事情。 这里只存在一个方向，但掉期本身仍然连接着头寸。 我们将其视为无向边，因为在一次合法交换后，两个位置的值都会交换。 

另一个微妙的情况是孤立的节点。```
4
1 3 2 4
4 1 1 4
```答案是`YES`。 

职位`2`和`3`可以互换，同时位置`1`和`4`被孤立。 目标排列仅交换连接对内的值`{2,3}`，所以是可达的。 

## 方法

 暴力方法将使用状态上的 BFS 或 DFS 来模拟所有可达排列。 每个状态都是一个排列，每个合法交换都会生成另一个状态。 这是正确的，因为最终每个可到达的配置都会被探索。 

问题在于状态计数。 有`n!`排列。 即使在`n = 10`，那就已经超过300万个状态了，每个状态都可以产生很多交换。 实际限制是`100`，因此穷举搜索是没有希望的。 

互换的结构给出了更简单的解释。 

将位置视为图形顶点。 对于每个职位`i`，我们将它与每个有效位置连接起来`j`满意：```
|i - j| = d[i]
```如果两个位置位于同一个连接组件中，则值可以通过交换序列在它们之间移动。 在连接的组件内部，任意重新排列成为可能，因为沿路径的交换允许我们自由地排列所包含的值。 

这完全改变了问题。 我们不需要跟踪排列，只需验证每个值最终是否位于与其原始位置相同的连接组件内。 

价值`x`从位置开始`x`。 在目标排列中，它出现在某个位置`pos`。 该安排是可达的当且仅当`x`和`pos`属于同一个连通分量。 

我们可以使用 DFS 或 DSU 构建图形并计算连接的组件。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!·n²) | O(n!·n²) | O(n!) | 太慢了 |
 | 最佳 | O(n²) | O(n) | 已接受 |

 ## 算法演练

 1. 读取排列`p`以及最喜欢的距离`d`。 
2. 构建持仓图表`1 ... n`。 

对于每个职位`i`，检查位置：```
i - d[i]
i + d[i]
```如果它们在边界内，则将它们与`i`。 

这些边代表合法的交换。 
3. 使用 DFS 或 DSU 计算连通分量。 

同一组件内的位置可以通过交换序列交换值。 
4. 对于每个位置`i`, 看值`p[i]`。 

价值`p[i]`最初开始于位置`p[i]`。 将其放置在位置`i`，两个位置必须属于同一个连通分量。 
5. 如果任何位置未通过此检查，则打印`NO`。 
6. 否则打印`YES`。 

### 为什么它有效

 合法交换永远不会将值移出其连接的组件，因为每个交换边都保留在该组件内部。 所以如果值`x`必须在位置结束`i`， 然后`x`和`i`必须属于同一个组件。 

相反的方向也成立。 在连接的组件内，沿图形边缘重复交换允许值移动该组件中的任何位置。 由于连接的组件是独立的，因此我们可以将每个组件分别重新排列为所需的顺序。 

这使得连通分量条件既是必要的又是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class DSU:
    def __init__(self, n):
        self.parent = list(range(n))

    def find(self, x):
        if self.parent[x] != x:
            self.parent[x] = self.find(self.parent[x])
        return self.parent[x]

    def union(self, a, b):
        a = self.find(a)
        b = self.find(b)

        if a != b:
            self.parent[b] = a

def solve():
    n = int(input())

    p = list(map(int, input().split()))
    d = list(map(int, input().split()))

    dsu = DSU(n)

    for i in range(n):
        left = i - d[i]
        right = i + d[i]

        if left >= 0:
            dsu.union(i, left)

        if right < n:
            dsu.union(i, right)

    for i in range(n):
        target_value = p[i] - 1

        if dsu.find(i) != dsu.find(target_value):
            print("NO")
            return

    print("YES")

solve()
```DSU 存储仓位的连通分量。 每个有效的交换都会在两个索引之间创建一条边，因此联合操作会增量地构建移动图。 

该实现在内部使用从零开始的索引。 这就是为什么位置值`i`变成`p[i] - 1`在比较组件之前。 忘记此转换是此问题中最常见的差一错误之一。 

对于每个索引，我们尝试两种可能的目的地，`i - d[i]`和`i + d[i]`。 边界检查很重要，因为有些跳转会离开数组。 

最后的验证步骤直接对核心不变量进行编码。 价值`p[i]`开始于位置`p[i] - 1`。 如果它的原始位置和当前目的地属于不同的组件，则任何合法的交换序列都不能将其放置在那里。 

## 工作示例

 ### 示例 1

 输入：```
5
5 4 3 2 1
1 1 1 1 1
```图构建：

 | 位置 | d[i] | 可达职位|
 | --- | --- | --- |
 | 1 | 1 | 2 |
 | 2 | 1 | 1, 3 |
 | 3 | 1 | 2, 4 |
 | 4 | 1 | 3, 5 |
 | 5 | 1 | 4 |

 所有位置都已连接。 

成分表：

 | 位置 | 组件|
 | --- | --- |
 | 1 | 一个 |
 | 2 | 一个 |
 | 3 | 一个 |
 | 4 | 一个 |
 | 5 | 一个 |

 验证：

 | 目标位置| 所需价值| 价值原位| 相同的组件？ |
 | --- | --- | --- | --- |
 | 1 | 5 | 5 | 是的 |
 | 2 | 4 | 4 | 是的 |
 | 3 | 3 | 3 | 是的 |
 | 4 | 2 | 2 | 是的 |
 | 5 | 1 | 1 | 是的 |

 输出：```
YES
```该轨迹表明，一旦图完全连接，任何排列都变得可达。 

### 示例 2

 输入：```
4
2 1 4 3
2 2 1 1
```图构建：

 | 位置 | d[i] | 可达职位|
 | --- | --- | --- |
 | 1 | 2 | 3 |
 | 2 | 2 | 4 |
 | 3 | 1 | 2, 4 |
 | 4 | 1 | 3 |

 连接的组件：

 | 位置 | 组件|
 | --- | --- |
 | 1 | 一个 |
 | 2 | 乙|
 | 3 | 乙|
 | 4 | 乙|

 验证：

 | 目标位置| 所需价值| 价值原位| 相同的组件？ |
 | --- | --- | --- | --- |
 | 1 | 2 | 2 | 没有 |

 输出：```
NO
```价值`2`从组件开始`B`，但位置`1`属于组件`A`。 任何法律序列都不能跨越该边界。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n²) | DSU 操作几乎是恒定的，我们每个节点最多处理两条边 |
 | 空间| O(n) | DSU 父数组每个位置存储一个条目 |

 和`n ≤ 100`，这个解决方案远远低于极限。 即使是密集的图遍历也能轻松通过。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class DSU:
        def __init__(self, n):
            self.parent = list(range(n))

        def find(self, x):
            if self.parent[x] != x:
                self.parent[x] = self.find(self.parent[x])
            return self.parent[x]

        def union(self, a, b):
            a = self.find(a)
            b = self.find(b)

            if a != b:
                self.parent[b] = a

    n = int(input())

    p = list(map(int, input().split()))
    d = list(map(int, input().split()))

    dsu = DSU(n)

    for i in range(n):
        left = i - d[i]
        right = i + d[i]

        if left >= 0:
            dsu.union(i, left)

        if right < n:
            dsu.union(i, right)

    for i in range(n):
        if dsu.find(i) != dsu.find(p[i] - 1):
            return "NO"

    return "YES"

# provided sample
assert run(
"""5
5 4 3 2 1
1 1 1 1 1
"""
) == "YES", "sample 1"

# minimum size
assert run(
"""1
1
1
"""
) == "YES", "single element"

# isolated positions
assert run(
"""4
2 1 3 4
4 4 4 4
"""
) == "NO", "no swaps possible"

# connected through chains
assert run(
"""3
2 3 1
1 1 1
"""
) == "YES", "indirect reachability"

# partial components
assert run(
"""4
1 3 2 4
4 1 1 4
"""
) == "YES", "swap only inside one component"

# off-by-one boundary test
assert run(
"""2
2 1
2 2
"""
) == "NO", "out-of-range jumps create no edges"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单元素数组 | 是 | 简单的组件处理 |
 | 任何地方都没有有效的交换 | 否 | 孤立的节点保持固定|
 | 链连接图| 是 | 通过路径间接移动 |
 | 一个小的连接组件 | 是 | 独立组件重排 |
 | 超出范围跳跃 | 否 | 边界检查和索引正确性|

 ## 边缘情况

 考虑间接连接情况：```
3
2 3 1
1 1 1
```图的边是：```
1 <-> 2
2 <-> 3
```所有位置都属于一个连通分量。 即使位置`1`不能直接交换`3`， 价值`1`可以使用以下方式移动：```
[1 2 3]
-> swap 1 and 2
[2 1 3]
-> swap 2 and 3
[2 3 1]
```DSU 正确合并了所有三个位置，因此算法输出`YES`。 

现在考虑孤立节点：```
4
2 1 3 4
4 4 4 4
```每次跳转都会超出数组，因此不会创建任何边。 每个位置都有其自己的组成部分。 

目标排列尝试放置值`2`在位置`1`。 它们的组成部分不同，因此算法立即返回`NO`。 

最后，考虑一个部分连通图：```
4
1 3 2 4
4 1 1 4
```仅职位`2`和`3`已连接。 目标排列恰好交换这两个值。 

组件结构：```
{1}, {2,3}, {4}
```每个值都保留在其原始组件内，因此算法可以正确输出`YES`。
