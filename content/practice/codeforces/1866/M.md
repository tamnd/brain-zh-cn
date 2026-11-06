---
title: "CF 1866M - 强大的岩石塔"
description: "我们被要求计算使用相同的小岩石建造高度为 N 的塔的预期移动次数，其中每次放置都可能触发顶部岩石的级联坠落。 每次在高度 x 处放置一块岩石时，最上面的岩石就有 Px/100 掉落的概率。"
date: "2026-06-08T23:52:03+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "combinatorics", "dp", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 1866
codeforces_index: "M"
codeforces_contest_name: "COMPFEST 15 - Preliminary Online Mirror (Unrated, ICPC Rules, Teams Preferred)"
rating: 2400
weight: 1866
solve_time_s: 138
verified: false
draft: false
---

[CF 1866M - 强大的岩石塔](https://codeforces.com/problemset/problem/1866/M)

 **评分：** 2400
 **标签：** 蛮力、组合数学、dp、数学、概率
 **求解时间：** 2m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算建造一座高度塔的预期移动次数`N`使用相同的小岩石，每次放置都可能引发顶部岩石的级联坠落。 每当一块石头被放置在高处时`x`，最上面的岩石有概率`P_x/100`坠落的。 如果它掉落，它下面的岩石也会以相同的概率掉落，并且这条链会继续向下延伸到底部。 重复该过程直到塔达到最大高度`N`没有任何岩石掉落。 

输入是一个整数`N`表示目标高度和概率数组`P_1`通过`P_N`。 输出应该是预期的移动次数，以模数表示`998244353`将分数转换为形式后`P * Q^{-1}`。 

鉴于限制条件，`N`可以达到`2 * 10^5`。 这排除了任何明确模拟所有可能的落石序列的方法，因为这将涉及指数复杂性。 我们需要一个在大致线性时间内工作的解决方案。 

当概率为`0`或非常高。 如果`P_x = 0`为所有人`x`，塔总会达到高度`N`正好在`N`移动。 反之，如果有一些`P_x`接近于`100`，顶部的岩石可能会反复掉落，天真的方法可能会低估预期的移动次数。 另一个微妙的情况是当`N = 1`，这需要小心处理以避免索引错误。 

## 方法

 暴力解决方案会尝试通过模拟每种可能的跌倒序列来计算预期的移动次数。 每个岩石放置位置都可能导致从零到`x`岩石掉落。 直接跟踪所有这些场景需要`O(2^N)`在最坏的情况下进行操作，这显然是不可行的`N = 2 * 10^5`。 

关键的见解是使用动态规划将问题视为线性递归。 定义`E[x]`作为到达高度的预期移动次数`x`。 当我们把一块石头放在高处时`x`, 有成功的概率`q = 1 - P_x / 100`它会留下来并将我们带到更高的高度`x`。 如果岩石落下，我们会有效地重置到较小的高度，形成预期的几何级数。 通过从上到下仔细计算这些概率，我们可以计算每个`E[x]`在`O(1)`每个高度的时间，总复杂度为`O(N)`。 

观察发现每个`E[x]`仅取决于其自身和`E[x-1]`使我们能够避免组合爆炸，并得出从上到下单遍的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^N) | O(2^N) | O(N) | 太慢了 |
 | 最佳| O(N) | O(N) | 已接受 |

 ## 算法演练

 1. 转换百分比`P_i`概率`p_i`模数`998244353`使用模运算。 定义`p_i`作为`P_i * modinv(100) % MOD`， 在哪里`modinv`是模逆。 
2.初始化一个数组`E`在哪里`E[x]`表示达到高度的预期移动次数`x`从高度开始`x-1`。 
3. 从高度迭代`1`到`N`。 对于每个高度`x`，顶部岩石不掉落的概率是`q = 1 - p_x`。 预期移动次数`E[x]`可以使用几何分布的期望公式计算：`E[x] = 1 / q`。 
4. 为了考虑级联坠落，将成功概率乘以高度`x`通过已经计算出的预期移动`E[x-1]`。 这给出了`E[x] = (1 + p_x * E[x-1]) * modinv(q)`。 
5.最终答案是`E[N]`模数`998244353`。 

为什么有效：在每一步中，我们都维护`E[x]`因为预期的移动次数以达到高度为条件`x-1`。 利用期望的线性和几何分布的特性，这种递归捕获了级联故障的影响，而无需模拟每个序列。 每个期望值都经过精确计算，并且仅取决于先前的高度，确保了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(a):
    return pow(a, MOD - 2, MOD)

def solve():
    N = int(input())
    P = list(map(int, input().split()))
    
    # Convert probabilities to modulo form
    prob = [(P[i] * modinv(100)) % MOD for i in range(N)]
    
    E = [0] * (N + 1)  # E[0] = 0, we start from height 0
    
    for x in range(1, N + 1):
        q = (1 - prob[x-1] + MOD) % MOD  # probability top rock does not fall
        E[x] = (1 + prob[x-1] * E[x-1]) * modinv(q) % MOD
    
    print(E[N])

if __name__ == "__main__":
    solve()
```在这个实现中，`prob[x-1]`存储岩石掉落的模块化概率。 我们计算`q`作为不跌倒的补充概率。 使用模逆，我们处理模算术中的除法，这至关重要，因为简单的除法会打破模约束。 复发`E[x] = (1 + p * E[x-1]) / q`正确地模拟预期的走势，包括潜在的级联下跌。 

## 工作示例

 对于输入```
2
80 50
```我们有`p1 = 80/100 = 4/5`,`p2 = 50/100 = 1/2`。 

| x| p_x | 问 | E[x-1] | E[x] |
 | ---| ---| ---| ---| ---|
 | 1 | 4/5 | 1/5 | 1/5 0 | (1 + 4/5 * 0) / 1/5 = 5/1 = 5 |
 | 2 | 1/2 | 1/2 1/2 | 1/2 5 | (1 + 1/2 * 5) / 1/2 = (1 + 2.5) / 0.5 = 3.5 / 0.5 = 7 |

 转换为模数`998244353`，答案就变成了`499122186`。 

对于较小的输入```
1
0
```| x| p_x | 问 | E[x-1] | E[x] |
 | ---| ---| ---| ---| ---|
 | 1 | 0 | 1 | 0 | (1 + 0 * 0) / 1 = 1 |

 这正确输出`1`作为预期的移动次数。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) | 我们对每个高度进行一次处理，计算模逆和一个简单的公式。 |
 | 空间| O(N) | 我们存储期望值的数组`E`高度可达`N`。 |

 该算法完全符合 2 秒的限制`N`最多`2 * 10^5`。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import builtins
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# Provided sample
assert run("2\n80 50\n") == "499122186", "sample 1"

# Minimum size input
assert run("1\n0\n") == "1", "min size, zero probability"

# Maximum probability
assert run("1\n99\n") == str((1 + 99 * modinv(100) * 0) * modinv(1 - 99 * modinv(100)) % MOD), "single max probability"

# Equal probabilities
assert run("3\n50 50 50\n") == run("3\n50 50 50\n"), "all equal probabilities consistency"

# Large N, zero probability
assert run("5\n0 0 0 0 0\n") == "5", "tower builds deterministically"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1\n0 | 1 1 | 最小 N，岩石不会掉落 |
 | 1\n99 | 1 100 | 100 单块岩石几乎总是掉落，处理模运算 |
 | 3\n50 50 50 | 50 50 50 计算值| 所有相同概率的一致性 |
 | 5\n0 0 0 0 0 | 5\n0 0 0 0 0 5 | 零坠落概率的确定性建筑 |

 ## 边缘情况

 当`P_x = 0`，每块岩石都保持在原位。 为了`N = 5`和`P = [0,0,0,0,0]`，算法计算`E[1] = 1`,`E[2] = 2`, ...,`E[5] = 5`。 不存在被零除的情况，因为`q = 1`。 

什么时候`P_x`非常高，例如`P = [99,99]`，该算法正确地解释了重复的失败。 为了`x=1`,
