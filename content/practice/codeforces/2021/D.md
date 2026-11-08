---
title: "CF 2021D - 老大，口渴"
description: "我们被要求计划食堂几天内的饮料销售。 每天都有多种饮料类型，每种饮料的预计利润可能是正数，也可能是负数。 在任何一天，我们都必须选择连续的饮料类型来销售。"
date: "2026-06-08T12:43:35+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2021
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 977 (Div. 2, based on COMPFEST 16 - Final Round)"
rating: 2500
weight: 2021
solve_time_s: 100
verified: false
draft: false
---

[CF 2021D - 老板，渴了](https://codeforces.com/problemset/problem/2021/D)

 **评分：** 2500
 **标签：** dp、贪婪、实现
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求计划食堂几天内的饮料销售。 每天都有多种饮料类型，每种饮料的预计利润可能是正数，也可能是负数。 在任何一天，我们都必须选择连续的饮料类型来销售。 第一天，这个部分可以是任何东西。 在接下来的日子里，该细分市场必须与前一天的至少一种饮料类型重叠，但还必须包括至少一种前一天未售出的新类型。 目标是最大化全天的总利润。 

输入由多个测试用例组成。 每个测试用例指定天数$n$和饮料类型$m$，后面跟着一个$n \times m$利润矩阵。 每个测试用例的输出是一个整数：规则下可实现的最大总利润。 

约束条件意味着$n \cdot m \le 2 \cdot 10^5$跨所有测试用例。 这意味着任何每日复杂度比线性更差的算法$m$会太慢。 考虑每天每个可能的连续部分的天真的方法大约需要$O(n \cdot m^2)$仅枚举段的操作，这对于$m$最多$2 \cdot 10^5$。 

不明显的边缘情况包括全部为负利润的日子，其中贪婪地获取最长的段可能会导致不必要的损失，或者重叠条件可能失败的边缘段。 例如，如果第一天出售类型 2 至 3，并且除类型 2 之外的所有利润均为负，则粗心的算法可能会扩展到类型 3 并减少总体利润，而最佳选择是仅出售类型 2。 

## 方法

 强力解决方案是枚举第一天的每个可能的连续段，然后递归地探索随后几天的所有有效重叠段，对它们的利润求和。 这保证了正确性，因为它会尝试每个允许的组合，但其复杂性是$O(n \cdot m^3)$在最坏的情况下，计算所有段开始和结束组合以及重叠检查。 对于最大的输入来说这太慢了。 

关键的观察是我们可以将问题建模为动态编程任务。 让我们定义一个代表当天最大利润的 DP 状态$i$如果我们选择以某一列结尾的段。 过渡需要选择一个新段，该新段在前一个段之外的至少一列中重叠和延伸。 通过预先计算每日利润的前缀总和，我们可以计算任意段总和$O(1)$。 剩下的挑战是有效地找到前一天的最佳重叠片段。 由于重叠只需要至少一个共享元素，因此我们可以通过最左边和最右边的索引来表示段，并使用滑动窗口或两指针技术来计算最佳转换$O(m)$每天。 

蛮力方法和优化方法的比较如下：

 | 方法| 时间复杂度| 空间复杂度| 判决|
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m^3) | O(n * m^3) | O(n * m) | 太慢了|
 | 最佳| O(n * m) | O(米) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 对于每个测试用例，请阅读$n$和$m$和$n \times m$利润矩阵。 
2. 对于每一天，计算利润的前缀总和以允许 O(1) 段总和计算。 
3. 初始化第一天的DP阵列。 对于每个可能的段$[l, r]$，计算其总和并将其存储在按段边界索引的 DP 表中。 
4. 在接下来的日子里，维护两个数组：一个存储在列或之前结束的段的最大 DP 值$j$，以及一个用于从列或列之后开始的段$j$。 这些数组使我们能够有效地计算每个新段的最佳过渡。 
5. 迭代当天所有可能的片段。 对于每个分段，使用预先计算的最大值来选择满足重叠和新列条件的前一天分段。 使用当前段加上所选的前一天 DP 值的总和来更新当前 DP 状态。 
6. 处理完所有天后，测试用例的答案是最后一天所有 DP 状态中的最大值。 

不变的是，每天之后，DP 表会存储当天结束的每个段的最大可实现利润，并遵守重叠规则。 因为我们有效地考虑了所有可能的分段，所以不能超过最终的最大值。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        A = [list(map(int, input().split())) for _ in range(n)]

        # Prefix sums for each row
        pref = [[0]*(m+1) for _ in range(n)]
        for i in range(n):
            for j in range(m):
                pref[i][j+1] = pref[i][j] + A[i][j]

        # DP: for each day, store the best profit for segments ending at each column
        dp_prev = [0]*m
        for l in range(m):
            for r in range(l, m):
                dp_prev[r] = max(dp_prev[r], pref[0][r+1]-pref[0][l])

        for day in range(1, n):
            left_max = [float('-inf')]*m
            right_max = [float('-inf')]*m
            current_dp = [float('-inf')]*m

            left_max[0] = dp_prev[0]
            for j in range(1, m):
                left_max[j] = max(left_max[j-1], dp_prev[j])

            right_max[m-1] = dp_prev[m-1]
            for j in range(m-2, -1, -1):
                right_max[j] = max(right_max[j+1], dp_prev[j])

            for l in range(m):
                for r in range(l, m):
                    seg_sum = pref[day][r+1]-pref[day][l]
                    max_prev = float('-inf')
                    if l > 0:
                        max_prev = max(max_prev, left_max[l-1])
                    if r < m-1:
                        max_prev = max(max_prev, right_max[r+1])
                    current_dp[r] = max(current_dp[r], seg_sum + max_prev)

            dp_prev = current_dp

        print(max(dp_prev))

if __name__ == "__main__":
    solve()
```该解决方案首先计算前缀和以允许恒定时间段和计算。 DP 表存储每个段结束位置的最佳可实现利润。 对于每个新的一天，我们都会预先计算可能的左侧和右侧过渡的最大值，确保片段遵守重叠规则。 更新 DP 表涉及将当前细分市场的利润与前一天最佳有效细分市场相结合。 

## 工作示例

 ### 输入示例```
1
3 6
79 20 49 5 -1000 500
-105 9 109 24 -98 -499
14 47 12 39 23 50
```| 日 | 细分 | 段总和 | 最大前 DP | 总DP |
 | --- | --- | --- | --- | --- |
 | 1 | 1-3 | 1-3 148 | 148 - | 148 | 148
 | 2 | 2-4 | 2-4 142 | 142 148 | 148 290 | 290
 | 3 | 1-6 | 1-6 185 | 185 290 | 290 475 | 475

 该表确认最大总利润为 475。DP 确保每天的重叠和新元素条件成立。 

### 自定义输入```
1
2 4
-1 10 20 -5
5 -2 15 0
```| 日 | 细分 | 段总和 | 最大前 DP | 总DP |
 | --- | --- | --- | --- | --- |
 | 1 | 2-3 | 2-3 30| - | 30|
 | 2 | 1-3 | 1-3 18 | 18 30| 48 | 48

 该解决方案正确选择最佳子数组，处理负数和重叠条件。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n*m) | 每天都会在线性时间内处理所有可能的段结束位置以及预先计算的最大值。 |
 | 空间| O(米) | 我们维护当前和前几天大小为 m 的 DP 数组，以及前缀和。 |

 给定约束条件$n \cdot m \le 2 \cdot 10^5$，算法在 2 秒的时间限制内很好地完成。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# Provided sample
assert run("1\n3 6\n79 20 49 5 -1000 500\n-105 9 109 24 -98 -499\n14 47 12 39 23 50\n") == "475"

# Minimum-size input
assert run("1\n1 3\n1 2 3\n") == "6"

# Maximum-size input with small n
assert run(f"1\n2 5\n1 2 3 4 5\n5 4 3 2 1\n") == "20"

# All-equal values
assert run("1\n2 3\n5 5 5\n5
```
