---
title: "CF 1506D - 史诗般的转变"
description: "我们得到一个整数数组，并且允许我们重复删除彼此不同的元素对。 我们的任务是确定在多次应用此操作后数组可以具有的最小大小。"
date: "2026-06-10T20:18:40+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1506
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 710 (Div. 3)"
rating: 1400
weight: 1506
solve_time_s: 141
verified: true
draft: false
---

[CF 1506D - 史诗般的转变](https://codeforces.com/problemset/problem/1506/D)

 **评分：** 1400
 **标签：** 构造性算法、数据结构、贪婪
 **求解时间：** 2m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个整数数组，并且允许我们重复删除彼此不同的元素对。 我们的任务是确定在多次应用此操作后数组可以具有的最小大小。 输入由多个测试用例组成，每个测试用例都有自己的数组。 输出只是最佳对删除后每个数组的最小可能长度。 

查看约束，在单个测试用例中数组可以有 2×10^5 个元素那么大，并且所有测试用例的总数上限为 2×10^5。 这立即排除了任何尝试显式模拟每个可能的对删除的解决方案，因为在最坏的情况下这可能涉及 O(n^2) 操作。 每个测试用例我们都需要一种线性或近线性的方法。 每个元素值可能非常大，最多 10^9，因此任何依赖于创建由值本身索引的频率数组的解决方案都是不可行的。 我们需要处理计数，而不是值范围。 

需要仔细注意的边缘情况包括所有元素都相等的数组。 例如，`[1, 1, 1]`不能删除任何对，因此结果是 3。另一个棘手的情况是最常见数字的计数在数组中占主导地位。 例如，`[1, 1, 1, 2, 3]`只允许删除两对（`1-2`和`1-3`），留下一个`1`在后面。 如果不考虑计数的分布，任意删除对的简单方法可能会产生次优的最终大小。 

## 方法

 暴力法是模拟重复删除任意两个不同的数字。 您可以选择对，删除它们，然后重复，直到不再有对为止。 如果仔细实现，这可以保证产生正确的答案，但最坏情况的复杂度是 O(n^2)，对于 n = 2×10^5 来说太慢了。 

关键的见解是我们只需要知道每个数字的频率。 假设出现最频繁的数字`max_count`次，其余元素总计`rest_count = n - max_count`。 如果`rest_count`大于或等于`max_count`，然后我们可以将最频繁出现的数字与某个不同的元素配对，并根据奇偶校验将数组减少到 0 或 1 个元素。 如果`rest_count`小于`max_count`，那么即使将所有其他元素与最频繁的元素配对后，也会有`max_count - rest_count`剩下的元素，无法删除。 因此，最小数组大小为`max(1, max_count - rest_count)`如果`max_count > rest_count`和`n % 2`否则。 

这一观察结果使我们能够使用频率图在 O(n) 时间内解决每个测试用例。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n^2) | O(n^2) | O(n) | 太慢了|
 | 频率分析| O(n) | O(n) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量。 
2. 对于每个测试用例，读取数组长度`n`和数组`a`。 
3. 计算数组中每个数字的出现次数。 这可以使用字典或`collections.Counter`。 
4. 确定最大频率`max_count`。 
5. 计算所有其他频率的总和`rest_count = n - max_count`。 
6. 如果`max_count`大于`rest_count`，最小数组大小为`max_count - rest_count`因为这些元素不能与任何不同的东西搭配。 
7.如果`max_count`小于或等于`rest_count`，那么我们可以最佳地删除对，直到保留 0 或 1 个元素，因此最小大小为`n % 2`。 
8. 打印每个测试用例的最小尺寸。 

这里的不变量是最大频率元素决定其余元素的下限。 如果其他元素足以与其配对，则可以将它们全部删除。 否则，多余的部分仍然存在。 

## Python 解决方案```python
import sys
input = sys.stdin.readline
from collections import Counter

t = int(input())
for _ in range(t):
    n = int(input())
    a = list(map(int, input().split()))
    freq = Counter(a)
    max_count = max(freq.values())
    rest_count = n - max_count
    if max_count > rest_count:
        print(max_count - rest_count)
    else:
        print(n % 2)
```代码首先有效地读取所有输入。`Counter`构建频率图，这使我们能够快速确定最常见的元素。`max_count`和`rest_count`捕获确定最小阵列大小所需的两个关键量。 然后我们直接应用算法的推理：如果最频繁的元素占主导地位，我们输出多余的； 否则，我们在最大配对后输出数组大小的奇偶校验。 

## 工作示例

 ### 输入示例 1```
6
1 6 1 1 4 4
```| 变量| 价值|
 | --- | --- |
 | 频率 | {1:3, 6:1, 4:2} |
 | 最大计数 | 3 |
 | 休息计数 | 3 |
 | 输出| n % 2 = 6 % 2 = 0 |

 说明：我们可以配对`1-6`,`1-4`,`1-4`删除所有元素。 最小数组大小为 0。 

### 输入示例 2```
5
4 5 4 5 4
```| 变量| 价值|
 | --- | --- |
 | 频率 | {4:3, 5:2} |
 | 最大计数 | 3 |
 | 休息计数 | 2 |
 | 输出| 最大计数 - 剩余计数 = 3 - 2 = 1 |

 说明：只能删除两对：`4-5`和`4-5`，留下一个`4`在后面。 最小数组大小为 1。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 每个测试用例 O(n) | 计算频率是线性的，在小字典中查找最大值在唯一元素中是线性的，total ≤ n。 |
 | 空间| O(n) | 我们存储数组和频率图； 频率图最多有 n 个键。 |

 所有测试用例总共 n ≤ 2×10^5，这非常适合 2 秒时间限制和 256 MB 内存。 

## 测试用例```python
import sys, io
from collections import Counter

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = []
    t = int(input())
    for _ in range(t):
        n = int(input())
        a = list(map(int, input().split()))
        freq = Counter(a)
        max_count = max(freq.values())
        rest_count = n - max_count
        if max_count > rest_count:
            output.append(str(max_count - rest_count))
        else:
            output.append(str(n % 2))
    return "\n".join(output)

# provided samples
assert run("5\n6\n1 6 1 1 4 4\n2\n1 2\n2\n1 1\n5\n4 5 4 5 4\n6\n2 3 2 1 3 1\n") == "0\n0\n2\n1\n0"

# custom cases
assert run("1\n1\n42\n") == "1"  # single element
assert run("1\n4\n7 7 7 7\n") == "4"  # all equal
assert run("1\n5\n1 2 3 4 5\n") == "1"  # all unique odd
assert run("1\n6\n1 1 2 2 3 3\n") == "0"  # all paired perfectly
assert run("1\n7\n1 1 1 2 2 2 3\n") == "1"  # one excess
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1\n1\n42`| 1 | 单个元素不能配对 |
 |`1\n4\n7 7 7 7`| 4 | 所有元素相同|
 |`1\n5\n1 2 3 4 5`| 1 | 所有唯一的奇数个元素 |
 |`1\n6\n1 1 2 2 3 3`| 0 | 所有元素都可以精确配对 |
 |`1\n7\n1 1 1 2 2 2 3`| 1 | 最大配对后剩余元素 |

 ## 边缘情况

 对于元素全部相等的数组，该算法计算`max_count = n`,`rest_count = 0`，和输出`max_count - rest_count = n`。 例如，`[7, 7, 7, 7]`正确输出 4。对于恰好有两个不同元素出现数量相等的数组，例如`[1, 1, 2, 2]`,`max_count = 2`,`rest_count = 2`，输出为`n % 2 = 4 % 2 = 0`，确认可以全部删除。 该解决方案可以正确处理单元素数组、具有一个主数的数组以及具有完美配对机会的数组。
