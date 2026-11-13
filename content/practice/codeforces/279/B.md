---
title: "CF 279B - 书籍"
description: "我们有一排书，阅读每本书所需的时间是已知的。 瓦莱拉可以从任意位置开始，然后向右连续阅读书籍。 他不能跳过书，只有在有足够的剩余时间才能完全读完一本书时，他才会开始读一本书。"
date: "2026-06-05T08:34:56+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "implementation", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 279
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 171 (Div. 2)"
rating: 1400
weight: 279
solve_time_s: 98
verified: true
draft: false
---

[CF 279B - 书籍](https://codeforces.com/problemset/problem/279/B)

 **评分：** 1400
 **标签：** 二分查找、暴力破解、实现、两个指针
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一排书，阅读每本书所需的时间是已知的。 瓦莱拉可以从任意位置开始，然后向右连续阅读书籍。 他不能跳过书，只有在有足够的剩余时间才能完全读完一本书时，他才会开始读一本书。 

任务是找到最大数量的连续阅读总时间不超过可用时间的书籍`t`。 

输入给出了所有书籍的阅读时间。 输出是一个数字，即连续段的最大长度，其总和最多为`t`。 

约束是解决方案的驱动力。 图书数量可达`100000`，因此任何显式检查所有可能段的算法都会太慢。 大致有`n² / 2`连续的段，当`n = 100000`。 即使使用前缀和有效地计算段和，仍然会留下一个`O(n²)`枚举，远远超出了 2 秒的限制。 

需要线性或接近线性的解决方案。 由于所有读取时间都是正数，因此该问题具有有用的单调结构，允许使用滑动窗口方法。 

一个很容易错过的边缘情况是，即使是一本书也超出了可用时间。 

输入：```
3 2
3 4 5
```输出：```
0
```不存在有效段。 总是假设至少可以阅读一本书的粗心实现将会返回`1`。 

当最佳段从中间开始时，会出现另一种边缘情况。 

输入：```
5 5
10 1 1 1 1
```输出：```
4
```从第一本书开始是不可能的，但从第二本书开始可以读四本书。 只考虑前缀的贪婪方法将会失败。 

第三种情况是窗口反复需要缩小时。 

输入：```
5 5
2 2 2 2 2
```输出：```
2
```每个长度为 3 的线段的和为 6。 当总和变得太大时，不能正确从左侧删除书籍的实现将会过度计数。 

## 方法

 最直接的解决办法就是尝试每一个起始位置并向右延伸，直到总阅读时间超过`t`。 对于每一本起始书，我们都会一本一本地添加书籍。 

这种方法是正确的，因为它明确地评估每个可能的连续段。 问题是它的运行时间。 在最坏的情况下，例如当所有读取时间都为`1`，每个起始位置可以检查几乎所有剩余的书籍。 总工作量变为：```
n + (n - 1) + (n - 2) + ... + 1 = O(n²)
```和`n = 100000`，这太大了。 

关键的观察结果是所有阅读时间都是正数。 假设我们有一个段，其总和已经超过`t`。 进一步扩展只能增加总和，而绝不会减少总和。 这意味着该段的左边界仅向前移动，而不会向后移动。 

此属性使滑动窗口成为可能。 我们维护一个窗口`[left, right]`其总和被连续跟踪。 我们通过移动来扩展窗口`right`。 每当总和变得太大时，我们就会移动`left`向前直到总和再次有效。 

因为每个索引进入窗口一次，离开窗口一次，所以总的工作是线性的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 太慢了 |
 | 最优滑动窗口| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 初始化`left = 0`,`current_sum = 0`， 和`answer = 0`。 
2. 迭代`right`从`0`到`n - 1`。 
3.将当前书籍的阅读时间添加到`current_sum`。 
4. 如果`current_sum`超过`t`,反复移​​动`left`转发并减去这些书`current_sum`直到总和最多变为`t`。 

此步骤恢复当前窗口是有效段的不变量，其总读取时间适合可用时间。 
5. 当前窗口长度为`right - left + 1`。 
6. 更新`answer`迄今为止看到的最大窗口长度。 
7. 处理完所有书籍后，打印`answer`。 

### 为什么它有效

 在每一时刻，窗口代表在位置结束的最长有效段`right`其总和不超过`t`。 当总和变得太大时，从左侧删除书籍是使该段再次有效的唯一方法，因为所有阅读时间都是正数。 

自从`left`仅向前移动，每个可能的最大有效窗口在处理其右端点时都会被准确考虑。 该算法绝不会错过候选片段，并且`answer`记录其中最大的有效窗口长度。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, t = map(int, input().split())
    a = list(map(int, input().split()))

    left = 0
    current_sum = 0
    answer = 0

    for right in range(n):
        current_sum += a[right]

        while current_sum > t:
            current_sum -= a[left]
            left += 1

        answer = max(answer, right - left + 1)

    print(answer)

if __name__ == "__main__":
    solve()
```变量`current_sum`存储当前窗口的总读取时间。 每次右边界扩展时，新书都会添加到总和中。 

这`while`循环是关键部分。 一次删除并不总是足够的。 例如，如果窗口总和远大于`t`，在该段再次有效之前可能需要删除几本书。 

窗口长度是在收缩过程完成后计算的。 那时，该段保证满足时间限制。 

Python 整数是无界的，因此即使在以下情况下也不存在溢出问题`t`可以达到`10^9`并且窗口总和可能会暂时变大。 

该实现在内部使用从零开始的索引，这保留了长度公式`right - left + 1`直截了当。 

## 工作示例

 ### 示例 1

 输入：```
4 5
3 1 2 1
```| 对| 预订时间| 收缩前的 current_sum | 缩小后留下| 缩小后的 current_sum | 窗口长度| 答案|
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 3 | 3 | 0 | 3 | 1 | 1 |
 | 1 | 1 | 4 | 0 | 4 | 2 | 2 |
 | 2 | 2 | 6 | 1 | 3 | 2 | 2 |
 | 3 | 1 | 4 | 1 | 4 | 3 | 3 |

 最终答案：```
3
```最长的有效段是`[1, 2, 1]`，其总阅读时间为`4`。 

### 示例 2

 输入：```
5 5
2 2 2 2 2
```| 对| 预订时间| 收缩前的 current_sum | 缩小后留下| 缩小后的 current_sum | 窗口长度| 答案|
 | --- | --- | --- | --- | --- | --- | --- |
 | 0 | 2 | 2 | 0 | 2 | 1 | 1 |
 | 1 | 2 | 4 | 0 | 4 | 2 | 2 |
 | 2 | 2 | 6 | 1 | 4 | 2 | 2 |
 | 3 | 2 | 6 | 2 | 4 | 2 | 2 |
 | 4 | 2 | 6 | 3 | 4 | 2 | 2 |

 最终答案：```
2
```该轨迹显示了为什么需要重复收缩。 每当第三本书进入窗口时，总和就超过限制，并且必须移除最左边的书。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个索引最多进入和离开窗口一次 |
 | 空间| O(1) | O(1) | 除了输入数组之外，仅维护几个变量 |

 线性运行时间轻松处理`100000`图书。 内存使用量最小并且完全在限制范围内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n, t = map(int, input().split())
    a = list(map(int, input().split()))

    left = 0
    current_sum = 0
    answer = 0

    for right in range(n):
        current_sum += a[right]

        while current_sum > t:
            current_sum -= a[left]
            left += 1

        answer = max(answer, right - left + 1)

    print(answer)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return result

# provided sample
assert run("4 5\n3 1 2 1\n") == "3", "sample 1"

# minimum size
assert run("1 1\n1\n") == "1", "single readable book"

# no readable book
assert run("3 2\n3 4 5\n") == "0", "all books too large"

# all equal values
assert run("5 5\n2 2 2 2 2\n") == "2", "uniform values"

# optimal segment in the middle
assert run("5 5\n10 1 1 1 1\n") == "4", "skip large prefix"

# boundary exact sum
assert run("4 10\n1 2 3 4\n") == "4", "sum equals limit"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 1`|`1`| 最小输入尺寸 |
 |`3 2 / 3 4 5`|`0`| 不存在有效段 |
 |`5 5 / 2 2 2 2 2`|`2`| 反复缩小窗口 |
 |`5 5 / 10 1 1 1 1`|`4`| 最佳片段在第一本书之后开始 |
 |`4 10 / 1 2 3 4`|`4`| 与时限完全相等 |

 ## 边缘情况

 考虑每本书都超出可用时间的情况。 

输入：```
3 2
3 4 5
```当第一本书进入窗口时，总和变为`3`，它已经大于`2`。 该算法立即将其删除，留下一个空窗口。 其余书籍也发生同样的情况。 最大窗口长度永远不会超过`0`，所以输出是正确的`0`。 

考虑一个大的不可读的前缀。 

输入：```
5 5
10 1 1 1 1
```处理完第一本书后，窗口变得无效并缩小到长度为零。 然后，该算法根据后面的书籍构建一个新窗口。 最终窗口包含了最后四本书的总和`4`，产生正确答案`4`。 这表明该算法不偏向于从开头附近开始的片段。 

考虑一个总和反复超过限制的线段。 

输入：```
5 5
2 2 2 2 2
```每当添加第三本书时，总和就变成`6`。 这`while`循环从左侧删除书籍，直到总和返回到`4`。 窗口缩小后始终保持有效，找到的最大有效长度为`2`。 这说明了为什么收缩步骤必须是一个循环而不是单个`if`陈述。
