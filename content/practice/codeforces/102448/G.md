---
title: "CF 102448G - 华丽的彼得的好朋友"
description: "我们需要从全局提交流中计算每个候选人的分数。 彼得选择了一组问题，每个选择的问题都有一个固定的分数。 当候选人提交的问题得到结论 AC 时，他们就获得了该问题的分数。"
date: "2026-08-08T12:19:45+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102448
codeforces_index: "G"
codeforces_contest_name: "UFPE Starters Final Try-Outs 2020"
rating: 0
weight: 102448
solve_time_s: 742
verified: true
draft: false
---

[CF 102448G - 华丽的彼得的好朋友](https://codeforces.com/problemset/problem/102448/G)

 **评级：** -
 **标签：** -
 **求解时间：** 12m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们需要从全局提交流中计算每个候选人的分数。 彼得选择了一组问题，每个选择的问题都有一个固定的分数。 当候选人提交的问题得到裁决时，他们就获得了该问题的分数`AC`。 

输入首先给出候选句柄。 然后它会给出所选问题的 ID 及其分数。 最后，它给出了任意用户的提交内容。 提交内容包含用户句柄、问题 ID 和结论。 有些提交的内容可能属于非候选人的用户，有些可能涉及彼得未选择的问题。 两者都不会影响考生的分数。 

对于每个候选者，输出必须保留原始候选者顺序并包含其句柄，后跟他们解决的所有选定问题的分数总和。 

关键限制是最多可以有 50,000 个候选者、50,000 个选定的问题和 50,000 个提交。 检查每个候选人的每一份提交的解决方案将执行多达

 [
 50,000 × 50,000 = 2.5 × 10^9
 ]

 检查。 这远远超出了1秒的时间限制所能容纳的范围。 我们需要一种输入大小接近线性的方法。 由于所有句柄和问题 ID 最多有 20 个字符，因此使用哈希表直接查找也是实用的。 

在某些情况下，粗心的实施可能会默默地产生错误的答案。 首先，一个`AC`非候选人的贡献不得对任何人的分数做出贡献。 例如：```
1 1 1
alice
p1 100
bob p1 AC
```正确的输出是：```
alice 0
```仅按问题累积分数的解决方案会错误地给 Alice 100。 

其次，即使候选者解决了未选择的问题，也必须忽略该问题：```
1 1 1
alice
p1 100
alice p2 AC
```正确的输出是：```
alice 0
```粗心的实施可能会为每个`AC`提交而不是检查问题是否属于选定的集合。 

第三，提交错误不得影响成绩。 考虑：```
1 1 2
alice
p1 100
alice p1 WA
alice p1 AC
```正确的输出是：```
alice 100
```只有`AC`提交事宜。 较早的`WA`应该没有影响。 

最后，候选人在解决问题之前可能会提交多次错误的意见。 在处理这些尝试时，我们不得添加问题分数。 保证用户收到后不再提交同样的问题`AC`意味着一旦`AC`看来，该用户-问题对以后不会再产生另一个提交。 因此，当`AC`无需单独的防重复结构即可遇到。 

## 方法

 最直接的解决方案是独立处理每个候选人。 对于一名候选人，扫描所有提交内容并查找该用户是该候选人的记录，结论是`AC`，该问题是选定的问题之一。 每当发现这样的提交时，添加相应的问题分数。 

这种方法是正确的，因为候选人获得分数的每一种可能的方式都会被明确地检查。 但是，它会对每个候选人重复相同的提交扫描。 拥有 50,000 名候选者和 50,000 份提交内容，最坏的情况是 25 亿次候选者提交内容比较。 即使每次比较都非常便宜，但对于时间限制来说，工作量太大了。 

更好的观点是对每个提交只处理一次。 提交的内容已经告诉我们用户、问题和结论，因此没有理由重复搜索相关候选人。 我们可以构建一个哈希表，将每个候选句柄映射到其在输出中的位置，并构建另一个哈希表，将每个选定的问题 ID 映射到其分数。 

然后提交的判决除`AC`可以立即忽略。 对于一个`AC`，我们在候选表中查找其用户，并在选定问题表中查找其问题。 如果两者都存在，则该单一提交会直接确定应增加分数的候选人以及要增加的金额。 

蛮力方法之所以有效，是因为它最终会检查每个候选人的所有相关提交，但它会失败，因为它会重复工作。 观察到每次提交最多独立识别一个候选者和一个选定的问题，这让我们可以将问题转化为每次提交的恒定时间哈希表查找。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(CS) | O(P + C) | 太慢了 |
 | 最佳 | 预期 O(C + P + S) | O(C + P) | 已接受 |

 ## 算法演练

 1. 阅读考生人数、选定问题和提交内容。 将每个候选句柄及其在输出数组中的位置存储在字典中。 该位置很有用，因为无论提交的处理顺序如何，最终输出都必须使用与输入相同的顺序。 
2. 阅读每个选定的问题及其分数。 将这对存储在字典中，其中问题 ID 是键，分数是值。 这会将通过扫描所有选定问题来查找问题分数转换为预期的恒定时间查找。 
3. 创建一个数组`C`零。 入口`i`代表句柄出现在该位置的考生的累计分数`i`。 
4. 对每个提交处理一次。 如果其判决不`AC`，跳过它，因为它不能增加任何分数。 
5. 对于一个`AC`提交后，在候选字典中查找提交用户的句柄。 如果句柄不存在，则提交属于非候选者，因此不会影响答案。 
6. 如果用户是候选人，则在所选问题字典中查找提交的问题。 如果不存在，则该问题未被选择，因此没有任何贡献。 
7. 如果两次查找都成功，则将所选问题的分数添加到考生的累积分数中。 关于提交后的保证`AC`意味着同一用户以后无法收到该问题的另一次提交，因此分数仅添加一次。 
8. 处理完所有提交后，迭代原始候选列表并打印每个句柄及其累积分数。 保持句柄按输入顺序可保证输出顺序正确。 

不变的是，在处理提交列表的任何前缀后，每个候选人存储的分数等于该候选人已经收到的每个选定问题的总分`AC`在该前缀内。 一个非`AC`提交不能改变不变量。 一个`AC`来自非候选或未选择的问题也无法做出贡献。 对于一个`AC`从候选人对选定问题的评分中，该候选人的分数将增加该问题的分数。 因此，每次提交后，不变式仍然成立，并且在最终提交后，它准确地给出了所需的答案。 

## Python 解决方案```python
import sys

input = sys.stdin.readline

def solve():
    C, P, S = map(int, input().split())

    candidates = []
    candidate_index = {}

    for i in range(C):
        handle = input().strip()
        candidates.append(handle)
        candidate_index[handle] = i

    problem_score = {}

    for _ in range(P):
        problem, score = input().split()
        problem_score[problem] = int(score)

    answer = [0] * C

    for _ in range(S):
        user, problem, verdict = input().split()

        if verdict != "AC":
            continue

        idx = candidate_index.get(user)
        if idx is None:
            continue

        score = problem_score.get(problem)
        if score is None:
            continue

        answer[idx] += score

    output = []
    for i in range(C):
        output.append(f"{candidates[i]} {answer[i]}")

    sys.stdout.write("\n".join(output))

if __name__ == "__main__":
    solve()
```这`candidates`list 保留确切的输入顺序，而`candidate_index`提供快速访问相应分数位置。 例如，如果`beza`是第二位候选人，`candidate_index["beza"]`是`1`，所以每个合格的提交`beza`更新`answer[1]`。 

这`problem_score`字典对于问题也起着同样的作用。 我们不需要单独存储选定的问题，因为键的存在已经告诉我们该问题已被选择，而它的值给出了分数。 

在任一字典查找之前都会检查判决。 对于渐近复杂性来说，这不是必需的，但它避免了对潜在大量未完成的提交进行不必要的工作。`AC`。 

使用`.get()`允许我们在不引发异常的情况下区分丢失的用户或问题。 分数严格为正，所以`None`不能与有效分数混淆。 

Python 整数自动处理任意大的值。 尽管每个单独的分数最多为 20,000，但当解决许多选定的问题时，总分可以达到大约 10 亿，这仍然可以通过 Python 整数安全地处理。 

不存在差一计算，因为候选位置是使用从零开始的索引直接存储的。 然后输出循环访问完全相同的位置。 

## 工作示例

 ### 示例 1

 候选人是`GabrielPessoa`和`beza`。 选定的问题是`metebronca`，价值 100，并且`geometry`，价值200。 

| 提交 | 判决 | 候选人查找| 问题查找 | 提交后分数 |
 | ---| ---| ---| ---| ---|
 |`beza metebronca AC`| 交流|`beza -> 1`|`metebronca -> 100`| 加布里埃尔·佩索阿 = 0，贝扎 = 100 |
 |`ffern numbertheory AC`| 交流| 缺席| 不需要| 加布里埃尔·佩索阿 = 0，贝扎 = 100 |
 |`GabrielPessoa geometry WA`| 西澳 | 不需要| 不需要| 加布里埃尔·佩索阿 = 0，贝扎 = 100 |
 |`beza geometry AC`| 交流|`beza -> 1`|`geometry -> 200`| 加布里埃尔·佩索阿 = 0，贝扎 = 300 |

 第二次提交的内容是`AC`， 但`ffern`不是候选者，因此被丢弃。 第三次提交来自候选人，涉及选定的问题，但其结论是`WA`，因此也被丢弃。 成功解决的两个选定问题`beza`贡献100和200，给予300。 

最终输出是：```
GabrielPessoa 0
beza 300
```### 构造示例 2

 考虑：```
3 2 5
alice
bob
carol
p1 50
p2 100
alice p1 WA
bob p3 AC
carol p2 AC
alice p1 AC
bob p1 AC
```踪迹是：

 | 提交 | 判决 | 候选人 | 选定的问题 | 提交后分数 |
 | ---| ---| ---| ---| ---|
 |`alice p1 WA`| 西澳 | 未处理| 未处理| 爱丽丝 = 0，鲍勃 = 0，卡罗尔 = 0 |
 |`bob p3 AC`| 交流|`bob`发现 |`p3`缺席| 爱丽丝 = 0，鲍勃 = 0，卡罗尔 = 0 |
 |`carol p2 AC`| 交流|`carol`发现 |`p2 -> 100`| 爱丽丝 = 0，鲍勃 = 0，卡罗尔 = 100 |
 |`alice p1 AC`| 交流|`alice`发现 |`p1 -> 50`| 爱丽丝 = 50，鲍勃 = 0，卡罗尔 = 100 |
 |`bob p1 AC`| 交流|`bob`发现 |`p1 -> 50`| 爱丽丝 = 50，鲍勃 = 50，卡罗尔 = 100 |

 最终输出是：```
alice 50
bob 50
carol 100
```此示例使用了三种不同的过滤器。 这`WA`被忽略，则`AC`未选定时`p3`被忽略，并且成功提交所选问题会准确更新相应的候选。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | 预期 O(C + P + S) | 每个候选者、问题和提交都被处理一次，预计为 O(1) 哈希表操作 |
 | 空间| O(C + P) | 候选字典、问题字典、候选列表和答案数组均按线性比例缩放 |

 三个主要部分的最大输入仅包含 150,000 条记录。 该算法对每次提交执行恒定数量的字典操作，因此与暴力方法所需的 25 亿次操作相比，其预期运行时间很容易满足 1 秒的限制。 字典和数组存储最多与 100,000 个候选和选定问题成比例的信息，大小在 256 MB 以内。 

## 测试用例

 以下测试工具实现了相同的功能`solve`函数结构并针对提供的示例和几个自定义案例运行解决方案。 最大大小的案例是以编程方式生成的，因此测试本身仍然具有可读性，同时仍然测试 50,000 个考生、50,000 个问题和 50,000 个提交。```python
import sys
import io

def solve():
    input = sys.stdin.readline

    C, P, S = map(int, input().split())

    candidates = []
    candidate_index = {}

    for i in range(C):
        handle = input().strip()
        candidates.append(handle)
        candidate_index[handle] = i

    problem_score = {}

    for _ in range(P):
        problem, score = input().split()
        problem_score[problem] = int(score)

    answer = [0] * C

    for _ in range(S):
        user, problem, verdict = input().split()

        if verdict != "AC":
            continue

        idx = candidate_index.get(user)
        if idx is None:
            continue

        score = problem_score.get(problem)
        if score is None:
            continue

        answer[idx] += score

    output = []
    for i in range(C):
        output.append(f"{candidates[i]} {answer[i]}")

    return "\n".join(output)

def run(inp: str) -> str:
    old_stdin = sys.stdin
    sys.stdin = io.StringIO(inp)
    try:
        return solve()
    finally:
        sys.stdin = old_stdin

# Provided sample.
sample1 = """\
2 2 4
GabrielPessoa
beza
metebronca 100
geometry 200
beza metebronca AC
ffern numbertheory AC
GabrielPessoa geometry WA
beza geometry AC
"""

assert run(sample1) == """\
GabrielPessoa 0
beza 300
""", "sample 1"

# Minimum-size case.
minimum = """\
1 1 1
a
p 1
a p AC
"""

assert run(minimum) == """\
a 1
""", "minimum-size case"

# All submissions are relevant, with several candidates solving
# the same selected problems.
all_equal = """\
3 2 4
a
b
c
p1 7
p2 7
a p1 AC
b p1 AC
b p2 AC
c p2 AC
"""

assert run(all_equal) == """\
a 7
b 14
c 7
""", "all-equal scores"

# Boundary behavior: WA, unknown user, and unselected problem
# must all be ignored.
filters = """\
2 1 5
alice
bob
selected 100
alice selected WA
alice other AC
unknown selected AC
bob selected AC
bob selected WA
"""

assert run(filters) == """\
alice 0
bob 100
""", "filtering irrelevant submissions"

# A candidate can have several wrong submissions before AC.
# The selected problem score must be added only for AC.
retries = """\
2 2 10
alice
bob
p1 10
p2 20
alice p1 WA
alice p1 CE
alice p1 AC
bob p1 WA
bob p2 AC
alice p2 AC
bob p3 AC
alice p2 WA
bob p1 AC
alice p1 WA
"""

assert run(retries) == """\
alice 30
bob 30
""", "multiple attempts and irrelevant problems"

# Maximum-size generated case.
C = 50000
P = 50000
S = 50000

parts = [f"{C} {P} {S}"]

for i in range(C):
    parts.append(f"u{i}")

for i in range(P):
    parts.append(f"p{i} 1")

# Each submission is a valid AC for a corresponding candidate
# and problem. Every candidate receives exactly one point.
for i in range(S):
    parts.append(f"u{i} p{i} AC")

maximum = "\n".join(parts) + "\n"

expected = "\n".join(f"u{i} 1" for i in range(C))

assert run(maximum) == expected, "maximum-size case"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 最小尺寸外壳 |`a 1`| 最小有效输入和直接成功查找 |
 | 全部比分均等 |`a 7`,`b 14`,`c 7`| 多个考生解决相同的问题且得分值重复 |
 | 过滤案例|`alice 0`,`bob 100`| 未知的用户、未选择的问题和非`AC`判决|
 | 多次尝试案例 |`alice 30`,`bob 30`| 成功提交之前的几次提交失败|
 | 最大尺寸生成案例| 每个候选人都有分数`1`| 所有三种主要输入大小和性能的最大值 |

 ## 边缘情况

 安`AC`在候选查找阶段，来自不在候选中的用户的信息将被忽略。 例如：```
1 1 1
alice
p1 100
bob p1 AC
```候选字典只包含`alice`。 什么时候`bob`被处理，`candidate_index.get("bob")`回报`None`，所以分数没有变化。 输出是：```
alice 0
```成功提交未选择的问题的处理方式类似。 考虑：```
1 1 1
alice
p1 100
alice p2 AC
```候选者查找成功，但是`problem_score.get("p2")`回报`None`因为只有`p1`被选中。 该算法丢弃提交并打印：```
alice 0
```即使用户和问题都有效，失败的提交也不能贡献任何内容。 和：```
1 1 2
alice
p1 100
alice p1 WA
alice p1 AC
```第一次提交的内容会立即被判决检查拒绝。 第二个通过了所有检查并加了 100。结果是：```
alice 100
```多次失败的尝试不会引起任何特殊处理。 为了：```
1 1 3
alice
p1 50
alice p1 WA
alice p1 CE
alice p1 AC
```前两项记录的得分为零，而最后一项记录的得分为零`AC`将其更改为 50。输出为：```
alice 50
```提交顺序无需与候选人顺序一致。 假设候选人是：```
2 1 2
alice
bob
p1 25
bob p1 AC
alice p1 AC
```第一个处理的提交更新了 Bob 的条目，即索引 1。第二个处理的提交更新了 Alice 的条目，即索引 0。因为答案数组是按原始候选位置索引的，所以最终输出仍然是：```
alice 25
bob 25
```一个问题可以由许多不同的考生来解决，并且每个考生必须独立地获得分数。 例如：```
2 1 2
alice
bob
p1 100
alice p1 AC
bob p1 AC
```第一次提交后，答案数组是`[100, 0]`。 第二次之后就变成了`[100, 100]`。 该问题已被 Alice 解决的事实并不意味着 Bob 无法使用该问题，因为该保证涉及同一用户的重复提交，而不是不同用户的提交。 

最大总分也不会在 Python 中产生整数溢出问题。 即使候选人解决​​了许多选定的问题，Python 的整数类型也会根据需要增长。 该算法从不依赖于固定宽度的整数表示。
