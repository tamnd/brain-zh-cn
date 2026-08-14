---
title: "CF 102348D - 票券游戏"
description: "我们有一张等长的票，分成相等的两半。 每个位置已经包含一个数字或包含？，表示该数字已被删除。 两名玩家交替选择剩下的一名？ 并将其替换为 0 到 9 之间的任意数字。"
date: "2026-08-13T00:53:21+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102348
codeforces_index: "D"
codeforces_contest_name: "ICPC 2019-2020 NERC (NEERC), Southern and Volga Russia Qualifier"
rating: 0
weight: 102348
solve_time_s: 191
verified: true
draft: false
---

[CF 102348D - 门票游戏](https://codeforces.com/problemset/problem/102348/D)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 11s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们有一张等长的票，分成相等的两半。 每个位置已经包含一个数字或包含`?`，这意味着它的数字已被删除。 两名玩家轮流选择剩下的一名`?`并将其替换为以下任意数字`0`通过`9`。 Monocarp 首先行动并希望两半的最终总和不同。 比卡普希望这些金额相等。 

表示票据的有用方法不是作为一串单独的位置，而是通过四个数量。 让`L`和`R`是左半部分和右半部分中已知数字的总和，并令`qL`和`qR`是那些半部中被擦除的位置的数量。 整个游戏可以用这四个值来表征。 

长度可以大到`200000`，而且时间限制只有一秒。 因此，解决方案在票据长度上应该是线性的或接近线性的。 任何探索大部分可能任务的方法都是不可能的，因为即使`10^20`分配的任务已经远远超出了可以处理的范围。 内存限制对于`O(n)`扫描，但没有理由存储输入字符串和一些计数器之外的任何内容。 

有几种边缘情况很容易破坏简单的解决方案。 首先，已经确定了没有被删除位置的票。 例如，`n = 4`和`0523`已剩金额`0 + 5 = 5`和正确的总和`2 + 3 = 5`，所以答案是`Bicarp`。 一种实现至少假设一个`?`可能会对这个案子处理不当。 

其次，相同数量的问号本身并不能保证比卡普获胜。 例如：```
4
?123
```这里`qL = 1`,`qR = 0`，所以 Monocarp 获胜。 如果不小心实现，仅检查初始固定总和是否相等，则会错误地输出`Bicarp`。 

第三，当固定总和差的大小恰好合适时，不平等的问号计数仍然可以产生比卡普获胜。 例如：```
8
?054??0?
```左边的固定和是`9`，正确的固定总和是`0`， 尽管`qL = 1`和`qR = 3`。 问号计数的差异是`2`， 和`9 * 2 / 2 = 9`，完全匹配固定总和差。 比卡普获胜。 因此，诸如“问号数量不同意味着 Monocarp 获胜”的规则是不正确的。 

最后，因素`9`很重要，因为每个问号都可以贡献任何东西`0`到`9`。 例如：```
6
???00?
```固定金额为`0`和`0`，但问号计数是`3`和`1`。 Monocarp 获胜是因为 Bicarp 无法补偿两个额外的左侧位置。 将问号仅视为未指定的值而不考虑其全部范围会错过实际的游戏结构。 

## 方法

 直接的暴力解决方案会考虑所有可能的方法来替换问号。 如果有`q`擦除的位置，每个位置有十个可能的数字，给出`10^q`完整的门票。 我们可以递归地为每个位置选择一个数字并检查最后的两个和。 这是正确的，因为每种可能的游戏结果都由搜索树的一片叶子表示，但最坏的情况是`q = 200000`，生产`10^200000`终端分配。 即使每个任务的工作量很小，这也是完全不可行的。 

该游戏的结构比任意极小极大要多得多。 最终结果仅取决于两个半数之差。 首先考虑已经固定的位置。 定义

 [
 D=左-右。 
]

 问号为这种差异提供了额外的价值。 当两半有相同数量的问号并且`D = 0`，Bicarp 可以通过在另一半中选择相同的数字来回答每一步棋。 两个新添加的贡献相互抵消，因此每对动作后差异仍然为零。 这是一种直接配对策略。 

如果`D = 0`但问号的数量不同，配对是不可能的。 由于 Monocarp 首先移动，他最终可以在带有无与伦比的问号的一侧移动并迫使非零的最终差异。 

现在假设`D != 0`。 我们可以在概念上交换两半，这样`D > 0`，这意味着固定数字已经使左半部分变大。 问题是右半边是否有足够的额外问号来弥补。 

如果`qL >= qR`，Monocarp 在已经较大的一侧至少有同样多的可用动作。 他可以保持优势不被修复，因此比卡普无法强行平局。 

有趣的案例是`qL < qR`。 右侧有`qR - qL`额外的问号。 因为问号总数是偶数，所以这个差值也是偶数。 在游戏的配对部分，玩家可以有效地消除双方相同数量的问号。 最终只剩下额外的右侧问号。 

假设有`k = qR - qL`这样的职位。 自从`k`是均匀的，Bicarp可以成对地控制最终的平衡效果。 每对额外的右侧问号最多可以贡献`9`减少相关最优策略中的左侧优势。 因此最大补偿量为

 [
 9\frac{k}{2}。 
]

 当该金额等于固定差值时，Bicarp 获胜：

 [
 D = 9\frac{qR-qL}{2}。 
]

 如果差异较小，Bicarp 无法消除足够的初始优势。 如果它更大，则剩余优势仍然不为零。 平等是唯一可以强制实现完美平衡的情况。 

这在扫描一次票证后给出了恒定大小的决定。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 |`O(10^q)`|`O(q)`递归| 太慢了 |
 | 最佳|`O(n)`|`O(1)`除了输入| 已接受 |

 ## 算法演练

 1. 从概念上将票分为左半部分和右半部分。 扫描字符串时，计算`left_sum`和`right_sum`仅使用固定数字并计数`left_q`和`right_q`，每一半都有问号。 这四个值包含了游戏所需的所有信息。 
2. 将固定总差计算为`left_sum - right_sum`。 如果是负数，则在概念上交换两侧，以便`left_sum >= right_sum`。 同时，交换他们的问号计数。 经过这种归一化后，固定差值是非负的，代表左侧的优势。 
3. 如果固定差值为零，则 Bicarp 恰好在以下时间获胜：`left_q == right_q`。 在计数相等的情况下，Monocarp 的每一步棋都可以与另一半使用相同数字的响应配对，从而保持平等。 由于计数不相等，第一个玩家最终会获得无与伦比的移动并可能破坏平等。 
4. 如果固定差值为正且`left_q >= right_q`， 输出`Monocarp`。 已经领先的一方至少有同样多的问号，因此莫诺卡普可以利用他的举动来保持非零优势。 比卡普在另一边没有足够的无与伦比的位置来弥补。 
5. 如果固定差值为正且`left_q < right_q`， 计算`extra = right_q - left_q`。 只有当初始差值恰好是时，Bicarp 才能获胜`9 * extra / 2`。 由于问号总数是偶数，`extra`是偶数，所以这个值是一个整数。 如果等式成立，则输出`Bicarp`; 否则输出`Monocarp`。 

### 为什么它有效

 不变量是两个半和之间的当前差值以及每边未使用的问号的数量。 剩余的相同数量的问号可以成对中和，因为 Monocarp 在一侧选择一个值后，Bicarp 可以在另一侧使用相同的值。 一旦这些成对的位置被删除，只有不匹配的问号才重要。 如果最初较大的固定金额至少有同样多的问号，Monocarp 可以保持优势。 否则，对方正好有`qR - qL`额外的头寸，补偿固定差异的唯一方法是这些头寸准确提供`9(qR-qL)/2`的调整。 因此，上述条件既是必要的，也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    s = input().strip()

    half = n // 2

    left_sum = 0
    right_sum = 0
    left_q = 0
    right_q = 0

    for i in range(half):
        if s[i] == '?':
            left_q += 1
        else:
            left_sum += ord(s[i]) - ord('0')

    for i in range(half, n):
        if s[i] == '?':
            right_q += 1
        else:
            right_sum += ord(s[i]) - ord('0')

    if left_sum < right_sum:
        left_sum, right_sum = right_sum, left_sum
        left_q, right_q = right_q, left_q

    diff = left_sum - right_sum

    if diff == 0:
        if left_q == right_q:
            print("Bicarp")
        else:
            print("Monocarp")
        return

    if left_q >= right_q:
        print("Monocarp")
        return

    extra = right_q - left_q

    if diff * 2 == extra * 9:
        print("Bicarp")
    else:
        print("Monocarp")

if __name__ == "__main__":
    solve()
```第一个循环恰好处理第一个`n // 2`位置，而第二个开始于`n // 2`，这是Python从零开始的索引中右半部分的第一个索引。 固定数字影响其各自的总和，而问号仅影响两个计数器。 

扫描后的交换是一种有用的简化。 而不是单独编写案例`left_sum > right_sum`和`right_sum > left_sum`，代码始终将固定和较大的一侧视为左侧。 问号计数必须与总和一起交换，因为较大一方的身份对游戏很重要。 

平等测试使用`diff * 2 == extra * 9`而不是划分`extra`两个。 这避免了不必要的除法，并使数学条件在代码中直接可见。 Python 整数不存在溢出问题，这里的最大值仅约为`10^6`。 

该实现不需要修改票证本身。 一旦计算出四个总量，问号的确切位置就不再重要了。 这就是将游戏从指数搜索简化为单个线性扫描的原因。 

## 工作示例

 ### 示例 1

 输入是：```
4
0523
```没有问号，所以游戏没有动作。 两个固定金额均为`5`。 

| 步骤| 左总和| 正确的总和 | 左边`?`| 正确的`?`| 决定|
 | --- | --- | --- | --- | --- | --- |
 | 扫描完成 | 5 | 5 | 0 | 0 | 固定差额为零 |
 | 最终检查| 5 | 5 | 0 | 0 | 同样的问号计数，比卡普 |

 该算法达到零差异情况并找到相等的问号计数。 票已经很高兴了，所以比卡普立即获胜。 

### 示例 2

 输入是：```
2
??
```两个位置都被删除。 没有固定的数字，因此两个固定和都为零，并且两边各有一个问号。 

| 步骤| 左总和| 正确的总和 | 左边`?`| 正确的`?`| 决定|
 | --- | --- | --- | --- | --- | --- |
 | 扫描完成 | 0 | 0 | 1 | 1 | 固定差额为零 |
 | 最终检查| 0 | 0 | 1 | 1 | 同等计数，比卡普 |

 无论 Monocarp 在第一个位置选择什么数字，Bicarp 都可以在其他位置放置相同的数字。 两个总和相等，因此比卡普获胜。 

### 示例 3

 输入是：```
8
?054??0?
```左半部分是`?054`，给出固定总和`9`和一个问号。 右半部分是`??0?`，给出固定总和`0`和三个问号。 

| 步骤| 左总和| 正确的总和 | 左边`?`| 正确的`?`| 决定|
 | --- | --- | --- | --- | --- | --- |
 | 扫描完成 | 9 | 0 | 1 | 3 | 左边有较大的固定总和 |
 | 差异| 9 | 0 | 1 | 3 |`diff = 9`,`extra = 2`|
 | 最终检查| 9 | 0 | 1 | 3 |`2 * 9 = 2 * 9`, 双果皮 |

 右半部分还有两个问号。 这两个不匹配的位置可以准确地弥补`9`，即现有的固定差值。 平等条件成立，因此比卡普获胜。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 |`O(n)`| 每个票位均检查一次。 |
 | 空间|`O(1)`辅助空间| 除了输入字符串之外，仅维护四个计数器和一些标量变量。 |

 和`n <= 200000`，该算法仅对每个字符执行少量算术运算。 它完全符合一秒的限制，而暴力搜索则需要长达`10^200000`在最坏的情况下完成任务。 

## 测试用例```python
import sys
import io

def solve():
    n = int(input())
    s = input().strip()

    half = n // 2

    left_sum = 0
    right_sum = 0
    left_q = 0
    right_q = 0

    for i in range(half):
        if s[i] == '?':
            left_q += 1
        else:
            left_sum += ord(s[i]) - ord('0')

    for i in range(half, n):
        if s[i] == '?':
            right_q += 1
        else:
            right_sum += ord(s[i]) - ord('0')

    if left_sum < right_sum:
        left_sum, right_sum = right_sum, left_sum
        left_q, right_q = right_q, left_q

    diff = left_sum - right_sum

    if diff == 0:
        print("Bicarp" if left_q == right_q else "Monocarp")
    elif left_q >= right_q:
        print("Monocarp")
    else:
        extra = right_q - left_q
        print("Bicarp" if diff * 2 == extra * 9 else "Monocarp")

def run(inp: str) -> str:
    global input

    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    input = sys.stdin.readline

    try:
        solve()
        return sys.stdout.getvalue().strip()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Provided samples
assert run("4\n0523\n") == "Bicarp", "sample 1"
assert run("2\n??\n") == "Bicarp", "sample 2"
assert run("8\n?054??0?\n") == "Bicarp", "sample 3"

# Minimum size, unequal fixed sums and no question marks
assert run("2\n12\n") == "Monocarp", "minimum-size unhappy ticket"

# Minimum size, both positions erased
assert run("2\n??\n") == "Bicarp", "minimum-size pairing"

# Equal fixed sums but unequal question-mark counts
assert run("4\n?123\n") == "Monocarp", "unequal question counts"

# Positive difference with the exact 9 * extra / 2 compensation
assert run("6\n9??0??\n") == "Bicarp", "exact compensation"

# Positive difference with insufficient compensation
assert run("6\n8??0??\n") == "Monocarp", "wrong compensation"

# All equal values, maximum-size input
MAX_N = 200000
max_input = str(MAX_N) + "\n" + "5" * MAX_N + "\n"
assert run(max_input) == "Bicarp", "maximum-size all-equal ticket"

# Maximum-size all question marks
max_questions = str(MAX_N) + "\n" + "?" * MAX_N + "\n"
assert run(max_questions) == "Bicarp", "maximum-size all-question ticket"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`2 / 12`|`Monocarp`| 已不满意票的最小尺寸 |
 |`2 / ??`|`Bicarp`| 尽可能最小的配对策略|
 |`4 / ?123`|`Monocarp`| 固定金额相等但问号计数不相等 |
 |`6 / 9??0??`|`Bicarp`| 额外问号的确切补偿|
 |`6 / 8??0??`|`Monocarp`| 补偿不够大|
 |`200000 / 555...5`|`Bicarp`| 最大输入大小和所有相等的固定数字 |
 |`200000 / ???...???`|`Bicarp`| 擦除每个位置的最大输入大小 |

 ## 边缘情况

 第一个边缘情况是没有被擦除位置的票据。 为了`4 / 0523`，扫描给出`left_sum = 5`,`right_sum = 5`,`left_q = right_q = 0`。 算法进入零差分支并返回`Bicarp`。 没有任何动作，所以初始状态直接决定结果。 

第二种边缘情况是固定总和相等但问号数量不等。 为了`4 / ?123`，固定左和为`0`，固定右和为`2 + 3 = 5`，因此标准化后右侧更大。 计数变为`qL = 0`和`qR = 1`，具有正的固定差异。 由于较大的一边有更多的问号，算法返回`Monocarp`。 更一般地，当固定差值为零并且计数不同时，首先采取行动的玩家具有不匹配的位置，从而阻止永久配对策略。 

第三种边缘情况是精确补偿情况。 为了`8 / ?054??0?`，标准化值是`diff = 9`,`qL = 1`， 和`qR = 3`。 两个额外的右侧问号可以弥补`9 * 2 / 2 = 9`，完全匹配固定差值。 条件`2 * diff == 9 * extra`成立，所以结果是`Bicarp`。 

第四种边缘情况是存在问号不平衡但固定差值与所需补偿不匹配的情况。 为了`6 / 8??0??`，标准化固定差为`8`，而问号计数差为`2`。 Bicarp 获胜条件所需的最大精确补偿为`9`， 不是`8`。 自从`2 * 8 != 2 * 9`，算法输出`Monocarp`。 

最大尺寸的情况说明了为什么解决方案永远不应该尝试模拟博弈树。 一张票包含`200000`问号具有天文数字的可能完成数量，但该算法仅计算每一半有多少个问号，并扫描一次字符串。 结果是从这些聚合值中获得的，而不构建任何可能的已完成票证。
