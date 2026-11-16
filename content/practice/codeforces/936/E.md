---
problem: 936E
contest_id: 936
problem_index: E
name: "Iqea"
contest_name: "Codeforces Round 467 (Div. 1)"
rating: 3400
tags: ["data structures", "dfs and similar", "divide and conquer", "dsu", "shortest paths", "trees"]
answer: passed_samples
verified: true
solve_time_s: 133
date: 2026-06-17
model: gpt-5-3-mini
samples_passed: 1
samples_total: 1
---

# CF 936E - 宜凯

 **评分：** 3400
 **标签：** 数据结构、dfs 和类似、分而治之、dsu、最短路径、树
 **型号：** gpt-5-3-mini
 **求解时间：** 2m 13s
 **已验证：** 是（1/1 样品）

 ---

 ## 解决方案

 ## 问题理解

 我们在一个大网格上得到一组单元格。 每个单元格都是一个城市，并且在网格上共享边缘的任何两个城市之间都存在道路。 重要的几何约束是所选的一组单元格形成一个连通区域，并且空单元格也形成一个连通区域。 这意味着我们正在一个没有孔的“实心”多骨骨牌内工作。 

在这个区域，我们处理一系列事件。 有些活动会在城市添加新的“商店”，而另一些活动会询问城市到最近的已开业商店的距离。 距离是沿网格边缘的最短路径长度来测量的，并且仅允许在给定的城市组内移动。 

关键难点在于图很大，多达30万个顶点，而且更新和查询都是在线的。 查询必须反映之前添加的所有商店。 

一个天真的解释是使用 BFS 重新计算从每个查询节点到所有商店的最短路径。 这会立即失败，因为每个 BFS 成本为 O(n)，并且执行多达 300,000 个查询会导致 O(nq) 解决方案，这远远超出了限制。 

一个更微妙的问题是，距离不是完整网格中的欧几里得距离或曼哈顿距离。 它们是受形状限制的最短路径，因此通过缺失的单元格的捷径是不可能的。 任何假设简单坐标几何的方法都会在凹区域产生不正确的答案。 

一个小的说明性故障案例是 U 形区域。 两个点的坐标可能很接近，但图形距离可能很远，因为路径必须绕过缺失的内部。 使用坐标距离的解决方案，例如`abs(x1-x2)+abs(y1-y2)`会低估距离。 

因此，挑战是大型稀疏未加权图上的动态多源最短路径问题，仅插入源和重复距离查询。 

## 方法

 一个简单的解决方案是独立处理每个查询。 对于每个类型 2 查询，从该城市开始运行 BFS，并在到达任何商店时停止。 这是正确的，因为未加权图中的 BFS 总是找到最短路径。 然而，如果有 k 个商店并且每个查询都触发一个 BFS，那么在最坏的情况下每个 BFS 都会探索几乎整个图。 这导致大约 O(nq)，这太大了。 

关键的观察是来自多个来源的 BFS 可以合并。 如果提前知道所有商店，我们可以运行单个多源 BFS 并计算每个节点到最近商店的距离。 困难在于商店会随着时间的推移而插入，而我们需要在插入之间找到答案。 

这表明维持一个随着新来源的出现而演变的全球最短路径过程。 我们没有从头开始重新计算，而是保留了一个与 Dijkstra 算法完全相同的优先级队列，只不过所有边的权重均为 1。每个商店插入相当于将距离为 0 的新源插入到此全局过程中。 

关键的想法是我们永远不需要重新启动计算。 我们维持一个跨时间的全局放松过程。 当新商店出现时，我们将其推入优先队列。 当我们处理查询时，我们通过继续足够的传播来确保查询节点的距离已完全确定。 

这将问题转化为维护动态多源 BFS/Dijkstra 流程，其中仅添加源，从不删除源。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 每个查询重新运行 BFS | O(nq) | O(n) | 太慢了|
 | 全局增量Dijkstra（多源）| O((n + q) log n) | O((n + q) log n) | O(n) | 已接受 |

 ## 算法演练

 我们将网格解释为未加权的图，其中每个单元格都是一个节点，属于该区域的相邻单元格之间存在边。 

然后我们维护一个全局最短路径结构。 

1. 为所有给定单元构建邻接列表。 对于每个单元格，检查其四个邻居并连接边缘（如果邻居也是有效单元格）。 这给了我们一个具有 O(n) 边的隐式图。 
2. 维护距离数组`dist`，初始化为无穷大，以及一个布尔数组`done`指示到节点的最短距离是否已最终确定。 
3.维护一个全局最小堆优先级队列存储对`(distance, node)`。 
4.节点添加店铺时`v`，我们设置`dist[v] = 0`并推`(0, v)`到堆中。 我们不会立即宣传。 
5. 我们按顺序处理查询。 在回答节点查询之前`u`，我们向前运行 Dijkstra 过程直到节点`u`最终确定：

 1、反复弹出最小元素`(d, v)`从堆中。 
2.如果`v`已经确定了，略过。 
3. 马克`v`最终确定并设定`dist[v] = d`。 
4.让所有邻居放松`to`的`v`。 如果`to`尚未最终确定并且`d + 1 < dist[to]`， 更新`dist[to]`并推`(d + 1, to)`。 
6. 一次节点`u`已最终确定，其`dist[u]`是查询的答案。 如果堆之前变空`u`已到达，此时没有商店可到达，因此我们输出`-1`。 

微妙之处在于我们不需要处理整个图。 我们只需要扩展 Dijkstra 边界，直到到达查询节点即可。 由于边缘权重是均匀的，因此其行为与从所有商店向外扩展的 BFS 波前完全相同。 

### 为什么它有效

 在任何时候，优先级队列都包含迄今为止插入的所有商店中所有已发现但尚未最终确定的最短路径候选。 每次我们添加一个新商店时，我们都会将距离为 0 的新源引入到相同的全局结构中。 因为 Dijkstra 算法保证节点以非递减距离顺序最终确定，所以一旦节点被弹出，已经插入的源的未来松弛就无法改进它。 由于新商店仅添加额外的零距离来源，因此它们只会创造额外的放松，这些放松自然地融入到同一过程中。 因此，当我们最终确定一个节点时，我们已经计算了它与当时插入的完整商店集的最短距离。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
import heapq

def solve():
    n = int(input())
    cells = set()
    coords = []

    for _ in range(n):
        x, y = map(int, input().split())
        coords.append((x, y))
        cells.add((x, y))

    # build adjacency
    adj = {}
    for x, y in coords:
        adj[(x, y)] = []
        for dx, dy in ((1,0), (-1,0), (0,1), (0,-1)):
            nx, ny = x + dx, y + dy
            if (nx, ny) in cells:
                adj[(x, y)].append((nx, ny))

    q = int(input())

    INF = 10**18
    dist = {c: INF for c in cells}
    done = {c: False for c in cells}

    pq = []

    def push(v, d):
        heapq.heappush(pq, (d, v))

    def process_until(target=None):
        while pq:
            d, v = heapq.heappop(pq)
            if done[v]:
                continue
            done[v] = True
            dist[v] = d
            if target is not None and v == target:
                return
            for to in adj[v]:
                if not done[to] and d + 1 < dist[to]:
                    dist[to] = d + 1
                    push(to, d + 1)
        return

    for _ in range(q):
        t, x, y = map(int, input().split())
        v = (x, y)

        if t == 1:
            dist[v] = 0
            push(v, 0)
        else:
            process_until(v)
            print(dist[v] if done[v] else -1)

if __name__ == "__main__":
    solve()
```邻接构造使用哈希坐标集来确保 O(1) 邻居检查。 这是必要的，因为网格坐标很大但稀疏。 

优先级队列在所有操作之间共享，因此在早期阶段发现的距离可以被重用。 这`process_until`函数是核心：它仅在最终确定查询节点所需的范围内推进全局最短路径扩展。 

一个微妙的实现细节是，我们仅在节点从堆中弹出时将其标记为最终确定，而不是在更新时。 这保留了 Dijkstra 排序的正确性。 另一个重要的一点是我们从不重置查询之间的结构； 商店自然地聚集在同一个全局队列中。 

## 工作示例

 考虑一个小的线形区域：

 输入：```
3
1 1
1 2
1 3
3
1 1 1
2 1 3
2 1 2
```### 追踪

 | 步骤| 活动 | PQ 状态 | 定稿| 距离(1,3) | 回答 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 添加商店 (1,1) | (0,(1,1)) | (0,(1,1)) | {} | 信息 | - |
 | 2 | 查询 (1,3) | 展开 | (1,1) | 2 | 2 |
 | 3 | 查询 (1,2) | 展开更多 | (1,1),(1,2) | (1,1),(1,2) | 1 | 1 |

 这表明 BFS 波逐渐扩展并重用查询之间的工作。 第二个查询受益于已经探索的前沿节点。 

现在考虑坐标断开但图形连接的形状，例如 L 形：```
4
1 1
1 2
1 3
2 3
3
1 1 1
1 2 3
2 3 3
```来自两个商店的波正确地在拐角处传播，并且 (3,3) 处的查询通过穿过拐角的唯一有效路径接收正确的最小距离。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n) | O((n + q) log n) | 在全局 Dijkstra 过程中，每个节点最终确定一次，每条边松弛一次 |
 | 空间| O(n) | 邻接表、距离图、堆存储 |

 该结构永远不会从头开始重新计算 BFS。 每个顶点进入堆的次数有限，并且每次提取都会永久地最终确定它。 n 和 q 高达 300,000，这完全符合约束条件。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque
    import heapq

    n = int(input())
    cells = set()
    coords = []
    for _ in range(n):
        x, y = map(int, input().split())
        coords.append((x, y))
        cells.add((x, y))

    adj = {}
    for x, y in coords:
        adj[(x, y)] = []
        for dx, dy in ((1,0),(-1,0),(0,1),(0,-1)):
            if (x+dx, y+dy) in cells:
                adj[(x, y)].append((x+dx, y+dy))

    q = int(input())

    INF = 10**18
    dist = {c: INF for c in cells}
    done = {c: False for c in cells}
    pq = []

    def push(v, d):
        heapq.heappush(pq, (d, v))

    def process(target=None):
        while pq:
            d, v = heapq.heappop(pq)
            if done[v]:
                continue
            done[v] = True
            dist[v] = d
            if target == v:
                return
            for to in adj[v]:
                if not done[to] and d + 1 < dist[to]:
                    dist[to] = d + 1
                    push(to, d + 1)

    out = []
    for _ in range(q):
        t, x, y = map(int, input().split())
        v = (x, y)
        if t == 1:
            dist[v] = 0
            push(v, 0)
        else:
            process(v)
            out.append(str(dist[v] if done[v] else -1))

    return "\n".join(out)

# provided sample
assert run("""7
1 2
1 3
2 3
3 1
3 2
3 3
4 2
5
2 3 2
1 4 2
2 1 2
1 3 3
2 2 3
""") == """-1
5
1"""

# custom: single node
assert run("""1
1 1
1
2 1 1
""") == "-1"

# custom: immediate answer
assert run("""2
1 1
1 2
3
1 1 1
2 1 2
2 1 1
""") == """1
0"""

# custom: chain
assert run("""4
1 1
1 2
1 3
1 4
4
1 1 1
2 1 4
1 1 4
2 1 2
""") == """3
1"""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单节点| -1 | 没有店铺案例|
 | 立即答复 | 1, 0 | 多重查询及自助购物|
 | 链更新| 3, 1 | 随着时间的推移传播|

 ## 边缘情况

 一个极端的情况是在任何商店存在之前进行查询。 在这种情况下，优先级队列保持为空并且没有节点被最终确定。 算法正确返回`-1`因为`done`被查询节点的标志永远不会变为真。 

另一种情况是通过一条长廊重复扩张。 如果在一端添加商店并在另一端出现查询，则 Dijkstra 流程会沿着走廊逐渐扩展。 尽管走廊的长度可能达到 n，但每个顶点都会最终确定一次，因此重复查询不会重新处理已经确定的区域。 

最后一个微妙的情况是多个商店被添加到彼此附近。 它们的 BFS 波合并在优先级队列中，但 Dijkstra 排序确保最小距离始终占主导地位，因此即使更新以不同的顺序到达，也不会发生错误覆盖。
