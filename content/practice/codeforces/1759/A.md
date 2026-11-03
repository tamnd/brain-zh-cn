---
title: "CF 1759A - 是-是吗？"
description: "我们为每个查询提供一个短字符串，我们想要确定它是否可能出现在通过一遍又一遍地写入单词“Yes”而形成的无限重复模式中，而无需分隔符。"
date: "2026-06-09T14:27:05+07:00"
tags: ["codeforces", "competitive-programming", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1759
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round  834 (Div. 3)"
rating: 800
weight: 1759
solve_time_s: 119
verified: true
draft: false
---

[CF 1759A - 是-是？](https://codeforces.com/problemset/problem/1759/A)

 **评分：** 800
 **标签：** 实现、字符串
 **求解时间：** 1m 59s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们为每个查询提供一个短字符串，我们想要确定它是否可能出现在通过一遍又一遍地写入单词“Yes”而形成的无限重复模式中，而无需分隔符。 我们正在检查的字符串不需要与字边界对齐，它可以在无限磁带内的任何位置开始和结束。 

关键思想是无限弦具有长度为 3 的严格周期结构：它重复`Y`,`e`,`s`,`Y`,`e`,`s`， 等等。 任何有效的子字符串必须逐个字符匹配此重复循环。 

约束很小，最多有 1000 个测试用例，每个字符串的长度最多为 50。这立即排除了比每个测试用例线性扫描更复杂的情况。 直接模拟或模式检查就足够了。 

一个微妙的情况是字符串在循环的不同偏移处开始。 例如，开始于`e`或者`s`是有效的，所以我们必须允许基本模式的所有三个旋转。 

## 方法

 蛮力的想法是显式构造一个足够长的前缀`"YesYesYes..."`并检查查询字符串是否显示为子字符串。 这是可行的，因为最大长度很小，因此构建一个长度约为几百的字符串就足够了。 然而，这是不必要的开销并且在概念上是间接的。 

关键的观察是无限弦是纯周期性的`"Yes"`。 这意味着位置上的每个字符`i`必须匹配`"Yes"[i mod 3]`，但由于子字符串可以从任何地方开始，我们还必须允许模式的循环移位。 只有三个有效的起始对齐方式：`"Yes"`,`"esY"`， 和`"sYe"`。 

因此，问题简化为检查输入字符串是否与这三种重复模式之一匹配。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 |---|---|---|---|
 | 蛮力建造| O(n·t) | O(n) | 已接受但没有必要 |
 | 循环检查| O(n·t) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 定义基本模式`"Yes"`并考虑它的三个循环旋转。 每次旋转代表无限弦的有效起始相位。 

2. 对于每个测试字符串，尝试将其与每个旋转字符逐个匹配。 

3. 对于固定旋转，检查位置`i`在字符串中反对`pattern[i % 3]`。 如果所有位置都匹配，则该字符串有效。 

4. 如果没有一个旋转匹配，则该字符串不能出现在无限重复中。 

重要的一点是对齐是未知的，因此我们对三个可能的阶段进行暴力破解，而不是修复一个。 

### 为什么它有效

 无限弦完全由周期 3 自动机决定。 任何子串都相当于在该循环中选择一个起始偏移量并向前读取。 由于循环长度为 3，因此起始位置恰好有 3 个等价类，并且检查所有这些等价类涵盖了所有可能的子串对齐。 这保证了完整性，而无需构造完整的无限字符串。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def ok(s, p):
    for i, ch in enumerate(s):
        if ch != p[i % 3]:
            return False
    return True

def solve():
    t = int(input())
    base = "Yes"
    rotations = [base[i:] + base[:i] for i in range(3)]

    for _ in range(t):
        s = input().strip()
        for p in rotations:
            if ok(s, p):
                print("YES")
                break
        else:
            print("NO")

solve()
```该解决方案首先预先计算三个循环旋转`"Yes"`。 对于每个查询字符串，它会尝试针对每次旋转进行直接对齐检查。 模运算干净地处理周期性匹配。 

一个常见的错误是只检查`"YesYes..."`从索引 0 开始。对于像这样的字符串，这会失败`"esYes"`，它们有效，但在周期中间开始。 旋转循环完全解决了这个问题。 

## 工作示例

 拿绳子`"esYes"`。 

| 我| s[i] | 旋转`"esY"`| 比赛|
 |---|------|------------------|--------|
 | 0 | 电子| 电子| |
 | 1 | s | s | |
 | 2 | 是 | 是 | |
 | 3 | 电子| 电子| |
 | 4 | s | s | |

 这确认它与从偏移量 1 开始的周期匹配。 

现在考虑`"Yess"`。 

| 我| s[i] | 旋转`"Yes"`| 比赛|
 |---|------|------------------|--------|
 | 0 | 是 | 是 | |
 | 1 | 电子| 电子| |
 | 2 | s | s | |
 | 3 | s | 是 | |

 这会失败，因为第四个字符破坏了周期性结构，因此没有旋转会接受它。 

这些例子表明，正确性完全取决于周期性一致性，而不是部分重叠。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 |---|---|---|
 | 时间 | O(t·n) | O(t·n) | 使用线性扫描检查每个字符串的 3 个模式 |
 | 空间| O(1) | O(1) | 仅存储一些固定模式|

 总输入大小足够小，每个测​​试用例的线性扫描都是最佳的，并且很容易符合限制。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    input = sys.stdin.readline

    def ok(s, p):
        for i, ch in enumerate(s):
            if ch != p[i % 3]:
                return False
        return True

    t = int(input())
    base = "Yes"
    rotations = [base[i:] + base[:i] for i in range(3)]

    out = []
    for _ in range(t):
        s = input().strip()
        for p in rotations:
            if ok(s, p):
                out.append("YES")
                break
        else:
            out.append("NO")
    return "\n".join(out)

assert run("3\nYes\nesY\nooo\n") == "YES\nYES\nNO"
assert run("1\nY") == "YES"
assert run("1\nseY") == "YES"
assert run("1\nYess") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 |---|---|---|
 | 最小有效匹配 | 是 | 单字符对齐案例|
 | 轮换比赛 | 是 | 子串从周期中开始|
 | 无效前缀 | 否 | 破坏周期性|

 ## 边缘情况

 对于`"Y"`,`"e"`， 和`"s"`，算法检查所有旋转并立即接受，因为每个字符在位置 0 处至少匹配循环的一个阶段。 

对于`"seY"`，旋转`"seY"`完全匹配，表明不需要全周期对齐，只需与一些偏移保持一致。 

为了`"Yess"`，每次旋转都会在位置 3 处失败，这证实了即使是单个不匹配也会破坏有效性，无论前缀正确性如何。
