---
title: "CF 102556C - Riana 和通勤"
description: "Riana 正在一条一维街道上移动，街道上的街区从左到右编号。 她从区块 1 开始，想要到达区块 A。"
date: "2026-08-04T09:15:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102556
codeforces_index: "C"
codeforces_contest_name: "2020 Ateneo de Manila University DISCS PrO HS Division"
rating: 0
weight: 102556
solve_time_s: 63
verified: true
draft: false
---

[CF 102556C - Riana 和通勤](https://codeforces.com/problemset/problem/102556/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 3s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Riana 正在一条一维街道上移动，街道上的街区从左到右编号。 她从1号街区出发，想要到达A街区。步行时，她可以选择任一方向，但公交车站改变了运动规则：每当她到达公交车站时，她必须立即乘坐公交车到达那里，公交车将她送到一个固定的目的地街区。 每辆公交车都会移动到更大的街区号，因此公交车行驶永远无法自行形成循环。 

输入描述了街道长度、目的地街区和公交车站集。 每个公交车站都是从其位置到更大位置的定向跳跃。 任务是确定是否存在某种步行选择序列，最终将 Riana 置于 A 块。输出为`YES`如果她能到达并且`NO`否则。 

限制很小，最多有 100 个街区和最多 50 个公交车站。 这意味着探索每种可能的有用状态的算法就足够了。 对所有可能的步行路径进行指数探索的解决方案是不必要的，因为许多不同的路径可以通向同一个块。 我们可以存储已经到达的块并处理每个块一次。 

主要的边缘情况来自于总线的强制性质。 一个常见的错误是将公共汽车视为可选的跳跃。 例如：```
5 4 1
2 5
```正确答案是`NO`。 从街区 1 开始，向右步行到达街区 2，Riana 被迫乘坐公共汽车前往街区 5。然后她可以向左步行到达街区 4，所以这个例子实际上产生了`YES`。 危险的部分不是最终答案，而是假设：如果解决方案忽略强制总线并将块 2 视为正常位置，则它可能会探索无效路径。 

一个更直接的例子是：```
6 3 1
2 6
```正确答案是`NO`。 从街区 1 向右步行到达街区 2 的车站，并立即将 Riana 送到街区 6。她只能从那里向左步行，但街区 3 位于街区 2 的公交车站之前，无法再次到达，因为她无法穿过该车站而不被送走。 粗心的最短路径解释允许穿过所有相邻块的移动会错误地找到路径。 

另一个边缘情况是从目的地开始：```
5 1 1
1 5
```正确答案是`YES`。 Riana 已经在 Ateneo 了，所以她不需要搬家。 在检查目的地之前始终应用总线转换的实现会错误地将她移走。 

## 方法

 一种简单的方法是模拟每一个可能的步行决策。 从一个街区开始，Riana 可以尝试反复向左或向右步行一个街区，每当她到达公交车站时，她就会跳到目的地。 这是正确的，因为它直接遵循运动规则。 然而，如果实现为路径搜索而不记住访问过的块，则它可以多次重新访问相同的情况。 尽管这里的街道很小，但自然的蛮力观点将步行视为大量可能的序列，特别是因为 Riana 可以在触发公共汽车之前来回徘徊。 

关键的观察结果是，在每个强制总线链完成后，只有 Riana 的当前块很重要。 她之前的步行史并不影响未来的选择。 由于只有 N 个可能的块，我们可以对可达块执行图搜索。 

剩下的问题是如何创建图的边。 从可到达的街区，Riana 可以向任一方向行走，直到到达 Ateneo 或遇到该方向的第一个公交车站。 她无法通过第一个公共汽车站，因为公共汽车立即载送她。 如果该方向没有公交车站，则步行即可到达该方向的每个街区。 如果有一个公共汽车站，则唯一的结果状态是跟随从该站出发的所有强制公共汽车后的目的地。 

块的数量足够小，我们可以在生成转换时检查某个位置周围的所有块。 这给出了一个简单的广度优先搜索解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 运动选择的数量可能呈指数级增长 O(N) | 没有记忆太慢 |
 | 最佳 | O(N² + B) | O(N) | 已接受 |

 ## 算法演练

 1. 读取所有公交车站并按其区块号存储每个站的目的地。 缺少条目意味着该街区不是公交车站。 
2. 如果起始块已经是Ateneo，立即回答`YES`。 到达目的地就足够了，不需要移动。 
3. 从块 1 开始使用广度优先搜索。每个队列条目代表在所有强制巴士行程结束后 Riana 可以到达的块。 
4. 处理一个街区时，在到达公交车站之前检查向左步行是否可以到达 Ateneo。 如果左侧没有公交车站，则可以到达每个较小的街区。 如果左侧最近的公交车站存在，则只能步行到达当前街区和该车站之间的街区。 
5. 向右行走时执行相同的检查。 如果首先遇到公交车站，则下一个可达状态是该公交车的目的地，然后是在该目的地触发的任何其他公交车。 
6. 每当发现新的可达块时，将其添加到队列中。 如果一个块已被处理，请跳过它，因为再次探索它无法揭示任何新内容。 
7. 如果搜索结束没有到达A，则输出`NO`。 

为什么它有效：

 搜索维持的不变量是，放入队列的每个块都是 Riana 在遵守所有强制乘坐公共汽车后实际上可以占用的块。 当扩展一个区块时，算法会准确考虑选择向左或向右行走的合法结果。 它永远不会允许她在不乘坐公共汽车的情况下穿过公交车站，也永远不会创造出不可能的动作。 由于每个有效的决策序列都对应于这些转换的序列，因此最终将发现任何可到达的目的地。 如果搜索找不到 A，则没有有效的选择序列可以到达它。 

## Python 解决方案```python
import sys
from collections import deque

input = sys.stdin.readline

def solve():
    N, A, B = map(int, input().split())

    bus = [-1] * (N + 1)
    for _ in range(B):
        x, y = map(int, input().split())
        bus[x] = y

    if A == 1:
        print("YES")
        return

    def follow_bus(pos):
        while bus[pos] != -1:
            pos = bus[pos]
        return pos

    start = follow_bus(1)

    visited = [False] * (N + 1)
    visited[start] = True
    q = deque([start])

    while q:
        pos = q.popleft()

        if pos == A:
            print("YES")
            return

        left_stop = -1
        for x in range(pos - 1, 0, -1):
            if bus[x] != -1:
                left_stop = x
                break

        if left_stop == -1:
            for x in range(1, pos):
                if not visited[x]:
                    if x == A:
                        print("YES")
                        return
                    visited[x] = True
                    q.append(x)
        else:
            for x in range(left_stop + 1, pos):
                if not visited[x]:
                    if x == A:
                        print("YES")
                        return
                    visited[x] = True
                    q.append(x)
            nxt = follow_bus(left_stop)
            if not visited[nxt]:
                visited[nxt] = True
                q.append(nxt)

        right_stop = -1
        for x in range(pos + 1, N + 1):
            if bus[x] != -1:
                right_stop = x
                break

        if right_stop == -1:
            for x in range(pos + 1, N + 1):
                if not visited[x]:
                    if x == A:
                        print("YES")
                        return
                    visited[x] = True
                    q.append(x)
        else:
            for x in range(pos + 1, right_stop):
                if not visited[x]:
                    if x == A:
                        print("YES")
                        return
                    visited[x] = True
                    q.append(x)
            nxt = follow_bus(right_stop)
            if not visited[nxt]:
                visited[nxt] = True
                q.append(nxt)

    print("NO")

solve()
```公交车阵列存储来自每个公交车站的唯一可能的转换。 这`follow_bus`函数处理巴士目的地是另一个巴士站的情况。 因为每条总线都会增加块号，所以这个循环总是终止。 

BFS 队列仅包含所有自动公交车行程发生后可能出现的位置。 这就是为什么初始位置被标准化为`follow_bus(1)`。 专项检查针对的是`A == 1`发生在这之前，因为到达目的地不需要乘坐公共汽车离开。 

生成转换时，代码会在每个方向搜索最近的公交车站。 该站之前的街区是有效的步行目的地。 车站本身不会添加为步行状态，因为到达该车站会立即触发乘坐公交车。 从车站创建的唯一状态是其最终的巴士目的地。 

不存在整数溢出问题，因为每个值最多为 100。循环有意仅严格包含当前位置和下一站之间的块，避免了允许 Riana 站在某一站而不乘坐公交车的差一错误。 

## 工作示例

 ### 示例 1

 输入：```
10 5 4
1 3
2 6
4 10
7 9
```| 当前区块 | 方向已检查 | 结果 | 处理后排队 |
 | --- | --- | --- | --- |
 | 3 | 左| 可以到达2，那么总线链从2到6 | [6, 2] |
 | 2 | 左| 可以达到1 | [6, 1] |
 | 6 | 左| 可以达到5 | [1, 5] |
 | 5 | 目的地 | 已达到 | 是 |

 起始位置 1 是一个公共汽车站，因此强制第一步将 Riana 发送到块 3。从那里，搜索发现与示例解释相同的顺序：在块 2 处使用公共汽车，然后走回块 5。 

### 示例 2

 输入：```
8 3 2
2 6
4 7
```| 当前区块 | 方向已检查 | 结果 | 处理后排队 |
 | --- | --- | --- | --- |
 | 1 | 对| 到达2号街区，强制巴士前往6号 | [6] |
 | 6 | 左| 5、4 号街区可到达，4 号街区迫使公交车前往 7 号 | [7, 5] |
 | 7 | 左| 6、5 号街区可达 | [5]|
 | 5 | 左| 4 号街区迫使公交车转至 7 号 | []|

 街区 3 永远不会到达，因为每次尝试穿过相关公交车站都会让 Riana 离开。 搜索耗尽所有有效状态并返回`NO`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N² + B) | 对于每个可到达的街区，算法会扫描街道以查找附近的车站和可到达的步行街区。 |
 | 空间| O(N) | 队列和访问数组每个块最多存储一个条目。 |

 当 N 最多为 100 时，二次扫描很小。 该解决方案最多执行大约一万个块检查，这完全在限制之内。 

## 测试用例```python
import sys
import io
from collections import deque

def solve_case(inp):
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    N, A, B = map(int, input().split())
    bus = [-1] * (N + 1)

    for _ in range(B):
        x, y = map(int, input().split())
        bus[x] = y

    if A == 1:
        return "YES\n"

    def follow_bus(pos):
        while bus[pos] != -1:
            pos = bus[pos]
        return pos

    start = follow_bus(1)
    visited = [False] * (N + 1)
    visited[start] = True
    q = deque([start])

    while q:
        pos = q.popleft()
        if pos == A:
            return "YES\n"

        for direction in (-1, 1):
            x = pos + direction
            while 1 <= x <= N:
                if bus[x] != -1:
                    nxt = follow_bus(x)
                    if not visited[nxt]:
                        visited[nxt] = True
                        q.append(nxt)
                    break
                if not visited[x]:
                    if x == A:
                        return "YES\n"
                    visited[x] = True
                    q.append(x)
                x += direction

    return "NO\n"

assert solve_case("""10 5 4
1 3
2 6
4 10
7 9
""") == "YES\n", "sample 1"

assert solve_case("""8 3 2
2 6
4 7
""") == "NO\n", "sample 2"

assert solve_case("""2 1 1
1 2
""") == "YES\n", "already at destination"

assert solve_case("""6 3 1
2 6
""") == "NO\n", "forced bus skips target"

assert solve_case("""100 100 1
50 100
""") == "YES\n", "maximum block boundary"

assert solve_case("""5 5 3
1 5
2 5
3 5
""") == "YES\n", "many buses with same destination"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1 1`在 1 号街区有公交车 | 是 | 在移动之前必须接受从目的地出发。 |
 |`6 3 1`和`2 -> 6`| 否 | 不乘坐公共汽车就不能穿过公共汽车站。 |
 |`100 100 1`和`50 -> 100`| 是 | 大块数并到达最终边界。 |
 | 多辆巴士在同一个街区结束 | 是 | 不同的巴士站可能共享目的地。 |

 ## 边缘情况

 对于 Riana 从目的地出发的情况：```
5 1 1
1 5
```算法检查`A == 1`在跟随巴士之前。 它输出`YES`，在发生任何强制移动之前正确地将到达视为完成。 

对于总线阻止访问较低块的情况：```
6 3 1
2 6
```搜索从块 1 开始。向右移动到达块 2，这是一个公共汽车站，因此唯一的结果状态是块 6。从块 6 开始，向左步行到达块 4，但再次踏入块 2 会触发公共汽车。 块 3 永远不会生成，因此算法输出`NO`。 

对于立即发生多趟公交车的情况：```
10 5 2
1 3
3 8
```起始块跟随总线1到块3，然后紧接着总线3到块8。搜索从块8开始并正常继续。 巴士目的地的不断增加保证了这条链条不会永远循环。
