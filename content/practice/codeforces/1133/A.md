---
title: "CF 1133A - 比赛中间"
description: "任务是根据比赛的开始和结束时间（以小时和分钟为单位）找到比赛的确切中点。 输入给出的开始时间为 h1:m1，结束时间为 h2:m2。"
date: "2026-06-12T04:03:52+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1133
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 544 (Div. 3)"
rating: 1000
weight: 1133
solve_time_s: 67
verified: true
draft: false
---

[CF 1133A - 比赛中间](https://codeforces.com/problemset/problem/1133/A)

 **评分：** 1000
 **标签：** 实施
 **求解时间：** 1m 7s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是根据比赛的开始和结束时间（以小时和分钟为单位）找到比赛的确切中点。 The input gives the start time as`h1:m1`结束时间为`h2:m2`。 我们保证比赛持续偶数分钟，并且比赛在一天内进行。 输出必须是同一区域的中点`hh:mm`格式。 

实际上，这意味着我们需要计算比赛的总持续时间（以分钟为单位），将其除以二，然后将其添加到开始时间。 限制很小：小时在 0 到 23 之间，分钟在 0 到 59 之间。因为所有运算都是对整数的简单算术，并且我们只计算单个中点，所以性能不是问题。 一步步计算时间的简单方法总是很快。 

例如，微妙的边缘情况包括在半小时边界或接近午夜开始或结束的比赛`23:58`到`23:59`不允许，因为比赛至少持续 2 分钟，但是`23:58`到`00:00`如果考虑日期边界则有效（但问题保证只有一天）。 另一个潜在的陷阱是，当中点超过 59 分钟时，忘记将分钟转入小时。 

## 方法

 暴力方法会一分钟一分钟地模拟比赛，计算到一半，然后打印相应的小时和分钟。 这是有效的，因为我们保证有一个小的固定时间范围（一天最多 1440 分钟）。 这种方法是正确的，但对于较大范围或多个查询来说，速度不必要地慢，因为它在比赛的每一分钟都执行一个循环。 

关键的见解是我们可以完全用从午夜开始的分钟来表示时间。 转换开始时间`h1:m1`到`start_minutes = h1 * 60 + m1`和结束时间`h2:m2`到`end_minutes = h2 * 60 + m2`。 以分钟为单位的中点是`(start_minutes + end_minutes) // 2`。 最后，通过整数除法和取模将其转换回小时和分钟。 这是可行的，因为所有算术都是线性的，并且我们保证总分钟数是偶数，因此整数除法会产生正确的中点，而不会出现舍入问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O（持续时间以分钟为单位）| O(1) | O(1) | 对于这个问题来说正确但不必要 |
 | 最佳 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取开始时间`h1:m1`和结束时间`h2:m2`。 
2. 将两个时间转换为自午夜以来的总分钟数。 计算`start_minutes = h1 * 60 + m1`和`end_minutes = h2 * 60 + m2`。 这允许线性算术，而不必担心时间循环。 
3. 计算以分钟为单位的中点：`(start_minutes + end_minutes) // 2`。 整数除法之所以有效，是因为总比赛时间保证是偶数。 
4. 将中点转换回小时和分钟`mid_h = mid_minutes // 60`和`mid_m = mid_minutes % 60`。 
5. 以两位数格式打印结果，小时和分钟使用零填充以匹配`hh:mm`要求。 

为什么有效：转换为总分钟数可确保我们自动处理从分钟到小时的任何结转。 整数除法恰好计算出持续时间的一半，模 60 和整数除以 60 可以正确重建小时和分钟。 问题中的保证可以防止舍入错误或天数溢出。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

h1, m1 = map(int, input().strip().split(':'))
h2, m2 = map(int, input().strip().split(':'))

start_minutes = h1 * 60 + m1
end_minutes = h2 * 60 + m2

mid_minutes = (start_minutes + end_minutes) // 2

mid_h = mid_minutes // 60
mid_m = mid_minutes % 60

print(f"{mid_h:02d}:{mid_m:02d}")
```该解决方案首先使用解析输入`split(':')`并将小时和分钟转换为整数。 计算总分钟数可以简化所有算术。 将开始分钟和结束分钟的总和除以二直接计算中点。 最后，通过整数除法和模数将分钟转换回小时和分钟，并进行格式化以保持两位数的要求。 该问题的保证意味着除了零填充之外不需要边界检查。 

## 工作示例

 输入示例 1：```
10:00
11:00
```| 变量| 价值|
 | ---| ---|
 | h1，m1 | 10, 0 |
 | h2, 平方米 | 11, 0 |
 | 开始分钟 | 600 |
 | 结束分钟 | 660 | 660
 | 分钟 | 中分钟 | 630 | 630
 | 中时 | 10 | 10
 | 中米 | 30|

 跟踪显示，转换为分钟可以简化查找中点的过程：600 + 660 = 1260，除以 2 得到 630 分钟，相当于 10 小时 30 分钟。 

自定义输入2：```
11:10
11:12
```| 变量| 价值|
 | ---| ---|
 | h1，m1 | 11, 10 | 11, 10
 | h2, 平方米 | 11, 12 | 11, 12
 | 开始分钟 | 670 | 670
 | 结束分钟 | 672 | 672
 | 分钟 | 中分钟 | 671 | 671
 | 中时 | 11 | 11
 | 中米 | 11 | 11

 这表明该算法正确处理分钟级精度，产生`11:11`进行两分钟的比赛。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 仅执行固定数量的算术运算 |
 | 空间| O(1) | O(1) | 只存储了几个整型变量 |

 该方法是恒定的时间和空间，完全在限制之内。 由于输入大小固定为两倍，因此不存在性能问题。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    h1, m1 = map(int, input().strip().split(':'))
    h2, m2 = map(int, input().strip().split(':'))
    start_minutes = h1 * 60 + m1
    end_minutes = h2 * 60 + m2
    mid_minutes = (start_minutes + end_minutes) // 2
    mid_h = mid_minutes // 60
    mid_m = mid_minutes % 60
    return f"{mid_h:02d}:{mid_m:02d}"

# provided sample
assert run("10:00\n11:00\n") == "10:30", "sample 1"

# minimum duration
assert run("00:00\n00:02\n") == "00:01", "minimum duration"

# even duration with minutes overflow
assert run("23:58\n23:59\n") == "23:58", "edge minutes overflow not allowed, guaranteed >=2 minutes"

# odd/even alignment
assert run("11:10\n11:12\n") == "11:11", "2-minute contest in mid hour"

# full day split
assert run("00:00\n23:58\n") == "11:59", "halfway through full day minus two minutes"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 10:00 11:00 | 10:30 | 10:30 标准1小时竞赛|
 | 00:00 00:02 | 00:01 | 00:01 最短比赛时间|
 | 11:10 11:12 | 11:11 | 11:11 比赛时间很短，不准时|
 | 00:00 23:58 | 11:59 | 11:59 漫长的比赛几乎持续一整天|

 ## 边缘情况

 该算法可以正确处理持续两分钟的比赛。 例如，输入`00:00`和`00:02`转换为分钟 0 和 2，中点为 1 分钟，转换回`00:01`。 它还可以处理需要几分钟到几小时的时间，而无需任何特殊情况。 对偶数持续时间的保证可防止舍入错误，并且格式可确保输出始终具有两位数的小时和分钟。
