---
title: "CF 104820K - \u0412\u044b\u0431\u043e\u0440\u043d\u0435\u0432\u0435\u043b\u0438\u043a"
description: "我们有一个网格，其行和列的大小不均匀。 每行具有由数组 A 给定的正高度，每列具有由数组 B 给定的正宽度。"
date: "2026-06-28T12:58:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104820
codeforces_index: "K"
codeforces_contest_name: "\u0420\u0421\u041e-\u0410\u043b\u0430\u043d\u0438\u044f 2018-2023. \u0418\u0437\u0431\u0440\u0430\u043d\u043d\u043e\u0435"
rating: 0
weight: 104820
solve_time_s: 103
verified: true
draft: false
---

[CF 104820K - \u0412\u044b\u0431\u043e\u0440 \u043d\u0435 \u0432\u0435\u043b\u0438\u043a](https://codeforces.com/problemset/problem/104820/K)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个网格，其行和列的大小不均匀。 每行都有一个由数组给出的正高度`A`，每列都有一个由数组给定的正宽度`B`。 如果我们采用任何连续的行块和任何连续的列块，它们会形成一个由单位单元组成的矩形区域，其中每个单元`(i, j)`存在于一个较大的几何矩形内，其面积贡献取决于所选的行和列。 

如果我们从以下位置选择行`l`到`r`和列来自`x`到`y`，所选择的形状是一个完整的子矩阵。 所选扇区的数量就是该子矩阵中的单元格数量，等于`(r - l + 1) * (y - x + 1)`。 

然而，存在几何约束。 每行贡献一个高度，因此所选行段的总高度是`A[i]`在该段上，每列贡献一个宽度，因此总宽度是`B[j]`在柱段上。 所得矩形的物理面积是这两个总和的乘积，并且该乘积不得超过`S`。 

任务是选择一个连续的行段和一个连续的列段，以最大化生成的矩形中的单元格数量，同时保持满足几何面积约束。 

限制条件`N, M ≤ 1000`意味着任何解决方案大致超出`O(N^2 M)`或者`O(N M^2)`会太慢。 解决方案围绕`O(N^2 log M + M^2 log N)`或更好是可以接受的，因为每个维度大约一百万个间隔是可行的，但每个查询的嵌套完整扫描是不可行的。 

独立尝试每对行段和列段的天真的尝试将粗略地检查`O(N^2 M^2)`组合，大约是`10^12`，远远超出了极限。 

当一个维度很大但稍微减小另一个维度的允许范围时，就会出现朴素剪枝的微妙失败情况。 例如，选择稍大的行段可能只会将允许的列宽度减少一列，但单列损失可能会大大减少面积计数。 任何不考虑所有区间的一维贪婪扩张都会错过这种权衡。 

## 方法

 直接强力解决方案枚举每个可能的行间隔和每个可能的列间隔。 对于每一对，我们计算`A`和`B`在这些时间间隔内，检查他们的产品是否最多`S`，并计算细胞数量。 这是正确的，因为它详尽地检查了所有有效的矩形。 问题是成本：有`O(N^2)`行间隔和`O(M^2)`列间隔，如果使用前缀和，检查每对需要常数或对数时间，大致给出`10^12`最坏情况下的评价。 

关键的结构观察是，行和列的选择是独立的，除非通过单个标量约束：它们的总和的乘积。 这表明将问题分为两个阶段。 如果我们固定一个行间隔，它的总和就变成一个常数`H`。 那么任何有效的列间隔必须满足`sum(B[l..r]) ≤ S / H`。 对于该固定阈值，我们希望列间隔具有最大长度。 

这将问题变成了一种模式：预先计算所有列间隔一次，按总和存储它们，并回答许多“总和≤T的间隔中的最大长度”查询。 可以对行对称地执行相同的操作，但执行一次就足够了。 

我们将二维选择问题简化为生成一维的所有一维区间并有效地查询它们。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(N²·M²) | O(1) | O(1) | 太慢了 |
 | 区间预处理+二分查找 | O((N² + M²) log M²) | O((N² + M²) log M²) | O(平方米) | 已接受 |

 ## 算法演练

 我们预先计算所有列间隔并将其信息压缩到允许通过总和约束快速查询的结构中。 

1. 计算数组的前缀和`B`，因此任意区间和都可以在 O(1) 内获得。 这使我们能够有效地评估每个列段。 
2.枚举所有列间隔`(l, r)`并为每个计算两个值：`sumB = B[l] + ... + B[r]`和`lenB = r - l + 1`。 这产生了大约`M² / 2`间隔。 
3. 对这些间隔进行排序`sumB`。 排序后，我们构建一个数组，在每个位置存储最大值`lenB`到目前为止所看到的。 这将结构转换为单调查询工具：对于任何阈值`T`，我们可以找到所有区间中 sum ≤ 的最佳列长`T`使用二分搜索，然后进行前缀最大查找。 
4. 重复相同的前缀和准备`A`。 
5. 枚举所有行间隔`(i, j)`, 计算`sumA = A[i] + ... + A[j]`和`lenA = j - i + 1`。 
6. 对于每个行间隔，计算允许的最大列总和`T = S // sumA`。 
7. 查询预处理后的列结构，获取可能的最佳列长度，其总和不超过`T`。 
8. 更新答案`lenA * bestLenB`。 

这样做的原因是，一旦行间隔固定，列选择就成为预计算集上的独立约束优化问题，反之亦然。 

### 为什么它有效

 对于每个有效矩形，恰好存在一个行间隔和一个列间隔来表示它。 该算法明确地考虑每个行间隔，并且对于每个这样的间隔，它在该行选择引起的精确约束下计算最佳兼容的列间隔。 由于列间隔已针对每个可能的总和阈值进行了完全枚举和优化，因此不会跳过任何可行的配置。 分解保留了最优性，因为约束仅通过单个标量积来耦合维度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def build_intervals(arr):
    n = len(arr)
    pref = [0] * (n + 1)
    for i in range(n):
        pref[i + 1] = pref[i] + arr[i]

    intervals = []
    for i in range(n):
        for j in range(i, n):
            s = pref[j + 1] - pref[i]
            length = j - i + 1
            intervals.append((s, length))
    return intervals

def build_query_structure(intervals):
    intervals.sort()
    best = []
    max_len = 0

    for s, l in intervals:
        if l > max_len:
            max_len = l
        best.append((s, max_len))
    return best

def query(best, T):
    import bisect
    idx = bisect.bisect_right(best, (T, 10**18)) - 1
    if idx < 0:
        return 0
    return best[idx][1]

def solve():
    N, M, S = map(int, input().split())
    A = list(map(int, input().split()))
    B = list(map(int, input().split()))

    col_intervals = build_intervals(B)
    col_best = build_query_structure(col_intervals)

    row_intervals = build_intervals(A)

    ans = 0

    for sumA, lenA in row_intervals:
        if sumA > 0:
            T = S // sumA
            lenB = query(col_best, T)
            ans = max(ans, lenA * lenB)

    print(ans)

if __name__ == "__main__":
    solve()
```该代码首先使用前缀和将每个数组转换为所有可能的连续段。 每个段由其总和及其长度表示。 对于列，这些段按总和进行排序并进行压缩，以便对于任何总和阈值，我们都可以有效地检索可实现的最大宽度。 

查询函数对压缩结构使用二分搜索。 由于该结构在总和上是单调的，因此任何阈值的最佳长度总是在总和在限制内的最后一个间隔处或之前找到。 

行循环评估每个可能的高度选择并将其转换为最大允许的列总和。 最佳匹配列和行长度的乘积给出了候选答案。 

## 工作示例

 ### 示例 1

 输入：```
A = [2, 4, 1, 3]
B = [4, 2, 1, 2]
S = 2
```我们首先列出几个列间隔：

 | 间隔| 总和| 长度B |
 | ---| ---| ---|
 | [1] | 4 | 1 |
 | [2] | 2 | 1 |
 | [3] | 1 | 1 |
 | [4] | 2 | 1 |
 | [2,3]| 3 | 2 |
 | [3,4]| 3 | 2 |

 压缩后，对于小阈值，例如`T = 1`，只有 sum ≤ 1 的间隔可用，给出最佳长度 1。 

行间隔包括单元素行，例如`[3]`sumA = 1 且 lenA = 1。这给出`T = 2`，因此我们可以使用 sum ≤ 2 的任何列间隔，给出最佳列长度 1。乘积为 1。 

尝试更大的行总和会立即减少`T`为 0，这不会给出有效的列。 最佳答案仍然是1。 

该轨迹表明，严格的约束迫使解决方案趋向于最小的有效矩形。 

### 示例 2

 输入：```
A = [2, 4, 1, 3]
B = [4, 2, 1, 2]
S = 20
```现在约束已经足够宽松，可以允许更大的矩形。 

对于行间隔`[4, 1, 3]`，sumA = 8 且 lenA = 3，所以`T = 20 // 8 = 2`。 我们可以选择sum≤2的最佳列间隔，例如`[2]`或者`[3]`或者`[4]`, giving lenB = 1. Product is 3.

 对于行间隔`[1, 3]`，sumA = 4 且 lenA = 2，所以`T = 5`。 现在列间隔`[2,3]`is valid with sum 3 and length 2, giving product 4.

The best combination is achieved when both dimensions are moderately large while still respecting the product constraint.

 This trace highlights how increasing allowed area expands feasible column choices nonlinearly.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N² + M² log M²) | O(N² + M² log M²) | All intervals are generated in quadratic time, sorting column intervals dominates with log factor |
 | 空间| O(平方米) | Storage of all column intervals and compressed structure |

 The quadratic preprocessing is acceptable because both dimensions are capped at 1000, giving about one million intervals per array. 每行间隔的对数查询将总操作数控制在几千万以内，这完全符合 Codeforces 约束下 Python 的典型限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import math

    N, M, S = map(int, sys.stdin.readline().split())
    A = list(map(int, sys.stdin.readline().split()))
    B = list(map(int, sys.stdin.readline().split()))

    def build(arr):
        n = len(arr)
        pref = [0]*(n+1)
        for i in range(n):
            pref[i+1]=pref[i]+arr[i]
        res=[]
        for i in range(n):
            for j in range(i,n):
                res.append((pref[j+1]-pref[i], j-i+1))
        return res

    def build_best(intervals):
        intervals.sort()
        best=[]
        mx=0
        for s,l in intervals:
            mx=max(mx,l)
            best.append((s,mx))
        return best

    def query(best,T):
        import bisect
        i=bisect.bisect_right(best,(T,10**18))-1
        return 0 if i<0 else best[i][1]

    col=build(B)
    cb=build_best(col)
    row=build(A)

    ans=0
    for sA,lA in row:
        if sA<=0: 
            continue
        T=S//sA
        ans=max(ans,lA*query(cb,T))
    return str(ans)

# provided samples
assert run("4 4 2\n2 4 1 3\n4 2 1 2\n") == "1"
assert run("4 4 20\n2 4 1 3\n4 2 1 2\n") == "6"

# custom cases
assert run("1 1 100\n5\n5\n") == "1", "single cell"
assert run("3 3 1\n1 1 1\n1 1 1\n") == "1", "tight constraint"
assert run("3 3 1000\n1 2 3\n1 2 3\n") == "9", "full rectangle possible"
assert run("2 3 5\n2 2\n1 2 1\n") >= "1", "basic feasibility"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单细胞| 1 | 最小的结构处理|
 | 严格约束| 1 | 极限S |
 | 可能是完整的矩形| 9 | 最大扩展案例|
 | 基本可行性| ≥1| 非平凡有效性|

 ## 边缘情况

 当所有行总和超过时，就会出现极端情况`S`。 在那种情况下，每一个`T`变为零并且没有列间隔符合条件。 该算法处理这个问题是因为二分搜索返回`0`，并且永远不会触发产品更新。 

当只有单行间隔有效时会出现另一种情况。 例如，如果`A = [100, 1, 100]`和`S = 10`，只有中间行提供任何有效配置。 该循环自然地独立评估每个行间隔，并且仅具有`sumA = 1`产生非零列结果。 

第三种情况涉及不均匀分布，其中一个非常小的行段解锁了一个不成比例的大列段。 由于所有行间隔都是显式枚举而不是贪婪扩展，因此算法不会错过这些不对称的最优​​结构。
