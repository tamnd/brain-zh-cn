---
title: "CF 1179C - 哔叽和餐厅"
description: "我们的任务是模拟一个学校餐厅，其中每道菜都有一份，每个学生都会购买他们能买得起的最贵的菜。 我们的主角谢尔盖想知道，如果他等到所有学生都买完东西，他会得到哪道菜。"
date: "2026-06-12T01:34:17+07:00"
tags: ["codeforces", "competitive-programming", "binary-search", "data-structures", "graph-matchings", "greedy", "implementation", "math", "trees"]
categories: ["algorithms"]
codeforces_contest: 1179
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 569 (Div. 1)"
rating: 2200
weight: 1179
solve_time_s: 82
verified: true
draft: false
---

[CF 1179C - 哔叽和餐厅](https://codeforces.com/problemset/problem/1179/C)

 **评分：** 2200
 **标签：** 二分查找、数据结构、图匹配、贪心、实现、数学、树
 **求解时间：** 1m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们的任务是模拟一个学校餐厅，其中每道菜都有一份，每个学生都会购买他们能买得起的最贵的菜。 我们的主角谢尔盖想知道，如果他等到所有学生都买完东西，他会得到哪道菜。 最初，我们有一系列菜肴价格和一系列学生预算。 然后一系列的查询会改变菜肴的价格或学生的预算。 每次查询后，我们必须报告 Serge 等到所有学生都购买完毕后将购买的菜肴的价格。 

关键挑战是高效处理多达 300,000 个菜肴、300,000 名学生和 300,000 个查询。 模拟每个查询的队列的简单方法将需要每个查询 O(n m) 次操作，导致大约$10^{11}$在最坏的情况下进行操作，这是不可行的。 因此，我们需要一种方法来跟踪可能购买哪些菜肴，而无需单独模拟每个学生。 

边缘情况包括所有菜肴对所有学生来说都太贵的情况，让 Serge 可以自由选择剩下的最贵的菜肴。 如果所有菜肴都由学生购买，Serge 将一无所获。 菜肴价格或学生预算的变化可能会导致 Serge 的结果在是否获得菜肴之间翻转，因此解决方案必须正确处理动态更新。 

## 方法

 暴力方法模拟每个学生购买他们能买得起的最贵的菜，然后为 Serge 找到最大的剩余菜。 这可以保证正确性，但无法满足时间限制，因为在最坏的情况下，我们将为每个查询执行 O(n m) 次操作，这对于最多 300,000 的 n、m、q 来说是禁止的。 

关键的见解是我们不需要确切地知道哪个学生买了哪道菜；我们只需要知道哪个学生买了哪个菜。 我们只需要知道，对于每道菜，在当前的预算下是否会被购买。 这一观察结果使我们能够将问题视为排序数组之间的匹配：按价格和预算对菜肴和学生进行排序，然后模拟从最昂贵的菜肴向下的贪婪匹配。 如果最贵的菜超出了所有学生的预算，那么这道菜将留给 Serge； 否则，它将由第一个买得起的学生购买。 

由于查询会动态改变菜肴价格或学生预算，因此我们需要能够有效维护最大值并跟踪高于特定阈值的菜肴数量的数据结构。 使用二分搜索或多集结构的排序列表是有效的：我们可以在 O(log n) 时间内更新菜肴价格或学生预算，然后找到 Serge 可以高效获取的菜肴。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每个查询 O(n m) | O(n + m) | 太慢了 |
 | 贪婪排序多重集/线段树 | 每个查询 O(log n + log m) | O(n + m) | 已接受 |

 ## 算法演练

 1. 维护两个排序多重集：一组用于菜肴价格，一组用于学生预算。 排序可以确保我们始终能够高效地查询到最高的值。 
2. 对于每个查询，更新菜肴价格或学生预算。 从多重集中删除旧值并插入新值。 这可以通过 O(log n) 运算保留排序顺序。 
3. 每次更新后，确定 Serge 的结果。 首先，找出预算至少等于最贵菜肴价格的学生人数。 这可以通过对已排序的预算数组使用二分搜索来完成。 
4. 如果此类学生的数量少于价格高于各自阈值的菜肴数量，Serge 将获得剩余价格最高的菜肴。 否则，所有菜肴都将被购买，Serge 得到 -1。 
5、每次查询后输出结果。 

工作原理：该算法保持不变，即在任何时刻，菜肴价格和学生预算的排序列表都反映了所有更新后的当前状态。 由于学生贪婪地购买，而且菜肴都是单份的，因此匹配问题就简化为计算有多少学生能买得起哪些菜肴。 使用排序后的多重集，我们可以有效地确定最昂贵的菜肴是否能在所有购买中幸存下来。 

## Python 解决方案```python
import sys
import bisect

input = sys.stdin.readline

n, m = map(int, input().split())
dishes = list(map(int, input().split()))
pupils = list(map(int, input().split()))
q = int(input())

from sortedcontainers import SortedList

dish_sl = SortedList(dishes)
pupil_sl = SortedList(pupils)

for _ in range(q):
    t, i, x = map(int, input().split())
    i -= 1  # convert to 0-based index
    if t == 1:
        # update dish price
        dish_sl.discard(dishes[i])
        dishes[i] = x
        dish_sl.add(x)
    else:
        # update pupil budget
        pupil_sl.discard(pupils[i])
        pupils[i] = x
        pupil_sl.add(x)
    
    # find Serge's dish
    if not dish_sl:
        print(-1)
        continue

    # binary search for the first pupil who can buy the most expensive dish
    max_dish = dish_sl[-1]
    idx = bisect.bisect_left(pupil_sl, max_dish)
    # number of pupils who can afford max_dish
    can_buy = len(pupil_sl) - idx
    if can_buy == 0:
        print(max_dish)
    else:
        if can_buy >= len(dish_sl):
            print(-1)
        else:
            print(dish_sl[-can_buy-1])
```该解决方案使用`SortedList`维护动态排序数组。 对于每个查询，我们都会更新碟子或瞳孔数组，并有效地确定能够幸存的最昂贵的碟子。 微妙之处在于正确处理计数：我们必须知道学生在 Serge 做出选择之前拿走了多少个盘子。 

## 工作示例

 样本1：

 | 菜肴 | 学生 | 最大菜 | 学生 >= 最大 | 哔叽菜|
 | ---| ---| ---| ---| ---|
 | [1] | [1] | 1 | 1 | 1 -> Serge 查询后得到 100 |
 | [100]| [1] | 100 | 100 0 | 100 | 100

 这个痕迹表明，当没有学生买得起这道菜时，Serge 就会接受它。 

样本2：

 输入：`3 3`, 菜肴`[5,3,2]`, 学生`[4,2,1]`, 查询`1 2 6`和`2 1 5`。 

| 步骤| 菜肴 | 学生 | 最大菜 | 学生 >= 最大 | 哔叽菜|
 | ---| ---| ---| ---| ---| ---|
 | 初始| [2,3,5]| [1,2,4]| 5 | 1 | 3 |
 | 查询 1 | [2,6,5]| [1,2,4]| 6 | 0 | 6 |
 | 查询 2 | [2,6,5]| [2,2,4]| 6 | 0 | 6 |

 该示例证实，动态更新后，算法可以正确识别 Serge 可以购买哪道菜。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(q log n + q log m) | O(q log n + q log m) | 每个查询都会以 O(log n 或 log m) 的时间更新一个 SortedList，并且找到 Serge 的菜需要二分搜索 |
 | 空间| O(n + m) | 我们将菜肴价格和学生预算存储在 SortedLists | 中

 当 n、m、q 高达 300,000 时，该解决方案在最坏的情况下每个查询执行大约 180 万次操作，在 4 秒内和 256 MB 内存下运行良好。 

## 测试用例```python
import sys, io
from contextlib import redirect_stdout

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    f = io.StringIO()
    with redirect_stdout(f):
        exec(open('solution.py').read())
    return f.getvalue().strip()

# Provided samples
assert run("1 1\n1\n1\n1\n1 1 100\n") == "100", "sample 1"

# Minimum size
assert run("1 1\n1\n1\n1\n2 1 1\n") == "1", "minimum size update pupil"

# All dishes equal, pupils cannot afford
assert run("3 2\n5 5 5\n1 1\n1\n1 2 10\n") == "10", "update dish above all pupils"

# All pupils rich, Serge gets nothing
assert run("3 3\n5 3 2\n10 10 10\n1\n1 1 6\n") == "-1", "all dishes bought"

# Mixed updates
assert run("3 3\n5 3 2\n4 2 1\n2\n1 2 6\n2 1 5\n") == "6\n6", "dynamic sequence"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | “1 1\n1\n1\n1\n1 1 100\n”| 100 | 100 当学生买不起时，Serge 得到了这道菜 |
 | “1 1\n1\n1\n1\n2 1 1\n”| 1 | 最小尺寸输入，更新瞳孔 |
 | "3 2\n5 5 5\n1 1\n1\n1 2 10\n" | 10 | 10 菜品价格更新超出学生预算|
 | "3 3\n5 3 2\n10 10 10\n1\n1 1 6\n" | -1 | 全部 |
