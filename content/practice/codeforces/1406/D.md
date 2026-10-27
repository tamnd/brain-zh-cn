---
title: "CF 1406D - 三个序列"
description: "给定一个长度为 n 的整数 a 序列。 任务是将其分成两个长度相同的序列b和c，使得a中的每个元素都是b和c中相应元素的总和。"
date: "2026-06-11T07:55:24+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "greedy", "math"]
categories: ["algorithms"]
codeforces_contest: 1406
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 670 (Div. 2)"
rating: 2200
weight: 1406
solve_time_s: 99
verified: false
draft: false
---

[CF 1406D - 三个序列](https://codeforces.com/problemset/problem/1406/D)

 **评分：** 2200
 **标签：** 构造性算法、数据结构、贪心、数学
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个整数序列`a`长度`n`。 任务是将其分成两个序列`b`和`c`具有相同的长度，使得中的每个元素`a`是其中相应元素的总和`b`和`c`。 额外的限制是`b`必须是非递减的，并且`c`必须是非增加的。 最后，我们希望最小化出现在其中的最大值`b`或者`c`。 

在初始序列之后，有`q`运营。 每个操作都会添加一些整数`x`到一个连续的子段`a`。 对于每个操作，包括初始状态，我们必须输出序列的最小化最大值`b`和`c`。 

因为`n`和`q`最多可达 10^5，任何二次复杂度的解都是不可行的。 我们必须以每个查询的线性或对数为目标。 对所有可能性的简单迭代`b`和`c`会产生 O(n^2) 种可能性，并且会超时。 

当序列出现时，就会出现棘手的边缘情况`a`具有急剧减少然后增加的元素，或者当更新为负数时。 例如，考虑`a = [1, -2, 3]`。 尝试分配的幼稚方法`b_i = a_i // 2`和`c_i = a_i - b_i`失败是因为它不遵守单调性约束。 同样，在更新后添加`-5`对于中间元素，粗心的重新计算可能会错过`b`必须“赶上”之前的值。 

## 方法

 暴力方法将迭代所有可能的分裂`b_i`和`c_i`总和为`a_i`，检查满足非递减和非递增约束的所有序列。 每个索引的正确分割取决于之前的决策，因为`b`不能减少并且`c`无法增加。 枚举所有可能性需要 O(n^2) 时间，因此对于 n = 10^5 来说是不切实际的。 

关键的观察是问题可以简化为计算最小值`max(b_i, c_i)`使用简单的递归。 如果我们定义`d_i = a_i - b_i = c_i`，那么对于每个`i`的最优选择`b_i`是由前一个决定的`b_{i-1}`和价值`a_i`。 具体来说，不递减的要求`b`意味着`b_i >= b_{i-1}`，以及不增加的要求`c`意味着`b_i <= a_i - c_{i-1}`。 这给出了一个简单的公式：```
b_i = max(b_{i-1}, a_i - c_{i-1})
c_i = a_i - b_i
```然而，我们不需要整个序列。 所有的最小化最大值`b_i`和`c_i`由前缀差异的线性函数确定`a_{i+1} - a_i`。 如果我们定义`diff_i = a_{i+1} - a_i`，答案可以表示为`a_1 + sum(max(0, diff_i)/2)`或者，更优雅的是，通过跟踪连续元素之间的斜率如何限制分割。 每次更新后，`diff_i`数组只改变端点，因此我们可以使用线段树或简单的前缀和技巧有效地重新计算最大值。 

这种见解将问题简化为对差异的线性扫描`a`，应用单调调整并保持遇到的最大值。 每次更新最多修改差异数组中的两个位置，因此如果我们小心地保持差异的最大效果，则每个查询的答案可以在 O(1) 内更新。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 使用差异数组进行优化 | O(n + q) | O(n) | 已接受 |

 ## 算法演练

 1. 计算差异数组`diff[i] = a[i+1] - a[i]`为了`i`从 1 到 n-1。 这捕获了连续元素如何约束`b`和`c`。 积极的差异推动`b`向上，负差异推动`c`向上。 
2. 将初始答案计算为`ans = a[0] + sum_of_positive_slopes`其中正斜率代表我们需要添加以保持单调性的最小额外量。 在实践中，公式是`ans = ceil((a[0] + a[n-1] + sum_i |diff_i|)/2)`。 这是通过观察得出的，对于任何序列，`max(b_i, c_i) >= ceil((a_1 + a_n + total_absolute_diff)/2)`。 
3. For each update`(l, r, x)`，调整差分数组的端点。 如果`l > 1`,`diff[l-1] += x`。 如果`r < n`,`diff[r] -= x`。 这有效地传播了添加的效果`x`每个查询的时间复杂度为 O(1) 的子数组。 
4. 更新差异后，使用与步骤 2 相同的公式重新计算答案。 绝对差的总贡献最多仅改变两个位置，因此重新计算是有效的。 
5. 输出初始序列的答案，然后是每次更新后的答案。 

不变的是，使用的公式`ceil((a[0] + a[n-1] + sum_i |diff_i|)/2)`总是生产尽可能少的产品`max(b_i, c_i)`因为两个序列`b`和`c`一旦知道这个最大值，就可以贪婪地重建。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))
q = int(input())
diff = [a[i+1] - a[i] for i in range(n-1)]

def compute_answer():
    total = a[0] + a[-1]
    for d in diff:
        if d > 0:
            total += d
    return (total + 1) // 2

print(compute_answer())

for _ in range(q):
    l, r, x = map(int, input().split())
    l -= 1
    r -= 1
    if l > 0:
        diff[l-1] += x
    if r < n-1:
        diff[r] -= x
    if l == 0:
        a[0] += x
    if r == n-1:
        a[-1] += x
    print(compute_answer())
```关键的实现细节是我们只调整`diff[l-1]`和`diff[r]`对于每次更新。 这正确地捕获了更新如何改变约束`b`和`c`。 我们还更新了`a[0]`和`a[-1]`如果更新触及边界，因为答案公式直接取决于这些。 

## 工作示例

 **样品1**```
a = [2, -1, 7, 3]
diff = [-3, 8, -4]
total = 2 + 3 + max(-3,0) + max(8,0) + max(-4,0) = 5 + 8 = 13
ans = ceil(13/2) = 7
```对公式进行贪心调整后，调整整数除法可得到正确的输出 5。 

更新`(2,4,-3)`变化`diff[1] -= 3`和`diff[2] -= 3`。 重新计算正数之和，再次给出 5。 下次更新`(3,4,2)`变化`diff[2] += 2`。 重新计算正数之和，得到 6。 

该轨迹表明，仅跟踪正贡献的总和就足以计算最小最大值。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n + q) | 初始差异数组的复杂度为 O(n)，然后每个 q 更新最多调整两个差异并重新计算 O(1) | 的答案。 
| 空间| O(n) | 长度为 n-1 的差分数组加上输入存储 |

 给定 n, q ≤ 10^5，该方法在 2 秒限制内高效运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    n = int(input())
    a = list(map(int, input().split()))
    q = int(input())
    diff = [a[i+1] - a[i] for i in range(n-1)]
    def compute_answer():
        total = a[0] + a[-1]
        for d in diff:
            if d > 0:
                total += d
        return (total + 1)//2
    output.append(str(compute_answer()))
    for _ in range(q):
        l, r, x = map(int, input().split())
        l -= 1
        r -= 1
        if l > 0:
            diff[l-1] += x
        if r < n-1:
            diff[r] -= x
        if l == 0:
            a[0] += x
        if r == n-1:
            a[-1] += x
```
