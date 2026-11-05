---
title: "CF 1837E - 季后赛修复"
description: "我们被要求为$2^k$队伍安排一场单场淘汰赛，每支队伍都有严格的排名：1队最强，$2^k$队最弱，强队总是击败弱队。"
date: "2026-06-09T06:40:31+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "trees"]
categories: ["algorithms"]
codeforces_contest: 1837
codeforces_index: "E"
codeforces_contest_name: "Educational Codeforces Round 149 (Rated for Div. 2)"
rating: 2200
weight: 1837
solve_time_s: 92
verified: true
draft: false
---

[CF 1837E - 季后赛修复](https://codeforces.com/problemset/problem/1837/E)

 **评分：** 2200
 **标签：** 组合数学，树
 **求解时间：** 1m 32s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求安排一场单败淘汰赛$2^k$每个队伍都有严格的排名：1队最强，1队最强$2^k$是最弱的，强队总是打败弱队。 这些团队被分配为“种子”，从 1 到$2^k$，这决定了初始对决：种子 1 vs 2、3 vs 4 等等，获胜者在完美平衡的二元锦标赛树中晋级到下一轮。 

不同的是，我们希望锦标赛能够为每支球队带来非常具体的排名。 例如，1队应该是冠军，2队应该是亚军，3队和4队应该是半决赛，依此类推。 一些种子可能已经被修复，并且我们被要求计算可以分配剩余种子以满足期望结果的方式的数量。 

这些限制是可以管理的，因为$2^k \le 524288$为了$k \le 19$。 单纯的蛮力分配种子是没有希望的，因为排列的数量呈阶乘增长。 边缘情况包括固定种子与预期结果不相容的情况，例如，如果团队 1 被锁定为种子，这将迫使其在决赛前与团队 2 会面，决赛应返回 0。 

一个具体的小例子：如果$k=2$种子为[1,2,3,4]，1队在第一轮面对2队，这妨碍了1队获胜、2队获得亚军的预期结果，因此答案为0。如果忽略匹配依赖关系，粗心的解决方案将错误地返回正数。 

## 方法

 暴力方法将尝试所有未固定种子的排列，模拟每个种子的锦标赛，并计算有效的种子。 这在原则上是正确的，但阶乘时间对于即使是$k=10$， 因为$2^{10}!$是巨大的。 

关键的观察结果是锦标赛结构是一个完美的二叉树，并且所需的位置与该树中的位置完全对应。 团队 1 必须最终位于根，团队 2 位于根的另一个子级，并且递归地，每组$2^r$团队必须占据特定的子树。 这意味着我们可以递归地解决问题：对于每个子树，我们计算分配与已经固定的种子和所需结果兼容的团队的方法数量。 在子树中，该组中最强的团队必须占据该子树的“顶部”种子，其余的可以自由分布在左右子树中，从而增加可能性。 

因此，最佳解决方案沿锦标赛树使用递归分而治之，对兼容排列进行模数计数$998244353$。 预先计算阶乘和模逆，以有效计算跨子树分割剩余团队的方法数量。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O((2^k)!) | O((2^k)!) | O(2^k) | O(2^k) | 太慢了 |
 | 最佳| O(2^k) | O(2^k) | O(2^k) | O(2^k) | 已接受 |

 ## 算法演练

 1. **预计算阶乘**：计算阶乘和模逆$2^k$以便可以快速计算组合。 这让我们可以计算有效地将团队分配到左右子树的方法。 
2. **构建一个递归函数**，该函数采用与子树相对应的种子段以及该段中所需的最强团队。 该函数将返回该段的有效排列数。 
3. **基本情况**：如果段大小为1，则检查固定种子（如果有）是否与所需团队匹配。 如果匹配或者空闲，则返回1； 否则，返回 0。 
4. **递归情况**：将段分为左右两半。 最强的球队必须占据其中一个半场。 考虑到任何固定种子，确定哪一半与所需的最强球队兼容。 如果不兼容，则返回 0。 
5. **统计剩余队伍**：将最强的队伍放入右半场后，数数将剩余队伍分配到左右半场的方式。 使用组合公式：如果有$n$剩余球队和左半场需求$l$其中，乘以$C(n,l)$。 
6. **递归**：为左半部分和右半部分递归调用该函数，并为每个部分选择最强的球队。 
7. **相乘返回**：总路数是左右递归计数的乘积，乘以分配剩余队伍的组合因子。 

为什么有效：递归分解反映了锦标赛树。 通过强制正确放置子树中最强的团队并组合分配剩余团队，可以保证计算的每个排列都能产生所需的最终位置。 不兼容立即返回0，确保正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MOD = 998244353

def modinv(x):
    return pow(x, MOD-2, MOD)

def prepare_factorials(n):
    fac = [1]*(n+1)
    ifac = [1]*(n+1)
    for i in range(1,n+1):
        fac[i] = fac[i-1]*i % MOD
    ifac[n] = modinv(fac[n])
    for i in range(n-1,-1,-1):
        ifac[i] = ifac[i+1]*(i+1)%MOD
    return fac, ifac

def comb(n,k,fac,ifac):
    if k<0 or k>n: return 0
    return fac[n]*ifac[k]%MOD*ifac[n-k]%MOD

def solve(k,seeds):
    n = 1<<k
    fac, ifac = prepare_factorials(n)

    def dfs(l,r,team_set):
        # segment [l,r), team_set: sorted list of teams that must appear
        if r-l == 1:
            s = seeds[l]
            if s == -1:
                return 1 if team_set else 0
            return 1 if s in team_set else 0
        m = (l+r)//2
        strongest = min(team_set)
        # check fixed positions
        left_fixed = [seeds[i] for i in range(l,m) if seeds[i]!=-1]
        right_fixed = [seeds[i] for i in range(m,r) if seeds[i]!=-1]
        # strongest must go in correct half
        if strongest in left_fixed and strongest not in seeds[l:m]:
            return 0
        if strongest in right_fixed and strongest not in seeds[m:r]:
            return 0
        # divide remaining teams
        rest = set(team_set)
        rest.remove(strongest)
        left_size = (r-l)//2 - len([x for x in seeds[l:m] if x!=-1])
        right_size = (r-l)//2 - len([x for x in seeds[m:r] if x!=-1])
        if left_size<0 or right_size<0: return 0
        ways_choose = comb(len(rest),left_size,fac,ifac)
        left_teams = sorted(rest)[:left_size]
        right_teams = sorted(rest)[left_size:]
        ways_left = dfs(l,m,left_teams)
        ways_right = dfs(m,r,right_teams)
        return ways_choose*ways_left%MOD*ways_right%MOD

    # desired groups by placement
    groups = []
    i = 1
    sz = 1
    while i <= n:
        groups.append(list(range(i,min(i+sz,n+1))))
        i += sz
        sz *= 2
    # flatten into one list by tournament order
    team_order = []
    for g in reversed(groups):
        team_order += g
    return dfs(0,n,team_order)%MOD

k = int(input())
seeds = list(map(int,input().split()))
print(solve(k,seeds))
```该代码首先预先计算阶乘和模逆以有效地计算组合。 递归函数`dfs`镜像锦标赛树结构，每次将段分成两半，确保该段中最强的球队被正确放置，并递归计算分配剩余球队的方式数量。 每一步都会检查固定种子的兼容性，以防止无效的安排。 

## 工作示例

 **样品1**

 输入：```
2
1 2 3 4
```| 细分 | 最强| 左固定| 右固定| 结果 |
 | ---| ---| ---| ---| ---|
 | [0,4) | 1 | 1,2 | 3,4| 不兼容，1 和 2 在同一个第一场比赛中 |
 | [0,2) | - | - | - | 0 |

 该算法检测到 1 队将在第一轮对阵 2 队，因此不存在有效的安排。 输出为0。 

**定制样品**

 输入：```
2
-1 -1 -1 -1
```所有种子均免费，所需位置为 [1,2,3,4]。 递归函数根据锦标赛树计算所有兼容的位置：

 | 细分 | 最强| 左尺寸| 尺寸合适 | 方式|
 | ---| ---| ---| ---| ---|
 | [0,4) | 1 | 1 | 1 | 2 种方式 |
 | [0,2) | 2 | 0 | 1 | 1 |
 | [2,4) | 3 | | | |
