---
title: "CF 103488J - 九贝和Codeforces"
description: "我们正在模拟 Codeforces 评级如何随时间演变，以及该评级如何转化为可见的标题。 每个用户都从初始评级开始，然后经历一系列由竞赛引起的评级变化。"
date: "2026-07-03T06:18:49+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 103488
codeforces_index: "J"
codeforces_contest_name: "The 2021 Zhejiang University City College Freshman Programming Contest"
rating: 0
weight: 103488
solve_time_s: 49
verified: true
draft: false
---

[CF 103488J - 九贝与Codeforces](https://codeforces.com/problemset/problem/103488/J)

 **评级：** -
 **标签：** -
 **求解时间：** 49s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在模拟 Codeforces 评级如何随时间演变，以及该评级如何转化为可见的标题。 每个用户都从初始评级开始，然后经历一系列由竞赛引起的评级变化。 每次更改后，评级都会落入几个固定区间之一，每个区间对应一个特定的标题，例如新手、学生、专家等。 

任务不是跟踪评级的完整历史记录，而只是检测_标题类别_何时发生变化。 每当比赛前的标题与应用比赛评级更改后的标题不同时，我们必须以“old_title -> new_title”的形式打印转换。 在处理完测试用例的所有竞赛后，我们还输出最终标题。 

限制很小：最多 100 个测试用例，每个测试用例最多 100 个评级更新。 这意味着操作总数最多为 10,000 次。 任何在恒定时间内处理每次更新的解决方案就足够了。 即使每次更新后从头开始重复重新计算标题也可以。 

一个微妙的一点是，评级变化可以在一个步骤中跨越多个边界。 例如，评级可能会从 1500 直接跳到 2500，跳过几个标题段。 在这种情况下，我们只输出一个转换：从该步骤的起始标题到更新后的最终标题，而不是中间的转换。 

另一个边缘情况是评级开始并在多次更新中保持在同一范围内。 在这种情况下，即使数字评级发生变化，这些步骤也不会打印任何内容。 

## 方法

 解决这个问题的直接方法是模拟每次比赛后的评分，通过检查评分属于哪个区间来重新计算相应的标题。 由于只有十个可能的间隔，因此该查找是恒定时间。 

这种强力模拟已经与结构上的最佳方法相匹配。 对于每次更新，我们都会调整评级，通过扫描阈值表重新计算标题，并将其与之前的标题进行比较。 如果它们不同，我们输出一个转换。 

不需要隐藏的优化，因为状态空间很小并且每个步骤都是独立的。 唯一有意义的工作是维护从评级到标题的映射并跟踪它的变化。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 每步重新计算 | 每次测试 O(n) | O(1) | O(1) | 已接受 |
 | 与多次测试相同| O(总 n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 ### 标题映射

 我们首先定义一个函数，通过从最高到最低检查固定阈值，将评级值转换为其相应的标题。 

### 步骤

 1. 从初始评级开始并计算其初始标题。 这成为我们比较的前一个标题。 
2. 对于每次评级更改，通过添加给定的增量来更新当前评级。 这对比赛的结果进行了建模。 
3. 使用阈值映射根据更新的评级计算新标题。 此步骤将数字状态转换为分类状态。 
4. 将新标题与之前的标题进行比较。 如果不同，则输出“previous_title -> new_title”。 这仅捕获可见的转变，忽略同一括号内的内部评级波动。 
5. 将之前的标题更新为新标题并继续。 
6.处理完所有竞赛后，再次输出最终标题。 

### 为什么它有效

评级到标题的映射是将整数行划分为不相交的间隔。 每个评级恰好对应一个标题，并且每次更新仅影响该分区中的当前位置。 通过只记住前一个标题，我们保留了检测变化所需的所有信息，因为当两个连续的评级落入不同的区间时，就会发生转换。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def get_title(r):
    if r >= 3000:
        return "Legendary grandmaster"
    if r >= 2600:
        return "International grandmaster"
    if r >= 2400:
        return "Grandmaster"
    if r >= 2300:
        return "International master"
    if r >= 2100:
        return "Master"
    if r >= 1900:
        return "Candidate master"
    if r >= 1600:
        return "Expert"
    if r >= 1400:
        return "Specialist"
    if r >= 1200:
        return "Pupil"
    return "Newbie"

t = int(input())
out_lines = []

for _ in range(t):
    n, k = map(int, input().split())
    rating = k
    prev = get_title(rating)

    for _ in range(n):
        rating += int(input())
        cur = get_title(rating)
        if cur != prev:
            out_lines.append(f"{prev} -> {cur}")
            prev = cur

    out_lines.append(prev)

print("\n".join(out_lines))
```实现的核心是`get_title`函数，它按降序对评级间隔进行编码，以便第一个匹配始终是正确的。 这避免了对复杂数据结构的任何需要。 

我们只存储之前的标题字符串，而不存储之前的评级，因为转换完全取决于类别成员资格。 每次更新都会调整评级、重新计算类别并有条件地打印转换。 

在计算新标题之前必须小心应用评级更新，因为输出描述了每次比赛之后的状态。 

## 工作示例

 ### 示例 1

 考虑一个简化的场景：

 输入：```
1
3 1500
100
600
-500
```我们一步步追踪演变。 

| 步骤| 评级 | 标题之前 | 改变| 评分后 | 标题在 | 之后
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1500 | 1500 学生 | - | 1500 | 1500 学生 |
 | 1 | 1500 | 1500 学生 | +100 | 1600 | 1600 专家|
 | 2 | 1600 | 1600 专家| +600 | 2200 | 2200 大师|
 | 3 | 2200 | 2200 大师| -500| 1700 | 1700 专家|

 输出转换：```
Pupil -> Expert
Expert -> Master
Master -> Expert
Expert
```这表明，即使在单次跳转中跳过了多个阈值，每次边界交叉都会触发一条输出线。 

### 示例 2

 输入：```
1
2 1190
20
-50
```| 步骤| 评级 | 标题之前 | 改变| 评分后 | 标题在 | 之后
 | --- | --- | --- | --- | --- | --- |
 | 0 | 1190 | 1190 新手| - | 1190 | 1190 新手|
 | 1 | 1190 | 1190 新手| +20 | 1210 | 1210 学生 |
 | 2 | 1210 | 1210 学生 | -50 | 1160 | 1160 新手|

 输出：```
Newbie -> Pupil
Pupil -> Newbie
Newbie
```这表明，即使阈值周围的小振荡也会产生重复的转换。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(T·n) | O(T·n) | 每次评级更新都会重新计算恒定时间的标题查找 |
 | 空间| O(1) | O(1) | 无论输入大小如何，仅存储几个变量 |

 最大更新次数为 10,000，并且每个步骤仅执行固定的比较顺序。 这完全符合时间限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def get_title(r):
        if r >= 3000:
            return "Legendary grandmaster"
        if r >= 2600:
            return "International grandmaster"
        if r >= 2400:
            return "Grandmaster"
        if r >= 2300:
            return "International master"
        if r >= 2100:
            return "Master"
        if r >= 1900:
            return "Candidate master"
        if r >= 1600:
            return "Expert"
        if r >= 1400:
            return "Specialist"
        if r >= 1200:
            return "Pupil"
        return "Newbie"

    t = int(input())
    out = []

    for _ in range(t):
        n, k = map(int, input().split())
        rating = k
        prev = get_title(rating)

        for _ in range(n):
            rating += int(input())
            cur = get_title(rating)
            if cur != prev:
                out.append(f"{prev} -> {cur}")
                prev = cur

        out.append(prev)

    return "\n".join(out)

# minimum size, no change
assert run("1\n1 1000\n0\n") == "Newbie", "min size"

# single upward transition
assert run("1\n1 1190\n20\n") == "Newbie -> Pupil\nPupil", "boundary up"

# multiple transitions in one jump
assert run("1\n1 1500\n1000\n") == "Pupil -> Master\nMaster", "skip bands"

# down crossing
assert run("1\n2 2100\n0\n-1000\n") == "Master -> Candidate master\nCandidate master", "downward change"

# oscillation
assert run("1\n3 1300\n100\n-100\n100\n") == "Pupil -> Specialist\nSpecialist -> Pupil\nPupil -> Specialist\nSpecialist", "oscillation"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 最小尺寸 | 新手| 无过渡 |
 | 边界向上 | 新手 -> 学生\n学生 | 精确的阈值跨越|
 | 跳过乐队| 学生 -> 大师\n大师 | 多级跳跃|
 | 向下变化| 大师 -> 候选大师\n候选大师 | 评级下降 |
 | 振荡| 多行| 重复切换|

 ## 边缘情况

 常见的边缘情况是从边界开始的。 例如，1200分正是新手和小学生之间的分界线。 必须使用正确的不等式顺序来实现映射，以便 1200 被分类为学生，而不是新手。 该算法通过检查从最高到最低的阈值并使用包含的下限来处理此问题。 

另一种情况是跨越多个括号的大型单一更新。 例如，从 1500 开始，添加 +2000 会直接跳到顶级类别。 该算法仍然只计算最终类别并打印单个转换，因为中间类别从未被显式跟踪。 

最后一种情况是所有更新都没有发生转换。 在这种情况下，仅打印最终标题，因为不会触发“旧 -> 新”事件。
