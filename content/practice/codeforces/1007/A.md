---
title: "CF 1007A - 重新排序阵列"
description: "我们得到了一个数字数组，并可以自由地对它们重新排序。 重新排列后，我们将新数组与原始数组逐个位置进行比较。"
date: "2026-06-16T23:06:50+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "data-structures", "math", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1007
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 497 (Div. 1)"
rating: 1300
weight: 1007
solve_time_s: 191
verified: true
draft: false
---

[CF 1007A - 重新排序数组](https://codeforces.com/problemset/problem/1007/A)

 **评分：** 1300
 **标签：** 组合数学、数据结构、数学、排序、两个指针
 **求解时间：** 3m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个数字数组，并可以自由地对它们重新排序。 重新排列后，我们将新数组与原始数组逐个位置进行比较。 如果排列后放置在该位置的值严格大于最初占据该位置的值，则该位置被视为“好”。 

任务是选择一种排列，使此类好位置的数量最大化。 换句话说，我们希望匹配元素，以便尽可能多的位置接收比以前严格更大的值，同时仍然仅使用每个元素一次。 

约束条件$n \le 10^5$立即排除任何尝试所有排列的方法，因为$n!$增长远远超出了可行的限度。 甚至$O(n^2)$对于这个大小，Python 中的解决方案太慢了，因此解决方案必须本质上是线性的或$n \log n$。 

一个幼稚的错误是局部思考，对于每个位置，我们总能找到一些更大的未使用元素。 当大量元素过早被“浪费”时，这种方法就会失败。 

例如，考虑数组：```
[1, 2, 3, 100, 101]
```如果我们不小心贪婪地将最大的元素分配给最小的位置，我们可能会过早地使用 100 和 101，而对中间位置没有留下有效的改进。 正确答案取决于全局匹配，而不是局部配对。 

另一个微妙的失败案例是当重复占主导地位时：```
[5, 5, 5, 1, 1]
```即使有很大的值，一旦分配它们，严格改进匹配的数量就会受到原始结构中存在多少个严格较小的值的限制。 

关键的困难在于我们在严格的不等式约束下有效地匹配数组的两个副本。 

## 方法

 暴力方法将生成每个排列并计算相对于原始数组有多少位置改进。 对于每个排列，我们逐元素与原始数组进行比较，成本$O(n)$每个排列。 由于有$n!$排列，这变成$O(n \cdot n!)$，即使对于$n = 10$。 

The structure of the problem suggests a matching interpretation. We want to pair original values with permuted values such that$b[i] > a[i]$对于尽可能多的索引，其中$b$是一个排列$a$。 This is a bipartite matching problem on a sorted multiset.

 Once the arrays are sorted, we can think in terms of assigning the smallest possible “winning” elements to beat slightly smaller originals. 贪婪的想法变得清晰：如果我们总是尝试使用最小的可用较大值来击败最小的剩余原始值，我们就可以避免在已经很容易的匹配上浪费大量数字。 

This is a classic two-pointer strategy over sorted arrays. 我们对数组进行排序，然后尝试将较大的元素与另一端的较小元素进行匹配，小心地推进指针以最大化成功的严格不等式。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |$O(n \cdot n!)$|$O(n)$| 太慢了|
 | 最优（排序+贪心匹配）|$O(n \log n)$|$O(n)$| 已接受 |

 ## 算法演练

 我们将问题重新解释为将数组的元素与其自身的排列副本相匹配。 

1. 对数组进行非降序排序。 这提供了一个结构化的视图，其中比较变得可预测并且贪婪的选择是安全的。 
2.使用两个指针：一个指针`i`代表我们想要击败的“较小的一方”，另一个指针`j`代表可以击败它的候选人。 
3. 初始化`i = 0`和`j = 0`，并维护一个计数器`ans = 0`。 
4. 遍历数组尝试找到匹配项。 如果`a[j] > a[i]`，我们可以形成一个成功的配对，所以我们增加`ans`, and advance both pointers. 这表示分配一个严格更大的值来击败当前最小的不匹配值。 
5.如果`a[j] <= a[i]`， 然后`a[j]`对于殴打没有用`a[i]`，所以我们只前进`j`。 这会跳过无法增加该目标匹配的值。 
6. 继续，直到任一指针到达数组末尾。 

该流程确保每场成功的比赛都是有效的，并且不会过早地跳过任何潜在的改进。 

### 为什么它有效

 排序后，任何有效的分配都对应于将较大元素与较小元素配对。 贪婪策略总是将最小的“赢家”与它可以击败的最小的“输家”相匹配。 If a value cannot beat the current smallest remaining target, it also cannot beat any later (larger) target, so skipping it does not reduce optimality. This creates a monotonic matching process where each successful pair is irreversibly optimal in the sense that it preserves maximum flexibility for remaining elements.

 ## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))
    
    a.sort()
    
    i = 0
    j = 0
    ans = 0
    
    while i < n and j < n:
        if a[j] > a[i]:
            ans += 1
            i += 1
            j += 1
        else:
            j += 1
    
    print(ans)

if __name__ == "__main__":
    solve()
```排序步骤至关重要，因为它将问题转化为单调匹配任务。 如果没有排序，贪婪规则“使用可行的最小可能元素”就不会被明确定义。 

两个指针循环保持了明显的分离：指针`i`跟踪仍需要击败的下一个最小元素，同时`j`searches for a candidate strictly larger than it. 条件`a[j] > a[i]`确保严格改进，精准匹配问题要求。 

关键的微妙之处在于`i`only advances when a match is found. This guarantees that every successful increment corresponds to a unique pair and no element is reused.

 ## 工作示例

 ### 示例 1

 输入：```
7
10 1 1 1 5 5 3
```排序数组：```
[1, 1, 1, 3, 5, 5, 10]
```| 我| j | 一个[我] | 一个[j] | 行动| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 1 | 1 | j++（不大于）| 0 |
 | 0 | 1 | 1 | 1 | j++ | 0 |
 | 0 | 2 | 1 | 1 | j++ | 0 |
 | 0 | 3 | 1 | 3 | 比赛| 1 |
 | 1 | 4 | 1 | 5 | 比赛| 2 |
 | 2 | 5 | 1 | 5 | 比赛| 3 |
 | 3 | 6 | 3 | 10 | 10 比赛| 4 |

 输出：```
4
```这显示了左侧的重复项如何逐渐被逐渐变大的值消耗，并且仅计算严格的改进。 

### 示例 2

 输入：```
4
4 4 4 4
```排序数组：```
[4, 4, 4, 4]
```| 我| j | 一个[我] | 一个[j] | 行动| 回答 |
 | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 4 | 4 | j++ | 0 |
 | 0 | 1 | 4 | 4 | j++ | 0 |
 | 0 | 2 | 4 | 4 | j++ | 0 |
 | 0 | 3 | 4 | 4 | j++ | 0 |

 输出：```
0
```No element can strictly exceed another, so no valid matches exist.

 ## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |$O(n \log n)$| Sorting dominates; 两指针扫描是线性的|
 | 空间|$O(1)$或者$O(n)$| In-place sort or storage of array |

 The constraints allow up to$10^5$元素，所以$O(n \log n)$解决方案速度很快。 The algorithm uses only sorting and a linear scan, both well within typical limits.

 ## 测试用例```python
# helper: run solution on input string, return output string
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return sys.stdin.readline()  # placeholder, replace with actual solve()

# provided samples (conceptual placeholders)
# assert run("7\n10 1 1 1 5 5 3\n") == "4\n"

# custom cases
assert run("1\n5\n") == "0\n", "single element"
assert run("3\n1 2 3\n") == "2\n", "strictly increasing"
assert run("4\n4 4 4 4\n") == "0\n", "all equal"
assert run("5\n5 1 4 2 3\n") == "4\n", "mixed permutation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 element | 0 | minimal boundary |
 | sorted increasing | 2 | maximal matching potential |
 | all equal | 0 | strict inequality constraint |
 | shuffled mix | 4 | general correctness |

 ## 边缘情况

 For a single-element array like`[7]`，排序后的数组仍然存在`[7]`。 The pointer`j`无法找到任何严格更大的价值`i = 0`，因此不会发生增量并且输出保持为 0。 

对于均匀数组，例如`[2, 2, 2, 2]`，每次比较都未通过严格的不等式检查，因此算法只会前进`j`，永不增加`ans`。 This directly reflects the impossibility of improving any position when all values are identical.
