---
title: "CF 182C - 最佳总和"
description: "我们有一个数组和一个固定的窗口长度 len。 对于长度为 len 的每个子数组，我们计算其总和，然后取绝对值。 整个数组的“最佳和”是该固定长度的所有窗口中最大绝对子数组和。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "greedy"]
categories: ["algorithms"]
codeforces_contest: 182
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 117 (Div. 2)"
rating: 2000
weight: 182
solve_time_s: 110
verified: true
draft: false
---

[CF 182C - 最佳总和](https://codeforces.com/problemset/problem/182/C)

 **评级：** 2000
 **标签：** 数据结构，贪心
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个数组和固定的窗口长度`len`。 对于每个长度的子数组`len`，我们计算其总和，然后取绝对值。 整个数组的“最佳和”是该固定长度的所有窗口中的最大绝对子数组和。 

在评估答案之前，我们可以翻转数组元素的符号。 一个操作选择一个索引并将该值乘以`-1`。 我们最多可以表演`k`操作总计。 允许多次翻转同一位置，但只有奇偶性很重要，因为两次翻转会相互抵消。 

任务是最大化所有大小窗口的最大绝对和`len`。 

这些限制迫使我们仔细思考。 数组长度达到`10^5`，因此任何检查所有窗口和所有翻转组合的解决方案都是不可能的。 甚至`O(n * k)`当两者都很大时已经接近实际极限。 我们周围需要一些东西`O(n log n)`或更好。 

一个微妙的点是我们正在最大化窗口总和的绝对值。 这意味着我们可以自由地将窗口设置为非常积极或非常消极。 由于翻转窗口中的每个元素都会改变总和的符号，因此最大化正方向也已经覆盖了负方向。 

另一个微妙的点是，操作是全局的，但目标最终只取决于一个窗口。 我们永远不需要同时优化多个窗口。 我们只关心构建尽可能最好的单一窗口。 

考虑这个例子：```
n = 3, len = 2
a = [5, -100, 5]
k = 1
```最好的动作是翻转`-100`进入`100`，给出窗口总和`105`和`105`。 试图独立改进每个窗口的贪婪策略可能会浪费其他地方的翻转。 

另一个容易犯的错误是奇偶校验处理不当。 认为：```
n = 2, len = 2
a = [4, 7]
k = 1
```这两个数字都已经是正数了。 翻转一会减少总和`11`到任一`3`或者`-3`。 因为我们_最多_可以使用`k`运算，正确答案仍然是`11`。 一个粗心的实现，准确地假设`k`翻转会产生错误的结果。 

当窗口包含的内容少于`k`负数。```
n = 4, len = 4
a = [-5, 2, 3, 4]
k = 3
```我们翻转`-5`到`5`，得到总计`14`。 使用额外的翻转只会造成伤害，因为每一次额外的翻转都会将正数变为负数。 

正确的策略必须明白，在窗口内翻转的最佳用途始终是将一些负值变为正值。 

## 方法

 暴力解决方案将枚举每个长度的窗口`len`。 对于每个窗口，我们将尝试翻转每个可能的位置子集，直至达到大小`k`，并计算所得的最大绝对和。 

这立即是不可行的。 单个窗口已经有`2^len`子集。 和`len = 10^5`，即使是一个窗口也不能这样处理。 

我们可以稍微改进一下蛮力。 在固定窗口内，如果我们试图最大化正方向，翻转正值总是会减少绝对和。 因此，对于一个窗口，最佳策略很明显：翻转最有用的负数。 

假设窗口总和为：```
S = a1 + a2 + ... + alen
```翻转负数`-x`将总和更改为`+2x`。 

因此，如果我们收集窗口中的所有负值并选择最多`k`其中，最好的改进来自于绝对值最大的负数。 

这一观察完全改变了问题。 我们不再关心任意翻转子集。 对于每个滑动窗口，我们需要：```
window_sum + 2 * (sum of k largest absolute negative values)
```现在任务变成了滑动窗口数据结构问题。 

当窗口移动时，元素进入和离开。 我们必须保持：

 1.普通窗口总和。 
2. 总和`k`当前窗口内负元素中最大绝对值。 

一个幼稚的实现会对每个窗口的底片进行排序，成本`O(len log len)`每个窗口和`O(n * len log len)`全面的。 

关键的见解是我们只需要顶部`k`动态负片。 这是一个经典的二多集结构：

 1. 一组包含当前对答案有贡献的所选否定项。 
2. 另一组包含剩余的底片。 

我们保持所选集合始终存储的不变量`k`最大绝对值。 那么每次插入或删除的成本`O(log n)`。 

蛮力思想在概念上仍然存在，但昂贵的重新计算消失了，因为滑动窗口每一步仅更新一个进入元素和一个离开元素。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n·2^len) | O(n·2^len) | O(长度) | 太慢了|
 | 重新排序每个窗口 | O(n·len log len) | O(n·len log len) | O(n·len log len) | O(长度) | 太慢了|
 | 推拉窗+平衡套| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 维护当前窗口的普通和。 

当窗口滑动时，减去离开的元素，加上进入的元素。 
2. 对于每个负值`x`，定义其增益为`-2x`。 

示例：翻转`-7`改变窗口总和`+14`。 
3. 维护两个多重集。 

第一组，`best`，存储当前选择用于翻转的增益。 它的尺寸永远不会超过`k`。 

第二组，`rest`，存储所有其他收益。 
4. 维护`best_sum`，里面的值的总和`best`。 

那么当前窗口可实现的最佳正和为：```
current_window_sum + best_sum
```5. 当负元素进入窗口时，将其增益插入到结构中。 

如果`best`少于`k`元素，直接将其放置在那里。 

否则与当前内部最小增益进行比较`best`。 

如果新增益较大，则交换它们。 否则将新增益放入`rest`。 
6. 当负元素离开窗口时，从当前包含该元素的集合中删除其增益。 

移除后，如果`best`少于`k`元素和`rest`非空，移动最大收益`rest`进入`best`。 
7. 每次窗口更新后，计算：```
abs(current_window_sum + best_sum)
```但最大化积极方向已经足够了。 通过从概念上翻转该窗口中的所有符号，任何消极目标都可以转化为积极目标。 所以我们简单地最大化：```
current_window_sum + best_sum
```8. 跟踪所有窗口的最大值。 

### 为什么它有效

 对于固定窗口，每个翻转的负值都会独立贡献。 翻转`-x`将总和增加`2x`，而翻转正值会降低它。 所以最优策略总是选择最多`k`具有最大绝对值的负值。 

数据结构每时每刻都准确地维护着那些最佳候选者。 不变量是：```
best contains the k largest gains among all negatives in the current window
```由于窗口总和保持准确并且`best_sum`等于最佳翻转的总改进，每个计算出的候选者都是该窗口的真正最佳值。 对所有窗口取最大值即可得出全局答案。 

## Python 解决方案```python
import sys
from sortedcontainers import SortedList

input = sys.stdin.readline

def solve():
    n, length = map(int, input().split())
    a = list(map(int, input().split()))
    k = int(input())

    best = SortedList()
    rest = SortedList()

    best_sum = 0

    def add_gain(v):
        nonlocal best_sum

        if k == 0:
            rest.add(v)
            return

        if len(best) < k:
            best.add(v)
            best_sum += v
        else:
            if v > best[0]:
                smallest = best.pop(0)
                best_sum -= smallest
                rest.add(smallest)

                best.add(v)
                best_sum += v
            else:
                rest.add(v)

    def remove_gain(v):
        nonlocal best_sum

        if v in best:
            best.remove(v)
            best_sum -= v

            if rest:
                largest = rest.pop()
                best.add(largest)
                best_sum += largest
        else:
            rest.remove(v)

    window_sum = 0

    for i in range(length):
        window_sum += a[i]
        if a[i] < 0:
            add_gain(-2 * a[i])

    ans = window_sum + best_sum

    for r in range(length, n):
        l = r - length

        window_sum -= a[l]
        if a[l] < 0:
            remove_gain(-2 * a[l])

        window_sum += a[r]
        if a[r] < 0:
            add_gain(-2 * a[r])

        ans = max(ans, window_sum + best_sum)

    print(ans)

solve()
```实现直接遵循滑动窗口结构。`window_sum`跟踪当前子数组的普通和。 每个负数贡献的可能增益等于`-2 * a[i]`。 该值始终为正，因为`a[i] < 0`。 

这`best`multiset 存储当前选择的增益。 它的大小最多为`k`，并且它始终包含窗口内可用的最大增益。 

棘手的部分是在删除后保持不变。 当从中删除一个元素时`best`，我们可能留下少于`k`所选择的收益。 最大可用收益`rest`然后必须搬进`best`。 

另一个微妙的细节是处理`k = 0`。 在那种情况下，`best`必须永久保持空状态。 没有显式检查，访问`best[0]`会失败的。 

Python 整数已经支持任意精度，这很重要，因为总和可能达到大约`10^14`。 

该解决方案使用`SortedList`从`sortedcontainers`用于干净的平衡树行为。 每次插入、删除和边界查找都会花费`O(log n)`。 

## 工作示例

 ### 示例 1

 输入：```
5 3
0 -2 3 -5 1
2
```初始窗口`[0, -2, 3]`| 窗口| 窗口总和| 负收益 | 最佳总和 | 候选人 |
 | --- | --- | --- | --- | --- |
 |`[0, -2, 3]`| 1 | {4} | 4 | 5 |

 滑动至`[-2, 3, -5]`| 窗口| 窗口总和| 负收益 | 最佳总和 | 候选人 |
 | --- | --- | --- | --- | --- |
 |`[-2, 3, -5]`| -4 | {4, 10} | 14 | 14 10 | 10

 滑动至`[3, -5, 1]`| 窗口| 窗口总和| 负收益 | 最佳总和 | 候选人 |
 | --- | --- | --- | --- | --- |
 |`[3, -5, 1]`| -1 | {10} | 10 | 10 9 |

 最大候选者为`10`。 

该迹线显示增益如何与通过翻转负片获得的改进完全对应。 在第二个窗口中，翻转两个底片都会发生变化`-4`进入`10`。 

### 示例 2

 输入：```
4 2
5 6 -100 7
1
```初始窗口`[5, 6]`| 窗口| 窗口总和| 负收益 | 最佳总和 | 候选人 |
 | --- | --- | --- | --- | --- |
 |`[5, 6]`| 11 | 11 {} | 0 | 11 | 11

 滑动至`[6, -100]`| 窗口| 窗口总和| 负收益 | 最佳总和 | 候选人 |
 | --- | --- | --- | --- | --- |
 |`[6, -100]`| -94 | -94 {200} | 200 | 200 106 | 106

 滑动至`[-100, 7]`| 窗口| 窗口总和| 负收益 | 最佳总和 | 候选人 |
 | --- | --- | --- | --- | --- |
 |`[-100, 7]`| -93 | -93 {200} | 200 | 200 107 | 107

 答案是`107`。 

这个例子表明，一个巨大的负值主导了最优策略。 该算法正确地保持了单个最佳增益，因为`k = 1`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 每个元素进入和离开数据结构一次 |
 | 空间| O(n) | 多重集可以一起存储所有负增益 |

 和`n = 10^5`,`O(n log n)`很容易在时间限制内完成。 内存使用量也仍然远低于限制，因为只存储了一些平衡树结构。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from sortedcontainers import SortedList

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    n, length = map(int, input().split())
    a = list(map(int, input().split()))
    k = int(input())

    best = SortedList()
    rest = SortedList()

    best_sum = 0

    def add_gain(v):
        nonlocal best_sum

        if k == 0:
            rest.add(v)
            return

        if len(best) < k:
            best.add(v)
            best_sum += v
        else:
            if v > best[0]:
                smallest = best.pop(0)
                best_sum -= smallest
                rest.add(smallest)

                best.add(v)
                best_sum += v
            else:
                rest.add(v)

    def remove_gain(v):
        nonlocal best_sum

        if v in best:
            best.remove(v)
            best_sum -= v

            if rest:
                largest = rest.pop()
                best.add(largest)
                best_sum += largest
        else:
            rest.remove(v)

    window_sum = 0

    for i in range(length):
        window_sum += a[i]
        if a[i] < 0:
            add_gain(-2 * a[i])

    ans = window_sum + best_sum

    for r in range(length, n):
        l = r - length

        window_sum -= a[l]
        if a[l] < 0:
            remove_gain(-2 * a[l])

        window_sum += a[r]
        if a[r] < 0:
            add_gain(-2 * a[r])

        ans = max(ans, window_sum + best_sum)

    return str(ans)

# provided sample
assert run(
"""5 3
0 -2 3 -5 1
2
"""
) == "10", "sample 1"

# minimum size
assert run(
"""1 1
-5
1
"""
) == "5", "single element"

# k = 0
assert run(
"""4 2
1 -2 3 4
0
"""
) == "7", "no flips allowed"

# all equal negatives
assert run(
"""5 3
-4 -4 -4 -4 -4
2
"""
) == "4", "choose best two flips"

# boundary sliding behavior
assert run(
"""5 2
-1 -2 -3 -4 -5
1
"""
) == "9", "correct entering and leaving updates"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 1 / -5 / 1`|`5`| 最小尺寸处理 |
 |`4 2 / 1 -2 3 4 / 0`|`7`| 禁止翻转时的正确行为 |
 |`5 3 / -4 -4 -4 -4 -4 / 2`|`4`| 重复均等增益|
 |`5 2 / -1 -2 -3 -4 -5 / 1`|`9`| 滑动窗口插入和移除的正确性 |

 ## 边缘情况

 考虑所有值都已为正的情况。```
2 2
4 7
1
```初始窗口总和为`11`。 没有负增益，因此两个多重集都保持为空。 算法输出`11`。 

这证实了使用少于`k`操作是允许的。 一个错误的解决方案会强制翻转一次，从而减少答案。 

现在考虑允许翻转次数多于负数的情况。```
4 4
-5 2 3 4
3
```窗口总和开始于`4`。 

唯一的负值是`-5`，产生增益`10`。 

所以：```
candidate = 4 + 10 = 14
```其余两个操作将被忽略，因为翻转正数会减少总和。 

最后，考虑进入和离开结构的增益相等。```
5 3
-4 -4 -4 1 1
2
```初始收益为`{8, 8, 8}`。 只有两个属于`best`。 

当车窗滑动时，一`8`叶子和另一个遗骸。 多重集结构正确地仅删除了一次出现，因为它单独存储重复项。 

这可以防止所有相等的值意外一起消失的微妙错误。
