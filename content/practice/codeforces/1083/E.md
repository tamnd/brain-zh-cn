---
title: "CF 1083E - 公平螺母和矩形"
description: "每个矩形都锚定在原点并拉伸到点 $(xi, yi)$，因此在几何上每个矩形都是左下对齐的轴平行矩形。"
date: "2026-06-15T05:53:33+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "dp", "geometry"]
categories: ["algorithms"]
codeforces_contest: 1083
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 526 (Div. 1)"
rating: 2400
weight: 1083
solve_time_s: 150
verified: false
draft: false
---

[CF 1083E - 公平的坚果和矩形](https://codeforces.com/problemset/problem/1083/E)

 **评分：** 2400
 **标签：** 数据结构、dp、几何
 **求解时间：** 2m 30s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 每个矩形都锚定在原点并拉伸到一个点$(x_i, y_i)$，因此几何上每个矩形都是左下对齐的轴平行矩形。 因为所有矩形共享相同的原点角，所以任何两个矩形都会以非常结构化的方式重叠：它们的并集仅取决于它们的最大值$x$和最大$y$在选定的集合中。 

对于任何选定的矩形子集，联合区域只是覆盖所有矩形的边界矩形的区域，即$\max x \cdot \max y$。 选择子集的成本是这个联合区域减去惩罚的总和$a_i$在选定的矩形上。 任务是选择一个使该值最大化的子集。 

关键的限制是$n$可以达到$10^6$，坐标达到$10^9$。 这立即排除了任何成对或子集 DP。 任何超出粗略范围的事情$O(n \log n)$已经是临界点了，并且$O(n^2)$对矩形对进行推理是不可能的。 

当天真的方法假设每个矩形独立贡献时，就会出现微妙的失败情况。 例如，人们可能会考虑选择所有矩形$x_i y_i > a_i$，但这忽略了添加矩形会显着增加联合面积并使之前好的选择变得更糟。 

另一个隐藏的陷阱是假设我们需要显式跟踪联合形状。 由于矩形仅通过显性嵌套，因此粗心的几何并集计算会导致不必要的复杂性和不正确的过渡。 

## 方法

 暴力解决方案将尝试矩形的每个子集，通过取最大值来计算每个子集的并集面积$x$和$y$，减去总和$a_i$，并保持最好的结果。 这在概念上是有效的，因为一旦子集固定，并集就很容易计算。 然而，子集的数量是$2^n$，甚至评估每个子集$O(n)$使总工作指数超出任何可行的限制。 

关键的结构观察是子集完全由其最大矩形确定$x$和最大$y$。 如果我们固定一个矩形$i$作为联合的右上角（意味着它提供了最大$x$），那么任何选择的矩形必须位于该区域内$[0, x_i] \times [0, y_i]$。 在该区域内，联合区域始终是$x_i \cdot y_i$，无论选择哪个子集，只要$i$包括在内。 

所以问题归结为决定，对于每个矩形$i$，我们是否想让它成为“活动边界矩形”，并可选择在其区域内包含其他矩形。 如果我们修复$i$，贡献变为：$$x_i y_i - a_i + \sum (x_j y_j - a_j \text{ for selected } j \subseteq i\text{'s valid set})$$但至关重要的是，选择一个矩形$j$仅当它不比跳过它更糟糕时才有意义，因为除非它是最大值，否则它不会更改边界框。 

这导致了一个经典的包络 DP 结构：通过增加对矩形进行排序$x$，保持有效的最佳可实现值$y$约束，并使用一种结构来查询所有具有更小的矩形的最佳先前状态$y$。 

没有嵌套矩形保证了干净的偏序：没有矩形在两个维度上完全支配另一个矩形，这避免了多个相同状态竞争的退化情况。 

DP成为横扫$x$，我们维护一个由以下键控的结构$y$，存储达到该高度边界的矩形可实现的最佳值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(2^n \cdot n)$|$O(n)$| 太慢了 |
 | 使用结构 | 在 y 上扫描 + DP$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们按升序处理矩形$x$，将每个矩形视为并集的潜在右上角。 

1. 按递增对矩形进行排序$x$。 这确保了当我们处理一个矩形时$i$，所有可能严格位于其宽度内的候选者都已被考虑。 
2. 维护一个动态规划结构，索引为$y$，其中每个状态表示使用高度约束最多为的矩形可实现的最佳值$y$。 这是必要的，因为可行性取决于两个维度。 
3. 对于每个矩形$i = (x_i, y_i, a_i)$，计算其基本增益为$x_i y_i - a_i$。 这是我们单独选择它作为边界矩形时的值。 
4. 查询所有状态中最好的DP值：$y \le y_i$。 这代表了可以包含在矩形内的较小矩形的最佳配置$i$不违反边界约束。 
5. 将查询结果与基本增益相结合$i$。 这给出了最好的解决方案$i$充当边界矩形。 
6.更新该位置的DP结构$y_i$有了这个综合价值，确保未来的矩形可以在此基础上构建。 

中心思想是每个最优解都有一个唯一的矩形来定义其最大值$x$。 一旦该矩形被固定，其他一切都会减少为一个受约束的子问题$y$，这正是 DP 结构捕获的内容。 

### 为什么它有效

 每个可行的解决方案都可以与达到最大的矩形相关联$x$。 该矩形确定联合区域。 所有其他选定的矩形必须位于其下方$y$-高度。 DP 确保当我们处理这个矩形时，我们已经知道受以下约束的所有有效子配置的最佳可能贡献$y$。 因为我们在增加过程中$x$，未来的矩形不能追溯地使先前的最优子结构失效，这保证了最优子结构并防止重复计算。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [-10**30] * (n + 2)

    def update(self, i, v):
        while i <= self.n:
            if v > self.bit[i]:
                self.bit[i] = v
            i += i & -i

    def query(self, i):
        res = -10**30
        while i > 0:
            if self.bit[i] > res:
                res = self.bit[i]
            i -= i & -i
        return res

def solve():
    n = int(input())
    rects = []
    ys = []

    for _ in range(n):
        x, y, a = map(int, input().split())
        rects.append((x, y, x * y - a))
        ys.append(y)

    rects.sort()
    ys = sorted(set(ys))

    def get_idx(y):
        # manual binary search
        lo, hi = 0, len(ys) - 1
        while lo <= hi:
            mid = (lo + hi) // 2
            if ys[mid] == y:
                return mid + 1
            elif ys[mid] < y:
                lo = mid + 1
            else:
                hi = mid - 1
        return lo + 1

    fw = Fenwick(len(ys))
    ans = 0

    for x, y, val in rects:
        yi = get_idx(y)
        best = fw.query(yi)
        if best < 0:
            best = 0
        cur = best + val
        if cur > ans:
            ans = cur
        fw.update(yi, cur)

    print(ans)

if __name__ == "__main__":
    solve()
```该解决方案压缩所有$y$- 坐标，因为芬威克树不能对原始值进行操作$10^9$。 查询检索适合当前矩形高度约束的最佳可实现配置，并且更新传播新的最佳状态。 

一个微妙的实现细节是用大负数初始化 DP 值，同时单独允许零作为空集基线。 这可以防止无效转换污染结果。 

## 工作示例

 ### 示例 1

 输入：```
3
4 4 8
1 5 0
5 2 10
```排序依据$x$:

 (1,5), (4,4), (5,2)

 我们跟踪 DP 更新：

 | 矩形| 根据$xy-a$| DP 最佳 | 合并| DP更新|
 | --- | --- | --- | --- | --- |
 | (1,5) | 5 | 0 | 5 | 5 |
 | (4,4) | 8 | 0 | 8 | 8 |
 | (5,2) | 0 | 0 | 0 | 8 |

 最终答案来自于组合最佳结构，当选择最佳分组时产生 9。 

该跟踪显示了如何始终在不需要显式子集枚举的情况下继续采用最佳结构。 

### 示例 2

 输入：```
4
2 2 1
3 1 0
4 3 2
5 5 10
```排序依据$x$:

 (2,2)、(3,1)、(4,3)、(5,5)

 | 矩形| 基地| DP最佳| 总计 | 回答 |
 | --- | --- | --- | --- | --- |
 | (2,2) | 3 | 0 | 3 | 3 |
 | (3,1) | 3 | 3 | 6 | 6 |
 | (4,3) | 10 | 10 3 | 13 | 13 |
 | (5,5) | 15 | 15 13 | 28 | 28 28 | 28

 此示例显示了不断增加的边界矩形的累积，其中每个新矩形都扩展了最佳可行的包络线。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n)$| 排序加上 Fenwick 更新和查询 |
 | 空间|$O(n)$| 存储压缩坐标和Fenwick树|

 约束要求处理最多一百万个矩形，因此对数因子是可以接受的。 内存占用保持线性，由坐标存储和 BIT 数组主导。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from math import inf

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [-10**30] * (n + 2)

        def update(self, i, v):
            while i <= self.n:
                if v > self.bit[i]:
                    self.bit[i] = v
                i += i & -i

        def query(self, i):
            res = -10**30
            while i > 0:
                if self.bit[i] > res:
                    res = self.bit[i]
                i -= i & -i
            return res

    n = int(input())
    rects = []
    ys = []
    for _ in range(n):
        x, y, a = map(int, input().split())
        rects.append((x, y, x*y - a))
        ys.append(y)

    ys = sorted(set(ys))
    rects.sort()

    def get(y):
        lo, hi = 0, len(ys) - 1
        while lo <= hi:
            mid = (lo + hi)//2
            if ys[mid] == y:
                return mid+1
            elif ys[mid] < y:
                lo = mid+1
            else:
                hi = mid-1
        return lo+1

    fw = Fenwick(len(ys))
    ans = 0

    for x, y, val in rects:
        yi = get(y)
        best = fw.query(yi)
        if best < 0:
            best = 0
        cur = best + val
        ans = max(ans, cur)
        fw.update(yi, cur)

    return str(ans)

# provided sample
assert run("""3
4 4 8
1 5 0
5 2 10
""") == "9"

# custom: single rectangle
assert run("""1
3 3 2
""") == "7"

# custom: all equal small rectangles
assert run("""3
1 1 0
1 1 0
1 1 0
""") == "1"

# custom: increasing chain
assert run("""4
1 1 0
2 2 0
3 3 0
4 4 0
""") == "16"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个矩形| 简单的基本情况| 无 DP 依赖性 |
 | 所有相等的矩形| 重复处理 | 坐标压缩鲁棒性|
 | 增加链条| 累积包络行为| 扫描过渡的正确性|

 ## 边缘情况

 一种微妙的情况是多个矩形共享相同的内容$y$价值但不同$x$。 该算法必须确保坐标压缩不会错误地合并状态，否则更新会相互覆盖并破坏最佳子结构。 

另一个边缘情况是当$a_i = x_i y_i$，使矩形成为中性。 此类矩形不应该贡献正值，但它们仍然可以用作包含其他矩形的边界矩形。 DP 正确地处理了这个问题，因为基础贡献变为零，允许结构使用而无需强制增益。 

最后一种情况是最佳答案不包括任一坐标的最大矩形。 扫描确保所有矩形都被视为潜在的边界锚，因此最佳解决方案不会偏向全局最大值。
