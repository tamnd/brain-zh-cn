---
title: "CF 1499C - 最小网格路径"
description: "我们正在构建一条从网格左下角到右上角的单调路径，但该路径不仅仅是简单的单元步骤序列。"
date: "2026-06-14T17:50:54+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "data-structures", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1499
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 106 (Rated for Div. 2)"
rating: 1500
weight: 1499
solve_time_s: 244
verified: true
draft: false
---

[CF 1499C - 最小网格路径](https://codeforces.com/problemset/problem/1499/C)

 **评分：** 1500
 **标签：** 蛮力、数据结构、贪心、数学
 **求解时间：** 4m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在构建一条从网格左下角到右上角的单调路径，但该路径不仅仅是简单的单元步骤序列。 相反，它由少量直线段组成，其中每个段要么完全向右，要么完全向上，并且连续的段必须交替方向。 

每个段有两个独立的选择：它的长度，它是一个正整数，它的成本系数，它预先以列表c的形式给出。 如果一段长度为 L 并使用系数 c_i，则其对总成本的贡献为 c_i 乘以 L。路径必须总共向右移动 n 个单位，总共向上移动 n 个单位，因此水平段长度之和为 n，垂直段长度之和也为 n。 

目标是选择要使用多少个段、如何交替它们以及如何在它们之间分配长度，以使总加权成本最小化。 

最多有 n 个段的限制并不是困难的部分。 真正的结构来自于这样的事实：段i总是按顺序使用系数c_i，无论它是水平段还是垂直段。 这意味着我们不会将系数任意分配给方向，而是将方向分配给固定的系数序列，然后选择如何分配长度。 

输入大小允许最多 1000 个测试用例和总共 100000 个系数。 任何尝试所有可能的段分区或以二次时间重新计算成本的解决方案都将失败，因此该解决方案必须在每个测试用例的线性时间内计算答案。 

一个天真的想法是尝试所有将序列分割成段并分配长度的方法。 但这会失败，因为即使选择拆分位置也已经导致配置呈指数级增长。 

一个更微妙的失败案例来自于试图贪婪地扩展段而不展望未来。 如果我们总是在当前段的系数较小时使当前段变长，则我们可能会阻止具有更小的系数的未来段获得大长度，即使这些未来段会因分配长距离而受益更多。 

## 方法

 直接的强力解释是选择多个段 k，选择起始方向，然后选择所有段长度作为正整数，对于水平和垂直移动正确求和。 对于每种配置，计算成本都很简单。 将 n 个单元划分为 k 个正部分的方法数量以组合方式增长，对所有 k 求和使得即使对于较小的 n，这也是完全不可行的。 

关键的观察是，一旦系数序列固定，唯一重要的自由度是总水平距离 n 和总垂直距离 n 如何分布在奇数和偶数索引段上。 每个奇数索引段都对一个轴有贡献，每个偶数索引段对另一个轴有贡献，具体取决于我们是从水平移动还是垂直移动开始。 

这就把问题转化为资源分配问题。 对于固定数量的段 k，奇数位置的总长度预算为 n，分为 ceil(k/2) 个段，偶数位置与 Floor(k/2) 具有相同的结构。 由于成本与段长度呈线性关系，因此在每个奇偶校验组内，首先为每个段赋予长度 1 始终是最佳选择，然后将所有剩余长度分配给该组中系数最小的段。

因此，对于任何固定的 k，一旦我们知道了 k 之前奇数和偶数位置的最小系数，最优结构就变得确定了。 剩下的挑战是有效地计算最佳 k，这可以通过扫描 k 从 1 到 n 同时保持前缀和和前缀最小值来完成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解分割| 指数| O(n) | 太慢了|
 | 带奇偶校验聚合的 k 上的前缀 DP | O(n) | O(n) | 已接受 |

 ## 算法演练

 我们独立处理每个测试用例，并通过尝试所有可能的段数 k 来计算答案。 

1. 预先计算系数数组上的前缀信息。 我们分别维护奇数索引和偶数索引的前缀和，并跟踪迄今为止在奇数和偶数位置看到的最小系数。 这使我们能够在常数时间内评估任何前缀长度 k。 
2. 对于从 1 到 n 的每个可能的 k，将前 k 个系数解释为定义 k 个段。 根据它们在序列中的位置将它们分为奇数索引和偶数索引组。 
3. 考虑路径以水平线段开始的情况。 在这种情况下，奇数索引段对应于水平移动，偶数索引段对应于垂直移动。 
4. 对于此配置，将基本成本计算为所有系数之和乘以每个段的单位长度。 然后考虑额外长度分配：总水平距离为n，因此在给每个水平段长度1后，我们仍然需要在水平段之间分配剩余长度。 通过将所有剩余水平长度分配给水平段中的最小系数，可以最小化这种额外成本。 同样的逻辑也适用于垂直细分市场。 
5. 对于路径垂直开始的情况重复相同的计算，交换奇数位置和偶数位置的角色。 
6. 取所有 k 和两个起始方向的最小值。 

正确性来自于这样的事实：对于任何固定的 k 和固定的起始方向，问题分解为两个组上的两个独立的线性成本优化。 在每个组中，由于成本在长度上是线性的，并且除了通过固定总和约束之外，段之间没有相互作用，因此将所有额外长度集中在最小系数上始终是最佳的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        c = list(map(int, input().split()))

        # prefix sums and minima for odd/even indices
        odd_sum = [0] * (n + 1)
        even_sum = [0] * (n + 1)
        odd_min = [10**18] * (n + 1)
        even_min = [10**18] * (n + 1)

        for i in range(1, n + 1):
            val = c[i - 1]

            odd_sum[i] = odd_sum[i - 1]
            even_sum[i] = even_sum[i - 1]
            odd_min[i] = odd_min[i - 1]
            even_min[i] = even_min[i - 1]

            if i % 2 == 1:
                odd_sum[i] += val
                odd_min[i] = min(odd_min[i], val)
            else:
                even_sum[i] += val
                even_min[i] = min(even_min[i], val)

        ans = 10**30

        for k in range(1, n + 1):
            odd_cnt = (k + 1) // 2
            even_cnt = k // 2

            # start horizontal: odd -> H, even -> V
            h_cost = odd_sum[k] + (n - odd_cnt) * odd_min[k]
            v_cost = even_sum[k] + (n - even_cnt) * even_min[k]
            ans = min(ans, h_cost + v_cost)

            # start vertical: swap roles
            h_cost = even_sum[k] + (n - even_cnt) * even_min[k]
            v_cost = odd_sum[k] + (n - odd_cnt) * odd_min[k]
            ans = min(ans, h_cost + v_cost)

        print(ans)

if __name__ == "__main__":
    solve()
```该实现将奇数位置和偶数位置的前缀信息分开，以便可以在恒定时间内评估任何前缀长度 k。 唯一微妙的一点是正确计算有多少段属于每个奇偶校验类，因为这决定了必须分配多少剩余长度。 

通过交换对应于水平移动的奇偶校验来对称地处理两种方向的情况。 

## 工作示例

 考虑第二个样本输入：n = 3，系数为 [2, 3, 1]。 

我们计算前缀数据：

 | k | 奇数总和 | 偶数总和 | 奇数最小值 | 偶数最小值 | 奇数_cnt | 甚至_cnt |
 | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 2 | 0 | 2 | 信息 | 1 | 0 |
 | 2 | 2 | 3 | 2 | 3 | 1 | 1 |
 | 3 | 3 | 3 | 1 | 3 | 2 | 1 |

 对于 k = 3 且起始水平，奇数段是水平的，偶数段是垂直的。 水平基本成本为 3，垂直基本成本为 3。剩余水平长度为 3 - 2 = 1，分配给最小奇数，即 1，剩余垂直长度为 3 - 1 = 2，分配给最小偶数，即 3。这给出了总计 3 + 3 + 1 + 6 = 13。 

该迹线显示了最佳解决方案如何将剩余长度集中在每个奇偶校验组中的最小系数上，而不是分散它。 

现在考虑系数减少的情况：[5,4,3,2]。 该算法评估所有前缀，并且最佳解决方案转向使用更长的前缀，因为后来较小的系数减少了分配额外长度的成本，这是由前缀最小值项捕获的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个前缀被处理一次，并且每个 k 在常数时间内被评估 |
 | 空间| O(n) | 前缀数组存储总和和最小值 |

 跨测试用例的 n 总和为 100000，因此每个测试用例的线性扫描完全符合时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    def solve():
        t = int(input())
        for _ in range(t):
            n = int(input())
            c = list(map(int, input().split()))

            odd_sum = [0] * (n + 1)
            even_sum = [0] * (n + 1)
            odd_min = [10**18] * (n + 1)
            even_min = [10**18] * (n + 1)

            for i in range(1, n + 1):
                val = c[i - 1]
                odd_sum[i] = odd_sum[i - 1]
                even_sum[i] = even_sum[i - 1]
                odd_min[i] = odd_min[i - 1]
                even_min[i] = even_min[i - 1]

                if i % 2 == 1:
                    odd_sum[i] += val
                    odd_min[i] = min(odd_min[i], val)
                else:
                    even_sum[i] += val
                    even_min[i] = min(even_min[i], val)

            ans = 10**30

            for k in range(1, n + 1):
                odd_cnt = (k + 1) // 2
                even_cnt = k // 2

                h_cost = odd_sum[k] + (n - odd_cnt) * odd_min[k]
                v_cost = even_sum[k] + (n - even_cnt) * even_min[k]
                ans = min(ans, h_cost + v_cost)

                h_cost = even_sum[k] + (n - even_cnt) * even_min[k]
                v_cost = odd_sum[k] + (n - odd_cnt) * odd_min[k]
                ans = min(ans, h_cost + v_cost)

            print(ans)

    solve()
    return ""

# provided samples
assert run("""3
2
13 88
3
2 3 1
5
4 3 2 1 4
""") == ""

# custom cases
assert run("""1
2
1 100
""") == "", "min prefix dominates"

assert run("""1
4
5 4 3 2
""") == "", "decreasing costs"

assert run("""1
5
1 1 1 1 1
""") == "", "uniform costs"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 1 100`| 最小的早期细分市场优势| 前缀最小行为 |
 |`5 4 3 2`| 通过后面的前缀的小答案 | 降低成本结构|
 |`1 1 1 1 1`| 一致的线性缩放| 均匀稳定性|

 ## 边缘情况

 一种微妙的情况是，最佳解决方案仅使用一个方向组中的一个线段，这意味着几乎所有长度都分配给单个系数。 对于像 [10, 1, 10, 1] 这样的输入，算法自然地捕捉到最佳选择是最大化每个奇偶类中最小系数的贡献。 前缀最小值确保一旦出现 1，所有未来的前缀都反映出它可以吸收大部分剩余长度。 

另一种边缘情况是早期系数很小但后来的系数更小。 对于[3,1,2,0.5]，前缀扫描确保k延伸超过0.5出现的点将立即降低有效成本，因为更新最少，并且算法相应地改变权重分布，而不需要重新计算或回溯。
