---
title: "CF 224B - 阵列"
description: "我们得到一个整数数组和一个数字 k。 任务是找到一个连续的子数组或段，使其恰好包含 k 个不同的整数。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 224
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 138 (Div. 2)"
rating: 1500
weight: 224
solve_time_s: 62
verified: true
draft: false
---

[CF 224B - 数组](https://codeforces.com/problemset/problem/224/B)

 **评分：** 1500
 **标签：** 位掩码、实现、两个指针
 **求解时间：** 1m 2s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组和一个数字_k_。 任务是找到一个连续的子数组或段，使其恰好包含 _k_ 个不同的整数。 在满足此条件的所有段中，我们被要求找到一个**包含性最小**的段，这意味着我们无法从段的开头或结尾删除元素而不违反具有恰好_k_个不同整数的要求。 如果不存在这样的段，我们应该返回`-1 -1`。 

该数组最多可以有 10^5 个元素，每个元素值也可以大到 10^5。 因为 _n_ 是 10^5 并且时间限制是 2 秒，所以任何显式检查所有可能子数组的解决方案都将花费 O(n^2) 时间，这太慢了。 这迫使我们考虑线性或近线性方法。 边缘情况包括所有元素相同的数组、_k_ 大于不同元素数量的数组以及最小段出现在边界处的数组。 

例如，如果数组是`[1, 2, 2, 3]`且 _k_ = 2，该段`[1, 2]`是有效且最小的，因为`[1, 2]`恰好包含两个不同的数字，并且任何较短的子段都将包含少于 2 个不同的数字。 如果 _k_ = 4，输出应该是`-1 -1`因为数组只包含 3 个不同的数字。 

## 方法

 蛮力方法会考虑每一个可能的部分`[l, r]`在数组中，计算该段中的不同元素，并检查它是否等于 _k_。 可以使用集合来计算不同元素的数量。 这种方法原则上是正确的，但如果我们每次重建集合，在最坏的情况下，检查所有 O(n^2) 段并计算每个段中不同元素的集合可能会花费 O(n^3) 的时间。 即使我们使用运行集，所有段的总工作量仍然是 O(n^2)，这对于 n = 10^5 来说太慢了。 

关键的观察是，我们可以维护一个增长或缩小的**滑动窗口**，同时跟踪不同元素的计数。 如果我们使用频率字典来跟踪每个数字在当前窗口中出现的次数，我们可以有效地在右侧添加元素并从左侧删除元素，从而在每次操作的 O(1) 中更新不同数字的计数。 这使我们能够在 **O(n)** 时间内找到有效的段，因为每个元素最多添加和删除一次。 

使滑动窗口成为可能的见解是，对子数组上的不同元素进行计数的问题具有**单调性**：向右扩展窗口只能增加不同元素的数量，而从左侧缩小窗口只能减少不同元素的数量。 这个属性保证我们可以移动两个指针而不会丢失任何最小包含段。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了 |
 | 滑动窗口/两个指针| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.初始化两个指针`l`和`r`0处，代表当前段`[l, r)`。 初始化字典`count`跟踪当前段中每个数字的频率，以及一个变量`distinct`跟踪不同元素的数量。 
2. 向右移动指针`r`循环前进，直到达到不同元素的数量`[l, r]`达到或超过_k_。 对于每个元素`a[r]`，增加其频率`count`。 如果该元素第一次出现，则递增`distinct`。 
3.一次`distinct`等于_k_，检查该段是否`[l, r]`通过包含是最小的。 而最左边的元素`a[l]`频率大于 1，减少其频率并移动`l`向右。 这可确保段的开头不会保留不必要的元素。 
4. 如果`distinct`收缩后等于*k`，记录该段作为有效答案。 我们可以立即返回，因为稍后找到的任何进一步的有效段都不会更小； 我们只需要**一个**最小包含段。 
5. 如果循环结束并且`distinct`永远不会达到_k_，输出`-1 -1`。 

### 为什么它有效

 不变的是滑动窗口`[l, r)`始终包含最多 _k_ 个不同的数字。 移动右指针会扩大窗口，可能会增加`distinct`。 从左侧收缩可确保包含最少的内容。 每个元素最多进入和退出窗口一次，保证了 O(n) 复杂度，并且频率字典确保我们有效地保持准确的不同计数。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def find_segment(n, k, a):
    count = {}
    distinct = 0
    l = 0
    for r in range(n):
        if a[r] not in count:
            count[a[r]] = 0
        count[a[r]] += 1
        if count[a[r]] == 1:
            distinct += 1
        
        while distinct > k:
            count[a[l]] -= 1
            if count[a[l]] == 0:
                distinct -= 1
            l += 1
        
        if distinct == k:
            # shrink from left to make it minimal by inclusion
            while count[a[l]] > 1:
                count[a[l]] -= 1
                l += 1
            return l + 1, r + 1  # converting to 1-based index
    return -1, -1

def main():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    l, r = find_segment(n, k, a)
    print(l, r)

if __name__ == "__main__":
    main()
```该代码维护一个频率字典`count`跟踪当前窗口中的元素。 每次添加或删除都会更新非重复计数。 缩小左指针可确保通过包含将段最小化。 一个微妙的点是将索引转换为基于 1 的输出，这就是为什么`l + 1`和`r + 1`被退回。 

## 工作示例

 ### 示例 1

 输入：`[1, 2, 2, 3]`, k = 2

 | 我| r | 独特| 计数| 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 1 | {1:1} | 添加 1 |
 | 0 | 1 | 2 | {1:1,2:1} | 加 2，不同 == k |
 | 0 | 1 | 2 | {1:1,2:1} | 向左缩？ 1 计数=1 |
 | 0 | 1 | 2 | {1:1,2:1} | 找到最小段|

 输出：`1 2`This trace confirms that the algorithm correctly finds the minimal-by-inclusion segment starting at index 1 and ending at index 2.

 ### 示例 2

 输入：`[1, 1, 1, 1]`, k = 2

 | 我| r | 独特| 计数| 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 1 | {1:1} | 添加 1 |
 | 0 | 1 | 1 | {1:2} | 添加 1 |
 | 0 | 2 | 1 | {1:3} | 添加 1 |
 | 0 | 3 | 1 | {1:4} | 添加 1 |

 不同的永远不会达到 k。 输出：`-1 -1`。 

这演示了如何处理不同元素少于 k 的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个元素最多在窗口中添加和删除一次，总共 O(n) 次操作 |
 | 空间| O(n) | 在最坏的情况下，count 字典最多可以包含 n 个不同的元素 |

 该解决方案完全符合 2 秒限制和 256 MB 内存。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline
    
    def find_segment(n, k, a):
        count = {}
        distinct = 0
        l = 0
        for r in range(n):
            if a[r] not in count:
                count[a[r]] = 0
            count[a[r]] += 1
            if count[a[r]] == 1:
                distinct += 1
            while distinct > k:
                count[a[l]] -= 1
                if count[a[l]] == 0:
                    distinct -= 1
                l += 1
            if distinct == k:
                while count[a[l]] > 1:
                    count[a[l]] -= 1
                    l += 1
                return f"{l+1} {r+1}"
        return "-1 -1"
    
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    return find_segment(n, k, a)

# provided samples
assert run("4 2\n
```
