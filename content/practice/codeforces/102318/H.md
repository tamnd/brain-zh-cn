---
title: "CF 102318H - 最大 NOI 子序列"
description: "该问题要求我们处理一个整数数组，并针对 (k) 的每个可能值，确定可以将多少个数组元素选择到递增子序列的集合中。 每个选定的子序列必须至少包含 (k) 个元素。"
date: "2026-08-13T05:24:59+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102318
codeforces_index: "H"
codeforces_contest_name: "UCF Locals 2017"
rating: 0
weight: 102318
solve_time_s: 240
verified: true
draft: false
---

[CF 102318H - 最大 NOI 子序列](https://codeforces.com/problemset/problem/102318/H)

 **评级：** -
 **标签：** -
 **求解时间：** 4m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们处理一个整数数组，并针对 (k) 的每个可能值，确定可以将多少个数组元素选择到递增子序列的集合中。 

每个选定的子序列必须至少包含 (k) 个元素。 两个选定的子序列在原始数组中必须不重叠。 如果一个子序列使用从 (i) 到 (j) 的位置，则另一个子序列不能使用 (i) 和 (j) 之间的任何位置，即使该位置本身未被选择。 目标是最大化所有子序列中选定元素的总数。 所需的输出包含从 (1) 到 (n) 的每 (k) 个答案。 这是原始 UCF Locals 问题所使用的精确公式，其中 (n\le100) 并且最多可以有 50 个测试用例。 

小值 (n\le100) 会极大地改变算法目标。 三次算法对一个测试用例执行大约 (100^3=10^6) 个基本运算，这是完全合理的，即使在编译实现中对所有 50 个用例重复时也是如此。 指数算法在 (n=100) 时已经毫无希望，因为 (2^{100}) 约为 (1.27\times10^{30})。 因此，预期的解决方案使用具有 (O(n^3)) 工作量的动态规划。 官方竞赛评论还描述了所有区间 LIS 值的 (O(n^3)) 预处理阶段，然后是另一个 (O(n^3)) 动态程序。 

有几种边缘情况可能会使更简单的实现变得不正确。 例如，如果数组只有一个元素`1 5`，唯一有效的答案是`1`，因为对于 (k=1) 该元素本身形成一个子序列。 对于 (k>1) 没有有效的子序列，但当 (n=1) 时 (k) 不存在这样的值，因此输出很简单`1`。 将每个答案初始化为零而不处理单元素间隔的实现在这里会失败。 

重复值是另一种边界情况，因为子序列必须严格递增。 对于输入`3 / 1 1 1`，正确的输出是`3 0 0`。 对于（k=1），每个单独的元素可以形成其自己的子序列，给出三个选定的元素。 然而，对于 (k=2)，没有两个相等的元素形成严格递增的子序列。 粗心的 LIS 转换使用`<=`而不是`<`会错误地声称该数组包含长度为 3 的递增子序列。 

当最佳集合不使用最终数组元素时，会出现第三种边缘情况。 考虑`5 / 2 9 1 3 4`。 对于 (k=2)，子序列`[2, 9]`和`[3, 4]`选择四个元素，而最后一个元素已经是`[3,4]`这里。 更一般地，前缀的最佳解决方案可能会保留其最终位置未使用。 因此，前缀 DP 必须允许转换`dp[i] = dp[i-1]`。 坚持最终元素属于最终子序列的实现可能会丢失有效的解决方案。 

最后，不同的子序列不能仅仅在其选定的索引中不相交。 它们的整个索引范围必须是不相交的。 在`2 1 9 3 4 4 5 6`当 (k=2) 时，最优解为`[2,9]`,`[3,4]`,`[4,5,6]`，给出七个选定元素。 两次出现`4`属于不同的子序列，但它们的索引范围不重叠。 这就是为什么 DP 必须将数组分割成连续的区域，并从每个选定的区域中获取一个递增的子序列，而不是独立地选择任意不相交的索引集。 

## 方法

 直接的强力解决方案可以枚举数组位置的每个子集，然后确定这些选定位置是否可以分为长度至少为 (k) 的有效递增子序列，同时还遵守非重叠条件。 在我们检查特定子集是否有效之前，已有 (2^n) 个子集。 如果有效性检查检查所选位置和可能的边界，则需要多项式时间，因此总工作量至少为 (O(2^n n^2))。 在 (n=100) 时，仅子集计数就约为 (1.27\times10^{30})，因此无法进行穷举搜索。 

蛮力会失败，因为它将每个位置选择都视为与其他所有选择无关。 有用的结构是非重叠为我们提供了自然的从左到右的分解。 一旦最后一个子序列被固定，其起始位置之前的所有内容都是一个独立的较小实例。 

下一个观察结果是，如果我们确定一个子序列占据从位置 (l) 到位置 (r) 的区间，则永远没有理由选择小于该区间内最长递增子序列的任何值。 如果该区间的 LIS 长度为 (L) 和 (L\ge k)，则我们可以使用所有 (L) 个元素。 使用较少的元素只会降低目标，并且不会使间隔与另一个子序列更兼容，因为无论如何，间隔内都不允许有其他子序列。 

这将问题减少到两个动态编程层。 首先，计算`lis[l][r]`，完全包含在从 (l) 到 (r) 的连续区间中的最长递增子序列的长度。 有 (O(n^2)) 个间隔，并且简单的 LIS DP 在 (O(n^3)) 时间内计算所有间隔。 这正是官方评论中描述的预处理策略。 

然后修复(k)。 让`dp[r]`是仅使用位置的选定元素的最大数量`0..r`。 有两种可能性。 我们可以保留位置 (r) 不使用，给出`dp[r-1]`。 或者最终的子序列从某个位置（l）开始，占据整个区间`[l,r]`，并贡献`lis[l][r]`元素。 仅当以下情况下才允许这样做`lis[l][r] >= k`。 (l) 之前的所有内容都有贡献`dp[l-1]`。 因此过渡是

 [
 dp[r]=\max\left(dp[r-1],\max_{0\le l\le r,;lis[l][r]\ge k}
 \left(dp[l-1]+lis[l][r]\right)\right)。 
]

 (k) 有 (n) 个可能的值、(n) 个可能的右端点和 (n) 个可能的起点，因此第二阶段也需要 (O(n^3)) 时间。 官方编辑风格的评论呈现了相同的分解，将最后选择的子序列视为某个先前断点之后后缀的 LIS。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | (O(2^n n^2)) | (O(n)) | (O(n)) | 太慢了|
 | 最佳| (O(n^3)) | (O(n^2)) | 已接受 |

 ## 算法演练

 1.读取数组并创建二维表`lis`， 在哪里`lis[l][r]`最终将包含间隔的 LIS 长度`a[l:r+1]`。 我们需要这些信息，因为每个选定的子序列都占据连续的位置范围，即使在该范围内选择的元素不需要相邻。 
2. 修复左端点`l`并将间隔一次延长一个位置。 对于每个新的右端点`r`，计算正好结束于的最长递增子序列`r`仅使用位置`l..r`。 对于每个较早的位置`p`，元素在`p`可以先于`a[r]`恰好当`a[p] < a[r]`。 取这些前辈的最大值并加一给出结束于的最佳递增子序列`r`。 
3. 在延长间隔的同时，保持目前看到的最大 LIS 长度。 这给出了`lis[l][r]`，因为 LIS 为`[l,r]`要么结束于`r`或者提前结束。 
4. 对每个可能的重复区间计算`l`。 有 (O(n^2)) 个间隔，每个间隔上的前驱搜索给出 (O(n^3)) 预处理阶段。 
5. 对于每一个 (k)`1`通过`n`，创建前缀DP数组。 让`dp[r]`表示可以从位置中选择的元素的最大数量`0..r`当每个选定子序列的长度至少为`k`。 
6. 通过允许当前位置保持未使用来初始化前缀 DP。 为了`r > 0`, 开始于`dp[r] = dp[r-1]`。 这处理最后一个子序列在位置之前完成的解决方案`r`。 
7.尝试每一个可能的起始位置`l`对于最终的子序列结束于`r`。 如果`lis[l][r] >= k`，该区间可以提供有效的最终子序列。 其贡献是`lis[l][r]`，而它之前的前缀则贡献`dp[l-1]`，或零时`l=0`。 
8. 取所有选择中的最大值`l`。 加工后`r`,`dp[r]`是前缀的最佳答案`r`。 
9. 商店`dp[n-1]`作为这个特定问题的答案`k`，然后重复下一个值`k`。 

为什么它起作用可以从最后一个子序列分解得出。 考虑以结尾的前缀的最佳解决方案`r`。 如果不使用位置`r`，解已经表示为`dp[r-1]`。 否则，让它的最终子序列占据位置`l`通过`r`。 早期选择的子序列不能使用该间隔中的任何位置，因此所有早期选择的元素完全位于内部`0..l-1`并最佳地表示为`dp[l-1]`。 里面`[l,r]`，用 LIS 替换最终子序列不会有什么坏处，因为该间隔对于所有其他子序列都是不可用的，并且较长的递增子序列会贡献更多元素。 转换正是考虑了这些可能性，因此它包含最佳解决方案，并且永远不会构造无效的重叠。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve_case(a):
    n = len(a)

    # lis[l][r] = LIS length inside a[l..r].
    lis = [[0] * n for _ in range(n)]

    for l in range(n):
        ending = [0] * n
        best = 0

        for r in range(l, n):
            cur = 1
            ar = a[r]

            for p in range(l, r):
                if a[p] < ar and ending[p] + 1 > cur:
                    cur = ending[p] + 1

            ending[r] = cur
            if cur > best:
                best = cur

            lis[l][r] = best

    answer = [0] * n

    # Solve the non-overlapping interval problem independently for
    # every required minimum subsequence length k.
    for k in range(1, n + 1):
        dp = [0] * n

        for r in range(n):
            # Leave position r unused.
            if r > 0:
                best = dp[r - 1]
            else:
                best = 0

            # Make [l, r] the interval occupied by the last subsequence.
            for l in range(r + 1):
                length = lis[l][r]

                if length >= k:
                    before = dp[l - 1] if l > 0 else 0
                    value = before + length

                    if value > best:
                        best = value

            dp[r] = best

        answer[k - 1] = dp[n - 1]

    return answer

def main():
    t = int(input())

    out = []

    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        ans = solve_case(a)
        out.append(" ".join(map(str, ans)))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    main()
```第一个嵌套部分构建间隔 LIS 表。 对于固定的`l`,`ending[r]`存储恰好在位置结束的最长递增子序列`r`。 什么时候`a[p] < a[r]`，一个递增的子序列结束于`p`可以通过以下方式扩展`a[r]`。 变量`best`是迄今为止遇到的所有此类结束长度的最大值，这正是当前间隔的 LIS。 

第二个主要部分处理一个值`k`一次。 作业来自`dp[r - 1]`不是可选的簿记。 它代表最优集合在之前停止的可能性`r`，这是错误解决方案的常见来源。 

表达式`dp[l - 1] if l > 0 else 0`处理第一个间隔而不需要哨兵元素。 这可以避免出现相差一的特殊情况`lis`表，同时保持递归接近其数学形式。 

比较`a[p] < ar`一定要严格。 相等的值不能是递增子序列的连续元素。 Python 整数也具有任意精度，因此不存在整数溢出问题。 

该实现计算每个`k`分别因为 (n\le100)。 这使状态定义保持简单并使正确性论证透明。 前缀转换的总数为 (O(n^3))，而间隔 LIS 预处理则贡献另一个 (O(n^3))。 

## 工作示例

 ### 示例 1

 第一个样本是```
8
2 1 9 3 4 4 5 6
2
1 1
3
1 2 3
```对于第一个测试用例，数组是`2 1 9 3 4 4 5 6`。 考虑(k=2)。 有用的前缀 DP 的演变如下。 

|`r`| 间隔结束于`r`用作最终子序列 |`lis[l][r]`|`dp[r-1]`| 最好的`dp[r]`|
 | ---| ---| ---| ---| ---|
 | 0 |`[2]`| 1 | 0 | 0 |
 | 1 |`[2,9]`| 2 | 0 | 2 |
 | 2 |`[1,9]`| 2 | 2 | 2 |
 | 3 |`[3,4]`| 2 | 2 | 4 |
 | 4 |`[4,5]`| 2 | 4 | 4 |
 | 5 |`[4,5]`或另一个有效间隔 | 2 | 4 | 4 |
 | 6 |`[4,5]`-类型间隔| 3 | 4 | 7 |
 | 7 |`[4,5,6]`| 3 | 4 | 7 |

 最终值为`7`，通过获得`[2,9]`,`[3,4]`， 和`[4,5,6]`。 这说明了为什么仅计算整个阵列的一个 LIS 是不够的。 全局 LIS 比从几个不重叠的子序列中获得的元素总数要短。 该测试用例的完整输出是`8 7 6 5 5 0 0 0`。 

### 示例 2

 第二个测试用例是```
2
1 1
```对于（k=1），每个单独的元素都是有效的递增子序列，因此可以单独选择两个元素。 

|`r`|`dp[r-1]`| 有效最终间隔 |`lis[l][r]`|`dp[r]`|
 | ---| ---| ---| ---| ---|
 | 0 | 0 |`[1]`| 1 | 1 |
 | 1 | 1 |`[1]`| 1 | 2 |

 对于(k=2)，唯一的区间包含两个相等的值，因此其严格LIS的长度为一。 不存在有效的子序列，答案为零。 

|`r`|`dp[r-1]`| 长度至少为 2 | 的有效区间`dp[r]`|
 | ---| ---| ---| ---|
 | 0 | 0 | 无 | 0 |
 | 1 | 0 | 无 | 0 |

 结果输出是`2 0`。 这个案例特别证实了平等不能算作渐增的转变。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | (O(n^3)) | 间隔 LIS 预处理需要 (O(n^3))，所有 (n) 个前缀 DP 问题一起需要另一个 (O(n^3))。 |
 | 空间| (O(n^2)) | 区间LIS表包含(n^2)个值； 剩下的DP数组只有(O(n))。 |

 对于 (n\le100)，立方界对于预期的解决方案来说足够小。 官方分析明确指出 (O(n^3)) 区间 LIS 预处理对于这些限制是可行的。 Python 实现使内部循环保持简单，并避免递归、大型临时结构和 LIS 值的重复重新计算。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve_case(a):
    n = len(a)

    lis = [[0] * n for _ in range(n)]

    for l in range(n):
        ending = [0] * n
        best = 0

        for r in range(l, n):
            cur = 1
            ar = a[r]

            for p in range(l, r):
                if a[p] < ar and ending[p] + 1 > cur:
                    cur = ending[p] + 1

            ending[r] = cur
            if cur > best:
                best = cur

            lis[l][r] = best

    answer = [0] * n

    for k in range(1, n + 1):
        dp = [0] * n

        for r in range(n):
            best = dp[r - 1] if r > 0 else 0

            for l in range(r + 1):
                length = lis[l][r]

                if length >= k:
                    before = dp[l - 1] if l > 0 else 0
                    value = before + length

                    if value > best:
                        best = value

            dp[r] = best

        answer[k - 1] = dp[n - 1]

    return answer

def solution(inp):
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    try:
        sys.stdin = io.StringIO(inp)
        sys.stdout = io.StringIO()

        input = sys.stdin.readline
        t = int(input())
        out = []

        for _ in range(t):
            n = int(input())
            a = list(map(int, input().split()))
            out.append(" ".join(map(str, solve_case(a))))

        print("\n".join(out))
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided sample 1
sample1 = """3
8
2 1 9 3 4 4 5 6
2
1 1
3
1 2 3
"""

assert solution(sample1) == """8 7 6 5 5 0 0 0
2 0
3 3 3
""", "provided samples"

# Minimum-size input
assert solution("""1
1
42
""") == "1\n", "single element"

# All equal values
assert solution("""1
3
1 1 1
""") == "3 0 0\n", "strictly increasing requirement"

# Boundary case where the best collection uses separate intervals
assert solution("""1
8
2 1 9 3 4 4 5 6
""") == "8 7 6 5 5 0 0 0\n", "non-overlapping subsequences"

# Maximum-size input, strictly increasing
a = list(range(1, 101))
expected = " ".join(["100"] * 100) + "\n"

assert solution(
    "1\n100\n" + " ".join(map(str, a)) + "\n"
) == expected, "maximum n and fully increasing array"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 42`|`1`| 最小大小和单个有效子序列 |
 |`3 / 1 1 1`|`3 0 0`| LIS 转型中的严格不平等 |
 |`8 / 2 1 9 3 4 4 5 6`|`8 7 6 5 5 0 0 0`| 多个不重叠的子序列 |
 |`100 / 1 2 ... 100`| 100份`100`| 最大值（n），大DP状态，充分增加输入 |

 ## 边缘情况

 对于单元素输入```
1
42
```区间表仅包含`lis[0][0] = 1`。 对于 (k=1)，DP 考虑`[0,0]`，看到长度为 1 的 LIS，并获得`dp[0] = 1`。 输出是`1`。 不涉及人为的零长度子序列。 

对于全等输入```
3
1 1 1
```每个长度至少为 2 的区间的 LIS 长度为 1，因为比较是严格的`<`。 当（k=1）时，DP可以独立选择每个单例区间，给出`3`。 当(k=2`or`k=3`, every interval has LIS shorter than the required threshold, so the answer is zero. The output is `3 0 0`。 

对于非重叠示例```
8
2 1 9 3 4 4 5 6
```当(k=2)时，DP可以首先取`[2,9]`，贡献两个元素。 然后它可以在该间隔之后开始并花费`[3,4]`，另外贡献两个。 最后，`[4,5,6]`贡献三。 总数是七。 DP 的前缀状态记录每个起始位置之前的最佳结果，因此这些间隔组合在一起，而不允许较早的子序列侵入较晚的间隔。 

对于最大尺寸增加的输入```
100
1 2 3 ... 100
```整个数组在递增，所以它的 LIS 是 100。对于每个 (k\le100)，整个数组本身是一个有效的子序列，因为它的长度至少为 (k)。 由于没有解决方案可以选择超过所有 100 个元素，因此每个答案都恰好是 100。此案例使用最大的 DP 维度，同时还提供简单的正确性上限检查。
