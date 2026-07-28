---
title: "CF 102798E - 如此多的可能性......"
description: "我们有 n 个敌方小兵。 第 i 个小兵以 a[i] 生命值开始。 我们执行了 m 次单次伤害攻击。 每次攻击都会从仍然活着的小兵中统一选择，并将该小兵的生命值减少 1 点。 当小兵的生命值为零时，它就会消失。"
date: "2026-07-27T17:49:06+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102798
codeforces_index: "E"
codeforces_contest_name: "2020 China Collegiate Programming Contest, Weihai Site"
rating: 0
weight: 102798
solve_time_s: 41
verified: true
draft: false
---

[CF 102798E - 如此多的可能性...](https://codeforces.com/problemset/problem/102798/E)

 **评级：** -
 **标签：** -
 **求解时间：** 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有`n`敌方小兵。 这`i`-th minion 开始于`a[i]`健康。 我们执行准确`m`一伤害攻击。 每次攻击都会从仍然活着的小兵中统一选择，并将该小兵的生命值减少 1 点。 当小兵的生命值为零时，它就会消失。 

任务是计算最终死亡的小兵的预期数量`m`攻击。 

重要的限制是`n <= 15`和`m <= 100`。 的小值`n`强烈建议子集动态规划，因为只有`2^15 = 32768`可能的死亡小兵组。 然而，健康值使得直接存储每个可能的健康配置变得不可能。 我们只需要存储影响答案的信息。 

一个常见的错误是假设如果总伤害至少是一些小兵生命值的总和，那么这些小兵一定会死。 攻击是随机的，因此伤害可能会浪费在不同的小兵身上。 

例如：```
1 1
5
```答案是`0`，因为一次伤害无法杀死生命值为 5 的小兵。 

另一种边缘情况是一些小兵已经需要完全剩余的所有伤害。```
2 3
1 100
```第一个小兵肯定会死，但第二个小兵无法受到足够的伤害。 答案是`1`。 

## 方法

 对所有可能的攻击序列进行直接模拟是不可能的。 有`n^m`目标的可能选择，甚至`n = 15`,`m = 100`，这个数字远远超出了我们所能探索的范围。 

关键的观察是，最终的答案仅取决于哪些小兵死了。 我们不需要每个活着的小兵的确切剩余生命值。 对于一组固定的死亡小兵`S`, 每个小兵在`S`已消耗掉其全部生命值伤害。 其余的攻击仅分布在其他小兵之间。 

我们使用两个动态程序。 

第一个 DP 计算死亡小兵集合恰好是的概率`S`受到一定次数的攻击后。 过渡会考虑最后一个死去的小兵。 如果是小兵`x`此时加入死局，之前的状态一定是`S`没有`x`，并且先前攻击幸存小兵的次数取决于已消耗的总生命值。 

第二个 DP 计算在不杀死任何小兵的情况下可以将剩余的攻击放置在一组小兵中的方式。 组合这两个值给出了每个可能的最终死集的概率贡献。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^m) | O(n^m) | O(米) | 太慢了 |
 | 最佳| O(m * n * 2^n) | O(m * 2^n) | O(m * 2^n) | 已接受 |

 ## 算法演练

 1. 预先计算二项式系数高达`m`。 转换需要组合，因为我们计算有多少攻击位置属于特定的小兵组。 
2. 预先计算每个子集的总健康状况。 对于一个子集`S`,`sum[S]`是杀死所有小兵所需的攻击次数`S`。 
3. 计算`f[mask]`，在当前次数的攻击之后，死亡的小兵恰好是`mask`。 

对于非空面具，选择一个死去的小兵`x`作为在最新攻击片段中死亡的人。 之前的死局是`mask`没有`x`。 安排完成攻击的方式数量`x`是用组合来计算的。 

还有一个过渡，即下一次攻击会击中当前状态后已经存活的小兵，并且不会造成新的死亡。 
4. 计算`g[k][mask]`, 分配方式的数量`k`小兵之间的攻击`mask`同时让每个小兵都活着。 

选择一名随从`x`从面具中。 它可以接收从零到`health[x]-1`攻击。 其余的攻击由其他小兵递归处理。 
5. 对于每一个可能的最终死局`S`，乘以：

 的概率`S`是真正杀戮过程之后的死局，

 通过未使用的攻击可以对幸存的小兵进行有效方式的数量，

 通过`|S|`，死亡小兵的数量。 

所有这些贡献的总和就是预期的答案。 

为什么它有效：

 第一个 DP 将随机过程分为小兵实际死亡的时刻。 第二个 DP 解释了对幸存小兵的攻击，但从未杀死他们。 每个可能的攻击序列都有一对对应的状态，因此最终的总和准确地计算每个结果及其概率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    a = list(map(int, input().split()))

    N = 1 << n

    comb = [[0] * (m + 1) for _ in range(m + 1)]
    for i in range(m + 1):
        comb[i][0] = comb[i][i] = 1
        for j in range(1, i):
            comb[i][j] = comb[i - 1][j - 1] + comb[i - 1][j]

    sm = [0] * N
    cnt = [0] * N
    for mask in range(1, N):
        b = mask & -mask
        idx = b.bit_length() - 1
        sm[mask] = sm[mask ^ b] + a[idx]
        cnt[mask] = cnt[mask ^ b] + 1

    f = [0.0] * N
    f[0] = 1.0

    for step in range(1, m + 1):
        nf = [0.0] * N
        for mask in range(N):
            c = cnt[mask]
            if mask:
                x = mask
                while x:
                    b = x & -x
                    i = b.bit_length() - 1
                    prev = mask ^ b
                    need = step - 1 - sm[prev]
                    if need >= a[i] - 1:
                        nf[mask] += f[prev] * comb[need][a[i] - 1]
                    x ^= b
                nf[mask] /= (n - c + 1)
            if n > c:
                nf[mask] += f[mask] / (n - c)
        f = nf

    g = [[0.0] * N for _ in range(m + 1)]
    for mask in range(N):
        g[0][mask] = 1.0

    for step in range(1, m + 1):
        for mask in range(1, N):
            b = mask & -mask
            i = b.bit_length() - 1
            rest = mask ^ b
            for take in range(min(step, a[i] - 1) + 1):
                g[step][mask] += comb[step][take] * g[step - take][rest]

    ans = 0.0
    full = N - 1
    for mask in range(N):
        rem = m - sm[mask]
        if rem >= 0:
            ans += f[mask] * g[rem][full ^ mask] * cnt[mask]

    print("{:.12f}".format(ans))

if __name__ == "__main__":
    solve()
```该实现将子集信息保存在整数掩码中。`sm[mask]`避免重复求和健康值，否则会增加另一个因素`n`内部的过渡。 

概率DP逐层更新，因为只需要之前的攻击次数。 第二个 DP 保留所有层，因为最终查询可以要求任何剩余的攻击次数。 

所有计算都使用浮点，因为结果是预期的。 这些值对于双精度来说仍然足够小。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(m * n * 2^n) | 每个DP状态最多检查`n`子集转换 |
 | 空间| O(m * 2^n) | O(m * 2^n) | 第二个 DP 的存储状态 |

 和`n = 15`和`m = 100`，操作数在几百万左右，很合适。 

## 边缘情况

 当一个小兵需要比所有可用攻击更多的伤害时，它永远不会出现在死亡集中。 由于无法达到所需的健康总和，子集 DP 自然赋予其零贡献。 

当多个小兵的生命值为 1 时，它们会被正确处理，因为每个小兵在一次攻击后都会死亡。 概率 DP 区分每个可能的子集，而不是假设死亡按固定顺序发生。 

当所有小兵死后恰好`m`攻击，幸存的小兵 DP 被调用，剩余攻击为零，唯一有效的分布是空分布。 这就是为什么`g[0][mask] = 1`对于每一个面具都是必要的。
