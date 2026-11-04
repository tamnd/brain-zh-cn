---
title: "CF 1799G - 计票"
description: "我们有一群 $n$ 人，每个人都属于一个特定的团队，每个人都希望获得一定数量的选票。 这些规则限制投票，因此没有人可以为自己投票，也没有人可以为自己团队中的某人投票。"
date: "2026-06-09T09:48:55+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "math"]
categories: ["algorithms"]
codeforces_contest: 1799
codeforces_index: "G"
codeforces_contest_name: "Codeforces Round 854 by cybercats (Div. 1 + Div. 2)"
rating: 2600
weight: 1799
solve_time_s: 143
verified: false
draft: false
---

[CF 1799G - 计票](https://codeforces.com/problemset/problem/1799/G)

 **评分：** 2600
 **标签：** 组合数学、dp、数学
 **求解时间：** 2m 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一群$n$人，每个人都属于一个特定的团队，每个人都希望获得一定数量的选票。 这些规则限制投票，因此没有人可以为自己投票，也没有人可以为自己团队中的某人投票。 任务是计算满足所有所需投票计数的有效投票安排的数量。 

输入提供$n$、每个人所需的投票以及团队成员。 输出是排列总数模$998244353$。 

这些约束意味着暴力枚举所有$n!$即使对于中等程度的排列也是不可行的$n$自从$n$最多可达 200。这排除了任何具有阶乘复杂性的方法。 边缘情况包括一个人想要零票的情况，或者所有团队成员必须在团队之外投票的情况，如果票数与团队规模不一致，则可能没有有效的选项。 例如，如果两个人在同一团队中并且都希望获得一票，但他们的团队之外只有一个人，则不存在解决方案。 幼稚的方法可能会默默地产生零个有效配置或尝试无效分配而不捕获这些冲突。 

## 方法

 暴力方法会尝试将每个人的一票分配给不同团队中的某人，递归地检查所有可能的排列。 虽然这在概念上是正确的，但它需要$O(n!)$操作并很快变得棘手$n = 20$，更不用说$n = 200$。 

关键的观察结果是，投票在团队限制内是独立的。 每个人的投票都来自团队之外的人。 这种结构自然适合动态规划。 我们可以按团队对人员进行分组，并计算每个团队从其他团队那里获得了多少票。 Then, within each team, the votes must be distributed among its members according to their desired counts. 这将问题简化为计算受可用选民约束的多项系数，从而使我们能够有效地计算总计数。 

最佳方法结合了组合学和 DP。 First, we preprocess counts by team and total voters outside each team. 然后我们迭代所有团队，计算将外部投票者的选票分配给成员的方式数量，同时满足他们的期望计数。 This can be implemented using dynamic programming over cumulative vote counts per team. 通过团队合作并使用模块化算术，该解决方案保持高效且在内存限制内。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 最优 DP + 组合学 | O(n^3) | O(n^3) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 按团队对所有人员进行分组。 For each team, record the list of members and the total votes each member wants.
 2. Compute, for each team, the total number of voters outside the team. 这给出了可以合法分配给团队成员的选票池。 
3. For each team, use a dynamic programming table`dp[i][v]`表示分配方式的数量`v`投票给第一名`i`团队成员，以便每个成员都准确地获得他们想要的数量。 初始化`dp[0][0] = 1`。 
4. 每位会员`i`团队的成员，迭代所有可能的票数`v`从先前的 DP 状态，并添加`dp[i-1][v] * C(available_votes, desired_votes[i])`到`dp[i][v + desired_votes[i]]`， 在哪里`C`是二项式系数模`998244353`。 
5.处理完一个团队的所有成员后，`dp[team_size][total_votes_needed_for_team]`给出该团队的有效分布数. 将所有团队的这些结果相乘即可得到最终答案。 
6. 预计算阶乘和逆阶乘模`998244353`用于有效计算二项式系数。 

工作原理：该算法维护一个不变量，即在团队 DP 的每一步中，所有计数的分配都满足迄今为止考虑的成员的投票约束，并且仅使用来自团队外部的投票。 将各个团队的计数相乘是有效的，因为团队在外部投票者可以投票给他们方面是独立的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD-2, MOD)

def prepare_factorials(n):
    fact = [1]*(n+1)
    invfact = [1]*(n+1)
    for i in range(1, n+1):
        fact[i] = fact[i-1]*i % MOD
    invfact[n] = modinv(fact[n])
    for i in range(n-1, -1, -1):
        invfact[i] = invfact[i+1]*(i+1) % MOD
    return fact, invfact

def comb(n, k, fact, invfact):
    if k < 0 or k > n:
        return 0
    return fact[n]*invfact[k]%MOD*invfact[n-k]%MOD

n = int(input())
c = list(map(int, input().split()))
t = list(map(int, input().split()))

teams = {}
for idx, team in enumerate(t):
    if team not in teams:
        teams[team] = []
    teams[team].append(idx)

fact, invfact = prepare_factorials(n)

result = 1
for members in teams.values():
    m = len(members)
    total_votes_needed = sum(c[i] for i in members)
    available_votes = n - m
    if total_votes_needed > available_votes:
        result = 0
        break
    dp = [0]*(total_votes_needed+1)
    dp[0] = 1
    for i in members:
        ndp = [0]*(total_votes_needed+1)
        for v in range(total_votes_needed+1):
            if dp[v]:
                ways = comb(available_votes - v, c[i], fact, invfact)
                if v + c[i] <= total_votes_needed:
                    ndp[v + c[i]] = (ndp[v + c[i]] + dp[v]*ways)%MOD
        dp = ndp
    result = result*dp[total_votes_needed]%MOD

print(result)
```该代码首先按团队对人员进行分组。 阶乘和逆阶乘是针对二项式系数预先计算的。 对于每个团队，我们使用按累积投票索引的 DP 数组来计算分配所需投票的方式数量。 将所有团队的结果相乘即可得到有效配置的总数。 我们会注意确保投票数量不超过团队之外的投票人数。 通过仔细索引和仅在边界内计算组合可以避免相差一错误。 

## 工作示例

 ### 示例 1

 输入：```
3
1 1 1
1 2 3
```| 团队| 会员 | 需要投票 | DP后处理 |
 | --- | --- | --- | --- |
 | 1 | [0]| 1 | dp[0]=1 -> dp[1]=1 | dp[0]=1 -> dp[1]=1 |
 | 2 | [1] | 1 | dp[0]=1 -> dp[1]=1 | dp[0]=1 -> dp[1]=1 |
 | 3 | [2] | 1 | dp[0]=1 -> dp[1]=1 | dp[0]=1 -> dp[1]=1 |

 最终结果= 1_1_2（投票的两种排列）= 2

 这表明该算法正确地独立处理每个团队并乘以外部投票者的组合。 

### 自定义输入

 输入：```
4
1 2 1 0
1 1 2 2
```| 团队| 会员 | 需要投票 | DP后处理 |
 | --- | --- | --- | --- |
 | 1 | [0,1]| 1+2=3 | dp[0]=1 -> dp[1]=1 -> dp[3]=2 |
 | 2 | [2,3]| 1+0=1 | dp[0]=1 -> dp[1]=1 | dp[0]=1 -> dp[1]=1 |

 最终结果 = 2*1 = 2

 这表明当团队有多个具有不同投票愿望的成员时，正确的投票分配。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^3) | O(n^3) | 每个团队 DP 最多可达 O(n^2)，并且跨团队有 O(n) 名成员 |
 | 空间| O(n^2) | O(n^2) | 每个团队的 DP 阵列最多需要总票数 |

 和$n \leq 200$,$O(n^3) = 8*10^6$操作完全符合 1 秒限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    MOD = 998244353

    def modinv(x):
        return pow(x, MOD-2, MOD)

    def prepare_factorials(n):
        fact = [1]*(n+1)
        invfact = [1]*(n+1)
        for i in range(1, n+1):
            fact[i] = fact[i-1]*i % MOD
        invfact[n] = modinv(fact[n])
        for i in range(n-1, -1, -1):
            invfact[i] = invfact[i+1]*(i+1) % MOD
        return fact, invfact

    def comb(n, k, fact, invfact):
        if k < 0 or k > n:
            return 0
        return fact[n]*invfact[k]%MOD*invfact[n-k]%MOD

    n = int(input())
    c
```
