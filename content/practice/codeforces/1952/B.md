---
title: "CF 1952B - 有说明吗？"
description: "我们得到一个字符串列表，每个字符串都由小写英文字母组成，对于每个字符串，我们被要求根据隐藏模式回答“是”或“否”。"
date: "2026-05-31T00:00:00+07:00"
tags: ["codeforces", "competitive-programming", "*special", "strings"]
categories: ["algorithms"]
codeforces_contest: 1952
codeforces_index: "B"
codeforces_contest_name: "April Fools Day Contest 2024"
rating: 0
weight: 1952
solve_time_s: 41
verified: true
draft: false
---

[CF 1952B - 有说明吗？](https://codeforces.com/problemset/problem/1952/B)

 **评级：** -
 **标签：** *特殊、字符串
 **求解时间：** 41s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到一个字符串列表，每个字符串都由小写英文字母组成，对于每个字符串，我们被要求根据隐藏模式回答“是”或“否”。 观察示例输入和输出，字符串“it”、“submit”和“timelimitexceeded”产生“YES”，而其他字符串（如“is”、“stated”或“ac”）产生“NO”。 通过检查这些，模式出现：如果字符串在其中任何位置包含子字符串“it”，则该字符串被标记为“YES”。 缺少此子字符串的所有其他字符串都标记为“NO”。 

输入限制是适度的：最多 100 个字符串，每个字符串的长度最多为 100。这意味着在最坏的情况下总共需要检查 10,000 个字符，因此任何扫描每个字符串一次的解决方案都足够快。 我们可以对每个字符串进行简单的线性扫描。 

不明显的边缘情况包括非常短的字符串或“it”出现在边缘的字符串。 例如，“it”本身应该返回“YES”，而“ti”应该返回“NO”。 此外，字符串可能会多次出现“it”，但至少出现一个就足够了。 

## 方法

 简单的方法是检查每个字符串中长度为 2 的每个可能的子字符串，看看它是否等于“it”。 这是可行的，因为每个两个字符的子字符串都是匹配的候选者，但每次检查都需要扫描几乎整个字符串。 在最坏的情况下，对于长度为 n 的字符串，这是 O(n^2)。 对于我们的限制来说，这仍然是可以接受的，但是没有必要。 

最佳方法是使用 Python 的内置子字符串搜索。 我们可以简单地检查`"it" in s`对于每个字符串`s`。 这与字符串的长度成线性关系，因为子字符串搜索在 Python 中实现得很高效，并且它直接捕获问题的逻辑，而无需构造不必要的子字符串。 暴力检查是正确的，但对于较大的字符串来说速度很慢； 使用 Python 的本机子字符串测试可减少开销，并且干净且可读。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 暴力破解（所有子串）| 每个字符串 O(n^2) | O(1) | O(1) | 已接受但没有必要 |
 | 最佳的 （`"it" in s`) | 每个字符串 O(n) | O(1) | O(1) | 已接受且干净|

 ## 算法演练

 1.读取测试用例数量`t`。 
2. 对于每个字符串`s`在测试用例中：

 1. 检查是否`"it"`是一个子串`s`。 
2. 如果是，则打印“YES”。 
3. 如果否，则打印“NO”。 

关键的见解是问题简化为简单的子字符串检查。 蟒蛇的`in`运算符有效地迭代字符串，并在找到子字符串后立即停止，保证每个字符串的线性时间。 

工作原理：该算法依赖于每个字符串的不变式，如果“it”出现在任何地方，则子字符串检查将恰好检测到一次。 其他字母的存在或不存在并不影响结果。 没有歧义，因为任务完全依赖于这个固定的子串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    s = input().strip()
    if "it" in s:
        print("YES")
    else:
        print("NO")
```代码首先读取测试用例的数量。 每个字符串都会去除尾随换行符，以避免在检查子字符串时出现误报。 子串检查`"it" in s`高效捕获核心逻辑，print语句立即输出结果。 

## 工作示例

 ### 示例 1

 输入字符串：`"it"`| 步骤| s |`"it" in s`| 输出|
 | ---| ---| ---| ---|
 | 1 | “它”| 真实| 是 |

 子字符串完全匹配，输出为“YES”。 

### 示例 2

 输入字符串：`"submit"`| 步骤| s |`"it" in s`| 输出|
 | ---| ---| ---| ---|
 | 1 | “提交”| 真实| 是 |

 子字符串出现在末尾； 该算法仍然可以正确检测到它。 

### 示例 3

 输入字符串：`"is"`| 步骤| s |`"it" in s`| 输出|
 | ---| ---| ---| ---|
 | 1 | “是”| 假 | 否 |

 未找到匹配项，因此输出为“NO”。 

这些痕迹表明该算法正确处理长度为 2 的字符串、在开头、中间或结尾包含“it”的字符串以及不带子字符串的字符串。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(T * n) | 每个T串扫描一次； n 是字符串长度 |
 | 空间| O(1) | O(1) | 仅使用了几个变量； 没有与输入大小成正比的额外数据结构 |

 给定约束条件（T ≤ 100，n ≤ 100），最大操作数约为 10,000 次，完全在 2 秒的时间限制内。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    t = int(input())
    for _ in range(t):
        s = input().strip()
        if "it" in s:
            print("YES")
        else:
            print("NO")
    return output.getvalue().strip()

# Provided sample
assert run("""10
is
it
stated
submit
ac
accepted
wa
wronganswer
tle
timelimitexceeded""") == """NO
YES
NO
YES
NO
NO
NO
NO
NO
YES"""

# Custom: minimum input
assert run("1\ni") == "NO", "single character string"

# Custom: substring at start
assert run("1\nitstart") == "YES", "substring at start"

# Custom: substring at end
assert run("1\nendit") == "YES", "substring at end"

# Custom: substring in middle
assert run("1\nmiddleitmiddle") == "YES", "substring in middle"

# Custom: multiple occurrences
assert run("1\nititisit") == "YES", "multiple occurrences"

# Custom: no occurrence
assert run("1\nxyz") == "NO", "no occurrence"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 |`"i"`| 否 | 单字符串不能包含“it”|
 |`"itstart"`| 是 | 开始处的子字符串 |
 |`"endit"`| 是 | 末尾的子串 |
 |`"middleitmiddle"`| 是 | 中间的子串 |
 |`"ititisit"`| 是 | 多次出现仍得出 YES |
 |`"xyz"`| 否 | 没有子字符串的字符串 |

 ## 边缘情况

 对于`"i"`，算法检查`"it" in "i"`并返回 False，因为字符串太短，产生“NO”。 为了`"itstart"`，子字符串出现在开头，并且`"it" in s`立即检测到它，返回“YES”。 为了`"endit"`，子串在末尾； Python 会进行扫描，直到找到匹配项。 为了`"middleitmiddle"`，中间的子串被正确检测到。 为了`"ititisit"`，只需要一次匹配，即使多次出现，算法也会返回“YES”。 为了`"xyz"`，没有发生匹配，因此算法正确输出“NO”。 所有边缘情况均由子字符串检查直接处理，无需额外逻辑。
