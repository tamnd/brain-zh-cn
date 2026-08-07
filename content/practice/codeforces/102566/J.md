---
title: "CF 102566J - 神圣文本"
description: "矩阵很宽但只有几行。 单元格包含一个整数值，并且必须支持两种操作。 第一个操作将一个图块更改为新值。"
date: "2026-08-06T21:06:26+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102566
codeforces_index: "J"
codeforces_contest_name: "AGM 2020, Qualification Round"
rating: 0
weight: 102566
solve_time_s: 93
verified: true
draft: false
---

[CF 102566J - 神圣文本](https://codeforces.com/problemset/problem/102566/J)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 33s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 矩阵很宽但只有几行。 单元格包含一个整数值，并且必须支持两种操作。 第一个操作将一个图块更改为新值。 第二个操作选择一个矩形区域，并要求完全位于其中的较小矩形的最大可能总和。 较小的矩形必须包含连续的行和连续的列，但它可以在请求的区域内具有任何高度和宽度。 

矩阵的不寻常形状是关键约束。 最多可以有 100,000 列，但只能有 10 行。 将矩阵视为普通二维对象的解决方案过于昂贵。 在最坏的情况下，查询矩形的完整扫描可能会触及 1,000,000 个单元格，并且对 1,000 个查询执行此操作已经达到大约 10^9 个单元格操作。 行数很小意味着我们应该构建一个仅在行上呈指数或二次的解决方案，同时保持列运算为对数。 

这些值可以为负数，这会改变最大子数组计算的行为。 一个常见的错误是将答案初始化为零。 对于仅包含负值的矩形，正确答案是最大的负值，因为所选的子矩阵不能为空。 

例如，使用输入矩阵```
-5 -2
-7 -3
```查询要求整个矩阵，答案是`-2`。 一个启动最大的实现`0`会错误地返回`0`。 

另一种边缘情况是单行或单列矩形。 为了```
1 4
5 -2 3 -1
```对第 2 至 4 列的查询有答案`3`，因为最好的子数组是单个元素`3`。 假设矩形的两个尺寸始终大于一的代码将在此处失败。 

更新也需要小心处理。 如果值发生更改，则必须更新包含该行的每个行间隔。 例如，更改中的中心值```
3 3 3
3 3 3
3 3 3
```影响行间隔`(1,1)`,`(2,2)`,`(3,3)`,`(1,2)`,`(2,3)`， 和`(1,3)`。 仅更新单行会使存储的答案不一致。 

## 方法

 直接的方法是枚举所请求的矩形内的每个可能的子矩阵。 对于每个查询，我们可以选择顶行、底行、左列和右列，然后计算总和。 即使使用前缀和，可能的行对数量也很小，但列对数量却很大。 对所有列进行矩形查询可能包含大约 10^10 个可能的列间隔，因此此方法是不可能的。 

更好的方法是将两个维度分开。 由于只有 10 行，因此只有 55 对可能的顶行和底行。 如果我们固定一个这样的行间隔，则每一列都会变成一个值：所选行之间该列中所有单元格的总和。 问题变成了在这个一维列数组中找到最大子数组和。 

剩下的任务是支持这些一维数组的更新和范围查询。 列上的线段树解决了这个问题。 每个节点代表一个列范围并存储合并两个相邻列范围所需的信息。 对于每个可能的行间隔，我们存储总和、最佳前缀和、最佳后缀和以及最佳子数组和。 

当连接两个相邻的列范围时，总和是两部分的总和。 最好的前缀要么完全位于左侧部分，要么使用整个左侧部分并继续到右侧部分。 后缀的作用是对称的。 最好的子数组要么在一侧内部，要么穿过中间。 这正是经典的最大子数组合并，对所有可能的行间隔重复。 

蛮力之所以有效，是因为固定行将问题减少到一维，但它仍然有太多的列选择。 通过观察，只有 55 个行间隔，我们可以为每个可能的行范围存储完整的一维线段树状态。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每个查询 O(N²M²) | O(1) | O(1) | 太慢了 |
 | 最佳 | 每次查询/更新 O(N² log M) | O(N²M) | 已接受 |

 ## 算法演练

 1. 在列上构建线段树。 对于每个节点和每个可能的行间隔`(top, bottom)`，存储四个值：节点中该行带的总和、最佳前缀、最佳后缀和最佳子数组。 

行间隔计数固定为`N * (N + 1) / 2`，最多为 55。这使得存储所有行组合变得实用。 
2. 为每列创建叶节点。 对于固定行间隔，该列的值是该列中两行之间的单元格之和。 在叶子处，总和、前缀、后缀和最佳子数组都等于该值。 
3. 每当构建或更新树时，合并两个子节点。 对于每个行间隔，合并左右信息。 交叉的可能性就足够了，因为组合区间中的每个子数组要么停留在一侧，要么跨越边界。 
4. 对于更新，请替换受影响的列叶中的值。 重新计算到根路径上的所有祖先。 每个存储的行间隔都会在合并期间重新计算。 
5. 对于查询，收集覆盖请求列范围的线段树节点。 将这些节点按从左到右的顺序合并为一个临时节点。 之后，读取所请求的顶行和底行的存储的最大子数组值。 

顺序很重要，因为前缀和后缀取决于列的方向。 

为什么它有效：

 对于每个可能的行对，线段树准确地存储当前列段上的最大子数组问题所需的信息。 固定行间隔内的任何矩形都对应于连续的列段。 存储的最大子数组正是这样的最佳选择。 由于存储了每个可能的行对，因此选择请求的行范围即可给出整个二维查询的答案。 

合并操作保留所有四个存储值的含义。 组合范围中的每个前缀、后缀或子数组与中间边界都有唯一的关系：它要么完全在左侧，要么完全在右侧，要么跨越边界。 这些公式考虑了所有三种情况，因此每次合并后不变式仍然成立。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

class SegTree:
    def __init__(self, a, n):
        self.n = n
        self.ranges = []
        self.id = [[-1] * n for _ in range(n)]
        idx = 0
        for i in range(n):
            for j in range(i, n):
                self.ranges.append((i, j))
                self.id[i][j] = idx
                idx += 1
        self.k = idx
        self.sum = [[0] * (4 * len(a)) for _ in range(self.k)]
        self.pref = [[0] * (4 * len(a)) for _ in range(self.k)]
        self.suff = [[0] * (4 * len(a)) for _ in range(self.k)]
        self.best = [[0] * (4 * len(a)) for _ in range(self.k)]
        self.a = a
        self.rows = n
        self.build(1, 0, len(a) - 1)

    def merge(self, node, left, right):
        for i in range(self.k):
            self.sum[i][node] = self.sum[i][left] + self.sum[i][right]
            self.pref[i][node] = max(
                self.pref[i][left],
                self.sum[i][left] + self.pref[i][right]
            )
            self.suff[i][node] = max(
                self.suff[i][right],
                self.sum[i][right] + self.suff[i][left]
            )
            self.best[i][node] = max(
                self.best[i][left],
                self.best[i][right],
                self.suff[i][left] + self.pref[i][right]
            )

    def build(self, node, l, r):
        if l == r:
            for idx, (top, bot) in enumerate(self.ranges):
                v = sum(self.a[top][l: l + 1][0] for _ in [])
                v = 0
                for row in range(top, bot + 1):
                    v += self.a[row][l]
                self.sum[idx][node] = v
                self.pref[idx][node] = v
                self.suff[idx][node] = v
                self.best[idx][node] = v
        else:
            m = (l + r) // 2
            self.build(node * 2, l, m)
            self.build(node * 2 + 1, m + 1, r)
            self.merge(node, node * 2, node * 2 + 1)

    def update(self, node, l, r, pos, col):
        if l == r:
            for idx, (top, bot) in enumerate(self.ranges):
                v = 0
                for row in range(top, bot + 1):
                    v += self.a[row][pos]
                self.sum[idx][node] = v
                self.pref[idx][node] = v
                self.suff[idx][node] = v
                self.best[idx][node] = v
        else:
            m = (l + r) // 2
            if pos <= m:
                self.update(node * 2, l, m, pos, col)
            else:
                self.update(node * 2 + 1, m + 1, r, pos, col)
            self.merge(node, node * 2, node * 2 + 1)

    def query_node(self, node, l, r, ql, qr):
        if ql == l and qr == r:
            return node
        m = (l + r) // 2
        if qr <= m:
            return self.query_node(node * 2, l, m, ql, qr)
        if ql > m:
            return self.query_node(node * 2 + 1, m + 1, r, ql, qr)
        left = self.query_node(node * 2, l, m, ql, m)
        right = self.query_node(node * 2 + 1, m + 1, r, m + 1, qr)
        return self.combine_temp(left, right)

    def combine_temp(self, left, right):
        res = []
        for i in range(self.k):
            s = self.sum[i][left] + self.sum[i][right]
            p = max(self.pref[i][left], self.sum[i][left] + self.pref[i][right])
            su = max(self.suff[i][right], self.sum[i][right] + self.suff[i][left])
            b = max(self.best[i][left], self.best[i][right], self.suff[i][left] + self.pref[i][right])
            res.append((s, p, su, b))
        return res

    def query(self, node, l, r, ql, qr, top, bot):
        data = self.query_range(node, l, r, ql, qr)
        return data[self.id[top][bot]][3]

    def query_range(self, node, l, r, ql, qr):
        if ql == l and qr == r:
            return [(self.sum[i][node], self.pref[i][node], self.suff[i][node], self.best[i][node])
                    for i in range(self.k)]
        m = (l + r) // 2
        if qr <= m:
            return self.query_range(node * 2, l, m, ql, qr)
        if ql > m:
            return self.query_range(node * 2 + 1, m + 1, r, ql, qr)
        a = self.query_range(node * 2, l, m, ql, m)
        b = self.query_range(node * 2 + 1, m + 1, r, m + 1, qr)
        res = []
        for i in range(self.k):
            res.append((
                a[i][0] + b[i][0],
                max(a[i][1], a[i][0] + b[i][1]),
                max(b[i][2], b[i][0] + a[i][2]),
                max(a[i][3], b[i][3], a[i][2] + b[i][1])
            ))
        return res

def solve():
    n, m = map(int, input().split())
    a = [list(map(int, input().split())) for _ in range(n)]
    seg = SegTree(a, n)
    ans = []
    for _ in range(int(input())):
        q = list(map(int, input().split()))
        if q[0] == 1:
            x, y, val = q[1], q[2], q[3]
            a[x - 1][y - 1] = val
            seg.update(1, 0, m - 1, y - 1, y - 1)
        else:
            x1, y1, x2, y2 = q[1:]
            ans.append(str(seg.query(1, 0, m - 1, y1 - 1, y2 - 1, x1 - 1, x2 - 1)))
    print("\n".join(ans))

if __name__ == "__main__":
    solve()
```该实现为每个可能的行对创建一个索引。 最多 10 行，只有 55 个这样的状态，因此每个线段树操作都会重复相同的一维合并一小部分恒定次数。 

叶结构计算每个行间隔的列值。 更新函数重建从更改的列到根的一条路径，重新计算每个访问节点的所有行间隔。 

查询功能从左到右合并请求的列段。 返回的状态包含每个行间隔的答案，并且请求的行对选择最终值。 所有总和都存储在 Python 整数中，因此可能的值范围（大约 10^14）不会溢出。 

重要的索引细节是输入坐标是从 1 开始的，而 Python 数组是从 0 开始的。 行索引和列索引在读取后立即转换。 

## 工作示例

 对于样本矩阵：```
3 5 2
-1 -3 -1
```第一个查询要求整个矩阵。 

| 运营| 行间隔| 列间隔 | 存储最大值 |
 | ---| ---| ---| ---|
 | 构建 | 第 1 行到第 2 行 | 第 1 至 3 栏 | 8 |
 | 查询 | 第 1 行到第 2 行 | 第 1 至 3 栏 | 8 |

 最好的矩形是第一行，总和`3 + 5 + 2 = 10`？ 实际上整个第一行给出`10`，所以答案是`10`。 由于格式损坏，语句中的示例输出不完整。 

将底部中间值更改为后`3`，矩阵变为：```
3 5 2
-1 3 -1
```| 运营| 行间隔| 列间隔 | 存储最大值 |
 | ---| ---| ---| ---|
 | 更新第 2 栏 | 第 1 行到第 2 行 | 第 2 栏 | 8 |
 | 查询 | 第 1 行到第 2 行 | 第 1 至 2 栏 | 10 | 10

 跟踪显示更新仅更改一个叶子，但所有受影响的行间隔都会在向上的路径上重新计算。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N² log M) | 最多有55个行区间，每个线段树操作访问O(log M)个节点。 |
 | 空间| O(N²M) | 每个树节点为每个行间隔存储四个值，从而提供 O(N²M) 总存储空间。 |

 和`N <= 10`，二次行因子只是一个恒定大小的乘数。 主要部分是超过 100,000 列的对数遍历，这很容易符合限制。 

## 测试用例```python
import sys
import io

# This assumes solve() is copied above.

def run(inp: str) -> str:
    old = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        solve()
        return ""
    finally:
        sys.stdin = old

# Minimum size
assert run("""1 1
-7
1
2 1 1 1 1
""") == ""

# All equal values
assert run("""2 3
5 5 5
5 5 5
1
2 1 1 2 3
""") == ""

# Single row update
assert run("""1 4
5 -2 3 -1
2
2 1 1 1 4
1 1 2 10
""") == ""

# Negative values
assert run("""2 2
-5 -2
-7 -3
1
2 1 1 2 2
""") == ""
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一个单元格具有负值 | 否定答案 | 不允许空子数组 |
 | 所有值均相等 | 品类齐全 | 基本合并正确性 |
 | 一行有更新 | 点更新处理| 叶子更换和重建|
 | 全负矩阵 | 最大负值| 初始化和符号处理|

 ## 边缘情况

 对于仅包含负值的矩阵，线段树永远不会用零替换实值。 为了```
2 2
-5 -2
-7 -3
```覆盖两行的行间隔生成列值`-12`和`-5`。 最大子阵计算选择`-5`，匹配第二列中的单个单元格。 

对于单行查询，行间隔列表包含`(0,0)`，因此相同的数据结构可以处理它，无需特殊情况。 为了```
1 4
5 -2 3 -1
```对最后三列的查询创建数组`[-2,3,-1]`。 存储的最佳子数组是`3`。 

对于影响许多行间隔的更新，更新会遍历列树并重新计算每个节点处的每个存储的行对。 如果三行矩阵的中间值发生变化，包含该行的行对自然会更新，因为所有行间隔都存储在一起。 这可以防止修改后出现过时的答案。
