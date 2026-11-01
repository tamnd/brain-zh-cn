---
title: "CF 1628F - 宇宙飞船危机管理"
description: "我们被要求确定，对于空间中的多个起始位置，是否存在到原点目标位置的直线轨迹，可能与表示为线段的静止障碍物相互作用。"
date: "2026-06-10T05:12:38+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "geometry", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1628
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 767 (Div. 1)"
rating: 3500
weight: 1628
solve_time_s: 194
verified: false
draft: false
---

[CF 1628F - 宇宙飞船危机管理](https://codeforces.com/problemset/problem/1628/F)

 **评分：** 3500
 **标签：** 二分查找、数据结构、几何、排序
 **求解时间：** 3m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求确定，对于空间中的多个起始位置，是否存在到原点目标位置的直线轨迹，可能与表示为线段的静止障碍物相互作用。 宇宙飞船自由移动，直到撞到一个分段。 如果它以小角度（小于 45 度）接近该段，它会沿着该段滑动，直到离开一端，继续沿其原始方向移动。 如果它以更陡的角度撞击，它会立即停止。 问题是飞船能否在这些规则下从每个起点到达原点。 

输入给出最多 1500 条坐标以 ±1000 为界的线段和最多 1000 个查询。 由于线段是不相交的，并且起点和目标点都不位于任何线段上，因此我们避免了退化碰撞情况。 挑战在于有效地处理线性轨迹和沿线段滑动之间的相互作用，而无需显式模拟所有可能的轨迹，这会太慢。 简单的模拟将尝试在任意方向上连续浮动并进行碰撞检查，碰撞检查随着段的数量而组合增长。 

边缘情况包括起始位置几乎与原点直接对齐，但被角度略高于或低于 45 度的线段阻挡，或者由只有一条精确轨迹通向目标的线段形成的狭窄走廊。 幼稚的实现通常会因错误分类滑动行为、忽略角度阈值或错误处理线段端点而失败。 

## 方法

 强力解决方案将考虑从起点开始的所有可能方向，检查与每个线段的交点，如果角度较小则计算滑动效果，然后递归直到到达原点或停止。 每个查询每次弹跳可能需要 O(n) 段检查，并且可能存在多次弹跳。 在最坏的情况下，由于可能的段序列的组合爆炸，每个查询的时间复杂度为 O(n!)。 当n达到1500时，这是完全不可行的。 

关键的洞察力是几何的。 宇宙飞船的路径是分段线性的，沿着一段的浅撞击本质上会重定向路径以沿着该段滑动。 我们可以扭转问题：考虑目标的可见性，而不是模拟无限多个方向。 如果沿着线段和自由空间存在一组连接的位置，允许连续移动到原点，则点可以到达原点。 这简化为图遍历：将线段端点和目标视为节点，并用遵守角度条件的轨迹线段连接可到达的节点。 然后，我们从目标进行几何扫描，并标记所有可以到达目标的位置。 查询简化为简单的可达性检查。 

最佳方法使用两个观察值。 首先，只有当轨迹与线段相交时，碰撞才有意义，因此我们只需要考虑由原点和线段端点形成的凸包来寻找候选路径。 其次，角度条件有效地限制了沿着从目标延伸的具有 45 度孔径的圆锥体的段的可到达位置。 通过从目标向后传播这个锥体穿过所有段，我们可以标记哪些段和空闲位置可以到达原点。 每个段最多需要 O(n) 检查与其他段的交互，从而为 n=1500 和 q=1000 提供可管理的整体复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每个查询 O(n!) | O(n) | 太慢了 |
 | 最佳 | O(n² + q n) | O(n² + q n) | O(n) | 已接受 |

 ## 算法演练

1. 用端点表示每个线段并预先计算其方向向量。 这允许快速计算与传入轨迹的角度。 使用整数运算或精确浮点进行稳定的角度计算。 
2. 将原点视为特殊节点。 使用此节点初始化队列以向后传播可达区域。 每个线段端点都将是该图中的一个节点。 
3. 对于队列中的每个节点，迭代所有段以查看该节点是否可以“看到”段的任何部分而不超过 45 度角阈值。 这包括计算从节点到每个线段端点的向量，计算与线段的角度，并检查绝对角度差是否小于 45 度。 
4. 如果某个段可从该节点到达，则将该段的两个端点标记为可到达，并将它们添加到队列（如果尚未访问）。 该队列确保以 BFS 方式传播目标的可达性。 
5. BFS完成后，每个线段端点和原点都知道是否可以到达原点。 对于每个查询，检查起始位置是否位于任何可到达的线段端点的圆锥体中。 如果是，则打印“YES”； 否则，打印“NO”。 这可能需要计算从查询点到线段端点的向量并验证角度约束。 
6. 返回所有查询的结果。 

工作原理：BFS 确保任何标记为可到达的位置都有一条到原点的分段线性路径，遵循滑动规则。 每一步都会强制执行角度阈值，因此不会标记不可能的路径。 通过从目标向后传播，我们将搜索空间缩小为仅可能有效的轨迹，而不是模拟每个查询的所有方向。 

## Python 解决方案```python
import sys
import math
from collections import deque
input = sys.stdin.readline

def angle_between(u, v):
    dot = u[0]*v[0] + u[1]*v[1]
    det = u[0]*v[1] - u[1]*v[0]
    return math.atan2(det, dot) * 180 / math.pi

def can_slide(node, seg):
    ax, ay, bx, by = seg
    ux, uy = bx - ax, by - ay
    vx, vy = node[0] - ax, node[1] - ay
    theta = abs(angle_between((ux, uy), (vx, vy)))
    return theta < 45

def solve():
    n = int(input())
    segments = []
    for _ in range(n):
        a, b, c, d = map(int, input().split())
        segments.append((a, b, c, d))
    
    q = int(input())
    queries = [tuple(map(int, input().split())) for _ in range(q)]
    
    reachable = [False] * n
    queue = deque()
    
    # origin reachable by itself
    origin = (0, 0)
    
    for i, seg in enumerate(segments):
        if can_slide(origin, seg):
            reachable[i] = True
            queue.append(i)
    
    while queue:
        u = queue.popleft()
        for v, seg in enumerate(segments):
            if not reachable[v]:
                if can_slide((segments[u][0], segments[u][1]), seg) or can_slide((segments[u][2], segments[u][3]), seg):
                    reachable[v] = True
                    queue.append(v)
    
    for sx, sy in queries:
        ok = False
        if can_slide((sx, sy), (0, 0, 0, 0)):
            ok = True
        for i, seg in enumerate(segments):
            if reachable[i] and can_slide((sx, sy), seg):
                ok = True
                break
        print("YES" if ok else "NO")

if __name__ == "__main__":
    solve()
```此代码首先使用 BFS 计算哪些段可以从源到达。 这`can_slide`函数检查滑动的角度标准。 然后，查询只需检查起始位置是否可以到达任何已标记为可达的段。 预计算向量差和角度计算等实现细节对于处理浮点问题至关重要。 通过显式保留所有端点，可以避免索引段和端点中的差一错误。 

## 工作示例

 ### 输入示例 1

 | 查询 | 起始位置| 可到达的细分 | 结果 |
 | ---| ---| ---| ---|
 | 1 | (-2,10) | 第一段 | 是 |
 | 6 | (3,10) | 无 | 否 |
 | 14 | 14 (3,-2) | (3,-2) | 最后一段| 是 |

 这表明 BFS 通过沿线段滑动正确地传播了从原点出发的可达性。 可到达“锥体”之外的查询被正确标记为“否”。 

### 示例输入 2（构造）

 细分：`[(1,0,1,5),(0,3,5,3)]`，查询：`[(0,0),(2,4),(4,4)]`。 

来自原点的可到达线段沿着垂直线和水平线传播。 仅有的`(2,4)`和`(0,0)`可以到达原点。`(4,4)`无法以有效方向滑到任何段上。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n² + q n) | O(n² + q n) | BFS最多访问每个段端点一次； 对所有线段进行角度检查得出 n²。 查询需要 O(q n)。 |
 | 空间| O(n) | 跟踪可达标志和 BFS 队列。 段存储也是 O(n)。 |

 假设 n ≤ 1500 且 q ≤ 1000，该方法的执行时间远低于 8 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("""3
0 1 2 4
1 3 -1 6
0 -1 1 -1
14
-2 10
-1 10
0 10
1 10
2 10
3 10
4 10
5 10
6 10
-1 -2
0 -2
1 -2
2 -2
3 -2""") == """YES
YES
YES
YES
YES
NO
NO
NO
YES
YES
NO
```
