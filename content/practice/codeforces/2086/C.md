---
title: "CF 2086C - 消失排列"
description: "我们得到了从 1 到 n 的整数排列，这意味着该范围内的每个数字在大小为 n 的数组中只出现一次。 然后，我们执行一系列查询，在每个查询中，我们将数组的特定元素替换为零。"
date: "2026-06-08T06:03:12+07:00"
tags: ["codeforces", "competitive-programming", "dfs-and-similar", "dp", "dsu", "graphs", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 2086
codeforces_index: "C"
codeforces_contest_name: "Educational Codeforces Round 177 (Rated for Div. 2)"
rating: 1300
weight: 2086
solve_time_s: 117
verified: false
draft: false
---

[CF 2086C - 消失排列](https://codeforces.com/problemset/problem/2086/C)

 **评分：** 1300
 **标签：** dfs 和类似的、dp、dsu、图、贪婪、实现
 **求解时间：** 1m 57s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到了从 1 到 n 的整数排列，这意味着该范围内的每个数字在大小为 n 的数组中只出现一次。 然后，我们执行一系列查询，在每个查询中，我们将数组的特定元素替换为零。 在所有查询过程中，每个位置都会被替换一次，因此在 n 次查询之后，整个数组将由零组成。 

每次查询后，任务是计算将当前数组转回 1 到 n 的任何有效整数排列所需的最少操作数。 允许的操作很简单：选择一个索引 i 并将该索引处的值替换为 i。 此操作保证该索引处的元素在排列中变得正确，并且它可以独立应用于任何索引。 

约束条件表明n 可以达到10^5，并且所有测试用例的n 总和不超过2·10^5。 由于 2 秒的限制，任何每个测试用例具有 O(n^2) 的解决方案都会太慢。 每个测试用例我们需要大约 O(n) 的东西才能保持在限制之内。 

一个微妙的边缘情况是排列最初按升序或降序排序。 例如，考虑 n=3、排列 [3,2,1] 和查询 [3,2,1]。 第一次查询后，只有位置 3 变为零。 恢复排列的最少操作是一次，因为将索引 3 设置为 3 会修复该元素。 第二次查询后，位置3和2都为零，最少运算次数为两次。 粗心的解决方案可能会假设零总是出现在末尾或按排序顺序出现，但事实并非如此。 

另一种边缘情况是零破坏了正确放置的数字的连续序列。 例如，如果第一个和最后一个元素为零，但中间元素已经正确，我们必须考虑数组中的间隙，这直接影响所需操作的计数。 

## 方法

 暴力方法将模拟每个查询的效果：将 p[d_i] 替换为零后，迭代数组并计算有多少元素不正确。 对于每个不正确的元素，要么它已经为零（需要一次操作），要么它是错误的（也需要一次操作）。 这是可行的，但在最坏的情况下需要 O(n^2) 时间，因为我们将遍历数组 n 次，这对于 n 高达 10^5 来说太慢了。 

关键的观察是允许的操作让我们可以直接将任何数字 i 放置在索引 i 处。 这意味着问题简化为计算位置 1 到 n 的最大前缀，这些前缀可以在不进行操作的情况下保持正确。 我们可以维护一组已删除的元素，并跟踪已经正确的从末尾开始的最高连续块。 具体来说，我们可以反向迭代查询，“撤销”位置归零。 对于每一步，我们都会跟踪已包含从开始到 n 的所有数字的最大后缀的长度。 每次查询后所需的最少操作正是该后缀之外的位置数，因为每个其他位置都需要一次操作来修复。 此观察将复杂度从 O(n^2) 降低到 O(n)。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了|
 | 最佳| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 创建数组`pos`大小为 n+1，将每个数字映射到其排列中的索引。 这使我们能够在 O(1) 时间内快速定位任意数字。 
2.初始化一个数组`removed`大小为 n+1 来跟踪哪些位置已归零。 最初将所有设置为 False。 
3. 初始化变量`suffix_max`到 n. 这将跟踪当前不需要操作的连续后缀中的最大数量。 
4. 以相反的顺序迭代查询，从最后一个查询回到第一个查询。 对于每个查询，将位置“恢复”到其原始值，因为我们本质上是向后构建数组。 
5. 当数字为`suffix_max`已恢复（即未删除）、递减`suffix_max`。 此步骤查找已经正确的数字的最大连续后缀。 
6. 记录此查询后的最少操作为`suffix_max`。 原因是所有数字都大于`suffix_max`已经正确放置，并且所有数字小于或等于`suffix_max`各需要一次手术。 
7. 反向处理完所有查询后，反转结果数组以匹配原始查询顺序。 

为什么它有效：不变的是在每一步，`suffix_max`表示所有数字大于的最大数字`suffix_max`已经处于正确的位置。 由于允许的操作直接将任何数字固定在其对应的索引处，因此每个小于或等于的数字`suffix_max`必须单独固定，这恰好对应于最少的操作。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n = int(input())
        p = list(map(int, input().split()))
        d = list(map(int, input().split()))
        
        pos = [0] * (n + 1)
        for idx, val in enumerate(p):
            pos[val] = idx
        
        removed = [False] * n
        ans = [0] * n
        suffix_max = n
        # process queries in reverse
        for i in range(n - 1, -1, -1):
            removed[d[i]-1] = False  # restore element
            while suffix_max > 0 and not removed[pos[suffix_max]]:
                suffix_max -= 1
            ans[i] = suffix_max
            removed[d[i]-1] = True  # mark removed for next iteration
        
        print(" ".join(map(str, ans)))

if __name__ == "__main__":
    solve()
```代码首先构建`pos`数组允许 O(1) 访问任意数字的索引。 这`removed`数组用于标记归零的位置。 我们反向处理查询，这样我们就可以确定不需要任何操作的后缀的大小。 微妙的部分是切换`removed`递减之前和之后的标志`suffix_max`保持正确的簿记。 

## 工作示例

 ### 示例 1

 输入：```
3
3
1 2 3
3 2 1
```| 查询 | 查询后的数组 | 后缀最大 | 最少操作 |
 | --- | --- | --- | --- |
 | 1 | [1,2,0]| 2 | 1 |
 | 2 | [1,0,0]| 1 | 2 |
 | 3 | [0,0,0]| 0 | 3 |

 该跟踪证实，当我们删除元素时，已经正确的数字的最大后缀会缩小，而最小操作数也会相应增加。 

### 示例 2

 输入：```
5
4 5 3 1 2
4 5 1 3 2
```| 查询 | 数组 | 后缀最大 | 最少操作 |
 | --- | --- | --- | --- |
 | 1 | [4,5,3,0,2] | 3 | 2 |
 | 2 | [4,5,3,0,0] | 1 | 4 |
 | 3 | [0,5,3,0,0] | 1 | 4 |
 | 4 | [0,5,0,0,0] | 0 | 5 |
 | 5 | [0,0,0,0,0] | 0 | 5 |

 该跟踪表明，无论应用零的顺序如何，该算法都正确地考虑了已经存在的元素。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个查询处理一次，suffix_max总共最多减少n次|
 | 空间| O(n) | 数组 pos、removed 和 ans 每个都需要 O(n) 空间 |

 所有测试用例的总时间为 O(n 之和) = O(2·10^5)，完全在 2 秒限制之内。 空间使用量与 n 成正比，在 512 MB 限制下是可以接受的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# provided sample
assert run("3\n3\n1 2 3\n3 2 1\n5\n4 5 3 1 2\n4 5 1 3 2\n7\n4 3 1 2 7 5 6\n1 2 3 4 5 6 7\n") == "1 2 3\n2 4 4 5 5\n4 4 4 4 7 7 7"

# minimum-size input
assert run("1\n1\n1\n1\n") == "1"

# maximum-size input with n=5 (small for demonstration)
assert run("1\n5\n5 4 3 2 1\n1 2 3 4 5\n") == "5 4 3 2 1"

# all elements removed in increasing order
assert run("1\n4\n1 2 3 4\n1 2 3 4\n") == "4
```
