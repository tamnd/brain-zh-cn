---
title: "CF 1808D - Petya、Petya、Petr 和回文"
description: "对于每个奇数长度 k 的子数组，我们想知道需要多少次元素替换才能将该子数组变成回文。 答案是所有长度为 k 的子数组上这些值的总和。"
date: "2026-06-09T08:58:14+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "brute-force", "data-structures", "two-pointers"]
categories: ["algorithms"]
codeforces_contest: 1808
codeforces_index: "D"
codeforces_contest_name: "Codeforces Round 861 (Div. 2)"
rating: 2100
weight: 1808
solve_time_s: 137
verified: true
draft: false
---

[CF 1808D - Petya、Petya、Petr 和回文](https://codeforces.com/problemset/problem/1808/D)

 **评分：** 2100
 **标签：** 二分查找、暴力破解、数据结构、两个指针
 **求解时间：** 2m 17s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个奇数长度的子数组`k`，我们想知道需要多少次元素替换才能将该子数组变成回文。 答案是所有长度上这些值的总和 -`k`子数组。 

对于固定的奇数长度子数组，左侧的每个位置都与右侧的对称位置配对。 如果两个值已经相等，则无需替换该对。 如果它们不同，只需替换一次就足够了。 因为不同的对称对是独立的，所以子数组的回文性就是不匹配的对称对的数量。 

数组长度最大为`2 * 10^5`，因此检查每个子数组及其内部的每一对是不可能的。 最多有`2 * 10^5`窗口，每个窗口最多可以包含`10^5`对称对。 二次或三次解远远超出了限制。 

当出现一个微妙的情况时`k = 1`。 每个长度为 1 的子数组都已经是回文，所以答案总是`0`。 

例如：```
3 1
5 7 9
```正确的输出是：```
0
```假设每个窗口至少贡献一对的解决方案在这里将失败。 

另一个容易出错的地方是数组边界附近。```
5 3
1 2 1 2 1
```相等的一对`(0, 2)`属于有效的长度为 3 的窗口，因此`(2, 4)`。 这对`(0, 4)`不属于任何长度为 3 的窗口，即使它围绕中心对称。 计算距离约束内的所有相等对而不检查中心是否可以是有效窗口的中心会给出错误的结果。 

第三个陷阱是平等。 围绕整数中心的对称位置始终具有相同的奇偶校验。 职位`1`和`2`永远不能在奇数长度窗口内形成对称对，因为它们的中点不是数组索引。 

## 方法

 暴力解法直接遵循定义。 对于每个长度的窗口`k`，比较每个对称对并计算不匹配的数量。 这是正确的，因为每个不匹配都需要一次替换，而每个匹配对则不需要替换。 

问题是成本。 有`n - k + 1`窗户和`(k - 1) / 2`每个窗口对。 在最坏的情况下，这大约变成`2 * 10^10`比较，太大了。 

关键的观察是停止考虑窗口并开始考虑对称对。 

让```
m = (k - 1) / 2
```每个有效窗口都准确贡献`m`对称对。 由于有`n - k + 1`窗口中，对称对出现的总数为```
(n - k + 1) * m
```如果我们将每一对都视为不匹配，那就是答案。 唯一的修正是相等的对称对贡献`0`而不是`1`。 

那么问题就变成了：```
How many valid symmetric pair appearances have equal values?
```每个对称对由两个位置标识`(i, j)`。 

该对被使用了一些长度-`k`窗口当且仅当：```
1. i and j have the same parity.
2. j - i <= 2m.
3. Their midpoint lies inside the range of valid window centers.
```现在我们只需要计算满足这些条件的等值位置对即可。 

具有不同价值的头寸是无关的，因此我们按价值对指数进行分组。 在每个值组内，索引都是排序的。 对于每个索引`i`，我们计算位置间隔`j`满足所有有效性约束，然后使用二分搜索计算有多少个等值索引落入该区间内。 

这将问题减少到`O(n log n)`。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(nk) | O(nk) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 让`m = (k - 1) // 2`。 
2. 计算```
total_pairs = (n - k + 1) * m
```这是所有窗口中对称对出现的数量。 
3. 按值和奇偶校验对数组位置进行分组。 

具有不同奇偶性的位置永远不能围绕整数中心形成对称对，因此我们为每个值存储两个列表。 
4. 对于每个位置`p`在一个奇偶校验列表中，确定哪些等值位置`q > p`可以组成有效的对称对。 
5. 中点条件给出```
m <= (p + q) / 2 <= n - m - 1
```这变成```
2m - p <= q <= 2(n - m - 1) - p
```6. 距离条件给出```
q <= p + 2m
```7. 结合所有约束条件，```
low = max(p + 1, 2m - p)
up  = min(p + 2m, 2(n - m - 1) - p)
```8. 在排序后的奇偶校验列表中使用二分查找来计算有多少个位置`[low, up]`。 
9. 将所有这些计数加起来`equal_pairs`。 
10. 每个有效的对称对外观都贡献`1`如果值不同或`0`如果值相等，那么```
answer = total_pairs - equal_pairs
```### 为什么它有效

 每个窗口中出现的每个对称对恰好对应于一对阵列位置`(i, j)`其中点是窗口中心。 导出的三个条件正是这种窗口存在的条件。`total_pairs`计算所有对称对的出现。`equal_pairs`精确计算端点已经匹配的外观。 每个匹配对都贡献`0`回文性而不是`1`，因此减去它们就得到了不匹配的对称对出现的数量，这就是所需的回文性之和。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right
from collections import defaultdict

input = sys.stdin.readline

n, k = map(int, input().split())
a = list(map(int, input().split()))

m = (k - 1) // 2

total_pairs = (n - k + 1) * m

pos = defaultdict(lambda: [[], []])

for i, x in enumerate(a):
    pos[x][i & 1].append(i)

equal_pairs = 0

for parity_lists in pos.values():
    for arr in parity_lists:
        for idx, p in enumerate(arr):
            low = max(p + 1, 2 * m - p)
            up = min(p + 2 * m, 2 * (n - m - 1) - p)

            if low > up:
                continue

            l = bisect_left(arr, low, idx + 1)
            r = bisect_right(arr, up)

            equal_pairs += r - l

print(total_pairs - equal_pairs)
```第一部分计算所有窗口中对称对出现的总数。 

字典按值和奇偶性对索引进行分组。 按奇偶校验拆分至关重要，因为整数中心周围的对称位置始终具有相等的奇偶校验。 如果没有这种分离，具有非整数中点的对将被错误地计数。 

对于固定位置`p`, 区间`[low, up]`是所有有效性约束的交集。 该区间内的每个等值位置形成一个匹配的对称对外观。 

二分搜索以对数时间计算这些位置。 由于每个索引都属于一个列表，因此总工作量为`O(n log n)`。 

所有算术都适合 Python 整数。 答案大致可以达到`10^10`，因此在其他语言中使用 32 位整数是不安全的。 

## 工作示例

 ### 示例 1

 输入：```
8 5
1 2 8 2 5 2 8 6
```这里：```
m = 2
total_pairs = 4 * 2 = 8
```有效的相等对称对：

 | p| 问 | 价值| 算了？ |
 | --- | --- | --- | --- |
 | 1 | 3 | 2 | 是的 |
 | 2 | 6 | 8 | 是的 |
 | 3 | 5 | 2 | 是的 |
 | 1 | 5 | 2 | 没有 |

 最后一对相距太远。 

所以：

 | 数量 | 价值|
 | --- | --- |
 | 总对数 | 8 |
 | 相等对 | 4 |
 | 答案| 4 |

 输出：```
4
```此示例表明答案不是逐个窗口计算的。 我们计算全局所有对称对的出现并减去匹配的。 

### 示例 2

 输入：```
9 9
1 2 3 4 5 4 3 2 1
```这里：```
m = 4
total_pairs = 1 * 4 = 4
```唯一的窗口已经是回文。 

| 对称对| 平等的？ |
 | --- | --- |
 | (0, 8) | (0, 8) | 是的 |
 | (1, 7) | 是的 |
 | (2, 6) | 是的 |
 | (3, 5) | 是的 |

 因此：

 | 数量 | 价值|
 | --- | --- |
 | 总对数 | 4 |
 | 相等对 | 4 |
 | 答案| 0 |

 输出：```
0
```这表明，当每个对称对匹配时，减法会消除所有贡献。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个索引都参与其值奇偶校验组内的二分搜索 |
 | 空间| O(n) | 分组仓位的存储 |

 和`n ≤ 2 · 10^5`， 一个`O(n log n)`解决方案仅执行几百万次操作，并且可以轻松满足时间限制。 辅助存储器与索引的数量成线性关系。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_left, bisect_right
from collections import defaultdict

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    m = (k - 1) // 2
    total_pairs = (n - k + 1) * m

    pos = defaultdict(lambda: [[], []])

    for i, x in enumerate(a):
        pos[x][i & 1].append(i)

    equal_pairs = 0

    for parity_lists in pos.values():
        for arr in parity_lists:
            for idx, p in enumerate(arr):
                low = max(p + 1, 2 * m - p)
                up = min(p + 2 * m, 2 * (len(a) - m - 1) - p)

                if low > up:
                    continue

                l = bisect_left(arr, low, idx + 1)
                r = bisect_right(arr, up)

                equal_pairs += r - l

    return str(total_pairs - equal_pairs)

# provided sample
assert run("8 5\n1 2 8 2 5 2 8 6\n") == "4"

# minimum size
assert run("1 1\n7\n") == "0"

# all equal
assert run("5 3\n4 4 4 4 4\n") == "0"

# k = 1
assert run("4 1\n1 2 3 4\n") == "0"

# off-by-one around borders
assert run("5 3\n1 2 1 2 1\n") == "0"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 7`|`0`| 最小输入尺寸 |
 |`5 3 / 4 4 4 4 4`|`0`| 每个窗口都已经是回文 |
 |`4 1 / 1 2 3 4`|`0`| 特例`k = 1`|
 |`5 3 / 1 2 1 2 1`|`0`| 边界中心约束和奇偶校验处理|

 ## 边缘情况

 考虑：```
3 1
5 7 9
```我们有`m = 0`， 所以```
total_pairs = 0
```任何窗口中都不存在对称对。 算法立即返回`0`。 

考虑：```
5 3
1 2 1 2 1
```有效中心是位置`1`,`2`， 和`3`。 

这对`(0, 4)`具有相等的值和整数中点，但其距离为`4`，大于`2m = 2`。 它永远不会在长度为 3 的窗口中显示为对称对。 区间计算会自动排除它。 

考虑：```
5 5
1 1 2 1 1
```这对`(0, 1)`具有相同的值但不同的奇偶性。 它的中点不是整数数组位置，因此它不能围绕奇数长度窗口的中心对称。 由于索引在计数之前由奇偶校验分隔，因此永远不会考虑该对。 

这些情况正是许多不正确的实现过度计数匹配对的地方。 间隔和奇偶校验条件消除了所有无效对。
