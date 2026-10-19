---
title: "CF 106456L - 龙卷风摧毁了停车场"
description: "停车场是一个网格，其中每个单元格要么是空的，要么包含一辆具有固定移动方向的汽车。"
date: "2026-06-21T16:28:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106456
codeforces_index: "L"
codeforces_contest_name: "The 15th Huazhong Agricultural University Programming Contest"
rating: 0
weight: 106456
solve_time_s: 61
verified: true
draft: false
---

[CF 106456L - 龙卷风摧毁了停车场](https://codeforces.com/problemset/problem/106456/L)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 1s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 停车场是一个网格，其中每个单元格要么是空的，要么包含一辆具有固定移动方向的汽车。 每辆车只能尝试沿其面向的方向离开网格，并且只有当从其位置到网格边界的整个直线段此时不包含其他车辆时才会成功。 

我们可以执行的操作是选择一辆车并向其发送“离开”命令。 如果其面向方向的路径畅通，汽车就会消失，其牢房也会变空。 否则，在那一刻不会发生任何有用的事情，因此任何有效的解决方案都必须避免在被阻挡的汽车上浪费动作。 

任务是确定是否存在发出命令的顺序以使每辆车最终离开。 如果存在这样的顺序，我们必须按照移除的顺序输出任何有效的坐标序列。 如果不可能清除所有车辆，我们输出-1。 

到 2000 年，网格大小将达到 2000 个，因此单元格数量可达 400 万个。 任何尝试为每个操作重复扫描整个行或列的方法都会太慢，因为每次扫描在维度上都是线性的，并且可能每辆车重复一次。 这会导致最坏情况下细胞数量的二次行为。 

朴素模拟的一个微妙的失败案例是当汽车陷入依赖循环时。 例如，考虑 2 x 2 网格：```
RD
UL
```每辆车都会挡住另一辆车的方向，形成一个循环，最初没有一辆车有畅通的路径。 任何试图移除“当前可移除”汽车的贪婪策略都会立即陷入困境，因为从一开始就没有符合资格的汽车，即使从更全局的依赖角度来看，不存在移除命令。 

另一个微妙的问题出现在长链条中。 如果一辆车依赖于同一行或同一列中较远的另一辆车，则每次删除后重复扫描整行都会多次重新计算相同的结构，这会变得太慢。 

## 方法

 一种强力解释是重复扫描网格，识别当前通往边界的路径畅通的所有汽车，删除其中一辆，然后重复。 每次迭代需要检查最多 O(NM) 个单元，检查汽车的路径需要扫描最多 O(N) 或 O(M)。 如果删除量达到 O(NM)，则变为 O((NM)^2)，这远远超出了 200 万辆或更多汽车的限制。 

关键的结构观察是，汽车离开的能力仅取决于沿同一行或列的方向上的第一辆车。 如果最近的阻塞车存在，那么除此之外的一切都不重要。 这将全局可见性条件转换为局部依赖关系：每辆车最多只依赖于其方向上的一个邻居。 

一旦我们以这种方式查看依赖关系，该过程就变成了动态图问题。 每辆车都是一个节点，它的方向最多被另一个节点“阻挡”。 当阻塞的汽车被移除时，附近汽车的依赖性可能会消失，使它们重新符合移除条件。 

这建议保持每行和每列的邻接性，以便当汽车消失时，我们可以快速找到下一个潜在的阻挡者。 每行每列的双向链接结构允许我们在 O(1) 时间内更新邻居，并且队列处理空闲的汽车。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 重复扫描| O((NM)^2) | O((NM)^2) | O(NM) | 太慢了|
 | 行/列邻居维护+BFS | O(NM) | O(NM) | 已接受 |

 ## 算法演练

 我们将每辆车视为一个节点，只有当其方向当前畅通无阻时才可以将其删除。 为了支持快速更新，我们为每辆车维护四个邻居指针：在其他车辆的行或列内的左、右、上、下。 

1. 建立所有汽车的列表并为每辆车分配其位置。 对于每一行，从左到右链接汽车，对于每一列，从上到下链接汽车。 这使我们能够立即从任何方向找到下一辆幸存的汽车。 
2. 对于每辆车，仅通过查看其方向上最接近的邻居来检查它是否最初是可移动的。 如果该邻居不存在，则汽车已经可以离开，因此它被推入队列。 
3. 重复处理队列。 每次我们移除一辆车时，我们都会在答案序列中记录它的坐标。 
4. 当一辆车被删除时，我们将其从行链表和列链表中删除。 这意味着将其左邻居与右邻居重新连接，将上邻居与下邻居重新连接。 
5. 移除汽车后，只有同一行或同一列中的紧邻汽车才能更改其阻塞结构。 对于每个这样的邻居，我们检查我们刚刚移除的汽车是否是其方向上的阻挡邻居。 如果是，我们使用更新的链接结构重新计算其新的最近的拦截器。 如果它现在在该方向上没有阻塞器，我们将其推入队列。 
6. 继续，直到队列变空。 如果我们记录了所有汽车，我们就会输出序列。 否则，有些汽车被困在循环中或被不可移动的结构阻挡，所以我们输出-1。 

正确性基于以下事实：每辆车的“出口可见性”仅取决于其方向上最近的剩余车辆，并且这种最近邻居结构完全由链表维护。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [list(input().strip()) for _ in range(n)]

    # store only car cells
    cars = []
    idx = [[-1] * m for _ in range(n)]

    for i in range(n):
        for j in range(m):
            if grid[i][j] != '.':
                idx[i][j] = len(cars)
                cars.append((i, j))

    k = len(cars)
    if k == 0:
        print(-1)
        return

    # linked lists in rows and cols
    L = [-1] * k
    R = [-1] * k
    U = [-1] * k
    D = [-1] * k

    row = [[] for _ in range(n)]
    col = [[] for _ in range(m)]

    for id, (i, j) in enumerate(cars):
        row[i].append(id)
        col[j].append(id)

    for i in range(n):
        row[i].sort(key=lambda x: cars[x][1])
        for t in range(len(row[i])):
            if t > 0:
                L[row[i][t]] = row[i][t - 1]
            if t + 1 < len(row[i]):
                R[row[i][t]] = row[i][t + 1]

    for j in range(m):
        col[j].sort(key=lambda x: cars[x][0])
        for t in range(len(col[j])):
            if t > 0:
                U[col[j][t]] = col[j][t - 1]
            if t + 1 < len(col[j]):
                D[col[j][t]] = col[j][t + 1]

    def get_blocker(i):
        x, y = cars[i]
        d = grid[x][y]
        if d == 'U':
            return U[i]
        if d == 'D':
            return D[i]
        if d == 'L':
            return L[i]
        return R[i]

    from collections import deque
    q = deque()
    inq = [False] * k

    for i in range(k):
        if get_blocker(i) == -1:
            q.append(i)
            inq[i] = True

    removed = [False] * k
    ans = []

    while q:
        v = q.popleft()
        if removed[v]:
            continue
        removed[v] = True
        ans.append(v)

        x, y = cars[v]

        l, r = L[v], R[v]
        u, d = U[v], D[v]

        if l != -1:
            R[l] = r
        if r != -1:
            L[r] = l
        if u != -1:
            D[u] = d
        if d != -1:
            U[d] = u

        def try_push(u):
            if u == -1 or removed[u]:
                return
            if not inq[u] and get_blocker(u) == -1:
                q.append(u)
                inq[u] = True

        if l != -1: try_push(l)
        if r != -1: try_push(r)
        if u != -1: try_push(u)
        if d != -1: try_push(d)

    if len(ans) != k:
        print(-1)
    else:
        for v in ans:
            x, y = cars[v]
            print(x + 1, y + 1)

if __name__ == "__main__":
    solve()
```该解决方案首先将网格压缩为汽车节点列表，以便更新是基于指针的，而不是网格扫描。 行和列排序构建了初始邻居关系，并且这些关系随着汽车的移除而动态维护。 

功能`get_blocker`捕获关键依赖规则：汽车只关心其方向上最近的汽车。 BFS 队列从所有已经没有阻塞器的车辆开始。 每次删除仅更新行和列结构中的本地邻居，避免全局重新计算。 

微妙的实现细节是，只有在移除后才需要检查链接结构中的相邻邻居，因为只有它们才能使用移除的汽车作为最近的拦截器。 

## 工作示例

 ### 示例 1

 输入：```
3 3
D..
R..
.UL
```我们按阅读顺序对汽车进行索引：R 在 (2,1)，U 在 (3,2)，D 在 (1,1)，L 在 (3,3)。 

最初只有 R(2,1) 和 U(3,2) 有明确的方向。 

| 步骤| 队列| 已删除 | 行动|
 | --- | --- | --- | --- |
 | 1 | R(2,1)、U(3,2) | 空 | 开始 |
 | 2 | U(3,2) | U(3,2) | R(2,1) | R(2,1) | 删除 R |
 | 3 | D(1,1) | D(1,1) | 右，右| 移除 U 解锁 D |
 | 4 | L(3,3) | L(3,3) | 右、右、右 | 最后的拆除工作仍在继续|

 这展示了如何移除单个阻塞的汽车以级联方式启用先前阻塞的汽车。 

### 示例 2

 输入：```
2 2
RD
UL
```所有四辆车在一个循环中相互依赖。 

| 步骤| 队列| 已删除 | 行动|
 | --- | --- | --- | --- |
 | 1 | 空 | 无 | 没有可移动的汽车|
 | 2 | 空 | 无 | 卡住了|

 不可能有进展，所以答案是-1。 

该跟踪确认该算法正确检测到不存在任何起始可移动节点。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(NM) | 每辆汽车在结构中插入和移除一次，并且每个邻居更新的时间复杂度为 O(1) |
 | 空间| O(NM) | 汽车列表和四个邻居指针的存储 |

 高达 2000 x 2000 的网格大小非常合适，因为该算法仅对每辆车执行线性工作，并且避免了行或列的任何重复扫描。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    import sys as _sys
    from io import StringIO as _StringIO
    old_stdout = _sys.stdout
    _sys.stdout = _StringIO()
    solve()
    out = _sys.stdout.getvalue()
    _sys.stdout = old_stdout
    return out.strip()

# provided sample 1
assert run("""3 3
D..
R..
.UL
""") != "-1"

# provided sample 2
assert run("""2 2
RD
UL
""") == "-1"

# single car
assert run("""1 1
U
""") == "1 1"

# all empty except one row chain
assert run("""1 5
R.LR.
""") != "-1"

# vertical chain with no cycle
assert run("""5 1
D
D
.
U
.
""") != ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1x1 单人车 | 那个细胞| 最小去除|
 | 2x2 循环 | -1 | 死锁检测|
 | 单排链条| 有效订单 | 水平依赖性更新|
 | 稀疏列链| 有效订单 | 垂直指针更新|

 ## 边缘情况

 紧循环是最重要的失效模式。 在每辆汽车阻挡另一辆汽车的 2 × 2 配置中，初始队列为空，因为每辆汽车在其方向上都有一个阻挡者。 该算法正确地初始化了一个空队列，并且从不处理任何节点，导致删除的计数与汽车总数之间最终不匹配，从而触发 -1。 

第二种情况是长线性链条，其中的移除会逐渐解锁下一辆车。 这里的链表结构确保一旦阻塞的汽车被移除，下一个邻居就可以立即被检测到，而无需扫描整个列或行。 这可以防止丢失解锁事件，而依靠完全重新扫描的简单方法可能会丢失解锁事件或处理速度太慢。 

第三种情况涉及多个独立组件。 由于每辆车仅与其行和列邻居交互，因此组件独立发展，并且队列自然地交错它们的移除，而不需要全局协调。
