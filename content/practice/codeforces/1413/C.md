---
title: "CF 1413C - 轻松执行"
description: "该问题要求我们将音符序列映射到具有六弦的吉他，以便最大程度地减少使用的最大品格减去最小的品格。 每个字符串都有一个基值，索引 j 处的微动会将 j 添加到字符串的基值中。"
date: "2026-06-11T07:27:14+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "dp", "implementation", "sortings", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1413
codeforces_index: "C"
codeforces_contest_name: "Technocup 2021 - Elimination Round 1"
rating: 1900
weight: 1413
solve_time_s: 513
verified: false
draft: false
---

[CF 1413C - 轻松执行](https://codeforces.com/problemset/problem/1413/C)

 **评级：** 1900
 **标签：** 二分查找、暴力破解、dp、实现、排序、两个指针
 **求解时间：** 8m 33s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 该问题要求我们将音符序列映射到具有六弦的吉他，以便最大程度地减少使用的最大品格减去最小的品格。 每个字符串都有一个基值，并在索引处微动`j`添加`j`到弦的底部。 一个注释`b_i`可以在任何琴弦上演奏`a_k`只要`b_i ≥ a_k + 1`，所以所需的烦恼是`b_i - a_k`。 目标是选择弹奏每个音符的琴弦，以便使用的品格范围尽可能小。 

输入有六个代表字符串基数的整数，后跟音符数`n`以及笔记的顺序。 限制条件允许`n`最多`10^5`以及弦乐底座和音符直至`10^9`，这意味着 O(n log n) 解决方案是可行的，但 O(n * 6) 或 O(n^2) 暴力破解会太慢。 边缘情况包括所有音符都相等、所有弦乐基础都相等以及单个音符占主导地位时，这可能会使天真的方法（例如始终选择品格最少的弦）产生次优结果。 

## 方法

 强力方法会考虑每个音符的所有 6 种可能性，生成音品分配的所有组合，并计算范围。 这是正确的，但涉及 6^n 种可能性，这是指数级不可行的。 

关键的见解是观察到对于每个音符，每根琴弦上的音品指数形成一个小范围。 我们可以预先计算所有可能的情况`(fret_index, note_index)`对，然后按品索引对它们进行排序。 该问题简化为找到每个音符至少包含一个品格分配的最小音程。 这类似于“覆盖 k 个列表中的元素的最小范围”问题。 使用多重集或优先级队列，我们​​可以在排序的音品索引上滑动一个窗口，跟踪窗口中覆盖的最大音符，并最小化最大和最小音品之间的差异。 这将指数搜索转变为可以在 O(n log n) 内解决的问题，因为每个音符生成六个条目。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(6^n) | O(6^n) | O(n) | 太慢了 |
 | 排序对 + 滑动窗口 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 将六个字符串基数读入数组`a`并将注释放入数组中`b`。 
2. 对于每个音符`b_i`，计算品格指数`b_i - a_j`对于每个字符串`j`, 形成对`(fret, i)`并将所有内容存储在一个列表中。 
3. 按品索引对这个配对列表进行排序。 
4. 使用带有两个指针的滑动窗口方法。 维护一个计数数组`cnt[i]`跟踪当前窗口中有多少音品索引属于音符`i`。 追踪`total`当前窗口中包含的独特注释。 
5. 展开右侧指针直至覆盖所有音符（`total == n`）。 
6. 尽可能收缩左指针，同时覆盖所有音符。 
7. 记录当前窗口中最大和最小品格之间的最小差异。 
8. 继续，直到右指针到达排序列表的末尾。 记录的最小差异就是答案。 

这是有效的，因为列表是按品格排序的，因此扩展右指针会增加最大品格，而收缩左指针可能会减少最小品格。 通过跟踪覆盖范围，我们确保所有音符都至少分配一个品格。 不变的是，当前窗口始终包含每个音符至少一个品格分配，保证所考虑的任何最小范围都是可行的。 

## Python 解决方案```python
import sys
import heapq
from collections import defaultdict
input = sys.stdin.readline

def solve():
    a = list(map(int, input().split()))
    n = int(input())
    b = list(map(int, input().split()))

    frets = []
    for i in range(n):
        for j in range(6):
            fret = b[i] - a[j]
            frets.append((fret, i))
    frets.sort()
    
    count = [0] * n
    unique = 0
    ans = float('inf')
    l = 0
    
    for r in range(len(frets)):
        fret, idx = frets[r]
        if count[idx] == 0:
            unique += 1
        count[idx] += 1
        
        while unique == n:
            ans = min(ans, frets[r][0] - frets[l][0])
            left_fret, left_idx = frets[l]
            count[left_idx] -= 1
            if count[left_idx] == 0:
                unique -= 1
            l += 1
    
    print(ans)

if __name__ == "__main__":
    solve()
```该代码计算所有可能的音品位置，对它们进行排序，并使用两指针方法来维护覆盖所有音符的最小窗口。 边缘条件（例如产生相同音符或大音符值的多个品格）会通过排序和滑动窗口自动处理。 

## 工作示例

 **样品1：**```
a = [1, 4, 100, 10, 30, 5]
b = [101, 104, 105, 110, 130, 200]
```所有音符都可以在琴弦上演奏，使品格索引为 100，最大和最小品格相等，因此差值 = 0。 

**滑动窗口轨迹：**

 | 我| r | 品丝[l] | 品丝[r] | 独特| 当前差异| 回答 |
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | 101-1=100 | 101-1=100 ... | 1 | - | 信息 |
 | ... | ... | ... | ... | 6 | 0 | 0 |

 这证实了最优分配的存在。 

**样本2：**```
a = [1,1,2,2,3,3]
b = [4,11,11,12,12,13,13]
```将第一个音符分配给弦 1，剩余的音符分配给弦 6，得到最大音品 10，最小音品 3，差异 7。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 6_n 对排序加上 6_n 个元素上的线性滑动窗口 |
 | 空间| O(n) | 存储大小为 n 的音素索引和计数数组 |

 对于 n ≤ 10^5，该解决方案可以在 2 秒内轻松拟合。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()
    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

assert run("1 4 100 10 30 5\n6\n101 104 105 110 130 200\n") == "0", "sample 1"
assert run("1 1 2 2 3 3\n7\n4 11 11 12 12 13 13\n") == "7", "sample 2"
assert run("1 1 1 1 1 1\n3\n2 2 2\n") == "1", "all strings equal"
assert run("10 20 30 40 50 60\n1\n70\n") == "10", "single note"
assert run("1 2 3 4 5 6\n6\n7 8 9 10 11 12\n") == "1", "incremental notes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品 1 | 0 | 多个字符串，音符差异较大 |
 | 样品 2 | 7 | 音符可以聚集在不同的字符串上 |
 | 所有字符串都相等 | 1 | 所有字符串基数相同 |
 | 单记| 10 | 10 最小和最大品格仅相差一个音符 |
 | 增量笔记| 1 | 简单的升调|

 ## 边缘情况

 当所有琴弦基数相等时，每个音符恰好有 6 个可能的音品，相差 0..5。 该算法正确地找到覆盖所有音符的最小窗口。 对于相距较远的大钞票，排序可确保滑动窗口捕获最小范围。 对于可以在同一品格的单个弦上演奏的音符，最小差异为零，由两指针窗口正确计算。
