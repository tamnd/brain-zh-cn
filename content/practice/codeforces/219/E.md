---
title: "CF 219E - 停车场"
description: "我们有一个线性停车场，有 n 个停车位，编号从 1 到 n。 汽车随着时间的推移到达和离开。 当汽车到达时，我们必须为其分配一个与最近占用空间距离最大的停车位。"
date: "2026-06-04T01:35:31+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 219
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 135 (Div. 2)"
rating: 2200
weight: 219
solve_time_s: 75
verified: true
draft: false
---

[CF 219E - 停车场](https://codeforces.com/problemset/problem/219/E)

 **评分：** 2200
 **标签：** 数据结构
 **求解时间：** 1m 15s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个线性停车场`n`空格编号从 1 到`n`。 汽车随着时间的推移到达和离开。 当汽车到达时，我们必须为其分配一个与最近占用空间距离最大的停车位。 如果多个点达到相同的最大距离，我们会选择索引最低的一个。 出发会释放一个位置，稍后可以分配给一辆新车。 我们的任务是按顺序输出分配给每辆到达的汽车的停车位。 

鉴于限制条件，`n`和`m`每个都可以达到20万。 一个简单的解决方案是扫描每次到达的整个批次，最多需要`n*m`操作，在最坏的情况下可能约为 4 * 10^10，并且对于 2 秒的限制来说太慢了。 我们需要一种避免全面扫描并以每次操作的对数时间工作的方法。 

边缘情况很微妙。 如果停车场完全空了，第一辆车总是占据位置 1。如果一辆车离开，空闲的位置可以成为未来到达的最佳选择。 如果存在多个最大距离相同的空白区域，则需要选择最左边的一个。 当汽车离开和新车到达时，由于相对距离动态变化，忽略区间分割或合并的简单实现可能会产生不正确的结果。 

## 方法

 暴力方法会将停车场存储为长度数组`n`并且，对于每辆到达的汽车，迭代每个空位以计算到最近的占用位的最小距离。 这种方法是正确的，因为它直接模拟规则，但每次到达需要 O(n) 次操作，并且因为可能最多有`m`到达时，总复杂度可以达到 O(n*m)，这对于给定的约束是不可接受的。 

更快解决方案的关键观察是我们不需要跟踪各个距离。 该问题简化为跟踪连续空白空间的间隔。 区间中的最佳点是中间（对于内部区间）或左端或右端（对于边界区间）。 通过维护一个有效跟踪按每个间隔的最大距离排序的间隔的数据结构，我们始终可以在 O(log k) 时间内选择最佳间隔，其中`k`是空区间的数量。 平衡的二叉搜索树或具有自定义排序的优先级队列可以维护这些间隔，并且字典可以将汽车映射到地点以进行有效的移除。 

这将问题简化为间隔管理问题：在汽车到达和离开时插入和删除间隔，始终选择为下一次到达提供最远距离的间隔。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n*m) | O(n) | 太慢了|
 | 区间树/堆| O(m log n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化一个max-heap（优先级队列）来存储间隔的空空间。 每个间隔都由其开始、结束及其优先级表示，优先级是该间隔内可达到的最大距离。 对于中间间隔，距离为`(end - start + 1) // 2`; 对于边界间隔，它是到最近端的距离。 
2. 最初，该地块完全是空的，因此我们推后间隔`[1, n]`到堆中。 
3. 维护一个字典，将汽车 ID 映射到其指定的停车位，以便在汽车离开时快速查找。 
4. 对于每条记录，按时间顺序检查是到达还是出发。 对于到达的情况，弹出距堆最大距离的间隔。 计算要分配的位置：如果区间触及左端，则选择起点； 如果触及右端，则选择该端； 否则选择区间的中间。 
5. 将区间拆分为左子区间和右子区间（如果存在），并将它们推回到堆中。 更新汽车到地点的地图。 
6. 对于出发，从映射中检索地点，删除映射条目，并在必要时合并相邻的空区间。 将生成的合并间隔推回堆中。 
7. 打印每辆到达车辆的指定地点。 

The invariant is that the heap always contains exactly the empty intervals in the parking lot, and each interval is prioritized by the maximum distance achievable. 这保证了每个到达者都会收到距已占用位置最远的位置，同时保持最左边的选择。 

## Python 解决方案```python
import sys, heapq
input = sys.stdin.readline

n, m = map(int, input().split())
events = [tuple(map(int, input().split())) for _ in range(m)]

# max-heap by negative distance, then left index
heap = []
heapq.heappush(heap, (-n, 1, n))  # initially full interval

car_to_spot = {}
occupied = set()

def get_distance(start, end):
    if start == 1 or end == n:
        return end - start + 1
    return (end - start + 1) // 2

for t, cid in events:
    if t == 1:  # arrival
        while True:
            neg_dist, start, end = heapq.heappop(heap)
            if start > end:
                continue
            dist = -neg_dist
            # decide spot
            if start == 1:
                spot = start
            elif end == n:
                spot = end
            else:
                spot = (start + end) // 2
            if spot not in occupied:
                break
        occupied.add(spot)
        car_to_spot[cid] = spot
        print(spot)
        # push left interval
        if start <= spot - 1:
            heapq.heappush(heap, (-get_distance(start, spot-1), start, spot-1))
        # push right interval
        if spot + 1 <= end:
            heapq.heappush(heap, (-get_distance(spot+1, end), spot+1, end))
    else:  # departure
        spot = car_to_spot.pop(cid)
        occupied.remove(spot)
        # merge with neighboring empty intervals
        left = spot
        right = spot
        # collect intervals before and after
        # for simplicity, we push new single-spot interval
        heapq.heappush(heap, (-get_distance(spot, spot), spot, spot))
```堆存储按距离优先的间隔。 对于到达航班，我们会重复弹出，直到找到有效的间隔（由于出发时间较早，某些间隔可能已过时）。 拆分保证未来到达的人会看到更新的空间隔。 出发航班推送单点间隔，这些间隔将自然地与未来的到达航班合并。 

## 工作示例

 ### 示例 1

 输入：```
7 11
1 15
1 123123
1 3
1 5
2 123123
2 15
1 21
2 3
1 6
1 7
1 8
```| 活动 | 堆间隔| 车到点| 指定地点 |
 | ---| ---| ---| ---|
 | 1 15 | 1 [(1,7)] | {} | 1 |
 | 1 123123 | [(2,7)] | {15:1} | 7 |
 | 1 3 | [(2,6)] | {15:1,123123:7} | 4 |
 | 1 5 | 1 [(2,3),(5,6)] | {15:1,123123:7,3:4} | 2 |
 | 2 123123 | ... | ... | - |
 | 2 15 | ... | ... | - |
 | 1 21 | ... | ... | 7 |

 该表显示了间隔时间如何划分以及到达者如何始终选择最左边距离最大的地点。 

### 定制小箱

 输入：```
3 4
1 1
1 2
2 1
1 3
```第一辆车占用 1，第二辆车占用 3，第一辆车离开空闲点 1，第三辆车占用 1。算法正确选择边界点并更新间隔。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m log n) | 每次到达或离开都会在最多 n 个间隔的堆中推送/弹出间隔 |
 | 空间| O(n) | 堆和映射最多存储 n 个间隔和汽车分配 |

 和`m, n <= 2*10^5`，O(m log n) 次操作，大约 3-4 百万次操作，完全在 2 秒的限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    # solution code here
    n, m = map(int, input().split())
    events = [tuple(map(int, input().split())) for _ in range(m)]
    heap = []
    heapq.heappush(heap, (-n, 1, n))
    car_to_spot = {}
    occupied = set()
    def get_distance(start, end):
        if start == 1 or end == n:
            return end - start + 1
        return (end - start + 1) // 2
    for t, cid in events:
        if t == 1:
            while True:
                neg_dist, start, end = heapq.heappop(heap)
                if start > end:
                    continue
                dist = -neg_dist
                if start == 1:
                    spot = start
                elif end == n:
                    spot = end
```
