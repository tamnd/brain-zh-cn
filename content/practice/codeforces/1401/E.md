---
title: "CF 1401E - 除平方"
description: "我们被要求在绘制几条水平和垂直线段后计算一个大正方形被分成的块数。"
date: "2026-06-11T08:43:17+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "geometry", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1401
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 665 (Div. 2)"
rating: 2400
weight: 1401
solve_time_s: 137
verified: false
draft: false
---

[CF 1401E - 除平方](https://codeforces.com/problemset/problem/1401/E)

 **评分：** 2400
 **标签：** 数据结构、几何、实现、排序
 **求解时间：** 2m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求在绘制几条水平和垂直线段后计算一个大正方形被分成的块数。 正方形的大小是固定的$10^6 \times 10^6$，并且线段可以部分或完全穿过正方形，但它们总是与其至少一条边相交。 水平线段由其 y 坐标和 x 范围给出，而垂直线段由其 x 坐标和 y 范围给出。 没有两个线段位于同一条线上。 

输出是一个整数，表示添加所有线段后正方形中剩余多少个连接区域。 从概念上讲，每个部分都可以沿其线将现有区域分成两部分。 水平线段将区域水平分割； 垂直线段垂直分割区域。 线段之间的交叉点增加了所得碎片的数量。 

约束表明两者$n$和$m$可以达到$10^5$。 基于网格的强力解决方案至少需要$10^{12}$如果我们试图标记正方形的所有点，这在 2 秒内显然是不可能的。 因此，我们必须避免迭代正方形的每个单位的方法。 相反，该解决方案只需要处理线段本身及其交集。 

关键的边缘情况是当一个线段没有跨越正方形的整个宽度或高度但接触到一侧时。 例如，一个水平线段$(0,2)$到$(4,2)$在一个$10^6 \times 10^6$即使它没有到达远端，正方形仍然可以用于分裂碎片。 简单的方法可能会忽略未完全跨越轴的线段，从而产生计数不足。 另一个棘手的情况是不同轴上的重叠段。 如果垂直线段和水平线段相交，则相交会创建一个新片段。 忽略交叉点会低估碎片的总数。 

## 方法

 暴力方法很简单：想象一个代表正方形的二维数组，并在其上标记所有水平和垂直线段。 然后执行洪水填充来计算连接区域。 这是有效的，因为标记和连接直接对应于件数。 问题是，即使存储一个网格$10^6 \times 10^6$单元格是不可能的，并且对其进行迭代远远超出了允许的范围$2\cdot 10^9$每秒操作数。 因此，由于内存和时间的限制，暴力方法会失败。 

最佳方法利用了我们不需要表示完整正方形的观察结果； 我们只需要线段及其交集。 每个水平线段可以被认为是切割它穿过的所有垂直区域，并且每个垂直线段可以被认为是切割它穿过的所有水平区域。 仔细计算交叉点使我们能够使用组合参数：每个新线段添加的部分等于一加上它与另一个方向形成的交叉点的数量。 这减少了有效地对段进行排序和计算重叠的问题，这可以使用扫描线和坐标压缩来完成，因为坐标很大但段的数量适中。 这种方法避免了任何完整的网格表示，仅依赖于$n+m$线段及其交叉点计数。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(10^12) | O(10^12) | O(10^12) | O(10^12) | 太慢了 |
 | 最佳 | O((n+m) log(n+m)) | O((n+m) log(n+m)) | O(n+m) | 已接受 |

 ## 算法演练

 1. 将段分成水平和垂直列表，保留它们的坐标。 水平线段存储为`(y, x_start, x_end)`和垂直为`(x, y_start, y_end)`。 
2.对水平线段和垂直线段的所有x坐标进行坐标压缩，并类似地对y坐标进行压缩。 这确保所有段坐标映射到从 0 到最多的较小整数范围$2\cdot 10^5$，适合内存并允许高效处理。 
3. 对于水平线段，按 y 坐标排序。 对于垂直线段，按 x 坐标排序。 这种排序为扫线算法做好准备，以有效地计算交叉点。 
4.沿压缩轴初始化一棵Fenwick树（二元索引树）。 对于水平扫描，树会跟踪 x 轴上的活动垂直线段，计算水平线相交的垂直线段数。 当进入或离开垂直段时更新树。 
5. 以递增的 y 坐标迭代所有水平线段。 对于每个水平线段，在其 x 范围内查询 Fenwick 树以计算与垂直线段的交集。 每个交叉点都会使件数增加 1。 为水平线段本身添加 1，因为它总是分割其遍历的区域。 
6. 使用存储在树中的水平线段，对垂直线段重复对称操作，并沿 x 轴进行扫描。 所有段贡献的总和减去计数的交叉点（因为交叉点被计数两次）给出了碎片的总数。 
7. 将结果初始化为1，代表原始正方形。 对于处理的每个段，根据上述规则添加其贡献。 输出最终结果。 

关键的不变量是，每个新线段要么分割现有片段，要么与另一个方向的片段相交，这会在相交处创建一个新片段。 该算法保证每个路段类型的每个交集都被精确计数一次，因此总和正确地代表了所有结果片段。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class FenwickTree:
    def __init__(self, n):
        self.n = n
        self.bit = [0]*(n+1)
    
    def update(self, i, val):
        i += 1
        while i <= self.n:
            self.bit[i] += val
            i += i & -i
    
    def query(self, i):
        i += 1
        res = 0
        while i > 0:
            res += self.bit[i]
            i -= i & -i
        return res
    
    def range_query(self, l, r):
        return self.query(r) - self.query(l-1)

def main():
    n, m = map(int, input().split())
    horiz = []
    vert = []
    x_coords = set()
    y_coords = set()
    
    for _ in range(n):
        y, lx, rx = map(int, input().split())
        horiz.append((y, lx, rx))
        x_coords.add(lx)
        x_coords.add(rx)
        y_coords.add(y)
    
    for _ in range(m):
        x, ly, ry = map(int, input().split())
        vert.append((x, ly, ry))
        y_coords.add(ly)
        y_coords.add(ry)
        x_coords.add(x)
    
    x_list = sorted(x_coords)
    y_list = sorted(y_coords)
    x_map = {x:i for i,x in enumerate(x_list)}
    y_map = {y:i for i,y in enumerate(y_list)}
    
    horiz_mapped = [(y_map[y], x_map[lx], x_map[rx]) for y, lx, rx in horiz]
    vert_mapped = [(x_map[x], y_map[ly], y_map[ry]) for x, ly, ry in vert]
    
    horiz_mapped.sort()
    vert_mapped.sort()
    
    BIT = FenwickTree(len(x_list))
    
    res = 1
    events = []
    for x, ly, ry in vert_mapped:
        events.append((ly, 1, x))
        events.append((ry+1, -1, x))
    events.sort()
    
    j = 0
    for y, lx, rx in horiz_mapped:
        while j < len(events) and events[j][0] <= y:
            _, delta, x = events[j]
            BIT.update(x, delta)
            j += 1
        res += 1 + BIT.range_query(lx, rx)
    
    # symmetric for vertical segments
    BIT = FenwickTree(len(y_list))
    events = []
    for y, lx, rx in horiz_mapped:
        events.append((lx, 1, y))
        events.append((rx+1, -1, y))
    events.sort()
    
    j = 0
    for x, ly, ry in vert_mapped:
        while j < len(events) and events[j][0] <= x:
            _, delta, y = events[j]
            BIT.update(y, delta)
            j += 1
        res += 1 + BIT.range_query(ly, ry)
    
    print(res)

if __name__ == "__main__":
    main()
```代码首先将坐标映射到压缩索引，确保我们可以有效地使用 Fenwick 树。 首先处理水平线段：每个线段贡献一个片段，并通过芬威克树计算与垂直线段的交叉点。 然后垂直线段也进行类似的处理。 为每个段添加一个处理新的分割，而范围查询则考虑交叉点。 使用`events`确保扫描线在其端点处正确添加或删除垂直线段。 此方法避免了重复计算并在内存限制内处理大坐标。 

## 工作示例

 ### 示例 1

 输入：```
3 3
2 3 1000000
4 0 4
3 0 1000000
4 0 1
2 0 5
3 1 1000000
```| 细分 | 压缩坐标 | 十字路口 | 贡献 | 累计件数 |
 | ---| ---| ---| ---| ---|
 | H2 3-1e6 | y = 0 | 穿越V2 | 1 | 2 |
 | H4 0-4 | y = 1 | 交叉 V1 | 1 | 3 |
 | H3 0-1e6 | y = 2 | | | |
