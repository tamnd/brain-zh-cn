---
title: "CF 105020N - 有多少个矩形？"
description: "输入中的每个矩形完全由其左下角和右上角确定。 由于所有矩形都从非负象限开始，因此原点 (0, 0) 充当自然参考点。 查询给出一个点 (x, y)。"
date: "2026-06-28T02:02:33+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105020
codeforces_index: "N"
codeforces_contest_name: "TCPC Tunisian Collegiate Programming Contest 2022"
rating: 0
weight: 105020
solve_time_s: 77
verified: false
draft: false
---

[CF 105020N - 有多少个矩形？](https://codeforces.com/problemset/problem/105020/N)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 17s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 输入中的每个矩形完全由其左下角和右上角确定。 由于所有矩形都从非负象限开始，因此原点 (0, 0) 充当自然参考点。 

查询给出一个点 (x, y)。 这定义了从原点到该点的轴对齐矩形。 任务是计算有多少给定矩形完全位于该查询矩形内。 

如果矩形的每个点都在查询边界内，则矩形被完全包含。 由于所有矩形均已从非负坐标开始，因此包含性简化为其右上角的简单条件：如果矩形的右上角 (x2, y2) 满足 x2 ≤ x 且 y2 ≤ y，则该矩形对于查询有效。 

所以这个问题不再是复杂意义上的几何问题了。 它变成了矩形右上角形成的点集的二维优势计数问题。 

约束 n, Q ≤ 100000 意味着任何接近 O(nQ) 的解都是不可能的。 每个查询的直接检查最多需要 10^10 次比较，这远远超出了时间限制。 甚至 O(n log n + Q log n) 也是必要的，通常我们的目标是 O((n + Q) log n)。 

平等处理产生了一个微妙的问题。 必须包含 x2 恰好等于查询 x 的矩形，这同样适用于 y。 任何严格的不平等错误都会默默地低估。 

另一种边缘情况是许多矩形共享相同的 x2 或 y2 值。 如果以错误的顺序处理查询，则不仔细对相等值进行分组的简单排序方法可能会导致不正确的增量更新。 

## 方法

 蛮力的想法很简单。 对于每个查询，迭代所有矩形并检查是否 x2 ≤ x 且 y2 ≤ y。 这是正确的，因为它直接编码了包含的定义。 然而，每个查询的成本为 O(n)，如果有 Q 个查询，则成本为 O(nQ)，在最坏的情况下约为 10^10 次操作。 那太慢了。 

关键的观察是矩形可以简化为点 (x2, y2)，并且每个查询询问有多少点位于以 (x, y) 为界的左下象限中。 这是一个经典的二维前缀计数问题。 

如果我们按 x2 对矩形进行排序，我们可以按 x 的升序处理查询。 当我们进行查询时，我们维护一个数据结构，用于存储 x2 已经足够小的矩形的所有 y2 值。 然后每个查询减少到 y 上的一维前缀计数。 

压缩 y 坐标上的 Fenwick 树（二叉索引树）允许我们在对数时间内维护计数并回答前缀和。 每个矩形插入一次，每个查询执行一次前缀和。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(nQ) | O(1) | O(1) | 太慢了|
 | 排序 + Fenwick 树 | O((n + Q) log n) | O((n + Q) log n) | O(n) | 已接受 |

 ## 算法演练

1. 将每个矩形替换为一个点 (x2, y2)。 这是有效的，因为只有右上角决定包含，而左下角与此问题无关，因为所有矩形都从非负坐标开始。 
2. 将所有查询存储为三元组（x，y，索引），因为我们需要按原始顺序返回答案。 
3. 按 x2 按升序对矩形进行排序。 还按 x 按升序对查询进行排序。 这确保了当我们处理查询时，所有 x2 ≤ x 的矩形都已被考虑。 
4. 将所有 y2 值和所有查询 y 值压缩到更小的坐标范围内。 这使得芬威克树能够高效运行，即使原始坐标高达 10^9。 
5. 按 x 的升序扫描查询。 将指针保持在矩形上方。 对于每个查询，将所有 x2 ≤ 当前查询 x 的矩形插入 Fenwick 树中，更新它们的 y2 频率。 
6. 对于每个查询，使用 Fenwick 树上的前缀和查询计算有 y2 ≤ 查询 y 的插入矩形数量。 存储结果。 
7、按照原来的查询顺序输出结果。 

### 为什么它有效

 在每个查询点 x 处，数据结构恰好包含一组矩形，其 x2 足够小以适合查询边界。 Fenwick 树维护对 y2 值的计数，因此查询 y 上的前缀会直接对那些也满足 y2 ≤ y 的矩形进行精确计数。 由于这两个条件都是增量且独立地强制执行的，因此不会重复计算或遗漏任何矩形。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, i, v):
        while i <= self.n:
            self.bit[i] += v
            i += i & -i

    def sum(self, i):
        s = 0
        while i > 0:
            s += self.bit[i]
            i -= i & -i
        return s

def solve():
    n = int(input())
    rects = []
    ys = []

    for _ in range(n):
        x1, y1, x2, y2 = map(int, input().split())
        rects.append((x2, y2))
        ys.append(y2)

    q = int(input())
    queries = []
    for i in range(q):
        x, y = map(int, input().split())
        queries.append((x, y, i))
        ys.append(y)

    ys = sorted(set(ys))
    def get(v):
        l, r = 0, len(ys) - 1
        while l <= r:
            m = (l + r) // 2
            if ys[m] <= v:
                l = m + 1
            else:
                r = m - 1
        return l

    rects.sort()
    queries.sort()

    fw = Fenwick(len(ys))
    ans = [0] * q

    i = 0
    for x, y, idx in queries:
        while i < n and rects[i][0] <= x:
            fw.add(get(rects[i][1]), 1)
            i += 1
        ans[idx] = fw.sum(get(y))

    print("\n".join(map(str, ans)))

if __name__ == "__main__":
    solve()
```该实现首先将几何图形简化为排序扫描问题。 Fenwick 树仅负责 y 前缀计数，而排序步骤确保通过构造强制执行 x 约束。 坐标压缩是必要的，因为使用高达 10^9 的值进行直接索引是不可行的。 

里面的二分查找`get`将 y 坐标转换为其压缩索引。 使用`<= v`确保正确处理相等性，以便包含正好位于边界上的矩形。 

## 工作示例

 考虑矩形 (1, 2)-(7, 6)、(7, 0)-(10, 3) 和查询 (8, 10)。 

我们将矩形转换为点 (7, 6) 和 (10, 3)。 排序后，我们按x顺序进行处理。 

| 步骤| 加工后的矩形| Fenwick 内容（y2 计数）| 查询 | 结果 |
 | ---| ---| ---| ---| ---|
 | 1 | (7,6) | {6:1} | (8,10) | 1 |
 | 2 | (10,3) 尚未包含 | {6:1} | - | - |

 该查询仅包含 (7,6)，因为 7 ≤ 8 且 6 ≤ 10，而 (10,3) 由于 x2 > 8 而被排除。 

现在考虑第二个示例，其中包含矩形 (2,2)-(5,5)、(1,1)-(3,3)、(4,4)-(6,6) 以及查询 (3,3) 和 (6,6)。 

| 查询 | 活动矩形| 计数条件结果 |
 | ---| ---| ---|
 | (3,3) | (3,3), (5,5 尚未按 x 顺序), (6,6 尚未) | 1 |
 | (6,6) | 所有矩形| 3 |

 这证实了随着 x 的增加，扫描正确地累积了有效的矩形。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O((n + q) log n) | O((n + q) log n) | 排序加上 Fenwick 更新和查询 |
 | 空间| O(n + q) | 矩形、查询和压缩坐标的存储 |

 由于每个矩形和查询都会处理恒定数量的对数 Fenwick 运算，因此运算可以在限制范围内轻松扩展。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from __main__ import solve
    return capture_output(solve)

def capture_output(func):
    import sys, io
    old = sys.stdout
    sys.stdout = io.StringIO()
    func()
    out = sys.stdout.getvalue()
    sys.stdout = old
    return out.strip()

# minimal
assert run("""1
1 0 2 3
1
2 3
""") == "1"

# boundary equality
assert run("""2
1 1 3 3
3 3 5 5
1
3 3
""") == "1"

# all rectangles inside
assert run("""3
1 1 2 2
2 2 3 3
3 3 4 4
1
5 5
""") == "3"

# none inside
assert run("""2
5 5 10 10
6 6 9 9
1
4 4
""") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小| 1 | 基本正确性 |
 | 平等案例| 1 | 边界包含|
 | 全部在里面| 3 | 累积正确性 |
 | 里面没有| 0 | 排除逻辑 |

 ## 边缘情况

 一种重要的边缘情况是矩形共享相同的 x2 或 y2 值。 该算法可以安全地处理此问题，因为排序和 Fenwick 更新不依赖于唯一性； 每个矩形都是独立插入的，并通过频率增量进行计数。 

另一种情况是当查询正好位于矩形边界上时。 由于 x2 ≤ x 和 y2 ≤ y 都通过坐标压缩和前缀和进行非严格比较，因此正确包含了边界矩形。 

最后，当所有矩形都位于最大查询范围之外时，Fenwick 树在所有查询期间都保持为空，无需特殊处理即可始终生成零计数。
