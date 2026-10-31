---
title: "CF 1612B - 特殊排列"
description: "我们被要求构造一个从 1 到 n 的数字排列，其中 n 是偶数。 该排列被分成相等的两半：前 n/2 个元素形成左半部，其余 n/2 个元素形成右半部。 必须同时满足两个条件。"
date: "2026-06-10T06:57:36+07:00"
tags: ["codeforces", "competitive-programming", "constructive-algorithms", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1612
codeforces_index: "B"
codeforces_contest_name: "Educational Codeforces Round 117 (Rated for Div. 2)"
rating: 900
weight: 1612
solve_time_s: 96
verified: false
draft: false
---

[CF 1612B - 特殊排列](https://codeforces.com/problemset/problem/1612/B)

 **评分：** 900
 **标签：** 构造性算法，贪心
 **求解时间：** 1m 36s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们被要求构造一个从 1 到 n 的数字排列，其中 n 是偶数。 该排列被分成相等的两半：前 n/2 个元素形成左半部，其余 n/2 个元素形成右半部。 

必须同时满足两个条件。 在左半部分，最小值必须恰好是 a。 在右半部分，最大值必须恰好是 b。 如果 1 到 n 的排列都不能满足这两个约束，我们必须输出 -1。 

这不是要优化任何东西，而是要放置数字，以便两个特定的极值条件保持在排列的两个不相交的部分中。 关键的困难在于从 1 到 n 的每个数字都必须恰好出现一次，因此放置 a 和 b 会影响两半仍然可用的内容。 

约束很小，n 最多为 100 个，最多 1000 个测试用例。 这立即告诉我们每个测试用例的 O(n^2) 甚至 O(n) 就足够了。 真正的挑战纯粹是结构性的。 

幼稚的方法可能会尝试所有排列，甚至贪婪地填补位置，而不考虑可行性。 但这失败了，因为极端约束在全球范围内相互作用。 例如，如果我们将非常小的数字放在右半部分，我们可能会意外地迫使那里的最大值太大或太小。 

一些微妙的失败案例立即出现：

 如果 a 被放置在右半部分，那么左半部分可能无法将 a 作为最小值，因为它不再存在于左半部分。 同样，如果b放在左半部分，右半部分也无法达到b的最大值。 

此外，即使 a 和 b 正确放置在不同的一半中，我们也必须确保每一半都有足够的“空间”来容纳所有剩余的数字，而不违反最小和最大约束。 

## 方法

 暴力方法会尝试生成 1 到 n 的所有排列并检查条件是否成立。 这是正确的，但完全不可行，因为即使 n = 10 也有 10 个！ 排列，已经远远超出了任何限制。 

更结构化的蛮力会尝试将数字分配给一半并检查有效性。 这将问题简化为为左半部分选择 n/2 个数字并对其进行排列，这仍然是 n 的指数，因为我们实际上是在选择子集。 

关键的观察是我们实际上并不关心每一半内的完整排序。 我们只关心两个边界属性：左半部分的最小值和右半部分的最大值。 这意味着我们只需要确保：

 - a 包含在左半部分并且是那里最小的元素
 - b 包含在右半部分并且是那里最大的元素

 一旦我们确定了 a 和 b 的位置，剩下的数字就可以被分配，只要它们不打破这两个约束。 

这导致了建设性的战略。 我们首先放置 a 和 b，然后使用比它们更小的和更大的值仔细填充剩余的位置，尊重极值角色。 

可行性条件来自计数：

 - 左半部分必须包含 a 并且所有其他元素必须严格大于或等于 a
 - 右半部分必须包含 b 并且所有其他元素必须严格小于或等于 b

 这意味着小于 a 的值必须全部进入右半部分，大于 b 的值必须全部进入左半部分。 任何违规行为都会迫使最小值或最大值发生变化。 

从这个结构中，我们可以直接构建排列，如果计数不合适则拒绝。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n!) | O(n) | 太慢了 |
 | 最佳施工| O(n) | O(n) | 已接受 |

 ## 算法演练

我们想要构建大小为 n/2 的两半，同时强制 a 作为左半部最小值，b 作为右半部最大值。 

1. 首先，在左半部分放置一个。 这保证了左半部分可能具有最小 a，但只有当该半部分中没有出现小于 a 的值时，它才有效。 
2. 将 b 放在右半部分。 这保证了右半部分可能具有最大 b，前提是没有更大的值进入其中。 
3. 将所有剩余数字分成三组：小于 a 的数字、a 和 b 之间的数字以及大于 b 的数字。 
4.所有小于a的数字都必须放到右半部分。 如果将它们中的任何一个放置在左半部分，它们就会违反 a 是那里最小值的要求。 
5.所有大于b的数字都必须移到左半部分。 如果将它们中的任何一个放在右半部分，它们就会违反 b 是那里最大值的要求。 
6. 现在在 a 和 b 之间任意分配剩余的数字，填充两半中剩余的空位。 在此阶段，它们无法打破最小/最大条件，因为它们位于两个锚点之间。 
7. 填充后，如果其中一半超过大小n/2或不能一致填充，则输出-1。 

为什么有效：一旦 a 和 b 被固定为极值锚点，通过比较，所有其他数字都会被迫进入一侧。 如果放置在那里，小于 a 的值将破坏左侧最小值，如果放置在那里，大于 b 的值将破坏右侧最大值。 其余的值是“中性”的，可以自由分配。 当容量限制与这些强制放置相匹配时，施工就完成了。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    t = int(input())
    for _ in range(t):
        n, a, b = map(int, input().split())
        half = n // 2

        if a == b:
            print(-1)
            continue

        left = [a]
        right = [b]

        used = set([a, b])

        # numbers less than a must go right
        less = [x for x in range(1, a) if x not in used]
        # numbers greater than b must go left
        greater = [x for x in range(b + 1, n + 1) if x not in used]
        # middle numbers
        middle = [x for x in range(1, n + 1) if x not in used and a < x < b]

        # feasibility checks
        if len(greater) + 1 > half or len(less) + 1 > half:
            print(-1)
            continue

        left += greater
        right += less

        # fill remaining spots
        remaining_left = half - len(left)
        remaining_right = half - len(right)

        if remaining_left + remaining_right != len(middle):
            print(-1)
            continue

        left += middle[:remaining_left]
        right += middle[remaining_left:]

        if len(left) != half or len(right) != half:
            print(-1)
            continue

        print(*left, *right)

if __name__ == "__main__":
    solve()
```该实现使用强制放置逻辑显式构造两半。 关键细节是确保小于 a 的数字永远不会进入左半部分，大于 b 的数字永远不会进入右半部分。 一旦验证了容量限制，中间段将被任意分割。 

在分配中间元素之前必须注意大小检查； 否则，很容易溢出一半，但仍然会产生无效的排列。 

## 工作示例

 ### 示例 1

 输入：```
6 2 5
```n = 6，一半 = 3

 我们从以下开始：

 左边 a = 2，右边 b = 5

 数字：

 小于 2 → [1]

 大于 5 → [6]

 中 → [3, 4]

 | 步骤| 左| 对| 剩余|
 | ---| ---| ---| ---|
 | 初始锚点 | [2] | [5]| [1,6,3,4]|
 | 添加强制 | [2, 6] | [5, 1] | [3, 4] |
 | 填充中间| [2,6,3]| [5,1,4]| []|

 左min=2，右max=5，都满足。 

### 示例 2

 输入：```
4 2 4
```n = 4，一半 = 2

 左边 a = 2，右边 b = 4

 小于 2 → [1] 向右

 大于 4 → []

 中 → [3]

 | 步骤| 左| 对| 剩余|
 | ---| ---| ---| ---|
 | 初始锚点 | [2] | [4] | [1, 3] |
 | 强制安置| [2] | [4, 1] | [3] |
 | 填充中间| [2, 3] | [4, 1] | []|

 左侧最小值 = 2，右侧最大值 = 4。 

这证实了可以在不影响正确性的情况下分配中间值。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 每个测试用例 O(n) | 每个数字恰好被放入一组 |
 | 空间| O(n) | 数组存储排列组 |

 当 n ≤ 100 且 t ≤ 1000 时，总操作最多为 10^5，这完全在限制范围内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys
    input = sys.stdin.readline

    t = int(input())
    out = []
    for _ in range(t):
        n, a, b = map(int, input().split())
        half = n // 2

        if a == b:
            out.append("-1")
            continue

        left = [a]
        right = [b]
        used = {a, b}

        less = [x for x in range(1, a) if x not in used]
        greater = [x for x in range(b + 1, n + 1)]
        middle = [x for x in range(1, n + 1) if x not in used and a < x < b]

        if len(greater) + 1 > half or len(less) + 1 > half:
            out.append("-1")
            continue

        left += greater
        right += less

        if len(left) > half or len(right) > half:
            out.append("-1")
            continue

        rem_l = half - len(left)
        rem_r = half - len(right)

        if rem_l + rem_r != len(middle):
            out.append("-1")
            continue

        left += middle[:rem_l]
        right += middle[rem_l:]

        if len(left) != half or len(right) != half:
            out.append("-1")
            continue

        out.append(" ".join(map(str, left + right)))

    return "\n".join(out)

# provided samples
assert run("""7
6 2 5
6 1 3
6 4 3
4 2 4
10 5 3
2 1 2
2 2 1
""") == """4 2 6 5 3 1
-1
6 4 5 1 3 2
3 2 4 1
-1
1 2
2 1""", "sample 1"

# custom cases
assert run("""1
2 1 2
""") == "1 2", "minimum valid"

assert run("""1
2 2 1
""") == "2 1", "reversed minimal"

assert run("""1
4 3 1
""") in ["-1"], "impossible configuration"

assert run("""1
8 3 6
""").count(" ") == 7, "valid permutation size check"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小有效| 1 2 | 基地建设|
 | 反转最小| 2 1 | 2 对称情况|
 | 不可能| -1 | 可行性拒绝|
 | 随机有效| 8 个数字 | 结构正确性 |

 ## 边缘情况

 一种重要的边缘情况是 a 和 b 非常接近或接近边界。 例如，如果 a = 1 且 b = n，则所有其他数字都被强制进入中间区域，并且只要遵守放置顺序，该构造就可以正常工作。 该算法处理此问题是因为没有数字小于 1 或大于 n，因此强制组为空并且容量检查始终通过。 

另一种边缘情况是 a 较大而 b 较小时。 例如n = 6，a = 5，b = 2。这里，所有小于5的数字将被强制进入右半部分，所有大于2的数字将被强制进入左半部分，导致两半溢出。 该算法通过大小检查正确检测到这一点`less`和`greater`，并在尝试无效放置之前输出 -1。 

最后一个微妙的情况是中间段恰好填充剩余的槽。 如果不严格检查这种相等性，人们可能会默默地填满一半。 剩余容量和中间大小之间的显式相等检查可以防止这种情况发生，并确保排列完全正确地分区。
