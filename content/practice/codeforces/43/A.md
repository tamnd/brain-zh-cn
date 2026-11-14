---
title: "CF 43A - 足球"
description: "我们得到了一场足球比赛中进球的顺序。 第一行之后的每一行都包含进球球队的名称。 任务是确定哪支球队的总体进球数更多。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "strings"]
categories: ["algorithms"]
codeforces_contest: 43
codeforces_index: "A"
codeforces_contest_name: "Codeforces Beta Round 42 (Div. 2)"
rating: 1000
weight: 43
solve_time_s: 89
verified: true
draft: false
---
[CF 43A - 足球](https://codeforces.com/problemset/problem/43/A)

 **评分：** 1000
 **标签：** 字符串
 **求解时间：** 1m 29s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一场足球比赛中进球的顺序。 第一行之后的每一行都包含进球球队的名称。 任务是确定哪支球队的总体进球数更多。 

输入保证最多出现两个不同的球队名称，并且比赛永远不会以平局结束。 这意味着一支球队的进球数总是多于另一支球队。 

限制非常小。 目标数量最多为 100 个，每个团队名称的长度最多为 10 个。即使是将每个目标与其他目标进行比较的低效解决方案，仍然可以轻松满足时间限制。 这使我们可以自由地专注于清晰度而不是激进的优化。 

主要的挑战不是表现，而是正确计算每个团队的进球数。 

一个容易犯的错误是假设总是只有两支球队。 考虑：```
1
ABC
```正确答案是：```
ABC
```立即读取两个不同名称的粗心实现将会失败，因为只出现一个团队。 

另一个微妙的问题是，当同一支球队出现多次时，更新计数会不正确。 例如：```
5
A
B
A
A
B
```正确的输出是：```
A
```如果我们覆盖计数而不是增加它们，最终结果就会出错。 

另一个陷阱来自于仅比较相邻的目标。 考虑：```
4
A
B
B
A
```最终得分在这里是平局，问题说这永远不会发生，但这个例子说明了为什么邻接告诉我们关于获胜者的任何信息。 我们必须统计全球范围内发生的所有事件。 

## 方法

 最直接的暴力想法是检查每个团队名称并计算它在完整列表中出现的次数。 对于每个目标条目，我们再次扫描整个数组并计算其频率。 

如果有`n`目标，这执行`n * n`最坏情况下的比较。 和`n = 100`，这只是 10,000 次操作，这在这里是完全可以接受的。 暴力方法是正确的，因为获胜者正是频率最大的团队。 

低效率来自于重复地重新计算相同的计数。 如果`"A"`出现了 50 次，每次遇到我们仍然重新计算所有 100 个条目`"A"`。 

关键的观察是，这个问题本质上是一个频率计数问题。 我们可以在读取输入的同时维护每个团队的运行计数，而不是重复扫描列表。 

作为 Python 字典实现的哈希映射在这里是理想的选择。 每次我们读取一个团队名称时，我们都会将其存储的计数加一。 处理完所有进球后，字典包含每支球队的确切进球数。 

由于最多有两支球队，因此事后找出获胜者是微不足道的。 我们只需选择人数较多的团队即可。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(n²) | O(1) | O(1) | 已接受 |
 | 最佳| O(n) | O(k) | 已接受 |

 这里，`k`是不同团队的数量，最多为 2 个。 

## 算法演练

 1.读取整数`n`，比赛期间进球数。 
2. 创建一个空字典，名为`count`。 

该字典将球队名称映射到该球队的进球数。 
3. 重复`n`次数：

 1. 读出团队名称。 
2.增加其在词典中的出现频率。 

如果该队伍之前没有出现过，则先将其计数初始化为零。 
4. 处理完所有目标后，迭代字典条目并跟踪计数最多的球队。 
5. 打印出现频率最高的团队。 

### 为什么它有效

 该算法保持了处理第一个之后的不变量`i`进球数，字典存储每个球队在这些进球中的确切进球数`i`条目。 

每个新目标都会将一支球队的计数精确地更新为 1，因此在整个过程中不变式仍然成立。 

最后，所有进球都已处理完毕，这意味着字典中包含了每支球队的最终得分。 由于该问题保证不存在平局，因此计数最多的团队是唯一的获胜者。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    
    count = {}
    
    for _ in range(n):
        team = input().strip()
        count[team] = count.get(team, 0) + 1
    
    winner = ""
    best = 0
    
    for team, goals in count.items():
        if goals > best:
            best = goals
            winner = team
    
    print(winner)

solve()
```解决方案从读取目标数量开始。 一本名为`count`存储每个团队出现的次数。 

表达式：```
count.get(team, 0) + 1
```很重要，因为它可以干净地处理这两种情况。 如果该团队已存在于字典中，我们将增加其当前值。 否则，`get`回报`0`，团队从一个目标开始。 

统计完所有目标后，我们再次扫描字典以找到最大频率。 由于该问题保证了唯一的获胜者，因此我们永远不需要平局处理逻辑。 

使用`strip()`读取团队名称时，可以避免意外的换行符成为字符串的一部分。 忘记这一点是字符串问题中的一个常见错误。 

## 工作示例

 ### 示例 1

 输入：```
1
ABC
```追踪：

 | 步骤| 团队阅读 | 计数词典 | 当前获奖者 |
 | --- | --- | --- | --- |
 | 1 | ABC | {“ABC”：1} | ABC |

 输出：```
ABC
```此示例演示了最小的有效输入。 只有一支队伍出现，因此自动获胜。 

### 示例 2

 输入：```
5
A
B
A
A
B
```追踪：

 | 步骤| 团队阅读 | 计数词典 | 现任领导者 |
 | --- | --- | --- | --- |
 | 1 | 一个 | {“A”：1} | 一个 |
 | 2 | 乙| {“A”：1，“B”：1} | 领带|
 | 3 | 一个 | {“A”：2，“B”：1} | 一个 |
 | 4 | 一个 | {“A”：3，“B”：1} | 一个 |
 | 5 | 乙| {“A”：3，“B”：2} | 一个 |

 输出：```
A
```该跟踪表明字典始终反映每个处理目标后的准确分数。 尽管团队`B`最终球队再次得分`A`仍然以更多进球结束。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n) | 每个目标都会处理一次 |
 | 空间| O(k) | 字典为每个不同的团队存储一个条目 |

 自从`n ≤ 100`，该解决方案很容易符合限制。 该字典最多包含两个条目，因此内存使用量可以忽略不计。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())

    count = {}

    for _ in range(n):
        team = input().strip()
        count[team] = count.get(team, 0) + 1

    winner = ""
    best = 0

    for team, goals in count.items():
        if goals > best:
            best = goals
            winner = team

    print(winner)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    output = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return output

# provided sample
assert run("1\nABC\n") == "ABC\n", "sample 1"

# minimum size input
assert run("1\nTEAM\n") == "TEAM\n", "single team"

# alternating goals
assert run("5\nA\nB\nA\nB\nA\n") == "A\n", "alternating sequence"

# all goals by same team
assert run("4\nX\nX\nX\nX\n") == "X\n", "all equal"

# long names
assert run("3\nBARCELONA\nREALMADRID\nBARCELONA\n") == "BARCELONA\n", "string handling"

# winner decided late
assert run("7\nA\nB\nB\nA\nA\nB\nA\n") == "A\n", "late lead"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`1 / TEAM`|`TEAM`| 最小有效输入|
 | 交替 A/B 目标 |`A`| 正确累计计数 |
 | 一支球队的所有进球 |`X`| 单一独特的团队处理|
 | 长大写名称 |`BARCELONA`| 正确的字符串处理 |
 | 接近尾声决出胜者|`A`| 最终比较正确|

 ## 边缘情况

 考虑只有一支队伍出现的情况：```
1
ABC
```执行轨迹：

 1. 阅读`"ABC"`。 
2. 商店`count["ABC"] = 1`。 
3. 该词典仅包含一个条目。 
4. 该参赛作品被选为获胜者。 

该算法正确打印：```
ABC
```不需要特殊情况处理，因为字典自然支持单个团队。 

现在考虑对同一团队进行重复更新：```
5
A
B
A
A
B
```字典的演变如下：```
{"A": 1}
{"A": 1, "B": 1}
{"A": 2, "B": 1}
{"A": 3, "B": 1}
{"A": 3, "B": 2}
```该算法永远不会错误地覆盖计数，因为每次出现都会增加先前的值。 

最后，考虑处理过程中获胜者发生变化的情况：```
7
A
B
B
A
A
B
A
```中间领导者会波动，但算法不依赖临时领导者。 它仅使用最终频率：```
A -> 4
B -> 3
```最终输出为：```
A
```这证实了对整个输入进行全局计数是正确的策略。
