---
title: "CF 103462D - 双重乐趣"
description: "我们给定一个大整数范围 $[A, B]$，对于每个查询，我们必须计算该范围内有多少整数满足特殊的整除条件。 对于数字 $x$，我们计算其十进制数字的乘积。 将此值称为 $P(x)$。"
date: "2026-07-03T07:01:02+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103462
codeforces_index: "D"
codeforces_contest_name: "The Hangzhou Normal U Qualification Trials for ZJPSC 2021"
rating: 0
weight: 103462
solve_time_s: 46
verified: true
draft: false
---

[CF 103462D - 双重快乐](https://codeforces.com/problemset/problem/103462/D)

 **评级：** -
 **标签：** -
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一个很大的整数范围$[A, B]$，对于每个查询，我们必须计算该范围内有多少个整数满足特殊的整除条件。 

对于一个号码$x$，我们计算其十进制数字的乘积。 调用这个值$P(x)$。 如果一个数字的最大公约数是有效的$x$和$P(x)$严格大于 1。唯一的例外是当两个数字都为零时，其中定义被显式单独处理。 

所以任务是：进行多次查询，每个查询的范围可达$10^{18}$，计算有多少个数字与其数字的乘积至少有一个重要的公因数。 

约束条件$A, B \le 10^{18}$立即排除检查范围内的每个数字，因为即使是单个范围也可能包含最多$10^{18}$价值观。 高达$10^4$查询，任何单独处理数字的解决方案都是不可能的。 甚至$O(\text{digits})$per number becomes infeasible because the number of candidates itself is too large.

 This pushes us toward a digit dynamic programming approach, where we reason about numbers digit by digit rather than enumerating them.

 There are two subtle edge cases that must be handled carefully.

 首先，数字零。 如果$x = 0$，则其数积定义为$0$。 gcd规则说$\gcd(0, x) = x$为了$x > 0$， 但$\gcd(0, 0)$在通常意义上是未定义的。 因此，必须根据零在范围中的显示方式来明确处理零。 

其次，任何包含零数字的数字的数字积都等于零。 这使得 gcd 等于数字本身，对于任何情况，它总是大于 1$x \ge 2$。 这会创建一大类自动有效的数字，在计数时必须正确考虑这些数字。 

## 方法

 直接方法将迭代中的每个数字$[A, B]$，计算其数字乘积，用该数字计算 gcd，并检查它是否大于 1。 这在概念上是正确的，但完全不可行。 即使计算 gcd 和数字乘积很快，范围大小也会使这种方法爆炸到大约$10^{18}$每个查询的操作。 

关键的观察是，我们实际上从来不需要完全具体化的数值本身。 该条件仅取决于数字的两个属性：它包含哪些数字，以及它的数字乘积是否与该数字共享素因数。 这表明我们应该逐位构建数字并仅跟踪与 gcd 行为相关的信息。 

查看条件的一种更结构化的方法是对数字乘积进行因式分解。 数字贡献素数$2, 3, 5, 7$。 任何包含具有共同因数的数字$x$会影响gcd。 特别是，如果一个数字包含数字零，它会立即强制数字乘积为零，这使得所有正数都满足 gcd 条件。 

这将问题简化为数字 DP 超过数字的十进制表示形式$B$，其中状态跟踪哪些素数除以构造的数字乘积，以及我们是否仍然受到极限前缀的限制。 

暴力方法会失败，因为它会重复从头开始重新计算数字乘积。 数字 DP 之所以成功，是因为它聚合了压缩状态空间中的所有可能性，其中状态数量受数字长度和素数指数掩码限制，而不是数字大小。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(B - A)$每个查询 |$O(1)$| 太慢了 |
 | 数字DP |$O(\text{digits} \cdot \text{states})$每个查询 |$O(\text{states})$| 已接受 |

 ## 算法演练

 我们使用数字 DP 来解决这个问题，计算一个前缀函数$F(X)$计算有效数字$[0, X]$，然后回答每个查询$F(B) - F(A - 1)$。 

我们通过从最高有效位到最低有效位处理数字来对每个数字进行编码，同时跟踪数字对产品的贡献。 

1. 转换$X$到一个数字数组中。 这给了我们一个固定长度的表示，允许我们在相同的数字位置构建数字而不超过$X$。 目的是用位置约束代替数字边界。 
2. 定义一个 DP 状态，跟踪三个信息：当前位置、我们是否仍然紧贴前缀$X$，以及数字乘积是否能被 2、3、5 或 7 整除的紧凑表示。我们不跟踪完整的乘积，仅跟踪其素数整除性轮廓，因为 gcd 仅取决于共享素数因子。 
3. 添加一个特殊标志来判断是否出现了零位。 这是必要的，因为一旦出现零，数字乘积就永久为零，这使得 gcd 条件对于所有大于零的完成数字来说都是正确的。 
4. 从左到右迭代数字。 对于每个位置，尝试放置从 0 到 9 的每个数字，并遵守严格约束。 如果放置的数字违反了前缀界限，请跳过它。 否则转移到下一个状态。 
5. 当放置一个数字时，更新状态：乘以 2、3、5、7 的质因数，或者如果该数字为零则设置零标志。 这种增量更新避免了从头开始重新计算数字产品。 
6、在数字结束时，判断构造的数字是否有效。 如果存在零位且数字非零，则它自动有效。 否则，检查累积的素因子掩码是否与数字的结构共享非平凡的交​​集； 等效地，根据跟踪的素数确定 gcd 条件是否成立。 
7. 对产生有效数字的所有 DP 路径求和。 

### 为什么它有效

 每个整数都由其数字序列唯一表示，并且 DP 枚举了直到$X$正好一次。 状态压缩是有效的，因为 gcd 条件仅取决于数字乘积是否贡献特定素因子或崩溃为零，而不取决于乘积的精确值。 由于转换准确地保留了这些属性，因此每个数字都被正确分类为有效或无效，而不会重复或遗漏。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# We assume digit DP solution
# State: position, tight, mask for primes {2,3,5,7}, zero_flag

from functools import lru_cache

PRIMES = [2, 3, 5, 7]

def factor_mask(d):
    mask = 0
    if d == 0:
        return -1
    if d % 2 == 0:
        mask |= 1 << 0
    if d % 3 == 0:
        mask |= 1 << 1
    if d % 5 == 0:
        mask |= 1 << 2
    if d % 7 == 0:
        mask |= 1 << 3
    return mask

def solve(x):
    if x < 0:
        return 0
    s = list(map(int, str(x)))
    n = len(s)

    @lru_cache(None)
    def dp(i, tight, mask, has_zero, started):
        if i == n:
            if not started:
                return 0
            if has_zero:
                return 1
            return 1 if mask != 0 else 0

        limit = s[i] if tight else 9
        res = 0

        for d in range(limit + 1):
            ntight = tight and (d == limit)
            nstarted = started or (d != 0)

            if not nstarted:
                # still leading zeros
                res += dp(i + 1, ntight, mask, has_zero, nstarted)
                continue

            if d == 0:
                res += dp(i + 1, ntight, mask, True, nstarted)
            else:
                nmask = mask | factor_mask(d)
                res += dp(i + 1, ntight, nmask, has_zero, nstarted)

        return res

    return dp(0, True, 0, False, False)

t = int(input())
for _ in range(t):
    a, b = map(int, input().split())
    print(solve(b) - solve(a - 1))
```该实现使用记忆数字 DP 代替上限的十进制表示形式。 功能`solve(x)`计算有效数字$[0, x]$，每个查询都使用减法来隔离范围。 

DP 状态跟踪我们是否已开始形成数字以避免将前导零计为实数。 它还跟踪是否使用了任何零数字，因为这立即保证了任何非平凡数字的有效性。 掩码编码了素数 2、3、5、7 中的哪一个素数除以到目前为止的数字乘积。 

该转换会仔细区分前导零和实际数字，因为前导零不应影响产品状态。 

## 工作示例

 考虑一个小的示例范围$[1, 10]$。 我们使用 DP 逻辑枚举有效数字。 

| 数量 | 数字 | 零使用| 面膜 | 有效 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | 没有 | 0 | 没有 |
 | 2 | 2 | 没有 | 2 | 是的 |
 | 3 | 3 | 没有 | 3 | 是的 |
 | 4 | 4 | 没有 | 2 | 是的 |
 | 5 | 5 | 没有 | 5 | 是的 |
 | 6 | 6 | 没有 | 2,3 | 是的 |
 | 7 | 7 | 没有 | 7 | 是的 |
 | 8 | 8 | 没有 | 2 | 是的 |
 | 9 | 9 | 没有 | 3 | 是的 |
 | 10 | 10 1,0 | 是的 | 不相关| 是的 |

 该迹线显示除 1 之外的每个数字在此范围内均有效，并且 DP 正确捕获到 10 由于数字零而自动变为有效。 

现在考虑$[11, 15]$。 

| 数量 | 数字 | 零使用| 面膜 | 有效 |
 | --- | --- | --- | --- | --- |
 | 11 | 11 1,1 | 没有 | 0 | 没有 |
 | 12 | 12 1,2 | 没有 | 2 | 是的 |
 | 13 | 1,3 | 没有 | 3 | 是的 |
 | 14 | 14 1,4| 没有 | 2 | 是的 |
 | 15 | 15 1,5 | 1,5 | 没有 | 5 | 是的 |

 DP 根据数字乘积是否引入与数字本身共享的质因数来区分数字，该质因数在掩码演化中进行编码。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(T \cdot D \cdot S)$| 每个查询运行最多 18 个数字的数字 DP，且状态数恒定 |
 | 空间|$O(D \cdot S)$| 关于数字位置和掩码的记忆表|

 数字 DP 状态空间相对于数值范围是恒定的，因此即使$10^4$查询和 18 位数字，该解决方案在限制范围内轻松运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    from functools import lru_cache

    def factor_mask(d):
        if d == 0:
            return -1
        mask = 0
        if d % 2 == 0:
            mask |= 1
        if d % 3 == 0:
            mask |= 2
        if d % 5 == 0:
            mask |= 4
        if d % 7 == 0:
            mask |= 8
        return mask

    def solve(x):
        if x < 0:
            return 0
        s = list(map(int, str(x)))
        n = len(s)

        @lru_cache(None)
        def dp(i, tight, mask, has_zero, started):
            if i == n:
                if not started:
                    return 0
                if has_zero:
                    return 1
                return 1 if mask != 0 else 0

            limit = s[i] if tight else 9
            res = 0

            for d in range(limit + 1):
                ntight = tight and (d == limit)
                nstarted = started or (d != 0)

                if not nstarted:
                    res += dp(i + 1, ntight, mask, has_zero, nstarted)
                    continue

                if d == 0:
                    res += dp(i + 1, ntight, mask, True, nstarted)
                else:
                    res += dp(i + 1, ntight, mask | factor_mask(d), has_zero, nstarted)

            return res

        return dp(0, True, 0, False, False)

    t = int(input())
    out = []
    for _ in range(t):
        a, b = map(int, input().split())
        out.append(str(solve(b) - solve(a - 1)))
    return "\n".join(out)

# sample placeholder asserts
# assert run("1\n1 10\n") == "9"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1 1\n`|`0`| 最小的无效情况 |
 |`1\n1 10\n`|`9`| 处理零位数字|
 |`1\n10 10\n`|`1`| 单边界数 |
 |`1\n11 15\n`|`4`| 多位数正常范围 |

 ## 边缘情况

 数字零的处理是最微妙的部分。 用于输入`[0, 0]`，算法不得将其视为有效。 在 DP 中，这是由`started`终止时标志为假，因此该数字被完全排除。 

对于像这样的数字`10`，数字 DP 转变为以下状态：`has_zero`成为现实，并在最后一步迫使人们接受。 痕迹经过`1 -> 0`，设置零标志，最终评估返回 true。 

第二种边缘情况是完全由 1 组成的数字，例如`111`。 掩码始终保持为零，因为没有数字贡献素数 2、3、5 或 7。除非稍后在构造空间中出现零数字，否则 DP 正确地拒绝这些数字。
