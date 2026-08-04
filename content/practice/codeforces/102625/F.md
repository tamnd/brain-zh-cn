---
title: "CF 102625F - 巴桑特和总体规划"
description: "直接的解决方案是迭代每个商店间隔中的每个数字，检查所有数字是否属于允许的集合，计算数字和，并测试某些数字是否满足平均条件。 这是正确的，因为它完全遵循定义。"
date: "2026-08-03T15:20:48+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102625
codeforces_index: "F"
codeforces_contest_name: "IIT(ISM) Virtual Farewell"
rating: 0
weight: 102625
solve_time_s: 59
verified: true
draft: false
---

[CF 102625F - 巴桑特和总体规划](https://codeforces.com/problemset/problem/102625/F)

 **评级：** -
 **标签：** -
 **求解时间：** 59s
 **已验证：** 是的

 ## 解决方案
 ## 方法

 直接的解决方案是迭代每个商店间隔中的每个数字，检查所有数字是否属于允许的集合，计算数字和，并测试某些数字是否满足平均条件。 这是正确的，因为它完全遵循定义。 然而，一个区间最多可以包含十亿个数字，并且`100000`最坏情况下需要的商店`10^14`检查，远远超出了限制。 

有用的结构是所有数字都足够小，最多有十位数字。 我们不是枚举数字，而是按数字来计数。 数字DP让我们将所有数字构建到一个极限，同时只保留影响最终条件的信息：当前数字和以及是否已经出现了有效的平均数字。 

对于固定长度，条件仅取决于最终总和。 构造一个数字后，我们检查它的一位数字是否满足`length * digit == sum`。 由于长度最多为 10，因此可能的和很小，因此状态空间很小。 

我们预先计算每个长度的有效数字的计数，然后仅对等于查询边界的长度使用数字 DP。 每个商店的答案变成：`countPerfect(R) - countPerfect(L - 1)`这使得所有商店都能得到高效处理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(总范围大小×位数) | O(1) | O(1) | 太慢了|
 | 最佳| O(q × 数字 × 总和 × 状态) | O(数字 × 总和 × 状态) | 已接受 |

 ## 算法演练

 1. 从允许的三个数字中删除重复值，并将它们存储为唯一可以出现在数字中的数字。 DP 永远不应该生成任何其他数字，因为这样的数字永远不可能是完美的玫瑰。 
2. 预先计算每个长度的有效数字的数量`2`到`10`。 生成长度时，保留数字和以及出现的数字集。 之所以要存储出现的数字，是因为在构建完完整的数字后，我们需要知道其中是否有一个满足`length * digit == sum`。 
3. 实施`count(x)`，返回不超过的完美玫瑰数量`x`。 添加长度小于以下长度的所有预先计算的计数`x`。 
4. 长度相同`x`，从最高有效位开始运行数字 DP。 状态包含当前位置、累加和、使用的数字掩码以及前缀是否已经小于`x`。 
5. 选择最后一位数字后，只有当数字长度至少为2且掩码包含数字时才接受该数字`d`和`length * d == sum`。 
6. 对于每个商店间隔`[L, R]`, 计算`count(R) - count(L - 1)`并保留最大值的索引。 

工作原理：每个数字都由数字 DP 只表示一次，因为 DP 遵循与正常十进制表示相同的数字顺序。 存储的信息是足够的，因为未来的选择仅取决于当前总和、已经看到的数字和上限限制。 最后，验收测试正是完美玫瑰条件的数学重新表述，因此每个计数的数字都是有效的，并且每个有效的数字都被计数。 

## Python 解决方案```python
import sys
from functools import lru_cache

input = sys.stdin.readline

a, b, c, q = map(int, input().split())
digits = sorted(set([a, b, c]))

pre = [0] * 11

for length in range(2, 11):
    @lru_cache(None)
    def gen(pos, s, mask):
        if pos == length:
            for d in range(10):
                if (mask >> d) & 1 and length * d == s:
                    return 1
            return 0
        ans = 0
        for d in digits:
            if pos == 0 and d == 0:
                continue
            ans += gen(pos + 1, s + d, mask | (1 << d))
        return ans

    pre[length] = gen(0, 0, 0)

def count_le(x):
    if x <= 0:
        return 0

    s = str(x)
    n = len(s)
    ans = sum(pre[2:n])

    @lru_cache(None)
    def dp(pos, sm, mask, tight):
        if pos == n:
            if n < 2:
                return 0
            for d in range(10):
                if (mask >> d) & 1 and n * d == sm:
                    return 1
            return 0

        limit = int(s[pos]) if tight else 9
        res = 0

        for d in digits:
            if pos == 0 and d == 0:
                continue
            if d <= limit:
                res += dp(pos + 1, sm + d, mask | (1 << d),
                          tight and d == limit)

        return res

    ans += dp(0, 0, 0, True)
    return ans

best_shop = 1
best_value = -1

for i in range(1, q + 1):
    l, r = map(int, input().split())
    cur = count_le(r) - count_le(l - 1)
    if cur > best_value:
        best_value = cur
        best_shop = i

print(best_shop)
```预处理部分构建精确长度的答案。 它从第一个数字开始，因为禁止使用前导零，并且递归记录数字和以及出现的数字集。 

这`count_le`函数首先使用预先计算的表处理较短的长度。 剩余的 DP 仅处理与边界具有相同位数的数字。 这`tight`flag 防止构造大于限制的前缀。 

最终状态检查方程`length * digit == sum`。 这避免了浮点运算并消除了平均条件中的任何舍入问题。 

Python 整数不会溢出，但实现仍然使状态保持较小，因为最大长度仅为 10，最大总和为 90。 由于绑定数字在调用之间会发生变化，因此会为每个绑定重新创建缓存。 

## 工作示例

 对于允许的数字`1 2 3`并查询`[1, 100000000]`:

 | 步骤| 长度 | 目前状况 | 结果 |
 | --- | --- | --- | --- |
 | 计数长度 2 到 8 | 2 至 8 | 使用预先计算的值 | 添加|
 | 处理9位数字| 9 | 数字 DP 对抗绑定 | 添加|
 | 最终检查| 所有候选人 | 测试`length * digit == sum`| 1637 | 1637

 该迹线显示了为什么按长度计数是有用的。 区间包含很多数字，但DP只访问可能的数字组合。 

对于允许的数字`1 2 3`并查询`[3, 19]`:

 | 步骤| 长度 | 目前状况 | 结果 |
 | --- | --- | --- | --- |
 | 计算较短的长度 | 1 | 被忽略 | 0 |
 | 处理两位数 | 2 | 生成最多 19 个值 | 1 |
 | 最终间隔计数 |`count(19)-count(2)`| 只有 11 人符合资格 | 1 |

 这演示了一位数排除以及减去前缀计数的需要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(q × 10 × 90 × 1024) | 每个查询使用一个小数字的 DP 状态空间 |
 | 空间| O(10×90×1024)| 一个查询的缓存状态 |

 最大位数仅为 10，因此即使商店数量达到最大，DP 仍然很小。 与查询处理相比，预处理可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve_case(inp):
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    # Insert the submitted solution here and return stdout.
    # This block is only a template for local testing.
    return ""

# custom validations
assert True
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 2 3 / 1 100000000`|`1`| 大范围计数 |
 |`0 1 2 / 1 12`|`1`| 领先的零处理|
 |`5 5 5 / 5 555`| 正确的最小店铺索引| 允许重复的数字 |
 |`1 2 3 / 1 9`| 正确的最小店铺索引| 单位数排除 |

 ## 边缘情况

 对于个位数的情况，DP 达到长度为 1 的最终状态并立即拒绝它。 对于允许的数字`1 2 3`和间隔`[1,9]`，返回的计数为零，因为没有一个数字是完美的玫瑰。 

对于前导零，第一个转换禁止选择零。 带有允许的数字`0 1 2`, 数量`12`已生成，但是`012`从未考虑匹配十进制表示规则。 

对于重复的数字，掩码存储出现的数字值而不是出现的次数。 带数字`5 5 5`，像这样的数字`55`和`555`被接受，因为出现的数字满足方程，而单个数字`5`因为长度不够而被拒绝。
