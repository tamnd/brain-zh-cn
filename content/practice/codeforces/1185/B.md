---
title: "CF 1185B - 来自波利卡普的电子邮件"
description: "任务是验证在偶尔重复字母的键盘上按下单词 s 的按键是否可以产生键入的单词 t。 s 中的每个字母在 t 中必须按顺序出现，但可以连续出现一次或多次。"
date: "2026-06-12T00:53:28+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1185
codeforces_index: "B"
codeforces_contest_name: "Codeforces Round 568 (Div. 2)"
rating: 1200
weight: 1185
solve_time_s: 86
verified: true
draft: false
---

[CF 1185B - 来自 Polycarp 的电子邮件](https://codeforces.com/problemset/problem/1185/B)

 **评分：** 1200
 **标签：** 实现、字符串
 **求解时间：** 1m 26s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 任务是验证输入的单词是否`t`可能是由于按下某个单词的键而产生的`s`在偶尔重复字母的键盘上。 中的每个字母`s`必须按顺序出现在`t`，但可能会连续出现一次或多次。 例如，如果`s`是“hello”，则“helloo”或“hheelloo”是有效输出，但“helo”或“hlllloo”不是，因为缺少字母或违反了顺序。 

输入由多个单词对组成，最多 100,000 个，每个单词最多 1,000,000 个字符。 然而，所有的总长度`s`字数加起来不超过 1,000,000，所有字数也同样`t`字。 这意味着我们的解决方案不能具有迭代长度的嵌套循环`s`和`t`在最坏的情况下，这可能会导致最多 10^12 次操作。 每个单词对的线性扫描是可以接受的，因为处理的字符总数最多为 2 * 10^6，这在时间限制内是可行的。 

非明显的边缘情况包括以下情况`t`包含与连续重复不对应的附加字母`s`。 例如，`s = "abc"`和`t = "aabbccx"`应该返回 NO，因为无法生成额外的“x”`s`。 另一个微妙的情况是当`t`例如，完全缺少一个字母`s = "aaa"`和`t = "aa"`。 这里的输出也应该是 NO，因为每个字母`s`必须按顺序至少出现一次。 

## 方法

 一种幼稚的方法会尝试匹配中的每个字符`s`到每一个角色`t`使用嵌套循环。 对于中的每个字符`s`，人们会向前扫描`t`直到找到匹配项，然后重复下一个字符。 这在逻辑上是正确的，但如果`s`长度为 m 且`t`长度为 n，最坏情况复杂度为 O(m * n)。 对于最大字长，这可能约为 10^12 次操作，这太慢了。 

最佳方法的关键洞察是认识到`s`和`t`可以用两个指针同时扫描。 我们保留一个指针`i`在`s`和一个指针`j`在`t`。 什么时候`s[i] == t[j]`，我们移动`i`和`j`向前。 如果`t[j]`等于`t[j-1]`，我们只移动`j`向前，因为可能是重复按键。 与此模式的任何偏差都意味着`t`不能导致`s`。 这将问题简化为线性扫描`t`和`s`，其复杂性与它们的长度之和成正比。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力 | O(m*n) | O(1) | O(1) | 太慢了 |
 | 两指针扫描 | O(m+n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1.初始化两个指针`i`和`j`为零。`i`将穿越`s`和`j`将穿越`t`。 
2. 虽然`j`还没有到达终点`t`:

 a. 如果`i`已经结束了`s`，检查剩余字符是否在`t`都等于`t[j-1]`。 如果不是，则返回NO。 

b. 如果`s[i] == t[j]`，同时移动`i`和`j`向前。 

c. 否则如果`j > 0`和`t[j] == t[j-1]`， 移动`j`向前。 这解释了由于键盘损坏而导致的重复字符。 

d. 否则，返回 NO，因为`t[j]`与当前字符不匹配`s`或任何有效的重复。 
3. 循环结束后，检查是否`i`已经结束了`s`。 如果不是，则返回 NO，因为某些字符`s`没有被使用。 
4. 如果所有检查均通过，则返回 YES。 

为什么它有效：在每一步，`i`和`j`保持之前所有字符的不变性`i`在`s`已按照顺序与之前的字符进行匹配`j`在`t`，允许重复。 如果其中有任何字符`t`违反此模式，算法立即返回“否”。 扫描保证每个字符`s`至少按顺序匹配一次，并且`t`可能有额外的重复字符。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def can_be_typed(s: str, t: str) -> str:
    i, j = 0, 0
    while j < len(t):
        if i < len(s) and s[i] == t[j]:
            i += 1
            j += 1
        elif j > 0 and t[j] == t[j-1]:
            j += 1
        else:
            return "NO"
    return "YES" if i == len(s) else "NO"

n = int(input())
results = []
for _ in range(n):
    s = input().strip()
    t = input().strip()
    results.append(can_be_typed(s, t))

print("\n".join(results))
```功能`can_be_typed`实现上述的两指针扫描。 它小心地处理边界：`i`可能会到达终点`s`尽管`j`仍然在`t`，并在末尾重复字母`t`是允许的。 主循环确保指针永远不会越界，最后检查确认所有`s`被消耗了。 

## 工作示例

 跟踪示例 1：

 | 我| j | s[i] | t[j] | 行动|
 | ---| ---| ---| ---| ---|
 | 0 | 0 | 小时 | 小时 | 匹配，i++，j++ |
 | 1 | 1 | 电子| 电子| 匹配，i++，j++ |
 | 2 | 2 | 我| 我| 匹配，i++，j++ |
 | 3 | 3 | 我| 我| 匹配，i++，j++ |
 | 4 | 4 | 哦| 哦| 匹配，i++，j++ |
 | 5 | 5 | - | - | 结束，是的|

 跟踪第二对“hello”->“helloo”：

 | 我| j | s[i] | t[j] | 行动|
 | ---| ---| ---| ---| ---|
 | 0-4 | 0-4 | h、e、l、l、o | h、e、l、l、o | 比赛|
 | 5 | 5 | - | 哦| t[j] == t[j-1], j++ |
 | 5 | 6 | - | - | 结束，是的|

 这些痕迹表明算法正确处理重复的字符并确认不变量。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(所有 s 的总长度 + 所有 t 的总长度) | 中的每个角色`s`和`t`| 最多被指针访问一次
 | 空间| O(1) 额外 | 仅使用指针和局部变量； 输出列表可以忽略不计 |

 考虑到总长度最多为 10^6，该算法将在时间和内存限制内高效运行。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    n = int(input())
    results = []
    for _ in range(n):
        s = input().strip()
        t = input().strip()
        results.append(can_be_typed(s, t))
    return "\n".join(results)

# Provided samples
assert run("4\nhello\nhello\nhello\nhelloo\nhello\nhlllloo\nhello\nhelo\n") == "YES\nYES\nNO\nNO", "sample 1"

# Custom cases
assert run("1\na\naaa\n") == "YES", "repeated single character"
assert run("1\nabc\naabbcc\n") == "YES", "all repeated in order"
assert run("1\nabc\nacb\n") == "NO", "wrong order"
assert run("1\nabc\nab\n") == "NO", "missing last char"
assert run("1\nx\ny\n") == "NO", "different characters"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | 一个 -> aaa | 是 | 单字符重复|
 | abc -> aabbcc | abc -> aabbcc | abc -> aabbcc | 是 | 多个字母重复|
 | abc -> ab | abc -> abc | 否 | 字母顺序很重要|
 | abc-> ab| 否 | 丢失的字母|
 | x -> y | 否 | 完全不同的角色|

 ## 边缘情况

 对于输入`s = "aaa"`,`t = "aa"`，算法开始于`i = 0, j = 0`。 它匹配第一个“a”，增加两个指针，然后匹配第二个“a”，增加两个指针，并找到`j`结束时`t`尽管`i`仍为 2。`i != len(s)`，它返回 NO，正确识别`t`并没有涵盖所有`s`。 

为了`s = "abc"`和`t = "aabbccx"`，扫描成功匹配'a'，'b'，'c'并且
