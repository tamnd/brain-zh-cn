---
title: "CF 1531A - \u0417\u0438\u043d\u0433\u0435\u0440 | 颜色"
description: "我们需要模拟控制歌手之家圆顶照明颜色的聊天机器人的行为。 最初，圆顶是蓝色的，并且允许改变颜色。 机器人接收一系列消息。"
date: "2026-06-10T16:46:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1531
codeforces_index: "A"
codeforces_contest_name: "VK Cup 2021 - \u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044f (Engine)"
rating: 0
weight: 1531
solve_time_s: 109
verified: true
draft: false
---

[CF 1531A - \u0417\u0438\u043d\u0433\u0435\u0440 | 颜色](https://codeforces.com/problemset/problem/1531/A)

 **评级：** -
 **标签：** *特殊、实施
 **求解时间：** 1m 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要模拟控制歌手之家圆顶照明颜色的聊天机器人的行为。 

最初，圆顶是彩色的`blue`，并且允许颜色变化。 机器人接收一系列消息。 有些消息会更改锁定状态，而其他消息则请求更改颜色。 

一条消息`lock`禁用未来的颜色变化。 如果系统已经锁定，则不会发生任何事情。 

一条消息`unlock`再次启用颜色变化。 如果系统已经解锁，则不会发生任何事情。 

颜色消息，例如`red`,`green`， 或者`violet`仅当系统当前解锁时才更改圆顶颜色。 如果系统被锁定，则该消息将被忽略。 

输入按时间顺序给出完整的消息历史记录。 我们必须在处理完所有消息后确定最终的圆顶颜色。 

限制非常小。 最多有 100 条消息，因此即使是简单的模拟也可以轻松满足任何合理的时间限制。 由于每条消息仅影响当前状态，因此不需要任何高级数据结构或优化。 

错误的主要来源是正确处理被忽略的操作。 

考虑这个例子：```
3
lock
red
green
```正确答案是：```
blue
```后`lock`，颜色更改变为禁用。 两个颜色消息都被忽略，因此初始颜色保持不变。 

另一个微妙的情况是重复的锁定操作：```
4
lock
lock
unlock
red
```正确答案是：```
red
```第二个`lock`什么都不做，因为系统已经被锁定。 粗心的实现会切换状态而不是显式设置状态，会产生错误的结果。 

还有一种情况涉及重复解锁操作：```
3
unlock
unlock
violet
```正确答案是：```
violet
```由于系统已解锁，因此解锁消息无效。 最终的颜色更改正常应用。 

## 方法

 最直接的方法是完全按照描述模拟机器人。 我们维护两个变量：当前颜色以及颜色变化是否被锁定。 我们一一处理消息，并根据规则更新这些变量。 

对问题的强力解释已经是最佳的，因为每条消息都可能改变状态。 任何正确的解决方案都必须至少检查所有消息一次。 最多 100 条消息，只需要 100 次操作，可以忽略不计。 

关键的观察是整个系统状态仅由两条信息表示：当前颜色和锁定状态。 一旦消息被处理，就不需要历史信息。 由于每条消息仅影响当前状态，因此一次线性扫描就足够了。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| O(n) | O(1) | O(1) | 已接受 |
 | 最佳状态跟踪 | O(n) | O(1) | O(1) | 已接受 |

 在这个问题中，暴力模拟和最优解实际上是同一个算法。 

## 算法演练

 1. 初始化当前颜色为`"blue"`因为圆顶以蓝色照明开始。 
2. 初始化锁状态为`False`因为颜色变化最初是允许的。 
3. 按时间顺序处理每条消息。 
4. 如果消息是`"lock"`，将锁定状态设置为`True`。 

这符合未来颜色变化被阻止的规范。 
5. 如果消息是`"unlock"`，将锁定状态设置为`False`。 

这将重新启用颜色变化。 
6. 否则，该消息代表一种颜色。 

如果锁定状态是`False`，将当前颜色更新为此消息。 

如果锁定状态是`True`，忽略该消息。 
7. 处理完所有消息后，输出当前颜色。 

### 为什么它有效

 在加工过程中的每时每刻，这对`(current_color, locked)`在处理相同的消息前缀后，与真实机器人的状态完全匹配。 

初始化与问题陈述相匹配。 每条消息都会根据官方规则进行处理，更新锁定状态或颜色。 由于每个状态转换都被精确地再现，因此每一步之后所维护的状态与真实系统保持相同。 在最终消息之后，存储的颜色正是圆顶的最终颜色。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    color = "blue"
    locked = False

    for _ in range(n):
        msg = input().strip()

        if msg == "lock":
            locked = True
        elif msg == "unlock":
            locked = False
        else:
            if not locked:
                color = msg

    print(color)

if __name__ == "__main__":
    solve()
```该解决方案准确地保留了算法讨论中确定的两个状态。 

变量`color`存储当前圆顶颜色。 It starts as`"blue"`因为这是声明中给出的初始条件。 

变量`locked`记录当前是否阻止颜色变化。 它开始于`False`，表示允许颜色变化。 

对于每条消息，我们首先检查它是锁定命令还是解锁命令。 这些命令直接设置锁定状态。 我们不切换状态，因为重复`lock`或者`unlock`消息必须是无害的。 

任何剩余的消息必然是七种颜色名称之一。 我们仅在系统未锁定时更新颜色。 如果它被锁定，则该消息将按照要求被忽略。 

不需要特殊的边界处理，因为输入保证每个消息都属于允许的集合。 

## 工作示例

 ### 示例 1

 输入：```
7
red
violet
unlock
red
orange
lock
indigo
```| 步骤| 留言 | 锁定| 颜色 |
 | --- | --- | --- | --- |
 | 开始| - | 假 | 蓝色|
 | 1 | 红色| 假| 红色|
 | 2 | 紫罗兰| 假| 紫罗兰|
 | 3 | 解锁| 假| 紫罗兰|
 | 4 | 红色| 假| 红色|
 | 5 | 橙色| 假 | 橙色|
 | 6 | 锁| 真实| 橙色|
 | 7 | 靛蓝| 真实| 橙色|

 最终输出：```
orange
```此跟踪显示，一旦系统被锁定，后续的颜色消息将被忽略。 决赛`indigo`message has no effect.

 ### 示例 2

 输入：```
5
lock
red
unlock
green
violet
```| 步骤| 留言 | 锁定| 颜色 |
 | --- | --- | --- | --- |
 | 开始| - | 假 | 蓝色|
 | 1 | 锁| 真实| 蓝色|
 | 2 | 红色| 真实| 蓝色|
 | 3 | 解锁| 假 | 蓝色|
 | 4 | 绿色| 假 | 绿色|
 | 5 | 紫罗兰| 假 | 紫罗兰|

 最终输出：```
violet
```此示例演示了这两种行为。 这`red`锁定时消息将被忽略，但解锁后稍后的颜色更改可以正常工作。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每条消息都会被处理一次 |
 | 空间| O(1) | O(1) | 仅存储当前颜色和锁定状态 |

 自从`n ≤ 100`，运行时间很小。 该算法对每条消息执行恒定量的工作，并且无论输入大小如何，仅使用几个变量。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n = int(input())

    color = "blue"
    locked = False

    for _ in range(n):
        msg = input().strip()

        if msg == "lock":
            locked = True
        elif msg == "unlock":
            locked = False
        else:
            if not locked:
                color = msg

    return color

# provided sample
assert run(
    "7\nred\nviolet\nunlock\nred\norange\nlock\nindigo\n"
) == "orange", "sample 1"

# minimum size input
assert run(
    "1\nred\n"
) == "red", "single color change"

# locked before color change
assert run(
    "2\nlock\nviolet\n"
) == "blue", "color must be ignored"

# repeated lock and unlock commands
assert run(
    "5\nlock\nlock\nunlock\nunlock\ngreen\n"
) == "green", "repeated state commands"

# many color changes while unlocked
assert run(
    "4\nred\nyellow\ngreen\nviolet\n"
) == "violet", "last applied color wins"

# boundary-style long test
assert run(
    "10\nlock\nred\nunlock\norange\nlock\nblue\nunlock\nindigo\nlock\nviolet\n"
) == "indigo", "mixed operations"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / red`|`red`| 最小有效输入|
 |`lock, violet`|`blue`| 锁定时忽略颜色 |
 | 重复锁定/解锁命令 |`green`| 状态命令不是切换 |
 | 解锁时有多种颜色|`violet`| 最新成功色彩获胜 |
 | 混合锁定和解锁顺序|`indigo`| 两种状态的正确交互|

 ## 边缘情况

 ### 锁定时的彩色消息

 输入：```
3
lock
red
green
```执行开始于`(blue, unlocked)`。 后`lock`，状态变为`(blue, locked)`。 两条颜色消息在锁定时到达，因此会被忽略。 最终的颜色仍然存在`blue`。 

输出：```
blue
```### 重复的锁操作

 输入：```
4
lock
lock
unlock
red
```第一个之后`lock`，系统被锁定。 第二个`lock`将其锁定。 它不会切换回解锁状态。 后`unlock`，再次允许颜色变化，并且`red`被应用。 

输出：```
red
```### 重复解锁操作

 输入：```
3
unlock
unlock
violet
```系统开始解锁，因此两者`unlock`消息使状态保持不变。 最终颜色消息正常处理并将圆顶颜色更改为`violet`。 

输出：```
violet
```### 没有成功的颜色更改

 输入：```
4
lock
red
yellow
green
```圆顶开始于`blue`。 锁定命令禁用所有后续颜色更改。 每个颜色消息都会被忽略，因此初始颜色会一直保留到最后。 

输出：```
blue
```
