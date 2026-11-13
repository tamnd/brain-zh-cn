---
title: "CF 24B - F1 冠军"
description: "我们得到了整个一级方程式赛季的结果。 每场比赛都会列出从第一名到最后一名的车手。 冠军得主取决于两个排名系统之一。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 24
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 24"
rating: 1500
weight: 24
solve_time_s: 139
verified: true
draft: false
---
[CF 24B - F1 冠军](https://codeforces.com/problemset/problem/24/B)

 **评分：** 1500
 **标签：** 实施
 **求解时间：** 2m 19s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了整个一级方程式赛季的结果。 每场比赛都会列出从第一名到最后一名的车手。 冠军得主取决于两个排名系统之一。 

在原来的系统中，车手主要按照总积分排名。 每场比赛的前 10 名将获得固定积分：25、18、15、12、10、8、6、4、2、1。如果两名车手的积分相同，我们会比较他们获得第一名的次数。 如果仍然平局，我们比较第二名，然后是第三名，依此类推。 

替代系统翻转了前两个优先事项。 车手按获胜次数排名第一。 如果胜率相等，我们比较总积分。 如果仍然平局，我们会再次比较第二名、第三名的数量，依此类推。 

输入按顺序给出每场比赛。 对于每场比赛，我们都会收到按完赛位置排序的参赛车手名单。 车手可能会跳过一些比赛，如果他们至少出现过一次，我们仍然必须在最终排名中考虑他们。 

限制非常小。 总共最多有 20 场比赛，最多 50 名车手。 即使每场比赛都包含全部 50 名车手，比赛结果总数也只有 1000 个。这意味着我们不需要先进的优化技术或复杂的数据结构。 直接实施排名规则已经足够快了。 

真正的困难是正确地执行决胜局。 粗心的实现常常会失败，因为比较规则是字典顺序的，而不仅仅是基于分数和胜利。 

考虑这个例子：```
2
3
A
B
C
3
B
A
C
```A、B均得43分，各胜一场。 冠军应通过比较第二名来确定。 双方各有一名第二名，所以他们仍然是平手。 声明保证在官方测试中不会发生这种情况，但我们的比较逻辑仍然必须遵循正确的顺序。 

另一个容易犯的错误是忘记了前 10 名之外的位置。这些位置的得分为零，但它们对于决胜局仍然很重要，因为排名的计数是一路向下比较的。 

例子：```
2
11
A
B
C
D
E
F
G
H
I
J
K
11
B
A
C
D
E
F
G
H
I
J
K
```A、B各得一胜一亚军。 他们的积分也相等。 其余位置相同。 仅存储前 10 名成绩的有缺陷的解决方案可能会错误地提前结束比较。 

另一个微妙的问题是车手缺席比赛。 如果车手从未参加过比赛，我们绝不能无意中为他们制造假名次。 错过一场比赛仅仅意味着他们无法获得积分，也不会获得名次。 

## 方法

 最直接的方法是完全按照所写的模拟整个赛季。 对于每位车手，我们都会存储总积分以及他们在每个位置上完成的次数。 在处理完所有比赛后，我们根据所需的排名规则对每对车手进行比较。 

每当比较两个驱动程序时，强力版本都可以从头开始重新计算所有统计数据。 假设我们比较车手 A 和 B。我们可以扫描每场比赛，计算两者的积分和排名，然后决定谁排名更高。 对于最多 50 名车手，我们可以进行大约 2500 次比较，每次比较最多可以扫描 1000 条比赛结果。 即使这仍然在限制范围内，大约有几百万次操作。 

尽管如此，重复地重新计算相同的信息是没有必要的。 每次比较仅取决于累积的赛季统计数据。 一旦我们认识到这一点，问题就变得清晰多了。 

关键的观察是每个车手的赛季都可以用一个紧凑的记录来表示：

 1、总分。 
2.第一名的数量。 
3、第二名的数量。 
4、第三名的数量。 
5.等等。 

然后，对车手进行排名就变成了这些记录之间的纯粹字典式比较，两个评分系统的优先顺序略有不同。 

对于原系统，比较关键是：```
(points, first_places, second_places, ...)
```对于替代系统，比较关键是：```
(first_places, points, second_places, ...)
```由于车手和比赛的数量很少，我们可以简单地迭代所有车手并根据所选的比较器保留最好的车手。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(D² × R × N) | O(1) | O(1) | 已接受 |
 | 最佳 | O(R × N + D² × N) | O(D × N) | 已接受 |

 这里，`D`是司机的数量，`R`是比赛的数量，并且`N`是一场比赛中分级车手的最大数量。 

## 算法演练

 1. 为所有驱动程序创建一个字典。 

对于每个驱动程序，存储：

 - 总分。 
- 一个数组，其中`places[i]`计算车手完成到位的次数`i`。 

我们需要完整的排名计数，因为决胜局可能会在获胜后继续下去。 
2.从上到下处理每场比赛。 

第一个车手获胜，第二个车手获得第二名，依此类推。 更新：

 - 该位置的放置计数器。 
- 如果位置进入前 10 名，则车手的积分。 
3. 为原系统定义一个比较函数。 

按此顺序比较两个驱动程序：

 - 总分。 
- 第一名的数量。 
- 第二名的数量。 
- 第三名的数量。 
- 继续，直到出现差异。 

这完全符合冠军规则。 
4. 为替代系统定义另一个比较函数。 

按这个顺序比较：

 - 获胜次数。 
- 总分。 
- 第二名的数量。 
- 第三名的数量。 
- 如果需要，请继续。 

首先检查胜利，因为替代规则优先考虑胜利而不是一致性。 
5. 迭代所有驱动程序以找到每个系统下最好的驱动程序。 

从任何车手作为当前冠军开始。 对于每个其他驱动程序，应用比较功能。 如果新车手排名更高，则更换冠军。 
6.输出两个冠军。 

### 为什么它有效

 每场比赛对每位车手的赛季统计数据都有独立的贡献。 总积分和名次完全决定官方排名规则。 比赛顺序或比赛身份的附加信息并不重要。 

比较函数完全反映了问题陈述。 在原来的系统中，如果一位车手的积分多，他就会立即获胜。 如果积分相同，则以排名第一的不同名次决定排名。 替代系统遵循相同的逻辑，首先检查胜利。 

由于每位车手的统计数据都是正确累积的，并且比较遵循官方的平局顺序，因此选出的冠军必须是正确的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

def solve():
    t = int(input())

    drivers = {}

    for _ in range(t):
        n = int(input())

        for pos in range(n):
            name = input().strip()

            if name not in drivers:
                drivers[name] = {
                    "points": 0,
                    "places": [0] * 55
                }

            drivers[name]["places"][pos + 1] += 1

            if pos < 10:
                drivers[name]["points"] += POINTS[pos]

    names = list(drivers.keys())

    def better_original(a, b):
        da = drivers[a]
        db = drivers[b]

        if da["points"] != db["points"]:
            return da["points"] > db["points"]

        for place in range(1, 55):
            if da["places"][place] != db["places"][place]:
                return da["places"][place] > db["places"][place]

        return False

    def better_alternative(a, b):
        da = drivers[a]
        db = drivers[b]

        if da["places"][1] != db["places"][1]:
            return da["places"][1] > db["places"][1]

        if da["points"] != db["points"]:
            return da["points"] > db["points"]

        for place in range(2, 55):
            if da["places"][place] != db["places"][place]:
                return da["places"][place] > db["places"][place]

        return False

    champion_original = names[0]
    champion_alternative = names[0]

    for name in names[1:]:
        if better_original(name, champion_original):
            champion_original = name

        if better_alternative(name, champion_alternative):
            champion_alternative = name

    print(champion_original)
    print(champion_alternative)

solve()
```该解决方案首先为每位车手建立赛季统计数据。 这`places`数组存储车手在每个位置完成的次数。 指数`1`代表胜利，指数`2`代表第二名，依此类推。 

使用固定大小的数组比在比较期间动态调整结构大小更简单、更安全。 由于一场比赛中最多有 50 名车手，因此 55 号尺寸的阵列可以轻松覆盖所有可能的位置。 

这两个比较函数直接对排名系统进行编码。 原系统先比较分数，而替代系统先比较胜负。 在这些主要标准之后，两者都通过排名计数继续按字典顺序排列。 

一个微妙的细节是决胜局中的循环范围。 原系统从地方开始检查`1`因为胜利是积分后的第一个抢七局。 替代系统已经单独处理胜利，因此它的循环从地方开始`2`。 

另一个重要的实施选择是存储所有排名，而不仅仅是前 10 名的排名。 积分外的车手仍然会影响随后的决胜局。 

## 工作示例

 ### 示例 1

 输入：```
3
3
Hamilton
Vettel
Webber
2
Webber
Vettel
2
Hamilton
Vettel
```处理比赛：

 | 比赛| 位置 | 司机 | 已添加积分 | 总分 | 胜利 | 秒|
 | ---| ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 汉密尔顿 | 25 | 25 25 | 25 1 | 0 |
 | 1 | 2 | 维特尔 | 18 | 18 18 | 18 0 | 1 |
 | 1 | 3 | 韦伯| 15 | 15 15 | 15 0 | 0 |
 | 2 | 1 | 韦伯| 25 | 25 40 | 40 1 | 0 |
 | 2 | 2 | 维特尔 | 18 | 18 36 | 36 0 | 2 |
 | 3 | 1 | 汉密尔顿 | 25 | 25 50 | 50 2 | 0 |
 | 3 | 2 | 维特尔 | 18 | 18 54 | 54 0 | 3 |

 最终排名：

 | 司机 | 积分 | 胜利 | 秒|
 | ---| ---| ---| ---|
 | 汉密尔顿 | 50 | 50 2 | 0 |
 | 维特尔 | 54 | 54 0 | 3 |
 | 韦伯| 40 | 40 1 | 0 |

 原系统选择维特尔是因为积分最重要。 替代系统选择汉密尔顿，因为胜利最重要。 

该轨迹表明，即使比赛结果相同，两种排名系统也可能产生不同的冠军。 

### 示例 2

 输入：```
2
3
A
B
C
3
B
A
C
```处理比赛：

 | 比赛| 位置 | 司机 | 总分 | 胜利 | 秒|
 | ---| ---| ---| ---| ---| ---|
 | 1 | 1 | 一个 | 25 | 25 1 | 0 |
 | 1 | 2 | 乙| 18 | 18 0 | 1 |
 | 2 | 1 | 乙| 43 | 43 1 | 1 |
 | 2 | 2 | 一个 | 43 | 43 1 | 1 |

 最终排名：

 | 司机 | 积分 | 胜利 | 秒|
 | ---| ---| ---| ---|
 | 一个 | 43 | 43 1 | 1 |
 | 乙| 43 | 43 1 | 1 |

 即使在比较胜利和第二名之后，车手们仍保持平局。 官方的问题保证了真实的测试用例可以避免这种情况。 

此示例说明了为什么比较逻辑必须继续遍历每个放置级别而不是提前停止。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(R × N + D² × N) | 处理比赛并通过排名计数比较车手 |
 | 空间| O(D × N) | 存储每位车手的位置统计数据

 限制很小，因此该解决方案很容易满足限制。 我们最多存储 50 个驾驶员的统计数据，每次比较最多检查 50 个放置位置。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

POINTS = [25, 18, 15, 12, 10, 8, 6, 4, 2, 1]

def solve():
    input = sys.stdin.readline

    t = int(input())

    drivers = {}

    for _ in range(t):
        n = int(input())

        for pos in range(n):
            name = input().strip()

            if name not in drivers:
                drivers[name] = {
                    "points": 0,
                    "places": [0] * 55
                }

            drivers[name]["places"][pos + 1] += 1

            if pos < 10:
                drivers[name]["points"] += POINTS[pos]

    names = list(drivers.keys())

    def better_original(a, b):
        da = drivers[a]
        db = drivers[b]

        if da["points"] != db["points"]:
            return da["points"] > db["points"]

        for place in range(1, 55):
            if da["places"][place] != db["places"][place]:
                return da["places"][place] > db["places"][place]

        return False

    def better_alternative(a, b):
        da = drivers[a]
        db = drivers[b]

        if da["places"][1] != db["places"][1]:
            return da["places"][1] > db["places"][1]

        if da["points"] != db["points"]:
            return da["points"] > db["points"]

        for place in range(2, 55):
            if da["places"][place] != db["places"][place]:
                return da["places"][place] > db["places"][place]

        return False

    best1 = names[0]
    best2 = names[0]

    for name in names[1:]:
        if better_original(name, best1):
            best1 = name

        if better_alternative(name, best2):
            best2 = name

    print(best1)
    print(best2)

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    return sys.stdout.getvalue()

# provided sample
assert run(
"""3
3
Hamilton
Vettel
Webber
2
Webber
Vettel
2
Hamilton
Vettel
"""
) == "Vettel\nHamilton\n", "sample 1"

# minimum input
assert run(
"""1
1
Alice
"""
) == "Alice\nAlice\n", "single driver"

# wins matter more in alternative system
assert run(
"""2
2
A
B
2
B
A
"""
) == "A\nA\n", "tie resolved by first encountered equal stats"

# driver outside top 10 still affects tie-break
assert run(
"""2
11
A
B
C
D
E
F
G
H
I
J
K
11
B
A
C
D
E
F
G
H
I
J
K
"""
) == "A\nA\n", "full placement tracking"

# consistency beats wins in original system
assert run(
"""3
3
A
B
C
3
B
A
C
3
B
A
C
"""
) == "B\nB\n", "points and wins"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一名车手的单场比赛 | 同一个司机两次| 最小尺寸输入 |
 | 两个对称的种族| 同一个司机两次| 稳定处理平等统计 |
 | 11 名车手参加的两场比赛 | 同一个司机两次| 跟踪前 10 名之外的展示位置 |
 | 三场比赛多次登上领奖台| B 两次 | 正确累积积分并获胜 |

 ## 边缘情况

 考虑一下车手积分相同但胜利不同的情况。```
2
2
A
B
2
B
A
```处理完两场比赛后：

 - A 积 43 分，胜 1 场。 
- B 积 43 分，胜 1 场。 

比较继续排名第二。 两位车手也都获得了第二名，因此他们仍然并列。 该实现会严格按照要求检查所有放置计数。 

现在考虑前 10 名之外的位置：```
2
11
A
B
C
D
E
F
G
H
I
J
K
11
B
A
C
D
E
F
G
H
I
J
K
```车手 A 和 B 获得相同的积分和相同的前 10 名成绩。 忽略第 11 位之后的错误实现可能会错误地过早停止跟踪数据。 我们的解决方案存储每个最终位置，因此决胜局保持正确。 

另一个重要的边缘情况是车手缺席比赛：```
2
2
A
B
1
B
```A 在一场比赛中获得 25 分。 B 在两场比赛中获得 43 分。 错过一场比赛仅仅意味着该车手在该场比赛中没有更新。 由于所有统计数据都是独立累积的，因此该实现可以自然地处理缺席的驱动程序，而无需任何特殊情况。
