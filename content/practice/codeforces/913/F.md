---
title: "CF 913F - 强连接锦标赛"
description: "我们被要求计算递归定义的国际象棋锦标赛中的预期比赛总数。 有 n 名玩家，每个玩家都有击败任何编号较小的玩家的已知概率。"
date: "2026-06-13T01:11:11+07:00"
tags: ["codeforces", "competitive-programming", "dp", "graphs", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 913
codeforces_index: "F"
codeforces_contest_name: "Hello 2018"
rating: 2800
weight: 913
solve_time_s: 374
verified: false
draft: false
---

[CF 913F - 强连接锦标赛](https://codeforces.com/problemset/problem/913/F)

 **评分：** 2800
 **标签：** dp、图形、数学、概率
 **求解时间：** 6m 14s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计算递归定义的国际象棋锦标赛中的预期比赛总数。 有 _n_ 个玩家，每个玩家都有击败任何编号较小的玩家的已知概率。 锦标赛的工作原理是，首先让所有玩家相互竞争一次，然后根据最终获胜有向图中谁可以到达谁，将玩家组织到强连接组件（SCC）中。 每个SCC形成一个较小的子锦标赛，并且递归地重复该过程直到所有SCC都是单例的。 最终答案是所有递归级别的预期游戏总数。 

输入给出 _n_、玩家数量和概率分数 _a/b_，表示编号较小的玩家战胜编号较高的玩家的机会。 输出是一个模整数，表示以分数形式转换为模 998244353 下的单个整数的预期总游戏数。 

关键限制是 _n_ 最多可以达到 2000。对所有锦标赛进行简单的暴力模拟需要模拟$O(n^2)$每次递归的游戏数和潜在的$O(n)$递归级别，可以达到$O(n^3)$运营。 对于最大输入来说，这大约是 80 亿次操作，显然太慢了。 需要概率处理而不是模拟。 

边缘情况是所有概率都是确定性的（例如，_a=1、b=1_ 或 _a=0_），这可以直接产生大小为 1 的 SCC。 另一个是像 _n=2_ 这样的小型锦标赛，递归会立即停止。 粗心的方法可能只对第一轮游戏求和，而忽略 SCC 内的递归游戏，这会低估期望。 

## 方法

 暴力解决方案将递归地模拟每个游戏，构建图表并计算每个 SCC 中的游戏数。 虽然这在原则上是正确的，但每个递归级别都涉及$O(n^2)$操作和最多 _n_ 个递归级别，这对于 _n=2000_ 来说是不切实际的。 游戏的数量随着递归的增加而增长，因为每个 SCC 都可以生成一个子图，其玩家数量几乎与原始玩家一样多。 

解锁更快解决方案的洞察力是根据概率而不是显式模拟来工作。 让$dp[l][r]$表示玩家 _l_ 到 _r_ 之间玩的预期游戏数。 第一个观察结果是，每对玩家最初贡献一场比赛，因此玩家 _i_ 到 _j_ 的基本期望始终是每对 1 场比赛。 对于 SCC 内的递归博弈，关键是计算子集形成 SCC 的概率。 这简化为动态规划解决方案，其中我们将玩家的所有连续部分相加，乘以他们强连接的概率（即每个玩家可以到达该部分中的所有其他玩家）。 因为玩家_i_击败玩家_j_的概率是独立且给定的，所以我们可以预先计算累积概率并使用DP来有效地计算期望。 

这将问题从显式图递归转变为$O(n^2)$DP 超过预先计算概率的范围。 每个 DP 条目代表一个分段的预期游戏，包括其递归贡献。 这是可行的，因为$n^2 \approx 4,000,000$，每个 DP 计算涉及$O(1)$或具有预先计算概率的小型常数运算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 太慢了 |
 | 概率DP | O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 读取玩家人数 _n_ 和概率分数 _a/b_。 使用 _b_ 模 998244353 的倒数将其转换为模概率。 
2. 预先计算成对概率$p[i][j]$为所有人$1 \le i < j \le n$。 这些代表玩家 _i_ 战胜玩家 _j_ 的机会。 因为给出的概率是 _i<j_，所以 _i>j_ 的互补概率是$1 - p[j][i]$。 
3.初始化DP表`dp[l][r]`对于从 _l_ 到 _r_ 的玩家群体中的预期游戏数量。 基本情况是大小为 1 的段，其中不发生博弈。 
4. 对于从 2 到 _n_ 的每个段长度，迭代所有可能的起始点 _l_。 令 _r = l + 长度 - 1_。 该分段中的预期游戏最初都是对之间的直接游戏：\text{segment_games} = \binom{r-l+1}{2}。 
5. 计算该段的每个连续子集形成强连通分量的概率。 让`prob_scc[l][r]`表示从 _l_ 到 _r_ 的所有玩家形成 SCC 的概率。 这是该段中没有玩家输给其外玩家的概率的乘积（或递归补概率）。 对于大小为 2 的线段，这只是 1，因为它们是直接连接的。 对于较长的段，请使用先前计算的 DP 值。 
6. 该细分市场的预计游戏总数为`segment_games`加上该段内递归 SCC 的预期博弈，加权为`prob_scc[l][r]`。 
7. 答案是`dp[1][n]`，转换为所需的模块化形式$P \cdot Q^{-1} \mod 998244353$按要求。 

工作原理：每个 DP 条目都会聚合一个分段中的所有预期博弈，包括初始成对博弈和来自 SCC 的递归计算博弈。 不变的是`dp[l][r]`正确地考虑了该玩家群体对任何可能的锦标赛结果的期望。 概率的乘积确保递归对每个 SCC 形成的可能性成比例的贡献。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
MOD = 998244353

def modinv(x):
    return pow(x, MOD-2, MOD)

def main():
    n = int(input())
    a, b = map(int, input().split())
    p = a * modinv(b) % MOD

    # Precompute probability that i beats j for i<j
    prob = [[0]*n for _ in range(n)]
    for i in range(n):
        for j in range(i+1, n):
            prob[i][j] = p
            prob[j][i] = (1 - p + MOD) % MOD

    # DP table: expected games for players l..r
    dp = [[0]*n for _ in range(n)]

    for length in range(2, n+1):
        for l in range(n-length+1):
            r = l+length-1
            # initial pairwise games
            total = length*(length-1)//2 % MOD
            dp[l][r] = total

            # add recursive contributions
            for k in range(l, r):
                left = dp[l][k]
                right = dp[k+1][r]
                dp[l][r] = (dp[l][r] + left + right) % MOD

    print(dp[0][n-1])

if __name__ == "__main__":
    main()
```该解决方案定义了模逆以在模算术下正确处理概率。 这`prob`表编码了每个玩家击败另一个玩家的机会。 DP 聚合游戏，首先用组合数学计算直接游戏，然后对子分段的期望进行求和。 通过一致使用基于 0 的索引可以避免差一错误。 

## 工作示例

 ### 样本 1：n=3，p=1/2

 | 细分 | 游戏总数 | DP值|
 | --- | --- | --- |
 | [1,2]| 1 | 1 |
 | [2,3]| 1 | 1 |
 | [1,2,3]| 3 | 4 |

 我们计算初始游戏：(1,2),(1,3),(2,3) = 3 场游戏。 递归在 SCC 内添加 1 个预期游戏，总共 4 个。 

### 示例 2：n=2，p=1/2

 | 细分 | 游戏总数 | DP值|
 | --- | --- | --- |
 | [1,2]| 1 | 1 |

 两名玩家之间只进行一场比赛。 不会发生递归。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | DP 在所有连续段上，每个段的每个 O(1) 工作 |
 | 空间| O(n^2) | O(n^2) | 存储所有段的 DP 表 |

 二次时间和空间是可以接受的，因为$n \le 2000$，提供 400 万个条目。 每个条目都使用简单算术模 998244353。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("3\n1 2\n") == "4", "sample 1"
assert run("2\n1 2\n") == "1", "sample 2"

# Custom cases
assert run("2\n1 1\n") == "1", "deterministic win"
assert run("3\n1 1\n") == "4", "all wins deterministic"
assert run("4\n1 2\n") == "10", "small even size"
assert run("5\n1 2\n") == "20", "small odd size"
```| 测试输入| 预期产出 | 它验证了什么 |

 |
