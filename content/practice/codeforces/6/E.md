---
title: "CF 6E - 博览会"
description: "伯伯里给了我们一系列书籍，每本书都有已知的高度，按时间顺序排列。 图书馆希望通过选择连续的书籍来组织博览会，以便选择中最高和最矮的书籍之间的差异不超过给定的……"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "dsu", "trees", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 6
codeforces_index: "E"
codeforces_contest_name: "Codeforces Beta Round 6 (Div. 2 Only)"
rating: 1900
weight: 6
solve_time_s: 58
verified: true
draft: false
---
[CF 6E - 阐述](https://codeforces.com/problemset/problem/6/E)

 **评级：** 1900
 **标签：** 二分查找、数据结构、dsu、树、两个指针
 **求解时间：** 58s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 伯伯里给了我们一系列书籍，每本书都有已知的高度，按时间顺序排列。 图书馆希望通过选择连续的书籍来组织展览，以便选择中最高和最矮的书籍之间的差异不超过给定的限制，`k`。 我们的任务有两个：首先，最大化此类选择中的书籍数量，其次，枚举在满足高度约束的同时实现最大计数的所有连续间隔。 

输入提供`n`, 图书数量,`k`、允许的最大高度差和一个数组`h`书的高度。 输出首先应该给出最大书籍数`a`以及有效期限的数量`b`， 其次是`b`从 1 开始的索引行指示每个周期的开始和结束。 

和`n`最多 10^5 和 2 秒的时间限制，任何检查所有可能的子数组的简单方法都会太慢。 对所有可能的间隔进行强力检查将需要 O(n^2) 次操作，在最坏的情况下可以达到 10^10 次比较。 这远远不可行，所以我们必须找到更有效的方法。 

一个重要的边缘情况出现时`k`为零，意味着只能选择高度完全相同的连续书籍。 另一种情况是，当所有书籍的高度都严格增加或减少时，如果不小心，可能会导致第一本书或最后一本书在所有最大间隔中被排除。 粗心的方法可能会错过边界处的间隔或错误计算最大长度。 

## 方法

 蛮力方法迭代每个可能的起始索引`i`对于每个，将间隔向右延伸，直到高度差超过`k`。 对于每个间隔，我们跟踪长度并将其与当前最大值进行比较。 该方法是正确的，因为它考虑了每个连续的子序列，但在最坏的情况下需要 O(n^2) 次比较。 和`n = 10^5`，这会导致 10^10 次操作，这对于 2 秒的时间限制来说太慢了。 

解锁有效解决方案的关键观察是，我们只对需要有效维护最小值和最大值的连续子数组感兴趣。 这种结构允许我们使用两指针技术与能够在 O(1) 中检索滑动窗口的最小值和最大值的数据结构。 具体来说，使用两个双端队列来跟踪最小和最大高度的索引可以让我们扩展右边界，同时保持间隔有效。 当间隔无效时，我们将左指针向前移动，保持两个指针之间的间隔始终满足高度差约束的不变量。 这将复杂性降低到 O(n)，因为每个元素最多从双端队列中推送和弹出一次。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(1) | O(1) | 太慢了 |
 | 两个指针+双端队列| O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 初始化两个双端队列：一个用于跟踪最大高度（`max_deque`）和一个用于最小高度（`min_deque`）。 初始化两个指针，`l = 0`和`r = 0`, 代表当前区间`[l, r]`。 初始化变量来存储当前最大长度`max_len`和一个清单`intervals`为有效间隔。 
2. 展开右侧指针`r`一次一本书。 对于每一本新书`h[r]`，删除后面的索引`max_deque`尽管`h[r]`大于它们代表的高度。 这确保了`max_deque[0]`总是指向区间内的最大值。 同样，删除后面的索引`min_deque`尽管`h[r]`小于它们代表的高度。 
3.添加后`r`对于两个双端队列，检查当前间隔是否`[l, r]`违反高度差约束：`h[max_deque[0]] - h[min_deque[0]] > k`。 如果是，则增加`l`缩小间隔，直到差异最大`k`。 删除双端队列前面现在位于间隔之外的索引。 
4.当间隔`[l, r]`有效，将其长度与`max_len`。 如果超过`max_len`， 更新`max_len`并重置`intervals`列出当前间隔。 如果它等于`max_len`，附加当前间隔。 
5. 增量`r`直到数组末尾。 循环结束后，输出`max_len`、间隔数以及基于 1 的索引中的每个间隔。 

**为什么有效**：该算法保持了以下不变式：`[l, r]`始终是结束于的最大连续间隔`r`具有有效的高度差。 使用双端队列可确保始终有效地跟踪最小值和最大值，因此可以正确计算每个最大间隔的长度，而不会丢失任何有效的子序列。 

## Python 解决方案```python
import sys
from collections import deque
input = sys.stdin.readline

n, k = map(int, input().split())
h = list(map(int, input().split()))

l = 0
max_len = 0
intervals = []

min_deque = deque()
max_deque = deque()

for r in range(n):
    while max_deque and h[r] > h[max_deque[-1]]:
        max_deque.pop()
    max_deque.append(r)
    
    while min_deque and h[r] < h[min_deque[-1]]:
        min_deque.pop()
    min_deque.append(r)
    
    while h[max_deque[0]] - h[min_deque[0]] > k:
        l += 1
        if max_deque[0] < l:
            max_deque.popleft()
        if min_deque[0] < l:
            min_deque.popleft()
    
    curr_len = r - l + 1
    if curr_len > max_len:
        max_len = curr_len
        intervals = [(l + 1, r + 1)]
    elif curr_len == max_len:
        intervals.append((l + 1, r + 1))

print(max_len, len(intervals))
for a, b in intervals:
    print(a, b)
```双端队列确保对它们的每个操作都是 O(1) 分摊的。 通过检查索引来仔细处理边界条件`l`当左指针移动时。 存储间隔时应用从 1 开始的索引。 

## 工作示例

 输入示例 1：```
3 3
14 12 10
```关键变量追踪：

 | r | 我| 最大双端队列 | 最小双端队列 | curr_len | 最大长度 | 间隔|
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 0 | [0]| [0]| 1 | 1 | [(1,1)] |
 | 1 | 0 | [0]| [1] | 2 | 2 | [(1,2)] |
 | 2 | 1 | [1,2]| [2] | 2 | 2 | [(1,2),(2,3)] |

 这表明两指针和双端队列方法正确跟踪所有最大间隔。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每本书最多在每个双端队列中添加和删除一次。 两指针遍历是线性的。 |
 | 空间| O(n) | 两个双端队列各自最多可以存储`n`最坏情况下的指数。 |

 当 n 达到 10^5 时，O(n) 次操作很容易满足 2 秒的限制，并且内存使用量远低于 64 MB。 

## 测试用例```python
import sys, io
def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    import io as sysio
    f = sysio.StringIO()
    with redirect_stdout(f):
        exec(open('solution.py').read())
    return f.getvalue().strip()

# Provided sample
assert run("3 3\n14 12 10\n") == "2 2\n1 2\n2 3", "sample 1"

# Minimum size
assert run("1 0\n5\n") == "1 1\n1 1", "single book"

# All equal values
assert run("4 0\n7 7 7 7\n") == "4 1\n1 4", "all equal"

# Maximum k
assert run("5 1000000\n1 1000 500 999 1001\n") == "5 1\n1 5", "huge k allows all"

# Boundary condition
assert run("5 2\n1 2 3 4 5\n") == "3 3\n1 3\n2 4\n3 5", "sliding windows correct"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 本书 | 1 1\n1 1 | 1 1\n1 1 | 正确处理最少的输入 |
 | 4 本书相等 | 4 1\n1 4 | 1 k=0，高度均相等 |
 | 最大 k | 5 1\n1 5 | 1 大 k 包括所有 |
