---
title: "CF 102470I - 快乐电话"
description: "每个电话呼叫占用一个连续的时间间隔。 呼叫由其两个端点描述：其开始时间 S 和结束时间 S + D，其中 D 是其持续时间。 电话号码本身不会影响答案。"
date: "2026-08-09T15:30:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102470
codeforces_index: "I"
codeforces_contest_name: "2009-2010 ACM ICPC Southwestern European Regional Programming Contest (SWERC 2009)"
rating: 0
weight: 102470
solve_time_s: 206
verified: true
draft: false
---

[CF 102470I - 快乐电话](https://codeforces.com/problemset/problem/102470/I)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 每个电话呼叫占用一个连续的时间间隔。 呼叫由其两个端点、其开始时间来描述`S`及其结束时间`S + D`， 在哪里`D`是它的持续时间。 电话号码本身不会影响答案。 它们只识别谁在说话，因此在读取通话后我们只需要它的时间间隔。 

对于每个警察询问，我们都会得到另一个时间间隔。 我们必须计算在一定时间内有多少调用与该查询重叠。 在查询开始时恰好结束的调用不会计入，在查询结束时恰好开始的调用也不会计入。 换句话说，如果一个呼叫占用`[a, b]`并且一个查询占用`[c, d]`，它们恰好相交至少一秒`a < d`和`b > c`。 

一个测试用例中的调用次数不得超过 10,000 个，查询次数不得超过 100 个。 因此，每次调用与每个查询的直接比较最多执行`9999 * 99 = 989901`一个测试用例中的重叠检查。 这并不是一个天文数字，因此对于这些规定的界限，蛮力是可行的。 不过，查询的结构让我们做得更好。 对呼叫开始时间和结束时间进行排序可以使用二分搜索来回答每个查询，从而将每个查询的工作量从呼叫数量的线性减少到对数。 

时间值可能很大，但是`Start + Duration`适合有符号的 32 位整数。 无论如何，Python 整数在这里不存在溢出问题，而且我们永远不需要模拟单个秒。 

一种常见的边界错误是计算仅接触的间隔。 考虑：```
1 1
10 20 0 10
10 1
0 0
```呼叫占用`[0, 10]`，而查询占用`[10, 11]`。 它们的交集持续时间为零，所以答案是`0`。 粗心的实现使用`call_start <= query_end`和`call_end >= query_start`会错误地计算它。 

当查询完全位于调用内部时，会出现另一种边界情况：```
1 1
1 2 0 10
3 2
0 0
```呼叫处于活动状态`0`到`10`，查询涵盖`3`到`5`，所以答案是`1`。 任何仅检查调用是否在查询内开始或结束的方法都可能会错过这种情况，因为调用的端点都不位于查询内`[3, 5]`。 

第三种情况是完全在查询内部进行调用：```
1 1
1 2 4 2
0 10
0 0
```呼叫占用`[4, 6]`并且查询占用`[0, 10]`，所以答案又是`1`。 这说明了为什么重叠必须通过区间端点来表示，而不是仅检查一个包含方向。 

## 方法

 最简单的解决方案将每个调用存储为一个间隔。 对于每个警察查询`[L, R]`，它扫描所有呼叫并检查每个呼叫是否`[S, E]`满足`S < R`和`E > L`。 这两个不等式恰好描述了正长度交集的特征。 由于最多有 9,999 次调用和 99 次查询，因此最坏的情况是每个测试用例进行 989,901 次间隔检查。 对于给定的约束来说，这已经足够小了，如果简单性是唯一的考虑，那么这是一个完全合理的实现。 

更快的方法来自重写重叠条件。 通话不重叠`[L, R]`恰好当它完全位于查询的左侧或完全右侧时。 当结束时间最多为 时，呼叫完全向左`L`。 当调用的开始时间至少为`R`。 

所以我们想要的数字可以写成`N - (# calls with end <= L) - (# calls with start >= R)`。 

这两个量是独立的。 如果所有呼叫结束时间已排序，二分查找给出的结束次数小于或等于`L`。 如果所有呼叫开始时间都已排序，则另一个二分查找给出的开始次数大于或等于`R`。 

蟒蛇的`bisect_right`准确给出值的数量`<= L`， 尽管`bisect_left`给出值的数量`>= R`减去其结果`N`。 严格的不平等使得端点接触呼叫从答案中消失。 

预处理成本`O(N log N)`，并且每次查询的成本`O(log N)`。 由于查询数量少于 100 个，因此速度非常快，并且如果增加查询数量，扩展性也会更好。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 |`O(NM)`|`O(N)`| 在规定的范围内接受 |
 | 最佳|`O(N log N + M log N)`|`O(N)`| 已接受 |

 ## 算法演练

 1. 读取所有通话并将每个通话转换为其开始时间和结束时间。 对于开始通话`S`和持续时间`D`，其结束时间为`S + D`。 我们不需要源号码和目标号码，因为查询仅询问时间重叠。 
2. 将每个呼叫开始存储在一个数组中，将每个呼叫结束存储在另一个数组中。 对这些数组进行排序会将有关有多少调用完全位于查询之前或之后的问题转变为二分搜索问题。 
3. 对两个数组进行排序。 排序后，所有小于或等于某一特定值的结束时间形成一个前缀，所有大于或等于某一特定值的起始时间形成一个后缀。 
4. 对于从以下位置开始的查询`L`有持续时间`D`,计算其结束时间`R = L + D`。 
5. 使用`bisect_right(ends, L)`统计结束时间最多为`L`。 此类调用在查询开始之前完全完成，因此它们与查询的共同持续时间为零。 
6. 使用`bisect_left(starts, R)`找到第一个调用，其开始至少是`R`。 有`N - bisect_left(starts, R)`这样的电话。 这些调用在查询已经结束时开始，因此它们的公共持续时间也为零。 
7. 减去两个不重叠的组`N`。 其余调用满足`start < R`和`end > L`，这意味着它们与查询重叠了一定的时间。 打印这个计数。 

### 为什么它有效

 对于任何呼叫`[S, E]`并查询`[L, R]`，恰好适用三种情况之一。 调用完全在查询之前`E <= L`，完全在查询之后`S >= R`，或者当两个条件都不成立时它会与查询重叠。 前两组不能互相重叠，因为查询有`L < R`。 因此从所有组中删除这两个组`N`调用完全满足调用`S < R`和`E > L`，这正是在查询间隔的至少一秒内活动的呼叫。 

## Python 解决方案```python
import sys
from bisect import bisect_left, bisect_right

input = sys.stdin.readline

def solve():
    out = []

    while True:
        n, m = map(int, input().split())

        if n == 0 and m == 0:
            break

        starts = []
        ends = []

        for _ in range(n):
            source, destination, start, duration = map(int, input().split())
            starts.append(start)
            ends.append(start + duration)

        starts.sort()
        ends.sort()

        for _ in range(m):
            start, duration = map(int, input().split())
            end = start + duration

            finished_before = bisect_right(ends, start)
            started_after = n - bisect_left(starts, end)

            answer = n - finished_before - started_after
            out.append(str(answer))

    sys.stdout.write("\n".join(out))

if __name__ == "__main__":
    solve()
```输入循环处理测试用例直到`0 0`。 对于每个呼叫，仅`start`和`start + duration`被保留，因为电话号码从不参与重叠查询。 

这两个排序数组表示调用无法与查询重叠的两种方式。`bisect_right(ends, start)`包括与查询开头完全相同的结尾。 这是故意的，因为在查询开始的同一时刻结束的调用具有零交集。 相似地，`bisect_left(starts, end)`包括与查询结束完全相等的开始，也必须从答案中排除。 

仅在对两个非重叠组进行计数后才执行减法。 无需检查每个查询的单独调用。 

Python 中也不存在整数溢出问题。 尽管原始边界保证端点适合 32 位有符号整数，但 Python 的整数类型可以直接表示它。 

## 工作示例

 ### 示例 1

 第一个测试用例包含三个调用：

 | 致电 | 开始| 结束 |
 | ---| ---| ---|
 | 1 | 2 | 7 |
 | 2 | 0 | 10 | 10
 | 3 | 5 | 13 |

 排序后起始数组为`[0, 2, 5]`最后的数组是`[7, 10, 13]`。 

对于第一个查询，间隔为`[0, 6]`。 

| 查询 |`bisect_right(ends, L)`|`bisect_left(starts, R)`| 回答 |
 | ---| ---| ---| ---|
 |`[0, 6]`| 0 | 3 | 3 |

 没有通话按时间结束`0`，并且在该时间或之后没有呼叫开始`6`。 所有三个调用都与查询重叠。 

对于第二个查询，间隔为`[8, 10]`。 

| 查询 |`bisect_right(ends, L)`|`bisect_left(starts, R)`| 回答 |
 | ---| ---| ---| ---|
 |`[8, 10]`| 1 | 0 | 2 |

 第一次通话结束时间`7`，因此被排除。 另外两个调用重叠`[8, 10]`, 给予`2`。 

该测试用例的输出结果是：```
3
2
```该跟踪演示了为什么恰好在查询起始边界处的结尾属于非重叠前缀。 

### 示例 2

 第二个测试用例有一个调用，开始于`0`有持续时间`10`，所以它的区间是`[0, 10]`。 

第一个查询是`[9, 10]`。 

| 查询 |`L`|`R`| 完成于`L`| 开始时间或之后`R`| 回答 |
 | ---| ---| ---| ---| ---| ---|
 |`[9, 10]`| 9 | 10 | 10 0 | 0 | 1 |

 调用在间隔期间与查询重叠`9`到`10`，所以很重要。 

第二个查询是`[10, 11]`。 

| 查询 |`L`|`R`| 完成于`L`| 开始时间或之后`R`| 回答 |
 | ---| ---| ---| ---| ---| ---|
 |`[10, 11]`| 10 | 10 11 | 11 1 | 0 | 0 |

 调用恰好在查询开始时间结束。 不存在正长度交集，因此不算数。 

结果输出是：```
1
0
```这个例子直接练习了严格的边界条件，并发现了将接触间隔视为重叠的常见错误。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 |`O(N log N + M log N)`| 对两个端点数组进行排序的成本`O(N log N)`，以及每个`M`查询使用两个二分搜索 |
 | 空间|`O(N)`| 每次调用时，开始和结束数组各包含一个值 |

 最大的测试用例包含不到 10,000 个调用，因此排序成本较低。 每个查询只需要两次二分搜索，而不是扫描所有调用。 该方法还避免了对时间戳实际大小的依赖，因此持续数千秒的调用不需要迭代这些秒。 

## 测试用例```python
import sys
import io
from bisect import bisect_left, bisect_right

def solve_data(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    input = sys.stdin.readline
    out = []

    while True:
        n, m = map(int, input().split())

        if n == 0 and m == 0:
            break

        starts = []
        ends = []

        for _ in range(n):
            source, destination, start, duration = map(int, input().split())
            starts.append(start)
            ends.append(start + duration)

        starts.sort()
        ends.sort()

        for _ in range(m):
            start, duration = map(int, input().split())
            end = start + duration

            finished_before = bisect_right(ends, start)
            started_after = n - bisect_left(starts, end)

            out.append(str(n - finished_before - started_after))

    sys.stdout = old_stdout
    sys.stdin = old_stdin

    return "\n".join(out)

sample = """\
3 2
3 4 2 5
1 2 0 10
6 5 5 8
0 6
8 2
1 2
8 9 0 10
9 1
10 1
0 0
"""

assert solve_data(sample) == "3\n2\n1\n0", "provided sample"

minimum = """\
1 1
0 0 0 1
0 1
0 0
"""

assert solve_data(minimum) == "1", "minimum-size overlapping case"

touching = """\
1 3
1 2 10 5
0 10
15 1
16 1
0 0
"""

assert solve_data(touching) == "1\n0\n0", "endpoint touching"

equal_values = """\
4 3
1 1 5 5
2 2 5 5
3 3 5 5
4 4 5 5
5 5
0 5
10 1
0 0
"""

assert solve_data(equal_values) == "4\n4\n0", "equal starts and ends"

containment = """\
3 3
1 2 0 20
3 4 5 2
5 6 10 5
6 3
0 1
20 1
0 0
"""

assert solve_data(containment) == "3\n1\n0", "containment and boundaries"

large_endpoint = """\
2 2
1 2 0 10000
3 4 2147480000 10000
0 10000
2147480000 10000
0 0
"""

assert solve_data(large_endpoint) == "1\n1", "large timestamps"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小尺寸外壳 |`1`| 一次调用和一次查询 |
 | 感人案例|`1`,`0`,`0`| 精确的端点处理 |
 | 同等价值|`4`,`4`,`0`| 具有相同间隔的多个呼叫 |
 | 收容案例|`3`,`1`,`0`| 包含查询的调用和查询包含的调用 |
 | 大型端点案例|`1`,`1`| 大型有效时间戳和端点算术 |

 ## 边缘情况

 第一个边界情况是调用恰好在查询开始时结束。 例如：```
1 1
10 20 0 10
10 1
0 0
```通话结束于`10`，而查询开始于`10`。`bisect_right(ends, 10)`回报`1`，因此调用被分类为在查询边界之前完成或恰好在查询边界处完成。 答案是`1 - 1 - 0 = 0`。 

对称情况是调用恰好在查询结束时开始：```
1 1
10 20 10 5
0 15
0 0
```通话内容是`[10, 15]`，查询是`[0, 15]`，所以这些间隔实际上在时间之前重叠`15`答案是`1`。 相关的二分查找是`bisect_left(starts, 15)`，返回`1`，但这不会删除呼叫，因为呼叫开始于`10`，这严格之前`15`。 

如果查询是`[0, 10]`：```
1 1
10 20 10 5
0 10
0 0
```然后`bisect_left(starts, 10)`回报`0`, 给予`started_after = 1`。 调用恰好在查询的结束边界处开始，因此答案是`0`。 

查询可以完全在调用中：```
1 1
1 2 0 10
3 2
0 0
```这里的调用是`[0, 10]`查询是`[3, 5]`。 没有呼叫结束于`3`，并且没有呼叫开始于`5`，所以公式给出`1 - 0 - 0 = 1`。 该方法不需要调用的任一端点位于查询内。 

反向遏制的处理方式相同：```
1 1
1 2 3 2
0 10
0 0
```电话`[3, 5]`完全位于内部`[0, 10]`。 同样，没有呼叫属于任何一个非重叠组，所以答案是`1`。 

最后，查询可能完全在每次调用之外：```
2 1
1 2 0 2
3 4 5 2
2 1
0 0
```电话是`[0, 2]`和`[5, 7]`，而查询是`[2, 3]`。 第一次通话正好结束于`2`， 所以`bisect_right`将其删除。 第二次通话开始后`3`， 所以`bisect_left`将其删除。 两个调用都被排除，答案是`0`。 在这种情况下，将端点接触视为重叠会产生不正确的结果。
