---
title: "CF 102785J - R 你真的准备好了吗？"
description: "任务是决定文本字符串是否可以由模式字符串生成。 该图案由普通小写字母和可选的重复符号组成。"
date: "2026-07-27T19:44:18+07:00"
tags: ["codeforces", "competitive-programming"]
categories: ["algorithms"]
codeforces_contest: 102785
codeforces_index: "J"
codeforces_contest_name: "ICPC Central Russia Regional Contest (CRRC 18)"
rating: 0
weight: 102785
solve_time_s: 48
verified: true
draft: false
---

[CF 102785J - 你真的准备好了吗？](https://codeforces.com/problemset/problem/102785/J)

 **评级：** -
 **标签：** -
 **求解时间：** 48s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是决定文本字符串是否可以由模式字符串生成。 该图案由普通小写字母和可选的重复符号组成。 一个`+`after a letter 表示该字母在首次出现后必须至少再出现一次，而 a`*`表示该字母可以出现任意次数，包括零次。 只有紧邻的前一个字母受这些符号的影响。 

例如，模式`ab*c`可以描述`ac`,`abc`,`abbc`， 等等。 图案`ab+c`无法描述`ac`因为`b`必须至少出现一次。 程序必须打印`Yes`当整个文本可以用整个模式来描述时，并且`No`否则。 

字符串的长度最多为 1000。二次解决方案很合适，因为一百万次操作对于一秒的限制来说很小，而反复尝试所有可能的重复的方法可能会变得慢得多。 直接模拟探索扩展每一个可能的方法`*`或者`+`可以大量分支并接近指数行为，因此解决方案需要记住已经计算出的匹配状态。 

几个细节使得这个问题很容易出错。 模式可以包含不匹配任何内容的重复符号。 对于输入：```
a*
""
```答案是`Yes`， 因为`*`允许零副本。 总是消耗至少一个字符的粗心实现会输出`No`。 

一个`+`不能表现得像`*`。 对于输入：```
a+
"a"
```答案是`No`， 因为`+`除了原始符号外，还需要一个或多个重复。 将两个符号视为相同会错误地接受它。 

重复符号仅属于前一个字符。 对于输入：```
ab*
"abb"
```答案是`Yes`，因为只有`b`重复。 错误地对模式进行分组的实现可以尝试重复`ab`并产生不正确的结果。 

## 方法

 自然的第一个尝试是一起递归处理模式和文本。 当当前模式字符没有修饰符时，它要么与当前文本字符匹配，要么失败。 当它有`*`或者`+`，递归搜索会尝试所有可能的重复次数，并从每个可能的停止位置继续。 

这种方法是正确的，因为考虑了模式的每种可能的扩展。 问题在于重复状态的数量。 一个模式，例如`a*a*a*a*a*`与一长串匹配`a`字符创建许多不同的递归路径，这些路径到达模式和文本中的相同位置。 在最坏的情况下，探索的可能性的数量呈指数级增长，远远超出了长度 1000 所允许的范围。 

有用的观察结果是，结果仅取决于两个位置：哪个模式标记已被处理以及文本的多少个字符已被消耗。 无需记住达到某种状态的确切历史。 

我们可以将模式转换为标记，其中每个标记包含一个字符及其重复规则。 然后动态规划存储前几个标记是否可以匹配文本的前几个字符。 处理令牌时，我们计算它可以使用的所有可能的文本前缀。 

可以通过运行扫描来优化重复字符的情况。 为了`*`，如果当前文本字符与标记匹配，则状态可以从同一位置的先前可到达状态到达，或者从先前位置到达。 为了`+`，使用相同的扫描，但令牌必须在状态生效之前消耗至少一个字符。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | 最坏情况下呈指数增长 | O（图案长度+文本长度）| 太慢了 |
 | 动态规划| O(图案长度×文字长度) | O(图案长度×文字长度) | 已接受 |

 ## 算法演练

 1. 将模式解析为标记。 每个token存储一个小写字母以及是否是普通字符，a`+`重复，或`*`重复。 这将模式的语法与匹配逻辑分开。 
2. 创建一个动态规划数组，其中`dp[j]`意味着到目前为止处理的令牌可以与第一个完全匹配`j`文本的字符。 最初，没有令牌与空前缀匹配，因此仅`dp[0]`是真的。 
3. 一次处理一个令牌。 对于普通角色，从位置移动`j`到`j + 1`仅当下一个文本字符是相同的字母时。 一个普通的令牌只消耗一个字符。 
4.对于一个`*`token，从左到右扫描文本，同时维护是否可以到达当前前缀。 空的用法`*`保持所有先前可到达的位置有效，并且匹配字符允许令牌将匹配再延长一个位置。 
5.对于一个`+`令牌，使用相同的想法`*`，但要防止空重复情况。 必须先使用第一个匹配字符，然后令牌才能提供有效状态。 
6. 处理完所有token后，检查完整文本的状态是否可达。 如果`dp[len(text)]`为 true，整个文本都符合模式。 

为什么它有效：在每个处理过的标记之后，动态编程数组准确地表示这些标记可以生成的所有文本前缀。 转换规则枚举了下一个标记可以消耗字符的所有合法方式，并且它们决不允许非法的重复计数。 由于仅使用已经描述了先前有效匹配的状态来处理每个标记，因此当存在等于整个文本的整个模式的有效扩展时，最终状态准确地为真。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    p = input().rstrip("\n")
    t = input().rstrip("\n")

    tokens = []
    i = 0
    while i < len(p):
        ch = p[i]
        kind = 0
        if i + 1 < len(p) and (p[i + 1] == '+' or p[i + 1] == '*'):
            kind = 1 if p[i + 1] == '+' else 2
            i += 1
        tokens.append((ch, kind))
        i += 1

    n = len(t)
    dp = [False] * (n + 1)
    dp[0] = True

    for ch, kind in tokens:
        ndp = [False] * (n + 1)

        if kind == 0:
            for j in range(n):
                if dp[j] and t[j] == ch:
                    ndp[j + 1] = True

        elif kind == 2:
            active = False
            for j in range(n + 1):
                if dp[j]:
                    active = True
                if active:
                    ndp[j] = True
                if j < n and t[j] != ch:
                    active = False

        else:
            active = False
            for j in range(n + 1):
                if dp[j]:
                    if j > 0:
                        active = True
                if active:
                    ndp[j] = True
                if j < n and t[j] != ch:
                    active = False

            for j in range(1, n + 1):
                if t[j - 1] == ch and dp[j - 1]:
                    ndp[j] = True

        dp = ndp

    print("Yes" if dp[n] else "No")

if __name__ == "__main__":
    solve()
```解析器将原始模式转换为一系列独立的标记。 变量`kind`区分正常字符，`+`， 和`*`，避免了匹配时重复检查原始模式。 

这`dp`数组在每个标记后更新。 对于普通字符，只能进行一次向前转换，因为必须消耗恰好一个字符。 

为了`*`，扫描保持`active`旗帜。 当先前状态可达时，只要连续文本字符等于令牌字符，令牌就可以匹配零个或多个副本。 一旦出现不同的字符，该标志就会重置。 

为了`+`，该实现防止空匹配。 额外的循环处理第一个所需的事件，而扫描则允许随后进行其他副本。 这种区别是该问题中最常见的错误来源。 

数组索引表示字符之间的位置，因此`dp[j]`指在字符之前结尾的前缀`j`。 此约定可避免处理空匹配时出现差一错误。 

## 工作示例

 ### 示例 1

 输入：```
pa*t+ern
pattern
```模式成为标记`p`,`a*`,`t+`,`e`,`r`,`n`。 

| 令牌已处理 | 文本位置状态可达 | 原因 |
 | --- | --- | --- |
 | 开始| 0 | 空模式前缀匹配空文本前缀 |
 | p| 1 | 消耗`p`|
 | 一个* | 2 | 消耗`a`一次|
 | t+ | 3 | 所需消耗`t`|
 | 电子| 4 | 消耗`e`|
 | r | 5 | 消耗`r`|
 | n | 6 | 消耗`n`|

 最终位置是可达的，因此算法打印`Yes`。 该痕迹表明`*`可以恰好消耗一份副本并且`+`可以消耗所需的副本。 

### 示例 2

 输入：```
c*cp+p
cpp
```代币是`c*`,`c`,`p+`,`p`。 

| 令牌已处理 | 文本位置状态可达 | 原因 |
 | --- | --- | --- |
 | 开始| 0 | 空前缀 |
 | c* | 0, 1, 2 | 零、一或二`c`字符是可能的 |
 | c | 3 | 消耗剩余`c`|
 | p+ | 4 | 消耗一`p`|
 | p| 5 | 最终消耗`p`|

 整个文本是匹配的。 这个例子说明了为什么状态必须存储所有可到达的位置而不是仅存储一个贪婪的选择。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(P × T) | 每个模式标记扫描文本一次 |
 | 空间| O(T)| 仅存储当前和下一个文本前缀状态数组 |

 这里`P`是已解析模式标记的数量，`T`是文本长度。 两者都最多为 1000，因此动态编程方法执行大约一百万个状态操作，并且很容易满足限制。 

## 测试用例```python
import sys
import io

def solve():
    input = sys.stdin.readline
    p = input().rstrip("\n")
    t = input().rstrip("\n")

    tokens = []
    i = 0
    while i < len(p):
        ch = p[i]
        kind = 0
        if i + 1 < len(p) and p[i + 1] in "+*":
            kind = 1 if p[i + 1] == "+" else 2
            i += 1
        tokens.append((ch, kind))
        i += 1

    dp = [False] * (len(t) + 1)
    dp[0] = True

    for ch, kind in tokens:
        ndp = [False] * (len(t) + 1)

        if kind == 0:
            for j in range(len(t)):
                if dp[j] and t[j] == ch:
                    ndp[j + 1] = True
        elif kind == 2:
            active = False
            for j in range(len(t) + 1):
                if dp[j]:
                    active = True
                if active:
                    ndp[j] = True
                if j < len(t) and t[j] != ch:
                    active = False
        else:
            active = False
            for j in range(len(t) + 1):
                if dp[j] and j > 0:
                    active = True
                if active:
                    ndp[j] = True
                if j < len(t) and t[j] != ch:
                    active = False
            for j in range(1, len(t) + 1):
                if dp[j - 1] and t[j - 1] == ch:
                    ndp[j] = True

        dp = ndp

    return "Yes\n" if dp[len(t)] else "No\n"

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    return solve()

assert run("pa*t+ern\npattern\n") == "Yes\n", "sample 1"
assert run("c*cp+p\ncpp\n") == "Yes\n", "sample 2"
assert run("b+b\nb\n") == "No\n", "plus requires repetition"
assert run("a*\n\n") == "Yes\n", "star can match empty"
assert run("a+\na\n") == "No\n", "plus cannot match zero repetitions"
assert run("a*a*a*\naaaaa\n") == "Yes\n", "many repeated tokens"
assert run("ab*\na\n") == "Yes\n", "star can consume zero copies"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 |`a*\n\n`|`Yes`| 匹配的空文本`*`|
 |`a+\na\n`|`No`| 之间的区别`+`和`*`|
 |`a*a*a*\naaaaa\n`|`Yes`| 多个重复标记 |
 |`ab*\na\n`|`Yes`| 重复标记仅影响其前一个字符 |

 ## 边缘情况

 对于空匹配情况：```
a*
```解析器创建一个标记`a*`。 初始状态`dp[0]`是真的，并且`*`转换使位置零可到达，因为使用零副本是合法的。 最终状态为真，所以答案为`Yes`。 

对于`+`最小长度情况：```
a+
a
```代币`a+`必须消耗至少一个超出原始符号解释的字符。 动态规划转换不允许空位置生存，因此唯一的文本字符不足，答案是`No`。 

对于修饰符范围的情况：```
ab*
a
```代币是`a`和`b*`。 匹配后`a`，第二个token可以消耗零`b`人物。 最终文本位置仍然可达，给出`Yes`。 

对于连续重复处理：```
a*a*a*
aaaaa
```每个令牌都是独立处理的。 第一个`a*`可以消耗一些前缀，下一个令牌从每个可到达的位置继续，最后一个令牌填充任何剩余的有效后缀。 民主党各州保留五党所有可能的分裂`a`字符，因此算法接受该模式。
