---
title: "CF 106380A - 海鸥的冒险"
description: "我们在网格上有两组单元格。 有些细胞含有海鸥，同样数量的细胞含有食物。 命令选择剩余的海鸥和方向。 海鸥会一直移动，直到它到达该方向上第一个不包含其他剩余海鸥的单元格。"
date: "2026-06-25T10:21:04+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106380
codeforces_index: "A"
codeforces_contest_name: "The 6th Liaoning Provincial Collegiate Programming Contest"
rating: 0
weight: 106380
solve_time_s: 51
verified: true
draft: false
---

[CF 106380A - 海鸥历险记](https://codeforces.com/problemset/problem/106380/A)

 **评级：** -
 **标签：** -
 **求解时间：** 51s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在网格上有两组单元格。 有些细胞含有海鸥，同样数量的细胞含有食物。 命令选择剩余的海鸥和方向。 海鸥会一直移动，直到它到达该方向上第一个不包含其他剩余海鸥的单元格。 仅当目标单元格包含食物时，该命令才会成功，因为这样海鸥和食物就会消失。 

任务是为每只海鸥准确输出一个命令，以便每只海鸥都吃掉一块食物，或者决定不能完成。 

关键细节是食物不会阻碍运动。 只有海鸥会影响另一只海鸥的飞行距离。 这意味着只有当海鸥直接靠近食物细胞时才能发出成功的命令。 如果它们之间还有另一只海鸥，则所选海鸥在到达食物之前停下来。 如果它们之间有一个空单元格，则所选海鸥停止得太早。 

输入大小是为图形解决方案设计的。 所有测试用例中海鸥的总数最多为 5000 只，因此接近线性或$O(n \sqrt n)$整个输入都很舒服。 尝试所有可能的命令序列的解决方案是不可能的，因为有$n!$可能的订单。 甚至反复搜寻每一对海鸥和食物细胞都会接近$O(n^2)$，这在这里是可能的，但真正的挑战是选择一组全局有效的动作。 

如果本地有效的移动破坏了另一只海鸥唯一可能的匹配，则粗心的实现可能会失败。 例如：```
1
2
1 1
1 3
1 2
2 3
```正确的输出是：```
No
```第一只海鸥在`(1,1)`就在食物旁边`(1,2)`，所以它可以吃它。 第二只海鸥在`(1,3)`不能吃剩余的食物`(2,3)`因为它在水平或垂直方向上都不相邻。 总是获取第一个可用食物的贪婪方法可能会陷入困境。 

另一个边缘情况是所有可能的对都有效，但顺序看起来很危险：```
1
3
2 2
2 4
4 2
2 3
2 5
3 2
```正确的输出是：```
Yes
```有几种可能的选择。 一旦海鸥进食，它就会消失，因此它无法产生新的阻滞剂。 该解决方案必须侧重于选择一组完整的对，而不是模拟复杂的订单。 

## 方法

 一个直接的暴力想法是反复寻找当前可以吃一些食物的海鸥，将其取出，然后继续。 This correctly simulates the process, and if we try every possible choice it can find a solution. 问题在于选择的数量。 在糟糕的情况下，每个阶段都可能有许多可能的移动，导致探索序列数量的阶乘增长。 

有用的观察结果是，每个成功的命令都会删除相邻的海鸥和食物。 由于移除的海鸥永远不会返回，因此任何选定的有效对都保持有效，直到其端点之一被移除。 This changes the problem from an ordering problem into a pairing problem.

 我们可以创建一个二分图。 左侧包含海鸥，右侧包含食物细胞。 We add an edge when a seagull and a food cell are adjacent in the grid. 该图中的完美匹配为每只海鸥提供了独特的食物。 然后命令可以简单地一一执行匹配的对。 顺序并不重要，因为删除其他海鸥只会消除障碍。 

该图是稀疏的，因为每个单元最多有四个相邻单元，因此边的数量最多是海鸥数量的四倍。 最大二分匹配算法就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 指数| O(n) | 太慢了|
 | 二分匹配| O(E√V) | O(E) | 已接受 |

 ## 算法演练

 1. 储存每只海鸥和每一个食物细胞。 给每只海鸥一个从 0 到 n-1 的索引。 
2. 构建一个二部图，其中海鸥与其正上方、下方、左侧或右侧的每个食物细胞相连。 这些正是能够成功的举措。 
3. Run Hopcroft-Karp to find the largest matching between seagulls and food cells. 该算法反复找到几条最短增广路径并翻转它们，这比一次搜索一条路径要快得多。 
4. 如果匹配大小小于n，则某些海鸥无法分配唯一的食物，因此打印`No`。 
5. 否则，对于每一个匹配对，输出从海鸥位置到食物位置的方向。 这些命令中的每一个都是有效的，因为两个单元格是相邻的。 

为什么它有效：

 只有当所选的海鸥和吃的食物占据相邻的单元格时，命令才能成功。 匹配正好包含这样的对，并且每个海鸥和食物都出现一次。 执行匹配对会删除两个端点。 移除其他海鸥并不会使未来的匹配移动无效，因为更少的海鸥意味着更少的阻挡单元。 因此，完美的匹配是完整的有效命令序列。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve_case(n, gulls, foods):
    food_id = {pos: i for i, pos in enumerate(foods)}

    graph = [[] for _ in range(n)]
    for i, (r, c) in enumerate(gulls):
        for dr, dc in ((-1, 0), (1, 0), (0, -1), (0, 1)):
            nxt = (r + dr, c + dc)
            if nxt in food_id:
                graph[i].append(food_id[nxt])

    match_left = [-1] * n
    match_right = [-1] * n
    dist = [0] * n

    def bfs():
        q = deque()
        found = False
        for i in range(n):
            if match_left[i] == -1:
                dist[i] = 0
                q.append(i)
            else:
                dist[i] = -1

        while q:
            u = q.popleft()
            for v in graph[u]:
                nxt = match_right[v]
                if nxt == -1:
                    found = True
                elif dist[nxt] == -1:
                    dist[nxt] = dist[u] + 1
                    q.append(nxt)
        return found

    def dfs(u):
        for v in graph[u]:
            nxt = match_right[v]
            if nxt == -1 or (dist[nxt] == dist[u] + 1 and dfs(nxt)):
                match_left[u] = v
                match_right[v] = u
                return True
        dist[u] = -1
        return False

    matching = 0
    while bfs():
        for i in range(n):
            if match_left[i] == -1 and dfs(i):
                matching += 1

    if matching != n:
        return None

    ans = []
    for i, food in enumerate(match_left):
        r1, c1 = gulls[i]
        r2, c2 = foods[food]
        if r2 == r1 - 1:
            ans.append((i + 1, "U"))
        elif r2 == r1 + 1:
            ans.append((i + 1, "D"))
        elif c2 == c1 - 1:
            ans.append((i + 1, "L"))
        else:
            ans.append((i + 1, "R"))
    return ans

def main():
    t = int(input())
    out = []

    for _ in range(t):
        n = int(input())
        gulls = [tuple(map(int, input().split())) for _ in range(n)]
        foods = [tuple(map(int, input().split())) for _ in range(n)]

        res = solve_case(n, gulls, foods)
        if res is None:
            out.append("No")
        else:
            out.append("Yes")
            for x, d in res:
                out.append(f"{x} {d}")

    print("\n".join(out))

if __name__ == "__main__":
    main()
```图构建仅检查四个相邻单元格，因为永远无法成功到达非相邻食物。 存储食物位置的字典让每个邻接检查在恒定的时间内运行。 

匹配数组存储每只海鸥当前的伙伴和食物。 值为`-1`表示该顶点当前不匹配。 霍普克罗夫特-卡普使用`dist`将增强路径组织成层，从而避免重复探索相同的不成功路径。 

在生成答案时，将匹配的食物与海鸥坐标进行比较。 方向由不同的一个坐标确定。 无需模拟移动，因为匹配属性已经证明每个命令都成功。 

## 工作示例

 考虑这个输入：```
1
2
1 1
1 3
1 2
2 3
```图的构造创建了这些可能的边：

 | 步骤| 海鸥| 邻近食物| 匹配|
 | --- | --- | --- | --- |
 | 1 | (1,1) | 食物在 (1,2) | 无 |
 | 2 | (1,3) | 无 | 不可能|

 最大匹配大小为 1，但我们需要 2 个匹配对。 算法打印`No`。 

再举个例子：```
1
3
2 2
2 4
4 2
2 3
2 5
3 2
```匹配可以构建如下：

 | 步骤| 海鸥| 精选食物| 方向 |
 | --- | --- | --- | --- |
 | 1 | 1 在 (2,2) | (2,3) | 右 |
 | 2 | 2 在 (2,4) | (2,5) | 右 |
 | 3 | 3 在 (4,2) | (3,2) | 你|

 每只海鸥都会收到一种独特的相邻食物。 删除一对不会影响其余对，因此输出序列有效。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(E√V) | 最多 4n 条边的图上的 Hopcroft-Karp |
 | 空间| O(E + V) | 存储邻接表和匹配数组 |

 由于所有测试用例中海鸥的总数仅为 5000 只，因此稀疏匹配图足够小，足以让 Hopcroft-Karp 轻松完成。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    data = sys.stdin.read().strip().split()
    sys.stdin = old

    it = iter(data)
    t = int(next(it))
    ans = []

    for _ in range(t):
        n = int(next(it))
        gulls = [(int(next(it)), int(next(it))) for _ in range(n)]
        foods = [(int(next(it)), int(next(it))) for _ in range(n)]
        res = solve_case(n, gulls, foods)
        if res is None:
            ans.append("No")
        else:
            ans.append("Yes")
            for a, b in res:
                ans.append(f"{a} {b}")
    return "\n".join(ans)

assert run("""1
1
1 1
1 2
""").split()[0] == "Yes"

assert run("""1
2
1 1
1 3
1 2
2 3
""").split()[0] == "No"

assert run("""1
3
2 2
2 4
4 2
2 3
2 5
3 2
""").split()[0] == "Yes"

assert run("""1
4
1 1
1 3
3 1
3 3
1 2
2 3
3 2
2 1
""").split()[0] == "Yes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个相邻对 | 是的 | 最小尺寸外壳 |
 | 两只没有完美匹配的海鸥| 没有 | 检测不完全匹配 |
 | 三个独立的相邻对| 是的 | 正常配套施工|
 | 四个角单元| 是的 | 测试多个方向和边界 |

 ## 边缘情况

 第一个边缘情况是不完全匹配。 在有两只海鸥的例子中`(1,1)`和`(1,3)`，只有第一只海鸥有邻近的食物。 该算法仅创建一条图边，因此 Hopcroft-Karp 无法匹配两个海鸥并返回`No`。 

第二种边缘情况是贪婪订单可能选择错误的对。 该算法从不提前采取行动。 它首先找到所有海鸥对食物的完整分配。 一旦匹配存在，无论执行顺序如何，每个命令都保证有效。 

最小的箱子里有一只海鸥和旁边的一种食物。 该图包含一条边，匹配尺寸为一，产生的方向直接到达食物。 这也证实了方向生成正确地处理了尽可能小的输入。
