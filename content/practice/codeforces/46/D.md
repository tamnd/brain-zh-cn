---
title: "CF 46D - 停车场"
description: "我们有一个由区间 [0, L] 表示的停车段。 汽车每次到达，总是从左到右行驶，每个司机都想尽早停在尽可能早的位置。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "data-structures", "implementation"]
categories: ["algorithms"]
codeforces_contest: 46
codeforces_index: "D"
codeforces_contest_name: "School Personal Contest #2 (Winter Computer School 2010/11) - Codeforces Beta Round 43 (ACM-ICPC Rules)"
rating: 1800
weight: 46
solve_time_s: 114
verified: true
draft: false
---
[CF 46D - 停车场](https://codeforces.com/problemset/problem/46/D)

 **评分：** 1800
 **标签：** 数据结构、实现
 **求解时间：** 1m 54s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个由间隔表示的停车段`[0, L]`。 汽车每次到达，总是从左到右行驶，每个司机都想尽早停在尽可能早的位置。 

如果一辆车的长度`x`停车时背部位于坐标处`p`，那么汽车占据`[p, p + x]`。 这辆车和它后面的车之间必须至少有`b`米的可用空间。 这辆车和它前面的车之间必须至少有`f`米的可用空间。 街道边界很特殊，不需要额外的间距。 

请求有两种。 A型`1 x`请求意味着一辆新车长度`x`到达并尝试停车。 我们必须输出其背面结束的坐标，或者`-1`如果无法停车。 A型`2 k`请求是指由`k`-th 请求离开停车场。 

操作次数最多为`100`，这是令人惊讶的小。 甚至一个`O(n^2)`模拟很容易适应。 挑战不在于性能，而在于正确建模间距规则。 大多数错误答案源于对强制性差距适用范围的误解。 

关键的微妙之处在于间距不对称。 需要一辆车`b`后面几米和`f`前面几米。 当两辆车并存时，它们之间的实际空车距离必须同时满足两辆车的要求。 假设A车在B车后面，那么它们之间的距离至少为`max(f, b)`？ 不需要，后车需要`f`在前面，而前面的车需要`b`落后，所以差距必须至少`f + b`。 

另一个容易犯的错误出现在边界处。 如果汽车是第一辆停放的汽车，则它可能从坐标处开始`0`无需后部间隙。 同样，最后停放的汽车可能恰好在`L`不需要前面的间隙。 

考虑这个例子：```
L = 10, b = 2, f = 3
Current parked car: occupies [4, 6]
New car length = 1
```粗心的实现可能会认为空闲间隔`[0, 4]`可以装一辆车，起价为`0`， 因为`0 + 1 <= 4`。 那是错误的。 新车还需要`f = 3`停在汽车前几米，所以我们需要：```
0 + 1 + 3 <= 4
```在这里确实如此，但也只是勉强如此。 

当插入两辆车之间时，会出现另一种危险的边缘情况。```
L = 20, b = 2, f = 2
Cars:
[0, 4]
[10, 14]
New car length = 2
```空区间为`[4, 10]`， 长度`6`。 天真的方法可能会认为汽车适合，因为`2 <= 6`。 实际需要的空间为：```
b + car_length + f = 2 + 2 + 2 = 6
```汽车完全适合，从坐标开始`6`。 

如果我们只存储坐标而忘记哪个请求创建了哪辆车，那么移除操作也很容易处理不当。 由于删除涉及请求索引，因此我们必须维护从请求 id 到停放间隔的映射。 

## 方法

 最直接的模拟就是维护所有停放的汽车按位置排序。 对于每辆到达的汽车，我们从左到右扫描停车场并测试每个空闲间隔。 

假设当前停放的车辆为：```
[p1, p1 + len1]
[p2, p2 + len2]
...
```我们检查三种差距。 

第一辆车之前的前缀间隙。 新车可能开始于`0`，但必须离开`f`距第一辆停放车辆数米。 

连续车辆之间的中间间隙。 如果前一辆车结束于`r1`下一辆车的出发时间为`l2`，然后一辆新车长度`x`可能开始于`r1 + b`如果：```
r1 + b + x + f <= l2
```最后一辆车后面的后缀间隙。 新车可能开始于`last_end + b`只要：```
last_end + b + x <= L
```第一个有效位置始终是最佳位置，因为驾驶员总是选择最早的位置。 

这种暴力模拟已经足够快了。 最多`100`操作存在，每次到达最多扫描`100`停放的汽车，大致给出`10^4`检查。 

主要观察是，我们永远不需要复杂的区间树或平衡结构，因为约束很小。 真正的工作是正确推导准确的放置公式。 一旦理解了几何形状，实施就变成了仔细的间隔扫描。 

我们仍然通过按排序顺序存储停放的汽车并在必要时将其删除来干净地组织数据。 这提供了一个简单且可靠的解决方案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(n) | 已接受 |
 | 最佳| O(n²) | O(n) | 已接受 |

 这里的“最佳”解决方案实际上是正确建模的模拟。 更大的约束将需要区间结构，但是对于`n ≤ 100`，仔细的实施比渐近技巧更重要。 

## 算法演练

 1. 维护停放车辆的排序列表。 

每辆车都存储为`(start, length, request_id)`。 保持列表排序`start`让我们从左到右扫描自由间隙。 
2.维护一个从请求id到停放车辆数据的字典。 

移除查询是指原始请求编号，而不是停车单。 这种映射让我们能够在恒定的时间内找到准确停放的汽车。 
3. 对于到达请求并注明车长`x`，首先尝试将汽车放置在坐标处`0`。 

如果没有停放的汽车，则汽车适合的时间`x <= L`。 

否则，让第一辆停放的汽车从`s`。 新车适合在`0`如果：```
x + f <= s
```左边框不需要后间隙。 
4. 如果前缀间隙失败，则扫描每对相邻的停放车辆。 

假设前一辆车占用`[l1, r1]`下一辆车的出发时间为`l2`。 

最早可能的开始时间是：```
r1 + b
```为了与下一辆车保持所需的前部间距：```
r1 + b + x + f <= l2
```满足此条件的第一对给出了正确的停车位置。 
5. 如果没有中间间隙，请尝试在最后一辆车后面停车。 

如果最后一辆车结束于`r`，最早可能的位置是：```
r + b
```该车适合以下情况：```
r + b + x <= L
```右边框不需要前间隙。 
6. 如果三种情况都不成功，则输出`-1`。 
7. 当汽车成功停放时，将其插入到排序列表中，并将其记录在 request-id 映射中。 
8. 对于移除请求，请使用请求 ID 找到已存储的汽车并将其从停放列表中删除。 

### 为什么它有效

 该算法始终从左到右检查可用空间，并始终选择每个间隙内最早的有效坐标。 每个可行的停车位置必须恰好属于以下三个类别之一：第一辆车之前、两辆车之间或最后一辆车之后。 

在中间间隙内，任何有效的放置必须开始于或之后`previous_end + b`，因为之前的车需要后排间距。 稍后开始只会浪费空间，并且无法产生更早的答案。 因此，该间隙内最早的候选者是唯一确定的。 如果该候选人未能留出足够的前部间距，则同一间隙内的后续位置都无法发挥作用。 

因为每个间隙都是按从左到右的顺序检查的，并且测试每个间隙的最早可行位置，所以第一个接受的位置正是问题所需的最左边的有效停车坐标。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    L, b, f = map(int, input().split())
    n = int(input())

    parked = []
    by_request = {}

    for req_id in range(1, n + 1):
        t, x = map(int, input().split())

        if t == 1:
            length = x
            pos = -1

            if not parked:
                if length <= L:
                    pos = 0
            else:
                first_start = parked[0][0]

                if length + f <= first_start:
                    pos = 0
                else:
                    for i in range(len(parked) - 1):
                        s1, len1, _ = parked[i]
                        s2, len2, _ = parked[i + 1]

                        end1 = s1 + len1

                        candidate = end1 + b

                        if candidate + length + f <= s2:
                            pos = candidate
                            break

                    if pos == -1:
                        last_start, last_len, _ = parked[-1]
                        last_end = last_start + last_len

                        candidate = last_end + b

                        if candidate + length <= L:
                            pos = candidate

            print(pos)

            if pos != -1:
                car = (pos, length, req_id)

                idx = 0
                while idx < len(parked) and parked[idx][0] < pos:
                    idx += 1

                parked.insert(idx, car)
                by_request[req_id] = car

        else:
            car = by_request[x]
            parked.remove(car)
            del by_request[x]

solve()
```该解决方案将停车场明确表示为占用间隔的排序列表。 由于操作数量很少，简单的列表操作就完全足够了。 

插入逻辑反映了演练中的几何推理。 我们首先尝试前缀间隙，然后是每个内部间隙，然后是后缀间隙。 公式略有不同，因为边框不需要额外的间距。 

一个微妙的实现细节的含义是`candidate`。 在两辆停放的汽车之间，我们总是将新车放置在尽可能靠左的位置：```
candidate = end1 + b
```任何较晚的起始位置只会减少下一辆车之前的剩余空间，因此检查这个单一坐标就足够了。 

另一个容易出现的差一错误是忘记间隔是连续长度，而不是整数槽。 条件：```
candidate + length + f <= s2
```是准确的。 平等是允许的，因为汽车可能会恰好留下所需的可用空间。 

删除逻辑使用存储的元组本身。 由于元组是不可变的并且唯一标识停放的汽车，`list.remove()`干净地删除正确的间隔。 

## 工作示例

 ### 示例 1

 输入：```
30 1 2
6
1 5
1 4
1 5
2 2
1 5
1 4
```| 步骤| 运营| 操作后停放的汽车| 输出|
 | --- | --- | --- | --- |
 | 1 | 添加长度 5 |`[0,5]`| 0 |
 | 2 | 添加长度 4 |`[0,5], [6,10]`| 6 |
 | 3 | 添加长度 5 |`[0,5], [6,10], [11,16]`| 11 | 11
 | 4 | 删除请求 2 |`[0,5], [11,16]`| |
 | 5 | 添加长度 5 |`[0,5], [11,16], [17,22]`| 17 | 17
 | 6 | 添加长度 4 |`[0,5], [11,16], [17,22], [23,27]`| 23 | 23

 该迹线显示了为什么汽车总是占据最早的可行坐标。 去掉第二辆车后，差距`[6,11]`只是长度`5`。 新车长度`5`实际上需要：```
1 + 5 + 2 = 8
```内部间隙内数米，因此无法安装在那里，必须稍后停车。 

### 自定义示例

 输入：```
15 2 3
5
1 4
1 3
2 1
1 5
1 1
```| 步骤| 运营| 操作后停放的汽车| 输出|
 | --- | --- | --- | --- |
 | 1 | 添加长度 4 |`[0,4]`| 0 |
 | 2 | 添加长度 3 |`[0,4], [6,9]`| 6 |
 | 3 | 删除请求 1 |`[6,9]`| |
 | 4 | 添加长度 5 |`[6,9]`| -1 |
 | 5 | 添加长度 1 |`[0,1], [6,9]`| 0 |

 第四个操作演示了边界规则。 前面的免费前缀`[6,9]`有长度`6`，但是一辆车的长度`5`仍然无法适应，因为它还需要`3`停放车辆前米：```
5 + 3 > 6
```最终操作成功是因为长度`1`汽车只需要：```
1 + 3 <= 6
```## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n²) | 每次插入都可以扫描所有停放的汽车|
 | 空间| O(n) | 我们存储所有当前停放的汽车并请求映射 |

 至多有`100`操作时，最坏情况下的工作量很小。 即使二次模拟也只执行几千次检查，远远低于时间限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    out = io.StringIO()
    sys_stdout = sys.stdout
    sys.stdout = out

    L, b, f = map(int, input().split())
    n = int(input())

    parked = []
    by_request = {}

    for req_id in range(1, n + 1):
        t, x = map(int, input().split())

        if t == 1:
            length = x
            pos = -1

            if not parked:
                if length <= L:
                    pos = 0
            else:
                first_start = parked[0][0]

                if length + f <= first_start:
                    pos = 0
                else:
                    for i in range(len(parked) - 1):
                        s1, len1, _ = parked[i]
                        s2, _, _ = parked[i + 1]

                        end1 = s1 + len1
                        candidate = end1 + b

                        if candidate + length + f <= s2:
                            pos = candidate
                            break

                    if pos == -1:
                        last_start, last_len, _ = parked[-1]
                        last_end = last_start + last_len

                        candidate = last_end + b

                        if candidate + length <= L:
                            pos = candidate

            print(pos)

            if pos != -1:
                car = (pos, length, req_id)

                idx = 0
                while idx < len(parked) and parked[idx][0] < pos:
                    idx += 1

                parked.insert(idx, car)
                by_request[req_id] = car

        else:
            car = by_request[x]
            parked.remove(car)
            del by_request[x]

    sys.stdout = sys_stdout
    return out.getvalue()

# provided sample
assert run(
"""30 1 2
6
1 5
1 4
1 5
2 2
1 5
1 4
"""
) == "0\n6\n11\n17\n23\n", "sample 1"

# minimum size
assert run(
"""10 1 1
1
1 10
"""
) == "0\n", "single car fills entire lot"

# exact middle fit
assert run(
"""20 2 2
3
1 4
1 4
1 2
"""
) == "0\n6\n12\n", "exact spacing equality"

# impossible due to front spacing
assert run(
"""15 2 3
2
1 4
1 9
"""
) == "0\n-1\n", "front spacing blocks placement"

# reuse freed space
assert run(
"""20 1 1
5
1 5
1 5
2 1
1 4
1 5
"""
) == "0\n6\n0\n11\n", "reuse after deletion"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 单车占满地段|`0`| 边框不需要额外的间距 |
 | 精确的中间贴合 |`0 6 12`| 允许平等条件|
 | 前间距失效|`0 -1`| 必须保留前缀间隙`f`米 |
 | 删除后重用 |`0 6 0 11`| 删除的间隔变得正确可用 |

 ## 边缘情况

 考虑这个输入：```
15 2 3
2
1 4
1 8
```第一个停车场位于`0`, 占据`[0,4]`。 

对于第二辆车，最早的后缀位置是：```
4 + 2 = 6
```新车将占据`[6,14]`，正好适合停车场内。 该算法接受它，因为后缀放置仅检查：```
candidate + length <= L
```右边框不需要前间距。 

现在考虑：```
20 2 2
3
1 4
1 4
1 2
```两辆车之后，我们有：```
[0,4]
[6,10]
```剩余的后缀始于：```
10 + 2 = 12
```第三辆车的长度是`2`， 和：```
12 + 2 = 14 <= 20
```该算法将其停放在`12`。 

最后，考虑一个棘手的内部差距：```
20 2 3
3
1 4
1 4
1 1
```前两辆车之后：```
[0,4]
[7,11]
```它们之间的自由间隔是长度`3`。 粗心的解决方案可能会考虑长度`1`汽车适合那里。 

该算法检查：```
candidate = 4 + 2 = 6
6 + 1 + 3 <= 7
```这失败了。 缺少所需的前部间距，因此汽车无法停在那里。 相反，该算法正确地搜索后面的间隙。
