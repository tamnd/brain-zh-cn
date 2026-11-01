---
title: "CF 1656A - 好对"
description: "我们被要求在正整数数组中找到一对“好的索引对”。 一个好的对由两个索引 $i$ 和 $j$ 组成，这样，如果考虑数组中的任何元素 $ak$，从 $ai$ 到 $ak$ 以及从 $ak$ 到 $aj$ 的距离之和等于从 $ai$ 到...的距离"
date: "2026-06-10T03:32:51+07:00"
tags: ["codeforces", "competitive-programming", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1656
codeforces_index: "A"
codeforces_contest_name: "CodeTON Round 1 (Div. 1 + Div. 2, Rated, Prizes!)"
rating: 800
weight: 1656
solve_time_s: 143
verified: true
draft: false
---

[CF 1656A - 好对](https://codeforces.com/problemset/problem/1656/A)

 **评分：** 800
 **标签：** 数学，排序
 **求解时间：** 2m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求在正整数数组中找到一对“好的”索引。 一个好的货币对由两个索引组成$i$和$j$这样，如果你考虑任何元素$a_k$在数组中，距离的总和$a_i$到$a_k$和来自$a_k$到$a_j$等于距离$a_i$到$a_j$。 用几何术语来说，$a_k$必须位于连接的直线段上$a_i$和$a_j$，当考虑实数轴上的数字时。 

输入由多个测试用例组成，每个测试用例都有数组大小$n$和数组元素。 输出必须识别任何好的对，并且问题保证解决方案始终存在。 一个关键细节是$i$可能等于$j$，这立即为大小为 1 的数组提供了一个简单的解决方案。 

约束允许最多$10^5$单个数组中的元素，并且所有测试用例的总和不超过$2 \cdot 10^5$。 这意味着任何对每个阵列执行超过线性工作的解决方案都可能太慢。 我们还必须小心所有元素都相等的数组、具有两个元素的数组或一般具有重复项的数组，因为如果我们忽略绝对值属性，则前两个索引的天真选择可能会失败。 

## 方法

 暴力方法是尝试每对索引$(i, j)$并检查所有的定义属性$k$。 这需要$O(n^3)$最坏情况下的操作，因为对于每个$O(n^2)$我们检查的对$n$元素。 这显然是不可行的$n$最多$10^5$。 

遵守平等$$|a_i - a_k| + |a_k - a_j| = |a_i - a_j|$$揭示了一种简化。 左侧等于距$a_i$到$a_j$当且仅当$a_k$位于之间$a_i$和$a_j$包容性。 也就是说，要么$a_i \le a_k \le a_j$或者$a_j \le a_k \le a_i$。 这种见解将问题简化为查找数组中最小和最大的两个数字。 任何$k$将自动满足该属性，因为所有其他元素都位于最小值和最大值之间。 因此，问题简化为识别中的最小和最大元素$O(n)$时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^3) | O(n^3) | O(1) | O(1) | 太慢了|
 | 最小-最大选择 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 对于每个测试用例，请阅读$n$和数组$a$。 
2. 初始化两个变量来存储数组的最小值和最大值，以及它们各自的索引。 
3. 迭代数组。 如果当前元素小于当前最小值，则更新最小值及其索引。 如果大于当前最大值，则更新最大值及其索引。 
4. 完成迭代后，我们现在有了最小和最大元素的索引。 将这些索引输出为好对。 
5. 如果数组仅包含一个元素，则输出其索引两次。 这涵盖了边缘情况，无需额外检查。 

为什么它有效：通过选择最小和最大的数字，所有其他数组元素都位于它们之间。 这保证了对于任何$k$,$|a_i - a_k| + |a_k - a_j| = |a_i - a_j|$，满足良好对属性。 任何元素都不能违反等式，线性扫描确保正确性和效率。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))

        min_val = float('inf')
        max_val = float('-inf')
        min_idx = max_idx = 0

        for idx, val in enumerate(a):
            if val < min_val:
                min_val = val
                min_idx = idx
            if val > max_val:
                max_val = val
                max_idx = idx

        # output 1-based indices
        print(min_idx + 1, max_idx + 1)

if __name__ == "__main__":
    solve()
```该解决方案使用快速 I/O 高效读取每个阵列。 我们仔细跟踪索引以返回从 1 开始的结果。 使用`float('inf')`和`float('-inf')`即使对于大整数也能确保正确的初始化。 在数组上迭代一次可以保证$O(n)$每个测试用例的时间。 

## 工作示例

 **示例输入 1：**`5 1 4 2 2 3`| 索引 | 价值| 最小值 | 最小 idx | 最大值 | 最大idx |

 |---|---|---|---|---
