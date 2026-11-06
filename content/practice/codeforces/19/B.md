---
title: "CF 19B - 结账助手"
description: "每个项目都有两个属性。 如果 Bob 为该商品付款，收银员将花费 t[i] 秒处理该商品，而 Bob 也会花费 c[i] 块钱。 在这 t[i] 秒内，鲍勃可以窃取其他物品，每秒一个物品。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 19
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 19"
rating: 1900
weight: 19
solve_time_s: 185
verified: true
draft: false
---
[CF 19B - Checkout Assistant](https://codeforces.com/problemset/problem/19/B)

 **评级：** 1900
 **标签：** dp
 **求解时间：** 3m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个项目都有两个属性。 如果鲍勃支付了该商品的费用，收银员就会花费`t[i]`秒处理它，鲍勃也花费`c[i]`钱。 那些期间`t[i]`几秒钟内，鲍勃可以窃取其他物品，每秒一件物品。 

订单完全由鲍勃控制，这意味着唯一重要的是支付哪些商品。 一旦我们决定了付费物品，它们的总处理时间就决定了有多少其他物品可以被盗。 

假设鲍勃支付了`k`总收银时间为的商品`T`。 那些`k`付费物品已合法获得，且在该期间`T`鲍勃最多可以窃取秒数`T`附加项目。 所以获得的物品总数为：```
k + T
```全部拿走`n`物品，我们需要：```
k + T >= n
```任务变为：```
Choose a subset of items minimizing total cost,
such that sum(t[i]) + number_of_chosen_items >= n.
```这种重新表述就是整个问题。 

约束是下一个线索。 我们最多有 2000 个项目，每个项目`t[i]`最多也是 2000。暴力子集枚举需要检查`2^n`的可能性，这是不可能的`n = 2000`。 甚至`O(n^3)`Python 中的 1 秒限制开始让人感到不舒服。 

该结构强烈暗示动态规划。 状态取决于我们已经可以保证获得多少物品，并且该值永远不会超过`n`。 一个`O(n^2)`DP在这里是完全可行的。 

有几种容易被忽略的边缘情况。 

考虑处理时间为零的项目：```
1
0 5
```答案是`5`。 

为该物品付费不会带来偷窃时间，但该物品本身仍然算作已获得。 错误的解释可能会认为零时间项目毫无用处。 

另一种棘手的情况是，仅一件昂贵的物品就足够了：```
3
10 100
0 1
0 1
```正确答案是`1`。 

支付任何一种廉价物品都会获得一件物品并且没有偷窃时间，因此我们仍然需要更多付费物品。 但支付第一项费用会得到：```
1 paid item + 10 stealable items >= 3
```所以付钱`100`实际上是没有必要的，因为购买这两种便宜的物品只需要花费`2`。 

等等，我们仔细检查一下。 购买这两种廉价物品可以得到：```
2 paid items + 0 stealing time = 2 items
```还是不够。 所以真正的最小值是`100`。 

这个例子说明了为什么只计算总窃取时间是错误的。 付费项目本身也必须计算在内。 

另一个危险的情况是当许多小时间结合在一起时：```
4
1 5
1 5
1 5
1 5
```答案是`10`。 

支付两件物品可以得到：```
2 paid + 2 stealable = 4
```像“总是购买最大时间”这样的贪婪策略在这里不存在，因为所有项目都是对称的。 优化基本上是组合的。 

## 方法

 暴力解决方案很简单。 对于每个项目子集，计算：```
paid_count
total_time
total_cost
```如果：```
paid_count + total_time >= n
```那么这个子集是有效的，我们最小化成本。 

暴力破解是正确的，因为每组可能的付费项目都会被检查一次。 问题在于搜索空间的大小。 和`n = 2000`， 有：```
2^2000
```子集，这在天文上是不可能的。 

关键的观察结果是，每个付费项目都准确贡献：```
t[i] + 1
```朝着最终的要求。 

这`+1`来自合法获得的物品本身，并且`t[i]`来自结账时可偷的额外物品的数量。 

因此，每个选定的项目的行为就像一个对象：```
value = t[i] + 1
cost = c[i]
```我们至少需要总价值`n`同时最大限度地降低成本。 

这是一款经典的背包式DP。 

定义：```
dp[x] = minimum cost to achieve total contribution exactly x
```其中贡献意味着：```
sum(t[i] + 1)
```值大于`n`是不必要的，因为一旦我们到达`n`，可以获得所有物品。 

对于每一项，我们要么接受要么跳过。 这成为标准的 0/1 背包转换。 

蛮力之所以有效，是因为问题本质上是关于子集的。 DP 之所以有效，是因为关于子集的唯一重要信息是其总贡献，而不是项目的确切顺序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^n) | O(2^n) | O(1) | O(1) | 太慢了 |
 | 最佳DP | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1. 阅读所有项目。 
2. 对于每个项目，计算其贡献：```
gain = t[i] + 1
```这表示如果我们支付该物品的费用，则可以获得多少物品。 

1.创建一个大小为DP的数组`n + 1`。```
dp[x] = minimum cost to achieve contribution x
```将所有值初始化为无穷大，除了：```
dp[0] = 0
```因为实现贡献`0`无需花费任何费用。 

1. 一项一项地处理。 

对于每个项目：```
gain = t[i] + 1
cost = c[i]
```向后迭代贡献值`n`到`0`。 

向后迭代可防止多次使用同一项目。 

1.来自之前的贡献`x`，过渡到：```
nx = min(n, x + gain)
```我们的上限为`n`因为较大的值是等效的。 一旦贡献达到`n`，所有物品都已经可以获得。 

1.更新：```
dp[nx] = min(dp[nx], dp[x] + cost)
```这意味着我们要么保留之前实现的最佳方式`nx`，或者我们使用当前项目。 

1.处理完所有项目后，输出：```
dp[n]
```因为贡献`n`方法：```
paid_items + stealable_items >= n
```这保证了获得所有物品。 

### 为什么它有效

 DP 不变量为：```
After processing the first i items,
dp[x] stores the minimum possible cost
to achieve total contribution x.
```每个项目都有两个选择，采取或不采取，并且转换会考虑这两种选择。 由于每个子集对应一个唯一的选择序列，因此 DP 隐式地探索所有有效子集。 

子集的贡献为：```
sum(t[i] + 1)
```等于：```
number_of_paid_items + total_stealing_time
```当该数量至少达到时，子集才有效`n`。 DP 最小化所有此类子集的成本，因此最终答案是最优的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

INF = 10**18

n = int(input())
items = [tuple(map(int, input().split())) for _ in range(n)]

dp = [INF] * (n + 1)
dp[0] = 0

for t, c in items:
    gain = t + 1

    for x in range(n, -1, -1):
        if dp[x] == INF:
            continue

        nx = min(n, x + gain)
        dp[nx] = min(dp[nx], dp[x] + c)

print(dp[n])
```DP 数组存储每个可实现的贡献级别的最低成本。 数组大小仅为`n + 1`因为值大于`n`是不必要的。 

向后迭代是最重要的实现细节。 如果我们向前迭代，一个项目可以更新状态，然后立即在同一次迭代中再次重用，从而错误地将问题变成无界背包。 

帽子：```
nx = min(n, x + gain)
```避免越界访问，并将所有“足够好”状态压缩为一个最终目标状态。 

无穷大值必须很大，因为成本可以达到：```
2000 * 10^9
```所以`10^18`是一个安全的选择。 

## 工作示例

 ### 示例 1

 输入：```
4
2 10
0 20
1 5
1 3
```收获是：```
3, 1, 2, 2
```我们追踪DP。 

| 项目 | 增益| 成本| 更新状态 |
 | ---| ---| ---| ---|
 | 开始| - | - | dp[0] = 0 |
 | (2,10) | 3 | 10 | 10 dp[3] = 10 |
 | (0,20) | (0,20) | 1 | 20 | dp[1] = 20，dp[4] = 30 |
 | (1,5) | 2 | 5 | dp[2] = 5，dp[4] = 15 |
 | (1,3) | 2 | 3 | dp[2] = 3, dp[4] = 8 |

 最终答案：```
8
```最佳选择是支付最后两项费用。 他们的总贡献是：```
2 + 2 = 4
```这足以容纳所有物品。 

### 示例 2

 输入：```
3
0 5
0 6
0 7
```每一项都有增益`1`。 

| 项目 | 增益| 成本| 最佳可达状态|
 | ---| ---| ---| ---|
 | 开始| - | - | dp[0] = 0 |
 | 第一| 1 | 5 | dp[1] = 5 |
 | 第二 | 1 | 6 | dp[2] = 11 | dp[2] = 11 |
 | 第三| 1 | 7 | dp[3] = 18 |

 最终答案：```
18
```不可能窃取，因为每次处理时间都是零。 鲍勃必须为每件物品付款。 

这个例子证实了`+1`付费项目本身的贡献至关重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n^2) | O(n^2) | 对于每个`n`项目，我们最多迭代`n`DP 状态 |
 | 空间| O(n) | DP数组有大小`n + 1`|

 和`n <= 2000`，该算法在最坏的情况下执行大约 400 万次转换，这很容易符合 Python 的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def solve():
    input = sys.stdin.readline

    INF = 10**18

    n = int(input())
    items = [tuple(map(int, input().split())) for _ in range(n)]

    dp = [INF] * (n + 1)
    dp[0] = 0

    for t, c in items:
        gain = t + 1

        for x in range(n, -1, -1):
            if dp[x] == INF:
                continue

            nx = min(n, x + gain)
            dp[nx] = min(dp[nx], dp[x] + c)

    print(dp[n])

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()

    backup = sys.stdout
    sys.stdout = out

    solve()

    sys.stdout = backup
    return out.getvalue().strip()

# provided sample
assert run(
"""4
2 10
0 20
1 5
1 3
""") == "8", "sample 1"

# minimum size
assert run(
"""1
0 7
""") == "7", "single item"

# all zero times
assert run(
"""3
0 5
0 6
0 7
""") == "18", "must pay for all"

# one large time dominates
assert run(
"""5
10 4
0 100
0 100
0 100
0 100
""") == "4", "single item covers everything"

# equal values
assert run(
"""4
1 5
1 5
1 5
1 5
""") == "10", "choose any two"

# off-by-one contribution check
assert run(
"""2
0 3
1 10
""") == "10", "gain includes paid item itself"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 零时间单品| 7 | 付费项目本身贡献一 |
 | 全部归零 | 18 | 18 不可能偷窃|
 | 一项巨大的时间项目| 4 | 大额捐款可涵盖所有项目|
 | 所有相同的值 | 10 | 10 DP 正确结合贡献 |
 | 小差一箱 | 10 | 10 贡献必须是`t+1`， 不是`t`|

 ## 边缘情况

 考虑尽可能最小的输入：```
1
0 5
```该项目的贡献是：```
0 + 1 = 1
```DP 转变自：```
dp[0] = 0
```到：```
dp[1] = 5
```自从`n = 1`，答案就变成了`5`。 

此案例证明，即使不存在盗窃时间，付费项目也会计入最终总数。 

现在考虑：```
3
0 5
0 6
0 7
```每个项目都贡献准确`1`。 实现贡献的唯一途径`3`正在选择所有三个项目。 DP逐渐构建：```
dp[1] = 5
dp[2] = 11
dp[3] = 18
```不存在捷径，因为总窃取时间始终为零。 

另一个微妙的情况是：```
5
10 4
0 100
0 100
0 100
0 100
```第一项贡献：```
10 + 1 = 11
```这已经超过了`n = 5`。 

DP立即更新：```
dp[5] = 4
```因为上限：```
nx = min(n, x + gain)
```如果没有这个上限，实现要么会浪费内存，要么会面临索引错误的风险。 

最后，考虑：```
2
0 3
1 10
```第一项贡献`1`，第二个贡献`2`。 

仅支付第二项已满足：```
2 >= n
```所以答案是`10`。 

使用贡献的错误实现`t`而不是`t+1`会错误地得出两项都是必要的结论并返回`13`。
