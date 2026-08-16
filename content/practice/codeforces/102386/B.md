---
title: "CF 102386B - \u0422\u0443\u0440\u043d\u0438\u0440\u0423\u0440\u0424\u0423"
description: "我们需要判断一轮石头剪刀布蜥蜴史波克。 第一输入行是第一个玩家选择的移动，第二行是第二个玩家选择的移动。 每个动作都是石头、剪刀、布、蜥蜴或史波克中的一种。"
date: "2026-08-15T18:36:15+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102386
codeforces_index: "B"
codeforces_contest_name: "\u041a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u043e\u043d\u043d\u044b\u0439 \u0442\u0443\u0440 \u0423\u0440\u0430\u043b\u044c\u0441\u043a\u043e\u0433\u043e \u0447\u0435\u0442\u0432\u0435\u0440\u0442\u044c\u0444\u0438\u043d\u0430\u043b\u0430 \u0427\u0435\u043c\u043f\u0438\u043e\u043d\u0430\u0442\u0430 \u043c\u0438\u0440\u0430 \u043f\u043e \u043f\u0440\u043e\u0433\u0440\u0430\u043c\u043c\u0438\u0440\u043e\u0432\u0430\u043d\u0438\u044e 2019"
rating: 0
weight: 102386
solve_time_s: 378
verified: false
draft: false
---

[CF 102386B - \u0422\u0443\u0440\u043d\u0438\u0440\u0423\u0440\u0424\u0423](https://codeforces.com/problemset/problem/102386/B)

 **评级：** -
 **标签：** -
 **求解时间：** 6m 18s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们需要判断一轮石头剪刀布蜥蜴史波克。 第一输入行是第一个玩家选择的移动，第二行是第二个玩家选择的移动。 每个动作都是其中之一`Rock`,`Scissors`,`Paper`,`Lizard`， 或者`Spock`。 

每个动作恰好击败另外两个动作。`Scissors`失败`Paper`和`Lizard`,`Paper`失败`Rock`和`Spock`,`Rock`失败`Lizard`和`Scissors`,`Lizard`失败`Spock`和`Paper`， 和`Spock`失败`Scissors`和`Rock`。 如果两名玩家选择相同的动作，则结果为平局。 

程序必须打印`First`当第一步打败第二步时`Second`当相反的情况成立时，并且`Tie`当动作相等时。 

这里没有可变大小的输入。 恰好读取了两个字符串，每个字符串都属于一组固定的五个可能值。 因此，即使是明确考虑每对可能的走法的方法也最多执行 25 次比较。 没有有意义的大`n`此问题中存在性能问题，因此 O(1) 解决方案就足够了，并且可以轻松满足任何正常的 Codeforces 限制。 

主要的边缘情况来自于将游戏视为普通的剪刀石头布，或者忘记了每一步都有两个获胜的对手。 例如，```
Rock
Rock
```必须产生`Tie`。 一个粗心的实现，只检查第一个动作是否击败第二个动作，可能会失败`Second`而不是先处理平等。 

另一种情况是```
Lizard
Spock
```产生`First`。 蜥蜴击败了斯波克，尽管这两种举动都不属于普通剪刀石头布的三种标准选择。 仅包含经典三种关系的实现将给出不正确的结果。 

第三个有用的边界情况是```
Spock
Paper
```产生`Second`，因为纸打败了史波克。 每次移动只检查两个获胜关系之一会错过这种情况。 

## 方法

 直接的暴力解决方案可以显式枚举所有 25 个有序的移动对，并将每对与其结果相关联。 由于每个玩家只有 5 种可能的走法，因此最坏的情况正好是 25 对检查。 这种方法已经足够快了，因为 25 是一个与输入大小无关的常数。 不存在任何输入大小会使这种特定的强力方法变得太慢的情况。 

更自然的实现是使用游戏本身的结构。 我们存储十个定向获胜关系，然后检查第一个玩家的动作是否是击败第二个玩家的动作之一。 如果是这样，第一个玩家获胜。 否则，如果步数相同，则结果为平局。 剩下的每一对都必须意味着第二个玩家获胜，因为规则为每对不同的动作定义了获胜者。 

关键的观察是整个游戏是一个只有五个顶点的固定图。 每次移动都是一个顶点和一条边`A`到`B`意味着`A`失败`B`。 我们不需要搜索该图或动态构建任何东西。 大小恒定的查找结构直接代表所有可能的获胜关系。 

这两种方法具有以下复杂性。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 枚举所有 25 个可能的对 | O(1) | O(1) | O(1) | O(1) | 已接受 |
 | 获胜关系查找 | O(1) | O(1) | O(1) | O(1) | 已接受 |

 查找方法更可取，因为它直接表示规则并避免了一长串特殊情况。 

## 算法演练

 1. 读两个动作`first`和`second`。 正好有两条输入线，因此不需要测试用例循环。 
2.如果`first == second`， 打印`Tie`。 势均力敌的招式，无论哪一招，都不会打败对方。 
3. 存储每个可能的移动失败的两个移动。 例如，`Rock`与`Lizard`和`Scissors`， 尽管`Spock`与`Rock`和`Scissors`。 
4. 检查是否`second`属于被击败的一组动作`first`。 如果是，则打印`First`。 
5. 如果走法不同并且第一个走法没有击败第二个走法，则打印`Second`。 每对不同的配对都有一个获胜者，因此无需考虑第四个结果。 

### 为什么它有效

 对于每一个动作`A`，查找结构恰好包含两个动作`A`根据游戏规则，输掉比赛。 经过平等检查后，两名棋手的动作截然不同。 如果第二步出现在第一步的获胜组中，则规则表明第一个玩家获胜。 否则，第一个玩家无法击败第二个玩家，并且因为每个不同的对都有一个获胜者，所以第二个玩家必须获胜。 因此，每个可能的输入都准确地达到了其正确的结果。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

first = input().strip()
second = input().strip()

wins = {
    "Rock": {"Lizard", "Scissors"},
    "Scissors": {"Paper", "Lizard"},
    "Paper": {"Rock", "Spock"},
    "Lizard": {"Spock", "Paper"},
    "Spock": {"Scissors", "Rock"},
}

if first == second:
    print("Tie")
elif second in wins[first]:
    print("First")
else:
    print("Second")
```字典`wins`是游戏图的完整表示。 每个键都是第一玩家可能的一个动作，其值恰好包含它击败的两个动作。 

相等性检查发生在获胜查找之前，因为相等性有其自己的结果，`Tie`。 如果没有此检查，相等的对将错误地落入`Second`案件。 

表达式`second in wins[first]`精确检查第一个玩家获胜所需的条件。 如果在移动已经显示不同之后它是假的，则第二个玩家必然获胜。 

这里没有索引、输入数据循环或算术运算，因此不存在边界或整数溢出问题。 这`.strip()`调用删除产生的换行符`readline()`同时保留确切的动作名称。 

## 工作示例

 ### 示例 1

 输入是：```
Rock
Paper
```相关的状态变化是：

 | 步骤|`first`|`second`| 状况 | 结果 |
 | ---| ---| ---| ---| ---|
 | 读取输入|`Rock`|`Paper`| 两个动作均已存储 | 继续 |
 | 平等检查|`Rock`|`Paper`|`first == second`是假的 | 继续 |
 | 获胜查找 |`Rock`|`Paper`|`Paper`没有被打败`Rock`|`Second`|`Rock`失败`Lizard`和`Scissors`， 不是`Paper`。 由于动作不同，唯一剩下的获胜者是第二个玩家。 程序打印出`Second`。 

### 示例 2

 输入是：```
Rock
Rock
```踪迹是：

 | 步骤|`first`|`second`| 状况 | 结果 |
 | ---| ---| ---| ---| ---|
 | 读取输入|`Rock`|`Rock`| 两个动作均已存储 | 继续 |
 | 平等检查|`Rock`|`Rock`|`first == second`是真的 |`Tie`|

 永远不需要查找。 这说明了为什么在检查获胜关系之前必须处理平等问题。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(1) | O(1) | 仅读取两个字符串并执行一次常量大小的查找。 |
 | 空间| O(1) | O(1) | 该词典恰好包含五个键和十个获胜关系。 |

 输入大小固定为五元素集中的两次移动，因此该算法仅执行恒定数量的操作并使用恒定数量的内存。 它非常适合问题的时间和内存限制。 

## 测试用例```python
import sys
import io

def solve():
    first = input().strip()
    second = input().strip()

    wins = {
        "Rock": {"Lizard", "Scissors"},
        "Scissors": {"Paper", "Lizard"},
        "Paper": {"Rock", "Spock"},
        "Lizard": {"Spock", "Paper"},
        "Spock": {"Scissors", "Rock"},
    }

    if first == second:
        return "Tie"
    if second in wins[first]:
        return "First"
    return "Second"

def run(inp: str) -> str:
    global input
    old_stdin = sys.stdin
    old_input = input

    try:
        sys.stdin = io.StringIO(inp)
        input = sys.stdin.readline
        return solve()
    finally:
        sys.stdin = old_stdin
        input = old_input

# Provided samples
assert run("Rock\nPaper\n") == "Second", "sample 1"
assert run("Rock\nRock\n") == "Tie", "sample 2"
assert run("Lizard\nSpock\n") == "First", "sample 3"

# All equal values
assert run("Spock\nSpock\n") == "Tie", "equal moves"

# Reverse direction of a winning relationship
assert run("Paper\nRock\n") == "First", "Paper defeats Rock"
assert run("Rock\nPaper\n") == "Second", "Paper defeats Rock"

# Second winning relationship of a move
assert run("Spock\nRock\n") == "Second", "Rock defeats Spock"
assert run("Spock\nScissors\n") == "First", "Spock defeats Scissors"

# Lizard's two different winning relationships
assert run("Lizard\nPaper\n") == "First", "Lizard defeats Paper"
assert run("Paper\nLizard\n") == "Second", "Lizard defeats Paper"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`Spock / Spock`|`Tie`| 另一举措的平等处理|
 |`Paper / Rock`|`First`| 获胜关系的一个方向|
 |`Spock / Rock`|`Second`| 第二个玩家战胜了第一步的对手 |
 |`Lizard / Paper`|`First`| 蜥蜴第二次获胜优势|
 |`Paper / Lizard`|`Second`| 颠倒同样的关系|

 该问题实际上没有单独的最小尺寸或最大尺寸参数。 每个测试用例始终包含恰好两个动作，因此相关边界是五个可能值的完整集合。 上述测试涵盖了所有结构情况，包括等量移动和几种关系的双向。 

## 边缘情况

 第一个边缘情况是平等。 为了```
Rock
Rock
```该算法读取两个动作，发现`first == second`，并立即返回`Tie`。 它并不试图治疗`Rock`就如同打败了自己，因为游戏规则排除了自我比较。 

第二种边缘情况是有两种不同获胜方式的举动。 考虑```
Lizard
Spock
```字典条目为`Lizard`是`{Spock, Paper}`。 自从`Spock`存在，条件`second in wins[first]`为 true，结果为`First`。 这捕获了仅记住 Lizard 的两个获胜关系之一的实现。 

第三个边缘情况是相反的对```
Paper
Lizard
```条目为`Paper`是`{Rock, Spock}`， 所以`Lizard`不存在。 移动不相等，因此算法到达最后一个分支并打印`Second`。 这证实了该关系是有向的并且不能被视为无向连接。 

第四个边缘情况是 Spock 与 Rock 不太明显的互动：```
Spock
Rock
```

`Rock`出现在`wins["Spock"]`，所以算法打印`First`。 将输入反转为```
Rock
Spock
```使查找失败，算法打印`Second`。 这两个输入一起验证每个关系的方向是否被正确解释。
