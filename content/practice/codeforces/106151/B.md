---
title: "CF 106151B - 食物休息"
description: "我们给定一天，从时间 0 开始，到时间 T 结束。在这个时间间隔内，有 N 个预定的演示，每个演示占据一个半开段 [si, ei)，这意味着它从 si 开始，在 ei 之前结束。 这些演示可能重叠或脱节。"
date: "2026-06-19T19:22:57+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106151
codeforces_index: "B"
codeforces_contest_name: "2025 ICPC Greek Collegiate Programming Contest (GRCPC 2025)"
rating: 0
weight: 106151
solve_time_s: 47
verified: true
draft: false
---

[CF 106151B - 断食](https://codeforces.com/problemset/problem/106151/B)

 **评级：** -
 **标签：** -
 **求解时间：** 47s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们给定一天，从时间 0 开始，到时间 T 结束。在这个时间间隔内，有 N 个预定的演示，每个演示占据一个半开段 [si, ei)，这意味着它从 si 开始，在 ei 之前结束。 这些演示可能重叠或脱节。 

在这些预定的片段之间，有不运行演示的空闲时段。 任务是找到 [0, T) 内未被任何呈现覆盖的最长连续空闲期。 

关键细节是“间隙”是指最大连续间隔，任何呈现都没有重叠。 因此，即使存在多个小的空闲间隔，我们也只关心在正确考虑所有重叠并合并占用时间后最大的空闲间隔。 

N 最大为 100000 且 T 最大为 10^9 的约束立即排除了任何检查每个时间单位的方法。 即使扫描时间线或进行每次模拟也会太慢。 任何正确的解决方案都必须将问题简化为按时间间隔进行排序和线性处理。 

当间隔重叠且未合并时，会出现常见的失败情况。 例如，如果我们有 [5, 10] 和 [8, 12]，它们之间的自由空间不在 10 和 8 之间，因为间隔重叠并有效地形成连续的阻塞区域 [5, 12)。 在没有标准化的情况下比较连续输入间隔的天真间隙计算会错误地将内部重叠计为可用空间。 

另一个边缘情况是不存在演示文稿的情况。 那么整个区间 [0, T) 就是长度为 T 的单个间隙。假设至少有一个区间的简单解决方案在这里会失败。 

最后，演示文稿可能不会按开始时间排序，因此依赖输入顺序而不排序可能会产生不正确的间隙计算。 

## 方法

 暴力的想法是重建整个时间线并标记所有占用的区域，然后扫描空闲片段。 一种方法是对单位时间内的事件进行排序或模拟每个间隔的开始和结束，但由于 T 可以大到 10^9，因此随时间的任何离散化都是不可能的。 即使我们尝试迭代所有可能的整数次，这也将是 10^9 次操作，这远远超出了限制。 

一种更结构化的蛮力方法是对间隔进行排序，然后对于每个间隔，将其重复合并到一个不断增长的占用集合中。 一旦我们获得了所有占用间隔的并集，我们就可以在它们之间进行扫描以计算间隙。 如果通过重复扫描实现，幼稚版本仍然可能会低效地重新计算重叠，从而可能导致 O(N^2) 行为。 

关键的观察是我们真正需要的是区间的并集。 一旦间隔按开始时间排序，一次贪婪地合并它们会产生不相交的占用段。 之后，间隙只是连续合并段之间的差异，加上 0 和 T 处的边界。 

实现这一点的结构是，线上的区间并集完全通过对端点进行排序并扫描一次来确定。 除了维持当前合并的部分之外，不需要进一步的全局推理。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(T + N^2) 或 O(T) | O(T)| 太慢了 |
 | 最优（排序+合并）| O(N log N) | O(N log N) | O(N) | 已接受 |

 ## 算法演练

1. 按开始时间对所有演示文稿进行排序。 这确保我们按时间顺序处理间隔，因此重叠变得很容易检测到。 
2. 将变量current_end初始化为0，表示最后合并占用的段的末尾。 
3. 将 best_gap 初始化为 0，这将跟踪迄今为止找到的最大空闲时间。 
4. 按排序顺序迭代每个区间 [s, e]。 
5. 如果 s 大于 current_end，则 current_end 和 s 之间存在空闲间隙。 用 s - current_end 更新 best_gap。 这是有效的，因为所有先前的间隔都不晚于 current_end 结束，因此没有任何东西会阻塞该区域。 
6. 将 current_end 更新为 max(current_end, e)。 这会将重叠的间隔合并到单个占用的段中。 
7. 处理完所有间隔后，current_end 和 T 之间可能仍然存在空闲时间。用 T - current_end 更新 best_gap。 

它起作用的原因是，排序后，我们维护一个不变量，即 current_end 始终表示所有已处理间隔的并集覆盖的最远点。 每当我们遇到超出此点的开始时间时，我们就完全发现了最大空闲段。 由于每个区间按顺序处理一次并贪心合并，因此不会遗漏已占用的区域，也不会重复计算间隙。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, T = map(int, input().split())
    intervals = []

    for _ in range(n):
        s, e = map(int, input().split())
        intervals.append((s, e))

    intervals.sort()

    current_end = 0
    best_gap = 0

    for s, e in intervals:
        if s > current_end:
            best_gap = max(best_gap, s - current_end)
        current_end = max(current_end, e)

    best_gap = max(best_gap, T - current_end)

    print(best_gap)

if __name__ == "__main__":
    solve()
```该代码首先读取所有间隔并对它们进行排序，以便重叠部分在处理顺序上变得连续。 变量 current_end 跟踪迄今为止合并演示文稿所涵盖的最远时间。 每当我们看到在 current_end 之后开始的新间隔时，我们立即测量它们之间的可用空间。 使用 max 更新 current_end 可确保正确合并重叠或接触间隔，而不是被视为单独的块。 针对 T 的最终更新捕获了上次演示后的尾部间隙。 

一个微妙的点是使用严格比较 s > current_end 而不是 s >= current_end。 在这个问题中使用 s >= current_end 也是正确的，因为像 [1,2) 和 [2,3) 这样的接触间隔不会产生间隙。 然而，使用 s > current_end 使得意图明确：只有严格未覆盖的时间才会造成间隙。 

## 工作示例

 ### 示例 1

 输入：

 4 60

 5 10

 50 55

 25 30

 15 20

 排序后的区间变为：

 [5,10]、[15,20]、[25,30]、[50,55]

 | 间隔 | 当前_结束之前 | 检测到间隙 | 当前_结束后| 最佳差距 |
 | ---| ---| ---| ---| ---|
 | [5,10]| 0 | 5 | 10 | 10 5 |
 | [15,20]| 10 | 10 5 | 20 | 5 |
 | [25,30] | 20 | 5 | 30| 5 |
 | [50,55]| 30| 20 | 55 | 55 20 |

 循环后，最终间隙为 60 - 55 = 5，因此答案为 20。 

此跟踪显示算法如何仅在合并的占用段之间累积间隙，而不是在原始输入间隔之间累积间隙。 

### 示例 2

 输入：

 3 10

 2 3

 3 5

 6 8

 排序间隔：

 [2,3]、[3,5]、[6,8]

 | 间隔 | 当前_结束之前 | 检测到间隙 | 当前_结束后| 最佳差距 |
 | ---| ---| ---| ---| ---|
 | [2,3]| 0 | 2 | 3 | 2 |
 | [3,5]| 3 | 0 | 5 | 2 |
 | [6,8]| 5 | 1 | 8 | 2 |

 最终差距为 10 - 8 = 2，答案为 2。 

此示例强调接触间隔不会产生间隙，并且合并可防止出现错误的内部间隙。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N log N) | O(N log N) | 排序占主导地位，随后是单一线性扫描 |
 | 空间| O(N) | 间隔存储 |

 该解决方案很容易满足约束条件，因为 N 高达 100000，并且排序加上一次传递完全在 1 秒的时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from contextlib import redirect_stdout
    out = io.StringIO()

    def solve():
        n, T = map(int, sys.stdin.readline().split())
        intervals = []
        for _ in range(n):
            s, e = map(int, sys.stdin.readline().split())
            intervals.append((s, e))

        intervals.sort()
        current_end = 0
        best_gap = 0

        for s, e in intervals:
            if s > current_end:
                best_gap = max(best_gap, s - current_end)
            current_end = max(current_end, e)

        best_gap = max(best_gap, T - current_end)
        print(best_gap)

    with redirect_stdout(out):
        solve()
    return out.getvalue().strip()

# provided sample
assert run("""4 60
5 10
50 55
25 30
15 20
""") == "20"

# no presentations
assert run("""0 10
""") == "10"

# fully covered
assert run("""2 5
0 3
3 5
""") == "0"

# overlapping intervals
assert run("""3 10
1 5
2 6
7 9
""") == "1"

# disjoint with boundary gaps
assert run("""2 10
2 3
8 9
""") == "5"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 空的时间表| 10 | 10 全天缺口处理|
 | 全面覆盖 | 0 | 无间隙外壳 |
 | 重叠合并| 1 | 正确的联合合并|
 | 边界间隙| 5 | 前缀/后缀间隙正确性 |

 ## 边缘情况

 一种重要的边缘情况是根本没有间隔。 该算法永远不会进入循环，current_end 仍为 0，最终答案变为 T - 0，正确生成全天间隙。 

另一种情况是完全覆盖，其中合并的间隔延伸到 T。对于像 [0,3] 和 [3,5] 这样的输入，current_end 变为 5，最终间隙为 T - current_end = 0，正确反映没有空闲时间。 

一种微妙的情况是重叠链，其中间隔不直接成对重叠，但仍然形成一个大块。 例如 [1,4]、[3,6]、[5,10]。 扫描可确保 current_end 单调增长到 10，从而防止中间端点之间出现任何虚假间隙。
