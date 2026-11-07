---
title: "CF 198E - 扣人心弦的故事"
description: "每个夹具都位于空间中的固定点。 Qwerty 的飞船也已修复。 如果两个条件同时满足，一个夹具可以将另一个夹具拉入船上。"
date: "2026-06-03T09:52:49+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "sortings"]
categories: ["algorithms"]
codeforces_contest: 198
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 125 (Div. 1)"
rating: 2400
weight: 198
solve_time_s: 86
verified: true
draft: false
---

[CF 198E - 扣人心弦的故事](https://codeforces.com/problemset/problem/198/E)

 **评分：** 2400
 **标签：** 二分查找、数据结构、排序
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个夹具都位于空间中的固定点。 Qwerty 的飞船也已修复。 

如果两个条件同时满足，一个夹具可以将另一个夹具拉入船上。 目标夹具的质量不得超过主动夹具的功率，并且目标夹具必须位于主动夹具距离船舶的作用半径内。 

第二个条件是关键观察。 飞船永远不会移动，每个分散的抓手都停留在原来的坐标上，直到被收集起来。 当收集的夹具激活时，它仍然可以在船上操作。 这意味着唯一重要的距离是从船到每个夹具的距离。 

对于每个夹具，我们可以预先计算$$d_i = (x_i-x)^2 + (y_i-y)^2.$$带半径的夹具$r$可以准确地到达令人满意的夹具$$d_i \le r^2.$$收集完一个夹具后，我们获得了一对新的$(p_i,r_i)$，这可能允许收集更多的夹具。 我们想要整个可达集的大小。 

约束条件$n \le 250000$排除任何二次方。 甚至$O(n\sqrt n)$在这种规模下会感到不舒服。 我们周围需要一些东西$O(n \log n)$。 

一个微妙的点是，收集一个抓手可能会解锁另一个之前太重的抓手，而新收集的抓手可能会解锁更多抓手。 这是一个可达性问题，而不是一次性过滤问题。 

考虑：```
Ship: power=1 radius=10

A: mass=1 power=100 radius=10
B: mass=100 power=1 radius=10
```A 最初是可达的。 收集 A 后，B 变得可达。 正确答案是 2。任何仅检查初始夹具可达性的解决方案都会输出 1。 

另一个容易犯的错误是认为夹具之间的几何形状很重要。```
Ship at (0,0)

A at distance 5
B at distance 100
```如果A的半径为100并且有足够的力量，即使A和B相距很远，A也可以拉动B。 主动夹具安装在船上，因此所有半径都是从船上测量的，而不是从夹具的原始位置测量的。 

最后一个陷阱是整数溢出。 坐标和半径到达$10^9$，因此平方距离达到$10^{18}$。 所有距离计算必须使用 64 位整数。 

## 方法

 蛮力观点很简单。 维护收集的夹具组。 每当有新的夹具可用时，扫描所有未收集的夹具并收集满足当前活动夹具的质量和距离要求的每个夹具。 重复此操作，直到无法获得更多的夹具。 

这是正确的，因为它明确地模拟了可达性过程。 问题是成本。 在最坏的情况下，我们可能会收集$n$夹具，每次收集后我们都会扫描所有$n$再次对象。 那就变成了$O(n^2)$， 大致$6 \cdot 10^{10}$操作为$n=250000$。 

查询的结构比任意可达性更加具体。 

对于有动力的夹具$P$和半径$R$，我们需要所有未收集的夹具满足$$m_i \le P$$和$$d_i \le R^2.$$这是对属性的二维优势查询$(m_i,d_i)$。 

关键的观察是每个夹具最多被收集一次。 我们不需要重复枚举相同的候选集。 我们只需要一个可以在矩形内重复找到一些尚未收集的抓手的数据结构$$m_i \le P,\quad d_i \le R^2.$$如果存在，我们会收集它，永久删除它，然后继续。 

按质量对所有夹具进行排序。 那么查询就变成：

 “在距离指数位于前缀且仍然存在的所有夹具中，找到最小质量。”

 芬威克树可以维护远距离的前缀信息。 每个 Fenwick 节点都存储按质量订购的夹具。 延迟删除会删除已收集的夹具。 

每当可达距离前缀内的最小质量至多为当前功率时，我们就发现了另一个可收藏的夹具。 

这给出了一个$O(n \log n)$解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n^2)$|$O(n)$| 太慢了 |
 | 最佳 |$O(n \log n)$|$O(n \log n)$| 已接受 |

 ## 算法演练

 ### 距离缩短

 对于每个夹具计算其距船的平方距离：$$d_i=(x_i-x)^2+(y_i-y)^2.$$替换每个半径$r_i$经过$r_i^2$。 

Now geometry disappears completely. Each gripper is represented only by:$$(d_i,m_i,p_i,r_i^2).$$### 坐标压缩

 收集所有可以显示为距离阈值的值：$$d_i,\quad r_i^2,\quad r^2.$$对它们进行排序和压缩。 

芬威克树将在这些压缩距离坐标上构建。 

### 准备芬威克树

 按质量对所有夹具进行排序。 

对于每个夹具，将其插入 Fenwick 结构中与其距离相对应的位置。 

每个 Fenwick 节点都以递增的质量顺序存储夹具。 

节点稍后可能会在其前面包含已删除的元素，因此我们会延迟删除它们。 

### 可达性 BFS

 将每个收集到的抓手视为生成一个新状态$(p,r^2)$。 

从初始夹具开始。 

维护活动状态队列。 

1. 弹出一个状态$(P,R^2)$。 
2.找到对应的压缩索引$R^2$。 
3. 查询直到该索引的 Fenwick 前缀。 
4. 查询返回在可达距离范围内质量最小的活着的夹具。 
5. 虽然存在这样的夹具并且其质量至多为$P$：

 1. 将其标记为已收集。 
2. 将其从结构中缓慢移除。 
3.推自己的$(p_i,r_i^2)$进入队列。 
4.增加答案。 
5.再次查询。 

当队列变空时，该过程停止。 

### 为什么它有效

 对于任何活动状态$(P,R^2)$，当夹具位于矩形内时，它就可以被收集$$m_i \le P,\quad d_i \le R^2.$$Fenwick 查询始终返回满足距离条件的所有夹具中质量最小的活动夹具。 

如果该最小质量已经超过$P$，那么在可达距离范围内的每个剩余的夹具也超过$P$，因此该状态不存在可收集的夹具。 

如果最小质量最多为$P$，该夹具是可收集的并且必须属于可达集。 立即收集它是安全的，因为收集夹具不会使任何先前可到达的夹具变得不可到达。 

每个夹具都插入一次并移除一次，因此算法准确地发现所有可到达的夹具的闭合。 

## Python 解决方案```python
import sys
from collections import deque
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

def solve():
    x, y, p0, r0, n = map(int, input().split())

    items = []
    coords = [r0 * r0]

    for idx in range(n):
        xi, yi, m, p, r = map(int, input().split())

        dx = xi - x
        dy = yi - y

        d = dx * dx + dy * dy
        rr = r * r

        items.append([d, m, p, rr, idx])

        coords.append(d)
        coords.append(rr)

    coords = sorted(set(coords))
    K = len(coords)

    def comp(v):
        return bisect_left(coords, v) + 1

    items_sorted = sorted(items, key=lambda z: (z[1], z[0]))

    bit = [[] for _ in range(K + 2)]

    for pos, item in enumerate(items_sorted):
        d, m, p, rr, original_id = item
        idx = comp(d)

        j = idx
        while j <= K:
            bit[j].append(pos)
            j += j & -j

    ptr = [0] * (K + 2)
    removed = [False] * n

    INF = (10**30, -1)

    def clean(node):
        arr = bit[node]
        p = ptr[node]

        while p < len(arr):
            pos = arr[p]
            oid = items_sorted[pos][4]
            if not removed[oid]:
                break
            p += 1

        ptr[node] = p

    def query(idx):
        best_mass = INF[0]
        best_pos = -1

        while idx > 0:
            clean(idx)

            p = ptr[idx]
            arr = bit[idx]

            if p < len(arr):
                pos = arr[p]
                mass = items_sorted[pos][1]

                if mass < best_mass:
                    best_mass = mass
                    best_pos = pos

            idx -= idx & -idx

        return best_pos

    ans = 0
    q = deque()
    q.append((p0, r0 * r0))

    while q:
        power, radius_sq = q.popleft()

        limit = bisect_right(coords, radius_sq)

        pos = query(limit)

        while pos != -1 and items_sorted[pos][1] <= power:
            d, m, p, rr, oid = items_sorted[pos]

            removed[oid] = True
            ans += 1

            q.append((p, rr))

            pos = query(limit)

    print(ans)

if __name__ == "__main__":
    solve()
```预处理阶段将每个几何条件转换为与平方距离的比较。 这就是坐标从数据结构中完全消失的原因。 

芬威克树是根据压缩距离值构建的。 每个节点都包含按质量排序的夹具，因为全局列表在插入时已经进行了质量排序。 

这`ptr`array 实现了惰性删除。 当夹具被收集时，我们仅将其标记为已移除。 下次访问节点时，其指针将前进到已删除的条目之上。 这避免了从许多 Fenwick 节点进行昂贵的删除。 

查询操作返回请求前缀内所有距离中质量最小的活动夹具。 如果最小的质量已经太大，那么所有其他候选者也太大了。 

所有距离和半径平方均使用 Python 整数计算，可安全处理高达$10^{18}$。 

## 工作示例

 ### 示例 1

 输入：```
0 0 5 10 5
5 4 7 11 5
-7 1 4 7 8
0 2 13 5 6
2 -3 9 3 4
13 5 1 9 9
```| 步骤| 有功功率| 活动半径² | 新收集 |
 | --- | --- | --- | --- |
 | 1 | 5 | 100 | 100 夹具 2 |
 | 2 | 7 | 64 | 64 夹具 1 |
 | 3 | 11 | 11 25 | 25 夹具 4 |
 | 4 | 3 | 16 | 16 无 |

 答案=3。 

轨迹显示了连锁效应。 初始夹具无法直接收集夹具 1，但收集夹具 2 会增加可用功率并将其解锁。 

### 自定义示例```
0 0 1 10 2
1 0 1 100 10
2 0 100 1 10
```| 步骤| 有功功率| 活动半径² | 新收集 |
 | --- | --- | --- | --- |
 | 1 | 1 | 100 | 100 第一个夹具 |
 | 2 | 100 | 100 100 | 100 第二个夹具|
 | 3 | 1 | 100 | 100 无 |

 答案=2。 

这说明了为什么单次传递是不够的。 仅在获得第一个夹具后才能到达第二个夹具。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n)$| 每个夹具插入和移除一次，每次操作都会接触 Fenwick 节点 |
 | 空间|$O(n \log n)$| 夹具存储在 Fenwick 节点列表中 |

 和$n=250000$,$O(n \log n)$完全在 4 秒限制之内。 内存使用量在 512 MB 以内，因为 Fenwick 结构存储标准$n \log n$参考文献的分布。 

## 测试用例```python
import sys, io
from collections import deque
from bisect import bisect_left, bisect_right

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    x, y, p0, r0, n = map(int, input().split())

    items = []
    coords = [r0 * r0]

    for idx in range(n):
        xi, yi, m, p, r = map(int, input().split())

        d = (xi - x) ** 2 + (yi - y) ** 2
        rr = r * r

        items.append([d, m, p, rr, idx])

        coords.append(d)
        coords.append(rr)

    coords = sorted(set(coords))
    K = len(coords)

    def comp(v):
        return bisect_left(coords, v) + 1

    items_sorted = sorted(items, key=lambda z: (z[1], z[0]))

    bit = [[] for _ in range(K + 2)]

    for pos, item in enumerate(items_sorted):
        idx = comp(item[0])

        j = idx
        while j <= K:
            bit[j].append(pos)
            j += j & -j

    ptr = [0] * (K + 2)
    removed = [False] * n

    def clean(node):
        while ptr[node] < len(bit[node]):
            pos = bit[node][ptr[node]]
            if not removed[items_sorted[pos][4]]:
                break
            ptr[node] += 1

    def query(idx):
        best = None

        while idx > 0:
            clean(idx)

            if ptr[idx] < len(bit[idx]):
                pos = bit[idx][ptr[idx]]

                if best is None or items_sorted[pos][1] < items_sorted[best][1]:
                    best = pos

            idx -= idx & -idx

        return best

    ans = 0
    q = deque([(p0, r0 * r0)])

    while q:
        power, rr = q.popleft()

        limit = bisect_right(coords, rr)

        pos = query(limit)

        while pos is not None and items_sorted[pos][1] <= power:
            removed[items_sorted[pos][4]] = True
            ans += 1

            q.append((items_sorted[pos][2], items_sorted[pos][3]))

            pos = query(limit)

    return str(ans)

# sample
assert run(
"""0 0 5 10 5
5 4 7 11 5
-7 1 4 7 8
0 2 13 5 6
2 -3 9 3 4
13 5 1 9 9
"""
) == "3"

# minimum size
assert run(
"""0 0 1 1 1
1 0 1 1 1
"""
) == "1"

# unreachable because of mass
assert run(
"""0 0 1 10 1
1 0 2 100 100
"""
) == "0"

# chain unlocking
assert run(
"""0 0 1 10 2
1 0 1 100 10
2 0 100 1 10
"""
) == "2"

# boundary distance exactly equal to radius
assert run(
"""0 0 10 5 1
3 4 10 1 1
"""
) == "1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 | 3 | 官方场景|
 | 单可触及夹具 | 1 | 最小尺寸|
 | 重型夹具| 0 | 质量约束|
 | 解锁链| 2 | 可达性传播 |
 | 距离恰好等于半径 | 1 | 包容边界 |

 ## 边缘情况

 考虑：```
0 0 1 10 2
1 0 1 100 10
2 0 100 1 10
```该算法首先找到质量最小的可到达夹具，收集它，并将其功率-半径对推入队列。 当处理新状态时，第二个夹具变得可收集。 答案正确2.

 考虑：```
0 0 10 5 1
3 4 10 1 1
```距离的平方为$3^2+4^2=25$，正好等于$5^2$。 查询使用带条件的距离前缀$d_i \le r^2$，因此包含夹具，答案为 1。 

考虑：```
0 0 1 1000000000 1
1000000000 0 1 1 1
```距离的平方等于$10^{18}$。 该算法将所有此类值存储为 64 位整数并直接比较平方值。 没有使用浮点运算，因此答案仍然正确。
