---
title: "CF 1469B - 红色和蓝色"
description: "我们得到两个整数序列，一个代表原始序列的红色元素，另一个代表原始序列的蓝色元素。"
date: "2026-06-11T01:08:42+07:00"
tags: ["codeforces", "competitive-programming", "dp", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1469
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 101 (Rated for Div. 2)"
rating: 1000
weight: 1469
solve_time_s: 110
verified: true
draft: false
---

[CF 1469B - 红色和蓝色](https://codeforces.com/problemset/problem/1469/B)

 **评分：** 1000
 **标签：** dp、贪婪
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到两个整数序列，一个代表原始序列的红色元素，另一个代表原始序列的蓝色元素。 每种颜色内的顺序被保留，但我们不知道如何交错红色和蓝色元素来重建原始序列。 任务是找到这两个子序列的排序，使最大前缀和最大化，其中前缀和定义为第一个元素的和，前两个元素的和，依此类推。 我们只关心这些和中的最大值和零。 

输入尺寸很小，每个颜色序列最多包含 100 个元素和最多 1000 个测试用例。 这意味着每个测试用例的 O(n + m) 解决方案是可以接受的，但是任何尝试所有可能的交错的算法都是不可行的，因为交错的数量是组合的并且可能非常大。 

一个微妙的边缘情况是所有元素均为负数。 在这种情况下，最大前缀和为零，因为采用任何元素都会减少总和。 另一种情况是一个序列全部为负值，而另一个序列全部为正值。 该算法必须小心，可能会完全跳过负前缀。 

## 方法

 暴力方法将尝试生成红色和蓝色序列的每个有效交织，并计算每个的最大前缀和。 由于序列长度$n + m$有$\binom{n+m}{n}$交错，即使是最大的约束（n = m = 100）也使这种方法完全不切实际，因为它需要$10^{58}$计算。 

关键的见解是最大前缀总和仅取决于每个颜色序列中独立的前缀总和。 由于我们可以将一种颜色的所有元素放在另一种颜色的元素之前，因此我们只需要考虑分别取红色序列的最佳前缀和和蓝色序列的最佳前缀和。 首先放置具有最大正和的前缀不会有什么坏处，并且总和是相加的。 因此，解决方案简化为计算红色序列的最大前缀和、蓝色序列的最大前缀和，并对它们求和，但确保我们不会做出负贡献（我们使用最大值为零）。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(2^(n+m)) | O(2^(n+m)) | O(n+m) | 太慢了|
 | 最佳 | O(n + m) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`max_red`和`max_blue`为零。 它们将分别存储红色和蓝色序列的最大前缀和。 
2. 迭代红色序列。 保持流动金额。 添加每个元素后，更新`max_red`如果运行总和超过它。 这找到了通过采用红色序列的前缀可获得的最大总和。 
3. 对蓝色序列重复步骤 2，将结果存储在`max_blue`。 
4. 最大可能值`f(a)`是`max_red + max_blue`。 如果两个前缀和为正，则它们贡献为正； 负数将被忽略。 

这样做的原因是，在一个序列的最大前缀和之后添加任何附加元素都不能将最大值增加到超出最佳红色和蓝色前缀之和的范围。 颜色内的顺序是固定的，因此唯一的决定是如何交错序列。 通过独立地获取每个人的最大积极贡献，我们保证了全球最大化。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    r = list(map(int, input().split()))
    m = int(input())
    b = list(map(int, input().split()))
    
    max_red = max_blue = 0
    curr_sum = 0
    for val in r:
        curr_sum += val
        if curr_sum > max_red:
            max_red = curr_sum
    
    curr_sum = 0
    for val in b:
        curr_sum += val
        if curr_sum > max_blue:
            max_blue = curr_sum
    
    print(max_red + max_blue)
```该解决方案使用有效地读取输入`sys.stdin.readline`。 对于每个序列，我们维护一个运行总和并更新最大前缀和，确保负前缀不会减少结果。 最佳红色前缀和最佳蓝色前缀的总和给出了每个测试用例的答案。 在处理蓝色序列之前必须注意重置运行总和。 

## 工作示例

 **示例1**

 红色：[6,-5,7,-3]

 蓝色：[2, 3, -4]

 | 步骤| 跑步总和红色 | 最大红| 运行总和蓝色 | 最大蓝色 |
 | ---| ---| ---| ---| ---|
 | 1 | 6 | 6 | 2 | 2 |
 | 2 | 1 | 6 | 5 | 5 |
 | 3 | 8 | 8 | 1 | 5 |
 | 4 | 5 | 8 | -3 | 5 |

 最大前缀和红色 = 8

 蓝色最大前缀和 = 5

 总计 = 13

 **示例2**

 红色：[1, 1]

 蓝色：[10,-3,2,2]

 | 步骤| 跑步总和红色 | 最大红| 运行总和蓝色 | 最大蓝色|
 | ---| ---| ---| ---| ---|
 | 1 | 1 | 1 | 10 | 10 10 | 10
 | 2 | 2 | 2 | 7 | 10 | 10

 最大前缀和红色 = 2

 蓝色最大前缀和 = 10

 总计 = 12

 这些痕迹证实该算法正确地累积了正贡献，同时忽略了会减少总和的序列。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n + m) | 每个元素都被访问一次以计算运行总和 |
 | 空间| O(1) 额外 | 仅存储运行总和和最大值； 给定输入数组 |

 最多1000个测试用例，总操作次数最多为$1000 \times (100 + 100) = 2 \times 10^5$，很容易满足 2 秒的时间限制。 与 512 MB 限制相比，内存使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    t = int(input())
    for _ in range(t):
        n = int(input())
        r = list(map(int, input().split()))
        m = int(input())
        b = list(map(int, input().split()))
        
        max_red = max_blue = 0
        curr_sum = 0
        for val in r:
            curr_sum += val
            max_red = max(max_red, curr_sum)
        
        curr_sum = 0
        for val in b:
            curr_sum += val
            max_blue = max(max_blue, curr_sum)
        
        print(max_red + max_blue)
    
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided samples
assert run("4\n4\n6 -5 7 -3\n3\n2 3 -4\n2\n1 1\n4\n10 -3 2 2\n5\n-1 -2 -3 -4 -5\n1\n0\n1\n0\n") == "13\n13\n0\n0", "samples"

# Custom cases
assert run("1\n1\n-10\n1\n-5\n") == "0", "all negative"
assert run("1\n3\n1 2 3\n2\n-1 -2\n") == "6", "positive and negative mix"
assert run("1\n5\n0 0 0 0 0\n5\n1 1 1 1 1\n") == "5", "zeros and positives"
assert run("1\n1\n100\n1\n100\n") == "200", "single large positives"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 -10 -5 | 1 -10 -5 0 | 所有负数都产生零 |
 | 3 1 2 3 -1 -2 | 3 1 2 3 -1 -2 6 | 红蓝总和的积极贡献|
 | 5 个零，5 个一 | 5 | 正确忽略零贡献 |
 | 1 100, 1 100 | 1 100, 1 100 | 200 | 200 正确处理大的单元素正和 |

 ## 边缘情况

 当所有元素均为负数时，例如红色 = [-10]、蓝色 = [-5]，运行总和永远不会超过零。 算法初始化`max_red`和`max_blue`为零，因此最终输出正确为 0。这可以避免错误地选择负前缀。 

当序列包含零时，它们不会减少总和，因此如果有益的话，它们会自然包含在内。 例如，red = [0, 0]，blue = [1, 2]，max_red = 0，max_blue = 3，total = 3，这与最优交织匹配。
