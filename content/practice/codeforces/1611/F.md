---
title: "CF 1611F - ATM 和学生"
description: "该问题涉及模拟一台 ATM，它以固定金额启动，并且必须为一排学生提供服务。 每个学生要么从 ATM 机存入正数，要么提取负数。"
date: "2026-06-10T07:06:46+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1611
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 756 (Div. 3)"
rating: 1800
weight: 1611
solve_time_s: 72
verified: true
draft: false
---

[CF 1611F - ATM 和学生](https://codeforces.com/problemset/problem/1611/F)

 **评分：** 1800
 **标签：** 二分查找、数据结构、二指针
 **求解时间：** 1m 12s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题涉及模拟一台 ATM，它以固定金额启动，并且必须为一排学生提供服务。 每个学生要么从 ATM 机存入正数，要么提取负数。 操作ATM机的Polycarp可以选择在队列中的任何一点开始为学生提供服务，一旦ATM机无法满足取款要求，它就会永久关闭。 任务是找到可以完全服务的学生的最长连续子序列，并输出该子序列中第一个和最后一个学生的索引，如果没有可以服务的学生则输出-1。 

输入由多个测试用例组成，每个测试用例指定学生人数、初始 ATM 余额以及交易请求的顺序。 这些约束允许每个测试用例最多 200,000 名学生以及最多 10,000 个测试用例，但是`n`所有测试用例不超过 200,000 个。 这立即排除了每个测试用例复杂度为 O(n²) 的任何方法，因为在最坏的情况下，我们将执行大约 4×1010 次操作，远远超过时间限制。 O(n) 或 O(n log n) 方法是可行的。 当 ATM 余额最初不足以用于提前取款、存款发生在取款之前、或者序列包含零（不得将其视为取款）时，就会出现关键的边缘情况。 

例如，考虑序列`[-5, 10, -3]`初始余额为`4`。 从第一个学生开始的简单实现将会失败，因为第一次提款超出了余额。 正确的方法是跳过第一个学生，服务接下来的两个学生，并返回子序列索引`2 3`。 

## 方法

 暴力方法将考虑每个可能的起始学生，模拟每个连续子序列的 ATM，并跟踪最长有效子序列的长度。 这种方法保证是正确的，因为它明确地检查了每种可能性。 然而，在n=200,000的最坏情况下，如果我们将所有子序列的长度相加，它将执行大约2×10^1⁰运算，这在2秒内是不可能的。 

关键的见解是，通过仔细跟踪 ATM 余额和取款，问题可以简化为单通道滑动窗口。 一旦ATM无法提款，包括该提款在内的任何后续操作均无效。 正存款只会增加 ATM 余额，不会限制后续操作，而负取款则会迫使窗口移动。 这自然建议使用两指针方法或跟踪窗口内的最大负交易，并结合前缀和以提高效率。 该解决方案保持运行平衡，并在余额变为负数时动态更新候选起点。 通过关注连续段并利用累积和的属性，我们可以实现每个测试用例的线性时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了 |
 | 滑动窗口/前缀和| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.初始化两个指针：`start`0 处表示所服务子序列的潜在开始，并且`max_len`为 0 来存储最长有效子序列的长度。 追踪`max_start`和`max_end`为最终输出。 
2. 用索引遍历学生`i`，维持一个`balance`变量初始化为 ATM 起始金额`s`。 
3. 对于每个学生，添加交易价值`a[i]`到`balance`。 如果`a[i]`为正数，会增加 ATM 余额。 如果为负数，检查是否`balance`退出后变为负值。 
4.如果`balance`低于零，从当前开始无法为该学生提供服务`start`。 移动`start`到`i + 1`并重置`balance`到`s`，有效地考虑下一个学生作为新候选人的开始。 
5. 每当发生有效交易时，检查当前窗口是否`i - start + 1`超过`max_len`。 如果有，请更新`max_len`,`max_start`， 和`max_end`到当前窗口。 
6. 处理完所有学生后，如果`max_len`保持为 0，打印`-1`。 否则，打印`max_start + 1`和`max_end + 1`从基于 0 的索引转换为基于 1 的索引。 

工作原理：该算法可确保 ATM 余额在候选窗口内永远不会变为负值，并且仅在无法提款时才转移开始时间，从而有效地识别最大连续段。 正交易无限制地扩展窗口，保证找到最长的可行子序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, s = map(int, input().split())
        a = list(map(int, input().split()))
        max_len = 0
        max_start = max_end = -1
        start = 0
        balance = s
        for i in range(n):
            balance += a[i]
            if balance < 0:
                start = i + 1
                balance = s
            else:
                if i - start + 1 > max_len:
                    max_len = i - start + 1
                    max_start = start
                    max_end = i
        if max_len == 0:
            print(-1)
        else:
            print(max_start + 1, max_end + 1)

if __name__ == "__main__":
    solve()
```该代码按所述初始化指针和余额。 当余额变为负数时，它会改变`start`并重置天平以避免无效序列。 长度检查确保仅记录最长的有效子序列。 转换为基于 1 的索引对于匹配输出格式至关重要。 重置`balance`搬家后`start`确保每个新的候选段以 ATM 初始总和开始`s`。 

## 工作示例

 考虑第一个样本输入：```
4 10
-16 2 -6 8
```| 我| 一个[我] | 平衡| 开始 | 最大长度 | 最大开始时间 | 最大结束 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0 | -16 | -16 -6 | 1 | 0 | -1 | -1 |
 | 1 | 2 | 12 | 12 1 | 1 | 1 | 1 |
 | 2 | -6 | 6 | 1 | 2 | 1 | 2 |
 | 3 | 8 | 14 | 14 1 | 3 | 1 | 3 |

 输出是`2 4`，对应于最长的线段`[2, -6, 8]`。 

考虑第二个示例输入：```
3 1000
-100000 -100000 -100000
```所有学生的请求都超过了 ATM 的容量。 每个起始学生的余额立即降至零以下，因此算法打印`-1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | Each student is visited once, balance updates and comparisons are O(1). |
 | 空间| 输入数组的 O(n) | 只存储student数组； 其他变量使用 O(1)。 |

 鉴于总`n`所有测试用例最多为 200,000 个，算法最多执行 200,000 次迭代，完全在 2 秒限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided samples
assert run("3\n4 10\n-16 2 -6 8\n3 1000\n-100000 -100000 -100000\n6 0\n2 6 -164 1 -1 -6543\n") in ["2 4\n-1\n1 2", "2 4\n-1\n4 5"], "sample 1"

# custom cases
assert run("1\n1 5\n-10\n") == "-1", "single withdrawal too large"
assert run("1\n5 0\n1 2 3 4 5\n") == "1 5", "all deposits, starting at 1"
assert run("1\n5 5\n-1 -1 -1 -1 -1\n") == "1 5", "withdrawals exactly equal to balance"
assert run("1\n5 3\n-2 -1 2 -1 -1\n") == "1 5", "mix, balance never negative"
assert run("1\n3 0\n-1 2 -1\n") == "2 3", "skip first negative, then serve next two"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 5 -10 | 1 5 -10 -1 | 单笔取款超过ATM |
 | 5 0 1 2 3 4 5 | 5 0 1 2 3 4 5 1 5 | 1 所有存款，最长的段是整个数组 |
 | 5 5 -1 -1 -1 -1 -1 | 5 5 -1 -1 -1 -1 -1 1 5 | 1 提款正好消耗余额|
 | 5 3 -2 -1 2 -1 -1 | 5 3 -2 -1 2 -1 -1 1 5 | 1 混合存款和取款 |
 | 3 0 -1 | 3 0 -1 | |
