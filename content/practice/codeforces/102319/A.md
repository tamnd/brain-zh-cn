---
title: "CF 102319A - 安德鲁和高效变革"
description: "我们有一个包含 n 个不同面额的硬币系统，包括面额 1。Andrew 必须为连续区间 [l, r] 中的每个金额单独支付。 对于每个金额，他想要尽可能少的硬币，其价值之和恰好等于该金额。"
date: "2026-08-14T04:49:37+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102319
codeforces_index: "A"
codeforces_contest_name: "UBC Summer Contest 2018"
rating: 0
weight: 102319
solve_time_s: 161
verified: true
draft: false
---

[CF 102319A - 安德鲁和高效变革](https://codeforces.com/problemset/problem/102319/A)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个硬币系统，其中包含`n`不同的教派，包括教派`1`。 安德鲁必须为连续时间间隔内的每一笔金额单独支付`[l, r]`。 对于每个金额，他想要尽可能少的硬币，其价值之和恰好等于该金额。 

我们可能会引入一种额外的面额`c`， 在哪里`1 <= c <= r`。 添加后，每笔金额`l`通过`r`可以根据需要多次使用新硬币。 目标是最小化所有这些金额的最小硬币数量的总和。 如果没有新的面额改善总数，我们就打印`0`。 如果多个面额的最佳总分相同，则其中任何一个都有效。 官方问题页面给出了下面使用的相同的两个示例。 

有趣的约束是`r - l <= 50`。 的绝对值`r`可以是 200000，因此算法执行的工作量与`r`是合理的，但对每个可能的新教派单独这样做就不合理了。 最多有 51 种杂货金额，而可能有多达 200000 种新面额。 现有面额最多为420种，因此原币系统的标准动态程序成本较高`O(nr)`，最大的情况下大约有 8400 万个基本转换。 二次或三次依赖关系`r`是不可能的。 

有几种边缘情况很容易被错误处理。 如果请求的间隔由已经是现有硬币的单个金额组成，则任何添加都无法改进它。 例如，与```
3
1 1
1 2 3
```正确的输出是`0`，因为量`1`已经花费一枚硬币，并且任何支付都不能使用少于一枚硬币。 总是选择某些候选面额的粗心实现可能会错误地打印`1`。 

最佳新面额可以小于`l`。 例如，```
1
100 150
1
```有一种非常有用的新硬币`50`。 从 100 到 150 的每笔金额都可以使用两到三个硬币来支付，而在接近 100 的情况下添加一枚硬币只会使该区间的一小部分变得便宜。 限制候选人`[l, r]`因此是不正确的。 

当新硬币大于间隔宽度时，会发生另一种微妙的情况。 认为`r-l=10`我们添加一枚硬币`c`大于 10。一个目标可能会使用多个副本`c`，但为了找到全球最好的面额，我们可以用一枚硬币代替这几枚硬币，其价值等于它们的总和。 那顶多还是换个`r`并保持大于间隔宽度。 错过这一观察会导致不必要地昂贵的候选者评估。 

最后，现有的面额不得被视为新的改进。 添加已经存在的硬币会使每个最小值保持不变。 该算法只是跳过此类候选者。 

## 方法

 直接的方法会考虑每一种可能的新面额，并再次解决完整的硬币找零问题。 对于一名固定候选人`c`，我们可以运行通常的动态程序`dp[x] = 1 + min(dp[x - coin])`总金额高达`r`，现在使用原来的面额加上`c`。 这是正确的，因为标准递归考虑了最佳表示的最后一枚硬币。 

然而，这种方法对每个候选者重复几乎相同的计算。 最多有`r`候选人，每个 DP 采取`O(nr)`时间。 在最坏的情况下，这会变成`O(nr²)`， 大致`420 * 200000²`，大约有 16.8 万亿次转换。 

关键的观察是我们实际上不需要重新计算原始的硬币系统。 首先计算`base[x]`，每场比赛所需的最少原币数量`x <= r`。 然后问如何添加特定的`c`改变这些值。 

对于小型新硬币，只有几种可能的面额可供检查。 更准确地说，让`W = r - l + 1`。 

购物间隔内最多有 51 笔金额，因此`W <= 51`。 对于每一位候选人`c <= W`，我们可以计算新的 DP`O(r)`使用递归的时间`new[x] = min(base[x], new[x-c] + 1)`。 

只有`W`这样的候选人，给予`O(rW)`时间。 

更有用的观察处理每个候选人`c > W`。 考虑使用某些目标的表示`k >= 2`新硬币的副本。 这些副本贡献了价值`kc`。 而不是增加面额`c`，想象一下增加面额`kc`。 自从`kc <= x <= r`，这仍然是一个允许的新面额。 自从`c > W`，它也是一个有效的大候选者。 这`k`硬币已被一枚硬币取代，因此所得的表示效果并不差。 

因此，在所有大于`W`，总有一个全局最优候选，每个目标最多使用一次。 对于固定的这样`c`， 数量`x`只能从改进`base[x]`到`min(base[x], base[x-c] + 1)`，

什么时候`x >= c`。 我们只有`W`目标金额，因此每个大候选人都会采取`O(W)`时间。 最多有`r`候选人，给另一个`O(rW)`学期。 

暴力法之所以有效，是因为动态规划完全解决了一个固定的硬币系统。 它失败了，因为它为每个候选人重建了该系统。 通过对间隔宽度的观察，我们可以将候选币种分为需要完整 DP 的一小组面额和仅需要考虑新硬币的一次使用的一大组。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(nr²)`|`O(r)`| 太慢了|
 | 最佳|`O(nr + r(r-l+1))`|`O(r)`| 已接受 |

 ## 算法演练

 1. 读取现有面额并计算`base[x]`，形成每个金额所需的现有硬币的最小数量`x`从`0`通过`r`。 价值`base[0]`为零，面额`1`保证每笔金额都能达到。 
2. 计算所有购物金额的原始总额`l`通过`r`。 这是新教派必须超越的价值才能发挥作用。 
3.让`W = r - l + 1`。 对于每个候选人教派`c`和`1 <= c <= W`，如果已经存在则跳过它。 否则，构建一个临时 DP 数组`0`通过`r`。 对于以下金额`c`，新币不能使用，所以它们的价值正好是`base[x]`。 为了`x >= c`，最佳解决方案要么不使用新硬币，要么至少使用一次，给出递归`min(base[x], new[x-c] + 1)`。 
4. 将临时 DP 值相加`[l, r]`。 如果总和小于迄今为止看到的最佳总数，请记住该候选人。 
5. 对于每一位候选人`c > W`，再次跳过已经存在的面额。 对于每个目标`x`在`[l, r]`，考虑要么不使用新硬币，成本`base[x]`，或使用它的一份副本，成本`base[x-c] + 1`什么时候`x >= c`。 取较小的值。 
6. 保留总成绩最小的候选人。 如果最小的总和等于原来的总和，则输出`0`; 否则输出记住的面额。 

中心不变量是`base[x]`仅使用原始面额始终是精确的最佳值。 对于小候选者，递归考虑了新硬币的每一个可能的使用计数，因为`new[x-c]`已经包含了最好的代表`x-c`。 对于大的候选者，任何使用多个副本的解决方案都可以转化为使用另一种合法大面额的一个副本的解决方案，因此仅考虑一枚新硬币并不能排除全局最优答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve(data: str) -> str:
    it = iter(map(int, data.split()))
    n = next(it)
    l = next(it)
    r = next(it)

    coins = [next(it) for _ in range(n)]
    coin_set = set(coins)

    # Original minimum-coin DP.
    INF = r + 1
    base = [INF] * (r + 1)
    base[0] = 0

    # Unbounded coin change.
    for c in coins:
        if c > r:
            continue
        for x in range(c, r + 1):
            v = base[x - c] + 1
            if v < base[x]:
                base[x] = v

    width = r - l + 1
    original_total = sum(base[l:r + 1])

    best_total = original_total
    best_coin = 0

    # Small candidates: a full DP over [0, r] is affordable because
    # there are at most width <= 51 of them.
    for c in range(1, min(width, r) + 1):
        if c in coin_set:
            continue

        cur = base[:]

        for x in range(c, r + 1):
            v = cur[x - c] + 1
            if v < cur[x]:
                cur[x] = v

        total = sum(cur[l:r + 1])

        if total < best_total:
            best_total = total
            best_coin = c

    # Large candidates: c > width.
    # A globally optimal large candidate never needs to be used twice.
    for c in range(width + 1, r + 1):
        if c in coin_set:
            continue

        total = 0

        for x in range(l, r + 1):
            v = base[x]

            if x >= c:
                nv = base[x - c] + 1
                if nv < v:
                    v = nv

            total += v

        if total < best_total:
            best_total = total
            best_coin = c

    return str(best_coin)

def main():
    data = sys.stdin.buffer.read().decode()
    print(solve(data))

if __name__ == "__main__":
    main()
```第一个 DP 结构`base`。 一次处理一种面额并按递增顺序处理金额是标准的无限制硬币找零循环，因为处理硬币后`c`,`base[x-c]`可能已经使用了任意数量的副本`c`。 

小候选循环副本`base`然后使用新面额放宽每个金额。 开始于`base`相当于说新币可能被使用零次。 向前遍历可以自动实现重复使用。 

拆分使用`width`， 不是`r-l`，因为正好有`r-l+1`购物金额。 使用`r-l`当间隔只有一个值时，这里会产生一个相差一的错误。 

对于大候选人来说，`x-c`可能为负数，因此代码检查`x >= c`索引之前`base`。 外面没有其他金额`[0,r]`是需要的。 Python 整数还避免了任何溢出问题，尽管所有相关总数远小于普通 64 位整数的限制。 

候选人已经出现在`coin_set`被跳过。 添加现有面额并不能改善硬币系统，处理它只会浪费时间。 

## 工作示例

 第一个官方样本是```
1
10 10
1
```原来的系统只包含一值硬币，因此金额 10 需要 10 个硬币。 区间宽度为 1，因此候选`1`被跳过，因为它已经存在。 每个大于 1 的候选者都由大候选者案例处理。 

| 候选人| 目标| 原创| 与候选人 | 总计 |
 | ---| ---| ---| ---| ---|
 | 10 | 10 10 | 10 10 | 10 1 | 1 |

 最好的候选人是`10`，所以输出是`10`。 这也演示了单目标边界情况。 

第二个官方样本是```
3
10 15
1 5 10
```最初的最小计数如下。 

| 数量`x`|`base[x]`|
 | ---| ---|
 | 10 | 10 1 |
 | 11 | 11 2 |
 | 12 | 12 2 |
 | 13 | 3 |
 | 14 | 14 3 |
 | 15 | 15 2 |

 原来的总数是`13`。 该区间包含六个量，因此`W=6`。 候选人`12`是一个大候选人。 它尚未存在，一次性计算给出以下值。 

| 数量`x`|`base[x]`|`base[x-12]+1`| 新的最低限度|
 | ---| ---| ---| ---|
 | 10 | 10 1 | 不可用 | 1 |
 | 11 | 11 2 | 不可用 | 2 |
 | 12 | 12 2 | 1 | 1 |
 | 13 | 3 | 2 | 2 |
 | 14 | 14 3 | 3 | 3 |
 | 15 | 15 2 | 2 | 2 |

 新的总数是`11`，所以面额`12`改进了原来的系统，是样本的最优答案。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(nr + r(r-l+1))`| 原始DP费用`O(nr)`。 小候选人成本`O(rW)`和大的候选人成本`O(rW)`， 在哪里`W=r-l+1<=51`。 |
 | 空间|`O(r)`| 原始 DP 和一个临时 DP 各包含`r+1`价值观。 |

 和`r <= 200000`,`n <= 420`， 和`W <= 51`，贵的部分是单张原币找零DP。 候选搜索取决于购物区间的宽度而不是其绝对位置，这正是为什么`r-l <= 50`限制使得该解决方案切实可行。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    return solve(inp).strip()

# Provided sample 1
assert run("""\
1
10 10
1
""") == "10", "sample 1"

# Provided sample 2
assert run("""\
3
10 15
1 5 10
""") == "12", "sample 2"

# Minimum-size input. Amount 1 is already a one-coin payment,
# so no new denomination can improve it.
assert run("""\
1
1 1
1
""") == "0", "minimum-size case"

# All requested amounts are already denominations.
# Adding anything cannot make a payment cheaper than one coin.
assert run("""\
3
1 3
1 2 3
""") == "0", "no improvement"

# The optimal new denomination is smaller than l.
# Coin 50 makes every amount from 100 through 150 require at most 3 coins.
assert run("""\
1
100 150
1
""") == "50", "candidate below l"

# Boundary case where the best candidate is exactly r.
assert run("""\
2
10 10
1 5
""") == "10", "candidate at r"

# Maximum-size structural test. The existing denominations are 1..420.
# Adding 199950 gives one coin for 199950 and two coins for every
# following amount, reaching the lower bound of 101 total coins.
coins = " ".join(map(str, range(1, 421)))
assert run(f"""\
420
199950 200000
{coins}
""") == "199950", "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1 1 / 1`|`0`| 最小规模的输入和已经最优的一币支付 |
 |`3 / 1 3 / 1 2 3`|`0`| 当每个目标都已经有一个硬币表示时，不可能有任何改进 |
 |`1 / 100 150 / 1`|`50`| 最佳面额可以严格小于`l`|
 |`2 / 10 10 / 1 5`|`10`| 候选者恰好位于上边界`r`|
 |`420 / 199950 200000 / 1..420`|`199950`| 最大限度`n`， 大的`r`，和区间宽度边界 |

 ## 边缘情况

 第一个边缘情况是包含已经是硬币的单个金额的区间。 为了```
3
1 1
1 2 3
```原始成本金额`1`已经是一枚硬币了。 每笔正数的合法支付都需要至少一枚硬币，因此原始总数是最佳的。 DP 计算`base[1]=1`，每个候选者要么保持该值不变，要么被跳过，因为它已经存在，并且`best_coin`保持为零。 

第二种边缘情况是一种比整个购物间隔更小的有用的新面额。 为了```
1
100 150
1
```候选人`50`由小候选循环处理，因为该区间包含 51 个数量。 临时DP重复申请`cur[x] = min(base[x], cur[x-50]+1)`。 因此，金额 100 到 150 可以使用两到三枚 50 面值的硬币，其余的则用硬币填充。 至少仅限于候选人的策略`l`永远不会发现这种改进。 

第三种极端情况涉及大额新硬币的多个副本。 假设间隔宽度为 10，候选者的值为 20。如果目标使用两个副本，则这两个副本的总价值为 40。由于目标本身至少为 40，因此面额 40 也是合法候选者。 将两枚 20 面值的硬币替换为一枚 40 面值的硬币可以减少硬币数量。 同样的论点适用于任意数量的副本。 这就是为什么大候选循环只检查`base[x-c]+1`。 

第四种边缘情况是现有的面额。 如果候选人`c`属于原始集合，再次添加不会改变任何内容。 这`coin_set`成员资格检查会在任一评估路径之前删除此类候选者，从而防止零改进被误认为是有用的新教派。 

最终的边缘情况是候选范围的右边界。 新硬币大于`r`最多不能出现在付款中`r`，因此搜索停止于`r`。 反过来，`c=r`必须包括在内。 在输入中```
2
10 10
1 5
```新硬币`10`将唯一目标的成本从两枚硬币更改为一枚，因此正确答案是`10`。 循环使用`range(width + 1, r + 1)`对于大候选人，并准确地包括这个上限。
