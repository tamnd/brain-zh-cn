---
title: "CF 104941I - 我是间谍"
description: "我们得到一个包含 $n$ 行和 $m$ 列的网格。 每个单元格代表一个可以亮或暗的窗口。 配置在两个方面受到限制。 首先，每行 $i$ 都有固定数量的 $ai$ 点亮的窗口。"
date: "2026-06-28T18:19:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104941
codeforces_index: "I"
codeforces_contest_name: "SLPC 2024 Open Division"
rating: 0
weight: 104941
solve_time_s: 67
verified: false
draft: false
---

[CF 104941I - 我间谍](https://codeforces.com/problemset/problem/104941/I)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 7s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个网格$n$行和$m$列。 每个单元格代表一个可以亮或暗的窗口。 配置在两个方面受到限制。 

首先，每一行$i$有固定数量$a_i$的明亮的窗户。 其次，任何两个点亮的窗户都不能水平或垂直接触。 这意味着如果一个窗户是亮的，那么它的同一行的左右邻居必须是黑暗的，并且它正上方和正下方的窗户也必须是黑暗的。 

任务是计算存在多少个有效的点亮窗口的全局配置，模数$10^9+7$。 

约束的宽度较小，但高度适中：$n \le 30$,$m \le 23$。 这立即表明我们可以承受对大小的行或位掩码的指数工作$2^m$，但不能超过整个网格。 水平约束是行的局部约束，而垂直约束则耦合相邻行，这强烈建议使用位掩码状态进行逐行动态编程。 

天真的方法会尝试所有$2^{nm}$配置，这是一个天文数字。 即使按行数限制仍然留下太多的可能性。 关键的困难是在匹配行总和的同时同时强制执行两个邻接约束。 

出现微妙的边缘情况时$a_i$相对于$m$。 如果$a_i > \lceil m/2 \rceil$，单独该行不可能满足水平不相邻规则，因为一行长度中不相邻单元格的最大数量$m$是$\lceil m/2 \rceil$。 在这种情况下，答案必须立即为零。 

另一个边缘情况是当$n = 1$。 然后，问题简化为计算具有固定大小的单个路径图上的有效独立集，这纯粹是每行的组合。 

## 方法

 强力解释将每个单元格视为二进制变量并全局检查所有约束。 这是正确的，但不可行。 状态空间大小为$2^{nm}$，甚至检查每个配置的约束是$O(nm)$，导致$O(nm2^{nm})$，这远远超出了限制。 

我们通过注意到约束是局部的来完善视角。 水平邻接仅影响行内，而垂直邻接仅耦合相邻行。 这建议将网格分为行状态。 

每行可以表示为长度的位掩码$m$，其中 1 表示窗口亮起。 有效的行掩码不得包含相邻的 1。 另外，行中 1 的数量$i$必须等于$a_i$。 

现在，网格变成了具有兼容性约束的行掩码序列：相邻行不得在同一列中共享 1。 也就是说，对于行掩码$x$和$y$，我们要求$x \& y = 0$。 

这将问题转化为对分层图中的路径进行计数：每一层都是一行，节点是有效掩码，边代表兼容性。 

关键的见解是$m \le 23$，因此没有相邻 1 的有效掩码的数量是可以管理的（受斐波那契增长的限制，大约$F_{25} \approx 10^5$）。 这允许对状态进行动态编程。 

我们预先计算所有有效的掩码及其流行计数。 然后我们预先计算不垂直重叠的掩模之间的过渡。 最后，我们逐行运行DP。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |$O(2^{nm})$|$O(nm)$| 太慢了 |
 | 位掩码 DP |$O(n \cdot S^2)$在哪里$S \approx F_{m+2}$|$O(S^2)$| 已接受 |

 ## 算法演练

 我们将状态定义为编码为位掩码的有效行配置。 

## 1. 生成有效的行掩码

 我们枚举所有面具$0$到$2^m - 1$。 如果掩码不包含相邻的设置位，则该掩码有效。 这确保了水平邻接得到满足。 

我们还记录每个掩码中设置的位数以强制行约束。 

## 2. 按行要求对掩码进行分组

 对于每一行$i$，我们只允许 popcount 等于的掩码$a_i$。 这会尽早修剪无效状态并减少 DP 转换。 

## 3. 预计算兼容性

 对于任意两个有效掩码$x$和$y$，我们定义它们兼容如果$(x \& y) = 0$。 这强制执行垂直邻接约束。 

我们为每个掩码预先计算下一行中所有兼容掩码的列表。 

## 4.动态规划初始化

 对于第一行，我们设置$dp[mask] = 1$对于所有具有 popcount 的有效掩码$a_1$。 

这代表了将点亮的窗口放置在符合约束的第一行中的所有方法。 

## 5. 逐行转换

 对于每一行$i$从 2 到$n$，我们计算一个新的 DP 表：

 对于每一个面膜$cur$对行有效$i$，我们对所有之前的掩模求和$prev$与行兼容且有效$i-1$。 

这将逐行构建所有有效的部分配置。 

## 6. 最终聚合

 答案是最后一行中所有 DP 值的总和。 

### 为什么它有效

 在每一步中，DP 状态准确地表示填充所有行直至当前行的方式数量：

 当前行固定为有效掩码，并且满足所有先前的邻接约束。 该转换保留了水平有效性（通过掩码构造）和垂直有效性（通过兼容性过滤）。 由于每个有效的完整网格恰好对应于一个行掩码序列，因此不会遗漏或重复计算任何配置。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 10**9 + 7

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    max_mask = 1 << m
    valid = []
    pop = [0] * max_mask

    for mask in range(max_mask):
        if mask & (mask << 1):
            continue
        pop[mask] = bin(mask).count("1")
        valid.append(mask)

    # group by popcount
    by_pop = [[] for _ in range(m + 1)]
    for mask in valid:
        by_pop[pop[mask]].append(mask)

    # precompute compatibility
    compat = {}
    for x in valid:
        compat[x] = []
        for y in valid:
            if x & y == 0:
                compat[x].append(y)

    # initial dp
    first = a[0]
    dp = {mask: 0 for mask in valid}
    for mask in by_pop[first]:
        dp[mask] = 1

    # transitions
    for i in range(1, n):
        need = a[i]
        new_dp = {mask: 0 for mask in valid}
        for cur in by_pop[need]:
            total = 0
            for prev in compat[cur]:
                total = (total + dp[prev]) % MOD
            new_dp[cur] = total
        dp = new_d_
```
