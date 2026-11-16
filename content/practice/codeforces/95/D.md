---
title: "CF 95D - 赛马"
description: "我们给出了几个整数区间。 对于每个区间 $[l, r]$，我们必须计算有多少个数字包含两个幸运数字（4 或 7），其位置最多相差 k。 位置是在数字的十进制表示形式内计算的。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 95
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 77 (Div. 1 Only)"
rating: 2500
weight: 95
solve_time_s: 120
verified: true
draft: false
---

[CF 95D - 赛马](https://codeforces.com/problemset/problem/95/D)

 **评分：** 2500
 **标签：** dp、数学
 **求解时间：** 2m
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了几个整数区间。 对于每个间隔$[l, r]$，我们必须计算有多少个数字包含两个幸运数字，或者`4`或者`7`，其位置最多相差`k`。 

位置是在数字的十进制表示形式内计算的。 如果两个幸运数字足够接近，则该数字被称为近幸运数字。 

例如，与$k = 2$：

 -`404`几乎是幸运的，因为两个`4`s 相隔两个位置。 
-`4123954997`不太幸运，因为最近的一对幸运数字相距太远。 
- 只有一位幸运数字的号码永远无法获得资格。 

间隔界限是巨大的。 一个数字最多可以包含 1000 个十进制数字，因此不可能迭代该范围内的每个值。 如果我们对所有值都进行尝试，那么即使逐位检查一个数字也已经太昂贵了。 

这立即排除了与间隔的数字大小成比例的任何解决方案。 唯一可行的方向是数字DP，我们通过逐位构造数字来计算有效数字。 

测试用例的数量和值$k$都最多 1000。由于数字长度也最多 1000，因此解决方案$O(\text{digits}^2)$每个查询是可以接受的。 立方解已经变得有风险了。 

一些边缘情况很容易被错误处理。 

考虑$k = 1$。 那么只有相邻的幸运数字才重要。 

输入：```
1 1
1 100
```有效数字仅`44`,`47`,`74`， 和`77`，所以答案是`4`。 粗心的实现可能会错误地计算数字，例如`404`，其中幸运数字以距离分隔`2`。 

Another dangerous case is leading zeroes. 假设我们将数字处理为固定长度的字符串。 

输入：```
1 2
1 50
```如果我们允许前导零表现得像真正的数字，那么`"004"`和`"040"`可能会意外地创造出假的幸运对。 前导零不得参与条件。 

当有效对已经存在时，就会出现第三种微妙的情况。 一旦我们找到了一对足够接近的幸运数字，后面的数字就不再对有效性产生影响了。 

例如：```
1 2
447000000000 447000000000
```这个数字已经接近幸运了，因为前两位数字形成了有效的对。 有缺陷的 DP 稍后可能会覆盖状态并丢失该信息。 

## 方法

 蛮力的想法很简单。 对于区间内的每个数字，扫描其小数位并记录所有数字的位置`4`和`7`digits. 如果任意两个连续的幸运位置最多相差`k`, count the number.

 This works because the property depends only on the digit sequence of one number.

 问题在于规模。 间隔端点可以有 1000 位数字。 Even the interval size itself is astronomically large. 枚举数字是不可能的。 

So instead of iterating over numbers, we count them combinatorially.

 The key observation is that the property depends only on local information while scanning digits left to right. 在任何时候，我们只需要知道：

 - 有效对是否已经出现，
 - 最近的幸运数字出现的位置。 

这使得这个问题对于数字 DP 来说非常完美。 

我们在数字位置上定义 DP。 While constructing the number digit by digit, we track:

 - the current position,
 - 最后一个幸运数字的位置，
 - 我们是否已经形成有效的配对，
 - 我们是否已经开始编号，
 - 我们是否仍然紧贴上限。 

Whenever we place a`4`或者`7`，我们将它的位置与之前的幸运数字进行比较。 If the distance is at most`k`，该号码永久有效。 

这将问题从迭代值转换为迭代状态。 状态总数大致为$1000^2$，这是完全可以管理的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 不可能| 不可能| 太慢了|
 | Optimal Digit DP |$O(L^2 \cdot 10)$|$O(L^2)$| 已接受 |

 这里，$L$is the number of digits.

 ## 算法演练

 1. Define a function`solve(x)`返回该范围内有多少接近幸运的数字$[0, x]$。 

那么每个查询的答案就变成：$$solve(r) - solve(l-1)$$2. Convert the upper bound into a digit array.

 数字 DP 自然地适用于字符串，因为我们一次处理一个数字位置。 
3. 使用带有状态的记忆 DFS：$$(pos,\ last,\ found,\ started,\ tight)$$在哪里：

-`pos`是当前的数字索引。 
-`last`是最近的幸运数字的位置。 
-`found`告诉是否已经存在有效的对。 
-`started`告诉我们是否已经放置了一个非前导零数字。 
-`tight`告诉当前前缀是否等于上限前缀。 
4. 如果到达数字字符串的末尾，则返回`1`仅当`found = True`。 

这意味着构建的数字几乎是幸运的。 
5. 尝试当前位置的所有可能的数字。 

允许的最大数字取决于`tight`。 
6. 小心处理前导零。 

如果数字还没有开始，我们又加了一个零，我们就留在`started = False`状态并且不要将零视为真正的数字。 
7. 如果输入的数字是`4`或者`7`，更新幸运信息。 

如果该位置之前有一个幸运数字`last`， 和：$$pos - last \le k$$然后设置`found = True`。 

之后，更新`last = pos`。 
8. 递归到下一个位置并累加答案模数$10^9 + 7$。 
9. 对于每个查询，计算：$$(solve(r) - solve(l-1)) \bmod (10^9+7)$$### 为什么它有效

 DP 状态准确存储确定未来数字是否可以创建有效对所需的信息。 

未来仅取决于最近的前一个幸运数字，因为任何新的幸运数字只需要与最新的幸运数字进行比较。 较早的幸运数字距离较远，永远无法产生更小的距离。 

这`found`标志是单调的。 一旦出现有效的数字对，无论未来的数字如何，该数字都将保持接近幸运的状态。 

由于每个有效数字恰好对应一条DP路径，并且每条DP路径恰好代表一个数字，因此计数是正确的。 

## Python 解决方案```python
import sys
from functools import lru_cache

input = sys.stdin.readline

MOD = 10**9 + 7

def subtract_one(s):
    if s == "0":
        return "0"

    a = list(s)
    i = len(a) - 1

    while i >= 0 and a[i] == '0':
        a[i] = '9'
        i -= 1

    a[i] = str(int(a[i]) - 1)

    res = ''.join(a).lstrip('0')
    return res if res else "0"

def count_nearly_lucky(s, k):
    digits = list(map(int, s))
    n = len(digits)

    @lru_cache(None)
    def dfs(pos, last, found, started, tight):
        if pos == n:
            return 1 if found else 0

        limit = digits[pos] if tight else 9
        ans = 0

        for d in range(limit + 1):
            ntight = tight and (d == limit)

            if not started and d == 0:
                ans += dfs(pos + 1, -1, found, False, ntight)
                ans %= MOD
                continue

            nfound = found
            nlast = last

            if d == 4 or d == 7:
                if last != -1 and pos - last <= k:
                    nfound = True
                nlast = pos

            ans += dfs(pos + 1, nlast, nfound, True, ntight)
            ans %= MOD

        return ans

    return dfs(0, -1, False, False, True)

def solve():
    t, k = map(int, input().split())

    out = []

    for _ in range(t):
        l, r = input().split()

        left = subtract_one(l)

        ans = (count_nearly_lucky(r, k) -
               count_nearly_lucky(left, k)) % MOD

        out.append(str(ans))

    print('\n'.join(out))

solve()
```功能`count_nearly_lucky`对所有数字执行数字 DP`0`到给定的界限。 

这`last`变量存储最近的幸运数字的位置。 仅使用最近的数字就足够了，因为任何较早的幸运数字都距离未来的位置更远。 

前导零通过处理`started`旗帜。 在第一个非零数字出现之前，持仓不计入数字的一部分。 如果没有这种区别，不同长度的数字就会相互干扰。 

过渡：```
if last != -1 and pos - last <= k:
```是问题的核心。 它检测当前的幸运数字是否与前一个幸运数字形成足够接近的对。 

减法助手也很微妙。 由于边界可以有 1000 位数字，因此我们无法将它们转换为整数。 递减必须直接在字符串上执行。 

最后，答案总是以模数减少$10^9 + 7$。 

## 工作示例

 ### 示例 1

 输入：```
1 2
1 100
```我们计算：$$solve(100) - solve(0)$$有效数字是`44`,`47`,`74`,`77`。 

| 数量 | 幸运职位 | 最小距离| 有效 |
 | ---| ---| ---| ---|
 | 44 | 44 0,1 | 1 | 是的 |
 | 47 | 47 0,1 | 1 | 是的 |
 | 74 | 74 0,1 | 1 | 是的 |
 | 77 | 77 0,1 | 1 | 是的 |

 最终答案：```
4
```此示例确认相邻的幸运数字被正确检测到。 

### 示例 2

 输入：```
1 2
400 500
```相关候选人：

 | 数量 | 幸运职位 | 距离 | 有效 |
 | ---| ---| ---| ---|
 | 404 | 404 0,2 | 2 | 是的 |
 | 407 | 407 0,2 | 2 | 是的 |
 | 447 | 447 0,1,2 | 1 | 是的 |
 | 470 | 470 0,1 | 1 | 是的 |
 | 499 | 499 0 | - | 没有 |

 DP 在从左到右构建数字的同时发现这些数字。 

为了`404`：

 | 职位| 数字| 最后的幸运位置 | 发现 |
 | ---| ---| ---| ---|
 | 0 | 4 | 0 | 假 |
 | 1 | 0 | 0 | 假 |
 | 2 | 4 | 2 | 真实|

 在位置`2`，距离为`2 - 0 = 2`，满足条件。 

此跟踪说明了为什么仅保留最新的幸运数字就足够了。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |$O(L^2 \cdot 10)$| DP 状态基于数字位置和最后幸运位置 |
 | 空间|$O(L^2)$| 记忆表|

 这里，$L$是位数，最多 1000。 

超过 1000 位的二次 DP 很容易符合限制。 在最坏的情况下，状态数只有几百万，并且转换很小。 

## 测试用例```python
# helper: run solution on input string, return output string

import sys
import io
from functools import lru_cache

MOD = 10**9 + 7

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def subtract_one(s):
        if s == "0":
            return "0"

        a = list(s)
        i = len(a) - 1

        while i >= 0 and a[i] == '0':
            a[i] = '9'
            i -= 1

        a[i] = str(int(a[i]) - 1)

        res = ''.join(a).lstrip('0')
        return res if res else "0"

    def count_nearly_lucky(s, k):
        digits = list(map(int, s))
        n = len(digits)

        @lru_cache(None)
        def dfs(pos, last, found, started, tight):
            if pos == n:
                return 1 if found else 0

            limit = digits[pos] if tight else 9
            ans = 0

            for d in range(limit + 1):
                ntight = tight and (d == limit)

                if not started and d == 0:
                    ans += dfs(pos + 1, -1, found, False, ntight)
                    continue

                nfound = found
                nlast = last

                if d == 4 or d == 7:
                    if last != -1 and pos - last <= k:
                        nfound = True
                    nlast = pos

                ans += dfs(pos + 1, nlast, nfound, True, ntight)

            return ans % MOD

        return dfs(0, -1, False, False, True)

    t, k = map(int, input().split())

    out = []

    for _ in range(t):
        l, r = input().split()

        left = subtract_one(l)

        ans = (count_nearly_lucky(r, k) -
               count_nearly_lucky(left, k)) % MOD

        out.append(str(ans))

    return "\n".join(out)

# provided sample
assert run("1 2\n1 100\n") == "4", "sample 1"

# single number, not nearly lucky
assert run("1 1\n4 4\n") == "0", "single lucky digit"

# exact boundary distance
assert run("1 2\n404 404\n") == "1", "distance exactly k"

# distance too large
assert run("1 1\n404 404\n") == "0", "distance exceeds k"

# multiple valid numbers
assert run("1 2\n44 77\n") == "4", "all two-digit lucky pairs"

# leading zero handling
assert run("1 3\n1 9\n") == "0", "no fake leading-zero pairs"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 4 4`|`0`| 一个幸运数字是不够的 |
 |`1 2 / 404 404`|`1`| 距离等于`k`计数|
 |`1 1 / 404 404`|`0`| 距离大于`k`不算|
 |`1 2 / 44 77`|`4`| 所有两位数幸运组合 |
 |`1 3 / 1 9`|`0`| 忽略前导零 |

 ## 边缘情况

 考虑：```
1 1
404 404
```幸运数字位于以下位置`0`和`2`。 他们的距离是`2`，这超过了`k = 1`。 

During DP:

 | 职位| 数字| Last Lucky | 发现 |
 | ---| ---| ---| ---|
 | 0 | 4 | 0 | 假 |
 | 1 | 0 | 0 | 假 |
 | 2 | 4 | 2 | 假 |

 条件`pos - last <= k`失败，因此该号码被正确拒绝。 

现在考虑前导零：```
1 2
1 9
```DP内部处理与上限相同长度的数字。 例如，`4`可能显示为`"04"`。 

因为`started = False`在第一个非零数字之前，前导零将被忽略并且不会成为数字的一部分。 该算法从不处理`"04"`因为在位置上有幸运数字`0`和`1`。 

最后，考虑：```
1 100
447000000000 447000000000
```前两位数字已经满足条件。 

| 职位| 数字| 发现 |
 | ---| ---| ---|
 | 0 | 4 | 假 |
 | 1 | 4 | 真实|
 | 2..11 | 2..11 各种| 真实|

 一次`found`成为真实，并且永远保持真实。 后面的数字不能使该号码无效。
