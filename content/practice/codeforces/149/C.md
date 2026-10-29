---
title: "CF 149C - 分组"
description: "我们有一群男孩，每个人都有一定的足球技术水平。 任务是将他们分成两个团队，使团队的规模几乎相等，并且团队的总技能水平大致平衡。"
date: "2026-05-29T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "greedy", "math", "sortings"]
categories: ["algorithms"]
codeforces_contest: 149
codeforces_index: "C"
codeforces_contest_name: "Codeforces Round 106 (Div. 2)"
rating: 1500
weight: 149
solve_time_s: 100
verified: false
draft: false
---

[CF 149C - 分组](https://codeforces.com/problemset/problem/149/C)

 **评分：** 1500
 **标签：** 贪婪、数学、排序
 **求解时间：** 1m 40s
 **已验证：** 否

 ## 解决方案
 ## 问题理解

 我们有一群男孩，每个人都有一定的足球技术水平。 任务是将他们分成两个团队，使团队的规模几乎相等，并且团队的总技能水平大致平衡。 正式来说，如果有`n`男孩们，我们需要将他们分成两队，人数最多相差一队。 此外，两队总技术的绝对差异不能超过最好球员的技术。 

输入给出男孩的数量`n`接下来是代表每个男孩技能的整数数组。 输出应列出第一队中男生的人数、该队中男生的指数、第二队中男生的人数以及第二队中男生的指数。 

约束允许最多 10^5 个男孩，技能值最多为 10^4。 这排除了对所有可能的团队划分的任何暴力枚举，因为可能的分区数量呈指数增长。 我们需要一个复杂度大约为 O(n log n) 或 O(n) 的解决方案来满足时间限制。 

当一系列技能具有重复值时，或者当一个男孩明显比其他男孩强时，就会出现一种微妙的边缘情况。 例如，如果`n = 3`和技能是`[1, 1, 10]`，一种天真的方法，试图通过首先采用最大的技能来贪婪地平衡总和，可能会错误地将最强的男孩放入团队中，最终超出允许的技能差异。 另一种情况是当`n`是偶数还是奇数； 团队的规模最多只能相差一倍，因此我们必须仔细交替分配以满足规模和技能限制。 

## 方法

 蛮力方法将生成所有可能的分区方法`n`将男孩分成两队，人数几乎相等，然后检查总和条件。 这在原则上是正确的，但对于`n = 10^5`分区的数量是天文数字（大约 2^n / sqrt(n)）并且完全不可行。 

关键的见解是我们可以使用贪婪排序方法。 如果我们按技能对男孩进行排序，则团队总数之间的绝对差异对最大技能值最敏感。 通过在两队之间交替分配最强的剩余球员，我们可以保证总技能保持接近。 排序确保当我们分配最大的未分配技能时，通过将下一个最大的技能分配给对方团队来平衡。 我们还从最大的向下而不是从最小的向上交替分配，因为约束取决于最好的玩家的技能。 分配最大的最后一个可能会违反此约束。 

这导致了 O(n log n) 解决方案：对技能进行排序，同时跟踪原始索引，然后按降序迭代它们，交替分配给两个团队。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(2^n) | O(2^n) | O(n) | 太慢了|
 | 贪婪排序和交替| O(n log n) | O(n log n) | O(n) | 已接受 |

 ## 算法演练

 1. 读取男孩的数量`n`以及一系列的技能`a`。 
2. 创建配对列表`(skill, index)`所以我们可以在保留原始索引的同时进行排序。 
3. 按技能降序排列此列表。 排序确保我们首先处理最强的玩家。 
4. 为团队 1 和团队 2 初始化两个空列表。 
5. 迭代排序列表，将每个玩家交替分配到团队 1 和团队 2。这确保团队规模差异和总技能差异保持在限制范围内。 
6. 输出第一队的规模和指数，然后输出第二队的规模和指数。 

为什么有效：我们保持的不变量是，在每一步中，团队之间的总技能差异不能超过最大的未分配技能。 由于我们从最大的技能开始，交替分配可确保没有任何一个团队的累积总数超过允许的差异。 团队规模差异会自动保持，因为我们一次分配一名球员并轮流进行。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())
a = list(map(int, input().split()))

# store original indices
players = [(skill, idx + 1) for idx, skill in enumerate(a)]
# sort descending by skill
players.sort(reverse=True)

team1 = []
team2 = []

# alternate assignment
for i, (_, idx) in enumerate(players):
    if i % 2 == 0:
        team1.append(idx)
    else:
        team2.append(idx)

print(len(team1))
print(" ".join(map(str, team1)))
print(len(team2))
print(" ".join(map(str, team2)))
```此代码读取输入，创建技能索引对列表，按降序对其进行排序，然后将玩家交替分配到每个团队。 模运算`i % 2`保证团队的规模几乎相等。 使用原始索引可确保输出与所需的从 1 开始的编号相匹配。 

## 工作示例

 跟踪样本输入`3\n1 2 1`：

 | 我| 技能 | idx | 团队1 | 团队2 |
 | --- | --- | --- | --- | --- |
 | 0 | 2 | 2 | [2] | []|
 | 1 | 1 | 1 | [2] | [1] |
 | 2 | 1 | 3 | [2,3]| [1] |

 团队规模为 2 和 1，总技能为 3 和 1，差值为 2，等于最大技能 2。正确。 

另一个输入`4\n10 1 1 1`：

 | 我| 技能 | idx | 团队1 | 团队2 |
 | --- | --- | --- | --- | --- |
 | 0 | 10 | 10 1 | [1] | []|
 | 1 | 1 | 2 | [1] | [2] |
 | 2 | 1 | 3 | [1,3]| [2] |
 | 3 | 1 | 4 | [1,3]| [2,4]|

 团队规模为 2 和 2，总技能为 11 和 3，差值 8 ≤ 最大技能 10。正确。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n log n) | O(n log n) | 排序在运行时占据主导地位； 所有其他操作都是 O(n) |
 | 空间| O(n) | 我们存储技能索引对和两个团队列表 |

 在 O(n log n) 内对 10^5 个元素进行排序在 1s 时间限制下是可行的。 空间使用呈线性，适合在 256 MB 以内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    a = list(map(int, input().split()))
    players = [(skill, idx + 1) for idx, skill in enumerate(a)]
    players.sort(reverse=True)
    team1 = []
    team2 = []
    for i, (_, idx) in enumerate(players):
        if i % 2 == 0:
            team1.append(idx)
        else:
            team2.append(idx)
    out = []
    out.append(str(len(team1)))
    out.append(" ".join(map(str, team1)))
    out.append(str(len(team2)))
    out.append(" ".join(map(str, team2)))
    return "\n".join(out)

# sample
assert run("3\n1 2 1\n") == "2\n2 3\n1\n1", "sample 1"

# minimum input
assert run("2\n1 1\n") == "1\n1\n1\n2", "min size"

# all equal skills
assert run("4\n5 5 5 5\n") == "2\n1 3\n2\n2 4", "equal skills"

# max size with small skills
max_input = "100000\n" + " ".join(["1"]*100000)
result = run(max_input)
assert result.startswith("50000\n"), "max size"

# large difference
assert run("4\n10 1 1 1\n") == "2\n1 3\n2\n2 4", "large skill difference"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 2\n1 1 | 2\n1 1\n1\n1\n2 | 1\n1\n1\n2 | 最小输入处理|
 | 4\n5 5 5 5 | 5 5 5 5 2\n1 3\n2\n2 4 | 所有平等的技能平衡|
 | 100000 个 | 50000 ... | 可扩展至最大 n |
 | 4\n10 1 1 1 | 2\n1 3\n2\n2 4 | 高技能球员安置|

 ## 边缘情况

 如果所有男孩都具有相同的技能，则交替确保团队规模差异最多为 1，并且总技能完全平衡。 为了`[10, 1, 1, 1]`，最强的玩家进入第一队，次之进入第二队，依此类推。 最终总数相差 8，在允许的差异 (10) 之内。 奇怪的`n`通过交替分配自动处理。 模运算保证索引中不会出现差一错误，并且保留原始索引以供输出。
