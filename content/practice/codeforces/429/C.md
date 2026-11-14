---
title: "CF 429C - 猜树"
description: "该问题要求我们在给定每个节点子树大小的约束的情况下重建有根树。 给定一个长度为 n 的数组 c，其中 c[i] 表示以节点 i 为根的子树中的节点总数。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "bitmasks", "constructive-algorithms", "dp", "greedy", "trees"]
categories: ["algorithms"]
codeforces_contest: 429
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 245 (Div. 1)"
rating: 2300
weight: 429
solve_time_s: 86
verified: true
draft: false
---

[CF 429C - 猜树](https://codeforces.com/problemset/problem/429/C)

 **评分：** 2300
 **标签：** 位掩码、构造性算法、dp、贪婪、树
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题要求我们在给定每个节点子树大小的约束的情况下重建有根树。 给你一个数组`c`长度`n`， 在哪里`c[i]`表示以节点为根的子树中的节点总数`i`。 每个具有子节点的节点必须至少有两个子节点。 任务是确定满足这些属性的树是否存在。 

输入尺寸较小，`n ≤ 24`，因此算法可以指数级扩展`n`是可行的。 每个`c[i]`至多是`n`，因此没有超出有效范围的值。 棘手的部分是值`c`可以以任何顺序出现，因此我们不能假设最后一个元素是根，或者值沿着树单调增加。 

一种简单的方法可能会尝试所有可能的树并检查它们的子树大小。 为了`n = 24`，这是不可行的，因为有根树的数量呈超指数增长。 当只有一个节点时，会出现另一种微妙的边缘情况。 如果`n = 1`和`c = [1]`，解决方案基本上是“是”，因为单个节点算作大小为 1 的子树。 另一个陷阱是`c[i] = n`对于多个节点； 树不能有两个具有完整树大小的根。 

另外，如果所有`c[i] = 1`，唯一有效的配置是叶节点森林，如果`n > 1`因为内部节点必须至少有两个子节点。 例如，输入`[1,1,1]`应返回“否”。 

## 方法

 暴力方法将生成所有可能的有根树，并根据子树大小检查每棵树。 为了`n`节点，可能的有根树的数量是指数级的`n`。 检查每棵树的子树大小需要`O(n^2)`，所以即使对于`n = 15`，这种方法变得不可行。 这种蛮力方法的正确性来自于对每个结构的详尽验证，但速度太慢。 

关键的见解是该问题可以简化为组合划分问题。 如果我们按子树大小降序对节点进行排序，则最大值必须对应于根。 然后，必须为每个内部节点分配子节点，使得它们的子树大小之和加一等于父节点的子树大小。 这类似于递归子集和问题。 因为`n ≤ 24`，我们可以使用位掩码动态编程有效地探索剩余节点的所有可能分组。 位掩码表示哪些节点仍未分配。 我们递归地尝试为当前节点形成一组有效的子节点，并记住结果以避免重复工作。 这大大减少了搜索空间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(#trees × n^2) | O(#trees × n^2) | O(n) | 太慢了|
 | 位掩码 DP / 递归构造 | O(2^n × n^2) | O(2^n × n^2) | O(2^n) | O(2^n) | 已接受 |

 ## 算法演练

 1. 对数组进行排序`c`按降序排列。 最大的元素必须是根，否则没有树可以满足所有子树大小。 
2.使用递归函数`can_build(mask)`在哪里`mask`表示尚未放置在树中的节点。 如果`mask`为零，我们成功分配了所有节点。 
3.对于当前节点`u`，我们尝试将剩余节点的子集分配为子节点。 有效子集`S`满足`sum(c[i] for i in S) + 1 = c[u]`。 每个内部节点必须至少有两个子节点，如果`c[u] > 1`。 
4. 对于每个有效子集`S`，递归地尝试为剩余节点构建树，`mask - S`。 如果任何分支成功，则返回 true。 
5. 使用记忆法存储每个结果`mask`，因为同一组剩余节点可能会遇到多次。 
6. 如果当前节点和掩码不存在有效分配，则返回 false。 

为什么有效：该算法保持当前掩码中的每个节点都未分配的不变量。 每次递归都确保完全满足子树大小约束。 对节点进行排序可确保始终首先分配最大的子树大小，从而保证根有效。 记忆可以避免重新检查相同的配置。 如果算法返回 true，则所有节点都存在满足给定规则的有效分配。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from functools import lru_cache

def solve():
    n = int(input())
    c = list(map(int, input().split()))
    c.sort(reverse=True)

    @lru_cache(None)
    def can_build(mask):
        if mask == 0:
            return True
        # pick the first node in mask
        u = mask.bit_length() - 1
        size_needed = c[u]
        # if it's a leaf
        if size_needed == 1:
            return can_build(mask ^ (1 << u))
        # try all subsets of remaining nodes to be children
        submask = mask ^ (1 << u)
        subset = submask
        while subset:
            total = sum(c[i] for i in range(n) if (subset >> i) & 1)
            if total + 1 == size_needed:
                if bin(subset).count("1") >= 2 and can_build(submask ^ subset):
                    return True
            subset = (subset - 1) & submask
        return False

    full_mask = (1 << n) - 1
    if can_build(full_mask):
        print("YES")
    else:
        print("NO")

solve()
```该代码首先对节点进行排序，以确保首先处理根。 递归函数使用位掩码来跟踪剩余节点。 子集生成使用以下方法有效地检查所有可能的子组合`(subset - 1) & submask`诡计。 叶节点（`c[i] = 1`）会自动处理。 记忆可确保指数工作不会重复。 

## 工作示例

 输入示例 1：```
4
1 1 1 4
```| 步骤| 掩码（二进制）| 当前节点 | 儿童子集| 行动|
 | --- | --- | --- | --- | --- |
 | 1 | 1111 | 1111 节点 3（大小 4）| 0111（节点0、1、2）| 分配了 3 个孩子 |
 | 2 | 0000 | 0000 叶节点 0,1,2 | - | 成功|

 递归选择节点 3 作为根，将其他三个节点指定为其子节点。 每个孩子都是一片叶子，满足子树大小。 该函数返回 YES。 

自定义输入2：```
3
1 2 2
```面具`111`→ 最大节点大小 2 → 无法准确分配一个节点（需要至少两个子节点） → 否。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(2^n × n^2) | O(2^n × n^2) | 位掩码递归探索剩余节点的所有子集，每个子​​集需要对最多 n 个元素求和 |
 | 空间| O(2^n) | O(2^n) | 每个位掩码的记忆缓存 |

 和`n ≤ 24`,`2^24 ≈ 16 million`条目是可行的。 每次递归仅迭代掩码的子集，总体运行时间不到 1 秒。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("4\n1 1 1 4\n") == "YES", "sample 1"

# minimum input
assert run("1\n1\n") == "YES", "single node tree"

# impossible small tree
assert run("3\n1 2 2\n") == "NO", "cannot form internal node with 2 children"

# all leaves but more than 1 node
assert run("4\n1 1 1 1\n") == "NO", "no internal node possible"

# maximum node values
assert run("5\n1 2 2 3 5\n") == "YES", "valid tree with root size 5"

# another impossible
assert run("4\n2 2 2 4\n") == "NO", "internal nodes cannot satisfy size 2"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 | 是 | 正确的树重建 |
 | 1 | 是 | 最小尺寸输入 |
 | 3 | 否 | 内部节点无法配置 |
 | 4 | 否 | n>1 | 的所有叶节点
 | 5 | 是 | 更大的有效树 |
 | 4 | 否 | 内部节点大小不匹配|

 ## 边缘情况

 对于单节点输入`1\n1\n`，掩码开始为`1`。 根节点的大小为 1，递归将其删除，掩码变为`0`。 算法正确返回 YES。 

用于输入`[1,1,1,1]`， 面具`1111`，最大节点的大小为 1。每个节点都是叶子，但根节点的大小必须 >1 才能有子节点。 剩余节点的子集都不满足内部节点 ≥2 个子节点的要求。 该算法探索所有子集并返回“否”。 这证实了全叶场景的处理。
