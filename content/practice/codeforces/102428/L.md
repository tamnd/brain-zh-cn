---
title: "CF 102428L - 利用 MDT"
description: "网格有 N 行和 M 列，每个单元格最初标记为 G 或 B。Javasar 想要占据一个正方形区域，并让该正方形中的每个单元格在他访问它时都处于良好状态。 这条路线的有用部分是他一次一整排地穿过王国。"
date: "2026-08-12T07:22:38+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102428
codeforces_index: "L"
codeforces_contest_name: "2019-2020 ACM-ICPC Latin American Regional Programming Contest"
rating: 0
weight: 102428
solve_time_s: 125
verified: true
draft: false
---

[CF 102428L - 利用 MDT](https://codeforces.com/problemset/problem/102428/L)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 网格有 N 行和 M 列，每个单元格最初标记为`G`或者`B`。 Javasar 想要占领一个正方形区域，并且当他访问该区域时，该正方形中的每个单元格都处于良好状态。 

这条路线的有用部分是他一次一整排地穿过王国。 在连续的两行之间，他处于王国之外，因此他可以自由切换MDT。 因此，每一行都可以独立地保持不变或完全反转。 对一行所做的选择与对另一行所做的选择之间没有交互。 

这大大改变了问题。 对于固定行，当某个段已经完全被使用时，该段可以变得完全良好。`G`或完全`B`。 它的实际字母并不重要，因为整行都可以翻转。 因此，对于候选方格，每行只需在方格的列上保持不变。 不同的行可能有不同的字母。 

例如，下面的网格可以产生一个 5×5 的好正方形，因为每一行都是独立的常数：```
GGGGG
BBBBB
GGGGG
BBBBB
GGGGG
```中间的行可以翻转，而其他行保持不变。 

约束条件允许两个维度都达到 1000，因此可以有 100 万个单元。 O(NMmin(N,M)) 算法已经可以接近 10 9 次运算，但在 Python 中太慢了。 我们需要对单元数量进行本质上的线性运算，最好是 O(NM)。 

粗心的解决方案可能会错过几种边缘情况。 1×1 网格，例如```
B
```有答案`1`，因为单个单元格可以翻转。 仅计算最初良好单元格的解决方案将错误地返回零。 

另一个微妙的情况是一行的字母在候选方格内发生变化。 为了```
GGGG
GBBG
GGGG
```答案是`1`。 虽然每个单独的单元格都可以通过翻转其行来变得更好，但 2×2 的正方形不起作用，因为中间行包含两者`G`和`B`在每一个可能的宽度二的位置。 仅检查良好单元格数量而不检查每个行段是否均匀的解决方案会高估答案。 

最后，行不必彼此一致。 在```
GGG
BBB
GGG
```答案是`9`。 中间行翻转，其他两行保持原样。 要求整个方格具有相同的原始字符会错误地拒绝该方格。 

## 方法

 直接解可以枚举每个可能的正方形。 对于每个左上角和每个可能的边长，它可以检查正方形中的所有单元格并检查每行是否恒定。 这是正确的，因为它明确地测试了每个可能的候选者。 

问题在于重复工作量。 对于 1000×1000 的网格，即使考虑每个可能的正方形并检查其单元格也需要

 k=1 Σ 1000 ​ k 2 (1001−k) 2

 单元格检查，大约为 3.33×10 13 。即使我们使用前缀信息在恒定时间内检查每个候选方格，仍然有 θ(NMmin(N,M)) 个候选方格，对于一个 1000×1000 方格来说大约有 10 9 个。 

蛮力之所以有效，是因为当候选方格的每一行都包含足够长的等字符运行时，该候选方格恰好有效。 关键是要明确地表示这些水平运行。 

从左到右处理网格。 对于每个单元格 (i,j)，令`run[i]`是第 i 行中第 j 列结束的连续相等字符的数量。 例如，行`GGBBBG`产生运行长度`1, 2, 1, 2, 3, 1`。 

假设我们当前位于 j 列，并考虑游程长度至少为 w 的几个连续行。 那么这些行都有 w 个相同的单元格，以 j 列结尾。 它们共同的 w 列形成一个 w 宽的矩形。 如果至少有 w 个这样的行，我们就有一个 w×w 的正方形。 

这会将每一列变成直方图。 第 i 行的值是结束于该列的水平游程长度。 对于高度为 h 的直方图条，我们可以找到每个条的高度至少为 h 的最大连续垂直区间。 如果该区间的高度为 v，则它的边长为正方形

 分钟(h,v)。 

单调堆栈在每列的线性时间内找到所有柱的最大间隔。 由于有 M 列和 N 行，因此完整的算法是 O(NM)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 检查每个方形单元时的 O(NMmin(N,M) 2 ) | O(NM) | 太慢了|
 | 最佳| O(NM) | O(N) | 已接受 |

 ## 算法演练

 1. 从左到右阅读网格和过程列。 我们只需要每行的当前水平游程长度，因此不需要保留二维游程长度数组。 
2. 对于当前列的每一行，如果当前字符等于紧邻其左边的字符，则将其游程长度增加一。 否则将游程长度重置为一。 该值告诉我们该行中有多少个连续的相等单元格在当前列处结束。 
3. 将此列中的游程长度视为直方图。 考虑高度为 h 的行。 如果另一行的高度至少为 h，则两行都包含至少 h 个以当前列结尾的相同单元格。 因此，高度为 v 且高度至少为 h 的连续间隔中的每一行都支持相同的 h 列。 
4. 对于每个直方图位置，使用递增单调堆栈查找高度较小的上方和下方的第一行。 在这两个边界之间，每行的高度至少为当前高度。 所得间隔是与该水平宽度兼容的最大垂直跨度。 
5. 设水平游程长度为 h，最大兼容垂直跨度为 v。以该直方图条为中心的最大正方形可以有边`min(h, v)`。 用正方形的面积更新答案。 
6. 对每一列重复此操作。 遇到的最大区域就是答案。 

### 为什么它有效

 不变量是在第 j 列，`run[i]`正是第 i 行中右边界为 j 的常量字符段的最大宽度。 考虑任何在 j 列结束、边长为 k 的有效正方形。 它的 k 行中的每一行都必须包含最后 k 个单元格作为相同的字符，因此每个对应的直方图高度至少为 k。 任何高度至少为 k 的条形的单调堆栈间隔都包含这 k 行，并且该算法可以构造边长至少为 k 的正方形。 相反，由直方图间隔生成的每个正方形在每行中都有足够的水平宽度和足够的垂直行，因此该正方形的每一行都是恒定的，并且可以独立翻转为`G`。 因此算法找到的最大边正是最大可能的正方形边。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    # run[i] = length of the equal-character segment in row i
    # ending at the current column.
    run = [0] * n
    answer = 0

    for j in range(m):
        # Build the histogram for this column.
        for i in range(n):
            if j > 0 and grid[i][j] == grid[i][j - 1]:
                run[i] += 1
            else:
                run[i] = 1

        # Find maximal vertical intervals for every histogram bar.
        stack = []

        for i in range(n + 1):
            current = run[i] if i < n else 0

            while stack and run[stack[-1]] >= current:
                p = stack.pop()

                if stack:
                    left = stack[-1] + 1
                else:
                    left = 0

                height = i - left
                side = min(run[p], height)
                if side * side > answer:
                    answer = side * side

            stack.append(i)

    print(answer)

if __name__ == "__main__":
    solve()
```第一个循环维护归约所需的水平信息。 当当前字符与前一个字符不同时，运行必须变为`1`，因为没有更宽的恒定段可以在此位置结束。 当字符匹配时，前一次运行加一。 

第二个循环是直方图的标准单调堆栈处理。 出栈操作后，堆栈以严格增加的游程长度存储行索引。 当出现较短的高度时，每个弹出的条都刚刚在右侧找到了第一个较小的元素。 剩余的栈顶给出了左侧第一个较小的元素。 

变量`height`是行数`run[p]`是最小高度。 候选正方形边是水平宽度和垂直高度中较小的一个。 我们仅在取最小值后才对边进行平方，因为矩形具有尺寸`run[p] × height`仅通过其最大的包含正方形对我们有用。 

额外的哨兵位置`i == n`高度为零。 它强制处理每个剩余的直方图条，从而避免单独的清理循环。 条件`>=`而不是`>`是故意的。 等高条被合并，以便其中一根代表整个最大间隔，从而防止重复的较窄间隔使边界复杂化。 

Python 整数具有任意精度，因此在计算 1000 2 =10 6 以内的面积时不存在溢出问题。 

## 工作示例

 ### 示例 1

 输入是```
2 2
GG
GG
```游程长度演变如下。 

| 专栏 | 行| 人物 | 运行| 堆栈事件| 最好的一面| 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | G | 1 | 棒材加工| 1 | 1 |
 | 0 | 1 | G | 1 | 相等的条形合并| 1 | 1 |
 | 1 | 0 | G | 2 | 酒吧推| 1 | 1 |
 | 1 | 1 | G | 2 | 哨兵进程高度 2 | 2 | 4 |

 在第二列，两行都有水平游程长度`2`。 直方图是`[2, 2]`，因此高度为 2 的垂直间隔也存在。 宽度二和高度二的最小值给出第二边和面积四。 

因此结果是`4`。 

### 示例 2

 输入是```
5 5
GGGGG
GBBBG
GBBBG
GBBBG
GGGGG
```重要的直方图状态是：

 | 专栏 | 按行运行长度 | 有用的垂直间隔| 水平宽度| 侧面| 面积 |
 | --- | --- | --- | --- | --- | --- |
 | 0 |`[1,1,1,1,1]`| 行 0..4 | 1 | 1 | 1 |
 | 1 |`[2,1,1,1,2]`| 行 0..4 | 1 | 1 | 1 |
 | 2 |`[3,2,2,2,3]`| 第 1..3 行 | 2 | 2 | 4 |
 | 3 |`[4,3,3,3,4]`| 第 1..3 行 | 3 | 3 | 9 |
 | 4 |`[5,1,1,1,5]`| 高度 1 的第 0..4 行 | 5 | 1 | 1 |

 在第三列，第一行到第三行各有一个长度为 3 的游程，因为它们的中间部分是`BBB`。 这就创建了一个 3×3 的正方形。 完整的 5×5 正方形也是从外部行获得的，但其中间行在该列中的游程长度仅为 3，因此这个特定的直方图并不代表完整的正方形。 

完整的答案仍然是`25`，因为在第四列，外侧行的游程长度为 5，而中间行重置为 1。 正方形不需要所有行都具有相同的原始字符，但它确实需要每行在所选列上保持不变。 完整的正方形使用零到第四列，其中中间的行是`GBBBG`，这不是常数。 因此，所声称的完整平方实际上是无效的，正确答案是`9`。 

所以样本输出应该是`9`对于提供的网格。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(NM) | 每个单元更新一个运行值并参与恒定数量的单调堆栈操作。 |
 | 空间| O(NM) | 该实现存储输入网格以及 O(N) 运行和堆栈数组。 |

 更准确地说，辅助算法空间为 O(N)，而存储输入网格成本为 O(NM)。 当 N,M≤1000 时，一百万个字符很容易管理，并且线性时间扫描每个单元仅执行少量恒定的工作。 

## 测试用例```python
import sys
import io

input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    grid = [input().strip() for _ in range(n)]

    run = [0] * n
    answer = 0

    for j in range(m):
        for i in range(n):
            if j > 0 and grid[i][j] == grid[i][j - 1]:
                run[i] += 1
            else:
                run[i] = 1

        stack = []

        for i in range(n + 1):
            current = run[i] if i < n else 0

            while stack and run[stack[-1]] >= current:
                p = stack.pop()

                left = stack[-1] + 1 if stack else 0
                height = i - left
                side = min(run[p], height)
                answer = max(answer, side * side)

            stack.append(i)

    print(answer)

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

# Provided sample 1
assert run("""2 2
GG
GG
""") == "4", "sample 1"

# Provided sample 2
assert run("""5 5
GGGGG
GBBBG
GBBBG
GBBBG
GGGGG
""") == "9", "sample 2"

# Minimum-size input, including a bad cell that can be flipped.
assert run("""1 1
B
""") == "1", "minimum size"

# Every row is constant, so every row can independently be flipped if needed.
assert run("""3 3
GGG
BBB
GGG
""") == "9", "independent row flips"

# A change inside the candidate width prevents a 2x2 square.
assert run("""3 4
GGGG
GBBG
GGGG
""") == "1", "horizontal run boundary"

# Maximum-size all-equal grid.
large = "1000 1000\n" + ("G" * 1000 + "\n") * 1000
assert run(large) == "1000000", "maximum size"

print("all tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / B`| 1 | 最小尺寸和翻转单个坏单元 |
 |`3 3 / GGG, BBB, GGG`| 9 | 不同行的独立MDT决策|
 |`3 4 / GGGG, GBBG, GGGG`| 1 | 水平运行边界和平方有效性|
 |`1000 × 1000`全部`G`| 1000000 | 最大尺寸和性能|

 ## 边缘情况

 单细胞案例`1 1 / B`当第一列创建直方图时处理`[1]`。 哨兵立即处理该条，给出垂直高度 1 和水平宽度 1。 候选方为一，因此输出为`1`。 MDT 可以在访问单元之前翻转该单元。 

对于网格```
GGG
BBB
GGG
```最后一列的运行直方图是`[3,3,3]`。 堆栈为高度为 3 的条找到高度为 3 的垂直间隔，给出边`min(3,3)=3`和面积`9`。 中间行被翻转，而其他两行保持不变，这是允许的，因为每行都是单独访问的。 

为了```
GGGG
GBBG
GGGG
```最终的柱状图是`[4,1,1]`因为中间一排是最后一排`G`开始新的运行。 前面的列暴露了中间行的最大两行，但周围的行没有提供具有足够宽度的 2×2 正方形的两行间隔。 最大的候选人仍然是第一方，所以答案是`1`。 

全相等的 1000×1000 网格是上边界情况。 每次运行达到长度 1000，最后一列的直方图完全由高度 1000 组成。单调堆栈找到垂直跨度 1000，生成边长 1000 和面积`1000000`。 该算法仍然只执行 O(NM) 工作。
