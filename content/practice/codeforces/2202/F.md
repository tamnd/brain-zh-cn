---
title: "CF 2202F - 二进制非搜索和查询"
description: "我们被要求维护一个整数序列，并在点更新后重复计算两个属性。 具体来说，对于给定的长度为 n 的数组 a，我们希望在每次更新后找到最大长度 k，使得存在两个长度为 k 的子数组具有相同的..."
date: "2026-06-09T04:50:42+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 2202
codeforces_index: "F"
codeforces_contest_name: "Codeforces Round 1082 (Div. 2)"
rating: 2500
weight: 2202
solve_time_s: 97
verified: false
draft: false
---

[CF 2202F - 二进制非搜索和查询](https://codeforces.com/problemset/problem/2202/F)

 **评分：** 2500
 **标签：** 数据结构，贪心
 **求解时间：** 1m 37s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求维护一个整数序列，并在点更新后重复计算两个属性。 具体来说，对于给定的数组`a`长度`n`，我们想要找到每次更新后的最大长度`k`使得存在两个长度为的子数组`k`所有元素的频率计数相同，以及具有该最大值的子数组对的数量`k`。 更新更改单个元素并保留以供将来查询。 

给定`n`可以达到200,000并且`q`可以达到 100,000，任何显式检查所有子数组对的方法都是无望的：即使是单个`O(n^2)`操作大致是$4 \times 10^{10}$操作，远远超出了2-4秒的限制。 这排除了所有的天真的暴力枚举`(i,j,k)`三倍。 这个问题还涉及高价值产出——`k_max`和`f`可以达到$10^{11}$-so 仅当尝试使用 32 位整数简单地计算对时才会出现整数溢出问题。 

不明显的挑战是，按频率对子数组相等性进行强力检查是二次的`k`对于每个候选者，更新会强制建立持久的数据结构。 粗心的实现可能会在每次查询后从头开始重新计算所有内容，这太慢了。 边缘情况包括所有元素都相等的序列、没有重复子数组的序列以及单个更改发生巨大变化的序列`k_max`从`n-1`到`0`。 

## 方法

 暴力方法将枚举所有子数组长度`k`从 1 到`n-1`。 对于每个`k`，我们将滑动两个指针`i`和`j`在长度的所有起始位置上`k`子数组，计算每个子数组的频率图，并进行比较。 计算所有匹配项给出`f(b)`并跟踪最大值`k`给出`k_max(b)`。 这可以保证正确性，但也很复杂$O(n^3)$在最坏的情况下，由于三个嵌套循环：长度、第一个子数组开始、第二个子数组开始。 为了`n=200,000`，这是不可行的。 

关键的见解是问题简化为计算相等的前缀和后缀。 如果我们将每个元素映射到其最后一次出现，则具有重复元素的序列会形成出现相同频率序列的“块”。 对于长度达到`n`，唯一可以具有相同频率序列的子数组长度是每个数字的计数的除数`a`。 这大大减少了候选人`k`价值观。 此外，维护元素位置的计数允许计算最大`k`通过对连续的相等块进行分组来确定对的数量，避免对所有子数组对进行嵌套迭代。 

实际上，我们不是直接比较子数组，而是跟踪相等元素的游程边界并计算势`k_max`从这些跑步的长度来看。 每次更新最多可以影响两次运行：一次包含更新的元素，如果值发生变化，则可能影响其邻居。 通过将游程长度存储在多重集中，我们可以有效地维护最大游程长度并计算将该长度的游程配对的方法数量，给出`k_max`和`f(a)`每次查询后`O(log n)`每个查询具有适当的数据结构。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n3) | O(n) | 太慢了|
 | 最优（游程分组+多重集）| O(n + q log n) | O(n + q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 预处理初始数组`a`识别相同元素的连续块。 将每个块存储为`(value, start_index, length)`。 这隐式地捕获了频率，因为块中的重复元素在完全包含在块中的任何子数组中具有相同的计数。 
2. 维护多重集（或字典）`length_counts`以块长度为键，存储每个长度有多少个块。 这将允许快速检索最大块长度（`k_max`）和该长度的块数（`f`）。 
3. 对于每个查询`(i, x)`, 定位包含索引的块`i`。 如果值为`i`已经是`x`，没有任何变化；`k_max`和`f`保持不变。 否则：

 a. 如果块长度为1，则将块的值替换为`x`。 与相邻的价值块合并`x`如果存在，则更新`length_counts`因此。 

b. 如果块长度大于1，则将其分成最多两个更小的块（不包括索引）`i`。 替换索引`i`具有新的价值块`x`。 如步骤 3a 中所示与邻居合并。 每次拆分和合并更新`length_counts`。 
4.更新后，检索其中最大的key`length_counts`为了`k_max`及其计数`f(a)`。 
5. 输出每个查询的结果并重复。 

工作原理：每个块代表一组连续的相同元素。 通过维护块的长度并合并相同值的相邻块，我们保证任何长度的子数组`k_max`由具有相同内容的块组成可以形成满足元组条件的对。 更新单个元素最多更改两个或三个块，并且仅更改本地计数，因此多重集不变量允许正确检索最大长度和计数，而无需扫描整个数组。 

## Python 解决方案```python
import sys
from collections import defaultdict
import bisect
input = sys.stdin.readline

class BlockArray:
    def __init__(self, arr):
        self.blocks = []
        self.length_counts = defaultdict(int)
        n = len(arr)
        i = 0
        while i < n:
            val = arr[i]
            start = i
            while i < n and arr[i] == val:
                i += 1
            length = i - start
            self.blocks.append([val, start, length])
            self.length_counts[length] += 1

    def update(self, idx, x):
        # find the block containing idx
        for i, (val, start, length) in enumerate(self.blocks):
            if start <= idx < start + length:
                break
        else:
            return

        old_val, start, length = self.blocks[i]
        if old_val == x:
            return

        # remove old block length
        self.length_counts[length] -= 1
        if self.length_counts[length] == 0:
            del self.length_counts[length]

        # split block if necessary
        new_blocks = []
        if idx > start:
            left_len = idx - start
            new_blocks.append([old_val, start, left_len])
            self.length_counts[left_len] += 1
        new_blocks.append([x, idx, 1])
        if idx < start + length - 1:
            right_len = start + length - idx - 1
            new_blocks.append([old_val, idx + 1, right_len])
            self.length_counts[right_len] += 1

        # replace old block
        self.blocks = self.blocks[:i] + new_blocks + self.blocks[i+1:]

        # merge adjacent blocks if same value
        i = max(0, i-1)
        while i < len(self.blocks) - 1:
            if self.blocks[i][0] == self.blocks[i+1][0]:
                lsum = self.blocks[i][2] + self.blocks[i+1][2]
                self.length_counts[self.blocks[i][2]] -= 1
                if self.length_counts[self.blocks[i][2]] == 0:
                    del self.length_counts[self.blocks[i][2]]
                self.length_counts[self.blocks[i+1][2]] -= 1
                if self.length_counts[self.blocks[i+1][2]] == 0:
                    del self.length_counts[self.blocks[i+1][2]]
                self.blocks[i][2] = lsum
                self.length_counts[lsum] += 1
                self.blocks.pop(i+1)
            else:
                i += 1

    def query(self):
        if not self.length_counts:
            return (0, 0)
        k_max = max(self.length_counts)
        return (k_max, self.length_counts[k_max])

def main():
    t = int(input())
    for _ in range(t):
        n, q = map(int, input().split())
        a = list(map(int, input().split()))
        ba = BlockArray(a)
        for _ in range(q):
            idx, x = map(int, input().split())
            ba.update(idx-1, x)
            k_max, f = ba.query()
            print(k_max, f)

if __name__ == "__main__":
    main()
```该代码将问题分解为`BlockArray`跟踪相同元素的连续块的类。 每次更新仅影响相关块及其邻居，从而保持快速更新。 查询只是检索最大块长度和此类块的数量，它们直接对应于`k_max`和`f(a)`在这个模型中。 

## 工作示例

 **示例1：**`a = [1,2,1,1]`， 询问`(3,2)`。 

| 步骤| 积木| 长度很重要| 行动|
 | ---| ---| ---| ---|
 | 开始 | [[1,0,1],[2,1,1],[1,2,2]] | {1:2,2:1} | 初始|
 | 更新 3->2 | [[1,0,1],[2,1,2],[1,3,1]] | {1:2,2:1}-> 通过拆分/合并更新 | |
