---
title: "CF 10D-LCIS"
description: "我们有两个整数数组。 我们需要构建同时满足两个条件的最长序列。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "dp"]
categories: ["algorithms"]
codeforces_contest: 10
codeforces_index: "D"
codeforces_contest_name: "Codeforces Beta Round 10"
rating: 2800
weight: 10
solve_time_s: 120
verified: false
draft: false
---
[CF 10D - LCIS](https://codeforces.com/problemset/problem/10/D)

 **评分：** 2800
 **标签：** dp
 **求解时间：** 2m
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有两个整数数组。 我们需要构建同时满足两个条件的最长序列。 

The sequence must appear as a subsequence in both arrays, meaning we are allowed to skip elements but cannot change their relative order.

 该序列也必须是严格递增的。 

This is different from ordinary LCS and different from ordinary LIS. 普通的 LCS 会忽略不断增加的要求，而普通的 LIS 只能在一个阵列内工作。 这里我们必须同时满足这两个约束。 

例如，如果数组是：```
A = [2, 3, 1, 6, 5, 4, 6]
B = [1, 3, 5, 6]
```然后`[3, 5, 6]`有效，因为它出现在两个数组中并且严格递增。 

约束足够小以允许二次动态规划。 Both lengths are at most 500, so an`O(n * m)`或者`O(n * m * something small)`解决方案很好。 三次解是有风险的，因为`500^3 = 125,000,000`operations, which is too large in Python under a 1 second time limit.

 The tricky part is that the increasing condition depends on values, while the subsequence condition depends on positions. A careless DP that only tracks indices will often mix these two requirements incorrectly.

 One common mistake is treating the problem as ordinary LCS and then checking increasing order afterward.

 考虑：```
A = [3, 2, 1]
B = [3, 2, 1]
```普通的LCS长度为3，但是`[3, 2, 1]`正在减少。 正确的LCIS长度仅为1。 

另一个微妙的情况涉及重复。```
A = [1, 1, 1]
B = [1, 1]
```答案依然是`[1]`， 不是`[1, 1]`，因为序列必须严格递增。 一个过渡允许`<=`而不是`<`默默地给出了错误的答案。 

重建序列时会出现更危险的错误。```
A = [1, 2, 3]
B = [1, 3, 2]
```答案的长度为 2，但只有`[1, 2]`是有效的。 如果重建忽略第二个数组的排序信息，则可能会错误地构建`[1, 3]`其次是`2`。 

DP 状态必须同时对递增值有效性和子序列有效性进行编码。 

## 方法

 蛮力的想法很简单。 生成第一个数组的每个递增子序列，然后检查它是否也是第二个数组的子序列。 由于位置的每个子集都可以形成一个子序列，因此候选者的数量是指数级的，大致为`2^n`。 即使进行修剪，一旦出现这种情况就变得不可能了`n`接近500。 

更结构化的暴力方法使用经典的 LCS DP 并添加了递增的约束。 我们可以定义：```
dp[i][j][k]
```在哪里`k`以某种方式跟踪先前选择的值或索引。 这很快就会变成立方或更糟，因为每对`(i, j)`可能需要从所有早期状态进行转换。 和`500^3`过渡，Python 挣扎。 

关键的观察是当我们处理固定元素时`A[i]`，我们只关心以小于的值结尾的公共子序列`A[i]`。 

假设我们想要一个结尾为的公共递增子序列`B[j]`， 在哪里`A[i] == B[j]`。 

要扩展先前的序列，我们需要：```
B[k] < B[j]
```和```
k < j
```因为序列必须保持递增并保持顺序`B`。 

在所有这些先前的位置中，只有最佳长度才重要。 

这将昂贵的转换搜索压缩为滚动最大值。 

我们定义：```
dp[j] = length of the best LCIS ending at B[j]
```然后，在扫描时`B`从左到右为固定`A[i]`，我们维持：```
current = best dp[k] where B[k] < A[i]
```现在当`A[i] == B[j]`，我们可以立即设置：```
dp[j] = current + 1
```这完全消除了内部转换循环。 每对`(i, j)`被处理一次，给出`O(n * m)`解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n * m) 或更糟 | O(2^n) | O(2^n) | 太慢了 |
 | 最佳 | O(n * m) | O(米) | 已接受 |

 ## 算法演练

 1. 创建数组`dp[j]`在哪里`dp[j]`存储结束于的最长公共递增子序列的长度`B[j]`。 
2. 创建一个`parent[j]`用于重建的数组。 这将先前的索引存储在`B`以前用过`j`。 
3. 迭代每个元素`A[i]`。 
4.对于当前`A[i]`，维护两个变量：`best_len`，迄今为止发现的最大 LCIS 长度`B`具有较小的值。`best_pos`，索引在`B`最佳序列结束的地方。 
5. 扫描`B`从左到右。 
6. 如果`B[j] < A[i]`， 然后`B[j]`可以出现在之前`A[i]`以递增的顺序。 

如果`dp[j] > best_len`， 更新`best_len`和`best_pos`。 
7.如果`A[i] == B[j]`，那么我们可以扩展以较小值结尾的最佳序列。 

如果`best_len + 1 > dp[j]`， 更新：```
dp[j] = best_len + 1
parent[j] = best_pos
```8. 继续直到所有配对`(i, j)`被处理。 
9.找到位置`j`最大`dp[j]`。 
10. 通过以下方式重建答案`parent[j]`落后。 
11. 反转重建顺序，因为重建是从末尾向开头进行的。 

### 为什么它有效

 对于每一个固定的`A[i]`，扫描结束`B`保持可以合法出现的最佳 LCIS`A[i]`。 由于我们扫描`B`从左到右，每个存储的候选者已经满足子序列排序`B`。 

条件`B[j] < A[i]`保证严格增长。 候选人在扫描中较早出现的条件保证了索引的增加`B`。 

每当`A[i] == B[j]`，延伸`best_len`产生最优 LCIS 结束于`B[j]`使用元素最多`A[i]`。 

不会错过任何有效的转换，因为在扫描期间会考虑每个较小的先前值。 不使用无效转换，因为更大或相等的值永远不会更新`best_len`。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    m = int(input())
    b = list(map(int, input().split()))

    dp = [0] * m
    parent = [-1] * m

    for i in range(n):
        best_len = 0
        best_pos = -1

        for j in range(m):
            if b[j] < a[i]:
                if dp[j] > best_len:
                    best_len = dp[j]
                    best_pos = j

            elif b[j] == a[i]:
                if best_len + 1 > dp[j]:
                    dp[j] = best_len + 1
                    parent[j] = best_pos

    length = 0
    end_pos = -1

    for j in range(m):
        if dp[j] > length:
            length = dp[j]
            end_pos = j

    sequence = []

    while end_pos != -1:
        sequence.append(b[end_pos])
        end_pos = parent[end_pos]

    sequence.reverse()

    print(length)

    if length:
        print(*sequence)
    else:
        print()

solve()
```数组`dp[j]`是中央民主党国家。 它存储最好的 LCIS 结尾，特别是`B[j]`。 这已经足够了，因为每个有效子序列都有一个唯一的最后位置`B`。 

变量`best_len`和`best_pos`为每个重置`A[i]`。 They summarize all valid previous transitions encountered so far while scanning`B`。 

The order of conditions inside the inner loop matters. We first use positions with smaller values to improve`best_len`。 Later equal values may extend from that information.

 严格比较：```
if b[j] < a[i]:
```是必不可少的。 替换为`<=`打破严格增加并错误地允许重复。 

重建数组内部存储索引`B`，而不是价值观。 这可以避免存在重复值时出现歧义。 

最后的重建是倒着走的`parent`。 由于父母指向较早的元素，因此最后收集的顺序必须颠倒过来。 

## 工作示例

 ### 示例 1

 输入：```
A = [2, 3, 1, 6, 5, 4, 6]
B = [1, 3, 5, 6]
```初始状态：```
dp = [0, 0, 0, 0]
```Processing proceeds as follows.

 | A[i] | j | B[j] | 之前的 best_len | dp 之后 |
 | --- | --- | --- | --- | --- |
 | 2 | 0 | 1 | 0 | [0,0,0,0]|
 | 3 | 0 | 1 | 0 | [0,0,0,0]|
 | 3 | 1 | 3 | 0 | [0,1,0,0] |
 | 1 | 0 | 1 | 0 | [1,1,0,0]|
 | 6 | 0 | 1 | 1 | [1,1,0,0]|
 | 6 | 1 | 3 | 1 | [1,1,0,0]|
 | 6 | 2 | 5 | 1 | [1,1,0,0]|
 | 6 | 3 | 6 | 1 | [1,1,0,2] |
 | 5 | 0 | 1 | 1 | [1,1,0,2] |
 | 5 | 1 | 3 | 1 | [1,1,0,2] |
 | 5 | 2 | 5 | 1 | [1,1,2,2]|
 | 4 | 0 | 1 | 1 | [1,1,2,2]|
 | 4 | 1 | 3 | 1 | [1,1,2,2]|
 | 6 | 3 | 6 | 2 | [1,1,2,3]|

 The final answer is length 3 with sequence`[3, 5, 6]`。 

该轨迹显示了后来的事件如何改善早期的估计。 第一个`6`只形成长度2，但是发现后`[3,5]`，第二个`6`延伸至长度 3。 

### 示例 2

 输入：```
A = [1, 1, 1]
B = [1, 1]
```| A[i] | j | B[j] | 之前的 best_len | dp 之后 |
 | --- | --- | --- | --- | --- |
 | 1 | 0 | 1 | 0 | [1,0]|
 | 1 | 1 | 1 | 0 | [1,1]|
 | 1 | 0 | 1 | 0 | [1,1]|
 | 1 | 1 | 1 | 0 | [1,1]|

 The final LCIS length is 1.

This example confirms that equal values never chain together because only strictly smaller values contribute to`best_len`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n * m) | 每对`(i, j)`被处理一次 |
 | 空间| O(米) | DP 和父数组仅依赖于第二个数组 |

 和`n, m ≤ 500`，该算法最多执行 250,000 次状态更新，这很容易满足时间限制。 由于只存储了一个 DP 行，因此内存使用量很小。 

## 测试用例```python
# helper: run solution on input string, return output string

import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())
    a = list(map(int, input().split()))

    m = int(input())
    b = list(map(int, input().split()))

    dp = [0] * m
    parent = [-1] * m

    for i in range(n):
        best_len = 0
        best_pos = -1

        for j in range(m):
            if b[j] < a[i]:
                if dp[j] > best_len:
                    best_len = dp[j]
                    best_pos = j

            elif b[j] == a[i]:
                if best_len + 1 > dp[j]:
                    dp[j] = best_len + 1
                    parent[j] = best_pos

    length = 0
    end_pos = -1

    for j in range(m):
        if dp[j] > length:
            length = dp[j]
            end_pos = j

    seq = []

    while end_pos != -1:
        seq.append(b[end_pos])
        end_pos = parent[end_pos]

    seq.reverse()

    out = [str(length)]

    if length:
        out.append(" ".join(map(str, seq)))
    else:
        out.append("")

    print("\n".join(out))

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue().strip()

# provided sample
assert run(
"""7
2 3 1 6 5 4 6
4
1 3 5 6
"""
) == "3\n3 5 6", "sample 1"

# minimum size
assert run(
"""1
5
1
5
"""
) == "1\n5", "single matching element"

# all equal values
assert run(
"""3
1 1 1
2
1 1
"""
) == "1\n1", "strictly increasing condition"

# no common elements
assert run(
"""3
1 2 3
3
4 5 6
"""
) == "0", "empty LCIS"

# off-by-one reconstruction case
assert run(
"""3
1 2 3
3
1 3 2
"""
) == "2\n1 2", "correct ordering"

# decreasing arrays
assert run(
"""5
5 4 3 2 1
5
5 4 3 2 1
"""
) == "1\n5", "only one element possible"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单个匹配元素 |`1 5`| Minimum constraints |
 | All equal values |`1 1`| 严格加码办理|
 | 没有共同元素|`0`| 空答案重构|
 |`[1,2,3]`与`[1,3,2]`|`1 2`| 正确的子序列排序 |
 | 减少数组 | 任何单一值 | LCIS 与 LCS 的不同之处

 ## 边缘情况

 考虑重复较多的数组：```
A = [1, 1, 1]
B = [1, 1]
```在处理每个`1`，算法永远不会更新`best_len`因为该条件需要严格较小的值。 因此，每次匹配仅创建长度为 1 的序列。算法正确输出：```
1
1
```现在考虑普通濒海战斗舰会失败的情况：```
A = [3, 2, 1]
B = [3, 2, 1]
```DP 演变为：```
After 3: dp = [1,0,0]
After 2: dp = [1,1,0]
After 1: dp = [1,1,1]
```No element can extend another because values always decrease. 最大长度仍为 1。 

最后，考虑一下排序陷阱：```
A = [1, 2, 3]
B = [1, 3, 2]
```加工时`2`，最好的先前值是`1`，所以算法建立`[1,2]`。 

后来在处理的时候`3`，它不能从`2`因为`2`出现在之后`3`内部数组`B`。 从左到右扫描自动强制执行子序列顺序`B`。 

算法正确输出：```
2
1 2
```
