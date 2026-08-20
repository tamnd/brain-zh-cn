---
title: "CF 102185H - LOCALC++"
description: "日志是由空格分隔的数字组序列。 每个原始非负整数都是通过采用其普通十进制表示形式并从右侧每三位数字插入分隔符来打印的。"
date: "2026-08-19T15:41:00+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102185
codeforces_index: "H"
codeforces_contest_name: "Southern Russia Open Championship \u2013 ContestSFedU 2019, Team Final."
rating: 0
weight: 102185
solve_time_s: 160
verified: true
draft: false
---

[CF 102185H - LOCALC++](https://codeforces.com/problemset/problem/102185/H)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 40s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 日志是由空格分隔的数字组序列。 每个原始非负整数都是通过采用其普通十进制表示形式并从右侧每三位数字插入分隔符来打印的。 我们必须恢复有多少个不同的原始整数序列可以精确地产生这个组序列，并且每个整数都严格小于 (10^K)。 

输入给出了 (N) 个按其确切顺序排列的组和数字限制 (K)。 我们并不是重建数值本身。 我们正在计算在相邻组之间放置边界的可能方法，以便每个结果块都是有效的格式化十进制整数，并且最多包含 (K) 个数字。 

代表一个整数的块具有非常特定的形状。 它的第一组有一位、两位或三位数字，但禁止使用前导零，并且后面的每个组必须恰好有三位数字。 涉及零的唯一例外是整数`0`，其表示由单个组组成`0`。 具有第一组的块，例如`003`是不可能的，尽管`003`作为一组又一组是完全有效的。 块中的总位数也必须最多为 (K)，因为该整数严格小于 (10^K)。 

这些约束排除了二次动态规划。 对于 (N=2\cdot10^5)，(O(N^2)) 转换循环在最坏的情况下执行大约 (N^2/2=2\cdot10^{10}) 次检查，远远超出一秒的限制。 预期的解决方案必须仅处理每个输入组恒定的次数，从而给出 (O(N)) 算法。 

有几种边界情况很容易处理不当。 考虑```
1 3
0
```恰好有一个可能的整数序列，即单个整数零，所以答案是`1`。 治疗`0`就像普通的第一组后面可以跟三位数组一样，会错误地允许非规范表示。 

连续组内允许有前导零。 例如，```
2 4
1 000
```有答案`1`，因为这两个群构成整数`1000`。 拒绝包含前导零的每个组的解决方案将错误地拒绝这种情况。 

数字限制是准确的。 为了```
2 5
999 999
```两组不能形成一个数字，因为这需要六位数字。 它们必须是两个独立的整数，所以答案是`1`。 当(K=6)时，分割数和合并数都可以，给出答案`2`。 

少于三位数的组不能是延续。 例如，```
3 7
10 500 4
```只能拆分为`10 500`和`4`，所以答案是`1`。 仅检查位数但忘记三位数延续规则的转换将错误地计算包含所有三组的单个数字。 

## 方法

 直接动态规划解决方案以 (dp[i]) 开始，即表示前 (i) 组的方法数量。 对于每个位置 (i)，我们可以尝试最后一个整数的每个可能的起始位置 (j)。 然后我们检查组 (j,\ldots,i) 是否构成合法表示以及其位数是否最多为 (K)。 如果是，我们将 (dp[j-1]) 添加到 (dp[i])。 

这是正确的，因为前缀的每个表示都恰好有最后一个整数，因此该整数的可能起始位置将所有解决方案划分为不相交的情况。 问题在于转换的数量。 可以有 (\Theta(N^2)) 对 ((j,i))，对于 (N=2\cdot10^5) 来说，大约是 (2\cdot10^{10}) 个检查。 

格式化整数的结构为我们提供了缺失的优化。 一旦选择了整数的第一组，后面的每个组都必须恰好具有三位数字。 因此，在扫描连续的三位数组时，可能的起始位置形成一个连续的范围。 数字限制还将此范围限制为固定的最大组数。 

在这样的一轮中，最多有一个可能的起始位置少于三位数。 它是紧邻三位数组运行之前的组。 其贡献可以单独处理。 所有其他可能的起始都是三位数组，它们的贡献形成 (dp[j-1]) 值的滑动区间。 前缀和可以让我们在恒定时间内获得整个间隔。 

暴力 DP 之所以有效，是因为考虑了所有可能的先前边界。 它失败了，因为有太多边界需要检查。 合法的连续性被迫为三位数的观察结果将这些许多转换转变为范围总和，从而将整个计算减少到线性时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| --- | ---| --- |
 | 暴力 DP 跨越之前的所有边界 | (O(N^2)) | (O(N)) | 太慢了 |
 | 有效三位数开头的前缀总和 | (O(N)) | (O(N)) | 已接受 |

 ## 算法演练

 1. 定义(dp[i])为其格式化输出恰好是前(i)组的有效原始整数序列的数量。 设置(dp[0]=1)，代表空前缀。 
2. 从左到右处理组。 如果当前组的数字少于三位，则无法继续之前开始的整数。 它必须是新整数的完整表示，因此当该组是有效的独立十进制表示时，(dp[i]) 要么是 (dp[i-1])，否则为零。 
3. 记住最近一组长度不为三的组。 在该位置和当前位置之间，每组都是三位数。 如果当前组有三位数字，则此处结尾的任何整数要么从本次运行中的三位数组之一开始，要么从记住的较短组开始。 
4. 对于位置(j)处的三位数起始组，从(j)到(i)的组数为(i-j+1)。 每个组贡献三位数字，因此在以下情况下允许使用整数：
 [
 3(i-j+1)\le K.
 ]
 因此有效的三位数开始满足
 [
 j\ge i-\left\lfloor\frac K3\right\rfloor+1。 
]
 只有当前连续运行的三位数组内的开始才是相关的。 
5. 只有当其第一个字符非零时，三位数组才能成为第一组。 将 (dp[j-1]) 存储在前缀和中的每个此类位置 (j)。 然后在恒定时间内获得所有当前有效的三位数起始值的总和。 
6. 在当前运行之前单独处理较短的一组。 如果其长度为 (L<3)，则从此处开始一个整数并以 (i) 结束需要
 [
 L+3(i-j)\le K,
 ]
 其中 (j) 是该较短组的位置。 仅当这样的组是合法的独立十进制前缀并且不是时，它才是有效的第一组`0`， 因为`0`不能被更多的团体跟随。 
7. 将有效的三位数起始值和可能的较短起始值的贡献相加。 所得总和为 (dp[i])。 将其按模 (10^9+7) 减少。 
8. 输出 (dp[N])，计算整个日志上整数边界的每个有效位置。 

不变的是，在处理位置 (i) 后，(dp[i]) 精确计算划分前 (i) 个组的有效方法。 每个可能的最后一个整数都按其第一组进行唯一分类。 如果第一组有三位数，则它属于维护的三位数范围。 否则它一定是最近的较短组。 前缀和正好包含满足格式化规则和 (K) 位界限的三位数开始，而单独的较短组检查则处理唯一剩余的可能性。 因此，没有有效分区被忽略，也没有无效分区被计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 1_000_000_007

def solve():
    n, k = map(int, input().split())
    a = input().split()

    dp = [0] * (n + 1)

    # pref[i] = sum of dp[j - 1] for valid three-digit starts j <= i.
    pref = [0] * (n + 1)

    dp[0] = 1

    # Last position whose group has length different from 3.
    last_short = 0

    max_three_groups = k // 3

    for i in range(1, n + 1):
        s = a[i - 1]
        length = len(s)

        if length == 3:
            # This position may be the first group of an integer only
            # if it does not start with zero.
            if s[0] != '0':
                pref[i] = (pref[i - 1] + dp[i - 1]) % MOD
            else:
                pref[i] = pref[i - 1]

            # All three-digit starts must lie in the current run.
            left = max(last_short + 1, i - max_three_groups + 1)

            ways = (pref[i] - pref[left - 1]) % MOD

            # The group immediately before this run may itself be
            # the first group of the integer.
            if last_short:
                t = a[last_short - 1]
                tlen = len(t)

                # "0" can only represent the integer zero by itself.
                valid_as_first = t != "0" and t[0] != '0'

                if valid_as_first:
                    digits = tlen + 3 * (i - last_short)
                    if digits <= k:
                        ways += dp[last_short - 1]
                        ways %= MOD

            dp[i] = ways

        else:
            # A group shorter than three digits cannot continue a
            # previously started integer.
            if s == "0" or s[0] != '0':
                dp[i] = dp[i - 1]
            else:
                dp[i] = 0

            pref[i] = pref[i - 1]
            last_short = i

    print(dp[n] % MOD)

if __name__ == "__main__":
    solve()
```数组`dp`实现演练中的动态编程状态。 价值`dp[i-1]`处理位置 (i) 时已经知道，因此可以立即将其用作从 (i) 开始的新整数的贡献。 

这`pref`数组仅存储来自合法第一组的三位数组的贡献。 在位置 (j) 处，贡献为`dp[j - 1]`，因为 (j) 之前的所有内容都已被分区，并且新整数从 (j) 开始。 

下界`left`结合了两个独立的限制。`last_short + 1`防止候选人跨越少于三位数的组，同时`i - max_three_groups + 1`对第一组也有三位数字的号码强制执行 (K) 位数字限制。 

单独检查当前三位数运行之前的较短组。 它的第一组长度可能是一或二，因此它后面的三位数组的最大数量取决于该确切长度而不是简单地取决于`K // 3`。 

的特殊待遇`"0"`是必要的，因为零的十进制表示不包含其他组。 一个令牌，例如`"000"`允许在数字内使用，但不能是其第一组。 

Python 整数不会溢出，但所有 DP 和前缀和加法都会按模 (10^9+7) 减少，以便存储的值保持较小。 每个数组都对 DP 位置使用基于 1 的索引，这使得`dp[j - 1]`直接对应于组（j）的可能开始。 

## 工作示例

 对于第一个样本，```
8 7
10 500 303 4 507 89 654 003
```我们有(K//3=2)，所以第一组有三位数的数字最多可以包含两组。 

| 我| 集团| 最后一个较短的组 | 三位数开始贡献| dp[i] | dp[i] |
 | ---| --- | --- | ---| --- |
 | 0 | 空 | 0 | 无 | 1 |
 | 1 |`10`| 1 | 无 | 1 |
 | 2 |`500`| 1 |`500`| 2 |
 | 3 |`303`| 1 |`500`,`303`| 3 |
 | 4 |`4`| 4 | 无 | 3 |
 | 5 |`507`| 4 |`507`| 6 |
 | 6 |`89`| 6 | 无 | 6 |
 | 7 |`654`| 6 |`654`| 12 | 12
 | 8 |`003`| 6 | 没有，因为`003`无法启动| 6 |

 在位置 8 处，`003`只能是延续，但前面的`89`无法继续下去，因为以以下开头的数字`89`将有三位数字加上另外三位数字，总共六位数字，这是允许的。 从一开始的贡献已经表示为`dp[6]`。 最终的答案是`6`。 

对于第二个样本，```
3 6
328 032 0
```前两组可以组成六位整数`328032`。 第二组不能开始一个新的整数，因为它的第一位数字为零。 决赛`0`必须是一个单独的整数。 

| 我| 集团| 最后一个较短的组 | 三位数开始贡献| dp[i] | dp[i] |
 | ---| ---| ---| ---| ---|
 | 0 | 空 | 0 | 无 | 1 |
 | 1 |`328`| 0 |`328`| 1 |
 | 2 |`032`| 0 | 无 | 1 |
 | 3 |`0`| 3 | 无 | 1 |

 前两组给出一个有效数字，最后一组给出一个整数。 没有替代的分割，因为`032`不是有效的第一组。 答案是`1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | (O(N)) | 每个组都处理一次，并且每个转换都通过恒定时间前缀和进行评估。 |
 | 空间| (O(N)) | DP 和前缀和数组包含 (N+1) 个值。 |

 对于 (N\le2\cdot10^5)，算法每组仅执行恒定量的工作。 内存使用量与 (N) 呈线性关系，完全在 256 MB 限制内。 

## 测试用例```python
# helper: run the solution logic on an input string
import io
import sys

MOD = 1_000_000_007

def solve_data(inp: str) -> str:
    data = inp.split()
    it = iter(data)

    n = int(next(it))
    k = int(next(it))
    a = [next(it) for _ in range(n)]

    dp = [0] * (n + 1)
    pref = [0] * (n + 1)

    dp[0] = 1
    last_short = 0
    max_three_groups = k // 3

    for i in range(1, n + 1):
        s = a[i - 1]
        length = len(s)

        if length == 3:
            if s[0] != '0':
                pref[i] = (pref[i - 1] + dp[i - 1]) % MOD
            else:
                pref[i] = pref[i - 1]

            left = max(last_short + 1, i - max_three_groups + 1)

            ways = (pref[i] - pref[left - 1]) % MOD

            if last_short:
                t = a[last_short - 1]
                tlen = len(t)

                valid_as_first = t != "0" and t[0] != '0'

                if valid_as_first:
                    digits = tlen + 3 * (i - last_short)
                    if digits <= k:
                        ways += dp[last_short - 1]
                        ways %= MOD

            dp[i] = ways

        else:
            if s == "0" or s[0] != '0':
                dp[i] = dp[i - 1]
            else:
                dp[i] = 0

            pref[i] = pref[i - 1]
            last_short = i

    return str(dp[n] % MOD)

def run(inp: str) -> str:
    return solve_data(inp)

# Provided sample 1
assert run(
    """8 7
10 500 303 4 507 89 654 003
"""
) == "6", "sample 1"

# Provided sample 2
assert run(
    """3 6
328 032 0
"""
) == "1", "sample 2"

# Minimum-size input, the only number is zero.
assert run(
    """1 3
0
"""
) == "1", "minimum case"

# Exact digit boundary: 6 digits fit when K=6, but not when K=5.
assert run(
    """2 6
999 999
"""
) == "2", "exact six-digit boundary"

assert run(
    """2 5
999 999
"""
) == "1", "five-digit boundary"

# Leading zero is valid only as a continuation group.
assert run(
    """2 4
1 000
"""
) == "1", "leading-zero continuation"

# All groups are valid starts, but K=3 permits only one group per number.
assert run(
    """3 3
999 999 999
"""
) == "1", "all equal groups"

# Maximum N with a simple answer. K=3 forces every group to be separate.
n = 200_000
inp = f"{n} 3\n" + " ".join(["999"] * n) + "\n"
assert run(inp) == "1", "maximum N"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 3 / 0`|`1`| 最小输入和零的特殊表示 |
 |`2 6 / 999 999`|`2`| 精确的 (K) 位边界和两个可能的分区 |
 |`2 5 / 999 999`|`1`| 数字限制中的差一位错误 |
 |`2 4 / 1 000`|`1`| 仅允许连续组使用前导零 |
 |`3 3 / 999 999 999`|`1`| 重复组和三位数最大值|
 |`200000 3 / 999 ... 999`|`1`| 最大值 (N) 和线性时间行为 |

 ## 边缘情况

 对于零情况，```
1 3
0
```该组的长度小于三，并被视为有效的独立表示。 算法集`dp[1]=dp[0]=1`。 它不治疗`0`作为后面三位数组的候选较短前缀，因此非规范表示例如`0 123`永远不会被计算在内。 

对于前导零延续，```
2 4
1 000
```第一组`1`是一个有效的短期启动。 在第二个位置上，`000`不能是新整数，但可以继续从以下位置开始的整数`1`。 总长度为(1+3=4)，在限制范围内，所以`dp[2]=1`。 

对于精确边界，```
2 6
999 999
```三位数的起始窗口允许两组，因为 (3\cdot2=6)。 两个可能的开始是第一组和第二组，产生两个分区`[999,999]`和`[999] [999]`。 因此`dp[2]=2`。 

当(K=5)代替时，```
2 5
999 999
```两个三位数组将需要六位数，因此第一组无法吸收第二组。 仅保留分割分区，给出`dp[2]=1`。 下界`i - K//3 + 1`正确地删除了两组过渡。 

对于一个强行划定边界的小团体来说，```
3 7
10 500 4
```前两组可以形成`10500`， 尽管`4`只有一位数字并且不能继续该数字。 当处理位置 3 时，算法将重置三位数运行`4`并获得`dp[3]=dp[2]`。 答案是`1`。 

最后，最大规模测试包含 200,000 个组。 对于 (K=3)，任何整数都不能包含两个三位数组，因此唯一有效的分区将每个组作为单独的整数。 该算法仍然对每组执行一次恒定时间更新并返回`1`，证明了为什么线性复杂度对于原始约束是必要的。
