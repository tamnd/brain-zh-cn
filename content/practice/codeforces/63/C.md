---
title: "CF 63C - 公牛和母牛"
description: "我们正在玩经典的公牛队和奶牛队游戏，游戏中的四位数数字都是不同的。 允许使用前导零，因此 0123 有效，但重复的数字（例如 0012 或 1223）无效。 之前的每个猜测都有两个值。"
date: "2026-05-28T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation"]
categories: ["algorithms"]
codeforces_contest: 63
codeforces_index: "C"
codeforces_contest_name: "Codeforces Beta Round 59 (Div. 2)"
rating: 1700
weight: 63
solve_time_s: 108
verified: true
draft: false
---

[CF 63C - 公牛和奶牛](https://codeforces.com/problemset/problem/63/C)

 **评分：** 1700
 **标签：** 暴力破解、实施
 **求解时间：** 1m 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们正在玩经典的公牛队和奶牛队游戏，游戏中的四位数数字都是不同的。 允许使用前导零，因此`0123`有效，但重复数字，例如`0012`或者`1223`不是。 

之前的每个猜测都有两个值。 公牛意味着数字在价值和位置上都匹配。 牛表示该数字存在于隐藏数字中，但出现在不同的位置。 

任务不是模拟游戏本身。 我们必须确定前面的答案是否唯一地确定了隐藏的数字。 

存在三种可能的结果。 

如果恰好有一个有效数字满足所有猜测，我们就会打印该数字。 

如果没有有效的数字满足猜测，则答复相互矛盾，我们打印`Incorrect data`。 

如果仍然有多个有效数字，我们打印`Need more data`。 

限制非常小。 最多有 10 个猜测。 具有不同数字的四位数字可以由以下形式组成：$$10 \times 9 \times 8 \times 7 = 5040$$方式。 

这立即改变了问题的性质。 我们不需要巧妙的修剪、动态规划或搜索树。 即使将每个候选人与每个猜测进行比较也是很小的：$$5040 \times 10 = 50400$$比较。 

每次比较仅检查四个位置和最多几个数字匹配。 这完全符合时间限制。 

主要的困难不是性能，而是正确性。 如果实施不慎，公牛和奶牛很容易混淆。 

一种微妙的边缘情况是正确处理前导零。 

考虑：```
1
0123 4 0
```正确答案是：```
0123
```将所有内容转换为整数然后再转换回字符串的粗心实现可能会意外地转变`0123`进入`123`，丢失前导零。 

另一个容易犯的错误是通过重复计算公牛来错误地计算奶牛数量。 

假设隐藏数是`0123`猜测是`0124`。 

正确的结果是`3 bulls 0 cows`。 

如果我们首先计算常见数字，然后单独计算公牛而不减去它们，我们可能会错误地报告一头牛的数字`0`,`1`， 或者`2`。 

矛盾的数据是另一个重要案例。```
2
0123 4 0
0123 0 4
```没有数字可以同时满足这两个陈述。 正确的输出是：```
Incorrect data
```在找到第一个有效候选者后停止的实现将错误地打印`0123`。 

最后一个重要的情况是歧义。```
1
0123 0 0
```这仅告诉我们隐藏的数字不包含任何`0,1,2,3`。 许多有效数字仍然存在。 正确的输出是：```
Need more data
```该程序必须计算所有有效的候选者，而不仅仅是检查是否存在。 

## 方法

 最直接的解决办法就是暴力破解。 

我们生成每个有效的四位数字，其中包含不同的数字，包括带有前导零的数字。 对于每个候选人，我们都会将其与之前的每个猜测进行比较。 如果所有公牛和母牛的数量完全匹配，则该候选人仍然有可能。 

这是有效的，因为搜索空间很小。 仅有5040名候选人。 

为了比较两个数字，我们通过检查相等的头寸来计算多头。 然后我们计算两个数字中出现了多少位数字。 由于数字不同，奶牛的数量变为：$$\text{common digits} - \text{bulls}$$暴力解决方案已经足够快了。 除此之外，没有隐藏的更大的约束需要优化。 

真正的洞察力是认识到问题的大小从根本上受到游戏本身结构的限制。 十种可能性中的四个不同数字创建了一个只有 5040 个状态的固定宇宙。 一旦我们意识到这一点，详尽的检查就成为最干净、最安全的解决方案。 

更复杂的方法只会增加实施风险，而不会显着改善运行时间。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 对所有 5040 名候选人进行暴力破解 | O(5040 × n) | O(5040 × n) | O(1) | O(1) | 已接受 |
 | 优化修剪/搜索 | 不必要| 更高 | 已被接受但过于复杂 |

 ## 算法演练

 1. 阅读所有猜测以及预期的公牛和奶牛数量。 
2. 生成每个数字都不同的四位数字。 

我们将数字生成为字符串而不是整数，因此前导零会自然保留。 
3. 对于每个候选数字，将其与每个猜测进行比较。 
4. 比较两个数字：

 通过检查仓位来计算多头数量`0..3`。 

通过检查猜测中出现了多少个候选数字来计算常见数字。 

由于所有数字都是不同的，因此奶牛相等：$$\text{common digits} - \text{bulls}$$5. 如果计算出的公牛和母牛与预期值不匹配，即使是一次猜测，也立即拒绝该候选者。 

尽早拒绝可以避免不必要的工作，尽管性能已经足够了。 
6. 收集满足所有猜测的每个候选者。 
7. 检查所有候选人后：

 如果没有剩余候选人，则打印`Incorrect data`。 

如果只剩下一名候选人，请将其打印出来。 

否则打印`Need more data`。 

### 为什么它有效

 该算法对每个可能的有效隐藏数仅检查一次。 只有完美地再现每一个记录的回答，候选人才能生存。 

由于隐藏数字必须属于所有有效的四位不同数字的集合，因此穷举枚举可以保证：

 如果存在有效的解决方案，我们就会找到它。 

如果存在多个解决方案，则所有解决方案都将被计算在内。 

如果不存在，则数据是矛盾的。 

没有候选者被跳过，也没有无效的候选者能够通过一致性检查。 

## Python 解决方案```python
import sys
from itertools import permutations

input = sys.stdin.readline

def score(secret, guess):
    bulls = 0

    for i in range(4):
        if secret[i] == guess[i]:
            bulls += 1

    common = 0

    for ch in secret:
        if ch in guess:
            common += 1

    cows = common - bulls

    return bulls, cows

def solve():
    n = int(input())

    guesses = []

    for _ in range(n):
        s, b, c = input().split()
        guesses.append((s, int(b), int(c)))

    valid = []

    for p in permutations("0123456789", 4):
        candidate = "".join(p)

        ok = True

        for g, b, c in guesses:
            cb, cc = score(candidate, g)

            if cb != b or cc != c:
                ok = False
                break

        if ok:
            valid.append(candidate)

    if len(valid) == 0:
        print("Incorrect data")
    elif len(valid) == 1:
        print(valid[0])
    else:
        print("Need more data")

solve()
```这`score`函数实现了精确的 Bulls 和 Cows 规则。 多头按位置计算。 普通数字单独计算，牛减去公牛得到。 

使用字符串而不是整数可以自动避免每个前导零问题。 候选人`"0123"`在整个程序中保持恰好四个字符的长度。`itertools.permutations`在这里是完美的，因为它已经保证了不同的数字。 每个生成的元组包含四个不同的字符，选自`"0123456789"`。 

主循环根据每个猜测检查每个候选者。 一旦有一个猜测不一致，该候选人就会立即被淘汰。 

最终决定仅取决于剩余多少有效候选人。 

一个微妙的实施细节是奶牛不是独立计数的。 由于数字是唯一的，因此每个共享数字要么是公牛，要么是母牛，而不是两者兼而有之。 从共享数字总数中减去公牛可以避免意外的重复计算。 

## 工作示例

 ### 示例 1

 输入：```
2
1263 1 2
8103 2 1
```我们对候选人进行一一测试。 

假设我们评估候选人`0123`。 

| 候选人 | 猜猜看 | 公牛队 | 常用数字| 奶牛 | 预计 | 到目前为止有效 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0123| 1263 | 1263 1 | 3 | 2 | 1 公牛 2 牛 | 是的 |
 | 0123| 8103 | 8103 2 | 3 | 1 | 2 公牛 1 牛 | 是的 |`0123`幸存下来。 

现在假设另一个候选人，例如`0132`。 

| 候选人 | 猜猜看 | 公牛队 | 常用数字| 奶牛 | 预计 | 到目前为止有效 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0132| 1263 | 1263 0 | 3 | 3 | 1 公牛 2 牛 | 没有 |

 它立即被拒绝。 

检查完所有 5040 个候选后，剩下多个有效数字，因此输出为：```
Need more data
```This example demonstrates that satisfying all guesses does not necessarily determine a unique answer.

 ### 示例 2

 输入：```
2
0123 4 0
0123 0 4
```检查候选人`0123`。 

| 候选人 | 猜猜看 | 公牛队 | 常用数字| 奶牛 | 预计 | 到目前为止有效 |
 | ---| ---| ---| ---| ---| ---| ---|
 | 0123| 0123| 4 | 4 | 0 | 4 公牛 0 牛 | 是的 |
 | 0123| 0123| 4 | 4 | 0 | 0 公牛 4 牛 | 没有 |

 候选人失败了。 

其他所有候选人都已经在第一次猜测中失败了。 

没有有效的候选人存活下来。 

输出：```
Incorrect data
```这个例子展示了矛盾的回复如何消除整个搜索空间。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(5040 × n) | O(5040 × n) | 我们根据所有猜测测试每一位有效候选人 |
 | 空间| O(1) | O(1) | 除了存储猜测和有效候选者之外

 候选人的最大人数固定为5040人，并且`n ≤ 10`。 即使在最坏的情况下，比较的次数也很少。 该解决方案很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from itertools import permutations

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)

    input = sys.stdin.readline

    def score(secret, guess):
        bulls = 0

        for i in range(4):
            if secret[i] == guess[i]:
                bulls += 1

        common = 0

        for ch in secret:
            if ch in guess:
                common += 1

        cows = common - bulls

        return bulls, cows

    n = int(input())

    guesses = []

    for _ in range(n):
        s, b, c = input().split()
        guesses.append((s, int(b), int(c)))

    valid = []

    for p in permutations("0123456789", 4):
        candidate = "".join(p)

        ok = True

        for g, b, c in guesses:
            cb, cc = score(candidate, g)

            if cb != b or cc != c:
                ok = False
                break

        if ok:
            valid.append(candidate)

    if len(valid) == 0:
        return "Incorrect data"
    elif len(valid) == 1:
        return valid[0]
    else:
        return "Need more data"

# provided sample
assert run(
"""2
1263 1 2
8103 2 1
"""
) == "Need more data", "sample 1"

# unique solution with leading zero
assert run(
"""1
0123 4 0
"""
) == "0123", "leading zero handling"

# contradictory data
assert run(
"""2
0123 4 0
0123 0 4
"""
) == "Incorrect data", "contradictory guesses"

# very weak information
assert run(
"""1
0123 0 0
"""
) == "Need more data", "multiple candidates remain"

# exact full permutation clue
assert run(
"""1
0123 0 4
"""
) == "Need more data", "all digits correct but positions unknown"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`0123 4 0`|`0123`| 保留前导零 |
 | 自相矛盾的相同猜测|`Incorrect data`| 检测不可能的数据 |
 |`0123 0 0`|`Need more data`| 处理许多剩余的候选人 |
 |`0123 0 4`|`Need more data`| 正确计数公牛/母牛 |

 ## 边缘情况

 考虑前导零的情况：```
1
0123 4 0
```该算法将候选者生成为字符串，因此`"0123"`仍然恰好是四个字符长。 

当检查该候选人时：

 | 位置 | 候选人 | 猜猜看 | 比赛|
 | ---| ---| ---| ---|
 | 0 | 0 | 0 | 公牛|
 | 1 | 1 | 1 | 公牛|
 | 2 | 2 | 2 | 公牛|
 | 3 | 3 | 3 | 公牛|

 结果是`4 bulls 0 cows`，所以候选人幸存下来。 其他所有候选人都失败了。 输出变为：```
0123
```现在考虑矛盾的信息：```
2
0123 4 0
0123 0 4
```第一个猜测迫使隐藏的数字准确无误`0123`。 

第二个猜测是所有数字都是正确的，但所有位置都是错误的，这对于同一个数字来说是不可能的。 

在枚举过程中，每个候选者至少不满足一项约束。 有效候选列表保持为空，算法打印：```
Incorrect data
```最后，考虑歧义：```
1
0123 0 0
```仅使用以下数字的任何有效数字`{4,5,6,7,8,9}`满足这个条件。 

例如，`4567`给出：

 | 候选人 | 常用数字| 公牛队 | 奶牛 |
 | ---| ---| ---| ---|
 | 4567 | 4567 0 | 0 | 0 |

 许多候选人幸存下来，因此算法正确输出：```
Need more data
```
