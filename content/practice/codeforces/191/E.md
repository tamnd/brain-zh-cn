---
title: "CF 191E - 挫败示威"
description: "我们有一系列士兵的可靠性。 每个连续的子数组代表一个可能的警察组。 将军总是首先选择最强的未使用组，这意味着所有子数组和都按降序排序并逐一挑选。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "trees"]
categories: ["algorithms"]
codeforces_contest: 191
codeforces_index: "E"
codeforces_contest_name: "Codeforces Round 121 (Div. 1)"
rating: 2200
weight: 191
solve_time_s: 106
verified: true
draft: false
---

[CF 191E - 挫败示威](https://codeforces.com/problemset/problem/191/E)

 **评分：** 2200
 **标签：** 二分查找、数据结构、树
 **求解时间：** 1m 46s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一系列士兵的可靠性。 每个连续的子数组代表一个可能的警察组。 将军总是首先选择最强的未使用组，这意味着所有子数组和都按降序排序并逐一挑选。 

我们需要当天选择的小组的可靠性`k`。 换句话说，在所有`n(n+1)/2`子数组和，我们必须找到`k`-第一个最大值。 

数组可能包含负数，因此子数组并不总是越长越好。 仅使用最大和子数组技术是不够的，因为我们需要子数组和的整个排序，而不仅仅是最佳排序。 

这些限制才是真正的困难所在。 子数组的数量大致是二次方`n^2 / 2`。 为了`n = 10^5`，这变成了关于`5 * 10^9`子数组太多，无法明确枚举。 即使存储所有的总和也需要数十GB的内存。 周围有任何解决方案`O(n^2)`立刻就不可能了。 

时间限制很宽裕，为 6 秒，这通常表明`O(n log^2 n)`或者`O(n log n)`预计具有高级数据结构的解决方案。 

棘手的部分是我们没有被要求构建顶部`k`直接求和。 正确的方法是对答案进行二分查找，并重复计算有多少个子数组的总和至少达到某个阈值`x`。 

一些边缘情况悄悄地破坏了幼稚的实现。 

考虑一个所有数字均为负数的数组。 

输入：```
3 2
-5 -2 -7
```所有子数组的总和为：`[-5, -7, -14, -2, -9, -7]`降序排序：`[-2, -5, -7, -7, -9, -14]`答案是`-5`。 

假设较大的子数组总是更强的粗心实现将立即失败。 

另一个微妙的情况是出现重复的和。 

输入：```
3 4
1 1 1
```子数组总和为：`[1,2,3,1,2,1]`降序排序：`[3,2,2,1,1,1]`第四大值是`1`。 

如果我们二分查找计数严格大于的第一个值`k`，而不是大于或等于`k`，重复会产生相差一的错误。 

大的值也很重要。 

输入：```
2 1
1000000000 1000000000
```最好的子数组和是`2000000000`。 

这里使用 32 位整数会溢出。 Python 会自动处理此问题，但在较低级语言中，这到处都需要 64 位算术。 

## 方法

 蛮力的想法很简单。 生成每个连续的子数组，计算其总和，将所有总和存储在列表中，对列表进行降序排序，然后取`k`-th 元素。 

前缀和减少了子数组和计算`O(length)`到`O(1)`，因此生成所有总和成本`O(n^2)`。 排序然后花费`O(n^2 log n)`。 

这适用于小数组，但对于`n = 10^5`子阵列的数量约为五十亿。 即使对它们进行一次迭代也是不可能的。 

关键的观察是我们实际上并不需要所有总和的精确排序。 我们只需要一个值，即`k`-最大。 如果我们能够回答以下问题，这种形式的问题通常会变得容易得多：

 “至少有多少个子数组有和`x`？”

 假设我们可以有效地计算这个计数。 那么二分查找就成为可能。 

如果至少`k`子数组至少有和`x`，那么答案至少是`x`。 

如果少于`k`子数组达到`x`， 然后`x`太大了。 

现在任务变成计算总和至少为的子数组`x`。 

令前缀和为：`pref[i] = a[1] + ... + a[i]`一个子数组`(l, r)`有总和：`pref[r] - pref[l-1]`我们想要：`pref[r] - pref[l-1] >= x`重新排列：`pref[l-1] <= pref[r] - x`因此，在从左到右扫描前缀时，对于每个`pref[r]`我们需要前面的前缀和的数量不超过`pref[r] - x`。 

这是一个经典的订单统计问题。 

由于前缀和可能非常大且为负，因此我们对它们进行协调压缩并使用 Fenwick 树来维护先前前缀和的频率。 

每次点票费用`O(n log n)`。 对答案范围的二分搜索增加了另一个对数因子。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n² log n) | O(n² log n) | O(n²) | 太慢了 |
 | 最佳 | O(n log² n) | O(n log² n) | O(n) | 已接受 |

 ## 算法演练

 1. 构建前缀和。 

定义：`pref[0] = 0`和：`pref[i] = pref[i-1] + a[i]`现在，每个子数组和都可以写成两个前缀和的差。 
2.二分查找答案。 

最小可能的子数组和至少是`-10^14`，并且最大的最多是`10^14`， 因为`n ≤ 10^5`和`|a[i]| ≤ 10^9`。 

我们二分查找最大的值`x`这样至少`k`子数组至少有和`x`。 
3. 对于固定阈值`x`，计算有效子数组。 

对于每个位置`r`，我们需要早期索引的数量`l-1`满意：`pref[l-1] <= pref[r] - x`这成为前缀频率查询。 
4. 坐标压缩所有前缀和。 

芬威克树适用于索引，而不是任意大整数。 

收集所有前缀和，对它们进行排序，并删除重复项。 
5. 从左到右扫描前缀。 

最初插入`pref[0]`。 

对于每个`pref[r]`:

 查找插入的前缀和有多少个`<= pref[r] - x`。 

将此计数添加到答案中。 

然后插入`pref[r]`进入芬威克树。 
6. 在二分查找中使用计数结果。 

如果计数至少为`k`， 然后`x`是可行的，我们尝试更大的值。 

否则，`x`太大，我们搜索较小的值。 
7. 二分查找结束后，输出最大可行值。 

### 为什么它有效

 对于每个正确的端点`r`，该算法精确计算左端点，至少产生子数组和`x`。 每个有效子数组对应一对满足以下条件的前缀和：`pref[r] - pref[l-1] >= x`Fenwick 树维护所有早期的前缀和，因此每个子数组都只计算一次。 

二分搜索是有效的，因为可行性是单调的。 如果至少`k`子数组至少有和`x`，那么对于每个较小的阈值也是如此。 这种单调性保证了二分查找收敛于精确的`k`-第最大子数组和。 

## Python 解决方案```python
import sys
from bisect import bisect_right

input = sys.stdin.readline

class Fenwick:
    def __init__(self, n):
        self.n = n
        self.bit = [0] * (n + 1)

    def add(self, idx, val):
        while idx <= self.n:
            self.bit[idx] += val
            idx += idx & -idx

    def sum(self, idx):
        res = 0
        while idx > 0:
            res += self.bit[idx]
            idx -= idx & -idx
        return res

def solve():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    pref = [0]
    for x in a:
        pref.append(pref[-1] + x)

    coords = sorted(set(pref))

    def count_ge(x):
        fw = Fenwick(len(coords))
        total = 0

        pos0 = bisect_right(coords, pref[0])
        fw.add(pos0, 1)

        for i in range(1, n + 1):
            need = pref[i] - x

            cnt = bisect_right(coords, need)
            total += fw.sum(cnt)

            pos = bisect_right(coords, pref[i])
            fw.add(pos, 1)

        return total

    lo = -10**15
    hi = 10**15

    while lo < hi:
        mid = (lo + hi + 1) // 2

        if count_ge(mid) >= k:
            lo = mid
        else:
            hi = mid - 1

    print(lo)

solve()
```第一部分计算前缀和，以便每个子数组和变成两个值的差。 这是使计数成为可能的核心转变。 

芬威克树存储以前见过的前缀和的频率。 由于前缀和可能为负且非常大，因此坐标压缩将它们映射到紧凑的索引范围中。 

功能`count_ge(x)`执行二分查找的计数步骤。 对于每个当前前缀和`pref[i]`，它计算有多少个较早的前缀和满足：```
pref[j] <= pref[i] - x
```致电给`bisect_right`是微妙但关键的。 我们需要小于或等于阈值的值，而不是严格小于阈值。 使用`bisect_left`当存在重复的前缀和时，此处会产生错误的答案。 

二分查找寻找最大的可行值。 中点公式：```
mid = (lo + hi + 1) // 2
```通过向上偏置避免无限循环。 

The search range uses`±10^15`，安全地覆盖每个可能的子数组和。 

## 工作示例

 ### 示例 1

 输入：```
3 4
1 4 2
```所有子数组的总和为：`[1,5,7,4,6,2]`降序排序：`[7,6,5,4,2,1]`答案是`4`。 

假设二分查找检查`x = 4`。 

前缀和：`[0,1,5,7]`| 我| 首选项[i] | 需要 = pref[i] - 4 | 早期偏好 ≤ 需要 | 添加计数 |
 | --- | --- | --- | --- | --- |
 | 1 | 1 | -3 | 0 | 0 |
 | 2 | 5 | 1 | 2 | 2 |
 | 3 | 7 | 3 | 2 | 2 |

 有效子数组总数：`4`。 

因为至少`4`子数组至少有和`4`，答案至少是`4`。 

该轨迹展示了核心计数不变性。 在每一步中，芬威克树都准确包含之前的前缀和。 

### 示例 2

 输入：```
3 2
-5 -2 -7
```已排序的子数组总和：`[-2,-5,-7,-7,-9,-14]`答案是`-5`。 

假设二分查找检查`x = -5`。 

前缀和：`[0,-5,-7,-14]`| 我| 首选项[i] | 需要| 早期偏好 ≤ 需要 | 添加计数 |
 | --- | --- | --- | --- | --- |
 | 1 | -5 | 0 | 1 | 1 |
 | 2 | -7 | -2 | 1 | 1 |
 | 3 | -14 | -9 | 0 | 0 |

 有效子数组总数：`2`。 

恰好两个子数组至少有和`-5`。 

此示例说明了为什么必须谨慎处理负值。 该算法从不假设积极性。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log² n) | O(n log² n) | 二分查找执行 O(log range) 次迭代，每次计数花费 O(n log n) |
 | 空间| O(n) | 前缀和、压缩坐标和 Fenwick 树 |

 数值范围的对数约为 50，因为子数组总和大致在`[-10^14, 10^14]`。 和`n = 10^5`，泛伟律师事务所的业务总数仍远低于时限。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from bisect import bisect_right

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    class Fenwick:
        def __init__(self, n):
            self.n = n
            self.bit = [0] * (n + 1)

        def add(self, idx, val):
            while idx <= self.n:
                self.bit[idx] += val
                idx += idx & -idx

        def sum(self, idx):
            res = 0
            while idx > 0:
                res += self.bit[idx]
                idx -= idx & -idx
            return res

    n, k = map(int, input().split())
    a = list(map(int, input().split()))

    pref = [0]
    for x in a:
        pref.append(pref[-1] + x)

    coords = sorted(set(pref))

    def count_ge(x):
        fw = Fenwick(len(coords))
        total = 0

        fw.add(bisect_right(coords, pref[0]), 1)

        for i in range(1, n + 1):
            need = pref[i] - x
            total += fw.sum(bisect_right(coords, need))
            fw.add(bisect_right(coords, pref[i]), 1)

        return total

    lo = -10**15
    hi = 10**15

    while lo < hi:
        mid = (lo + hi + 1) // 2

        if count_ge(mid) >= k:
            lo = mid
        else:
            hi = mid - 1

    return str(lo) + "\n"

# provided sample
assert run(
"""3 4
1 4 2
"""
) == "4\n", "sample 1"

# minimum size
assert run(
"""1 1
5
"""
) == "5\n", "single element"

# all negative
assert run(
"""3 2
-5 -2 -7
"""
) == "-5\n", "all negative"

# duplicate sums
assert run(
"""3 4
1 1 1
"""
) == "1\n", "duplicate sums"

# off-by-one around ranking
assert run(
"""2 2
5 -1
"""
) == "4\n", "ranking boundary"

# large values
assert run(
"""2 1
1000000000 1000000000
"""
) == "2000000000\n", "64-bit range"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / 5`|`5`| 最小尺寸输入 |
 |`3 2 / -5 -2 -7`|`-5`| 全阴性处理 |
 |`3 4 / 1 1 1`|`1`| 重复子数组和 |
 |`2 2 / 5 -1`|`4`| 正确的第 k 排名 |
 |`2 1 / 1e9 1e9`|`2000000000`| 大整数处理 |

 ## 边缘情况

 再次考虑全否定的情况。 

输入：```
3 2
-5 -2 -7
```前缀和变为：`[0,-5,-7,-14]`检查时`x = -5`，该算法精确计算两个有效子数组：`[-5]`和`[-2]`。 

芬威克树逻辑仍然有效，因为它只比较前缀和。 任何地方都没有出现关于积极性的假设。 

现在考虑重复的和。 

输入：```
3 4
1 1 1
```子数组按降序排序：`[3,2,2,1,1,1]`答案是`1`。 

在计数过程中，多个前缀和可能映射到同一个压缩坐标。 使用`bisect_right`保证所有相等的值都包含在查询中。 替换为`bisect_left`错误地排除相等的前缀和并低估了有效子数组的数量。 

最后，考虑排名边界情况。 

输入：```
2 2
5 -1
```子数组总和为：`[5,4,-1]`第二大金额是`4`。 

二分查找检查是否至少有两个子数组达到阈值。 在`x = 4`，计数正好是二：`[5]`和`[5,-1]`。 

在`x = 5`，只有一个子数组符合条件。 

这说明了为什么二分查找条件必须是：```
count >= k
```使用`count > k`会错误地超越正确答案。
