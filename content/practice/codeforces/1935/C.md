---
title: "CF 1935C - MAC 中的 Messenger"
description: "我们得到一组消息，每个消息都有两个特征：ai（消息的基本读取时间）和 bi（影响连续消息之间的转换成本的坐标）。"
date: "2026-06-08T18:04:37+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "constructive-algorithms", "data-structures", "dp", "greedy", "sortings"]
categories: ["algorithms"]
codeforces_contest: 1935
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 932 (Div. 2)"
rating: 1800
weight: 1935
solve_time_s: 89
verified: true
draft: false
---

[CF 1935C - MAC 中的 Messenger](https://codeforces.com/problemset/problem/1935/C)

 **评分：** 1800
 **标签：** 二分查找、暴力破解、构造性算法、数据结构、dp、贪婪、排序
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收到一组消息，每条消息都有两个特征：`a_i`，消息的基本阅读时间，以及`b_i`，影响连续消息之间的转换成本的坐标。 读取消息子集的总时间是`a_i`值加上绝对差之和`b_i`按所选顺序的连续消息之间的值。 目标是，对于给定的总允许阅读时间`l`，找出在不超过的情况下可以读取的最大消息数`l`。 集合可以为空，在这种情况下，读取时间为`0`。 

限制因素至关重要。 每个测试用例都有`n`最多 2000，但总和`n^2`所有测试用例的数量限制为 400 万个。 这表明我们可以大致承受最坏情况复杂度的算法`O(n^2)`每个测试用例，但任何东西`O(n^3)`或者更糟糕的是可能会超时。 时间限制为 3 秒，如果有效实施，这与二次解是一致的。 

当所有情况都发生时，就会出现边缘情况`a_i`值大于`l`，所以答案必须为零，或者当所有`b_i`值是相同的，使得转换成本为零。 一种天真的贪婪方法选择最小的消息`a_i`可能会失败，因为消息之间的高转换成本可能会导致总数超过`l`。 

## 方法

 暴力方法将枚举消息的所有子集以及这些子集的所有排列以计算读取时间。 对于每个子集，我们将求和`a_i`和成对的`|b_i - b_j|`过渡。 这显然是不可行的，因为排列的数量随着子集大小呈阶乘增长。 即使单独的子集也是`2^n`，对于`n = 2000`。 

关键的见解是将问题简化为我们不考虑任意排列的形式。 对消息进行排序`b_i`允许我们考虑序列`b_i`顺序，因为绝对差之和`|b_i - b_{i+1}|`当数字按排序顺序连续时最小化。 排序后，我们可以按照这个顺序关注子序列，这将问题转换为动态规划或滑动窗口问题，我们在其中进行累积`a_i`有效地评估价值和转换成本。 

最佳方法将每条消息作为序列的潜在起点进行迭代，并将序列向右扩展`b_i`顺序，跟踪累计阅读时间。 如果总时间超过`l`，我们停止延伸并记录长度。 这可以实现在`O(n^2)`每个测试用例，这在约束下是可以接受的。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n! * n) | O(n! * n) | O(n) | 太慢了 |
 | 排序+滑动/DP| O(n^2) | O(n^2) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个测试用例，请阅读`n`和`l`然后成对读取消息列表`(a_i, b_i)`。 
3. 按消息排序`b_i`价值。 这确保了按此顺序的连续消息的任何子序列都将具有最小的转换成本。 
4. 初始化`max_size`为零。 这将保存找到的满足时间限制的最大子集。 
5. 迭代每个可能的起始消息索引`i`。 放`total_time`到`a[i]`和`current_size`至 1。 
6. 从索引开始向右扩展序列`i+1`到`n-1`。 对于每条新消息`j`， 添加`a[j]`加`|b[j] - b[j-1]|`到`total_time`。 如果`total_time`超过`l`，停止延伸。 否则，增加`current_size`。 
7. 更新`max_size`如果`current_size`大于之前的最大值。 
8.检查完所有起点后，输出`max_size`。 

为什么它有效：排序依据`b_i`保证任何连续子序列的转换成本最小，因为无序插入消息只会增加绝对差值之和。 从每个起始索引扩展序列可确保考虑所有连续的子序列，并且`max_size`正确跟踪最大的可行序列。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, l = map(int, input().split())
        messages = [tuple(map(int, input().split())) for _ in range(n)]
        messages.sort(key=lambda x: x[1])
        max_size = 0
        
        for i in range(n):
            total_time = messages[i][0]
            if total_time > l:
                continue
            current_size = 1
            for j in range(i + 1, n):
                total_time += messages[j][0] + abs(messages[j][1] - messages[j-1][1])
                if total_time > l:
                    break
                current_size += 1
            max_size = max(max_size, current_size)
        
        print(max_size)

if __name__ == "__main__":
    solve()
```该代码首先有效地读取输入并对消息进行排序。 排序可确保最小化转换成本。 嵌套循环将每个起始消息扩展为一个连续的序列，并且`break`一旦超过时间限制，可以防止不必要的计算。 边缘情况，例如`total_time > l`在开始时，立即处理以跳过不可行的序列。 

## 工作示例

 ### 示例 1

 输入：```
5 8
4 3
1 5
2 4
4 3
2 3
```排序后`b_i`:```
(4,3), (4,3), (2,4), (1,5), (2,3)
```考虑从索引 0 开始：

 | 索引 | a_i | b_i | 总时间 | 当前尺寸 |
 | ---| --- | --- | --- | ---|
 | 0 | 4 | 3 | 4 | 1 |
 | 1 | 4 | 3 | 4+4+0=8 | 2 |
 | 2 | 2 | 4 | 8+2+1=11 > 8 | 停止|

 此开始的最大大小为 2。其他开始的类似计算得出最终最大大小为 3。 

此跟踪显示了如何排序`b_i`并不断积累`a_i + |b_i - b_{i-1}|`允许有效检查可行序列。 

### 示例 2

 输入：```
3 8
17 17
5 14
15 3
```排序依据`b_i`:```
15 3, 5 14, 17 17
```起始索引 0：

 | 索引 | a_i | b_i | 总时间 | 当前尺寸 |
 | --- | ---| --- | --- | --- |
 | 0 | 15 | 15 3 | 15 > 8 | 15 > 8 停止|

 起始索引 1：

 | 索引 | a_i | b_i | 总时间 | 当前尺寸 |
 | --- | --- | --- | --- | ---|
 | 1 | 5 | 14 | 14 5 | 1 |
 | 2 | 17 | 17 17 | 17 5+17+3=25 > 8 | 停止|

 最大尺寸为 1。 

这证实了边缘处理：序列超过`l`立即被跳过。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n^2) | 排序是 O(n log n)，嵌套扩展循环是 O(n^2) 最坏情况。 |
 | 空间| O(n) | 存储消息和临时变量。 |

 给定所有测试用例的约束总和 n^2 ≤ 4*10^6，该解决方案在时间限制内很合适。 内存使用量极小。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    solve()
    return sys.stdout.getvalue().strip()

# provided sample
assert run("""5
5 8
4 3
1 5
2 4
4 3
2 3
1 6
4 10
3 12
4 8
2 1
2 12
5 26
24 7
8 28
30 22
3 8
17 17
5 14
15 3
1000000000 998244353
179 239
228 1337
993 1007
""") == "3\n1\n2\n1\n0"

# custom test cases
assert run("1\n3 5\n2 1\n2 2\n2 3") == "2", "subsequence selection"
assert run("1\n4 3\n4 4\n4 4\n4 4\n4 4") == "0", "all a_i > l"
assert run("1\n5 100\n10 1\n20 1\n30 1\n40 1\n50 1") == "5", "all b_i same"
assert run("1\n5 15\n5 1\n5 2\n5 3\n5 4\n5 5") ==
```
