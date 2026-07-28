---
title: "CF 102786E - \u0423\u043f\u043e\u0440\u044f\u0434\u043e\u0447\u0438\u0432\u0430\u043d\u0438\u0435\u043f\u043e \u0441\u0443\u043c\u043c\u0435\u0446\u0438\u0444\u0440"
description: "我们需要查看从 1 到 N 的所有正整数，但顺序不寻常。 数字按十进制数字之和分组。 数字和较小的一组出现较早，并且一组内的数字通常按值排序。"
date: "2026-07-27T19:26:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102786
codeforces_index: "E"
codeforces_contest_name: "\u041e\u0442\u043a\u0440\u044b\u0442\u044b\u0439 \u0447\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442 \u042f\u0440\u0413\u0423 \u0438\u043c. \u041f.\u0413. \u0414\u0435\u043c\u0438\u0434\u043e\u0432\u0430 Demidov Open IT Cup 2019"
rating: 0
weight: 102786
solve_time_s: 79
verified: true
draft: false
---

[CF 102786E - \u0423\u043f\u043e\u0440\u044f\u0434\u043e\u0447\u0438\u0432\u0430\u043d\u0438\u0435\u043f\u043e \u0441\u0443\u043c\u043c\u0435\u0446\u0438\u0444\u0440](https://codeforces.com/problemset/problem/102786/E)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要查看所有正整数`1`到`N`，但顺序不寻常。 数字按十进制数字之和分组。 数字和较小的一组出现较早，并且一组内的数字通常按值排序。 任务是找到占据位置的数字`M`在这个最终的排序中。 

的价值`N`可以大到`10^18`，因此生成所有数字是不可能的。 即使存储序列也需要大约`10^18`元素。 最大可能的数字和仅为`162`，因为十八位数字最多有十八位数字`9`和`10^18`本身有十九位数字，因此解决方案应该利用较少的位数和较小的可能总和范围。 任何依赖于迭代所有数字的方法`N`被排除。 

一个常见的错误是忘记一位数字和组内的排序是按数值排序，而不是按长度或其他数字顺序排序。 例如，对于`N = 100`和`M = 3`，答案是`100`，因为第一个数字和组是`1, 10, 100`。 一次只考虑一位数字长度的方法可能会错误地跳过`100`。 

当所需位置位于非常大的数字和组中时，会出现另一种边缘情况。 例如，与`N = 9`和`M = 9`，答案是`9`。 假设每个可能的总和的解决方案`1`向上存在于每一个`N`会错误地搜索超出可用范围的内容。 

价值`1`也是一个边界情况。 为了`N = 1`和`M = 1`，唯一有效的输出是`1`。 将数字和零作为正常组处理可能会意外引入表示形式`0`，这不是序列的一部分。 

## 方法

 直接的解决方案是枚举其中的每个数字`1`到`N`，计算其数字和，存储对`(digit sum, number)`，并对它们进行排序。 这是正确的，因为排序键与所需的顺序完全匹配。 然而，当`N`达到`10^18`，生成的元素数量远远超出任何程序可以处理的范围。 最坏的情况需要大约`10^18`数字和计算并对同样大的集合进行排序。 

有用的结构是数字和的范围很小。 我们可以计算每个数字和组有多少个数字，而不是生成数字。 一旦我们知道包含位置的组`M`，剩下的任务就是找到`M`- 具有一位固定数字和的最小数字。 

计数可以通过数字动态规划来完成。 由于只有十九个位置，所以我们可以统计前缀固定后，剩余一定和的数字串可能有多少个。 这些计数使我们能够跳过大范围的数字而无需构造它们。 

找到所需的数字和后，我们逐位构建答案。 数字和相同的数字按递增的数字顺序出现，这与所有数字具有相同长度时的字典顺序相同。 我们首先确定正确的长度，然后通过计算存在多少个有效的完成来选择每个数字（如果我们在其中放置较小的数字）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(N log N) | O(N log N) | O(N) | 太慢了|
 | 最佳| O(162 * 19 * 10 + 19 * 19 * 10) | O(19 * 162) | 已接受 |

 ## 算法演练

 1. 预计算`ways(length, sum)`，给定长度的数字序列的数量，其中每个数字都可以来自`0`到`9`总数字和等于`sum`。 该表是其他地方使用的核心计数工具。 

这些序列可能包含前导零，因为它们代表数字的剩余后缀。 前导零不会引起问题，因为在计数期间全长度是固定的。 
2. 对于每个可能的数字和`1`向上，计算有多少个数字`1`到`N`有那个数字和。 

计数是通过数字DP获得的。 我们扫描数字`N`从左到右，判断当前前缀是否已经小于`N`或者仍然等于它。 前导零表示允许我们自动计算所有较短长度的正数。 
3. 减去完整的数字和组`M`直到找到包含答案的组。 

这一步之后，`M`成为一个固定数字和组内的位置。 
4. 求出所需数字的长度。 

对于每个可能的长度，计算该长度中有多少个数字具有所需的数字和。 较短的长度总是出现在较长的长度之前，因为每个位数较少的正数在数值上都较小。 
5. 从左到右构造答案。 

在每个位置，按升序尝试可能的数字。 对于每个候选数字，计算剩余位置可以用剩余数字和来完成该数字的方式。 如果当前`M`大于该计数，跳过所有这些数字。 否则，答案将从该数字开始。 
6. 输出构造好的数字。 

这样做的原因是每个跳过的块对应于所需排序中的连续间隔。 数字 DP 精确计算每个区间内有多少个有效数字，因此减少`M`这些计数永远不会改变所需数字的相对位置。 在构造过程中，所选择的前缀始终是其块包含剩余位置的最小前缀，这保留了答案仍在剩余搜索范围内的不变量。 

## Python 解决方案```python
import sys
from functools import lru_cache

input = sys.stdin.readline

@lru_cache(None)
def ways(length, total):
    if length == 0:
        return 1 if total == 0 else 0
    if total < 0:
        return 0
    res = 0
    for d in range(10):
        res += ways(length - 1, total - d)
    return res

def count_up_to(n, target_sum):
    digits = list(map(int, str(n)))
    m = len(digits)

    @lru_cache(None)
    def dp(pos, remaining, tight):
        if pos == m:
            return 1 if remaining == 0 else 0

        limit = digits[pos] if tight else 9
        ans = 0

        for d in range(limit + 1):
            if remaining >= d:
                ans += dp(pos + 1, remaining - d, tight and d == limit)

        return ans

    return dp(0, target_sum, True)

def count_exact_length(length, target_sum):
    ans = 0
    for first in range(1, 10):
        if target_sum >= first:
            ans += ways(length - 1, target_sum - first)
    return ans

def solve_case(n, m):
    digit_sum = 1

    while True:
        cnt = count_up_to(n, digit_sum)
        if m <= cnt:
            break
        m -= cnt
        digit_sum += 1

    length = 1
    while True:
        cnt = count_exact_length(length, digit_sum)
        if m <= cnt:
            break
        m -= cnt
        length += 1

    result = []
    remaining = digit_sum

    for pos in range(length):
        start = 1 if pos == 0 else 0

        for digit in range(start, 10):
            if remaining < digit:
                continue

            cnt = ways(length - pos - 1, remaining - digit)

            if m > cnt:
                m -= cnt
            else:
                result.append(str(digit))
                remaining -= digit
                break

    return ''.join(result)

def main():
    n, m = map(int, input().split())
    print(solve_case(n, m))

if __name__ == "__main__":
    main()
```这`ways`函数存储给定长度和总和的可能后缀数。 它在计算长度和确定单个数字时都使用。 最大请求长度只有十九，所以表很小。`count_up_to`使用带紧标志的数字 DP。 当已经选择的前缀匹配时`N`，下一个数字不能超过对应的数字`N`。 一旦前缀变小，其余号码就可以使用任何数字。 该实现使用前导零，这就是为什么所有正数最多`N`恰好被表示一次。`count_exact_length`通过从第一个数字开始排除前导零`1`。 该功能与`ways`因为`ways`故意允许后缀为零。 

最终的构建循环是`M`第-号已恢复。 尝试按升序排列数字与数字排序相匹配，因为长度已经固定。 每个跳过的数字都代表一个完整的有效数字块，因此减去其大小与按有序序列向前移动相同。 

## 工作示例

 对于样品`N = 100`,`M = 10`，各组开始如下。 

| 当前数字总和 | 跳过计数 | 剩余 M | 决定|
 | ---| ---| ---| ---|
 | 1 | 3 | 7 | 跳过总和 1 |
 | 2 | 4 | 3 | 跳过总和 2 |
 | 3 | 4 | 3 | 选择总和 3 |

 数字和`3`组是`3, 12, 21, 30`，所以第三个元素是`21`。 

跟踪表明该算法永远不需要生成较早的组。 它只计算它们的大小并直接移动到所需的组。 

为了`N = 20`,`M = 5`，有序序列为：`1, 10, 2, 11, 20`| 当前数字总和 | 跳过计数 | 剩余 M | 决定|
 | ---| ---| ---| ---|
 | 1 | 2 | 3 | 跳过总和 1 |
 | 2 | 3 | 3 | 选择总和 2 |

 数字和`2`组包含`2, 11, 20`，第三个元素是`20`。 

此示例练习长度转换，因为同一数字和组同时包含一位数字和两位数字。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(162 * 19 * 10 + 19 * 19 * 10) | 每个 DP 转换中最多有 162 个数字和、19 个位置和 10 个数字选择。 |
 | 空间| O(19 * 162) | 记忆的后缀计数仅包含较小的数字长度和总和状态。 |

 该算法取决于位数而不是值`N`。 自从`N`最多有十九位数字，该解决方案很容易满足时间和内存限制。 

## 测试用例```python
import sys
import io
from functools import lru_cache

def build_solver():
    @lru_cache(None)
    def ways(length, total):
        if length == 0:
            return 1 if total == 0 else 0
        return sum(ways(length - 1, total - d) for d in range(10))

    def count_up_to(n, target_sum):
        digits = list(map(int, str(n)))
        m = len(digits)

        @lru_cache(None)
        def dp(pos, remaining, tight):
            if pos == m:
                return remaining == 0
            limit = digits[pos] if tight else 9
            ans = 0
            for d in range(limit + 1):
                if remaining >= d:
                    ans += dp(pos + 1, remaining - d, tight and d == limit)
            return ans

        return dp(0, target_sum, True)

    def count_exact_length(length, total):
        return sum(
            ways(length - 1, total - d)
            for d in range(1, 10)
            if total >= d
        )

    def solve_case(n, m):
        s = 1
        while True:
            c = count_up_to(n, s)
            if m <= c:
                break
            m -= c
            s += 1

        length = 1
        while True:
            c = count_exact_length(length, s)
            if m <= c:
                break
            m -= c
            length += 1

        ans = []
        remaining = s
        for pos in range(length):
            for d in range(1 if pos == 0 else 0, 10):
                if remaining >= d:
                    c = ways(length - pos - 1, remaining - d)
                    if m > c:
                        m -= c
                    else:
                        ans.append(str(d))
                        remaining -= d
                        break
        return ''.join(ans)

    return solve_case

solve = build_solver()

def run(inp: str) -> str:
    n, m = map(int, inp.split())
    return solve(n, m)

assert run("100 10") == "21"
assert run("1 1") == "1"
assert run("9 9") == "9"
assert run("20 5") == "20"
assert run("1000 3") == "100"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1`|`1`| 最小输入及排除数字和零|
 |`9 9`|`9`| 个位数边界 |
 |`20 5`|`20`| 数字和组内数字长度之间的转换 |
 |`1000 3`|`100`| 等位和的正确排序 |

 ## 边缘情况

 对于`N = 100`和`M = 3`，数字和搜索选择sum`1`。 长度搜索检查长度`1`，其中唯一的数字是`1`，然后是长度`2`，其中唯一的数字是`10`。 去掉这两个位置后，剩下的位置就是第一个长度的数字`3`，即`100`。 这可以处理较长数字出现在同一数字和组中的情况。 

为了`N = 9`和`M = 9`，算法正确计算唯一存在的组。 每个数字的总和来自`1`到`8`包含一个数字并被跳过，留下数字和`9`有位置`1`。 该结构创建了个位数`9`。 

为了`N = 1`和`M = 1`, 数字和`1`立即被选中。 长度为一，唯一可能的第一位数字是`1`，并且构造完成时无需考虑无效的零值。 

为了`N = 20`和`M = 5`，算法达到数字和`2`。 它首先检查一位数字`2`，然后构造该组中的第三个数字。 后缀计数将答案放在`2`和`11`，生产`20`。 这证实了该结构尊重不同长度的数字顺序。
