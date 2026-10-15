---
title: "CF 106102L - 短信"
description: "我们收到了几条短信。 如果一条消息包含至少三个连续字母 a（忽略大小写），则该消息被视为“战斗”。 这意味着 aaa、AaA、aAA 和 AAA 等序列都符合条件。"
date: "2026-06-25T11:50:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 106102
codeforces_index: "L"
codeforces_contest_name: "AGM 2025, Final Round, Day 1"
rating: 0
weight: 106102
solve_time_s: 36
verified: true
draft: false
---

[CF 106102L - 短信](https://codeforces.com/problemset/problem/106102/L)

 **评级：** -
 **标签：** -
 **求解时间：** 36s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们收到了几条短信。 如果一条消息包含至少三个连续字母，则该消息被视为“战斗”`a`，忽略大小写。 这意味着诸如`aaa`,`AaA`,`aAA`， 和`AAA`都符合资格。 

对于每条消息，我们必须确定文本中的任何位置是否存在这样的运行。 

如果出现合格的运行，我们会打印：```
Love is war!
```否则我们打印：```
Just friends <3
```消息可能包含空格和其他字符，因此必须将每一整行视为完整的字符串。 

限制很小。 每条消息的长度最多为 100 个字符，因此即使直接扫描每个字符也足够快。 如果有`n`消息中，总工作量与所有消息中的字符总数成正比。 

导致错误的主要实现细节是不区分大小写的匹配。 像这样的序列：```
AAa
```必须完全相同地对待：```
aaa
```另一个容易犯的错误是在遇到非连续计数时错误地重置了连续计数。`a`特点。 

考虑以下消息：```
aabaa
```最长连续运行`a`长度为 2，因此正确的输出是：```
Just friends <3
```只计算总数的解决方案`a`角色会错误地将其归类为战斗。 

另一个例子：```
xAAAy
```包含三个连续的`a`转换为小写后的字母，所以正确的输出是：```
Love is war!
```区分大小写的实现会错过这一点。 

## 方法

 暴力破解的想法是检查长度至少为 3 的每个可能的子字符串，并检查该子字符串中的所有字符是否都是字母`a`在不区分大小写的比较下。 

对于长度的消息`m`，有 O(m²) 个子串，检查每个子串可能需要额外的时间。 尽管这里的限制很小并且仍然会过去，但它执行的工作比必要的要多得多。 

问题的结构提供了更简单的观察。 我们实际上并不关心跑步从哪里开始或结束。 我们只需要知道是否有连续的运行`a`达到长度 3。 

这建议扫描一次消息，同时保持当前运行的长度`a`人物。 当我们看到一个`a`（将字符转换为小写后），我们增加游程长度。 任何其他字符都会中断运行并将计数器重置为零。 

当计数器达到 3 时，我们就已经知道该消息的答案。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(平方米) | O(1) | O(1) | 不必要|
 | 最佳 | O(米) | O(1) | O(1) | 已接受 |

 这里`m`表示单个消息的长度。 

## 算法演练

 1.读取整数`n`。 
2. 重复`n`次，每次阅读完整的消息行。 
3. 初始化计数器`run = 0`。 
4. 逐字符扫描消息。 
5. 将当前字符转换为小写。 
6. 如果角色是`'a'`， 增加`run`1. 否则设置`run = 0`。 
7.如果`run`变为至少 3，将消息标记为战斗并停止扫描该消息。 
8. 输出`"Love is war!"`如果发现战斗。 否则输出`"Just friends <3"`。 

### 为什么它有效

 变量`run`始终存储当前后缀的长度，该后缀完全由连续的`a`字符，忽略大小写。 

每当一个非`a`字符出现，任何在前一个位置结束的连续序列都会被破坏，因此重置`run`归零是正确的。 

一条消息包含一次有效的战斗，当连续运行`a`长度至少达到三。 该算法第一次检测到该事件`run >= 3`，如果它从未发生，则消息中的任何位置都不存在合格运行。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

n = int(input())

for _ in range(n):
    s = input().rstrip("\n")

    run = 0
    battle = False

    for ch in s:
        if ch.lower() == 'a':
            run += 1
            if run >= 3:
                battle = True
                break
        else:
            run = 0

    if battle:
        print("Love is war!")
    else:
        print("Just friends <3")
```第一行读取消息数。 每个后续行都是独立处理的。 

柜台`run`跟踪当前的连续序列`a`人物。 使用`ch.lower()`保证大写和小写版本得到相同的处理。 

早期的`break`不需要正确性，但一旦知道答案就可以避免额外的工作。 

使用`rstrip("\n")`仅删除输入生成的尾随换行符，同时保留属于消息本身的任何空格。 

## 工作示例

 ### 示例 1

 输入消息：```
THIS MEANS WAAAAAARRRRRRRRRR
```| 人物 | 小写 | 运行|
 | ---| ---| ---|
 | 西 | 瓦 | 0 |
 | 一个 | 一个 | 1 |
 | 一个 | 一个 | 2 |
 | 一个 | 一个 | 3 |

 连续第三届`a`，条件满足，答案变为：```
Love is war!
```此示例表明大写字母必须与小写字母同等对待。 

### 示例 2

 输入消息：```
what is a aardvark
```| 人物 | 小写 | 运行|
 | ---| ---| ---|
 | 一个 | 一个 | 1 |
 | 空间| 空间| 0 |
 | 一个 | 一个 | 1 |
 | 一个 | 一个 | 2 |
 | r | r | 0 |

 最长的连续运行长度为 2，因此不存在战斗。 

输出：```
Just friends <3
```这个例子说明了为什么要计算总出现次数`a`是不够的。 只有连续出现才重要。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(米) | 每个字符被检查一次 |
 | 空间| O(1) | O(1) | 仅存储了几个变量|

 由于每条消息都被扫描一次并且消息很短，因此该解决方案很容易满足任何合理的竞赛限制。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline

    n = int(input())

    out = []

    for _ in range(n):
        s = input().rstrip("\n")

        run = 0
        battle = False

        for ch in s:
            if ch.lower() == 'a':
                run += 1
                if run >= 3:
                    battle = True
                    break
            else:
                run = 0

        out.append("Love is war!" if battle else "Just friends <3")

    sys.stdout.write("\n".join(out))

def run(inp: str) -> str:
    backup_stdin = sys.stdin
    backup_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    solve()

    result = sys.stdout.getvalue()

    sys.stdin = backup_stdin
    sys.stdout = backup_stdout

    return result

# sample-style cases
assert run(
"""5
How are you doing Kaguya?
THIS MEANS WAAAAAARRRRRRRRRR
oops sorry wrong person
LlLmmAAaOoo that's soooo funnnyyy
what is a aardvark
"""
) == (
"""Just friends <3
Love is war!
Just friends <3
Love is war!
Just friends <3"""
)

# minimum size
assert run("1\na\n") == "Just friends <3"

# exactly three consecutive letters
assert run("1\naaa\n") == "Love is war!"

# mixed case
assert run("1\nAaA\n") == "Love is war!"

# separated runs
assert run("1\naa baa aa\n") == "Just friends <3"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a`|`Just friends <3`| 最小尺寸消息 |
 |`aaa`|`Love is war!`| 精确阈值 3 |
 |`AaA`|`Love is war!`| 不区分大小写的匹配 |
 |`aa baa aa`|`Just friends <3`| 运行由非分隔`a`人物 |

 ## 边缘情况

 考虑以下消息：```
AaA
```该算法在扫描时将每个字符转换为小写。 

的价值观`run`变得：```
1 -> 2 -> 3
```立刻`run`达到 3，算法输出：```
Love is war!
```这可以正确处理混合大小写。 

现在考虑：```
aabaa
```扫描过程如下：```
a -> run = 1
a -> run = 2
b -> run = 0
a -> run = 1
a -> run = 2
```计数器永远不会达到 3，因此结果是：```
Just friends <3
```这证实了只有连续发生的事件才重要。 

最后，考虑：```
aaaa
```计数器演变为：```
1 -> 2 -> 3
```该算法立即识别出战斗并停止扫描。 较长的游程会自动处理，因为任何长度为 4、5 或更长的游程都必须首先经过长度 3。
