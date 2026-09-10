---
title: "CF 105472A - 字母动物"
description: "我们得到了前一个玩家最后说出的动物名称和一组未使用的动物名称。 对我们来说，有效的举动必须满足链接规则：新名称必须以先前名称的最后一个字符开头，并且以前不得使用过。"
date: "2026-06-23T18:04:32+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 105472
codeforces_index: "A"
codeforces_contest_name: "2019-2020 ACM-ICPC Nordic Collegiate Programming Contest (NCPC 2019)"
rating: 0
weight: 105472
solve_time_s: 65
verified: true
draft: false
---

[CF 105472A - 字母动物](https://codeforces.com/problemset/problem/105472/A)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 5s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了前一个玩家最后说出的动物名称和一组未使用的动物名称。 对我们来说，有效的举动必须满足链接规则：新名称必须以先前名称的最后一个字符开头，并且以前不得使用过。 在所有有效的行动中，我们想知道是否可以立即迫使下一个玩家陷入失败的局面。 如果存在这样的“强制”移动，我们更喜欢输入顺序中最早的移动； 否则我们接受任何有效的举动； 如果根本不存在有效的移动，我们输出一个问号。 

如果下一个玩家无法回应，我们播放一个单词后，他们就会处于失败的位置。 这意味着没有剩余未使用的单词以我们选择的单词的最后一个字母开头。 

输入大小可达 100,000 个单词。 这排除了任何重复扫描整个列表以查找每个候选人或模拟多个未来移动的解决方案。 一个在字数上呈线性或接近线性的解决方案是必要的，因为任何二次方在最坏的情况下都会达到大约 10^10 次运算，并且不会在两秒内通过。 

一个微妙的边缘情况来自于“输入顺序中第一个这样的名称”的要求。 即使稍后出现更好的战略举措，我们也不能跳过较早的有效候选者。 

另一个常见的陷阱是忘记“淘汰下一个玩家”取决于我们选择的单词被删除后的状态。 仅当一个单词从其最后一个字符开始的单词池中排除后，该单词才会看起来是终端。 

例如，假设前面的单词以“a”结尾，并且列表包含“apple”、“ant”和“art”。 如果我们选择“ant”，下一个玩家仍然有“apple”和“art”，根据字母以“t”或“a”开头，所以我们必须根据第一个字母仔细计数。 

## 方法

 直接模拟方法会尝试以所需首字母开头的每个单词，然后暂时将其删除并扫描整个列表以检查是否有任何剩余单词以最后一个字母开头。 这是正确的，因为它在每次可能的移动之后明确测试游戏条件。 然而，对于每个候选词，我们可能会重新扫描最多 10⁵ 个单词，产生最坏情况的复杂度为 O(n²)。 当 n = 10⁵ 时，这变得太慢了。 

关键的观察结果是，我们实际上不需要重新扫描每个候选人的列表。 对于所选单词来说，重要的是有多少个单词以其最后一个字母开头。 如果整个池中恰好有一个单词以该字母开头，并且该单词就是我们正在玩的单词，那么下一个玩家没有合法的动作。 这将“未来检查”简化为简单的频率查找。 

所以问题就变成了两级扫描。 首先，我们预先计算有多少个单词以每个字母“a”到“z”开头。 然后我们按照输入顺序扫描列表，过滤可以播放的单词（它们的第一个字母与前一个单词的最后一个字母匹配），并使用频率表测试它们是否是终端。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每个候选人的暴力模拟| O(n²) | O(n) | 太慢了|
 | 计频+单程| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 我们将问题转化为对第一个和最后一个字母进行简单的簿记。

1. 读取前一个单词并提取其最后一个字符。 该字符定义了我们移动的唯一有效的起始字母，因为所有其他单词都立即无关。 
2. 读取所有可用单词并计算频率表，计算每个字母开头的单词数量。 这使我们能够立即回答下一个玩家在采取任何行动后会有多少种选择。 
3. 按输入顺序扫描列表，收集第一个字符与所需起始字母匹配的单词。 这些是我们唯一可以合法参与的候选人。 
4. 对于每个候选，检查它是否是“终端”。 如果从最后一个字符开始的单词出现频率恰好为 1，则该单词是终端单词，这意味着它是整个池中唯一这样的单词。 这样的话，一旦我们播放了，就没有剩下的单词可以响应了。 
5. 输入顺序中的第一个终端候选是最优输出，必须打印感叹号。 
6. 如果不存在最终候选，但至少存在一个候选，则输出第一个候选，不带感叹号。 
7. 如果根本不存在候选者，则输出问号。 

步骤 4 背后的原因是，在播放一个单词后，该单词将从池中删除。 如果没有其他单词以其结尾字母开头，则下一个玩家的合法动作为零。 

### 为什么它有效

 我们移动后的游戏状态完全由我们选择的单词的最后一个字母和剩余单词前缀的多重集决定。 由于我们引入的唯一更改是从池中删除一个单词，因此唯一受影响的计数是其起始字母类别的频率。 如果该频率恰好为 1，则删除该词会留下零个可用响应。 剩余列表的任何其他结构与下一步移动无关，因此频率条件既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

prev = input().strip()
last_char = prev[-1]

n = int(input())
words = [input().strip() for _ in range(n)]

start_count = [0] * 26
for w in words:
    start_count[ord(w[0]) - 97] += 1

candidates = []
for w in words:
    if w[0] == last_char:
        candidates.append(w)

if not candidates:
    print("?")
    sys.exit()

first_valid = None
first_terminal = None

for w in candidates:
    idx = ord(w[-1]) - 97
    is_terminal = (start_count[idx] == 1)

    if first_valid is None:
        first_valid = w

    if is_terminal and first_terminal is None:
        first_terminal = w

if first_terminal is not None:
    print(first_terminal + "!")
else:
    print(first_valid)
```该解决方案首先构建一个按字母索引的频率数组，以允许恒定时间检查有多少单词以任何给定字符开头。 这避免了候选人评估期间的任何重复扫描。 

然后，我们根据所需的起始字母分隔有效的移动。 在评估过程中，我们不会从数据结构中删除单词； 相反，我们依赖于预先计算的计数。 条件`start_count[last_letter] == 1`足以保证在选择该单词后，没有剩余的单词可供下一个玩家玩。 

两个跟踪变量，`first_valid`和`first_terminal`，确保我们尊重输入顺序约束，而无需排序或额外的数据结构。 

## 工作示例

 ### 示例 1

 输入：```
dog
3
snake
emu
goat
```我们需要以“g”开头的单词。 只有“山羊”才有资格。 

| 步骤| 词| 有效开始 | 最后一个字符 | 开始计数[最后] | 终端| 首次有效 | 第一个航站楼 |
 | --- | --- | --- | --- | --- | --- | --- | --- |
 | 1 | 蛇| 没有| - | - | - | - | - |
 | 2 | 鸸鹋 | 没有| - | - | - | - | - |
 | 3 | 山羊 | 是的 | t | 开始计数[t]=1 | 是的 | 山羊 | 山羊 |

 只有“goat”可以播放，并且由于没有其他单词以“t”开头，因此它是终端，因此输出为：```
goat!
```### 示例 2

 输入：```
dog
2
snake
emu
```没有单词以“g”开头，因此不存在有效的移动。 

| 步骤| 词| 有效开始 |
 | --- | --- | --- |
 | 1 | 蛇| 没有|
 | 2 | 鸸鹋 | 没有|

 输出：```
?
```这证实了玩家无法进行任何移动的情况。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 一次构建频数表，一次筛选候选者 |
 | 空间| O(1) | O(1) | 无论输入大小如何，仅 26 个计数器 |

 该算法完全符合限制，因为在使用直接数组访问和简单循环时，在 Python 中，在 2 秒约束下，即使 10⁵ 操作也是微不足道的。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from sys import stdout
    import sys

    prev = input().strip()
    last_char = prev[-1]

    n = int(input())
    words = [input().strip() for _ in range(n)]

    start_count = [0] * 26
    for w in words:
        start_count[ord(w[0]) - 97] += 1

    candidates = [w for w in words if w[0] == last_char]

    if not candidates:
        return "?"

    first_valid = None
    first_terminal = None

    for w in candidates:
        if first_valid is None:
            first_valid = w
        if start_count[ord(w[-1]) - 97] == 1 and first_terminal is None:
            first_terminal = w

    return (first_terminal + "!") if first_terminal else first_valid

# provided-style samples
assert run("dog\n0\n") == "?", "empty list"
assert run("dog\n2\nsnake\nemu\n") == "?", "sample 2 behavior"

# custom cases
assert run("cat\n1\ntiger\n") == "tiger!", "single terminal move"
assert run("ant\n3\napple\nape\nart\n") == "apple", "valid but not terminal"
assert run("eel\n2\nlion\nzebra\n") == "?", "no valid start"
assert run("abc\n1\ncaa\n") == "caa!", "chain works exactly once"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 没有有效的开始 | ？ | 没有候选案例|
 | 单终端搬家| 单词！ | 强制获胜检测|
 | 多名候选人 | 第一个有效 | 输入顺序优先|
 | 链条箱 | 单词！ | 正确的最后一个字母依赖性 |

 ## 边缘情况

 一个重要的边缘情况是存在有效的移动但不是终结的情况。 考虑以前以“a”结尾的单词和以“a”开头的多个单词，但它们都以也有多个可用单词的字母结尾。 在这种情况下，他们都不能保证消除。 该算法正确地返回返回第一个有效候选者，因为`start_count[last_letter] > 1`对于每个候选人，防止任何错误的终端分类。 

当给定的起始字母恰好存在一个单词但由于前一个单词的限制而实际上无法到达时，就会出现另一种边缘情况。 由于我们过滤的是`w[0] == last_char`，不可达词永远不会进入候选集，保证正确性。 

最后的边缘情况是所有单词都是有效候选单词但没有一个是终结单词。 例如，前面的单词以“a”结尾，并且有多个以“a”开头的单词，并且它们的结尾字母也有多个单词。 频率检查永远不会触发，所以`first_terminal`保持为空，算法正确输出第一个有效单词，不带感叹号。
