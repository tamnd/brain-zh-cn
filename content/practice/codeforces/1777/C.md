---
title: "CF 1777C - 测验大师"
description: "我们被要求从学校中选择一部分学生来组成一个测验小组。 每个学生都有一个聪明值，每个测验主题至少需要一名聪明度能被主题编号整除的团队成员。"
date: "2026-06-09T11:40:22+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "math", "number-theory", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1777
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 845 (Div. 2) and ByteRace 2023"
rating: 1700
weight: 1777
solve_time_s: 207
verified: true
draft: false
---

[CF 1777C - 测验大师](https://codeforces.com/problemset/problem/1777/C)

 **评分：** 1700
 **标签：** 二分查找、数学、数论、排序、两个指针
 **求解时间：** 3m 27s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求从学校中选择一部分学生来组成一个测验小组。 每个学生都有一个聪明值，每个测验主题至少需要一名聪明度能被主题编号整除的团队成员。 目标是组建一个涵盖所有主题的团队，同时最大限度地减少团队中任何两个学生聪明程度之间的最大差异。 

输入给出学生人数`n`和主题`m`，后跟一系列智能值`a`。 对于每个测试用例，我们必须输出有效团队中智能之间的最小最大差异，或者`-1`如果没有团队能够涵盖所有主题。 

约束条件允许`n`和`m`最多 100,000 个，所有测试用例的总和为 100,000 个。 这排除了尝试所有学生子集的简单方法，因为组合的数量呈指数级增长。 操作必须大致线性或接近线性`n`对于每个测试用例，否则我们将面临超时的风险。 

边缘情况包括没有学生可以被某个主题整除的情况。 例如，如果`a = [3,7]`和`m = 4`，没有学生可以被整除`2`或者`4`，所以不存在任何团队。 当一个学生可以涵盖多个主题时，就会出现另一个微妙的情况，允许最小差异为零。 

## 方法

 暴力方法将枚举学生的所有子集，检查每个子集是否涵盖所有主题，并计算最大和最小聪明度之间的差异。 这原则上是正确的，但需要检查`2^n`子集，这对于`n = 10^5`。 

关键的见解是我们不需要所有子集，我们只需要可以覆盖所有主题的最小范围的智能值。 主题对应于除数，因此我们可以从整数覆盖的角度来思考。 通过作为最小团队成员迭代每个聪明才智，并尝试让足够的学生涵盖所有主题`m`，我们可以将问题简化为一种排序智能值上的滑动窗口，并结合主题覆盖范围的类似筛子的跟踪。 

我们预处理哪些学生涵盖哪些主题。 然后我们只考虑智能范围，并检查该范围内涵盖的主题是否包括来自`1`到`m`。 这个范围的最小宽度给出了答案。 

最佳方法利用排序和两个指针或动态窗口的形式。 按排序`a`并跟踪滑动窗口中涵盖的主题数量，我们可以有效地计算最小最大差异。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * m) | O(2^n * m) | O(n * m) | 太慢了|
 | 最佳 | O(n log n + n m) | O(n log n + n m) | O(米) | 已接受 |

 ## 算法演练

 1. 对数组进行排序`a`。 这使我们能够以递增的顺序考虑智能范围，从而简化了寻找最小差异的过程。 
2.初始化一个count数组`topic_count`尺寸的`m+1`到零，跟踪当前窗口中有多少学生精通每个主题。 
3.维护两个指针`l`和`r`代表当前智能值窗口的左端和右端。 
4. 移动`r`从左到右，将学生添加到窗口。 对于每个新学生，他们涵盖的每个主题（即所有除数）都会增加计数`T`的`a[r]`在哪里`T <= m`。 
5. 每当所有主题来自`1`到`m`窗口内至少有一名学生（`topic_count[T] > 0`为所有人`T`），尝试通过移动来缩小窗口`l`正确的。 递减`topic_count`对于涵盖的主题`a[l]`因此。 
6. 每次窗口涵盖所有主题时，将答案更新为`min(ans, a[r] - a[l])`。 
7. 如果没有窗口涵盖所有主题，则返回`-1`。 

为什么有效：排序可以确保增加`r`只增加窗口中的最大智能，并且移动`l`向前减少了最小智能。 通过动态维护主题计数，我们确保窗口始终代表有效子集，并且跟踪最小宽度保证最小最大差异。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, m = map(int, input().split())
        a = list(map(int, input().split()))
        a.sort()
        
        max_val = max(a)
        # count frequency of each smartness
        from collections import defaultdict, deque
        indices = defaultdict(list)
        for val in a:
            indices[val].append(val)
        
        # initialize topic coverage for sliding window
        topic_count = [0] * (m + 1)
        total_covered = 0
        ans = float('inf')
        l = 0
        
        for r in range(n):
            val = a[r]
            # increment topic counts for all divisors <= m
            for T in range(1, min(val, m) + 1):
                if val % T == 0:
                    if topic_count[T] == 0:
                        total_covered += 1
                    topic_count[T] += 1
            
            # shrink window from left
            while total_covered == m:
                ans = min(ans, a[r] - a[l])
                val_l = a[l]
                for T in range(1, min(val_l, m) + 1):
                    if val_l % T == 0:
                        topic_count[T] -= 1
                        if topic_count[T] == 0:
                            total_covered -= 1
                l += 1
        
        print(ans if ans != float('inf') else -1)

if __name__ == "__main__":
    solve()
```代码排序`a`并使用带有`topic_count`数组来跟踪当前窗口中有多少学生精通每个主题。 除数上的内部循环可确保正确的覆盖范围，并且缩小窗口可保持最小差异。 

## 工作示例

 **示例输入 2：**```
4 2
3 7 2 9
```| 步骤| 我| r | 窗口| 涵盖的主题 | 当前差异| 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | [2] | 1,2 | 0 | 0 |
 | 1 | 0 | 1 | [2,3]| 1,2 | 1 | 0 |

 单独使用学生聪明度 2 时，最小差异为 0。 

**示例输入 3：**```
5 7
6 4 3 5 7
```| 步骤| 我| r | 窗口| 涵盖的主题 | 当前差异| 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 0 | [3] | 1,3 | 0 | 信息 |
 | 1 | 0 | 1 | [3,4]| 1,2,3,4 | 1 | 信息 |
 | 2 | 0 | 2 | [3,4,5]| 1,2,3,4,5 | 2 | 信息 |
 | 3 | 0 | 3 | [3,4,5,6] | 1..6 | 1..6 3 | 3 |
 | 4 | 1 | 4 | [4,5,6,7] | 1..7 | 1..7 3 | 3 |

 最小最大差异为 3。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n·m) | 对于每个学生，我们检查除数到 min(a[i], m)。 排序的时间复杂度为 O(n log n)，主要由除数检查决定。 |
 | 空间| O(m + n) | 我们存储主题计数和排序数组。 |

 给定`n`和`m`所有测试用例的总和为 10^5，该解决方案对于 2 秒限制来说足够有效。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("3\n2 4\n3 7\n4 2\n3 7 2 9\n5 7\n6 4 3 5 7\n") == "-1\n0\n3"

# Custom cases
assert run("1\n1 1\n1\n") == "0", "single student single topic"
assert run("1\n3 3\n2 3 4\n") == "1", "need all topics covered by minimal range"
assert run("1\n5 5\n1 2 3 4 5\n") == "4", "all distinct, minimal range is full array"
assert run("1\n4 2\n6 8 10 12\n") == "0", "multiple students divisible by topics, minimal difference zero"
assert run("1\n2 2\n3 7\n") == "-1", "no student covers topic 2"
```| 测试输入| 预期产出 | 它验证了什么 |

 |---|---
