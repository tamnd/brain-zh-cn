---
title: "CF 1023A - 单通配符模式匹配"
description: "我们得到一个模式字符串 s 和一个目标字符串 t。 该模式看起来几乎像一个普通的小写字母字符串，只是它可能包含一个特殊字符。"
date: "2026-06-16T21:52:32+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1023
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 504 (rated, Div. 1 + Div. 2, based on VK Cup 2018 Final)"
rating: 1200
weight: 1023
solve_time_s: 116
verified: true
draft: false
---

[CF 1023A - 单通配符模式匹配](https://codeforces.com/problemset/problem/1023/A)

 **评分：** 1200
 **标签：** 暴力破解、实现、字符串
 **求解时间：** 1m 56s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们得到了一个模式字符串`s`和一个目标字符串`t`。 该模式看起来几乎像普通的小写字母字符串，只是它可能包含单个特殊字符`*`。 这个通配符很灵活：当我们“实例化”模式时，我们可以替换`*`任何小写字母字符串，包括空字符串。 其他一切都在`s`必须保持不变。 

任务是决定我们是否可以选择一些替代品`*`使得结果字符串完全等于`t`。 

从约束的角度来看，这两个字符串都可能非常大，最多可达 200,000 个字符。 这立即排除了任何试图显式测试许多替代品的方法`*`或构建所有可能的扩展。 任何解决方案都必须在线性时间内检查字符串，并且只对每个字符执行恒定的工作。 

一个微妙的边缘情况来自以下事实：`*`可以完全消失。 如果有人认为它必须贡献至少一个字符，他们就会失败`s = "ab*cd"`和`t = "abcd"`。 

另一个常见的陷阱是忘记`*`可以表示很长的字符串，而不仅仅是一个字符。 例如，如果`s = "a*b"`和`t = "axxxxb"`，中间段可以任意大。 

最后，最危险的情况是`s`没有`*`根本不。 那么答案就是纯粹的相等性检查。 总是试图分裂的幼稚方法`*`不检查其存在性将错误地将整个字符串视为前缀或后缀逻辑。 

## 方法

 强力解释是尝试通配符的所有可能的替代品。 如果`*`出现在位置之间`L`和`R`在`s`，我们会尝试对齐`s`的前缀和后缀`t`并任意填充中间。 但是，可以替换的可能字符串的数量`*`间隙的长度呈指数关系。 即使我们只考虑长度，我们也需要尝试以下所有值`0`最多`m`，并为每个长度重建一个字符串或验证对齐。 在最坏的情况下，这至少会导致二次行为。 

关键的观察结果是通配符是唯一灵活的部分。 左边的所有内容`*`必须匹配前缀`t`，并且右侧的所有内容都必须与后缀匹配`t`。 一旦这些固定部分对齐，剩下的唯一问题是是否`t`有足够的“中间空间”来容纳通配符扩展。 

这将问题简化为围绕通配符拆分两个字符串并检查三个条件：前缀匹配、后缀匹配和长度可行性。 我们没有探索所有替代方案，而是仅验证一种结构约束。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 蛮力 | O(m²) 或更差 | O(米) | 太慢了|
 | 最佳 | O(n + m) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 扫描`s`找到的位置`*`如果存在的话。 如果没有通配符，答案就简化为检查是否`s == t`。 这是必要的，因为没有灵活性，模式就是固定的。 
2.如果`*`存在，分裂`s`分成两个固定部分：前缀`left = s[:i]`和后缀`right = s[i+1:]`。 这些是必须完全匹配的部分`t`。 
3. 检查是否`t`至少与组合的固定部件一样长。 Concretely, we need`len(t) >= len(left) + len(right)`。 如果没有，即使是空的替代品也无法弥补这一差距。 
4. 比较`left`前缀为`t`。 即验证`t[:len(left)] == left`。 这确保通配符不会被用来修改固定结构。 
5. 比较`right`后缀为`t`。 即验证`t[-len(right):] == right`。 这可确保插入通配符扩展后模式尾部正确对齐。 
6. 如果前缀和后缀都匹配且长度条件成立，则通配符可以正好吸收`t`。 否则不能。 

### 为什么它有效

 通配符是唯一的自由来源，它的行为就像插入两个刚性字符串之间的连续段。 任何有效的匹配都必须保留通配符区域之外的字符的确切顺序。 因此，任何解决方案都必须对齐前缀`s`前缀为`t`和后缀`s`后缀为`t`。 一旦满足这些约束条件，剩余部分`t`唯一对应于通配符替换。 不存在其他自由度，因此这些检查既是必要的也是充分的。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

def solve():
    n, m = map(int, input().split())
    s = input().strip()
    t = input().strip()

    if '*' not in s:
        print("YES" if s == t else "NO")
        return

    i = s.index('*')
    left = s[:i]
    right = s[i+1:]

    if len(left) + len(right) > m:
        print("NO")
        return

    if t[:len(left)] != left:
        print("NO")
        return

    if t[m - len(right):] != right:
        print("NO")
        return

    print("YES")

if __name__ == "__main__":
    solve()
```该实现首先处理不存在通配符的退化情况，因为这将问题简化为直接相等检查。 一旦找到通配符，我们就明确地将模式拆分为前缀和后缀部分，并避免触及通配符本身。 

长度检查至关重要，因为它可以防止对短字符串进行无效切片，并强制执行通配符必须覆盖剩余部分的可行性条件`t`。 前缀和后缀比较是使用直接切片完成的，这确保了每个字符验证的 O(1)。 

一个微妙的实现细节是使用`m - len(right)`而不是试图动态推断通配符的落地位置。 这可以避免差一错误，并使后缀对齐与通配符的大小无关。 

## 工作示例

 ### 示例 1

 输入：```
6 10
code*s
codeforces
```| 步骤| 左| 对| 前缀匹配 | 后缀匹配| 有效长度 | 决定|
 | --- | --- | --- | --- | --- | --- | --- |
 | 初始化| “代码”| “s”| - | - | - | - |
 | 检查 | - | - | 代码==代码| s == s | 10 >= 6 | 10 >= 6 是 |

 前缀“code”匹配开头`t`，后缀“s”匹配结尾。 剩下的部分“力”正是取代的`*`。 

### 示例 2

 输入：```
4 4
a*b*
abca
```| 步骤| 左| 对| 前缀匹配 | 后缀匹配| 有效长度 | 决定|
 | --- | --- | --- | --- | --- | --- | --- |
 | 初始化| “一个”| “b*”| - | - | - | - |
 | 检查 | - | - | 一个 == 一个 | b* ≠ ca | 4 >= 2 | 4 >= 2 否 |

 这里后缀比较失败，因为`right = "b*"`被视为固定文本并且必须完全匹配，但事实并非如此。 这表明通配符处理严格是单位置的，并且不允许多个扩展。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(n + m) | 我们扫描`s`一次并比较前缀和后缀`t`使用切片 |
 | 空间| O(1) | O(1) | 仅使用索引和切片； 没有与输入大小成比例的辅助结构 |

 该解决方案完全符合限制，因为每个字符最多检查一次，并且不会发生嵌套处理。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    from collections import deque
    input = sys.stdin.readline

    def solve():
        n, m = map(int, input().split())
        s = input().strip()
        t = input().strip()

        if '*' not in s:
            print("YES" if s == t else "NO")
            return

        i = s.index('*')
        left = s[:i]
        right = s[i+1:]

        if len(left) + len(right) > m:
            print("NO")
            return

        if t[:len(left)] != left:
            print("NO")
            return

        if t[m - len(right):] != right:
            print("NO")
            return

        print("YES")

    solve()
    return sys.stdout.getvalue().strip()

# samples
assert run("6 10\ncode*s\ncodeforces\n") == "YES"

# no wildcard exact match
assert run("3 3\nabc\nabc\n") == "YES"

# no wildcard mismatch
assert run("3 3\nabc\nabd\n") == "NO"

# wildcard empty match
assert run("3 2\nab*\nab\n") == "YES"

# wildcard too short target
assert run("4 2\na*b*\nab\n") == "NO"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | 没有通配符匹配 | 是 | 平等案例|
 | 没有通配符不匹配 | 否 | 严格匹配|
 | 通配符空扩展| 是 | 空更换处理|
 | 长度不够 | 否 | 长度约束强制执行 |

 ## 边缘情况

 一种边缘情况是通配符位于最开头，例如`s = "*abc"`和`t = "zzzabc"`。 算法集`left = ""`并且只检查后缀。 后缀匹配`t[-3:] == "abc"`成功，并且前缀检查完全正确。 

另一种边缘情况是通配符位于末尾，例如`s = "abc*"`和`t = "abcxyz"`。 这里`right = ""`，因此后缀检查会比较一个空字符串，它总是成功，并且只有前缀约束重要。 

最后一个微妙的情况是`s`没有通配符并且长度大于`t`。 该算法立即进入相等检查分支，正确拒绝而不尝试任何切片逻辑，从而防止意外的索引错误。
