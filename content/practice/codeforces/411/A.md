---
title: "CF 411A - 密码检查"
description: "我们被要求根据四个标准检查密码字符串是否“足够复杂”。 密码是最多 100 个字符的序列，包含大写字母、小写字母、数字和一些特殊字符。"
date: "2026-06-07T02:15:35+07:00"
tags: ["codeforces", "competitive-programming", "*special", "implementation"]
categories: ["algorithms"]
codeforces_contest: 411
codeforces_index: "A"
codeforces_contest_name: "Coder-Strike 2014 - Qualification Round"
rating: 800
weight: 411
solve_time_s: 254
verified: true
draft: false
---

[CF 411A - 密码检查](https://codeforces.com/problemset/problem/411/A)

 **评分：** 800
 **标签：** *特殊、实施
 **求解时间：** 4m 14s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求根据四个标准检查密码字符串是否“足够复杂”。 密码是最多 100 个字符的序列，包含大写字母、小写字母、数字和一些特殊字符。 如果密码长度至少为 5 个字符，且至少包含 1 个大写字母、至少 1 个小写字母和至少 1 个数字，则可接受。 

输入由一行密码组成。 输出是一条消息：如果密码满足所有要求，则为“正确”，否则为“太弱”。 

限制非常小。 最多 100 个字符意味着我们可以多次单独检查每个字符，而不必担心性能。 这排除了对优化亚线性扫描的任何担忧。 

微妙之处在于仔细检查所有四个条件。 仅检查长度或仅检查字母而不考虑数字的简单方法可能会产生错误的结果。 例如，输入`Abc!`太短了，尽管它同时包含大小写和特殊字符。 输入`abcdef`很长并且包含小写字母，但是缺少大写字母和数字，所以应该被拒绝。 这表明部分符合是不够的，必须验证所有四个条件。 

## 方法

 蛮力方法很简单：我们独立检查每个条件。 首先，我们测量密码长度。 接下来，我们扫描字符串，看看它是否包含至少一个大写字母、至少一个小写字母和至少一个数字。 这可以通过对字符串进行四次单独的扫描来完成，或者通过一次跟踪所有四个标志来完成。 由于密码长度上限为 100，因此四次扫描最多执行 400 个字符检查，可以忽略不计。 

简化实施的关键见解是我们可以在一次传递中检查所有字符类型要求。 我们维护三个布尔标志，一个用于大写字母，一个用于小写字母，一个用于数字。 当我们迭代字符串时，我们会相应地更新这些标志。 如果所有标志在传递结束时均已设置并且长度足够，则密码有效。 这避免了多次迭代并且在概念上更简单。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | ---| ---| ---| ---|
 | 蛮力（多次通过）| O(n) | O(1) | O(1) | 已接受 |
 | 最佳（单程）| O(n) | O(1) | O(1) | 已接受 |

 ## 算法演练

 1. 读取密码字符串。 首先要检查的是长度。 如果少于 5 个字符，则立即返回“太弱”，因为没有进一步的检查可以使密码有效。 
2. 初始化三个布尔变量：`has_upper`,`has_lower`， 和`has_digit`。 这些将跟踪密码是否至少包含每种所需类型的一个字符。 
3. 迭代密码的每个字符。 如果字符是大写字母，则设置`has_upper`到`True`。 如果是小写字母，则设置`has_lower`到`True`。 如果是数字则设置`has_digit`到`True`。 
4. 循环结束后，检查所有四个条件：长度、`has_upper`,`has_lower`， 和`has_digit`。 如果都满意，则打印“正确”。 否则，打印“太弱”。 

工作原理：该算法维护三个布尔标志，表示是否存在所需的字符类型。 迭代字符串可确保每个字符只计算一次。 通过将此与长度检查相结合，我们保证不会错误地接受密码，并且正确识别所有有效密码。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

password = input().strip()

if len(password) < 5:
    print("Too weak")
else:
    has_upper = False
    has_lower = False
    has_digit = False
    
    for ch in password:
        if ch.isupper():
            has_upper = True
        elif ch.islower():
            has_lower = True
        elif ch.isdigit():
            has_digit = True
    
    if has_upper and has_lower and has_digit:
        print("Correct")
    else:
        print("Too weak")
```该解决方案首先修剪空白以处理任何意外的前导或尾随空格。 首先检查长度以快速拒绝明显短的密码。 三个标志跟踪字符类型。 使用`isupper()`,`islower()`， 和`isdigit()`避免手动比较字符范围，更安全、更易读。 最后，通过评估单个逻辑表达式中的所有四个条件来确定结果。 

## 工作示例

 **示例输入 1**：`abacaba`| 人物 | 有_上 | 有_下| 有_数字 |
 | ---| ---| ---| ---|
 | 一个 | 假 | 真实| 假 |
 | 乙| 假 | 真实| 假 |
 | 一个 | 假 | 真实| 假 |
 | c | 假 | 真实| 假 |
 | 一个 | 假 | 真实| 假 |
 | 乙| 假 | 真实| 假 |
 | 一个 | 假 | 真实| 假 |

 长度 = 7，has_upper = False，has_lower = True，has_digit = False → 输出：太弱

 **自定义输入2**：`A1b2C`| 人物 | 有_上 | 有_下| 有_数字 |
 | ---| ---| ---| ---|
 | 一个 | 真实| 假 | 假 |
 | 1 | 真实| 假 | 真实|
 | 乙| 真实| 真实| 真实|
 | 2 | 真实| 真实| 真实|
 | C | 真实| 真实| 真实|

 长度 = 5，所有标志为 True → 输出：正确

 该表显示该算法通过迭代正确跟踪所有必需的标志，并且仅接受满足所有条件的密码。 

## 复杂度分析

 | 测量 | 复杂性 | 说明|
 | ---| ---| ---|
 | 时间 | O(n) | 单次遍历长度为n(≤100)的字符串|
 | 空间| O(1) | O(1) | 只使用了三个布尔标志，没有额外的结构 |

 时间复杂度是线性的，但由于 n ≤ 100，所以它实际上是常数。 空间使用量可以忽略不计。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    password = input().strip()
    if len(password) < 5:
        print("Too weak")
    else:
        has_upper = has_lower = has_digit = False
        for ch in password:
            if ch.isupper():
                has_upper = True
            elif ch.islower():
                has_lower = True
            elif ch.isdigit():
                has_digit = True
        if has_upper and has_lower and has_digit:
            print("Correct")
        else:
            print("Too weak")
    return output.getvalue().strip()

# Provided sample
assert run("abacaba") == "Too weak", "sample 1"

# Custom cases
assert run("A1b2C") == "Correct", "mixed chars, exact length"
assert run("abc") == "Too weak", "too short"
assert run("ABCDE") == "Too weak", "uppercase only"
assert run("abcde123") == "Too weak", "missing uppercase"
assert run("Ab1!") == "Too weak", "exact 4 chars, fails length"
assert run("Abcdef1") == "Correct", "long enough, meets all"
```| 测试输入| 预期产出 | 它验证了什么 |
 | ---| ---| ---|
 | A1b2C | 正确| 满足所有标准，最小长度 5 |
 | ABC | 太弱了 | 长度短，缺少大写字母和数字 |
 | ABCDE | 太弱了 | 仅大写字母，缺少小写字母和数字 |
 | abcde123 | 太弱了 | 缺少大写 |
 | 抗体1！ | 太弱了 | 长度 < 5 |
 | Abcdef1 | 正确| 更长的密码，满足所有条件 |

 ## 边缘情况

 边缘情况主要涉及边界线长度和字符类型的组合。 为了`Ab1!`，算法首先检查长度，立即拒绝它，而不需要检查字符类型，演示短路评估。 对于像这样的密码`ABCDE`，算法正确跟踪大写字母，但发现小写字母和数字标志仍然为假，确保其输出“太弱”。 这证实了该方法可以处理长度和字符类型边界，而不会出现相差一错误或遗漏条件。
