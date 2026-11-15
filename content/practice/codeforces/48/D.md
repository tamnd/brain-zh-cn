---
title: "CF 48D - 排列"
description: "我们得到一个最初来自串联多个排列的打乱数组。 每个排列可以具有不同的大小。 连接后，所有数字都混合在一起，因此原来的分组消失了。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy"]
categories: ["algorithms"]
codeforces_contest: 48
codeforces_index: "D"
codeforces_contest_name: "School Personal Contest #3 (Winter Computer School 2010/11) - Codeforces Beta Round 45 (ACM-ICPC Rules)"
rating: 1500
weight: 48
solve_time_s: 123
verified: false
draft: false
---

[CF 48D - 排列](https://codeforces.com/problemset/problem/48/D)

 **评分：** 1500
 **标签：** 贪婪
 **求解时间：** 2m 3s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们得到一个最初来自串联多个排列的打乱数组。 每个排列可以具有不同的大小。 连接后，所有数字都混合在一起，因此原来的分组消失了。 

我们的任务是将每个数组元素分配给某种排列，以便每个组形成一个有效的排列。 大小的有效排列`k`包含来自的每个整数`1`到`k`正好一次。 

例如，如果一个组包含`{1,2,3,4}`，它是一个排列。 如果它包含`{1,2,4}`，它不是，因为`3`失踪了。 如果它包含`{1,1,2}`，也因重复而无效。 

输入仅给出打乱后的数字。 我们必须重建任何有效的分组，或者报告不存在这样的分解。 

约束条件`n ≤ 10^5`立即排除任何二次方。 重复扫描所有现有组中每个数字的解决方案的执行情况如下：`10^10`在最坏的情况下进行操作，远远超出了时间限制。 我们需要一些接近线性或`O(n log n)`。 

棘手的部分是了解什么条件使分解成为可能。 

假设值`x`出现`cnt[x]`次。 每个排列包含`x`还必须包含来自的所有数字`1`到`x-1`。 这意味着：

 - 包含的排列数`x`等于`cnt[x]`。 
- 这些相同的排列还必须包含`1,2,...,x-1`。 

因此计数必须满足：```
cnt[1] ≥ cnt[2] ≥ cnt[3] ≥ ...
```如果这种单调性在任何地方失效，重建就不可能。 

一些边缘情况很容易处理不当。 

考虑：```
3
2 2 1
```有两份`2`，所以我们需要两个包含的排列`2`。 但每个排列都包含`2`还必须包含`1`。 既然只有一个`1`，答案是不可能。 

另一个危险的情况是：```
5
1 3 1 2 2
```计数是：```
cnt[1] = 2
cnt[2] = 2
cnt[3] = 1
```这是有效的。 一种可能的分解是：```
(1,2,3)
(1,2)
```任意放置数字的粗心贪婪策略可能会在组内创建重复值，并且即使存在有效的解决方案也会失败。 

最小的情况也很重要：```
1
1
```这已经是一个有效的大小排列`1`。 

但：```
1
2
```是不可能的，因为没有排列可以包含`2`也不包含`1`。 

## 方法

 蛮力方法会尝试一一明确地构建排列。 对于数组中的每个数字，我们可以扫描所有现有组并将其放入尚未包含该值且稍后仍可能成为有效排列的组中。 

从概念上讲，这是可行的，因为唯一的要求是每个排列内部的唯一性以及较小值的存在。 但实施很快就会变得昂贵。 如果我们有最多`10^5`分组并扫描其中的每个元素，复杂性就变成了`O(n^2)`。 

排列的结构提供了更强的性质。 

如果一个排列包含`x`，那么它必须包含每个较小的正整数。 这意味着包含的排列集合`x+1`始终是包含以下内容的集合的子集`x`。 

这将问题转化为计数条件。 

假设值`x`出现`k`次。 那么正是`k`排列必须包含`x`。 由于每个排列都包含`x+1`还包含`x`，我们必须有：```
cnt[x] ≥ cnt[x+1]
```一旦这个条件适用于所有值，构建就变得容易了。 

我们可以准确地创建`cnt[1]`排列。 然后对于每个值`x`，我们将它的出现分布在最前面`cnt[x]`排列。 因为计数是不增加的，所以任何排列接收`x`之前已经收到了所有较小的值。 

这种贪心赋值足以保证有效性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n²) | O(n²) | 太慢了|
 | 最佳 | O(n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取数组并计算每个值的频率。 

让`cnt[x]`是值出现的次数`x`。 
2. 检查频率是否不增加。 

对于每一个`x > 1`， 核实：```
cnt[x] ≤ cnt[x-1]
```如果失败，则打印`-1`。 

原因是结构性的。 每个排列包含`x`还必须包含`x-1`，所以不能有更多的副本`x`比副本`x-1`。 
3.创建`cnt[1]`排列。 

每个有效的排列必须包含`1`，因此排列的数量被迫等于 1 的数量。 
4. 贪婪地分配事件。 

对于每个值`x`，将其出现次数分布在排列中`1`通过`cnt[x]`。 

具体来说，如果`x`出现三次，将它们分配给排列`1`,`2`， 和`3`。 
5. 给出原始数组顺序的答案。 

由于数组被打乱了，我们需要为每个出现的地方单独赋值。 存储每个值的排列 ID 队列。 遍历原数组时，从对应队列中弹出一个ID。 

### 为什么它有效

 关键的不变量是：```
If permutation p receives value x, then it has already received every value from 1 to x-1.
```这仍然是正确的，因为值是按升序处理的，并且值`x`仅分配给第一个`cnt[x]`排列。 自从：```
cnt[x] ≤ cnt[x-1]
```那些已经收到的排列`x-1`。 

每个排列最终都包含：```
1,2,...,k
```对于某些人来说`k`，这正是一个有效的排列。 

## Python 解决方案```python
import sys
from collections import defaultdict, deque

input = sys.stdin.readline

def solve():
    n = int(input())
    a = list(map(int, input().split()))

    freq = defaultdict(int)

    for x in a:
        freq[x] += 1

    mx = max(a)

    for x in range(2, mx + 1):
        if freq[x] > freq[x - 1]:
            print(-1)
            return

    groups = freq[1]

    assign = defaultdict(deque)

    for x in range(1, mx + 1):
        for group_id in range(1, freq[x] + 1):
            assign[x].append(group_id)

    ans = []

    for x in a:
        ans.append(assign[x].popleft())

    print(groups)
    print(*ans)

solve()
```第一部分计算频率。 使用`defaultdict(int)`避免手动存在检查并保持代码干净。 

单调性检查就是整个可行性测试。 如果某个值比前一个值出现的次数更多，则无法进行重建，因为较大值的每个副本都需要相同排列中较小值的不同副本。 

排列数固定为`freq[1]`。 每个有效的排列必须包含`1`，因此排列的个数不能多于个，并且每个排列都属于不同的排列。 

分配结构很微妙。 对于每个值`x`，我们预先计算哪些排列 ID 应该接收它：```
1, 2, ..., freq[x]
```之后，在遍历原始数组顺序时，我们使用以下方法一一消耗这些 ID：`popleft()`。 

即使相等的值分散在整个数组中，这也可以保持正确性。 

一个常见的错误是尝试在第一次遍历期间直接分配而不分离出现的事件。 这通常会在同一排列中创建重复的值。 

## 工作示例

 ### 示例 1

 输入：```
9
1 2 3 1 2 1 4 2 5
```频率：```
cnt[1] = 3
cnt[2] = 3
cnt[3] = 1
cnt[4] = 1
cnt[5] = 1
```计数不会增加，因此可以进行构建。 

准备的作业：```
1 -> [1,2,3]
2 -> [1,2,3]
3 -> [1]
4 -> [1]
5 -> [1]
```处理原始数组：

 | 位置 | 价值| 指定排列 | 剩余队列 |
 | ---| ---| ---| ---|
 | 1 | 1 | 1 | [2,3]|
 | 2 | 2 | 1 | [2,3]|
 | 3 | 3 | 1 | []|
 | 4 | 1 | 2 | [3] |
 | 5 | 2 | 2 | [3] |
 | 6 | 1 | 3 | []|
 | 7 | 4 | 1 | []|
 | 8 | 2 | 3 | []|
 | 9 | 5 | 1 | []|

 最终输出：```
3
1 1 1 2 2 3 1 3 1
```该迹线显示了中心不变量。 每个接收较大数字的排列都已经接收了所有较小的数字。 

### 示例 2

 输入：```
3
2 2 1
```频率：

 | 价值| 计数 |
 | ---| ---|
 | 1 | 1 |
 | 2 | 2 |

 现在：```
cnt[2] > cnt[1]
```所以重建是不可能的。 

输出：```
-1
```这说明了为什么频率条件是必要的。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个元素都被计数并分配一次 |
 | 空间| O(n) | 频率表和分配队列最多存储 n 个值 |

 该解决方案完全符合约束条件。 和`n = 10^5`，在 Python 中，线性处理很容易在 1 秒限制内足够快。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import defaultdict, deque

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    out = io.StringIO()
    sys.stdout = out

    def solve():
        n = int(input())
        a = list(map(int, input().split()))

        freq = defaultdict(int)

        for x in a:
            freq[x] += 1

        mx = max(a)

        for x in range(2, mx + 1):
            if freq[x] > freq[x - 1]:
                print(-1)
                return

        groups = freq[1]

        assign = defaultdict(deque)

        for x in range(1, mx + 1):
            for group_id in range(1, freq[x] + 1):
                assign[x].append(group_id)

        ans = []

        for x in a:
            ans.append(assign[x].popleft())

        print(groups)
        print(*ans)

    solve()

    sys.stdout = sys.__stdout__
    return out.getvalue().strip()

# provided-style sample
assert run(
"""9
1 2 3 1 2 1 4 2 5
"""
).splitlines()[0] == "3"

# minimum valid case
assert run(
"""1
1
"""
) == """1
1"""

# impossible because 2 appears without enough 1s
assert run(
"""3
2 2 1
"""
) == "-1"

# all equal ones, each forms its own permutation
assert run(
"""4
1 1 1 1
"""
).splitlines()[0] == "4"

# exact single permutation
assert run(
"""5
1 2 3 4 5
"""
) == """1
1 1 1 1 1"""

# boundary monotonicity failure
assert run(
"""5
1 2 2 3 3
"""
) == "-1"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 / 1`| 一种排列 | 最小有效输入 |
 |`2 2 1`|`-1`| 缺少较小的值 |
 |`1 1 1 1`| 四种排列 | 多个 size-1 排列 |
 |`1 2 3 4 5`| 一种排列 | 单一完全排列 |
 |`1 2 2 3 3`|`-1`| 违反频率单调性 |

 ## 边缘情况

 考虑：```
3
2 2 1
```频率变为：```
cnt[1] = 1
cnt[2] = 2
```在验证过程中，算法会检查：```
2 > 1
```并立即拒绝输入。 

这是正确的，因为每个排列都包含`2`还必须包含`1`。 两份`2`需要两份副本`1`。 

现在考虑：```
5
1 3 1 2 2
```频率：```
cnt[1] = 2
cnt[2] = 2
cnt[3] = 1
```作业：```
1 -> [1,2]
2 -> [1,2]
3 -> [1]
```加工顺序：

 | 价值| 指定排列 |
 | ---| ---|
 | 1 | 1 |
 | 3 | 1 |
 | 1 | 2 |
 | 2 | 1 |
 | 2 | 2 |

 排列 1 变为：```
(1,2,3)
```排列 2 变为：```
(1,2)
```即使数组顺序被打乱，构造仍然成功，因为分配仅取决于频率。 

最后，检查：```
1
2
```我们得到：```
cnt[1] = 0
cnt[2] = 1
```单调性条件立即失效：```
1 > 0
```没有排列可以开始于`2`，所以算法正确输出`-1`。
