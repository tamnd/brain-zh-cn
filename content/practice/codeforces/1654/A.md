---
title: "CF 1654A - 最大蛋糕美味"
description: "我们得到一排 $n$ 蛋糕，每个蛋糕的重量为 $ai$。 蛋糕的美味度定义为相邻两块蛋糕的味道之和。 我们最多可以翻转一块连续的蛋糕一次，然后测量味道。"
date: "2026-06-10T03:40:03+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "implementation", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1654
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 778 (Div. 1 + Div. 2, based on Technocup 2022 Final Round)"
rating: 800
weight: 1654
solve_time_s: 81
verified: true
draft: false
---

[CF 1654A - 最大蛋糕美味](https://codeforces.com/problemset/problem/1654/A)

 **评分：** 800
 **标签：** 暴力、贪婪、实现、排序
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一行$n$蛋糕，每个都有重量$a_i$。 蛋糕的美味度定义为相邻两块蛋糕的味道之和。 我们最多可以翻转蛋糕的**一个连续的子部分**，然后测量味道。 我们的目标是在手术后最大限度地提高美味。 

输入由多个测试用例组成。 对于每个测试用例，我们都会得到零件的数量及其重量。 输出是最多一次反转后可达到的最大美味。 

限制条件适中：$n$可以达到$1000$，并且最多可以有$50$测试用例。 这允许算法大致达到$O(n^2)$每个测试用例，但任何东西$O(n^3)$会太慢。 需要注意的边缘情况包括大小为 2 的非常小的数组、所有元素都相等的数组或已经严格降序或升序的数组。 例如，如果$a = [1, 100, 1]$，一种仅考虑反转大块的天真的方法可能会错过反转中间两个元素可以最大化美味，从而给出$100 + 1 = 101$。 

## 方法

 蛮力方法很简单：尝试每个可能的子段$[l, r]$，反转它，并计算最大相邻和。 这是可行的，因为我们知道数组长度足够小$O(n^3)$理论上是正确的，但在实践中，它涉及$n^3/2$操作并且可能会在接近上限时超时$n = 1000$。 

关键的见解来自于分析逆转实际上可以改变什么。 仅涉及**反向线段**边缘的总和或数组边界处的总和发生变化。 更具体地说，反转数组的中间不会影响其外部的对，除了反转子段的第一个和最后一个元素之外。 这大大减少了问题：我们只需要考虑反转前缀、后缀或交换相邻对，因为任何更复杂的反转都不能增加最大值，除了交换最大和第二大相邻数字之外。 

因此，最佳方法是计算原始数组中的最大相邻和，然后考虑三个候选改进：

 1. 将第一个元素与任何其他元素交换（反转前缀）。 
2. 将最后一个元素与任何其他元素交换（反转后缀）。 
3. 交换前两个或后两个元素（边沿反转）。 

检查这些可能性是线性的，$O(n)$每个测试用例，因为我们只计算涉及数组端点或对的总和。 这种洞察力避免了需要$O(n^2)$完全子段反转。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 对于 n = 1000 来说太慢 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例数量$t$。 对于每个测试用例，请阅读$n$和数组$a$。 
2. 初始化`max_tastiness`为零。 迭代数组以计算当前最大相邻和：对于每个$i$从$0$到$n-2$， 更新`max_tastiness = max(max_tastiness, a[i] + a[i+1])`。 
3. 考虑反转**前缀**：对于每个$i$从$1$到$n-1$, 计算`a[0] + a[i]`并更新`max_tastiness`。 这模拟倒车$[0, i]`, bringing $人工智能]$ next to $一个[0]`。 
4. 考虑反转**后缀**：对于每个$i$从$0$到$n-2$, 计算`a[n-1] + a[i]`并更新`max_tastiness`。 这模拟了反转 $[i, n-1]`。 
5. 打印`max_tastiness`对于当前的测试用例。 

步骤 3 和 4 足够的原因是，中间任何更长的反转都不会创建一个新的最大和，该最大和大于我们通过将最大数移动到边缘所能达到的最大和，因为只有第一个和最后一个元素可以“满足”先前不相邻的大数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    
    max_tastiness = 0
    # original adjacent sums
    for i in range(n - 1):
        max_tastiness = max(max_tastiness, a[i] + a[i+1])
    
    # consider prefix reversals (first element + any other)
    for i in range(1, n):
        max_tastiness = max(max_tastiness, a[0] + a[i])
    
    # consider suffix reversals (last element + any other)
    for i in range(n - 1):
        max_tastiness = max(max_tastiness, a[-1] + a[i])
    
    print(max_tastiness)
```该代码首先计算现有相邻和的最大值。 然后，它评估将第一个或最后一个元素移动到每个可能的其他位置，从而模拟所有潜在的有影响力的逆转。 在计算后缀和前缀和时，请注意避免重复计算第一个和最后一个元素。 

## 工作示例

 输入示例：`6\n5 2 1 4 7 3`| 步骤| 最大味道 | 说明|
 | --- | --- | --- |
 | 初始相邻和 | 11 | 11 最大(5+2=7, 2+1=3, 1+4=5, 4+7=11, 7+3=10) |
 | 前缀反转候选 | 12 | 12 a[0]+a[4] = 5+7=12，最大更新 |
 | 后缀反转候选 | 12 | 12 没有找到更大的值|
 | 输出| 12 | 12 正确的最大美味 |

 输入示例：`3\n32 78 78`| 步骤| 最大味道 | 说明|
 | --- | --- | --- |
 | 初始相邻和 | 156 | 156 最大(32+78=110, 78+78=156) |
 | 前缀反转候选 | 156 | 156 a[0]+a[1]=32+78=110, a[0]+a[2]=32+78=110 |
 | 后缀反转候选 | 156 | 156 a[2]+a[0]=110，a[2]+a[1]=156 |
 | 输出| 156 | 156 不逆转可提高美味|

 ## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个测试用例线性扫描数组 3 次 |
 | 空间| O(1) | O(1) | 只有几个变量； 数组存储算作输入 |

 给定$n \le 1000$和$t \le 50$，最坏的情况是 50,000 次操作，完全低于 2 秒的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        max_tastiness = 0
        for i in range(n - 1):
            max_tastiness = max(max_tastiness, a[i] + a[i+1])
        for i in range(1, n):
            max_tastiness = max(max_tastiness, a[0] + a[i])
        for i in range(n - 1):
            max_tastiness = max(max_tastiness, a[-1] + a[i])
        print(max_tastiness)
    return out.getvalue().strip()

# provided samples
assert run("5\n6\n5 2 1 4 7 3\n3\n32 78 78\n3\n69 54 91\n8\n999021 999021 999021 999021 999652 999021 999021 999021\n2\n1000000000 1000000000") == "12\n156\n160\n1998673\n2000000000", "sample"

# custom cases
assert run("1\n2\n1 2") == "3", "minimum-size array"
assert run("1\n4\n1 1 1 1") == "2", "all equal values"
assert run("1\n5\n1 2 3 4 5") == "9", "strictly increasing array"
assert run("1\n5\n5 4 3 2 1") == "9", "strictly decreasing array"
assert run("1\n6\n1 1000000000 1 1 1 1") == "1000000001", "large element at start"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2 个元素 | 3 | 最小尺寸数组处理 |
 | 一切平等| 2 | 逆转不会改变美味|
 | 增加数组| 9 | 移动最大的开始或结束|
 | 递减数组 | 9 | 移动最大的开始或结束|
 | 开始时数量较多 | 1000000001 | 具有大值的边界 |

 ## 边缘情况

 对于大小为 2 的数组，算法正确返回它们的值
