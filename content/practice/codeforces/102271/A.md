---
title: "CF 102271A - 网络人月球基地（简单）"
description: "网格有 H 行和 W 列。 时间和列一起前进，因此在时间 t TARDIS 在列 t 中。 它的垂直坐标在连续列之间最多可以改变 K，垂直方向从 H 行循环到第 1 行，从第 1 行循环到 H 行。"
date: "2026-08-17T18:18:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102271
codeforces_index: "A"
codeforces_contest_name: "Helvetic Coding Contest 2019 (two remaining problems)"
rating: 0
weight: 102271
solve_time_s: 150
verified: true
draft: false
---

[CF 102271A - 网络人月球基地（简单）](https://codeforces.com/problemset/problem/102271/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 30s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 网格有`H`行和`W`列。 时间和柱子一起前进，所以在时间`t`TARDIS 在列中`t`。 它的垂直坐标最多可以改变`K`在连续的列之间，垂直方向从行循环缠绕`H`划船`1`并从行`1`划船`H`。 

每个网络人每次都从固定的列和行开始`1`。 网络人从不改变专栏。 相反，在每个后续时间步，它们都向同一方向移动一行，这由 的相应字符决定`S`。 因此，如果网络人开始排成一排`r`在列`c`，那么当 TARDIS 到达柱时`c`， Cyber​​man 已被前缀移动`S`对应第一个`c - 1`移动。 多个网络人可以占据同一个单元，但对于 TARDIS 来说，只有单元被封锁这一事实才重要。 官方声明和竞赛材料使用了这种解释，并给出了三​​个样本的输出`4`,`72`， 和`600000`。 

输入给出`H`,`W`,`K`， 和`N`，随后是`N`初始 Cyber​​man 位置，然后是长度的字符串`W - 1`。 输出是从列的未占用单元格开始的不同 TARDIS 坐标序列的数量`1`，每个时间步移动一次，从不进入已占用的单元格，并在列中的某处完成`W`。 答案取模`10^9 + 7`。 

尺寸`H`和`W`至多是`1000`，因此每个网格单元大约有一个操作的解决方案，`O(HW)`，很容易实用。 的价值`K`至多是`10`，这也使得`O(HWK)`动态规划原则上可行，但还有更干净的`O(HW)`使用滑动窗口进行过渡。 可以有`5000`网络人，因此如果重复这样做，通过检查每个网络人来重建每个列将是浪费。 在我们知道其列的垂直位移后，每个 Cyber​​man 只需要处理一次。 

第一个边缘情况是被占用的起始单元。 例如，```
2 2 1 2
1 1
1 2
U
```第一列的两个单元格都被阻塞，所以正确答案是`0`。 粗心的实现将每个第一列状态初始化为`1`会计算从 Cyber​​men 内部开始的路径。 

第二个边缘情况是垂直包裹。 考虑```
5 2 1 1
2 5
U
```在列`2`，网络人从行移动`5`划船`1`。 其他四个单元可用。 从列中的每一行`1`，TARDIS 可以循环到达三个连续的行，因此四个允许的目的地中的每一个都有三个可能的前趋。 答案是`12`。 将行视为普通间隔的实现会错误地处理行周围的转换`1`和`5`。 

第三个边缘情况是网络人的移动取决于时间，而不是网络人移动了多少列。 例如，```
5 3 1 2
1 1
2 1
UU
```在列`1`， 排`1`被阻塞，给出第一列 DP`[0,1,1,1,1]`。 在列`2`，两个 Cyber​​man 都晋升过一次，所以 Cyber​​man 最初位于`(2,1)`占据行`2`。 因此第二列有 DP`[2,0,3,3,3]`，总共`11`。 柱子`3`没有 Cyber​​man，总数变为`33`。 忘记移动前缀或过早应用指令一个时间步的实现会得到不同的结果。 

## 方法

 最直接的解决方案是将问题视为路径计数动态程序。 让`dp[r]`是到达 row 的方式数`r`在当前列中。 对于目标行`r`，其循环距离从前的每一行`r`至多是`K`贡献新的价值。 计算这些总和后，阻塞的单元格将设置为零。 

暴力实现可以通过递归枚举每个可能的 TARDIS 路径来完全避免动态编程。 这是正确的，因为每条合法路径只生成一次，并且每条非法路径一旦到达占用的单元就被拒绝。 问题在于路径的数量。 在最坏的情况下，没有任何障碍，并且`H = 1000`和`K = 10`, 每行都有`21`不同的可达行。 第一列有`1000`选择，然后是`21`剩下的每一个的选择`999`列，给予`1000 * 21^999`可能的路径。 那大约是`10^1321`，所以枚举是完全不可行的。 

第一个有用的观察是我们不需要记住完整的路径。 一旦 TARDIS 到达特定小区，所有早期选择仅通过到达该小区的路径数量来影响。 这给出了标准的逐列 DP。 

第二个观察是处理移动的障碍物。 每个 Cyber​​man 都根据相同的信号移动，因此之后的垂直位移`c - 1`移动可以从前缀得知`S`。 我们可以预先计算每列的位移。 最初是一名网络人`(c, r)`然后恰好阻塞列中的一行`c`，即适当移动的版本`r`。 我们可以在运行 DP 之前对这些单元格进行一次标记。 

剩余的过渡最初是`O(HK)`每列，因为每个目的地最多检查`2K + 1`前几行。 在这些限制下这已经是可以接受的，因为`H,W <= 1000`和`K <= 10`，但过渡具有更多结构。 对于连续的目标行，其前驱间隔每侧仅相差一行。 我们可以维护当前循环间隔的总和并在常数时间内更新它。 这将 DP 转换减少为`O(H)`每列。 

什么时候`2K + 1 >= H`，每一行都可以到达循环网格上的每隔一行。 在这种情况下，每个目的地接收相同的路径总数，即先前 DP 阵列的总和。 单独处理这种情况可以避免在构造滑动窗口时多次对同一循环行进行计数。 

官方竞赛社论描述了相同的基础列 DP，过渡将距离内所有先前的行相加`K`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(H(2K+1)^(W-1))`|`O(W)`递归深度 | 太慢了 |
 | 具有直接转换的 DP |`O(N + HWK)`|`O(HW)`| 已接受 |
 | 带有循环滑动窗口的DP |`O(N + HW)`|`O(HW)`| 已接受 |

 ## 算法演练

 1. 读取所有 Cyberman 位置和移动字符串。 为每列建立一个前缀位移。 让`shift[c]`是 Cyber​​man 当时的垂直位移`c`相对于其初始行。 因此`shift[0] = 0`，并且以下每个值的变化量为`+1`为了`U`或者`-1`为了`D`。 行上的模运算给出循环环绕。 
2. 创建一个分块单元数组`W`列。 对于每一个最初加入专栏的网络人`c`和行`r`，标记应用得到的行`shift[c - 1]`到`r`。 网络人留在纵队`c`，因此它仅对该列有贡献。 这是障碍物移动和 TARDIS 移动之间的主要区别。 
3. 初始化列的DP`1`。 每个未阻塞的行都只有一种方式成为起始单元格，而每个阻塞的行都有零种方式。 在此刻`prev[r]`表示以 row 结尾的所有有效路径`r`在当前列中。 
4. 处理色谱柱`2`通过`W`。 For each column, calculate the sum of`prev[r']`在所有行上`r'`到目标行的循环距离`r`至多是`K`。 如果目的地被阻塞，则无论前驱和如何，其 DP 值都为零。 
5.如果`2K + 1 >= H`，每个源行都可以到达每个目标行。 计算`total = sum(prev)`一次并将该值分配给每个畅通的目的地。 这可以避免构建多次包含相同循环行的窗口。 
6. 否则，维持一个精确的循环滑动窗口`2K + 1`不同的源行。 构建概念序列`prev[H-K], ..., prev[H-1], prev[0], ..., prev[H-1], prev[0], ..., prev[K-1]`。 

第一个窗口对应于目标行`0`。 当移动到下一个目标行时，减去离开窗口的源行并添加进入窗口的源行。 因此，每个目的地总花费恒定的时间。 
7. 更换`prev`使用新计算的 DP 数组并继续下一列。 柱后`W`已处理，将所有条目相加`prev`。 每个幸存的条目都表示以该行结束的路径，并且每个可能的最后一行都是可接受的。 

### 为什么它有效

 不变量是处理后的列`c`,`prev[r]`正好等于当前位置为的合法 TARDIS 路径的数量`(c,r)`。 初始化满足这一点，因为每个空闲起始单元贡献一条路径，而每个阻塞单元不贡献任何路径。 为了过渡到`(c,r)`，每条合法路径必须恰好来自循环距离内的一行`K`，因此对相应的先前 DP 值求和会将每个合法扩展恰好计数一次。 被封锁的目的地贡献为零，精确地消除了进入网络人的路径。 滑动窗口仅通过重用连续窗口之间的重叠来计算与直接递归相同的前驱总和。 因此，该不变量对于每一列都保持正确，并且对最终 DP 数组求和给出了所需的路径数量。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    H, W, K, N = map(int, input().split())

    cybermen = [tuple(map(int, input().split())) for _ in range(N)]
    S = input().strip()

    # shift[c] is the vertical displacement at column c + 1,
    # using 0-based column indices.
    shift = [0] * W
    for c in range(1, W):
        shift[c] = shift[c - 1] + (1 if S[c - 1] == 'U' else -1)

    # blocked[c][r] == 1 means row r (0-based) is occupied
    # in column c (0-based).
    blocked = [bytearray(H) for _ in range(W)]

    for c, r in cybermen:
        row = (r - 1 + shift[c - 1]) % H
        blocked[c - 1][row] = 1

    # DP for the first column.
    prev = [0 if blocked[0][r] else 1 for r in range(H)]

    # If one move can reach every row, every destination gets
    # the same predecessor sum.
    all_rows_reachable = 2 * K + 1 >= H

    for c in range(1, W):
        if all_rows_reachable:
            total = sum(prev) % MOD
            cur = [
                0 if blocked[c][r] else total
                for r in range(H)
            ]
        else:
            # Cyclic sliding window.
            ext = prev[-K:] + prev + prev[:K]
            width = 2 * K + 1

            window = sum(ext[:width]) % MOD
            cur = [0] * H

            for r in range(H):
                if not blocked[c][r]:
                    cur[r] = window

                if r + 1 < H:
                    window += ext[r + width]
                    window -= ext[r]
                    window %= MOD

        prev = cur

    print(sum(prev) % MOD)

if __name__ == "__main__":
    solve()
```这`shift`数组记录了网络人的累积运动。 对于柱`c`，TARDIS 到达那里的时间`c`，所以确切地说`c - 1`信号人物影响了每一个网络人。 表达式`(r - 1 + shift[c - 1]) % H`将原始从一开始的行转换为从零开始的循环行。 

这`blocked`数组使用一个`bytearray`每列。 这是紧凑的，让我们测试目的地是否在恒定时间内被占用。 如果几个网络人最终在同一个牢房中，则分配`1`再次没有效果，这正是我们所需要的。 

第一个 DP 数组仅包含`0`和`1`，因为在进入第一列之前没有任何移动。 从第二列开始，转换仅取决于前面的 DP 阵列，因此不需要存储两个完整的 DP 层。 

这`all_rows_reachable`分支处理较小的值`H`。 例如，当`H = 5`和`K = 3`，任意两行之间的循环距离最多为`2`，因此每一行都到达每隔一行。 一个幼稚的圆形长度窗口`7`会对某些行进行两次计数。 直接使用总和可以避免这个问题。 

对于正常情况，`ext`包含足够的开头和结尾的副本`prev`将每个循环前导间隔转换为普通的连续切片。 第一个窗口对应于目标行`0`。 处理该行后，一个旧值离开窗口，一个新值进入窗口。 选择这些更新的顺序是为了`cur[r]`完全使用目标窗口`r`，不是目的地`r + 1`。 

所有算术都减少模数`10^9 + 7`。 Python 整数不会溢出，但保持滚动总和有界可以防止不必要的增长并保持实现效率。 

## 工作示例

 ### 示例 1

 输入是```
2 2 1 0
U
```没有网络人。 有两行和`K = 1`，垂直循环允许每一行一次到达每隔一行。 

| 专栏 | 被阻止的行 |`prev`过渡前 |`cur`过渡后 |
 | --- | --- | --- | --- |
 | 1 | 无 |`[1, 1]`|`[1, 1]`|
 | 2 | 无 |`[1, 1]`|`[2, 2]`|

 最终总和是`2 + 2 = 4`，匹配示例输出。 

这个例子练习了`2K + 1 >= H`分支。 转换不需要检查各个前驱行，因为每一行都是可访问的。 

### 示例 2

 输入是```
5 4 1 3
1 3
2 2
2 1
UDU
```网络人专栏`1`， 排`3`当 TARDIS 到达柱时向上移动一次`2`。 最初在专栏中的两个网络人`2`, 行`2`和`1`，也向上移动一次。 因此被阻塞的行是`{3}`在列中`1`,`{2,3}`在列中`2`，并且列中没有单元格`3`和`4`。 

| 专栏 | 被阻止的行 | DP矢量|
 | --- | --- | --- |
 | 1 |`{3}`|`[1, 1, 0, 1, 1]`|
 | 2 |`{2, 3}`|`[3, 0, 0, 2, 3]`|
 | 3 |`{}`|`[6, 3, 2, 5, 5]`|
 | 4 |`{}`|`[14, 11, 10, 12, 16]`|

 对于柱`2`， 排`1`接收来自行的路径`5`,`1`， 和`2`, 给予`3`。 排`4`接收来自行的路径`3`,`4`， 和`5`, 给予`2`，和行`5`收到`3`。 被阻止的行接收零。 

柱子`3`没有障碍物，所以路径总数变为`24`，然后乘以列中每个目的地的三个可能的前驱行`4`。 最终总数为`72`，匹配样本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(N + HW)`| 每个 Cyber​​man 处理一次，每列处理每行一次 |
 | 空间|`O(HW + N)`| 阻塞的网格使用`O(HW)`空间和输入位置使用`O(N)`空间|

 和`H,W <= 1000`，DP 最多执行大约一百万行更新。 障碍物预处理仅处理`N <= 5000`网络人。 阻塞网格的内存使用量也足够小`256 MB`限制，而实现只保留两个 DP 向量。 

## 测试用例```python
# Complete assert-based harness for the solution.

import sys
import io

MOD = 1_000_000_007

def solve():
    input = sys.stdin.readline

    H, W, K, N = map(int, input().split())
    cybermen = [tuple(map(int, input().split())) for _ in range(N)]
    S = input().strip()

    shift = [0] * W
    for c in range(1, W):
        shift[c] = shift[c - 1] + (1 if S[c - 1] == 'U' else -1)

    blocked = [bytearray(H) for _ in range(W)]
    for c, r in cybermen:
        row = (r - 1 + shift[c - 1]) % H
        blocked[c - 1][row] = 1

    prev = [0 if blocked[0][r] else 1 for r in range(H)]
    all_rows_reachable = 2 * K + 1 >= H

    for c in range(1, W):
        if all_rows_reachable:
            total = sum(prev) % MOD
            cur = [0 if blocked[c][r] else total for r in range(H)]
        else:
            ext = prev[-K:] + prev + prev[:K]
            width = 2 * K + 1
            window = sum(ext[:width]) % MOD
            cur = [0] * H

            for r in range(H):
                if not blocked[c][r]:
                    cur[r] = window

                if r + 1 < H:
                    window += ext[r + width]
                    window -= ext[r]
                    window %= MOD

        prev = cur

    print(sum(prev) % MOD)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run(
    """2 2 1 0
U
"""
) == "4", "sample 1"

assert run(
    """5 4 1 3
1 3
2 2
2 1
UDU
"""
) == "72", "sample 2"

assert run(
    """5 10 3 10
1 2
2 3
3 4
1 4
1 3
5 1
5 2
5 3
7 1
7 2
UUUDDDUDU
"""
) == "600000", "sample 3"

# Custom 1: minimum dimensions, no obstacles.
assert run(
    """2 2 1 0
U
"""
) == "4", "minimum-size grid"

# Custom 2: maximum row dimension with a short width.
# With H=1000, W=2, K=10 and no obstacles, there are
# 1000 starting rows and 21 choices for the second row.
assert run(
    """1000 2 10 0
U
"""
) == "21000", "large H"

# Custom 3: wrap-around transition.
# Row 5 is blocked in column 2, while K=1 makes row 1
# reachable from row 5 and vice versa.
assert run(
    """5 2 1 1
2 5
U
"""
) == "12", "vertical wrapping"

# Custom 4: obstacle movement must use the time prefix.
# Column 1 blocks row 1.
# The Cyberman initially at column 2, row 1 moves up to row 2
# before the TARDIS reaches column 2.
assert run(
    """5 3 1 2
1 1
2 1
UU
"""
) == "33", "Cyberman movement timing"

# Custom 5: duplicate Cybermen in the same cell must not
# multiply the blocking effect.
assert run(
    """5 3 1 5
2 1
2 1
2 1
2 1
2 1
UU
"""
) == "36", "duplicate obstacles"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 2 1 0`和`U`|`4`| 最小尺寸和所有行均可到达的过渡 |
 |`1000 2 10 0`和`U`|`21000`| 大行维数和直接总和分支|
 |`5 2 1 1`， 障碍`(2,5)`|`12`| 循环垂直缠绕|
 |`5 3 1 2`, 障碍物`(1,1)`和`(2,1)`|`33`| 修正与时间相关的 Cyber​​man 位移 |
 | 五份`(2,1)`|`36`| Multiple Cybermen occupying the same cell |

 ## 边缘情况

 When the entire first column is blocked, the initial DP vector is all zeroes. 为了```
2 2 1 2
1 1
1 2
U
```两行在初始化之前都已标记，因此`prev = [0, 0]`。 后来的每次转变也产生零，答案是`0`。 对于这种情况，算法永远不需要特殊情况，因为初始 DP 定义已经捕获了它。 

对于垂直包裹，请考虑```
5 2 1 1
2 5
U
```网络人专栏`2`， 排`5`向上移动到行`1`，所以列`2`块行`1`。 柱子`1`有DP`[1,1,1,1,1]`。 可用的目的地是行`2`,`3`,`4`， 和`5`。 他们的前身窗口分别是`{1,2,3}`,`{2,3,4}`,`{3,4,5}`， 和`{4,5,1}`，每个包含三个路径。 最终的向量是`[0,3,3,3,3]`, 给予`12`。 

对于移动障碍物，请考虑```
5 3 1 2
1 1
2 1
UU
```第一列阻挡行`1`，所以初始DP为`[0,1,1,1,1]`。 第二个网络人从专栏开始`2`， 排`1`，但按时间`2`它已向上移动到行`2`。 因此第二列有行`2`被阻止。 循环前驱和给出`[2,0,3,3,3]`，其总数为`11`。 柱子`3`没有障碍物，每个目的地接收三个前行，总共产生`33`。 这证实了信号前缀是根据 TARDIS 的时间应用的，而不是根据 Cyber​​man 的起始列历史记录。 

最后，如果多个网络人占据同一个牢房，他们仍然只封锁一个牢房。 在```
5 3 1 5
2 1
2 1
2 1
2 1
2 1
UU
```所有五个网络人都移动到排`2`在列中`2`。 阻塞数组记录该单元一次。 柱子`1`拥有所有五个起始行，因此列`2`有四行可用，每行有三个前辈，给出`12`路径。 柱子`3`没有障碍物，所以总数变为`36`。 将每个 Cyber​​man 视为单独的障碍物会多次错误地删除同一单元格，而字节数组表示自然会处理重复项。
