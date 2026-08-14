---
title: "CF 102318B - 简化键盘"
description: "该问题使用包含全部 26 个小写字母的小型自定义键盘。 这些字母排列成三行：每个测试用例给出两个单词。 我们必须将这一对分为三类之一。"
date: "2026-08-13T23:53:13+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102318
codeforces_index: "B"
codeforces_contest_name: "UCF Locals 2017"
rating: 0
weight: 102318
solve_time_s: 76
verified: true
draft: false
---

[CF 102318B - 简化键盘](https://codeforces.com/problemset/problem/102318/B)

 **评级：** -
 **标签：** -
 **求解时间：** 1m 16s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 该问题使用包含全部 26 个小写字母的小型自定义键盘。 这些字母排列成三行：```
a b c d e f g h i
j k l m n o p q r
s t u v w x y z
```每个测试用例给出两个词。 我们必须将这一对分为三类之一。 如果它们具有相同的长度并且每个对应的字符都相等，则它们**相同**。 如果它们具有相同的长度、不相同，并且每对对应的字符要么相等，要么占据键盘上的相邻位置，则它们**相似**。 如果两个条件都不成立，则它们**不同**。 

原始竞赛语句给出长度从 1 到 20 的单词，第一个输入值指定后面有多少个单词对。 

小字长意味着不需要高级数据结构或渐近复杂的算法。 即使对每个字符进行线性扫描也很小，一个测试用例最多比较 20 个字符。 唯一有意义的设计选择是我们如何有效地确定两个字母是否是键盘邻居。 由于键盘只有26个固定字母，我们可以直接对每个字母的行和列进行编码，并在常数时间内回答该问题。 

在某些情况下，粗心的实施可能会给出错误的分类。 不同的长度必须立即产生`3`。 例如：```
1
ab abc
```正确的输出是：```
3
```只检查重叠字符的程序会看到`a`相对`a`和`b`相对`b`并且可能会错误地称这些词相似。 

两个具有相同长度但相同字符的单词必须产生`1`， 不是`2`。 例如：```
1
cool cool
```正确的输出是：```
1
```检查每对是否相等或相邻并返回的程序`2`如果不首先检查整个单词是否相同，就会错误地分类这种情况。 

邻接基于键盘几何形状，包括对角邻居。 例如：```
1
knq bxz
```正确的输出是：```
2
```这里`k`旁边是`b`,`n`旁边是`x`， 和`q`旁边是`z`。 仅将水平和垂直接触的键视为邻居会错误地拒绝这一对。 

## 方法

 简单的暴力解决方案可以独立处理每个位置。 对于每对对应的字母，我们可以扫描所有 26 个键盘字母来查找第二个字母是否属于第一个字母的邻域。 由于一个单词最多包含 20 个字符，因此对于一个测试用例最多执行 (20 × 26 = 520) 个字母检查。 在 (n) 个测试用例中，除了正常的输入处理之外，最坏的情况是 (520n) 个这样的检查。 这种做法是正确的，因为它直接测试相似度的定义，但重复搜索固定的26个字母键盘是不必要的工作。 

关键的观察是键盘永远不会改变。 每个字母都有固定的行和列，因此我们可以使用字符的字母索引将字符映射到其坐标。 对于具有字母索引的字符`p`，它的行是`p // 9`它的列是`p % 9`。 前两行每行包含九个字母，最后一行包含八个字母。 

当两个字母的行差最多为 1 并且它们的列差最多为 1 时，这两个字母恰好是邻居。 相等也满足该条件，因此算法可以首先确定整个单词是否相同。 如果不相同，我们只需要验证每个位置的邻居条件即可。 

这将每个测试用例的工作量减少到一次单词扫描。 暴力解决方案之所以有效，是因为键盘很小，但无法利用其几何形状固定的事实。 用直接坐标算术代替重复搜索将分类变成简单的线性传递。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | 每个测试用例 O(26L) | O(1) | O(1) | 正确但不必要的重复工作|
 | 最佳| 每个测试用例 O(L) | O(1) | O(1) | 已接受 |

 这里(L)是字长，其中(L \le 20)。 

## 算法演练

 1.读取测试用例的数量，然后读取属于当前测试用例的两个字。 每对的分类都是独立的，因此每个案例都可以单独处理。 
2. 如果两个单词长度不同，则输出`3`。 相似性需要整个单词之间的字符与字符对应，因此不同的长度使得同一性和相似性都变得不可能。 
3. 如果两个单词完全相等，则输出`1`。 此检查必须在相似性测试之前进行，因为相同的单词还满足相应字母相等或相邻的较弱条件。 
4. 否则，扫描同一位置的两个单词。 将每个字符转换为其从零开始的字母表索引`ord(ch) - ord('a')`。 根据该索引，计算其键盘行和列。 
5. 对于每个对应的对，检查绝对行差异是否至多为 1，以及绝对列差异是否至多为 1。 如果任一差值超过 1，则该对包含非相邻位置，因此输出`3`立即地。 
6. 如果整个扫描完成没有发现坏位置，则输出`2`。 已知单词是不同的，并且每个对应对都是相等或相邻的，这正是相似性的定义。 

### 为什么它有效

 字符扫描期间的不变性是到目前为止处理的每个位置都包含相同的字母或两个相邻的键盘按键。 如果某个位置违反了此属性，则单词不能相似，因此返回`3`是正确的。 如果每个位置都满足该性质，则单词具有相等的长度并且通过完全相似条件。 由于首先检查单词是否相等，因此它们不相同，因此正确的结果是`2`。 因此，三种可能的输出被区分而没有重叠。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def position(ch):
    p = ord(ch) - ord('a')
    return p // 9, p % 9

def solve():
    t = int(input())
    ans = []

    for _ in range(t):
        a, b = input().split()

        if len(a) != len(b):
            ans.append("3")
            continue

        if a == b:
            ans.append("1")
            continue

        similar = True

        for x, y in zip(a, b):
            rx, cx = position(x)
            ry, cy = position(y)

            if abs(rx - ry) > 1 or abs(cx - cy) > 1:
                similar = False
                break

        ans.append("2" if similar else "3")

    sys.stdout.write("\n".join(ans))

if __name__ == "__main__":
    solve()
```这`position`函数将字母表索引转换为键盘坐标。 划分由`9`是正确的，因为前两行每行包含九个字母：`a`通过`i`， 然后`j`通过`r`。 剩下的字母`s`通过`z`形成最后一排。 

长度检查首先是因为`zip(a, b)`否则会停在较短的单词上并默默地忽略额外的字符。 这对于诸如以下的输入是不正确的`ab`和`abc`。 

相等性检查发生在邻居扫描之前，因为相等性是更强的分类。 没有它，一对诸如`cool`和`cool`将满足邻居条件并可能错误地接收输出`2`。 

邻居测试使用`abs(row_difference) <= 1`和`abs(column_difference) <= 1`。 这包括水平、垂直和对角邻居。 它也包含相同的键，尽管相等的情况已经被单独处理。 

不存在整数溢出问题，因为所有坐标都在 0 到 8 之间，而且 Python 整数无论如何都是无界的。 早期的`break`也很有用，因为一个无效的位置足以证明单词是不同的而不是相似的。 

## 工作示例

 由于当前的 Codeforces 页面未公开正式的示例块，因此以下跟踪使用原始竞赛声明中的示例和其他小案例。 原始声明明确给出了`aaaaa`相对`abkja`,`moon`相对`done`， 和`knq`相对`bxz`作为类似的例子。 

### 示例 1

 输入：```
1
moon done
```这两个词的长度相等并且不相同。 它们对应的字母检查如下。 

| 位置 | 第一 | 第二 | 第一个坐标| 第二个坐标| 邻居？ |
 | ---| ---| ---| ---| ---| ---|
 | 0 | 米 | d | (1,3) | (0,3) | 是的 |
 | 1 | 哦| 哦| (1,5) | (1,5) | 是的 |
 | 2 | 哦| n | (1,5) | (1,4) | 是的 |
 | 3 | n | 电子| (1,4) | (0,4) | 是的 |

 每个位置都满足邻居条件，因此最终输出为：```
2
```该跟踪说明了为什么垂直和水平邻接都被接受。 它还运用了这样一个事实：在相似性检查期间相同的字母被视为可接受的。 

### 示例 2

 输入：```
1
ab abc
```第一个单词的长度为 2，第二个单词的长度为 3。 

| 步骤| 第一个词 | 第二个词| 状况 | 输出|
 | ---| ---| ---| ---| ---|
 | 1 |`ab`|`abc`| 长度不同 |`3`|

 该算法在比较字符之前停止，因为不同长度的单词不可能相同或相似。 

此示例演示了为什么在使用之前必须进行长度检查`zip`，否则无法匹配`c`将从比较中消失。 

### 示例 3

 输入：```
1
knq bxz
```坐标检查是：

 | 位置 | 第一 | 第二 | 第一个坐标| 第二个坐标| 邻居？ |
 | ---| ---| ---| ---| ---| ---|
 | 0 | k | 乙| (1,1) | (0,1)| 是的 |
 | 1 | n | x| (1,4) | (2,5) | 是的 |
 | 2 | 问 | z | (1,7) | (2,7) | 是的 |

 每对都是相邻的，所以结果是：```
2
```该轨迹明确确认了允许对角线移动。 这对`n`和`x`相差一行和一列，因此它是有效的相邻对。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(nL) | 每个 (n) 测试用例最多扫描 (L \le 20) 个字符对 |
 | 空间| O(n) | 该实现在打印之前存储所有输出字符串 |

 输入的单词非常短，最大长度为20个字符。 该算法仅对每个字符执行恒定量的算术，因此即使是大量测试用例也可以在为竞赛问题指定的 1 秒和 256 MB 限制内轻松处理。 

输出列表使用 O(n) 内存。 它可以立即打印，以将其减少到 O(1) 辅助空间，但缓冲微小的输出字符串更简单，并且仍然在内存限制之内。 

## 测试用例```python
# helper: run solution on input string, return output string
import sys
import io

def position(ch):
    p = ord(ch) - ord('a')
    return p // 9, p % 9

def solve():
    input = sys.stdin.readline

    t = int(input())
    ans = []

    for _ in range(t):
        a, b = input().split()

        if len(a) != len(b):
            ans.append("3")
            continue

        if a == b:
            ans.append("1")
            continue

        similar = True

        for x, y in zip(a, b):
            rx, cx = position(x)
            ry, cy = position(y)

            if abs(rx - ry) > 1 or abs(cx - cy) > 1:
                similar = False
                break

        ans.append("2" if similar else "3")

    sys.stdout.write("\n".join(ans))

def run(inp: str) -> str:
    old_stdin = sys.stdin
    old_stdout = sys.stdout

    sys.stdin = io.StringIO(inp)
    sys.stdout = io.StringIO()

    try:
        solve()
        return sys.stdout.getvalue()
    finally:
        sys.stdin = old_stdin
        sys.stdout = old_stdout

# Examples from the original statement
assert run("1\ncool cool\n") == "1", "identical words"
assert run("1\nmoon done\n") == "2", "similar words"

# Minimum-size input
assert run("3\na a\na b\na c\n") == "1\n2\n3", "single-character cases"

# Maximum word length, identical
assert run("1\n" + "a" * 20 + " " + "a" * 20 + "\n") == "1", \
    "maximum length identical words"

# Diagonal and vertical neighbors
assert run("2\nknq bxz\naaa bkk\n") == "2\n2", \
    "diagonal and multi-position adjacency"

# Different lengths and a non-neighboring pair
assert run("3\nab abc\nab cb\naz za\n") == "3\n3\n3", \
    "length and boundary failures"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`a a`,`a b`,`a c`|`1`,`2`,`3`| 最小尺寸单词和直接邻接边界 |
 | 两个相同的 20 个字符的单词 |`1`| 最大允许字长和相等处理 |
 |`knq bxz`,`aaa bkk`|`2`,`2`| 垂直和对角键盘邻居|
 |`ab abc`,`ab cb`,`az za`|`3`,`3`,`3`| 不同的长度、不相邻的字母和相反的位置 |

 ## 边缘情况

 第一个边缘情况是不同的字长。 考虑：```
1
ab abc
```该算法首先比较长度并看到`2 != 3`。 它立即产生`3`。 不执行字符扫描，因此额外的`c`不能被意外忽略。 

第二个边缘情况是相同的单词：```
1
cool cool
```长度匹配，并且相等测试成功，因此算法产生`1`立即地。 它永远不会达到相似性测试。 This ordering matters because every identical pair also satisfies the weaker requirement that corresponding characters are equal or neighboring.

 第三个边缘情况是对角邻居：```
1
knq bxz
```第一对是`k`在`(1,1)`和`b`在`(0,1)`，它们垂直相邻。 The second pair is`n`在`(1,4)`和`x`在`(2,5)`，它们对角相邻。 第三对是`q`在`(1,7)`和`z`在`(2,7)`，它们垂直相邻。 Every pair passes, so the answer is`2`。 

最后的边缘情况是一对按字母顺序看起来很接近但在几何上不相邻的对：```
1
ab cb
```第一个位置比较`a`在`(0,0)`和`c`在`(0,2)`。 它们的行差为零，但列差为二，因此它们不是邻居。 算法立即中断并输出`3`。 这就是为什么比较字母索引（例如检查它们的数字差异是否最多为 1）将是对键盘布局的错误解释。
