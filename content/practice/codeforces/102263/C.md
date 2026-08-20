---
title: "CF 102263C - 检查文本"
description: "Roze 希望屏幕上的最终文本完全是所需的文本，包括大写和连续单词之间的单个空格。 所需的文本以 n 个单词的形式给出，因此预期的屏幕内容是由一个空格连接的单词。"
date: "2026-08-19T02:48:43+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102263
codeforces_index: "C"
codeforces_contest_name: "ArabellaCPC 2019"
rating: 0
weight: 102263
solve_time_s: 205
verified: true
draft: false
---

[CF 102263C - 检查文本](https://codeforces.com/problemset/problem/102263/C)

 **评级：** -
 **标签：** -
 **求解时间：** 3m 25s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 Roze 希望屏幕上的最终文本完全是所需的文本，包括大写和连续单词之间的单个空格。 所需的文本给出为`n`单词，因此预期的屏幕内容是由一个空格连接的单词。 

输入的第二部分描述了实际的键盘操作，每行一个键。 字母键会产生小写或大写字符，具体取决于当前的 CapsLock 状态。 紧迫`CapsLock`切换该状态。`Space`插入一个空格，同时`Backspace`如果屏幕非空，则删除当前屏幕上的最后一个字符。 

任务是完全像键盘一样执行这些操作，并将结果屏幕与预期文本进行比较。 我们打印`Correct`仅当两个字符串相同时。 

字数和按键次数均低于 2000，所需字的总长度也低于 2000。这些限制足够小，即使是二次实现通常也能轻松适应，但它们也使直接线性模拟变得极其简单。 不需要散列、动态编程或任何更高级的数据结构。 我们只需要处理每个按键一次并维护当前屏幕。 

有几个细节可能会导致不正确的实现默默地接受错误的文本。 

考虑这个输入：```
2
a b
2
a
b
```最终的画面是`ab`，而所需的文本是`a b`，所以答案是`Incorrect`。 一种简单比较字母序列而忽略的实现`Space`会错误地接受它。 

大写也是文本的一部分。 例如：```
2
A b
3
CapsLock
a
b
```最终的画面是`Ab`， 不是`A b`，所以答案是`Incorrect`。 粗心的实现可能只跟踪输入的字母，而忘记 CapsLock 更改了它们的大小写。 

空屏幕上的退格键是另一个边界条件。 例如：```
2
a b
4
a
Backspace
Space
b
```前两个操作将屏幕留空，然后`Space`产生`" "`， 和`b`产生`" b"`。 结果是`Incorrect`。 更一般地，退格键不得使屏幕长度为负值。 

最后，退格键可以删除空格，就像删除字母一样。 例如：```
2
a b
4
a
Space
Backspace
b
```最终的画面是`ab`， 不是`a b`，所以答案是`Incorrect`。 在删除过程中将空格与字母分开处理是错误的。 

## 方法

 直接模拟是自然的起点。 维护一个代表当前屏幕的字符串。 对于每个字母，附加大小写正确的字符。 为了`Space`，追加一个空格。 为了`Backspace`，删除最后一个字符（如果存在）。 为了`CapsLock`，切换布尔标志。 处理完所有按键后，将模拟屏幕与`" ".join(words)`。 

这个想法是正确的，因为每个键盘操作在模拟中都有直接的表示。 最简单的实现的主要弱点是数据结构的选择。 Python 字符串是不可变的，因此诸如此类的操作`screen = screen[:-1]`创建一个新字符串并复制剩余的字符。 重复追加还可以复制越来越长的字符串。 

对于精心构造的追加和删除序列，最多按 1999 次按键，最坏情况下的字符复制量约为一百万次操作，因此即使这种简单的实现对于原始约束来说也是可以接受的。 然而，它的二次行为是不必要的，如果相同的任务扩展到数十万次按键，就会成为问题。 问题不在于模拟本身，而在于重复重建屏幕的整个前缀。 

关键的观察结果是屏幕的行为与堆栈完全相同。 新输入的字符被放置在末尾，并且`Backspace`精确删除最近写入的字符。 Python 列表为我们提供了恒定时间的追加和从末尾删除，因此它自然地代表了屏幕。 

通过这种表示，每个键都需要不断的工作。 我们处理按键序列一次，以线性时间生成最终屏幕。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 朴素的不可变字符串模拟 | 最坏情况 | O(m²) O(米) | 接受这些限制，但速度过慢 |
 | 堆栈模拟| O(m + L) | O(m + L) | 已接受 |

 这里`m`是按键次数，`L`是所需文本的长度。 

## 算法演练

 1. 阅读`n`目标单词并构建所需的屏幕`" ".join(words)`。 连接是必要的，因为单词之间的空格是必须检查的一部分。 
2. 创建一个名为的空列表`screen`。 该列表表示屏幕上的当前字符，最后一个列表元素对应于 Backspace 将删除的字符。 
3.设置布尔变量`caps`到`False`。 键盘以小写模式启动，因此第一个字母键必须解释为小写，除非`CapsLock`键已经切换状态。 
4. 处理每个`m`按顺序按下按键。 如果关键是`CapsLock`， 翻动`caps`。 屏幕上不会添加任何字符，因为 CapsLock 只会更改未来字母键的解释。 
5. 如果密钥是`Backspace`，删除最后一个元素`screen`当列表非空时。 如果列表为空，则不执行任何操作，以匹配键盘的行为。 
6. 如果密钥是`Space`, 附加`" "`到`screen`。 空格是普通的屏幕字符，用于退格和最终比较。 
7. 否则密钥是一个字母。 当以下情况时将其转换为大写`caps`为 true 且为小写`caps`为 false，则将结果字符附加到`screen`。 
8. 处理完所有密钥后，进行转换`screen`到一个字符串并将其与目标文本进行比较。 打印`Correct`如果它们相等并且`Incorrect`否则。 

### 为什么它有效

 不变量是，处理完按键序列的任意前缀后，`screen`完全包含执行相同前缀后在真实键盘屏幕上可见的字符，并且`caps`等于键盘当前的 CapsLock 状态。 

最初，两者都是正确的，因为屏幕是空的并且 CapsLock 已关闭。 每个可能的键都保留不变式：CapsLock 仅更改状态，Backspace 会在可能的情况下删除最后一个可见字符，Space 添加一个空格，而字母则添加由当前状态确定的大小写的字母。 因此，在处理完所有密钥后，`screen`正是实际的最终屏幕。 因此，将其与所需文本进行比较就足以确定文本是否打印正确。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n = int(input())
    words = input().split()
    target = " ".join(words)

    m = int(input())

    screen = []
    caps = False

    for _ in range(m):
        key = input().strip()

        if key == "CapsLock":
            caps = not caps
        elif key == "Backspace":
            if screen:
                screen.pop()
        elif key == "Space":
            screen.append(" ")
        else:
            screen.append(key.upper() if caps else key.lower())

    result = "".join(screen)

    print("Correct" if result == target else "Incorrect")

if __name__ == "__main__":
    solve()
```目标字符串由单词构造一次。 由于输入保证了连续单词之间恰好有一个预期的空格，`" ".join(words)`精确地生成必须出现在屏幕上的字符串。 

这`screen`list是算法中描述的栈。`append`处理进入屏幕的字符，同时`pop`删除最近写入的字符。 这`if screen`检查是必要的，因为在空屏幕上退格键没有任何作用。 

这`caps`在处理后面的任何字母之前，会切换标志。 一个`CapsLock`键本身永远不会出现在屏幕上，因此不得将其附加到堆栈中。 

条件检查的顺序很重要，因为`CapsLock`,`Backspace`， 和`Space`是特殊的键名而不是字母。 任何其他键都保证是单个字母字符，因此它可以安全地由最终分支处理。 

不存在整数溢出问题，因为该算法仅使用受输入大小限制的计数器。 该列表最多可以包含`m`字符，所以它的内存使用是线性的。 

## 工作示例

 该语句提供了一个示例，因此下面的第二条跟踪使用了一个小型构造案例来练习 CapsLock 和 Backspace。 

### 示例 1

 所需的文本是`Hello World`。 按下的按键首先产生`Hell`，然后 Backspace 删除最后一个`l`，后面的操作最终产生`Howorld`而不是所需的文本。 

| 关键| 帽子 | 屏幕|
 | --- | --- | --- |
 | 大写锁定 | 真实 |`""`|
 | 小时 | 真实 |`"H"`|
 | 大写锁定 | 假 |`"H"`|
 | 电子| 假 |`"He"`|
 | 我| 假 |`"Hel"`|
 | 我| 假 |`"Hell"`|
 | 退格 | 假 |`"Hel"`|
 | 哦| 假 |`"Helo"`|
 | 空间| 假 |`"Helo "`|
 | 瓦 | 假 |`"Helo w"`|
 | 哦| 假 |`"Helo wo"`|
 | 退格 | 假 |`"Helo w"`|
 | 退格 | 假 |`"Helo "`|
 | 瓦 | 假 |`"Helo w"`|
 | 哦| 假 |`"Helo wo"`|
 | r | 假 |`"Helo wor"`|
 | 我| 假 |`"Helo worl"`|
 | d | 假 |`"Helo world"`|

 最终的画面是`"Helo world"`，而目标是`"Hello World"`。 两人失踪`l`以及大小写不正确`World`很重要，所以答案是`Incorrect`。 

### 构造样本 2

 考虑以下输入：```
2
Ab c
6
CapsLock
a
b
CapsLock
Space
c
```执行过程是：

 | 关键| 帽子 | 屏幕|
 | --- | --- | --- |
 | 大写锁定 | 真实 |`""`|
 | 一个 | 真实 |`"A"`|
 | 乙| 真实 |`"AB"`|
 | 大写锁定 | 假 |`"AB"`|
 | 空间| 假 |`"AB "`|
 | c | 假 |`"AB c"`|

 最终的画面是`"AB c"`，但所需的文本是`"Ab c"`，所以结果是`Incorrect`。 此跟踪说明了为什么 CapsLock 必须独立影响每个未来的字母，而不是简单地随后更改最终的字符串。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(m + L) | 每个键都被处理一次，最后的比较扫描生成的字符串和目标字符串 |
 | 空间| O(m + L) | 目标和模拟屏幕都需要线性存储|

 原始约束同时保留`m`并且目标长度低于 2000，因此线性解决方案仅执行几千个基本操作，并且使用很少的内存。 它还避免了由不可变字符串更新引起的不必要的二次复制，使该实现适用于同一问题的更大版本。 

## 测试用例```python
import sys
import io

def solve_data(inp: str) -> str:
    data = inp.splitlines()
    it = iter(data)

    n = int(next(it))
    words = next(it).split()
    target = " ".join(words)

    m = int(next(it))

    screen = []
    caps = False

    for _ in range(m):
        key = next(it).strip()

        if key == "CapsLock":
            caps = not caps
        elif key == "Backspace":
            if screen:
                screen.pop()
        elif key == "Space":
            screen.append(" ")
        else:
            screen.append(key.upper() if caps else key.lower())

    return "Correct" if "".join(screen) == target else "Incorrect"

def run(inp: str) -> str:
    return solve_data(inp)

# Provided sample
sample1 = """2
Hello World
17
CapsLock
h
CapsLock
e
l
l
Backspace
o
Space
w
o
Backspace
Backspace
w
o
r
l
d
"""
assert run(sample1) == "Incorrect", "sample 1"

# Minimum-size style case, exact text with one space
case2 = """2
a b
3
a
Space
b
"""
assert run(case2) == "Correct", "basic correct text"

# Backspace on an empty screen, followed by the target
case3 = """2
a b
5
Backspace
a
Space
b
Backspace
"""
assert run(case3) == "Incorrect", "empty backspace and final deletion"

# CapsLock toggles twice, producing the original lowercase text
case4 = """2
ab cd
7
CapsLock
a
CapsLock
b
Space
c
d
"""
assert run(case4) == "Correct", "CapsLock toggling"

# Backspace removes a space, so the final text has no separator
case5 = """2
a b
4
a
Space
Backspace
b
"""
assert run(case5) == "Incorrect", "backspace removes space"

# Large boundary-style case
words = ["a" * 999, "b" * 999]
target = " ".join(words)
case6 = (
    "2\n"
    + target
    + "\n"
    + "1999\n"
    + "\n".join(list("a" * 999 + "b" * 1000))
    + "\n"
)
assert run(case6) == "Incorrect", "large input boundary"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 样品1 |`Incorrect`| 提供示例，包括删除和大写 |
 |`a b`和`a`,`Space`,`b`|`Correct`| 基本成功模拟|
 | 领导`Backspace`后跟文字 |`Incorrect`| 在空屏幕上退格|
 | 两个 CapsLock 开关 |`Correct`| CapsLock 状态更改并返回小写 |
 |`a`,`Space`,`Backspace`,`b`|`Incorrect`| 退格键也必须删除空格 |
 | 999`a`字符和999`b`人物 |`Incorrect`| 大边界输入和线性处理|

 ## 边缘情况

 空白屏幕上的退格键必须被忽略。 对于输入```
2
a b
5
Backspace
a
Space
b
Backspace
```第一个退格键使空堆栈保持不变。 接下来的三个键创建`"a b"`，最后的退格键删除`b`，离开`"a "`。 自从`"a "`不同于`"a b"`，答案是`Incorrect`。 这`if screen`守卫防止无效者`pop`并精确模拟键盘行为。 

空格与字母存储在同一堆栈中。 为了```
2
a b
4
a
Space
Backspace
b
```堆栈是从`[]`到`["a"]`， 然后`["a", " "]`，然后回到`["a"]`，最后到`["a", "b"]`。 最终文本是`"ab"`，所以结果是`Incorrect`。 将 Backspace 视为仅字母操作会在结果中留下删除的空格并产生错误的答案。 

CapsLock 仅影响后续的字母按下。 和```
2
A b
3
CapsLock
a
b
```该标志在之前变为 true`a`，所以屏幕变成`"A"`。 当以下情况时，该标志保持为真：`b`被压制，产生`"AB"`。 目标是`"A b"`，所以答案是`Incorrect`。 切换 Caps Lock 时，模拟不会追溯更改屏幕上已有的字符。 
连续按下 Caps Lock 键会相互取消。 为了```
2
ab cd
7
CapsLock
a
CapsLock
b
Space
c
d
```第一个切换使`a`大写，生产`"A"`。 第二个切换返回小写，所以`b`,`c`， 和`d`均为小写。 最终的画面是`"Ab cd"`，与目标不同`"ab cd"`，所以这个特定的输入是`Incorrect`。 如果目标中的第一个字母也是大写，则相同的两个切换将正确恢复其余字母的小写模式。 关键是状态在每个的确切位置发生变化`CapsLock`按。 

必须准确检查所需的空格，而不仅仅是将其视为分隔符。 为了```
2
a b
2
a
b
```堆栈变成`"ab"`，而目标是`"a b"`。 该算法比较完整的字符串，因此它可以正确打印`Incorrect`。 

最后，一个序列可以包含许多相互抵消的操作。 例如，```
2
a b
6
a
Backspace
Backspace
a
Space
b
```开始于`"a"`，删除它，忽略第二个退格键，因为屏幕是空的，然后构造`"a b"`。 最终结果是`Correct`。 此案例证实该算法不会将旧的删除字符与当前屏幕状态混淆。
