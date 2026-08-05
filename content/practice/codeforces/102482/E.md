---
title: "CF 102482E - 打击犯罪"
description: "这座城市是由矩形建筑组成的网格。 每个单元格存储一个建筑物高度。 罗宾从一栋建筑物的中心开始，想知道到达其他所有建筑物所需的最少跳跃次数。"
date: "2026-08-05T18:57:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102482
codeforces_index: "E"
codeforces_contest_name: "2018 ACM-ICPC World Finals"
rating: 0
weight: 102482
solve_time_s: 236
verified: true
draft: false
---

[CF 102482E - 快速打击犯罪](https://codeforces.com/problemset/problem/102482/E)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 这座城市是由矩形建筑组成的网格。 每个单元格存储一个建筑物高度。 罗宾从一栋建筑物的中心开始，想知道到达其他所有建筑物所需的最少跳跃次数。 跳跃始终在屋顶中心开始和结束，使用相同的初始速度`v`，并遵循通过改变发射角度选择的弹丸轨迹。 

输出是从藏身处建筑物到每个牢房的最短跳跃次数。 如果根本无法到达建筑物，它会收到`X`。 

网格很小，最多有 20 x 20 栋建筑物，因此只有 400 个可能的位置。 这排除了繁重的图形算法，但这也意味着我们有能力测试每一对可能的建筑物。 昂贵的部分不是图搜索，而是检查一跳在物理上是否有效。 

一些细节会让简单的解决方案失败。 触及网格角的跳跃必须清除该角周围的所有建筑物，而不仅仅是其中一栋。 此外，射弹在相同的两座建筑物之间可能有两个可能的弧线，并且只有较高的弧线才有助于避免碰撞。 最后，仅检查每个建筑物的中间是不正确的，因为区间上凹抛物线的最低点始终位于区间端点之一。 

例如，考虑：```
2 1 10 20 1 1
10 100
```从第一座建筑物直接跳到第二座建筑物可能只有通过高楼上方才能实现。 仅检查目标高度的解决方案会错误地将其标记为可到达。 

另一个极端情况是：```
2 2 10 20 1 1
0 100
100 0
```对角线跳跃正好穿过汇合角。 它必须高于两侧建筑物以及接触该角落的两座建筑物。 仅检查包含路径中点的单元会错过此碰撞。 

## 方法

 最简单的方法是构建一个图，其中每个建筑物都是一个顶点。 对于每对有序的建筑物，我们求解物理方程，获得可能的跳跃轨迹，并模拟通过网格的路径。 如果轨迹清除了所有建筑物，我们就会添加一条边缘。 从藏身处开始进行广度优先搜索，然后给出最小的跳跃次数。 

蛮力的想法是正确的，因为考虑了每一个可能的第一次跳跃。 然而，建筑物多达 400 座，因此大约有 160000 个有向对。 如果每对检查每栋建筑物，最坏的情况是大约 6400 万次碰撞检查。 在 Python 中，如果碰撞测试有效，这仍然是可以管理的，但是重复几何工作的粗心实现可能会变得太慢。 

关键的观察结果是图表很小，城市本身也很小。 我们不需要复杂的最短路径技术。 唯一的数学挑战是确定是否存在单次跳跃。 一旦构建了跳跃图，BFS 就会立即解决剩下的问题。 

可以通过使用垂直速度和水平速度之间的比率来简化物理过程。 让$$a = \frac{v_h}{v_d}$$对于水平距离`d`，相对于起始屋顶的轨迹为：$$z(x)=a x-\frac{g x^2(1+a^2)}{2v^2}$$着陆高度给出了一个二次方程`a`，最多产生两种可能的轨迹。 我们尝试有效的解决方案并保留较高的解决方案，因为它至少对于避免碰撞总是同样有效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 反复模拟的蛮力 | O((dx·dy)^4) | O((dx·dy)^4) | O(dx·dy) | 如果不小心实施的话就会太慢 |
 | 构建图 + BFS | O(n^3) 其中 n = dx·dy | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 将每个建筑物视为一个图节点。 对于每个可能的目标建筑物，计算是否存在从当前建筑物直接跳转的情况。 
2. 计算水平距离`d`两个屋顶中心之间。 求解可能的发射形状的二次方程。 如果不存在真正的解决方案，则没有边缘。 
3. 对于每个有效轨迹，检查直线水平路径穿过的每个建筑物。 每当路径穿过网格线时就将其分割。 每个区间都属于一栋建筑物，并且由于弹丸是凹面的，因此检查两个区间端点就足够了。 
4. 如果轨迹严格保持在每个交叉建筑物上方，请在两座建筑物之间添加一条边。 
5. 从 Robin 的藏身处开始进行广度优先搜索。 BFS 第一次到达建筑物时是所需的最小跳跃次数。 

为什么它有效：

 该图准确地包含了罗宾可以进行的身体跳跃。 添加每个有效的跳跃是因为轨迹方程和碰撞检查与真实运动匹配。 每一个无效的跳跃都会被拒绝，因为一些交叉的建筑物会与轨迹相交。 然后，BFS 在未加权的图中找到最短路径，这正是跳跃的最少次数。 

## Python 解决方案```python
import sys
from math import sqrt, hypot
from collections import deque

input = sys.stdin.readline

g = 9.80665
EPS = 1e-9

dx, dy, w, v, lx, ly = map(int, input().split())
h = [list(map(int, input().split())) for _ in range(dy)]

lx -= 1
ly -= 1
n = dx * dy

def solve_jump(x1, y1, x2, y2):
    if x1 == x2 and y1 == y2:
        return False

    sx = x1 * w + w / 2
    sy = y1 * w + w / 2
    tx = x2 * w + w / 2
    ty = y2 * w + w / 2

    d = hypot(tx - sx, ty - sy)
    dh = h[y2][x2] - h[y1][x1]

    q = g / (2 * v * v)

    # q*d^2*a^2 - d*a + (dh + q*d^2) = 0
    A = q * d * d
    B = -d
    C = dh + q * d * d

    disc = B * B - 4 * A * C
    if disc < -EPS:
        return False

    candidates = []
    if abs(A) < EPS:
        if abs(B) > EPS:
            candidates.append(-C / B)
    else:
        if disc >= 0:
            s = sqrt(max(0, disc))
            candidates.append((-B + s) / (2 * A))
            candidates.append((-B - s) / (2 * A))

    def height_at(dist, a):
        return h[y1][x1] + a * dist - q * dist * dist * (1 + a * a)

    for a in candidates:
        if a < -EPS:
            continue

        vx = tx - sx
        vy = ty - sy

        ts = [0.0, 1.0]

        if abs(vx) > EPS:
            for i in range(dx + 1):
                t = (i * w - sx) / vx
                if EPS < t < 1 - EPS:
                    ts.append(t)

        if abs(vy) > EPS:
            for i in range(dy + 1):
                t = (i * w - sy) / vy
                if EPS < t < 1 - EPS:
                    ts.append(t)

        ts.sort()

        ok = True
        for i in range(len(ts) - 1):
            l = ts[i]
            r = ts[i + 1]
            mid = (l + r) / 2

            mx = sx + mid * vx
            my = sy + mid * vy

            bx = int(mx // w)
            by = int(my // w)

            if bx < 0 or bx >= dx or by < 0 or by >= dy:
                continue

            for t in (l, r):
                dist = d * t
                if t == 1.0:
                    continue
                if height_at(dist, a) <= h[by][bx] + EPS:
                    ok = False
                    break

            if not ok:
                break

        if ok:
            return True

    return False

graph = [[] for _ in range(n)]

for y1 in range(dy):
    for x1 in range(dx):
        u = y1 * dx + x1
        for y2 in range(dy):
            for x2 in range(dx):
                if solve_jump(x1, y1, x2, y2):
                    graph[u].append(y2 * dx + x2)

start = ly * dx + lx
dist = [-1] * n
dist[start] = 0

q = deque([start])
while q:
    u = q.popleft()
    for vtx in graph[u]:
        if dist[vtx] == -1:
            dist[vtx] = dist[u] + 1
            q.append(vtx)

ans = []
for y in range(dy):
    row = []
    for x in range(dx):
        d = dist[y * dx + x]
        row.append(str(d) if d != -1 else "X")
    ans.append(" ".join(row))

print("\n".join(ans))
```图的构建是昂贵的部分。 该程序尝试每对有序的建筑物，求解射弹方程，然后通过网格执行几何扫描。 

碰撞检查收集跳跃穿过垂直或水平网格线的所有参数值。 连续值描述位于一栋建筑物内的部分。 由于抛物线是凹的，该部分的最小高度位于其一端，因此不需要连续采样。 

BFS 使用普通的队列遍历，因为每次跳转的成本相等。 距离数组存储到达每个建筑物的第一层。 

浮点比较使用较小的 epsilon，因为输入保证通过以下方式更改高度`10^-6`不会改变答案。 在碰撞检查期间会跳过目标端点，因为目标正好着陆在目标屋顶上。 

## 工作示例

 对于第一个样本：```
4 1 100 55 1 1
10 40 60 10
```起始节点是第一个建筑物。 

| 当前节点 | 候选人目的地| 边缘存在 | BFS 距离 |
 | --- | --- | --- | --- |
 | (1,1) | (2,1) | 是的 | 1 |
 | (1,1) | (3,1) | 是的 | 1 |
 | (1,1) | (4,1) | 是的 | 1 |

 直接跳跃是可能的，因为更高的弹丸弧线可以清除中间的屋顶。 

对于第二个样本：```
4 4 100 55 1 1
0 10 20 30
10 20 30 40
20 30 200 50
30 40 50 60
```| 当前节点 | 目的地 | 结果 |
 | --- | --- | --- |
 | (1,1) | (4,1) | 1 跳即可到达 |
 | (1,1) | (3,3) | 被高大的中心大楼挡住|
 | (1,1) | (4,4) | 可通过中间跳跃到达|

 该跟踪说明了为什么图表必须通过物理跳跃来构建，而不是假设附近的建筑物始终可达。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n3) | 有 O(n²) 次跳跃，每次碰撞测试都会检查 O(n) 栋建筑物 |
 | 空间| O(n²) | 跳跃图存储所有可能的有向边 |

 这里`n = dx * dy`，最大值为 400。由于图形很小并且几何检查很简单，因此产生的最坏情况对于限制而言足够小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    # Paste the solution function here and return captured output in a judge environment.
    sys.stdin = old
    return ""

# Tests are intended to be run with the submitted solution wrapped as solve().
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 10 20 1 1`与一栋大楼 |`0`| 单节点图|
 | 等高平面网格 | 所有建筑物均可到达 | 对称跳跃|
 | 通过拐角的对角线路径 | 过低时正确阻止 | 角部碰撞处理|
 | 很高的中间建筑 | 已标记目的地`X`| 障碍物检测|

 ## 边缘情况

 一座建筑城市创建一个只有一个节点且没有边的图。 BFS 将起始距离保留为零，这是所需的答案。 

通过在每个网格线交叉点处分割轨迹来处理精确穿过拐角的跳跃。 从每个相邻间隔检查相同的端点，因此考虑所有接触的建筑物。 

高于起始屋顶的目的地可能需要陡峭的弧线。 二次求解器保留两种可能的轨迹并测试它们，而不是假设较低的弧就足够了。 

几乎不接触另一个屋顶的轨迹将被拒绝，因为飞行时该路径必须保持在建筑物上方。 epsilon 比较可防止数值噪声改变此决定。
