---
title: "CF 474A - 键盘"
description: "该问题提出了一个具有三行字符的键盘，其排列方式与标准 QWERTY 布局完全相同。 鼹鼠正在这个键盘上输入消息，但他不小心将手向左移动了一个键，或者向右移动了一个键。"
date: "2026-05-30T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "implementation"]
categories: ["algorithms"]
codeforces_contest: 474
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 271 (Div. 2)"
rating: 900
weight: 474
solve_time_s: 64
verified: true
draft: false
---

[CF 474A - 键盘](https://codeforces.com/problemset/problem/474/A)

 **评分：** 900
 **标签：** 实施
 **求解时间：** 1m 4s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题提出了一个具有三行字符的键盘，其排列方式与标准 QWERTY 布局完全相同。 鼹鼠正在这个键盘上输入消息，但他不小心将手向左移动了一个键，或者向右移动了一个键。 因此，他输入的字符顺序与他想要写的内容不符。 我们的任务是扭转这种手的转变并重建原始消息。 

第一个输入行告诉我们移位的方向：“L”表示摩尔的手向左移动，因此每个键入的字符对应于键盘上紧邻其右侧的键，“R”表示右移，因此每个键入的字符对应于紧邻其左侧的键。 第二行是摩尔输入的字符序列，保证是该键盘上的有效键。 输出应该是正确的字符串，代表 Mole 想要输入的内容。 

限制很温和。 该序列最多包含 100 个字符，因此任何单独检查每个字符的算法都足够快。 边缘情况包括完全由行最末端的字符组成的序列。 例如，如果第一行是`qwertyuiop`键入的字符是`q`左移时，左边没有键`q`，但问题保证这不会发生。 粗心的解决方案可能会硬编码字符替换或忘记处理所有三行，这会在字符上失败，例如`;`或者`,`在下面几行。 

## 方法

 一种强力方法包括搜索键盘行中的每个键入的字符，然后根据移位方向向左或向右移动一个索引。 这样做是可行的，因为键盘虽小，但书写起来很麻烦且重复。 在简单的实现中，可能会迭代每一行，检查字符，然后计算索引偏移量。 这是正确的，但它很冗长、容易出错并且不必要地重复。 最坏情况下的操作计数大约为每个字符 3 次查找乘以 100 个字符，这很简单，但该方法并不优雅。 

最佳方法利用固定键盘布局。 我们可以为所有键构建一个映射：对于每个字符，存储它在左移和右移时映射到的键。 然后，重建原始字符串就变成了对每个键入的字符的简单查找。 我们的见解是，由于键盘是静态的，因此预先计算映射可以将问题减少到 O(n) 时间，其中 n 是键入字符串的长度。 映射保证我们不会错位行，并且可以在问题的保证下正确处理所有边缘字符。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(n * 3) | O(1) | O(1) | 已接受，但过于冗长 |
 | 最佳 | O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 将键盘行定义为字符串：`row1 = "qwertyuiop"`,`row2 = "asdfghjkl;"`,`row3 = "zxcvbnm,./"`。 这代表按键的固定布局。 
2. 将行连接成单个字符串或单独维护它们以将每个键映射到其邻居。 每个键的左邻居是该行中紧邻其之前的字符，右邻居是紧邻其之后的字符。 
3. 读取移位方向。 如果方向是“R”，则鼹鼠的手向右移动，这意味着键入的字符位于预期键的右侧。 为了重建原始消息，我们需要其左侧的字符。 相反，如果方向是“L”，则我们需要右侧的字符。 
4. 迭代输入字符串中的每个字符。 对于每个字符，找到它所属的行。 然后，根据移位方向，在该行内向左或向右移动一个索引以获得原始字符。 
5. 将每个更正的字符附加到结果列表中，最后将其连接到字符串中以生成输出。 

工作原理：每个字符都保证位于一行内，并且移位恰好是一个键，因此以适当的方向查找相邻键可以重建原始消息。 不变的是，在每次迭代中，我们都会根据移位正确地将键入的键映射到预期的键，从而按顺序生成正确的消息。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

keyboard = ["qwertyuiop", "asdfghjkl;", "zxcvbnm,./"]

direction = input().strip()
typed = input().strip()

result = []

for c in typed:
    for row in keyboard:
        if c in row:
            idx = row.index(c)
            if direction == 'R':
                result.append(row[idx - 1])
            else:  # direction == 'L'
                result.append(row[idx + 1])
            break

print("".join(result))
```在此代码中，我们首先将键盘布局定义为行列表。 然后我们读取方向和输入的字符串。 对于每个字符，我们搜索它属于哪一行，并根据移位方向将索引调整 -1 或 +1 来计算正确的原始字符。 使用`break`确保我们在找到该行后停止搜索，从而防止其他行中的错误匹配。 

## 工作示例

 样本1：

 输入：```
R
s;;upimrrfod;pbr
```追踪：

 | 人物 | 行| 索引 | 移位索引 | 结果 |
 | ---| ---| ---| ---| ---|
 | s | asdfghjkl; | 1 | 0 | 一个 |
 | ; | asdfghjkl; | 8 | 7 | 我|
 | ; | asdfghjkl; | 8 | 7 | 我|
 | 你| qwertyuiop | 4 | 3 | y |
 | p| qwertyuiop | 9 | 8 | 哦|
 | 我| qwertyuiop | 7 | 6 | 你|
 | 米 | zxcvbnm，./ | 6 | 5 | n |
 | r | qwertyuiop | 3 | 2 | 电子|
 | r | qwertyuiop | 3 | 2 | 电子|
 | f | asdfghjkl; | 3 | 2 | d |
 | 哦| qwertyuiop | 8 | 7 | 我|
 | d | asdfghjkl； | 2 | 1 | s |
 | ; | asdfghjkl； | 8 | 7 | 我|
 | p| qwertyuiop | 9 | 8 | 哦|
 | 乙| zxcvbnm，./ | 4 | 3 | v |
 | r | qwertyuiop | 3 | 2 | 电子|

 输出：```
allyouneedislove
```这确认了每个字符都根据移位方向正确映射。 

另一个例子：

 输入：```
L
qwerty
```追踪：

 | 人物 | 行| 索引 | 移位索引 | 结果 |
 | ---| ---| ---| ---| ---|
 | 问 | qwertyuiop | 0 | 1 | 瓦 |
 | 瓦 | qwertyuiop | 1 | 2 | 电子|
 | 电子| qwertyuiop | 2 | 3 | r |
 | r | qwertyuiop | 3 | 4 | t |
 | t | qwertyuiop | 4 | 5 | y |
 | y | qwertyuiop | 5 | 6 | 你|

 输出：```
wertyu
```## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 每个字符最多对照三行进行检查，由于 n ≤ 100，因此可以忽略不计。 
| 空间| O(n) | 我们将更正后的消息存储在长度为 n 的列表中。 |

 鉴于输入大小较小，该线性解决方案执行效率高，并且使用最少的内存，完全在 2 秒时间限制和 256 MB 内存限制之内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    keyboard = ["qwertyuiop", "asdfghjkl;", "zxcvbnm,./"]
    direction = input().strip()
    typed = input().strip()
    result = []
    for c in typed:
        for row in keyboard:
            if c in row:
                idx = row.index(c)
                if direction == 'R':
                    result.append(row[idx - 1])
                else:
                    result.append(row[idx + 1])
                break
    return "".join(result)

# provided sample
assert run("R\ns;;upimrrfod;pbr\n") == "allyouneedislove"

# custom cases
assert run("L\nqwerty\n") == "wertyu"  # simple left shift
assert run("R\nasdfg\n") == "qasdf"    # right shift, first row edge
assert run("L\nzxcvbnm\n") == "xcvbnm,"  # left shift, last row
assert run("R\np;/\n") == "o,l"  # extreme keys in last columns
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | R\ns;;upimrrfod;pbr | 所有你需要的爱| 标准箱，多排混合 |
 | L\nqwerty | 沃蒂尤 | 左移|
