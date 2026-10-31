---
title: "CF 160C - 寻找配对"
description: "给定一个包含 n 个整数的数组。 从这个数组中，我们形成每个有序对 (a[i], a[j])，包括 i = j 的对。 由于两个位置都是独立选择的，因此正好有 n² 对。 所有这些对都按字典顺序排序。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 160
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 111 (Div. 2)"
rating: 1700
weight: 160
solve_time_s: 107
verified: true
draft: false
---

[CF 160C - 查找配对](https://codeforces.com/problemset/problem/160/C)

 **评分：** 1700
 **标签：** 实现、数学、排序
 **求解时间：** 1m 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个数组`n`整数。 从这个数组中，我们形成每个有序对`(a[i], a[j])`，包括对，其中`i = j`。 由于两个位置都是独立选择的，因此有确切的`n²`对。 

所有这些对都按字典顺序排序。 这意味着对首先按第一个值排序，如果相等，则按第二个值排序。 

任务是输出`k`按此排序顺序的第 - 对。 

这些约束完全排除了直接生成所有对的可能性。 什么时候`n = 10^5`，总对数变为`10^10`，这远远超出了内存所能容纳或及时处理的范围。 在 1 秒的限制下，即使迭代所有对一次也已经是不可能的了。 

这迫使我们利用字典顺序的结构，而不是显式地构建列表。 

一个微妙的问题是数组可能包含重复的值。 排序基于值，而不是索引。 如果数组是`[1, 1, 2]`，然后配对以`1`出现多次，因为出现了两次`1`。 

例如：```
Input:
3 4
1 1 2
```排序后的所有对是：```
(1,1)
(1,1)
(1,2)
(1,1)
(1,1)
(1,2)
(2,1)
(2,1)
(2,2)
```第 4 对是`(1,1)`。 

将重复项压缩为唯一值的粗心实现会产生错误的多重性。 

另一个容易犯的错误是混合基于 0 和基于 1 的索引`k`。 

考虑：```
Input:
2 1
5 7
```排序对：```
(5,5)
(5,7)
(7,5)
(7,7)
```第一对是`(5,5)`。 

如果我们减去一`k`太晚或太早，我们可能会意外返回`(5,7)`反而。 

大值也很重要，因为`k`可以大到`n² = 10^10`。 对于某些语言来说，32 位整数是不够的。 Python 自然地处理这个问题，但在 C++ 中我们需要`long long`。 

## 方法

 蛮力的想法很简单。 生成全部`n²`有序对，按字典顺序对它们进行排序，然后打印`k`第-对。 

这是有效的，因为字典排序直接匹配问题陈述。 问题在于规模。 和`n = 10^5`，对的数量变为`10^10`。 即使存储这些对也需要巨大的内存，并且对它们进行排序是完全不可行的。 

关键的观察是，对原始数组进行排序后，字典顺序具有非常规则的结构。 

假设排序后的数组为：```
b[0], b[1], ..., b[n-1]
```然后每对开头`b[0]`首先出现，然后是每对以`b[1]`， 等等。 

每个元素都准确贡献`n`连续的对作为第一个组件。 

例如，如果：```
b = [1, 2, 5]
```然后排序对按如下方式分组：```
First element = 1:
(1,1), (1,2), (1,5)

First element = 2:
(2,1), (2,2), (2,5)

First element = 5:
(5,1), (5,2), (5,5)
```这意味着可以通过确定哪个块的大小来找到答案的第一个元素`n`包含`k`第-对。 

一旦第一个值固定，第二个值就由该块内的位置确定。 

重复会使事情稍微复杂一些，因为几个连续的索引可能包含相同的值。 如果出现一个值`cnt`次，然后以该值开头的所有对都占据`cnt * n`连续的位置。 

第二个分量也是从排序数组中选择的。 当我们确定了第一个值之后，我们只需要确定排序数组中的哪个元素对应于剩余的偏移量。 

这将问题简化为排序位置的算术问题，而不是显式的对生成。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n² log n²) | O(n² log n²) | O(n²) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1.读取数组并排序。 

字典顺序仅取决于值，因此对数组进行排序可以揭示对排序的确切结构。 
2. 转换`k`通过减去 1 变为基于 0 的索引。 

这使得块计算更容易，因为整数除法自然地使用基于 0 的偏移量。 
3. 计算第一个元素的索引为`first_idx = k // n`。 

排序数组中的每个元素都准确贡献`n`对作为第一个组件。 除以`n`告诉我们哪个块包含答案。 
4.让`first_value = b[first_idx]`。 

这是答案对的第一个数字。 
5.数数有多少次`first_value`出现在已排序的数组中。 

假设出现`cnt`次并且它的第一次出现在索引处`l`。 

然后所有以开头的对`first_value`占据一大片连续的尺寸`cnt * n`。 
6. 计算所需的线对在该线段内的距离。 

该段之前的对数为`l * n`。 

所以：```
offset = k - l * n
```7. 第二个元素由下式确定：```
second_idx = offset // cnt
```每个不同的第二个值重复`cnt`次因为有`cnt`第一个组件的选择相同。 
8. 输出：```
(first_value, b[second_idx])
```### 为什么它有效

 对数组进行排序后，字典顺序按其第一个组件对对进行分组。 一个值的每次出现都会贡献一个完整的块`n`对。 

如果一个值出现多次，这些块就会变得相邻，因为第一个分量相等。 在这个组合段内，第二个元素按排序顺序出现，并且每个元素都完全重复`cnt`次，第一个值每次出现一次。 

该算法准确识别哪个段包含`k`-th 对，然后确定哪个重复的第二值对应于剩余偏移量。 由于该结构与字典顺序完全匹配，因此生成的对必须是正确的。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))

a.sort()

k -= 1

first_idx = k // n
first_value = a[first_idx]

left = bisect_left(a, first_value)
right = bisect_right(a, first_value)

cnt = right - left

offset = k - left * n
second_idx = offset // cnt

print(first_value, a[second_idx])
```该解决方案首先对数组进行排序，因为字典对顺序直接遵循排序值顺序。 

转换后`k`转换为基于 0 的索引，表达式`k // n`识别答案属于哪一组对。 每个指标都贡献准确`n`对作为第一个组件，因此整数除法会立即隔离正确的块。 

下一步使用以下方法找到相等值的完整范围`bisect_left`和`bisect_right`。 这是必要的，因为重复的第一个值会按照字典顺序合并到一个更大的段中。 

表达式：```
offset = k - left * n
```删除属于较小第一个值的所有对。 剩下的是段内第一个分量等于的位置`first_value`。 

在该段内，每隔一个值都准确显示`cnt`连续多次。 除以`cnt`给出正确的第二个元素索引。 

一个微妙的一点是`second_idx`直接引用已排序的数组。 我们不压缩重复项，因为重复的值必须在排序中保持重复。 

另一个微妙的细节是到处都使用整数除法。 由于排序形成完全规则的块，因此楼层划分将位置映射到值，而无需任何二分搜索或模拟。 

## 工作示例

 ### 示例 1

 输入：```
2 4
2 1
```排序数组：```
[1, 2]
```转换为基于 0 的索引后：```
k = 3
```| 步骤| 价值|
 | ---| ---|
 |`first_idx = k // n`|`3 // 2 = 1`|
 |`first_value`|`2`|
 |`left`|`1`|
 |`right`|`2`|
 |`cnt`|`1`|
 |`offset = k - left*n`|`3 - 2 = 1`|
 |`second_idx = offset // cnt`|`1 // 1 = 1`|
 | 回答 |`(2, 2)`|

 此示例显示了最简单的块结构。 每个值都出现一次，因此每个第一个组件恰好拥有一个大小块`n`。 

### 示例 2

 输入：```
3 2
3 1 5
```排序数组：```
[1, 3, 5]
```转换为基于 0 的索引后：```
k = 1
```| 步骤| 价值|
 | ---| ---|
 |`first_idx = k // n`|`1 // 3 = 0`|
 |`first_value`|`1`|
 |`left`|`0`|
 |`right`|`1`|
 |`cnt`|`1`|
 |`offset = k - left*n`|`1 - 0 = 1`|
 |`second_idx = offset // cnt`|`1 // 1 = 1`|
 | 回答 |`(1, 3)`|

 该跟踪演示了如何在与第一个值对应的块内选择第二个组件。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log n) | O(n log n) | 排序在运行时占据主导地位
 | 空间| O(n) | 排序后的数组被存储|

 该解决方案很容易满足约束条件。 排序`10^5`在 Python 中，整数的速度足以满足 1 秒的限制，并且由于二分搜索，所有剩余的操作都是恒定时间或对数的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_left, bisect_right

def solve():
    input = sys.stdin.readline

    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    a.sort()

    k -= 1

    first_idx = k // n
    first_value = a[first_idx]

    left = bisect_left(a, first_value)
    right = bisect_right(a, first_value)

    cnt = right - left

    offset = k - left * n
    second_idx = offset // cnt

    print(first_value, a[second_idx])

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out.strip()

# provided samples
assert run("2 4\n2 1\n") == "2 2", "sample 1"
assert run("3 2\n3 1 5\n") == "1 3", "sample 2"

# minimum size
assert run("1 1\n42\n") == "42 42", "single element"

# all equal values
assert run("3 5\n7 7 7\n") == "7 7", "all equal"

# duplicate handling
assert run("3 4\n1 1 2\n") == "1 1", "duplicate multiplicity"

# last possible pair
assert run("2 4\n1 5\n") == "5 5", "largest k"

print("All tests passed")
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 1 / 42`|`42 42`| 最小尺寸数组 |
 |`3 5 / 7 7 7`|`7 7`| 所有值均相同 |
 |`3 4 / 1 1 2`|`1 1`| 正确处理重复的多重性 |
 |`2 4 / 1 5`|`5 5`| 最大有效`k`|

 ## 边缘情况

 考虑重复较多的情况：```
Input:
3 4
1 1 2
```排序数组：```
[1, 1, 2]
```所有对按顺序排列为：```
(1,1)
(1,1)
(1,2)
(1,1)
(1,1)
(1,2)
(2,1)
(2,1)
(2,2)
```正确答案是第四对，`(1,1)`。 

该算法计算：```
k = 3
first_idx = 1
first_value = 1
cnt = 2
offset = 3
second_idx = 1
```这给出了`(1,1)`。 

这是有效的，因为该算法保留了多重性而不是压缩相等的值。 

现在考虑最小的可能输入：```
Input:
1 1
42
```只有一对：```
(42,42)
```该算法计算：```
k = 0
first_idx = 0
second_idx = 0
```并返回`(42,42)`正确。 

最后，考虑最大的词典对：```
Input:
2 4
1 5
```排序对是：```
(1,1)
(1,5)
(5,1)
(5,5)
```第 4 对是`(5,5)`。 

该算法发现：```
k = 3
first_idx = 1
first_value = 5
offset = 1
second_idx = 1
```它正确地指向排序中的最后一对。
