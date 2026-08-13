---
title: "CF 102284I - OpenStreetMap"
description: "我们有一个（n×m）高度图。 浏览器可以显示恰好包含 (a) 连续行和 (b) 连续列的任何矩形。 对于该矩形的每个可能位置，我们需要其最小高度，最后我们需要所有这些最小值的总和。"
date: "2026-08-13T08:53:52+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102284
codeforces_index: "I"
codeforces_contest_name: "\u041b\u041a\u0428 2019, \u0418\u044e\u043b\u044c, \u041c\u0438\u043a\u0441 \u0441\u0442\u0430\u0440\u0448\u0435\u0439 \u0438 \u043c\u043b\u0430\u0434\u0448\u0435\u0439 \u043e\u043b\u0438\u043c\u043f\u0438\u0430\u0434"
rating: 0
weight: 102284
solve_time_s: 134
verified: true
draft: false
---

[CF 102284I - OpenStreetMap](https://codeforces.com/problemset/problem/102284/I)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个（n \times m）高度图。 浏览器可以显示恰好包含 (a) 连续行和 (b) 连续列的任何矩形。 对于该矩形的每个可能位置，我们需要其最小高度，最后我们需要所有这些最小值的总和。 

高度没有明确给出。 相反，它们是由递归生成的

 [
 g_i=(g_{i-1}x+y)\bmod z,
 ]

 并且矩阵从此序列逐行填充。 因此，当使用从零开始的坐标时，单元格 ((r,c)) 包含索引为 (rm+c) 的序列元素。 

约束允许两个维度都达到 (3000)，因此矩阵可以包含 (9) 万个单元。 检查每个（a\times b）矩形的每个单元的算法过于昂贵。 即使当 (a=b=1500) 时，也大约有 (2.25) 万个可能的矩形，每个矩形包含 (2.25) 万个单元格，给出大约 (5\times10^{12}) 的比较。 该解决方案只需处理每个矩阵单元恒定的次数。 

还有两个数字方面的考虑。 生成的高度低于 (10^9)，但答案可以包含几乎 (9) 万个这样的值，因此答案可以大致达到 (9\times10^{15})。 Python 整数会自动处理此问题，而紧凑的 32 位表示足以存储高度，因为每个高度都低于 (10^9)。 

小边缘情况是单单元屏幕。 为了```
1 1 1 1
5 0 0 10
```唯一显示的矩形包含高度 (5)，因此答案是 (5)。 假设窗口至少有两个单元格或延迟记录最小值直到出现第二个位置的解决方案可能会意外产生零。 

当窗口具有全宽时，会出现另一种边界情况。 为了```
2 3 1 3
1 1 0 100
```生成的矩阵是

 [
 \开始{p矩阵}
 1&1&1\
 1&1&1
 \end{pmatrix},
 ]

 所以正好有两个显示的矩形，答案是（2）。 在 (b) 列开始生成答案但使用错误的输出索引的水平滑动窗口实现可能会丢失第一个窗口。 

当 (a=n) 时，垂直方向也会出现同样的问题。 为了```
3 1 3 1
4 1 0 100
```每个单元格都是（4），只有一个（3\times1）矩形，答案是（4）。 垂直队列必须恰好包含当前 (a) 行，而不是 (a+1)。 

## 方法

 直接的方法是枚举每个可能的左上角并扫描其矩形内的所有 (a b) 单元格。 有((n-a+1)(m-b+1))个矩形，所以它的运行时间是

 [
 O((n-a+1)(m-b+1)ab),
 ]

 最坏情况下为 (O(n^2m^2))。 对于（n=m=3000），这是完全不可行的。 

第一个有用的观察是二维最小值可以分为两个一维最小值运算。 考虑一个固定行。 如果我们知道该行中每个长度（b）段的最小值，则（a\times b）矩形可以简化为（a）此类行最小值的垂直窗口。 取这些 (a) 值的最小值正好给出整个矩形的最小值。 

剩下的问题是如何有效地计算所有一维滑动窗口最小值。 单调队列将候选位置按其值的升序排列。 当插入一个新值时，它后面的每个较大的值都可以被丢弃，因为新值既较小又较新，因此被丢弃的值永远不会成为新值过期之前的未来窗口的最小值。 因此，队列的前面是当前窗口的最小值。 

我们水平应用一次，垂直应用一次。 水平通道产生 (n(m-b+1)) 个中间最小值。 垂直传递消耗这些值并将每个完整的（a）元素窗口直接添加到答案中。 

标准 C++ 实现可以将中间矩阵存储为整数。 在 Python 中，将数百万个值存储为普通整数将使用更多内存，因此下面的实现使用`array('I')`，一个紧凑的 32 位无符号整数数组。 这使得中间矩阵在最坏情况下保持在大约 36 MB，同时保留相同的 (O(nm)) 算法。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | (O((n-a+1)(m-b+1)ab)) | (O(1)) 除了输入生成 | 太慢了|
 | 两次单调传递 | (O(nm)) | (O(n(m-b+1))) | 已接受 |

 ## 算法演练

 1. 根据递推式逐行生成矩阵。 我们永远不需要一次整个原始矩阵，因为每一行都可以立即减少到其水平窗口最小值。 
2. 对于每一行，维护一个列索引的单调递增队列。 在插入列 (c) 之前，删除当前长度 (b) 窗口之外的索引。 然后，当索引的高度至少为新高度时，从后面删除索引。 前面现在标识当前水平窗口的最小值。 
3. 将水平最小值存储在紧凑数组中。 对于行 (r)，水平位置 (c) 处的值表示从列 (c) 到列 (c+b-1) 的原始单元格的最小值。 每行有 (m-b+1) 个这样的值。 
4. 使用另一个单调队列处理中间数组的每一列。 队列现在包含行索引而不是列索引。 当行 (r) 到达时，删除早于 (a) 的行，丢弃后面较大的值，并将最小的候选保留在前面。 
5. 一旦处理完 (a) 行，队列前端的值就是相应的 (a\times b) 矩形的最小值。 立即将其添加到答案中。 不需要存储最终的矩形最小值矩阵。 
6. 打印累计答案。 Python 的整数类型用于此变量，因为总和可能远大于 (2^{32})。 

### 为什么它有效

 对于每一行，水平队列在其前面精确地维护当前 (b) 单元格间隔的最小值。 因此，每个中间值是最终矩形的一个完整水平条带的最小值。 对于这些中间值的固定列，(a) 连续水平条最小值的最小值等于相应 (a\times b) 矩形中所有单元格的最小值。 第二个单调队列精确地保持垂直最小值，因此每个矩形将其真实最小值贡献一次且仅一次给答案。 

队列不变式是它的索引位于当前窗口内并且它们对应的值是非递减的。 从后面删除较大的值不会丢失未来的最小值，因为新插入的值较小并且不会更早过期。 删除过期的前端元素是安全的，因为它们不再属于当前窗口。 因此，前面始终代表所需的最小值。 

## Python 解决方案```python
import sys
from array import array

input = sys.stdin.readline

def solve():
    n, m, a, b = map(int, input().split())
    g, x, y, z = map(int, input().split())

    w = m - b + 1

    # Horizontal minima. Heights are < 1e9, so unsigned 32-bit
    # integers are sufficient. Preallocating avoids the memory
    # overhead of millions of Python int objects.
    horizontal = array('I', [0]) * (n * w)

    # Monotonic queue of column indices for one row.
    q = [0] * m

    for r in range(n):
        row = [0] * m
        for c in range(m):
            row[c] = g
            g = (g * x + y) % z

        head = 0
        tail = 0
        base = r * w

        for c in range(m):
            # Remove columns that are left of the current
            # length-b window.
            while head < tail and q[head] <= c - b:
                head += 1

            # Keep values in increasing order.
            value = row[c]
            while head < tail and row[q[tail - 1]] >= value:
                tail -= 1

            q[tail] = c
            tail += 1

            if c >= b - 1:
                horizontal[base + c - b + 1] = row[q[head]]

    # Vertical pass. The queue contains row indices.
    q = [0] * n
    answer = 0

    for c in range(w):
        head = 0
        tail = 0

        for r in range(n):
            pos = r * w + c
            value = horizontal[pos]

            # Remove rows outside the current length-a window.
            while head < tail and q[head] <= r - a:
                head += 1

            # Remove values that cannot become a future minimum.
            while head < tail:
                back_row = q[tail - 1]
                back_value = horizontal[back_row * w + c]
                if back_value < value:
                    break
                tail -= 1

            q[tail] = r
            tail += 1

            if r >= a - 1:
                answer += horizontal[q[head] * w + c]

    print(answer)

if __name__ == "__main__":
    solve()
```第一部分读取发电机参数并计算`w`，每行中水平窗口的数量。 自从`w = m-b+1`，中间数组恰好包含第二遍所需的值。 

这`horizontal`数组使用无符号32位类型代码`I`。 每个生成的高度都在从 (0) 到 (z-1) 和 (z\le10^9) 的范围内，因此任何存储的高度都不会溢出此表示。 紧凑数组在 Python 中非常有用，因为最多 900 万个 Python 整数的普通列表将消耗更多的内存。 

对于每一行，`q`是一个用作手动实现的双端队列的数组。`head`指向第一个活动元素并且`tail`指向最后一个活动元素之后的一个位置。 使用索引而不是重复调用`popleft`避免创建许多 Python 对象并保持热循环简单。 

到期条件`q[head] <= c-b`相当于说索引必须至少是`c-b+1`，这是当前窗口的左端点。 第一个水平答案出现时`c == b-1`，因为这是存在完整 (b) 元素区间的第一列。 

垂直传递使用相同的队列思想，但队列存储行索引。 条件`q[head] <= r-a`删除当前行后面超过 (a-1) 个位置的行。 一个完整的垂直窗口首先存在于`r == a-1`。 

生成器更新在分配当前单元后立即发生。 这与序列的定义匹配：第一个单元格接收 (g_0)，下一个单元格接收一个递归步骤产生的值。 

乘法`g * x`可以达到接近 (10^{18})，这完全在 Python 的任意精度整数范围内。 最终的答案也可以达到大约(9\times10^{15})，因此不需要显式的溢出处理。 

## 工作示例

 ### 示例 1

 输入是```
3 4 2 1
1 2 3 59
```生成的矩阵是

 [
 \开始{p矩阵}
 1&5&13&29\
 2&7&17&37\
 18&39&22&47
 \end{pmatrix}。 
]

 因为 (b=1)，每个水平窗口包含一个单元格，所以水平传递使值保持不变。 

| 行| 生成值| 水平最小值|
 | --- | --- | --- |
 | 0 | 1、5、13、29 | 1、5、13、29 |
 | 1 | 2、7、17、37 | 2、7、17、37 |
 | 2 | 18、39、22、47 | 18、39、22、47 |

 现在 (a=2)，因此垂直窗口包含两个连续的行。 

| 专栏 | 最少 0-1 行 | 最少第 1-2 行 | 贡献 |
 | --- | --- | --- | --- |
 | 0 | 1 | 2 | 3 |
 | 1 | 5 | 7 | 12 | 12
 | 2 | 13 | 17 | 17 30|
 | 3 | 29 | 29 37 | 37 66 | 66

 累计答案为

 [
 3+12+30+66=111。 
]

 该轨迹表明第二遍对行最小值而不是原始单元格进行操作，但仍然获得精确的矩形最小值。 

### 自定义示例

 考虑```
2 3 2 2
1 1 0 100
```序列为 (1,1,1,1,1,1)，因此矩阵全为 1。 垂直方向只有一个（2\times2）矩形，水平方向只有两个。 

| 行| 横窗| 最低 |
 | --- | --- | --- |
 | 0 | 第 0-1 列 | 1 |
 | 0 | 第 1-2 栏 | 1 |
 | 1 | 第 0-1 列 | 1 |
 | 1 | 第 1-2 栏 | 1 |

 垂直通道分别处理每个中间列。 

| 中级专栏| 第 0-1 行 | 矩形最小值 | 专栏后回答 |
 | --- | --- | --- | --- |
 | 0 | 1, 1 | 1 | 1 |
 | 1 | 1, 1 | 1 | 2 |

 答案是 (2)，匹配两个可能的 (2\times2) 矩形。 此示例练习了滑动窗口操作的两个维度，并检查相等的值，其中当出现重复高度时队列必须保持正确。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(nm)) | 每个矩阵单元最多进入和离开水平队列一次，每个中间值最多进入和离开垂直队列一次。 |
 | 空间| (O(n(m-b+1)+m+n)) | 水平最小值需要每行和水平窗口一个紧凑值，而两个队列和当前行仅需要线性辅助空间。 |

 对于 (n,m\le3000)，最多生成 (9) 万个单元。 该算法对每个单元执行恒定量的分摊队列工作，而不是扫描每个（a\times b）矩形单元。 紧凑的中间数组将 Python 实现保持在 256 MB 内存限制内，尽管原始 Codeforces 限制足够严格，编译后的实现具有更大的性能裕度。 

## 测试用例```python
# The solution function from above is assumed to be present.
# For local testing, run() temporarily replaces stdin and captures stdout.

import sys
import io
from array import array

def solve():
    input = sys.stdin.readline

    n, m, a, b = map(int, input().split())
    g, x, y, z = map(int, input().split())

    w = m - b + 1
    horizontal = array('I', [0]) * (n * w)

    q = [0] * m

    for r in range(n):
        row = [0] * m

        for c in range(m):
            row[c] = g
            g = (g * x + y) % z

        head = 0
        tail = 0
        base = r * w

        for c in range(m):
            while head < tail and q[head] <= c - b:
                head += 1

            value = row[c]
            while head < tail and row[q[tail - 1]] >= value:
                tail -= 1

            q[tail] = c
            tail += 1

            if c >= b - 1:
                horizontal[base + c - b + 1] = row[q[head]]

    q = [0] * n
    answer = 0

    for c in range(w):
        head = 0
        tail = 0

        for r in range(n):
            value = horizontal[r * w + c]

            while head < tail and q[head] <= r - a:
                head += 1

            while head < tail:
                br = q[tail - 1]
                if horizontal[br * w + c] < value:
                    break
                tail -= 1

            q[tail] = r
            tail += 1

            if r >= a - 1:
                answer += horizontal[q[head] * w + c]

    print(answer)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample
assert run(
    "3 4 2 1\n"
    "1 2 3 59\n"
) == "111", "sample 1"

# Minimum-size input
assert run(
    "1 1 1 1\n"
    "5 0 0 10\n"
) == "5", "single cell"

# All values equal, with several rectangles
assert run(
    "2 3 2 2\n"
    "7 1 0 10\n"
) == "14", "all equal values"

# Horizontal windows, catches the first and last horizontal positions
assert run(
    "2 3 1 2\n"
    "1 2 1 100\n"
) == "50", "horizontal boundaries"

# Vertical window spanning the complete height
assert run(
    "3 1 3 1\n"
    "4 1 0 100\n"
) == "4", "full-height window"

# Maximum-size dimensions with a full matrix window.
# All generated values are zero, so the only 3000x3000
# rectangle has minimum zero.
assert run(
    "3000 3000 3000 3000\n"
    "0 0 0 1\n"
) == "0", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 1 1 / 5 0 0 10`| 5 | 最小尺寸和单格窗口 |
 |`2 3 2 2 / 7 1 0 10`| 14 | 14 等值和多个二维窗口 |
 |`2 3 1 2 / 1 2 1 100`| 50 | 50 水平窗口边界 |
 |`3 1 3 1 / 4 1 0 100`| 4 | 垂直边界，其中 (a=n) |
 |`3000 3000 3000 3000 / 0 0 0 1`| 0 | 最大矩阵大小和紧凑的内存表示 |

 ## 边缘情况

 ### 单细胞矩阵

 对于```
1 1 1 1
5 0 0 10
```水平通道处理列 (0)，立即创建唯一的水平最小值 (5)，垂直通道处理行 (0)，立即添加 (5)，因为 (r=a-1=0)。 最终答案为（5）。 在实现中不需要特殊情况，因为当窗口大小为 1 时，相同的窗口完成条件起作用。 

### 窗口等于全宽

 对于```
2 3 1 3
1 1 0 100
```生成的值都是 (1)。 由于(b=3)，水平队列直到第(2)列才产生中间值。 此时唯一的水平窗口具有最小值 (1)。 垂直通道有 (a=1)，因此两行中的每一行贡献一个值。 结果是(1+1=2)。 

表达式`c >= b - 1`是什么使第一个完整的水平窗口恰好出现在右边界。 

### 等于全高的窗口

 对于```
3 1 3 1
4 1 0 100
```所有三个生成值均为 (4)。 水平传递每行产生一个值。 在垂直传递过程中，行 (0) 和 (1) 尚未形成完整的 (a=3) 窗口。 在第 (2) 行，队列包含所有三行，因此最小值 (4) 仅添加一次。 答案是（4）。 

表达式`r >= a - 1`防止算法在完整的垂直窗口存在之前产生结果。 

### 队列内的高度相等

 假设几个连续的单元具有相同的最小值。 该实现使用删除值`>=`，而不仅仅是`>`。 保留最新的相等值就足够了，因为它的过期时间晚于旧的相等值。 最小值本身保持不变，而队列变得更短。 这就是为什么全相等测试仍然正确，而不需要单独的重复值规则。 

### 大答案

 最多可以有 ((n-a+1)(m-b+1)) 个矩形，即最多 (9) 万个。 每个最小值都低于 (10^9)，因此答案可以接近 (9\times10^{15})。 存储的矩阵值使用 32 位整数，但是`answer`故意保留一个普通的 Python 整数。 在整数宽度固定的语言中，使用 32 位累加器作为答案会悄悄溢出。 

### 最大尺寸

 当 (n=m=3000) 时，矩阵包含 (9) 万个单元。 水平中间数组最多包含相同数量的值。 Python 列表将存储引用和单独的整数对象，并且消耗的内存比原始值多几倍。`array('I')`将每个高度存储在四个字节中，因此最坏情况的中间矩阵占用大约 (36) MB。 队列和当前行仅为 (O(n+m))，在 256 MB 限制以下留有大量空间。
