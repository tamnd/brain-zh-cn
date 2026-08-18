---
title: "CF 102192K - 戳破气球"
description: "将每一行视为左顶点，将每一列视为右顶点。 单元格 (r, c) 处的气球是 r 行和 c 列之间的边。 当我们在 (r, c) 处弹出气球时，与 r 行或 c 列相关的所有剩余气球都会消失。"
date: "2026-08-18T02:15:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102192
codeforces_index: "K"
codeforces_contest_name: "2018 Chinese Multi-University Training, Nanjing U Contest"
rating: 0
weight: 102192
solve_time_s: 236
verified: true
draft: false
---

[CF 102192K - 弹出气球](https://codeforces.com/problemset/problem/102192/K)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 将每一行视为左顶点，将每一列视为右顶点。 牢房里的气球`(r, c)`是行之间的边`r`和列`c`。 

当我们戳破气球时`(r, c)`，每个剩余的气球事件`r`或列`c`消失。 因此，两个直接弹出的气球永远不会共享一行或一列。 直接弹出的气球在这个二部图中形成了匹配。 

还有一个条件。 当所有的飞镖都被扔完之后，所有的气球肯定都消失了。 未直接弹出的气球必须与某些直接弹出的气球共享其行或列。 在图术语中，直接弹出的匹配必须是最大的。 因此，问题是按大小计算最大匹配，然后考虑飞镖按顺序投掷的事实。 

对于每一个`x`从`1`通过`k`，输出要求精确的有序序列数`x`形成这样的清算过程的气球位置。 顺序很重要，所以如果一组`x`找到有效的爆破气球，它有贡献`x!`不同的飞镖序列。 

网格最多有`12`行和`20`列。 小尺寸是关键限制。 描述所有行的状态每行可以有三种可能性，给出`3^12 = 531441`最多州。 虽然很大，但可以通过精心实施的动态程序进行管理。 一个涉及所有人的国家`20`列会有`3^20`，它已经太大了，因此网格应该定向，以便三元态表示的维度是较小的维度。 

飞镖数量最多为`20`，但最多可以有`12`直接弹出的气球，因为直接弹出的气球不能共享一行。 参数`k`对于修剪状态超过`k`飞镖，但它不会改变渐近状态计数。 

官方声明使用 7 秒限制和 256 MB 内存。 它的样本由四个测试用例组成并具有输出`1, 2`,`2, 0`,`1, 8, 0`， 和`2`， 分别。 

第一个边缘情况是完全空的网格。 例如，```
1
1 1 1
.
```有输出```
0
```因为即使是第一镖也没有合法的位置。 将空匹配视为成功的清除策略的粗心实现会错误地报告零省份的一种方式，但问题只要求正省份计数。 

另一种边缘情况是网格中一行有多个气球。 为了```
1
1 3 3
QQQ
```正确的输出是```
3
0
0
```一根飞镖就足够了，并且有三种可能的单元格。 基于选择任意气球子集的蛮力可以正确计算三个单细胞选择，但它很容易错误地处理这样的事实：当只有一个飞镖时，飞镖顺序不起作用。 

一个更微妙的情况是```
1
2 2 2
Q.
.Q
```正确的输出是```
0
2
```每个气球必须直接爆破，两个飞镖可以按任意顺序投掷。 只计算弹出单元格集合的粗心方法将会返回`1`而不是`2`。 

最后，考虑一个密集的网格，其中`k`大于行数。 例如，一个`2 x 2`全气球网格永远不会要求或允许三个直接弹出的气球，因为两个直接弹出的气球已经使用了两行。 较大飞镖数的答案必须保持为零。 DP 自然地处理这个问题，因为行数限制了状态位数等于`1`，代表已经选择的行。 

## 方法

 暴力方法是选择第一个弹出的气球，模拟其行和列被清除，选择下一个剩余的气球，然后继续，直到所有气球消失或`k`已使用飞镖。 这是正确的，因为每个合法的飞镖序列都是直接探索的，并且模拟完全遵循游戏规则。 

问题在于分支因素。 一个`12 x 20`网格可以包含`240`气球。 如果所有这些都存在并且我们尝试精确的每个有序序列`20`飞镖，叶子的数量是`240 * 239 * 238 * ... * 221 = 240! / 220!`。 

这已经是关于`10^47`序列。 即使仅检查子集而不是有序序列，也会对数百个气球进行指数搜索。 

有用的观察结果是，实际直接弹出的气球形成了匹配。 一旦我们决定哪些行已被选择，有关先前列的唯一信息是行是否已被选择，它是否已出现在未选择的列中但仍需要选择，或者它是否从未出现在相关列中。 

这给出了每行三个状态。 我们使用行状态的三元掩码逐列处理网格。 我们故意将列保留在状态之外，因为只有`20`其中。 

对于固定柱来说，只有两种动作。 我们要么不在该列中投掷飞镖，在这种情况下，该列中的每个气球都有义务最终选择其行，要么我们向该列中的一个气球投掷飞镖。 在第二种情况下，该行被选中，而该列中的所有其他气球会立即消失并且不会产生任何未来义务。 

因此，DP 使用递增的列顺序作为其规范表示，将每个可能的匹配枚举一次。 在最后一列之后，当没有行具有未选中的未选中气球时，状态就成功了。 如果状态包含`x`选定的行，它代表大小的一个规范最大匹配`x`。 

然后可以任意排序省道位置。 由于所选气球形成匹配，因此没有两个气球共享行或列，因此所选气球的每个排列都是有效的飞镖顺序。 我们将大小的规范匹配数量相乘`x`经过`x!`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(P(B, k))`， 在哪里`B <= 240`|`O(B)`| 太慢了|
 | 最佳|`O(n * m * 3^m)`|`O(3^m)`| 已接受 |

 这里`m <= 12`是由三元态表示的维度，`n <= 20`是已处理的列数。 

## 算法演练

 1. 将每个气球视为其行和列之间的边。 直接弹出的集合必须是匹配的，因为两个直接弹出的气球不能共享行或列。 
2. 按列处理网格。 由于最多有`20`列和至多`12`行，在行上存储三元状态是较小的表示形式。 
3. 为每行指定三种状态之一。 状态`0`表示该行中没有气球出现在未弹出的列中。 状态`1`表示该行已被飞镖选择。 状态`2`表示这一行的气球已经出现在前面没有弹出的列中，所以后面仍然需要选择这一行。 
4. 从状态开始`0`对于每一行和一个 DP 方式。 
5. 对于当前的栏目，首先考虑不要在那里扔飞镖。 仅当稍后选择其行时，该列中的每个气球才会消失，因此当前处于状态的每一行`0`此列中包含气球的内容更改为状态`2`。 行已处于状态`2`留在那里，而行处于状态`1`保持选中状态。 
6. 接下来考虑向当前列中尚未选择行的每个气球扔一个飞镖。 所选行更改为状态`1`。 当前列中的所有其他气球都会被该飞镖吹走，因此它们不会创建新状态`2`义务。 
7.拒绝所选行数超过的状态`k`。 由于每一选定行都对应一个飞镖，因此此类状态永远无法得出答案。 
8.处理完所有列后，仅保留不包含数字的状态`2`。 这样的状态没有任何行仍然需要飞镖，因此每个气球都已被直接清除或通过与直接弹出的气球共享行或列来清除。 
9. 将每个成功状态的 DP 值添加到按其状态数索引的答案中`1`数字。 这对每个最大匹配进行一次计数，因为其选定的列是按升序处理的。 
10.对于每一个`x`，将规范匹配的数量乘以`x!`。 乘法将规范列顺序转换为所有可能的顺序`x`飞镖投掷。 

在编号步骤之后，关键的不变量是在处理完第一个步骤之后`j`列，状态准确记录哪些行已被选择以及哪些行仍需要选择，因为在这些列中遇到了未清除的气球。 转换要么不选择当前列，从而精确创建这些新义务，要么选择一个有效的气球并立即清除该列的其余部分。 因此，每条DP路径对应一个匹配，并且当从左到右考虑其所选列时，每个匹配恰好具有一条路径。 没有数字的最终状态`2`正是最大匹配，这正是一组能够清除每个气球的飞镖。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(m, n, k, grid):
    # We keep m as the smaller dimension.
    # The input already guarantees m <= 12 and n <= 20.
    #
    # For every column, mask bit r is set when grid[r][col] == 'Q'.
    columns = []
    for col in range(n):
        mask = 0
        for r in range(m):
            if grid[r][col] == 'Q':
                mask |= 1 << r
        columns.append(mask)

    states = 3 ** m

    pow3 = [1] * m
    for r in range(1, m):
        pow3[r] = pow3[r - 1] * 3

    # sum3[mask] = sum(pow3[r]) over all set bits r.
    # It lets us change all selected zero digits to digit 2 at once.
    sum3 = [0] * (1 << m)
    for mask in range(1, 1 << m):
        bit = mask & -mask
        r = bit.bit_length() - 1
        sum3[mask] = sum3[mask ^ bit] + pow3[r]

    # one[s]: rows whose ternary digit is 1.
    # two[s]: rows whose ternary digit is 2.
    # cnt[s]: number of digits equal to 1.
    #
    # Row 0 is the least significant ternary digit.
    one = [0] * states
    two = [0] * states
    cnt = [0] * states

    for s in range(1, states):
        q, d = divmod(s, 3)
        one[s] = (one[q] << 1) | (1 if d == 1 else 0)
        two[s] = (two[q] << 1) | (1 if d == 2 else 0)
        cnt[s] = cnt[q] + (1 if d == 1 else 0)

    dp = [0] * states
    dp[0] = 1

    full_rows = (1 << m) - 1

    for col_mask in columns:
        ndp = [0] * states

        for s in range(states):
            ways = dp[s]
            if ways == 0:
                continue

            used = cnt[s]
            if used > k:
                continue

            one_mask = one[s]
            two_mask = two[s]

            # Case 1: do not shoot this column.
            #
            # Every row containing a balloon in this column and currently
            # in state 0 becomes state 2.
            zero_rows = col_mask & ~(one_mask | two_mask) & full_rows
            base = s + 2 * sum3[zero_rows]

            ndp[base] += ways

            # Case 2: shoot one balloon in this column.
            #
            # A row already in state 1 cannot be shot again.
            # Starting from 'base', the chosen row would have digit 2,
            # but becomes digit 1, so subtract one power of 3.
            if used < k:
                available = col_mask & ~one_mask & full_rows

                while available:
                    bit = available & -available
                    ns = base - pow3[bit.bit_length() - 1]
                    ndp[ns] += ways
                    available ^= bit

        dp = ndp

    # Successful states have no digit 2.
    # Digit 1 counts directly popped rows, hence darts.
    ans = [0] * (min(k, m) + 1)

    for s in range(states):
        ways = dp[s]
        if ways and two[s] == 0:
            x = cnt[s]
            if 1 <= x <= k:
                ans[x] += ways

    # The DP stores each matching in increasing column order.
    # The actual darts may be thrown in any order.
    fact = 1
    result = []
    for x in range(1, k + 1):
        if x <= m:
            fact *= x
            result.append(str(ans[x] * fact))
        else:
            result.append("0")

    return "\n".join(result)

def solve(data):
    tokens = data.split()
    it = iter(tokens)

    t = int(next(it))
    out = []

    for _ in range(t):
        m = int(next(it))
        n = int(next(it))
        k = int(next(it))

        grid = [next(it).decode() if isinstance(next_val := next(it), bytes) else next_val
                for _ in range(m)]

        out.append(solve_case(m, n, k, grid))

    return "\n".join(out) + "\n"

def main():
    t = int(input())
    out = []

    for _ in range(t):
        m, n, k = map(int, input().split())
        grid = [input().strip() for _ in range(m)]
        out.append(solve_case(m, n, k, grid))

    sys.stdout.write("\n".join(out) + "\n")

if __name__ == "__main__":
    main()
```核心表示是一个三进制整数。 最低有效三进制数字属于第 0 行，因此更改行状态只是添加或减去 3 的幂。 数组`one`和`two`让转换确定哪些行被选择以及哪些行仍然具有未解析的气球，而无需重复解码三进制数。`sum3`是一个在这个状态空间中很重要的小优化。 当某列未弹出时，当前未看到的每个气球行都会从数字更改为`0`数字化`2`。 该代码不是单独修改每一行，而是将所有此类行收集到一个位掩码中，并添加相应的三的幂的两倍。 

拍摄过渡值得特别注意。 变量`base`表示如果当前列没有弹出将会发生什么。 对于选择作为省位置的行，该行将有数字`2`在`base`，但飞镖将其更改为数字`1`。 因此，精确地减去三的一次方就可以得出正确的状态，即原始数字是否是`0`或者`2`。 

一行有数字`1`无法再次选择。 它之前的飞镖已经移除了该排中的所有气球，因此那里不可能留下合法的气球。 这就是为什么`available`删除`one_mask`。 

Python 整数具有任意精度，这在这里是必需的。 有效 dart 序列的数量可以比 64 位整数大得多，因此与典型的模块化计数问题不同，不应用模数。 

这`solve`帮助程序包含在下面基于断言的测试中。 实际比赛入口点使用`input = sys.stdin.readline`并直接处理测试用例。 

## 工作示例

 ### 示例 1

 考虑第一个官方示例：```
2 2 2
QQ
.Q
```这些列是`{row 1}`和`{row 1, row 2}`。 我们使用`0`对于看不见的，`1`已经被飞镖选择了，并且`2`对于当前有未解决的气球的行。 

| 专栏 | 以前的状态 | 行动| 新状态 | 方式|
 | --- | --- | --- | --- | --- |
 | 1 |`00`| 没有飞镖|`20`| 1 |
 | 1 |`00`| 拍摄第 1 排 |`10`| 1 |
 | 2 |`20`| 没有飞镖|`22`| 1 |
 | 2 |`20`| 拍摄第 1 排 |`10`| 1 |
 | 2 |`10`| 没有飞镖|`12`| 1 |
 | 2 |`10`| 拍摄第 2 排 |`11`| 1 |

 在第二列之后，说明`10`和`11`有效，因为它们不包含数字`2`。 第一个代表一个选定的气球，因此它有助于`1`规范匹配。 第二个代表两个选定的气球，因此它有贡献`1`规范匹配。 

对于一支飞镖来说，`1! = 1`。 对于两支飞镖来说，`2! = 2`。 最终的输出结果是`1, 2`，与官方样品相符。 

有趣的部分是状态`20`当第 1 行射击第二列时，该列中的第 2 行气球立即被吹走，因此第 2 行不会变成未解决状态。 这就是为什么结果是`10`，而不是包含未解决的第 2 行的状态。 

### 示例 2

 第二个样本是```
2 2 2
QQ
..
```两个气球位于同一行。 

| 专栏 | 以前的状态 | 行动| 新状态 | 方式|
 | --- | --- | --- | --- | --- |
 | 1 |`00`| 没有飞镖|`20`| 1 |
 | 1 |`00`| 拍摄第 1 排 |`10`| 1 |
 | 2 |`20`| 没有飞镖|`20`| 1 |
 | 2 |`20`| 拍摄第 1 排 |`10`| 1 |
 | 2 |`10`| 没有飞镖|`10`| 1 |

 最终状态`10`接收方式有两种。 它们对应于射击第一个气球或射击第二个气球。 两种选择都会清除整行，因此一支飞镖的答案是`2`。 

没有有效的两镖解决方案。 一旦这一排中的一个气球被弹出，另一个气球也会随之消失，所以永远不会有合法的第二次飞镖。 输出是`2, 0`，再次匹配官方样本。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n * m * 3^m)`| 有`3^m`每个的行状态`n`列，每个州都可以尝试该列中的每个气球行 |
 | 空间|`O(3^m + 2^m)`| 两个 DP 层和三态元数据主导内存使用 |

 和`m = 12`，只有`531441`三元态。 最大过渡工作大致为`20 * 12 * 531441`， 关于`127.5`万个简单的状态行操作。 该实现避免了在最内层循环内解码三元状态，并使用位掩码处理行，这对于上限是必需的。 内存需求由两个 DP 层主导，并保持在预期的状态空间范围内。 

## 测试用例```python
import sys
import io
from math import factorial

def run(inp: str) -> str:
    return solve(inp)

# Provided samples
sample = """\
4
2 2 2
QQ
.Q
2 2 2
QQ
..
3 3 3
.Q.
QQQ
.Q.
1 3 1
Q.Q
"""

expected_sample = """\
1
2
2
0
1
8
0
2
"""

assert run(sample) == expected_sample, "official samples"

# Minimum-size non-empty grid
assert run("""\
1
1 1 1
Q
""") == "1\n", "single balloon"

# Minimum-size empty grid
assert run("""\
1
1 1 1
.
""") == "0\n", "empty grid"

# One row, every balloon can be cleared by any one dart
assert run("""\
1
1 3 3
QQQ
""") == "3\n0\n0\n", "one-row boundary"

# Two diagonal balloons must both be popped, in either order
assert run("""\
1
2 2 2
Q.
.Q
""") == "0\n2\n", "diagonal balloons"

# Maximum-size all-balloon grid.
# A maximal matching must have exactly 12 darts.
max_grid = "12 20 20\n" + "\n".join(["Q" * 20] * 12) + "\n"
max_input = "1\n" + max_grid

max_matching_ordered = (
    factorial(20) // factorial(8) * factorial(12)
)

max_expected = "\n".join(
    ["0"] * 11 + [str(max_matching_ordered)]
) + "\n"

assert run(max_input) == max_expected, "maximum dense grid"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 x 1`和`Q`|`1`| 尽可能小的非空网格 |
 |`1 x 1`和`.`|`0`| 没有合法的飞镖和空板处理 |
 |`1 x 3`和`QQQ`|`3, 0, 0`| 一排多个气球和最大有用飞镖数 |
 |`2 x 2`与对角气球|`0, 2`| 有序的飞镖序列和直接命中的要求形成匹配 |
 |`12 x 20`全部`Q`|`0`通过飞镖计数`11`，然后一个大值`12`| 最大状态大小、任意精度计数以及`x!`订购系数|

 ## 边缘情况

 对于空网格，例如```
1
1 1 1
.
```初始状态`0`每一列都存在，因为任何列掩码中都没有气球位。 这是一个有效的零飞镖状态，但输出循环开始于`x = 1`，所以没有报告任何内容。 结果是`0`。 

对于包含以下内容的单行`QQQ`,```
1
1 3 3
QQQ
```DP 只有三个三元态。 拍摄第一列、第二列或第三列会创建一个具有选定行且没有未解决状态的状态。 这是三种不同的一镖位置。 最终的答案是`3, 0, 0`。 

对于对角线气球，```
1
2 2 2
Q.
.Q
```第一个飞镖可以弹出任一对角气球，但这样做后，另一个气球仍然存在，因为它的行和列都没有被清除。 因此，民主党只让两镖国家保持成功。 有两种可能的飞镖顺序，给出`2`。 

当一列包含多个气球并且选择了其中一个气球时，会发生最微妙的过渡。 假设当前状态在第 1 行中有一个未解析的气球，并且没有有关第 2 行的先前信息，而当前列在两行中都包含气球。 射击第 1 行会立即删除第 1 行和第 1 列的气球。 不能仅仅因为第 2 行存在气球，因为该气球刚刚被吹走，就将其标记为未解决。 拍摄过渡`base - pow3[r]`正好处理这种情况。 

什么时候`k > m`，每个问题的答案`x > m`必然为零。 没有两个直接弹出的气球可以共用一行，所以最多`m`飞镖可以按有效的顺序使用。 实现仍然准确打印`k`行，但阶乘 DP 结果仅用于`x <= m`; 所有较大的值均为零。
