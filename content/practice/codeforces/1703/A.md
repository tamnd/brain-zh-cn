---
title: "CF 1703A - 是还是是？"
description: "我们被要求检查一个三字符字符串是否代表单词“YES”，忽略字母大小写。 每个测试用例都提供一个字符串，我们必须为每个测试用例输出统一的“YES”或“NO”。"
date: "2026-06-09T21:35:19+07:00"
tags: ["codeforces", "competitive-programming", "brute-force", "implementation", "strings"]
categories: ["algorithms"]
codeforces_contest: 1703
codeforces_index: "A"
codeforces_contest_name: "Codeforces Round 806 (Div. 4)"
rating: 800
weight: 1703
solve_time_s: 110
verified: true
draft: false
---

[CF 1703A - 是还是是？](https://codeforces.com/problemset/problem/1703/A)

 **评分：** 800
 **标签：** 暴力破解、实现、字符串
 **求解时间：** 1m 50s
 **已验证：** 是的

 ## 解决方案
 ## 问题理解

 我们被要求检查一个三字符字符串是否代表单词“YES”，忽略字母大小写。 每个测试用例都提供一个字符串，我们必须为每个测试用例输出统一的“YES”或“NO”。 关键是“yEs”、“yes”或“YES”都是有效匹配，因此解决方案必须不区分大小写。 

输入最多可包含 1000 个测试用例。 每个字符串恰好有三个字符，这意味着我们不处理大量输入。 任何以恒定时间处理每个字符串的算法都将在 1 秒的时间限制内高效运行。 内存不是问题，因为我们只需要存储每个测试用例的字符串和一些变量。 

如果有人直接将字符串与“YES”进行比较而不对大小写进行规范化，则会出现不明显的边缘情况。 例如，输入“yEs”会错误地未能通过简单的相等性检查。 同样，如果字符串包含非英文字母或超过三个字符，它也会失败，但这些都超出了规定的限制。 

## 方法

 一种简单的方法是根据大写和小写形式的三个字母“Y”、“E”、“S”单独检查每个字符串字符。 这将涉及每个字符串六次比较。 虽然这种方法可行，但很乏味且容易出错，因为您必须记住所有大小写组合。 

一种更简洁的方法是使用 Python 通过以下方式提供不区分大小写的比较的观察结果：`str.upper()`或者`str.lower()`。 通过将输入字符串转换为大写并将其与“YES”进行比较，我们可以在一次操作中处理所有有效的字母大小写组合。 这将问题减少到每个测试用例一次比较，既可读又快速。 

| 方法| 时间复杂度| 空间复杂度| 判决 |
 | --- | --- | --- | --- |
 | 逐字符大小写检查 | 每个字符串 O(1) | O(1) | O(1) | 已接受，但过于冗长 |
 | 转换为大写并比较 | 每个字符串 O(1) | O(1) | O(1) | 已接受，最干净 |

 ## 算法演练

 1.读取测试用例数量`t`。 我们将精确地迭代`t`字符串，所以我们提前知道循环边界。 
2. 对于每个字符串`s`，使用将其转换为大写`s.upper()`。 这可确保所有小写字母都映射到其对应的大写字母。 
3. 将转换后的字符串与“YES”进行比较。 如果匹配，则输出“YES”； 否则，输出“NO”。 
4. 对所有测试用例重复步骤 2-3。 

为什么有效：将字符串转换为大写可确保字母大小写的所有变体映射到单一规范形式。 将此规范形式与“YES”进行比较可保证正确检测，因为该操作保留了字符的相对顺序。 任何字母或顺序与“YES”不同的字符串都将导致比较失败，从而产生正确的“NO”响应。 

## Python 解决方案```python
import sys
input = sys.stdin.readline

t = int(input())
for _ in range(t):
    s = input().strip()
    if s.upper() == "YES":
        print("YES")
    else:
        print("NO")
```该解决方案首先使用快速 I/O 读取测试用例的数量。 这`.strip()`方法删除所有尾随换行符，这很重要，因为`input()`包括换行符。`s.upper()`在一次调用中将所有字母转换为大写，从而简化比较。 if-else 语句根据比较结果输出所需的字符串。 

## 工作示例

 ### 示例 1：`YES`| 步骤| s | s.upper() | s.upper() | 比较| 输出|
 | --- | --- | --- | --- | --- |
 | 1 | “是”| “是”| “是”==“是”| 是 |

 该字符串已经是大写的，因此它立即匹配。 

### 示例 2：`yEs`| 步骤| s | s.upper() | s.upper() | 比较| 输出|
 | --- | --- | --- | --- | --- |
 | 1 | “是的”| “是”| “是”==“是”| 是 |

 小写字母被转换，规范形式匹配“YES”。 

### 示例 3：`Noo`| 步骤| s | s.upper() | s.upper() | 比较| 输出|
 | --- | --- | --- | --- | --- |
 | 1 | “不”| “不”| “不”！=“是”| 否 |

 规范形式与“YES”不匹配，因此输出为“NO”。 

这些跟踪确认大小写变化和不匹配的字符串均已正确处理。 

## 复杂度分析

 | 测量| 复杂性 | 说明|
 | --- | --- | --- |
 | 时间 | O(t) | 每个测试用例都需要一次字符串转换和比较，均为 O(1)。 对于 t 测试用例，总 O(t)。 |
 | 空间| O(1) | O(1) | 每个测试用例只存储几个变量； 没有额外的记忆规模与t。 |

 当 t ≤ 1000 时，该解决方案的运行时间可以忽略不计，并且使用的内存也最少。 

## 测试用例```python
import sys, io

def run(inp: str) -> str:
    sys.stdin = io.StringIO(inp)
    output = io.StringIO()
    sys.stdout = output
    
    t = int(input())
    for _ in range(t):
        s = input().strip()
        if s.upper() == "YES":
            print("YES")
        else:
            print("NO")
    
    return output.getvalue().strip()

# Provided samples
assert run("10\nYES\nyES\nyes\nYes\nYeS\nNoo\norZ\nyEz\nYas\nXES\n") == "YES\nYES\nYES\nYES\nYES\nNO\nNO\nNO\nNO\nNO", "Sample 1"

# Custom cases
assert run("3\nyes\nYES\nYEs\n") == "YES\nYES\nYES", "All case variations"
assert run("2\nNOO\nyeS\n") == "NO\nYES", "Mixed match and mismatch"
assert run("1\nabc\n") == "NO", "Non-YES string"
assert run("1\nYES\n") == "YES", "Exact match"
assert run("1\nYeS\n") == "YES", "Mixed case match"
```| 测试输入| 预期产出 | 它验证了什么 |
 | --- | --- | --- |
 | "3\是\n是\n是\n" | “是\n是\n是”| 所有字母大小写变体都匹配 |
 | “2\nNOO\nyeS\n”| “否\n是” | 正确区分匹配和不匹配的字符串 |
 | “1\nabc\n”| “不” | 非 YES 字符串被拒绝 |
 | "1\n是\n" | “是”| 精确匹配 |
 | "1\n是\n" | “是”| 混合大小写正确检测 |

 ## 边缘情况

 该算法可以处理所有非明显的情况，因为转换为大写字母可以标准化字母大小写。 对于“是”，`s.upper()`输出“YES”，比较成功。 对于像“Noo”这样的不匹配输入，`s.upper()`产生“NOO”，比较失败。 尾随或前导空格被删除`.strip()`，因此换行符不会出现误报。 所有三字符字符串均在恒定时间内正确评估。
