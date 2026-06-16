---
title: "CF 107B - 篮球队"
description: "我们有一所拥有多个系的大学。 每个部门都贡献一定数量的篮球运动员。 Herr Wafa 属于 h 部门，他已经保证能在决赛队伍中占有一席之地。 该队必须恰好包含 n 名球员，包括瓦法本人。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "combinatorics", "dp", "math", "probabilities"]
categories: ["algorithms"]
codeforces_contest: 107
codeforces_index: "B"
codeforces_contest_name: "Codeforces Beta Round 83 (Div. 1 Only)"
rating: 1600
weight: 107
solve_time_s: 142
verified: true
draft: false
---

[CF 107B - 篮球队](https://codeforces.com/problemset/problem/107/B)

 **评分：** 1600
 **标签：** 组合数学、dp、数学、概率
 **求解时间：** 2m 22s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一所拥有多个系的大学。 每个部门都贡献一定数量的篮球运动员。 Herr Wafa 所属部门`h`，并且他已经保证在决赛队伍中占有一席之地。 

团队必须准确包含`n`包括瓦法本人在内的球员。 每个包含 Wafa 的有效团队都有相同的可能性。 我们需要瓦法的至少一名队友也来自他的部门的概率。 

假设部门`h`包含`s[h]`总共包括瓦法在内的球员。 然后还有`s[h] - 1`他所在部门的其他球员可以成为他的队友。 

可用玩家总数是所有玩家的总和`s[i]`。 如果这个总数小于`n`，组建一个完整的团队是不可能的，所以答案是`-1`。 

约束足够小，组合计算是可行的。 部门数量可以达到1000个，每个部门规模可以达到100人，所以玩家总数最多为`100000`。 我们无法枚举所有可能的团队，因为组合的数量呈指数级增长。 即使从 1000 名球员中选择 50 名，也已经产生了天文数字般的多种可能性。 

关键的观察是我们只需要一个概率，而不是实际的团队。 这强烈建议以数学方式计算组合。 

有几种边缘情况可能会悄悄地破坏幼稚的实现。 

考虑这个输入：```
5 2 1
2 2
```大学只有 4 名球员，但团队规模为 5 人。正确的输出是：```
-1
```粗心的实现可能仍会尝试计算具有无效参数的组合。 

当 Wafa 是他部门中唯一的球员时，另一个棘手的情况出现了：```
3 3 2
5 1 5
```玩家总数足够，但没有可能是第 2 部门的队友。正确的概率是：```
0
```某些实现错误地除以零或假设每个部门至少贡献两名玩家。 

当必须选择整个大学时，会发生第三种微妙的情况：```
4 2 1
2 2
```必须选择所有四名球员。 由于第 1 部门有包括 Wafa 在内的两名球员，所以答案是：```
1
```如果不小心编写，基于迭代概率的浮点近似可能会累积错误。 

## 方法

 蛮力的想法很简单。 由于Wafa总是被选中的，所以我们只需要选择剩下的`n - 1`来自其他所有人的玩家。 我们可以枚举每个可能的大小子集`n - 1`，检查是否至少有一名选定的球员来自 Wafa 部门，并统计有多少个子集满足条件。 

这在概念上是有效的，因为包含 Wafa 的每个有效团队都有相同的可能性。 概率很简单：$$\frac{\text{favorable teams}}{\text{all teams}}$$问题是子集的数量。 如果有10万左右的玩家，我们甚至必须选择其中的50个，那么组合的数量是巨大的。 穷尽列举是完全不可能的。 

重要的观察是我们不需要明确地生成团队。 我们只需要计算它们。 

修复团队中的Wafa后，有：$$\text{total players} - 1$$剩下的候选人，我们选择：$$n - 1$$其中。 

与其直接计算有利球队，不如计算补充事件更容易。 

糟糕的是瓦法的队友都不是他部门的。 自部门以来`h`有`s[h] - 1`除了Wafa之外的其他玩家，我们必须全部避开。 

剩下：$$(\text{total players} - 1) - (s[h] - 1)$$本部门以外的合格球员。 

不良事件发生的概率变为：$$\frac{\binom{\text{outside}}{n-1}} {\binom{\text{total}-1}{n-1}}$$那么所需的答案是：$$1 - \text{bad probability}$$这将问题从指数枚举转化为一些组合计算。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 指数| 指数| 太慢了 |
 | 最佳| O(n) 或 O(1) 组合 | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 阅读`n`,`m`， 和`h`。 
2. 读取部门规模数组`s`。 
3. 计算玩家总数：$$total = \sum s[i]$$4. 如果`total < n`， 打印`-1`。 

组建一支有效的团队是不可能的，因为大学里没有足够的球员。 
5.设：$$own = s[h-1]$$这是瓦法部门的玩家人数，包括瓦法本人。 
6. 计算Wafa队友的选择方式总数：$$\binom{total-1}{n-1}$$我们减去一是因为瓦法已经固定在队伍中了。 
7. 计算没有队友来自 Wafa 部门的坏球队的数量。 

有：$$total - own$$其部门之外的球员，因此计数为：$$\binom{total-own}{n-1}$$8. 坏的概率是：$$\frac{\binom{total-own}{n-1}} {\binom{total-1}{n-1}}$$9. 打印：$$1 - \text{bad probability}$$### 为什么它有效

 每个包含 Wafa 的队伍都有相同的可能性，因此概率降低为计算组合。 

分母计算所有可能的队友选择。 补集事件的分子精确地计算每个队友都来自另一个部门的那些选择。 由于这两个集合将所有可能性划分为“好”和“坏”，因此从 1 减去坏概率就得到了所需的答案。 

该算法不会过多计数或遗漏案例，因为每个团队恰好对应于一个子集`n - 1`队友。 

## Python 解决方案```python
import sys
from math import comb

input = sys.stdin.readline

def solve():
    n, m, h = map(int, input().split())
    s = list(map(int, input().split()))

    total = sum(s)

    if total < n:
        print(-1)
        return

    own = s[h - 1]

    total_ways = comb(total - 1, n - 1)
    bad_ways = comb(total - own, n - 1)

    ans = 1.0 - (bad_ways / total_ways)

    print(ans)

solve()
```第一部分读取输入并计算玩家总数。 

在任何组合计算之前必须处理不可能的情况。 如果`total < n`，组合如`C(3, 5)`将无效。 

表达式`comb(total - 1, n - 1)`计算所有可能的队友集合，因为 Wafa 本人已经固定在团队中。 

表达式`comb(total - own, n - 1)`是微妙的。 我们从 Wafa 部门中删除了所有玩家，包括该部门的其他成员。 由于 Wafa 已经单独修复，因此只有该部门之外的玩家才有资格参与不良事件。 

最终答案使用浮点除法。 Python 整数可以安全地处理任意大的组合值，因此不存在溢出风险。 

索引`s[h - 1]`很容易出错，因为部门是从 1 开始编号的，而 Python 列表是从 0 开始索引的。 

## 工作示例

 ### 示例 1

 输入：```
3 2 1
2 1
```共有 3 名玩家。 Wafa 部门有 2 名队员。 

| 变量| 价值|
 | ---| ---|
 | 总计 | 3 |
 | 拥有| 2 |
 | 总计 - 1 | 2 |
 | n - 1 | n - 1 2 |
 | 总方式 | C(2,2) = 1 |
 | 坏方法| C(1,2) = 0 | C(1,2) = 0
 | 答案| 1 - 0/1 = 1 |

 所有球员都必须经过挑选，因此瓦法部门的第二名球员肯定会出现在球队中。 

### 示例 2

 输入：```
2 3 1
2 1 1
```瓦法需要一名队友。 

| 变量| 价值|
 | ---| --- |
 | 总计 | 4 |
 | 拥有| 2 |
 | 总计 - 1 | 3 |
 | n - 1 | n - 1 1 |
 | 总方式 | C(3,1) = 3 | C(3,1) = 3
 | 坏方法| C(2,1) = 2 |
 | 答案| 1 - 2/3 = 1/3 | 1 - 2/3 = 1/3 |

 一共有三个可能的队友。 只有一个属于 Wafa 部门，所以概率为`1/3`。 

该跟踪证实对补体事件进行计数与直接推理相符。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | 有效 O(1) | 只有一些组合计算 |
 | 空间| O(1) | O(1) | 使用恒定数量的变量 |

 该解决方案很容易满足限制。 Python 的内置`math.comb`可以有效地处理大型组合，并且无论部门数量有多少，该算法都只执行恒定数量的操作。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from math import comb

def solve():
    input = sys.stdin.readline

    n, m, h = map(int, input().split())
    s = list(map(int, input().split()))

    total = sum(s)

    if total < n:
        print(-1)
        return

    own = s[h - 1]

    total_ways = comb(total - 1, n - 1)
    bad_ways = comb(total - own, n - 1)

    ans = 1.0 - (bad_ways / total_ways)

    print(ans)

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    out = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("3 2 1\n2 1\n") == "1.0", "sample 1"

# impossible case
assert run("5 2 1\n2 2\n") == "-1", "not enough players"

# Wafa alone in department
assert run("3 3 2\n5 1 5\n") == "0.0", "no teammate possible"

# all players selected
assert run("4 2 1\n2 2\n") == "1.0", "forced inclusion"

# symmetric departments
res = float(run("3 3 1\n2 2 2\n"))
assert abs(res - 0.4) < 1e-9, "probability check"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`5 2 1 / 2 2`|`-1`| 不可能的团队组建|
 |`3 3 2 / 5 1 5`|`0.0`| Wafa没有部门队友|
 |`4 2 1 / 2 2`|`1.0`| 必须选择整个大学 |
 |`3 3 1 / 2 2 2`|`0.4`| 一般组合概率 |

 ## 边缘情况

 考虑不可能的情况：```
5 2 1
2 2
```玩家总数只有 4 人，但团队规模为 5 人。算法检查`total < n`立即并打印`-1`。 不评估组合公式，因此可以安全地避免无效状态。 

现在考虑一下 Wafa 独自一人在他的部门中的情况：```
3 3 2
5 1 5
```这里`own = 1`。 这意味着他所在部门的额外球员为零。 

该算法计算：$$\binom{10-1}{2} = \binom{9}{2}$$对于所有可能的队友选择，以及：$$\binom{10-1}{2} = \binom{9}{2}$$再次是因为选择不当，因为每个可能的队友都不在他的部门之外。 结果概率变为：$$1 - 1 = 0$$这是正确的。 

最后，考虑强制选择的情况：```
4 2 1
2 2
```团队规模等于玩家总数。 每个球员都必须被选择。 

该算法计算：$$\binom{3}{3} = 1$$团队总人数，以及：$$\binom{2}{3} = 0$$糟糕的球队。 由于不存在糟糕的团队，所以答案恰好是`1`。
