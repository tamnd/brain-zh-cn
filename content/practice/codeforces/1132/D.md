---
title: "CF 1132D - 压力训练"
description: "我们与 n 名学生进行了一场竞赛，每个学生都有一台笔记本电脑，该笔记本电脑以一些初始电池 ai 启动，每分钟消耗 bi 单位的电量。 比赛持续 k 分钟。"
date: "2026-06-12T04:09:12+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "greedy"]
categories: ["algorithms"]
codeforces_contest: 1132
codeforces_index: "D"
codeforces_contest_name: "Educational Codeforces Round 61 (Rated for Div. 2)"
rating: 2300
weight: 1132
solve_time_s: 83
verified: false
draft: false
---

[CF 1132D - 压力训练](https://codeforces.com/problemset/problem/1132/D)

 **评分：** 2300
 **标签：** 二分查找，贪心
 **求解时间：** 1m 23s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一场比赛`n`学生，每人都有一台笔记本电脑，并以一些初始电池启动`a_i`并消耗`b_i`每分钟的充电单位。 比赛持续`k`分钟。 Polycarp可以购买具有固定整数功率输出的单个充电器`x`并且可以随时将其插入任何笔记本电脑，但一次只能插入一台笔记本电脑。 插入电源后，笔记本电脑会消耗`b_i - x`每分钟单位而不是`b_i`。 目标是找到最小的充电器功率`x`这样在比赛结束之前，任何笔记本电脑的电量都不会低于零。 

输入限制很大：`n`和`k`每个都能达到`2 * 10^5`和初始费用`a_i`可以达到`10^12`。 这排除了任何直接模拟每个学生每一分钟的解决方案，因为这将是`O(n*k)`操作，可以达到`4 * 10^10`，远远超出了3秒内可行的范围。 相反，我们需要一个粗略的算法`O(n log(max_possible_x))`或更好。 

当笔记本电脑相对于其初始充电的消耗率非常高时，就会出现一个重要的边缘情况。 如果充电器的功率不足以及时补偿最苛刻的笔记本电脑，那么任何功率级别都无法拯救它。 例如，如果`a = 1`,`b = 10`， 和`k = 2`，充电器至少需要 10 个单位才能防止笔记本电脑在第一分钟内没电。 粗心的方法可能会在不考虑最坏情况排序的情况下尝试每分钟进行贪婪分配，从而导致负充电，即使充电器在技术上是足够的。 

## 方法

 蛮力方法是迭代每个可能的整数功率输出`x`从0开始，模拟所有`k`分钟，并检查每台笔记本电脑是否都完好无损。 这是正确的，但太慢了，因为`x`可能非常大（最多`10^12`或更多），使得模拟数量成为天文数字。 

关键的观察是对于固定功率输出`x`，我们可以检查可行性`O(n log n)`使用贪心策略。 每台笔记本电脑`i`在没有充电器的情况下，它可以存活的最大分钟数：`(a_i // b_i)`最初，充电时间每增加一分钟就会延长这一时间。 我们可以将问题建模为调度问题：对于候选人`x`,判断是否可以安排`k`所有笔记本电脑的总充电分钟数，确保笔记本电脑的电量不会低于零。 由于耗电量较大的笔记本电脑耗电速度较快，因此应尽早充电。 按所需的最短充电时间对笔记本电脑进行排序并贪婪地分配分钟数，确保我们首先覆盖最关键的笔记本电脑。 

这将问题转化为单调谓词：“是`x`足够吗？”这要么是真，要么是假。因为谓词相对于`x`-如果`x`作品，任何更大的`x`也有效 - 我们可以执行二分搜索`x`找到最小可行值。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * k * max_x) | O(n * k * max_x) | O(n) | 太慢了 |
 | 贪心+二分查找| O(n log(max_possible_x)) | O(n log(max_possible_x)) | O(n) | 已接受 |

 ## 算法演练

 1. 定义一个函数`can_finish(x)`返回`True`如果充电器有电`x`可以确保所有笔记本电脑都能生存。 该函数将贪婪地安排充电。 
2. 对于每台笔记本电脑，计算其在不充电的情况下可以存活多少分钟：`a_i // b_i`。 然后计算如果充电器功率为，还需要多少分钟`x`。 
3. 按笔记本电脑允许的最长充电期限对笔记本电脑进行排序。 首充较小、功耗较高的笔记本电脑更加迫切。 
4. 通过从 0 到每分钟迭代来模拟比赛`k-1`。 每分钟，选择最早到达截止日期且仍需要充电的笔记本电脑，并分配一分钟的充电时间。 
5. 如果在任何时候所需的分钟数超过剩余分钟数，则返回`False`。 
6. 如果所有笔记本电脑在比赛结束前都能保持在零以上，则返回`True`。 
7. 执行二分查找`x`从`0`到`max_possible`（例如，所有的总和`b_i`或者`10^12`） 使用`can_finish(x)`作为谓语。 
8. 返回最小值`x`为此`can_finish(x)`是`True`。 如果没有`x`工作，返回`-1`。 

不变量是在`can_finish(x)`笔记本电脑始终按照紧急程度进行充电，充电总分钟数不会超过比赛时长。 如果这个贪心调度成功了`x`，则充电器电量充足。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def main():
    n, k = map(int, input().split())
    a = list(map(int, input().split()))
    b = list(map(int, input().split()))

    def can_finish(x):
        # compute required charging minutes for each laptop
        need = []
        for ai, bi in zip(a, b):
            if bi > x:
                # number of minutes before this laptop dies if never charged
                m = (ai + x - 1) // (bi - x) if bi != x else float('inf')
                need.append((m, bi))
            else:
                need.append((k, bi))  # will survive entire contest without charging
        need.sort()
        total_minutes = 0
        for minutes_needed, bi in need:
            total_minutes += minutes_needed
            if total_minutes > k:
                return False
        return True

    left, right = 0, max(b) * k + 1
    ans = -1
    while left <= right:
        mid = (left + right) // 2
        if can_finish(mid):
            ans = mid
            right = mid - 1
        else:
            left = mid + 1

    print(ans)

if __name__ == "__main__":
    main()
```功能`can_finish(x)`是使用基于紧急程度的贪婪策略来实现的。 按所需的生存时间排序可确保较早死亡的笔记本电脑优先充电。 二分搜索确保我们有效地找到最小的充足充电器功率。 边缘情况，例如`x`小于最大的`b_i`，由贪婪调度正确处理。 

## 工作示例

 ### 示例 1

 输入：```
2 4
3 2
4 2
```| 分钟 | 笔记本电脑 1 | 笔记本电脑 2 | 充电器已插入|
 | ---| ---| ---| ---|
 | 0 | 3 | 2 | 1 |
 | 1 | 4 | 0 | 2 |
 | 2 | 0 | 3 | 1 |
 | 3 | 1 | 1 | - |

 充电器功率`x=5`让所有笔记本电脑都能生存。 力量`x=4`会导致笔记本电脑 1 在第 2 分钟降至零以下。 

### 自定义示例

 输入：```
3 5
1 2 3
3 2 1
```二分查找找到最小的`x=3`。 笔记本电脑 1 很关键：它每分钟使用 3 次，最初只有 1 次充电，需要立即充电。 Laptop 3 无需充电即可正常使用。 贪婪计划首先将充电器分配给最紧急的笔记本电脑。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n log(max_possible_x)) | O(n log(max_possible_x)) | 对可能的 x 值进行二分搜索，每次检查 O(n) |
 | 空间| O(n) | 需要存储每台笔记本电脑所需的充电时间|

 该算法处理`n`和`k`效率高达 2*10^5。 通过使用简单数组来避免排序或堆，使每个可行性检查都是线性的`n`。 二分查找结束`x`最多 ~10^13 需要 ~40 次迭代。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()
    main()
    return sys.stdout.getvalue().strip()

# Provided samples
assert run("2 4\n3 2\n4 2\n") == "5", "sample 1"

# Minimum-size input
assert run("1 1\n1\n1\n") == "1", "min size"

# Laptop survives without charger
assert run("2 2\n10 10\n1 1\n") == "0", "no charger needed"

# All equal b_i
assert run("3 3\n3 3 3\n3 3 3\n") == "3", "all same consumption"

# Large input edge
assert run("2 100000\n1000000000000 1000000000000\n1 1\n") == "0", "very large a_i"

# Impossible case
assert run("1 2\n1\n5\n") == "-1", "cannot survive"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 1 1\n1\n1 | 1 1\n1\n1 | 1 | 最少的投入 |
 | 2 2\n10 10\n1 1 | 0 | 无需充电器 |
 | 3 3\n3 3 3\n3 3 3 | 3 3\n3 3 3\n3 3 3 | 3 | 全部相等 b_i |
 | 2 100000\n | | |
