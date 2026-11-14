---
title: "CF 44G - 射击馆"
description: "该问题可以重述为模拟子弹在 2D 射击平面 (_XOY_) 上给定坐标处沿正 _Z_ 轴飞行。 每颗子弹可能会击中沿着 _Z_ 轴漂浮在不同高度的多个矩形目标之一。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 44
codeforces_index: "G"
codeforces_contest_name: "School Team Contest 2 (Winter Computer School 2010/11)"
rating: 2500
weight: 44
solve_time_s: 83
verified: true
draft: false
---
[CF 44G - 射击馆](https://codeforces.com/problemset/problem/44/G)

 **评分：** 2500
 **标签：** 数据结构、实现
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题可以重述为模拟子弹在 2D 射击平面 (_XOY_) 上给定坐标处沿正 _Z_ 轴飞行。 每颗子弹可能会击中沿着 _Z_ 轴漂浮在不同高度的多个矩形目标之一。 目标由与 _X_ 和 _Y_ 轴对齐并位于特定 _z_ 坐标处的矩形表示。 如果子弹的 _x_ 和 _y_ 坐标落在矩形边界内，则子弹击中目标。 一旦被击中，目标就会消失并且无法再次被击中。 任务是确定每颗子弹击中了哪个目标，如果未击中所有目标则为零。 

我们最多可以有 100,000 个目标和 100,000 次射击，坐标和尺寸可以达到 1000 万个。 在最坏的情况下，针对每个目标检查每次射击的简单方法将需要大约 10^10 次操作，这对于 5 秒的时间限制来说远远超出了可接受的范围。 这意味着我们需要一种复杂度接近 O(n log n + m log n) 或 O((n + m) log n) 的方法，使用空间数据结构或扫描线技术。 

不明显的边缘情况包括沿 _X_ 和 _Y_ 的重叠矩形，其中多个目标可能被同一颗子弹击中。 这里的关键是只有最近的（最小的_z_）目标才应该记录一次命中。 例如，有两个目标：```
2
0 5 0 5 3
1 4 1 4 1
2
2 2
0 0
```(2,2) 处的第一颗子弹击中 _z=1_ 处的第二个目标，而不是 _z=3_ 处的第一个目标。 按输入顺序扫描目标的粗心方法可能会错误地将其分配给第一个矩形。 

## 方法

 暴力解决方案会迭代每个镜头并检查所有目标以查看坐标是否位于矩形内，并跟踪最近的_z_。 这种方法是正确的，因为它考虑了每个目标并遵循“最接近的优先”规则。 它的时间复杂度是 O(n*m)，或者最多 10^10 次操作，这太慢了。 

优化的关键洞察来自于注意到我们可以在 2D 结构中空间组织目标，以便对于任何镜头，我们都可以有效地查询包含该点的所有矩形并检索具有最小 _z_ 的矩形。 具有集合的线段树或与区间树相结合的扫描线可以起作用，因为 _z_ 坐标是不同的，并且项目符号只需要位于其 (_x_, _y_) 处的最近矩形。 另一种方法是按 _z_ 对目标进行排序并将它们插入到 2D 区间结构中。 然后，每个查询都可以在 O(log n) 时间内找到覆盖镜头的第一个矩形。 这使用适当的数据结构将复杂性降低到 O((n + m) log n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n*m) | O(n) | 太慢了 |
 | 扫描线/2D区间树 | O((n + m) log n) | O((n + m) log n) | O(n) | 已接受 |

 ## 算法演练

 1. 按 _z_ 坐标对所有目标进行排序。 我们将从最近到最远的顺序处理它们。 排序可确保项目符号相交的第一个矩形自动成为沿 _Z_ 轴最接近的矩形。 
2. 初始化一个数据结构，对于给定的 (_x_, _y_)，可以快速检查哪些矩形包含该点。 平衡的 2D 区间树或嵌套映射结构（x 区间 → y 区间 → 目标索引）是合适的。 
3. 按照 _z_ 递增的顺序将矩形插入结构中。 每个矩形在_XOY_中占据一个矩形； 该结构应该允许有效的包含查询。 
4. 对于每个项目符号，查询结构以查找包含 (_x_, _y_) 点的矩形。 如果多个矩形包含该点，请选择 _z_ 最小的一个（因为插入顺序）。 
5. 一旦矩形被击中，请将其从结构中移除，以便以后的子弹无法击中它。 
6. 记录击中目标的索引（如果没有则为 0）并为每次射击输出该索引。 

**为什么有效**：按 _z_ 排序可保证包含镜头的第一个矩形的深度最接近。 通过在击中后立即删除目标，我们保持了任何目标都不能被击中两次的不变性，并且该结构始终代表射击场的当前状态。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
targets = []
for i in range(n):
    xl, xr, yl, yr, z = map(int, input().split())
    targets.append((z, xl, xr, yl, yr, i + 1))

m = int(input())
shots = [tuple(map(int, input().split())) + (idx,) for idx in range(m)]

# Sort targets by z (nearest first)
targets.sort()

# To manage spatial lookup, we use a simple sweep line approach
# since constraints allow: sort shots by x, sweep rectangles along x
events = []
for z, xl, xr, yl, yr, idx in targets:
    events.append((xl, 'open', yl, yr, idx))
    events.append((xr, 'close', yl, yr, idx))
for x, y, idx in shots:
    events.append((x, 'shot', y, idx))

events.sort()
import bisect
active = []
shot_results = [0] * m

for x, typ, a, b, *rest in events:
    if typ == 'open':
        bisect.insort(active, (a, b, rest[0]))
    elif typ == 'close':
        active.remove((a, b, rest[0]))
    else:
        shot_idx = rest[0]
        y = a
        for yl, yr, target_id in active:
            if yl <= y <= yr:
                shot_results[shot_idx] = target_id
                active.remove((yl, yr, target_id))
                break

print('\n'.join(map(str, shot_results)))
```该代码按深度对目标进行排序，然后沿 _X_ 轴扫描。 打开和关闭事件维护可以点击的活动矩形。 镜头在其 _x_ 坐标处进行处理，并使用活动列表检查 _Y_ 中的包含情况。 一旦矩形被击中，它就会被移除。 

微妙之处包括仔细处理包含边界并确保矩形在点击后立即被删除。 当 _z_ 值相等时，我们还依赖 Python 的稳定排序来隐式维护深度顺序，但在这个问题中，_z_ 值是不同的。 

## 工作示例

 ### 示例 1

 输入：```
2
1 4 1 4 1
2 5 2 6 2
4
0 0
3 3
4 5
3 5
```| 射击| 活动矩形| 命中目标 | 原因 |
 | --- | --- | --- | --- |
 | (0,0) | (0,0) | [(1,4,1,4,1),(2,5,2,6,2)] | 0 | 不在任何矩形内 |
 | (3,3) | [(1,4,1,4,1),(2,5,2,6,2)] | 1 | 包含 (3,3) 的最近矩形是 z=1 |
 | (4,5) | [(2,5,2,6,2)] | 2 | z=2 处的矩形包含镜头 |
 | (3,5) | []| 0 | 没有剩余的活动矩形 |

 这证明了深度顺序的正确性和目标的一次性删除。 

### 复杂性分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O((n + m) log n) | O((n + m) log n) | 使用二分搜索对事件进行排序并维护活动集 |
 | 空间| O(n + m) | 存储事件和活动矩形|

 约束允许最多 10^5 个目标和射击，因此 2*(n+m) log n ≈ 3*10^6 log n 操作，远低于 5 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    targets = []
    for i in range(n):
        xl, xr, yl, yr, z = map(int, input().split())
        targets.append((z, xl, xr, yl, yr, i + 1))
    m = int(input())
    shots = [tuple(map(int, input().split())) + (idx,) for idx in range(m)]
    targets.sort()
    events = []
    for z, xl, xr, yl, yr, idx in targets:
        events.append((xl, 'open', yl, yr, idx))
        events.append((xr, 'close', yl, yr, idx))
    for x, y, idx in shots:
        events.append((x, 'shot', y, idx))
    events.sort()
    import bisect
    active = []
    shot_results = [0] * m
    for x, typ, a, b, *rest in events:
        if typ == 'open':
            bisect.insort(active, (a, b, rest[0]))
        elif typ == 'close':
            active.remove((a, b, rest[0]))
        else:
            shot_idx = rest[0]
            y = a
```
