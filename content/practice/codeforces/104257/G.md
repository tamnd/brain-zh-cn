---
title: "CF 104257G - Go Go GPA"
description: "我们获得了一系列必须按固定顺序学习的课程。 每门课程都有一个估计分数和一个学分值。 学生将这些课程精确地划分为 $K$ 个连续学期，并且每个学期必须至少包含一门课程。"
date: "2026-07-01T21:46:54+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 104257
codeforces_index: "G"
codeforces_contest_name: "2021 NTUIM Programming Design And Optimization (PDAO 2021)"
rating: 0
weight: 104257
solve_time_s: 68
verified: true
draft: false
---

[CF 104257G - Go Go GPA](https://codeforces.com/problemset/problem/104257/G)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 8s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们获得了一系列必须按固定顺序学习的课程。 每门课程都有一个估计分数和一个学分值。 学生将这些课程准确地分为$K$连续学期，每个学期必须至少包含一门课程。 

一个学期内，“学业成绩”分三层计算。 首先，我们对该学期的原始课程成绩进行学分加权平均分。 这会产生一个实数$[0,100]$。 该值会四舍五入到最接近的整数，然后使用固定的 GPA 分数表转换为 GPA 值。 最后，总结果就是简单的算术平均值$K$学期 GPA，不按课程或学分数量进行加权。 

因此，任务不是最大化原始分数，而是选择将序列切入何处$K$连续的块，以便得到的离散化 GPA 的平均值尽可能大。 

限制很小：最多 100 门课程和最多 100 个学期。 这立即排除了分区上的任何指数枚举。 即使二次或三次动态规划也是可以接受的，因为大致$10^6$到$10^7$Python 中的操作是安全的。 

一个微妙的失败案例来自舍入步骤。 由于学期 GPA 取决于四舍五入加权平均数，因此平均数几乎相同的两个分段在四舍五入后可能会产生不同的 GPA。 

例如，如果一个学期有加权平均数$89.4$，它变成89，但是$89.5$变成 90。这两个值映射到不同的 GPA 等级，因此尝试“平滑”平均值或贪婪地扩展段的天真的方法可能会失败。 

另一个边缘情况是分段决策是全局耦合的。 尽早采取稍差的部分可以让后面的部分在四舍五入后跨越 GPA 边界，从而增加总数。 局部贪婪决策并不可靠。 

## 方法

 暴力方法会尝试一切方法来分裂$N$课程进入$K$非空连续段。 此类分区的数量为$\binom{N-1}{K-1}$，即使对于$N=100$。 对于每个分区，计算所有学期的 GPA 需要扫描各段并执行加权平均值，从而提供额外的$O(N)$因素。 这变得完全不可行。 

问题的结构是，一个学期的价值仅取决于该部分本身，而不取决于如何选择之前或未来的学期。 一旦我们确定最后一个学期是课程$j+1$到$i$，剩下的问题就归结为第一个问题$j$课程与$K-1$学期。 这是基于前缀的经典分区 DP。 

关键的观察是，我们可以使用总学分和总加权分数的前缀和来预先计算恒定时间内任何分段的加权平均值。 这使得可以有效地评估每个候选最后片段。 

DP状态成为“使用第一个可能的最佳总GPA”$i$课程分为$k$学期”，过渡会尝试所有可能的先前剪切位置。

 | 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力分区|$O(\binom{N}{K} \cdot N)$|$O(N)$| 太慢了|
 | 间隔 DP |$O(N^2 K)$|$O(NK)$| 已接受 |

 ## 算法演练

 我们预处理前缀和，以便任何段$[l, r]$可以快速计算其加权平均值。 

我们还根据整数分数预先计算查找$0$到$100$使用给定的映射表将其转化为 GPA 值，因此一旦我们舍入学期平均分，我们就可以立即获得其 GPA。 

### 步骤

 1. 计算学分和加权分数的前缀数组。 

对于每个$i$，存储总学分最多$i$和总计$a_i \cdot b_i$。 这允许在恒定时间内计算任何段总和。 
2. 定义一个函数来计算一个段的学期 GPA$[l, r]$。 

我们计算加权平均值$x = \frac{\sum a_i b_i}{\sum b_i}$，将其四舍五入到最接近的整数，然后将其映射到 GPA。 舍入步骤至关重要，因为它会改变离散化 GPA 结果。 
3.建立一个DP表，其中$dp[i][k]$是使用第一个可实现的最大总 GPA$i$课程分为$k$学期。 
4. 初始化$dp[0][0] = 0$，意味着没有课程和学期的 GPA 为零。 
5. 对于每个$i$从$1$到$N$，以及每个$k$从$1$到$K$，尝试所有可能的先前切点$j < i$。 

最后一个学期是$[j+1, i]$，所以我们更新：$$dp[i][k] = \max(dp[i][k], dp[j][k-1] + GPA(j+1, i))$$6.答案是$dp[N][K] / K$，因为最终 GPA 是学期的平均值。 

### 为什么它有效

 每个有效的调度对应于一个唯一递增的切割点序列，将前缀划分为$K$段。 DP 枚举每个状态的最后一次切割，确保每个有效分区都被恰好考虑一次。 因为每个状态都存储该前缀和学期数的最佳可实现值，并且转换仅取决于独立的前缀状态加上单个段值，所以最优子结构成立。 舍入和 GPA 映射完全包含在每个细分评估中，因此不会丢失跨细分依赖性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

# GPA mapping based on rounded score
def score_to_gpa(x):
    if 90 <= x <= 100: return 4.3
    if 85 <= x <= 89: return 4.0
    if 80 <= x <= 84: return 3.7
    if 77 <= x <= 79: return 3.3
    if 73 <= x <= 76: return 3.0
    if 70 <= x <= 72: return 2.7
    if 67 <= x <= 69: return 2.3
    if 63 <= x <= 66: return 2.0
    if 60 <= x <= 62: return 1.7
    return 0.0

N = int(input())
a = list(map(int, input().split()))
b = list(map(int, input().split()))
K = int(input())

# prefix sums
pref_w = [0] * (N + 1)
pref_c = [0] * (N + 1)

for i in range(1, N + 1):
    pref_w[i] = pref_w[i - 1] + a[i - 1] * b[i - 1]
    pref_c[i] = pref_c[i - 1] + b[i - 1]

def get_gpa(l, r):
    total_w = pref_w[r] - pref_w[l - 1]
    total_c = pref_c[r] - pref_c[l - 1]
    avg = total_w / total_c
    x = int(avg + 0.5)
    return score_to_gpa(x)

dp = [[-1e9] * (K + 1) for _ in range(N + 1)]
dp[0][0] = 0.0

for i in range(1, N + 1):
    for k in range(1, min(K, i) + 1):
        best = -1e9
        for j in range(k - 1, i):
            if dp[j][k - 1] < -1e8:
                continue
            best = max(best, dp[j][k - 1] + get_gpa(j + 1, i))
        dp[i][k] = best

ans = dp[N][K] / K
print(f"{ans:.7f}")
```前缀数组使每个段的评估时间恒定。 DP 确保每个前缀和学期计数计算一次，并且内部循环选择最佳的最后一个剪切。 约束条件$j \ge k-1$确保有足够的课程可供前一学期至少开设一门课程。 

一个常见的陷阱是忘记最终答案是学期的平均值，而不是总和，因此我们除以$K$只有在最后。 

## 工作示例

 ### 示例 1

 输入：```
3
70 80 75
3 1 4
2
```我们跟踪前缀的 DP 状态。 

| 我| k | 选择拆分| 段 GPA | dp[i][k] | dp[i][k] |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | [1] | 3.0 | 3.0 |
 | 2 | 1 | [1,2]| 3.0 | 3.0 |
 | 2 | 2 | [1] + [2] | 3.0+3.0| 6.0 |
 | 3 | 2 | [1,2] + [3] | 3.0+3.0| 6.0 |

 最终答案是$6.0 / 2 = 3.0$。 

这表明，即使存在不同的分割，由于舍入，两个最佳分割都会崩溃到相同的 GPA。 

### 示例 2

 输入：```
6
30 95 65 75 55 80
1 1 1 1 1 1
1
```这里$K=1$，所以我们在一学期内完成所有内容。 

加权平均值为：$$(30+95+65+75+55+80)/6 = 66.67 \rightarrow 67$$67对应GPA 2.3。 

这证实了 DP 正确处理了不允许分裂的退化情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(N^2 K)$| 每个状态都会尝试所有先前的剪切位置|
 | 空间|$O(NK)$| 前缀和学期的 DP 表 |

 和$N \le 100$，最坏的情况$10^6$Python 中的转换非常快。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    import sys
    backup = sys.stdin
    sys.stdin = io.StringIO(inp)
    from math import isclose

    # re-run solution
    input = sys.stdin.readline

    def score_to_gpa(x):
        if 90 <= x <= 100: return 4.3
        if 85 <= x <= 89: return 4.0
        if 80 <= x <= 84: return 3.7
        if 77 <= x <= 79: return 3.3
        if 73 <= x <= 76: return 3.0
        if 70 <= x <= 72: return 2.7
        if 67 <= x <= 69: return 2.3
        if 63 <= x <= 66: return 2.0
        if 60 <= x <= 62: return 1.7
        return 0.0

    N = int(input())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))
    K = int(input())

    pref_w = [0] * (N + 1)
    pref_c = [0] * (N + 1)

    for i in range(1, N + 1):
        pref_w[i] = pref_w[i - 1] + a[i - 1] * b[i - 1]
        pref_c[i] = pref_c[i - 1] + b[i - 1]

    def get_gpa(l, r):
        total_w = pref_w[r] - pref_w[l - 1]
        total_c = pref_c[r] - pref_c[l - 1]
        avg = total_w / total_c
        x = int(avg + 0.5)
        return score_to_gpa(x)

    dp = [[-1e9] * (K + 1) for _ in range(N + 1)]
    dp[0][0] = 0.0

    for i in range(1, N + 1):
        for k in range(1, min(K, i) + 1):
            best = -1e9
            for j in range(k - 1, i):
                if dp[j][k - 1] < -1e8:
                    continue
                best = max(best, dp[j][k - 1] + get_gpa(j + 1, i))
            dp[i][k] = best

    ans = dp[N][K] / K
    sys.stdin = backup
    return f"{ans:.7f}"

# provided sample-like checks
assert run("""3
70 80 75
3 1 4
2
""") == "3.0000000"

assert run("""6
30 95 65 75 55 80
1 1 1 1 1 1
1
""") == "2.3000000"

# custom cases
assert run("""1
100
5
1
""") == "4.3000000", "single course"

assert run("""2
50 100
1 1
2
""") == "2.1500000", "split into extremes"

assert run("""4
90 90 90 90
2 2 2 2
2
""") == "4.3000000", "uniform scores"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 课程 | 4.3 | 最小 DP 边界 |
 | 混合极端| 2.15 | 2.15 舍入+分割效果|
 | 统一高分| 4.3 | 跨分区的稳定性|

 ## 边缘情况

 一个重要的边缘情况是所有课程都被迫进入一个学期，即$K = 1$。 该算法仅正确评估该段$[1, N]$，计算其加权平均值，对其进行舍入，并将其映射到 GPA，而不尝试无效的分割。 

另一种情况是每个学期必须包含一门课程，即$K = N$。 DP 限制转换，以便每个段都是一个元素，这意味着每个课程在舍入后独立贡献。 这正确地模拟了任何学期都不能合并课程的约束。 

当加权平均值恰好位于 0.5 边界上时，会出现更微妙的情况。 例如，平均分 89.5 变为 90，并跳至更高的 GPA 等级。 由于该算法在映射之前执行舍入，因此每个段的评估与问题定义一致，确保正确处理此类边界情况，即使它们可以翻转最佳分区结构。
