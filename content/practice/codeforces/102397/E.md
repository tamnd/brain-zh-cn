---
title: "CF 102397E - 巴沙尔和恶土（困难）"
description: "不变的是，在处理每个新的右端点之前，left 指向所有先前收缩之后的最小可能的左边界。"
date: "2026-08-11T15:48:55+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102397
codeforces_index: "E"
codeforces_contest_name: "Asu Coding Cup 4"
rating: 0
weight: 102397
solve_time_s: 91
verified: true
draft: false
---

[CF 102397E - 巴沙尔和恶土（困难）](https://codeforces.com/problemset/problem/102397/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 31s
 **已验证：** 是的

 ## 解决方案
 ## 为什么它有效

 不变量是在处理每个新的右端点之前，`left`指向所有先前收缩后的最小可能左边界。 每当窗外`[left, right]`达到目标后，只要目标仍然满足，算法就会从左侧删除房屋。 因此，对于这个特殊的`right`，最终有效窗口是结束于的最短有效窗口`right`。 每个可能的最佳片段都有一些右端点，当处理该端点时，算法会找到一个不长于它的窗口。 因此，对所有右端点取最小值会产生全局最短的有效段。 将其房屋数量换算为`k`至步行距离`k - 1`给出所需的答案。 

# Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    x, n = map(int, input().split())
    a = list(map(int, input().split()))

    left = 0
    current_sum = 0
    best = n + 1

    for right in range(n):
        current_sum += a[right]

        while current_sum >= x:
            best = min(best, right - left + 1)
            current_sum -= a[left]
            left += 1

    if best == n + 1:
        print(-1)
    else:
        print(best - 1)

if __name__ == "__main__":
    solve()
```输入被读取一次，并存储数组，以便左端点稍后可以从运行总和中删除其相应的值。 变量`left`和`right`定义当前的连续段，而`current_sum`存储其总计，而不重复对整个段求和。 

外循环将每个房屋添加一次。 一次`current_sum >= x`，内循环尝试删除左侧的房屋。 表达式`right - left + 1`是该段中当前房屋的数量，因此它是滑动窗口过程中必须最小化的数量。 

收缩循环内的操作顺序很重要。 当前窗口之前有效`a[left]`被移除，所以在改变之前必须考虑它的长度`left`。 移除后，窗口可能会变得无效，在这种情况下循环自然停止。 

Python 中不存在整数溢出问题。 最大可能的总数是`10^5 * 10^5 = 10^10`，也可以安全地用 Python 整数表示。 

最后，`best - 1`将最小访问房屋数转换为步行距离。 如果一套房子就足够了`best`是`1`并且打印的距离是正确的`0`。 

# 工作示例

 ## 示例 1

 考虑`x = 12`和`a = [1, 3, 4, 5, 2]`。 有用的窗口最终变成`[3, 4, 5]`，其中包含三栋房屋，步行距离为两栋。 

|`right`| 附加值|`current_sum`收缩前|`left`| 最佳窗口长度|
 | ---| ---| ---| ---| ---|
 | 0 | 1 | 1 | 0 | 没有找到|
 | 1 | 3 | 4 | 0 | 没有找到|
 | 2 | 4 | 8 | 0 | 没有找到|
 | 3 | 5 | 13 | 0 | 3 |
 | 4 | 2 | 11 | 11 1 | 3 |

 在`right = 3`，总和变为 13。 窗口`[1, 3, 4, 5]`有效，则算法删除`1`，离开`[3, 4, 5]`总和为 12。它无法删除另一栋房屋，因为总和将低于 12。因此，该端点需要三栋房屋，对应于距离`3 - 1 = 2`。 

## 示例 2

 对于`x = 13`和`a = [5, 1, 2, 3, 4]`，总和为 15，但没有真子数组达到 13。需要整个数组。 

|`right`| 附加值|`current_sum`|`left`| 最佳窗口长度|
 | ---| ---| ---| ---| ---|
 | 0 | 5 | 5 | 0 | 没有找到|
 | 1 | 1 | 6 | 0 | 没有找到|
 | 2 | 2 | 8 | 0 | 没有找到|
 | 3 | 3 | 11 | 11 0 | 没有找到|
 | 4 | 4 | 15 | 15 0 | 5 |

 当添加最后一个房子时，完整的数组达到 15 个。删除第一个房子将只剩下 10 个，这低于目标，因此 5 个房子的窗口是最小的。 其步行距离为`5 - 1 = 4`。 

# 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(n)`| 右指针从左向右移动一次，左指针也只向前移动一次，所以每个房子最多添加和删除一次。 |
 | 空间|`O(n)`| 该数组存储在内存中，因此左端点可以删除其值。 |

 和`n <= 100000`， 大致`200000`对于滑动窗口部分来说，指针移动就足够了。 这完全在要求的时间限制内，并且存储`100000`整数完全在内存限制之内。 

# 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    x, n = map(int, input().split())
    a = list(map(int, input().split()))

    left = 0
    current_sum = 0
    best = n + 1

    for right in range(n):
        current_sum += a[right]

        while current_sum >= x:
            best = min(best, right - left + 1)
            current_sum -= a[left]
            left += 1

    print(-1 if best == n + 1 else best - 1)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()
    result = sys.stdout.getvalue().strip()

    sys.stdin = old_stdin
    sys.stdout = old_stdout

    return result

# Provided samples, interpreted according to the displayed input.
assert run("12 5\n1 3 4 5 2\n") == "2", "sample 1"
assert run("13 5\n5 1 2 3 4\n") == "4", "sample 2"
assert run("6 5\n1 1 1 1 1\n") == "-1", "sample 3"

# Minimum-size input, one house is enough, so no walking is required.
assert run("7 1\n7\n") == "0", "single house exactly reaches target"

# One house is enough even though other houses exist.
assert run("5 3\n2 5 1\n") == "0", "single-house window"

# Entire array is required.
assert run("10 4\n1 2 3 4\n") == "3", "whole array required"

# All values equal, target reached by the first three houses.
assert run("9 5\n3 3 3 3 3\n") == "2", "equal values"

# Target cannot be reached.
assert run("100 4\n10 20 30 39\n") == "-1", "insufficient total"

# Maximum-size input.
n = 100000
assert run(f"{n} {n}\n" + " ".join(["1"] * n) + "\n") == str(n - 1), \
    "maximum-size all-equal input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`7 1 / 7`|`0`| 最小尺寸和零步行距离 |
 |`5 3 / 2 5 1`|`0`| 满足目标的独栋住宅|
 |`10 4 / 1 2 3 4`|`3`| 需要整个数组并捕获`length`相对`distance`错误|
 |`9 5 / 3 3 3 3 3`|`2`| 重复值和精确收缩 |
 |`100 4 / 10 20 30 39`|`-1`| 黄金总量不足|
 |`100000 100000 / 1 ... 1`|`99999`| 最大限度`n`和线性时间行为|

 # 边缘情况

 一套房子就可以满足这个目标。 为了`x = 5`,`n = 3`， 和`a = [2, 7, 1]`，当窗口达到目标时`right = 1`。 该算法记录的窗口长度为`1`去掉前面的后`2`从窗口。 它无法删除`7`因为这会使总和为零，所以`best = 1`答案是`best - 1 = 0`。 关键细节是从一所房子步行到其本身的成本为零。 

如果黄金总量不足，收缩循环永远无法产生有效的最终答案。 为了`x = 10`和`a = [2, 3, 4]`，达到的最大总和是 9。`best`保持其哨兵值，因此算法打印`-1`而不是将最后一个部分窗口视为解决方案。 

当需要整个数组时，窗口仅在最后一个位置到达目标。 为了`x = 10`和`a = [1, 2, 3, 4]`，总和变为 10`right = 3`。 窗口长度为 4，并且移除`1`立即将总和降至 9，因此它是最小的。 答案是`4 - 1 = 3`，代表四个宫位之间的三个运动。 

当多个房屋达到目标时，距离转换也很重要。 如果最优窗口是`[l, r]`， 有`r - l + 1`房屋但仅`r - l`第一个和最后一个房子之间的台阶。 直接返回窗口长度会在每个有效答案上引入相差一的错误，包括正确距离为零的最简单情况。 

数组的正性使得滑动窗口有效。 如果允许负值，则删除最左边的值可能会增加总和，并且单调收缩参数将不再成立。 在给定的约束下，每栋房子都贡献一个正数，因此每个指针只向前移动，并且线性界限得到保证。
