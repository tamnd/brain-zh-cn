---
title: "CF 2197B - 数组和排列"
description: "我们给出一个长度为 n 的排列 p 和一个相同长度的数组 a。 排列是按某种顺序从 1 到 n 的不同整数组成的数组。"
date: "2026-06-09T04:44:06+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "schedules", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 2197
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 1079 (Div. 2)"
rating: 1100
weight: 2197
solve_time_s: 81
verified: true
draft: false
---

[CF 2197B - 数组和排列](https://codeforces.com/problemset/problem/2197/B)

 **评分：** 1100
 **标签：** 实施、时间表、排序、两个指针
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给出了一个排列`p`长度`n`和一个数组`a`相同长度的。 排列是来自不同整数的数组`1`到`n`，按某种顺序。 我们想要确定是否`a`可能是由`p`使用一系列操作，在每个操作中我们选择两个相邻元素`p`并将其中一个的值复制到另一个中。 也就是说，对于任何相邻的对`(p[i], p[i+1])`，我们可以设置`p[i] = p[i+1]`或者`p[i+1] = p[i]`。 

关键是这些操作只能**将现有号码传播给邻居**，而永远不会引入新号码。 因此，每一个出现的数字`a`一定存在于某个位置`p`。 此外，一旦一个数字被引入到一个位置，它就可以向左或向右“扩展”以覆盖其他数字，因此相同数字的连续块`a`由单个原始事件生成`p`。 

约束条件是这样的`n`可以达到`2 * 10^5`，以及总和`n`所有测试用例不超过`2 * 10^5`。 这排除了每个测试用例的线性复杂度更差的任何解决方案。 复制操作的暴力模拟将是二次的`n`最坏的情况下会超时。 

微妙的边缘情况包括所有元素都相等的数组、数字重复但不连续的数组`a`，以及最后一个或第一个元素需要从远处传播的数组。 例如，`p = [1, 2, 3]`和`a = [2, 2, 2]`是不可能的，因为数量`2`如果最初不存在，则无法传播到第一个位置。 

## 方法

 一种简单的方法是直接模拟操作：迭代`p`，并且对于每个不匹配`a`，执行复制操作，直到匹配为止。 原则上这是可行的，因为这些操作允许将数字分散到相邻位置，但在最坏的情况下，需要 O(n^2) 操作。 例如，如果`p`是`[1,2,3,...,n]`和`a`是`[1]*n`，我们会一一重复地覆盖元素。 和`n`最多 2 * 10^5，这太慢了。 

最佳方法的关键观察是**一旦某个数字存在于`p`，它可以通过连续的段传播**。 因此，我们只需要检查其中的数字序列是否`a`可以通过扩大存在的数量来形成`p`为了。 具体来说，我们遍历`a`从左到右，并保持一个指针`p`代表新号码的第一个可用位置。 如果`a[i]`与当前数字匹配`p`，我们推进指针。 如果`a[i]`重复前面的数字`a`，我们继续。 如果`a[i]`与前一个号码或下一个可用号码不匹配`p`，该数组是不可能的。 

这将问题减少到一次通过`a`同时维护一个指针`p`，给出每个测试用例的线性 O(n) 解。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取排列`p`和数组`a`。 初始化一个指针`j = 0`为了`p`。 
2.遍历数组`a`从左到右。 让`prev`将前一个元素存储在`a`，初始设置为`None`。 
3. 对于每个元素`a[i]`，如果它等于`prev`， 继续。 这意味着我们处于一个连续的块中，并且没有新的数字`p`是需要的。 
4. 如果`a[i]`不等于`prev`，我们尝试在其中找到它`p`从索引开始`j`。 如果`p[j]`等于`a[i]`, 增量`j`并更新`prev`到`a[i]`。 
5.如果`a[i]`不等于`prev`并且不匹配`p[j]`，数组`a`不能从生成`p`。 输出`NO`。 
6. 如果我们到达终点`a`没有冲突，输出`YES`。 

为什么它起作用：指针`j`确保我们只使用其中的每个元素`p`曾经作为新号码的来源。 重复数的传播`a`通过比较来处理`prev`。 如果一个数在`a`无法与下一个可用号码匹配`p`并且不是重复，这意味着任何合法的复制操作序列都不能产生它，从而保证了正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    n = int(input())
    p = list(map(int, input().split()))
    a = list(map(int, input().split()))
    
    j = 0
    prev = None
    possible = True
    
    for num in a:
        if num == prev:
            continue
        while j < n and p[j] != num:
            j += 1
        if j == n:
            possible = False
            break
        prev = num
        j += 1
    
    print("YES" if possible else "NO")
```该解决方案可以有效地读取多个测试用例的输入。 指针`j`前进通过`p`仅当新号码进入`a`遇到，确保每个元素`p`最多使用一次。 中重复的数字`a`由处理`prev`，所以我们不会消耗新元素`p`不必要的。 这`while`循环保证我们跳过中的数字`p`已经通过并且不能贡献于当前的数字`a`。 

## 工作示例

 考虑第一个样本输入：```
p = [1,2,3], a = [1,2,2]
```| 我| 一个[我] | 上一页 | j | 行动|
 | --- | --- | --- | --- | --- |
 | 0 | 1 | 无 | 0 | p[0] = 1，匹配 a[0]，prev = 1，j = 1 |
 | 1 | 2 | 1 | 1 | p[1] = 2，匹配 a[1]，prev = 2，j = 2 |
 | 2 | 2 | 2 | 2 | 匹配上一个，继续 |

 输出为“是”。 跟踪显示重复的数字在没有前进的情况下传播`p`。 

第二个样本：```
p = [3,1,2,4], a = [3,4,2,2]
```| 我| 一个[我] | 上一页 | j | 行动|
 | --- | --- | --- | --- | --- |
 | 0 | 3 | 无 | 0 | p[0] = 3，匹配 a[0]，prev = 3，j = 1 |
 | 1 | 4 | 3 | 1 | p[1] = 1，跳过 -> j=2，p[2]=2 !=4，j=3，p[3]=4 匹配，prev=4，j=4 |
 | 2 | 2 | 4 | 4 | j == n，无法匹配 a[2]，中断 |

 输出为“否”。 这证实了算法正确地检测到了不可能的传播。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 中的每个元素`a`处理一次，指针`j`在`p`只往前走|
 | 空间| O(n) | 储存`p`和`a`数组|

 总和为`n`在以 2 * 10^5 为界的所有测试用例中，该解决方案完全符合 2 秒的时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    # solution function
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))
        a = list(map(int, input().split()))
        
        j = 0
        prev = None
        possible = True
        
        for num in a:
            if num == prev:
                continue
            while j < n and p[j] != num:
                j += 1
            if j == n:
                possible = False
                break
            prev = num
            j += 1
        
        print("YES" if possible else "NO")
    
    sys.stdout = sys.__stdout__
    return output.getvalue().strip()

# Provided samples
assert run("6\n3\n1 2 3\n1 2 2\n4\n3 1 2 4\n3 4 2 2\n5\n1 3 2 5 4\n3 3 3 5 4\n7\n3 7 4 2 1 6 5\n3 3 4 4 5 6 5\n7\n1 2 3 4 5 6 7\n
```
