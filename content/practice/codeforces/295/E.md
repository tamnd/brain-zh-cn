---
title: "CF 295E - 雅罗斯拉夫和点"
description: "我们在数轴上有一组点。 每个点都有一个标识，因此当更新说“将点 p 移动 d”时，只有该特定点会更改位置。 有两个操作。"
date: "2026-06-05T17:48:14+07:00"
tags: ["codeforces", "competitive-programming", "data-structures"]
categories: ["algorithms"]
codeforces_contest: 295
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 179 (Div. 1)"
rating: 2500
weight: 295
solve_time_s: 139
verified: true
draft: false
---

[CF 295E - 雅罗斯拉夫和点](https://codeforces.com/problemset/problem/295/E)

 **评分：** 2500
 **标签：** 数据结构
 **求解时间：** 2m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们在数轴上有一组点。 每个点都有一个标识，因此当更新说“移动点”时`p`经过`d`”，只有特定点改变位置。

 有两个操作。 

第一个操作从当前坐标中删除一个点并将其插入到新坐标处。 该声明保证每次更新后坐标保持不同。 

第二个操作查看坐标位于给定区间内的所有点`[l, r]`。 在这些点中，我们必须计算每个无序对的距离总和。 

如果选择的坐标是$$y_1 < y_2 < \dots < y_k,$$查询要求$$\sum_{1 \le i < j \le k}(y_j-y_i).$$限制才是真正的挑战。 积分数和查询数均能达到$10^5$。 扫描每个查询的所有点的解决方案大约需要$10^{10}$在最坏的情况下进行操作，这是完全不可行的。 

坐标本身很大，最多$10^9$绝对值，并且更新不断改变它们。 我们无法构建按坐标索引的直接数组。 

当区间包含零或一个点时，会出现一种微妙的情况。 没有对，所以答案一定是零。 

例如：```
Points: 5

Query: [0, 10]
```只选择了一个点，所以答案是：```
0
```另一个容易犯的错误是忘记更新移动的是特定点，而不是坐标值。```
Points: 1 10
Update: move point 1 by +20
```得到的坐标是：```
21 10
```不是```
1 30
```错误的第三个来源是处理查询边界。 如果一个点恰好位于`l`或者恰好在`r`，必须将其包括在内。```
Points: 0 5 10
Query: [0, 10]
```三点都参与。 

答案是：```
(5-0) + (10-0) + (10-5) = 20
```使用严格的不等式会错误地丢弃边界点。 

## 方法

 最直接的解决方案是独立处理每个查询。 对于类型 2 查询，收集坐标位于的所有点`[l, r]`，对它们进行排序，并计算两两距离和。 

这是正确的，因为定义恰好是所有选定对的总和。 

不幸的是，它太慢了。 单个查询可能包含$10^5$点。 Computing answers this way costs$O(n \log n)$每个查询，导致大约$10^{10}$整体运营情况。 

关键的观察是一组有序坐标的答案可以由较小的部分合并。 

假设我们将一个坐标范围分为左半部分和右半部分。 左半部分的每个坐标都小于右半部分的每个坐标。 

对于两组：$$L=\{x\},\qquad R=\{y\},$$交叉贡献是$$\sum (y-x).$$展开这个表达式给出$$|L|\cdot \sum R - |R|\cdot \sum L.$$这仅取决于每一半的点数和坐标之和。 

这表明了线段树。 For every node we store:$$cnt = \text{number of active points}$$

$$sum = \text{sum of their coordinates}$$

$$ans = \text{sum of pairwise distances inside this segment}$$合并两个孩子时：$$cnt = cnt_L + cnt_R$$

$$sum = sum_L + sum_R$$

$$ans = ans_L + ans_R + cnt_L \cdot sum_R - cnt_R \cdot sum_L$$最后一项正是端点位于不同孩子的对的贡献。 

更新变成点删除和插入。 查询变成普通的线段树范围查询。 

坐标很大并且是动态的，因此我们压缩所有可能出现的坐标。 由于每个更新值都是预先知道的，因此我们可以离线模拟序列并收集将存在的每个坐标。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(mn \log n)$|$O(n)$| 太慢了 |
 | 最优线段树+坐标压缩|$O((n+m)\log(n+m))$|$O(n+m)$| 已接受 |

 ## 算法演练

 1. 读取初始坐标。 
2. 在处理所有查询之前将其扫描一次。 
3. Simulate the coordinate changes of every point and collect every coordinate that ever appears.
 4. 对这些坐标进行排序和去重。 这成为坐标压缩数组。 
5. Build a segment tree over the compressed coordinates.
 6. 将每个初始点插入树中。 一叶商店：$$cnt=1,\quad sum=\text{coordinate},\quad ans=0.$$7. 对于类型 1 更新：

 1. 删除该点的旧坐标。 
2. 计算新坐标。 
3. 插入新坐标。 
4. 更新该点的存储位置。 
8. 对于类型 2 查询：

 1.找到第一个不小于的压缩坐标`l`。 
2.找到最后一个不大于压缩的坐标`r`。 
3、查询该线段树范围。 
4.输出返回的`ans`。 
9. 在每次合并期间，计算：$$cross = cnt_L \cdot sum_R - cnt_R \cdot sum_L$$并设置$$ans = ans_L + ans_R + cross.$$这样做的原因是左孩子中的每个坐标都小于右孩子中的每个坐标。 

### 为什么它有效

 每个线段树节点存储重建其区间内的成对距离和所需的确切信息。 

储值`ans`已经包含完全在左孩子内部的所有对以及完全在右孩子内部的所有对。 唯一缺失的对是每个子项都有一个端点的对。 

因为坐标是按线段树排序的，所以每个交叉对都有贡献`right - left`。 对所有这些对求和得出$$cnt_L \cdot sum_R - cnt_R \cdot sum_L.$$因此，在合并过程中，每一对都只计算一次。 通过在线段树节点上的归纳，每个查询都会返回所有选定点之间的正确距离之和。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

class SegTree:
    def __init__(self, coords):
        self.coords = coords
        self.n = len(coords)
        size = 4 * self.n + 5

        self.cnt = [0] * size
        self.sm = [0] * size
        self.ans = [0] * size

    def pull(self, p):
        lc = p * 2
        rc = lc + 1

        cnt_l = self.cnt[lc]
        cnt_r = self.cnt[rc]

        sum_l = self.sm[lc]
        sum_r = self.sm[rc]

        self.cnt[p] = cnt_l + cnt_r
        self.sm[p] = sum_l + sum_r

        cross = cnt_l * sum_r - cnt_r * sum_l
        self.ans[p] = self.ans[lc] + self.ans[rc] + cross

    def update(self, p, l, r, idx, delta):
        if l == r:
            self.cnt[p] += delta
            self.sm[p] += self.coords[idx] * delta
            self.ans[p] = 0
            return

        mid = (l + r) >> 1
        if idx <= mid:
            self.update(p * 2, l, mid, idx, delta)
        else:
            self.update(p * 2 + 1, mid + 1, r, idx, delta)

        self.pull(p)

    def query(self, p, l, r, ql, qr):
        if ql <= l and r <= qr:
            return (self.cnt[p], self.sm[p], self.ans[p])

        mid = (l + r) >> 1

        if qr <= mid:
            return self.query(p * 2, l, mid, ql, qr)

        if ql > mid:
            return self.query(p * 2 + 1, mid + 1, r, ql, qr)

        left = self.query(p * 2, l, mid, ql, qr)
        right = self.query(p * 2 + 1, mid + 1, r, ql, qr)

        cnt_l, sum_l, ans_l = left
        cnt_r, sum_r, ans_r = right

        cross = cnt_l * sum_r - cnt_r * sum_l

        return (
            cnt_l + cnt_r,
            sum_l + sum_r,
            ans_l + ans_r + cross
        )

def solve():
    n = int(input())
    x = list(map(int, input().split()))

    m = int(input())

    queries = []
    coords = x[:]

    cur = x[:]

    for _ in range(m):
        q = list(map(int, input().split()))
        queries.append(q)

        if q[0] == 1:
            p, d = q[1], q[2]
            cur[p - 1] += d
            coords.append(cur[p - 1])

    coords = sorted(set(coords))
    pos = {v: i for i, v in enumerate(coords)}

    seg = SegTree(coords)

    current = x[:]

    for v in current:
        seg.update(1, 0, seg.n - 1, pos[v], 1)

    out = []

    for q in queries:
        if q[0] == 1:
            p, d = q[1], q[2]
            p -= 1

            old = current[p]
            new = old + d

            seg.update(1, 0, seg.n - 1, pos[old], -1)
            seg.update(1, 0, seg.n - 1, pos[new], 1)

            current[p] = new

        else:
            lq, rq = q[1], q[2]

            L = bisect_left(coords, lq)
            R = bisect_right(coords, rq) - 1

            if L > R:
                out.append("0")
                continue

            _, _, ans = seg.query(1, 0, seg.n - 1, L, R)
            out.append(str(ans))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```第一次查询执行坐标压缩。 在构建线段树之前收集可能出现的每个坐标。 

每片叶子对应一个压缩坐标值。 由于坐标始终是不同的，因此叶子包含零个或一个活动点，但即使允许更大的计数，该实现也自然有效。 

合并公式是解决方案的核心。 线段树从不显式枚举对。 相反，它保留足够的聚合信息来重建恒定时间内所有交叉对的总贡献。 

范围查询返回一个三元组`(count, sum, answer)`。 当在查询处理期间合并两个部分结果时，将使用与树本身完全相同的合并公式。 

所有算术必须使用 64 位整数。 在 Python 中，这是自动的。 

## 工作示例

 ### 示例 1```
Points: 0 5 10
Query: [0,10]
```| 细分 | 计数| 总和 | 对距离总和 |
 | ---| ---| ---| ---|
 | {0} | 1 | 0 | 0 |
 | {5} | 1 | 5 | 0 |
 | 合并 | 2 | 5 | 5 |
 | {10} | 1 | 10 | 10 0 |
 | 最终合并| 3 | 15 | 15 20 |

 最终的答案是：$$(5-0)+(10-0)+(10-5)=20.$$该表显示了交叉贡献如何在不枚举对的情况下重新创建距离。 

### 示例 2```
Points: 1 4 8
Update: point 2 += 3
Query: [0,10]
```更新后坐标变为：```
1 7 8
```| 活动坐标 | 计数| 总和 | 回答 |
 | ---| ---| ---| ---|
 | {1} | 1 | 1 | 0 |
 | {7} | 1 | 7 | 0 |
 | 合并 | 2 | 8 | 6 |
 | {8} | 1 | 8 | 0 |
 | 最终合并| 3 | 16 | 16 14 | 14

 答案是：$$(7-1)+(8-1)+(8-7)=14.$$该跟踪表明更新只需要删除一个坐标并插入另一个坐标。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O((n+m)\log(n+m))$| 每次更新和查询都会执行恒定数量的线段树操作 |
 | 空间|$O(n+m)$| 坐标压缩和线段树存储 |

 压缩后的坐标数最多为初始坐标加上每次更新一个新坐标，即$O(n+m)$。 和$10^5$点和$10^5$查询时，对数因子足够小，可以轻松地满足限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    from bisect import bisect_left, bisect_right

    input_data = io.StringIO(inp)
    input = input_data.readline

    # paste solve() body here and return output
    return ""

# minimum size
# one point, one query
# answer must be 0

# assert run("1\n5\n1\n2 0 10\n") == "0"

# interval contains no points
# assert run("2\n0 10\n1\n2 20 30\n") == "0"

# boundary inclusion
# assert run("3\n0 5 10\n1\n2 0 10\n") == "20"

# update then query
# assert run(
# "3\n1 4 8\n2\n1 2 3\n2 0 10\n"
# ) == "14"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单点| 0 | 不存在对 |
 | 空区间 | 0 | 正确的范围处理 |
 | 精确地指向边界 | 20 | 包容性端点 |
 | 更新然后查询 | 14 | 14 移除和插入逻辑 |

 ## 边缘情况

 考虑一个不包含点的查询区间：```
Points: 0 10
Query: [20,30]
```二分搜索会产生一个空的压缩范围。 算法立即返回`0`。 不执行线段树查询。 

考虑一个只包含一个点的区间：```
Points: 5
Query: [0,10]
```查询的段返回`cnt = 1`和`ans = 0`。 由于没有配对，因此结果是正确的。 

考虑边界坐标：```
Points: 0 5 10
Query: [0,10]
```

`bisect_left`和`bisect_right`包括两个端点。 三点全部选择，答案就变成`20`。 

考虑一个点穿过许多其他坐标：```
Points: 1 100
Update: point 1 += 200
```旧坐标从其叶子中删除，新坐标插入到另一个叶子中。 线段树仍然按坐标值排序，因此未来的交叉贡献计算仍然有效。 正确性论证从来不取决于一个点移动的距离。
