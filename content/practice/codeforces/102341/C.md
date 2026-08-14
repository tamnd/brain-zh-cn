---
title: "CF 102341C - 克莱斯特"
description: "我们有一个（n×n）网格，每个单元格都包含一个不同的整数，代表那里的 Cloyster 的外壳大小。 具有最大值的单元格是领导者。 我们无法检查整个网格，因为只有当我们显式查询单元格时才会显示值。"
date: "2026-08-14T05:12:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102341
codeforces_index: "C"
codeforces_contest_name: "Radewoosh+mnbvmar Contest (supported by AIM Tech)"
rating: 0
weight: 102341
solve_time_s: 99
verified: true
draft: false
---

[CF 102341C - Cloyster](https://codeforces.com/problemset/problem/102341/C)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 39s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个 (n \times n) 网格，每个单元格都包含一个不同的整数，代表那里的 Cloyster 的外壳大小。 具有最大值的单元格是领导者。 我们无法检查整个网格，因为只有当我们显式查询单元格时才会显示值。 

额外条件是关键的结构属性。 除全局最大值外，每个像元的八个相邻像元中至少有一个具有严格更大的值。 由于值都是不同的，因此反复从一个像元移动到任何更大的相邻像元最终必须达到唯一的全局最大值。 

任务是在最多使用 (3n+210) 个查询的同时输出该最大值的坐标。 边界 (n\le 2000) 足够小，足以扫描一整行或一列，但远不足以扫描整个 (n^2) 网格。 使用 (O(n^2)) 查询的解决方案最多需要 (4,000,000) 个最大大小的查询，远远超出了交互限制。 因此，有用的目标在 (n) 中是线性的，仅需要对数数量的附加恒定大小邻居检查。 

交互是非适应性的事实也意味着当重复查询时，细胞总是有相同的答案。 我们可以通过缓存我们已经获得的每个值来利用这一点。 

有几种边界情况可能会破坏粗心的实现。 当(n=2)时，中间切割也是边界，因此邻居循环不得查询行(0)、行(n+1)、列(0)或列(n+1)。 例如，与```
2
```和外壳值```
1 2
3 4
```正确答案是((2,2))。 假设每个查询行的两侧都存在的实现可以访问无效单元。 

当当前扫描行的最大值不是迄今为止发现的最大值时，会发生另一种微妙的情况。 假设先前的递归步骤发现了一个值 (100)，而下一个分隔线最多包含值 (90)。 丢弃以前的最佳值会丢失告诉我们哪一半仍然包含全局最大值的信息。 该算法必须在整个递归过程中全局保留最佳查询单元。 

要求进行测试的平等案件不是法律问题实例。 原始约束要求所有壳尺寸都不同，并且较大邻居属性也取决于严格的排序。 对于人工输入，例如```
2
5 5
5 5
```没有唯一的领导者，因此在问题的规则下不存在正确的输出。 测试工具应该将这种情况视为无效，而不是期望特定的坐标。 

## 方法

 直接的方法是查询每个单元格并记住最大值。 这是正确的，因为领导者正是唯一的全局最大值。 最坏情况下的查询次数为(n^2)，当(n=2000)时达到(4,000,000)。 交互只允许(3n+210)，最多是(6210)，所以穷举搜索是不可能的。 

有用的观察结果是，较大邻居条件为我们提供了一条从非领导者到领导者的递增路径。 想象一下通过当前矩形绘制一个分隔符，可以是完整的行，也可以是完整的列。 查询该分隔符上的每个单元格并取其最大值，例如 (X)。 

如果分隔符是一行，则 (X) 的每个水平邻居都较小，因为 (X) 是行最大值。 因此 (X) 的任何更大的邻居必须位于上面或下面的行中。 如果没有更大的邻居，则 (X) 已经是局部最大值，并且问题的条件意味着它一定是全局最大值。 

如果存在更大的相邻单元 (Y)，则从 (X) 到 (Y) 的方向告诉我们哪一侧包含全局最大值。 原因是递增路径性质。 从 (Y) 开始，重复移动到更大的邻居。 这些值严格递增，因此该路径不能穿过值小于 (Y) 的 (X) 分隔符，并且不能穿过另一个分隔符单元格，因为每个其他分隔符值至多为 (X)。 因此，通向全局最大值的路径仍然位于包含 (Y) 的一侧。 

相同的参数适用于列分隔符。 列最大值只能在其左侧或右侧有一个更大的邻居，因此我们丢弃另一半。 

当递归已经限制了一维时，还有一个额外的细节。 来自较早分离器的最佳查询单元必须保持可用。 我们维护整个交互及其坐标中看到的最大值。 在查询新的分隔符及其邻域后，该全局最好告诉我们要递归到哪一侧。 这避免了依赖于人工裁剪的矩形内的原始较大邻居属性。 

为了保持查询计数线性，请始终剪切较长的维度。 然后，分隔符最多花费较短尺寸的长度，并且在交替进行行和列切割之后，该较短尺寸大约是先前较长尺寸的一半。 生成的几何级数以 (3n) 为界，而每个分隔符最大值周围最多六个先前未知的邻居仅贡献 (O(\log n)) 额外查询。 建立的界限是 (3n+12\log_2 n)，对于 (n\le2000) 来说明显低于 (3n+210)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O(n^2)) 查询 | (O(n^2)) 如果缓存 | 太慢了|
 | 最佳| (O(n+\log n)) 查询 | (O(n^2)) 使用简单的缓存 | 已接受 |

 ## 算法演练

1. 读取(n)并从整个矩形([1,n]\times[1,n])开始。 维护将查询的坐标映射到其外壳尺寸的缓存。 还维护迄今为止查询到的最大值及其坐标。 
2. 如果当前矩形仅包含一个单元格，则该单元格就是答案。 输出其坐标并终止。 
3. 比较矩形的高度和宽度。 如果宽度至少等于高度，则选择中间列作为分隔符。 否则选择中间行。 切割较长的维度可以保证减少的维度至少与我们查询的行一样大，这给出了线性查询界限。 
4. 查询所选分隔符上的每个单元格并找到其最大值和位置。 将这一价值融入到迄今为止的全球最佳实践中。 先前查询的单元格从缓存中返回，而不消耗另一个交互查询。 
5. 查询位于分隔符另一侧的分隔符最大值的最多六个相邻单元格。 对于行分隔符，这些是紧邻上方和下方的行中的单元格以及最大值周围的三列。 对于柱分离器来说，情况是对称的。 在每次此类查询后更新全局最佳值。 
6. 如果全局最佳值位于分隔符上，则输出其坐标。 没有更大邻居的分隔符最大值是局部最大值，并且每个非领导者都有一个更大的邻居，因此这个局部最大值必须是领导者。 
7. 否则，检查分隔符的哪一侧包含全局最佳值。 如果它位于行分隔符上方，则在上半部分递归。 如果低于，则在下半部分递归。 对于列分隔符，在左半部分或右半部分递归。 
8. 重复直到剩下一个单元格或分隔符本身包含全局最佳值。 

### 为什么它有效

 不变的是全局最大值总是在当前矩形内，并且全局最大的查询单元也在该矩形内。 考虑行分隔符并令 (X) 为其最大值。 如果当前最佳查询值位于分隔符上方，则其上方有一个查询单元格（Y>X）。 从 (Y) 开始，重复跟踪较大的相邻小区最终必须达到全局最大值。 这样的严格递增路径不能穿过分离​​器，因为分离器上除了(X)之外的每个单元都小于(X<Y)，并且(X)本身也小​​于(Y)。 因此全局最大值必须高于分隔符。 柱的情况是相同的。 

如果没有相邻小区大于(X)，则(X)是局部最大值。 每个非极大值单元都保证有一个更大的邻居，因此 (X) 不可能是非极大值。 因此，它是全球独一无二的最大值。 

## Python 解决方案

 下面是实际的交互实现。 它适用于 Codeforces 交互器，而不是普通文件输入。 官方的问题是显式交互的，每个查询都必须立即刷新。```python
import sys
input = sys.stdin.readline

cache = {}
best_value = -1
best_x = -1
best_y = -1
query_count = 0

def query(x, y):
    global query_count

    if (x, y) in cache:
        return cache[(x, y)]

    print("?", x, y, flush=True)
    value = int(input())

    # A negative response is normally used by an interactor to signal
    # an invalid query or failure.
    if value < 0:
        sys.exit(0)

    cache[(x, y)] = value
    query_count += 1
    return value

def update_best(x, y):
    global best_value, best_x, best_y

    value = query(x, y)
    if value > best_value:
        best_value = value
        best_x = x
        best_y = y

def solve(u, d, l, r, n):
    if u == d and l == r:
        print("!", u, l, flush=True)
        sys.exit(0)

    # Cut the longer dimension.
    if d - u < r - l:
        # Vertical separator.
        m = (l + r) // 2

        x = u
        value = query(x, m)

        for i in range(u + 1, d + 1):
            cur = query(i, m)
            if cur > value:
                value = cur
                x = i

        update_best(x, m)

        # Check the neighbors on the two sides of the separator.
        for i in range(max(x - 1, 1), min(x + 1, n) + 1):
            if m > 1:
                update_best(i, m - 1)
            if m < n:
                update_best(i, m + 1)

        if best_y == m:
            print("!", x, m, flush=True)
            sys.exit(0)

        if best_y < m:
            solve(u, d, l, m - 1, n)
        else:
            solve(u, d, m + 1, r, n)

    else:
        # Horizontal separator.
        m = (u + d) // 2

        y = l
        value = query(m, y)

        for j in range(l + 1, r + 1):
            cur = query(m, j)
            if cur > value:
                value = cur
                y = j

        update_best(m, y)

        # Check the neighbors on the two sides of the separator.
        for j in range(max(y - 1, 1), min(y + 1, n) + 1):
            if m > 1:
                update_best(m - 1, j)
            if m < n:
                update_best(m + 1, j)

        if best_x == m:
            print("!", m, y, flush=True)
            sys.exit(0)

        if best_x < m:
            solve(u, m - 1, l, r, n)
        else:
            solve(m + 1, d, l, r, n)

def main():
    n = int(input())
    solve(1, n, 1, n, n)

if __name__ == "__main__":
    main()
```这`cache`字典实现了非自适应交互属性。 如果相邻单元已作为较早分隔符的一部分被查询，则再次请求它不会发出另一个`?`要求。 这特别有用，因为连续的分隔符共享边界邻域。`update_best`是故意分开的`query`。 第一个函数获取一个值，然后更新全局最大值，而第二个函数仅负责通信和缓存。 将这些职责分开会带来不变量`best_x`,`best_y`， 和`best_value`更容易保存。 

当宽度大于高度时，代码选择中间列并扫描其行。 当高度至少一样大时，它会选择中间行并扫描其列。 平局属于行情况，这是任意的，不影响正确性。 

邻居循环使用`max`和`min`与实际网格边界相对应。 这对于位于边缘或角落的分离器最大值很重要。 Python 中不存在整数溢出问题，并且 shell 值足够小，普通整数就足够了。 

递归矩形使用包含坐标。 因此，列分割的左半部分是`[l, m-1]`右半部分是`[m+1, r]`。 分隔符本身被排除，因为其相关信息已被查询。 相同的规则适用于行拆分。 

这`flush=True`对于交互式解决方案，参数是强制性的。 如果没有它，程序可能会在其查询仍在缓冲时等待交互器响应。 

## 工作示例

 该语句的第一个样本是交互记录而不是传统的输入/输出测试。 交互器给出 (n=3)，然后用值 (1,4,8,9,5) 回答程序的五个查询。 最终答案是((3,3))。 成绩单本身显示在原始问题页面上。 

对于概念跟踪，示例查询返回的值是：

 | 查询 | 细胞| 返回值| 当前最佳|
 | --- | --- | --- | --- |
 | 1 | ((1,1)) | ((1,1)) | 1 | 1 在 ((1,1)) |
 | 2 | ((2,3)) | ((2,3)) | 4 | 4 在 ((2,3)) |
 | 3 | ((3,2)) | ((3,2)) | 8 | 8 在 ((3,2)) |
 | 4 | ((3,3)) | ((3,3)) | 9 | 9 在 ((3,3)) |
 | 5 | ((2,2)) | ((2,2)) | 5 | 9 在 ((3,3)) |
 | 回答 | ((3,3)) | ((3,3)) | 9 | 9 在 ((3,3)) |

 该示例的重要部分是，即使不遵循确切的最佳搜索顺序，查询任意单元集合也可以揭示领导者。 一旦找到最大查询值并且周围结构确认它，程序就可以终止。 

第二个样本有 (n=5)，交互器针对 ((4,4)) 处的单个查询返回 (2)。 官方声明允许程序猜测，即使查询的信息不能从逻辑上确定答案，因此抄本

 | 行动| 细胞| 返回值 | 结果 |
 | --- | --- | --- | --- |
 | 查询 | ((4,4)) | ((4,4)) | 2 | 仅已知一个值 |
 | 回答 | ((1,1)) | ((1,1)) | | 程序终止 |

 被该样本的交互器接受。 

第二个示例演示了交互协议的属性，而不是确定性搜索证明。 它还解释了为什么将示例复制为普通的离线单元测试是不合适的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(n+\log n)) 查询 | 分隔符扫描形成几何级数，而每个递归级别仅添加恒定数量的邻居查询 |
 | 空间| (O(n^2)) 最坏情况 | 缓存可以包含每个查询到的坐标，尽管实际查询次数仅为 (O(n)) |

 对于 (n\le2000)，查询范围最多约为 (3n+12\log_2n)，安全地低于 (3n+210)。 因此，实施保持在交互限制内。 与 2 秒限制相比，实际 CPU 工作也很小。 该问题的官方资源对此策略给出了相同的 (3n+12\log_2 n) 样式限制。 

## 测试用例

 因为这是一个交互式问题，所以提供的示例不能像普通 stdin 一样直接传递到提交的程序。 正确的自动化测试需要一个模拟交互器，该交互器​​在解决方案打印查询时提供值。 以下工具通过替换来离线测试搜索逻辑`query`具有直接矩阵访问，同时保留相同的递归算法。```python
# Offline simulation of the interactive algorithm.
# The real Codeforces submission must use the interactive query() function.

def run_matrix(a):
    n = len(a)

    cache = {}
    best_value = -1
    best_x = -1
    best_y = -1

    def query(x, y):
        if (x, y) not in cache:
            cache[(x, y)] = a[x - 1][y - 1]
        return cache[(x, y)]

    def update_best(x, y):
        nonlocal best_value, best_x, best_y

        value = query(x, y)
        if value > best_value:
            best_value = value
            best_x = x
            best_y = y

    def solve(u, d, l, r):
        nonlocal best_value, best_x, best_y

        if u == d and l == r:
            return u, l

        if d - u < r - l:
            m = (l + r) // 2

            x = u
            value = query(x, m)

            for i in range(u + 1, d + 1):
                cur = query(i, m)
                if cur > value:
                    value = cur
                    x = i

            update_best(x, m)

            for i in range(max(x - 1, 1), min(x + 1, n) + 1):
                if m > 1:
                    update_best(i, m - 1)
                if m < n:
                    update_best(i, m + 1)

            if best_y == m:
                return x, m

            if best_y < m:
                return solve(u, d, l, m - 1)
            return solve(u, d, m + 1, r)

        else:
            m = (u + d) // 2

            y = l
            value = query(m, y)

            for j in range(l + 1, r + 1):
                cur = query(m, j)
                if cur > value:
                    value = cur
                    y = j

            update_best(m, y)

            for j in range(max(y - 1, 1), min(y + 1, n) + 1):
                if m > 1:
                    update_best(m - 1, j)
                if m < n:
                    update_best(m + 1, j)

            if best_x == m:
                return m, y

            if best_x < m:
                return solve(u, m - 1, l, r)
            return solve(m + 1, d, l, r)

    return solve(1, n, 1, n)

# Custom 1: minimum-size valid grid.
a1 = [
    [1, 2],
    [3, 4],
]
assert run_matrix(a1) == (2, 2), "minimum-size grid"

# Custom 2: maximum at the top-left boundary.
a2 = [
    [16, 15, 14, 13],
    [12, 11, 10, 9],
    [8, 7, 6, 5],
    [4, 3, 2, 1],
]
assert run_matrix(a2) == (1, 1), "top-left boundary"

# Custom 3: maximum at the bottom-right boundary.
a3 = [
    [1, 2, 3, 4],
    [5, 6, 7, 8],
    [9, 10, 11, 12],
    [13, 14, 15, 16],
]
assert run_matrix(a3) == (4, 4), "bottom-right boundary"

# Custom 4: maximum away from the boundaries.
a4 = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 25, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 13],
]
assert run_matrix(a4) == (3, 3), "interior maximum"

# Deliberately invalid according to the original problem.
# All values are equal, so there is no unique leader.
invalid_equal = [
    [5, 5],
    [5, 5],
]
# No assertion is made for invalid_equal because the original problem
# guarantees distinct values.
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`[[1,2],[3,4]]`|`(2,2)`| 最小值 (n)、角最大值、边界检查 |
 |`[[16,15,14,13],...,[4,3,2,1]]`|`(1,1)`| 左上边界和向上递归 |
 |`[[1,2,3,4],...,[13,14,15,16]]`|`(4,4)`| 右下边界和向下递归 |
 |`5 x 5`网格与`25`在`(3,3)`|`(3,3)`| 内部最大和分离器端接|
 |`[[5,5],[5,5]]`| 无效| 确认所有相等的数据违反了问题保证 |

 ## 边缘情况

 对于 (2\times2) 情况```
1 2
3 4
```第一个分隔符是列，因为维度是绑定的，并且实现在这种情况下选择行分支。 它扫描行 (1)，找到 (2)，检查紧邻其下方的单元格，发现 (4)，并将 ((2,2)) 记录为最知名的单元格。 然后递归移动到下半部分并到达正确的角。 边界守卫可以防止网格外的任何查询。 

对于左上角的最大值，请考虑```
16 15 14 13
12 11 10 9
8  7  6  5
4  3  2  1
```搜索过程中遇到的分隔符最大值最终在通向左上角的一侧有一个更大的已知邻居。 当矩形缩小时，全局最佳坐标会被保留，因此即使后面的分隔线包含较小的值，算法也不会丢失候选坐标。 

对于右下角的最大值，```
1  2  3  4
5  6  7  8
9  10 11 12
13 14 15 16
```相同的机制以相反的方向起作用。 每当当前分隔符向下方或右侧显示较大值时，就会保留相应的一半。 答案最终就在剩下的矩形中。 

对于内部最大值，```
1  2  3  4  5
6  7  8  9  10
11 12 25 14 15
16 17 18 19 20
21 22 23 24 13
```分隔符最大值本身可以是前导符。 一旦算法查询其相邻单元并且没有一个单元更大，则立即应用局部最大值参数。 不需要进一步递归。 

最后，一个完全平等的网格，例如```
5 5
5 5
```不得用作有效的问题测试。 该声明保证了成对不同的壳尺寸，因此这里没有唯一的最大单元。 返回四个坐标之一的解决方案只能做出任意选择，而不是解决指定的问题。
