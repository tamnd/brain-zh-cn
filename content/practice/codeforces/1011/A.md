---
title: "CF 1011A - 阶段"
description: "我们得到了一组字符，每个字符代表一个火箭级，其内在成本等于其在字母表中的位置。"
date: "2026-06-16T22:42:24+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1011
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 499 (Div. 2)"
rating: 900
weight: 1011
solve_time_s: 103
verified: true
draft: false
---

[CF 1011A - 阶段](https://codeforces.com/problemset/problem/1011/A)

 **评分：** 900
 **标签：** 贪婪、实现、排序
 **求解时间：** 1m 43s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一组字符，每个字符代表一个火箭级，其内在成本等于其在字母表中的位置。 从这个多重集中，我们必须精确地选择 k 个不同的阶段，并按照遵守严格兼容性规则的顺序排列它们：当字母 x 的阶段后面跟着字母 y 的阶段时，字母 y 在字母表中必须比 x 至少晚两个位置。 换句话说，如果 x 是第 i 个字母，则 y 必须至少为 i+2 或更大。 

任务是从给定的字符串中选择 k 个字母并对它们进行排序，以便该约束适用于每个相邻对，同时最小化所选字母的总字母表总和。 如果不可能选择满足排序约束的 k 个字母，则答案为 -1。 

约束条件 n ≤ 50 使得对子集的暴力破解原则上是合理的。 最多有 2^50 个子集，这已经太大了，但额外的排序约束使大多数子集无效。 然而，如果简单地进行过滤子集，其成本仍然太高。 更重要的观察是，约束的结构仅取决于所选字母的排序顺序，这将问题简化为选择有效的子序列而不是任意排列。 

关键的边缘情况是所有选定的字母在字母表中都很接近。 例如，如果我们被迫选择“b”和“c”等字母，则条件将失败，因为它们仅相差一个位置。 另一个边缘情况是当输入有很多小字母但 k 很大时，即使存在足够的字符也无法维持间距规则。 

## 方法

 一种直接的方法是尝试每个大小为 k 的子集，对其进行排序，并检查其是否满足间距规则。 这是正确的，因为任何有效的解决方案都对应于某个子集，并且该子集的任何遵守约束的排序也必须严格按字母顺序递增。 然而，子集的数量为C(n,k)，在最坏的情况下约为2^50，远远超出了可行的限制。 

关键的观察是，一旦我们对所选字符进行排序，它们的顺序就固定了。 然后约束就变成局部的：对于任何相邻的选定字母，它们的数值必须至少相差 2。这将问题转化为从排序数组中选择 k 个元素，使得连续选定的元素有足够的空间，同时最小化总和。 

这种结构提出了对排序字符的贪婪策略：我们想要选择尽可能小的字母，但我们也必须遵守间距约束。 由于选择较小的字母永远不会损害可行性，除非它会阻止未来的选择，因此我们可以按排序顺序处理字母，并贪婪地决定是否采用每个字母或跳过它，具体取决于它是否可以扩展长度为 k 的有效序列。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力子集 | O(2^n·k) | O(2^n·k) | O(k) | 太慢了 |
 | 贪婪扫描已排序的字母 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

1. 将每个字符转换为其从 1 到 26 的数字权重，因为优化仅取决于这些值。 
2. 按升序对权重数组进行排序。 这是合理的，因为任何最优解都可以在不违反约束的情况下重新排列成排序顺序，并且约束在排序方面是单调的。 
3. 保持动态编程状态，我们跟踪不同长度序列的最后选择的最小可能值。 具体来说，dp[j] 表示当我们选择了 j 个元素时最后选择的最小可能值。 
4. 初始化 dp[0] = -无穷大，并将所有其他 dp 值初始化为无穷大。 基本情况对应于尚未选择任何内容。 
5. 逐一迭代排序后的权重。 对于每个权重 x，将 dp 数组从 k 向后更新为 1。对于每个 j，我们检查 x 是否可以扩展长度为 j-1 的有效序列，这意味着 x 必须至少为 dp[j-1] + 2。如果是，我们将 dp[j] 更新为其当前值和 x 之间的最小值。 
6. 处理完所有元素后，如果 dp[k] 仍然无穷大，则不存在有效选择。 否则，dp[k]是最后一个元素可能的最小值，但我们真正想要的是所选元素的总和。 为了正确跟踪总和，我们将 dp 保持为最小总和而不是最后一个值。 
7. 因此，将 dp[j] 重新定义为使用 j 个有效元素可实现的最小和，并相应地更新它：如果 x 可以扩展 dp[j-1]，则设置 dp[j] = min(dp[j], dp[j-1] + x)。 

### 为什么它有效

 DP 不变量是 dp[j] 存储迄今为止处理的 j 个元素的任何有效选择的最小可能总和，其中有效性包括相对于最后选择的元素的间距约束。 因为我们按升序处理元素，所以任何以 x 结尾的有效序列只能由更早或相等的候选者改进。 该转换考虑了将 x 附加到有效 (j-1) 长度序列的所有方法，并采用最小值保留了最优性。 由于每个有效解决方案都可以按排序顺序增量构建，因此不排除任何最佳解决方案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, k = map(int, input().split())
    s = input().strip()

    a = sorted(ord(c) - ord('a') + 1 for c in s)

    INF = 10**18
    dp = [INF] * (k + 1)
    dp[0] = 0

    for x in a:
        for j in range(k, 0, -1):
            if dp[j - 1] != INF:
                # enforce spacing constraint
                if j == 1 or True:
                    # for j > 1 we still need to ensure gap constraint
                    # but since we are not tracking last value, we must encode differently
                    pass
        # corrected DP below
        pass

    # correct solution: need state with last value tracking
    dp = [[INF] * 27 for _ in range(k + 1)]
    for i in range(27):
        dp[0][i] = 0

    for x in a:
        for j in range(k, 0, -1):
            for last in range(27):
                if dp[j - 1][last] != INF:
                    if j == 1 or x >= last + 2:
                        dp[j][x] = min(dp[j][x], dp[j - 1][last] + x)

    ans = min(dp[k])
    print(-1 if ans == INF else ans)

if __name__ == "__main__":
    solve()
```该实现使用二维 DP，其中第二维跟踪最后选择的字符值。 这是必要的，因为间距约束取决于相邻性，而不仅仅是选择大小。 每个dp[j][last]表示选择j个元素的最小总和，其中最后选择的值等于last。 当处理新字符 x 时，我们要么开始一个新序列，要么仅当 x 至少为最后一个 + 2 时才扩展现有序列。 

最终版本中不需要对 j 进行反向迭代，因为转换仅依赖于前一层 dp[j-1]。 该结构自然地强制增加序列长度，同时保留可行性约束。 

## 工作示例

 ### 示例 1

 输入：```
5 3
xyabd
```排序权重：a=1、b=2、d=4、x=24、y=25

 我们从概念上跟踪 dp[j][last] 转换：

 | 步骤| 选择 x | j=1 最好 | j=2 最好 | j=3 最好 |
 | --- | --- | --- | --- | --- |
 | 开始 | - | (1,2,4,24,25) | 信息 | 信息 |
 | 一个 | 1 | 1 | 信息 | 信息 |
 | 乙| 2 | 1 | 3 (a,b 无效，跳过) | 信息 |
 | d | 4 | 1 | 3 | 7（a、d、x 路径开始形成）|
 | x| 24 | 1 | 3 | 7 |
 | y | 25 | 25 1 | 3 | 7 |

 最佳有效三元组是 a-d-x，总和为 29，确认 dp 的结果为 29。 

### 示例 2（已构建）

 输入：```
4 2
abcd
```权重：1,2,3,4

 我们需要两个间隙≥2的元素。 

| 步骤| x| 形成有效对| 最佳总和|
 | --- | --- | --- | --- |
 | 一个 | 1 | - | 1 |
 | 乙| 2 | - | 1 |
 | c | 3 | (a,c) | 4 |
 | d | 4 | (a,d),(b,d) 无效，除了 (a,d) | 5 |

 使用(a,c)答案是4。 

该跟踪显示了邻接约束如何修剪连续的选择，但允许跳过一个位置。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·k·26) | k 状态上的 DP 和最后值维度高达 26 |
 | 空间| O(k·26) | 存储所有长度和最后值的 DP 表

 当 n ≤ 50 且 k ≤ 50 时，这可以在限制内顺利运行，因为总操作最多为几万次。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque

    n, k = map(int, sys.stdin.readline().split())
    s = sys.stdin.readline().strip()
    a = sorted(ord(c) - 97 + 1 for c in s)

    INF = 10**18
    dp = [[INF] * 27 for _ in range(k + 1)]
    for i in range(27):
        dp[0][i] = 0

    for x in a:
        for j in range(k, 0, -1):
            for last in range(27):
                if dp[j - 1][last] != INF:
                    if j == 1 or x >= last + 2:
                        dp[j][x] = min(dp[j][x], dp[j - 1][last] + x)

    ans = min(dp[k])
    return str(-1 if ans == INF else ans)

# provided sample
assert run("5 3\nxyabd\n") == "29"

# minimum size impossible
assert run("2 2\nab\n") == "-1"

# simple valid spaced case
assert run("3 2\nace\n") == "4"

# all equal letters
assert run("5 3\naaaaa\n") == "-1"

# large spacing easy
assert run("4 2\nazzz\n") == "27"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 5月3日，xyabd | 29 | 29 标准优选 |
 | 2 2，ab | -1 | 由于相邻而不可能 |
 | 3 2、王牌 | 4 | 最佳间距对 |
 | 啊啊啊| -1 | 重复项无法形成有效链 |
 | a、z、z、z | 27 | 27 贪婪跳过处理|

 ## 边缘情况

 像 k=2 的“ab”这样紧密排列的字母表段立即违反了间距规则。 DP 正确地拒绝从 'a' 到 'b' 的任何转换，因为 b < a + 2，因此 dp[2] 永远不会变得有限。 

具有许多小字母和一个大字母的情况（例如 k=2 的“aaaaaz”）仍然有效，因为最佳选择是 (a, z)。 DP 从 dp[1] 处的 a 开始，随后允许 z 扩展它，因为 z ≥ a + 2 成立。 

当所有字符都相同时，每次尝试形成长度大于 1 的序列都会失败，因为第二个选择不能相差至少 2。DP 仅保持 dp[1] 有效，并留下更高的状态无限，根据需要生成 -1。
