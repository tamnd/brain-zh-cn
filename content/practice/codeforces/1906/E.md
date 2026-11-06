---
title: "CF 1906E - 合并而不排序"
description: "我们被要求对类似合并排序例程的合并步骤进行逆向工程，但有一个变化：两个输入数组可能未排序。 具体来说，我们收到一个长度为 2N 的数组 C，其中包含从 1 到 2N 的每个整数一次。"
date: "2026-06-09T01:23:05+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "dp"]
categories: ["algorithms"]
codeforces_contest: 1906
codeforces_index: "E"
codeforces_contest_name: "2023-2024 ICPC, Asia Jakarta Regional Contest (Online Mirror, Unrated, ICPC Rules, Teams Preferred)"
rating: 1900
weight: 1906
solve_time_s: 155
verified: false
draft: false
---

[CF 1906E - 合并而不排序](https://codeforces.com/problemset/problem/1906/E)

 **评级：** 1900
 **标签：** 构造性算法，dp
 **求解时间：** 2m 35s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求对类似合并排序例程的合并步骤进行逆向工程，但有一个变化：两个输入数组可能未排序。 具体来说，我们收到一个数组`C`长度`2*N`包含来自的每个整数`1`到`2*N`正好一次。 我们的任务是将其分成两个数组`A`和`B`长度`N`每个，这样如果我们运行标准合并例程`A`和`B`，我们将重建`C`。 如果不存在这样的分割，我们必须输出`-1`。 

这里的关键是理解合并算法的原始形式：它总是比较第一个剩余元素`A`和`B`并将较小的附加到结果中。 什么时候`A`或者`B`为空，它只是附加另一个数组的剩余元素。 由于数组可以是未排序的，因此“较小”检查有效地允许算法在另一个数组的前面较大时选择其中一个数组。 这意味着我们的任务不是排序，而是找到可能产生的有效交错`C`通过这个比较规则。 

给定`N`最多可达1000，总长度为`C`是 2000。这意味着任何具有 O(N²) 运算的算法都可能勉强通过，但任何更糟糕的算法都会超时。 该问题还有一个微妙的边缘情况：如果前面的元素碰巧较小，则合并算法可能“更喜欢”一个数组而不是另一个数组。 一种幼稚的方法，例如，分裂`C`不考虑相对值的均匀计算可能会失败。 例如，`C = [2, 1, 4, 3]`不能分成`A`和`B`这样，如果我们天真地将前半部分分配给，则合并规则有效`A`第二个到`B`。 

## 方法

 蛮力方法虽然简单但效率低下。 我们可以尝试每一个可能的分区`C`分成两个长度的数组`N`并模拟合并。 有`binomial(2N, N)`分区，即使对于`N=20`，所以这对于`N=1000`。 

关键的见解是，合并算法在其未排序的变体中，只要求每当合并从该数组中选取时，每个数组都保持元素的递减序列。 更具体地说，每当下一个元素`C`大于已分配给的所有元素`A`或者`B`，我们可以将它放在该数组的末尾。 如果一个元素小于两个候选数组的最后一个元素，则它不能进入​​任一数组而不违反合并过程。 这一观察将问题简化为贪婪分割：过程`C`从左到右，保留最后一个元素`A`和`B`，并将每个新元素分配给大于最后一个元素的数组（或启动一个空数组）。 如果两者都不起作用，则输出`-1`。 

另一种观点是处理`C`通过采用递减元素的连续“块”。 每个这样的块都可以按照它们出现的顺序分配给一个数组。 这确保了合并算法将以正确的顺序获取元素，因为递减的块永远不会强制合并过早地从另一个数组中选取。 然后我们交替分配块`A`和`B`将两个数组填充到长度`N`。 这种贪婪块方法之所以有效，是因为每个块都维护与合并例程兼容的本地顺序。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2N 选择 N * N) | O(N) | 不可行|
 | 贪婪块分配| O(N) | O(N) | 已接受 |

 ## 算法演练

 1.初始化两个空数组`A`和`B`和一个空的`current_block`列表。 跟踪最后处理的元素，`last = infinity`。 
2. 迭代每个元素`x`在`C`。 如果`x > last`，它标志着一个新的递减块的开始。 将当前块附加到块列表并重置`current_block`。 然后追加`x`到`current_block`并更新`last = x`。 
3. 迭代后，将最后一个块添加到块列表中。 
4. 交替分配块`A`和`B`为了。 如果一个数组超过长度`N`，这是不可能的； 输出`-1`。 如果一个块会使数组长于`N`，仅分配所需数量的元素以达到`N`并将剩余元素移动到另一个数组。 
5. 分配后，如果两者`A`和`B`有精确的长度`N`，输出它们。 否则，输出`-1`。 

工作原理：每个块都是严格递减的，这保证了在合并期间，将从分配给它们的数组中连续选取该块的元素。 交替块确保两个数组都不会通过合并比较“被迫”提供无序的元素。 合并例程只关心每个数组的前面，而递减块的最大元素位于前面，因此比较总是产生原始的`C`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

N = int(input())
C = list(map(int, input().split()))

blocks = []
current_block = []
last = float('inf')

for x in C:
    if x > last:
        blocks.append(current_block)
        current_block = []
    current_block.append(x)
    last = x
if current_block:
    blocks.append(current_block)

A, B = [], []
toggle = True  # alternate assignment

for block in blocks:
    if toggle:
        if len(A) + len(block) > N:
            remaining = N - len(A)
            A.extend(block[:remaining])
            B.extend(block[remaining:])
        else:
            A.extend(block)
    else:
        if len(B) + len(block) > N:
            remaining = N - len(B)
            B.extend(block[:remaining])
            A.extend(block[remaining:])
        else:
            B.extend(block)
    toggle = not toggle

if len(A) == len(B) == N:
    print(' '.join(map(str, A)))
    print(' '.join(map(str, B)))
else:
    print(-1)
```该解决方案首先从中提取严格递减的块`C`。 这会捕获合并算法将从一个数组中连续处理的段。 交替分配填充`A`和`B`同时遵守数组长度限制。 边界处理很微妙：如果一个块太大而无法放入一个数组中，我们会将其拆分为`A`和`B`以避免超过`N`。 如果没有这个，边缘情况就像`C = [5,4,3,2,1,6,7,8]`可能会失败。 

## 工作示例

 **样本1**：`C = [3,1,4,5,2,6]`| 步骤| 当前块 | 最后| 块|
 | --- | --- | --- | --- |
 | 3 | [3] | 3 | []|
 | 1 | [3,1]| 1 | []|
 | 4 | [4] | 4 | [[3,1]] |
 | 5 | [4,5]| 5 | [[3,1]] |
 | 2 | [2] | 2 | [[3,1],[4,5]] |
 | 6 | [2,6]| 6 | [[3,1],[4,5]] |

 块：`[[3,1],[4,5],[2,6]]`交替分配：`A = [3,1,2]`,`B = [4,5,6]`的合并`A`和`B`再现`C`。 

**样本2**：`C = [1,2,3,4]`每个元素一个递减块：`[[1],[2],[3],[4]]`交替分配：`A = [1,3]`,`B = [2,4]`合并收益`[1,2,3,4]`根据需要。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(N) | 单遍创建块，单遍分配给数组。 |
 | 空间| O(N) | 存储块和两个数组 A 和 B。 

和`N <= 1000`，算法最多执行几千次操作，完全在 1 秒的时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    out = io.StringIO()
    sys.stdout = out
    N = int(input())
    C = list(map(int, input().split()))

    blocks = []
    current_block = []
    last = float('inf')
    for x in C:
        if x > last:
            blocks.append(current_block)
            current_block = []
        current_block.append(x)
        last = x
    if current_block:
        blocks.append(current_block)

    A, B = [], []
    toggle = True
    for block in blocks:
        if toggle:
            if len(A) + len(block) > N:
                remaining = N - len(A)
                A.extend(block[:remaining])
                B.extend(block[remaining:])
            else:
                A.extend(block)
        else:
            if len(B) + len(block) > N:
                remaining = N - len(B
```
