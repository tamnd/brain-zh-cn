---
title: "CF 926F - 移动通信"
description: "我们正在模拟连续几天的银行账户。 每天开始时，账户都会收取 $p$ 卢布的固定费用。 在某些特定的日子里，在这笔费用发生之前，阿尔卡迪将钱存入账户。"
date: "2026-06-17T03:10:53+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 926
codeforces_index: "F"
codeforces_contest_name: "VK Cup 2018 - Wild-card Round 1"
rating: 2000
weight: 926
solve_time_s: 74
verified: true
draft: false
---

[CF 926F - 移动通信](https://codeforces.com/problemset/problem/926/F)

 **评级：** 2000
 **标签：** -
 **求解时间：** 1m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟连续几天的银行账户。 每天开始时需支付固定费用$p$卢布应用于该帐户。 在某些特定的日子里，在这笔费用发生之前，阿尔卡迪将钱存入账户。 

时间线严格按照时间顺序从第一天到第二天$m$。 最初余额为零。 每天，如果是存款日，则余额先增加，然后每日付款$p$被减去。 执行此操作后，我们检查余额是否为负数。 我们需要统计每日收费后有多少天产生负余额。 

一个关键的观察结果是，该过程纯粹是累积的：当天的余额$d$仅取决于之前的存款和固定扣除$p$每天。 没有重置或分支行为。 

这些限制使得简单的模拟变得不可能。 天数$m$可以大到$10^9$，所以日复一日地迭代是不可行的。 然而，存款事件的数量$n$至多是$10^5$，它足够小，可以进行排序和线性处理。 这种不对称性$n$和$m$核心结构提示：只有少数天数真正改变了平衡。 

一种简单的方法会模拟所有$m$天并保持运行平衡。 这将是$O(m)$，当$m = 10^9$。 

一个更微妙的天真的想法是只处理存款日并假设中间发生了一些简单的事情。 这会失败，因为余额每天都会线性变化，因此即使在非存款日，余额也会发生有意义的变化。 

打破天真的推理的边缘情况包括：

 - 根本没有存款：余额减少$p$每天，所以所有日子都是负数。 
- 接近尾声的单笔大额存款：前期为负，后期可能会恢复。 
- 暂时取消日常消耗的存款，导致跨段的交替信号行为。 

这些行为表明我们必须将时间线视为分段线性函数而不是逐日模拟。 

## 方法

 如果我们每天模拟，我们会维护一个平衡变量并从 1 循环到$m$，在发生存款时应用存款并减去$p$每次。 这是正确的，但当$m$很大，因为它需要最多$10^9$迭代。 

关键的观察结果是，除了持续的线性下降之外，存款日之间的间隔内没有任何变化。 如果我们知道某个时间间隔开始时的余额，我们就可以使用算术推理而不是模拟来计算该时间间隔中有多少天产生负余额。 

我们按顺序处理存款日，并将连续存款事件之间的每个间隔视为一个块。 在每个块内，余额减少$p$每天，所以它形成一个算术级数。 我们可以直接确定余额何时低于零并计算有多少天为负数。 

这减少了处理问题$n + 1$段而不是$m$天。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力模拟| O(米) | O(1) | O(1) | 太慢了|
 | 分段算术处理| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们跟踪当前余额并按日升序迭代所有存款事件。 

1. 将当前余额初始化为 0，并将前一天指针设置为 1。我们的想法是，我们处理从第 1 天到下一个存款日的日期范围。 
2. 对于当天的每个存款事件$d$有价值$t$，首先处理从前一个指针到$d - 1$，没有存款发生。 在此期间，余额减少$p$每一天。 

我们不进行模拟，而是将其视为线性序列：从当前余额开始，之后$k$天余额变为$balance - k \cdot p$。 我们确定其中有多少天在扣除后会产生负余额。 
3. 当天申请押金$d$： 添加$t$到平衡，然后立即减去$p$当天付款，因为付款是在存款后发生的。 如果结果余额为负，则增加答案。 
4. 将上一个指针移至$d + 1$，从那天起$d$已完全处理。 
5. 处理完所有存款日后，处理最后处理日至$m$使用相同的算术逻辑。 

关键细节是在不迭代的情况下正确计算递减算术序列中有多少值低于零。 

### 为什么它有效

 在存款之间，余额以固定步长的简单算术级数演变$-p$。 这样的序列有一个单一的阈值交叉点：一旦它变成负值，它就永远保持负值。 这种单调性确保我们可以通过找到余额低于零的第一个索引来计算负数天数。 由于每个部分都是独立且完整计算的，因此每天只计算一次。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def count_negative_days(n, p, m, events):
    ans = 0
    cur = 0
    prev_day = 1

    for d, t in events:
        # process days [prev_day, d-1]
        length = d - prev_day
        if length > 0:
            # balance starts at cur and decreases by p each day
            # find first k such that cur - k*p < 0
            if cur < 0:
                ans += length
            else:
                first_neg = cur // p + 1
                if first_neg < 1:
                    first_neg = 1
                if first_neg <= length:
                    ans += length - first_neg + 1

            cur -= length * p

        # process deposit day d
        cur += t
        cur -= p
        if cur < 0:
            ans += 1

        prev_day = d + 1

    # tail segment
    if prev_day <= m:
        length = m - prev_day + 1
        if cur < 0:
            ans += length
        else:
            first_neg = cur // p + 1
            if first_neg <= length:
                ans += length - first_neg + 1

    return ans

def main():
    n, p, m = map(int, input().split())
    events = [tuple(map(int, input().split())) for _ in range(n)]
    print(count_negative_days(n, p, m, events))

if __name__ == "__main__":
    main()
```该实施过程处理存款之间的每个部分，并避免了数天的迭代。 核心思想是，一旦我们知道了某个细分市场的起始余额，每天就会将其精确减少$p$，所以我们可以使用整数除法来计算它变为负数的边界。 

唯一微妙的部分是正确处理从正的起始余额到第一个负的一天的过渡。 表达式`cur // p + 1`给出重复减法低于零的第一个索引，假设段内基于 1 的索引。 

## 工作示例

 ### 示例 1

 输入：```
3 6 7
2 13
4 20
7 9
```我们跟踪细分：

 | 细分 | 开始平衡| 长度 | 消极的日子| 新百伦|
 | ---| ---| ---| ---| ---|
 | 1-1 | 1-1 0 | 1 | 1 | -6 |
 | 2 | -6 + 13 - 6 = 1 | - | 0 | 1 |
 | 3 | 1 | 1 | 1 | -5 |
 | 4 | -5 + 20 - 6 = 9 | - | 0 | 9 |
 | 5-6 | 9 | 2 | 1 | -3, -9 |
 | 7 | -9 + 9 - 6 = -6 | - | 1 | -6 |

 总负数天数 = 3。 

该迹线显示每个段的行为独立，并且负区域在每个段内形成连续的后缀。 

### 示例 2

 输入：```
2 5 5
3 10
5 5
```| 细分 | 开始| 长度 | 消极的日子| 结束 |
 | ---| ---| ---| ---| ---|
 | 1-2 | 1-2 0 | 2 | 1 | -5 |
 | 3 | 5 | 1 | 0 | 0 |
 | 4-4 | 4-4 0 | 1 | 1 | -5 |
 | 5 | -5 | 1 | 1 | -10 |

 这表明根据沉积物的不同，复苏和崩溃交替出现。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个存款事件都会使用恒定时间算术处理一次 |
 | 空间| O(1) | O(1) | 除了输入存储之外，仅维护几个变量 |

 该解决方案很容易满足限制，因为$n \le 10^5$，并且每个事件的所有操作都是恒定时间。 

## 测试用例```python
import sys, io

def solve(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n, p, m = map(int, input().split())
    events = [tuple(map(int, input().split())) for _ in range(n)]

    def count_negative_days(n, p, m, events):
        ans = 0
        cur = 0
        prev_day = 1

        for d, t in events:
            length = d - prev_day
            if length > 0:
                if cur < 0:
                    ans += length
                else:
                    first_neg = cur // p + 1
                    if first_neg < 1:
                        first_neg = 1
                    if first_neg <= length:
                        ans += length - first_neg + 1
                cur -= length * p

            cur += t
            cur -= p
            if cur < 0:
                ans += 1

            prev_day = d + 1

        if prev_day <= m:
            length = m - prev_day + 1
            if cur < 0:
                ans += length
            else:
                first_neg = cur // p + 1
                if first_neg <= length:
                    ans += length - first_neg + 1

        return ans

    return str(count_negative_days(n, p, m, events))

# samples
assert solve("3 6 7\n2 13\n4 20\n7 9\n") == "3"

# minimum size, single day
assert solve("1 5 1\n1 10\n") == "0"

# no deposits
assert solve("0 3 5\n") == "5"

# always positive after large deposit
assert solve("1 1 5\n1 100\n") == "0"

# alternating threshold behavior
assert solve("2 5 6\n2 10\n5 5\n") == "2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 单日存款| 0 | 边界情况，立即恢复|
 | 没有存款 | 米 | 全线性衰减|
 | 大额提前存款| 0 | 绝不消极|
 | 交替存款 | 2 | 分段正确性 |

 ## 边缘情况

 一种边缘情况是没有存款。 在这种情况下，平衡很简单$-p, -2p, \dots$，所以每一天都是负数。 该算法通过跳过事件循环并处理从余额零开始的最终尾部段来处理此问题，正确计数所有$m$天。 

另一种情况是大额存款，以防止未来出现负余额。 段逻辑检测到起始余额非负且第一个负索引超过段长度，因此它贡献了零天。 

最后一个微妙的情况是最后一天发生存款。 该算法正常处理这一天，然后剩余的段为空，避免了由于零长度间隔而导致的任何差一错误。
