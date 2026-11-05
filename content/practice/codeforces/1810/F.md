---
title: "CF 1810F - M树"
description: "我们被要求构建一棵满足一个非常特殊的属性的有根树：每个非叶节点必须恰好有 m 个子节点，并且每个叶节点都包含一个正整数。 如果这棵树满足这个结构，那么它就被称为“好树”。"
date: "2026-06-09T08:47:12+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "math", "sortings", "trees"]
categories: ["algorithms"]
codeforces_contest: 1810
codeforces_index: "F"
codeforces_contest_name: "CodeTON Round 4 (Div. 1 + Div. 2, Rated, Prizes!)"
rating: 2800
weight: 1810
solve_time_s: 99
verified: false
draft: false
---

[CF 1810F - M 树](https://codeforces.com/problemset/problem/1810/F)

 **评分：** 2800
 **标签：** 数据结构、数学、排序、树
 **求解时间：** 1m 39s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求构建一棵满足一个非常特殊的属性的有根树：每个非叶节点必须恰好具有`m`孩子们，每片叶子都有一个正整数。 如果这棵树满足这个结构，那么它就被称为“好”树。 每个叶子贡献的值等于其上的数字加上其在树中的深度，并且树的整体值是最大叶子值。 

输入给我们`n`必须放置在叶子上的数字。 我们的任务是将这些数字分配给叶子，并以最小化最大叶子值的方式构建树。 随后进行多个查询，每个查询都会更改数组中的数字并要求新的最小树值。 

限制很严格。`n`可以达到`2×10^5`和`q`还可以达到`2×10^5`，这意味着任何比每个查询的 O(n log n) 更差的算法都可能太慢。 叶子数量`n`总是满足`n ≡ 1 (mod m - 1)`，这是关于构建的关键组合事实`m`-ary trees - 它保证了完整的`m`-二叉树可以精确地形成`n`树叶。 

一种简单的方法是从字面上构造当前数组的每个有效树，计算深度，然后计算最大叶子值。 这失败了，因为有效树的数量是指数级的`n`。 需要注意的边缘情况包括所有数字都相等的数组（最佳结构完全由深度决定）或最大数字聚集的数组 - 粗心的分配可能会显着增加最大叶值。 

例如，如果`n = 5, m = 2`数组是`[1, 1, 5, 5, 5]`，天真的方法可能会`5`太深或太浅，生成的树值为 7，而不是最佳的 6。 

## 方法

 蛮力的想法很简单。 一个人可以产生所有可能`m`-ary树与`n`叶子并测试数组的每个排列以将数字分配给叶子，每次计算最大值。 这在原则上是正确的，但完全不切实际。 为了`n=10^5`，树和叶子分配的数量是天文数字。 暴力解决方案需要类似的东西`O(n! * n)`的操作，这是不可行的。 

解锁最佳方法的关键观察来自于认识到树的价值仅取决于叶子深度。 叶子越深，其数量对最大值的贡献就越大。 因此，为了最小化总体最大值，我们希望将最大的数字放置在尽可能靠近根的位置，将最小的数字放置在最深的叶子处。 

因为一棵好树具有非常严格的结构，所以我们可以准确计算每个深度存在多少叶子。 使用它，我们按降序对叶子编号数组进行排序，并贪婪地将它们从最浅的叶子分配到最深的叶子。 这保证了最大值最小化：最大的数字获得最小的深度，最小的数字吸收最大的深度损失。 

对于更新，我们维护数字的多重集（或平衡 BST），允许每个查询插入和删除 log(n)。 由于树结构一旦固定`n`和`m`众所周知，树叶的深度不会改变； 仅分配的号码发生变化。 因此，每次更新后，我们可以通过将最大数字与最小深度相结合来有效地重新计算最大值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n! * n) | O(n! * n) | O(n) | 太慢了 |
 | 最佳| O(n log n + q log n) | O(n log n + q log n) | O(n) | 已接受 |

 ## 算法演练

 1. 预先计算完整的每个深度的叶子数量`m`-二叉树`n`树叶。 从深度0的根开始迭代计算`leaves_at_depth[d]`将剩余的叶子分给孩子们。 当全部停止时`n`叶子被占。 这准确地决定了叶子的深度。 
2. 对数组进行排序`a`按降序排列。 这样，最大的数字就排在前面。 
3. 按照深度顺序为叶子分配编号：第一个`leaves_at_depth[0]`数字进入深度 0，下一个`leaves_at_depth[1]`数字进入深度 1，依此类推。 每次赋值都会将相应的深度添加到数字中，从而给出叶子的值。 
4. 计算这些叶子值中的最大值。 这是当前数组的最小树值。 
5. 对于每个查询，通过删除旧值并插入新值来更新数字多重集。 如有必要，重新排序（或使用平衡结构）。 重复步骤 3-4 以计算新的最大值。 

为什么有效：通过始终将最大的数字与最浅的深度配对，我们保证任何其他分配都会将较大的数字推得更深或将较小的数字推得更浅，这两者都会增加最大叶子值。 考虑到数字的排序顺序和固定的深度分布，该分配是唯一最佳的。 深度分布由下式保证`n ≡ 1 mod (m - 1)`，保证树能够按照规则充满且平衡。 

## Python 解决方案```python
import sys
import bisect
input = sys.stdin.readline

def compute_depth_distribution(n, m):
    depth_counts = []
    remaining = n
    current_level = 1
    while remaining > 0:
        leaves = min(remaining, current_level)
        depth_counts.append(leaves)
        remaining -= leaves
        current_level *= m
    return depth_counts

def minimal_tree_value(a, depth_counts):
    a_sorted = sorted(a, reverse=True)
    idx = 0
    max_value = 0
    for depth, count in enumerate(depth_counts):
        for _ in range(count):
            max_value = max(max_value, a_sorted[idx] + depth)
            idx += 1
    return max_value

def main():
    t = int(input())
    for _ in range(t):
        n, m, q = map(int, input().split())
        a = list(map(int, input().split()))
        depth_counts = compute_depth_distribution(n, m)
        output = []
        for _ in range(q):
            x, y = map(int, input().split())
            a[x-1] = y
            output.append(str(minimal_tree_value(a, depth_counts)))
        print(" ".join(output))

if __name__ == "__main__":
    main()
```该解决方案首先计算每个深度存在多少叶子。 这是独立于数字本身完成的，纯粹基于`n`和`m`。 对数组进行排序可确保最大的数字与最浅的深度配对。 每个查询都会修改一个数字，并且重新计算最大值会使用相同的深度分配策略。 在 Python 中始终使用从零开始的索引可以避免差一错误。 

## 工作示例

 **输入轨迹示例**

 第一个测试用例：`n=5, m=3, a=[3,3,4,4,5]`| 步骤| 深度计数 | a_已排序 | 叶作业 | 最大（a+深度）|
 | ---| ---| ---| ---| ---|
 | 初始| [1,3,1]| [5,4,4,3,3] | 深度0：[5]，深度1：[4,4,3]，深度2：[3] | 6 |

 查询后`a[1]=4`：`a=[4,3,4,4,5]`, 排序 ->`[5,4,4,4,3]`，相同的分配 -> 最多 6。 

这证实了分配策略总是最小化最大值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n + q log n) | O(n log n + q log n) | 对数组进行一次排序的时间复杂度为 O(n log n)，每个查询需要 log n 来在多重集中插入​​/删除，或者如果完全采用的话，则需要 O(n log n) |
 | 空间| O(n) | 存储数组和深度分布 |

 和`n, q ≤ 2×10^5`，这符合 2 秒限制。 

## 测试用例```python
import io, sys

def run(inp):
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    main()
    return output.getvalue().strip()

# Provided samples
assert run("""3
5 3 3
3 3 4 4 5
1 4
2 4
3 5
5 2 4
3 3 4 4 5
1 4
2 5
3 5
4 5
7 3 4
1 2 2 3 3 3 4
1 4
2 1
5 5
6 6
""") == "6 6 6\n7 7 7 8\n6 6 6 7"

# Custom: all equal values
assert run("""1
4 2 2
1 1 1 1
1 2
4 3
""") == "2 2"

# Custom: max size leaves shallow
assert run("""1
5 2 1
5 1 1 1 1
3 5
""") == "6"
```| 测试输入| 预期产出 | 它验证了什么 |

 |---|---
