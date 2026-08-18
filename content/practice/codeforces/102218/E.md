---
title: "CF 102218E - 环境应急"
description: "我们有一组 N 个 AQI 预测，连续的每一天都有一个值。 我们还知道第一个数组元素对应的工作日和阈值 X。当 AQI 至少为 X 时，学校就暂停上课。"
date: "2026-08-17T23:18:50+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102218
codeforces_index: "E"
codeforces_contest_name: "2019, XI Annual Programming Contest by ESCOM-IPN"
rating: 0
weight: 102218
solve_time_s: 176
verified: false
draft: false
---

[CF 102218E - 环境意外事件](https://codeforces.com/problemset/problem/102218/E)

 **评级：** -
 **标签：** -
 **求解时间：** 2m 56s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一系列`N`AQI 预测，连续每一天都有一个值。 我们还知道第一个数组元素对应的工作日和阈值`X`。 当 AQI 至少为`X`。 周六和周日不计算在内，即使 AQI 达到阈值。 

任务是计算 AQI 至少为的数组位置`X`其对应的工作日是周一到周五。 

第一行可以包含多达`10^6`天。 这立即排除了重复扫描阵列或执行与每个位置距第一天的距离成比例的工作的算法。 一个`O(N)`扫描是自然目标，因为每个 AQI 值都必须至少检查一次。 和`N = 10^6`， 一个`O(N log N)`解决方案在数学上仍然是合理的，但它在这里没有提供任何好处，而`O(N^2)`可以大致要求`5 * 10^11`迭代次数并且远远超出了一秒的限制。 

AQI 值和阈值介于`0`和`500`，因此答案中不存在整数溢出问题。 最多`10^6`天数是可以计算的。 

第一个不明显的情况是第一天是周末。 例如：```
1 Saturday 100
100
```正确答案是`0`。 一个粗心的实现，只检查`AQI >= X`会回来`1`，忘记了星期六没有课。 

第二种情况是阈值比较是包容性的。 例如：```
1 Monday 100
100
```正确答案是`1`，因为 AQI 恰好等于`X`停课。 使用`>`而不是`>=`会错误地返回`0`。 

第三个案例是在扫描时穿越周日。 例如：```
3 Friday 100
100 100 100
```这几天是周五、周六、周日，所以答案是`1`。 仅检查第一个工作日并忘记提前每个数组位置的工作日的实现可能会错误地计算所有三个值。 

## 方法

 直接的暴力方法可以独立确定每个阵列位置的工作日。 对于职位`i`，从给定的第一个工作日开始，一次一天地在日历中前进，直到到达位置`i`。 然后检查该工作日是否是工作日以及是否`a[i] >= X`。 

这种方法是正确的，因为它重建了每个数组元素的确切工作日。 问题在于它重复相同的日历工作。 对于职位`0`无需晋升，即可获得职位`1`需要进步，才能获得职位`N - 1`,`N - 1`需要取得进展。 工作日预付款总数为`0 + 1 + 2 + ... + (N - 1) = N(N - 1)/2`。 

在`N = 10^6`， 那是`499,999,500,000`工作日预付款，甚至在考虑 AQI 检查之前。 这无法在期限内完成。 

关键的观察是连续的数组位置代表连续的日历日。 一旦我们知道了工作日的位置`i`, 职位的工作日`i + 1`只是 7 天周期中的下一个工作日。 没有理由从头开始重新计算日历。 

我们可以用整数表示星期一到星期日`0`通过`6`。 对于每个 AQI 值，我们检查两个条件：AQI 必须至少为`X`，当前工作日必须是以下之一`0, 1, 2, 3, 4`。 处理该值后，我们将工作日提前`(weekday + 1) % 7`。 

暴力法和最优方法都检查AQI值，但最优方法每天只执行恒定的工作，而不是重复重建日历的相同前缀。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(N²) | O(1) | O(1) | 太慢了 |
 | 最佳 | O(N) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将七个工作日名称按日历顺序映射为整数，其中星期一为`0`和周日作为`6`。 这给了我们一个紧凑的表示，其中移动到第二天只是增量模`7`。 
2. 阅读`N`、第一个工作日的名称和阈值`X`。 将起始工作日名称转换为其整数表示形式。 
3. 阅读`N`AQI 值并从左到右进行处理。 在位置`i`，变量`weekday`代表实际工作日`a[i]`。 
4. 如果`weekday < 5`和`a[i] >= X`，增加答案。 第一个条件不包括周六和周日，而第二个条件则完全按照指定应用暂停阈值。 
5. 前进`weekday`使用`(weekday + 1) % 7`。 从周一到周二，周二到周三，依此类推，周日又回到周一。 
6. 打印最终计数`N`天已处理。 

### 为什么它有效

 不变量是在处理之前`a[i]`,`weekday`正是对应的工作日`i`-第一个数组元素。 最初这是真的，因为`weekday`从规定的第一天开始初始化。 如果位置为真`i`，前进一次给出下一个日历日的工作日，这正是位置对应的工作日`i + 1`。 因此，该不变量对于每个位置都成立。 

对于每个位置，当 AQI 至少为`X`日期是周一到周五。 这正是停课的条件，所以每一天都是有效的，每一天都是有效的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    day_to_num = {
        "Monday": 0,
        "Tuesday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday": 4,
        "Saturday": 5,
        "Sunday": 6,
    }

    n, day_name, x = input().split()
    n = int(n)
    x = int(x)

    weekday = day_to_num[day_name]
    answer = 0

    remaining = n
    while remaining:
        values = map(int, input().split())
        for aqi in values:
            if weekday < 5 and aqi >= x:
                answer += 1

            weekday = (weekday + 1) % 7
            remaining -= 1

            if remaining == 0:
                break

    print(answer)

if __name__ == "__main__":
    solve()
```字典将文本起始工作日转换为算法使用的整数周期。 星期一是`0`星期五是`4`，所以条件`weekday < 5`准确地确定了五个上课日。 

输入读取循环值得关注。 虽然问题摆在大家面前`N`第二行的 AQI 值，使用以下命令处理该行`split()`足以满足官方输入。 该循环还增量处理这些值，并避免存储整个 AQI 数组，从而使算法的额外空间保持在`O(1)`。 

柜台`remaining`即使输入被分割成多行，处理也会变得稳健。 每消耗一个 AQI 就会减一，并且处理会在之后立即停止`N`价值观。 

比较使用`>=`， 不是`>`，因为AQI等于阈值就足以停课。 检查当前 AQI 后，工作日会提前，因此第一个 AQI 是根据提供的起始日而不是第二天进行评估的。 这种排序可以防止最常见的相差一错误。 

对于这个问题，Python整数不会溢出，答案最多是`10^6`。 

## 工作示例

 ### 示例 1

 第一天是星期三，代表为`2`。 阈值是`6`。 工作日按照正常的 7 天周期进行。 

| 空气质量指数 工作日号码 | 工作日 | 空气质量指数 >= 6 | 上学日| 回答 |
 | ---| ---| ---| ---| ---| ---|
 | 1 | 2 | 星期三 | 没有 | 是的 | 0 |
 | 2 | 3 | 星期四 | 没有 | 是的 | 0 |
 | 3 | 4 | 星期五 | 没有 | 是的 | 0 |
 | 4 | 5 | 星期六 | 没有 | 没有 | 0 |
 | 5 | 6 | 周日| 没有 | 没有 | 0 |
 | 6 | 0 | 星期一 | 是的 | 是的 | 1 |
 | 7 | 1 | 星期二 | 是的 | 是的 | 2 |
 | 8 | 2 | 星期三 | 是的 | 是的 | 3 |
 | 9 | 3 | 星期四 | 是的 | 是的 | 4 |
 | 10 | 10 4 | 星期五 | 是的 | 是的 | 5 |

 前五个值没有贡献。 最后五个都达到阈值并发生在周一到周五，从而产生答案`5`。 该跟踪还显示了为什么必须在每个值（包括周末值）之后提前工作日。 

### 示例 2

 第一天是星期六，代表为`5`，阈值是`223`。 

| 空气质量指数 工作日号码 | 工作日 | 空气质量指数 >= 223 | 上学日| 回答 |
 | ---| ---| ---| ---| ---| ---|
 | 90 | 90 5 | 星期六 | 没有 | 没有 | 0 |
 | 372 | 372 6 | 周日| 是的 | 没有 | 0 |
 | 191 | 191 0 | 星期一 | 没有 | 是的 | 0 |
 | 282 | 282 1 | 星期二 | 是的 | 是的 | 1 |
 | 223 | 223 2 | 星期三 | 是的 | 是的 | 2 |

 三个AQI值均达到阈值，但`372`发生在周日并且被排除在外。 最终的答案是`2`。 这证实了仅 AQI 资格是不够的，必须独立检查工作日的情况。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(N) | 每个 AQI 值仅处理一次，每个值的工作量恒定。 |
 | 空间| O(1) | O(1) | 除了小工作日字典之外，仅维护当前工作日、阈值、剩余计数和答案。 |

 和`N`一样大`10^6`，单个线性扫描适合一秒的限制。 该算法每天仅执行几次整数运算，并且不会分配包含所有 AQI 值的数组，因此其额外的内存使用量是恒定的。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    day_to_num = {
        "Monday": 0,
        "Tuesday": 1,
        "Wednesday": 2,
        "Thursday": 3,
        "Friday": 4,
        "Saturday": 5,
        "Sunday": 6,
    }

    n, day_name, x = input().split()
    n = int(n)
    x = int(x)

    weekday = day_to_num[day_name]
    answer = 0

    remaining = n
    while remaining:
        values = map(int, input().split())
        for aqi in values:
            if weekday < 5 and aqi >= x:
                answer += 1

            weekday = (weekday + 1) % 7
            remaining -= 1

            if remaining == 0:
                break

    print(answer)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run(
    """10 Wednesday 6
1 2 3 4 5 6 7 8 9 10
"""
) == "5", "sample 1"

assert run(
    """5 Saturday 223
90 372 191 282 223
"""
) == "2", "sample 2"

assert run(
    """5 Sunday 269
90 372 191 282 223
"""
) == "2", "sample 3"

# Minimum-size input, weekend day
assert run(
    """1 Saturday 0
500
"""
) == "0", "single weekend day"

# Exact threshold must count
assert run(
    """1 Monday 100
100
"""
) == "1", "threshold is inclusive"

# Weekend crossing and threshold boundary
assert run(
    """7 Friday 200
200 200 200 199 201 200 200
"""
) == "2", "Friday through Thursday with weekend excluded"

# All values equal to the threshold, full week
assert run(
    """7 Monday 500
500 500 500 500 500 500 500
"""
) == "5", "all weekdays at exact threshold"

# Maximum-size input, all values equal and all days qualifying on weekdays
n = 1_000_000
values = "500 " * (n - 1) + "500"
large_input = f"{n} Monday 500\n{values}\n"
assert run(large_input) == "714286", "maximum-size input"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`1 Saturday 0`与空气质量指数`500`|`0`| 最小尺寸和周末排除 |
 |`1 Monday 100`与空气质量指数`100`|`1`| 包容性`>= X`边界|
 |`7 Friday 200`具有混合 AQI 值 |`2`| 周六和周日的正确工作日进程 |
 |`7 Monday 500`每个 AQI 等于`500`|`5`| 全部相等的值和精确的阈值 |
 |`1,000,000`周一值`500`|`714286`| 最大输入大小和线性时间行为 |

 ## 边缘情况

 对于单个周末，请考虑：```
1 Saturday 0
500
```最初的工作日是`5`， 所以`weekday < 5`是假的。 虽然`500 >= 0`，答案依然是`0`。 然后算法前进到周日，但没有更多值需要处理。 

对于精确阈值边界：```
1 Monday 100
100
```工作日是星期一并且`100 >= 100`是真的，所以答案变成`1`。 这会捕获意外使用严格的实现`>`比较。 

对于整个周末的日历转换：```
3 Friday 100
100 100 100
```第一个值是星期五并被计数。 第二个是星期六，因学校关闭而被拒绝。 第三个是周日，同样被拒绝。 最终的答案是`1`。 工作日状态从`4`到`5`到`6`，证明更新必须在处理每个 AQI 后发生。 

对于完整的每周周期：```
7 Monday 500
500 500 500 500 500 500 500
```前五个值对应于周一到周五，并且全部被计算在内。 第六和第七对应于周六和周日，被忽略。 结果是`5`。 这确认了工作日边界和模 7 环绕。 

最大尺寸的箱子包含`10^6`空气质量指数值。 由于每个值都会导致一次比较和一次工作日更新，因此运行时间呈线性增长，而不是呈二次方增长。 该算法不需要保留 AQI 数组，因此即使在最大输入大小下，其工作状态也保持不变。
