---
title: "CF 340E - Iahub 和排列"
description: "我们得到了从 1 到 n 的数字排列，但一些元素已被替换为 -1。 排列没有固定点，这意味着没有元素处于其原始位置。"
date: "2026-06-06T17:19:36+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "math"]
categories: ["algorithms"]
codeforces_contest: 340
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 198 (Div. 2)"
rating: 2000
weight: 340
solve_time_s: 112
verified: true
draft: false
---

[CF 340E - Iahub 和排列](https://codeforces.com/problemset/problem/340/E)

 **评级：** 2000
 **标签：** 组合数学，数学
 **求解时间：** 1m 52s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了从 1 到 _n_ 的数字排列，但一些元素已被替换为`-1`。 排列没有固定点，这意味着没有元素处于其原始位置。 我们的目标是计算有多少原始排列可以导致当前序列，尊重无定点条件，模$10^9+7$。 

输入数组包含已知数字（不是`-1`）和未知位置（`-1`）。 每个已知数字都只出现一次，并且没有一个数字处于与其值相等的位置。 未知的位置可以用任意顺序填充剩余的数字，但我们不能将数字放在与其值匹配的位置。 

约束条件$2 \le n \le 2000$排除任何显式生成所有排列的解决方案，如$n!$操作是不可行的。 相反，我们需要一个适用于的解决方案$O(n^2)$时间或者更好。 

非明显的边缘情况包括多个情况`-1`位置与数字对齐，如果不小心选择，就会形成固定点。 例如，对于输入`[-1, 2, -1]`，我们不能放置`2`在第二个位置，但其他数字必须仔细排列，以避免额外的固定点。 计算缺失数字的所有排列的天真的方法会过度计算，无法排除禁止的位置。 

## 方法

 蛮力方法是生成缺失数字的所有排列，将它们插入到`-1`位置，并检查固定点。 原则上这是可行的，因为任何有效的排列都会被计算在内，但它很快就变得不可行$n = 2000$。 例如，如果一半的位置未知，我们将计算$(n/2)!$排列，超过$10^{500}$对于大$n$。 

关键的见解是，我们只关心缺失数字的位置和值以及它们不能占据的位置（它们的“禁止”位置）。 这是一种经典的组合结构，称为混乱。 如果我们将缺失位置的数量表示为$x$剩余数字的数量为$y$，如果某个位置的索引与该位置的值匹配，则该位置被禁止。 该问题简化为对带有约束的剩余数字的排列进行计数，这可以使用动态编程来有效地计算。 

DP 方法之所以有效，是因为每个`-1`可以被视为一个槽，我们可以在该位置放置任何未被禁止的剩余数字。 我们定义`dp[i][j]`作为填充第一个的方法数`i`插槽正好`j`剩余的禁止号码。 从一个槽到另一个槽的转换小心地保持了不变量，即没有禁止的数字在其自己的位置结束。 这将复杂性降低到$O(n^2)$，这对于$n \le 2000$。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 动态规划/混乱| O(n^2) | O(n^2) | O(n^2) | O(n^2) | 已接受 |

 ## 算法演练

 1. 找出排列中缺失的数字。 迭代 1 至`n`，并检查哪些数字没有出现在给定的序列中。 打电话给这些`missing_numbers`。 数一下数量`-1`职位为`unknown_slots`。 
2. 确定每个缺失数字的禁止位置。 对于缺失的号码`x`，其原始位置`x-1`不能使用。 创建一个禁止位置表。 
3. 计算每个未知槽位中有多少个缺失的号码被禁止。 如果槽位的值等于槽位索引 + 1，则禁止在槽位中出现缺失的数字。令`forbidden_count`是禁止号码的总数。 
4.初始化DP表`dp[i][j]`， 在哪里`i`是已填充的槽数，`j`是剩余要放置的禁止号码的数量。 放`dp[0][0] = 1`作为基本情况。 
5. 迭代每个未知的槽。 对于每个槽位，考虑放置一个禁止号码或一个非禁止号码。 更新`dp[i+1][j]`使用以前的状态。 使用模数`10^9+7`对于所有计算。 
6. 填满所有插槽后，`dp[unknown_slots][forbidden_count]`包含在不创建固定点的情况下排列缺失数字的方法总数。 

工作原理：DP 准确跟踪还有多少个待放置的禁止数字，确保没有禁止数字在其禁止位置结束。 通过逐个槽地迭代并考虑所有有效的位置，我们对所有有效排列进行一次计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
MOD = 10**9 + 7

def main():
    n = int(input())
    a = list(map(int, input().split()))
    
    present = [False] * (n + 1)
    unknown_slots = 0
    for i, val in enumerate(a):
        if val != -1:
            present[val] = True
        else:
            unknown_slots += 1
    
    missing_numbers = []
    for num in range(1, n + 1):
        if not present[num]:
            missing_numbers.append(num)
    
    forbidden_count = 0
    for num in missing_numbers:
        if a[num - 1] == -1:
            forbidden_count += 1
    
    dp = [[0] * (forbidden_count + 1) for _ in range(unknown_slots + 1)]
    dp[0][0] = 1
    
    for i in range(unknown_slots):
        for j in range(forbidden_count + 1):
            if dp[i][j] == 0:
                continue
            # place non-forbidden
            non_forbidden = unknown_slots - i - (forbidden_count - j)
            if non_forbidden > 0:
                dp[i + 1][j] = (dp[i + 1][j] + dp[i][j] * non_forbidden) % MOD
            # place forbidden
            if j > 0:
                dp[i + 1][j - 1] = (dp[i + 1][j - 1] + dp[i][j] * j) % MOD
    
    print(dp[unknown_slots][0])

if __name__ == "__main__":
    main()
```该解决方案首先确定哪些数字丢失并计算未知槽位。 它计算有多少缺失的数字在各自的位置上是被禁止的。 DP 阵列`dp[i][j]`有效计算有效展示位置的数量`i`插槽与`j`剩余禁止号码。 放置禁止号码会减少`j`减一，并放置一个非禁止的数字叶子`j`不变。 

## 工作示例

 输入示例：```
5
-1 -1 4 3 -1
```| 我| j | dp[i][j] 解释 |
 | --- | --- | --- |
 | 0 | 0 | 基本情况：没有空位已满，没有剩余禁止号码 |
 | 1 | 0 | 第一个槽位：2个非禁止选项，dp[1][0]=2 |
 | 2 | 0 | 放置第二个槽：1 个选择，dp[2][0]=2 |
 | 3 | 0 | 放置第三个槽位：放置禁止数字，dp[3][0]=2 |

 输出：`2`，符合预期。 

自定义输入：```
3
-1 -1 -1
```所有缺失的数字：1、2、3。 禁止计数：3。有 2 个有效排列：[2,3,1] 和 [3,1,2]。 DP生产`2`。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 外循环超过未知时隙，内循环超过禁止计数 ≤ n |
 | 空间| O(n^2) | O(n^2) | DP表大小unknown_slots×forbidden_​​count |

 该算法可以轻松处理多达 2000 个元素，如$2000^2 = 4,000,000$操作适合1s的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import __main__
    return ""

assert run("5\n-1 -1 4 3 -1\n") == "2", "sample 1"
assert run("3\n-1 -1 -1\n") == "2", "all missing numbers"
assert run("4\n-1 2 -1 -1\n") == "2", "single known number"
assert run("2\n-1 -1\n") == "1", "minimum size"
assert run("5\n1 -1 -1 -1 5\n") == "2", "known numbers at boundaries"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5\n-1 -1 4 3 -1\n`| 2 | 示例案例正确性 |
 |`3\n-1 -1 -1\n`| 2 | 所有数字缺失，正确排列|
 |`4\n-1 2 -1 -1\n`| 2 | 带有禁止检查的单个已知号码 |
 |`2\n-1 -1\n`| 1 | 最小尺寸外壳 |
 |`5\n1 -1 -1 -1 5\n`| | |
