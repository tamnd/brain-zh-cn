---
title: "CF 153D - 日期更改"
description: "我们被要求通过添加或减去天数来操纵日期。 输入由“DD.MM.YYYY”格式的日期字符串和表示天数变化的整数组成，该整数可以是正数或负数。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special"]
categories: ["algorithms"]
codeforces_contest: 153
codeforces_index: "D"
codeforces_contest_name: "Surprise Language Round 5"
rating: 2000
weight: 153
solve_time_s: 76
verified: true
draft: false
---

[CF 153D - 日期更改](https://codeforces.com/problemset/problem/153/D)

 **评级：** 2000
 **标签：** *特别
 **求解时间：** 1m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求通过添加或减去天数来操纵日期。 输入由“DD.MM.YYYY”格式的日期字符串和表示天数变化的整数组成，该整数可以是正数或负数。 输出是一个格式相同的日期字符串，表示原始日期偏移了那么多天。 从概念上讲，问题简化为沿着日历向前或向后移动，同时尊重月份长度和闰年。 

约束相对较小：偏移限制为±1000天，输入年份始终在1980年至2020年之间。这意味着我们不需要针对极大的范围进行优化； 与天数成正比的操作是可行的。 然而，幼稚的实现通常会在月末过渡、二月闰日和负偏移等边界情况下失败。 例如，从“28.02.2012”开始，移位 1 应生成“29.02.2012”，移位 2 应生成“01.03.2012”。 忽略闰年的粗心方法将为两者生成“01.03.2012”。 

负转变也需要小心处理。 如果输入为“01.03.2012”且移位为 -1，则正确的输出为“29.02.2012”，而不是简单计算可能产生的“28.02.2012”。 这些边缘情况表明，必须明确应用月份长度和闰年规则或通过可靠的日期库应用。 

## 方法

 强力方法很简单：将日期字符串转换为单独的日、月和年整数，然后一次递增或递减一天，每当一天超过该月的天数或低于 1 时，就调整月份和年份。 这种方法是正确的，因为它显式地模拟了日历，但它的最坏情况时间复杂度为 O(|shift|)，这是可以接受的，因为 |shift| ≤ 1000，但如果轮班数为数百万，则速度会太慢。 

最佳方法利用 Python 的内置`datetime`模块，在内部处理闰年、月份边界和负移。 这消除了手动日期算术和边缘情况处理的需要。 关键的见解是`datetime.date`对象可以安全地与`datetime.timedelta`代表天数的对象。 添加正数或负数`timedelta`自动正确计算结果日、月和年。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O( | 移位 | ) |
 | 最佳| O(1) | O(1) | O(1) | O(1) | 已接受、简洁、处理所有边缘情况 |

 ## 算法演练

 1. 读取输入日期字符串，并使用字符串切片或句点字符拆分将其拆分为日、月和年整数。 这会将“DD.MM.YYYY”转换为三个整数进行计算。 
2. 读取整数移位值。 该值可以是正数或负数，表示日历上的向前或向后移动。 
3. 创建一个`datetime.date`使用解析的年、月和日的对象。 该对象表示确切的输入日期。 
4. 创建一个`datetime.timedelta`天数等于班次的对象。`timedelta`原生支持负值。 
5. 添加`timedelta`到`date`目的。 Python 在内部计算结果日期，正确处理月份转换、闰年和负移。 
6. 将生成的日期对象格式化回“DD.MM.YYYY”格式的字符串，确保日和月为两位数字，年份为四位数字。 这保留了所需的输出格式。 

这样做的原因是Python的`datetime`模块保证算术`date`对象尊重所有日历规则，包括闰年。 无需手动跟踪一个月中的天数或调整 2 月 29 日，这消除了潜在的相差一错误。 

## Python 解决方案```python
import sys
import datetime
input = sys.stdin.readline

date_str = input().strip()
shift = int(input().strip())

day, month, year = map(int, date_str.split('.'))
current_date = datetime.date(year, month, day)
shifted_date = current_date + datetime.timedelta(days=shift)

print(shifted_date.strftime('%d.%m.%Y'))
```第一部分解析输入。 我们使用`strip()`删除尾随换行符。`map(int, ...)`将分割后的字符串转换为整数。 这`datetime.date`构造函数确保输入是有效的日期。`datetime.timedelta`处理移位并允许负值，从而消除了容易出错的手动算术。 最后，`strftime`保证输出格式与带有前导零的“DD.MM.YYYY”完全匹配。 

## 工作示例

 输入示例 1：```
10.02.2012
12
```| 变量| 价值|
 | --- | --- |
 | 日 | 10 | 10
 | 月 | 2 |
 | 年 | 2012 |
 | 当前日期 | 2012-02-10 |
 | 移位日期 | 2012-02-22 |

 该算法正确地添加了 12 天，相当于 2012 年 2 月有 29 天。 

示例输入 2（负移）：```
01.03.2012
-1
```| 变量| 价值|
 | --- | --- |
 | 日 | 1 |
 | 月 | 3 |
 | 年 | 2012 |
 | 当前日期 | 2012-03-01 |
 | 移位日期 | 2012-02-29 |

 这演示了如何正确处理负偏移和闰日。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 所有操作都使用Python的内置日期算术和字符串解析，与移位大小无关。 |
 | 空间| O(1) | O(1) | 仅创建了一些整数和日期对象，没有额外的数据结构。 |

 该解决方案可以轻松满足任何有效输入的 2 秒时间限制和 256 MB 内存限制。 

## 测试用例```python
import sys, io
import datetime

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    date_str = input().strip()
    shift = int(input().strip())
    day, month, year = map(int, date_str.split('.'))
    current_date = datetime.date(year, month, day)
    shifted_date = current_date + datetime.timedelta(days=shift)
    return shifted_date.strftime('%d.%m.%Y')

# Provided samples
assert run("10.02.2012\n12\n") == "22.02.2012", "sample 1"
assert run("01.03.2012\n-1\n") == "29.02.2012", "sample 2"

# Custom cases
assert run("28.02.2011\n1\n") == "01.03.2011", "non-leap year feb"
assert run("28.02.2012\n1\n") == "29.02.2012", "leap year feb"
assert run("31.12.2019\n1\n") == "01.01.2020", "year change forward"
assert run("01.01.1980\n-1\n") == "31.12.1979", "year change backward"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2011 年 2 月 28 日 1 | 2011 年 3 月 1 日 | 非闰年的正常二月到三月过渡 |
 | 2012 年 2 月 28 日 1 | 2012 年 2 月 29 日 | 闰日处理 |
 | 2019 年 12 月 31 日 1 | 2020 年 1 月 1 日 | 年末增量|
 | 1980年1月1日 -1 | 1979 年 12 月 31 日 | 跨年度边界的负移 |

 ## 边缘情况

 从闰年的 2 月 29 日开始，一年减一天是一个微妙的优势。 对于移位 365 的输入“29.02.2012”，Python 计算出正确的输出为“28.02.2013”​​，因为 2013 年不是闰年。 同样，跨月或年边界的负偏移会自动处理，例如“01.03.2012”，偏移 -1 生成“29.02.2012”。 使用`datetime`模块消除了这些边缘情况下通常出现的手动跟踪错误。
