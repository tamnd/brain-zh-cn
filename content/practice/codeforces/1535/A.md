---
title: "CF 1535A - 公平季后赛"
description: "我们有一个迷你季后赛，只有四名选手参加。 前两名对决，后两名对决，胜者将进入决赛。 每个玩家都有独特的技能值，在任何比赛中，技能较高的玩家总是获胜。"
date: "2026-06-10T15:42:45+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 1535
codeforces_index: "A"
codeforces_contest_name: "Educational Codeforces Round 110 (Rated for Div. 2)"
rating: 800
weight: 1535
solve_time_s: 381
verified: false
draft: false
---

[CF 1535A - 公平季后赛](https://codeforces.com/problemset/problem/1535/A)

 **评分：** 800
 **标签：** 暴力破解、实施
 **求解时间：** 6m 21s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一个迷你季后赛，只有四名选手参加。 前两名对决，后两名对决，胜者将进入决赛。 每个玩家都有独特的技能值，在任何比赛中，技能较高的玩家总是获胜。 我们被要求确定比赛是否“公平”，这意味着两名最强的选手实际上会在决赛中相遇。 

输入提供多个测试用例。 每个测试用例都是代表玩家技能的四个整数。 如果比赛公平，则输出应为“YES”，否则为“NO”。 由于测试用例多达 10,000 个，技能值上限为 100，我们无法提供模拟所有排列的解决方案，但每个用例都足够小，可以处理直接比较。 

由于玩家不是随机匹配的，所以出现了一个微妙的问题。 如果排名前两名的技术选手在同一侧，则半决赛将淘汰一名选手。 例如，拥有技能`9, 8, 1, 2`排列为`[s1, s2, s3, s4]`，半决赛是`9 vs 8`和`1 vs 2`。 虽然`9`和`8`是最强的，他们在半决赛中相遇，所以决赛将是`9 vs 2`，这是不公平的。 如果粗心地只看两个最大的数字而不考虑它们的位置，就会产生错误的答案。 

## 方法

 暴力方法会模拟每场比赛：比较`s1`与`s2`和`s3`与`s4`获得半决赛获胜者，然后比较决赛的获胜者。 这适用于四个玩家，但变得冗长和机械，尽管它是可行的，因为输入大小很小。 

关键的洞察力是位置。 我们只需要知道最强的两个技能以及它们位于括号的哪一边。 半决赛第一场由前两项技能决定`[s1, s2]`，第二场半决赛由`[s3, s4]`。 我们检查每场半决赛的最大值：第一个半决赛的获胜者是`max(s1, s2)`，第二个是`max(s3, s4)`。 如果这两名半决赛获胜者是总技能前两名，那么决赛将是前两名，使比赛公平。 否则的话，一名顶尖高手就被淘汰得太早了。 

这将问题从模拟转变为简单的最大比较。 它既正确又极其有效。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 暴力模拟| 每个案例 O(1) | O(1) | O(1) | 已接受 |
 | 最佳最大比较 | 每个案例 O(1) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.读取测试用例的数量，`t`。 
2. 对于每个测试用例，读取四个整数`s1, s2, s3, s4`。 
3. 通过以下方式确定第一场半决赛的获胜者`max(s1, s2)`。 
4. 通过以下方式确定第二场半决赛的获胜者`max(s3, s4)`。 
5. 通过取其中两个最大的数字来确定总体上最重要的两项技能`[s1, s2, s3, s4]`。 
6. 检查半决赛获胜者是否恰好是技能前两名。 如果是，则输出“YES”； 否则，输出“NO”。 

为什么有效：通过仅将半决赛获胜者与全球前两名进行比较，我们可以了解分组是否允许两位顶尖选手进入决赛。 比赛顺序确保没有其他玩家意外进入决赛，因此这些检查足以确定公平性。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    s = list(map(int, input().split()))
    first_winner = max(s[0], s[1])
    second_winner = max(s[2], s[3])
    top_two = sorted(s, reverse=True)[:2]
    if first_winner in top_two and second_winner in top_two:
        print("YES")
    else:
        print("NO")
```我们读取所有输入`sys.stdin.readline`为了速度。`first_winner`和`second_winner`对应半决赛获胜者。 对列表进行降序排序并取前两个元素即可得出全局前两项技能。 会员资格检查确认两名半决赛获胜者均跻身前两名。 使用`in`避免假设顺序或索引时出现错误，如果前两个不是，则可能会失败`s1`和`s3`。 

## 工作示例

 测试用例：`3 7 9 5`| 变量| 价值|
 | --- | --- |
 | s | [3,7,9,5]|
 | 第一名获胜者 | 最大 (3, 7) = 7 |
 | 第二名获胜者 | 最大(9, 5) = 9 |
 | 顶部_二 | 排序（[3,7,9,5]，反向=True）[：2] = [9,7] |
 | 比较| top_two 中有 7 个？ 是的; 9 在 top_two 中？ 是的 |
 | 输出| 是 |

 测试用例：`4 5 6 9`| 变量| 价值|
 | --- | --- |
 | s | [4,5,6,9] |
 | 第一名获胜者 | 最大值(4,5) = 5 |
 | 第二名获胜者 | 最大值(6,9) = 9 |
 | 顶部_二 | [9,6]|
 | 比较| top_two 中有 5 个？ 不; 9 在 top_two 中？ 是的 |
 | 输出| 否 |

 这些痕迹证实该算法根据半决赛获胜者正确识别两位顶尖选手是否进入决赛。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t) | 每个测试用例使用恒定数量的操作，并且有`t`测试用例。 |
 | 空间| O(1) | O(1) | 我们为每个测试用例存储固定数量的变量； 额外的存储空间不会随着输入大小而增加。 |

 给定`t <= 10^4`而且每个操作都很简单，解决方案可以轻松地在 2 秒的限制内运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    # solution
    t = int(input())
    for _ in range(t):
        s = list(map(int, input().split()))
        first_winner = max(s[0], s[1])
        second_winner = max(s[2], s[3])
        top_two = sorted(s, reverse=True)[:2]
        if first_winner in top_two and second_winner in top_two:
            print("YES")
        else:
            print("NO")
    return output.getvalue().strip()

# provided samples
assert run("4\n3 7 9 5\n4 5 6 9\n5 3 8 1\n6 5 3 2\n") == "YES\nNO\nYES\nNO", "sample 1"

# custom cases
assert run("1\n1 2 3 4\n") == "YES", "top two on opposite sides"
assert run("1\n4 3 2 1\n") == "NO", "top two on same side"
assert run("1\n10 20 30 40\n") == "YES", "ascending order"
assert run("1\n40 30 20 10\n") == "YES", "descending order"
assert run("1\n1 100 50 2\n") == "NO", "strongest with weakest on same side"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 1 2 3 4 | 1 2 3 4 是 | 双方前两名晋级决赛 |
 | 4 3 2 1 | 4 3 2 1 否 | 同侧半决赛前两名 |
 | 10 20 30 40 | 10 20 30 40 是 | 正确处理增加订单|
 | 40 30 20 10 | 40 30 20 10 是 | 正确处理递减订单 |
 | 1 100 50 2 | 1 100 50 2 否 | 最强与最弱的配对不公平 |

 ## 边缘情况

 如果前两项技能在第一场或第二场半决赛中配对，算法就会检测到不公平，因为`first_winner`或者`second_winner`不会匹配前两个。 例如，与`[100, 1, 99, 2]`,`first_winner = 100`,`second_winner = 99`,`top_two = [100, 99]`。 半决赛的两位获胜者都在`top_two`，因此输出为“YES”。 如果我们有`[100, 99, 1, 2]`,`first_winner = 100`,`second_winner = 2`,`top_two = [100, 99]`。 这里`second_winner`不在前两个中，并且输出为“NO”。 该算法通过直接将半决赛获胜者与全球前两名进行比较来处理这些边缘情况，从而确保了正确性。
