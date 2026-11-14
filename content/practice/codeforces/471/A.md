---
title: "CF 471A - MUH 和棒"
description: "我们得到了正好六根棍子的长度。 要建造动物，必须使用四根棍子作为腿，这意味着这四根棍子必须具有相同的长度。 选择了四根腿棍后，还剩下两根腿棍。 这些决定了动物的类型。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 471
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 269 (Div. 2)"
rating: 1100
weight: 471
solve_time_s: 81
verified: true
draft: false
---

[CF 471A - MUH 和棍棒](https://codeforces.com/problemset/problem/471/A)

 **评分：** 1100
 **标签：** 实施
 **求解时间：** 1m 21s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了正好六根棍子的长度。 要建造动物，必须使用四根棍子作为腿，这意味着这四根棍子必须具有相同的长度。 

选择了四根腿棍后，还剩下两根腿棍。 这些决定了动物的类型。 

对于大象来说，剩下的两根棍子必须具有相等的长度，因为头部和身体的大小相同。 

对于熊来说，剩下的两根棍子的长度一定不同，因为头一定比身体短。 

我们的任务是确定这六根棍子是否可以形成一只熊、一头大象，或者两者都不是。 该声明保证两种动物不可能同时出现。 

限制很小。 只有六根棍子，每根长度在 1 到 9 之间。任何合理的算法都会立即运行。 挑战不在于性能，而在于当存在多个相等长度时，正确识别应选择哪四根棍子作为腿。 

一个常见的错误是只查找恰好出现四次的值。 腿只需要四根相等的棍子，因此出现五六次的值也可以提供腿。 

考虑：```
4 4 4 4 4 5
```我们可以使用 5 根长度为 4 的木棍中的 4 根作为腿。 剩下的木棍是 4 和 5，它们不同，所以答案是`Bear`。 检查“恰好出现四次”会错误地拒绝这种情况。 

当六根相同的木棍时，会发生另一种微妙的情况：```
3 3 3 3 3 3
```四根棍子变成腿，留下两根长度为 3 和 3 的棍子。由于剩余的棍子相等，所以正确答案是`Elephant`。 

第三种棘手的情况是没有长度出现至少四次时：```
1 2 3 4 5 6
```不存在四根相等的棍子，因此无法形成动物。 答案是`Alien`。 

## 方法

 蛮力的想法是在六根棍子中尝试每一种可能的选择。 只有 C(6,4) = 15 种可能性。 对于每个选择，检查所选木棍的长度是否相等。 如果有，请检查剩下的两根棍子。 剩余长度相等则为大象，剩余长度不同则为熊。 

这种方法是正确的，因为它直接测试选择腿的每一种有效方法。 只需 15 种组合，它就足够快了。 

当我们关注频率时，问题变得更加简单。 唯一重要的是某个长度是否至少出现四次。 如果不存在这样的长度，则立即给出答案`Alien`。 

一旦我们发现某个长度至少出现四次，我们就删除它的四个副本。 只剩下两根棍子了。 他们的关系完全决定了答案。 等长给出`Elephant`, 不同的长度给出`Bear`。 

这一观察消除了枚举组合的需要，并导致实现非常短。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(C(6,4)) = O(1) | O(C(6,4)) = O(1) | O(1) | O(1) | 已接受 |
 | 最佳| O(6 log 6) | O(6 log 6) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取六根棍子的长度。 
2. 计算每个长度出现的次数。 
3. 找到一个频率至少为 4 的长度。 

这样的长度可以提供所需的四个腿棒。 
4. 如果没有长度的频率至少为 4，则打印`Alien`。 

如果没有四根相等的棍子，就不可能构造出任何一种动物。 
5. 恰好删除四次出现的所选长度。 

我们正在将那四根棍子固定为腿。 
6. 收集剩下的两根木棍。 
7. 如果剩余两个长度相等，则打印`Elephant`。 

头部和身体长度相等，符合大象的定义。 
8. 否则打印`Bear`。 

不同的剩余长度符合熊的定义。 

### 为什么它有效

 对这两种动物的明确要求是存在四根等长的腿棍。 任何有效的构造都必须使用四根相同长度的木棍，因此某个长度必须至少出现四次。 

选择四根这样的棍子后，正好剩下两根棍子。 动物类型仅取决于这两根棍子。 剩余长度相等满足大象条件，剩余长度不同满足熊条件。 由于该语句保证答案是唯一的，因此以至少四次的频率检查任何长度都会产生正确的分类。 

## Python 解决方案```python
import sys
from collections import Counter

input = sys.stdin.readline

sticks = list(map(int, input().split()))
cnt = Counter(sticks)

leg_length = None

for length, freq in cnt.items():
    if freq >= 4:
        leg_length = length
        break

if leg_length is None:
    print("Alien")
else:
    remaining = []
    removed = 0

    for x in sticks:
        if x == leg_length and removed < 4:
            removed += 1
        else:
            remaining.append(x)

    if remaining[0] == remaining[1]:
        print("Elephant")
    else:
        print("Bear")
```第一部分计算每个棒长度的出现次数。 然后我们搜索至少出现四次的任何长度。 如果不存在，我们立即知道无法形成有效的一组腿。 

去除步骤值得关注。 我们只删除四个副本，而不是所有副本。 案例如`4 4 4 4 4 5`取决于保留第五根棍子。 删除所有出现的情况将仅留下一根剩余的棍子并产生不正确的结果。 

移除后，只剩下两根棍子。 比较这两个值可以直接确定动物类型。 

不需要排序，但也可以接受基于排序的解决方案。 

## 工作示例

 ### 示例 1

 输入：```
4 2 5 4 4 4
```| 步骤| 状态|
 | --- | --- |
 | 计算频率 | {4:4, 2:1, 5:1} |
 | 发现腿长| 4 |
 | 删除四个 4 | 剩余 = [2, 5] |
 | 比较剩余的木棍 | 2 ≠ 5 |
 | 输出| 熊|

 四根长度为 4 的木棍成为腿。 剩下的木棍长度不同，代表了熊的头和身体。 

### 示例 2

 输入：```
3 3 3 3 5 5
```| 步骤| 状态|
 | --- | --- |
 | 计算频率 | {3:4, 5:2} |
 | 发现腿长| 3 |
 | 删除四个 3 | 剩余 = [5, 5] |
 | 比较剩余的木棍 | 5 = 5 |
 | 输出| 大象 |

 剩下的两根棍子相等，符合大象的要求。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(1) | O(1) | 仅加工六根木棍|
 | 空间| O(1) | O(1) | 频率表最多存储九个长度 |

 输入大小固定为六个元素，因此该算法仅执行少量操作。 它很容易满足时间和内存的限制。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io
from collections import Counter

def solve():
    sticks = list(map(int, input().split()))
    cnt = Counter(sticks)

    leg_length = None

    for length, freq in cnt.items():
        if freq >= 4:
            leg_length = length
            break

    if leg_length is None:
        print("Alien")
        return

    remaining = []
    removed = 0

    for x in sticks:
        if x == leg_length and removed < 4:
            removed += 1
        else:
            remaining.append(x)

    print("Elephant" if remaining[0] == remaining[1] else "Bear")

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    global input
    input = sys.stdin.readline

    solve()

    out = sys.stdout.getvalue().strip()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return out

# provided sample
assert run("4 2 5 4 4 4\n") == "Bear", "sample 1"

# custom cases
assert run("3 3 3 3 5 5\n") == "Elephant", "equal remaining sticks"
assert run("1 2 3 4 5 6\n") == "Alien", "no four equal sticks"
assert run("4 4 4 4 4 5\n") == "Bear", "frequency greater than four"
assert run("9 9 9 9 9 9\n") == "Elephant", "all sticks equal"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`3 3 3 3 5 5`|`Elephant`| 剩余的木棍数量相同|
 |`1 2 3 4 5 6`|`Alien`| 不存在有效的腿组 |
 |`4 4 4 4 4 5`|`Bear`| 必须删除正好四个副本，而不是全部 |
 |`9 9 9 9 9 9`|`Elephant`| 所有棍子都相同|

 ## 边缘情况

 考虑：```
4 4 4 4 4 5
```4的频率是5，对于腿来说还是足够的。 该算法恰好删除了 4 的四个副本，留下`[4, 5]`。 由于剩余的棍子不同，它输出`Bear`。 任何需要频率恰好为四的解决方案在这里都会失败。 

考虑：```
3 3 3 3 3 3
```该算法选择 3 作为腿长并删除 4 个副本。 剩下的木棍是`[3, 3]`。 因为它们相等，所以输出为`Elephant`。 当所有六根棍子都具有相同长度时，这证实了正确的操作。 

考虑：```
1 2 3 4 5 6
```没有长度出现至少四次。 搜索腿长失败，因此算法立即打印`Alien`。 这可以正确处理不可能构建任何动物的输入。
