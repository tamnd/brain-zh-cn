---
title: "CF 1955D - 子序列搜索不准确"
description: "我们被要求计算数组 a 中相对于另一个长度为 m 的数组 b 而言“良好”的长度为 m 的子段。 如果在重新排列其元素后，其中至少 k 个与 b 中的元素匹配，则认为子段是好的。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1955
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 938 (Div. 3)"
rating: 1400
weight: 1955
solve_time_s: 46
verified: true
draft: false
---

[CF 1955D - 子序列搜索不准确](https://codeforces.com/problemset/problem/1955/D)

 **评分：** 1400
 **标签：** 数据结构、两个指针
 **求解时间：** 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求计算长度的子段`m`在一个数组中`a`相对于另一个数组“好”`b`长度`m`。 如果在重新排列其元素后至少满足以下条件，则认为子段是好的：`k`其中匹配元素来自`b`。 在实践中，这意味着我们正在检查子段和子段的多重集交集是否`b`至少包含`k`元素。 

输入提供多个测试用例，每个测试用例都有数组`a`和`b`，和整数`n`,`m`,`k`。 所有的总大小`a`跨测试用例的数组不超过`2 * 10^5`，类似地对于`b`。 这限制了我们可以有效执行的操作总数。 迭代每个子段并将其与`b`中的逐个元素`O(n * m)`时间会太慢，因为在最坏的情况下这可能会达到`2 * 10^5 * 2 * 10^5 = 4 * 10^10`运营。 

边缘情况包括元素重复的子段，`k = m`（需要完整匹配），`k = 1`（需要最小匹配），以及`a`或者`b`包含重复的数字。 幼稚的方法可能会错误地计算不同的元素，或者在涉及多个重复项时失败。 例如，如果`a = [1,1,1]`和`b = [1,2,3]`和`k = 2`，算法不得错误地将此段视为良好，因为只有一个`1`在`b`可以匹配段。 

## 方法

 蛮力方法将迭代长度的每个子段`m`在`a`，并且对于每个，计算多重集交集`b`。 计算匹配需要迭代子段的所有元素并与`b`。 这可以正确工作，因为它直接实现了定义，但它有`O(n * m)`每个测试用例的复杂性和大的失败`n`和`m`。 

关键的见解是我们可以维持一个长度的滑动窗口`m`超过`a`并跟踪有多少元素与`b`使用频率图。 最初，我们计算每个数字的出现次数`b`在字典里。 然后，当我们滑动窗口时`a`，我们维护另一个字典来记录当前窗口中出现的元素数量`b`。 当一个元素进入窗口时，如果它存在于窗口中，我们就会增加匹配计数`b`并且还没有完全匹配。 当一个元素离开窗口时，如果它之前对交集有贡献，我们就会减少匹配计数。 这将复杂性降低到`O(n)`每个测试用例使用`O(m)`用于频率跟踪的额外空间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n * m) | O(米) | 太慢了 |
 | 滑动窗口+频率图| O(n) | O(米) | 已接受 |

 ## 算法演练

 1. 构建数组的频率字典`b`。 每个键都是一个数字，值是它出现的次数。 这让我们可以有效地检查子段中的元素是否可以匹配`b`。 
2. 在第一个之上初始化一个滑动窗口`m`的元素`a`。 维护窗口中有多少元素与中的元素匹配的计数`b`不超过其要求的频率。 对于进入窗口的每个元素，如果该元素存在于窗口中，则增加匹配计数器`b`并且尚未达到最大计数`b`。 
3. 检查当前窗口的匹配计数器是否至少为`k`。 如果是这样，请增加答案。 
4. 将窗口向前滑动一个元素。 对于每个班次，删除离开窗口的元素并添加进入的元素。 根据频率字典更新匹配计数器。 删除时，如果该元素对匹配有贡献，则递减计数器； 添加时，如果现在有贡献，则增加它。 
5. 重复直到数组末尾。 答案将是匹配计数器至少为的窗口总数`k`。 

工作原理：在每一步，匹配计数器准确地反映了当前窗口中可以与`b`不超过他们的频率。 滑动窗口可以有效地更新此计数，从而保持正确性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import Counter

def solve():
    t = int(input())
    for _ in range(t):
        n, m, k = map(int, input().split())
        a = list(map(int, input().split()))
        b = list(map(int, input().split()))

        b_count = Counter(b)
        window_count = Counter()
        matches = 0
        result = 0

        # Initialize first window
        for i in range(m):
            x = a[i]
            if x in b_count:
                if window_count[x] < b_count[x]:
                    matches += 1
                window_count[x] += 1
        if matches >= k:
            result += 1

        # Slide the window
        for i in range(m, n):
            out_elem = a[i - m]
            in_elem = a[i]

            if out_elem in b_count:
                if window_count[out_elem] <= b_count[out_elem]:
                    matches -= 1
                window_count[out_elem] -= 1

            if in_elem in b_count:
                if window_count[in_elem] < b_count[in_elem]:
                    matches += 1
                window_count[in_elem] += 1

            if matches >= k:
                result += 1

        print(result)

if __name__ == "__main__":
    solve()
```该解决方案首先计算频率`b`，然后滑动一个窗口`a`，更新匹配并在每一步检查良好的子段条件。 微妙的部分是确保递增和递减`matches`尊重允许的最大出现次数`b_count`，它可以正确处理重复的数字。 边缘边界通过仔细索引来管理`i - m`对于离开窗口的元素。 

## 工作示例

 ### 示例 1 迹线

 输入：```
7 4 2
4 1 2 3 4 5 6
1 2 3 4
```| 窗口索引 | 窗口| 比赛| 结果 |
 | --- | --- | --- | --- |
 | 0-3 | [4,1,2,3] | 4 | 1 |
 | 1-4 | 1-4 [1,2,3,4] | 4 | 2 |
 | 2-5 | 2-5 [2,3,4,5] | 3 | 3 |
 | 3-6 | 3-6 [3,4,5,6] | 2 | 4 |

 该跟踪确认算法正确地计算每个窗口的匹配数，并在匹配 >= k 时更新结果。 

### 示例 2 跟踪

 输入：```
7 4 3
4 1 2 3 4 5 6
1 2 3 4
```| 窗口索引 | 窗口| 比赛| 结果 |
 | --- | --- | --- | --- |
 | 0-3 | [4,1,2,3] | 4 | 1 |
 | 1-4 | 1-4 [1,2,3,4] | 4 | 2 |
 | 2-5 | 2-5 [2,3,4,5] | 3 | 3 |
 | 3-6 | 3-6 [3,4,5,6] | 2 | 3 |

 此跟踪显示匹配项少于 3 个的窗口将被忽略。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 每个元素只进入和离开窗口一次。 |
 | 空间| O(米) | 计数器存储元素的频率`b`和当前窗口。 |

 鉴于所有的总和`n`跨测试用例的时间 <= 2 * 10^5，该解决方案符合 2 秒限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io
from collections import Counter

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    solve()
    return output.getvalue().strip()

# Provided samples
assert run("5\n7 4 2\n4 1 2 3 4 5 6\n1 2 3 4\n7 4 3\n4 1 2 3 4 5 6\n1 2 3 4\n7 4 4\n4 1 2 3 4 5 6\n1 2 3 4\n11 5 3\n9 9 2 2 10 9 7 6 3 6 3\n6 9 7 8 10\n4 1 1\n4 1 5 6\n6\n") == "4\n3\n2\n4\n1"

# Custom cases
assert run("1\n3 3 3\n1 1 1\n1 1 1\n") == "1", "all equal"
assert run("1\n5 2 1\n1 2 3 4 5\n5 6\n") == "2", "minimal k=1"
assert run("1\n6 3 2\n1 2 2
```
