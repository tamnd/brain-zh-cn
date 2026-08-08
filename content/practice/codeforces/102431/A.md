---
title: "CF 102431A - 快速启动"
description: "对于每个测试用例，我们都有 2019 年 Kick Start 轮次时间表和代表今天的日期。 预定日期可以按任何顺序出现。 我们需要找到严格晚于今天且尽可能早的预定日期。"
date: "2026-08-08T17:14:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102431
codeforces_index: "A"
codeforces_contest_name: "2019 China Collegiate Programming Contest Final (CCPC-Final 2019)"
rating: 0
weight: 102431
solve_time_s: 194
verified: true
draft: false
---

[CF 102431A - 快速启动](https://codeforces.com/problemset/problem/102431/A)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 对于每个测试用例，我们都有 2019 年 Kick Start 轮次时间表和代表今天的日期。 预定日期可以按任何顺序出现。 我们需要找到严格晚于今天且尽可能早的预定日期。 如果每个预定回合都是在今天或更早，则 2019 年没有剩余回合，因此所需答案为`See you next year`。 

日期使用月份名称，例如`Jan`,`Feb`， 和`Sept`，后跟序数天数，例如`1st`,`22nd`， 或者`31st`。 由于每个日期都属于 2019 年，因此比较两个日期只需比较它们的月份和日期。 我们可以将每个日期转换为一对`(month_number, day)`并使用普通的字典顺序比较。 

一个测试用例最多安排20轮，最多100个测试用例。 这是一个非常小的输入大小，因此即使每个测试用例执行数百或数千个简单操作的方法也非常快。 特别是，不需要高级数据结构或复杂的排序算法。 直接扫描预定日期只需`O(n)`时间、地点`n <= 20`。 

主要边界条件是今天本身不得被视为下一轮。 例如，如果计划包含`Jan 2nd`今天是`Jan 2nd`，答案不是`Jan 2nd`。 如果没有更晚的日期，则正确的结果是`See you next year`。 

当下一轮是在下个月时，就会出现第二种边缘情况。 例如：```
1
2
Jan 31st
Feb 1st
Jan 31st
```正确的输出是：```
Case #1: Feb 1st
```仅基于天数的比较会错误地偏好`Jan 31st`或者未能正确排序日期。 月份必须是比较的一部分。 

第三种边缘情况发生在今天每轮预定的比赛之后。 例如：```
1
2
Jan 10th
Mar 20th
Dec 31st
```正确的输出是：```
Case #1: See you next year
```粗心的实现可能会返回它检查的最后日期，而不是显式检查是否存在较晚的一轮。 

输入语句保证预定的日期是不同的，因此两个预定的轮次不能占用相同的日期。 然而，代表今天的日期可能等于预定日期之一，并且必须排除这种相等性，因为该问题要求严格稍后进行一轮。 

## 方法

 最直接的暴力方法是检查今天之后的每个日历日期，从明天开始，直到 2019 年底。对于每个候选人日期，我们可以扫描所有预定的轮次并检查该候选人是否在场。 第一个匹配的日期就是答案。 这是有效的，因为日期是自然排序的，并且今天之后遇到的第一个预定日期必须是最早的日期。 

一年最多 365 天，最多 20 轮预定回合，最多执行约`365 * 20 = 7300`每个测试用例的日期比较。 在 100 个测试用例中，最多进行大约 730,000 次比较，这已经足够快了。 因此，尽管不太优雅，但这种蛮力方法在给定的约束下是可以接受的。 

更简洁的方法来自于观察我们实际上不需要枚举日历。 对于每一个预定的日期，我们都可以问一个问题：这个日期严格晚于今天吗？ 如果是，则为候选人。 在所有候选者中，我们保留最小的一个。 这立即将问题减少到一次扫描`n`预定日期。 

将日期转换为后比较就变得简单了`(month, day)`。 例如，`Mar 24th`变成`(3, 24)`， 尽管`Apr 20th`变成`(4, 20)`。 Python 按字典顺序比较元组，所以`(4, 20)`被正确地认为晚于`(3, 24)`。 

蛮力方法之所以有效，是因为日历的固定天数很小，但它在甚至未安排的日期上执行工作。 直接扫描完全避免了不必要的工作。 自从`n`只有 20，最佳解决方案是简单地检查每个预定轮次并保留最早的有效候选者。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(365n)`|`O(n)`| 已接受，但不必要的工作 |
 | 最佳 |`O(n)`|`O(n)`| 已接受 |

 ## 算法演练

 1. 通过分配按时间顺序存储月份名称`Jan`至 1,`Feb`至 2，依此类推。 输入使用`Sept`，因此映射中必须包含准确的拼写。 
2. 将今天的日期转换为一对`(month, day)`。 以这种方式表示的日期可以直接与另一个日期进行比较，因为月份是第一个组成部分，而日期是第二个组成部分。 
3. 阅读每一项`n`预定日期并将其转换为相同的日期`(month, day)`表示。 也保留原始文本，因为输出必须使用原始序数格式，例如`Feb 2nd`。 
4. 对于每个预定日期，检查是否是`(month, day)`这对严格地大于今天的对。 需要严格比较，因为今天发生的一轮不是未来的一轮。 
5. 在严格晚于今天的所有日期中，保留日期对最小的日期。 这正是预定的下一轮，因为每个较早的候选人都已被拒绝或被较晚的候选人取代，而剩余的最小候选人是今天之后的第一个预定日期。 
6. 如果没有安排的日期严格晚于今天，则打印`See you next year`。 否则，打印所选预定日期的原始文本。 

### 为什么它有效

 保持不变式，即在处理完调度的任何前缀后，`best`是该前缀中严格晚于今天的最早预定日期。 当新日期不晚于今天时，它不能作为答案并被忽略。 当比今天晚的时候，就变成了`best`如果不存在更早的候选者，或者替换`best`如果它发生在当前候选人之前。 处理完所有预定日期后，不变量表示`best`是今天之后最早安排的一轮。 如果没有找到候选人，那么今天之后就不会发生预定的回合，所以`See you next year`是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

MONTH = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sept": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12,
}

def parse_date(s):
    month, day = s.split()
    day = int(day.rstrip("stndrh"))
    return MONTH[month], day

def solve():
    t = int(input())

    for case in range(1, t + 1):
        n = int(input())

        schedule = []
        for _ in range(n):
            s = input().strip()
            schedule.append((parse_date(s), s))

        today_text = input().strip()
        today = parse_date(today_text)

        best_date = None
        best_text = None

        for date, text in schedule:
            if date > today:
                if best_date is None or date < best_date:
                    best_date = date
                    best_text = text

        if best_text is None:
            answer = "See you next year"
        else:
            answer = best_text

        print(f"Case #{case}: {answer}")

if __name__ == "__main__":
    solve()
```这`MONTH`字典将文本月份缩写转换为其时间顺序位置。 这避免了尝试比较字符串，例如`Apr`和`Feb`，其字母顺序与日历顺序无关。`parse_date`分隔月份和序数日。 删除序数后缀留下整数天，所以`2nd`变成`2`和`24th`变成`24`。 该后缀在语义上与日期比较无关。 

每个计划条目都存储其标准化日期对及其原始文本。 标准化对用于比较，而原始字符串直接返回，以便输出保留所需​​的拼写和序数后缀。 

条件`date > today`是关键边界检查。 使用`>=`当今天本身就是预定日期时，会错误地选择今天的回合。 第二个条件比较候选者并保留最小的一个，这实现了下一轮的定义。 

不存在整数溢出问题，因为涉及的最大值是月份数 12 和日数 31。输入也很小，所以标准`sys.stdin.readline`对于所需的 I/O 量来说已经绰绰有余。 

## 工作示例

 对于第一个样本，时间表是`Jan 1st`,`Feb 2nd`， 和`Mar 3rd`，而今天是`Jan 2nd`。 

| 预定日期 | 解析日期 | 比今天晚吗？ | 当前最佳|
 | --- | --- | --- | --- |
 |`Jan 1st`|`(1, 1)`| 没有 | 无 |
 |`Feb 2nd`|`(2, 2)`| 是的 |`Feb 2nd`|
 |`Mar 3rd`|`(3, 3)`| 是的 |`Feb 2nd`|

 第一个日期在今天之前，因此被丢弃。`Feb 2nd`是第一个有效的候选人。`Mar 3rd`也是在未来，但比当前候选人晚，所以答案仍然存在`Feb 2nd`。 

对于第二个样本，预定日期是`Mar 24th`,`Apr 20th`,`May 26th`,`Jul 28th`,`Aug 25th`,`Sept 29th`,`Oct 19th`， 和`Nov 17th`。 今天是`Nov 17th`。 

| 预定日期 | 解析日期 | 比今天晚吗？ | 当前最佳|
 | --- | --- | --- | --- |
 |`Mar 24th`|`(3, 24)`| 没有 | 无 |
 |`Apr 20th`|`(4, 20)`| 没有 | 无 |
 |`May 26th`|`(5, 26)`| 没有 | 无 |
 |`Jul 28th`|`(7, 28)`| 没有 | 无 |
 |`Aug 25th`|`(8, 25)`| 没有 | 无 |
 |`Sept 29th`|`(9, 29)`| 没有 | 无 |
 |`Oct 19th`|`(10, 19)`| 没有 | 无 |
 |`Nov 17th`|`(11, 17)`| 没有 | 无 |

 每个预定日期都是今天或更早。 因此，候选人仍然是空的，产生`See you next year`。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n)`每个测试用例| 每个预定回合都会被解析和检查一次 |
 | 空间|`O(n)`| 时间表与其原文一起存储|

 和`n <= 20`最多 100 个测试用例，该算法总共只执行几千次日期比较。 内存使用量也很小，因为每个测试用例最多存储 20 个调度条目。 

## 测试用例```python
import sys
import io

MONTH = {
    "Jan": 1,
    "Feb": 2,
    "Mar": 3,
    "Apr": 4,
    "May": 5,
    "Jun": 6,
    "Jul": 7,
    "Aug": 8,
    "Sept": 9,
    "Oct": 10,
    "Nov": 11,
    "Dec": 12,
}

def parse_date(s):
    month, day = s.split()
    day = int(day.rstrip("stndrh"))
    return MONTH[month], day

def solve():
    input = sys.stdin.readline
    t = int(input())

    out = []

    for case in range(1, t + 1):
        n = int(input())

        schedule = []
        for _ in range(n):
            s = input().strip()
            schedule.append((parse_date(s), s))

        today = parse_date(input().strip())

        best_date = None
        best_text = None

        for date, text in schedule:
            if date > today:
                if best_date is None or date < best_date:
                    best_date = date
                    best_text = text

        if best_text is None:
            answer = "See you next year"
        else:
            answer = best_text

        out.append(f"Case #{case}: {answer}")

    return "\n".join(out) + "\n"

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

# Sample 1
assert run(
    """1
3
Jan 1st
Feb 2nd
Mar 3rd
Jan 2nd
"""
) == "Case #1: Feb 2nd\n"

# Sample 2
assert run(
    """1
8
Mar 24th
Apr 20th
May 26th
Jul 28th
Aug 25th
Sept 29th
Oct 19th
Nov 17th
Nov 17th
"""
) == "Case #1: See you next year\n"

# Minimum-size input, with today equal to the only scheduled round
assert run(
    """1
1
Jan 1st
Jan 1st
"""
) == "Case #1: See you next year\n"

# Boundary between months, catches day-only comparison mistakes
assert run(
    """1
2
Jan 31st
Feb 1st
Jan 31st
"""
) == "Case #1: Feb 1st\n"

# Today is the earliest date, so the next round is the minimum
# scheduled date strictly after today
assert run(
    """1
4
Dec 31st
Feb 1st
Jan 2nd
Jun 15th
Jan 1st
"""
) == "Case #1: Jan 2nd\n"

# Maximum-size schedule with all 20 scheduled dates distinct
assert run(
    """1
20
Jan 1st
Jan 2nd
Jan 3rd
Jan 4th
Jan 5th
Jan 6th
Jan 7th
Jan 8th
Jan 9th
Jan 10th
Jan 11th
Jan 12th
Jan 13th
Jan 14th
Jan 15th
Jan 16th
Jan 17th
Jan 18th
Jan 19th
Jan 20th
Jan 10th
"""
) == "Case #1: Jan 11th\n"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n = 1`, 预定的`Jan 1st`， 今天`Jan 1st`|`See you next year`| 最小尺寸和严格不平等 |
 |`Jan 31st`,`Feb 1st`， 今天`Jan 31st`|`Feb 1st`| 在月份边界处正确进行月份排序 |
 | 今天有四个未排序的日期`Jan 1st`|`Jan 2nd`| 选择最小的未来日期而不是第一个输入日期 |
 | 今天有二十个不同的一月日期`Jan 10th`|`Jan 11th`| 最大限度`n`和校正线性扫描|
 | 一次输入进行多项测试 | 相应的`Case #x`线路 | 独立处理和案件编号|

 “所有平等的价值”这个短语需要对这个问题进行一些限定。 安排的日期保证是不同的，因此测试用例不能合法地包含多个相同的安排日期。 最接近的有效相等情况是今天的日期等于预定日期，如上面的最小大小测试所示。 这种情况在这里更有用，因为它直接测试严格的`>`健康）状况。 

## 边缘情况

 当今天本身是预定日期时，算法会拒绝它，因为条件需要`date > today`。 例如：```
1
2
Jan 2nd
Feb 2nd
Jan 2nd
```

`Jan 2nd`与今天相比等于，因此被忽略。`Feb 2nd`后来成为候选人。 输出是：```
Case #1: Feb 2nd
```当未来日期跨越月份边界时，标准化对的两个组成部分都很重要。 为了：```
1
2
Jan 31st
Feb 1st
Jan 31st
```日期变成`(1, 31)`和`(2, 1)`。 由于首先比较的是月份，`(2, 1)`是后来的事。 答案是`Feb 1st`，尽管它的天数较小。 

当每个预定日期早于今天时，不会存储任何候选人。 为了：```
1
3
Jan 10th
Jun 20th
Nov 30th
Dec 31st
```所有三个日期均未通过`date > today`测试。`best_text`遗迹`None`，所以算法打印：```
Case #1: See you next year
```当计划未排序时，算法不依赖于输入顺序。 考虑：```
1
4
Dec 31st
Feb 1st
Jan 2nd
Jun 15th
Jan 1st
```候选人按顺序出现`Dec 31st`,`Feb 1st`,`Jan 2nd`， 和`Jun 15th`。 看到后`Dec 31st`，它就成为当前最好的。`Feb 1st`替换它，并且`Jan 2nd`再次替换它。 最终的答案是`Jan 2nd`。 这正是为什么维护最短未来日期优于返回遇到的第一个未来日期的原因。 

当今天是一年的最后一天时，2019 年就不可能有更晚的日期。例如：```
1
1
Dec 31st
Dec 31st
```唯一的预定日期等于今天，因此将其排除，输出为：```
Case #1: See you next year
```同样的逻辑还可以处理包含多个月份的日期的时间表，而不需要 12 月的任何特殊情况。 归一化的`(month, day)`表示形式为 2019 年的每个日期提供了总的时间顺序，因此一个比较规则可以处理整个日历。
