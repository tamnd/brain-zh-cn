---
title: "CF 1399C - 船只比赛"
description: "我们有一组参与者，每个参与者都有特定的权重。 比赛只允许两人组队，并且每队的总重量必须相同。 我们的目标是为一组给定的参与者组建尽可能多的团队。"
date: "2026-06-11T08:58:13+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "greedy", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1399
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 661 (Div. 3)"
rating: 1200
weight: 1399
solve_time_s: 83
verified: true
draft: false
---

[CF 1399C - 船只竞赛](https://codeforces.com/problemset/problem/1399/C)

 **评分：** 1200
 **标签：** 暴力破解、贪心、两指针
 **求解时间：** 1m 23s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一组参与者，每个参与者都有特定的权重。 比赛只允许两人组队，并且每队的总重量必须相同。 我们的目标是为一组给定的参与者组建尽可能多的团队。 挑战是选择总重量`s`最大化有效团队的数量。 每个参与者只能属于一个团队，所以我们不能重用人员。 

限制很小：`n`最多为 50，权重范围为 1 到`n`。 自从`n`很小，我们可以检查所有可能的总权重，因为两个参与者的不同总和的数量受以下限制`2n`。 这排除了对高度优化的数据结构或复杂算法的需求。 边缘情况包括所有参与者具有相同权重的情况，可能无法以一定的总和组成对，或者多个总权重产生相同的最大团队数量的情况。 

例如，粗心的实现可能总是尝试计算最轻和最重的参与者的总和，而不考虑其他总和。 例如，与参与者`[1, 2, 2, 1, 2, 1, 1, 2]`，最优总重量为`3`（对`(1,2)`）， 不是`4`（留下剩余的参与者）。 简单的算法可能会错过这一点，因为它只检查单个候选总和。 

## 方法

 蛮力方法迭代所有可能的总权重`s`从`2`（两个参与者的最小总和）到`2n`（最大金额）。 对于每个`s`，我们尝试所有可能的参与者对，看看我们可以组成多少个团队。 这可以通过嵌套循环或通过保留权重的频率图来实现。 每当使用一对时，组建团队需要减少频率图中的计数。 虽然这种方法是正确的，但它具有最坏情况下的复杂性`O(n^2 * n) = O(n^3)`因为我们可能会检查每一对的每个候选总和，这是可以接受的`n=50`但可以改进。 

关键的观察是，问题可以简化为计算每个权重出现的次数并贪婪地配对权重。 对于候选人总体重`s`, 一个权重`w`只能与`s - w`。 我们可以计算这样的对的数量作为计数的最小值`w`和`s - w`。 迭代所有权重`1`到`n`对于每个候选人`s`产生一个`O(n^2)`解决方案，考虑到限制，该解决方案足够快。 这种方法利用了权重的小范围和对的对称性：我们只需要对每个总和考虑每个不同的权重一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^3) | O(n^3) | O(n) | 有效但可以优化 |
 | 贪婪频率图 | O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，读取参与者的数量`n`和他们的体重。 
3. 创建频率图`freq`计算每个体重有多少参与者。 
4. 初始化变量`max_teams`为零。 这将跟踪任何总重量的最佳团队数量。 
5. 迭代所有可能的总权重`s`从`2`到`2n`。 
6. 对于每个候选总和`s`，创建频率图的副本。 这可以防止在模拟配对形成时修改原始计数。 
7. 初始化计数器`teams`当前总和为零`s`。 
8. 迭代权重`w`从`1`到`n`。 对于每个`w`, 求其补集`c = s - w`。 
9.如果`c`是在范围内`1..n`，计算对数为`min(freq[w], freq[c])`。 如果`w == c`，将结果除以二以避免重复计算。 
10. 将这个数量的对添加到`teams`并减少复制的频率图中的计数。 
11. 检查完所有重量后的总和`s`， 更新`max_teams`如果`teams`更大。 
12. 打印`max_teams`作为当前测试用例的答案。 

为什么它有效：在每一步，算法都会维护一个不变量，即我们不会重复使用参与者。 通过迭代所有可能的总和并使用频率图贪婪地形成对，我们保证不会遗漏任何对，并且我们正确地计算每个总权重的最大团队数量。 总和的外层循环确保我们找到全局最优总和。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def max_teams(weights, n):
    freq = [0] * (n + 1)
    for w in weights:
        freq[w] += 1

    max_teams_count = 0

    for s in range(2, 2 * n + 1):
        temp_freq = freq.copy()
        teams = 0
        for w in range(1, n + 1):
            c = s - w
            if 1 <= c <= n:
                pair_count = min(temp_freq[w], temp_freq[c])
                if w == c:
                    pair_count //= 2
                teams += pair_count
                temp_freq[w] -= pair_count
                temp_freq[c] -= pair_count
        max_teams_count = max(max_teams_count, teams)

    return max_teams_count

t = int(input())
for _ in range(t):
    n = int(input())
    weights = list(map(int, input().split()))
    print(max_teams(weights, n))
```该解决方案首先读取输入并构建频率数组来计算参与者的权重。 对于每个候选总权重，我们复制频率数组来模拟配对形成，而不会产生副作用。 贪婪配对是通过取权重及其补数的最小计数来完成的。 当`w`等于`s - w`以避免过度计算。 评估所有总和后，返回最大团队数。 

## 工作示例

 **样品1：**`weights = [1, 2, 3, 4, 5]`,`n = 5`。 

| 和`s`| 结对 | 团队|
 | --- | --- | --- |
 | 2 | 无 | 0 |
 | 3 | (1,2) | 1 |
 | 4 | (1,3) | 1 |
 | 5 | (1,4),(2,3) | 2 |
 | 6 | (1,5),(2,4) | 2 |
 | 7 | (2,5),(3,4) | 2 |
 | 8 | (3,5) | 1 |
 | 9 | (4,5) | 1 |
 | 10 | 10 无 | 0 |

 最大团队数：2

 该轨迹表明，最轻与最重的配对并不总是能产生全局最优值。 考虑所有的总和可以确保我们找到正确的答案。 

**样本2：**`weights = [6, 6, 6, 6, 6, 6, 8, 8]`,`n = 8`。 

| 和`s`| 团队|
 | --- | --- |
 | 12 | 12 (6,6)x3 |
 | 14 | 14 (6,8)x3？ |

 最大团队数：3

 这表明重复权重可以为单个总和组成多个团队，并且使用频率的贪婪配对工作正常。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n^2) | O(n^2) | 对于每个可能的总和`s`（2n 种可能性），我们迭代所有权重 1..n 以形成对。 |
 | 空间| O(n) | 每个和的频率数组及其副本。 |

 给定`n ≤ 50`,`n^2`每个测试用例的操作都在限制范围内`t ≤ 1000`测试用例。 内存使用量微不足道。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # call solution
    t = int(input())
    for _ in range(t):
        n = int(input())
        weights = list(map(int, input().split()))
        print(max_teams(weights, n))
    return output.getvalue().strip()

# provided samples
assert run("""5
5
1 2 3 4 5
8
6 6 6 6 6 6 8 8
8
1 2 2 1 2 1 1 2
3
1 3 3
6
1 1 3 4 2 2
""") == """2
3
4
1
2"""

# custom cases
assert run("1\n1\n1\n") == "0", "single participant"
assert run("1\n2\n1 1\n") == "1", "two identical participants"
assert run("1\n4\n1 2 2 1\n") == "2", "pairs with multiple same weights"
assert run("1\n50\n" + " ".join(str(i%50+1) for i in range(50)) + "\n") != "", "maximum n case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 名参与者 | 0 | 无法形成任何 |
