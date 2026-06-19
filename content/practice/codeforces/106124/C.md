---
title: "CF 106124C - 钩针比赛"
description: "我们有两个时间戳来描述钩针比赛何时开始和何时结束。 每个时间戳包含一个工作日以及以小时和分钟为单位的时钟时间。 目标是计算比赛持续了多长时间，以天、小时和分钟为单位来衡量。"
date: "2026-06-19T20:02:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106124
codeforces_index: "C"
codeforces_contest_name: "2025-2026 ICPC Nordic Collegiate Programming Contest (NCPC 2025)"
rating: 0
weight: 106124
solve_time_s: 50
verified: true
draft: false
---

[CF 106124C - 钩针比赛](https://codeforces.com/problemset/problem/106124/C)

 **评级：** -
 **标签：** -
 **求解时间：** 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有两个时间戳来描述钩针比赛何时开始和何时结束。 每个时间戳包含一个工作日以及以小时和分钟为单位的时钟时间。 目标是计算比赛持续了多长时间，以天、小时和分钟为单位来衡量。 

微妙之处在于时间在几周内循环。 如果结束时间早于开始时间，则比赛一定会持​​续到下周甚至几周后。 唯一的特殊规则是，如果两个时间戳完全相同，则持续时间定义为正好一周。 

输出必须以标准化形式表达差异：天、小时和分钟，省略任何零值组件，并以自然英语风格格式化其余组件。 

输入大小是恒定的，因此约束非常小。 这立即排除了恒定时间解析和算术之外的任何复杂性问题。 主要困难不是性能，而是在重复的每周周期中正确标准化时间差。 

最常见的错误发生在独立于时钟时间处理工作日时。 例如，将“周一 23:00 至周一 01:00”解释为负持续时间而不是回绕到下周会导致错误的结果。 另一个边缘情况是相同的时间戳，它必须恰好生成 7 天而不是零持续时间。 

## 方法

 暴力思维会尝试一分钟一分钟地模拟时间，从开始时间戳前进直到到达结束时间戳。 这在概念上是正确的，因为时间以分钟为单位离散，并且每一步前进一分钟。 然而，在最坏的情况下，间隔可能长达数周，这意味着长达约 10,000 分钟或更长时间的不必要的迭代。 虽然在实践中仍然很小，但这种方法是不必要的，并且隐藏了问题的真正结构。 

关键的观察结果是，两个时间戳都处于 7 天 × 24 小时 × 60 分钟的单个周期中。 如果我们将每个时间戳映射为一周内的绝对分钟索引，我们可以直接计算差异。 一旦这两个时间都转换为“自一周开始以来的分钟数”，唯一的歧义是在该模块化空间中结束是否早于开始。 如果是这样，我们只需在结束时间上添加一整周即可。 这将问题转化为简单的减法。 

从这里开始，剩下的任务是使用整数除法将总差异分解为天、小时和分钟。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力破解分钟模拟 | O(D)，其中 D 是以分钟为单位的持续时间 | O(1) | O(1) | 已接受但没有必要 |
 | 模块化改造| O(1) | O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们将每个时间戳视为相对于参考周开始的绝对分钟偏移量，例如星期一 00:00。 

1. 将工作日映射到 0 到 6 之间的整数，其中星期一是 0，星期日是 6。这给出了一周中日期的一致排序。 
2. 使用以下公式将每个时间戳转换为从一周开始算起的总分钟数：`total = weekday * 1440 + hour * 60 + minute`。 

这是有效的，因为每天有 1440 分钟。 
3. 比较两个值。 如果最终值严格小于起始值，我们会将其解释为进入下周，因此我们将 7 × 1440 分钟添加到最终值。 
4. 如果两个时间戳相同，则返回正好一周，即 7 × 1440 分钟，不进一步分解。 该规则优先于正常的减法。 
5. 计算以分钟为单位的差异：`diff = end - start`。 
6. 将结果分解为天、小时和分钟：`days = diff // 1440`,`hours = (diff % 1440) // 60`,`minutes = diff % 60`。 
7. 通过仅包含按天、小时、分钟顺序排列的非零组件来构建输出字符串，并使用正确的单数或复数形式对其进行格式化。 

### 为什么它有效

 正确性来自于在固定循环周期内线性化时间轴上表示所有时间戳。 此问题中的任何现实世界时间戳都相当于 10080 分钟周期中的唯一位置。 通过将所有内容转换为线性空间并仅在必要时应用单次环绕校正，我们保留了真实的时间顺序。 分解步骤是精确的，因为固定单位大小上的整数除法将分钟干净地划分为天、小时和分钟，没有重叠或模糊。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

days_map = {
    "Mon": 0,
    "Tue": 1,
    "Wed": 2,
    "Thu": 3,
    "Fri": 4,
    "Sat": 5,
    "Sun": 6
}

def parse(line):
    d, t = line.strip().split()
    h, m = map(int, t.split(":"))
    return days_map[d] * 1440 + h * 60 + m

a = parse(input())
b = parse(input())

WEEK = 7 * 1440

if a == b:
    diff = WEEK
else:
    if b < a:
        b += WEEK
    diff = b - a

days = diff // 1440
diff %= 1440
hours = diff // 60
minutes = diff % 60

parts = []
if days:
    parts.append(f"{days} day" + ("s" if days != 1 else ""))
if hours:
    parts.append(f"{hours} hour" + ("s" if hours != 1 else ""))
if minutes:
    parts.append(f"{minutes} minute" + ("s" if minutes != 1 else ""))

print(", ".join(parts))
```解析步骤将工作日和时钟时间转换为表示自一周开始以来的分钟数的单个整数。 换行处理至关重要：当结束时间在本周早些时候时，我们明确地将其向前移动一整周，以便减法仍然有效。 

格式化逻辑增量地构建输出，并确保完全省略零个组件，这是语句的输出规则所要求的。 

## 工作示例

 ### 示例 1

 输入：

 周一 08:00

 周一 15:00

 我们将这两个时间都映射为分钟：

 | 步骤| 开始| 结束 |
 | --- | --- | --- |
 | 工作日指数| 0 | 0 |
 | 小时/分钟换算| 480 | 480 900 | 900
 | 总分钟数 | 480 | 480 900 | 900

 时差为 420 分钟。 

| 步骤| 价值|
 | --- | --- |
 | 差异| 420 | 420
 | 天| 0 |
 | 小时 | 7 |
 | 分钟| 0 |

 输出变为：

 7小时

 这证实了该算法可以正确处理当日差异，而无需任何换行逻辑。 

### 示例 2

 输入：

 周一 10:00

 周三 08:59

 | 步骤| 开始| 结束 |
 | --- | --- | --- |
 | 工作日指数| 0 | 2 |
 | 小时/分钟换算 | 600 | 2×1440 + 539 = 3419 |
 | 总分钟数 | 600 | 3419 | 3419

 由于 end ≥ start，因此不需要换行。 

| 步骤| 价值|
 | --- | --- |
 | 差异| 2819 | 2819
 | 天| 1 |
 | 小时 | 22 | 22
 | 分钟| 59 | 59

 输出：

 1天22小时59分钟

 这显示了跨多个单元的正确分解。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅对两个时间戳进行恒定时间解析和算术 |
 | 空间| O(1) | O(1) | 固定映射和一些整数 |

 计算纯粹是算术，与任何输入大小的增长无关。 它可以轻松地适应任何合理的限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    import sys as _sys
    from math import *
    # assume solution is wrapped in main logic below
    return _sys.stdout.getvalue().strip()

# Since the solution is script-style, we instead test logic directly:

def solve(inp: str) -> str:
    import sys
    from io import StringIO
    backup = sys.stdin
    sys.stdin = StringIO(inp)

    days_map = {"Mon":0,"Tue":1,"Wed":2,"Thu":3,"Fri":4,"Sat":5,"Sun":6}

    def parse(line):
        d,t=line.strip().split()
        h,m=map(int,t.split(":"))
        return days_map[d]*1440+h*60+m

    a=parse(sys.stdin.readline())
    b=parse(sys.stdin.readline())

    WEEK=7*1440

    if a==b:
        diff=WEEK
    else:
        if b<a:
            b+=WEEK
        diff=b-a

    d=diff//1440
    diff%=1440
    h=diff//60
    m=diff%60

    parts=[]
    if d:
        parts.append(f"{d} day"+("s" if d!=1 else ""))
    if h:
        parts.append(f"{h} hour"+("s" if h!=1 else ""))
    if m:
        parts.append(f"{m} minute"+("s" if m!=1 else ""))

    sys.stdin = backup
    return ", ".join(parts)

# provided samples
assert solve("Mon 08:00\nMon 15:00\n") == "7 hours"
assert solve("Mon 10:00\nWed 08:59\n") == "1 day, 22 hours, 59 minutes"

# custom cases
assert solve("Mon 00:00\nMon 00:00\n") == "7 days", "exact same time"
assert solve("Sun 23:59\nMon 00:00\n") == "1 minute", "wrap across week boundary"
assert solve("Fri 10:00\nFri 10:01\n") == "1 minute", "minute precision"
assert solve("Sat 12:00\nSun 11:00\n") == "23 hours", "less than a day"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 周一 00:00 → 周一 00:00 | 7 天 | 相同时间戳规则 |
 | 周日 23:59 → 周一 00:00 | 1 分钟 | 周包裹处理|
 | 周五 10:00 → 周五 10:01 | 1 分钟 | 分钟级正确性 |
 | 周六 12:00 → 周日 11:00 | 23 小时 | 无日边界情况|

 ## 边缘情况

 一种重要的边缘情况是时间戳相同。 例如：

 输入：

 周一 00:00

 周一 00:00

 该算法在任何算术之前检测相等性。 它直接分配一整周 10080 分钟。 这可以避免错误地产生零持续时间，这将违反问题规范。 

另一种情况是在周末结束时进行的：

 输入：

 周日 23:59

 周一 00:00

 这里，结束时间戳转换为比开始时间戳更小的数值。 该算法在末尾添加 10080 分钟，产生 1 分钟的差异。 这表明只有在标准化为线性每周周期后才会保留排序。 

最后一种微妙的情况是持续时间少于一小时或一天。 分解步骤可以清楚地处理这个问题，因为整数除法自然会产生零个更高的分量，然后在格式化过程中将其省略。
