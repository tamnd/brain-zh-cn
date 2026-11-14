---
title: "CF 469A - 我想成为那个人"
description: "我们有一个级别从 1 到 n 的游戏。 小 X 可以完成这些级别的某些子集，小 Y 可以完成另一个子集。 他们决定合作，这意味着如果至少有一个人能够完成某个关卡，则该关卡被认为是通过的。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "implementation"]
categories: ["algorithms"]
codeforces_contest: 469
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 268 (Div. 2)"
rating: 800
weight: 469
solve_time_s: 98
verified: true
draft: false
---

[CF 469A - 我想成为那个人](https://codeforces.com/problemset/problem/469/A)

 **评分：** 800
 **标签：** 贪心，实现
 **求解时间：** 1m 38s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一个游戏，其级别编号为 1 到 _n_。 小 X 可以完成这些级别的某些子集，小 Y 可以完成另一个子集。 他们决定合作，这意味着如果至少有一个人能够完成某个关卡，则该关卡被认为是通过的。 

任务只是确定他们的综合能力是否涵盖游戏的每个级别。 如果从 1 到 _n_ 的每个级别都可以由 X 或 Y 完成，我们打印`"I become the guy."`。 否则，至少一个级别对于两个玩家来说都是不可能的，我们打印`"Oh, my keyboard!"`。 

限制非常小。 级别数最多为 100，因此即使效率相对较低的方法也能在时间限制内轻松运行。 我们不需要复杂的数据结构或高级算法。 检查所有级别的覆盖范围的简单实现就足够了。 

一些边缘情况很容易被忽视。 

假设一名玩家根本无法通过任何关卡。 

输入：```
1
0
1 1
```正确的输出是：```
I become the guy.
```尽管 X 没有贡献任何内容，但 Y 独自覆盖了唯一的级别。 

另一种情况是两个玩家都列出了一些相同的级别。 

输入：```
4
2 1 2
2 2 3
```正确的输出是：```
Oh, my keyboard!
```级别 1、2 和 3 已涵盖，但缺少级别 4。 仅计算读取的数字的粗心实现可能会错误地认为四个条目意味着四个覆盖级别。 

当两个玩家都没有单独完成每个级别，但他们一起完成时，就会出现最后的边缘情况。 

输入：```
4
2 1 2
2 3 4
```正确的输出是：```
I become the guy.
```在这里单独检查每个玩家将会失败。 我们必须考虑它们可达到的水平的联合。 

## 方法

 最直接的暴力想法是检查从 1 到 _n_ 的每个级别。 对于每个级别，扫描 X 的列表和 Y 的列表以查看任一玩家是否可以完成它。 如果两个列表中均不存在某个级别，则答案是否定的。 

这种方法是正确的，因为它明确地验证了问题所需的条件：必须覆盖每个级别。 由于每个列表最多有 100 个级别和最多 100 个条目，最坏的情况执行大约 100 × 200 = 20,000 次比较，这已经足够快了。 

我们可以通过观察我们只关心一个级别是否在两个玩家列表中至少出现一次来使解决方案更清晰。 重复的外观并不重要。 这自然建议使用一套。 

我们将 X 可以传递的每个级别插入到一个集合中，然后将 Y 可以传递的每个级别插入到同一个集合中。 该装置自动将每个级别仅存储一次。 如果集合的大小变为_n_，则表示每个级别。 否则，就会缺少某些级别。 

暴力方法之所以有效，是因为它直接逐级检查覆盖范围。 关键的观察结果是覆盖范围与两个玩家级别集的并集完全相同。 明确地表示该联合可以让我们通过一次大小比较来回答这个问题。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n(p + q)) | O(n(p + q)) | O(1) | O(1) | 已接受 |
 | 最佳| O(p + q) | O(n) | 已接受 |

 ## 算法演练

 1.读取级别数，`n`。 
2. 读小X的台词。 第一个数字是`p`，随后是`p`X级可以完成。 
3. 读小Y的台词。 第一个数字是`q`，随后是`q`Y 级可以完成。 
4. 创建一个空集。 
5. 将 X 列表中的所有级别插入到集合中。 

该集合仅保留独特的级别，这正是我们所需要的。 
6. 将 Y 列表中的所有级别插入同一组中。 

在此步骤之后，该集合代表任一玩家可通过的级别的并集。 
7. 比较集合的大小`n`。 

如果该集合恰好包含`n`不同的级别，每个级别从 1 到`n`被覆盖。 
8. 打印`"I become the guy."`如果所有级别都被覆盖。 否则打印`"Oh, my keyboard!"`。 

### 为什么它有效

 该集合精确地包含了至少一名玩家可以通过的关卡。 由 X 或 Y 插入的每个级别都会出现在集合中，并且不会出现其他级别。 

如果设置的大小等于`n`，然后从 1 到`n`存在于联盟中，这意味着玩家可以集体完成整个游戏。 

如果设置的大小小于`n`，联盟中至少缺少一个级别。 两个玩家都无法完成该关卡，因此完成整个游戏是不可能的。 

由于算法准确地检查问题陈述所需的并集，因此它总是会产生正确的答案。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())

    x_data = list(map(int, input().split()))
    y_data = list(map(int, input().split()))

    levels = set()

    for level in x_data[1:]:
        levels.add(level)

    for level in y_data[1:]:
        levels.add(level)

    if len(levels) == n:
        print("I become the guy.")
    else:
        print("Oh, my keyboard!")

solve()
```第一行读取总级别数。 The next two lines contain the players' information. The first value on each line is a count and is not itself a level number, so we skip it by slicing from index 1 onward.

 A set is used because we only care whether a level is covered, not how many times it appears. If both players can pass level 2, the set still stores only one copy of 2.

The final comparison checks whether the union contains all`n`水平。 由于级别编号为从 1 到`n`，有`n`不同的覆盖级别意味着每个级别都被覆盖。 

一个微妙的细节是避免使用计数值`p`和`q`作为级别。 意外地包含它们会在某些输入上产生错误的答案。 使用`x_data[1:]`和`y_data[1:]`完全避免了这个错误。 

## 工作示例

 ### 示例 1

 输入：```
4
3 1 2 3
2 2 4
```| 步骤| 当前设置 |
 | --- | --- |
 | 开始| {} |
 | 添加 1 | {1} |
 | 添加 2 | {1, 2} |
 | 添加 3 | {1,2,3}|
 | 添加 2 | {1,2,3}|
 | 添加 4 | {1,2,3,4}|

 最终状态：

 | n | 套装尺寸 |
 | --- | --- |
 | 4 | 4 |

 输出：```
I become the guy.
```此跟踪显示重复级别 2 如何被集合自动忽略。 结合两名玩家的能力后，所有四个级别都被覆盖。 

### 示例 2

 输入：```
4
2 1 2
1 3
```| 步骤| 当前设置 |
 | --- | --- |
 | 开始| {} |
 | 添加 1 | {1} |
 | 添加 2 | {1, 2} |
 | 添加 3 | {1,2,3}|

 最终状态：

 | n | 套装尺寸 |
 | --- | --- |
 | 4 | 3 |

 输出：```
Oh, my keyboard!
```4 级从未出现在任何玩家的列表中。 该套装仅包含三个不同的关卡，因此完成游戏是不可能的。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(p + q) | 每个列出的级别都会插入到集合中一次 |
 | 空间| O(n) | 该套装可以存储所有游戏级别 |

 自从`n ≤ 100`，算法基本上立即运行。 时间和内存使用量都远低于问题限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    n = int(input())

    x_data = list(map(int, input().split()))
    y_data = list(map(int, input().split()))

    levels = set(x_data[1:]) | set(y_data[1:])

    if len(levels) == n:
        return "I become the guy."
    return "Oh, my keyboard!"

# provided sample
assert run("4\n3 1 2 3\n2 2 4\n") == "I become the guy.", "sample 1"

# minimum size
assert run("1\n0\n1 1\n") == "I become the guy.", "minimum n"

# missing one level
assert run("4\n2 1 2\n1 3\n") == "Oh, my keyboard!", "level 4 missing"

# one player covers everything
assert run("5\n5 1 2 3 4 5\n0\n") == "I become the guy.", "single player sufficient"

# maximum-style coverage
assert run(
    "100\n50 " + " ".join(map(str, range(1, 51))) +
    "\n50 " + " ".join(map(str, range(51, 101))) + "\n"
) == "I become the guy.", "full coverage across both players"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`n=1`，只有 Y 知道级别 1 |`I become the guy.`| 最小尺寸输入 |
 | 1、2、3 级已覆盖，4 级缺失 |`Oh, my keyboard!`| 漏液位检测 |
 | X 涵盖所有级别，Y 不涵盖任何级别 |`I become the guy.`| 一个人就够了 |
 | 覆盖 100 个级别 |`I become the guy.`| 大边界情况 |

 ## 边缘情况

 考虑一个玩家没有做出任何贡献的情况。 

输入：```
1
0
1 1
```该集合开始为空。 X 不添加级别。 Y 添加级别 1，产生`{1}`。 集合大小变为 1，等于`n`，所以算法打印：```
I become the guy.
```现在考虑重叠级别。 

输入：```
4
2 1 2
2 2 3
```处理X后，集合为`{1, 2}`。 处理 Y 再次添加级别 2 和级别 3，产生`{1, 2, 3}`。 重复级别不会增加集合大小。 由于最终大小是 3 而不是 4，因此算法正确打印：```
Oh, my keyboard!
```最后，考虑一个需要合作的情况。 

输入：```
4
2 1 2
2 3 4
```X 贡献`{1, 2}`Y 贡献`{3, 4}`。 他们的结合变成了`{1, 2, 3, 4}`。 集合大小等于`n`，所以输出是：```
I become the guy.
```这说明了为什么我们必须评估综合覆盖范围而不是单独检查每个玩家。
